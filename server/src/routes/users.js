const express = require('express');

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

module.exports = router;
