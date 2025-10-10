import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import heroVideo from "../assets/hero_section_video.mp4";
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
  const { t } = useTranslation();

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
      <div
        className="absolute inset-0 mix-blend-multiply pointer-events-none z-10"
        style={{
          backgroundColor: "var(--color-hero-overlay)",
          opacity: "var(--color-hero-overlay-opacity)",
        }}
      ></div>

      {/* Content */}
      <div
        className="relative z-20 max-w-5xl mx-auto w-full px-6 text-center -translate-y-6"
        style={{ color: "var(--color-hero-text)" }}
      >
        <motion.h1
          className="font-alfa text-5xl md:text-6xl leading-tight"
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, type: "spring", stiffness: 90, damping: 12 }}
        >
          {t("hero.title")}
        </motion.h1>

        <motion.div
          className="font-archivo text-lg md:text-2xl mt-6 max-w-2xl mx-auto font-bold"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          <p>
            {t("hero.description.part1")}
            <br />
            <br />
            {t("hero.description.part2")}
          </p>
        </motion.div>

        {/* Predict button */}
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
              background: "var(--color-hero-button-bg)",
              color: "var(--color-hero-button-text)",
              boxShadow: "var(--color-hero-button-shadow)",
              maxWidth: "300px",
            }}
            whileHover={{
              scale: 1.08,
              y: -4,
              boxShadow: "var(--color-hero-button-hover-shadow)",
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
              {t("hero.predictButton")}
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Pill cards */}
        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          variants={cardContainerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Card 1 - Breeds */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="flex items-center font-archivo font-bold px-4 py-2 rounded-full shadow min-w-[160px] transition-shadow"
            style={{
              backgroundColor: "var(--color-hero-card-bg)",
              color: "var(--color-hero-card-text)",
              boxShadow: "var(--color-hero-card-shadow)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden">
              <img src={breedsIcon} alt={t("hero.cards.breeds")} className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <div className="text-sm">120</div>
              <div className="text-xs opacity-80">{t("hero.cards.breeds")}</div>
            </div>
          </motion.div>

          {/* Card 2 - Accuracy */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="flex items-center font-archivo font-bold px-4 py-2 rounded-full shadow min-w-[160px] transition-shadow"
            style={{
              backgroundColor: "var(--color-hero-card-bg)",
              color: "var(--color-hero-card-text)",
              boxShadow: "var(--color-hero-card-shadow)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden">
              <img src={accuracyIcon} alt={t("hero.cards.accuracy")} className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <div className="text-sm">89%</div>
              <div className="text-xs opacity-80">{t("hero.cards.accuracy")}</div>
            </div>
          </motion.div>

          {/* Card 3 - Response */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            className="flex items-center font-archivo font-bold px-4 py-2 rounded-full shadow min-w-[160px] transition-shadow"
            style={{
              backgroundColor: "var(--color-hero-card-bg)",
              color: "var(--color-hero-card-text)",
              boxShadow: "var(--color-hero-card-shadow)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden">
              <img src={speedIcon} alt={t("hero.cards.response")} className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <div className="text-sm">&lt;3s</div>
              <div className="text-xs opacity-80">{t("hero.cards.response")}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;





