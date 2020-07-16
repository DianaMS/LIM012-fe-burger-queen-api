const jwt = require('jsonwebtoken');
const UsersService = require('../services/usersService');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    const usersService = new UsersService();
    const { userId } = decodedToken;
    const user = await usersService.getUser({ userId });

    if (user && user.email === decodedToken.userEmail
      && user.roles.admin === decodedToken.userRol.admin) {
      req.userDecoded = decodedToken;
      return next();
    }
    return next(401);
  });
};

module.exports.isAuthenticated = (req) => {
  if (req.userDecoded) {
    return true;
  }
  return false;
};


module.exports.isAdmin = (req) => {
  if (req.userDecoded.userRol) {
    return true;
  }
  return false;
};

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
