### #환경 세팅

다음 활동을 React + vite 로 개발하고 싶어요.
현재 폴더에 React 프로젝트를 초기화해주고, 기획안을 검토하고 필요한 폴더 구조를 생성해주세요.
추가로 필요한 기술 스택과  React + Vite 및 해당 기술 스택을 구현하기 위한 환경 세팅을 해주세요.

### #Marvel Hero Discovery 기획안

1. **프로젝트 개요**
사용자가 마블 세계관 시나리오 속에서 내리는 선택을 기반으로 MBTI를 분석하고, OpenAI 엔진을 통해 실시간 채팅을 할 수 있는 초등 영어 교육용 웹 앱입니다.

**사용 디바이스**
 웹 / 안드로이드 / iOS  

**기술 스택 (Tech Stack)**

 1) Frontend: React.js, Tailwind CSS

 2) Animation: Framer Motion (시네마틱 효과 필수)

 3) Icons: Lucide-React

 4) AI Engine: OpenAI (GPT-4o) - 질문 생성 및 채팅용 

 5)Open AI 엔진 사용 (첨부이미지 참조)

 6)Open AI 호출 방식을 BackEnd 서버를 통해 호출하는 방식 (Backend 서버에 api 구현) 

 7)backend Url https://devplayground.polarislabs.ai.kr/api

 8)Assets: Fixed Character Images (WebP/PNG 권장)

**활동흐름**

1) 인트로
Activity 타이틀(Marvel Hero Discovery) 노출, "START MISSION" 버튼 노출

 2) 문항 생성 및 영상 재생

- AI가 MBTI 테스트 문항 12개 생성, 문항이 생성되는 시간동안 인트로 영상 재생
- E/N, N/S, F/T, P/J 항목별로 각각 3문항씩 생성되어 총 12문항 생성
- 활동 진입 시 마다 매번 새로운 문항 생성
- 질문 문항: 초등학생이 이해하기 쉬운 영문 표현을 사용해서 문항 생성
- 선택지 2개: 초등학생이 이해하기 쉬운 영문 표현
- MBTI 문항이되 Marvel 세계관에 기반을 둔 질문

 3) 문제 풀기 화면

- 화면에 1개의 문항과 선택지 2개 노출
- 선택지중 1개를 선택하면 자동으로 다음 문항으로 이동
- 문제 풀기 화면에 "Power Level" 로 게이지 표시: 한문항씩 넘어갈 수록 게이지가 채워지며 12문항을 다풀면 게이지 full 충전

 4) 결과 보기 화면

- MBTI 결과에 따라 매칭된 마블 캐릭터 노출
- 캐릭터 이미지 asset은 지정된 폴더에 저장
- 캐릭터의 성격을 나타내는 영문 단어 및 표현 노출
- 다시하기 버튼 "NEW MISSION" 노출, 터치 클릭 시 새로운 문항 생성 단계로 이동, 문항 생성 동안 영상 재생
- “Hero Gallery” 버튼: 클릭 시 Hero Gallery 화면으로 이동 16명의 히어로 정보가 카드 형태로 노출

**디자인 컨셉** 

히어로 게임에 어울리는 Chibi 스타일의 코믹북 컨셉 디자인