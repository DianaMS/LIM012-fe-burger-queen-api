const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');

const mongod = new MongoMemoryServer();

class MongoMock {
  async conection() {
    if (!this.conectionCLiente) {
      const uri = await mongod.getUri();
        this.conectionCLiente = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true 
        });
    }

    if (!this.dbName) {
      const db_Name = await mongod.getDbName();
        this.dbName = db_Name;
    }

    return new Promise((res, rej) => {
      this.conectionCLiente.connect((err) => {
        (error) ? rej(error) : res(this.conectionCliente.db(this.dbName)); 
      });
    });
  }

  getForPagination(collection, query, skip, limit) {
    return this.conection().then((db) => db.collection(collection)
      .find(query).skip(skip).limit(limit)
      .toArray());
  }

  getAll(collection, query) {
    return this.conection().then((db) => db.collection(collection).find(query).toArray());
  }

  getOne(collection, id) {
    return this.conection().then((db) => db.collection(collection).findOne({ _id: ObjectId(id) }));
  }

  getUserByEmail(collection, emailUser) {
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

module.export = MongoMock;
