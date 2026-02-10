# Marvel Hero Discovery

초등 영어 교육용 웹 앱: 마블 세계관 시나리오 선택 기반 MBTI 분석 + OpenAI 실시간 채팅

## 기술 스택

- **Frontend**: React 18, Vite 5
- **스타일**: Tailwind CSS
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React
- **AI**: OpenAI (GPT-4o) — Backend API 경유
- **Backend URL**: `https://devplayground.polarislabs.ai.kr/api`

## 환경 세팅

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 환경 변수

`.env.example`을 참고해 프로젝트 루트에 `.env`를 만들고 Backend URL을 설정할 수 있습니다.

- `VITE_BACKEND_URL`: Backend API base URL (기본값: https://devplayground.polarislabs.ai.kr/api)

## 폴더 구조

```
src/
  components/     # 공통 컴포넌트 (PowerLevelGauge 등)
  data/           # 히어로 매핑 등 정적 데이터
  pages/          # Intro, Quiz, Result, HeroGallery
  services/       # API 호출 (generateQuestions, chat)
public/
  assets/
    characters/   # 히어로 이미지 (WebP/PNG 권장)
```

## 활동 흐름

1. **인트로**: 타이틀 "Marvel Hero Discovery", "START MISSION" 버튼
2. **문항 생성**: AI가 MBTI 12문항 생성 (E/N, N/S, F/T, P/J 각 3문항), 로딩 중 인트로 영상 재생 가능
3. **문제 풀기**: 1문항 + 선택지 2개, Power Level 게이지 (12문항 완료 시 풀 충전)
4. **결과**: MBTI별 마블 캐릭터, "NEW MISSION", "Hero Gallery" (16명 카드)

## 캐릭터 에셋

`public/assets/characters/`에 Chibi 스타일 코믹북 컨셉 이미지(WebP/PNG)를 넣으면 결과/갤러리에서 사용됩니다.  
파일명은 `src/data/heroes.js`의 `image` 경로와 맞추면 됩니다.
