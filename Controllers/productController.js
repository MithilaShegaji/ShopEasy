// // const axios = require('axios');
// // const cheerio = require('cheerio');
// const Product = require('../Models/productModel');
// const Wishlist = require('../Models/wishlistModel');
// const{
//     scrapeFlipkart,
//     scrapeAmazon,
//     scrapeMyntra,
//     scrapeShopClues,
//     scrapeLimeroad,
//     scrapeEbay,
//     scrapeWalmart,
//     scrapeAjio,
//     scrapeTataCliq,
//     scrapeMeesho,
//     scrapeOnlyIn
// } = require('../Controllers/scrapController');
// // Conversion rate from USD to INR (example rate, update as needed)
// const USD_TO_INR = 83;

// // Function to convert price to INR if the price is in USD
// function convertToINR(price) {
//     const parsedPrice = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Extract numeric value

//     // If the price is in USD (i.e., contains "$")
//     if (price.includes('$')) {
//         if (isNaN(parsedPrice)) return '₹0'; // Return ₹0 if invalid
//         return '₹' + (parsedPrice * USD_TO_INR).toLocaleString('en-IN'); // Convert and format as INR
//     }

//     // Return original price if not in USD
//     return price;
// }


// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// // Save product to DB...
// async function saveProductToDB(product) {
//     const newProduct = new Product(product);
//     try {
//         await newProduct.save();
//     } catch (error) {
//         console.error('Error saving product to DB:', error);
//     }
// }


// // Route to handle adding products to wishlist
// async function handleWishlistDisplay(req, res) {
//     const { title, price, link, image, source } = req.body;
//     const newWishlistItem = new Wishlist({ title, price, link, image, source });
//     try {
//         await newWishlistItem.save();
//         return res.status(200).json({ message: 'Item added to wishlist!' });
//     } catch (error) {
//         console.error('Error saving wishlist item:', error.message);
//         return res.status(500).json({ message: 'Error adding item to wishlist.' });
//     }
// };

// // Route to show wishlist
// async function handleWishlistRequest(req, res) {
//     try {
//         const wishlistItems = await Wishlist.find(); // Fetch all items from the wishlist
//         res.render('wishlist', { wishlistItems }); // Render the wishlist view
//     } catch (error) {
//         console.error('Error fetching wishlist items:', error.message);
//         res.status(500).json({ message: 'Error fetching wishlist items.' });
//     }
// };

// // Route to handle product search and results rendering
// async function handleResultsDisplay(req, res) {
//     const productName = req.body.productName;
//     if (!productName) {
//         return res.redirect('/search'); // Redirect if no product specified
//     }

//     // Redirect to GET /results route with query string
//     res.redirect(`/results?productName=${encodeURIComponent(productName)}`);
// };

// // Route to show search results with pagination
// async function handleResultsRequest(req, res) {
//     const productName = req.query.productName || '';
//     const page = parseInt(req.query.page) || 1; // Current page defaults to 1
//     const itemsPerPage = 9; // Number of items per page

//     // Query MongoDB for matching products
//     let productsFromDB = await Product.find({
//         title: new RegExp(productName, 'i'), // Case-insensitive regex search
//     })
//         .skip((page - 1) * itemsPerPage)
//         .limit(itemsPerPage);

//     // Total product count for pagination
//     const totalProductsFromDB = await Product.countDocuments({
//         title: new RegExp(productName, 'i'),
//     });

//     const totalPagesFromDB = Math.ceil(totalProductsFromDB / itemsPerPage);

//     // If no products found in DB or not enough for the current page number,
//     // scrape data from websites...
//     if (productsFromDB.length === 0 || totalProductsFromDB < itemsPerPage * page) {
//         try {
//             // Scrape data from multiple websites
//             const [
//                 flipkartProducts,
//                 amazonProducts,
//                 myntraProducts,
//                 shopCluesProducts,
//                 limeroadProducts,
//                 ebayProducts,
//                 walmartProducts,
//                 ajioProducts,
//                 tataCliqProducts,
//                 meeshoProducts,
//                 onlyInProducts
//             ] = await Promise.all([
//                 scrapeFlipkart(productName),
//                 scrapeAmazon(productName),
//                 scrapeMyntra(productName),
//                 scrapeShopClues(productName),
//                 scrapeLimeroad(productName),
//                 scrapeEbay(productName),
//                 scrapeWalmart(productName),
//                 scrapeAjio(productName),
//                 scrapeTataCliq(productName),
//                 scrapeMeesho(productName),
//                 scrapeOnlyIn(productName)
//             ]);

//             // Combine all scraped products
//             productsFromDB = [
//                 ...flipkartProducts,
//                 ...amazonProducts,
//                 ...myntraProducts,
//                 ...shopCluesProducts,
//                 ...limeroadProducts,
//                 ...ebayProducts,
//                 ...walmartProducts,
//                 ...ajioProducts,
//                 ...tataCliqProducts,
//                 ...meeshoProducts,
//                 ...onlyInProducts
//             ];

//             // Save the scraped products to the DB
//             await Promise.all(productsFromDB.map(saveProductToDB));

//             // Recalculate totalProducts after scraping
//             const totalProductsAfterScraping = productsFromDB.length;

//             // Calculate total pages after scraping
//             const totalPagesAfterScraping = Math.ceil(totalProductsAfterScraping / itemsPerPage);

//             // Fetch the products for the current page again after scraping
//             productsFromDB = productsFromDB.slice((page - 1) * itemsPerPage, page * itemsPerPage);

//             // Use the total pages after scraping
//             res.render('results', {
//                 products: productsFromDB,
//                 productName,
//                 page,
//                 totalPages: totalPagesAfterScraping,
//                 convertToINR
//             });
//         } catch (error) {
//             console.error('Error during scraping:', error.message);
//             res.status(500).json({ message: 'Error during scraping.' });
//         }
//     } else {
//         // Render the results page with the products and pagination info
//         res.render('results', {
//             products: productsFromDB,
//             productName,
//             page,
//             totalPages: totalPagesFromDB,
//             convertToINR
//         });
//     }
// }


// // Exporting the function
// module.exports = {
//     handleWishlistDisplay,
//     handleWishlistRequest,
//     handleResultsDisplay,
//     handleResultsRequest,
// };


const Product = require('../Models/productModel');
const Wishlist = require('../Models/wishlistModel');
const {
    // scrapeFlipkart,
    // scrapeAmazon,
    scrapeMyntra,
    scrapeEbay,
    scrapeAjio,
    scrapeMeesho,
} = require('./scrapeController');

// Conversion rate from USD to INR (update as needed)
const USD_TO_INR = 83;

// Convert price to INR if the price is in USD
function convertToINR(price) {
    const parsedPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (price.includes('$')) {
        if (isNaN(parsedPrice)) return '₹0'; 
        return '₹' + (parsedPrice * USD_TO_INR).toLocaleString('en-IN');
    }
    return price;
}



// Function to save product to DB
async function saveProductToDB(product) {
    const cleanedProduct = {
        title: product.title,
        description: product.description,
        price: convertToINR(product.price),
        originalPrice: product.originalPrice ? convertToINR(product.originalPrice) : null,
        link: product.link,
        image: product.image,
        source: product.source,
    };

    const newProduct = new Product(cleanedProduct);
    try {
        await newProduct.save();
    } catch (error) {
        console.error('Error saving product to DB:', error);
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

// Function to handle product search and results display
async function handleResultsDisplay(req, res) {
    const productName = req.body.productName;
    if (!productName) {
        return res.redirect('/search');
    }
    res.redirect(`/results?productName=${encodeURIComponent(productName)}`);
}

// Function to handle the results page with pagination
async function handleResultsRequest(req, res) {
    const productName = req.query.productName || '';
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 9;

    let productsFromDB = await Product.find({
        title: new RegExp(productName, 'i'),
    })
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);

    const totalProductsFromDB = await Product.countDocuments({
        title: new RegExp(productName, 'i'),
    });

    const totalPagesFromDB = Math.ceil(totalProductsFromDB / itemsPerPage);

    if (productsFromDB.length === 0 || totalProductsFromDB < itemsPerPage * page) {
        try {
            // Scrape data from all websites
            const [
                // flipkartProducts,
                // amazonProducts,
                myntraProducts,
                ebayProducts,
                ajioProducts,
                meeshoProducts,

            ] = await Promise.all([
                // scrapeFlipkart(productName),
                // scrapeAmazon(productName),
                scrapeMyntra(productName),
                scrapeEbay(productName),
                scrapeAjio(productName),
                scrapeMeesho(productName),
            ]);

            // Combine all scraped products
            const allScrapedProducts = [
                // ...flipkartProducts,
                // ...amazonProducts,
                ...myntraProducts,
                ...ebayProducts,
                ...ajioProducts,
                ...meeshoProducts,
            ].map(product => ({
                ...product,
                description: product.description,
                price: convertToINR(product.price),
                originalPrice: product.originalPrice ? convertToINR(product.originalPrice) : null,
            }));

            // Save scraped products to DB
            await Promise.all(allScrapedProducts.map(saveProductToDB));

            // Recalculate total products after scraping
            const totalProductsAfterScraping = allScrapedProducts.length;
            const totalPagesAfterScraping = Math.ceil(totalProductsAfterScraping / itemsPerPage);

            // Slice products for current page
            const productsForCurrentPage = allScrapedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

            res.render('results', {
                products: productsForCurrentPage,
                productName,
                page,
                totalPages: totalPagesAfterScraping,
                convertToINR
            });
        } catch (error) {
            console.error('Error during scraping:', error.message);
            res.status(500).json({ message: 'Error during scraping.' });
        }
    } else {
        res.render('results', {
            products: productsFromDB,
            productName,
            page,
            totalPages: totalPagesFromDB,
            convertToINR
        });
    }
}

// Export the functions
module.exports = {
    handleWishlistDisplay,
    handleWishlistRequest,
    handleResultsDisplay,
    handleResultsRequest,
};
