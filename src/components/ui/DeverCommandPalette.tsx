"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  Users,
  FolderGit2,
  Trophy,
  ArrowRight,
  Command,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  FileCode,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  category: "Blog" | "Event" | "Resource" | "Member" | "Project";
  url: string;
  subtitle: string;
}

const QUICK_SUGGESTIONS = [
  "Next.js 14",
  "LeetCode Dynamic Programming",
  "Kho slide môn PRF192",
  "Cấu trúc dữ liệu CSD201",
  "Workshop AI & Web",
  "Danh sách thành viên Gen 9",
];

export default function DeverCommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const API_SERVER =
    process.env.NEXT_PUBLIC_API_SERVER ||
    "https://dever-backend-production.up.railway.app";

  // Hotkey listener: Ctrl + K / Cmd + K / Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced API Search
  const searchApi = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasError(false);

    try {
      const res = await fetch(
        `${API_SERVER}/api/v1/search?q=${encodeURIComponent(keyword)}&limit=25`
      );
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setResults(data.data || []);
      } else {
        setHasError(true);
      }
    } catch (err) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [API_SERVER]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchApi(query);
      } else {
        setResults([]);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query, searchApi]);

  // Filtered by Category Tab
  const filtered = results.filter(
    (item) => activeTab === "All" || item.category === activeTab
  );

  // Keyboard navigation inside list
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      const target = filtered[selectedIndex];
      setIsOpen(false);
      router.push(target.url);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Event":
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case "Blog":
        return <BookOpen className="w-4 h-4 text-[#0066CC]" />;
      case "Resource":
        return <FileCode className="w-4 h-4 text-purple-500" />;
      case "Member":
        return <Users className="w-4 h-4 text-amber-500" />;
      case "Project":
        return <FolderGit2 className="w-4 h-4 text-cyan-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <>
      {/* Floating Quick Search Trigger Widget */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Mở tìm kiếm nhanh"
        className="fixed bottom-5 left-5 z-40 hidden 2xl:flex items-center gap-3 bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:border-[#0066CC] transition-all duration-200 backdrop-blur-md group active:scale-[0.98]"
      >
        <Search className="w-4 h-4 text-[#0066CC]" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Tìm nhanh Blog, Sự kiện, Kho tài liệu...
        </span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      {/* Modal Backdrop & Command Palette */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 px-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownList}
            className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Top Search Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              {loading ? (
                <Loader2 className="w-5 h-5 text-[#0066CC] animate-spin shrink-0" />
              ) : (
                <Search className="w-5 h-5 text-[#0066CC] shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập từ khóa tìm kiếm (VD: Next.js, LeetCode, PRF192, Gen 9)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-xs text-slate-400 hover:text-slate-600 rounded"
                >
                  Xóa
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 overflow-x-auto text-xs scrollbar-none">
              {["All", "Blog", "Event", "Resource", "Project", "Member"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-[#0066CC] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab === "All" ? "Tất cả" : tab}
                </button>
              ))}
            </div>

            {/* Results & UX States List Area */}
            <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
              {/* 1. Initial State: Quick Suggestions */}
              {!query.trim() && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-[#0066CC]" /> Gợi ý tìm kiếm phổ biến:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuery(item)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-[#0066CC] border border-blue-100 transition-all active:scale-[0.98]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Loading State: Skeleton */}
              {loading && query.trim() && (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse bg-slate-50">
                      <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/5" />
                        <div className="h-3 bg-slate-100 rounded w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Error State */}
              {hasError && (
                <div className="py-10 text-center text-rose-500 space-y-3">
                  <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
                  <p className="text-sm font-semibold">Lỗi khi tìm kiếm dữ liệu từ máy chủ.</p>
                  <button
                    type="button"
                    onClick={() => searchApi(query)}
                    className="text-xs font-bold px-4 py-1.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 hover:bg-rose-100"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* 4. Empty State: No results found */}
              {!loading && !hasError && query.trim() && filtered.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Không tìm thấy kết quả phù hợp với &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-slate-400">
                    Hãy thử từ khóa ngắn hơn hoặc kiểm tra lại chính tả.
                  </p>
                </div>
              )}

              {/* 5. Success State: Live Results */}
              {!loading && !hasError && filtered.length > 0 && (
                filtered.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-150 border ${
                        isSelected
                          ? "bg-blue-50/90 dark:bg-slate-800 border-[#0066CC]/40 shadow-sm"
                          : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0066CC] transition-colors truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#0066CC] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </a>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Bar */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]">↑↓</kbd> Di chuyển
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]">ENTER</kbd> Mở
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]">ESC</kbd> Đóng
                </span>
              </div>
              <span className="font-mono font-bold text-[#0066CC] text-[10px]">
                FU-DEVER Live Search
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
