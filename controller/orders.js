const OrdersService = require('../services/ordersService');
const UsersService = require('../services/usersService');
const ProductsService = require('../services/productsService');

const ordersService = new OrdersService();
const usersService = new UsersService();
const productsService = new ProductsService();

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
    const { userId } = order;
    const productsArray = order.products;
    const orderedProducts = [];

    try {
      const objectUserId = await usersService.getUser({ userId });

      if (!objectUserId || objectUserId === null || productsArray.length <= 0) {
        return next(400);
      }

      for (let i = 0; i < productsArray.length; i += 1) {
        const { productId } = productsArray[i];
        // eslint-disable-next-line no-await-in-loop
        const objectProduct = await productsService.getProduct({ productId });
        if (objectProduct === null) {
          return next(400);
        }
        orderedProducts.push(objectProduct);
      }

      console.log('Productos ordenados:');
      console.log(orderedProducts);

      order.status = 'pending';
      order.dateEntry = new Date();
      order.dateProcessed = '';
      const orderId = await ordersService.createOrder({ order });
      const createOrderObject = await ordersService.getOrder({ orderId });

      const productsAndQuantity = orderedProducts.map((product) => {
        const productFilter = createOrderObject.products
          .filter((element) => element.productId === product._id.toString());

        return {
          product,
          qty: productFilter[0].qty,
        };
      });

      resp.status(201).json({
        orderId,
        userId: createOrderObject.userId,
        client: createOrderObject.client,
        products: productsAndQuantity,
        status: createOrderObject.status,
        dateEntry: createOrderObject.dateEntry,
        dateProcessed: createOrderObject.dateProcessed,
        message: 'order created',
      });
    } catch (error) {
      next(error);
    }
  },

  putOrder: async (req, resp, next) => {
    const { orderId } = req.params;
    const { body: order } = req;
    const { userId } = order;
    const productsArray = order.products;
    const orderedProducts = [];
    const orderStatus = order.status;

    try {
      const objectUser = await usersService.getUser({ userId });
      if (!objectUser || objectUser === null || productsArray.length <= 0) {
        return next(400);
      }

      for (let i = 0; i < productsArray.length; i += 1) {
        const { productId } = productsArray[i];
        // eslint-disable-next-line no-await-in-loop
        const objectProduct = await productsService.getProduct({ productId });
        if (objectProduct === null) {
          return next(400);
        }
        orderedProducts.push(objectProduct);
      }

      // console.log(orderStatus);
      // if (orderStatus !== 'pending' || orderStatus !== 'canceled'
      //     || orderStatus !== 'delivering' || orderStatus !== 'delivered') {
      //   return next(400);
      // }

      const validateOrderId = await ordersService.getOrder({ orderId });
      if (validateOrderId === null) {
        return next(404);
      }

      const updateOrder = await ordersService.updateOrder({ orderId, order });
      console.log(updateOrder);
      const objectUpdateOrder = await ordersService.getOrder({ orderId });

      const productsAndQuantity = orderedProducts.map((product) => {
        const productFilter = objectUpdateOrder.products
          .filter((element) => element.productId === product._id.toString());

        return {
          product,
          qty: productFilter[0].qty,
        };
      });

      resp.status(200).json({
        orderId: objectUpdateOrder._id,
        userId: objectUpdateOrder.userId,
        client: objectUpdateOrder.client,
        products: productsAndQuantity,
        status: objectUpdateOrder.status,
        dateEntry: objectUpdateOrder.dateEntry,
        dateProcessed: objectUpdateOrder.dateProcessed,
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
      resp.status(200).json({
        data: orderDelete,
        message: ' order delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
