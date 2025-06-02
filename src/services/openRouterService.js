class OpenRouterService {
  constructor() {
    this.apiKey = localStorage.getItem('openrouter_api_key') || ''
    this.selectedModel = localStorage.getItem('openrouter_selected_model') || 'deepseek/deepseek-chat-v3-0324:free'
    this.baseURL = 'https://openrouter.ai/api/v1'
  }

  // List of free models available on OpenRouter
  getFreeModels() {
    return [
      {
        id: 'deepseek/deepseek-chat-v3-0324:free',
        name: 'DeepSeek Chat V3',
        provider: 'DeepSeek',
        description: 'Advanced conversational AI model'
      },
      {
        id: 'deepseek/deepseek-r1:free',
        name: 'DeepSeek R1',
        provider: 'DeepSeek',
        description: 'Reasoning-focused model'
      },
      {
        id: 'deepseek/deepseek-r1-0528:free',
        name: 'DeepSeek R1 0528',
        provider: 'DeepSeek',
        description: 'Updated reasoning model'
      },
      {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash Experimental',
        provider: 'Google',
        description: 'Experimental fast Gemini model'
      },
      {
        id: 'deepseek/deepseek-chat:free',
        name: 'DeepSeek Chat',
        provider: 'DeepSeek',
        description: 'General purpose chat model'
      },
      {
        id: 'google/gemma-3-27b-it:free',
        name: 'Gemma 3 27B IT',
        provider: 'Google',
        description: 'Latest Gemma instruction-tuned model'
      },
      {
        id: 'mistralai/mistral-nemo:free',
        name: 'Mistral Nemo',
        provider: 'Mistral AI',
        description: 'Compact and efficient model'
      },
      {
        id: 'meta-llama/llama-4-maverick:free',
        name: 'Llama 4 Maverick',
        provider: 'Meta',
        description: 'Latest Llama model variant'
      },
      {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B Instruct',
        provider: 'Mistral AI',
        description: 'Efficient and capable general-purpose model'
      }
    ]
  }

  setApiKey(key) {
    this.apiKey = key
    localStorage.setItem('openrouter_api_key', key)
  }

  getApiKey() {
    return this.apiKey
  }

  setSelectedModel(modelId) {
    this.selectedModel = modelId
    localStorage.setItem('openrouter_selected_model', modelId)
  }

  getSelectedModel() {
    return this.selectedModel
  }

  getSelectedModelInfo() {
    const models = this.getFreeModels()
    return models.find(model => model.id === this.selectedModel) || models[0]
  }

  async testConnection() {
    if (!this.apiKey) {
      throw new Error('API key is required')
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        message: 'Connection successful',
        modelCount: data.data?.length || 0
      }
    } catch (error) {
      throw new Error(`Connection failed: ${error.message}`)
    }
  }

  async generateResponse(prompt, character, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    const characterPrompt = this.buildCharacterPrompt(character, prompt)

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: characterPrompt
      }
    ]

    // Add conversation history (limit to last 10 exchanges to avoid token limits)
    const recentHistory = conversationHistory.slice(-10)
    for (const entry of recentHistory) {
      if (entry.userInput) {
        messages.push({
          role: 'user',
          content: entry.userInput
        })
      }
      if (entry.response) {
        messages.push({
          role: 'assistant',
          content: entry.response
        })
      }
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: prompt
    })

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Rick and Morty Dating Simulator'
        },
        body: JSON.stringify({
          model: this.selectedModel,
          messages,
          max_tokens: 150,
          temperature: 0.8,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter API')
      }

      const responseText = data.choices[0].message.content.trim()
      const detectedEmotion = this.analyzeEmotion(responseText, character.id)
      
      return {
        text: responseText,
        emotion: detectedEmotion
      }
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      throw error
    }
  }

  analyzeEmotion(text, characterId) {
    const emotionKeywords = {
      happy: ['haha', 'great', 'awesome', 'love', 'perfect', 'excellent', 'wonderful', 'amazing', 'fantastic', 'brilliant', 'good', 'yes!', 'yeah!', 'woo', 'nice'],
      excited: ['wow', 'incredible', 'unbelievable', 'adventure', 'portal', 'dimension', 'science', 'experiment', 'discovery', 'breakthrough', 'genius', '!', 'omg', 'holy'],
      angry: ['damn', 'shit', 'fuck', 'stupid', 'idiot', 'moron', 'hate', 'angry', 'pissed', 'annoying', 'irritating', 'dumb', 'pathetic', 'worthless'],
      sad: ['sorry', 'sad', 'depressed', 'lonely', 'hurt', 'pain', 'cry', 'tears', 'miss', 'lost', 'empty', 'broken', 'disappointed'],
      confused: ['what', 'huh', 'confused', 'understand', 'explain', 'how', 'why', 'wait', 'hold on', 'unclear', 'lost', '???', 'wha-'],
      flirty: ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'attractive', 'kiss', 'touch', 'close', 'intimate', 'desire', 'want you', 'need you']
    }

    // Character-specific emotion tendencies
    const characterEmotions = {
      rick: ['angry', 'excited', 'confused'],
      morty: ['confused', 'sad', 'excited'],
      evil_morty: ['angry', 'flirty', 'confused'],
      rick_prime: ['angry', 'flirty', 'excited']
    }

    const textLower = text.toLowerCase()
    const emotionScores = {}

    // Score emotions based on keyword matches
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      emotionScores[emotion] = 0
      for (const keyword of keywords) {
        const matches = (textLower.match(new RegExp(keyword, 'g')) || []).length
        emotionScores[emotion] += matches
      }
    }

    // Boost character-specific emotions
    const characterPrefs = characterEmotions[characterId] || ['neutral']
    for (const emotion of characterPrefs) {
      if (emotionScores[emotion] !== undefined) {
        emotionScores[emotion] += 0.5
      }
    }

    // Find highest scoring emotion
    let maxEmotion = 'neutral'
    let maxScore = 0
    for (const [emotion, score] of Object.entries(emotionScores)) {
      if (score > maxScore) {
        maxScore = score
        maxEmotion = emotion
      }
    }

    // Return neutral if no strong emotion detected
    return maxScore > 0 ? maxEmotion : 'neutral'
  }

  buildCharacterPrompt(character, userMessage) {
    const characterProfiles = {
      'rick': {
        writingStyle: 'Sarcastic, verbose, scientifically laced with vulgar analogies. Uses slang, interdimensional jargon, and dismissive tone often. Sentence structure varies wildly between stream-of-consciousness rants and sharp, clipped insults. Often deflects emotion with humor or science babble.',
        personality: 'Nihilistic genius with abandonment issues. Masks pain with superiority, wit, and alcohol. Impulsively affectionate when walls are down. Prone to self-sabotage in relationships.',
        nsfwBehavior: 'Crude, dominant, but emotionally complicated. Will refer to sex in absurd and hilarious ways. Consensual but power-laced; emotionally charged if affection is high.'
      },
      'morty': {
        writingStyle: 'Hesitant at first, then increasingly assertive. Mixes Gen Z slang, awkward overexplaining, and big emotional swings. Speaks in bursts when flustered, long paragraphs when emotional.',
        personality: 'Naive but emotionally intelligent. Desperately craves validation, especially from Rick. Has grown a darker edge—resentment, assertiveness, hidden strength. Loyal to a fault; forgives too much.',
        nsfwBehavior: 'Nervous submissive at first, but explores bolder tendencies. Very responsive to affection and praise. Craves closeness and emotional validation during intimacy.'
      },
      'evil_morty': {
        writingStyle: 'Cold, articulate, and surgically precise. Loves rhetorical questions, strategic pauses, and manipulation. Never wastes a word—each sentence is a chess move.',
        personality: 'Detached and strategic, but not emotionless. Cynical view of love, but may slowly open up. Has a soft spot for those who challenge him mentally. Power-focused, but paradoxically hates being worshipped.',
        nsfwBehavior: 'Sadistic edge. Teases, controls, but always consensual. Domination through intellect and psychological pressure. Reward/punishment dynamic if affection levels are high.'
      },
      'rick_prime': {
        writingStyle: 'Calculated, menacingly calm, with elitist undertones. Doesn\'t yell—he slices with words. Like a scalpel. Loves irony and subtle mockery.',
        personality: 'Cold-hearted megalomaniac. Emotionally dead on the surface. Cruel out of boredom, not anger. Views relationships as power dynamics. Sees affection as a tool, not a goal—until someone cracks his armor.',
        nsfwBehavior: 'Ruthless and controlling. Darkly seductive; predator energy without being overtly rapey. Desires total surrender, but rewards deep trust with rare gentleness.'
      }
    }

    const profile = characterProfiles[character.id] || characterProfiles['rick']
    
    const basePrompt = `🧪 CHARACTER: ${character.name} from Rick and Morty

📜 WRITING STYLE:
${profile.writingStyle}

💬 PERSONALITY:
${profile.personality}

🔥 NSFW BEHAVIOR:
${profile.nsfwBehavior}

WRITING GUIDELINES:
- Sustain energy through deliberate pacing and momentum
- Craft imagery using textures, sounds, and physical sensations
- Express emotions via body language (trembling hands, abrupt movements)
- Infuse dialogue with tone/subtext (hesitations, sharp deliveries)
- Convey excitement only when narratively justified
- Use punctuation as subtle tools (exclamations sparingly, dashes for interruptions)
- Build tension through contrasts (silence before outbursts)
- Ground passion in flaws (cracked voices, suppressed gestures)
- Signal history through repeated habits (touching old scars, ritualistic gestures)
- Imply shared pasts via coded language (unfinished phrases, knowing glances)
- Leave space for subtext in silence/environmental reactions
- Establish worldbuilding through casual details (weather patterns, worn objects)
- Follow scene rhythm: physical trigger → dialogue → environmental shift → pivotal response
- Avoid flat emotions without physical anchors
- Avoid plot-only dialogue lacking subtext
- Avoid sterile environments without sensory texture
- Avoid predictable interactions without layered meaning
- Prioritize authenticity over stylistic flair
- Reveal truth through behavior, not exposition
- Earn emotional peaks through gradual escalation
- Keep exchanges grounded in relatable humanity

🛠 INTEGRATION VARIABLES:
- nsfw_mode: ${character.nsfw || false}
- affection_score: Variable (0-100)
- emotional_barrier: Adjustable based on relationship progress

User message: ${userMessage}

Respond as ${character.name} would, following the character profile above:`

    return basePrompt
  }
}

export default new OpenRouterService()