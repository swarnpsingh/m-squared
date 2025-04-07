import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { Loader2 } from "lucide-react";

const SignupStudent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { ...formData, role: "student" });
      navigate("/login-student");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a0b29] to-[#130f23]">
      <div className="bbg-[#1f1a2e] p-8 rounded-2xl shadow-lg w-96 border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Your Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@muwci.net"
              className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account? <a href="/login-student" className="text-blue-400 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupStudent;
