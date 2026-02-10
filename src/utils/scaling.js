/**
 * 스케일링 시스템 (v1.3)
 * 고정 디자인 해상도 기준 비율 유지 + 상단 중앙(Top-Center) 배치
 */

let currentScale = 1

export function getCurrentScale() {
  return currentScale
}

export function initScaling(options = {}) {
  const {
    designWidth = 1280,
    designHeight = 800,
    containerId = 'app',
    enableLog = false,
  } = options

  function applyScaling() {
    const container = document.getElementById(containerId)
    if (!container) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const scale = Math.min(vw / designWidth, vh / designHeight)

    currentScale = scale
    window.currentScale = scale

    container.style.width = `${designWidth}px`
    container.style.height = `${designHeight}px`
    container.style.position = 'absolute'
    container.style.transformOrigin = 'top left'
    container.style.transform = `scale(${scale})`
    container.style.left = `${(vw - designWidth * scale) / 2}px`
    container.style.top = '0'

    if (enableLog) {
      console.log(`[Scaling] ${vw}x${vh} → scale: ${scale.toFixed(4)}`)
    }
  }

  applyScaling()
  window.addEventListener('resize', applyScaling)
}
