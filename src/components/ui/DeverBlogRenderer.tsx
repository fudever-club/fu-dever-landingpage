"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Heart,
  Share2,
  Check,
  Copy,
  BookOpen,
  Sparkles,
  Tag as TagIcon,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Calendar,
} from "lucide-react";

interface BlogData {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  tags?: string[];
  excerpt: string;
  content: string;
  readTime?: string;
  likes?: number;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  coverImage?: string;
  createdAt?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Clean Code Block with 1-Click Copy (No Execution Sandbox)
function CodeBlockWithCopy({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0D1117] text-slate-100 shadow-xl transition-all font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-slate-800 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-bold text-blue-400">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
          <span className="ml-2 font-semibold text-slate-300">{language || "code"}</span>
        </span>

        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-xs font-semibold"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Đã sao chép" : "Sao chép"}
        </button>
      </div>

      {/* Code contents */}
      <pre className="p-4 text-xs md:text-sm overflow-x-auto leading-relaxed text-slate-200 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Render Markdown Tables cleanly
function MarkdownTable({ rows }: { rows: string[][] }) {
  if (rows.length === 0) return null;
  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-blue-100 shadow-sm bg-white font-sans">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[#0066CC] text-white font-sans">
          <tr>
            {header.map((col, idx) => (
              <th key={idx} className="px-4 py-3 font-bold border-b border-blue-600">
                {col.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-sans">
          {body.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-2.5 text-slate-700 font-medium">
                  {cell.trim()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DeverBlogRenderer({ post }: { post: BlogData }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const API_SERVER = "https://dever-backend-production.up.railway.app";

  // Check Bookmark state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dever_bookmarks");
      if (saved) {
        const bookmarks = JSON.parse(saved);
        if (bookmarks.includes(post.slug)) setIsBookmarked(true);
      }
    } catch (e) {}
  }, [post.slug]);

  // Scroll Progress Listener & Active Heading Scroll-Spy
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(progress);

      // Detect active heading
      const headings = document.querySelectorAll("h1[id], h2[id], h3[id]");
      let currentId = "";
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top <= 140) {
          currentId = heading.id;
        }
      });
      if (currentId) setActiveHeadingId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parse Table of Contents & Heading IDs
  useEffect(() => {
    if (!post?.content) return;
    const lines = post.content.split("\n");
    const extractedToc: TocItem[] = [];

    lines.forEach((line) => {
      if (line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")) {
        const level = line.startsWith("# ") ? 1 : line.startsWith("## ") ? 2 : 3;
        const text = line.replace(/^#{1,3}\s+/, "").trim();
        const id = text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        extractedToc.push({ id, text, level });
      }
    });

    setToc(extractedToc);
  }, [post?.content]);

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    try {
      const saved = localStorage.getItem("dever_bookmarks");
      let bookmarks: string[] = saved ? JSON.parse(saved) : [];
      if (isBookmarked) {
        bookmarks = bookmarks.filter((s) => s !== post.slug);
        setIsBookmarked(false);
      } else {
        bookmarks.push(post.slug);
        setIsBookmarked(true);
      }
      localStorage.setItem("dever_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {}
  };

  // Handle Likes
  const handleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    if (post._id) {
      try {
        await fetch(`${API_SERVER}/api/v1/blogs/${post._id}/like`, { method: "PUT" });
      } catch (err) {
        // Quiet fallback
      }
    }
  };

  // Handle Share
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Render Rich Markdown Blocks with unified font-sans
  const renderParsedContent = (rawText: string) => {
    if (!rawText) return <p className="text-slate-500 font-sans">Nội dung bài viết đang được cập nhật.</p>;

    const lines = rawText.split("\n");
    const output: React.ReactNode[] = [];
    let inCode = false;
    let codeLang = "";
    let codeLines: string[] = [];

    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (keyIndex: number) => {
      if (tableRows.length > 0) {
        output.push(<MarkdownTable key={`table-${keyIndex}`} rows={tableRows} />);
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.trim().startsWith("```")) {
        flushTable(index);
        if (inCode) {
          output.push(
            <CodeBlockWithCopy
              key={`code-${index}`}
              code={codeLines.join("\n")}
              language={codeLang}
            />
          );
          inCode = false;
          codeLines = [];
          codeLang = "";
        } else {
          inCode = true;
          codeLang = line.trim().slice(3).trim();
        }
        return;
      }

      if (inCode) {
        codeLines.push(line);
        return;
      }

      // Markdown Table (| col1 | col2 |)
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        // Skip separator row (|---|---|)
        if (/^\|[\s\-:]+\|/.test(line.trim())) {
          return;
        }
        const cells = line
          .trim()
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableRows.push(cells);
        inTable = true;
        return;
      } else if (inTable) {
        flushTable(index);
      }

      // Headers with smooth scroll anchors
      if (line.startsWith("# ")) {
        const text = line.slice(2);
        const id = text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");
        output.push(
          <h1
            key={index}
            id={id}
            className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-10 mb-4 border-b border-slate-100 pb-3 tracking-tight scroll-mt-28 font-sans"
          >
            {text}
          </h1>
        );
        return;
      }
      if (line.startsWith("## ")) {
        const text = line.slice(3);
        const id = text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");
        output.push(
          <h2
            key={index}
            id={id}
            className="text-xl lg:text-2xl font-bold text-[#0066CC] mt-8 mb-3 scroll-mt-28 flex items-center gap-2 font-sans"
          >
            <span className="h-2 w-2 rounded-full bg-[#0066CC] inline-block" />
            {text}
          </h2>
        );
        return;
      }
      if (line.startsWith("### ")) {
        const text = line.slice(4);
        const id = text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");
        output.push(
          <h3
            key={index}
            id={id}
            className="text-lg font-bold text-slate-800 mt-6 mb-2 scroll-mt-28 font-sans"
          >
            {text}
          </h3>
        );
        return;
      }

      // Callouts / Alerts
      if (
        line.startsWith("> [!NOTE]") ||
        line.startsWith("> [!TIP]") ||
        line.startsWith("> [!WARNING]") ||
        line.startsWith("> [!CAUTION]")
      ) {
        const isWarn = line.includes("WARNING");
        const isTip = line.includes("TIP");
        const isCaution = line.includes("CAUTION");

        const bg = isCaution
          ? "bg-rose-50 border-rose-200 text-rose-900"
          : isWarn
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : isTip
          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
          : "bg-blue-50 border-blue-200 text-blue-900";

        const Icon = isCaution ? HelpCircle : isWarn ? AlertTriangle : isTip ? Sparkles : Lightbulb;

        output.push(
          <div
            key={index}
            className={`my-4 p-4 rounded-2xl border ${bg} text-sm leading-relaxed font-semibold shadow-sm flex items-start gap-3 font-sans`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              {line.replace(/^>\s*\[![A-Z]+\]\s*/, "") || (
                isCaution
                  ? "CẢNH BÁO NGUY HIỂM"
                  : isWarn
                  ? "LƯU Ý QUAN TRỌNG"
                  : isTip
                  ? "MẸO KỸ THUẬT"
                  : "GHI CHÚ HỌC THUẬT"
              )}
            </div>
          </div>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        output.push(
          <blockquote
            key={index}
            className="border-l-4 border-[#0066CC] pl-4 py-2.5 my-4 text-slate-700 italic bg-blue-50/40 rounded-r-2xl text-[15px] sm:text-base font-medium font-sans leading-relaxed"
          >
            {line.slice(2)}
          </blockquote>
        );
        return;
      }

      // Image parser (Markdown ![alt](url), HTML <img src="...">, or direct image URL)
      const mdImgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      const htmlImgMatch = line.match(/<img.*?src=["'](.*?)["'].*?>/i);
      const directUrlMatch = /^https?:\/\/\S+\.(?:png|jpe?g|webp|gif|svg)(\?\S*)?$/i.test(line.trim()) ? [line.trim(), "", line.trim()] : null;

      const imgMatch = mdImgMatch || htmlImgMatch || directUrlMatch;
      if (imgMatch) {
        const altText = mdImgMatch ? mdImgMatch[1] : "Hình ảnh minh họa";
        const imgSrc = mdImgMatch ? mdImgMatch[2] : htmlImgMatch ? htmlImgMatch[1] : line.trim();

        output.push(
          <div
            key={index}
            className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white font-sans"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={altText || post.title}
              className="w-full max-h-[480px] object-cover"
              loading="lazy"
            />
            {altText && altText !== "Hình ảnh minh họa" && (
              <p className="text-center text-xs text-slate-500 font-semibold py-2 px-4 bg-slate-50 border-t border-slate-100 font-sans">
                📷 {altText}
              </p>
            )}
          </div>
        );
        return;
      }

      // Bullet lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        output.push(
          <li
            key={index}
            className="ml-6 list-disc text-slate-700 leading-relaxed my-1 font-normal font-sans text-[15px] sm:text-base"
          >
            {line.slice(2)}
          </li>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        output.push(
          <li
            key={index}
            className="ml-6 list-decimal text-slate-700 leading-relaxed my-1 font-normal font-sans text-[15px] sm:text-base"
          >
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
        return;
      }

      // Blank line
      if (!line.trim()) {
        output.push(<div key={index} className="h-3" />);
        return;
      }

      // Regular paragraph
      output.push(
        <p key={index} className="text-slate-700 leading-relaxed mb-4 font-normal font-sans text-[15px] sm:text-base">
          {line}
        </p>
      );
    });

    flushTable(lines.length);
    return output;
  };

  return (
    <main className="min-h-screen bg-[#F8FCFF] px-4 lg:px-8 pb-28 pt-24 font-sans antialiased">
      {/* Top Global Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#0066CC] via-[#0080FF] to-[#00E5FF] z-50 transition-all duration-150 shadow-sm"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-6xl mx-auto font-sans">
        {/* Navigation & Reader Customizer Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 font-sans">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs lg:text-sm font-bold text-[#0066CC] hover:text-[#004C99] transition-all bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm hover:shadow font-sans"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách Blog
          </Link>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 font-sans">
            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-all shadow-sm font-sans ${
                isBookmarked
                  ? "bg-amber-50 border-amber-200 text-amber-600 shadow-amber-500/10"
                  : "bg-white border-slate-200 text-slate-700 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-amber-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span>{isBookmarked ? "Đã lưu" : "Lưu đọc sau"}</span>
            </button>

            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-all shadow-sm font-sans ${
                isLiked
                  ? "bg-rose-50 border-rose-200 text-rose-600 shadow-rose-500/10"
                  : "bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current text-rose-500" : ""}`} />
              <span>{likes}</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#0066CC] hover:text-[#0066CC] transition-all shadow-sm font-sans"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
              <span>{copiedLink ? "Đã chép link" : "Chia sẻ"}</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          {/* Article Main Body (Col 8) */}
          <article className="lg:col-span-8 rounded-3xl border border-blue-100 bg-white p-6 lg:p-10 shadow-sm font-sans">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4 font-sans">
              <span className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#0066CC] px-3.5 py-1 rounded-full shadow-sm">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Clock className="h-3.5 w-3.5" /> {post.readTime || "5 phút đọc"}
              </span>
              {post.createdAt && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5" /> {post.createdAt.slice(0, 10)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-4xl font-extrabold leading-tight text-slate-900 tracking-tight mb-6 font-sans">
              {post.title}
            </h1>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-[380px] object-cover"
                />
              </div>
            )}

            {/* Excerpt Lead */}
            <p className="text-[15px] sm:text-base font-semibold leading-relaxed text-slate-700 bg-blue-50/60 p-4 lg:p-5 rounded-2xl border-l-4 border-[#0066CC] mb-8 font-sans">
              {post.excerpt}
            </p>

            {/* Author Byline Card */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100 font-sans">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#004C99] to-[#0080FF] text-white font-extrabold text-sm flex items-center justify-center shadow-md font-sans">
                  {post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : "DV"}
                </div>
                <div className="font-sans">
                  <h4 className="text-sm lg:text-base font-extrabold text-slate-900 font-sans">
                    {post.author?.name || "Thành viên DEVER"}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium font-sans">
                    {post.author?.role || "Ban Chuyên Môn FU-DEVER"}
                  </p>
                </div>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="font-sans">
              {renderParsedContent(post.content)}
            </div>

            {/* Tags footer */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100 font-sans">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-sans">
                    <TagIcon className="h-3.5 w-3.5" /> Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-[#0066CC] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 font-sans"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sticky Sidebar: Table of Contents & Quick Actions (Col 4) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-24 font-sans">
            {/* Table of Contents Box with Scroll-Spy */}
            {toc.length > 0 && (
              <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm font-sans">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 font-sans">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-sans">
                    <BookOpen className="h-4 w-4 text-[#0066CC]" /> Mục Lục Bài Viết
                  </h3>
                  <span className="text-[11px] font-bold text-[#0066CC] bg-blue-50 px-2 py-0.5 rounded-md font-sans">
                    {Math.round(scrollProgress)}%
                  </span>
                </div>

                <nav className="space-y-1 max-h-80 overflow-y-auto pr-2 font-sans">
                  {toc.map((item, idx) => {
                    const isActive = activeHeadingId === item.id;
                    return (
                      <a
                        key={idx}
                        href={`#${item.id}`}
                        className={`block text-xs py-1.5 px-2.5 rounded-lg transition-all font-sans ${
                          isActive
                            ? "bg-blue-50 text-[#0066CC] font-bold border-l-2 border-[#0066CC]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                        } ${
                          item.level === 1
                            ? "pl-2 font-semibold"
                            : item.level === 2
                            ? "pl-5"
                            : "pl-8 text-slate-500"
                        }`}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* DEVER Club Promo Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#004C99] to-[#0066CC] p-6 text-white shadow-lg shadow-blue-500/10 space-y-3 font-sans">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-100 font-sans">
                  Học Thuật & Nghiên Cứu
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-white font-sans">Bạn muốn đóng góp bài viết?</h4>
              <p className="text-xs text-blue-100 leading-relaxed font-medium font-sans">
                Đăng nhập Cổng Thành Viên (Client Portal) để sử dụng trình soạn thảo DEVER Studio Writer và chia sẻ kiến thức cùng CLB.
              </p>
              <a
                href="http://localhost:3002/vi/create-blog"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#0066CC] px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md mt-2 font-sans"
              >
                Mở Studio Soạn Thảo <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
