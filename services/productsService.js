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

  async getProduct({ productId }) {
    const product = await this.mongoDB.getOne(this.collection, productId);
    return product || [];
  }

  async createProduct({ product }) {
    const createProductId = await this.mongoDB.create(this.collection, product);
    console.log('createProduct de productService')
    console.log(createProductId)
    console.log(product)
    return createProductId;
  }
}

module.exports = ProductsService;
