const MongoLib = require('../db-data/mongoLib');
const config = require('../config');

const { dbName, dbUrl } = config;

class OrdersService {
  constructor() {
    this.collection = 'orders';
    this.mongoDB = new MongoLib(dbName, dbUrl);
  }

  async getOrders({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const orders = await this.mongoDB.getAll(this.collection, query);
    return orders || [];
  }

  async getOrdersPag({ tags }, skip, limit) {
    const query = tags && { tags: { $in: tags } };
    const orders = await this.mongoDB.getForPagination(this.collection, query, skip, limit);
    return orders || [];
  }

  async getOrder({ orderId }) {
    try {
      const order = await this.mongoDB.getOne(this.collection, orderId);
      return order || null;
    } catch (error) {
      return null;
    }
  }

  async createOrder({ order }) {
    const createOrderId = await this.mongoDB.create(this.collection, order);
    return createOrderId;
  }

  async updateOrder({ orderId, order }) {
    const updateOrderId = await this.mongoDB.update(this.collection, orderId, order);
    return updateOrderId;
  }

  async deleteOrder({ orderId }) {
    const deleteOrderId = await this.mongoDB.delete(this.collection, orderId);
    return deleteOrderId;
  }
}

module.exports = OrdersService;
