'use client';

// ReviewList 클라이언트 컴포넌트
// 리뷰 작성 후 목록을 새로고침하는 기능 포함

import { useRouter } from 'next/navigation';
import ReviewList from './ReviewList';
import type { Review, ReviewStats } from '@/types/review';

interface ReviewListClientProps {
  reviews: Review[];
  stats: ReviewStats;
  racket_id: string;
}

/**
 * ReviewListClient 컴포넌트
 * 리뷰 작성 후 페이지를 새로고침하여 최신 리뷰를 표시
 */
export default function ReviewListClient({
  reviews,
  stats,
  racket_id,
}: ReviewListClientProps) {
  const router = useRouter();

  const handle_refresh = () => {
    router.refresh();
  };

  return (
    <ReviewList
      reviews={reviews}
      stats={stats}
      racket_id={racket_id}
      on_refresh={handle_refresh}
    />
  );
}

