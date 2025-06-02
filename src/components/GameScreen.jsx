import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Send, 
  Heart, 
  Settings, 
  User, 
  LogOut,
  MessageCircle,
  Atom,
  Brain,
  Trash2,
  Zap
} from 'lucide-react'
import portalGif from '../assets/portal.gif'
import { useGame } from '../context/GameContext'
import { useDatabase } from '../context/DatabaseContext'
import { useOpenRouter } from '../context/OpenRouterContext'

import CharacterSelect from './CharacterSelect'
import SettingsPanel from './Settings'
import DialogueBox from './DialogueBox'

// Character images
import rickImg from '../assets/sprites/rick/rick.jpg'
import mortyImg from '../assets/sprites/morty/morty.jpg'
import rickPrimeImg from '../assets/sprites/rick_prime/RICKPRIME.webp'
import evilMortyImg from '../assets/sprites/evil_morty/evil-morty.png'

const GameScreen = () => {
  // Game context
  const {
    selectedCharacter,
    currentScreen,
    affectionLevel,
    currentEmotion,
    conversationHistory,
    conversationCount,
    nsfwEnabled,
    isLoading,
    selectCharacter,
    goToMenu,
    goToCharacterSelect,
    goToSettings,
    addToHistory,
    updateAffection,
    toggleNSFW,
    clearConversation
  } = useGame()

  // Database context
  const {
    currentUser,
    logoutUser
  } = useDatabase()

  // OpenRouter AI provider
  const { isConnected, isLoading: aiLoading, connectionStatus, generateResponse } = useOpenRouter()

  // Local state
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isThrottling, setIsThrottling] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationHistory])

  // Screen rendering logic
  const renderScreen = () => {
    switch (currentScreen) {
      case 'character-select':
        return (
          <CharacterSelect 
            onCharacterSelect={selectCharacter}
            onBack={goToMenu}
          />
        )
      case 'game':
        return renderGameInterface()
      case 'settings':
        return (
          <SettingsPanel 
            onBack={goToMenu}
          />
        )
      default:
        return renderMainMenu()
    }
  }

  const renderMainMenu = () => {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center portal-gradient portal-orbs"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="text-center max-w-2xl mx-auto px-6">
          {/* Header with user info */}
          <div className="absolute top-4 right-4 flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
                <User size={16} className="text-green-400" />
                <span className="text-white text-sm">{currentUser.username}</span>
                <button
                  onClick={logoutUser}
                  className="text-red-400 hover:text-red-300"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="bg-black/50 rounded-lg px-3 py-2">
                <span className="text-gray-400 text-sm">Guest Mode</span>
              </div>
            )}
          </div>

          {/* Portal Logo */}
          <motion.div 
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="portal-glow mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-6">
              <img 
                src={portalGif} 
                alt="Portal" 
                className="portal-text floating-portal" 
                style={{width: '64px', height: '64px'}} 
              />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              className="portal-button w-full max-w-md mx-auto block"
              onClick={goToCharacterSelect}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src={portalGif} alt="Portal" className="inline mr-2 w-5 h-5" />
              Start Adventure
            </motion.button>

            <motion.button
              className="portal-button w-full max-w-md mx-auto block bg-gradient-to-r from-gray-700 to-gray-600 text-portal-text"
              onClick={goToSettings}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="inline mr-2" size={20} />
              Settings
            </motion.button>
          </motion.div>

          {/* Portal Effects */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="portal-accent text-sm">
              "Wubba lubba dub dub! Time to get schwifty with some interdimensional romance!"
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Heart className="portal-text" size={16} />
              <Zap className="morty-yellow" size={16} />
              <Settings className="portal-blue" size={16} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const renderGameInterface = () => {
    if (!selectedCharacter) return null

    return (
      <motion.div 
        className="min-h-screen portal-gradient portal-orbs flex flex-col"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
      >
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-sm border-b border-portal-blue/30 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToCharacterSelect}
                className="portal-button-small"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="flex items-center space-x-2">
                <img 
                  src={getCharacterImage(selectedCharacter.id)} 
                  alt={selectedCharacter.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-semibold">{selectedCharacter.name}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Affection Level */}
              <div className="flex items-center space-x-2">
                <Heart 
                  size={16} 
                  className={`${affectionLevel >= 20 ? 'text-red-500' : 'text-gray-400'}`}
                  fill={affectionLevel >= 20 ? 'currentColor' : 'none'}
                />
                <span className="text-white text-sm">{affectionLevel}%</span>
              </div>
              
              {/* NSFW Toggle */}
              <button
                onClick={toggleNSFW}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  nsfwEnabled 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {nsfwEnabled ? '18+' : 'SFW'}
              </button>
              

              
              {/* Settings */}
              <button
                onClick={goToSettings}
                className="portal-button-small"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex max-w-6xl mx-auto w-full">
          {/* Character Display */}
          <div className="w-1/3 p-6 flex flex-col items-center justify-center">
            <motion.div 
              className="relative"
              animate={{ 
                scale: currentEmotion === 'excited' ? 1.05 : 1,
                rotate: currentEmotion === 'confused' ? [-1, 1, -1, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={getCharacterImage(selectedCharacter.id)} 
                alt={selectedCharacter.name}
                className="w-64 h-64 object-cover rounded-lg portal-glow"
              />
              
              {/* Emotion Indicator */}
              <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${getEmotionColor(currentEmotion)}`}>
                {getEmotionIcon(currentEmotion)}
              </div>
            </motion.div>
            
            {/* Character Stats */}
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">{selectedCharacter.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Affection:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${affectionLevel}%` }}
                      />
                    </div>
                    <span className="text-white">{affectionLevel}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Conversations:</span>
                  <span className="text-white">{conversationCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col p-6">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
              {conversationHistory.map((entry, index) => {
                const messages = []
                
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
                    timestamp: entry.timestamp
                  })
                }
                
                return messages.map((message, msgIndex) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: msgIndex * 0.1
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-portal-blue to-blue-600 text-white shadow-blue-500/25'
                        : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-portal-text border border-portal-blue/20 shadow-portal-blue/10'
                    }`}>
                      <div className="text-sm leading-relaxed">
                        {formatMessage(message.content)}
                      </div>
                      <div className="text-xs opacity-60 mt-2 text-right">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))
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

            {/* Quick Questions */}
            <motion.div 
              className="mb-4 p-3 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-portal-blue/10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-xs text-gray-400 mb-2">Quick conversation starters:</div>
              <div className="flex flex-wrap gap-2">
                {getQuickQuestions(selectedCharacter?.id).map((question, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setInput(question)}
                    className="px-3 py-1.5 text-xs bg-portal-blue/20 hover:bg-portal-blue/30 border border-portal-blue/30 text-portal-text rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isTyping || isThrottling}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Input Area */}
            <motion.div 
              className="flex space-x-3 p-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-portal-blue/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isThrottling && handleSendMessage()}
                placeholder={`Message ${selectedCharacter?.name}...`}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm px-2 py-3"
                disabled={isTyping || isThrottling}
              />
              
              {/* Delete Chat Button */}
              <motion.button
                onClick={clearConversation}
                className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 p-3 rounded-xl shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(220, 38, 38, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                title="Clear conversation history"
              >
                <Trash2 size={18} />
              </motion.button>
              
              <motion.button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping || isThrottling}
                className="bg-gradient-to-r from-portal-blue to-blue-600 text-white p-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0, 255, 65, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: input.trim() ? "0 4px 15px rgba(0, 255, 65, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}
              >
                <Send size={18} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  const getCharacterImage = (characterId) => {
    const images = {
      rick: rickImg,
      morty: mortyImg,
      rickprime: rickPrimeImg,
      evilmorty: evilMortyImg
    }
    return images[characterId] || rickImg
  }

  const formatMessage = (content) => {
    const safeContent = typeof content === 'string' ? content : ''
    
    // Split by lines first
    return safeContent.split('\n').map((line, lineIndex) => {
      // Process formatting within each line - order matters!
      let processedLine = line
      
      // First, handle bold text: **text** or __text__
      processedLine = processedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
      
      // Then handle actions: *action* (single asterisks that aren't part of bold)
      processedLine = processedLine
        .replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<span class="text-green-400 italic">*$1*</span>')
      
      // Then handle italic text: _text_ (single underscores that aren't part of bold)
      processedLine = processedLine
        .replace(/(?<!_)_([^_\n]+?)_(?!_)/g, '<em class="text-yellow-300">$1</em>')
      
      // Handle dialogue emphasis: "text"
      processedLine = processedLine
        .replace(/"([^"\n]+?)"/g, '<span class="text-blue-300 font-medium">"$1"</span>')
      
      // Handle thoughts: (text)
      processedLine = processedLine
        .replace(/\(([^)\n]+?)\)/g, '<span class="text-gray-400 italic">($1)</span>')
      
      return (
        <span key={lineIndex}>
          <span dangerouslySetInnerHTML={{ __html: processedLine }} />
          {lineIndex < safeContent.split('\n').length - 1 && <br />}
        </span>
      )
    })
  }

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: 'bg-yellow-400',
      sad: 'bg-blue-400',
      angry: 'bg-red-400',
      excited: 'bg-green-400',
      confused: 'bg-purple-400',
      neutral: 'bg-gray-400'
    }
    return colors[emotion] || colors.neutral
  }

  const getEmotionIcon = (emotion) => {
    const icons = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      excited: '🤩',
      confused: '😕',
      neutral: '😐'
    }
    return icons[emotion] || icons.neutral
  }

  const getQuickQuestions = (characterId) => {
    const questions = {
      rick: [
        "What's your latest invention?",
        "Tell me about your adventures",
        "What do you think about the multiverse?",
        "Any portal gun mishaps lately?",
        "What's your opinion on Jerry?"
      ],
      morty: [
        "How was school today?",
        "What's the craziest adventure you've been on?",
        "Are you okay after that last adventure?",
        "What do you want to be when you grow up?",
        "How do you deal with Rick's chaos?"
      ],
      rickprime: [
        "What makes you different from other Ricks?",
        "Tell me about your plans",
        "What's your greatest achievement?",
        "Why are you the superior Rick?",
        "What do you think of C-137 Rick?"
      ],
      evilmorty: [
        "What are your true intentions?",
        "How did you become so calculating?",
        "What's your plan for the Citadel?",
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

    setInput('')
    setIsTyping(true)

    try {

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
      } else {
        aiResponse = await generateResponse(input.trim(), selectedCharacter, conversationHistory)
      }
      
      // Add AI response to history
      const characterMessage = {
        id: Date.now() + 1,
        sender: 'character',
        content: aiResponse,
        timestamp: new Date(),
        emotion: 'neutral' // You can enhance this to detect emotion from response
      }
      addToHistory(input.trim(), aiResponse, 'neutral')
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage = "*glitches* Sorry, something went wrong with the interdimensional communication..."
      addToHistory(input.trim(), errorMessage, 'confused')
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