"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock3, Heart, Search, SearchX } from "lucide-react";
import Link from "next/link";
import DeverBlogCover from "@components/ui/DeverBlogCover";
import DeverCircuitBackground from "@components/ui/DeverCircuitBackground";
import { apiFetch } from "@/src/lib/api";

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

function BlogCoverImage({ src, title }: { src?: string; title: string }) {
  const [imgError, setImgError] = useState(false);
  // TODO(club-photos): `coverImage` từ API (`/api/v1/blogs`) vẫn có thể là URL
  // stock/generic (Unsplash, picsum, placeholder). Những URL này bị ép fallback
  // về `DeverBlogCover` thủ công tại đây — cần thay bằng ảnh CLB thật ở nguồn
  // (Admin CMS) rồi mới gỡ `isGenericStockUrl`.
  if (!src || isGenericStockUrl(src) || imgError) {
    return <DeverBlogCover title={title} className="h-full min-h-[96px]" />;
  }
  return (
    <Image
      src={src}
      alt={title}
      width={800}
      height={450}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      onError={() => setImgError(true)}
      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}

// Ảnh thật > SVG/CSS thủ công (`DeverBlogCover`) > gradient CSS.
// Ép mọi URL stock/generic (Unsplash, picsum, placeholder, loremflickr)
// về fallback để trang blog không bao giờ phụ thuộc ảnh generic ngoài.
function isGenericStockUrl(src: string): boolean {
  return /unsplash\.com|images\.unsplash|picsum\.photos|placehold\.|via\.placeholder|loremflickr\.com/i.test(src);
}

function formatPostDate(post: BlogPost): string {
  const raw = post.createdAt || post.date;
  if (!raw) return "Gần đây";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString("vi-VN");
}

function getPostTimestamp(post: BlogPost): number {
  const raw = post.createdAt || post.date;
  const parsed = raw ? new Date(raw).getTime() : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

const PAGE_SIZE = 6;

const CATEGORIES = [
  "Tất cả",
  "Web & Frontend",
  "Backend & System",
  "Lập Trình Giải Thuật",
  "AI / Machine Learning",
  "Kinh Nghiệm CLB",
];

function AuthorBadge({ author, size = "regular" }: { author?: BlogPost["author"]; size?: "regular" | "large" }) {
  const name = author?.name || "DEVER Member";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "D";
  const avatarSize = size === "large" ? "h-11 w-11 text-xs" : "h-8 w-8 text-xs";
  const [imgError, setImgError] = useState(false);

  const avatarUrl = author?.avatar;
  const showImage = Boolean(avatarUrl && !imgError);

  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative shrink-0 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#0066CC] to-cyan-500 shadow-md shadow-blue-900/15 ${avatarSize}`}>
        {showImage ? (
          <Image
            src={avatarUrl || ""}
            alt={name}
            width={88}
            height={88}
            sizes="(max-width: 768px) 32px, 44px"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="grid w-full h-full place-items-center font-extrabold text-white">
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-sm text-gray-900">{name}</p>
        <p className="truncate text-xs font-medium text-gray-600">{author?.role || "DEVER Member"}</p>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const likePendingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchQuery]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setLoadError(false);
      const res = await apiFetch(`/api/v1/blogs`);
      if (res.ok) {
        const json = await res.json();
        const serverData = Array.isArray(json) ? json : json?.data || [];
        setBlogs(serverData);
      } else {
        setLoadError(true);
        setBlogs([]);
      }
    } catch (err) {
      console.warn("Backend API unavailable:", err);
      setLoadError(true);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return blogs
      .filter((post) => {
        const matchesCategory =
          selectedCategory === "Tất cả" || post.category === selectedCategory;
        const matchesSearch =
          query.length === 0 ||
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
  }, [blogs, selectedCategory, searchQuery]);

  // Editorial: chỉ tôn vinh đúng 1 bài mới nhất khi không lọc/tìm kiếm.
  const isDefaultView = selectedCategory === "Tất cả" && searchQuery.trim().length === 0;
  const spotlightPost = isDefaultView ? filteredPosts[0] : undefined;
  const rowPosts = spotlightPost ? filteredPosts.slice(1) : filteredPosts;
  const visiblePosts = rowPosts.slice(0, visibleCount);
  const hasMore = visibleCount < rowPosts.length;

  const handleLike = async (post: BlogPost, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postId = post._id || post.id?.toString() || "";
    // Server only knows Mongo-backed posts — never send fallback/numeric ids.
    if (!post._id || likePendingRef.current.has(postId)) {
      return;
    }
    likePendingRef.current.add(postId);
    const wasLiked = Boolean(likedPosts[postId]);

    // Optimistic UI update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
    setBlogs((prev) =>
      prev.map((b) =>
        (b._id === postId || b.id?.toString() === postId)
          ? { ...b, likes: wasLiked ? b.likes - 1 : b.likes + 1 }
          : b
      )
    );

    try {
      const res = await apiFetch(`/api/v1/blogs/${post._id}/like`, { method: "PUT" });
      if (!res.ok) {
        throw new Error(`Like failed with status ${res.status}`);
      }
    } catch (err) {
      // Roll back the optimistic update so UI and DB never diverge silently.
      console.error("Error liking blog:", err);
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      setBlogs((prev) =>
        prev.map((b) =>
          (b._id === postId || b.id?.toString() === postId)
            ? { ...b, likes: wasLiked ? b.likes + 1 : Math.max(0, b.likes - 1) }
            : b
        )
      );
    } finally {
      likePendingRef.current.delete(postId);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FCFF] pb-20 pt-4">
      {/* Full-Page Cyber Circuit Background */}
      <DeverCircuitBackground className="pb-10">
        {/* Header Title & Intro */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-blue-200 pb-8 gap-4">
            <div>
              <span className="inline-block bg-[#0055B8]/10 text-[#0055B8] text-xs font-extrabold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 border border-[#0055B8]/20">
                DEVER TECH BLOG &amp; INSIGHTS
              </span>
              <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-950 tracking-tight">
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

        {/* 1. Editorial Spotlight — đúng 1 bài mới nhất, full-width */}
        {!isLoading && !loadError && spotlightPost && (
          <section aria-labelledby="blog-spotlight-title" className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
            <article className="group grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-md transition-shadow duration-200 hover:shadow-xl motion-reduce:transition-none md:grid-cols-2 md:gap-8 md:p-8">
              <div className="flex min-w-0 flex-col justify-center">
                <p className="mb-4 inline-flex w-fit items-center rounded-full border border-[#0055B8]/20 bg-[#0055B8]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#0055B8]">
                  Bài nổi bật • Mới nhất
                </p>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#0066CC]">
                  {spotlightPost.category}
                </p>
                <h2 id="blog-spotlight-title" className="text-3xl font-extrabold leading-tight tracking-tight text-gray-950 lg:text-4xl">
                  <Link
                    href={`/blog/${encodeURIComponent(spotlightPost.slug || spotlightPost._id || String(spotlightPost.id))}`}
                    className="transition-colors duration-200 hover:text-[#0066CC] motion-reduce:transition-none"
                  >
                    {spotlightPost.title}
                  </Link>
                </h2>
                <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-gray-700">
                  {spotlightPost.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-600">
                  <AuthorBadge author={spotlightPost.author} />
                  <span>{formatPostDate(spotlightPost)}</span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {spotlightPost.readTime || "5 phút đọc"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/blog/${encodeURIComponent(spotlightPost.slug || spotlightPost._id || String(spotlightPost.id))}`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0066CC] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#004C99] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
                  >
                    Đọc ngay
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleLike(spotlightPost, e)}
                    aria-pressed={Boolean(likedPosts[spotlightPost._id || String(spotlightPost.id) || ""])}
                    aria-label={`Yêu thích ${spotlightPost.title}`}
                    className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                      likedPosts[spotlightPost._id || String(spotlightPost.id) || ""]
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-rose-700"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedPosts[spotlightPost._id || String(spotlightPost.id) || ""] ? "fill-current" : ""}`} aria-hidden="true" />
                    {spotlightPost.likes}
                  </button>
                </div>
              </div>
              <Link
                href={`/blog/${encodeURIComponent(spotlightPost.slug || spotlightPost._id || String(spotlightPost.id))}`}
                aria-label={`Đọc bài viết: ${spotlightPost.title}`}
                className="relative block min-h-[240px] w-full overflow-hidden rounded-xl bg-slate-100 md:min-h-[320px]"
              >
                <div className="absolute inset-0">
                  <BlogCoverImage src={spotlightPost.coverImage} title={spotlightPost.title} />
                </div>
              </Link>
            </article>
          </section>
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
              className={`whitespace-nowrap inline-flex items-center min-h-[44px] px-4 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-sm ${
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

      {/* Article rows — gọn 1 hàng/bài */}
      <section aria-label="Danh sách bài viết" className="max-w-[1440px] mx-auto px-5 lg:px-20">
        {isLoading ? (
          <ul className="space-y-4" aria-label="Đang tải bài viết">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm animate-pulse motion-reduce:animate-none">
                <div className="h-24 w-24 shrink-0 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                </div>
              </li>
            ))}
          </ul>
        ) : loadError ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-xs">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1.5">Không tải được bài viết</h3>
            <p className="text-gray-600 text-xs mt-1 font-medium max-w-md mx-auto leading-relaxed">
              Máy chủ nội dung tạm thời không phản hồi. Vui lòng thử lại sau giây lát.
            </p>
            <button
              type="button"
              onClick={fetchBlogs}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#004C99] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              Thử lại
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1.5">Chưa Có Bài Viết Công Nghệ Nào</h3>
            <p className="text-gray-600 text-xs mt-1 font-medium max-w-md mx-auto leading-relaxed">
              Các bài viết chuyên sâu về thuật toán, kiến trúc hệ thống và cẩm nang công nghệ từ Ban Chuyên Môn sẽ được xuất bản tại đây.
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200">
            <SearchX className="mx-auto mb-4 h-10 w-10 text-[#0066CC]" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="text-xl font-extrabold text-gray-900">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-gray-600 text-sm mt-1 font-medium">Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.</p>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {visiblePosts.map((post, idx) => {
                const pId = post._id || post.id || idx;
                const slugTarget = post.slug || post._id || String(post.id);
                const likeKey = post._id || String(post.id) || "";
                const isLiked = Boolean(likedPosts[likeKey]);
                return (
                  <li key={pId}>
                    <article className="group flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#0066CC]/40 hover:shadow-md motion-reduce:transition-none">
                      <Link
                        href={`/blog/${encodeURIComponent(slugTarget)}`}
                        aria-label={`Đọc bài viết: ${post.title}`}
                        className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                      >
                        <BlogCoverImage src={post.coverImage} title={post.title} />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0066CC]">
                          {post.category}
                        </p>
                        <Link
                          href={`/blog/${encodeURIComponent(slugTarget)}`}
                          className="mt-1 block text-base font-extrabold text-gray-950 transition-colors duration-200 line-clamp-2 hover:text-[#0066CC] motion-reduce:transition-none"
                        >
                          {post.title}
                        </Link>
                        <p className="mt-1 truncate text-sm font-medium text-gray-700">
                          {post.excerpt}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-gray-600">
                          <span className="truncate">{post.author?.name || "DEVER Member"}</span>
                          <span aria-hidden="true">•</span>
                          <span>{formatPostDate(post)}</span>
                          <span aria-hidden="true">•</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.readTime || "5 phút đọc"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleLike(post, e)}
                        aria-pressed={isLiked}
                        aria-label={`Yêu thích ${post.title}`}
                        className={`inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1 rounded-xl px-3 text-sm font-extrabold transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                          isLiked
                            ? "bg-rose-100 text-rose-800"
                            : "text-slate-600 hover:bg-slate-100 hover:text-rose-700"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} aria-hidden="true" />
                        {post.likes}
                      </button>
                    </article>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 text-center">
              <p className="text-xs font-semibold text-gray-600" role="status">
                Hiển thị {visiblePosts.length} / {rowPosts.length} bài viết
              </p>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#0066CC] bg-white px-8 py-3 text-sm font-bold text-[#0066CC] shadow-sm transition-all duration-200 hover:bg-[#0066CC] hover:text-white active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  Xem thêm
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </>
        )}
      </section>
      </DeverCircuitBackground>
    </div>
  );
}
