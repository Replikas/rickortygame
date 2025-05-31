import React, { createContext, useContext, useState, useEffect } from 'react'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    selectedCharacter: null,
    nsfwEnabled: false,
    affectionLevels: {
      rick: 0,
      morty: 0,
      summer: 0,
      beth: 0
    },
    unlockedScenes: ['intro'],
    conversationHistory: [],
    currentEmotion: 'neutral',
    currentSprite: 'neutral',
    gameProgress: {
      totalInteractions: 0,
      completedRoutes: [],
      achievements: []
    },
    webhookLogs: []
  })

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('rickMortyDatingSim')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setGameState(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load saved game state:', error)
      }
    }
  }, [])

  // Save state on changes
  useEffect(() => {
    localStorage.setItem('rickMortyDatingSim', JSON.stringify(gameState))
  }, [gameState])

  const updateAffection = (character, amount) => {
    setGameState(prev => ({
      ...prev,
      affectionLevels: {
        ...prev.affectionLevels,
        [character]: Math.max(0, Math.min(100, prev.affectionLevels[character] + amount))
      }
    }))
  }

  const addToHistory = (entry) => {
    setGameState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, {
        ...entry,
        timestamp: new Date().toISOString()
      }]
    }))
  }

  const unlockScene = (sceneId) => {
    setGameState(prev => ({
      ...prev,
      unlockedScenes: [...new Set([...prev.unlockedScenes, sceneId])]
    }))
  }

  const setCurrentEmotion = (emotion) => {
    setGameState(prev => ({
      ...prev,
      currentEmotion: emotion
    }))
  }

  const setCurrentSprite = (sprite) => {
    setGameState(prev => ({
      ...prev,
      currentSprite: sprite
    }))
  }

  const toggleNSFW = () => {
    setGameState(prev => ({
      ...prev,
      nsfwEnabled: !prev.nsfwEnabled
    }))
  }

  const logWebhook = (data) => {
    setGameState(prev => ({
      ...prev,
      webhookLogs: [...prev.webhookLogs, {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }]
    }))
  }

  const resetGame = () => {
    setGameState({
      selectedCharacter: null,
      nsfwEnabled: false,
      affectionLevels: {
        rick: 0,
        morty: 0,
        summer: 0,
        beth: 0
      },
      unlockedScenes: ['intro'],
      conversationHistory: [],
      currentEmotion: 'neutral',
      currentSprite: 'neutral',
      gameProgress: {
        totalInteractions: 0,
        completedRoutes: [],
        achievements: []
      },
      webhookLogs: []
    })
    localStorage.removeItem('rickMortyDatingSim')
  }

  const value = {
    gameState,
    setGameState,
    updateAffection,
    addToHistory,
    unlockScene,
    setCurrentEmotion,
    setCurrentSprite,
    toggleNSFW,
    logWebhook,
    resetGame
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}