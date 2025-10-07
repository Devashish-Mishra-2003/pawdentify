// src/components/cards/AccordionCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatFieldTitle } from "../../utils/cardHelpers";

export default function AccordionCard({ title, icon, data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data || typeof data !== 'object') return null;

  const entries = Object.entries(data).filter(([_, value]) => value);

  return (
    <div
      className="w-full rounded-2xl shadow-md border transition-all duration-300"
      style={{
        backgroundColor: "var(--color-accordion-bg)",
        borderColor: "var(--color-accordion-border)",
      }}
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:opacity-80 transition-opacity"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
      >
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{icon}</span>
          <h3 className="text-2xl font-alfa" style={{ color: "var(--color-accordion-title)" }}>
            {title}
          </h3>
        </div>

        {/* Right: Chevron */}
        <motion.svg
          className="w-6 h-6"
          style={{ color: "var(--color-accordion-chevron)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Content - Expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--color-accordion-label)" }}
                    >
                      {formatFieldTitle(key)}
                    </span>
                    <span
                      className="text-base"
                      style={{ color: "var(--color-accordion-value)" }}
                    >
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
