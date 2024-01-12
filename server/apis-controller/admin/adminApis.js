const express = require('express');
const countOrdersByStatus = require('./apis/count_status');
const getDataDirectData = require('./apis/getData');
const bodyParser = require('body-parser');
const addIcons = require('./apis/addIcons');
const deleteDocument = require('./apis/deleteDocument');
const postDirectData = require('./apis/postData');
const getDirectData = require('./apis/getData');
const postNotification = require('./apis/postNotifications');
const incomeChart = require('./apis/income_chart');
const router = express();
const forgotPasswordEmail = require('./apis/forgot_pass_email');
const adminNotificationCount = require('./apis/notifications_count');
const checkIfLogin = require('./apis/checkIfLogin');
const adminLogin = require('./apis/adminLogin');

router.use(bodyParser.json())

router.get('/orders_status_count', (req, res) => countOrdersByStatus(req, res));

router.get('/notification_count', (req, res) => adminNotificationCount(req, res));

router.get('/income_chart', (req, res) => incomeChart(req, res));

router.get('/get_list', (req, res) => getDirectData(req, res));

router.post('/post_data', (req, res) => postDirectData(req, res));

router.post('/post_notification', (req, res) => postNotification(req, res));

router.post('/delete_document', (req, res) => deleteDocument(req, res));

router.post('/add_media', (req, res) => addIcons(req, res));
(
router.get('/forgot_password', (req, res) => forgotPasswordEmail(req, res)));


router.post('/check_login',  (req, res) => checkIfLogin(req, res));
router.post('/admin_login',  (req, res) => adminLogin(req, res));


module.exports = router;