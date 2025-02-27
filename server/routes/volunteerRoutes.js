const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("-password");
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

module.exports = router;
