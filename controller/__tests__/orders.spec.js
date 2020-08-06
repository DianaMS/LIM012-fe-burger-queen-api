const {
  getOrders,
  getOrder,
  postOrder,
  putOrder,
  deleteOrder,
} = require('../orders');

const {
  postUser,
} = require('../users');

const {
  postProduct,
} = require('../products');
const { resp, next } = require('./utils/parameters');

const clearData = async () => {
  const reqGet = {
    query: {
      page: 1,
      limit: 14,
    },
    protocol: 'http',
    path: '/orders',
    get: () => 'localhost:8080',
  };
  const orders = await getOrders(reqGet, resp, next);

  for (let i = 0; i < orders.length; i += 1) {
    const id = {
      params: {
        orderId: orders[i]._id,
      },
    };
    // eslint-disable-next-line no-await-in-loop
    await deleteOrder(id, resp, next);
  }
};

const user = {
  body: {
    email: 'neli@gmail.com',
    password: '123456',
  },
};

const product = {
  body: {
    name: 'cafe',
    price: 15,
  },
};

describe('postOrder', () => {
  it('Debería crear una orden al indicar sus detalles', async () => {
    const user = {
      body: {
        email: 'neli@gmail.com',
        password: '123456',
      },
    };

    const product = {
      body: {
        name: 'cafe',
        price: 15,
      },
    };
    const userId = await postUser(user, resp, next);
    const productId = await postProduct(product, resp, next);
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
    expect(resultOrder.userId.toString()).toBe(userId._id.toString());
    expect(resultOrder.client).toBe('Claudia');
    expect(resultOrder.products).toStrictEqual([{ product: { _id: productId._id, name: 'cafe', price: 15 }, qty: 3 }]);
    expect(resultOrder.status).toBe('pending');
  });

  it('Debería responder 400 cuando no existe userId o productos', async () => {
    const userId = await postUser(user, resp, next);
    const productId = await postProduct(product, resp, next);

    const req1 = {
      body: {
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

    const req2 = {
      body: {
        userId: userId._id,
        client: 'Claudia',
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'neli@gmail.com',
        userRol: { admin: false },
      },
    };
    const resultOrder1 = await postOrder(req1, resp, next);
    const resultOrder2 = await postOrder(req2, resp, next);
    expect(resultOrder1).toBe(400);
    expect(resultOrder2).toBe(400);
  });
});

describe('getOrder', () => {
  it('Debería obtener una orden por su _id', async () => {
    const user = {
      body: {
        email: 'dayana@gmail.com',
        password: '123456',
      },
    };

    const product = {
      body: {
        name: 'sandwich',
        price: 15,
      },
    };
    const userId = await postUser(user, resp, next);
    const productId = await postProduct(product, resp, next);

    const req = {
      body: {
        userId: userId._id,
        client: 'Rosmery',
        products: [{
          productId: productId._id,
          qty: 5,
        }],
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'dayana@gmail.com',
        userRol: { admin: false },
      },
    };
    const order = await postOrder(req, resp, next);
    const reqOrderId = {
      params: {
        orderId: order._id.toString(),
      },
    };
    const resultOrder = await getOrder(reqOrderId, resp, next);
    expect(resultOrder.client).toBe('Rosmery');
  });

  it('Deberia responder 404 cuando el _id no existe', async () => {
    const reqOrderId = {
      params: {
        orderId: '5f20bc539f66ac88d063ca79',
      },
    };
    const resultOrder = await getOrder(reqOrderId, resp, next);
    expect(resultOrder).toBe(404);
  });
});

describe('putOrders', () => {
  it('Deberia actualizar los datos de una orden', async () => {
    const user = {
      body: {
        email: 'emil@gmail.com',
        password: '123456',
      },
    };

    const product = {
      body: {
        name: 'salchipapa',
        price: 15,
      },
    };
    const userId = await postUser(user, resp, next);
    const productId = await postProduct(product, resp, next);

    const newOrder = {
      body: {
        userId: userId._id,
        client: 'Emilia',
        products: [{
          productId: productId._id,
          qty: 5,
        }],
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'emil@gmail.com',
        userRol: { admin: false },
      },
    };
    const order = await postOrder(newOrder, resp, next);
    const req = {
      params: {
        orderId: order._id,
      },
      body: {
        status: 'preparing',
      },
    };

    const resulOrder = await putOrder(req, resp, next);
    expect(resulOrder.status).toBe('preparing');
    expect(resulOrder.client).toBe('Emilia');
  });

  it('Deberia retornar 400 cuando el status no es un estado definido', async () => {
    const user = {
      body: {
        email: 'alin@gmail.com',
        password: '123456',
      },
    };

    const product = {
      body: {
        name: 'salchipapa',
        price: 15,
      },
    };
    const userId = await postUser(user, resp, next);
    const productId = await postProduct(product, resp, next);

    const newOrder = {
      body: {
        userId: userId._id,
        client: 'Emilia',
        products: [{
          productId: productId._id,
          qty: 5,
        }],
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'alin@gmail.com',
        userRol: { admin: false },
      },
    };
    const order = await postOrder(newOrder, resp, next);
    const req = {
      params: {
        orderId: order._id,
      },
      body: {
        status: 'return',
      },
    };

    const resulOrder = await putOrder(req, resp, next);
    expect(resulOrder).toBe(400);
  });
});

describe('deleteOrders', () => {
  it('Debería eliminar una orden con ._id existente', async () => {
    const user = {
      body: {
        email: 'mical@gmail.com',
        password: '123456',
      },
    };

    const product = {
      body: {
        name: 'salchipapa',
        price: 15,
      },
    };
    const userId = await postUser(user, resp, next);
    const productId = await postProduct(product, resp, next);

    const newOrder = {
      body: {
        userId: userId._id,
        client: 'Emir',
        products: [{
          productId: productId._id,
          qty: 5,
        }],
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'mical@gmail.com',
        userRol: { admin: false },
      },
    };
    const order = await postOrder(newOrder, resp, next);
    const req = {
      params: {
        orderId: order._id,
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'emil@gmail.com',
        userRol: { admin: false },
      },
    };

    const resulOrder = await deleteOrder(req, resp, next);
    expect(resulOrder.userId.toString()).toBe(userId._id.toString());
    expect(resulOrder.client).toBe('Emir');
  });

  it('Deberia responder 404 cuando el _id no existe', async () => {
    const reqOrderId = {
      params: {
        orderId: '5f20bc539f667c88d063ca79',
      },
    };
    const resultOrder = await deleteOrder(reqOrderId, resp, next);
    expect(resultOrder).toBe(404);
  });
});

describe('getOrders', () => {
  it('Debería obtener todos los usuarios', async () => {
    await clearData();
    const user = {
      body: {
        email: 'jared@gmail.com',
        password: '123456',
      },
    };

    const product = {
      body: {
        name: 'cafe con leche',
        price: 15,
      },
    };
    const userId = await postUser(user, resp, next);
    const productId = await postProduct(product, resp, next);

    const newOrder = {
      body: {
        userId: userId._id,
        client: 'Yamil',
        products: [{
          productId: productId._id,
          qty: 5,
        }],
      },
      userDecoded: {
        userId: userId._id,
        userEmail: 'jared@gmail.com',
        userRol: { admin: false },
      },
    };
    await postOrder(newOrder, resp, next);
    const reqGet = {
      query: {
        page: 1,
        limit: 14,
      },
      protocol: 'http',
      path: '/orders',
      get: () => 'localhost:8080',
    };
    const result = await getOrders(reqGet, resp, next);
    expect(result.length).toBe(1);
    expect(result[0].client).toBe('Yamil');
  });
});
