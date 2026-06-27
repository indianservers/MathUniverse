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
  mean: {
    meaning: "Mean is the arithmetic average: add all values and divide by the number of values.",
    example: "For 2, 4, and 9, the mean is (2 + 4 + 9) / 3 = 5.",
  },
  median: {
    meaning: "Median is the middle value after the data is arranged in order.",
    example: "For 2, 4, 9, the median is 4.",
  },
  mode: {
    meaning: "Mode is the value that appears most often in a data set.",
    example: "For 2, 3, 3, 5, the mode is 3.",
  },
  range: {
    meaning: "Range is the spread from the smallest value to the largest value.",
    example: "For 2, 4, 9, the range is 9 - 2 = 7.",
  },
  "standard deviation": {
    meaning: "Standard deviation measures how far values typically sit from the mean.",
    example: "A small standard deviation means the data points cluster close to the mean.",
  },
  variance: {
    meaning: "Variance is the average squared distance from the mean.",
    example: "Variance is large when data points are widely spread out.",
  },
  "positive correlation": {
    meaning: "Positive correlation means two variables tend to increase together.",
    example: "If study time rises and test score usually rises too, the scatter plot has an upward trend.",
  },
  "negative correlation": {
    meaning: "Negative correlation means one variable tends to decrease when the other increases.",
    example: "If speed rises and travel time falls for the same distance, the scatter plot has a downward trend.",
  },
  "regression line": {
    meaning: "A regression line is the best-fit straight line summarizing a scatter plot trend.",
    example: "It predicts y from x by passing through the middle direction of the data cloud.",
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

const initialVisibleTerms = 48;
const loadMoreTerms = 48;

export default function MathVisualDictionary() {
  const [query, setQuery] = useState("");
  const [activeRange, setActiveRange] = useState<DictionaryRange | "All">("A-K");
  const [activeLetter, setActiveLetter] = useState("All");
  const [activeCategory, setActiveCategory] = useState<VisualDictionaryCategory | "All">("All");
  const [activeKind, setActiveKind] = useState<VisualDictionaryKind | "All">("All");
  const [expandedTerm, setExpandedTerm] = useState("");
  const [hasOpenedDictionary, setHasOpenedDictionary] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialVisibleTerms);

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const range = activeRange === "All" ? undefined : dictionaryRanges.find((item) => item.id === activeRange) ?? dictionaryRanges[0];
    return visualDictionaryTerms.filter((entry) => {
      const firstLetter = entry.term[0].toUpperCase();
      const matchesQuery = !normalized || [entry.term, entry.category, entry.kind, ...entry.keywords].join(" ").toLowerCase().includes(normalized);
      const matchesRange = activeRange === "All" || !!normalized || !range || (firstLetter >= range.from && firstLetter <= range.to);
      const matchesLetter = activeLetter === "All" || entry.term.toUpperCase().startsWith(activeLetter);
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      const matchesKind = activeKind === "All" || entry.kind === activeKind;
      return matchesQuery && matchesRange && matchesLetter && matchesCategory && matchesKind;
    });
  }, [activeCategory, activeKind, activeLetter, activeRange, query]);

  const visibleTerms = useMemo(() => filteredTerms.slice(0, visibleCount), [filteredTerms, visibleCount]);

  const grouped = useMemo(() => {
    return visibleTerms.reduce<Record<string, VisualDictionaryTerm[]>>((groups, term) => {
      const letter = term.term[0].toUpperCase();
      groups[letter] = [...(groups[letter] ?? []), term];
      return groups;
    }, {});
  }, [visibleTerms]);

  const letterCounts = useMemo(() => countBy(visualDictionaryTerms, (term) => term.term[0].toUpperCase()), []);
  const categoryCounts = useMemo(() => countBy(visualDictionaryTerms, (term) => term.category), []);
  const kindCounts = useMemo(() => countBy(visualDictionaryTerms, (term) => term.kind), []);
  const visualKinds = useMemo(() => Array.from(new Set(visualDictionaryTerms.map((term) => term.kind))).sort(), []);
  const rangeCounts = useMemo(() => Object.fromEntries(dictionaryRanges.map((range) => [range.id, visualDictionaryTerms.filter((entry) => {
    const firstLetter = entry.term[0].toUpperCase();
    return firstLetter >= range.from && firstLetter <= range.to;
  }).length])) as Record<DictionaryRange, number>, []);
  const shownCount = Math.min(visibleCount, filteredTerms.length);
  const progressPercent = filteredTerms.length ? Math.round((shownCount / filteredTerms.length) * 100) : 0;

  function openDictionary(nextVisibleCount = initialVisibleTerms) {
    setHasOpenedDictionary(true);
    setVisibleCount(nextVisibleCount);
    setExpandedTerm("");
  }

  function focusTerm(term: string) {
    setQuery(term);
    setActiveRange("A-K");
    setActiveLetter("All");
    setActiveCategory("All");
    setActiveKind("All");
    setHasOpenedDictionary(true);
    setVisibleCount(initialVisibleTerms);
    setExpandedTerm(term);
  }

  function chooseCategory(category: VisualDictionaryCategory | "All") {
    setQuery("");
    setActiveCategory(category);
    setActiveKind("All");
    setActiveLetter("All");
    setActiveRange(category === "All" ? "A-K" : "All");
    openDictionary();
  }

  function chooseKind(kind: VisualDictionaryKind | "All") {
    setActiveKind(kind);
    openDictionary();
  }

  function clearFilters() {
    setQuery("");
    setActiveRange("A-K");
    setActiveLetter("All");
    setActiveCategory("All");
    setActiveKind("All");
    setExpandedTerm("");
    setHasOpenedDictionary(false);
    setVisibleCount(initialVisibleTerms);
  }

  return (
    <div className="visual-dictionary-page space-y-4">
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

      <SectionCard title="Choose a Category" description="Start here. Terms are shown only after you pick a category, visual type, letter range, or search word." compact>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => chooseCategory("All")}
            className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300 ${activeCategory === "All" && hasOpenedDictionary ? "border-cyan-300 bg-cyan-50 shadow-lg shadow-cyan-950/10 dark:bg-cyan-300/10" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"}`}
          >
            <span className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Fast start</span>
            <span className="mt-1 block text-2xl font-black text-slate-950 dark:text-white">Browse A-K</span>
            <span className="mt-1 block text-sm font-bold text-slate-500 dark:text-slate-300">{rangeCounts["A-K"]} terms in first batch range</span>
          </button>
          {visualDictionaryCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => chooseCategory(category)}
              className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300 ${activeCategory === category ? "border-cyan-300 bg-cyan-50 shadow-lg shadow-cyan-950/10 dark:bg-cyan-300/10" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"}`}
            >
              <span className={`mb-3 block h-2 w-16 rounded-full bg-gradient-to-r ${categoryStyles[category]}`} />
              <span className="block text-lg font-black text-slate-950 dark:text-white">{category}</span>
              <span className="mt-1 block text-sm font-bold text-slate-500 dark:text-slate-300">{categoryCounts[category] ?? 0} terms</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Quick Visual Words" description="Tap a word to open one exact definition with its visual." compact>
        <div className="flex flex-wrap gap-2">
          {visualFocusTerms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => focusTerm(term)}
              className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-800 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-100 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100"
            >
              {term}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Filters" description="Use one filter at a time or combine them. The result list opens only after a filter is selected." compact>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHasOpenedDictionary(!!event.target.value.trim());
                setVisibleCount(initialVisibleTerms);
                setExpandedTerm("");
              }}
              placeholder="Search arc, tangent, tan, sec, vector, mean..."
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-400/10"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black dark:border-white/10 dark:bg-slate-950">
            <Filter className="h-4 w-4 text-cyan-600" />
            <select value={activeCategory} onChange={(event) => chooseCategory(event.target.value as VisualDictionaryCategory | "All")} className="w-full bg-transparent outline-none">
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
                openDictionary();
              }}
              className={`rounded-xl border px-4 py-3 text-left transition ${activeRange === range.id && !query.trim() ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}
            >
              <span className="block text-sm font-black">{range.label}</span>
              <span className="text-xs font-semibold opacity-75">{rangeCounts[range.id]} terms</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["All", ...visualDictionaryLetters].map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => {
                setActiveLetter(letter);
                openDictionary();
              }}
              className={`min-w-10 rounded-full border px-3 py-2 text-sm font-black transition ${activeLetter === letter ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}
            >
              {letter}
              {letter !== "All" && <span className="ml-1 text-[10px] opacity-70">{letterCounts[letter] ?? 0}</span>}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["All", ...visualKinds] as Array<VisualDictionaryKind | "All">).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => chooseKind(kind)}
              className={`rounded-xl border px-3 py-2 text-sm font-black transition ${activeKind === kind ? "border-slate-950 bg-slate-950 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}
            >
              {kind === "All" ? "All visuals" : visualKindLabels[kind]}
              {kind !== "All" && <span className="ml-1 text-[10px] opacity-70">{kindCounts[kind] ?? 0}</span>}
            </button>
          ))}
        </div>
      </SectionCard>

      {!hasOpenedDictionary ? (
        <div className="rounded-xl border border-dashed border-cyan-300 bg-cyan-50/70 p-8 text-center dark:border-cyan-300/30 dark:bg-cyan-300/10">
          <Eye className="mx-auto h-8 w-8 text-cyan-700 dark:text-cyan-200" />
          <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">Pick a category to begin.</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            The dictionary is not rendering all terms at once. Choose a category, visual type, letter range, or quick word to open a focused batch.
          </p>
        </div>
      ) : (
        <main className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                Showing {shownCount} of {filteredTerms.length} matching terms
              </p>
              <div className="flex flex-wrap gap-2">
                {activeCategory !== "All" && <span className="mini-chip">{activeCategory}</span>}
                {activeKind !== "All" && <span className="mini-chip">{visualKindLabels[activeKind]}</span>}
                {activeLetter !== "All" && <span className="mini-chip">Letter {activeLetter}</span>}
                {!query.trim() && activeLetter === "All" && <span className="mini-chip">{activeRange}</span>}
                <button type="button" onClick={clearFilters} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-cyan-400/10">
                  Back to categories
                </button>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-label={`${progressPercent}% of matching terms shown`}>
              <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          {Object.keys(grouped).sort().map((letter) => (
            <SectionCard key={letter} id={`letter-${letter}`} title={letter} description={`${grouped[letter].length} entries loaded`} compact>
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
          {shownCount < filteredTerms.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + loadMoreTerms)}
              className="w-full rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-900 transition hover:-translate-y-0.5 hover:bg-cyan-100 dark:bg-cyan-300/10 dark:text-cyan-100"
            >
              Load next {Math.min(loadMoreTerms, filteredTerms.length - shownCount)} terms
            </button>
          )}
          {!filteredTerms.length && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-white/15 dark:bg-white/5">
              <Eye className="mx-auto h-8 w-8 text-cyan-600" />
              <h2 className="mt-3 text-lg font-black">No dictionary term matched.</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try another word, symbol, category, or clear the filters.</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

function DictionaryListItem({ entry, isExpanded, onToggle }: { entry: VisualDictionaryTerm; isExpanded: boolean; onToggle: () => void }) {
  const tone = categoryStyles[entry.category];
  const lower = entry.term.toLowerCase();
  const meaning = entry.explanation ?? customMeanings[lower]?.meaning ?? defaultMeaning(entry);
  const example = entry.representation ?? customMeanings[lower]?.example ?? defaultExample(entry);
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
            {entry.description ? <p className="mb-2 text-sm font-black text-slate-950 dark:text-white">{entry.description}</p> : null}
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{meaning}</p>
            <div className="mt-3 rounded-xl bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
              <span className="font-black text-slate-900 dark:text-white">{entry.representation ? "Visual representation: " : "Example: "}</span>{example}
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
  if (
    lower.includes("correlation") ||
    lower === "covariance" ||
    lower === "bivariate data" ||
    lower === "least squares" ||
    lower === "regression line" ||
    lower === "residual" ||
    lower === "principal component"
  ) {
    const negative = lower.includes("negative");
    const points = [
      [74, negative ? 62 : 126],
      [104, negative ? 72 : 108],
      [136, negative ? 84 : 98],
      [170, negative ? 92 : 78],
      [206, negative ? 112 : 68],
      [242, negative ? 122 : 50],
      [276, negative ? 136 : 42],
    ];
    return (
      <g fill="none" strokeLinecap="round">
        <line x1="54" y1="140" x2="316" y2="140" stroke="#64748b" strokeWidth="4" />
        <line x1="66" y1="28" x2="66" y2="150" stroke="#64748b" strokeWidth="4" />
        {points.map(([x, y], index) => <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill={index === 4 ? "#fbbf24" : "#22d3ee"} stroke="none" />)}
        <line x1="72" y1={negative ? 58 : 126} x2="288" y2={negative ? 134 : 44} stroke={fill} strokeWidth="5" />
        {lower === "residual" || lower === "least squares" ? points.slice(1, 6).map(([x, y]) => <line key={`res-${x}`} x1={x} y1={y} x2={x} y2={negative ? x * 0.35 + 32 : 152 - x * 0.34} stroke="#fbbf24" strokeWidth="3" strokeDasharray="5 4" />) : null}
        <text x="186" y="120" fill="#f8fafc" fontSize="15" fontWeight="900">{negative ? "downward trend" : "upward trend"}</text>
      </g>
    );
  }
  if (
    lower.includes("distribution") ||
    lower.includes("probability mass") ||
    lower.includes("frequency") ||
    lower === "chi-square statistic" ||
    lower === "hypothesis test" ||
    lower === "critical value" ||
    lower === "rejection region" ||
    lower === "quantile" ||
    lower === "entropy" ||
    lower === "poisson distribution" ||
    lower === "geometric distribution" ||
    lower === "negative binomial distribution" ||
    lower === "discrete random variable"
  ) {
    const curveTerms = ["critical value", "hypothesis test", "rejection region", "quantile", "beta distribution", "normal distribution", "distribution function", "kernel density estimate"];
    const useCurve = curveTerms.some((termName) => lower.includes(termName));
    return (
      <g>
        <line x1="48" y1="136" x2="318" y2="136" stroke="#64748b" strokeWidth="4" />
        {useCurve ? (
          <>
            <path d="M60 136 C96 134 112 104 140 72 C166 42 212 42 238 72 C266 104 284 134 316 136" fill="rgba(34,211,238,.18)" stroke="#a78bfa" strokeWidth="5" />
            <path d="M248 78 C268 106 286 132 316 136 L248 136 Z" fill="rgba(251,191,36,.38)" />
            <line x1="248" y1="52" x2="248" y2="140" stroke="#fbbf24" strokeWidth="4" strokeDasharray="6 5" />
            <text x="208" y="48" fill="#f8fafc" fontSize="14" fontWeight="900">cutoff / tail</text>
          </>
        ) : (
          <>
            {[42, 74, 104, 82, 54, 34].map((height, index) => (
              <rect key={`prob-bar-${index}`} x={70 + index * 38} y={136 - height} width="26" height={height} rx="5" fill={index === 2 ? "#fbbf24" : "#22d3ee"} />
            ))}
            {lower === "chi-square statistic" || lower.includes("expected") ? [34, 64, 96, 76, 48, 26].map((height, index) => (
              <rect key={`expected-${index}`} x={84 + index * 38} y={136 - height} width="10" height={height} rx="3" fill="#a78bfa" />
            )) : null}
            <text x="82" y="48" fill="#f8fafc" fontSize="14" fontWeight="900">{lower.includes("expected") || lower === "chi-square statistic" ? "observed vs expected" : "probability bars"}</text>
          </>
        )}
        <text x="80" y="158" fill="#f8fafc" fontSize="13" fontWeight="900">outcomes</text>
      </g>
    );
  }
  if (lower === "bernoulli trial" || lower.includes("tree") || lower === "conditional expectation" || lower === "law of total expectation") {
    return (
      <g fill="none" strokeLinecap="round">
        <circle cx="94" cy="88" r="16" fill="#22d3ee" stroke="none" />
        <path d="M110 82 L178 52 M110 94 L178 124" stroke="#e2e8f0" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
        <circle cx="198" cy="48" r="18" fill="#fbbf24" stroke="none" />
        <circle cx="198" cy="128" r="18" fill="#a78bfa" stroke="none" />
        <text x="224" y="54" fill="#f8fafc" fontSize="14" fontWeight="900">success</text>
        <text x="224" y="134" fill="#f8fafc" fontSize="14" fontWeight="900">failure</text>
        <text x="90" y="38" fill="#f8fafc" fontSize="14" fontWeight="900">two outcomes</text>
      </g>
    );
  }
  if (lower === "markov chain" || lower === "markov property") {
    return (
      <g fill="none" strokeLinecap="round">
        {[
          [82, 92, "A"],
          [174, 52, "B"],
          [270, 96, "C"],
        ].map(([x, y, label]) => (
          <g key={label}>
            <circle cx={x} cy={y} r="24" fill={label === "B" ? "#fbbf24" : "#22d3ee"} stroke="none" />
            <text x={x} y={Number(y) + 6} textAnchor="middle" fill="#0f172a" fontSize="18" fontWeight="900">{label}</text>
          </g>
        ))}
        <path d="M104 82 L150 62 M198 62 L246 84 M252 114 C190 150 118 132 96 112" stroke="#e2e8f0" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
        <text x="118" y="150" fill="#f8fafc" fontSize="14" fontWeight="900">next depends on current state</text>
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
  if (lower === "lower sum" || lower === "upper sum" || lower === "area under curve" || lower === "definite integral") {
    const upper = lower === "upper sum";
    const heights = upper ? [56, 42, 48, 72, 92, 82] : [86, 74, 92, 108, 116, 104];
    return (
      <g fill="none" strokeLinecap="round">
        <line x1="48" y1="136" x2="318" y2="136" stroke="#64748b" strokeWidth="4" />
        <line x1="66" y1="24" x2="66" y2="150" stroke="#64748b" strokeWidth="4" />
        {heights.map((top, index) => (
          <rect
            key={`${lower}-${index}`}
            x={78 + index * 36}
            y={top}
            width="34"
            height={136 - top}
            fill={upper ? "rgba(251,191,36,.28)" : "rgba(34,211,238,.26)"}
            stroke={upper ? "#fbbf24" : "#22d3ee"}
            strokeWidth="2"
          />
        ))}
        <path d="M78 124 C108 72 138 58 174 82 C210 110 242 48 294 72" stroke="#f8fafc" strokeWidth="5" />
        <text x="202" y="42" fill="#f8fafc" fontSize="15" fontWeight="900">{upper ? "rectangles above" : "rectangles under"}</text>
        <text x="88" y="154" fill="#f8fafc" fontSize="13" fontWeight="900">area estimate</text>
      </g>
    );
  }
  if (lower === "abel summation" || lower === "cumulative sum") {
    const bars = [26, 44, 34, 58, 46];
    let total = 0;
    const totals = bars.map((bar) => (total += bar));
    return (
      <g>
        <line x1="50" y1="134" x2="314" y2="134" stroke="#64748b" strokeWidth="4" />
        {bars.map((bar, index) => (
          <rect key={`bar-${index}`} x={70 + index * 34} y={134 - bar} width="22" height={bar} rx="5" fill={index % 2 ? "#fbbf24" : "#22d3ee"} />
        ))}
        <path
          d={totals.map((sum, index) => `${index === 0 ? "M" : "L"} ${81 + index * 34} ${128 - sum * 0.28}`).join(" ")}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="214" y="62" fill="#f8fafc" fontSize="15" fontWeight="900">running totals</text>
        <text x="78" y="42" fill="#f8fafc" fontSize="14" fontWeight="900">sum by parts</text>
      </g>
    );
  }
  if (lower === "fractal dimension") {
    const squares = [
      [82, 50, 60],
      [154, 50, 28],
      [190, 50, 28],
      [154, 86, 28],
      [190, 86, 28],
      [236, 48, 14],
      [256, 48, 14],
      [236, 68, 14],
      [256, 68, 14],
      [236, 92, 14],
      [256, 92, 14],
    ];
    return (
      <g>
        {squares.map(([x, y, size], index) => (
          <rect
            key={`${x}-${y}-${size}-${index}`}
            x={x}
            y={y}
            width={size}
            height={size}
            fill={index === 0 ? "rgba(34,211,238,.36)" : index < 5 ? "rgba(251,191,36,.34)" : "rgba(167,139,250,.38)"}
            stroke={index === 0 ? "#22d3ee" : index < 5 ? "#fbbf24" : "#a78bfa"}
            strokeWidth="3"
          />
        ))}
        <path d="M146 80 H154 M222 80 H236" stroke="#f8fafc" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
        <text x="78" y="138" fill="#f8fafc" fontSize="14" fontWeight="900">same pattern, smaller scale</text>
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
