import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/login-hero.png"; // replace with your custom image

export default function Login() {
  return (
    <div className="w-full min-h-screen flex bg-white">

      {/* LEFT SIDE WITH TEXT ON TOP OF ILLUSTRATION */}
<div className="hidden lg:flex w-1/2 relative">

{/* BACKGROUND IMAGE */}
<img
  src={heroImg}
  alt="Hero"
  className="absolute inset-0 w-full h-full object-cover opacity-90"
/>

{/* DARK OVERLAY FOR READABILITY */}
<div className="absolute inset-0 bg-gradient-to-b from-purple-800/80 to-purple-900/80"></div>

{/* CONTENT ON TOP OF IMAGE */}
<div className="relative z-10 p-12 text-white w-full max-w-lg pt-24">


  <h1 className="text-4xl font-extrabold leading-tight mb-6">
    Learn the <span className="text-purple-300">Skills</span> <br />
    That Get You <span className="text-purple-300">Hired</span>
  </h1>

  <p className="text-purple-100 mb-6">
    ComboSquare helps you become a job-ready developer with mentorship, 
    real-world projects, and interview preparation.
  </p>

  {/* Feature Pills */}
  <div className="space-y-3 mt-6">
    <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
      ✔ 1:1 Mentorship
    </div>

    <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
      ✔ Hands-on Projects
    </div>

    <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
      ✔ Internship Support
    </div>

    <div className="bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/20">
      ✔ Job Preparation Training
    </div>
  </div>

</div>
</div>


      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-gray-900">Login</h2>
          <p className="text-gray-600 mt-1">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-semibold">
              Signup
            </Link>
          </p>

          {/* GOOGLE LOGIN */}
          <button className="w-full mt-6 py-3 border rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="google"
            />
            Sign in with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="text-gray-500 text-sm">Or Login with Email</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* EMAIL LOGIN FORM */}
          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your password"
              />
              <p className="text-right text-sm mt-1 text-purple-600 cursor-pointer hover:underline">
                Forgot password?
              </p>
            </div>

            <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
              Login
            </button>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" />
              <p className="text-gray-600 text-sm">Keep me logged in</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
