const OrdersService = require('../services/ordersService');

const ordersService = new OrdersService();

module.exports = {
  getOrders: async (req, resp, next) => {
    const { tags } = req.query;

    try {
      const orders = await ordersService.getOrders({ tags });
      resp.status(200).json({
        data: orders,
        message: 'orders listed',
      });
    } catch (error) {
      next(error);
    }
  },

  getOrder: async (req, resp, next) => {
    const { orderId } = req.params;

    try {
      const order = await ordersService.getOrder({ orderId });
      if (order === null) {
        next(404);
      }
      resp.status(200).json({
        data: order,
        message: 'ordes retrieved',
      });
    } catch (error) {
      next(error);
    }
  },

  postOrder: async (req, resp, next) => {
    const { body: order } = req;
    if (!req.body.userId || !req.body.products) {
      next(400);
    }

    try {
      const createOrder = await ordersService.createOrder({ order });
      resp.status(201).json({
        data: createOrder,
        message: 'order created',
      });
    } catch (error) {
      next(error);
    }
  },

  putOrder: async (req, resp, next) => {
    const { orderId } = req.params;
    const { body: order } = req;

    if (!req.body.userId || !req.body.products || !req.body.qty || req.body.status !== 'pending'
     || req.body.status !== 'canceled' || req.body.status !== 'delivering') {
      next(400);
    }

    try {
      const updateOrder = await ordersService.updateOrder({ orderId, order });
      console.log(updateOrder);
      resp.status(200).json({
        data: updateOrder,
        message: 'order update',
      });
    } catch (error) {
      next(error);
    }
  },

  deleteOrder: async (req, resp, next) => {
    const { orderId } = req.params;

    try {
      const orderDelete = await ordersService.deleteOrder({ orderId });
      console.log(orderDelete);
      resp.status(200).json({
        data: orderDelete,
        message: ' order delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
