// models/Email.js

const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    messageID: {
        type: String,
        required: true,
    },
    recipient: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    },
    timestamps: {
        type: Date,
        default: Date.now,
    },
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
