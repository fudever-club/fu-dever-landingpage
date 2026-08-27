"use client";

import React, { useRef, useState, useEffect } from "react";

export interface DeverGridBackgroundProps {
  className?: string;
  gridSize?: number;
  children?: React.ReactNode;
  variant?: "grid" | "dots" | "cross";
}

/**
 * DeverGridBackground (1. Interactive Grid & Dot Matrix)
 *
 * High-performance blueprint grid & dot pattern with an interactive radial spotlight
 * following the cursor.
 */
export default function DeverGridBackground({
  className = "",
  gridSize = 32,
  variant = "grid",
  children,
}: DeverGridBackgroundProps) {
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
      className={`relative w-full overflow-hidden ${className}`}
    >
      {/* Base Grid Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 select-none"
        style={{
          backgroundImage:
            variant === "dots"
              ? `radial-gradient(circle, #0066CC 1.2px, transparent 1.2px)`
              : variant === "cross"
              ? `radial-gradient(circle, #0066CC 1.5px, transparent 1.5px), linear-gradient(to right, rgba(0, 102, 204, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 102, 204, 0.05) 1px, transparent 1px)`
              : `linear-gradient(to right, rgba(0, 102, 204, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 102, 204, 0.07) 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Interactive Cursor Spotlight Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 102, 204, 0.12), transparent 80%)`,
        }}
      />

      {/* Highlighted Grid Intersection on Hover */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.8 : 0,
          backgroundImage: `linear-gradient(to right, rgba(0, 128, 255, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 128, 255, 0.25) 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
