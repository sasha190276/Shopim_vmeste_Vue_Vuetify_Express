const express = require('express');


const router = express.Router();
// const db = require('../db');
const googleSheets = require('../google_doc_api/index');

router.post('/googlesheets', async (req, res) => {
  console.log('!!!!!!!!!!!!!!!!!!!!');
  try {
    const response = await googleSheets.getSheet(req.body);
    res.send(response);
  } catch (e) {
    res.send(`error${e}`);
  }
});
//
// router.put('/users', async (req, res) => {
//   let result = true;
//   const collectionUsers = await db.getDb().collection('users');
//   try {
//     if (req.body.length) { await collectionUsers.insertMany(req.body); }
//   } catch (e) {
//     result = false;
//   }
//   res.send(result);
// });
//
// router.get('/users', async (req, res) => {
//   let users;
//   try {
//     const resp = await test.getSheet();
//     res.send(resp);
//   } catch (e) {
//     res.send(`error${e}`);
//   }
//   // try {
//   /*  test.getSheet()
//       .then(e => res.send(e))
//       .catch(e => res.send(`error${e}`));*/
//   // console.log(`!!!${users}`);
//   // } catch (e) {
//   //   users = false;
//   // }
//   // res.send(users);
// });

module.exports = router;
