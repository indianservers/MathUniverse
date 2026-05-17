import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathToolCard } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { EmptyState, ToolProgressIndicator } from "../components/ui/UiFeedback";
import { mathLabTools } from "../data/mathLabTools";

const exploredToolsKey = "math-universe-explored-tools";

export default function MathLab() {
  const [query, setQuery] = useState("");
  const [exploredCount, setExploredCount] = useState(12);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const explored = JSON.parse(localStorage.getItem(exploredToolsKey) ?? "[]");
      setExploredCount(Math.max(12, Array.isArray(explored) ? explored.length : 0));
    } catch {
      setExploredCount(12);
    }
  }, []);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.tagName === "SELECT" || target?.isContentEditable;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const visibleTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return mathLabTools;
    return mathLabTools.filter((tool) => {
      const haystack = [tool.title, tool.description, tool.difficulty, ...tool.useCases].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Math Lab"
        subtitle="Graph, solve, visualize, calculate, and explore mathematics interactively."
        difficulty="Advanced Workspace"
        estimatedMinutes={60}
      />
      <SectionCard className="overflow-hidden">
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-700 to-violet-700 p-6 text-white md:p-8">
          <p className="text-sm font-black uppercase text-cyan-100/80">GeoGebra-style visuals + WolframAlpha-style solving</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Math Lab</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-white/90 md:text-base">
            A central workspace for graphing, symbolic algebra, equation solving, calculus, statistics, probability, geometry, linear algebra, matrices, and 3D graphs.
          </p>
        </div>
      </SectionCard>
      <SectionCard title="Find A Tool" description="Search by topic, action, or use case. Press / anywhere on this page to jump into search.">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/10 dark:bg-white/5">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search graphing, vectors, CAS, calculus..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            />
            <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">/ to search</span>
          </label>
          <ToolProgressIndicator explored={exploredCount} total={60} />
        </div>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleTools.map((tool) => <MathToolCard key={tool.route} {...tool} />)}
      </div>
      {visibleTools.length === 0 && (
        <EmptyState
          title="No tools match those filters"
          message="Try a broader keyword like graph, solver, matrix, vector, geometry, or calculus."
        />
      )}
    </div>
  );
}
