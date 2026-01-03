// 브랜드 헤더 컴포넌트
// 브랜드 정보를 표시하는 헤더 섹션

import Image from 'next/image';
import type { Brand } from '@/types/brand';

interface BrandHeaderProps {
  brand: Brand;
}

/**
 * BrandHeader 컴포넌트
 * 
 * @param brand - 브랜드 정보
 */
export default function BrandHeader({ brand }: BrandHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* 브랜드 로고 */}
        {brand.logo_url && (
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <Image
              src={brand.logo_url}
              alt={`${brand.name} 로고`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 128px, 160px"
            />
          </div>
        )}

        {/* 브랜드 정보 */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {brand.name}
          </h1>
          
          {brand.description && (
            <p className="text-gray-600 mb-4 max-w-2xl">
              {brand.description}
            </p>
          )}

          {/* 웹사이트 링크 */}
          {brand.website_url && (
            <a
              href={brand.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>공식 웹사이트</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

