const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["tutor", "student"], required: true },
  availability: {
    type: Object, // Store as an object with days as keys
    default: {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    }
  },
  courses: { type: [String], default: [] }, // Store selected courses
});

module.exports = mongoose.model("User", UserSchema);
