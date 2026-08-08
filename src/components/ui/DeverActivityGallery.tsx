"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, Calendar } from "lucide-react";

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  date: string;
  src: string;
}

export default function DeverActivityGallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const images: GalleryImage[] = [
    {
      id: 1,
      title: "Hành trình Leo núi Kỷ niệm 25 Năm FPT Education",
      category: "Teambuilding",
      date: "Tháng 3/2026",
      src: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg"
    },
    {
      id: 2,
      title: "Chinh phục Làng Giáo FPT Đỉnh Cao 2026",
      category: "Sự kiện",
      date: "Tháng 4/2026",
      src: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg"
    },
    {
      id: 3,
      title: "Giao lưu & Check-in FPT Quy Nhơn AI Campus",
      category: "Workshop",
      date: "Tháng 5/2026",
      src: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg"
    }
  ];

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0066CC]" />
            Hình Ảnh Hoạt Động &amp; Khoảnh Khắc DEVER
          </h2>
          <p className="text-xs text-slate-500 mt-1">Nơi lưu giữ các kỷ niệm Teambuilding, Hackathon &amp; Workshop thực tế</p>
        </div>
      </div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => setSelectedIdx(idx)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={img.src}
                alt={img.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%2306101E'/><rect width='100%' height='100%' fill='url(%23g)'/><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%230066CC' stop-opacity='0.4'/><stop offset='100%' stop-color='%23004C99' stop-opacity='0.8'/></linearGradient></defs><circle cx='400' cy='225' r='120' fill='%230066CC' opacity='0.2'/><text x='50%' y='48%' font-family='sans-serif' font-weight='bold' font-size='24' fill='%23FFFFFF' text-anchor='middle'>FU-DEVER Activity</text></svg>";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0066CC] text-white">
                  {img.category}
                </span>
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-400" /> {img.date}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug group-hover:text-blue-300 transition-colors">
                {img.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal Overlay */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full space-y-4 text-center">
            <div className="relative max-h-[75vh] w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <img
                src={images[selectedIdx].src}
                alt={images[selectedIdx].title}
                className="w-full max-h-[75vh] object-contain mx-auto"
              />
            </div>
            <div className="text-white space-y-1">
              <h3 className="text-lg font-bold">{images[selectedIdx].title}</h3>
              <p className="text-xs text-blue-200">{images[selectedIdx].category} • {images[selectedIdx].date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
