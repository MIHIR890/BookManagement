const mongoose = require("mongoose");
require("dotenv").config(); // Load .env locally


// MongoDB connection string
// const mongoURI = "mongodb://localhost:27017/BookManagement"; // Replace with your MongoDB URI

mongoose.set("strictQuery", true);

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the app on database connection failure
  }
};

module.exports = connectToDatabase;
