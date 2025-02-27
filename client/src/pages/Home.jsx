import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to m-squared</h1>
      <p className="text-lg mb-6 max-w-xl">
        A platform where students can connect with volunteer tutors to learn mathematics beyond school hours.
      </p>
      
      <div className="flex gap-6">
        <Link to="/signup-student" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition">
          Sign Up as Student
        </Link>
        <Link to="/signup-tutor" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition">
          Sign Up as Tutor
        </Link>
      </div>

      <div className="mt-6">
        <p>Already have an account?</p>
        <div className="flex gap-4 mt-2">
          <Link to="/login-student" className="underline">Login as Student</Link>
          <Link to="/login-tutor" className="underline">Login as Tutor</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
