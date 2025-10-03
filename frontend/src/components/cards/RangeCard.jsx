// src/components/cards/RangeCard.jsx
import React from "react";

export default function RangeCard({ title, value, min = 0, max = 100 }) {
  if (!value) return null;

  // support value as {min,max}
  const vMin = typeof value === "object" ? value.min : value;
  const vMax = typeof value === "object" ? value.max : value;

  const percentMin = ((vMin - min) / (max - min)) * 100;
  const percentMax = ((vMax - min) / (max - min)) * 100;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
      {/* Title */}
      <h3 className="text-lg font-bold text-purple-600 mb-4">{title}</h3>

      {/* Range bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 relative mb-4">
        <div
          className="absolute top-0 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
          style={{
            left: `${percentMin}%`,
            width: `${percentMax - percentMin}%`,
          }}
        ></div>
      </div>

      {/* Value text */}
      <p className="font-archivo text-gray-700 text-base">
        {vMin} – {vMax}
      </p>
    </div>
  );
}
