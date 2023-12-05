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

app.use(cors());
app.use(
bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const server = http.createServer(app);

const profilesDirectory = path.join(__dirname, 'uploads/profiles');
const iconsDirectory = path.join(__dirname, 'uploads/icons');
app.use('/profiles', express.static(profilesDirectory));
app.use('/icons', express.static(iconsDirectory));

app.use('/apis', bannersApiRouter);
app.use('/apis', servicesApiRouter);
app.use('/apis', shopsApiRouter);
app.use('/apis', userApiRouter);
app.use('/apis', productsApiRouter);
app.use('/apis', addressesApiRouter);
app.use('/apis', ordersApiRouter);
app.use('/apis', orderStatusApiRouter);

// start server
server.listen(PORT, () => console.log("Server running in PORT: " + PORT));
