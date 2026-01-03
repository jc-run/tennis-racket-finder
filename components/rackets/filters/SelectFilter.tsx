'use client';

// 선택 필터 컴포넌트
// 멀티 선택 가능한 선택 필터

import { useState } from 'react';

interface SelectFilterProps {
  label: string;
  options: { value: string; label: string }[];
  selected_values: string[];
  on_change: (values: string[]) => void;
}

/**
 * SelectFilter 컴포넌트
 * 
 * @param label - 필터 레이블
 * @param options - 선택 옵션 배열
 * @param selected_values - 선택된 값 배열
 * @param on_change - 선택 변경 핸들러
 */
export default function SelectFilter({
  label,
  options,
  selected_values,
  on_change,
}: SelectFilterProps) {
  const [is_open, set_is_open] = useState(false);

  const toggle_value = (value: string) => {
    if (selected_values.includes(value)) {
      on_change(selected_values.filter((v) => v !== value));
    } else {
      on_change([...selected_values, value]);
    }
  };

  const has_value = selected_values.length > 0;

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
              ({selected_values.length}개 선택)
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
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selected_values.includes(option.value)}
                onChange={() => toggle_value(option.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
          {has_value && (
            <button
              onClick={() => on_change([])}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              모두 해제
            </button>
          )}
        </div>
      )}
    </div>
  );
}

