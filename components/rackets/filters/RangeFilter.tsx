'use client';

// 범위 필터 컴포넌트
// 최소값과 최대값을 입력받는 범위 필터

import { useState } from 'react';
import Input from '@/components/ui/Input';

interface RangeFilterProps {
  label: string;
  unit?: string;
  min_value?: number;
  max_value?: number;
  default_min?: number;
  default_max?: number;
  on_change: (min: number | undefined, max: number | undefined) => void;
}

/**
 * RangeFilter 컴포넌트
 * 
 * @param label - 필터 레이블
 * @param unit - 단위 (예: 'g', 'mm', 'lbs')
 * @param min_value - 현재 최소값
 * @param max_value - 현재 최대값
 * @param default_min - 기본 최소값
 * @param default_max - 기본 최대값
 * @param on_change - 값 변경 핸들러
 */
export default function RangeFilter({
  label,
  unit = '',
  min_value,
  max_value,
  default_min,
  default_max,
  on_change,
}: RangeFilterProps) {
  const [is_open, set_is_open] = useState(false);
  const [local_min, set_local_min] = useState<string>(
    min_value?.toString() || ''
  );
  const [local_max, set_local_max] = useState<string>(
    max_value?.toString() || ''
  );

  const has_value = min_value !== undefined || max_value !== undefined;

  const handle_min_change = (value: string) => {
    set_local_min(value);
    const num_value = value === '' ? undefined : parseFloat(value);
    on_change(num_value, max_value);
  };

  const handle_max_change = (value: string) => {
    set_local_max(value);
    const num_value = value === '' ? undefined : parseFloat(value);
    on_change(min_value, num_value);
  };

  const handle_reset = () => {
    set_local_min('');
    set_local_max('');
    on_change(undefined, undefined);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => set_is_open(!is_open)}
        className="w-full flex items-center justify-between py-2 text-left font-semibold text-gray-900"
      >
        <span>
          {label}
          {has_value && (
            <span className="ml-2 text-xs text-blue-600 font-normal">
              ({min_value ?? 'min'} ~ {max_value ?? 'max'} {unit})
            </span>
          )}
        </span>
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
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`최소 ${unit ? `(${unit})` : ''}`}
              type="number"
              value={local_min}
              onChange={(e) => handle_min_change(e.target.value)}
              placeholder={default_min?.toString() || '최소값'}
            />
            <Input
              label={`최대 ${unit ? `(${unit})` : ''}`}
              type="number"
              value={local_max}
              onChange={(e) => handle_max_change(e.target.value)}
              placeholder={default_max?.toString() || '최대값'}
            />
          </div>
          {has_value && (
            <button
              onClick={handle_reset}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              초기화
            </button>
          )}
        </div>
      )}
    </div>
  );
}

