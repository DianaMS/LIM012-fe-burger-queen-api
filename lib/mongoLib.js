const { MongoClient } = require('mongodb');
// diana
const config = require('../config');

const { dbUrl, dbName } = config;

class MongoLib {
  constructor() {
    this.conectionCliente = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = dbName;
  }

  conection() {
    return new Promise((res, rej) => {
      this.conectionCliente.connect((error) => {
        if (error) {
          rej(error);
        }
        console.log('HolayChau')
        res(this.conectionCliente.db(this.dbName));
      });
    });
  }

  getAll(collection, query) {
    console.log('holaSoYdIANA')
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray();
    });
  }
}

module.exports = MongoLib;
