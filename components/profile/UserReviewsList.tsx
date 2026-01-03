// 사용자가 작성한 리뷰 목록 컴포넌트

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RatingStars } from '@/components/rackets/RatingStars';
import type { Review } from '@/types/review';

interface UserReviewsListProps {
  reviews: Review[];
  total_count: number;
  on_load_more?: () => void;
  has_more?: boolean;
}

export default function UserReviewsList({
  reviews,
  total_count,
  on_load_more,
  has_more = false,
}: UserReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
        <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        내가 작성한 리뷰 ({total_count})
      </h2>

      <div className="space-y-4">
        {reviews.map((review: any) => {
          const racket = review.rackets as any;
          const brand = racket?.brands as any;

          return (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* 라켓 이미지 */}
                {racket?.image_url && (
                  <Link href={`/racket/${racket.id}`} className="flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={racket.image_url}
                        alt={racket.name || '라켓 이미지'}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </Link>
                )}

                {/* 리뷰 내용 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link
                        href={`/racket/${racket?.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {racket?.name || '알 수 없는 라켓'}
                      </Link>
                      {brand && (
                        <Link
                          href={`/brand/${brand.slug}`}
                          className="text-sm text-gray-500 hover:text-blue-600 ml-2"
                        >
                          {brand.name}
                        </Link>
                      )}
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>

                  {review.title && (
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {review.title}
                    </h3>
                  )}

                  <p className="text-gray-700 mb-2 line-clamp-2">
                    {review.content}
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    {review.play_style && (
                      <span>플레이 스타일: {review.play_style}</span>
                    )}
                    {review.experience_level && (
                      <span>경력: {review.experience_level}</span>
                    )}
                    {review.usage_duration && (
                      <span>사용 기간: {review.usage_duration}</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {has_more && on_load_more && (
        <div className="mt-6 text-center">
          <button
            onClick={on_load_more}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}

