import { useParams, useNavigate } from "react-router-dom";
import { programData } from "../data/programData";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Clock,
  Target,
  Trophy,
  Star,
  LayoutDashboard,
  ShoppingCart,
  ShieldCheck,
  FileText,
  Download,
  Flame,
  Globe,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/home/Footer";
import { enrollInProgram, isLoggedIn, getStudentDashboard } from "../services/api";

export default function ProgramPage() {
  const { programId } = useParams();
  const program = programData[programId];
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState(0); // Default first module open
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Enrollment states
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [programId]);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isLoggedIn()) return;
      try {
        const data = await getStudentDashboard();
        const alreadyEnrolled = data.enrolled_programs?.some((p) => p.slug === programId);
        setIsEnrolled(alreadyEnrolled);
      } catch (err) { /* Silent ignore */ }
    };
    checkEnrollment();
  }, [programId]);

  const handleEnroll = async () => {
    if (!isLoggedIn()) { navigate("/login"); return; }
    if (isEnrolled) { navigate("/dashboard"); return; }
    try {
      setEnrolling(true);
      const response = await fetch(`http://localhost:8001/api/programs/${programId}`);
      const pData = await response.json();
      await enrollInProgram(pData.id);
      setIsEnrolled(true);
      setEnrollMessage("Successfully enrolled! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setEnrollMessage(err.response?.data?.detail || "Enrollment failed. Please try again.");
    } finally { setEnrolling(false); }
  };

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Program Not Found</h1>
          <button onClick={() => navigate("/programs")} className="text-[#471088] font-bold hover:underline">View All Programs</button>
        </div>
      </div>
    );
  }

  const learningJourney = [
    { label: "Phase 01", title: "Strong Foundations", desc: "Master core principles step-by-step, engineered for absolute beginners.", Icon: Clock },
    { label: "Phase 02", title: "Hands-on Practice", desc: "Apply logic with complex coding labs and industry-standard tasks.", Icon: Target },
    { label: "Phase 03", title: "Real Architecture", desc: "Build and deploy job-ready, full-scale projects for your portfolio.", Icon: Trophy },
  ];

  const testimonials = [
    { name: "Harini", role: "Final Year – CSBS", feedback: "Before this program I was scared of projects. Now I have a complete portfolio and feel confident for internships.", image: "https://i.postimg.cc/pdQm4Vnb/woman-1.jpg" },
    { name: "Vignesh", role: "Junior Developer Intern", feedback: "The roadmap and practice tasks helped me understand exactly what to learn next. It felt very structured and practical.", image: "https://i.postimg.cc/6Q5zVt0M/man-2.jpg" },
    { name: "Sangeetha", role: "2nd Year Student", feedback: "The real-world examples made learning simple. The projects gave me something strong to show in my resume.", image: "https://i.postimg.cc/fTZXbn3L/woman-3.jpg" },
  ];

  const animFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#fcfcfd] overflow-x-hidden">
      
      {/* ─── ELITE HERO SECTION ─── */}
      <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-44 bg-gradient-to-br from-[#0f111a] via-[#1c0b3b] to-[#471088] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#471088] blur-[150px] rounded-full opacity-40 animate-pulse" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/20 blur-[130px] rounded-full opacity-30" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-100">Premium Program</span>
            </motion.div>

            <motion.h1 variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-8">
              {program.title}
            </motion.h1>

            <motion.p variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-xl text-purple-100/80 max-w-2xl leading-relaxed mb-10">
              {program.subtitle}
            </motion.p>

            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="grid gap-4 mb-12 max-w-xl">
              {program.highlights?.slice(0, 2).map((h, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="bg-emerald-500/20 p-1.5 rounded-full"><CheckCircle className="text-emerald-400 w-5 h-5" /></div>
                  <p className="text-purple-50 font-bold text-lg">{h}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="flex flex-wrap gap-5">
              <button onClick={handleEnroll} disabled={enrolling} className={`px-10 py-5 font-black rounded-2xl flex items-center gap-3 shadow-2xl uppercase tracking-widest text-lg transition-all hover:-translate-y-1 ${isEnrolled ? "bg-emerald-500 text-white" : "bg-white text-[#471088] hover:bg-purple-50"}`}>
                {isEnrolled ? "Access Dashboard" : "Enroll Now"} <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-5 border-2 border-white/20 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all flex items-center gap-3">
                Curriculum <Download className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="relative group">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-[#471088] to-indigo-500 blur-3xl opacity-40 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[3.5rem] p-6 shadow-2xl">
                <img src={program.heroImg} alt={program.title} className="w-full max-w-[380px] rounded-[2.5rem] object-contain mx-auto" />
                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20"><Zap className="w-6 h-6 text-yellow-300" /></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHY THIS PROGRAM ─── */}
      <section className="py-32 bg-white">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-20">
            <p className="text-[#471088] font-black uppercase tracking-[0.25em] text-sm mb-4">Strategic Advantage</p>
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter">Why choose <span className="text-[#471088]">this track?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {program.highlights?.map((h, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-[#f8f9ff] p-10 rounded-[2.5rem] border border-gray-100 hover:border-[#471088]/20 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:bg-[#471088] transition-colors duration-500">
                  <CheckCircle className="w-8 h-8 text-[#471088] group-hover:text-white" />
                </div>
                <p className="text-gray-800 font-black text-xl leading-snug">{h}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CURRICULUM SECTION ─── */}
      <section className="py-32 bg-[#fcfcfd] border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-16 text-center tracking-tight">Curriculum Architecture</h2>
          <div className="space-y-4">
            {program.curriculum?.map((mod, idx) => (
              <div key={idx} className={`rounded-[2rem] border transition-all duration-500 ${openModule === idx ? "bg-white border-[#471088]/30 shadow-xl" : "bg-white border-gray-100 hover:border-[#471088]/20"}`}>
                <button className="w-full flex justify-between items-center p-6 sm:p-8 text-left" onClick={() => setOpenModule(openModule === idx ? null : idx)}>
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${openModule === idx ? "bg-[#471088] text-white shadow-lg shadow-[#471088]/30" : "bg-gray-50 text-gray-400"}`}>
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">{mod}</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-500 ${openModule === idx ? "rotate-180 text-[#471088]" : ""}`} />
                </button>
                <AnimatePresence>
                  {openModule === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-8 pb-8 pt-2 ml-14 text-gray-500 font-medium leading-relaxed border-t border-gray-50 mt-2 italic">
                        Comprehensive deep-dive featuring hands-on laboratories, real-world architectural patterns, and mentor-guided milestone projects.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEARNING JOURNEY ─── */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-16 py-32">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2">
            <p className="text-[#471088] font-black uppercase tracking-[0.25em] text-sm mb-4">Strategic Roadmap</p>
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.1]">The Evolution <br/> of a <span className="text-[#471088]">Specialist.</span></h2>
            <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-lg mb-12">A structured learning path designed to bridge the gap between academic theory and industry architecture.</p>
            <div className="p-8 rounded-[3rem] bg-[#0f111a] text-white shadow-2xl relative overflow-hidden">
               <Globe className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10" />
               <p className="text-purple-300 font-bold mb-4 uppercase tracking-widest text-xs">Standard included</p>
               <h4 className="text-2xl font-black mb-4 italic">Global Career Access</h4>
               <p className="text-gray-400 text-sm leading-relaxed">Our certificates are verified and recognized by partners across India and beyond.</p>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#471088] via-[#7b2cbf] to-transparent rounded-full" />
             <div className="space-y-16 relative">
                {learningJourney.map((step, idx) => (
                  <motion.div key={idx} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 20 }} className="flex gap-10 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-xl border-4 border-[#fcfcfd] flex items-center justify-center z-10">
                      <step.Icon className="w-5 h-5 text-[#471088]" />
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex-1 hover:border-[#471088]/20 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#471088] mb-2">{step.label}</p>
                      <h3 className="text-2xl font-black text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* ─── TOOLS & PROJECTS ─── */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-4xl font-black mb-20 tracking-tight">Industry Ecosystem & Architecture</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-32">
            {program.tools?.map((tool, index) => (
              <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all">
                <p className="text-lg font-black uppercase tracking-widest opacity-80">{tool}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { t: "Portfolio", i: <LayoutDashboard /> },
              { t: "E-Commerce", i: <ShoppingCart /> },
              { t: "Auth Systems", i: <ShieldCheck /> },
              { t: "CMS Architecture", i: <FileText /> }
            ].map((p, i) => (
              <div key={i} className="bg-gradient-to-b from-white/10 to-transparent p-10 rounded-[3rem] border border-white/10 text-left hover:border-[#471088]/40 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#471088] flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">{p.i}</div>
                <h4 className="text-xl font-black mb-3">{p.t} Architecture</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Engineered for production scale, utilizing modern best practices in clean architecture.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-32 bg-white overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 relative z-10">
          <div className="bg-gradient-to-br from-[#471088] to-[#1c0b3b] p-12 lg:p-24 rounded-[4rem] text-center text-white shadow-2xl relative overflow-hidden">
            <Flame className="absolute -top-10 -left-10 w-40 h-40 opacity-10 rotate-12" />
            <h2 className="text-4xl sm:text-7xl font-black mb-10 tracking-tighter leading-tight">Master <span className="italic opacity-80">{program.title}</span> <br/> in 2026</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
               <button onClick={handleEnroll} className="px-12 py-6 bg-white text-[#471088] font-black rounded-2xl text-lg uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Start Learning Now</button>
               <button onClick={() => navigate("/contact")} className="px-12 py-6 border-2 border-white/20 text-white font-black rounded-2xl text-lg uppercase tracking-widest hover:bg-white/10 transition-all">Talk to Mentor</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}