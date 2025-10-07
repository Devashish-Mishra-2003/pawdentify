// Updated BreedTabs.jsx - removed sticky
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const icons = {
  physical_traits: <span role="img" aria-label="ruler">📏</span>,
  social_traits: <span role="img" aria-label="heart">💜</span>,
  care_grooming: <span role="img" aria-label="brush">🔍</span>,
  trainability_exercise: <span role="img" aria-label="exercise">🏃‍♂️</span>,
  lifestyle_suitability: <span role="img" aria-label="lifestyle">🌎</span>,
};

// Filtered sections for tabs (5 sections)
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

  const setBtnRef = (id) => (el) => {
    if (el) btnRefs.current[id] = el;
  };

  useEffect(() => {
    const container = containerRef.current;
    const btn = btnRefs.current[activeSection];
    if (!container || !btn) return;

    const containerWidth = container.clientWidth;
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;

    let targetScroll = Math.round(btnLeft - (containerWidth - btnWidth) / 2);
    targetScroll = Math.max(0, Math.min(targetScroll, container.scrollWidth - containerWidth));

    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  }, [activeSection]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const idx = sections.findIndex((s) => s.id === activeSection);
      if (idx === -1) return;
      const nextIdx = e.key === "ArrowRight" ? Math.min(idx + 1, sections.length - 1) : Math.max(idx - 1, 0);
      const next = sections[nextIdx];
      if (next) onTabClick(next.id);
    }
  };

  return (
    <nav
      ref={containerRef}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Breed sections"
      className="rounded-xl px-6 py-5 my-8 w-full max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--color-tabs-bg)",
      }}
      role="tablist"
    >
      {/* Row 1: First 3 tabs */}
      <div className="flex justify-center gap-4 mb-4">
        {sections.slice(0, 3).map(({ id, label }) => (
          <motion.button
            key={id}
            ref={setBtnRef(id)}
            role="tab"
            aria-selected={activeSection === id}
            onClick={() => onTabClick(id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap border-2"
            style={
              activeSection === id
                ? {
                    color: "var(--color-tab-active-text)",
                    borderColor: "var(--color-tab-active-bg)",
                    boxShadow: "var(--color-tab-active-shadow)",
                  }
                : {
                    backgroundColor: "var(--color-tab-inactive-bg)",
                    color: "var(--color-tab-inactive-text)",
                    borderColor: "var(--color-tab-inactive-text)",
                  }
            }
          >
            {/* Animated background for active tab */}
            {activeSection === id && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 -m-0.5 rounded-xl"
                style={{
                  backgroundColor: "var(--color-tab-active-bg)",
                  opacity: 0.85,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{icons[id]}</span>
            <span className="relative z-10">{t(label)}</span>
          </motion.button>
        ))}
      </div>

      {/* Row 2: Last 2 tabs */}
      <div className="flex justify-center gap-4">
        {sections.slice(3).map(({ id, label }) => (
          <motion.button
            key={id}
            ref={setBtnRef(id)}
            role="tab"
            aria-selected={activeSection === id}
            onClick={() => onTabClick(id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap border-2"
            style={
              activeSection === id
                ? {
                    color: "var(--color-tab-active-text)",
                    borderColor: "var(--color-tab-active-bg)",
                    boxShadow: "var(--color-tab-active-shadow)",
                  }
                : {
                    backgroundColor: "var(--color-tab-inactive-bg)",
                    color: "var(--color-tab-inactive-text)",
                    borderColor: "var(--color-tab-inactive-text)",
                  }
            }
          >
            {/* Animated background for active tab */}
            {activeSection === id && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 -m-0.5 rounded-xl"
                style={{
                  backgroundColor: "var(--color-tab-active-bg)",
                  opacity: 0.85,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{icons[id]}</span>
            <span className="relative z-10">{t(label)}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
}






