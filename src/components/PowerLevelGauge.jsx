import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function PowerLevelGauge({ progress }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-marvel-gold font-bold text-lg">
          <Zap size={22} />
          Power Level
        </span>
        <span className="text-base text-gray-400 font-bold">{Math.round(progress)}%</span>
      </div>
      <div className="h-5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-marvel-red to-marvel-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
