import "reactflow/dist/style.css";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { motion } from "framer-motion";
import { Binary, BrainCircuit, Check, Dices, GitFork, Network, Pause, Play, Table2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import {
  applySetOperation,
  cartesianProduct,
  coverRelations,
  equivalenceClasses,
  functionProperties,
  hasseLevels,
  incidenceMatrix,
  notation,
  parseElements,
  parsePairs,
  powerSet,
  randomProblem,
  relationMatrix,
  relationProperties,
  venn3Regions,
  type OrderedPair,
  type SetOperation,
} from "./setTheoryEngine";
import { useSetTheoryStore, type SetTheoryState } from "./setTheoryStore";

const operations: Array<{ id: SetOperation; label: string }> = [
  { id: "union", label: "Union" },
  { id: "intersection", label: "Intersection" },
  { id: "difference", label: "A - B" },
  { id: "complement", label: "A complement" },
  { id: "symmetric-difference", label: "Symmetric diff" },
];

type VennSetId = "A" | "B" | "C";
type VennPresetName = "disjoint" | "overlap" | "subset" | "equal" | "triple-overlap";

type VennSetCircle = {
  id: VennSetId;
  label: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  stroke: string;
};

type UniverseBounds = { x: number; y: number; width: number; height: number };

const vennUniverseBounds: UniverseBounds = { x: 34, y: 34, width: 472, height: 252 };
const vennCircleStyle: Record<VennSetId, Pick<VennSetCircle, "color" | "stroke">> = {
  A: { color: "#22d3ee", stroke: "#67e8f9" },
  B: { color: "#fb7185", stroke: "#fda4af" },
  C: { color: "#22c55e", stroke: "#86efac" },
};
const vennOverlapStyle: Record<string, { label: string; color: string; pattern: string }> = {
  AB: { label: "A ∩ B", color: "#a855f7", pattern: "url(#venn-stripes-ab)" },
  AC: { label: "A ∩ C", color: "#14b8a6", pattern: "url(#venn-dots-ac)" },
  BC: { label: "B ∩ C", color: "#f97316", pattern: "url(#venn-grid-bc)" },
  ABC: { label: "A ∩ B ∩ C", color: "#fde047", pattern: "url(#venn-triple-pattern)" },
};
const vennLabelOffsets: Record<VennSetId, { x: number; y: number }> = {
  A: { x: -42, y: -76 },
  B: { x: 42, y: -76 },
  C: { x: 0, y: 88 },
};

type VennSetName = { id: VennSetId; shortLabel: string; displayName: string };

function distance(a: { cx: number; cy: number }, b: { cx: number; cy: number }) {
  return Math.hypot(a.cx - b.cx, a.cy - b.cy);
}

function areCirclesDisjoint(circleA: VennSetCircle, circleB: VennSetCircle) {
  return distance(circleA, circleB) >= circleA.r + circleB.r - 2;
}

function isCircleInsideCircle(inner: VennSetCircle, outer: VennSetCircle) {
  return distance(inner, outer) + inner.r <= outer.r + 2;
}

function areCirclesEqual(circleA: VennSetCircle, circleB: VennSetCircle) {
  return distance(circleA, circleB) <= 4 && Math.abs(circleA.r - circleB.r) <= 4;
}

function getCircleOverlapStatus(circleA: VennSetCircle, circleB: VennSetCircle) {
  if (areCirclesEqual(circleA, circleB)) return "equal";
  if (isCircleInsideCircle(circleA, circleB)) return `${circleA.id} ⊆ ${circleB.id}`;
  if (isCircleInsideCircle(circleB, circleA)) return `${circleB.id} ⊆ ${circleA.id}`;
  if (areCirclesDisjoint(circleA, circleB)) return "disjoint";
  return "overlapping";
}

function hasTripleOverlap(circleA: VennSetCircle, circleB: VennSetCircle, circleC: VennSetCircle) {
  const candidate = {
    cx: (circleA.cx + circleB.cx + circleC.cx) / 3,
    cy: (circleA.cy + circleB.cy + circleC.cy) / 3,
  };
  return [circleA, circleB, circleC].every((circle) => distance(candidate, circle) <= circle.r);
}

function constrainCircleToUniverse(circle: VennSetCircle, bounds: UniverseBounds) {
  return {
    ...circle,
    cx: Math.min(bounds.x + bounds.width - circle.r, Math.max(bounds.x + circle.r, circle.cx)),
    cy: Math.min(bounds.y + bounds.height - circle.r, Math.max(bounds.y + circle.r, circle.cy)),
  };
}

function makeVennCircle(id: VennSetId, cx: number, cy: number, r: number): VennSetCircle {
  return { id, label: id, cx, cy, r, ...vennCircleStyle[id] };
}

function getPresetCircleLayout(presetName: VennPresetName, setCount: 2 | 3 = 3) {
  const layouts: Record<VennPresetName, VennSetCircle[]> = {
    disjoint: [makeVennCircle("A", 125, 160, 66), makeVennCircle("B", 275, 160, 66), makeVennCircle("C", 425, 160, 66)],
    overlap: [makeVennCircle("A", 220, 155, 88), makeVennCircle("B", 320, 155, 88), makeVennCircle("C", 270, 218, 88)],
    subset: [makeVennCircle("A", 248, 158, 48), makeVennCircle("B", 278, 158, 92), makeVennCircle("C", 404, 178, 66)],
    equal: [makeVennCircle("A", 270, 164, 84), makeVennCircle("B", 270, 164, 84), makeVennCircle("C", 270, 164, 84)],
    "triple-overlap": [makeVennCircle("A", 226, 150, 92), makeVennCircle("B", 314, 150, 92), makeVennCircle("C", 270, 216, 92)],
  };
  return layouts[presetName].slice(0, setCount).map((circle) => ({ ...circle }));
}

function getSetRelationshipSummary(circles: VennSetCircle[]) {
  const disjointPairs: string[] = [];
  const subsetPairs: string[] = [];
  const overlappingPairs: string[] = [];
  const equalPairs: string[] = [];

  circles.forEach((circleA, index) => {
    circles.slice(index + 1).forEach((circleB) => {
      const pair = `${circleA.id}${circleB.id}`;
      if (areCirclesEqual(circleA, circleB)) {
        equalPairs.push(pair);
      } else if (isCircleInsideCircle(circleA, circleB)) {
        subsetPairs.push(`${circleA.id} ⊆ ${circleB.id}`);
      } else if (isCircleInsideCircle(circleB, circleA)) {
        subsetPairs.push(`${circleB.id} ⊆ ${circleA.id}`);
      } else if (areCirclesDisjoint(circleA, circleB)) {
        disjointPairs.push(pair);
      } else {
        overlappingPairs.push(pair);
      }
    });
  });

  const [circleA, circleB, circleC] = circles;
  const tripleOverlap = Boolean(circleA && circleB && circleC && hasTripleOverlap(circleA, circleB, circleC));
  const formulas = new Set<string>();
  if (disjointPairs.includes("AB")) formulas.add("A ∩ B = ∅");
  if (overlappingPairs.includes("AB")) formulas.add("A ∩ B ≠ ∅");
  if (subsetPairs.includes("A ⊆ B")) {
    formulas.add("A ⊆ B");
    formulas.add("A ∪ B = B");
    formulas.add("A ∩ B = A");
  }
  if (subsetPairs.includes("B ⊆ A")) {
    formulas.add("B ⊆ A");
    formulas.add("A ∪ B = A");
    formulas.add("A ∩ B = B");
  }
  if (equalPairs.includes("AB")) {
    formulas.add("A = B");
    formulas.add("A ∪ B = A = B");
    formulas.add("A ∩ B = A = B");
  }
  if (tripleOverlap) formulas.add("A ∩ B ∩ C ≠ ∅");
  if (!formulas.size) formulas.add("Drag sets to compare A, B, and C.");

  const primaryStatus = equalPairs.length
    ? "Equal sets"
    : subsetPairs.length
      ? "Subset"
      : tripleOverlap
        ? "Triple overlap"
        : overlappingPairs.length
          ? "Overlapping"
          : "Disjoint";

  return { disjointPairs, subsetPairs, overlappingPairs, equalPairs, hasTripleOverlap: tripleOverlap, formulas: Array.from(formulas), primaryStatus };
}

export default function SetTheoryModule() {
  const store = useSetTheoryStore();
  const result = useMemo(() => applySetOperation(store.operation, store.universe, store.setA, store.setB), [store.operation, store.universe, store.setA, store.setB]);
  const relationProps = useMemo(() => relationProperties(store.universe, store.relationPairs), [store.universe, store.relationPairs]);
  const matrix = useMemo(() => relationMatrix(store.universe, store.relationPairs), [store.universe, store.relationPairs]);
  const classes = useMemo(() => equivalenceClasses(store.universe, store.relationPairs), [store.universe, store.relationPairs]);
  const challenge = useMemo(() => randomProblem(store.challengeSeed), [store.challengeSeed]);

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Set Theory and Relations"
        subtitle="Build sets, animate Venn operations, inspect relations, draw Hasse diagrams, and test functions."
        difficulty="Discrete Structures"
        estimatedMinutes={60}
        formula={{ title: "Core identity", formula: String.raw`A \triangle B = (A \setminus B) \cup (B \setminus A)`, explanation: "The module connects set notation, visual regions, relation matrices, directed graphs, and function mappings." }}
      />

      <SetTheoryTopicLauncher />

      <div id="sets" className="grid scroll-mt-24 gap-5 xl:grid-cols-[1fr_1fr]">
        <SetBuilder {...store} result={result} />
        <VennEngine {...store} result={result} />
      </div>

      <div id="relations" className="grid scroll-mt-24 gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <RelationStudio domain={store.universe} pairs={store.relationPairs} matrix={matrix} properties={relationProps} onPairs={store.setRelationPairs} />
        <OrderingVisualizer domain={store.universe} pairs={store.relationPairs} />
      </div>

      <div id="functions" className="grid scroll-mt-24 gap-5 xl:grid-cols-[1fr_1fr]">
        <FunctionMappingStudio domain={store.setA} codomain={store.setB} pairs={store.functionPairs} onPairs={store.setFunctionPairs} />
        <DiscreteRepresentations domain={store.universe} setA={store.setA} setB={store.setB} pairs={store.relationPairs} classes={classes} />
      </div>

      <ChallengePanel challenge={challenge} onRandom={store.randomizeChallenge} />
    </div>
  );
}

function SetTheoryTopicLauncher() {
  const topics = [
    { title: "Set representation", target: "#sets", action: "Edit rosters, drag elements, and see notation update." },
    { title: "Venn diagrams", target: "#sets", action: "Move circles, test regions, and pulse set operations." },
    { title: "Relations", target: "#relations", action: "Type ordered pairs, inspect matrix entries, and view the directed graph." },
    { title: "Ordering relations", target: "#relations", action: "Check partial-order rules and read the Hasse diagram." },
    { title: "Functions", target: "#functions", action: "Map domain to codomain and test function properties." },
    { title: "Cartesian products", target: "#representations", action: "Generate every ordered pair in A x B." },
    { title: "Power sets", target: "#representations", action: "List every subset of A with live counts." },
    { title: "Equivalence classes", target: "#representations", action: "Group related elements from the current relation." },
    { title: "Partial orders", target: "#relations", action: "Compare cover relations, levels, and lattice hints." },
  ];

  return (
    <SectionCard title="Choose a Set Theory Lab" description="Every topic below opens a working visual tool on this page. Change the sets once and every lab updates from the same data.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic, index) => (
          <a key={topic.title} href={topic.target} className="group rounded-2xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">Lab {index + 1}</span>
              <span className="text-xs font-black text-slate-400 group-hover:text-cyan-600">Open</span>
            </div>
            <h2 className="mt-3 text-base font-black text-slate-950 dark:text-white">{topic.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{topic.action}</p>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}

function SetBuilder({ universe, setA, setB, setC, result, setUniverse, setSetA, setSetB, setSetC }: SetTheoryState & { result: string[] }) {
  const palette = ["bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100", "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-100", "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100"];
  return (
    <SectionCard title="Interactive Set Builder" description="Drag elements from the universe into A or B. Notation updates immediately.">
      <div className="grid gap-3 md:grid-cols-4">
        <SetDrop title="Universe" values={universe} onChange={setUniverse} color={palette[0]} />
        <SetDrop title="A" values={setA} onChange={setSetA} color={palette[1]} />
        <SetDrop title="B" values={setB} onChange={setSetB} color={palette[2]} />
        <SetDrop title="C" values={setC} onChange={setSetC} color="bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-100" />
      </div>
      <div className="mt-4 grid gap-2 text-sm font-mono">
        {[notation("U", universe), notation("A", setA), notation("B", setB), notation("C", setC), notation("Result", result)].map((line) => <div key={line} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">{line}</div>)}
      </div>
    </SectionCard>
  );
}

function SetDrop({ title, values, onChange, color }: { title: string; values: string[]; onChange: (values: string[]) => void; color: string }) {
  const [draft, setDraft] = useState(values.join(", "));
  useEffect(() => {
    setDraft(values.join(", "));
  }, [values]);

  const commit = (nextValues: string[]) => {
    onChange(parseElements(nextValues.join(", ")));
  };

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const dropped = event.dataTransfer.getData("text/plain");
        if (dropped) commit([...values, dropped]);
      }}
    >
      <div className="text-sm font-black">{title}</div>
      <div className="mt-2 flex min-h-20 flex-wrap content-start gap-2 rounded-xl border border-dashed border-slate-300 p-2 dark:border-white/15">
        {values.map((value) => <span draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", value)} key={value} className={`rounded-full px-3 py-1 text-xs font-black ${color}`}>{value}</span>)}
      </div>
      <input className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-slate-950" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => onChange(parseElements(draft))} />
    </div>
  );
}

function VennEngine({ universe, setA, setB, setC, operation, playbackStep, result, setOperation, setPlaybackStep }: SetTheoryState & { result: string[] }) {
  const regions = venn3Regions(setA, setB, setC);
  const [circles, setCircles] = useState<VennSetCircle[]>(() => getPresetCircleLayout("overlap", 3));
  const [dragLocked, setDragLocked] = useState(false);
  const [boundaryLock, setBoundaryLock] = useState(true);
  const [selectedSetId, setSelectedSetId] = useState<VennSetId>("A");
  const [activeDraggingId, setActiveDraggingId] = useState<VennSetId | null>(null);
  const [activeRegionKey, setActiveRegionKey] = useState<string | null>(null);
  const [universeName, setUniverseName] = useState("Students in the class");
  const [setNames, setSetNames] = useState<VennSetName[]>([
    { id: "A", shortLabel: "A", displayName: "Math Lovers" },
    { id: "B", shortLabel: "B", displayName: "Science Lovers" },
    { id: "C", shortLabel: "C", displayName: "Coding Lovers" },
  ]);
  const dragState = useRef<{ id: VennSetId; dx: number; dy: number } | null>(null);
  const relationship = useMemo(() => getSetRelationshipSummary(circles), [circles]);
  const outsideUniverse = universe.filter((item) => !setA.includes(item) && !setB.includes(item) && !setC.includes(item));
  const setNameById = (id: VennSetId) => setNames.find((setName) => setName.id === id) ?? { id, shortLabel: id, displayName: id };
  const updateSetName = (id: VennSetId, key: "shortLabel" | "displayName", value: string) => {
    setSetNames((current) => current.map((setName) => setName.id === id ? { ...setName, [key]: value } : setName));
  };
  const displaySetName = (id: VennSetId) => {
    const setName = setNameById(id);
    return setName.displayName.trim() ? `${setName.shortLabel} (${setName.displayName})` : setName.shortLabel;
  };

  const updateCircle = (id: VennSetId, nextCenter: { cx: number; cy: number }) => {
    setCircles((current) =>
      current.map((circle) => {
        if (circle.id !== id) return circle;
        const nextCircle = { ...circle, ...nextCenter };
        return boundaryLock ? constrainCircleToUniverse(nextCircle, vennUniverseBounds) : nextCircle;
      })
    );
  };

  const svgPoint = (event: PointerEvent<SVGGElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(matrix.inverse());
  };

  const handlePointerDown = (circle: VennSetCircle, event: PointerEvent<SVGGElement>) => {
    if (dragLocked) return;
    const point = svgPoint(event);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedSetId(circle.id);
    setActiveDraggingId(circle.id);
    dragState.current = { id: circle.id, dx: point.x - circle.cx, dy: point.y - circle.cy };
  };

  const handlePointerMove = (event: PointerEvent<SVGGElement>) => {
    const activeDrag = dragState.current;
    if (!activeDrag) return;
    const point = svgPoint(event);
    if (!point) return;
    event.preventDefault();
    updateCircle(activeDrag.id, { cx: point.x - activeDrag.dx, cy: point.y - activeDrag.dy });
  };

  const handlePointerEnd = (event: PointerEvent<SVGGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
    setActiveDraggingId(null);
  };

  const handleCircleKeyDown = (circle: VennSetCircle, event: KeyboardEvent<SVGGElement>) => {
    const movement = event.shiftKey ? 18 : 6;
    const directions: Partial<Record<string, { x: number; y: number }>> = {
      ArrowUp: { x: 0, y: -movement },
      ArrowDown: { x: 0, y: movement },
      ArrowLeft: { x: -movement, y: 0 },
      ArrowRight: { x: movement, y: 0 },
    };
    const direction = directions[event.key];
    if (!direction || dragLocked) return;
    event.preventDefault();
    setSelectedSetId(circle.id);
    updateCircle(circle.id, { cx: circle.cx + direction.x, cy: circle.cy + direction.y });
  };

  const applyPreset = (preset: VennPresetName) => {
    setCircles(getPresetCircleLayout(preset, 3));
    setSelectedSetId("A");
    setPlaybackStep(0);
  };

  const positionElement = (item: string, index: number) => {
    const memberships = circles.filter((circle) => (circle.id === "A" ? setA : circle.id === "B" ? setB : setC).includes(item));
    if (!memberships.length) {
      return { x: vennUniverseBounds.x + 28 + (index % 9) * 48, y: vennUniverseBounds.y + vennUniverseBounds.height - 22 };
    }
    const center = memberships.reduce((acc, circle) => ({ x: acc.x + circle.cx, y: acc.y + circle.cy }), { x: 0, y: 0 });
    const jitterX = ((index % 3) - 1) * 18;
    const jitterY = ((Math.floor(index / 3) % 3) - 1) * 16;
    return {
      x: Math.min(vennUniverseBounds.x + vennUniverseBounds.width - 18, Math.max(vennUniverseBounds.x + 18, center.x / memberships.length + jitterX)),
      y: Math.min(vennUniverseBounds.y + vennUniverseBounds.height - 18, Math.max(vennUniverseBounds.y + 18, center.y / memberships.length + jitterY)),
    };
  };

  const circleOpacity = (id: VennSetId) => {
    if (operation === "union") return 0.42;
    if (operation === "intersection") return id === "C" ? 0.18 : 0.38;
    if (operation === "difference") return id === "A" ? 0.48 : 0.14;
    if (operation === "complement") return id === "A" ? 0.18 : 0.1;
    return id === "C" ? 0.16 : 0.38;
  };
  const pairOverlaps = [
    ["A", "B"] as const,
    ["A", "C"] as const,
    ["B", "C"] as const,
  ]
    .map(([leftId, rightId]) => ({ left: circles.find((circle) => circle.id === leftId), right: circles.find((circle) => circle.id === rightId), key: `${leftId}${rightId}` }))
    .filter((pair): pair is { left: VennSetCircle; right: VennSetCircle; key: "AB" | "AC" | "BC" } => Boolean(pair.left && pair.right && !areCirclesDisjoint(pair.left, pair.right)));
  const tripleCenter = {
    cx: circles.reduce((sum, circle) => sum + circle.cx, 0) / circles.length,
    cy: circles.reduce((sum, circle) => sum + circle.cy, 0) / circles.length,
  };
  const regionCount = (key: "AB" | "AC" | "BC" | "ABC") => {
    if (key === "AB") return regions.aAndB.length + regions.allThree.length;
    if (key === "AC") return regions.aAndC.length + regions.allThree.length;
    if (key === "BC") return regions.bAndC.length + regions.allThree.length;
    return regions.allThree.length;
  };
  const regionProbability = (count: number) => universe.length ? `${Math.round((count / universe.length) * 100)}%` : "0%";

  return (
    <SectionCard title="Venn Diagram Engine" description="Animate union, intersection, difference, complement, and symmetric difference.">
      <div className="flex flex-wrap gap-2">
        {operations.map((item) => <button key={item.id} type="button" onClick={() => setOperation(item.id)} className={`tool-button ${operation === item.id ? "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950" : ""}`}>{item.label}</button>)}
      </div>
      <svg viewBox="0 0 540 330" role="img" aria-label="Draggable three-set Venn diagram" className="mt-4 h-96 w-full rounded-2xl bg-slate-950" style={{ touchAction: "none" }}>
        <defs>
          <filter id="venn-drag-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#facc15" floodOpacity="0.9" />
          </filter>
          <filter id="venn-selected-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#67e8f9" floodOpacity="0.65" />
          </filter>
          <filter id="venn-union-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#facc15" floodOpacity="0.8" />
          </filter>
          {circles.map((circle) => (
            <clipPath key={circle.id} id={`venn-clip-${circle.id}`}>
              <circle cx={circle.cx} cy={circle.cy} r={circle.r} />
            </clipPath>
          ))}
          <pattern id="venn-stripes-ab" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="12" height="12" fill={vennOverlapStyle.AB.color} opacity="0.72" />
            <rect width="4" height="12" fill="#ffffff" opacity="0.28" />
          </pattern>
          <pattern id="venn-dots-ac" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill={vennOverlapStyle.AC.color} opacity="0.7" />
            <circle cx="4" cy="4" r="2" fill="#ffffff" opacity="0.35" />
            <circle cx="11" cy="11" r="2" fill="#ffffff" opacity="0.28" />
          </pattern>
          <pattern id="venn-grid-bc" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill={vennOverlapStyle.BC.color} opacity="0.68" />
            <path d="M 0 7 H 14 M 7 0 V 14" stroke="#ffffff" strokeWidth="1.4" opacity="0.3" />
          </pattern>
          <pattern id="venn-triple-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill={vennOverlapStyle.ABC.color} opacity="0.9" />
            <path d="M 0 0 L 16 16 M 16 0 L 0 16" stroke="#111827" strokeWidth="1.5" opacity="0.28" />
          </pattern>
        </defs>
        <rect x={vennUniverseBounds.x} y={vennUniverseBounds.y} width={vennUniverseBounds.width} height={vennUniverseBounds.height} rx="20" fill="#020617" stroke="#475569" strokeWidth="3" />
        <text x={vennUniverseBounds.x + 16} y={vennUniverseBounds.y + 26} fill="#cbd5e1" fontWeight="900" fontSize="14">U: {universeName}</text>
        {operation === "complement" && <rect x={vennUniverseBounds.x + 5} y={vennUniverseBounds.y + 5} width={vennUniverseBounds.width - 10} height={vennUniverseBounds.height - 10} rx="16" fill="#facc15" opacity="0.16" />}
        {operation === "union" && (
          <motion.g animate={{ opacity: playbackStep % 2 ? 0.95 : 0.6 }} transition={{ duration: 0.6 }}>
            {circles.filter((circle) => circle.id === "A" || circle.id === "B").map((circle) => (
              <circle key={`union-${circle.id}`} cx={circle.cx} cy={circle.cy} r={circle.r + 5} fill="none" stroke="#facc15" strokeWidth="7" strokeDasharray="16 10" filter="url(#venn-union-glow)" opacity="0.88" />
            ))}
          </motion.g>
        )}
        {pairOverlaps.map(({ left, right, key }) => (
          <circle
            key={key}
            role="img"
            tabIndex={0}
            aria-label={`${vennOverlapStyle[key].label}, count ${regionCount(key)}, probability ${regionProbability(regionCount(key))}`}
            cx={left.cx}
            cy={left.cy}
            r={left.r}
            clipPath={`url(#venn-clip-${right.id})`}
            fill={vennOverlapStyle[key].pattern}
            stroke={activeRegionKey === key || operation === "intersection" || operation === "union" ? "#f8fafc" : "none"}
            strokeWidth={activeRegionKey === key ? 7 : operation === "intersection" || operation === "union" ? 4 : 0}
            opacity={operation === "difference" || operation === "complement" ? 0.35 : 0.86}
            onMouseEnter={() => setActiveRegionKey(key)}
            onMouseLeave={() => setActiveRegionKey(null)}
            onFocus={() => setActiveRegionKey(key)}
            onBlur={() => setActiveRegionKey(null)}
          >
            <title>{vennOverlapStyle[key].label}: count {regionCount(key)}, probability {regionProbability(regionCount(key))}</title>
          </circle>
        ))}
        {relationship.hasTripleOverlap && (
          <circle
            role="img"
            tabIndex={0}
            aria-label={`${vennOverlapStyle.ABC.label}, count ${regionCount("ABC")}, probability ${regionProbability(regionCount("ABC"))}`}
            cx={tripleCenter.cx}
            cy={tripleCenter.cy}
            r="34"
            fill={vennOverlapStyle.ABC.pattern}
            stroke={activeRegionKey === "ABC" ? "#f8fafc" : "#fef08a"}
            strokeWidth={activeRegionKey === "ABC" ? 7 : 4}
            opacity="0.92"
            onMouseEnter={() => setActiveRegionKey("ABC")}
            onMouseLeave={() => setActiveRegionKey(null)}
            onFocus={() => setActiveRegionKey("ABC")}
            onBlur={() => setActiveRegionKey(null)}
          >
            <title>{vennOverlapStyle.ABC.label}: count {regionCount("ABC")}, probability {regionProbability(regionCount("ABC"))}</title>
          </circle>
        )}
        {circles.map((circle) => {
          const isDragging = activeDraggingId === circle.id;
          const isSelected = selectedSetId === circle.id;
          const offset = vennLabelOffsets[circle.id];
          const relationshipText = circles.filter((candidate) => candidate.id !== circle.id).map((candidate) => getCircleOverlapStatus(circle, candidate)).join(", ");
          const setName = setNameById(circle.id);
          return (
            <g
              key={circle.id}
              role="button"
              tabIndex={0}
              aria-label={`Drag set ${displaySetName(circle.id)}. ${relationshipText}`}
              onPointerDown={(event) => handlePointerDown(circle, event)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onKeyDown={(event) => handleCircleKeyDown(circle, event)}
              onFocus={() => setSelectedSetId(circle.id)}
              style={{ cursor: dragLocked ? "not-allowed" : isDragging ? "grabbing" : "grab", touchAction: "none" }}
            >
              <title>Drag this set</title>
              <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill={circle.color} opacity={circleOpacity(circle.id)} stroke={isSelected ? "#facc15" : circle.stroke} strokeWidth={isSelected ? 5 : 3} filter={isDragging ? "url(#venn-drag-glow)" : isSelected ? "url(#venn-selected-glow)" : undefined} />
              <circle cx={circle.cx + circle.r - 16} cy={circle.cy - circle.r + 16} r="8" fill="#f8fafc" stroke={circle.stroke} strokeWidth="3" />
              <text x={circle.cx + offset.x} y={circle.cy + offset.y} textAnchor="middle" fill="white" fontWeight="900" fontSize="18">{setName.shortLabel || circle.label}</text>
              <text x={circle.cx + offset.x} y={circle.cy + offset.y + 16} textAnchor="middle" fill="#cbd5e1" fontWeight="800" fontSize="10">{setName.displayName}</text>
            </g>
          );
        })}
        {universe.map((item, index) => {
          const point = positionElement(item, index);
          return <g key={item}><circle cx={point.x} cy={point.y} r={result.includes(item) && playbackStep % 2 ? 16 : 13} fill={result.includes(item) ? "#facc15" : "#334155"} stroke="#94a3b8" /><text x={point.x} y={point.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">{item}</text></g>;
        })}
        <text x={vennUniverseBounds.x + 16} y={vennUniverseBounds.y + vennUniverseBounds.height - 12} fill="#f8fafc" fontSize="12" fontWeight="800">
          Outside U regions: {outsideUniverse.length ? outsideUniverse.join(", ") : "∅"}
        </text>
      </svg>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-black">Live relationship</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-black">
            <span className="mini-chip">{relationship.primaryStatus}</span>
            <span className="mini-chip">Disjoint: {relationship.disjointPairs.join(", ") || "none"}</span>
            <span className="mini-chip">Subset: {relationship.subsetPairs.join(", ") || "none"}</span>
            <span className="mini-chip">Overlap: {relationship.overlappingPairs.join(", ") || "none"}</span>
            <span className="mini-chip">Universal outside: {outsideUniverse.length ? outsideUniverse.join(", ") : "∅"}</span>
          </div>
          <div className="mt-3 grid gap-2 font-mono text-sm">
            {relationship.formulas.map((formula) => <div key={formula} className="rounded-xl bg-slate-950 px-3 py-2 font-black text-cyan-100">{formula}</div>)}
          </div>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            {circles.map((circle) => (
              <div key={circle.id} className="flex items-center gap-2 rounded-xl bg-slate-100 p-2 dark:bg-white/10">
                <span className="h-5 w-5 rounded-full border-2" style={{ backgroundColor: circle.color, borderColor: circle.stroke }} />
                <span className="font-black">{displaySetName(circle.id)}</span>
              </div>
            ))}
            {pairOverlaps.map(({ key }) => (
              <div key={key} className="flex items-center gap-2 rounded-xl bg-slate-100 p-2 dark:bg-white/10">
                <span className="h-5 w-5 rounded-full border border-slate-400" style={{ background: vennOverlapStyle[key].color }} />
                <span className="font-black">{vennOverlapStyle[key].label} overlap region</span>
              </div>
            ))}
            {relationship.hasTripleOverlap && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-100 p-2 text-amber-900 dark:bg-amber-300/20 dark:text-amber-100">
                <span className="h-5 w-5 rounded-full border border-amber-700" style={{ background: vennOverlapStyle.ABC.color }} />
                <span className="font-black">{vennOverlapStyle.ABC.label} triple region</span>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-black">Drag controls</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["disjoint", "overlap", "subset", "equal", "triple-overlap"] as VennPresetName[]).map((preset) => (
              <button key={preset} type="button" className="tool-button text-xs" onClick={() => applyPreset(preset)}>{preset.replace("-", " ")}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="tool-button" type="button" onClick={() => setPlaybackStep(playbackStep + 1)}><Play className="h-4 w-4" /> Pulse result</button>
            <button className="tool-button" type="button" onClick={() => applyPreset("overlap")}><Pause className="h-4 w-4" /> Reset layout</button>
            <label className="tool-button cursor-pointer"><input type="checkbox" className="accent-cyan-500" checked={!dragLocked} onChange={() => setDragLocked((value) => !value)} /> Dragging</label>
            <label className="tool-button cursor-pointer"><input type="checkbox" className="accent-cyan-500" checked={boundaryLock} onChange={() => setBoundaryLock((value) => !value)} /> Boundary lock</label>
          </div>
          <div className="mt-3 rounded-xl bg-slate-100 p-2 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
            Selected set {selectedSetId}. Use arrow keys to nudge it, or Shift + arrow for a larger move.
          </div>
          <div className="mt-3 grid gap-2">
            <label className="text-xs font-black">Universal set name</label>
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" value={universeName} onChange={(event) => setUniverseName(event.target.value)} />
            {setNames.map((setName) => (
              <div key={setName.id} className="grid gap-2 rounded-xl bg-slate-100 p-2 dark:bg-white/10">
                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: vennCircleStyle[setName.id].color }} />
                  Set {setName.id} name
                </div>
                <div className="grid gap-2 sm:grid-cols-[72px_1fr]">
                  <input aria-label={`Short label for set ${setName.id}`} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-black dark:border-white/10 dark:bg-slate-950" value={setName.shortLabel} maxLength={4} onChange={(event) => updateSetName(setName.id, "shortLabel", event.target.value)} />
                  <input aria-label={`Display name for set ${setName.id}`} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-white/10 dark:bg-slate-950" value={setName.displayName} onChange={(event) => updateSetName(setName.id, "displayName", event.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="text-sm font-black">3-set region map</div>
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
          {Object.entries(regions).map(([name, values]) => (
            <div key={name} className="rounded-xl bg-slate-100 p-2 font-mono dark:bg-white/10">
              <span className="font-black">{name}</span>: {"{"}{values.join(", ") || "\u2205"}{"}"}
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function RelationStudio({ domain, pairs, matrix, properties, onPairs }: { domain: string[]; pairs: OrderedPair[]; matrix: boolean[][]; properties: ReturnType<typeof relationProperties>; onPairs: (pairs: OrderedPair[]) => void }) {
  const [draft, setDraft] = useState(pairs.map((pair) => `(${pair[0]}, ${pair[1]})`).join("; "));
  const layout = useMemo(() => d3RelationLayout(domain, pairs), [domain, pairs]);
  const nodes: Node[] = layout.map((node, index) => ({ id: node.id, data: { label: node.id }, position: { x: node.x || circular(index, domain.length, 180, 135, 90).x, y: node.y || circular(index, domain.length, 180, 135, 90).y }, className: "rounded-full border border-cyan-300 bg-slate-950 px-3 py-2 text-white" }));
  const edges: Edge[] = pairs.map(([source, target], index) => ({ id: `${source}-${target}-${index}`, source, target, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }));
  return (
    <SectionCard title="Relation Visualization" description="Ordered pairs are shown as matrix entries and a directed React Flow graph.">
      <textarea className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-950" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => onPairs(parsePairs(draft))} />
      <div className="mt-3 grid gap-3 lg:grid-cols-[.85fr_1.15fr]">
        <MatrixTable domain={domain} matrix={matrix} />
        <div className="h-72 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10"><ReactFlow nodes={nodes} edges={edges} fitView><Background /><Controls /></ReactFlow></div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(properties).map(([key, value]) => <div key={key} className={`rounded-xl p-3 text-sm font-black ${value ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>{key}: {value ? "yes" : "no"}</div>)}
      </div>
    </SectionCard>
  );
}

function OrderingVisualizer({ domain, pairs }: { domain: string[]; pairs: OrderedPair[] }) {
  const covers = coverRelations(domain, pairs);
  const levels = hasseLevels(domain, pairs);
  const properties = relationProperties(domain, pairs);
  const width = 520;
  const height = 300;
  const positioned = levels.map((node) => {
    const same = levels.filter((item) => item.level === node.level);
    const index = same.findIndex((item) => item.id === node.id);
    return { ...node, x: ((index + 1) * width) / (same.length + 1), y: height - 40 - node.level * 75 };
  });
  return (
    <SectionCard title="Ordering Visualizer" description="Covers form the Hasse diagram when the relation is a partial order.">
      <div className="mb-3 grid gap-2 text-xs font-black sm:grid-cols-3">
        <div className={properties.reflexive ? "rounded-xl bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100" : "rounded-xl bg-rose-100 p-3 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100"}>Reflexive: {properties.reflexive ? "yes" : "no"}</div>
        <div className={properties.antisymmetric ? "rounded-xl bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100" : "rounded-xl bg-rose-100 p-3 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100"}>Antisymmetric: {properties.antisymmetric ? "yes" : "no"}</div>
        <div className={properties.transitive ? "rounded-xl bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100" : "rounded-xl bg-rose-100 p-3 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100"}>Transitive: {properties.transitive ? "yes" : "no"}</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full rounded-2xl bg-slate-950">
        {covers.map(([a, b]) => {
          const start = positioned.find((node) => node.id === a);
          const end = positioned.find((node) => node.id === b);
          if (!start || !end) return null;
          return <line key={`${a}-${b}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#67e8f9" strokeWidth="3" />;
        })}
        {positioned.map((node) => <g key={node.id}><circle cx={node.x} cy={node.y} r="22" fill="#0f172a" stroke="#a78bfa" strokeWidth="3" /><text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontWeight="900">{node.id}</text></g>)}
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
          Partial order: <span className="font-black">{properties.partialOrder ? "yes" : "not yet"}</span>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Needs reflexive, antisymmetric, and transitive.</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
          Cover pairs: <span className="font-mono font-black">{covers.map(([a, b]) => `${a}<${b}`).join(", ") || "none"}</span>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{covers.length >= Math.max(0, domain.length - 1) ? "Candidate cover structure visible." : "Add comparable pairs to inspect joins and meets."}</div>
        </div>
      </div>
    </SectionCard>
  );
}

function FunctionMappingStudio({ domain, codomain, pairs, onPairs }: { domain: string[]; codomain: string[]; pairs: OrderedPair[]; onPairs: (pairs: OrderedPair[]) => void }) {
  const [draft, setDraft] = useState(pairs.map((pair) => `(${pair[0]}, ${pair[1]})`).join("; "));
  const props = functionProperties(domain, codomain, pairs);
  return (
    <SectionCard title="Function Mapping Studio" description="Arrow diagrams, graph plotting, and injective/surjective/bijective checks.">
      <textarea className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-950" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => onPairs(parsePairs(draft))} />
      <svg viewBox="0 0 560 280" className="mt-3 h-72 w-full rounded-2xl bg-slate-950">
        {domain.map((item, index) => <MapNode key={item} x={100} y={55 + index * 42} label={item} color="#22d3ee" />)}
        {codomain.map((item, index) => <MapNode key={item} x={455} y={55 + index * 42} label={item} color="#a78bfa" />)}
        {pairs.map(([a, b], index) => {
          const y1 = 55 + Math.max(0, domain.indexOf(a)) * 42;
          const y2 = 55 + Math.max(0, codomain.indexOf(b)) * 42;
          return <motion.path key={`${a}-${b}-${index}`} d={`M 122 ${y1} C 245 ${y1}, 315 ${y2}, 433 ${y2}`} stroke="#facc15" strokeWidth="3" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />;
        })}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{Object.entries(props).map(([key, value]) => <div key={key} className={`rounded-xl p-3 text-sm font-black ${value ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-100"}`}>{key}: {value ? "yes" : "no"}</div>)}</div>
    </SectionCard>
  );
}

function DiscreteRepresentations({ domain, setA, setB, pairs, classes }: { domain: string[]; setA: string[]; setB: string[]; pairs: OrderedPair[]; classes: string[][] }) {
  const product = cartesianProduct(setA, setB);
  const power = powerSet(setA);
  const incidence = incidenceMatrix(domain, pairs);
  return (
    <div id="representations" className="scroll-mt-24">
      <SectionCard title="Discrete Structure Representation" description="Cartesian products, power sets, relation tables, adjacency matrix, and equivalence classes.">
        <div className="grid gap-3 md:grid-cols-2">
          <InfoBlock icon={<Table2 className="h-4 w-4" />} title={`Cartesian Product A x B (${product.length})`} text={product.map(([a, b]) => `(${a},${b})`).join(", ")} />
          <InfoBlock icon={<Binary className="h-4 w-4" />} title={`Power Set of A (${power.length})`} text={power.map((item) => `{${item.join(",") || "empty"}}`).join(", ")} />
          <InfoBlock icon={<Network className="h-4 w-4" />} title={`Relation Table (${pairs.length})`} text={pairs.map(([a, b]) => `${a}R${b}`).join(", ")} />
          <InfoBlock icon={<GitFork className="h-4 w-4" />} title={`Equivalence Classes (${classes.length})`} text={classes.map((item) => `{${item.join(",")}}`).join(" | ")} />
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-black">Cartesian product table</div>
            <div className="mt-3 mobile-safe-scroll">
              <table className="min-w-full text-center text-xs">
                <thead><tr><th className="px-2 py-1 text-left">A \\ B</th>{setB.map((b) => <th key={b} className="px-2 py-1">{b}</th>)}</tr></thead>
                <tbody>
                  {setA.map((a) => (
                    <tr key={a}>
                      <th className="px-2 py-1 text-left">{a}</th>
                      {setB.map((b) => <td key={`${a}-${b}`} className="border border-slate-200 px-2 py-1 font-mono dark:border-white/10">({a},{b})</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-black">Power set explorer</div>
              <span className="mini-chip">2^{setA.length} = {power.length}</span>
            </div>
            <div className="mt-3 grid max-h-56 gap-2 overflow-auto text-xs sm:grid-cols-2">
              {power.map((subset, index) => (
                <div key={`${subset.join("-")}-${index}`} className="rounded-xl bg-slate-100 p-2 font-mono font-black dark:bg-white/10">
                  P{index}: {"{"}{subset.join(", ") || "empty"}{"}"}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 mobile-safe-scroll">
          <table className="min-w-full text-center text-xs">
            <thead>
              <tr><th className="px-2 py-1 text-left">Incidence</th>{pairs.map((pair, index) => <th key={`${pair[0]}-${pair[1]}-${index}`} className="px-2 py-1">e{index + 1}</th>)}</tr>
            </thead>
            <tbody>
              {incidence.map((row, rowIndex) => (
                <tr key={domain[rowIndex]}>
                  <th className="px-2 py-1 text-left">{domain[rowIndex]}</th>
                  {row.map((value, columnIndex) => <td key={columnIndex} className="border border-slate-200 px-2 py-1 dark:border-white/10">{value}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">Incidence summary: {domain.length} vertices, {pairs.length} directed relation edges.</div>
      </SectionCard>
    </div>
  );
}

function ChallengePanel({ challenge, onRandom }: { challenge: ReturnType<typeof randomProblem>; onRandom: () => void }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <SectionCard title="Interactive Challenges and AI Hint Engine" description="Random problem generation with local rule-based hints.">
      <div className="flex flex-wrap items-center gap-2">
        <button className="action-primary" type="button" onClick={() => { setRevealed(false); onRandom(); }}><Dices className="h-4 w-4" /> Random problem</button>
        <button className="tool-button" type="button" onClick={() => setRevealed(true)}><BrainCircuit className="h-4 w-4" /> Hint</button>
      </div>
      <div className="mt-3 rounded-xl bg-slate-100 p-4 font-mono text-sm dark:bg-white/10">Given A = {"{"}{challenge.a.join(", ")}{"}"} and B = {"{"}{challenge.b.join(", ")}{"}"}, compute {challenge.operation}.</div>
      {revealed && <div className="mt-3 rounded-xl bg-cyan-100 p-3 text-sm font-semibold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100"><Check className="mr-2 inline h-4 w-4" />Think element by element. Answer: {"{"}{challenge.answer.join(", ")}{"}"}</div>}
    </SectionCard>
  );
}

function MatrixTable({ domain, matrix }: { domain: string[]; matrix: boolean[][] }) {
  return (
    <div className="mobile-safe-scroll">
      <table className="min-w-full text-center text-sm"><thead><tr><th /><th colSpan={domain.length} className="px-2 py-1">Columns</th></tr><tr><th />{domain.map((item) => <th key={item} className="px-2 py-1">{item}</th>)}</tr></thead><tbody>{matrix.map((row, rowIndex) => <tr key={domain[rowIndex]}><th className="px-2 py-1">{domain[rowIndex]}</th>{row.map((value, columnIndex) => <td key={domain[columnIndex]} className={`border border-slate-200 px-2 py-1 dark:border-white/10 ${value ? "bg-cyan-100 font-black text-cyan-700 dark:bg-cyan-400/20 dark:text-cyan-100" : ""}`}>{value ? 1 : 0}</td>)}</tr>)}</tbody></table>
    </div>
  );
}

function MapNode({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return <g><circle cx={x} cy={y} r="20" fill={color} /><text x={x} y={y + 5} textAnchor="middle" fill="#0f172a" fontWeight="900">{label}</text></g>;
}

function InfoBlock({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5"><div className="mb-2 flex items-center gap-2 text-sm font-black">{icon}{title}</div><div className="max-h-28 overflow-auto text-xs leading-5 text-slate-600 dark:text-slate-300">{text || "Empty"}</div></div>;
}

function circular(index: number, total: number, cx: number, cy: number, radius: number) {
  const angle = (index / Math.max(1, total)) * Math.PI * 2 - Math.PI / 2;
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

export function d3RelationLayout(domain: string[], pairs: OrderedPair[]) {
  const nodes = domain.map((id) => ({ id, x: 0, y: 0 }));
  const links = pairs.map(([source, target]) => ({ source, target }));
  forceSimulation(nodes)
    .force("link", forceLink(links).id((node) => (node as { id: string }).id).distance(90))
    .force("charge", forceManyBody().strength(-220))
    .force("center", forceCenter(240, 150))
    .tick(80)
    .stop();
  return nodes;
}
