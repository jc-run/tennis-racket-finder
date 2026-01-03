'use client';

// 브랜드 필터 컴포넌트
// 멀티 선택 가능한 브랜드 필터

import { useState } from 'react';
import type { Brand } from '@/types/brand';

interface BrandFilterProps {
  brands: Brand[];
  selected_brand_ids: string[];
  on_change: (brand_ids: string[]) => void;
}

/**
 * BrandFilter 컴포넌트
 * 
 * @param brands - 브랜드 목록
 * @param selected_brand_ids - 선택된 브랜드 ID 배열
 * @param on_change - 선택 변경 핸들러
 */
export default function BrandFilter({
  brands,
  selected_brand_ids,
  on_change,
}: BrandFilterProps) {
  const [is_open, set_is_open] = useState(true);

  const toggle_brand = (brand_id: string) => {
    if (selected_brand_ids.includes(brand_id)) {
      on_change(selected_brand_ids.filter((id) => id !== brand_id));
    } else {
      on_change([...selected_brand_ids, brand_id]);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => set_is_open(!is_open)}
        className="w-full flex items-center justify-between py-2 text-left font-semibold text-gray-900"
      >
        <span>브랜드</span>
        <svg
          className={`w-5 h-5 transition-transform ${is_open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {is_open && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selected_brand_ids.includes(brand.id)}
                onChange={() => toggle_brand(brand.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{brand.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

