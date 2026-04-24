import { useParams, useNavigate } from "react-router-dom";
import { domainData } from "../data/domainData";
import { CheckCircle, Sparkles, ArrowRight, Wrench, GraduationCap, Layers, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import Footer from "../components/home/Footer";
import { motion } from "framer-motion";

export default function DomainPage() {
  const { domainId } = useParams();
  const domain = domainData[domainId];
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [domainId]);

  const coursesRef = useRef(null);
  const scrollToCourses = () => coursesRef.current?.scrollIntoView({ behavior: "smooth" });

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Domain Not Found</h1>
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
      {/* ─── ELITE HERO SECTION (EDGE-TO-EDGE) ─── */}
      <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-44 bg-gradient-to-br from-[#0f111a] via-[#1c0b3b] to-[#471088] text-white overflow-hidden">
        
        {/* Architectural Grid & Ambient Orbs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#471088] blur-[150px] rounded-full opacity-40 animate-pulse" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/20 blur-[130px] rounded-full opacity-30" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-100">
                Premium Learning Track
              </span>
            </motion.div>

            <motion.h1 variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8">
              {domain.title}
            </motion.h1>

            <motion.p variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-xl text-purple-100/80 max-w-2xl leading-relaxed mb-12">
              {domain.subtitle}
            </motion.p>

            <motion.div 
              initial="hidden" animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="grid sm:grid-cols-2 gap-4 mb-12"
            >
              {domain.highlights.map((h, i) => (
                <motion.div
                  key={i} variants={animFadeUp}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#471088] flex items-center justify-center border border-white/20">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-purple-50 text-sm font-bold tracking-wide">{h}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToCourses}
              className="px-10 py-5 bg-white text-[#471088] font-black rounded-2xl flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)] text-lg uppercase tracking-widest transition-all"
            >
              Explore Courses <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="relative group">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-[#471088] to-indigo-500 blur-2xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-5 shadow-2xl">
                <img
                  src={domain.heroImg}
                  alt={domain.title}
                  className="w-full max-w-[400px] rounded-[2rem] shadow-inner grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-2xl border border-gray-100 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#471088]/10 flex items-center justify-center">
                       <GraduationCap className="w-6 h-6 text-[#471088]" />
                    </div>
                    <div>
                      <p className="text-[#471088] font-black text-lg">Verified Path</p>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Industry Standard</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PLACEMENT COURSES GRID ─── */}
      <section ref={coursesRef} className="max-w-[1500px] mx-auto px-6 lg:px-16 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div variants={animFadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-4">
              Explore Specialized <br/> 
              <span className="text-[#471088]">Placement Programs</span>
            </h2>
            <div className="w-24 h-2 bg-[#471088] rounded-full"></div>
          </motion.div>
          <p className="text-gray-500 font-bold text-lg max-w-sm border-l-4 border-[#471088]/20 pl-6 uppercase tracking-widest">
            Expert-led curriculum designed to get you hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-12">
          {domain.courses.map((c, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -12 }}
              className="bg-white rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden hover:border-[#471088]/30 transition-all group"
            >
              <div className="relative h-60 overflow-hidden">
                <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60" />
                <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[#471088] text-[10px] font-black px-4 py-2 rounded-xl shadow-xl uppercase tracking-widest">
                  {c.level}
                </span>
              </div>

              <div className="p-10">
                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#471088] transition-colors">{c.title}</h3>
                <div className="flex items-center gap-3 text-gray-400 font-bold text-sm mb-10">
                   <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                   <span>Duration: {c.duration}</span>
                </div>
                <button className="w-full py-5 bg-gray-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-[#471088] transition-all shadow-lg hover:shadow-[#471088]/30">
                  Access Syllabus
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ELITE LEARNING JOURNEY (VERTICAL TIMELINE) ─── */}
      <section className="w-full bg-[#f8f9ff] py-32 border-y border-gray-100">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-24">
             <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tighter">Your Strategic Journey</h2>
             <p className="text-gray-500 font-medium uppercase tracking-[0.3em]">Phase by phase professional growth</p>
          </div>

          <div className="relative max-w-4xl mx-auto pl-10 sm:pl-0">
            {/* The Center Line */}
            <div className="absolute left-1 sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#471088] via-[#7b2cbf] to-[#471088]/10 rounded-full" />
            
            <div className="space-y-24">
              {domain.learningPath.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col sm:flex-row items-center ${i % 2 === 0 ? "sm:flex-row-reverse" : ""}`}
                >
                  {/* The Indicator Dot */}
                  <div className="absolute left-[-35px] sm:left-1/2 sm:-ml-5 top-0 w-10 h-10 rounded-2xl bg-[#471088] text-white flex items-center justify-center font-black shadow-xl z-10 border-4 border-white">
                    {i + 1}
                  </div>
                  
                  {/* The Content Card */}
                  <div className="w-full sm:w-[45%] bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:border-[#471088]/20 transition-all hover:-translate-y-2">
                    <p className="text-gray-700 font-bold text-lg leading-relaxed">{step}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOOLS & ECOSYSTEM ─── */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-16 py-32 text-center">
        <h2 className="text-4xl sm:text-5xl font-black mb-16 tracking-tight flex items-center justify-center gap-4">
          <Wrench className="w-10 h-10 text-[#471088]" /> 
          Ecosystem & Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {domain.tools.map((tool, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-white border-2 border-gray-50 p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-[#471088]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#471088]/5 transition-colors">
                <Layers className="w-6 h-6 text-[#471088]" />
              </div>
              <p className="text-lg font-black text-gray-900 group-hover:text-[#471088] transition-colors">{tool}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CALL TO ACTION ─── */}
      <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 relative z-10">
          <div className="bg-gradient-to-br from-[#471088] to-[#1c0b3b] p-12 lg:p-24 rounded-[3.5rem] lg:rounded-[5rem] text-center border border-white/10 shadow-2xl">
            <motion.div variants={animFadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-4xl sm:text-7xl font-black text-white leading-tight tracking-tighter mb-8">
                Build your future in <br/> 
                <span className="italic opacity-80">{domain.title}</span>
              </h2>
              <p className="text-purple-100 text-xl font-medium max-w-2xl mx-auto mb-14 leading-relaxed">
                Join a community of elite learners. Get access to verified roadmaps, real-world architecture, and direct hiring pipelines.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={scrollToCourses} className="px-12 py-6 bg-white text-[#471088] font-black text-lg uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-all">
                  Join The Track Now
                </button>
                <button onClick={() => navigate("/contact")} className="px-12 py-6 border-2 border-white/20 text-white font-black text-lg uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                  Speak to Expert
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}