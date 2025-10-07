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
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
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
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="flex items-center space-x-3 text-3xl font-archivo font-bold tracking-widest relative"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <span>P</span>

            <motion.img
              src={paw}
              alt="paw"
              className="w-14 h-14"
              style={{ filter: 'brightness(0) invert(1)' }}
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

            <span>WDENTIFY</span>

            {/* subtle moving sheen */}
            <motion.div
              className="absolute inset-0 bg-white/0 pointer-events-none"
              animate={{ x: [-60, 60, -60], opacity: [0, 0.08, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          </motion.div>

          <motion.p
            className="text-sm"
            style={{ color: "var(--color-footer-text-muted)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
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
                `0 0 10px var(--color-footer-heading-glow)`,
                '0 0 20px rgba(255,255,255,0.45)',
                `0 0 10px var(--color-footer-heading-glow)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {t('footer.navigation.title')}
          </motion.h4>

          {[
            ['#hero', t('footer.navigation.home')],
            ['#predict', t('footer.navigation.predict')],
          ].map(([href, label], index) => (
            <motion.a
              key={href}
              href={href}
              className="transition-all duration-300 cursor-pointer relative group"
              style={{ color: "var(--color-footer-link)" }}
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
                color: 'var(--color-footer-link-hover)',
                textShadow: '0 0 8px rgba(196, 181, 253, 0.45)',
              }}
            >
              {label}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 origin-left"
                style={{ backgroundColor: "var(--color-footer-link-hover)" }}
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
                `0 0 10px var(--color-footer-heading-glow)`,
                '0 0 20px rgba(255,255,255,0.45)',
                `0 0 10px var(--color-footer-heading-glow)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {t('footer.contact.title')}
          </motion.h4>

          <motion.a
            href={`mailto:${t('footer.contact.email')}`}
            className="transition-colors duration-300 cursor-pointer"
            style={{ color: "var(--color-footer-link)" }}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.82 }}
            whileHover={{
              scale: 1.04,
              color: 'var(--color-footer-link-hover)',
              textShadow: '0 0 8px rgba(196, 181, 253, 0.45)',
            }}
          >
            {t('footer.contact.email')}
          </motion.a>

          <motion.p
            className="transition-colors duration-300 cursor-pointer"
            style={{ color: "var(--color-footer-link)" }}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.92 }}
            whileHover={{
              scale: 1.04,
              color: 'var(--color-footer-link-hover)',
              textShadow: '0 0 8px rgba(196, 181, 253, 0.45)',
            }}
          >
            {t('footer.contact.phone')}
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

