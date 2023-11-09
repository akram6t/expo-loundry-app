const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Collections } = require('./../Constaints');
const { MongoClient } = require('mongodb');


const DB_URL = process.env.DB_URL;



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