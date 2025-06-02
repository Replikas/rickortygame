import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Flame, Zap, Star, Brain, Sparkles } from 'lucide-react'

function CharacterSprite({ character, emotion = 'neutral', affectionLevel = 0, showStats = true }) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion)
  const [particles, setParticles] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const [isEmotionChanging, setIsEmotionChanging] = useState(false)
  const [emotionChangeEffect, setEmotionChangeEffect] = useState(null)

  // Character data with portal-themed descriptions
  const characterData = {
    rick: {
      name: "Rick Sanchez",
      title: "Mad Scientist",
      description: "Genius inventor with a portal gun and questionable morals",
      personality: "Cynical, brilliant, unpredictable",
      dimension: "C-137",
      color: "#00ff41",
      secondaryColor: "#00cc33"
    },
    morty: {
      name: "Morty Smith",
      title: "Reluctant Sidekick", 
      description: "Anxious teenager dragged into interdimensional adventures",
      personality: "Nervous, caring, surprisingly brave",
      dimension: "C-137",
      color: "#ffeb3b",
      secondaryColor: "#ffc107"
    },
    rickprime: {
      name: "Rick Prime",
      title: "The Original Rick",
      description: "The Rick who killed C-137's family and started it all",
      personality: "Ruthless, calculating, supremely confident",
      dimension: "Unknown",
      color: "#ff1744",
      secondaryColor: "#d50000"
    },
    evilmorty: {
      name: "Evil Morty",
      title: "The One Who Broke Free",
      description: "The Morty who escaped the Central Finite Curve",
      personality: "Manipulative, intelligent, coldly determined",
      dimension: "Beyond the Curve",
      color: "#ffc107",
      secondaryColor: "#ff8f00"
    }
  }

  const currentChar = characterData[character] || characterData.rick

  // Emotion configurations
  const emotions = {
    neutral: { scale: 1, rotation: 0, glow: 0.3 },
    happy: { scale: 1.05, rotation: 2, glow: 0.6 },
    excited: { scale: 1.1, rotation: -2, glow: 0.8 },
    confused: { scale: 0.95, rotation: 5, glow: 0.2 },
    angry: { scale: 1.02, rotation: -1, glow: 0.9 },
    sad: { scale: 0.9, rotation: 3, glow: 0.1 },
    flirty: { scale: 1.08, rotation: -3, glow: 0.7 },
    surprised: { scale: 1.15, rotation: 0, glow: 0.5 }
  }

  const currentEmotionData = emotions[currentEmotion] || emotions.neutral

  // Handle emotion changes with animations
  useEffect(() => {
    if (emotion !== currentEmotion) {
      setIsEmotionChanging(true)
      
      // Determine animation type based on emotion
      const emotionEffects = {
        happy: 'bounce',
        excited: 'pulse',
        angry: 'shake',
        sad: 'fade',
        confused: 'wobble',
        flirty: 'glow',
        neutral: 'smooth'
      }
      
      setEmotionChangeEffect(emotionEffects[emotion] || 'smooth')
      
      // Delay emotion change to show animation
      setTimeout(() => {
        setCurrentEmotion(emotion)
        setIsEmotionChanging(false)
        
        // Clear effect after animation
        setTimeout(() => {
          setEmotionChangeEffect(null)
        }, 1000)
      }, 300)
    }
  }, [emotion, currentEmotion])

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 2
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(generateParticles, 5000)
    return () => clearInterval(interval)
  }, [character])

  // Affection level display
  const getAffectionColor = (level) => {
    if (level >= 80) return '#ff1744' // Deep love
    if (level >= 60) return '#ff6b9d' // Strong attraction
    if (level >= 40) return '#ffeb3b' // Growing interest
    if (level >= 20) return '#00ff41' // Friendly
    return '#64b5f6' // Neutral
  }

  const getAffectionIcon = (level) => {
    if (level >= 80) return Heart
    if (level >= 60) return Flame
    if (level >= 40) return Star
    if (level >= 20) return Sparkles
    return Brain
  }

  const AffectionIcon = getAffectionIcon(affectionLevel)

  return (
    <div className="relative">
      {/* Character Container */}
      <motion.div
        className="relative w-80 h-96 mx-auto"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          scale: currentEmotionData.scale,
          rotate: currentEmotionData.rotation,
          // Emotion change animations
          ...(emotionChangeEffect === 'bounce' && {
            y: [0, -20, 0, -10, 0]
          }),
          ...(emotionChangeEffect === 'shake' && {
            x: [0, -10, 10, -10, 10, 0]
          }),
          ...(emotionChangeEffect === 'wobble' && {
            rotate: [0, -5, 5, -3, 3, 0]
          }),
          ...(emotionChangeEffect === 'pulse' && {
            scale: [currentEmotionData.scale, currentEmotionData.scale * 1.2, currentEmotionData.scale]
          })
        }}
        transition={{
          duration: emotionChangeEffect ? 0.8 : 0.5,
          type: emotionChangeEffect === 'bounce' ? "spring" : "tween",
          stiffness: 100,
          times: emotionChangeEffect ? [0, 0.2, 0.4, 0.6, 0.8, 1] : undefined
        }}
      >
        {/* Portal Background Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${currentChar.color}20 0%, transparent 70%)`,
            filter: `blur(20px)`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [
              0.3,
              emotionChangeEffect === 'glow' ? 1 : currentEmotionData.glow,
              emotionChangeEffect === 'fade' ? 0.1 : 0.3
            ]
          }}
          transition={{
            duration: emotionChangeEffect ? 1.5 : 3,
            repeat: emotionChangeEffect ? 1 : Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Emotion Change Burst Effect */}
        <AnimatePresence>
          {isEmotionChanging && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${currentChar.color}40 0%, transparent 50%)`,
                filter: 'blur(10px)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: [0, 0.8, 0] }}
              exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Floating Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: currentChar.color,
                boxShadow: `0 0 ${particle.size * 2}px ${currentChar.color}50`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-20, -60, -100]
              }}
              transition={{
                duration: 4,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </AnimatePresence>

        {/* Character Avatar */}
        <motion.div
          className="relative w-64 h-64 mx-auto mt-8 rounded-full overflow-hidden"
          style={{
            border: `3px solid ${currentChar.color}`,
            boxShadow: `0 0 30px ${currentChar.color}40, inset 0 0 30px ${currentChar.color}20`
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {/* Character Image Placeholder */}
          <div 
            className="w-full h-full flex items-center justify-center text-6xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${currentChar.color}20, ${currentChar.secondaryColor}20)`,
              color: currentChar.color
            }}
          >
            {character.charAt(0).toUpperCase()}
          </div>

          {/* Emotion Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${currentChar.color}30` }}
            >
              {currentEmotion === 'happy' && '😊'}
              {currentEmotion === 'excited' && '🤩'}
              {currentEmotion === 'confused' && '😕'}
              {currentEmotion === 'angry' && '😠'}
              {currentEmotion === 'sad' && '😢'}
              {currentEmotion === 'flirty' && '😏'}
              {currentEmotion === 'surprised' && '😲'}
              {currentEmotion === 'neutral' && '😐'}
            </div>
          </motion.div>
        </motion.div>

        {/* Character Info */}
        <motion.div
          className="text-center mt-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 
            className="text-2xl font-bold portal-shadow"
            style={{ color: currentChar.color }}
          >
            {currentChar.name}
          </h3>
          <p className="portal-accent text-sm font-medium">
            {currentChar.title} • Dimension {currentChar.dimension}
          </p>
          <p className="portal-text text-xs max-w-xs mx-auto leading-relaxed">
            {currentChar.description}
          </p>
        </motion.div>
      </motion.div>

      {/* Affection Meter */}
      {showStats && (
        <motion.div
          className="absolute top-4 right-4 portal-card p-3 min-w-[120px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <AffectionIcon 
              size={16} 
              style={{ color: getAffectionColor(affectionLevel) }}
            />
            <span className="portal-accent text-xs font-semibold">Affection</span>
          </div>
          
          {/* Affection Bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: getAffectionColor(affectionLevel) }}
              initial={{ width: 0 }}
              animate={{ width: `${affectionLevel}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs portal-accent">{affectionLevel}%</span>
            <span 
              className="text-xs font-semibold"
              style={{ color: getAffectionColor(affectionLevel) }}
            >
              {affectionLevel >= 80 ? 'Love' :
               affectionLevel >= 60 ? 'Attraction' :
               affectionLevel >= 40 ? 'Interest' :
               affectionLevel >= 20 ? 'Friendly' : 'Neutral'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Emotion Indicators */}
      <motion.div
        className="absolute bottom-4 left-4 flex space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {Object.keys(emotions).slice(0, 4).map((emotionKey) => (
          <motion.button
            key={emotionKey}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-300 ${
              currentEmotion === emotionKey 
                ? `border-${currentChar.color} bg-${currentChar.color}/20` 
                : 'border-gray-600 bg-gray-700/50'
            }`}
            onClick={() => setCurrentEmotion(emotionKey)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              borderColor: currentEmotion === emotionKey ? currentChar.color : '#4b5563',
              backgroundColor: currentEmotion === emotionKey ? `${currentChar.color}20` : '#374151'
            }}
          >
            {emotionKey === 'happy' && '😊'}
            {emotionKey === 'excited' && '🤩'}
            {emotionKey === 'confused' && '😕'}
            {emotionKey === 'angry' && '😠'}
          </motion.button>
        ))}
      </motion.div>

      {/* Portal Ring Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="absolute inset-8 rounded-full border-2 border-dashed opacity-30"
          style={{ borderColor: currentChar.color }}
        />
      </motion.div>
    </div>
  )
}

export default CharacterSprite