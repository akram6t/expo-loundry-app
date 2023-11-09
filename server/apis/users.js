const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Collections } = require('./../Constaints');
const { MongoClient } = require('mongodb');


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



module.exports = router;