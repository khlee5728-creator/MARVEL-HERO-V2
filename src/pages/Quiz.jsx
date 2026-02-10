import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { generateQuestions } from '@/services/api'
import PowerLevelGauge from '@/components/PowerLevelGauge'

const TOTAL_QUESTIONS = 12

export default function Quiz({ onComplete }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scores, setScores] = useState({ E: 0, N: 0, F: 0, P: 0 })

  useEffect(() => {
    let cancelled = false
    generateQuestions()
      .then((data) => {
        if (!cancelled && data?.questions?.length) setQuestions(data.questions)
        else if (!cancelled) setError('Failed to load questions')
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Network error')
          setQuestions(getFallbackQuestions())
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSelect = (choice) => {
    if (questions.length === 0) return
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
        className="h-full flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <video
          src="/assets/videos/loading-intro.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
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

  return (
    <motion.div
      className="h-full flex flex-col p-6 font-comic"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <PowerLevelGauge progress={progress} />
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
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
            <p className="text-lg md:text-xl text-white leading-relaxed">
              {current.question}
            </p>
            <div className="space-y-4">
              {current.options?.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left px-6 py-4 bg-white/10 hover:bg-marvel-red/80 border-2 border-marvel-gold/50 rounded-xl font-medium transition-colors"
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

function getFallbackQuestions() {
  const dimensions = [
    ['E', 'I'],
    ['N', 'S'],
    ['F', 'T'],
    ['P', 'J'],
  ]
  const fallback = []
  for (let d = 0; d < 4; d++) {
    for (let i = 0; i < 3; i++) {
      fallback.push({
        question: `Marvel scenario question ${fallback.length + 1} (E/N, N/S, F/T, P/J)?`,
        options: ['Option A', 'Option B'],
        dimension: dimensions[d],
      })
    }
  }
  return fallback
}
