"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Star, Code2, Sparkles } from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface OpenSourceProject {
  _id?: string;
  id?: number | string;
  title: string;
  description: string;
  author: string;
  stars: number;
  githubUrl?: string;
  demoUrl?: string;
  category?: string;
  tags?: string[];
}

const INITIAL_PROJECTS: OpenSourceProject[] = [
  {
    id: 1,
    title: "dever-cli",
    description: "Công cụ CLI giúp setup dự án nhanh cho thành viên CLB.",
    author: "Nhật Quang",
    stars: 12,
    githubUrl: "https://github.com/fu-dever/dever-cli",
    category: "CLI Tool",
    tags: ["CLI", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    title: "fptu-timetable",
    description: "Extension Chrome hỗ trợ xếp lịch học cho sinh viên FPTU.",
    author: "Vũ Vũ",
    stars: 45,
    githubUrl: "https://github.com/fu-dever/fptu-timetable",
    category: "Browser Extension",
    tags: ["Extension", "React", "Chrome"],
  },
  {
    id: 3,
    title: "algorithm-visualizer",
    description: "Website mô phỏng các thuật toán kinh điển trực quan.",
    author: "Hải Trần",
    stars: 30,
    githubUrl: "https://github.com/fu-dever/algorithm-visualizer",
    category: "Web App",
    tags: ["Algorithm", "Next.js", "Canvas"],
  },
];

const API_SERVER =
  process.env.NEXT_PUBLIC_API_SERVER ||
  "http://localhost:5000";

export default function MemberShowcase() {
  const [projects, setProjects] = useState<OpenSourceProject[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjects() {
      const endpoints = [
        `${API_SERVER}/api/v1/opensource-projects`,
        "https://dever-backend-production.up.railway.app/api/v1/opensource-projects",
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            const serverData = Array.isArray(json) ? json : json?.data || [];
            if (Array.isArray(serverData) && serverData.length > 0) {
              setProjects(serverData);
              return;
            }
          }
        } catch {
          // Continue to fallback
        }
      }
      // Fallback to static initial projects if server unavailable
      setProjects(INITIAL_PROJECTS);
      setLoading(false);
    }
    fetchProjects().finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-slate-50/70 dark:bg-gray-900/90 transition-colors border-t border-slate-200/60 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0066CC] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" /> DEVER OPEN SOURCE ECOSYSTEM
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Dự Án Cá Nhân & Open Source
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Những sáng kiến công nghệ, thư viện mã nguồn mở và sản phẩm tiện ích do các thành viên tài năng thuộc CLB FU-DEVER xây dựng và đóng góp cho cộng đồng.
          </p>
        </div>

        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-7 border border-slate-200 dark:border-gray-700 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-5 w-12 bg-slate-200 dark:bg-gray-700 rounded-full" />
                </div>
                <div className="h-7 bg-slate-200 dark:bg-gray-700 rounded-xl w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
                <div className="h-10 bg-slate-100 dark:bg-gray-700 rounded-xl w-full pt-4" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-slate-200 dark:border-gray-700 p-8">
            <Code2 className="w-10 h-10 text-[#0066CC] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Chưa có dự án mã nguồn mở nào</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">Các dự án cá nhân và open source của thành viên CLB sẽ sớm được cập nhật tại đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => {
              const pKey = project._id || project.id || idx;
              return (
                <div
                  key={pKey}
                  className="group relative bg-white dark:bg-gray-800/90 rounded-3xl p-7 border border-slate-200/80 dark:border-gray-700/80 shadow-sm hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 dark:bg-blue-900/30 text-[#004C99] dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                      <Code2 className="h-3 w-3" /> {project.category || "Open Source"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-current" /> {project.stars}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#0066CC] dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                    {project.description}
                  </p>

                  {Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-gray-700/60 pt-5 mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Tác giả: <span className="text-slate-900 dark:text-white font-extrabold">{project.author}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl || "https://github.com/fu-dever"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <GithubIcon className="h-4 w-4" /> Xem trên GitHub
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2.5 bg-blue-50 dark:bg-blue-900/40 text-[#0066CC] dark:text-blue-300 hover:bg-blue-100 rounded-xl border border-blue-200 dark:border-blue-800 transition-all hover:scale-105"
                        title="Xem bản Demo trực tiếp"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
