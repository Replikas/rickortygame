import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDatabase } from './DatabaseContext'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [conversationHistory, setConversationHistory] = useState([])
  const [affectionLevel, setAffectionLevel] = useState(0)
  const [currentEmotion, setCurrentEmotion] = useState('neutral')
  const [nsfwEnabled, setNsfwEnabled] = useState(false)
  const [totalInteractions, setTotalInteractions] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [currentScreen, setCurrentScreen] = useState('menu')
  const [isLoading, setIsLoading] = useState(false)
  const [messagesSinceLastSave, setMessagesSinceLastSave] = useState(0)
  const [pendingProgressSave, setPendingProgressSave] = useState(false)
  
  const { 
    currentUser, 
    loadProgress, 
    saveProgress, 
    loadChatHistory, 
    saveChatToHistory, 
    autoSave,
    loadMemories,
    saveMemory
  } = useDatabase()

  // Load character progress when character is selected
  useEffect(() => {
    const loadCharacterData = async () => {
      if (!selectedCharacter || !currentUser) return
      
      setIsLoading(true)
      try {
        // Load progress
        const progress = await loadProgress(selectedCharacter.id)
        if (progress) {
          setAffectionLevel(progress.affection_level || 0)
          setCurrentEmotion(progress.current_emotion || 'neutral')
          setNsfwEnabled(progress.nsfw_enabled || false)
          setTotalInteractions(progress.total_interactions || 0)
        }
        
        // Load chat history
        const history = await loadChatHistory(selectedCharacter.id, 50)
        const formattedHistory = history.map(chat => ({
          userInput: chat.user_input,
          response: chat.character_response,
          emotion: chat.emotion,
          timestamp: chat.timestamp
        }))
        setConversationHistory(formattedHistory)
      } catch (error) {
        console.error('Failed to load character data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacterData()
  }, [selectedCharacter, currentUser, loadProgress, loadChatHistory])

  // Auto-save progress periodically (only if there are pending changes)
  useEffect(() => {
    if (!selectedCharacter || !currentUser || !pendingProgressSave) return

    const saveInterval = setInterval(async () => {
      if (pendingProgressSave) {
        try {
          await saveProgress(selectedCharacter.id, {
            affectionLevel,
            currentEmotion,
            nsfwEnabled,
            totalInteractions
          })
          setMessagesSinceLastSave(0)
          setPendingProgressSave(false)
        } catch (error) {
          console.error('Auto-save failed:', error)
        }
      }
    }, 60000) // Save every 60 seconds if there are pending changes

    return () => clearInterval(saveInterval)
  }, [selectedCharacter, currentUser, affectionLevel, currentEmotion, nsfwEnabled, totalInteractions, pendingProgressSave, saveProgress])

  const selectCharacter = (character) => {
    setSelectedCharacter(character)
    setCurrentScreen('game')
    setMessagesSinceLastSave(0)
    setPendingProgressSave(false)
  }

  const updateAffection = async (amount) => {
    const newLevel = Math.max(0, Math.min(100, affectionLevel + amount))
    setAffectionLevel(newLevel)
    setPendingProgressSave(true)
  }

  const addToHistory = async (userInput, characterResponse, emotion) => {
    const newEntry = {
      userInput,
      response: characterResponse,
      emotion,
      timestamp: new Date().toISOString()
    }
    
    setConversationHistory(prev => [...prev, newEntry])
    setTotalInteractions(prev => prev + 1)
    setMessagesSinceLastSave(prev => prev + 1)
    setPendingProgressSave(true)
    
    // Save to database if user is logged in
    if (selectedCharacter && currentUser) {
      try {
        // Save user message
        if (userInput) {
          await saveChatToHistory(selectedCharacter.id, userInput, true)
        }
        // Save character response
        if (characterResponse) {
          await saveChatToHistory(selectedCharacter.id, characterResponse, false)
        }
        
        // Check if we should save progress (every 10 messages)
        if (messagesSinceLastSave >= 9) { // 9 because we just incremented it
          await saveProgress(selectedCharacter.id, {
            affectionLevel,
            currentEmotion: emotion,
            nsfwEnabled,
            totalInteractions: totalInteractions + 1
          })
          setMessagesSinceLastSave(0)
          setPendingProgressSave(false)
        }
      } catch (error) {
        console.error('Failed to save chat:', error)
      }
    }
  }

  const setEmotion = (emotion) => {
    setCurrentEmotion(emotion)
    setPendingProgressSave(true)
  }

  const toggleNSFW = async () => {
    const newNsfwEnabled = !nsfwEnabled
    setNsfwEnabled(newNsfwEnabled)
    
    // Save progress when NSFW setting changes
    if (selectedCharacter && currentUser) {
      try {
        await saveProgress(selectedCharacter.id, {
          affectionLevel,
          currentEmotion,
          nsfwEnabled: newNsfwEnabled,
          totalInteractions
        })
      } catch (error) {
        console.error('Failed to save NSFW setting:', error)
      }
    }
  }

  const clearConversation = () => {
    setConversationHistory([])
  }

  const resetCharacterProgress = async () => {
    setAffectionLevel(0)
    setCurrentEmotion('neutral')
    setTotalInteractions(0)
    setConversationHistory([])
    setMessagesSinceLastSave(0)
    setPendingProgressSave(false)
    
    // Save reset state immediately (important state change)
    if (selectedCharacter && currentUser) {
      try {
        await saveProgress(selectedCharacter.id, {
          affectionLevel: 0,
          currentEmotion: 'neutral',
          nsfwEnabled,
          totalInteractions: 0
        })
      } catch (error) {
        console.error('Failed to save reset progress:', error)
      }
    }
  }

  const goToMenu = () => {
    setCurrentScreen('menu')
    setSelectedCharacter(null)
  }

  const goToCharacterSelect = () => {
    setCurrentScreen('character-select')
    setSelectedCharacter(null)
  }

  const goToSettings = () => {
    setCurrentScreen('settings')
  }

  const value = {
    // State
    conversationHistory,
    affectionLevel,
    currentEmotion,
    nsfwEnabled,
    totalInteractions,
    selectedCharacter,
    currentScreen,
    isLoading,
    
    // Actions
    selectCharacter,
    updateAffection,
    addToHistory,
    setEmotion,
    toggleNSFW,
    clearConversation,
    resetCharacterProgress,
    
    // Navigation
    goToMenu,
    goToCharacterSelect,
    goToSettings,
    setCurrentScreen,
    
    // Database integration
    currentUser
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}