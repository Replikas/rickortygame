import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { useGemini } from '../context/GeminiContext'
import { 
  ArrowLeft, 
  Settings, 
  User, 
  MessageSquare, 
  Database, 
  Download, 
  Trash2, 
  Edit3, 
  Plus,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react'

const AdminPanel = () => {
  const navigate = useNavigate()
  const { gameState, logWebhook } = useGame()
  const { characterPrompts } = useGemini()
  
  const [activeTab, setActiveTab] = useState('characters')
  const [editingCharacter, setEditingCharacter] = useState(null)
  const [editingPrompt, setEditingPrompt] = useState('')
  const [showWebhookDetails, setShowWebhookDetails] = useState({})

  const tabs = [
    { id: 'characters', label: 'Characters', icon: User },
    { id: 'prompts', label: 'System Prompts', icon: MessageSquare },
    { id: 'webhooks', label: 'Webhook Logs', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: Settings }
  ]

  // Character management
  const handleEditCharacter = (characterId) => {
    setEditingCharacter(characterId)
    setEditingPrompt(characterPrompts[characterId]?.base || '')
  }

  const handleSaveCharacter = () => {
    // In a real app, this would save to a backend
    console.log('Saving character prompt:', editingCharacter, editingPrompt)
    setEditingCharacter(null)
    setEditingPrompt('')
  }

  // Webhook log management
  const exportWebhookLogs = () => {
    const dataStr = JSON.stringify(gameState.webhookLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `webhook-logs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearWebhookLogs = () => {
    // Clear logs (in real app, would update backend)
    console.log('Clearing webhook logs')
  }

  const toggleWebhookDetails = (logId) => {
    setShowWebhookDetails(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }))
  }

  // Analytics calculations
  const getAnalytics = () => {
    const logs = gameState.webhookLogs || []
    const conversations = gameState.conversationHistory || []
    
    return {
      totalInteractions: logs.length,
      uniqueCharacters: [...new Set(logs.map(log => log.character))].length,
      averageResponseLength: conversations.length > 0 
        ? Math.round(conversations.reduce((sum, conv) => sum + (conv.response?.length || 0), 0) / conversations.length)
        : 0,
      nsfwInteractions: logs.filter(log => log.nsfwEnabled).length,
      emotionDistribution: logs.reduce((acc, log) => {
        acc[log.emotionTag] = (acc[log.emotionTag] || 0) + 1
        return acc
      }, {})
    }
  }

  const analytics = getAnalytics()

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button
          onClick={() => navigate('/character-select')}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Game</span>
        </button>
        
        <h1 className="text-3xl font-bold neon-text">Admin Panel</h1>
        
        <button
          onClick={() => navigate('/settings')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <Settings size={20} />
        </button>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1"
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-rick-green text-black font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <IconComponent size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Characters Tab */}
          {activeTab === 'characters' && (
            <div className="space-y-6">
              <div className="admin-panel">
                <h2 className="text-xl font-bold text-white mb-4">Character Management</h2>
                
                <div className="grid gap-4">
                  {Object.entries(characterPrompts).map(([characterId, prompts]) => (
                    <div key={characterId} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white capitalize">{characterId}</h3>
                        <button
                          onClick={() => handleEditCharacter(characterId)}
                          className="choice-button px-3 py-1 text-sm flex items-center space-x-1"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Base Prompt:</span>
                          <p className="text-gray-200 bg-gray-800 rounded p-2 mt-1 line-clamp-3">
                            {prompts.base.substring(0, 150)}...
                          </p>
                        </div>
                        
                        {prompts.nsfw && (
                          <div>
                            <span className="text-gray-400">NSFW Prompt:</span>
                            <p className="text-gray-200 bg-gray-800 rounded p-2 mt-1 line-clamp-2">
                              {prompts.nsfw.substring(0, 100)}...
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <span className="text-gray-400">Emotions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.keys(prompts.emotions).map(emotion => (
                              <span key={emotion} className="px-2 py-1 bg-gray-600 rounded text-xs">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Character Editor Modal */}
              <AnimatePresence>
                {editingCharacter && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white capitalize">
                          Edit {editingCharacter} Prompt
                        </h3>
                        <button
                          onClick={() => setEditingCharacter(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <textarea
                        value={editingPrompt}
                        onChange={(e) => setEditingPrompt(e.target.value)}
                        className="w-full h-48 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none focus:border-rick-green focus:outline-none"
                        placeholder="Enter character system prompt..."
                      />
                      
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => setEditingCharacter(null)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCharacter}
                          className="flex-1 choice-button flex items-center justify-center space-x-2"
                        >
                          <Save size={16} />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Webhook Logs Tab */}
          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <div className="admin-panel">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Webhook Logs</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={exportWebhookLogs}
                      className="choice-button px-3 py-1 text-sm flex items-center space-x-1"
                    >
                      <Download size={14} />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={clearWebhookLogs}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Trash2 size={14} />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {gameState.webhookLogs?.length > 0 ? (
                    gameState.webhookLogs.slice().reverse().map((log) => (
                      <div key={log.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-medium">{log.character}</span>
                            <span className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                              {log.emotionTag}
                            </span>
                            {log.nsfwEnabled && (
                              <span className="px-2 py-1 bg-red-600 rounded text-xs text-white">
                                NSFW
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                            <button
                              onClick={() => toggleWebhookDetails(log.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              {showWebhookDetails[log.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-300 mb-2">
                          <strong>User:</strong> {log.choice}
                        </div>
                        
                        <AnimatePresence>
                          {showWebhookDetails[log.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 text-sm"
                            >
                              <div>
                                <strong className="text-gray-400">AI Response:</strong>
                                <p className="text-gray-200 bg-gray-800 rounded p-2 mt-1">
                                  {log.llmResponse}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong className="text-gray-400">Sprite Change:</strong>
                                  <p className="text-gray-300">{log.spriteChange}</p>
                                </div>
                                <div>
                                  <strong className="text-gray-400">Affection Change:</strong>
                                  <p className={`font-bold ${
                                    log.affectionChange > 0 ? 'text-green-400' : 
                                    log.affectionChange < 0 ? 'text-red-400' : 'text-gray-400'
                                  }`}>
                                    {log.affectionChange > 0 ? '+' : ''}{log.affectionChange}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No webhook logs available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="admin-panel">
                <h2 className="text-xl font-bold text-white mb-4">Game Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-rick-green">{analytics.totalInteractions}</div>
                    <div className="text-gray-400 text-sm">Total Interactions</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-portal-blue">{analytics.uniqueCharacters}</div>
                    <div className="text-gray-400 text-sm">Characters Interacted</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-morty-yellow">{analytics.averageResponseLength}</div>
                    <div className="text-gray-400 text-sm">Avg Response Length</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-neon-pink">{analytics.nsfwInteractions}</div>
                    <div className="text-gray-400 text-sm">NSFW Interactions</div>
                  </div>
                </div>
                
                {/* Emotion Distribution */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-3">Emotion Distribution</h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.emotionDistribution).map(([emotion, count]) => (
                      <div key={emotion} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{emotion}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-rick-green h-2 rounded-full"
                              style={{ width: `${(count / analytics.totalInteractions) * 100}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AdminPanel