import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import BREEDS_JSON from '../pawdentify_final_corrected.json';
import breedImagesData from '../data/breed_images.json';
import TextCard from './cards/TextCard';
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
  { key: "environmental_traits", label: "breedInfo.tabs.environment", icon: "🏠" },
  { key: "health", label: "breedInfo.tabs.health", icon: "🩺" },
  { key: "nutrition_requirements", label: "breedInfo.tabs.nutrition", icon: "🍽️" },
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
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(TAB_SECTIONS[0].key);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef(null);
  
  const ALL_BREEDS = Array.isArray(BREEDS_JSON) ? BREEDS_JSON : (BREEDS_JSON.breeds || []);
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
    const handleScroll = (e) => {
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
        <AnimatePresence>
          {Object.entries(obj).map(([key, value]) => {
            if (!value) return null;
            const title = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const text = Array.isArray(value) ? value.join(", ") : (typeof value === "string" ? value : String(value));
            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <TextCard title={title} text={text} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  if (!breedEntry) {
    return (
      <div 
        className="relative rounded-2xl p-8 breed-modal-scrollbar"
        style={{ 
          backgroundColor: 'var(--color-breed-info-bg)'
        }}
      >
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-3xl">
            <motion.button
              onClick={onClose}
              className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg"
              style={{
                backgroundColor: '#f3e8ff',
                color: '#8c52ff',
                border: '2px solid #8c52ff',
                zIndex: 100
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: '#ef4444',
                color: '#fff',
                borderColor: '#ef4444'
              }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl" style={{ color: 'var(--color-text-primary)' }}>
            {t('breedInfo.noInfoFound')}
          </p>
        </div>
      </div>
    );
  }

  const funFact = extractFunFact(breedEntry, t);

  return (
    <div 
      ref={contentRef}
      className="relative rounded-2xl max-h-[90vh] breed-modal-scrollbar"
      style={{ 
        backgroundColor: 'var(--color-breed-info-bg)',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div className="p-8">
        {breedImages.length > 0 && (
          <div className="flex justify-center mb-8 relative">
            <div className="relative w-full max-w-3xl">
              {/* Close Button with subtle violet background */}
              <motion.button
                onClick={onClose}
                className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg"
                style={{
                  backgroundColor: '#f3e8ff',
                  color: '#8c52ff',
                  border: '2px solid #8c52ff',
                  zIndex: 100
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  borderColor: '#ef4444'
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Image container */}
              <div className="relative w-full h-[28rem] rounded-2xl overflow-hidden shadow-lg">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentImageIndex}
                    src={breedImages[currentImageIndex]}
                    alt={breedEntry.breed || breedEntry.name}
                    className="w-full h-full object-cover absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {breedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {breedImages.map((_, index) => (
                      <motion.div
                        key={index}
                        className="rounded-full"
                        style={{
                          backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                        }}
                        animate={{
                          width: index === currentImageIndex ? '24px' : '8px',
                          height: '8px'
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-[1]" />
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-4xl font-alfa" style={{ color: "var(--color-breed-title)" }}>
            {breedEntry.breed || breedEntry.name}
          </h2>
        </div>

        <div className="mb-8">
          <p className="text-lg font-archivo font-semibold text-center" style={{ color: "var(--color-breed-fun-fact)" }}>
            {funFact}
          </p>
        </div>

        <BreedTabs activeSection={activeTab} onTabClick={(k) => setActiveTab(k)} />

        <div className="mt-6">
          {TAB_SECTIONS.map(
            ({ key }) =>
              activeTab === key && (
                <div key={key}>
                  {renderTextCardsFromObject(breedEntry[key])}
                </div>
              )
          )}
        </div>

        <div className="mt-12 space-y-6">
          {ACCORDION_SECTIONS.map(({ key, label, icon }) => (
            <AccordionCard
              key={key}
              title={t(label)}
              icon={icon}
              data={breedEntry[key]}
            />
          ))}

          <motion.button
            onClick={() =>
              navigate("/know-more", {
                state: { knowMoreData: breedEntry.know_more, breedEntry },
              })
            }
            className="w-full rounded-2xl shadow-md border transition-all duration-300 px-6 py-4 flex items-center justify-between"
            style={{
              backgroundColor: "#8c52ff",
              borderColor: "#7a3ef0",
            }}
            whileHover={{ 
              y: -4,
              boxShadow: "0 12px 30px rgba(140, 82, 255, 0.4)",
              scale: 1.02
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">📖</span>
              <h3 className="text-2xl font-alfa text-white">
                {t("breedInfo.knowMore")}
              </h3>
            </div>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-50"
            style={{
              backgroundColor: "#8c52ff",
              color: "white",
            }}
            onClick={scrollToTop}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 8px 25px rgba(140, 82, 255, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .breed-modal-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        
        .breed-modal-scrollbar::-webkit-scrollbar-track {
          background: rgba(140, 82, 255, 0.1);
          border-radius: 10px;
        }
        
        .breed-modal-scrollbar::-webkit-scrollbar-thumb {
          background: #8c52ff;
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .breed-modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7a3ef0;
        }
        
        /* Firefox */
        .breed-modal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #8c52ff rgba(140, 82, 255, 0.1);
        }
      `}</style>
    </div>
  );
}









