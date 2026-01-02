
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });

        if (!user) {
            
            return res.status(400).json({ msg: 'Invalid Credentials.' });
        }

        // 2. Comparaison du mot de passe chiffré
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
   
            return res.status(400).json({ msg: 'Invalid Credentials.' });
        }
        
        if (!user.isVerified) {
            return res.status(403).json({ 
                msg: 'Account not verified. Please check your phone for the verification code.',
                requiresVerification: true 
            });
        }


        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 }, 
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    userId: user.id, 
                    firstName: user.firstName,
                    occupation: user.occupation
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



const admin = require('../config/firebase');
router.post('/verify-phone', async (req, res) => {
    const { idToken, phoneNumber } = req.body;

    if (!idToken || !phoneNumber) {
        return res.status(400).json({ msg: 'Missing Firebase ID Token or Phone Number.' });
    }

    try {
       
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        if (decodedToken.phone_number !== phoneNumber) {
            return res.status(401).json({ msg: 'Phone number mismatch with Firebase token.' });
        }

        const user = await User.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { $set: { isVerified: true } },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found in our database.' });
        }

        res.json({ 
            msg: 'Account successfully verified and activated.', 
            user: user 
        });

    } catch (err) {
        console.error('Firebase Verification Error:', err.message);
        res.status(500).json({ msg: 'Verification failed. Token invalid or expired.' });
    }
});


router.get('/test', (req, res) => {
    res.send('Auth router is working!');
});


module.exports = router;