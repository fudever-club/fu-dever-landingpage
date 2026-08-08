"use client";

import React, { useState, useEffect } from "react";
import { Clock3, Heart, Search } from "lucide-react";
import Link from "next/link";
import DeverKnowledgeCanvas from "@components/ui/DeverKnowledgeCanvas";

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

const API_SERVER = "https://dever-backend-production.up.railway.app";

function AuthorBadge({ author, size = "regular" }: { author?: BlogPost["author"]; size?: "regular" | "large" }) {
  const name = author?.name || "DEVER Member";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const avatarSize = size === "large" ? "h-11 w-11 text-xs" : "h-8 w-8 text-[10px]";

  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid shrink-0 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-[#0066CC] to-cyan-500 font-black text-white shadow-md shadow-blue-900/20 ${avatarSize}`}>
        {initials || "D"}
      </span>
      <div className="min-w-0">
        <h4 className="truncate font-extrabold text-sm text-gray-900">{name}</h4>
        <p className="truncate text-xs font-medium text-gray-600">{author?.role || "DEVER Member"}</p>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_SERVER}/api/v1/blogs`);
        const json = await res.json();
        if (Array.isArray(json.data)) setBlogs(json.data);
      } catch (err) {
        setLoadError(true);
      }
    }
    fetchBlogs();
  }, []);

  const featuredPost = blogs.find((p) => p.featured) || blogs[0];

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
      {/* Header Title & Intro */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-blue-200 pb-8 gap-4">
          <div>
            <span className="inline-block bg-[#0055B8]/10 text-[#0055B8] text-xs font-extrabold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 border border-[#0055B8]/20">
              DEVER TECH BLOG & INSIGHTS
            </span>
            <h1 className="text-3xl lg:text-5xl font-black text-gray-950 tracking-tight">
              Góc Kiến Thức & Chia Sẻ Công Nghệ
            </h1>
            <p className="text-gray-700 text-base mt-2 max-w-2xl font-medium">
              Nơi lưu trữ bài viết chuyên sâu, kinh nghiệm thi đấu và lộ trình thực chiến từ Ban Chuyên Môn & Cựu thành viên FU-DEVER.
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

      {/* Featured Article Hero */}
      {selectedCategory === "Tất cả" && !searchQuery && featuredPost && (
        <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-14">
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-blue-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-blue-300 transition-all">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-300">
                  🔥 BÀI VIẾT NỔI BẬT 2026
                </span>
                <span className="bg-blue-100 text-[#004C99] font-extrabold text-xs px-3 py-1 rounded-full">
                  {featuredPost.category}
                </span>
              </div>

              <Link href={`/blog/${encodeURIComponent(featuredPost.slug)}`} className="block text-2xl lg:text-4xl font-extrabold text-gray-950 leading-snug hover:text-[#0066CC] transition-colors">
                {featuredPost.title}
              </Link>

              <p className="text-gray-700 text-sm lg:text-base leading-relaxed font-medium">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3">
                  <AuthorBadge author={featuredPost.author} size="large" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700 font-semibold">
                  <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {featuredPost.readTime || "5 phút đọc"}</span>
                  <button
                    type="button"
                    onClick={(e) => handleLike(featuredPost, e)}
                    aria-pressed={Boolean(likedPosts[featuredPost._id || featuredPost.id || ""])}
                    aria-label={`Yêu thích ${featuredPost.title}`}
                    className={`flex items-center gap-1 font-bold px-3 py-1.5 rounded-full border transition-all ${
                      likedPosts[featuredPost._id || featuredPost.id || ""]
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-rose-100 hover:text-rose-800"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${likedPosts[featuredPost._id || featuredPost.id || ""] ? "fill-current" : ""}`} /> {featuredPost.likes}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 overflow-hidden rounded-2xl border border-blue-200 shadow-lg lg:h-80">
              <DeverKnowledgeCanvas title={featuredPost.title} className="transition-transform duration-500 hover:scale-[1.02]" />
            </div>
          </div>
        </section>
      )}
      {loadError && <p role="status" className="mx-auto mt-10 max-w-2xl rounded-xl border border-blue-100 bg-white p-5 text-center text-sm text-[#0066CC]">Không thể tải bài viết lúc này. Vui lòng thử lại sau.</p>}
      {!loadError && blogs.length === 0 && <p role="status" className="mx-auto mt-10 max-w-2xl rounded-xl border border-blue-100 bg-white p-5 text-center text-sm text-[#0066CC]">Chưa có bài viết được xuất bản.</p>}

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
            return (
              <article
                key={pId}
                className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <DeverKnowledgeCanvas title={post.title} className="transition-transform duration-500 group-hover:scale-[1.025]" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#004C99] font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md border border-blue-100">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="block text-lg font-extrabold text-gray-950 mb-3 leading-snug group-hover:text-[#0066CC] transition-colors line-clamp-2">
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
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-extrabold text-gray-900">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-gray-600 text-sm mt-1 font-medium">Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.</p>
          </div>
        )}
      </section>
    </main>
  );
}
