// 로딩 상태를 표시하는 컴포넌트
// 다양한 크기와 스타일의 로딩 스피너 제공

import React from 'react';

// Loading 컴포넌트 Props
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  full_screen?: boolean;
}

// 크기별 클래스 매핑
const size_classes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

/**
 * Loading 컴포넌트
 * 
 * @param size - 스피너 크기 (sm, md, lg)
 * @param text - 로딩 텍스트
 * @param full_screen - 전체 화면 로딩 여부
 */
export default function Loading({
  size = 'md',
  text,
  full_screen = false,
}: LoadingProps) {
  const spinner = (
    <svg
      className={`animate-spin text-blue-600 ${size_classes[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (full_screen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          {spinner}
          {text && <p className="text-gray-700 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-8">
      {spinner}
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
}

