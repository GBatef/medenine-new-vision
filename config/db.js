// config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // Charge les variables du .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected: Success');
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;