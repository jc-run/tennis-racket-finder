-- ============================================
-- Tennis Racket Finder Database Schema
-- Supabase (PostgreSQL 15+)
-- ============================================

-- 1. brands 테이블 생성
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. rackets 테이블 생성
CREATE TABLE rackets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  model_year INTEGER,
  image_url TEXT,
  description TEXT,
  head_size_sqin NUMERIC(5,2),
  length_inch NUMERIC(4,2),
  weight_unstrung_g INTEGER,
  weight_strung_g INTEGER,
  balance_type VARCHAR(20),
  balance_mm INTEGER,
  swingweight INTEGER,
  string_pattern VARCHAR(20),
  tension_min_lbs INTEGER,
  tension_max_lbs INTEGER,
  beam_min_mm NUMERIC(4,2),
  beam_mid_mm NUMERIC(4,2),
  beam_max_mm NUMERIC(4,2),
  stiffness_ra INTEGER,
  frame_shape TEXT,
  grip_sizes TEXT[],
  material TEXT,
  technology TEXT,
  player_level VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_balance_type CHECK (
    balance_type IS NULL OR 
    balance_type IN ('Head light', 'Even', 'Head heavy')
  ),
  CONSTRAINT valid_tension_range CHECK (
    tension_min_lbs IS NULL OR 
    tension_max_lbs IS NULL OR 
    tension_min_lbs <= tension_max_lbs
  )
);

-- 3. reviews 테이블 생성
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racket_id UUID NOT NULL REFERENCES rackets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  play_style VARCHAR(50),
  experience_level VARCHAR(50),
  usage_duration VARCHAR(50),
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(racket_id, user_id)
);

-- 4. comments 테이블 생성
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racket_id UUID NOT NULL REFERENCES rackets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. user_profiles 테이블 생성
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  play_level VARCHAR(50),
  favorite_brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 인덱스 생성
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_is_active ON brands(is_active) WHERE is_active = true;

CREATE INDEX idx_rackets_brand_id ON rackets(brand_id);
CREATE INDEX idx_rackets_is_active ON rackets(is_active) WHERE is_active = true;
CREATE INDEX idx_rackets_head_size ON rackets(head_size_sqin) WHERE head_size_sqin IS NOT NULL;
CREATE INDEX idx_rackets_weight_unstrung ON rackets(weight_unstrung_g) WHERE weight_unstrung_g IS NOT NULL;
CREATE INDEX idx_rackets_balance_type ON rackets(balance_type) WHERE balance_type IS NOT NULL;
CREATE INDEX idx_rackets_string_pattern ON rackets(string_pattern) WHERE string_pattern IS NOT NULL;
CREATE INDEX idx_rackets_stiffness ON rackets(stiffness_ra) WHERE stiffness_ra IS NOT NULL;
CREATE INDEX idx_rackets_brand_active ON rackets(brand_id, is_active);
CREATE INDEX idx_rackets_grip_sizes ON rackets USING GIN(grip_sizes);

CREATE INDEX idx_reviews_racket_id ON reviews(racket_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX idx_comments_racket_id ON comments(racket_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 7. RLS 활성화
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE rackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 8. RLS 정책 생성
-- brands
CREATE POLICY "brands_select_policy" ON brands FOR SELECT USING (is_active = true);

-- rackets
CREATE POLICY "rackets_select_policy" ON rackets FOR SELECT USING (is_active = true);

-- reviews
CREATE POLICY "reviews_select_policy" ON reviews FOR SELECT USING (is_hidden = false);
CREATE POLICY "reviews_insert_policy" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_policy" ON reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_policy" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- comments
CREATE POLICY "comments_select_policy" ON comments FOR SELECT USING (is_hidden = false);
CREATE POLICY "comments_insert_policy" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_policy" ON comments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete_policy" ON comments FOR DELETE USING (auth.uid() = user_id);

-- user_profiles
CREATE POLICY "profiles_select_policy" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_policy" ON user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 9. updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. 트리거 생성
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rackets_updated_at BEFORE UPDATE ON rackets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

