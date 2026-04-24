import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import user1 from "../../assets/user1.png";
import user2 from "../../assets/user2.png";
import user3 from "../../assets/user3.png";

import learner1 from "../../assets/learner1.webp";
import learner2 from "../../assets/learner2.webp";
import learner3 from "../../assets/learner3.webp";

import zoho from "../../assets/zoho.png";
import amazon from "../../assets/amazon.png";
import tcs from "../../assets/tcs.png";
import infosys from "../../assets/infosys.png";

/* ─── Elite Smooth Counter Hook ─── */
function useCountUp(end, duration = 2800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let startTime;
    let animationFrame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Premium easeOutExpo curve for buttery deceleration
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(Math.floor(easeOutExpo * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return val;
}

export default function Hero() {
  const navigate = useNavigate();
  const counter = useCountUp(48006); 
  const bentoRef = useRef(null);

  /* ─── Magnetic Mouse Parallax Effect for Bento Grid ─── */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bentoRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15; // 15px max movement
      const y = (e.clientY / innerHeight - 0.5) * 15;
      
      bentoRef.current.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* ─── MASSIVE ANIMATION & STYLES ENGINE ─── */}
      <style>
        {`
          /* Complex Entrance Animations */
          @keyframes revealUpSoft {
            0% { opacity: 0; transform: translateY(50px) scale(0.97); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes slideInRight {
            0% { opacity: 0; transform: translateX(40px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          /* Ambient Effects */
          @keyframes glowBreath {
            0%, 100% { opacity: 0.3; transform: scale(1) translate(0, 0); }
            50% { opacity: 0.6; transform: scale(1.05) translate(-10px, 10px); }
          }
          @keyframes buttonShimmer {
            0% { transform: translateX(-150%) skewX(-25deg); }
            100% { transform: translateX(250%) skewX(-25deg); }
          }
          @keyframes marqueePan {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* Utilities */
          .anim-reveal {
            animation: revealUpSoft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marqueePan 40s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }

          /* Staggered Delays */
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-600 { animation-delay: 0.6s; }

          /* Elite Grid Pattern */
          .elite-grid {
            background-image: 
              linear-gradient(to right, rgba(71, 16, 136, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 16, 136, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
          }

          /* Smooth 3D transition for the bento box container */
          .bento-container {
            transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform;
          }
        `}
      </style>

      {/* ─── HERO MAIN WRAPPER ─── */}
      <section className="relative w-full pt-28 pb-20 lg:pt-36 lg:pb-24 bg-[#fcfcfd] overflow-hidden font-sans flex flex-col justify-center min-h-[92vh]">
        
        {/* PREMIUM ARCHITECTURAL BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 elite-grid"></div>
          
          {/* High-end ambient volumetric lighting using brand color #471088 */}
          <div className="absolute top-[-20%] right-[10%] w-[50vw] h-[50vw] bg-[#471088]/[0.05] rounded-full blur-[130px]" style={{ animation: 'glowBreath 12s infinite alternate' }}></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#471088]/[0.04] rounded-full blur-[150px]" style={{ animation: 'glowBreath 15s infinite alternate-reverse' }}></div>
        </div>

        {/* ─── MAIN CONTENT CONTAINER ─── */}
        {/* Massive width max-w-[1500px] ensures it breathes beautifully on wide screens */}
        <div className="relative z-10 max-w-[1500px] w-full mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">

          {/* ─── LEFT COLUMN: SALES COPY & CTA ─── */}
          <div className="col-span-1 lg:col-span-6 flex flex-col justify-center text-center lg:text-left z-20">
            
            {/* Top Pill Badge */}
            <div className="anim-reveal delay-100 mb-8 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white border border-[#471088]/15 rounded-full shadow-[0_4px_15px_rgba(71,16,136,0.05)] hover:shadow-[0_6px_20px_rgba(71,16,136,0.08)] transition-all cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#471088] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#471088]"></span>
                </span>
                <span className="text-[#471088] text-[13px] font-extrabold uppercase tracking-[0.2em]">
                  India's #1 Learning Platform
                </span>
              </div>
            </div>

            {/* Main Headline (Underline removed completely) */}
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-gray-900 leading-[1.08] anim-reveal delay-200 mb-6 drop-shadow-sm">
              Become a <br className="hidden lg:block"/>
              <span className="text-[#471088]">Software Developer</span>
              <br className="hidden lg:block"/> in 2026
            </h1>

            {/* Sub-headlines */}
            <p className="text-lg sm:text-xl text-gray-700 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed anim-reveal delay-300 mb-5">
              From absolute beginner to job-ready developer in just <strong className="text-gray-900 font-extrabold border-b-2 border-[#471088]/30 pb-0.5">6 months</strong>.
            </p>
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed anim-reveal delay-300 mb-10">
              Learn industry-level development with hands-on projects, mentors, and job support.
            </p>

            {/* Feature Ticks (Premium Pill Style) */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5 mb-12 anim-reveal delay-400">
              {[
                "100% Job Support Included", 
                "Beginner Friendly", 
                "Live Doubt Clearing"
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-white border border-gray-200/80 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md hover:border-[#471088]/40 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-5 h-5 rounded-full bg-[#471088]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#471088]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-700 tracking-wide">{badge}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 anim-reveal delay-500 mb-14">
              {/* Primary Button */}
              <button
                onClick={() => navigate("/programs")}
                className="group relative overflow-hidden px-9 py-4 bg-[#471088] text-white rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(71,16,136,0.3)] hover:shadow-[0_15px_40px_rgba(71,16,136,0.45)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent [animation:buttonShimmer_2.5s_infinite]"></div>
                <span className="relative flex items-center justify-center gap-3">
                  Start Learning Now
                  <svg className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
              </button>

              {/* Secondary Button */}
              <button
                onClick={() => navigate("/contact")}
                className="group px-9 py-4 bg-transparent border-2 border-gray-200 text-gray-800 rounded-full font-bold text-lg hover:border-[#471088] hover:text-[#471088] hover:bg-[#471088]/5 hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                Talk to a Career Expert
              </button>
            </div>

            {/* Social Proof (Counters + Avatars) */}
            <div className="flex justify-center lg:justify-start items-center gap-5 anim-reveal delay-600">
              <div className="flex -space-x-3">
                <img src={learner1} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover relative z-30" alt="Alumni" />
                <img src={learner2} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover relative z-20" alt="Alumni" />
                <img src={learner3} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover relative z-10" alt="Alumni" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#471088] text-[22px] tracking-tight">
                    {counter.toLocaleString()}
                  </span>
                </div>
                <span className="text-gray-500 text-sm font-bold tracking-wider">Learners Enrolled</span>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: MASSIVE BENTO GRID SHOWCASE ─── */}
          <div className="col-span-1 lg:col-span-6 w-full h-[550px] lg:h-[650px] anim-reveal delay-400 mt-6 lg:mt-0">
            {/* Magnetic Parallax Container */}
            <div ref={bentoRef} className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 lg:gap-6 bento-container">
              
              {/* Box 1 (Left, Tall) - Step 01 */}
              <div className="col-span-1 row-span-2 relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-200/50 group bg-gray-100">
                <img src={user1} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" alt="Learn From Experts" />
                {/* Clean dark gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/95 via-[#111]/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-[#471088] text-white text-[11px] font-black uppercase tracking-widest rounded mb-3 shadow-lg shadow-[#471088]/30">Step 01</span>
                  <h3 className="text-white text-2xl sm:text-3xl font-extrabold mb-2 leading-tight drop-shadow-md">Learn From <br/> Experts</h3>
                  <p className="text-gray-300 text-sm font-medium line-clamp-2">Master development with structured guidance.</p>
                </div>
              </div>

              {/* Box 2 (Top Right) - Step 02 */}
              <div className="col-span-1 row-span-1 relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-200/50 group bg-gray-100">
                <img src={user2} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" alt="Hands-on Projects" />
                {/* Unified clean dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/95 via-[#111]/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-[#471088] text-white text-[11px] font-black uppercase tracking-widest rounded mb-3 shadow-lg shadow-[#471088]/30">Step 02</span>
                  <h3 className="text-white text-xl font-extrabold mb-1 drop-shadow-md">Hands-on Projects</h3>
                  <p className="text-gray-300 text-xs font-medium line-clamp-2">Build real-world projects for your portfolio.</p>
                </div>
              </div>

              {/* Box 3 (Bottom Right) - Step 03 */}
              <div className="col-span-1 row-span-1 relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-200/50 group bg-gray-100">
                <img src={user3} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" alt="Job Assistance" />
                {/* Unified clean dark gradient (Removed the heavy purple tint) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/95 via-[#111]/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-[#471088] text-white text-[11px] font-black uppercase tracking-widest rounded mb-3 shadow-lg shadow-[#471088]/30">Step 03</span>
                  <h3 className="text-white text-xl font-extrabold mb-1 drop-shadow-md">Job Assistance</h3>
                  <p className="text-gray-300 text-xs font-medium line-clamp-2">Crack interviews with expert mentorship.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── BOTTOM BAR: INFINITE COMPANY LOGOS ─── */}
      <div className="relative w-full bg-white py-12 lg:py-16 border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-20">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-16 xl:px-24 text-center flex flex-col md:flex-row items-center gap-8 md:gap-16">
          
          <div className="flex-shrink-0">
            <p className="text-gray-400 font-extrabold text-xs sm:text-sm tracking-[0.25em] uppercase">
              Where Do Our Learners Work?
            </p>
          </div>

          <div className="flex-1 w-full overflow-hidden relative">
            {/* Seamless Fading Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="overflow-hidden w-full">
              <div className="marquee-track flex items-center gap-16 md:gap-24">
                {/* Looped items for infinite scroll without snapping */}
                {[amazon, zoho, tcs, infosys, amazon, zoho, tcs, infosys, amazon, zoho].map((logo, i) => (
                  <div key={i} className="flex-shrink-0 cursor-pointer group">
                    <img 
                      src={logo} 
                      alt="Partner Logo" 
                      className="h-8 sm:h-10 lg:h-12 w-auto object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-500 filter drop-shadow-sm" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}