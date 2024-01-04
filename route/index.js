const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controller/emailController');
const { getEmailStatus, getEmailTrackingStatus } = require('../controller/statusController');

// Send email route
router.post('/send-email', sendEmail);

// Get email status and tracking status routes
router.get('/email-status/:email', getEmailStatus);
router.get('/ses-event-notification', getEmailTrackingStatus);

module.exports = router;
