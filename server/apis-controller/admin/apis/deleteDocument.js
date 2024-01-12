const { MongoClient } = require('mongodb');

const DB_URL = process.env.DB_URL;
const { ObjectId } = require('mongodb');
const { Messages } = require('../../../Constaints');
const { ApiAuthentication } = require('../../../utils/ApiAuthentication');

async function deleteDocument(req, res) {
  if(!ApiAuthentication(req, res)){
    return res.json({ status: false, message: Messages.wrongApi});
}
  const { id, collection } = req.body;
  const client = new MongoClient(DB_URL); // Replace with your connection URI
  await client.connect();
  try {

    const db = client.db(); // Replace with your database name
    const col = db.collection(collection); // Replace with your collection name

    await col.deleteOne({_id: new ObjectId(id)}).then((result, err) => {
      if(err) throw err;
      res.send({
        status: true,
        message: `${collection} docs delete`,
      });
    })

  } catch (error) {
    console.error(error);
    client.close();
    res.json({
      status: false,
      message: `${error}`
    })
  } finally {
    client.close();
  }
}

module.exports = deleteDocument;