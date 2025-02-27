import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const SignupStudent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up as Student</h2>
        <input type="text" name="name" placeholder="Name" className="w-full border p-2 mb-2" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full border p-2 mb-2" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full border p-2 mb-4" onChange={handleChange} required />
        <button type="submit" className="bg-blue-600 text-white w-full p-2">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupStudent;
