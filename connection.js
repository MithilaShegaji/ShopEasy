const mongoose = require('mongoose');

// MongoDB Connection function
const connectToMongoDB = (uri) => {
    return mongoose.connect(uri)
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
};

module.exports = { connectToMongoDB };
