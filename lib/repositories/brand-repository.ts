// 브랜드 데이터 페칭을 위한 Repository
// Supabase에서 브랜드 데이터를 가져오는 함수들

import { supabase } from '@/lib/supabase/client';
import type { Brand } from '@/types/brand';

/**
 * 모든 활성 브랜드 조회
 * display_order 순서로 정렬
 */
export async function get_all_brands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('브랜드 조회 오류:', error);
    throw new Error(`브랜드 데이터를 불러올 수 없습니다: ${error.message}`);
  }

  return data || [];
}

/**
 * 슬러그로 브랜드 조회
 */
export async function get_brand_by_slug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 데이터가 없음
      return null;
    }
    console.error('브랜드 조회 오류:', error);
    throw new Error(`브랜드 데이터를 불러올 수 없습니다: ${error.message}`);
  }

  return data;
}

