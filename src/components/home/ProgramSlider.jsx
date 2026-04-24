import uiux from "../../assets/uiux.png";
import fullstack from "../../assets/fullstack.png";
import dataanalytics from "../../assets/dataanalytics.png";
import aiml from "../../assets/aiml.png";

import React, { useRef } from "react";

export default function ProgramSlider() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
  };

  const programs = [
    {
      title: "Full Stack Developer Program",
      tag: "Top Rated",
      languages: "Tamil, English & Hindi",
      img: fullstack,
    },
    {
      title: "AI Foundations",
      tag: "Beginner Friendly",
      languages: "Tamil, English & Hindi",
      img: aiml,
    },
    {
      title: "Data Science Starter",
      tag: "Certification Included",
      languages: "Tamil, English & Hindi",
      img: dataanalytics,
    },
    {
      title: "UI/UX Design Essentials",
      tag: "Project Based",
      languages: "Tamil, English & Hindi",
      img: uiux,
    },
  ];

  return (
    <>
      {/* ─── MASSIVE PREMIUM ANIMATION ENGINE ─── */}
      <style>
        {`
          @keyframes revealSlider {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes buttonSweep {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }
          .anim-reveal-slider {
            animation: revealSlider 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          
          /* Custom invisible scrollbar for ultra-clean UI */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          /* Ambient Grid */
          .bg-slider-grid {
            background-image: 
              linear-gradient(to right, rgba(71, 16, 136, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 16, 136, 0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            mask-image: radial-gradient(ellipse 90% 50% at 50% 0%, black 50%, transparent 100%);
            -webkit-mask-image: radial-gradient(ellipse 90% 50% at 50% 0%, black 50%, transparent 100%);
          }
        `}
      </style>

      {/* ─── SLIDER SECTION WRAPPER ─── */}
      <section className="relative w-full pt-20 pb-24 lg:pt-28 lg:pb-32 bg-white overflow-hidden font-sans border-t border-gray-100">
        
        {/* PREMIUM AMBIENT BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-slider-grid"></div>
          
          {/* High-end volumetric center lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] max-w-4xl h-[40vw] max-h-[500px] bg-[#471088]/[0.03] rounded-full blur-[120px]"></div>
        </div>

        {/* ─── MAIN CONTENT CONTAINER (Matched Hero Width) ─── */}
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">

          {/* ─── HEADER SECTION ─── */}
          <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20 anim-reveal-slider">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#471088]/5 border border-[#471088]/15 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#471088] animate-pulse"></div>
              <span className="text-[#471088] font-black text-[11px] uppercase tracking-[0.2em]">
                Our Programs
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
              Discover Our Premier, <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf]">
                Top-Rated
              </span>{" "}
              Programs.
            </h2>
          </div>

          {/* ─── SLIDER COMPONENT ─── */}
          <div className="relative group/slider anim-reveal-slider" style={{ animationDelay: "0.2s" }}>
            
            {/* Left Navigation Button (Glassmorphism) */}
            <button
              onClick={scrollLeft}
              className="
                hidden lg:flex absolute -left-8 top-[40%] -translate-y-1/2 z-20
                w-16 h-16 items-center justify-center rounded-full 
                bg-white/70 backdrop-blur-xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                text-gray-400 hover:text-[#471088] hover:bg-white hover:scale-110 hover:shadow-[0_15px_40px_rgba(71,16,136,0.15)]
                opacity-0 group-hover/slider:opacity-100 -translate-x-4 group-hover/slider:translate-x-0
                transition-all duration-500 ease-out
              "
              aria-label="Scroll Left"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            {/* The Horizontal Scrolling Track */}
            <div
              ref={scrollRef}
              className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth no-scrollbar pb-12 pt-4 px-2 -mx-2"
            >
              {programs.map((p, i) => (
                <div
                  key={i}
                  className="
                    group flex-none w-[290px] sm:w-[340px] flex flex-col
                    bg-white rounded-[2rem] border border-gray-200/60
                    shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden cursor-pointer
                    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                    hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(71,16,136,0.15)] hover:border-[#471088]/30
                  "
                >
                  {/* Card Header (Image + Tag) */}
                  <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100">
                    <img
                      src={p.img}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      alt={p.title}
                    />
                    {/* Deep gradient overlay for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111]/70 via-transparent to-transparent opacity-80"></div>
                    
                    {/* Floating Status Tag */}
                    <div className="absolute top-5 left-5">
                      <span className="inline-block px-3.5 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {p.tag}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-7 flex flex-col flex-1 relative bg-white z-10 -mt-4 rounded-t-3xl border-t border-gray-100">
                    <h3 className="font-extrabold text-xl sm:text-2xl text-gray-900 leading-[1.25] mb-4 group-hover:text-[#471088] transition-colors duration-300">
                      {p.title}
                    </h3>

                    {/* Language Meta Data */}
                    <div className="flex items-center gap-3 mt-auto mb-8 text-sm text-gray-500 font-bold">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#471088]/5 group-hover:text-[#471088] group-hover:border-[#471088]/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                        </svg>
                      </div>
                      <p>{p.languages}</p>
                    </div>

                    {/* Interactive Hover Button */}
                    <button className="
                      relative overflow-hidden w-full py-3.5 rounded-xl font-extrabold text-sm
                      bg-gray-50 text-gray-700 border border-gray-200/80 shadow-sm
                      group-hover:bg-[#471088] group-hover:border-[#471088] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(71,16,136,0.3)]
                      transition-all duration-300
                    ">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 [animation:buttonSweep_2s_infinite]"></div>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Know More
                        <svg className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Navigation Button (Glassmorphism) */}
            <button
              onClick={scrollRight}
              className="
                hidden lg:flex absolute -right-8 top-[40%] -translate-y-1/2 z-20
                w-16 h-16 items-center justify-center rounded-full 
                bg-white/70 backdrop-blur-xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                text-gray-400 hover:text-[#471088] hover:bg-white hover:scale-110 hover:shadow-[0_15px_40px_rgba(71,16,136,0.15)]
                opacity-0 group-hover/slider:opacity-100 translate-x-4 group-hover/slider:translate-x-0
                transition-all duration-500 ease-out
              "
              aria-label="Scroll Right"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          {/* ─── MOBILE CONTROLS ─── */}
          <div className="flex justify-center gap-4 mt-2 lg:hidden anim-reveal-slider" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={scrollLeft}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-gray-500 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 hover:text-[#471088] hover:border-[#471088]/30 transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button
              onClick={scrollRight}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-gray-500 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 hover:text-[#471088] hover:border-[#471088]/30 transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

        </div>
      </section>
    </>
  );
}