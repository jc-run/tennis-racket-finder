// 필터 관련 유틸리티 함수
// URL Query 파라미터와 필터 객체 간 변환

import type { RacketFilters } from '@/types/racket';

/**
 * URL SearchParams를 RacketFilters로 변환
 */
export function parse_filters_from_url(search_params: URLSearchParams): RacketFilters {
  const filters: RacketFilters = {};

  // 브랜드 IDs
  const brand_ids = search_params.get('brands');
  if (brand_ids) {
    filters.brand_ids = brand_ids.split(',').filter(Boolean);
  }

  // 헤드 사이즈
  const head_size_min = search_params.get('head_size_min');
  const head_size_max = search_params.get('head_size_max');
  if (head_size_min) filters.head_size_min = parseFloat(head_size_min);
  if (head_size_max) filters.head_size_max = parseFloat(head_size_max);

  // 길이
  const length_min = search_params.get('length_min');
  const length_max = search_params.get('length_max');
  if (length_min) filters.length_min = parseFloat(length_min);
  if (length_max) filters.length_max = parseFloat(length_max);

  // 무게 언스트렁
  const weight_unstrung_min = search_params.get('weight_unstrung_min');
  const weight_unstrung_max = search_params.get('weight_unstrung_max');
  if (weight_unstrung_min) filters.weight_unstrung_min = parseInt(weight_unstrung_min);
  if (weight_unstrung_max) filters.weight_unstrung_max = parseInt(weight_unstrung_max);

  // 무게 스트렁
  const weight_strung_min = search_params.get('weight_strung_min');
  const weight_strung_max = search_params.get('weight_strung_max');
  if (weight_strung_min) filters.weight_strung_min = parseInt(weight_strung_min);
  if (weight_strung_max) filters.weight_strung_max = parseInt(weight_strung_max);

  // 밸런스 타입
  const balance_type = search_params.get('balance_type');
  if (balance_type) {
    filters.balance_type = balance_type.split(',') as ('Head light' | 'Even' | 'Head heavy')[];
  }

  // 밸런스 mm
  const balance_min = search_params.get('balance_min');
  const balance_max = search_params.get('balance_max');
  if (balance_min) filters.balance_min = parseInt(balance_min);
  if (balance_max) filters.balance_max = parseInt(balance_max);

  // 스윙웨이트
  const swingweight_min = search_params.get('swingweight_min');
  const swingweight_max = search_params.get('swingweight_max');
  if (swingweight_min) filters.swingweight_min = parseInt(swingweight_min);
  if (swingweight_max) filters.swingweight_max = parseInt(swingweight_max);

  // 스트링 패턴
  const string_pattern = search_params.get('string_pattern');
  if (string_pattern) {
    filters.string_pattern = string_pattern.split(',').filter(Boolean);
  }

  // 텐션
  const tension_min = search_params.get('tension_min');
  const tension_max = search_params.get('tension_max');
  if (tension_min) filters.tension_min = parseInt(tension_min);
  if (tension_max) filters.tension_max = parseInt(tension_max);

  // 빔 두께
  const beam_min = search_params.get('beam_min');
  const beam_max = search_params.get('beam_max');
  if (beam_min) filters.beam_min = parseFloat(beam_min);
  if (beam_max) filters.beam_max = parseFloat(beam_max);

  // 강성
  const stiffness_min = search_params.get('stiffness_min');
  const stiffness_max = search_params.get('stiffness_max');
  if (stiffness_min) filters.stiffness_min = parseInt(stiffness_min);
  if (stiffness_max) filters.stiffness_max = parseInt(stiffness_max);

  // 그립 사이즈
  const grip_sizes = search_params.get('grip_sizes');
  if (grip_sizes) {
    filters.grip_sizes = grip_sizes.split(',').filter(Boolean);
  }

  return filters;
}

/**
 * RacketFilters를 URL SearchParams로 변환
 */
export function filters_to_url(filters: RacketFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.brand_ids && filters.brand_ids.length > 0) {
    params.set('brands', filters.brand_ids.join(','));
  }

  if (filters.head_size_min !== undefined) {
    params.set('head_size_min', filters.head_size_min.toString());
  }
  if (filters.head_size_max !== undefined) {
    params.set('head_size_max', filters.head_size_max.toString());
  }

  if (filters.length_min !== undefined) {
    params.set('length_min', filters.length_min.toString());
  }
  if (filters.length_max !== undefined) {
    params.set('length_max', filters.length_max.toString());
  }

  if (filters.weight_unstrung_min !== undefined) {
    params.set('weight_unstrung_min', filters.weight_unstrung_min.toString());
  }
  if (filters.weight_unstrung_max !== undefined) {
    params.set('weight_unstrung_max', filters.weight_unstrung_max.toString());
  }

  if (filters.weight_strung_min !== undefined) {
    params.set('weight_strung_min', filters.weight_strung_min.toString());
  }
  if (filters.weight_strung_max !== undefined) {
    params.set('weight_strung_max', filters.weight_strung_max.toString());
  }

  if (filters.balance_type && filters.balance_type.length > 0) {
    params.set('balance_type', filters.balance_type.join(','));
  }

  if (filters.balance_min !== undefined) {
    params.set('balance_min', filters.balance_min.toString());
  }
  if (filters.balance_max !== undefined) {
    params.set('balance_max', filters.balance_max.toString());
  }

  if (filters.swingweight_min !== undefined) {
    params.set('swingweight_min', filters.swingweight_min.toString());
  }
  if (filters.swingweight_max !== undefined) {
    params.set('swingweight_max', filters.swingweight_max.toString());
  }

  if (filters.string_pattern && filters.string_pattern.length > 0) {
    params.set('string_pattern', filters.string_pattern.join(','));
  }

  if (filters.tension_min !== undefined) {
    params.set('tension_min', filters.tension_min.toString());
  }
  if (filters.tension_max !== undefined) {
    params.set('tension_max', filters.tension_max.toString());
  }

  if (filters.beam_min !== undefined) {
    params.set('beam_min', filters.beam_min.toString());
  }
  if (filters.beam_max !== undefined) {
    params.set('beam_max', filters.beam_max.toString());
  }

  if (filters.stiffness_min !== undefined) {
    params.set('stiffness_min', filters.stiffness_min.toString());
  }
  if (filters.stiffness_max !== undefined) {
    params.set('stiffness_max', filters.stiffness_max.toString());
  }

  if (filters.grip_sizes && filters.grip_sizes.length > 0) {
    params.set('grip_sizes', filters.grip_sizes.join(','));
  }

  return params;
}

