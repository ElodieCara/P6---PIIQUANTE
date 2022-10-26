const Sauce = require('../models/sauce');
const fs = require('fs')

//Récupérer la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

// Créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
}

//Récupérer une sauce seulement
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    delete sauceObject.userId
    Sauce.findOne({ _id: req.params.id, userId: req.auth.userId })
        .then(sauce => {
            if (!sauce) return res.status(403).json({ message: 'Vous n\'avez pas l\'autorisation' })
            if (req.file) {
                const filename = sauce.imageUrl.replace(`${req.protocol}://${req.get('host')}`, "")
                fs.unlinkSync(__dirname + '/..' + filename)
            }
            Sauce.updateOne({ _id: req.params.id, userId: req.auth.userId }, { ...sauceObject })
                .then(() => res.status(201).json({ message: 'Objet modifié !' }))
                .catch(error => {
                    if (req.file) fs.unlinkSync(__dirname + '/../images/' + req.file.filename)
                    return res.status(403).json({ error })
                });
        })
        .catch(error => {
            if (req.file) fs.unlinkSync(__dirname + '/../images/' + req.file.filename)
            return res.status(403).json({ error })
        });
}

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id, userId: req.auth.userId })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(403).json({ error }))
}

// Liker sauce ou Dislike
exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id, usersLiked: { $ne: req.auth.userId }, usersDisliked: { $ne: req.auth.userId } }, { $inc: { likes: +1 }, $push: { usersLiked: req.auth.userId } })
            .then((result) => {
                if (result.modifiedCount === 0) return res.status(403).json({ message: 'Vous avez déjà like ou dislike la sauce' })
                return res.status(200).json({ message: 'Like ajouté !' })
            })
            .catch(error => res.status(400).json({ error }))
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id, usersLiked: { $ne: req.auth.userId }, usersDisliked: { $ne: req.auth.userId } }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.auth.userId } })
            .then((result) => {
                if (result.modifiedCount === 0) return res.status(403).json({ message: 'Vous avez déjà like ou dislike la sauce' })
                return res.status(200).json({ message: 'Dislike ajouté !' })
            })
            .catch(error => res.status(400).json({ error }))
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.auth.userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: 'Like supprimé !' }))
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.auth.userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: 'Dislike supprimé !' }))
                        .catch(error => res.status(400).json({ error }))
                }
                else return res.status(403).json({ message: 'Vous n\'avez pas like ou dislike la sauce' })
            })
            .catch(error => res.status(400).json({ error }))
    }
}


