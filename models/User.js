
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    phoneNumber: { type: String, required: true, unique: true }, 
    isVerified: { type: Boolean, default: false }, 
    
    city: { type: String, required: true },
    occupation: { 
        type: String, 
        required: true,
        enum: ['Médecin', 'Pêcheur', 'Agriculteur', 'Étudiant', 'Sans emploi', 'Autre'] // Définir votre liste initiale
    },
    specializations: [String],
    

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    

    maritalStatus: { 
        type: String, 
        enum: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve', 'Autre'] 
    },
}, {
    timestamps: true
});


UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);