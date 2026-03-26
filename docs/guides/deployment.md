# 🚀 Marvel Hero Discovery - 배포 가이드

## 📋 개요

이 프로젝트는 **동적 경로 감지 시스템**을 사용하여 다양한 서버 환경에 배포할 수 있도록 구성되었습니다.

**한 번 빌드하면 어떤 경로에든 배포 가능합니다!**

---

## ✨ 주요 특징

### 🎯 자동 경로 감지
- ✅ 루트 경로: `https://example.com/`
- ✅ 서브 경로: `https://example.com/apps/marvel/`
- ✅ 깊은 경로: `https://example.com/services/games/marvel-hero/`
- ✅ 모두 **동일한 빌드 파일**로 작동

### 🔧 작동 원리
1. **빌드 시**: 상대 경로(`./assets/...`) 사용
2. **런타임**: 현재 HTML 위치를 자동 감지하여 리소스 경로 생성
3. **결과**: 재빌드 없이 다양한 경로에 배포 가능

---

## 🏗️ 빌드 방법

### 개발 환경
```bash
npm run dev
```
- 포트: 8000
- URL: http://localhost:8000

### 프로덕션 빌드
```bash
npm run build
```
- 출력: `dist/` 폴더
- 빌드 크기: ~296KB (gzipped: ~95KB)

### 빌드 미리보기
```bash
npm run preview
```

---

## 📦 배포 방법

### 1. 루트 경로 배포

**서버 구조**:
```
www/
└── dist/
    ├── index.html
    ├── assets/
    │   ├── backgrounds/
    │   ├── characters/
    │   ├── sounds/
    │   ├── videos/
    │   └── (css, js 파일들)
    └── vite.svg
```

**접근 URL**: `https://example.com/`

**설정**: 특별한 설정 불필요, 그냥 배포하면 됨

---

### 2. 서브 디렉토리 배포

**서버 구조**:
```
www/
└── apps/
    └── marvel/
        ├── index.html
        ├── assets/
        └── vite.svg
```

**접근 URL**: `https://example.com/apps/marvel/`

**배포 방법**:
```bash
# 빌드
npm run build

# dist 폴더의 내용을 서버의 /apps/marvel/ 경로에 업로드
scp -r dist/* user@server:/var/www/apps/marvel/
```

**설정**: 특별한 설정 불필요! 자동으로 경로 감지

---

### 3. 깊은 경로 배포

**서버 구조**:
```
www/
└── services/
    └── games/
        └── marvel-hero/
            ├── index.html
            ├── assets/
            └── vite.svg
```

**접근 URL**: `https://example.com/services/games/marvel-hero/`

**배포 방법**:
```bash
npm run build
# 원하는 경로에 업로드
```

**설정**: 역시 특별한 설정 불필요!

---

## 🌐 웹 서버 설정

### Apache (.htaccess)

**서브 디렉토리 배포 시**:
```apache
# /apps/marvel/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /apps/marvel/

  # SPA 라우팅 지원
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
</IfModule>
```

### Nginx

**서브 디렉토리 배포 시**:
```nginx
location /apps/marvel/ {
    alias /var/www/apps/marvel/;
    try_files $uri $uri/ /apps/marvel/index.html;

    # 캐싱 설정 (선택사항)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Node.js / Express

```javascript
const express = require('express')
const path = require('path')
const app = express()

// 서브 경로에 배포
app.use('/apps/marvel', express.static(path.join(__dirname, 'dist')))

// SPA 폴백
app.get('/apps/marvel/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(3000)
```

---

## 🧪 배포 테스트

### 로컬 테스트 (서브 디렉토리 시뮬레이션)

**방법 1: Python HTTP Server**
```bash
# dist 폴더로 이동
cd dist

# 서버 실행
python -m http.server 8080

# 브라우저에서 테스트
# http://localhost:8080/
```

**방법 2: npx serve**
```bash
npx serve dist -p 8080

# 브라우저에서 테스트
# http://localhost:8080/
```

**방법 3: 서브 디렉토리 테스트**
```bash
# dist 폴더를 subdirectory로 복사
mkdir -p test-deploy/apps/marvel
cp -r dist/* test-deploy/apps/marvel/

# 서버 실행
cd test-deploy
python -m http.server 8080

# 브라우저에서 테스트
# http://localhost:8080/apps/marvel/
```

### 확인사항 ✅

배포 후 다음을 확인하세요:

- [ ] 인트로 화면 배경 이미지 표시
- [ ] 로딩 비디오 재생
- [ ] 퀴즈 선택 시 사운드 재생
- [ ] Gallery에서 모든 히어로 이미지 표시
- [ ] Result 화면에서 히어로 비디오 재생 및 오디오 출력
- [ ] 브라우저 개발자 도구에서 404 에러 없음

---

## 🐛 문제 해결

### 리소스를 찾을 수 없음 (404 에러)

**증상**:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
GET https://example.com/apps/marvel/assets/characters/hero.webp
```

**원인**: 파일이 올바른 위치에 없음

**해결**:
1. `dist/assets/` 폴더가 서버에 올바르게 업로드되었는지 확인
2. 서버의 파일 권한 확인 (`chmod -R 755 dist/`)
3. 브라우저 캐시 삭제 후 재시도

---

### 빌드 후 경로가 깨짐

**증상**: 로컬에서는 되는데 서버에서 안 됨

**확인사항**:
1. `vite.config.js`에서 `base: './'` 설정 확인
2. 모든 리소스가 `getAssetPath()` 사용하는지 확인
3. 빌드 후 `dist/index.html`에서 경로가 `./assets/...`인지 확인

---

### 동영상/이미지가 안 보임

**증상**: HTML은 로드되지만 미디어가 안 보임

**해결**:
1. MIME 타입 확인
   ```apache
   # Apache .htaccess
   AddType video/mp4 .mp4
   AddType image/webp .webp
   AddType audio/mpeg .mp3
   ```

2. 파일 크기 확인
   - 서버 업로드 제한 확인
   - PHP: `upload_max_filesize`, `post_max_size`
   - Nginx: `client_max_body_size`

3. CORS 설정 (CDN 사용 시)
   ```apache
   Header set Access-Control-Allow-Origin "*"
   ```

---

## 📊 빌드 출력 구조

```
dist/
├── index.html              (진입점, 상대 경로 사용)
├── vite.svg                (favicon)
└── assets/
    ├── index-[hash].js     (번들된 JavaScript)
    ├── index-[hash].css    (번들된 CSS)
    ├── backgrounds/
    │   ├── intro-bg.png
    │   └── intro-bg.webp   (최적화됨, 7MB → 180KB)
    ├── characters/
    │   ├── (hero-name).png (16개, 폴백용)
    │   ├── (hero-name).webp (16개, 최적화됨)
    │   └── (hero-name).mp4  (16개, 최적화됨)
    ├── sounds/
    │   └── select.mp3
    └── videos/
        └── loading-intro.mp4 (최적화됨, 8MB → 3MB)
```

**총 크기**: ~37MB (최적화 후)

---

## 🔒 보안 고려사항

### 1. HTTPS 사용 권장
```nginx
# Nginx 리다이렉트
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. 보안 헤더 추가
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

### 3. CSP 설정 (선택사항)
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';">
```

---

## 🚀 CDN 배포 (선택사항)

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
# package.json에 추가
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

npm install -D gh-pages
npm run deploy
```

**주의**: GitHub Pages는 자동으로 서브 디렉토리에 배포되므로 동적 경로 감지가 완벽하게 작동합니다!

---

## 📞 지원

문제가 발생하면:
1. 브라우저 개발자 도구 콘솔 확인
2. 네트워크 탭에서 404 에러 확인
3. `getBasePath()` 반환 값 확인 (콘솔에서 테스트)

**콘솔 테스트**:
```javascript
// 브라우저 개발자 도구에서 실행
console.log(window.location.pathname)
// 예: /apps/marvel/index.html

// 계산된 base 경로 확인
const basePath = window.location.pathname.substring(
  0, window.location.pathname.lastIndexOf('/') + 1
)
console.log(basePath)
// 예: /apps/marvel/
```

---

## ✅ 체크리스트

배포 전 확인:
- [ ] `npm run build` 성공
- [ ] `dist/` 폴더 생성됨
- [ ] `dist/assets/` 폴더에 모든 리소스 있음
- [ ] 로컬에서 `npm run preview` 테스트 완료

배포 후 확인:
- [ ] 모든 페이지 정상 작동
- [ ] 이미지/비디오 로드됨
- [ ] 사운드 재생됨
- [ ] 404 에러 없음
- [ ] 다양한 브라우저에서 테스트

---

**🎉 이제 한 번 빌드한 파일을 어디든 자유롭게 배포하세요!**
