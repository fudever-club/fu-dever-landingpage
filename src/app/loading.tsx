import React from "react";

/**
 * Root Loading Skeleton (Next.js 14 App Router)
 *
 * Automatically rendered by Next.js during route transitions when fetching server data.
 * Lightweight, elegant, and provides seamless visual continuity without jarring white screens.
 */
export default function RootLoading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Central Modern Micro Spinner */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0066CC] border-r-[#0080FF] animate-spin" />
        {/* Inner Counter Ring */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-400 border-l-[#0066CC] animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        {/* Center Code Symbol */}
        <div className="w-8 h-8 rounded-xl bg-blue-50/80 flex items-center justify-center text-[#0066CC] font-mono text-xs font-bold shadow-inner">
          &lt;/&gt;
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-500 font-sans tracking-wide animate-pulse">
        Đang tải nội dung...
      </p>

      {/* Subtle Skeleton Grid Previews */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3 animate-pulse"
          >
            <div className="h-40 rounded-xl bg-slate-100" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
