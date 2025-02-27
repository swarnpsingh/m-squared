const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const User = require("../models/User");

const router = express.Router();

/**
 * @route POST /api/bookings
 * @desc Book a tutoring slot (max 3 students per slot)
 * @access Private (requires authentication)
 */
router.post("/", protect, async (req, res) => {
  console.log("Incoming booking request:", req.body);

  let { tutorId, slotId, day, startTime, endTime, comment } = req.body;
  const studentId = req.user._id;

  try {
    if (!tutorId || !slotId || !day || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const formattedDay = new Date(day);
    if (isNaN(formattedDay.getTime())) {
      return res.status(400).json({ message: `Invalid date format: ${day}` });
    }
    formattedDay.setHours(0, 0, 0, 0);

    const existingBookings = await Booking.countDocuments({ slotId });
    if (existingBookings >= 3) {
      return res.status(400).json({ message: "This slot is fully booked." });
    }

    const alreadyBooked = await Booking.findOne({ slotId, studentId });
    if (alreadyBooked) {
      return res.status(400).json({ message: "You have already booked this slot." });
    }

    const newBooking = new Booking({
      tutorId,
      studentId,
      slotId,
      day: formattedDay,
      startTime,
      endTime,
      comment,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed!", booking: newBooking });
  } catch (error) {
    console.error("Error in booking slot:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

/**
 * @route GET /api/bookings/tutor
 * @desc Get all upcoming bookings for the logged-in tutor
 * @access Private (requires authentication)
 */
router.get("/tutor", protect, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      tutorId: req.user._id,
      day: { $gte: today },
    })
      .populate("studentId", "name")
      .select("day startTime endTime studentId comment");

    console.log("Fetched Bookings:", bookings);

    res.json(Array.isArray(bookings) ? bookings : []);
  } catch (error) {
    console.error("Error fetching tutor bookings:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * @route GET /api/bookings/tutor/history
 * @desc Get past tutoring sessions for the logged-in tutor
 * @access Private (requires authentication)
 */
router.get("/tutor/history", protect, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastSessions = await Booking.find({
      tutorId: req.user._id,
      day: { $lt: today },
    }).populate("studentId", "name");

    const groupedSessions = {};
    pastSessions.forEach((booking) => {
      const key = `${booking.day}-${booking.startTime}-${booking.endTime}`;
      if (!groupedSessions[key]) {
        groupedSessions[key] = {
          day: booking.day,
          startTime: booking.startTime,
          endTime: booking.endTime,
          students: [],
        };
      }
      groupedSessions[key].students.push({
        name: booking.studentId.name,
        comment: booking.comment,
      });
    });

    res.json(Object.values(groupedSessions));
  } catch (error) {
    console.error("Error fetching tutor session history:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
