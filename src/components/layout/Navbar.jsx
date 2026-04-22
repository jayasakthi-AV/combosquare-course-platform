/**
 * Navbar.jsx — Premium ComboSquare Navbar
 * ─────────────────────────────────────────
 * • Transparent → frosted-glass on scroll
 * • Animated shadow on scroll
 * • Refined dropdown panels with icons & descriptions
 * • Smooth mobile drawer with slide animation
 * • All existing logic (auth, routing) preserved
 */

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Menu, X, LayoutDashboard, LogOut,
  Code2, Brain, Database, Palette,
  Cpu, BookOpen, Wrench, Briefcase,
  Calendar, Tv, GraduationCap, Hammer,
  Phone,
} from "lucide-react";
import { isLoggedIn, getUser } from "../../services/api";
import logo from "../../assets/logo.png";

/* ── nav data ── */
const domainsMenu = [
  { label: "Technology & IT",          to: "/domains/technology",  icon: Cpu,       desc: "Cloud, networking & modern IT"     },
  { label: "Programming Fundamentals", to: "/domains/programming", icon: Code2,     desc: "Core coding skills from scratch"   },
  { label: "Engineering & Automation", to: "/domains/engineering", icon: Wrench,    desc: "Robotics, IoT & embedded systems"  },
  { label: "Business & Creativity",    to: "/domains/business",    icon: Briefcase, desc: "Strategy, design & marketing"      },
];

const programsMenu = [
  { label: "Full Stack Developer",  to: "/program/full-stack",      icon: Code2,    tag: "Most Popular" },
  { label: "AI Foundations",        to: "/program/ai-foundations",  icon: Brain,    tag: "Trending"     },
  { label: "Data Science Starter",  to: "/program/data-science",    icon: Database, tag: "High Demand"  },
  { label: "UI/UX Design",          to: "/program/ui-ux",           icon: Palette,  tag: "Creative"     },
];

const careersMenu = [
  { label: "Jobs",         to: "/careers/jobs",       icon: Briefcase  },
  { label: "Internships",  to: "/careers/internships",icon: BookOpen   },
  { label: "Webinars",     to: "/careers/webinars",   icon: Tv         },
  { label: "Training",     to: "/careers/training",   icon: GraduationCap },
  { label: "Workshops",    to: "/careers/workshops",  icon: Hammer     },
];

/* ── tiny helpers ── */
const dropAnim = {
  hidden:  { opacity: 0, y: 10, scale: 0.97 },
  show:    { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.2, ease: "easeOut" } },
  exit:    { opacity: 0, y: 6,  scale: 0.97, transition: { duration: 0.15 } },
};

const tagColor = {
  "Most Popular": "bg-purple-100 text-purple-700",
  "Trending":     "bg-blue-100 text-blue-700",
  "High Demand":  "bg-green-100 text-green-700",
  "Creative":     "bg-pink-100 text-pink-700",
};

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeMenu,   setActiveMenu]   = useState("");   // "domains" | "programs" | "careers" | ""
  const [mobileExpand, setMobileExpand] = useState("");   // same keys
  const [loggedIn,     setLoggedIn]     = useState(false);
  const [user,         setUser]         = useState(null);

  const navigate  = useNavigate();
  const location  = useLocation();
  const timerRef  = useRef(null);

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* auth */
  useEffect(() => {
    const ok = isLoggedIn();
    setLoggedIn(ok);
    setUser(ok ? getUser() : null);
    setMobileOpen(false);
    setActiveMenu("");
  }, [location.pathname]);

  const openMenu  = (key) => { clearTimeout(timerRef.current); setActiveMenu(key); };
  const closeMenu = ()    => { timerRef.current = setTimeout(() => setActiveMenu(""), 120); };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const handleDashboard = () => navigate(user?.role === "admin" ? "/admin" : "/dashboard");

  /* ────────────────────────────────── */
  return (
    <>
      <nav
        className="w-full fixed top-0 left-0 z-[9999] transition-all duration-300"
        style={{
          background: "#4C1D95",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderBottom: "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="ComboSquare" className="h-9 w-auto" />
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            <NavLink to="/" label="Home" scrolled={scrolled} />

            {/* Domains */}
            <DropdownTrigger
              label="Domains" menuKey="domains"
              activeMenu={activeMenu} scrolled={scrolled}
              onEnter={openMenu} onLeave={closeMenu}
            >
              <DropPanel onEnter={() => openMenu("domains")} onLeave={closeMenu}>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {domainsMenu.map((item) => (
                    <DropItem key={item.to} to={item.to} icon={item.icon} label={item.label} desc={item.desc} />
                  ))}
                </div>
              </DropPanel>
            </DropdownTrigger>

            {/* Programs */}
            <DropdownTrigger
              label="Programs" menuKey="programs" linkTo="/programs"
              activeMenu={activeMenu} scrolled={scrolled}
              onEnter={openMenu} onLeave={closeMenu}
            >
              <DropPanel onEnter={() => openMenu("programs")} onLeave={closeMenu}>
                <div className="p-2 w-64">
                  {programsMenu.map((item) => (
                    <ProgramItem key={item.to} to={item.to} icon={item.icon} label={item.label} tag={item.tag} />
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-100 px-2">
                    <Link to="/programs"
                      className="flex items-center justify-between text-xs text-purple-700 font-semibold hover:text-purple-900 py-1.5 transition-colors"
                    >
                      View all programs →
                    </Link>
                  </div>
                </div>
              </DropPanel>
            </DropdownTrigger>

            {/* Careers */}
            <DropdownTrigger
              label="Careers" menuKey="careers"
              activeMenu={activeMenu} scrolled={scrolled}
              onEnter={openMenu} onLeave={closeMenu}
            >
              <DropPanel onEnter={() => openMenu("careers")} onLeave={closeMenu}>
                <div className="p-2 w-52">
                  {careersMenu.map((item) => (
                    <DropItem key={item.to} to={item.to} icon={item.icon} label={item.label} simple />
                  ))}
                </div>
              </DropPanel>
            </DropdownTrigger>

            {/* Contact */}
            <NavLink to="/contact" label="Contact" scrolled={scrolled} />
          </div>

          {/* ── DESKTOP AUTH ── */}
          <div className="hidden md:flex items-center gap-3">
            {loggedIn ? (
              <>
                <span className={`text-sm font-medium  text-white`}>
                  Hi, {user?.full_name?.split(" ")[0]}! 👋
                </span>
                <button onClick={handleDashboard}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-all shadow-md shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-px"
                >
                  <LayoutDashboard size={14} />
                  {user?.role === "admin" ? "Admin" : "Dashboard"}
                </button>
                <button onClick={handleLogout}
  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white transition-all border border-white hover:bg-white/10 hover:text-red-300"
>
  <LogOut className="text-white" size={16} />
  Logout
</button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    scrolled
                      ? "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                      : "text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  Login
                </Link>
                <Link to="/signup"
                  className="px-5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-all shadow-md shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-px"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            className={`md:hidden p-2 rounded-xl transition-colors ${scrolled ? "text-gray-700 hover:bg-gray-100" : "text-purple-700 hover:bg-purple-50"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-[9990] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* drawer */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 h-full w-[300px] bg-white z-[9998] md:hidden overflow-y-auto shadow-2xl"
            >
              {/* drawer header */}
              <div className="flex items-center justify-between px-5 h-[68px] border-b border-gray-100">
                <img src={logo} alt="ComboSquare" className="h-8 w-auto" />
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-1">
                <MobileLink to="/" label="Home" close={() => setMobileOpen(false)} />

                <MobileAccordion label="Domains" isOpen={mobileExpand === "domains"} onToggle={() => setMobileExpand(mobileExpand === "domains" ? "" : "domains")}>
                  {domainsMenu.map(i => <MobileLink key={i.to} to={i.to} label={i.label} close={() => setMobileOpen(false)} sub />)}
                </MobileAccordion>

                <MobileAccordion label="Programs" isOpen={mobileExpand === "programs"} onToggle={() => setMobileExpand(mobileExpand === "programs" ? "" : "programs")}>
                  {programsMenu.map(i => <MobileLink key={i.to} to={i.to} label={i.label} close={() => setMobileOpen(false)} sub />)}
                  <MobileLink to="/programs" label="View All Programs →" close={() => setMobileOpen(false)} sub accent />
                </MobileAccordion>

                <MobileAccordion label="Careers" isOpen={mobileExpand === "careers"} onToggle={() => setMobileExpand(mobileExpand === "careers" ? "" : "careers")}>
                  {careersMenu.map(i => <MobileLink key={i.to} to={i.to} label={i.label} close={() => setMobileOpen(false)} sub />)}
                </MobileAccordion>

                <MobileLink to="/contact" label="Contact" close={() => setMobileOpen(false)} />

                <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
                  {loggedIn ? (
                    <>
                      <button onClick={() => { handleDashboard(); setMobileOpen(false); }}
                        className="w-full py-3 rounded-xl bg-purple-700 text-white font-semibold text-sm text-center transition-all hover:bg-purple-800"
                      >
                        {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                      </button>
                      <button 
  onClick={() => { handleLogout(); setMobileOpen(false); }}
  className="w-full py-3 rounded-xl border border-white text-white font-medium text-sm text-center transition-all hover:bg-white/10 hover:text-red-300 opacity-100"
>
  <span className="text-white">Logout</span>
</button>
                    </>
                  ) : (
                    <>
                      <Link to="/signup" onClick={() => setMobileOpen(false)}
                        className="block w-full py-3 rounded-xl bg-purple-700 text-white font-semibold text-sm text-center transition-all hover:bg-purple-800"
                      >
                        Get Started
                      </Link>
                      <Link to="/login" onClick={() => setMobileOpen(false)}
                        className="block w-full py-3 rounded-xl border border-gray-200 text-purple-700 font-medium text-sm text-center transition-all hover:bg-gray-50"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-2 text-purple-700 text-sm font-medium">
                  <Phone size={14} />
                  <a href="tel:+919000000000">+91 80728 77622</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────── sub-components ─────────────────── */

function NavLink({ to, label, scrolled }) {
  return (
    <Link to={to}
     className="px-4 py-2 rounded-full text-sm font-semibold transition-all text-white hover:text-purple-200"
    >
      {label}
    </Link>
  );
}

function DropdownTrigger({ label, menuKey, linkTo, activeMenu, scrolled, onEnter, onLeave, children }) {
  const isOpen = activeMenu === menuKey;
  const inner = (
    <span className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-white hover:text-purple-200 transition-all`}>
      {label}
      <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-600" : "text-gray-400"}`} />
    </span>
  );

  return (
    <div className="relative" onMouseEnter={() => onEnter(menuKey)} onMouseLeave={onLeave}>
      {linkTo ? <Link to={linkTo}>{inner}</Link> : <div>{inner}</div>}
      <AnimatePresence>
        {isOpen && children}
      </AnimatePresence>
    </div>
  );
}

function DropPanel({ children, onEnter, onLeave }) {
  return (
    <motion.div
      variants={dropAnim} initial="hidden" animate="show" exit="exit"
      onMouseEnter={onEnter} onMouseLeave={onLeave}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 z-50 overflow-hidden min-w-max"
    >
      {children}
    </motion.div>
  );
}

function DropItem({ to, icon: Icon, label, desc, simple }) {
  return (
    <Link to={to}
      className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 group transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors mt-0.5">
        <Icon size={15} className="text-purple-700" />
      </div>
      <div>
        <p className="text-gray-900 text-sm font-semibold leading-tight group-hover:text-purple-700 transition-colors">{label}</p>
        {!simple && desc && <p className="text-gray-400 text-xs mt-0.5 leading-snug">{desc}</p>}
      </div>
    </Link>
  );
}

function ProgramItem({ to, icon: Icon, label, tag }) {
  return (
    <Link to={to}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-50 group transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
          <Icon size={15} className="text-purple-700" />
        </div>
        <p className="text-gray-900 text-sm font-semibold group-hover:text-purple-700 transition-colors">{label}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${tagColor[tag] || "bg-gray-100 text-gray-600"}`}>
        {tag}
      </span>
    </Link>
  );
}

function MobileLink({ to, label, close, sub, accent }) {
  return (
    <Link to={to} onClick={close}
      className={`block px-3 py-2.5 rounded-xl text-sm transition-colors ${
        sub
          ? accent
            ? "text-purple-700 font-semibold hover:bg-purple-50"
            : "text-gray-600 hover:text-purple-700 hover:bg-purple-50 pl-5"
          : "text-gray-800 font-semibold hover:text-purple-700 hover:bg-purple-50"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileAccordion({ label, isOpen, onToggle, children }) {
  return (
    <div>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:text-purple-700 hover:bg-purple-50 transition-colors"
      >
        {label}
        <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-600" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden pl-2"
          >
            <div className="py-1 space-y-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
