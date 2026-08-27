"use client";

import React from "react";
import { Terminal, Trophy, Rocket, Code2, Zap } from "lucide-react";

export interface DeverFloatingStickersProps {
  className?: string;
}

/**
 * DeverFloatingStickers
 *
 * Lightweight, playful floating stickers that stay strictly on outer margins
 * without overlapping member photos or text on any device.
 * Hidden on mobile/tablet to protect photo visibility.
 */
export default function DeverFloatingStickers({ className = "" }: DeverFloatingStickersProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 select-none overflow-hidden hidden xl:block ${className}`}
      aria-hidden="true"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes sticker-float-1 {
              0%, 100% { transform: translateY(0px) rotate(-4deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            @keyframes sticker-float-2 {
              0%, 100% { transform: translateY(0px) rotate(5deg); }
              50% { transform: translateY(12px) rotate(-2deg); }
            }
            @keyframes sticker-float-3 {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-8px) scale(1.04); }
            }
            @keyframes sticker-spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            .animate-sticker-1 { animation: sticker-float-1 5s ease-in-out infinite; }
            .animate-sticker-2 { animation: sticker-float-2 6.5s ease-in-out infinite; }
            .animate-sticker-3 { animation: sticker-float-3 4.5s ease-in-out infinite; }
            .animate-sticker-spin { animation: sticker-spin-slow 22s linear infinite; }
          `,
        }}
      />

      {/* Sticker 1: Outer Top Right (Far away from image3) */}
      <div className="absolute top-[8%] right-[2%] animate-sticker-1 opacity-80">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff5b57] text-white text-xs font-black border-[2px] border-[#17140d] shadow-[2px_2px_0_#17140d]">
          <Rocket className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>SHIP IT 🚀</span>
        </div>
      </div>

      {/* Sticker 2: Outer Top Left (Far away from image1) */}
      <div className="absolute top-[8%] left-[2%] animate-sticker-2 opacity-80">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#12b3a4] text-white text-xs font-mono font-black border-[2px] border-[#17140d] shadow-[2px_2px_0_#17140d]">
          <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>&lt;code&gt;clean&lt;/code&gt;</span>
        </div>
      </div>

      {/* Sticker 3: Outer Bottom Right (Far away from image4) */}
      <div className="absolute bottom-[6%] right-[2%] animate-sticker-3 opacity-80">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffc531] text-[#17140d] text-xs font-black border-[2px] border-[#17140d] shadow-[2px_2px_0_#17140d] rotate-3">
          <Zap className="w-3.5 h-3.5 fill-[#17140d] stroke-[2]" />
          <span>100% HANDS-ON</span>
        </div>
      </div>

      {/* Sticker 4: Outer Bottom Left (Far away from image2) */}
      <div className="absolute bottom-[6%] left-[2%] animate-sticker-1 opacity-80">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#6b5be6] text-white text-xs font-black border-[2px] border-[#17140d] shadow-[2px_2px_0_#17140d] -rotate-4">
          <Trophy className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />
          <span>ICPC &amp; HACKATHON</span>
        </div>
      </div>
    </div>
  );
}
