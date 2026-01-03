// 라켓 상세 페이지
// 라켓의 상세 정보, 스펙, 리뷰, 댓글을 표시하는 페이지

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { get_racket_by_id, increment_racket_view_count } from '@/lib/repositories/racket-repository';
import { get_reviews_by_racket_id, get_review_stats_by_racket_id } from '@/lib/repositories/review-repository';
import { get_comments_by_racket_id } from '@/lib/repositories/comment-repository';
import RacketImage from '@/components/rackets/RacketImage';
import RacketDetail from '@/components/rackets/RacketDetail';
import RacketSpecs from '@/components/rackets/RacketSpecs';
import ReviewListClient from '@/components/rackets/ReviewListClient';
import CommentListClient from '@/components/rackets/CommentListClient';

interface RacketDetailPageProps {
  params: Promise<{
    id: string;
  }> | {
    id: string;
  };
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: RacketDetailPageProps): Promise<Metadata> {
  const resolved_params = params instanceof Promise ? await params : params;
  const { id } = resolved_params;

  try {
    const racket = await get_racket_by_id(id);
    if (!racket) {
      return {
        title: '라켓을 찾을 수 없습니다',
      };
    }

    const brand_name = racket.brands?.name || '';
    const racket_name = racket.name || '라켓';
    const description = racket.description 
      ? `${racket.description.substring(0, 150)}...`
      : `${brand_name} ${racket_name}의 상세 정보와 사용자 리뷰를 확인하세요.`;

    return {
      title: `${racket_name} | ${brand_name}`,
      description,
      openGraph: {
        title: `${racket_name} | ${brand_name}`,
        description,
        type: 'website',
        images: racket.image_url ? [{ url: racket.image_url }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${racket_name} | ${brand_name}`,
        description,
        images: racket.image_url ? [racket.image_url] : [],
      },
    };
  } catch {
    return {
      title: '라켓 상세',
    };
  }
}

/**
 * 라켓 상세 페이지
 * 
 * @param params - 라켓 ID
 */
export default async function RacketDetailPage({
  params,
}: RacketDetailPageProps) {
  // Next.js 15에서는 params가 Promise일 수 있음
  const resolved_params = params instanceof Promise ? await params : params;
  const { id } = resolved_params;

  // ID 유효성 검사
  if (!id || typeof id !== 'string') {
    console.error('라켓 ID가 유효하지 않습니다:', id);
    notFound();
  }

  // 라켓 데이터 페칭
  let racket = null;
  try {
    racket = await get_racket_by_id(id);
  } catch (error: any) {
    console.error('라켓 데이터 페칭 오류:', {
      message: error?.message,
      stack: error?.stack,
      error: error,
    });
    // 에러가 발생해도 계속 진행 (404로 처리)
  }

  // 라켓이 없으면 404
  if (!racket) {
    notFound();
  }

  // 조회수 증가 (비동기, 에러 무시)
  increment_racket_view_count(id).catch((error) => {
    console.error('조회수 증가 오류:', error);
  });

  // 리뷰 데이터 페칭
  let reviews = [];
  let review_stats = {
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
  try {
    [reviews, review_stats] = await Promise.all([
      get_reviews_by_racket_id(id),
      get_review_stats_by_racket_id(id),
    ]);
  } catch (error) {
    console.error('리뷰 데이터 페칭 오류:', error);
  }

  // 댓글 데이터 페칭
  let comments = [];
  try {
    comments = await get_comments_by_racket_id(id);
  } catch (error) {
    console.error('댓글 데이터 페칭 오류:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 라켓 이미지 */}
          <div>
            <RacketImage racket={racket} />
          </div>

          {/* 라켓 상세 정보 */}
          <div>
            <RacketDetail racket={racket} />
          </div>
        </div>

        {/* 스펙 섹션 */}
        <div className="mb-8">
          <RacketSpecs racket={racket} />
        </div>

        {/* 리뷰 섹션 */}
        <div className="mb-8">
          <ReviewListClient
            reviews={reviews}
            stats={review_stats}
            racket_id={id}
          />
        </div>

        {/* 댓글 섹션 */}
        <div>
          <CommentListClient
            comments={comments}
            racket_id={id}
          />
        </div>
      </div>
    </div>
  );
}
