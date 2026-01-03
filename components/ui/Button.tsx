// 재사용 가능한 Button 컴포넌트
// 다양한 스타일과 크기를 지원하는 버튼 컴포넌트

import React from 'react';

// 버튼 스타일 타입
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Button 컴포넌트 Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  is_loading?: boolean;
  children: React.ReactNode;
}

// 스타일 클래스 매핑
const variant_classes: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
  ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const size_classes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Button 컴포넌트
 * 
 * @param variant - 버튼 스타일 (primary, secondary, outline, ghost, danger)
 * @param size - 버튼 크기 (sm, md, lg)
 * @param is_loading - 로딩 상태 여부
 * @param children - 버튼 내용
 * @param disabled - 비활성화 여부
 * @param className - 추가 CSS 클래스
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  is_loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base_classes = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variant_class = variant_classes[variant];
  const size_class = size_classes[size];
  
  const combined_classes = `${base_classes} ${variant_class} ${size_class} ${className}`.trim();

  return (
    <button
      className={combined_classes}
      disabled={disabled || is_loading}
      {...props}
    >
      {is_loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
          처리 중...
        </>
      ) : (
        children
      )}
    </button>
  );
}

