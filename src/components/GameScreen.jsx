import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Settings as SettingsIcon, MessageCircle, Sparkles, Heart, Zap, Star, Flame } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useOpenRouter } from '../context/OpenRouterContext'
import { useSettings } from '../context/SettingsContext'
import { useAudio } from '../context/AudioContext'
import CharacterSprite from './CharacterSprite'
import DialogueBox from './DialogueBox'
import AffectionMeter from './AffectionMeter'
import Settings from './Settings'
import ChoiceButtons from './ChoiceButtons'
import { generateResponse } from '../services/openRouterService'

const GameScreen = () => {
  const {
    selectedCharacter,
    conversationHistory,
    addToHistory,
    affectionLevel,
    emotion,
    setEmotion,
    updateAffection,
    clearConversation,
    isLoading,
    error
  } = useGame()

  const { isConnected } = useOpenRouter()
  const { showSettings, setShowSettings } = useSettings()
  const { playSound } = useAudio()
  
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isThrottling, setIsThrottling] = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [currentChoices, setCurrentChoices] = useState([])
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationHistory, isTyping])

  // Format message content to HTML for rendering
  const formatMessageToHTML = (content) => {
    if (!content) return ''
    
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
      .replace(/_(.*?)_/g, '<em>$1</em>') // _italic_
      .replace(/`(.*?)`/g, '<code>$1</code>') // `code`
      .replace(/\n/g, '<br>') // line breaks
  }

  const renderScreen = () => {
    if (showSettings) {
      return <Settings onClose={() => setShowSettings(false)} />
    }

    if (!selectedCharacter) {
      return (
        <div className="min-h-screen flex items-center justify-center portal-gradient">
          <div className="text-center">
            <div className="portal-glow w-16 h-16 rounded-full bg-portal-blue mx-auto mb-4 animate-pulse" />
            <p className="text-portal-text">Select a character to begin...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen portal-gradient flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-portal-blue/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-portal-blue to-portal-green flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-portal-text">{selectedCharacter.name}</h1>
              <p className="text-sm text-gray-400">Interdimensional Chat</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AffectionMeter level={affectionLevel} />
            <button
               onClick={() => setShowSettings(true)}
               className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
             >
               <SettingsIcon className="w-5 h-5 text-portal-text" />
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Character Display */}
          <div className="hidden lg:flex lg:w-1/3 xl:w-2/5 items-center justify-center p-6">
            <div className="relative">
              <CharacterSprite 
                character={selectedCharacter} 
                emotion={emotion}
                className="w-64 h-64 xl:w-80 xl:h-80"
              />
              {/* Floating emotion indicators */}
              <AnimatePresence>
                {emotion === 'happy' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: -20 }}
                    className="absolute -top-4 -right-4 text-yellow-400"
                  >
                    <Sparkles className="w-8 h-8" />
                  </motion.div>
                )}
                {emotion === 'flirty' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: -20 }}
                    className="absolute -top-4 -right-4 text-pink-400"
                  >
                    <Heart className="w-8 h-8" />
                  </motion.div>
                )}
                {emotion === 'excited' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: -20 }}
                    className="absolute -top-4 -right-4 text-orange-400"
                  >
                    <Zap className="w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-black/10 backdrop-blur-sm border-l border-portal-blue/10">
            {/* Character Info Bar - Mobile */}
            <div className="lg:hidden flex items-center justify-between p-3 bg-black/20 border-b border-portal-blue/10">
              <div className="flex items-center space-x-3">
                <CharacterSprite 
                  character={selectedCharacter} 
                  emotion={emotion}
                  className="w-12 h-12"
                />
                <div>
                  <h2 className="font-semibold text-portal-text">{selectedCharacter.name}</h2>
                  <p className="text-xs text-gray-400 capitalize">{emotion}</p>
                </div>
              </div>
              <button
                onClick={clearConversation}
                className="text-xs px-3 py-1 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col p-3 sm:p-6">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96 sm:max-h-[500px] min-h-0">
                {conversationHistory.map((entry, index) => {
                  // Handle both new individual message format and legacy format
                  let messages = []
                  
                  if (entry.sender) {
                    // New individual message format
                    messages = [{
                      id: entry.id || `${index}-${entry.sender}`,
                      sender: entry.sender,
                      content: entry.content,
                      timestamp: entry.timestamp,
                      emotion: entry.emotion || 'neutral'
                    }]
                  } else {
                    // Legacy format - convert to individual messages
                    // Add user message if it exists
                    if (entry.userInput) {
                      messages.push({
                        id: `${index}-user`,
                        sender: 'user',
                        content: entry.userInput,
                        timestamp: entry.timestamp
                      })
                    }
                    
                    // Add character response if it exists
                    if (entry.response) {
                      messages.push({
                        id: `${index}-character`,
                        sender: 'character',
                        content: entry.response,
                        timestamp: entry.timestamp,
                        emotion: entry.emotion || 'neutral'
                      })
                    }
                  }
                  
                  return messages.map((message, msgIndex) => {
                    // Emotion-based animation variants
                    const getEmotionAnimation = (emotion) => {
                      const baseAnimation = {
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          delay: msgIndex * 0.1
                        }
                      }
                      
                      switch(emotion) {
                        case 'happy':
                          return {
                            ...baseAnimation,
                            y: [30, -10, 0],
                            scale: [0.8, 1.1, 1],
                            rotate: [0, 3, 0],
                            transition: { ...baseAnimation.transition, type: "spring", bounce: 0.5, duration: 1 }
                          }
                        case 'excited':
                          return {
                            ...baseAnimation,
                            scale: [0.8, 1.15, 0.95, 1.05, 1],
                            rotate: [0, 5, -3, 2, 0],
                            y: [30, -8, 2, 0],
                            transition: { ...baseAnimation.transition, duration: 1.2, type: "spring", bounce: 0.4 }
                          }
                        case 'angry':
                          return {
                            ...baseAnimation,
                            x: [0, -5, 5, -4, 4, -2, 2, 0],
                            scale: [0.8, 1.05, 1],
                            transition: { ...baseAnimation.transition, duration: 0.8 }
                          }
                        case 'sad':
                          return {
                            ...baseAnimation,
                            y: [30, 8, 0],
                            opacity: [0, 0.6, 1],
                            scale: [0.8, 0.95, 1],
                            transition: { ...baseAnimation.transition, duration: 1.5, ease: "easeOut" }
                          }
                        case 'confused':
                          return {
                            ...baseAnimation,
                            rotate: [0, -2, 2, -1, 1, 0],
                            scale: [0.8, 1.02, 1],
                            transition: { ...baseAnimation.transition, duration: 1 }
                          }
                        case 'flirty':
                          return {
                            ...baseAnimation,
                            scale: [0.8, 1.08, 0.98, 1.03, 1],
                            y: [30, -5, 0],
                            rotate: [0, 2, -1, 0],
                            transition: { ...baseAnimation.transition, duration: 1.3, type: "spring", bounce: 0.3 }
                          }
                        default:
                          return baseAnimation
                      }
                    }

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={getEmotionAnimation(message.emotion)}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                      >
                        <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-portal-blue/80 to-portal-green/60 text-white border-portal-blue/30'
                            : `bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-portal-text border-portal-blue/20 ${
                                message.emotion === 'happy' ? 'shadow-yellow-500/20' :
                                message.emotion === 'excited' ? 'shadow-orange-500/20' :
                                message.emotion === 'angry' ? 'shadow-red-500/20' :
                                message.emotion === 'sad' ? 'shadow-blue-500/20' :
                                message.emotion === 'flirty' ? 'shadow-pink-500/20' :
                                'shadow-portal-blue/20'
                              }`
                        }`}>
                          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessageToHTML(message.content) }} />
                          <div className="text-xs opacity-60 mt-2 text-right">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                }).flat()}
                
                {(isTyping || isThrottling) && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    className="flex justify-start mb-3"
                  >
                    {isThrottling ? (
                      <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 text-yellow-300 border border-yellow-500/30 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                          </div>
                          <span className="text-yellow-300 text-sm">Waiting to avoid rate limits...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-portal-text border border-portal-blue/20 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-portal-blue rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                            <div className="w-2 h-2 bg-portal-blue rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                            <div className="w-2 h-2 bg-portal-blue rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                          </div>
                          <span className="text-portal-text text-sm">{selectedCharacter?.name} is typing...</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions - Mobile Optimized */}
              <motion.div 
                className="mb-3 lg:mb-4 p-2 lg:p-3 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-portal-blue/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-400 mb-2 lg:hidden">Quick starters:</div>
                <div className="hidden lg:block text-xs text-gray-400 mb-2">Quick conversation starters:</div>
                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                  {getQuickQuestions(selectedCharacter?.id).slice(0, 4).map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 bg-portal-blue/20 text-portal-blue rounded-lg border border-portal-blue/30 hover:bg-portal-blue/30 transition-all duration-200 hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {question.length > 25 ? `${question.substring(0, 25)}...` : question}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Input Area - Mobile Optimized */}
              <motion.form 
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSendMessage()
                }}
                className="flex gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-portal-blue/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ touchAction: 'manipulation' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSendMessage()
                    }
                  }}
                  placeholder={`Message ${selectedCharacter?.name}...`}
                  className="flex-1 px-3 lg:px-4 py-2 lg:py-3 bg-gray-900/50 text-portal-text placeholder-gray-400 rounded-lg border border-gray-600/50 focus:border-portal-blue/50 focus:outline-none focus:ring-2 focus:ring-portal-blue/20 text-sm lg:text-base"
                  disabled={isTyping}
                  inputMode="text"
                  style={{ touchAction: 'manipulation' }}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-portal-blue to-portal-green text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-portal-blue/80 hover:to-portal-green/80 transition-all duration-200 flex items-center justify-center min-w-[44px] lg:min-w-[48px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ touchAction: 'manipulation' }}
                >
                  {isTyping ? (
                    <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                  )}
                </motion.button>
              </motion.form>
            </div>
          </div>
        </div>

        {/* Choice Buttons Overlay */}
        <AnimatePresence>
          {showChoices && (
            <ChoiceButtons
              choices={currentChoices}
              onChoice={(choice) => {
                setInput(choice)
                setShowChoices(false)
                setCurrentChoices([])
              }}
              onClose={() => {
                setShowChoices(false)
                setCurrentChoices([])
              }}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  const getQuickQuestions = (characterId) => {
    const questions = {
      rick: [
        "What's your latest invention?",
        "Tell me about your adventures",
        "What do you think of Morty?",
        "Any interdimensional travel tips?"
      ],
      morty: [
        "How do you deal with Rick's crazy schemes?",
        "What's the scariest adventure you've been on?",
        "Do you ever get tired of the multiverse?",
        "What's your favorite dimension?"
      ],
      evilmorty: [
        "What's your plan for the multiverse?",
        "Why did you turn against other Mortys?",
        "What drives your ambition?"
      ]
    }
    return questions[characterId] || questions.rick
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping || !selectedCharacter) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    console.log('Sending message:', userMessage.content)
    console.log('Selected character:', selectedCharacter?.id)
    console.log('Is connected:', isConnected)

    setInput('')
    setIsTyping(true)

    try {
      // Add user message to history first
      addToHistory(input.trim(), '', 'neutral')

      // Generate AI response using OpenRouter or fallback message
      let aiResponse
      if (!isConnected) {
        // Character-specific responses about needing AI configuration
        switch (selectedCharacter.id) {
          case 'rick':
            aiResponse = "*burp* Oh great, another genius who can't even configure a simple API key. Look, I'd love to enlighten you with my vast intellect, but apparently whoever set this up forgot the most basic step. Go to settings and get an OpenRouter API key, then maybe we can have a conversation that doesn't make me want to portal gun myself."
            break
          case 'morty':
            aiResponse = "Oh geez, uh, I-I think there's something wrong with the AI thingy? Like, I want to talk to you and all, but it says there's no API key configured or whatever. M-maybe you could go to the settings and fix that? I don't really understand all this technical stuff, but Rick always says you need the right keys for things to work..."
            break
          case 'evilmorty':
            aiResponse = "*adjusts eyepatch with a calculating smile* How... predictable. You want to chat, but you haven't even bothered to properly configure the system. I suppose I shouldn't be surprised - most people lack the foresight for proper preparation. If you want to have a meaningful conversation, you'll need to set up an OpenRouter API key in the settings. Until then, we're both just wasting time."
            break
          case 'rickprime':
            aiResponse = "Pathetic. You can't even manage basic configuration. No API key means no conversation - it's that simple. Fix it or don't waste my time."
            break
          default:
            aiResponse = `*${selectedCharacter.name} looks confused* Hey, it seems like there's no AI service configured. You'll need to set up an API key in the settings to chat with me properly!`
        }
        // Add AI response to history for disconnected state
        addToHistory('', aiResponse, 'confused')
      } else {
        const response = await generateResponse(input.trim(), selectedCharacter, conversationHistory)
        
        // Handle both old string format and new object format for backward compatibility
        if (typeof response === 'object' && response.text) {
          aiResponse = response.text
          const detectedEmotion = response.emotion || 'neutral'
          
          // Update character emotion based on AI response
           setEmotion(detectedEmotion)
           
           // Adjust affection based on emotion
           const emotionAffectionMap = {
             happy: 2,
             excited: 3,
             flirty: 4,
             neutral: 0,
             confused: -1,
             sad: -2,
             angry: -3
           }
           
           const affectionChange = emotionAffectionMap[detectedEmotion] || 0
           if (affectionChange !== 0) {
             updateAffection(affectionChange)
           }
           
           // Add AI response to history with detected emotion
           addToHistory('', aiResponse, detectedEmotion)
        } else {
          // Fallback for old string format
          aiResponse = response
          // Add AI response to history
          addToHistory('', aiResponse, 'neutral')
        }
      }
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage = "*glitches* Sorry, something went wrong with the interdimensional communication..."
      setEmotion('confused')
      // Add only AI error response to history (user message already added)
      addToHistory('', errorMessage, 'confused')
    } finally {
      setIsTyping(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center portal-gradient">
        <div className="text-center">
          <div className="portal-glow w-16 h-16 rounded-full bg-portal-blue mx-auto mb-4 animate-pulse" />
          <p className="text-portal-text">Loading interdimensional portal...</p>
        </div>
      </div>
    )
  }

  // Remove the immediate error display - let users navigate normally

  return renderScreen()
}

export default GameScreen