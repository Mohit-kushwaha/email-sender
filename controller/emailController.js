const { ses } = require('../utils/awsConfig');
const ejs = require('ejs');
const fs = require('fs/promises');
const xlsx = require('xlsx');

const Email = require('../model/Email');
// async function sendEmail(req, res)
// {
//     const { to, subject, message } = req.body;

//     // Specify the SES configuration set name
//     const configurationSetName = process.env.CONFIGURATION; // Replace with your actual configuration set name

//     // Read the EJS template file
//     const template = await fs.readFile('./views/emailTemplate.ejs', 'utf-8');
//     // Compile the template
//     const compiledTemplate = ejs.compile(template);
//     // Render the template with dynamic values
//     const renderedTemplate = compiledTemplate({ name: to.split('@')[0], message });

//     const sesParams = {
//         Destination: {
//             ToAddresses: [to],
//         },
//         Message: {
//             Body: {
//                 Html: {
//                     Data: renderedTemplate,
//                 },
//             },
//             Subject: {
//                 Data: subject,
//             },
//         },
//         Source: process.env.SOURCEEMAIL,
//         ConfigurationSetName: configurationSetName, // Specify the SES configuration set
//     };

//     try
//     {
//         const sesData = await ses.sendEmail(sesParams).promise();
//         res.json({ success: true, messageId: sesData.MessageId });
//     } catch (error)
//     {
//         console.error('Error sending email:', error.message);
//         res.status(500).json({ success: false, error: error.message });
//     }
// }
async function sendEmail(req, res)
{
    try
    {
        if (!req.files || Object.keys(req.files).length === 0)
        {
            return res.status(400).json({ success: false, error: 'No files were uploaded.' });
        }

        const excelFile = req.files.excelFile;
        const excelFilePath = './uploads/' + excelFile.name;

        // Save the uploaded file
        await excelFile.mv(excelFilePath);

        // Read the Excel file
        const workbook = xlsx.readFile(excelFilePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = xlsx.utils.sheet_to_json(sheet);

        // Specify the SES configuration set name
        const configurationSetName = process.env.CONFIGURATION;

        // Read the EJS template file
        const template = await fs.readFile('./views/emailTemplate.ejs', 'utf-8');
        const compiledTemplate = ejs.compile(template);

        for (const data of excelData)
        {
            const { Recipient, Subject, Message } = data;

            // Render the template with dynamic values
            const renderedTemplate = compiledTemplate({ name: Recipient.split('@')[0], message: Message, greeting: getGreeting() });

            const sesParams = {
                Destination: {
                    ToAddresses: [Recipient],
                },
                Message: {
                    Body: {
                        Html: {
                            Data: renderedTemplate,
                        },
                    },
                    Subject: {
                        Data: Subject,
                    },
                },
                Source: process.env.SOURCEEMAIL,
                ConfigurationSetName: configurationSetName,
            };

            const sesData = await ses.sendEmail(sesParams).promise();

            // Save email details to the database
            const newEmail = new Email({
                messageID: sesData.MessageId,
                recipient: Recipient,
                sender: process.env.SOURCEEMAIL,
                subject: Subject,
                message: Message,
            });

            await newEmail.save();
        }

        res.json({ success: true, message: 'Emails sent successfully' });
    } catch (error)
    {
        console.error('Error sending email:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAllEmail(req, res)
{
    try
    {
        const AllEmail = await Email.find()
        res.json({ AllEmail })
    } catch (error)
    {
        res.json(error).status(500)
    }
}

module.exports = { sendEmail, getAllEmail };


function getGreeting()
{
    const currentTime = new Date().getHours();

    if (currentTime >= 5 && currentTime < 12)
    {
        return "Good morning";
    } else if (currentTime >= 12 && currentTime < 18)
    {
        return "Good afternoon";
    } else
    {
        return "Good evening";
    }
}