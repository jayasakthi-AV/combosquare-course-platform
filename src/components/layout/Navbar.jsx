import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  return (
    <nav className="w-full fixed top-0 left-0 z-[9999] bg-purple-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-[9999]">

        {/* LOGO */}
        <Logo />

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex space-x-10 font-semibold text-white">

          {/* HOME */}
          <Link
            to="/"
            className="relative group cursor-pointer px-3 py-1 rounded-full hover:bg-white hover:text-purple-700 transition-colors"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-300 
              transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* DOMAINS DROPDOWN */}
          <div
            className="relative group z-50"
            onMouseEnter={() => setDropdownOpen("domains")}
            onMouseLeave={() => setDropdownOpen("")}
          >
            <button className="relative px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white hover:text-purple-700 transition-colors">
              Domains
              <span className="text-xs">{dropdownOpen === "domains" ? "▲" : "▼"}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-300 transition-all duration-300 group-hover:w-full" />
            </button>

            <div className="absolute left-0 top-full h-4 w-full"></div>

            <div
              className="absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
              transition-opacity duration-200 z-50 flex flex-col"
            >
              <Link to="/domains/technology" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                Technology & IT
              </Link>
              <Link to="/domains/programming" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                Programming Fundamentals
              </Link>
              <Link to="/domains/engineering" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                Engineering & Automation
              </Link>
              <Link to="/domains/business" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                Business & Creativity
              </Link>
            </div>
          </div>

          {/* PROGRAMS DROPDOWN — FIXED */}
          <div
            className="relative group z-50"
            onMouseEnter={() => setDropdownOpen("programs")}
            onMouseLeave={() => setDropdownOpen("")}
          >
            <button className="relative px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white hover:text-purple-700 transition-colors">
              Programs
              <span className="text-xs">{dropdownOpen === "programs" ? "▲" : "▼"}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-300 transition-all duration-300 group-hover:w-full" />
            </button>

            <div className="absolute left-0 top-full h-4 w-full"></div>

            <div
              className="absolute left-0 top-full mt-4 w-80 bg-white shadow-lg rounded-lg py-3
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
              transition-opacity duration-200 z-50 flex flex-col"
            >
              <Link to="/program/full-stack" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                Full Stack Developer Program
              </Link>

              <Link to="/program/ai-foundations" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                AI Foundations
              </Link>

              <Link to="/program/data-science" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                Data Science Starter
              </Link>

              <Link to="/program/ui-ux" className="px-4 py-2 text-purple-700 hover:bg-purple-100">
                UI/UX Design Essentials
              </Link>
            </div>
          </div>

         {/* CAREERS */}
<div
  className="relative group z-50"
  onMouseEnter={() => setDropdownOpen("careers")}
  onMouseLeave={() => setDropdownOpen("")}
>
  <button className="relative px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white hover:text-purple-700 transition-colors">
    Careers
    <span className="text-xs">{dropdownOpen === "careers" ? "▲" : "▼"}</span>
    <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-300 transition-all duration-300 group-hover:w-full" />
  </button>

  <div className="absolute left-0 top-full h-4 w-full"></div>

  <div
    className="absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg py-3
    opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
    transition-opacity duration-200 z-50 flex flex-col"
  >
    <Link to="/careers/jobs" className="px-4 py-2 text-purple-700 hover:bg-purple-100 hover:text-purple-900">
      Jobs
    </Link>
    <Link to="/careers/internships" className="px-4 py-2 text-purple-700 hover:bg-purple-100 hover:text-purple-900">
      Internships
    </Link>
    <Link to="/careers/webinars" className="px-4 py-2 text-purple-700 hover:bg-purple-100 hover:text-purple-900">
      Webinars
    </Link>
    <Link to="/careers/training" className="px-4 py-2 text-purple-700 hover:bg-purple-100 hover:text-purple-900">
      Training
    </Link>
    <Link to="/careers/workshops" className="px-4 py-2 text-purple-700 hover:bg-purple-100 hover:text-purple-900">
      Workshops
    </Link>
  </div>
</div>

          {/* CONTACT */}
          <Link
            to="/contact"
            className="relative group px-3 py-1 rounded-full hover:bg-white hover:text-purple-700 transition-colors"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-cyan-300 
              transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login" className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-700 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="px-5 py-2 rounded-full bg-white text-purple-700 font-semibold shadow-md hover:bg-gray-100 transition-colors">
            Sign Up
          </Link>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-3xl text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-purple-900 text-white shadow-xl border-t border-purple-500">
          <div className="flex flex-col p-5 space-y-4 font-semibold">

            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>

            {/* DOMAINS MOBILE */}
            <details className="w-full">
              <summary className="cursor-pointer py-2 flex justify-between items-center">
                Domains <span>▼</span>
              </summary>
              <div className="pl-4 mt-2 flex flex-col space-y-2 text-white/80">
                <Link to="/domains/technology" onClick={() => setMobileOpen(false)}>Technology & IT</Link>
                <Link to="/domains/programming" onClick={() => setMobileOpen(false)}>Programming Fundamentals</Link>
                <Link to="/domains/engineering" onClick={() => setMobileOpen(false)}>Engineering & Automation</Link>
                <Link to="/domains/business" onClick={() => setMobileOpen(false)}>Business & Creativity</Link>
              </div>
            </details>

            {/* PROGRAMS MOBILE */}
            <details className="w-full">
              <summary className="cursor-pointer py-2 flex justify-between items-center">
                Programs <span>▼</span>
              </summary>
              <div className="pl-4 mt-2 space-y-2 text-white/80">
                <Link to="/program/full-stack" onClick={() => setMobileOpen(false)}>Full Stack Developer Program</Link>
                <Link to="/program/ai-foundations" onClick={() => setMobileOpen(false)}>AI Foundations</Link>
                <Link to="/program/data-science" onClick={() => setMobileOpen(false)}>Data Science Starter</Link>
                <Link to="/program/ui-ux" onClick={() => setMobileOpen(false)}>UI/UX Design Essentials</Link>
              </div>
            </details>

            {/* CAREERS MOBILE */}
            <details className="w-full">
              <summary className="cursor-pointer py-2 flex justify-between items-center">
                Careers <span>▼</span>
              </summary>
              <div className="pl-4 mt-2 space-y-2 text-white/80">
                <p>Jobs</p>
                <p>Internships</p>
                <p>Webinars</p>
                <p>Training</p>
                <p>Workshops</p>
              </div>
            </details>

            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>

            {/* MOBILE LOGIN/SIGNUP */}
            <div className="flex flex-col gap-3 pt-3">
              <Link to="/login" className="w-full py-2 border border-white rounded-full text-white text-center hover:bg-white hover:text-purple-700 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="w-full py-2 bg-white text-purple-700 rounded-full text-center hover:bg-gray-100 transition-colors">
                Sign Up
              </Link>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
