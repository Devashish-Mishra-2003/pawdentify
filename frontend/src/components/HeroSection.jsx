import React from "react";
import { motion } from "framer-motion";
import heroVideo from "../assets/hero_section_video.mp4"; // preserved
import breedsIcon from "../assets/breeds_icon.png";
import accuracyIcon from "../assets/accuracy_icon.png";
import speedIcon from "../assets/speed_icon.png";

const handleScrollTo = (id) => {
  const element = document.getElementById(id.substring(1));
  if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
};

const cardContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const HeroSection = () => {
  return (
    <motion.section
      id="hero"
      className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Violet overlay tint */}
      <div className="absolute inset-0 bg-[#8c52ff] opacity-30 mix-blend-multiply pointer-events-none z-10"></div>

      {/* Content (moved slightly up to make room for cards) */}
      <div className="relative z-20 max-w-5xl mx-auto w-full px-6 text-center text-white -translate-y-6">
        <motion.h1
          className="font-alfa text-5xl md:text-6xl leading-tight"
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, type: "spring", stiffness: 90, damping: 12 }}
        >
          Man&apos;s best friend
        </motion.h1>

        <motion.div
          className="font-archivo text-lg md:text-2xl mt-6 max-w-2xl mx-auto font-bold"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          <p>
            Get to know your dog the best you can and give them a home they deserve.
            <br />
            <br />
            Our website lets you identify over 100+ breeds of doggos and gives you up to date information about them.
          </p>
        </motion.div>

        {/* Predict button (animation preserved) */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 1.0, type: "spring", stiffness: 120, damping: 10 }}
        >
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("#predict");
            }}
            className="font-alfa text-xl md:text-2xl px-10 py-4 rounded-full shadow-lg transition-all relative overflow-hidden group"
            style={{
              background: "linear-gradient(180deg, #f3e8ff, #e9d5ff)",
              color: "#4b0082",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              maxWidth: "300px",
            }}
            whileHover={{
              scale: 1.08,
              y: -4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              background: "linear-gradient(180deg, #faf5ff, #f3e8ff)",
            }}
            whileTap={{ scale: 0.95, y: -2 }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            }}
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />

            <motion.span
              className="relative z-10"
              animate={{
                textShadow: [
                  "0 0 0px rgba(75,0,130,0.5)",
                  "0 0 10px rgba(75,0,130,0.3)",
                  "0 0 0px rgba(75,0,130,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Predict
            </motion.span>
          </motion.button>
        </motion.div>

        {/* --- Pill cards (increased gap, animated + hover lift) --- */}
        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          variants={cardContainerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Card 1 */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="flex items-center bg-white text-[#8c52ff] font-archivo font-bold px-4 py-2 rounded-full shadow min-w-[160px] hover:shadow-xl transition-shadow"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={breedsIcon} alt="breeds" className="w-full h-full object-contain" />
            </motion.div>
            <div className="text-left">
              <div className="text-sm">120</div>
              <div className="text-xs opacity-80">breeds</div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="flex items-center bg-white text-[#8c52ff] font-archivo font-bold px-4 py-2 rounded-full shadow min-w-[160px] hover:shadow-xl transition-shadow"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <img src={accuracyIcon} alt="accuracy" className="w-full h-full object-contain" />
            </motion.div>
            <div className="text-left">
              <div className="text-sm">89%</div>
              <div className="text-xs opacity-80">accuracy</div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="flex items-center bg-white text-[#8c52ff] font-archivo font-bold px-4 py-2 rounded-full shadow min-w-[160px] hover:shadow-xl transition-shadow"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <img src={speedIcon} alt="speed" className="w-full h-full object-contain" />
            </motion.div>
            <div className="text-left">
              <div className="text-sm">&lt;3s</div>
              <div className="text-xs opacity-80">response</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;




