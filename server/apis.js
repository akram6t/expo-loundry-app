const express = require('express');
const { MongoClient } = require('mongodb');
const { Collections } = require('./Constaints');
const router = express.Router();

require('dotenv').config();

const DB_URL = process.env.DB_URL;

router.get('/users', (req, res) => {
    async function run(){
        const client = new MongoClient(DB_URL);
        await client.connect();
        const db = client.db();
        const collection = db.collection(Collections.USERS);
        collection.find({}).toArray().then((result, err) => {
            if (err) throw err;
            res.send({
                status: true,
                mesage: 'user get successfully',
                data: result
            })
        }).catch(err => {
            console.log(err);
            res.send({
                status: false,
                message: err
            })
            client.close();
        });
    }

    run()
})

router.get('/users/:uid', (req, res) => {
    const { uid } = req.params;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('connect...')
        const db = client.db();
        const collection = db.collection(Collections.USERS);
        const query = { _id: uid };
        collection.findOne(query).then((result, err) => {
            res.send({
                status: true,
                message: 'user get',
                data: result
            })
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
                data: {}
            })
        })

    }

    run();
})

router.post('/create_user', (req, res) => {
    const data = req.body;

    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('connect...')
        const db = client.db();
        const collection = db.collection(Collections.USERS);
        const insertData = {_id:data.uid , ...data, createdAt: new Date().toString()}
        const result = await collection.insertOne(insertData);

        if (result.insertedId) {
            console.log(result.insertedId);
            res.json({
                status: true,
                message: 'user created successfully',
            });

        }else{
            console.log(result);
            res.json({
                status: false,
                message: 'error',
            });
        }

        client.close();

    }

    run();

});







router.get('/products/:shopid', (req, res) => {
    const { shopid } = req.params;

    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('get products...')
        const db = client.db();
        const collection = db.collection(Collections.PRODUCTS);
        const query = { shopid: shopid };
        collection.find(query).toArray().then((result, err) => {
            if(err) throw err;
            res.send({
                status: true,
                message: 'get products',
                data: result
            })
            client.close();
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
                data: []
            })
            console.log(err);
            client.close();
        })


    }

    run();

});



router.get('/banners', (req, res) => {
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('connect...');
        const db = client.db();
        const collection = db.collection(Collections.BANNERS);
        collection.find().toArray().then((result, err) => {
            if(err) throw err;
            res.send({
                status: true,
                message: 'get banners',
                data: result
            })
            client.close();
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
                data: []
            })
            console.log(err);
            client.close();
        })


    }

    run();

});




router.get('/services', (req, res) => {
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('get services');
        const db = client.db();
        const collection = db.collection(Collections.SERVICES);
        collection.find().toArray().then((result, err) => {
            if(err) throw err;
            res.send({
                status: true,
                message: 'get services',
                data: result
            })
            client.close();
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
                data: []
            })
            console.log(err);
            client.close();
        })


    }

    run();

});

router.get('/shops', (req, res) => {
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('connect...');
        const db = client.db();
        const collection = db.collection(Collections.SHOPS);
        collection.find({}).sort({ default: -1 }).toArray().then((result, err) => {
            if(err) throw err;
            res.send({
                status: true,
                message: 'get shops',
                data: result
            })
            client.close();
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
                data: []
            })
            console.log(err);
            client.close();
        })
    }
    run();
});

router.get('/ordertiming', (req, res) => {
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('order timing...');
        const db = client.db();
        const collection = db.collection(Collections.ORDERTIMING);
        collection.find({}).toArray().then((result, err) => {
            if(err) throw err;
            res.send({
                status: true,
                message: 'get order timing',
                data: result
            })
            client.close();
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
                data: []
            })
            console.log(err);
            client.close();
        })
    }
    run();
});

router.get('/addresses/:uid', (req, res) => {
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



router.post('/add_order', (req, res) => {
    const data = req.body;

    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('add order...')
        const db = client.db();
        const collection = db.collection(Collections.ORDERS);
        const insertData = {...data, order_date: new Date().toString()}
        const result = await collection.insertOne(insertData);

        if (result.insertedId) {
            console.log(result.insertedId);
            res.json({
                status: true,
                message: 'Order Added successfully',
            });

        }else{
            console.log(result);
            res.json({
                status: false,
                message: 'error',
            });
        }

        client.close();

    }

    run();

});






router.get('/orders/:uid', (req, res) => {
    const { uid } = req.params;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('orders get...')
        const db = client.db();
        const collection = db.collection(Collections.ORDERS);
        const query = { uid: uid };
        collection.find(query).sort({order_date: -1}).toArray().then((result, err) => {
            res.send({
                status: true,
                message: 'orders get',
                data: result
            })
            console.log(result);
        }).catch(err => {
            res.send({
                status: false,
                message: `${err}`,
                data: []
            })
        })

    }

    run();
})










module.exports = router;