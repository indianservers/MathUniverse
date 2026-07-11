import { motion } from "framer-motion";
import { BrainCircuit, Check, Download, Dices, Layers3, Play, Repeat2, Sigma, SplitSquareVertical, Workflow } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import {
  binomialExpansion,
  buildCountingTree,
  bellNumber,
  catalanNumber,
  combinations,
  constrainedRepetitions,
  derangements,
  enumerateCombinations,
  enumeratePermutations,
  integerPartitions,
  inclusionExclusion,
  linearRecurrenceSequence,
  multinomialTerms,
  pascalTriangle,
  pigeonholeLoad,
  permutations,
  secondOrderGeneratingFunction,
  stirlingSecondKind,
  worksheetSummary,
  type CountingNode,
} from "./combinatoricsEngine";
import { useCombinatoricsStore, type CombinatoricsState } from "./combinatoricsStore";

type CombinatoricsTab = "map" | "counting" | "selection" | "coefficients" | "advanced" | "practice";

const combinatoricsTabs: Array<{ id: CombinatoricsTab; label: string; icon: typeof Workflow }> = [
  { id: "map", label: "Concept Map", icon: Workflow },
  { id: "counting", label: "Counting", icon: SplitSquareVertical },
  { id: "selection", label: "Permutations", icon: Layers3 },
  { id: "coefficients", label: "Coefficients", icon: Sigma },
  { id: "advanced", label: "Advanced", icon: Repeat2 },
  { id: "practice", label: "Practice", icon: BrainCircuit },
];

export default function CombinatoricsModule() {
  const store = useCombinatoricsStore();
  const [activeTab, setActiveTab] = useState<CombinatoricsTab>("map");
  const tree = useMemo(() => buildCountingTree(store.items, store.r, store.allowRepeat), [store.items, store.r, store.allowRepeat]);
  const permutationList = useMemo(() => enumeratePermutations(store.items, store.r, store.allowRepeat, store.constraint), [store.items, store.r, store.allowRepeat, store.constraint]);
  const combinationList = useMemo(() => enumerateCombinations(store.items, Math.min(store.r, store.items.length)), [store.items, store.r]);
  const binomialTerms = useMemo(() => binomialExpansion("a", "b", store.binomialPower), [store.binomialPower]);
  const multiTerms = useMemo(() => multinomialTerms(["x", "y", "z"], store.multinomialPower), [store.multinomialPower]);

  return (
    <div className="space-y-3">
      <TopicHeader
        title="Combinatorics"
        subtitle="Visualize counting trees, permutations, combinations, Pascal coefficients, expansions, and inclusion-exclusion."
        difficulty="Discrete Counting Lab"
        estimatedMinutes={65}
        formula={{ title: "Counting identity", formula: String.raw`{n \choose r}=\frac{n!}{r!(n-r)!}`, explanation: "The module connects exact formulas with visual enumeration and animated counting arguments." }}
      />

      <ControlsPanel {...store} />

      <nav className="sticky top-2 z-20 flex gap-2 overflow-x-auto rounded-2xl border border-cyan-100 bg-white/95 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/95" aria-label="Combinatorics workspaces">
        {combinatoricsTabs.map((tab) => (
          <TabButton key={tab.id} active={activeTab === tab.id} icon={tab.icon} label={tab.label} onClick={() => setActiveTab(tab.id)} />
        ))}
      </nav>

      {activeTab === "map" ? <ImplementationAudit /> : null}

      {activeTab === "counting" ? (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
          <CountingVisualizationEngine tree={tree} n={store.n} r={store.r} allowRepeat={store.allowRepeat} />
          <InclusionExclusionSimulator />
        </div>
      ) : null}

      {activeTab === "selection" ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <PermutationSimulator items={store.items} r={store.r} allowRepeat={store.allowRepeat} constraint={store.constraint} permutations={permutationList} />
          <CombinationGenerator items={store.items} r={Math.min(store.r, store.items.length)} combinations={combinationList} />
        </div>
      ) : null}

      {activeTab === "coefficients" ? (
        <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
          <PascalTriangleExplorer rows={store.pascalRows} selectedPower={store.binomialPower} onRows={store.setPascalRows} onPower={store.setBinomialPower} />
          <div className="grid gap-4">
            <BinomialTheoremVisualizer power={store.binomialPower} terms={binomialTerms} selectedTerm={store.selectedTerm} onPower={store.setBinomialPower} onSelectedTerm={store.setSelectedTerm} />
            <MultinomialExpansionEngine power={store.multinomialPower} terms={multiTerms} onPower={store.setMultinomialPower} />
          </div>
        </div>
      ) : null}

      {activeTab === "advanced" ? <AdvancedCountingLab n={store.n} r={store.r} /> : null}

      {activeTab === "practice" ? <ChallengeAndExportPanel n={store.n} r={store.r} seed={store.challengeSeed} onRandom={store.randomizeChallenge} /> : null}
    </div>
  );
}

function ImplementationAudit() {
  const rows = [
    ["Counting Principles", "Implemented", "Product rule, addition rule, tree diagram, exact counters, and bounded cases."],
    ["Permutations", "Implemented", "Arrangements with repetition, no repetition, constraints, and capped enumeration."],
    ["Combinations", "Implemented", "Subset generator with visual group selection and exact nCr calculation."],
    ["Repetition Cases", "Implemented", "Repeated permutations, repeated combinations, and bounded distributions."],
    ["Binomial Coefficients", "Implemented", "Pascal explorer with highlighted rows and coefficient meaning."],
    ["Binomial Theorem", "Implemented", "Interactive expansion terms connected to choices from each factor."],
    ["Multinomial Theorem", "Implemented", "Symbolic term engine for three-variable expansions."],
    ["Inclusion-Exclusion", "Implemented", "Animated three-set Venn calculation with overlap steps."],
    ["Pigeonhole Principle", "Implemented", "Forced box-load visual and smallest guaranteed load."],
    ["Derangements", "Implemented", "No-fixed-point counter using the standard recurrence."],
    ["Catalan Numbers", "Implemented", "Parentheses, triangulation, and path-counting family counter."],
    ["Stirling and Bell Numbers", "Implemented", "Partition-into-groups counter and total set partition count."],
    ["Integer Partitions", "Implemented", "Compact partition lister for number decomposition."],
    ["Recurrences", "Implemented", "Second-order recurrence trace and generating-function form."],
  ];
  return (
    <SectionCard title="Concept Map" description="Major combinatorics concepts are split into focused tabs instead of one long page.">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(([topic, status, action]) => (
          <div key={topic} className="rounded-2xl border border-cyan-100 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-black text-slate-950 dark:text-white">{topic}</h2>
              <span className="mini-chip bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">{status}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{action}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function TabButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Workflow; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${
        active
          ? "bg-cyan-600 text-white shadow"
          : "bg-slate-100 text-slate-700 hover:bg-cyan-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ControlsPanel({ items, n, r, allowRepeat, constraint, setItems, setN, setR, setAllowRepeat, setConstraint }: CombinatoricsState) {
  const [itemDraft, setItemDraft] = useState(items.join(", "));
  return (
    <SectionCard title="Counting Controls" description="Shared controls drive the counting tree, permutations, combinations, and formulas.">
      <div className="grid gap-3 lg:grid-cols-[1.3fr_.7fr_.7fr_.8fr]">
        <label className="text-sm font-black">Objects<input className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={itemDraft} onChange={(event) => setItemDraft(event.target.value)} onBlur={() => setItems(itemDraft.split(/[\s,]+/).map((item: string) => item.trim()).filter(Boolean))} /></label>
        <NumberField label="n" value={n} min={1} max={30} onChange={setN} />
        <NumberField label="r" value={r} min={1} max={6} onChange={setR} />
        <label className="flex items-end gap-2 rounded-xl bg-slate-100 p-3 text-sm font-black dark:bg-white/10"><input type="checkbox" checked={allowRepeat} onChange={(event) => setAllowRepeat(event.target.checked)} /> Allow repetition</label>
      </div>
      <label className="mt-3 block text-sm font-black">Permutation constraint contains<input className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={constraint} onChange={(event) => setConstraint(event.target.value)} placeholder="Example: AB" /></label>
    </SectionCard>
  );
}

function CountingVisualizationEngine({ tree, n, r, allowRepeat }: { tree: CountingNode; n: number; r: number; allowRepeat: boolean }) {
  const levels = flattenTree(tree).slice(0, 90);
  return (
    <SectionCard title="Counting Visualization Engine" description="Tree-based counting with animated branching and product-rule steps.">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="P(n,r)" value={permutations(n, r).toString()} />
        <Metric label="P rep" value={permutations(n, r, true).toString()} />
        <Metric label="C(n,r)" value={combinations(n, r).toString()} />
        <Metric label="Bounded reps" value={constrainedRepetitions(r, 3, 2).toString()} />
      </div>
      <svg viewBox="0 0 620 330" className="mt-4 h-80 w-full rounded-2xl bg-slate-950">
        {levels.map((node, index) => {
          const x = 55 + node.depth * 135;
          const sameDepthIndex = levels.filter((item, i) => i < index && item.depth === node.depth).length;
          const y = 35 + (sameDepthIndex % 9) * 32;
          return (
            <motion.g key={`${node.id}-${index}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(index * 0.01, 0.8) }}>
              <circle cx={x} cy={y} r="13" fill={node.depth === r ? "#34d399" : "#38bdf8"} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#0f172a">{node.label.slice(-2)}</text>
            </motion.g>
          );
        })}
      </svg>
      <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
        {allowRepeat ? `Each of ${r} stages has the same choices, so multiply n by itself r times.` : `Choices shrink after each stage, so multiply n(n-1)... for ${r} stages.`}
      </div>
    </SectionCard>
  );
}

function PermutationSimulator({ items, r, allowRepeat, constraint, permutations: list }: { items: string[]; r: number; allowRepeat: boolean; constraint: string; permutations: string[][] }) {
  const [step, setStep] = useState(0);
  const active = list[step % Math.max(1, list.length)] ?? [];
  return (
    <SectionCard title="Permutation Simulator" description="Arrange objects visually, animate swaps, and filter arrangements by constraints.">
      <div className="flex flex-wrap gap-2">
        <button className="tool-button" type="button" onClick={() => setStep(step + 1)}><Play className="h-4 w-4" /> Next arrangement</button>
        <span className="mini-chip">{list.length} shown</span>
        <span className="mini-chip">{allowRepeat ? "repetition on" : "no repetition"}</span>
      </div>
      <div className="mt-4 flex min-h-28 flex-wrap items-center gap-3 rounded-2xl bg-slate-950 p-4">
        {active.map((item, index) => <motion.div key={`${item}-${index}-${step}`} layout initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300 text-xl font-black text-slate-950">{item}</motion.div>)}
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Constraint: {constraint || "none"}. Items: {items.join(", ")}. Length: {r}.</p>
    </SectionCard>
  );
}

function CombinationGenerator({ items, r, combinations: list }: { items: string[]; r: number; combinations: string[][] }) {
  const [selected, setSelected] = useState(0);
  const active = list[selected % Math.max(1, list.length)] ?? [];
  return (
    <SectionCard title="Combination Generator" description="Order is ignored; selected subsets animate as groups.">
      <div className="flex flex-wrap gap-2">{list.slice(0, 16).map((combo, index) => <button key={combo.join("-")} type="button" className={`mini-chip ${index === selected ? "bg-cyan-200 dark:bg-cyan-400/30" : ""}`} onClick={() => setSelected(index)}>{"{"}{combo.join(",")}{"}"}</button>)}</div>
      <div className="mt-4 flex flex-wrap gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
        {items.map((item) => <motion.div key={item} animate={{ scale: active.includes(item) ? 1.16 : 1, opacity: active.includes(item) ? 1 : 0.45 }} className={`rounded-2xl px-4 py-3 font-black ${active.includes(item) ? "bg-emerald-300 text-slate-950" : "bg-white dark:bg-slate-950"}`}>{item}</motion.div>)}
      </div>
      <div className="mt-3 text-sm font-semibold">C({items.length},{r}) = {combinations(items.length, r).toString()}</div>
    </SectionCard>
  );
}

function PascalTriangleExplorer({ rows, selectedPower, onRows, onPower }: { rows: number; selectedPower: number; onRows: (value: number) => void; onPower: (value: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triangle = useMemo(() => pascalTriangle(rows), [rows]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "700 13px sans-serif";
    context.textAlign = "center";
    triangle.forEach((row, rowIndex) => row.forEach((value, colIndex) => {
      const x = canvas.width / 2 + (colIndex - rowIndex / 2) * 42;
      const y = 28 + rowIndex * 30;
      context.fillStyle = rowIndex === selectedPower ? "#22d3ee" : "#e2e8f0";
      context.beginPath();
      context.arc(x, y, 16, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#0f172a";
      context.fillText(value.toString(), x, y + 4);
    }));
  }, [triangle, selectedPower]);
  return (
    <SectionCard title="Pascal Triangle Explorer" description="Canvas-rendered rows keep larger coefficient previews smooth.">
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField label="Rows" value={rows} min={2} max={14} onChange={onRows} />
        <NumberField label="Highlight row" value={selectedPower} min={0} max={rows} onChange={onPower} />
      </div>
      <canvas ref={canvasRef} width="720" height="430" className="mt-4 h-96 w-full rounded-2xl bg-slate-950" />
    </SectionCard>
  );
}

function BinomialTheoremVisualizer({ power, terms, selectedTerm, onPower, onSelectedTerm }: { power: number; terms: ReturnType<typeof binomialExpansion>; selectedTerm: number; onPower: (value: number) => void; onSelectedTerm: (value: number) => void }) {
  const active = terms[Math.min(selectedTerm, terms.length - 1)];
  return (
    <SectionCard title="Binomial Theorem Visualizer" description="Expand (a+b)^n and inspect coefficient meaning term by term.">
      <NumberField label="Power n" value={power} min={1} max={12} onChange={onPower} />
      <div className="mt-4 flex flex-wrap gap-2">{terms.map((term, index) => <motion.button key={term.k} type="button" onClick={() => onSelectedTerm(index)} className={`rounded-xl border px-3 py-2 font-mono text-xs ${index === selectedTerm ? "border-cyan-300 bg-cyan-100 dark:bg-cyan-400/20" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"}`} animate={{ y: index === selectedTerm ? -4 : 0 }}>{term.term}</motion.button>)}</div>
      {active && <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">{active.explanation}</div>}
    </SectionCard>
  );
}

function MultinomialExpansionEngine({ power, terms, onPower }: { power: number; terms: ReturnType<typeof multinomialTerms>; onPower: (value: number) => void }) {
  return (
    <SectionCard title="Multinomial Expansion Engine" description="Generate terms for (x+y+z)^n with color-coded symbolic powers.">
      <NumberField label="Power n" value={power} min={1} max={7} onChange={onPower} />
      <div className="mt-4 grid max-h-80 gap-2 overflow-auto sm:grid-cols-2">
        {terms.map((term, index) => <motion.div key={`${term.term}-${index}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-100 p-3 font-mono text-sm dark:bg-white/10">{term.term}</motion.div>)}
      </div>
    </SectionCard>
  );
}

function InclusionExclusionSimulator() {
  const result = inclusionExclusion(28, 24, 18, 10, 8, 6, 3);
  return (
    <SectionCard title="Inclusion-Exclusion Simulator" description="Animated Venn calculations show why overlaps are subtracted and restored.">
      <svg viewBox="0 0 520 280" className="h-72 w-full rounded-2xl bg-slate-950">
        <motion.circle cx="220" cy="125" r="82" fill="#22d3ee" opacity="0.42" animate={{ scale: [1, 1.04, 1] }} />
        <motion.circle cx="300" cy="125" r="82" fill="#a78bfa" opacity="0.42" animate={{ scale: [1, 1.04, 1] }} transition={{ delay: 0.15 }} />
        <motion.circle cx="260" cy="185" r="82" fill="#34d399" opacity="0.38" animate={{ scale: [1, 1.04, 1] }} transition={{ delay: 0.3 }} />
        <text x="260" y="145" fill="white" textAnchor="middle" fontWeight="900">ABC=3</text>
        <text x="170" y="80" fill="white" fontWeight="900">A=28</text>
        <text x="335" y="80" fill="white" fontWeight="900">B=24</text>
        <text x="255" y="255" fill="white" fontWeight="900">C=18</text>
      </svg>
      <div className="mt-3 space-y-2">{result.steps.map((step) => <div key={step} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">{step}</div>)}</div>
    </SectionCard>
  );
}

function AdvancedCountingLab({ n, r }: { n: number; r: number }) {
  const safeN = Math.max(1, Math.min(12, n));
  const safeR = Math.max(1, Math.min(safeN, r));
  const partitions = useMemo(() => integerPartitions(safeN, 36), [safeN]);
  const recurrence = useMemo(() => linearRecurrenceSequence(1, 1, 1, 1, 10), []);
  const generatingFunction = secondOrderGeneratingFunction(1, 1, 1, 1);
  const metrics = [
    {
      label: "Pigeonhole",
      value: pigeonholeLoad(safeN, safeR).toString(),
      detail: `${safeN} objects in ${safeR} boxes forces this many in one box.`,
    },
    {
      label: "Derangements",
      value: derangements(safeN).toString(),
      detail: `Ways to rearrange ${safeN} objects with no object in its original place.`,
    },
    {
      label: "Catalan",
      value: catalanNumber(safeR).toString(),
      detail: `Balanced parentheses, non-crossing paths, and polygon triangulations for ${safeR}.`,
    },
    {
      label: "Stirling groups",
      value: stirlingSecondKind(safeN, safeR).toString(),
      detail: `Ways to split ${safeN} objects into ${safeR} non-empty unlabeled groups.`,
    },
    {
      label: "Bell total",
      value: bellNumber(safeR).toString(),
      detail: `All possible partitions of a ${safeR}-object set.`,
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[.95fr_1.05fr]">
      <SectionCard title="Advanced Counting Families" description="Compact counters for the concepts that were previously missing from the page.">
        <div className="grid gap-2 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-cyan-100 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{metric.label}</div>
              <div className="mt-1 break-all font-mono text-2xl font-black text-slate-950 dark:text-white">{metric.value}</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{metric.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Partitions, Recurrences, and Generating Functions" description="See compact structure without turning the page into a long textbook.">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <h3 className="font-black">Integer partitions of {safeN}</h3>
            <div className="mt-2 grid max-h-56 gap-2 overflow-auto pr-1 text-sm">
              {partitions.map((partition, index) => (
                <div key={`${partition.join("+")}-${index}`} className="rounded-xl bg-white px-3 py-2 font-mono dark:bg-slate-950">
                  {safeN} = {partition.join(" + ")}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <h3 className="font-black">Recurrence trace</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {recurrence.map((value, index) => (
                <span key={`${value}-${index}`} className="mini-chip">a{index}={value}</span>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-white p-3 font-mono text-sm dark:bg-slate-950">{generatingFunction}</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This pattern uses the same recurrence shape as Fibonacci-style counting problems.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function ChallengeAndExportPanel({ n, r, seed, onRandom }: { n: number; r: number; seed: number; onRandom: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const targetR = 1 + (seed % Math.max(1, Math.min(r, n)));
  const answer = combinations(n, targetR).toString();
  const exportWorksheet = () => {
    const blob = new Blob([worksheetSummary(n, r)], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "combinatorics-worksheet.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <SectionCard title="Interactive Challenges and AI Tutor Hints" description="Generate local practice prompts and export worksheet summaries.">
      <div className="flex flex-wrap gap-2">
        <button className="action-primary" type="button" onClick={() => { setRevealed(false); onRandom(); }}><Dices className="h-4 w-4" /> Random challenge</button>
        <button className="tool-button" type="button" onClick={() => setRevealed(true)}><BrainCircuit className="h-4 w-4" /> AI hint</button>
        <button className="tool-button" type="button" onClick={exportWorksheet}><Download className="h-4 w-4" /> Worksheet</button>
      </div>
      <div className="mt-3 rounded-xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">How many ways can you choose {targetR} objects from {n}?</div>
      {revealed && <div className="mt-3 rounded-xl bg-cyan-100 p-3 text-sm font-semibold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100"><Check className="mr-2 inline h-4 w-4" />Use C(n,r). Answer: {answer}.</div>}
    </SectionCard>
  );
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label className="text-sm font-black">{label}<input className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" type="number" min={min} max={max} value={value} onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value))))} /></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><div className="text-xs font-black uppercase text-slate-500">{label}</div><div className="break-all font-mono text-lg font-black">{value}</div></div>;
}

function flattenTree(root: CountingNode) {
  const nodes: CountingNode[] = [];
  const visit = (node: CountingNode) => {
    nodes.push(node);
    node.children.forEach(visit);
  };
  visit(root);
  return nodes;
}
