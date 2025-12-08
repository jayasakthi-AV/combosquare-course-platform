import { useParams } from "react-router-dom";
import { programData } from "../data/programData";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  Target,
  Trophy,
  Star,
  LayoutDashboard,
  ShoppingCart,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

import Footer from "../components/home/Footer";

// 🔹 Typing Animation Hook
function useTypingEffect(text, speed = 50) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

export default function ProgramPage() {
  const { programId } = useParams();
  const program = programData[programId];

  // ✅ Safe usage even if program is briefly undefined
  const typedTitle = useTypingEffect(program?.title || "", 60);

  const [openModule, setOpenModule] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Scroll to top when program changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [programId]);

  if (!program) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-3xl font-bold text-red-600">Program Not Found</p>
      </div>
    );
  }

  // ⭐ Learning Journey (Timeline)
  const learningJourney = [
    {
      label: "Step 1",
      title: "Strong Foundations",
      desc: "Understand all the core concepts step-by-step, even if you are starting as a complete beginner.",
      Icon: Clock,
    },
    {
      label: "Step 2",
      title: "Hands-on Practice",
      desc: "Apply every topic with coding exercises and mini tasks that build real confidence.",
      Icon: Target,
    },
    {
      label: "Step 3",
      title: "Real Projects",
      desc: "Create job-ready, real world projects to showcase in your portfolio.",
      Icon: Trophy,
    },
  ];

  const finalTestimonials = [
    {
      name: "Harini",
      role: "Final Year – CSBS",
      feedback:
        "Before this program I was scared of projects. Now I have a complete portfolio and feel confident for internships.",
      image:
        "https://i.postimg.cc/pdQm4Vnb/woman-1.jpg",
    },
    {
      name: "Vignesh",
      role: "Junior Developer Intern",
      feedback:
        "The roadmap and practice tasks helped me understand exactly what to learn next. It felt very structured and practical.",
      image:
        "https://i.postimg.cc/6Q5zVt0M/man-2.jpg",
    },
    {
      name: "Sangeetha",
      role: "2nd Year Student",
      feedback:
        "The real-world examples made learning simple. The projects gave me something strong to show in my resume.",
      image:
        "https://i.postimg.cc/fTZXbn3L/woman-3.jpg",
    },
  ];
  
  
  

  // ⭐ Auto-slide testimonials (fixed to use finalTestimonials)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(
        (prev) => (prev + 1) % finalTestimonials.length
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [finalTestimonials.length]);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="pt-24 bg-gray-50 min-h-screen flex flex-col">
      {/* ⚡ HERO SECTION (Premium Animation Style) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-900 to-indigo-700 text-white py-20 md:py-24">
        {/* Glowing floating blobs */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-purple-400 opacity-30 rounded-full blur-3xl animate-[glow_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-14 right-14 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-[glow_8s_ease-in-out_infinite]" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10 items-center">
          {/* LEFT SECTION */}
          <div className="animate-[fadeUp_0.9s_ease-out]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-300" />
              <p className="uppercase tracking-wider text-purple-200 text-sm font-semibold">
                Premium Program
              </p>
            </div>

            {/* Typing Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-2xl flex min-h-[70px]">
              {typedTitle}
              <span className="ml-1 border-r-4 border-yellow-300 animate-pulse" />
            </h1>

            <p className="mt-5 text-base sm:text-lg text-purple-100 max-w-xl opacity-90">
              {program.subtitle}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 gap-4 mt-10">
              {program.highlights?.map((h, i) => (
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

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full shadow-md hover:bg-purple-100 transition flex items-center gap-2"
              >
                Enroll Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 border border-white rounded-full hover:bg-white hover:text-purple-700 transition"
              >
                Download Curriculum
              </motion.button>
            </div>
          </div>

          {/* RIGHT HERO IMAGE */}
          <div className="flex justify-center md:justify-end animate-[fadeUp_1.2s_ease-out]">
            <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-purple-300 to-purple-500 shadow-2xl animate-[float_7s_ease-in-out_infinite]">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-4 border border-white/20 shadow-xl">
                <img
                  src={program.heroImg}
                  alt={program.title}
                  className="w-[260px] sm:w-[320px] md:w-[400px] rounded-2xl object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ PREMIUM HIGHLIGHTS SECTION */}
      <div className="bg-purple-50">
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-14">
            <h2 className="text-2xl text-purple-600 font-bold drop-shadow-sm">
              Why Choose This Program?
            </h2>
            <p className="text-black mt-2 text-4xl font-extrabold">
              Designed for modern learners, focused on{" "}
              <span className="text-purple-600">strong outcomes.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {program.highlights?.map((h, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative group p-[1px] rounded-2xl bg-gradient-to-br from-purple-300/50 via-transparent to-indigo-400/50"
              >
                <div
                  className="bg-white/60 backdrop-blur-xl p-7 rounded-2xl shadow-xl border border-white/40
                  group-hover:shadow-purple-300/40 group-hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 mb-5 group-hover:bg-purple-200 transition-all duration-300">
                    <CheckCircle className="text-purple-700 w-8 h-8 group-hover:scale-110 transition-transform" />
                  </div>

                  <p className="text-gray-800 font-semibold text-lg text-center leading-relaxed">
                    {h}
                  </p>

                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-200/20 to-indigo-300/20 blur-xl transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ⭐ PREMIUM CURRICULUM SECTION */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-sm">
          What You Will Learn
        </h2>

        <div className="space-y-5">
          {program.curriculum?.map((mod, idx) => (
            <motion.div
              key={idx}
              className="relative group rounded-2xl p-[2px] bg-gradient-to-r from-purple-300/60 via-indigo-300/40 to-purple-400/60 hover:shadow-purple-300/40 transition duration-300"
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/40">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() =>
                    setOpenModule(openModule === idx ? null : idx)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg shadow-inner group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>

                    <span className="text-xl font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {mod}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: openModule === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {openModule === idx ? (
                      <ChevronUp className="text-purple-700 w-6 h-6" />
                    ) : (
                      <ChevronDown className="text-purple-700 w-6 h-6" />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    openModule === idx
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pl-14 pr-4 pb-3 text-gray-700 leading-relaxed text-base">
                    <p>
                      This module includes hands-on exercises, real-world
                      examples, and structured guided learning designed to
                      strengthen your fundamentals.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ⭐ PREMIUM LEARNING JOURNEY TIMELINE */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-purple-600 mb-6">
          Your Learning Journey
        </h2>

        <p className="text-black font-extrabold text-2xl max-w-2xl mb-12">
          A structured, well-crafted roadmap that gradually transforms you from
          a beginner to a{" "}
          <span className="text-purple-600">confident, project-ready developer.</span>
        </p>

        <div className="relative pl-10">
          <motion.div
            className="absolute left-4 top-0 bottom-0 w-[4px] bg-gradient-to-b from-purple-400 via-purple-500 to-indigo-600 rounded-full shadow-lg"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          <div className="space-y-12">
            {learningJourney.map(({ label, title, desc, Icon }, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative flex gap-6 items-start"
              >
                <div className="absolute left-0 -translate-x-[6px] flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-purple-600 shadow-md relative">
                    <span className="absolute inset-0 rounded-full bg-purple-500 opacity-40 blur-md animate-ping" />
                  </div>
                </div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-xl rounded-2xl px-6 py-5 w-full hover:shadow-purple-300/40 hover:border-purple-300 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="uppercase text-xs font-semibold tracking-wider text-purple-600">
                      {label}
                    </p>
                    <Icon className="w-6 h-6 text-purple-700 opacity-90" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h3>

                  <p className="text-gray-600 mt-2 text-base leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ⭐ PROFESSIONAL TOOLS & TECHNOLOGIES SECTION */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-purple-600 mb-4">
          Tools & Technologies You Will Use
        </h2>

        <p className="text-black text-2xl font-extrabold max-w-xl mb-12 leading-relaxed">
          Work with <span className="text-purple-600">industry-standard tools</span> that top
          companies use in real production environments.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {program.tools?.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="relative rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all p-6 flex items-center justify-center group"
            >
              <p className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-all tracking-wide">
                {tool}
              </p>

              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-gradient-to-br from-purple-600 to-indigo-600 transition-all" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ⭐ PROFESSIONAL SAMPLE PROJECTS SECTION */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-purple-600 mb-6">
          Real-World Projects You Will Build
        </h2>

        <p className="text-black text-2xl font-extrabold max-w-2xl mb-12 leading-relaxed">
          Each project is carefully structured to mirror real industry workflows — focusing on
          clean <span className="text-purple-600">architecture, scalability, and professional development practices.</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: "Portfolio Website",
              desc: "A polished personal website built using modern UI principles and responsive design standards.",
              icon: <LayoutDashboard className="w-10 h-10 text-purple-700" />,
            },
            {
              title: "E-Commerce Platform",
              desc: "A scalable storefront featuring product listings, checkout flow, and secure backend APIs.",
              icon: <ShoppingCart className="w-10 h-10 text-purple-700" />,
            },
            {
              title: "Authentication System",
              desc: "A secure JWT-based auth system with role permissions and encryption best practices.",
              icon: <ShieldCheck className="w-10 h-10 text-purple-700" />,
            },
            {
              title: "Blog Management System",
              desc: "A CMS-style platform featuring posts, comments, admin tools, and real database integration.",
              icon: <FileText className="w-10 h-10 text-purple-700" />,
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col gap-4"
            >
              <div className="p-3 rounded-xl bg-purple-50 w-fit">
                {project.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                {project.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {project.desc}
              </p>

              <button className="mt-4 text-purple-700 font-medium text-sm hover:underline inline-flex items-center gap-1">
                Learn More →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ⭐ PREMIUM AI STUDENT SUCCESS STORIES SECTION */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Student Success Stories
          </h2>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Hear how students upgraded their careers with structured learning,
            hands-on projects, and expert mentorship.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${activeTestimonial * 100}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            style={{ width: `${finalTestimonials.length * 100}%` }}
          >
            {finalTestimonials.map((t, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-4"
                style={{ minWidth: "100%" }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -6 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className="bg-white/80 backdrop-blur-xl border border-gray-200/70 shadow-xl hover:shadow-2xl rounded-3xl p-10 transition-all duration-300 relative"
                >
                  <p className="text-gray-800 text-lg leading-relaxed italic relative">
                    "{t.feedback}"
                  </p>

                  <div className="flex items-center justify-between mt-8 relative z-10">
                    <div className="flex items-center gap-4">
                    <img
  src={`https://randomuser.me/api/portraits/${
    index % 2 === 0 ? "women" : "men"
  }/${(index + 10) % 90}.jpg`}
  alt={t.name}
  className="w-14 h-14 rounded-full object-cover shadow-lg border border-purple-200"
/>



                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {t.name}
                        </h4>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-6 gap-2">
            {finalTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === activeTestimonial
                    ? "bg-purple-700 w-8"
                    : "bg-gray-300 w-3"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ⭐ PREMIUM FINAL CTA SECTION */}
<motion.section
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8 }}
  className="relative py-24 px-6 overflow-hidden"
>

  {/* Background Gradient Blur Elements */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 opacity-95"></div>
  <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/40 blur-[120px] rounded-full"></div>
  <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-500/40 blur-[120px] rounded-full"></div>

  {/* Center Content */}
  <div className="relative max-w-4xl mx-auto text-center text-white">

    {/* Premium Glass Card */}
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 p-12 rounded-3xl shadow-2xl relative"
    >
      {/* Glow Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400 to-indigo-400 opacity-20 blur-xl"></div>

      <h2 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
        Start Your {program.title} Journey Today
      </h2>

      <p className="text-purple-100 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
        Level up your skills with expert-led training, real-world projects, and a structured career roadmap.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-5">

        {/* Primary CTA */}
        <motion.button
          whileHover={{ scale: 1.07, y: -4 }}
          whileTap={{ scale: 0.96 }}
          className="px-10 py-4 bg-white text-purple-800 font-bold text-lg rounded-full shadow-xl 
                    hover:bg-purple-100 transition flex items-center gap-2"
        >
          Enroll Now <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Secondary Outline Button */}
        <motion.button
          whileHover={{ scale: 1.07, y: -4 }}
          whileTap={{ scale: 0.96 }}
          className="px-10 py-4 border border-white/50 text-white font-semibold text-lg rounded-full
                    hover:bg-white/10 transition"
        >
          Download Brochure
        </motion.button>

      </div>
    </motion.div>
  </div>
</motion.section>


      <Footer />
    </div>
  );
}
