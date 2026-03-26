# 🚀 리소스 최적화 가이드

Marvel Hero Discovery 프로젝트의 이미지 및 비디오 리소스 최적화 방법을 안내합니다.

---

## 📊 최적화 개요

**최적화 결과**: 66MB → 37MB (44% 감소)

| 리소스 타입 | 최적화 전 | 최적화 후 | 감소율 |
|------------|----------|----------|--------|
| 이미지 (17개) | 23.8MB | 1.15MB | **95.2%** |
| 비디오 (17개) | 42.2MB | 35.85MB | **15.0%** |
| **합계** | **66MB** | **37MB** | **44%** |

---

## 🖼️ 이미지 최적화

### 목표
- PNG → WebP 변환으로 용량 대폭 감소
- 품질 유지하면서 파일 크기 최소화
- Gallery lazy loading으로 초기 로딩 속도 개선

### 1. WebP 변환 스크립트 사용

**스크립트 위치**: `scripts/optimize-images.js`

**사용 방법**:
```bash
# 이미지 최적화 실행
node scripts/optimize-images.js
```

**설정값**:
```javascript
quality: 85,           // 품질 (1-100, 권장: 80-90)
maxWidth: 1200,        // 최대 가로 크기
maxHeight: 1200,       // 최대 세로 크기
```

### 2. 수동 최적화

**도구**: [Sharp](https://sharp.pixelplumbing.com/)

```javascript
import sharp from 'sharp'

await sharp('input.png')
  .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile('output.webp')
```

### 3. 최적화 전후 비교

| 파일명 | PNG (원본) | WebP (최적화) | 감소율 |
|--------|-----------|--------------|--------|
| intro-bg | 7.04MB | 0.18MB | 97.5% |
| iron-man | 1.05MB | 0.06MB | 94.3% |
| thor | 1.04MB | 0.06MB | 94.2% |

---

## 🎬 비디오 최적화

### 목표
- H.264 코덱 최적화로 용량 감소
- 해상도/비트레이트 조정
- 시각적 품질 유지

### 1. 비디오 최적화 스크립트 사용

**스크립트 위치**: `scripts/optimize-videos.js`

**사용 방법**:
```bash
# 비디오 최적화 실행
node scripts/optimize-videos.js
```

**설정값**:
```javascript
// 캐릭터 비디오 (16개)
size: '288x288',           // 해상도
videoBitrate: '160k',      // 비디오 비트레이트
audioBitrate: '32k',       // 오디오 비트레이트

// 로딩 인트로 비디오
size: '1280x720',          // 720p
videoBitrate: '3M',        // 3Mbps
```

### 2. FFmpeg 직접 사용

**설치**:
```bash
# Windows: https://ffmpeg.org/download.html
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

**기본 명령어**:
```bash
# 해상도 + 비트레이트 조정
ffmpeg -i input.mp4 \
  -vf scale=1280:720 \
  -b:v 3M \
  -c:v libx264 \
  -preset medium \
  output.mp4
```

**고급 최적화**:
```bash
# CRF 방식 (품질 우선)
ffmpeg -i input.mp4 \
  -vf scale=1280:720 \
  -c:v libx264 \
  -crf 23 \
  -preset slow \
  output.mp4
```

**CRF 값 가이드**:
- 18-20: 거의 무손실 (대용량)
- 23: 기본 권장값 (균형)
- 28: 낮은 품질 (소용량)

### 3. 캐릭터 비디오 최적화 예시

**원본**:
- 해상도: 512x512
- 비트레이트: ~500kbps
- 크기: ~300KB

**최적화 후**:
- 해상도: 288x288 (모달 창 크기에 맞춤)
- 비트레이트: 160kbps
- 크기: ~180KB

**감소율**: 40%

---

## 📦 배경 이미지 최적화

### intro-bg.webp 최적화

**스크립트**: `scripts/optimize-background.js`

```bash
node scripts/optimize-background.js
```

**최적화 과정**:
1. Sharp로 WebP 변환 (quality: 85)
2. 최대 너비 1920px 제한
3. 메타데이터 제거

**결과**:
- 최적화 전: 7.04MB (PNG)
- 최적화 후: 0.18MB (WebP)
- **감소율: 97.5%**

---

## 🔍 품질 검증

### 1. 시각적 품질 확인
```bash
# 원본과 최적화 버전 비교
# - 육안으로 차이가 거의 없어야 함
# - 특히 텍스트, 얼굴 디테일 중점 확인
```

### 2. 파일 크기 확인
```bash
# Windows
dir /s public\assets\characters

# macOS/Linux
du -sh public/assets/characters/*
```

### 3. 브라우저 로딩 속도 측정
- Chrome DevTools → Network 탭
- Lighthouse 성능 점수 확인 (목표: 90+)

---

## ⚡ 성능 최적화 팁

### 1. Lazy Loading 적용

**Gallery 컴포넌트**:
```jsx
<img 
  src={hero.image} 
  loading="lazy"  // 뷰포트에 들어올 때만 로드
  alt={hero.name}
/>
```

### 2. Preload 중요 리소스

**index.html**:
```html
<link rel="preload" as="image" href="./assets/backgrounds/intro-bg.webp">
```

### 3. Video Preload 전략

```jsx
// 중요한 비디오만 preload
<video preload="auto" src={hero.video} />

// 대부분의 비디오는 metadata만
<video preload="metadata" src={hero.video} />
```

### 4. Compression 활성화

**vite.config.js**:
```javascript
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',  // 최고 압축률
      ext: '.br',
    }),
    viteCompression({
      algorithm: 'gzip',             // 호환성
      ext: '.gz',
    }),
  ],
})
```

---

## 🛠️ 최적화 스크립트 상세

### scripts/optimize-images.js

**기능**:
- PNG → WebP 변환
- 해상도 제한 (1200x1200)
- 메타데이터 제거

**의존성**:
```bash
npm install sharp
```

### scripts/optimize-videos.js

**기능**:
- H.264 재인코딩
- 해상도/비트레이트 조정
- 오디오 압축

**의존성**:
```bash
# FFmpeg 시스템에 설치 필요
npm install fluent-ffmpeg
```

### scripts/resize-webp.js

**기능**:
- WebP 이미지 리사이징
- 배치 처리

---

## 📐 권장 리소스 사양

### 이미지

| 용도 | 포맷 | 해상도 | 품질 | 예상 크기 |
|------|------|--------|------|----------|
| 배경 이미지 | WebP | 1920x1080 | 85 | ~200KB |
| 캐릭터 카드 | WebP | 512x512 | 85 | ~50KB |
| 아이콘 | SVG | - | - | ~5KB |

### 비디오

| 용도 | 해상도 | 비트레이트 | 예상 크기 |
|------|--------|-----------|----------|
| 로딩 영상 | 1280x720 | 3Mbps | ~3MB (8초) |
| 캐릭터 영상 | 288x288 | 160kbps | ~180KB (8초) |

---

## 🚨 주의사항

### 1. 원본 파일 백업
```bash
# 최적화 전 원본 파일 백업
cp -r public/assets public/assets-backup
```

### 2. Git에서 제외할 파일
```gitignore
# .gitignore
public/assets-backup/
*.orig.png
*.orig.mp4
```

### 3. 과도한 압축 지양
- 품질 85 이하로 내리지 않기
- 해상도는 실제 사용 크기의 1.5배 유지
- 육안 검증 필수

---

## 📈 최적화 체크리스트

- [ ] PNG → WebP 변환 완료
- [ ] 비디오 비트레이트 최적화 완료
- [ ] Lazy loading 적용
- [ ] Gzip/Brotli 압축 활성화
- [ ] Lighthouse 점수 90+ 달성
- [ ] 초기 로딩 시간 3초 이하
- [ ] 전체 리소스 크기 40MB 이하

---

## 📚 참고 자료

- **Sharp 문서**: https://sharp.pixelplumbing.com/
- **FFmpeg 가이드**: https://ffmpeg.org/documentation.html
- **WebP 포맷**: https://developers.google.com/speed/webp
- **Lighthouse**: https://developer.chrome.com/docs/lighthouse

---

**최적화 문제가 있으신가요?** 

이슈를 등록하거나 [리소스 최적화 보고서](../reports/optimization-report.md)를 참고하세요.
