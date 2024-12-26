const Wishlist = require('../Models/wishlistModel');
const Product = require('../Models/productModel');
// Function to show wishlist
async function handleWishlistRequest(req, res) {
    try {
        const wishlistItems = await Wishlist.find();
        res.render('wishlist', { wishlistItems });
    } catch (error) {
        console.error('Error fetching wishlist items:', error.message);
        res.status(500).json({ message: 'Error fetching wishlist items.' });
    }
}

// Function to handle wishlist display
async function handleWishlistDisplay(req, res) {
    const { title, price, link, image, source } = req.body;
    const newWishlistItem = new Wishlist({ title, price, link, image, source });
    try {
        await newWishlistItem.save();
        return res.status(200).json({ message: 'Item added to wishlist!' });
    } catch (error) {
        console.error('Error saving wishlist item:', error.message);
        return res.status(500).json({ message: 'Error adding item to wishlist.' });
    }
}


// Controller to toggle wishlist status
const toggleWishlist = async (req, res) => {
  const { productId, isWished } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (isWished) {
      // Add to Wishlist
      const exists = await Wishlist.findOne({ title: product.title });
      if (!exists) {
        await Wishlist.create({
          title: product.title,
          price: product.price,
          link: product.link,
          image: product.image,
          source: product.source,
        });
      }
    } else {
      // Remove from Wishlist
      await Wishlist.deleteOne({ title: product.title });
    }

    res.status(200).json({ message: 'Wishlist updated successfully' });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ message: 'An error occurred while updating the wishlist' });
  }
};



module.exports = {
    handleWishlistDisplay,
    handleWishlistRequest,
    toggleWishlist,

};
