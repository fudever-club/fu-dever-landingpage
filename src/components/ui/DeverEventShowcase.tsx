"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  AlertTriangle,
  RefreshCw,
  Inbox,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Sparkles,
  Radio,
  Clock3,
  History,
  PauseCircle,
} from "lucide-react";

interface EventItem {
  _id?: string;
  id?: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
  speakers: string;
  category?: string;
  registerUrl?: string;
  coverImage?: string;
}

function resolveEventImageUrl(url?: string): string {
  if (!url) return "";
  const gDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }
  const gDriveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (gDriveIdMatch && gDriveIdMatch[1] && url.includes("drive.google.com")) {
    return `https://lh3.googleusercontent.com/d/${gDriveIdMatch[1]}`;
  }
  return url;
}

export function renderShowcaseStatusBadge(status?: string) {
  switch (status) {
    case "Đang mở đăng ký":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0066CC] border border-blue-200 shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0066CC]"></span>
          </span>
          <CheckCircle2 className="w-3 h-3 text-[#0066CC]" />
          <span>Đang mở đăng ký</span>
        </span>
      );
    case "Đang diễn ra":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
          </span>
          <Radio className="w-3 h-3 text-rose-600 animate-pulse" />
          <span>Đang diễn ra</span>
        </span>
      );
    case "Sắp diễn ra":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
          <Clock3 className="w-3 h-3 text-amber-600" />
          <span>Sắp diễn ra</span>
        </span>
      );
    case "Tạm hoãn":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
          <PauseCircle className="w-3 h-3 text-purple-600" />
          <span>Tạm hoãn</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
          <History className="w-3 h-3 text-slate-500" />
          <span>{status || "Đã kết thúc"}</span>
        </span>
      );
  }
}

export default function DeverEventShowcase() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch("http://localhost:5000/api/v1/events");
      if (!res.ok) throw new Error("Không thể kết nối API Backend");
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data || [];
      setEvents(data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (evt: EventItem) => {
    const id = evt._id || String(evt.id);
    setRegisteringId(id);

    // Simulate API registration delay & success feedback
    setTimeout(() => {
      setRegisteringId(null);
      setSuccessToast(`Đã gửi yêu cầu đăng ký tham gia "${evt.title}"!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1200);
  };

  const filteredEvents = events.filter((evt) => {
    const matchSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || (evt.category && evt.category === selectedCategory);
    return matchSearch && matchCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Toast Success Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/90 text-emerald-200 border border-emerald-500/40 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Control Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0066CC]/10 text-[#0066CC] dark:text-blue-400 border border-[#0066CC]/20">
              FU-DEVER 2026
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sự Kiện &amp; Workshop Chuyên Môn
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Rèn luyện kỹ năng lập trình thực chiến và thi đấu cùng cộng đồng
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] transition-all"
            />
          </div>
        </div>
      </div>

      {/* STATE 2: LOADING STATE (Skeleton pulse) */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full pt-2" />
            </div>
          ))}
        </div>
      )}

      {/* STATE 4: ERROR STATE (Clear Message + Retry Button) */}
      {!isLoading && isError && (
        <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/30 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-red-600 dark:text-red-400">
              Không thể tải danh sách sự kiện
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Vui lòng kiểm tra kết nối mạng hoặc máy chủ Backend.
            </p>
          </div>
          <button
            onClick={fetchEvents}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-lg transition-all duration-200 shadow-md shadow-red-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      )}

      {/* STATE 1: INITIAL / EMPTY STATE */}
      {!isLoading && !isError && filteredEvents.length === 0 && (
        <div className="p-12 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 my-8">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Chưa có sự kiện phù hợp
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc quay lại sau để cập nhật các workshop mới nhất từ FU-DEVER.
          </p>
        </div>
      )}

      {/* STATE 3: SUCCESS STATE (Data Cards Showcase with Micro-interactions) */}
      {!isLoading && !isError && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const id = evt._id || String(evt.id);
            const isProcessing = registeringId === id;
            const resolvedImg = resolveEventImageUrl(evt.coverImage);

            return (
              <div
                key={id}
                className="group relative flex flex-col justify-between bg-white dark:bg-slate-900/80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-[#0066CC] dark:hover:border-[#0066CC] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {resolvedImg && (
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolvedImg}
                      alt={evt.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    {renderShowcaseStatusBadge(evt.status)}
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Gen 9
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-[#0066CC] transition-colors leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Metadata */}
                  <div className="pt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#0066CC]" />
                      <span>{evt.date}</span>
                      <Clock className="w-3.5 h-3.5 text-[#0066CC] ml-2" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#0066CC]" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>

                {/* STATE 5: DISABLED STATE when registering */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleRegister(evt)}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                      isProcessing
                        ? "opacity-50 pointer-events-none bg-slate-300 dark:bg-slate-800 text-slate-500"
                        : "bg-[#0066CC] hover:bg-[#004C99] active:scale-[0.98] text-white shadow-[#0066CC]/20"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Đang đăng ký...
                      </>
                    ) : (
                      <>
                        Đăng Ký Tham Gia <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
