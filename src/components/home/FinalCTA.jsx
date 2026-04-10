import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-8 md:px-10 md:py-12 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
          
          {/* Top content */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.25em] text-purple-200 uppercase mb-3">
                Ready to Begin?
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                Learning That Finally Makes Sense.
              </h2>
              <p className="text-sm md:text-base text-purple-100/90">
                Simple explanations, guided lessons, and practical experience designed
                for real understanding not just course completion. Start with clarity,
                stay with confidence, and grow with support.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 w-full sm:w-auto">

  {/* Primary CTA */}
  <button
    onClick={() => navigate("/Domain")}
    className="
      inline-flex items-center justify-center
      w-full
      px-6 md:px-7 py-3 md:py-3.5
      rounded-xl
      bg-white text-purple-700
      font-semibold text-sm md:text-base
      shadow-md
      whitespace-nowrap
      transition-all duration-300
      hover:shadow-lg
      hover:-translate-y-[1px]
    "
  >
    Take Your First Lesson
    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
  </button>

  {/* Secondary CTA */}
  <button
    onClick={() => navigate("/contact")}
    className="
      inline-flex items-center justify-center
      w-full
      px-6 md:px-7 py-3 md:py-3.5
      rounded-xl
      border border-white/30
      text-white
      font-medium text-sm md:text-base
      bg-white/10
      whitespace-nowrap
      transition-all duration-300
      hover:bg-white/20
    "
  >
    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
    Talk to a Mentor
  </button>

</div>


          </div>

          {/* Bottom trust line */}
          <div className="mt-6 md:mt-8 text-xs md:text-sm text-purple-100/80 flex flex-wrap items-center gap-2">
            <span className="font-medium">🎓 Join thousands of learners</span>
            <span className="hidden sm:inline">•</span>
            <span>Live doubt support • Real projects • Structured roadmaps</span>
          </div>
        </div>
      </div>
    </section>
  );
}
