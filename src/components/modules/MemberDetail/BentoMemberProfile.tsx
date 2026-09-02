"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  Share2,
  ArrowLeft,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  MapPin,
  Mail,
  Flame,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FolderGit2,
  Globe,
  Award,
  Shield,
  Zap,
  BookOpen,
  X,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  VolumeX,
  Headphones,
  Radio,
} from "lucide-react";
import { TiltedCard } from "@components/ui/TiltedCard";

interface BentoMemberProfileProps {
  user: any;
}

interface ContributionProject {
  title: string;
  role: string;
  tech: string[];
  link: string;
  description: string;
}

interface TechArticle {
  title: string;
  date: string;
  readTime: string;
  category: string;
  link: string;
}

const BADGE_CATALOG: Record<string, any> = {
  algorithmic_prodigy: {
    id: "algorithmic_prodigy",
    name: "Algorithmic Prodigy",
    iconName: "Terminal",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100/80 border-amber-300 text-amber-900",
    badgeLabel: "GIẢI THUẬT ICPC",
    desc: "Đạt Top Đấu Trường Thuật Toán LeetCode & giải thuật chuyên sâu.",
  },
  pro_tech_author: {
    id: "pro_tech_author",
    name: "Pro Tech Author",
    iconName: "BookOpen",
    iconColor: "text-[#0066CC]",
    bgColor: "bg-blue-100/80 border-blue-300 text-[#004C99]",
    badgeLabel: "TÁC GIẢ KỸ THUẬT",
    desc: "Đã xuất bản bài viết kỹ thuật chuyên sâu trên DEVER Engineering Blog.",
  },
  speed_coder: {
    id: "speed_coder",
    name: "Speed Coder",
    iconName: "Zap",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100/80 border-emerald-300 text-emerald-900",
    badgeLabel: "HACKATHON SPEED",
    desc: "Hoàn thành thử thách lập trình trực tiếp trong thời gian kỷ lục.",
  },
  core_contributor: {
    id: "core_contributor",
    name: "Core Contributor",
    iconName: "Shield",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100/80 border-purple-300 text-purple-900",
    badgeLabel: "NÒNG CỐT DỰ ÁN",
    desc: "Thành viên nòng cốt đóng góp các module tính năng cho hệ sinh thái Web DEVER.",
  },
};

const CONTRIBUTED_PROJECTS: ContributionProject[] = [];
const AUTHORED_ARTICLES: TechArticle[] = [];

// Royalty-free open-source lofi stream for developer coding
const DEFAULT_AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

export default function BentoMemberProfile({ user }: BentoMemberProfileProps) {
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("14:22");
  const [selectedDrawer, setSelectedDrawer] = useState<"projects" | "articles" | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progressSec, setProgressSec] = useState(84); // 1:24
  const durationSec = 225; // 3:45

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  // Track progress timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgressSec((prev) => (prev >= durationSec ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(true);
        });
    }
  };

  const formatSec = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `FU-DEVER | ${fullName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const fullName = user?.firstname || user?.lastname
    ? `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim()
    : "Thành viên DEVER";

  const monogram = (user?.firstname?.[0] || "") + (user?.lastname?.[0] || "D") || "DV";
  const position = user?.positionId?.name || "Kỹ sư Phần mềm • Ban Chuyên Môn";
  const genCohort = user?.gen ? `Gen ${user.gen}` : (user?.MSSV ? `K${user.MSSV.slice(2, 4)}` : "DEVER Member");
  const avatarUrl = user?.avatar || "/images/pages/leaderBoard/avatar_default.png";
  const bio = user?.description || `Xin chào! Tôi là ${fullName}, thành viên tích cực tại CLB Lập Trình FU-DEVER. Đam mê xây dựng các sản phẩm web hiệu năng cao, thuật toán tối ưu và chia sẻ kiến thức công nghệ cùng cộng đồng FPTU.`;
  
  // Real dynamic user data
  const skillsList = Array.isArray(user?.skills) ? user.skills : [];
  const projectsList = Array.isArray(user?.projects) ? user.projects : [];
  const articlesList = Array.isArray(user?.articles) ? user.articles : [];

  const rawBadges = Array.isArray(user?.unlockedBadges) ? user.unlockedBadges : [];
  const userBadges = rawBadges.map((b: any) => {
    const bId = typeof b === "string" ? b : (b?.badgeId || b?.id);
    return BADGE_CATALOG[bId] || {
      id: bId,
      name: bId || "Huy hiệu DEVER",
      iconName: "Award",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200 text-blue-900",
      badgeLabel: "DANH HIỆU",
      desc: "Huy hiệu thành viên đạt được qua các hoạt động CLB.",
    };
  });

  const streakDays = typeof user?.streakDays === "number" ? user.streakDays : (user?.streak ?? 0);
  const leetcodeSolved = user?.totalSolved ?? (Array.isArray(user?.acSubmissionList) ? user.acSubmissionList.length : 0);
  const leetcodeUsername = user?.leetcodeUsername || null;
  const email = user?.email || "contact@dever.club";

  // Helper to extract social URL from either array or direct string properties
  const getSocialUrl = (platform: "facebook" | "github" | "linkedin" | "leetcode" | "tiktok") => {
    if (user?.[platform]) return user[platform];
    if (Array.isArray(user?.socials)) {
      const found = user.socials.find((s: any) => {
        const name = (s?.social?.name || s?.socialId?.name || s?.name || s?.social?.constant || s?.socialId?.constant || "").toLowerCase();
        const url = (s?.url || "").toLowerCase();
        return name.includes(platform) || url.includes(platform);
      });
      if (found?.url) return found.url;
    }
    return null;
  };

  const facebookUrl = getSocialUrl("facebook");
  const githubUrl = getSocialUrl("github");
  const linkedinUrl = getSocialUrl("linkedin");
  const userLocation = user?.hometown || user?.workplace || user?.school || "Đà Nẵng, VN";

  // Song info customizable per member
  const hasCustomTrack = Boolean(user?.favoriteTrack?.title || user?.favoriteTrack?.url);
  const songTitle = user?.favoriteTrack?.title || "DEVER Chill Beats (Mặc định)";
  const songArtist = user?.favoriteTrack?.artist || (hasCustomTrack ? "Bản nhạc tùy chỉnh" : "Bản nhạc mặc định");
  const audioSource = user?.favoriteTrack?.url || DEFAULT_AUDIO_URL;

  // Heatmap Dots representation based on real streak
  const heatmapDots = [
    streakDays >= 7 ? 4 : (streakDays >= 5 ? 3 : 1), 2, 4, 1, 0, 3, 2,
    4, 4, 2, 3, 1, 0, 4,
    2, 3, 4, 4, 1, 2, 3,
    4, 3, 4, 2, 4, 3, streakDays > 0 ? 4 : 0,
  ];

  const renderBadgeIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Terminal":
        return <Terminal className={className} />;
      case "BookOpen":
        return <BookOpen className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "Shield":
        return <Shield className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 pt-24 pb-20 px-4 sm:px-6 relative selection:bg-[#0066CC] selection:text-white font-sans">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={audioSource}
        preload="none"
        loop
        muted={isMuted}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Subtle modern dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15, 23, 42, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-[1120px] mx-auto relative z-10 space-y-6">
        {/* 1. Slim Top Bar (Crisp White Card with Slate Borders) */}
        <header className="flex items-center justify-between bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
          {/* Left: Monogram & Back link */}
          <div className="flex items-center gap-3">
            <Link
              href="/member"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#004C99] to-[#0066CC] text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono">
                {monogram.toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-900 leading-none">
                  {fullName}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold mt-0.5">
                  {user?.nickname ? `@${user.nickname}` : "fu-dever.member"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="h-9 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Đã sao chép" : "Copy link"}</span>
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95"
              title="Chia sẻ profile"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </header>

        {/* 2. Signature Diverse & Vibrant Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[176px] gap-4">
          {/* TILE 1: Profile Anchor (2x2 - Crisp White & Royal Blue Tag) */}
          <div className="tile md:col-span-2 md:row-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-blue-400/60 hover:shadow-md">
            {/* Top row: 3D Tilted Avatar & Emerald Active Tag */}
            <div className="flex items-start justify-between gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                <TiltedCard
                  imageSrc={avatarUrl}
                  altText={fullName}
                  captionText={`✨ ${fullName} • ${position}`}
                  rotateAmplitude={12}
                  scaleOnHover={1.08}
                  showMobileWarning={false}
                  showTooltip={true}
                  imageClassName="rounded-2xl object-cover ring-2 ring-blue-200 shadow-md"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{genCohort}</span>
              </div>
            </div>

            {/* Name & Role & Bio */}
            <div className="space-y-2 mt-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                <span>{fullName}</span>
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#0066CC]">
                {position}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                {bio}
              </p>
            </div>

            {/* Bottom Row: Social Icon Buttons */}
            <div className="flex items-center gap-2 pt-4 mt-auto border-t border-slate-100">
              <a
                href={facebookUrl || "https://facebook.com/fu.dever.club"}
                target="_blank"
                rel="noreferrer"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-xs ${
                  facebookUrl
                    ? "bg-blue-50/70 border-blue-200 text-[#0066CC] hover:bg-[#0066CC] hover:text-white"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
                title={facebookUrl ? "Facebook cá nhân" : "Facebook CLB FU-DEVER"}
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={githubUrl || "https://github.com/fudever-club"}
                target="_blank"
                rel="noreferrer"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-xs ${
                  githubUrl
                    ? "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-900 hover:text-white"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
                title={githubUrl ? "GitHub cá nhân" : "GitHub CLB FU-DEVER"}
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href={linkedinUrl || "https://linkedin.com"}
                target="_blank"
                rel="noreferrer"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-xs ${
                  linkedinUrl
                    ? "bg-indigo-50/70 border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
                title={linkedinUrl ? "LinkedIn cá nhân" : "LinkedIn CLB FU-DEVER"}
              >
                <Terminal className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-10 h-10 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-600 hover:text-white transition-all duration-200 shadow-xs"
                title={`Email: ${email}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* TILE 2: DEVER Audio & Coding Soundtrack Player with Spinning Logo Disc (2-wide) */}
          <div className="tile md:col-span-2 rounded-3xl shadow-xs relative overflow-hidden bg-[#0F172A] border border-slate-800 min-h-[176px] transition-all duration-200 hover:border-[#0080FF]/50 flex flex-col justify-between p-4 sm:p-5 text-white group">
            {/* Subtle DEVER Blue Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#0066CC]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Headphones Icon & DEVER Live Equalizer */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10.5px] uppercase tracking-[0.16em] font-mono font-bold text-slate-300">
                  CODING SOUNDTRACK // LO-FI
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Cyan/Blue Soundwave */}
              <div className="flex items-end gap-1 h-3.5">
                <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlaying ? "h-3.5 animate-pulse" : "h-1"}`} />
                <span className={`w-0.5 bg-[#0080FF] rounded-full transition-all ${isPlaying ? "h-2.5 animate-pulse" : "h-1"}`} />
                <span className={`w-0.5 bg-cyan-300 rounded-full transition-all ${isPlaying ? "h-3 animate-pulse" : "h-1"}`} />
                <span className={`w-0.5 bg-[#0066CC] rounded-full transition-all ${isPlaying ? "h-1.5 animate-pulse" : "h-1"}`} />
              </div>
            </div>

            {/* Middle: Spinning DEVER Vinyl Disc + Track Info + Controls */}
            <div className="relative z-10 flex items-center justify-between gap-3 my-auto">
              {/* Left: Spinning Vinyl Record with Real DEVER Logo */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-700/80 shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {/* Vinyl Grooves Texture */}
                  <div className="absolute inset-0 rounded-full border border-slate-700/40 opacity-70" />
                  <div className="absolute inset-1.5 rounded-full border border-slate-700/40 opacity-70" />
                  <div className="absolute inset-3 rounded-full border border-slate-700/40 opacity-70" />
                  
                  {/* Spinning Center Label with DEVER Logo */}
                  <div
                    className={`relative w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm transition-transform ${
                      isPlaying ? "animate-[spin_6s_linear_infinite]" : ""
                    }`}
                  >
                    <Image
                      src="/icons/layout/logo.png"
                      alt="DEVER Logo"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Track Details */}
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate hover:text-cyan-300 cursor-pointer transition-colors">
                    {songTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate hover:text-slate-200 cursor-pointer">
                    {songArtist}
                  </p>
                </div>
              </div>

              {/* Center/Right: Audio Player Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                  title="Yêu thích bài hát"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`w-7 h-7 hidden sm:flex items-center justify-center transition-colors ${
                    isShuffle ? "text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                  title="Phát ngẫu nhiên"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>

                {/* DEVER Royal Blue Circular Play/Pause Button */}
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#0066CC] to-[#0080FF] hover:brightness-110 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-600/30"
                  title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`w-7 h-7 hidden sm:flex items-center justify-center transition-colors ${
                    isRepeat ? "text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                  title="Lặp lại"
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bottom: Modern Audio Scrub Bar */}
            <div className="relative z-10 flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
              <span>{formatSec(progressSec)}</span>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPercent = clickX / rect.width;
                  setProgressSec(Math.floor(newPercent * durationSec));
                }}
                className="relative flex-1 h-1 rounded-full bg-slate-800 hover:h-1.5 cursor-pointer group/bar transition-all"
              >
                <div
                  className="h-full bg-slate-400 group-hover/bar:bg-gradient-to-r group-hover/bar:from-[#0066CC] group-hover/bar:to-cyan-400 rounded-full transition-all"
                  style={{ width: `${(progressSec / durationSec) * 100}%` }}
                />
              </div>
              <span>{formatSec(durationSec)}</span>
            </div>
          </div>

          {/* TILE 3: Badge Rack (1x1 - Pearl Lavender Card with Jewel Badges) */}
          <div className="tile md:col-span-1 bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-slate-50 rounded-3xl shadow-xs p-4 sm:p-5 flex flex-col justify-between min-h-[176px] border border-purple-200/70 hover:border-purple-400 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] font-bold font-mono text-purple-900">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>BADGE RACK</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-700">
                {userBadges.length} DANH HIỆU
              </span>
            </div>

            {/* Jewel Badges */}
            {userBadges.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 my-auto">
                {userBadges.map((b: any, bIdx: number) => (
                  <button
                    key={b.id || bIdx}
                    type="button"
                    onClick={() => setSelectedBadge(b)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xs ${b.bgColor}`}
                    title={b.name}
                  >
                    {renderBadgeIcon(b.iconName, `w-4 h-4 ${b.iconColor}`)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="my-auto py-2 text-center text-xs text-purple-700/60 font-medium">
                Chưa mở khóa danh hiệu
              </div>
            )}

            <p className="text-[10px] text-purple-800/80 text-center font-medium">
              {userBadges.length > 0 ? "Bấm để xem chi tiết danh hiệu" : "Tham gia hoạt động để mở khóa"}
            </p>
          </div>

          {/* TILE 4: Sunset Streak & Heatmap (1x1 - Coral / Sunset Gradient) */}
          <div className="tile md:col-span-1 bg-gradient-to-br from-rose-50 via-orange-50/70 to-amber-50 rounded-3xl shadow-xs p-4 sm:p-5 flex flex-col justify-between min-h-[176px] border border-rose-200/80 hover:border-rose-400 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold font-mono text-rose-900 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" /> {streakDays}D STREAK
              </span>
              <div className="inline-flex items-center gap-1 bg-rose-200/60 text-rose-950 rounded-full px-2 py-0.5 text-[10.5px] font-bold border border-rose-300/60">
                <TrendingUp className="w-3 h-3 text-rose-700" />
                <span>+AC</span>
              </div>
            </div>

            {/* Mini Heatmap Matrix with Sunset / Coral Tones */}
            <div className="grid grid-cols-7 gap-1 my-1">
              {heatmapDots.map((lvl, idx) => (
                <span
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-xs ${
                    lvl === 4
                      ? "bg-rose-600"
                      : lvl === 3
                      ? "bg-orange-500"
                      : lvl === 2
                      ? "bg-amber-400"
                      : lvl === 1
                      ? "bg-rose-200"
                      : "bg-white/80"
                  }`}
                  title={`Hoạt động ngày ${idx + 1}`}
                />
              ))}
            </div>

            <div>
              <span className="text-2xl font-black text-rose-950 tracking-tight leading-none block font-mono">
                {leetcodeSolved} <span className="text-rose-600 text-lg font-bold">AC</span>
              </span>
              <p className="text-[11px] text-rose-800/80 font-medium truncate">
                {leetcodeUsername ? `@${leetcodeUsername} • LeetCode` : "LeetCode Problems Solved"}
              </p>
            </div>
          </div>

          {/* TILE 5: Featured Projects Card (2-wide - Pristine White with Sapphire Accents) */}
          <div
            onClick={() => projectsList.length > 0 ? setSelectedDrawer("projects") : undefined}
            className="tile md:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4 min-h-[176px] transition-all duration-200 hover:border-[#0066CC]/50 hover:shadow-md group cursor-pointer"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-[#0066CC] group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold text-slate-500 block font-mono">
                  DỰ ÁN TIÊU BIỂU • {projectsList.length} DỰ ÁN
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate group-hover:text-[#0066CC] transition-colors">
                  {projectsList[0]?.title || "Khám Phá Các Dự Án Mở CLB"}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {projectsList.length > 0 ? (
                    projectsList[0]?.tech?.slice(0, 3).map((t: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      Open Source Ecosystem
                    </span>
                  )}
                  <Link href="/projects" className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0066CC] text-[10.5px] font-bold border border-blue-200">
                    Khám phá →
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#0066CC] group-hover:text-white transition-all duration-200 shadow-xs">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* TILE 6: Map Tile (1x1 - Soft Mint / Teal Glass) */}
          <div className="tile md:col-span-1 bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-cyan-50/40 rounded-3xl shadow-xs relative overflow-hidden border border-teal-200/70 min-h-[176px] p-4 flex flex-col justify-between transition-all duration-200 hover:border-teal-400">
            {/* Stylized Mint SVG Grid */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              viewBox="0 0 200 200"
              preserveAspectRatio="xMidYMid slice"
            >
              <line x1="0" y1="40" x2="200" y2="70" stroke="#0f9d8f" strokeWidth="6" />
              <line x1="30" y1="0" x2="160" y2="200" stroke="#0f9d8f" strokeWidth="8" />
              <line x1="0" y1="160" x2="200" y2="130" stroke="#0f9d8f" strokeWidth="5" />
              <line x1="120" y1="0" x2="50" y2="200" stroke="#0f9d8f" strokeWidth="4" />
            </svg>

            {/* Location Pin */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <div className="relative flex items-center justify-center">
                <span className="w-7 h-7 rounded-full bg-teal-500/25 animate-ping absolute" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#0f9d8f] ring-3 ring-white shadow-md relative z-10" />
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="h-7 px-2.5 rounded-full bg-white/95 border border-teal-200 text-[11px] font-bold text-teal-950 flex items-center gap-1 shadow-xs truncate max-w-[140px]">
                <MapPin className="w-3 h-3 text-[#0f9d8f] shrink-0" />
                <span className="truncate">{userLocation}</span>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 shrink-0">
                {currentTime}
              </span>
            </div>
          </div>

          {/* TILE 7: Tech Hub / Blog Tile (1x1 - Honey Amber Glass) */}
          <div
            onClick={() => articlesList.length > 0 ? setSelectedDrawer("articles") : (window.location.href = "/blog")}
            className="tile md:col-span-1 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 text-slate-900 rounded-3xl shadow-xs p-4 sm:p-5 flex flex-col justify-between min-h-[176px] transition-all duration-200 border border-amber-200/80 hover:border-amber-400 cursor-pointer group"
          >
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold font-mono">
                THE TECH HUB
              </span>
              <BookOpen className="w-4 h-4 group-hover:rotate-12 transition-transform text-amber-600" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-amber-950 leading-snug">
                Bài viết &amp; nghiên cứu công nghệ
              </h3>
              <p className="text-xs text-amber-800 font-semibold mt-1 flex items-center gap-1">
                <span>{articlesList.length} Bài Viết</span> • <span className="text-amber-900 font-bold">Xem ngay →</span>
              </p>
            </div>
          </div>

          {/* TILE 8: Toolbox Tile (2-wide - Multi-colored Tech Chips) */}
          <div className="tile md:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-center min-h-[176px] transition-all duration-200 hover:border-[#0066CC]/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold text-slate-500 font-mono">
                TOOLBOX &amp; TECH STACK
              </span>
              <span className="text-[10px] font-mono font-bold text-[#0066CC] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {skillsList.length} KỸ NĂNG
              </span>
            </div>
            {skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill: string, sIdx: number) => {
                  const colorVariants = [
                    { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: "text-[#0066CC]" },
                    { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800", icon: "text-indigo-600" },
                    { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800", icon: "text-cyan-600" },
                    { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", icon: "text-emerald-600" },
                    { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800", icon: "text-sky-600" },
                    { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", icon: "text-purple-600" },
                    { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon: "text-amber-600" },
                  ];
                  const c = colorVariants[sIdx % colorVariants.length];
                  return (
                    <span
                      key={sIdx}
                      className={`px-3 py-1.5 rounded-xl ${c.bg} border ${c.border} text-xs font-semibold ${c.text} flex items-center gap-1.5 shadow-xs`}
                    >
                      <Cpu className={`w-3 h-3 ${c.icon}`} /> {skill}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                Thành viên chưa cập nhật danh sách kỹ năng chuyên môn.
              </div>
            )}
          </div>

          {/* TILE 9: Email-CTA Tile (2-wide - Royal DEVER Blue Gradient) */}
          <div className="tile md:col-span-2 bg-gradient-to-r from-[#002D66] via-[#004C99] to-[#0066CC] text-white rounded-3xl shadow-md p-6 flex items-center justify-between gap-4 relative overflow-hidden min-h-[176px] transition-all duration-200 hover:shadow-xl border border-blue-400/30">
            {/* Ambient Cyan & Gold Light Spotlights */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-1 max-w-sm">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Let&apos;s make something
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Sẵn sàng hợp tác nghiên cứu dự án và chia sẻ chuyên môn công nghệ.
              </p>
            </div>

            <a
              href={`mailto:${email}`}
              className="relative z-10 h-11 px-5 rounded-xl bg-white hover:bg-blue-50 text-[#004C99] text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Say hello</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3. Small Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-200 gap-2">
          <span>&copy; 2026 {fullName} • CLB Lập Trình FU-DEVER</span>
          <span>Thành viên Ban Chuyên Môn FU-DEVER</span>
        </footer>
      </div>

      {/* 4. Slide-over Drawer / Modal for Projects & Articles */}
      {selectedDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                {selectedDrawer === "projects" ? (
                  <>
                    <FolderGit2 className="w-5 h-5 text-[#0066CC]" />
                    <h2 className="text-lg font-bold text-slate-900">Dự Án Đã Đóng Góp</h2>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-slate-900">Bài Viết &amp; Nghiên Cứu Đã Xuất Bản</h2>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedDrawer(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedDrawer === "projects" ? (
              projectsList.length > 0 ? (
                <div className="space-y-4">
                  {projectsList.map((proj: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-[#0066CC]/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {proj.title}
                        </h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0066CC] hover:underline"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {proj.role && <p className="text-xs text-[#004C99] font-semibold">{proj.role}</p>}
                      {proj.description && <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>}
                      {Array.isArray(proj.tech) && proj.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.tech.map((t: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono font-semibold text-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 font-medium">
                  Thành viên chưa thêm dự án công khai nào.
                </div>
              )
            ) : (
              articlesList.length > 0 ? (
                <div className="space-y-4">
                  {articlesList.map((art: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-amber-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-bold">
                          {art.category || "Kỹ thuật"}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">{art.date}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {art.title}
                      </h3>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500 font-medium">{art.readTime || "5 phút đọc"}</span>
                        <Link
                          href={art.link || "/blog"}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
                        >
                          <span>Đọc trên DEVER Blog</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 font-medium">
                  Thành viên chưa xuất bản bài viết nào trên DEVER Blog.
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* 5. Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm border ${selectedBadge.bgColor}`}>
              {renderBadgeIcon(selectedBadge.iconName, `w-7 h-7 ${selectedBadge.iconColor}`)}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                {selectedBadge.name}
              </h3>
              <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold border ${selectedBadge.bgColor}`}>
                {selectedBadge.badgeLabel}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {selectedBadge.desc}
            </p>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold transition-all shadow-md active:scale-98"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
