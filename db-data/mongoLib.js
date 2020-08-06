const { MongoClient, ObjectId } = require('mongodb');

// Disable warming messages of mongoclient
console.warn = () => false;

let INSTANCE_MONGODB = null;

class MongoLib {
  constructor(dbName, dbUrl) {
    this.conectionCliente = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = dbName;
    this.instance = INSTANCE_MONGODB;
    this.db = INSTANCE_MONGODB ? INSTANCE_MONGODB.db(dbName) : null;
  }

  async conection() {
    try {
      const clientConnected = await this.conectionCliente.connect();
      this.instance = clientConnected;
      INSTANCE_MONGODB = clientConnected;

      // eslint-disable-next-line no-console
      console.log('base de datos conectada!!!');
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  async disconnect() {
    try {
      // eslint-disable-next-line no-console
      console.log('desconectando BD');
      if (INSTANCE_MONGODB) this.instance = INSTANCE_MONGODB;
      if (this.instance) await this.instance.close();
    } catch (err) {
      return new Error(err);
    }
  }

  async getForPagination(collection, skip, limit) {
    await this.comprobeConnection();

    const { instance, dbName } = this;

    return instance.db(dbName)
      .collection(collection)
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async getAll(collection) {
    await this.comprobeConnection();

    const { instance, dbName } = this;

    return instance.db(dbName).collection(collection).find().toArray();
  }

  async getOne(collection, id) {
    await this.comprobeConnection();

    const { instance, dbName } = this;

    return instance.db(dbName).collection(collection).findOne({ _id: ObjectId(id) });
  }

  async getUserByEmail(collection, emailUser) {
    await this.comprobeConnection();

    const { instance, dbName } = this;

    return instance.db(dbName).collection(collection).findOne({ email: emailUser });
  }

  async create(collection, data) {
    await this.comprobeConnection();

    const { instance, dbName } = this;

    return instance.db(dbName).collection(collection).insertOne(data)
      .then((result) => result.insertedId);
  }

  async update(collection, id, data) {
    await this.comprobeConnection();

    const { instance, dbName } = this;

    return instance.db(dbName).collection(collection)
      .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
      .then((result) => result.upserttedId || id);
  }

  async delete(collection, id) {
    await this.comprobeConnection();
    const { instance, dbName } = this;

    return instance.db(dbName).collection(collection)
      .deleteOne({ _id: ObjectId(id) }).then(() => id);
  }

  async comprobeConnection() {
    if (!this.instance && INSTANCE_MONGODB) {
      this.instance = INSTANCE_MONGODB;
    }
    if (!this.instance && !INSTANCE_MONGODB) {
      await this.conection();
    }
  }
}

module.exports = MongoLib;
