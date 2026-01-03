'use client';

// Header 컴포넌트
// 로고, 네비게이션, 로그인 상태를 표시하는 헤더

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from '@/lib/auth/auth-helpers';
import type { User } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';

/**
 * Header 컴포넌트
 * - 로고 클릭 시 홈으로 이동
 * - 네비게이션 메뉴
 * - 로그인 상태에 따른 버튼 표시
 */
export default function Header() {
  const [user, set_user] = useState<User | null>(null);
  const [is_loading, set_is_loading] = useState(true);

  // 현재 사용자 확인
  useEffect(() => {
    const check_user = async () => {
      try {
        const current_user = await getCurrentUser();
        set_user(current_user);
      } catch (error) {
        set_user(null);
      } finally {
        set_is_loading(false);
      }
    };

    check_user();
  }, []);

  // 로그아웃 처리
  const handle_logout = async () => {
    try {
      await signOut();
      set_user(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl font-bold text-blue-600">🎾</span>
            <span className="text-xl font-bold text-gray-900">
              Tennis Racket Finder
            </span>
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/rackets"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              라켓 검색
            </Link>
            <Link
              href="/brands"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              브랜드
            </Link>
          </nav>

          {/* 로그인 상태 */}
          <div className="flex items-center space-x-4">
            {is_loading ? (
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    프로필
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handle_logout}
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

