import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b29] to-[#130f23] text-white flex flex-col">
      
      {/* Navbar - Stays at the top */}
      <nav className="w-full flex justify-between items-center p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">🔵</span>
          </div>
          <span>m-squared</span>
        </div>

        {/* Tutor Sign-in/Sign-up */}
        <div className="flex items-center gap-4">
          <span className="text-gray-300 hidden sm:block">Are you a tutor? →</span>
          <Link to="/login-tutor" className="text-gray-300 hover:text-white">Sign in</Link>
          <Link to="/signup-tutor" className="bg-purple-500 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-purple-600 transition">
            Sign up →
          </Link>
        </div>
      </nav>

      {/* Hero Section - Stays centered */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm bg-purple-700 px-4 py-1 rounded-full mb-4">
          ✨ Your Ultimate Learning Companion!
        </p>
        <h1 className="text-5xl font-extrabold leading-tight max-w-[90%] md:max-w-3xl">
          Elevate Your Math Learning with <span className="text-purple-400">m-squared</span>
        </h1>
        <p className="text-lg text-gray-300 mt-4 max-w-[90%] md:max-w-xl">
          A platform where students connect with expert tutors to master mathematics beyond school hours.
        </p>

        {/* Call to Action Button */}
        <Link to="/signup-student" className="mt-6 bg-purple-600 px-8 py-3 text-lg rounded-full font-semibold shadow-lg hover:bg-purple-700 transition">
          Get Started for Free
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 p-6">
        <p>Already have an account? <Link to="/login-student" className="underline text-white">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Home;
