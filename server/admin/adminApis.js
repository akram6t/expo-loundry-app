const express = require('express');
const countOrdersByStatus = require('./apis/count_status');
const getDataDirectData = require('./apis/getData');
const bodyParser = require('body-parser');
const router = express();

router.use(bodyParser.json())


router.get('/orders_status_count', (req, res) => countOrdersByStatus(req, res));
router.get('/get_list', (req, res) => getDataDirectData(req, res));


module.exports = router;