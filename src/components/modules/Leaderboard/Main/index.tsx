"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Search,
  ChevronRight,
  ChevronDown,
  User as UserIcon,
  Sparkles,
  Award,
  CalendarDays,
  Clock,
  Inbox,
  RotateCcw,
} from "lucide-react";
import { apiFetch } from "@/src/lib/api";
import avatar_default from "@images/pages/leaderBoard/avatar_default.png";
import { TiltedCard } from "@components/ui/TiltedCard";
import DeverCodeParallaxBackground from "@components/ui/DeverCodeParallaxBackground";
import DeverMatrixRain from "@components/ui/DeverMatrixRain";

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

// Dedicated safe LeaderboardAvatar with graceful error fallback
function LeaderboardAvatar({
  src,
  name,
}: {
  src?: string | null;
  name: string;
}) {
  const [imgError, setImgError] = useState(false);
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(-2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "DV";

  return (
    <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0066CC] font-bold text-xs border border-blue-200 overflow-hidden select-none">
      {!imgError && src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span role="img" aria-label={name} className="font-extrabold tracking-tight">{initials}</span>
      )}
    </div>
  );
}

type SeasonItem = {
  _id: string;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
};

type SeasonEntryBreakdown = {
  easy?: number | null;
  medium?: number | null;
  hard?: number | null;
  unknown?: number | null;
};

type SeasonLeaderboardEntry = {
  leetcodeUsername?: string | null;
  solved?: number | null;
  score?: number | null;
  breakdown?: SeasonEntryBreakdown | null;
  user?: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    profileKey?: string | null;
  } | null;
};

type SeasonBoard = {
  season?: SeasonItem | null;
  scoringComplete: boolean;
  entries: SeasonLeaderboardEntry[];
};

const formatSeasonDate = (value?: string | null): string => {
  if (!value) return "";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getSeasonFullName = (user?: SeasonLeaderboardEntry["user"]): string => {
  if (!user) return "Thành viên DEVER";
  const name = [user.firstname, user.lastname].filter(Boolean).join(" ");
  return name || "Thành viên ẩn danh";
};

function SeasonLeaderboardBoard() {
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [board, setBoard] = useState<SeasonBoard | null>(null);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [seasonsError, setSeasonsError] = useState(false);
  const [boardError, setBoardError] = useState(false);
  const [noActiveSeason, setNoActiveSeason] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loadSeasons = async () => {
      setLoadingSeasons(true);
      setSeasonsError(false);
      try {
        const response = await apiFetch(`/api/v1/seasons`, {
          cache: "no-store",
        });
        if (cancelled) return;
        if (response.ok) {
          const payload = await response.json();
          const list: SeasonItem[] = Array.isArray(payload?.data)
            ? payload.data.filter(
                (item: unknown): item is SeasonItem =>
                  typeof item === "object" && item !== null && "_id" in item,
              )
            : [];
          setSeasons(list);
          if (list.length > 0) {
            const active =
              list.find((item) => item?.status === "active") ?? list[0];
            setSelectedId((previous) => previous || active?._id || "");
          } else {
            setSelectedId("");
          }
        } else {
          setSeasons([]);
          setSeasonsError(true);
        }
      } catch {
        if (!cancelled) {
          setSeasons([]);
          setSeasonsError(true);
        }
      } finally {
        if (!cancelled) setLoadingSeasons(false);
      }
    };
    loadSeasons();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (loadingSeasons) return;
    let cancelled = false;
    const loadBoard = async () => {
      setLoadingBoard(true);
      setBoardError(false);
      setNoActiveSeason(false);
      try {
        const path = selectedId
          ? `/api/v1/seasons/leaderboard?seasonId=${encodeURIComponent(selectedId)}`
          : `/api/v1/seasons/leaderboard`;
        const response = await apiFetch(path, { cache: "no-store" });
        if (cancelled) return;
        if (response.status === 404) {
          setBoard(null);
          setNoActiveSeason(true);
          return;
        }
        if (!response.ok) {
          setBoardError(true);
          return;
        }
        const payload = await response.json();
        const data = payload?.data;
        if (data === null || data === undefined) {
          setBoard(null);
          setNoActiveSeason(true);
          return;
        }
        if (!Array.isArray(data?.entries)) {
          setBoardError(true);
          return;
        }
        const entries = [...(data.entries as SeasonLeaderboardEntry[])].sort(
          (a, b) => (b?.score ?? 0) - (a?.score ?? 0),
        );
        setBoard({
          season: (data?.season as SeasonItem | null) ?? null,
          scoringComplete: data?.scoringComplete !== false,
          entries,
        });
      } catch {
        if (!cancelled) setBoardError(true);
      } finally {
        if (!cancelled) setLoadingBoard(false);
      }
    };
    loadBoard();
    return () => {
      cancelled = true;
    };
  }, [selectedId, loadingSeasons, reloadKey]);

  const isLoading = loadingSeasons || loadingBoard;
  const selectedSeason =
    seasons.find((item) => item._id === selectedId) ?? board?.season ?? null;
  const entries = board?.entries ?? [];
  const scoringComplete = board?.scoringComplete ?? true;
  const showBoardError = !isLoading && boardError;
  const showSeasonsError = !isLoading && seasonsError && !board;
  const showNoSeason = !isLoading && !boardError && noActiveSeason;
  const showEmptyEntries =
    !isLoading && !boardError && !noActiveSeason && board !== null && entries.length === 0;

  const seasonRange = selectedSeason
    ? [formatSeasonDate(selectedSeason.startDate), formatSeasonDate(selectedSeason.endDate)]
        .filter(Boolean)
        .join(" – ")
    : "";

  return (
    <section
      aria-label="Bảng xếp hạng mùa giải"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#0066CC] shrink-0" /> Bảng Xếp Hạng Mùa Giải
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              {selectedSeason?.name ? (
                <span className="truncate">
                  {selectedSeason.name}
                  {seasonRange ? ` • ${seasonRange}` : ""}
                </span>
              ) : (
                <span>Mùa giải đang diễn ra</span>
              )}
            </p>
          </div>

          <div className="w-full sm:w-64">
            <label
              htmlFor="season-select"
              className="sr-only"
            >
              Chọn mùa giải
            </label>
            <div className="relative">
              <select
                id="season-select"
                value={selectedId}
                disabled={loadingSeasons || seasons.length === 0}
                onChange={(event) => setSelectedId(event.target.value)}
                className="w-full appearance-none pl-3 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] transition-all disabled:opacity-50"
              >
                {seasons.length === 0 && <option value="">Chọn mùa giải</option>}
                {seasons.map((season) => (
                  <option
                    key={season._id}
                    value={season._id}
                  >
                    {season.name || "Mùa giải"}
                    {season.status === "active" ? " • Đang diễn ra" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {!scoringComplete && board && !isLoading && (
          <p className="m-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-bold">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              Điểm đang hoàn thiện — sync admin
            </span>
          </p>
        )}

        <div
          aria-live="polite"
          className="space-y-2.5"
        >
          {isLoading && (
            <div
              aria-busy="true"
              className="space-y-2.5"
            >
              {[0, 1, 2, 3].map((skeleton) => (
                <div
                  key={skeleton}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse motion-reduce:animate-none"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/5 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-2.5 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                  <div className="h-4 w-14 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {(showBoardError || showSeasonsError) && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-4 sm:p-5 text-center space-y-2"
            >
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400 m-0">
                Không thể tải bảng xếp hạng mùa giải.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                Vui lòng kiểm tra kết nối và thử lại sau ít phút.
              </p>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setReloadKey((key) => key + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0066CC] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all duration-200 hover:bg-[#004C99] active:scale-[0.98] disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Thử lại
              </button>
            </div>
          )}

          {showNoSeason && (
            <div className="py-10 text-center space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 m-0">
                Chưa có mùa giải nào đang diễn ra
              </p>
              <p className="text-xs text-slate-400 m-0">
                Ban tổ chức sẽ công bố mùa giải mới trong thời gian tới.
              </p>
            </div>
          )}

          {showEmptyEntries && (
            <div className="py-10 text-center space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 m-0">
                Mùa giải này chưa có dữ liệu xếp hạng.
              </p>
            </div>
          )}

          {!isLoading && !boardError && board && entries.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-3 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <span className="w-7 sm:w-8 text-center shrink-0">Hạng</span>
                  <span className="truncate">Thành viên</span>
                </div>
                <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                  <span className="hidden sm:inline-block">Đã giải</span>
                  <span className="text-right">Điểm</span>
                </div>
              </div>
              <ol className="space-y-2.5 list-none m-0 p-0">
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  const profileKey = entry?.user?.profileKey;
                  const fullName = getSeasonFullName(entry?.user);
                  const solved = entry?.solved ?? 0;
                  const score = entry?.score ?? 0;
                  const easy = entry?.breakdown?.easy ?? 0;
                  const medium = entry?.breakdown?.medium ?? 0;
                  const hard = entry?.breakdown?.hard ?? 0;
                  const unknown = entry?.breakdown?.unknown ?? 0;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;

                  const rowContent = (
                    <div
                      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 ${
                        isTop1
                          ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50 shadow-sm"
                          : isTop2
                          ? "bg-slate-50/80 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700"
                          : isTop3
                          ? "bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/30"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-slate-800/50"
                      } hover:shadow-md active:scale-[0.99]`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                          <span
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                              isTop1
                                ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md font-black"
                                : isTop2
                                ? "bg-slate-300 text-slate-900 font-black"
                                : isTop3
                                ? "bg-amber-700 text-white font-black"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {rank}
                          </span>
                          <LeaderboardAvatar
                            src={entry?.user?.avatar}
                            name={fullName}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5 m-0">
                              <span className="truncate">{fullName}</span>
                              {isTop1 && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            </p>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate m-0 mt-0.5 font-mono">
                              @{entry?.leetcodeUsername || "member"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <div className="text-xs sm:text-sm font-black text-[#0066CC] dark:text-blue-400 leading-tight">
                            {score} pts
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                            {solved} bài
                          </div>
                        </div>
                        {profileKey && (
                          <ChevronRight className="w-4 h-4 text-slate-400 ml-1 hidden sm:block shrink-0" />
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-9 sm:pl-12">
                        <span className="inline-flex items-center rounded-md border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          E {easy}
                        </span>
                        <span className="inline-flex items-center rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          M {medium}
                        </span>
                        <span className="inline-flex items-center rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                          H {hard}
                        </span>
                        {unknown > 0 && (
                          <span className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            ? {unknown}
                          </span>
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <li key={`${entry?.leetcodeUsername || "member"}-${rank}`}>
                      {profileKey ? (
                        <Link
                          href={`/member/${encodeURIComponent(profileKey)}`}
                          className="block"
                        >
                          {rowContent}
                        </Link>
                      ) : (
                        rowContent
                      )}
                    </li>
                  );
                })}
              </ol>
              <p className="text-[11px] text-slate-400 px-1 m-0">
                E: Dễ • M: Trung bình • H: Khó • Xếp hạng theo tổng điểm mùa giải.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
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
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-16">
      {/* Full-Page Crisp Matrix Rain & Parallax Floating Code Symbols */}
      <DeverMatrixRain opacity={0.4} fontSize={13} className="pt-4 pb-10">
        <DeverCodeParallaxBackground className="w-full">
          {/* Title & Season Badge */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 pb-4 mb-4 sm:mb-6">
            <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0066CC] dark:text-blue-400 text-xs sm:text-sm font-bold mb-4 tracking-wide uppercase shadow-sm">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              Bảng Vinh Danh Thuật Toán • FU-DEVER
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
              BẢNG XẾP HẠNG{" "}
              <span className="text-[#0066CC] dark:text-[#0080FF]">
                LEETCODE
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Tuyên dương các thành viên có thành tích giải bài và rèn luyện thuật toán xuất sắc nhất của Câu lạc bộ FU-DEVER.
            </p>
          </section>

          {/* Season leaderboard (per-season score ranking) */}
          <SeasonLeaderboardBoard />

          {/* Fluid Top 3 Podium Section with TiltedCard 3D Parallax */}
          {leaderboardData.length >= 3 && !hasLoadError && (
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10">
              <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 items-end justify-center">
                {/* Rank 2 - Silver (Left on desktop, order-1) */}
                <div className="flex min-w-0 flex-col items-center order-1 group">
                  <div className="w-full max-w-[110px] sm:max-w-[180px] md:max-w-[240px] aspect-[3/4]">
                    <TiltedCard
                      imageSrc={user2?.user?.avatar || avatar_default}
                      altText={getFullName(user2?.user)}
                      captionText={`@${user2?.leetcodeUsername || "LeetCoder"} • ${getPoints(user2)} PTS`}
                      rotateAmplitude={12}
                      scaleOnHover={1.08}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      imageClassName="border-2 sm:border-4 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                      overlayContent={
                        <div className="w-full p-2 sm:p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-b-2xl text-white text-center">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-300 text-slate-900 rounded-full inline-flex items-center justify-center font-black text-xs sm:text-sm shadow-md mx-auto mb-1">
                            2
                          </span>
                          <p className="text-[10px] sm:text-xs font-bold text-slate-200 truncate">
                            {getFullName(user2?.user)}
                          </p>
                          <p className="text-[9px] sm:text-[11px] font-semibold text-cyan-300">
                            {getPoints(user2)} pts
                          </p>
                        </div>
                      }
                    />
                  </div>
                  <div className="mt-3 text-center hidden sm:block">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      {user2?.leetcodeUsername || "LeetCoder"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Đã giải: {getSolvedCount(user2)} bài
                    </p>
                  </div>
                </div>

                {/* Rank 1 - Gold Champion (Center, elevated, order-2) */}
                <div className="flex min-w-0 flex-col items-center order-2 -translate-y-3 sm:-translate-y-6 group">
                  <div className="w-full max-w-[130px] sm:max-w-[210px] md:max-w-[280px] aspect-[3/4] relative">
                    <TiltedCard
                      imageSrc={user1?.user?.avatar || avatar_default}
                      altText={getFullName(user1?.user)}
                      captionText={`👑 QUÁN QUÂN • @${user1?.leetcodeUsername || "Champion"} • ${getPoints(user1)} PTS`}
                      rotateAmplitude={14}
                      scaleOnHover={1.12}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      imageClassName="border-3 sm:border-4 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-slate-800 shadow-2xl shadow-amber-500/30"
                      overlayContent={
                        <div className="w-full p-2 sm:p-4 bg-gradient-to-t from-black/85 via-black/20 to-transparent rounded-b-2xl text-white text-center">
                          <span className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 rounded-full inline-flex items-center justify-center font-black text-xs sm:text-base shadow-lg mx-auto mb-1 border border-white">
                            1
                          </span>
                          <p className="text-[11px] sm:text-sm font-black text-amber-200 truncate">
                            {getFullName(user1?.user)}
                          </p>
                          <p className="text-[10px] sm:text-xs font-bold text-yellow-300">
                            {getPoints(user1)} pts
                          </p>
                        </div>
                      }
                    />
                  </div>
                  <div className="mt-3 text-center hidden sm:block">
                    <p className="text-xs sm:text-base font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {user1?.leetcodeUsername || "Champion"}
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      Đã giải: {getSolvedCount(user1)} bài
                    </p>
                  </div>
                </div>

                {/* Rank 3 - Bronze (Right on desktop, order-3) */}
                <div className="flex min-w-0 flex-col items-center order-3 group">
                  <div className="w-full max-w-[110px] sm:max-w-[180px] md:max-w-[240px] aspect-[3/4]">
                    <TiltedCard
                      imageSrc={user3?.user?.avatar || avatar_default}
                      altText={getFullName(user3?.user)}
                      captionText={`@${user3?.leetcodeUsername || "LeetCoder"} • ${getPoints(user3)} PTS`}
                      rotateAmplitude={12}
                      scaleOnHover={1.08}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      imageClassName="border-2 sm:border-4 border-amber-700/60 dark:border-amber-800 bg-slate-100 dark:bg-slate-800"
                      overlayContent={
                        <div className="w-full p-2 sm:p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-b-2xl text-white text-center">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-700 text-white rounded-full inline-flex items-center justify-center font-black text-xs sm:text-sm shadow-md mx-auto mb-1 border border-amber-400">
                            3
                          </span>
                          <p className="text-[10px] sm:text-xs font-bold text-slate-200 truncate">
                            {getFullName(user3?.user)}
                          </p>
                          <p className="text-[9px] sm:text-[11px] font-semibold text-amber-300">
                            {getPoints(user3)} pts
                          </p>
                        </div>
                      }
                    />
                  </div>
                  <div className="mt-3 text-center hidden sm:block">
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

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc LeetCode ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Table Header Row */}
          <div className="flex items-center justify-between gap-3 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <span className="w-7 sm:w-8 text-center shrink-0">Hạng</span>
              <span className="truncate">Thành viên</span>
            </div>
            <div className="flex shrink-0 items-center gap-6 sm:gap-8">
              <span className="hidden md:inline-block">LeetCode ID</span>
              <span className="text-right">Điểm số (AC)</span>
            </div>
          </div>

          {/* Error State */}
          {hasLoadError && (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-rose-500">
                Không thể tải dữ liệu bảng xếp hạng từ hệ thống backend.
              </p>
              <p className="text-xs text-slate-400">
                Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau ít phút.
              </p>
            </div>
          )}

          {/* Empty Search Result */}
          {!hasLoadError && filteredList.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <UserIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {searchQuery ? `Không tìm thấy thành viên khớp với "${searchQuery}"` : "Chưa có dữ liệu bảng xếp hạng."}
              </p>
            </div>
          )}

          {/* User Rows */}
          {!hasLoadError && (
            <div className="space-y-2.5">
              {filteredList.map((entry, index) => {
                const rank = index + 1;
                const profileKey = entry?.user?.profileKey;
                const isTop1 = rank === 1;
                const isTop2 = rank === 2;
                const isTop3 = rank === 3;
                const fullName = getFullName(entry?.user);

                const rowContent = (
                  <div
                    className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border transition-all duration-200 ${
                      isTop1
                        ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50 shadow-sm"
                        : isTop2
                        ? "bg-slate-50/80 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700"
                        : isTop3
                        ? "bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/30"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-slate-800/50"
                    } hover:shadow-md active:scale-[0.99]`}
                  >
                    {/* Left: Rank & Avatar & Name */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      {/* Rank Number */}
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                          isTop1
                            ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md font-black"
                            : isTop2
                            ? "bg-slate-300 text-slate-900 font-black"
                            : isTop3
                            ? "bg-amber-700 text-white font-black"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {rank}
                      </span>

                      {/* Safe Avatar with Error Handling */}
                      <LeaderboardAvatar src={entry?.user?.avatar} name={fullName} />

                      {/* Name & Subtitle */}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5 m-0">
                          <span>{fullName}</span>
                          {isTop1 && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate m-0 mt-0.5">
                          {entry?.user?.major || "Chuyên ngành KTMT/SE"} • K{entry?.user?.gen || "21"}
                        </p>
                      </div>
                    </div>

                    {/* Center: LeetCode ID */}
                    <div className="hidden md:block text-center shrink-0 px-2">
                      <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        @{entry?.leetcodeUsername || "member"}
                      </span>
                    </div>

                    {/* Right: Points & Solved Count */}
                    <div className="text-right shrink-0 pl-2">
                      <div className="text-xs sm:text-sm font-black text-[#0066CC] dark:text-blue-400 leading-tight">
                        {getPoints(entry)} pts
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                        {getSolvedCount(entry)} bài
                      </div>
                    </div>

                    {/* Navigation Arrow */}
                    {profileKey && (
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-1 hidden sm:block shrink-0" />
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
        </DeverCodeParallaxBackground>
      </DeverMatrixRain>
    </div>
  );
}
