import { useParams, useNavigate } from "react-router-dom";
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
  ShieldCheck,
  ChevronRight,
  Activity
} from "lucide-react";
import Footer from "../components/home/Footer";
import { motion } from "framer-motion";

export default function CareerPage() {
  const { careerId } = useParams();
  const career = careerData[careerId];
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [careerId]);

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Career Section Not Found</h1>
          <button onClick={() => navigate("/")} className="text-[#471088] font-bold hover:underline">Return to Home</button>
        </div>
      </div>
    );
  }

  const animFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-[#fcfcfd] overflow-x-hidden"
    >
      {/* ─── HERO SECTION (EDGE-TO-EDGE) ─── */}
      <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-36 bg-gradient-to-br from-[#0f111a] via-[#1c0b3b] to-[#471088] text-white overflow-hidden">
        
        {/* Architectural Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
          <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-[#471088]/20 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-indigo-500/10 blur-[180px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#e2cfff]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#e2cfff]">
                {career.badge}
              </span>
            </motion.div>

            <motion.h1 variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight drop-shadow-2xl mb-6">
              {career.title}
            </motion.h1>

            <motion.p variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-xl text-purple-100/80 max-w-2xl leading-relaxed mb-10">
              {career.subtitle}
            </motion.p>

            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-12 shadow-xl">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <p className="text-sm sm:text-base text-purple-50 font-medium">
                Your profile matches <span className="text-white font-black text-lg ml-1">65%</span> of this track
              </p>
            </motion.div>

            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              {[
                { label: "Opportunities", icon: Briefcase },
                { label: "Community", icon: Users },
                { label: "High Growth", icon: Rocket },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center transition-all hover:bg-white/10 hover:-translate-y-1">
                  <s.icon className="w-6 h-6 mx-auto mb-3 text-purple-300" />
                  <p className="text-[10px] sm:text-xs text-purple-100 font-black uppercase tracking-widest leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="relative w-full max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] bg-[#471088] blur-3xl opacity-40 animate-pulse" />
              <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-purple-300" />
                  Career Highlights
                </h3>
                <ul className="space-y-5">
                  {career.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 p-1 rounded-full bg-white/20 border border-white/30">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-base text-purple-50 font-medium leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-white/10">
                   <p className="text-xs text-purple-300 font-bold uppercase tracking-widest">Powered by verified partners</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── READINESS METER ─── */}
      <section className="relative z-20 -mt-12 max-w-[1500px] mx-auto px-6 lg:px-16">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 p-8 lg:p-12 grid md:grid-cols-12 gap-10 items-center border border-gray-100">
          <div className="md:col-span-4">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Readiness Meter</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Real-time skill alignment based on current industry benchmarks.
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="relative w-full h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "65%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#471088] to-indigo-600 rounded-full relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:20px_20px] animate-[shimmerSweep_2s_linear_infinite]" />
              </motion.div>
            </div>
            <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest mt-4 px-1">
              <span>Novice</span>
              <span className="text-[#471088]">Specialist</span>
              <span>Hiring Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY THIS PATH ─── */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-16 py-32">
        <motion.div variants={animFadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight">Why choose this track?</h2>
          <div className="w-20 h-2 bg-[#471088] rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {career.highlights.map((h, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-[#471088]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-[#471088] transition-colors">
                <CheckCircle className="w-6 h-6 text-[#471088] group-hover:text-white" />
              </div>
              <p className="text-gray-700 font-bold text-lg leading-snug group-hover:text-gray-900">{h}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ROADMAP (ELITE STEPS) ─── */}
      <section className="w-full bg-[#f8f9ff] py-32">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16">
           <h2 className="text-4xl font-black mb-16 text-center">Your Strategic Roadmap</h2>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
             {[
               { t: "Foundations & Architecture", d: "Master the core principles, syntax, and essential industry tools used in high-level engineering." },
               { t: "Advanced Engineering", d: "Deep dive into complex projects, state management, and scalable system design." },
               { t: "Strategic Placement", d: "Resume optimization, technical interview coaching, and access to elite hiring drives." },
               { t: "Ecosystem Growth", d: "Continuous learning and networking within our global community of senior tech leads." }
             ].map((step, i) => (
               <motion.div key={i} whileHover={{ scale: 1.02 }} className="flex gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm transition-all hover:shadow-xl">
                 <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#471088] text-white flex items-center justify-center text-2xl font-black italic">
                   {i + 1}
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">{step.t}</h3>
                   <p className="text-gray-500 font-medium leading-relaxed">{step.d}</p>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* ─── OPPORTUNITIES GRID ─── */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-16 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
             <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{career.sectionTitle}</h2>
             <p className="text-gray-500 font-medium mt-3">Verified opportunities from top-tier recruitment partners.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {career.items.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_15px_50px_rgba(0,0,0,0.03)] p-8 flex flex-col hover:border-[#471088]/30 transition-all"
            >
              <div className="flex-1">
                <div className="inline-block px-4 py-1.5 bg-[#471088]/5 text-[#471088] text-[10px] font-black uppercase tracking-widest rounded-lg mb-6">
                  {item.company}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                <div className="space-y-2 mb-8">
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-[#471088]" /> {item.meta1}
                  </p>
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-[#471088]" /> {item.meta2}
                  </p>
                </div>
              </div>
              <button className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-sm uppercase tracking-widest hover:bg-[#471088] transition-all shadow-lg hover:shadow-[#471088]/30">
                {career.id === "webinars" ? "Register Now" : "Apply Now"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── DECISION POINT ─── */}
      <section className="w-full py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 relative z-10 text-center mb-20">
          <p className="text-[#e2cfff] font-black uppercase tracking-[0.3em] text-sm mb-4">Final Milestone</p>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tighter">Your next move in <span className="text-[#471088] italic">{career.title}</span></h2>
        </div>

        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 grid md:grid-cols-3 gap-8 relative z-10">
           {/* Option 1 */}
           <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] flex flex-col justify-between hover:bg-white/10 transition-all">
              <div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Direct Entry</h3>
                <p className="text-purple-100/60 font-medium leading-relaxed mb-10">Ready for industry challenges? Access immediate placement openings now.</p>
              </div>
              <button onClick={() => navigate("/contact")} className="w-full py-4 rounded-full bg-white text-gray-900 font-black uppercase tracking-widest text-xs hover:bg-purple-100 transition-all">
                {career.ctaButton}
              </button>
           </div>

           {/* Option 2 (Featured) */}
           <div className="bg-gradient-to-br from-[#471088] to-[#1c0b3b] p-12 rounded-[3.5rem] shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700"><Rocket className="w-24 h-24"/></div>
              <p className="text-[10px] font-black bg-white/20 text-white w-max px-3 py-1 rounded mb-6 uppercase tracking-widest">Recommended</p>
              <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">Guided Track</h3>
              <p className="text-purple-100 leading-relaxed mb-12">Structured curriculum with senior tech leads to bridge your skills gap effectively.</p>
              <button onClick={() => navigate("/programs")} className="w-full py-5 rounded-full bg-white text-[#471088] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl">
                 Join Learning Path
              </button>
           </div>

           {/* Option 3 */}
           <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] flex flex-col justify-between hover:bg-white/10 transition-all">
              <div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Discovery</h3>
                <p className="text-purple-100/60 font-medium leading-relaxed mb-10">Unsure of the alignment? Consult with our experts to map your future potential.</p>
              </div>
              <button onClick={() => navigate("/contact")} className="w-full py-4 rounded-full border-2 border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                Talk to an Expert
              </button>
           </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}