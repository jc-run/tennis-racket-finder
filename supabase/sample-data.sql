-- ============================================
-- Tennis Racket Finder - 샘플 데이터
-- ============================================

-- 1. 브랜드 샘플 데이터
INSERT INTO brands (name, slug, logo_url, display_order) VALUES
  ('Wilson', 'wilson', 'https://via.placeholder.com/150?text=Wilson', 1),
  ('Babolat', 'babolat', 'https://via.placeholder.com/150?text=Babolat', 2),
  ('Head', 'head', 'https://via.placeholder.com/150?text=Head', 3),
  ('Yonex', 'yonex', 'https://via.placeholder.com/150?text=Yonex', 4),
  ('Prince', 'prince', 'https://via.placeholder.com/150?text=Prince', 5);

-- 2. 라켓 샘플 데이터
INSERT INTO rackets (
  brand_id, 
  name, 
  model_year,
  head_size_sqin,
  length_inch,
  weight_unstrung_g,
  balance_type,
  balance_mm,
  string_pattern,
  tension_min_lbs,
  tension_max_lbs,
  beam_min_mm,
  beam_mid_mm,
  beam_max_mm,
  stiffness_ra,
  grip_sizes
) VALUES 
-- Wilson 라켓
(
  (SELECT id FROM brands WHERE slug = 'wilson'),
  'Pro Staff RF97 Autograph',
  2023,
  97.0,
  27.0,
  340,
  'Head light',
  310,
  '16x19',
  50,
  60,
  21.5,
  21.5,
  21.5,
  68,
  ARRAY['G2', 'G3', 'G4', 'G5']
),
-- Babolat 라켓
(
  (SELECT id FROM brands WHERE slug = 'babolat'),
  'Pure Drive',
  2023,
  100.0,
  27.0,
  300,
  'Even',
  320,
  '16x19',
  50,
  59,
  23.0,
  26.0,
  23.0,
  72,
  ARRAY['G1', 'G2', 'G3', 'G4', 'G5']
),
-- Head 라켓
(
  (SELECT id FROM brands WHERE slug = 'head'),
  'Speed Pro',
  2023,
  100.0,
  27.0,
  310,
  'Head light',
  315,
  '18x20',
  48,
  57,
  22.0,
  22.0,
  22.0,
  62,
  ARRAY['G2', 'G3', 'G4']
);

