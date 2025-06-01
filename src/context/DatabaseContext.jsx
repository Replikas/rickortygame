import React, { createContext, useContext, useState, useEffect } from 'react';

// API base URL - will use server endpoints instead of direct database access
const API_BASE = window.location.origin;

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
        // Initialize database through API
        await fetch(`${API_BASE}/api/init`, { method: 'POST' });
        setIsInitialized(true);
        
        // Check for saved user in localStorage
        const savedUsername = localStorage.getItem('rickmorty_username');
        if (savedUsername) {
          const response = await fetch(`${API_BASE}/api/users/${savedUsername}`);
          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
            await fetch(`${API_BASE}/api/users/${user.id}/login`, { method: 'POST' });
          } else {
            localStorage.removeItem('rickmorty_username');
          }
        }
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError('Failed to initialize database');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (username) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get existing user
      let response = await fetch(`${API_BASE}/api/users/${username}`);
      let user;
      
      if (!response.ok) {
        // Create new user if doesn't exist
        response = await fetch(`${API_BASE}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
      }
      
      if (response.ok) {
        user = await response.json();
        await fetch(`${API_BASE}/api/users/${user.id}/login`, { method: 'POST' });
        setCurrentUser(user);
        localStorage.setItem('rickmorty_username', username);
        return { success: true, user };
      }
      
      return { success: false, error: 'Failed to create or retrieve user' };
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rickmorty_username');
  };

  const saveProgress = async (character, progress) => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          character,
          progress
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (err) {
      console.error('Failed to save progress:', err);
      setError('Failed to save progress');
    }
  };

  const loadProgress = async (character) => {
    if (!currentUser) return null;
    
    try {
      const response = await fetch(`${API_BASE}/api/progress/${currentUser.id}/${character}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (err) {
      console.error('Failed to load progress:', err);
      return null;
    }
  };

  const getAllProgress = async () => {
    if (!currentUser) return [];
    
    try {
      const response = await fetch(`${API_BASE}/api/progress/${currentUser.id}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (err) {
      console.error('Failed to load all progress:', err);
      return [];
    }
  };

  const saveChatToHistory = async (character, message, isUser = false) => {
    if (!currentUser) return;
    
    // Always use localStorage as fallback when database is disabled
    const useLocalStorage = () => {
      const storageKey = `chat_${currentUser.id}_${character}`;
      const existingHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Find if there's a recent entry to pair with (within last 5 minutes)
      const lastEntry = existingHistory[existingHistory.length - 1];
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const canPair = lastEntry && 
        new Date(lastEntry.timestamp) > fiveMinutesAgo &&
        ((isUser && !lastEntry.user_input && lastEntry.character_response) || 
         (!isUser && !lastEntry.character_response && lastEntry.user_input));
      
      if (canPair) {
        // Update the last entry
        if (isUser) {
          lastEntry.user_input = message;
        } else {
          lastEntry.character_response = message;
        }
      } else {
        // Add new entry
        const newEntry = {
          user_input: isUser ? message : null,
          character_response: !isUser ? message : null,
          timestamp: new Date().toISOString(),
          emotion: 'neutral'
        };
        existingHistory.push(newEntry);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingHistory));
    };
    
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          character,
          message,
          isUser
        })
      });
      
      // If database call fails, use localStorage
      if (!response.ok) {
        useLocalStorage();
      }
    } catch (err) {
      console.error('Failed to save chat message:', err);
      // Use localStorage on any error
      useLocalStorage();
    }
  };

  const loadChatHistory = async (character) => {
    if (!currentUser) return [];
    
    try {
      const response = await fetch(`${API_BASE}/api/chat/${currentUser.id}/${character}`);
      if (response.ok) {
        return await response.json();
      }
      
      // If database is disabled, use localStorage as fallback
      const storageKey = `chat_${currentUser.id}_${character}`;
      const localHistory = localStorage.getItem(storageKey);
      return localHistory ? JSON.parse(localHistory) : [];
    } catch (err) {
      console.error('Failed to load chat history:', err);
      
      // Fallback to localStorage
      const storageKey = `chat_${currentUser.id}_${character}`;
      const localHistory = localStorage.getItem(storageKey);
      return localHistory ? JSON.parse(localHistory) : [];
    }
  };

  const clearChatHistory = async (character) => {
    if (!currentUser) return;
    
    try {
      await fetch(`${API_BASE}/api/chat/${currentUser.id}/${character}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to clear chat history:', err);
    }
  };

  const saveMemory = async (character, memory) => {
    if (!currentUser) return;
    
    try {
      await fetch(`${API_BASE}/api/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          character,
          memory
        })
      });
    } catch (err) {
      console.error('Failed to save memory:', err);
    }
  };

  const loadMemories = async (character) => {
    if (!currentUser) return [];
    
    try {
      const response = await fetch(`${API_BASE}/api/memory/${currentUser.id}/${character}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (err) {
      console.error('Failed to load memories:', err);
      return [];
    }
  };

  const autoSave = async (character, gameState) => {
    if (!currentUser || !gameState) return;
    
    try {
      await saveProgress(character, gameState);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  };

  const value = {
    // State
    currentUser,
    isLoading,
    error,
    isInitialized,
    
    // User management
    login,
    logout,
    
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
    loadMemories
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;