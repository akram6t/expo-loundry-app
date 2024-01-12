const { MongoClient } = require('mongodb');
const {Collections} = require('./../../../Constaints')
const { Messages } = require("../../../Constaints");
const { ApiAuthentication } = require( "../../../utils/ApiAuthentication");

const DB_URL = process.env.DB_URL;

const adminNotificationCount = (req, res) => {
        if (!ApiAuthentication(req, res)) {
            return res.json({ status: false, message: Messages.wrongApi });
        }
        const run = async () => {
            const client = new MongoClient(DB_URL);
            await client.connect();
            console.log('admin notification count get...')
            const db = client.db();
            const collection = db.collection(Collections.ADMIN_NOTIFICATIONS);
            const query = { status: 'unread' };
    
            collection.countDocuments({...query}).then((result, err) => {
                res.send({
                    status: true,
                    message: 'admin notifications get',
                    data: result
                })
            }).catch(err => {
                res.send({
                    status: false,
                    message: `${err}`,
                    data: []
                })
            })
    
        }
    
        run();
}

module.exports = adminNotificationCount;