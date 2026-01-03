'use client';

// FilterSidebar 클라이언트 컴포넌트
// 필터 상태를 관리하고 URL을 업데이트

import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar from './FilterSidebar';
import { filters_to_url } from '@/lib/utils/filter-utils';
import type { Brand } from '@/types/brand';
import type { RacketFilters } from '@/types/racket';

interface FilterSidebarClientProps {
  brands: Brand[];
  initial_filters: RacketFilters;
  base_path?: string; // 기본 경로 (예: '/rackets' 또는 '/brand/wilson')
}

/**
 * FilterSidebarClient 컴포넌트
 * 필터 변경 시 URL을 업데이트하여 서버 컴포넌트가 다시 렌더링되도록 함
 */
export default function FilterSidebarClient({
  brands,
  initial_filters,
  base_path = '/rackets',
}: FilterSidebarClientProps) {
  const router = useRouter();
  const search_params = useSearchParams();

  const handle_filters_change = (filters: RacketFilters) => {
    const params = filters_to_url(filters);
    const new_url = params.toString() ? `${base_path}?${params.toString()}` : base_path;
    router.push(new_url);
  };

  const handle_reset = () => {
    router.push(base_path);
  };

  return (
    <FilterSidebar
      brands={brands}
      filters={initial_filters}
      on_filters_change={handle_filters_change}
      on_reset={handle_reset}
    />
  );
}

