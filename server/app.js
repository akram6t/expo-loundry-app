require('dotenv').config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const userApiRouter = require('./apis/users');
const productsApiRouter = require('./apis/products');
const addressesApiRouter = require('./apis/addresses');
const ordersApiRouter = require('./apis/orders');
const bannersApiRouter = require('./apis/banners');
const servicesApiRouter = require('./apis/services');
const shopsApiRouter = require('./apis/shops');
const orderStatusApiRouter = require('./apis/orderstatus');
const tcApiRouter = require('./apis/tc');
const addonsApiRouter = require('./apis/addons');
const notificationsApiRouter = require('./apis/notification');

const adminApisRouter = require('./admin/adminApis');
const { sendNotification } = require('./utils/CloudMessaging');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const server = http.createServer(app);

const profilesDirectory = path.join(__dirname, 'uploads/profiles');
const mediaDirectory = path.join(__dirname, 'uploads/media');
const iconsDirectory = path.join(__dirname, 'uploads/icons');
app.use('/profiles', express.static(profilesDirectory));
app.use('/media', express.static(mediaDirectory));
app.use('/icons', express.static(iconsDirectory));

app.use('/apis', bannersApiRouter);
app.use('/apis', servicesApiRouter);
app.use('/apis', shopsApiRouter);
app.use('/apis', userApiRouter);
app.use('/apis', productsApiRouter);
app.use('/apis', addressesApiRouter);
app.use('/apis', ordersApiRouter);
app.use('/apis', orderStatusApiRouter);
app.use('/apis', tcApiRouter);
app.use('/apis', addonsApiRouter);
app.use('/apis', notificationsApiRouter);

app.use('/admin/apis', adminApisRouter);

// cloud messaging
app.get('/notify', (req, res) => {
    const { token, title, message } = req.body;
   sendNotification(token, title, message);
});

// start server
server.listen(PORT, () => console.log("Server running in PORT: " + PORT));






