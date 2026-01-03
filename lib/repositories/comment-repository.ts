// 댓글 데이터 페칭을 위한 Repository

import { supabase } from '@/lib/supabase/client';
import type { Comment } from '@/types/comment';

/**
 * 사용자 프로필 조회 헬퍼 함수
 */
async function get_user_profile(user_id: string) {
  try {
    const { data: profile_data, error: profile_error } = await supabase
      .from('user_profiles')
      .select('id, username, display_name, avatar_url')
      .eq('id', user_id)
      .single();

    if (!profile_error && profile_data) {
      return profile_data;
    } else if (profile_error && profile_error.code !== 'PGRST116') {
      // PGRST116은 "no rows returned"이므로 무시
      console.warn(`사용자 프로필 조회 경고 (user_id: ${user_id}):`, profile_error);
    }
  } catch (err) {
    console.warn(`사용자 프로필 조회 예외 (user_id: ${user_id}):`, err);
  }
  return null;
}

/**
 * 라켓의 댓글 목록 조회 (대댓글 포함)
 */
export async function get_comments_by_racket_id(
  racket_id: string
): Promise<Comment[]> {
  // 먼저 최상위 댓글 데이터만 조회
  const { data: top_level_comments_data, error: comments_error } = await supabase
    .from('comments')
    .select('*')
    .eq('racket_id', racket_id)
    .eq('is_hidden', false)
    .is('parent_comment_id', null) // 최상위 댓글만
    .order('created_at', { ascending: false });

  if (comments_error) {
    console.error('댓글 조회 오류:', {
      code: comments_error.code,
      message: comments_error.message,
      details: comments_error.details,
      hint: comments_error.hint,
    });
    throw new Error(`댓글 데이터를 불러올 수 없습니다: ${comments_error.message || comments_error.details || '알 수 없는 오류'}`);
  }

  if (!top_level_comments_data || top_level_comments_data.length === 0) {
    return [];
  }

  // 각 댓글의 사용자 프로필과 대댓글 조회
  const comments_with_profiles_and_replies = await Promise.all(
    top_level_comments_data.map(async (comment) => {
      // 사용자 프로필 조회
      const user_profile = comment.user_id ? await get_user_profile(comment.user_id) : null;

      // 대댓글 조회
      const { data: replies_data, error: replies_error } = await supabase
        .from('comments')
        .select('*')
        .eq('parent_comment_id', comment.id)
        .eq('is_hidden', false)
        .order('created_at', { ascending: true });

      let replies: Comment[] = [];
      if (!replies_error && replies_data && replies_data.length > 0) {
        // 각 대댓글의 사용자 프로필 조회
        replies = await Promise.all(
          replies_data.map(async (reply) => {
            const reply_user_profile = reply.user_id ? await get_user_profile(reply.user_id) : null;
            return {
              ...reply,
              user_profiles: reply_user_profile,
            } as Comment;
          })
        );
      }

      return {
        ...comment,
        user_profiles: user_profile,
        replies: replies.length > 0 ? replies : undefined,
      } as Comment;
    })
  );

  return comments_with_profiles_and_replies;
}

