const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../utils/jsonDb');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided', 
        debug: { availableTokens: db.data.sessions.length }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        debug: { token: decoded, totalUsers: db.data.users.length }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('🔐 Auth middleware error:', error.message);
    res.status(401).json({ 
      error: 'Please authenticate',
      debug: { error: error.message }
    });
  }
};

// Debug middleware for development
const debugMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Debug Info:', {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      user: req.user ? req.user.id : 'none'
    });
  }
  next();
};

module.exports = { auth, debugMiddleware };