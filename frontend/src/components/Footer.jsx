import React from 'react';
import { motion } from 'framer-motion';
import paw from '../assets/icons8-cat-footprint-64.png';

const handleScrollTo = (id) => {
  const element = document.getElementById(id.substring(1));
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80,
      behavior: 'smooth',
    });
  }
};

const Footer = () => (
  <motion.footer
    className="bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 text-white font-archivo py-16 relative overflow-hidden"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    {/* Background decorative elements (decorative only) */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white opacity-5"
          style={{
            width: `${30 + i * 10}px`,
            height: `${30 + i * 10}px`,
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-8, 8, -8],
            x: [-4, 4, -4],
            opacity: [0.04, 0.12, 0.04],
          }}
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </div>

    {/* Animated gradient overlay — use translate to avoid animating backgroundPosition */}
    <motion.div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        background:
          'linear-gradient(45deg, rgba(147, 51, 234, 0.28), rgba(79, 70, 229, 0.28), rgba(147, 51, 234, 0.28))',
      }}
      animate={{ x: [0, 30, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    />

    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start space-y-12 md:space-y-0 relative z-10">
      {/* Logo + copyright */}
      <motion.div
        className="flex flex-col space-y-4 items-center md:items-start"
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="flex items-center space-x-3 text-4xl font-alfa tracking-widest relative"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <span>P</span>

          <motion.img
            src={paw}
            alt="paw"
            className="w-14 h-14"
            animate={{
              rotate: [-6, 6, -6],
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{
              rotate: 360,
              scale: 1.15,
            }}
          />

          <span>WS</span>

          {/* subtle moving sheen */}
          <motion.div
            className="absolute inset-0 bg-white/0 pointer-events-none"
            animate={{ x: [-60, 60, -60], opacity: [0, 0.08, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.p
          className="text-sm text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          &copy; {new Date().getFullYear()} PAWS. All rights reserved.
        </motion.p>
      </motion.div>

      {/* Navigation links */}
      <motion.div
        className="flex flex-col space-y-3 items-center md:items-start"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.35 }}
      >
        <motion.h4
          className="text-xl font-alfa mb-2 relative"
          animate={{
            textShadow: [
              '0 0 10px rgba(255,255,255,0.25)',
              '0 0 20px rgba(255,255,255,0.45)',
              '0 0 10px rgba(255,255,255,0.25)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Navigation
        </motion.h4>

        {[
          ['#hero', 'Home'],
          ['#predict', 'Predict'],
          ['#info', 'Info'],
        ].map(([href, label], index) => (
          <motion.a
            key={href}
            href={href}
            className="text-gray-300 hover:text-purple-300 transition-all duration-300 cursor-pointer relative group"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo(href);
            }}
            initial={{ x: 16, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 + index * 0.08 }}
            whileHover={{
              x: 6,
              color: '#c4b5fd',
              textShadow: '0 0 8px rgba(196, 181, 253, 0.45)',
            }}
          >
            {label}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-purple-300 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.28 }}
            />
          </motion.a>
        ))}
      </motion.div>

      {/* Contact */}
      <motion.div
        className="flex flex-col space-y-3 items-center md:items-start"
        initial={{ x: 40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.h4
          className="text-xl font-alfa mb-2 relative"
          animate={{
            textShadow: [
              '0 0 10px rgba(255,255,255,0.25)',
              '0 0 20px rgba(255,255,255,0.45)',
              '0 0 10px rgba(255,255,255,0.25)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Contact
        </motion.h4>

        <motion.p
          className="text-gray-300 hover:text-purple-300 transition-colors duration-300 cursor-pointer"
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.82 }}
          whileHover={{
            scale: 1.04,
            textShadow: '0 0 8px rgba(196, 181, 253, 0.45)',
          }}
        >
          support@paws.com
        </motion.p>

        <motion.p
          className="text-gray-300 hover:text-purple-300 transition-colors duration-300 cursor-pointer"
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.92 }}
          whileHover={{
            scale: 1.04,
            textShadow: '0 0 8px rgba(196, 181, 253, 0.45)',
          }}
        >
          +1 (555) 123-4567
        </motion.p>
      </motion.div>
    </div>

    {/* Bottom wave effect — now animating transform for safety */}
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 pointer-events-none"
      animate={{ x: [0, 40, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    />
  </motion.footer>
);

export default Footer;
