"use client";

import { useEffect, useState } from "react";

/**
 * usePrefersReducedMotion — single source of truth for honoring the OS
 * `prefers-reduced-motion` setting in landing interactive components.
 * Returns true when the user asks for reduced motion; subscribes to changes.
 */
export default function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }
    // Fallback for older browsers.
    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  return prefersReduced;
}
