const LogInCollection = require("../models/userModel");

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  const { userId } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const profilePicUrl = `/uploads/${req.file.filename}`;
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
};

// Get user data
exports.getUserData = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await LogInCollection.findOne({ userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send("Internal server error");
  }
};
