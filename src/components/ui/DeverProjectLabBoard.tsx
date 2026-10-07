"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  ExternalLink,
  Inbox,
  LayoutGrid,
  Lightbulb,
  Rocket,
  Search,
  Send,
  UsersRound,
  X,
} from "lucide-react";

export type ProjectLabItem = {
  _id: string;
  title: string;
  summary: string;
  category: string;
  status: "open" | "paused" | "closed";
  roles: string[];
  contactUrl?: string | null;
};

const IDEA_MAILTO =
  "mailto:club.dever@gmail.com?subject=%5BProject%20Lab%5D%20%C3%9D%20t%C6%B0%E1%BB%9Fng%20d%E1%BB%B1%20%C3%A1n%20m%E1%BB%9Bi";

function statusBadge(status: ProjectLabItem["status"]) {
  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        Đang tuyển
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
      {status === "paused" ? "Tạm dừng" : "Đã đóng"}
    </span>
  );
}

function resolveContactUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return null;
}

function ApplyCta({ project, className }: { project: ProjectLabItem; className: string }) {
  const href = resolveContactUrl(project.contactUrl);
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        <span className="inline-flex items-center justify-center gap-1.5">
          Ứng tuyển / Liên hệ <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </a>
    );
  }
  return (
    <button type="button" disabled className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
      Sắp mở đơn
    </button>
  );
}

const CTA_ACTIVE =
  "inline-flex items-center justify-center bg-[#0066CC] hover:bg-[#004C99] text-white font-semibold text-sm rounded-xl transition-colors duration-200 active:scale-[0.98] min-h-[44px]";

export default function DeverProjectLabBoard({ projects }: { projects: ProjectLabItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [role, setRole] = useState<string | null>(null);

  const openProjects = useMemo(() => projects.filter((p) => p.status === "open"), [projects]);

  const stats = useMemo(() => {
    const openRoles = openProjects.reduce((total, p) => total + (p.roles?.length ?? 0), 0);
    const fields = new Set(
      projects.map((p) => (p.category ?? "").trim()).filter((c) => c.length > 0),
    );
    return { openCount: openProjects.length, openRoles, fieldCount: fields.size };
  }, [projects, openProjects]);

  const categories = useMemo(() => {
    const seen = new Map<string, number>();
    for (const p of projects) {
      const name = (p.category ?? "").trim();
      if (!name) continue;
      seen.set(name, (seen.get(name) ?? 0) + 1);
    }
    return Array.from(seen.entries());
  }, [projects]);

  const roles = useMemo(() => {
    const seen = new Set<string>();
    for (const p of projects) {
      for (const r of p.roles ?? []) {
        const name = (r ?? "").trim();
        if (name) seen.add(name);
      }
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b, "vi"));
  }, [projects]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchCategory = category === "all" || (p.category ?? "").trim() === category;
        const matchRole = role === null || (p.roles ?? []).includes(role);
        const matchQuery =
          normalizedQuery === "" ||
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.summary.toLowerCase().includes(normalizedQuery) ||
          (p.roles ?? []).some((r) => r.toLowerCase().includes(normalizedQuery));
        return matchCategory && matchRole && matchQuery;
      }),
    [projects, category, role, normalizedQuery],
  );

  const isDefaultView = normalizedQuery === "" && category === "all" && role === null;
  const spotlight = openProjects[0] ?? null;
  const gridProjects =
    isDefaultView && spotlight ? filtered.filter((p) => p._id !== spotlight._id) : filtered;

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setRole(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FCFF] pb-16 pt-4">
      {/* Compact white hero — no solid-blue banner, single search entry */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center">
          <p className="text-xs font-semibold text-[#0066CC]">
            Project Lab · Chợ ghép đội làm sản phẩm thật
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Tìm đồng đội. Làm sản phẩm thật.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Mọi dự án đều được quản trị viên xét duyệt trước khi mở đơn tuyển thành viên.
          </p>

          <div role="search" className="mx-auto mt-6 max-w-xl">
            <label htmlFor="project-lab-search" className="sr-only">
              Tìm dự án theo tên, mô tả hoặc vị trí
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="project-lab-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm dự án, vị trí như Frontend, AI/ML…"
                autoComplete="off"
                className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0066CC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:text-slate-700"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Real counts computed from API data — never hardcoded */}
          <dl className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
              <dt className="sr-only">Dự án đang tuyển</dt>
              <dd>
                <span className="font-bold text-slate-900">{stats.openCount}</span> dự án đang tuyển
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersRound className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
              <dt className="sr-only">Vị trí trống</dt>
              <dd>
                <span className="font-bold text-slate-900">{stats.openRoles}</span> vị trí trống
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
              <dt className="sr-only">Lĩnh vực</dt>
              <dd>
                <span className="font-bold text-slate-900">{stats.fieldCount}</span> lĩnh vực
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 lg:px-20">
        {/* Bento: spotlight + how-to + idea CTA (side cards always visible) */}
        {(() => {
          const showSpotlight = spotlight !== null && isDefaultView;
          return (
          <section aria-label="Dự án nổi bật và cách tham gia" className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {showSpotlight && spotlight ? (
              <article className="rounded-2xl border border-blue-100 bg-[#F0F7FF] p-6 lg:col-span-2 lg:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  {statusBadge(spotlight.status)}
                  <span className="bg-blue-50 text-[#0066CC] text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                    {spotlight.category}
                  </span>
                  <span className="text-xs font-semibold text-[#0066CC]">Mới nhất</span>
                </div>
                <h2 className="mt-4 text-xl font-bold leading-snug text-slate-900">{spotlight.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{spotlight.summary}</p>
                {(spotlight.roles ?? []).length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-slate-500">Cần vị trí gì</p>
                    <ul className="flex flex-wrap gap-1.5" aria-label={`Vị trí đang tuyển của ${spotlight.title}`}>
                      {spotlight.roles.map((r) => (
                        <li
                          key={r}
                          className="rounded-md border border-blue-100 bg-white px-2.5 py-1 text-xs font-semibold text-[#0066CC]"
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ApplyCta project={spotlight} className={`${CTA_ACTIVE} mt-6 px-6`} />
              </article>
            ) : null}

            <div className={`flex flex-col gap-4 ${showSpotlight ? "" : "lg:col-span-3 lg:flex-row"}`}>
              <article className="flex-1 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Send className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                  Cách tham gia 3 bước
                </h2>
                <ol className="mt-4 space-y-4">
                  {[
                    { icon: Search, text: "Chọn dự án hợp với vị trí bạn muốn thử sức." },
                    { icon: Send, text: "Bấm Ứng tuyển để liên hệ trực tiếp trưởng nhóm." },
                    { icon: Rocket, text: "Cùng đội lên kế hoạch và làm sản phẩm thật." },
                  ].map((step, i) => (
                    <li key={step.text} className="flex items-start gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-[#0066CC]"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <div className="flex items-start gap-2">
                        <step.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#0066CC]" aria-hidden="true" />
                        <p className="text-sm leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>

              <article className="flex-1 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Lightbulb className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                  Có ý tưởng dự án?
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Gửi mô tả cho ban quản trị. Ý tưởng được duyệt sẽ mở đơn tìm đồng đội ngay trên bảng này.
                </p>
                <a href={IDEA_MAILTO} className={`${CTA_ACTIVE} mt-4 w-full px-4`}>
                  <span className="inline-flex items-center justify-center gap-1.5">
                    Đăng ý tưởng <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </a>
              </article>
            </div>
          </section>
          );
        })()}

        {/* Filterable board */}
        <section id="projects" aria-label="Danh sách dự án" className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Dự án trong lab</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lọc theo lĩnh vực và vị trí, hoặc tìm theo tên dự án.
            </p>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo lĩnh vực">
              {[["all", "Tất cả", projects.length] as [string, string, number], ...categories.map(([name, count]): [string, string, number] => [name, name, count])].map(
                ([key, label, count]) => {
                  const active = category === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      aria-pressed={active}
                      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 active:scale-[0.98] ${
                        active
                          ? "bg-[#0066CC] text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      {label}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count as number}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          )}

          {roles.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Lọc theo vị trí">
              <span className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                Vị trí:
              </span>
              {roles.map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(active ? null : r)}
                    aria-pressed={active}
                    className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 active:scale-[0.98] ${
                      active
                        ? "bg-[#0066CC] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#0066CC]">
                <Inbox className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Chưa có dự án đang tuyển</h3>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                Quản trị viên sẽ cập nhật Project Lab ngay khi có dự án mới mở đơn.
              </p>
            </div>
          ) : gridProjects.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <Search className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">Không tìm thấy dự án phù hợp</h3>
              <p className="mt-1 text-sm text-slate-500">Thử từ khóa hoặc bộ lọc khác.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 active:scale-[0.98]"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gridProjects.map((item) => (
                <article
                  key={item._id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-200 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {statusBadge(item.status)}
                    <span className="bg-blue-50 text-[#0066CC] text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold leading-snug text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">{item.summary}</p>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-slate-500">Cần vị trí gì</p>
                    {(item.roles ?? []).length > 0 ? (
                      <ul className="flex flex-wrap gap-1.5" aria-label={`Vị trí đang tuyển của ${item.title}`}>
                        {item.roles.map((r) => (
                          <li
                            key={r}
                            className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0066CC]"
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs leading-5 text-slate-400">Vị trí sẽ cập nhật sau.</p>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <ApplyCta project={item} className={`${CTA_ACTIVE} w-full px-4`} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
