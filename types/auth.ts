// 인증 관련 타입 정의

import { User } from '@supabase/supabase-js';

// 사용자 프로필 타입
export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  play_level: string | null;
  favorite_brand_id: string | null;
  created_at: string;
  updated_at: string;
}

// 인증 상태 타입
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

// 로그인 폼 데이터
export interface LoginFormData {
  email: string;
  password: string;
}

// 회원가입 폼 데이터
export interface SignupFormData {
  email: string;
  password: string;
  username?: string;
  display_name?: string;
}

