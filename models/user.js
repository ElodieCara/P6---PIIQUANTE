//modèle utilisateur
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//on créé un schéma de données qui contient les champs souhaités
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//on exporte le schéma en tant que modèle Mongoose
module.exports = mongoose.model('User', userSchema);
