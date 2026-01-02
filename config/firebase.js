// config/firebase.js

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccountPath = path.resolve(__dirname, '..', process.env.SERVICE_ACCOUNT_PATH || './firebase-service-account.json');

try {
    // Initialisation de Firebase Admin
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin Initialized: Success');
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error.message);
}

module.exports = admin;