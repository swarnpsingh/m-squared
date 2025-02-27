const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

/**
 * @route GET /api/availability/tutor
 * @desc Get tutor's availability
 * @access Private (requires authentication)
 */
router.get("/tutor", protect, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tutor = await User.findById(req.user._id).select("availability");

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json(tutor.availability);
  } catch (error) {
    console.error("Error fetching tutor availability:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
