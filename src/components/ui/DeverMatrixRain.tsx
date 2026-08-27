"use client";

import React, { useEffect, useRef } from "react";

export interface DeverMatrixRainProps {
  className?: string;
  fontSize?: number;
  speed?: number;
  color?: string;
  headColor?: string;
  opacity?: number;
  children?: React.ReactNode;
}

/**
 * DeverMatrixRain (2. Crisp & Visible Algorithm Matrix Rain)
 *
 * Falling digital characters, binary numbers, and algorithm tokens with high visibility
 * and interactive mouse reactivity.
 */
export default function DeverMatrixRain({
  className = "",
  fontSize = 13,
  speed = 36,
  color = "rgba(0, 102, 204, 0.45)",
  headColor = "#0080FF",
  opacity = 0.45,
  children,
}: DeverMatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    // Characters: Binary, Hex, Algorithm & LeetCode Tokens
    const characters = "01010101{}[]<>fn:=dpO(1)AC0x7FLEETCODE";
    const charArray = characters.split("");

    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    // Initialize drop positions randomly
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -30);
    }

    const mouse = { x: -1000, y: -1000 };

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    let lastTime = 0;
    let animationFrameId: number;

    const render = (time: number) => {
      if (time - lastTime > speed) {
        lastTime = time;

        // Clear with translucent fade
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(0, 0, width, height);

        ctx.font = `600 ${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = charArray[Math.floor(Math.random() * charArray.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Mouse proximity glow
          const distMouse = Math.hypot(mouse.x - x, mouse.y - y);
          const isNearMouse = distMouse < 90;

          if (isNearMouse) {
            ctx.fillStyle = "#0066CC";
            ctx.shadowColor = "#38BDF8";
            ctx.shadowBlur = 6;
          } else if (drops[i] === 1 || Math.random() > 0.92) {
            ctx.fillStyle = headColor;
            ctx.shadowColor = "#38BDF8";
            ctx.shadowBlur = 4;
          } else {
            ctx.fillStyle = color;
            ctx.shadowBlur = 0;
          }

          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;

          // Reset drop to top with randomized delay
          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (container) {
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [fontSize, speed, color, headColor]);

  return (
    <div ref={containerRef} className={`relative w-full min-h-screen ${className}`}>
      {/* Matrix Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 z-0 select-none block w-full h-full"
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
