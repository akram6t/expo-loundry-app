
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Collections, Messages } = require('./../Constaints');
const { MongoClient } = require('mongodb');
const { ApiAuthentication } = require('../utils/ApiAuthentication');


const DB_URL = process.env.DB_URL;



router.get('/addresses/:uid', (req, res) => {
  if(!ApiAuthentication(req, res)){
    return res.json({ status: false, message: Messages.wrongApi});
}
    const { uid } = req.params;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('addresses get...');
        const db = client.db();
        const collection = db.collection(Collections.ADDRESSES);
        collection.findOne({uid: uid}).then((result, err) => {
            if(err) throw err;
            if(!result){
                res.send({
                    status: false,
                    message: 'addresses is null',
                    // data: {}
                })
            }else{
                res.send({
                    status: true,
                    message: 'get addresses',
                    data: result
                })
            }
           
            client.close();
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
            })
            console.log(err);
            client.close();
        })
    }
    run();
});


router.post('/add_address', (req, res) => {
  if(!ApiAuthentication(req, res)){
    return res.json({ status: false, message: Messages.wrongApi});
}
    const client = new MongoClient(DB_URL);
    const db = client.db();
    const collection = db.collection(Collections.ADDRESSES);
    
    console.log('add_address');

    const uid = req.body.uid; // The _id of the document
    const newAddress = req.body.newAddress;   // The address object to add
    console.log(uid);
    console.log('address is: ' + JSON.stringify(newAddress));

    

    if (!uid || !newAddress) {
      return res.status(400).send({ 
        status: true,
        message: 'Missing documentId or newAddress',
        data: {}
       });
    }

    // Check if the document exists
    collection.findOne({ uid: uid}).then((document, err) => {
        console.log('find one');
      if (err) {
        return res.status(500).send({ status: false, message: 'Error checking document' });
      }

      if (!document) {
        // Document not found, create a new one
        const newData = {
          uid: uid,
          addresses: [{...newAddress}]
        };

        collection.insertOne(newData).then((result, err) => {
            console.log('insert one');
          if (err) {
            return res.status(500).send({ status: false, message: 'Error creating a new document' });
          }
          return res.send({ status: true, message: 'New Addresses created successfully' });
        });
      } else {
        // Document found, add the new address to the array
        collection.updateOne(
          { uid: uid },
          { $push: { addresses: {...newAddress} } }).then((document, err) => {
            console.log('update one');
            if (err) {
              return res.status(500).send({ status: false, message: 'Error adding address to the document' });
            }
            return res.send({ status: true, message: 'Address added to the document' });
          }
        );
      }
    });
  });

  // API endpoint to remove an address object
  router.post('/remove_address', (req, res) => {
    if(!ApiAuthentication(req, res)){
      return res.json({ status: false, message: Messages.wrongApi});
  }
    console.log('remove address');
    const uid = req.body.uid;
    const addressToRemove = req.body.addressToRemove;

    const client = new MongoClient(DB_URL);
    const db = client.db();
    const collection = db.collection(Collections.ADDRESSES);

    if (!uid || !addressToRemove) {
      return res.status(400).send({ status:false, message: 'Missing uid or addressToRemove' });
    }

    // console.log('remove address data is correct');
    collection.updateOne(
      { uid: uid },
      { $pull: { addresses: addressToRemove } })
      .then((result, err) => {
        if (err) {
          return res.status(500).send({ status: false, message: 'Error removing address from the document' });
        }

        return res.send({ status: true, message: 'Address removed from the document' });
      }
    );
  });



module.exports = router;