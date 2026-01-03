# 🎾 Tennis Racket Finder

테니스 라켓 검색/필터 + 커뮤니티 플랫폼

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 클라이언트 라이브러리 설치

```bash
npm install @supabase/supabase-js
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Supabase 설정 방법**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참고

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인하세요.

---

## 📁 프로젝트 구조

```
racket-finder/
├── app/                    # Next.js App Router
│   ├── rackets/           # 라켓 검색/필터
│   ├── brand/[slug]/      # 브랜드 페이지
│   ├── racket/[id]/       # 라켓 상세
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── brand/            # 브랜드 관련
│   ├── rackets/          # 라켓 관련
│   └── community/        # 리뷰/댓글
├── lib/                  # 유틸리티
│   ├── supabase/        # Supabase 클라이언트
│   ├── repositories/    # 데이터 접근
│   ├── utils/           # 유틸리티 함수
│   └── validators/      # 유효성 검사
└── supabase/            # Supabase 관련
    └── migrations/      # DB 마이그레이션
```

자세한 구조는 [STRUCTURE.md](./STRUCTURE.md) 참고

---

## 🗄️ Supabase 설정

### Supabase 클라우드 사용

이 프로젝트는 **Supabase 클라우드**를 사용합니다.

1. **Supabase 프로젝트 생성**
   - https://app.supabase.com 접속
   - 새 프로젝트 생성

2. **API 키 복사**
   - Settings > API에서 URL과 키 복사

3. **환경 변수 설정**
   - `.env.local` 파일에 추가

4. **데이터베이스 스키마 생성**
   - SQL Editor에서 스키마 실행
   - 프로젝트 루트의 `database.md` 참고

**상세 가이드**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 📚 문서

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase 클라우드 설정 가이드
- **[R2_SETUP.md](./docs/R2_SETUP.md)** - Cloudflare R2 설정 가이드
- **[TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)** - 테스트 및 검증 가이드
- **[DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)** - Vercel 배포 가이드 ⭐
- **[ENV_VARIABLES.md](./docs/ENV_VARIABLES.md)** - 환경 변수 설정 가이드
- **[STRUCTURE.md](./STRUCTURE.md)** - 프로젝트 폴더 구조
- **[../PRD.md](../PRD.md)** - 프로젝트 기획 문서
- **[../database.md](../database.md)** - 데이터베이스 설계
- **[../PROJECT_PLAN.md](../PROJECT_PLAN.md)** - 개발 계획
- **[../CHECKLIST.md](../CHECKLIST.md)** - 개발 체크리스트

---

## 🛠️ 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Storage**: Cloudflare R2 ✅
- **Rate Limiting**: Upstash Redis (예정)
- **Deployment**: Vercel

---

## 🎯 주요 페이지

| URL | 설명 |
|-----|------|
| `/` | 홈페이지 |
| `/rackets` | 라켓 검색/필터 |
| `/brand/[slug]` | 브랜드별 라켓 목록 |
| `/racket/[id]` | 라켓 상세 (스펙 + 리뷰 + 댓글) |
| `/api/reviews` | 리뷰 API |
| `/api/comments` | 댓글 API |

---

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 체크
npm run lint

# Rate Limit 테스트
npm run test:rate-limit
```

---

## 🧪 테스트

### 자동화된 테스트

**Rate Limit 테스트:**
```bash
npm run test:rate-limit
```

이 스크립트는 리뷰와 댓글 API의 Rate Limiting 동작을 테스트합니다.

### 수동 테스트 가이드

전체 테스트 절차는 **[TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)** 문서를 참고하세요.

**주요 테스트 항목:**
- 주요 페이지 기능 테스트
- 필터 조합 테스트
- 리뷰/댓글 작성 테스트
- 반응형 디자인 검증
- 번들 크기 분석
- Lighthouse 성능 점수 확인
- 접근성 검증
- 크로스 브라우저 테스트

### 번들 크기 분석

```bash
npm run build
```

빌드 후 자동으로 번들 크기 분석 결과가 표시됩니다.

---

## 📝 다음 단계

### Phase 1: 기본 설정 ✅
- [x] Next.js 프로젝트 생성
- [x] 폴더 구조 생성
- [x] Supabase 클라이언트 설정
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 생성

### Phase 2: 페이지 개발
- [ ] 랜딩 페이지
- [ ] 라켓 검색/필터 페이지
- [ ] 라켓 상세 페이지
- [ ] 브랜드 페이지

### Phase 3: 커뮤니티 기능
- [ ] 리뷰 시스템
- [ ] 댓글 시스템
- [ ] 사용자 인증

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

MIT License

---

**Made with ❤️ by Tennis Racket Finder Team**
