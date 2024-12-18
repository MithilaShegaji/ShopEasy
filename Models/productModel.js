const mongoose = require('mongoose');

// Define the product schema
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now, // The date when the product was scraped/added
    }
});

// Create the model from the schema
const Product = mongoose.model('Product', ProductSchema);

// Export the model to use in other files
module.exports = Product;
