import React from 'react';


export const LogoPawImage = ({ className = 'w-6 h-6' }) => (
<img
src="https://placehold.co/50x50/8c52ff/ffffff?text=P"
alt="Paw Icon"
className={`${className} inline mx-1 transform scale-x-[-1]`}
style={{ borderRadius: '50%', background: 'transparent' }}
/>
);


export const CheckImage = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    {/* Green circular background */}
    <circle cx="12" cy="12" r="12" fill="#22c55e" />
    
    {/* White checkmark */}
    <path
      d="M6 12l4 4 8-8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);



export const CrossImage = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    {/* Red circular background */}
    <circle cx="12" cy="12" r="12" fill="#ef4444" />
    
    {/* White "X" */}
    <path
      d="M8 8l8 8M16 8l-8 8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);



export const UploadPawImage = ({ className = 'w-16 h-16' }) => (
<img
src="https://placehold.co/100x100/8c52ff/ffffff?text=P"
alt="Upload Paw Icon"
className={`${className} object-contain`}
/>
);