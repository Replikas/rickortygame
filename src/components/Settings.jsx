import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Volume2, VolumeX, Monitor, Moon, Sun, Zap, Brain, Heart, Key, Settings as SettingsIcon, Check } from 'lucide-react'

import { useAudio } from '../context/AudioContext'
import { useSettings } from '../context/SettingsContext'
import OpenRouterSettings from './OpenRouterSettings'

function Settings({ onBack }) {
  const { settings, updateSetting, resetSettings } = useSettings()
  const [showSavedMessage, setShowSavedMessage] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  }

  const handleSettingChange = (key, value) => {
    updateSetting(key, value)
    setShowSavedMessage(true)
  }

  const handleResetSettings = () => {
    resetSettings()
    setShowSavedMessage(true)
  }

  useEffect(() => {
    if (showSavedMessage) {
      const timer = setTimeout(() => {
        setShowSavedMessage(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSavedMessage])

  return (
    <motion.div 
      className="min-h-screen portal-gradient portal-orbs p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="max-w-4xl mx-auto mb-8"
        variants={cardVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            className="portal-button bg-gradient-to-r from-gray-700 to-gray-600 text-portal-text px-6 py-3"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="inline mr-2" size={20} />
            Back to Menu
          </motion.button>
          
          <div className="text-center relative">
            <h1 className="text-4xl font-bold portal-shadow-lg mb-2">
              <span className="rick-green">Portal</span>
              <span className="text-gray-400"> </span>
              <span className="morty-yellow">Settings</span>
            </h1>
            <p className="portal-accent text-lg">Configure your interdimensional experience</p>
            
            {/* Saved Message */}
            {showSavedMessage && (
              <motion.div
                className="absolute top-0 right-0 bg-portal-green text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Check size={16} />
                <span className="font-semibold">Saved!</span>
              </motion.div>
            )}
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>
      </motion.div>

      {/* AI Provider Settings */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <OpenRouterSettings />
      </motion.div>

      {/* Settings Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Audio Settings */}
        <motion.div className="portal-card p-6" variants={cardVariants}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="portal-glow w-12 h-12 rounded-full bg-gradient-to-br from-green-900 to-gray-900 flex items-center justify-center">
              <Volume2 size={24} className="portal-text" />
            </div>
            <h3 className="text-xl font-bold portal-text">Audio Settings</h3>
          </div>
          
          <div className="space-y-4">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="portal-accent">Sound Effects</span>
              <motion.button
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  !settings.muteAll ? 'bg-portal-green' : 'bg-gray-600'
                }`}
                onClick={() => handleSettingChange('muteAll', !settings.muteAll)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: !settings.muteAll ? 24 : 2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
            
            {/* Music Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="portal-accent">Music Volume</span>
                <span className="text-portal-green font-semibold">{Math.round((settings.musicVolume || 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((settings.musicVolume || 0) * 100)}
                onChange={(e) => handleSettingChange('musicVolume', parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            {/* SFX Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="portal-accent">SFX Volume</span>
                <span className="text-portal-green font-semibold">{Math.round((settings.sfxVolume || 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((settings.sfxVolume || 0) * 100)}
                onChange={(e) => handleSettingChange('sfxVolume', parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </motion.div>

        {/* Display Settings */}
        <motion.div className="portal-card p-6" variants={cardVariants}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="portal-glow w-12 h-12 rounded-full bg-gradient-to-br from-yellow-900 to-gray-900 flex items-center justify-center">
              <Monitor size={24} className="morty-yellow" />
            </div>
            <h3 className="text-xl font-bold portal-text">Display Settings</h3>
          </div>
          
          <div className="space-y-4">
            {/* Theme Selection */}
            <div className="space-y-2">
              <span className="portal-accent">Theme</span>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    settings.theme === 'dark' 
                      ? 'border-portal-green bg-portal-green/20' 
                      : 'border-gray-600 bg-gray-700'
                  }`}
                  onClick={() => handleSettingChange('theme', 'dark')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Moon size={20} className="mx-auto mb-1 portal-text" />
                  <span className="text-sm portal-accent">Dark</span>
                </motion.button>
                <motion.button
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    settings.theme === 'light' 
                      ? 'border-portal-green bg-portal-green/20' 
                      : 'border-gray-600 bg-gray-700'
                  }`}
                  onClick={() => handleSettingChange('theme', 'light')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sun size={20} className="mx-auto mb-1 portal-text" />
                  <span className="text-sm portal-accent">Light</span>
                </motion.button>
              </div>
            </div>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <span className="portal-accent">Reduced Motion</span>
              <motion.button
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.reducedMotion ? 'bg-portal-green' : 'bg-gray-600'
                }`}
                onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: settings.reducedMotion ? 24 : 2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
            
            {/* Show Subtitles */}
            <div className="flex items-center justify-between">
              <span className="portal-accent">Show Subtitles</span>
              <motion.button
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.showSubtitles ? 'bg-portal-green' : 'bg-gray-600'
                }`}
                onClick={() => handleSettingChange('showSubtitles', !settings.showSubtitles)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: settings.showSubtitles ? 24 : 2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Gameplay Settings */}
        <motion.div className="portal-card p-6" variants={cardVariants}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="portal-glow w-12 h-12 rounded-full bg-gradient-to-br from-pink-900 to-gray-900 flex items-center justify-center">
              <Brain size={24} className="text-pink-400" />
            </div>
            <h3 className="text-xl font-bold portal-text">Gameplay Settings</h3>
          </div>
          
          <div className="space-y-4">
            {/* Auto Advance */}
            <div className="flex items-center justify-between">
              <span className="portal-accent">Auto Advance</span>
              <motion.button
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.autoAdvance ? 'bg-portal-green' : 'bg-gray-600'
                }`}
                onClick={() => handleSettingChange('autoAdvance', !settings.autoAdvance)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: settings.autoAdvance ? 24 : 2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
            
            {/* Animation Speed */}
            <div className="space-y-2">
              <span className="portal-accent">Animation Speed</span>
              <div className="grid grid-cols-4 gap-2">
                {['slow', 'normal', 'fast', 'off'].map((speed) => (
                  <motion.button
                    key={speed}
                    className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                      settings.animationSpeed === speed 
                        ? 'border-portal-green bg-portal-green/20' 
                        : 'border-gray-600 bg-gray-700'
                    }`}
                    onClick={() => handleSettingChange('animationSpeed', speed)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm portal-accent capitalize">{speed}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <span className="portal-accent">Auto Save</span>
              <motion.button
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.autoSave ? 'bg-portal-green' : 'bg-gray-600'
                }`}
                onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: settings.autoSave ? 24 : 2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content Settings */}
        <motion.div className="portal-card p-6" variants={cardVariants}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="portal-glow w-12 h-12 rounded-full bg-gradient-to-br from-red-900 to-gray-900 flex items-center justify-center">
              <Heart size={24} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold portal-text">Content Settings</h3>
          </div>
          
          <div className="space-y-4">
            {/* NSFW Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="portal-accent">Mature Content</span>
                <motion.button
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.nsfwContent ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                  onClick={() => handleSettingChange('nsfwContent', !settings.nsfwContent)}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                    animate={{ x: settings.nsfwContent ? 24 : 2 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Enable mature content and themes. Must be 18+ to enable this option.
              </p>
            </div>
            
            {/* Warning */}
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">Content Warning</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                This game contains references to alcohol, violence, and mature themes from the Rick and Morty universe.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Placeholder for future settings */}
        <motion.div 
          className="portal-card p-6"
          variants={cardVariants}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="portal-glow w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
              <SettingsIcon size={24} className="portal-text" />
            </div>
            <h3 className="text-xl font-bold portal-text">Additional Settings</h3>
          </div>
          <p className="portal-text opacity-70">More settings coming soon...</p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="max-w-4xl mx-auto mt-8 flex justify-center space-x-4"
        variants={cardVariants}
      >
        <motion.button
          className="portal-button bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3"
          onClick={handleResetSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SettingsIcon className="inline mr-2" size={18} />
          Reset to Defaults
        </motion.button>
        
        <motion.button
          className="portal-button px-6 py-3"
          onClick={() => {
            // Save settings logic here
            alert('Settings saved successfully!')
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="inline mr-2" size={18} />
          Save Settings
        </motion.button>
      </motion.div>

      {/* Info Footer */}
      <motion.div 
        className="max-w-4xl mx-auto mt-8 text-center"
        variants={cardVariants}
      >
        <div className="portal-card p-4">
          <p className="portal-accent text-sm mb-2">
            "Settings are like science, Morty - they're meant to be experimented with!"
          </p>
          <p className="text-xs text-gray-400">
            Changes are automatically saved to your browser's local storage.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Settings