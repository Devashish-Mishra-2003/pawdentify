import React from "react";

export default function InfoCard({ frontContent, icon, title }) {
  return (
    <div className="w-full h-48 transform-style-preserve-3d hover:rotate-y-6 hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-xl p-6 flex flex-col items-center justify-center">
        <div className="text-purple-600 mb-4">{icon}</div>
        <h4 className="text-xl font-bold font-archivo text-gray-800 mb-2 text-left">{title}</h4>
        <div className="text-left text-gray-700 font-medium">{frontContent}</div>
      </div>
    </div>
  );
}