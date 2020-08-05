const {
  getOrder,
//   getOrders,
  postOrder,
//   putOrder,
//   deleteOrder,
} = require('../orders');

const {
//   getUser,
  postUser, getUser,
} = require('../users');

const {
//   getProduct,
  postProduct, getProduct,
} = require('../products');
const { resp, next } = require('./utils/parameters');

describe('postOrder', () => {
  it('Debería crear una orden al indicar sus detalles', async () => {
    const user = {
      body: {
        email: 'neli@gmail.com',
        password: '123456',
      },
    };
    const userId = await postUser(user, resp, next);
    console.log('user------------------------------------', userId);

    const product = {
      body: {
        name: 'cafe',
        price: 15,
      },
    };
    const productId = await postProduct(product, resp, next);
    console.log('product', productId);

    const req = {
      body: {
        userId: userId._id,
        client: 'Claudia',
        products: [{
          productId: productId._id,
          qty: 3,
        }],
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'neli@gmail.com',
        userRol: { admin: false },
      },
    };
    const resultOrder = await postOrder(req, resp, next);
    console.log('resulllllllllll', typeof resultOrder.products);
    expect(resultOrder.userId.toString()).toBe(userId._id.toString());
    expect(resultOrder.client).toBe('Claudia');
    expect(resultOrder.products).toStrictEqual([{ product: { _id: productId._id, name: 'cafe', price: 15 }, qty: 3 }]);
    expect(resultOrder.status).toBe('pending');
  });
});
