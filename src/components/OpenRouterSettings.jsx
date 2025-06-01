import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Zap, ExternalLink, CheckCircle, XCircle, Loader, Info } from 'lucide-react'
import { useOpenRouter } from '../context/OpenRouterContext'

function OpenRouterSettings() {
  const {
    apiKey,
    selectedModel,
    isConnected,
    isLoading,
    connectionStatus,
    availableModels,
    updateApiKey,
    updateSelectedModel,
    testConnection,
    getSelectedModelInfo
  } = useOpenRouter()

  const [showApiKey, setShowApiKey] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(apiKey)

  const handleApiKeySubmit = () => {
    updateApiKey(tempApiKey)
  }

  const handleTestConnection = () => {
    testConnection()
  }

  const selectedModelInfo = getSelectedModelInfo()

  const getStatusIcon = () => {
    if (isLoading) return <Loader className="animate-spin" size={20} />
    if (isConnected) return <CheckCircle className="text-green-400" size={20} />
    return <XCircle className="text-red-400" size={20} />
  }

  const getStatusColor = () => {
    if (isLoading) return 'text-yellow-400'
    if (isConnected) return 'text-green-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Zap className="mr-2" size={24} />
        OpenRouter AI Settings
      </h3>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium flex items-center">
            {getStatusIcon()}
            <span className="ml-2">Connection Status</span>
          </h4>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <p className={`text-sm ${getStatusColor()}`}>
          {connectionStatus}
        </p>
        {isConnected && selectedModelInfo && (
          <div className="mt-2 text-sm text-gray-300">
            <p><strong>Current Model:</strong> {selectedModelInfo.name}</p>
            <p><strong>Provider:</strong> {selectedModelInfo.provider}</p>
          </div>
        )}
      </div>

      {/* API Key Configuration */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">
          <Key className="inline mr-2" size={16} />
          OpenRouter API Key
        </label>
        <div className="flex space-x-2">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="Enter your OpenRouter API key"
            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={handleApiKeySubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Test Connection */}
      <div className="mb-6">
        <button
          onClick={handleTestConnection}
          disabled={!tempApiKey || isLoading}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Testing Connection...
            </>
          ) : (
            'Test Connection'
          )}
        </button>
      </div>

      {/* Model Selection */}
      {isConnected && (
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Select AI Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => updateSelectedModel(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.provider}
              </option>
            ))}
          </select>
          {selectedModelInfo && (
            <p className="text-sm text-gray-400 mt-1">
              {selectedModelInfo.description}
            </p>
          )}
        </div>
      )}

      {/* API Key Instructions */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h4 className="text-blue-300 font-medium mb-2 flex items-center">
          <Info className="mr-2" size={16} />
          How to get your OpenRouter API Key
        </h4>
        <div className="text-sm text-blue-200 space-y-2">
          <p>1. Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center">OpenRouter.ai <ExternalLink size={12} className="ml-1" /></a></p>
          <p>2. Sign up for a free account</p>
          <p>3. Go to the API Keys section in your dashboard</p>
          <p>4. Create a new API key and copy it here</p>
          <p className="text-yellow-300">💡 <strong>Free tier includes:</strong> {availableModels.length} free AI models with generous usage limits</p>
        </div>
      </div>
    </div>
  )
}

export default OpenRouterSettings