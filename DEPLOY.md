# CloudFront 배포 가이드

## 🚀 배포 설정 완료!

이 프로젝트는 AWS CloudFront + S3 정적 배포에 최적화되어 있습니다.

### ✅ 완료된 설정들

#### 1. Next.js 설정 (next.config.mjs)
- `output: 'export'` - 정적 파일 생성
- `trailingSlash: true` - S3 경로 호환
- `distDir: 'out'` - 빌드 결과 폴더
- `images.unoptimized: true` - CloudFront 이미지 처리

#### 2. 동적 라우팅 대응
- 모든 `[date]` 페이지에 `generateStaticParams()` 추가
- 정적 파일로 pre-rendering 완료

#### 3. SEO 최적화
- `robots.txt` - 검색엔진 크롤링 가이드
- `sitemap.xml` - 사이트맵 제공
- 메타 태그 최적화 완료

#### 4. 자동 배포 (GitHub Actions)
- `.github/workflows/deploy.yml` 설정 완료
- S3 동기화 + CloudFront 무효화 자동화

### 🛠 AWS 설정 필요사항

#### 1. S3 버킷 생성
```bash
# 버킷 이름: news-games-frontend
aws s3 mb s3://news-games-frontend
aws s3 website s3://news-games-frontend --index-document index.html --error-document 404.html
```

#### 2. CloudFront 배포 설정
- **Origin**: S3 버킷 (news-games-frontend)
- **Default Root Object**: `index.html`
- **Error Pages**: 
  - 404 → `/404.html` (또는 `/index.html` for SPA)
  - 403 → `/index.html`
- **Cache Behaviors**:
  - `/_next/static/*` → Cache 1년 (immutable)
  - `/images/*`, `/icons/*` → Cache 1년 (immutable) 
  - `*.html` → Cache 1시간 (revalidate)

#### 3. GitHub Secrets 설정
Repository Settings → Secrets and variables → Actions에서 추가:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=news-games-frontend
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
```

### 📦 수동 배포 방법

```bash
# 1. 빌드
npm run build

# 2. S3 업로드
aws s3 sync ./out s3://news-games-frontend --delete

# 3. CloudFront 캐시 무효화
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

### 🎯 예상 URL 구조

```
https://gi.sedaily.ai/                    # 메인 페이지
https://gi.sedaily.ai/games/              # 게임 허브
https://gi.sedaily.ai/games/g1/           # BlackSwan 게임
https://gi.sedaily.ai/games/g1/play/      # BlackSwan 연습모드
https://gi.sedaily.ai/games/g1/20241017/  # BlackSwan 특정날짜
https://gi.sedaily.ai/games/g1/archive/   # BlackSwan 아카이브
https://gi.sedaily.ai/games/g2/           # PrisonersDilemma 게임
https://gi.sedaily.ai/games/g3/           # SignalDecoding 게임
```

### 📊 성능 최적화

- **First Load JS**: 101kB (최적화 완료)
- **이미지**: WebP 포맷 사용
- **번들 분할**: 페이지별 코드 스플리팅
- **캐싱**: 정적 리소스 1년, 페이지 1시간
- **압축**: Gzip/Brotli 자동 적용

### 🔧 로컬 개발

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드 + Export
npm run deploy       # S3 + CloudFront 배포
```

---

**🎉 배포 준비 완료!**
이제 GitHub에 push하면 자동으로 배포됩니다.