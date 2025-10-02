// src/components/PredictionGuidelines.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckImage, CrossImage } from "./icons";

// gallery imports (do)
import do1 from "../assets/do_photos/1.jpg";
import do2 from "../assets/do_photos/2.jpg";
import do3 from "../assets/do_photos/3.jpg";

// gallery imports (dont)
import dont1 from "../assets/dont_photos/1.jpg";
import dont2 from "../assets/dont_photos/2.jpg";
import dont3 from "../assets/dont_photos/3.jpg";

const GALLERY_INTERVAL = 2500; // ms

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const PredictionGuidelines = () => {
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
  }, []); // run once

  return (
    <motion.section
      id="guidelines"
      className="py-20 bg-gradient-to-br from-gray-50 to-white font-archivo relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements (kept) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-green-100 to-red-100 opacity-20"
            style={{
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
          className="text-center text-4xl font-alfa mb-12 text-gray-800 relative"
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
            Prediction Guidelines
          </motion.span>
        </motion.h2>

        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Do's Card (with left-side gallery) */}
          <motion.div
            className="flex-1 p-0 border-2 border-green-300/50 bg-white rounded-3xl shadow-xl relative overflow-hidden group flex items-stretch"
            initial={{ x: -100, opacity: 0, scale: 0.9 }}
            whileInView={{ x: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "0 25px 50px rgba(34, 197, 94, 0.15)" }}
          >
            {/* Gallery + content layout */}
            <div className="flex flex-col md:flex-row items-stretch w-full">
              {/* Gallery column (left on md+, top on mobile) */}
              <div className="w-full md:w-1/3 flex-shrink-0 flex items-stretch">
                <div className="w-full flex items-center justify-center overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                  {/* Desktop: gallery matches card height; Mobile: fixed shorter height */}
                  <div className="w-full h-40 md:h-full">
                    <img
                      src={doImages[doIndex]}
                      alt={`do-${doIndex + 1}`}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "5 / 7" }}
                    />
                  </div>
                </div>
              </div>

              {/* Text column (right on md+, bottom on mobile) */}
              <div className="flex-1 p-6 relative overflow-hidden">
                {/* Animated background gradient (kept) */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 rounded-3xl"
                  transition={{ duration: 0.3 }}
                />

                {/* Floating particles (kept) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-green-300 rounded-full opacity-30"
                      style={{ left: `${10 + i * 20}%`, top: `${20 + i * 15}%` }}
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
                  className="text-2xl font-alfa text-green-700 mb-6 flex items-center space-x-3 relative z-10"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
                    <CheckImage className="w-8 h-8" />
                  </motion.div>
                  <span>Do's</span>
                </motion.h3>

                <ul className="space-y-4 text-lg font-archivo text-gray-700 relative z-10">
                  {["Clear, front-facing photo", "Good natural lighting", "Only one dog", "Entire dog visible"].map(
                    (item, index) => (
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
                          <CheckImage className="w-6 h-6 mt-1 flex-shrink-0 text-green-600" />
                        </motion.div>
                        <motion.span className="group-hover/item:text-green-800 transition-colors duration-200">
                          {item}
                        </motion.span>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Don'ts Card (with right-side gallery) */}
          <motion.div
            className="flex-1 p-0 border-2 border-red-300/50 bg-white rounded-3xl shadow-xl relative overflow-hidden group flex items-stretch"
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            whileInView={{ x: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "0 25px 50px rgba(239, 68, 68, 0.15)" }}
          >
            {/* Layout: text top on mobile / left on md+, gallery bottom on mobile / right on md+ */}
            <div className="flex flex-col md:flex-row items-stretch w-full">
              {/* Text column (left on md+, top on mobile) */}
              <div className="flex-1 p-6 relative overflow-hidden order-2 md:order-1">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-0 group-hover:opacity-100 rounded-3xl"
                  transition={{ duration: 0.3 }}
                />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-red-300 rounded-full opacity-30"
                      style={{ left: `${10 + i * 20}%`, top: `${20 + i * 15}%` }}
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
                  className="text-2xl font-alfa text-red-700 mb-6 flex items-center space-x-3 relative z-10"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
                    <CrossImage className="w-8 h-8" />
                  </motion.div>
                  <span>Don'ts</span>
                </motion.h3>

                <ul className="space-y-4 text-lg font-archivo text-gray-700 relative z-10">
                  {["Blurry, Dark photos", "Dog obscured", "Multiple dogs", "Distant/angled shots"].map(
                    (item, index) => (
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
                          <CrossImage className="w-6 h-6 mt-1 flex-shrink-0 text-red-600" />
                        </motion.div>
                        <motion.span className="group-hover/item:text-red-800 transition-colors duration-200">
                          {item}
                        </motion.span>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>

              {/* Gallery column (right on md+, bottom on mobile) */}
              <div className="w-full md:w-1/3 flex-shrink-0 flex items-stretch order-1 md:order-2">
                <div className="w-full flex items-center justify-center overflow-hidden rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none">
                  <div className="w-full h-40 md:h-full">
                    <img
                      src={dontImages[dontIndex]}
                      alt={`dont-${dontIndex + 1}`}
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




