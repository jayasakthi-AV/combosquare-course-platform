import { useParams } from "react-router-dom";
import { domainData } from "../data/domainData.js";

import { CheckCircle, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/home/Footer";

export default function DomainPage() {
  const { domainId } = useParams();
  const domain = domainData[domainId];

  if (!domain) {
    return (
      <div className="pt-32 text-center text-2xl font-semibold text-red-600">
        Domain Not Found
      </div>
    );
  }

  /* ---------------------- TYPING ANIMATION ---------------------- */
  const [typedTitle, setTypedTitle] = useState("");
  const fullTitle = domain.title;

  useEffect(() => {
    let i = 0;
    setTypedTitle("");

    const interval = setInterval(() => {
      setTypedTitle(fullTitle.slice(0, i));
      i++;
      if (i > fullTitle.length) clearInterval(interval);
    }, 120);

    return () => clearInterval(interval);
  }, [domainId]);

  /* ---------------------- SCROLL TO COURSES ---------------------- */
  const coursesRef = useRef(null);
  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------------- PAGE UI ------------------------------- */
  return (
    <div className="pt-24 bg-gray-50">

      {/* ⚡ HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-900 to-indigo-700 text-white py-20 md:py-24">

        {/* Glowing background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300 opacity-30 rounded-full blur-3xl animate-[glow_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-[glow_8s_ease-in-out_infinite]" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

          {/* LEFT */}
          <div className="animate-[fadeUp_0.9s_ease-out]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-300" />
              <p className="uppercase tracking-wider text-purple-200 text-sm font-semibold">
                Premium Learning Track
              </p>
            </div>

            {/* Responsive Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-2xl min-h-[70px] sm:min-h-[90px]">
              {typedTitle}
              <span className="border-r-4 border-yellow-300 ml-1 animate-pulse" />
            </h1>

            <p className="mt-5 text-base sm:text-lg text-purple-100 max-w-xl opacity-90">
              {domain.subtitle}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 gap-4 mt-10">
              {domain.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 animate-[fadeUp_1s_ease-out] opacity-0"
                  style={{
                    animationDelay: `${0.15 * i}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="bg-yellow-400/20 p-2 rounded-full">
                    <CheckCircle className="text-yellow-300 w-6 h-6" />
                  </div>
                  <p className="text-purple-100 font-medium text-lg">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center md:justify-end animate-[fadeUp_1.2s_ease-out]">
            <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-purple-300 to-purple-500 shadow-2xl animate-[float_7s_ease-in-out_infinite]">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-4 border border-white/20 shadow-xl">
                <img
                  src={domain.heroImg}
                  alt={domain.title}
                  className="w-[260px] sm:w-[320px] md:w-[400px] rounded-2xl object-contain"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ⭐ STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {domain.stats.map((s, i) => (
            <div
              key={i}
              className="bg-white shadow-xl rounded-2xl p-10 hover:-translate-y-1 hover:shadow-2xl transition text-center border-t-4 border-purple-600"
            >
              <h3 className="text-4xl sm:text-5xl font-extrabold text-purple-700">{s.value}</h3>
              <p className="text-gray-600 mt-3 text-lg">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ COURSES SECTION */}
      <section ref={coursesRef} className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">
          Explore Courses with <span className="text-purple-600">placements guidance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {domain.courses.map((c, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-xl overflow-hidden bg-white border hover:-translate-y-2 hover:shadow-2xl transition"
            >
              <div className="relative">
                <img
                  src={c.thumbnail}
                  className="h-44 sm:h-48 w-full object-cover"
                  alt={c.title}
                />
                <span className="absolute top-3 left-3 bg-purple-700 text-white text-xs px-3 py-1 rounded-full shadow">
                  {c.level}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-lg sm:text-xl font-semibold">{c.title}</h3>
                <p className="text-gray-500 mt-2">{c.duration}</p>
              </div>

              <div className="px-6 pb-6">
                <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-900 transition text-lg shadow-md hover:shadow-lg">
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ LEARNING PATH */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">Learning Path</h2>

        <div className="relative border-l-4 border-purple-600 pl-6 sm:pl-8 space-y-10">
          {domain.learningPath.map((step, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-5 sm:-left-6 w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white shadow">
                {i + 1}
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-xl transition">
                <p className="text-gray-700 font-medium">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ TOOLS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">Tools You Will Learn</h2>

        <div className="flex flex-wrap gap-3 sm:gap-5">
          {domain.tools.map((t, i) => (
            <div
              key={i}
              className="px-5 py-2 sm:px-6 sm:py-3 bg-white rounded-full shadow-md text-gray-800 font-semibold border hover:bg-purple-50 hover:text-purple-700 hover:shadow-xl transition"
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ CONSULTATION FORM */}
      <section className="w-full bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-6 sm:p-10">

          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">
            Don’t Know Which Program to Choose?
            <span className="text-purple-600"> Talk to Our Experts</span>
          </h2>

          <form className="space-y-6">
            {["Name", "Email", "Phone"].map((label, i) => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-1">{label}*</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              </div>
            ))}

            {[
              { label: "Educational Qualification*", options: ["10th", "12th", "Diploma", "UG", "PG"] },
              { label: "Current Profile*", options: ["Student", "Working Professional", "Job Seeker"] },
              { label: "Year of Graduation*", options: ["2025", "2024", "2023", "2022"] },
              { label: "Language of Speaking*", options: ["English", "Tamil", "Hindi"] },
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-1">{item.label}</label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500">
                  <option>Select</option>
                  {item.options.map((op, idx) => (
                    <option key={idx}>{op}</option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-4 bg-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-purple-900 transition"
            >
              Apply Now
            </button>
          </form>
        </div>
      </section>

      {/* ⭐ FINAL CTA */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="absolute top-16 left-16 w-52 h-52 bg-purple-400 opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-16 right-16 w-52 h-52 bg-indigo-400 opacity-20 blur-3xl rounded-full" />

        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">

          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 sm:p-14 text-center animate-[fadeUp_1s_ease-out]">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-snug drop-shadow-xl">
              Start Your <span className="text-purple-300">{domain.title}</span> Journey Today
            </h2>

            <p className="text-purple-200 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
              Learn premium industry skills, build real-world projects, and transform your future with expert guidance.
            </p>

            <button
              onClick={scrollToCourses}
              className="mt-8 sm:mt-10 px-10 sm:px-14 py-3 sm:py-4 text-lg font-bold rounded-full bg-white text-purple-700 shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:bg-purple-100 hover:shadow-[0_15px_35px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
            >
              Explore Courses
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
