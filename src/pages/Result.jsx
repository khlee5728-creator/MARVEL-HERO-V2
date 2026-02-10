import { motion } from 'framer-motion'
import { RotateCcw, LayoutGrid } from 'lucide-react'
import { getHeroByMbti } from '@/data/heroes'

export default function Result({ mbti, onNewMission, onOpenGallery }) {
  const hero = getHeroByMbti(mbti)

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center p-6 font-comic"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl md:text-3xl text-marvel-gold mb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Your Marvel Hero
      </motion.h1>
      <motion.p
        className="text-lg text-gray-400 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {mbti}
      </motion.p>
      <motion.div
        className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
      >
        {hero?.video ? (
          <video
            src={hero.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl text-marvel-gold">{hero?.emoji || '🦸'}</span>
        )}
      </motion.div>
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {hero?.name || 'Your Hero'}
      </motion.h2>
      <motion.p
        className="text-center text-gray-300 max-w-md mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {hero?.traits?.join(' · ') || 'Brave, Kind, Strong'}
      </motion.p>
      <motion.div
        className="flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={onNewMission}
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
          Hero Gallery
        </button>
      </motion.div>
    </motion.div>
  )
}
