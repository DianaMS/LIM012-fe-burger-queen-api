const bcrypt = require('bcrypt');
const UsersService = require('../services/usersService');
const validateEmail = require('./utils/validateEmail');
const { pagination } = require('./utils/pagination');

const usersService = new UsersService();

module.exports = {
  initAdmin: async (app, next) => {
    try {
      const { adminEmail, adminPassword } = app.get('config');
      if (!adminEmail || !adminPassword) {
        return next();
      }

      const user = await usersService.getUserByEmail({ email: adminEmail });
      if (user === null) {
        const adminUser = {
          email: adminEmail,
          password: bcrypt.hashSync(adminPassword, 10),
          roles: { admin: true },
        };

        await usersService.createUser({ user: adminUser });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      next(error);
      // console.log('No se pudo crear un usuario administrador', error);
    }
    next();
  },

  getUsers: async (req, resp, next) => {
    const { tags } = req.query;
    const dataUser = [];
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (limit * page) - limit;

    try {
      const users = await usersService.getUsersPag({ tags }, skip, limit);
      const totalUsers = await usersService.getUsers({ tags });

      pagination('users', page, limit, totalUsers.length);
      users.forEach((user) => {
        const detailsUser = {
          _id: user._id,
          email: user.email,
          roles: user.roles,
        };

        dataUser.push(detailsUser);
      });

      resp.status(200).json(dataUser);
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, resp, next) => {
    const { userId } = req.params;
    const decodedtoken = req.userDecoded;

    try {
      let userObject = null;
      userObject = await usersService.getUser({ userId });
      if (userObject === null) {
        userObject = await usersService.getUserByEmail({ email: userId });
        if (userObject === null) {
          return next(404);
        }
      }

      if (userObject._id.toString() !== decodedtoken.userId && !decodedtoken.userRol.admin) {
        return next(403);
      }

      return resp.status(200).json({
        _id: userObject._id,
        email: userObject.email,
        roles: userObject.roles,
      });
    } catch (error) {
      next(error);
    }
  },

  postUser: async (req, resp, next) => {
    const { body: user } = req;

    try {
      if (!validateEmail(user.email)) {
        return next(400);
      }
      const objectUser = await usersService.getUserByEmail({ email: user.email });
      if (objectUser !== null) {
        return next(403);
      }

      if ((!user.email || !user.password) || (user.password.length < 4)) {
        return next(400);
      }
      const encryptPass = bcrypt.hashSync(user.password, 10);
      user.password = encryptPass;

      if (user.roles === undefined || user.roles === null) {
        user.roles = { admin: false };
      }

      const createUserId = await usersService.createUser({ user });
      resp.status(200).json({
        _id: createUserId,
        email: user.email,
        roles: user.roles,
        message: 'user created',
      });
    } catch (error) {
      next(error);
    }
  },

  putUser: async (req, resp, next) => {
    const { userId } = req.params;
    const { body: user } = req;
    const decodedtoken = req.userDecoded;

    try {
      let userObject = null;

      userObject = await usersService.getUser({ userId });
      if (userObject === null) {
        userObject = await usersService.getUserByEmail({ email: userId });
      }
      if (userObject === null) {
        return next(404);
      }

      if (userObject._id.toString() !== decodedtoken.userId && !decodedtoken.userRol.admin) {
        return next(403);
      }

      if (user.email) {
        if (!validateEmail(user.email)) {
          return next(400);
        }
        userObject.email = user.email;
      }

      if (user.password) {
        if (user.password.length < 4) {
          return next(400);
        }
        const encryptPass = bcrypt.hashSync(user.password, 10);
        userObject.password = encryptPass;
      }

      if (user.roles) {
        if (!decodedtoken.userRol.admin && decodedtoken.userRol.admin !== user.roles.admin) {
          return next(403);
        }
        userObject.roles = user.roles;
      }

      const updateUser = await usersService
        .updateUser({ userId: userObject._id, user: userObject });

      resp.status(200).json({
        _id: updateUser,
        email: userObject.email,
        roles: userObject.roles,
        message: 'user update',
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, resp, next) => {
    const { userId } = req.params;
    const decodedtoken = req.userDecoded;

    try {
      let userObject = null;
      userObject = await usersService.getUser({ userId });
      if (userObject === null) {
        userObject = await usersService.getUserByEmail({ email: userId });
        if (userObject === null) {
          return next(404);
        }
      }

      if (userObject._id.toString() !== decodedtoken.userId && !decodedtoken.userRol.admin) {
        return next(403);
      }

      const userDelete = await usersService.deleteUser({ userId: userObject._id });

      resp.status(200).json({
        _id: userDelete,
        email: userObject.email,
        roles: userObject.roles,
        message: 'user delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
