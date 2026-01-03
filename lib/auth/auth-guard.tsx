'use client';

// 인증 가드 컴포넌트
// 로그인이 필요한 기능에 사용하는 컴포넌트

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import type { User } from '@supabase/supabase-js';
import { Modal } from '@/components/ui';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirect_to?: string;
}

/**
 * AuthGuard 컴포넌트
 * 로그인한 사용자만 children을 표시하고, 비로그인 사용자에게는 로그인 유도 UI를 표시
 * 
 * @param children - 로그인 시 표시할 내용
 * @param fallback - 비로그인 시 표시할 커스텀 UI
 * @param redirect_to - 로그인 후 리다이렉트할 경로
 */
export default function AuthGuard({
  children,
  fallback,
  redirect_to,
}: AuthGuardProps) {
  const [user, set_user] = useState<User | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check_auth = async () => {
      try {
        const current_user = await getCurrentUser();
        set_user(current_user);
      } catch (error) {
        set_user(null);
      } finally {
        set_is_loading(false);
      }
    };

    check_auth();
  }, []);

  // 로딩 중
  if (is_loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // 기본 로그인 유도 UI
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          로그인이 필요합니다
        </h3>
        <p className="text-blue-700 mb-4">
          이 기능을 사용하려면 로그인해주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={`/auth/login${redirect_to ? `?redirect=${encodeURIComponent(redirect_to)}` : ''}`}>
            <Button variant="primary" size="md">
              로그인
            </Button>
          </Link>
          <Link href={`/auth/signup${redirect_to ? `?redirect=${encodeURIComponent(redirect_to)}` : ''}`}>
            <Button variant="outline" size="md">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 로그인한 경우
  return <>{children}</>;
}

