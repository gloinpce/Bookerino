require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const db = require('./utils/jsonDb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📨 ${req.method} ${req.path}`, {
      body: req.body,
      query: req.query,
      params: req.params
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStats = await db.getStats();
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: 'connected',
      ...dbStats
    },
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Debug endpoint (development only)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/debug/db', async (req, res) => {
    res.json({
      ...db.data,
      _metadata: await db.getStats()
    });
  });

  app.post('/api/debug/reset', async (req, res) => {
    await db.reset();
    res.json({ message: 'Database reset successfully' });
  });

  app.post('/api/debug/backup', async (req, res) => {
    const backupPath = await db.backup();
    res.json({ 
      message: 'Backup created successfully',
      backupPath 
    });
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Global error handler:', error);
  
  res.status(500).json({
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && {
      debug: {
        message: error.message,
        stack: error.stack,
        route: `${req.method} ${req.path}`
      }
    })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    debug: {
      method: req.method,
      path: req.originalUrl,
      availableEndpoints: [
        'GET /api/health',
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/books',
        'POST /api/books'
      ]
    }
  });
});

// Initialize server
async function startServer() {
  try {
    // Ensure database is loaded
    await db.init();
    
    app.listen(PORT, () => {
      console.log(`
Bookerino server running!
Port: ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Database: JSON file (${path.resolve('./data/db.json')})
Endpoints:
   - Health: http://localhost:${PORT}/api/health
   - API Docs: http://localhost:${PORT}/api/debug/db
   - Register: http://localhost:${PORT}/api/auth/register
   - Books: http://localhost:${PORT}/api/books

Debug tools available in development mode!
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;