import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    availability: "",
    courses: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <input type="text" name="name" placeholder="Name" className="p-2 border" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="p-2 border" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="p-2 border" onChange={handleChange} required />
        <select name="role" onChange={handleChange} className="p-2 border">
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>
        {formData.role === "tutor" && (
          <>
            <input type="text" name="availability" placeholder="Availability" className="p-2 border" onChange={handleChange} />
            <input type="text" name="courses" placeholder="Courses (comma-separated)" className="p-2 border" onChange={handleChange} />
          </>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
      </form>
    </div>
  );
};

export default Register;
