'use client';

// 리뷰 목록 컴포넌트
// 라켓의 리뷰 목록을 표시하는 컴포넌트

import { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';
import type { Review, ReviewStats } from '@/types/review';

interface ReviewListProps {
  reviews: Review[];
  stats: ReviewStats;
  racket_id: string;
  on_refresh?: () => void;
}

/**
 * ReviewList 컴포넌트
 * 
 * @param reviews - 리뷰 배열
 * @param stats - 리뷰 통계
 * @param racket_id - 라켓 ID
 * @param on_refresh - 리뷰 목록 새로고침 콜백
 */
export default function ReviewList({
  reviews,
  stats,
  racket_id,
  on_refresh,
}: ReviewListProps) {
  const [show_form, set_show_form] = useState(false);

  const handle_success = () => {
    set_show_form(false);
    if (on_refresh) {
      on_refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">리뷰</h2>
          {stats.total_reviews > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.average_rating.toFixed(1)}
                </div>
                <RatingStars rating={stats.average_rating} size="sm" />
                <div className="text-sm text-gray-500 mt-1">
                  {stats.total_reviews}개 리뷰
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {/* 리뷰 작성 폼 */}
        {show_form && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <ReviewForm
              racket_id={racket_id}
              on_success={handle_success}
            />
          </div>
        )}

        {/* 리뷰 작성 버튼 */}
        {!show_form && (
          <div className="mb-6">
            <button
              onClick={() => set_show_form(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + 리뷰 작성하기
            </button>
          </div>
        )}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            아직 리뷰가 없습니다.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
              >
                {/* 리뷰 헤더 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* 사용자 아바타 */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {review.user_profiles?.avatar_url ? (
                        <img
                          src={review.user_profiles.avatar_url}
                          alt={review.user_profiles.display_name || 'User'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {review.user_profiles?.display_name?.[0] ||
                            review.user_profiles?.username?.[0] ||
                            'U'}
                        </span>
                      )}
                    </div>

                    {/* 사용자 정보 */}
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.user_profiles?.display_name ||
                          review.user_profiles?.username ||
                          '익명'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>

                  {/* 평점 */}
                  <RatingStars rating={review.rating} size="sm" />
                </div>

                {/* 리뷰 제목 */}
                {review.title && (
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h3>
                )}

                {/* 리뷰 내용 */}
                <p className="text-gray-700 whitespace-pre-wrap mb-3">
                  {review.content}
                </p>

                {/* 추가 정보 */}
                {(review.play_style ||
                  review.experience_level ||
                  review.usage_duration) && (
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    {review.play_style && (
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {review.play_style}
                      </span>
                    )}
                    {review.experience_level && (
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {review.experience_level}
                      </span>
                    )}
                    {review.usage_duration && (
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        사용 기간: {review.usage_duration}
                      </span>
                    )}
                  </div>
                )}

                {/* 도움됨 버튼 (추후 구현) */}
                {review.helpful_count > 0 && (
                  <div className="mt-3 text-sm text-gray-500">
                    {review.helpful_count}명이 도움이 되었다고 평가했습니다.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

