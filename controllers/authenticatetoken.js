const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).send("Token is missing or unauthorized");
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid or expired token");
    }

    // Attach user details to the request object
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;