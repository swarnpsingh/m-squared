import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { Loader2 } from "lucide-react";

const SignupTutor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tutor",
    availability: {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    },
    courses: []
  });
  const [loading, setLoading] = useState(false);

  const handleTimeChange = (day, index, field, value) => {
    setFormData((prev) => {
      const newAvailability = { ...prev.availability };
      newAvailability[day][index][field] = value;
      return { ...prev, availability: newAvailability };
    });
  };

  const addTimeSlot = (day) => {
    setFormData((prev) => {
      const newAvailability = { ...prev.availability };
      newAvailability[day].push({ start: "", end: "" });
      return { ...prev, availability: newAvailability };
    });
  };

  const removeTimeSlot = (day, index) => {
    setFormData((prev) => {
      const newAvailability = { ...prev.availability };
      newAvailability[day].splice(index, 1);
      return { ...prev, availability: newAvailability };
    });
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      courses: checked
        ? [...prev.courses, value]
        : prev.courses.filter((course) => course !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      alert("Signup successful!");
      
      // Redirect to TutorDashboard after successful signup
      navigate("/dashboard-tutor");
    } catch (error) {
      console.error("Error during signup:", error.message);
      alert(error.message);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a0b29] to-[#130f23]">
      <form onSubmit={handleSubmit} className="bg-[#1f1a2e] p-8 rounded-2xl shadow-lg border border-gray-700 my-18">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Tutor Signup</h2>
  
        {/* Input Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
  
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
  
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
  
        {/* Availability Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Select Availability:</h3>
          {Object.keys(formData.availability).map((day) => (
            <div key={day} className="mb-4">
              <h4 className="font-semibold text-gray-600">{day}</h4>
              <div className="space-y-2">
                {formData.availability[day].map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) => handleTimeChange(day, index, "start", e.target.value)}
                      className="p-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white-400"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) => handleTimeChange(day, index, "end", e.target.value)}
                      className="p-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition"
                      onClick={() => removeTimeSlot(day, index)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                onClick={() => addTimeSlot(day)}
              >
                ➕ Add Time Slot
              </button>
            </div>
          ))}
        </div>

        {/* Courses Selection */}
      <label className="block font-semibold text-white mt-3">Select Courses:</label>
      <div className="grid grid-cols-2 gap-2">
        {["AA HL", "AA SL", "AI HL", "AI SL"].map((course) => (
          <label key={course} className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              value={course}
              onChange={handleCourseChange}
            />
            <span>{course}</span>
          </label>
        ))}
      </div>
  
        {/* Submit Button */}
        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 flex justify-center items-center mt-6"
        disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupTutor;


