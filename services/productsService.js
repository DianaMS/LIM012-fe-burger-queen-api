const MongoLib = require('../db-data/mongoLib');
const config = require('../config');

const { dbName, dbUrl } = config;

class ProductsService {
  constructor() {
    this.collection = 'products';
    this.mongoDB = new MongoLib(dbName, dbUrl);
  }

  async getProducts({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const products = await this.mongoDB.getAll(this.collection, query);
    return products || [];
  }
}

module.exports = ProductsService;
