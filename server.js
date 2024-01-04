// const AWS = require('aws-sdk');
// const Pinpoint = require('aws-sdk/clients/pinpoint');

// // Configure AWS SDK with your credentials and region
// AWS.config.update({
//     accessKeyId: 'AKIAR7CQT5XKXAEMZIE5',
//     secretAccessKey: 'BrBXBei7vK9M4iRgKtgVrkK7T91nRt3DxrS5XVM7',
//     region: 'us-east-1',
// });

// // Create instances of SES and Pinpoint services
// const ses = new AWS.SES();
// const pinpoint = new Pinpoint();
// // Define email parameters for SES
// const sesParams = {
//     Destination: {
//         ToAddresses: ['mohit_203015@saitm.org'],
//     },
//     Message: {
//         Body: {
//             Text: {
//                 Data: 'Hello, this is the body of the email. Visit: https://example.com',
//             },
//         },
//         Subject: {
//             Data: 'Test Email',
//         },
//     },
//     Source: 'mohitkushwaha4508@gmail.com', // Replace with the verified email address or domain
// };

// // Send the email using SES
// ses.sendEmail(sesParams, (sesErr, sesData) =>
// {
//     if (sesErr)
//     {
//         console.error('Error sending email:', sesErr.message);
//     } else
//     {
//         console.log('Email sent successfully:', sesData.MessageId);

//         // Use SES data to track in Pinpoint
//         const pinpointParams = {
//             ApplicationId: '8010b8153d3346ba92684851e4f08e52',
//             MessageRequest: {
//                 Addresses: {
//                     'mohit_203015@saitm.org': {
//                         ChannelType: 'EMAIL',
//                     },
//                 },
//                 MessageConfiguration: {
//                     EmailMessage: {
//                         FromAddress: 'mohitkushwaha4508@gmail.com',
//                         SimpleEmail: {
//                             Subject: {
//                                 Data: 'Test Email',
//                             },
//                             HtmlPart: {
//                                 Data: 'Hello, this is the body of the email. Visit: https://example.com',
//                             },
//                             TextPart: {
//                                 Data: 'Hello, this is the body of the email. Visit: https://example.com',
//                             },
//                         },
//                     },
//                 },
//             },
//         };

//         // Send tracking data to Pinpoint
//         pinpoint.sendMessages(pinpointParams, (pinpointErr, pinpointData) =>
//         {
//             if (pinpointErr)
//             {
//                 console.error('Error sending tracking data to Pinpoint:', pinpointErr.message);
//             } else
//             {
//                 console.log('Tracking data sent to Pinpoint successfully:', pinpointData);
//             }
//         });
//     }


// });


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
// Routes
const indexRouter = require('./route/index');

app.use('/', indexRouter);

app.post('/ses-event-notification', async (req, res) =>
{
    try
    {
        console.log('Received POST request - Headers:', req.headers);
        console.log('Received POST request - Body:', req.body);
        console.log('Received POST request - raw:', req.rawBody);

        // Handle SubscriptionConfirmation
        if (req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation')
        {
            const subscribeURL = req.body.SubscribeURL;

            // Automatically confirm the subscription by making a GET request to the SubscribeURL
            await fetch(subscribeURL);

            console.log('Subscription confirmed:', subscribeURL);
            res.json({ "message": "Subscription confirmed" });
            return;
        }

        // Handle other SES events
        if (req.body && typeof req.body === 'object')
        {
            const sesEvent = req.body;
            console.log('SES Event:', sesEvent);
            res.json({ "message": req.body });
        } else
        {
            throw new Error('Invalid SES event payload');
        }
    } catch (error)
    {
        console.error('Error handling SES event:', error.message);
        res.status(500).json({ "error": "Error handling SES event" });
    }
});



app.listen(port, () =>
{
    console.log(`Server is running on port ${ port }`);
});
