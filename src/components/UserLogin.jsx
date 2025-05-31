import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';

const UserLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);
  const { loginUser, isLoading, error } = useDatabase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      return;
    }

    try {
      await loginUser(username.trim(), email.trim() || null);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGuestMode = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-sm border border-green-400/30 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Rick & Morty</h1>
          <h2 className="text-2xl text-blue-400 mb-4">Interactive Game</h2>
          <p className="text-gray-300 text-sm">
            Save your progress and chat history by logging in, or continue as guest
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Enter your username"
              maxLength={50}
            />
          </div>

          {showEmailField && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your email (optional)"
                maxLength={100}
              />
            </div>
          )}

          {!showEmailField && (
            <button
              type="button"
              onClick={() => setShowEmailField(true)}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Add email for account recovery
            </button>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-400/30 rounded p-2">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isLoading ? 'Logging in...' : 'Login / Register'}
            </button>

            <button
              type="button"
              onClick={handleGuestMode}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Continue as Guest
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-400 text-center space-y-1">
          <p>• Guest mode: No progress saving</p>
          <p>• Registered users: Full progress & chat history saved</p>
          <p>• New usernames automatically create accounts</p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;