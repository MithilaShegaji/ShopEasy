const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    source: { type: String, required: true }, 
    dateAdded: { type: Date, default: Date.now }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
