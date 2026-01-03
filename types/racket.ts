// 라켓 관련 타입 정의

import type { Brand } from './brand';

export interface Racket {
  id: string;
  brand_id: string;
  name: string;
  model_year: number | null;
  image_url: string | null;
  description: string | null;
  
  // 스펙 (모두 null 허용)
  head_size_sqin: number | null;
  length_inch: number | null;
  weight_unstrung_g: number | null;
  weight_strung_g: number | null;
  balance_type: 'Head light' | 'Even' | 'Head heavy' | null;
  balance_mm: number | null;
  swingweight: number | null;
  string_pattern: string | null;
  tension_min_lbs: number | null;
  tension_max_lbs: number | null;
  beam_min_mm: number | null;
  beam_mid_mm: number | null;
  beam_max_mm: number | null;
  stiffness_ra: number | null;
  frame_shape: string | null;
  grip_sizes: string[] | null;
  
  // 추가 정보
  material: string | null;
  technology: string | null;
  player_level: string | null;
  
  // 메타데이터
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  
  // 관계 데이터
  brands?: Brand;
}

// 필터 타입
export interface RacketFilters {
  brand_ids?: string[];
  head_size_min?: number;
  head_size_max?: number;
  length_min?: number;
  length_max?: number;
  weight_unstrung_min?: number;
  weight_unstrung_max?: number;
  weight_strung_min?: number;
  weight_strung_max?: number;
  balance_type?: ('Head light' | 'Even' | 'Head heavy')[];
  balance_min?: number;
  balance_max?: number;
  swingweight_min?: number;
  swingweight_max?: number;
  string_pattern?: string[];
  tension_min?: number;
  tension_max?: number;
  beam_min?: number;
  beam_max?: number;
  stiffness_min?: number;
  stiffness_max?: number;
  grip_sizes?: string[];
}

