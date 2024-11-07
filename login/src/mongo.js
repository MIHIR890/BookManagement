
const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/BookManagement"; // Replace with your MongoDB URI
mongoose.set("strictQuery", true);


// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fullName: {
    type: String,
    required : true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
    unique: true
  }
});

// Create the LogInCollection model
const LogInCollection = mongoose.model("logInCollection", userSchema);

module.exports = { LogInCollection };

