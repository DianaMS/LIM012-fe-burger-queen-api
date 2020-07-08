const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const UsersService = require('../services/usersService');

const { secret } = config;
// const mongoClient = new MongoLib();


/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */

  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }

    //se obtiene la instancia de MongoLib del index.js
    const mongoClient = app.get('mongoClient');
    const usersService = new UsersService(mongoClient);

    // const salt = bcrypt.genSaltSync(10);
    // const passwordEncrypted = bcrypt.hashSync(password, salt);
    // console.log(email, passwordEncrypted);

    const userAuth = await usersService.getUserAuth({ email });

    console.log(userAuth);

    if (userAuth && bcrypt.compareSync(password, userAuth.password)) {
      const userId = userAuth._id;
      const userEmail = userAuth.email;
      const userRol = userAuth.roles;

      const token = jwt.sign({ userId, userEmail, userRol }, secret, {
        expiresIn: 60 * 60 * 24,
      });

      resp.status(200).json({
        email,
        token,
      });
    } else {
      resp.status(400).json({
        message: 'No existe el usuario',
      });
    }
    // TODO: autenticar a la usuarix
    // next();
  });

  return nextMain();
};
