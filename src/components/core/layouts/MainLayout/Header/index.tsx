"use client";
import React, { useEffect, useState, Suspense } from "react";
import Logo from "@images/header/logo.svg";
import MenuLogo from "@images/header/menu.svg";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AppProgressBar, useRouter } from "next-nprogress-bar";
import "./style.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import DeverCommandPalette from "@components/ui/DeverCommandPalette";

const animationHeader: any = {
  down: {
    y: [-60, 0],
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
      <DeverCommandPalette />

      <div className="max-w-[1440px] mx-auto h-[64px] flex items-center justify-between px-5 md:px-10 xl:px-20">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              loading="lazy"
              src={Logo}
              alt="FU-DEVER Logo"
              className="w-auto h-9"
            />
          </Link>
        </div>

        {/* Centered Desktop Navigation Grouping */}
        <div className="hidden lg:flex items-center justify-center gap-8 text-[15px] font-medium mx-auto">
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
              <span className="text-xs transition-transform duration-200" style={{ transform: activeDropdown === "learning" ? "rotate(180deg)" : "rotate(0deg)" }}>
                ▾
              </span>
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
                    <span className="text-lg">📰</span>
                    <div>
                      <div className="font-semibold">Blog Kỹ Thuật</div>
                      <div className="text-xs text-gray-400">Chia sẻ kiến thức lập trình</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/events")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <span className="text-lg">📅</span>
                    <div>
                      <div className="font-semibold">Sự Kiện & Workshop</div>
                      <div className="text-xs text-gray-400">Lịch trình hội thảo CLB</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/resources")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <span className="text-lg">📚</span>
                    <div>
                      <div className="font-semibold">Kho Tài Liệu & Roadmap</div>
                      <div className="text-xs text-gray-400">Lộ trình học & Slide mẫu</div>
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
              <span className="text-xs transition-transform duration-200" style={{ transform: activeDropdown === "community" ? "rotate(180deg)" : "rotate(0deg)" }}>
                ▾
              </span>
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
                    <span className="text-lg">🏆</span>
                    <div>
                      <div className="font-semibold">Bảng Xếp Hạng</div>
                      <div className="text-xs text-gray-400">Đua TOP LeetCode giải thuật</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/member")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <span className="text-lg">👥</span>
                    <div>
                      <div className="font-semibold">Thành Viên CLB</div>
                      <div className="text-xs text-gray-400">Danh sách member active</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/alumni")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <span className="text-lg">🎓</span>
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
              <span className="text-xs transition-transform duration-200" style={{ transform: activeDropdown === "projects" ? "rotate(180deg)" : "rotate(0deg)" }}>
                ▾
              </span>
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
                    <span className="text-lg">🚀</span>
                    <div>
                      <div className="font-semibold">Tất Cả Dự Án</div>
                      <div className="text-xs text-gray-400">Showcase sản phẩm CLB</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/project-lab")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <span className="text-lg">💡</span>
                    <div>
                      <div className="font-semibold">Project Lab</div>
                      <div className="text-xs text-gray-400">Gợi ý ý tưởng & Ghép đội</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDirect("/activity")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors text-gray-700 hover:text-[#0098FF]"
                  >
                    <span className="text-lg">🎪</span>
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

        {/* Right Ecosystem Portals */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <a
            href={process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3002"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 bg-blue-50 text-[#0098FF] hover:bg-blue-100 font-semibold text-xs px-3.5 py-2 rounded-full transition-all border border-blue-200"
          >
            <span>👤</span> Member Portal
          </a>

          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3003"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-xs px-3.5 py-2 rounded-full transition-all border border-gray-200"
          >
            <span>🛡️</span> Admin Portal
          </a>

          <Image
            loading="lazy"
            src={MenuLogo}
            alt="Menu Toggle"
            className="block lg:hidden cursor-pointer"
            onClick={() => setOpenMenu(!isOpenMenu)}
          />
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
              <button
                onClick={() => handleDirect("/")}
                className="w-full text-left p-3 rounded-xl hover:bg-blue-50 font-semibold text-gray-800"
              >
                🏠 Trang chủ
              </button>

              <div className="font-bold text-xs text-[#0098FF] uppercase tracking-wider px-3 pt-2">
                Góc Học Tập
              </div>
              <button onClick={() => handleDirect("/blog")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                📰 Blog Kỹ Thuật
              </button>
              <button onClick={() => handleDirect("/events")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                📅 Sự Kiện & Workshop
              </button>
              <button onClick={() => handleDirect("/resources")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                📚 Kho Tài Liệu & Roadmap
              </button>

              <div className="font-bold text-xs text-[#0098FF] uppercase tracking-wider px-3 pt-2">
                Cộng Đồng
              </div>
              <button onClick={() => handleDirect("/leaderboard")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                🏆 Bảng Xếp Hạng LeetCode
              </button>
              <button onClick={() => handleDirect("/member")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                👥 Thành Viên CLB
              </button>
              <button onClick={() => handleDirect("/alumni")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                🎓 Cựu Thành Viên
              </button>

              <div className="font-bold text-xs text-[#0098FF] uppercase tracking-wider px-3 pt-2">
                Sản Phẩm & Lab
              </div>
              <button onClick={() => handleDirect("/project")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                🚀 Tất Cả Dự Án
              </button>
              <button onClick={() => handleDirect("/project-lab")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                💡 Project Lab & Tìm Đồng Đội
              </button>
              <button onClick={() => handleDirect("/activity")} className="w-full text-left p-2.5 pl-6 rounded-xl hover:bg-blue-50 text-gray-700">
                🎪 Hoạt Động CLB
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Header;
