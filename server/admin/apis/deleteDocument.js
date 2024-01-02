const { MongoClient } = require('mongodb');

const DB_URL = process.env.DB_URL;
const { ObjectId } = require('mongodb');

async function deleteDocument(req, res) {
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