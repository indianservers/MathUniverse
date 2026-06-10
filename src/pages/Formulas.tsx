import { clsx } from "clsx";
import katex from "katex";
import {
  Atom,
  BookMarked,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Brain,
  Calculator,
  ChevronDown,
  Copy,
  Download,
  Eye,
  FileText,
  Filter,
  FlaskConical,
  GraduationCap,
  Grid3X3,
  Highlighter,
  Layers3,
  LayoutList,
  Lightbulb,
  Link as LinkIcon,
  List,
  Maximize,
  Minimize,
  Printer,
  RotateCcw,
  Search,
  Share2,
  Shuffle,
  Sigma,
  Sparkles,
  Star,
  Target,
  Trophy,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { type ComponentType, type CSSProperties, type Dispatch, type SetStateAction, type SVGProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import { formulaCategories, formulaCategoryCount, type FormulaCategory, type FormulaLibraryItem } from "../data/formulaLibrary";

type FormulaLevel = "KG" | "Primary" | "Middle" | "High School" | "UG" | "PG" | "PhD";
type FormulaGroup =
  | "Arithmetic & Number Sense"
  | "Algebra & Functions"
  | "Geometry & Measurement"
  | "Trigonometry & Precalculus"
  | "Calculus & Analysis"
  | "Linear Algebra & Vectors"
  | "Probability & Statistics"
  | "Discrete Math & Logic"
  | "Optimization & Modeling"
  | "Transforms & Differential Equations"
  | "Advanced Structures"
  | "Computing & Data Science";
type FormulaUsage = "Basics" | "Exam" | "Graphing" | "Geometry" | "Proof" | "Computation" | "Modeling";
type FormulaTag = string;
type ViewMode = "grid" | "list" | "compact";
type ScopeMode = "all" | "basic" | "advanced";
type ProgressState = "new" | "viewed" | "mastered" | "revision";
type ProgressFilter = "All" | ProgressState;

type FormulaLineRecord = {
  id: string;
  category: FormulaCategory;
  item: FormulaLibraryItem;
  formula: string;
  lineIndex: number;
  title: string;
  slug: string;
  haystack: string;
  level: FormulaLevel;
  group: FormulaGroup;
  usage: FormulaUsage[];
  examTags: string[];
  tags: FormulaTag[];
  symbols: string[];
  variables: string[];
  popularity: number;
  addedRank: number;
};

type FormulaShapeSection = {
  id: string;
  title: string;
  description: string;
  searchTerm: string;
  records: FormulaLineRecord[];
};

type CategoryGroup = {
  id: FormulaGroup;
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
  children: CategoryNode[];
};

type CategoryNode = {
  id: string;
  title: string;
  description?: string;
  categoryIds?: string[];
  children?: CategoryNode[];
};

type CategoryNodeWithCategories = Omit<CategoryNode, "children"> & {
  categories: FormulaCategory[];
  children?: CategoryNodeWithCategories[];
};

type CategoryGroupWithCategories = Omit<CategoryGroup, "children"> & {
  children: CategoryNodeWithCategories[];
};

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "Arithmetic & Number Sense",
    title: "Arithmetic & Number Sense",
    icon: Calculator,
    description: "Numbers, fractions, percentages, units, mental math, and exam arithmetic.",
    children: [
      { id: "number-basics", title: "Number Basics", categoryIds: ["early-number-sense", "number-systems"] },
      { id: "fractions-percent", title: "Fractions, Decimals, Percent", categoryIds: ["fractions-decimals-percent"] },
      { id: "commercial-mental", title: "Commercial and Mental Math", categoryIds: ["commercial-math", "mental-math"] },
      { id: "number-theory", title: "Number Theory", categoryIds: ["olympiad-number-theory"] },
    ],
  },
  {
    id: "Algebra & Functions",
    title: "Algebra & Functions",
    icon: Sigma,
    description: "Algebraic manipulation, equations, inequalities, relations, and functions.",
    children: [
      { id: "foundational-algebra", title: "Foundational Algebra", categoryIds: ["pre-algebra", "algebra"] },
      { id: "polynomials-inequalities", title: "Polynomials and Inequalities", categoryIds: ["polynomials", "inequalities"] },
      { id: "relations-functions", title: "Relations, Functions, Sequences", categoryIds: ["relations-functions", "sequences-series"] },
      { id: "complex-numbers", title: "Complex Numbers", categoryIds: ["complex-numbers"] },
    ],
  },
  {
    id: "Geometry & Measurement",
    title: "Geometry & Measurement",
    icon: Layers3,
    description: "2D shapes, solids, coordinate geometry, conics, and measurement.",
    children: [
      {
        id: "plane-geometry",
        title: "Plane Geometry",
        children: [
          { id: "shape-formulas", title: "Shapes and Measures", categoryIds: ["geometry", "mensuration-units"] },
          { id: "circle-conics", title: "Circles and Conics", categoryIds: ["coordinate-geometry", "analytic-geometry-advanced"] },
          { id: "euclidean-theorems", title: "Theorems", categoryIds: ["euclidean-geometry-theorems"] },
        ],
      },
      { id: "solid-geometry", title: "Solid Geometry", categoryIds: ["three-d-geometry"] },
      { id: "advanced-geometry", title: "Advanced Geometry", categoryIds: ["differential-geometry"] },
    ],
  },
  {
    id: "Trigonometry & Precalculus",
    title: "Trigonometry & Precalculus",
    icon: Target,
    description: "Trigonometric identities, inverse trig, polar ideas, and precalculus.",
    children: [
      { id: "trigonometry-core", title: "Trigonometry", categoryIds: ["trigonometry"] },
      { id: "precalculus-core", title: "Precalculus", categoryIds: ["precalculus"] },
    ],
  },
  {
    id: "Calculus & Analysis",
    title: "Calculus & Analysis",
    icon: Sparkles,
    description: "Limits, derivatives, integrals, applications, multivariable calculus, and analysis.",
    children: [
      { id: "single-variable-calculus", title: "Single Variable Calculus", categoryIds: ["limits-continuity", "derivatives", "integrals", "calculus-applications"] },
      { id: "multivariable-calculus", title: "Multivariable Calculus", categoryIds: ["multivariable-calculus"] },
      { id: "analysis-foundations", title: "Analysis Foundations", categoryIds: ["real-analysis", "complex-analysis"] },
    ],
  },
  {
    id: "Linear Algebra & Vectors",
    title: "Linear Algebra & Vectors",
    icon: Grid3X3,
    description: "Matrices, determinants, vectors, eigen ideas, and advanced linear algebra.",
    children: [
      { id: "matrices-determinants", title: "Matrices and Determinants", categoryIds: ["matrices", "determinants"] },
      { id: "vectors-3d", title: "Vectors and 3D Geometry", categoryIds: ["vectors"] },
      { id: "advanced-linear-algebra", title: "Advanced Linear Algebra", categoryIds: ["linear-algebra-advanced"] },
    ],
  },
  {
    id: "Probability & Statistics",
    title: "Probability & Statistics",
    icon: Shuffle,
    description: "Probability, statistics, distributions, inference, and data formulas.",
    children: [
      { id: "probability-core", title: "Probability", categoryIds: ["probability"] },
      { id: "statistics-core", title: "Statistics", categoryIds: ["statistics"] },
      { id: "distributions-core", title: "Distributions", categoryIds: ["probability-distributions"] },
    ],
  },
  {
    id: "Discrete Math & Logic",
    title: "Discrete Math & Logic",
    icon: Atom,
    description: "Sets, logic, combinatorics, graph theory, and discrete structures.",
    children: [
      { id: "sets-logic", title: "Sets and Logic", categoryIds: ["set-theory-logic"] },
      { id: "counting-discrete", title: "Counting and Discrete Math", categoryIds: ["combinatorics", "discrete-math"] },
    ],
  },
  {
    id: "Optimization & Modeling",
    title: "Optimization & Modeling",
    icon: Trophy,
    description: "Linear programming, speed-time-work, commercial models, and applied optimization.",
    children: [
      { id: "linear-optimization", title: "Optimization", categoryIds: ["linear-programming", "optimization"] },
      { id: "competitive-models", title: "Speed, Work and Exams", categoryIds: ["competitive-speed-time-work"] },
      { id: "dynamical-models", title: "Dynamical Systems", categoryIds: ["dynamical-systems"] },
    ],
  },
  {
    id: "Transforms & Differential Equations",
    title: "Transforms & Differential Equations",
    icon: FlaskConical,
    description: "ODEs, PDEs, Fourier, Laplace, and mathematical physics.",
    children: [
      { id: "differential-equations-core", title: "Differential Equations", categoryIds: ["differential-equations", "pde"] },
      { id: "fourier-laplace", title: "Fourier and Laplace", categoryIds: ["fourier-laplace-transforms"] },
      { id: "physics-math", title: "Mathematical Physics", categoryIds: ["mathematical-physics"] },
    ],
  },
  {
    id: "Advanced Structures",
    title: "Advanced Structures",
    icon: GraduationCap,
    description: "Abstract algebra, topology, measure theory, and functional analysis.",
    children: [
      { id: "abstract-structures", title: "Abstract Structures", categoryIds: ["abstract-algebra"] },
      { id: "topology-measure", title: "Topology and Measure", categoryIds: ["topology", "measure-theory", "functional-analysis"] },
    ],
  },
  {
    id: "Computing & Data Science",
    title: "Computing & Data Science",
    icon: Brain,
    description: "Numerical methods, information theory, machine learning, and cryptography math.",
    children: [
      { id: "numerical-computation", title: "Numerical Computation", categoryIds: ["numerical-methods"] },
      { id: "data-information", title: "Information and ML", categoryIds: ["information-theory", "machine-learning-math"] },
      { id: "security-math", title: "Cryptography", categoryIds: ["cryptography-math"] },
    ],
  },
];

const LEVELS: FormulaLevel[] = ["KG", "Primary", "Middle", "High School", "UG", "PG", "PhD"];
const USAGE_FILTERS: FormulaUsage[] = ["Basics", "Exam", "Graphing", "Geometry", "Proof", "Computation", "Modeling"];
const EXAM_FILTERS = ["CBSE", "NCERT", "JEE", "NEET", "SAT", "GRE", "GATE", "Olympiad"];
const PRIORITY_TAGS = [
  "angle",
  "length",
  "distance",
  "speed",
  "time",
  "work",
  "rate",
  "area",
  "volume",
  "surface area",
  "perimeter",
  "2D",
  "3D",
  "space",
  "circle",
  "triangle",
  "polygon",
  "solid",
  "line",
  "slope",
  "coordinate",
  "vector",
  "matrix",
  "graph",
  "function",
  "derivative",
  "integral",
  "probability",
  "statistics",
  "distribution",
  "train",
  "boat",
  "race",
  "pipe",
  "efficiency",
  "exam",
  "proof",
  "units",
];

const EXAM_PRESETS: Record<string, string[]> = {
  "Board Sheet": ["algebra", "trigonometry", "geometry", "coordinate-geometry", "statistics", "probability"],
  "JEE Core": ["algebra", "trigonometry", "limits-continuity", "derivatives", "integrals", "coordinate-geometry", "vectors", "three-d-geometry", "matrices", "determinants"],
  "Applied Core": ["calculus", "linear-algebra", "differential-equations", "vectors", "probability-distributions", "complex-numbers"],
  "Research": ["abstract-algebra", "real-analysis", "complex-analysis", "topology", "measure-theory", "functional-analysis"],
};

const SEARCH_SYNONYMS: Record<string, string[]> = {
  "area circle": ["circle area", "pi r^2", "πr²"],
  "circumference circle": ["circle circumference", "2 pi r", "perimeter circle"],
  "quadratic roots": ["quadratic formula", "discriminant"],
  "slope line": ["gradient", "rise over run"],
  "normal distribution": ["gaussian", "bell curve"],
  "bayes": ["conditional probability", "posterior"],
  "vector length": ["magnitude", "norm"],
  "speed distance": ["time distance", "relative speed", "average speed", "train crosses", "boat upstream"],
  "time and work": ["work rate", "combined work", "pipes cisterns", "efficiency"],
  "train problems": ["train crosses platform", "relative speed", "crossing trains"],
  "boat stream": ["upstream", "downstream", "still water", "stream speed"],
  "derivative": ["differentiation", "rate of change", "slope"],
  "integral": ["area under curve", "antiderivative"],
};

const CATEGORY_ICON_MAP: Array<{ test: string[]; icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { test: ["geometry", "circle", "triangle", "solid"], icon: Layers3 },
  { test: ["probability", "statistics", "distribution"], icon: Target },
  { test: ["calculus", "derivative", "integral", "limit"], icon: Wand2 },
  { test: ["matrix", "vector", "linear"], icon: Grid3X3 },
  { test: ["trigonometry", "complex"], icon: Atom },
  { test: ["exam", "olympiad"], icon: Trophy },
];

const STORAGE_KEYS = {
  bookmarks: "mathuniverse.formulas.bookmarks",
  recent: "mathuniverse.formulas.recent",
  progress: "mathuniverse.formulas.progress",
};

export default function Formulas() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [activeGroup, setActiveGroup] = useState<FormulaGroup | "All">("All");
  const [levelFilter, setLevelFilter] = useState<FormulaLevel | "All">("All");
  const [usageFilter, setUsageFilter] = useState<FormulaUsage | "All">("All");
  const [examFilter, setExamFilter] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<FormulaTag[]>([]);
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("All");
  const [scopeMode, setScopeMode] = useState<ScopeMode>("all");
  const [sortMode, setSortMode] = useState("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [revisionMode, setRevisionMode] = useState(false);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [familiesView, setFamiliesView] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => Object.fromEntries(CATEGORY_GROUPS.map((group) => [group.id, true])));
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = usePersistentStringList(STORAGE_KEYS.bookmarks);
  const [recent, setRecent] = usePersistentStringList(STORAGE_KEYS.recent);
  const [progress, setProgress] = usePersistentRecord<ProgressState>(STORAGE_KEYS.progress);

  const formulaRecords = useMemo(() => buildFormulaRecords(), []);
  const recordById = useMemo(() => new Map(formulaRecords.map((record) => [record.id, record])), [formulaRecords]);
  const selectedFromHash = useMemo(() => {
    const id = decodeURIComponent(location.hash.replace(/^#formula-/, ""));
    return id ? recordById.get(id) : undefined;
  }, [location.hash, recordById]);
  const [selectedId, setSelectedId] = useState<string>(selectedFromHash?.id ?? formulaRecords[0]?.id ?? "");
  const selectedRecord = recordById.get(selectedId) ?? selectedFromHash ?? formulaRecords[0];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const formula = params.get("formula");
    if (category && (category === "all" || formulaCategories.some((item) => item.id === category))) setActiveCategoryId(category);
    if (formula && recordById.has(formula)) setSelectedId(formula);
  }, [location.search, recordById]);

  useEffect(() => {
    if (!selectedFromHash) return;
    setSelectedId(selectedFromHash.id);
    setActiveCategoryId(selectedFromHash.category.id);
    setRecent((items) => [selectedFromHash.id, ...items.filter((id) => id !== selectedFromHash.id)].slice(0, 12));
    setProgress((items) => ({ ...items, [selectedFromHash.id]: items[selectedFromHash.id] ?? "viewed" }));
  }, [selectedFromHash, setProgress, setRecent]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const expandedQuery = useMemo(() => expandSearchQuery(query), [query]);
  const filteredRecords = useMemo(() => {
    let records = formulaRecords.filter((record) => {
      const categoryMatch = activeCategoryId === "all" || record.category.id === activeCategoryId;
      const groupMatch = activeGroup === "All" || record.group === activeGroup;
      const levelMatch = levelFilter === "All" || record.level === levelFilter;
      const usageMatch = usageFilter === "All" || record.usage.includes(usageFilter);
      const examMatch = examFilter === "All" || record.examTags.includes(examFilter);
      const tagMatch = selectedTags.length === 0 || selectedTags.every((tag) => record.tags.includes(tag));
      const progressMatch = progressFilter === "All" || (progress[record.id] ?? "new") === progressFilter;
      const scopeMatch = scopeMode === "all" || (scopeMode === "basic" ? isBasicLevel(record.level) : !isBasicLevel(record.level));
      const bookmarkMatch = !favoritesOnly || bookmarks.includes(record.id);
      const queryMatch = !expandedQuery || expandedQuery.every((term) => record.haystack.includes(term));
      return categoryMatch && groupMatch && levelMatch && usageMatch && examMatch && tagMatch && progressMatch && scopeMatch && bookmarkMatch && queryMatch;
    });

    records = [...records].sort((a, b) => {
      if (sortMode === "az") return a.title.localeCompare(b.title);
      if (sortMode === "level") return LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.title.localeCompare(b.title);
      if (sortMode === "recent") return b.addedRank - a.addedRank;
      return b.popularity - a.popularity || a.title.localeCompare(b.title);
    });
    return records;
  }, [activeCategoryId, activeGroup, bookmarks, examFilter, expandedQuery, favoritesOnly, formulaRecords, levelFilter, progress, progressFilter, scopeMode, selectedTags, sortMode, usageFilter]);

  const groupedCategories = useMemo(() => {
    return CATEGORY_GROUPS.map((group) => ({
      ...group,
      children: group.children.map((node) => attachCategoriesToNode(node)).filter(nodeHasCategories),
    })).filter((group) => group.children.length > 0);
  }, []);

  const countByLevel = useMemo(() => {
    return Object.fromEntries(LEVELS.map((level) => [level, filteredRecords.filter((record) => record.level === level).length])) as Record<FormulaLevel, number>;
  }, [filteredRecords]);

  const activeCategoryTitle = activeCategoryId === "all" ? "All formulas" : formulaCategories.find((category) => category.id === activeCategoryId)?.title ?? "Formulas";
  const relatedRecords = useMemo(() => selectedRecord ? getRelatedRecords(selectedRecord, formulaRecords) : [], [formulaRecords, selectedRecord]);
  const formulaFamilies = useMemo(() => buildFormulaFamilies(filteredRecords), [filteredRecords]);
  const selectedFamilyRecords = useMemo(() => selectedRecord ? getFormulaFamilyRecords(selectedRecord, formulaRecords) : [], [formulaRecords, selectedRecord]);
  const geometryShapeSections = useMemo(() => {
    return shouldGroupGeometryByShapes(activeCategoryId, filteredRecords) ? buildGeometryShapeSections(filteredRecords) : [];
  }, [activeCategoryId, filteredRecords]);
  const recentRecords = recent.map((id) => recordById.get(id)).filter(Boolean) as FormulaLineRecord[];
  const bookmarkedRecords = bookmarks.map((id) => recordById.get(id)).filter(Boolean) as FormulaLineRecord[];
  const visibleSymbols = useMemo(() => Array.from(new Set(filteredRecords.flatMap((record) => record.symbols))).slice(0, 40), [filteredRecords]);
  const allTagCounts = useMemo(() => getTagCounts(formulaRecords), [formulaRecords]);
  const visibleTagCounts = useMemo(() => getTagCounts(filteredRecords), [filteredRecords]);
  const visibleTags = useMemo(() => sortTags(Array.from(new Set([...PRIORITY_TAGS, ...filteredRecords.flatMap((record) => record.tags)]))).slice(0, 48), [filteredRecords]);
  const progressCounts = useMemo(() => getProgressCounts(formulaRecords, progress), [formulaRecords, progress]);

  const updateUrlForRecord = useCallback((record: FormulaLineRecord) => {
    setSelectedId(record.id);
    setRecent((items) => [record.id, ...items.filter((id) => id !== record.id)].slice(0, 12));
    setProgress((items) => ({ ...items, [record.id]: items[record.id] ?? "viewed" }));
    navigate(`/formulas?category=${record.category.id}&formula=${record.id}#formula-${encodeURIComponent(record.id)}`, { replace: true });
  }, [navigate, setProgress, setRecent]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((items) => items.includes(id) ? items.filter((item) => item !== id) : [id, ...items]);
  }, [setBookmarks]);

  const copyValue = useCallback(async (value: string) => {
    await navigator.clipboard?.writeText(value);
  }, []);

  const exportPdf = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const title = `${activeCategoryTitle} Formula Sheet`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 40, 46);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    let y = 74;
    filteredRecords.slice(0, 90).forEach((record, index) => {
      if (y > 760) {
        doc.addPage();
        y = 44;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${record.title}`, 40, y);
      y += 14;
      doc.setFont("courier", "normal");
      doc.text(doc.splitTextToSize(record.formula.replace(/\\/g, ""), 510), 52, y);
      y += 24;
      doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(record.item.note, 500), 52, y);
      y += 28;
    });
    doc.save(`${slugify(activeCategoryTitle)}-formulas.pdf`);
  }, [activeCategoryTitle, filteredRecords]);

  const clearFilters = () => {
    setQuery("");
    setActiveCategoryId("all");
    setActiveGroup("All");
    setLevelFilter("All");
    setUsageFilter("All");
    setExamFilter("All");
    setSelectedTags([]);
    setProgressFilter("All");
    setScopeMode("all");
    setFavoritesOnly(false);
  };

  const toggleTag = useCallback((tag: FormulaTag) => {
    setSelectedTags((items) => items.includes(tag) ? items.filter((item) => item !== tag) : [...items, tag]);
  }, []);

  return (
    <div className={clsx("desktop-page-shell formula-page-shell", printMode && "formula-print-mode", highContrast && "formula-contrast-mode")}>
      <div className="desktop-page-header">
        <div className="formula-mobile-hero rounded-2xl border border-slate-200 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/85">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                <Sigma className="h-4 w-4" />
                Formula Command Center
              </p>
              <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">Formulas</h1>
              <p className="formula-mobile-subtitle mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Search every category, filter by level and usage, save formulas, print sheets, and open applicable formulas in Math Workspace.
              </p>
            </div>
            <div className="formula-mobile-stats grid gap-2 sm:grid-cols-4 xl:min-w-[520px]">
              <FormulaStat label="Categories" value={formulaCategoryCount} />
              <FormulaStat label="Formula Lines" value={formulaRecords.length} />
              <FormulaStat label="Visible" value={filteredRecords.length} />
              <FormulaStat label="Understood" value={progressCounts.mastered} />
              <FormulaStat label="Review" value={progressCounts.revision} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search all formulas, symbols, notes, exams... Ctrl+K"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-400/10"
              />
            </div>
            <div className="formula-mobile-action-row flex gap-2 overflow-x-auto pb-1 thin-scrollbar lg:flex-wrap lg:overflow-visible lg:pb-0">
              <ToolbarButton active={mobileFiltersOpen} icon={Filter} label="Filters" onClick={() => setMobileFiltersOpen(true)} className="lg:hidden" />
              <ToolbarButton active={favoritesOnly} icon={Star} label="Favorites" onClick={() => setFavoritesOnly((value) => !value)} />
              <ToolbarButton active={revisionMode} icon={Eye} label="Revision" onClick={() => setRevisionMode((value) => !value)} />
              <ToolbarButton active={flashcardMode} icon={Shuffle} label="Flashcards" onClick={() => setFlashcardMode((value) => !value)} />
              <ToolbarButton active={familiesView} icon={Layers3} label="Families" onClick={() => setFamiliesView((value) => !value)} />
              <ToolbarButton active={mobileDetailOpen} icon={BookOpen} label="Details" onClick={() => setMobileDetailOpen(true)} className="xl:hidden" />
              <ToolbarButton active={printMode} icon={Printer} label="Print" onClick={() => setPrintMode((value) => !value)} />
              <ToolbarButton icon={Download} label="PDF" onClick={exportPdf} />
            </div>
          </div>
        </div>
      </div>

      <div className="desktop-tab-surface formula-library-grid">
        <FormulaSidebar
          activeCategoryId={activeCategoryId}
          activeGroup={activeGroup}
          categories={groupedCategories}
          countByLevel={countByLevel}
          examFilter={examFilter}
          favoritesOnly={favoritesOnly}
          levelFilter={levelFilter}
          mobileOpen={mobileFiltersOpen}
          openGroups={openGroups}
          recentRecords={recentRecords}
          scopeMode={scopeMode}
          setActiveCategoryId={setActiveCategoryId}
          setActiveGroup={setActiveGroup}
          setExamFilter={setExamFilter}
          setFavoritesOnly={setFavoritesOnly}
          setLevelFilter={setLevelFilter}
          setMobileOpen={setMobileFiltersOpen}
          setOpenGroups={setOpenGroups}
          setScopeMode={setScopeMode}
          selectedTags={selectedTags}
          setUsageFilter={setUsageFilter}
          tagCounts={allTagCounts}
          toggleTag={toggleTag}
          usageFilter={usageFilter}
        />

        <main className="min-w-0 space-y-4">
          <section className="formula-mobile-active-bar sticky top-0 z-20 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">Active Formula Set</p>
                <h2 className="truncate text-xl font-black text-slate-950 dark:text-white">{activeCategoryTitle}</h2>
              </div>
              <div className="formula-mobile-controls flex gap-2 overflow-x-auto pb-1 thin-scrollbar lg:flex-wrap lg:overflow-visible lg:pb-0">
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} className="formula-select">
                  <option value="popular">Sort: Popularity</option>
                  <option value="az">Sort: A-Z</option>
                  <option value="level">Sort: Level</option>
                  <option value="recent">Sort: Recently added</option>
                </select>
                <select value={progressFilter} onChange={(event) => setProgressFilter(event.target.value as ProgressFilter)} className="formula-select">
                  <option value="All">Progress: All</option>
                  <option value="new">Not started ({progressCounts.new})</option>
                  <option value="viewed">Viewed ({progressCounts.viewed})</option>
                  <option value="mastered">Understood ({progressCounts.mastered})</option>
                  <option value="revision">Review ({progressCounts.revision})</option>
                </select>
                <SegmentedButton active={viewMode === "grid"} icon={Grid3X3} label="Grid" onClick={() => setViewMode("grid")} />
                <SegmentedButton active={viewMode === "list"} icon={LayoutList} label="List" onClick={() => setViewMode("list")} />
                <SegmentedButton active={viewMode === "compact"} icon={List} label="Compact" onClick={() => setViewMode("compact")} />
                <ToolbarButton icon={Minimize} label="-" onClick={() => setZoom((value) => Math.max(0.82, Number((value - 0.08).toFixed(2))))} />
                <ToolbarButton icon={Maximize} label="+" onClick={() => setZoom((value) => Math.min(1.35, Number((value + 0.08).toFixed(2))))} />
                <ToolbarButton active={highContrast} icon={Highlighter} label="Contrast" onClick={() => setHighContrast((value) => !value)} />
                <ToolbarButton icon={RotateCcw} label="Reset" onClick={clearFilters} />
              </div>
            </div>

            <div className="formula-mobile-chip-row mt-3 flex gap-2 overflow-x-auto pb-1 thin-scrollbar">
              <Chip active={activeGroup === "All"} label="All groups" onClick={() => setActiveGroup("All")} />
              {CATEGORY_GROUPS.map((group) => <Chip key={group.id} active={activeGroup === group.id} label={group.title} onClick={() => setActiveGroup(group.id)} />)}
              <Chip active={scopeMode === "basic"} label="Basic only" onClick={() => setScopeMode(scopeMode === "basic" ? "all" : "basic")} />
              <Chip active={scopeMode === "advanced"} label="Advanced only" onClick={() => setScopeMode(scopeMode === "advanced" ? "all" : "advanced")} />
              <Chip active={favoritesOnly} label="Favorites only" onClick={() => setFavoritesOnly((value) => !value)} />
              <Chip active={progressFilter === "mastered"} label={`Understood ${progressCounts.mastered}`} onClick={() => setProgressFilter(progressFilter === "mastered" ? "All" : "mastered")} />
              <Chip active={progressFilter === "revision"} label={`Review ${progressCounts.revision}`} onClick={() => setProgressFilter(progressFilter === "revision" ? "All" : "revision")} />
              <Chip active={progressFilter === "new"} label={`Not started ${progressCounts.new}`} onClick={() => setProgressFilter(progressFilter === "new" ? "All" : "new")} />
              {selectedTags.map((tag) => <Chip key={tag} active label={`${tag} x`} onClick={() => toggleTag(tag)} />)}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-4">
              <ExamPresetBar setActiveCategoryId={setActiveCategoryId} />
              <FormulaTagPicker
                selectedTags={selectedTags}
                tagCounts={visibleTagCounts}
                tags={visibleTags}
                toggleTag={toggleTag}
              />
              {familiesView && (
                <FormulaFamiliesPanel
                  families={formulaFamilies}
                  onSelectFamily={(family) => {
                    setQuery(family.searchTerm);
                    if (family.records[0]) updateUrlForRecord(family.records[0]);
                  }}
                  onSelectFormula={updateUrlForRecord}
                />
              )}
              <SymbolAndGlossary symbols={visibleSymbols} setQuery={setQuery} />

              {filteredRecords.length ? (
                geometryShapeSections.length ? (
                  <FormulaShapeSections
                    bookmarks={bookmarks}
                    copyValue={copyValue}
                    formulaRecords={formulaRecords}
                    highlightQuery={query}
                    openDetails={openDetails}
                    progress={progress}
                    revealedCards={revealedCards}
                    revisionMode={revisionMode}
                    sections={geometryShapeSections}
                    setOpenDetails={setOpenDetails}
                    setProgress={setProgress}
                    setQuery={setQuery}
                    setRevealedCards={setRevealedCards}
                    style={{ ["--formula-zoom" as string]: zoom }}
                    toggleBookmark={toggleBookmark}
                    updateUrlForRecord={updateUrlForRecord}
                    viewMode={viewMode}
                  />
                ) : (
                  <div className={clsx("formula-results", viewMode === "grid" && "formula-results-grid", viewMode === "list" && "formula-results-list", viewMode === "compact" && "formula-results-compact")} style={{ ["--formula-zoom" as string]: zoom }}>
                    {filteredRecords.map((record) => (
                      <FormulaLibraryCard
                        key={record.id}
                        bookmarks={bookmarks}
                        copyValue={copyValue}
                        highlightQuery={query}
                        isOpen={Boolean(openDetails[record.id])}
                        onOpen={() => updateUrlForRecord(record)}
                        onToggleBookmark={() => toggleBookmark(record.id)}
                        onToggleDetails={() => setOpenDetails((items) => ({ ...items, [record.id]: !items[record.id] }))}
                        progress={progress[record.id] ?? "new"}
                        record={record}
                        relatedRecords={getRelatedRecords(record, formulaRecords).slice(0, 3)}
                        revealed={revealedCards[record.id] || !revisionMode}
                        revisionMode={revisionMode}
                        setProgress={(state) => setProgress((items) => ({ ...items, [record.id]: state }))}
                        setQuery={setQuery}
                        setRevealed={() => setRevealedCards((items) => ({ ...items, [record.id]: true }))}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )
              ) : (
                <EmptySearchState query={query} onClear={clearFilters} setQuery={setQuery} />
              )}
            </div>

            <aside className="hidden min-w-0 space-y-4 xl:block">
              <FormulaDetailPane
                bookmarks={bookmarks}
                copyValue={copyValue}
                onToggleBookmark={() => selectedRecord && toggleBookmark(selectedRecord.id)}
                progress={selectedRecord ? progress[selectedRecord.id] ?? "new" : "new"}
                record={selectedRecord}
                familyRecords={selectedFamilyRecords}
                relatedRecords={relatedRecords}
                setProgress={(state) => selectedRecord && setProgress((items) => ({ ...items, [selectedRecord.id]: state }))}
                setQuery={setQuery}
              />
              <RecentAndFavorites bookmarks={bookmarkedRecords} onSelect={updateUrlForRecord} recent={recentRecords} />
            </aside>
          </section>
        </main>
      </div>
      <MobileFormulaDetailDrawer
        bookmarks={bookmarks}
        copyValue={copyValue}
        familyRecords={selectedFamilyRecords}
        onClose={() => setMobileDetailOpen(false)}
        onToggleBookmark={() => selectedRecord && toggleBookmark(selectedRecord.id)}
        open={mobileDetailOpen}
        progress={selectedRecord ? progress[selectedRecord.id] ?? "new" : "new"}
        record={selectedRecord}
        relatedRecords={relatedRecords}
        setProgress={(state) => selectedRecord && setProgress((items) => ({ ...items, [selectedRecord.id]: state }))}
        setQuery={setQuery}
      />
      <div className="formula-mobile-bottom-bar xl:hidden">
        <button type="button" onClick={() => setMobileFiltersOpen(true)} className="formula-mobile-bottom-action">
          <Filter className="h-4 w-4" />
          Filters
        </button>
        <button type="button" onClick={() => setFamiliesView((value) => !value)} className={clsx("formula-mobile-bottom-action", familiesView && "active")}>
          <Layers3 className="h-4 w-4" />
          Families
        </button>
        <button type="button" onClick={() => setMobileDetailOpen(true)} className="formula-mobile-bottom-action primary">
          <BookOpen className="h-4 w-4" />
          Details
        </button>
      </div>
    </div>
  );
}

function FormulaSidebar(props: {
  activeCategoryId: string;
  activeGroup: FormulaGroup | "All";
  categories: CategoryGroupWithCategories[];
  countByLevel: Record<FormulaLevel, number>;
  examFilter: string;
  favoritesOnly: boolean;
  levelFilter: FormulaLevel | "All";
  mobileOpen: boolean;
  openGroups: Record<string, boolean>;
  recentRecords: FormulaLineRecord[];
  scopeMode: ScopeMode;
  setActiveCategoryId: (id: string) => void;
  setActiveGroup: (group: FormulaGroup | "All") => void;
  setExamFilter: (exam: string) => void;
  setFavoritesOnly: (value: boolean | ((current: boolean) => boolean)) => void;
  setLevelFilter: (level: FormulaLevel | "All") => void;
  setMobileOpen: (value: boolean) => void;
  setOpenGroups: (value: Record<string, boolean> | ((current: Record<string, boolean>) => Record<string, boolean>)) => void;
  setScopeMode: (mode: ScopeMode) => void;
  selectedTags: FormulaTag[];
  setUsageFilter: (usage: FormulaUsage | "All") => void;
  tagCounts: Record<string, number>;
  toggleTag: (tag: FormulaTag) => void;
  usageFilter: FormulaUsage | "All";
}) {
  const content = (
    <aside className="formula-sidebar min-w-0 space-y-4">
      <SectionCard title="Formula Groups" description="Sticky master controls." compact>
        <button type="button" onClick={() => props.setActiveCategoryId("all")} className={clsx("formula-category-button", props.activeCategoryId === "all" && "active")}>
          <BookOpen className="h-4 w-4" />
          <span>All formulas</span>
          <span>{formulaCategoryCount}</span>
        </button>
        <div className="mt-3 space-y-2">
          {props.categories.map((group) => {
            const Icon = group.icon;
            const open = props.openGroups[group.id] ?? true;
            return (
              <section key={group.id} className="rounded-xl border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5">
                <button
                  type="button"
                  onClick={() => {
                    props.setOpenGroups((items) => ({ ...items, [group.id]: !open }));
                    props.setActiveGroup(group.id);
                  }}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon className="h-4 w-4 text-cyan-500" />
                    <span className="truncate text-sm font-black text-slate-900 dark:text-white">{group.title}</span>
                  </span>
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-sm font-black text-slate-700 dark:bg-white/10 dark:text-white">{open ? "-" : "+"}</span>
                </button>
                {open && (
                  <div className="space-y-1 px-2 pb-2">
                    {group.children.map((node) => (
                      <FormulaCategoryNode
                        key={node.id}
                        activeCategoryId={props.activeCategoryId}
                        node={node}
                        openGroups={props.openGroups}
                        setActiveCategoryId={props.setActiveCategoryId}
                        setOpenGroups={props.setOpenGroups}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Filters" description="Topic, level, usage, exam." compact>
        <div className="grid gap-2">
          <select value={props.levelFilter} onChange={(event) => props.setLevelFilter(event.target.value as FormulaLevel | "All")} className="formula-select">
            <option value="All">All levels</option>
            {LEVELS.map((level) => <option key={level} value={level}>{level} ({props.countByLevel[level]})</option>)}
          </select>
          <select value={props.usageFilter} onChange={(event) => props.setUsageFilter(event.target.value as FormulaUsage | "All")} className="formula-select">
            <option value="All">All usages</option>
            {USAGE_FILTERS.map((usage) => <option key={usage} value={usage}>{usage}</option>)}
          </select>
          <select value={props.examFilter} onChange={(event) => props.setExamFilter(event.target.value)} className="formula-select">
            <option value="All">All exams</option>
            {EXAM_FILTERS.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={props.scopeMode === "basic"} label="Basic" onClick={() => props.setScopeMode(props.scopeMode === "basic" ? "all" : "basic")} />
          <Chip active={props.scopeMode === "advanced"} label="Advanced" onClick={() => props.setScopeMode(props.scopeMode === "advanced" ? "all" : "advanced")} />
          <Chip active={props.favoritesOnly} label="Saved" onClick={() => props.setFavoritesOnly((value) => !value)} />
        </div>
      </SectionCard>

      <SectionCard title="Tags" description="Select multiple formula tags." compact>
        <div className="flex max-h-56 flex-wrap gap-2 overflow-auto pr-1 thin-scrollbar">
          {sortTags(Object.keys(props.tagCounts)).slice(0, 42).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => props.toggleTag(tag)}
              className={clsx("formula-tag-chip", props.selectedTags.includes(tag) && "active")}
            >
              <span>{tag}</span>
              <span>{props.tagCounts[tag]}</span>
            </button>
          ))}
        </div>
        {props.selectedTags.length > 0 && (
          <button type="button" onClick={() => props.selectedTags.forEach(props.toggleTag)} className="mt-3 text-xs font-black text-cyan-700 dark:text-cyan-200">
            Clear selected tags
          </button>
        )}
      </SectionCard>

      <SectionCard title="Recently Viewed" description="Your last formula anchors." compact>
        <div className="space-y-1">
          {props.recentRecords.length ? props.recentRecords.slice(0, 6).map((record) => (
            <a key={record.id} href={`#formula-${encodeURIComponent(record.id)}`} className="block truncate rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-cyan-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-cyan-400/15">
              {record.title}
            </a>
          )) : <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Open formulas to build history.</p>}
        </div>
      </SectionCard>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{content}</div>
      {props.mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/55 lg:hidden">
          <div className="formula-mobile-filter-drawer absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-slate-50 p-4 shadow-2xl dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Formula filters</h2>
              <button type="button" onClick={() => props.setMobileOpen(false)} className="math-tool-button"><X className="h-4 w-4" /></button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

function FormulaCategoryNode({
  activeCategoryId,
  depth = 0,
  node,
  openGroups,
  setActiveCategoryId,
  setOpenGroups,
}: {
  activeCategoryId: string;
  depth?: number;
  node: CategoryNodeWithCategories;
  openGroups: Record<string, boolean>;
  setActiveCategoryId: (id: string) => void;
  setOpenGroups: (value: Record<string, boolean> | ((current: Record<string, boolean>) => Record<string, boolean>)) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const hasCategories = node.categories.length > 0;
  const open = openGroups[node.id] ?? depth < 1;
  const count = countNodeFormulas(node);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpenGroups((items) => ({ ...items, [node.id]: !open }))}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10"
        style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
        title={node.description}
      >
        <span className="min-w-0">
          <span className="block truncate text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-200">{node.title}</span>
          {node.description && <span className="block truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{node.description}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{count}</span>
          <span className="grid h-5 w-5 place-items-center rounded-md bg-slate-100 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-white">{open ? "-" : "+"}</span>
        </span>
      </button>
      {open && (
        <div className="space-y-1">
          {hasChildren && node.children?.map((child) => (
            <FormulaCategoryNode
              key={child.id}
              activeCategoryId={activeCategoryId}
              depth={depth + 1}
              node={child}
              openGroups={openGroups}
              setActiveCategoryId={setActiveCategoryId}
              setOpenGroups={setOpenGroups}
            />
          ))}
          {hasCategories && node.categories.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={clsx("formula-category-button", activeCategoryId === category.id && "active")}
                style={{ paddingLeft: `${1 + (depth + 1) * 0.75}rem` }}
                title={category.description}
              >
                <Icon className="h-4 w-4" />
                <span>{category.title}</span>
                <span>{category.formulas.length}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FormulaLibraryCard({
  bookmarks,
  copyValue,
  highlightQuery,
  isOpen,
  onOpen,
  onToggleBookmark,
  onToggleDetails,
  progress,
  record,
  relatedRecords,
  revealed,
  revisionMode,
  setProgress,
  setQuery,
  setRevealed,
  viewMode,
}: {
  bookmarks: string[];
  copyValue: (value: string) => Promise<void>;
  highlightQuery: string;
  isOpen: boolean;
  onOpen: () => void;
  onToggleBookmark: () => void;
  onToggleDetails: () => void;
  progress: ProgressState;
  record: FormulaLineRecord;
  relatedRecords: FormulaLineRecord[];
  revealed: boolean;
  revisionMode: boolean;
  setProgress: (state: ProgressState) => void;
  setQuery: (query: string) => void;
  setRevealed: () => void;
  viewMode: ViewMode;
}) {
  const bookmarked = bookmarks.includes(record.id);
  const compact = viewMode === "compact";
  const showGeometryPreview = !compact && getGeometryPreviewType(record) !== "none";

  return (
    <article id={`formula-${record.id}`} className={clsx("formula-library-card", compact && "compact-card")} onClick={onOpen}>
      <div className="flex items-start justify-between gap-3">
        {showGeometryPreview && <GeometryMiniPreview record={record} />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="formula-level">{record.level}</span>
            <span className="formula-usage">{record.group}</span>
            <span className={clsx("formula-progress", progress)}>{progressLabel(progress)}</span>
          </div>
          <h2 className="mt-2 text-base font-black text-slate-950 dark:text-white">
            <HighlightedText text={record.title} query={highlightQuery} />
          </h2>
          {!compact && <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{record.category.title}</p>}
        </div>
        <button type="button" onClick={(event) => { event.stopPropagation(); onToggleBookmark(); }} className="math-tool-button" aria-label="Bookmark formula">
          {bookmarked ? <BookmarkCheck className="h-4 w-4 text-cyan-500" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-3">
        {revisionMode && !revealed ? (
          <button type="button" onClick={(event) => { event.stopPropagation(); setRevealed(); }} className="formula-hidden-card">
            Tap to reveal formula
          </button>
        ) : (
          <FormulaLine formula={record.formula} />
        )}
      </div>

      {!compact && <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><HighlightedText text={record.item.note} query={highlightQuery} /></p>}

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {record.tags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setQuery(tag);
              }}
              className="formula-inline-tag"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <SmallAction icon={Copy} label="Copy" onClick={() => copyValue(record.formula)} />
        <SmallAction icon={FileText} label="LaTeX" onClick={() => copyValue(record.formula)} />
        <SmallAction icon={BookMarked} label="Plain" onClick={() => copyValue(toPlainText(record.formula))} />
        <SmallAction icon={Share2} label="Share" onClick={() => copyValue(`${window.location.origin}/formulas?category=${record.category.id}&formula=${record.id}#formula-${encodeURIComponent(record.id)}`)} />
        <SmallAction icon={ChevronDown} label={isOpen ? "Less" : "More"} onClick={onToggleDetails} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <StudyStateButton active={progress === "mastered"} label="Understood" onClick={() => setProgress("mastered")} />
        <StudyStateButton active={progress === "revision"} label="Review" onClick={() => setProgress("revision")} />
        <StudyStateButton active={progress === "viewed"} label="Viewed" onClick={() => setProgress("viewed")} />
        <StudyStateButton active={progress === "new"} label="Not started" onClick={() => setProgress("new")} />
      </div>

      {isOpen && (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <FormulaDetails record={record} relatedRecords={relatedRecords} setQuery={setQuery} />
          <div className="flex flex-wrap gap-2">
            <Chip active={progress === "mastered"} label="Understood" onClick={() => setProgress("mastered")} />
            <Chip active={progress === "revision"} label="Review" onClick={() => setProgress("revision")} />
            <Chip active={progress === "viewed"} label="Viewed" onClick={() => setProgress("viewed")} />
            <Chip active={progress === "new"} label="Not started" onClick={() => setProgress("new")} />
          </div>
        </div>
      )}
    </article>
  );
}

function FormulaDetailPane({ bookmarks, copyValue, familyRecords, onToggleBookmark, progress, record, relatedRecords, setProgress, setQuery }: {
  bookmarks: string[];
  copyValue: (value: string) => Promise<void>;
  familyRecords: FormulaLineRecord[];
  onToggleBookmark: () => void;
  progress: ProgressState;
  record?: FormulaLineRecord;
  relatedRecords: FormulaLineRecord[];
  setProgress: (state: ProgressState) => void;
  setQuery: (query: string) => void;
}) {
  if (!record) return null;
  return (
    <SectionCard title="Quick Preview" description="Desktop master/detail panel." compact>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{record.category.title}</p>
            <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{record.title}</h2>
          </div>
          <button type="button" onClick={onToggleBookmark} className="math-tool-button">
            {bookmarks.includes(record.id) ? <BookmarkCheck className="h-4 w-4 text-cyan-500" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>
        <GeometryMiniPreview record={record} large />
        <FormulaLine formula={record.formula} />
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{record.item.note}</p>
        <FormulaDetails record={record} familyRecords={familyRecords} relatedRecords={relatedRecords} setQuery={setQuery} />
        <div className="flex flex-wrap gap-2">
          <SmallAction icon={Copy} label="Copy" onClick={() => copyValue(record.formula)} />
          <SmallAction icon={LinkIcon} label="URL" onClick={() => copyValue(`${window.location.origin}/formulas?category=${record.category.id}&formula=${record.id}#formula-${encodeURIComponent(record.id)}`)} />
          <Link to={`/workspace?formula=${encodeURIComponent(record.formula)}`} className="formula-small-action"><Zap className="h-3.5 w-3.5" /> Workspace</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={progress === "mastered"} label="Understood" onClick={() => setProgress("mastered")} />
          <Chip active={progress === "revision"} label="Review" onClick={() => setProgress("revision")} />
          <Chip active={progress === "viewed"} label="Viewed" onClick={() => setProgress("viewed")} />
          <Chip active={progress === "new"} label="Not started" onClick={() => setProgress("new")} />
        </div>
      </div>
    </SectionCard>
  );
}

function FormulaDetails({ record, familyRecords = [], relatedRecords, setQuery }: { record: FormulaLineRecord; familyRecords?: FormulaLineRecord[]; relatedRecords: FormulaLineRecord[]; setQuery: (query: string) => void }) {
  return (
    <div className="space-y-3 text-sm">
      <details className="formula-detail-block">
        <summary>Show derivation</summary>
        <p>{buildDerivation(record)}</p>
      </details>
      <InfoBlock title="Where Used" icon={Lightbulb} items={buildWhereUsed(record)} />
      <InfoBlock title="Variable Legend" icon={BookOpen} items={record.variables.length ? record.variables.map((variable) => `${variable}: variable or constant used in this formula`) : ["No explicit single-letter variables detected."]} />
      <InfoBlock title="Units and Dimensions" icon={Target} items={[buildUnitsNote(record)]} />
      <InfoBlock title="Common Mistakes" icon={Sparkles} items={buildMistakes(record)} />
      <InfoBlock title="Similar Looking Warning" icon={Brain} items={[buildSimilarWarning(record)]} />
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Formula Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {record.tags.map((tag) => (
            <button key={tag} type="button" onClick={() => setQuery(tag)} className="formula-inline-tag">
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Related and Dependencies</p>
        <div className="flex flex-wrap gap-2">
          {relatedRecords.map((related) => (
            <button key={related.id} type="button" onClick={() => setQuery(related.title)} className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">
              {related.title}
            </button>
          ))}
          {record.symbols.map((symbol) => (
            <button key={symbol} type="button" onClick={() => setQuery(symbol)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
              {symbol}
            </button>
          ))}
        </div>
      </div>
      {familyRecords.length > 1 && (
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Formula Family</p>
          <div className="grid gap-2">
            {familyRecords.slice(0, 8).map((familyRecord) => (
              <button key={familyRecord.id} type="button" onClick={() => setQuery(familyRecord.title)} className="formula-family-row">
                <GeometryMiniPreview record={familyRecord} />
                <span className="min-w-0">
                  <span className="block truncate font-black text-slate-900 dark:text-white">{familyRecord.title}</span>
                  <span className="block truncate font-mono text-xs text-slate-500 dark:text-slate-400">{toPlainText(familyRecord.formula)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="formula-small-action"><Wand2 className="h-3.5 w-3.5" /> Derive this</button>
        <button type="button" className="formula-small-action"><Brain className="h-3.5 w-3.5" /> Quiz from formula</button>
      </div>
    </div>
  );
}

type FormulaFamily = {
  id: string;
  title: string;
  searchTerm: string;
  records: FormulaLineRecord[];
};

function FormulaFamiliesPanel({ families, onSelectFamily, onSelectFormula }: { families: FormulaFamily[]; onSelectFamily: (family: FormulaFamily) => void; onSelectFormula: (record: FormulaLineRecord) => void }) {
  return (
    <SectionCard title="Formula Families" description="Grouped formulas that are usually solved together." compact>
      {families.length ? (
        <div className="formula-family-grid">
          {families.slice(0, 12).map((family) => (
            <article key={family.id} className="formula-family-card">
              <button type="button" onClick={() => onSelectFamily(family)} className="formula-family-heading">
                <GeometryMiniPreview record={family.records[0]} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-slate-950 dark:text-white">{family.title}</span>
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">{family.records.length} formulas</span>
                </span>
              </button>
              <div className="mt-3 grid gap-2">
                {family.records.slice(0, 5).map((record) => (
                  <button key={record.id} type="button" onClick={() => onSelectFormula(record)} className="formula-family-row">
                    <GeometryMiniPreview record={record} />
                    <span className="min-w-0">
                      <span className="block truncate font-black text-slate-900 dark:text-white">{record.title}</span>
                      <span className="block truncate font-mono text-xs text-slate-500 dark:text-slate-400">{toPlainText(record.formula)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No formula families match the current filters yet.</p>
      )}
    </SectionCard>
  );
}

function FormulaShapeSections({
  bookmarks,
  copyValue,
  formulaRecords,
  highlightQuery,
  openDetails,
  progress,
  revealedCards,
  revisionMode,
  sections,
  setOpenDetails,
  setProgress,
  setQuery,
  setRevealedCards,
  style,
  toggleBookmark,
  updateUrlForRecord,
  viewMode,
}: {
  bookmarks: string[];
  copyValue: (value: string) => Promise<void>;
  formulaRecords: FormulaLineRecord[];
  highlightQuery: string;
  openDetails: Record<string, boolean>;
  progress: Record<string, ProgressState>;
  revealedCards: Record<string, boolean>;
  revisionMode: boolean;
  sections: FormulaShapeSection[];
  setOpenDetails: Dispatch<SetStateAction<Record<string, boolean>>>;
  setProgress: Dispatch<SetStateAction<Record<string, ProgressState>>>;
  setQuery: (query: string) => void;
  setRevealedCards: Dispatch<SetStateAction<Record<string, boolean>>>;
  style: CSSProperties;
  toggleBookmark: (id: string) => void;
  updateUrlForRecord: (record: FormulaLineRecord) => void;
  viewMode: ViewMode;
}) {
  return (
    <div className="space-y-5" style={style}>
      {sections.map((section) => (
        <section key={section.id} className="rounded-2xl border border-slate-200 bg-white/75 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => setQuery(section.searchTerm)} className="flex min-w-0 items-center gap-3 text-left">
              <GeometryMiniPreview record={section.records[0]} />
              <span className="min-w-0">
                <span className="block text-base font-black text-slate-950 dark:text-white">{section.title}</span>
                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">{section.description}</span>
              </span>
            </button>
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">{section.records.length} formulas</span>
          </div>
          <div className={clsx("formula-results", viewMode === "grid" && "formula-results-grid", viewMode === "list" && "formula-results-list", viewMode === "compact" && "formula-results-compact")}>
            {section.records.map((record) => (
              <FormulaLibraryCard
                key={record.id}
                bookmarks={bookmarks}
                copyValue={copyValue}
                highlightQuery={highlightQuery}
                isOpen={Boolean(openDetails[record.id])}
                onOpen={() => updateUrlForRecord(record)}
                onToggleBookmark={() => toggleBookmark(record.id)}
                onToggleDetails={() => setOpenDetails((items) => ({ ...items, [record.id]: !items[record.id] }))}
                progress={progress[record.id] ?? "new"}
                record={record}
                relatedRecords={getRelatedRecords(record, formulaRecords).slice(0, 3)}
                revealed={revealedCards[record.id] || !revisionMode}
                revisionMode={revisionMode}
                setProgress={(state) => setProgress((items) => ({ ...items, [record.id]: state }))}
                setQuery={setQuery}
                setRevealed={() => setRevealedCards((items) => ({ ...items, [record.id]: true }))}
                viewMode={viewMode}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function MobileFormulaDetailDrawer({
  bookmarks,
  copyValue,
  familyRecords,
  onClose,
  onToggleBookmark,
  open,
  progress,
  record,
  relatedRecords,
  setProgress,
  setQuery,
}: {
  bookmarks: string[];
  copyValue: (value: string) => Promise<void>;
  familyRecords: FormulaLineRecord[];
  onClose: () => void;
  onToggleBookmark: () => void;
  open: boolean;
  progress: ProgressState;
  record?: FormulaLineRecord;
  relatedRecords: FormulaLineRecord[];
  setProgress: (state: ProgressState) => void;
  setQuery: (query: string) => void;
}) {
  if (!open || !record) return null;
  return (
    <div className="formula-mobile-detail-shell xl:hidden" role="dialog" aria-modal="true" aria-label="Formula details">
      <button type="button" className="formula-mobile-detail-backdrop" onClick={onClose} aria-label="Close formula details" />
      <aside className="formula-mobile-detail-drawer">
        <div className="formula-mobile-detail-handle" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{record.category.title}</p>
            <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{record.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="math-tool-button" aria-label="Close formula details">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 space-y-3">
          <GeometryMiniPreview record={record} large />
          <FormulaLine formula={record.formula} />
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{record.item.note}</p>
          <FormulaDetails record={record} familyRecords={familyRecords} relatedRecords={relatedRecords} setQuery={setQuery} />
          <div className="flex flex-wrap gap-2">
            <SmallAction icon={Copy} label="Copy" onClick={() => copyValue(record.formula)} />
            <SmallAction icon={LinkIcon} label="URL" onClick={() => copyValue(`${window.location.origin}/formulas?category=${record.category.id}&formula=${record.id}#formula-${encodeURIComponent(record.id)}`)} />
            <button type="button" onClick={onToggleBookmark} className="formula-small-action">
              {bookmarks.includes(record.id) ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />} Save
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={progress === "mastered"} label="Understood" onClick={() => setProgress("mastered")} />
            <Chip active={progress === "revision"} label="Review" onClick={() => setProgress("revision")} />
            <Chip active={progress === "viewed"} label="Viewed" onClick={() => setProgress("viewed")} />
            <Chip active={progress === "new"} label="Not started" onClick={() => setProgress("new")} />
          </div>
        </div>
      </aside>
    </div>
  );
}

function GeometryMiniPreview({ record, large = false }: { record?: FormulaLineRecord; large?: boolean }) {
  if (!record) return null;
  const type = getGeometryPreviewType(record);
  if (type === "none") return null;
  return (
    <div className={clsx("geometry-mini-preview", large && "large")} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        {type === "circle" && (
          <>
            <circle cx="32" cy="32" r="20" />
            <line x1="32" y1="32" x2="52" y2="32" />
            <text x="40" y="29">r</text>
          </>
        )}
        {type === "sector" && (
          <>
            <path d="M32 32 L52 32 A20 20 0 0 0 42 15 Z" />
            <path d="M40 32 A8 8 0 0 0 36 25" className="accent" />
          </>
        )}
        {type === "triangle" && (
          <>
            <path d="M12 50 L32 12 L54 50 Z" />
            <line x1="32" y1="12" x2="32" y2="50" />
            <text x="35" y="35">h</text>
          </>
        )}
        {type === "quadrilateral" && <path d="M13 18 H51 V47 H13 Z" />}
        {type === "polygon" && <path d="M32 9 L53 24 L45 51 H19 L11 24 Z" />}
        {type === "line" && (
          <>
            <line x1="10" y1="50" x2="54" y2="14" />
            <circle cx="18" cy="43" r="3" />
            <circle cx="46" cy="21" r="3" />
          </>
        )}
        {type === "solid" && (
          <>
            <path d="M18 20 H44 V46 H18 Z" />
            <path d="M18 20 L27 12 H53 V38 L44 46" />
            <path d="M44 20 H53" />
            <path d="M53 12 V38" />
          </>
        )}
        {type === "sphere" && (
          <>
            <circle cx="32" cy="32" r="21" />
            <ellipse cx="32" cy="32" rx="21" ry="7" />
            <path d="M32 11 C25 20 25 44 32 53" />
            <path d="M32 11 C39 20 39 44 32 53" />
          </>
        )}
        {type === "cone" && (
          <>
            <path d="M32 10 L52 48 H12 Z" />
            <ellipse cx="32" cy="48" rx="20" ry="7" />
          </>
        )}
        {type === "cylinder" && (
          <>
            <ellipse cx="32" cy="17" rx="19" ry="7" />
            <path d="M13 17 V47" />
            <path d="M51 17 V47" />
            <ellipse cx="32" cy="47" rx="19" ry="7" />
          </>
        )}
        {type === "conic" && <path d="M14 44 C25 12 39 12 50 44" />}
      </svg>
    </div>
  );
}

function FormulaLine({ formula }: { formula: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: true });
    } catch {
      return null;
    }
  }, [formula]);

  return (
    <div className="formula-line-render min-w-0 overflow-x-auto rounded-xl border border-cyan-200/70 bg-cyan-50 px-3 py-3 text-center dark:border-cyan-400/20 dark:bg-cyan-400/10">
      {html ? <div className="formula-katex [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} /> : <p className="formula-plain whitespace-nowrap font-mono text-sm font-bold">{formula}</p>}
    </div>
  );
}

function ExamPresetBar({ setActiveCategoryId }: { setActiveCategoryId: (id: string) => void }) {
  return (
    <SectionCard title="Exam Formula Sheet Presets" description="Jump into common collections." compact>
      <div className="flex gap-2 overflow-x-auto pb-1 thin-scrollbar">
        {Object.entries(EXAM_PRESETS).map(([name, categories]) => (
          <button key={name} type="button" onClick={() => setActiveCategoryId(categories[0] ?? "all")} className="min-w-fit rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
            {name}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

function FormulaTagPicker({ selectedTags, tagCounts, tags, toggleTag }: { selectedTags: FormulaTag[]; tagCounts: Record<string, number>; tags: FormulaTag[]; toggleTag: (tag: FormulaTag) => void }) {
  return (
    <SectionCard title="Formula Tags" description="Filter by purpose: angle, length, distance, 2D, 3D, space, graphing, and more." compact>
      <div className="flex gap-2 overflow-x-auto pb-1 thin-scrollbar">
        {tags.map((tag) => (
          <button key={tag} type="button" onClick={() => toggleTag(tag)} className={clsx("formula-tag-chip min-w-fit", selectedTags.includes(tag) && "active")}>
            <span>{tag}</span>
            <span>{tagCounts[tag] ?? 0}</span>
          </button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected</span>
          {selectedTags.map((tag) => <Chip key={tag} active label={`${tag} x`} onClick={() => toggleTag(tag)} />)}
        </div>
      )}
    </SectionCard>
  );
}

function SymbolAndGlossary({ symbols, setQuery }: { symbols: string[]; setQuery: (query: string) => void }) {
  const glossary = [
    ["A", "Area"],
    ["V", "Volume"],
    ["r", "Radius"],
    ["h", "Height"],
    ["θ", "Angle"],
    ["Σ", "Summation"],
    ["∫", "Integral"],
    ["Δ", "Change or discriminant"],
  ];
  return (
    <SectionCard title="Symbol Index and Notation Glossary" description="Tap a symbol or notation to search it." compact>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex flex-wrap gap-2">
          {symbols.length ? symbols.map((symbol) => <Chip key={symbol} label={symbol} onClick={() => setQuery(symbol)} />) : <span className="text-xs font-semibold text-slate-500">Search results will expose symbols here.</span>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {glossary.map(([symbol, meaning]) => (
            <button key={symbol} type="button" onClick={() => setQuery(symbol)} className="rounded-lg bg-slate-100 px-3 py-2 text-left text-xs dark:bg-white/10">
              <span className="font-black text-slate-950 dark:text-white">{symbol}</span>
              <span className="ml-2 font-semibold text-slate-500 dark:text-slate-400">{meaning}</span>
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function RecentAndFavorites({ bookmarks, onSelect, recent }: { bookmarks: FormulaLineRecord[]; onSelect: (record: FormulaLineRecord) => void; recent: FormulaLineRecord[] }) {
  return (
    <SectionCard title="Study Trail" description="Recently viewed and saved formulas." compact>
      <MiniRecordList title="Recent" records={recent} onSelect={onSelect} />
      <div className="mt-3" />
      <MiniRecordList title="Favorites" records={bookmarks} onSelect={onSelect} />
    </SectionCard>
  );
}

function MiniRecordList({ onSelect, records, title }: { onSelect: (record: FormulaLineRecord) => void; records: FormulaLineRecord[]; title: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <div className="space-y-1">
        {records.slice(0, 5).map((record) => (
          <button key={record.id} type="button" onClick={() => onSelect(record)} className="block w-full truncate rounded-lg bg-slate-100 px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-cyan-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-cyan-400/15">
            {record.title}
          </button>
        ))}
        {!records.length && <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Nothing here yet.</p>}
      </div>
    </div>
  );
}

function EmptySearchState({ onClear, query, setQuery }: { onClear: () => void; query: string; setQuery: (query: string) => void }) {
  const suggestions = ["area circle", "quadratic roots", "normal distribution", "vector length", "derivative sin"];
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-white/15 dark:bg-white/5">
      <Search className="mx-auto h-8 w-8 text-cyan-500" />
      <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-white">No formulas matched “{query}”</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try a synonym, symbol, exam name, level, or reset filters.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => <Chip key={suggestion} label={suggestion} onClick={() => setQuery(suggestion)} />)}
        <Chip label="Clear filters" onClick={onClear} />
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, items, title }: { icon: ComponentType<SVGProps<SVGSVGElement>>; items: string[]; title: string }) {
  return (
    <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-950/50">
      <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5 text-cyan-500" />
        {title}
      </p>
      <ul className="space-y-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function FormulaStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-lg font-black text-slate-950 dark:text-white">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function ToolbarButton({ active = false, className, icon: Icon, label, onClick }: { active?: boolean; className?: string; icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={clsx("tool-button", active && "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-400/40 dark:bg-cyan-400/15 dark:text-cyan-100", className)}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SegmentedButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={clsx("math-tool-button h-10 w-10", active && "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100")} aria-label={label}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function SmallAction({ icon: Icon, label, onClick }: { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={(event) => { event.stopPropagation(); onClick(); }} className="formula-small-action">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Chip({ active = false, label, onClick }: { active?: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={clsx("rounded-full border px-3 py-1 text-xs font-black transition", active ? "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-400/40 dark:bg-cyan-400/15 dark:text-cyan-100" : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-200")}>
      {label}
    </button>
  );
}

function StudyStateButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={clsx("formula-study-button", active && "active")}
    >
      {label}
    </button>
  );
}

function HighlightedText({ query, text }: { query: string; text: string }) {
  const term = query.trim().split(/\s+/).filter(Boolean)[0];
  if (!term) return <>{text}</>;
  const pattern = new RegExp(`(${escapeRegExp(term)})`, "ig");
  return (
    <>
      {text.split(pattern).map((part, index) => part.toLowerCase() === term.toLowerCase() ? <mark key={`${part}-${index}`} className="rounded bg-yellow-200 px-0.5 text-slate-950">{part}</mark> : part)}
    </>
  );
}

function buildFormulaRecords(): FormulaLineRecord[] {
  let rank = 0;
  return formulaCategories.flatMap((category) => {
    return category.formulas.flatMap((item, itemIndex) => {
      const lines = splitFormulaLines(item.formula);
      return lines.map((formula, lineIndex) => {
        const title = lines.length > 1 ? `${item.title} ${lineIndex + 1}` : item.title;
        const id = `${category.id}-${itemIndex}-${lineIndex}-${slugify(title)}`;
        const text = `${category.title} ${category.description} ${item.title} ${formula} ${item.note}`;
        const level = inferLevel(category.id, text);
        const group = inferGroup(category.id, category.title);
        const usage = inferUsage(category.id, text);
        const examTags = inferExamTags(level, category.id, text);
        const tags = inferFormulaTags(category.id, text, formula, usage, level);
        const symbols = extractSymbols(formula);
        const variables = extractVariables(formula);
        rank += 1;
        return {
          id,
          category,
          item,
          formula,
          lineIndex,
          title,
          slug: slugify(title),
          haystack: normalizeSearch(`${text} ${tags.join(" ")} ${SEARCH_SYNONYMS[title.toLowerCase()]?.join(" ") ?? ""}`),
          level,
          group,
          usage,
          examTags,
          tags,
          symbols,
          variables,
          popularity: computePopularity(level, category.id, usage, text),
          addedRank: rank,
        };
      });
    });
  });
}

function splitFormulaLines(formula: string) {
  return formula
    .split(/,\s*\\quad\s*|\\quad\s*|;\s*/)
    .map((part) => part.trim().replace(/,$/, ""))
    .filter(Boolean);
}

function attachCategoriesToNode(node: CategoryNode): CategoryNodeWithCategories {
  const children = node.children?.map((child) => attachCategoriesToNode(child)).filter(nodeHasCategories);
  const categories = (node.categoryIds ?? [])
    .map((id) => formulaCategories.find((category) => category.id === id))
    .filter(Boolean) as FormulaCategory[];
  return { ...node, categories, children };
}

function nodeHasCategories(node: CategoryNodeWithCategories) {
  return node.categories.length > 0 || Boolean(node.children?.length);
}

function countNodeFormulas(node: CategoryNodeWithCategories): number {
  return node.categories.reduce((sum, category) => sum + category.formulas.length, 0) + (node.children?.reduce((sum, child) => sum + countNodeFormulas(child), 0) ?? 0);
}

function inferGroup(id: string, title: string): FormulaGroup {
  const value = `${id} ${title}`.toLowerCase();
  if (/(early-number|number-systems|fraction|decimal|percent|commercial|mental|vedic|olympiad-number)/.test(value)) return "Arithmetic & Number Sense";
  if (/(pre-algebra|algebra|polynomial|inequalit|relations|functions|sequence|series|complex-numbers)/.test(value)) return "Algebra & Functions";
  if (/(geometry|mensuration|coordinate|euclidean|analytic|conic|3d geometry|three-d|differential-geometry)/.test(value)) return "Geometry & Measurement";
  if (/(trigonometry|precalculus)/.test(value)) return "Trigonometry & Precalculus";
  if (/(limit|continuity|derivative|integral|calculus|real-analysis|complex-analysis|multivariable)/.test(value)) return "Calculus & Analysis";
  if (/(matrix|matrices|determinant|vector|linear-algebra)/.test(value)) return "Linear Algebra & Vectors";
  if (/(probability|statistics|distribution)/.test(value)) return "Probability & Statistics";
  if (/(set|logic|combinatorics|discrete|graph theory)/.test(value)) return "Discrete Math & Logic";
  if (/(linear-programming|optimization|speed|distance|work|competitive|dynamical)/.test(value)) return "Optimization & Modeling";
  if (/(differential-equations|partial differential|pde|fourier|laplace|mathematical-physics)/.test(value)) return "Transforms & Differential Equations";
  if (/(abstract|topology|measure|functional)/.test(value)) return "Advanced Structures";
  if (/(numerical|information|machine-learning|cryptography)/.test(value)) return "Computing & Data Science";
  return "Algebra & Functions";
}

function inferLevel(id: string, text: string): FormulaLevel {
  const value = `${id} ${text}`.toLowerCase();
  if (/(topology|measure|functional|manifold|category|homology|phd|stochastic|tensor)/.test(value)) return "PhD";
  if (/(abstract|real analysis|complex analysis|partial differential|eigen|gamma|beta|bayes|anova|chi-square|multivariate)/.test(value)) return "PG";
  if (/(derivative|integral|matrix|determinant|vector|limit|differential|distribution|regression|poisson|normal)/.test(value)) return "UG";
  if (/(trigonometry|quadratic|coordinate|circle|triangle|probability|statistics|log|exponent|sequence|speed|distance|work|pipe|train|boat|race|efficiency)/.test(value)) return "High School";
  if (/(area|perimeter|volume|fraction|ratio|percentage|mean|median)/.test(value)) return "Middle";
  if (/(count|number|addition|subtraction|multiplication|division)/.test(value)) return "Primary";
  return "High School";
}

function inferUsage(id: string, text: string): FormulaUsage[] {
  const value = `${id} ${text}`.toLowerCase();
  const usage = new Set<FormulaUsage>();
  if (/(area|volume|circle|triangle|geometry|angle|line|solid)/.test(value)) usage.add("Geometry");
  if (/(graph|slope|function|coordinate|curve|plot)/.test(value)) usage.add("Graphing");
  if (/(proof|theorem|identity|law)/.test(value)) usage.add("Proof");
  if (/(model|growth|decay|distribution|probability|statistics|optimization|speed|distance|work rate|pipe|productivity)/.test(value)) usage.add("Modeling");
  if (/(matrix|determinant|solve|factor|rank|eigen|sum|product|mean|variance|rate|average|combined|conversion)/.test(value)) usage.add("Computation");
  if (/(jee|exam|ncert|cbse|sat|gre|gate|olympiad|competitive|aptitude|quadratic|trigonometry|speed|distance|time and work|train|boat|race|pipe)/.test(value)) usage.add("Exam");
  if (!usage.size) usage.add("Basics");
  return Array.from(usage);
}

function inferExamTags(level: FormulaLevel, id: string, text: string) {
  const value = `${id} ${text}`.toLowerCase();
  const tags = new Set<string>();
  if (["KG", "Primary", "Middle", "High School"].includes(level)) {
    tags.add("CBSE");
    tags.add("NCERT");
  }
  if (/(trigonometry|calculus|coordinate|vector|matrix|determinant|complex|probability)/.test(value)) tags.add("JEE");
  if (/(statistics|probability|algebra|geometry|trigonometry|speed|distance|work|rate)/.test(value)) tags.add("SAT");
  if (/(linear|calculus|probability|statistics|matrix|speed|distance|work|rate)/.test(value)) tags.add("GRE");
  if (/(engineering|laplace|fourier|differential|matrix|probability)/.test(value)) tags.add("GATE");
  if (/(number|geometry|combinatorics|inequality|polynomial)/.test(value)) tags.add("Olympiad");
  return Array.from(tags);
}

function inferFormulaTags(id: string, text: string, formula: string, usage: FormulaUsage[], level: FormulaLevel) {
  const value = normalizeSearch(`${id} ${text} ${formula}`);
  const tags = new Set<FormulaTag>();
  const addIf = (tag: FormulaTag, pattern: RegExp) => {
    if (pattern.test(value)) tags.add(tag);
  };

  tags.add(level);
  usage.forEach((item) => tags.add(item.toLowerCase()));

  addIf("angle", /\b(angle|theta|sin|cos|tan|degree|radian|bisector|trigonometry)\b/);
  addIf("length", /\b(length|side|segment|perimeter|circumference|arc|distance|radius|diameter|height|width|base|median|altitude)\b/);
  addIf("distance", /\b(distance|between points|point to|shortest|skew|metric)\b/);
  addIf("speed", /\b(speed|velocity|relative speed|km\/h|m\/s|upstream|downstream|still water|stream speed)\b/);
  addIf("time", /\b(time|days|hours|minutes|seconds|late|early|arrival|catch-up|meeting)\b/);
  addIf("work", /\b(work|job|men|man-day|efficiency|productivity|wage|output)\b/);
  addIf("rate", /\b(rate|unit rate|speed|work rate|pipe|productivity|per unit|conversion)\b/);
  addIf("area", /\b(area|surface|sector|triangle area|circle area|region)\b/);
  addIf("surface area", /\b(surface area|total surface|curved surface|lateral surface)\b/);
  addIf("volume", /\b(volume|capacity|solid)\b/);
  addIf("perimeter", /\b(perimeter|circumference|boundary)\b/);
  addIf("2D", /\b(2d|plane|circle|triangle|rectangle|square|polygon|parabola|ellipse|hyperbola|coordinate geometry)\b/);
  addIf("3D", /\b(3d|space|solid|cube|cuboid|sphere|cone|cylinder|prism|pyramid|plane cartesian|skew|vector in 3d)\b/);
  addIf("space", /\b(space|3d|solid|volume|plane|sphere|cube|cuboid|prism|pyramid)\b/);
  addIf("circle", /\b(circle|radius|diameter|circumference|chord|arc|sector|semicircle|annulus)\b/);
  addIf("triangle", /\b(triangle|pythagorean|heron|hypotenuse|inradius|circumradius)\b/);
  addIf("quadrilateral", /\b(rectangle|square|parallelogram|rhombus|trapezium|trapezoid|kite|quadrilateral)\b/);
  addIf("polygon", /\b(polygon|pentagon|hexagon|octagon|diagonal|apothem)\b/);
  addIf("solid", /\b(solid|cube|cuboid|sphere|cone|cylinder|prism|pyramid|frustum|torus)\b/);
  addIf("line", /\b(line|slope|intercept|ray|segment|parallel|perpendicular)\b/);
  addIf("slope", /\b(slope|gradient|tangent line|rise)\b/);
  addIf("coordinate", /\b(coordinate|x_1|x_2|y_1|y_2|cartesian|polar)\b/);
  addIf("vector", /\b(vector|dot product|cross product|projection|magnitude|direction cosine)\b/);
  addIf("matrix", /\b(matrix|matrices|determinant|inverse|rank|eigen|transpose)\b/);
  addIf("graph", /\b(graph|function|curve|plot|intercept|root|extrema)\b/);
  addIf("function", /\b(function|domain|range|composition|inverse)\b/);
  addIf("derivative", /\b(derivative|differentiation|rate of change|tangent|chain rule|product rule)\b/);
  addIf("integral", /\b(integral|integration|antiderivative|area under|substitution|parts)\b/);
  addIf("limit", /\b(limit|continuity|asymptote|l hopital)\b/);
  addIf("probability", /\b(probability|bayes|conditional|expectation|variance|random|event|sample space)\b/);
  addIf("statistics", /\b(statistics|mean|median|mode|standard deviation|variance|regression|correlation|anova|hypothesis)\b/);
  addIf("distribution", /\b(distribution|normal|poisson|binomial|geometric|gamma|beta|exponential|weibull|cauchy)\b/);
  addIf("train", /\b(train|platform|pole|crossing trains)\b/);
  addIf("boat", /\b(boat|stream|upstream|downstream|still water)\b/);
  addIf("race", /\b(race|head start|lead|circular track|first meeting|beat)\b/);
  addIf("pipe", /\b(pipe|pipes|cistern|tank|leak|filling|emptying)\b/);
  addIf("efficiency", /\b(efficiency|productivity|output|work rate|wage share)\b/);
  addIf("algebra", /\b(algebra|equation|factor|expand|quadratic|polynomial|log|exponent|root)\b/);
  addIf("measurement", /\b(measure|unit|length|area|volume|angle|distance|perimeter|speed|time)\b/);
  addIf("units", /\b(unit|dimension|area|volume|speed|rate|density|km\/h|m\/s)\b/);
  addIf("exam", /\b(exam|ncert|cbse|jee|sat|gre|gate|olympiad|competitive|aptitude|quadratic|trigonometry|speed|distance|work|train|boat|pipe)\b/);
  addIf("proof", /\b(proof|theorem|identity|law|derive|derivation)\b/);

  if (!tags.has("2D") && (tags.has("angle") || tags.has("length") || tags.has("area") || tags.has("perimeter"))) tags.add("2D");
  if (tags.has("volume") || tags.has("surface area")) {
    tags.add("3D");
    tags.add("space");
  }

  return sortTags(Array.from(tags));
}

function getTagCounts(records: FormulaLineRecord[]) {
  return records.reduce<Record<string, number>>((counts, record) => {
    record.tags.forEach((tag) => {
      counts[tag] = (counts[tag] ?? 0) + 1;
    });
    return counts;
  }, {});
}

function getProgressCounts(records: FormulaLineRecord[], progress: Record<string, ProgressState>) {
  return records.reduce<Record<ProgressState, number>>((counts, record) => {
    const state = progress[record.id] ?? "new";
    counts[state] += 1;
    return counts;
  }, { new: 0, viewed: 0, mastered: 0, revision: 0 });
}

function sortTags(tags: FormulaTag[]) {
  return [...tags].sort((a, b) => {
    const priorityA = PRIORITY_TAGS.indexOf(a);
    const priorityB = PRIORITY_TAGS.indexOf(b);
    if (priorityA !== -1 || priorityB !== -1) return (priorityA === -1 ? 999 : priorityA) - (priorityB === -1 ? 999 : priorityB);
    return a.localeCompare(b);
  });
}

function computePopularity(level: FormulaLevel, id: string, usage: FormulaUsage[], text: string) {
  let score = 100 - LEVELS.indexOf(level) * 7;
  if (usage.includes("Exam")) score += 16;
  if (usage.includes("Basics")) score += 8;
  if (/(quadratic|pythagorean|circle|derivative|integral|normal|bayes|matrix|vector)/i.test(`${id} ${text}`)) score += 14;
  return score;
}

function getRelatedRecords(record: FormulaLineRecord, records: FormulaLineRecord[]) {
  const terms = new Set([...record.title.toLowerCase().split(/\W+/), record.category.id, ...record.usage.map((item) => item.toLowerCase())].filter((term) => term.length > 3));
  return records
    .filter((candidate) => candidate.id !== record.id)
    .map((candidate) => ({
      candidate,
      score: Array.from(terms).reduce((sum, term) => sum + (candidate.haystack.includes(term) ? 1 : 0), 0) + (candidate.category.id === record.category.id ? 2 : 0),
    }))
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.candidate);
}

function buildFormulaFamilies(records: FormulaLineRecord[]): FormulaFamily[] {
  const groups = records.reduce<Record<string, FormulaLineRecord[]>>((items, record) => {
    const family = getFormulaFamily(record);
    if (!family) return items;
    items[family.id] = [...(items[family.id] ?? []), record];
    return items;
  }, {});
  return Object.entries(groups)
    .map(([id, familyRecords]) => {
      const family = getFormulaFamily(familyRecords[0]);
      return {
        id,
        title: family?.title ?? "Formula Family",
        searchTerm: family?.searchTerm ?? familyRecords[0].category.title,
        records: familyRecords.sort((a, b) => b.popularity - a.popularity || a.title.localeCompare(b.title)),
      };
    })
    .filter((family) => family.records.length > 1)
    .sort((a, b) => b.records.length - a.records.length || a.title.localeCompare(b.title));
}

function getFormulaFamilyRecords(record: FormulaLineRecord, records: FormulaLineRecord[]) {
  const family = getFormulaFamily(record);
  if (!family) return [];
  return records.filter((candidate) => getFormulaFamily(candidate)?.id === family.id).slice(0, 18);
}

const GEOMETRY_SHAPE_CATEGORY_IDS = new Set([
  "geometry",
  "coordinate-geometry",
  "three-d-geometry",
  "euclidean-geometry-theorems",
  "analytic-geometry-advanced",
  "differential-geometry",
]);

const GEOMETRY_SHAPE_GROUPS: Array<Omit<FormulaShapeSection, "records"> & { keywords: RegExp }> = [
  { id: "circle", title: "Circle Formulas", description: "Radius, diameter, circumference, area, chords, arcs, sectors, and segments.", searchTerm: "circle radius diameter circumference area arc sector chord", keywords: /\b(circle|circumference|diameter|radius|radii|chord|arc|sector|segment|semicircle|quadrant|annulus|tangent)\b/ },
  { id: "triangle", title: "Triangle Formulas", description: "Area, perimeter, angles, medians, bisectors, inradius, circumradius, and coordinate triangle results.", searchTerm: "triangle area perimeter angle median altitude inradius circumradius coordinates", keywords: /\b(triangle|triangular|pythagorean|hypotenuse|heron|median|altitude|inradius|circumradius|centroid|orthocenter)\b/ },
  { id: "square", title: "Square Formulas", description: "Side, perimeter, area, diagonal, and square-based solids.", searchTerm: "square area perimeter diagonal side", keywords: /\b(square)\b/ },
  { id: "rectangle", title: "Rectangle Formulas", description: "Length, breadth, perimeter, area, and diagonal.", searchTerm: "rectangle area perimeter diagonal length breadth", keywords: /\b(rectangle|rectangular)\b/ },
  { id: "parallelogram", title: "Parallelogram Formulas", description: "Base-height area, side-angle area, perimeter, and derived measures.", searchTerm: "parallelogram area perimeter base height sine", keywords: /\b(parallelogram)\b/ },
  { id: "rhombus", title: "Rhombus Formulas", description: "Side, perimeter, diagonals, angle, and area.", searchTerm: "rhombus area perimeter diagonal", keywords: /\b(rhombus)\b/ },
  { id: "trapezium", title: "Trapezium and Trapezoid Formulas", description: "Parallel sides, height, median, perimeter, and area.", searchTerm: "trapezium trapezoid area median parallel sides", keywords: /\b(trapezium|trapezoid)\b/ },
  { id: "kite", title: "Kite Formulas", description: "Diagonal product area and paired-side perimeter.", searchTerm: "kite area perimeter diagonals", keywords: /\b(kite)\b/ },
  { id: "quadrilateral", title: "Other Quadrilateral Formulas", description: "General quadrilateral, cyclic quadrilateral, and diagonal relations.", searchTerm: "quadrilateral cyclic area diagonal", keywords: /\b(quadrilateral|cyclic|brahmagupta)\b/ },
  { id: "polygon", title: "Polygon Formulas", description: "Interior angles, exterior angles, diagonals, apothem, perimeter, and regular polygon area.", searchTerm: "polygon pentagon hexagon apothem diagonal interior exterior", keywords: /\b(polygon|pentagon|hexagon|heptagon|octagon|nonagon|decagon|apothem|diagonal|interior angle|exterior angle|n-gon)\b/ },
  { id: "ellipse", title: "Ellipse Formulas", description: "Axes, area, eccentricity, foci, and analytic geometry forms.", searchTerm: "ellipse area eccentricity axes focus", keywords: /\b(ellipse|elliptic|ellipsoid)\b/ },
  { id: "parabola", title: "Parabola Formulas", description: "Focus, directrix, latus rectum, tangent, and standard forms.", searchTerm: "parabola focus directrix latus rectum tangent", keywords: /\b(parabola|parabolic|latus rectum)\b/ },
  { id: "hyperbola", title: "Hyperbola Formulas", description: "Axes, eccentricity, asymptotes, tangent, and standard forms.", searchTerm: "hyperbola eccentricity asymptote tangent", keywords: /\b(hyperbola|hyperbolic|asymptote)\b/ },
  { id: "line-coordinate", title: "Line and Coordinate Formulas", description: "Distance, midpoint, section formula, slope, line equations, and intercepts.", searchTerm: "distance midpoint section slope line coordinate intercept", keywords: /\b(distance|midpoint|section|slope|line|intercept|collinear|coordinate|coordinates|centroid coordinates)\b/ },
  { id: "cube", title: "Cube Formulas", description: "Volume, surface area, edge, face diagonal, and space diagonal.", searchTerm: "cube volume surface area edge diagonal", keywords: /\b(cube)\b/ },
  { id: "cuboid", title: "Cuboid Formulas", description: "Length, breadth, height, volume, surface area, and space diagonal.", searchTerm: "cuboid volume surface area diagonal length breadth height", keywords: /\b(cuboid|rectangular prism)\b/ },
  { id: "cylinder", title: "Cylinder Formulas", description: "Volume, base area, curved surface area, total surface area, and hollow cylinder.", searchTerm: "cylinder volume curved surface area hollow", keywords: /\b(cylinder|cylindrical)\b/ },
  { id: "cone", title: "Cone and Frustum Formulas", description: "Volume, slant height, curved surface area, total surface area, and frustum measures.", searchTerm: "cone frustum volume slant height curved surface area", keywords: /\b(cone|conical|frustum)\b/ },
  { id: "sphere", title: "Sphere and Hemisphere Formulas", description: "Volume, surface area, radius, diameter, spherical cap, shell, and hemisphere formulas.", searchTerm: "sphere hemisphere volume surface area cap shell radius", keywords: /\b(sphere|spherical|hemisphere)\b/ },
  { id: "prism", title: "Prism Formulas", description: "Base area, lateral area, total area, and volume for prisms.", searchTerm: "prism volume lateral area base perimeter", keywords: /\b(prism)\b/ },
  { id: "pyramid", title: "Pyramid Formulas", description: "Base area, slant height, lateral area, total area, and volume.", searchTerm: "pyramid volume lateral area slant height", keywords: /\b(pyramid)\b/ },
  { id: "polyhedra", title: "Polyhedra Formulas", description: "Tetrahedron, octahedron, dodecahedron, icosahedron, and Euler-style solid relations.", searchTerm: "tetrahedron octahedron dodecahedron icosahedron polyhedron", keywords: /\b(tetrahedron|octahedron|dodecahedron|icosahedron|polyhedron|polyhedra)\b/ },
  { id: "other-geometry", title: "Other Geometry Formulas", description: "General geometry facts, angles, transformations, and measures not tied to one shape.", searchTerm: "geometry angle transformation measurement", keywords: /.*/ },
];

function shouldGroupGeometryByShapes(activeCategoryId: string, records: FormulaLineRecord[]) {
  if (!records.length) return false;
  if (GEOMETRY_SHAPE_CATEGORY_IDS.has(activeCategoryId)) return true;
  if (activeCategoryId === "all") return false;
  return records.some((record) => record.usage.includes("Geometry") || GEOMETRY_SHAPE_CATEGORY_IDS.has(record.category.id));
}

function buildGeometryShapeSections(records: FormulaLineRecord[]) {
  const sections = GEOMETRY_SHAPE_GROUPS.map((shape) => ({ ...shape, records: [] as FormulaLineRecord[] }));
  records.forEach((record) => {
    const value = record.haystack;
    const section = sections.find((shape) => shape.keywords.test(value)) ?? sections[sections.length - 1];
    section.records.push(record);
  });
  return sections
    .filter((section) => section.records.length)
    .map(({ keywords, ...section }) => section);
}

function getFormulaFamily(record: FormulaLineRecord) {
  const value = record.haystack;
  if (/(circle|circumference|diameter|radius|arc|sector|semicircle|annulus|chord)/.test(value)) return { id: "circle", title: "Circle, Arc and Sector Family", searchTerm: "circle sector arc radius" };
  if (/(triangle|pythagorean|heron|hypotenuse|median|altitude|inradius|circumradius)/.test(value)) return { id: "triangle", title: "Triangle Measures Family", searchTerm: "triangle area side angle" };
  if (/(rectangle|square|parallelogram|rhombus|trapezium|trapezoid|kite|quadrilateral)/.test(value)) return { id: "quadrilateral", title: "Quadrilateral Area Family", searchTerm: "rectangle square parallelogram" };
  if (/(polygon|pentagon|hexagon|octagon|diagonal|apothem)/.test(value)) return { id: "polygon", title: "Polygon Family", searchTerm: "polygon apothem diagonal" };
  if (/(sphere|hemisphere)/.test(value)) return { id: "sphere", title: "Sphere and Hemisphere Family", searchTerm: "sphere hemisphere surface volume" };
  if (/(cylinder|cone|frustum)/.test(value)) return { id: "round-solid", title: "Cylinder Cone Frustum Family", searchTerm: "cylinder cone frustum volume surface" };
  if (/(cube|cuboid|prism|pyramid|solid)/.test(value)) return { id: "polyhedron", title: "3D Solid Family", searchTerm: "cube cuboid prism pyramid volume" };
  if (/(distance|slope|line|midpoint|section|coordinate)/.test(value)) return { id: "coordinate-line", title: "Coordinate Line Family", searchTerm: "distance slope midpoint line" };
  if (/(ellipse|parabola|hyperbola|conic)/.test(value)) return { id: "conics", title: "Conic Family", searchTerm: "conic ellipse parabola hyperbola" };
  if (/(speed|train|boat|race|pipe|work rate|efficiency)/.test(value)) return { id: "aptitude-rate", title: "Speed Work and Rate Family", searchTerm: "speed distance work rate" };
  return null;
}

function getGeometryPreviewType(record: FormulaLineRecord) {
  const value = record.haystack;
  if (!record.usage.includes("Geometry") && !/(circle|triangle|rectangle|solid|line|distance|slope|sphere|cone|cylinder|ellipse|parabola|hyperbola|sector|arc|polygon)/.test(value)) return "none";
  if (/(sector|arc)/.test(value)) return "sector";
  if (/(circle|circumference|diameter|radius|annulus|chord|semicircle)/.test(value)) return "circle";
  if (/(triangle|pythagorean|heron|hypotenuse|median|altitude)/.test(value)) return "triangle";
  if (/(rectangle|square|parallelogram|rhombus|trapezium|trapezoid|kite|quadrilateral)/.test(value)) return "quadrilateral";
  if (/(polygon|pentagon|hexagon|octagon|diagonal|apothem)/.test(value)) return "polygon";
  if (/(sphere|hemisphere)/.test(value)) return "sphere";
  if (/(cone|frustum)/.test(value)) return "cone";
  if (/(cylinder)/.test(value)) return "cylinder";
  if (/(cube|cuboid|prism|pyramid|solid|volume|surface area)/.test(value)) return "solid";
  if (/(ellipse|parabola|hyperbola|conic)/.test(value)) return "conic";
  if (/(line|distance|slope|midpoint|coordinate)/.test(value)) return "line";
  return "none";
}

function buildDerivation(record: FormulaLineRecord) {
  if (record.usage.includes("Geometry")) return "Derive it by decomposing the shape into simpler parts, applying congruence or similarity, then substituting the measured variables.";
  if (record.category.id.includes("derivative")) return "Start from the limit definition of derivative, expand the expression, cancel common terms, then take the limit.";
  if (record.category.id.includes("integral")) return "Read this as the reverse of differentiation or as a limit of accumulated small changes over the interval.";
  if (record.category.id.includes("probability")) return "Begin with favorable outcomes over total outcomes, then condition or partition the sample space as required.";
  return "Track the definitions of each symbol, substitute known identities, and simplify one algebraic step at a time.";
}

function buildWhereUsed(record: FormulaLineRecord) {
  const uses = new Set<string>();
  if (record.usage.includes("Geometry")) uses.add("Measuring constructions, CAD-style geometry, mensuration, and coordinate problems.");
  if (record.usage.includes("Graphing")) uses.add("Graph sketching, intersections, slopes, transformations, and Math Workspace plotting.");
  if (record.usage.includes("Modeling")) uses.add("Data modeling, probability questions, physics, finance, optimization, and simulation.");
  if (record.usage.includes("Computation")) uses.add("Solving equations, simplifying expressions, matrices, numerical checks, and CAS output.");
  if (record.usage.includes("Exam")) uses.add("Fast recall in board exams, competitive exams, and formula-sheet revision.");
  return uses.size ? Array.from(uses) : ["General problem solving and symbolic manipulation."];
}

function buildUnitsNote(record: FormulaLineRecord) {
  const value = record.haystack;
  if (value.includes("area")) return "Area formulas usually return square units.";
  if (value.includes("volume")) return "Volume formulas return cubic units.";
  if (value.includes("probability")) return "Probability values are dimensionless and usually lie from 0 to 1.";
  if (value.includes("angle")) return "Check whether the formula expects degrees or radians.";
  if (value.includes("derivative")) return "Derivative units are output units divided by input units.";
  return "Keep all variables in compatible units before substituting values.";
}

function buildMistakes(record: FormulaLineRecord) {
  const mistakes = ["Check domain restrictions before substituting values."];
  if (record.formula.includes("\\pm")) mistakes.push("Do not drop the plus/minus branch.");
  if (record.haystack.includes("radius")) mistakes.push("Do not confuse radius with diameter.");
  if (record.haystack.includes("degree") || record.haystack.includes("radian")) mistakes.push("Do not mix degrees and radians in the same calculation.");
  if (record.haystack.includes("sample")) mistakes.push("Use n-1 for sample variance when required.");
  return mistakes;
}

function buildSimilarWarning(record: FormulaLineRecord) {
  if (record.haystack.includes("surface") || record.haystack.includes("volume")) return "Surface area and volume formulas often look similar but have different dimensions.";
  if (record.haystack.includes("sin") || record.haystack.includes("cos")) return "Sine and cosine identities often differ by one sign.";
  if (record.haystack.includes("variance")) return "Variance and standard deviation differ by a square root.";
  return "Compare variable meanings before using a similar formula from another topic.";
}

function expandSearchQuery(query: string) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  const expanded = Object.entries(SEARCH_SYNONYMS).reduce((value, [key, synonyms]) => {
    return value.includes(key) ? `${value} ${synonyms.join(" ")}` : value;
  }, normalized);
  return expanded.split(/\s+/).filter(Boolean);
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/π/g, "pi")
    .replace(/[²]/g, "2")
    .replace(/[³]/g, "3")
    .replace(/\\/g, " ")
    .replace(/[^a-z0-9+\-*/^=<>. ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSymbols(formula: string) {
  const symbols = new Set<string>();
  if (formula.includes("\\pi")) symbols.add("π");
  if (formula.includes("\\theta")) symbols.add("θ");
  if (formula.includes("\\Delta")) symbols.add("Δ");
  if (formula.includes("\\sum")) symbols.add("Σ");
  if (formula.includes("\\int")) symbols.add("∫");
  if (formula.includes("\\sqrt")) symbols.add("√");
  if (formula.includes("\\lim")) symbols.add("lim");
  if (formula.includes("\\frac")) symbols.add("fraction");
  return Array.from(symbols);
}

function extractVariables(formula: string) {
  return Array.from(new Set((formula.match(/(?<!\\)\b[a-zA-Z]\b/g) ?? []).filter((value) => !["d", "e", "i"].includes(value.toLowerCase())))).slice(0, 8);
}

function getCategoryIcon(category: FormulaCategory) {
  const value = `${category.id} ${category.title}`.toLowerCase();
  return CATEGORY_ICON_MAP.find((item) => item.test.some((test) => value.includes(test)))?.icon ?? BookOpen;
}

function isBasicLevel(level: FormulaLevel) {
  return ["KG", "Primary", "Middle", "High School"].includes(level);
}

function progressLabel(progress: ProgressState) {
  if (progress === "mastered") return "Understood";
  if (progress === "revision") return "Review";
  if (progress === "viewed") return "Viewed";
  return "Not started";
}

function toPlainText(value: string) {
  return value
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\\pi/g, "pi")
    .replace(/\\theta/g, "theta")
    .replace(/\\Delta/g, "Delta")
    .replace(/\\/g, "");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function usePersistentStringList(key: string) {
  const [value, setValue] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const update = useCallback((next: string[] | ((current: string[]) => string[])) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  }, [key]);
  return [value, update] as const;
}

function usePersistentRecord<T extends string>(key: string) {
  const [value, setValue] = useState<Record<string, T>>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "{}") as Record<string, T>;
    } catch {
      return {};
    }
  });
  const update = useCallback((next: Record<string, T> | ((current: Record<string, T>) => Record<string, T>)) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  }, [key]);
  return [value, update] as const;
}
