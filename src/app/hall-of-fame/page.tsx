import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Zap,
  Award,
  Crown,
  Sparkles,
  Medal,
  ChevronRight,
  Shield,
  Star,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bảng Vàng Danh Dự | FU-DEVER Hall of Fame",
  description:
    "Vinh danh các chiến binh lập trình, tác giả công nghệ và thủ lĩnh xuất sắc nhất của Câu lạc bộ FU-DEVER.",
};

interface LeaderMember {
  _id: string;
  name: string;
  avatar: string;
  exp: number;
  level: number;
  title: string;
  streakDays: number;
  badgeCount: number;
  position: string;
  department: string;
}

const BADGE_DEFINITIONS = [
  {
    id: "algorithmic_prodigy",
    title: "Algorithmic Prodigy",
    icon: "🏆",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    desc: "Vinh danh thành viên đạt thành tích xuất sắc trên Bảng xếp hạng LeetCode.",
  },
  {
    id: "pro_tech_author",
    title: "Pro Tech Author",
    icon: "✍️",
    color: "#8B5CF6",
    bgColor: "#EDE9FE",
    desc: "Tác giả kỹ thuật tiêu biểu chia sẻ kiến thức chuyên môn cho cộng đồng DEVER.",
  },
  {
    id: "speed_coder",
    title: "Speed Coder",
    icon: "⚡",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    desc: "Chiến binh chăm chỉ duy trì chuỗi hoạt động điểm danh liên tục 7 ngày.",
  },
  {
    id: "core_contributor",
    title: "Core Contributor",
    icon: "🌟",
    color: "#0066CC",
    bgColor: "#EFF6FF",
    desc: "Đóng góp dự án mã nguồn mở và sáng kiến kỹ thuật trong hệ sinh thái FU-DEVER.",
  },
  {
    id: "security_sentinel",
    title: "Security Sentinel",
    icon: "🛡️",
    color: "#10B981",
    bgColor: "#D1FAE5",
    desc: "Thành viên gương mẫu hoàn thiện 100% hồ sơ bảo mật và thông tin cá nhân.",
  },
];

export const dynamic = "force-dynamic";

async function fetchHallOfFame(): Promise<{
  podium: { first: LeaderMember | null; second: LeaderMember | null; third: LeaderMember | null };
  data: LeaderMember[];
}> {
  const apiServer = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
  const fallbackApi = "https://dever-backend-production.up.railway.app";

  for (const url of [apiServer, fallbackApi]) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${url}/api/v1/gamification/hall-of-fame`, {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const payload = await res.json();
        if (payload?.data && payload.data.length > 0) {
          return {
            podium: payload.podium || {
              first: payload.data[0] || null,
              second: payload.data[1] || null,
              third: payload.data[2] || null,
            },
            data: payload.data,
          };
        }
      }
    } catch {}
  }

  // Fallback data
  const fallbackLeaders: LeaderMember[] = [
    {
      _id: "1",
      name: "Lê Đức Anh Phương",
      avatar: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg",
      exp: 1450,
      level: 4,
      title: "Code Pathfinder",
      streakDays: 28,
      badgeCount: 5,
      position: "Chủ Nhiệm",
      department: "Ban Chuyên Môn",
    },
    {
      _id: "2",
      name: "Trần Văn Bảo Thắng",
      avatar: "https://lh3.googleusercontent.com/d/1",
      exp: 1120,
      level: 3,
      title: "Code Pathfinder",
      streakDays: 19,
      badgeCount: 4,
      position: "Phó Chủ Nhiệm",
      department: "Ban Kỹ Thuật",
    },
    {
      _id: "3",
      name: "Nguyễn Nhật Quang",
      avatar: "https://lh3.googleusercontent.com/d/2",
      exp: 980,
      level: 3,
      title: "Code Pathfinder",
      streakDays: 14,
      badgeCount: 3,
      position: "Trưởng Ban Kỹ Thuật",
      department: "Ban Kỹ Thuật",
    },
  ];

  return {
    podium: { first: fallbackLeaders[0], second: fallbackLeaders[1], third: fallbackLeaders[2] },
    data: fallbackLeaders,
  };
}

export default async function HallOfFamePage() {
  const { podium, data: leaders } = await fetchHallOfFame();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F4F9FF] via-white to-[#F0F7FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>ĐẤU TRƯỜNG & DANH VỌNG DEVER</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Bảng Vàng <span className="text-[#0066CC]">Hall of Fame</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Vinh danh những thành viên xuất sắc nhất của Câu lạc bộ FU-DEVER qua chuỗi ngày rèn luyện
              thuật toán, đóng góp dự án mã nguồn mở và chia sẻ tri thức công nghệ.
            </p>
          </div>

          {/* 3D Podium for Top 3 */}
          {podium.first && (
            <div className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
              {/* Rank 2 (Silver) */}
              {podium.second && (
                <div className="order-2 md:order-1 flex flex-col items-center">
                  <div className="relative mb-3 flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={podium.second.avatar || "/icons/layout/logo.png"}
                        alt={podium.second.name}
                        className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-300 shadow-lg"
                      />
                      <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-black shadow ring-2 ring-white">
                        2
                      </span>
                    </div>
                    <h3 className="mt-3 font-bold text-slate-900 text-base text-center">
                      {podium.second.name}
                    </h3>
                    <span className="text-xs text-slate-500">{podium.second.title}</span>
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#0066CC]">
                      <Zap className="h-3.5 w-3.5" /> {podium.second.exp} EXP
                    </div>
                  </div>
                  <div className="h-40 w-full rounded-t-3xl border border-slate-300/80 bg-gradient-to-b from-slate-100 to-slate-200/50 p-4 text-center shadow-md flex flex-col justify-center items-center">
                    <Medal className="h-8 w-8 text-slate-400 mb-1" />
                    <span className="text-sm font-extrabold text-slate-700">Á QUÂN</span>
                    <span className="text-xs text-slate-500">Level {podium.second.level}</span>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold - Elevated) */}
              <div className="order-1 md:order-2 flex flex-col items-center">
                <div className="relative mb-4 flex flex-col items-center">
                  <Crown className="h-10 w-10 text-amber-500 mb-1 animate-pulse drop-shadow-sm" />
                  <div className="relative">
                    <img
                      src={podium.first.avatar || "/icons/layout/logo.png"}
                      alt={podium.first.name}
                      className="h-24 w-24 rounded-full object-cover ring-4 ring-amber-400 shadow-2xl"
                    />
                    <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white font-black shadow-lg ring-2 ring-white text-lg">
                      1
                    </span>
                  </div>
                  <h3 className="mt-3 font-extrabold text-slate-900 text-lg text-center">
                    {podium.first.name}
                  </h3>
                  <span className="text-xs font-semibold text-amber-600">{podium.first.title}</span>
                  <div className="mt-1 flex items-center gap-1 text-sm font-black text-amber-600 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
                    <Zap className="h-4 w-4 fill-amber-500 text-amber-500" /> {podium.first.exp} EXP
                  </div>
                </div>
                <div className="h-52 w-full rounded-t-3xl border border-amber-400/80 bg-gradient-to-b from-amber-100 via-amber-50 to-white p-4 text-center shadow-xl flex flex-col justify-center items-center">
                  <Trophy className="h-10 w-10 text-amber-500 mb-1" />
                  <span className="text-base font-black text-amber-700">QUÁN QUÂN</span>
                  <span className="text-xs font-semibold text-amber-600">Level {podium.first.level}</span>
                  <span className="text-[11px] text-slate-500 mt-1">🔥 {podium.first.streakDays} ngày liên tiếp</span>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              {podium.third && (
                <div className="order-3 flex flex-col items-center">
                  <div className="relative mb-3 flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={podium.third.avatar || "/icons/layout/logo.png"}
                        alt={podium.third.name}
                        className="h-20 w-20 rounded-full object-cover ring-4 ring-amber-700/40 shadow-lg"
                      />
                      <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-800 text-white font-black shadow ring-2 ring-white">
                        3
                      </span>
                    </div>
                    <h3 className="mt-3 font-bold text-slate-900 text-base text-center">
                      {podium.third.name}
                    </h3>
                    <span className="text-xs text-slate-500">{podium.third.title}</span>
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#0066CC]">
                      <Zap className="h-3.5 w-3.5" /> {podium.third.exp} EXP
                    </div>
                  </div>
                  <div className="h-32 w-full rounded-t-3xl border border-amber-700/40 bg-gradient-to-b from-amber-50 to-orange-100/50 p-4 text-center shadow-md flex flex-col justify-center items-center">
                    <Shield className="h-7 w-7 text-amber-800 mb-1" />
                    <span className="text-sm font-extrabold text-amber-900">QUÝ QUÂN</span>
                    <span className="text-xs text-slate-500">Level {podium.third.level}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Top 10 Leaderboard Table */}
        <div className="mb-20 rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-[#0066CC]" /> Bảng Xếp Hạng Điểm Danh Vọng
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Tích lũy EXP qua giải bài LeetCode, xuất bản bài viết kỹ thuật và đóng góp dự án CLB.
              </p>
            </div>
            <Link
              href={`${process.env.NEXT_PUBLIC_CLIENT_URL || "https://client.fudever.com"}/vi/dashboard`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#004C99] transition-all active:scale-[0.98]"
            >
              Tham gia đấu trường <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <th className="pb-3 px-3">Hạng</th>
                  <th className="pb-3 px-3">Thành viên</th>
                  <th className="pb-3 px-3">Danh xưng</th>
                  <th className="pb-3 px-3">Level & EXP</th>
                  <th className="pb-3 px-3">Streak</th>
                  <th className="pb-3 px-3">Huy hiệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm whitespace-nowrap">
                {leaders.map((member, idx) => (
                  <tr
                    key={member._id || idx}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs ${
                          idx === 0
                            ? "bg-amber-100 text-amber-700"
                            : idx === 1
                            ? "bg-slate-200 text-slate-700"
                            : idx === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || "/icons/layout/logo.png"}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-[#0066CC] transition-colors">
                            {member.name}
                          </p>
                          <span className="text-xs text-slate-400">
                            {member.position} • {member.department}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {member.title}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div>
                        <span className="font-bold text-slate-900">Level {member.level}</span>
                        <p className="text-xs text-[#0066CC] font-semibold">{member.exp} EXP</p>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                        <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                        {member.streakDays} ngày
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                        <Award className="h-3.5 w-3.5 text-purple-600" />
                        {member.badgeCount} huy hiệu
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3D Achievement Badges System */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Hệ Thống Huy Hiệu Kỹ Thuật
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Bộ sưu tập huy hiệu danh giá được trao tặng tự động cho thành viên hoàn thành xuất sắc
              các thử thách học thuật trong hệ sinh thái FU-DEVER.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {BADGE_DEFINITIONS.map((badge) => (
              <div
                key={badge.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      style={{ backgroundColor: badge.bgColor }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300"
                    >
                      {badge.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{badge.title}</h3>
                      <span
                        style={{ color: badge.color }}
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        Huy Hiệu Vinh Dự
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{badge.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Mở khóa tự động</span>
                  <span className="font-semibold text-[#0066CC] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Thử thách <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
