import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import API from "../utils/axiosInstance";
import axios from "axios";

const TutorDashboard = () => {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [tutorAvailability, setTutorAvailability] = useState({});
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchTutorAvailability = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users/register");
        if (data.availability) {
          setTutorAvailability(data.availability);
        }
      } catch (error) {
        console.error("Error fetching tutor availability:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const { data } = await API.get("/bookings/tutor");
        console.log("Fetched sessions:", data);

        const groupedSessions = {};
        data.forEach((booking) => {
          const key = `${booking.day}-${booking.startTime}-${booking.endTime}`;
          if (!groupedSessions[key]) {
            groupedSessions[key] = {
              day: new Date(booking.day).toLocaleDateString("en-US", { weekday: "long" }),
              startTime: booking.startTime,
              endTime: booking.endTime,
              students: [],
            };
          }
          groupedSessions[key].students.push({
            name: booking.studentId.name,
            comment: booking.comment,
          });
        });

        setSessions(Object.values(groupedSessions));
      } catch (error) {
        console.error("Error fetching tutor sessions:", error);
      }
    };

    const fetchPastSessions = async () => {
      try {
        const { data } = await API.get("/bookings/tutor/history");
        setPastSessions(data);
      } catch (error) {
        console.error("Error fetching past sessions:", error);
      }
    };

    if (user?.role === "tutor") {
      fetchTutorAvailability();
      fetchSessions();
      fetchPastSessions();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <div className="flex h-screen">
      <aside className="w-1/5 min-w-[250px] bg-blue-500 text-white p-6 h-screen sticky top-0 flex flex-col">
        <h2 className="text-xl font-bold">Tutor Dashboard</h2>
        <ul className="mt-6">
          <li className={`p-2 cursor-pointer ${activeTab === "upcoming" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("upcoming")}>Upcoming Sessions</li>
          <li className={`p-2 cursor-pointer ${activeTab === "history" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("history")}>My Sessions</li>
        </ul>
        <button className="mt-auto bg-red-600 hover:bg-red-700 text-white p-2 rounded" onClick={handleLogout}>Logout</button>
      </aside>

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h2>

        {activeTab === "upcoming" ? (
          <>
            <h3 className="text-2xl font-semibold mb-4">Available Sessions</h3>
            {sessions.length === 0 ? (
              <p className="text-gray-500">No available sessions.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold text-blue-900">
                      {session.day} {tutorAvailability[session.day] ? "(Available)" : "(Not Available)"}
                    </h4>
                    <h4 className="text-lg font-bold text-blue-700">{session.startTime} - {session.endTime}</h4>
                    <p className="mt-2 font-semibold">Students Attending: {session.students.length}</p>
                    <ul className="mt-2">
                      {session.students.map((student, idx) => (
                        <li key={idx} className="text-gray-700">
                          <strong>{student.name}</strong>: {student.comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-4">My Sessions (Past)</h3>
            {pastSessions.length === 0 ? (
              <p className="text-gray-500">No past sessions.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastSessions.map((session, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold text-blue-900">{new Date(session.day).toLocaleDateString("en-US", { weekday: "long" })}</h4>
                    <h4 className="text-lg font-bold text-blue-700">{session.startTime} - {session.endTime}</h4>
                    <p className="mt-2 font-semibold">Students Attended: {session.students.length}</p>
                    <ul className="mt-2">
                      {session.students.map((student, idx) => (
                        <li key={idx} className="text-gray-700">
                          <strong>{student.name}</strong>: {student.comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;
