import "reactflow/dist/style.css";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { motion } from "framer-motion";
import { Binary, BrainCircuit, Check, Dices, GitFork, Network, Pause, Play, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
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

      <ImplementationAudit />

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <SetBuilder {...store} result={result} />
        <VennEngine {...store} result={result} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <RelationStudio domain={store.universe} pairs={store.relationPairs} matrix={matrix} properties={relationProps} onPairs={store.setRelationPairs} />
        <OrderingVisualizer domain={store.universe} pairs={store.relationPairs} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <FunctionMappingStudio domain={store.setA} codomain={store.setB} pairs={store.functionPairs} onPairs={store.setFunctionPairs} />
        <DiscreteRepresentations domain={store.universe} setA={store.setA} setB={store.setB} pairs={store.relationPairs} classes={classes} />
      </div>

      <ChallengePanel challenge={challenge} onRandom={store.randomizeChallenge} />
    </div>
  );
}

function ImplementationAudit() {
  const rows = [
    ["Basic Set Theory", "Partially implemented", "Syllabus had Sets entries; no canonical module. Added module overview and notation workflow."],
    ["Set Representation", "Missing", "Added dynamic roster inputs, generated roster notation, Cartesian products, and power sets."],
    ["Venn Diagrams", "Already implemented, enhanced", "Existing two-set syllabus lab existed; added canonical 2-set operation animation and 3-set region map."],
    ["Relations", "Partially implemented", "Existing relation matrix lab existed; added ordered pairs, graph, matrix, table, and property checker."],
    ["Ordering Relations", "Missing", "Added partial-order detection, Hasse diagram, and lattice preview."],
    ["Functions", "Partially implemented", "Existing mapping arrows lab existed; added function studio and injective/surjective/bijective checks."],
    ["Cartesian Products", "Missing", "Added product table generation."],
    ["Power Sets", "Missing", "Added power-set generator capped for interactive rendering."],
    ["Equivalence Relations", "Partially implemented", "Existing equivalence partition simulator existed; added relation-derived classes."],
    ["Partial Orders", "Missing", "Added relation property detection and Hasse covers."],
  ];
  return (
    <SectionCard title="Implementation Audit" description="Existing project scan before this module was created.">
      <div className="mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left dark:bg-white/10"><tr><th className="px-3 py-2">Topic</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Action</th></tr></thead>
          <tbody>{rows.map(([topic, status, action]) => <tr key={topic} className="border-t border-slate-200 dark:border-white/10"><td className="px-3 py-2 font-semibold">{topic}</td><td className="px-3 py-2"><span className="mini-chip">{status}</span></td><td className="px-3 py-2 text-slate-600 dark:text-slate-300">{action}</td></tr>)}</tbody>
        </table>
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
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5" onDragOver={(event) => event.preventDefault()} onDrop={(event) => onChange([...values, event.dataTransfer.getData("text/plain")])}>
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
  return (
    <SectionCard title="Venn Diagram Engine" description="Animate union, intersection, difference, complement, and symmetric difference.">
      <div className="flex flex-wrap gap-2">
        {operations.map((item) => <button key={item.id} type="button" onClick={() => setOperation(item.id)} className={`tool-button ${operation === item.id ? "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950" : ""}`}>{item.label}</button>)}
      </div>
      <svg viewBox="0 0 540 310" className="mt-4 h-80 w-full rounded-2xl bg-slate-950">
        <circle cx="220" cy="145" r="96" fill="#22d3ee" opacity={operation === "union" || operation === "difference" || operation === "symmetric-difference" ? 0.45 : 0.2} stroke="#67e8f9" strokeWidth="3" />
        <circle cx="320" cy="145" r="96" fill="#a78bfa" opacity={operation === "union" || operation === "symmetric-difference" ? 0.45 : 0.2} stroke="#c4b5fd" strokeWidth="3" />
        <motion.ellipse cx="270" cy="145" rx="47" ry="84" fill="#34d399" opacity={operation === "intersection" || operation === "union" ? 0.7 : 0.08} animate={{ scale: playbackStep % 2 ? 1.08 : 1 }} />
        <text x="185" y="60" fill="white" fontWeight="900">A</text>
        <text x="350" y="60" fill="white" fontWeight="900">B</text>
        {universe.map((item, index) => {
          const inA = setA.includes(item);
          const inB = setB.includes(item);
          const x = inA && inB ? 260 + (index % 2) * 22 : inA ? 165 + (index % 2) * 30 : inB ? 345 + (index % 2) * 28 : 60 + index * 34;
          const y = inA || inB ? 120 + Math.floor(index / 2) * 26 : 270;
          return <g key={item}><circle cx={x} cy={y} r="13" fill={result.includes(item) ? "#facc15" : "#334155"} /><text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">{item}</text></g>;
        })}
      </svg>
      <div className="mt-3 flex gap-2">
        <button className="tool-button" type="button" onClick={() => setPlaybackStep(playbackStep + 1)}><Play className="h-4 w-4" /> Step</button>
        <button className="tool-button" type="button" onClick={() => setPlaybackStep(0)}><Pause className="h-4 w-4" /> Reset</button>
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
  const width = 520;
  const height = 300;
  const positioned = levels.map((node) => {
    const same = levels.filter((item) => item.level === node.level);
    const index = same.findIndex((item) => item.id === node.id);
    return { ...node, x: ((index + 1) * width) / (same.length + 1), y: height - 40 - node.level * 75 };
  });
  return (
    <SectionCard title="Ordering Visualizer" description="Covers form the Hasse diagram when the relation is a partial order.">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full rounded-2xl bg-slate-950">
        {covers.map(([a, b]) => {
          const start = positioned.find((node) => node.id === a);
          const end = positioned.find((node) => node.id === b);
          if (!start || !end) return null;
          return <line key={`${a}-${b}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#67e8f9" strokeWidth="3" />;
        })}
        {positioned.map((node) => <g key={node.id}><circle cx={node.x} cy={node.y} r="22" fill="#0f172a" stroke="#a78bfa" strokeWidth="3" /><text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontWeight="900">{node.id}</text></g>)}
      </svg>
      <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">Lattice preview: {covers.length >= Math.max(0, domain.length - 1) ? "candidate cover structure visible" : "add comparable pairs to inspect joins and meets"}.</div>
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
    <SectionCard title="Discrete Structure Representation" description="Cartesian products, power sets, relation tables, adjacency matrix, and incidence data.">
      <div className="grid gap-3 md:grid-cols-2">
        <InfoBlock icon={<Table2 className="h-4 w-4" />} title="Cartesian Product" text={product.map(([a, b]) => `(${a},${b})`).join(", ")} />
        <InfoBlock icon={<Binary className="h-4 w-4" />} title="Power Set of A" text={power.map((item) => `{${item.join(",")}}`).join(", ")} />
        <InfoBlock icon={<Network className="h-4 w-4" />} title="Relation Table" text={pairs.map(([a, b]) => `${a}R${b}`).join(", ")} />
        <InfoBlock icon={<GitFork className="h-4 w-4" />} title="Equivalence Classes" text={classes.map((item) => `{${item.join(",")}}`).join(" | ")} />
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
