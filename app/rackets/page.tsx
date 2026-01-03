// 라켓 검색/필터 페이지
// 필터를 적용하여 라켓을 검색하고 목록으로 표시

import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '라켓 검색',
  description: '다양한 필터를 사용하여 원하는 테니스 라켓을 검색하세요. 스펙, 브랜드, 가격 등으로 필터링할 수 있습니다.',
  openGraph: {
    title: '라켓 검색 | Tennis Racket Finder',
    description: '다양한 필터를 사용하여 원하는 테니스 라켓을 검색하세요.',
    type: 'website',
  },
};
import { get_all_brands } from '@/lib/repositories/brand-repository';
import { get_rackets } from '@/lib/repositories/racket-repository';
import { parse_filters_from_url } from '@/lib/utils/filter-utils';
import type { Racket } from '@/types/racket';
import FilterSidebarClient from '@/components/rackets/filters/FilterSidebarClient';
import FilterChipsClient from '@/components/rackets/FilterChipsClient';
import RacketList from '@/components/rackets/RacketList';
import PaginationClient from '@/components/rackets/PaginationClient';

interface RacketsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * 라켓 검색/필터 페이지
 * 
 * URL Query 파라미터를 파싱하여 필터를 적용하고 라켓 목록을 표시합니다.
 */
export default async function RacketsPage({ searchParams }: RacketsPageProps) {
  // URL SearchParams 생성
  const url_search_params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => url_search_params.append(key, v));
      } else {
        url_search_params.set(key, value);
      }
    }
  });

  // 페이지 번호 파싱
  const page = parseInt(searchParams.page as string) || 1;
  const page_size = 20;

  // 필터 파싱
  const filters = parse_filters_from_url(url_search_params);

  // 브랜드 데이터 페칭
  let brands: any[] = [];
  try {
    brands = await get_all_brands();
  } catch (error) {
    console.error('브랜드 데이터 페칭 오류:', error);
  }

  // 라켓 데이터 페칭
  let rackets_data: { data: Racket[]; count: number } = { data: [], count: 0 };
  let rackets_error: string | null = null;

  try {
    rackets_data = await get_rackets(filters, page, page_size);
  } catch (error: any) {
    console.error('라켓 데이터 페칭 오류:', error);
    rackets_error = error.message || '라켓 데이터를 불러올 수 없습니다.';
  }

  const total_pages = Math.ceil(rackets_data.count / page_size);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            라켓 검색
          </h1>
          <p className="text-gray-600">
            원하는 스펙으로 라켓을 검색하세요.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 필터 사이드바 */}
          <Suspense fallback={<div className="w-64">로딩 중...</div>}>
            <FilterSidebarClient
              brands={brands}
              initial_filters={filters}
            />
          </Suspense>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1">
            {/* 필터 칩 */}
            <FilterChipsClient
              brands={brands}
              initial_filters={filters}
            />

            {/* 결과 개수 */}
            {rackets_data.count > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                총 {rackets_data.count}개의 라켓을 찾았습니다.
                {total_pages > 1 && ` (페이지 ${page} / ${total_pages})`}
              </div>
            )}

            {/* 라켓 목록 */}
            <RacketList
              rackets={rackets_data.data}
              error={rackets_error}
            />

            {/* 페이지네이션 */}
            {total_pages > 1 && (
              <div className="mt-8 flex justify-center">
                <PaginationClient
                  current_page={page}
                  total_pages={total_pages}
                  filters={filters}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
