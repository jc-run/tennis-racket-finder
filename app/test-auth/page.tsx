'use client';

// 인증 기능 테스트 페이지
// Supabase Auth 설정이 제대로 작동하는지 확인

import { useState } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signOut, 
  getCurrentUser 
} from '@/lib/auth/auth-helpers';

export default function TestAuthPage() {
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [username, set_username] = useState('');
  const [display_name, set_display_name] = useState('');
  const [message, set_message] = useState('');
  const [current_user, set_current_user] = useState<any>(null);
  const [is_loading, set_is_loading] = useState(false);

  // 회원가입 테스트
  const handle_signup = async () => {
    set_is_loading(true);
    set_message('');
    try {
      const data = await signUpWithEmail({
        email,
        password,
        username,
        display_name,
      });
      set_message(`✅ 회원가입 성공! User ID: ${data.user?.id}`);
      console.log('Signup data:', data);
    } catch (error: any) {
      set_message(`❌ 회원가입 실패: ${error.message}`);
      console.error('Signup error:', error);
    } finally {
      set_is_loading(false);
    }
  };

  // 로그인 테스트
  const handle_login = async () => {
    set_is_loading(true);
    set_message('');
    try {
      const data = await signInWithEmail({ email, password });
      set_message(`✅ 로그인 성공! User: ${data.user?.email}`);
      console.log('Login data:', data);
    } catch (error: any) {
      set_message(`❌ 로그인 실패: ${error.message}`);
      console.error('Login error:', error);
    } finally {
      set_is_loading(false);
    }
  };

  // 로그아웃 테스트
  const handle_logout = async () => {
    set_is_loading(true);
    set_message('');
    try {
      await signOut();
      set_message('✅ 로그아웃 성공!');
      set_current_user(null);
    } catch (error: any) {
      set_message(`❌ 로그아웃 실패: ${error.message}`);
      console.error('Logout error:', error);
    } finally {
      set_is_loading(false);
    }
  };

  // 현재 사용자 확인
  const check_current_user = async () => {
    set_is_loading(true);
    set_message('');
    try {
      const user = await getCurrentUser();
      set_current_user(user);
      set_message(user ? `✅ 로그인 상태: ${user.email}` : '❌ 로그인되지 않음');
      console.log('Current user:', user);
    } catch (error: any) {
      set_message(`❌ 사용자 확인 실패: ${error.message}`);
      console.error('Get user error:', error);
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔐 Supabase Auth 테스트
          </h1>
          <p className="text-gray-600">
            인증 기능이 정상적으로 작동하는지 테스트합니다.
          </p>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* 현재 사용자 정보 */}
        {current_user && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">현재 사용자:</h3>
            <pre className="text-sm text-blue-800 overflow-auto">
              {JSON.stringify(current_user, null, 2)}
            </pre>
          </div>
        )}

        {/* 입력 폼 */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => set_email(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => set_password(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="최소 8자"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사용자명 (회원가입용)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => set_username(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              표시 이름 (회원가입용)
            </label>
            <input
              type="text"
              value={display_name}
              onChange={(e) => set_display_name(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="홍길동"
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            테스트 액션
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handle_signup}
              disabled={is_loading || !email || !password}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {is_loading ? '처리 중...' : '회원가입'}
            </button>

            <button
              onClick={handle_login}
              disabled={is_loading || !email || !password}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {is_loading ? '처리 중...' : '로그인'}
            </button>

            <button
              onClick={handle_logout}
              disabled={is_loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {is_loading ? '처리 중...' : '로그아웃'}
            </button>

            <button
              onClick={check_current_user}
              disabled={is_loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {is_loading ? '처리 중...' : '현재 사용자 확인'}
            </button>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">📌 테스트 순서:</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-800 text-sm">
            <li>이메일, 비밀번호, 사용자명, 표시 이름 입력</li>
            <li><strong>회원가입</strong> 버튼 클릭</li>
            <li><strong>현재 사용자 확인</strong> 버튼으로 로그인 상태 확인</li>
            <li><strong>로그아웃</strong> 버튼 클릭</li>
            <li>이메일, 비밀번호만 입력 후 <strong>로그인</strong> 버튼 클릭</li>
          </ol>
        </div>
      </div>
    </main>
  );
}

