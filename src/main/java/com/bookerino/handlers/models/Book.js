const db = require('../utils/jsonDb');

class Book {
  static async create(bookData) {
    return await db.create('books', {
      ...bookData,
      status: bookData.status || 'want-to-read',
      rating: bookData.rating || 0,
      currentPage: bookData.currentPage || 0,
      notes: bookData.notes || '',
      tags: bookData.tags || []
    });
  }

  static async findByUser(userId, filters = {}) {
    let books = await db.find('books', { userId });
    
    // Apply filters
    if (filters.status) {
      books = books.filter(book => book.status === filters.status);
    }
    
    if (filters.author) {
      books = books.filter(book => 
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }
    
    if (filters.title) {
      books = books.filter(book => 
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    return books;
  }

  static async findById(id) {
    return await db.findById('books', id);
  }

  static async update(id, updates) {
    return await db.update('books', id, updates);
  }

  static async delete(id) {
    return await db.delete('books', id);
  }

  static async updateProgress(bookId, currentPage, totalPages) {
    const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
    
    return await this.update(bookId, {
      currentPage,
      progress: Math.round(progress),
      updatedAt: new Date().toISOString()
    });
  }

  static async addReview(bookId, review) {
    const book = await this.findById(bookId);
    if (!book) return null;

    const updatedBook = await this.update(bookId, {
      rating: review.rating,
      notes: review.notes,
      reviewDate: new Date().toISOString()
    });

    return updatedBook;
  }

  static async search(userId, query) {
    const books = await this.findByUser(userId);
    
    return books.filter(book => {
      const searchableText = `
        ${book.title} ${book.author} ${book.description} ${book.tags.join(' ')}
      `.toLowerCase();
      
      return searchableText.includes(query.toLowerCase());
    });
  }
}

module.exports = Book;