const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../Models/productModel');

const LIMIT = 50; // Universal limit for all scrapers

// Helper function to save products to the database
async function saveProducts(products, source) {
    try {
        const savedProducts = products.map(product => ({
            ...product,
            source, // Add source metadata
        }));
        await Product.insertMany(savedProducts); // Save in batch
        return savedProducts;
    } catch (error) {
        console.error(`Error saving products for ${source}:`, error.message);
        return [];
    }
}

// Scraping function for Flipkart
// async function scrapeFlipkart(productName) {
//     try {
//         const response = await axios.get(`https://www.flipkart.com/search?q=${productName}`, {
//             headers: { 'User-Agent': 'Mozilla/5.0' },
//         });
//         const $ = cheerio.load(response.data);
//         const products = [];
//         let count = 0;

//         $('._1AtVbE').each((index, element) => {
//             if (count >= LIMIT) return false;

//             const title = $(element).find('._4rR01T').text().trim();
//             const price = $(element).find('._30jeq3').text().trim();
//             const link = `https://www.flipkart.com${$(element).find('a').attr('href')}`;
//             const image = $(element).find('img').attr('src');

//             if (title && price && link && image) {
//                 products.push({ title, price, link, image });
//                 count++;
//             }
//         });

//         return await saveProducts(products, 'Flipkart');
//     } catch (error) {
//         console.error('Error scraping Flipkart:', error.message);
//         return [];
//     }
// }

// Scraping function for Amazon
async function scrapeAmazon(productName) {
    try {
        const response = await axios.get(`https://www.amazon.in/s?k=${productName}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const $ = cheerio.load(response.data);
        const products = [];
        let count = 0;

        $('.s-main-slot .s-result-item').each((index, element) => {
            if (count >= LIMIT) return false;

            const title = $(element).find('.a-text-normal').text().trim();
            const price = $(element).find('.a-price .a-offscreen').text().trim();
            const link = `https://www.amazon.in${$(element).find('.a-link-normal').attr('href')}`;
            const image = $(element).find('img').attr('src');

            if (title && price && link && image) {
                products.push({ title, price, link, image });
                count++;
            }
        });

        return await saveProducts(products, 'Amazon');
    } catch (error) {
        console.error('Error scraping Amazon:', error.message);
        return [];
    }
}

// Scraping function for Myntra
async function scrapeMyntra(productName) {
    try {
        const response = await axios.get(`https://www.myntra.com/${productName}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const $ = cheerio.load(response.data);
        const products = [];
        let count = 0;

        $('.product-base').each((index, element) => {
            if (count >= LIMIT) return false;

            const title = $(element).find('h3').text().trim();
            const price = $(element).find('span[data-qa="product-price"]').text().trim();
            const link = `https://www.myntra.com${$(element).find('a').attr('href')}`;
            const image = $(element).find('img').attr('src');

            if (title && price && link && image) {
                products.push({ title, price, link, image });
                count++;
            }
        });

        return await saveProducts(products, 'Myntra');
    } catch (error) {
        console.error('Error scraping Myntra:', error.message);
        return [];
    }
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
            let image = $(element).find('.s-item__image-img').attr('src');
            
            if (title && price && link && image) {
                products.push({
                    title,
                    price,
                    link,
                    image,
                    source: 'eBay' // Tagging the source as eBay
                });
            }
        });
        
        return products;
    } catch (error) {
        console.error('Error scraping eBay:', error.message);
        return [];
    }
}


// Scraping function for Ajio
async function scrapeAjio(productName) {
    try {
        const response = await axios.get(`https://www.ajio.com/search/?text=${productName}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const $ = cheerio.load(response.data);
        const products = [];
        let count = 0;

        $('.item').each((index, element) => {
            if (count >= LIMIT) return false;

            const title = $(element).find('.title').text().trim();
            const price = $(element).find('.price').text().trim();
            const link = `https://www.ajio.com${$(element).find('a').attr('href')}`;
            const image = $(element).find('img').attr('src');

            if (title && price && link && image) {
                products.push({ title, price, link, image });
                count++;
            }
        });

        return await saveProducts(products, 'Ajio');
    } catch (error) {
        console.error('Error scraping Ajio:', error.message);
        return [];
    }
}

// Scraping function for Meesho
async function scrapeMeesho(productName) {
    try {
        const response = await axios.get(`https://www.meesho.com/search?q=${productName}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const $ = cheerio.load(response.data);
        const products = [];
        let count = 0;

        $('.product-card').each((index, element) => {
            if (count >= LIMIT) return false;

            const title = $(element).find('.product-title').text().trim();
            const price = $(element).find('.product-price').text().trim();
            const link = `https://www.meesho.com${$(element).find('a').attr('href')}`;
            const image = $(element).find('img').attr('src');

            if (title && price && link && image) {
                products.push({ title, price, link, image });
                count++;
            }
        });

        return await saveProducts(products, 'Meesho');
    } catch (error) {
        console.error('Error scraping Meesho:', error.message);
        return [];
    }
}

module.exports = {
    // scrapeFlipkart,
    // scrapeAmazon,
    scrapeMyntra,
    scrapeAjio,
    scrapeEbay,
    scrapeMeesho,
};
