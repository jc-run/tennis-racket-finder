# 🔐 Supabase Auth 설정 가이드

## 1. Supabase 대시보드에서 인증 설정

### 1.1 이메일 인증 활성화

1. **Supabase 대시보드 접속**
   - https://app.supabase.com
   - 프로젝트 선택

2. **Authentication 메뉴**
   - 좌측 메뉴에서 **Authentication** 클릭
   - **Providers** 탭 선택

3. **Email 설정**
   - Email 항목 찾기
   - **Enable Email provider** 토글 ON
   - **Confirm email** 설정:
     - 개발 중: OFF (빠른 테스트)
     - 프로덕션: ON (보안)
   - **Save** 클릭

### 1.2 이메일 템플릿 설정 (선택)

1. **Email Templates** 탭
2. 다음 템플릿 커스터마이징 가능:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

---

## 2. 소셜 로그인 설정 (선택)

### 2.1 Google 로그인

1. **Google Cloud Console**
   - https://console.cloud.google.com
   - OAuth 2.0 클라이언트 ID 생성

2. **Supabase 설정**
   - Authentication > Providers > Google
   - Client ID와 Client Secret 입력
   - **Save**

### 2.2 GitHub 로그인

1. **GitHub Settings**
   - Settings > Developer settings > OAuth Apps
   - New OAuth App 생성

2. **Supabase 설정**
   - Authentication > Providers > GitHub
   - Client ID와 Client Secret 입력
   - **Save**

---

## 3. 인증 흐름

### 3.1 회원가입

```typescript
import { signUpWithEmail } from '@/lib/auth/auth-helpers';

const handleSignup = async () => {
  try {
    await signUpWithEmail({
      email: 'user@example.com',
      password: 'password123',
      username: 'username',
      display_name: 'Display Name'
    });
    // 성공 처리
  } catch (error) {
    // 에러 처리
  }
};
```

### 3.2 로그인

```typescript
import { signInWithEmail } from '@/lib/auth/auth-helpers';

const handleLogin = async () => {
  try {
    await signInWithEmail({
      email: 'user@example.com',
      password: 'password123'
    });
    // 성공 처리
  } catch (error) {
    // 에러 처리
  }
};
```

### 3.3 로그아웃

```typescript
import { signOut } from '@/lib/auth/auth-helpers';

const handleLogout = async () => {
  try {
    await signOut();
    // 성공 처리
  } catch (error) {
    // 에러 처리
  }
};
```

### 3.4 현재 사용자 확인

```typescript
import { getCurrentUser } from '@/lib/auth/auth-helpers';

const checkUser = async () => {
  try {
    const user = await getCurrentUser();
    console.log('Current user:', user);
  } catch (error) {
    console.log('Not logged in');
  }
};
```

---

## 4. 사용자 프로필 자동 생성

### 4.1 Database Trigger 생성

Supabase SQL Editor에서 실행:

```sql
-- 사용자 가입 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 5. RLS 정책 확인

### 5.1 user_profiles 테이블

```sql
-- 모든 사용자가 프로필 조회 가능
CREATE POLICY "profiles_select_policy" 
  ON user_profiles FOR SELECT 
  USING (true);

-- 본인 프로필만 수정 가능
CREATE POLICY "profiles_update_policy" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);
```

### 5.2 reviews 테이블

```sql
-- 인증된 사용자만 리뷰 작성 가능
CREATE POLICY "reviews_insert_policy" 
  ON reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 본인 리뷰만 수정/삭제 가능
CREATE POLICY "reviews_update_policy" 
  ON reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_policy" 
  ON reviews FOR DELETE 
  USING (auth.uid() = user_id);
```

---

## 6. 테스트

### 6.1 회원가입 테스트

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `/auth/signup` 접속 (추후 구현)
3. 이메일/비밀번호 입력
4. Supabase Dashboard > Authentication > Users에서 확인

### 6.2 로그인 테스트

1. `/auth/login` 접속 (추후 구현)
2. 가입한 이메일/비밀번호로 로그인
3. 세션 확인

---

## 7. 보안 설정

### 7.1 비밀번호 정책

Supabase Dashboard > Authentication > Policies:
- **Minimum password length**: 8자 이상 권장
- **Password strength**: Strong 권장

### 7.2 Rate Limiting

- 로그인 시도 제한: 기본 설정 사용
- 회원가입 제한: Upstash로 추가 제한 (Phase 8)

### 7.3 이메일 확인

프로덕션 환경:
- **Confirm email** ON
- 사용자가 이메일 확인 후 로그인 가능

---

## 8. 환경별 설정

### 8.1 개발 환경

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 8.2 프로덕션 환경

```bash
# Vercel 환경 변수
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 9. 문제 해결

### Q1: "Email not confirmed" 오류

**원인**: 이메일 확인이 필요한 설정

**해결**:
- 개발 중: Authentication > Providers > Email에서 "Confirm email" OFF
- 또는: 이메일 확인 링크 클릭

### Q2: "Invalid login credentials" 오류

**원인**: 잘못된 이메일/비밀번호

**해결**:
- 이메일/비밀번호 재확인
- Supabase Dashboard > Authentication > Users에서 사용자 확인

### Q3: RLS 정책으로 인한 접근 거부

**원인**: Row Level Security 정책

**해결**:
- SQL Editor에서 RLS 정책 확인
- `auth.uid()`가 올바른지 확인

---

## 10. 다음 단계

### Phase 10에서 구현할 항목
- [ ] 로그인 페이지 UI
- [ ] 회원가입 페이지 UI
- [ ] 비밀번호 재설정 페이지
- [ ] 사용자 프로필 페이지
- [ ] 로그인 상태 표시 (Header)

---

**Auth 설정 완료!** 🔐

이제 기본 인증 인프라가 준비되었습니다.
Phase 10에서 UI를 구현하면 완전한 인증 시스템이 됩니다.

