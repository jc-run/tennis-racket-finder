'use client';

// 모달 다이얼로그 컴포넌트
// 팝업 형태의 모달 창을 표시하는 컴포넌트

import React, { useEffect } from 'react';

// Modal 컴포넌트 Props
interface ModalProps {
  is_open: boolean;
  on_close: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  show_close_button?: boolean;
}

// 크기별 클래스 매핑
const size_classes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Modal 컴포넌트
 * 
 * @param is_open - 모달 열림 여부
 * @param on_close - 모달 닫기 핸들러
 * @param title - 모달 제목
 * @param children - 모달 내용
 * @param size - 모달 크기 (sm, md, lg, xl)
 * @param show_close_button - 닫기 버튼 표시 여부
 */
export default function Modal({
  is_open,
  on_close,
  title,
  children,
  size = 'md',
  show_close_button = true,
}: ModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handle_escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && is_open) {
        on_close();
      }
    };

    if (is_open) {
      document.addEventListener('keydown', handle_escape);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handle_escape);
      document.body.style.overflow = 'unset';
    };
  }, [is_open, on_close]);

  if (!is_open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={(e) => {
        // 배경 클릭 시 모달 닫기
        if (e.target === e.currentTarget) {
          on_close();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${size_classes[size]} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || show_close_button) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {show_close_button && (
              <button
                onClick={on_close}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="모달 닫기"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 내용 */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

