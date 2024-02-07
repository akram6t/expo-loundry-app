const { MongoClient, ObjectId } = require('mongodb');
const  { Collections, Messages } = require('../../../Constaints');
const { ApiAuthentication } = require('../../../utils/ApiAuthentication');

const DB_URL = process.env.DB_URL;

const adminLogin = async (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const  { login, password, authToken }  = req.body;
    
    let client;
    
    try{

    client = new MongoClient(DB_URL);
        
    const collection = client.db().collection(Collections.ADMIN);

    const [admin] = await collection.find().toArray();

    const passwordCondition = admin?.tempPassword === "" ? admin?.password === password : (admin?.password === password || admin?.tempPassword === password)

    if((admin?.email === login || admin?.username === login) && passwordCondition){
        res.send({
            status: true,
            message: 'login'
        })
        await collection.updateOne({_id: new ObjectId(admin?._id)},{ $set: { authToken: authToken } })

    }else{
        res.send({
            status: false,
            message: 'Login and Password is Wrong?'
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

module.exports = adminLogin;