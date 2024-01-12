require('dotenv').config();
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId, Long } = require('mongodb');

const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');


const DB_URL = process.env.DB_URL;


router.post('/remove_notification', (req, res) => {
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const { _id } = req.body;

    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('remove notification...')
        console.log(_id);
        const db = client.db();
        const collection = db.collection(Collections.NOTIFICATIONS);
        const result = await collection.deleteOne({ _id: new ObjectId(_id) });

        if (result.deletedCount === 1) {
            console.log(result);
            res.json({
                status: true,
                message: 'notification remove successfully',
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
    run();

});





router.post('/notification_status', (req, res) => {
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const { _id } = req.body;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log(' notification status ...')
        const db = client.db();
        const collection = db.collection(Collections.NOTIFICATIONS);
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: { status: 'read' }
            }
            );

        if (result.modifiedCount) {
            console.log(result.modifiedCount);
            res.json({
                status: true,
                message: 'Notification Read successfully',
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







router.get('/notifications/:uid', (req, res) => {
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const {skip} = req.query;
    const skipNotification = parseInt(skip);
    const { uid } = req.params;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('orders get...')
        const db = client.db();
        const collection = db.collection(Collections.NOTIFICATIONS);
        const query = { uid: uid };
        collection.find(query).limit(10).skip(skipNotification).sort({ date: -1 }).toArray().then((result, err) => {
            res.send({
                status: true,
                message: 'notifications get',
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

router.get('/notifications_counts/:uid', (req, res) => {
    if (!ApiAuthentication(req, res)) {
        return res.json({ status: false, message: Messages.wrongApi });
    }
    const { uid } = req.params;
    console.log(uid);
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('notification count get...')
        const db = client.db();
        const collection = db.collection(Collections.NOTIFICATIONS);
        const query = { uid: uid, status: 'unread' };

        collection.countDocuments({...query}).then((result, err) => {
            res.send({
                status: true,
                message: 'notifications get',
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