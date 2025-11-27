import React, { useEffect, useRef } from "react";

export default function StudentReview() {
  const scrollRef = useRef(null);

  const reviews = [
    {
      text: "Detailed explanation helps to understand the concept clearly ❤️",
      name: "Praveen M",
      company: "@Google",
      img: "https://i.pravatar.cc/100?img=1",
    },
    {
      text: "Good Learning Platform",
      name: "Pandiarajan",
      company: "@Trust Pilot",
      img: "https://i.pravatar.cc/100?img=2",
    },
    {
      text: "We gained more knowledge in this event. Waiting for the next one 🤩",
      name: "Kannan S",
      company: "@Google",
      img: "https://i.pravatar.cc/100?img=3",
    },
    {
      text: "Mentors gave tips for resume, interviews & hands-on projects. Very useful!",
      name: "Jai Pravin",
      company: "@Trustpilot",
      img: "https://i.pravatar.cc/100?img=4",
    },
    {
      text: "Your videos helped me understand coding deeply! Thanks a lot 🥰",
      name: "Reshma Banu",
      company: "@Google",
      img: "https://i.pravatar.cc/100?img=5",
    },
    {
      text: "This academy improves career growth, with great support & environment.",
      name: "Syed Imran",
      company: "@Google",
      img: "https://i.pravatar.cc/100?img=6",
    },
    {
      text: "Being a co-mentor was a great journey! The support is top-notch.",
      name: "Mohana Priya",
      company: "@Google",
      img: "https://i.pravatar.cc/100?img=7",
    },
  ];

  // ⭐ Auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (!container) return;

      scrollAmount += 1;
      container.scrollTop = scrollAmount;

      if (scrollAmount >= container.scrollHeight - container.clientHeight) {
        scrollAmount = 0;
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-20 bg-white pt-1">
      <div className="max-w-7xl mx-auto px-6">

        {/* ⭐ Heading */}
        <p className="text-center text-purple-500 font-bold text-sm tracking-wide mb-2">
          STUDENT REVIEW
        </p>

        <h2 className="text-center text-4xl font-bold text-gray-900 mb-10">
          Hear from students <span className="text-purple-600">like you</span>
        </h2>

        {/* ⭐ Scroll Area Wrapper — THIS FIXES YOUR FADE ISSUE */}
        <div className="relative h-[520px]">

          {/* ⭐ Fade Top (Now PERFECT) */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent z-10"></div>

          {/* ⭐ Scrollable Auto-Scrolling Container */}
          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto no-scrollbar pr-3"
          >
            {reviews.concat(reviews).map((r, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-800 leading-relaxed mb-4">
                  {r.text}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{r.name}</p>
                    <p className="text-gray-500 text-sm">{r.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ⭐ Fade Bottom (Now PERFECT) */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10"></div>

        </div>

      </div>
    </div>
  );
}
