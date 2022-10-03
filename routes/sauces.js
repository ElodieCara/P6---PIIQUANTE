const express = require('express');
const Sauce = require('../models/sauce');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');


// Renvoie un tableau de
// toutes les sauces de la base
// de données.
router.get('/', auth, sauceCtrl.getAllSauces);
// Capture et enregistre l'image, analyse la sauce
// transformée en chaîne de caractères et l'enregistre
// dans la base de données en définissant correctement
// son imageUrl. Initialise les likes et dislikes de la sauce à
// 0 et les usersLiked etusersDisliked avec des tableaux vides. 
// router.get('/', multer, sauceCtrl.createSauce);
// // Renvoie la sauce avec l’_id fourni.
// router.get('/:id', auth, sauceCtrl.getOneSauces);


// router.post('/',);

// //mettre à jourS
// router.put('/:id', auth, multer, sauceCtrl.modifySauces);

// //supprimer
// router.delete('/:id', auth, sauceCtrl.deleteSauces);

// // Définit le statut « Like » pour l' userId fourni
// router.post('/api/sauces/:id/like', sauceCtrl.likeSauces);


module.exports = router;