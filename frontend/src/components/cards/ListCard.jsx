// src/components/cards/ListCard.jsx
import React from "react";

export default function ListCard({ title, items = [] }) {
  if (!Array.isArray(items)) items = [];

  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
      {/* Title */}
      <h3 className="text-lg font-bold text-purple-600 mb-4 text-center font-archivo">
        {title}
      </h3>

      {/* Pills */}
      {items.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((item, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-full text-sm font-archivo font-medium ${colors[idx % colors.length]}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 font-archivo text-sm">No data available.</p>
      )}
    </div>
  );
}
