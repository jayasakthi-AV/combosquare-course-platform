
import { useParams } from "react-router-dom";
import { careerData } from "../data/careerData";
import { useEffect } from "react";

import {
  Sparkles,
  CheckCircle,
  MapPin,
  ArrowRight,
  Briefcase,
  Users,
  Rocket,
} from "lucide-react";
import Footer from "../components/home/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const careerToDomainMap = {
  jobs: "technology",
  internships: "technology",
  webinars: "technology",
  
};



export default function CareerPage() {
  const { careerId } = useParams();
  const career = careerData[careerId];
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [careerId]);
  


  if (!career) {
    return (
      <div className="pt-32 text-center text-3xl font-bold text-red-600">
        Career Section Not Found
      </div>
    );
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pt-24 bg-gray-50"
    
    >
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2b1055] text-white py-24">
       
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/30 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-indigo-500/30 blur-[180px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-14 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 mb-5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-semibold uppercase tracking-wide text-purple-100">
                {career.badge}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">
              {career.title}
            </h1>

            <p className="mt-5 text-purple-100 text-lg max-w-xl leading-relaxed">
              {career.subtitle}
            </p>
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
  <p className="text-sm text-purple-100">
    Your profile matches <span className="font-bold">65%</span> of this career path
  </p>
</div>


          
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {[
                { label: "Opportunities", icon: Briefcase },
                { label: "Community", icon: Users },
                { label: "Growth", icon: Rocket },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-center"
                >
                  <s.icon className="w-5 h-5 mx-auto mb-2 text-purple-300" />
                  <p className="text-xs text-purple-100 font-semibold">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400 via-indigo-400 to-purple-600 blur-xl opacity-60" />
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-md">
                <p className="text-sm text-purple-100 mb-4">
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
          </motion.div>
        </div>
      </section>
      
<section className="max-w-7xl mx-auto px-6 py-16">
  <div className="bg-white rounded-3xl shadow-xl p-8 grid md:grid-cols-3 gap-8 items-center">
    
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Career Readiness Level
      </h3>
      <p className="text-gray-600 text-sm">
        Estimated readiness based on skills & roadmap
      </p>
    </div>

    <div className="md:col-span-2">
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
          style={{ width: "65%" }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Beginner</span>
        <span>Intermediate</span>
        <span>Job Ready</span>
      </div>
    </div>
  </div>
</section>


      
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-gray-900 mb-12"
        >
          Why choose this career path?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {career.highlights.map((h, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="relative p-[1px] rounded-2xl bg-gradient-to-br from-purple-300/60 to-indigo-400/60"
            >
              <div className="bg-white rounded-2xl p-6 shadow-xl h-full">
                <CheckCircle className="w-6 h-6 text-purple-700 mb-4" />
                <p className="text-gray-700 text-sm leading-relaxed">{h}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
<section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-3xl font-extrabold mb-10">
    Career Roadmap
  </h2>

  <div className="space-y-5">
    {[
      "Learn core fundamentals & tools",
      "Build hands-on projects",
      "Apply for internships & roles",
      "Grow with real-world experience",
    ].map((step, i) => (
      <details
        key={i}
        className="bg-white rounded-2xl shadow-md p-6 cursor-pointer"
      >
        <summary className="font-semibold text-gray-900">
          Step {i + 1}
        </summary>
        <p className="mt-3 text-gray-600 text-sm">
          {step}
        </p>
      </details>
    ))}
  </div>
</section>


      
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-gray-900 mb-14"
        >
          {career.sectionTitle}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {career.items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-xl p-7 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                  {item.company}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>

                <p className="text-sm text-gray-600">{item.meta1}</p>
                <p className="text-sm text-gray-600">{item.meta2}</p>
              </div>

              <button className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-800 transition">
                {career.id === "webinars" ? "Register Now" : "Apply Now"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="bg-purple-50 py-6">
  <p className="text-center text-sm font-semibold text-gray-700">
    🔥 1,200+ learners explored this career path in the last 30 days
  </p>
</section>


  
<section className="relative py-28 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">


<div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-purple-600/30 blur-[180px] rounded-full" />
<div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-indigo-600/30 blur-[180px] rounded-full" />

<div className="relative max-w-7xl mx-auto px-6 text-white">

  
  <div className="text-center max-w-3xl mx-auto mb-16">
    <p className="uppercase tracking-widest text-purple-300 text-sm font-semibold mb-3">
      Career Decision Point
    </p>
    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
      What’s your next move in{" "}
      <span className="text-purple-300">{career.title}</span>?
    </h2>
    <p className="mt-4 text-purple-100 text-lg">
      Choose the path that fits your current stage. You’re always in control.
    </p>
  </div>

  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition">
      <h3 className="text-xl font-bold mb-3">I’m Ready to Apply</h3>
      <p className="text-purple-100 text-sm leading-relaxed mb-6">
        You already have the basics and want to move forward with real
        opportunities.
      </p>
      <button className="w-full py-3 rounded-full bg-white text-purple-800 font-bold hover:bg-purple-100 transition">
        {career.ctaButton}
      </button>
    </div>

    
    <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-[2px] shadow-2xl scale-[1.03]">
      <div className="bg-slate-900 rounded-3xl p-8 h-full">
        <p className="text-xs uppercase tracking-widest text-purple-300 mb-2">
          Recommended
        </p>
        <h3 className="text-xl font-bold mb-3">
          I Want a Guided Career Path
        </h3>
        <p className="text-purple-100 text-sm leading-relaxed mb-6">
          Get a structured roadmap, mentoring, and skill alignment before
          applying.
        </p>
        <button
  onClick={() => navigate("/domains/technology")}
  className="w-full py-3 rounded-full bg-white text-purple-800 font-bold"
>
  Explore Learning Path →
</button>



      </div>
    </div>

   
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition">
      <h3 className="text-xl font-bold mb-3">I’m Just Exploring</h3>
      <p className="text-purple-100 text-sm leading-relaxed mb-6">
        You’re still understanding this career and want more clarity before
        committing.
      </p>
      <button
  onClick={() => navigate("/contact")}
  className="w-full py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
>
  Talk to an Expert
</button>

    </div>

  </div>

  
  <p className="text-center text-sm text-purple-200 mt-14">
    💡 Career decisions don’t have to be rushed — clarity comes first.
  </p>
</div>
</section>


      <Footer />
    </motion.div>
  );
}
