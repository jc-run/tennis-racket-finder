// 라켓 카드 컴포넌트
// 라켓 정보를 카드 형태로 표시

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody } from '@/components/ui/Card';
import type { Racket } from '@/types/racket';

interface RacketCardProps {
  racket: Racket;
}

/**
 * RacketCard 컴포넌트
 * 
 * @param racket - 라켓 정보
 */
export default function RacketCard({ racket }: RacketCardProps) {
  const racket_url = `/racket/${racket.id}`;
  const brand_name = racket.brands?.name || 'Unknown';

  return (
    <Link href={racket_url}>
      <Card hover className="h-full">
        <CardBody className="p-4">
          {/* 라켓 이미지 */}
          <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            {racket.image_url ? (
              <Image
                src={racket.image_url}
                alt={racket.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* 라켓 정보 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{brand_name}</span>
              {racket.model_year && (
                <span className="text-xs text-gray-500">{racket.model_year}</span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {racket.name}
            </h3>

            {/* 주요 스펙 요약 */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              {racket.head_size_sqin && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {racket.head_size_sqin} sq.in
                </span>
              )}
              {racket.weight_unstrung_g && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {racket.weight_unstrung_g}g
                </span>
              )}
              {racket.balance_type && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {racket.balance_type}
                </span>
              )}
              {racket.string_pattern && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {racket.string_pattern}
                </span>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

