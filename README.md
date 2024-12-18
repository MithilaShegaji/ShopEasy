# 🛍️ ShopEasy

**ShopEasy** is a modern and user-friendly product comparison and wishlist application that scrapes product data from popular e-commerce websites. It allows users to search for products, compare prices across platforms, and save their favorite items to a wishlist.  

---

## 🚀 Features

- 🔎 **Search Products**: Compare products across multiple e-commerce platforms.
- 📊 **Price Comparison**: View and compare product prices in both USD and INR.
- 💾 **Wishlist Functionality**: Save your favorite products to your personal wishlist.
- 📦 **Data Storage**: All products and wishlist data are stored in a MongoDB database for persistence.
- 🌐 **Web Scraping**: Gather real-time data from popular shopping websites.

---

## 🌟 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates)
- **Database**: MongoDB
- **Web Scraping**: Axios, Cheerio
- **Additional Tools**: Nodemon for live reloading during development

---

## 📦 Packages Used

| Package          | Description                                  |
|-------------------|----------------------------------------------|
| `express`         | Web framework for Node.js                   |
| `axios`           | HTTP client for making web requests         |
| `cheerio`         | Scraping tool for parsing HTML              |
| `mongoose`        | MongoDB object modeling for Node.js         |
| `ejs`             | Template engine for rendering pages         |
| `nodemon`         | Utility to restart the server on changes    |

---

## 🌐 Websites Scraped

- **eBay**: Product listings and pricing.
- **Walmart**: Diverse product collection.
- **Best Buy**: Electronics and gadgets.
- **Target**: General shopping items.
- **Zalando**: Fashion and lifestyle products.

---

## 📂 Directory Structure

```plaintext
ShopEasy/
├── Models/
│   ├── productModel.js   # MongoDB schema for products
│   ├── wishlistModel.js  # MongoDB schema for wishlist
├── Routes/
│   ├── productRoute.js   # Handles scraping, search, and wishlist
├── Views/
│   ├── results.ejs       # Display search results
│   ├── wishlist.ejs      # Display wishlist items
│   ├── searchPage.ejs    # Search form
├── app.js                # Main server file
├── connection.js         # connecting to MongoDB
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
🔧 Setup Instructions
Prerequisites
Install Node.js and MongoDB.
Install a package manager like npm or yarn.
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/ShopEasy.git
Navigate to the project directory:
bash
Copy code
cd ShopEasy
Install dependencies:
bash
Copy code
npm install
Start the MongoDB server:
bash
Copy code
mongod
Run the application:
bash
Copy code
npm start
🖥️ Usage
Open your browser and navigate to http://localhost:3000.
Search for a product using the search bar.
View results from multiple platforms and compare prices.
Save your favorite items to the wishlist.
View and manage your wishlist at /wishlist.
📋 API Endpoints
Product Routes
Search Product:
POST /results - Search for products by name.

Get Results:
GET /results - Display paginated search results.

Wishlist Routes
Add to Wishlist:
POST /wishlist - Add an item to the wishlist.

View Wishlist:
GET /wishlist - Display all saved wishlist items.

🎨 Screenshots
Search Page

Results Page

Wishlist Page

🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.

Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature-name
Make your changes and commit:
bash
Copy code
git commit -m "Add some feature"
Push to the branch:
bash
Copy code
git push origin feature-name
Submit a pull request.
📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

🌟 Acknowledgements
Node.js
MongoDB
Cheerio
Axios
🚀 Made with ❤️ by Your Name
javascript
Copy code

Replace placeholders (e.g., `your-username`) with your actual GitHub details.
