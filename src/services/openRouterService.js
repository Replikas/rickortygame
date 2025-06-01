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

      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      throw error
    }
  }

  buildCharacterPrompt(character, userMessage) {
    const basePrompt = `You are ${character.name} from Rick and Morty. Respond as this character would, maintaining their personality, speech patterns, and mannerisms. Keep responses concise (1-2 sentences max) and in character.

Character: ${character.name}
Personality: ${character.personality}
Background: ${character.background}

User message: ${userMessage}

Respond as ${character.name} would:`

    return basePrompt
  }
}

export default new OpenRouterService()