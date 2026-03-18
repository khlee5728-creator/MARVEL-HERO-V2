import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { getAssetPath } from '@/utils/assetPath'

export default function Intro({ onStart }) {
  return (
    <motion.div
      className="h-full flex flex-col items-center justify-end p-6 pb-12 font-comic bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url('${getAssetPath('assets/backgrounds/intro-bg.webp')}')` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
<motion.button
        onClick={onStart}
        className="flex items-center gap-2 px-8 py-4 bg-marvel-red hover:bg-red-600 text-white font-bold text-xl rounded-lg shadow-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Play size={24} />
        START MISSION
      </motion.button>
    </motion.div>
  )
}
