const Product = require('../Models/productModel');

const {
    scrapeFlipkart,
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
    const maxProducts = 50;  // Limit the number of products scraped
    const maxPages = 6;      // Limit the scraping to 6 pages

    let productsFromDB = await Product.find({
        title: new RegExp(productName, 'i'),
    })
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);

    const totalProductsFromDB = await Product.countDocuments({
        title: new RegExp(productName, 'i'),
    });

    const totalPagesFromDB = Math.floor(totalProductsFromDB / itemsPerPage);

    if (productsFromDB.length === 0 || totalProductsFromDB < itemsPerPage * page) {
        try {
            // Scrape data from all websites
            const [
                flipkartProducts,
                // amazonProducts,
                myntraProducts,
                ebayProducts,
                ajioProducts,
                meeshoProducts,
            ] = await Promise.all([
                scrapeFlipkart(productName),
                // scrapeAmazon(productName),
                scrapeMyntra(productName),
                scrapeEbay(productName),
                scrapeAjio(productName),
                scrapeMeesho(productName),
            ]);

            // Combine all scraped products and limit to 50
            let allScrapedProducts = [
                ...flipkartProducts,
                // ...amazonProducts,
                ...myntraProducts,
                ...ebayProducts,
                ...ajioProducts,
                ...meeshoProducts,
            ];

            allScrapedProducts = allScrapedProducts.slice(0, maxProducts);  // Limit to 50 products

            // Save scraped products to DB
            await Promise.all(allScrapedProducts.map(saveProductToDB));

            // Recalculate total products and total pages
            const totalProductsAfterScraping = allScrapedProducts.length;
            const totalPagesAfterScraping = Math.floor(totalProductsAfterScraping / itemsPerPage);

            // Slice products for current page
            const productsForCurrentPage = allScrapedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

            res.render('results', {
                products: productsForCurrentPage,
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
        res.render('results', {
            products: productsFromDB,
            productName,
            page,
            totalPages: totalPagesFromDB,
            convertToINR,
        });
    }
}

// Export the functions
module.exports = {
    handleResultsDisplay,
    handleResultsRequest,
};
