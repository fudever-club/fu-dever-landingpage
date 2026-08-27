"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  Globe2,
  BrainCircuit,
  Trophy,
} from "lucide-react";
import DeverMeteorsBackground from "./DeverMeteorsBackground";

interface DeverEventHeroProps {
  onRegisterClick?: () => void;
}

export default function DeverEventHero({ onRegisterClick }: DeverEventHeroProps) {
  // Ticket 3D Tilt
  const ticketRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 22,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ticketRef.current) return;
    const rect = ticketRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 mb-10">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#003B80] via-[#0055B8] to-[#0066CC] shadow-xl border border-blue-400/25 overflow-hidden">
        {/* Meteors flying directly inside the ocean gradient */}
        <DeverMeteorsBackground number={20} className="p-8 sm:p-10 lg:p-12 text-white">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Clean & Minimalist Headline */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 text-xs font-semibold text-blue-100 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FU-DEVER WORKSHOPS &amp; EVENTS</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Sự Kiện &amp; Workshop <br />
                <span className="text-cyan-300">Công Nghệ</span>
              </h1>

              <p className="text-blue-100/90 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
                Không gian chia sẻ kiến thức chuyên sâu, kết nối diễn giả và nâng cao kỹ năng lập trình thực chiến cùng FU-DEVER.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-blue-100">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs">
                  <Globe2 className="h-3.5 w-3.5 text-cyan-300" /> Web Fullstack
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs">
                  <BrainCircuit className="h-3.5 w-3.5 text-cyan-300" /> AI &amp; Machine Learning
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs">
                  <Trophy className="h-3.5 w-3.5 text-cyan-300" /> ICPC &amp; LeetCode
                </span>
              </div>
            </div>

            {/* RIGHT: Clean Modern Digital Event Pass */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end perspective-[1000px]">
              <div
                ref={ticketRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  transition: "transform 0.15s ease-out",
                }}
                className="relative w-full max-w-[390px] rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/25 shadow-2xl p-5 sm:p-6 transition-all duration-200"
              >
                {/* Event Name */}
                <div className="space-y-1 mb-3">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    SỰ KIỆN TIẾP THEO
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    Tối Ưu Hóa Lập Trình &amp; Tích Hợp AI Web 2026
                  </h3>
                </div>

                {/* Date & Location */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>15/08/2026 (14:00 - 17:00)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Hội trường Beta, FPTU Đà Nẵng</span>
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono mb-4">
                  <div>
                    <span className="text-sm sm:text-base font-bold text-white block">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400">Ngày</span>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-bold text-white block">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400">Giờ</span>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-bold text-white block">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400">Phút</span>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-bold text-cyan-400 block">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400">Giây</span>
                  </div>
                </div>

                {/* QR Code & Register Button */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400">
                    <QrCode className="w-7 h-7 text-white" />
                    <span className="text-[11px] font-mono text-slate-400 leading-tight">
                      Check-in <br />
                      <strong className="text-slate-200">Online/Direct</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onRegisterClick}
                    className="h-9 px-4 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
                  >
                    <span>Đăng ký tham gia</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DeverMeteorsBackground>
      </div>
    </section>
  );
}
