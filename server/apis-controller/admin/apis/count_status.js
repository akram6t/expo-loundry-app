const url = process.env.DB_URL;
const { MongoClient } = require('mongodb');

const { Collections, Messages } = require('./../../../Constaints');
const { ApiAuthentication } = require('../../../utils/ApiAuthentication');

async function countOrdersByStatus(req, res) {
  if(!ApiAuthentication(req, res)){
    return res.json({ status: false, message: Messages.wrongApi});
}
  let statusList = [];
  try {
    const client = new MongoClient(url); // Replace with your MongoDB connection URI
    await client.connect();

    const db = client.db(); // Replace with your database name

    const statusesCollection = db.collection(Collections.ORDERSTATUS);

    await statusesCollection.find({}).project({ tag: 1 }).toArray()
    .then((result, err) => {
      statusList = result.map(item => item.tag);
    })

    const ordersCollection = db.collection(Collections.ORDERS);

    const allowedStatuses = [...statusList];

    const counts = await ordersCollection.aggregate([
      {
        $match: { order_status: { $in: allowedStatuses } }
      },
      {
        $group: {
          _id: '$order_status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log(counts);
    res.json({
      message: 'orders status get',
      status: true,
      data:counts
    });

  } catch (error) {
    console.error(error);
    res.json({
      message: 'orders status occur error',
      status: false
    });
  } finally {
  }
}

module.exports = countOrdersByStatus;