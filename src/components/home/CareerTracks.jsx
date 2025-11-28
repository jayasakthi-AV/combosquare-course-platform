import IT from "../../assets/IT.jpg";
import placement from "../../assets/placement.png";
import programing from "../../assets/programing.png";
import business from "../../assets/business.png";
import engineering from "../../assets/engineering.png";

export default function CareerTracks() {
  const domainList = [
    {
      title: "Technology & IT",
      img: IT,
      tagline: "Build digital skills for the modern tech world.",
    },
    {
      title: "Programming Fundamentals",
      img: programing,
      tagline: "Start your coding journey with strong basics.",
    },
    {
      title: "Engineering & Automation",
      img: engineering,
      tagline: "Master tools that power real-world systems.",
    },
    {
      title: "Business & Creativity",
      img: business,
      tagline: "Blend strategy with design to create impact.",
    },
    {
      title: "Placements",
      img: placement,
      tagline: "Prepare for interviews and land your dream job.",
    },
  ];

  return (
    <div className="w-full py-14 bg-gradient-to-b from-white to-purple-50/20 ">
      <div className="max-w-7xl mx-auto px-6">

        {/* ⭐Heading */}
        <h2 className="text-lg font-bold text-purple-700 tracking-wide">
          DOMAINS WE OFFER
        </h2>

        <p className="mt-1 mb-12 text-3xl font-extrabold text-gray-900 leading-snug">
          Your roadmap to a <span className="text-purple-600">high-paid tech career</span>
        </p>

        {/* ⭐ Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {domainList.map((domain, i) => (
            <div
              key={i}
              className="group rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 overflow-hidden cursor-pointer"
            >
              {/* Image with Hover Zoom */}
              <div className="overflow-hidden h-40">
                <img
                  src={domain.img}
                  alt={domain.title}
                  className="w-full h-full object-cover rounded-t-xl group-hover:scale-110 transition-all duration-500"
                />
              </div>

              {/* Title Bar with Glow Effect */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center py-3 font-semibold shadow-sm group-hover:from-purple-700 group-hover:to-purple-600 transition">
                {domain.title}
              </div>

              {/* Tagline */}
              <p className="p-3 text-sm text-gray-600 group-hover:text-gray-800 transition">
                {domain.tagline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
