// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminStats,
  getAllUsers,
  getAllEnrollments,
  getAllContacts,
  logout
} from "../services/api";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, enrollData, contactData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getAllEnrollments(),
        getAllContacts()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setEnrollments(enrollData);
      setContacts(contactData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      await fetchAll();
    } catch (err) {
      alert("Failed to update user status");
    }
  };
  const handleMakeAdmin = async (userId) => {
    const confirmed = window.confirm(
      "Promote this user to Admin? They will have full access to the admin panel."
    );
    if (!confirmed) return;
    try {
      await api.put(`/admin/users/${userId}/make-admin`);
      await fetchAll();
      alert("User promoted to Admin successfully! They need to logout and login again.");
    } catch (err) {
      alert("Failed to promote user");
    }
  };

  const handleMarkRead = async (contactId) => {
    try {
      await api.put(`/contact/${contactId}/read`);
      await fetchAll();
    } catch (err) {
      alert("Failed to mark as read");
    }
  };

  const handleMarkResolved = async (contactId) => {
    try {
      await api.put(`/contact/${contactId}/resolve`);
      await fetchAll();
    } catch (err) {
      alert("Failed to mark as resolved");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        <div className="p-4">
          <div className="bg-red-50 rounded-xl p-3 mb-6 text-center">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mx-auto">
              A
            </div>
            <p className="text-sm font-semibold text-gray-800 mt-2">Admin</p>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Administrator</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: "📊", badge: null },
              { id: "users", label: "Users", icon: "👥", badge: users.length },
              { id: "enrollments", label: "Enrollments", icon: "📚", badge: enrollments.length },
              { id: "contacts", label: "Messages", icon: "📬", badge: stats?.unread_contacts || 0 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium transition ${
                  activeTab === item.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-purple-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.id
                      ? "bg-white text-purple-600"
                      : "bg-purple-100 text-purple-600"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-sm text-gray-500 hover:bg-gray-50 mb-1"
          >
            <span>🎓</span> Student View
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-sm text-red-500 hover:bg-red-50"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="ml-64 flex-1 p-8">

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 mb-8">Platform overview and key metrics.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Users", value: stats?.total_users, icon: "👥", color: "bg-blue-500" },
                { label: "Programs", value: stats?.total_programs, icon: "📚", color: "bg-purple-500" },
                { label: "Enrollments", value: stats?.total_enrollments, icon: "🎓", color: "bg-green-500" },
                { label: "Messages", value: stats?.total_contacts, icon: "📬", color: "bg-orange-500" },
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

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "New Users This Week", value: stats?.new_users_this_week, icon: "🆕", color: "bg-teal-500" },
                { label: "Active Enrollments", value: stats?.active_enrollments, icon: "⚡", color: "bg-yellow-500" },
                { label: "Completed", value: stats?.completed_enrollments, icon: "✅", color: "bg-green-600" },
                { label: "Unread Messages", value: stats?.unread_contacts, icon: "🔔", color: "bg-red-500" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-white text-sm mb-2`}>
                    {stat.icon}
                  </div>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Users */}
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Signups</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.slice(0, 5).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                            {user.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{user.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-purple-100 text-purple-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {user.is_active ? "Active" : "Blocked"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === "users" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              All Users
              <span className="ml-3 text-sm font-normal text-gray-500">{users.length} total</span>
            </h1>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Mobile</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                            {user.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{user.full_name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.mobile || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-purple-100 text-purple-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {user.is_active ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
  {user.role !== "admin" && (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => handleToggleUser(user.id)}
        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
          user.is_active
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-green-50 text-green-600 hover:bg-green-100"
        }`}
      >
        {user.is_active ? "Block" : "Unblock"}
      </button>

      <button
        onClick={() => handleMakeAdmin(user.id)}
        className="text-xs px-3 py-1.5 rounded-lg font-medium transition bg-purple-50 text-purple-600 hover:bg-purple-100"
      >
        Make Admin
      </button>
    </div>
  )}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Enrollments Tab ── */}
        {activeTab === "enrollments" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              All Enrollments
              <span className="ml-3 text-sm font-normal text-gray-500">{enrollments.length} total</span>
            </h1>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Program</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Enrolled On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800 text-sm">{enrollment.program?.title}</p>
                        <p className="text-xs text-gray-400">{enrollment.program?.level} • {enrollment.program?.duration}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">User #{enrollment.user_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          enrollment.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(enrollment.enrolled_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Contacts Tab ── */}
        {activeTab === "contacts" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Contact Messages
              <span className="ml-3 text-sm font-normal text-gray-500">
                {stats?.unread_contacts} unread
              </span>
            </h1>
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-gray-600">No messages yet.</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${
                      !contact.is_read
                        ? "border-purple-500"
                        : contact.is_resolved
                        ? "border-green-400"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-800">{contact.name}</h3>
                          {!contact.is_read && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                              New
                            </span>
                          )}
                          {contact.is_resolved && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{contact.email} {contact.mobile && `• ${contact.mobile}`}</p>
                        <p className="text-gray-700 mt-2 text-sm">{contact.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(contact.submitted_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!contact.is_read && (
                          <button
                            onClick={() => handleMarkRead(contact.id)}
                            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
                          >
                            Mark Read
                          </button>
                        )}
                        {!contact.is_resolved && (
                          <button
                            onClick={() => handleMarkResolved(contact.id)}
                            className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}