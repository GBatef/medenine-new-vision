// server.js

const express = require('express');
const connectDB = require('./config/db');
require('./config/firebase');
const cors = require('cors');

// Initialiser Express
const app = express();
connectDB();

// Middleware pour le CORS (permet la communication avec Vue.js)
const allowedOrigins = ['http://localhost:8080', 'http://votre-domaine-frontend.netlify.app']; // A MODIFIER PLUS TARD
app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true); 
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));



app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running for Medenine New Vision!');
});

app.use('/api/auth', require('./routes/auth')); 

app.use('/api/user', require('./routes/user'));

app.use('/api/alerts', require('./routes/alerts'));



// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));