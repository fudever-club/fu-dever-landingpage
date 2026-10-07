"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  ExternalLink,
  Globe2,
  History,
  MapPin,
  Radio,
  Search,
  X,
  ZoomIn,
} from "lucide-react";
import { apiFetch } from "@/src/lib/api";

interface EventItem {
  _id?: string;
  id?: number | string;
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
  category?: string;
  isFeatured?: boolean;
}

type ListFilter = "all" | "upcoming" | "online" | "offline" | "month";

const ONLINE_HINT = /online|trực tuyến|truc tuyen|google meet|zoom|discord|teams|livestream|webinar/i;
const OPENED_FORMS_KEY = "dever-events-opened-forms";
const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DAY_NAMES = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function sanitizeUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^(https?:\/\/)/i.test(trimmed)) return trimmed;
  return "#";
}

function resolveEventImageUrl(url?: string): string {
  if (!url) return "";
  const gDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  const gDriveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (gDriveIdMatch && gDriveIdMatch[1] && url.includes("drive.google.com")) {
    return `https://lh3.googleusercontent.com/d/${gDriveIdMatch[1]}`;
  }
  return url;
}

/** Parse the real date/time strings into a Date. No invented RSVP/startAt. */
function parseEventTargetDate(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const cleanDate = dateStr.trim();
  if (!cleanDate) return null;
  let year = new Date().getFullYear();
  let month = 0;
  let day = 1;
  let hours = 8;
  let minutes = 0;
  const dmyMatch = cleanDate.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    day = parseInt(dmyMatch[1], 10);
    month = parseInt(dmyMatch[2], 10) - 1;
    year = parseInt(dmyMatch[3], 10);
  } else {
    const ymdMatch = cleanDate.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (ymdMatch) {
      year = parseInt(ymdMatch[1], 10);
      month = parseInt(ymdMatch[2], 10) - 1;
      day = parseInt(ymdMatch[3], 10);
    } else {
      const parsed = Date.parse(cleanDate);
      if (!isNaN(parsed)) {
        const fallback = new Date(parsed);
        return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate(), 8, 0, 0);
      }
      return null;
    }
  }
  if (timeStr && typeof timeStr === "string") {
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
    }
  }
  const built = new Date(year, month, day, hours, minutes, 0);
  return isNaN(built.getTime()) ? null : built;
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function eventId(evt: EventItem, idx: number): string {
  if (evt._id) return evt._id;
  if (evt.id !== undefined && evt.id !== null) return String(evt.id);
  return `${evt.title}-${idx}`;
}

/** Honest Online/Offline heuristic: inferred from the real location string only. */
function isOnlineEvent(location?: string): boolean {
  if (!location) return false;
  return ONLINE_HINT.test(location);
}

function isUpcomingStatus(status: string): boolean {
  return status === "Đang mở đăng ký" || status === "Sắp diễn ra" || status === "Đang diễn ra";
}

type StatusKind = "live" | "upcoming" | "ended";

function statusKind(status: string): StatusKind {
  if (status === "Đang diễn ra") return "live";
  if (status === "Đã kết thúc" || status === "Tạm hoãn") return "ended";
  return "upcoming";
}

function statusBadge(kind: StatusKind, status: string) {
  if (kind === "live") {
    return (
      <span className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-200 motion-reduce:animate-none">
        <Radio className="h-4 w-4" aria-hidden="true" />
        <span>Đang diễn ra</span>
      </span>
    );
  }
  if (kind === "ended") {
    return (
      <span className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-200">
        <History className="h-4 w-4" aria-hidden="true" />
        <span>{status || "Đã kết thúc"}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-[#E6F0FA] px-4 py-2 text-xs font-bold text-[#004C99] ring-1 ring-inset ring-blue-200">
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      <span>{status || "Sắp diễn ra"}</span>
    </span>
  );
}

/** Re-renders the small <7-day countdowns once a minute. No per-second churn. */
function useNowTick(active: boolean): number {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, [active]);
  return now;
}

function SmallCountdown({ target, now }: { target: Date | null; now: number }) {
  if (!target) return null;
  const diff = target.getTime() - now;
  if (diff <= 0) return null;
  if (diff >= 7 * 24 * 60 * 60 * 1000) return null;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const label = days >= 1 ? `Còn ${days} ngày ${hours} giờ` : `Còn ${hours} giờ ${minutes} phút`;
  return (
    <p className="inline-flex items-center gap-1 text-xs font-bold text-[#004C99]">
      <Clock3 className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </p>
  );
}

function TicketSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white motion-reduce:animate-none"
    >
      <div className="flex w-[72px] shrink-0 flex-col items-center justify-center gap-1 bg-slate-100 p-4 md:w-24">
        <div className="h-4 w-8 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-6 w-8 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-4 w-8 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      </div>
      <div className="relative w-4 shrink-0 border-l-2 border-dashed border-slate-200" />
      <div className="flex-1 space-y-2 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
        <div className="h-8 w-32 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<ListFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState<number>(today.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(today.getMonth());
  const [selectedRegisterEvent, setSelectedRegisterEvent] = useState<EventItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [openedForms, setOpenedForms] = useState<Set<string>>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(OPENED_FORMS_KEY) : null;
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(false);
      const res = await apiFetch(`/api/v1/events`);
      if (res.ok) {
        const json = await res.json();
        const serverData = Array.isArray(json) ? json : json?.data || [];
        setEvents(serverData);
      } else {
        setEvents([]);
        setLoadError(true);
      }
    } catch (err) {
      console.warn("Backend API unavailable:", err);
      setEvents([]);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    try {
      window.localStorage.setItem(OPENED_FORMS_KEY, JSON.stringify(Array.from(openedForms)));
    } catch {
      /* local-only hint; ignore persistence failures */
    }
  }, [openedForms]);

  useEffect(() => {
    if (!selectedRegisterEvent && !lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightboxOpen) {
        setLightboxOpen(false);
      } else {
        setSelectedRegisterEvent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRegisterEvent, lightboxOpen]);

  useEffect(() => {
    if (!selectedRegisterEvent) {
      setLightboxOpen(false);
    }
  }, [selectedRegisterEvent]);

  const parsedDates = useMemo(() => events.map((e) => parseEventTargetDate(e.date, e.time)), [events]);
  const now = useNowTick(events.length > 0 && !isLoading);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, { total: number; featured: boolean }>();
    events.forEach((evt, i) => {
      const d = parsedDates[i];
      if (!d) return;
      const key = toDateKey(d);
      const prev = map.get(key);
      map.set(key, { total: (prev?.total ?? 0) + 1, featured: (prev?.featured ?? false) || !!evt.isFeatured });
    });
    return map;
  }, [events, parsedDates]);

  const monthKeys = useMemo(() => Array.from(eventsByDay.keys()).sort(), [eventsByDay]);

  const jumpToEventMonth = useCallback(() => {
    if (monthKeys.length === 0) {
      setCalYear(today.getFullYear());
      setCalMonth(today.getMonth());
      return;
    }
    const cursorKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;
    const next = monthKeys.find((k) => k.slice(0, 7) >= cursorKey) ?? monthKeys[monthKeys.length - 1];
    setCalYear(parseInt(next.slice(0, 4), 10));
    setCalMonth(parseInt(next.slice(5, 7), 10) - 1);
  }, [monthKeys, calYear, calMonth, today]);

  const goToday = useCallback(() => {
    const t = new Date();
    setCalYear(t.getFullYear());
    setCalMonth(t.getMonth());
  }, []);

  const moveMonth = useCallback(
    (delta: number) => {
      const d = new Date(calYear, calMonth + delta, 1);
      setCalYear(d.getFullYear());
      setCalMonth(d.getMonth());
    },
    [calYear, calMonth]
  );

  const toggleDay = useCallback((key: string) => {
    setSelectedDateKey((prev) => (prev === key ? null : key));
  }, []);

  const handleCalKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const key = target.getAttribute("data-cal-day");
      if (e.key === "Escape") {
        setSelectedDateKey(null);
        return;
      }
      if (!key) return;
      const [y, m, d] = key.split("-").map((v) => parseInt(v, 10));
      let next: Date | null = null;
      if (e.key === "ArrowLeft") next = new Date(y, m - 1, d - 1);
      else if (e.key === "ArrowRight") next = new Date(y, m - 1, d + 1);
      else if (e.key === "ArrowUp") next = new Date(y, m - 1, d - 7);
      else if (e.key === "ArrowDown") next = new Date(y, m - 1, d + 7);
      else return;
      e.preventDefault();
      setCalYear(next.getFullYear());
      setCalMonth(next.getMonth());
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-cal-day="${toDateKey(next as Date)}"]`);
        if (el instanceof HTMLElement) el.focus();
      });
    },
    []
  );

  const counts = useMemo(() => {
    const nowD = new Date();
    return {
      all: events.length,
      upcoming: events.filter((e) => isUpcomingStatus(e.status)).length,
      online: events.filter((e) => isOnlineEvent(e.location)).length,
      offline: events.filter((e) => !isOnlineEvent(e.location)).length,
      month: events.filter((_, i) => {
        const d = parsedDates[i];
        return !!d && d.getFullYear() === nowD.getFullYear() && d.getMonth() === nowD.getMonth();
      }).length,
    };
  }, [events, parsedDates]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((evt, i) => {
      if (activeFilter === "upcoming" && !isUpcomingStatus(evt.status)) return false;
      if (activeFilter === "online" && !isOnlineEvent(evt.location)) return false;
      if (activeFilter === "offline" && isOnlineEvent(evt.location)) return false;
      if (activeFilter === "month") {
        const d = parsedDates[i];
        const n = new Date();
        if (!d || d.getFullYear() !== n.getFullYear() || d.getMonth() !== n.getMonth()) return false;
      }
      if (selectedDateKey) {
        const d = parsedDates[i];
        if (!d || toDateKey(d) !== selectedDateKey) return false;
      }
      if (q) {
        const hay = `${evt.title ?? ""} ${evt.description ?? ""} ${evt.location ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [events, parsedDates, activeFilter, selectedDateKey, searchQuery]);

  const hasActiveFilters = activeFilter !== "all" || searchQuery.trim() !== "" || selectedDateKey !== null;

  const clearFilters = useCallback(() => {
    setActiveFilter("all");
    setSearchQuery("");
    setSelectedDateKey(null);
  }, []);

  const filterTabs: { key: ListFilter; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "all", label: "Tất cả", icon: <CalendarDays className="h-4 w-4" aria-hidden="true" />, count: counts.all },
    { key: "upcoming", label: "Sắp tới", icon: <Clock3 className="h-4 w-4" aria-hidden="true" />, count: counts.upcoming },
    { key: "online", label: "Online", icon: <Globe2 className="h-4 w-4" aria-hidden="true" />, count: counts.online },
    { key: "offline", label: "Offline", icon: <MapPin className="h-4 w-4" aria-hidden="true" />, count: counts.offline },
    { key: "month", label: "Tháng này", icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />, count: counts.month },
  ];

  const firstDayOffset = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calCells: (number | null)[] = [
    ...Array.from({ length: firstDayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const calMonthHasEvents = monthKeys.some((k) => k.startsWith(`${calYear}-${String(calMonth + 1).padStart(2, "0")}`));

  const selectedDateLabel = useMemo(() => {
    if (!selectedDateKey) return null;
    const [y, m, d] = selectedDateKey.split("-").map((v) => parseInt(v, 10));
    return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
  }, [selectedDateKey]);

  const markFormOpened = useCallback((id: string) => {
    setOpenedForms((prev) => {
      if (prev.has(id)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(id);
      return nextSet;
    });
  }, []);

  const modalCover = selectedRegisterEvent ? resolveEventImageUrl(selectedRegisterEvent.coverImage) : "";

  return (
    <div className="min-h-screen w-full bg-white pb-20 pt-16">
      {/* Compact white hero: H1 + real search + mini month calendar */}
      <section className="mx-auto max-w-[1440px] px-4 pt-8 md:px-8 lg:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#E6F0FA] px-4 py-2 text-xs font-bold text-[#004C99]">
              <span className="h-2 w-2 rounded-full bg-[#0066CC]" aria-hidden="true" />
              FU-DEVER WORKSHOPS &amp; EVENTS
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Lịch Sự Kiện &amp; Workshop
            </h1>
            <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-slate-600">
              Không gian chia sẻ kiến thức chuyên sâu và kết nối cùng FU-DEVER. Tìm theo tên, mô tả hoặc địa điểm thật của
              sự kiện.
            </p>
            <div className="relative mt-4 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <label htmlFor="event-search" className="sr-only">
                Tìm sự kiện theo tên, mô tả, địa điểm
              </label>
              <input
                id="event-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchQuery("");
                }}
                placeholder="Tìm tên, mô tả, địa điểm..."
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0066CC] focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {searchQuery.trim() !== "" && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Xóa tìm kiếm"
                  className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
            {(selectedDateKey || searchQuery.trim() !== "") && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {selectedDateLabel && (
                  <button
                    type="button"
                    onClick={() => setSelectedDateKey(null)}
                    aria-label={`Bỏ lọc theo ngày ${selectedDateLabel}`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E6F0FA] px-4 py-2 text-xs font-bold text-[#004C99] ring-1 ring-inset ring-blue-200 hover:bg-blue-100"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    <span>Ngày {selectedDateLabel}</span>
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Xóa lọc
                </button>
              </div>
            )}
          </div>

          {/* Mini month calendar */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => moveMonth(-1)}
                  aria-label="Tháng trước"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="text-sm font-extrabold text-slate-900" aria-live="polite">
                  Tháng {calMonth + 1} • {calYear}
                </p>
                <button
                  type="button"
                  onClick={() => moveMonth(1)}
                  aria-label="Tháng sau"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center" aria-hidden="true">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="py-2 text-xs font-bold text-slate-500">
                    {w}
                  </span>
                ))}
              </div>
              <div
                role="group"
                aria-label={`Lịch tháng ${calMonth + 1} năm ${calYear}. Dùng phím mũi tên để di chuyển, Enter để lọc, Esc để bỏ lọc.`}
                onKeyDown={handleCalKeyDown}
                className="grid grid-cols-7 gap-1"
              >
                {calCells.map((day, idx) => {
                  if (day === null) return <span key={`blank-${idx}`} aria-hidden="true" />;
                  const key = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const info = eventsByDay.get(key);
                  const isSelected = selectedDateKey === key;
                  const isToday = key === toDateKey(today);
                  return (
                    <button
                      key={key}
                      type="button"
                      data-cal-day={key}
                      onClick={() => toggleDay(key)}
                      aria-pressed={isSelected}
                      aria-label={`Ngày ${day} tháng ${calMonth + 1}${info ? `, ${info.total} sự kiện` : ", không có sự kiện"}${
                        isSelected ? ", đang lọc" : ""
                      }`}
                      className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold transition-colors motion-reduce:transition-none ${
                        isSelected
                          ? "bg-[#0066CC] text-white"
                          : isToday
                            ? "bg-slate-100 text-slate-900 ring-2 ring-inset ring-[#0066CC]"
                            : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{day}</span>
                      <span className="flex h-2 items-center gap-1" aria-hidden="true">
                        {info && (
                          <span
                            className={`${info.featured ? "h-2 w-2" : "h-1 w-1"} rounded-full ${
                              isSelected ? "bg-white" : "bg-[#0066CC]"
                            }`}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              {!calMonthHasEvents && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-xs font-bold text-slate-600">Tháng này chưa có sự kiện.</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={goToday}
                      className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-white"
                    >
                      Về hôm nay
                    </button>
                    {monthKeys.length > 0 && (
                      <button
                        type="button"
                        onClick={jumpToEventMonth}
                        className="inline-flex min-h-[44px] items-center rounded-xl bg-[#0066CC] px-4 py-2 text-xs font-bold text-white hover:bg-[#004C99]"
                      >
                        Tháng có sự kiện
                      </button>
                    )}
                  </div>
                </div>
              )}
              <p className="mt-4 text-xs font-medium text-slate-500">Chấm xanh là ngày có sự kiện, chấm to là sự kiện nổi bật.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky real filters */}
      <div className="sticky top-16 z-40 mt-8 border-y border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-20">
          <div
            role="tablist"
            aria-label="Lọc sự kiện"
            className="flex items-center gap-2 overflow-x-auto py-4 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]"
          >
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors motion-reduce:transition-none ${
                    isActive
                      ? "bg-[#0066CC] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="pb-4 text-xs font-medium text-slate-500">
            Phân loại Online/Offline suy từ địa chỉ sự kiện (chứa “online/trực tuyến” là Online).
          </p>
        </div>
      </div>

      {/* Ticket list (error scope is limited to this section) */}
      <section aria-label="Danh sách sự kiện" className="mx-auto max-w-[1440px] px-4 pt-8 md:px-8 lg:px-20">
        {isLoading ? (
          <div role="status" className="space-y-4">
            <span className="sr-only">Đang tải sự kiện…</span>
            <TicketSkeleton />
            <TicketSkeleton />
            <TicketSkeleton />
          </div>
        ) : loadError && events.length === 0 ? (
          <div role="alert" className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm font-bold text-slate-800">Không thể tải danh sách sự kiện.</p>
            <p className="mt-2 text-xs font-medium text-slate-500">Vui lòng kiểm tra kết nối và thử lại.</p>
            <button
              type="button"
              onClick={fetchEvents}
              className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-[#0066CC] px-4 py-2 text-xs font-bold text-white hover:bg-[#004C99]"
            >
              Thử lại
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-4 text-sm font-bold text-slate-800">Không tìm thấy sự kiện nào phù hợp</p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {events.length === 0
                ? "Các workshop và sự kiện mới sẽ sớm được cập nhật tại đây."
                : "Vui lòng chọn bộ lọc khác hoặc đổi từ khóa tìm kiếm."}
            </p>
            {hasActiveFilters && events.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-[#0066CC] px-4 py-2 text-xs font-bold text-white hover:bg-[#004C99]"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const originalIndex = events.indexOf(evt);
              const target = parseEventTargetDate(evt.date, evt.time);
              const id = eventId(evt, originalIndex);
              const kind = statusKind(evt.status);
              const isEnded = kind === "ended";
              const online = isOnlineEvent(evt.location);
              const registerHref = sanitizeUrl(evt.registerUrl);
              const checkinHref = sanitizeUrl(evt.checkinUrl);
              const hasRegister = registerHref !== "#";
              const hasCheckin = checkinHref !== "#";
              const alreadyOpened = openedForms.has(id);
              const monthLabel = target ? `T${target.getMonth() + 1}` : "—";
              const dayLabel = target ? String(target.getDate()).padStart(2, "0") : "--";
              const weekdayLabel = target ? DAY_NAMES[target.getDay()] : "—";
              return (
                <article
                  key={id}
                  aria-label={evt.title}
                  className={`flex items-stretch overflow-hidden rounded-2xl border bg-white ${
                    kind === "live" ? "border-red-200" : "border-slate-200"
                  }`}
                >
                  {/* Date block: light-blue AA pair, 72px on mobile */}
                  <div className="flex w-[72px] shrink-0 flex-col items-center justify-center gap-1 bg-[#E6F0FA] p-4 text-[#004C99] md:w-24">
                    <span className="text-xs font-bold uppercase">Tháng {monthLabel}</span>
                    <span className="text-xl font-extrabold leading-none">{dayLabel}</span>
                    <span className="text-xs font-bold">{weekdayLabel}</span>
                  </div>
                  {/* Perforation divider (pure CSS) */}
                  <div aria-hidden="true" className="relative w-4 shrink-0 border-l-2 border-dashed border-slate-200">
                    <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full border-b border-r border-slate-200 bg-white" />
                    <span className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full border-r border-t border-slate-200 bg-white" />
                  </div>
                  <div className="min-w-0 flex-1 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {statusBadge(kind, evt.status)}
                      {evt.category && (
                        <span className="inline-flex min-h-[44px] items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">
                          {evt.category}
                        </span>
                      )}
                      <span className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">
                        {online ? (
                          <Globe2 className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span>{online ? "Online" : "Offline"}</span>
                      </span>
                    </div>
                    <h2 className="mt-4 line-clamp-2 text-base font-bold leading-snug text-slate-900">{evt.title}</h2>
                    <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Clock3 className="h-4 w-4 shrink-0 text-[#004C99]" aria-hidden="true" />
                      <span>
                        {evt.date}
                        {evt.time ? ` • ${evt.time}` : ""}
                      </span>
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-[#004C99]" aria-hidden="true" />
                      <span className="truncate">{evt.location || "Địa điểm đang cập nhật"}</span>
                    </p>
                    <div className="mt-2">
                      <SmallCountdown target={target} now={now} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRegisterEvent(evt)}
                        disabled={isEnded}
                        aria-disabled={isEnded}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0066CC] px-4 py-2 text-xs font-bold text-white hover:bg-[#004C99] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        <ClipboardList className="h-4 w-4" aria-hidden="true" />
                        <span>{isEnded ? evt.status || "Đã kết thúc" : "Đăng ký"}</span>
                      </button>
                      {kind === "live" && hasCheckin && (
                        <a
                          href={checkinHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                        >
                          <span>Điểm danh</span>
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}
                      {alreadyOpened && !isEnded && (
                        <span className="inline-flex min-h-[44px] items-center gap-1 px-4 py-2 text-xs font-bold text-slate-500">
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          <span>Đã mở Form</span>
                        </span>
                      )}
                      {!hasRegister && !isEnded && (
                        <span className="text-xs font-medium text-slate-500">Form đăng ký đang cập nhật</span>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const thumb = resolveEventImageUrl(evt.coverImage);
                    if (!thumb) return null;
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRegisterEvent(evt);
                          setLightboxOpen(true);
                        }}
                        aria-label={`Xem poster gốc: ${evt.title}`}
                        className="relative hidden w-32 shrink-0 self-stretch overflow-hidden border-l border-slate-100 bg-slate-50 sm:block md:w-40"
                      >
                        <Image
                          src={thumb}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="160px"
                          loading="lazy"
                          className="object-cover transition-transform duration-200 hover:scale-105"
                        />
                        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-slate-950/70 px-2 py-1 text-[11px] font-bold text-white">
                          <ZoomIn className="h-3 w-3" aria-hidden="true" /> Poster
                        </span>
                      </button>
                    );
                  })()}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Register modal: states clearly that the form lives outside this site */}
      {selectedRegisterEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          onClick={() => setSelectedRegisterEvent(null)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-4 shadow-xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E6F0FA] px-4 py-2 text-xs font-bold text-[#004C99]">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                <span>Biểu mẫu ngoài website</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedRegisterEvent(null)}
                aria-label="Đóng hộp thoại đăng ký (Phím ESC)"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div>
              <h2 id="event-modal-title" className="text-base font-extrabold leading-snug text-slate-900">
                {selectedRegisterEvent.title}
              </h2>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">{selectedRegisterEvent.description}</p>
            </div>
            {modalCover !== "" ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Phóng to poster sự kiện (giữ nguyên tỉ lệ gốc)"
                className="relative block h-40 w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-100"
              >
                <Image
                  src={modalCover}
                  alt={selectedRegisterEvent.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 512px"
                  loading="lazy"
                  className="object-cover"
                />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-slate-950/70 px-2 py-1 text-[11px] font-bold text-white">
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" /> Phóng to
                </span>
              </button>
            ) : null}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-700">
              <p className="flex gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-[#004C99]" aria-hidden="true" />
                <span>
                  Thời gian: {selectedRegisterEvent.date}
                  {selectedRegisterEvent.time ? ` (${selectedRegisterEvent.time})` : ""}
                </span>
              </p>
              <p className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#004C99]" aria-hidden="true" />
                <span>Địa điểm: {selectedRegisterEvent.location || "Đang cập nhật"}</span>
              </p>
              <p className="font-bold text-slate-600">
                Nút bên dưới sẽ mở biểu mẫu đăng ký của ban tổ chức trong tab mới, nằm ngoài website này.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRegisterEvent(null)}
                className="inline-flex min-h-[44px] items-center rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
              {sanitizeUrl(selectedRegisterEvent.registerUrl) !== "#" ? (
                <a
                  href={sanitizeUrl(selectedRegisterEvent.registerUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    markFormOpened(eventId(selectedRegisterEvent, events.indexOf(selectedRegisterEvent)))
                  }
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0066CC] px-4 py-2 text-xs font-bold text-white hover:bg-[#004C99]"
                >
                  <span>Mở Form đăng ký</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-500">Form đăng ký đang cập nhật</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Poster lightbox: original aspect ratio, contain-fit, max viewport */}
      {selectedRegisterEvent && lightboxOpen && modalCover !== "" ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Poster phóng to: ${selectedRegisterEvent.title}`}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/90 p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Đóng ảnh phóng to (Phím ESC)"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div
            className="relative max-h-[88vh] w-auto max-w-[94vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={modalCover}
              alt={`Poster gốc: ${selectedRegisterEvent.title}`}
              width={1200}
              height={1600}
              sizes="94vw"
              className="max-h-[88vh] w-auto max-w-[94vw] rounded-xl object-contain shadow-2xl"
              priority={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
