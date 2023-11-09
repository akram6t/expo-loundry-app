const express = require('express');
const { MongoClient } = require('mongodb');
const { Collections } = require('./Constaints');
const router = express.Router();

require('dotenv').config();

const DB_URL = process.env.DB_URL;

router.get('/banners', (req, res) => {
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('connect...');
        const db = client.db();
        const collection = db.collection(Collections.BANNERS);
        collection.find().toArray().then((result, err) => {
            if(err) throw err;
            res.send({
                status: true,
                message: 'get banners',
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

router.get('/shops', (req, res) => {
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