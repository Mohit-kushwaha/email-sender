const { ses } = require('../utils/awsConfig');

async function sendEmail(req, res)
{
    const { to, subject, message } = req.body;

    // Specify the SES configuration set name
    const configurationSetName = 'my-first-configuration-set'; // Replace with your actual configuration set name

    const sesParams = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Text: {
                    Data: message,
                },
            },
            Subject: {
                Data: subject,
            },
        },
        Source: 'mohitkushwaha4508@gmail.com',
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
