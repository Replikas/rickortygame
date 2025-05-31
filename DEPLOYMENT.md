# Rick and Morty Game - Deployment Guide

## Deploying to Render

This project is configured for easy deployment to Render.com using the included `render.yaml` configuration.

### Steps to Deploy:

1. **Push to GitHub** (Already completed)
   - Repository: https://github.com/Replikas/rickortygame

2. **Connect to Render**
   - Go to [Render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `Replikas/rickortygame`
   - Render will automatically detect the `render.yaml` configuration

3. **Configure API Keys**
   - Before deployment, you MUST configure your Gemini API keys
   - Edit `src/contexts/GeminiContext.jsx`
   - Update the `serverApiKeys` array with your actual API keys:
   
   ```javascript
   const serverApiKeys = [
     'your-actual-gemini-api-key-1',
     'your-actual-gemini-api-key-2', // Optional: for rate limit protection
     // Add more keys as needed
   ];
   ```

4. **Get Gemini API Keys**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create a new API key
   - For production, consider getting multiple keys for rate limit protection

5. **Deploy**
   - Render will automatically build and deploy your application
   - Build command: `npm install && npm run build`
   - Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`

### Important Notes:

- **API Keys**: Make sure to add your actual Gemini API keys before deployment
- **Rate Limits**: Multiple API keys provide automatic rotation when limits are hit
- **Security**: API keys are managed server-side, not exposed to end users
- **Free Tier**: This configuration uses Render's free tier

### Project Features:

- Interactive Rick and Morty character conversations
- AI-powered responses using Google's Gemini API
- Multiple API key support with automatic rotation
- Responsive design with portal-themed UI
- Character affection system
- Settings panel with theme customization

### Tech Stack:

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **AI**: Google Gemini API
- **Deployment**: Render.com

### Troubleshooting:

- If characters don't respond, check that API keys are properly configured
- For rate limit issues, add additional API keys to the `serverApiKeys` array
- Check Render logs for any deployment issues

---

**Ready to deploy!** 🚀

Your Rick and Morty game will be live at: `https://rickortygame.onrender.com` (or similar URL provided by Render)