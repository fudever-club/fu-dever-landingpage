"use client";

import React, { useState, useEffect } from "react";
import {
  Bolt,
  BrainCircuit,
  CalendarDays,
  Clock3,
  ExternalLink,
  Flame,
  Globe2,
  MapPin,
  Rocket,
  Trophy,
  UsersRound,
  X,
  ClipboardList,
  CheckCircle2,
  LayoutGrid,
  Radio,
  History,
  PauseCircle,
  Search,
  Sparkles,
} from "lucide-react";
import DeverKnowledgeCanvas from "@components/ui/DeverKnowledgeCanvas";
import DeverEventHero from "@components/ui/DeverEventHero";

interface EventItem {
  _id?: string;
  id?: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Đang mở đăng ký" | "Đang diễn ra" | "Sắp diễn ra" | "Đã kết thúc" | "Tạm hoãn" | string;
  description: string;
  registerUrl: string;
  checkinUrl: string;
  speakers: string;
  coverImage: string;
  isFeatured?: boolean;
}

function sanitizeUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^(https?:\/\/)/i.test(trimmed)) {
    return trimmed;
  }
  return "#";
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

const FALLBACK_EVENTS: EventItem[] = [
  {
    _id: "evt_1",
    id: 1,
    title: "Workshop: Tối Ưu Hóa Lập Trình & Tích Hợp AI Trong Web 2026",
    date: "15/08/2026",
    time: "14:00 - 17:00",
    location: "Hội trường Beta, FPT University Da Nang",
    status: "Đang mở đăng ký",
    description:
      "Buổi chia sẻ chuyên sâu về cách ứng dụng AI hỗ trợ lập trình, xây dựng kiến trúc web hiệu năng cao và giải đáp thắc mắc cùng các Senior Dev cựu sinh viên FPT.",
    registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_sample_register_form/viewform",
    checkinUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_sample_checkin_form/viewform",
    speakers: "Lê Đức Anh Phương & Trần Văn Bảo Thắng",
    coverImage: "",
    isFeatured: true,
  },
  {
    _id: "evt_2",
    id: 2,
    title: "Đợt Tuyển Thành Viên Gen 9 (Khóa K21 - Năm 2026)",
    date: "25/08/2026",
    time: "08:00 - 22:00",
    location: "Online & Bàn Desk Sảnh Alpha FPTU",
    status: "Đang mở đăng ký",
    description:
      "Chào đón các tân sinh viên K21 gia nhập đại gia đình FU-DEVER. Trải nghiệm môi trường học thuật chuyên nghiệp, tham gia dự án thực tế và thi đấu giải thuật.",
    registerUrl: "https://forms.gle/hJxSewnuiVFwR1rH8",
    checkinUrl: "https://forms.gle/hJxSewnuiVFwR1rH8",
    speakers: "Ban Chủ Nhiệm FU-DEVER",
    coverImage: "",
    isFeatured: false,
  },
];

function renderEventStatusBadge(status: string) {
  switch (status) {
    case "Đang mở đăng ký":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50/95 text-[#0066CC] border border-blue-200 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066CC]"></span>
          </span>
          <CheckCircle2 className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
          <span>Đang mở đăng ký</span>
        </span>
      );
    case "Đang diễn ra":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50/95 text-rose-600 border border-rose-200 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <Radio className="h-3.5 w-3.5 text-rose-600 animate-pulse" aria-hidden="true" />
          <span>Đang diễn ra</span>
        </span>
      );
    case "Sắp diễn ra":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50/95 text-amber-700 border border-amber-200 shadow-sm backdrop-blur-sm">
          <Clock3 className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
          <span>Sắp diễn ra</span>
        </span>
      );
    case "Tạm hoãn":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-50/95 text-purple-700 border border-purple-200 shadow-sm backdrop-blur-sm">
          <PauseCircle className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
          <span>Tạm hoãn</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100/95 text-slate-700 border border-slate-200 shadow-sm backdrop-blur-sm">
          <History className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <span>{status || "Đã kết thúc"}</span>
        </span>
      );
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegisterEvent, setSelectedRegisterEvent] = useState<EventItem | null>(null);

  const API_SERVER =
    process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_SERVER}/api/v1/events`);
        if (res.ok) {
          const json = await res.json();
          const serverData = Array.isArray(json) ? json : json?.data || [];
          setEvents(serverData);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.warn("Backend API unavailable:", err);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, [API_SERVER]);

  useEffect(() => {
    if (!selectedRegisterEvent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRegisterEvent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRegisterEvent]);

  const filterTabs = [
    {
      key: "all",
      label: "Tất cả",
      icon: <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />,
      count: events.length,
    },
    {
      key: "Đang mở đăng ký",
      label: "Đang mở đăng ký",
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />,
      count: events.filter((e) => e.status === "Đang mở đăng ký").length,
    },
    {
      key: "Đang diễn ra",
      label: "Đang diễn ra",
      icon: <Radio className="h-3.5 w-3.5 text-rose-500 animate-pulse" aria-hidden="true" />,
      count: events.filter((e) => e.status === "Đang diễn ra").length,
    },
    {
      key: "Sắp diễn ra",
      label: "Sắp diễn ra",
      icon: <Clock3 className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />,
      count: events.filter((e) => e.status === "Sắp diễn ra").length,
    },
    {
      key: "Đã kết thúc",
      label: "Đã kết thúc",
      icon: <History className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />,
      count: events.filter((e) => e.status === "Đã kết thúc").length,
    },
    {
      key: "Tạm hoãn",
      label: "Tạm hoãn",
      icon: <PauseCircle className="h-3.5 w-3.5 text-purple-500" aria-hidden="true" />,
      count: events.filter((e) => e.status === "Tạm hoãn").length,
    },
  ];

  const filteredEvents = events.filter((evt) => {
    const matchStatus = filterStatus === "all" || evt.status === filterStatus;
    const matchSearch =
      searchQuery.trim() === "" ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const featuredEvent =
    events.find((e) => e.isFeatured) ||
    events[0] ||
    (isLoading ? null : FALLBACK_EVENTS[0]);

  return (
    <main className="min-h-screen bg-[#F8FCFF] pb-20 pt-20">
      {/* Modern Premium 3D Holographic VIP Ticket & Background Beams Hero */}
      <DeverEventHero
        event={featuredEvent}
        isLoading={isLoading}
        onRegisterClick={() => setSelectedRegisterEvent(featuredEvent || events[0] || FALLBACK_EVENTS[0])}
      />

      {/* Events List & Filter Section */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="bg-white rounded-3xl border border-blue-100 p-6 lg:p-8 shadow-sm mb-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-950">Danh Sách Sự Kiện & Workshop</h2>
              <p className="text-xs text-gray-600 font-semibold mt-1">
                Lọc nhanh sự kiện theo trạng thái và bấm <span className="font-black text-[#0066CC]">Đăng Ký Tham Gia</span> để giữ chỗ.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm sự kiện, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC] transition-all"
              />
            </div>
          </div>

          {/* Segmented Filter Pills (SVG Icons & Glassmorphism) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar">
            {filterTabs.map((tab) => {
              const isActive = filterStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterStatus(tab.key)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-[#0066CC] text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-500/20"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80"
                  }`}
                >
                  <span className={isActive ? "text-white" : ""}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Events Grid / List */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-blue-100 p-6 lg:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-pulse">
                  <div className="lg:col-span-4 h-48 rounded-xl bg-slate-200" />
                  <div className="lg:col-span-8 space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                    <div className="h-10 bg-slate-100 rounded-xl w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
                <CalendarDays className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5">Chưa Có Sự Kiện Hoặc Workshop Nào</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
                Các sự kiện học thuật, workshop chuyên đề và giải đấu mới sẽ sớm được Ban Chủ Nhiệm cập nhật tại đây. Hãy theo dõi thường xuyên nhé!
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Không tìm thấy sự kiện nào phù hợp</p>
              <p className="text-xs text-slate-500 mt-1">Vui lòng chọn bộ lọc khác hoặc nhập từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((evt, idx) => {
                const resolvedImg = resolveEventImageUrl(evt.coverImage);
                return (
                  <div
                    key={evt._id || evt.id || idx}
                    className="bg-white rounded-2xl border border-blue-100 p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center group"
                  >
                    <div className="lg:col-span-4 relative h-48 overflow-hidden rounded-xl shadow-sm lg:h-52 bg-slate-100">
                      {resolvedImg ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={resolvedImg}
                          alt={evt.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <DeverKnowledgeCanvas kind="event" title={evt.title} />
                      )}
                      <div className="absolute top-3 left-3">
                        {renderEventStatusBadge(evt.status)}
                      </div>
                    </div>

                    <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-950 mb-2 leading-tight group-hover:text-[#0066CC] transition-colors">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium line-clamp-3">
                          {evt.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-900 font-semibold bg-[#F0F7FF] p-3 rounded-xl border border-blue-100">
                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-[#0066CC] shrink-0" aria-hidden="true" />
                          <span>{evt.date} ({evt.time})</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#0066CC] shrink-0" aria-hidden="true" />
                          <span className="truncate">{evt.location}</span>
                        </p>
                        <p className="flex items-center gap-2 sm:col-span-2">
                          <UsersRound className="h-4 w-4 text-[#0066CC] shrink-0" aria-hidden="true" />
                          <span>Diễn giả: {evt.speakers || "Ban Chuyên Môn FU-DEVER"}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => setSelectedRegisterEvent(evt)}
                          type="button"
                          className="px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-[0.98]"
                        >
                          Đăng Ký Tham Gia <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal: Register via Google Form with Sanitized Safe URL */}
      {selectedRegisterEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <span className="bg-blue-100 text-[#004C99] font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200">
                <ClipboardList className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />{" "}
                {selectedRegisterEvent.registerUrl && selectedRegisterEvent.registerUrl !== "#"
                  ? "ĐĂNG KÝ QUA GOOGLE FORM"
                  : "VÉ ĐIỆN TỬ & ĐIỂM DANH QR"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRegisterEvent(null)}
                aria-label="Đóng hộp thoại đăng ký (Phím ESC)"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div>
              <h3 id="event-modal-title" className="text-xl font-extrabold text-gray-950 mb-2">
                {selectedRegisterEvent.title}
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {selectedRegisterEvent.description}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-200 text-slate-900 font-semibold">
              <p className="flex gap-1.5"><CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0066CC]" aria-hidden="true" /><span><strong>Thời gian:</strong> {selectedRegisterEvent.date} ({selectedRegisterEvent.time})</span></p>
              <p className="flex gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0066CC]" aria-hidden="true" /><span><strong>Địa điểm:</strong> {selectedRegisterEvent.location}</span></p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedRegisterEvent(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Đóng
              </button>
              {selectedRegisterEvent.registerUrl && selectedRegisterEvent.registerUrl !== "#" ? (
                <a
                  href={sanitizeUrl(selectedRegisterEvent.registerUrl)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-extrabold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  Mở Google Form Đăng Ký <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : (
                <a
                  href={process.env.NEXT_PUBLIC_CLIENT_URL || process.env.NEXT_PUBLIC_CLIENT_APP_URL || "https://client.fudever.com"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-extrabold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  Đăng Ký Tại Cổng Sinh Viên <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
