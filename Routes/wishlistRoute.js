const express = require('express');
const {handleWishlistDisplay, handleWishlistRequest, toggleWishlist} = require('../Controllers/wishlistController');

const router = express.Router();

router.post('/display', handleWishlistDisplay);

router.get('/request',handleWishlistRequest);

// Route to toggle wishlist
router.post('/toggle', toggleWishlist);



module.exports = router;
