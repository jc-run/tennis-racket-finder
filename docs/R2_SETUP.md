# Cloudflare R2 설정 가이드

Cloudflare R2를 사용한 이미지 저장소 설정 방법입니다.

## 📋 목차

1. [R2 버킷 생성](#1-r2-버킷-생성)
2. [R2 API 토큰 생성](#2-r2-api-토큰-생성)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [버킷 공개 설정](#4-버킷-공개-설정)
5. [사용 방법](#5-사용-방법)

---

## 1. R2 버킷 생성

1. **Cloudflare 대시보드 접속**
   - https://dash.cloudflare.com 접속
   - 로그인

2. **R2 메뉴로 이동**
   - 왼쪽 사이드바에서 **R2** 클릭
   - "Create bucket" 버튼 클릭

3. **버킷 생성**
   - **버킷 이름**: `tennis-racket-images` (또는 원하는 이름)
   - **Location**: 자동 선택 또는 원하는 지역 선택
   - "Create bucket" 클릭

---

## 2. R2 API 토큰 생성

1. **R2 API Tokens 메뉴**
   - R2 페이지에서 **Manage R2 API Tokens** 클릭
   - 또는: https://dash.cloudflare.com/profile/api-tokens

2. **API 토큰 생성**
   - "Create API token" 클릭
   - **Permissions**: `Object Read & Write` 선택
   - **Account Resources**: `Include` → `All accounts` 또는 특정 계정 선택
   - **TTL**: 만료 시간 설정 (선택사항, 비워두면 영구 토큰)
   - "Continue to summary" → "Create Token"

3. **토큰 정보 저장**
   - **Access Key ID**: 복사하여 안전한 곳에 저장
   - **Secret Access Key**: 복사하여 안전한 곳에 저장 (한 번만 표시됨!)

4. **Account ID 확인**
   - Cloudflare 대시보드 우측 사이드바에서 **Account ID** 확인
   - 또는: R2 페이지 상단에 표시된 Account ID

---

## 3. 환경 변수 설정

프로젝트 루트의 `.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# Cloudflare R2 설정
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id-here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key-here
CLOUDFLARE_R2_BUCKET_NAME=tennis-racket-images

# R2 공개 URL (선택사항)
# 커스텀 도메인을 사용하는 경우:
# CLOUDFLARE_R2_PUBLIC_URL=https://cdn.yourdomain.com
# 사용하지 않으면 자동으로 R2 공개 URL 사용: https://pub-{account-id}.r2.dev/{bucket-name}
```

### 환경 변수 설명

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID
- `CLOUDFLARE_R2_ACCESS_KEY_ID`: R2 API 토큰의 Access Key ID
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: R2 API 토큰의 Secret Access Key
- `CLOUDFLARE_R2_BUCKET_NAME`: 생성한 R2 버킷 이름
- `CLOUDFLARE_R2_PUBLIC_URL`: (선택) 커스텀 도메인 사용 시 공개 URL

---

## 4. 버킷 공개 설정

업로드된 이미지를 공개적으로 접근 가능하게 하려면 R2 버킷을 공개로 설정해야 합니다.

### 방법 1: R2.dev Public URL 사용 (간단, 권장)

**도메인 없이 바로 사용 가능한 방법입니다.**

1. R2 페이지에서 생성한 버킷 클릭
2. **Settings** 탭으로 이동
3. **"R2.dev subdomain"** 또는 **"Public Bucket Access"** 섹션 찾기
   - 옵션 이름이 다를 수 있음: "Enable public access", "R2.dev subdomain", "Public Access" 등
4. 활성화/ON으로 설정
5. 생성된 Public URL 확인:
   - 형식: `https://pub-{account-id}.r2.dev/{bucket-name}`
   - 예: `https://pub-7aa054e4fe15ac11a0cff7dfcd943042.r2.dev/tennis-racket-images`

**참고**: 이미 코드에서 자동으로 이 URL을 사용하도록 설정되어 있습니다. 버킷만 활성화하면 바로 사용 가능합니다!

### 방법 2: Custom Domain 설정 (도메인이 있는 경우)

**더 나은 성능과 커스텀 URL을 원할 때 사용합니다.**

#### 2.1 버킷에 Custom Domain 추가

1. R2 버킷 → **Settings** 탭
2. **"Custom Domains"** 섹션 찾기
3. **"Connect Domain"** 또는 **"Add Custom Domain"** 클릭
4. 사용할 서브도메인 입력 (예: `cdn.yourdomain.com` 또는 `images.yourdomain.com`)
5. **"Connect Domain"** 클릭

#### 2.2 DNS 설정

**도메인이 Cloudflare에 있는 경우:**
- 자동으로 DNS 레코드가 생성됩니다

**다른 DNS 서비스를 사용하는 경우:**
1. 도메인 DNS 설정으로 이동
2. 다음 CNAME 레코드 추가:
   - **타입**: CNAME
   - **이름**: `cdn` (또는 원하는 서브도메인)
   - **값**: Cloudflare가 제공하는 타겟 (예: `{account-id}.r2.cloudflarestorage.com`)
   - **TTL**: 자동 또는 3600

#### 2.3 환경 변수에 추가

`.env.local` 파일에 다음을 추가:
```bash
CLOUDFLARE_R2_PUBLIC_URL=https://cdn.yourdomain.com
```

### 방법 2: CORS 설정 (필요한 경우)

브라우저에서 직접 업로드하는 경우 CORS 설정이 필요할 수 있습니다.

1. 버킷 **Settings** 탭
2. **CORS Policy** 섹션
3. 다음 설정 추가:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 5. 사용 방법

### 5.1 프로필 이미지 업로드

```typescript
const form_data = new FormData();
form_data.append('file', image_file); // File 객체

const response = await fetch('/api/upload?type=profile', {
  method: 'POST',
  body: form_data,
  headers: {
    // 인증 토큰이 필요할 수 있음 (쿠키에 자동 포함)
  },
});

const data = await response.json();
// { url: "https://...", path: "uploads/profile/...", ... }
```

### 5.2 일반 이미지 업로드

```typescript
const form_data = new FormData();
form_data.append('file', image_file);

const response = await fetch('/api/upload?type=general', {
  method: 'POST',
  body: form_data,
});

const data = await response.json();
// { url: "https://...", path: "uploads/general/...", ... }
```

### 5.3 React 컴포넌트 예제

```tsx
'use client';

import { useState } from 'react';

export function ImageUpload() {
  const [uploading, set_uploading] = useState(false);
  const [image_url, set_image_url] = useState<string | null>(null);

  const handle_file_change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    set_uploading(true);

    try {
      const form_data = new FormData();
      form_data.append('file', file);

      const response = await fetch('/api/upload?type=profile', {
        method: 'POST',
        body: form_data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '업로드 실패');
      }

      const data = await response.json();
      set_image_url(data.url);
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      set_uploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handle_file_change}
        disabled={uploading}
      />
      {uploading && <p>업로드 중...</p>}
      {image_url && (
        <img src={image_url} alt="Uploaded" style={{ maxWidth: '200px' }} />
      )}
    </div>
  );
}
```

---

## 🔍 문제 해결

### 업로드가 실패하는 경우

1. **환경 변수 확인**
   - `.env.local` 파일에 모든 R2 환경 변수가 올바르게 설정되었는지 확인
   - 개발 서버 재시작 필요

2. **버킷 권한 확인**
   - API 토큰이 올바른 권한을 가지고 있는지 확인
   - 버킷 이름이 정확한지 확인

3. **네트워크 확인**
   - Cloudflare R2 엔드포인트에 접근 가능한지 확인
   - 방화벽이나 네트워크 제한이 없는지 확인

### 이미지가 공개되지 않는 경우

1. **버킷 공개 설정 확인**
   - R2 버킷 Settings에서 Public Access 활성화 확인

2. **URL 확인**
   - `CLOUDFLARE_R2_PUBLIC_URL` 환경 변수가 올바른지 확인
   - 커스텀 도메인을 사용하는 경우 DNS 설정 확인

---

## 📚 추가 리소스

- [Cloudflare R2 공식 문서](https://developers.cloudflare.com/r2/)
- [AWS S3 SDK 문서](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/) (R2는 S3 호환 API 사용)

