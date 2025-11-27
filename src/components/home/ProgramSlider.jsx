import uiux from "../../assets/uiux.png";
import fullstack from "../../assets/fullstack.png";
import dataanalytics from "../../assets/dataanalytics.png";
import aiml from "../../assets/aiml.png";

import React, { useRef } from "react";

export default function ProgramSlider() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
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
    <div className="w-full py-10 sm:py-14 bg-white pt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        {/* ⭐ Heading */}
        <h3 className="text-purple-600 font-bold text-sm sm:text-lg tracking-wide">
          OUR PROGRAM
        </h3>

        <p className="text-2xl sm:text-3xl font-extrabold leading-snug text-gray-900 mb-8 sm:mb-10">
          Discover Our Premier,{" "}
          <span className="text-purple-600">Top-Rated</span> <br className="hidden sm:block" />
          Learning Program
        </p>

        {/* ⭐ Left Button (Desktop Only) */}
        <button
          onClick={scrollLeft}
          className="
            hidden lg:flex 
            absolute -left-5 top-1/2 -translate-y-1/2 
            bg-white w-12 h-12 items-center justify-center rounded-full shadow-md border border-gray-200 z-10
            hover:shadow-xl hover:scale-110 transition-all duration-200
          "
        >
          <span className="text-gray-700 text-xl">‹</span>
        </button>

        {/* ⭐ Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-3"
        >
          {programs.map((p, i) => (
            <div
              key={i}
              className="
                min-w-[250px] sm:min-w-[300px] 
                bg-white rounded-xl shadow-md border border-gray-100 
                transition-all duration-300 
                hover:-translate-y-2 hover:shadow-xl cursor-pointer
              "
            >
              {/* Image */}
              <img
                src={p.img}
                className="w-full h-36 sm:h-40 object-cover rounded-t-xl"
                alt={p.title}
              />

              <div className="p-4">
                <h3 className="font-bold text-base sm:text-lg text-gray-900">{p.title}</h3>

                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                  {p.tag}
                </span>

                <div className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                  <span className="text-gray-500 text-base">🌐</span>
                  <p>{p.languages}</p>
                </div>

                <button className="w-full mt-5 py-2 rounded-lg bg-purple-600 text-white font-semibold 
                  hover:bg-purple-700 hover:shadow-md transition">
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ⭐ Right Button (Desktop Only) */}
        <button
          onClick={scrollRight}
          className="
            hidden lg:flex 
            absolute -right-5 top-1/2 -translate-y-1/2 
            bg-white w-12 h-12 items-center justify-center rounded-full shadow-md border border-gray-200 z-10
            hover:shadow-xl hover:scale-110 transition-all duration-200
          "
        >
          <span className="text-gray-700 text-xl">›</span>
        </button>

        {/* ⭐ Mobile Buttons Below Slider */}
        <div className="flex justify-center gap-4 mt-6 lg:hidden">
          <button
            onClick={scrollLeft}
            className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md border hover:shadow-lg transition"
          >
            ‹
          </button>

          <button
            onClick={scrollRight}
            className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md border hover:shadow-lg transition"
          >
            ›
          </button>
        </div>

      </div>
    </div>
  );
}
