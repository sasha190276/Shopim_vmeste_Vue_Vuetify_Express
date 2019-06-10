const { MongoClient } = require('mongodb');
const mongoSamples = require('./mongo_sample/mongoSamples');


const state = {
  db: null,
};
const dbName = 'shopim_vmeste';
module.exports = {
  async connect(url, done) {
    if (state.db) return done();
    try {
      const client = await MongoClient.connect(url, { useNewUrlParser: true });
      const collections = await client.db(dbName).collections();
      if (!collections.length) {
        Object.keys(mongoSamples).forEach(async (key) => {
          await client.db(dbName).createCollection(key);
          await client.db(dbName).collection(key).insertMany(mongoSamples[key]);
        });
      } else {
        const collectionNames = collections.map(e => e.s.name);
        Object.keys(mongoSamples).forEach(async (key) => {
          if (!collectionNames.includes(key)) {
            await client.db(dbName).createCollection(key);
            await client.db(dbName).collection(key).insertMany(mongoSamples[key]);
          }
        });
      }
      state.db = client.db(dbName);
      done();
    } catch (err) { done(err); }
  },
  getDb() {
    return state.db;
  },
};
