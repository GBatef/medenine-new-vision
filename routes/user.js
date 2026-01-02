// routes/user.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importer le middleware
const User = require('../models/User'); 

// @route   GET /api/user/profile
// @desc    Obtenir les données de l'utilisateur connecté
// @access  Private (Nécessite le token)
router.get('/profile', auth, async (req, res) => {
    try {
        // req.user.id est disponible grâce au middleware 'auth'
        const user = await User.findById(req.user.id).select('-password'); // Exclure le mot de passe du résultat

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;