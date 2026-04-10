// src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStudentDashboard,
  getAvailablePrograms,
  enrollInProgram,
  updateProgress,
  logout,
  getUser
} from "../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [error, setError] = useState("");

  const user = getUser();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getStudentDashboard();
      setDashboardData(data);
      const available = await getAvailablePrograms();
      setAvailablePrograms(available.available_programs);
    } catch (err) {
      setError("Failed to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (programId) => {
    try {
      setEnrolling(programId);
      await enrollInProgram(programId);
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.detail || "Enrollment failed");
    } finally {
      setEnrolling(null);
    }
  };

  const handleProgressUpdate = async (enrollmentId, newProgress) => {
    try {
      await updateProgress(enrollmentId, newProgress);
      await fetchDashboard();
    } catch (err) {
      alert("Failed to update progress");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <div className="w-64 bg-white shadow-lg fixed h-full z-10">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-purple-700">ComboSquare</h2>
          <p className="text-sm text-gray-500 mt-1">Student Portal</p>
        </div>

        <div className="p-4">
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
              {dashboardData?.profile?.full_name?.charAt(0).toUpperCase()}
            </div>
            <p className="text-center font-semibold text-gray-800 mt-2 text-sm">
              {dashboardData?.profile?.full_name}
            </p>
            <p className="text-center text-xs text-gray-500 truncate">
              {dashboardData?.profile?.email}
            </p>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "courses", label: "My Courses", icon: "📚" },
              { id: "browse", label: "Browse Programs", icon: "🔍" },
              { id: "profile", label: "My Profile", icon: "👤" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition ${
                  activeTab === item.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-purple-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="ml-64 flex-1 p-8">

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, {dashboardData?.profile?.full_name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mb-8">Here's your learning progress at a glance.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Enrolled", value: dashboardData?.stats?.total_enrolled, color: "bg-purple-500", icon: "📚" },
                { label: "Completed", value: dashboardData?.stats?.completed, color: "bg-green-500", icon: "✅" },
                { label: "In Progress", value: dashboardData?.stats?.in_progress, color: "bg-blue-500", icon: "⏳" },
                { label: "Avg Progress", value: `${dashboardData?.stats?.average_progress}%`, color: "bg-orange-500", icon: "📈" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white text-lg mb-3`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Courses */}
            <h2 className="text-lg font-bold text-gray-800 mb-4">Continue Learning</h2>
            {dashboardData?.enrolled_programs?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-600 font-medium">You haven't enrolled in any program yet.</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                >
                  Browse Programs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData?.enrolled_programs?.slice(0, 4).map((program) => (
                  <div key={program.enrollment_id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{program.title}</h3>
                        <p className="text-sm text-gray-500">{program.duration} • {program.level}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        program.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {program.status}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-semibold text-purple-600">{program.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h1>
            {dashboardData?.enrolled_programs?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-600">No courses enrolled yet.</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700"
                >
                  Browse Programs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.enrolled_programs?.map((program) => (
                  <div key={program.enrollment_id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-800">{program.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            program.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {program.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{program.duration} • {program.level}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${program.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-purple-600 w-12">{program.progress}%</span>
                        </div>
                      </div>

                      {/* Progress updater */}
                      {program.status !== "completed" && (
                        <div className="ml-6 flex flex-col gap-2">
                          <p className="text-xs text-gray-500 text-center">Update Progress</p>
                          <div className="flex gap-1">
                            {[25, 50, 75, 100].map((val) => (
                              <button
                                key={val}
                                onClick={() => handleProgressUpdate(program.enrollment_id, val)}
                                className={`text-xs px-2 py-1 rounded-lg border transition ${
                                  program.progress >= val
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "text-gray-500 border-gray-200 hover:border-purple-400"
                                }`}
                              >
                                {val}%
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Browse Programs Tab */}
        {activeTab === "browse" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Browse Programs</h1>
            <p className="text-gray-500 mb-6">Enroll in a new program to start learning.</p>
            {availablePrograms.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <p className="text-4xl mb-3">🎉</p>
                <p className="text-gray-600 font-medium">You're enrolled in all available programs!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePrograms.map((program) => (
                  <div key={program.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <h3 className="font-bold text-gray-800 mb-1">{program.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{program.subtitle}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{program.level}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{program.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {program.tools?.slice(0, 4).map((tool) => (
                        <span key={tool} className="text-xs bg-gray-50 border text-gray-600 px-2 py-1 rounded-lg">{tool}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleEnroll(program.id)}
                      disabled={enrolling === program.id}
                      className="w-full py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      {enrolling === program.id ? "Enrolling..." : "Enroll Now"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm max-w-lg">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                {dashboardData?.profile?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-800 font-semibold mt-1">{dashboardData?.profile?.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-gray-800 font-semibold mt-1">{dashboardData?.profile?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile</label>
                  <p className="text-gray-800 font-semibold mt-1">{dashboardData?.profile?.mobile || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {dashboardData?.profile?.role}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-800 font-semibold mt-1">
                    {new Date(dashboardData?.profile?.member_since).toLocaleDateString("en-IN", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}