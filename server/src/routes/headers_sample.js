const express = require('express');
// const TABLE_CONF = require('./headers_smpl_import');
// const depHead = require('./depHeaders');

const router = express.Router();
const db = require('../db');

router.get('/headers_sample', async (req, res) => {
  const tableConfig = {};
  tableConfig.headersOfTable = {};
  tableConfig.depForChangeValueHeaders = [];
  const headers = await db.getDb().collection('headers_sample').find({}).toArray();
  headers.forEach((header) => {
    const {
      name, require, content, defValue, depForSetDefault,
    } = { ...header };
    tableConfig.headersOfTable[name] = { require, content, defValue };
    if (depForSetDefault) tableConfig.depForChangeValueHeaders.push(name);
  });
  res.send(tableConfig);
});
router.get('/setHeaders', async (req, res) => {
  // let collection = await db.getDb().collection('temp');
  // console.log(collection);
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
