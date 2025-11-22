import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Logo />

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex space-x-10 font-semibold text-purple-700">

          {/* HOME */}
          <Link
            to="/"
            className="relative group cursor-pointer px-3 py-1 rounded-full
              hover:bg-purple-700 hover:text-white transition-colors"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 
              transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* ---------------- DOMAINS ---------------- */}
          <div className="relative group z-50">
            <button
              className="relative px-3 py-1 rounded-full flex items-center gap-1
                hover:bg-purple-700 hover:text-white transition-colors"
              onMouseEnter={() => setDropdownOpen("domains")}
              onMouseLeave={() => setDropdownOpen("")}
            >
              Domains
              <span className="text-xs transition-transform duration-200">
                {dropdownOpen === "domains" ? "▲" : "▼"}
              </span>

              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 
                transition-all duration-300 group-hover:w-full" />
            </button>

            {/* INVISIBLE BRIDGE */}
            <div className="absolute left-0 top-full h-4 w-full"></div>

            {/* DROPDOWN */}
            <div
              className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3 
                opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                transition-opacity duration-200 z-50`}
            >
              <Link to="/domains/technology" className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Technology & IT
              </Link>
              <Link to="/domains/programming" className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Programming Fundamentals
              </Link>
              <Link to="/domains/engineering" className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Engineering & Automation
              </Link>
              <Link to="/domains/business" className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Business & Creativity
              </Link>
            </div>
          </div>

          {/* ---------------- PROGRAMS ---------------- */}
          <div className="relative group z-50">
            <button
              className="relative px-3 py-1 rounded-full flex items-center gap-1
                hover:bg-purple-700 hover:text-white transition-colors"
              onMouseEnter={() => setDropdownOpen("programs")}
              onMouseLeave={() => setDropdownOpen("")}
            >
              Programs
              <span className="text-xs transition-transform duration-200">
                {dropdownOpen === "programs" ? "▲" : "▼"}
              </span>

              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 
                transition-all duration-300 group-hover:w-full" />
            </button>

            {/* INVISIBLE BRIDGE */}
            <div className="absolute left-0 top-full h-4 w-full"></div>

            {/* DROPDOWN */}
            <div
              className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3 
                opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                transition-opacity duration-200 z-50`}
            >
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Full Stack Developer Program
              </Link>
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                AI Foundations
              </Link>
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Data Science Starter
              </Link>
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                UI/UX Design Essentials
              </Link>
            </div>
          </div>

          {/* ---------------- CAREERS ---------------- */}
          <div className="relative group z-50">
            <button
              className="relative px-3 py-1 rounded-full flex items-center gap-1
                hover:bg-purple-700 hover:text-white transition-colors"
              onMouseEnter={() => setDropdownOpen("careers")}
              onMouseLeave={() => setDropdownOpen("")}
            >
              Careers
              <span className="text-xs transition-transform duration-200">
                {dropdownOpen === "careers" ? "▲" : "▼"}
              </span>

              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 
                transition-all duration-300 group-hover:w-full" />
            </button>

            {/* INVISIBLE BRIDGE */}
            <div className="absolute left-0 top-full h-4 w-full"></div>

            {/* DROPDOWN */}
            <div
              className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3 
                opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                transition-opacity duration-200 z-50`}
            >
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Jobs
              </Link>
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Internships
              </Link>
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Webinars
              </Link>
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Training
              </Link>
              <Link className="block px-4 py-2 text-black hover:bg-purple-100 hover:text-purple-700">
                Workshops
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <Link
            to="/contact"
            className="relative group cursor-pointer px-3 py-1 rounded-full
              hover:bg-purple-700 hover:text-white transition-colors"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 
              transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 rounded-full border border-purple-700 text-purple-700
            hover:bg-purple-700 hover:text-white transition-colors">
            Login
          </button>

          <button className="px-5 py-2 rounded-full bg-purple-600 text-white font-semibold shadow-md
            hover:bg-purple-800 transition-colors">
            Sign Up
          </button>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-3xl text-purple-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>

      </div>
    </nav>
  );
}
