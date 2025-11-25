import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/login-hero.png"; // your illustration

export default function Signup() {
  return (
    
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white ">

      {/* LEFT SIDE (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative">

        {/* Background Image */}
        <img
          src={heroImg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-90 "
        />

        {/* Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-800/80 to-purple-900/80"></div>

        {/* TEXT OVER IMAGE */}
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

          {/* Feature Pills */}
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

      {/* RIGHT SIDE - SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 mt-20 lg:mt-0">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
          <p className="text-gray-600 mt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold">
              Login
            </Link>
          </p>

          {/* Google Signup */}
          <button className="w-full mt-6 py-3 border rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="google"
            />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="text-gray-500 text-sm">Or Sign Up with Email</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Signup Form */}
          <form className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your password"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your mobile number"
              />
            </div>

            <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
              Sign Up
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
