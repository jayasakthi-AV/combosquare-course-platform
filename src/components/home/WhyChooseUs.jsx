import React from "react";
import { CheckCircle, Users, Briefcase, Clock, Target, Layers } from "lucide-react";
import frontimg from "../../assets/frontimg.png";

export default function WhyChooseUs() {
  const features = [
    { 
      icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#471088] group-hover:text-white transition-colors duration-500" />, 
      title: "Expert Instructors", 
      desc: "Learn directly from industry professionals who teach exactly what top tier tech companies expect." 
    },
    { 
      icon: <Target className="w-6 h-6 sm:w-7 sm:h-7 text-[#471088] group-hover:text-white transition-colors duration-500" />, 
      title: "Personalized Path", 
      desc: "Clear, structured roadmaps crafted meticulously for both absolute beginners and advanced learners." 
    },
    { 
      icon: <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-[#471088] group-hover:text-white transition-colors duration-500" />, 
      title: "Job-Ready Skills", 
      desc: "Build real-world projects, gain practical skills, and create a powerful portfolio recruiters cannot ignore." 
    },
    { 
      icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-[#471088] group-hover:text-white transition-colors duration-500" />, 
      title: "Flexible Learning", 
      desc: "Learn seamlessly at your own pace with bite-sized modules combined with live doubt-clearing support." 
    },
    { 
      icon: <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-[#471088] group-hover:text-white transition-colors duration-500" />, 
      title: "Real Tools & Practice", 
      desc: "Train strictly with the newest tools, frameworks, and technologies used by modern tech companies." 
    },
    { 
      icon: <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#471088] group-hover:text-white transition-colors duration-500" />, 
      title: "Community Support", 
      desc: "Access 24/7 mentor support, peer discussions, live sessions, and the motivation that keeps you building." 
    },
  ];

  return (
    <>
      {/* ─── MASSIVE PREMIUM ANIMATION ENGINE ─── */}
      <style>
        {`
          @keyframes revealFeature {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes pulseAccent {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
          .anim-reveal-feature {
            animation: revealFeature 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          
          /* Staggered Grid Delays */
          .delay-100 { animation-delay: 0.1s; }
          .delay-150 { animation-delay: 0.15s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-250 { animation-delay: 0.25s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-350 { animation-delay: 0.35s; }
          .delay-400 { animation-delay: 0.4s; }
        `}
      </style>

      {/* ─── SECTION WRAPPER ─── */}
      <section className="relative w-full min-h-[800px] bg-[#fcfcfd] overflow-hidden font-sans border-t border-gray-100">
        
        {/* ─── PREMIUM PARALLAX BACKGROUND (Enhanced Visibility) ─── */}
        {/* Increased opacity to 60% and removed grayscale so the image pops beautifully */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed opacity-60 mix-blend-multiply"
          style={{ backgroundImage: `url(${frontimg})` }}
        ></div>
        
        {/* Layered Glassmorphism Overlays (Lightened to let image through) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcfcfd]/90 via-[#fcfcfd]/70 to-[#fcfcfd]/90 backdrop-blur-[6px]"></div>
        
        {/* Ambient Brand Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[400px] bg-[#471088]/[0.05] rounded-full blur-[120px] pointer-events-none" style={{ animation: 'pulseAccent 8s infinite alternate' }}></div>

        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-24 lg:py-32">

          {/* ─── HEADER AREA ─── */}
          <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-24 anim-reveal-feature delay-100">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-gray-200/80 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#471088] animate-pulse"></div>
              <span className="text-[#471088] font-black text-[11px] uppercase tracking-[0.2em]">
                The Combo Square Advantage
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight drop-shadow-sm">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf]">Trusted</span> by learners, <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf]">Loved</span> by recruiters.
            </h2>
            
            <p className="mt-6 text-lg text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              We don't just teach code; we engineer careers. Discover why thousands of students choose us to transition into top-tier tech roles.
            </p>
          </div>

          {/* ─── BENTO FEATURE CARDS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className={`
                  group relative flex flex-col bg-white/85 backdrop-blur-xl rounded-[2rem] p-8 lg:p-10
                  border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                  overflow-hidden cursor-default anim-reveal-feature
                  transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(71,16,136,0.12)]
                  hover:border-[#471088]/30
                `}
                style={{ animationDelay: `${0.15 + (index * 0.05)}s` }}
              >
                {/* Subtle Ambient Card Glow on Hover */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#471088]/5 rounded-full blur-3xl group-hover:bg-[#471088]/15 transition-colors duration-700 pointer-events-none z-0"></div>

                {/* Animated Icon Container */}
                <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#471088] group-hover:border-[#471088] group-hover:shadow-[0_10px_20px_rgba(71,16,136,0.25)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                  {item.icon}
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 tracking-tight group-hover:text-[#471088] transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Highlight Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#471088] to-[#7b2cbf] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"></div>
              </div>
            ))}
          </div>

          {/* ─── BOTTOM TRUST BAR ─── */}
          <div className="mt-20 lg:mt-28 text-center anim-reveal-feature delay-600">
            <div className="inline-flex items-center justify-center gap-3.5 bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-full border border-gray-200/80 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-[#471088]/20 transition-all duration-300 cursor-default">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#471088] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#471088]"></span>
              </span>
              <p className="text-gray-800 text-sm sm:text-base font-bold tracking-wide">
                Trusted by learners from{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf] font-black">
                  Top Tech Companies
                </span>
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}