// 라켓 데이터 페칭을 위한 Repository
// Supabase에서 라켓 데이터를 가져오는 함수들

import { supabase } from '@/lib/supabase/client';
import type { Racket, RacketFilters } from '@/types/racket';

/**
 * 필터를 적용하여 라켓 조회
 */
export async function get_rackets(
  filters: RacketFilters = {},
  page: number = 1,
  page_size: number = 20
): Promise<{ data: Racket[]; count: number }> {
  let query = supabase
    .from('rackets')
    .select('*, brands(*)', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // 브랜드 필터
  if (filters.brand_ids && filters.brand_ids.length > 0) {
    query = query.in('brand_id', filters.brand_ids);
  }

  // 헤드 사이즈 필터
  if (filters.head_size_min !== undefined) {
    query = query.gte('head_size_sqin', filters.head_size_min);
  }
  if (filters.head_size_max !== undefined) {
    query = query.lte('head_size_sqin', filters.head_size_max);
  }

  // 길이 필터
  if (filters.length_min !== undefined) {
    query = query.gte('length_inch', filters.length_min);
  }
  if (filters.length_max !== undefined) {
    query = query.lte('length_inch', filters.length_max);
  }

  // 무게 언스트렁 필터
  if (filters.weight_unstrung_min !== undefined) {
    query = query.gte('weight_unstrung_g', filters.weight_unstrung_min);
  }
  if (filters.weight_unstrung_max !== undefined) {
    query = query.lte('weight_unstrung_g', filters.weight_unstrung_max);
  }

  // 무게 스트렁 필터
  if (filters.weight_strung_min !== undefined) {
    query = query.gte('weight_strung_g', filters.weight_strung_min);
  }
  if (filters.weight_strung_max !== undefined) {
    query = query.lte('weight_strung_g', filters.weight_strung_max);
  }

  // 밸런스 타입 필터
  if (filters.balance_type && filters.balance_type.length > 0) {
    query = query.in('balance_type', filters.balance_type);
  }

  // 밸런스 mm 필터
  if (filters.balance_min !== undefined) {
    query = query.gte('balance_mm', filters.balance_min);
  }
  if (filters.balance_max !== undefined) {
    query = query.lte('balance_mm', filters.balance_max);
  }

  // 스윙웨이트 필터
  if (filters.swingweight_min !== undefined) {
    query = query.gte('swingweight', filters.swingweight_min);
  }
  if (filters.swingweight_max !== undefined) {
    query = query.lte('swingweight', filters.swingweight_max);
  }

  // 스트링 패턴 필터
  if (filters.string_pattern && filters.string_pattern.length > 0) {
    query = query.in('string_pattern', filters.string_pattern);
  }

  // 텐션 필터
  if (filters.tension_min !== undefined) {
    query = query.gte('tension_min_lbs', filters.tension_min);
  }
  if (filters.tension_max !== undefined) {
    query = query.lte('tension_max_lbs', filters.tension_max);
  }

  // 빔 두께 필터 (최소값 기준)
  if (filters.beam_min !== undefined) {
    query = query.gte('beam_min_mm', filters.beam_min);
  }
  if (filters.beam_max !== undefined) {
    query = query.lte('beam_max_mm', filters.beam_max);
  }

  // 강성 필터
  if (filters.stiffness_min !== undefined) {
    query = query.gte('stiffness_ra', filters.stiffness_min);
  }
  if (filters.stiffness_max !== undefined) {
    query = query.lte('stiffness_ra', filters.stiffness_max);
  }

  // 그립 사이즈 필터 (배열 포함 검사)
  if (filters.grip_sizes && filters.grip_sizes.length > 0) {
    // PostgreSQL 배열과 교집합이 있는지 확인
    query = query.overlaps('grip_sizes', filters.grip_sizes);
  }

  // 페이지네이션
  const from = (page - 1) * page_size;
  const to = from + page_size - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('라켓 조회 오류:', error);
    throw new Error(`라켓 데이터를 불러올 수 없습니다: ${error.message}`);
  }

  return {
    data: (data as Racket[]) || [],
    count: count || 0,
  };
}

/**
 * ID로 라켓 조회
 */
export async function get_racket_by_id(id: string): Promise<Racket | null> {
  // ID 유효성 검사
  if (!id || typeof id !== 'string') {
    console.error('라켓 ID가 제공되지 않았습니다:', id);
    return null;
  }

  // UUID 형식 검증
  const uuid_regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid_regex.test(id)) {
    console.error('잘못된 라켓 ID 형식:', id);
    return null;
  }

  try {
    // 먼저 라켓 데이터만 조회
    const { data: racket_data, error: racket_error } = await supabase
      .from('rackets')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (racket_error) {
      // 데이터가 없는 경우 (PGRST116: no rows returned)
      if (racket_error.code === 'PGRST116') {
        return null;
      }
      
      // 에러 로깅
      console.error('라켓 조회 오류:', {
        code: racket_error.code,
        message: racket_error.message,
        details: racket_error.details,
        hint: racket_error.hint,
      });
      
      const error_message = 
        racket_error.message || 
        racket_error.details || 
        racket_error.hint || 
        '알 수 없는 오류가 발생했습니다.';
      
      throw new Error(`라켓 데이터를 불러올 수 없습니다: ${error_message}`);
    }

    if (!racket_data) {
      return null;
    }

    // 브랜드 데이터 별도 조회 (에러가 나도 계속 진행)
    let brand_data = null;
    if (racket_data.brand_id) {
      try {
        const { data: brand, error: brand_error } = await supabase
          .from('brands')
          .select('id, name, slug, logo_url, description, website_url')
          .eq('id', racket_data.brand_id)
          .single();
        
        if (!brand_error && brand) {
          brand_data = brand;
        } else if (brand_error) {
          console.warn('브랜드 데이터 조회 실패 (무시):', brand_error.message);
        }
      } catch (brand_err) {
        console.warn('브랜드 데이터 조회 중 예외 발생 (무시):', brand_err);
      }
    }

    // 데이터 결합
    return {
      ...racket_data,
      brands: brand_data,
    } as Racket;
  } catch (err: any) {
    // 예상치 못한 에러 처리
    console.error('라켓 조회 예외:', {
      message: err?.message,
      stack: err?.stack,
      error: err,
    });
    
    if (err.message) {
      throw err;
    }
    throw new Error('라켓 데이터를 불러오는 중 오류가 발생했습니다.');
  }
}

/**
 * 라켓 조회수 증가
 */
export async function increment_racket_view_count(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_racket_view_count', {
    racket_id: id,
  });

  if (error) {
    // RPC 함수가 없을 수 있으므로 직접 업데이트
    const { data: current_racket } = await supabase
      .from('rackets')
      .select('view_count')
      .eq('id', id)
      .single();

    if (current_racket) {
      await supabase
        .from('rackets')
        .update({ view_count: (current_racket.view_count || 0) + 1 })
        .eq('id', id);
    }
  }
}
