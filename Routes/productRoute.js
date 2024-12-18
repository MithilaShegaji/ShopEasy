const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../Models/productModel'); 
const Wishlist = require('../Models/wishlistModel'); 
const router = express.Router();

// Conversion rate from USD to INR (example rate, update as needed)
const USD_TO_INR = 83; // Example conversion rate

// Function to convert price to INR
function convertToINR(price) {
    const parsedPrice = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Extract numeric value
    if (isNaN(parsedPrice)) return '₹0'; // Return ₹0 if invalid
    return '₹' + (parsedPrice * USD_TO_INR).toLocaleString('en-IN'); // Convert and format as INR
}

// Scraping function for eBay
async function scrapeEbay(productName) {
    try {
        const response = await axios.get(`https://www.ebay.com/sch/i.html?_nkw=${productName}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        let products = [];
        $('.s-item').each((index, element) => {
            let title = $(element).find('.s-item__title').text().trim();
            let price = $(element).find('.s-item__price').text().trim();
            let link = $(element).find('.s-item__link').attr('href');
            let image = $(element).find('.s-item__image-img').attr('src'); // Get image URL
            if (title && price && link && image) {
                products.push({ title, price, link, image, source: 'eBay' });
            }
        });
        return products;
    } catch (error) {
        console.error('Error scraping eBay:', error.message);
        return [];
    }
}

// Scraping function for Walmart
async function scrapeWalmart(productName) {
    try {
        const response = await axios.get(`https://www.walmart.com/search/?query=${productName}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        let products = [];
        $('.search-result-gridview-item').each((index, element) => {
            let title = $(element).find('.product-title').text().trim();
            let price = $(element).find('.price-main .visuallyhidden').text().trim();
            let link = $(element).find('a').attr('href');
            let image = $(element).find('img').attr('src'); // Get image URL
            if (title && price && link && image) {
                products.push({ title, price, link: `https://www.walmart.com${link}`, image, source: 'Walmart' });
            }
        });
        return products;
    } catch (error) {
        console.error('Error scraping Walmart:', error.message);
        return [];
    }
}

// Scraping function for Best Buy
async function scrapeBestBuy(productName) {
    try {
        const response = await axios.get(`https://www.bestbuy.com/site/searchpage.jsp?st=${productName}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        let products = [];
        $('.sku-item').each((index, element) => {
            let title = $(element).find('.sku-header').text().trim();
            let price = $(element).find('.priceView-hero-price span').text().trim();
            let link = $(element).find('.sku-header a').attr('href');
            let image = $(element).find('.sku-image img').attr('src'); // Get image URL
            if (title && price && link && image) {
                products.push({ title, price, link: `https://www.bestbuy.com${link}`, image, source: 'Best Buy' });
            }
        });
        return products;
    } catch (error) {
        console.error('Error scraping Best Buy:', error.message);
        return [];
    }
}

// Scraping function for Target
async function scrapeTarget(productName) {
    try {
        const response = await axios.get(`https://www.target.com/s?searchTerm=${productName}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        let products = [];
        $('.product-card').each((index, element) => {
            let title = $(element).find('.h-text').text().trim();
            let price = $(element).find('.h-price span').text().trim();
            let link = $(element).find('a').attr('href');
            let image = $(element).find('img').attr('src'); // Get image URL
            if (title && price && link && image) {
                products.push({ title, price, link: `https://www.target.com${link}`, image, source: 'Target' });
            }
        });
        return products;
    } catch (error) {
        console.error('Error scraping Target:', error.message);
        return [];
    }
}

// Scraping function for Zalando
async function scrapeZalando(productName) {
    try {
        const response = await axios.get(`https://www.zalando.com/${productName}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        let products = [];
        $('.z-navicat-list-item').each((index, element) => {
            let title = $(element).find('.z-text').text().trim();
            let price = $(element).find('.z-price-amount').text().trim();
            let link = $(element).find('a').attr('href');
            let image = $(element).find('img').attr('src'); // Get image URL
            if (title && price && link && image) {
                products.push({ title, price, link: `https://www.zalando.com${link}`, image, source: 'Zalando' });
            }
        });
        return products;
    } catch (error) {
        console.error('Error scraping Zalando:', error.message);
        return [];
    }
}

// Save product to DB
async function saveProductToDB(product) {
    const newProduct = new Product(product);
    try {
        await newProduct.save();
    } catch (error) {
        console.error('Error saving product to DB:', error);
    }
}

// Route to handle adding products to wishlist
router.post('/wishlist', async (req, res) => {
    const { title, price, link, image, source } = req.body;
    const newWishlistItem = new Wishlist({ title, price, link, image, source });
    try {
        await newWishlistItem.save();
        return res.status(200).json({ message: 'Item added to wishlist!' });
    } catch (error) {
        console.error('Error saving wishlist item:', error.message);
        return res.status(500).json({ message: 'Error adding item to wishlist.' });
    }
});

// Route to show wishlist
router.get('/wishlist', async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find(); // Fetch all items from the wishlist
        res.render('wishlist', { wishlistItems }); // Render the wishlist view
    } catch (error) {
        console.error('Error fetching wishlist items:', error.message);
        res.status(500).json({ message: 'Error fetching wishlist items.' });
    }
});

// Route to handle product search and results rendering
router.post('/results', async (req, res) => {
    const productName = req.body.productName;
    if (!productName) {
        return res.redirect('/search'); // Redirect if no product specified
    }

    // Redirect to GET /results route with query string
    res.redirect(`/results?productName=${encodeURIComponent(productName)}`);
});

// Route to show search results with pagination
router.get('/results', async (req, res) => {
    const productName = req.query.productName || '';
    const page = parseInt(req.query.page) || 1; // Current page defaults to 1
    const itemsPerPage = 9; // Number of items per page

    // Query MongoDB for matching products
    let productsFromDB = await Product.find({
        title: new RegExp(productName, 'i'), // Case-insensitive regex search
    })
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);

    // Total product count for pagination
    const totalProductsFromDB = await Product.countDocuments({
        title: new RegExp(productName, 'i'),
    });

    const totalPagesFromDB = Math.ceil(totalProductsFromDB / itemsPerPage);

    // If no products found in DB or not enough for the current page number,
    // scrape data from websites...
    if (productsFromDB.length === 0 || totalProductsFromDB < itemsPerPage * page) { 
        try { 
            // Scrape data from multiple websites 
            const [ebayProducts, walmartProducts, bestBuyProducts, targetProducts, zalandoProducts] =
                await Promise.all([ 
                    scrapeEbay(productName), 
                    scrapeWalmart(productName), 
                    scrapeBestBuy(productName), 
                    scrapeTarget(productName), 
                    scrapeZalando(productName), 
                ]);

            // Combine all scraped products 
            productsFromDB = [
                ...ebayProducts,
                ...walmartProducts,
                ...bestBuyProducts,
                ...targetProducts,
                ...zalandoProducts,
            ];

            // Log the results from all scraping functions
            // console.log('Scraped products:', {
            //     ebayProducts,
            //     walmartProducts,
            //     bestBuyProducts,
            //     targetProducts,
            //     zalandoProducts
            // });

            // Save the scraped products to the DB 
            await Promise.all(productsFromDB.map(saveProductToDB));

            // Recalculate totalProducts after scraping 
            const totalProductsAfterScraping = productsFromDB.length;

            // Calculate total pages after scraping 
            const totalPagesAfterScraping = Math.ceil(totalProductsAfterScraping / itemsPerPage);

            // Fetch the products for the current page again after scraping.
            productsFromDB = productsFromDB.slice((page - 1) * itemsPerPage, page * itemsPerPage);

            // Use the total pages after scraping
            res.render('results', { 
                products: productsFromDB,
                productName,
                page,
                totalPages: totalPagesAfterScraping,
                convertToINR,
            });
        } catch (error) {
            console.error('Error during scraping:', error.message);
            res.status(500).json({ message: 'Error during scraping.' });
        }
    } else {
        // Render the results page with the products and pagination info
        res.render('results', { 
            products: productsFromDB,
            productName,
            page,
            totalPages: totalPagesFromDB,
            convertToINR,
        });
    }
});




module.exports = router;
