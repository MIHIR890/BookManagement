const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const LogInCollection = require("../models/userModel");
const jwt = require("jsonwebtoken");




const generateAccessToken = () => {
    return crypto.randomBytes(64).toString("hex");
  };

  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";

// Helper to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Helper to verify password
const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

// // Generate random access token
// const generateAccessToken = () => {
//   return crypto.randomBytes(64).toString("hex");
// };

// Register new user
exports.registerUser = async (req, res) => {
  const { fullName, username, password, email, mobileNumber } = req.body;

  if (!fullName || !username || !password || !email || !mobileNumber) {
    return res.status(400).send("All fields are required");
  }

  try {
    const existingUser = await LogInCollection.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("User with this username or email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new LogInCollection({
      userId: uuidv4(),
      fullName,
      username,
      password: hashedPassword,
      email,
      mobileNumber,
      profilePicUrl: null,
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal server error");
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await LogInCollection.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    // const token = generateAccessToken();
    const token = jwt.sign(
      { userId: user.userId, email: user.email }, // Payload
      JWT_SECRET_KEY, // Secret Key
      { expiresIn: "1h" } // Expiration time
    );
    res.status(200).json({
      message: "Login successful",
      token,
      userDetails: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
};

// Google sign-in
exports.googleSignUp = async (req, res) => {
  const { userId, email, fullName, profilePicUrl } = req.body;

  try {
    let user = await LogInCollection.findOne({ userId });

    if (user) {
      return res.status(200).json({ message: "User already exists", userDetails: user });
    }

    user = new LogInCollection({
      userId,
      email,
      fullName,
      profilePicUrl,
      mobileNumber: null,
      username: null,
      password: null,
    });

    await user.save();
    res.status(200).json({ message: "User created successfully", userDetails: user });
  } catch (error) {
    console.error("Error during Google signup:", error);
    res.status(500).send("Internal server error");
  }
};
