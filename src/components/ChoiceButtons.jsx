import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Heart, Zap, Flame } from 'lucide-react'

const ChoiceButtons = ({ choices, onChoice, disabled = false }) => {
  if (!choices || choices.length === 0) {
    return null
  }

  // Analyze choice content to determine icon and style
  const getChoiceStyle = (choice) => {
    const lowerChoice = choice.toLowerCase()
    
    // NSFW/Flirty choices
    if (lowerChoice.includes('hot') || lowerChoice.includes('sexy') || 
        lowerChoice.includes('experiment') || lowerChoice.includes('teach') ||
        lowerChoice.includes('hands') || lowerChoice.includes('bedroom')) {
      return {
        icon: Flame,
        gradient: 'from-danger-500 to-danger-600',
        hoverGradient: 'from-danger-600 to-danger-700',
        textColor: 'text-white',
        borderColor: 'border-danger-400',
        shadowColor: 'shadow-danger-500/20'
      }
    }
    
    // Romantic/Sweet choices
    if (lowerChoice.includes('cute') || lowerChoice.includes('sweet') ||
        lowerChoice.includes('pretty') || lowerChoice.includes('beautiful') ||
        lowerChoice.includes('love') || lowerChoice.includes('heart')) {
      return {
        icon: Heart,
        gradient: 'from-accent-500 to-accent-600',
        hoverGradient: 'from-accent-600 to-accent-700',
        textColor: 'text-white',
        borderColor: 'border-accent-400',
        shadowColor: 'shadow-accent-500/20'
      }
    }
    
    // Aggressive/Confrontational choices
    if (lowerChoice.includes('angry') || lowerChoice.includes('fight') ||
        lowerChoice.includes('stupid') || lowerChoice.includes('hate')) {
      return {
        icon: Zap,
        gradient: 'from-danger-600 to-danger-700',
        hoverGradient: 'from-danger-700 to-danger-800',
        textColor: 'text-white',
        borderColor: 'border-danger-500',
        shadowColor: 'shadow-danger-600/20'
      }
    }
    
    // Default/Neutral choices
    return {
      icon: MessageSquare,
      gradient: 'from-primary-500 to-primary-600',
      hoverGradient: 'from-primary-600 to-primary-700',
      textColor: 'text-white',
      borderColor: 'border-primary-400',
      shadowColor: 'shadow-primary-500/20'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 20
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <h4 className="text-lg text-white mb-6 font-semibold">Choose your response:</h4>
      
      {choices.map((choice, index) => {
        const style = getChoiceStyle(choice)
        const IconComponent = style.icon
        
        return (
          <motion.button
            key={index}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onChoice(choice)}
            disabled={disabled}
            className={`
              w-full p-4 rounded-xl text-left transition-all duration-300
              bg-gradient-to-r ${style.gradient}
              hover:bg-gradient-to-r hover:${style.hoverGradient}
              ${style.textColor} font-medium text-base
              border border-white/20
              shadow-lg ${style.shadowColor} backdrop-blur-sm
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:scale-100 disabled:hover:y-0
              relative overflow-hidden
              group hover:shadow-xl
            `}
          >
            {/* Background glow effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-r ${style.gradient} opacity-0 
              group-hover:opacity-20 transition-opacity duration-300
            `} />
            
            {/* Content */}
            <div className="relative flex items-center space-x-4">
              <IconComponent 
                size={22} 
                className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" 
              />
              <span className="flex-1 leading-relaxed">
                {choice}
              </span>
            </div>
            
            {/* Hover indicator */}
            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          </motion.button>
        )
      })}
      
      {/* Choice count indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-neutral-500 mt-6 font-medium"
      >
        {choices.length} option{choices.length !== 1 ? 's' : ''} available
      </motion.div>
    </motion.div>
  )
}

export default ChoiceButtons