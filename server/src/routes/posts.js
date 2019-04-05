const express = require('express');

const router = express.Router();
const db = require('../db');

router.get('/posts', async (req, res) => {
  const resp = await db.test();
  res.send(resp);
});
module.exports = router;
