import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  return (
    <nav className="w-full fixed top-0 left-0 z-[9999] bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-[9999]">

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

          {/* DOMAINS */}
          <div
            className="relative group z-50"
            onMouseEnter={() => setDropdownOpen("domains")}
            onMouseLeave={() => setDropdownOpen("")}
          >
            <button
              className="relative px-3 py-1 rounded-full flex items-center gap-1
              hover:bg-purple-700 hover:text-white transition-colors"
            >
              Domains
              <span className="text-xs">{dropdownOpen === "domains" ? "▲" : "▼"}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </button>

            <div className="absolute left-0 top-full h-4 w-full"></div>

            <div
              className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3 
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
              transition-opacity duration-200 z-50`}
            >
              <Link to="/domains/technology" className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Technology & IT</Link>
              <Link to="/domains/programming" className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Programming Fundamentals</Link>
              <Link to="/domains/engineering" className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Engineering & Automation</Link>
              <Link to="/domains/business" className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Business & Creativity</Link>
            </div>
          </div>

          {/* PROGRAMS */}
          <div
            className="relative group z-50"
            onMouseEnter={() => setDropdownOpen("programs")}
            onMouseLeave={() => setDropdownOpen("")}
          >
            <button
              className="relative px-3 py-1 rounded-full flex items-center gap-1
              hover:bg-purple-700 hover:text-white transition-colors"
            >
              Programs
              <span className="text-xs">{dropdownOpen === "programs" ? "▲" : "▼"}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </button>

            <div className="absolute left-0 top-full h-4 w-full"></div>

            <div
              className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3 
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
              transition-opacity duration-200 z-50`}
            >
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Full Stack Developer Program</p>
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">AI Foundations</p>
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Data Science Starter</p>
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">UI/UX Design Essentials</p>
            </div>
          </div>

          {/* CAREERS */}
          <div
            className="relative group z-50"
            onMouseEnter={() => setDropdownOpen("careers")}
            onMouseLeave={() => setDropdownOpen("")}
          >
            <button
              className="relative px-3 py-1 rounded-full flex items-center gap-1
              hover:bg-purple-700 hover:text-white transition-colors"
            >
              Careers
              <span className="text-xs">{dropdownOpen === "careers" ? "▲" : "▼"}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </button>

            <div className="absolute left-0 top-full h-4 w-full"></div>

            <div
              className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3 
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
              transition-opacity duration-200 z-50`}
            >
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Jobs</p>
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Internships</p>
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Webinars</p>
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Training</p>
              <p className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700">Workshops</p>
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

        {/* DESKTOP BUTTONS — FIXED */}
        <div className="hidden md:flex space-x-4">

          <Link
            to="/login"
            className="px-4 py-2 rounded-full border border-purple-700 text-purple-700
            hover:bg-purple-700 hover:text-white transition-colors"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-full bg-purple-600 text-white font-semibold shadow-md
            hover:bg-purple-800 transition-colors"
          >
            Sign Up
          </Link>

        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-3xl text-purple-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-xl border-t">
          <div className="flex flex-col p-5 space-y-4 text-purple-700 font-semibold">

            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>

            <details>
              <summary className="cursor-pointer flex justify-between items-center">Domains ▼</summary>
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/domains/technology" onClick={() => setMobileOpen(false)}>Technology & IT</Link>
                <Link to="/domains/programming" onClick={() => setMobileOpen(false)}>Programming Fundamentals</Link>
                <Link to="/domains/engineering" onClick={() => setMobileOpen(false)}>Engineering & Automation</Link>
                <Link to="/domains/business" onClick={() => setMobileOpen(false)}>Business & Creativity</Link>
              </div>
            </details>

            <details>
              <summary className="cursor-pointer flex justify-between items-center">Programs ▼</summary>
              <div className="pl-4 mt-2 space-y-2">
                <p>Full Stack Developer Program</p>
                <p>AI Foundations</p>
                <p>Data Science Starter</p>
                <p>UI/UX Design Essentials</p>
              </div>
            </details>

            <details>
              <summary className="cursor-pointer flex justify-between items-center">Careers ▼</summary>
              <div className="pl-4 mt-2 space-y-2">
                <p>Jobs</p>
                <p>Internships</p>
                <p>Webinars</p>
                <p>Training</p>
                <p>Workshops</p>
              </div>
            </details>

            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>

            {/* MOBILE BUTTONS */}
            <div className="flex flex-col gap-3 pt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-2 border border-purple-700 rounded-full text-purple-700 text-center">Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full py-2 bg-purple-600 text-white rounded-full text-center">Sign Up</Link>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
