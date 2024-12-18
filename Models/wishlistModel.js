const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    title: String,
    price: String,
    link: String,
    image: String,
    source: String,
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
