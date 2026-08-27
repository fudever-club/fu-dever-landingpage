"use client";

import React from "react";
import { Sparkles, Terminal, Trophy, Zap, Rocket, Code2 } from "lucide-react";

export interface DeverFloatingStickersProps {
  className?: string;
}

/**
 * DeverFloatingStickers
 *
 * Lightweight, playful floating stickers and badges that bob and drift gracefully
 * across the background without blocking interactions.
 */
export default function DeverFloatingStickers({ className = "" }: DeverFloatingStickersProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes sticker-float-1 {
              0%, 100% { transform: translateY(0px) rotate(-4deg); }
              50% { transform: translateY(-12px) rotate(2deg); }
            }
            @keyframes sticker-float-2 {
              0%, 100% { transform: translateY(0px) rotate(6deg); }
              50% { transform: translateY(14px) rotate(-2deg); }
            }
            @keyframes sticker-float-3 {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-10px) scale(1.05); }
            }
            @keyframes sticker-spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            .animate-sticker-1 {
              animation: sticker-float-1 5s ease-in-out infinite;
            }
            .animate-sticker-2 {
              animation: sticker-float-2 6.5s ease-in-out infinite;
            }
            .animate-sticker-3 {
              animation: sticker-float-3 4.5s ease-in-out infinite;
            }
            .animate-sticker-spin {
              animation: sticker-spin-slow 20s linear infinite;
            }
          `,
        }}
      />

      {/* Sticker 1: Top Right - SHIP IT Pill */}
      <div className="absolute top-[14%] right-[4%] sm:right-[8%] animate-sticker-1 hidden sm:block">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff5b57] text-white text-xs font-black border-[2.5px] border-[#17140d] shadow-[3px_3px_0_#17140d]">
          <Rocket className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>SHIP IT 🚀</span>
        </div>
      </div>

      {/* Sticker 2: Top Left - CLEAN CODE Tag */}
      <div className="absolute top-[20%] left-[3%] sm:left-[6%] animate-sticker-2 hidden sm:block">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#12b3a4] text-white text-xs font-mono font-black border-[2.5px] border-[#17140d] shadow-[3px_3px_0_#17140d]">
          <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>&lt;code&gt;clean&lt;/code&gt;</span>
        </div>
      </div>

      {/* Sticker 3: Mid Right - 100% MENTORSHIP Star Badge */}
      <div className="absolute top-[52%] right-[2%] sm:right-[5%] animate-sticker-3 hidden md:block">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffc531] text-[#17140d] text-xs font-black border-[2.5px] border-[#17140d] shadow-[3px_3px_0_#17140d] rotate-3">
          <Zap className="w-3.5 h-3.5 fill-[#17140d] stroke-[2]" />
          <span>100% HANDS-ON</span>
        </div>
      </div>

      {/* Sticker 4: Bottom Left - ICPC VICTORY Pill */}
      <div className="absolute bottom-[18%] left-[4%] sm:left-[7%] animate-sticker-1 hidden sm:block">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#6b5be6] text-white text-xs font-black border-[2.5px] border-[#17140d] shadow-[3px_3px_0_#17140d] -rotate-6">
          <Trophy className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />
          <span>ICPC &amp; HACKATHON</span>
        </div>
      </div>

      {/* Sticker 5: Floating Memphis Star / Sparkle Shape */}
      <div className="absolute top-[68%] left-[12%] animate-sticker-spin hidden lg:block opacity-75">
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

      {/* Sticker 6: Floating Sky Zigzag */}
      <div className="absolute top-[35%] right-[14%] animate-sticker-2 hidden lg:block opacity-75">
        <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
          <path
            d="M2 16 L12 4 L22 16 L32 4 L42 16"
            stroke="#3aa0ff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
