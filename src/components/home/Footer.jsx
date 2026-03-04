import React from "react";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F0A21] text-gray-300 overflow-hidden">

      {/* BRAND STRIP */}
      <div className="relative w-full h-[90px] sm:h-[140px] md:h-[220px] 
                flex items-center justify-center overflow-hidden px-3 sm:px-6">

  <h1
    className="
      flex items-center justify-center
      text-[11.5vw] sm:text-[10.5vw] md:text-[9vw]

      font-extrabold
      tracking-[0em] sm:tracking-[0.0em] md:tracking-[0.15em]
      text-white/10
      whitespace-nowrap
      leading-none
      select-none
    "
  >
    {"COMBO SQUARE".split("").map((char, i) => (
      <span
        key={i}
        className="transition-colors duration-300 hover:text-purple-600"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </h1>
</div>


      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-6 md:pt-0 pb-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 mb-14">

          {/* ABOUT */}
          <div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Learn smarter, build real skills, and become job-ready with
              expert-led courses and practical learning paths.
            </p>

            <div className="flex gap-4 mt-6">
              <Facebook size={22} className="hover:text-purple-400 cursor-pointer" />
              <Instagram size={22} className="hover:text-purple-400 cursor-pointer" />
              <Linkedin size={22} className="hover:text-purple-400 cursor-pointer" />
              <Youtube size={22} className="hover:text-purple-400 cursor-pointer" />
            </div>
          </div>

          {/* COURSES */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Courses</h3>
            <ul className="space-y-2">
              <li className="hover:text-purple-400 cursor-pointer">Full Stack Development</li>
              <li className="hover:text-purple-400 cursor-pointer">Data Science</li>
              <li className="hover:text-purple-400 cursor-pointer">UI / UX Design</li>
              <li className="hover:text-purple-400 cursor-pointer">AI & Machine Learning</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li className="hover:text-purple-400 cursor-pointer">About Us</li>
              <li className="hover:text-purple-400 cursor-pointer">Careers</li>
              <li className="hover:text-purple-400 cursor-pointer">Blog</li>
              <li className="hover:text-purple-400 cursor-pointer">Partners</li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="hover:text-purple-400 cursor-pointer">Help Center</li>
              <li className="hover:text-purple-400 cursor-pointer">Contact Us</li>
              <li className="hover:text-purple-400 cursor-pointer">Refund Policy</li>
              <li className="hover:text-purple-400 cursor-pointer">Terms & Privacy</li>
            </ul>
          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>© 2025 ComboSquare. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for learners across India.</p>
        </div>

      </div>
    </footer>
  );
}
