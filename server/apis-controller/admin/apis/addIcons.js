const path = require("path");
const uuid = require('uuid');
const fs = require('fs');
const { MongoClient } = require("mongodb");
const { Collections, Messages } = require('./../../../Constaints');
const { ApiAuthentication } = require("../../../utils/ApiAuthentication");

const DB_URL = process.env.DB_URL;

const addIcons = async (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const data = req.body;

    if (data.media) {
        const uploadFolderPath1 = path.join('./uploads'); // Assumes 'uploads' folder is in the same directory as your script
        const uploadFolderPath2 = path.join(uploadFolderPath1, 'media'); // Assumes 'uploads' folder is in the same directory as your script
        // const uploadFolderPath2 = path.join(uploadFolderPath1, 'profiles' ); // Assumes 'uploads' folder is in the same directory as your script

        // Create the 'uploads' folder if it doesn't exist
        if (!fs.existsSync(uploadFolderPath1)) {
            fs.mkdirSync(uploadFolderPath1);
        }
        if (!fs.existsSync(uploadFolderPath2)) {
            fs.mkdirSync(uploadFolderPath2);
        }

        const filePath = path.join(uploadFolderPath2, uuid.v1().slice(0, 16).replaceAll('-', '') + '.png');
        fs.writeFile(filePath, data.media, { encoding: 'base64' }, function (err) {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log('File created at:', filePath);
            run({
                media: filePath.replace('uploads', '').replaceAll('\\', '/'), date: new Date().toISOString()
            });
        });
    }
    async function run(data) {
        const client = new MongoClient(DB_URL);
        await client.connect();
        const db = client.db();
        const collection = db.collection(Collections.MEDIA);
        console.log(data);
        const result = await collection.insertOne(data);

        if (result.insertedId) {
            console.log(result.insertedId);
            res.json({
                status: true,
                message: 'media added successfully',
            });

        } else {
            console.log(result);
            res.json({
                status: false,
                message: 'error',
            });
        }

    }

}

module.exports = addIcons;