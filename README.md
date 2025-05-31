# Rick & Morty Dating Simulator 🛸💕

A full-featured, AI-powered dating simulator featuring characters from Rick and Morty, built with React and powered by Google's Gemini AI.

## 🌟 Features

### Core Gameplay
- **Dynamic AI Conversations**: Powered by Gemini API with character-specific personalities
- **Emotional Sprite System**: Characters react with different expressions and animations
- **Affection Tracking**: Build relationships through meaningful interactions
- **Branching Dialogue**: Choose from preset options or type custom responses
- **NSFW Toggle**: Mature content mode with appropriate character behavior changes

### Characters Available
- **Rick Sanchez**: Genius scientist with drinking problem and zero filter
- **Morty Smith**: Anxious teenager who's seen too much
- **Summer Smith**: Popular teen with hidden depths (unlockable)
- **Beth Smith**: Surgeon with daddy issues (unlockable)

### Advanced Features
- **Sprite Animation System**: CSS transitions and emotion-based sprite changes
- **Webhook Logging**: Track all interactions for debugging and analytics
- **Admin Dashboard**: Manage characters, view logs, and monitor analytics
- **Persistent Game State**: Save progress across sessions
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- A free Gemini API key from [Google AI Studio](https://ai.google.dev/)

### Installation

1. **Clone or download this project**
   ```bash
   cd gametest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app should open automatically

### Getting Your Gemini API Key

1. Visit [ai.google.dev](https://ai.google.dev/)
2. Click "Get API Key" or "View Gemini API docs"
3. Sign in with your Google account
4. Create a new API key in Google AI Studio
5. Copy the API key
6. In the app, go to Settings and paste your API key

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