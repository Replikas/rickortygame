const express = require('express');
const path = require('path');
const {
  initializeDatabase,
  createUser,
  getUserByUsername,
  updateUserLogin,
  saveGameProgress,
  loadGameProgress,
  getAllUserProgress,
  saveChatMessage,
  getChatHistory,
  deleteChatHistory,
  saveCharacterMemory,
  getCharacterMemories
} = require('./src/database/db.js');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes

// Initialize database
app.post('/api/init', async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ success: true });
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// User routes
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await getUserByUsername(req.params.username);
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
    const { username } = req.body;
    const user = await createUser(username);
    res.json(user);
  } catch (error) {
    console.error('Create user failed:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/users/:id/login', async (req, res) => {
  try {
    await updateUserLogin(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Update login failed:', error);
    res.status(500).json({ error: 'Failed to update login' });
  }
});

// Progress routes
app.post('/api/progress', async (req, res) => {
  try {
    const { userId, character, progress } = req.body;
    const result = await saveGameProgress(userId, character, progress);
    res.json(result);
  } catch (error) {
    console.error('Save progress failed:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress/:userId/:character', async (req, res) => {
  try {
    const { userId, character } = req.params;
    const progress = await loadGameProgress(userId, character);
    res.json(progress);
  } catch (error) {
    console.error('Load progress failed:', error);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

app.get('/api/progress/:userId', async (req, res) => {
  try {
    const progress = await getAllUserProgress(req.params.userId);
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
    const result = await saveChatMessage(userId, character, message, '', 'neutral');
    res.json(result);
  } catch (error) {
    console.error('Save chat failed:', error);
    res.status(500).json({ error: 'Failed to save chat' });
  }
});

app.get('/api/chat/:userId/:character', async (req, res) => {
  try {
    const { userId, character } = req.params;
    const history = await getChatHistory(userId, character);
    res.json(history);
  } catch (error) {
    console.error('Load chat history failed:', error);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

app.delete('/api/chat/:userId/:character', async (req, res) => {
  try {
    const { userId, character } = req.params;
    await deleteChatHistory(userId, character);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete chat history failed:', error);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});

// Memory routes
app.post('/api/memory', async (req, res) => {
  try {
    const { userId, character, memory } = req.body;
    const result = await saveCharacterMemory(userId, character, 'general', memory, 1);
    res.json(result);
  } catch (error) {
    console.error('Save memory failed:', error);
    res.status(500).json({ error: 'Failed to save memory' });
  }
});

app.get('/api/memory/:userId/:character', async (req, res) => {
  try {
    const { userId, character } = req.params;
    const memories = await getCharacterMemories(userId, character);
    res.json(memories);
  } catch (error) {
    console.error('Load memories failed:', error);
    res.status(500).json({ error: 'Failed to load memories' });
  }
});

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});