const express = require('express');
const countOrdersByStatus = require('./controller/count_status');
const getData = require('./controller/getData');
const router = express();


router.get('/orders_status_count', (req, res) => countOrdersByStatus(req, res));
router.get('/getdata', (req, res) => getData(req, res));


module.exports = router;