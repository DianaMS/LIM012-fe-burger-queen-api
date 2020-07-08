const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const MongoLib = require('../lib/mongoLib');

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
  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    console.log(email, password)
    // TODO: autenticar a la usuarix
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log(salt, hash)


    const token = jwt.sign({ uid: '123456' }, secret, { expiresIn: 60 * 60 * 24 });

    resp.json({ token });
    // resp.status(200).send({ token });

    next();
  });

  return nextMain();
};
