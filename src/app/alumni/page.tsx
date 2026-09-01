"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Globe,
  MessageSquareQuote,
  Search,
  Sparkles,
  FolderOpen,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
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
  isPublished?: boolean;
}

const GEN_OPTIONS = [
  "Tất Cả Thế Hệ",
  "Gen 1",
  "Gen 2",
  "Gen 3",
  "Gen 4",
  "Gen 5",
  "Gen 6",
];

const COMPANY_OPTIONS = [
  "Tất Cả Doanh Nghiệp",
  "Axon Active",
  "FPT Software",
  "VNG Corp",
  "KMS Technology",
  "SmartDev",
];

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumnus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedGen, setSelectedGen] = useState<string>("Tất Cả Thế Hệ");
  const [selectedCompany, setSelectedCompany] = useState<string>("Tất Cả Doanh Nghiệp");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchAlumni = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/v1/alumni`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const serverData = Array.isArray(json) ? json : json?.data || [];
        setAlumniList(serverData);
      } else {
        setAlumniList([]);
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
      (item.workplace && item.workplace.toLowerCase().includes(selectedCompany.toLowerCase().split(" ")[0]));

    return matchSearch && matchGen && matchCompany;
  });

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#F8FCFF]">
      {/* Hero Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
        <div className="relative bg-gradient-to-br from-[#002D66] via-[#004C99] to-[#0066CC] rounded-3xl p-8 lg:p-12 text-white shadow-2xl overflow-hidden border border-blue-400/30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/25 shadow-inner">
              <Award className="h-4 w-4 text-amber-300" aria-hidden="true" />
              <span className="text-xs font-black tracking-wider uppercase text-blue-50">
                FU-DEVER ALUMNI NETWORK
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              Mạng Lưới Cựu Thành Viên <br />
              <span className="text-cyan-200">
                Gen 1 Đến Gen 6 (Hơn 9+ Năm)
              </span>
            </h1>

            <p className="text-blue-100 text-sm lg:text-base leading-relaxed font-medium">
              Vinh danh các thế hệ cựu thành viên xuất sắc từ Gen 1 đến Gen 6 của FU-DEVER hiện đang giữ các vị trí Tech Lead, Senior Engineer và chuyên gia công nghệ tại các tập đoàn hàng đầu thế giới và Việt Nam.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-extrabold text-blue-100">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" /> 9+ Năm Phát Triển
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" /> Thế Hệ Gen 1 - Gen 6
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Sẵn Sàng Mentoring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Filters */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 space-y-8">
        {/* Controls: Search, Gen Tabs & Company Radar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Gen Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {GEN_OPTIONS.map((gen) => (
                <button
                  key={gen}
                  type="button"
                  onClick={() => setSelectedGen(gen)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                    selectedGen === gen
                      ? "bg-[#0066CC] text-white shadow-md shadow-blue-600/20 scale-[1.02]"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, công ty, vị trí..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Company Radar Quick Filter */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
              <Building2 className="w-3.5 h-3.5 text-[#0066CC]" /> Doanh nghiệp:
            </span>
            {COMPANY_OPTIONS.map((comp) => (
              <button
                key={comp}
                type="button"
                onClick={() => setSelectedCompany(comp)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedCompany === comp
                    ? "bg-blue-100 text-[#004C99] border border-blue-300"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING SKELETON */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 animate-pulse"
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
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-700">
              Không thể tải danh sách cựu thành viên
            </h3>
            <button
              onClick={fetchAlumni}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold bg-[#0066CC] hover:bg-[#004C99] text-white rounded-xl transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" /> Thử Lại
            </button>
          </div>
        )}

        {/* HONEST EMPTY STATE: NO DATA IN DB */}
        {!isLoading && !isError && alumniList.length === 0 && (
          <div className="relative rounded-3xl bg-gradient-to-b from-white to-blue-50/50 border border-blue-100 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 text-[#0066CC] border border-blue-200/80 flex items-center justify-center mx-auto shadow-inner">
              <GraduationCap className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#0066CC] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dữ Liệu Đang Được Cập Nhật</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Danh Sách Cựu Thành Viên Đang Cập Nhật
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
                Ban Chủ Nhiệm đang trong quá trình tổng hợp và xác thực hồ sơ chính thức của các thế hệ Cựu thành viên FU-DEVER (Gen 1 – Gen 6).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/activity"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold shadow-md transition-all active:scale-[0.98]"
              >
                <span>Khám Phá Hoạt Động CLB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/hall-of-fame"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all active:scale-[0.98]"
              >
                <Award className="w-3.5 h-3.5 text-[#0066CC]" />
                <span>Bảng Vàng Hall of Fame</span>
              </Link>
            </div>
          </div>
        )}

        {/* FILTER EMPTY STATE */}
        {!isLoading && !isError && alumniList.length > 0 && filteredAlumni.length === 0 && (
          <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3 my-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6" />
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
                className="group bg-white rounded-3xl p-6 border border-blue-100/80 hover:border-[#0066CC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Top: Avatar & Basic Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066CC] to-[#004C99] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-[#0066CC] text-white shadow">
                        {item.graduationGen || "Alumni"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066CC] transition-colors truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 truncate">
                        {item.headline}
                      </p>
                      {item.workplace && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#0066CC] bg-blue-50 px-2 py-0.5 rounded-md">
                          <Building2 className="w-3 h-3" /> {item.workplace}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spotlight Quote */}
                  {item.quote && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 relative">
                      <MessageSquareQuote className="w-4 h-4 text-[#0066CC]/40 absolute top-2 right-2" />
                      <p className="text-xs text-slate-600 font-medium italic leading-relaxed pr-4">
                        &quot;{item.quote}&quot;
                      </p>
                    </div>
                  )}

                  {/* Mentoring Status Badge */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Sẵn sàng Mentoring OJT
                    </span>
                  </div>
                </div>

                {/* Connect Action Button */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href={item.profileUrl || "https://linkedin.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-[#0066CC] hover:bg-[#004C99] active:scale-[0.98] text-white shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Kết Nối LinkedIn &amp; Hỏi Đáp</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
