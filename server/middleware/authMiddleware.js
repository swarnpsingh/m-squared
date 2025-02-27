// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure the correct path

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Token verification failed" });
  }
};

module.exports = { protect };
