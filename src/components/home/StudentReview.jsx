import React, { useEffect, useRef, useState } from "react";

export default function StudentReview() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Emojis removed and text polished for premium corporate appeal
  const reviews = [
    {
      text: "Detailed explanation helps to understand the concept clearly. Highly recommended for beginners.",
      name: "Praveen M",
      company: "@Google",
      img: "https://i.pravatar.cc/150?img=11",
    },
    {
      text: "An exceptional learning platform. The curriculum is perfectly structured for industry needs.",
      name: "Pandiarajan",
      company: "@Trustpilot",
      img: "https://i.pravatar.cc/150?img=12",
    },
    {
      text: "We gained immense knowledge in this program. Actively looking forward to the next advanced module.",
      name: "Kannan S",
      company: "@Zoho",
      img: "https://i.pravatar.cc/150?img=13",
    },
    {
      text: "Mentors provided invaluable tips for resumes, technical interviews, and hands-on projects. Extremely useful.",
      name: "Jai Pravin",
      company: "@Amazon",
      img: "https://i.pravatar.cc/150?img=14",
    },
    {
      text: "The video modules helped me understand complex coding architectures deeply. Thank you for the guidance.",
      name: "Reshma Banu",
      company: "@TCS",
      img: "https://i.pravatar.cc/150?img=5",
    },
    {
      text: "This academy accelerates career growth with a fantastic support system and an immersive learning environment.",
      name: "Syed Imran",
      company: "@Google",
      img: "https://i.pravatar.cc/150?img=16",
    },
    {
      text: "Being part of this ecosystem was a great journey. The 1-on-1 mentorship support is truly top-notch.",
      name: "Mohana Priya",
      company: "@Infosys",
      img: "https://i.pravatar.cc/150?img=17",
    },
  ];

  /* ─── Buttery Smooth Auto-scroll with Pause on Hover ─── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId;
    let scrollAmount = container.scrollTop;

    const smoothScroll = () => {
      if (!isPaused) {
        // Fine-tuned speed for premium readability
        scrollAmount += 0.45; 
        container.scrollTop = scrollAmount;

        // Seamless loop reset
        if (scrollAmount >= container.scrollHeight / 2) {
          scrollAmount = 0;
        }
      }
      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <>
      {/* ─── MASSIVE PREMIUM ANIMATION ENGINE ─── */}
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes glowPulse {
            0%, 100% { opacity: 0.03; transform: scale(1); }
            50% { opacity: 0.06; transform: scale(1.05); }
          }
          .anim-slide-up {
            animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          
          /* Elite Scrollbar Hiding */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          /* Architectural Background Grid */
          .review-grid-bg {
            background-image: 
              linear-gradient(to right, rgba(71, 16, 136, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 16, 136, 0.04) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
            -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          }
        `}
      </style>

      {/* ─── SECTION WRAPPER ─── */}
      <section className="relative w-full pt-24 pb-28 lg:pt-32 lg:pb-36 bg-[#fcfcfd] overflow-hidden font-sans border-t border-gray-100">
        
        {/* AMBIENT BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 review-grid-bg"></div>
          {/* Subtle Brand Color Wash */}
          <div className="absolute top-1/4 right-[-10%] w-[50vw] h-[50vw] bg-[#471088] rounded-full blur-[140px]" style={{ animation: 'glowPulse 10s infinite alternate' }}></div>
          <div className="absolute bottom-1/4 left-[-10%] w-[40vw] h-[40vw] bg-[#471088] rounded-full blur-[120px]" style={{ animation: 'glowPulse 12s infinite alternate-reverse' }}></div>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

          {/* ─── HEADER AREA ─── */}
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 anim-slide-up">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#471088]/5 border border-[#471088]/15 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#471088] animate-pulse"></div>
              <span className="text-[#471088] font-black text-[11px] uppercase tracking-[0.2em]">
                Student Success Stories
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight drop-shadow-sm">
              Hear from students <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf]">
                who achieved their goals.
              </span>
            </h2>
          </div>

          {/* ─── SCROLL AREA WRAPPER ─── */}
          <div 
            className="relative h-[600px] lg:h-[700px] anim-slide-up" 
            style={{ animationDelay: "0.2s" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >

            {/* Top Fade Mask (Deeper for seamless blend) */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 lg:h-40 bg-gradient-to-b from-[#fcfcfd] via-[#fcfcfd]/90 to-transparent z-20"></div>

            {/* ─── SCROLLABLE MASONRY GRID ─── */}
            <div
              ref={scrollRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 h-full overflow-y-auto no-scrollbar py-16 px-2 sm:px-4"
            >
              {/* Duplicate array for seamless infinite scroll effect */}
              {[...reviews, ...reviews].map((r, i) => (
                <div
                  key={i}
                  className="
                    group relative flex flex-col justify-between h-max min-h-[260px]
                    bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-7 lg:p-8
                    shadow-[0_10px_30px_rgba(0,0,0,0.03)] cursor-default
                    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                    hover:shadow-[0_20px_40px_rgba(71,16,136,0.12)] hover:border-[#471088]/30 hover:-translate-y-1.5
                    overflow-hidden
                  "
                >
                  {/* Decorative faint quote SVG in background */}
                  <svg className="absolute top-6 right-6 w-20 h-20 text-gray-100 opacity-50 group-hover:text-[#471088]/5 group-hover:scale-125 transition-all duration-700 pointer-events-none -z-10" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>

                  <div>
                    {/* Elite Rating Stars (Amber) */}
                    <div className="flex gap-1.5 mb-5 text-[#fbbf24]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed mb-8 relative z-10 group-hover:text-gray-900 transition-colors duration-300">
                      "{r.text}"
                    </p>
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mt-auto pt-5 border-t border-gray-100 group-hover:border-[#471088]/10 transition-colors duration-300">
                    <img
                      src={r.img}
                      alt={r.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-[#471088]/10 object-cover shadow-sm group-hover:ring-[#471088]/40 transition-all duration-300"
                    />
                    <div className="flex flex-col">
                      <p className="font-extrabold text-gray-900 text-sm sm:text-base">{r.name}</p>
                      <p className="text-[#471088] font-bold text-xs tracking-wide uppercase mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">{r.company}</p>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Bottom Fade Mask (Deeper for seamless blend) */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 lg:h-40 bg-gradient-to-t from-[#fcfcfd] via-[#fcfcfd]/90 to-transparent z-20"></div>

          </div>
        </div>
      </section>
    </>
  );
}