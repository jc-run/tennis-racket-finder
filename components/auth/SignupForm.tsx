// 회원가입 폼 컴포넌트

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signUpWithEmail } from '@/lib/auth/auth-helpers';
import { Button, Input } from '@/components/ui';

export default function SignupForm() {
  const router = useRouter();
  const search_params = useSearchParams();
  const redirect = search_params?.get('redirect') || '/';

  const [form_data, set_form_data] = useState({
    email: '',
    password: '',
    confirm_password: '',
    username: '',
    display_name: '',
  });
  const [is_loading, set_is_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_error(null);

    // 유효성 검사
    if (form_data.password !== form_data.confirm_password) {
      set_error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (form_data.password.length < 6) {
      set_error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    set_is_loading(true);

    try {
      await signUpWithEmail({
        email: form_data.email,
        password: form_data.password,
        username: form_data.username || undefined,
        display_name: form_data.display_name || undefined,
      });

      // 회원가입 성공 시 리다이렉트
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      set_error(err.message || '회원가입에 실패했습니다.');
    } finally {
      set_is_loading(false);
    }
  };

  const handle_change = (field: string, value: string) => {
    set_form_data((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handle_submit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <Input
        label="이메일"
        type="email"
        value={form_data.email}
        onChange={(e) => handle_change('email', e.target.value)}
        placeholder="이메일을 입력하세요"
        required
        disabled={is_loading}
      />

      <Input
        label="비밀번호"
        type="password"
        value={form_data.password}
        onChange={(e) => handle_change('password', e.target.value)}
        placeholder="비밀번호를 입력하세요 (최소 6자)"
        required
        disabled={is_loading}
        minLength={6}
      />

      <Input
        label="비밀번호 확인"
        type="password"
        value={form_data.confirm_password}
        onChange={(e) => handle_change('confirm_password', e.target.value)}
        placeholder="비밀번호를 다시 입력하세요"
        required
        disabled={is_loading}
        minLength={6}
      />

      <Input
        label="사용자명 (선택)"
        type="text"
        value={form_data.username}
        onChange={(e) => handle_change('username', e.target.value)}
        placeholder="사용자명을 입력하세요"
        disabled={is_loading}
        maxLength={50}
      />

      <Input
        label="표시 이름 (선택)"
        type="text"
        value={form_data.display_name}
        onChange={(e) => handle_change('display_name', e.target.value)}
        placeholder="표시할 이름을 입력하세요"
        disabled={is_loading}
        maxLength={100}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        is_loading={is_loading}
        disabled={is_loading}
        className="w-full"
      >
        회원가입
      </Button>

      <p className="text-sm text-center text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link
          href={`/auth/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}

