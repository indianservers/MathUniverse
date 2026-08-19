import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Grid3X3,
  History,
  Layers3,
  List,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { MathText } from "../../components/ui/MathExpression";
import {
  theoremVisualProofCategorySummaries,
  theoremVisualProofExpectedTotal,
  theoremVisualProofInventoryMatches,
  theoremVisualProofRecords,
  theoremVisualProofTotal,
  visualProofLearningPaths,
  type TheoremProofLevel,
  type TheoremProofType,
  type TheoremVisualProofRecord,
  type VisualStrategyFamily,
} from "../data/theoremVisualProofInventory";

type SortMode = "recommended" | "name" | "difficulty" | "category";
type ViewMode = "grid" | "list";

const recentStorageKey = "visual-proof-recent-theorem-routes";
const allValue = "all";

export default function VisualProofsHomePage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(allValue);
  const [levelFilter, setLevelFilter] = useState<TheoremProofLevel | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TheoremProofType | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(recentStorageKey) ?? "[]");
      if (Array.isArray(stored)) setRecentRoutes(stored.filter((item): item is string => typeof item === "string").slice(0, 6));
    } catch {
      setRecentRoutes([]);
    }
  }, []);

  const filteredProofs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = theoremVisualProofRecords.filter((record) => {
      const matchesQuery = !normalized || record.searchText.includes(normalized);
      const matchesCategory = categoryFilter === allValue || record.categoryId === categoryFilter;
      const matchesLevel = levelFilter === "all" || record.mathematicalLevel === levelFilter;
      const matchesType = typeFilter === "all" || record.proofType === typeFilter;
      return matchesQuery && matchesCategory && matchesLevel && matchesType;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "name") return a.theoremName.localeCompare(b.theoremName);
      if (sortMode === "difficulty") return levelWeight(a.mathematicalLevel) - levelWeight(b.mathematicalLevel) || a.learningOrder - b.learningOrder;
      if (sortMode === "category") return a.categoryName.localeCompare(b.categoryName) || a.learningOrder - b.learningOrder;
      return a.learningOrder - b.learningOrder;
    });
  }, [categoryFilter, levelFilter, query, sortMode, typeFilter]);

  const featuredProofs = useMemo(() => {
    const preferredRoutes = new Set([
      "/theorems/geometry/pythagorean-theorem-1",
      "/theorems/algebra/binomial-theorem-11",
      "/theorems/trigonometry/unit-circle-coordinate-theorem-4",
      "/theorems/calculus-analysis/mean-value-theorem-5",
      "/theorems/probability-statistics/bayes-theorem-15",
      "/theorems/linear-algebra-vectors/determinant-area-scale-theorem-5",
    ]);
    const preferred = theoremVisualProofRecords.filter((record) => preferredRoutes.has(record.route));
    return preferred.length >= 4 ? preferred.slice(0, 6) : theoremVisualProofRecords.filter((record) => record.existingStatus === "partial").slice(0, 6);
  }, []);

  const recentProofs = useMemo(
    () => recentRoutes.map((route) => theoremVisualProofRecords.find((record) => record.route === route)).filter((record): record is TheoremVisualProofRecord => Boolean(record)),
    [recentRoutes],
  );

  const resetFilters = () => {
    setQuery("");
    setCategoryFilter(allValue);
    setLevelFilter("all");
    setTypeFilter("all");
    setSortMode("recommended");
  };

  const rememberProof = (route: string) => {
    const next = [route, ...recentRoutes.filter((item) => item !== route)].slice(0, 6);
    setRecentRoutes(next);
    localStorage.setItem(recentStorageKey, JSON.stringify(next));
  };

  return (
    <div className="visual-proof-library space-y-4">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-cyan-700 dark:hover:text-cyan-200">Home</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-100">Visual Proofs</span>
      </nav>

      <section className="overflow-hidden rounded-xl border border-cyan-200 bg-white/95 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
        <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:p-5">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Visual Proof Library
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 dark:text-white">See why the theorem is true.</h1>
            <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              Explore theorem pages that separate the claim, givens, proof goal, visual argument, assumptions, applications, and next steps. This Phase 1 hub is reconciled to the authoritative theorem inventory.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <HeroStat label="Visual Proofs" value={theoremVisualProofTotal} good={theoremVisualProofInventoryMatches} />
              <HeroStat label="Categories" value={theoremVisualProofCategorySummaries.length} good />
              <HeroStat label="Inventory Target" value={theoremVisualProofExpectedTotal} good={theoremVisualProofInventoryMatches} />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">How to study a proof</p>
            <div className="mt-3 grid gap-2">
              {["Read the theorem claim.", "Highlight Given and Prove.", "Step the visual argument.", "Check assumptions and a failure case."].map((item, index) => (
                <div key={item} className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-2 rounded-lg bg-white p-2 text-sm font-black text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-cyan-600 text-white">{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!theoremVisualProofInventoryMatches ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Inventory warning: expected {theoremVisualProofExpectedTotal} routes but found {theoremVisualProofTotal}. Filters still work, but the manifest needs review.
        </section>
      ) : null}

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white/92 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.05] lg:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold dark:border-white/10 dark:bg-slate-950">
          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search theorem, formula, concept, keyword, or category"
            className="min-w-0 flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="action-secondary min-h-12 rounded-lg lg:hidden">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
          </button>
          <button type="button" onClick={resetFilters} className="action-secondary min-h-12 rounded-lg">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section className="hidden gap-3 rounded-xl border border-slate-200 bg-white/92 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.05] lg:grid lg:grid-cols-5">
        <ProofFilters
          categoryFilter={categoryFilter}
          levelFilter={levelFilter}
          typeFilter={typeFilter}
          sortMode={sortMode}
          viewMode={viewMode}
          onCategory={setCategoryFilter}
          onLevel={setLevelFilter}
          onType={setTypeFilter}
          onSort={setSortMode}
          onView={setViewMode}
        />
      </section>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45 p-3 lg:hidden" role="dialog" aria-modal="true" aria-label="Visual proof filters">
          <div className="ml-auto max-h-full w-full max-w-sm overflow-y-auto rounded-xl bg-white p-4 shadow-2xl dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-lg font-black text-slate-950 dark:text-white">Filters</p>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-white/10" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-3">
              <ProofFilters
                categoryFilter={categoryFilter}
                levelFilter={levelFilter}
                typeFilter={typeFilter}
                sortMode={sortMode}
                viewMode={viewMode}
                onCategory={setCategoryFilter}
                onLevel={setLevelFilter}
                onType={setTypeFilter}
                onSort={setSortMode}
                onView={setViewMode}
              />
            </div>
          </div>
        </div>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Categories</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">All 13 theorem categories with exact route counts.</p>
          </div>
          <p className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-black text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-100">{filteredProofs.length} results</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {theoremVisualProofCategorySummaries.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === category.id ? allValue : category.id)}
              className={`grid min-h-[96px] grid-cols-[42px_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border p-3 text-left transition ${
                categoryFilter === category.id
                  ? "border-cyan-300 bg-cyan-50 shadow-sm dark:border-cyan-300/40 dark:bg-cyan-300/10"
                  : "border-slate-200 bg-white/90 hover:border-cyan-200 hover:bg-cyan-50/40 dark:border-white/10 dark:bg-white/[0.05]"
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg text-sm font-black text-white" style={{ background: category.accent }}>{category.title.slice(0, 2)}</span>
              <span className="min-w-0">
                <strong className="line-clamp-1 text-base font-black text-slate-950 dark:text-white">{category.title}</strong>
                <small className="mt-1 line-clamp-2 block text-xs font-semibold leading-5 text-slate-500 dark:text-slate-300">{category.description}</small>
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700 dark:bg-slate-950/50 dark:text-slate-100">{category.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">{hasActiveFilter(query, categoryFilter, levelFilter, typeFilter) ? "Matching Visual Proofs" : "Featured Visual Proofs"}</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                Cards link to full theorem proof pages with the shared Phase 1 proof shell.
              </p>
            </div>
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
          {filteredProofs.length === 0 ? (
            <EmptySearchState onReset={resetFilters} />
          ) : (
            <div className={viewMode === "grid" ? "grid gap-3 lg:grid-cols-2" : "grid gap-2"}>
              {(hasActiveFilter(query, categoryFilter, levelFilter, typeFilter) ? filteredProofs : featuredProofs).map((record) => (
                <TheoremProofCard key={record.id} record={record} viewMode={viewMode} onOpen={rememberProof} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <SidePanel title="Recently viewed" icon={<History className="h-4 w-4" />}>
            {recentProofs.length ? (
              <div className="grid gap-2">
                {recentProofs.map((record) => <CompactProofLink key={record.id} record={record} onOpen={rememberProof} />)}
              </div>
            ) : (
              <p className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">Open any proof to start a local recent list.</p>
            )}
          </SidePanel>

          <SidePanel title="Continue learning" icon={<Play className="h-4 w-4" />}>
            <div className="grid gap-2">
              {(recentProofs.length ? recentProofs : featuredProofs.slice(0, 3)).map((record) => <CompactProofLink key={record.id} record={record} onOpen={rememberProof} />)}
            </div>
          </SidePanel>

          <SidePanel title="Learning paths" icon={<Layers3 className="h-4 w-4" />}>
            <div className="grid gap-2">
              {visualProofLearningPaths.map((path) => (
                <div key={path.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950/50">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{path.title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-300">{path.caption}</p>
                  <Link to={path.routes[0]} onClick={() => rememberProof(path.routes[0])} className="mt-2 inline-flex items-center gap-1 text-xs font-black text-cyan-700 dark:text-cyan-100">
                    Start path <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </SidePanel>
        </aside>
      </section>
    </div>
  );
}

function ProofFilters({
  categoryFilter,
  levelFilter,
  typeFilter,
  sortMode,
  viewMode,
  onCategory,
  onLevel,
  onType,
  onSort,
  onView,
}: {
  categoryFilter: string;
  levelFilter: TheoremProofLevel | "all";
  typeFilter: TheoremProofType | "all";
  sortMode: SortMode;
  viewMode: ViewMode;
  onCategory: (value: string) => void;
  onLevel: (value: TheoremProofLevel | "all") => void;
  onType: (value: TheoremProofType | "all") => void;
  onSort: (value: SortMode) => void;
  onView: (value: ViewMode) => void;
}) {
  return (
    <>
      <FilterSelect label="Category" value={categoryFilter} onChange={onCategory}>
        <option value="all">All 13 categories</option>
        {theoremVisualProofCategorySummaries.map((category) => (
          <option key={category.id} value={category.id}>{category.title} ({category.count})</option>
        ))}
      </FilterSelect>
      <FilterSelect label="Level" value={levelFilter} onChange={(value) => onLevel(value as TheoremProofLevel | "all")}>
        <option value="all">All levels</option>
        <option value="Foundation">Foundation</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </FilterSelect>
      <FilterSelect label="Proof type" value={typeFilter} onChange={(value) => onType(value as TheoremProofType | "all")}>
        <option value="all">All proof types</option>
        <option value="Visual proof">Visual proof</option>
        <option value="formal proof">Formal proof</option>
        <option value="intuition">Intuition</option>
        <option value="experiment">Experiment</option>
      </FilterSelect>
      <FilterSelect label="Sort" value={sortMode} onChange={(value) => onSort(value as SortMode)}>
        <option value="recommended">Recommended order</option>
        <option value="name">Name</option>
        <option value="difficulty">Difficulty</option>
        <option value="category">Category</option>
      </FilterSelect>
      <FilterSelect label="View" value={viewMode} onChange={(value) => onView(value as ViewMode)}>
        <option value="grid">Grid cards</option>
        <option value="list">Compact list</option>
      </FilterSelect>
    </>
  );
}

function TheoremProofCard({ record, viewMode, onOpen }: { record: TheoremVisualProofRecord; viewMode: ViewMode; onOpen: (route: string) => void }) {
  const compact = viewMode === "list";
  return (
    <article className={`rounded-xl border border-slate-200 bg-white/92 p-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] ${compact ? "grid gap-3 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-center" : "grid min-h-[255px] gap-3"}`}>
      <ProofPreview family={record.strategyFamily} title={record.theoremName} compact={compact} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-100">{record.categoryName}</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600 dark:bg-slate-950/50 dark:text-slate-200">{record.mathematicalLevel}</span>
          <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-violet-700 dark:bg-violet-300/10 dark:text-violet-100">{record.proofType}</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-amber-700 dark:bg-amber-300/10 dark:text-amber-100">
            <Clock3 className="h-3 w-3" />
            {record.estimatedTime}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight text-slate-950 dark:text-white">
          <MathText value={record.theoremName} />
        </h3>
        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          <MathText value={record.theorem.statement} />
        </p>
        {!compact ? (
          <div className="mt-3 grid gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <span className="rounded-lg bg-slate-50 p-2 dark:bg-slate-950/50">Core idea: {record.coreIdea}</span>
            <span className="rounded-lg bg-slate-50 p-2 dark:bg-slate-950/50">Interaction: {record.interaction}</span>
          </div>
        ) : null}
      </div>
      <Link to={record.route} onClick={() => onOpen(record.route)} className="action-primary h-fit rounded-xl" aria-label={`Open full theorem proof page: ${record.theoremName}`}>
        Open Proof <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function ProofPreview({ family, title, compact }: { family: VisualStrategyFamily; title: string; compact: boolean }) {
  const height = compact ? "h-24" : "h-32";
  return (
    <div className={`${height} overflow-hidden rounded-lg border border-slate-200 bg-slate-950 dark:border-white/10`} aria-hidden="true">
      <svg viewBox="0 0 260 150" className="h-full w-full">
        <defs>
          <pattern id={`grid-${slugPart(title)}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M16 0H0V16" fill="none" stroke="#1e3a5f" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="260" height="150" fill={`url(#grid-${slugPart(title)})`} />
        <PreviewShape family={family} />
        <text x="14" y="132" fill="#e0f2fe" fontSize="12" fontWeight="900">{family}</text>
      </svg>
    </div>
  );
}

function PreviewShape({ family }: { family: VisualStrategyFamily }) {
  if (family === "Algebra tiles" || family === "Rearrangement" || family === "Dissection") {
    return <g><rect x="42" y="30" width="70" height="70" fill="#06b6d455" stroke="#67e8f9" strokeWidth="3" /><rect x="112" y="30" width="48" height="70" fill="#8b5cf655" stroke="#a78bfa" strokeWidth="3" /><rect x="42" y="100" width="118" height="28" fill="#f59e0b55" stroke="#fbbf24" strokeWidth="3" /><path d="M174 48l34 34-34 34" fill="none" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></g>;
  }
  if (family === "Coordinate derivation" || family === "Graph behaviour" || family === "Limit process" || family === "Optimization landscape") {
    return <g><path d="M30 112H230M58 24V132" stroke="#475569" strokeWidth="2" /><path d="M32 105C70 20 106 122 142 62S204 44 230 28" fill="none" stroke="#38bdf8" strokeWidth="5" /><line x1="126" y1="80" x2="202" y2="32" stroke="#fbbf24" strokeWidth="4" /><circle cx="126" cy="80" r="7" fill="#a78bfa" /></g>;
  }
  if (family === "Matrix transformation" || family === "Vector decomposition" || family === "Transformation") {
    return <g><path d="M42 116H218M70 24V132" stroke="#475569" strokeWidth="2" /><polygon points="82,105 162,78 204,104 120,130" fill="#06b6d433" stroke="#67e8f9" strokeWidth="3" /><line x1="70" y1="116" x2="176" y2="54" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" /><line x1="70" y1="116" x2="132" y2="86" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" /></g>;
  }
  if (family === "Probability simulation" || family === "Distribution morphing" || family === "Set partition") {
    return <g><circle cx="100" cy="76" r="42" fill="#06b6d444" stroke="#67e8f9" strokeWidth="3" /><circle cx="148" cy="76" r="42" fill="#8b5cf644" stroke="#a78bfa" strokeWidth="3" /><rect x="188" y="40" width="12" height="78" fill="#fbbf24" /><rect x="206" y="66" width="12" height="52" fill="#38bdf8" /><rect x="224" y="28" width="12" height="90" fill="#a78bfa" /></g>;
  }
  if (family === "Graph traversal" || family === "Network flow" || family === "Colouring challenge") {
    return <g>{[[70,48],[132,32],[190,62],[98,108],[172,112]].map(([x,y], i) => <circle key={i} cx={x} cy={y} r="13" fill={i % 2 ? "#8b5cf6" : "#06b6d4"} stroke="#e0f2fe" strokeWidth="3" />)}<path d="M70 48L132 32L190 62L172 112L98 108L70 48M132 32L98 108M190 62L98 108" fill="none" stroke="#fbbf24" strokeWidth="3" /></g>;
  }
  return <g><circle cx="130" cy="75" r="48" fill="#06b6d422" stroke="#67e8f9" strokeWidth="3" /><path d="M130 75L188 75M130 75L164 38" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" /><path d="M154 75A24 24 0 0 0 147 55" fill="none" stroke="#a78bfa" strokeWidth="5" /></g>;
}

function CompactProofLink({ record, onOpen }: { record: TheoremVisualProofRecord; onOpen: (route: string) => void }) {
  return (
    <Link to={record.route} onClick={() => onOpen(record.route)} className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50/50 dark:border-white/10 dark:bg-slate-950/50 dark:hover:bg-cyan-300/10">
      <span className="block text-sm font-black leading-tight text-slate-900 dark:text-white">{record.theoremName}</span>
      <span className="mt-1 block text-xs font-bold text-slate-500 dark:text-slate-300">{record.categoryName} - {record.mathematicalLevel}</span>
    </Link>
  );
}

function SidePanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/92 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
      <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {icon}
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptySearchState({ onReset }: { onReset: () => void }) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white/80 p-8 text-center dark:border-white/15 dark:bg-white/[0.05]">
      <Search className="mx-auto h-8 w-8 text-slate-400" />
      <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">No matching visual proofs</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">Try a theorem name, formula keyword, category, or reset the filters.</p>
      <button type="button" onClick={onReset} className="action-primary mx-auto mt-4 rounded-xl">Reset filters</button>
    </section>
  );
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (value: ViewMode) => void }) {
  return (
    <div className="inline-grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-950/50" aria-label="View mode">
      <button type="button" onClick={() => onChange("grid")} className={`grid h-9 w-10 place-items-center rounded-md ${value === "grid" ? "bg-cyan-600 text-white" : "text-slate-500"}`} aria-label="Grid view">
        <Grid3X3 className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => onChange("list")} className={`grid h-9 w-10 place-items-center rounded-md ${value === "list" ? "bg-cyan-600 text-white" : "text-slate-500"}`} aria-label="List view">
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </select>
    </label>
  );
}

function HeroStat({ label, value, good }: { label: string; value: number | string; good?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
      <p className="flex items-center gap-2 text-3xl font-black text-slate-950 dark:text-white">
        {value}
        {good ? <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" /> : null}
      </p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{label}</p>
    </div>
  );
}

function hasActiveFilter(query: string, category: string, level: string, type: string) {
  return Boolean(query.trim()) || category !== allValue || level !== "all" || type !== "all";
}

function levelWeight(level: TheoremProofLevel) {
  return level === "Foundation" ? 0 : level === "Intermediate" ? 1 : 2;
}

function slugPart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 18);
}
