const isDBConnected  = require('./db');

const cluster_signup = (req, res, User) => {
    const { username, password, mongodb, authToken } = req.body;
  if (User.mongodbUrl != "") {
    res.send({ status: false, message: "You are Already Signuped..." });
    return;
  }
  if (!mongodb.includes("mongodb")) {
    res.send({
      status: false,
      message: `You are Mongodb Link is wrong the link start with 'mongodb' not http or any... for example mongodb://192.0.0.1:27017/`,
    });
  } else {
    isDBConnected(mongodb).then((isConnected) => {
      if (isConnected) {
        res.send({ status: true, message: "MongoDb successfully connected" });
        User.mongodbUrl = mongodb;
        User.username = username;
        User.password = password;
        User.token = authToken;
        console.log(JSON.stringify(User));
      } else {
        res.send({
          status: false,
          message:
            "Mongodb URL is not connect,  MongoDb Url is Wrong please check ...",
        });
      }
    });
  }
}


const cluster_login = (req, res, User) => {
    const  { username, password, authToken } = req.body;
    if(User.mongodbUrl == ""){
      res.send({status: false, message: "You Have not Linked Your MongoDB..."});
      return;
    }
    if(username != User.username){
      res.send({status: false, message: "username is wrong..."});
      return;
    }
    if(password != User.password){
      res.send({status: false, message: "password is wrong..."});
      return;
    }
    User.token = authToken;
    res.send({status: true, message: 'Login Successfully...'});
}

 const check_authtoken = (req, res, User) => {
    const { authToken } = req.body;
    if(authToken == User.token){
      res.send({status: true, message: 'Token is ok'});
    }else{
      res.send({status: false, message: 'Your Token is expired please login again'});
    }
 }


 const cluster_isSignup = (req, res, User) => {
    isDBConnected(User.mongodbUrl).then((isConnected, m) => {
        if (isConnected) {
          res.send({
            status: true,
            message: m,
          });
        } else {
          res.send({
            status: false,
            message: m,
          });
        }
      });
 }


 module.exports = { cluster_login, check_authtoken, cluster_isSignup, cluster_signup};

