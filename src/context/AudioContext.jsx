import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext();

const initialState = {
  isInitialized: false,
  currentMusic: null,
  musicLoaded: false,
  sfxLoaded: false,
  voiceLoaded: false,
  audioFiles: {
    music: {},
    sfx: {},
    voice: {}
  },
  playingTracks: new Set(),
  audioSupported: true
};

function audioReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    
    case 'SET_CURRENT_MUSIC':
      return { ...state, currentMusic: action.payload };
    
    case 'SET_LOADED':
      return { ...state, [`${action.category}Loaded`]: action.payload };
    
    case 'ADD_AUDIO_FILE':
      return {
        ...state,
        audioFiles: {
          ...state.audioFiles,
          [action.category]: {
            ...state.audioFiles[action.category],
            [action.name]: action.audio
          }
        }
      };
    
    case 'ADD_PLAYING_TRACK':
      const newPlayingTracks = new Set(state.playingTracks);
      newPlayingTracks.add(action.payload);
      return { ...state, playingTracks: newPlayingTracks };
    
    case 'REMOVE_PLAYING_TRACK':
      const updatedPlayingTracks = new Set(state.playingTracks);
      updatedPlayingTracks.delete(action.payload);
      return { ...state, playingTracks: updatedPlayingTracks };
    
    case 'SET_AUDIO_SUPPORTED':
      return { ...state, audioSupported: action.payload };
    
    default:
      return state;
  }
}

export function AudioProvider({ children }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const { settings } = useSettings();
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Check if audio is supported
        if (!window.AudioContext && !window.webkitAudioContext) {
          console.warn('Web Audio API not supported');
          dispatch({ type: 'SET_AUDIO_SUPPORTED', payload: false });
          return;
        }

        // Create audio context
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        // Create master gain node
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        dispatch({ type: 'SET_AUDIO_SUPPORTED', payload: false });
      }
    };

    initializeAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update master volume when settings change
  useEffect(() => {
    if (gainNodeRef.current && settings) {
      const volume = settings.muteAll ? 0 : settings.masterVolume;
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current?.currentTime || 0);
    }
  }, [settings?.masterVolume, settings?.muteAll]);

  const loadAudioFile = async (url, category, name) => {
    if (!state.audioSupported || !audioContextRef.current) {
      return null;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      dispatch({ 
        type: 'ADD_AUDIO_FILE', 
        category, 
        name, 
        audio: audioBuffer 
      });
      
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load audio file ${url}:`, error);
      return null;
    }
  };

  const playAudio = (category, name, options = {}) => {
    if (!state.audioSupported || !audioContextRef.current || !gainNodeRef.current) {
      return null;
    }

    const audioBuffer = state.audioFiles[category]?.[name];
    if (!audioBuffer) {
      console.warn(`Audio file not found: ${category}/${name}`);
      return null;
    }

    try {
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(gainNodeRef.current);
      
      // Set volume based on category and settings
      const categoryVolume = settings?.[`${category}Volume`] || 1;
      const volume = (settings?.muteAll ? 0 : categoryVolume) * (options.volume || 1);
      gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      
      // Set loop if specified
      source.loop = options.loop || false;
      
      // Track playing audio
      const trackId = `${category}-${name}-${Date.now()}`;
      dispatch({ type: 'ADD_PLAYING_TRACK', payload: trackId });
      
      source.onended = () => {
        dispatch({ type: 'REMOVE_PLAYING_TRACK', payload: trackId });
        if (options.onEnded) options.onEnded();
      };
      
      source.start(0);
      
      return {
        source,
        gainNode,
        trackId,
        stop: () => {
          source.stop();
          dispatch({ type: 'REMOVE_PLAYING_TRACK', payload: trackId });
        },
        setVolume: (newVolume) => {
          gainNode.gain.setValueAtTime(newVolume, audioContextRef.current.currentTime);
        }
      };
    } catch (error) {
      console.error(`Failed to play audio ${category}/${name}:`, error);
      return null;
    }
  };

  const stopAllAudio = () => {
    state.playingTracks.forEach(trackId => {
      // This is a simplified approach - in a real implementation,
      // you'd want to keep references to the actual audio sources
      console.log(`Stopping track: ${trackId}`);
    });
  };

  const playMusic = (name, options = {}) => {
    // Stop current music if playing
    if (state.currentMusic) {
      // Stop current music logic here
    }
    
    const track = playAudio('music', name, { ...options, loop: true });
    if (track) {
      dispatch({ type: 'SET_CURRENT_MUSIC', payload: { name, track } });
    }
    return track;
  };

  const playSFX = (name, options = {}) => {
    return playAudio('sfx', name, options);
  };

  const playVoice = (name, options = {}) => {
    return playAudio('voice', name, options);
  };

  const preloadAudio = async (audioManifest) => {
    const promises = [];
    
    for (const [category, files] of Object.entries(audioManifest)) {
      for (const [name, url] of Object.entries(files)) {
        promises.push(loadAudioFile(url, category, name));
      }
    }
    
    try {
      await Promise.all(promises);
      dispatch({ type: 'SET_LOADED', category: 'music', payload: true });
      dispatch({ type: 'SET_LOADED', category: 'sfx', payload: true });
      dispatch({ type: 'SET_LOADED', category: 'voice', payload: true });
    } catch (error) {
      console.error('Failed to preload some audio files:', error);
    }
  };

  const value = {
    ...state,
    // Core functions
    loadAudioFile,
    playAudio,
    stopAllAudio,
    preloadAudio,
    
    // Convenience functions
    playMusic,
    playSFX,
    playVoice,
    
    // Utility functions
    isAudioSupported: () => state.audioSupported,
    isInitialized: () => state.isInitialized,
    getCurrentMusic: () => state.currentMusic,
    getPlayingTracksCount: () => state.playingTracks.size
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export default AudioContext;