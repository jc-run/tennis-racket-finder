// 라켓 상세 정보 컴포넌트
// 라켓의 기본 정보를 표시하는 컴포넌트

import Link from 'next/link';
import type { Racket } from '@/types/racket';

interface RacketDetailProps {
  racket: Racket;
}

/**
 * RacketDetail 컴포넌트
 * 
 * @param racket - 라켓 정보
 */
export default function RacketDetail({ racket }: RacketDetailProps) {
  const brand = racket.brands;
  const brand_url = brand ? `/brand/${brand.slug}` : '#';

  return (
    <div className="space-y-4">
      {/* 브랜드 */}
      {brand && (
        <div>
          <Link
            href={brand_url}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {brand.name}
          </Link>
        </div>
      )}

      {/* 라켓명 */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        {racket.name}
      </h1>

      {/* 모델 연도 */}
      {racket.model_year && (
        <p className="text-lg text-gray-600">
          {racket.model_year}년 모델
        </p>
      )}

      {/* 설명 */}
      {racket.description && (
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {racket.description}
          </p>
        </div>
      )}

      {/* 조회수 */}
      <div className="flex items-center text-sm text-gray-500">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span>조회수: {racket.view_count || 0}</span>
      </div>
    </div>
  );
}

