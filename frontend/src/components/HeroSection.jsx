import React from 'react';
import { motion } from 'framer-motion';
import dogBg from '../assets/hero_bg.png'; // adjust path if needed

const handleScrollTo = (id) => {
  const element = document.getElementById(id.substring(1));
  if (element) {
    window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  }
};

const HeroSection = () => {
  return (
    <motion.section
      id="hero"
      className="min-h-screen pt-20 flex items-center overflow-hidden relative"
      style={{
        backgroundColor: '#8c52ff',
        backgroundImage: `url(${dogBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'auto 85%',
        backgroundPosition: 'left center',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(75, 0, 130, 0.4) 50%, rgba(138, 43, 226, 0.3) 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-5"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left column left empty for background dog */}
          <motion.div 
            className="hidden md:block"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />

          {/* Right column: Text */}
          <motion.div 
            className="flex flex-col items-center md:items-start text-white relative"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 border-2 border-white opacity-20 rounded-full"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute -bottom-12 -left-6 w-16 h-16 border border-white opacity-10 rounded-full"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: -360 }}
              transition={{ duration: 2.5, delay: 2, ease: "easeOut" }}
            />

            {/* Title with enhanced animations */}
            <motion.h1 
              className="font-alfa text-6xl md:text-6xl leading-tight text-center md:text-left relative"
              initial={{ y: 80, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 12
              }}
            >
              <motion.span
                className="inline-block"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 40px rgba(255,255,255,0.3)",
                    "0 0 20px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Man&apos;s best friend
              </motion.span>
            </motion.h1>

            {/* Body text with staggered word animation */}
            <motion.div
              className="font-archivo text-lg md:text-2xl mt-6 text-center md:text-left max-w-lg font-bold"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 1,
                type: "spring",
                stiffness: 80
              }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                Get to know your dog the best you can and give them a home they deserve.
                <br />
                <br/>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                >
                  Our website lets you identify over 100+ breeds of doggos and gives you up to date information about them.
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Enhanced Predict button */}
            <motion.div 
              className="mt-10 max-w-lg md:w-auto flex justify-center md:justify-start font-bold"
              initial={{ y: 60, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 1.8,
                type: "spring",
                stiffness: 120,
                damping: 10
              }}
            >
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('#predict');
                }}
                className="font-alfa text-xl md:text-2xl px-10 py-4 rounded-full shadow-lg transition-all relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(180deg, #f3e8ff, #e9d5ff)',
                  color: '#4b0082',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  maxWidth: '300px',
                }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(180deg, #faf5ff, #f3e8ff)'
                }}
                whileTap={{ 
                  scale: 0.95,
                  y: -2
                }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Button text with subtle animation */}
                <motion.span
                  className="relative z-10"
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(75,0,130,0.5)",
                      "0 0 10px rgba(75,0,130,0.3)",
                      "0 0 0px rgba(75,0,130,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Predict
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced floating particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1.5 }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${15 + i * 7}%`,
              top: `${20 + (i % 4) * 15}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Subtle pulse effect at the bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        animate={{
          scaleX: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.section>
  );
};

export default HeroSection;