import React, { createContext, useContext, useState, useEffect } from 'react';

// API base URL - empty string to use Vite proxy in development
const API_BASE = '';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initAttempted, setInitAttempted] = useState(false);

  // Initialize database on app start
  useEffect(() => {
    console.log('DatabaseContext useEffect triggered');
    
    if (initAttempted) {
      console.log('Init already attempted, skipping');
      return;
    }
    
    console.log('Starting database initialization');
    setInitAttempted(true);
    
    // Simplified initialization - just check localStorage and set loading to false
    const init = () => {
      console.log('Init function called - simplified version');
      
      try {
        // Check for saved user in localStorage
        const savedUsername = localStorage.getItem('rickmorty_username');
        console.log('Saved username from localStorage:', savedUsername);
        
        if (savedUsername) {
          // Create offline user
          const offlineUser = {
            id: 1,
            username: savedUsername,
            email: `${savedUsername}@example.com`,
            created_at: new Date().toISOString()
          };
          console.log('Setting current user:', offlineUser);
          setCurrentUser(offlineUser);
        }
        
        setIsInitialized(false); // Always offline mode for now
        console.log('Initialization complete - setting loading to false');
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setIsLoading(false);
        console.log('isLoading set to false');
      }
    };
    
    // Run init immediately (not async)
    init();
  }, []);

  const login = async (username) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isInitialized) {
        // Try API login if database is initialized
        try {
          // Try to get existing user
          const getUserController = new AbortController();
          const getUserTimeoutId = setTimeout(() => getUserController.abort(), 2000);
          
          let response = await fetch(`${API_BASE}/api/users/${username}`, {
            signal: getUserController.signal
          });
          clearTimeout(getUserTimeoutId);
          let user;
          
          if (!response.ok) {
            // Create new user if doesn't exist
            const createUserController = new AbortController();
            const createUserTimeoutId = setTimeout(() => createUserController.abort(), 2000);
            
            response = await fetch(`${API_BASE}/api/users`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username }),
              signal: createUserController.signal
            });
            clearTimeout(createUserTimeoutId);
          }
          
          if (response.ok) {
            user = await response.json();
            
            const loginController = new AbortController();
            const loginTimeoutId = setTimeout(() => loginController.abort(), 2000);
            
            await fetch(`${API_BASE}/api/users/${user.id}/login`, { 
              method: 'POST',
              signal: loginController.signal
            });
            clearTimeout(loginTimeoutId);
            
            setCurrentUser(user);
            localStorage.setItem('rickmorty_username', username);
            return { success: true, user };
          }
          
          return { success: false, error: 'Failed to create or retrieve user' };
        } catch (apiError) {
          console.warn('API login failed, falling back to offline mode:', apiError);
          // Fall through to offline mode
        }
      }
      
      // Offline mode login - just use localStorage
      const user = {
        id: Math.floor(Math.random() * 1000) + 1,
        username: username,
        email: `${username}@example.com`,
        created_at: new Date().toISOString()
      };
      
      setCurrentUser(user);
      localStorage.setItem('rickmorty_username', username);
      return { success: true, user };
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (currentUser && isInitialized) {
        try {
          await fetch(`${API_BASE}/api/users/${currentUser.id}/logout`, { method: 'POST' });
        } catch (apiError) {
          console.warn('API logout failed, continuing with local logout:', apiError);
        }
      }
      setCurrentUser(null);
      localStorage.removeItem('rickmorty_username');
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear local state even if API call fails
      setCurrentUser(null);
      localStorage.removeItem('rickmorty_username');
    }
  };

  const saveProgress = async (character, data) => {
    if (!currentUser) return;
    
    const progressData = {
      user_id: currentUser.id,
      character,
      ...data,
      saved_at: new Date().toISOString()
    };
    
    if (isInitialized) {
      try {
        const response = await fetch(`${API_BASE}/api/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progressData)
        });
        
        if (response.ok) {
          // Also save to localStorage as backup
          const storageKey = `progress_${currentUser.id}_${character}`;
          localStorage.setItem(storageKey, JSON.stringify(progressData));
          return;
        }
      } catch (err) {
        console.error('Failed to save progress to API:', err);
      }
    }
    
    // Fallback to localStorage
    try {
      const storageKey = `progress_${currentUser.id}_${character}`;
      localStorage.setItem(storageKey, JSON.stringify(progressData));
      console.log('Progress saved to localStorage');
    } catch (err) {
      console.error('Failed to save progress to localStorage:', err);
      setError('Failed to save progress');
    }
  };

  const loadProgress = async (character) => {
    if (!currentUser) return null;
    
    if (isInitialized) {
      try {
        const response = await fetch(`${API_BASE}/api/progress/${currentUser.id}/${character}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.error('Failed to load progress from API:', err);
      }
    }
    
    // Fallback to localStorage
    try {
      const storageKey = `progress_${currentUser.id}_${character}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Failed to load progress from localStorage:', err);
      return null;
    }
  };

  const getAllProgress = async () => {
    if (!currentUser) return [];
    
    if (isInitialized) {
      try {
        const response = await fetch(`${API_BASE}/api/progress/${currentUser.id}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.error('Failed to load all progress from API:', err);
      }
    }
    
    // Fallback to localStorage
    try {
      const allProgress = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`progress_${currentUser.id}_`)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            allProgress.push(JSON.parse(stored));
          }
        }
      }
      return allProgress;
    } catch (err) {
      console.error('Failed to load all progress from localStorage:', err);
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
    
    if (isInitialized) {
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
        
        // If database call succeeds, also save to localStorage as backup
        if (response.ok) {
          useLocalStorage();
          return;
        }
      } catch (err) {
        console.error('Failed to save chat message to API:', err);
      }
    }
    
    // Use localStorage as fallback
    useLocalStorage();
  };

  const loadChatHistory = async (character) => {
    if (!currentUser) return [];
    
    if (isInitialized) {
      try {
        const response = await fetch(`${API_BASE}/api/chat/${currentUser.id}/${character}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.error('Failed to load chat history from API:', err);
      }
    }
    
    // Fallback to localStorage
    try {
      const storageKey = `chat_${currentUser.id}_${character}`;
      const localHistory = localStorage.getItem(storageKey);
      return localHistory ? JSON.parse(localHistory) : [];
    } catch (err) {
      console.error('Failed to load chat history from localStorage:', err);
      return [];
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

  const saveGameData = async (gameData) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    try {
      if (isInitialized) {
        // Try to save to API if database is initialized
        try {
          const response = await fetch(`${API_BASE}/api/users/${currentUser.id}/game-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
          });

          if (response.ok) {
            return await response.json();
          }
        } catch (apiError) {
          console.warn('API save failed, falling back to localStorage:', apiError);
        }
      }
      
      // Offline mode - save to localStorage
      const gameDataKey = `rickmorty_gamedata_${currentUser.username}`;
      const savedData = {
        ...gameData,
        user_id: currentUser.id,
        saved_at: new Date().toISOString()
      };
      
      localStorage.setItem(gameDataKey, JSON.stringify(savedData));
      console.log('Game data saved to localStorage');
      return savedData;
    } catch (err) {
      console.error('Save game data failed:', err);
      throw err;
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
    saveGameData,
    
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