import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Heart, Zap, Brain, Atom, MessageCircle, User } from 'lucide-react'
import { useGemini } from '../context/GeminiContext'

// Import character profile images
import mortyImg from '../assets/sprites/morty/morty.jpg'
import rickImg from '../assets/sprites/rick/rick.jpg'
import rickPrimeImg from '../assets/sprites/rick_prime/RICKPRIME.webp'
import evilMortyImg from '../assets/sprites/evil_morty/evil-morty.png'

function GameScreen({ character, onBack }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [affectionLevel, setAffectionLevel] = useState(0)
  const [currentEmotion, setCurrentEmotion] = useState('neutral')
  const [conversationCount, setConversationCount] = useState(0)
  const messagesEndRef = useRef(null)
  const { generateResponse } = useGemini()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize conversation with character
    const initMessage = {
      id: Date.now(),
      sender: 'character',
      content: getInitialMessage(character),
      timestamp: new Date(),
      emotion: 'neutral'
    }
    setMessages([initMessage])
  }, [character])

  const getCharacterImage = (characterId) => {
    const images = {
      rick: rickImg,
      morty: mortyImg,
      rickprime: rickPrimeImg,
      evilmorty: evilMortyImg
    }
    return images[characterId] || rickImg
  }

  const formatMessage = (text) => {
    // Convert *text* to italics
    const parts = text.split(/\*(.*?)\*/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <em key={index} className="italic">{part}</em>;
      }
      return part;
    });
  };

  const getInitialMessage = (char) => {
    const greetings = {
      rick: "*burp* Oh great, another dimension where I have to deal with... this. Look, I don't know what you're expecting here, but I'm Rick Sanchez - the smartest man in the universe. So either impress me or get out of my lab.",
      morty: "Oh geez, h-hi there! I'm Morty, and uh... *nervous laugh* I'm not really sure how this whole dating thing works. I mean, I've seen some pretty crazy stuff with Rick, but this is... this is different, you know?",
      rickprime: "*cold stare* So you're the one who thinks they can handle the original Rick. I've destroyed countless realities and killed infinite versions of myself. What makes you think you're special?",
      evilmorty: "*adjusts eyepatch* Interesting. Another person who thinks they understand me. I've manipulated entire civilizations and broken free from the Central Finite Curve. But sure, let's see what you have to offer."
    }
    return greetings[char.id] || "Hello there! Ready for an interdimensional adventure?"
  }

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: '#00ff41',
      sad: '#4ecdc4',
      angry: '#ff6b9d',
      excited: '#ffd700',
      neutral: '#ffffff',
      confused: '#a855f7',
      flirty: '#ff6b9d'
    }
    return colors[emotion] || colors.neutral
  }

  const getEmotionIcon = (emotion) => {
    const icons = {
      happy: Heart,
      sad: Brain,
      angry: Zap,
      excited: Atom,
      neutral: MessageCircle,
      confused: Brain,
      flirty: Heart
    }
    return icons[emotion] || icons.neutral
  }

  const analyzeMessage = (message) => {
    // Simple emotion analysis based on keywords
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('love') || lowerMessage.includes('cute') || lowerMessage.includes('beautiful')) {
      return 'flirty'
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('hate')) {
      return 'angry'
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('sorry') || lowerMessage.includes('hurt')) {
      return 'sad'
    } else if (lowerMessage.includes('excited') || lowerMessage.includes('amazing') || lowerMessage.includes('awesome')) {
      return 'excited'
    } else if (lowerMessage.includes('confused') || lowerMessage.includes('what') || lowerMessage.includes('?')) {
      return 'confused'
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('great') || lowerMessage.includes('wonderful')) {
      return 'happy'
    }
    return 'neutral'
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      emotion: analyzeMessage(inputMessage)
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    setConversationCount(prev => prev + 1)

    try {
      // Create character-specific prompt
      const characterPrompt = `You are ${character.name} from Rick and Morty. ${character.description} 
      Personality: ${character.personality}
      
      Respond to this message in character: "${inputMessage}"
      
      Keep responses under 150 words and stay true to the character's voice and personality. Be engaging and interactive.`

      const response = await generateResponse(characterPrompt)
      
      // Simulate typing delay
      setTimeout(() => {
        const characterMessage = {
          id: Date.now() + 1,
          sender: 'character',
          content: response,
          timestamp: new Date(),
          emotion: analyzeMessage(response)
        }
        
        setMessages(prev => [...prev, characterMessage])
        setCurrentEmotion(characterMessage.emotion)
        setIsTyping(false)
        
        // Update affection based on conversation
        updateAffection(userMessage.emotion, characterMessage.emotion)
      }, 1000 + Math.random() * 2000)
      
    } catch (error) {
      console.error('Error generating response:', error)
      setIsTyping(false)
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        sender: 'character',
        content: "*static* Sorry, there seems to be some interdimensional interference. Try again!",
        timestamp: new Date(),
        emotion: 'confused'
      }
      setMessages(prev => [...prev, fallbackMessage])
    }
  }

  const updateAffection = (userEmotion, characterEmotion) => {
    let change = 0
    
    // Positive interactions
    if ((userEmotion === 'happy' && characterEmotion === 'happy') ||
        (userEmotion === 'flirty' && characterEmotion === 'flirty')) {
      change = 5
    } else if (userEmotion === 'happy' || characterEmotion === 'happy') {
      change = 2
    }
    
    // Negative interactions
    if ((userEmotion === 'angry' && characterEmotion === 'angry') ||
        (userEmotion === 'sad' && characterEmotion === 'sad')) {
      change = -3
    }
    
    setAffectionLevel(prev => Math.max(0, Math.min(100, prev + change)))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const EmotionIcon = getEmotionIcon(currentEmotion)

  return (
    <motion.div 
      className="min-h-screen portal-gradient flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div 
        className="portal-card m-4 p-4 flex items-center justify-between"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="portal-button bg-gradient-to-r from-gray-700 to-gray-600 text-portal-text px-4 py-2"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="inline mr-2" size={18} />
          Back
        </motion.button>

        {/* Character Info */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <h2 className="text-xl font-bold portal-text">{character.name}</h2>
            <p className="portal-accent text-sm">{character.title}</p>
          </div>
          
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center portal-glow"
              style={{ backgroundColor: `${character.color}20` }}
            >
              <EmotionIcon 
                size={32} 
                style={{ color: getEmotionColor(currentEmotion) }}
                className="floating-portal"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-portal-green border-2 border-gray-900"></div>
          </div>
        </div>

        {/* Affection Meter */}
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <Heart size={16} className="text-portal-green" />
            <span className="portal-text text-sm font-semibold">{affectionLevel}%</span>
          </div>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-portal-green to-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${affectionLevel}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs portal-accent mt-1">Affection</p>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 mx-4 mb-4 portal-card p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
          <AnimatePresence>
            {messages.map((message) => {
              return (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      {message.sender === 'user' ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-portal-green to-green-600 flex items-center justify-center">
                          <User size={16} className="text-black" />
                        </div>
                      ) : (
                        <img 
                          src={getCharacterImage(character.id)} 
                          alt={character.name}
                          className="w-8 h-8 rounded-full object-cover border-2"
                          style={{ borderColor: getEmotionColor(message.emotion) }}
                        />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-portal-green to-green-600 text-black' 
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white'
                    } shadow-lg`}>
                      <p className="text-sm leading-relaxed">{formatMessage(message.content)}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-3 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-portal-green rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-portal-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-portal-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm portal-accent">{character.name} is typing...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-600">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            disabled={isTyping}
          />
          <motion.button
            className={`portal-button px-4 py-2 ${
              inputMessage.trim() && !isTyping 
                ? 'bg-gradient-to-r from-portal-green to-green-600 text-black' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            whileHover={inputMessage.trim() && !isTyping ? { scale: 1.05 } : {}}
            whileTap={inputMessage.trim() && !isTyping ? { scale: 0.95 } : {}}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>

      {/* Stats Footer */}
      <motion.div 
        className="mx-4 mb-4 portal-card p-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageCircle size={14} className="portal-accent" />
              <span className="portal-accent">Messages: {conversationCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Atom size={14} className="portal-accent" />
              <span className="portal-accent">Dimension: C-137</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="portal-accent">Mood:</span>
            <span 
              className="font-semibold capitalize"
              style={{ color: getEmotionColor(currentEmotion) }}
            >
              {currentEmotion}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameScreen