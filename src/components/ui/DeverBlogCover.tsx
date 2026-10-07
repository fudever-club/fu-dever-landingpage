import React from "react";
import { Code2 } from "lucide-react";

interface DeverBlogCoverProps {
  title?: string;
  className?: string;
}

/**
 * DeverBlogCover — handcrafted CSS/SVG gradient placeholder for blog covers.
 * Replaces generic stock-photo URLs with on-brand DEVER artwork so the UI
 * never depends on external generic imagery. No AI-generated assets.
 */
export default function DeverBlogCover({ title, className = "" }: DeverBlogCoverProps) {
  return (
    <div
      role="img"
      aria-label={title ? `Ảnh minh họa bài viết: ${title}` : "Ảnh minh họa bài viết FU-DEVER"}
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#002D66] via-[#004C99] to-[#0080FF] p-5 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="relative flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/30">
          <Code2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-white">
          FU-DEVER Tech Blog
        </span>
      </div>
      {title ? (
        <p className="relative line-clamp-2 text-sm font-bold leading-snug text-white">
          {title}
        </p>
      ) : null}
    </div>
  );
}
