// src/components/cards/TextCard.jsx
import React from "react";

export default function TextCard({ title, text }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Top section with theme background */}
      <div className="bg-purple-300 px-4 py-3">
        <h4 className="text-center text-xl md:text-2xl font-bold font-archivo text-white">
          {title}
        </h4>
      </div>

      {/* Body section */}
      <div className="p-6 text-center">
        <p className="text-gray-800 text-base md:text-lg font-archivo font-medium leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

