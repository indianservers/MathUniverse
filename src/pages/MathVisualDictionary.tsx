import { useMemo, useState } from "react";
import { ChevronDown, Eye, Filter, Search, Sparkles } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import {
  visualDictionaryCategories,
  visualDictionaryLetters,
  visualDictionaryTerms,
  type VisualDictionaryCategory,
  type VisualDictionaryKind,
  type VisualDictionaryTerm,
} from "../data/mathVisualDictionary";

const categoryStyles: Record<VisualDictionaryCategory, string> = {
  Algebra: "from-sky-400 to-indigo-500",
  Arithmetic: "from-emerald-400 to-cyan-500",
  Calculus: "from-violet-400 to-fuchsia-500",
  Geometry: "from-amber-300 to-rose-400",
  "Linear Algebra": "from-blue-400 to-cyan-300",
  Logic: "from-slate-300 to-slate-500",
  "Number Theory": "from-lime-300 to-emerald-500",
  Probability: "from-orange-300 to-pink-400",
  "Set Theory": "from-teal-300 to-blue-400",
  Statistics: "from-purple-300 to-sky-400",
  Trigonometry: "from-red-300 to-yellow-300",
};

const customMeanings: Record<string, { meaning: string; example: string }> = {
  arc: {
    meaning: "An arc is a curved part of a circle boundary between two points.",
    example: "If two points cut a circle, the curved edge joining them is an arc.",
  },
  "tangent line": {
    meaning: "A tangent line touches a curve at one point and shows the curve's instant direction there.",
    example: "On y = x^2 at x = 2, the tangent gives the slope at that exact point.",
  },
  "tangent of circle": {
    meaning: "A tangent to a circle touches the circle at exactly one point and is perpendicular to the radius there.",
    example: "A wheel on a flat road touches the road along a tangent point.",
  },
  "secant line": {
    meaning: "A secant line cuts a curve at two points and shows average rate of change between them.",
    example: "Before a secant becomes a tangent, it connects two nearby points on the graph.",
  },
  "secant of circle": {
    meaning: "A secant of a circle is a line that passes through the circle and meets it at two points.",
    example: "A chord lies inside the circle; extending that chord gives a secant line.",
  },
  "sec function": {
    meaning: "Secant is the reciprocal of cosine, so sec(theta) = 1 / cos(theta).",
    example: "If cos(theta) = 1/2, then sec(theta) = 2.",
  },
  "tan function": {
    meaning: "Tangent compares opposite to adjacent in a right triangle: tan(theta) = opposite / adjacent.",
    example: "If opposite = 3 and adjacent = 4, tan(theta) = 3/4.",
  },
  sine: {
    meaning: "Sine compares opposite side to hypotenuse in a right triangle.",
    example: "If opposite = 5 and hypotenuse = 13, sin(theta) = 5/13.",
  },
  cosine: {
    meaning: "Cosine compares adjacent side to hypotenuse in a right triangle.",
    example: "If adjacent = 12 and hypotenuse = 13, cos(theta) = 12/13.",
  },
  derivative: {
    meaning: "A derivative measures instant rate of change, visually shown by tangent slope.",
    example: "Velocity is the derivative of position with respect to time.",
  },
  limit: {
    meaning: "A limit describes the value a function approaches as input gets close to a target.",
    example: "As x gets close to 0, sin(x)/x gets close to 1.",
  },
  matrix: {
    meaning: "A matrix is a rectangular grid of numbers that can store data or transform space.",
    example: "A 2 by 2 matrix can rotate, stretch, shear, or squash points on a plane.",
  },
  vector: {
    meaning: "A vector has size and direction, often drawn as an arrow.",
    example: "A wind velocity vector tells both speed and direction.",
  },
  "venn diagram": {
    meaning: "A Venn diagram uses overlapping circles to show how sets share or exclude elements.",
    example: "The overlap of set A and set B shows A intersection B.",
  },
};

const visualFocusTerms = [
  "Arc",
  "Tangent of circle",
  "Secant of circle",
  "Sine",
  "Cosine",
  "Tan function",
  "Venn diagram",
  "Union",
  "Intersection",
  "Derivative",
  "Limit",
  "Mean",
  "Median",
  "Matrix",
  "Vector",
  "Permutation",
  "Combination",
  "Pythagorean theorem",
];

const visualKindLabels: Record<VisualDictionaryKind, string> = {
  angle: "Angles",
  circle: "Circles",
  triangle: "Triangles",
  graph: "Graphs",
  "number-line": "Number Lines",
  set: "Sets",
  matrix: "Matrices",
  vector: "Vectors",
  solid: "3D & Shapes",
  fraction: "Fractions",
  probability: "Chance & Data",
  sequence: "Sequences",
  coordinate: "Coordinates",
  logic: "Logic",
  text: "Symbols",
};

type DictionaryRange = "A-K" | "L-T" | "U-Z";

const dictionaryRanges: Array<{ id: DictionaryRange; label: string; from: string; to: string }> = [
  { id: "A-K", label: "A-K", from: "A", to: "K" },
  { id: "L-T", label: "L-T", from: "L", to: "T" },
  { id: "U-Z", label: "U-Z", from: "U", to: "Z" },
];

export default function MathVisualDictionary() {
  const [query, setQuery] = useState("");
  const [activeRange, setActiveRange] = useState<DictionaryRange>("A-K");
  const [activeLetter, setActiveLetter] = useState("All");
  const [activeCategory, setActiveCategory] = useState<VisualDictionaryCategory | "All">("All");
  const [activeKind, setActiveKind] = useState<VisualDictionaryKind | "All">("All");
  const [expandedTerm, setExpandedTerm] = useState("Arc");

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const range = dictionaryRanges.find((item) => item.id === activeRange) ?? dictionaryRanges[0];
    return visualDictionaryTerms.filter((entry) => {
      const firstLetter = entry.term[0].toUpperCase();
      const matchesQuery = !normalized || [entry.term, entry.category, entry.kind, ...entry.keywords].join(" ").toLowerCase().includes(normalized);
      const matchesRange = !!normalized || (firstLetter >= range.from && firstLetter <= range.to);
      const matchesLetter = activeLetter === "All" || entry.term.toUpperCase().startsWith(activeLetter);
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      const matchesKind = activeKind === "All" || entry.kind === activeKind;
      return matchesQuery && matchesRange && matchesLetter && matchesCategory && matchesKind;
    });
  }, [activeCategory, activeKind, activeLetter, activeRange, query]);

  const grouped = useMemo(() => {
    return filteredTerms.reduce<Record<string, VisualDictionaryTerm[]>>((groups, term) => {
      const letter = term.term[0].toUpperCase();
      groups[letter] = [...(groups[letter] ?? []), term];
      return groups;
    }, {});
  }, [filteredTerms]);

  const letterCounts = useMemo(() => countBy(visualDictionaryTerms, (term) => term.term[0].toUpperCase()), []);
  const kindCounts = useMemo(() => countBy(visualDictionaryTerms, (term) => term.kind), []);
  const visualKinds = useMemo(() => Array.from(new Set(visualDictionaryTerms.map((term) => term.kind))).sort(), []);
  const rangeCounts = useMemo(() => Object.fromEntries(dictionaryRanges.map((range) => [range.id, visualDictionaryTerms.filter((entry) => {
    const firstLetter = entry.term[0].toUpperCase();
    return firstLetter >= range.from && firstLetter <= range.to;
  }).length])) as Record<DictionaryRange, number>, []);

  function focusTerm(term: string) {
    setQuery(term);
    setActiveRange("A-K");
    setActiveLetter("All");
    setActiveCategory("All");
    setActiveKind("All");
    setExpandedTerm(term);
  }

  function clearFilters() {
    setQuery("");
    setActiveRange("A-K");
    setActiveLetter("All");
    setActiveCategory("All");
    setActiveKind("All");
    setExpandedTerm("");
  }

  return (
    <div className="space-y-4">
      <TopicHeader
        title="Maths Visual Dictionary"
        subtitle={`A-Z visual dictionary with ${visualDictionaryTerms.length} math words, color-coded diagrams, plain explanations, and examples.`}
        difficulty="Visual Reference"
        estimatedMinutes={20}
      />

      <section className="overflow-hidden rounded-xl border border-cyan-200/30 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20">
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-200">
              <Sparkles className="h-4 w-4" /> Visual first reference
            </p>
            <h2 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">See the word, see the shape, then read the idea.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50/78">
              Start with terms like arc, tangent, secant, sine, tan, matrix, vector, union, derivative, limit, mean, and probability. Terms without a natural picture still get a clean explanation and example.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <DictionaryStat label="Terms" value={visualDictionaryTerms.length} />
            <DictionaryStat label="Letters" value={visualDictionaryLetters.length} />
            <DictionaryStat label="Groups" value={visualDictionaryCategories.length} />
          </div>
        </div>
      </section>

      <SectionCard title="Start With a Visual Word" description="Tap one of these high-value terms to see its diagram and explanation immediately." compact>
        <div className="flex gap-2 overflow-x-auto pb-1 thin-scrollbar">
          {visualFocusTerms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => focusTerm(term)}
              className="shrink-0 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-800 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-100 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100"
            >
              {term}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Search Dictionary" description="Search any word, then click a list row to expand its explanation and visual." compact>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search arc, tangent, tan, sec, vector, mean..."
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-400/10"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black dark:border-white/10 dark:bg-slate-950">
            <Filter className="h-4 w-4 text-cyan-600" />
            <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value as VisualDictionaryCategory | "All")} className="w-full bg-transparent outline-none">
              <option value="All">All categories</option>
              {visualDictionaryCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {dictionaryRanges.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => {
                setActiveRange(range.id);
                setActiveLetter("All");
              }}
              className={`rounded-xl border px-4 py-3 text-left transition ${activeRange === range.id && !query.trim() ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}
            >
              <span className="block text-sm font-black">{range.label}</span>
              <span className="text-xs font-semibold opacity-75">{rangeCounts[range.id]} terms</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 thin-scrollbar">
          {["All", ...visualDictionaryLetters].map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setActiveLetter(letter)}
              className={`min-w-10 rounded-full border px-3 py-2 text-sm font-black transition ${activeLetter === letter ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}
            >
              {letter}
              {letter !== "All" && <span className="ml-1 text-[10px] opacity-70">{letterCounts[letter] ?? 0}</span>}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 thin-scrollbar">
          {(["All", ...visualKinds] as Array<VisualDictionaryKind | "All">).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setActiveKind(kind)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-black transition ${activeKind === kind ? "border-slate-950 bg-slate-950 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}
            >
              {kind === "All" ? "All visuals" : visualKindLabels[kind]}
              {kind !== "All" && <span className="ml-1 text-[10px] opacity-70">{kindCounts[kind] ?? 0}</span>}
            </button>
          ))}
        </div>
      </SectionCard>

      <main className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-black text-slate-700 dark:text-slate-200">{filteredTerms.length} terms shown</p>
          <div className="flex flex-wrap gap-2">
            {activeCategory !== "All" && <span className="mini-chip">{activeCategory}</span>}
            {activeKind !== "All" && <span className="mini-chip">{visualKindLabels[activeKind]}</span>}
            {(query || activeLetter !== "All" || activeCategory !== "All" || activeKind !== "All" || activeRange !== "A-K") && (
              <button type="button" onClick={clearFilters} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-cyan-400/10">
                Clear filters
              </button>
            )}
          </div>
        </div>
        {Object.keys(grouped).sort().map((letter) => (
          <SectionCard key={letter} id={`letter-${letter}`} title={letter} description={`${grouped[letter].length} entries`} compact>
            <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-slate-950/50">
              {grouped[letter].map((entry) => (
                <DictionaryListItem
                  key={entry.term}
                  entry={entry}
                  isExpanded={expandedTerm === entry.term}
                  onToggle={() => setExpandedTerm((current) => current === entry.term ? "" : entry.term)}
                />
              ))}
            </div>
          </SectionCard>
        ))}
        {!filteredTerms.length && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-white/15 dark:bg-white/5">
            <Eye className="mx-auto h-8 w-8 text-cyan-600" />
            <h2 className="mt-3 text-lg font-black">No dictionary term matched.</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try another word, symbol, category, or clear the filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function DictionaryListItem({ entry, isExpanded, onToggle }: { entry: VisualDictionaryTerm; isExpanded: boolean; onToggle: () => void }) {
  const tone = categoryStyles[entry.category];
  const lower = entry.term.toLowerCase();
  const meaning = customMeanings[lower]?.meaning ?? defaultMeaning(entry);
  const example = customMeanings[lower]?.example ?? defaultExample(entry);
  return (
    <article className={`bg-white/80 dark:bg-white/[0.03] ${isExpanded ? "ring-2 ring-inset ring-cyan-200 dark:ring-cyan-300/20" : ""}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-cyan-50 dark:hover:bg-cyan-300/10" aria-expanded={isExpanded}>
        <span className={`h-8 w-1.5 shrink-0 rounded-full bg-gradient-to-b ${tone}`} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-black text-slate-950 dark:text-white">{entry.term}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>{entry.category}</span>
            <span>{visualKindLabels[entry.kind]}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      {isExpanded && (
        <div className="grid gap-3 px-3 pb-4 pl-6 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{meaning}</p>
            <div className="mt-3 rounded-xl bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
              <span className="font-black text-slate-900 dark:text-white">Example: </span>{example}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.keywords.slice(0, 8).map((keyword) => <span key={keyword} className="mini-chip">{keyword}</span>)}
            </div>
          </div>
          <div className="rounded-xl bg-slate-950 p-2">
            <DictionaryVisual kind={entry.kind} term={entry.term} tone={tone} />
          </div>
        </div>
      )}
    </article>
  );
}

function DictionaryVisual({ kind, term, tone, large = false }: { kind: VisualDictionaryKind; term: string; tone: string; large?: boolean }) {
  const gradientId = `dict-${safeId(term)}`;
  const arrowId = `dict-arrow-${safeId(term)}${large ? "-large" : ""}`;
  return (
    <svg viewBox="0 0 360 180" className={`${large ? "h-72" : "h-44"} w-full rounded-lg bg-slate-950`} role="img" aria-label={`${term} visual`}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={gradientStart(tone)} />
          <stop offset="100%" stopColor={gradientEnd(tone)} />
        </linearGradient>
        <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
        </marker>
      </defs>
      <Grid />
      {renderVisual(kind, term, `url(#${gradientId})`, arrowId)}
      <text x="18" y="162" fill="#e2e8f0" fontSize="15" fontWeight="900">{term}</text>
    </svg>
  );
}

function renderVisual(kind: VisualDictionaryKind, term: string, fill: string, arrowId: string) {
  const lower = term.toLowerCase();
  if (lower === "arc" || lower === "major arc" || lower === "minor arc") {
    return (
      <g fill="none" strokeLinecap="round">
        <circle cx="180" cy="88" r="54" stroke="#e2e8f0" strokeWidth="4" />
        <path d={lower === "major arc" ? "M126 88 A54 54 0 1 1 214 130" : "M126 88 A54 54 0 0 1 214 130"} stroke={fill} strokeWidth="10" />
        <circle cx="126" cy="88" r="6" fill="#f8fafc" />
        <circle cx="214" cy="130" r="6" fill="#f8fafc" />
        <text x="230" y="92" fill="#f8fafc" fontSize="15" fontWeight="900">curved boundary</text>
      </g>
    );
  }
  if (lower === "tangent of circle" || lower === "tangent line") {
    const circle = lower === "tangent of circle";
    return (
      <g fill="none" strokeLinecap="round">
        {circle ? <circle cx="150" cy="88" r="46" stroke="#e2e8f0" strokeWidth="4" /> : <path d="M58 130 C120 34 210 34 300 126" stroke="#e2e8f0" strokeWidth="4" />}
        <line x1="70" y1={circle ? 134 : 74} x2="300" y2={circle ? 134 : 50} stroke={fill} strokeWidth="6" />
        {circle ? <line x1="150" y1="88" x2="150" y2="134" stroke="#fbbf24" strokeWidth="4" strokeDasharray="6 5" /> : <circle cx="180" cy="62" r="7" fill="#fbbf24" />}
        <text x="198" y={circle ? 116 : 92} fill="#f8fafc" fontSize="15" fontWeight="900">touches once</text>
      </g>
    );
  }
  if (lower === "secant of circle" || lower === "secant line") {
    return (
      <g fill="none" strokeLinecap="round">
        <circle cx="180" cy="88" r="50" stroke="#e2e8f0" strokeWidth="4" />
        <line x1="72" y1="126" x2="288" y2="42" stroke={fill} strokeWidth="6" />
        <circle cx="140" cy="100" r="7" fill="#fbbf24" />
        <circle cx="222" cy="68" r="7" fill="#fbbf24" />
        <text x="230" y="116" fill="#f8fafc" fontSize="15" fontWeight="900">cuts twice</text>
      </g>
    );
  }
  if (["sine", "cosine", "tan function", "sec function", "cot function", "cosec function", "law of sines", "law of cosines"].includes(lower)) {
    return (
      <g fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M88 132 H264 L264 54 Z" fill="rgba(34,211,238,.14)" />
        <path d="M88 132 A42 42 0 0 0 130 132" stroke={fill} strokeWidth="8" />
        <text x="107" y="122" fill="#f8fafc" stroke="none" fontSize="18" fontWeight="900">theta</text>
        <text x="170" y="150" fill="#f8fafc" stroke="none" fontSize="14" fontWeight="900">adjacent</text>
        <text x="276" y="96" fill="#f8fafc" stroke="none" fontSize="14" fontWeight="900">opposite</text>
        <text x="158" y="84" fill="#f8fafc" stroke="none" fontSize="14" fontWeight="900">hypotenuse</text>
        <text x="66" y="40" fill="#67e8f9" stroke="none" fontSize="16" fontWeight="900">{trigHint(lower)}</text>
      </g>
    );
  }
  if (lower === "venn diagram" || lower === "union" || lower === "intersection" || lower === "complement" || lower === "set difference" || lower === "subset" || lower === "power set") {
    const isUnion = lower === "union";
    const isIntersection = lower === "intersection";
    const isDifference = lower === "set difference";
    return (
      <g>
        <rect x="46" y="34" width="268" height="104" rx="18" fill={lower === "complement" ? "rgba(251,191,36,.20)" : "transparent"} stroke="#94a3b8" strokeWidth="3" />
        <circle cx="148" cy="88" r="48" fill={isUnion || isDifference || lower === "subset" || lower === "power set" ? "rgba(34,211,238,.45)" : "rgba(34,211,238,.20)"} stroke="#67e8f9" strokeWidth="4" />
        <circle cx="210" cy="88" r="48" fill={isUnion ? "rgba(251,191,36,.38)" : "rgba(251,191,36,.18)"} stroke="#fbbf24" strokeWidth="4" />
        {isIntersection && <path d="M179 50 A48 48 0 0 1 179 126 A48 48 0 0 1 179 50" fill="rgba(34,211,238,.62)" />}
        {isDifference && <path d="M179 50 A48 48 0 0 1 179 126 A48 48 0 1 0 179 50" fill="rgba(15,23,42,.55)" />}
        <text x="124" y="92" fill="#f8fafc" fontSize="18" fontWeight="900">A</text>
        <text x="230" y="92" fill="#f8fafc" fontSize="18" fontWeight="900">B</text>
      </g>
    );
  }
  if (lower === "mean" || lower === "arithmetic mean" || lower === "median" || lower === "mode" || lower === "range" || lower === "standard deviation" || lower === "variance" || lower === "normal distribution" || lower === "z-score") {
    return (
      <g>
        {[52, 84, 120, 172, 238, 278].map((x, index) => <circle key={x} cx={x} cy={120 - [10, 35, 22, 55, 28, 48][index]} r="8" fill={index === 3 ? "#fbbf24" : "#22d3ee"} />)}
        <line x1="36" y1="126" x2="320" y2="126" stroke="#64748b" strokeWidth="4" />
        <line x1="172" y1="40" x2="172" y2="132" stroke={fill} strokeWidth="5" strokeDasharray="7 6" />
        <path d="M72 126 C120 54 230 54 288 126" fill="rgba(34,211,238,.16)" stroke="#a78bfa" strokeWidth="4" />
        <text x="190" y="58" fill="#f8fafc" fontSize="15" fontWeight="900">{lower.includes("standard") || lower.includes("variance") ? "spread" : "center"}</text>
      </g>
    );
  }
  if (lower === "permutation" || lower === "combination" || lower === "factorial" || lower === "binomial coefficient") {
    const ordered = lower === "permutation" || lower === "factorial";
    return (
      <g>
        {["A", "B", "C"].map((label, index) => <g key={label}><rect x={78 + index * 62} y={ordered ? 58 : 82} width="44" height="44" rx="12" fill={index === 0 ? "#22d3ee" : index === 1 ? "#a78bfa" : "#fbbf24"} /><text x={100 + index * 62} y={ordered ? 86 : 110} textAnchor="middle" fill="#0f172a" fontSize="18" fontWeight="900">{label}</text></g>)}
        {ordered ? <path d="M128 80 H156 M190 80 H218" stroke="#e2e8f0" strokeWidth="4" markerEnd={`url(#${arrowId})`} /> : <path d="M78 132 Q162 160 264 132" fill="none" stroke="#e2e8f0" strokeWidth="4" />}
        <text x="72" y="40" fill="#f8fafc" fontSize="16" fontWeight="900">{ordered ? "order matters" : "same group"}</text>
      </g>
    );
  }
  if (lower === "derivative" || lower === "gradient" || lower === "slope" || lower === "average rate of change" || lower === "normal line") {
    return (
      <g fill="none" strokeLinecap="round">
        <line x1="52" y1="134" x2="312" y2="134" stroke="#64748b" strokeWidth="4" />
        <line x1="72" y1="24" x2="72" y2="150" stroke="#64748b" strokeWidth="4" />
        <path d="M74 124 C120 42 176 42 238 126" stroke="#e2e8f0" strokeWidth="4" />
        <line x1="142" y1="95" x2="250" y2="62" stroke={lower === "normal line" ? "#fbbf24" : fill} strokeWidth="6" />
        {lower === "normal line" && <line x1="192" y1="32" x2="210" y2="128" stroke={fill} strokeWidth="5" />}
        <circle cx="194" cy="78" r="7" fill="#f8fafc" />
        <text x="222" y="104" fill="#f8fafc" fontSize="15" fontWeight="900">{lower === "average rate of change" ? "secant slope" : "instant slope"}</text>
      </g>
    );
  }
  if (lower === "limit") {
    return (
      <g fill="none" strokeLinecap="round">
        <line x1="52" y1="134" x2="312" y2="134" stroke="#64748b" strokeWidth="4" />
        <line x1="72" y1="24" x2="72" y2="150" stroke="#64748b" strokeWidth="4" />
        <path d="M76 122 C118 80 145 72 174 72" stroke="#22d3ee" strokeWidth="5" />
        <path d="M210 72 C244 72 272 92 306 122" stroke="#22d3ee" strokeWidth="5" />
        <circle cx="192" cy="72" r="10" fill="#0f172a" stroke="#f8fafc" strokeWidth="4" />
        <path d="M134 44 L178 66 M250 44 L206 66" stroke="#fbbf24" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
        <text x="132" y="36" fill="#f8fafc" fontSize="15" fontWeight="900">approaches</text>
      </g>
    );
  }
  if (lower === "pythagorean theorem" || lower === "hypotenuse" || lower === "right triangle") {
    return (
      <g fill="none" strokeLinejoin="round">
        <path d="M78 132 H232 V52 Z" fill="rgba(34,211,238,.14)" stroke="#e2e8f0" strokeWidth="4" />
        <rect x="78" y="96" width="36" height="36" fill="rgba(34,211,238,.28)" stroke="#22d3ee" strokeWidth="3" />
        <rect x="232" y="52" width="54" height="54" fill="rgba(251,191,36,.28)" stroke="#fbbf24" strokeWidth="3" />
        <rect x="126" y="30" width="76" height="76" transform="rotate(-27 164 68)" fill="rgba(167,139,250,.28)" stroke="#a78bfa" strokeWidth="3" />
        <text x="108" y="126" fill="#f8fafc" fontSize="14" fontWeight="900">a^2</text>
        <text x="248" y="84" fill="#f8fafc" fontSize="14" fontWeight="900">b^2</text>
        <text x="156" y="72" fill="#f8fafc" fontSize="14" fontWeight="900">c^2</text>
      </g>
    );
  }
  if (lower === "parabola" || lower === "hyperbola" || lower === "ellipse" || lower === "focus" || lower === "directrix" || lower === "eccentricity") {
    return (
      <g fill="none" strokeLinecap="round">
        <line x1="54" y1="138" x2="314" y2="138" stroke="#64748b" strokeWidth="4" />
        <line x1="96" y1="24" x2="96" y2="154" stroke="#64748b" strokeWidth="4" />
        {lower === "ellipse" ? <ellipse cx="190" cy="88" rx="82" ry="42" stroke={fill} strokeWidth="5" /> : lower === "hyperbola" ? <><path d="M150 40 C104 72 104 112 150 140" stroke={fill} strokeWidth="5" /><path d="M230 40 C276 72 276 112 230 140" stroke={fill} strokeWidth="5" /></> : <path d="M116 138 C154 44 226 44 268 138" stroke={fill} strokeWidth="5" />}
        <circle cx="190" cy="92" r="7" fill="#fbbf24" />
        <line x1="64" y1="42" x2="304" y2="42" stroke="#fbbf24" strokeWidth="3" strokeDasharray="7 6" />
        <text x="208" y="96" fill="#f8fafc" fontSize="14" fontWeight="900">focus</text>
      </g>
    );
  }
  if (lower.includes("interval")) {
    const open = lower.includes("open");
    return (
      <g fill="none" strokeLinecap="round">
        <line x1="42" y1="96" x2="318" y2="96" stroke="#e2e8f0" strokeWidth="4" />
        <line x1="116" y1="96" x2="244" y2="96" stroke={fill} strokeWidth="10" />
        <circle cx="116" cy="96" r="11" fill={open ? "#0f172a" : "#fbbf24"} stroke="#fbbf24" strokeWidth="4" />
        <circle cx="244" cy="96" r="11" fill={lower.includes("closed") ? "#fbbf24" : "#0f172a"} stroke="#fbbf24" strokeWidth="4" />
        <text x="104" y="130" fill="#f8fafc" fontSize="15" fontWeight="900">a</text>
        <text x="238" y="130" fill="#f8fafc" fontSize="15" fontWeight="900">b</text>
      </g>
    );
  }
  if (lower === "determinant" || lower === "transpose" || lower === "identity matrix" || lower === "zero matrix" || lower === "rank of matrix" || lower === "linear transformation") {
    return (
      <g>
        {[0, 1].map((row) => [0, 1].map((col) => <rect key={`${row}-${col}`} x={78 + col * 48} y={54 + row * 38} width="38" height="30" rx="6" fill={row === col ? "#22d3ee" : "#1e293b"} stroke="#94a3b8" />))}
        <path d="M200 88 H286" stroke="#fbbf24" strokeWidth="5" markerEnd={`url(#${arrowId})`} />
        <path d="M258 56 L304 84 L258 112 Z" fill="rgba(167,139,250,.25)" stroke="#a78bfa" strokeWidth="4" />
        <text x="70" y="36" fill="#f8fafc" fontSize="15" fontWeight="900">{lower === "transpose" ? "swap rows and columns" : "matrix action"}</text>
      </g>
    );
  }
  if (lower === "projection" || lower === "vector component" || lower === "parallel vector" || lower === "cross product" || lower === "dot product") {
    return (
      <g fill="none" strokeLinecap="round">
        <line x1="70" y1="132" x2="300" y2="132" stroke="#64748b" strokeWidth="4" />
        <path d="M86 132 L248 58" stroke={fill} strokeWidth="6" markerEnd={`url(#${arrowId})`} />
        <path d="M86 132 L238 132" stroke="#fbbf24" strokeWidth="6" markerEnd={`url(#${arrowId})`} />
        <line x1="248" y1="58" x2="238" y2="132" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="6 5" />
        <text x="156" y="120" fill="#f8fafc" fontSize="15" fontWeight="900">component</text>
      </g>
    );
  }
  if (kind === "circle") {
    return <g fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"><circle cx="180" cy="88" r="48" /><path d="M180 88 L226 74" stroke={fill} /><path d="M180 88 A48 48 0 0 1 221 112" stroke={fill} strokeWidth="8" /><line x1="115" y1="136" x2="285" y2="40" stroke="#38bdf8" strokeDasharray="7 6" /><text x="235" y="116" fill="#f8fafc" stroke="none" fontSize="14" fontWeight="900">arc / secant / tangent</text></g>;
  }
  if (kind === "angle") {
    return <g fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round"><line x1="92" y1="128" x2="260" y2="128" /><line x1="92" y1="128" x2="210" y2="48" /><path d="M135 128 A43 43 0 0 0 128 104" stroke={fill} strokeWidth="9" /><circle cx="92" cy="128" r="6" fill="#f8fafc" stroke="none" /><text x="140" y="102" fill="#f8fafc" stroke="none" fontSize="22" fontWeight="900">theta</text></g>;
  }
  if (kind === "triangle") {
    return <g fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinejoin="round"><path d="M88 132 L246 132 L148 42 Z" fill="rgba(34,211,238,.14)" /><line x1="148" y1="42" x2="148" y2="132" stroke={fill} strokeDasharray="6 5" /><text x="158" y="96" fill="#f8fafc" stroke="none" fontSize="16" fontWeight="900">h</text><text x="152" y="151" fill="#f8fafc" stroke="none" fontSize="15" fontWeight="900">base</text></g>;
  }
  if (kind === "graph") {
    return <g fill="none" strokeWidth="4" strokeLinecap="round"><line x1="52" y1="134" x2="312" y2="134" stroke="#64748b" /><line x1="72" y1="24" x2="72" y2="150" stroke="#64748b" /><path d="M74 126 C122 20 180 30 230 130 C252 174 282 120 308 62" stroke={fill} /><line x1="134" y1="98" x2="238" y2="72" stroke="#fbbf24" strokeDasharray="7 6" /><circle cx="188" cy="84" r="6" fill="#f8fafc" /></g>;
  }
  if (kind === "number-line") {
    return <g fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"><line x1="42" y1="92" x2="318" y2="92" /><path d="M318 92 L306 84 M318 92 L306 100" /><circle cx="180" cy="92" r="11" fill={fill} stroke="none" /><path d="M116 92 A64 34 0 0 1 180 92" stroke="#fbbf24" strokeWidth="5" /><text x="66" y="122" fill="#f8fafc" stroke="none" fontSize="14">-2</text><text x="176" y="122" fill="#f8fafc" stroke="none" fontSize="14">0</text><text x="282" y="122" fill="#f8fafc" stroke="none" fontSize="14">2</text></g>;
  }
  if (kind === "set") {
    return <g><circle cx="148" cy="88" r="54" fill="rgba(34,211,238,.32)" stroke="#67e8f9" strokeWidth="4" /><circle cx="210" cy="88" r="54" fill="rgba(251,191,36,.30)" stroke="#fbbf24" strokeWidth="4" /><text x="124" y="92" fill="#f8fafc" fontSize="18" fontWeight="900">A</text><text x="228" y="92" fill="#f8fafc" fontSize="18" fontWeight="900">B</text><text x="174" y="92" fill="#fff" fontSize="14" fontWeight="900">overlap</text></g>;
  }
  if (kind === "matrix") {
    return <g>{[0, 1, 2].map((row) => [0, 1, 2].map((col) => <rect key={`${row}-${col}`} x={96 + col * 52} y={42 + row * 34} width="42" height="26" rx="6" fill={row === col ? "#22d3ee" : "#1e293b"} stroke="#94a3b8" />))}<text x="260" y="92" fill="#f8fafc" fontSize="18" fontWeight="900">grid of values</text></g>;
  }
  if (kind === "vector") {
    return <g fill="none" strokeWidth="5" strokeLinecap="round"><line x1="72" y1="134" x2="300" y2="134" stroke="#64748b" /><line x1="92" y1="150" x2="92" y2="30" stroke="#64748b" /><path d="M92 134 L242 54" stroke={fill} /><path d="M242 54 L224 56 M242 54 L232 70" stroke={fill} /><text x="186" y="76" fill="#f8fafc" stroke="none" fontSize="16" fontWeight="900">magnitude + direction</text></g>;
  }
  if (kind === "solid") {
    return <g fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinejoin="round"><path d="M112 70 H224 V132 H112 Z" fill="rgba(34,211,238,.14)" /><path d="M112 70 L144 42 H256 V104 L224 132" /><path d="M224 70 H256 M256 42 V104 M144 42 V70" stroke={fill} /><text x="140" y="154" fill="#f8fafc" stroke="none" fontSize="15" fontWeight="900">length x width x height</text></g>;
  }
  if (kind === "fraction") {
    return <g>{[0, 1, 2, 3, 4].map((index) => <rect key={index} x={70 + index * 44} y="66" width="38" height="60" rx="8" fill={index < 3 ? "#22d3ee" : "#334155"} stroke="#94a3b8" />)}<text x="98" y="46" fill="#f8fafc" fontSize="22" fontWeight="900">3 / 5</text><text x="224" y="102" fill="#f8fafc" fontSize="15" fontWeight="900">parts of a whole</text></g>;
  }
  if (kind === "probability") {
    return <g>{[0, 1, 2, 3, 4, 5].map((index) => <circle key={index} cx={92 + index * 34} cy={88} r="15" fill={index < 2 ? "#fbbf24" : "#22d3ee"} />)}<path d="M72 134 H292" stroke="#e2e8f0" strokeWidth="4" /><text x="108" y="45" fill="#f8fafc" fontSize="18" fontWeight="900">favorable / total</text></g>;
  }
  if (kind === "sequence") {
    return <g>{[1, 2, 3, 4, 5].map((value, index) => <g key={value}><circle cx={78 + index * 50} cy={126 - value * 16} r="12" fill={index % 2 ? "#fbbf24" : "#22d3ee"} /><text x={72 + index * 50} y="154" fill="#f8fafc" fontSize="13">{value}</text></g>)}<path d="M78 110 L128 94 L178 78 L228 62 L278 46" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="6 5" fill="none" /></g>;
  }
  if (kind === "coordinate") {
    return <g fill="none" strokeWidth="4" strokeLinecap="round"><line x1="60" y1="136" x2="308" y2="136" stroke="#64748b" /><line x1="98" y1="32" x2="98" y2="152" stroke="#64748b" /><circle cx="214" cy="74" r="9" fill={fill} /><line x1="214" y1="74" x2="214" y2="136" stroke="#fbbf24" strokeDasharray="5 5" /><line x1="98" y1="74" x2="214" y2="74" stroke="#38bdf8" strokeDasharray="5 5" /><text x="226" y="72" fill="#f8fafc" stroke="none" fontSize="16" fontWeight="900">(x,y)</text></g>;
  }
  if (kind === "logic") {
    return <g fill="none" stroke="#e2e8f0" strokeWidth="4"><rect x="64" y="48" width="86" height="70" rx="14" fill="rgba(34,211,238,.12)" /><rect x="210" y="48" width="86" height="70" rx="14" fill="rgba(251,191,36,.12)" /><path d="M150 84 H210" /><path d="M210 84 L198 76 M210 84 L198 92" /><text x="92" y="90" fill="#f8fafc" stroke="none" fontSize="16" fontWeight="900">if</text><text x="238" y="90" fill="#f8fafc" stroke="none" fontSize="16" fontWeight="900">then</text></g>;
  }
  return <g><rect x="54" y="48" width="252" height="82" rx="18" fill="rgba(34,211,238,.14)" stroke="#67e8f9" strokeWidth="3" /><text x="86" y="94" fill="#f8fafc" fontSize="20" fontWeight="900">definition + example</text></g>;
}

function Grid() {
  return <g opacity="0.14">{[0, 1, 2, 3, 4, 5].map((i) => <line key={`h-${i}`} x1="20" x2="340" y1={32 + i * 24} y2={32 + i * 24} stroke="#94a3b8" />)}{[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={`v-${i}`} x1={36 + i * 48} x2={36 + i * 48} y1="20" y2="150" stroke="#94a3b8" />)}</g>;
}

function DictionaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-cyan-100/80">{label}</p>
    </div>
  );
}

function defaultMeaning(entry: VisualDictionaryTerm) {
  const term = entry.term.toLowerCase();
  const templates: Record<VisualDictionaryKind, string> = {
    angle: `${entry.term} is an angle idea: compare two rays, turns, or angle positions in a diagram.`,
    circle: `${entry.term} is a circle idea: use the center, radius, boundary, or a line meeting the circle to see it.`,
    triangle: `${entry.term} is a triangle idea: read it from sides, angles, height, or matching triangle shapes.`,
    graph: `${entry.term} is a graph or algebra idea: see how a rule changes inputs into outputs.`,
    "number-line": `${entry.term} is a number idea: place it on a line to compare size, direction, or distance from zero.`,
    set: `${entry.term} is a set idea: group objects and study membership, overlap, or exclusion.`,
    matrix: `${entry.term} is organized in rows and columns, useful for transformations, systems, and data.`,
    vector: `${entry.term} is best seen with arrows, direction, length, and components.`,
    solid: `${entry.term} is a shape or measurement idea: connect faces, edges, area, or volume to the picture.`,
    fraction: `${entry.term} compares parts to a whole or one quantity to another.`,
    probability: `${entry.term} describes outcomes, chances, counts, or variation in data.`,
    sequence: `${entry.term} is about ordered values that follow a pattern from one term to the next.`,
    coordinate: `${entry.term} is located or measured on axes using positions such as x and y.`,
    logic: `${entry.term} helps decide whether statements, implications, or arguments are valid.`,
    text: `${entry.term} is a symbolic math language idea used to write, group, or simplify statements.`,
  };
  if (term.includes("axis")) return `${entry.term} is a reference line used to measure position or symmetry.`;
  if (term.includes("factor")) return `${entry.term} divides or builds another number or expression exactly.`;
  return templates[entry.kind];
}

function defaultExample(entry: VisualDictionaryTerm) {
  const templates: Record<VisualDictionaryKind, string> = {
    angle: "Rotate one ray from another and read the opening in degrees.",
    circle: "Mark a center and radius, then identify the highlighted part on the boundary.",
    triangle: "Draw a triangle, label sides or angles, and compare the required part.",
    graph: "Plot x-values and watch the curve show the behavior of the rule.",
    "number-line": "Place -2, 0, and 3 on a line to compare order and distance.",
    set: "Put numbers in circles A and B; the overlap shows shared elements.",
    matrix: "Use [[1, 2], [3, 4]] as a two-row, two-column example.",
    vector: "An arrow from (0,0) to (3,2) has components 3 and 2.",
    solid: "A cuboid with length, width, and height shows the measurement clearly.",
    fraction: "Shade 3 of 5 equal parts to see 3/5.",
    probability: "If 2 red balls out of 6 are favorable, probability is 2/6.",
    sequence: "2, 4, 6, 8 is a sequence that increases by 2 each step.",
    coordinate: "The point (4,2) means move 4 along x and 2 along y.",
    logic: "If a number is divisible by 4, then it is even.",
    text: "Use parentheses in 2 x (3 + 4) to show what happens first.",
  };
  return templates[entry.kind];
}

function gradientStart(tone: string) {
  if (tone.includes("emerald")) return "#34d399";
  if (tone.includes("violet")) return "#a78bfa";
  if (tone.includes("amber")) return "#fcd34d";
  if (tone.includes("orange")) return "#fdba74";
  if (tone.includes("teal")) return "#5eead4";
  if (tone.includes("red")) return "#fca5a5";
  return "#38bdf8";
}

function trigHint(term: string) {
  if (term.includes("law of cosines")) return "c^2 = a^2 + b^2 - 2ab cos C";
  if (term.includes("law of sines")) return "a/sin A = b/sin B";
  if (term.includes("cos")) return "cos = adjacent / hypotenuse";
  if (term.includes("tan")) return "tan = opposite / adjacent";
  if (term.includes("sec")) return "sec = hypotenuse / adjacent";
  if (term.includes("cot")) return "cot = adjacent / opposite";
  if (term.includes("cosec")) return "cosec = hypotenuse / opposite";
  return "sin = opposite / hypotenuse";
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function gradientEnd(tone: string) {
  if (tone.includes("indigo")) return "#6366f1";
  if (tone.includes("fuchsia")) return "#d946ef";
  if (tone.includes("rose")) return "#fb7185";
  if (tone.includes("pink")) return "#f472b6";
  if (tone.includes("blue")) return "#60a5fa";
  if (tone.includes("yellow")) return "#fde047";
  return "#22d3ee";
}

function safeId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
