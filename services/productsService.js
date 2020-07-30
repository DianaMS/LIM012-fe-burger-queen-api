const MongoLib = require('../db-data/mongoLib');
const config = require('../config');

const { dbName, dbUrl } = config;

class ProductsService {
  constructor() {
    this.collection = 'products';
    this.mongoDB = new MongoLib(dbName, dbUrl);
  }

  async getProducts() {
    // const query = tags && { tags: { $in: tags } };
    const products = await this.mongoDB.getAll(this.collection);
    return products || [];
  }

  async getProductsPag(skip, limit) {
    // const query = tags && { tags: { $in: tags } };
    const products = await this.mongoDB.getForPagination(this.collection, skip, limit);
    return products || [];
  }

  async getProduct({ productId }) {
    try {
      const product = await this.mongoDB.getOne(this.collection, productId);
      return product || null;
    } catch (error) {
      return null;
    }
  }

  async createProduct({ product }) {
    const createProductId = await this.mongoDB.create(this.collection, product);
    console.log(createProductId)
    console.log('url', dbUrl)
    return createProductId;
  }

  async updateProduct({ productId, product }) {
    const updateProductId = await this.mongoDB.update(this.collection, productId, product);
    return updateProductId;
  }

  async deleteProduct({ productId }) {
    const deleteProductId = await this.mongoDB.delete(this.collection, productId);
    return deleteProductId;
  }
}

module.exports = ProductsService;
