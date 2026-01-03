// 사용자 프로필 데이터 페칭을 위한 Repository

import { supabase } from '@/lib/supabase/client';
import type { UserProfile } from '@/types/auth';
import type { Review } from '@/types/review';
import type { Comment } from '@/types/comment';

/**
 * 사용자 프로필 조회
 */
export async function get_user_profile_by_id(
  user_id: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user_id)
    .single();

  if (error) {
    // 프로필이 없는 경우 (PGRST116: no rows returned)
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('프로필 조회 오류:', error);
    throw new Error(`프로필 데이터를 불러올 수 없습니다: ${error.message}`);
  }

  return data as UserProfile | null;
}

/**
 * 현재 로그인한 사용자의 프로필 조회
 */
export async function get_current_user_profile(): Promise<UserProfile | null> {
  const { data: { user }, error: auth_error } = await supabase.auth.getUser();

  if (auth_error || !user) {
    return null;
  }

  return get_user_profile_by_id(user.id);
}

/**
 * 사용자가 작성한 리뷰 목록 조회
 */
export async function get_reviews_by_user_id(
  user_id: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ reviews: Review[]; count: number }> {
  // 리뷰 개수 조회
  const { count, error: count_error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)
    .eq('is_hidden', false);

  if (count_error) {
    console.error('리뷰 개수 조회 오류:', count_error);
    throw new Error(`리뷰 개수를 불러올 수 없습니다: ${count_error.message}`);
  }

  // 리뷰 목록 조회
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      rackets (
        id,
        name,
        image_url,
        brands (
          id,
          name,
          slug
        )
      )
    `)
    .eq('user_id', user_id)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('리뷰 조회 오류:', error);
    throw new Error(`리뷰 데이터를 불러올 수 없습니다: ${error.message}`);
  }

  return {
    reviews: (data as Review[]) || [],
    count: count || 0,
  };
}

/**
 * 사용자가 작성한 댓글 목록 조회
 */
export async function get_comments_by_user_id(
  user_id: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ comments: Comment[]; count: number }> {
  // 댓글 개수 조회 (최상위 댓글만)
  const { count, error: count_error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)
    .eq('is_hidden', false)
    .is('parent_comment_id', null);

  if (count_error) {
    console.error('댓글 개수 조회 오류:', count_error);
    throw new Error(`댓글 개수를 불러올 수 없습니다: ${count_error.message}`);
  }

  // 댓글 목록 조회
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      rackets (
        id,
        name,
        image_url,
        brands (
          id,
          name,
          slug
        )
      )
    `)
    .eq('user_id', user_id)
    .eq('is_hidden', false)
    .is('parent_comment_id', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('댓글 조회 오류:', error);
    throw new Error(`댓글 데이터를 불러올 수 없습니다: ${error.message}`);
  }

  return {
    comments: (data as Comment[]) || [],
    count: count || 0,
  };
}

/**
 * 사용자 프로필 업데이트
 */
export async function update_user_profile(
  user_id: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user_id)
    .select()
    .single();

  if (error) {
    console.error('프로필 업데이트 오류:', error);
    throw new Error(`프로필 업데이트에 실패했습니다: ${error.message}`);
  }

  return data as UserProfile;
}

