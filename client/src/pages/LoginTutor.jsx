import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ✅ Updated import path
import API from "../utils/axiosInstance";
import { Loader2 } from "lucide-react";

const LoginTutor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth(); 
  const [loading, setLoading] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a0b29] to-[#130f23]">
      <div className="bg-[#1f1a2e] p-8 rounded-2xl shadow-lg w-96 border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Tutor Login</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-[#2a1e4f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
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
