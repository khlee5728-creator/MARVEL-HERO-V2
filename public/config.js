// Poly AI Playground 환경 설정
// 개발/운영 환경에 따라 API URL 자동 전환
window.CONFIG = {
  apiUrl: window.location.hostname === 'localhost'
    ? 'https://devplayground.polarislabs.ai.kr/api-v1'
    : 'https://playground.polarislabs.ai.kr/api-v1'
};
