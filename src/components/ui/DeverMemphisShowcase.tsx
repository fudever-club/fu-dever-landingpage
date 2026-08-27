"use client";

import React from "react";
import Link from "next/link";
import MemphisConfettiBackground from "./MemphisConfettiBackground";
import {
  Code2,
  Terminal,
  Trophy,
  Users,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";

export default function DeverMemphisShowcase() {
  return (
    <section className="w-full bg-[#f5efe2] text-[#17140d] py-16 px-4 sm:px-6 lg:px-12 border-y-[3px] border-[#17140d] select-none">
      <MemphisConfettiBackground className="max-w-[1360px] mx-auto space-y-16">
        {/* HERO SECTION: Asymmetric 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Marker Highlights & Dual CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Violet Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6b5be6] text-white text-xs sm:text-sm font-black border-[3px] border-[#17140d] shadow-[4px_4px_0_#17140d]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffc531] border-[2px] border-[#17140d]" />
              <span>NEW • FU-DEVER INNOVATION LAB 2026</span>
            </div>

            {/* Big Headline with Marker-Highlight Bars */}
            <h2 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.05] text-[#17140d]">
              Code projects that{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">actually</span>
                <span
                  className="absolute inset-x-[-4px] bottom-1 top-2 bg-[#ffc531] border-[2.5px] border-[#17140d] -rotate-1 z-0"
                  aria-hidden="true"
                />
              </span>{" "}
              get{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-white">shipped.</span>
                <span
                  className="absolute inset-x-[-4px] bottom-1 top-2 bg-[#12b3a4] border-[2.5px] border-[#17140d] rotate-1 z-0"
                  aria-hidden="true"
                />
              </span>
            </h2>

            {/* Lead Paragraph */}
            <p className="text-base sm:text-lg text-[#17140d]/80 font-medium max-w-xl leading-relaxed">
              Môi trường học thuật phá cách tại FPT University. Nơi biến những ý tưởng táo bạo thành sản phẩm thực tế, thi đấu giải thuật ICPC và làm chủ kiến trúc phần mềm hiện đại.
            </p>

            {/* Dual Candy CTA Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-full bg-[#ff5b57] text-white font-black text-sm sm:text-base border-[3px] border-[#17140d] shadow-[6px_6px_0_#17140d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#17140d] transition-all flex items-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                <span>Khám phá dự án</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </Link>

              <Link
                href="/events"
                className="px-6 py-3.5 rounded-full bg-white text-[#17140d] font-black text-sm sm:text-base border-[3px] border-[#17140d] shadow-[6px_6px_0_#17140d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#17140d] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                <span>Lịch Workshop sắp tới</span>
              </Link>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t-[2.5px] border-[#17140d]/15">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#ff5b57] border-[3px] border-[#17140d] font-black text-white flex items-center justify-center text-xs shadow-[2px_2px_0_#17140d]">
                  P
                </div>
                <div className="w-10 h-10 rounded-full bg-[#12b3a4] border-[3px] border-[#17140d] font-black text-white flex items-center justify-center text-xs shadow-[2px_2px_0_#17140d]">
                  T
                </div>
                <div className="w-10 h-10 rounded-full bg-[#6b5be6] border-[3px] border-[#17140d] font-black text-white flex items-center justify-center text-xs shadow-[2px_2px_0_#17140d]">
                  N
                </div>
                <div className="w-10 h-10 rounded-full bg-[#ffc531] border-[3px] border-[#17140d] font-black text-[#17140d] flex items-center justify-center text-xs shadow-[2px_2px_0_#17140d]">
                  D
                </div>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#17140d]/90">
                <strong className="text-[#17140d] font-black">500+ sinh viên &amp; lập trình viên</strong> đồng hành cùng hệ sinh thái DEVER.
              </div>
            </div>
          </div>

          {/* Right Column: Tilted Product Dashboard Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] rounded-[22px] bg-white border-[3px] border-[#17140d] shadow-[10px_10px_0_#17140d] p-5 sm:p-6 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              {/* Browser Chrome Header */}
              <div className="flex items-center justify-between border-b-[2.5px] border-[#17140d] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5b57] border-[2px] border-[#17140d]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffc531] border-[2px] border-[#17140d]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#12b3a4] border-[2px] border-[#17140d]" />
                </div>
                <span className="text-xs font-mono font-bold text-[#17140d] bg-[#f5efe2] px-3 py-0.5 rounded-md border-[2px] border-[#17140d]">
                  dever-squad // sprint-08
                </span>
              </div>

              {/* Sprint Velocity Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-black text-[#17140d]">Sprint Velocity</h4>
                  <p className="text-[11px] text-[#17140d]/60 font-semibold">Tuần này • Ban Chuyên Môn</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#12b3a4] text-white text-xs font-black border-[2px] border-[#17140d] shadow-[2px_2px_0_#17140d]">
                  +38% UP
                </span>
              </div>

              {/* 6-Bar Outlined Chart */}
              <div className="p-3 rounded-xl bg-[#f5efe2] border-[2.5px] border-[#17140d] mb-4">
                <div className="h-28 flex items-end justify-between gap-2 pt-2">
                  {/* Bar 1: Mustard */}
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-[#ffc531] h-[44%] rounded-t-md border-[2px] border-[#17140d]" />
                    <span className="text-[9px] font-bold font-mono">T2</span>
                  </div>
                  {/* Bar 2: Coral */}
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-[#ff5b57] h-[62%] rounded-t-md border-[2px] border-[#17140d]" />
                    <span className="text-[9px] font-bold font-mono">T3</span>
                  </div>
                  {/* Bar 3: Violet */}
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-[#6b5be6] h-[52%] rounded-t-md border-[2px] border-[#17140d]" />
                    <span className="text-[9px] font-bold font-mono">T4</span>
                  </div>
                  {/* Bar 4: Teal */}
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-[#12b3a4] h-[82%] rounded-t-md border-[2px] border-[#17140d]" />
                    <span className="text-[9px] font-bold font-mono">T5</span>
                  </div>
                  {/* Bar 5: Sky */}
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-[#3aa0ff] h-[70%] rounded-t-md border-[2px] border-[#17140d]" />
                    <span className="text-[9px] font-bold font-mono">T6</span>
                  </div>
                  {/* Bar 6: Coral Highlight */}
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-[#ff5b57] h-[96%] rounded-t-md border-[2px] border-[#17140d]" />
                    <span className="text-[9px] font-bold font-mono">T7</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border-[2px] border-[#17140d]">
                  <div className="w-5 h-5 rounded bg-[#12b3a4] border-[2px] border-[#17140d] flex items-center justify-center text-white shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  </div>
                  <span className="text-xs font-bold text-[#17140d] line-through opacity-70">
                    Phát hành Landing Page v2
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border-[2px] border-[#17140d]">
                  <div className="w-5 h-5 rounded bg-[#12b3a4] border-[2px] border-[#17140d] flex items-center justify-center text-white shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  </div>
                  <span className="text-xs font-bold text-[#17140d] line-through opacity-70">
                    Triển khai Bento Member Profile
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border-[2px] border-[#17140d]">
                  <div className="w-5 h-5 rounded bg-white border-[2px] border-[#17140d] shrink-0" />
                  <span className="text-xs font-bold text-[#17140d]">
                    Workshop AI Engineering 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-BLEED BLACK LOGO STRIP */}
        <div className="w-full bg-[#17140d] text-white p-5 rounded-2xl border-[3px] border-[#17140d] shadow-[6px_6px_0_#ffc531] flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono font-black text-[#ffc531] uppercase tracking-widest shrink-0">
            ★ HỆ SINH THÁI ĐỐI TÁC &amp; NỀN TẢNG
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm sm:text-base font-black opacity-90">
            <span className="hover:text-[#ff5b57] transition-colors">NEXT.JS 14</span>
            <span className="hover:text-[#12b3a4] transition-colors">TYPESCRIPT</span>
            <span className="hover:text-[#3aa0ff] transition-colors">TAILWIND CSS</span>
            <span className="hover:text-[#6b5be6] transition-colors">LEETCODE ICPC</span>
            <span className="hover:text-[#ffc531] transition-colors">FPT UNIVERSITY</span>
          </div>
        </div>

        {/* THREE-UP MEMPHIS FEATURE CARDS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6b5be6] text-white text-xs font-black border-[2.5px] border-[#17140d]">
              <span>TẠI SAO CHỌN FU-DEVER</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-[#17140d]">
              Môi trường học thuật không nhàm chán.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Coral */}
            <div className="relative overflow-hidden rounded-[22px] bg-white border-[3px] border-[#17140d] p-6 shadow-[8px_8px_0_#17140d] space-y-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#17140d] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5b57] border-[3px] border-[#17140d] shadow-[4px_4px_0_#17140d] flex items-center justify-center text-white">
                <Code2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-black text-[#17140d]">Thực Chiến Dự Án</h4>
              <p className="text-sm text-[#17140d]/80 font-medium leading-relaxed">
                Tham gia phát triển các sản phẩm công nghệ thật, từ Client Portal, Landing Page đến các công cụ nội bộ phục vụ sinh viên.
              </p>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-[#ff5b57]/15 pointer-events-none" />
            </div>

            {/* Card 2: Teal */}
            <div className="relative overflow-hidden rounded-[22px] bg-white border-[3px] border-[#17140d] p-6 shadow-[8px_8px_0_#17140d] space-y-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#17140d] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#12b3a4] border-[3px] border-[#17140d] shadow-[4px_4px_0_#17140d] flex items-center justify-center text-white">
                <Trophy className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-black text-[#17140d]">Đấu Trường ICPC</h4>
              <p className="text-sm text-[#17140d]/80 font-medium leading-relaxed">
                Đào tạo giải thuật chuyên sâu, cọ xát với các đề thi LeetCode Hard và tham gia các kỳ thi lập trình quốc tế ICPC hàng năm.
              </p>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-[#12b3a4]/15 pointer-events-none" />
            </div>

            {/* Card 3: Violet */}
            <div className="relative overflow-hidden rounded-[22px] bg-white border-[3px] border-[#17140d] p-6 shadow-[8px_8px_0_#17140d] space-y-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#17140d] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#6b5be6] border-[3px] border-[#17140d] shadow-[4px_4px_0_#17140d] flex items-center justify-center text-white">
                <Users className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-black text-[#17140d]">Mạng Lưới Alumni</h4>
              <p className="text-sm text-[#17140d]/80 font-medium leading-relaxed">
                Kết nối trực tiếp cùng các cựu thành viên hiện đang là Software Engineer, Tech Lead tại các tập đoàn công nghệ lớn.
              </p>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-[#6b5be6]/15 pointer-events-none" />
            </div>
          </div>
        </div>
      </MemphisConfettiBackground>
    </section>
  );
}
