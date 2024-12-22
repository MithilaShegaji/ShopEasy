const express = require('express');
const router = express.Router();

const{handleWishlistDisplay,handleWishlistRequest, handleResultsDisplay,handleResultsRequest} = require('../Controllers/productController');

router.post('/wishlist', handleWishlistDisplay);
router.get('/wishlist',handleWishlistRequest);
router.post('/results', handleResultsDisplay);
router.get('/results',handleResultsRequest);
module.exports = router;
