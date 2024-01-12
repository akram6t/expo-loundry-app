const url = process.env.DB_URL;
const { MongoClient } = require('mongodb');
const { Collections, Messages } = require('./../../../Constaints');
const { ApiAuthentication } = require('../../../utils/ApiAuthentication');

async function incomeChart(req, res) {
  if(!ApiAuthentication(req, res)){
    return res.json({ status: false, message: Messages.wrongApi});
}
  try {
    const client = new MongoClient(url); // Replace with your MongoDB connection URI
    await client.connect();

    const db = client.db(); // Replace with your database name

    const ordersCollection = db.collection(Collections.ORDERS);

    // const allowedStatuses = [...statusList];

    const counts = await ordersCollection.aggregate([
        {
          $match: {
            "order_date": {
              $gte: new Date("2024-01-01T00:00:00.000Z"),
              $lt: new Date("2025-01-01T00:00:00.000Z"),
            },
          },
        },
        {
          $project: {
            year: { $year: "$order_date" },
            month: { $month: "$order_date" },
            amount: { $sum: ["$amount", "$service_fee", { $sum: "$addons.price" }] },
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
          $group: {
            _id: null,
            data: {
              $push: {
                label: {
                  $concat: [
                    { $substr: ["$_id.month", 0, -1] },
                    "-",
                    { $substr: ["$_id.month", -1, 1] },
                  ],
                },
                value: "$totalAmount",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            labels: ["Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sep-Oct", "Nov-Dec"],
            datasets: [
              {
                label: "2024",
                data: "$data",
              },
              {
                label: "Target",
                data: ["11", "20", "89", "149", "150"],
                type: "line",
              },
            ],
          },
        },
      ]).toArray();
      

    console.log(counts);
    res.json({
      message: 'orders income get',
      status: true,
      data:counts
    });

  } catch (error) {
    console.error(error);
    res.json({
      message: 'orders income occur error',
      status: false
    });
  } finally {
  }
}

module.exports = incomeChart;