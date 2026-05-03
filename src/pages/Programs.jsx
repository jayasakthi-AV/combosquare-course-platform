// src/pages/Programs.jsx
// ─────────────────────────────────────────────────────────────────────────────
//  UI REDESIGN — Purple & White Theme
//  All API calls, routing, and data logic are UNCHANGED.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/home/Footer";


// ── Level config ──────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  Beginner:     { dot: "#22c55e", label: "BEG", abbr: "Beginner",     bg: "#f0fdf4", text: "#15803d" },
  Intermediate: { dot: "#f59e0b", label: "INT", abbr: "Intermediate", bg: "#fffbeb", text: "#b45309" },
  Advanced:     { dot: "#ef4444", label: "ADV", abbr: "Advanced",     bg: "#fef2f2", text: "#b91c1c" },
};

// ── Card accent colours (purple family + complementary) ───────────────────────
const ACCENTS = [
  "#7c3aed", "#9333ea", "#6d28d9", "#a855f7",
  "#4f46e5", "#8b5cf6", "#c026d3", "#7e22ce",
];

// ── Ticker ────────────────────────────────────────────────────────────────────
const TICKER = [
  "New Courses Added Weekly",
  "Learn at Your Pace",
  "Industry-Expert Instructors",
  "Certificate on Completion",
  "Lifetime Access Included",
  "Live Mentorship Sessions",
  "Placement Assistance",
  "Real-World Projects",
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "50,000+", label: "Students Enrolled" },
  { value: "98%",     label: "Satisfaction Rate" },
  { value: "4.9★",    label: "Average Rating" },
  { value: "200+",    label: "Expert Mentors" },
];

// ── Trust badges ──────────────────────────────────────────────────────────────
const TRUST = ["ISO Certified", "NASSCOM Member", "AICTE Approved", "Live Projects"];

export default function Programs() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");
  const [view, setView]         = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy]     = useState("default"); // "default" | "price-asc" | "price-desc" | "alpha"
  const [wishlist, setWishlist] = useState(new Set());
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);

  // ── Unchanged: fetch all active programs ──────────────────────────────────
  useEffect(() => {
    api.get("/programs/")
      .then(r => setPrograms(r.data))
      .catch(() => setError("Could not load programs. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2400);
  };

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Removed from wishlist"); }
      else              { next.add(id);    showToast("Added to wishlist ♥"); }
      return next;
    });
  };

  const toggleCompare = (e, program) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.find(p => p.id === program.id)) {
        showToast("Removed from compare");
        return prev.filter(p => p.id !== program.id);
      }
      if (prev.length >= 3) { showToast("Compare up to 3 programs only"); return prev; }
      showToast("Added to compare");
      return [...prev, program];
    });
  };

  // ── Derive levels + visible + sorted subset ────────────────────────────────
  const levels  = ["All", ...new Set(programs.map(p => p.level).filter(Boolean))];
  let visible = programs.filter(p => {
    const matchesLevel  = filter === "All" || p.level === filter;
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.subtitle || "").toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (sortBy === "price-asc")  visible = [...visible].sort((a, b) => (a.price||0) - (b.price||0));
  if (sortBy === "price-desc") visible = [...visible].sort((a, b) => (b.price||0) - (a.price||0));
  if (sortBy === "alpha")      visible = [...visible].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div style={s.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes pulse     { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#f3f0ff}
        ::-webkit-scrollbar-thumb{background:#a78bfa;border-radius:10px}

        .prog-card:hover .card-glow{opacity:1 !important}
        .prog-card:hover .card-img-overlay{opacity:1 !important}
        .pill-btn:hover{background:#ede9fe !important;color:#6d28d9 !important}
        .sort-select:hover{border-color:#a78bfa !important}
        .wishlist-btn:hover{transform:scale(1.2) !important}
        .compare-btn:hover{opacity:1 !important}
        .explore-btn:hover{background:linear-gradient(135deg,#6d28d9,#4f46e5) !important;transform:translateY(-1px) !important;box-shadow:0 8px 24px rgba(109,40,217,.4) !important}
        .back-btn:hover{background:rgba(167,139,250,.15) !important;border-color:#a78bfa !important;color:#a78bfa !important}
        .view-btn:hover{color:#7c3aed !important}
      `}</style>

      {/* ── Toast notification ── */}
      {toastMsg && (
        <div style={s.toast}>{toastMsg}</div>
      )}

      {/* ══════════════════════════════════════
          PURPLE HERO
      ══════════════════════════════════════ */}
      <div style={s.hero}>
        {/* Layered background */}
        <div style={s.heroBg1} />
        <div style={s.heroBg2} />
        <div style={s.heroOrb1} />
        <div style={s.heroOrb2} />
        <div style={s.heroGrid} />

        {/* Ticker */}
        <div style={s.ticker}>
          <div style={s.tickerTrack}>
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} style={s.tickerItem}>
                <span style={s.tickerDiamond}>◆</span>{t}
              </span>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div style={s.heroNav}>
          <button className="back-btn" onClick={() => navigate("/dashboard")} style={s.backBtn}>
            ← Dashboard
          </button>
          <div style={s.navCenter}>
            <span style={s.brandMark}>
              <span style={s.brandIcon}>◈</span> COMBOSQUARE
            </span>
          </div>
          <div style={s.trustBadges}>
            {TRUST.map(t => (
              <span key={t} style={s.trustBadge}>{t}</span>
            ))}
          </div>
        </div>

        {/* Hero copy */}
        <div style={s.heroCopy}>
          <div style={s.eyebrow}>
            <span style={s.pulseDot} />
            {loading ? "Loading programs…" : `${programs.length} Professional Programs Available`}
          </div>

          <h1 style={s.heroTitle}>
            Master the Skills
            <br />
            <em style={s.heroItalic}>Industry Demands.</em>
          </h1>

          <p style={s.heroSub}>
            Hands-on, mentor-led programs built for real-world outcomes.
            Certificates that employers recognize.
          </p>

          {/* CTA row */}
          <div style={s.heroCTAs}>
            <button
              onClick={() => document.getElementById("programs-grid")?.scrollIntoView({ behavior: "smooth" })}
              style={s.ctaPrimary}
            >
              Browse Programs ↓
            </button>
            <button style={s.ctaSecondary} onClick={() => navigate("/contact")}>
              Talk to Counsellor
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={s.statsBar}>
          {STATS.map((st, i) => (
            <div key={i} style={s.statItem}>
              <div style={s.statValue}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={s.searchOuter}>
          <div style={s.searchWrap}>
            <svg style={s.searchIcon} viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#a78bfa" strokeWidth="1.6"/>
              <path d="M11 11L14 14" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              style={s.searchInput}
              placeholder="Search programs, skills, tools, topics…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={s.searchClear}
              >✕</button>
            )}
          </div>
        </div>

        <div style={{ height: 32 }} />
      </div>

      {/* ══════════════════════════════════════
          STICKY CONTROLS BAR
      ══════════════════════════════════════ */}
      <div style={s.controlsBar}>
        {/* Filter pills */}
        <div style={s.filterPills}>
          {levels.map(l => (
            <button
              key={l}
              className="pill-btn"
              onClick={() => setFilter(l)}
              style={{ ...s.pill, ...(filter === l ? s.pillActive : {}) }}
            >
              {l === "All" ? "✦ All Programs" : l}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={s.rightControls}>
          {!loading && !error && (
            <span style={s.countLabel}>
              {visible.length} result{visible.length !== 1 ? "s" : ""}
            </span>
          )}

          {/* Sort */}
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={s.sortSelect}
          >
            <option value="default">Sort: Default</option>
            <option value="alpha">A → Z</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>

          {/* View toggle */}
          <div style={s.viewToggle}>
            <button
              className="view-btn"
              onClick={() => setView("grid")}
              style={{ ...s.viewBtn, ...(view === "grid" ? s.viewBtnActive : {}) }}
              title="Grid view"
            >⊞</button>
            <button
              className="view-btn"
              onClick={() => setView("list")}
              style={{ ...s.viewBtn, ...(view === "list" ? s.viewBtnActive : {}) }}
              title="List view"
            >☰</button>
          </div>
        </div>
      </div>

      {/* Compare tray */}
      {compareList.length > 0 && (
        <div style={s.compareTray}>
          <span style={s.compareTrayLabel}>Comparing {compareList.length}/3:</span>
          {compareList.map(p => (
            <div key={p.id} style={s.compareTrayItem}>
              <span>{p.title}</span>
              <button onClick={() => setCompareList(prev => prev.filter(x => x.id !== p.id))} style={s.compareTrayRemove}>✕</button>
            </div>
          ))}
          <button
            style={s.compareTrayBtn}
            onClick={() => setShowCompare(true)}
            disabled={compareList.length < 2}
          >
            Compare Now →
          </button>
          <button style={s.compareTryClear} onClick={() => setCompareList([])}>Clear</button>
        </div>
      )}

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div style={s.main} id="programs-grid">

        {/* Loading skeletons */}
        {loading && (
          <div style={s.skeletonGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={s.skeleton}>
                <div style={s.skeletonBar} />
                <div style={{ ...s.skeletonLine, width: "60%", marginTop: 16 }} />
                <div style={{ ...s.skeletonLine, width: "90%", marginTop: 10 }} />
                <div style={{ ...s.skeletonLine, width: "75%", marginTop: 8 }} />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={s.errorBox}>
            <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && visible.length === 0 && (
          <div style={s.empty}>
            <span style={{ fontSize: 56, display: "block", marginBottom: 14 }}>🔍</span>
            <h3 style={{ color: "#6d28d9", fontFamily: "'DM Serif Display', serif", fontSize: 22, margin: "0 0 8px" }}>
              No results found
            </h3>
            <p style={{ color: "#7c3aed", fontSize: 13, opacity: 0.7 }}>
              {programs.length === 0
                ? "No programs available yet. Check back soon!"
                : "Try a different search term or level filter."}
            </p>
            {search && (
              <button onClick={() => setSearch("")} style={{ ...s.ctaPrimary, marginTop: 16, padding: "8px 20px", fontSize: 12 }}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Grid / List */}
        {!loading && !error && visible.length > 0 && (
          <div style={view === "grid" ? s.grid : s.listView}>
            {visible.map((program, i) => (
              <ProgramCard
                key={program.id}
                program={program}
                index={i}
                accent={ACCENTS[i % ACCENTS.length]}
                isGrid={view === "grid"}
                isWishlisted={wishlist.has(program.id)}
                isComparing={!!compareList.find(p => p.id === program.id)}
                onWishlist={(e) => toggleWishlist(e, program.id)}
                onCompare={(e) => toggleCompare(e, program)}
                onClick={() => navigate(`/programs/${program.slug}`)}
              />
            ))}
          </div>
        )}

        {/* "Why ComboSquare" section */}
        {!loading && !error && (
          <WhySection />
        )}
      </div>

      {/* Compare modal */}
      {showCompare && compareList.length >= 2 && (
        <CompareModal programs={compareList} onClose={() => setShowCompare(false)} navigate={navigate} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ── Why Section ───────────────────────────────────────────────────────────────
function WhySection() {
  const [hovered, setHovered] = useState(null); // ✅ REQUIRED

  const WHY = [
    { icon: "🎯", title: "Outcome-Focused", desc: "Every module mapped to real job skills employers actively seek." },
    { icon: "🧑‍🏫", title: "Live Mentorship", desc: "Weekly 1:1 sessions with industry practitioners, not just pre-recorded videos." },
    { icon: "🏆", title: "Verified Certificates", desc: "Blockchain-verified credentials shared directly to LinkedIn." },
    { icon: "💼", title: "Placement Support", desc: "Dedicated career cell with 500+ hiring partners across India." },
    { icon: "🔁", title: "Lifetime Access", desc: "Content updates included forever — learn at your own pace." },
    { icon: "🌐", title: "Global Community", desc: "Join 50,000+ learners, alumni networks, and Discord study groups." },
  ];

  return (
    <div style={s.whySection}>
      <div style={s.whyHeader}>
        <div style={s.whyEyebrow}>Why ComboSquare?</div>
        <h2 style={s.whyTitle}>
          Everything You Need to <em style={{ fontStyle: "italic" }}>Succeed</em>
        </h2>
      </div>

      <div style={s.whyGrid}>
        {WHY.map((w, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...s.whyCard,
              ...(hovered === i ? s.whyCardHover : {})
            }}
          >
            <div
              style={{
                ...s.whyIcon,
                transform: hovered === i ? "scale(1.15)" : "scale(1)"
              }}
            >
              {w.icon}
            </div>

            <div style={s.whyCardTitle}>{w.title}</div>
            <div style={s.whyCardDesc}>{w.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Compare Modal ─────────────────────────────────────────────────────────────
function CompareModal({ programs, onClose, navigate }) {
  const fields = ["title", "level", "duration", "price"];
  const labels = { title: "Program", level: "Level", duration: "Duration", price: "Price" };

  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>Compare Programs</h3>
          <button onClick={onClose} style={s.modalClose}>✕</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={s.compareTable}>
            <thead>
              <tr>
                <th style={s.compareTh}>Feature</th>
                {programs.map(p => (
                  <th key={p.id} style={{ ...s.compareTh, color: "#7c3aed" }}>{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(f => (
                <tr key={f}>
                  <td style={s.compareTd}><strong>{labels[f]}</strong></td>
                  {programs.map(p => (
                    <td key={p.id} style={s.compareTd}>
                      {f === "price"
                        ? (p[f] === 0 ? <span style={{ color: "#059669", fontWeight: 700 }}>FREE</span> : `₹${p[f]?.toLocaleString("en-IN")}`)
                        : (p[f] || "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={s.modalFooter}>
          {programs.map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/programs/${p.slug}`)}
              style={s.modalEnrollBtn}
            >
              View {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Program Card ──────────────────────────────────────────────────────────────
function ProgramCard({ program, index, accent, isGrid, isWishlisted, isComparing, onWishlist, onCompare, onClick }) {
  const [hovered, setHovered] = useState(false);
  const level = LEVEL_CONFIG[program.level] || { dot: "#94a3b8", label: "—", abbr: "All Levels", bg: "#f8fafc", text: "#64748b" };
  const num   = String(index + 1).padStart(2, "0");

  if (!isGrid) {
    // ── List row ──
    return (
      <div
        className="prog-card"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...s.listCard,
          borderColor: hovered ? accent : "#ede9fe",
          boxShadow: hovered ? `0 8px 32px rgba(109,40,217,.12)` : "none",
        }}
      >
        <div style={{ ...s.listAccent, background: accent }} />
        <div style={s.listBody}>
          <div style={s.listLeft}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: accent, opacity: 0.5 }}>{num}</span>
              <span style={{ ...s.levelBadge, background: level.bg, color: level.text, border: `1px solid ${level.dot}33` }}>
                <span style={{ ...s.levelDot, background: level.dot }} />{level.abbr}
              </span>
              {program.price === 0 && <span style={s.freeTag}>FREE</span>}
            </div>
            <h2 style={{ ...s.cardTitle, margin: 0, fontSize: 17 }}>{program.title}</h2>
            {program.subtitle && <p style={{ ...s.cardSubtitle, margin: "4px 0 0" }}>{program.subtitle}</p>}
          </div>
          <div style={s.listRight}>
            {program.duration && <span style={s.metaItem}>◷ {program.duration}</span>}
            {program.tools?.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 200 }}>
                {program.tools.slice(0, 3).map(t => (
                  <span key={t} style={s.toolChip}>{t}</span>
                ))}
                {program.tools.length > 3 && <span style={{ ...s.toolChip, color: "#9ca3af" }}>+{program.tools.length - 3}</span>}
              </div>
            )}
          </div>
          <div style={s.listActions}>
            {program.price !== 0 && (
              <div style={s.priceText}>₹{program.price?.toLocaleString("en-IN")}</div>
            )}
            <button
              className="explore-btn"
              onClick={onClick}
              style={{ ...s.exploreBtn, padding: "7px 16px", fontSize: 11 }}
            >
              View →
            </button>
            <button
              className="wishlist-btn"
              onClick={onWishlist}
              style={{ ...s.wishlistBtn, color: isWishlisted ? "#e11d48" : "#c4b5fd" }}
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid card ──
  return (
    <div
      className="prog-card"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s.card,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 24px 56px -8px rgba(109,40,217,.18), 0 0 0 2px ${accent}33`
          : "0 1px 4px rgba(109,40,217,.08), 0 0 0 1px #ede9fe",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Glow effect */}
      <div
        className="card-glow"
        style={{
          ...s.cardGlow,
          background: `radial-gradient(circle at 50% 0, ${accent}18, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Top accent bar */}
      <div style={{ ...s.accentBar, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />

      {/* Wishlist + compare */}
      <div style={s.cardActions}>
        <button
          className="wishlist-btn"
          onClick={onWishlist}
          style={{
            ...s.wishlistBtn,
            color: isWishlisted ? "#e11d48" : "#c4b5fd",
            background: isWishlisted ? "#fff0f3" : "rgba(255,255,255,.9)",
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
        <button
          className="compare-btn"
          onClick={onCompare}
          style={{
            ...s.compareBtn,
            opacity: isComparing ? 1 : 0.55,
            background: isComparing ? `${accent}22` : "rgba(255,255,255,.9)",
            color: isComparing ? accent : "#a78bfa",
            border: `1px solid ${isComparing ? accent : "#e4d4fe"}`,
          }}
          title="Add to compare"
        >
          ⇄
        </button>
      </div>

      {/* Number + level */}
      <div style={s.cardTop}>
        <span style={{ ...s.cardNum, color: accent, opacity: hovered ? 0.4 : 0.1 }}>{num}</span>
        <div style={{ ...s.levelBadge, background: level.bg, border: `1px solid ${level.dot}44` }}>
          <span style={{ ...s.levelDot, background: level.dot }} />
          <span style={{ ...s.levelText, color: level.text }}>{level.label}</span>
        </div>
      </div>

      {/* Title */}
      <h2 style={s.cardTitle}>{program.title}</h2>

      {/* Subtitle */}
      {program.subtitle && (
        <p style={s.cardSubtitle}>{program.subtitle}</p>
      )}

      <div style={s.divider} />

      {/* Meta */}
      <div style={s.metaRow}>
        {program.duration && (
          <span style={s.metaItem}>◷ {program.duration}</span>
        )}
        <span style={s.metaItem}>◈ {level.abbr}</span>
      </div>

      {/* Tools */}
      {program.tools?.length > 0 && (
        <div style={s.tools}>
          {program.tools.slice(0, 5).map(tool => (
            <span key={tool} style={s.toolChip}>{tool}</span>
          ))}
          {program.tools.length > 5 && (
            <span style={{ ...s.toolChip, color: "#a78bfa", background: "#f3f0ff", borderColor: "#e4d4fe" }}>
              +{program.tools.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Highlights */}
      {program.highlights?.length > 0 && (
        <ul style={s.highlights}>
          {program.highlights.slice(0, 3).map(h => (
            <li key={h} style={s.highlightItem}>
              <span style={{ ...s.tick, color: accent }}>✓</span> {h}
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div style={s.cardFooter}>
        <div>
          {program.price === 0 ? (
            <span style={s.freeTag}>FREE</span>
          ) : (
            <>
              <div style={s.enrollLabel}>ENROLL FOR</div>
              <div style={{ ...s.priceText, color: "#4c1d95" }}>
                ₹{program.price?.toLocaleString("en-IN")}
              </div>
            </>
          )}
        </div>

        <button
          className="explore-btn"
          onClick={onClick}
          style={s.exploreBtn}
        >
          Explore
          <span style={{
            display: "inline-block",
            transition: "transform 0.2s ease",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
          }}>→</span>
        </button>
      </div>

      {/* Bottom hover line */}
      <div style={{
        ...s.bottomLine,
        background: `linear-gradient(90deg, ${accent}, ${accent}55)`,
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
      }} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#faf8ff",
    fontFamily: "'DM Sans', sans-serif",
  },

  /* Toast */
  toast: {
    position: "fixed",
    bottom: 28,
    right: 28,
    zIndex: 9999,
    background: "#4c1d95",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    boxShadow: "0 8px 24px rgba(76,29,149,.3)",
    animation: "toastIn 0.28s ease",
    pointerEvents: "none",
  },

  /* Hero */
  hero: {
    background: "#1e0a3c",
    position: "relative",
    overflow: "hidden",
  },
  heroBg1: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #2e1065 0%, #1e0a3c 50%, #0f0520 100%)",
    pointerEvents: "none",
  },
  heroBg2: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% -10%, #7c3aed33 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroOrb1: {
    position: "absolute",
    top: "10%",
    right: "8%",
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "radial-gradient(circle, #7c3aed22 0%, transparent 70%)",
    animation: "float 7s ease-in-out infinite",
    pointerEvents: "none",
  },
  heroOrb2: {
    position: "absolute",
    bottom: "5%",
    left: "3%",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "radial-gradient(circle, #a855f722 0%, transparent 70%)",
    animation: "float 9s ease-in-out infinite 2s",
    pointerEvents: "none",
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(167,139,250,.06) 1px,transparent 1px)," +
      "linear-gradient(90deg,rgba(167,139,250,.06) 1px,transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },

  /* Ticker */
  ticker: {
    background: "rgba(109,40,217,.25)",
    borderBottom: "1px solid rgba(167,139,250,.15)",
    height: 32,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  tickerTrack: {
    display: "flex",
    animation: "marquee 28s linear infinite",
    whiteSpace: "nowrap",
  },
  tickerItem: {
    padding: "0 28px",
    fontSize: 10,
    color: "#c4b5fd",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 500,
  },
  tickerDiamond: {
    fontSize: 6,
    color: "#7c3aed",
  },

  /* Nav */
  heroNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 36px",
    position: "relative",
    zIndex: 1,
    flexWrap: "wrap",
    gap: 12,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(167,139,250,.25)",
    color: "#a78bfa",
    padding: "7px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  navCenter: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  brandMark: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#c4b5fd",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  brandIcon: {
    color: "#a855f7",
    fontSize: 16,
  },
  trustBadges: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  trustBadge: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#a78bfa",
    border: "1px solid rgba(167,139,250,.2)",
    borderRadius: 4,
    padding: "3px 8px",
    background: "rgba(109,40,217,.15)",
  },

  /* Hero copy */
  heroCopy: {
    padding: "20px 36px 24px",
    maxWidth: 700,
    position: "relative",
    zIndex: 1,
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#a78bfa",
    marginBottom: 18,
    fontWeight: 600,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#a855f7",
    display: "inline-block",
    animation: "pulse 2s ease-in-out infinite",
    boxShadow: "0 0 10px #a855f7",
  },
  heroTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(38px, 5.5vw, 64px)",
    fontWeight: 400,
    color: "#f5f3ff",
    margin: "0 0 16px",
    lineHeight: 1.08,
    letterSpacing: "-0.01em",
  },
  heroItalic: {
    fontStyle: "italic",
    color: "#c4b5fd",
  },
  heroSub: {
    fontSize: 14,
    color: "#8b7cb6",
    margin: "0 0 24px",
    fontWeight: 300,
    lineHeight: 1.6,
    maxWidth: 480,
  },
  heroCTAs: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  ctaPrimary: {
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "#fff",
    border: "none",
    padding: "11px 24px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.02em",
    boxShadow: "0 8px 24px rgba(109,40,217,.35)",
    transition: "all 0.2s",
  },
  ctaSecondary: {
    background: "transparent",
    color: "#c4b5fd",
    border: "1px solid rgba(167,139,250,.3)",
    padding: "11px 24px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  },

  /* Stats */
  statsBar: {
    display: "flex",
    gap: 0,
    padding: "20px 36px",
    borderTop: "1px solid rgba(167,139,250,.1)",
    position: "relative",
    zIndex: 1,
    flexWrap: "wrap",
  },
  statItem: {
    flex: "1 1 120px",
    padding: "8px 24px 8px 0",
    borderRight: "1px solid rgba(167,139,250,.12)",
    marginRight: 24,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e9d5ff",
    fontFamily: "'DM Serif Display', serif",
    letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: 10,
    color: "#7c5cb8",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginTop: 2,
  },

  /* Search */
  searchOuter: {
    padding: "4px 36px",
    position: "relative",
    zIndex: 1,
  },
  searchWrap: {
    position: "relative",
    maxWidth: 520,
  },
  searchIcon: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: "translateY(-50%)",
    width: 16,
    height: 16,
  },
  searchInput: {
    width: "100%",
    height: 50,
    padding: "0 44px 0 46px",
    border: "none",
    borderRadius: 12,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: "#1e0a3c",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    boxShadow: "0 4px 20px rgba(109,40,217,.2), 0 0 0 1.5px rgba(167,139,250,.3)",
  },
  searchClear: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#a78bfa",
    cursor: "pointer",
    fontSize: 13,
    padding: "0 4px",
    fontFamily: "'DM Sans', sans-serif",
  },

  /* Controls bar */
  controlsBar: {
    background: "#fff",
    borderBottom: "2px solid #ede9fe",
    padding: "10px 36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  filterPills: { display: "flex", gap: 7, flexWrap: "wrap" },
  pill: {
    padding: "5px 14px",
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em",
    background: "transparent",
    color: "#7c3aed",
    border: "1.5px solid #ede9fe",
    transition: "all 0.18s",
  },
  pillActive: {
    background: "#7c3aed",
    color: "#fff",
    border: "1.5px solid #7c3aed",
    boxShadow: "0 4px 12px rgba(124,58,237,.3)",
  },
  rightControls: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  countLabel: {
    fontSize: 11,
    color: "#a78bfa",
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
  sortSelect: {
    fontSize: 11,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: "#6d28d9",
    background: "#f5f0ff",
    border: "1.5px solid #ede9fe",
    borderRadius: 8,
    padding: "5px 10px",
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.18s",
  },
  viewToggle: {
    display: "flex",
    gap: 2,
    background: "#f5f0ff",
    border: "1.5px solid #ede9fe",
    borderRadius: 8,
    overflow: "hidden",
  },
  viewBtn: {
    background: "none",
    border: "none",
    padding: "5px 10px",
    fontSize: 15,
    cursor: "pointer",
    color: "#c4b5fd",
    fontFamily: "'DM Sans', sans-serif",
    transition: "color 0.15s",
  },
  viewBtnActive: {
    color: "#7c3aed",
    background: "#ede9fe",
  },

  /* Compare tray */
  compareTray: {
    background: "linear-gradient(90deg, #2e1065, #4c1d95)",
    padding: "10px 36px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    borderBottom: "1px solid #7c3aed44",
  },
  compareTrayLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#c4b5fd",
    letterSpacing: "0.05em",
  },
  compareTrayItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(167,139,250,.2)",
    border: "1px solid rgba(167,139,250,.3)",
    borderRadius: 6,
    padding: "3px 8px 3px 10px",
    fontSize: 11,
    color: "#e9d5ff",
    fontWeight: 500,
  },
  compareTrayRemove: {
    background: "none",
    border: "none",
    color: "#a78bfa",
    cursor: "pointer",
    fontSize: 11,
    padding: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  compareTrayBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "5px 14px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em",
  },
  compareTryClear: {
    background: "transparent",
    color: "#a78bfa",
    border: "1px solid rgba(167,139,250,.3)",
    borderRadius: 7,
    padding: "5px 12px",
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },

  /* Main */
  main: {
    padding: "36px 36px 72px",
    maxWidth: 1260,
    margin: "0 auto",
  },

  /* Skeletons */
  skeletonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: 20,
    marginBottom: 36,
  },
  skeleton: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    border: "1.5px solid #ede9fe",
    animation: "pulse 1.6s ease-in-out infinite",
  },
  skeletonBar: {
    height: 3,
    background: "linear-gradient(90deg, #ede9fe, #c4b5fd, #ede9fe)",
    borderRadius: 2,
    backgroundSize: "400px 100%",
    animation: "shimmer 1.4s linear infinite",
  },
  skeletonLine: {
    height: 12,
    background: "#f3f0ff",
    borderRadius: 6,
  },

  errorBox: {
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    color: "#991b1b",
    padding: "24px 28px",
    borderRadius: 12,
    fontSize: 14,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    padding: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(295px, 1fr))",
    gap: 22,
  },
  listView: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  /* List card */
  listCard: {
    background: "#fff",
    borderRadius: 12,
    border: "1.5px solid #ede9fe",
    display: "flex",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  listAccent: { width: 4, flexShrink: 0 },
  listBody: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "14px 18px",
    flexWrap: "wrap",
  },
  listLeft: { flex: "1 1 260px" },
  listRight: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: "0 0 200px",
  },
  listActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: "0 0 auto",
  },

  /* Grid card */
  card: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    animation: "fadeUp 0.4s ease both",
  },
  cardGlow: {
    position: "absolute",
    inset: 0,
    transition: "opacity 0.35s ease",
    pointerEvents: "none",
    zIndex: 0,
  },
  accentBar: { height: 3, flexShrink: 0, position: "relative", zIndex: 1 },

  /* Wishlist / compare */
  cardActions: {
    position: "absolute",
    top: 14,
    right: 14,
    display: "flex",
    gap: 5,
    zIndex: 2,
  },
  wishlistBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s, color 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  compareBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px 0",
    position: "relative",
    zIndex: 1,
  },
  cardNum: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 30,
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    transition: "opacity 0.25s",
  },
  levelBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 100,
    padding: "4px 10px",
  },
  levelDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
  },
  levelText: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
  },
  cardTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 19,
    fontWeight: 400,
    color: "#1e0a3c",
    margin: "10px 18px 6px",
    lineHeight: 1.28,
    letterSpacing: "-0.01em",
    position: "relative",
    zIndex: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6b5b8a",
    margin: "0 18px 14px",
    lineHeight: 1.55,
    fontWeight: 300,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },
  divider: {
    height: 1,
    background: "#f0e8ff",
    margin: "0 18px 12px",
    position: "relative",
    zIndex: 1,
  },
  metaRow: {
    display: "flex",
    gap: 10,
    padding: "0 18px 12px",
    position: "relative",
    zIndex: 1,
  },
  metaItem: {
    fontSize: 10,
    color: "#7c5cb8",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  tools: {
    display: "flex",
    flexWrap: "wrap",
    gap: 5,
    padding: "0 18px 12px",
    position: "relative",
    zIndex: 1,
  },
  toolChip: {
    fontSize: 10,
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: 5,
    background: "#f5f0ff",
    color: "#5b21b6",
    border: "1px solid #ede9fe",
  },
  highlights: {
    margin: 0,
    padding: "0 18px 12px",
    listStyle: "none",
    position: "relative",
    zIndex: 1,
  },
  highlightItem: {
    fontSize: 11,
    color: "#4c3575",
    marginBottom: 4,
    display: "flex",
    gap: 6,
    alignItems: "flex-start",
    lineHeight: 1.5,
  },
  tick: {
    fontWeight: 800,
    flexShrink: 0,
    marginTop: 1,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    borderTop: "1px solid #f0e8ff",
    marginTop: "auto",
    background: "#fdfbff",
    position: "relative",
    zIndex: 1,
  },
  enrollLabel: {
    fontSize: 8,
    letterSpacing: "0.12em",
    color: "#a78bfa",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#4c1d95",
    fontFamily: "'DM Serif Display', serif",
  },
  freeTag: {
    fontSize: 12,
    fontWeight: 800,
    color: "#059669",
    letterSpacing: "0.08em",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "3px 8px",
    borderRadius: 6,
  },
  exploreBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    userSelect: "none",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    boxShadow: "0 4px 12px rgba(109,40,217,.25)",
  },
  bottomLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    transformOrigin: "left",
    transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
  },

  /* Why section */
  whySection: {
    marginTop: 72,
    padding: "56px 0 16px",
    borderTop: "1px solid #ede9fe",
  },
  whyHeader: {
    textAlign: "center",
    marginBottom: 40,
  },
  whyEyebrow: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#a78bfa",
    marginBottom: 10,
  },
  whyTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(26px, 4vw, 38px)",
    fontWeight: 400,
    color: "#2e1065",
    margin: 0,
  },
  whyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  },
  whyCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    transition: "all 0.3s ease",
    border: "1px solid #eee",
    cursor: "pointer",
  },
  
  whyCardHover: {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 20px 50px rgba(124,58,237,0.25)",
    border: "1px solid #c4b5fd",
  },
  whyIcon: {
    fontSize: 28,
    marginBottom: 10,
    transition: "transform 0.3s ease",
  },
  whyCardTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 16,
    color: "#2e1065",
    marginBottom: 6,
  },
  whyCardDesc: {
    fontSize: 12,
    color: "#6b5b8a",
    lineHeight: 1.6,
    fontWeight: 300,
  },

  /* Compare modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(30,10,60,.65)",
    backdropFilter: "blur(4px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 18,
    maxWidth: 800,
    width: "100%",
    maxHeight: "85vh",
    overflow: "auto",
    boxShadow: "0 32px 80px rgba(76,29,149,.25)",
    animation: "slideDown 0.28s ease",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px 16px",
    borderBottom: "1px solid #ede9fe",
  },
  modalTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 20,
    color: "#2e1065",
    margin: 0,
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: 18,
    color: "#a78bfa",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: "0 4px",
  },
  compareTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  compareTh: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    color: "#4c1d95",
    background: "#faf5ff",
    borderBottom: "1px solid #ede9fe",
    letterSpacing: "0.04em",
  },
  compareTd: {
    padding: "10px 16px",
    fontSize: 12,
    color: "#3b1f6a",
    borderBottom: "1px solid #f5f0ff",
    verticalAlign: "top",
  },
  modalFooter: {
    display: "flex",
    gap: 12,
    padding: "16px 24px",
    flexWrap: "wrap",
    borderTop: "1px solid #ede9fe",
  },
  modalEnrollBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
};
