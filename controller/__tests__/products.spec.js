const {
  postProduct,
  getProduct,
  getProducts,
  putProduct,
  deleteProduct,
} = require('../products');
const { resp, next } = require('./utils/parameters');

const clearData = async () => {
  const req = {
    query: {
      page: 1,
      limit: 60,
    },
    protocol: 'http',
    path: '/products',
    get: () => 'localhost:8080',
  };
  const products = await getProducts(req, resp, next);

  for (let i = 0; i < products.length; i += 1) {
    const id = {
      params: {
        productId: products[i]._id.toString(),
      },
    };

    // eslint-disable-next-line no-await-in-loop
    await deleteProduct(id, resp, next);
  }

  await getProducts(req, resp, next);
};

describe('postProduct', () => {
  it('Debería crear un producto al indicar nombre y precio', async () => {
    const req = {
      body: {
        name: 'cafe',
        price: 5,
      },
    };
    const result = await postProduct(req, resp, next);
    expect(result.name).toBe('cafe');
    expect(result.price).toBe(5);
    req.params = { productId: result._id };
    const resultGet = await getProduct(req, resp, next);
    expect(resultGet.name).toBe('cafe');
    expect(resultGet.price).toBe(5);
  });

  it('Debería responder un 400 cuando no se indica el nombre', async () => {
    const req = {
      body: {
        price: 5,
      },
    };
    const result = await postProduct(req, resp, next);
    expect(result).toBe(400);
  });

  it('Debería responder un 400 cuando no se indica el precio', async () => {
    const req = {
      body: {
        name: 'hamburguesa',
      },
    };
    const result = await postProduct(req, resp, next);
    expect(result).toBe(400);
  });

  it('No debería crear un producto si el precio no es tipo Number', async () => {
    const req = {
      body: {
        name: 'hamburguesa',
        price: '15',
      },
    };
    const result = await postProduct(req, resp, next);
    expect(result).toBe(400);
  });
});

describe('getProduct', () => {
  it('Debería obtener un producto por su ._id', async () => {
    const req = {
      body: {
        name: 'kfc',
        price: 19,
      },
    };
    const createProduct = await postProduct(req, resp, next);
    req.params = { productId: createProduct._id };
    const result = await getProduct(req, resp, next);
    expect(result.name).toBe('kfc');
    expect(result.price).toBe(19);
  });

  it('Debería responder 404 si el productId no existe', async () => {
    const req = {
      params: {
        productId: 'no existe',
      },
    };
    const result = await getProduct(req, resp, next);
    expect(result).toBe(404);
  });
});

describe('putProduct', () => {
  it('Debería modificar alguna propiedad del producto con ._id existente', async () => {
    const req = {
      body: {
        name: 'tallarin',
        price: 12,
      },
    };
    const createProduct = await postProduct(req, resp, next);
    const reqModified = {
      params: {
        productId: createProduct._id,
      },
      body: {
        name: 'tallarin',
        price: 18,
      },
    };
    const result = await putProduct(reqModified, resp, next);
    expect(result.price).toBe(18);
  });

  it('Debería responder 400 si no se indica ninguna propiedad a modificar', async () => {
    const req = {
      body: {},
      params: {},
    };
    const result = await putProduct(req, resp, next);
    expect(result).toBe(400);
  });

  it('Debería responder 404 si el producId indicado no existe', async () => {
    const reqModified = {
      params: {
        productId: 'no existe',
      },
      body: {
        name: 'tallarin',
        price: 18,
      },
    };
    const result = await putProduct(reqModified, resp, next);
    expect(result).toBe(404);
  });
});

describe('deleteProduct', () => {
  it('Debería eliminar un producto con ._id existente', async () => {
    const req = {
      body: {
        name: 'batido',
        price: 10,
      },
    };
    const createProduct = await postProduct(req, resp, next);
    req.params = {
      productId: createProduct._id,
    };
    const result = await deleteProduct(req, resp, next);
    expect(result._id).toBe(createProduct._id);
    const result2 = await getProduct(req, resp, next);
    expect(result2).toBe(404);
  });
  it('Debería responder 404 si el productId indicado no existe', async () => {
    const req = {
      body: {
        name: 'carne',
        price: 50,
      },
      params: {
        productId: 'no existe',
      },
    };
    const result = await deleteProduct(req, resp, next);
    expect(result).toBe(404);
  });
});

describe('getProducts', () => {
  it('Debería obtener todos los productos', async () => {
    await clearData();
    const reqProduct = {
      body: {
        name: 'hamburguesa',
        price: 15,
      },
    };
    await postProduct(reqProduct, resp, next);
    const req = {
      query: {
        page: 1,
        limit: 10,
      },
      protocol: 'http',
      path: '/products',
      get: () => 'localhost:8080',
    };
    const result = await getProducts(req, resp, next);

    expect(result.length).toBe(1);
    expect(result[0].price).toBe(15);
    expect(result[0].name).toBe('hamburguesa');
  });

  afterAll(async () => {
    // await connection.close();
  });
});
