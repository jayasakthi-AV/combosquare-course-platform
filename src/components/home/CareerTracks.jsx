import React from "react";

import IT from "../../assets/IT.jpg";
import placement from "../../assets/placement.png";
import programing from "../../assets/programing.png";
import business from "../../assets/business.png";
import engineering from "../../assets/engineering.png";

export default function CareerTracks() {
  const domainList = [
    {
      title: "Technology & IT",
      img: IT,
      tagline: "Build digital skills for the modern tech world.",
    },
    {
      title: "Programming",
      img: programing,
      tagline: "Start your coding journey with strong basics.",
    },
    {
      title: "Automation",
      img: engineering,
      tagline: "Master tools that power real-world systems.",
    },
    {
      title: "Business & Design",
      img: business,
      tagline: "Blend strategy with design to create impact.",
    },
    {
      title: "Placements",
      img: placement,
      tagline: "Prepare for interviews and land your dream job.",
    },
  ];

  return (
    <>
      {/* ─── MASSIVE PREMIUM ANIMATION ENGINE ─── */}
      <style>
        {`
          @keyframes fadeUpTrack {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseAccent {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          .anim-track-up {
            animation: fadeUpTrack 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          
          /* Staggered Delays for Grid */
          .delay-100 { animation-delay: 0.1s; }
          .delay-150 { animation-delay: 0.15s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-250 { animation-delay: 0.25s; }
          .delay-300 { animation-delay: 0.3s; }
          
          /* Premium Architectural Grid */
          .bg-tech-grid {
            background-image: 
              linear-gradient(to right, rgba(71, 16, 136, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 16, 136, 0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%);
            -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%);
          }
        `}
      </style>

      {/* ─── DOMAINS SECTION WRAPPER ─── */}
      <section className="relative w-full pt-20 pb-28 lg:pt-28 lg:pb-36 bg-[#fcfcfd] overflow-hidden font-sans border-t border-gray-100">
        
        {/* AMBIENT BACKGROUND EFFECTS */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-tech-grid"></div>
          
          {/* Subtle Brand Color Glows */}
          <div className="absolute top-0 left-[10%] w-[40vw] h-[40vw] bg-[#471088]/[0.03] rounded-full blur-[120px]" style={{ animation: 'pulseAccent 8s infinite alternate' }}></div>
          <div className="absolute bottom-[-10%] right-[5%] w-[35vw] h-[35vw] bg-[#471088]/[0.02] rounded-full blur-[100px]" style={{ animation: 'pulseAccent 10s infinite alternate-reverse' }}></div>
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

          {/* ─── SECTION HEADER ─── */}
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24 anim-track-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#471088]/5 border border-[#471088]/15 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#471088] animate-pulse"></div>
              <span className="text-[#471088] font-black text-[11px] uppercase tracking-[0.2em]">
                Domains We Offer
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
              Your roadmap to a <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf]">
                high-paid tech career.
              </span>
            </h2>
          </div>

          {/* ─── PREMIUM CARDS GRID ─── */}
          {/* Automatically flows from 1 col (mobile) -> 2 cols (tablet) -> 3 cols (laptop) -> 5 cols (xl screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-8">
            {domainList.map((domain, i) => (
              <div
                key={i}
                className={`
                  group relative flex flex-col bg-white rounded-3xl border border-gray-200/80
                  shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden cursor-pointer
                  transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(71,16,136,0.12)]
                  hover:border-[#471088]/30 anim-track-up
                `}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Image Container with Cinematic Zoom & Overlay */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                  {/* Numeric Indicator Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md text-[#471088] text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm tracking-widest">
                    0{i + 1}
                  </div>
                  
                  <img
                    src={domain.img}
                    alt={domain.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  
                  {/* Elegant Gradient Fade to blend image into the white card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent opacity-90"></div>
                  
                  {/* Subtle brand tint on hover */}
                  <div className="absolute inset-0 bg-[#471088]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col p-6 lg:p-7 relative bg-white z-10 -mt-8">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-[#471088] transition-colors duration-300">
                    {domain.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 flex-1">
                    {domain.tagline}
                  </p>

                  {/* Interactive 'Explore' Link */}
                  <div className="flex items-center gap-2 text-[#471088] font-bold text-sm mt-auto pt-4 border-t border-gray-100 group-hover:border-[#471088]/20 transition-colors duration-300">
                    <span className="relative overflow-hidden">
                      <span className="block transition-transform duration-300 group-hover:-translate-y-full">Explore Track</span>
                      <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-[#471088]">Explore Track</span>
                    </span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                {/* Subtle Hover Glow Line at bottom of card */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#471088] to-[#7b2cbf] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}