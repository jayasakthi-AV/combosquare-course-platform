// src/components/home/Achievements.jsx

import React, { useEffect, useState, useRef } from "react";

// CountUp Hook (runs only when "trigger" becomes true)
function useCountUp(target, trigger, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.floor(progress * target));

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [trigger, target]);

  return value;
}

// SVG progress ring
function ProgressRing({ percentage, trigger, label, size = 100, strokeWidth = 9 }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / 1500, 1);
      setAnimatedPercent(progress * percentage);

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [trigger, percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="mb-3">
        {/* Track */}
        <circle
          stroke="#E9D5FF"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Animated Progress */}
        <circle
          stroke="#5B21B6"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .2s linear" }}
        />

        {/* Center Text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-indigo-700 text-lg font-bold"
        >
          {Math.round(animatedPercent)}%
        </text>
      </svg>

      <p className="text-sm font-semibold text-gray-900 text-center">{label}</p>
    </div>
  );
}

export default function Achievements() {
  const sectionRef = useRef(null);
  const [trigger, setTrigger] = useState(false);

  // Intersection Observer
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

  // Updated learners count
  const learnersTarget = 48025;
  const learnersCount = useCountUp(learnersTarget, trigger);

  // Stats below the main one
  const stats = [
    { value: 194, label: "Mentors" },
    { value: 5064, label: "Code Submissions" },
    { value: 1673, label: "Videos" },
  ];

  // Performance metrics
  const performance = [
    { value: 72, label: "Course Completion" },
    { value: 78, label: "Concept Recall" },
    { value: 84, label: "Better Understanding" },
  ];

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] text-purple-600 uppercase">
            Achievements
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
            Our Impact So Far
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            A measurable transformation driven by our learners, mentors,
            and continuous improvement.
          </p>
        </div>

        {/* Main Learners Count */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md bg-purple-50 border border-purple-200 rounded-2xl px-10 py-8 shadow-sm text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-indigo-700 uppercase mb-2">
              Learners Enrolled
            </p>

            <p className="text-4xl md:text-5xl font-extrabold text-indigo-700">
              {trigger ? learnersCount.toLocaleString() : "0"}
            </p>

            <p className="text-gray-600 text-sm mt-3">
              learners enrolled and actively learning.
            </p>
          </div>
        </div>

        {/* Three Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((item, idx) => {
            const animated = useCountUp(item.value, trigger);

            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-purple-100 shadow-sm px-6 py-6 text-center"
              >
                <p className="text-3xl font-extrabold text-indigo-700">
                  {trigger ? animated.toLocaleString() : "0"}
                </p>
                <p className="text-gray-700 text-sm mt-2 font-medium">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-indigo-700 uppercase">
            Performance Metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {performance.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-indigo-100 shadow-sm px-6 py-6 flex justify-center"
            >
              <ProgressRing
                percentage={item.value}
                label={item.label}
                trigger={trigger}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
