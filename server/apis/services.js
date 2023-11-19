const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Collections } = require('../Constaints');
const { MongoClient } = require('mongodb');


const DB_URL = process.env.DB_URL;


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

module.exports = router;