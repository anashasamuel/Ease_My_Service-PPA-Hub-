import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

export const NyscBadge: React.FC<Props> = ({ className = '', size = 48 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      title="National Youth Service Corps (NYSC)"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Green Ring */}
        <circle cx="50" cy="50" r="48" fill="#008751" stroke="#C89D3C" strokeWidth="2.5" />

        {/* Inner Gold / White Rim */}
        <circle cx="50" cy="50" r="41" fill="#065f38" stroke="#FFFFFF" strokeWidth="1" />

        {/* Outer Circular Text simulation */}
        <circle cx="50" cy="50" r="33" fill="#FFFFFF" />

        {/* Central NYSC Emblem core */}
        <circle cx="50" cy="50" r="28" fill="#008751" />

        {/* Torch of Knowledge / Service */}
        <path
          d="M47 38 C47 32, 53 32, 53 38 L52 56 L48 56 Z"
          fill="#C89D3C"
        />
        {/* Flame of the Torch */}
        <path
          d="M50 26 C47 30, 45 34, 50 36 C55 34, 53 30, 50 26 Z"
          fill="#FFB703"
        />

        {/* Open Book / Scroll at Base */}
        <path
          d="M36 58 C42 55, 48 57, 50 59 C52 57, 58 55, 64 58 L63 64 C57 61, 52 63, 50 64 C48 63, 43 61, 37 64 Z"
          fill="#FFFFFF"
          stroke="#C89D3C"
          strokeWidth="0.8"
        />

        {/* Olive / Laurel Leaves */}
        <path
          d="M32 44 C29 48, 30 54, 34 58"
          stroke="#C89D3C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M68 44 C71 48, 70 54, 66 58"
          stroke="#C89D3C"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Golden Star at top */}
        <polygon
          points="50,15 52,19 56,19 53,22 54,26 50,23 46,26 47,22 44,19 48,19"
          fill="#C89D3C"
        />
      </svg>
    </div>
  );
};

export const NigeriaFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => {
  return (
    <div className={`inline-flex rounded-xs overflow-hidden border border-slate-200 shrink-0 shadow-xs ${className}`}>
      <div className="w-1/3 h-full bg-[#008751]" />
      <div className="w-1/3 h-full bg-white" />
      <div className="w-1/3 h-full bg-[#008751]" />
    </div>
  );
};
