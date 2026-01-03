-- ============================================
-- 기존 테이블 삭제 (주의: 모든 데이터가 삭제됩니다!)
-- ============================================

-- 1. 테이블 삭제 (의존성 순서 고려)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS rackets CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- 2. 트리거 함수 삭제
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 완료 메시지
SELECT 'All tables dropped successfully!' AS status;

