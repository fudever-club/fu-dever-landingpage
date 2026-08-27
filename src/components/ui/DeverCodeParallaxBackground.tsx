"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  Terminal,
  Cpu,
  Braces,
  Binary,
  Flame,
  Trophy,
  GitBranch,
  Sparkles,
  Zap,
  Layers,
  Database,
  Search,
  CheckCircle2,
} from "lucide-react";

export interface DeverCodeParallaxBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

interface FloatingCodeItem {
  id: number;
  content: React.ReactNode;
  top: string;
  left: string;
  depth: number;
  floatClass: string;
}

/**
 * DeverCodeParallaxBackground
 *
 * Full-page interactive floating code tokens and algorithm symbols distributed from top to bottom,
 * reacting to mouse movements across the entire page with multi-depth parallax.
 */
export default function DeverCodeParallaxBackground({
  className = "",
  children,
}: DeverCodeParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = window.innerHeight / 2; // relative to viewport
      const x = e.clientX - centerX;
      const y = (e.clientY - centerY) * 1.5;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, []);

  const items: FloatingCodeItem[] = [
    // --- TOP SECTION (Podium Area) ---
    {
      id: 1,
      content: (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/25 text-[#0066CC] font-mono text-xs font-black shadow-sm backdrop-blur-xs">
          <Braces className="w-3.5 h-3.5" />
          <span>O(log N)</span>
        </span>
      ),
      top: "4%",
      left: "4%",
      depth: 0.05,
      floatClass: "animate-code-bob-1",
    },
    {
      id: 2,
      content: (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-mono text-[11px] font-bold shadow-sm backdrop-blur-xs">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>ACCEPTED • 0ms</span>
        </span>
      ),
      top: "10%",
      left: "14%",
      depth: -0.04,
      floatClass: "animate-code-bob-2",
    },
    {
      id: 3,
      content: (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 font-mono text-xs font-black shadow-sm backdrop-blur-xs">
          <Trophy className="w-3.5 h-3.5 fill-amber-500/30" />
          <span>BEATS 100%</span>
        </span>
      ),
      top: "5%",
      left: "82%",
      depth: -0.06,
      floatClass: "animate-code-bob-2",
    },
    {
      id: 4,
      content: (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 font-mono text-[11px] font-bold backdrop-blur-xs">
          <Binary className="w-3.5 h-3.5" />
          <span>binary_search()</span>
        </span>
      ),
      top: "12%",
      left: "75%",
      depth: 0.04,
      floatClass: "animate-code-bob-1",
    },
    {
      id: 5,
      content: (
        <span className="px-2.5 py-1 rounded-lg bg-slate-900/5 border border-slate-900/10 text-slate-700 font-mono text-xs font-semibold backdrop-blur-xs">
          <code>dp[i][j] = min(...)</code>
        </span>
      ),
      top: "18%",
      left: "3%",
      depth: 0.06,
      floatClass: "animate-code-bob-3",
    },
    {
      id: 6,
      content: (
        <span className="px-3 py-1 rounded-xl bg-[#0080FF]/10 border border-[#0080FF]/25 text-[#0066CC] font-mono text-xs font-black shadow-sm backdrop-blur-xs">
          <code>root.left &amp;&amp; root.right</code>
        </span>
      ),
      top: "20%",
      left: "85%",
      depth: -0.05,
      floatClass: "animate-code-bob-3",
    },

    // --- MID SECTION (Around Top of Table) ---
    {
      id: 7,
      content: (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 font-mono text-xs font-bold backdrop-blur-xs">
          <Code2 className="w-3.5 h-3.5" />
          <span>fn solve()</span>
        </span>
      ),
      top: "32%",
      left: "2%",
      depth: -0.05,
      floatClass: "animate-code-bob-1",
    },
    {
      id: 8,
      content: (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 font-mono text-xs font-bold backdrop-blur-xs">
          <Zap className="w-3.5 h-3.5" />
          <span>stack.push()</span>
        </span>
      ),
      top: "35%",
      left: "87%",
      depth: 0.05,
      floatClass: "animate-code-bob-2",
    },
    {
      id: 9,
      content: (
        <span className="px-2.5 py-1 rounded-lg bg-[#0066CC] text-white font-mono text-[11px] font-black shadow-md">
          #LeetCode 300
        </span>
      ),
      top: "45%",
      left: "4%",
      depth: 0.04,
      floatClass: "animate-code-bob-3",
    },
    {
      id: 10,
      content: (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-700 font-mono text-xs font-bold backdrop-blur-xs">
          <GitBranch className="w-3.5 h-3.5" />
          <span>git commit -m &quot;AC&quot;</span>
        </span>
      ),
      top: "48%",
      left: "84%",
      depth: -0.05,
      floatClass: "animate-code-bob-1",
    },

    // --- LOWER SECTION (Mid-to-Bottom of Table) ---
    {
      id: 11,
      content: (
        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-700 font-mono text-[11px] font-extrabold backdrop-blur-xs">
          O(1) Space ⚡
        </span>
      ),
      top: "60%",
      left: "3%",
      depth: -0.04,
      floatClass: "animate-code-bob-2",
    },
    {
      id: 12,
      content: (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 font-mono text-[11px] font-bold backdrop-blur-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>TwoPointers</span>
        </span>
      ),
      top: "63%",
      left: "86%",
      depth: 0.06,
      floatClass: "animate-code-bob-3",
    },
    {
      id: 13,
      content: (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600/10 border border-blue-600/25 text-[#0066CC] font-mono text-xs font-black backdrop-blur-xs">
          <Database className="w-3.5 h-3.5" />
          <span>HashMap&lt;K, V&gt;</span>
        </span>
      ),
      top: "75%",
      left: "2%",
      depth: 0.05,
      floatClass: "animate-code-bob-1",
    },
    {
      id: 14,
      content: (
        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-mono text-[11px] font-bold shadow-sm">
          <code>while (left &lt;= right)</code>
        </span>
      ),
      top: "78%",
      left: "82%",
      depth: -0.05,
      floatClass: "animate-code-bob-2",
    },
    {
      id: 15,
      content: (
        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-700 font-mono text-xs font-bold backdrop-blur-xs">
          Recursion (DFS/BFS)
        </span>
      ),
      top: "88%",
      left: "4%",
      depth: -0.03,
      floatClass: "animate-code-bob-3",
    },
    {
      id: 16,
      content: (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 font-mono text-[11px] font-black backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Top 1% Global</span>
        </span>
      ),
      top: "92%",
      left: "85%",
      depth: 0.04,
      floatClass: "animate-code-bob-1",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-screen ${className}`}
    >
      {/* Floating Keyframe Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes code-bob-1 {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            @keyframes code-bob-2 {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(12px) rotate(-3deg); }
            }
            @keyframes code-bob-3 {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-8px) scale(1.04); }
            }

            .animate-code-bob-1 { animation: code-bob-1 5s ease-in-out infinite; }
            .animate-code-bob-2 { animation: code-bob-2 6.5s ease-in-out infinite; }
            .animate-code-bob-3 { animation: code-bob-3 4.5s ease-in-out infinite; }
          `,
        }}
      />

      {/* Parallax Floating Code Symbols Layer spanning the whole page */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        {items.map((item) => {
          const shiftX = offset.x * item.depth;
          const shiftY = offset.y * item.depth;

          return (
            <div
              key={item.id}
              className={`absolute hidden md:block ${item.floatClass}`}
              style={{
                top: item.top,
                left: item.left,
                transform: `translate3d(${shiftX}px, ${shiftY}px, 0)`,
                transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
