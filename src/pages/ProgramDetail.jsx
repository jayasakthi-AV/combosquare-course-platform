// src/pages/ProgramDetail.jsx
// ─────────────────────────────────────────────────────────────────────────────
//  Dynamic program detail + enroll/pay page.
//  Route: /programs/:slug
//
//  Flow:
//   1. Fetch program from /api/programs/:slug
//   2. Check if user is already enrolled via /api/enrollments/me
//   3. If free → enroll directly via /api/enrollments/
//   4. If paid → Razorpay payment → /api/payment/create-order → verify → enrolled
//   5. After enroll → navigate to /learn/:slug
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/home/Footer";

/* ── Global keyframe injection ───────────────────────────────────────────── */
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  @keyframes spin       { to { transform: rotate(360deg); } }
  @keyframes fadeUp     { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideRight { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
  @keyframes orb1       { 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(40px,-30px) scale(1.1); } }
  @keyframes orb2       { 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(-30px,40px) scale(0.9); } }
  @keyframes orb3       { 0%,100%{ transform:translate(0,0) scale(1.05); } 60%{ transform:translate(20px,25px) scale(0.95); } }
  @keyframes pulse      { 0%,100%{ box-shadow:0 0 0 0 rgba(124,58,237,0.4); } 50%{ box-shadow:0 0 0 14px rgba(124,58,237,0); } }
  @keyframes progressFill { from { width:0; } to { width: var(--pct); } }
  @keyframes tickPop    { 0%{ transform:scale(0) rotate(-20deg); opacity:0; } 60%{ transform:scale(1.3); } 100%{ transform:scale(1); opacity:1; } }
  @keyframes cardFloat  { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-6px); } }
  @keyframes shimmer    { 0%{ background-position:-200% 0; } 100%{ background-position:200% 0; } }

  .reveal {
    opacity:0; transform:translateY(32px);
    transition: opacity 0.65s cubic-bezier(.16,1,.3,1), transform 0.65s cubic-bezier(.16,1,.3,1);
  }
  .reveal.visible { opacity:1; transform:none; }
  .reveal-left {
    opacity:0; transform:translateX(-32px);
    transition: opacity 0.65s cubic-bezier(.16,1,.3,1), transform 0.65s cubic-bezier(.16,1,.3,1);
  }
  .reveal-left.visible { opacity:1; transform:none; }

  .enroll-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 20px 52px rgba(124,58,237,0.45) !important;
  }
  .enroll-btn:active { transform: translateY(0) !important; }
  .back-btn:hover  { border-color:#7c3aed !important; color:#7c3aed !important; }
  .tool-pill:hover { transform: scale(1.06) translateY(-2px) !important; box-shadow:0 6px 20px rgba(0,0,0,0.1) !important; }
  .curr-row:hover  { background:#faf5ff !important; border-color:#c4b5fd !important; }
  .social-btn:hover { background:rgba(167,139,250,0.25) !important; color:white !important; }
  .footer-link:hover { color:#c4b5fd !important; }
`;

function InjectStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

/* ── Scroll reveal ────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll(".reveal, .reveal-left");
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
        { threshold: 0.1 }
      );
      els.forEach(el => io.observe(el));
      return () => io.disconnect();
    };
    const cleanup = run();
    return cleanup;
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function ProgramDetail() {
  const { slug }    = useParams();
  const navigate    = useNavigate();

  const [program,   setProgram]   = useState(null);
  const [enrolled,  setEnrolled]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error,     setError]     = useState("");
  const [activeTab, setActiveTab] = useState("curriculum");

  useReveal();

  /* ── Data loading ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [progRes, myEnrollRes] = await Promise.all([
          api.get(`/programs/${slug}`),
          api.get("/enrollments/me").catch(() => ({ data: [] })),
        ]);
        setProgram(progRes.data);
        const alreadyEnrolled = myEnrollRes.data.some(
          e => e.program_id === progRes.data.id
        );
        setEnrolled(alreadyEnrolled);
      } catch {
        setError("Program not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  /* ── Free enroll ── */
  const handleFreeEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post("/enrollments/", { program_id: program.id });
      setEnrolled(true);
      navigate(`/learn/${program.slug}`);
    } catch (e) {
      const msg = e.response?.data?.detail || "Enrollment failed";
      if (msg.includes("already enrolled")) {
        setEnrolled(true);
        navigate(`/learn/${program.slug}`);
      } else {
        setError(msg);
      }
    } finally {
      setEnrolling(false);
    }
  };

  /* ── Paid enroll (Razorpay) ── */
  const handlePaidEnroll = async () => {
    setEnrolling(true);
    setError("");
    try {
      // ✅ Use full URL with /api prefix
      const token = localStorage.getItem("access_token");
      const orderRes = await fetch("http://localhost:8001/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: program.id }),
      });
      const order = await orderRes.json();
      const { key_id, amount, currency, order_id, program_id } = order;
  
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
  
      const options = {
        key: key_id, amount, currency, order_id,
        name: "ComboSquare",
        description: program.title,
        handler: async (response) => {
          try {
            // ✅ Use full URL with /api prefix
            await fetch("http://localhost:8001/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                program_id,
              }),
            });
            setEnrolled(true);
            navigate(`/learn/${program.slug}`);  // ✅ uses correct slug from DB
          } catch {
            setError("Payment verification failed. Contact support.");
          }
        },
        prefill: {},
        theme: { color: "#7c3aed" },
        modal: { ondismiss: () => setEnrolling(false) },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Could not initiate payment. Try again.");
      setEnrolling(false);
    }
  };
  if (loading) return <LoadingScreen />;
  if (error && !program) return <ErrorScreen message={error} onBack={() => navigate("/programs")} />;

  const isFree = program.price === 0;
  const tabs = [
    { id: "curriculum", label: "📖 Curriculum",  show: program.curriculum?.length > 0 },
    { id: "tools",      label: "🛠 Tools",        show: program.tools?.length > 0 },
    { id: "includes",   label: "✨ What's Included", show: program.highlights?.length > 0 },
  ].filter(t => t.show);

  return (
    <div style={s.page}>
      <InjectStyles />

      {/* Animated background orbs */}
      <div style={s.orbWrap} aria-hidden="true">
        <div style={s.orb1} /><div style={s.orb2} /><div style={s.orb3} />
      </div>

      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <button className="back-btn" onClick={() => navigate("/programs")} style={s.backBtn}>
          ← All Programs
        </button>
        <div style={s.brand}>
          <span style={s.brandMark}>◈</span>
          <span style={s.brandName}>ComboSquare</span>
        </div>
        {enrolled && (
          <button onClick={() => navigate(`/learn/${program.slug}`)} style={s.continueBtn}>
            ▶ Continue Learning
          </button>
        )}
      </nav>

      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <div style={{ animation: "slideRight 0.5s ease both" }}>
            {program.level && (
              <div style={s.levelChip}>
                <span style={s.chipDot} />{program.level}
              </div>
            )}
          </div>
          <h1 style={s.heroTitle}>{program.title}</h1>
          {program.subtitle && <p style={s.heroSub}>{program.subtitle}</p>}
          <div style={s.heroMeta}>
            {program.duration && <HeroBadge icon="⏱" text={program.duration} />}
            {program.level    && <HeroBadge icon="📊" text={program.level} />}
            <HeroBadge icon={isFree ? "🎁" : "💳"} text={isFree ? "Free" : `₹${program.price}`} green={isFree} />
            {program.curriculum?.length > 0 && <HeroBadge icon="📚" text={`${program.curriculum.length} Lessons`} />}
          </div>
        </div>
        <div style={s.heroCut} />
      </div>

      {/* ── Stats strip ── */}
      <div style={s.statsRow}>
        {[
          { icon: "📖", value: program.curriculum?.length ?? "—", label: "Lessons" },
          { icon: "⏱", value: program.duration ?? "Self‑paced", label: "Duration" },
          { icon: "🛠", value: program.tools?.length ?? "—", label: "Tools" },
          { icon: "🏅", value: "Certificate", label: "On Completion" },
        ].map((s2, i) => (
          <div key={i} className="reveal" style={{ ...s.statCell, transitionDelay: `${i * 0.08}s` }}>
            <span style={s.statIcon}>{s2.icon}</span>
            <span style={s.statVal}>{s2.value}</span>
            <span style={s.statLbl}>{s2.label}</span>
          </div>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={s.body}>

        {/* LEFT */}
        <div style={s.left}>
          {/* Tab bar */}
          <div style={s.tabBar}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ ...s.tabBtn, ...(activeTab === tab.id ? s.tabActive : {}) }}>
                {tab.label}
                {activeTab === tab.id && <span style={s.tabLine} />}
              </button>
            ))}
          </div>

          {/* Curriculum */}
          {activeTab === "curriculum" && (
            <div className="reveal">
              <SectionHeader title="Course Curriculum" badge={program.curriculum?.length ? `${program.curriculum.length} lessons` : null} />
              {program.curriculum?.length > 0 ? (
                <CurriculumList items={program.curriculum} />
              ) : <Empty />}
            </div>
          )}

          {/* Tools */}
          {activeTab === "tools" && (
            <div className="reveal">
              <SectionHeader title="Tools You'll Master" badge={program.tools?.length ? `${program.tools.length} tools` : null} />
              {program.tools?.length > 0 ? (
                <div style={s.toolGrid}>
                  {program.tools.map((t, i) => (
                    <div key={t} className="tool-pill" style={{ ...s.toolCard, transitionDelay: `${i * 0.06}s` }}>
                      <div style={{ ...s.toolDot, background: PILLS[i % PILLS.length].color }} />
                      <span style={{ ...s.toolName, color: PILLS[i % PILLS.length].color }}>{t}</span>
                      <span style={s.toolSpark}>⚡</span>
                    </div>
                  ))}
                </div>
              ) : <Empty />}
            </div>
          )}

          {/* Includes */}
          {activeTab === "includes" && (
            <div className="reveal">
              <SectionHeader title="What's Included" />
              {program.highlights?.length > 0 ? (
                <div style={s.hlGrid}>
                  {program.highlights.map((h, i) => (
                    <div key={h} style={s.hlCard}>
                      <div style={s.hlCheck}>✓</div>
                      <span style={s.hlText}>{h}</span>
                    </div>
                  ))}
                </div>
              ) : <Empty />}
            </div>
          )}
        </div>

        {/* RIGHT — sticky enroll card */}
        <div style={s.right}>
          <div style={s.card} className="reveal-left">
            <div style={s.cardGlow} aria-hidden="true" />

            {/* Price */}
            <div style={s.priceRow}>
              <div>
                <p style={s.price}>
                  {isFree
                    ? <span style={{ color: "#10b981" }}>Free</span>
                    : <><span style={s.priceSym}>₹</span>{program.price}</>}
                </p>
                {!isFree && <p style={s.priceNote}>One‑time · Lifetime access</p>}
              </div>
              {!isFree && <div style={s.valueBadge}><span style={s.valueTxt}>BEST<br/>VALUE</span></div>}
            </div>

            {/* Urgency bar */}
            <div style={s.urgency}>
              <span style={s.urgencyLabel}>🔥 127 enrolled this week</span>
              <div style={s.urgencyTrack}>
                <div style={{ ...s.urgencyFill, "--pct": "74%" }} />
              </div>
              <span style={s.urgencyNote}>Limited spots remaining</span>
            </div>

            {error && <div style={s.errBox}>{error}</div>}

            {enrolled ? (
              <button className="enroll-btn"
                onClick={() => navigate(`/learn/${program.slug}`)}
                style={{ ...s.enrollBtn, background: "linear-gradient(135deg,#059669,#10b981)" }}>
                <span>▶</span> Continue Learning
              </button>
            ) : (
              <button className="enroll-btn"
                onClick={isFree ? handleFreeEnroll : handlePaidEnroll}
                disabled={enrolling}
                style={{ ...s.enrollBtn, opacity: enrolling ? 0.75 : 1 }}>
                {enrolling
                  ? <><MiniSpinner /> Processing…</>
                  : isFree
                  ? <><span>🎓</span> Enroll for Free</>
                  : <><span>💳</span> Pay ₹{program.price} & Enroll</>}
              </button>
            )}

            {/* Perks */}
            <div style={s.perks}>
              {[
                ["⚡", "Instant access after enrollment"],
                ["🎬", "Sequential HD video lessons"],
                ["📝", "Quiz after every lesson"],
                ["🏅", "Certificate on completion"],
                ["♾",  "Lifetime access, learn at your pace"],
              ].map(([icon, txt], i) => (
                <div key={i} style={{ ...s.perk, animationDelay: `${0.3 + i * 0.07}s` }}>
                  <span style={s.perkIcon}>{icon}</span>
                  <span style={s.perkTxt}>{txt}</span>
                </div>
              ))}
            </div>

            {/* Trust */}
            <div style={s.trust}>
              {["🔒 Secure", "✅ Verified", "🌟 Trusted"].map(t => (
                <span key={t} style={s.trustChip}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function HeroBadge({ icon, text, green }) {
  return (
    <span style={{
      ...s.heroBadge,
      ...(green ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" } : {}),
    }}>
      {icon} {text}
    </span>
  );
}

function SectionHeader({ title, badge }) {
  return (
    <div style={s.secHead}>
      <h2 style={s.secTitle}>{title}</h2>
      {badge && <span style={s.secBadge}>{badge}</span>}
    </div>
  );
}

function Empty() {
  return <p style={{ color: "#94a3b8", fontSize: 14, padding: "16px 0" }}>Nothing here yet.</p>;
}

function MiniSpinner() {
  return <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.35)", borderTop:"2px solid white", borderRadius:"50%", display:"inline-block", animation:"spin 0.6s linear infinite" }} />;
}

function CurriculumList({ items }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={s.currList}>
      {items.map((item, i) => (
        <div key={i} className="curr-row"
          onClick={() => setExpanded(expanded === i ? null : i)}
          style={{
            ...s.currRow,
            background: expanded === i ? "#faf5ff" : "white",
            borderColor: expanded === i ? "#c4b5fd" : "#f1f5f9",
          }}>
          <div style={s.currL}>
            <span style={s.currNum}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <span style={s.currItem}>{item}</span>
              {expanded === i && <p style={s.currHint}>Includes video, lesson notes, and a short quiz. Available after enrollment.</p>}
            </div>
          </div>
          <div style={s.currR}>
            <span style={{ color: "#7c3aed", fontSize: 14 }}>{expanded === i ? "▾" : "▸"}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>~8 min</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════════════ */


/* ── Loading ─────────────────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f3ff", gap: 18 }}>
      <div style={{ position: "relative", width: 60, height: 60 }}>
        <div style={{ width: 60, height: 60, border: "3px solid #ede9fe", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <div style={{ position: "absolute", inset: 12, border: "3px solid transparent", borderTop: "3px solid #c4b5fd", borderRadius: "50%", animation: "spin 1.3s linear infinite reverse" }} />
      </div>
      <p style={{ color: "#7c3aed", fontFamily: "'Outfit',sans-serif", fontWeight: 600, letterSpacing: "0.04em" }}>Loading…</p>
    </div>
  );
}

function ErrorScreen({ message, onBack }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Outfit',sans-serif", background: "#f5f3ff" }}>
      <span style={{ fontSize: 56 }}>😕</span>
      <p style={{ color: "#ef4444", fontWeight: 600 }}>{message}</p>
      <button onClick={onBack} style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>
        ← Back to Programs
      </button>
    </div>
  );
}

/* ── Pill color palette ──────────────────────────────────────────────────── */
const PILLS = [
  { color: "#6d28d9" }, { color: "#1d4ed8" }, { color: "#9d174d" },
  { color: "#065f46" }, { color: "#92400e" }, { color: "#3730a3" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════════════ */
const s = {
  page: {
    minHeight: "100vh", background: "#f5f3ff",
    fontFamily: "'Outfit', sans-serif", overflowX: "hidden", position: "relative",
  },

  /* Orbs */
  orbWrap: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" },
  orb1: {
    position: "absolute", top: "6%", left: "58%", width: 500, height: 500,
    background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)",
    borderRadius: "50%", animation: "orb1 13s ease-in-out infinite",
  },
  orb2: {
    position: "absolute", top: "42%", left: "-12%", width: 380, height: 380,
    background: "radial-gradient(circle, rgba(196,181,253,0.13) 0%, transparent 70%)",
    borderRadius: "50%", animation: "orb2 16s ease-in-out infinite",
  },
  orb3: {
    position: "absolute", bottom: "4%", right: "4%", width: 300, height: 300,
    background: "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)",
    borderRadius: "50%", animation: "orb3 19s ease-in-out infinite",
  },

  /* Nav */
  nav: {
    position: "relative", zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 40px",
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(196,181,253,0.3)",
  },
  backBtn: {
    background: "white", border: "1.5px solid #e8e0fd",
    color: "#64748b", padding: "8px 18px", borderRadius: 10,
    cursor: "pointer", fontSize: 13, fontWeight: 600,
    fontFamily: "'Outfit',sans-serif", transition: "all 0.2s",
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandMark: { fontSize: 20, color: "#7c3aed" },
  brandName: {
    fontFamily: "'Unbounded',sans-serif", fontSize: 14,
    fontWeight: 700, color: "#0f172a",
  },
  continueBtn: {
    background: "linear-gradient(135deg,#059669,#10b981)",
    color: "white", border: "none", padding: "9px 20px",
    borderRadius: 10, fontWeight: 700, fontSize: 13,
    cursor: "pointer", fontFamily: "'Outfit',sans-serif",
  },

  /* Hero */
  hero: {
    position: "relative", zIndex: 1,
    background: "linear-gradient(135deg, #1e0a3c 0%, #2d1a6e 50%, #4c1d95 100%)",
    padding: "60px 40px 88px", overflow: "hidden",
  },
  heroContent: { maxWidth: 820, position: "relative", zIndex: 2 },
  heroCut: {
    position: "absolute", bottom: -1, left: 0, right: 0, height: 64,
    background: "#f5f3ff", clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
  },
  levelChip: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(167,139,250,0.18)", border: "1px solid rgba(167,139,250,0.35)",
    color: "#c4b5fd", fontSize: 11, fontWeight: 700,
    padding: "4px 12px", borderRadius: 20,
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18,
  },
  chipDot: { width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", display: "inline-block" },
  heroTitle: {
    fontFamily: "'Unbounded',sans-serif",
    fontSize: "clamp(26px,3.8vw,44px)",
    fontWeight: 900, color: "white",
    margin: "0 0 14px", lineHeight: 1.15,
    animation: "fadeUp 0.7s 0.1s cubic-bezier(.16,1,.3,1) both",
  },
  heroSub: {
    fontSize: 16, color: "rgba(196,181,253,0.82)",
    lineHeight: 1.7, margin: "0 0 24px", maxWidth: 620,
    animation: "fadeUp 0.7s 0.2s cubic-bezier(.16,1,.3,1) both",
  },
  heroMeta: { display: "flex", flexWrap: "wrap", gap: 10, animation: "fadeUp 0.7s 0.3s ease both" },
  heroBadge: {
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.85)", padding: "6px 14px",
    borderRadius: 20, fontSize: 13, fontWeight: 500,
    backdropFilter: "blur(4px)",
  },

  /* Stats row */
  statsRow: {
    position: "relative", zIndex: 2,
    display: "flex", justifyContent: "center",
    background: "white",
    boxShadow: "0 4px 20px rgba(124,58,237,0.07)",
    borderBottom: "1px solid #f1f5f9",
    padding: "0 40px",
  },
  statCell: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", padding: "20px 0",
    borderRight: "1px solid #f1f5f9", gap: 4,
  },
  statIcon: { fontSize: 22, marginBottom: 2 },
  statVal:  { fontFamily: "'Unbounded',sans-serif", fontSize: 16, fontWeight: 700, color: "#0f172a" },
  statLbl:  { fontSize: 11, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" },

  /* Body */
  body: {
    display: "flex", gap: 36, maxWidth: 1140,
    margin: "0 auto", padding: "44px 40px 60px",
    position: "relative", zIndex: 2, alignItems: "flex-start",
  },
  left:  { flex: 1, minWidth: 0 },
  right: { width: 320, flexShrink: 0, position: "sticky", top: 24 },

  /* Tab bar */
  tabBar: {
    display: "flex", borderBottom: "2px solid #f1f5f9",
    marginBottom: 32, overflowX: "auto",
  },
  tabBtn: {
    position: "relative", padding: "12px 22px",
    background: "none", border: "none", color: "#94a3b8",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap",
    transition: "color 0.2s",
  },
  tabActive: { color: "#7c3aed" },
  tabLine: {
    position: "absolute", bottom: -2, left: 0, right: 0, height: 2,
    background: "linear-gradient(90deg,#7c3aed,#a855f7)",
    borderRadius: "2px 2px 0 0",
  },

  /* Section header */
  secHead:  { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  secTitle: { fontFamily: "'Unbounded',sans-serif", fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  secBadge: {
    background: "#ede9fe", color: "#6d28d9",
    fontSize: 11, fontWeight: 700,
    padding: "3px 10px", borderRadius: 20,
    textTransform: "uppercase", letterSpacing: "0.05em",
  },

  /* Curriculum */
  currList: { display: "flex", flexDirection: "column", gap: 6 },
  currRow:  {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px", borderRadius: 12, border: "1.5px solid #f1f5f9",
    cursor: "pointer", transition: "all 0.2s", background: "white",
  },
  currL:    { display: "flex", alignItems: "flex-start", gap: 14, flex: 1 },
  currR:    { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 },
  currNum:  { fontFamily: "'Unbounded',sans-serif", fontSize: 11, fontWeight: 700, color: "#c4b5fd", width: 26, flexShrink: 0, paddingTop: 2 },
  currItem: { fontSize: 14, color: "#0f172a", fontWeight: 500, lineHeight: 1.4 },
  currHint: { fontSize: 12, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 },

  /* Tools */
  toolGrid: { display: "flex", flexWrap: "wrap", gap: 12 },
  toolCard: {
    display: "flex", alignItems: "center", gap: 8,
    background: "white", border: "1.5px solid #f1f5f9",
    padding: "10px 16px", borderRadius: 12,
    cursor: "default", transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  toolDot:  { width: 8, height: 8, borderRadius: "50%" },
  toolName: { fontSize: 13, fontWeight: 700 },
  toolSpark: { fontSize: 13 },

  /* Highlights */
  hlGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  hlCard: {
    display: "flex", alignItems: "flex-start", gap: 10,
    background: "white", border: "1.5px solid #f1f5f9",
    padding: "12px 14px", borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  hlCheck: {
    width: 22, height: 22, borderRadius: "50%",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "white", fontSize: 12, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, animation: "tickPop 0.4s ease both",
  },
  hlText: { fontSize: 13, color: "#374151", lineHeight: 1.5, fontWeight: 500 },

  /* Enroll card */
  card: {
    background: "white", borderRadius: 20,
    border: "1.5px solid rgba(196,181,253,0.4)",
    padding: "28px 24px",
    boxShadow: "0 8px 40px rgba(124,58,237,0.12)",
    position: "relative", overflow: "hidden",
    animation: "cardFloat 6s ease-in-out infinite",
  },
  cardGlow: {
    position: "absolute", top: -70, right: -70, width: 220, height: 220,
    background: "radial-gradient(circle,rgba(167,139,250,0.15) 0%,transparent 70%)",
    borderRadius: "50%", pointerEvents: "none",
  },
  priceRow:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  price: {
    fontFamily: "'Unbounded',sans-serif",
    fontSize: 36, fontWeight: 900, color: "#0f172a", margin: 0,
  },
  priceSym:  { fontSize: 20, verticalAlign: "super", marginRight: 2, color: "#7c3aed" },
  priceNote: { fontSize: 11, color: "#94a3b8", margin: "4px 0 0" },
  valueBadge: {
    width: 52, height: 52, borderRadius: "50%",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "pulse 2.5s ease-in-out infinite",
  },
  valueTxt: { color: "white", fontSize: 9, fontWeight: 800, textAlign: "center", lineHeight: 1.3, letterSpacing: "0.03em" },

  urgency:      { marginBottom: 20 },
  urgencyLabel: { fontSize: 12, color: "#ef4444", fontWeight: 600, display: "block", marginBottom: 6 },
  urgencyTrack: { height: 6, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", marginBottom: 4 },
  urgencyFill:  {
    height: "100%", width: "var(--pct)",
    background: "linear-gradient(90deg,#7c3aed,#a855f7)",
    borderRadius: 4, animation: "progressFill 1.2s 0.6s cubic-bezier(.16,1,.3,1) both",
  },
  urgencyNote:  { fontSize: 11, color: "#94a3b8" },

  enrollBtn: {
    width: "100%", padding: "15px",
    background: "linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)",
    color: "white", border: "none", borderRadius: 12,
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Outfit',sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    marginBottom: 20, transition: "all 0.22s ease",
    boxShadow: "0 8px 28px rgba(124,58,237,0.32)",
  },

  perks: { borderTop: "1px solid #f1f5f9", paddingTop: 16, marginBottom: 16 },
  perk: {
    display: "flex", alignItems: "center", gap: 10,
    fontSize: 12, color: "#475569", marginBottom: 9,
    animation: "fadeUp 0.4s ease both",
  },
  perkIcon: { fontSize: 14, width: 20, textAlign: "center", flexShrink: 0 },
  perkTxt:  { fontWeight: 500 },

  trust:     { display: "flex", gap: 6, justifyContent: "center" },
  trustChip: {
    background: "#f8fafc", border: "1px solid #e2e8f0",
    color: "#64748b", fontSize: 10, fontWeight: 700,
    padding: "4px 10px", borderRadius: 20,
  },

  errBox: {
    background: "#fee2e2", color: "#b91c1c",
    padding: "10px 14px", borderRadius: 10,
    fontSize: 12, marginBottom: 12, fontWeight: 500,
  },
};

/* ── Footer styles ───────────────────────────────────────────────────────── */
const f = {
  footer: {
    position: "relative", zIndex: 2, marginTop: 20,
    background: "linear-gradient(160deg, #1e0a3c 0%, #2d1a6e 55%, #4c1d95 100%)",
    color: "white", fontFamily: "'Outfit',sans-serif",
  },
  body: {
    display: "flex", flexWrap: "wrap", gap: 40,
    maxWidth: 1140, margin: "0 auto",
    padding: "52px 40px 40px",
  },
  brandCol:  { flex: "0 0 220px", minWidth: 180 },
  brandRow:  { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  brandMark: { fontSize: 24, color: "#a78bfa" },
  brandName: { fontFamily: "'Unbounded',sans-serif", fontSize: 14, fontWeight: 900, color: "white" },
  tagline:   { color: "rgba(196,181,253,0.72)", fontSize: 13, lineHeight: 1.7, marginBottom: 18 },
  socials:   { display: "flex", gap: 8, marginBottom: 20 },
  socialBtn: {
    width: 34, height: 34, borderRadius: 8,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
    color: "#c4b5fd", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, textDecoration: "none", transition: "all 0.2s",
  },
  nlLabel: { color: "rgba(196,181,253,0.55)", fontSize: 11, marginBottom: 8 },
  nl:      { display: "flex", gap: 6 },
  nlInput: {
    flex: 1, padding: "9px 12px",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8, color: "white", fontSize: 12,
    fontFamily: "'Outfit',sans-serif", outline: "none",
  },
  nlBtn: {
    padding: "9px 14px", borderRadius: 8,
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15,
  },
  linkCol: { flex: "0 0 120px", display: "flex", flexDirection: "column", gap: 10 },
  colHead: {
    fontFamily: "'Unbounded',sans-serif",
    fontSize: 10, fontWeight: 700, color: "white",
    textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px",
  },
  fLink: { color: "rgba(196,181,253,0.62)", fontSize: 13, textDecoration: "none", transition: "color 0.2s" },
  bottom: {
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
    maxWidth: 1140, margin: "0 auto",
    padding: "18px 40px",
    borderTop: "1px solid rgba(255,255,255,0.07)", gap: 10,
  },
  copy:   { fontSize: 12, color: "rgba(196,181,253,0.45)" },
  bLinks: { display: "flex", alignItems: "center", gap: 8 },
};