"use client";

import React from "react";
import { FolderGit2, Terminal, Star, GitBranch, ShieldCheck } from "lucide-react";

export default function DeverProjectTerminal() {
  return (
    <div className="relative w-full rounded-2xl border border-[#0066CC]/30 bg-gradient-to-br from-[#08152B] via-[#0B1F40] to-[#040E1E] p-6 shadow-xl my-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-[#0066CC]" />
          <h3 className="text-base font-bold text-white font-sans">DEVER Project Incubator & Lab</h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-blue-300">
          <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> main
        </div>
      </div>

      <div className="bg-[#030914]/90 rounded-xl p-5 border border-white/10 font-mono text-xs leading-relaxed text-slate-200">
        <div className="flex items-center justify-between text-slate-400 mb-3 pb-2 border-b border-white/5">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Terminal className="w-4 h-4 text-[#0066CC]" />
            $ git status --portfolio
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> 12 Active Projects
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-blue-400">&gt; Initializing DEVER Member Open Source Repositories...</p>
          <p className="text-slate-300">
            [1] <span className="text-teal-300 font-bold">FU-DEVER Web Platform v2</span> — <span className="text-slate-400">Next.js 14, Express, MongoDB</span>
          </p>
          <p className="text-slate-300">
            [2] <span className="text-teal-300 font-bold">LeetCode Realtime Sync Bot</span> — <span className="text-slate-400">GraphQL, TypeScript, Socket.io</span>
          </p>
          <p className="text-slate-300">
            [3] <span className="text-teal-300 font-bold">Smart QR Event Checkin</span> — <span className="text-slate-400">Google Script Auto-Sync</span>
          </p>
          <p className="text-emerald-400 flex items-center gap-1 mt-2">
            <ShieldCheck className="w-4 h-4" /> All modules compiled successfully with 0 errors.
          </p>
        </div>
      </div>
    </div>
  );
}
