const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, reqired: true },
    manufacturer: { type: String, reqired: true },
    description: { type: String, reqired: true },
    mainPepper: { type: String, reqired: true },
    imageUrl: { type: String, reqired: true },
    heat: { type: Number, reqired: true },
    likes: { type: Number, reqired: true },
    dislikes: { type: Number, reqired: true },
    usersLiked: { type: [String], reqired: true },
    usersDisliked: { type: [String], reqired: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);
