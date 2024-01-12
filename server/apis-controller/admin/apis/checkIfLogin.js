const { MongoClient } = require('mongodb');
const  { Collections, Messages } = require('../../../Constaints');
const { ApiAuthentication } = require('../../../utils/ApiAuthentication');

const DB_URL = process.env.DB_URL;

const checkIfLogin = async (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const  { authToken }  = req.body;
    
    let client;
    
    try{

    client = new MongoClient(DB_URL);
        
    const collection = client.db().collection(Collections.ADMIN);

    const admin = await collection.find().toArray();

    if(admin[0]?.authToken === authToken){
        res.send({
            status: true,
            isLogined: true,
            message: 'already login'
        })
    }else{
        res.send({
            status: true,
            isLogined: false,
            message: 'auth token expired'
        })
    }

}catch(err){
    console.log(err);
    res.send({
        status: false,
        message: err
    })
}finally{
    client.close();
}

}

module.exports = checkIfLogin;