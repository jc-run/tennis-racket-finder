# GitHub 저장소 생성 및 푸시 가이드

## 1. GitHub 저장소 생성

1. **GitHub 웹사이트 접속**
   - https://github.com 로그인

2. **새 저장소 생성**
   - 우측 상단 "+" 버튼 클릭 → "New repository"
   - 또는: https://github.com/new 접속

3. **저장소 정보 입력**
   - **Repository name**: `tennis-racket-finder` (또는 원하는 이름)
   - **Description**: "테니스 라켓 검색/필터 + 커뮤니티 플랫폼"
   - **Visibility**: Public 또는 Private 선택
   - **⚠️ 중요**: "Initialize this repository with a README" 체크박스는 **체크하지 마세요!**
   - "Create repository" 클릭

## 2. 저장소 연결 및 푸시

GitHub에서 저장소를 생성한 후, 아래 명령어를 실행하세요:

```bash
# 저장소 URL을 본인의 GitHub 사용자명과 저장소명으로 변경하세요
git remote add origin https://github.com/YOUR_USERNAME/tennis-racket-finder.git

# 또는 SSH 사용 (SSH 키가 설정되어 있다면)
# git remote add origin git@github.com:YOUR_USERNAME/tennis-racket-finder.git

# 코드 푸시
git push -u origin main
```

**예시:**
```bash
# GitHub 사용자명이 "jc-run"인 경우
git remote add origin https://github.com/jc-run/tennis-racket-finder.git
git push -u origin main
```

## 3. 인증

최초 푸시 시 GitHub 인증이 필요할 수 있습니다:

### Personal Access Token 사용 (권장)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 권한 선택: `repo` (전체 저장소 권한)
4. 토큰 생성 후 복사
5. 푸시 시 비밀번호 대신 토큰 입력

### GitHub CLI 사용
```bash
# GitHub CLI 설치 후
gh auth login
git push -u origin main
```

---

**저장소 생성 후 위 명령어를 실행하세요!**

