const { ObjectId } = require('mongodb');
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
  
    console.log(decodedToken);
    const usersService = new UsersService();
    const { userId } = decodedToken;

    const user = await usersService.getUser({ userId });
    console.log(user);
    if (user && user.email === decodedToken.userEmail
      && user.roles.admin === decodedToken.userRol.admin) {
      req.userDecoded = decodedToken;
      console.log('solo token');
      return next();
    }

    return next(401);
  });
};


module.exports.isAuthenticated = (req) => {
  if (req.userDecoded) {
    console.log('siiiii se autentico');
    return true;
  }
  console.log('no se autentico');
  return false;
};


module.exports.isAdmin = (req) => {
  // TODO: decidir por la informacion del request si la usuaria es admin
  if (req.userDecoded.userRol) {
    console.log('siiiiii es admin');
    return true;
  }
  console.log('no  es admin ');
  return false;
};


module.exports.requireAuth = (req, resp, next) => {
  console.log('aqui estamos');
  return (
    (!module.exports.isAuthenticated(req))
      ? next(401)
      : next()
  );
};


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
