require('dotenv').config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

const userApiRouter = require('./apis-controller/client-apis/users');
const productsApiRouter = require('./apis-controller/client-apis/products');
const addressesApiRouter = require('./apis-controller/client-apis/addresses');
const ordersApiRouter = require('./apis-controller/client-apis/orders');
const bannersApiRouter = require('./apis-controller/client-apis/banners');
const servicesApiRouter = require('./apis-controller/client-apis/services');
const shopsApiRouter = require('./apis-controller/client-apis/shops');
const orderStatusApiRouter = require('./apis-controller/client-apis/orderstatus');
const tcApiRouter = require('./apis-controller/client-apis/tc');
const addonsApiRouter = require('./apis-controller/client-apis/addons');
const notificationsApiRouter = require('./apis-controller/client-apis/notification');
const quariesApiRouter = require('./apis-controller/client-apis/queries');

const adminApisRouter = require('./apis-controller/admin/adminApis');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
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
app.use('/apis', quariesApiRouter);

app.use('/admin/apis', adminApisRouter);



// Serve static files from the 'root/client/build' folder
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Handle other routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});



// start server
server.listen(PORT, () => console.log("Server running in PORT: " + PORT));