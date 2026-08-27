"use client";

import React, { useEffect, useRef, useState } from "react";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface GlowingEdgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: "dark" | "light";
  children?: React.ReactNode;
}

/**
 * GlowingEdgeCard
 *
 * A distinctive card component with bright, colored glowing edges that follow the mouse pointer.
 * Uses vibrant, luminous mesh gradients with radial and conic masks.
 */
export function GlowingEdgeCard({
  mode = "light",
  className,
  children,
  ...props
}: GlowingEdgeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Helper functions for math
  const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));
  const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

  const centerOfElement = (rect: DOMRect) => {
    return [rect.width / 2, rect.height / 2];
  };

  const getPointerPosition = (rect: DOMRect, e: MouseEvent | React.MouseEvent) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = clamp((100 / rect.width) * x);
    const py = clamp((100 / rect.height) * y);
    return { pixels: [x, y], percent: [px, py] };
  };

  const angleFromPointer = (dx: number, dy: number) => {
    let angleRadians = 0;
    let angleDegrees = 0;
    if (dx !== 0 || dy !== 0) {
      angleRadians = Math.atan2(dy, dx);
      angleDegrees = angleRadians * (180 / Math.PI) + 90;
      if (angleDegrees < 0) {
        angleDegrees += 360;
      }
    }
    return angleDegrees;
  };

  const closenessToEdge = (rect: DOMRect, x: number, y: number) => {
    const [cx, cy] = centerOfElement(rect);
    const dx = x - cx;
    const dy = y - cy;
    let k_x = Infinity;
    let k_y = Infinity;
    if (dx !== 0) {
      k_x = cx / Math.abs(dx);
    }
    if (dy !== 0) {
      k_y = cy / Math.abs(dy);
    }
    return clamp(1 / Math.min(k_x, k_y), 0, 1);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const position = getPointerPosition(rect, e);
    const [px, py] = position.pixels;
    const [perx, pery] = position.percent;

    const [cx, cy] = centerOfElement(rect);
    const dx = px - cx;
    const dy = py - cy;

    const edge = closenessToEdge(rect, px, py);
    const angle = angleFromPointer(dx, dy);

    cardRef.current.style.setProperty("--pointer-x", `${round(perx)}%`);
    cardRef.current.style.setProperty("--pointer-y", `${round(pery)}%`);
    cardRef.current.style.setProperty("--pointer-deg", `${round(angle)}deg`);
    cardRef.current.style.setProperty("--pointer-d", `${round(edge * 100)}`);

    if (isAnimating) {
      setIsAnimating(false);
      cardRef.current.classList.remove("animating");
    }
  };

  // Intro animation
  useEffect(() => {
    const playAnimation = () => {
      if (!cardRef.current) return;

      setIsAnimating(true);
      const angleStart = 110;
      const angleEnd = 465;

      cardRef.current.style.setProperty("--pointer-deg", `${angleStart}deg`);
      const startTime = performance.now();

      const animate = (now: number) => {
        if (!cardRef.current || !cardRef.current.classList.contains("animating")) return;
        const elapsed = now - startTime;

        if (elapsed > 300 && elapsed < 800) {
          const t = (elapsed - 300) / 500;
          const ease = 1 - Math.pow(1 - t, 3);
          cardRef.current.style.setProperty("--pointer-d", `${ease * 100}`);
        }

        if (elapsed > 300 && elapsed < 1800) {
          const t = (elapsed - 300) / 1500;
          const ease = t * t * t;
          const d = (angleEnd - angleStart) * (ease * 0.5) + angleStart;
          cardRef.current.style.setProperty("--pointer-deg", `${d}deg`);
        }

        if (elapsed >= 1800 && elapsed < 3600) {
          const t = (elapsed - 1800) / 1800;
          const ease = 1 - Math.pow(1 - t, 3);
          const d = (angleEnd - angleStart) * (0.5 + ease * 0.5) + angleStart;
          cardRef.current.style.setProperty("--pointer-deg", `${d}deg`);
        }

        if (elapsed > 2800 && elapsed < 4000) {
          const t = (elapsed - 2800) / 1200;
          const ease = t * t * t;
          cardRef.current.style.setProperty("--pointer-d", `${(1 - ease) * 100}`);
        }

        if (elapsed < 4000) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          cardRef.current?.classList.remove("animating");
        }
      };

      requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      playAnimation();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full rounded-[1.768em]",
        "group transition-all duration-300",
        isAnimating && "animating",
        className
      )}
      ref={cardRef}
      onPointerMove={handlePointerMove}
      style={
        {
          "--glow-sens": "15",
          "--pointer-x": "50%",
          "--pointer-y": "50%",
          "--pointer-deg": "45deg",
          "--pointer-d": "0",
          "--color-sens": "10",
          "--card-bg": "#FFFFFF",
          "--blend": "multiply",
          "--glow-blend": "screen",
          "--glow-color": "210deg 100% 55%",
          "--glow-boost": "30%",
          "--fg": "#0f172a",
        } as React.CSSProperties
      }
      {...props}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .glowing-card-mesh-border {
                position: absolute;
                inset: -2px;
                border-radius: inherit;
                z-index: -1;
                border: 2px solid transparent;
                background:
                    linear-gradient(#FFFFFF 0 100%) padding-box,
                    radial-gradient(at 85% 50%, hsla(215, 100%, 55%, 1) 0px, transparent 55%) border-box,
                    radial-gradient(at 65% 30%, hsla(185, 100%, 48%, 1) 0px, transparent 55%) border-box,
                    radial-gradient(at 15% 10%, hsla(268, 100%, 65%, 1) 0px, transparent 55%) border-box,
                    radial-gradient(at 40% 40%, hsla(38, 100%, 55%, 1) 0px, transparent 55%) border-box,
                    radial-gradient(at 85% 85%, hsla(160, 100%, 45%, 1) 0px, transparent 55%) border-box,
                    radial-gradient(at 10% 85%, hsla(340, 100%, 60%, 1) 0px, transparent 55%) border-box,
                    linear-gradient(135deg, #0080FF 0%, #38BDF8 50%, #A855F7 100%) border-box;
                opacity: calc((var(--pointer-d) - var(--color-sens)) / (100 - var(--color-sens)));
                mask-image: conic-gradient(from var(--pointer-deg) at center, black 30%, transparent 45%, transparent 55%, black 70%);
                transition: opacity 0.2s ease-out;
            }

            .glowing-card-mesh-bg {
                position: absolute;
                inset: 0;
                border-radius: inherit;
                z-index: -1;
                border: 1px solid transparent;
                background:
                    radial-gradient(at 80% 50%, hsla(215, 100%, 85%, 0.8) 0px, transparent 50%) padding-box,
                    radial-gradient(at 65% 30%, hsla(185, 100%, 85%, 0.8) 0px, transparent 50%) padding-box,
                    radial-gradient(at 15% 10%, hsla(268, 100%, 88%, 0.8) 0px, transparent 50%) padding-box,
                    radial-gradient(at 40% 40%, hsla(38, 100%, 85%, 0.8) 0px, transparent 50%) padding-box,
                    radial-gradient(at 85% 85%, hsla(160, 100%, 85%, 0.8) 0px, transparent 50%) padding-box,
                    linear-gradient(135deg, #E0F2FE 0%, #F3E8FF 100%) padding-box;
                mask-image:
                    linear-gradient(to bottom, black, black),
                    radial-gradient(ellipse at 50% 50%, black 50%, transparent 75%),
                    conic-gradient(from var(--pointer-deg) at center, transparent 5%, black 20%, black 80%, transparent 95%);
                mask-composite: subtract, add;
                opacity: calc((var(--pointer-d) - var(--color-sens)) / (100 - var(--color-sens)) * 0.7);
                mix-blend-mode: soft-light;
                transition: opacity 0.2s ease-out;
            }

            .glowing-card-glow {
                position: absolute;
                inset: -25px;
                pointer-events: none;
                z-index: 1;
                mask-image: conic-gradient(from var(--pointer-deg) at center, black 3%, transparent 12%, transparent 88%, black 97%);
                opacity: calc((var(--pointer-d) - var(--glow-sens)) / (100 - var(--glow-sens)));
                transition: opacity 0.2s ease-out;
                border-radius: inherit;
            }

            .glowing-card-glow::before {
                content: "";
                position: absolute;
                inset: 25px;
                border-radius: inherit;
                box-shadow:
                    0 0 10px 2px rgba(0, 128, 255, 0.45),
                    0 0 20px 4px rgba(56, 189, 248, 0.35),
                    0 0 35px 8px rgba(168, 85, 247, 0.25),
                    inset 0 0 8px 1px rgba(0, 128, 255, 0.3);
            }

            .group:not(:hover):not(.animating) .glowing-card-mesh-border,
            .group:not(:hover):not(.animating) .glowing-card-mesh-bg,
            .group:not(:hover):not(.animating) .glowing-card-glow {
                opacity: 0 !important;
                transition: opacity 0.6s ease-in-out;
            }
        `,
        }}
      />

      {/* Background Luminous Layers */}
      <div className="glowing-card-mesh-border pointer-events-none" />
      <div className="glowing-card-mesh-bg pointer-events-none" />
      <div className="glowing-card-glow pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full overflow-hidden bg-white rounded-[inherit] border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

export default GlowingEdgeCard;
