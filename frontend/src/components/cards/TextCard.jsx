// src/components/cards/TextCard.jsx
import React from "react";
import InfoCard from "./InfoCard";

export default function TextCard({ title, text, icon, children }) {
  return (
    <InfoCard 
      title={title}
      icon={icon}
      frontContent={
        children ? (
          <div className="text-base md:text-lg font-archivo font-medium leading-relaxed break-words overflow-hidden text-ellipsis">
            {children}
          </div>
        ) : (
          <p className="text-base md:text-lg font-archivo font-medium leading-relaxed break-words overflow-hidden text-ellipsis line-clamp-3">
            {text}
          </p>
        )
      }
    />
  );
}


