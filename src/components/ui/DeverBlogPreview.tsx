"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Heart,
  TrendingUp,
} from "lucide-react";
import { GlowingEdgeCard } from "./GlowingEdgeCard";

export interface BlogPostItem {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  categoryColor: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  likes: number;
}

const FEATURED_ARTICLES: BlogPostItem[] = [
  {
    id: "nextjs-14-architecture",
    slug: "lam-chu-nextjs-14-app-router",
    title: "Làm Chủ Next.js 14 App Router & Tối Ưu Hóa Caching 4 Tầng",
    category: "Architecture & Web",
    categoryColor: "bg-blue-50 text-[#0066CC] border-blue-200",
    author: {
      name: "Lê Đức Anh Phương",
      role: "Lead Fullstack • Ban Chuyên Môn",
      avatar: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg",
    },
    date: "15 Tháng 8, 2026",
    readTime: "6 phút đọc",
    excerpt:
      "Phân tích chuyên sâu kiến trúc Server Components, tối ưu hóa Data Cache & Full Route Cache, triệt tiêu triệt để tình trạng HMR Context và rò rỉ bộ nhớ trong dự án quy mô lớn.",
    tags: ["Next.js 14", "TypeScript", "Performance", "Caching"],
    likes: 142,
  },
  {
    id: "icpc-dynamic-programming",
    slug: "kinh-nghiem-sanh-vai-icpc-2026",
    title: "Bí Kíp Đua Top LeetCode & Chiến Thuật Quy Hoạch Động ICPC 2026",
    category: "Algorithms & ICPC",
    categoryColor: "bg-amber-50 text-amber-800 border-amber-200",
    author: {
      name: "Trần Văn Bảo Thắng",
      role: "Algorithm Lead • Đội Tuyển ICPC",
      avatar: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg",
    },
    date: "02 Tháng 8, 2026",
    readTime: "8 phút đọc",
    excerpt:
      "Tổng hợp các dạng bài toán quy hoạch động trạng thái (Bitmask DP), tối ưu hóa cây phân đoạn Segment Tree và kinh nghiệm phân bổ thời gian thực chiến trong đấu trường giải thuật.",
    tags: ["Algorithms", "LeetCode", "Dynamic Programming", "C++"],
    likes: 118,
  },
];

export default function DeverBlogPreview() {
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const toggleLike = (id: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto space-y-6">
        {/* Header with Title & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-blue-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0066CC] text-xs font-bold border border-blue-200 mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0080FF]" />
              <span>BÀI VIẾT NỔI BẬT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Bài Viết Kỹ Thuật Tiêu Biểu
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl font-medium">
              Những bài viết chuyên sâu và chia sẻ kinh nghiệm thực chiến từ các lập trình viên FU-DEVER.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#0066CC] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto">
            <TrendingUp className="w-4 h-4" />
            <span>2 Bài Viết Tiêu Biểu</span>
          </div>
        </div>

        {/* Featured Glowing Edge Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {FEATURED_ARTICLES.map((article) => {
            const isLiked = likedPosts[article.id];
            const currentLikes = article.likes + (isLiked ? 1 : 0);

            return (
              <GlowingEdgeCard
                key={article.id}
                className="min-h-[440px] shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex flex-col justify-between h-full p-6 sm:p-8">
                  {/* Top Bar: Category & Read Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${article.categoryColor}`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{article.category}</span>
                    </span>

                    <div className="flex items-center gap-1 text-xs font-mono text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#0066CC]" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Article Title & Excerpt */}
                  <div className="my-5 space-y-3">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block text-xl sm:text-2xl font-black text-slate-900 leading-snug hover:text-[#0066CC] transition-colors group/link"
                    >
                      <span>{article.title}</span>
                      <ArrowUpRight className="inline-block w-5 h-5 ml-1 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all text-[#0066CC]" />
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {article.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-slate-700 hover:border-[#0066CC] hover:text-[#0066CC] transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row: Author & Action Buttons */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    {/* Author */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0066CC] to-cyan-400 p-0.5 shrink-0 shadow-xs">
                        <div className="w-full h-full rounded-full bg-white text-[#0066CC] font-bold text-xs flex items-center justify-center font-mono border border-blue-100 overflow-hidden">
                          {article.author.avatar ? (
                            <img
                              src={article.author.avatar}
                              alt={article.author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            article.author.name[0]
                          )}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {article.author.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {article.date}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => toggleLike(article.id, e)}
                        className={`h-9 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
                          isLiked
                            ? "bg-rose-50 border-rose-300 text-rose-600 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-600" : ""}`} />
                        <span>{currentLikes}</span>
                      </button>

                      <Link
                        href={`/blog/${article.slug}`}
                        className="h-9 px-4 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 shrink-0"
                      >
                        <span>Đọc ngay</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </GlowingEdgeCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
