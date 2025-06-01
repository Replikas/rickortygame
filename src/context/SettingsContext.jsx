import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SettingsContext = createContext();

const initialSettings = {
  // Audio Settings
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  voiceVolume: 0.9,
  muteAll: false,
  
  // Display Settings
  theme: 'dark', // 'dark', 'light', 'auto'
  fontSize: 'medium', // 'small', 'medium', 'large'
  animationSpeed: 'normal', // 'slow', 'normal', 'fast', 'off'
  showSubtitles: true,
  fullscreen: false,
  
  // Gameplay Settings
  autoAdvance: false,
  autoAdvanceDelay: 3000, // milliseconds
  skipUnreadText: false,
  confirmChoices: true,
  saveOnExit: true,
  
  // AI Provider Settings
  preferredProvider: 'none', // No AI provider configured
  
  // Privacy Settings
  analytics: true,
  crashReporting: true,
  saveConversations: true,
  
  // Accessibility
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_SETTING':
      return {
        ...state,
        [action.key]: action.value
      };
    
    case 'UPDATE_NESTED_SETTING':
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          [action.key]: action.value
        }
      };
    
    case 'UPDATE_MULTIPLE_SETTINGS':
      return {
        ...state,
        ...action.settings
      };
    
    case 'RESET_SETTINGS':
      return initialSettings;
    
    case 'RESET_CATEGORY':
      return {
        ...state,
        [action.category]: initialSettings[action.category]
      };
    
    case 'LOAD_SETTINGS':
      return {
        ...initialSettings,
        ...action.settings
      };
    
    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('rickMortyGameSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', settings: parsed });
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('rickMortyGameSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  const value = {
    settings,
    dispatch,
    // Helper functions
    updateSetting: (key, value) => {
      dispatch({ type: 'UPDATE_SETTING', key, value });
    },
    updateNestedSetting: (category, key, value) => {
      dispatch({ type: 'UPDATE_NESTED_SETTING', category, key, value });
    },
    updateMultipleSettings: (newSettings) => {
      dispatch({ type: 'UPDATE_MULTIPLE_SETTINGS', settings: newSettings });
    },
    resetSettings: () => {
      dispatch({ type: 'RESET_SETTINGS' });
    },
    resetCategory: (category) => {
      dispatch({ type: 'RESET_CATEGORY', category });
    },
    // Convenience getters
    getVolume: (type) => {
      if (settings.muteAll) return 0;
      const baseVolume = settings.masterVolume;
      const typeVolume = settings[`${type}Volume`] || 1;
      return baseVolume * typeVolume;
    },
    isProviderConfigured: (provider) => {
      const config = settings[provider];
      return config && config.apiKey && config.apiKey.trim() !== '';
    },
    getCurrentProvider: () => {
      const preferred = settings.preferredProvider;
      if (settings.isProviderConfigured?.(preferred)) {
        return preferred;
      }
      // No AI provider available
      return 'none'; // No AI provider available
    }
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;