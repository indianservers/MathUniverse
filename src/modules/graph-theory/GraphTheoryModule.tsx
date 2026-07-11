import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { motion } from "framer-motion";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Copy,
  Download,
  FileJson,
  Gauge,
  GitBranch,
  GraduationCap,
  Layers,
  Maximize2,
  Minimize2,
  MousePointer2,
  Move,
  Network,
  Palette,
  PanelRightClose,
  Play,
  Plus,
  RotateCcw,
  Route,
  Save,
  Scissors,
  Shuffle,
  Trash2,
  Undo2,
  User,
  Waypoints,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import {
  adjacencyList,
  adjacencyMatrix,
  bfs,
  bridgesAndCutVertices,
  chromaticNumber,
  cliqueAndIndependentSets,
  clusteringCoefficients,
  complementGraph,
  cytoscapeMetrics,
  degreeMap,
  directedDegreeMap,
  dfs,
  dijkstra,
  edgeCrossings,
  eulerCircuit,
  eulerCircuitPath,
  floydWarshall,
  graphDistanceMetrics,
  graphGirth,
  graphColorConflicts,
  graphMetrics,
  hamiltonianCycle,
  incidenceMatrix,
  inducedSubgraph,
  isBipartite,
  kruskal,
  likelyIsomorphic,
  maxFlowMinCut,
  maximumMatching,
  planarityObstructionHint,
  prim,
  serializeGraph,
  treeModel,
  topologicalSort,
  type AlgorithmStep,
  type GraphProject,
  adjacency,
} from "./graphTheoryEngine";
import { useGraphTheoryStore, type GraphAlgorithmName } from "./graphTheoryStore";

const colors = ["#38bdf8", "#34d399", "#facc15", "#fb7185"];
const graphTopicCoverage = [
  "Representations",
  "Degree and handshaking",
  "Walks, trails, paths, cycles",
  "Connectivity",
  "Trees and spanning trees",
  "Directed graphs and DAGs",
  "Shortest paths",
  "Planarity and Euler formula",
  "Euler circuits",
  "Hamiltonian cycles",
  "Coloring and four-color idea",
  "Bipartite graphs",
  "Cliques and independent sets",
  "Matching",
  "Complement graphs",
  "Subgraphs and isomorphism",
  "Network flows and cuts",
  "Radius, diameter, center",
  "Clustering and girth",
  "Planarity obstructions",
  "Theorem checklist",
];

type GraphPrimaryTab = "Build" | "Analyze" | "Algorithms" | "Practice" | "Theory";
type GraphTab = {
  id: string;
  label: string;
  group: GraphPrimaryTab;
  icon: ReactNode;
  summary: string;
  content: ReactNode;
};
type GraphStudyMode = "student" | "teacher";
type GraphDensityMode = "beginner" | "advanced";
type GraphTemplateName = "path" | "cycle" | "complete" | "bipartite" | "tree" | "star" | "wheel";
type GraphLayoutName = "circular" | "force" | "tree" | "layered";

export default function GraphTheoryModule() {
  const store = useGraphTheoryStore();
  const [focusMode, setFocusMode] = useState(false);
  const [studyMode, setStudyMode] = useState<GraphStudyMode>("student");
  const [densityMode, setDensityMode] = useState<GraphDensityMode>("beginner");
  const project = useMemo(() => ({ nodes: store.nodes, edges: store.edges, directed: store.directed }), [store.nodes, store.edges, store.directed]);
  const algorithm = useMemo(() => algorithmSteps(project, store.selectedAlgorithm), [project, store.selectedAlgorithm]);
  const activeStep = algorithm[Math.min(store.stepIndex, Math.max(0, algorithm.length - 1))];
  const coloring = useMemo(() => chromaticNumber(project), [project]);
  const workerColoring = useWorkerColoring(project);
  const fileRef = useRef<HTMLInputElement>(null);
  const tabOptions = useMemo<GraphTab[]>(() => [
    {
      id: "build",
      label: "Build",
      group: "Build",
      icon: <GitBranch className="h-4 w-4" />,
      summary: "Create, edit, template, layout, and inspect the current graph.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-[1.2fr_.8fr]"}`}>
          <GraphEditor project={project} activeStep={activeStep} coloring={workerColoring?.assignment ?? coloring.assignment} onNodes={store.setNodes} onEdges={store.setEdges} onAddNode={store.addNode} onAddEdge={store.addEdge} onReset={store.resetProject} directed={store.directed} onDirected={store.setDirected} focusMode={focusMode} densityMode={densityMode} />
          {!focusMode ? <GraphRepresentationLab project={project} /> : null}
        </div>
      ),
    },
    {
      id: "structures",
      label: "Structures",
      group: "Analyze",
      icon: <Network className="h-4 w-4" />,
      summary: "Check degree, density, connectivity, isomorphism, and subgraphs.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-2"}`}>
          <GraphStructureLab project={project} />
          {!focusMode ? <ConnectivityLab project={project} /> : null}
          {!focusMode ? <IsomorphismChecker project={project} /> : null}
          {!focusMode ? <SubgraphStudio project={project} /> : null}
        </div>
      ),
    },
    {
      id: "trees",
      label: "Trees",
      group: "Analyze",
      icon: <Waypoints className="h-4 w-4" />,
      summary: "Explore trees, spanning trees, directed trees, and topological order.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-2"}`}>
          <TreeVisualizationSystem />
          {!focusMode ? <SpanningTreeGenerator project={project} /> : null}
          {!focusMode ? <DirectedGraphLab project={project} /> : null}
        </div>
      ),
    },
    {
      id: "circuits",
      label: "Circuits",
      group: "Analyze",
      icon: <Route className="h-4 w-4" />,
      summary: "Study paths, cycles, Euler traces, and Hamiltonian cycles.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-2"}`}>
          <EulerHamiltonianExplorer project={project} />
          {!focusMode ? <PathCycleLab project={project} /> : null}
        </div>
      ),
    },
    {
      id: "coloring",
      label: "Coloring",
      group: "Analyze",
      icon: <Palette className="h-4 w-4" />,
      summary: "Use coloring, planarity, bipartite checks, and matching together.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-2"}`}>
          <PlanarGraphStudio project={project} />
          {!focusMode ? <GraphColoringEngine project={project} coloring={workerColoring ?? coloring} workerEnabled={Boolean(workerColoring)} /> : null}
          {!focusMode ? <BipartiteMatchingLab project={project} /> : null}
        </div>
      ),
    },
    {
      id: "advanced",
      label: "Advanced",
      group: "Analyze",
      icon: <BrainCircuit className="h-4 w-4" />,
      summary: "Compare cliques, independent sets, and complement graphs.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-2"}`}>
          <CliqueIndependentLab project={project} />
          {!focusMode ? <ComplementGraphLab project={project} /> : null}
        </div>
      ),
    },
    {
      id: "networks",
      label: "Networks",
      group: "Analyze",
      icon: <Layers className="h-4 w-4" />,
      summary: "Inspect flows, cuts, eccentricity, center, clustering, and girth.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-2"}`}>
          <NetworkFlowLab project={project} />
          {!focusMode ? <NetworkMetricsLab project={project} /> : null}
        </div>
      ),
    },
    {
      id: "algorithms",
      label: "Algorithms",
      group: "Algorithms",
      icon: <Play className="h-4 w-4" />,
      summary: "Animate traversal, shortest path, MST, and topological algorithms.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-[.75fr_1.25fr]"}`}>
          <GraphAlgorithmsVisualizer project={project} selected={store.selectedAlgorithm} steps={algorithm} stepIndex={store.stepIndex} onAlgorithm={store.setSelectedAlgorithm} onStep={store.setStepIndex} />
          {!focusMode ? <ShortestPathLab project={project} /> : null}
        </div>
      ),
    },
    {
      id: "practice",
      label: "Practice",
      group: "Practice",
      icon: <GraduationCap className="h-4 w-4" />,
      summary: "Use challenge mode, save/load, tutor hints, and classroom prompts.",
      content: <EducationalFeatures project={project} challengeMode={store.challengeMode} onChallenge={store.setChallengeMode} onLoad={store.loadProject} fileRef={fileRef} />,
    },
    {
      id: "theory",
      label: "Theory",
      group: "Theory",
      icon: <BookOpen className="h-4 w-4" />,
      summary: "Connect visual checks to theorem statements and obstruction ideas.",
      content: (
        <div className={`grid gap-5 ${focusMode ? "" : "xl:grid-cols-2"}`}>
          <PlanarityObstructionLab project={project} />
          {!focusMode ? <GraphTheoryReference project={project} /> : null}
        </div>
      ),
    },
  ], [activeStep, algorithm, coloring, densityMode, fileRef, focusMode, project, store, workerColoring]);

  useEffect(() => {
    if (!isUsableGraphProject(project)) store.resetProject();
  }, [project, store]);

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Graph Theory"
        subtitle="Edit graphs, animate algorithms, explore trees, circuits, planarity, coloring, and graph projects."
        difficulty="Advanced Discrete Lab"
        estimatedMinutes={80}
        formula={{ title: "Planar invariant", formula: String.raw`V - E + F = 2`, explanation: "For connected planar graphs, Euler's formula relates vertices, edges, and faces." }}
      />

      <GraphCockpit
        algorithm={store.selectedAlgorithm}
        densityMode={densityMode}
        focusMode={focusMode}
        onDensityMode={setDensityMode}
        onDirected={store.setDirected}
        onFocusMode={setFocusMode}
        onReset={store.resetProject}
        onStudyMode={setStudyMode}
        project={project}
        studyMode={studyMode}
      />
      {densityMode === "beginner" && !focusMode ? <GraphTheoryCompletionDashboard project={project} /> : null}
      <GraphTheoryTabs
        algorithm={store.selectedAlgorithm}
        densityMode={densityMode}
        focusMode={focusMode}
        project={project}
        studyMode={studyMode}
        tabs={tabOptions}
      />
    </div>
  );
}

function GraphCockpit({
  algorithm,
  densityMode,
  focusMode,
  onDensityMode,
  onDirected,
  onFocusMode,
  onReset,
  onStudyMode,
  project,
  studyMode,
}: {
  algorithm: GraphAlgorithmName;
  densityMode: GraphDensityMode;
  focusMode: boolean;
  onDensityMode: (mode: GraphDensityMode) => void;
  onDirected: (directed: boolean) => void;
  onFocusMode: (enabled: boolean) => void;
  onReset: () => void;
  onStudyMode: (mode: GraphStudyMode) => void;
  project: GraphProject;
  studyMode: GraphStudyMode;
}) {
  const metrics = graphMetrics(project);
  return (
    <section className="rounded-3xl border border-cyan-200 bg-white/90 p-3 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <CockpitPill icon={<Network className="h-4 w-4" />} label="Nodes" value={String(metrics.order)} />
          <CockpitPill icon={<GitBranch className="h-4 w-4" />} label="Edges" value={String(metrics.size)} />
          <CockpitPill icon={<Route className="h-4 w-4" />} label="Graph" value={project.directed ? "Directed" : "Undirected"} />
          <CockpitPill icon={<Play className="h-4 w-4" />} label="Algorithm" value={algorithm} />
          <CockpitPill icon={<Gauge className="h-4 w-4" />} label="Density" value={`${Math.round(metrics.density * 100)}%`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="tool-button" type="button" onClick={() => onReset()}><RotateCcw className="h-4 w-4" /> Reset</button>
          <button className="tool-button" type="button" onClick={() => download("graph-theory-project.json", serializeGraph(project))}><Save className="h-4 w-4" /> Save</button>
          <button className="tool-button" type="button" onClick={() => download("graph-theory-export.json", JSON.stringify({ exportedAt: new Date().toISOString(), ...project }, null, 2))}><FileJson className="h-4 w-4" /> Export</button>
          <button className="tool-button" type="button" onClick={() => void togglePageFullscreen()}><Maximize2 className="h-4 w-4" /> Fullscreen</button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SegmentedChoice
          label="Mode"
          options={[
            { id: "student", label: "Student", icon: <GraduationCap className="h-4 w-4" /> },
            { id: "teacher", label: "Teacher", icon: <User className="h-4 w-4" /> },
          ]}
          value={studyMode}
          onChange={(value) => onStudyMode(value as GraphStudyMode)}
        />
        <SegmentedChoice
          label="Density"
          options={[
            { id: "beginner", label: "Beginner", icon: <BookOpen className="h-4 w-4" /> },
            { id: "advanced", label: "Advanced", icon: <Gauge className="h-4 w-4" /> },
          ]}
          value={densityMode}
          onChange={(value) => onDensityMode(value as GraphDensityMode)}
        />
        <button className={`tool-button ${focusMode ? "bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950" : ""}`} type="button" onClick={() => onFocusMode(!focusMode)}>
          <PanelRightClose className="h-4 w-4" />
          {focusMode ? "Exit focus" : "Focus mode"}
        </button>
        <button className="tool-button" type="button" onClick={() => onDirected(!project.directed)}>
          <Route className="h-4 w-4" />
          {project.directed ? "Use undirected" : "Use directed"}
        </button>
      </div>
    </section>
  );
}

function CockpitPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-white/5">
      <span className="text-cyan-700 dark:text-cyan-200">{icon}</span>
      <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-black text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}

function SegmentedChoice({ label, options, value, onChange }: { label: string; options: Array<{ id: string; label: string; icon: ReactNode }>; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
      <span className="px-2 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</span>
      {options.map((option) => (
        <button key={option.id} className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black transition ${value === option.id ? "bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"}`} type="button" onClick={() => onChange(option.id)}>
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

function GraphTheoryTabs({ algorithm, densityMode, focusMode, project, studyMode, tabs }: { algorithm: GraphAlgorithmName; densityMode: GraphDensityMode; focusMode: boolean; project: GraphProject; studyMode: GraphStudyMode; tabs: GraphTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const groups: GraphPrimaryTab[] = ["Build", "Analyze", "Algorithms", "Practice", "Theory"];
  const activeGroup = active.group;
  return (
    <section className="rounded-3xl border border-cyan-200 bg-white/90 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
      <div className="sticky top-0 z-20 rounded-t-3xl border-b border-slate-200 bg-white/95 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
        <div role="tablist" aria-label="Graph theory primary workspaces" className="flex gap-2 overflow-x-auto thin-scrollbar">
          {groups.map((group) => {
            const firstTab = tabs.find((tab) => tab.group === group);
            const selected = group === activeGroup;
            if (!firstTab) return null;
            return (
              <button
                key={group}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`min-h-11 shrink-0 rounded-2xl px-4 py-2 text-sm font-black transition ${selected ? "bg-slate-950 text-white shadow-sm dark:bg-cyan-300 dark:text-slate-950" : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-cyan-200 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
                onClick={() => setActiveId(firstTab.id)}
              >
                {group}
              </button>
            );
          })}
        </div>
        <div role="tablist" aria-label="Graph theory secondary workspaces" className="mt-2 flex gap-2 overflow-x-auto thin-scrollbar">
          {tabs.filter((tab) => tab.group === activeGroup).map((tab) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black transition ${selected ? "bg-cyan-500 text-white shadow-sm dark:bg-cyan-300 dark:text-slate-950" : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cyan-100 bg-cyan-50/70 px-3 py-2 text-xs font-bold text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-full bg-white px-2 py-1 dark:bg-white/10">Graph Theory</span>
            <span>{">"}</span>
            <span className="rounded-full bg-white px-2 py-1 dark:bg-white/10">{active.group}</span>
            <span>{">"}</span>
            <span className="rounded-full bg-white px-2 py-1 dark:bg-white/10">{active.id === "algorithms" ? algorithm : active.label}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>{project.nodes.length}V / {project.edges.length}E</span>
            <span>{project.directed ? "directed" : "undirected"}</span>
            <span>{studyMode}</span>
            <span>{densityMode}</span>
            {focusMode ? <span>focus</span> : null}
          </div>
        </div>
      </div>
      <div role="tabpanel" className="p-3 sm:p-4">
        <details open={densityMode === "beginner"} className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <summary className="cursor-pointer text-sm font-black text-slate-950 dark:text-white">{active.label} summary</summary>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{active.summary}</p>
        </details>
        {active.content}
      </div>
    </section>
  );
}

function GraphTheoryCompletionDashboard({ project }: { project: GraphProject }) {
  const metrics = graphMetrics(project);
  return (
    <SectionCard title="Implementation Coverage" description="Canonical graph theory topics are grouped into tabs so students can work without long scrolling.">
      <div className="grid gap-3 md:grid-cols-[.8fr_1.2fr]">
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Topics covered" value={String(graphTopicCoverage.length)} />
          <Metric label="Current graph" value={`${metrics.order}V / ${metrics.size}E`} />
          <Metric label="Density" value={`${Math.round(metrics.density * 100)}%`} />
          <Metric label="Handshaking" value={`${metrics.degreeSum} = 2 x ${metrics.size}`} />
        </div>
        <div className="grid max-h-52 gap-2 overflow-auto pr-1 sm:grid-cols-2 thin-scrollbar">
          {graphTopicCoverage.map((topic) => (
            <div key={topic} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              {topic}
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function _ImplementationAudit() {
  const rows = [
    ["Basic Graph Concepts", "Covered", "Degree, order, size, density, and handshaking are now in the Structures tab."],
    ["Isomorphism", "Covered", "Side-by-side signature comparison and mapping visualization are available."],
    ["Subgraphs", "Covered", "Induced subgraph studio includes node selection and degree summary."],
    ["Trees", "Covered", "Binary, AVL-style balance, expression-tree models, and traversal animation are available."],
    ["Spanning Trees", "Covered", "Kruskal/Prim MST selection is available."],
    ["Directed Trees", "Covered", "Directed toggle plus topological/tree views are available."],
    ["Binary Trees", "Covered", "Traversal animation panel is available."],
    ["Planar Graphs", "Covered", "Crossing detection and Euler formula studio are available."],
    ["Euler Circuits", "Covered", "Connected/even-degree validation and Hierholzer trace are available."],
    ["Hamiltonian Graphs", "Covered", "Bounded brute-force cycle search is available."],
    ["Chromatic Numbers", "Covered", "Exact small-graph solver and conflict coloring are available."],
    ["Four Color Problem", "Covered", "Four-color demonstration is available through planarity and coloring panels."],
  ];
  return (
    <SectionCard title="Coverage Reference" description="Canonical graph-theory topics available in this module.">
      <div className="mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left dark:bg-white/10"><tr><th className="px-3 py-2">Topic</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Action</th></tr></thead>
          <tbody>{rows.map(([topic, status, action]) => <tr key={topic} className="border-t border-slate-200 dark:border-white/10"><td className="px-3 py-2 font-semibold">{topic}</td><td className="px-3 py-2"><span className="mini-chip">{status}</span></td><td className="px-3 py-2 text-slate-600 dark:text-slate-300">{action}</td></tr>)}</tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function GraphEditor({
  project,
  activeStep,
  coloring,
  onNodes,
  onEdges,
  onAddNode,
  onAddEdge,
  onReset,
  directed,
  onDirected,
  focusMode,
  densityMode,
}: {
  activeStep?: AlgorithmStep;
  coloring: Record<string, number>;
  densityMode: GraphDensityMode;
  directed: boolean;
  focusMode: boolean;
  onAddEdge: (source: string, target: string) => void;
  onAddNode: () => void;
  onDirected: (directed: boolean) => void;
  onEdges: (edges: GraphProject["edges"]) => void;
  onNodes: (nodes: GraphProject["nodes"]) => void;
  onReset: () => void;
  project: GraphProject;
}) {
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [toolMode, setToolMode] = useState<"select" | "move" | "connect" | "pan" | "lasso">("move");
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [nodeSize, setNodeSize] = useState(25);
  const [edgeThickness, setEdgeThickness] = useState(3);
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [showEdgeWeights, setShowEdgeWeights] = useState(true);
  const [showDegreeLabels, setShowDegreeLabels] = useState(false);
  const [showArrows, setShowArrows] = useState(true);
  const [history, setHistory] = useState<GraphProject[]>([]);
  const [future, setFuture] = useState<GraphProject[]>([]);
  const [lasso, setLasso] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [fullCanvas, setFullCanvas] = useState(false);
  const [panDrag, setPanDrag] = useState<{ startClient: { x: number; y: number }; startPan: { x: number; y: number } } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const activeNodes = activeStep?.activeNodes ?? [];
  const activeEdges = activeStep?.activeEdges ?? [];
  const graphNodeById = new Map(project.nodes.map((node) => [node.id, node]));
  const degrees = degreeMap(project);
  const selectedNodeSet = new Set(selectedNodes);
  const hoveredNode = hoveredNodeId ? graphNodeById.get(hoveredNodeId) : undefined;
  const pushHistory = () => {
    setHistory((items) => [...items.slice(-14), project]);
    setFuture([]);
  };
  const toGraphPoint = (event: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (((event.clientX - rect.left) * 900) / rect.width - pan.x) / zoom,
      y: (((event.clientY - rect.top) * 430) / rect.height - pan.y) / zoom,
    };
  };
  const snapPoint = (point: { x: number; y: number }) => snapToGrid ? { x: Math.round(point.x / 34) * 34, y: Math.round(point.y / 34) * 34 } : point;
  const updateNodePosition = (nodeId: string, point: { x: number; y: number }) => {
    const snapped = snapPoint(point);
    onNodes(project.nodes.map((node) => (node.id === nodeId ? { ...node, x: Math.max(34, Math.min(866, snapped.x)), y: Math.max(34, Math.min(396, snapped.y)) } : node)));
  };
  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const point = toGraphPoint(event);
    if (panDrag) {
      setPan({ x: panDrag.startPan.x + event.clientX - panDrag.startClient.x, y: panDrag.startPan.y + event.clientY - panDrag.startClient.y });
      return;
    }
    if (lasso) {
      setLasso({ ...lasso, end: point });
      return;
    }
    if (draggingNode) updateNodePosition(draggingNode, point);
  };
  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (draggingNode) event.currentTarget.releasePointerCapture(event.pointerId);
    if (lasso) {
      const minX = Math.min(lasso.start.x, lasso.end.x);
      const maxX = Math.max(lasso.start.x, lasso.end.x);
      const minY = Math.min(lasso.start.y, lasso.end.y);
      const maxY = Math.max(lasso.start.y, lasso.end.y);
      setSelectedNodes(project.nodes.filter((node) => node.x >= minX && node.x <= maxX && node.y >= minY && node.y <= maxY).map((node) => node.id));
      setLasso(null);
    }
    setDraggingNode(null);
    setPanDrag(null);
  };
  const mutateProject = (next: GraphProject) => {
    pushHistory();
    onNodes(next.nodes);
    onEdges(next.edges);
    onDirected(next.directed);
  };
  const deleteSelection = () => {
    if (!selectedNodes.length && !selectedEdgeId) return;
    pushHistory();
    const removeNodes = new Set(selectedNodes);
    onNodes(project.nodes.filter((node) => !removeNodes.has(node.id)));
    onEdges(project.edges.filter((edge) => edge.id !== selectedEdgeId && !removeNodes.has(edge.source) && !removeNodes.has(edge.target)));
    setSelectedNodes([]);
    setSelectedEdgeId(null);
  };
  const duplicateGraph = () => {
    pushHistory();
    onNodes(project.nodes.map((node) => ({ ...node, x: Math.min(866, node.x + 34), y: Math.min(396, node.y + 34) })));
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [project, ...items]);
    setHistory((items) => items.slice(0, -1));
    onNodes(previous.nodes);
    onEdges(previous.edges);
    onDirected(previous.directed);
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, project]);
    setFuture((items) => items.slice(1));
    onNodes(next.nodes);
    onEdges(next.edges);
    onDirected(next.directed);
  };
  const clearGraph = () => {
    pushHistory();
    onNodes([]);
    onEdges([]);
    setSelectedNodes([]);
    setSelectedEdgeId(null);
  };
  const applyTemplate = (template: GraphTemplateName) => mutateProject(createGraphTemplate(template, directed));
  const applyLayout = (layout: GraphLayoutName) => {
    pushHistory();
    onNodes(layoutGraph(project, layout));
  };
  const canvasClass = fullCanvas ? "fixed inset-4 z-50 h-auto rounded-3xl border border-cyan-200 bg-slate-950 p-3 shadow-2xl" : "relative h-[430px] overflow-hidden rounded-xl border border-cyan-200/15 bg-slate-950 shadow-inner shadow-cyan-950/30";
  return (
    <SectionCard title="Graph Editor" description="Create nodes, connect weighted edges, drag nodes, zoom, switch modes, and template common graph families." tone="spotlight">
      <div className="mb-3 grid gap-2">
        <div className="flex flex-wrap gap-2">
          <button className="tool-button" type="button" onClick={() => { pushHistory(); onAddNode(); }}><Plus className="h-4 w-4" /> Node</button>
          <button className="tool-button" type="button" onClick={() => project.nodes.length >= 2 && (pushHistory(), onAddEdge(project.nodes.at(-2)!.id, project.nodes.at(-1)!.id))}><GitBranch className="h-4 w-4" /> Edge last two</button>
          <button className="tool-button" type="button" onClick={() => { pushHistory(); onDirected(!directed); }}><Network className="h-4 w-4" /> {directed ? "Directed" : "Undirected"}</button>
          <button className="tool-button" type="button" onClick={onReset}><RotateCcw className="h-4 w-4" /> Reset sample</button>
          <button className="tool-button" type="button" onClick={clearGraph}><Trash2 className="h-4 w-4" /> Clear graph</button>
          <button className="tool-button" type="button" onClick={() => setFullCanvas(!fullCanvas)}>{fullCanvas ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />} Canvas</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["select", "move", "connect", "pan", "lasso"] as const).map((mode) => (
            <button key={mode} className={`tool-button ${toolMode === mode ? "bg-cyan-500 text-white dark:bg-cyan-300 dark:text-slate-950" : ""}`} type="button" onClick={() => setToolMode(mode)}>
              {mode === "select" ? <MousePointer2 className="h-4 w-4" /> : mode === "move" ? <Move className="h-4 w-4" /> : mode === "connect" ? <GitBranch className="h-4 w-4" /> : mode === "pan" ? <Waypoints className="h-4 w-4" /> : <Scissors className="h-4 w-4" />}
              {mode}
            </button>
          ))}
          <button className="tool-button" type="button" disabled={!selectedNodes.length && !selectedEdgeId} onClick={deleteSelection}><Trash2 className="h-4 w-4" /> Delete selected</button>
          <button className="tool-button" type="button" onClick={duplicateGraph}><Copy className="h-4 w-4" /> Duplicate</button>
          <button className="tool-button" type="button" disabled={!history.length} onClick={undo}><Undo2 className="h-4 w-4" /> Undo</button>
          <button className="tool-button" type="button" disabled={!future.length} onClick={redo}>Redo</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="tool-button" type="button" onClick={() => setZoom((value) => Math.min(2, Number((value + 0.15).toFixed(2))))}>+</button>
          <button className="tool-button" type="button" onClick={() => setZoom((value) => Math.max(0.55, Number((value - 0.15).toFixed(2))))}>-</button>
          <button className="tool-button" type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}><CircleDot className="h-4 w-4" /> Fit</button>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-100">{Math.round(zoom * 100)}%</span>
          <button className={`tool-button ${snapToGrid ? "bg-cyan-500 text-white dark:bg-cyan-300 dark:text-slate-950" : ""}`} type="button" onClick={() => setSnapToGrid(!snapToGrid)}><CircleDot className="h-4 w-4" /> Snap</button>
          <label className="mini-chip">Node <input className="w-24 accent-cyan-500" type="range" min="16" max="36" value={nodeSize} onChange={(event) => setNodeSize(Number(event.target.value))} /></label>
          <label className="mini-chip">Edge <input className="w-24 accent-cyan-500" type="range" min="1" max="8" value={edgeThickness} onChange={(event) => setEdgeThickness(Number(event.target.value))} /></label>
        </div>
        {!focusMode || densityMode === "beginner" ? (
          <div className="grid gap-2 lg:grid-cols-2">
            <div className="flex flex-wrap gap-2">
              {(["path", "cycle", "complete", "bipartite", "tree", "star", "wheel"] as GraphTemplateName[]).map((template) => (
                <button key={template} className="mini-chip bg-white text-slate-700 dark:bg-white/10 dark:text-slate-100" type="button" onClick={() => applyTemplate(template)}>{template}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["circular", "force", "tree", "layered"] as GraphLayoutName[]).map((layout) => (
                <button key={layout} className="mini-chip bg-cyan-50 text-cyan-800 dark:bg-cyan-300/10 dark:text-cyan-100" type="button" onClick={() => applyLayout(layout)}>{layout} layout</button>
              ))}
              <label className="mini-chip"><input type="checkbox" checked={showNodeLabels} onChange={(event) => setShowNodeLabels(event.target.checked)} /> node labels</label>
              <label className="mini-chip"><input type="checkbox" checked={showEdgeWeights} onChange={(event) => setShowEdgeWeights(event.target.checked)} /> weights</label>
              <label className="mini-chip"><input type="checkbox" checked={showDegreeLabels} onChange={(event) => setShowDegreeLabels(event.target.checked)} /> degrees</label>
              <label className="mini-chip"><input type="checkbox" checked={showArrows} onChange={(event) => setShowArrows(event.target.checked)} /> arrows</label>
            </div>
          </div>
        ) : null}
      </div>
      <div className={canvasClass}>
        {fullCanvas ? <button className="absolute right-4 top-4 z-20 rounded-full bg-white px-3 py-2 text-sm font-black text-slate-950" type="button" onClick={() => setFullCanvas(false)}><Minimize2 className="inline h-4 w-4" /> Exit</button> : null}
        {project.nodes.length === 0 ? (
          <div className="absolute inset-0 z-10 grid place-items-center p-6 text-center text-white">
            <div className="rounded-2xl border border-cyan-300/30 bg-slate-900/90 p-5 shadow-xl">
              <p className="text-lg font-black">No graph nodes yet</p>
              <p className="mt-2 text-sm text-slate-300">Add a node or restore the sample graph to start editing.</p>
              <div className="mt-4 flex justify-center gap-2">
                <button className="action-primary" type="button" onClick={onAddNode}><Plus className="h-4 w-4" /> Add node</button>
                <button className="tool-button" type="button" onClick={onReset}><RotateCcw className="h-4 w-4" /> Sample</button>
              </div>
            </div>
          </div>
        ) : null}
        <svg
          ref={svgRef}
          viewBox="0 0 900 430"
          role="img"
          aria-label="Editable graph canvas"
          className="h-full w-full touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerDown={(event) => {
            if (event.target !== event.currentTarget && (event.target as SVGElement).tagName !== "rect") return;
            const point = toGraphPoint(event);
            if (toolMode === "lasso") setLasso({ start: point, end: point });
            if (toolMode === "pan") setPanDrag({ startClient: { x: event.clientX, y: event.clientY }, startPan: pan });
            if (toolMode === "select") {
              setSelectedNodes([]);
              setSelectedEdgeId(null);
            }
          }}
        >
          <defs>
            <pattern id="graph-grid" width="34" height="34" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="#94a3b8" opacity="0.55" />
            </pattern>
            <marker id="graph-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#67e8f9" />
            </marker>
          </defs>
          <rect width="900" height="430" rx="18" fill="#020617" />
          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
            <rect width={900 / zoom} height={430 / zoom} fill="url(#graph-grid)" />
            {project.edges.map((edge) => {
              const source = graphNodeById.get(edge.source);
              const target = graphNodeById.get(edge.target);
              if (!source || !target) return null;
              const active = activeEdges.includes(edge.id);
              const selected = selectedEdgeId === edge.id;
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;
              return (
                <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdgeId(edge.id)}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={active ? "#facc15" : selected ? "#fb7185" : "#67e8f9"}
                    strokeWidth={active || selected ? edgeThickness + 2 : edgeThickness}
                    strokeLinecap="round"
                    markerEnd={directed && showArrows ? "url(#graph-arrow)" : undefined}
                  />
                  {showEdgeWeights ? (
                    <>
                      <rect x={midX - 16} y={midY - 14} width="32" height="24" rx="10" fill="#f8fafc" opacity="0.95" />
                      <text x={midX} y={midY + 5} textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="900">{edge.weight}</text>
                    </>
                  ) : null}
                </g>
              );
            })}
            {project.nodes.map((node) => {
              const active = activeNodes.includes(node.id);
              const selected = selectedNodeSet.has(node.id);
              const connecting = connectSource === node.id;
              const fill = active ? "#facc15" : colors[coloring[node.id] ?? 0];
              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Node ${node.label}`}
                  className="cursor-grab outline-none"
                  transform={`translate(${node.x} ${node.y})`}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onKeyDown={(event) => {
                    const step = event.shiftKey ? 24 : 10;
                    const deltas: Record<string, { x: number; y: number }> = {
                      ArrowUp: { x: 0, y: -step },
                      ArrowDown: { x: 0, y: step },
                      ArrowLeft: { x: -step, y: 0 },
                      ArrowRight: { x: step, y: 0 },
                    };
                    const delta = deltas[event.key];
                    if (!delta) return;
                    event.preventDefault();
                    updateNodePosition(node.id, { x: node.x + delta.x, y: node.y + delta.y });
                  }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    if (toolMode === "connect") {
                      if (!connectSource) setConnectSource(node.id);
                      else if (connectSource !== node.id) {
                        pushHistory();
                        onAddEdge(connectSource, node.id);
                        setConnectSource(null);
                      }
                      return;
                    }
                    if (toolMode === "select") {
                      setSelectedNodes((items) => event.shiftKey ? (items.includes(node.id) ? items.filter((id) => id !== node.id) : [...items, node.id]) : [node.id]);
                      setSelectedEdgeId(null);
                      return;
                    }
                    if (toolMode === "pan" || toolMode === "lasso") return;
                    pushHistory();
                    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
                    setDraggingNode(node.id);
                  }}
                >
                  <circle r={nodeSize} fill={fill} stroke={active || selected || connecting ? "#f8fafc" : "#0f172a"} strokeWidth={active || selected || connecting ? 5 : 3} />
                  {showNodeLabels ? <text y="6" textAnchor="middle" fill="#0f172a" fontSize={Math.max(12, nodeSize - 7)} fontWeight="950">{node.label}</text> : null}
                  {showDegreeLabels ? <text y={nodeSize + 18} textAnchor="middle" fill="#e0f2fe" fontSize="12" fontWeight="900">deg {degrees.get(node.id) ?? 0}</text> : null}
                </g>
              );
            })}
            {lasso ? (
              <rect
                x={Math.min(lasso.start.x, lasso.end.x)}
                y={Math.min(lasso.start.y, lasso.end.y)}
                width={Math.abs(lasso.end.x - lasso.start.x)}
                height={Math.abs(lasso.end.y - lasso.start.y)}
                fill="#22d3ee"
                fillOpacity="0.12"
                stroke="#67e8f9"
                strokeDasharray="8 6"
                strokeWidth="2"
              />
            ) : null}
          </g>
        </svg>
        <div className="absolute bottom-3 right-3 hidden w-44 rounded-2xl border border-cyan-200/30 bg-slate-900/90 p-2 text-white shadow-xl md:block">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">Mini map</p>
          <svg viewBox="0 0 900 430" className="h-20 w-full rounded-xl bg-slate-950">
            {project.edges.map((edge) => {
              const source = graphNodeById.get(edge.source);
              const target = graphNodeById.get(edge.target);
              return source && target ? <line key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#155e75" strokeWidth="6" /> : null;
            })}
            {project.nodes.map((node) => <circle key={node.id} cx={node.x} cy={node.y} r="15" fill="#67e8f9" />)}
          </svg>
        </div>
        {hoveredNode ? (
          <div className="absolute left-3 top-3 rounded-2xl border border-cyan-200/30 bg-slate-900/90 px-3 py-2 text-sm font-bold text-white shadow-xl">
            <div className="text-cyan-200">Node {hoveredNode.label}</div>
            <div>Degree {degrees.get(hoveredNode.id) ?? 0}</div>
            <div>Neighbors {(adjacency(project).get(hoveredNode.id) ?? []).map(({ to }) => to).join(", ") || "none"}</div>
          </div>
        ) : null}
        {selectedEdgeId ? (
          <EdgeEditPopover
            edge={project.edges.find((edge) => edge.id === selectedEdgeId)}
            onClose={() => setSelectedEdgeId(null)}
            onUpdate={(nextWeight) => {
              pushHistory();
              onEdges(project.edges.map((edge) => edge.id === selectedEdgeId ? { ...edge, weight: nextWeight } : edge));
            }}
          />
        ) : null}
      </div>
      {!focusMode ? <div className="mt-3 mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead><tr><th className="px-2 py-1 text-left">Edge</th><th className="px-2 py-1">Weight</th></tr></thead>
          <tbody>{project.edges.map((edge) => <tr key={edge.id} className="border-t border-slate-200 dark:border-white/10"><td className="px-2 py-1 font-mono">{edge.source} {"->"} {edge.target}</td><td className="px-2 py-1"><input className="w-20 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono dark:border-white/10 dark:bg-slate-950" type="number" value={edge.weight} onChange={(event) => onEdges(project.edges.map((item) => item.id === edge.id ? { ...item, weight: Number(event.target.value) } : item))} /></td></tr>)}</tbody>
        </table>
      </div> : null}
    </SectionCard>
  );
}

function EdgeEditPopover({ edge, onClose, onUpdate }: { edge?: GraphProject["edges"][number]; onClose: () => void; onUpdate: (weight: number) => void }) {
  if (!edge) return null;
  return (
    <div className="absolute bottom-3 left-3 w-72 rounded-2xl border border-cyan-200/30 bg-white p-3 text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-200">Edge editor</p>
          <p className="font-black">{edge.source} {"->"} {edge.target}</p>
        </div>
        <button className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black dark:bg-white/10" type="button" onClick={onClose}>Close</button>
      </div>
      <label className="mt-3 block text-sm font-bold">
        Weight
        <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-mono font-black text-slate-950 dark:border-white/10" type="number" value={edge.weight} onChange={(event) => onUpdate(Number(event.target.value))} />
      </label>
    </div>
  );
}

function createGraphTemplate(template: GraphTemplateName, directed: boolean): GraphProject {
  const makeNodes = (count: number, layout: GraphLayoutName = "circular") => layoutGraph({
    directed,
    nodes: Array.from({ length: count }, (_, index) => {
      const id = String.fromCharCode(65 + index);
      return { id, label: id, x: 120 + index * 80, y: 200 };
    }),
    edges: [],
  }, layout);
  const edge = (source: string, target: string, weight = 1): GraphProject["edges"][number] => ({ id: `${source}-${target}`, source, target, weight, directed });
  if (template === "path") {
    const nodes = makeNodes(6, "layered");
    return { directed, nodes, edges: nodes.slice(0, -1).map((node, index) => edge(node.id, nodes[index + 1].id)) };
  }
  if (template === "cycle") {
    const nodes = makeNodes(6);
    return { directed, nodes, edges: nodes.map((node, index) => edge(node.id, nodes[(index + 1) % nodes.length].id)) };
  }
  if (template === "complete") {
    const nodes = makeNodes(5);
    const edges: GraphProject["edges"] = [];
    nodes.forEach((source, left) => nodes.forEach((target, right) => {
      if (left < right) edges.push(edge(source.id, target.id));
    }));
    return { directed, nodes, edges };
  }
  if (template === "bipartite") {
    const nodes = makeNodes(6, "layered").map((node, index) => ({ ...node, x: index < 3 ? 240 : 620, y: 95 + (index % 3) * 120 }));
    return { directed, nodes, edges: [edge("A", "D"), edge("A", "E"), edge("B", "D"), edge("B", "F"), edge("C", "E"), edge("C", "F")] };
  }
  if (template === "tree") {
    const nodes = makeNodes(7, "tree");
    return { directed, nodes, edges: [edge("A", "B"), edge("A", "C"), edge("B", "D"), edge("B", "E"), edge("C", "F"), edge("C", "G")] };
  }
  if (template === "star") {
    const nodes = makeNodes(7);
    return { directed, nodes, edges: nodes.slice(1).map((node) => edge("A", node.id)) };
  }
  const nodes = makeNodes(7);
  return { directed, nodes, edges: [...nodes.slice(1).map((node) => edge("A", node.id)), ...nodes.slice(1).map((node, index, outer) => edge(node.id, outer[(index + 1) % outer.length].id))] };
}

function layoutGraph(project: GraphProject, layout: GraphLayoutName): GraphProject["nodes"] {
  if (!project.nodes.length) return [];
  if (layout === "force") {
    const preview = forcePreview(project);
    const byId = new Map(preview.map((node) => [node.id, node]));
    return project.nodes.map((node) => {
      const next = byId.get(node.id);
      return { ...node, x: Math.max(45, Math.min(855, next?.x ?? node.x)), y: Math.max(45, Math.min(385, next?.y ?? node.y)) };
    });
  }
  if (layout === "layered") {
    return project.nodes.map((node, index) => ({ ...node, x: 90 + (index % 6) * 140, y: 100 + Math.floor(index / 6) * 135 }));
  }
  if (layout === "tree") {
    const levels = [1, 2, 4, 8];
    let cursor = 0;
    return project.nodes.map((node) => {
      let level = 0;
      let offset = cursor;
      let start = 0;
      for (const count of levels) {
        if (cursor < start + count) break;
        start += count;
        level += 1;
      }
      offset = cursor - start;
      const slots = levels[level] ?? Math.max(1, project.nodes.length - start);
      cursor += 1;
      return { ...node, x: 110 + ((offset + 1) * 680) / (slots + 1), y: 70 + level * 105 };
    });
  }
  const centerX = 450;
  const centerY = 215;
  const radius = Math.min(170, 48 + project.nodes.length * 18);
  return project.nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / project.nodes.length - Math.PI / 2;
    return { ...node, x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
  });
}

function isUsableGraphProject(project: GraphProject) {
  if (!project.nodes.length) return false;
  const ids = new Set(project.nodes.map((node) => node.id));
  return (
    project.nodes.every((node) => node.id && node.label && Number.isFinite(node.x) && Number.isFinite(node.y)) &&
    project.edges.every((edge) => edge.id && ids.has(edge.source) && ids.has(edge.target) && Number.isFinite(edge.weight))
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

function GraphRepresentationLab({ project }: { project: GraphProject }) {
  const [mode, setMode] = useState<"list" | "matrix" | "incidence">("list");
  const list = adjacencyList(project);
  const matrix = adjacencyMatrix(project);
  const incidence = incidenceMatrix(project);
  return (
    <SectionCard title="Representations Lab" description="Switch between adjacency list, adjacency matrix, and incidence matrix without leaving the graph.">
      <div className="mb-3 flex flex-wrap gap-2">
        {(["list", "matrix", "incidence"] as const).map((item) => (
          <button key={item} type="button" className={`tool-button ${mode === item ? "bg-cyan-500 text-white dark:bg-cyan-300 dark:text-slate-950" : ""}`} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </div>
      {mode === "list" ? (
        <div className="grid gap-2">
          {list.map((row) => <Metric key={row.id} label={row.id} value={row.neighbors.join(", ") || "isolated"} />)}
        </div>
      ) : (
        <MatrixTable
          rowLabels={mode === "matrix" ? matrix.ids : incidence.ids}
          columnLabels={mode === "matrix" ? matrix.ids : incidence.edgeIds}
          values={mode === "matrix" ? matrix.matrix : incidence.matrix}
        />
      )}
    </SectionCard>
  );
}

function ShortestPathLab({ project }: { project: GraphProject }) {
  const table = floydWarshall(project);
  const d = dijkstra(project);
  return (
    <SectionCard title="Shortest Path Table" description="Compare single-source Dijkstra distances with an all-pairs Floyd-Warshall table.">
      <div className="grid gap-3 lg:grid-cols-[.7fr_1.3fr]">
        <div className="space-y-2">
          {Object.entries(d.dist).map(([node, value]) => <Metric key={node} label={`A to ${node}`} value={Number.isFinite(value) ? String(value) : "unreachable"} />)}
        </div>
        <MatrixTable rowLabels={table.ids} columnLabels={table.ids} values={table.dist.map((row) => row.map((value) => Number.isFinite(value) ? value : "inf"))} />
      </div>
    </SectionCard>
  );
}

function GraphStructureLab({ project }: { project: GraphProject }) {
  const metrics = graphMetrics(project);
  const degrees = directedDegreeMap(project);
  return (
    <SectionCard title="Core Graph Concepts" description="Order, size, density, degree, regularity, completeness, and handshaking in one compact panel.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Order |V|" value={String(metrics.order)} />
        <Metric label="Size |E|" value={String(metrics.size)} />
        <Metric label="Density" value={`${Math.round(metrics.density * 100)}%`} />
        <Metric label="Regular graph" value={metrics.regular ? "yes" : "no"} />
        <Metric label="Complete graph" value={metrics.complete ? "yes" : "no"} />
        <Metric label="Isolated vertices" value={String(metrics.isolated)} />
      </div>
      <div className="mt-3 mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="px-2 py-1">Vertex</th><th className="px-2 py-1">in</th><th className="px-2 py-1">out</th><th className="px-2 py-1">degree</th></tr></thead>
          <tbody>{Array.from(degrees.entries()).map(([id, degree]) => <tr key={id} className="border-t border-slate-200 dark:border-white/10"><td className="px-2 py-1 font-black">{id}</td><td className="px-2 py-1">{degree.in}</td><td className="px-2 py-1">{degree.out}</td><td className="px-2 py-1">{degree.total}</td></tr>)}</tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function ConnectivityLab({ project }: { project: GraphProject }) {
  const components = cytoscapeMetrics(project).components;
  const cuts = bridgesAndCutVertices(project);
  return (
    <SectionCard title="Connectivity, Bridges, and Cut Vertices" description="Remove one edge or one vertex mentally and see whether the graph separates.">
      <div className="grid gap-2 sm:grid-cols-3">
        <Metric label="Components" value={String(components)} />
        <Metric label="Bridges" value={cuts.bridges.join(", ") || "none"} />
        <Metric label="Cut vertices" value={cuts.cutVertices.join(", ") || "none"} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">A bridge is an edge whose removal increases the number of components. A cut vertex does the same for a vertex.</p>
    </SectionCard>
  );
}

function DirectedGraphLab({ project }: { project: GraphProject }) {
  const directedProject = { ...project, directed: true };
  const topo = topologicalSort(directedProject);
  return (
    <SectionCard title="Directed Graphs and DAGs" description="Read indegree, outdegree, and a topological order when the directed graph has no cycle.">
      <Metric label="Topological order" value={topo.valid ? topo.order.join(" -> ") : "cycle detected"} />
      <div className="mt-3 space-y-2">
        {topo.steps.slice(0, 6).map((step) => <div key={step.note} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">{step.note}</div>)}
      </div>
    </SectionCard>
  );
}

function PathCycleLab({ project }: { project: GraphProject }) {
  const bfsSteps = bfs(project);
  const dfsSteps = dfs(project);
  const h = hamiltonianCycle(project);
  const e = eulerCircuitPath(project);
  return (
    <SectionCard title="Walks, Trails, Paths, and Cycles" description="Use traversal traces to distinguish repeated vertices, repeated edges, and cycle closure.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="BFS walk prefix" value={bfsSteps.slice(0, 4).map((step) => step.activeNodes.at(-1)).filter(Boolean).join(" -> ")} />
        <Metric label="DFS path prefix" value={dfsSteps.slice(0, 4).map((step) => step.activeNodes.at(-1)).filter(Boolean).join(" -> ")} />
        <Metric label="Euler trail/circuit" value={e.exists ? e.path.join(" -> ") : "not available"} />
        <Metric label="Hamilton cycle" value={h.exists ? h.path.join(" -> ") : "not available"} />
      </div>
    </SectionCard>
  );
}

function BipartiteMatchingLab({ project }: { project: GraphProject }) {
  const bipartite = isBipartite(project);
  const matching = maximumMatching(project);
  return (
    <SectionCard title="Bipartite and Matching Lab" description="Check two-color partitioning and find a maximum matching on the current graph.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Bipartite" value={bipartite.bipartite ? "yes" : "no"} />
        <Metric label="Conflicts" value={bipartite.conflicts.join(", ") || "none"} />
        <Metric label="Left set" value={bipartite.left.join(", ") || "none"} />
        <Metric label="Right set" value={bipartite.right.join(", ") || "none"} />
        <Metric label="Maximum matching" value={matching.join(", ") || "none"} />
      </div>
    </SectionCard>
  );
}

function CliqueIndependentLab({ project }: { project: GraphProject }) {
  const sets = cliqueAndIndependentSets(project);
  return (
    <SectionCard title="Clique and Independent Set Lab" description="Find a largest all-connected group and a largest no-internal-edge group.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Clique number lower bound" value={`${sets.clique.length}: ${sets.clique.join(", ") || "none"}`} />
        <Metric label="Independence number lower bound" value={`${sets.independent.length}: ${sets.independent.join(", ") || "none"}`} />
      </div>
    </SectionCard>
  );
}

function ComplementGraphLab({ project }: { project: GraphProject }) {
  const complement = complementGraph(project);
  return (
    <SectionCard title="Complement Graph Lab" description="Every absent edge in the original graph becomes an edge in the complement.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Original edges" value={String(project.edges.length)} />
        <Metric label="Complement edges" value={String(complement.edges.length)} />
      </div>
      <div className="mt-3 flex max-h-36 flex-wrap gap-2 overflow-auto pr-1 thin-scrollbar">
        {complement.edges.map((edge) => <span key={edge.id} className="mini-chip">{edge.source}-{edge.target}</span>)}
      </div>
    </SectionCard>
  );
}

function NetworkFlowLab({ project }: { project: GraphProject }) {
  const flow = maxFlowMinCut({ ...project, directed: true });
  return (
    <SectionCard title="Network Flow and Cut Lab" description="Treat edge weights as capacities. Find augmenting paths and the final source-side cut.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Source" value={flow.source || "none"} />
        <Metric label="Sink" value={flow.sink || "none"} />
        <Metric label="Max flow value" value={String(flow.value)} />
        <Metric label="Min-cut side" value={flow.cut.join(", ") || "none"} />
      </div>
      <div className="mt-3 grid gap-2">
        {flow.augmentingPaths.slice(0, 5).map((path, index) => (
          <div key={`${path.path.join("-")}-${index}`} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
            <span className="font-black">Path {index + 1}:</span> {path.path.join(" -> ")} with bottleneck {path.bottleneck}
          </div>
        ))}
        {!flow.augmentingPaths.length ? <p className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">No augmenting path from source to sink.</p> : null}
      </div>
      <Metric label="Cut edges" value={flow.cutEdges.join(", ") || "none"} />
    </SectionCard>
  );
}

function NetworkMetricsLab({ project }: { project: GraphProject }) {
  const distance = graphDistanceMetrics(project);
  const clustering = clusteringCoefficients(project);
  const girth = graphGirth(project);
  const finite = (value: number) => Number.isFinite(value) ? String(value) : "inf";
  return (
    <SectionCard title="Network Metrics Lab" description="Use radius, diameter, center, clustering, and girth to describe the shape of the network.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Radius" value={finite(distance.radius)} />
        <Metric label="Diameter" value={finite(distance.diameter)} />
        <Metric label="Center vertices" value={distance.center.join(", ") || "none"} />
        <Metric label="Girth" value={girth ? String(girth) : "acyclic"} />
        <Metric label="Average clustering" value={clustering.average.toFixed(2)} />
      </div>
      <div className="mt-3 mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="px-2 py-1">Vertex</th><th className="px-2 py-1">Eccentricity</th><th className="px-2 py-1">Clustering</th></tr></thead>
          <tbody>
            {project.nodes.map((node) => (
              <tr key={node.id} className="border-t border-slate-200 dark:border-white/10">
                <td className="px-2 py-1 font-black">{node.id}</td>
                <td className="px-2 py-1">{finite(distance.eccentricity[node.id])}</td>
                <td className="px-2 py-1">{(clustering.local[node.id] ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function PlanarityObstructionLab({ project }: { project: GraphProject }) {
  const obstruction = planarityObstructionHint(project);
  const crossings = edgeCrossings(project);
  return (
    <SectionCard title="Planarity Obstruction Lab" description="Compare drawn crossings with the classic K5 and K3,3 non-planar patterns.">
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Drawn crossings" value={crossings.length ? crossings.map((pair) => pair.join(" x ")).join(", ") : "none"} />
        <Metric label="Obstruction hint" value={obstruction.obstruction} />
      </div>
      <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-950 dark:bg-amber-300/10 dark:text-amber-100">{obstruction.note}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">A drawing with crossings may still be planar if it can be redrawn. K5 and K3,3 are stronger structural warnings.</p>
    </SectionCard>
  );
}

function GraphTheoryReference({ project }: { project: GraphProject }) {
  const metrics = graphMetrics(project);
  const euler = eulerCircuit(project);
  const bipartite = isBipartite(project);
  const coloring = chromaticNumber(project);
  const distance = graphDistanceMetrics(project);
  const rows = [
    ["Handshaking lemma", `sum deg(v) = ${metrics.degreeSum}`, metrics.degreeSum === 2 * metrics.size ? "verified" : "check graph"],
    ["Tree edge theorem", "|E| = |V| - 1 for trees", metrics.size === Math.max(0, metrics.order - 1) ? "edge count matches" : "not tree count"],
    ["Euler circuit theorem", "connected and all degrees even", euler ? "passes" : "does not pass"],
    ["Bipartite odd-cycle theorem", "bipartite iff no odd cycle", bipartite.bipartite ? "no conflict found" : "odd-cycle conflict likely"],
    ["Four-color idea", "planar graphs need <= 4 colors", coloring.colors <= 4 ? `${coloring.colors} colors here` : "needs more than 4 in solver"],
    ["Center theorem", "center minimizes eccentricity", `${distance.center.join(", ") || "none"} at radius ${Number.isFinite(distance.radius) ? distance.radius : "inf"}`],
  ];
  return (
    <SectionCard title="Theorem Checklist" description="A compact proof-reader for the current graph: what applies, what fails, and why.">
      <div className="mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="px-2 py-2">Theorem</th><th className="px-2 py-2">Statement cue</th><th className="px-2 py-2">Current graph</th></tr></thead>
          <tbody>
            {rows.map(([name, cue, status]) => (
              <tr key={name} className="border-t border-slate-200 dark:border-white/10">
                <td className="px-2 py-2 font-black">{name}</td>
                <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{cue}</td>
                <td className="px-2 py-2"><span className="mini-chip">{status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

function MatrixTable({ rowLabels, columnLabels, values }: { rowLabels: string[]; columnLabels: string[]; values: Array<Array<string | number>> }) {
  return (
    <div className="mobile-safe-scroll max-h-80 overflow-auto rounded-xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5">
      <table className="min-w-full text-center text-sm">
        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900">
          <tr>
            <th className="px-2 py-2 text-left"> </th>
            {columnLabels.map((label) => <th key={label} className="px-2 py-2 font-black">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {values.map((row, rowIndex) => (
            <tr key={rowLabels[rowIndex]} className="border-t border-slate-200 dark:border-white/10">
              <th className="sticky left-0 bg-white px-2 py-2 text-left font-black dark:bg-slate-950">{rowLabels[rowIndex]}</th>
              {row.map((value, columnIndex) => <td key={`${rowLabels[rowIndex]}-${columnLabels[columnIndex]}`} className="px-2 py-2 font-mono">{value}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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

async function togglePageFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  await document.documentElement.requestFullscreen();
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
