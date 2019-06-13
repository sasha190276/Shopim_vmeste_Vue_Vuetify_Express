const express = require('express');

const router = express.Router();
const db = require('../db');

router.post('/import_purchase', async (req, res) => {
  console.log(req);
  const purchases = await db.getDb().collection('purchases').find({ name: req.body.name }).toArray();
  res.send(purchases);
});

router.put('/import_purchase', async (req, res) => {
  const {
    name, purchase, orders, payments,
  } = req.body;
  payments.forEach((payment) => { payment['Дата учета'] = new Date(payment['Дата учета']); });
  const collectionPurchase = await db.getDb().collection('purchases');
  const collectionOrders = await db.getDb().collection('orders');
  const collectionIncomingPayments = await db.getDb().collection('incomingPayments');
  const collectionOutgoingPayments = await db.getDb().collection('outgoingPayments');
  const incomingPayments = await collectionIncomingPayments.find({ importFrom: name }).toArray();
  const outgoingPayments = await collectionOutgoingPayments.find({ importFrom: name }).toArray();
  const purchases = await collectionPurchase.find({ name }).toArray();
  try {
    if (purchases.length) {
      await collectionPurchase.deleteOne({ name });
      await collectionOrders.deleteMany({ nameOfSale: name });
    }
    if (purchase) await collectionPurchase.insertOne(purchase);
    if (orders.length) await collectionOrders.insertMany(orders);
  } catch (e) {
    console.log(e);
    res.send('error add purchase and orders');
  }

  try {
    if (incomingPayments.length) {
      await collectionIncomingPayments.deleteMany({ importFrom: name });
    }
    if (outgoingPayments.length) {
      await collectionOutgoingPayments.deleteMany({ importFrom: name });
    }
    if (payments.length) {
      await collectionIncomingPayments.insertMany(payments);
      await collectionOutgoingPayments.insertMany(payments);
    }
  } catch (e) {
    res.send('error add payments');
  }
  res.send();
});

module.exports = router;
