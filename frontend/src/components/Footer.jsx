import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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

const Footer = () => {
  const { t } = useTranslation();

  return (
    <motion.footer
      className="text-white font-archivo py-16 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-footer-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, var(--color-footer-gradient-overlay), var(--color-footer-gradient-overlay), var(--color-footer-gradient-overlay))`,
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
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="flex items-center space-x-3 text-3xl font-archivo font-bold tracking-widest relative"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <span>P</span>

            <motion.img
              src={paw}
              alt="paw"
              className="w-14 h-14"
              style={{ filter: 'brightness(0) invert(1)' }}
              whileHover={{
                rotate: 360,
                scale: 1.15,
              }}
              transition={{ duration: 0.4 }}
            />

            <span>WDENTIFY</span>
          </motion.div>

          <motion.p
            className="text-sm"
            style={{ color: "var(--color-footer-text-muted)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </motion.p>
        </motion.div>

        {/* Navigation links */}
        <motion.div
          className="flex flex-col space-y-3 items-center md:items-start"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <h4 className="text-xl font-alfa mb-2">
            {t('footer.navigation.title')}
          </h4>

          {[
            ['#hero', t('footer.navigation.home')],
            ['#predict', t('footer.navigation.predict')],
          ].map(([href, label], index) => (
            <motion.a
              key={href}
              href={href}
              className="font-bold text-base cursor-pointer relative group"
              style={{ color: "var(--color-footer-link)" }}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(href);
              }}
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.55 + index * 0.08 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
                {label}
              </span>
              
              {/* Animated underline */}
              <span 
                className="absolute bottom-0 left-0 w-full h-0.5 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                style={{ backgroundColor: "var(--color-footer-link-hover)" }}
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div
          className="flex flex-col space-y-3 items-center md:items-start"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h4 className="text-xl font-alfa mb-2">
            {t('footer.contact.title')}
          </h4>

          <motion.a
            href={`mailto:${t('footer.contact.email')}`}
            className="font-bold text-base cursor-pointer relative group"
            style={{ color: "var(--color-footer-link)" }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.82 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
              {t('footer.contact.email')}
            </span>
            
            {/* Animated underline */}
            <span 
              className="absolute bottom-0 left-0 w-full h-0.5 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
              style={{ backgroundColor: "var(--color-footer-link-hover)" }}
            />
          </motion.a>

          <motion.p
            className="font-bold text-base cursor-pointer relative group"
            style={{ color: "var(--color-footer-link)" }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.92 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
              {t('footer.contact.phone')}
            </span>
            
            {/* Animated underline */}
            <span 
              className="absolute bottom-0 left-0 w-full h-0.5 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
              style={{ backgroundColor: "var(--color-footer-link-hover)" }}
            />
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom wave effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: "var(--color-footer-wave-bg)" }}
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
    </motion.footer>
  );
};

export default Footer;



