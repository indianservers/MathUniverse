import { LayoutGrid, LayoutList, Search, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MathToolCard, MathToolRow } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { EmptyState, ToolProgressIndicator } from "../components/ui/UiFeedback";
import { mathLabTools } from "../data/mathLabTools";

const exploredToolsKey = "math-universe-explored-tools";
const favoriteKey = "math-universe-favorite-cards";
const SESSION_QUERY_KEY = "math-lab-query";
const SESSION_FILTER_KEY = "math-lab-filter";

function readFavorites(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(favoriteKey) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch { return []; }
}

function getRecentTools(limit = 4): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem("math-universe-recent-tools") ?? "[]");
    return Array.isArray(raw) ? (raw as unknown[]).filter((x): x is string => typeof x === "string").slice(0, limit) : [];
  } catch { return []; }
}

export default function MathLab() {
  const [query, setQuery] = useState(() => sessionStorage.getItem(SESSION_QUERY_KEY) ?? "");
  const [filter, setFilter] = useState<"all" | "favorites">(() => (sessionStorage.getItem(SESSION_FILTER_KEY) ?? "all") as "all" | "favorites");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [exploredCount, setExploredCount] = useState(12);
  const [favorites, setFavorites] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const recentRoutes = useMemo(() => getRecentTools(4), []);
  const recentTools = useMemo(
    () => mathLabTools.filter((t) => recentRoutes.includes(t.route)),
    [recentRoutes]
  );

  useEffect(() => {
    setFavorites(readFavorites());
    try {
      const explored = JSON.parse(localStorage.getItem(exploredToolsKey) ?? "[]");
      setExploredCount(Math.max(12, Array.isArray(explored) ? explored.length : 0));
    } catch { setExploredCount(12); }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_QUERY_KEY, query);
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_FILTER_KEY, filter);
  }, [filter]);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.tagName === "SELECT" || target?.isContentEditable;
      if (event.key === "/" && !isTyping) { event.preventDefault(); searchRef.current?.focus(); }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const visibleTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let base = mathLabTools;
    if (filter === "favorites") base = base.filter((t) => favorites.includes(t.route));
    if (!normalized) return base;
    return base.filter((tool) => {
      const haystack = [tool.title, tool.description, tool.difficulty, ...tool.useCases].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, filter, favorites]);

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Math Lab"
        subtitle="Graph, solve, visualize, calculate, and explore mathematics interactively."
        difficulty="Advanced Workspace"
        estimatedMinutes={60}
      />

      {recentTools.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-400">Recent tools</span>
          {recentTools.map((t) => (
            <Link key={t.route} to={t.route} className="mini-chip transition hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-400/15 dark:hover:text-cyan-100">
              {t.title}
            </Link>
          ))}
        </div>
      )}

      <SectionCard>
        <div className="flex flex-wrap gap-3">
          <label className="flex min-h-10 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/10 dark:bg-white/5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search graphing, vectors, CAS, calculus..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            />
            {query && <button type="button" className="text-xs font-bold text-slate-400 hover:text-slate-600" onClick={() => setQuery("")}>Clear</button>}
            <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">/ to search</span>
          </label>
          <button
            type="button"
            onClick={() => setFilter((v) => v === "favorites" ? "all" : "favorites")}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold transition ${filter === "favorites" ? "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-100" : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
          >
            <Star className={`h-4 w-4 ${filter === "favorites" ? "fill-current" : ""}`} />
            Favorites
          </button>
          <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
            <button type="button" onClick={() => setViewMode("grid")} className={`p-2.5 transition ${viewMode === "grid" ? "bg-cyan-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"}`} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
            <button type="button" onClick={() => setViewMode("list")} className={`p-2.5 transition ${viewMode === "list" ? "bg-cyan-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"}`} aria-label="List view"><LayoutList className="h-4 w-4" /></button>
          </div>
          <ToolProgressIndicator explored={exploredCount} total={60} />
        </div>
      </SectionCard>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTools.map((tool) => <MathToolCard key={tool.route} {...tool} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {visibleTools.map((tool) => <MathToolRow key={tool.route} {...tool} />)}
        </div>
      )}

      {visibleTools.length === 0 && (
        <EmptyState
          title="No tools match those filters"
          message="Try a broader keyword like graph, solver, matrix, vector, geometry, or calculus."
        />
      )}
    </div>
  );
}
