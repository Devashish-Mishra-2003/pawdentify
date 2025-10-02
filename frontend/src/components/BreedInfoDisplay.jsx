// src/components/BreedInfoDisplay.jsx
import React, { useMemo } from "react";
import BREEDS_JSON from "../pawdentify_final_corrected.json";
import TextCard from "./cards/TextCard";

/* small helper - tolerant lookup (id / breed string) */
function findBreedEntry(ALL_BREEDS, predId, predBreedName) {
  if (!ALL_BREEDS || !ALL_BREEDS.length) return null;

  if (predId != null) {
    const byId = ALL_BREEDS.find((b) => String(b.id) === String(predId) || Number(b.id) === Number(predId));
    if (byId) return byId;
  }

  if (predBreedName) {
    const key = (predBreedName || "").toLowerCase().trim();
    const direct = ALL_BREEDS.find((b) =>
      [(b.breed || ""), (b.name || ""), (b.pretty_name || "")]
        .filter(Boolean)
        .some((v) => v.toLowerCase() === key)
    );
    if (direct) return direct;

    // partial fallback
    const first = key.split(/\s+/)[0];
    return ALL_BREEDS.find((b) => ((b.breed || b.name || "").toLowerCase().includes(first)));
  }

  return null;
}

/* robust funFact extractor */
function extractFunFact(b) {
  if (!b) return "No fun fact available.";
  // fun_unique_facts
  const fu = b.fun_unique_facts;
  if (fu) {
    if (typeof fu === "string" && fu.trim()) return fu;
    if (fu.fun_fact && fu.fun_fact.trim()) return fu.fun_fact;
    if (Array.isArray(fu.quick_trivia) && fu.quick_trivia.length && fu.quick_trivia[0].trim()) return fu.quick_trivia[0];
  }
  // direct field
  if (b.fun_fact && String(b.fun_fact).trim()) return b.fun_fact;
  // extended_fun_facts.interesting_facts
  const ef = b.extended_fun_facts;
  if (ef && Array.isArray(ef.interesting_facts) && ef.interesting_facts.length && ef.interesting_facts[0].trim()) return ef.interesting_facts[0];
  // alternate possible fields
  if (Array.isArray(b.fascinating_breed_trivia) && b.fascinating_breed_trivia.length && b.fascinating_breed_trivia[0].trim()) return b.fascinating_breed_trivia[0];
  if (b.quick_trivia && typeof b.quick_trivia === "string" && b.quick_trivia.trim()) return b.quick_trivia;
  return "No fun fact available.";
}

export default function BreedInfoDisplay({ predictionResult }) {
  if (!predictionResult) return null;

  const { id: predId, breed: predBreedName, previewUrl } = predictionResult;

  const ALL_BREEDS = Array.isArray(BREEDS_JSON) ? BREEDS_JSON : (BREEDS_JSON.breeds || []);

  const breedEntry = useMemo(() => findBreedEntry(ALL_BREEDS, predId, predBreedName), [
    ALL_BREEDS,
    predId,
    predBreedName,
  ]);

  // If not found, show minimal message but keep the area
  if (!breedEntry) {
    return (
      <section id="info" className="py-16 max-w-5xl mx-auto px-6">
        <div className="text-center">
          <h4 className="inline-block text-3xl md:text-4xl font-archivo font-bold mr-2">Name :</h4>
          <span className="inline-block text-3xl md:text-4xl font-archivo font-bold text-purple-600">
            {predBreedName || "Unknown"}
          </span>
        </div>

        <p className="text-center mt-4 md:mt-6 max-w-3xl mx-auto font-archivo font-semibold text-gray-700">
          No detailed info found for the predicted breed.
        </p>

        <div className="w-full flex justify-center mt-8">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-[18%_/12%] overflow-hidden shadow-md">
            <img src={previewUrl || ""} alt={predBreedName || "preview"} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    );
  }

  // simple fields used for the example TextCard
  const coatType = breedEntry.physical_traits?.coat_type || breedEntry.coat_type || "Unknown";
  const funFact = extractFunFact(breedEntry);

  return (
    <section id="info" className="py-16 max-w-6xl mx-auto px-6">
      {/* Inline Name + Breed */}
      <div className="text-center">
        <h4 className="inline-block text-3xl md:text-4xl font-archivo font-bold mr-2">Name :</h4>
        <span className="inline-block text-3xl md:text-4xl font-archivo font-bold text-purple-600">
          {breedEntry.breed || breedEntry.name || predBreedName}
        </span>
      </div>

      {/* Fun fact (bold Archivo) */}
      <p className="text-center mt-4 md:mt-6 max-w-3xl mx-auto font-archivo font-semibold text-gray-700">{funFact}</p>

      {/* squircle preview (no border) */}
      <div className="w-full flex justify-center mt-8">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-[18%_/12%] overflow-hidden shadow-md">
          <img src={previewUrl || breedEntry.image_url || ""} alt={breedEntry.breed || predBreedName} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* ========== PLACE TO ATTACH CARDS ========== */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Example simple string card (coat type) - this is the card we will perfect first */}
        <TextCard
          title="Coat type"
          text={coatType}
          icon={
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3C7 3 5 6 5 9c0 3 2 6 7 9 5-3 7-6 7-9 0-3-2-6-7-6z" /></svg>
          }
        />
      </div>
    </section>
  );
}



