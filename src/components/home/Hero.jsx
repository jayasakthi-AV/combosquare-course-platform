import React, { useEffect, useState } from "react";
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

export default function Hero() {
  const navigate = useNavigate();

  const sliderImages = [
    { img: user1, title: "Learn From Experts", desc: "Master development with structured guidance." },
    { img: user2, title: "Hands-on Projects", desc: "Build real-world projects for your portfolio." },
    { img: user3, title: "Job Assistance", desc: "Crack interviews with expert mentorship." }
  ];

  const [active, setActive] = useState(1);
  const [counter, setCounter] = useState(48000);

  // Desktop auto slider
  useEffect(() => {
    const auto = setInterval(() => {
      setActive((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(auto);
  }, []);

  // Counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + Math.floor(Math.random() * 3));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 🌟 HERO SECTION */}
      <section className="relative w-full pt-14 sm:pt-16 md:pt-32 pb-6 bg-gradient-to-br from-purple-50 to-white overflow-hidden">

        {/* 🔲 SOFT PURPLE FLOWING GRID BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden max-h-full">
          <div
            className="
              absolute
              -top-16 -left-16
              w-[900px] h-[900px]
              sm:-top-24 sm:-left-24 sm:w-[1100px] sm:h-[1100px]
              md:-top-40 md:-left-40 md:w-[1400px] md:h-[1400px]
              animate-gridFlow
            "
          >
            <div className="grid grid-cols-10 gap-px">
              {Array.from({ length: 100 }).map((_, i) => (
                <span
                  key={i}
                  className={`aspect-square border border-purple-200/40
                    ${i % 8 === 0 || i % 13 === 0 ? "bg-purple-300/25" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 🌟 HERO CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">

          {/* ⭐ LEFT CONTENT */}
          <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">

            <p className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-semibold text-sm mx-auto md:mx-0">
              India’s #1 Learning Platform
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
              Become a <span className="text-purple-600">Software Developer</span> in 2026
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 font-medium">
              From absolute beginner to job-ready developer in just 6 months.
            </p>

            <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
              Learn industry-level development with hands-on projects, mentors, and job support.
            </p>

            {/* BADGES */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                ✔ 100% Job Support Included
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                ✔ Beginner Friendly
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                ✔ Live Doubt Clearing
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-3">
              <button
                onClick={() => navigate("/program")}
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition"
              >
                Start Learning Now
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="px-6 py-3 border border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-100 transition"
              >
                Talk to a Career Expert
              </button>
            </div>

            {/* COUNTER */}
            <div className="flex justify-center md:justify-start items-center gap-3 pt-4">
              <div className="flex -space-x-3">
                <img src={learner1} className="w-9 h-9 rounded-full border-2 border-white" />
                <img src={learner2} className="w-9 h-9 rounded-full border-2 border-white" />
                <img src={learner3} className="w-9 h-9 rounded-full border-2 border-white" />
              </div>
              <p className="text-gray-700 text-sm font-medium">
                <span className="font-bold text-purple-700">{counter.toLocaleString()}</span> learners enrolled
              </p>
            </div>

          </div>

          {/* 🖥 DESKTOP IMAGE SLIDER */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-3 w-full">
            {sliderImages.map((item, i) => (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all duration-700
                  ${active === i ? "flex-[4]" : "flex-[1.2]"}
                  h-[520px] lg:h-[500px] bg-white`}
              >
                <img src={item.img} className="w-full h-full object-cover" />
                <div className={`absolute bottom-3 left-3 text-white transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ⭐ TOP COMPANIES */}
      <div className="w-full bg-white pt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-900 font-extrabold text-3xl mb-4">
            Where Do Our Learners Work?
          </p>

          <div className="flex justify-center gap-8 flex-wrap opacity-90">
  <img src={amazon} alt="Amazon" className="h-16 md:h-20 lg:h-24 w-auto" />
  <img src={zoho} alt="Zoho" className="h-16 md:h-20 lg:h-24 w-auto" />
  <img src={tcs} alt="TCS" className="h-16 md:h-20 lg:h-24 w-auto" />
  <img src={infosys} alt="Infosys" className="h-16 md:h-20 lg:h-24 w-auto" />
</div>

        </div>
      </div>
    </>
  );
}
