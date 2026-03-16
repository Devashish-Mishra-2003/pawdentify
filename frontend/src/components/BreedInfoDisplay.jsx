import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBreedData } from "../contexts/BreedDataContext";
import BreedTabs from "./BreedTabs";
import FeedbackForm from "./FeedbackForm";
import AccordionCard from "./cards/AccordionCard";
import { motion, AnimatePresence } from "framer-motion";

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

function findBreedEntry(ALL_BREEDS, predId, predBreedName) {
  if (!ALL_BREEDS || !ALL_BREEDS.length) return null;
  if (predId != null) {
    const byId = ALL_BREEDS.find((b) => String(b.id) === String(predId) || Number(b.id) === Number(predId));
    if (byId) return byId;
  }
  if (predBreedName) {
    const key = predBreedName.toLowerCase().trim();
    const direct = ALL_BREEDS.find((b) =>
      [(b.breed || ""), (b.name || ""), (b.pretty_name || "")]
        .filter(Boolean)
        .some((v) => v.toLowerCase() === key)
    );
    if (direct) return direct;
    const first = key.split(/\s+/)[0];
    return ALL_BREEDS.find((b) => (b.breed || b.name || "").toLowerCase().includes(first));
  }
  return null;
}

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

export default function BreedInfoDisplay({ predictionResult }) {
  const { t } = useTranslation();
  const breedData = useBreedData();
  
  if (!predictionResult) return null;

  const navigate = useNavigate();
  const { id: predId, breed: predBreedName, previewUrl } = predictionResult;
  const ALL_BREEDS = Array.isArray(breedData) ? breedData : (breedData.breeds || []);
  const breedEntry = useMemo(
    () => findBreedEntry(ALL_BREEDS, predId, predBreedName),
    [ALL_BREEDS, predId, predBreedName]
  );

  const [activeTab, setActiveTab] = useState(TAB_SECTIONS[0].key);
  const [showBackToTop, setShowBackToTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderTextCardsFromObject = (obj) => {
    if (!obj) return null;
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {Object.entries(obj).map(([key, value]) => {
            if (!value) return null;
            const title = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const text = Array.isArray(value) ? value.join(", ") : (typeof value === "string" ? value : String(value));
            return (
      <div key={key} className="bento-card bg-white dark:bg-[#111111] p-6 border-gray-100 dark:border-white/10 border-2">
                 <h4 className="text-sm font-semibold text-[#30A7DB] mb-2 uppercase tracking-widest">{title}</h4>
                 <p className="text-xl text-black dark:text-white font-semibold leading-snug">{text}</p>
              </div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (!breedEntry) {
    return (
      <section id="info" className="py-24 max-w-6xl mx-auto px-6 text-center">
         <div className="bento-card bg-white dark:bg-[#111111] inline-block">
            <h4 className="text-4xl text-black dark:text-white mb-4">{predBreedName || t("breedInfo.unknownBreed")}</h4>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">{t("breedInfo.noInfoFound")}</p>
            <img src={previewUrl || ""} alt="preview" className="w-64 h-64 rounded-[40px] object-cover mx-auto border-4 border-gray-50 dark:border-white/10" />
         </div>
      </section>
    );
  }

  const funFact = extractFunFact(breedEntry, t);

  return (
    <section id="info" className="py-24 bg-[var(--color-bg-app)] relative overflow-hidden">
      <div className="bg-blob blob-purple top-0 right-0 opacity-5"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <motion.div 
            className="flex-shrink-0 w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white dark:border-white/10 p-4 bg-gray-50 dark:bg-white/5"
            whileHover={{ scale: 1.02, rotate: -1 }}
          >
            <img src={previewUrl || breedEntry.image_url || ""} alt={breedEntry.breed} className="w-full h-full object-cover rounded-full" />
          </motion.div>
          
          <div className="flex-1 text-center md:text-left">
            <span className="font-handwriting text-3xl text-[#7D64A3] dark:text-[#A892D1] mb-4 block">Meet your match</span>
            <h2 className="text-5xl md:text-7xl text-black dark:text-white mb-6 leading-tight">
              {breedEntry.breed || breedEntry.name || predBreedName}
            </h2>
            <div className="bento-card bg-gray-50 dark:bg-white/5 border-0 p-8 shadow-inner">
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
                "{funFact}"
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <BreedTabs activeSection={activeTab} onTabClick={(k) => setActiveTab(k)} />
        </div>

        <div className="min-h-[400px]">
          {TAB_SECTIONS.map(({ key }) => activeTab === key && (
             <div key={key}>{renderTextCardsFromObject(breedEntry[key])}</div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-8 px-2">Deeper Insights</h3>
              {ACCORDION_SECTIONS.map(({ key, label }) => (
                <AccordionCard key={key} title={t(label)} data={breedEntry[key]} />
              ))}
              
              <motion.button
                onClick={() => navigate("/know-more", { state: { knowMoreData: breedEntry.know_more, breedEntry } })}
                whileHover={{ scale: 1.01, borderColor: '#30A7DB' }}
                whileTap={{ scale: 0.99 }}
                className="w-full bento-card bg-white dark:bg-[#111111] border-2 border-gray-100 dark:border-white/10 px-8 py-6 flex items-center justify-between group text-left transition-all hover:border-[#30A7DB]"
              >
                 <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-extrabold text-black dark:text-white">Read Full Life Story</h3>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-[#30A7DB] group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                 </div>
              </motion.button>
           </div>
           
           <div className="flex flex-col justify-start pt-16">
              <div className="bento-card border-dashed border-2 border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/5 p-10">
                 <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-8">Verification</h3>
                 <h2 className="text-3xl text-black dark:text-white mb-8 font-extrabold">Was this identity correct?</h2>
                 <FeedbackForm prediction={predBreedName} />
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#30A7DB] text-white shadow-2xl flex items-center justify-center z-50 hover:-translate-y-2 transition-transform"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
