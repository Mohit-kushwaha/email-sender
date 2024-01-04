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
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const indexRouter = require('./route/index');

app.use('/', indexRouter);

app.post('/ses-event-notification', async (req, res) =>
{
    try
    {
        var chunks = [];
        req.on('data', function (chunk)
        {
            chunks.push(chunk);
        });
        req.on('end', function ()
        {
            var message = JSON.parse(chunks.join(''));
            console.log(message);

        });
        if (SubscriptionConfirmation.Type === 'SubscriptionConfirmation')
        {
            console.log(SubscriptionConfirmation.SubscribeURL)
            res.json(SubscriptionConfirmation.Type)
        }
        else
        {
            const event = JSON.parse(SubscriptionConfirmation.message)
            res.json(event)
        }
        res.end();
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
