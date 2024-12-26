const express = require("express");
const app = express();
const path = require("path");
const PORT = 8000;

// Importing Routes
const productRoute = require("./Routes/productRoute");
const wishlistRoute = require('./Routes/wishlistRoute');
// const staticRoute = require("./Routes/staticRoute");
// const userRoute = require("./Routes/userRoute"); // Uncomment if needed later

// MongoDB Connection
const { connectToMongoDB } = require("./connection");
connectToMongoDB("mongodb://127.0.0.1:27017/ShopEasy")
  .then(() => {
    console.log(
      // `Click on http://localhost:${PORT}/signup\n` +
      // `Click on http://localhost:${PORT}/login`
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err)); // Added error handling

// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/search', (req, res) => {
  res.render('searchPage', { errorMessage: null });
});

// Route Handlers
// app.use("/", staticRoute);   // Handles static routes like home, signup, login
// app.use("/user", userRoute); // User-related routes, uncomment if implemented
app.use("/", productRoute); // Product-related routes

app.use('/wishlist', wishlistRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Server started at: http://localhost:${PORT}/search\nClick on http://localhost:${PORT}/wishlist`);
});
