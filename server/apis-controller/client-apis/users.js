const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const { Collections, Messages } = require('./../../Constaints');
const { ApiAuthentication } = require('./../../utils/ApiAuthentication');
const sendNotificationToServer = require('./../client-apis/sendNotificationToServer');


const DB_URL = process.env.DB_URL;

router.get('/users/:uid', (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const { uid } = req.params;
    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('get user...')
        const db = client.db();
        const collection = db.collection(Collections.USERS);
        const query = { uid: uid };
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
                data: null
            })
        })

    }

    run();
})

router.post('/create_user', (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const data = req.body;

    const run = async () => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('create user...')
        const db = client.db();
        const collection = db.collection(Collections.USERS);
        const insertData = { ...data, status: 'Active', date: new Date().toISOString() }
        const result = await collection.insertOne(insertData);

        if (result.insertedId) {
            console.log(result.insertedId);
            // Add And Send Notification to the admin
            const notify = {
                title: 'A new user has signed up',
                message: `${data?.name} - ${data?.email}`,
                type: 'auth'
            }
            sendNotificationToServer(notify);
            res.json({
                status: true,
                message: 'user created successfully',
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


router.post('/update_user', (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    let data = req.body;
    // console.log(data);

    const run = async (data) => {
        const client = new MongoClient(DB_URL);
        await client.connect();
        console.log('connect...')
        const db = client.db();
        const collection = db.collection(Collections.USERS);
        // const insertData = {_id:data.uid ,    ...data, createdAt: new Date().toString()}
        const result = await collection.updateOne(
            { uid: data.uid },
            { $set: { ...data, updatedAt: new Date().toISOString()} }
        );

        if (result.modifiedCount === 1) {
            console.log(result.modifiedCount);
            res.json({
                status: true,
                message: 'Profile updated successfully',
            });

        } else {
            console.log(result);
            res.json({
                status: false,
                message: 'User not found or profile field not updated',
            });
        }

        client.close();

    }



    if (data.profile) {
        const uploadFolderPath1 = path.join('./uploads'); // Assumes 'uploads' folder is in the same directory as your script
        const uploadFolderPath2 = path.join(uploadFolderPath1, 'profiles' ); // Assumes 'uploads' folder is in the same directory as your script
        // const uploadFolderPath2 = path.join(uploadFolderPath1, 'profiles' ); // Assumes 'uploads' folder is in the same directory as your script

        // Create the 'uploads' folder if it doesn't exist
        if (!fs.existsSync(uploadFolderPath1)) {
            fs.mkdirSync(uploadFolderPath1);
        }
        if (!fs.existsSync(uploadFolderPath2)) {
            fs.mkdirSync(uploadFolderPath2);
        }
        
        const filePath = path.join(uploadFolderPath2, data.uid.slice(0, 8) + '_' + uuid.v1().slice(0,8) + '.jpg');
        fs.writeFile(filePath, data.profile, { encoding: 'base64' }, function (err) {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log('File created at:', filePath);
            run({
                ...data, profile: filePath.replace('uploads', '')
            });
        });
    } else {
        run(data);
    }
    // run();

});



module.exports = router;