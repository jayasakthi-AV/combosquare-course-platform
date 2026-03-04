import { useParams } from "react-router-dom";
import { domainData } from "../data/domainData";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/home/Footer";
import { motion } from "framer-motion";

export default function DomainPage() {
  const { domainId } = useParams();
  const domain = domainData[domainId];

  if (!domain) {
    return (
      <div className="pt-32 text-center text-xl md:text-2xl font-semibold text-red-600">
        Domain Not Found
      </div>
    );
  }

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [domainId]);

  
  const [typedTitle, setTypedTitle] = useState("");
  useEffect(() => {
    let i = 0;
    setTypedTitle("");
    const interval = setInterval(() => {
      setTypedTitle(domain.title.slice(0, i));
      i++;
      if (i > domain.title.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, [domainId]);

  const coursesRef = useRef(null);
  const scrollToCourses = () =>
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pt-20 md:pt-24 bg-gray-50"
    >
      
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-900 to-indigo-700 text-white py-14 md:py-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400/30 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-400/30 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-5 md:px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-300" />
              <p className="uppercase tracking-wider text-purple-200 text-xs md:text-sm font-semibold">
                Premium Learning Track
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold min-h-[80px]">
              {typedTitle}
              <span className="ml-1 border-r-4 border-yellow-300 animate-pulse" />
            </h1>

            <p className="mt-4 md:mt-5 text-base md:text-lg text-purple-100 max-w-xl">
              {domain.subtitle}
            </p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              className="grid gap-4 mt-6 md:mt-8"
            >
              {domain.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02 }}
                  className="flex gap-4 bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-lg"
                >
                  <CheckCircle className="text-yellow-300 shrink-0" />
                  <p className="text-purple-100 text-sm md:text-base">{h}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.07, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={scrollToCourses}
              className="mt-8 px-8 py-3 bg-white text-purple-700 font-bold rounded-full flex items-center gap-2 shadow-xl"
            >
              Explore Courses <ArrowRight />
            </motion.button>
          </div>

         
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center md:justify-end"
          >
            <div className="p-[3px] rounded-3xl bg-gradient-to-r from-purple-300 to-purple-500">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4">
                <img
                  src={domain.heroImg}
                  alt={domain.title}
                  className="w-full max-w-[320px] sm:max-w-[360px] rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

 
      <section
        ref={coursesRef}
        className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-20"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 md:mb-12"
        >
          Explore Courses with{" "}
          <span className="text-purple-600">placement guidance</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {domain.courses.map((c, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border hover:shadow-2xl transition-all"
            >
              <div className="relative">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="h-44 md:h-48 w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-purple-700 text-white text-xs px-4 py-1 rounded-full shadow-md">
                  {c.level}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {c.title}
                </h3>

                <p className="text-gray-500 mt-2">{c.duration}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-900 transition"
                >
                  Know More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

     
      <section className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 md:mb-12">
          Learning Journey
        </h2>

        <div className="relative pl-6 md:pl-10 border-l-4 border-purple-600 space-y-10 md:space-y-12">
          {domain.learningPath.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-6 shadow-xl"
            >
              <span className="absolute -left-7 md:-left-10 top-6 w-8 md:w-10 h-8 md:h-10 bg-white border-2 border-purple-600 rounded-full flex items-center justify-center font-bold text-purple-700 shadow-md">
                {i + 1}
              </span>
              <p className="text-gray-700 text-sm md:text-base">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 md:mb-12">
          Tools You Will Use
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {domain.tools.map((tool, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-4 md:p-6 text-center font-semibold text-sm md:text-base text-gray-800 hover:text-purple-700 transition"
            >
              {tool}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#2b1055] via-[#3a1c71] to-[#1e1b4b]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Build your future in{" "}
                <span className="text-purple-300">{domain.title}</span>
              </h2>

              <p className="mt-4 md:mt-5 text-base md:text-lg text-purple-100 max-w-xl">
                Learn with a structured roadmap, real-world projects, and expert mentorship.
              </p>

              <motion.button
                onClick={scrollToCourses}
                className="mt-8 px-10 py-4 bg-white text-purple-800 font-bold rounded-full shadow-xl"
              >
                Explore Courses →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
