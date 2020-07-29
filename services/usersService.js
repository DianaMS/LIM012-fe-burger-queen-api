const MongoLib = require('../db-data/mongoLib');
const config = require('../config');

const { dbName, dbUrl } = config;

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib(dbName, dbUrl);
  }

  async getUsers() {
    // const query = tags && { tags: { $in: tags } };
    const users = await this.mongoDB.getAll(this.collection);
    return users || [];
  }

  async getUsersPag(skip, limit) {
    // const query = tags && { tags: { $in: tags } };
    const users = await this.mongoDB.getForPagination(this.collection, skip, limit);
    return users || [];
  }

  async getUser({ userId }) {
    try {
      const user = await this.mongoDB.getOne(this.collection, userId);
      return user || null;
    } catch (error) {
      return null;
    }
  }

  async getUserByEmail({ email }) {
    const userAuth = await this.mongoDB.getUserByEmail(this.collection, email);
    return userAuth || null;
  }

  async createUser({ user }) {
    const createUserId = await this.mongoDB.create(this.collection, user);
    return createUserId;
  }

  async updateUser({ userId, user }) {
    const updateUserId = await this.mongoDB.update(this.collection, userId, user);
    return updateUserId;
  }

  async deleteUser({ userId }) {
    const deleteUserId = await this.mongoDB.delete(this.collection, userId);
    return deleteUserId;
  }
}

module.exports = UsersService;
