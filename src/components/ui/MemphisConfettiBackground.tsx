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
 * Energetic Memphis geometric confetti shapes placed strictly along the far outer borders,
 * hidden on mobile/tablet to avoid overlapping text and titles.
 */
export default function MemphisConfettiBackground({
  className = "",
  opacity = 0.45,
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
              50% { transform: translateY(-10px) scale(1.03); }
            }
            @keyframes memphis-bob-alt {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(10px) rotate(-4deg); }
            }
            @keyframes memphis-sway {
              0%, 100% { transform: rotate(-6deg); }
              50% { transform: rotate(6deg); }
            }

            .memphis-shape-spin { animation: memphis-spin-slow 24s linear infinite; }
            .memphis-shape-spin-rev { animation: memphis-spin-reverse 20s linear infinite; }
            .memphis-shape-bob { animation: memphis-bob 5s ease-in-out infinite; }
            .memphis-shape-bob-alt { animation: memphis-bob-alt 6.5s ease-in-out infinite; }
            .memphis-shape-sway { animation: memphis-sway 4s ease-in-out infinite; }
          `,
        }}
      />

      {/* Floating Animated Memphis Confetti Layer (Hidden on mobile/tablet to protect text) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden hidden xl:block"
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* 1. Coral Triangle (Far Outer Top Left) */}
        <div className="absolute top-[4%] left-[1.5%] memphis-shape-bob">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
            <polygon
              points="22,4 40,38 4,38"
              fill="#ff5b57"
              stroke="#17140d"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 2. Teal Quarter-Arc (Far Outer Top Right) */}
        <div className="absolute top-[6%] right-[1.5%] memphis-shape-spin">
          <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
            <path
              d="M 4 4 A 44 44 0 0 1 48 48 L 4 48 Z"
              fill="#12b3a4"
              stroke="#17140d"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* 3. Electric Indigo Pill (Far Outer Mid Left) */}
        <div className="absolute top-[45%] left-[1%] memphis-shape-sway">
          <div className="w-10 h-4 rounded-full bg-[#6b5be6] border-[2.5px] border-[#17140d]" />
        </div>

        {/* 4. Yellow Sparkle Star (Far Outer Mid Right) */}
        <div className="absolute top-[50%] right-[1.5%] memphis-shape-spin-rev">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2 L19 12 L29 12 L21 18 L24 28 L16 22 L8 28 L11 18 L3 12 L13 12 Z"
              fill="#ffc531"
              stroke="#17140d"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 5. Coral Donut (Far Outer Bottom Left) */}
        <div className="absolute bottom-[5%] left-[2%] memphis-shape-bob-alt">
          <div className="w-8 h-8 rounded-full border-[3px] border-[#ff5b57] bg-transparent" />
        </div>

        {/* 6. Teal Cross (Far Outer Bottom Right) */}
        <div className="absolute bottom-[8%] right-[2%] memphis-shape-bob">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2 V26 M2 14 H26"
              stroke="#12b3a4"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
