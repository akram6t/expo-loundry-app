const { MongoClient } = require('mongodb');

const DB_URL = process.env.DB_URL;
const { ObjectId } = require('mongodb');
const { ApiAuthentication } = require('../../../utils/ApiAuthentication');
const { Messages } = require('../../../Constaints');

async function postDirectData(req, res) {
  if(!ApiAuthentication(req, res)){
    return res.json({ status: false, message: Messages.wrongApi});
}
    // console.log("kdmskd");
    const { data, collection } = req.body;
    console.log(data);
    const client = new MongoClient(DB_URL);
    await client.connect();
    const db = client.db();
    const col = db.collection(collection);
    try {
      if (data._id) {
        // Update existing document
        const filter = { _id: new ObjectId(data._id) };
        delete data._id;
        const update = { $set: { ...data, updatedAt: new Date().toISOString() } }; // Use $set to update fields without overwriting
        const result = await col.updateOne(filter, update);
        console.log('Updated documents:', result.modifiedCount);
        if(result.modifiedCount != 0){
            res.json({
                status: true,
                message: `updated ${collection}`,
            })
        }else{
            res.json({
                status: false,
                message: `not updated ${collection}`,
            })
        }
      } else {
        // Insert new document
        const newDocument = { ...data, date: new Date().toISOString() }; // Create a new document with data
        const result = await col.insertOne(newDocument);
        console.log('Inserted document:', result.insertedId);
        if(result.insertedId){
            res.json({
                status: true,
                message: `${collection} added`
            })
        }else{
            res.json({
                status: false,
                message: `${collection} not added`
            })
        }
      }
    } catch (error) {
      console.error('Error:', error);
      res.json({
        status: false,
        message: `${error.toString()}`
      })
      // Handle errors appropriately, e.g., send error responses
    } finally {
      await client.close();
    }
  }
  

module.exports = postDirectData;