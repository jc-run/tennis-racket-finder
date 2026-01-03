// 브랜드별 라켓 페이지
// 특정 브랜드의 라켓 목록을 표시하는 페이지

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { get_brand_by_slug } from '@/lib/repositories/brand-repository';
import { get_rackets } from '@/lib/repositories/racket-repository';
import { parse_filters_from_url } from '@/lib/utils/filter-utils';
import BrandHeader from '@/components/brand/BrandHeader';
import FilterSidebarClient from '@/components/rackets/filters/FilterSidebarClient';
import FilterChipsClient from '@/components/rackets/FilterChipsClient';
import RacketList from '@/components/rackets/RacketList';
import PaginationClient from '@/components/rackets/PaginationClient';
import { get_all_brands } from '@/lib/repositories/brand-repository';

interface BrandPageProps {
  params: Promise<{
    brandSlug: string;
  }> | {
    brandSlug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const resolved_params = params instanceof Promise ? await params : params;
  const { brandSlug } = resolved_params;

  try {
    const brand = await get_brand_by_slug(brandSlug);
    if (!brand) {
      return {
        title: '브랜드를 찾을 수 없습니다',
      };
    }

    return {
      title: `${brand.name} 라켓`,
      description: brand.description || `${brand.name} 브랜드의 테니스 라켓을 검색하고 비교하세요.`,
      openGraph: {
        title: `${brand.name} 라켓 | Tennis Racket Finder`,
        description: brand.description || `${brand.name} 브랜드의 테니스 라켓을 검색하고 비교하세요.`,
        type: 'website',
        images: brand.logo_url ? [{ url: brand.logo_url }] : [],
      },
    };
  } catch {
    return {
      title: '브랜드',
    };
  }
}

/**
 * 브랜드별 라켓 페이지
 * 
 * @param params - 브랜드 슬러그
 * @param searchParams - URL 쿼리 파라미터 (필터용)
 */
export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  // Next.js 15에서는 params가 Promise일 수 있음
  const resolved_params = params instanceof Promise ? await params : params;
  const { brandSlug } = resolved_params;

  // brandSlug 유효성 검사
  if (!brandSlug || typeof brandSlug !== 'string') {
    console.error('브랜드 슬러그가 유효하지 않습니다:', brandSlug);
    notFound();
  }

  // 브랜드 데이터 페칭
  let brand = null;
  try {
    brand = await get_brand_by_slug(brandSlug);
  } catch (error) {
    console.error('브랜드 데이터 페칭 오류:', error);
  }

  // 브랜드가 없으면 404
  if (!brand) {
    notFound();
  }

  // URL SearchParams 생성
  const url_search_params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== 'page') {
      if (Array.isArray(value)) {
        value.forEach((v) => url_search_params.append(key, v));
      } else {
        url_search_params.set(key, value);
      }
    }
  });

  // 필터 파싱 (브랜드 ID는 자동으로 추가)
  const filters = parse_filters_from_url(url_search_params);
  filters.brand_ids = [brand.id]; // 해당 브랜드만 필터링

  // 페이지 번호 파싱
  const page = parseInt(searchParams.page as string) || 1;
  const page_size = 20;

  // 브랜드 목록 (필터 사이드바용)
  let brands = [];
  try {
    brands = await get_all_brands();
  } catch (error) {
    console.error('브랜드 목록 페칭 오류:', error);
  }

  // 라켓 데이터 페칭
  let rackets_data = { data: [], count: 0 };
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
        {/* 브랜드 헤더 */}
        <BrandHeader brand={brand} />

        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {brand.name} 라켓
          </h2>
          <p className="text-gray-600">
            {brand.name} 브랜드의 라켓을 검색하세요.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 필터 사이드바 */}
          <FilterSidebarClient
            brands={brands}
            initial_filters={filters}
            base_path={`/brand/${brandSlug}`}
          />

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1">
            {/* 필터 칩 */}
            <FilterChipsClient
              brands={brands}
              initial_filters={filters}
              base_path={`/brand/${brandSlug}`}
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
                  base_path={`/brand/${brandSlug}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
