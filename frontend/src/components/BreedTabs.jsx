// Updated BreedTabs.jsx - Roobaroo Style
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const icons = {
  physical_traits: "📐",
  social_traits: "💜",
  care_grooming: "🪮",
  trainability_exercise: "🏃‍♂️",
  lifestyle_suitability: "🏠",
};

const sections = [
  { id: "physical_traits", label: "breedInfo.tabs.physical" },
  { id: "social_traits", label: "breedInfo.tabs.temperament" },
  { id: "care_grooming", label: "breedInfo.tabs.care" },
  { id: "trainability_exercise", label: "breedInfo.tabs.trainExercise" },
  { id: "lifestyle_suitability", label: "breedInfo.tabs.lifestyle" },
];

export default function BreedTabs({ activeSection, onTabClick }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const btnRefs = useRef({});

  useEffect(() => {
    const container = containerRef.current;
    const btn = btnRefs.current[activeSection];
    if (!container || !btn) return;
    const scrollLeft = btn.offsetLeft - (container.clientWidth / 2) + (btn.clientWidth / 2);
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [activeSection]);

  return (
    <div className="w-full overflow-hidden">
      <nav
        ref={containerRef}
        className="flex flex-nowrap gap-4 overflow-x-auto no-scrollbar py-4 px-2 select-none touch-pan-x"
        role="tablist"
      >
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <motion.button
              key={id}
              ref={(el) => (btnRefs.current[id] = el)}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabClick(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-3 px-8 py-4 rounded-full font-bold whitespace-nowrap transition-all border-2
                ${isActive 
                   ? "bg-[#30A7DB] border-[#30A7DB] text-white shadow-lg" 
                   : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"}
              `}
            >
              <span className="text-xl">{icons[id]}</span>
              <span className="text-lg">{t(label)}</span>
            </motion.button>
          );
        })}
      </nav>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
