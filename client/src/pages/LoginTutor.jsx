import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ✅ Updated import path
import API from "../utils/axiosInstance";

const LoginTutor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ Update global auth state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { email, password });

      console.log("Login successful", res.data);

      if (!res.data.user || !res.data.token) {
        setError("Invalid response from server");
        return;
      }

      if (res.data.user.role !== "tutor") {
        setError("Access denied: You are not a tutor.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user); // ✅ Update auth state in context

      console.log("Stored User:", localStorage.getItem("user"));

      navigate("/dashboard-tutor"); // Redirect after login
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Tutor Login</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-3 text-center">
          Don't have an account?{" "}
          <a href="/signup-tutor" className="text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginTutor;
