// 댓글 수정/삭제 API 라우트

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { get_user_id_from_request } from '@/lib/utils/get-user-from-request';

/**
 * 댓글 수정 (PUT)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content } = body;

    // 유효성 검사
    if (!content || content.trim().length < 2) {
      return NextResponse.json(
        { error: '댓글 내용은 최소 2자 이상이어야 합니다.' },
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

    const body = await request.json();

    // 댓글 소유권 확인
    const { data: comment } = await supabase_server
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (comment.user_id !== user_id) {
      return NextResponse.json(
        { error: '본인의 댓글만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 댓글 수정
    const { data, error } = await supabase_server
      .from('comments')
      .update({ content: content.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('댓글 수정 오류:', error);
      return NextResponse.json(
        { error: '댓글 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data, message: '댓글이 수정되었습니다.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('댓글 수정 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 댓글 삭제 (DELETE)
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

    // 댓글 소유권 확인
    const { data: comment } = await supabase_server
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (comment.user_id !== user_id) {
      return NextResponse.json(
        { error: '본인의 댓글만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 댓글 삭제
    const { error } = await supabase_server
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('댓글 삭제 오류:', error);
      return NextResponse.json(
        { error: '댓글 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: '댓글이 삭제되었습니다.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('댓글 삭제 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

