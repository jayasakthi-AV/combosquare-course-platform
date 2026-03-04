import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FadeOnScroll({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: isMobile ? 0.5 : 0.8,
        ease: "easeOut",
      }}
      viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
    >
      {children}
    </motion.div>
  );
}
