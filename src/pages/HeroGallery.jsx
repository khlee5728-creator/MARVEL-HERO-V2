import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { HEROES } from '@/data/heroes'

export default function HeroGallery({ onBack }) {
  return (
    <motion.div
      className="h-full overflow-y-auto p-6 font-comic"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-marvel-gold hover:text-yellow-400 mb-8"
        >
          <ArrowLeft size={24} />
          Back
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-marvel-gold mb-8">
          HERO GALLERY
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {HEROES.map((hero, i) => (
            <motion.div
              key={hero.mbti}
              className="bg-white/10 rounded-xl overflow-hidden border-2 border-marvel-gold/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="aspect-square flex items-center justify-center bg-white/5">
                {hero.image ? (
                  <img
                    src={hero.image}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="text-5xl">{hero.emoji}</span>
                )}
              </div>
              <div className="p-3">
                <p className="font-bold text-white">{hero.name}</p>
                <p className="text-sm text-marvel-gold">{hero.mbti}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {hero.traits?.map(trait => (
                    <span key={trait} className="px-2 py-0.5 text-xs text-white bg-cyan-500/80 rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
