import { useParams } from "react-router-dom";
import { domainData } from "../data/domainData";

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

  return (
    <div className="pt-24 bg-gray-50">

      {/* 🔥 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white py-20">
        
        {/* Floating Blobs */}
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-purple-300 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400 opacity-20 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

          {/* LEFT SIDE TEXT */}
          <div>
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-xl">
              {domain.title}
            </h1>
            <p className="mt-5 text-lg text-purple-100 max-w-xl">
              {domain.subtitle}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 gap-3 mt-8">
              {domain.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-lg px-4 py-3
                             rounded-xl border border-white/20 shadow hover:scale-[1.02] transition"
                >
                  <span className="text-2xl">✨</span>
                  <p className="text-purple-100">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition">
              <img
                src={domain.heroImg}
                alt={domain.title}
                className="w-[420px] rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ⭐ STATS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {domain.stats.map((s, i) => (
            <div
              key={i}
              className="bg-white shadow-xl rounded-2xl p-8 hover:-translate-y-1 hover:shadow-2xl transition"
            >
              <h3 className="text-4xl font-extrabold text-purple-700">{s.value}</h3>
              <p className="text-gray-600 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ COURSES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10">
          Courses Included
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {domain.courses.map((c, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-xl overflow-hidden bg-white border hover:-translate-y-2 hover:shadow-2xl transition"
            >
              <div className="relative">
                <img src={c.thumbnail} className="h-48 w-full object-cover" />
                <span className="absolute top-3 left-3 bg-purple-700 text-white text-xs px-3 py-1 rounded-full shadow">
                  {c.level}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="text-gray-500 mt-2">{c.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ LEARNING PATH SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10">
          Learning Path
        </h2>

        <div className="relative border-l-4 border-purple-600 pl-8 space-y-10">
          {domain.learningPath.map((step, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-5 w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white shadow">
                {i + 1}
              </div>

              <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
                <p className="text-gray-700 font-medium">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10">
          Tools You Will Learn
        </h2>

        <div className="flex flex-wrap gap-5">
          {domain.tools.map((t, i) => (
            <div
              key={i}
              className="px-6 py-3 bg-white rounded-full shadow-md text-gray-800 font-semibold border hover:bg-purple-50 hover:text-purple-700 hover:shadow-xl transition"
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ FINAL CTA SECTION */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold">
            Start Your {domain.title} Journey Today
          </h2>
          <p className="mt-3 text-purple-200">
            Learn industry-leading tools and build real-world projects.
          </p>

          <button className="mt-10 px-10 py-4 bg-white text-purple-700 font-bold rounded-full shadow-xl hover:bg-gray-100 hover:scale-105 transition">
            Explore Courses
          </button>
        </div>
      </section>

    </div>
  );
}
