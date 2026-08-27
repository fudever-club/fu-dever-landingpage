"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  FolderOpen,
  Library,
  PenLine,
  RefreshCw,
  Search,
  X,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowUpRight,
  GitBranch,
} from "lucide-react";

import DeverKnowledgeCanvas from "@components/ui/DeverKnowledgeCanvas";
import MemphisConfettiBackground from "@components/ui/MemphisConfettiBackground";

interface ResourceItem {
  _id?: string;
  id?: number;
  title: string;
  date?: string;
  author?: string;
  type: "Slide" | "Source Code" | "Ebook / PDF" | "Cheatsheet" | string;
  fileUrl: string;
  size: string;
  description?: string;
  category?: string;
  isSpotlight?: boolean;
}

interface ResourceActionInfo {
  isDirectFile: boolean;
  label: string;
  modalLabel: string;
  iconType: "download" | "github" | "drive" | "external";
  url: string;
  storageNote: string;
}

const CATEGORIES = [
  "Tất Cả",
  "Slide Bài Giảng",
  "Mã Nguồn Mẫu",
  "Ebook / Giáo Trình",
  "Cheatsheet",
  "Web & Frontend",
  "Backend & Architecture",
  "Giải Thuật ICPC",
  "AI & Data Science",
];

const CURATED_RESOURCES: ResourceItem[] = [
  {
    id: 1,
    title: "Slide Workshop: Tối Ưu Hóa Next.js 14 App Router & Server Components",
    date: "15/08/2026",
    author: "Ban Chuyên Môn FU-DEVER",
    type: "Slide",
    category: "Web & Frontend",
    fileUrl: "https://drive.google.com/file/d/sample_nextjs14_slide/view",
    size: "14.5 MB (PDF)",
    description: "Bộ slide đào tạo chi tiết về kiến trúc Server Components, cơ chế caching 4 tầng và kỹ thuật tối ưu Core Web Vitals.",
    isSpotlight: true,
  },
  {
    id: 2,
    title: "Mã Nguồn Mẫu: Fullstack Express + TypeScript + Clean Architecture",
    date: "02/08/2026",
    author: "Dev Team DEVER",
    type: "Source Code",
    category: "Backend & Architecture",
    fileUrl: "https://github.com/fu-dever/vnpay-nodejs-template",
    size: "2.8 MB (GitHub Repo)",
    description: "Boilerplate chuẩn doanh nghiệp tích hợp sẵn JWT Auth, Mongoose, Docker-compose, Swagger và thanh toán VNPAY.",
    isSpotlight: true,
  },
  {
    id: 3,
    title: "Ebook / Cẩm Nang: 100 Thuật Toán Kinh Điển & Bí Kíp Giải CSD201",
    date: "20/07/2026",
    author: "ICPC & Competitive Programming Team",
    type: "Ebook / PDF",
    category: "Giải Thuật ICPC",
    fileUrl: "https://drive.google.com/file/d/sample_csd201_algorithms/view",
    size: "8.2 MB (PDF)",
    description: "Tổng hợp các dạng bài quy hoạch động, cây nhị phân, đồ thị Dijkstra và các bẫy thường gặp trong các kỳ thi FPTU.",
    isSpotlight: true,
  },
  {
    id: 4,
    title: "Cheatsheet: Trọn Bộ Phím Tắt & Lệnh Git Thực Chiến Dành Cho Dev",
    date: "10/07/2026",
    author: "CLB FU-DEVER",
    type: "Cheatsheet",
    category: "Cheatsheet",
    fileUrl: "https://drive.google.com/file/d/sample_git_cheatsheet/view",
    size: "1.5 MB (PDF Infographic)",
    description: "Bản tóm tắt trực quan các lệnh Rebase, Cherry-pick, Stash và giải quyết Conflict trong môi trường làm việc nhóm.",
  },
  {
    id: 5,
    title: "Slide Workshop: Nhập Môn Trí Tuệ Nhân Tạo & Xây Dựng AI RAG Pipeline",
    date: "28/06/2026",
    author: "AI Research Team DEVER",
    type: "Slide",
    category: "AI & Data Science",
    fileUrl: "https://drive.google.com/file/d/sample_ai_rag_workshop/view",
    size: "22.4 MB (PDF)",
    description: "Hướng dẫn thực chiến tích hợp LangChain, Vector Database và OpenAI API vào ứng dụng web thực tế.",
  },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>(CURATED_RESOURCES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất Cả");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  const fetchResources = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/v1/resources`);
      if (res.ok) {
        const json = await res.json();
        const serverData = Array.isArray(json) ? json : json?.data || [];
        if (serverData.length > 0) {
          setResources(serverData);
        } else {
          setResources(CURATED_RESOURCES);
        }
      } else {
        setResources(CURATED_RESOURCES);
      }
    } catch (err) {
      console.warn("Backend API unavailable, using curated fallback resources:", err);
      setResources(CURATED_RESOURCES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = resources.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === "Tất Cả") return matchSearch;

    const catLower = selectedCategory.toLowerCase();
    const matchCategory =
      (item.category && item.category.toLowerCase().includes(catLower)) ||
      (item.type && item.type.toLowerCase().includes(catLower)) ||
      (selectedCategory === "Slide Bài Giảng" && item.type?.toLowerCase().includes("slide")) ||
      (selectedCategory === "Mã Nguồn Mẫu" && (item.type?.toLowerCase().includes("code") || item.type?.toLowerCase().includes("source"))) ||
      (selectedCategory === "Ebook / Giáo Trình" && (item.type?.toLowerCase().includes("ebook") || item.type?.toLowerCase().includes("pdf"))) ||
      (selectedCategory === "Cheatsheet" && (item.type?.toLowerCase().includes("cheatsheet") || item.category?.toLowerCase().includes("cẩm nang")));

    return matchSearch && matchCategory;
  });

  const getIconForType = (type: string) => {
    if (type.includes("Code")) return <FileCode className="h-4 w-4 text-[#0066CC]" />;
    if (type.includes("Slide")) return <FileText className="h-4 w-4 text-purple-600" />;
    return <BookOpen className="h-4 w-4 text-amber-600" />;
  };

  const getResourceActionInfo = (item: ResourceItem): ResourceActionInfo => {
    const apiUrl = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
    const rawUrl = (item.fileUrl || "").trim();

    if (rawUrl.includes("github.com")) {
      return {
        isDirectFile: false,
        label: "GitHub Repo",
        modalLabel: "Mở Kho Mã Nguồn GitHub",
        iconType: "github",
        url: rawUrl,
        storageNote: "Mã nguồn mở được lưu trữ và cập nhật trực tiếp trên tổ chức GitHub của CLB FU-DEVER.",
      };
    }

    if (rawUrl.includes("drive.google.com") || rawUrl.includes("docs.google.com")) {
      return {
        isDirectFile: false,
        label: "Google Drive",
        modalLabel: "Mở Thư Mục Google Drive",
        iconType: "drive",
        url: rawUrl,
        storageNote: "Tài liệu được chia sẻ và xem trực tuyến trên Google Drive của CLB FU-DEVER.",
      };
    }

    if (
      rawUrl.includes("figma.com") ||
      rawUrl.includes("notion.so") ||
      rawUrl.includes("notion.site") ||
      rawUrl.includes("youtube.com") ||
      rawUrl.includes("youtu.be")
    ) {
      return {
        isDirectFile: false,
        label: "Mở Liên Kết",
        modalLabel: "Truy Cập Liên Kết Ngoài",
        iconType: "external",
        url: rawUrl,
        storageNote: "Liên kết tài nguyên mở trực tiếp trên nền tảng chuyên dụng bên ngoài.",
      };
    }

    const isBackendUpload =
      rawUrl.includes("/api/v1/upload/file") ||
      rawUrl.includes("fu-dever-storage") ||
      rawUrl === "uploaded-file" ||
      rawUrl.startsWith("/");

    const isDirectFileExtension = /\.(pdf|zip|rar|7z|pptx|docx|xlsx|tar|gz|txt|md|csv)$/i.test(rawUrl);

    if (isBackendUpload || isDirectFileExtension || (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://"))) {
      const finalUrl = isBackendUpload
        ? (item._id ? `${apiUrl}/api/v1/resources/${item._id}/download` : (rawUrl.startsWith("http") ? rawUrl : `${apiUrl}${rawUrl}`))
        : rawUrl;

      return {
        isDirectFile: true,
        label: "Tải Về Máy",
        modalLabel: "Tải Tệp Trực Tiếp Về Máy",
        iconType: "download",
        url: finalUrl,
        storageNote: "Tệp tin được lưu trữ và phân phối an toàn trên hệ thống Cloud Storage của CLB FU-DEVER.",
      };
    }

    return {
      isDirectFile: false,
      label: "Truy Cập",
      modalLabel: "Truy Cập Tài Liệu",
      iconType: "external",
      url: rawUrl,
      storageNote: "Liên kết tài liệu trực tuyến mở trong tab trình duyệt mới.",
    };
  };

  const renderActionIcon = (iconType: ResourceActionInfo["iconType"]) => {
    switch (iconType) {
      case "download":
        return <Download className="h-3.5 w-3.5" />;
      case "github":
        return <FileCode className="h-3.5 w-3.5" />;
      case "drive":
        return <FolderOpen className="h-3.5 w-3.5" />;
      default:
        return <ExternalLink className="h-3.5 w-3.5" />;
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-20 bg-[#F8FAFC]">
      {/* Memphis Confetti Animated Background Wrapper for Hero & Spotlight */}
      <MemphisConfettiBackground className="pt-4 pb-4">
        {/* 1. Header */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-10">
          <div className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066CC] font-mono text-xs font-bold tracking-wider uppercase shadow-xs">
                <Library className="h-3.5 w-3.5" />
                <span>TÀI LIỆU &amp; HỌC THUẬT FU-DEVER</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Góc Học Tập &amp; Kho Tài Liệu <br />
                <span className="text-[#0066CC]">Lập Trình</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
                Tổng hợp slide bài giảng workshop, tài liệu học tập chuyên ngành và các bộ mã nguồn mẫu do Ban Chuyên Môn FU-DEVER tổng hợp và chia sẻ.
              </p>

              {/* Feature Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0066CC]" /> Tài nguyên học tập mở
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0066CC]" /> Tài liệu môn học chuyên ngành
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0066CC]" /> Mã nguồn mẫu chuẩn hóa
                </span>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, slide, đề thi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all text-slate-900 shadow-xs placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>

        {/* 2. Top 3 Spotlight Modules */}
        {selectedCategory === "Tất Cả" && !searchQuery && (
          <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0066CC]" /> TÀI LIỆU TIÊU ĐIỂM
              </h2>
              <span className="text-xs text-slate-500 font-medium">3 mục nổi bật</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Spotlight 1: Large Feature (6 cols) */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-blue-50 text-[#004C99] border border-blue-200">
                      SLIDE WORKSHOP
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">14.5 MB (PDF)</span>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 group-hover:text-[#0066CC] transition-colors leading-snug">
                    Tối Ưu Hóa Next.js 14 App Router &amp; Server Components
                  </h3>

                  <p className="text-xs lg:text-sm text-slate-600 leading-relaxed font-medium">
                    Bộ slide đào tạo chi tiết về kiến trúc Server Components, cơ chế caching 4 tầng và kỹ thuật tối ưu Core Web Vitals từ chuyên đề đào tạo Gen 6-8.
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <PenLine className="w-3.5 h-3.5 text-[#0066CC]" /> Ban Chuyên Môn FU-DEVER
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">15/08/2026</span>
                  <a
                    href="https://drive.google.com/file/d/sample_nextjs14_slide/view"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
                  >
                    <span>Mở Google Drive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Spotlight 2: Clean Architecture Boilerplate (3 cols) */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-black bg-purple-50 text-purple-700 border border-purple-200 inline-block">
                    MÃ NGUỒN MẪU
                  </span>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066CC] transition-colors leading-snug">
                    Fullstack Express + TS + Clean Architecture
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                    Boilerplate chuẩn doanh nghiệp tích hợp sẵn JWT Auth, Mongoose, Docker và Swagger.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 font-bold">2.8 MB</span>
                  <a
                    href="https://github.com/fu-dever/vnpay-nodejs-template"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                  >
                    <FileCode className="w-3 h-3 text-[#0066CC]" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              {/* Spotlight 3: CSD201 Algorithms Ebook (3 cols) */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-black bg-amber-50 text-amber-800 border border-amber-200 inline-block">
                    EBOOK THUẬT TOÁN
                  </span>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066CC] transition-colors leading-snug">
                    100 Thuật Toán Kinh Điển &amp; Đề Thi FPTU
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                    Tổng hợp các dạng bài quy hoạch động, cây nhị phân, đồ thị Dijkstra và bẫy đề thi.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 font-bold">8.2 MB (PDF)</span>
                  <a
                    href="https://drive.google.com/file/d/sample_csd201_algorithms/view"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0066CC] text-xs font-bold transition-all"
                  >
                    <Download className="w-3 h-3 text-[#0066CC]" />
                    <span>Xem PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </MemphisConfettiBackground>

      {/* 3. Segmented Pill Filters Bar */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-[#0066CC] text-white shadow-sm scale-[1.02]"
                  : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Main Resource Grid Section */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-black text-slate-500 uppercase tracking-wider">
            DANH SÁCH TÀI LIỆU ({filteredResources.length})
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-10 bg-slate-200 rounded-xl pt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-red-700">
                Không thể tải danh sách tài liệu
              </h3>
              <p className="text-xs text-slate-600">
                Vui lòng kiểm tra lại kết nối mạng hoặc thử tải lại trang.
              </p>
            </div>
            <button
              onClick={fetchResources}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold bg-[#0066CC] hover:bg-[#004C99] text-white rounded-xl transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" /> Thử Lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredResources.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-[#0066CC] rounded-2xl flex items-center justify-center mx-auto">
              <FolderOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Không tìm thấy tài liệu phù hợp
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục &quot;Tất Cả&quot; để khám phá kho tài nguyên của CLB.
            </p>
          </div>
        )}

        {/* Resource Cards Grid */}
        {!isLoading && !isError && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item, idx) => {
              const actionInfo = getResourceActionInfo(item);
              return (
                <div
                  key={item._id || item.id || idx}
                  className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0066CC]/60 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    {/* Header: Category Tag & File Size */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-[#004C99] border border-blue-100">
                        {getIconForType(item.type)}
                        <span>{item.type}</span>
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {item.size}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0066CC] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-100">
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5 text-[#0066CC]" /> {item.date}
                        </span>
                      )}
                      {item.author && (
                        <span className="flex items-center gap-1">
                          <PenLine className="h-3.5 w-3.5 text-[#0066CC]" /> {item.author}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedResource(item)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Chi Tiết</span>
                    </button>

                    <a
                      href={actionInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      {...(actionInfo.isDirectFile ? { download: true } : {})}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#0066CC] hover:bg-[#004C99] active:scale-[0.98] text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      {renderActionIcon(actionInfo.iconType)}
                      <span>{actionInfo.label}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Resource Modal */}
      {selectedResource && (() => {
        const actionInfo = getResourceActionInfo(selectedResource);
        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 lg:p-8 shadow-2xl space-y-5 border border-slate-200">
              <div className="flex justify-between items-start">
                <span className="bg-blue-50 text-[#004C99] font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                  {renderActionIcon(actionInfo.iconType)} {actionInfo.isDirectFile ? "TẢI TỆP TIN" : "LIÊN KẾT TÀI LIỆU"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  aria-label="Đóng hộp thoại tài liệu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-950 mb-2 leading-snug">
                  {selectedResource.title}
                </h3>
                {selectedResource.description && (
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                    {selectedResource.description}
                  </p>
                )}
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 font-semibold space-y-1 border border-slate-200">
                  <p>• <strong>Định dạng:</strong> {selectedResource.type}</p>
                  <p>• <strong>Dung lượng / Nguồn:</strong> {selectedResource.size}</p>
                  {selectedResource.author && <p>• <strong>Biên soạn:</strong> {selectedResource.author}</p>}
                </div>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-xl text-xs text-slate-800 font-semibold border border-blue-200 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{actionInfo.storageNote}</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Đóng
                </button>
                <a
                  href={actionInfo.url}
                  target="_blank"
                  rel="noreferrer"
                  {...(actionInfo.isDirectFile ? { download: true } : {})}
                  className="px-5 py-2 bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  {renderActionIcon(actionInfo.iconType)}
                  <span>{actionInfo.modalLabel}</span>
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
