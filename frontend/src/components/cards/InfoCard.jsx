// src/components/cards/InfoCard.jsx
import React from "react";

export default function InfoCard({ frontContent, icon, title }) {
  return (
    <div className="w-full h-48 transform-style-preserve-3d hover:rotate-y-6 hover:scale-105 transition-all duration-300 cursor-pointer">
      <div
        className="w-full h-full rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-xl p-6 flex flex-col items-center justify-center"
        style={{
          background: "var(--color-card-bg)",
        }}
      >
        <div style={{ color: "var(--color-card-icon)" }} className="mb-4">
          {icon}
        </div>
        <h4 className="text-xl font-bold font-archivo mb-2 text-center break-words w-full" style={{ color: "var(--color-card-title)" }}>
          {title}
        </h4>
        <div className="font-medium text-center break-words w-full overflow-hidden" style={{ color: "var(--color-card-text)" }}>
          {frontContent}
        </div>
      </div>
    </div>
  );
}

