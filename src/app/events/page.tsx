"use client";

import React, { useState, useEffect } from "react";
import {
  Bolt,
  BrainCircuit,
  CalendarDays,
  ClipboardList,
  Clock3,
  ExternalLink,
  Flame,
  Globe2,
  MapPin,
  Rocket,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";
import DeverKnowledgeCanvas from "@components/ui/DeverKnowledgeCanvas";

interface EventItem {
  _id?: string;
  id?: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Đang mở đăng ký" | "Sắp diễn ra" | "Đã kết thúc" | string;
  description: string;
  registerUrl: string;
  checkinUrl: string;
  speakers: string;
  coverImage: string;
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
  },
  {
    id: 2,
    title: "Đợt Tuyển Thành Viên Gen 9 (Khóa K21 - Năm 2026)",
    date: "25/08/2026",
    time: "08:00 - 22:00",
    location: "Online & Bàn Desk Sảnh Alpha FPTU",
    status: "Đang mở đăng ký",
    description:
      "Chào đón các tân sinh viên K21 gia nhập đại gia đình FU-DEVER. Trải nghiệm môi trường học thuật chuyên nghiệp, tham gia dự án thực tế và thi đấu giải thuật.",
    registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_sample_gen9_form/viewform",
    checkinUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_sample_gen9_checkin/viewform",
    speakers: "Ban Chủ Nhiệm FU-DEVER",
    coverImage: "",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [selectedRegisterEvent, setSelectedRegisterEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/v1/events`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setEvents(json.data);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback events:", err);
      }
    }
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FCFF] pb-20 pt-20">
      {/* Modern Premium Banner Section */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-14">
        <div className="relative bg-gradient-to-br from-[#002D66] via-[#004C99] to-[#0066CC] rounded-3xl p-8 lg:p-12 text-white shadow-2xl overflow-hidden border border-blue-400/30">
          {/* Subtle Ambient Lighting Circles */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Banner Text Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/25 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-wider uppercase text-blue-50">
                  <Bolt className="h-3.5 w-3.5" aria-hidden="true" /> FU-DEVER EVENTS & WORKSHOPS
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                Sự Kiện & Workshop <br />
                <span className="bg-gradient-to-r from-cyan-200 via-blue-100 to-amber-200 bg-clip-text text-transparent">
                  Đỉnh Cao Công Nghệ
                </span>
              </h1>

              <p className="text-blue-100 text-sm lg:text-base max-w-xl leading-relaxed font-medium">
                Nơi truyền cảm hứng, rèn luyện tư duy lập trình thực chiến, thi đấu giải thuật ICPC và kết nối cùng mạng lưới Cựu sinh viên FPT giàu kinh nghiệm.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-extrabold text-blue-100">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                  <Globe2 className="h-3.5 w-3.5" aria-hidden="true" /> Web Fullstack
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                  <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" /> AI & Machine Learning
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                  <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> ICPC & LeetCode
                </span>
              </div>
            </div>

            {/* Right Featured Event Highlight Card */}
            {events.length > 0 && (
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-amber-300/60 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-amber-400 text-gray-950 font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                      <Flame className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> SỰ KIỆN NỔI BẬT
                    </span>
                    <span className="text-xs text-blue-100 font-bold">{events[0].status}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white mb-2 leading-snug">
                    {events[0].title}
                  </h3>
                  <p className="text-xs text-blue-100 font-medium mb-3 leading-relaxed line-clamp-2">
                    {events[0].description}
                  </p>

                  <div className="bg-black/20 rounded-xl p-3 text-xs text-blue-100 font-semibold space-y-1 border border-white/10 mb-4">
                    <p className="flex gap-1.5"><CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span><strong>Thời gian:</strong> {events[0].date} ({events[0].time})</span></p>
                    <p className="flex gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span><strong>Địa điểm:</strong> {events[0].location}</span></p>
                  </div>

                  <button
                    onClick={() => setSelectedRegisterEvent(events[0])}
                    type="button"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="h-4 w-4" aria-hidden="true" /> Đăng Ký Tham Gia Ngay <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="flex items-center justify-between mb-8 border-b border-blue-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-950">Danh Sách Sự Kiện Đang & Sắp Diễn Ra</h2>
            <p className="text-xs text-gray-700 font-semibold mt-1">Bấm <span className="font-black text-[#004C99]">Đăng Ký Tham Gia</span> để gửi thông tin đăng ký tham dự sự kiện</p>
          </div>
          <span className="bg-blue-100 text-[#004C99] font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-blue-200">
            {events.length} Sự Kiện
          </span>
        </div>

        <div className="space-y-6">
          {events.map((evt, idx) => {
            const resolvedImg = resolveEventImageUrl(evt.coverImage);
            return (
              <div
                key={evt._id || evt.id || idx}
                className="bg-white rounded-2xl border border-blue-100 p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-4 relative h-48 overflow-hidden rounded-xl shadow-sm lg:h-52 bg-slate-100">
                  {resolvedImg ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resolvedImg}
                      alt={evt.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <DeverKnowledgeCanvas kind="event" title={evt.title} />
                  )}
                  <span
                    className={`absolute top-3 left-3 font-extrabold text-xs px-3 py-1 rounded-full shadow-sm ${
                      evt.status === "Đang mở đăng ký"
                        ? "bg-emerald-700 text-white"
                        : evt.status === "Sắp diễn ra"
                        ? "bg-amber-700 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

              {/* Event Details */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-700">
                  <span className="flex items-center gap-1 text-[#004C99]"><CalendarDays className="h-3.5 w-3.5" />{evt.date}</span>
                  <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{evt.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{evt.location}</span>
                </div>

                <h2 className="text-xl lg:text-2xl font-extrabold text-gray-950 leading-snug">
                  {evt.title}
                </h2>

                <p className="text-gray-700 text-xs lg:text-sm leading-relaxed font-medium">
                  {evt.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-gray-700 font-semibold">
                    <span className="inline-flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5 text-[#0066CC]" /><strong>Diễn giả:</strong> {evt.speakers}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Register Button */}
                    {evt.status !== "Đã kết thúc" ? (
                      <button
                        type="button"
                        onClick={() => setSelectedRegisterEvent(evt)}
                        className="px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-extrabold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
                      >
                        Đăng Ký Tham Gia <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-extrabold rounded-xl">
                        Đã Khép Lại
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* Modal Option A: Register via Google Form */}
      {selectedRegisterEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <span className="bg-blue-100 text-[#004C99] font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200">
                <ClipboardList className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> ĐĂNG KÝ QUA GOOGLE FORM
              </span>
              <button
                type="button"
                onClick={() => setSelectedRegisterEvent(null)}
                aria-label="Đóng hộp thoại đăng ký"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-gray-950 mb-2">
                {selectedRegisterEvent.title}
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {selectedRegisterEvent.description}
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-xs space-y-2 border border-blue-200 text-gray-900 font-semibold">
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
              <a
                href={selectedRegisterEvent.registerUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-extrabold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                Mở Google Form Đăng Ký <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}
