"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  category: "Blog" | "Event" | "Resource" | "Member" | "Project";
  url: string;
  subtitle: string;
}

export default function DeverCommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("All");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
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

  const sampleResults: SearchResult[] = [
    { id: "1", title: "Workshop: Next.js 14 App Router & AI Integration", category: "Event", url: "/events", subtitle: "15/08/2026 • Hội trường Beta FPTU" },
    { id: "2", title: "Làm Chủ LeetCode Dynamic Programming & Graph Algorithms", category: "Blog", url: "/blog", subtitle: "Tác giả: Lê Đức Anh Phương (Lead Dev)" },
    { id: "3", title: "Lộ Trình Học Tập Web Fullstack & System Architecture 2026", category: "Resource", url: "/resources", subtitle: "Kho slide & ebook PDF chuẩn hóa" },
    { id: "4", title: "Bảng Xếp Hạng Đấu Trường LeetCode Realtime", category: "Member", url: "/leaderboard", subtitle: "Theo dõi 150+ thành viên thi đấu" },
    { id: "5", title: "Dự Án: Smart Student QR Check-in System", category: "Project", url: "/project-lab", subtitle: "Dự án thực tế sinh viên FPTU" },
  ];

  const filtered = sampleResults.filter(
    (item) =>
      (activeTab === "All" || item.category === activeTab) &&
      (item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      {/* Floating Quick Search Trigger Widget */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:border-[#0066CC] transition-all duration-200 backdrop-blur-md group active:scale-[0.98]"
      >
        <Search className="w-4 h-4 text-[#0066CC]" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Tìm nhanh khóa học, sự kiện...
        </span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      {/* Modal Backdrop & Command Palette */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden space-y-0">
            {/* Top Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
              <Search className="w-5 h-5 text-[#0066CC] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Nhập từ khóa tìm kiếm (Blog, Sự kiện, Member, Lộ trình)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 overflow-x-auto text-xs">
              {["All", "Event", "Blog", "Resource", "Member", "Project"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-[#0066CC] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab === "All" ? "Tất cả" : tab}
                </button>
              ))}
            </div>

            {/* Results List Area */}
            <div className="max-h-96 overflow-y-auto p-3 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-medium">Không tìm thấy kết quả phù hợp với &quot;{query}&quot;</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-all duration-200 border border-transparent hover:border-[#0066CC]/30"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-lg bg-blue-500/10 text-[#0066CC] dark:text-blue-400">
                        {item.category === "Event" && <Calendar className="w-4 h-4" />}
                        {item.category === "Blog" && <BookOpen className="w-4 h-4" />}
                        {item.category === "Resource" && <Trophy className="w-4 h-4" />}
                        {item.category === "Member" && <Users className="w-4 h-4" />}
                        {item.category === "Project" && <FolderGit2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#0066CC] transition-colors">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 font-normal">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                ))
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]">ESC</kbd> để đóng
              </span>
              <span className="font-mono text-[#0066CC]">FU-DEVER Ecosystem Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
