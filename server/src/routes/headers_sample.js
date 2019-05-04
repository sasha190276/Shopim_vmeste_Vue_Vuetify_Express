const express = require('express');
// const TABLE_CONF = require('./headers_smpl_import');
// const depHead = require('./depHeaders');

const router = express.Router();
const db = require('../db');

router.get('/headers_sample', async (req, res) => {
  const tableConfig = {};
  tableConfig.headersOfTable = {};
  tableConfig.depForChangeValueHeaders = [];
  const headers = await db.getDb().collection('headers_sample').find({}, { fields: { _id: 0 } }).toArray();
  headers.forEach((header) => {
    const {
      name, depForSetDefault,
    } = { ...header };
    tableConfig.headersOfTable[name] = { ...header };
    if (depForSetDefault) tableConfig.depForChangeValueHeaders.push(name);
  });
  res.send(tableConfig);
});
router.put('/headers_sample', async (req, res) => {
  const collection = await db.getDb().collection('headers_sample');
  if (await collection.findOne({ name: req.body.name })) return;
  const result = await collection.insertOne(req.body);
  res.send(result);
});


router.get('/setHeaders', async (req, res) => {
  const collection = await db.getDb().collection('headers_sample');
  //   // const headers = await collection.find({}).toArray();
  //   // headers.forEach((e) => {
  //   //   e.calculate = false;
  //   //   collection.update({ name: e.name }, { $set: { calculate: false } });
  //   // });
  // const myFunc = EJSON.serialize({ func(c) { console.log(c); } });
  // console.log(myFunc);
  collection.insertOne({ name: 'New_3', calculate: a => console.log(a) }, { serializeFunctions: true });
  collection.insertOne({ name: 'New_4', calculate: new Code((a) => { console.log(a); }) });
  // collection.updateOne({ name: 'Итого' }, { $set: { calculate: new Code((a) => { console.log(a); }, (a) => { console.log(a); }) } });
  // const aaa = await collection.findOne({ name: 'Итого' });
  const a = await collection.findOne({ name: 'New' });
  const b = await collection.findOne({ name: 'New_2' });
  // const a = EJSON.deserialize(aaa.calculate);

  // const b = a.code();
  // console.log(b);
  // const result = await collection.updateMany({}, headers, { upsert: true });
  // const myFunc = function (a) { console.log(a); };
  // const result = await collection.findOneAndUpdate({ name: 'Итого' }, { $set: { calculate: myFunc } });
  // console.log(result);
  // await db.getDb().createCollection('headers_sample');
  // const headers = [];
  // for (const key in TABLE_CONF) {
  //   // const header = Object.assign({}, TABLE_CONF[key]);
  //   const header = {};
  //   header.name = key;
  //   Object.assign(header, TABLE_CONF[key]);
  //   header.depForSetDefault = !!depHead.includes(key);
  //   headers.push(header);
  // }
  // const result = await db.getDb().collection('headers_sample').insertMany(headers);
});
module.exports = router;
