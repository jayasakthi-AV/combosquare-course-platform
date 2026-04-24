import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Footer from "../components/home/Footer";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

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

  const animFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#fcfcfd] overflow-x-hidden">
      
      {/* ─── ELITE CONTACT HERO (EDGE-TO-EDGE) ─── */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-[#0f111a] via-[#1c0b3b] to-[#471088] text-white overflow-hidden">
        
        {/* Background Architectural Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#471088] blur-[150px] rounded-full opacity-40 animate-pulse" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 text-center lg:text-left">
          <motion.h1 variants={animFadeUp} initial="hidden" animate="visible" className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight tracking-tighter mb-6">
            Get in <span className="italic opacity-80">Touch.</span>
          </motion.h1>
          <motion.p variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-xl text-purple-100/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            We're here to help! Reach out for course details, support or feedback.
          </motion.p>
        </div>
      </section>

      {/* ─── MAIN CONTENT GRID ─── */}
      <section className="relative z-20 -mt-12 lg:-mt-20 max-w-[1500px] mx-auto px-6 lg:px-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: CONTACT DETAILS */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-purple-50 hover:border-[#471088]/20 transition-all group">
              <h3 className="text-2xl font-black text-[#471088] mb-10 tracking-tight">Contact Details</h3>
              
              <div className="space-y-12">
                {/* Phone */}
                <div className="flex gap-6 items-start group/item">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:bg-[#471088] group-hover:text-white transition-all duration-500">
                    <Phone size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-xl font-bold text-gray-900">+91 8072877622</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-6 items-start group/item">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:bg-[#471088] group-hover:text-white transition-all duration-500">
                    <Mail size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-xl font-bold text-gray-900 break-all">combosquare2@gmail.com</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-6 items-start group/item">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:bg-[#471088] group-hover:text-white transition-all duration-500">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-lg font-bold text-gray-900 leading-relaxed">
                      909, Bazaar Main Road, <br />
                      Ram Nagar, Madipakkam, <br />
                      Chennai – 600091
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-7">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-black/5 border border-purple-50">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-[#471088] tracking-tight">Send us a Message</h3>
                <p className="text-gray-500 font-medium mt-2">Fill the form and we'll reply shortly.</p>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-6 bg-green-50 border border-green-100 rounded-3xl flex items-center gap-4">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="text-green-900 font-black tracking-tight">Message sent successfully!</p>
                      <p className="text-green-700 text-sm font-medium">We'll get back to you shortly.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-bold">
                   {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    placeholder="Your Name *"
                    className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-2xl focus:bg-white focus:border-[#471088]/20 transition-all outline-none font-bold text-gray-900"
                  />
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="Email Address *"
                    className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-2xl focus:bg-white focus:border-[#471088]/20 transition-all outline-none font-bold text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text" name="mobile" value={formData.mobile} onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-2xl focus:bg-white focus:border-[#471088]/20 transition-all outline-none font-bold text-gray-900"
                  />
                  <input
                    type="text" name="subject" value={formData.subject} onChange={handleChange}
                    placeholder="Subject"
                    className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-2xl focus:bg-white focus:border-[#471088]/20 transition-all outline-none font-bold text-gray-900"
                  />
                </div>

                <textarea
                  rows="5" name="message" value={formData.message} onChange={handleChange} required
                  placeholder="Message *"
                  className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-2xl focus:bg-white focus:border-[#471088]/20 transition-all outline-none font-bold text-gray-900 resize-none"
                ></textarea>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-[#471088] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}