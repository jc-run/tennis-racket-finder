# 🚀 배포 가이드 - Vercel

Tennis Racket Finder 프로젝트를 Vercel에 배포하는 방법입니다.

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [Vercel 계정 생성](#2-vercel-계정-생성)
3. [GitHub 저장소 준비](#3-github-저장소-준비)
4. [Vercel 프로젝트 생성](#4-vercel-프로젝트-생성)
5. [환경 변수 설정](#5-환경-변수-설정)
6. [배포 실행](#6-배포-실행)
7. [배포 확인](#7-배포-확인)
8. [도메인 연결 (선택)](#8-도메인-연결-선택)
9. [문제 해결](#9-문제-해결)

---

## 1. 사전 준비

배포 전 다음 항목을 확인하세요:

### 1.1 필수 확인 사항

- [ ] 로컬에서 빌드가 성공적으로 완료됨 (`npm run build`)
- [ ] 모든 환경 변수가 `.env.local`에 설정됨
- [ ] GitHub 저장소에 코드가 푸시됨
- [ ] Supabase 프로젝트가 생성되고 스키마가 적용됨
- [ ] Cloudflare R2 버킷이 생성되고 설정됨

### 1.2 로컬 빌드 테스트

```bash
cd racket-finder
npm run build
```

**빌드가 실패하면 배포하지 마세요!** 빌드 오류를 먼저 수정하세요.

---

## 2. Vercel 계정 생성

### 2.1 Vercel 가입

1. **Vercel 웹사이트 접속**
   - https://vercel.com 접속

2. **계정 생성**
   - "Sign Up" 클릭
   - GitHub 계정으로 로그인 (권장) 또는 이메일로 가입

3. **계정 확인**
   - 이메일로 가입한 경우 확인 메일 확인

### 2.2 Vercel 대시보드 확인

가입 후 https://vercel.com/dashboard 접속하여 대시보드가 표시되는지 확인하세요.

---

## 3. GitHub 저장소 준비

### 3.1 GitHub 저장소 생성 (아직 없다면)

```bash
# GitHub에서 새 저장소 생성
# 1. https://github.com/new 접속
# 2. Repository name: tennis-racket-finder
# 3. Public 또는 Private 선택
# 4. "Create repository" 클릭
```

### 3.2 로컬 코드 푸시

```bash
# 프로젝트 루트에서 실행
cd "C:\Users\chool\Desktop\60. Ai\10. Cursor\tennis racket1"

# Git 초기화 (아직 안 했다면)
git init

# .gitignore 확인 (중요: .env.local이 포함되어 있는지 확인)
cat racket-finder/.gitignore

# 변경 사항 추가
git add .

# 커밋
git commit -m "Initial commit: Tennis Racket Finder"

# GitHub 저장소 추가
git remote add origin https://github.com/your-username/tennis-racket-finder.git

# 또는 SSH 사용
# git remote add origin git@github.com:your-username/tennis-racket-finder.git

# 푸시
git branch -M main
git push -u origin main
```

**⚠️ 중요**: `.env.local` 파일은 절대 커밋하지 마세요! `.gitignore`에 포함되어 있어야 합니다.

---

## 4. Vercel 프로젝트 생성

### 4.1 프로젝트 생성 시작

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **"Add New..." → "Project" 클릭**
   - 또는 "Import Project" 클릭

3. **GitHub 저장소 선택**
   - GitHub 계정 연동 (처음이면 권한 요청 승인)
   - `tennis-racket-finder` 저장소 선택
   - "Import" 클릭

### 4.2 프로젝트 설정

**Configure Project 화면에서:**

1. **Project Name**: `tennis-racket-finder` (또는 원하는 이름)
2. **Root Directory**: `racket-finder` 선택 ⚠️ **중요!**
   - 프로젝트가 `racket-finder` 폴더 안에 있으므로 반드시 설정 필요
   - "Root Directory" 드롭다운에서 `racket-finder` 선택
   - 이 설정을 하지 않으면 빌드가 실패합니다!
3. **Framework Preset**: Next.js (자동 감지됨)
4. **Build Command**: `npm run build` (기본값)
5. **Output Directory**: `.next` (기본값)
6. **Install Command**: `npm install` (기본값)

**⚠️ 중요**: Root Directory를 `racket-finder`로 설정하지 않으면 빌드가 실패합니다!

**Root Directory 설정 방법:**
1. "Root Directory" 필드 클릭
2. 드롭다운에서 `racket-finder` 선택
3. 또는 직접 입력: `racket-finder`

---

## 5. 환경 변수 설정

### 5.1 Vercel 환경 변수 추가

프로젝트 설정 화면에서 **"Environment Variables"** 섹션으로 이동:

#### 필수 환경 변수 (모두 추가)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=tennis-racket-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-{account-id}.r2.dev/tennis-racket-images

# App (배포 후 실제 URL로 업데이트)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**💡 팁**: `NEXT_PUBLIC_APP_URL`은 배포가 완료된 후 Vercel에서 제공하는 실제 URL로 변경하세요. 처음에는 임시 URL로 설정해도 됩니다.
```

### 5.2 환경 변수 추가 방법

1. **각 변수마다:**
   - Key: 변수 이름 (예: `NEXT_PUBLIC_SUPABASE_URL`)
   - Value: 변수 값
   - Environment: **Production, Preview, Development** 모두 선택 (또는 필요한 것만)
   - "Add" 클릭

2. **모든 변수 추가 완료 후:**
   - "Deploy" 버튼 클릭

### 5.3 환경별 설정 (선택)

- **Production**: 프로덕션 환경 (main 브랜치)
- **Preview**: 프리뷰 환경 (PR/브랜치)
- **Development**: 개발 환경

대부분의 경우 Production과 Preview에 동일하게 설정하면 됩니다.

---

## 6. 배포 실행

### 6.1 첫 배포

환경 변수 설정 후 **"Deploy"** 버튼을 클릭하면 배포가 시작됩니다.

### 6.2 배포 진행 상황 확인

1. **배포 로그 확인**
   - 배포 페이지에서 실시간 로그 확인
   - 빌드 단계별 진행 상황 표시

2. **예상 시간**
   - 첫 배포: 약 2-5분
   - 이후 배포: 약 1-3분

### 6.3 자동 배포 설정

기본적으로 다음 경우에 자동 배포됩니다:

- **Production**: `main` (또는 `master`) 브랜치에 푸시할 때
- **Preview**: 다른 브랜치나 Pull Request 생성 시

**설정 변경:**
- Project Settings → Git → Production Branch 설정

---

## 7. 배포 확인

### 7.1 배포 성공 확인

배포가 완료되면:

1. **배포 URL 확인**
   - 예: `https://tennis-racket-finder.vercel.app`
   - 또는: `https://your-project.vercel.app`

2. **사이트 접속 테스트**
   - 배포 URL을 브라우저에서 열기
   - 홈페이지가 정상적으로 로드되는지 확인

### 7.2 프로덕션 환경 테스트

**체크리스트:**

- [ ] 홈페이지 로드 확인 (`/`)
- [ ] 브랜드 목록 표시 확인
- [ ] 라켓 검색 페이지 확인 (`/rackets`)
- [ ] 필터 작동 확인
- [ ] 라켓 상세 페이지 확인 (`/racket/[id]`)
- [ ] 로그인/회원가입 페이지 확인 (`/auth/login`, `/auth/signup`)
- [ ] 프로필 페이지 확인 (`/profile`) - 로그인 필요
- [ ] 리뷰 작성 기능 확인
- [ ] 댓글 작성 기능 확인
- [ ] 이미지 업로드 기능 확인 (프로필 이미지 등)

### 7.3 SSL 인증서 확인

**Vercel은 자동으로 SSL 인증서를 제공합니다:**

1. **HTTPS 확인**
   - 배포 URL이 `https://`로 시작하는지 확인
   - 브라우저 주소창에 자물쇠 아이콘 표시 확인

2. **SSL 인증서 자동 갱신**
   - Vercel이 자동으로 관리하므로 별도 설정 불필요

---

## 8. 도메인 연결 (선택)

### 8.1 커스텀 도메인 추가

1. **Project Settings → Domains**
2. **"Add" 버튼 클릭**
3. **도메인 입력** (예: `www.yourdomain.com`)
4. **DNS 설정 안내 따르기**

### 8.2 DNS 설정

Vercel이 제공하는 DNS 레코드를 도메인 등록 기관에서 추가:

**예시 (Cloudflare DNS 사용 시):**
```
Type: CNAME
Name: www
Content: cname.vercel-dns.com
Proxy: Off (또는 DNS only)
```

### 8.3 환경 변수 업데이트

커스텀 도메인을 사용하는 경우:

1. **Vercel 환경 변수 업데이트:**
   ```
   NEXT_PUBLIC_APP_URL=https://www.yourdomain.com
   ```

2. **Supabase 설정 업데이트 (필요한 경우):**
   - Supabase Dashboard → Authentication → URL Configuration
   - Site URL을 새 도메인으로 변경

3. **배포 다시 실행** (환경 변수 변경 후)

---

## 9. 문제 해결

### 9.1 빌드 실패

**문제**: 배포 시 빌드가 실패함

**해결 방법:**
1. 로컬에서 빌드 테스트: `npm run build`
2. 빌드 로그 확인하여 오류 찾기
3. TypeScript 오류 확인
4. 의존성 문제 확인

**일반적인 원인:**
- 환경 변수 누락
- TypeScript 타입 오류
- 의존성 버전 충돌

### 9.2 환경 변수 오류

**문제**: 런타임 오류 발생 (API 호출 실패 등)

**해결 방법:**
1. Vercel Dashboard → Project Settings → Environment Variables 확인
2. 모든 필수 환경 변수가 추가되었는지 확인
3. 변수 이름 오타 확인 (대소문자 구분)
4. 값이 올바른지 확인

### 9.3 이미지 로드 실패

**문제**: Cloudflare R2 이미지가 표시되지 않음

**해결 방법:**
1. R2 버킷 Public Access 활성화 확인
2. `CLOUDFLARE_R2_PUBLIC_URL` 환경 변수 확인
3. `next.config.ts`에 R2 도메인이 추가되었는지 확인

### 9.4 API 호출 실패

**문제**: Supabase API 호출이 실패함

**해결 방법:**
1. Supabase 프로젝트가 활성화되어 있는지 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. API 키가 올바른지 확인

### 9.5 성능 문제

**문제**: 페이지 로딩이 느림

**해결 방법:**
1. Vercel Analytics 활성화하여 성능 측정
2. 이미지 최적화 확인 (Next.js Image 컴포넌트 사용)
3. 번들 크기 확인 (`npm run build` 후 출력 확인)

---

## 10. 배포 후 체크리스트

배포 완료 후 다음 항목을 확인하세요:

### 필수 확인 사항

- [ ] 배포 URL로 사이트 접속 가능
- [ ] HTTPS 연결 확인 (SSL 인증서)
- [ ] 홈페이지 정상 로드
- [ ] 주요 페이지 모두 접근 가능
- [ ] 로그인/회원가입 기능 작동
- [ ] API 호출 정상 작동
- [ ] 이미지 로드 정상
- [ ] 필터 기능 작동
- [ ] 리뷰/댓글 작성 가능

### 추가 확인 사항

- [ ] 모바일 반응형 디자인 확인
- [ ] Lighthouse 성능 점수 확인 (목표: 90점 이상)
- [ ] 브라우저 콘솔에 에러 없는지 확인
- [ ] Vercel Analytics 설정 (선택)

---

## 📚 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 환경 변수 가이드](https://vercel.com/docs/environment-variables)

---

## 💡 팁

1. **프리뷰 배포 활용**
   - Pull Request 생성 시 자동으로 프리뷰 URL 생성
   - 배포 전 테스트에 활용

2. **환경 변수 관리**
   - 민감한 정보는 환경 변수로 관리
   - `.env.local`은 절대 커밋하지 않기

3. **배포 로그 확인**
   - 배포 실패 시 상세 로그 확인
   - 빌드 시간도 확인 가능

4. **자동 배포 최적화**
   - 필요한 경우에만 배포되도록 브랜치 전략 설정
   - `vercel.json`에서 빌드 설정 커스터마이즈

---

**마지막 업데이트**: 2026-01-02

