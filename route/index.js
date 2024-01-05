const express = require('express');
const router = express.Router();
const { sendEmail, getAllEmail } = require('../controller/emailController');
const { getEmailStatus, getEmailTrackingStatus } = require('../controller/statusController');

// Send email route
router.post('/send-email', sendEmail);
router.get('/getAllEmail', getAllEmail);

// Get email status and tracking status routes
router.get('/email-status/:email', getEmailStatus);
router.post('/ses-event-notification', getEmailTrackingStatus);

module.exports = router;
