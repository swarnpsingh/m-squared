import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import API from "../utils/axiosInstance";
import { Menu, X } from "lucide-react";

const TutorDashboard = () => {
  const { user, loading } = useAuth();
  const [tutorAvailability, setTutorAvailability] = useState({});
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("availability");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        if (user?.role === "tutor") {
          const [availabilityRes, bookingsRes] = await Promise.all([
            API.get("/availability/tutor"),
            API.get("/bookings/tutor"),
          ]);

          setTutorAvailability(availabilityRes.data);
          setBookings(bookingsRes.data);
        }
      } catch (error) {
        console.error("Error fetching tutor data:", error);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/users/leaderboard");
        setLeaderboard(
          res.data.map((tutor) => ({
            ...tutor,
            studentCount: tutor.studentCount || 0,
          }))
        );
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    if (activeTab === "leaderboard") {
      fetchLeaderboard();
    }
    fetchTutorData();
  }, [user, activeTab]);

  const handleViewBookings = (day, startTime, endTime) => {
    const slotBookings = bookings.filter(
      (booking) =>
        booking.day === day &&
        booking.startTime === startTime &&
        booking.endTime === endTime
    );

    setSelectedSlot({ day, startTime, endTime, students: slotBookings });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  if (loading) {
    return <div className="text-center text-white mt-10 text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a0b29] to-[#130f23] text-white relative">
      {/* Burger Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-purple-700 p-3 rounded-md z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform fixed md:static w-64 bg-[#130f23] p-6 h-full border-r border-gray-700 flex flex-col z-40`}
      >
        <h2 className="text-xl font-bold text-purple-400 mb-6">Tutor Dashboard</h2>
        <ul className="space-y-2 flex-grow">
          <li
            className={`p-3 cursor-pointer rounded-lg ${
              activeTab === "availability" ? "bg-purple-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("availability")}
          >
            Availability
          </li>
          <li
            className={`p-3 cursor-pointer rounded-lg ${
              activeTab === "leaderboard" ? "bg-purple-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </li>
        </ul>
        {/* Logout Button Fixed at Bottom */}
        <button
          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg shadow-md mt-auto"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold mb-6 text-purple-400">Welcome, {user?.name}!</h2>

        {activeTab === "availability" && (
          <>
            <h3 className="text-2xl font-semibold mb-4">Your Availability</h3>
            {Object.keys(tutorAvailability).length === 0 ? (
              <p className="text-gray-400">No availability set.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(tutorAvailability).map(([day, slots]) => (
                  <div key={day} className="bg-[#1f1a2e] p-6 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-bold text-purple-400">{day}</h4>
                    {slots.length > 0 ? (
                      <ul className="mt-2">
                        {slots.map((slot, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            {slot.start} - {slot.end}
                            <button
                              onClick={() => handleViewBookings(day, slot.start, slot.end)}
                              className="ml-4 bg-purple-500 px-3 py-1 rounded hover:bg-purple-700 my-2"
                            >
                              View Bookings
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">You're not available.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "leaderboard" && (
          <>
            <h3 className="text-2xl font-semibold mb-4">Tutor Leaderboard</h3>
            <table className="w-full bg-[#1f1a2e] border border-gray-700">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="p-3 text-left">Tutor Name</th>
                  <th className="p-3 text-left">Student Count</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length > 0 ? (
                  leaderboard.map((tutor, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-3">{tutor.name}</td>
                      <td className="p-3">{tutor.studentCount ?? 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-3 text-center text-gray-400">No data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    {/* Modal for Booking Details */}
    {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#1f1a2e] p-6 rounded-lg shadow-lg w-96 border border-gray-700">
            <h3 className="text-lg font-bold text-purple-400 mb-4">
              Bookings for {selectedSlot.day} ({selectedSlot.startTime} -{" "}
              {selectedSlot.endTime})
            </h3>
            {selectedSlot.students.length > 0 ? (
              <ul className="space-y-2">
                {selectedSlot.students.map((booking, index) => (
                  <li key={index} className="bg-gray-800 p-3 rounded-md">
                    <strong className="text-white">{booking.studentId.name}</strong>
                    <p className="text-sm text-gray-400">"{booking.comment || "No comment"}"</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No students booked this slot.</p>
            )}
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;

