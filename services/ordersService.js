const MongoLib = require('../db-data/mongoLib');
const config = require('../config');

const { dbName, dbUrl } = config;

class OrdersService {
  constructor() {
    this.collection = 'orders';
    this.mongoDB = new MongoLib(dbName, dbUrl);
  }

  async getOrders() {
    const orders = await this.mongoDB.getAll(this.collection);
    return orders || [];
  }

  async getOrdersPag(skip, limit) {
    const orders = await this.mongoDB.getForPagination(this.collection, skip, limit);
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
