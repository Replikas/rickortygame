import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initializeDatabase,
  createUser,
  getUserByUsername,
  updateUserLogin,
  saveGameProgress,
  loadGameProgress,
  getAllUserProgress,
  saveChatMessage,
  getChatHistory,
  deleteChatHistory,
  saveCharacterMemory,
  getCharacterMemories,
  cleanupOldData
} from '../database/db.js';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize database on app start
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await initializeDatabase();
        setIsInitialized(true);
        
        // Check for saved user in localStorage
        const savedUsername = localStorage.getItem('rickmorty_username');
        if (savedUsername) {
          const user = await getUserByUsername(savedUsername);
          if (user) {
            setCurrentUser(user);
            await updateUserLogin(user.id);
          } else {
            localStorage.removeItem('rickmorty_username');
          }
        }
      } catch (error) {
        console.error('Database initialization failed:', error);
        setError('Failed to connect to database. Some features may not work.');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // User management
  const loginUser = async (username, email = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let user = await getUserByUsername(username);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await createUser(username, email);
      } else {
        // Update last login
        await updateUserLogin(user.id);
      }
      
      setCurrentUser(user);
      localStorage.setItem('rickmorty_username', username);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('rickmorty_username');
  };

  // Game progress management
  const saveProgress = async (character, progressData) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    try {
      const savedProgress = await saveGameProgress(currentUser.id, character, progressData);
      return savedProgress;
    } catch (error) {
      setError('Failed to save progress');
      throw error;
    }
  };

  const loadProgress = async (character) => {
    if (!currentUser) {
      return null;
    }
    
    try {
      const progress = await loadGameProgress(currentUser.id, character);
      return progress;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  };

  const getAllProgress = async () => {
    if (!currentUser) {
      return [];
    }
    
    try {
      const allProgress = await getAllUserProgress(currentUser.id);
      return allProgress;
    } catch (error) {
      console.error('Failed to load all progress:', error);
      return [];
    }
  };

  // Chat history management
  const saveChatToHistory = async (character, userInput, characterResponse, emotion) => {
    if (!currentUser) {
      return null;
    }
    
    try {
      const chatEntry = await saveChatMessage(
        currentUser.id,
        character,
        userInput,
        characterResponse,
        emotion
      );
      return chatEntry;
    } catch (error) {
      console.error('Failed to save chat:', error);
      return null;
    }
  };

  const loadChatHistory = async (character, limit = 50) => {
    if (!currentUser) {
      return [];
    }
    
    try {
      const history = await getChatHistory(currentUser.id, character, limit);
      return history;
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  };

  const clearChatHistory = async (character) => {
    if (!currentUser) {
      return;
    }
    
    try {
      await deleteChatHistory(currentUser.id, character);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      throw error;
    }
  };

  // Character memory management
  const saveMemory = async (character, memoryType, memoryContent, importanceScore = 1) => {
    if (!currentUser) {
      return null;
    }
    
    try {
      const memory = await saveCharacterMemory(
        currentUser.id,
        character,
        memoryType,
        memoryContent,
        importanceScore
      );
      return memory;
    } catch (error) {
      console.error('Failed to save memory:', error);
      return null;
    }
  };

  const loadMemories = async (character, limit = 20) => {
    if (!currentUser) {
      return [];
    }
    
    try {
      const memories = await getCharacterMemories(currentUser.id, character, limit);
      return memories;
    } catch (error) {
      console.error('Failed to load memories:', error);
      return [];
    }
  };

  // Auto-save functionality
  const autoSave = async (character, gameState) => {
    if (!currentUser || !character) {
      return;
    }

    try {
      const progressData = {
        affectionLevel: gameState.affectionLevel || 0,
        currentEmotion: gameState.currentEmotion || 'neutral',
        nsfwEnabled: gameState.nsfwEnabled || false,
        totalInteractions: gameState.totalInteractions || 0
      };

      await saveProgress(character, progressData);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Cleanup old data periodically
  useEffect(() => {
    if (!isInitialized) return;

    const cleanup = async () => {
      try {
        await cleanupOldData(30); // Keep 30 days of data
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    };

    // Run cleanup once per day
    const interval = setInterval(cleanup, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isInitialized]);

  const value = {
    // User state
    currentUser,
    isLoading,
    error,
    isInitialized,
    
    // User management
    loginUser,
    logoutUser,
    
    // Game progress
    saveProgress,
    loadProgress,
    getAllProgress,
    autoSave,
    
    // Chat history
    saveChatToHistory,
    loadChatHistory,
    clearChatHistory,
    
    // Character memories
    saveMemory,
    loadMemories,
    
    // Utility
    clearError: () => setError(null)
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;