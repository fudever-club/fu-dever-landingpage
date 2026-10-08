"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";
import MentorSection from "@/src/components/modules/Alumni/MentorSection";
import {
  Award,
  Building2,
  Search,
  Sparkles,
  FolderOpen,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  MessageSquareQuote,
  Globe,
  ExternalLink,
  Crown,
  Users,
} from "lucide-react";

interface Alumnus {
  _id: string;
  name: string;
  graduationGen?: string;
  headline: string;
  workplace?: string;
  quote?: string;
  bio?: string;
  avatar?: string;
  profileUrl?: string;
  isMentor?: boolean;
  isAdvisoryBoard?: boolean;
  mentoringTopics?: string[];
  isPublished?: boolean;
}

const TIMELINE_GENS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GEN_OPTIONS = [
  "Tất Cả Thế Hệ",
  ...TIMELINE_GENS.map((n) => `Gen ${n}`),
];

function parseGenNumber(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/gen\s*(\d+)/i);
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  return Number.isFinite(n) && n >= 1 && n <= 10 ? n : null;
}

/**
 * Niên khóa theo số thứ tự Gen: Gen 1 = 2017–2018 (năm thành lập CLB),
 * Gen 10 = 2026–2027. Mỗi Gen ≈ 1 niên khóa.
 */
function genYearRange(gen: number): string {
  const start = 2016 + gen;
  return `${start}–${start + 1}`;
}

function faceAlt(item: Alumnus): string {
  const role = item.headline || item.workplace || "cựu thành viên FU-DEVER";
  return `${item.name} – ${role}`;
}

interface TopCompany {
  name: string;
  count: number;
}

function topCompaniesOf(members: Alumnus[], limit = 3): TopCompany[] {
  const counts = new Map<string, { name: string; count: number }>();
  for (const m of members) {
    const raw = m.workplace?.trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    const entry = counts.get(key);
    if (entry) {
      entry.count += 1;
    } else {
      counts.set(key, { name: raw, count: 1 });
    }
  }
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function facesOf(members: Alumnus[], limit = 3): Alumnus[] {
  const withAvatar = members.filter((m) => m.avatar?.trim());
  const withoutAvatar = members.filter((m) => !m.avatar?.trim());
  return [...withAvatar, ...withoutAvatar].slice(0, limit);
}

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumnus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedGen, setSelectedGen] = useState<string>("Tất Cả Thế Hệ");
  const [selectedCompany, setSelectedCompany] = useState<string>("Tất Cả Doanh Nghiệp");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dynamic company list derived directly from Alumni profiles
  const companyOptions = useMemo(() => {
    const rawCompanies = alumniList
      .map((item) => item.workplace?.trim())
      .filter((wp): wp is string => Boolean(wp && wp.length > 0));

    const uniqueMap = new Map<string, string>();
    for (const comp of rawCompanies) {
      const lower = comp.toLowerCase();
      if (!uniqueMap.has(lower)) {
        uniqueMap.set(lower, comp);
      }
    }
    const dynamicCompanies = Array.from(uniqueMap.values()).sort((a, b) => a.localeCompare(b));
    return ["Tất Cả Doanh Nghiệp", ...dynamicCompanies];
  }, [alumniList]);

  // Real stats counted from API data
  const stats = useMemo(() => {
    const genSet = new Set<string>();
    for (const item of alumniList) {
      const gen = item.graduationGen?.trim().toLowerCase();
      if (gen) genSet.add(gen);
    }
    return {
      genCount: genSet.size,
      memberCount: alumniList.length,
      companyCount: companyOptions.length > 0 ? companyOptions.length - 1 : 0,
    };
  }, [alumniList, companyOptions]);

  // Timeline rows Gen 1 → Gen 10, grouped from real data
  const timelineRows = useMemo(
    () =>
      TIMELINE_GENS.map((gen) => {
        const members = alumniList.filter((item) => parseGenNumber(item.graduationGen) === gen);
        return {
          gen,
          label: `Gen ${gen}`,
          years: genYearRange(gen),
          members,
          count: members.length,
          topCompanies: topCompaniesOf(members, 3),
          faces: facesOf(members, 3),
        };
      }),
    [alumniList],
  );

  const fetchAlumni = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await apiFetch(`/api/v1/alumni`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const serverData = Array.isArray(json) ? json : json?.data || [];
        setAlumniList(serverData);
      } else {
        setAlumniList([]);
        setIsError(true);
      }
    } catch (err) {
      console.warn("Backend API unavailable:", err);
      setIsError(true);
      setAlumniList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const scrollToDirectory = () => {
    document.getElementById("alumni-directory")?.scrollIntoView();
  };

  const handleViewGen = (genLabel: string) => {
    setSelectedGen(genLabel);
    scrollToDirectory();
  };

  const filteredAlumni = alumniList.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.headline && item.headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.workplace && item.workplace.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchGen =
      selectedGen === "Tất Cả Thế Hệ" ||
      item.graduationGen === selectedGen;

    const matchCompany =
      selectedCompany === "Tất Cả Doanh Nghiệp" ||
      (item.workplace && item.workplace.trim().toLowerCase() === selectedCompany.trim().toLowerCase());

    return matchSearch && matchGen && matchCompany;
  });

  return (
    <div className="min-h-screen pt-4 pb-12 bg-[#F8FCFF]">
      {/* Compact white hero */}
      <section aria-labelledby="alumni-hero-heading" className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#004C99]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#0066CC]" />
            FU-DEVER Alumni Network
          </p>
          <h1 id="alumni-hero-heading" className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Timeline các thế hệ cựu thành viên
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            Hành trình Gen 1 đến Gen 10 của FU-DEVER và nơi các anh chị đang làm việc.
          </p>
          <p aria-live="polite" className="mt-4 text-sm font-semibold text-slate-700">
            {isLoading ? (
              <span className="text-slate-400">Đang tổng hợp số liệu từ hồ sơ cựu thành viên…</span>
            ) : (
              <>
                <strong className="font-extrabold text-[#0066CC]">{stats.genCount}</strong> thế hệ
                {" · "}
                <strong className="font-extrabold text-[#0066CC]">{stats.memberCount}</strong> anh chị
                {" · "}
                <strong className="font-extrabold text-[#0066CC]">{stats.companyCount}</strong> công ty
              </>
            )}
          </p>
        </div>
      </section>

      {/* Generation timeline Gen 1 → Gen 10 */}
      <section aria-labelledby="alumni-timeline-heading" className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 id="alumni-timeline-heading" className="text-base font-extrabold text-slate-900">
            Trục thế hệ Gen 1 → Gen 10
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Niên khóa theo thế hệ: Gen 1 = 2017–2018 (năm thành lập CLB) đến Gen 10 = 2026–2027.
          </p>

          {isLoading ? (
            <div className="mt-6 space-y-4" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-4 animate-pulse motion-reduce:animate-none">
                  <div className="h-11 w-11 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ol className="relative mt-6 ml-2 space-y-4 border-l-2 border-slate-200 pl-6">
              {timelineRows.map((row) => {
                const hasData = row.count > 0;
                return (
                  <li key={row.gen} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[33px] top-6 h-4 w-4 rounded-full border-2 ${
                        hasData ? "border-[#0066CC] bg-[#0066CC]" : "border-slate-300 bg-white"
                      }`}
                    />
                    <article
                      aria-label={`${row.label} (${row.years}): ${hasData ? `${row.count} anh chị` : "đang cập nhật"}`}
                      className={`rounded-2xl border p-4 transition-colors motion-reduce:transition-none ${
                        hasData
                          ? "border-slate-200 bg-slate-50"
                          : "border-dashed border-slate-200 bg-white opacity-70"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-sm font-extrabold text-slate-900">{row.label}</h3>
                        <span className="text-xs font-semibold text-slate-500">{row.years}</span>
                        {hasData ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs font-bold text-[#004C99]">
                            <Users className="h-3 w-3" aria-hidden="true" />
                            {row.count} anh chị
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                            đang cập nhật
                          </span>
                        )}
                      </div>

                      {hasData ? (
                        <div className="mt-3 space-y-3">
                          {row.topCompanies.length > 0 && (
                            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600">
                              <Building2 className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
                              <span className="sr-only">Nơi làm việc nổi bật: </span>
                              {row.topCompanies.map((c, idx) => (
                                <span key={c.name}>
                                  {c.name}
                                  <span className="text-slate-400"> ({c.count})</span>
                                  {idx < row.topCompanies.length - 1 && <span aria-hidden="true"> · </span>}
                                </span>
                              ))}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center" aria-label={`Gương mặt tiêu biểu ${row.label}`}>
                              {row.faces.map((m, fidx) => (
                                m.avatar ? (
                                  <Image
                                    key={m._id}
                                    src={m.avatar}
                                    alt={faceAlt(m)}
                                    title={m.name}
                                    width={44}
                                    height={44}
                                    sizes="44px"
                                    loading="lazy"
                                    className={`h-11 w-11 rounded-full object-cover border-2 border-white shadow-sm ${fidx > 0 ? "-ml-3" : ""}`}
                                  />
                                ) : (
                                  <span
                                    key={m._id}
                                    title={m.name}
                                    role="img"
                                    aria-label={faceAlt(m)}
                                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#0066CC] text-sm font-bold text-white border-2 border-white shadow-sm ${fidx > 0 ? "-ml-3" : ""}`}
                                  >
                                    {m.name.trim().charAt(0).toUpperCase()}
                                  </span>
                                )
                              ))}
                              {row.count > row.faces.length && (
                                <span className="flex h-11 w-11 -ml-3 items-center justify-center rounded-full bg-slate-200 text-xs font-extrabold text-slate-600 border-2 border-white">
                                  +{row.count - row.faces.length}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleViewGen(row.label)}
                              aria-label={`Lọc danh sách theo ${row.label}`}
                              className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-xl text-xs font-extrabold text-[#0066CC] hover:bg-blue-50 active:scale-[0.98] transition-all motion-reduce:transition-none"
                            >
                              Xem {row.label}
                              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Ban Chủ Nhiệm đang tổng hợp và xác thực hồ sơ {row.label} — quay lại sau nhé.
                        </p>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {/* Main Content & Filters */}
      <section id="alumni-directory" aria-label="Danh sách cựu thành viên" className="max-w-[1440px] mx-auto px-5 lg:px-20 space-y-6 scroll-mt-4">
        {/* Controls: Search, Gen Tabs & Company Radar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Gen Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none" role="group" aria-label="Lọc theo thế hệ">
              {GEN_OPTIONS.map((gen) => (
                <button
                  key={gen}
                  type="button"
                  onClick={() => setSelectedGen(gen)}
                  aria-pressed={selectedGen === gen}
                  className={`px-4 min-h-[44px] inline-flex items-center rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 motion-reduce:transition-none ${
                    selectedGen === gen
                      ? "bg-[#0066CC] text-white shadow-md shadow-blue-600/20 scale-[1.02] motion-reduce:transform-none"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Tìm tên, công ty, vị trí..."
                aria-label="Tìm cựu thành viên theo tên, công ty, vị trí"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Company Radar Quick Filter */}
          {companyOptions.length > 1 && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-[#0066CC]" aria-hidden="true" /> Doanh nghiệp:
              </span>
              {companyOptions.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setSelectedCompany(comp)}
                  aria-pressed={selectedCompany === comp}
                  className={`px-3 min-h-[44px] inline-flex items-center rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer motion-reduce:transition-none ${
                    selectedCompany === comp
                      ? "bg-blue-100 text-[#004C99] border border-blue-300 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LOADING SKELETON */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 animate-pulse motion-reduce:animate-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-slate-100 rounded-2xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && isError && (
          <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-red-700">
              Không thể tải danh sách cựu thành viên
            </h3>
            <button
              type="button"
              onClick={fetchAlumni}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-extrabold bg-[#0066CC] hover:bg-[#004C99] text-white rounded-xl transition-all motion-reduce:transition-none shadow-md"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Thử Lại
            </button>
          </div>
        )}

        {/* HONEST EMPTY STATE: NO DATA IN DB */}
        {!isLoading && !isError && alumniList.length === 0 && (
          <div className="relative rounded-3xl bg-gradient-to-b from-white to-blue-50/50 border border-blue-100 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 text-[#0066CC] border border-blue-200/80 flex items-center justify-center mx-auto shadow-inner">
              <GraduationCap className="w-10 h-10" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#0066CC] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Dữ Liệu Đang Được Cập Nhật</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Danh Sách Cựu Thành Viên Đang Cập Nhật
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
                Ban Chủ Nhiệm đang trong quá trình tổng hợp và xác thực hồ sơ chính thức của các thế hệ Cựu thành viên FU-DEVER (Gen 1 – Gen 10).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/activity"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold shadow-md transition-all motion-reduce:transition-none active:scale-[0.98] motion-reduce:transform-none"
              >
                <span>Khám Phá Hoạt Động CLB</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/hall-of-fame"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all motion-reduce:transition-none active:scale-[0.98] motion-reduce:transform-none"
              >
                <Award className="w-3.5 h-3.5 text-[#0066CC]" aria-hidden="true" />
                <span>Bảng Vàng Hall of Fame</span>
              </Link>
            </div>
          </div>
        )}

        {/* FILTER EMPTY STATE */}
        {!isLoading && !isError && alumniList.length > 0 && filteredAlumni.length === 0 && (
          <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3 my-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy cựu thành viên phù hợp với bộ lọc
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              Hãy thử chọn lại bộ lọc Thế hệ hoặc Doanh nghiệp để xem danh sách cựu thành viên.
            </p>
          </div>
        )}

        {/* SUCCESS DATA GRID */}
        {!isLoading && !isError && filteredAlumni.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-3xl p-6 border border-blue-100/80 hover:border-[#0066CC] shadow-sm hover:shadow-xl transition-all duration-300 motion-reduce:transition-none flex flex-col justify-between hover:-translate-y-1 motion-reduce:transform-none"
              >
                <div className="space-y-4">
                  {/* Top: Avatar & Basic Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={faceAlt(item)}
                          width={64}
                          height={64}
                          sizes="64px"
                          loading="lazy"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                        />
                      ) : (
                        <div aria-hidden="true" className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066CC] to-[#004C99] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md text-xs font-extrabold bg-[#0066CC] text-white shadow">
                        {item.graduationGen || "Alumni"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066CC] transition-colors motion-reduce:transition-none truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 truncate">
                        {item.headline}
                      </p>
                      {item.workplace && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-[#0066CC] bg-blue-50 px-2 py-0.5 rounded-md">
                          <Building2 className="w-3 h-3" aria-hidden="true" /> {item.workplace}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spotlight Quote */}
                  {item.quote && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 relative">
                      <MessageSquareQuote className="w-4 h-4 text-[#0066CC]/40 absolute top-2 right-2" aria-hidden="true" />
                      <p className="text-xs text-slate-600 font-medium italic leading-relaxed pr-4">
                        &quot;{item.quote}&quot;
                      </p>
                    </div>
                  )}

                  {/* Mentoring Status & Advisory Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                    {item.isAdvisoryBoard && (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-sm">
                        <Crown className="w-3 h-3 text-amber-600" aria-hidden="true" />
                        Ban Cố Vấn CLB
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                      Sẵn sàng Mentoring OJT
                    </span>
                  </div>

                  {/* Mentoring Topics */}
                  {item.mentoringTopics && item.mentoringTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.mentoringTopics.map((topic, tidx) => (
                        <span key={tidx} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Connect Action Button */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href={item.profileUrl || "https://linkedin.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-extrabold bg-[#0066CC] hover:bg-[#004C99] active:scale-[0.98] motion-reduce:transform-none text-white shadow-md shadow-blue-600/20 transition-all motion-reduce:transition-none flex items-center justify-center gap-2"
                  >
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Kết Nối LinkedIn &amp; Hỏi Đáp</span>
                    <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <MentorSection />
    </div>
  );
}
