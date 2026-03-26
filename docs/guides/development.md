# 🛠️ 개발 환경 세팅 가이드

Marvel Hero Discovery 프로젝트의 로컬 개발 환경 구축 가이드입니다.

---

## 📋 사전 요구사항

### 필수 설치 항목
- **Node.js**: v18 이상 ([다운로드](https://nodejs.org/))
- **npm**: v9 이상 (Node.js와 함께 설치됨)
- **Git**: 버전 관리 ([다운로드](https://git-scm.com/))

### 권장 도구
- **VS Code**: 코드 에디터 ([다운로드](https://code.visualstudio.com/))
- **VS Code 확장**:
  - ESLint
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

---

## 🚀 프로젝트 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd MARVEL-HERO-V2
```

### 2. 의존성 설치
```bash
npm install
```

**설치되는 주요 패키지**:
- `react` ^18.3.1
- `vite` ^5.4.10
- `framer-motion` ^11.15.0
- `tailwindcss` ^3.4.15
- `lucide-react` ^0.468.0

### 3. 환경 변수 설정
```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

**.env 파일 내용**:
```bash
# Backend API URL
VITE_BACKEND_URL=https://devplayground.polarislabs.ai.kr/api
```

### 4. 개발 서버 실행
```bash
npm run dev
```

**접속 URL**: http://localhost:8000

---

## 📁 폴더 구조

```
MARVEL-HERO-V2/
├── public/                      # 정적 리소스 (빌드 시 dist/로 복사)
│   ├── assets/
│   │   ├── characters/          # 히어로 이미지/비디오 (16개)
│   │   │   ├── *.webp           # 갤러리용 이미지
│   │   │   └── *.mp4            # 결과 페이지 비디오
│   │   ├── backgrounds/         # 배경 이미지
│   │   │   └── intro-bg.webp
│   │   ├── videos/              # 기타 비디오
│   │   │   └── loading-intro.mp4
│   │   └── sounds/              # 효과음
│   │       └── select.mp3
│   └── vite.svg                 # 파비콘
│
├── src/                         # 소스 코드
│   ├── components/              # 재사용 가능한 컴포넌트
│   │   ├── HeroModal.jsx        # 히어로 상세 모달
│   │   └── PowerLevelGauge.jsx  # 퀴즈 진행률 게이지
│   │
│   ├── data/                    # 정적 데이터
│   │   └── heroes.js            # MBTI별 히어로 매핑 (16개)
│   │
│   ├── pages/                   # 페이지 컴포넌트
│   │   ├── Intro.jsx            # 인트로 화면
│   │   ├── Quiz.jsx             # MBTI 퀴즈
│   │   ├── Result.jsx           # 결과 페이지
│   │   └── HeroGallery.jsx      # 히어로 갤러리
│   │
│   ├── services/                # 외부 API 호출
│   │   └── api.js               # OpenAI API (질문 생성)
│   │
│   ├── utils/                   # 유틸리티 함수
│   │   ├── assetPath.js         # 리소스 경로 생성
│   │   └── scaling.js           # 반응형 스케일링 시스템
│   │
│   ├── App.jsx                  # 메인 앱 컴포넌트
│   ├── main.jsx                 # 앱 진입점
│   └── index.css                # 글로벌 스타일 (Tailwind)
│
├── scripts/                     # 최적화 스크립트
│   ├── optimize-images.js       # 이미지 WebP 변환
│   └── optimize-videos.js       # 비디오 압축
│
├── docs/                        # 프로젝트 문서
│   ├── planning/                # 기획 문서
│   ├── guides/                  # 가이드
│   └── reports/                 # 보고서
│
├── vite.config.js               # Vite 빌드 설정
├── tailwind.config.js           # Tailwind CSS 설정
├── package.json                 # 프로젝트 메타데이터
└── .env                         # 환경 변수 (gitignore)
```

---

## 🎨 스타일링 가이드

### Tailwind CSS 사용
```jsx
// ✅ 권장: Tailwind 유틸리티 클래스
<div className="flex items-center justify-center bg-marvel-red">

// ❌ 지양: 인라인 스타일 (필요한 경우만)
<div style={{ backgroundColor: 'red' }}>
```

### 커스텀 색상 (tailwind.config.js)
```javascript
colors: {
  'marvel-red': '#ED1D24',
  'marvel-gold': '#F9C846',
  'marvel-dark': '#202020',
}
```

**사용 예시**:
```jsx
<div className="text-marvel-gold bg-marvel-dark">
```

---

## 🧩 컴포넌트 작성 가이드

### 함수형 컴포넌트 사용
```jsx
// ✅ 권장: 함수형 컴포넌트 + Hooks
export default function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue)
  
  return <div>{/* JSX */}</div>
}

// ❌ 지양: 클래스형 컴포넌트
class MyComponent extends React.Component { }
```

### Props 구조 분해
```jsx
// ✅ 권장
function Hero({ name, power, mbti }) {
  return <div>{name}</div>
}

// ❌ 지양
function Hero(props) {
  return <div>{props.name}</div>
}
```

---

## 🔧 개발 스크립트

### 개발 서버 (Hot Reload)
```bash
npm run dev
```
- 포트: 8000
- HMR (Hot Module Replacement) 활성화
- Tailwind JIT 모드

### 프로덕션 빌드
```bash
npm run build
```
- 결과물: `dist/` 폴더
- 번들 최적화: React/Framer Motion 코드 스플리팅
- 압축: Gzip + Brotli

### 빌드 미리보기
```bash
npm run preview
```
- 프로덕션 빌드를 로컬에서 테스트

### 린트 검사
```bash
npm run lint
```
- ESLint로 코드 품질 검사

---

## 🐛 트러블슈팅

### 1. 포트 8000이 이미 사용 중
**증상**: `Port 8000 is in use`

**해결**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### 2. 모듈을 찾을 수 없음
**증상**: `Cannot find module '@/components/...'`

**해결**:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 3. Tailwind 스타일이 적용 안 됨
**증상**: 클래스가 있는데 스타일이 안 보임

**해결**:
```bash
# Tailwind JIT 캐시 초기화
npm run dev
# Ctrl+C로 종료 후 재시작
```

### 4. 환경 변수가 인식 안 됨
**증상**: `import.meta.env.VITE_BACKEND_URL`이 undefined

**해결**:
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 변수명이 `VITE_` 접두사로 시작하는지 확인
- 개발 서버 재시작

### 5. AI 질문 생성 실패
**증상**: `Failed to generate questions`

**해결**:
- 네트워크 연결 확인
- Backend 서버 상태 확인 (https://devplayground.polarislabs.ai.kr/api)
- CORS 에러 시: 포트 8000 사용 확인

---

## 🔄 Git 워크플로우

### 브랜치 전략
```bash
main         # 프로덕션 코드
develop      # 개발 브랜치
feature/*    # 기능 개발
bugfix/*     # 버그 수정
```

### 커밋 메시지 컨벤션
```
feat: Add hero comparison feature
fix: Fix scaling system on mobile
docs: Update deployment guide
style: Format code with Prettier
refactor: Simplify asset path logic
perf: Optimize video compression
```

---

## 📚 추가 학습 자료

- **React 공식 문서**: https://react.dev/
- **Vite 공식 문서**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **OpenAI API**: https://platform.openai.com/docs/

---

**도움이 필요하신가요?** 

문제가 해결되지 않으면 이슈를 등록하거나 팀원에게 문의하세요.
