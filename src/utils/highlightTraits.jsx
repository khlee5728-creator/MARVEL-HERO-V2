/**
 * 형용사(traits) 시각적 강조를 위한 유틸리티 컴포넌트
 * 텍스트에서 형용사를 자동으로 찾아 골드색 + 굵게 표시
 */

/**
 * 텍스트 내에서 특정 단어들을 시각적으로 강조하는 컴포넌트
 *
 * @param {string} text - 원본 텍스트
 * @param {string[]} highlights - 강조할 단어 배열 (예: traits)
 * @returns JSX 엘리먼트
 */
export function HighlightedText({ text, highlights }) {
  // highlights가 없으면 원본 텍스트 반환
  if (!highlights || highlights.length === 0) {
    return <>{text}</>
  }

  // 공백을 기준으로 단어 분리 (공백도 유지)
  const words = text.split(/(\s+)/)

  return (
    <>
      {words.map((word, index) => {
        // 구두점 제거하고 소문자로 변환하여 비교
        const cleanWord = word.replace(/[.,!?;:"()]/g, '').toLowerCase()

        // highlights 배열에 있는 단어인지 확인
        const isHighlight = highlights.some(
          highlight => highlight.toLowerCase() === cleanWord
        )

        // 강조 대상이면 골드색 + 굵게, 아니면 그대로
        return isHighlight ? (
          <span
            key={index}
            className="text-marvel-gold font-semibold"
          >
            {word}
          </span>
        ) : (
          <span key={index}>{word}</span>
        )
      })}
    </>
  )
}
