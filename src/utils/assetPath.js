/**
 * 동적으로 현재 배포 경로를 감지하여 리소스 경로를 생성하는 유틸리티
 *
 * 이 유틸리티를 사용하면 한 번 빌드한 파일을 다양한 경로에 배포할 수 있습니다:
 * - 루트 경로: https://example.com/
 * - 서브 경로: https://example.com/apps/marvel/
 * - 깊은 경로: https://example.com/services/games/marvel-hero/
 *
 * 모두 자동으로 올바른 리소스 경로를 생성합니다.
 */

let cachedBasePath = null

/**
 * 현재 HTML 파일이 위치한 기본 경로를 반환
 * 한 번 계산된 후에는 캐시되어 성능 향상
 *
 * @returns {string} 기본 경로 (예: '/', '/app/', '/services/marvel/')
 */
export function getBasePath() {
  if (cachedBasePath !== null) {
    return cachedBasePath
  }

  // 개발 환경에서는 루트 경로 사용
  if (import.meta.env.DEV) {
    cachedBasePath = '/'
    return cachedBasePath
  }

  // 프로덕션 환경에서는 현재 HTML 위치 기준으로 base 경로 계산
  const pathname = window.location.pathname

  // index.html이 있는 디렉토리까지의 경로 추출
  // 예: /apps/marvel/index.html -> /apps/marvel/
  // 예: /index.html -> /
  const basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1)

  cachedBasePath = basePath
  return basePath
}

/**
 * 리소스 경로를 현재 배포 경로에 맞게 변환
 *
 * @param {string} path - 리소스 경로 (예: 'assets/hero.png' 또는 '/assets/hero.png')
 * @returns {string} 완전한 리소스 경로
 *
 * @example
 * // 배포 경로가 /apps/marvel/ 인 경우
 * getAssetPath('assets/characters/hero.webp')
 * // 반환: '/apps/marvel/assets/characters/hero.webp'
 *
 * @example
 * // 배포 경로가 루트(/) 인 경우
 * getAssetPath('assets/characters/hero.webp')
 * // 반환: '/assets/characters/hero.webp'
 */
export function getAssetPath(path) {
  // 이미 절대 URL이면 그대로 반환 (외부 리소스)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // data: URL이면 그대로 반환 (인라인 데이터)
  if (path.startsWith('data:')) {
    return path
  }

  const basePath = getBasePath()

  // 앞의 '/' 제거 (중복 방지)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // base 경로와 결합하고 중복된 슬래시 제거
  const fullPath = `${basePath}${cleanPath}`.replace(/\/+/g, '/')

  return fullPath
}

/**
 * 캐시된 base 경로를 초기화 (테스트용)
 * 일반적으로 사용할 필요 없음
 */
export function resetBasePath() {
  cachedBasePath = null
}
