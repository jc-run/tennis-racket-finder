// 브랜드 로고 컴포넌트
// 브랜드 로고를 표시하고 클릭 시 해당 브랜드 페이지로 이동

import Link from 'next/link';
import Image from 'next/image';
import type { Brand } from '@/types/brand';

// BrandLogo 컴포넌트 Props
interface BrandLogoProps {
  brand: Brand;
  size?: 'sm' | 'md' | 'lg';
}

// 크기별 클래스 매핑
const size_classes = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-40 h-40',
};

/**
 * BrandLogo 컴포넌트
 * 
 * @param brand - 브랜드 정보
 * @param size - 로고 크기 (sm, md, lg)
 */
export default function BrandLogo({ brand, size = 'md' }: BrandLogoProps) {
  const brand_url = `/brand/${brand.slug}`;
  const size_class = size_classes[size];

  return (
    <Link
      href={brand_url}
      className={`
        group relative flex flex-col items-center justify-center
        ${size_class}
        p-4 rounded-lg
        bg-white border-2 border-gray-200
        hover:border-blue-500 hover:shadow-lg
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        cursor-pointer
      `}
      aria-label={`${brand.name} 브랜드 라켓 보기`}
    >
      {/* 로고 이미지 */}
      {brand.logo_url ? (
        <div className="relative w-full h-full">
          <Image
            src={brand.logo_url}
            alt={`${brand.name} 로고`}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
          />
        </div>
      ) : (
        // 로고가 없을 때 브랜드명 표시
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-700 font-semibold text-center group-hover:text-blue-600 transition-colors">
            {brand.name}
          </span>
        </div>
      )}

      {/* 브랜드명 (호버 시 표시) */}
      <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {brand.name}
        </span>
      </div>
    </Link>
  );
}

