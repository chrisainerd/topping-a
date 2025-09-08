# Git Flow 브랜치 전략 가이드

## 브랜치 구조

### 메인 브랜치
- **main (또는 master)**: 프로덕션 배포용 브랜치
- **develop**: 개발 통합 브랜치

### 보조 브랜치
- **feature/**: 새로운 기능 개발
- **release/**: 릴리즈 준비
- **hotfix/**: 긴급 버그 수정

## 브랜치 사용법

### 1. 기능 개발 (Feature)
```bash
# develop 브랜치에서 feature 브랜치 생성
git checkout develop
git checkout -b feature/기능명

# 작업 완료 후 develop에 병합
git checkout develop
git merge --no-ff feature/기능명
git branch -d feature/기능명
```

### 2. 릴리즈 준비 (Release)
```bash
# develop에서 release 브랜치 생성
git checkout develop
git checkout -b release/버전명

# 버그 수정 후 main과 develop에 병합
git checkout main
git merge --no-ff release/버전명
git tag -a v버전명 -m "Release version 버전명"

git checkout develop
git merge --no-ff release/버전명
git branch -d release/버전명
```

### 3. 긴급 수정 (Hotfix)
```bash
# main에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/버그명

# 수정 후 main과 develop에 병합
git checkout main
git merge --no-ff hotfix/버그명
git tag -a v버전명 -m "Hotfix version 버전명"

git checkout develop
git merge --no-ff hotfix/버그명
git branch -d hotfix/버그명
```

## 커밋 메시지 규칙

### 형식
```
<타입>: <제목>

<본문> (선택사항)

<꼬리말> (선택사항)
```

### 타입
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 누락 등
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드 추가
- **chore**: 빌드 업무, 패키지 매니저 수정 등

### 예시
```
feat: 실시간 3D 동기화 기능 추가

Socket.IO를 사용하여 여러 디바이스 간 3D 객체 상태 동기화 구현
- 카메라 위치 동기화
- 객체 회전/이동 동기화
- 재질 변경 동기화

Closes #123
```

## 버전 관리

### Semantic Versioning (SemVer)
`MAJOR.MINOR.PATCH` 형식 사용

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환성 있는 기능 추가
- **PATCH**: 하위 호환성 있는 버그 수정

### 태그 생성
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 작업 흐름 예시

### 새 기능 개발
1. `develop`에서 `feature/새기능` 브랜치 생성
2. 기능 개발 및 커밋
3. `develop`에 병합
4. feature 브랜치 삭제

### 릴리즈 프로세스
1. `develop`에서 `release/1.0.0` 브랜치 생성
2. 버그 수정 및 문서 업데이트
3. `main`과 `develop`에 병합
4. 버전 태그 추가
5. release 브랜치 삭제

## 주의사항

1. **main 브랜치 직접 커밋 금지**: 항상 병합을 통해서만 변경
2. **--no-ff 옵션 사용**: 병합 이력을 명확히 남기기 위함
3. **브랜치 이름 규칙 준수**: `타입/설명` 형식 사용
4. **정기적인 develop 동기화**: feature 브랜치 작업 중 주기적으로 develop 변경사항 pull

## 유용한 Git 명령어

```bash
# 브랜치 목록 확인
git branch -a

# 원격 브랜치 동기화
git fetch --all --prune

# 브랜치 그래프 보기
git log --graph --oneline --all

# 마지막 커밋 수정
git commit --amend

# 병합 충돌 해결 후
git add .
git commit -m "Resolve merge conflicts"
```