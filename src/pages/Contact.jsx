import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Footer from "../components/home/Footer";

export default function ContactPage() {
  return (
    <div className="w-full bg-white relative overflow-hidden">

      {/* BEAUTIFUL BACKGROUND BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[280px] md:w-[350px] h-[280px] md:h-[350px] bg-purple-300 opacity-30 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-[-140px] right-[-140px] w-[320px] md:w-[400px] h-[320px] md:h-[400px] bg-purple-400 opacity-30 blur-[140px] rounded-full"></div>

      {/* CONTACT SECTION */}
      <div className="py-16 md:py-20 px-5 sm:px-6 md:px-12 lg:px-24 relative z-10">

        {/* PAGE TITLE */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-purple-900 text-transparent bg-clip-text">
          Get in Touch
        </h2>

        <p className="text-gray-600 text-center mt-3 text-base sm:text-lg max-w-2xl mx-auto px-4">
          We're here to help! Reach out for course details, support or feedback.
        </p>

        {/* MAIN GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 mt-14 sm:mt-16">

          {/* LEFT INFO */}
          <div className="backdrop-blur-xl bg-white/70 shadow-xl p-8 sm:p-10 rounded-3xl border border-purple-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-700">
              Contact Details
            </h3>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Our team is always ready to assist you.
            </p>

            {/* CONTACT ITEMS */}
            <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">

              {/* PHONE */}
              <div className="flex gap-4 items-start hover:scale-[1.03] transition">
                <div className="p-4 bg-purple-100 rounded-2xl shadow">
                  <Phone className="text-purple-700" size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Phone</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">
                    +91 8072877622
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex gap-4 items-start hover:scale-[1.03] transition">
                <div className="p-4 bg-purple-100 rounded-2xl shadow">
                  <Mail className="text-purple-700" size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900 break-all">
                    combosquare2@gmail.com
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex gap-4 items-start hover:scale-[1.03] transition">
                <div className="p-4 bg-purple-100 rounded-2xl shadow">
                  <MapPin className="text-purple-700" size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Location</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900 leading-7">
                    909, Bazaar Main Road, <br />
                    Ram Nagar, Madipakkam, <br />
                    Chennai – 600091
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="shadow-2xl p-8 sm:p-10 bg-white rounded-3xl border border-purple-100 hover:shadow-purple-200 transition">
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-700">
              Send us a Message
            </h3>

            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Fill the form and we’ll reply shortly.
            </p>

            <form className="mt-8 space-y-6">

              <input
                type="text"
                placeholder="Your Name *"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <input
                type="email"
                placeholder="Email Address *"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <input
                type="text"
                placeholder="Phone Number *"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <input
                type="text"
                placeholder="Subject *"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <textarea
                rows="4"
                placeholder="Message *"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              ></textarea>

              <button
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
