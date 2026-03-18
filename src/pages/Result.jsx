import { motion } from 'framer-motion'
import { RotateCcw, LayoutGrid } from 'lucide-react'
import { getHeroByMbti } from '@/data/heroes'
import { useEffect } from 'react'

export default function Result({ mbti, onNewMission, onOpenGallery }) {
  const hero = getHeroByMbti(mbti)

  useEffect(() => {
    // 컨텐츠 마지막 페이지 확인
    console.error('컨텐츠 마지막 페이지 확인!! ')

    // 컨텐츠의 마지막 페이지에서 실행
    window.parent.postMessage({
      op: 'contentFinished',
      data: {},
      from: 'child'
    }, '*')
  }, [])

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-start pt-8 p-6 font-comic relative overflow-hidden halftone-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 6. 페이지 진입 액션 라인 */}
      <motion.div
        className="absolute inset-0 action-lines pointer-events-none"
        initial={{ opacity: 0.8, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* 코믹 타이틀 */}
      <motion.h1
        className="text-5xl font-bold text-marvel-gold tracking-wide mt-16 mb-20 comic-title"
        initial={{ scale: 3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
      >
        YOUR MARVEL HERO
      </motion.h1>

      {/* 좌우 콘텐츠 */}
      <div className="flex gap-12 items-center">
        {/* 왼쪽: 히어로 영상 + 스타버스트 */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          {/* 1. 스타버스트 */}
          <motion.div
            className="absolute w-80 h-80 starburst opacity-70"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{
              scale: { delay: 0.2, type: 'spring', stiffness: 150 },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            }}
          />
          {/* 2. 코믹 패널 프레임 */}
          <motion.div
            className="relative w-72 h-72 rounded-full overflow-hidden flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {hero?.video ? (
              <video
                src={hero.video}
                autoPlay
                loop
                playsInline
                preload="none"
                muted={false}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl text-marvel-gold">{hero?.emoji || '🦸'}</span>
            )}
          </motion.div>
        </div>

        {/* 오른쪽: 히어로 정보 */}
        <div className="flex flex-col">
          <motion.h2
            className="text-4xl font-bold text-white mb-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {hero?.name || 'Your Hero'}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {mbti}
          </motion.p>

          {/* Traits 코믹 뱃지 */}
          <div className="flex flex-wrap gap-3 mb-8">
            {(hero?.traits || ['Brave', 'Kind', 'Strong']).map((trait, i) => (
              <motion.span
                key={trait}
                className="px-5 py-2 text-lg font-bold text-marvel-dark bg-gradient-to-r from-yellow-400 to-marvel-gold border-2 border-yellow-600 rounded-full shadow-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.15, rotate: 3 }}
              >
                {trait}
              </motion.span>
            ))}
          </div>

          {/* 버튼 */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button
              onClick={() => {
                // 플랫폼에 Play Again(New Mission) 알림 전송
                window.parent.postMessage({
                  op: 'playAgain',
                  data: {},
                  from: 'child'
                }, '*')
                onNewMission()
              }}
              className="flex items-center gap-2 px-6 py-3 bg-marvel-red hover:bg-red-600 rounded-lg font-bold transition-colors"
            >
              <RotateCcw size={20} />
              NEW MISSION
            </button>
            <button
              onClick={onOpenGallery}
              className="flex items-center gap-2 px-6 py-3 bg-marvel-gold hover:bg-yellow-500 text-marvel-dark rounded-lg font-bold transition-colors"
            >
              <LayoutGrid size={20} />
              HERO GALLERY
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
