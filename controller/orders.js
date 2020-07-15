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
      console.log(objectUserId);

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
      console.log('OrderID: ', orderId);
      const createOrderObject = await ordersService.getOrder({ orderId });
      console.log(createOrderObject);

      const productsAndQuantity = orderedProducts.map((product) => {
        const productFilter = createOrderObject.products
          .filter((element) => element.productId === product._id.toString());
          console.log(productFilter);
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

    if (!req.body.userId || !req.body.products || !req.body.qty || req.body.status !== 'pending'
     || req.body.status !== 'canceled' || req.body.status !== 'delivering') {
      next(400);
    }

    try {
      const updateOrder = await ordersService.updateOrder({ orderId, order });
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
      resp.status(200).json({
        data: orderDelete,
        message: ' order delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
