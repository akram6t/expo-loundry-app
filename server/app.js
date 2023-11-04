const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 5000;
require('dotenv').config();
const apiRouter = require('./apis');

app.use(cors());
app.use(
bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const server = http.createServer(app);

app.use('/apis', apiRouter);

// const io = new Server(server, {
  // cors: {
    // origin: "*",
    // methods: ["GET", "POST"],
  // },
// });

// io.on("connection", (socket) => {
  // console.log("Connected :" + socket.id);

  // socket.on("message_send", (data) => {
    // console.log(data);
    // io.emit("message_receive", data);
  // });

  // socket.on("disconnect", () => {
    // console.log("client has disconnected: " + socket.id);
  // });
// });

// const url = 'mongodb+srv://user-loundry-app:password-loundry-app@loundry-cluster.oxu6tf8.mongodb.net/loundry-app?retryWrites=true&w=majority';

// async function connectDb(){
// const client = new MongoClient(url);
// await client.connect();
// }

// connectDb()

// app.get('/apis/list_databases', (req, res) => {
//   const { api_key } = req.headers;
//   if(api_key){
//     res.send({key: 'is empty'});
//     return;
//   }
//   const client = new MongoClient(User.mongodbUrl);
//   client.db().admin().listDatabases().then(val => {
//     res.send({key: api_key, db: val.databases});
//   })
  
// });




//  for Signup of this panel
// app.post("/apis/cluster_signup", (req, res) => cluster_signup(req, res, User));
// Login to CLuster
// app.post('/apis/cluster_login', (req, res) => cluster_login(req, res, User));
// Check Auth Token is right
// app.post('/apis/check_authtoken', (req, res) => check_authtoken(req, res, User));
// for check is cluster is signin or signup
// app.get("/apis/cluster_isSignup", (req, res) => cluster_isSignup(req, res, User));
// get auth credential
// app.get("/getuser", (req, res) => res.send(User));
// app.get(check)

// for checking  A MACHINe code of this my machine
// app.get('/machine_code', (req, res) => {
//   const machineCode  = machineId.machineIdSync();
//   res.send({ uniqeCode: machineCode });
// })

// start server
server.listen(PORT, () => console.log("Server running in PORT: " + PORT));
