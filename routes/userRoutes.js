const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadProfilePicture, getUserData } = require("../controllers/userController");

const uploadPath = path.join(__dirname, "../uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

router.post("/uploadProfilePic", upload.single("profilePic"), uploadProfilePicture);
router.get("/getUserData", getUserData);

module.exports = router;
