// src/components/home/Achievements.jsx

import React from "react";

export default function Achievements() {
  const stats = [
    { value: "48K+", label: "Learners Upskilled" },
    { value: "120+", label: "Industry-Ready Courses" },
    { value: "1.2M+", label: "Learning Hours Completed" },
    { value: "4.9★", label: "Average Learner Rating" },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-1g font-semibold tracking-widest text-purple-700 uppercase">
            Our Impact
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-3">
            Measured by <span className="text-purple-600"> Learner Growth</span>
          </h2>

          <p className="text-gray-600 mt-4 max-w-xl mx-auto text-sm md:text-base">
            Simple numbers that reflect real learning outcomes and trust built over time.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="
                text-center
                py-6 md:py-8
                rounded-2xl
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-purple-600">
                {item.value}
              </p>

              <p className="text-gray-600 mt-2 text-xs md:text-sm font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Line */}
        <div className="mt-12 md:mt-16 text-center text-gray-700 text-sm md:text-base font-medium">
          Trusted by learners across India and growing every day.
        </div>

      </div>
    </section>
  );
}
