const { MongoClient, ObjectId } = require('mongodb');

class MongoLib {
  constructor(dbName, dbUrl) {
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
        console.log("conexión comprobada")
        res(this.conectionCliente.db(this.dbName));
      });
    });
  }

  getAll(collection, query) {
    return this.conection().then((db) => db.collection(collection).find(query).toArray());
  }

  getOne(collection, id) {
    return this.conection().then((db) => db.collection(collection).findOne({ _id: ObjectId(id) }));
  }

  getAuth(collection, emailUser) {
    return this.conection().then((db) => db.collection(collection)
      .findOne({ email: emailUser }));
  }

  create(collection, data) {
    return this.conection().then((db) => db.collection(collection).insertOne(data))
      .then((result) => result.insertedId);
  }

  update(collection, id, data) {
    return this.conection().then((db) => db.collection(collection)
      .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true }))
      .then((result) => result.upserttedId || id);
  }

  delete(collection, id) {
    return this.conection().then((db) => db.collection(collection)
      .deleteOne({ _id: ObjectId(id) }))
      .then(() => id);
  }
}

module.exports = MongoLib;
