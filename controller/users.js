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
      console.log('No se pudo crear un usuario administrador', error);
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
          userId: user._id,
          email: user.email,
          roles: user.roles,
        };

        dataUser.push(detailsUser);
      });

      resp.status(200).json({
        data: dataUser,
      });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, resp, next) => {
    const { userId } = req.params;

    try {
      const user = await usersService.getUser({ userId });
      if (user === null) {
        const byEmail = await usersService.getUserByEmail({ email: userId });
        if (byEmail === null) {
          return next(404);
        }
        return resp.status(200).json({
          userId: byEmail._id,
          email: byEmail.email,
          roles: byEmail.roles,
        });
      }

      resp.status(200).json({
        userId: user._id,
        email: user.email,
        roles: user.roles,
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

      if (!user.email || !user.password) {
        return next(400);
      }
      const encryptPass = bcrypt.hashSync(user.password, 10);
      user.password = encryptPass;

      if (user.roles === undefined || user.roles === null) {
        user.roles = { admin: false };
      }

      await usersService.createUser({ user });
      resp.status(200).json({
        userId: user._id,
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

    try {
      const userObjeto = await usersService.getUser({ userId });
      if (userObjeto === null) {
        const byEmailObject = await usersService.getUserByEmail({ email: userId });
        if (byEmailObject === null) {
          return next(404);
        }
        if (!validateEmail(user.email)) {
          return next(400);
        }
        const encryptPass = bcrypt.hashSync(user.password, 10);
        user.password = encryptPass;

        const updateUserByEmail = await usersService
          .updateUser({ userId: byEmailObject._id, user });
        return resp.status(200).json({
          userId: updateUserByEmail,
          email: user.email,
          roles: user.roles,
          message: 'user update',
        });
      }

      if (!validateEmail(user.email)) {
        return next(400);
      }

      const encryptPass = bcrypt.hashSync(user.password, 10);
      user.password = encryptPass;

      const updateUser = await usersService.updateUser({ userId, user });
      resp.status(200).json({
        userId: updateUser,
        email: user.email,
        roles: user.roles,
        message: 'user update',
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, resp, next) => {
    const { userId } = req.params;

    try {
      const user = await usersService.getUser({ userId });
      if (user === null) {
        const byEmail = await usersService.getUserByEmail({ email: userId });
        if (byEmail === null) {
          return next(404);
        }
        const userDeleteByEmail = await usersService.deleteUser({ userId: byEmail._id });
        return resp.status(200).json({
          userId: userDeleteByEmail,
          email: byEmail.email,
          roles: byEmail.roles,
          message: 'user delete',
        });
      }

      const userDelete = await usersService.deleteUser({ userId });
      resp.status(200).json({
        userId: userDelete,
        email: user.email,
        roles: user.roles,
        message: 'user delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
