const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: String, required: true }, // This is the discounted price
    originalPrice: { type: String }, // This is the original price, if available
    link: { type: String, required: true },
    image: { type: String, required: true },
    source: { type: String, required: true }, // e.g., Amazon, Flipkart, etc.
    dateAdded: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
