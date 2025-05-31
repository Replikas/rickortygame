import React, { useState } from 'react'
import { GeminiProvider } from './context/GeminiContext'
import { GameProvider } from './context/GameContext'
import { DatabaseProvider } from './context/DatabaseContext'
import GameScreen from './components/GameScreen'
import UserLogin from './components/UserLogin'

function App() {
  const [showLogin, setShowLogin] = useState(true)

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

  return (
    <DatabaseProvider>
      <GeminiProvider>
        <GameProvider>
          {showLogin ? (
            <UserLogin onLoginSuccess={handleLoginSuccess} />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
              <GameScreen />
            </div>
          )}
        </GameProvider>
      </GeminiProvider>
    </DatabaseProvider>
  )
}

export default App