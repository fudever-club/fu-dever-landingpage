"use client";

import React from "react";

export interface MemphisConfettiBackgroundProps {
  className?: string;
  opacity?: number;
  children?: React.ReactNode;
}

/**
 * MemphisConfettiBackground
 *
 * An energetic Memphis / postmodern animated background featuring scattered
 * geometric confetti shapes with thick black outlines and pure CSS keyframes
 * (drift, spin, bob, sway) without any JS overhead.
 */
export default function MemphisConfettiBackground({
  className = "",
  opacity = 0.9,
  children,
}: MemphisConfettiBackgroundProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* CSS Keyframes for Memphis Motion */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes memphis-spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes memphis-spin-reverse {
              0% { transform: rotate(360deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes memphis-bob {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-14px) scale(1.04); }
            }
            @keyframes memphis-bob-alt {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(12px) rotate(-6deg); }
            }
            @keyframes memphis-sway {
              0%, 100% { transform: rotate(-8deg); }
              50% { transform: rotate(8deg); }
            }
            @keyframes memphis-drift {
              0%, 100% { transform: translate(0px, 0px); }
              50% { transform: translate(10px, -12px); }
            }

            .memphis-shape-spin {
              animation: memphis-spin-slow 24s linear infinite;
            }
            .memphis-shape-spin-rev {
              animation: memphis-spin-reverse 20s linear infinite;
            }
            .memphis-shape-bob {
              animation: memphis-bob 5s ease-in-out infinite;
            }
            .memphis-shape-bob-alt {
              animation: memphis-bob-alt 6.5s ease-in-out infinite;
            }
            .memphis-shape-sway {
              animation: memphis-sway 4s ease-in-out infinite;
            }
            .memphis-shape-drift {
              animation: memphis-drift 7s ease-in-out infinite;
            }
          `,
        }}
      />

      {/* Floating Animated Memphis Confetti Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* 1. Coral Triangle (Top Left) */}
        <div className="absolute top-[8%] left-[5%] memphis-shape-bob">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <polygon
              points="22,4 40,38 4,38"
              fill="#ff5b57"
              stroke="#17140d"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 2. Teal Quarter-Arc (Top Right) */}
        <div className="absolute top-[12%] right-[8%] memphis-shape-spin">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path
              d="M 4 4 A 44 44 0 0 1 48 48 L 4 48 Z"
              fill="#12b3a4"
              stroke="#17140d"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 3. Mustard Dotted Circle (Mid Left) */}
        <div className="absolute top-[45%] left-[3%] memphis-shape-spin-rev">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="#ffc531"
              stroke="#17140d"
              strokeWidth="3.5"
              strokeDasharray="4 6"
            />
          </svg>
        </div>

        {/* 4. Violet Spinning Plus-Sign (Mid-Right) */}
        <div className="absolute top-[38%] right-[6%] memphis-shape-spin">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <path
              d="M16 4h10v12h12v10H26v12H16V26H4V16h12V4z"
              fill="#6b5be6"
              stroke="#17140d"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 5. Black Squiggle 'Bacteria' Line (Top Center) */}
        <div className="absolute top-[6%] left-[48%] memphis-shape-sway">
          <svg width="74" height="28" viewBox="0 0 74 28" fill="none">
            <path
              d="M4 14 Q 14 2, 24 14 T 44 14 T 64 14"
              stroke="#17140d"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* 6. Mustard Half-Circle (Bottom Left) */}
        <div className="absolute bottom-[10%] left-[8%] memphis-shape-bob-alt">
          <svg width="56" height="34" viewBox="0 0 56 34" fill="none">
            <path
              d="M 4 30 A 24 24 0 0 1 52 30 Z"
              fill="#ffc531"
              stroke="#17140d"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 7. Solid Teal Dot (Center Right) */}
        <div className="absolute top-[68%] right-[15%] memphis-shape-drift">
          <div className="w-5 h-5 rounded-full bg-[#12b3a4] border-[3px] border-[#17140d]" />
        </div>

        {/* 8. Sky-Blue Zigzag (Bottom Center/Right) */}
        <div className="absolute bottom-[14%] right-[28%] memphis-shape-bob">
          <svg width="60" height="26" viewBox="0 0 60 26" fill="none">
            <path
              d="M4 20 L16 6 L28 20 L40 6 L52 20"
              stroke="#3aa0ff"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* 9. Coral Striped / Terrazzo Circle (Bottom Right) */}
        <div className="absolute bottom-[8%] right-[4%] memphis-shape-spin-rev">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <defs>
              <pattern
                id="coral-stripes"
                width="8"
                height="8"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="#17140d" strokeWidth="2.5" />
              </pattern>
            </defs>
            <circle cx="25" cy="25" r="21" fill="#ff5b57" stroke="#17140d" strokeWidth="3.5" />
            <circle cx="25" cy="25" r="21" fill="url(#coral-stripes)" />
          </svg>
        </div>

        {/* 10. Floating Small Violet Plus (Top Center Left) */}
        <div className="absolute top-[22%] left-[22%] memphis-shape-drift">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z"
              fill="#6b5be6"
              stroke="#17140d"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
