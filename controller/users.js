const UsersService = require('../services/usersService');

const usersService = new UsersService();

module.exports = {
  getUsers: async (req, resp, next) => {
    const { tags } = req.query;

    try {
      const users = await usersService.getUsers({ tags });
      resp.status(200).json({
        data: users,
        message: 'users listed',
      });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, resp, next) => {
    const { userId } = req.params;

    try {
      const user = await usersService.getUser({ userId });
      resp.status(200).json({
        data: user,
        message: 'user retrieved ',
      });
    } catch (error) {
      next(error);
    }
  },

  postUser: async (req, resp, next) => {
    const { body: user } = req;

    try {
      const createUser = await usersService.createUser({ user });
      resp.status(200).json({
        data: createUser,
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
      const updateUser = await usersService.updateUser({ userId, user });
      resp.status(200).json({
        data: updateUser,
        message: 'user update',
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, resp, next) => {
    const { userId } = req.params;

    try {
      const userDelete = await usersService.deleteUser({ userId });
      resp.status(200).json({
        data: userDelete,
        message: 'user delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
