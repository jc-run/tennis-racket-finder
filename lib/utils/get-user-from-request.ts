// API 요청에서 사용자 정보를 가져오는 유틸리티
// Supabase 세션을 확인하여 사용자 ID를 반환

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * API 요청에서 현재 사용자 ID를 가져옴
 * 
 * @returns 사용자 ID 또는 null
 */
export async function get_user_id_from_request(): Promise<string | null> {
  try {
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const cookie_store = await cookies();
    const supabase = createClient(supabase_url, supabase_anon_key, {
      auth: {
        storage: {
          getItem: (name: string) => {
            return cookie_store.get(name)?.value || null;
          },
          setItem: () => {},
          removeItem: () => {},
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('사용자 인증 오류:', error);
    return null;
  }
}

/**
 * API 요청에서 현재 사용자 정보를 가져옴
 * 
 * @param request - NextRequest 객체
 * @returns 사용자 정보 또는 null
 */
export async function get_user_from_request(
  request: Request
): Promise<{ id: string } | null> {
  const user_id = await get_user_id_from_request();
  if (!user_id) {
    return null;
  }
  return { id: user_id };
}

