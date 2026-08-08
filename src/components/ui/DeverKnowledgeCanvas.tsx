import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarDays,
  Code2,
  Network,
  Sparkles,
  UsersRound,
} from "lucide-react";

type KnowledgeCanvasKind = "article" | "event";

interface DeverKnowledgeCanvasProps {
  kind?: KnowledgeCanvasKind;
  title: string;
  className?: string;
}

const shortTitle = (title: string) => title.trim().slice(0, 42) || "FU-DEVER";

/**
 * A predictable, component-native cover used by knowledge and event surfaces.
 * It deliberately does not depend on a CMS image URL so a broken remote image
 * can never degrade a key discovery surface into an empty placeholder.
 */
export default function DeverKnowledgeCanvas({
  kind = "article",
  title,
  className = "",
}: DeverKnowledgeCanvasProps) {
  const isEvent = kind === "event";
  const LeadIcon = isEvent ? CalendarDays : Code2;

  return (
    <div
      aria-hidden="true"
      className={`relative isolate h-full min-h-[12rem] overflow-hidden bg-[#06172F] p-5 text-white ${className}`}
    >
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-cyan-200/25 bg-cyan-400/10" />
      <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-[#0066CC]/35 blur-2xl" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-blue-100">
            <LeadIcon className="h-3.5 w-3.5 text-cyan-200" />
            {isEvent ? "DEVER Session" : "DEVER Notes"}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-200/30 bg-cyan-300/10 text-cyan-100 shadow-lg shadow-cyan-950/40">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-end gap-4">
          <div className="max-w-[17rem]">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              Learn • Build • Share
            </p>
            <p className="line-clamp-2 text-base font-extrabold leading-snug text-white sm:text-lg">
              {shortTitle(title)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-[#031027]/70 p-3 shadow-xl backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-16 rounded-full bg-blue-300/80" />
              <div className="h-1.5 w-12 rounded-full bg-cyan-200/65" />
              <div className="h-1.5 w-9 rounded-full bg-white/30" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-bold text-blue-100">
          <span className="inline-flex items-center gap-1.5">
            {isEvent ? <UsersRound className="h-3.5 w-3.5" /> : <BookOpenCheck className="h-3.5 w-3.5" />}
            FU-DEVER community
          </span>
          <span className="inline-flex items-center gap-1 text-cyan-200">
            {isEvent ? <Network className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
            2026
          </span>
        </div>
      </div>
    </div>
  );
}
