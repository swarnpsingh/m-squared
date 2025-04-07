const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const jwt = require("jsonwebtoken");
dotenv.config(); // Ensure .env variables are loaded

const secretKey = process.env.JWT_SECRET; // This should now be available
const app = express();
app.use(express.json());

// Allow requests from your frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/userRoutes"));




const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
const bookingRoutes = require("./routes/bookingRoutes");

// Middleware
app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/availability", require("./routes/availabilityRoutes"));


connectDB();

app.get("/", (req, res) => {
  res.send("M-Squared API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
