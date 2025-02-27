import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Import useAuth to refresh session
import API from "../utils/axiosInstance";

const LoginStudent = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to store error messages
  const navigate = useNavigate();
  const { fetchUser, logout } = useAuth(); // Get fetchUser & logout from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      logout(); // Clear previous session before new login
      console.log("Sending login request with data:", formData);
      
      const { data } = await API.post("/auth/login", { ...formData, role: "student" });
      
      console.log("Login successful, received data:", data);
      localStorage.setItem("token", data.token);
      await fetchUser(); // Refresh session with new user data

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login as Student</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>} {/* Display error messages */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-2"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-600 text-white w-full p-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginStudent;
