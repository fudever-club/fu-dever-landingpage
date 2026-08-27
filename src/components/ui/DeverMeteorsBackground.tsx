"use client";

import React, { useMemo } from "react";

export interface DeverMeteorsBackgroundProps {
  number?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * DeverMeteorsBackground (3. Subtle & Elegant Shooting Meteors)
 *
 * Delicate, soft-glowing shooting stars that streak gently and organically
 * across the background without distracting from foreground content.
 */
export default function DeverMeteorsBackground({
  number = 12,
  className = "",
  children,
}: DeverMeteorsBackgroundProps) {
  const meteors = useMemo(() => {
    return Array.from({ length: number }).map((_, i) => ({
      id: i,
      top: Math.floor(Math.random() * 70) - 10, // -10% to 60%
      left: Math.floor(Math.random() * 90) + 10, // 10% to 100%
      delay: (Math.random() * 6).toFixed(2), // 0 to 6s
      duration: (Math.random() * 3 + 4.5).toFixed(2), // 4.5 to 7.5s (smooth & gentle)
      size: Math.floor(Math.random() * 50) + 70, // delicate tail 70px to 120px
    }));
  }, [number]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Meteor CSS Animation Keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes meteor-fall-subtle {
              0% {
                transform: rotate(215deg) translateX(0);
                opacity: 0;
              }
              15% {
                opacity: 0.7;
              }
              60% {
                opacity: 0.5;
              }
              100% {
                transform: rotate(215deg) translateX(-500px);
                opacity: 0;
              }
            }

            .meteor-streak-subtle {
              animation-name: meteor-fall-subtle;
              animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
              animation-iteration-count: infinite;
            }
          `,
        }}
      />

      {/* Subtle Shooting Meteors Layer */}
      <div className="pointer-events-none absolute inset-0 z-1 select-none overflow-hidden opacity-80" aria-hidden="true">
        {meteors.map((m) => (
          <span
            key={m.id}
            className="meteor-streak-subtle absolute top-0 left-0 h-[1.2px] rounded-full bg-gradient-to-r from-cyan-200/90 via-sky-400/40 to-transparent"
            style={{
              top: `${m.top}%`,
              left: `${m.left}%`,
              width: `${m.size}px`,
              animationDelay: `${m.delay}s`,
              animationDuration: `${m.duration}s`,
            }}
          >
            {/* Tiny Soft Glowing Star Head */}
            <span className="absolute -left-1 -top-[1.5px] h-1 w-1 rounded-full bg-cyan-100/90 shadow-[0_0_6px_1.5px_rgba(56,189,248,0.7)]" />
          </span>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
