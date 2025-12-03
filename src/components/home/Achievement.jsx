// src/components/home/Achievements.jsx

import React, { useEffect, useState, useRef } from "react";

/* -------------------- COUNT-UP HOOK -------------------- */
function useCountUp(target, trigger, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [trigger, target]);

  return value;
}

/* -------------------- PROGRESS RING -------------------- */
function ProgressRing({ percentage, trigger, label, size = 110, strokeWidth = 10 }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / 1500, 1);
      setAnimatedPercent(progress * percentage);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [trigger, percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        className="mb-2 md:mb-3"
      >
        {/* Track */}
        <circle
          stroke="rgba(255,255,255,0.4)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Gradient Progress */}
        <circle
          stroke="url(#grad)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />

        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-indigo-700 text-lg md:text-xl font-bold"
        >
          {Math.round(animatedPercent)}%
        </text>
      </svg>

      <p className="text-xs md:text-sm font-semibold text-gray-900 text-center">
        {label}
      </p>
    </div>
  );
}

export default function Achievements() {
  const sectionRef = useRef(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setTrigger(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const learnersTarget = 48025;
  const learnersCount = useCountUp(learnersTarget, trigger);

  const stats = [
    { value: 194, label: "Mentors" },
    { value: 5064, label: "Code Submissions" },
    { value: 1673, label: "Videos" },
  ];

  const performance = [
    { value: 72, label: "Course Completion" },
    { value: 78, label: "Concept Recall" },
    { value: 84, label: "Better Understanding" },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-white to-purple-50/40 py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-purple-700 uppercase">
            Achievements
          </p>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent mt-2">
            Our Impact So Far
          </h2>

          <p className="text-gray-600 mt-3 md:mt-4 max-w-xl md:max-w-2xl mx-auto text-xs md:text-base">
            A measurable transformation driven by our learners, mentors,
            and continuous improvement.
          </p>
        </div>

        {/* Main Count */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="w-full max-w-sm md:max-w-lg backdrop-blur-xl bg-white/60 border border-purple-200/40 rounded-2xl md:rounded-3xl px-6 md:px-12 py-8 md:py-10 shadow-md md:shadow-xl text-center">
            <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-indigo-700 uppercase mb-2 md:mb-3">
              Learners Enrolled
            </p>

            <p className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-indigo-700">
              {trigger ? learnersCount.toLocaleString() : "0"}
            </p>

            <p className="text-gray-600 text-xs md:text-sm mt-2 md:mt-4">
              learners enrolled and actively learning.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-14 md:mb-20">
          {stats.map((item, idx) => {
            const animated = useCountUp(item.value, trigger);
            return (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-xl border border-purple-100/40 rounded-xl md:rounded-2xl shadow-md md:shadow-lg py-6 md:py-8 px-6 md:px-8 text-center"
              >
                <p className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-indigo-700">
                  {trigger ? animated.toLocaleString() : "0"}
                </p>

                <p className="text-gray-700 text-xs md:text-sm mt-2 md:mt-3 font-medium">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <div className="text-center mb-6 md:mb-10">
          <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-purple-700 uppercase">
            Performance Metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {performance.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-xl border border-indigo-100/50 rounded-xl md:rounded-2xl shadow-md md:shadow-lg px-6 md:px-8 py-6 md:py-8 flex justify-center"
            >
              <ProgressRing percentage={item.value} label={item.label} trigger={trigger} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
