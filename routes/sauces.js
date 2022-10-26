const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');


// Renvoie un tableau de toutes les sauces de la base de données.
router.get('/', auth, sauceCtrl.getAllSauces);
// Capture et enregistre l'image, analyse la sauce transformée en chaîne de caractères et l'enregistre
// dans la base de données en définissant correctement son imageUrl.
router.post('/', auth, multer, sauceCtrl.createSauce);
// Renvoie la sauce avec l’_id fourni.
router.get('/:id', auth, sauceCtrl.getOneSauce);
// mettre à jour
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// supprimer
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Définit le statut « Like » pour l' userId fourni
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;