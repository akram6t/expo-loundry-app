const { MongoClient } = require("mongodb");
// require("dotenv").config();
// MongoDB connection URL
// const url = process.env.MONGODB;

// Function to establish the MongoDB connection and return a boolean indicating connection status
const connectToMongoDB = (url) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => {
        console.log("Connected to MongoDB");
        client.close();
        console.log("MongoDB connection closed");
        resolve(true, "connected"); // Connection successful
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        resolve(false, error); // Connection failed
      });
  });
};

// Call the connectToMongoDB function
module.exports = connectToMongoDB;
//   .then((isConnected) => {
//     if (isConnected) {
//       // Connection successful, perform further operations
//       console.log('Performing database operations...');
//     } else {
//       // Connection failed, handle accordingly
//       console.log('Unable to connect to MongoDB');
//     }
//   });
