# 환경 변수 설정 가이드

Tennis Racket Finder 프로젝트에 필요한 모든 환경 변수 목록입니다.

## 📋 목차

1. [로컬 개발 환경](#1-로컬-개발-환경)
2. [Vercel 배포 환경](#2-vercel-배포-환경)
3. [환경 변수 설명](#3-환경-변수-설명)

---

## 1. 로컬 개발 환경

### `.env.local` 파일 생성

프로젝트 루트 (`racket-finder/`)에 `.env.local` 파일을 생성하고 다음 변수들을 추가하세요:

```bash
# ============================================
# Supabase 설정 (필수)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# Cloudflare R2 설정 (필수 - 이미지 업로드 사용 시)
# ============================================
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=tennis-racket-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-{account-id}.r2.dev/tennis-racket-images

# ============================================
# App 설정
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 파일 위치

```
racket-finder/
├── .env.local          ← 여기에 생성
├── .gitignore
├── package.json
└── ...
```

**⚠️ 중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요! `.gitignore`에 이미 포함되어 있습니다.

---

## 2. Vercel 배포 환경

### Vercel Dashboard에서 설정

1. **Project Settings → Environment Variables**
2. 각 변수를 Production, Preview, Development 환경에 추가

### 필수 환경 변수 (모두 동일)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=tennis-racket-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-{account-id}.r2.dev/tennis-racket-images

# App
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**참고**: `NEXT_PUBLIC_APP_URL`은 배포 후 Vercel에서 제공하는 실제 URL로 변경하세요.

---

## 3. 환경 변수 설명

### 3.1 Supabase 환경 변수

#### `NEXT_PUBLIC_SUPABASE_URL`
- **설명**: Supabase 프로젝트 URL
- **형식**: `https://xxxxxxxxxxxxx.supabase.co`
- **설정 위치**: Supabase Dashboard → Settings → API → Project URL
- **필수**: ✅ 예
- **공개 여부**: 공개 가능 (브라우저에서 접근)

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **설명**: Supabase 공개 (익명) API 키
- **형식**: JWT 토큰 (매우 긴 문자열)
- **설정 위치**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- **필수**: ✅ 예
- **공개 여부**: 공개 가능 (브라우저에서 접근, RLS 정책으로 보호됨)

#### `SUPABASE_SERVICE_ROLE_KEY`
- **설명**: Supabase 서비스 롤 키 (관리자 권한)
- **형식**: JWT 토큰 (매우 긴 문자열)
- **설정 위치**: Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`
- **필수**: ✅ 예
- **공개 여부**: ❌ 절대 공개하지 마세요! (서버 사이드에서만 사용)
- **사용 위치**: API Routes에서만 사용

### 3.2 Cloudflare R2 환경 변수

#### `CLOUDFLARE_ACCOUNT_ID`
- **설명**: Cloudflare 계정 ID
- **형식**: 32자리 16진수 문자열
- **설정 위치**: Cloudflare Dashboard → 우측 사이드바 또는 R2 페이지 상단
- **필수**: ✅ 예 (이미지 업로드 사용 시)
- **공개 여부**: 공개 가능

#### `CLOUDFLARE_R2_ACCESS_KEY_ID`
- **설명**: R2 API 토큰의 Access Key ID
- **형식**: 문자열
- **설정 위치**: Cloudflare Dashboard → R2 → Manage R2 API Tokens
- **필수**: ✅ 예 (이미지 업로드 사용 시)
- **공개 여부**: ❌ 공개하지 마세요!

#### `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- **설명**: R2 API 토큰의 Secret Access Key
- **형식**: 문자열 (매우 긴)
- **설정 위치**: Cloudflare Dashboard → R2 → Manage R2 API Tokens
- **필수**: ✅ 예 (이미지 업로드 사용 시)
- **공개 여부**: ❌ 절대 공개하지 마세요! (한 번만 표시됨)

#### `CLOUDFLARE_R2_BUCKET_NAME`
- **설명**: R2 버킷 이름
- **형식**: 문자열 (예: `tennis-racket-images`)
- **설정 위치**: R2 버킷 생성 시 설정한 이름
- **필수**: ✅ 예 (이미지 업로드 사용 시)
- **공개 여부**: 공개 가능

#### `CLOUDFLARE_R2_PUBLIC_URL`
- **설명**: R2 버킷의 공개 URL
- **형식**: `https://pub-{account-id}.r2.dev/{bucket-name}` 또는 커스텀 도메인
- **설정 위치**: R2 버킷 Settings에서 확인 또는 커스텀 도메인 설정
- **필수**: ⚠️ 선택 (없으면 자동 생성됨)
- **공개 여부**: 공개 가능
- **예시**: 
  - R2.dev Public URL: `https://pub-7aa054e4fe15ac11a0cff7dfcd943042.r2.dev/tennis-racket-images`
  - 커스텀 도메인: `https://cdn.yourdomain.com`

### 3.3 App 환경 변수

#### `NEXT_PUBLIC_APP_URL`
- **설명**: 애플리케이션의 공개 URL
- **로컬 개발**: `http://localhost:3000`
- **Vercel 배포**: `https://your-project.vercel.app` 또는 커스텀 도메인
- **필수**: ✅ 예
- **공개 여부**: 공개 가능
- **용도**: 
  - 절대 URL 생성 시 사용
  - 리다이렉트 URL 설정
  - 메타 태그 설정

---

## 🔒 보안 주의사항

### 공개 가능한 환경 변수 (`NEXT_PUBLIC_*`)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

이 변수들은 브라우저에서 접근 가능하므로 공개되어도 됩니다. 하지만 Supabase의 RLS 정책으로 데이터가 보호됩니다.

### 비공개 환경 변수 (서버 사이드만)

- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

이 변수들은 **절대 공개하지 마세요!** GitHub에 커밋하지 않고, 환경 변수로만 관리하세요.

---

## ✅ 환경 변수 확인 방법

### 로컬 개발 환경

```bash
# .env.local 파일 확인 (변수 값은 표시되지 않음)
cat .env.local

# 특정 변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL  # Linux/macOS
echo %NEXT_PUBLIC_SUPABASE_URL% # Windows CMD
$env:NEXT_PUBLIC_SUPABASE_URL   # PowerShell
```

### Vercel 배포 환경

1. Vercel Dashboard → Project Settings → Environment Variables
2. 모든 변수가 추가되었는지 확인
3. 배포 후 Runtime Logs에서 오류 확인

---

## 🔍 환경 변수 누락 시 오류

### Supabase 변수 누락

```
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**해결**: `.env.local`에 Supabase 환경 변수 추가

### R2 변수 누락

```
Error: R2 환경 변수가 설정되지 않았습니다.
```

**해결**: `.env.local`에 Cloudflare R2 환경 변수 추가 (이미지 업로드 사용 시)

---

## 📚 관련 문서

- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [Cloudflare R2 설정 가이드](./R2_SETUP.md)
- [배포 가이드](./DEPLOYMENT_GUIDE.md)

---

**마지막 업데이트**: 2026-01-02

