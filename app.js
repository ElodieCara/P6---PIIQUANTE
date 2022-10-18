const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Ddos = require('ddos');
const ddos = new Ddos;
const helmet = require('helmet');

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

app.use(express.json())
app.use(ddos.express);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

//CORS authorisations
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//enregistrer notre routeur pour toutes les demandes effectuées
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;





