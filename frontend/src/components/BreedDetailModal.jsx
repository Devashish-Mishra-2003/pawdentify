import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useBreedData } from '../contexts/BreedDataContext';
import breedImagesData from '../data/breed_images.json';
import AccordionCard from './cards/AccordionCard';
import BreedTabs from './BreedTabs';

const TAB_SECTIONS = [
  { key: "physical_traits", label: "breedInfo.tabs.physical" },
  { key: "social_traits", label: "breedInfo.tabs.temperament" },
  { key: "care_grooming", label: "breedInfo.tabs.care" },
  { key: "trainability_exercise", label: "breedInfo.tabs.trainExercise" },
  { key: "lifestyle_suitability", label: "breedInfo.tabs.lifestyle" },
];

const ACCORDION_SECTIONS = [
  { key: "environmental_traits", label: "breedInfo.tabs.environment" },
  { key: "health", label: "breedInfo.tabs.health" },
  { key: "nutrition_requirements", label: "breedInfo.tabs.nutrition" },
];

function extractFunFact(breedEntry, t) {
  if (!breedEntry) return t("breedInfo.noFunFact");
  const fu = breedEntry.fun_unique_facts;
  if (fu) {
    if (typeof fu === "string" && fu.trim()) return fu;
    if (fu.fun_fact && fu.fun_fact.trim()) return fu.fun_fact;
    if (Array.isArray(fu.quick_trivia) && fu.quick_trivia.length) return fu.quick_trivia[0];
  }
  return t("breedInfo.noFunFact");
}

export default function BreedDetailModal({ breedId, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breedData = useBreedData();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(TAB_SECTIONS[0].key);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef(null);

  const ALL_BREEDS = Array.isArray(breedData) ? breedData : (breedData.breeds || []);
  const breedEntry = useMemo(() => {
    return ALL_BREEDS.find((b) => String(b.id) === String(breedId) || Number(b.id) === Number(breedId));
  }, [ALL_BREEDS, breedId]);

  const breedImages = useMemo(() => {
    if (breedImagesData[breedId]) {
      return breedImagesData[breedId].images;
    }
    return [];
  }, [breedId]);

  useEffect(() => {
    if (breedImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % breedImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [breedImages.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowBackToTop(contentRef.current.scrollTop > 300);
      }
    };
    const ref = contentRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderTextCardsFromObject = (obj) => {
    if (!obj) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {Object.entries(obj).map(([key, value]) => {
            if (!value) return null;
            const title = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const text = Array.isArray(value) ? value.join(", ") : (typeof value === "string" ? value : String(value));
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bento-card bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 border-2 p-6"
              >
                <h4 className="text-xs font-bold text-[#30A7DB] mb-2 uppercase tracking-widest">{title}</h4>
                <p className="text-xl text-black dark:text-white font-extrabold leading-tight">{text}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  if (!breedEntry) {
    return (
      <div className="bg-white dark:bg-[#050505] min-h-[400px] flex items-center justify-center p-12 text-center rounded-3xl">
        <div>
          <h2 className="text-3xl font-extrabold text-black dark:text-white mb-4">Finding Friend...</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('breedInfo.noInfoFound')}</p>
        </div>
      </div>
    );
  }

  const funFact = extractFunFact(breedEntry, t);

  return (
    <div 
      ref={contentRef}
      className="relative bg-white dark:bg-[#050505] rounded-[2.5rem] max-h-[90vh] overflow-y-auto no-scrollbar scroll-smooth"
    >
      {/* Hero Header Section */}
      <div className="relative p-8 md:p-12">
        {/* Close Button Floating */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-30 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-100 dark:border-white/10 flex items-center justify-center text-black dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Image Part */}
          <div className="relative w-full md:w-[400px] flex-shrink-0">
             <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-gray-50 dark:border-white/5 bg-gray-100 dark:bg-white/5">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={breedImages[currentImageIndex] || breedEntry.image_url}
                    alt={breedEntry.breed}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
                
                {/* Image Dots */}
                {breedImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {breedImages.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} 
                      />
                    ))}
                  </div>
                )}
             </div>
             
             {/* Decorative blob behind image */}
             <div className="bg-blob blob-purple opacity-20 -left-10 -bottom-10 scale-75"></div>
          </div>

          {/* Info Part */}
          <div className="flex-1 text-center md:text-left">
            <span className="font-handwriting text-4xl text-[#30A7DB] mb-4 block">Ancient Heritage</span>
            <h2 className="text-5xl md:text-7xl font-extrabold text-black dark:text-white mb-8 tracking-tighter leading-[0.9]">
              {breedEntry.breed || breedEntry.name}
            </h2>
            <div className="bento-card border-0 bg-gray-50 dark:bg-white/5 p-8 shadow-inner relative overflow-hidden group">
               <div className="relative z-10">
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
                    "{funFact}"
                  </p>
               </div>
               <div className="absolute -right-4 -bottom-4 text-8xl font-black text-black/5 dark:text-white/5 select-none transition-transform group-hover:scale-110 duration-700">“</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Details Section */}
      <div className="px-8 md:px-12 pb-16">
        <div className="mb-12">
          <BreedTabs activeSection={activeTab} onTabClick={(k) => setActiveTab(k)} />
        </div>

        <div className="min-h-[300px]">
          {TAB_SECTIONS.map(({ key }) => activeTab === key && (
             <motion.div 
               key={key}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.4 }}
             >
               {renderTextCardsFromObject(breedEntry[key])}
             </motion.div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
           <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-8 px-2">Essential Knowledge</h3>
              {ACCORDION_SECTIONS.map(({ key, label }) => (
                <AccordionCard key={key} title={t(label)} data={breedEntry[key]} />
              ))}
           </div>
           
           <div className="pt-16">
              <motion.button
                onClick={() => navigate("/know-more", { state: { knowMoreData: breedEntry.know_more, breedEntry } })}
                whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bento-card bg-white dark:bg-[#111111] border-2 border-gray-100 dark:border-white/10 p-10 flex flex-col justify-between group transition-all hover:border-[#30A7DB] relative overflow-hidden h-full min-h-[300px]"
              >
                 <div className="bg-blob blob-blue opacity-10 -right-20 -top-20"></div>
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#30A7DB] mb-4 block">The Full Picture</span>
                      <h3 className="text-4xl md:text-5xl font-black text-black dark:text-white leading-tight mb-8">
                        Read Full <br/> Life Story
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold uppercase tracking-widest text-[#8c52ff]">Detailed Guide &rarr;</span>
                       <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#30A7DB] group-hover:bg-[#30A7DB] group-hover:text-white transition-all transform group-hover:rotate-45">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                       </div>
                    </div>
                 </div>
              </motion.button>
           </div>
        </div>
      </div>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#30A7DB] text-white shadow-2xl flex items-center justify-center z-50 hover:-translate-y-2 transition-transform"
            onClick={scrollToTop}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
