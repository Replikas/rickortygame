import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Zap, Heart, Brain, Star, Lock } from 'lucide-react'

// Import character profile images
import mortyImg from '../assets/sprites/morty/morty.jpg'
import rickImg from '../assets/sprites/rick/rick.jpg'
import rickPrimeImg from '../assets/sprites/rick_prime/RICKPRIME.webp'
import evilMortyImg from '../assets/sprites/evil_morty/evil-morty.png'

const characters = [
  {
    id: 'morty',
    name: 'Morty Smith',
    title: 'Anxious Teenager',
    description: 'Sweet, nervous, and surprisingly resilient. The perfect balance to Rick\'s chaos.',
    personality: 'Nervous, Kind, Loyal',
    background: 'A 14-year-old high school student who gets dragged into interdimensional adventures by his grandfather Rick. Despite his anxiety and self-doubt, he often shows surprising courage and moral clarity.',
    difficulty: 'Beginner',
    unlocked: true,
    color: '#ffd700',
    bgGradient: 'from-yellow-900 to-gray-900',
    icon: Heart,
    image: mortyImg,
    quote: "Aw geez, I-I don't know if I'm good at this dating stuff..."
  },
  {
    id: 'rick',
    name: 'Rick Sanchez',
    title: 'Mad Scientist',
    description: 'Genius inventor with a drinking problem and zero filter. Prepare for interdimensional chaos.',
    personality: 'Cynical, Brilliant, Unpredictable',
    background: 'A genius scientist and inventor who can travel through dimensions. He\'s alcoholic, nihilistic, and often cruel, but occasionally shows glimpses of caring for his family. Says "burp" frequently and uses scientific jargon.',
    difficulty: 'Expert',
    unlocked: true,
    color: '#00ff41',
    bgGradient: 'from-green-900 to-gray-900',
    icon: Brain,
    image: rickImg,
    quote: "Listen Morty, dating is just chemistry, and I'm the best chemist in the multiverse!"
  },
  {
    id: 'rickprime',
    name: 'Rick Prime',
    title: 'The Original Rick',
    description: 'The Rick who killed C-137\'s family and started it all',
    personality: 'Ruthless, calculating, supremely confident',
    background: 'The original Rick who abandoned his family and later killed the families of other Ricks. He\'s even more ruthless and emotionally detached than C-137 Rick, with no regard for anyone but himself.',
    difficulty: 'Expert',
    unlocked: true,
    color: '#ff1744',
    bgGradient: 'from-red-900 to-gray-900',
    icon: Brain,
    image: rickPrimeImg,
    quote: "I'm the Rick who doesn't come back."
  },
  {
    id: 'evilmorty',
    name: 'Evil Morty',
    title: 'The One Who Broke Free',
    description: 'The Morty who escaped the Central Finite Curve',
    personality: 'Manipulative, intelligent, coldly determined',
    background: 'A Morty who grew tired of being controlled by Ricks and orchestrated his escape from the Central Finite Curve. He\'s calculating, strategic, and speaks with cold intelligence rather than Morty\'s usual stammering.',
    difficulty: 'Expert',
    unlocked: true,
    color: '#ffc107',
    bgGradient: 'from-yellow-900 to-gray-900',
    icon: Star,
    image: evilMortyImg,
    quote: "I'm not looking for a relationship. I'm looking for freedom."
  }
]

function CharacterSelect({ onCharacterSelect, onBack }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [hoveredCharacter, setHoveredCharacter] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  }

  const handleCharacterSelect = (character) => {
    if (!character.unlocked) return
    setSelectedCharacter(character)
    setTimeout(() => {
      onCharacterSelect(character)
    }, 500)
  }

  return (
    <motion.div 
      className="min-h-screen portal-gradient portal-orbs p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="max-w-7xl mx-auto mb-8"
        variants={cardVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            className="portal-button bg-gradient-to-r from-gray-700 to-gray-600 text-portal-text px-6 py-3"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="inline mr-2" size={20} />
            Back to Menu
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold portal-shadow-lg mb-2">
              <span className="rick-green">Choose Your</span>
              <span className="text-gray-400"> </span>
              <span className="morty-yellow">Adventure</span>
            </h1>
            <p className="portal-accent text-lg">Select your interdimensional companion</p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>
      </motion.div>

      {/* Character Grid */}
      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {characters.map((character) => {
          const IconComponent = character.icon
          const isSelected = selectedCharacter?.id === character.id
          const isHovered = hoveredCharacter === character.id
          
          return (
            <motion.div
              key={character.id}
              className={`portal-card relative overflow-hidden cursor-pointer transition-all duration-300 ${
                character.unlocked ? 'hover:scale-105' : 'opacity-60 cursor-not-allowed'
              } ${isSelected ? 'ring-4 ring-portal-green' : ''}`}
              variants={cardVariants}
              onClick={() => handleCharacterSelect(character)}
              onMouseEnter={() => setHoveredCharacter(character.id)}
              onMouseLeave={() => setHoveredCharacter(null)}
              whileHover={character.unlocked ? { y: -5 } : {}}
              whileTap={character.unlocked ? { scale: 0.98 } : {}}
            >
              {/* Character Profile Picture */}
              <div className={`h-48 bg-gradient-to-br ${character.bgGradient} relative overflow-hidden`}>
                <img 
                  src={character.image} 
                  alt={character.name}
                  className={`w-full h-full object-cover ${
                    character.id === 'rickprime' ? 'object-top' : 'object-center'
                  }`}
                  style={{
                    filter: character.unlocked ? 'none' : 'grayscale(100%) brightness(0.3)',
                    objectPosition: character.id === 'rickprime' ? 'center 20%' : 'center'
                  }}
                />
                {/* Dark overlay for better icon visibility */}
                <div className="absolute inset-0 bg-black/20" />
                {/* Portal glow overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  style={{
                    background: `linear-gradient(to top, ${character.color}20, transparent 50%)`
                  }}
                />
                {!character.unlocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock size={48} className="text-gray-400" />
                  </div>
                )}
                {/* Character icon overlay */}
                <div className="absolute bottom-2 right-2">
                  <IconComponent 
                    size={24} 
                    className="text-white/80" 
                    style={{ color: character.color }}
                  />
                </div>
                
                {/* Floating particles effect */}
                {(isHovered || isSelected) && character.unlocked && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: character.color,
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 40}%`
                        }}
                        animate={{
                          y: [-10, -20, -10],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Character Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold portal-text">{character.name}</h3>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${character.color}20`,
                      color: character.color
                    }}
                  >
                    {character.difficulty}
                  </span>
                </div>
                
                <p className="portal-accent text-sm mb-2">{character.title}</p>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{character.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs portal-accent mb-1">Personality:</p>
                  <p className="text-sm text-gray-300">{character.personality}</p>
                </div>

                {/* Quote */}
                {(isHovered || isSelected) && character.unlocked && (
                  <motion.div
                    className="border-t border-gray-600 pt-4 mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="text-xs italic text-gray-400 leading-relaxed">
                      "{character.quote}"
                    </p>
                  </motion.div>
                )}

                {/* Unlock Status */}
                {!character.unlocked && (
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-400">
                      Locked
                    </div>
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 border-4 border-portal-green rounded-lg pointer-events-none"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-2 right-2 bg-portal-green text-black rounded-full p-1">
                    <Zap size={16} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Bottom Info */}
      <motion.div 
        className="max-w-4xl mx-auto mt-12 text-center"
        variants={cardVariants}
      >
        <div className="portal-card p-6">
          <h3 className="text-lg font-semibold portal-text mb-2">Interdimensional Dating Tips</h3>
          <p className="portal-accent text-sm mb-4">
            Each character has unique personality traits and conversation styles. 
            Choose wisely - your adventure depends on it!
          </p>
          <div className="flex justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-1">
              <Heart size={14} className="text-green-400" />
              <span className="text-gray-400">Beginner Friendly</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain size={14} className="text-yellow-400" />
              <span className="text-gray-400">Challenging</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap size={14} className="text-red-400" />
              <span className="text-gray-400">Expert Level</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CharacterSelect