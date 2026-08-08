"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DeverRoadmapVector from "@components/ui/DeverRoadmapVector";

interface RoadmapItem {
  id: number;
  title: string;
  desc: string;
  level: string;
  tag: string;
  icon: string;
  milestones: {
    step: string;
    topics: string[];
  }[];
  recommendBooks: string[];
}

interface ResourceItem {
  _id?: string;
  id?: number;
  title: string;
  date?: string;
  author?: string;
  type: "Slide" | "Source Code" | "Ebook / PDF" | string;
  fileUrl: string;
  size: string;
}

const ROADMAPS: RoadmapItem[] = [
  {
    id: 1,
    title: "Lộ trình Frontend Developer 2026",
    desc: "Từ HTML/CSS cơ bản, JavaScript ES6+, React, Next.js 14 App Router cho đến tối ưu hiệu năng web.",
    level: "Cơ bản -> Nâng cao",
    tag: "Web Dev",
    icon: "💻",
    milestones: [
      {
        step: "Giai đoạn 1: Nền tảng Web Core (Tuần 1-3)",
        topics: ["HTML5 Semantic Tags & Accessibility", "CSS3 Flexbox, Grid & Responsive Layouts", "JavaScript ES6+ (Async/Await, Closure, ES Modules)"],
      },
      {
        step: "Giai đoạn 2: Framework & State Management (Tuần 4-7)",
        topics: ["React 18 Hooks & Context API", "Redux Toolkit & RTK Query Data Fetching", "Tailwind CSS & Styled-Components Design Systems"],
      },
      {
        step: "Giai đoạn 3: Next.js 14 App Router & Performance (Tuần 8-12)",
        topics: ["Server Components & Client Components", "Route Handlers & Server Actions", "SEO Meta Tags & Lighthouse 100 Performance"],
      },
    ],
    recommendBooks: ["You Don't Know JS Yet", "Refactoring UI by Adam Wathan", "Learning React 2nd Edition"],
  },
  {
    id: 2,
    title: "Lộ trình Backend & System Architecture",
    desc: "Node.js, Express, MongoDB, PostgreSQL, RESTful API, Docker containerization & Cloud Deploy.",
    level: "Trung cấp",
    tag: "Backend",
    icon: "⚙️",
    milestones: [
      {
        step: "Giai đoạn 1: Node.js Core & REST API (Tuần 1-4)",
        topics: ["Event Loop, Event Emitter & Streams", "Express.js Routing & Custom Middlewares", "JWT Authentication & Bcrypt Password Hashing"],
      },
      {
        step: "Giai đoạn 2: Database Management (Tuần 5-8)",
        topics: ["MongoDB Mongoose Schemas & Indexing", "PostgreSQL Relational DB & Prisma ORM", "Redis Caching & Session Store"],
      },
      {
        step: "Giai đoạn 3: DevOps & Deployment (Tuần 9-12)",
        topics: ["Docker & Docker Compose Containerization", "CI/CD Pipeline với GitHub Actions", "Cloud Deployment lên Railway & AWS S3"],
      },
    ],
    recommendBooks: ["Designing Data-Intensive Applications", "Clean Architecture by Robert C. Martin"],
  },
  {
    id: 3,
    title: "Lộ trình Competitive Programming (LeetCode / ICPC)",
    desc: "Cấu trúc dữ liệu & Giải thuật nâng cao (DP, Graph, Tree, Segment Tree) dành cho các giải đấu ICPC & OLP.",
    level: "Chuyên sâu",
    tag: "Algorithm",
    icon: "🏆",
    milestones: [
      {
        step: "Giai đoạn 1: Thuật toán cơ bản & СĐDL (Tuần 1-4)",
        topics: ["Two Pointers & Sliding Window", "Binary Search & Bit Manipulation", "Stack, Queue, Priority Queue & Binary Heap"],
      },
      {
        step: "Giai đoạn 2: Quy hoạch động & Đồ thị (Tuần 5-8)",
        topics: ["Dynamic Programming 1D/2D (Knapsack, LCS)", "BFS, DFS, Dijkstra, Floyd-Warshall", "Union-Find (DSU) & Minimum Spanning Tree"],
      },
      {
        step: "Giai đoạn 3: Cấu trúc dữ liệu nâng cao (Tuần 9-12)",
        topics: ["Segment Tree & Fenwick Tree (BIT)", "Trie & String Matching Algorithms", "Tối ưu hóa thời gian chạy O(N log N)"],
      },
    ],
    recommendBooks: ["Competitive Programmer's Handbook", "Introduction to Algorithms (CLRS)"],
  },
  {
    id: 4,
    title: "Lộ trình AI & Machine Learning Basics 2026",
    desc: "Python, NumPy, Pandas, Scikit-Learn và nhập môn Neural Networks dành riêng cho sinh viên FPT.",
    level: "Nhập môn",
    tag: "AI / Data",
    icon: "🤖",
    milestones: [
      {
        step: "Giai đoạn 1: Python cho Khoa học Dữ liệu (Tuần 1-3)",
        topics: ["Python Advanced Syntax & OOP", "NumPy Vectorization & Matrix Math", "Pandas Data Wrangling & Visualisation"],
      },
      {
        step: "Giai đoạn 2: Mô hình Machine Learning (Tuần 4-7)",
        topics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Model Evaluation & Hyperparameter Tuning"],
      },
      {
        step: "Giai đoạn 3: Deep Learning cơ bản (Tuần 8-12)",
        topics: ["Neural Networks với PyTorch / TensorFlow", "Computer Vision (CNN)", "Natural Language Processing (NLP)"],
      },
    ],
    recommendBooks: ["Hands-On Machine Learning with Scikit-Learn", "Deep Learning with Python by François Chollet"],
  },
];

const FALLBACK_WORKSHOPS: ResourceItem[] = [
  {
    id: 1,
    title: "Slide Workshop: Làm quen với Next.js 14 App Router & Server Components",
    date: "15/07/2026",
    author: "Ban Chuyên Môn FU-DEVER",
    type: "Slide",
    fileUrl: "https://drive.google.com/file/d/sample_nextjs14_slide/view",
    size: "14.5 MB (PDF)",
  },
  {
    id: 2,
    title: "Source Code Mẫu: Tích hợp Payment Gateway (VNPAY/MoMo) trong Node.js",
    date: "02/06/2026",
    author: "Dev Team DEVER",
    type: "Source Code",
    fileUrl: "https://github.com/fu-dever/vnpay-nodejs-template",
    size: "2.1 MB (ZIP)",
  },
];

export default function ResourcesPage() {
  const [workshops, setWorkshops] = useState<ResourceItem[]>(FALLBACK_WORKSHOPS);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapItem | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/v1/resources`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setWorkshops(json.data);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback resources:", err);
      }
    }
    fetchResources();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#F8FCFF]">
      {/* Header Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
        <div className="bg-gradient-to-r from-[#0055B8] to-[#003880] rounded-3xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between shadow-xl overflow-hidden relative">
          <div className="lg:w-3/5 z-10">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              📚 DEVER LEARNING VAULT (MONGODB CONNECTED)
            </span>
            <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">
              Kho Tài Liệu & Lộ Trình Lập Trình
            </h1>
            <p className="text-white/90 text-base lg:text-lg mb-6 max-w-xl">
              Tổng hợp lộ trình học tập bài bản, slide bài giảng workshop và các mã nguồn mẫu chuẩn hóa do Ban Chuyên Môn FU-DEVER biên soạn.
            </p>
            <div className="flex gap-4">
              <a
                href="#roadmaps"
                className="bg-white text-[#0055B8] font-bold px-6 py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-md"
              >
                Khám phá Lộ trình
              </a>
              <a
                href="#workshops"
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
              >
                Tài liệu Workshop
              </a>
            </div>
          </div>
          <div className="lg:w-2/5 mt-8 lg:mt-0 z-10 w-full">
            <DeverRoadmapVector />
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* Roadmaps Section */}
      <section id="roadmaps" className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#0055B8]">Lộ Trình Học Tập Chuẩn hóa</h2>
          <p className="text-gray-700 mt-2 font-medium">Nhấp vào từng lộ trình để xem khung chương trình chi tiết & tài liệu khuyên đọc</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROADMAPS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedRoadmap(item)}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-blue-100 flex flex-col justify-between group hover:-translate-y-1 duration-300 cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl p-3 bg-blue-50 rounded-2xl">{item.icon}</span>
                  <span className="bg-[#0055B8]/10 text-[#0055B8] text-xs font-extrabold px-3 py-1.5 rounded-full border border-blue-200">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-950 mb-2 group-hover:text-[#0055B8] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed font-medium">{item.desc}</p>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xs font-bold text-gray-700">
                <span>Cấp độ: {item.level}</span>
                <span className="text-[#0055B8] font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Xem chi tiết lộ trình &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop Resources Section */}
      <section id="workshops" className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-blue-100">
          <h2 className="text-2xl font-black text-gray-950 mb-6 flex items-center gap-3">
            <span>📥</span> Tài Liệu & Slide Bài Giảng Workshop (MongoDB Live)
          </h2>

          <div className="space-y-4">
            {workshops.map((item, idx) => (
              <div
                key={item._id || item.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50 hover:bg-blue-50/60 transition-colors border border-gray-200 gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-[#004C99] font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-blue-200">
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-600 font-bold">{item.size}</span>
                  </div>
                  <h4 className="font-extrabold text-gray-950 text-base">{item.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600 font-medium mt-1">
                    {item.date && <span>📅 {item.date}</span>}
                    {item.author && <span>✍️ {item.author}</span>}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(item)}
                  className="bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all self-start sm:self-center shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  📥 Tải Tài Liệu / Code
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Detail Modal */}
      {selectedRoadmap && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedRoadmap.icon}</span>
                <div>
                  <span className="bg-blue-100 text-[#004C99] font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200">
                    {selectedRoadmap.tag}
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-950 mt-1">
                    {selectedRoadmap.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoadmap(null)}
                className="text-gray-500 hover:text-gray-800 font-extrabold text-xl"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-gray-900 mb-3">📍 Khung Chương Trình Học Tập</h4>
              <div className="space-y-4">
                {selectedRoadmap.milestones.map((m, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <h5 className="font-extrabold text-sm text-[#004C99] mb-2">{m.step}</h5>
                    <ul className="list-disc list-inside text-xs text-gray-800 font-medium space-y-1">
                      {m.topics.map((t, tidx) => (
                        <li key={tidx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-extrabold text-sm text-gray-900 mb-2">📚 Giáo Trình Khuyên Đọc</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoadmap.recommendBooks.map((b, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-lg border border-gray-200">
                    📖 {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRoadmap(null)}
                className="bg-[#0066CC] text-white text-xs font-extrabold px-6 py-2.5 rounded-xl hover:bg-[#004C99] shadow-md"
              >
                Đóng Giao Diện Lộ Trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Download Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-5">
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-[#004C99] font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200">
                📥 TẢI TÀI LIỆU WORKSHOP
              </span>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-gray-500 hover:text-gray-800 font-extrabold text-xl"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-gray-950 mb-2">{selectedResource.title}</h3>
              <p className="text-xs text-gray-600 font-semibold">
                Loại: {selectedResource.type} • Dung lượng: {selectedResource.size}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl text-xs text-gray-800 font-semibold border border-blue-200">
              ✅ Tài liệu được lưu trữ an toàn trên Google Drive / GitHub của CLB FU-DEVER.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                Hủy
              </button>
              <a
                href={selectedResource.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
              >
                Tải Ngay (Link Mở Rộng) ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
