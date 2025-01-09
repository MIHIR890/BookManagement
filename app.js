const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const moment = require("moment-timezone");
const crypto = require("crypto");
const connectToDatabase = require("./mongo"); // Adjust the path based on your file structure
require("dotenv").config();



// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes= require("./routes/bookRoutes");
const favouriteBookRoutes= require("./routes/favouritBookRoutes");
const audioBookRoutes= require("./routes/audioBookRoutes");
connectToDatabase();


// Setup app
const app = express();
const port = process.env.PORT || 3000;




// Paths for templates and static files
const templatePath = path.join(__dirname, "views");
const publicPath = path.join(__dirname, "public");
const uploadPath = path.join(__dirname, "uploads");

// Middlewares
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use("/uploads", express.static(uploadPath)); // Serve uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", bookRoutes);
app.use("/api", favouriteBookRoutes);
app.use("/api", audioBookRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
