import React, { createContext, useContext, useState, useEffect } from 'react'
import openRouterService from '../services/openRouterService'

const OpenRouterContext = createContext()

export const useOpenRouter = () => {
  const context = useContext(OpenRouterContext)
  if (!context) {
    throw new Error('useOpenRouter must be used within an OpenRouterProvider')
  }
  return context
}

export const OpenRouterProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('Not connected')
  const [availableModels, setAvailableModels] = useState([])

  useEffect(() => {
    // Load saved settings
    const savedApiKey = openRouterService.getApiKey()
    const savedModel = openRouterService.getSelectedModel()
    const freeModels = openRouterService.getFreeModels()
    
    setApiKey(savedApiKey)
    setSelectedModel(savedModel)
    setAvailableModels(freeModels)
    
    // Test connection if API key exists
    if (savedApiKey) {
      testConnection(savedApiKey)
    }
  }, [])

  const updateApiKey = (key) => {
    setApiKey(key)
    openRouterService.setApiKey(key)
    if (key) {
      testConnection(key)
    } else {
      setIsConnected(false)
      setConnectionStatus('Not connected')
    }
  }

  const updateSelectedModel = (modelId) => {
    setSelectedModel(modelId)
    openRouterService.setSelectedModel(modelId)
  }

  const testConnection = async (keyToTest = apiKey) => {
    if (!keyToTest) {
      setConnectionStatus('API key required')
      setIsConnected(false)
      return false
    }

    setIsLoading(true)
    setConnectionStatus('Testing connection...')
    
    try {
      const result = await openRouterService.testConnection()
      setIsConnected(true)
      setConnectionStatus(`Connected - ${result.modelCount} models available`)
      return true
    } catch (error) {
      setIsConnected(false)
      setConnectionStatus(`Connection failed: ${error.message}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = async (prompt, character, conversationHistory = []) => {
    if (!isConnected) {
      throw new Error('OpenRouter not connected. Please configure your API key.')
    }
    
    return await openRouterService.generateResponse(prompt, character, conversationHistory)
  }

  const getSelectedModelInfo = () => {
    return openRouterService.getSelectedModelInfo()
  }

  const value = {
    apiKey,
    selectedModel,
    isConnected,
    isLoading,
    connectionStatus,
    availableModels,
    updateApiKey,
    updateSelectedModel,
    testConnection,
    generateResponse,
    getSelectedModelInfo
  }

  return (
    <OpenRouterContext.Provider value={value}>
      {children}
    </OpenRouterContext.Provider>
  )
}