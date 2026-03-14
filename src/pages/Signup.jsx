import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import heroImg from "../assets/login-hero.png";

export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await signup(
        formData.fullName,
        formData.email,
        formData.password,
        formData.mobile || null
      );
      console.log("Signup successful:", response.user);
      
      // New users are always students
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.detail || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={heroImg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-purple-800/80 to-purple-900/80"></div>
        
        <div className="relative z-10 p-12 text-white w-full max-w-lg pt-24">
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            Start Your
            <span className="text-violet-300"> Learning </span><br />
            Journey with
            <span className="text-violet-300"> ComboSquare</span>
          </h1>

          <p className="text-purple-100 mb-6">
            Upgrade your skills with hands-on projects, expert mentorship,
            and job-focused training.
          </p>

          <div className="space-y-3 mt-6">
            <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
              ✔ Beginner Friendly
            </div>
            <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
              ✔ Real-world Projects
            </div>
            <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
              ✔ Industry-level Training
            </div>
            <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
              ✔ Certificate of Completion
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 mt-20 lg:mt-0">
        <div className="w-full max-w-md">
          
          <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
          <p className="text-gray-600 mt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold">
              Login
            </Link>
          </p>

          <button className="w-full mt-6 py-3 border rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition opacity-50 cursor-not-allowed">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="google"
            />
            Sign up with Google (Coming Soon)
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="text-gray-500 text-sm">Or Sign Up with Email</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
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
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your mobile number (optional)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
