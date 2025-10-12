const db = require('../utils/jsonDb');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await db.create('users', {
      username: userData.username,
      email: userData.email,
      passwordHash: hashedPassword,
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      }
    });

    // Remove password hash from returned user
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async findByEmail(email) {
    return await db.findOne('users', { email });
  }

  static async findById(id) {
    const user = await db.findById('users', id);
    if (user) {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updatePreferences(userId, preferences) {
    return await db.update('users', userId, { 
      preferences: { ...preferences },
      updatedAt: new Date().toISOString()
    });
  }

  static async getStats(userId) {
    const userBooks = await db.find('books', { userId });
    const readBooks = userBooks.filter(book => book.status === 'read');
    const readingBooks = userBooks.filter(book => book.status === 'reading');
    
    return {
      totalBooks: userBooks.length,
      readBooks: readBooks.length,
      readingBooks: readingBooks.length,
      wantToRead: userBooks.filter(book => book.status === 'want-to-read').length
    };
  }
}

module.exports = User;