// src/components/PredictionGuidelines.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckImage, CrossImage } from "./icons";

// gallery imports (do)
import do1 from "../assets/do_photos/1.jpg";
import do2 from "../assets/do_photos/2.jpg";
import do3 from "../assets/do_photos/3.jpg";

// gallery imports (dont)
import dont1 from "../assets/dont_photos/1.jpg";
import dont2 from "../assets/dont_photos/2.jpg";
import dont3 from "../assets/dont_photos/3.jpg";

const GALLERY_INTERVAL = 2500;

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const PredictionGuidelines = () => {
  const { t } = useTranslation();
  const [doIndex, setDoIndex] = useState(0);
  const [dontIndex, setDontIndex] = useState(0);

  const doImages = [do1, do2, do3];
  const dontImages = [dont1, dont2, dont3];

  useEffect(() => {
    const a = setInterval(() => setDoIndex((i) => (i + 1) % doImages.length), GALLERY_INTERVAL);
    const b = setInterval(
      () => setDontIndex((i) => (i + 1) % dontImages.length),
      GALLERY_INTERVAL + 300
    );
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const doItems = [
    t("guidelines.dos.items.clearPhoto"),
    t("guidelines.dos.items.goodLighting"),
    t("guidelines.dos.items.singleDog"),
    t("guidelines.dos.items.frontView")
  ];

  const dontItems = [
    t("guidelines.donts.items.blurry"),
    t("guidelines.donts.items.obstructed"),
    t("guidelines.donts.items.multipleDogs"),
    t("guidelines.donts.items.distantShots")
  ];

  return (
    <motion.section
      id="guidelines"
      className="py-20 font-archivo relative overflow-hidden"
      style={{ background: "var(--color-guidelines-bg)" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              background: "var(--color-guidelines-decorative-do)",
              width: `${40 + i * 15}px`,
              height: `${40 + i * 15}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5], rotate: [0, 180, 360] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.h2
          className="text-center text-4xl font-alfa mb-12 relative"
          style={{ color: "var(--color-guidelines-title)" }}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 20px rgba(0,0,0,0.1)",
                "0 0 30px rgba(0,0,0,0.2)",
                "0 0 20px rgba(0,0,0,0.1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {t("guidelines.title")}
          </motion.span>
        </motion.h2>

        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Do's Card */}
          <motion.div
            className="flex-1 p-0 border-2 rounded-3xl shadow-xl relative overflow-hidden group flex items-stretch"
            style={{
              backgroundColor: "var(--color-do-card-bg)",
              borderColor: "var(--color-do-card-border)",
              boxShadow: "var(--color-do-card-shadow)",
            }}
            initial={{ x: -100, opacity: 0, scale: 0.9 }}
            whileInView={{ x: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "var(--color-do-card-hover-shadow)" }}
          >
            <div className="flex flex-col md:flex-row items-stretch w-full">
              {/* Gallery column */}
              <div className="w-full md:w-1/3 flex-shrink-0 flex items-stretch">
                <div className="w-full flex items-center justify-center overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                  <div className="w-full h-40 md:h-full">
                    <img
                      src={doImages[doIndex]}
                      alt={`${t("guidelines.dos.title")}-${doIndex + 1}`}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "5 / 7" }}
                    />
                  </div>
                </div>
              </div>

              {/* Text column */}
              <div className="flex-1 p-6 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-tr-3xl rounded-br-3xl"
                  style={{ background: "var(--color-do-card-gradient)" }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-30"
                      style={{
                        backgroundColor: "var(--color-do-particle)",
                        left: `${10 + i * 20}%`,
                        top: `${20 + i * 15}%`,
                      }}
                      animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>

                <motion.h3
                  className="text-2xl font-alfa mb-6 flex items-center space-x-3 relative z-10"
                  style={{ color: "var(--color-do-title)" }}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
                    <CheckImage className="w-8 h-8" />
                  </motion.div>
                  <span>{t("guidelines.dos.title")}</span>
                </motion.h3>

                <ul className="space-y-4 text-lg font-archivo relative z-10" style={{ color: "var(--color-do-text)" }}>
                  {doItems.map((item, index) => (
                    <motion.li
                      key={item}
                      className="flex items-start space-x-3 group/item"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div whileHover={{ scale: 1.3, rotate: 15 }} transition={{ duration: 0.2 }}>
                        <CheckImage className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: "var(--color-do-icon)" }} />
                      </motion.div>
                      <motion.span
                        className="transition-colors duration-200"
                        style={{ color: "inherit" }}
                        whileHover={{ color: "var(--color-do-hover-text)" }}
                      >
                        {item}
                      </motion.span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Don'ts Card */}
          <motion.div
            className="flex-1 p-0 border-2 rounded-3xl shadow-xl relative overflow-hidden group flex items-stretch"
            style={{
              backgroundColor: "var(--color-dont-card-bg)",
              borderColor: "var(--color-dont-card-border)",
              boxShadow: "var(--color-dont-card-shadow)",
            }}
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            whileInView={{ x: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "var(--color-dont-card-hover-shadow)" }}
          >
            <div className="flex flex-col md:flex-row items-stretch w-full">
              {/* Text column */}
              <div className="flex-1 p-6 relative overflow-hidden order-2 md:order-1">
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-tl-3xl rounded-bl-3xl"
                  style={{ background: "var(--color-dont-card-gradient)" }}
                  transition={{ duration: 0.3 }}
                />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-30"
                      style={{
                        backgroundColor: "var(--color-dont-particle)",
                        left: `${10 + i * 20}%`,
                        top: `${20 + i * 15}%`,
                      }}
                      animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>

                <motion.h3
                  className="text-2xl font-alfa mb-6 flex items-center space-x-3 relative z-10"
                  style={{ color: "var(--color-dont-title)" }}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
                    <CrossImage className="w-8 h-8" />
                  </motion.div>
                  <span>{t("guidelines.donts.title")}</span>
                </motion.h3>

                <ul className="space-y-4 text-lg font-archivo relative z-10" style={{ color: "var(--color-dont-text)" }}>
                  {dontItems.map((item, index) => (
                    <motion.li
                      key={item}
                      className="flex items-start space-x-3 group/item"
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ x: -5 }}
                    >
                      <motion.div whileHover={{ scale: 1.3, rotate: -15 }} transition={{ duration: 0.2 }}>
                        <CrossImage className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: "var(--color-dont-icon)" }} />
                      </motion.div>
                      <motion.span
                        className="transition-colors duration-200"
                        style={{ color: "inherit" }}
                        whileHover={{ color: "var(--color-dont-hover-text)" }}
                      >
                        {item}
                      </motion.span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Gallery column */}
              <div className="w-full md:w-1/3 flex-shrink-0 flex items-stretch order-1 md:order-2">
                <div className="w-full flex items-center justify-center overflow-hidden rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none">
                  <div className="w-full h-40 md:h-full">
                    <img
                      src={dontImages[dontIndex]}
                      alt={`${t("guidelines.donts.title")}-${dontIndex + 1}`}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "5 / 7" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default PredictionGuidelines;





