import React from "react";
import { CheckCircle, Users, Briefcase, Clock, Target, Layers } from "lucide-react";
import frontimg from "../../assets/frontimg.png";

export default function WhyChooseUs() {
  const features = [
    { icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />, title: "Expert Instructors", desc: "Learn directly from industry professionals who teach exactly what top companies expect." },
    { icon: <Target className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />, title: "Personalized Learning Path", desc: "Clear, structured roadmaps crafted for beginners and advanced learners alike." },
    { icon: <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />, title: "Job-Ready Skills", desc: "Build real-world projects, gain practical skills, and create a portfolio recruiters can't ignore." },
    { icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />, title: "Flexible Learning", desc: "Learn at your own pace with bite-sized modules + live doubt-clearing support." },
    { icon: <Layers className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />, title: "Real Tools, Real Practice", desc: "Train with the newest tools and technologies used by modern tech companies." },
    { icon: <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />, title: "Community Support", desc: "24×7 mentor support, peer discussions, live sessions, and motivation that keeps you going." },
  ];

  return (
    <div
      className="w-full min-h-[650px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${frontimg})` }}
    >
      <div className="bg-white/70 backdrop-blur-sm py-14 md:py-20 min-h-[650px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Heading */}
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-bold text-sm md:text-lg text-purple-600 mb-2 md:mb-3">
              Why Choose Us
            </h2>
            <p className="text-black text-2xl md:text-4xl max-w-xl mx-auto font-bold leading-tight">
              <span className="text-purple-600">Trusted</span> by learners,
              <span className="text-purple-600"> Loved</span> by recruiters.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {features.map((item, index) => (
              <div
                key={index}
                className="
                  bg-white/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg
                  transition-all duration-300 cursor-pointer
                  hover:-translate-y-2 hover:shadow-2xl hover:border-purple-300
                "
              >
                {/* Icon Circle */}
                <div
                  className="
                    w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 md:mb-5 shadow-sm
                    transition-all duration-300
                  "
                >
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 md:mt-16 text-center text-gray-800 text-base md:text-lg font-medium">
            Trusted by learners from{" "}
            <span className="text-purple-700 font-bold">Top Companies</span>
          </div>

        </div>
      </div>
    </div>
  );
}
