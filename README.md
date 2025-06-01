# 🚀 Rick and Morty Dating Simulator

> An AI-powered dating simulator featuring Rick, Morty, Evil Morty, and Rick Prime

## 🎯 Project Overview

This is a dating simulator featuring Rick and Morty characters. The application features a modern React frontend with Express.js backend. Note: AI providers have been removed - character conversations are currently disabled.

## 🌟 Features

### Core Gameplay
- **Character Selection**: Choose from multiple Rick and Morty characters
- **Affection System**: Build relationships through meaningful interactions (currently disabled)
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Game Interface**: Complete dating simulator interface
- **Settings Management**: Comprehensive settings and configuration options
- **Note**: AI conversations are currently disabled - all AI providers have been removed

## 🎭 Available Characters

### Rick Sanchez
- **Personality**: Genius scientist with drinking problem and zero filter
- **Traits**: Sarcastic, brilliant, nihilistic, interdimensional traveler
- **NSFW**: Enabled

### Morty Smith
- **Personality**: Anxious teenager dragged into interdimensional adventures
- **Traits**: Nervous, honest, sweet, morally conscious
- **NSFW**: Disabled

### Evil Morty
- **Personality**: The Morty who got tired of being a sidekick
- **Traits**: Strategic, calculated, manipulative, intelligent
- **NSFW**: Enabled

### Rick Prime
- **Personality**: The Rick who killed C-137 Rick's family
- **Traits**: Cold, efficient, superior, villainous
- **NSFW**: Enabled

### 🔧 AI Provider Configuration

The application supports:

**Note**: AI providers have been removed from this application

You can switch between providers in the settings panel within the application.

### Advanced Features
- **Sprite Animation System**: CSS transitions and emotion-based sprite changes
- **Webhook Logging**: Track all interactions for debugging and analytics
- **Admin Dashboard**: Manage characters, view logs, and monitor analytics
- **Persistent Game State**: Save progress across sessions
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Note: AI functionality has been removed

### Installation

1. **Clone or download this project**
   ```bash
   cd rickortygametest2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.example .env
   # No API keys required - AI functionality has been removed
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app should open automatically

### Note on AI Functionality

All AI providers (OpenRouter and Remote Ollama) have been removed from this application. Character conversations are currently disabled. The application retains its full interface and game mechanics, but AI-powered responses are not available.

## 🎮 How to Play

1. **Character Selection**: Choose which character you want to interact with
2. **Conversation**: Engage in AI-powered dialogue using:
   - Preset choice buttons for quick responses
   - Free text input for custom messages
3. **Build Relationships**: Your choices affect affection levels and unlock new content
4. **Unlock Content**: Higher affection levels unlock special scenes and dialogue options
5. **NSFW Mode**: Toggle in settings for mature content (18+ only)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom Rick & Morty theme
- **Animations**: Framer Motion
- **AI**: Google Gemini API
- **State Management**: React Context
- **Routing**: React Router
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── CharacterSelect.jsx    # Character selection screen
│   ├── GameScreen.jsx         # Main game interface
│   ├── CharacterSprite.jsx    # Animated character display
│   ├── DialogueBox.jsx        # AI response display
│   ├── ChoiceButtons.jsx      # Dialogue choice options
│   ├── AffectionMeter.jsx     # Relationship progress
│   ├── Settings.jsx           # Game settings and API config
│   └── AdminPanel.jsx         # Developer tools and analytics
├── context/              # React Context providers
│   ├── GameContext.jsx        # Game state management
│   └── GeminiContext.jsx      # AI integration
├── config/
│   └── characters.json       # Character-specific model configurations
├── App.jsx              # Main app component
├── main.jsx             # React entry point
└── index.css            # Global styles and Tailwind
```

## 🎨 Customization

### Adding New Characters

1. **Update Character Data**: Add character info in `CharacterSelect.jsx`
2. **Create System Prompts**: Add personality prompts in `GeminiContext.jsx`
3. **Add Sprite Configurations**: Define emotions and animations in `CharacterSprite.jsx`
4. **Update Unlock Logic**: Modify unlock conditions as needed

### Modifying AI Behavior

- **Character Personalities**: Edit prompts in `GeminiContext.jsx`
- **Emotion Detection**: Modify keyword mapping in `analyzeEmotion` function
- **Affection Calculation**: Adjust scoring in `calculateAffectionChange`

### Styling Changes

- **Colors**: Modify the color palette in `tailwind.config.js`
- **Animations**: Add new animations in `index.css`
- **Layout**: Adjust component layouts in individual component files

## 🔧 Admin Features

### Webhook Logging
All interactions are logged with:
- User input and AI responses
- Emotion detection results
- Affection changes
- Sprite state changes
- NSFW mode status

### Analytics Dashboard
- Total interaction count
- Character popularity
- Emotion distribution
- Response length analysis
- NSFW usage statistics

### Data Export
- Export webhook logs as JSON
- Clear logs for privacy
- Reset all game data

## 🔒 Privacy & Security

- **API Keys**: Stored locally in browser, never transmitted to third parties
- **Game Data**: Saved in localStorage, stays on your device
- **Webhook Logs**: Optional feature, can be disabled or cleared
- **NSFW Content**: Clearly marked and requires explicit opt-in

## 🐛 Troubleshooting

### Common Issues

**"API key not set" error**
- Go to Settings and add your Gemini API key
- Make sure the key is valid and has proper permissions

**Characters not responding**
- Check your internet connection
- Verify API key is correct
- Check browser console for error messages

**Sprites not animating**
- Ensure CSS animations are enabled in your browser
- Try refreshing the page

**Game state not saving**
- Check if localStorage is enabled in your browser
- Clear browser cache and restart

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Disclaimer

- This is a fan-made project not affiliated with Adult Swim or the creators of Rick and Morty
- NSFW content is optional and intended for adults only (18+)
- AI responses are generated and may not always be appropriate
- Use responsibly and respect content guidelines

## 📄 License

This project is for educational and entertainment purposes. Rick and Morty characters and references are property of their respective owners.

---

**Wubba lubba dub dub!** 🛸

Enjoy your interdimensional dating adventures!