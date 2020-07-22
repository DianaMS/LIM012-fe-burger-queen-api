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
      const header = pagination('users', page, limit, totalUsers.length);
      // console.log(totalUsers.length);
      // console.log(header);
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
    // let user, query;
    // if (!validateEmail(userId)) {
    //   query = { userId };
    //   user = await usersService.getUser(query)
    // } else {
    //   query = { email: userId };
    //   user = await usersService.getUserByEmail(query);
    // }
    try {
      const user = await usersService.getUser({ userId });
      if(user === null) {
        const byEmail = await usersService.getUserByEmail({ email: userId });
        if (byEmail === null) {
          return next(404);
        }
        resp.status(200).json({
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
      const user = await usersService.getUser({ userId });
      if(user === null) {
        const byEmail = await usersService.getUserByEmail({ email: userId });
        if (byEmail === null) {
          return next(404);
        }
        resp.status(200).json({
          userId: byEmail._id,
          email: byEmail.email,
          roles: byEmail.roles,
        });
      }
      
      if (!validateEmail(user.email)) {
        return next(400);
      }
      const objectUser = await usersService.getUser({ userId });
      if (objectUser === null) {
        return next(404);
      }
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
      if(user === null) {
        const byEmail = await usersService.getUserByEmail({ email: userId });
        if (byEmail === null) {
          return next(404);
        }
        resp.status(200).json({
          userId: byEmail._id,
          email: byEmail.email,
          roles: byEmail.roles,
        });
      }
      const objectUser = await usersService.getUser({ userId });
      if (objectUser === null) {
        return next(404);
      }
      const userDelete = await usersService.deleteUser({ userId });
      resp.status(200).json({
        userId: userDelete,
        email: objectUser.email,
        roles: objectUser.roles,
        message: 'user delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
