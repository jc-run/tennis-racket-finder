// 에러 메시지를 표시하는 컴포넌트
// 사용자에게 친화적인 에러 메시지 표시

import React from 'react';

// ErrorMessage 컴포넌트 Props
interface ErrorMessageProps {
  message: string;
  title?: string;
  on_retry?: () => void;
  className?: string;
}

/**
 * ErrorMessage 컴포넌트
 * 
 * @param message - 에러 메시지
 * @param title - 에러 제목 (선택)
 * @param on_retry - 재시도 버튼 클릭 핸들러
 * @param className - 추가 CSS 클래스
 */
export default function ErrorMessage({
  message,
  title = '오류가 발생했습니다',
  on_retry,
  className = '',
}: ErrorMessageProps) {
  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {/* 에러 아이콘 */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* 에러 내용 */}
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            {title}
          </h3>
          <p className="text-sm text-red-700">
            {message}
          </p>

          {/* 재시도 버튼 */}
          {on_retry && (
            <button
              onClick={on_retry}
              className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

