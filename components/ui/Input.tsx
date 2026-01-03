// 재사용 가능한 Input 컴포넌트
// 폼 입력 필드를 위한 통일된 스타일의 Input 컴포넌트

import React from 'react';

// Input 컴포넌트 Props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper_text?: string;
}

/**
 * Input 컴포넌트
 * 
 * @param label - 입력 필드 레이블
 * @param error - 에러 메시지
 * @param helper_text - 도움말 텍스트
 * @param className - 추가 CSS 클래스
 */
export default function Input({
  label,
  error,
  helper_text,
  className = '',
  id,
  ...props
}: InputProps) {
  // id가 없으면 name을 id로 사용
  const input_id = id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const base_classes = 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  const error_classes = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
  const combined_classes = `${base_classes} ${error_classes} ${className}`.trim();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={input_id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={input_id}
        className={combined_classes}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${input_id}-error` : helper_text ? `${input_id}-helper` : undefined
        }
        {...props}
      />
      
      {error && (
        <p
          id={`${input_id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helper_text && !error && (
        <p
          id={`${input_id}-helper`}
          className="mt-1 text-sm text-gray-500"
        >
          {helper_text}
        </p>
      )}
    </div>
  );
}

