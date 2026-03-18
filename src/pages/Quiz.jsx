import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Shield, Star, Flame, Swords, Crown, Rocket, Target } from 'lucide-react'
import { generateQuestions } from '@/services/api'
import PowerLevelGauge from '@/components/PowerLevelGauge'
import { getAssetPath } from '@/utils/assetPath'

const TOTAL_QUESTIONS = 16

export default function Quiz({ onComplete }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scores, setScores] = useState({ E: 0, N: 0, F: 0, P: 0 })
  const [videoEnded, setVideoEnded] = useState(false)
  const [questionsReady, setQuestionsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const startTime = performance.now()
    console.log('🚀 [Quiz] AI question generation started')

    generateQuestions()
      .then((data) => {
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)
        console.log(`✅ [Quiz] AI questions ready in ${elapsed}s`)

        if (!cancelled && data?.questions?.length) {
          setQuestions(shuffleOptions(data.questions))
          setQuestionsReady(true)
        } else if (!cancelled) {
          setError('Failed to load questions')
        }
      })
      .catch((err) => {
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)
        console.error(`❌ [Quiz] AI generation failed after ${elapsed}s:`, err.message)

        if (!cancelled) {
          setError(err.message || 'Network error')
        }
      })
    return () => { cancelled = true }
  }, [])

  // 영상이 끝나고 문제가 준비되면 즉시 시작
  // 또는 문제가 먼저 준비되고 영상이 끝나면 즉시 시작
  useEffect(() => {
    if (questionsReady && videoEnded) {
      console.log('🎬 [Quiz] Loading complete - starting quiz')
      setLoading(false)
    }
  }, [questionsReady, videoEnded])

  const handleSelect = (choice) => {
    if (questions.length === 0) return
    new Audio(getAssetPath('assets/sounds/select.mp3')).play().catch(() => {})
    const q = questions[currentIndex]
    const dim = Array.isArray(q.dimension) ? q.dimension : ['E', 'I']
    const value = choice === 0 ? dim[0] : dim[1]
    const newScores = { ...scores, [value]: (scores[value] || 0) + 1 }
    setScores(newScores)
    if (currentIndex + 1 >= questions.length) {
      const mbti = calculateMBTI(newScores)
      onComplete(mbti, questions)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  if (loading) {
    return (
      <motion.div
        className="h-full flex items-center justify-center bg-marvel-dark halftone-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {!videoEnded ? (
          <video
            src={getAssetPath('assets/videos/loading-intro.mp4')}
            autoPlay
            playsInline
            onEnded={() => {
              console.log('🎥 [Quiz] Loading video ended')
              setVideoEnded(true)
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              <motion.div
                className="w-24 h-24 starburst opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap size={36} fill="white" />
              </motion.div>
            </div>
            <motion.p
              className="text-2xl font-bold text-marvel-gold font-comic comic-title"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ASSEMBLING YOUR MISSION...
            </motion.p>
          </div>
        )}
      </motion.div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-marvel-red rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  const current = questions[currentIndex]
  if (!current) return null

  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100

  const floatingIcons = [
    { Icon: Zap, x: '8%', y: '15%', size: 52, duration: 6, delay: 0, dx: [0, 20, -10, 0] },
    { Icon: Shield, x: '85%', y: '25%', size: 46, duration: 7, delay: 1, dx: [0, -25, 10, 0] },
    { Icon: Star, x: '75%', y: '70%', size: 42, duration: 5, delay: 0.5, dx: [0, 15, -20, 0] },
    { Icon: Flame, x: '12%', y: '75%', size: 48, duration: 8, delay: 2, dx: [0, -15, 25, 0] },
    { Icon: Swords, x: '90%', y: '55%', size: 44, duration: 6.5, delay: 1.5, dx: [0, 20, -15, 0] },
    { Icon: Crown, x: '5%', y: '45%', size: 38, duration: 7.5, delay: 0.8, dx: [0, -20, 15, 0] },
    { Icon: Rocket, x: '30%', y: '70%', size: 44, duration: 7, delay: 0.3, dx: [0, 18, -12, 0] },
    { Icon: Target, x: '45%', y: '80%', size: 40, duration: 6, delay: 1.8, dx: [0, -18, 15, 0] },
  ]

  return (
    <motion.div
      className="h-full flex flex-col p-6 font-comic relative overflow-hidden halftone-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 레이어 2: 액션 라인 펄스 */}
      <motion.div
        className="absolute inset-0 action-lines pointer-events-none"
        animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 레이어 3: 떠다니는 마블 아이콘 */}
      {floatingIcons.map(({ Icon, x, y, size, duration, delay, dx }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-marvel-gold"
          style={{ left: x, top: y, opacity: 0.3 }}
          animate={{ y: [0, -45, 0], x: dx, rotate: [0, 25, -25, 0] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <PowerLevelGauge progress={progress} />
      <div className="flex-1 flex flex-col justify-start pt-14 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <h2 className="text-xl md:text-2xl text-marvel-gold font-bold">
              Question {currentIndex + 1} of {TOTAL_QUESTIONS}
            </h2>
            <p className="text-xl md:text-2xl text-white leading-relaxed">
              {current.question}
            </p>
            <div className="space-y-4">
              {current.options?.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left px-6 py-4 bg-white/10 hover:bg-marvel-red/80 border-2 border-marvel-gold/50 rounded-xl text-lg font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-marvel-gold mr-2">{(i + 1)}.</span>
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function calculateMBTI(scores) {
  const pairs = [
    ['E', 'I'],
    ['N', 'S'],
    ['F', 'T'],
    ['P', 'J'],
  ]
  return pairs
    .map(([a, b]) => (scores[a] >= (scores[b] || 0) ? a : b))
    .join('')
}

function shuffleOptions(questions) {
  return questions.map((q) => {
    if (Math.random() > 0.5) {
      return {
        ...q,
        options: [q.options[1], q.options[0]],
        dimension: [q.dimension[1], q.dimension[0]],
      }
    }
    return q
  })
}


