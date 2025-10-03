import React, { useEffect, useRef } from "react";

// Single emoji per tab
const icons = {
  physical_traits: <span role="img" aria-label="ruler">📏</span>,
  social_traits: <span role="img" aria-label="heart">💜</span>,
  care_grooming: <span role="img" aria-label="brush">🔍</span>,
  environmental_traits: <span role="img" aria-label="home">🏠</span>,
  health: <span role="img" aria-label="health">🩺</span>,
  nutrition_requirements: <span role="img" aria-label="nutrition">🍽️</span>,
  trainability_exercise: <span role="img" aria-label="exercise">🏃‍♂️</span>,
  lifestyle_suitability: <span role="img" aria-label="lifestyle">🌎</span>,
};

const sections = [
  { id: "physical_traits", label: "Physical" },
  { id: "social_traits", label: "Temperament" },
  { id: "care_grooming", label: "Care" },
  { id: "environmental_traits", label: "Environment" },
  { id: "health", label: "Health" },
  { id: "nutrition_requirements", label: "Nutrition" },
  { id: "trainability_exercise", label: "Train & Exercise" },
  { id: "lifestyle_suitability", label: "Lifestyle" },
];

export default function BreedTabs({ activeSection, onTabClick }) {
  const containerRef = useRef(null);
  const btnRefs = useRef({});

  // callback ref to store DOM node refs reliably
  const setBtnRef = (id) => (el) => {
    if (el) btnRefs.current[id] = el;
  };

  // Center the active button in the container
  useEffect(() => {
    const container = containerRef.current;
    const btn = btnRefs.current[activeSection];
    if (!container || !btn) return;

    const containerWidth = container.clientWidth;
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;

    // target left so button is centered
    let targetScroll = Math.round(btnLeft - (containerWidth - btnWidth) / 2);

    // clamp bounds
    targetScroll = Math.max(0, Math.min(targetScroll, container.scrollWidth - containerWidth));

    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  }, [activeSection]);

  // keyboard nav (Left/Right)
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
      className="flex gap-4 bg-white rounded-xl shadow-lg px-4 py-3 my-8 sticky top-0 z-30 w-full max-w-5xl mx-auto overflow-x-auto"
      role="tablist"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          ref={setBtnRef(id)}
          role="tab"
          aria-selected={activeSection === id}
          onClick={() => onTabClick(id)}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition whitespace-nowrap min-w-max ${
            activeSection === id ? "bg-purple-600 text-white shadow-md" : "bg-transparent text-purple-700"
          }`}
        >
          <span>{icons[id]}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

