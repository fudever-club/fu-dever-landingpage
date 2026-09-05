"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * DeverRouteLoader (Sleek, High-Performance Page Navigation Indicator)
 *
 * Provides immediate feedback on route changes so users never wonder if a click worked.
 * 1. Top neon cyan/blue glowing progress bar (YouTube/Vercel/Linear style).
 * 2. Elegant floating glass pill if navigation takes >180ms.
 */
export default function DeverRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showPill, setShowPill] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pillTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete navigation when pathname or searchParams change
  useEffect(() => {
    setProgress(100);
    const finishTimer = setTimeout(() => {
      setIsNavigating(false);
      setShowPill(false);
      setProgress(0);
    }, 250);

    return () => clearTimeout(finishTimer);
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger progress immediately
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }

      // Check if it's an internal URL and different from current page
      try {
        const targetUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (
          targetUrl.origin === currentUrl.origin &&
          (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search)
        ) {
          // Start navigation feedback immediately
          setIsNavigating(true);
          setProgress(15);

          // Clear existing timers
          if (timerRef.current) clearInterval(timerRef.current);
          if (pillTimerRef.current) clearTimeout(pillTimerRef.current);

          // Increment progress realistically while waiting
          timerRef.current = setInterval(() => {
            setProgress((prev) => {
              if (prev < 60) return prev + Math.random() * 15;
              if (prev < 85) return prev + Math.random() * 6;
              if (prev < 95) return prev + 0.5;
              return prev;
            });
          }, 120);

          // Only show floating badge if navigation takes more than 180ms
          pillTimerRef.current = setTimeout(() => {
            setShowPill(true);
          }, 180);
        }
      } catch (err) {
        // invalid URL, ignore
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[99999]"
      aria-hidden="true"
    >
      {/* 1. Top Neon Blue Shimmer Bar */}
      <div className="relative h-[3px] w-full bg-transparent overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0066CC] via-[#0080FF] to-[#38BDF8] shadow-[0_0_10px_#38BDF8,0_0_4px_#0080FF] transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* 2. Delicate Floating Glass Pill (Appears only if route loading takes >180ms) */}
      {showPill && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-xl shadow-blue-500/10 text-white text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span className="text-slate-200 text-xs font-semibold">Đang tải trang...</span>
        </div>
      )}
    </div>
  );
}
