// Rate Limiting 유틸리티
// Upstash Redis를 사용한 Rate Limiting

// TODO: Upstash Redis 설정 후 활성화
// 현재는 기본적인 Rate Limiting만 구현

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate Limiting 체크 (간단한 구현)
 * 
 * @param identifier - 사용자 식별자 (IP 또는 user_id)
 * @param limit - 제한 횟수
 * @param window - 시간 윈도우 (초)
 * @returns Rate Limit 결과
 */
export async function check_rate_limit(
  identifier: string,
  limit: number = 10,
  window: number = 60
): Promise<RateLimitResult> {
  // TODO: Upstash Redis 연동
  // 현재는 항상 허용 (개발 단계)
  
  // 프로덕션에서는 다음과 같이 구현:
  // 1. Upstash Redis에 요청 횟수 저장
  // 2. 윈도우 시간 내 요청 횟수 확인
  // 3. 제한 초과 시 false 반환

  return {
    success: true,
    limit,
    remaining: limit - 1,
    reset: Date.now() + window * 1000,
  };
}

/**
 * Rate Limiting 미들웨어 (API Route용)
 */
export async function with_rate_limit(
  request: Request,
  limit: number = 10,
  window: number = 60
): Promise<{ success: boolean; error?: string }> {
  // IP 주소 추출
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

  const result = await check_rate_limit(ip, limit, window);

  if (!result.success) {
    return {
      success: false,
      error: `Rate limit exceeded. Please try again after ${Math.ceil((result.reset - Date.now()) / 1000)} seconds.`,
    };
  }

  return { success: true };
}

