'use client';

// 필터 사이드바 컴포넌트
// 모든 필터를 모아서 표시하는 사이드바

import { useState } from 'react';
import BrandFilter from './BrandFilter';
import RangeFilter from './RangeFilter';
import SelectFilter from './SelectFilter';
import Button from '@/components/ui/Button';
import type { Brand } from '@/types/brand';
import type { RacketFilters } from '@/types/racket';

interface FilterSidebarProps {
  brands: Brand[];
  filters: RacketFilters;
  on_filters_change: (filters: RacketFilters) => void;
  on_reset: () => void;
}

/**
 * FilterSidebar 컴포넌트
 * 
 * @param brands - 브랜드 목록
 * @param filters - 현재 필터 상태
 * @param on_filters_change - 필터 변경 핸들러
 * @param on_reset - 필터 초기화 핸들러
 */
export default function FilterSidebar({
  brands,
  filters,
  on_filters_change,
  on_reset,
}: FilterSidebarProps) {
  const has_active_filters = Object.keys(filters).length > 0;

  // 밸런스 타입 옵션
  const balance_type_options = [
    { value: 'Head light', label: 'Head light' },
    { value: 'Even', label: 'Even' },
    { value: 'Head heavy', label: 'Head heavy' },
  ];

  // 스트링 패턴 옵션 (일반적인 패턴)
  const string_pattern_options = [
    { value: '16x19', label: '16x19' },
    { value: '18x20', label: '18x20' },
    { value: '16x18', label: '16x18' },
    { value: '16x20', label: '16x20' },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-80 bg-white border-r border-gray-200 p-4 md:p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">필터</h2>
        {has_active_filters && (
          <button
            onClick={on_reset}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            초기화
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 브랜드 필터 */}
        <BrandFilter
          brands={brands}
          selected_brand_ids={filters.brand_ids || []}
          on_change={(brand_ids) =>
            on_filters_change({ ...filters, brand_ids })
          }
        />

        {/* 헤드 사이즈 필터 */}
        <RangeFilter
          label="헤드 사이즈"
          unit="sq.in"
          min_value={filters.head_size_min}
          max_value={filters.head_size_max}
          on_change={(min, max) =>
            on_filters_change({ ...filters, head_size_min: min, head_size_max: max })
          }
        />

        {/* 길이 필터 */}
        <RangeFilter
          label="라켓 길이"
          unit="inch"
          min_value={filters.length_min}
          max_value={filters.length_max}
          on_change={(min, max) =>
            on_filters_change({ ...filters, length_min: min, length_max: max })
          }
        />

        {/* 무게 언스트렁 필터 */}
        <RangeFilter
          label="무게 (언스트렁)"
          unit="g"
          min_value={filters.weight_unstrung_min}
          max_value={filters.weight_unstrung_max}
          on_change={(min, max) =>
            on_filters_change({
              ...filters,
              weight_unstrung_min: min,
              weight_unstrung_max: max,
            })
          }
        />

        {/* 무게 스트렁 필터 */}
        <RangeFilter
          label="무게 (스트렁)"
          unit="g"
          min_value={filters.weight_strung_min}
          max_value={filters.weight_strung_max}
          on_change={(min, max) =>
            on_filters_change({
              ...filters,
              weight_strung_min: min,
              weight_strung_max: max,
            })
          }
        />

        {/* 밸런스 타입 필터 */}
        <SelectFilter
          label="밸런스 타입"
          options={balance_type_options}
          selected_values={filters.balance_type || []}
          on_change={(values) =>
            on_filters_change({
              ...filters,
              balance_type: values as ('Head light' | 'Even' | 'Head heavy')[],
            })
          }
        />

        {/* 밸런스 mm 필터 */}
        <RangeFilter
          label="밸런스"
          unit="mm"
          min_value={filters.balance_min}
          max_value={filters.balance_max}
          on_change={(min, max) =>
            on_filters_change({ ...filters, balance_min: min, balance_max: max })
          }
        />

        {/* 스윙웨이트 필터 */}
        <RangeFilter
          label="스윙웨이트"
          min_value={filters.swingweight_min}
          max_value={filters.swingweight_max}
          on_change={(min, max) =>
            on_filters_change({
              ...filters,
              swingweight_min: min,
              swingweight_max: max,
            })
          }
        />

        {/* 스트링 패턴 필터 */}
        <SelectFilter
          label="스트링 패턴"
          options={string_pattern_options}
          selected_values={filters.string_pattern || []}
          on_change={(values) =>
            on_filters_change({ ...filters, string_pattern: values })
          }
        />

        {/* 텐션 필터 */}
        <RangeFilter
          label="권장 텐션"
          unit="lbs"
          min_value={filters.tension_min}
          max_value={filters.tension_max}
          on_change={(min, max) =>
            on_filters_change({ ...filters, tension_min: min, tension_max: max })
          }
        />

        {/* 빔 두께 필터 */}
        <RangeFilter
          label="빔 두께"
          unit="mm"
          min_value={filters.beam_min}
          max_value={filters.beam_max}
          on_change={(min, max) =>
            on_filters_change({ ...filters, beam_min: min, beam_max: max })
          }
        />

        {/* 강성 필터 */}
        <RangeFilter
          label="강성 (RA)"
          min_value={filters.stiffness_min}
          max_value={filters.stiffness_max}
          on_change={(min, max) =>
            on_filters_change({
              ...filters,
              stiffness_min: min,
              stiffness_max: max,
            })
          }
        />
      </div>
    </aside>
  );
}

