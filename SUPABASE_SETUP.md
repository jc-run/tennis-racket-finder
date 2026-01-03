# 🗄️ Supabase 클라우드 설정 가이드

## 1. Supabase 프로젝트 생성 (5분)

### 1.1 회원가입 및 프로젝트 생성

1. **Supabase 웹사이트 접속**
   - https://app.supabase.com

2. **회원가입/로그인**
   - GitHub 계정으로 로그인 (권장)
   - 또는 이메일로 가입

3. **새 프로젝트 생성**
   - "New Project" 클릭
   - **Organization**: 개인 계정 선택
   - **Name**: `tennis-racket-finder`
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: Northeast Asia (Seoul) 선택
   - **Pricing Plan**: Free 선택
   - "Create new project" 클릭

4. **프로젝트 생성 대기**
   - 약 2-3분 소요
   - 완료되면 대시보드로 이동

---

## 2. API 키 복사 (2분)

### 2.1 API 설정 페이지 이동

1. 좌측 메뉴에서 **Settings** (⚙️) 클릭
2. **API** 메뉴 클릭

### 2.2 환경 변수 복사

다음 3가지 값을 복사하세요:

#### ① Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

#### ② anon public (공개 키)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### ③ service_role (서비스 롤 키) ⚠️ 비밀!
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3. 환경 변수 설정 (1분)

### 3.1 .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# racket-finder/.env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 .env.example 참고

`.env.example` 파일을 복사해서 사용할 수도 있습니다:

```bash
cp .env.example .env.local
# 그 다음 .env.local 파일을 열어서 실제 값으로 변경
```

---

## 4. Supabase 클라이언트 라이브러리 설치 (1분)

```bash
npm install @supabase/supabase-js
```

---

## 5. 데이터베이스 스키마 생성 (5분)

### 5.1 SQL Editor 접속

1. Supabase 대시보드에서 **SQL Editor** 메뉴 클릭
2. "New Query" 클릭

### 5.2 스키마 SQL 실행

프로젝트 루트의 `database.md` 파일에서 SQL 스크립트를 복사하세요:

```sql
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

-- ... (나머지 스키마)
```

### 5.3 실행

1. SQL을 붙여넣기
2. "Run" 버튼 클릭 (또는 Ctrl/Cmd + Enter)
3. 성공 메시지 확인

### 5.4 테이블 확인

1. 좌측 메뉴에서 **Table Editor** 클릭
2. 생성된 테이블 확인:
   - brands
   - rackets
   - reviews
   - comments
   - user_profiles

---

## 6. 샘플 데이터 입력 (선택, 5분)

### 6.1 브랜드 샘플 데이터

SQL Editor에서 실행:

```sql
INSERT INTO brands (name, slug, logo_url, display_order) VALUES
  ('Wilson', 'wilson', 'https://via.placeholder.com/150?text=Wilson', 1),
  ('Babolat', 'babolat', 'https://via.placeholder.com/150?text=Babolat', 2),
  ('Head', 'head', 'https://via.placeholder.com/150?text=Head', 3),
  ('Yonex', 'yonex', 'https://via.placeholder.com/150?text=Yonex', 4),
  ('Prince', 'prince', 'https://via.placeholder.com/150?text=Prince', 5);
```

### 6.2 라켓 샘플 데이터

```sql
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
) VALUES (
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
);
```

---

## 7. 연결 테스트 (2분)

### 7.1 개발 서버 실행

```bash
npm run dev
```

### 7.2 테스트 페이지 생성

`app/test-supabase/page.tsx` 파일 생성:

```tsx
import { supabase } from '@/lib/supabase/client';

export default async function TestSupabasePage() {
  // 브랜드 데이터 조회
  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('display_order');

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">
          Supabase 연결 실패
        </h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-500">
        ✅ Supabase 연결 성공!
      </h1>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">브랜드 목록:</h2>
        <ul className="mt-2 space-y-2">
          {brands?.map((brand) => (
            <li key={brand.id} className="text-gray-700">
              {brand.name} ({brand.slug})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### 7.3 테스트

브라우저에서 http://localhost:3000/test-supabase 접속

- ✅ 성공: 브랜드 목록이 표시됨
- ❌ 실패: 에러 메시지 확인 후 환경 변수 재확인

---

## 8. Row Level Security (RLS) 설정 (선택)

### 8.1 RLS 정책 확인

Supabase 대시보드에서:
1. **Authentication** > **Policies** 메뉴
2. 각 테이블의 RLS 정책 확인

### 8.2 기본 정책

`database.md` 파일의 RLS 정책 섹션 참고

---

## 9. 문제 해결

### Q1: "Invalid API key" 오류

**원인**: 환경 변수가 잘못 설정됨

**해결**:
1. `.env.local` 파일 확인
2. Supabase 대시보드에서 API 키 재확인
3. 개발 서버 재시작 (`npm run dev`)

### Q2: "relation does not exist" 오류

**원인**: 데이터베이스 테이블이 생성되지 않음

**해결**:
1. SQL Editor에서 스키마 SQL 다시 실행
2. Table Editor에서 테이블 생성 확인

### Q3: 환경 변수가 인식되지 않음

**원인**: Next.js가 환경 변수를 읽지 못함

**해결**:
```bash
# 개발 서버 완전히 종료 후 재시작
npm run dev
```

### Q4: "Failed to fetch" 오류

**원인**: Supabase 프로젝트가 일시 중지됨 (Free tier)

**해결**:
1. Supabase 대시보드 접속
2. 프로젝트 "Resume" 클릭
3. 1-2분 대기 후 재시도

---

## 10. 다음 단계

### ✅ Supabase 설정 완료 후

1. **인증 설정**
   - Authentication > Providers에서 이메일/소셜 로그인 활성화

2. **Storage 설정** (이미지 업로드용)
   - Storage > New Bucket 생성
   - 또는 Cloudflare R2 사용 (권장)

3. **실시간 기능** (선택)
   - Realtime 기능 활성화

4. **타입 생성** (권장)
   ```bash
   npx supabase gen types typescript --project-id <your-project-id> > types/database.ts
   ```

---

## 📚 유용한 링크

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

**설정 완료!** 🎉

이제 Supabase 클라우드와 연결되었습니다!

