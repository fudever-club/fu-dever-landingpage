"use client";

import React from "react";
import { BookOpen, CheckCircle2, ChevronRight, Code, Layers, Rocket } from "lucide-react";

export default function DeverRoadmapVector() {
  const steps = [
    { title: "Stage 1: Foundation", desc: "HTML5, CSS3, JS ES6+, Git & Data Structures", icon: Code, color: "from-[#0066CC] to-cyan-500" },
    { title: "Stage 2: Fullstack Web", desc: "React, Next.js 14, Node.js & MongoDB Atlas", icon: Layers, color: "from-[#004C99] to-blue-600" },
    { title: "Stage 3: Advanced & ICPC", desc: "LeetCode Dynamic Prog, Microservices & AI", icon: Rocket, color: "from-[#0080FF] to-indigo-600" }
  ];

  return (
    <div className="relative w-full rounded-2xl border border-[#0066CC]/30 bg-gradient-to-br from-[#071325] via-[#0D2447] to-[#040C1A] p-6 shadow-xl my-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0066CC]" />
          <h3 className="text-base font-bold text-white font-sans">Lộ Trình Đào Tạo Chuyên Môn FU-DEVER</h3>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-[#0066CC]/20 text-blue-300 border border-[#0066CC]/40">
          Standard Curriculum 2026
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {steps.map((s, idx) => {
          const IconComponent = s.icon;
          return (
            <div key={idx} className="relative group bg-[#061122]/90 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-[#0066CC]/60 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-r ${s.color} text-white shadow-md`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-80" />
              </div>
              <h4 className="text-sm font-bold text-white font-sans mb-1 flex items-center justify-between">
                {s.title}
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#0066CC] transition-colors" />
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
