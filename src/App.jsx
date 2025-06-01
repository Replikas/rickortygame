import React, { useState } from 'react'



import { GameStateProvider } from './context/GameStateContext'
import { SettingsProvider } from './context/SettingsContext'
import { AudioProvider } from './context/AudioContext'
import { DatabaseProvider } from './context/DatabaseContext'
import { GameProvider } from './context/GameContext'
import { OpenRouterProvider } from './context/OpenRouterContext'
import GameScreen from './components/GameScreen'
import UserLogin from './components/UserLogin'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    // You can log errorInfo to an error reporting service here
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">A fatal error occurred</h2>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p className="mt-4">Please check your API key settings, try again later, or contact support.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  const [showLogin, setShowLogin] = useState(true)

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

  return (
    <ErrorBoundary>
      <DatabaseProvider>
        <SettingsProvider>
          <AudioProvider>
            <OpenRouterProvider>
              <GameProvider>
                <GameStateProvider>
                {showLogin ? (
                  <UserLogin onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
                    <GameScreen />
                  </div>
                )}
                </GameStateProvider>
              </GameProvider>
            </OpenRouterProvider>
           </AudioProvider>
         </SettingsProvider>
       </DatabaseProvider>
    </ErrorBoundary>
  )
}

export default App