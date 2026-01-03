'use client';

// 물음표 라켓 컴포넌트
// 중앙에 표시되는 물음표 라켓, 클릭 시 /rackets로 이동

import Link from 'next/link';
import { useState } from 'react';

/**
 * QuestionRacket 컴포넌트
 * - 중앙에 물음표 라켓 표시
 * - 클릭 시 /rackets 페이지로 이동
 * - 호버 애니메이션
 * - 키보드 접근성 지원
 */
export default function QuestionRacket() {
  const [is_hovered, set_is_hovered] = useState(false);

  return (
    <Link
      href="/rackets"
      className={`
        relative flex flex-col items-center justify-center
        w-48 h-48 md:w-64 md:h-64
        group
        transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 rounded-full
      `}
      onMouseEnter={() => set_is_hovered(true)}
      onMouseLeave={() => set_is_hovered(false)}
      aria-label="라켓 검색 페이지로 이동"
    >
      {/* 물음표 라켓 아이콘 */}
      <div
        className={`
          relative w-full h-full
          flex items-center justify-center
          bg-blue-100 rounded-full
          border-4 border-blue-500
          transition-all duration-300
          ${is_hovered ? 'scale-110 shadow-2xl border-blue-600' : 'shadow-lg'}
        `}
      >
        {/* 물음표 아이콘 */}
        <div className="text-8xl md:text-9xl font-bold text-blue-600 transition-transform duration-300 group-hover:rotate-12">
          ?
        </div>

        {/* 라켓 아이콘 (선택) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg
            className="w-32 h-32 md:w-40 md:h-40 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* 텍스트 라벨 */}
      <div
        className={`
          mt-4 text-center transition-opacity duration-300
          ${is_hovered ? 'opacity-100' : 'opacity-70'}
        `}
      >
        <p className="text-lg md:text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
          라켓 검색하기
        </p>
        <p className="text-sm text-gray-500 mt-1">
          클릭하여 모든 라켓 보기
        </p>
      </div>

      {/* 호버 시 화살표 아이콘 */}
      {is_hovered && (
        <div className="absolute -bottom-8 animate-bounce">
          <svg
            className="w-6 h-6 text-blue-600"
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
        </div>
      )}
    </Link>
  );
}

