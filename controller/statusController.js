const { ses } = require('../utils/awsConfig');


async function getEmailStatus(req, res)
{
    try
    {
        // Use getSendStatistics to get overall bounce and delivery status
        const statistics = await ses.getSendStatistics().promise();

        // Extract overall bounce and delivery status
        const overallBounceStatus = statistics.SendDataPoints.reduce(
            (totalBounces, dataPoint) => totalBounces + dataPoint.Bounces,
            0
        );

        const overallComplaintStatus = statistics.SendDataPoints.reduce(
            (totalComplaints, dataPoint) => totalComplaints + dataPoint.Complaints,
            0
        );

        const overallDeliveryStatus = statistics.SendDataPoints.reduce(
            (totalDeliveries, dataPoint) => totalDeliveries + dataPoint.DeliveryAttempts,
            0
        );

        res.json({
            success: true,
            overallDeliveryStatus,
            overallBounceStatus,
            overallComplaintStatus,
        });
    } catch (error)
    {
        console.error('Error getting email status:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getEmailTrackingStatus(req, res)
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
            console.log(message)
        });

        res.end();
    } catch (error)
    {
        console.error('Error handling SES event:', error.message);
        res.status(500).json({ "error": "Error handling SES event" });
    }
}

module.exports = { getEmailStatus, getEmailTrackingStatus };
