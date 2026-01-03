// 이미지 업로드 API
// Cloudflare R2에 이미지를 업로드하고 공개 URL을 반환

import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { create_r2_client, get_r2_bucket_name, get_r2_public_url } from '@/lib/cloudflare/r2-client';
import { validate_uploaded_file } from '@/lib/utils/image-validation';
import { optimize_general_image, optimize_profile_image, get_optimized_filename } from '@/lib/utils/image-optimization';
import { get_user_id_from_request } from '@/lib/utils/get-user-from-request';
import { with_rate_limit } from '@/lib/utils/rate-limit';
import { randomUUID } from 'crypto';

/**
 * 이미지 업로드 (POST)
 * 
 * 요청:
 * - FormData 형식으로 'file' 필드에 이미지 파일
 * - 쿼리 파라미터로 type: 'profile' | 'general' (기본값: 'general')
 * 
 * 응답:
 * - { url: string } - 업로드된 이미지의 공개 URL
 */
export async function POST(request: NextRequest) {
  try {
    // Rate Limiting 체크 (1분에 10회 제한)
    const rate_limit_result = await with_rate_limit(request, 10, 60);
    if (!rate_limit_result.success) {
      return NextResponse.json(
        { error: rate_limit_result.error },
        { status: 429 }
      );
    }

    // 인증 확인
    const user_id = await get_user_id_from_request();
    if (!user_id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // FormData 파싱
    const form_data = await request.formData();
    const file = form_data.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 업로드 타입 확인 (쿼리 파라미터 또는 기본값)
    const search_params = request.nextUrl.searchParams;
    const upload_type = search_params.get('type') || 'general'; // 'profile' 또는 'general'

    // 이미지 검증
    const validation_result = await validate_uploaded_file(file);
    if (!validation_result.is_valid) {
      return NextResponse.json(
        { error: validation_result.error || '이미지 검증에 실패했습니다.' },
        { status: 400 }
      );
    }

    // 파일을 버퍼로 변환
    const array_buffer = await file.arrayBuffer();
    const original_buffer = Buffer.from(array_buffer);

    // 이미지 최적화
    let optimized_buffer: Buffer;
    let target_format: 'webp' | 'jpeg' | 'png' = 'webp';

    if (upload_type === 'profile') {
      // 프로필 이미지: 400x400 정사각형으로 최적화
      optimized_buffer = await optimize_profile_image(original_buffer);
    } else {
      // 일반 이미지: 최대 크기 제한, 비율 유지
      optimized_buffer = await optimize_general_image(original_buffer);
    }

    // 파일명 생성 (UUID + 최적화된 확장자)
    const original_filename = file.name;
    const optimized_filename = get_optimized_filename(original_filename, target_format);
    const unique_filename = `${randomUUID()}-${optimized_filename}`;

    // R2 버킷 내 경로 생성
    // 형식: uploads/{type}/{user_id}/{year}/{month}/{filename}
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const file_path = `uploads/${upload_type}/${user_id}/${year}/${month}/${unique_filename}`;

    // R2 클라이언트 생성
    const r2_client = create_r2_client();
    const bucket_name = get_r2_bucket_name();

    // R2에 업로드
    const upload_command = new PutObjectCommand({
      Bucket: bucket_name,
      Key: file_path,
      Body: optimized_buffer,
      ContentType: `image/${target_format}`,
      // 공개 읽기 허용
      // R2 버킷에서 Public Access 설정이 필요함
      CacheControl: 'public, max-age=31536000, immutable', // 1년 캐싱
    });

    await r2_client.send(upload_command);

    // 공개 URL 생성
    const public_url = get_r2_public_url(file_path);

    return NextResponse.json(
      {
        url: public_url,
        path: file_path,
        size: optimized_buffer.length,
        metadata: validation_result.metadata,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('이미지 업로드 오류:', error);

    // R2 연결 오류인 경우
    if (error.message?.includes('R2 환경 변수')) {
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}

