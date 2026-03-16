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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pt-32 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="bg-blob blob-purple top-0 left-0 opacity-5"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="font-handwriting text-3xl text-[#30A7DB] mb-4 block">Common Questions</span>
          <h1 className="text-5xl md:text-7xl text-black dark:text-white mb-6">FAQ</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">Everything you need to know about Pawdentify AI</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bento-card bg-white dark:bg-[#111111] border-gray-100 dark:border-white/10 border-2 p-10 hover:border-[#30A7DB] dark:hover:border-[#30A7DB] transition-all group cursor-pointer"
            >
              <h3 className="text-2xl font-extrabold text-black dark:text-white mb-4 group-hover:text-[#30A7DB] transition-colors">
                {faq.question}
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 bento-card bg-[#111111] text-white p-12 text-center overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-blob blob-blue opacity-20 -right-20 -top-20"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl mb-4 text-white">Still have questions?</h3>
            <p className="text-gray-400 text-xl mb-10 max-w-lg mx-auto">We're here to help! Reach out to our team anytime.</p>
            <a 
              href="mailto:support@pawdentify.ai" 
              className="pill-button bg-white text-black py-5 px-10 text-sm font-bold uppercase tracking-widest inline-block hover:-translate-y-1 transition-transform"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
