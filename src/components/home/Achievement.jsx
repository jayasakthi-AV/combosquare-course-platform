import React from "react";
import { Users, BookOpen, Clock, Award, ShieldCheck } from "lucide-react";

export default function Achievements() {
  const stats = [
    { 
      icon: <Users className="w-7 h-7 sm:w-8 sm:h-8 text-[#471088] group-hover:scale-110 transition-transform duration-500" />,
      value: "48K+", 
      label: "Learners Upskilled",
      desc: "Successfully transitioned into tech."
    },
    { 
      icon: <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-[#471088] group-hover:scale-110 transition-transform duration-500" />,
      value: "120+", 
      label: "Industry-Ready Courses",
      desc: "Curated by top 1% tech experts."
    },
    { 
      icon: <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-[#471088] group-hover:scale-110 transition-transform duration-500" />,
      value: "1.2M+", 
      label: "Learning Hours",
      desc: "Consumed by our active community."
    },
    { 
      icon: <Award className="w-7 h-7 sm:w-8 sm:h-8 text-[#471088] group-hover:scale-110 transition-transform duration-500" />,
      value: "4.9/5", 
      label: "Average Rating",
      desc: "Consistently rated across platforms."
    },
  ];

  return (
    <>
      {/* ─── MASSIVE PREMIUM ANIMATION ENGINE ─── */}
      <style>
        {`
          @keyframes blurFadeUp {
            0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(8px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes ambientPulse {
            0%, 100% { opacity: 0.03; transform: scale(1); }
            50% { opacity: 0.06; transform: scale(1.1); }
          }
          @keyframes shimmerLine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          
          .anim-blur-fade {
            animation: blurFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }

          /* Staggered Delays for Grid */
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          
          /* Premium Architectural Grid */
          .bg-achievement-grid {
            background-image: 
              linear-gradient(to right, rgba(71, 16, 136, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 16, 136, 0.04) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: radial-gradient(ellipse 90% 50% at 50% 50%, black 40%, transparent 100%);
            -webkit-mask-image: radial-gradient(ellipse 90% 50% at 50% 50%, black 40%, transparent 100%);
          }
        `}
      </style>

      {/* ─── SECTION WRAPPER ─── */}
      <section className="relative w-full bg-[#fcfcfd] py-24 md:py-32 overflow-hidden font-sans border-t border-gray-100">
        
        {/* AMBIENT BACKGROUND EFFECTS */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-achievement-grid"></div>
          
          {/* Volumetric Center Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[1000px] h-[40vw] max-h-[500px] bg-[#471088] rounded-full blur-[140px]" style={{ animation: 'ambientPulse 10s infinite alternate' }}></div>
        </div>

        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24">

          {/* ─── HEADER AREA ─── */}
          <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-24 anim-blur-fade delay-100">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-gray-200/80 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#471088] animate-pulse"></div>
              <span className="text-[#471088] font-black text-[11px] uppercase tracking-[0.2em]">
                Our Global Impact
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight drop-shadow-sm">
              Measured by <br className="block sm:hidden"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf]">
                Learner Growth.
              </span>
            </h2>

            <p className="mt-6 text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Simple numbers that reflect real learning outcomes, career transformations, and trust built over time.
            </p>
          </div>

          {/* ─── PREMIUM STATS GRID ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className={`
                  group relative flex flex-col items-center justify-center text-center
                  bg-white/70 backdrop-blur-2xl
                  py-12 px-8 lg:px-6 xl:px-8
                  rounded-[2.5rem]
                  border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]
                  transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:-translate-y-2
                  hover:shadow-[0_20px_50px_rgba(71,16,136,0.12)]
                  hover:border-[#471088]/30
                  anim-blur-fade cursor-default
                  overflow-hidden
                `}
                style={{ animationDelay: `${0.15 + (idx * 0.1)}s` }}
              >
                {/* Hover Glow Effect inside card */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#471088]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Floating Icon Box */}
                <div className="
                  w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem]
                  bg-gray-50 border border-gray-100 shadow-sm
                  flex items-center justify-center mb-8 relative z-10
                  transition-all duration-500 group-hover:bg-white group-hover:shadow-md group-hover:border-[#471088]/20
                ">
                  {item.icon}
                </div>

                {/* Number Reveal */}
                <h3 className="text-5xl sm:text-6xl font-black text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-[#471088] group-hover:to-[#7b2cbf] transition-all duration-500 tracking-tighter mb-2 relative z-10">
                  {item.value}
                </h3>

                {/* Line Separator */}
                <div className="w-12 h-1 bg-gray-200 rounded-full my-4 group-hover:w-24 group-hover:bg-[#471088]/40 transition-all duration-500 relative z-10"></div>

                {/* Labels */}
                <div className="relative z-10">
                  <p className="text-gray-900 text-base sm:text-lg font-extrabold tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed group-hover:text-gray-600 transition-colors">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Highlight Sweep */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#471088] to-[#7b2cbf] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>

          {/* ─── BOTTOM TRUST BADGE ─── */}
          <div 
            className="mt-20 lg:mt-28 flex justify-center anim-blur-fade"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative overflow-hidden inline-flex items-center justify-center gap-3.5 bg-white/80 backdrop-blur-xl px-7 py-4 rounded-full border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:border-[#471088]/30 transition-colors duration-300">
              {/* Shimmer effect over the badge */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent [animation:shimmerLine_3s_infinite] pointer-events-none"></div>
              
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <p className="text-gray-700 text-sm sm:text-base font-bold relative z-10">
                Trusted by learners across India and <span className="text-[#471088] font-black">growing every day.</span>
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}