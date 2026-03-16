// src/components/cards/AccordionCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatFieldTitle = (key) => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function AccordionCard({ title, icon, data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data || typeof data !== 'object') return null;

  const entries = Object.entries(data).filter(([_, value]) => value);

  return (
    <div 
      className={`bento-card border-2 transition-all duration-300 p-0 overflow-hidden ${
        isExpanded 
          ? "border-[#30A7DB] bg-white dark:bg-[#111111] scale-[1.01]" 
          : "border-gray-100 dark:border-white/10 bg-white dark:bg-[#111111]"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          {icon && <span className="text-3xl" aria-hidden="true">{icon}</span>}
          <h3 className="text-2xl font-extrabold text-black dark:text-white">
            {title}
          </h3>
        </div>

        <motion.div
           animate={{ rotate: isExpanded ? 180 : 0 }}
           className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
             isExpanded 
               ? "bg-[#30A7DB] text-white" 
               : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
           }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 dark:border-white/10"
          >
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {entries.map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    {formatFieldTitle(key)}
                  </span>
                  <span className="text-lg text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
