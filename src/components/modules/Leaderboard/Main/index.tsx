"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Search,
  ExternalLink,
  User as UserIcon,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import avatar_default from "@images/pages/leaderBoard/avatar_default.png";
import crown from "@icons/pages/leaderBoard/crown.svg";

interface LeaderboardUser {
  leetcodeUsername?: string;
  acSubmissionList?: unknown[];
  totalSolved?: number;
  user?: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    profileKey?: string | null;
    major?: string | null;
    gen?: string | number | null;
  } | null;
}

interface LeaderboardModuleProps {
  leaderboardData: LeaderboardUser[];
  hasLoadError?: boolean;
}

export default function LeaderboardModule({
  leaderboardData = [],
  hasLoadError = false,
}: LeaderboardModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const user1 = leaderboardData?.[0];
  const user2 = leaderboardData?.[1];
  const user3 = leaderboardData?.[2];

  const filteredList = leaderboardData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${item.user?.firstname || ""} ${item.user?.lastname || ""}`.toLowerCase();
    const username = (item.leetcodeUsername || "").toLowerCase();
    return fullName.includes(q) || username.includes(q);
  });

  const getPoints = (item?: LeaderboardUser) => {
    if (!item) return 0;
    if (typeof item.totalSolved === "number") return item.totalSolved * 10;
    return (item.acSubmissionList?.length || 0) * 10;
  };

  const getSolvedCount = (item?: LeaderboardUser) => {
    if (!item) return 0;
    if (typeof item.totalSolved === "number") return item.totalSolved;
    return item.acSubmissionList?.length || 0;
  };

  const getFullName = (userObj?: LeaderboardUser["user"]) => {
    if (!userObj) return "Thành viên DEVER";
    const name = [userObj.firstname, userObj.lastname].filter(Boolean).join(" ");
    return name || "Thành viên ẩn danh";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 pb-16">
      {/* Title & Season Badge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0066CC] dark:text-blue-400 text-xs sm:text-sm font-bold mb-4 tracking-wide uppercase shadow-sm">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          Đấu Trường Thuật Toán • Summer 2026 (Gen 9 - K21)
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
          BẢNG XẾP HẠNG{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066CC] via-[#0080FF] to-cyan-500">
            LEETCODE REALTIME
          </span>
        </h1>

        <p className="mt-3 text-xs sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Tuyên dương các thành viên có thành tích giải bài và rèn luyện thuật toán xuất sắc nhất CLB FU-DEVER.
        </p>
      </section>

      {/* Fluid Top 3 Podium Section */}
      {leaderboardData.length >= 3 && !hasLoadError && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 items-end justify-center">
            {/* Rank 2 - Silver (Left on desktop, order-1) */}
            <div className="flex flex-col items-center order-1 group">
              <div className="relative w-full max-w-[110px] sm:max-w-[180px] md:max-w-[240px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={user2?.user?.avatar || avatar_default}
                  alt={getFullName(user2?.user)}
                  fill
                  sizes="(max-width: 640px) 110px, (max-width: 1024px) 180px, 240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-3 text-white">
                  <span className="w-6 h-6 sm:w-9 sm:h-9 bg-slate-300 text-slate-900 rounded-full flex items-center justify-center font-black text-xs sm:text-base shadow-md mx-auto mb-1">
                    2
                  </span>
                  <p className="text-[10px] sm:text-xs font-bold text-center text-slate-200 truncate">
                    {getFullName(user2?.user)}
                  </p>
                  <p className="text-[9px] sm:text-[11px] font-semibold text-center text-cyan-300">
                    {getPoints(user2)} pts
                  </p>
                </div>
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {user2?.leetcodeUsername || "LeetCoder"}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Đã giải: {getSolvedCount(user2)} bài
                </p>
              </div>
            </div>

            {/* Rank 1 - Gold Champion (Center, elevated, order-2) */}
            <div className="flex flex-col items-center order-2 -translate-y-3 sm:-translate-y-6 group">
              <div className="relative w-full max-w-[130px] sm:max-w-[210px] md:max-w-[280px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-slate-800 shadow-2xl shadow-amber-500/20 group-hover:shadow-amber-500/30 group-hover:scale-[1.02] transition-all duration-300">
                {/* Gold Crown */}
                <div className="absolute -top-1 sm:top-1 left-1/2 -translate-x-1/2 z-20">
                  <Image
                    src={crown}
                    alt="Champion Crown"
                    width={48}
                    height={40}
                    className="w-7 h-6 sm:w-12 sm:h-10 drop-shadow-md"
                  />
                </div>
                <Image
                  src={user1?.user?.avatar || avatar_default}
                  alt={getFullName(user1?.user)}
                  fill
                  sizes="(max-width: 640px) 130px, (max-width: 1024px) 210px, 280px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-4 text-white">
                  <span className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 rounded-full flex items-center justify-center font-black text-xs sm:text-lg shadow-lg mx-auto mb-1">
                    1
                  </span>
                  <p className="text-[11px] sm:text-sm font-black text-center text-amber-200 truncate">
                    {getFullName(user1?.user)}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-center text-yellow-300">
                    {getPoints(user1)} pts
                  </p>
                </div>
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p className="text-xs sm:text-base font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> {user1?.leetcodeUsername || "Champion"}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Đã giải: {getSolvedCount(user1)} bài
                </p>
              </div>
            </div>

            {/* Rank 3 - Bronze (Right on desktop, order-3) */}
            <div className="flex flex-col items-center order-3 group">
              <div className="relative w-full max-w-[110px] sm:max-w-[180px] md:max-w-[240px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-amber-700/60 dark:border-amber-800 bg-slate-100 dark:bg-slate-800 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={user3?.user?.avatar || avatar_default}
                  alt={getFullName(user3?.user)}
                  fill
                  sizes="(max-width: 640px) 110px, (max-width: 1024px) 180px, 240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-3 text-white">
                  <span className="w-6 h-6 sm:w-9 sm:h-9 bg-amber-700 text-white rounded-full flex items-center justify-center font-black text-xs sm:text-base shadow-md mx-auto mb-1">
                    3
                  </span>
                  <p className="text-[10px] sm:text-xs font-bold text-center text-slate-200 truncate">
                    {getFullName(user3?.user)}
                  </p>
                  <p className="text-[9px] sm:text-[11px] font-semibold text-center text-amber-300">
                    {getPoints(user3)} pts
                  </p>
                </div>
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {user3?.leetcodeUsername || "LeetCoder"}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Đã giải: {getSolvedCount(user3)} bài
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Fluid Ranking Table & Search Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#0066CC]" /> Danh Sách Xếp Hạng Chi Tiết
              </h2>
              <p className="text-xs text-slate-500">
                Tổng cộng {leaderboardData.length} thành viên tham gia tranh tài
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên hoặc LeetCode ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0066CC] transition-colors"
              />
            </div>
          </div>

          {/* Table Header Row (Hidden on very small mobile, visible on sm+) */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">Hạng</div>
            <div className="col-span-6">Thành viên</div>
            <div className="col-span-3 text-center">LeetCode ID</div>
            <div className="col-span-2 text-right">Điểm số</div>
          </div>

          {/* Load Error State */}
          {hasLoadError && (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-rose-500">
                Không thể kết nối đến máy chủ LeetCode Sync.
              </p>
              <p className="text-xs text-slate-400">
                Dữ liệu bảng xếp hạng đang được đồng bộ tự động. Vui lòng quay lại sau ít phút.
              </p>
            </div>
          )}

          {/* Empty Search Result State */}
          {!hasLoadError && filteredList.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <UserIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {searchQuery ? `Không tìm thấy thành viên khớp với "${searchQuery}"` : "Chưa có dữ liệu bảng xếp hạng."}
              </p>
            </div>
          )}

          {/* Fluid User Cards / Table Rows */}
          {!hasLoadError && (
            <div className="space-y-2">
              {filteredList.map((entry, index) => {
                const rank = index + 1;
                const profileKey = entry?.user?.profileKey;
                const isTop1 = rank === 1;
                const isTop2 = rank === 2;
                const isTop3 = rank === 3;

                const rowContent = (
                  <div
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-200 ${
                      isTop1
                        ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 hover:border-amber-400"
                        : isTop2
                        ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                        : isTop3
                        ? "bg-amber-900/5 dark:bg-amber-950/10 border-amber-800/20 hover:border-amber-700/40"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-[#0066CC]/30 hover:bg-blue-50/40 dark:hover:bg-slate-800/60"
                    } hover:shadow-sm active:scale-[0.99]`}
                  >
                    {/* Left: Rank & Avatar & Name */}
                    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                      {/* Rank Badge */}
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isTop1
                            ? "bg-amber-400 text-slate-950 shadow-sm"
                            : isTop2
                            ? "bg-slate-300 text-slate-900"
                            : isTop3
                            ? "bg-amber-700 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold"
                        }`}
                      >
                        {rank}
                      </span>

                      {/* User Avatar */}
                      <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        <Image
                          src={entry?.user?.avatar || avatar_default}
                          alt={getFullName(entry?.user)}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>

                      {/* Name & Subtitle */}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                          {getFullName(entry?.user)}
                          {isTop1 && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                          {entry?.user?.major || "Software Engineering"} • Gen {entry?.user?.gen || "9"}
                        </p>
                      </div>
                    </div>

                    {/* Center: LeetCode ID (Desktop) */}
                    <div className="hidden sm:block text-center px-4">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {entry?.leetcodeUsername || "N/A"}
                      </span>
                    </div>

                    {/* Right: Points & Solved count */}
                    <div className="text-right shrink-0 pl-2">
                      <div className="text-xs sm:text-sm font-black text-[#0066CC] dark:text-blue-400">
                        {getPoints(entry)} pts
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        {getSolvedCount(entry)} bài giải
                      </div>
                    </div>

                    {/* Navigation arrow if has profile */}
                    {profileKey && (
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-2 hidden sm:block" />
                    )}
                  </div>
                );

                return profileKey ? (
                  <Link
                    href={`/member/${encodeURIComponent(profileKey)}`}
                    key={entry.leetcodeUsername || `user-${index}`}
                    className="block"
                  >
                    {rowContent}
                  </Link>
                ) : (
                  <div key={entry.leetcodeUsername || `user-${index}`}>
                    {rowContent}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
