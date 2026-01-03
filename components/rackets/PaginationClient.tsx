'use client';

// 페이지네이션 클라이언트 컴포넌트
// 페이지 이동 시 URL을 업데이트

import { useRouter } from 'next/navigation';
import { filters_to_url } from '@/lib/utils/filter-utils';
import type { RacketFilters } from '@/types/racket';
import Button from '@/components/ui/Button';

interface PaginationClientProps {
  current_page: number;
  total_pages: number;
  filters: RacketFilters;
  base_path?: string; // 기본 경로 (예: '/rackets' 또는 '/brand/wilson')
}

/**
 * PaginationClient 컴포넌트
 * 페이지 이동 시 필터를 유지하면서 URL을 업데이트
 */
export default function PaginationClient({
  current_page,
  total_pages,
  filters,
  base_path = '/rackets',
}: PaginationClientProps) {
  const router = useRouter();

  const go_to_page = (page: number) => {
    const params = filters_to_url(filters);
    params.set('page', page.toString());
    router.push(`${base_path}?${params.toString()}`);
  };

  const get_page_numbers = () => {
    const pages: (number | string)[] = [];
    const max_visible = 7;

    if (total_pages <= max_visible) {
      // 전체 페이지 표시
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // 처음, 끝, 현재 페이지 주변만 표시
      if (current_page <= 3) {
        // 앞부분
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total_pages);
      } else if (current_page >= total_pages - 2) {
        // 뒷부분
        pages.push(1);
        pages.push('...');
        for (let i = total_pages - 3; i <= total_pages; i++) {
          pages.push(i);
        }
      } else {
        // 중간
        pages.push(1);
        pages.push('...');
        for (let i = current_page - 1; i <= current_page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total_pages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center space-x-2">
      {/* 이전 페이지 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => go_to_page(current_page - 1)}
        disabled={current_page === 1}
      >
        이전
      </Button>

      {/* 페이지 번호 */}
      <div className="flex items-center space-x-1">
        {get_page_numbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const page_num = page as number;
          const is_current = page_num === current_page;

          return (
            <button
              key={page_num}
              onClick={() => go_to_page(page_num)}
              className={`
                px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${
                  is_current
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }
              `}
            >
              {page_num}
            </button>
          );
        })}
      </div>

      {/* 다음 페이지 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => go_to_page(current_page + 1)}
        disabled={current_page === total_pages}
      >
        다음
      </Button>
    </nav>
  );
}

