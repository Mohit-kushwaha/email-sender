const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials and region
AWS.config.update({
    accessKeyId: 'AKIAR7CQT5XKXAEMZIE5',
    secretAccessKey: 'BrBXBei7vK9M4iRgKtgVrkK7T91nRt3DxrS5XVM7',
    region: 'us-east-1',
});

const ses = new AWS.SES();
const pinpoint = new AWS.Pinpoint();

module.exports = { ses, pinpoint };
