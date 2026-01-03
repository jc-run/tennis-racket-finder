// 로그인 폼 컴포넌트

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmail } from '@/lib/auth/auth-helpers';
import { Button, Input } from '@/components/ui';

export default function LoginForm() {
  const router = useRouter();
  const search_params = useSearchParams();
  const redirect = search_params?.get('redirect') || '/';

  const [form_data, set_form_data] = useState({
    email: '',
    password: '',
  });
  const [is_loading, set_is_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_error(null);
    set_is_loading(true);

    try {
      await signInWithEmail({
        email: form_data.email,
        password: form_data.password,
      });

      // 로그인 성공 시 리다이렉트
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      set_error(err.message || '로그인에 실패했습니다.');
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
        placeholder="비밀번호를 입력하세요"
        required
        disabled={is_loading}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        is_loading={is_loading}
        disabled={is_loading}
        className="w-full"
      >
        로그인
      </Button>
    </form>
  );
}

