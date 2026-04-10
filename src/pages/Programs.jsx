import { Link } from "react-router-dom";
import { programData } from "../data/programData";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Clock, Users, Sparkles, ChevronRight,
  Star, Zap, Shield, Award, BookOpen, Rocket, Brain,
  TrendingUp, Palette, Code2, Database
} from "lucide-react";
import Footer from "../components/home/Footer";

/* ─── Animated Counter ─────────────────────────────────── */
function CountUp({ end, suffix = "", duration = 2200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Floating orb ─────────────────────────────────────── */
function Orb({ style, duration = 6, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Particles ────────────────────────────────────────── */
function Particle({ x, y, size, color, delay, dur }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{ y: [0, -35, 0], opacity: [0.15, 0.55, 0.15] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Metadata ─────────────────────────────────────────── */
const programMeta = {
  "full-stack": {
    duration: "6 Months", students: 1200, level: "Beginner–Intermediate",
    icon: Code2, tag: "Most Popular",
    grad: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #A78BFA 100%)",
    glow: "rgba(124,58,237,0.45)",
    accent: "#A78BFA",
  },
  "ai-foundations": {
    duration: "4 Months", students: 850, level: "Beginner",
    icon: Brain, tag: "Trending",
    grad: "linear-gradient(135deg, #3B1080 0%, #6D28D9 60%, #8B5CF6 100%)",
    glow: "rgba(109,40,217,0.45)",
    accent: "#8B5CF6",
  },
  "data-science": {
    duration: "5 Months", students: 940, level: "Beginner–Intermediate",
    icon: Database, tag: "High Demand",
    grad: "linear-gradient(135deg, #2E1065 0%, #5B21B6 60%, #7C3AED 100%)",
    glow: "rgba(91,33,182,0.45)",
    accent: "#7C3AED",
  },
  "ui-ux": {
    duration: "3 Months", students: 620, level: "Beginner",
    icon: Palette, tag: "Creative",
    grad: "linear-gradient(135deg, #1E0750 0%, #4C1D95 60%, #6D28D9 100%)",
    glow: "rgba(76,29,149,0.45)",
    accent: "#6D28D9",
  },
};

const stats = [
  { label: "Students Enrolled", end: 3600, suffix: "+", icon: Users, color: "#A78BFA" },
  { label: "Programs", end: 4, suffix: "+", icon: BookOpen, color: "#8B5CF6" },
  { label: "Placement Rate", end: 92, suffix: "%", icon: TrendingUp, color: "#7C3AED" },
  { label: "Expert Mentors", end: 50, suffix: "+", icon: Award, color: "#6D28D9" },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  x: `${(i * 5.3 + 2) % 98}%`,
  y: `${(i * 9.1 + 4) % 92}%`,
  size: `${4 + (i % 4) * 2}px`,
  color: ["rgba(167,139,250,0.5)", "rgba(124,58,237,0.4)", "rgba(196,181,253,0.3)", "rgba(109,40,217,0.45)"][i % 4],
  delay: i * 0.28,
  dur: 4 + (i % 4),
}));

/* ─── Program Card ─────────────────────────────────────── */
function ProgramCard({ program, meta, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon = meta.icon;
  const cardRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/program/${program.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <motion.div
          ref={cardRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setMouse({ x: 0.5, y: 0.5 }); }}
          onMouseMove={handleMouseMove}
          whileHover={{ scale: 1.028, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative h-full rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: hovered ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(124,58,237,0.15)",
            boxShadow: hovered
              ? `0 0 0 1px rgba(167,139,250,0.25), 0 8px 60px ${meta.glow}, 0 30px 80px rgba(15,3,40,0.45), inset 0 1px 0 rgba(255,255,255,0.07)`
              : "0 4px 30px rgba(10,6,18,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
            transition: "border 0.3s ease, box-shadow 0.35s ease",
          }}
        >
          {/* Mouse-follow spotlight */}
          {hovered && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 260px 180px at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(139,92,246,0.13) 0%, transparent 65%)`,
                transition: "background 0.1s",
              }}
            />
          )}

          {/* Top gradient shimmer bar */}
          <div className="h-[2px] w-full shrink-0" style={{ background: meta.grad }} />

          {/* Subtle inner glow at top */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)" }}
          />

          <div className="p-6 flex flex-col flex-1 relative z-10">
            {/* Header row */}
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(76,29,149,0.15))",
                  border: "1px solid rgba(124,58,237,0.3)",
                  boxShadow: hovered ? `0 0 20px ${meta.glow}` : "none",
                  transition: "box-shadow 0.3s",
                }}
              >
                <Icon size={22} color={meta.accent} />
              </div>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full tracking-wide"
                style={{
                  background: "rgba(124,58,237,0.14)",
                  border: "1px solid rgba(124,58,237,0.28)",
                  color: "#C4B5FD",
                }}
              >
                {meta.tag}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-xl font-black leading-snug mb-2"
              style={{
                color: hovered ? "#EDE9FE" : "#DDD6FE",
                transition: "color 0.3s",
              }}
            >
              {program.title}
            </h3>

            <p className="text-sm leading-relaxed mb-5 line-clamp-2" style={{ color: "rgba(196,181,253,0.55)" }}>
              {program.subtitle}
            </p>

            {/* Meta pills row */}
            <div className="flex flex-wrap gap-2.5 mb-5">
              {[
                { icon: Clock, label: meta.duration },
                { icon: Users, label: `${meta.students.toLocaleString()}+ enrolled` },
                { icon: Zap, label: meta.level },
              ].map(({ icon: I, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(76,29,149,0.2)", border: "1px solid rgba(124,58,237,0.18)", color: "rgba(196,181,253,0.7)" }}
                >
                  <I size={11} style={{ color: meta.accent }} />
                  {label}
                </span>
              ))}
            </div>

            {/* Skill pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {program.tools.map((tool) => (
                <motion.span
                  key={tool}
                  whileHover={{ scale: 1.06 }}
                  className="text-xs px-2.5 py-1 rounded-full font-semibold cursor-default"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.22)",
                    color: "#C4B5FD",
                  }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>

            {/* Highlights */}
            <ul className="space-y-2.5 mb-6 flex-1">
              {program.highlights.slice(0, 3).map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 + i * 0.06 }}
                  className="flex items-center gap-2.5 text-sm"
                  style={{ color: "rgba(196,181,253,0.65)" }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                    style={{ background: "rgba(124,58,237,0.3)", color: meta.accent }}
                  >
                    ✓
                  </span>
                  {h}
                </motion.li>
              ))}
            </ul>

            {/* CTA button */}
            <motion.div
              className="flex items-center justify-between rounded-xl px-5 py-3.5 text-sm font-bold text-white relative overflow-hidden"
              style={{
                background: meta.grad,
                boxShadow: hovered ? `0 4px 30px ${meta.glow}, 0 2px 60px rgba(76,29,149,0.3)` : "0 2px 12px rgba(76,29,149,0.2)",
                transition: "box-shadow 0.3s",
              }}
            >
              {hovered && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
                />
              )}
              <span className="relative z-10">Explore Program</span>
              <motion.span
                animate={hovered ? { x: 5 } : { x: 0 }}
                transition={{ duration: 0.25 }}
                className="relative z-10"
              >
                <ArrowRight size={16} />
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ─── Featured scroll strip ────────────────────────────── */
function TechStrip() {
  const programs = Object.values(programData);
  const tripled = [...programs, ...programs, ...programs];

  return (
    <div className="py-14 overflow-hidden" style={{ background: "#060310" }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-xs font-bold tracking-[0.25em] uppercase mb-8 px-6"
        style={{ color: "rgba(167,139,250,0.4)" }}
      >
        ✦  Featured Programs  ✦
      </motion.p>
      <div className="relative">
        <div
          className="flex gap-4 py-2"
          style={{ animation: "scrollLeft 28s linear infinite", width: "max-content" }}
        >
          {tripled.map((p, i) => {
            const meta = programMeta[p.id];
            const Icon = meta?.icon || Sparkles;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-full shrink-0"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <Icon size={15} color={meta?.accent || "#A78BFA"} />
                <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "#C4B5FD" }}>
                  {p.title}
                </span>
                {p.tools.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
        <div className="absolute inset-y-0 left-0 w-28 pointer-events-none" style={{ background: "linear-gradient(90deg, #060310, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-28 pointer-events-none" style={{ background: "linear-gradient(-90deg, #060310, transparent)" }} />
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function Programs() {
  const programs = Object.values(programData);

  return (
    <div className="min-h-screen" style={{ background: "#08041A", fontFamily: "inherit" }}>

      {/* ══════════════════ HERO ══════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>

        {/* Deep space base */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 140% 90% at 50% -10%, #1E0B4B 0%, #110630 35%, #08041A 75%, #04020D 100%)",
          }}
        />

        {/* Orbs */}
        <Orb style={{ width: 700, height: 700, top: -250, left: -200, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} duration={9} />
        <Orb style={{ width: 550, height: 550, top: -100, right: -180, background: "radial-gradient(circle, rgba(76,29,149,0.22) 0%, transparent 70%)" }} duration={11} delay={1.5} />
        <Orb style={{ width: 400, height: 400, bottom: 40, left: "35%", background: "radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 70%)" }} duration={8} delay={3} />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)",
          }}
        />

        {/* Particles */}
        {particles.map((p, i) => <Particle key={i} {...p} />)}

        {/* Central glow */}
        <div
          className="absolute pointer-events-none"
          style={{ width: 900, height: 600, top: "10%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 65%)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-36 pb-28">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full mb-9"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.35)",
                color: "#C4B5FD",
                backdropFilter: "blur(14px)",
                boxShadow: "0 0 24px rgba(124,58,237,0.15)",
              }}
            >
              <Sparkles size={12} color="#A78BFA" />
              India's #1 Tech Learning Platform
              <Sparkles size={12} color="#A78BFA" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="font-black leading-[1.08] mb-6 max-w-5xl"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}
          >
            <span className="block text-white">Master the Skills</span>
            <span
              className="block"
              style={{
                background: "linear-gradient(110deg, #C4B5FD 0%, #A78BFA 30%, #7C3AED 60%, #DDD6FE 100%)",
                backgroundSize: "250% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmerText 5s linear infinite",
              }}
            >
              of Tomorrow
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
            style={{ color: "rgba(196,181,253,0.6)" }}
          >
            Industry-designed programs with real-world projects, 1-on-1 mentorship, and guaranteed placement support. Your dream career starts here.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mb-20"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-white text-sm md:text-base"
              style={{
                background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 55%, #A78BFA 100%)",
                boxShadow: "0 0 35px rgba(124,58,237,0.5), 0 8px 32px rgba(76,29,149,0.35)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 60px rgba(124,58,237,0.8), 0 12px 50px rgba(76,29,149,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 35px rgba(124,58,237,0.5), 0 8px 32px rgba(76,29,149,0.35)"; e.currentTarget.style.transform = "none"; }}
            >
              <Rocket size={17} />
              Get Free Counselling
              <ChevronRight size={17} />
            </Link>
            <a
              href="#programs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm md:text-base"
              style={{
                border: "1px solid rgba(124,58,237,0.4)",
                color: "#C4B5FD",
                background: "rgba(124,58,237,0.07)",
                backdropFilter: "blur(14px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.18)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.6)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.07)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Browse Programs
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl"
          >
            {stats.map(({ label, end, suffix, icon: Icon, color }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center p-5 rounded-2xl relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}18 0%, transparent 65%)` }} />
                <Icon size={20} color={color} style={{ marginBottom: 8, position: "relative", zIndex: 1 }} />
                <span className="text-3xl md:text-4xl font-black text-white relative z-10" style={{ lineHeight: 1.1 }}>
                  <CountUp end={end} suffix={suffix} />
                </span>
                <span className="text-xs text-center mt-1.5 relative z-10" style={{ color: "rgba(196,181,253,0.5)", lineHeight: 1.3 }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(transparent, #08041A)" }} />
      </section>

      {/* ══════════════ PROGRAMS SECTION ════════════════ */}
      <section id="programs" className="relative px-4 md:px-6 py-24" style={{ background: "#08041A" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 900, height: 500, background: "radial-gradient(ellipse, rgba(76,29,149,0.14) 0%, transparent 65%)" }} />
        <div className="absolute left-0 top-1/3 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 70%)" }} />
        <div className="absolute right-0 bottom-1/3 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase mb-5 px-4 py-2 rounded-full"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)", color: "#A78BFA" }}
            >
              Our Programs
            </motion.span>

            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              <span className="text-white">Choose Your </span>
              <span style={{
                background: "linear-gradient(110deg, #A78BFA 0%, #7C3AED 45%, #C4B5FD 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmerText 4s linear infinite",
              }}>
                Learning Path
              </span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(196,181,253,0.5)" }}>
              Crafted with industry experts. Click any card to explore the curriculum and enroll.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {programs.map((program, i) => (
              <ProgramCard key={program.id} program={program} meta={programMeta[program.id]} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SCROLL STRIP ═════════════════ */}
      <TechStrip />

      {/* ══════════════ CTA SECTION ══════════════════ */}
      <section className="px-4 md:px-6 py-24" style={{ background: "#08041A" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75 }}
            className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(76,29,149,0.35) 0%, rgba(124,58,237,0.15) 45%, rgba(76,29,149,0.35) 100%)",
              border: "1px solid rgba(124,58,237,0.32)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 90px rgba(124,58,237,0.2), 0 2px 120px rgba(76,29,149,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(124,58,237,0.3) 0%, transparent 55%)", animation: "pulseGlow 5s ease-in-out infinite" }} />
            <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none opacity-40" style={{ background: "radial-gradient(circle at 0% 0%, rgba(167,139,250,0.3) 0%, transparent 60%)" }} />
            <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none opacity-40" style={{ background: "radial-gradient(circle at 100% 100%, rgba(109,40,217,0.3) 0%, transparent 60%)" }} />

            <div className="relative z-10">
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4, type: "spring" }}>
                    <Star size={20} fill="#7C3AED" color="#7C3AED" />
                  </motion.div>
                ))}
              </div>

              <h3 className="font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(1.7rem, 4vw, 2.8rem)" }}>
                Not sure which program
                <br />
                <span style={{ background: "linear-gradient(110deg, #C4B5FD 0%, #A78BFA 50%, #DDD6FE 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  is right for you?
                </span>
              </h3>

              <p className="text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(196,181,253,0.6)" }}>
                Talk to our expert counsellors — completely free, no pressure, just honest guidance tailored to your goals.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white text-base md:text-lg"
                style={{
                  background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)",
                  backgroundSize: "200% auto",
                  boxShadow: "0 0 45px rgba(124,58,237,0.6), 0 10px 40px rgba(76,29,149,0.4)",
                  transition: "all 0.35s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 80px rgba(124,58,237,0.9), 0 15px 60px rgba(76,29,149,0.55)"; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 45px rgba(124,58,237,0.6), 0 10px 40px rgba(76,29,149,0.4)"; e.currentTarget.style.transform = "none"; }}
              >
                <Rocket size={20} />
                Book Free Counselling Session
                <ArrowRight size={20} />
              </Link>

              <p className="text-xs mt-6 flex flex-wrap items-center justify-center gap-4" style={{ color: "rgba(167,139,250,0.4)" }}>
                <span className="flex items-center gap-1.5"><Shield size={12} /> 100% Free</span>
                <span className="flex items-center gap-1.5"><Zap size={12} /> No Spam</span>
                <span className="flex items-center gap-1.5"><Award size={12} /> Expert Guidance</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
}
