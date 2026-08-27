"use client";

import React, { useState, useEffect } from "react";
import { Clock3, Flame, Heart, Search, SearchX } from "lucide-react";
import Link from "next/link";
import DeverBlogPreview from "@components/ui/DeverBlogPreview";
import DeverCircuitBackground from "@components/ui/DeverCircuitBackground";

interface BlogPost {
  _id?: string;
  id?: number;
  slug: string;
  title: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date?: string;
  createdAt?: string;
  readTime: string;
  excerpt: string;
  likes: number;
  featured?: boolean;
  coverImage: string;
}

const DEFAULT_BLOG_COVER = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";

const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: 1,
    slug: "lam-chu-nextjs-14-app-router",
    title: "Làm Chủ Next.js 14 App Router & Tối Ưu Hóa Server Components",
    category: "Web & Frontend",
    author: {
      name: "Lê Đức Anh Phương",
      role: "Lead Developer",
      avatar: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg",
    },
    date: "05/08/2026",
    readTime: "6 phút đọc",
    excerpt:
      "Tổng hợp kinh nghiệm thực chiến kiến trúc Next.js 14 App Router, cách quản lý State mượt mà và khắc phục triệt để lỗi HMR useContext trong dự án lớn.",
    likes: 142,
    featured: true,
    coverImage: "/images/dever_blog_hero.png",
  },
  {
    id: 2,
    slug: "kinh-nghiem-sanh-vai-icpc-2026",
    title: "Bí Kíp Đua TOP LeetCode & Kinh Nghiệm Thi Đấu Giải ICPC 2026",
    category: "Lập Trình Giải Thuật",
    author: {
      name: "Trần Văn Bảo Thắng",
      role: "Algorithm Lead",
      avatar: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg",
    },
    date: "01/08/2026",
    readTime: "8 phút đọc",
    excerpt:
      "Chiến thuật phân chia bài tập, tối ưu thuật toán Quy hoạch động (DP) và cấu trúc dữ liệu Nâng cao giúp nhóm FU-DEVER đạt giải cao.",
    likes: 98,
    coverImage: "/images/dever_roadmap_banner.png",
  },
];

const CATEGORIES = [
  "Tất cả",
  "Web & Frontend",
  "Backend & System",
  "Lập Trình Giải Thuật",
  "AI / Machine Learning",
  "Kinh Nghiệm CLB",
];

const API_SERVER =
  process.env.NEXT_PUBLIC_API_SERVER ||
  "http://localhost:5000";

function AuthorBadge({ author, size = "regular" }: { author?: BlogPost["author"]; size?: "regular" | "large" }) {
  const name = author?.name || "DEVER Member";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "D";
  const avatarSize = size === "large" ? "h-11 w-11 text-xs" : "h-8 w-8 text-[10px]";
  const [imgError, setImgError] = useState(false);

  const avatarUrl = author?.avatar;
  const showImage = Boolean(avatarUrl && !imgError);

  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative shrink-0 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#0066CC] to-cyan-500 shadow-md shadow-blue-900/15 ${avatarSize}`}>
        {showImage ? (
          <img
            src={avatarUrl}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="grid w-full h-full place-items-center font-black text-white">
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="truncate font-extrabold text-sm text-gray-900">{name}</h4>
        <p className="truncate text-xs font-medium text-gray-600">{author?.role || "DEVER Member"}</p>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [loadError, setLoadError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_SERVER}/api/v1/blogs`);
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setBlogs(json.data);
        }
      } catch (err) {
        // use fallback blogs cleanly
      }
    }
    fetchBlogs();
  }, []);

  const filteredPosts = blogs.filter((post) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = async (post: BlogPost, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postId = post._id || post.id?.toString() || "";
    const isLiked = likedPosts[postId];

    // Optimistic UI update
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setBlogs((prev) =>
      prev.map((b) =>
        (b._id === postId || b.id?.toString() === postId)
          ? { ...b, likes: isLiked ? b.likes - 1 : b.likes + 1 }
          : b
      )
    );

    if (post._id) {
      try {
        await fetch(`${API_SERVER}/api/v1/blogs/${post._id}/like`, { method: "PUT" });
      } catch (err) {
        console.error("Error liking blog:", err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FCFF] pb-20 pt-20">
      {/* Full-Page Cyber Circuit Background */}
      <DeverCircuitBackground className="pb-10">
        {/* Header Title & Intro */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-blue-200 pb-8 gap-4">
            <div>
              <span className="inline-block bg-[#0055B8]/10 text-[#0055B8] text-xs font-extrabold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 border border-[#0055B8]/20">
                DEVER TECH BLOG &amp; INSIGHTS
              </span>
              <h1 className="text-3xl lg:text-5xl font-black text-gray-950 tracking-tight">
                Góc Kiến Thức &amp; Chia Sẻ Công Nghệ
              </h1>
              <p className="text-gray-700 text-base mt-2 max-w-2xl font-medium">
                Nơi lưu trữ bài viết chuyên sâu, kinh nghiệm thi đấu và lộ trình thực chiến từ Ban Chuyên Môn &amp; Cựu thành viên FU-DEVER.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                aria-label="Tìm kiếm bài viết"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#0066CC] shadow-sm text-gray-900 placeholder-gray-500 font-medium"
              />
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0066CC]" />
            </div>
          </div>
        </section>

        {/* 1. Interactive GlowingEdgeCard Blog Spotlight Section */}
        {selectedCategory === "Tất cả" && !searchQuery && (
          <DeverBlogPreview />
        )}

      {/* Category Filter Pills */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-10">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-sm ${
                selectedCategory === cat
                  ? "bg-[#0066CC] text-white shadow-blue-600/30 scale-105"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-[#0066CC] hover:text-[#0066CC]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => {
            const pId = post._id || post.id || idx;
            const slugTarget = post.slug || post._id || String(post.id);
            return (
              <article
                key={pId}
                className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  <Link href={`/blog/${encodeURIComponent(slugTarget)}`} className="block relative h-48 w-full overflow-hidden cursor-pointer bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage || DEFAULT_BLOG_COVER}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_BLOG_COVER;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#004C99] font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md border border-blue-100">
                      {post.category}
                    </span>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <Link
                      href={`/blog/${encodeURIComponent(slugTarget)}`}
                      className="block text-lg font-extrabold text-gray-950 mb-3 leading-snug group-hover:text-[#0066CC] transition-colors line-clamp-2"
                    >
                      {post.title}
                    </Link>
                    <p className="text-gray-700 text-xs leading-relaxed mb-4 line-clamp-3 font-medium">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Author & Footer */}
                <div className="flex flex-col items-start gap-3 border-t border-gray-200 px-6 pb-6 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <AuthorBadge author={post.author} />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-gray-600 font-semibold"><Clock3 className="h-3.5 w-3.5" />{post.readTime || "5 phút"}</span>
                    <button
                      type="button"
                      onClick={(e) => handleLike(post, e)}
                      aria-pressed={Boolean(likedPosts[post._id || post.id || ""])}
                      aria-label={`Yêu thích ${post.title}`}
                      className={`text-xs font-extrabold p-2 rounded-full transition-all ${
                        likedPosts[post._id || post.id || ""]
                          ? "bg-rose-100 text-rose-800"
                          : "text-gray-600 hover:text-rose-800 hover:bg-rose-100"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${likedPosts[post._id || post.id || ""] ? "fill-current" : ""}`} /> {post.likes}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200">
            <SearchX className="mx-auto mb-4 h-10 w-10 text-[#0066CC]" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="text-xl font-extrabold text-gray-900">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-gray-600 text-sm mt-1 font-medium">Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.</p>
          </div>
        )}
      </section>
      </DeverCircuitBackground>
    </main>
  );
}
