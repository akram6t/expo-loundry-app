const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');

const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');


const DB_URL = process.env.DB_URL;


router.get('/orders_status', (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('get order status');
        const db = client.db();
        const collection = db.collection(Collections.ORDERSTATUS);
        collection.find().sort({position: 1}).toArray().then((result, err) => {
            if(err) throw err;
            res.send({
                status: true,
                message: 'get status',
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