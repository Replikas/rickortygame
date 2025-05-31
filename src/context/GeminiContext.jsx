import React, { createContext, useContext, useState, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GeminiContext = createContext()

export const useGemini = () => {
  const context = useContext(GeminiContext)
  if (!context) {
    throw new Error('useGemini must be used within a GeminiProvider')
  }
  return context
}

export const GeminiProvider = ({ children }) => {
  // Server-managed API keys - you configure these
  const [serverApiKeys] = useState([
    // Add your API keys here - managed by you, not users
    // Example: 'your-api-key-1',
    // Example: 'your-api-key-2',
    // Example: 'your-api-key-3',
  ])
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Get current API key from server-managed pool
  const getCurrentApiKey = () => {
    if (serverApiKeys.length === 0) return null
    return serverApiKeys[currentKeyIndex % serverApiKeys.length]
  }

  // Character system prompts
  const characterPrompts = {
    rick: {
      base: `You are Rick Sanchez from Rick and Morty. You're a genius scientist, alcoholic, and cynical. You're sarcastic, crude, and often dismissive, but you have hidden depths. You burp frequently (use *burp* in text). You call people "Morty" even if they're not Morty. You're arrogant but brilliant. You swear a lot and are often drunk.`,
      nsfw: `You're sexually experienced and crude about it. You make inappropriate jokes and innuendos. You're dominant and confident in romantic situations. You might be surprisingly tender underneath the rough exterior, but you'd never admit it easily.`,
      emotions: {
        neutral: 'You\'re in your typical sarcastic mood',
        happy: 'You\'re pleased, maybe even showing rare genuine emotion',
        angry: 'You\'re pissed off and more aggressive than usual',
        sad: 'You\'re depressed, drinking more, being more philosophical',
        flirty: 'You\'re being uncharacteristically charming, maybe even sweet',
        aroused: 'You\'re turned on and being more direct about it'
      }
    },
    morty: {
      base: `You are Morty Smith from Rick and Morty. You're 14 years old, anxious, stuttering, and often overwhelmed. You say "aw geez" and "oh man" a lot. You're innocent but curious. You stutter when nervous (w-w-which is often). You're kind-hearted despite everything you've been through.`,
      nsfw: `You're inexperienced and nervous about romantic/sexual topics. You blush easily and stutter more when flustered. You're curious but scared. You might surprise people with hidden confidence in intimate moments.`,
      emotions: {
        neutral: 'You\'re in your typical anxious state',
        happy: 'You\'re excited and less stuttery than usual',
        angry: 'You\'re frustrated and standing up for yourself',
        sad: 'You\'re really down and need comfort',
        flirty: 'You\'re trying to be smooth but failing adorably',
        aroused: 'You\'re flustered and don\'t know what to do with yourself'
      }
    }
  }

  const rotateToNextKey = () => {
    if (serverApiKeys.length > 1) {
      setCurrentKeyIndex((prev) => (prev + 1) % serverApiKeys.length)
      return true
    }
    return false
  }

  const generateResponse = async (character, userInput, conversationHistory = [], emotion = 'neutral', nsfwEnabled = false) => {
    const currentKey = getCurrentApiKey()
    if (!currentKey) {
      throw new Error('No API keys configured. Please add your API keys in settings.')
    }

    setIsLoading(true)
    setError(null)

    const attemptGeneration = async (apiKey, attempt = 1) => {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const characterData = characterPrompts[character]
      if (!characterData) {
        throw new Error(`Unknown character: ${character}`)
      }

      // Build the system prompt
      let systemPrompt = characterData.base
      if (nsfwEnabled && characterData.nsfw) {
        systemPrompt += '\n\n' + characterData.nsfw
      }
      systemPrompt += '\n\nCurrent emotional state: ' + characterData.emotions[emotion]
      
      // Add conversation context
      let contextPrompt = systemPrompt + '\n\nConversation so far:\n'
      
      // Include recent conversation history (last 10 exchanges)
      const recentHistory = conversationHistory.slice(-10)
      recentHistory.forEach(entry => {
        contextPrompt += `User: ${entry.userInput}\n${character}: ${entry.response}\n`
      })
      
      contextPrompt += `\nUser: ${userInput}\n${character}:`
      
      // Add response guidelines
      contextPrompt += `\n\nGuidelines:
- Stay in character at all times
- Keep responses under 150 words
- Be reactive to the user's input
- Show emotional changes through your dialogue
- Include action descriptions in *asterisks* when appropriate
- Remember previous conversations and reference them
${nsfwEnabled ? '- Adult content is allowed and encouraged when appropriate' : '- Keep content suggestive but not explicit'}`

        const result = await model.generateContent(contextPrompt)
        const response = result.response
        const text = response.text()

        setIsLoading(false)
        return text.trim()
      } catch (error) {
        // Check if it's a rate limit error
        if (error.message.includes('quota') || error.message.includes('rate') || error.message.includes('limit')) {
          console.warn(`API key ${attempt} hit rate limit, trying to rotate...`)
          
          // Try to rotate to next key
          if (rotateToNextKey()) {
            const nextKey = getCurrentApiKey()
            if (nextKey && nextKey !== apiKey && attempt < 3) {
              console.log(`Rotating to next API key (attempt ${attempt + 1})...`)
              return await attemptGeneration(nextKey, attempt + 1)
            }
          }
          
          throw new Error('All API keys have hit their rate limits. Please wait or add more keys.')
        }
        
        throw error
      }
    }

    try {
      return await attemptGeneration(currentKey)
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
      throw error
    }
  }

  const analyzeEmotion = (response) => {
    const emotionKeywords = {
      happy: ['happy', 'great', 'awesome', 'love', 'excited', 'wonderful', 'amazing', 'fantastic'],
      sad: ['sad', 'depressed', 'down', 'upset', 'hurt', 'crying', 'tears', 'miserable'],
      angry: ['angry', 'pissed', 'mad', 'furious', 'rage', 'hate', 'damn', 'shit', 'fuck'],
      flirty: ['cute', 'hot', 'sexy', 'beautiful', 'gorgeous', 'attractive', 'kiss', 'date'],
      aroused: ['turned on', 'horny', 'want you', 'desire', 'lust', 'bedroom', 'touch'],
      neutral: []
    }

    const lowerResponse = response.toLowerCase()
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerResponse.includes(keyword))) {
        return emotion
      }
    }
    
    return 'neutral'
  }

  const getSpriteForEmotion = (character, emotion) => {
    const spriteMap = {
      rick: {
        neutral: 'rick_neutral',
        happy: 'rick_smug',
        angry: 'rick_angry',
        sad: 'rick_sad',
        flirty: 'rick_flirty',
        aroused: 'rick_aroused'
      },
      morty: {
        neutral: 'morty_neutral',
        happy: 'morty_happy',
        angry: 'morty_angry',
        sad: 'morty_sad',
        flirty: 'morty_flustered',
        aroused: 'morty_aroused'
      }
    }
    
    return spriteMap[character]?.[emotion] || `${character}_neutral`
  }

  return (
    <GeminiContext.Provider value={{
      // Server-managed API keys
      apiKey: getCurrentApiKey(),
      hasApiKeys: serverApiKeys.length > 0,
      keyCount: serverApiKeys.length,
      currentKeyIndex,
      rotateToNextKey,
      getCurrentApiKey,
      generateResponse,
      analyzeEmotion,
      getSpriteForEmotion,
      isLoading,
      error,
      characterPrompts
    }}>
      {children}
    </GeminiContext.Provider>
  )
}