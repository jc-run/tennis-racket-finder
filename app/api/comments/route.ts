// 댓글 API 라우트
// 댓글 작성 및 조회

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { get_user_id_from_request } from '@/lib/utils/get-user-from-request';
import { with_rate_limit } from '@/lib/utils/rate-limit';

/**
 * 댓글 작성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate Limiting 체크
    const rate_limit_result = await with_rate_limit(request, 10, 60); // 1분에 10회 제한
    if (!rate_limit_result.success) {
      return NextResponse.json(
        { error: rate_limit_result.error },
        { status: 429 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { racket_id, content, parent_comment_id } = body;

    // 유효성 검사
    if (!racket_id || !content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (content.trim().length < 2) {
      return NextResponse.json(
        { error: '댓글 내용은 최소 2자 이상이어야 합니다.' },
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

    // Supabase 클라이언트
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabase_key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase_server = createClient(supabase_url, supabase_key);

    // 댓글 작성
    const { data, error } = await supabase_server
      .from('comments')
      .insert({
        racket_id,
        user_id,
        content: content.trim(),
        parent_comment_id: parent_comment_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('댓글 작성 오류:', error);
      return NextResponse.json(
        { error: '댓글 작성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data, message: '댓글이 작성되었습니다.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('댓글 작성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
