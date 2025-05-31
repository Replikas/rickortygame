import React from 'react'
import { motion } from 'framer-motion'
import { Heart, HeartHandshake, Flame, Zap } from 'lucide-react'

const AffectionMeter = ({ character, affection, color = 'primary' }) => {
  // Clamp affection between 0 and 100
  const clampedAffection = Math.max(0, Math.min(100, affection))
  
  // Determine relationship status based on affection level
  const getRelationshipStatus = (level) => {
    if (level >= 90) return { status: 'Soulmate', icon: Flame, color: 'text-danger-400' }
    if (level >= 75) return { status: 'Lover', icon: Heart, color: 'text-accent-400' }
    if (level >= 60) return { status: 'Close Friend', icon: HeartHandshake, color: 'text-secondary-400' }
    if (level >= 40) return { status: 'Friend', icon: Heart, color: 'text-primary-400' }
    if (level >= 20) return { status: 'Acquaintance', icon: Heart, color: 'text-success-400' }
    if (level >= 5) return { status: 'Stranger', icon: Heart, color: 'text-neutral-400' }
    return { status: 'Unknown', icon: Zap, color: 'text-neutral-500' }
  }

  const relationship = getRelationshipStatus(clampedAffection)
  const IconComponent = relationship.icon

  // Get meter color based on affection level
  const getMeterColor = (level) => {
    if (level >= 75) return 'from-danger-500 to-accent-500'
    if (level >= 50) return 'from-accent-500 to-secondary-500'
    if (level >= 25) return 'from-secondary-500 to-primary-500'
    return 'from-primary-500 to-neutral-500'
  }

  const meterGradient = getMeterColor(clampedAffection)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 mb-6 border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary-500/20 border border-primary-400/30">
            <IconComponent size={20} className={relationship.color} />
          </div>
          <span className="text-white font-semibold capitalize text-lg">
            {character} Relationship
          </span>
        </div>
        <span className={`text-base ${relationship.color} font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm`}>
          {relationship.status}
        </span>
      </div>

      {/* Affection Bar */}
      <div className="relative">
        {/* Background bar */}
        <div className="w-full h-6 bg-neutral-700/50 rounded-full overflow-hidden border border-white/20 backdrop-blur-sm">
          {/* Progress bar */}
          <motion.div
            className={`h-full bg-gradient-to-r ${meterGradient} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${clampedAffection}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
        
        {/* Percentage text */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-neutral-400 font-medium">0</span>
          <motion.span 
            className="text-lg font-bold text-white px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm"
            key={clampedAffection} // Force re-render on change
            initial={{ scale: 1.2, color: '#ffffff' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {clampedAffection}/100
          </motion.span>
          <span className="text-sm text-neutral-400 font-medium">100</span>
        </div>
      </div>

      {/* Milestone indicators */}
      <div className="flex justify-between mt-4 text-xs">
        {[20, 40, 60, 80].map((milestone) => (
          <div
            key={milestone}
            className={`flex flex-col items-center space-y-2 ${
              clampedAffection >= milestone ? 'text-white' : 'text-neutral-500'
            }`}
          >
            <motion.div
              className={`w-3 h-3 rounded-full border-2 ${
                clampedAffection >= milestone 
                  ? `bg-gradient-to-r ${meterGradient} border-white/30` 
                  : 'bg-neutral-600 border-neutral-500'
              }`}
              animate={clampedAffection >= milestone ? {
                scale: [1, 1.2, 1],
                transition: { duration: 0.5 }
              } : {}}
            />
            <span className="font-medium">{milestone}</span>
          </div>
        ))}
      </div>

      {/* Special unlocks */}
      {clampedAffection >= 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-gradient-to-r from-accent-500/20 to-danger-500/20 rounded-xl border border-accent-400/30 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-2">
            <Flame size={16} className="text-accent-400" />
            <span className="text-sm text-accent-300 font-medium">
              Special scenes unlocked!
            </span>
          </div>
        </motion.div>
      )}

      {/* Relationship perks */}
      <div className="mt-4 space-y-2">
        {clampedAffection >= 25 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-success-400 font-medium flex items-center space-x-2"
          >
            <span className="w-1.5 h-1.5 bg-success-400 rounded-full"></span>
            <span>More personal conversations</span>
          </motion.div>
        )}
        {clampedAffection >= 50 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-primary-400 font-medium flex items-center space-x-2"
          >
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
            <span>Intimate dialogue options</span>
          </motion.div>
        )}
        {clampedAffection >= 75 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-secondary-400 font-medium flex items-center space-x-2"
          >
            <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full"></span>
            <span>Romantic scenes available</span>
          </motion.div>
        )}
        {clampedAffection >= 90 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-danger-400 font-medium flex items-center space-x-2"
          >
            <span className="w-1.5 h-1.5 bg-danger-400 rounded-full"></span>
            <span>True ending unlocked</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default AffectionMeter