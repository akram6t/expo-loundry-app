
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');

const DB_URL = process.env.DB_URL;



router.get('/addresses/:uid', (req, res) => {
  if (!ApiAuthentication(req, res)) {
    return res.json({ status: false, message: Messages.wrongApi });
  }
  const { uid } = req.params;
  const run = async () => {
    const client = new MongoClient(DB_URL);
    await client.connect();
    console.log('addresses get...');
    const db = client.db();
    const collection = db.collection(Collections.ADDRESSES);
    collection.find({ uid: uid }).toArray().then((result, err) => {
      if (err) {
        res.send({
          status: false,
          message: `${err}`,
        })
      } else {
        res.send({
          status: true,
          message: 'get addresses',
          data: result
        })
      }
      client.close();
    })
  }
  run();
});


router.post('/add_address', (req, res) => {
  if (!ApiAuthentication(req, res)) {
    return res.json({ status: false, message: Messages.wrongApi });
  }
  const data = req.body;
  const client = new MongoClient(DB_URL);
  const db = client.db();
  const collection = db.collection(Collections.ADDRESSES);

  collection.insertOne(data).then((result, err) => {
    console.log('insert one');
    if (err) {
      res.status(500).send({ status: false, message: 'Error creating a new address' });
    } else {
      res.send({ status: true, message: 'New Addresses created successfully' });
    }
    client.close();
  });
});

// API endpoint to remove an address object
router.post('/remove_address', (req, res) => {
  if (!ApiAuthentication(req, res)) {
    return res.json({ status: false, message: Messages.wrongApi });
  }
  console.log('remove address');
  const objId = new ObjectId(req.body._id);

  const client = new MongoClient(DB_URL);
  const db = client.db();
  const collection = db.collection(Collections.ADDRESSES);

  // console.log('remove address data is correct');
  collection.deleteOne({_id: objId})
    .then((result, err) => {
      if (err) {
        res.status(500).send({ status: false, message: 'Error removing address from the document' });
      } else {
        res.send({ status: true, message: 'Address removed from the document' });
      }
      client.close();
    }
    );
});



module.exports = router;