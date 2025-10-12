import React, { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BREEDS_JSON from "../pawdentify_final_corrected.json";
import TextCard from "./cards/TextCard";
import AccordionCard from "./cards/AccordionCard";
import BreedTabs from "./BreedTabs";
import FeedbackForm from "./FeedbackForm";
import { motion, AnimatePresence } from "framer-motion";

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
  
  if (!predictionResult) return null;

  const navigate = useNavigate();
  const { id: predId, breed: predBreedName, previewUrl } = predictionResult;
  const ALL_BREEDS = Array.isArray(BREEDS_JSON) ? BREEDS_JSON : (BREEDS_JSON.breeds || []);
  const breedEntry = useMemo(
    () => findBreedEntry(ALL_BREEDS, predId, predBreedName),
    [ALL_BREEDS, predId, predBreedName]
  );

  const [activeTab, setActiveTab] = useState(TAB_SECTIONS[0].key);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const infoRef = useRef(null);

  // Show back to top button on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <section id="info" className="py-16 max-w-5xl mx-auto px-6 text-center">
        <h4 className="text-3xl font-archivo font-bold" style={{ color: "var(--color-breed-no-info)" }}>
          {predBreedName || t("breedInfo.unknownBreed")}
        </h4>
        <p className="mt-4 font-archivo font-semibold" style={{ color: "var(--color-breed-no-info-text)" }}>
          {t("breedInfo.noInfoFound")}
        </p>
        <div className="mt-6 pt-2.5 w-48 h-48 rounded-[18%_/12%] overflow-hidden shadow-md mx-auto">
          <img
            src={previewUrl || ""}
            alt={predBreedName || "preview"}
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    );
  }

  const funFact = extractFunFact(breedEntry, t);

  return (
    <section ref={infoRef} id="info" className="pt-20 pb-16 max-w-6xl mx-auto px-6">
      {/* Breed Name */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-alfa" style={{ color: "var(--color-breed-title)" }}>
          {breedEntry.breed || breedEntry.name || predBreedName}
        </h2>
      </div>

      {/* Preview Image + Fun Fact */}
      <div className="w-full flex flex-col items-center gap-6 mb-8">
        <motion.div 
          className="w-48 h-48 md:w-56 md:h-56 rounded-[18%_/12%] overflow-hidden shadow-md cursor-pointer"
          whileHover={{ 
            y: -8,
            boxShadow: "0 20px 40px rgba(140, 82, 255, 0.4)",
            scale: 1.05
          }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={previewUrl || breedEntry.image_url || ""}
            alt={breedEntry.breed || predBreedName}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <p className="text-xl font-archivo font-semibold text-center max-w-3xl" style={{ color: "var(--color-breed-fun-fact)" }}>
          {funFact}
        </p>
      </div>

      {/* Tabs */}
      <BreedTabs activeSection={activeTab} onTabClick={(k) => setActiveTab(k)} />

      {/* Active tab content */}
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

      {/* Accordion sections + Know More Button + Feedback Form */}
      <div className="mt-12 space-y-6">
        {ACCORDION_SECTIONS.map(({ key, label, icon }) => (
          <AccordionCard
            key={key}
            title={t(label)}
            icon={icon}
            data={breedEntry[key]}
          />
        ))}

        {/* Know More Button as Card */}
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

        {/* Feedback Form - After Know More Button */}
        <div>
          <FeedbackForm prediction={predBreedName} />
        </div>
      </div>

      {/* Modern Back to Top Button */}
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
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 8px 25px rgba(140, 82, 255, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={t("breedInfo.backToTop")}
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
    </section>
  );
}









