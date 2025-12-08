// src/pages/CareerPage.jsx
import { useParams } from "react-router-dom";
import { careerData } from "../data/careerData";
import { Sparkles, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import Footer from "../components/home/Footer";

export default function CareerPage() {
  const { careerId } = useParams();
  const career = careerData[careerId];

  if (!career) {
    return (
      <div className="pt-32 text-center text-3xl font-bold text-red-600">
        Career Section Not Found
      </div>
    );
  }

  return (
    <div className="pt-24 bg-gray-50">

      {/* 🔥 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-800 text-white py-20">
        {/* glow blobs */}
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-purple-400 opacity-30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 opacity-25 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-10 items-center">
          {/* left text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-semibold uppercase tracking-wide text-purple-100">
                {career.badge}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">
              {career.title}
            </h1>

            <p className="mt-4 text-purple-100 text-lg max-w-xl">
              {career.subtitle}
            </p>
          </div>

          {/* right simple card */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl w-full max-w-md">
              <p className="text-sm text-purple-100 mb-3">
                Powered by real opportunities & guided support.
              </p>
              <ul className="space-y-3">
                {career.highlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-1 rounded-full bg-purple-500/40">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-purple-50">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ HIGHLIGHTS FULL GRID */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Why this {career.title.toLowerCase()} section?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {career.highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <CheckCircle className="w-6 h-6 text-purple-700 mb-3" />
              <p className="text-gray-700 text-sm">{h}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ MAIN LIST (jobs / internships / workshops etc) */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {career.sectionTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {career.items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border shadow-md p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                  {item.company}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                <p className="text-sm text-gray-600">{item.meta1}</p>
                <p className="text-sm text-gray-600">{item.meta2}</p>
              </div>

              <button
                className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full 
                           bg-purple-600 text-white text-sm font-semibold hover:bg-purple-800 transition"
              >
                {career.id === "webinars" ? "Register Now" : "Apply Now"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ FINAL CTA */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-extrabold mb-3">
            {career.ctaTitle}
          </h2>
          <p className="text-purple-200 max-w-2xl mx-auto mb-8">
            {career.ctaSubtitle}
          </p>
          <button className="px-10 py-3 rounded-full bg-white text-purple-700 font-bold shadow-lg hover:bg-purple-100 transition flex items-center gap-2 mx-auto">
            {career.ctaButton}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
      </section>
     
      <Footer />
    </div>
    
  );
}
