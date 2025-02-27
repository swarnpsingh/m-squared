import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import API from "../utils/axiosInstance";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filter, setFilter] = useState({ course: "", availability: "", day: "" });
  const [comment, setComment] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!user) return; // Prevent running when user is not loaded
  
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/users/tutors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTutors(data);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };
  
    if (user?.role === "student") {
      fetchTutors();
    }
  }, [user]);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // Redirect to login page
  };
  

  const filteredTutors = tutors.filter((tutor) => {
    const matchesCourse = !filter.course || tutor.courses?.includes(filter.course);
    const matchesAvailability =
      !filter.availability ||
      Object.values(tutor.availability || {}).some((slots) =>
        slots.some((slot) =>
          slot.start.includes(filter.availability) || slot.end.includes(filter.availability)
        )
      );

    const matchesDay =
      !filter.day || (tutor.availability && tutor.availability[filter.day]?.length > 0);

    return matchesCourse && matchesAvailability && matchesDay;
  });

  const openBookingModal = (tutor, slot) => {
    setSelectedSession({
      tutorId: tutor._id,
      tutorName: tutor.name,
      slotId: slot.slotId,
      day: slot.day,
      startTime: slot.start,
      endTime: slot.end,
    });
  };

  const confirmBooking = async () => {
    if (!selectedSession) {
      console.error("No session selected!");
      return;
    }
  
    const formattedDay = new Date().toISOString().split("T")[0]; // Default to today's date
  
    const bookingData = {
      tutorId: selectedSession.tutorId,
      slotId: selectedSession.slotId,
      day: formattedDay,
      startTime: selectedSession.startTime,
      endTime: selectedSession.endTime,
      comment,
    };
  
    console.log("Sending booking request:", bookingData); // ✅ Debug log
  
    try {
      const token = localStorage.getItem("token");
      await API.post("/bookings", bookingData, { headers: { Authorization: `Bearer ${token}` } });

      alert("Booking successful!");
      setSelectedSession(null); // Close modal
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
    }
  };
  
  

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-1/5 min-w-[250px] bg-blue-500 text-white p-6 h-screen sticky top-0 flex flex-col">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <ul className="mt-6">
          <li className="p-2 hover:bg-gray-700 cursor-pointer">Home</li>
          <li className="p-2 hover:bg-gray-700 cursor-pointer">My Bookings</li>
          <li className="p-2 hover:bg-gray-700 cursor-pointer">Settings</li>
        </ul>
      <button
          className="mt-auto bg-red-600 hover:bg-red-700 text-white p-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h2>

        {user?.role === "student" && (
          <>
            {/* Filters */}
            <div className="mb-6 flex gap-4 w-full max-w-4xl">
              <input
                type="text"
                placeholder="Filter by course"
                className="border p-2 rounded w-1/3"
                value={filter.course}
                onChange={(e) => setFilter({ ...filter, course: e.target.value })}
              />

              <input
                type="text"
                placeholder="Filter by time (e.g., 10:00 AM)"
                className="border p-2 rounded w-1/3"
                value={filter.availability}
                onChange={(e) => setFilter({ ...filter, availability: e.target.value })}
              />

              <select
                className="border p-2 rounded w-1/2"
                value={filter.day}
                onChange={(e) => setFilter({ ...filter, day: e.target.value })}
              >
                <option value="">Filter by day</option>
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                  (day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  )
                )}
              </select>
            </div>

            <h3 className="text-2xl font-semibold mb-4">Available Tutors</h3>

            {filteredTutors.length === 0 ? (
              <p className="text-gray-500">No tutors available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutors.map((tutor) => (
                  <div key={tutor._id} className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold text-blue-900">{tutor.name}</h4>
                    <p className="mt-2">
                      <strong>Courses:</strong> {tutor.courses?.join(", ")}
                    </p>

                    <div className="mt-4">
                      <strong>Availability:</strong>
                      {tutor.availability ? (
                        <table className="w-full mt-2 border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-200 text-left">
                              <th className="p-2 border border-gray-300">Day</th>
                              <th className="p-2 border border-gray-300">Time</th>
                              <th className="p-2 border border-gray-300">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(tutor.availability).map((day) =>
                              tutor.availability[day].map((slot, index) => {
                                const slotId = slot.slotId || `${tutor._id}-${day}-${index}`;
                                return (
                                  <tr key={slotId} className="border border-gray-300">
                                    <td className="p-2 border border-gray-300 capitalize">{day}</td>
                                    <td className="p-2 border border-gray-300">
                                      {slot.start} - {slot.end}
                                    </td>
                                    <td className="p-2 text-center">
                                      <button
                                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                                        onClick={() => openBookingModal(tutor, { day, ...slot, slotId })}
                                      >
                                        Book
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-500">No availability</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Confirm Booking</h3>
            <p><strong>Tutor:</strong> {selectedSession.tutorName}</p>
            <p><strong>Day:</strong> {selectedSession.day}</p>
            <p><strong>Time:</strong> {selectedSession.startTime} - {selectedSession.endTime}</p>
            <textarea
              className="w-full border p-2 rounded mt-2"
              placeholder="Optional comment for the tutor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setSelectedSession(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={confirmBooking}
                disabled={isBooking}
              >
                {isBooking ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
