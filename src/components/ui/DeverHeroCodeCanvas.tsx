"use client";

import React from "react";
import { Terminal, Code2, Cpu, Sparkles, Shield, Zap } from "lucide-react";

interface DeverHeroCodeCanvasProps {
  title?: string;
  subtitle?: string;
}

export default function DeverHeroCodeCanvas({
  title = "FU-DEVER Tech Hub 2026",
  subtitle = "Next-Gen Web & Software Engineering Community"
}: DeverHeroCodeCanvasProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#0066CC]/30 bg-gradient-to-br from-[#06101E] via-[#0B1D3A] to-[#040C18] p-6 shadow-2xl shadow-[#0066CC]/20 my-6">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0066cc15_1px,transparent_1px),linear-gradient(to_bottom,#0066cc15_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
      
      {/* Top IDE Window Control Bar */}
      <div className="relative flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm" />
          <span className="ml-3 text-xs font-mono text-blue-300/70 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#0066CC]" />
            fu_dever_core_app.ts
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#0066CC]/20 text-[#38BDF8] border border-[#0066CC]/40">
            <Zap className="w-3 h-3" /> Live Engine
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Shield className="w-3 h-3" /> Gen 9 (K21)
          </span>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Code Preview */}
        <div className="md:col-span-7 bg-[#030914]/80 backdrop-blur-md rounded-xl p-5 border border-[#0066CC]/30 font-mono text-xs text-slate-200 leading-relaxed shadow-inner">
          <div className="flex items-center gap-2 text-slate-400 mb-3 pb-2 border-b border-white/5">
            <Code2 className="w-4 h-4 text-[#0066CC]" />
            <span className="text-[11px] text-blue-400 font-semibold">{"// Club Mission Execution"}</span>
          </div>

          <p className="text-purple-400">
            <span className="text-blue-400">const</span> <span className="text-yellow-300">deverClub</span> = <span className="text-blue-400">new</span> <span className="text-teal-300">AcademicCommunity</span>({`{`}
          </p>
          <p className="pl-4 text-slate-300">
            name: <span className="text-emerald-300">&quot;FU-DEVER Programmers&quot;</span>,
          </p>
          <p className="pl-4 text-slate-300">
            campus: <span className="text-emerald-300">&quot;FPT University Da Nang&quot;</span>,
          </p>
          <p className="pl-4 text-slate-300">
            tracks: [<span className="text-emerald-300">&quot;Web Dev&quot;</span>, <span className="text-emerald-300">&quot;LeetCode ICPC&quot;</span>, <span className="text-emerald-300">&quot;AI & Backend&quot;</span>],
          </p>
          <p className="pl-4 text-slate-300">
            activeMembers: <span className="text-amber-400">150+</span>,
          </p>
          <p className="text-purple-400">{`}`});</p>
          
          <p className="mt-3 text-blue-400">
            <span className="text-purple-400">await</span> deverClub.<span className="text-yellow-300">empowerStudents</span>();
          </p>
        </div>

        {/* Right Column: Visual Badges & Stats */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-gradient-to-r from-[#0066CC]/20 to-[#004C99]/20 border border-[#0066CC]/40 rounded-xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#0066CC] text-white shadow-lg shadow-[#0066CC]/40">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-sans">{title}</h4>
                <p className="text-xs text-blue-200/80 font-sans mt-0.5">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#08152B]/90 border border-white/10 rounded-xl p-3.5 text-center">
              <span className="block text-lg font-bold font-mono text-teal-400">100%</span>
              <span className="text-[11px] text-slate-400 font-sans">Handcrafted Code</span>
            </div>
            <div className="bg-[#08152B]/90 border border-white/10 rounded-xl p-3.5 text-center">
              <span className="flex items-center justify-center gap-1 text-lg font-bold font-mono text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                2026
              </span>
              <span className="text-[11px] text-slate-400 font-sans">Gen 9 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
