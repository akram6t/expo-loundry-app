

const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');

const DB_URL = process.env.DB_URL;




router.get('/products/:shopid', (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const { shopid } = req.params;

    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('get products...')
        const db = client.db();
        const collection = db.collection(Collections.PRODUCTS);
        const query = { shopid: shopid, status: 'Active' };
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

module.exports = router;