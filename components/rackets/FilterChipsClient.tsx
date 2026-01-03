'use client';

// FilterChips 클라이언트 컴포넌트
// 필터 칩에서 필터를 제거할 때 URL을 업데이트

import { useRouter } from 'next/navigation';
import FilterChips from './FilterChips';
import { filters_to_url } from '@/lib/utils/filter-utils';
import type { Brand } from '@/types/brand';
import type { RacketFilters } from '@/types/racket';

interface FilterChipsClientProps {
  brands: Brand[];
  initial_filters: RacketFilters;
  base_path?: string; // 기본 경로 (예: '/rackets' 또는 '/brand/wilson')
}

/**
 * FilterChipsClient 컴포넌트
 * 필터 칩 제거 시 URL을 업데이트
 */
export default function FilterChipsClient({
  brands,
  initial_filters,
  base_path = '/rackets',
}: FilterChipsClientProps) {
  const router = useRouter();

  const handle_remove = (key: string) => {
    const new_filters = { ...initial_filters };

    // 키에 따라 필터 제거
    if (key === 'brand_ids') {
      delete new_filters.brand_ids;
    } else if (key === 'head_size') {
      delete new_filters.head_size_min;
      delete new_filters.head_size_max;
    } else if (key === 'length') {
      delete new_filters.length_min;
      delete new_filters.length_max;
    } else if (key === 'weight_unstrung') {
      delete new_filters.weight_unstrung_min;
      delete new_filters.weight_unstrung_max;
    } else if (key === 'weight_strung') {
      delete new_filters.weight_strung_min;
      delete new_filters.weight_strung_max;
    } else if (key === 'balance_type') {
      delete new_filters.balance_type;
    } else if (key === 'balance') {
      delete new_filters.balance_min;
      delete new_filters.balance_max;
    } else if (key === 'swingweight') {
      delete new_filters.swingweight_min;
      delete new_filters.swingweight_max;
    } else if (key === 'string_pattern') {
      delete new_filters.string_pattern;
    } else if (key === 'tension') {
      delete new_filters.tension_min;
      delete new_filters.tension_max;
    } else if (key === 'beam') {
      delete new_filters.beam_min;
      delete new_filters.beam_max;
    } else if (key === 'stiffness') {
      delete new_filters.stiffness_min;
      delete new_filters.stiffness_max;
    } else if (key === 'grip_sizes') {
      delete new_filters.grip_sizes;
    }

    const params = filters_to_url(new_filters);
    const new_url = params.toString() ? `${base_path}?${params.toString()}` : base_path;
    router.push(new_url);
  };

  const handle_reset = () => {
    router.push(base_path);
  };

  return (
    <FilterChips
      filters={initial_filters}
      brands={brands}
      on_remove={handle_remove}
      on_reset={handle_reset}
    />
  );
}

