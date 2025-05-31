import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Heart, Brain, Atom } from 'lucide-react'
import GameScreen from './components/GameScreen'
import CharacterSelect from './components/CharacterSelect'
import Settings from './components/Settings'
import { GameProvider } from './context/GameContext'
import { GeminiProvider } from './context/GeminiContext'

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu')
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'character-select':
        return (
          <CharacterSelect 
            onCharacterSelect={(character) => {
              setSelectedCharacter(character)
              setCurrentScreen('game')
            }}
            onBack={() => setCurrentScreen('menu')}
          />
        )
      case 'game':
        return (
          <GameScreen 
            character={selectedCharacter}
            onBack={() => setCurrentScreen('character-select')}
          />
        )
      case 'settings':
        return (
          <Settings 
            onBack={() => setCurrentScreen('menu')}
          />
        )
      default:
        return (
          <motion.div 
            className="min-h-screen flex items-center justify-center portal-gradient portal-orbs"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center max-w-2xl mx-auto px-6">
              {/* Portal Logo */}
              <motion.div 
                className="relative mb-8"
                variants={itemVariants}
              >
                <div className="portal-glow mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-6">
                  <Atom size={64} className="portal-text floating-portal" />
                </div>
                <h1 className="text-6xl font-bold portal-shadow-lg mb-4">
                  <span className="rick-green">RICK</span>
                  <span className="text-gray-400"> & </span>
                  <span className="morty-yellow">MORTY</span>
                </h1>
                <h2 className="text-2xl portal-accent font-semibold">
                  Interdimensional Dating Simulator
                </h2>
              </motion.div>

              {/* Menu Buttons */}
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                <motion.button
                  className="portal-button w-full max-w-md mx-auto block"
                  onClick={() => setCurrentScreen('character-select')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="inline mr-2" size={20} />
                  Start Adventure
                </motion.button>

                <motion.button
                  className="portal-button w-full max-w-md mx-auto block bg-gradient-to-r from-gray-700 to-gray-600 text-portal-text"
                  onClick={() => setCurrentScreen('settings')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Brain className="inline mr-2" size={20} />
                  Settings
                </motion.button>
              </motion.div>

              {/* Portal Effects */}
              <motion.div 
                className="mt-12 text-center"
                variants={itemVariants}
              >
                <p className="portal-accent text-sm">
                  "Wubba lubba dub dub! Time to get schwifty with some interdimensional romance!"
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <Heart className="portal-text" size={16} />
                  <Zap className="morty-yellow" size={16} />
                  <Brain className="portal-blue" size={16} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <GeminiProvider>
      <GameProvider>
        <div className="min-h-screen portal-gradient">
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </div>
      </GameProvider>
    </GeminiProvider>
  )
}

export default App