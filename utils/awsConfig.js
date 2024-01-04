const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials and region
AWS.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.ACCESSKEY,
    region: process.env.REGION,
});

const ses = new AWS.SES();

module.exports = { ses };
