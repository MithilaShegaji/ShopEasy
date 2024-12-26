const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: String, required: true }, 
    // originalPrice: { type: String }, 
    link: { type: String, required: true },
    image: { type: String, required: true },
    source: { type: String, required: true }, 
    dateAdded: { type: Date, default: Date.now, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
