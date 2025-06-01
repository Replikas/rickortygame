import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database functions will be loaded dynamically
let db = {};

let dbInitialized = false;

// Database functionality disabled - using mock mode
console.log('📝 Database disabled - using mock mode for testing');
dbInitialized = true;

// Mock database functions
db = {
  initializeDatabase: async () => {
    console.log('Mock: Database initialized');
    return true;
  },
  getUserByUsername: async (username) => {
    console.log(`Mock: Getting user ${username}`);
    return {
      id: 1,
      username: username,
      email: `${username}@example.com`,
      created_at: new Date().toISOString()
    };
  },
  createUser: async (username, email) => {
    console.log(`Mock: Creating user ${username}`);
    return {
      id: Math.floor(Math.random() * 1000),
      username: username,
      email: email || `${username}@example.com`,
      created_at: new Date().toISOString()
    };
  },
  updateUserReputation: async (username, change) => {
    console.log(`Mock: Updating reputation for ${username} by ${change}`);
    return {
      username: username,
      reputation: Math.max(0, 100 + change)
    };
  },
  updateUserLogin: async (username) => {
    console.log(`Mock: Updating login for ${username}`);
    return {
      username: username,
      last_login: new Date().toISOString(),
      login_count: Math.floor(Math.random() * 50) + 1
    };
  },
  saveGameState: async (username, gameState) => {
    console.log(`Mock: Saving game state for ${username}`);
    return { success: true };
  },
  getGameState: async (username) => {
     console.log(`Mock: Getting game state for ${username}`);
     return {
       username: username,
       current_character: null,
       conversation_history: [],
       game_progress: {},
       last_updated: new Date().toISOString()
     };
   },
   saveGameProgress: async (userId, character, progress) => {
     console.log(`Mock: Saving progress for user ${userId}, character ${character}`);
     return { success: true, userId, character, progress };
   },
   loadGameProgress: async (userId, character) => {
     console.log(`Mock: Loading progress for user ${userId}, character ${character}`);
     return {
       userId: userId,
       character: character,
       progress: {
         level: 1,
         affection: 50,
         conversations: 0
       }
     };
   },
   getAllUserProgress: async (userId) => {
     console.log(`Mock: Loading all progress for user ${userId}`);
     return {
       userId: userId,
       characters: {
         rick: { level: 1, affection: 50, conversations: 0 },
         morty: { level: 1, affection: 50, conversations: 0 }
       }
     };
   }
 };



// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err);
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});

// API Routes

// Initialize database
app.post('/api/init', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    await db.initializeDatabase();
    res.json({ success: true });
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// User routes
app.get('/api/users/:username', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const user = await db.getUserByUsername(req.params.username);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Get user failed:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const { username, email } = req.body;
    const user = await db.createUser(username, email);
    res.json(user);
  } catch (error) {
    console.error('Create user failed:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/users/:username/login', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const result = await db.updateUserLogin(req.params.username);
    res.json(result);
  } catch (error) {
    console.error('Update login failed:', error);
    res.status(500).json({ error: 'Failed to update login' });
  }
});

// Progress routes
app.post('/api/progress', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const { userId, character, progress } = req.body;
    const result = await db.saveGameProgress(userId, character, progress);
    res.json(result);
  } catch (error) {
    console.error('Save progress failed:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress/:userId/:character', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const { userId, character } = req.params;
    const progress = await db.loadGameProgress(userId, character);
    res.json(progress);
  } catch (error) {
    console.error('Load progress failed:', error);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

app.get('/api/progress/:userId', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const progress = await db.getAllUserProgress(req.params.userId);
    res.json(progress);
  } catch (error) {
    console.error('Load all progress failed:', error);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

// Chat routes
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, character, message, isUser } = req.body;
    // Backend validation for character length
    if (typeof character !== 'string' || character.length > 50) {
      return res.status(400).json({ error: 'Character ID too long or invalid.' });
    }
    // Prevent guests from saving chat messages
    if (!userId) {
      return res.status(403).json({ error: 'Guests are not allowed to save chat messages.' });
    }
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const result = await db.saveChatMessage(userId, character, message, '', 'neutral');
    res.json(result);
  } catch (error) {
    console.error('Save chat failed:', error);
    res.status(500).json({ error: 'Failed to save chat' });
  }
});

app.get('/api/chat/:userId/:character', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const { userId, character } = req.params;
    const history = await db.getChatHistory(userId, character);
    res.json(history);
  } catch (error) {
    console.error('Load chat history failed:', error);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

app.delete('/api/chat/:userId/:character', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const { userId, character } = req.params;
    await db.deleteChatHistory(userId, character);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete chat history failed:', error);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});

// Memory routes
app.post('/api/memory', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const { userId, character, memory } = req.body;
    const result = await db.saveCharacterMemory(userId, character, 'general', memory, 1);
    res.json(result);
  } catch (error) {
    console.error('Save memory failed:', error);
    res.status(500).json({ error: 'Failed to save memory' });
  }
});

app.get('/api/memory/:userId/:character', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    const { userId, character } = req.params;
    const memories = await db.getCharacterMemories(userId, character);
    res.json(memories);
  } catch (error) {
    console.error('Load memories failed:', error);
    res.status(500).json({ error: 'Failed to load memories' });
  }
});



// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});