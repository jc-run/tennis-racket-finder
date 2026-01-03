/**
 * Supabase 클라우드 클라이언트 설정
 * 
 * 사용 전 필요한 작업:
 * 1. https://app.supabase.com 에서 프로젝트 생성
 * 2. .env.local 파일에 환경 변수 추가
 * 3. npm install @supabase/supabase-js 실행
 */

import { createClient } from '@supabase/supabase-js'

// 환경 변수 체크
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
  )
}

// 브라우저 및 서버 컴포넌트에서 사용하는 클라이언트 (공개 키)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// API Routes에서만 사용하는 관리자 클라이언트 (서비스 롤 키)
// 주의: 클라이언트 사이드에서 절대 사용하지 말 것!
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

// 타입 정의 (나중에 Supabase CLI로 자동 생성 가능)
export type Database = {
  // TODO: Supabase에서 타입 생성 후 여기에 추가
  // npx supabase gen types typescript --project-id <project-id> > types/database.ts
}

