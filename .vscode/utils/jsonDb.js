const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class JSONDatabase {
  constructor(filePath = './data/db.json') {
    this.filePath = path.resolve(filePath);
    this.data = {
      users: [],
      books: [],
      sessions: []
    };
    this.init();
  }

  async init() {
    try {
      await fs.access(this.filePath);
      const fileData = await fs.readFile(this.filePath, 'utf8');
      this.data = JSON.parse(fileData);
      console.log('✅ JSON database loaded successfully');
    } catch (error) {
      console.log('📁 Creating new JSON database...');
      await this.save();
    }
  }

  async save() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('❌ Error saving database:', error);
      throw error;
    }
  }

  // Generic CRUD operations
  async create(collection, item) {
    const newItem = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...item
    };
    
    this.data[collection].push(newItem);
    await this.save();
    return newItem;
  }

  async find(collection, query = {}) {
    let items = this.data[collection];
    
    if (Object.keys(query).length > 0) {
      items = items.filter(item => {
        return Object.keys(query).every(key => {
          return item[key] === query[key];
        });
      });
    }
    
    return items;
  }

  async findById(collection, id) {
    return this.data[collection].find(item => item.id === id);
  }

  async findOne(collection, query) {
    return this.data[collection].find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  async update(collection, id, updates) {
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;

    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.save();
    return this.data[collection][index];
  }

  async delete(collection, id) {
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data[collection].splice(index, 1);
    await this.save();
    return true;
  }

  // Debug utilities
  async getStats() {
    return {
      users: this.data.users.length,
      books: this.data.books.length,
      sessions: this.data.sessions.length,
      lastUpdated: new Date().toISOString()
    };
  }

  async backup() {
    const backupPath = this.filePath.replace('.json', `-backup-${Date.now()}.json`);
    await fs.writeFile(backupPath, JSON.stringify(this.data, null, 2));
    return backupPath;
  }

  async reset() {
    this.data = { users: [], books: [], sessions: [] };
    await this.save();
    return true;
  }
}

module.exports = new JSONDatabase();