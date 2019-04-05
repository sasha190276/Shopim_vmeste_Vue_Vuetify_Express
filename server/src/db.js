const { MongoClient } = require('mongodb');

const state = {
  db: null,
};
module.exports = {
  // connect(url, done) {
  //   if (state.db) return done();
  //   MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  //     if (err) return done(err);
  //     state.db = db.db();
  //     done();
  //   });
  // },
  async connect(url, done) {
    if (state.db) return done();
    try {
      const client = await MongoClient.connect(url, { useNewUrlParser: true });
      state.db = client.db('shopim_vmeste');
      done();
    } catch (err) { done(err); }
  },
  getDb() {
    return state.db;
  },
  async test() {
    console.log('TEST');
    const result = await state.db.collection('headers_of_orders_table').find({}).toArray();
    return result;
  },
};
