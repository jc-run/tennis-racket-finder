# 📁 프로젝트 폴더 구조

```
racket-finder/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📄 layout.tsx                # 루트 레이아웃
│   ├── 📄 page.tsx                  # 홈페이지 (/)
│   ├── 📄 globals.css               # 전역 스타일
│   │
│   ├── 📁 rackets/                  # 라켓 검색/필터
│   │   └── 📄 page.tsx              # /rackets
│   │
│   ├── 📁 brand/                    # 브랜드 페이지
│   │   └── 📁 [brandSlug]/
│   │       └── 📄 page.tsx          # /brand/[brandSlug]
│   │
│   ├── 📁 racket/                   # 라켓 상세
│   │   └── 📁 [id]/
│   │       └── 📄 page.tsx          # /racket/[id]
│   │
│   └── 📁 api/                      # API Routes
│       ├── 📁 reviews/
│       │   └── 📄 route.ts          # /api/reviews
│       └── 📁 comments/
│           └── 📄 route.ts          # /api/comments
│
├── 📁 components/                   # React 컴포넌트
│   ├── 📁 brand/                    # 브랜드 관련 컴포넌트
│   ├── 📁 rackets/                  # 라켓 관련 컴포넌트
│   └── 📁 community/                # 커뮤니티 (리뷰/댓글) 컴포넌트
│
├── 📁 lib/                          # 유틸리티 & 설정
│   ├── 📁 supabase/                 # Supabase 클라이언트
│   │   └── 📄 client.ts             # Supabase 설정 (TODO)
│   ├── 📁 repositories/             # 데이터 접근 계층
│   ├── 📁 utils/                    # 유틸리티 함수
│   └── 📁 validators/               # 유효성 검사
│
├── 📁 supabase/                     # Supabase 관련
│   └── 📁 migrations/               # DB 마이그레이션 스크립트
│
├── 📁 docs/                         # 프로젝트 문서
│   ├── 📄 prd.md                    # 기획 문서 참조
│   └── 📄 database.md               # DB 설계 참조
│
├── 📁 public/                       # 정적 파일
│
├── 📄 .gitignore                    # Git 제외 파일
├── 📄 package.json                  # 의존성 관리
├── 📄 tsconfig.json                 # TypeScript 설정
├── 📄 next.config.ts                # Next.js 설정
└── 📄 README.md                     # 프로젝트 소개
```

## 📝 생성된 파일 설명

### ✅ 페이지 (app/)
- **`app/rackets/page.tsx`** - 라켓 검색/필터 페이지 (scaffold)
- **`app/brand/[brandSlug]/page.tsx`** - 브랜드별 라켓 목록 (scaffold)
- **`app/racket/[id]/page.tsx`** - 라켓 상세 페이지 (scaffold)

### ✅ API Routes (app/api/)
- **`app/api/reviews/route.ts`** - 리뷰 API (GET, POST)
- **`app/api/comments/route.ts`** - 댓글 API (GET, POST)

### ✅ 컴포넌트 폴더 (components/)
- **`components/brand/`** - 브랜드 관련 컴포넌트 (빈 폴더)
- **`components/rackets/`** - 라켓 관련 컴포넌트 (빈 폴더)
- **`components/community/`** - 리뷰/댓글 컴포넌트 (빈 폴더)

### ✅ 라이브러리 (lib/)
- **`lib/supabase/client.ts`** - Supabase 클라이언트 설정 (주석 처리)
- **`lib/repositories/`** - 데이터 접근 계층 (빈 폴더)
- **`lib/utils/`** - 유틸리티 함수 (빈 폴더)
- **`lib/validators/`** - 유효성 검사 (빈 폴더)

### ✅ Supabase
- **`supabase/migrations/`** - DB 마이그레이션 스크립트 (빈 폴더)

### ✅ 문서 (docs/)
- **`docs/prd.md`** - 프로젝트 기획 문서 참조
- **`docs/database.md`** - 데이터베이스 설계 참조

## 🎯 다음 단계

### 1. Supabase 설정
```bash
# Supabase 클라이언트 라이브러리 설치
npm install @supabase/supabase-js

# lib/supabase/client.ts 파일의 주석 해제 및 설정
```

### 2. 환경 변수 설정
```bash
# .env.local 파일 생성
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 컴포넌트 개발
- `components/brand/` - 브랜드 로고, 브랜드 카드 등
- `components/rackets/` - 라켓 카드, 라켓 리스트, 필터 등
- `components/community/` - 리뷰 폼, 댓글 폼 등

### 4. 빌드 확인
```bash
npm run dev
# 모든 페이지가 정상 작동하는지 확인
```

## ✨ 특징

- ✅ **빌드 안전**: 모든 페이지와 API가 기본 export를 가지고 있어 빌드 에러 없음
- ✅ **타입 안전**: TypeScript로 작성되어 타입 체크 가능
- ✅ **확장 가능**: 각 도메인별로 폴더가 분리되어 있어 확장 용이
- ✅ **문서화**: 각 파일에 주석으로 용도 설명

---

**생성 완료!** 🎉

