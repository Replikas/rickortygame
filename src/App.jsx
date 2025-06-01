import React, { useState } from 'react'
import { GameStateProvider } from './context/GameStateContext'
import { SettingsProvider } from './context/SettingsContext'
import { AudioProvider } from './context/AudioContext'
import { DatabaseProvider, useDatabase } from './context/DatabaseContext'
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

// Inner component that can use the useDatabase hook
function AppContent() {
  const { currentUser, isLoading } = useDatabase()
  const [showLogin, setShowLogin] = useState(false)

  // Show login if no current user and not loading
  const shouldShowLogin = !currentUser && !isLoading

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-400 text-xl">Loading Rick & Morty Game...</p>
        </div>
      </div>
    )
  }

  return (
    <SettingsProvider>
      <AudioProvider>
        <OpenRouterProvider>
          <GameProvider>
            <GameStateProvider>
            {shouldShowLogin ? (
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
  )
}

function App() {
  return (
    <ErrorBoundary>
      <DatabaseProvider>
        <AppContent />
      </DatabaseProvider>
    </ErrorBoundary>
  )
}

export default App