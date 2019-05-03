const express = require('express');

const router = express.Router();
const db = require('../db');

router.post('/import_purchase', async (req, res) => {
  const purchases = await db.getDb().collection('purchases').find({ name: req.body.name }).toArray();
  res.send(purchases);
});

router.put('/import_purchase', async (req, res) => {
  const collectionPurchase = await db.getDb().collection('purchases');
  const collectionOrders = await db.getDb().collection('orders');
  const purchases = await collectionPurchase.find({ name: req.body.name }).toArray();
  try {
    if (purchases.length) {
      await collectionPurchase.deleteOne({ name: req.body.name });
      await collectionOrders.deleteMany({ nameOfSale: req.body.name });
    }
    await collectionPurchase.insertOne(req.body.purchase);
    await collectionOrders.insertMany(req.body.orders);
  } catch (e) {
    console.log(e);
    res.send('error');
  }
  res.send('OK');
});

module.exports = router;
