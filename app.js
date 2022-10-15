const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

//importer nouveau routeur
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/auth');
const path = require('path');

// On se connecte à la base de données
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDb réussie !'))
    .catch(() => console.log('Connexion à MongoDb échouée !'))
    ;

//CORS authorisations
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json())

//enregistrer notre routeur pour toutes les demandes effectuées
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;





