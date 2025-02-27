const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slotId: { type: String, required: true }, // Slot identifier
  day: { type: String, required: true }, // e.g., "Wednesday"
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
