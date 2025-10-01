import React from 'react';
import { motion } from 'framer-motion';

const InfoCard = ({ title, content }) => (
  <motion.div
    className="p-8 bg-white rounded-3xl shadow-xl flex-1 text-center font-archivo relative overflow-hidden group min-w-[280px] max-w-[320px]"
    style={{
      background: 'linear-gradient(135deg, #f3e8ff, #faf5ff)',
      border: '2px solid rgba(147, 51, 234, 0.1)',
    }}
    whileHover={{
      scale: 1.05,
      y: -8,
      boxShadow: '0 25px 50px rgba(147, 51, 234, 0.15)',
      background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
    }}
    transition={{
      duration: 0.3,
      type: 'spring',
      stiffness: 300,
    }}
  >
    {/* Animated background pattern (decorative) */}
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle at 30% 30%, #8b5cf6 0%, transparent 50%),
                         radial-gradient(circle at 70% 70%, #a855f7 0%, transparent 50%)`,
      }}
      // subtle, very slow movement to avoid heavy repaints
      animate={{ transform: ['translate(0,0)', 'translate(6px,6px)', 'translate(0,0)'] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    />

    {/* Floating particles (decorative) */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full opacity-40"
          style={{
            left: `${20 + i * 30}%`,
            top: `${25 + i * 20}%`,
          }}
          animate={{
            y: [-8, 8, -8],
            x: [-4, 4, -4],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>

    {/* Shine effect on hover */}
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 pointer-events-none"
      initial={{ x: '-100%' }}
      whileHover={{ x: '100%' }}
      transition={{ duration: 0.6 }}
    />

    {/* Title with slow pulsing glow */}
    <motion.h4
      className="text-xl font-alfa mb-4 text-purple-800 relative z-10 font-bold"
      animate={{
        textShadow: [
          '0 0 10px rgba(147, 51, 234, 0.3)',
          '0 0 20px rgba(147, 51, 234, 0.5)',
          '0 0 10px rgba(147, 51, 234, 0.3)',
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {title}
    </motion.h4>

    {/* Content */}
    <motion.p
      className="text-sm text-gray-700 leading-relaxed relative z-10"
      initial={{ opacity: 0.9 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.p>

    {/* Decorative corner elements (decorative only) */}
    <motion.div
      aria-hidden="true"
      className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-purple-300 opacity-30 pointer-events-none"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      aria-hidden="true"
      className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-purple-300 opacity-30 pointer-events-none"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
  </motion.div>
);

export default InfoCard;
