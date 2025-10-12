const db = require('../utils/jsonDb');

async function initializeDatabase() {
  try {
    console.log('Initializing JSON database...');
    
    // Create sample data for development
    if (process.env.NODE_ENV === 'development') {
      await db.reset();
      
      console.log('Database initialized with sample data');
      console.log('Initial stats:', await db.getStats());
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();