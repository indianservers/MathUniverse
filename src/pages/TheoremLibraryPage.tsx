import { Archive, Bookmark, BookmarkCheck, BookOpen, BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, Eye, GraduationCap, Lightbulb, Link2, ListFilter, Maximize2, Play, RotateCcw, Search, Sigma, SlidersHorizontal, Sparkles, Target, TriangleAlert } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { InlineMathText } from "../components/ui/MathExpression";
import { formulaCategories, type FormulaCategory, type FormulaLibraryItem } from "../data/formulaLibrary";
import { theoremCategories, theoremCount, type TheoremCategory, type TheoremLibraryItem, type TheoremProofStep } from "../data/theoremLibrary";
import { getCuratedTheoremLearningLinks } from "../proof-explanations/proofLearningLinks";
import { getTheoremVisualProofRecord } from "../visual-proofs/data/theoremVisualProofInventory";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";

type TheoremSheetRow = TheoremLibraryItem & {
  category: TheoremCategory;
  key: string;
};

type FormulaMatch = FormulaLibraryItem & {
  category: FormulaCategory;
  route: string;
};

type VisualProofMatch = {
  title: string;
  route: string;
  categorySlug: string;
};

type RelatedLearningLinks = {
  formulas: FormulaMatch[];
  visualProofs: VisualProofMatch[];
  theorems: Array<TheoremLibraryItem & { category: TheoremCategory; route: string }>;
};

export default function TheoremLibraryPage() {
  const { categorySlug, theoremSlug } = useParams();

  const categoriesById = useMemo(() => new Map(theoremCategories.map((category) => [category.id, category])), []);
  const activeCategory = categorySlug ? categoriesById.get(categorySlug) : undefined;
  const activeTheorem = useMemo(() => {
    if (!categorySlug || !theoremSlug) return undefined;
    return theoremCategories
      .find((category) => category.id === categorySlug)
      ?.theorems.find((theoremItem) => theoremItem.slug === theoremSlug);
  }, [categorySlug, theoremSlug]);

  const pageTitle = activeTheorem?.title ?? activeCategory?.title ?? "Theorem Library";
  const pageDescription =
    activeTheorem?.statement ??
    activeCategory?.description ??
    "A compact theorem library with 12 major categories, 200+ theorem cards, proof-ready routes, reference pages, and connected visual learning links.";
  const unknownCategory = Boolean(categorySlug && !activeCategory);

  return (
    <main className="theorem-page-shell min-h-screen bg-[radial-gradient(circle_at_88%_0%,rgba(196,181,253,.28),transparent_34%),linear-gradient(135deg,#f8fdff_0%,#f5f8ff_46%,#fbf7ff_100%)] px-3 py-3 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-6">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-3">
        {activeTheorem && activeCategory ? (
          <>
            <header className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                    <BookOpenCheck className="h-4 w-4" />
                    <Link className="hover:text-cyan-500" to="/theorems">All theorems</Link>
                    <span className="text-slate-400">/ {activeCategory.title}</span>
                    <span className="text-slate-400">/ {activeTheorem.title}</span>
                  </div>
                  <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950 dark:text-white md:text-3xl">{pageTitle}</h1>
                  <p className="mt-1 max-w-4xl text-sm leading-5 text-slate-600 dark:text-slate-300">{pageDescription}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[340px]">
                  <StatPill label="Category" value={activeCategory.theorems.length} />
                  <StatPill label="Theorems" value={theoremCount} />
                  <StatPill label="Visual Proofs" value={visualProofsIndex.filter((proof) => proof.status === "available").length} />
                </div>
              </div>
            </header>
            <TheoremDetail theorem={activeTheorem} category={activeCategory} />
          </>
        ) : (
          <TheoremDesignStudio initialCategoryId={activeCategory?.id} unknownCategory={unknownCategory ? categorySlug : undefined} />
        )}
      </section>
    </main>
  );
}

type TheoremStudioMode = "discover" | "visual-proofs" | "proof-builder" | "practice" | "collections";
type StudioTool = "visual" | "steps" | "prerequisites" | "uses" | "practice";

const theoremStudioModes: Array<{ id: TheoremStudioMode; label: string; icon: ReactNode }> = [
  { id: "discover", label: "Discover", icon: <Sparkles className="h-4 w-4" /> },
  { id: "visual-proofs", label: "Visual Proofs", icon: <Eye className="h-4 w-4" /> },
  { id: "proof-builder", label: "Proof Builder", icon: <SlidersHorizontal className="h-4 w-4" /> },
  { id: "practice", label: "Practice", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "collections", label: "Collections", icon: <Archive className="h-4 w-4" /> },
];

function TheoremDesignStudio({ initialCategoryId, unknownCategory }: { initialCategoryId?: string; unknownCategory?: string }) {
  const allRows = useMemo(() => theoremCategories.flatMap((category) => category.theorems.map((theorem) => ({ ...theorem, category, key: `${category.id}-${theorem.slug}` }))), []);
  const initialCategory = initialCategoryId && theoremCategories.some((category) => category.id === initialCategoryId) ? initialCategoryId : "geometry";
  const [mode, setMode] = useState<TheoremStudioMode>("discover");
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryId ?? "all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [proofTypeFilter, setProofTypeFilter] = useState("all");
  const [activeStep, setActiveStep] = useState(0);
  const [activeTool, setActiveTool] = useState<StudioTool>("visual");
  const [selectedTheoremKey, setSelectedTheoremKey] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<string[]>(() => readStoredStringList("theorem-studio-saved"));
  const [exploredKeys, setExploredKeys] = useState<string[]>(() => readStoredStringList("theorem-studio-explored"));

  const selectedCategory = theoremCategories.find((category) => category.id === selectedCategoryId) ?? theoremCategories[0];
  const featuredRow = useMemo(() => {
    const selected = selectedTheoremKey ? allRows.find((row) => row.key === selectedTheoremKey) : undefined;
    if (selected && selected.category.id === selectedCategory.id) return selected;
    const pythagorean = selectedCategory.theorems.find((theorem) => theorem.title.toLowerCase().includes("pythagorean"));
    const theorem = pythagorean ?? selectedCategory.theorems.find((item) => item.proofStatus === "visual-ready" || item.proofStatus === "draft-ready") ?? selectedCategory.theorems[0];
    return { ...theorem, category: selectedCategory, key: `${selectedCategory.id}-${theorem.slug}` };
  }, [allRows, selectedCategory, selectedTheoremKey]);
  const proofSteps = getStudioProofSteps(featuredRow);
  const currentStep = proofSteps[Math.min(activeStep, proofSteps.length - 1)];
  const related = useMemo(() => getRelatedLearningLinks(featuredRow, featuredRow.category), [featuredRow]);

  const levelOptions = useMemo(() => uniqueValues(allRows.map((row) => studioDifficulty(row))), [allRows]);
  const proofTypeOptions = useMemo(() => uniqueValues(allRows.map((row) => statusLabel(row.proofStatus))), [allRows]);
  const searchRows = useMemo(() => filterTheoremRows(allRows, query, categoryFilter, levelFilter, proofTypeFilter), [allRows, categoryFilter, levelFilter, proofTypeFilter, query]);
  const exploredValidCount = exploredKeys.filter((key) => allRows.some((row) => row.key === key)).length;
  const exploredPercent = theoremCount ? Math.round(exploredValidCount / theoremCount * 100) : 0;
  const hasActiveFilters = Boolean(query.trim()) || categoryFilter !== "all" || levelFilter !== "all" || proofTypeFilter !== "all";
  const recommendations = useMemo(() => {
    const priority = ["geometry", "calculus-analysis", "probability-statistics", selectedCategory.id];
    return allRows
      .filter((row) => row.key !== featuredRow.key)
      .sort((a, b) => priority.indexOf(b.category.id) - priority.indexOf(a.category.id))
      .slice(0, 3);
  }, [allRows, featuredRow.key, selectedCategory.id]);

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCategoryFilter(categoryId);
    setSelectedTheoremKey(null);
    setActiveStep(0);
  };
  const toggleSaved = (key: string) => {
    setSavedKeys((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      writeStoredStringList("theorem-studio-saved", next);
      return next;
    });
  };
  const markExplored = (key: string) => {
    setExploredKeys((current) => {
      if (current.includes(key)) return current;
      const next = [...current, key];
      writeStoredStringList("theorem-studio-explored", next);
      return next;
    });
  };
  const clearFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setLevelFilter("all");
    setProofTypeFilter("all");
  };
  const openRowInStudio = (row: TheoremSheetRow) => {
    setSelectedCategoryId(row.category.id);
    setCategoryFilter(row.category.id);
    setSelectedTheoremKey(row.key);
    setActiveStep(0);
    setMode("discover");
    markExplored(row.key);
  };

  return (
    <div className="theorem-design-studio grid gap-3">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700">
            <Sparkles className="h-4 w-4" />
            Theorem Design Studio
          </p>
          <h1 className="mt-2 text-4xl font-black leading-none tracking-normal text-slate-950">Explore. Prove. Understand.</h1>
          <p className="mt-2 text-base font-semibold text-slate-600">Build intuition through interactive diagrams and step-by-step proofs.</p>
          {unknownCategory ? <p className="mt-2 w-fit rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">No theorem category named "{unknownCategory}" was found, so the studio is showing the complete theorem library.</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
          <StudioStat icon={<BookOpen className="h-5 w-5" />} value={theoremCount} label="Theorems" />
          <StudioStat icon={<Eye className="h-5 w-5" />} value={visualProofsIndex.filter((proof) => proof.status === "available").length} label="Visual Proofs" />
          <button type="button" onClick={() => setMode("collections")} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700">
            <Bookmark className="mr-2 inline h-5 w-5" />
            Saved
          </button>
          <button type="button" onClick={() => setMode("practice")} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700">
            <Target className="mr-2 inline h-5 w-5" />
            My Progress
          </button>
        </div>
      </header>

      <section className="min-h-0 overflow-visible rounded-xl border border-slate-200 bg-white/96 shadow-sm">
        <nav className="grid border-b border-slate-200 md:grid-cols-5" aria-label="Theorem studio modes">
          {theoremStudioModes.map((item) => (
            <button key={item.id} type="button" onClick={() => setMode(item.id)} className={`flex h-12 items-center justify-center gap-2 border-b-2 text-sm font-black transition ${mode === item.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="grid gap-3 border-b border-slate-200 p-3 xl:grid-cols-[minmax(0,1fr)_135px_135px_150px_48px]">
          <label className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <span className="sr-only">Search theorem, concept, or prerequisite</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }} placeholder="Search theorem, concept, or prerequisite..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
          </label>
          <StudioSelect label="Category" value={categoryFilter} onChange={(value) => { setCategoryFilter(value); if (value !== "all") setSelectedCategoryId(value); }}>
            <option value="all">Category</option>
            {theoremCategories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
          </StudioSelect>
          <StudioSelect label="Level" value={levelFilter} onChange={setLevelFilter}>
            <option value="all">Level</option>
            {levelOptions.map((level) => <option key={level} value={level}>{level}</option>)}
          </StudioSelect>
          <StudioSelect label="Proof Type" value={proofTypeFilter} onChange={setProofTypeFilter}>
            <option value="all">Proof Type</option>
            {proofTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </StudioSelect>
          <button type="button" onClick={hasActiveFilters ? clearFilters : () => setMode("collections")} className={`grid h-10 place-items-center rounded-lg border text-slate-600 transition ${hasActiveFilters ? "border-cyan-300 bg-cyan-50 text-cyan-700" : "border-slate-200 hover:border-cyan-300 hover:text-cyan-700"}`} title={hasActiveFilters ? "Clear filters" : "More filters"} aria-label={hasActiveFilters ? "Clear filters" : "More filters"}>
            {hasActiveFilters ? <RotateCcw className="h-4 w-4" /> : <ListFilter className="h-4 w-4" />}
          </button>
        </div>

        <div className="min-h-0 p-3">
          {mode === "discover" ? (
            <DiscoverStudioContent
              selectedCategory={selectedCategory}
              exploredPercent={exploredPercent}
              exploredCount={exploredValidCount}
              searchRows={searchRows}
              onCategory={selectCategory}
              onExplore={() => markExplored(featuredRow.key)}
              onOpenRow={openRowInStudio}
            />
          ) : mode === "visual-proofs" ? (
            <StudioTheoremList title="Visual Proofs" rows={searchRows.filter((row) => row.proofStatus === "visual-ready" || row.proofSteps?.length)} empty="No visual proof matches these filters." onOpen={openRowInStudio} />
          ) : mode === "proof-builder" ? (
            <ProofBuilderStudio theorem={featuredRow} steps={proofSteps} activeStep={activeStep} onStep={setActiveStep} />
          ) : mode === "practice" ? (
            <PracticeStudio rows={searchRows.slice(0, 8)} featured={featuredRow} exploredCount={exploredValidCount} total={theoremCount} onOpen={openRowInStudio} />
          ) : (
            <CollectionsStudio rows={searchRows} savedRows={allRows.filter((row) => savedKeys.includes(row.key))} onOpen={openRowInStudio} />
          )}
        </div>
      </section>

      <section className="min-h-0">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-blue-700"><Sparkles className="h-4 w-4" />Continue Exploring</p>
          <button type="button" onClick={() => setMode("collections")} className="text-sm font-black text-blue-700 hover:text-cyan-700">View all theorems -&gt;</button>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {recommendations.map((row, index) => <RecommendationCard key={row.key} row={row} index={index} onOpen={() => openRowInStudio(row)} />)}
        </div>
      </section>
    </div>
  );
}

function DiscoverStudioContent({
  selectedCategory,
  exploredPercent,
  exploredCount,
  searchRows,
  onCategory,
  onExplore,
  onOpenRow,
}: {
  selectedCategory: TheoremCategory;
  exploredPercent: number;
  exploredCount: number;
  searchRows: TheoremSheetRow[];
  onCategory: (categoryId: string) => void;
  onExplore: () => void;
  onOpenRow: (row: TheoremSheetRow) => void;
}) {
  const categoryRows = searchRows.filter((row) => row.category.id === selectedCategory.id);
  const visibleCategoryRows = categoryRows.length
    ? categoryRows
    : selectedCategory.theorems.map((theorem) => ({ ...theorem, category: selectedCategory, key: `${selectedCategory.id}-${theorem.slug}` }));

  return (
    <div className="grid min-h-0 gap-3 xl:grid-cols-[250px_minmax(0,1fr)_310px]">
      <aside className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Theorem Map</p>
          <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-200 text-xs font-black text-slate-400">i</span>
        </div>
        <div className="max-h-[360px] overflow-y-auto pr-1">
          {theoremCategories.map((category, index) => (
            <button key={category.id} type="button" onClick={() => onCategory(category.id)} className={`mb-1 grid w-full grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-2 py-2 text-left transition ${selectedCategory.id === category.id ? "border-cyan-300 bg-cyan-50 text-slate-950" : "border-transparent hover:border-slate-200 hover:bg-slate-50"}`}>
              <span className="grid h-8 w-8 place-items-center rounded-lg text-sm font-black text-white" style={{ background: category.accent }}>{categoryIconText(category.title, index)}</span>
              <span className="truncate text-sm font-black">{category.title}</span>
              <span className="text-sm font-black text-slate-500">{category.theorems.length}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 border-t border-slate-200 pt-3">
          <div className="grid h-14 w-14 place-items-center rounded-full text-sm font-black text-slate-950" style={{ background: `conic-gradient(#06b6d4 ${exploredPercent * 3.6}deg,#e2e8f0 0deg)` }}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white">{exploredPercent}%</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">Explored</p>
            <p className="text-xs font-bold text-slate-500">{exploredCount} / {theoremCount} theorems</p>
          </div>
        </div>
      </aside>

      <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><BookOpenCheck className="h-4 w-4" />Theorems in this category</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black leading-tight text-slate-950">{selectedCategory.title}</h2>
              <span className="rounded-md bg-cyan-600 px-2 py-1 text-[10px] font-black text-white">{visibleCategoryRows.length} shown</span>
              <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-700">{selectedCategory.theorems.length} total</span>
            </div>
            <p className="mt-1 max-w-3xl text-sm font-semibold leading-5 text-slate-600">{selectedCategory.description}</p>
          </div>
        </div>
        <div className="max-h-[560px] overflow-y-auto pr-1">
          <div className="grid gap-2 lg:grid-cols-2">
            {visibleCategoryRows.map((row) => (
              <Link
                key={row.key}
                to={`/theorems/${row.category.id}/${row.slug}`}
                onClick={() => {
                  onOpenRow(row);
                  onExplore();
                }}
                className="group grid min-h-[132px] grid-cols-[86px_minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
              >
                <TheoremMiniThumbnail row={row} />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${statusTone(row.proofStatus)}`}>{statusLabel(row.proofStatus)}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">{studioDifficulty(row)}</span>
                  </span>
                  <strong className="mt-2 line-clamp-2 block text-lg font-black leading-tight text-slate-950 group-hover:text-cyan-800">{row.title}</strong>
                  <small className="mt-1 line-clamp-2 block text-sm font-semibold leading-5 text-slate-600"><TheoremStatement value={row.statement} /></small>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-cyan-700">Open full theorem page <ChevronRight className="h-3.5 w-3.5" /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <aside className="overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Category Guide</p>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3">
          <p className="text-lg font-black text-slate-950">{selectedCategory.title}</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">{selectedCategory.description}</p>
        </div>
        <div className="mt-3 grid gap-2">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">How selection works</p>
            <p className="mt-1 text-sm font-bold leading-5 text-slate-700">Click any theorem card in the middle list to open its full theorem page with statement, examples, visual model, proof steps, and related learning links.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Shown now</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{visibleCategoryRows.length}</p>
            <p className="text-xs font-bold text-slate-500">matching theorem pages</p>
          </div>
          <Link to={`/theorems/${visibleCategoryRows[0]?.category.id ?? selectedCategory.id}/${visibleCategoryRows[0]?.slug ?? selectedCategory.theorems[0]?.slug}`} onClick={onExplore} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 text-sm font-black text-white transition hover:bg-cyan-700">
            Open first theorem <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </div>
  );
}

const studioToolItems: Array<{ id: StudioTool; label: string; caption: string; icon: ReactNode }> = [
  { id: "visual", label: "Visual Proof", caption: "Interactive diagrams", icon: <Eye className="h-5 w-5 text-cyan-600" /> },
  { id: "steps", label: "Proof Steps", caption: "Step-by-step breakdown", icon: <ListFilter className="h-5 w-5 text-slate-500" /> },
  { id: "prerequisites", label: "Prerequisites", caption: "What you should know", icon: <BookOpen className="h-5 w-5 text-slate-500" /> },
  { id: "uses", label: "Real-world Uses", caption: "Applications and examples", icon: <Target className="h-5 w-5 text-slate-500" /> },
  { id: "practice", label: "Practice", caption: "Test your understanding", icon: <GraduationCap className="h-5 w-5 text-slate-500" /> },
];

function StudioToolDetail({ tool, theorem, step, related, searchRows, onOpenRow }: { tool: StudioTool; theorem: TheoremSheetRow; step: TheoremProofStep; related: RelatedLearningLinks; searchRows: TheoremSheetRow[]; onOpenRow: (row: TheoremSheetRow) => void }) {
  if (tool === "steps") {
    return <div className="mt-3 rounded-lg bg-slate-50 p-3"><p className="text-sm font-black text-slate-900">{step.title}</p><p className="mt-1 text-xs font-semibold leading-5 text-slate-600"><InlineMathText value={step.explanation} /></p></div>;
  }
  if (tool === "prerequisites") {
    return <div className="mt-3 flex flex-wrap gap-2">{(theorem.prerequisites.length ? theorem.prerequisites : ["Core definitions"]).map((item) => <button key={item} type="button" onClick={() => onOpenRow(searchRows.find((row) => theoremSearchText(row).toLowerCase().includes(item.toLowerCase())) ?? theorem)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-black text-slate-600 hover:border-cyan-300 hover:text-cyan-700">{item}</button>)}</div>;
  }
  if (tool === "uses") {
    return <div className="mt-3 grid gap-2">{theorem.examples.slice(0, 2).map((example) => <div key={example.title} className="rounded-lg bg-slate-50 p-2"><p className="text-xs font-black text-slate-800">{example.title}</p><p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-600">{example.takeaway}</p></div>)}</div>;
  }
  if (tool === "practice") {
    return <div className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50 p-3"><p className="text-xs font-black text-cyan-800">Quick check</p><p className="mt-1 text-xs font-semibold leading-5 text-slate-700">Before applying this theorem, name one condition that must be true.</p><details className="mt-2 text-xs font-bold text-cyan-800"><summary>Show hint</summary>Start from the prerequisites: {(theorem.prerequisites[0] ?? theorem.subtopic).toLowerCase()}.</details></div>;
  }
  return <div className="mt-3 rounded-lg bg-slate-50 p-3"><p className="text-xs font-black uppercase tracking-wide text-slate-500">Current diagram state</p><p className="mt-1 text-sm font-bold leading-5 text-slate-700">{step.representation}</p><div className="mt-3 flex flex-wrap gap-1.5">{related.theorems.slice(0, 3).map((item) => <Link key={item.route} to={item.route} className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-600">{item.title}</Link>)}</div></div>;
}

function PythagoreanStudioCanvas({ activeStep, activeTitle }: { activeStep: number; activeTitle: string }) {
  const showB = activeStep >= 1;
  const showC = activeStep >= 2;
  const showFormula = activeStep >= 3;
  return (
    <svg viewBox="0 0 900 430" role="img" aria-label="Pythagorean theorem visual proof canvas" className="h-[250px] w-full bg-slate-950">
      <defs>
        <pattern id="studio-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#1e3a5f" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="900" height="430" fill="#071832" />
      <rect width="900" height="430" fill="url(#studio-grid)" opacity=".75" />
      <text x="28" y="36" fill="#e0f2fe" fontSize="18" fontWeight="900">{activeTitle}</text>
      <polygon points="210,305 455,305 455,135" fill="#0e749055" stroke="#67e8f9" strokeWidth="5" />
      <rect x="210" y="155" width="245" height="150" fill="#0ea5e933" stroke="#67e8f9" strokeWidth="4" />
      {showB ? <rect x="455" y="305" width="170" height="120" fill="#7c3aed44" stroke="#a78bfa" strokeWidth="4" /> : null}
      {showC ? <polygon points="455,135 615,225 525,385 365,295" fill="#f59e0b33" stroke="#fbbf24" strokeWidth="5" /> : null}
      <path d="M455 305h-28v-28" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <circle cx="210" cy="305" r="7" fill="#67e8f9" />
      <circle cx="455" cy="305" r="7" fill="#a78bfa" />
      <circle cx="455" cy="135" r="7" fill="#fbbf24" />
      <text x="323" y="289" fill="#67e8f9" fontSize="28" fontWeight="900">a</text>
      <text x="470" y="227" fill="#a78bfa" fontSize="28" fontWeight="900">b</text>
      <text x="380" y="214" fill="#fbbf24" fontSize="28" fontWeight="900">c</text>
      <text x="300" y="238" fill="#67e8f9" fontSize="30" fontWeight="900">a^2</text>
      {showB ? <text x="520" y="374" fill="#c4b5fd" fontSize="30" fontWeight="900">b^2</text> : null}
      {showC ? <text x="505" y="270" fill="#fbbf24" fontSize="30" fontWeight="900">c^2</text> : null}
      {showFormula ? <text x="600" y="337" fill="#f8fafc" fontSize="36" fontWeight="900">a^2 + b^2 = c^2</text> : null}
      <g transform="translate(794 92)">
        <rect width="42" height="150" rx="16" fill="#0f2746" stroke="#34547c" />
        <text x="21" y="32" fill="#e0f2fe" fontSize="22" fontWeight="900" textAnchor="middle">+</text>
        <line x1="21" x2="21" y1="52" y2="112" stroke="#94a3b8" strokeWidth="4" />
        <circle cx="21" cy="86" r="8" fill="#f8fafc" />
        <text x="21" y="136" fill="#e0f2fe" fontSize="24" fontWeight="900" textAnchor="middle">-</text>
      </g>
    </svg>
  );
}

function StudioTheoremList({ title, rows, empty, onOpen }: { title: string; rows: TheoremSheetRow[]; empty: string; onOpen: (row: TheoremSheetRow) => void }) {
  return (
    <section className="min-h-[480px]">
      <div className="mb-2 flex items-center justify-between"><h2 className="text-lg font-black text-slate-950">{title}</h2><span className="text-sm font-black text-slate-500">{rows.length} results</span></div>
      {rows.length ? <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">{rows.map((row) => <CompactTheoremResult key={row.key} row={row} onOpen={() => onOpen(row)} />)}</div> : <EmptyStudioState text={empty} />}
    </section>
  );
}

function ProofBuilderStudio({ theorem, steps, activeStep, onStep }: { theorem: TheoremSheetRow; steps: TheoremProofStep[]; activeStep: number; onStep: (step: number) => void }) {
  const builderTools = ["Given", "Diagram", "Relation", "Conclusion", "Annotation"];
  const [selectedTool, setSelectedTool] = useState(builderTools[0]);
  const selectTool = (item: string, index: number) => {
    setSelectedTool(item);
    onStep(Math.min(index, steps.length - 1));
  };
  return (
    <div className="grid min-h-[500px] gap-3 xl:grid-cols-[220px_minmax(0,1fr)_280px]">
      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Elements</p>
        {builderTools.map((item, index) => (
          <button key={item} type="button" onClick={() => selectTool(item, index)} className={`mt-2 block w-full rounded-lg border px-3 py-2 text-left text-sm font-black transition ${selectedTool === item ? "border-cyan-400 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-700"}`}>{item}</button>
        ))}
        <div className="mt-3 rounded-lg border border-cyan-200 bg-white p-3">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Active layer</p>
          <p className="mt-1 text-sm font-bold leading-5 text-slate-700">{selectedTool} is selected. The canvas and proof timeline are focused on step {activeStep + 1}.</p>
        </div>
      </aside>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">{theorem.title.toLowerCase().includes("pythagorean") ? <PythagoreanStudioCanvas activeStep={activeStep} activeTitle={steps[activeStep]?.title ?? theorem.title} /> : <TheoremVisualCanvas category={theorem.category} theorem={theorem} activeStep={activeStep} activeTitle={steps[activeStep]?.title ?? theorem.title} totalSteps={steps.length} />}</div>
      <aside className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs font-black uppercase tracking-wide text-slate-500">Proof-step timeline</p>{steps.map((step, index) => <button key={`${step.title}-${index}`} type="button" onClick={() => onStep(index)} className={`mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-black ${activeStep === index ? "bg-cyan-600 text-white" : "bg-slate-50 text-slate-700"}`}>{index + 1}. {step.title}</button>)}<button type="button" onClick={() => onStep(0)} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700"><RotateCcw className="mr-2 inline h-4 w-4" />Reset</button></aside>
    </div>
  );
}

function PracticeStudio({ rows, featured, exploredCount, total, onOpen }: { rows: TheoremSheetRow[]; featured: TheoremSheetRow; exploredCount: number; total: number; onOpen: (row: TheoremSheetRow) => void }) {
  return (
    <div className="grid min-h-[500px] gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-cyan-700">Practice Focus</p><h2 className="mt-1 text-2xl font-black text-slate-950">{featured.title}</h2><p className="mt-2 text-base font-semibold text-slate-600"><TheoremStatement value={featured.statement} /></p><div className="mt-4 rounded-xl bg-cyan-50 p-4"><p className="text-sm font-black text-cyan-900">Question</p><p className="mt-1 font-semibold text-slate-700">Which hypothesis must be checked before using this theorem?</p><details className="mt-3 text-sm font-bold text-cyan-900"><summary>Hint and solution</summary>{featured.prerequisites[0] ?? "The setup conditions in the statement"} must be verified before applying the conclusion.</details></div></section>
      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-black uppercase tracking-wide text-slate-500">My Progress</p><div className="mt-3 rounded-xl bg-white p-4 text-center"><p className="text-3xl font-black text-slate-950">{total ? Math.round(exploredCount / total * 100) : 0}%</p><p className="text-sm font-bold text-slate-500">{exploredCount} of {total} explored</p></div><p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-500">Recommended practice</p>{rows.slice(0, 4).map((row) => <button key={row.key} type="button" onClick={() => onOpen(row)} className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-left text-sm font-black text-slate-700">{row.title}</button>)}</aside>
    </div>
  );
}

function CollectionsStudio({ rows, savedRows, onOpen }: { rows: TheoremSheetRow[]; savedRows: TheoremSheetRow[]; onOpen: (row: TheoremSheetRow) => void }) {
  return (
    <div className="grid min-h-[500px] gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-black uppercase tracking-wide text-slate-500">Saved Theorems</p>{savedRows.length ? savedRows.map((row) => <button key={row.key} type="button" onClick={() => onOpen(row)} className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-left text-sm font-black text-slate-700">{row.title}</button>) : <p className="mt-3 text-sm font-semibold text-slate-500">Saved theorems will appear here.</p>}</aside>
      <StudioTheoremList title="Complete Theorem Library" rows={rows} empty="No theorem matches these filters." onOpen={onOpen} />
    </div>
  );
}

function CompactTheoremResult({ row, onOpen }: { row: TheoremSheetRow; onOpen: () => void }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <TheoremMiniThumbnail row={row} />
      <p className="mt-3 text-xs font-black uppercase tracking-wide text-cyan-700">{row.category.title} - {studioDifficulty(row)}</p>
      <h3 className="mt-1 line-clamp-2 text-lg font-black leading-tight text-slate-950">{row.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-600"><TheoremStatement value={row.statement} /></p>
      <button type="button" onClick={onOpen} className="mt-3 rounded-lg border border-cyan-300 px-3 py-2 text-sm font-black text-cyan-700 hover:bg-cyan-50">Open</button>
    </article>
  );
}

function RecommendationCard({ row, index, onOpen }: { row: TheoremSheetRow; index: number; onOpen: () => void }) {
  const progress = [60, 45, 30][index % 3];
  return (
    <article className="grid min-h-[112px] grid-cols-[115px_minmax(0,1fr)_78px] items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <TheoremMiniThumbnail row={row} />
      <div className="min-w-0">
        <h3 className="truncate text-lg font-black text-slate-950">{row.title}</h3>
        <p className="mt-1 truncate text-sm font-semibold text-slate-500">{row.category.title} - {studioDifficulty(row)}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-cyan-600" style={{ width: `${progress}%` }} /></div>
        <p className="mt-1 text-xs font-black text-cyan-700">{progress}% explored</p>
      </div>
      <button type="button" onClick={onOpen} className="h-10 rounded-lg border border-cyan-300 text-sm font-black text-cyan-700 hover:bg-cyan-50">Open</button>
    </article>
  );
}

function TheoremMiniThumbnail({ row }: { row: TheoremSheetRow }) {
  if (row.category.id === "probability-statistics") return <svg viewBox="0 0 120 80" className="h-20 w-full rounded-lg bg-white"><path d="M10 40L48 20M10 40L48 60M48 20L100 10M48 20L100 32M48 60L100 50M48 60L100 72" stroke="#38bdf8" strokeWidth="2" /><circle cx="10" cy="40" r="4" fill="#0ea5e9" /><circle cx="48" cy="20" r="4" fill="#8b5cf6" /><circle cx="48" cy="60" r="4" fill="#8b5cf6" /></svg>;
  if (row.category.id === "calculus-analysis") return <svg viewBox="0 0 120 80" className="h-20 w-full rounded-lg bg-white"><path d="M10 62C25 30 40 50 55 32S85 22 108 14" fill="none" stroke="#2563eb" strokeWidth="3" /><path d="M20 62V48M32 62V38M44 62V42M56 62V35M68 62V31M80 62V26" stroke="#93c5fd" strokeWidth="5" /><path d="M10 62H112M18 70V8" stroke="#0f172a" strokeWidth="1.5" /></svg>;
  return <svg viewBox="0 0 120 80" className="h-20 w-full rounded-lg bg-white"><circle cx="54" cy="40" r="30" fill="none" stroke="#6366f1" strokeWidth="2" /><path d="M28 58L55 13L92 56Z" fill="#e0f2fe" stroke="#0891b2" strokeWidth="2" /><path d="M28 58L92 56M55 13L60 55" stroke="#6366f1" strokeWidth="1.5" /><circle cx="28" cy="58" r="3" fill="#0891b2" /><circle cx="55" cy="13" r="3" fill="#0891b2" /><circle cx="92" cy="56" r="3" fill="#0891b2" /></svg>;
}

function EmptyStudioState({ text }: { text: string }) {
  return <div className="grid min-h-[360px] place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><div><p className="text-lg font-black text-slate-900">No matches</p><p className="mt-1 text-sm font-semibold text-slate-500">{text}</p></div></div>;
}

function StudioStat({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center shadow-sm"><span className="inline-flex items-center gap-2 text-xl font-black text-slate-950">{icon}{value}</span><p className="text-xs font-bold text-slate-500">{label}</p></div>;
}

function StudioSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <label className="relative"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">{children}</select></label>;
}

function filterTheoremRows(rows: TheoremSheetRow[], query: string, category: string, level: string, proofType: string) {
  const normalized = query.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesQuery = !normalized || theoremSearchText(row).toLowerCase().includes(normalized);
    const matchesCategory = category === "all" || row.category.id === category;
    const matchesLevel = level === "all" || studioDifficulty(row) === level;
    const matchesProof = proofType === "all" || statusLabel(row.proofStatus) === proofType;
    return matchesQuery && matchesCategory && matchesLevel && matchesProof;
  });
}

function theoremSearchText(row: TheoremSheetRow) {
  return [row.title, row.statement, row.subtopic, row.purpose, row.detailedExplanation, row.whyItMatters, row.category.title, row.category.description, row.prerequisites.join(" "), row.examples.map((example) => `${example.title} ${example.scenario} ${example.takeaway}`).join(" "), row.proofSteps?.map((step) => `${step.title} ${step.explanation} ${step.representation}`).join(" ") ?? ""].join(" ");
}

function getStudioProofSteps(theorem: TheoremLibraryItem): TheoremProofStep[] {
  if (theorem.proofSteps?.length) return theorem.proofSteps.slice(0, 4);
  return [
    { title: "Construct", explanation: theorem.statement, representation: "Draw the setup and mark the theorem hypotheses." },
    { title: "Relate", explanation: theorem.purpose, representation: "Connect known objects to the key relation." },
    { title: "Compare", explanation: theorem.whyItMatters, representation: "Check the invariant or equality created by the theorem." },
    { title: "Conclude", explanation: theorem.proofIdea ?? theorem.proofPlan, representation: "State the reusable conclusion." },
  ];
}

function studioDifficulty(theorem: TheoremLibraryItem) {
  if (theorem.proofStatus === "visual-ready") return "Advanced";
  if (theorem.proofSteps && theorem.proofSteps.length >= 4) return "Intermediate";
  return "Foundation";
}

function formulaForTheorem(theorem: TheoremLibraryItem) {
  const title = theorem.title.toLowerCase();
  if (title.includes("pythagorean")) return "a^2 + b^2 = c^2";
  if (title.includes("bayes")) return "P(A|B)=P(B|A)P(A)/P(B)";
  if (title.includes("fundamental")) return "\\int_a^b f(x)dx=F(b)-F(a)";
  return theorem.statement;
}

function categoryIconText(title: string, index: number) {
  const named: Record<string, string> = { Algebra: "x^2", Geometry: "Tri", Trigonometry: "sin", "Number Theory": "#", "Graph Theory": "G" };
  return named[title] ?? title.slice(0, 1).toUpperCase() + String((index % 3) + 1);
}

function uniqueValues(values: string[]) {
  return [...new Set(values)].filter(Boolean);
}

function readStoredStringList(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStoredStringList(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function TheoremCategoryGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {theoremCategories.map((category) => (
        <article
          key={category.id}
          className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-300/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link className="text-xl font-black leading-tight text-slate-950 hover:text-cyan-700 dark:text-white dark:hover:text-cyan-100" to={`/theorems/${category.id}`}>
                {category.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-slate-600 dark:text-slate-300">{category.description}</p>
            </div>
            <span className="shrink-0 rounded-md bg-cyan-50 px-3 py-1.5 text-sm font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">
              {category.theorems.length}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...new Set(category.theorems.map((theorem) => theorem.subtopic))].slice(0, 6).map((subtopic) => (
              <span key={subtopic} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-black text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                {subtopic}
              </span>
            ))}
          </div>
          <Link className="mt-3 inline-flex rounded-md bg-cyan-600 px-3 py-2 text-sm font-black text-white transition hover:bg-cyan-700" to={`/theorems/${category.id}`}>
            Open theorem sheet
          </Link>
        </article>
      ))}
    </div>
  );
}

function TheoremCard({ row }: { row: TheoremSheetRow }) {
  const related = useMemo(() => getRelatedLearningLinks(row, row.category), [row]);

  return (
    <article className="flex min-h-[245px] flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-300/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{row.category.title}</p>
          <h2 className="mt-1 line-clamp-2 text-xl font-black leading-tight text-slate-950 dark:text-white">{row.title}</h2>
        </div>
        <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${statusTone(row.proofStatus)}`}>
          {statusLabel(row.proofStatus)}
        </span>
      </div>
      <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-base font-bold leading-6 text-slate-800 dark:bg-white/5 dark:text-slate-100">
        <TheoremStatement value={row.statement} />
      </p>
      <p className="mt-3 text-base font-semibold leading-6 text-slate-600 dark:text-slate-300"><InlineMathText value={row.purpose} /></p>
      <div className="mt-auto pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{row.subtopic}</span>
          {row.prerequisites.slice(0, 2).map((prerequisite) => (
            <span key={prerequisite} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
              {prerequisite}
            </span>
          ))}
        </div>
        <Link className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-100" to={`/theorems/${row.category.id}/${row.slug}`}>
          {isReferenceTheorem(row) ? "Open reference page" : "Open proof draft"}
        </Link>
        <RelatedLinkStrip related={related} compact />
      </div>
    </article>
  );
}

function TheoremDetail({ theorem, category }: { theorem: TheoremLibraryItem; category: TheoremCategory }) {
  const related = useMemo(() => getRelatedLearningLinks(theorem, category), [category, theorem]);
  const proofRecord = useMemo(() => getTheoremVisualProofRecord(`/theorems/${category.id}/${theorem.slug}`), [category.id, theorem.slug]);
  const referencePage = isReferenceTheorem(theorem);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <Link className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-200" to={`/theorems/${category.id}`}>
        <ChevronLeft className="h-4 w-4" />
        Back to {category.title}
      </Link>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{category.title} / {theorem.subtopic}</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 dark:text-white">{theorem.title}</h2>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-white/5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Statement</p>
            <p className="mt-2 text-xl font-black leading-8 text-slate-900 dark:text-white">
              <TheoremStatement value={theorem.statement} mathClassName="text-[0.95em]" />
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <InfoPanel title="Purpose" text={theorem.purpose} />
            <InfoPanel title="Why It Matters" text={theorem.whyItMatters} />
            <InfoPanel title={referencePage ? "Reference Guide" : "Proof Draft"} text={theorem.proofPlan} />
          </div>
          {proofRecord ? <PhaseOneProofBriefing record={proofRecord} /> : null}
          <DetailedExplanationPanel theorem={theorem} />
          <TheoremExamplesPanel theorem={theorem} />
          <UniversalVisualProofPanel theorem={theorem} category={category} />
          <StepByStepProofPanel theorem={theorem} />
          <RelatedLearningPanel related={related} />
        </div>
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{referencePage ? "Reference Roadmap" : "Proof Roadmap"}</p>
          <ol className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            {theorem.proofSteps?.length ? (
              theorem.proofSteps.map((step, index) => (
                <li key={step.title} className="rounded-md bg-white p-2 dark:bg-slate-950/50">
                  {index + 1}. {step.title}
                </li>
              ))
            ) : (
              <>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">1. Read the theorem statement and prerequisites.</li>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">2. Check why the result matters.</li>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">3. Open connected formulas or visual proofs.</li>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">4. Use as a reference page until full proof steps are available.</li>
              </>
            )}
          </ol>
          <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Prerequisites</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(theorem.prerequisites.length ? theorem.prerequisites : ["Core definitions"]).map((prerequisite) => (
              <span key={prerequisite} className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-600 dark:bg-slate-950/50 dark:text-slate-200">
                {prerequisite}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function PhaseOneProofBriefing({ record }: { record: NonNullable<ReturnType<typeof getTheoremVisualProofRecord>> }) {
  const givens = record.theorem.prerequisites.length
    ? record.theorem.prerequisites
    : ["The objects named in the theorem statement satisfy the stated hypotheses."];

  return (
    <section className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-400/10" aria-label="Phase 1 visual proof briefing">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
            <BookOpenCheck className="h-4 w-4" />
            Visual Proof Architecture
          </p>
          <h3 className="mt-1 text-xl font-black leading-tight text-slate-950 dark:text-white">Given, Prove, and Proof Strategy</h3>
          <p className="mt-1 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
            This shared Phase 1 briefing keeps the proof honest before the theorem-specific renderer is expanded in later phases.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-cyan-700 dark:bg-slate-950/60 dark:text-cyan-100">{record.proofType}</span>
          <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-violet-700 dark:bg-slate-950/60 dark:text-violet-100">{record.mathematicalLevel}</span>
          <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-emerald-700 dark:bg-slate-950/60 dark:text-emerald-100">{record.existingStatus}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700 dark:text-blue-200">Given</p>
          <ul className="mt-2 grid gap-1.5 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">
            {givens.map((given) => (
              <li key={given}>- <InlineMathText value={given} /></li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Prove</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">
            <InlineMathText value={record.theorem.statement} />
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <ProofBriefCard title="Core idea" text={record.coreIdea} />
        <ProofBriefCard title="Visual metaphor" text={record.visualMetaphor} />
        <ProofBriefCard title="Learner interaction" text={record.interaction} />
        <ProofBriefCard title="Engine" text={record.engine} />
        <ProofBriefCard title="Mobile strategy" text={record.mobileStrategy} />
        <ProofBriefCard title="Verification and accessibility" text={`${record.verificationStatus} ${record.accessibility}`} />
      </div>
    </section>
  );
}

function ProofBriefCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200"><InlineMathText value={text} /></p>
    </div>
  );
}

function TheoremStatement({ value, mathClassName = "" }: { value: string; mathClassName?: string }) {
  return <InlineMathText value={value} mathClassName={mathClassName} />;
}

function StepByStepProofPanel({ theorem }: { theorem: TheoremLibraryItem }) {
  if (!theorem.proofSteps?.length) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/15 dark:bg-white/5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Step Proof Status</p>
        <p className="mt-2 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200">
          Reference page: this theorem currently provides the statement, prerequisites, purpose, and connected learning links. It is not marked as a complete step-by-step proof route.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Step-by-step proof</p>
          <p className="mt-2 text-base font-bold leading-6 text-slate-800 dark:text-slate-100"><InlineMathText value={theorem.proofIdea ?? ""} /></p>
        </div>
        <span className={`w-fit rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${statusTone(theorem.proofStatus)}`}>
          {statusLabel(theorem.proofStatus)}
        </span>
      </div>
      <ol className="mt-4 grid gap-3">
        {theorem.proofSteps.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-white bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan-600 text-sm font-black text-white">{index + 1}</span>
              <div className="min-w-0">
                <h3 className="text-lg font-black leading-tight text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-1 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200"><InlineMathText value={step.explanation} /></p>
                <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-bold leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  Visual cue: <InlineMathText value={step.representation} />
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {theorem.examMemory ? (
          <div className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Exam Memory
            </p>
            <p className="mt-2 text-base font-bold leading-6 text-slate-700 dark:text-slate-200"><InlineMathText value={theorem.examMemory} /></p>
          </div>
        ) : null}
        {theorem.commonMistakes?.length ? (
          <div className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-200">
              <TriangleAlert className="h-4 w-4" />
              Common Mistakes
            </p>
            <ul className="mt-2 grid gap-1.5 text-base font-bold leading-6 text-slate-700 dark:text-slate-200">
              {theorem.commonMistakes.map((mistake) => (
                <li key={mistake}>- <InlineMathText value={mistake} /></li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function UniversalVisualProofPanel({ theorem, category }: { theorem: TheoremLibraryItem; category: TheoremCategory }) {
  const steps = theorem.proofSteps?.length
    ? theorem.proofSteps
    : [
        { title: "Read the claim", explanation: theorem.statement, representation: "Separate the theorem into givens, conditions, and target result." },
        { title: "Check conditions", explanation: theorem.purpose, representation: "Prerequisites and hypotheses are checked before applying the theorem." },
        { title: "Apply result", explanation: theorem.whyItMatters, representation: "The conclusion is highlighted as the reusable theorem result." },
      ];
  const [activeStep, setActiveStep] = useState(0);
  const active = steps[Math.min(activeStep, steps.length - 1)];
  const progress = steps.length <= 1 ? 100 : (activeStep / (steps.length - 1)) * 100;

  const previous = () => setActiveStep((step) => Math.max(0, step - 1));
  const next = () => setActiveStep((step) => Math.min(steps.length - 1, step + 1));
  const reset = () => setActiveStep(0);

  return (
    <section className="mt-4 rounded-lg border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-300/20 dark:bg-violet-400/10" data-testid="theorem-universal-visual-proof">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">
            <Sparkles className="h-4 w-4" />
            Interactive Visual Proof
          </p>
          <h3 className="mt-1 text-xl font-black leading-tight text-slate-950 dark:text-white">{theorem.title}</h3>
          <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
            Step through the proof visually: setup, key relation, condition check, and conclusion are shown as connected proof states.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={previous} className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-white px-3 py-2 text-xs font-black text-violet-800 transition hover:bg-violet-100 disabled:opacity-50 dark:border-violet-300/20 dark:bg-slate-950/60 dark:text-violet-100" disabled={activeStep === 0}>
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-white px-3 py-2 text-xs font-black text-violet-800 transition hover:bg-violet-100 dark:border-violet-300/20 dark:bg-slate-950/60 dark:text-violet-100">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button type="button" onClick={next} className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-2 text-xs font-black text-white transition hover:bg-violet-700 disabled:opacity-50" disabled={activeStep === steps.length - 1}>
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-lg border border-white bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/60">
          <TheoremVisualCanvas category={category} theorem={theorem} activeStep={activeStep} totalSteps={steps.length} activeTitle={active.title} />
        </div>
        <aside className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Visual state {activeStep + 1} of {steps.length}</p>
          <h4 className="mt-2 text-lg font-black leading-tight text-slate-950 dark:text-white">{active.title}</h4>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200"><InlineMathText value={active.explanation} /></p>
          <p className="mt-3 rounded-md bg-violet-50 px-3 py-2 text-sm font-bold leading-5 text-violet-800 dark:bg-violet-300/10 dark:text-violet-100">
            Visual cue: <InlineMathText value={active.representation} />
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 grid gap-1.5">
            {steps.map((step, index) => (
              <button
                key={`${step.title}-${index}`}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`rounded-md px-2 py-1.5 text-left text-xs font-black transition ${index === activeStep ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-800 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-violet-300/15 dark:hover:text-violet-100"}`}
              >
                {index + 1}. {step.title}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function TheoremVisualCanvas({ activeStep, activeTitle, category, theorem, totalSteps }: { activeStep: number; activeTitle: string; category: TheoremCategory; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (title.includes("pythagorean")) {
    return <PythagoreanDetailVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "proportional-reasoning") {
    return <ProportionalTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "algebra") {
    return <AlgebraTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "coordinate-geometry") {
    return <CoordinateGeometryTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "trigonometry" || title.includes("sine") || title.includes("cosine") || title.includes("angle")) {
    return <TrigonometryTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "calculus-analysis" || category.id === "optimization-engineering") {
    return <CalculusTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "linear-algebra-vectors") {
    return <LinearAlgebraTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "complex-numbers") {
    return <ComplexTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "number-theory") {
    return <NumberTheoryTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "geometry" || theorem.subtopic.toLowerCase().includes("triangle") || theorem.title.toLowerCase().includes("angle")) {
    return <GeometryTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "graph-theory" || category.id === "discrete-logic") {
    return <NetworkTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  if (category.id === "probability-statistics") {
    return <ProbabilityTheoremVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  }
  return <GeneralTheoremVisual activeStep={activeStep} activeTitle={activeTitle} category={category} theorem={theorem} totalSteps={totalSteps} />;
}

function theoremVariant(theorem: TheoremLibraryItem, mod = 5) {
  return [...theorem.slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % mod;
}

function PythagoreanDetailVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <polygon points="210,305 490,305 490,105" fill="#0e749044" stroke="#67e8f9" strokeWidth="5" />
      <rect x="210" y="165" width="140" height="140" fill={activeStep >= 1 ? "#06b6d444" : "#33415555"} stroke="#67e8f9" strokeWidth="4" />
      <rect x="490" y="305" width="120" height="120" fill={activeStep >= 2 ? "#8b5cf644" : "#33415555"} stroke="#a78bfa" strokeWidth="4" />
      <polygon points="490,105 650,210 545,370 385,265" fill={activeStep >= 3 ? "#f59e0b44" : "#33415555"} stroke="#fbbf24" strokeWidth="5" />
      <path d="M490 305h-28v-28" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <text x="260" y="244" fill="#67e8f9" fontSize="30" fontWeight="900">a^2</text>
      <text x="528" y="378" fill="#c4b5fd" fontSize="28" fontWeight="900">b^2</text>
      <text x="503" y="250" fill="#fbbf24" fontSize="30" fontWeight="900">c^2</text>
      <text x="585" y="338" fill="#f8fafc" fontSize="34" fontWeight="900">a^2 + b^2 = c^2</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ProportionalTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (title.includes("cross multiplication")) return <CrossProductRatioVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (title.includes("representative fraction")) return <MapScaleRatioVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (title.includes("multi-term")) return <RatioShareVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (title.includes("pie")) return <PieAngleRatioVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (title.includes("inverse")) return <InverseProportionVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <DirectProportionVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function CrossProductRatioVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} equal cross-products model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <rect x="120" y="120" width="230" height="110" rx="12" fill="#06b6d433" stroke="#67e8f9" strokeWidth="4" />
      <rect x="550" y="120" width="230" height="110" rx="12" fill="#8b5cf633" stroke="#a78bfa" strokeWidth="4" />
      <text x="180" y="105" fill="#67e8f9" fontSize="28" fontWeight="900">a / b</text>
      <text x="610" y="105" fill="#c4b5fd" fontSize="28" fontWeight="900">c / d</text>
      <line x1="180" y1="120" x2="780" y2="230" stroke={activeStep >= 1 ? "#fbbf24" : "#475569"} strokeWidth="6" strokeLinecap="round" />
      <line x1="350" y1="230" x2="610" y2="120" stroke={activeStep >= 2 ? "#22c55e" : "#475569"} strokeWidth="6" strokeLinecap="round" />
      <text x="342" y="305" fill={activeStep >= 3 ? "#f8fafc" : "#94a3b8"} fontSize="34" fontWeight="900">a d = b c</text>
      <text x="276" y="350" fill="#e0f2fe" fontSize="20" fontWeight="900">same non-zero denominators clear both ratios</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function MapScaleRatioVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} map scale visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M120 135C210 85 288 170 360 112S508 158 595 96S710 116 790 76" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <path d="M126 252H770" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
      <path d="M126 252H308" stroke="#fbbf24" strokeWidth="18" strokeLinecap="round" />
      <path d="M126 315H770" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
      <path d="M126 315H770" stroke={activeStep >= 2 ? "#22c55e" : "#64748b"} strokeWidth="18" strokeLinecap="round" />
      <text x="130" y="230" fill="#f8fafc" fontSize="22" fontWeight="900">map distance</text>
      <text x="130" y="355" fill="#f8fafc" fontSize="22" fontWeight="900">actual distance after unit conversion</text>
      <text x="500" y="250" fill={activeStep >= 1 ? "#fbbf24" : "#94a3b8"} fontSize="26" fontWeight="900">same units first</text>
      <text x="500" y="315" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="26" fontWeight="900">RF = 1 : n</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function RatioShareVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const parts = [3, 2, 4];
  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b"];
  let x = 140;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} ratio share visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <rect x="140" y="154" width="620" height="70" rx="14" fill="#1e293b" stroke="#475569" strokeWidth="3" />
      {parts.map((part, index) => {
        const width = part * 62;
        const node = <g key={index}><rect x={x} y="154" width={width} height="70" fill={activeStep >= index + 1 ? colors[index] : "#334155"} opacity="0.78" /><text x={x + width / 2} y="198" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">{part} units</text></g>;
        x += width;
        return node;
      })}
      <text x="180" y="285" fill="#f8fafc" fontSize="28" fontWeight="900">one unit = total / (3 + 2 + 4)</text>
      <text x="240" y="332" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="26" fontWeight="900">each share = part / sum x whole</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function PieAngleRatioVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} pie angle visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <circle cx="410" cy="225" r="120" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
      <path d="M410 225 L410 105 A120 120 0 0 1 524 263 Z" fill="#06b6d4aa" stroke="#67e8f9" strokeWidth="3" />
      <path d="M410 225 L524 263 A120 120 0 0 1 297 286 Z" fill={activeStep >= 1 ? "#8b5cf6aa" : "#334155"} stroke="#c4b5fd" strokeWidth="3" />
      <path d="M410 225 L297 286 A120 120 0 0 1 410 105 Z" fill={activeStep >= 2 ? "#f59e0baa" : "#334155"} stroke="#fbbf24" strokeWidth="3" />
      <text x="580" y="178" fill="#f8fafc" fontSize="26" fontWeight="900">full circle = 360 deg</text>
      <text x="580" y="225" fill={activeStep >= 2 ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">angle_i = part_i / total x 360</text>
      <text x="580" y="272" fill="#e0f2fe" fontSize="22" fontWeight="900">sectors close with no gap</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function InverseProportionVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} inverse proportion fixed product`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <rect x="145" y="130" width="180" height="150" fill="#06b6d433" stroke="#67e8f9" strokeWidth="4" />
      <rect x="490" y="170" width="300" height="90" fill={activeStep >= 1 ? "#8b5cf644" : "#33415555"} stroke="#a78bfa" strokeWidth="4" />
      <text x="168" y="315" fill="#e0f2fe" fontSize="23" fontWeight="900">narrow x tall</text>
      <text x="545" y="315" fill="#e0f2fe" fontSize="23" fontWeight="900">wide x short</text>
      <text x="333" y="212" fill={activeStep >= 2 ? "#fbbf24" : "#94a3b8"} fontSize="34" fontWeight="900">same area k</text>
      <text x="335" y="258" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="28" fontWeight="900">x y = k</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function DirectProportionVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const k = 1.35 + theoremVariant(theorem, 4) * 0.18;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} direct proportion model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M130 330H760M170 80V350" stroke="#475569" strokeWidth="3" />
      <path d="M170 330L720 105" stroke="#38bdf8" strokeWidth="5" />
      {[1, 2, 3, 4].map((n) => <g key={n}><circle cx={170 + n * 110} cy={330 - n * 45 * k} r="9" fill={activeStep >= n - 1 ? "#fbbf24" : "#64748b"} /><line x1={170 + n * 110} y1={330 - n * 45 * k} x2={170 + n * 110} y2="330" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="7 7" /></g>)}
      <text x="510" y="190" fill="#e0f2fe" fontSize="28" fontWeight="900">y = kx</text>
      <text x="510" y="238" fill={activeStep >= 2 ? "#86efac" : "#94a3b8"} fontSize="26" fontWeight="900">y / x stays constant</text>
      <text x="510" y="286" fill="#f8fafc" fontSize="22" fontWeight="900">k = {k.toFixed(2)} for every point</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function AlgebraTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(factor|remainder|root|polynomial|synthetic|vieta|discriminant)/.test(title)) return <PolynomialAlgebraVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(am-gm|cauchy|triangle inequality)/.test(title)) return <InequalityBalanceVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(logarithm|exponent|inverse function|composition)/.test(title)) return <FunctionFlowAlgebraVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <AlgebraTileVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function AlgebraTileVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const split = 110 + theoremVariant(theorem, 5) * 18;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} algebra model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <rect x="170" y="135" width="420" height="210" fill="#0ea5e922" stroke="#67e8f9" strokeWidth="4" />
      <line x1={170 + split} x2={170 + split} y1="135" y2="345" stroke={activeStep >= 1 ? "#fbbf24" : "#475569"} strokeWidth="5" />
      <line x1="170" x2="590" y1="245" y2="245" stroke={activeStep >= 2 ? "#a78bfa" : "#475569"} strokeWidth="5" />
      <text x="224" y="220" fill="#e0f2fe" fontSize="30" fontWeight="900">a^2</text>
      <text x="392" y="220" fill="#c4b5fd" fontSize="28" fontWeight="900">ab</text>
      <text x="226" y="305" fill="#c4b5fd" fontSize="28" fontWeight="900">ab</text>
      <text x="408" y="305" fill="#fbbf24" fontSize="30" fontWeight="900">b^2</text>
      <text x="642" y="250" fill={activeStep >= 3 ? "#f8fafc" : "#94a3b8"} fontSize="28" fontWeight="900">{truncateSvgText(formulaForTheorem(theorem), 24)}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function PolynomialAlgebraVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const root = 1 + theoremVariant(theorem, 4);
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} polynomial proof model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M120 300H790M190 75V330" stroke="#475569" strokeWidth="3" />
      <path d="M130 245C210 95 310 330 410 180S600 70 760 270" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <circle cx={260 + root * 68} cy="300" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="3" />
      <line x1={260 + root * 68} x2={260 + root * 68} y1="110" y2="320" stroke={activeStep >= 1 ? "#fbbf24" : "#64748b"} strokeWidth="4" strokeDasharray="8 8" />
      <rect x="505" y="132" width="200" height="62" rx="10" fill={activeStep >= 2 ? "#8b5cf644" : "#33415555"} stroke="#a78bfa" strokeWidth="4" />
      <rect x="505" y="214" width="120" height="62" rx="10" fill={activeStep >= 3 ? "#06b6d444" : "#33415555"} stroke="#67e8f9" strokeWidth="4" />
      <text x="524" y="172" fill="#f8fafc" fontSize="24" fontWeight="900">(x - a) q(x)</text>
      <text x="544" y="254" fill="#f8fafc" fontSize="24" fontWeight="900">r = p(a)</text>
      <text x="450" y="342" fill={activeStep >= 4 ? "#86efac" : "#94a3b8"} fontSize="26" fontWeight="900">zero remainder means factor</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function InequalityBalanceVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} inequality balance proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <line x1="450" y1="115" x2="450" y2="315" stroke="#64748b" strokeWidth="8" />
      <line x1="255" y1="170" x2="645" y2="210" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
      <path d="M270 172L220 278H320Z" fill="#06b6d455" stroke="#67e8f9" strokeWidth="4" />
      <path d="M635 210L585 278H685Z" fill="#8b5cf655" stroke="#a78bfa" strokeWidth="4" />
      <text x="205" y="320" fill="#e0f2fe" fontSize="22" fontWeight="900">known non-negative square</text>
      <text x="522" y="320" fill="#e0f2fe" fontSize="22" fontWeight="900">target bound</text>
      <text x="274" y="110" fill={activeStep >= 2 ? "#86efac" : "#94a3b8"} fontSize="27" fontWeight="900">cannot be below zero</text>
      <text x="292" y="370" fill="#f8fafc" fontSize="24" fontWeight="900">{truncateSvgText(formulaForTheorem(theorem), 38)}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function FunctionFlowAlgebraVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const labels = theorem.title.toLowerCase().includes("log") ? ["x", "b^m", "xy", "m+n"] : theorem.title.toLowerCase().includes("composition") ? ["x", "h(x)", "g(h(x))", "f(g(h(x)))"] : ["input", "rule", "output", "reverse"];
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} algebra function flow`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      {labels.map((label, index) => (
        <g key={label}>
          <rect x={110 + index * 180} y="160" width="130" height="74" rx="16" fill={activeStep >= index ? ["#06b6d444", "#8b5cf644", "#f59e0b44", "#22c55e44"][index] : "#33415555"} stroke={["#67e8f9", "#a78bfa", "#fbbf24", "#86efac"][index]} strokeWidth="4" />
          <text x={175 + index * 180} y="206" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">{label}</text>
          {index < labels.length - 1 ? <path d={`M${244 + index * 180} 197H${286 + index * 180}`} stroke="#e0f2fe" strokeWidth="4" markerEnd={`url(#flowArrow-${theorem.slug})`} /> : null}
        </g>
      ))}
      <defs><marker id={`flowArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#e0f2fe" /></marker></defs>
      <text x="185" y="302" fill="#e0f2fe" fontSize="23" fontWeight="900">definition first</text>
      <text x="430" y="302" fill={activeStep >= 2 ? "#fbbf24" : "#94a3b8"} fontSize="23" fontWeight="900">same rule preserves meaning</text>
      <text x="575" y="352" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="25" fontWeight="900">{truncateSvgText(formulaForTheorem(theorem), 34)}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function TrigonometryTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(sine rule|cosine rule|area sine|law of tangents|mollweide|complementary)/.test(title)) return <TriangleTrigVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(addition|double|half|product-to-sum|sum-to-product|triple|weierstrass)/.test(title)) return <RotationIdentityTrigVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(periodicity|inverse|even-odd)/.test(title)) return <WaveBranchTrigVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <UnitCircleTrigVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function UnitCircleTrigVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const angle = 35 + theoremVariant(theorem, 6) * 8;
  const rad = angle * Math.PI / 180;
  const x = 420 + Math.cos(rad) * 150;
  const y = 230 - Math.sin(rad) * 150;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} unit circle visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <circle cx="420" cy="230" r="150" fill="#0ea5e922" stroke="#67e8f9" strokeWidth="4" />
      <path d="M250 230H610M420 60V390" stroke="#475569" strokeWidth="3" />
      <line x1="420" y1="230" x2={x} y2={y} stroke="#fbbf24" strokeWidth="6" />
      <line x1={x} y1={y} x2={x} y2="230" stroke={activeStep >= 1 ? "#a78bfa" : "#64748b"} strokeWidth="5" strokeDasharray="8 8" />
      <line x1="420" y1="230" x2={x} y2="230" stroke={activeStep >= 2 ? "#22d3ee" : "#64748b"} strokeWidth="5" />
      <path d="M470 230A50 50 0 0 0 460 198" fill="none" stroke="#f97316" strokeWidth="5" />
      <text x="626" y="210" fill="#fbbf24" fontSize="26" fontWeight="900">theta = {angle} deg</text>
      <text x="622" y="250" fill={activeStep >= 3 ? "#f8fafc" : "#94a3b8"} fontSize="24" fontWeight="900">x = cos theta, y = sin theta</text>
      <text x="255" y="376" fill={activeStep >= 4 ? "#86efac" : "#94a3b8"} fontSize="23" fontWeight="900">radius stays 1, so the identity survives every angle</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function TriangleTrigVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const formula = title.includes("cosine") ? "c^2 = a^2 + b^2 - 2ab cos C" : title.includes("area") ? "Area = 1/2 ab sin C" : "a / sin A = b / sin B";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} triangle trigonometry visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M170 315L710 315L510 95Z" fill="#0e749022" stroke="#67e8f9" strokeWidth="5" strokeLinejoin="round" />
      <line x1="510" y1="95" x2="510" y2="315" stroke={activeStep >= 1 ? "#fbbf24" : "#475569"} strokeWidth="5" strokeDasharray={activeStep >= 1 ? "0" : "8 8"} />
      <path d="M510 315h-25v-25" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <path d="M220 315Q252 270 292 281" fill="none" stroke={activeStep >= 2 ? "#fb7185" : "#64748b"} strokeWidth="6" />
      <path d="M665 315Q622 256 574 264" fill="none" stroke={activeStep >= 2 ? "#a78bfa" : "#64748b"} strokeWidth="6" />
      <text x="318" y="338" fill="#67e8f9" fontSize="25" fontWeight="900">base</text>
      <text x="522" y="214" fill={activeStep >= 1 ? "#fbbf24" : "#94a3b8"} fontSize="25" fontWeight="900">height = side x sin angle</text>
      <text x="560" y="150" fill="#c4b5fd" fontSize="23" fontWeight="900">included angle</text>
      <text x="220" y="382" fill={activeStep >= 3 ? "#f8fafc" : "#94a3b8"} fontSize="28" fontWeight="900">{formula}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function RotationIdentityTrigVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const isTangent = title.includes("tangent") || title.includes("weierstrass");
  const identity = title.includes("double") ? "set a = b" : title.includes("half") ? "solve double-angle backward" : title.includes("product") || title.includes("sum-to") ? "combine companion formulas" : isTangent ? "divide sine by cosine" : "read the rotated coordinate";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} rotation identity visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <circle cx="315" cy="225" r="125" fill="#0ea5e922" stroke="#67e8f9" strokeWidth="4" />
      <path d="M190 225H440M315 100V350" stroke="#475569" strokeWidth="3" />
      <line x1="315" y1="225" x2="407" y2="141" stroke="#38bdf8" strokeWidth="6" />
      <line x1="315" y1="225" x2="425" y2="285" stroke={activeStep >= 1 ? "#a78bfa" : "#64748b"} strokeWidth="6" />
      <path d="M370 225A55 55 0 0 0 356 183" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <path d="M380 238A70 70 0 0 0 400 266" fill="none" stroke={activeStep >= 1 ? "#a78bfa" : "#64748b"} strokeWidth="5" />
      <path d="M520 150h250M520 225h250M520 300h250" stroke="#334155" strokeWidth="4" />
      <rect x="545" y="124" width="170" height="52" rx="12" fill="#06b6d433" stroke="#67e8f9" strokeWidth="3" />
      <rect x="545" y="199" width="170" height="52" rx="12" fill={activeStep >= 2 ? "#8b5cf644" : "#33415555"} stroke="#a78bfa" strokeWidth="3" />
      <rect x="545" y="274" width="170" height="52" rx="12" fill={activeStep >= 3 ? "#f59e0b44" : "#33415555"} stroke="#fbbf24" strokeWidth="3" />
      <text x="570" y="158" fill="#fff" fontSize="20" fontWeight="900">rotate by a</text>
      <text x="570" y="233" fill="#fff" fontSize="20" fontWeight="900">then by b</text>
      <text x="570" y="308" fill="#fff" fontSize="20" fontWeight="900">same as a + b</text>
      <text x="500" y="370" fill={activeStep >= 4 ? "#86efac" : "#94a3b8"} fontSize="25" fontWeight="900">{identity}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function WaveBranchTrigVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const branchText = title.includes("inverse") ? "restrict to one-to-one branch" : title.includes("even-odd") ? "mirror: x same, y flips" : "one full turn repeats the wave";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} wave and branch visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M100 220H805M130 90V345" stroke="#475569" strokeWidth="3" />
      <path d="M130 220C175 130 220 130 265 220S355 310 400 220S490 130 535 220S625 310 670 220S760 130 805 220" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <rect x={title.includes("inverse") ? 315 : 130} y="100" width={title.includes("inverse") ? 180 : 270} height="240" fill={activeStep >= 1 ? "#8b5cf622" : "transparent"} stroke={activeStep >= 1 ? "#a78bfa" : "#475569"} strokeWidth="4" strokeDasharray="10 8" />
      <line x1="130" y1="220" x2="400" y2="220" stroke={activeStep >= 2 ? "#fbbf24" : "#64748b"} strokeWidth="6" strokeDasharray="9 8" />
      <line x1="400" y1="220" x2="670" y2="220" stroke={activeStep >= 2 ? "#fbbf24" : "#64748b"} strokeWidth="6" strokeDasharray="9 8" />
      <text x="548" y="118" fill="#e0f2fe" fontSize="24" fontWeight="900">{branchText}</text>
      <text x="540" y="166" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="23" fontWeight="900">graph claim matches unit-circle motion</text>
      <text x="540" y="315" fill="#f8fafc" fontSize="22" fontWeight="900">{truncateSvgText(formulaForTheorem(theorem), 32)}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function CalculusTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(squeeze|intermediate|extreme value|heine|bolzano|darboux|dominated|uniform|ratio test)/.test(title)) return <LimitAnalysisVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(rolle|mean value|derivative|l'hopital|monotonicity|concavity|inverse function|implicit function|envelope)/.test(title)) return <DerivativeTangentVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(fundamental theorem|integration|change of variables|fubini|simpson|trapezoidal)/.test(title)) return <IntegralAreaVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(green|divergence|stokes|gauss|field|curl|flux)/.test(title)) return <VectorCalculusFieldVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(lagrange|kkt|convex|duality|slackness|minimum|maximum|pontryagin|virtual work)/.test(title)) return <OptimizationLandscapeVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(newton|bisection|fixed point|runge-kutta|convergence)/.test(title)) return <NumericalIterationVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(laplace|convolution|fourier|parseval|heat|wave)/.test(title)) return <TransformPdeVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <DerivativeTangentVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function LimitAnalysisVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("squeeze") ? "upper and lower envelopes collapse to L" : title.includes("uniform") || title.includes("dominated") ? "one bound controls the whole domain" : title.includes("ratio") ? "tail compares with a geometric series" : "hypotheses prevent jumps or escaping subsequences";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} limit and analysis visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M120 300H790M165 80V340" stroke="#475569" strokeWidth="3" />
      <path d="M135 228C240 142 320 268 422 206S596 126 760 190" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <path d="M135 172C250 100 330 222 430 162S600 82 760 142" fill="none" stroke={activeStep >= 1 ? "#a78bfa" : "#475569"} strokeWidth="4" strokeDasharray="9 8" />
      <path d="M135 284C250 210 330 318 430 250S600 180 760 238" fill="none" stroke={activeStep >= 1 ? "#fbbf24" : "#475569"} strokeWidth="4" strokeDasharray="9 8" />
      <rect x="348" y="105" width="190" height="190" fill={activeStep >= 2 ? "#8b5cf61f" : "transparent"} stroke={activeStep >= 2 ? "#c4b5fd" : "#475569"} strokeWidth="4" strokeDasharray="10 8" />
      <line x1="120" y1="205" x2="790" y2="205" stroke={activeStep >= 3 ? "#86efac" : "#334155"} strokeWidth="5" />
      <text x="570" y="114" fill="#e0f2fe" fontSize="23" fontWeight="900">epsilon band</text>
      <text x="520" y="326" fill={activeStep >= 4 ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">{caption}</text>
      <text x="205" y="374" fill="#f8fafc" fontSize="22" fontWeight="900">{truncateSvgText(formulaForTheorem(theorem), 45)}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function DerivativeTangentVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const shift = theoremVariant(theorem, 5) * 14;
  const x0 = 390 + shift;
  const y0 = 220 - Math.sin((x0 - 250) / 70) * 54;
  const title = theorem.title.toLowerCase();
  const caption = title.includes("rolle") ? "equal endpoints force a horizontal tangent" : title.includes("mean value") ? "one tangent matches the secant slope" : title.includes("concavity") ? "second derivative bends the tangent family" : title.includes("l'hopital") ? "near-zero quotient compares derivative rates" : "local derivative controls nearby behavior";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} derivative visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M120 300H780M170 75V340" stroke="#475569" strokeWidth="3" />
      <path d="M120 270C190 330 260 130 340 195S505 300 610 120S724 164 790 116" fill="none" stroke="#38bdf8" strokeWidth="5" />
      {activeStep >= 1 ? <path d={`M${x0 - 135} ${y0 + 78}L${x0 + 135} ${y0 - 78}`} stroke="#fbbf24" strokeWidth="5" /> : null}
      {activeStep >= 2 ? <path d="M185 271L665 132" stroke="#a78bfa" strokeWidth="4" strokeDasharray="10 8" /> : null}
      <circle cx={x0} cy={y0} r="9" fill="#fbbf24" stroke="#fff" strokeWidth="3" />
      <text x="575" y="305" fill={activeStep >= 3 ? "#f8fafc" : "#94a3b8"} fontSize="25" fontWeight="900">{caption}</text>
      <text x="208" y="372" fill="#e0f2fe" fontSize="22" fontWeight="900">conditions: continuity, differentiability, and valid interval</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function IntegralAreaVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("fubini") ? "slice the same region two ways" : title.includes("parts") ? "product rule rearranged into areas" : title.includes("change") ? "substitution remaps width and height" : "accumulated area becomes endpoint change";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} integral area visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M110 310H790M155 80V340" stroke="#475569" strokeWidth="3" />
      <path d="M130 280C220 135 325 156 410 218S590 310 745 125" fill="none" stroke="#38bdf8" strokeWidth="5" />
      {Array.from({ length: 10 }, (_, index) => {
        const x = 190 + index * 42;
        const h = 58 + Math.sin(index * 0.75) * 35 + index * 7;
        return <rect key={index} x={x} y={310 - h} width="34" height={h} fill={activeStep >= 1 ? "#8b5cf655" : "#33415566"} stroke="#c4b5fd" />;
      })}
      <path d="M205 102C328 70 520 86 646 146" fill="none" stroke={activeStep >= 2 ? "#fbbf24" : "#475569"} strokeWidth="5" strokeDasharray="10 8" />
      <path d="M660 118H770M660 170H770M660 222H770" stroke="#334155" strokeWidth="4" />
      <text x="610" y="270" fill="#e0f2fe" fontSize="24" fontWeight="900">{caption}</text>
      <text x="230" y="374" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">{truncateSvgText(formulaForTheorem(theorem), 44)}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function VectorCalculusFieldVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("green") ? "boundary circulation equals interior curl" : title.includes("stokes") ? "patch circulations cancel inside" : "closed-surface flux equals enclosed source";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} vector field visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <defs><marker id={`fieldArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#67e8f9" /></marker></defs>
      {Array.from({ length: 7 }, (_, row) => Array.from({ length: 9 }, (_, col) => {
        const x = 150 + col * 68;
        const y = 110 + row * 38;
        const dx = 24 - row * 3;
        const dy = -12 + col * 2;
        return <line key={`${row}-${col}`} x1={x} y1={y} x2={x + dx} y2={y + dy} stroke="#67e8f9" strokeWidth="3" markerEnd={`url(#fieldArrow-${theorem.slug})`} opacity="0.65" />;
      }))}
      <path d="M282 120C430 70 632 122 660 235C690 354 432 360 304 288C216 238 202 160 282 120Z" fill="#8b5cf61f" stroke={activeStep >= 1 ? "#fbbf24" : "#a78bfa"} strokeWidth="5" />
      <circle cx="460" cy="224" r="34" fill={activeStep >= 2 ? "#fb718555" : "#334155"} stroke="#fb7185" strokeWidth="4" />
      <text x="532" y="328" fill="#f8fafc" fontSize="24" fontWeight="900">{caption}</text>
      <text x="210" y="382" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="22" fontWeight="900">orientation and boundary assumptions are part of the theorem</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function OptimizationLandscapeVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("lagrange") ? "objective and constraint gradients align" : title.includes("duality") ? "dual bound meets primal value" : title.includes("kkt") || title.includes("slackness") ? "active constraints pair with multipliers" : "local condition certifies the optimum under assumptions";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} optimization landscape visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <ellipse cx="420" cy="220" rx="250" ry="110" fill="#0ea5e91a" stroke="#334155" strokeWidth="4" />
      <ellipse cx="420" cy="220" rx="180" ry="74" fill="none" stroke="#38bdf8" strokeWidth="4" />
      <ellipse cx="420" cy="220" rx="98" ry="38" fill="none" stroke="#a78bfa" strokeWidth="4" />
      <path d="M238 310C322 166 518 124 650 212" fill="none" stroke={activeStep >= 1 ? "#fbbf24" : "#64748b"} strokeWidth="6" />
      <circle cx="496" cy="178" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="3" />
      <line x1="496" y1="178" x2="594" y2="124" stroke={activeStep >= 2 ? "#86efac" : "#475569"} strokeWidth="6" markerEnd={`url(#optArrow-${theorem.slug})`} />
      <line x1="496" y1="178" x2="420" y2="100" stroke={activeStep >= 2 ? "#fb7185" : "#475569"} strokeWidth="6" markerEnd={`url(#optArrow-${theorem.slug})`} />
      <defs><marker id={`optArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#86efac" /></marker></defs>
      <text x="570" y="305" fill="#f8fafc" fontSize="23" fontWeight="900">{caption}</text>
      <text x="210" y="376" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="22" fontWeight="900">feasible set, regularity, and convexity checks stay visible</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function NumericalIterationVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("bisection") ? "interval halves while signs stay opposite" : title.includes("fixed") ? "distances shrink toward one fixed point" : title.includes("runge") ? "weighted slopes approximate the flow" : "tangent correction races toward the root";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} numerical iteration visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M110 300H790M160 82V342" stroke="#475569" strokeWidth="3" />
      <path d="M130 225C220 90 310 350 410 230S580 100 755 252" fill="none" stroke="#38bdf8" strokeWidth="5" />
      {[0, 1, 2, 3].map((index) => {
        const x = 250 + index * 105;
        const y = 286 - index * 38;
        return <g key={index}><circle cx={x} cy={y} r="10" fill={index <= activeStep ? "#fbbf24" : "#64748b"} stroke="#fff" strokeWidth="3" />{index > 0 ? <line x1={x - 105} y1={y + 38} x2={x} y2={y} stroke={index <= activeStep ? "#a78bfa" : "#475569"} strokeWidth="4" strokeDasharray="8 8" /> : null}</g>;
      })}
      <rect x="560" y="112" width={activeStep >= 2 ? 76 : 180} height="48" fill="#8b5cf633" stroke="#c4b5fd" strokeWidth="4" />
      <text x="548" y="230" fill="#e0f2fe" fontSize="24" fontWeight="900">{caption}</text>
      <text x="250" y="376" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="23" fontWeight="900">valid starts and smoothness assumptions prevent false convergence</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function TransformPdeVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("heat") ? "diffusion lowers new interior peaks" : title.includes("wave") ? "energy transfers but total stays fixed" : title.includes("parseval") ? "energy agrees in both domains" : "transform turns structure into algebra";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} transform and PDE visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M115 250C170 95 245 348 312 205S430 113 500 246" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <path d="M565 300H780M585 95V320" stroke="#475569" strokeWidth="3" />
      {[0, 1, 2, 3, 4].map((index) => <rect key={index} x={608 + index * 34} y={280 - [56, 126, 88, 42, 24][index]} width="22" height={[56, 126, 88, 42, 24][index]} fill={index <= activeStep ? "#fbbf24" : "#334155"} stroke="#fde68a" />)}
      <path d="M515 205H558" stroke="#a78bfa" strokeWidth="6" markerEnd={`url(#transformPdeArrow-${theorem.slug})`} />
      <defs><marker id={`transformPdeArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#a78bfa" /></marker></defs>
      <rect x="168" y={activeStep >= 1 ? "122" : "88"} width="92" height={activeStep >= 1 ? "130" : "164"} fill="#8b5cf622" stroke="#c4b5fd" strokeWidth="4" strokeDasharray="9 8" />
      <text x="535" y="360" fill="#f8fafc" fontSize="24" fontWeight="900">{caption}</text>
      <text x="165" y="372" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="22" fontWeight="900">initial, boundary, and convention assumptions are checked</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function LinearAlgebraTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(associativity|distributive|cayley|cramer|lu|matrix)/.test(title)) return <MatrixBlockVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(rank|nullity|basis|dimension|fundamental theorem)/.test(title)) return <SubspaceDimensionVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(determinant|cross product|scalar triple)/.test(title)) return <DeterminantVolumeVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(eigen|diagonal|spectral|schur|jordan|perron)/.test(title)) return <EigenDirectionVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(projection|gram|dot product|orthogonal)/.test(title)) return <ProjectionOrthogonalityVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(singular value|decomposition)/.test(title)) return <MatrixDecompositionVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <LinearTransformationGridVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function LinearTransformationGridVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const tilt = theoremVariant(theorem, 5) * 10;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} linear transformation visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M180 320H720M270 90V360" stroke="#475569" strokeWidth="3" />
      <path d="M330 105L690 105M310 165L670 165M290 225L650 225M270 285L630 285" stroke={activeStep >= 1 ? "#1e3a8a" : "#334155"} strokeWidth="3" />
      <path d="M350 88L270 318M430 88L350 318M510 88L430 318M590 88L510 318" stroke={activeStep >= 1 ? "#1e3a8a" : "#334155"} strokeWidth="3" />
      <line x1="270" y1="320" x2={520 + tilt} y2="170" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
      <line x1="270" y1="320" x2="455" y2={260 - tilt} stroke="#a78bfa" strokeWidth="7" strokeLinecap="round" />
      {activeStep >= 1 ? <line x1="455" y1={260 - tilt} x2={705 + tilt} y2={110 - tilt} stroke="#fbbf24" strokeWidth="5" strokeDasharray="10 8" /> : null}
      {activeStep >= 2 ? <polygon points={`270,320 ${520 + tilt},170 ${705 + tilt},${110 - tilt} 455,${260 - tilt}`} fill="#0ea5e922" stroke="#67e8f9" strokeWidth="3" /> : null}
      <text x="560" y="250" fill={activeStep >= 3 ? "#f8fafc" : "#94a3b8"} fontSize="25" fontWeight="900">matrix action is visible movement</text>
      <text x="310" y="382" fill="#e0f2fe" fontSize="22" fontWeight="900">basis vectors determine the whole transformation</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function MatrixBlockVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("lu") ? "elimination factors into L and U" : title.includes("cramer") ? "determinant ratios replace columns" : title.includes("associativity") ? "same middle sums, grouped differently" : "cell rules preserve the same linear operation";
  const cells = Array.from({ length: 9 }, (_, index) => index);
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} matrix block visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      {[0, 1, 2].map((block) => (
        <g key={block} transform={`translate(${140 + block * 225} 132)`}>
          <rect x="0" y="0" width="132" height="132" rx="12" fill={block <= activeStep ? ["#06b6d433", "#8b5cf633", "#f59e0b33"][block] : "#33415555"} stroke={["#67e8f9", "#c4b5fd", "#fbbf24"][block]} strokeWidth="4" />
          {cells.map((cell) => <rect key={cell} x={12 + (cell % 3) * 36} y={12 + Math.floor(cell / 3) * 36} width="28" height="28" fill={cell <= activeStep + block + 2 ? "#f8fafc33" : "#0f172a"} stroke="#94a3b8" />)}
          <text x="66" y="170" textAnchor="middle" fill="#e0f2fe" fontSize="20" fontWeight="900">{["A", "B", "C"][block]}</text>
        </g>
      ))}
      <path d="M292 198H350M517 198H575" stroke="#e0f2fe" strokeWidth="5" markerEnd={`url(#matrixArrow-${theorem.slug})`} />
      <defs><marker id={`matrixArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#e0f2fe" /></marker></defs>
      <text x="285" y="350" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">{caption}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function SubspaceDimensionVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("rank") || title.includes("fundamental") ? "domain dimension splits into image plus kernel" : "independent spanning sets lock the dimension";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} subspace dimension visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <rect x="120" y="118" width="280" height="178" rx="16" fill="#06b6d422" stroke="#67e8f9" strokeWidth="4" />
      <rect x="500" y="118" width="280" height="178" rx="16" fill="#8b5cf622" stroke="#c4b5fd" strokeWidth="4" />
      {[0, 1, 2, 3].map((index) => <line key={index} x1="150" y1={155 + index * 30} x2={index < 2 ? 354 : 280} y2={155 + index * 30} stroke={index <= activeStep ? "#67e8f9" : "#475569"} strokeWidth="8" strokeLinecap="round" />)}
      {[0, 1, 2].map((index) => <line key={index} x1="530" y1={160 + index * 38} x2={700} y2={160 + index * 38} stroke={index <= activeStep ? "#a78bfa" : "#475569"} strokeWidth="8" strokeLinecap="round" />)}
      <path d="M408 206H492" stroke="#fbbf24" strokeWidth="6" markerEnd={`url(#subspaceArrow-${theorem.slug})`} />
      <defs><marker id={`subspaceArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24" /></marker></defs>
      <text x="155" y="335" fill="#e0f2fe" fontSize="22" fontWeight="900">domain / spanning set</text>
      <text x="535" y="335" fill="#e0f2fe" fontSize="22" fontWeight="900">image / independent directions</text>
      <text x="240" y="378" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">{caption}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function DeterminantVolumeVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const isTriple = theorem.title.toLowerCase().includes("triple");
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} determinant area visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M170 320H740M250 80V350" stroke="#475569" strokeWidth="3" />
      <polygon points="250,320 545,208 690,286 395,398" fill="#06b6d433" stroke="#67e8f9" strokeWidth="5" />
      {isTriple ? <polygon points="545,208 630,126 776,204 690,286" fill={activeStep >= 1 ? "#8b5cf655" : "#33415555"} stroke="#c4b5fd" strokeWidth="4" /> : null}
      {isTriple ? <polygon points="395,398 480,316 630,126 545,208" fill={activeStep >= 2 ? "#f59e0b44" : "#33415544"} stroke="#fbbf24" strokeWidth="4" /> : null}
      <line x1="250" y1="320" x2="545" y2="208" stroke="#38bdf8" strokeWidth="7" />
      <line x1="250" y1="320" x2="395" y2="398" stroke="#a78bfa" strokeWidth="7" />
      <text x="515" y="345" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="25" fontWeight="900">{isTriple ? "signed volume from scalar triple product" : "area scale = absolute determinant"}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function EigenDirectionVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("spectral") ? "orthogonal eigen-directions separate the matrix" : title.includes("perron") ? "positive matrix keeps a positive dominant direction" : title.includes("jordan") ? "generalized chains track missing directions" : "eigenvectors stretch without turning";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} eigen direction visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M160 300H760M250 80V345" stroke="#475569" strokeWidth="3" />
      <ellipse cx="430" cy="220" rx="210" ry="88" fill="#0ea5e91f" stroke="#334155" strokeWidth="4" transform="rotate(-18 430 220)" />
      <line x1="250" y1="300" x2="680" y2="155" stroke="#38bdf8" strokeWidth="7" />
      <line x1="250" y1="300" x2={activeStep >= 1 ? 760 : 560} y2={activeStep >= 1 ? 128 : 195} stroke="#fbbf24" strokeWidth="5" strokeDasharray="9 8" />
      <line x1="390" y1="100" x2="520" y2="338" stroke={activeStep >= 2 ? "#a78bfa" : "#475569"} strokeWidth="6" />
      <circle cx={activeStep >= 1 ? 760 : 560} cy={activeStep >= 1 ? 128 : 195} r="10" fill="#fbbf24" stroke="#fff" strokeWidth="3" />
      <text x="512" y="330" fill="#f8fafc" fontSize="24" fontWeight="900">{caption}</text>
      <text x="205" y="376" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="22" fontWeight="900">non-eigen directions rotate into mixtures</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ProjectionOrthogonalityVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("gram") ? "subtract projections to build orthogonal directions" : title.includes("dot") ? "dot product measures aligned component" : "closest error is perpendicular to the subspace";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} projection and orthogonality visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M145 300H770M210 80V345" stroke="#475569" strokeWidth="3" />
      <line x1="210" y1="300" x2="720" y2="172" stroke="#38bdf8" strokeWidth="7" />
      <line x1="210" y1="300" x2="545" y2="102" stroke="#fbbf24" strokeWidth="7" />
      <line x1="545" y1="102" x2="605" y2="201" stroke={activeStep >= 1 ? "#fb7185" : "#64748b"} strokeWidth="6" strokeDasharray="9 8" />
      <path d="M585 206l-14-24 24-14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <circle cx="605" cy="201" r="10" fill="#86efac" />
      <text x="560" y="290" fill="#f8fafc" fontSize="24" fontWeight="900">{caption}</text>
      <text x="222" y="374" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="22" fontWeight="900">orthogonality makes the decomposition unique</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function MatrixDecompositionVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} matrix decomposition visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      {[["U", 130, "#06b6d4"], ["Sigma", 330, "#f59e0b"], ["V^T", 560, "#8b5cf6"]].map(([label, x, color], index) => (
        <g key={label}>
          <rect x={Number(x)} y="132" width={index === 1 ? 150 : 130} height="150" rx="16" fill={index <= activeStep ? `${color}44` : "#33415555"} stroke={String(color)} strokeWidth="4" />
          <text x={Number(x) + (index === 1 ? 75 : 65)} y="214" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="900">{label}</text>
          {index < 2 ? <path d={`M${Number(x) + (index === 1 ? 162 : 142)} 207H${Number(x) + (index === 1 ? 218 : 188)}`} stroke="#e0f2fe" strokeWidth="5" /> : null}
        </g>
      ))}
      <text x="206" y="344" fill="#e0f2fe" fontSize="23" fontWeight="900">rotate / scale / rotate back</text>
      <text x="260" y="382" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="23" fontWeight="900">decomposition exposes independent action layers</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ComplexTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(root|moivre|argument|euler|modulus product|conjugate|triangle inequality)/.test(title)) return <ComplexPlaneAlgebraVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(integral|residue|rouche|argument principle|morera|laurent|cauchy)/.test(title)) return <ComplexContourVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <ComplexMappingVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function ComplexPlaneAlgebraVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const roots = 4 + theoremVariant(theorem, 4);
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} complex plane algebra visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M190 230H710M450 70V360" stroke="#475569" strokeWidth="3" />
      <circle cx="450" cy="230" r="132" fill="#0ea5e91f" stroke="#67e8f9" strokeWidth="4" />
      {Array.from({ length: roots }, (_, index) => {
        const theta = (index / roots) * Math.PI * 2 - Math.PI / 2;
        const x = 450 + Math.cos(theta) * 132;
        const y = 230 + Math.sin(theta) * 132;
        return <g key={index}><line x1="450" y1="230" x2={x} y2={y} stroke={index <= activeStep + 1 ? "#a78bfa" : "#475569"} strokeWidth="3" /><circle cx={x} cy={y} r="9" fill={index <= activeStep + 1 ? "#fbbf24" : "#64748b"} /></g>;
      })}
      <path d="M450 230L570 174" stroke="#fbbf24" strokeWidth="6" />
      <path d="M502 230A52 52 0 0 0 493 205" fill="none" stroke="#fb7185" strokeWidth="5" />
      <text x="610" y="318" fill="#f8fafc" fontSize="25" fontWeight="900">modulus scales, arguments add</text>
      <text x="610" y="356" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="22" fontWeight="900">roots spread equally around a circle</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ComplexContourVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const label = title.includes("residue") ? "sum enclosed residues" : title.includes("rouche") ? "dominant boundary term" : title.includes("laurent") ? "annulus series bands" : "boundary controls interior";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} contour visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M160 225H740M450 70V360" stroke="#475569" strokeWidth="3" />
      <path d="M290 118C430 58 624 100 660 215C700 345 496 372 350 318C220 270 198 170 290 118Z" fill="#0ea5e922" stroke="#67e8f9" strokeWidth="5" />
      <path d="M350 175C438 135 552 160 575 230C598 306 462 318 385 285C318 256 305 204 350 175Z" fill="none" stroke={activeStep >= 2 ? "#a78bfa" : "#64748b"} strokeWidth="4" strokeDasharray="10 8" />
      {[["z0", 448, 220, "#fbbf24"], ["p", 535, 255, "#fb7185"], ["a", 380, 182, "#86efac"]].map(([text, x, y, color], index) => (
        <g key={text}>
          <circle cx={Number(x)} cy={Number(y)} r="10" fill={index <= activeStep ? String(color) : "#64748b"} stroke="#fff" strokeWidth="3" />
          <text x={Number(x) + 16} y={Number(y) - 12} fill="#f8fafc" fontSize="20" fontWeight="900">{text}</text>
        </g>
      ))}
      <path d="M655 216C645 190 630 172 605 154" fill="none" stroke={activeStep >= 1 ? "#fbbf24" : "#64748b"} strokeWidth="6" markerEnd={`url(#contourArrow-${theorem.slug})`} />
      <defs><marker id={`contourArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24" /></marker></defs>
      <text x="570" y="332" fill="#f8fafc" fontSize="24" fontWeight="900">{label}</text>
      <text x="230" y="382" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="23" fontWeight="900">visual intuition is separated from analytic hypotheses</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ComplexMappingVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("schwarz") ? "unit disk maps inside itself" : title.includes("open") ? "small disks become open patches" : title.includes("liouville") ? "bounded entire motion collapses" : "overlapping analytic patches agree";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} complex mapping visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M100 220H355M225 95V345M540 220H795M665 95V345" stroke="#475569" strokeWidth="3" />
      <circle cx="225" cy="220" r="92" fill="#06b6d422" stroke="#67e8f9" strokeWidth="5" />
      <ellipse cx="665" cy="220" rx={activeStep >= 1 ? 128 : 92} ry={activeStep >= 1 ? 70 : 92} fill="#8b5cf622" stroke="#c4b5fd" strokeWidth="5" transform="rotate(-18 665 220)" />
      <path d="M375 220H505" stroke="#fbbf24" strokeWidth="6" markerEnd={`url(#mappingArrow-${theorem.slug})`} />
      <defs><marker id={`mappingArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24" /></marker></defs>
      <circle cx="225" cy="220" r="9" fill="#fbbf24" />
      <circle cx="665" cy="220" r="9" fill="#fbbf24" />
      <path d="M173 180C205 152 247 148 285 176" fill="none" stroke={activeStep >= 2 ? "#86efac" : "#64748b"} strokeWidth="5" />
      <path d="M605 185C645 142 716 159 743 205" fill="none" stroke={activeStep >= 2 ? "#86efac" : "#64748b"} strokeWidth="5" />
      <text x="222" y="374" textAnchor="middle" fill="#e0f2fe" fontSize="22" fontWeight="900">domain condition</text>
      <text x="665" y="374" textAnchor="middle" fill="#e0f2fe" fontSize="22" fontWeight="900">mapped consequence</text>
      <text x="472" y="112" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">{caption}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function NumberTheoryTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(euclid|gcd|lcm|bezout|division)/.test(title)) return <EuclidRectangleVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(fundamental|prime|factor|divisor)/.test(title)) return <FactorTreeVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (title.includes("pigeonhole")) return <PigeonholeDivisibilityVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <ModularClockVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function ModularClockVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const modulus = 5 + theoremVariant(theorem, 5);
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} number theory model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      {Array.from({ length: modulus }, (_, index) => {
        const angle = (index / modulus) * Math.PI * 2 - Math.PI / 2;
        const x = 450 + Math.cos(angle) * 140;
        const y = 230 + Math.sin(angle) * 140;
        return <g key={index}><circle cx={x} cy={y} r="27" fill={index <= activeStep + 1 ? "#0891b2" : "#334155"} stroke="#e0f2fe" strokeWidth="3" /><text x={x} y={y + 7} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">{index}</text></g>;
      })}
      <path d="M450 90A140 140 0 1 1 449 90" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="12 10" />
      <text x="580" y="332" fill="#f8fafc" fontSize="25" fontWeight="900">mod {modulus} pattern cycle</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function EuclidRectangleVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} Euclidean rectangle model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <rect x="120" y="130" width="560" height="90" fill="#06b6d433" stroke="#67e8f9" strokeWidth="4" />
      {[0, 1, 2].map((i) => <rect key={i} x={120 + i * 150} y="130" width="150" height="90" fill={activeStep >= i ? "#06b6d455" : "transparent"} stroke="#67e8f9" strokeWidth="3" />)}
      <rect x="570" y="130" width="110" height="90" fill={activeStep >= 2 ? "#f59e0b55" : "#33415555"} stroke="#fbbf24" strokeWidth="4" />
      <path d="M120 276H680" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      <path d="M120 276H570" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" />
      <text x="190" y="190" fill="#fff" fontSize="28" fontWeight="900">b</text>
      <text x="338" y="190" fill="#fff" fontSize="28" fontWeight="900">b</text>
      <text x="488" y="190" fill="#fff" fontSize="28" fontWeight="900">b</text>
      <text x="610" y="190" fill="#fff" fontSize="28" fontWeight="900">r</text>
      <text x="245" y="335" fill="#f8fafc" fontSize="28" fontWeight="900">a = bq + r, 0 &lt;= r &lt; b</text>
      <text x="270" y="372" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="23" fontWeight="900">same common divisors transfer to the remainder</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function FactorTreeVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} factor tree model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <circle cx="450" cy="100" r="38" fill="#06b6d455" stroke="#67e8f9" strokeWidth="4" />
      <text x="450" y="108" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">n</text>
      <path d="M430 135L300 220M470 135L600 220" stroke={activeStep >= 1 ? "#fbbf24" : "#475569"} strokeWidth="5" />
      <circle cx="300" cy="230" r="34" fill={activeStep >= 1 ? "#8b5cf655" : "#334155"} stroke="#a78bfa" strokeWidth="4" />
      <circle cx="600" cy="230" r="34" fill={activeStep >= 1 ? "#8b5cf655" : "#334155"} stroke="#a78bfa" strokeWidth="4" />
      <path d="M286 260L220 326M314 260L380 326M586 260L520 326M614 260L680 326" stroke={activeStep >= 2 ? "#86efac" : "#475569"} strokeWidth="4" />
      {[220, 380, 520, 680].map((x, i) => <g key={x}><circle cx={x} cy="336" r="26" fill={activeStep >= 2 ? "#22c55e55" : "#334155"} stroke="#86efac" strokeWidth="3" /><text x={x} y="344" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">p{i + 1}</text></g>)}
      <text x="232" y="392" fill={activeStep >= 3 ? "#f8fafc" : "#94a3b8"} fontSize="24" fontWeight="900">prime leaves give the number fingerprint</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function PigeonholeDivisibilityVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} pigeonhole remainder model`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      {[0, 1, 2, 3, 4].map((box) => <g key={box}><rect x={120 + box * 132} y="150" width="96" height="130" rx="14" fill="#1e293b" stroke={box === 0 ? "#86efac" : "#67e8f9"} strokeWidth="4" /><text x={168 + box * 132} y="305" textAnchor="middle" fill="#e0f2fe" fontSize="20" fontWeight="900">rem {box}</text></g>)}
      {[0, 1, 2, 3, 4, 5].map((dot) => <circle key={dot} cx={145 + (dot % 5) * 132 + (dot === 5 ? 34 : 0)} cy={185 + (dot > 4 ? 42 : 0)} r="15" fill={dot <= activeStep + 1 ? "#fbbf24" : "#64748b"} stroke="#fff" strokeWidth="3" />)}
      <text x="205" y="360" fill="#f8fafc" fontSize="25" fontWeight="900">same remainder box -&gt; difference divisible by n</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function GeometryTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(circle|cyclic|tangent|chord|point theorem|alternate segment)/.test(title)) return <CircleGeometryVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(sierpinski|projection|orthographic)/.test(title)) return <FractalProjectionGeometryVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(congruence|similarity|proportionality|bisector|median|centroid|pythagorean|angle|triangle|base)/.test(title)) return <TriangleGeometryVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <TriangleGeometryVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function TriangleGeometryVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const reveal = (index: number) => activeStep >= Math.min(index, totalSteps - 1);
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M170 310 L450 82 L730 310 Z" fill="#0f766e22" stroke="#67e8f9" strokeWidth="5" strokeLinejoin="round" />
      <line x1="450" y1="82" x2="450" y2="310" stroke="#fbbf24" strokeWidth={reveal(1) ? 5 : 2} strokeDasharray={reveal(1) ? "0" : "8 8"} />
      <circle cx="170" cy="310" r="8" fill="#fb7185" />
      <circle cx="450" cy="82" r="8" fill="#fbbf24" />
      <circle cx="730" cy="310" r="8" fill="#fb7185" />
      <text x="150" y="340" fill="#f8fafc" fontSize="24" fontWeight="900">A</text>
      <text x="442" y="58" fill="#f8fafc" fontSize="24" fontWeight="900">B</text>
      <text x="742" y="340" fill="#f8fafc" fontSize="24" fontWeight="900">C</text>
      <path d="M205 306 Q230 272 262 276" fill="none" stroke={reveal(2) ? "#fb7185" : "#94a3b8"} strokeWidth="6" />
      <path d="M695 306 Q670 272 638 276" fill="none" stroke={reveal(2) ? "#fb7185" : "#94a3b8"} strokeWidth="6" />
      <text x="360" y="355" fill="#a7f3d0" fontSize="22" fontWeight="900">conditions checked</text>
      <text x="314" y="386" fill={reveal(3) ? "#fef08a" : "#94a3b8"} fontSize="24" fontWeight="900">matching structure forces the conclusion</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function CircleGeometryVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const reveal = (index: number) => activeStep >= Math.min(index, totalSteps - 1);
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} circle theorem visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <circle cx="430" cy="220" r="138" fill="#0e749022" stroke="#67e8f9" strokeWidth="5" />
      <circle cx="430" cy="220" r="7" fill="#f8fafc" />
      <path d="M292 220H710" stroke={reveal(1) ? "#fbbf24" : "#475569"} strokeWidth="5" />
      <path d="M337 130L604 312" stroke={reveal(2) ? "#a78bfa" : "#475569"} strokeWidth="5" />
      <path d="M245 82C332 55 402 72 484 123" fill="none" stroke={reveal(3) ? "#fb7185" : "#64748b"} strokeWidth="6" strokeLinecap="round" />
      <line x1="568" y1="95" x2="735" y2="210" stroke={reveal(1) ? "#22c55e" : "#475569"} strokeWidth="5" strokeLinecap="round" />
      <line x1="430" y1="220" x2="568" y2="95" stroke={reveal(1) ? "#86efac" : "#475569"} strokeWidth="4" strokeDasharray="9 8" />
      <circle cx="568" cy="95" r="8" fill="#fbbf24" />
      <circle cx="337" cy="130" r="8" fill="#a78bfa" />
      <circle cx="604" cy="312" r="8" fill="#a78bfa" />
      <text x="210" y="345" fill="#e0f2fe" fontSize="23" fontWeight="900">same arc, tangent, or chord relation is tracked</text>
      <text x="285" y="382" fill={reveal(4) ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">circle constraint forces the angle/product conclusion</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function FractalProjectionGeometryVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const isProjection = theorem.title.toLowerCase().includes("projection") || theorem.title.toLowerCase().includes("orthographic");
  if (isProjection) {
    return (
      <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} projection visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
        <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
        {[0, 1, 2].map((row) => [0, 1, 2].map((col) => (
          <g key={`${row}-${col}`} transform={`translate(${220 + col * 54 + row * 26} ${118 + row * 32})`}>
            <polygon points="0,28 38,8 76,28 38,48" fill={activeStep >= row ? "#06b6d455" : "#334155"} stroke="#67e8f9" />
            <polygon points="0,28 38,48 38,92 0,70" fill={activeStep >= row ? "#0891b255" : "#1e293b"} stroke="#67e8f9" />
            <polygon points="76,28 38,48 38,92 76,70" fill={activeStep >= row ? "#8b5cf655" : "#1e293b"} stroke="#a78bfa" />
          </g>
        )))}
        <path d="M610 120H780M610 190H780M610 260H780" stroke="#475569" strokeWidth="4" />
        {[0, 1, 2].map((i) => <rect key={i} x={628 + i * 44} y="145" width="34" height={activeStep >= i ? 92 : 36} fill={activeStep >= i ? "#fbbf24" : "#64748b"} />)}
        <text x="600" y="345" fill="#f8fafc" fontSize="25" fontWeight="900">view records max / occupancy along sight lines</text>
        <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} Sierpinski visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <rect x="190" y="90" width="240" height="240" fill="#06b6d433" stroke="#67e8f9" strokeWidth="4" />
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, c) => (
        <rect key={`${r}-${c}`} x={190 + c * 80} y={90 + r * 80} width="80" height="80" fill={r === 1 && c === 1 ? "#f59e0b99" : activeStep >= 1 ? "#06b6d455" : "transparent"} stroke="#67e8f9" strokeWidth="2" />
      )))}
      {activeStep >= 2 ? Array.from({ length: 8 }, (_, i) => <rect key={i} x={500 + (i % 4) * 48} y={128 + Math.floor(i / 4) * 58} width="38" height="38" fill="#8b5cf666" stroke="#c4b5fd" />) : null}
      <text x="500" y="270" fill="#f8fafc" fontSize="28" fontWeight="900">keep 8 of 9 each stage</text>
      <text x="500" y="318" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="26" fontWeight="900">retained area = (8/9)^n</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function CoordinateGeometryTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(circle|parabola|ellipse|hyperbola|conic|eccentricity)/.test(title)) return <ConicCoordinateVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(rotation|reflection|translation|homothety)/.test(title)) return <TransformationCoordinateVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <GridCoordinateVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function GridCoordinateVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const isSlope = title.includes("slope") || title.includes("parallel") || title.includes("perpendicular") || title.includes("line");
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} coordinate derivation visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <defs><pattern id={`coordGrid-${theorem.slug}`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#1e3a5f" strokeWidth="1" /></pattern></defs>
      <rect x="95" y="70" width="710" height="280" fill={`url(#coordGrid-${theorem.slug})`} />
      <path d="M95 210H805M450 70V350" stroke="#64748b" strokeWidth="3" />
      <circle cx="250" cy="280" r="9" fill="#67e8f9" />
      <circle cx="650" cy="120" r="9" fill="#fbbf24" />
      <line x1="250" y1="280" x2="650" y2="120" stroke="#38bdf8" strokeWidth="5" />
      <line x1="250" y1="280" x2="650" y2="280" stroke={activeStep >= 1 ? "#a78bfa" : "#475569"} strokeWidth="5" strokeDasharray="10 8" />
      <line x1="650" y1="280" x2="650" y2="120" stroke={activeStep >= 1 ? "#fbbf24" : "#475569"} strokeWidth="5" strokeDasharray="10 8" />
      {isSlope ? <text x="520" y="318" fill={activeStep >= 2 ? "#86efac" : "#94a3b8"} fontSize="25" fontWeight="900">slope = rise / run</text> : <text x="485" y="318" fill={activeStep >= 2 ? "#86efac" : "#94a3b8"} fontSize="25" fontWeight="900">distance^2 = dx^2 + dy^2</text>}
      <text x="160" y="382" fill="#f8fafc" fontSize="23" fontWeight="900">coordinate differences drive the theorem, not absolute position</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ConicCoordinateVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const isParabola = title.includes("parabola");
  const isCircle = title.includes("circle");
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} conic locus visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M125 225H785M450 70V350" stroke="#475569" strokeWidth="3" />
      {isCircle ? <circle cx="450" cy="220" r="115" fill="#06b6d422" stroke="#67e8f9" strokeWidth="5" /> : null}
      {!isCircle && !isParabola ? <ellipse cx="450" cy="220" rx="180" ry="92" fill="#06b6d422" stroke="#67e8f9" strokeWidth="5" /> : null}
      {isParabola ? <path d="M275 335Q450 62 625 335" fill="none" stroke="#67e8f9" strokeWidth="6" /> : null}
      <circle cx="370" cy="220" r="8" fill="#fbbf24" />
      <circle cx="530" cy="220" r="8" fill="#fbbf24" />
      <circle cx="520" cy={isParabola ? 160 : 145} r="9" fill="#a78bfa" />
      <line x1="520" y1={isParabola ? 160 : 145} x2="370" y2="220" stroke={activeStep >= 1 ? "#fbbf24" : "#64748b"} strokeWidth="4" />
      <line x1="520" y1={isParabola ? 160 : 145} x2="530" y2="220" stroke={activeStep >= 2 ? "#a78bfa" : "#64748b"} strokeWidth="4" />
      {isParabola ? <line x1="210" y1="300" x2="690" y2="300" stroke={activeStep >= 2 ? "#fb7185" : "#64748b"} strokeWidth="5" strokeDasharray="10 8" /> : null}
      <text x="592" y="150" fill="#f8fafc" fontSize="23" fontWeight="900">moving point P</text>
      <text x="238" y="370" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="25" fontWeight="900">locus equation comes from the preserved distance relation</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function TransformationCoordinateVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} transformation visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <defs><pattern id={`transformGrid-${theorem.slug}`} width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#1e3a5f" strokeWidth="1" /></pattern></defs>
      <rect x="110" y="85" width="680" height="260" fill={`url(#transformGrid-${theorem.slug})`} />
      <polygon points="260,275 365,275 315,165" fill="#06b6d455" stroke="#67e8f9" strokeWidth="4" />
      <polygon points={activeStep >= 1 ? "520,275 625,220 520,165" : "520,275 625,275 575,165"} fill="#8b5cf655" stroke="#c4b5fd" strokeWidth="4" />
      <path d="M390 220H488" stroke="#fbbf24" strokeWidth="6" markerEnd={`url(#transformArrow-${theorem.slug})`} />
      <defs><marker id={`transformArrow-${theorem.slug}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24" /></marker></defs>
      <text x="198" y="365" fill="#e0f2fe" fontSize="23" fontWeight="900">coordinate differences, dot products, or determinants are tracked</text>
      <text x="502" y="120" fill={activeStep >= 2 ? "#86efac" : "#94a3b8"} fontSize="25" fontWeight="900">invariant checked after transformation</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function NetworkTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const nodes = [
    [210, 250],
    [360, 145],
    [540, 145],
    [690, 250],
    [450, 315],
  ] as const;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      {nodes.slice(0, -1).map(([x, y], index) => {
        const [x2, y2] = nodes[index + 1];
        return <line key={`edge-${index}`} x1={x} y1={y} x2={x2} y2={y2} stroke={index <= activeStep ? "#67e8f9" : "#475569"} strokeWidth="5" />;
      })}
      <line x1={690} y1={250} x2={210} y2={250} stroke={activeStep > 2 ? "#fbbf24" : "#475569"} strokeWidth="5" />
      {nodes.map(([x, y], index) => (
        <g key={`node-${index}`}>
          <circle cx={x} cy={y} r="30" fill={index <= activeStep ? "#0891b2" : "#334155"} stroke="#e0f2fe" strokeWidth="4" />
          <text x={x} y={y + 8} textAnchor="middle" fill="#f8fafc" fontSize="22" fontWeight="900">{index + 1}</text>
        </g>
      ))}
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ProbabilityTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  if (/(addition|independence|bayes|total probability|multiplication|conditional)/.test(title)) return <ProbabilityPartitionVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(binomial|poisson|normal|central limit|large numbers|sampling|slutsky|continuous mapping)/.test(title)) return <DistributionSamplingVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(regression|correlation|least squares)/.test(title)) return <RegressionCorrelationVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  if (/(chebyshev|markov|jensen|cramer|neyman)/.test(title)) return <InferenceInequalityVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
  return <ExpectationVarianceVisual activeStep={activeStep} activeTitle={activeTitle} theorem={theorem} totalSteps={totalSteps} />;
}

function ProbabilityPartitionVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const branches = [
    ["A", 300, 160, "#22c55e"],
    ["not A", 300, 300, "#f97316"],
    ["B", 610, 120, "#38bdf8"],
    ["not B", 610, 220, "#a78bfa"],
    ["B", 610, 275, "#38bdf8"],
    ["not B", 610, 360, "#a78bfa"],
  ] as const;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} probability partition visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <circle cx="520" cy="215" r="82" fill="#06b6d433" stroke="#67e8f9" strokeWidth="4" />
      <circle cx="612" cy="215" r="82" fill="#8b5cf633" stroke="#c4b5fd" strokeWidth="4" />
      <path d="M566 148C604 174 604 256 566 282C529 256 529 174 566 148Z" fill={activeStep >= 1 ? "#f59e0b77" : "#33415566"} stroke="#fbbf24" strokeWidth="3" />
      <circle cx="120" cy="230" r="38" fill="#0891b2" stroke="#e0f2fe" strokeWidth="4" />
      <text x="120" y="238" textAnchor="middle" fill="#f8fafc" fontSize="24" fontWeight="900">Start</text>
      {branches.map(([label, x, y, color], index) => (
        <g key={`${label}-${x}-${y}`}>
          <line x1={index < 2 ? 158 : 338} y1={index < 2 ? 230 : index < 4 ? 160 : 300} x2={x - 38} y2={y} stroke={index <= activeStep + 1 ? color : "#475569"} strokeWidth="5" opacity={index < 4 ? 1 : 0.45} />
          <circle cx={x} cy={y} r="36" fill={index <= activeStep + 1 ? color : "#334155"} stroke="#e0f2fe" strokeWidth="4" />
          <text x={x} y={y + 8} textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="900">{label}</text>
        </g>
      ))}
      <text x="365" y="390" fill="#fef08a" fontSize="24" fontWeight="900">partition first, then add or condition without double counting</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function DistributionSamplingVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("central") ? "standardized sums settle into a bell shape" : title.includes("large") ? "sample average stabilizes with n" : title.includes("poisson") ? "many rare trials approach Poisson counts" : "distribution rule comes from reproducible sampling structure";
  const bars = [26, 54, 92, 132, 168, 132, 92, 54, 26];
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} distribution sampling visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M115 305H790M155 80V335" stroke="#475569" strokeWidth="3" />
      {bars.map((height, index) => <rect key={index} x={210 + index * 46} y={305 - height} width="32" height={height} fill={index <= activeStep + 4 ? "#38bdf866" : "#334155"} stroke="#67e8f9" />)}
      <path d="M188 292C260 246 292 128 418 128S575 246 650 292" fill="none" stroke={activeStep >= 2 ? "#fbbf24" : "#64748b"} strokeWidth="5" />
      {[0, 1, 2, 3, 4].map((index) => <circle key={index} cx={675 + index * 24} cy={118 + (index % 2) * 28} r="9" fill={index <= activeStep ? "#a78bfa" : "#64748b"} />)}
      <text x="530" y="360" fill="#f8fafc" fontSize="23" fontWeight="900">{caption}</text>
      <text x="178" y="374" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="21" fontWeight="900">simulation supports intuition; assumptions provide the proof</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function ExpectationVarianceVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("variance") ? "center shifts vanish, scales square deviations" : title.includes("tower") ? "average within groups, then average groups" : "weighted contributions regroup without independence";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} expectation variance visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <line x1="150" y1="255" x2="760" y2="255" stroke="#475569" strokeWidth="5" />
      <polygon points="450,116 426,255 474,255" fill="#fbbf2444" stroke="#fbbf24" strokeWidth="4" />
      {[["x1", 245, 210, "#06b6d4"], ["x2", 385, 170, "#8b5cf6"], ["x3", 565, 192, "#22c55e"], ["x4", 680, 226, "#fb7185"]].map(([label, x, y, color], index) => (
        <g key={label}>
          <line x1={Number(x)} y1={Number(y)} x2={Number(x)} y2="255" stroke={index <= activeStep ? String(color) : "#64748b"} strokeWidth="5" />
          <circle cx={Number(x)} cy={Number(y)} r="20" fill={index <= activeStep ? String(color) : "#334155"} stroke="#fff" strokeWidth="3" />
          <text x={Number(x)} y={Number(y) + 7} textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900">{label}</text>
        </g>
      ))}
      <text x="322" y="318" fill="#e0f2fe" fontSize="23" fontWeight="900">mean is the balance point</text>
      <text x="240" y="374" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="23" fontWeight="900">{caption}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function RegressionCorrelationVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} regression correlation visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M130 320H780M175 80V345" stroke="#475569" strokeWidth="3" />
      {[[245, 260], [310, 226], [365, 238], [430, 188], [505, 176], [570, 142], [635, 158]].map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="9" fill={index <= activeStep + 2 ? "#67e8f9" : "#64748b"} />
          <line x1={x} y1={y} x2={x} y2={286 - (x - 220) * 0.28} stroke={activeStep >= 1 ? "#fb7185" : "#475569"} strokeWidth="4" strokeDasharray="7 7" />
        </g>
      ))}
      <line x1="220" y1="286" x2="675" y2="158" stroke="#fbbf24" strokeWidth="5" />
      <rect x="705" y="105" width="78" height="126" fill={activeStep >= 2 ? "#8b5cf633" : "#334155"} stroke="#c4b5fd" strokeWidth="4" />
      <text x="515" y="350" fill="#f8fafc" fontSize="23" fontWeight="900">least squares minimizes vertical residual squares</text>
      <text x="195" y="378" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="21" fontWeight="900">correlation is bounded by vector Cauchy-Schwarz, not causation</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function InferenceInequalityVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
  const title = theorem.title.toLowerCase();
  const caption = title.includes("neyman") ? "likelihood-ratio region maximizes power" : title.includes("cramer") ? "information bounds estimator variance" : title.includes("jensen") ? "convex curve sits below chord average" : "tail area is bounded by mean or variance";
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} inference inequality visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <path d="M125 305H780M165 80V335" stroke="#475569" strokeWidth="3" />
      <path d="M165 290C250 260 302 105 435 132S600 268 760 286" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <rect x="600" y="90" width="160" height="215" fill={activeStep >= 1 ? "#fb718522" : "transparent"} stroke={activeStep >= 1 ? "#fb7185" : "#475569"} strokeWidth="4" strokeDasharray="10 8" />
      <line x1="220" y1="270" x2="672" y2="112" stroke={activeStep >= 2 ? "#fbbf24" : "#64748b"} strokeWidth="5" />
      <circle cx="430" cy="132" r="10" fill="#fbbf24" />
      <text x="525" y="350" fill="#f8fafc" fontSize="23" fontWeight="900">{caption}</text>
      <text x="205" y="378" fill={activeStep >= 3 ? "#86efac" : "#94a3b8"} fontSize="21" fontWeight="900">conditions decide whether this is a proof, bound, or test rule</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function GeneralTheoremVisual({ activeStep, activeTitle, category, theorem, totalSteps }: { activeStep: number; activeTitle: string; category: TheoremCategory; theorem: TheoremLibraryItem; totalSteps: number }) {
  const nodes = ["Givens", "Conditions", "Key relation", "Conclusion"];
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      {nodes.map((label, index) => {
        const x = 145 + index * 205;
        const active = index <= Math.min(activeStep, nodes.length - 1);
        return (
          <g key={label}>
            {index > 0 ? <line x1={x - 160} x2={x - 45} y1="230" y2="230" stroke={active ? "#67e8f9" : "#475569"} strokeWidth="6" strokeLinecap="round" /> : null}
            <rect x={x - 55} y="175" width="110" height="110" rx="14" fill={active ? "#0891b2" : "#334155"} stroke={active ? "#a7f3d0" : "#94a3b8"} strokeWidth="4" />
            <text x={x} y="225" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="900">{label}</text>
            <text x={x} y="250" textAnchor="middle" fill="#dbeafe" fontSize="14" fontWeight="800">{index + 1}</text>
          </g>
        );
      })}
      <text x="450" y="340" textAnchor="middle" fill="#fef08a" fontSize="24" fontWeight="900">{category.title}</text>
      <ProofStepBadges activeStep={activeStep} totalSteps={totalSteps} />
    </svg>
  );
}

function TheoremVisualTitle({ activeTitle, theorem }: { activeTitle: string; theorem: TheoremLibraryItem }) {
  return (
    <g>
      <text x="36" y="48" fill="#f8fafc" fontSize="26" fontWeight="900">{truncateSvgText(theorem.title, 44)}</text>
      <text x="36" y="82" fill="#bae6fd" fontSize="18" fontWeight="800">{truncateSvgText(activeTitle, 70)}</text>
    </g>
  );
}

function ProofStepBadges({ activeStep, totalSteps }: { activeStep: number; totalSteps: number }) {
  return (
    <g>
      {Array.from({ length: totalSteps }, (_, index) => (
        <circle key={`proof-dot-${index}`} cx={620 + index * 28} cy="48" r="8" fill={index <= activeStep ? "#fbbf24" : "#475569"} />
      ))}
    </g>
  );
}

function truncateSvgText(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0, limit - 3)}...` : value;
}

function DetailedExplanationPanel({ theorem }: { theorem: TheoremLibraryItem }) {
  return (
    <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/40">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
        <BookOpenCheck className="h-4 w-4" />
        Detailed Explanation
      </p>
      <p className="mt-2 text-base font-semibold leading-7 text-slate-700 dark:text-slate-200"><InlineMathText value={theorem.detailedExplanation} /></p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <LearningCue icon={<Target className="h-4 w-4" />} title="Check" text="Identify the theorem's conditions before using the result." />
        <LearningCue icon={<Sigma className="h-4 w-4" />} title="Apply" text="Substitute the known values, relations, or objects into the conclusion." />
        <LearningCue icon={<CheckCircle2 className="h-4 w-4" />} title="Verify" text="Match the final result back to the original problem or proof target." />
      </div>
    </section>
  );
}

function TheoremExamplesPanel({ theorem }: { theorem: TheoremLibraryItem }) {
  return (
    <section className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-300/20 dark:bg-emerald-400/10">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
        <Lightbulb className="h-4 w-4" />
        Examples and Uses
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {theorem.examples.map((example, index) => (
          <article key={`${example.title}-${index}`} className="rounded-lg border border-white bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-emerald-600 text-sm font-black text-white">{index + 1}</span>
              <div className="min-w-0">
                <h3 className="text-base font-black leading-tight text-slate-950 dark:text-white">{example.title}</h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200"><InlineMathText value={example.scenario} /></p>
                <p className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold leading-5 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100">
                  <InlineMathText value={example.takeaway} />
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LearningCue({ icon, text, title }: { icon: ReactNode; text: string; title: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
      <p className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
        {icon}
        {title}
      </p>
      <p className="mt-1 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function RelatedLinkStrip({ compact, related }: { compact?: boolean; related: RelatedLearningLinks }) {
  const visualProof = related.visualProofs[0];
  const formula = related.formulas[0];
  if (!visualProof && !formula) return null;

  return (
    <div className={`mt-2 flex flex-wrap gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      {visualProof ? (
        <Link className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-1 font-black text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100" to={visualProof.route}>
          <Sparkles className="h-3.5 w-3.5" />
          Visual proof
        </Link>
      ) : null}
      {formula ? (
        <Link className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-black text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200" to={formula.route}>
          <Sigma className="h-3.5 w-3.5" />
          Formula
        </Link>
      ) : null}
    </div>
  );
}

function RelatedLearningPanel({ related }: { related: RelatedLearningLinks }) {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-white/10">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
        <Link2 className="h-4 w-4" />
        Connected learning
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <RelatedList title="Visual Proofs" icon={<Sparkles className="h-4 w-4" />} empty="Visual proof can be added next.">
          {related.visualProofs.map((proof) => (
            <Link key={proof.route} className="rounded-md bg-cyan-50 px-2 py-1.5 text-sm font-bold text-cyan-800 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100" to={proof.route}>
              {proof.title}
            </Link>
          ))}
        </RelatedList>
        <RelatedList title="Formula Links" icon={<Sigma className="h-4 w-4" />} empty="No close formula section found.">
          {related.formulas.map((formula) => (
            <Link key={`${formula.category.id}-${formula.title}`} className="rounded-md bg-slate-100 px-2 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200" to={formula.route}>
              {formula.title}
            </Link>
          ))}
        </RelatedList>
        <RelatedList title="Related Theorems" icon={<BookOpen className="h-4 w-4" />} empty="No close theorem neighbor found.">
          {related.theorems.map((theorem) => (
            <Link key={theorem.route} className="rounded-md bg-white px-2 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:bg-slate-950" to={theorem.route}>
              {theorem.title}
            </Link>
          ))}
        </RelatedList>
      </div>
    </div>
  );
}

function RelatedList({ children, empty, icon, title }: { children: ReactNode; empty: string; icon: ReactNode; title: string }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const hasItems = Array.isArray(items) ? items.length > 0 : Boolean(items);
  return (
    <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        {title}
      </p>
      <div className="mt-2 grid gap-1.5">
        {hasItems ? items : <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{empty}</span>}
      </div>
    </div>
  );
}

function InfoPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200"><InlineMathText value={text} /></p>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-white/10 dark:bg-white/5">
      <p className="text-lg font-black leading-none text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function CategoryChip({ active, children, to }: { active: boolean; children: string; to: string }) {
  return (
    <Link
      className={`shrink-0 snap-start whitespace-nowrap rounded-md border px-2.5 py-2 text-center text-[11px] font-black leading-none transition sm:max-w-[190px] sm:whitespace-normal sm:px-3 sm:text-xs sm:leading-tight ${
        active
          ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-100"
      }`}
      to={to}
    >
      {children}
    </Link>
  );
}

function statusLabel(status: TheoremLibraryItem["proofStatus"]) {
  if (status === "visual-ready") return "Visual ready";
  if (status === "draft-ready") return "Draft proof";
  if (status === "scaffold-ready") return "Reference page";
  return "Proof needed";
}

function statusTone(status: TheoremLibraryItem["proofStatus"]) {
  if (status === "visual-ready") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100";
  if (status === "draft-ready") return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-100";
  if (status === "scaffold-ready") return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-300/30 dark:bg-violet-300/10 dark:text-violet-100";
  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100";
}

function isReferenceTheorem(theorem: Pick<TheoremLibraryItem, "proofStatus" | "proofSteps">) {
  return theorem.proofStatus === "scaffold-ready" || !theorem.proofSteps?.length;
}

const theoremToProofCategory: Record<string, string[]> = {
  algebra: ["algebraic-identities", "inequalities", "logarithms-exponents"],
  geometry: ["geometry", "mensuration", "transformations-symmetry"],
  trigonometry: ["trigonometry"],
  "coordinate-geometry": ["coordinate-geometry", "conic-sections", "transformations-symmetry"],
  "calculus-analysis": ["calculus", "engineering-mathematics"],
  "number-theory": ["number-theory"],
  "probability-statistics": ["probability", "statistics"],
  "linear-algebra-vectors": ["matrices-linear-algebra", "vectors"],
  "complex-numbers": ["complex-numbers"],
  "discrete-logic": ["sequences-and-series", "number-theory"],
  "graph-theory": ["engineering-mathematics"],
  "optimization-engineering": ["engineering-mathematics", "calculus"],
};

const theoremToFormulaCategory: Record<string, string[]> = {
  algebra: ["algebra", "polynomials", "inequalities", "relations-functions", "precalculus"],
  geometry: ["geometry", "euclidean-geometry-theorems", "mensuration-units"],
  trigonometry: ["trigonometry"],
  "coordinate-geometry": ["coordinate-geometry", "analytic-geometry-advanced", "three-d-geometry"],
  "calculus-analysis": ["limits-continuity", "derivatives", "integrals", "differential-equations", "multivariable-calculus"],
  "number-theory": ["number-systems", "olympiad-number-theory", "cryptography-math"],
  "probability-statistics": ["probability", "statistics", "probability-distributions"],
  "linear-algebra-vectors": ["matrices", "determinants", "vectors", "linear-algebra-advanced"],
  "complex-numbers": ["complex-numbers", "complex-analysis"],
  "discrete-logic": ["combinatorics", "set-theory-logic", "discrete-math", "sequences-series"],
  "graph-theory": ["discrete-math", "combinatorics"],
  "optimization-engineering": ["optimization", "linear-programming", "numerical-methods", "fourier-laplace-transforms", "pde"],
};

const stopWords = new Set([
  "theorem",
  "rule",
  "identity",
  "formula",
  "criterion",
  "principle",
  "law",
  "test",
  "for",
  "and",
  "with",
  "from",
  "into",
  "that",
  "this",
  "exactly",
  "every",
  "function",
  "functions",
]);

function getRelatedLearningLinks(theorem: TheoremLibraryItem, category: TheoremCategory): RelatedLearningLinks {
  const curated = getCuratedTheoremLearningLinks(category.id, theorem.title);
  const tokens = getSearchTokens([theorem.title, theorem.subtopic, theorem.statement, theorem.prerequisites.join(" ")]);
  const visualCategoryHints = new Set(theoremToProofCategory[category.id] ?? []);
  const formulaCategoryHints = new Set(theoremToFormulaCategory[category.id] ?? []);

  const heuristicVisualProofs = visualProofsIndex
    .filter((proof) => proof.status === "available")
    .map((proof) => ({
      proof,
      score:
        scoreText(tokens, [proof.title, proof.shortDescription, proof.longDescription, proof.tags.join(" "), proof.prerequisites.join(" ")]) +
        (visualCategoryHints.has(proof.categorySlug) ? 4 : 0),
    }))
    .filter((match) => match.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ proof }) => ({ title: proof.title, route: proof.route, categorySlug: proof.categorySlug }));

  const heuristicFormulas = formulaCategories
    .flatMap((formulaCategory) =>
      formulaCategory.formulas.map((formula) => ({
        ...formula,
        category: formulaCategory,
        route: `/formulas/${formulaCategory.id}`,
        score:
          scoreText(tokens, [formula.title, formula.formula, formula.note, formulaCategory.title, formulaCategory.description]) +
          (formulaCategoryHints.has(formulaCategory.id) ? 3 : 0),
      })),
    )
    .filter((match) => match.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...formula }) => formula);

  const heuristicTheorems = theoremCategories
    .flatMap((theoremCategory) =>
      theoremCategory.theorems.map((candidate) => ({
        ...candidate,
        category: theoremCategory,
        route: `/theorems/${theoremCategory.id}/${candidate.slug}`,
        score:
          scoreText(tokens, [candidate.title, candidate.subtopic, candidate.statement, candidate.prerequisites.join(" ")]) +
          (theoremCategory.id === category.id ? 2 : 0),
      })),
    )
    .filter((candidate) => candidate.slug !== theorem.slug && candidate.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...candidate }) => candidate);

  return {
    formulas: uniqueRelatedByRoute([...curated.formulas, ...heuristicFormulas]).slice(0, 3),
    visualProofs: uniqueRelatedByRoute([...curated.visualProofs, ...heuristicVisualProofs]).slice(0, 3),
    theorems: uniqueRelatedByRoute([...curated.theorems, ...heuristicTheorems]).slice(0, 3),
  };
}

function uniqueRelatedByRoute<T extends { route: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.route, item])).values());
}

function getSearchTokens(parts: string[]) {
  return Array.from(
    new Set(
      parts
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 3 && !stopWords.has(token)),
    ),
  );
}

function scoreText(tokens: string[], parts: string[]) {
  const haystack = parts.join(" ").toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}
