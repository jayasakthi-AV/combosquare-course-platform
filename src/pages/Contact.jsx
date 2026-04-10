import React, { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Footer from "../components/home/Footer";
import api from "../services/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Name, Email and Message are required.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/contact/", {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile || null,
        // Combine subject + message
        message: formData.subject
          ? `Subject: ${formData.subject}\n\n${formData.message}`
          : formData.message,
      });

      setSuccess(true);
      setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });

    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white relative overflow-hidden">

      <div className="absolute top-[-120px] left-[-120px] w-[280px] md:w-[350px] h-[280px] md:h-[350px] bg-purple-300 opacity-30 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-[-140px] right-[-140px] w-[320px] md:w-[400px] h-[320px] md:h-[400px] bg-purple-400 opacity-30 blur-[140px] rounded-full"></div>

      <div className="py-16 md:py-20 px-5 sm:px-6 md:px-12 lg:px-24 relative z-10">

        <h2 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-purple-900 text-transparent bg-clip-text">
          Get in Touch
        </h2>

        <p className="text-gray-600 text-center mt-3 text-base sm:text-lg max-w-2xl mx-auto px-4">
          We're here to help! Reach out for course details, support or feedback.
        </p>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 mt-14 sm:mt-16">

          {/* Contact Details — unchanged */}
          <div className="backdrop-blur-xl bg-white/70 shadow-xl p-8 sm:p-10 rounded-3xl border border-purple-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-700">
              Contact Details
            </h3>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Our team is always ready to assist you.
            </p>

            <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">

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

          {/* Contact Form */}
          <div className="shadow-2xl p-8 sm:p-10 bg-white rounded-3xl border border-purple-100 hover:shadow-purple-200 transition">
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-700">
              Send us a Message
            </h3>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Fill the form and we'll reply shortly.
            </p>

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-green-700 font-semibold">Message sent successfully!</p>
                  <p className="text-green-600 text-sm">We'll get back to you shortly.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name *"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message *"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>

            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}