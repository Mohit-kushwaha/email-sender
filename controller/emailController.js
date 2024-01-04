const { ses } = require('../utils/awsConfig');
const ejs = require('ejs');
const fs = require('fs/promises');

async function sendEmail(req, res)
{
    const { to, subject, message } = req.body;

    // Specify the SES configuration set name
    const configurationSetName = process.env.CONFIGURATION; // Replace with your actual configuration set name

    // Read the EJS template file
    const template = await fs.readFile('./views/emailTemplate.ejs', 'utf-8');
    // Compile the template
    const compiledTemplate = ejs.compile(template);
    // Render the template with dynamic values
    const renderedTemplate = compiledTemplate({ name: to.split('@')[0], message });

    const sesParams = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Data: renderedTemplate,
                },
            },
            Subject: {
                Data: subject,
            },
        },
        Source: process.env.SOURCEEMAIL,
        ConfigurationSetName: configurationSetName, // Specify the SES configuration set
    };

    try
    {
        const sesData = await ses.sendEmail(sesParams).promise();
        res.json({ success: true, messageId: sesData.MessageId });
    } catch (error)
    {
        console.error('Error sending email:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { sendEmail };
