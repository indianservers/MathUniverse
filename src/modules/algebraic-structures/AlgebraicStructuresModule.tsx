import "reactflow/dist/style.css";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { motion } from "framer-motion";
import { BookOpen, Check, Dices, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import {
  booleanLawSteps,
  coverRelations,
  gateOutput,
  meetJoin,
  operationAnimation,
  simplifyBooleanExpression,
  validateOperation,
  type OperationTable,
} from "./algebraicStructuresEngine";
import { useAlgebraicStructuresStore, type AlgebraicStructuresState } from "./algebraicStructuresStore";

const posetElements = ["1", "2", "3", "6", "12"];
const divisibilityPairs: Array<[string, string]> = [
  ["1", "2"], ["1", "3"], ["1", "6"], ["1", "12"], ["2", "6"], ["2", "12"], ["3", "6"], ["3", "12"], ["6", "12"],
];

export default function AlgebraicStructuresModule() {
  const store = useAlgebraicStructuresStore();
  const validation = useMemo(() => validateOperation(store.elements, store.table), [store.elements, store.table]);
  const animation = useMemo(() => operationAnimation(store.elements, store.table, store.selectedA, store.selectedB), [store.elements, store.table, store.selectedA, store.selectedB]);
  const simplified = useMemo(() => {
    try {
      return { value: simplifyBooleanExpression(store.booleanExpression), error: "" };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : "Invalid Boolean expression." };
    }
  }, [store.booleanExpression]);
  const lawSteps = booleanLawSteps(store.law);

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Algebraic Structures"
        subtitle="Validate operations, explore semigroups and monoids, inspect posets and lattices, and simplify Boolean algebra."
        difficulty="Abstract Algebra Lab"
        estimatedMinutes={70}
        formula={{ title: "Structure test", formula: String.raw`(S, *) \text{ is a monoid when } * \text{ is closed, associative, and has an identity.}`, explanation: "The module connects Cayley tables, partial orders, lattices, Boolean laws, and logic circuits." }}
      />

      <div className="flex flex-wrap gap-2">
        <button type="button" className="tool-button" onClick={() => store.setMode(store.mode === "educational" ? "quiz" : "educational")}><BookOpen className="h-4 w-4" /> {store.mode === "educational" ? "Educational mode" : "Quiz mode"}</button>
        <button type="button" className="tool-button" onClick={() => store.useModularTable(4, "add")}><Table2 className="h-4 w-4" /> Z4 addition</button>
        <button type="button" className="tool-button" onClick={() => store.useModularTable(5, "multiply")}><Dices className="h-4 w-4" /> Z5 multiply</button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <BinaryOperationPlayground {...store} validation={validation} animation={animation} />
        <SemigroupMonoidSimulator elements={store.elements} table={store.table} validation={validation} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <PosetVisualizer />
        <LatticeExplorer />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <BooleanAlgebraStudio expression={store.booleanExpression} simplified={simplified} onExpression={store.setBooleanExpression} />
        <LogicGateSandbox gate={store.gate} inputA={store.inputA} inputB={store.inputB} onGate={store.setGate} onA={store.setInputA} onB={store.setInputB} />
      </div>

      <BooleanLawVisualizer law={store.law} steps={lawSteps} onLaw={store.setLaw} mode={store.mode} />
    </div>
  );
}

function BinaryOperationPlayground({ elements, table, selectedA, selectedB, validation, animation, setSelected, setTable, setElements }: AlgebraicStructuresState & { validation: ReturnType<typeof validateOperation>; animation: Array<{ label: string; value: string }> }) {
  const [elementDraft, setElementDraft] = useState(elements.join(", "));
  const updateCell = (row: string, column: string, value: string) => setTable({ ...table, [row]: { ...table[row], [column]: value } });
  return (
    <SectionCard title="Binary Operation Playground" description="Edit a custom operation table and watch closure, associativity, and identity checks update.">
      <label className="mb-3 block text-sm font-black">
        Carrier set
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950"
          value={elementDraft}
          onChange={(event) => setElementDraft(event.target.value)}
          onBlur={() => setElements(elementDraft.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean))}
        />
      </label>
      <OperationTableEditor elements={elements} table={table} selectedA={selectedA} selectedB={selectedB} onSelect={setSelected} onCell={updateCell} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {animation.map((step) => <motion.div key={step.label} initial={{ opacity: 0.4, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10"><span className="font-black">{step.label}</span><div className="font-mono text-lg">{step.value}</div></motion.div>)}
      </div>
      <ValidationBadges validation={validation} />
    </SectionCard>
  );
}

function OperationTableEditor({ elements, table, selectedA, selectedB, onSelect, onCell }: { elements: string[]; table: OperationTable; selectedA: string; selectedB: string; onSelect: (a: string, b: string) => void; onCell: (row: string, column: string, value: string) => void }) {
  return (
    <div className="mobile-safe-scroll">
      <table className="min-w-full text-center text-sm">
        <thead><tr><th className="px-2 py-2">*</th>{elements.map((column) => <th key={column} className="px-2 py-2">{column}</th>)}</tr></thead>
        <tbody>{elements.map((row) => <tr key={row}><th className="px-2 py-2">{row}</th>{elements.map((column) => <td key={column} className={`border border-slate-200 p-1 dark:border-white/10 ${row === selectedA && column === selectedB ? "bg-cyan-100 dark:bg-cyan-400/20" : ""}`}><input className="w-14 rounded-lg bg-transparent p-1 text-center font-mono font-black" value={table[row]?.[column] ?? ""} onFocus={() => onSelect(row, column)} onChange={(event) => onCell(row, column, event.target.value)} /></td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function SemigroupMonoidSimulator({ elements, validation }: { elements: string[]; table: OperationTable; validation: ReturnType<typeof validateOperation> }) {
  return (
    <SectionCard title="Semigroup and Monoid Simulator" description="The Cayley table is classified as a magma, semigroup, or monoid by the rule engine.">
      <div className="visual-stage p-4">
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Metric label="Closure" value={validation.closed ? "pass" : "fail"} />
          <Metric label="Associative" value={validation.associative ? "pass" : "fail"} />
          <Metric label="Identity" value={validation.identity ?? "none"} />
          <Metric label="Structure" value={validation.monoid ? "monoid" : validation.semigroup ? "semigroup" : "magma"} />
        </div>
        <svg viewBox="0 0 520 170" className="mt-4 h-44 w-full">
          <defs>
            <linearGradient id="algebra-node-fill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          {elements.map((item, index) => {
            const x = 70 + index * (380 / Math.max(1, elements.length - 1));
            return <g key={item}><circle cx={x} cy="80" r="24" fill={item === validation.identity ? "#34d399" : "url(#algebra-node-fill)"} stroke="#ffffff" strokeWidth="4" /><text x={x} y="86" textAnchor="middle" fill="#0f172a" fontWeight="900">{item}</text></g>;
          })}
          <text x="260" y="145" textAnchor="middle" fill="#334155" fontWeight="800">{validation.failures[0] ?? "All visible structure checks pass for the current table."}</text>
        </svg>
      </div>
      <ValidationBadges validation={validation} />
    </SectionCard>
  );
}

function PosetVisualizer() {
  const covers = useMemo(() => coverRelations(posetElements, divisibilityPairs), []);
  const nodes = useMemo<Node[]>(() => layoutNodes(posetElements, covers).map((node) => ({
    id: node.id,
    data: { label: node.id },
    position: { x: node.x, y: node.y },
    className: "algebra-flow-node",
  })), [covers]);
  const edges = useMemo<Edge[]>(() => covers.map(([source, target]) => ({
    id: `${source}-${target}`,
    source,
    target,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0ea5e9" },
    style: { stroke: "#0ea5e9", strokeWidth: 2.5 },
  })), [covers]);
  return (
    <SectionCard title="Poset Visualizer" description="Hasse cover graph with physics-based layout and interactive node movement.">
      <div className="visual-stage h-80 overflow-hidden">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#38bdf8" gap={22} size={1.3} />
          <Controls />
        </ReactFlow>
      </div>
    </SectionCard>
  );
}

function LatticeExplorer() {
  const [pair, setPair] = useState<[string, string]>(["2", "3"]);
  const result = meetJoin(posetElements, divisibilityPairs, pair[0], pair[1]);
  const covers = coverRelations(posetElements, divisibilityPairs);
  const positions = new Map(posetElements.map((item, index) => [item, {
    x: 80 + index * 90,
    y: item === "1" ? 205 : item === "12" ? 45 : item === "6" ? 95 : 150,
  }]));
  return (
    <SectionCard title="Lattice Explorer" description="Compute meet and join for the divisibility poset.">
      <div className="flex flex-wrap gap-2">{posetElements.map((item) => <button key={item} type="button" className={`tool-button ${pair.includes(item) ? "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950" : ""}`} onClick={() => setPair([pair[1], item])}>{item}</button>)}</div>
      <svg viewBox="0 0 520 250" className="visual-stage mt-4 h-64 w-full">
        <defs>
          <linearGradient id="lattice-node-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
        </defs>
        {covers.map(([source, target]) => {
          const start = positions.get(source);
          const end = positions.get(target);
          if (!start || !end) return null;
          return <line key={`${source}-${target}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.7" />;
        })}
        {posetElements.map((item, index) => {
          const x = positions.get(item)?.x ?? 80 + index * 90;
          const y = positions.get(item)?.y ?? 150;
          const active = item === result.meet || item === result.join || pair.includes(item);
          return <g key={item}><circle cx={x} cy={y} r="26" fill={active ? "#facc15" : "url(#lattice-node-fill)"} stroke="#ffffff" strokeWidth="4" /><text x={x} y={y + 5} textAnchor="middle" fill="#0f172a" fontWeight="900">{item}</text></g>;
        })}
      </svg>
      <div className="grid gap-2 sm:grid-cols-2"><Metric label="Meet" value={result.meet ?? "none"} /><Metric label="Join" value={result.join ?? "none"} /></div>
    </SectionCard>
  );
}

function BooleanAlgebraStudio({ expression, simplified, onExpression }: { expression: string; simplified: { value: ReturnType<typeof simplifyBooleanExpression> | null; error: string }; onExpression: (value: string) => void }) {
  return (
    <SectionCard title="Boolean Algebra Studio" description="Parse, simplify, and inspect K-map cells for up to four variables.">
      <input className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={expression} onChange={(event) => onExpression(event.target.value)} />
      {simplified.error || !simplified.value ? <div className="mt-3 rounded-xl bg-rose-100 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">{simplified.error}</div> : (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 font-mono text-sm dark:bg-white/10">Simplified SOP: {simplified.value.simplified}</div>
          <div className="grid w-fit gap-1">{simplified.value.kmap.map((row, rowIndex) => <div key={rowIndex} className="flex gap-1">{row.map((cell, colIndex) => <div key={`${rowIndex}-${colIndex}`} className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-black ${cell ? "bg-emerald-400 text-slate-950" : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>{cell ? 1 : 0}</div>)}</div>)}</div>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="mb-2 text-sm font-black">Generated circuit layers</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {simplified.value.circuit.map((layer, index) => (
                <div key={index} className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
                  <div className="mb-1 text-xs font-black uppercase text-slate-500">Layer {index + 1}</div>
                  <div className="flex flex-wrap gap-1">{layer.map((node) => <span key={node.id} className="mini-chip">{node.label}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function LogicGateSandbox({ gate, inputA, inputB, onGate, onA, onB }: { gate: "AND" | "OR" | "NOT" | "XOR"; inputA: boolean; inputB: boolean; onGate: (gate: "AND" | "OR" | "NOT" | "XOR") => void; onA: (value: boolean) => void; onB: (value: boolean) => void }) {
  const output = gateOutput(gate, inputA, inputB);
  return (
    <SectionCard title="Logic Gate Sandbox" description="Toggle inputs and watch wire animations update the output.">
      <div className="flex flex-wrap gap-2">{(["AND", "OR", "NOT", "XOR"] as const).map((item) => <button key={item} type="button" className={`tool-button ${gate === item ? "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950" : ""}`} onClick={() => onGate(item)}>{item}</button>)}</div>
      <svg viewBox="0 0 520 240" className="visual-stage mt-4 h-64 w-full">
        <GateInput x={70} y={75} label="A" value={inputA} onClick={() => onA(!inputA)} />
        <GateInput x={70} y={155} label="B" value={inputB} onClick={() => onB(!inputB)} />
        <motion.path d="M 95 75 C 170 75, 190 115, 250 115" stroke="#22d3ee" strokeWidth="5" fill="none" animate={{ pathLength: [0.2, 1] }} />
        <motion.path d="M 95 155 C 170 155, 190 125, 250 125" stroke="#a78bfa" strokeWidth="5" fill="none" animate={{ pathLength: [0.2, 1] }} />
        <rect x="250" y="82" width="115" height="78" rx="18" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="4" />
        <text x="307" y="127" textAnchor="middle" fill="#0f172a" fontWeight="900">{gate}</text>
        <motion.path d="M 365 121 C 410 121, 420 121, 450 121" stroke="#facc15" strokeWidth="5" fill="none" animate={{ pathLength: [0.2, 1] }} />
        <circle cx="475" cy="121" r="26" fill={output ? "#34d399" : "#ef4444"} />
        <text x="475" y="127" textAnchor="middle" fill="white" fontWeight="900">{output ? 1 : 0}</text>
      </svg>
    </SectionCard>
  );
}

function BooleanLawVisualizer({ law, steps, onLaw, mode }: { law: "de-morgan" | "distributive" | "associative" | "complement"; steps: string[]; onLaw: (law: "de-morgan" | "distributive" | "associative" | "complement") => void; mode: string }) {
  return (
    <SectionCard title="Boolean Law Visualizer" description="Animate De Morgan, distributive, associative, and complement laws with practice prompts.">
      <div className="flex flex-wrap gap-2">{(["de-morgan", "distributive", "associative", "complement"] as const).map((item) => <button key={item} type="button" className={`tool-button ${law === item ? "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950" : ""}`} onClick={() => onLaw(item)}>{item}</button>)}</div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">{steps.map((step, index) => <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.12 }} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"><div className="mb-2 text-xs font-black uppercase text-cyan-600 dark:text-cyan-200">Step {index + 1}</div><div className="font-mono text-lg font-black">{step}</div></motion.div>)}</div>
      <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">{mode === "quiz" ? "Quiz: choose another law and predict the final equivalent expression before revealing the animation." : "Educational mode: each card shows a law transformation and the reason the truth value is preserved."}</div>
    </SectionCard>
  );
}

function ValidationBadges({ validation }: { validation: ReturnType<typeof validateOperation> }) {
  return <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{Object.entries({ closed: validation.closed, associative: validation.associative, semigroup: validation.semigroup, monoid: validation.monoid }).map(([key, value]) => <div key={key} className={`rounded-xl p-3 text-sm font-black ${value ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-100"}`}><Check className="mr-1 inline h-4 w-4" />{key}: {value ? "yes" : "no"}</div>)}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white/10 p-3"><div className="text-xs font-black uppercase text-slate-400">{label}</div><div className="font-mono text-lg font-black">{value}</div></div>;
}

function GateInput({ x, y, label, value, onClick }: { x: number; y: number; label: string; value: boolean; onClick: () => void }) {
  return <g onClick={onClick} className="cursor-pointer"><circle cx={x} cy={y} r="25" fill={value ? "#34d399" : "#ef4444"} /><text x={x} y={y + 5} textAnchor="middle" fill="white" fontWeight="900">{label}:{value ? 1 : 0}</text></g>;
}

function layoutNodes(elements: string[], pairs: Array<[string, string]>) {
  const nodes = elements.map((id) => ({ id, x: 0, y: 0 }));
  const links = pairs.map(([source, target]) => ({ source, target }));
  forceSimulation(nodes)
    .force("link", forceLink(links).id((node) => (node as { id: string }).id).distance(100))
    .force("charge", forceManyBody().strength(-260))
    .force("center", forceCenter(260, 150))
    .tick(100)
    .stop();
  return nodes;
}
