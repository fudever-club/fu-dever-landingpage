"use client";

import React, { useEffect, useRef } from "react";

export interface DeverParticleNetworkProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  lineColor?: string;
  maxDistance?: number;
  children?: React.ReactNode;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

/**
 * DeverParticleNetwork (4. Cosmic Star Constellation Network)
 *
 * Vibrant cosmic blue stars with subtle twinkling and delicate celestial constellation webs
 * that softly attract and connect to the cursor.
 */
export default function DeverParticleNetwork({
  className = "",
  particleCount = 55,
  particleColor = "#0080FF",
  lineColor = "rgba(0, 102, 204, 0.22)",
  maxDistance = 130,
  children,
}: DeverParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    // Cosmic blue star color palette
    const starColors = [
      "#0066CC", // DEVER Blue
      "#0080FF", // Royal Star Blue
      "#38BDF8", // Electric Cyan
      "#0284C7", // Deep Sky Blue
      "#60A5FA", // Soft Nebula Blue
    ];

    // Initialize cosmic star particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2 + 1.8; // 1.8px to 3.8px
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius,
        baseRadius: radius,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: Math.random() * 0.04 + 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

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
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and connect stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently on borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Star twinkle effect
        p.twinklePhase += p.twinkleSpeed;
        const twinkleAlpha = 0.65 + Math.sin(p.twinklePhase) * 0.35;

        // Mouse interaction (celestial attraction)
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          p.radius = p.baseRadius * 1.4;
          // Connect star to cursor with glowing cyan web line
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 128, 255, ${0.45 * (1 - distMouse / mouse.radius)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          p.radius = p.baseRadius;
        }

        // Draw glowing celestial star dot
        ctx.save();
        ctx.globalAlpha = twinkleAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#0080FF";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // Connect nearby constellation stars
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 102, 204, ${(alpha * 0.28).toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [particleCount, particleColor, lineColor, maxDistance]);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 select-none block w-full h-full"
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
