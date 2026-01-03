// 리뷰 수정/삭제 API 라우트

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { get_user_id_from_request } from '@/lib/utils/get-user-from-request';

/**
 * 리뷰 수정 (PUT)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { rating, title, content, play_style, experience_level, usage_duration } = body;

    // 유효성 검사
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: '평점은 1~5 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (content && content.trim().length < 10) {
      return NextResponse.json(
        { error: '리뷰 내용은 최소 10자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트
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

    // 리뷰 소유권 확인
    const { data: review } = await supabase_server
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (review.user_id !== user_id) {
      return NextResponse.json(
        { error: '본인의 리뷰만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 리뷰 수정
    const update_data: any = {};
    if (rating !== undefined) update_data.rating = rating;
    if (title !== undefined) update_data.title = title?.trim() || null;
    if (content !== undefined) update_data.content = content.trim();
    if (play_style !== undefined) update_data.play_style = play_style?.trim() || null;
    if (experience_level !== undefined) update_data.experience_level = experience_level?.trim() || null;
    if (usage_duration !== undefined) update_data.usage_duration = usage_duration?.trim() || null;

    const { data, error } = await supabase_server
      .from('reviews')
      .update(update_data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('리뷰 수정 오류:', error);
      return NextResponse.json(
        { error: '리뷰 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data, message: '리뷰가 수정되었습니다.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('리뷰 수정 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 리뷰 삭제 (DELETE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    const body = await request.json();

    // 리뷰 소유권 확인
    const { data: review } = await supabase_server
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (review.user_id !== user_id) {
      return NextResponse.json(
        { error: '본인의 리뷰만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 리뷰 삭제
    const { error } = await supabase_server
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('리뷰 삭제 오류:', error);
      return NextResponse.json(
        { error: '리뷰 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: '리뷰가 삭제되었습니다.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('리뷰 삭제 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

