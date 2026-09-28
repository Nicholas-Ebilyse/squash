import React from "react";

/**
 * Authentic Double Yellow Dot Squash Ball Icon
 * Represents the official competition squash ball with dark matte rubber and 2 yellow dots.
 */
export function SquashBallIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`squash-ball-svg ${className}`}
      style={{ verticalAlign: "middle", display: "inline-block", flexShrink: 0 }}
    >
      <defs>
        <radialGradient id="sqBallGrad" cx="36%" cy="32%" r="64%">
          <stop offset="0%" stopColor="#4a4d56" />
          <stop offset="40%" stopColor="#24262d" />
          <stop offset="80%" stopColor="#131417" />
          <stop offset="100%" stopColor="#090a0c" />
        </radialGradient>
        <radialGradient id="sqDotGrad" cx="38%" cy="35%" r="62%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        <filter id="sqDotGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="0.8" floodColor="#facc15" floodOpacity="0.9" />
        </filter>
      </defs>

      {/* Outer subtle ring for contrast on dark/light surfaces */}
      <circle cx="32" cy="32" r="30.5" fill="#090a0c" opacity="0.35" />
      <circle cx="32" cy="32" r="29" fill="#18181b" stroke="#52525b" strokeWidth="1" />

      {/* Main rubber squash ball sphere */}
      <circle cx="32" cy="32" r="27.5" fill="url(#sqBallGrad)" />

      {/* Light sheen on rubber */}
      <path
        d="M 16 26 A 22 22 0 0 1 38 12"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.18"
      />

      {/* Two iconic yellow dots */}
      <circle cx="26.5" cy="33" r="3.4" fill="url(#sqDotGrad)" filter="url(#sqDotGlow)" />
      <circle cx="37.5" cy="33" r="3.4" fill="url(#sqDotGrad)" filter="url(#sqDotGlow)" />
    </svg>
  );
}

/**
 * Authentic Squash Racket Icon (Teardrop shape + long handle)
 */
export function SquashRacketIcon({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`squash-racket-svg ${className}`}
      style={{ verticalAlign: "middle", display: "inline-block", flexShrink: 0 }}
    >
      {/* Racket Head (Teardrop shape typical of squash) */}
      <path
        d="M 23 7 C 34 2, 48 9, 52 23 C 55 35, 45 46, 36 48 L 32 49 L 30 46 C 24 38, 16 25, 17 17 C 18 11, 20 8, 23 7 Z"
        stroke="#10b981"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(16, 185, 129, 0.1)"
      />
      {/* Strings grid */}
      <path
        d="M 28 9 L 39 45 M 34 8 L 46 36 M 21 17 L 49 22 M 23 26 L 48 30 M 27 35 L 42 39"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.1"
      />
      {/* Shaft */}
      <path d="M 32 49 L 14 62" stroke="#94a3b8" strokeWidth="3.8" strokeLinecap="round" />
      {/* Grip wrap */}
      <path d="M 21 57 L 13 63" stroke="#8b5cf6" strokeWidth="5.2" strokeLinecap="round" />
    </svg>
  );
}
