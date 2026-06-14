import { useMemo, useState } from "react";
import { BookOpen, Eye, Filter, Search, Sparkles } from "lucide-react";
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

export default function MathVisualDictionary() {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");
  const [activeCategory, setActiveCategory] = useState<VisualDictionaryCategory | "All">("All");

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return visualDictionaryTerms.filter((entry) => {
      const matchesQuery = !normalized || [entry.term, entry.category, entry.kind, ...entry.keywords].join(" ").toLowerCase().includes(normalized);
      const matchesLetter = activeLetter === "All" || entry.term.toUpperCase().startsWith(activeLetter);
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      return matchesQuery && matchesLetter && matchesCategory;
    });
  }, [activeCategory, activeLetter, query]);

  const grouped = useMemo(() => {
    return filteredTerms.reduce<Record<string, VisualDictionaryTerm[]>>((groups, term) => {
      const letter = term.term[0].toUpperCase();
      groups[letter] = [...(groups[letter] ?? []), term];
      return groups;
    }, {});
  }, [filteredTerms]);

  return (
    <div className="space-y-4">
      <TopicHeader
        title="Maths Visual Dictionary"
        subtitle="A-Z visual dictionary with 200+ math words, color-coded diagrams, plain explanations, and examples."
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

      <SectionCard title="Find a Word" description="Search, choose a category, or jump by first letter." compact>
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
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 thin-scrollbar">
          {["All", ...visualDictionaryLetters].map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setActiveLetter(letter)}
              className={`min-w-10 rounded-full border px-3 py-2 text-sm font-black transition ${activeLetter === letter ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5 xl:sticky xl:top-24 xl:self-start">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <BookOpen className="h-4 w-4 text-cyan-600" /> Categories
          </p>
          <div className="mt-3 grid gap-2">
            {(["All", ...visualDictionaryCategories] as Array<VisualDictionaryCategory | "All">).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-black transition ${activeCategory === category ? "bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-cyan-50 dark:bg-white/10 dark:text-slate-200"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <main className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-black text-slate-700 dark:text-slate-200">{filteredTerms.length} terms shown</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Built as static browser-side data for easy expansion to 2000 terms.</p>
          </div>
          {Object.keys(grouped).sort().map((letter) => (
            <SectionCard key={letter} id={`letter-${letter}`} title={letter} description={`${grouped[letter].length} visual dictionary entries`} compact>
              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {grouped[letter].map((entry) => <DictionaryCard key={entry.term} entry={entry} />)}
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
    </div>
  );
}

function DictionaryCard({ entry }: { entry: VisualDictionaryTerm }) {
  const tone = categoryStyles[entry.category];
  const lower = entry.term.toLowerCase();
  const meaning = customMeanings[lower]?.meaning ?? defaultMeaning(entry);
  const example = customMeanings[lower]?.example ?? defaultExample(entry);
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white/86 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/5">
      <div className={`h-2 bg-gradient-to-r ${tone}`} />
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{entry.category}</p>
            <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{entry.term}</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">{entry.kind}</span>
        </div>
        <div className="mt-3 rounded-xl bg-slate-950 p-2 text-white">
          <DictionaryVisual kind={entry.kind} term={entry.term} tone={tone} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{meaning}</p>
        <div className="mt-3 rounded-lg bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
          <span className="font-black text-slate-900 dark:text-white">Example: </span>{example}
        </div>
      </div>
    </article>
  );
}

function DictionaryVisual({ kind, term, tone }: { kind: VisualDictionaryKind; term: string; tone: string }) {
  return (
    <svg viewBox="0 0 360 180" className="h-44 w-full rounded-lg bg-slate-950" role="img" aria-label={`${term} visual`}>
      <defs>
        <linearGradient id={`dict-${safeId(term)}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={gradientStart(tone)} />
          <stop offset="100%" stopColor={gradientEnd(tone)} />
        </linearGradient>
      </defs>
      <Grid />
      {renderVisual(kind, term, `url(#dict-${safeId(term)})`)}
      <text x="18" y="162" fill="#e2e8f0" fontSize="15" fontWeight="900">{term}</text>
    </svg>
  );
}

function renderVisual(kind: VisualDictionaryKind, term: string, fill: string) {
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
