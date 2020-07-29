const {
  postUser,
  getUser,
  putUser,
  deleteUser,
  getUsers,
} = require('../../controller/users');
const { resp, next } = require('./utils/parameters');

describe('postUser', () => {
  it('Debería crear un usuario al indicar email y password', async () => {
    const req = {
      body: {
        email: 'diana@gmail.com',
        password: '123456',
      },
    };
    const result = await postUser(req, resp, next);
    expect(result.email).toBe('diana@gmail.com');
  });

  it('Debería responder 400 cuando el email no es válido', async () => {
    const req = {
      body: {
        email: 'diana@gmail',
        password: '123456',
      },
    };
    const result = await postUser(req, resp, next);
    expect(result).toBe(400);
  });

  it('Debería responder 400 cuando el password es menor a 4 dígitos', async () => {
    const req = {
      body: {
        email: 'admin@gmail.com',
        password: '13',
      },
    };
    const result = await postUser(req, resp, next);
    expect(result).toBe(400);
  });

  it('Debería responder 400 cuando no existe email o password', async () => {
    const req = {
      body: {
        password: '11111',
      },
    };
    const req2 = {
      body: {
        email: 'carla@gmail.com',
      },
    };
    const result = await postUser(req, resp, next);
    const result2 = await postUser(req2, resp, next);
    expect(result).toBe(400);
    expect(result2).toBe(400);
  });

  it('Debería retornar 403 si ya existe usuario con el mismo email', async () => {
    const req = {
      body: {
        email: 'nelida@gmail.com',
        password: '654321',
      },
    };
    const result = await postUser(req, resp, next);
    const result2 = await postUser(req, resp, next);
    expect(result.email).toBe('nelida@gmail.com');
    expect(result2).toBe(403);
  });
});

describe('getUser', () => {
  it('Debería obtener un usuario por su ._id', async () => {
    const req = {
      body: {
        email: 'nati@gmail.com',
        password: '99999',
      },
    };
    const createUser = await postUser(req, resp, next);
    req.params = { userId: createUser._id.toString() };
    req.userDecoded = {
      userId: createUser._id,
      userEmail: 'nati@gmail.com',
      userRol: {
        admin: false,
      },
    };
    const result = await getUser(req, resp, next);
    expect(result.email).toBe('nati@gmail.com');
  });

  it('Debería obtener un usuario por su .email', async () => {
    const req = {
      body: {
        email: 'carlos@gmail.com',
        password: '99999',
      },
    };
    const createUser = await postUser(req, resp, next);
    req.params = { userId: 'carlos@gmail.com' };
    req.userDecoded = {
      userId: createUser._id,
      userEmail: 'carlos@gmail.com',
      userRol: {
        admin: false,
      },
    };
    const result = await getUser(req, resp, next);
    expect(result.email).toBe('carlos@gmail.com');
  });

  it('Debería responder 403 si no es admin o la misma usuaria', async () => {
    const req = {
      body: {
        email: 'admin@gmail.com',
        password: 'changeme',
        roles: {
          admin: true,
        },
      },
    };
    const req2 = {
      body: {
        email: 'noadmin@gmail.com',
        password: 'xxxxx',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    const createUser2 = await postUser(req2, resp, next);
    const reqGet = {
      params: { userId: 'nati@gmail.com' },
    };
    reqGet.userDecoded = {
      userId: createUser2._id,
      userEmail: 'noadmin@gmail.com',
      userRol: {
        admin: false,
      },
    };
    const reqGet2 = {
      params: { userId: 'admin@gmail.com' },
    };
    reqGet2.userDecoded = {
      userId: createUser._id,
      userEmail: 'admin@gmail.com',
      userRol: {
        admin: true,
      },
    };
    const result = await getUser(reqGet, resp, next);
    const result2 = await getUser(reqGet2, resp, next);
    expect(result).toBe(403);
    expect(result2.roles.admin).toBe(true);
  });

  it('Debería retornar 404 si la usuaria solicitada no existe', async () => {
    const req = {
      body: {
        email: 'guada12@gmail.com',
        password: 'uxdesigner',
        roles: {
          admin: false,
        },
      },
    };
    await postUser(req, resp, next);
    const reqGet = {
      params: { userId: 'noexiste' },
    };
    const result = await getUser(reqGet, resp, next);
    expect(result).toBe(404);
  });
});

describe('putProduct', () => {
  it('Debería modificar alguna propiedad del usuario con el ._id existente', async () => {
    const req = {
      body: {
        email: 'lucy@gmail.com',
        password: '11111',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    expect(createUser.email).toBe('lucy@gmail.com');
    const reqPut = {
      params: { userId: createUser._id.toString() },
      body: {
        email: 'lucyla@gmail.com',
        password: '11111',
        roles: {
          admin: false,
        },
      },
    };

    reqPut.userDecoded = {
      userId: createUser._id.toString(),
      userEmail: 'lucy@gmail.com',
      userRol: {
        admin: false,
      },
    };

    const result = await putUser(reqPut, resp, next);
    expect(result.email).toBe('lucyla@gmail.com');
  });

  it('Debería modificar alguna propiedad del usuario con el .email existente', async () => {
    const req = {
      body: {
        email: 'lucy@gmail.com',
        password: '11111',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    expect(createUser.email).toBe('lucy@gmail.com');
    const reqPut = {
      params: { userId: createUser.email },
      body: {
        email: 'lucyla@gmail.com',
        password: '11111',
        roles: {
          admin: false,
        },
      },
    };

    reqPut.userDecoded = {
      userId: createUser._id.toString(),
      userEmail: 'lucy@gmail.com',
      userRol: {
        admin: false,
      },
    };

    const result = await putUser(reqPut, resp, next);
    expect(result.email).toBe('lucyla@gmail.com');
  });

  it('Debería responder 400 si no se indica email o password ', async () => {
    const req = {
      body: {
        email: 'lucy@gmail.com',
        password: '11111',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    expect(createUser.email).toBe('lucy@gmail.com');
    const reqPut = {
      params: { userId: createUser._id.toString() },
      body: {},
    };

    reqPut.userDecoded = {
      userId: createUser._id.toString(),
      userEmail: 'lucy@gmail.com',
      userRol: {
        admin: false,
      },
    };
    const result = await putUser(reqPut, resp, next);
    expect(result).toBe(400);
  });

  it('Debería responder 403 si una usuaria no admin intenta cambiar su rol', async () => {
    const req = {
      body: {
        email: 'hani@gmail.com',
        password: '2222',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    expect(createUser.email).toBe('hani@gmail.com');
    const reqPut = {
      params: { userId: createUser._id.toString() },
      body: {
        email: 'hani@gmail.com',
        password: '2222',
        roles: {
          admin: true,
        },
      },
    };

    reqPut.userDecoded = {
      userId: createUser._id.toString(),
      userEmail: 'hani@gmail.com',
      userRol: {
        admin: false,
      },
    };

    const result = await putUser(reqPut, resp, next);
    expect(result).toBe(403);
  });

  it('Debería responder 404 si la usuaria solicitada no existe', async () => {
    const req = {
      body: {
        email: 'ondal@gmail.com',
        password: '11111',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    expect(createUser.email).toBe('ondal@gmail.com');
    const reqPut = {
      params: { userId: 'noexisto' },
      body: {},
    };
    const result = await putUser(reqPut, resp, next);
    expect(result).toBe(404);
  });
});

describe('deleteUser', () => {

  it('Debería eliminar un producto con ._id existente', async () => {
    const req = {
      body: {
        email: 'becky@gmail.com',
        password: '0101',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    const reqDel = {
      params: {
        userId: createUser._id,
      },
    };

    reqDel.userDecoded = {
      userId: createUser._id.toString(),
      userEmail: 'becky@gmail.com',
      userRol: {
        admin: false,
      },
    };
    const result = await deleteUser(reqDel, resp, next);
    expect(result._id.toString()).toBe(createUser._id.toString());
  });

  it('Debería responder 404 si la usuaria no existe', async () => {
    const req = {
      body: {
        email: 'becky@gmail.com',
        password: '0101',
        roles: {
          admin: false,
        },
      },
    };
    const createUser = await postUser(req, resp, next);
    const reqDel = {
      params: { userId: createUser._id },
    };
    reqDel.userDecoded = {
      userId: createUser._id,
      userEmail: 'becky@gmail.com',
      userRol: {
        admin: false,
      },
    };
    const result = await deleteUser(reqDel, resp, next);
    const reqGet = {
      params: { userId: result._id },
    };
    const result2 = await getUser(reqGet, resp, next)
    expect(result2).toBe(404);
  });
});

describe('getUsers', () => {
  it('Debería obtener todos los usuarios', async () => {
    const req = {
      body: {
        email: 'naranja@gmail.com',
        password: '1010',
        roles: {
          admin: false,
        },
      },
    };
    await postUser(req, resp, next);
    const reqGet = {
      query: {
        page: 1,
        limit: 1,
      },
      protocol: 'http',
      path: '/products',
      get: () => 'localhost:8080',
    };
    const result = await getUsers(reqGet, resp, next);
    expect(result.length).toBe(1);
    expect(result[0].email).toBe('diana@gmail.com');
  });
});
