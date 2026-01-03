// 라켓 상세 페이지 로딩 상태
// 라켓 데이터를 불러오는 동안 표시

import { Loading } from '@/components/ui';

/**
 * 라켓 상세 페이지 로딩 컴포넌트
 */
export default function RacketDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="py-12">
          <Loading size="lg" text="라켓 정보를 불러오는 중..." />
        </div>
      </div>
    </div>
  );
}

