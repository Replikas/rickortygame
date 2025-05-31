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

3. **Configure API Keys (Environment Variables)**
   - API keys are now managed through Render's environment variables (secure!)
   - In Render dashboard, go to your service → Environment
   - Add the following environment variables:
   
   ```
   VITE_GEMINI_API_KEY_1=your-first-api-key-here
   VITE_GEMINI_API_KEY_2=your-second-api-key-here (optional)
   VITE_GEMINI_API_KEY_3=your-third-api-key-here (optional)
   VITE_GEMINI_API_KEY_4=your-fourth-api-key-here (optional)
   VITE_GEMINI_API_KEY_5=your-fifth-api-key-here (optional)
   ```
   
   - You only need at least one key (VITE_GEMINI_API_KEY_1)
   - Additional keys provide automatic rotation for rate limit protection

4. **Get Gemini API Keys**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create a new API key
   - For production, consider getting multiple keys for rate limit protection

5. **Deploy**
   - Render will automatically build and deploy your application
   - Build command: `npm install && npm run build`
   - Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`

### Important Notes:

- **API Keys**: Add your Gemini API keys as environment variables in Render (never commit keys to GitHub!)
- **Security**: API keys are stored securely in Render's environment variables, not in your code
- **Rate Limits**: Multiple API keys provide automatic rotation when limits are hit
- **Environment Variables**: Keys are loaded from VITE_GEMINI_API_KEY_1, VITE_GEMINI_API_KEY_2, etc.
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