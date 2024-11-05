const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { LogInCollection } = require("./mongo"); // Assuming this is your MongoDB collection
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const port = process.env.PORT || 3000;
const app = express();
const multer = require("multer");
const moment = require("moment-timezone");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

const generateAccessToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// MongoDB schema and collection for users
// Assuming LogInCollection is a MongoDB model connected to your "users" collection

// Helper function to generate hashed password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Middleware to verify hashed password
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

// Register endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Check if user already exists
    const existingUser = await LogInCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password and store the user
    const hashedPassword = await hashPassword(password);
    const newUser = new LogInCollection({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal server error");
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Find user by username
    const user = await LogInCollection.findOne({ username });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    // Generate an access token
    const token = generateAccessToken();
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
});

const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Destination folder for storing uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Initialize parent id counter
let Counter = 1;
function generateTwoDigitUUID() {
  const randomNumber = Math.floor(Math.random() * 100); // Generate random number between 0 and 99
  return randomNumber.toString().padStart(2, "0"); // Ensure it's always two digits
}

// Convert current date to IST and log it
const utcDate = new Date("2024-02-22T09:39:29.000+00:00");
const istDate = moment().tz("Asia/Kolkata").format();
console.log(istDate); // This will print the date in IST

console.log(publicPath);

// Listen on specified port
app.listen(port, () => {
  console.log(`Server connected on port ${port}`);
});
