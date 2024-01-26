require('dotenv').config();
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');
const sendNotificationToServer = require('./sendNotificationToServer');


const DB_URL = process.env.DB_URL;



router.get('/ordertiming', (req, res) => {
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('order timing...');
        const db = client.db();
        const collection = db.collection(Collections.ORDERTIMING);
        collection.find({}).toArray().then((result, err) => {
            if (err) throw err;
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
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const data = req.body;
    const run = async (order_id) => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('add order...')
        const db = client.db();
        const collection = db.collection(Collections.ORDERS);
        const insertData = { ...data, order_id: order_id, order_date: new Date().toISOString() }
        const result = await collection.insertOne(insertData);

        if (result.insertedId) {
            console.log(result.insertedId);
            const notify = {
                title: 'A new order has been placed.',
                message: `order id: #${order_id} by ${data?.pickup_address?.name}`,
                type: 'order'
            }
            sendNotificationToServer(notify);
            res.json({
                status: true,
                message: 'Order Added successfully',
            });

        } else {
            console.log(result);
            res.json({
                status: false,
                message: 'error',
            });
        }

        client.close();

    }

    // 
    // run();
    const beforeGetDocsCount = async () => {
        const client = new MongoClient(DB_URL);
        const db = client.db();
        const collection = db.collection(Collections.ORDERS);
        const count = await collection.countDocuments();
        // Convert count to a string
        let countString = (count+1).toString();
        // Calculate the number of zeros to add
        let zerosToAdd = Math.max(4 - countString.length, 0);
        // Add leading zeros
        let paddedCount = '0'.repeat(zerosToAdd) + countString;

        run(paddedCount);
    }

    beforeGetDocsCount();

});





router.post('/cancel_order', (req, res) => {
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const {order_id, update_status, cancelReason} = req.body;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('return order...')
        const db = client.db();
        const collection = db.collection(Collections.ORDERS);
        const result = await collection.updateOne(
            { order_id: order_id },
            {
                $set: { order_status: update_status, cancelReason: cancelReason}
            }
            );

        if (result.modifiedCount) {
            console.log(result.modifiedCount);
            const notify = {
                title: 'An order has been Cancelled.',
                message: `order id: #${order_id}`,
                type: 'order'
            }
            sendNotificationToServer(notify);
            res.json({
                status: true,
                message: 'Order cancel successfully',
            });

        } else {
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
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const {skip} = req.query;
    const skipOrder = parseInt(skip);
    const { uid } = req.params;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('orders get...')
        const db = client.db();
        const collection = db.collection(Collections.ORDERS);
        const query = { uid: uid };
        collection.find(query).limit(7).skip(skipOrder).sort({ order_date: -1 }).toArray().then((result, err) => {
            res.send({
                status: true,
                message: 'orders get',
                data: result
            })
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
