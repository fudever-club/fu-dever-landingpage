"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  GraduationCap,
  MessageSquareQuote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/src/lib/api";

interface Mentor {
  _id: string;
  name: string;
  headline?: string;
  bio?: string;
  quote?: string;
  workplace?: string;
  avatar?: string;
  graduationGen?: string;
  mentoringTopics?: string[];
}

const CLIENT_SIGN_IN_URL = `${
  process.env.NEXT_PUBLIC_CLIENT_URL || "https://client.fudever.com"
}/sign-in`;

function MentorCard({ mentor }: { mentor: Mentor }) {
  const initial = (mentor.name || "D").trim().charAt(0).toUpperCase();
  return (
    <article className="group flex flex-col justify-between rounded-3xl border border-blue-100/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0066CC] hover:shadow-xl">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {mentor.avatar ? (
              <Image
                src={mentor.avatar}
                alt={mentor.name}
                width={64}
                height={64}
                sizes="64px"
                loading="lazy"
                className="h-16 w-16 rounded-2xl border-2 border-blue-100 object-cover shadow-sm"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066CC] to-[#004C99] text-xl font-bold text-white shadow-sm"
              >
                {initial}
              </div>
            )}
            {mentor.graduationGen && (
              <span className="absolute -bottom-1.5 -right-1.5 rounded-md bg-[#0066CC] px-2 py-0.5 text-xs font-black text-white shadow">
                {mentor.graduationGen}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-extrabold text-slate-900 transition-colors group-hover:text-[#0066CC]">
              {mentor.name}
            </h3>
            {mentor.headline && (
              <p className="truncate text-xs font-semibold text-slate-600">
                {mentor.headline}
              </p>
            )}
            {mentor.workplace && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#0066CC]">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                {mentor.workplace}
              </span>
            )}
          </div>
        </div>

        {mentor.quote && (
          <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
            <MessageSquareQuote
              className="absolute right-2 top-2 h-4 w-4 text-[#0066CC]/40"
              aria-hidden="true"
            />
            <p className="pr-4 text-xs font-medium italic leading-relaxed text-slate-600">
              &quot;{mentor.quote}&quot;
            </p>
          </div>
        )}

        {mentor.mentoringTopics && mentor.mentoringTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {mentor.mentoringTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
        Kết nối qua Cổng Thành Viên (dành cho thành viên CLB)
      </p>
    </article>
  );
}

function MentorSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          aria-hidden="true"
          className="animate-pulse motion-reduce:animate-none space-y-4 rounded-3xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
          <div className="h-16 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default function MentorSection() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchMentors = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await apiFetch(`/api/v1/mentorship/mentors`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const serverData: Mentor[] = Array.isArray(json)
          ? json
          : json?.data || [];
        setMentors(serverData);
      } else {
        setMentors([]);
        setIsError(true);
      }
    } catch (err) {
      console.warn("Mentorship API unavailable:", err);
      setMentors([]);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  return (
    <section
      aria-labelledby="mentor-showcase-heading"
      className="mx-auto mt-16 max-w-[1440px] px-5 lg:px-20"
    >
      <div className="overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-br from-[#002D66] via-[#004C99] to-[#0066CC] p-8 text-white shadow-2xl lg:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Cố vấn &amp; Mentor FU-DEVER
            </span>
          </div>
          <h2
            id="mentor-showcase-heading"
            className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl"
          >
            Học trực tiếp từ anh chị đi trước
          </h2>
          <p className="text-sm font-medium leading-relaxed text-white lg:text-base">
            Đội ngũ cố vấn là các cựu thành viên đang làm việc trong ngành công
            nghệ, đồng hành cùng thành viên CLB qua định hướng nghề nghiệp,
            review CV và mentoring chuyên môn theo chủ đề.
          </p>
          <a
            href={CLIENT_SIGN_IN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 min-h-[44px] py-2.5 text-xs font-extrabold text-[#004C99] shadow-md transition-all hover:bg-blue-50 active:scale-[0.98]"
          >
            <span>Tham gia CLB để kết nối</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <p className="text-xs font-bold text-white">
            CLB duy trì hình thức invite-only: kết nối mentor dành cho thành
            viên đã được xác thực trên Cổng Thành Viên.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {isLoading && <MentorSkeleton />}

        {!isLoading && isError && (
          <div className="mx-auto my-8 max-w-lg space-y-4 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-red-700">
              Không thể tải danh sách mentor
            </h3>
            <button
              type="button"
              onClick={fetchMentors}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-5 min-h-[44px] py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-[#004C99]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> Thử Lại
            </button>
          </div>
        )}

        {!isLoading && !isError && mentors.length === 0 && (
          <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/50 p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-200/80 bg-blue-50 text-[#0066CC] shadow-inner">
              <GraduationCap className="h-10 w-10" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-bold text-[#0066CC]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Dữ Liệu Đang Được Cập Nhật</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                Danh sách Mentor đang được xác thực
              </h3>
              <p className="mx-auto max-w-md text-sm font-medium leading-relaxed text-slate-600">
                Ban Chủ Nhiệm đang tổng hợp và xác thực hồ sơ cố vấn từ mạng
                lưới cựu thành viên. Trong thời gian chờ, bạn có thể tham gia
                CLB để nhận thông báo ngay khi mentoring mở.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={CLIENT_SIGN_IN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-5 min-h-[44px] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#004C99] active:scale-[0.98]"
              >
                <span>Tham gia CLB để kết nối</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        {!isLoading && !isError && mentors.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard key={mentor._id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
