"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js in production only. Localhost dev stays SW-free so stale
 * caches can never mask fresh edits during development.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
