// src/pages/FAQ.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const FAQ = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const faqs = [
    { question: t('faq.questions.whatIs.question'), answer: t('faq.questions.whatIs.answer') },
    { question: t('faq.questions.accuracy.question'), answer: t('faq.questions.accuracy.answer') },
    { question: t('faq.questions.multiplePhotos.question'), answer: t('faq.questions.multiplePhotos.answer') },
    { question: t('faq.questions.formats.question'), answer: t('faq.questions.formats.answer') },
    { question: t('faq.questions.security.question'), answer: t('faq.questions.security.answer') },
  ];

  return (
    <motion.section
      id="faq"
      className="pt-28 pb-16 font-archivo"
      style={{ background: "var(--color-faq-bg)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2
          className="text-4xl md:text-4xl font-alfa text-center mb-12"
          style={{ color: "var(--color-faq-title)" }}
        >
          {t('faq.title')}
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="rounded-2xl shadow-lg p-6 border-2"
              style={{
                backgroundColor: "var(--color-faq-card-bg)",
                borderColor: "var(--color-faq-card-border)",
                boxShadow: "var(--color-faq-card-shadow)",
              }}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3
                className="text-xl mb-3"
                style={{ color: "var(--color-faq-question)" }}
              >
                {faq.question}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: "var(--color-faq-answer)" }}
              >
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p
            className="text-lg mb-4"
            style={{ color: "var(--color-faq-help-text)" }}
          >
            {t('faq.stillNeedHelp')}
          </p>
          <a
            href="#contact"
            className="inline-block font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            style={{
              background: "var(--color-faq-contact-bg)",
              color: "var(--color-faq-contact-text)",
              boxShadow: "var(--color-faq-contact-shadow)",
            }}
          >
            {t('faq.contactUs')}
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FAQ;


