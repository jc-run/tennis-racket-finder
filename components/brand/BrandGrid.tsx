// 브랜드 그리드 컴포넌트
// 여러 브랜드 로고를 그리드 형태로 표시

import BrandLogo from './BrandLogo';
import type { Brand } from '@/types/brand';
import { Loading, ErrorMessage } from '@/components/ui';

// BrandGrid 컴포넌트 Props
interface BrandGridProps {
  brands: Brand[];
  is_loading?: boolean;
  error?: string | null;
}

/**
 * BrandGrid 컴포넌트
 * 
 * @param brands - 브랜드 배열
 * @param is_loading - 로딩 상태
 * @param error - 에러 메시지
 */
export default function BrandGrid({
  brands,
  is_loading = false,
  error = null,
}: BrandGridProps) {
  // 로딩 상태
  if (is_loading) {
    return (
      <div className="py-12">
        <Loading size="lg" text="브랜드를 불러오는 중..." />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage
          title="브랜드 데이터를 불러올 수 없습니다"
          message={error}
        />
      </div>
    );
  }

  // 브랜드가 없을 때
  if (!brands || brands.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 text-lg">
          표시할 브랜드가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {brands.map((brand) => (
          <BrandLogo key={brand.id} brand={brand} size="md" />
        ))}
      </div>
    </div>
  );
}

