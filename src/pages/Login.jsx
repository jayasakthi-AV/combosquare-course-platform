import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import heroImg from "../assets/login-hero.png";

// ─────────────────────────────────────────────────────────────
// BACKEND SETUP REQUIRED FOR GOOGLE OAUTH:
//
// 1. Go to https://console.cloud.google.com/
//    → Create a project → APIs & Services → Credentials
//    → Create OAuth 2.0 Client ID (Web application)
//    → Add Authorized redirect URI:
//       http://localhost:8000/auth/google/callback  (dev)
//       https://yourdomain.com/auth/google/callback (prod)
//
// 2. Add to your .env:
//    GOOGLE_CLIENT_ID=your_client_id
//    GOOGLE_CLIENT_SECRET=your_client_secret
//
// 3. Create backend endpoints:
//    GET  /auth/google           → redirects to Google OAuth
//    GET  /auth/google/callback  → exchanges code, returns { access_token, user }
//
// FastAPI example using authlib:
//   pip install authlib httpx
//   See: https://docs.authlib.org/en/latest/integrations/fastapi.html
//
// BACKEND SETUP REQUIRED FOR FORGOT PASSWORD:
//    POST /auth/forgot-password  body: { email }
//    → sends reset email, returns { message: "..." }
// ─────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Forgot Password Modal ──────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setStatus("success");
      setMessage(
        data.message ||
          "If this email exists, a reset link has been sent. Check your inbox."
      );
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to send reset email. Try again.");
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Forgot Password?</h3>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 text-sm mb-6">{message}</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {message}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your registered email"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Login Page ─────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Handle Google OAuth callback: ?token=xxx&user=xxx in URL
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("token", response.access_token);

      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Redirect browser to backend Google OAuth endpoint
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <>
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}

      <div className="w-full min-h-screen flex bg-white">
        {/* ── Left Hero Panel ── */}
        <div className="hidden lg:flex w-1/2 relative">
          <img
            src={heroImg}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-800/80 to-purple-900/80" />
          <div className="relative z-10 p-12 text-white w-full max-w-lg pt-24">
            <h1 className="text-4xl font-extrabold leading-tight mb-6">
              Learn the <span className="text-purple-300">Skills</span> <br />
              That Get You <span className="text-purple-300">Hired</span>
            </h1>
            <p className="text-purple-100 mb-6">
              ComboSquare helps you become a job-ready developer with mentorship,
              real-world projects, and interview preparation.
            </p>
            <div className="space-y-3 mt-6">
              {["1:1 Mentorship", "Hands-on Projects", "Internship Support", "Job Preparation Training"].map((item) => (
                <div key={item} className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
                  ✔ {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-600 mt-1">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600 font-semibold">
                Signup
              </Link>
            </p>

            {/* Google Login — now active */}
            <button
              onClick={handleGoogleLogin}
              className="w-full mt-6 py-3 border rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition font-medium text-gray-700"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5"
                alt="google"
              />
              Sign in with Google
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-300" />
              <p className="text-gray-500 text-sm">Or Login with Email</p>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter your password"
                />
                {/* Forgot Password — now opens modal */}
                <p
                  onClick={() => setShowForgotPassword(true)}
                  className="text-right text-sm mt-1 text-purple-600 cursor-pointer hover:underline"
                >
                  Forgot password?
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="text-gray-600 text-sm">
                  Keep me logged in
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
