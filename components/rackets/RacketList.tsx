// 라켓 목록 컴포넌트
// 라켓 카드들을 그리드로 표시

import RacketCard from './RacketCard';
import { Loading, ErrorMessage } from '@/components/ui';
import type { Racket } from '@/types/racket';

interface RacketListProps {
  rackets: Racket[];
  is_loading?: boolean;
  error?: string | null;
}

/**
 * RacketList 컴포넌트
 * 
 * @param rackets - 라켓 배열
 * @param is_loading - 로딩 상태
 * @param error - 에러 메시지
 */
export default function RacketList({
  rackets,
  is_loading = false,
  error = null,
}: RacketListProps) {
  // 로딩 상태
  if (is_loading) {
    return (
      <div className="py-12">
        <Loading size="lg" text="라켓을 불러오는 중..." />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage
          title="라켓 데이터를 불러올 수 없습니다"
          message={error}
        />
      </div>
    );
  }

  // 빈 상태
  if (!rackets || rackets.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-6xl mb-4">🎾</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-600">
          다른 필터 조건을 시도해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {rackets.map((racket) => (
        <RacketCard key={racket.id} racket={racket} />
      ))}
    </div>
  );
}

