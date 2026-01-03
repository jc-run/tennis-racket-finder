// 리뷰 데이터 페칭을 위한 Repository

import { supabase } from '@/lib/supabase/client';
import type { Review, ReviewStats } from '@/types/review';

/**
 * 라켓의 리뷰 목록 조회
 */
export async function get_reviews_by_racket_id(
  racket_id: string
): Promise<Review[]> {
  // 먼저 리뷰 데이터만 조회
  const { data: reviews_data, error: reviews_error } = await supabase
    .from('reviews')
    .select('*')
    .eq('racket_id', racket_id)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  if (reviews_error) {
    console.error('리뷰 조회 오류:', {
      code: reviews_error.code,
      message: reviews_error.message,
      details: reviews_error.details,
      hint: reviews_error.hint,
    });
    throw new Error(`리뷰 데이터를 불러올 수 없습니다: ${reviews_error.message || reviews_error.details || '알 수 없는 오류'}`);
  }

  if (!reviews_data || reviews_data.length === 0) {
    return [];
  }

  // 각 리뷰의 사용자 프로필 정보를 별도로 조회 (에러가 나도 계속 진행)
  const reviews_with_profiles = await Promise.all(
    reviews_data.map(async (review) => {
      let user_profile = null;
      
      if (review.user_id) {
        try {
          const { data: profile_data, error: profile_error } = await supabase
            .from('user_profiles')
            .select('id, username, display_name, avatar_url')
            .eq('id', review.user_id)
            .single();

          if (!profile_error && profile_data) {
            user_profile = profile_data;
          } else if (profile_error && profile_error.code !== 'PGRST116') {
            // PGRST116은 "no rows returned"이므로 무시
            console.warn(`사용자 프로필 조회 경고 (user_id: ${review.user_id}):`, profile_error);
          }
        } catch (err) {
          console.warn(`사용자 프로필 조회 예외 (user_id: ${review.user_id}):`, err);
        }
      }

      return {
        ...review,
        user_profiles: user_profile,
      } as Review;
    })
  );

  return reviews_with_profiles;
}

/**
 * 라켓의 리뷰 통계 조회
 */
export async function get_review_stats_by_racket_id(
  racket_id: string
): Promise<ReviewStats> {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('racket_id', racket_id)
    .eq('is_hidden', false);

  if (error) {
    console.error('리뷰 통계 조회 오류:', error);
    throw new Error(`리뷰 통계를 불러올 수 없습니다: ${error.message}`);
  }

  const reviews = (data as { rating: number }[]) || [];
  const total_reviews = reviews.length;

  if (total_reviews === 0) {
    return {
      average_rating: 0,
      total_reviews: 0,
      rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const sum_rating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average_rating = sum_rating / total_reviews;

  const rating_distribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return {
    average_rating: Math.round(average_rating * 10) / 10, // 소수점 1자리
    total_reviews,
    rating_distribution,
  };
}

