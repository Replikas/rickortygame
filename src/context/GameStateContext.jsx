import React, { createContext, useContext, useReducer } from 'react';

const GameStateContext = createContext();

const initialState = {
  currentCharacter: null,
  gamePhase: 'character-select', // 'character-select', 'dating', 'conversation'
  affectionLevel: 0,
  conversationHistory: [],
  gameSettings: {
    difficulty: 'normal',
    autoSave: true,
    soundEnabled: true
  },
  playerProfile: {
    name: '',
    preferences: {}
  },
  achievements: [],
  gameProgress: {
    charactersUnlocked: ['rick', 'morty'],
    scenariosCompleted: [],
    totalPlayTime: 0
  }
};

function gameStateReducer(state, action) {
  switch (action.type) {
    case 'SET_CHARACTER':
      return {
        ...state,
        currentCharacter: action.payload,
        gamePhase: 'dating'
      };
    
    case 'SET_GAME_PHASE':
      return {
        ...state,
        gamePhase: action.payload
      };
    
    case 'UPDATE_AFFECTION':
      return {
        ...state,
        affectionLevel: Math.max(0, Math.min(100, state.affectionLevel + action.payload))
      };
    
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, action.payload]
      };
    
    case 'CLEAR_CONVERSATION':
      return {
        ...state,
        conversationHistory: []
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.payload }
      };
    
    case 'SET_PLAYER_PROFILE':
      return {
        ...state,
        playerProfile: { ...state.playerProfile, ...action.payload }
      };
    
    case 'ADD_ACHIEVEMENT':
      if (!state.achievements.includes(action.payload)) {
        return {
          ...state,
          achievements: [...state.achievements, action.payload]
        };
      }
      return state;
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        gameProgress: { ...state.gameProgress, ...action.payload }
      };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        playerProfile: state.playerProfile,
        achievements: state.achievements
      };
    
    default:
      return state;
  }
}

export function GameStateProvider({ children }) {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);

  const value = {
    ...state,
    dispatch,
    // Helper functions
    setCharacter: (character) => dispatch({ type: 'SET_CHARACTER', payload: character }),
    setGamePhase: (phase) => dispatch({ type: 'SET_GAME_PHASE', payload: phase }),
    updateAffection: (amount) => dispatch({ type: 'UPDATE_AFFECTION', payload: amount }),
    addConversation: (message) => dispatch({ type: 'ADD_CONVERSATION', payload: message }),
    clearConversation: () => dispatch({ type: 'CLEAR_CONVERSATION' }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    setPlayerProfile: (profile) => dispatch({ type: 'SET_PLAYER_PROFILE', payload: profile }),
    addAchievement: (achievement) => dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement }),
    updateProgress: (progress) => dispatch({ type: 'UPDATE_PROGRESS', payload: progress }),
    resetGame: () => dispatch({ type: 'RESET_GAME' })
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}

export default GameStateContext;