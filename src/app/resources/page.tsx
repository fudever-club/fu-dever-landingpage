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
  Globe,
  Library,
  PenLine,
  RefreshCw,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";

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
  },
  {
    id: 4,
    title: "Cheatsheet: Trọn Bộ Phím Tắt & Lệnh Git Thực Chiến Dành Cho Dev",
    date: "10/07/2026",
    author: "CLB FU-DEVER",
    type: "Cheatsheet",
    category: "Cẩm Nang Chung",
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
    if (type.includes("Code")) return <FileCode className="h-5 w-5 text-[#0066CC]" />;
    if (type.includes("Slide")) return <FileText className="h-5 w-5 text-purple-600" />;
    return <BookOpen className="h-5 w-5 text-amber-600" />;
  };

  /**
   * Phân tích thông minh loại tài nguyên:
   * - Kho mã nguồn GitHub ➔ Mở GitHub Repo
   * - Google Drive / Docs ➔ Mở Google Drive
   * - Figma / Notion / Website ➔ Mở Liên Kết Ngoài
   * - Tệp tin trực tiếp (PDF, ZIP, R2 Storage, Proxy Stream) ➔ Tải Về Máy
   */
  const getResourceActionInfo = (item: ResourceItem): ResourceActionInfo => {
    const apiUrl = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
    const rawUrl = (item.fileUrl || "").trim();

    // 1. Kiểm tra nếu là GitHub repository
    if (rawUrl.includes("github.com")) {
      return {
        isDirectFile: false,
        label: "Mở GitHub",
        modalLabel: "Mở Kho Mã Nguồn GitHub",
        iconType: "github",
        url: rawUrl,
        storageNote: "Mã nguồn mở được lưu trữ và cập nhật trực tiếp trên tổ chức GitHub của CLB FU-DEVER.",
      };
    }

    // 2. Kiểm tra nếu là Google Drive / Google Docs / Sheets
    if (rawUrl.includes("drive.google.com") || rawUrl.includes("docs.google.com")) {
      return {
        isDirectFile: false,
        label: "Mở Drive",
        modalLabel: "Mở Thư Mục Google Drive",
        iconType: "drive",
        url: rawUrl,
        storageNote: "Tài liệu được chia sẻ và xem trực tuyến trên Google Drive của CLB FU-DEVER.",
      };
    }

    // 3. Kiểm tra nếu là Figma, Notion, Youtube hoặc link ngoài
    if (
      rawUrl.includes("figma.com") ||
      rawUrl.includes("notion.so") ||
      rawUrl.includes("notion.site") ||
      rawUrl.includes("youtube.com") ||
      rawUrl.includes("youtu.be")
    ) {
      return {
        isDirectFile: false,
        label: "Mở Link",
        modalLabel: "Truy Cập Liên Kết Ngoài",
        iconType: "external",
        url: rawUrl,
        storageNote: "Liên kết tài nguyên mở trực tiếp trên nền tảng chuyên dụng bên ngoài.",
      };
    }

    // 4. Kiểm tra nếu là tệp tin trực tiếp trên Cloud R2 / Local Server Storage
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

    // 5. Mặc định đối với các đường link URL khác
    return {
      isDirectFile: false,
      label: "Mở Liên Kết",
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
    <main className="min-h-screen pt-24 pb-20 bg-[#F8FCFF]">
      {/* Header Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
        <div className="relative bg-gradient-to-br from-[#002D66] via-[#004C99] to-[#0066CC] rounded-3xl p-8 lg:p-12 text-white shadow-2xl overflow-hidden border border-blue-400/30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/25 shadow-inner">
              <Library className="h-4 w-4 text-blue-200" aria-hidden="true" />
              <span className="text-xs font-black tracking-wider uppercase text-blue-50">
                FU-DEVER ACADEMIC &amp; TECH VAULT
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              Kho Tài Liệu &amp; Tri Thức <br />
              <span className="bg-gradient-to-r from-cyan-200 via-blue-100 to-amber-200 bg-clip-text text-transparent">
                Lập Trình Chuyên Sâu
              </span>
            </h1>

            <p className="text-blue-100 text-sm lg:text-base leading-relaxed font-medium">
              Tổng hợp toàn bộ slide bài giảng workshop chuyên môn, cẩm nang luyện thuật toán, tài liệu môn học FPTU và các bộ mã nguồn mẫu chuẩn hóa do Ban Chuyên Môn FU-DEVER biên soạn.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-extrabold text-blue-100">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Tải Miễn Phí 100%
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Cập Nhật Liên Tục 2026
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Kiểm Duyệt Chuyên Môn
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 space-y-8">
        {/* Controls: Search & Category Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#0066CC] text-white shadow-md shadow-blue-600/20 scale-[1.02]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu, slide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:bg-white transition-all text-slate-900"
            />
          </div>
        </div>

        {/* STATE 2: LOADING SKELETON STATE */}
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

        {/* STATE 4: ERROR STATE */}
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

        {/* STATE 1: EMPTY STATE */}
        {!isLoading && !isError && filteredResources.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-[#0066CC] rounded-full flex items-center justify-center mx-auto">
              <FolderOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy tài liệu phù hợp
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục &quot;Tất Cả&quot; để khám phá kho tài nguyên của CLB.
            </p>
          </div>
        )}

        {/* STATE 3: SUCCESS STATE (Data Grid Showcase) */}
        {!isLoading && !isError && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item, idx) => {
              const actionInfo = getResourceActionInfo(item);
              return (
                <div
                  key={item._id || item.id || idx}
                  className="group bg-white rounded-2xl p-6 border border-blue-100/80 hover:border-[#0066CC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    {/* Category & File Size Header */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-[#004C99] border border-blue-100">
                        {getIconForType(item.type)}
                        <span>{item.type}</span>
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 font-mono">
                        {item.size}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066CC] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    )}

                    {/* Meta: Date & Author */}
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

                  {/* Action Buttons: 1-Click Smart Action & Modal Details */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedResource(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold bg-blue-50 hover:bg-blue-100 text-[#0066CC] border border-blue-200 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Chi Tiết</span>
                    </button>

                    <a
                      href={actionInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      {...(actionInfo.isDirectFile ? { download: true } : {})}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold bg-[#0066CC] hover:bg-[#004C99] active:scale-[0.98] text-white shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
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

      {/* Resource Download / View Modal */}
      {selectedResource && (() => {
        const actionInfo = getResourceActionInfo(selectedResource);
        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 lg:p-8 shadow-2xl space-y-5">
              <div className="flex justify-between items-start">
                <span className="bg-blue-100 text-[#004C99] font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                  {renderActionIcon(actionInfo.iconType)} {actionInfo.isDirectFile ? "TẢI TỆP TIN" : "LIÊN KẾT TÀI LIỆU"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  aria-label="Đóng hộp thoại tài liệu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-950 mb-2 leading-snug">
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

              <div className="bg-blue-50 p-4 rounded-2xl text-xs text-slate-800 font-semibold border border-blue-200 flex items-start gap-2">
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
                  className="px-6 py-2.5 bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
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
