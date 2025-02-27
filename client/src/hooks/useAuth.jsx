import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user from API
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. Logging out.");
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched user data:", data); // Debugging
      setUser(data);
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Logout function to clear user state
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
