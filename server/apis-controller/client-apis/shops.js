const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');

const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');

const DB_URL = process.env.DB_URL;


router.get('/shops', (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
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


module.exports = router;