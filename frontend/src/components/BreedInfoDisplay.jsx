import React, { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BREEDS_JSON from "../pawdentify_final_corrected.json";
import TextCard from "./cards/TextCard";
import ListCard from "./cards/ListCard";
import BreedTabs from "./BreedTabs";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { key: "physical_traits", label: "Physical" },
  { key: "social_traits", label: "Temperament" },
  { key: "care_grooming", label: "Care" },
  { key: "environmental_traits", label: "Environment" },
  { key: "health", label: "Health" },
  { key: "nutrition_requirements", label: "Nutrition" },
  { key: "trainability_exercise", label: "Train & Exercise" },
  { key: "lifestyle_suitability", label: "Lifestyle" },
  // Know More removed
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

function extractFunFact(breedEntry) {
  if (!breedEntry) return "No fun fact available.";
  const fu = breedEntry.fun_unique_facts;
  if (fu) {
    if (typeof fu === "string" && fu.trim()) return fu;
    if (fu.fun_fact && fu.fun_fact.trim()) return fu.fun_fact;
    if (Array.isArray(fu.quick_trivia) && fu.quick_trivia.length) return fu.quick_trivia[0];
  }
  return "No fun fact available.";
}

export default function BreedInfoDisplay({ predictionResult }) {
  if (!predictionResult) return null;

  const navigate = useNavigate();
  const { id: predId, breed: predBreedName, previewUrl } = predictionResult;
  const ALL_BREEDS = Array.isArray(BREEDS_JSON) ? BREEDS_JSON : (BREEDS_JSON.breeds || []);
  const breedEntry = useMemo(
    () => findBreedEntry(ALL_BREEDS, predId, predBreedName),
    [ALL_BREEDS, predId, predBreedName]
  );

  const [activeTab, setActiveTab] = useState(SECTIONS[0].key);
  const infoRef = useRef(null);

  const renderTextCardsFromObject = (obj) => {
  if (!obj) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <AnimatePresence>
        {Object.entries(obj).map(([key, value]) => {
          if (!value) return null;
          const title = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const text = Array.isArray(value) ? value.join(", ") : (typeof value === "string" ? value : "");
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
        <h4 className="text-3xl font-archivo font-bold text-purple-600">
          {predBreedName || "Unknown"}
        </h4>
        <p className="mt-4 font-archivo font-semibold text-gray-700">
          No detailed info found for the predicted breed.
        </p>
        <div className="mt-6 w-48 h-48 rounded-[18%_/12%] overflow-hidden shadow-md mx-auto">
          <img
            src={previewUrl || ""}
            alt={predBreedName || "preview"}
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    );
  }

  const funFact = extractFunFact(breedEntry);

  return (
    <section ref={infoRef} id="info" className="pt-20 pb-16 max-w-6xl mx-auto px-6">
      {/* Breed Name */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-archivo font-bold text-purple-700">
          {breedEntry.breed || breedEntry.name || predBreedName}
        </h2>
      </div>

      {/* Preview Image + Fun Fact */}
      <div className="w-full flex flex-col items-center gap-6 mb-8">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-[18%_/12%] overflow-hidden shadow-md">
          <img
            src={previewUrl || breedEntry.image_url || ""}
            alt={breedEntry.breed || predBreedName}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xl font-archivo font-semibold text-gray-700 text-center max-w-3xl">
          {funFact}
        </p>
      </div>

      {/* Know More Button */}
      <div className="text-center mb-6">
        <button
          onClick={() =>
            navigate("/know-more", {
              state: { knowMoreData: breedEntry.know_more, breedEntry },
            })
          }
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-archivo hover:bg-purple-700 transition"
        >
          Know More
        </button>
      </div>

      {/* Tabs */}
      <BreedTabs activeSection={activeTab} onTabClick={(k) => setActiveTab(k)} />


      {/* Active tab content */}
      <div className="mt-6">
        {SECTIONS.map(
          ({ key }) =>
            activeTab === key && (
              <div key={key}>
                {renderTextCardsFromObject(breedEntry[key])}
              </div>
            )
        )}
      </div>

      {/* Back to Top Button */}
      <div
        className="fixed bottom-4 right-4 bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer hover:bg-purple-700 transition"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </div>
    </section>
  );
}
