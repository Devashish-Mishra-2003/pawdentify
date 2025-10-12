import React from 'react';
import { motion } from 'framer-motion';
import pawIcon from '../assets/icons8-cat-footprint-64.png';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--color-settings-page-bg)" }}
    >
      {/* Bouncing Paw Animation */}
      <motion.div
        className="mb-6"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.img
          src={pawIcon}
          alt="Loading"
          className="w-20 h-20"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: "drop-shadow(0 4px 8px rgba(140, 82, 255, 0.3))"
          }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p 
          className="text-xl font-semibold"
          style={{ color: "var(--color-settings-title)" }}
        >
          {message}
        </p>
      </motion.div>

      {/* Animated Dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#8c52ff" }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
