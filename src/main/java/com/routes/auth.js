const express = require('express');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const db = require('../utils/jsonDb');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Input validation rules
const validateRegistration = [
  // Add your validation rules here
];

const validateLogin = [
  // Add your validation rules here
];

// Register
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        debug: { body: req.body }
      });
    }

    const { email, password, username } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        debug: { existingEmail: email }
      });
    }

    const user = await User.create({ email, password, username });
    
    // Create token
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Store session for debugging
    await db.create('sessions', {
      userId: user.id,
      token,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
      debug: { 
        totalUsers: db.data.users.length,
        totalSessions: db.data.sessions.length 
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      debug: { error: error.message, stack: error.stack }
    });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !(await User.validatePassword(password, user.passwordHash))) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        debug: { attemptedEmail: email }
      });
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Store session
    await db.create('sessions', {
      userId: user.id,
      token,
      createdAt: new Date().toISOString()
    });

    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      debug: { 
        userId: user.id,
        activeSessions: db.data.sessions.filter(s => s.userId === user.id).length
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      debug: { error: error.message }
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const stats = await User.getStats(req.user.id);
    
    res.json({
      user: req.user,
      stats,
      debug: {
        userBooks: db.data.books.filter(b => b.userId === req.user.id).length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get user data',
      debug: { error: error.message }
    });
  }
});

// Debug endpoint - Get all sessions (remove in production)
router.get('/debug/sessions', auth, async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({
    sessions: db.data.sessions,
    stats: await db.getStats()
  });
});

module.exports = router;