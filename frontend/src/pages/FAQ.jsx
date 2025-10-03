// src/pages/FAQ.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const FAQ = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Always scroll to top when FAQ page loads
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const faqs = [
    { question: t('faq1Question'), answer: t('faq1Answer') },
    { question: t('faq2Question'), answer: t('faq2Answer') },
    { question: t('faq3Question'), answer: t('faq3Answer') },
    { question: t('faq4Question'), answer: t('faq4Answer') },
    { question: t('faq5Question'), answer: t('faq5Answer') },
  ];

  return (
    <motion.section
      id="faq"
      className="pt-28 pb-16 bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 font-archivo"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-alfa text-center mb-12 text-gray-900">
          {t('faqTitle')}
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-purple-800 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg text-gray-600 mb-4">{t('stillNeedHelp')}</p>
          <a
            href="#contact"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {t('contactUs')}
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FAQ;

