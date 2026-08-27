"use client";
import React, { useEffect, useState, Suspense } from "react";
import Logo from "@images/header/logo.svg";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AppProgressBar, useRouter } from "next-nprogress-bar";
import "./style.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  GraduationCap,
  Home,
  Images,
  Lightbulb,
  Library,
  Menu,
  Newspaper,
  Rocket,
  Search,
  ShieldCheck,
  Trophy,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

const animationHeader: any = {
  down: {
    y: 0,
    opacity: [0, 1],
    backgroundColor: "#fff",
    boxShadow: "0px 4px 20px 0px rgba(0, 152, 255, 0.12)",
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.8,
    },
  },
  up: {
    y: 0,
    boxShadow: "none",
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.5,
      duration: 0.8,
    },
  },
};

function Header() {
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false);
  const [isScrollHeader, setScrollHeader] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleScroll = () => {
    setOpenMenu(false);
    setActiveDropdown(null);
    const y = document.documentElement.scrollTop;
    if (y > 64) setScrollHeader(true);
    else setScrollHeader(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDirect = (url: string) => {
    setOpenMenu(false);
    setActiveDropdown(null);
    router.push(url);
    router.refresh();
  };

  const isGroupActive = (paths: string[]) => {
    return paths.some((path) => (path === "/" ? pathname === "/" : pathname.startsWith(path)));
  };

  return (
    <motion.div
      animate={isScrollHeader ? "down" : "up"}
      variants={animationHeader}
      className="left-0 right-0 top-0 fixed z-[100] bg-white/90 backdrop-blur-md border-b border-blue-50/50"
    >
      <Suspense fallback={null}>
        <AppProgressBar
          height="4px"
          color="#0098FF"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </Suspense>

      <div className="max-w-[1440px] mx-auto h-[64px] flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link href="/" className="flex items-center gap-2" aria-label="FU-DEVER - Trang chủ">
            <Image
              loading="lazy"
              src={Logo}
              alt="FU-DEVER Logo"
              className="h-8 w-auto sm:h-9"
            />
          </Link>
        </div>

        {/* Centered Desktop Navigation Grouping */}
        <div className="hidden lg:flex min-w-0 items-center justify-center gap-4 xl:gap-6 2xl:gap-8 text-xs xl:text-sm font-semibold mx-auto">
          {/* Trang chủ */}
          <button
            onClick={() => handleDirect("/")}
            className={`${
              pathname === "/" ? "text-[#0098FF] font-bold" : "text-gray-700"
            } hover:text-[#0098FF] transition-all relative py-2`}
          >
            Trang chủ
            {pathname === "/" && (
              <motion.span
                layoutId="header-active"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0098FF] rounded-full"
              />
            )}
          </button>

          {/* Group 1: Góc Học Tập */}
          <div
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown("learning")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`${
                isGroupActive(["/blog", "/events", "/resources"])
                  ? "text-[#0098FF] font-bold"
                  : "text-gray-700"
              } hover:text-[#0098FF] transition-all flex items-center gap-1.5`}
            >
              Góc Học Tập
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "learning" ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {activeDropdown === "learning" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-blue-50 p-2 text-sm flex flex-col gap-1 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => handleDirect("/blog")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <Newspaper className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Blog Kỹ Thuật</div>
                      <div className="text-xs text-gray-400">Chia sẻ kiến thức lập trình</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/events")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <CalendarDays className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Sự Kiện & Workshop</div>
                      <div className="text-xs text-gray-400">Lịch trình hội thảo CLB</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/resources")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <Library className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Kho Tài Liệu</div>
                      <div className="text-xs text-gray-400">Slide workshop & Mã nguồn mẫu</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Group 2: Cộng Đồng */}
          <div
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown("community")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`${
                isGroupActive(["/member", "/leaderboard", "/alumni"])
                  ? "text-[#0098FF] font-bold"
                  : "text-gray-700"
              } hover:text-[#0098FF] transition-all flex items-center gap-1.5`}
            >
              Cộng Đồng
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "community" ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {activeDropdown === "community" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-blue-50 p-2 text-sm flex flex-col gap-1 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => handleDirect("/leaderboard")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <Trophy className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Bảng Xếp Hạng</div>
                      <div className="text-xs text-gray-400">Đấu trường thuật toán LeetCode</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/member")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <UsersRound className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Thành Viên CLB</div>
                      <div className="text-xs text-gray-400">Danh sách ban chủ nhiệm & thành viên</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/alumni")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <GraduationCap className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Cựu Thành Viên</div>
                      <div className="text-xs text-gray-400">Hall of Fame sinh viên xuất sắc</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Group 3: Dự Án & Lab */}
          <div
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown("projects")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`${
                isGroupActive(["/project", "/activity", "/project-lab"])
                  ? "text-[#0098FF] font-bold"
                  : "text-gray-700"
              } hover:text-[#0098FF] transition-all flex items-center gap-1.5`}
            >
              Sản Phẩm & Lab
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "projects" ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {activeDropdown === "projects" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-blue-50 p-2 text-sm flex flex-col gap-1 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => handleDirect("/project")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <Rocket className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Tất Cả Dự Án</div>
                      <div className="text-xs text-gray-400">Showcase sản phẩm CLB</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/project-lab")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <Lightbulb className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Project Lab</div>
                      <div className="text-xs text-gray-400">Gợi ý ý tưởng & Ghép đội</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/activity")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <Images className="h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Hoạt Động CLB</div>
                      <div className="text-xs text-gray-400">Hình ảnh & Kỷ niệm DEVER</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Ecosystem Portals & Quick Search */}
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#0066CC] text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/80 transition-all active:scale-95 shadow-2xs"
            title="Tìm kiếm nhanh (Ctrl + K)"
            aria-label="Mở tìm kiếm"
          >
            <Search className="h-3.5 w-3.5 text-[#0066CC]" />
            <span className="hidden sm:inline text-slate-500 font-normal">Tìm kiếm</span>
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
              ⌘K
            </kbd>
          </button>

          <a
            href={process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3002"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 bg-blue-50 text-[#0066CC] hover:bg-blue-100 font-semibold text-xs px-3.5 py-2 rounded-full transition-all border border-blue-200"
          >
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" /> Member Portal
          </a>

          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3003"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-xs px-3.5 py-2 rounded-full transition-all border border-gray-200"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" /> Admin Portal
          </a>

          <button
            type="button"
            aria-label={isOpenMenu ? "Đóng điều hướng" : "Mở điều hướng"}
            aria-expanded={isOpenMenu}
            onClick={() => setOpenMenu(!isOpenMenu)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#0066CC] hover:bg-blue-50 lg:hidden"
          >
            {isOpenMenu ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpenMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto text-sm">
              {/* Quick Search in Drawer */}
              <button
                onClick={() => {
                  setOpenMenu(false);
                  window.dispatchEvent(new Event("open-command-palette"));
                }}
                className="flex w-full items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium text-xs mb-1"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#0066CC]" />
                  <span>Tìm kiếm nhanh bài viết, sự kiện...</span>
                </div>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">⌘K</kbd>
              </button>

              <button
                onClick={() => handleDirect("/")}
                className="flex w-full items-center gap-2 text-left p-3 rounded-xl hover:bg-blue-50 font-semibold text-gray-800"
              >
                <Home className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Trang chủ
              </button>

              <div className="font-bold text-xs text-[#0098FF] uppercase tracking-wider px-3 pt-2">
                Góc Học Tập
              </div>
              <button onClick={() => handleDirect("/blog")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <Newspaper className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Blog Kỹ Thuật
              </button>
              <button onClick={() => handleDirect("/events")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <CalendarDays className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Sự Kiện & Workshop
              </button>
              <button onClick={() => handleDirect("/resources")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <Library className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Kho Tài Liệu
              </button>

              <div className="font-bold text-xs text-[#0098FF] uppercase tracking-wider px-3 pt-2">
                Cộng Đồng
              </div>
              <button onClick={() => handleDirect("/leaderboard")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <Trophy className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Bảng Xếp Hạng LeetCode
              </button>
              <button onClick={() => handleDirect("/member")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <UsersRound className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Thành Viên CLB
              </button>
              <button onClick={() => handleDirect("/alumni")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <GraduationCap className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Cựu Thành Viên
              </button>

              <div className="font-bold text-xs text-[#0098FF] uppercase tracking-wider px-3 pt-2">
                Sản Phẩm & Lab
              </div>
              <button onClick={() => handleDirect("/project")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <Rocket className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Tất Cả Dự Án
              </button>
              <button onClick={() => handleDirect("/project-lab")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <Lightbulb className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Project Lab & Tìm Đồng Đội
              </button>
              <button onClick={() => handleDirect("/activity")} className="flex w-full items-center gap-2 text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                <Images className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Hoạt Động CLB
              </button>

              {/* Mobile Ecosystem Links */}
              <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3002"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50 text-[#0066CC] font-bold text-xs border border-blue-200 transition-colors"
                >
                  <UserRound className="h-4 w-4" aria-hidden="true" /> Cổng Thành Viên (Member Portal)
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3003"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-[#0066CC]" aria-hidden="true" /> Cổng Quản Trị (Admin Portal)
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Header;
