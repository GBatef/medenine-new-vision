// middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Fonction middleware qui vérifie si le token est valide
module.exports = function(req, res, next) {
    // 1. Lire le token de l'en-tête (Header) de la requête
    // Le format standard est: Authorization: Bearer <token>
    const token = req.header('Authorization');

    // 2. Vérifier si un token est présent
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }
    
    // Le token reçu est souvent préfixé par "Bearer ". Il faut le retirer.
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    try {
        // 3. Vérifier et décoder le token
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        // 4. Ajouter l'utilisateur décodé à l'objet 'req' 
        // L'ID utilisateur devient accessible dans toutes les routes suivantes via req.user.id
        req.user = decoded.user;
        
        // 5. Passer au middleware/route suivant
        next();
    } catch (err) {
        // Le token n'est pas valide (expiré, falsifié, etc.)
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};