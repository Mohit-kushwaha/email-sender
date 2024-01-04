const { sns } = require('../utils/awsConfig');

async function handleEmailEvents(req, res)
{
    const { Type, Message } = req.body;

    if (Type === 'Notification')
    {
        const parsedMessage = JSON.parse(Message);
        console.log('SES Event:', parsedMessage);
        // Process the SES event as needed (e.g., track opens and clicks)
        res.status(200).send('OK');
    } else
    {
        res.status(400).send('Invalid request');
    }
}

module.exports = { handleEmailEvents };
