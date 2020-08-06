const { MongoClient, ObjectId } = require('mongodb');

// Disable warming messages of mongoclient
console.warn = () => false;

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
        // eslint-disable-next-line no-unused-expressions
        (error) ? rej(error) : res(this.conectionCliente.db(this.dbName));
      });
    });
  }

  getForPagination(collection, skip, limit) {
    return this.conection().then((db) => {
      const result = db.collection(collection)
        .find().skip(skip).limit(limit)
        .toArray();
      // this.conectionCliente.connect.close();

      return result;
    });
  }

  getAll(collection) {
    return this.conection().then((db) => {
      const result = db.collection(collection).find().toArray();
      // this.conectionCliente.connect.close();
      return result;
    });
  }

  getOne(collection, id) {
    return this.conection().then((db) => {
      const result = db.collection(collection).findOne({ _id: ObjectId(id) });
      // this.conectionCliente.connect.close();

      return result;
    });
  }

  getUserByEmail(collection, emailUser) {
    return this.conection().then((db) => {
      const result = db.collection(collection)
        .findOne({ email: emailUser });

      // this.conectionCliente.connect.close();
      return result;
    });
  }

  create(collection, data) {
    return this.conection().then((db) => {
      const result = db.collection(collection).insertOne(data);
      // this.conectionCliente.connect.close();
      return result;
    })
      .then((result) => result.insertedId);
  }

  update(collection, id, data) {
    return this.conection().then((db) => {
      const result = db.collection(collection)
        .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      // this.conectionCliente.connect.close();
      return result;
    })
      .then((result) => result.upserttedId || id);
  }

  delete(collection, id) {
    return this.conection().then((db) => {
      const result = db.collection(collection)
        .deleteOne({ _id: ObjectId(id) });
      // this.conectionCliente.connect.close();
      return result;
    })
      .then(() => id);
  }
}
module.exports = MongoLib;
