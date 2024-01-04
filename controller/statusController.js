const { ses, pinpoint } = require('../utils/awsConfig');


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
    const { email } = req.params;

    // Get Pinpoint email tracking status
    const pinpointParams = {
        ApplicationId: '8010b8153d3346ba92684851e4f08e52',
        EndTime: new Date(),
        StartTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        EventsRequest: {
            ApplicationId: '8010b8153d3346ba92684851e4f08e52',
            Dimensions: {
                Attributes: {
                    'email.address': [email],
                },
            },
            EventType: ['email_opened', 'email_link_clicked'],
            PageSize: 100,
        },
    };

    try
    {
        const trackingData = await pinpoint.getJourneyExecutionMetrics(pinpointParams).promise();
        res.json({ success: true, trackingData });
    } catch (error)
    {
        console.error('Error getting email tracking status:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { getEmailStatus, getEmailTrackingStatus };
