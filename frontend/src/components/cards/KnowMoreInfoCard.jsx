import React from "react";

export default function KnowMoreInfoCard({ frontContent, icon, title }) {
  return (
    <div className="w-full h-90 transform-style-preserve-3d hover:rotate-y-6 hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-xl p-8 flex flex-col items-center justify-center">
        <div className="text-purple-600 mb-6">{icon}</div>
        <h4 className="text-2xl font-alfa text-gray-800 mb-4 text-left">{title}</h4>
        <div className="text-left text-gray-700 font-bold font-archivo text-lg">{frontContent}</div>
      </div>
    </div>
  );
}