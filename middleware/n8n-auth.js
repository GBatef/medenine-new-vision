// middleware/n8n-auth.js

require('dotenv').config();

module.exports = function(req, res, next) {
    // Lire la clé d'API de l'en-tête X-API-KEY
    const apiKey = req.header('X-API-KEY'); 

    // Vérifier la présence de la clé
    if (!apiKey) {
        return res.status(401).json({ msg: 'Access denied. No API Key provided.' });
    }

    // Vérifier si la clé fournie correspond à la clé secrète du .env
    if (apiKey !== process.env.N8N_API_KEY) {
        return res.status(401).json({ msg: 'Access denied. Invalid API Key.' });
    }

    // La clé est valide, on continue
    next();
};