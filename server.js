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

// Initialize database function
async function initializeDatabase() {
  // Check if DATABASE_URL is available for real database
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Database URL found - enabling real database functionality');
    try {
      // Import real database functions
      const dbModule = await import('./src/database/db.js');
      db = {
        initializeDatabase: dbModule.initializeDatabase,
        getUserByUsername: dbModule.getUserByUsername,
        createUser: dbModule.createUser,
        updateUserLogin: dbModule.updateUserLogin,
        saveGameProgress: dbModule.saveGameProgress,
        loadGameProgress: dbModule.loadGameProgress,
        getAllUserProgress: dbModule.getAllUserProgress,
        saveChatMessage: dbModule.saveChatMessage,
        getChatHistory: dbModule.getChatHistory,
        deleteChatHistory: dbModule.deleteChatHistory,
        saveCharacterMemory: dbModule.saveCharacterMemory,
        getCharacterMemories: dbModule.getCharacterMemories,
        updateCharacterMemory: dbModule.updateCharacterMemory,
        deleteCharacterMemory: dbModule.deleteCharacterMemory,
        cleanupOldData: dbModule.cleanupOldData
      };
      
      // Initialize the real database
      await dbModule.initializeDatabase();
      dbInitialized = true;
      console.log('✅ Real database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize real database:', error);
      console.log('📝 Falling back to mock mode');
      dbInitialized = false;
    }
  }

  // If no DATABASE_URL or database initialization failed, use mock mode
  if (!dbInitialized) {
  console.log('📝 Using mock database mode for testing');
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
    updateUserLogin: async (userId) => {
      console.log(`Mock: Updating login for user ${userId}`);
      return {
        userId: userId,
        last_login: new Date().toISOString(),
        login_count: Math.floor(Math.random() * 50) + 1
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
    },
    saveChatMessage: async (userId, character, userInput, characterResponse, emotion) => {
      console.log(`Mock: Saving chat message for user ${userId}, character ${character}`);
      return { success: true };
    },
    getChatHistory: async (userId, character, limit) => {
      console.log(`Mock: Getting chat history for user ${userId}, character ${character}`);
      return [];
    },
    deleteChatHistory: async (userId, character) => {
      console.log(`Mock: Deleting chat history for user ${userId}, character ${character}`);
      return { success: true };
    },
    saveCharacterMemory: async (userId, character, memoryType, memoryContent, importanceScore) => {
      console.log(`Mock: Saving character memory for user ${userId}, character ${character}`);
      return { success: true };
    },
    getCharacterMemories: async (userId, character, limit) => {
      console.log(`Mock: Getting character memories for user ${userId}, character ${character}`);
      return [];
    },
    updateCharacterMemory: async (memoryId, memoryContent, importanceScore) => {
      console.log(`Mock: Updating character memory ${memoryId}`);
      return { success: true };
    },
    deleteCharacterMemory: async (memoryId) => {
      console.log(`Mock: Deleting character memory ${memoryId}`);
      return { success: true };
    },
    cleanupOldData: async (daysToKeep) => {
      console.log(`Mock: Cleaning up old data (${daysToKeep} days)`);
      return { success: true };
    }
  };
}

}

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack trace:', error.stack);
  // Don't exit the process immediately, log and continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (reason && reason.stack) {
    console.error('Stack trace:', reason.stack);
  }
  // Don't exit the process immediately, log and continue
});

process.on('warning', (warning) => {
  console.warn('Node.js Warning:', warning.name, warning.message);
  if (warning.stack) {
    console.warn('Warning stack:', warning.stack);
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes

// Initialize database
app.post('/api/init', async (req, res) => {
  try {
    if (!dbInitialized) {
      return res.status(503).json({ error: 'Database module not yet loaded' });
    }
    // Database is already initialized during server startup
    res.json({ success: true, message: 'Database already initialized' });
  } catch (error) {
    console.error('Database initialization check failed:', error);
    res.status(500).json({ error: 'Failed to check database status' });
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



// Add mobile-friendly headers and security
app.use((req, res, next) => {
  // Mobile viewport and compatibility headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Mobile-specific headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Ensure proper MIME types for mobile
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  }
  
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err);
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Starting server initialization...');
    await initializeDatabase();
    console.log('Database initialization completed');
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Server startup completed successfully');
    });
    
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });
    
  } catch (error) {
    console.error('Error in startServer function:', error);
    throw error;
  }
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

