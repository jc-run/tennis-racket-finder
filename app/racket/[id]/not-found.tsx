// 라켓 상세 페이지 404 처리
// 존재하지 않는 라켓 ID 접근 시 표시

import Link from 'next/link';
import Button from '@/components/ui/Button';

/**
 * 라켓 상세 페이지 404 컴포넌트
 */
export default function RacketNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">🎾</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          라켓을 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          요청하신 라켓이 존재하지 않거나 삭제되었습니다.
          <br />
          다른 라켓을 찾아보시거나 홈으로 돌아가세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              홈으로 가기
            </Button>
          </Link>
          <Link href="/rackets">
            <Button variant="outline" size="lg">
              모든 라켓 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

