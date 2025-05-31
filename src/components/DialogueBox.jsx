import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Loader } from 'lucide-react'

const DialogueBox = ({ character, dialogue, isTyping, color = 'primary' }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (!dialogue) {
      setDisplayedText('')
      return
    }

    setIsAnimating(true)
    setDisplayedText('')
    
    let currentIndex = 0
    const typewriterInterval = setInterval(() => {
      if (currentIndex < dialogue.length) {
        setDisplayedText(dialogue.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typewriterInterval)
        setIsAnimating(false)
      }
    }, 30) // Adjust speed here

    return () => clearInterval(typewriterInterval)
  }, [dialogue])

  // Parse dialogue for special formatting
  const parseDialogue = (text) => {
    if (!text) return []
    
    // Split by asterisks for action text
    const parts = text.split(/\*(.*?)\*/g)
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is action text (between asterisks)
        return {
          type: 'action',
          text: part,
          key: `action-${index}`
        }
      } else {
        // This is regular dialogue
        return {
          type: 'dialogue',
          text: part,
          key: `dialogue-${index}`
        }
      }
    }).filter(part => part.text.trim() !== '')
  }

  const parsedDialogue = parseDialogue(displayedText)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-dark rounded-2xl p-6 min-h-32 relative border border-white/10"
    >
      {/* Character name header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/20">
        <div className="p-2 rounded-lg bg-primary-500/20 border border-primary-400/30">
          <MessageCircle size={20} className="text-primary-400" />
        </div>
        <span className="font-bold text-xl text-white">{character}</span>
        {(isTyping || isAnimating) && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader size={16} className="text-neutral-400" />
          </motion.div>
        )}
      </div>

      {/* Dialogue content */}
      <div className="text-white leading-relaxed text-lg font-medium">
        <AnimatePresence>
          {isTyping && !dialogue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 text-gray-300 text-readable"
            >
              <span className="text-neutral-300">Thinking</span>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-primary-400"
              >
                ...
              </motion.span>
            </motion.div>
          )}
          
          {parsedDialogue.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {parsedDialogue.map((part) => {
                if (part.type === 'action') {
                  return (
                    <motion.span
                      key={part.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="italic text-neutral-300 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg mx-1 inline-block border border-white/20"
                    >
                      {part.text}
                    </motion.span>
                  )
                } else {
                  return (
                    <span key={part.key} className="text-white">
                      {part.text}
                    </span>
                  )
                }
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Typing cursor */}
      {isAnimating && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-5 bg-primary-400 ml-1 rounded-sm"
        />
      )}

      {/* Dialogue effects */}
      <div className="absolute -inset-1 rounded-2xl opacity-10 pointer-events-none">
        <motion.div
          className="w-full h-full rounded-2xl bg-gradient-to-r from-primary-500 to-transparent"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}

export default DialogueBox