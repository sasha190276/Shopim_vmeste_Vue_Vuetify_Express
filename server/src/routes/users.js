const express = require('express');
const test = require('../google_doc_api/index');

const router = express.Router();
const db = require('../db');

router.post('/users', async (req, res) => {
  let users;
  try {
    users = await db.getDb().collection('users').find({}).toArray();
  } catch (e) {
    users = false;
  }
  res.send(users);
});

router.put('/users', async (req, res) => {
  let result = true;
  const collectionUsers = await db.getDb().collection('users');
  try {
    if (req.body.length) { await collectionUsers.insertMany(req.body); }
  } catch (e) {
    result = false;
  }
  res.send(result);
});

router.get('/users', async (req, res) => {
  let users;
  try {
    const resp = await test.getSheet();
    res.send(resp);
  } catch (e) {
    res.send(`error${e}`);
  }
  // try {
/*  test.getSheet()
    .then(e => res.send(e))
    .catch(e => res.send(`error${e}`));*/
  // console.log(`!!!${users}`);
  // } catch (e) {
  //   users = false;
  // }
  // res.send(users);
});

module.exports = router;
