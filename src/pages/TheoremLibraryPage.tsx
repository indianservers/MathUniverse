import { Archive, Bookmark, BookmarkCheck, BookOpen, BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, Eye, GraduationCap, Lightbulb, Link2, ListFilter, Maximize2, Play, RotateCcw, Search, Sigma, SlidersHorizontal, Sparkles, Target, TriangleAlert } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { InlineMathText } from "../components/ui/MathExpression";
import { formulaCategories, type FormulaCategory, type FormulaLibraryItem } from "../data/formulaLibrary";
import { theoremCategories, theoremCount, type TheoremCategory, type TheoremLibraryItem, type TheoremProofStep } from "../data/theoremLibrary";
import { getCuratedTheoremLearningLinks } from "../proof-explanations/proofLearningLinks";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_88%_0%,rgba(196,181,253,.28),transparent_34%),linear-gradient(135deg,#f8fdff_0%,#f5f8ff_46%,#fbf7ff_100%)] px-3 py-3 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-6">
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
    <div className="grid max-h-none gap-3 xl:max-h-[calc(100vh-24px)] xl:grid-rows-[auto_minmax(0,1fr)_auto]">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <nav className="flex items-center gap-2 text-sm font-bold text-slate-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-cyan-700">Home</Link>
            <span>&gt;</span>
            <span className="text-slate-700">Theorems</span>
          </nav>
          <p className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700">
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

      <section className="min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white/96 shadow-sm">
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
              featuredRow={featuredRow}
              proofSteps={proofSteps}
              currentStep={currentStep}
              activeStep={activeStep}
              activeTool={activeTool}
              saved={savedKeys.includes(featuredRow.key)}
              exploredPercent={exploredPercent}
              exploredCount={exploredValidCount}
              related={related}
              searchRows={searchRows}
              onCategory={selectCategory}
              onStep={setActiveStep}
              onTool={setActiveTool}
              onSave={() => toggleSaved(featuredRow.key)}
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
  featuredRow,
  proofSteps,
  currentStep,
  activeStep,
  activeTool,
  saved,
  exploredPercent,
  exploredCount,
  related,
  searchRows,
  onCategory,
  onStep,
  onTool,
  onSave,
  onExplore,
  onOpenRow,
}: {
  selectedCategory: TheoremCategory;
  featuredRow: TheoremSheetRow;
  proofSteps: TheoremProofStep[];
  currentStep: TheoremProofStep;
  activeStep: number;
  activeTool: StudioTool;
  saved: boolean;
  exploredPercent: number;
  exploredCount: number;
  related: RelatedLearningLinks;
  searchRows: TheoremSheetRow[];
  onCategory: (categoryId: string) => void;
  onStep: (step: number) => void;
  onTool: (tool: StudioTool) => void;
  onSave: () => void;
  onExplore: () => void;
  onOpenRow: (row: TheoremSheetRow) => void;
}) {
  return (
    <div className="grid min-h-0 gap-3 xl:max-h-[430px] xl:grid-cols-[250px_minmax(0,1fr)_310px]">
      <aside className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Theorem Map</p>
          <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-200 text-xs font-black text-slate-400">i</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto pr-1">
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
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><Sparkles className="h-4 w-4" />Featured Visual Proof</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black leading-tight text-slate-950">{featuredRow.title}</h2>
              <span className="rounded-md bg-cyan-600 px-2 py-1 text-[10px] font-black text-white">{featuredRow.category.title}</span>
              <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-700">{studioDifficulty(featuredRow)}</span>
            </div>
          </div>
          <button type="button" onClick={onSave} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700" title={saved ? "Remove saved theorem" : "Save theorem"} aria-label={saved ? "Remove saved theorem" : "Save theorem"}>
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>
        <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
              {featuredRow.title.toLowerCase().includes("pythagorean") ? (
                <PythagoreanStudioCanvas activeStep={activeStep} activeTitle={currentStep.title} />
              ) : (
                <TheoremVisualCanvas category={featuredRow.category} theorem={featuredRow} activeStep={activeStep} totalSteps={proofSteps.length} activeTitle={currentStep.title} />
              )}
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_150px_75px_92px]">
              <button type="button" onClick={() => onStep(activeStep >= proofSteps.length - 1 ? 0 : activeStep + 1)} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"><Play className="h-4 w-4" />Animate Proof</button>
              <div className="grid grid-cols-[32px_1fr_32px] rounded-lg border border-slate-200">
                <button type="button" onClick={() => onStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} className="grid place-items-center disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <span className="grid place-items-center text-xs font-black text-slate-600">Step {activeStep + 1} of {proofSteps.length}</span>
                <button type="button" onClick={() => onStep(Math.min(proofSteps.length - 1, activeStep + 1))} disabled={activeStep === proofSteps.length - 1} className="grid place-items-center disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
              <button type="button" onClick={() => onStep(0)} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 text-xs font-black text-slate-600"><RotateCcw className="h-4 w-4" />Reset</button>
              <Link to={`/theorems/${featuredRow.category.id}/${featuredRow.slug}`} onClick={onExplore} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 text-xs font-black text-slate-600"><Maximize2 className="h-4 w-4" />Fullscreen</Link>
            </div>
          </div>
          <aside className="rounded-lg bg-slate-50 p-3">
            <p className="text-lg font-bold leading-7 text-slate-700"><TheoremStatement value={featuredRow.statement} /></p>
            <div className="my-4 h-px bg-slate-200" />
            <p className="text-3xl font-black text-slate-950"><InlineMathText value={formulaForTheorem(featuredRow)} /></p>
            <div className="mt-5 grid gap-2">
              <Link to={related.visualProofs[0]?.route ?? `/theorems/${featuredRow.category.id}/${featuredRow.slug}`} onClick={onExplore} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 text-sm font-black text-white transition hover:bg-cyan-700">Open Visual Proof <ChevronRight className="h-4 w-4" /></Link>
              <Link to={`/theorems/${featuredRow.category.id}/${featuredRow.slug}`} onClick={onExplore} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"><BookOpen className="h-4 w-4" />Read Proof</Link>
            </div>
          </aside>
        </div>
      </section>

      <aside className="overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Studio Tools</p>
        <div className="grid gap-1">
          {studioToolItems.map((tool) => (
            <button key={tool.id} type="button" onClick={() => onTool(tool.id)} className={`grid grid-cols-[28px_minmax(0,1fr)] items-center gap-2 rounded-lg border px-2 py-2 text-left transition ${activeTool === tool.id ? "border-cyan-300 bg-cyan-50" : "border-transparent hover:bg-slate-50"}`}>
              {tool.icon}
              <span><strong className="block text-sm font-black text-slate-800">{tool.label}</strong><small className="block text-xs font-semibold text-slate-500">{tool.caption}</small></span>
            </button>
          ))}
        </div>
        <div className="my-3 h-px bg-slate-200" />
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Proof Journey</p>
        <div className="grid grid-cols-4 gap-1 text-center">
          {proofSteps.map((step, index) => (
            <button key={`${step.title}-${index}`} type="button" onClick={() => onStep(index)} className="min-w-0">
              <span className={`mx-auto grid h-8 w-8 place-items-center rounded-full border text-sm font-black ${index === activeStep ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300 bg-slate-50 text-slate-500"}`}>{index + 1}</span>
              <span className={`mt-1 block truncate text-[10px] font-black ${index === activeStep ? "text-cyan-700" : "text-slate-500"}`}>{step.title}</span>
            </button>
          ))}
        </div>
        <StudioToolDetail tool={activeTool} theorem={featuredRow} step={currentStep} related={related} searchRows={searchRows} onOpenRow={onOpenRow} />
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
      <text x="300" y="238" fill="#67e8f9" fontSize="30" fontWeight="900">a²</text>
      {showB ? <text x="520" y="374" fill="#c4b5fd" fontSize="30" fontWeight="900">b²</text> : null}
      {showC ? <text x="505" y="270" fill="#fbbf24" fontSize="30" fontWeight="900">c²</text> : null}
      {showFormula ? <text x="600" y="337" fill="#f8fafc" fontSize="36" fontWeight="900">a² + b² = c²</text> : null}
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
  return (
    <div className="grid min-h-[500px] gap-3 xl:grid-cols-[220px_minmax(0,1fr)_280px]">
      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-black uppercase tracking-wide text-slate-500">Elements</p>{["Given", "Diagram", "Relation", "Conclusion", "Annotation"].map((item) => <button key={item} type="button" className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-black text-slate-700">{item}</button>)}</aside>
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
  const named: Record<string, string> = { Algebra: "x²", Geometry: "△", Trigonometry: "∿", "Number Theory": "#", "Graph Theory": "⌘" };
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
  if (category.id === "geometry" || category.id === "coordinate-geometry" || theorem.subtopic.toLowerCase().includes("triangle") || theorem.title.toLowerCase().includes("angle")) {
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

function GeometryTheoremVisual({ activeStep, activeTitle, theorem, totalSteps }: { activeStep: number; activeTitle: string; theorem: TheoremLibraryItem; totalSteps: number }) {
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
  const branches = [
    ["A", 300, 160, "#22c55e"],
    ["not A", 300, 300, "#f97316"],
    ["B", 610, 120, "#38bdf8"],
    ["not B", 610, 220, "#a78bfa"],
    ["B", 610, 275, "#38bdf8"],
    ["not B", 610, 360, "#a78bfa"],
  ] as const;
  return (
    <svg viewBox="0 0 900 420" role="img" aria-label={`${theorem.title} visual proof`} className="h-[340px] w-full max-w-full bg-slate-950">
      <TheoremVisualTitle theorem={theorem} activeTitle={activeTitle} />
      <circle cx="120" cy="230" r="38" fill="#0891b2" stroke="#e0f2fe" strokeWidth="4" />
      <text x="120" y="238" textAnchor="middle" fill="#f8fafc" fontSize="24" fontWeight="900">Start</text>
      {branches.map(([label, x, y, color], index) => (
        <g key={`${label}-${x}-${y}`}>
          <line x1={index < 2 ? 158 : 338} y1={index < 2 ? 230 : index < 4 ? 160 : 300} x2={x - 38} y2={y} stroke={index <= activeStep + 1 ? color : "#475569"} strokeWidth="5" />
          <circle cx={x} cy={y} r="36" fill={index <= activeStep + 1 ? color : "#334155"} stroke="#e0f2fe" strokeWidth="4" />
          <text x={x} y={y + 8} textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="900">{label}</text>
        </g>
      ))}
      <text x="365" y="390" fill="#fef08a" fontSize="24" fontWeight="900">combine branches under the theorem conditions</text>
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
