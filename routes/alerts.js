
const express = require('express');
const router = express.Router();
const n8nAuth = require('../middleware/n8n-auth');
const User = require('../models/User');


router.post('/trigger-alert', n8nAuth, async (req, res) => {
    const { weatherCondition, threshold, alertMessage, targetOccupation } = req.body;

    if (!weatherCondition || !threshold || !alertMessage || !targetOccupation) {
        return res.status(400).json({ msg: 'Missing required alert parameters.' });
    }

    try {
         const targetUsers = await User.find({
            occupation: targetOccupation, // Ex: 'Pêcheur'
            isVerified: true,
        }).select('email firstName phoneNumber city');

        if (targetUsers.length === 0) {
            return res.status(200).json({ 
                msg: `No verified users found for the occupation: ${targetOccupation}.`,
                usersFound: 0
            });
        }


        res.json({
            msg: `Successfully identified ${targetUsers.length} users for alert.`,
            alertData: {
                condition: weatherCondition,
                message: alertMessage,
            },
            targetList: targetUsers 
        });

    } catch (err) {
        console.error('Alert Trigger Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;