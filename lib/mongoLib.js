const { MongoClient } = require('mongodb');

class MongoLib {
  constructor(dbName, dbUrl) {
    this.conectionCliente = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = dbName;
  }

  conection() {
    return new Promise((res, rej) => {
      this.conectionCliente.connect((error) => {
        if (error) {
          rej(error);
        }
        console.log('conexion exitosa!!');
        res(this.conectionCliente.db(this.dbName));
      });
    });
  }
}

module.exports = MongoLib;
