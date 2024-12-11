const express = require("express");
const { registerUser, loginUser, googleSignUp } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/signup", googleSignUp);

module.exports = router;
