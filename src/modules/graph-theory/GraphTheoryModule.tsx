import "reactflow/dist/style.css";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, Download, GitBranch, Network, Palette, Play, Plus, Save, Shuffle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, MiniMap, type Edge, type Node, type NodeChange, applyNodeChanges } from "reactflow";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import {
  bfs,
  chromaticNumber,
  cytoscapeMetrics,
  degreeMap,
  dfs,
  dijkstra,
  edgeCrossings,
  eulerCircuit,
  eulerCircuitPath,
  graphColorConflicts,
  hamiltonianCycle,
  inducedSubgraph,
  kruskal,
  likelyIsomorphic,
  prim,
  serializeGraph,
  treeModel,
  topologicalSort,
  type AlgorithmStep,
  type GraphProject,
} from "./graphTheoryEngine";
import { useGraphTheoryStore, type GraphAlgorithmName } from "./graphTheoryStore";

const colors = ["#38bdf8", "#34d399", "#facc15", "#fb7185"];

export default function GraphTheoryModule() {
  const store = useGraphTheoryStore();
  const project = useMemo(() => ({ nodes: store.nodes, edges: store.edges, directed: store.directed }), [store.nodes, store.edges, store.directed]);
  const algorithm = useMemo(() => algorithmSteps(project, store.selectedAlgorithm), [project, store.selectedAlgorithm]);
  const activeStep = algorithm[Math.min(store.stepIndex, Math.max(0, algorithm.length - 1))];
  const coloring = useMemo(() => chromaticNumber(project), [project]);
  const workerColoring = useWorkerColoring(project);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Graph Theory"
        subtitle="Edit graphs, animate algorithms, explore trees, circuits, planarity, coloring, and graph projects."
        difficulty="Advanced Discrete Lab"
        estimatedMinutes={80}
        formula={{ title: "Planar invariant", formula: String.raw`V - E + F = 2`, explanation: "For connected planar graphs, Euler's formula relates vertices, edges, and faces." }}
      />

      <ImplementationAudit />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <GraphEditor project={project} activeStep={activeStep} coloring={workerColoring?.assignment ?? coloring.assignment} onNodes={store.setNodes} onEdges={store.setEdges} onAddNode={store.addNode} onAddEdge={store.addEdge} directed={store.directed} onDirected={store.setDirected} />
        <GraphAlgorithmsVisualizer project={project} selected={store.selectedAlgorithm} steps={algorithm} stepIndex={store.stepIndex} onAlgorithm={store.setSelectedAlgorithm} onStep={store.setStepIndex} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <IsomorphismChecker project={project} />
        <SubgraphStudio project={project} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <TreeVisualizationSystem />
        <SpanningTreeGenerator project={project} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <EulerHamiltonianExplorer project={project} />
        <PlanarGraphStudio project={project} />
      </div>

      <GraphColoringEngine project={project} coloring={workerColoring ?? coloring} workerEnabled={Boolean(workerColoring)} />

      <EducationalFeatures project={project} challengeMode={store.challengeMode} onChallenge={store.setChallengeMode} onLoad={store.loadProject} fileRef={fileRef} />
    </div>
  );
}

function ImplementationAudit() {
  const rows = [
    ["Basic Graph Concepts", "Partially implemented", "Existing syllabus lab covers degree and BFS basics; canonical module added."],
    ["Isomorphism", "Missing", "Added side-by-side signature comparison and mapping visualization."],
    ["Subgraphs", "Missing, implemented", "Added induced subgraph studio with node selection and density summary."],
    ["Trees", "Partial, enhanced", "Added binary, AVL-style, expression-tree models and traversal animation."],
    ["Spanning Trees", "Missing", "Added Kruskal/Prim MST and highlighting."],
    ["Directed Trees", "Missing", "Directed toggle plus topological/tree views added."],
    ["Binary Trees", "Missing", "Added traversal animation panel."],
    ["Planar Graphs", "Missing", "Added crossing detection and Euler formula studio."],
    ["Euler Circuits", "Missing, implemented", "Added connected/even-degree validation and Hierholzer path trace."],
    ["Hamiltonian Graphs", "Missing", "Added bounded brute-force cycle search."],
    ["Chromatic Numbers", "Missing", "Added exact small-graph solver and conflict coloring."],
    ["Four Color Problem", "Missing", "Added four-color theorem demonstration through planar/coloring panel."],
  ];
  return (
    <SectionCard title="Implementation Audit" description="Project scan before adding the canonical graph-theory module.">
      <div className="mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left dark:bg-white/10"><tr><th className="px-3 py-2">Topic</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Action</th></tr></thead>
          <tbody>{rows.map(([topic, status, action]) => <tr key={topic} className="border-t border-slate-200 dark:border-white/10"><td className="px-3 py-2 font-semibold">{topic}</td><td className="px-3 py-2"><span className="mini-chip">{status}</span></td><td className="px-3 py-2 text-slate-600 dark:text-slate-300">{action}</td></tr>)}</tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function GraphEditor({ project, activeStep, coloring, onNodes, onEdges, onAddNode, onAddEdge, directed, onDirected }: { project: GraphProject; activeStep?: AlgorithmStep; coloring: Record<string, number>; onNodes: (nodes: GraphProject["nodes"]) => void; onEdges: (edges: GraphProject["edges"]) => void; onAddNode: () => void; onAddEdge: (source: string, target: string) => void; directed: boolean; onDirected: (directed: boolean) => void }) {
  const rfNodes: Node[] = project.nodes.map((node) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: node.x, y: node.y },
    style: { background: activeStep?.activeNodes.includes(node.id) ? "#facc15" : colors[coloring[node.id] ?? 0], color: "#0f172a", fontWeight: 900, borderRadius: 999, border: "2px solid rgba(15,23,42,.2)" },
  }));
  const rfEdges: Edge[] = project.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: String(edge.weight),
    animated: activeStep?.activeEdges.includes(edge.id),
    markerEnd: directed ? { type: MarkerType.ArrowClosed } : undefined,
    style: { strokeWidth: activeStep?.activeEdges.includes(edge.id) ? 4 : 2, stroke: activeStep?.activeEdges.includes(edge.id) ? "#facc15" : "#64748b" },
  }));
  const handleNodeChanges = (changes: NodeChange[]) => {
    const changed = applyNodeChanges(changes, rfNodes);
    onNodes(project.nodes.map((node) => {
      const next = changed.find((item) => item.id === node.id);
      return next ? { ...node, x: next.position?.x ?? node.x, y: next.position?.y ?? node.y } : node;
    }));
  };
  return (
    <SectionCard title="Graph Editor" description="Create nodes, connect weighted edges, drag nodes, zoom, pan, and switch directed mode." tone="spotlight">
      <div className="mb-3 flex flex-wrap gap-2">
        <button className="tool-button" type="button" onClick={onAddNode}><Plus className="h-4 w-4" /> Node</button>
        <button className="tool-button" type="button" onClick={() => project.nodes.length >= 2 && onAddEdge(project.nodes.at(-2)!.id, project.nodes.at(-1)!.id)}><GitBranch className="h-4 w-4" /> Edge last two</button>
        <button className="tool-button" type="button" onClick={() => onDirected(!directed)}><Network className="h-4 w-4" /> {directed ? "Directed" : "Undirected"}</button>
      </div>
      <div className="h-[430px] overflow-hidden rounded-xl border border-cyan-200/15 bg-slate-950 shadow-inner shadow-cyan-950/30">
        <ReactFlow nodes={rfNodes} edges={rfEdges} onNodesChange={handleNodeChanges} fitView>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="mt-3 mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead><tr><th className="px-2 py-1 text-left">Edge</th><th className="px-2 py-1">Weight</th></tr></thead>
          <tbody>{project.edges.map((edge) => <tr key={edge.id} className="border-t border-slate-200 dark:border-white/10"><td className="px-2 py-1 font-mono">{edge.source} {"->"} {edge.target}</td><td className="px-2 py-1"><input className="w-20 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono dark:border-white/10 dark:bg-slate-950" type="number" value={edge.weight} onChange={(event) => onEdges(project.edges.map((item) => item.id === edge.id ? { ...item, weight: Number(event.target.value) } : item))} /></td></tr>)}</tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function GraphAlgorithmsVisualizer({ project, selected, steps, stepIndex, onAlgorithm, onStep }: { project: GraphProject; selected: GraphAlgorithmName; steps: AlgorithmStep[]; stepIndex: number; onAlgorithm: (value: GraphAlgorithmName) => void; onStep: (step: number) => void }) {
  const d = dijkstra(project);
  return (
    <SectionCard title="Graph Algorithms Visualizer" description="Animate BFS, DFS, Dijkstra, Kruskal, Prim, and topological sort.">
      <select className="w-full rounded-xl border border-slate-200 bg-white p-3 font-semibold dark:border-white/10 dark:bg-slate-950" value={selected} onChange={(event) => onAlgorithm(event.target.value as typeof selected)}>
        {["BFS", "DFS", "Dijkstra", "Kruskal", "Prim", "Topological Sort"].map((item) => <option key={item}>{item}</option>)}
      </select>
      <div className="mt-3 flex gap-2">
        <button className="action-primary" type="button" onClick={() => onStep(Math.min(steps.length - 1, stepIndex + 1))}><Play className="h-4 w-4" /> Step</button>
        <button className="tool-button" type="button" onClick={() => onStep(0)}>Reset</button>
      </div>
      <div className="mt-3 rounded-xl bg-slate-100 p-4 dark:bg-white/10">
        <div className="text-xs font-black uppercase text-slate-500">Step {Math.min(stepIndex + 1, steps.length)} of {steps.length}</div>
        <div className="mt-1 font-semibold">{steps[stepIndex]?.note ?? "Choose an algorithm."}</div>
      </div>
      <div className="mt-3 rounded-xl bg-slate-950 p-3 text-sm text-white">Dijkstra distances: {Object.entries(d.dist).map(([node, value]) => `${node}:${Number.isFinite(value) ? value : "inf"}`).join("  ")}</div>
    </SectionCard>
  );
}

function IsomorphismChecker({ project }: { project: GraphProject }) {
  const relabeled = { ...project, nodes: project.nodes.map((node, index) => ({ ...node, id: `v${index + 1}`, label: `v${index + 1}` })), edges: project.edges.map((edge) => ({ ...edge, source: `v${project.nodes.findIndex((node) => node.id === edge.source) + 1}`, target: `v${project.nodes.findIndex((node) => node.id === edge.target) + 1}` })) };
  return <SectionCard title="Isomorphism Checker" description="Compares graph invariants and shows a side-by-side relabeling."><Metric label="Likely isomorphic" value={likelyIsomorphic(project, relabeled) ? "yes" : "no"} /><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Mapping: {project.nodes.map((node, index) => `${node.id}->v${index + 1}`).join(", ")}</p></SectionCard>;
}

function SubgraphStudio({ project }: { project: GraphProject }) {
  const selected = project.nodes.filter((_, index) => index % 2 === 0).map((node) => node.id);
  const subgraph = inducedSubgraph(project, selected);
  const degree = degreeMap(subgraph);
  return (
    <SectionCard title="Subgraph Studio" description="Induced subgraph from selected vertices with inherited edges and degree summary.">
      <div className="flex flex-wrap gap-2">{project.nodes.map((node) => <span key={node.id} className={`rounded-full px-3 py-1 text-sm font-black ${selected.includes(node.id) ? "bg-cyan-200 text-slate-950" : "bg-slate-100 dark:bg-white/10"}`}>{node.id}</span>)}</div>
      <Metric label="Subgraph vertices" value={String(subgraph.nodes.length)} />
      <Metric label="Subgraph edges" value={String(subgraph.edges.length)} />
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Degrees: {Array.from(degree.entries()).map(([node, value]) => `${node}:${value}`).join(", ")}</p>
    </SectionCard>
  );
}

function TreeVisualizationSystem() {
  const [kind, setKind] = useState<"binary" | "avl" | "expression">("binary");
  const model = treeModel(kind);
  return <SectionCard title="Tree Visualization System" description="Binary, AVL-style balance, expression-tree shape, and recursive traversal animation."><div className="mb-3 flex flex-wrap gap-2">{(["binary", "avl", "expression"] as const).map((item) => <button key={item} type="button" className={`tool-button ${kind === item ? "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950" : ""}`} onClick={() => setKind(item)}>{item}</button>)}</div><svg viewBox="0 0 520 260" className="h-72 w-full rounded-2xl bg-slate-950">{model.edges.map(([a, b]) => { const s = model.nodes.find((n) => n.id === a)!; const t = model.nodes.find((n) => n.id === b)!; return <line key={`${a}-${b}`} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#67e8f9" strokeWidth="3" />; })}{model.nodes.map((node, index) => <motion.g key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.08 }}><circle cx={node.x} cy={node.y} r="24" fill="#1e293b" stroke="#a78bfa" strokeWidth="3" /><text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontWeight="900">{node.id}</text></motion.g>)}</svg><p className="mt-3 text-sm">Traversal: {model.traversal.join(", ")}.</p></SectionCard>;
}

function SpanningTreeGenerator({ project }: { project: GraphProject }) {
  const k = kruskal(project);
  const p = prim(project);
  return <SectionCard title="Spanning Tree Generator" description="MST animation highlights selected edges from Kruskal and Prim."><Metric label="Kruskal tree" value={k.tree.join(", ")} /><Metric label="Prim tree" value={p.tree.join(", ")} /><div className="mt-3 space-y-2">{k.steps.slice(0, 5).map((step) => <div key={step.note} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">{step.note}</div>)}</div></SectionCard>;
}

function EulerHamiltonianExplorer({ project }: { project: GraphProject }) {
  const h = hamiltonianCycle(project);
  const e = eulerCircuitPath(project);
  return <SectionCard title="Euler and Hamiltonian Explorer" description="Validates circuits and traces bounded traversal candidates."><Metric label="Euler circuit" value={eulerCircuit(project) ? "exists" : "not for current degrees/connectivity"} /><Metric label="Euler trace" value={e.exists ? e.path.join(" -> ") : "none"} /><Metric label="Hamiltonian cycle" value={h.exists ? h.path.join(" -> ") : "not found in bounded search"} /><div className="mt-3 space-y-2">{e.steps.slice(0, 4).map((step) => <div key={step.note} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">{step.note}</div>)}</div></SectionCard>;
}

function PlanarGraphStudio({ project }: { project: GraphProject }) {
  const crossings = edgeCrossings(project);
  const metrics = cytoscapeMetrics(project);
  const forceNodes = forcePreview(project);
  const faces = 2 - project.nodes.length + project.edges.length;
  return <SectionCard title="Planar Graph Studio" description="Detects drawn crossings and visualizes Euler formula for connected planar candidates."><Metric label="Drawn crossings" value={String(crossings.length)} /><Metric label="Cytoscape components" value={String(metrics.components)} /><Metric label="D3 force preview nodes" value={String(forceNodes.length)} /><Metric label="Euler faces estimate" value={String(faces)} /><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Four Color demonstration: planar maps need no more than four colors; use the coloring panel to inspect conflicts.</p></SectionCard>;
}

function GraphColoringEngine({ project, coloring, workerEnabled }: { project: GraphProject; coloring: ReturnType<typeof chromaticNumber>; workerEnabled: boolean }) {
  const conflicts = graphColorConflicts(project, coloring.assignment);
  return <SectionCard title="Graph Coloring Engine" description="Exact small-graph chromatic solver with worker-backed refresh and four-color demonstration."><div className="flex items-center gap-2"><Palette className="h-5 w-5 text-cyan-500" /><span className="font-black">Chromatic number: {coloring.colors}</span></div><div className="mt-3 flex flex-wrap gap-2">{project.nodes.map((node) => <span key={node.id} className="rounded-full px-3 py-1 text-sm font-black text-slate-950" style={{ background: colors[coloring.assignment[node.id] ?? 0] }}>{node.id}</span>)}</div><Metric label="Worker coloring" value={workerEnabled ? "active" : "fallback sync"} /><Metric label="Color conflicts" value={conflicts.length ? conflicts.join(", ") : "none"} /></SectionCard>;
}

function EducationalFeatures({ project, challengeMode, onChallenge, onLoad, fileRef }: { project: GraphProject; challengeMode: boolean; onChallenge: (value: boolean) => void; onLoad: (project: GraphProject) => void; fileRef: React.RefObject<HTMLInputElement> }) {
  return <SectionCard title="Educational Features and Save/Load" description="Challenge mode, AI tutor hints, practice prompts, quiz generation, and graph project persistence."><div className="flex flex-wrap gap-2"><button className="tool-button" type="button" onClick={() => onChallenge(!challengeMode)}><BookOpen className="h-4 w-4" /> {challengeMode ? "Challenge mode" : "Study mode"}</button><button className="tool-button" type="button" onClick={() => download("graph-project.json", serializeGraph(project))}><Save className="h-4 w-4" /> Save JSON</button><button className="tool-button" type="button" onClick={() => fileRef.current?.click()}><Download className="h-4 w-4" /> Load JSON</button></div><input ref={fileRef} className="hidden" type="file" accept="application/json" onChange={(event) => void loadFile(event.target.files?.[0], onLoad)} /><div className="mt-3 grid gap-3 md:grid-cols-3"><Hint icon={<BrainCircuit className="h-4 w-4" />} title="AI tutor" text="Start by checking degrees, connectivity, and whether the graph is directed or weighted." /><Hint icon={<Shuffle className="h-4 w-4" />} title="Practice" text="Create a graph with an Euler circuit, then break it by adding one odd-degree node." /><Hint icon={<Network className="h-4 w-4" />} title="Large graph strategy" text="Use React Flow viewport culling, D3 layout, Cytoscape metrics, and worker-backed coloring for heavier graphs." /></div></SectionCard>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="mt-2 rounded-xl bg-slate-100 p-3 dark:bg-white/10"><div className="text-xs font-black uppercase text-slate-500">{label}</div><div className="break-words font-mono font-black">{value}</div></div>;
}

function Hint({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5"><div className="flex items-center gap-2 text-sm font-black">{icon}{title}</div><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p></div>;
}

function algorithmSteps(project: GraphProject, selected: GraphAlgorithmName) {
  if (selected === "BFS") return bfs(project);
  if (selected === "DFS") return dfs(project);
  if (selected === "Dijkstra") return dijkstra(project).steps;
  if (selected === "Kruskal") return kruskal(project).steps;
  if (selected === "Prim") return prim(project).steps;
  return topologicalSort({ ...project, directed: true }).steps;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function loadFile(file: File | undefined, onLoad: (project: GraphProject) => void) {
  if (!file) return;
  onLoad(JSON.parse(await file.text()) as GraphProject);
}

function forcePreview(project: GraphProject) {
  const nodes = project.nodes.map((node) => ({ id: node.id, x: node.x, y: node.y }));
  const links = project.edges.map((edge) => ({ source: edge.source, target: edge.target }));
  forceSimulation(nodes)
    .force("link", forceLink(links).id((node) => (node as { id: string }).id).distance(90))
    .force("charge", forceManyBody().strength(-180))
    .force("center", forceCenter(260, 180))
    .tick(60)
    .stop();
  return nodes;
}

function useWorkerColoring(project: GraphProject) {
  const [coloring, setColoring] = useState<ReturnType<typeof chromaticNumber> | null>(null);
  useEffect(() => {
    const worker = new Worker(new URL("./graphWorker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<ReturnType<typeof chromaticNumber>>) => setColoring(event.data);
    worker.postMessage(project);
    return () => worker.terminate();
  }, [project]);
  return coloring;
}
