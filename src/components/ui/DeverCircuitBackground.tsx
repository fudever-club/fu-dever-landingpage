"use client";

import React, { useRef, useState } from "react";

export interface DeverCircuitBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * DeverCircuitBackground (Symmetrical, Subtle & Full-Bleed PCB Tech Canvas)
 *
 * Symmetrical, balanced circuit board lines distributed along the outer margins
 * with soft low-opacity pulses that complement rather than overwhelm blog content.
 */
export default function DeverCircuitBackground({
  className = "",
  children,
}: DeverCircuitBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full min-h-screen ${className}`}
    >
      {/* Circuit Animation Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse-flow-left {
              0% { stroke-dashoffset: 800; }
              100% { stroke-dashoffset: -800; }
            }
            @keyframes pulse-flow-right {
              0% { stroke-dashoffset: -800; }
              100% { stroke-dashoffset: 800; }
            }
            @keyframes chip-gentle-glow {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.1); }
            }

            .circuit-pulse-left {
              stroke-dasharray: 80, 400;
              animation: pulse-flow-left 6s linear infinite;
            }
            .circuit-pulse-right {
              stroke-dasharray: 80, 400;
              animation: pulse-flow-right 7s linear infinite;
            }
            .chip-pulse-dot {
              animation: chip-gentle-glow 3.5s ease-in-out infinite;
              transform-origin: center;
            }
          `,
        }}
      />

      {/* Subtle Repeating Blueprint Grid Pattern in Background (Very Faint) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25 select-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 102, 204, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 102, 204, 0.05) 1px, transparent 1px)`,
          backgroundSize: `48px 48px`,
        }}
      />

      {/* Symmetrical Left Circuit Wing */}
      <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-28 sm:w-56 md:w-80 lg:w-96 z-0 select-none overflow-hidden opacity-40 sm:opacity-60">
        <svg
          className="h-full w-full"
          viewBox="0 0 320 1800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="leftCircuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="50%" stopColor="#0080FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static Track Lines (Left) */}
          <g stroke="rgba(0, 102, 204, 0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            {/* Top Branch */}
            <path d="M 0,80 L 120,80 L 170,130 L 170,350 L 220,400 L 300,400" />
            <path d="M 60,0 L 60,180 L 110,230 L 110,500 L 70,540 L 70,750" />
            
            {/* Middle Branch */}
            <path d="M 0,600 L 90,600 L 140,650 L 140,950 L 200,1010 L 280,1010" />
            <path d="M 0,850 L 70,850 L 110,890 L 110,1200 L 160,1250 L 260,1250" />
            
            {/* Lower Branch */}
            <path d="M 0,1150 L 80,1150 L 130,1200 L 130,1450 L 180,1500 L 270,1500" />
            <path d="M 50,1350 L 50,1550 L 100,1600 L 100,1800" />
          </g>

          {/* Animated Light Pulses (Left) */}
          <g stroke="url(#leftCircuitGrad)" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M 0,80 L 120,80 L 170,130 L 170,350 L 220,400 L 300,400" className="circuit-pulse-left" />
            <path d="M 0,600 L 90,600 L 140,650 L 140,950 L 200,1010 L 280,1010" className="circuit-pulse-left" style={{ animationDelay: "2s" }} />
            <path d="M 0,1150 L 80,1150 L 130,1200 L 130,1450 L 180,1500 L 270,1500" className="circuit-pulse-left" style={{ animationDelay: "4s" }} />
          </g>

          {/* Terminating Chip Nodes */}
          <g fill="#0080FF" opacity="0.6">
            <circle cx="300" cy="400" r="3.5" className="chip-pulse-dot" />
            <circle cx="70" cy="750" r="3" />
            <circle cx="280" cy="1010" r="3.5" className="chip-pulse-dot" />
            <circle cx="260" cy="1250" r="3" />
            <circle cx="270" cy="1500" r="3" className="chip-pulse-dot" />
          </g>
        </svg>
      </div>

      {/* Symmetrical Right Circuit Wing */}
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-28 sm:w-56 md:w-80 lg:w-96 z-0 select-none overflow-hidden opacity-40 sm:opacity-60">
        <svg
          className="h-full w-full scale-x-[-1]"
          viewBox="0 0 320 1800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Static Track Lines (Right) */}
          <g stroke="rgba(0, 102, 204, 0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            {/* Top Branch */}
            <path d="M 0,80 L 120,80 L 170,130 L 170,350 L 220,400 L 300,400" />
            <path d="M 60,0 L 60,180 L 110,230 L 110,500 L 70,540 L 70,750" />
            
            {/* Middle Branch */}
            <path d="M 0,600 L 90,600 L 140,650 L 140,950 L 200,1010 L 280,1010" />
            <path d="M 0,850 L 70,850 L 110,890 L 110,1200 L 160,1250 L 260,1250" />
            
            {/* Lower Branch */}
            <path d="M 0,1150 L 80,1150 L 130,1200 L 130,1450 L 180,1500 L 270,1500" />
            <path d="M 50,1350 L 50,1550 L 100,1600 L 100,1800" />
          </g>

          {/* Animated Light Pulses (Right) */}
          <g stroke="url(#leftCircuitGrad)" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M 0,80 L 120,80 L 170,130 L 170,350 L 220,400 L 300,400" className="circuit-pulse-right" />
            <path d="M 0,600 L 90,600 L 140,650 L 140,950 L 200,1010 L 280,1010" className="circuit-pulse-right" />
            <path d="M 0,1150 L 80,1150 L 130,1200 L 130,1450 L 180,1500 L 270,1500" className="circuit-pulse-right" />
          </g>

          {/* Node Pads (Right) */}
          <g fill="#0080FF" stroke="#0066CC" strokeWidth="1">
            <circle cx="300" cy="400" r="3" className="chip-pulse-dot" />
            <circle cx="70" cy="750" r="3" />
            <circle cx="280" cy="1010" r="3" className="chip-pulse-dot" />
            <circle cx="260" cy="1250" r="3" />
            <circle cx="270" cy="1500" r="3" className="chip-pulse-dot" />
          </g>
        </svg>
      </div>

      {/* Gentle Cursor Light Spot (Very Soft) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 102, 204, 0.08), transparent 80%)`,
        }}
      />

      {/* Foreground Content - Kept clean and centered */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
