import React from 'react';

export default function CivicLogo({ size = 'md' }) {
  const iconSize = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div className={`relative flex items-center justify-center ${iconSize} rounded-xl bg-gradient-to-br from-[#245D9C] to-[#15171D] p-1.5 shadow border border-[#B79A68]/40 flex-shrink-0`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#B79A68]"
      >
        {/* Outer Laurel / Decorative Ring */}
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="24" cy="24" r="19" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
        
        {/* Civic Building / Fort Gateway Silhouette */}
        <path
          d="M14 36V22L24 13L34 22V36H28V27H20V36H14Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Smart City Waves / River Pavana motif */}
        <path
          d="M10 40C14 38 18 42 22 40C26 38 30 42 34 40C36 39 37 39 38 40"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Center Star / Beacon */}
        <circle cx="24" cy="19" r="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
