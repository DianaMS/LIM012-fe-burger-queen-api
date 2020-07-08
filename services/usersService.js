const MongoLib = require('../db-data/mongoLib');

class UsersService {
  constructor(mongoDB) {
    this.collection = 'users';
    this.mongoDB = mongoDB;
  }

  async getUsers({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const users = await this.mongoDB.getAll(this.collection, query);
    return users || [];
  }

  async getUser({ userId }) {
    const user = await this.mongoDB.getOne(this.collection, userId);
    return user || [];
  }

  async getUserAuth({ email }) {
    const userAuth = await this.mongoDB.getAuth(this.collection, email);
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
