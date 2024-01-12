require('dotenv').config();
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId, Long } = require('mongodb');

const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');
const sendNotificationToServer = require('./sendNotificationToServer');


const DB_URL = process.env.DB_URL;


router.post('/add_query', (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const data = req.body;

    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('add query...')
        const db = client.db();
        const collection = db.collection(Collections.QUERIES);
        const insertData = { ...data, date: new Date().toISOString() }
        const result = await collection.insertOne(insertData);
        if (result.insertedId) {
            console.log(result.insertedId);
            res.json({
                status: true,
                message: 'Thank you for your feedback.',
            });
            const [ user ] = await db.collection(Collections.USERS).find({ uid: data?.uid }).limit(1).project({ name: 1 }).toArray();
            const notify = {
                title: `Feedback Form - ${user.name}`,
                message: data.query,
                type: 'query'
            }
            sendNotificationToServer(notify);

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

module.exports = router;