import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignupStudent from "./pages/SignupStudent";
import SignupTutor from "./pages/SignupTutor";
import LoginStudent from "./pages/LoginStudent";
import LoginTutor from "./pages/LoginTutor";
import Dashboard from "./pages/Dashboard"; // Placeholder for the next step
import TutorDashboard from "./pages/TutorDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup-student" element={<SignupStudent />} />
        <Route path="/signup-tutor" element={<SignupTutor />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/login-tutor" element={<LoginTutor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-tutor" element={<TutorDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
