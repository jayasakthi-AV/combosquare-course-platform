import React, { useState } from "react";
import {
  Smile,
  Repeat,
  FileQuestion,
  Users,
  Infinity,
  CreditCard,
  Mail,
  Headphones,
  Play,
  Briefcase,
  ChevronDown
} from "lucide-react";

const faqs = [
  {
    id: 1,
    icon: <Smile className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "Is there a free trial available?",
    answer: "Yes. You can try any course for free. We also offer live demo sessions so you can experience our premier platform before enrolling.",
  },
  {
    id: 2,
    icon: <Repeat className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "Can I change my plan later?",
    answer: "Absolutely. You can upgrade or switch plans at any time. Our dedicated career experts can help you choose the right option based on your learning path.",
  },
  {
    id: 3,
    icon: <FileQuestion className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "What is your cancellation policy?",
    answer: "You can cancel at any time. If you are within the standard refund window, we will process your refund immediately, no questions asked.",
  },
  {
    id: 4,
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "Can business information be added to an invoice?",
    answer: "Yes, you can request to append GST, organization name, specific business details, or a corporate address to your final invoice.",
  },
  {
    id: 5,
    icon: <Infinity className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "What does lifetime access mean?",
    answer: "Once enrolled, you secure lifetime access to all core course materials, recorded updates, mentor notes, and future curriculum improvements.",
  },
  {
    id: 6,
    icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "How does the billing cycle work?",
    answer: "Billing is assigned per individual student account. We offer flexible payment terms, including monthly or yearly cycles. Upgrades are available seamlessly.",
  },
  {
    id: 7,
    icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "How do I change my account email?",
    answer: "Navigate to your account settings and update your email address. A secure verification link will be immediately dispatched to your new address.",
  },
  {
    id: 8,
    icon: <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "How does technical support work?",
    answer: "We provide comprehensive 24/7 support through live chat, email, and scheduled calls. Our expert team is perpetually on standby to assist you.",
  },
  {
    id: 9,
    icon: <Play className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "Do you provide hands-on tutorials?",
    answer: "Yes. We offer interactive live classes, advanced tutorials, high-definition recorded videos, and step-by-step walkthroughs for every technical module.",
  },
  {
    id: 10,
    icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
    question: "Can I use these skills for commercial projects?",
    answer: "Yes, you own what you build. You can leverage your newly acquired skills to develop enterprise websites, applications, or commercial architecture for global clients.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      {/* ─── MASSIVE PREMIUM ANIMATION ENGINE ─── */}
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes ambientGlow {
            0%, 100% { opacity: 0.03; transform: scale(1); }
            50% { opacity: 0.05; transform: scale(1.05); }
          }
          .anim-slide-up {
            animation: slideUpFade 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          
          /* Staggered Delays */
          .delay-100 { animation-delay: 0.1s; }
          .delay-150 { animation-delay: 0.15s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-250 { animation-delay: 0.25s; }
          .delay-300 { animation-delay: 0.3s; }
          
          /* Architectural Background Grid */
          .faq-grid-bg {
            background-image: 
              linear-gradient(to right, rgba(71, 16, 136, 0.035) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 16, 136, 0.035) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%);
            -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%);
          }
        `}
      </style>

      {/* ─── SECTION WRAPPER ─── */}
      <section className="relative w-full pt-24 pb-28 lg:pt-32 lg:pb-36 bg-[#fcfcfd] overflow-hidden font-sans border-t border-gray-100">
        
        {/* AMBIENT BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 faq-grid-bg"></div>
          
          {/* Volumetric Brand Lighting */}
          <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-[#471088] rounded-full blur-[140px]" style={{ animation: 'ambientGlow 12s infinite alternate' }}></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[40vw] bg-[#471088] rounded-full blur-[150px]" style={{ animation: 'ambientGlow 15s infinite alternate-reverse' }}></div>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

          {/* ─── HEADER AREA ─── */}
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24 anim-slide-up">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#471088]/5 border border-[#471088]/15 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#471088] animate-pulse"></div>
              <span className="text-[#471088] font-black text-[11px] uppercase tracking-[0.2em]">
                Frequently Asked Questions
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight drop-shadow-sm">
              We’re here to help with all <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#471088] to-[#7b2cbf]">
                your questions.
              </span>
            </h2>
          </div>

          {/* ─── FAQ INTERACTIVE BENTO GRID ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {faqs.map((faq, index) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  onClick={() => toggleFAQ(faq.id)}
                  className={`
                    group relative flex flex-col p-6 sm:p-8 rounded-[2rem] cursor-pointer
                    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] border anim-slide-up
                    ${
                      isOpen 
                        ? "bg-white border-[#471088]/40 shadow-[0_20px_50px_rgba(71,16,136,0.12)] ring-4 ring-[#471088]/5 scale-[1.01] z-20" 
                        : "bg-white/60 backdrop-blur-xl border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(71,16,136,0.08)] hover:border-[#471088]/20 hover:bg-white hover:-translate-y-1 z-10"
                    }
                  `}
                  style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
                >
                  <div className="flex items-start justify-between gap-5 sm:gap-6">
                    
                    {/* Elite Animated Icon Box */}
                    <div className={`
                      flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500
                      ${isOpen 
                        ? "bg-[#471088] text-white shadow-lg shadow-[#471088]/30 scale-110" 
                        : "bg-gray-50 border border-gray-100 text-[#471088] group-hover:bg-[#471088]/10 group-hover:scale-105"
                      }
                    `}>
                      {faq.icon}
                    </div>

                    {/* Question Text */}
                    <h3 className={`
                      flex-1 font-extrabold text-lg sm:text-xl pt-1.5 transition-colors duration-300 leading-snug
                      ${isOpen ? "text-[#471088]" : "text-gray-900 group-hover:text-[#471088]"}
                    `}>
                      {faq.question}
                    </h3>

                    {/* Animated Chevron Indicator */}
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mt-0.5
                      ${isOpen ? "bg-[#471088]/10 text-[#471088]" : "bg-transparent text-gray-400 border border-gray-200 group-hover:border-[#471088]/30 group-hover:text-[#471088]"}
                    `}>
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? "-rotate-180" : "rotate-0"}`} 
                      />
                    </div>
                  </div>

                  {/* Butter-Smooth Accordion Expansion */}
                  <div
                    className={`
                      grid transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]
                      ${isOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"}
                    `}
                  >
                    <div className="overflow-hidden">
                      <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed pl-[4.25rem] sm:pl-[5rem] pr-4 pb-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle active glow line at the bottom */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#471088] to-[#7b2cbf] transition-transform duration-500 origin-left ${isOpen ? "scale-x-100" : "scale-x-0"}`}></div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}