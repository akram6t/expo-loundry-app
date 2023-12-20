const { MongoClient } = require('mongodb');
const { Collections } = require('../../Constaints');

const DB_URL = process.env.DB_URL;

async function getData(req, res) {
  try {
    const client = new MongoClient(DB_URL); // Replace with your connection URI
    await client.connect();

    const db = client.db(); // Replace with your database name
    const collection = db.collection(Collections.ORDERS); // Replace with your collection name

    // Specify query, projection, and sort
    const query = {  }; // Example query
    const projection = { _id: 0, name: 1, }; // Fields to include
    const sort = { date: -1 }; // Sort by createdAt in descending order

    const cursor = collection.find(query).project(projection).sort(sort);

    const results = await cursor.toArray();
    console.log(results); // Output: Array of documents matching the query, projection, and sort

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

module.exports = getData;