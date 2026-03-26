import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { HighlightedText } from '@/utils/highlightTraits'

export default function HeroModal({ hero, isOpen, onClose }) {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // 모달 닫을 때 비디오 정리
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ''
      setVideoLoaded(false)
    }
  }, [isOpen])

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!hero) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 font-comic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 배경 오버레이 (클릭으로 닫기) */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="relative bg-marvel-dark border-4 border-marvel-gold rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden halftone-bg shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-marvel-red hover:bg-red-600 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-white" />
            </button>

            {/* 액션 라인 효과 */}
            <motion.div
              className="absolute inset-0 action-lines pointer-events-none rounded-2xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* 컨텐츠 */}
            <div className="relative p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* 왼쪽: 비디오 + 스타버스트 */}
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  {/* 스타버스트 */}
                  <motion.div
                    className="absolute w-56 h-56 md:w-72 md:h-72 starburst opacity-70"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{
                      scale: { type: 'spring', stiffness: 150 },
                      rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    }}
                  />

                  {/* 비디오 컨테이너 */}
                  <motion.div
                    className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden flex items-center justify-center bg-white/5"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {/* 로딩 스피너 */}
                    {!videoLoaded && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-marvel-dark/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-12 h-12 border-4 border-marvel-gold border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    )}

                    {/* 비디오 */}
                    {hero.video ? (
                      <video
                        ref={videoRef}
                        src={hero.video}
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                        muted={false}
                        className="w-full h-full object-cover"
                        onLoadedData={() => setVideoLoaded(true)}
                      />
                    ) : (
                      <span className="text-6xl text-marvel-gold">{hero.emoji}</span>
                    )}
                  </motion.div>
                </div>

                {/* 오른쪽: 히어로 정보 */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <motion.h2
                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {hero.name}
                  </motion.h2>

                  <motion.p
                    className="text-xl text-marvel-gold mb-6 font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {hero.mbti}
                  </motion.p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {hero.traits?.map((trait, i) => (
                      <motion.span
                        key={trait}
                        className="px-4 py-2 text-base font-bold text-marvel-dark bg-gradient-to-r from-yellow-400 to-marvel-gold border-2 border-yellow-600 rounded-full shadow-lg"
                        initial={{ opacity: 0, scale: 0, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
                        whileHover={{ scale: 1.1, rotate: 3 }}
                      >
                        {trait}
                      </motion.span>
                    ))}
                  </div>

                  {/* 히어로 설명 */}
                  {hero.description && (
                    <motion.p
                      className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed max-w-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <HighlightedText
                        text={hero.description}
                        highlights={hero.traits}
                      />
                    </motion.p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
