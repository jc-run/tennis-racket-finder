'use client';

// 필터 칩 컴포넌트
// 현재 적용된 필터를 칩 형태로 표시하고 제거할 수 있게 함

import type { RacketFilters } from '@/types/racket';
import type { Brand } from '@/types/brand';

interface FilterChipsProps {
  filters: RacketFilters;
  brands: Brand[];
  on_remove: (key: string) => void;
  on_reset: () => void;
}

/**
 * FilterChips 컴포넌트
 * 
 * @param filters - 현재 필터 상태
 * @param brands - 브랜드 목록 (브랜드 ID를 이름으로 변환)
 * @param on_remove - 필터 제거 핸들러
 * @param on_reset - 모든 필터 초기화 핸들러
 */
export default function FilterChips({
  filters,
  brands,
  on_remove,
  on_reset,
}: FilterChipsProps) {
  const chips: { key: string; label: string }[] = [];

  // 브랜드 필터
  if (filters.brand_ids && filters.brand_ids.length > 0) {
    const brand_names = filters.brand_ids
      .map((id) => brands.find((b) => b.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    chips.push({ key: 'brand_ids', label: `브랜드: ${brand_names}` });
  }

  // 헤드 사이즈
  if (filters.head_size_min !== undefined || filters.head_size_max !== undefined) {
    chips.push({
      key: 'head_size',
      label: `헤드 사이즈: ${filters.head_size_min ?? 'min'} ~ ${filters.head_size_max ?? 'max'} sq.in`,
    });
  }

  // 길이
  if (filters.length_min !== undefined || filters.length_max !== undefined) {
    chips.push({
      key: 'length',
      label: `길이: ${filters.length_min ?? 'min'} ~ ${filters.length_max ?? 'max'} inch`,
    });
  }

  // 무게 언스트렁
  if (filters.weight_unstrung_min !== undefined || filters.weight_unstrung_max !== undefined) {
    chips.push({
      key: 'weight_unstrung',
      label: `무게(언스트렁): ${filters.weight_unstrung_min ?? 'min'} ~ ${filters.weight_unstrung_max ?? 'max'} g`,
    });
  }

  // 무게 스트렁
  if (filters.weight_strung_min !== undefined || filters.weight_strung_max !== undefined) {
    chips.push({
      key: 'weight_strung',
      label: `무게(스트렁): ${filters.weight_strung_min ?? 'min'} ~ ${filters.weight_strung_max ?? 'max'} g`,
    });
  }

  // 밸런스 타입
  if (filters.balance_type && filters.balance_type.length > 0) {
    chips.push({
      key: 'balance_type',
      label: `밸런스 타입: ${filters.balance_type.join(', ')}`,
    });
  }

  // 밸런스 mm
  if (filters.balance_min !== undefined || filters.balance_max !== undefined) {
    chips.push({
      key: 'balance',
      label: `밸런스: ${filters.balance_min ?? 'min'} ~ ${filters.balance_max ?? 'max'} mm`,
    });
  }

  // 스윙웨이트
  if (filters.swingweight_min !== undefined || filters.swingweight_max !== undefined) {
    chips.push({
      key: 'swingweight',
      label: `스윙웨이트: ${filters.swingweight_min ?? 'min'} ~ ${filters.swingweight_max ?? 'max'}`,
    });
  }

  // 스트링 패턴
  if (filters.string_pattern && filters.string_pattern.length > 0) {
    chips.push({
      key: 'string_pattern',
      label: `스트링 패턴: ${filters.string_pattern.join(', ')}`,
    });
  }

  // 텐션
  if (filters.tension_min !== undefined || filters.tension_max !== undefined) {
    chips.push({
      key: 'tension',
      label: `텐션: ${filters.tension_min ?? 'min'} ~ ${filters.tension_max ?? 'max'} lbs`,
    });
  }

  // 빔 두께
  if (filters.beam_min !== undefined || filters.beam_max !== undefined) {
    chips.push({
      key: 'beam',
      label: `빔 두께: ${filters.beam_min ?? 'min'} ~ ${filters.beam_max ?? 'max'} mm`,
    });
  }

  // 강성
  if (filters.stiffness_min !== undefined || filters.stiffness_max !== undefined) {
    chips.push({
      key: 'stiffness',
      label: `강성: ${filters.stiffness_min ?? 'min'} ~ ${filters.stiffness_max ?? 'max'}`,
    });
  }

  // 그립 사이즈
  if (filters.grip_sizes && filters.grip_sizes.length > 0) {
    chips.push({
      key: 'grip_sizes',
      label: `그립 사이즈: ${filters.grip_sizes.join(', ')}`,
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
        >
          {chip.label}
          <button
            onClick={() => on_remove(chip.key)}
            className="ml-2 text-blue-600 hover:text-blue-800"
            aria-label={`${chip.label} 필터 제거`}
          >
            ×
          </button>
        </span>
      ))}
      <button
        onClick={on_reset}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        모두 제거
      </button>
    </div>
  );
}

