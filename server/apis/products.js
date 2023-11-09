

const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Collections } = require('./../Constaints');
const { MongoClient } = require('mongodb');


const DB_URL = process.env.DB_URL;




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

module.exports = router;