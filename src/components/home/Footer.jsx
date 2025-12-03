import React from "react";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "../../assets/logo.png"; // Change to your logo path

export default function Footer() {
  return (
    <footer className="bg-[#0F0A21] text-gray-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 mb-14">

          {/* LOGO + ABOUT */}
          <div className="">
            <img src={logo} alt="Logo" className="h-12 mb-4" />

            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Learn smarter, build real skills, and become job-ready with 
              expert-led courses and practical learning paths.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-5">
              <a href="#" className="hover:text-purple-400 transition">
                <Facebook size={22} />
              </a>
              <a href="#" className="hover:text-purple-400 transition">
                <Instagram size={22} />
              </a>
              <a href="#" className="hover:text-purple-400 transition">
                <Linkedin size={22} />
              </a>
              <a href="#" className="hover:text-purple-400 transition">
                <Youtube size={22} />
              </a>
            </div>
          </div>

          {/* COURSES */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Courses</h3>
            <ul className="space-y-2">
              <li className="hover:text-purple-400 cursor-pointer">Full Stack Development</li>
              <li className="hover:text-purple-400 cursor-pointer">Data Science</li>
              <li className="hover:text-purple-400 cursor-pointer">UI/UX Design</li>
              <li className="hover:text-purple-400 cursor-pointer">AI / Machine Learning</li>
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

        {/* BOTTOM LINE */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>© 2025 Combosquare. All rights reserved.</p>

          <p className="mt-2 md:mt-0">
            Made with ❤️ for learners across India.
          </p>
        </div>

      </div>
    </footer>
  );
}
