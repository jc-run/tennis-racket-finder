// 리뷰 API 라우트
// 리뷰 작성 및 조회

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { get_user_id_from_request } from '@/lib/utils/get-user-from-request';
import { with_rate_limit } from '@/lib/utils/rate-limit';

/**
 * 리뷰 작성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate Limiting 체크
    const rate_limit_result = await with_rate_limit(request, 5, 60); // 1분에 5회 제한
    if (!rate_limit_result.success) {
      return NextResponse.json(
        { error: rate_limit_result.error },
        { status: 429 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { racket_id, rating, title, content, play_style, experience_level, usage_duration } = body;

    // 유효성 검사
    if (!racket_id || !rating || !content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '평점은 1~5 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: '리뷰 내용은 최소 10자 이상이어야 합니다.' },
        { status: 400 }
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

    // Supabase 클라이언트 생성 (서버 사이드)
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabase_key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase_server = createClient(supabase_url, supabase_key);

    // 중복 리뷰 확인
    const { data: existing_review } = await supabase_server
      .from('reviews')
      .select('id')
      .eq('racket_id', racket_id)
      .eq('user_id', user_id)
      .single();

    if (existing_review) {
      return NextResponse.json(
        { error: '이미 리뷰를 작성하셨습니다. 한 라켓당 하나의 리뷰만 작성할 수 있습니다.' },
        { status: 409 }
      );
    }

    // 리뷰 작성
    const { data, error } = await supabase_server
      .from('reviews')
      .insert({
        racket_id,
        user_id,
        rating,
        title: title?.trim() || null,
        content: content.trim(),
        play_style: play_style?.trim() || null,
        experience_level: experience_level?.trim() || null,
        usage_duration: usage_duration?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error('리뷰 작성 오류:', error);
      return NextResponse.json(
        { error: '리뷰 작성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data, message: '리뷰가 작성되었습니다.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('리뷰 작성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
