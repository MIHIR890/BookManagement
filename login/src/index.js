const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { LogInCollection } = require("./mongo"); // MongoDB collection
const bcrypt = require("bcrypt");
const multer = require("multer");
const moment = require("moment-timezone");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require('body-parser');


const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Paths for templates, static files, and uploads
const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");
const uploadPath = path.join(__dirname, "../uploads"); // Folder to store profile pictures

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

// Generate a random access token
const generateAccessToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Helper function to hash password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Middleware to verify hashed password
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

// Configure multer storage for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Save to uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Register endpoint
app.post("/register", async (req, res) => {
  const { fullName, username, password, email, mobileNumber } = req.body;

  // Validate that all fields are provided
  if (!fullName || !username || !password || !email || !mobileNumber) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the user already exists by username or email
    const existingUser = await LogInCollection.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("User with this username or email already exists");
    }

    // Hash the password and create a new user with a unique ID
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();
    const newUser = new LogInCollection({
      userId,
      fullName,
      username,
      password: hashedPassword,
      email,
      mobileNumber,
      profilePicUrl: null, // Placeholder for profile picture URL
    });

    await newUser.save(); // save
    
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal server error");
  }
});
//google sign in endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Received data:', req.body);  // Log the incoming data
    const { userId, email, fullName, profilePicUrl } = req.body;

    // Check if the user already exists
    let existingUser = await LogInCollection.findOne({ userId });
    if (existingUser) {
      return res.status(200).json({
        message: 'User already exists',
        userDetails: {
          userId: existingUser.userId,
          fullName: existingUser.fullName,
          email: existingUser.email,
          mobileNumber: existingUser.mobileNumber,
        },
      });
    }

    // Create a new user document
    const newUser = new LogInCollection({
      userId,
      email,
      fullName,
      profilePicUrl,
      mobileNumber: null,
      username: null,
      password: null,
    });

    await newUser.save();
    res.status(200).json({
      message: 'User created successfully',
      userDetails: {
        userId: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);  // Log error
    res.status(500).json({ message: 'Error saving user data' });
  }
});



// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Find user by username
    const user = await LogInCollection.findOne({ email });
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

    // Send response with additional user details including userId
    res.status(200).json({
      message: "Login successful",
      token,
      userDetails: {
        userId: user.userId, // Include userId in the response
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
});


// Profile picture upload endpoint
app.post("/uploadProfilePic", upload.single("profilePic"), async (req, res) => {
  const { userId } = req.body;

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    // Construct the profile picture URL
    const profilePicUrl = `/uploads/${req.file.filename}`;

    // Update user's profile picture URL in database
    const user = await LogInCollection.findOneAndUpdate(
      { userId },
      { profilePicUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicUrl: user.profilePicUrl,
    });
  } catch (error) {
    console.error("Error during profile picture upload:", error);
    res.status(500).send("Internal server error");
  }
});

// Endpoint to get user data by user ID
app.get("/getUserData", async (req, res) => {
  const { userId } = req.query;

  try {
    // Retrieve user data
    const user = await LogInCollection.findOne({ userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      profilePicUrl: user.profilePicUrl,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send("Internal server error");
  }
});

//important to show image on browser
app.use("/uploads", express.static(uploadPath));


// Listen on specified port
app.listen(port, () => {
  console.log(`Server connected on port ${port}`);
});
