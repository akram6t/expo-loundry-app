const API_KEY = process.env.API_KEY;

const { Messages } = require('./../Constaints');

function ApiAuthentication(req, res){
    const apikey = req.header('apikey');
        if(apikey !== API_KEY){
            console.log(Messages.wrongApi);
            return false;
            // res.json({
            //     status: false,
            //     message: Messages.wrongApi
            // })
        }else{
            return true;
        }

}

module.exports = { ApiAuthentication }