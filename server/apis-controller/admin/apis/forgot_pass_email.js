const { Resend } = require("resend");

const { MongoClient, ObjectId } = require('mongodb');
const { Collections, Messages } = require('./../../../Constaints');
const uuid = require('uuid');
const path = require('path');
const { ApiAuthentication } = require("../../../utils/ApiAuthentication");


const DB_URL = process.env.DB_URL;
const DOMAIN = process.env.RESEND_EMAIL_DOMAIN;
const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

const forgotPasswordEmail = async (req, res) => {
    if(!ApiAuthentication(req, res)){
        return res.json({ status: false, message: Messages.wrongApi});
    }
    const serverOrigin = `${req.protocol}://${req.get('host')}`;

    const client = new MongoClient(DB_URL);
    const db = client.db();
    const col_store = await db.collection(Collections.SHOPS);
    const col_admin = await db.collection(Collections.ADMIN);
    
    const store = await col_store.find().project({ name: 1 }).toArray();
    const admin = await col_admin.find().toArray();

    const genratedPassword = uuid.v1().slice(0,8).replace('-', '');

    const { data, error } = await resend.emails.send({
        from: `${store[0]?.name} <${DOMAIN ? DOMAIN : 'onboarding@resend.dev'}>`,
        to: [admin[0]?.email],
        subject: `Password Received from ${store[0]?.name}`,
        html: htmlContent({
            adminName: admin[0]?.name,
            password: genratedPassword,
            adminUrl: serverOrigin,
            companyName: store[0]?.name
        }),
    });

    if (error) {
        return res.status(400).json({
            status: false,
            message: error,
        });
    }

    const result = await col_admin.updateOne({ _id: new ObjectId(admin[0]?._id)}, { $set: { password: genratedPassword } });

    if(result.modifiedCount > 0){
        res.status(200).json({
            status: true,
            message: 'Successfully sended password in your email account - ' + admin[0]?.email
        });
    }else{
        res.status(400).json({
            status: false,
            message: "password not generate",
        });
    }

    client.close();

}

module.exports = forgotPasswordEmail;


function htmlContent({companyName, adminName, password, adminUrl}) {
    return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .content {
            color: #333;
        }

        .password-box {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            font-size: 18px;
            margin-top: 10px;
            display: inline-block;
            letter-spacing: 2px;
        }

        .button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            display: inline-block;
            border-radius: 3px;
            margin-top: 20px;
            transition: background-color 0.3s ease-in-out;
        }
    
        .button:hover {
            background-color: #45a049; /* darker shade on hover */
        }
            
        .button:active {
            background-color: #2F7F33; /* darker shade on active */
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="content">
            <h2>Password Reset</h2>
            <p>Hello ${adminName},</p>
            <p>We received a request to reset your password. Your new temporary password is:</p>
            <div class="password-box">${password}</div>
            <p>Please log in using this temporary password and change it immediately through the admin panel.</p>
            <a href="${adminUrl}"><p class="button">Go to Admin Panel</p></a>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>Thank you,</p>
            <p>${companyName}</p>
        </div>
    </div>
</body>
</html>
`
}