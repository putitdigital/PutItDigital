const express = require('express');
const router = express.Router();
const { fetchEmails, sendEmail, getMailboxes } = require('../controllers/emailController');

// Fetch emails from inbox
router.post('/fetch', fetchEmails);

// Send email
router.post('/send', sendEmail);

// Get available mailboxes
router.post('/mailboxes', getMailboxes);

module.exports = router;
