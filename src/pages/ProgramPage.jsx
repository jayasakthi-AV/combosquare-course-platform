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
import { isLoggedIn } from "../services/api";
import { getCourseBySlug } from "../services/lmsApi";

export default function ProgramPage() {
  const { programId } = useParams();
  const program = programData[programId];
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState(0);
  
  // Enrollment states
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");

  // ── FIX 1: RESTORE THE MISSING FUNCTION ──
  const enrollBtnLabel = () => {
    if (enrolling) return "Processing...";
    if (isEnrolled) return "Go to Learning Path →";
    if (!isLoggedIn()) return "Login to Access";
    return "Enroll in Program";
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [programId]);

  // ── FIX 2: CLEANED UP ENROLLMENT CHECK ──
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isLoggedIn()) return;
      try {
        const data = await getCourseBySlug(programId);
        setIsEnrolled(data.is_enrolled);
      } catch (err) {
        console.log("Error fetching enrollment status", err);
      }
    };
    checkEnrollment();
  }, [programId]);

  const handleEnroll = () => {
    if (isEnrolled) {
      navigate(`/learn/${programId}`);
    } else {
      navigate(`/pay/${programId}`);
    }
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
    { label: "Phase 02", title: "Hands-on Practice", desc: "Apply logic with coding labs and industry-standard tasks.", Icon: Target },
    { label: "Phase 03", title: "Real Architecture", desc: "Build and deploy job-ready, full-scale projects for your portfolio.", Icon: Trophy },
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

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={handleEnroll}
                disabled={enrolling}
                className={`px-10 py-4 font-black rounded-2xl flex items-center gap-3 transition-all shadow-2xl uppercase tracking-widest text-lg ${
                  isEnrolled
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-[#471088] hover:bg-purple-100"
                } disabled:opacity-50`}
              >
                {enrollBtnLabel()} <ArrowRight className="w-5 h-5" />
              </motion.button>

              <button className="px-10 py-4 border-2 border-white/20 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all">
                Download Curriculum
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div variants={animFadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="relative group">
              <div className="absolute inset-0 rounded-[3rem] bg-[#471088] blur-3xl opacity-40 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[3.5rem] p-6 shadow-2xl">
                <img src={program.heroImg} alt={program.title} className="w-full max-w-[380px] rounded-[2.5rem] object-contain mx-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CURRICULUM ARCHITECTURE ─── */}
      <section className="py-32 bg-[#fcfcfd]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-16 text-center tracking-tight">Curriculum Architecture</h2>
          <div className="space-y-4">
            {program.curriculum?.map((mod, idx) => (
              <div key={idx} className={`rounded-[2rem] border transition-all duration-500 ${openModule === idx ? "bg-white border-[#471088]/30 shadow-xl" : "bg-white border-gray-100"}`}>
                <button className="w-full flex justify-between items-center p-8 text-left" onClick={() => setOpenModule(openModule === idx ? null : idx)}>
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${openModule === idx ? "bg-[#471088] text-white" : "bg-gray-50 text-gray-400"}`}>
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">{mod}</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${openModule === idx ? "rotate-180 text-[#471088]" : ""}`} />
                </button>
                <AnimatePresence>
                  {openModule === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-8 pb-8 pt-2 ml-14 text-gray-500 font-medium italic border-t border-gray-50 mt-2">
                        Comprehensive deep-dive featuring industry-standard labs and mentor-guided milestone projects.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNEY PHASE ─── */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-16 py-32 bg-[#f8f9ff] rounded-[4rem] mb-20">
        <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-16 text-center tracking-tighter">Your Strategic Journey</h2>
        <div className="grid lg:grid-cols-3 gap-8">
           {learningJourney.map((step, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-[#471088] text-white flex items-center justify-center mb-8 shadow-lg">
                   <step.Icon className="w-8 h-8" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#471088] mb-2">{step.label}</p>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
           ))}
        </div>
      </section>

      {/* ─── ECOSYSTEM & PROJECTS ─── */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-4xl font-black mb-20 tracking-tight">Industry Ecosystem</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-32">
            {program.tools?.map((tool, index) => (
              <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <p className="text-lg font-black uppercase tracking-widest opacity-80">{tool}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {["Portfolio", "E-Commerce", "Auth Systems", "CMS Engine"].map((t, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-left hover:border-[#471088]/40 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#471088] flex items-center justify-center mb-8 shadow-xl">
                   <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black mb-3">{t} Architecture</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Engineered for production scale using modern clean architecture.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-32 bg-white">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16">
          <div className="bg-gradient-to-br from-[#471088] to-[#1c0b3b] p-12 lg:p-24 rounded-[4rem] text-center text-white shadow-2xl relative overflow-hidden">
            <Flame className="absolute -top-10 -left-10 w-40 h-40 opacity-10 rotate-12" />
            <h2 className="text-4xl sm:text-7xl font-black mb-10 tracking-tighter leading-tight">Begin your <br/> <span className="italic opacity-80">{program.title}</span> mastery</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
               <button onClick={handleEnroll} className="px-12 py-6 bg-white text-[#471088] font-black rounded-2xl text-lg uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                  Start Path Now
               </button>
               <button onClick={() => navigate("/contact")} className="px-12 py-6 border-2 border-white/20 text-white font-black rounded-2xl text-lg uppercase tracking-widest hover:bg-white/10 transition-all">
                  Consult Mentor
               </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}