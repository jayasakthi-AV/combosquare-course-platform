import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <>
      {/* ─── MASSIVE PREMIUM ANIMATION ENGINE ─── */}
      <style>
        {`
          @keyframes revealUpCTA {
            0% { opacity: 0; transform: translateY(50px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes shimmerSweep {
            0% { transform: translateX(-150%) skewX(-25deg); }
            100% { transform: translateX(250%) skewX(-25deg); }
          }
          @keyframes ambientGlowCTA {
            0%, 100% { opacity: 0.4; transform: scale(1) translate(0, 0); }
            50% { opacity: 0.7; transform: scale(1.1) translate(-20px, 20px); }
          }
          
          .anim-reveal-cta {
            animation: revealUpCTA 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          
          /* Staggered Delays */
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
        `}
      </style>

      {/* ─── CTA SECTION WRAPPER ─── */}
      {/* Background matches the rest of the site's clean aesthetic */}
      <section className="relative w-full py-24 lg:py-32 bg-[#fcfcfd] overflow-hidden font-sans">
        
        {/* Subtle Background Architectural Grid */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgba(71, 16, 136, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(71, 16, 136, 0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 30%, transparent 100%)'
          }}></div>
        </div>

        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* ⭐ PREMIUM DEEP-BRAND GLASSMORPHISM CARD */}
          <div 
            className="relative overflow-hidden bg-gradient-to-br from-[#471088] via-[#330b63] to-[#1c053a] rounded-[2.5rem] lg:rounded-[3.5rem] px-8 py-14 sm:p-16 lg:p-20 shadow-[0_20px_60px_rgba(71,16,136,0.25)] anim-reveal-cta"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Ambient Internal Lighting */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'ambientGlowCTA 12s infinite alternate' }}></div>
            <div className="absolute bottom-[-30%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-[#9d4edd]/20 rounded-full blur-[140px] pointer-events-none" style={{ animation: 'ambientGlowCTA 15s infinite alternate-reverse' }}></div>
            
            {/* Noise Overlay for Cinematic Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
              
              {/* ─── LEFT CONTENT: COPY ─── */}
              <div className="w-full lg:max-w-2xl text-center lg:text-left">
                
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6 backdrop-blur-md anim-reveal-cta delay-200">
                  <div className="w-2 h-2 rounded-full bg-[#e2cfff] animate-pulse"></div>
                  <span className="text-[#e2cfff] font-black text-[10px] sm:text-xs uppercase tracking-[0.25em]">
                    Ready to Begin?
                  </span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.15] mb-6 tracking-tight drop-shadow-md anim-reveal-cta delay-300">
                  Learning That <br className="hidden sm:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2cfff] to-[#b886fb]">
                    Finally Makes Sense.
                  </span>
                </h2>
                
                <p className="text-base sm:text-lg lg:text-xl text-purple-100/80 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 anim-reveal-cta delay-400">
                  Simple explanations, guided lessons, and practical experience designed
                  for real understanding, not just course completion. Start with clarity,
                  stay with confidence, and grow with support.
                </p>
              </div>

              {/* ─── RIGHT CONTENT: ACTION BUTTONS ─── */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-5 w-full sm:w-auto flex-shrink-0 anim-reveal-cta delay-500">
                
                {/* Primary CTA */}
                <button
                  onClick={() => navigate("/Domain")}
                  className="
                    group relative overflow-hidden inline-flex items-center justify-center
                    w-full sm:w-[280px] lg:w-[320px] px-8 py-4 sm:py-5 rounded-2xl
                    bg-white text-[#471088] font-extrabold text-base sm:text-lg
                    shadow-[0_10px_30px_rgba(0,0,0,0.2)]
                    transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                    hover:shadow-[0_15px_40px_rgba(255,255,255,0.25)] hover:-translate-y-1.5 active:scale-95
                  "
                >
                  {/* Endless Shimmer Effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#471088]/15 to-transparent [animation:shimmerSweep_2.5s_infinite]"></div>
                  
                  <span className="relative z-10 flex items-center justify-center w-full">
                    Take Your First Lesson
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => navigate("/contact")}
                  className="
                    group inline-flex items-center justify-center
                    w-full sm:w-[280px] lg:w-[320px] px-8 py-4 sm:py-5 rounded-2xl
                    border-2 border-white/20 text-white font-bold text-base sm:text-lg
                    bg-white/5 backdrop-blur-md
                    transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                    hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95
                  "
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2.5 text-purple-200 group-hover:text-white transition-colors duration-300" />
                  Talk to a Mentor
                </button>

              </div>
            </div>

            {/* ─── BOTTOM TRUST LINE ─── */}
            <div className="mt-12 lg:mt-16 pt-8 border-t border-white/10 flex justify-center lg:justify-start anim-reveal-cta delay-600">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-5 text-xs sm:text-sm text-purple-200/70 font-bold">
                
                {/* Replaced Emoji with High-End Premium SVG Indicator */}
                <span className="flex items-center gap-2 text-white drop-shadow-md bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                  <svg className="w-4 h-4 text-[#e2cfff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Join thousands of learners
                </span>
                
                <span className="hidden sm:inline opacity-30">•</span>
                <span className="hover:text-white transition-colors cursor-default">Live doubt support</span>
                <span className="hidden sm:inline opacity-30">•</span>
                <span className="hover:text-white transition-colors cursor-default">Real projects</span>
                <span className="hidden md:inline opacity-30">•</span>
                <span className="hidden md:inline hover:text-white transition-colors cursor-default">Structured roadmaps</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}