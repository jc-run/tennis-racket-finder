// 랜딩 페이지
// 브랜드 로고 그리드와 중앙 물음표 라켓을 표시하는 메인 페이지

import { get_all_brands } from '@/lib/repositories/brand-repository';
import BrandGrid from '@/components/brand/BrandGrid';
import QuestionRacket from '@/components/landing/QuestionRacket';
import { ErrorMessage } from '@/components/ui';

/**
 * 랜딩 페이지
 * - 브랜드 로고 그리드 표시
 * - 중앙 물음표 라켓 표시
 * - 브랜드 클릭 시 해당 브랜드 페이지로 이동
 * - 물음표 라켓 클릭 시 /rackets로 이동
 */
export default async function HomePage() {
  let brands = [];
  let error: string | null = null;

  // 브랜드 데이터 페칭
  try {
    brands = await get_all_brands();
  } catch (err: any) {
    console.error('브랜드 데이터 페칭 오류:', err);
    error = err.message || '브랜드 데이터를 불러올 수 없습니다.';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* 제목 */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            🎾 Tennis Racket Finder
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            원하는 테니스 라켓을 찾아보세요.
            <br className="hidden md:block" />
            브랜드를 선택하거나 모든 라켓을 검색할 수 있습니다.
          </p>
        </div>

        {/* 중앙 물음표 라켓 */}
        <div className="flex justify-center mb-16 md:mb-20">
          <QuestionRacket />
        </div>

        {/* 브랜드 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            브랜드 선택
          </h2>
          <p className="text-center text-gray-600 mb-8">
            원하는 브랜드를 클릭하여 해당 브랜드의 라켓을 확인하세요.
          </p>

          {/* 브랜드 그리드 */}
          {error ? (
            <ErrorMessage
              title="브랜드 데이터를 불러올 수 없습니다"
              message={error}
            />
          ) : (
            <BrandGrid brands={brands} />
          )}
        </section>

        {/* 추가 정보 섹션 */}
        <section className="mt-16 md:mt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              다양한 필터로 원하는 라켓을 찾아보세요
            </h3>
            <p className="text-gray-600 mb-6">
              무게, 헤드 사이즈, 밸런스 등 다양한 스펙으로 라켓을 검색할 수 있습니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-100 rounded-full">무게</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">헤드 사이즈</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">밸런스</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">스트링 패턴</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">빔 두께</span>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
