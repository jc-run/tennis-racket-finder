// Footer 컴포넌트
// 사이트 하단 정보를 표시하는 푸터

import Link from 'next/link';

/**
 * Footer 컴포넌트
 * - 저작권 정보
 * - 링크 모음
 * - 소셜 미디어 링크 (선택)
 */
export default function Footer() {
  const current_year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 정보 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              🎾 Tennis Racket Finder
            </h3>
            <p className="text-sm text-gray-400">
              테니스 라켓의 상세 스펙을 검색하고,
              사용자 리뷰와 댓글을 통해 정보를 공유할 수 있는
              커뮤니티 플랫폼입니다.
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/rackets"
                  className="hover:text-white transition-colors"
                >
                  라켓 검색
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="hover:text-white transition-colors"
                >
                  브랜드
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  소개
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-white font-semibold mb-4">문의</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@racketfinder.com"
                  className="hover:text-white transition-colors"
                >
                  이메일 문의
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            © {current_year} Tennis Racket Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

