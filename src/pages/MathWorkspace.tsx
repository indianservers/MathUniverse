import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Circle, Download, Eraser, LineChart, Magnet, MousePointer2, Move, Pentagon, Plus, Presentation, RotateCcw, Save, Search, Slash, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import MathKeyboardInput from "../components/math-keyboard/MathKeyboardInput";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { roundTo } from "../utils/math";
import { symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicSimplify, symbolicSolve, trySymbolic } from "../utils/symbolic";

type ResultTableRow = { x: number; y: number; label?: string };
type ResultCard = { id: string; input: string; interpretation: string; result: string; detail?: string; steps?: string[]; table?: ResultTableRow[]; related?: string[] };
type PlotKind = "function" | "inequality" | "scatter" | "regression";
type PlotItem = { id: string; expression: string; color: string; kind?: PlotKind; points?: ResultTableRow[]; visible?: boolean };
type GeometryTool = "select" | "point" | "line" | "circle" | "polygon" | "parallel" | "perpendicular" | "midpoint" | "fixed-length" | "on-circle" | "intersect";
type GeoPoint = { id: string; x: number; y: number; label: string };
type GeoLine = { id: string; a: string; b: string };
type GeoCircle = { id: string; center: string; edge: string };
type GeoPolygon = { id: string; points: string[] };
type GeoConstraint =
  | { id: string; type: "parallel" | "perpendicular"; sourceLine: string; throughPoint: string; line: string }
  | { id: string; type: "midpoint"; a: string; b: string; point: string }
  | { id: string; type: "fixed-length"; anchor: string; point: string; length: number }
  | { id: string; type: "on-circle"; point: string; circle: string }
  | { id: string; type: "intersection"; first: string; second: string; point: string };
type Construction = { points: GeoPoint[]; lines: GeoLine[]; circles: GeoCircle[]; polygons: GeoPolygon[]; constraints: GeoConstraint[] };
type SurfaceKind = "paraboloid" | "saddle" | "wave" | "plane" | "ripple" | "cone-surface";
type SolidKind = "cube" | "sphere" | "cylinder" | "cone";
type WorkspaceSnapshot = {
  input: string;
  results: ResultCard[];
  plots: PlotItem[];
  construction: Construction;
  surface: SurfaceKind;
  solid: SolidKind;
  surfaceScale: number;
  height3d: number;
  crossSection: number;
  showSurface: boolean;
  showSolid: boolean;
  autoRotate3d: boolean;
  zoom3d: number;
};

const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#14b8a6"];
const regressionSeed: ResultTableRow[] = [{ x: -4, y: -5.6 }, { x: -2, y: -2.2 }, { x: 0, y: 0.7 }, { x: 2, y: 4.1 }, { x: 4, y: 7.4 }];
const initialConstruction: Construction = { points: [], lines: [], circles: [], polygons: [], constraints: [] };
const examples = ["plot sin(x)", "solve x^2-5*x+6=0", "factor x^2-5*x+6", "derivative x^3-2*x", "integral 3*x^2", "table sin(x)", "roots x^2-4", "extrema x^2-4*x+1", "intersect x^2 and 2*x+3"];
const guidedExamples = [
  { title: "Quadratic Roots", command: "solve x^2-5*x+6=0" },
  { title: "Derivative Check", command: "derivative x^3-2*x" },
  { title: "Function Table", command: "table sin(x)" },
  { title: "Intersections", command: "intersect x^2 and 2*x+3" },
];
const formulaLibrary = [
  { topic: "Algebra", title: "Quadratic Formula", formula: "x = (-b +/- sqrt(b^2-4ac))/(2a)", command: "solve x^2-5*x+6=0" },
  { topic: "Calculus", title: "Power Rule", formula: "d/dx x^n = n*x^(n-1)", command: "derivative x^4" },
  { topic: "Calculus", title: "Power Integral", formula: "integral x^n dx = x^(n+1)/(n+1) + C", command: "integral 3*x^2" },
  { topic: "Graphing", title: "Intersection", formula: "f(x)=g(x) means f(x)-g(x)=0", command: "intersect x^2 and 2*x+3" },
  { topic: "Geometry", title: "Circle Area", formula: "A = pi r^2", command: "area circle radius 5" },
  { topic: "3D", title: "Paraboloid", formula: "z = k(x^2+y^2)", command: "plot x^2" },
];

export default function MathWorkspace() {
  const [input, setInput] = useState("plot sin(x)");
  const [results, setResults] = useState<ResultCard[]>([]);
  const [plots, setPlots] = useState<PlotItem[]>([{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }]);
  const [tool, setTool] = useState<GeometryTool>("select");
  const [construction, setConstruction] = useState<Construction>(initialConstruction);
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [dragPointId, setDragPointId] = useState<string | null>(null);
  const [polygonDraft, setPolygonDraft] = useState<string[]>([]);
  const [surface, setSurface] = useState<SurfaceKind>("paraboloid");
  const [solid, setSolid] = useState<SolidKind>("cube");
  const [surfaceScale, setSurfaceScale] = useState(1);
  const [height3d, setHeight3d] = useState(2.5);
  const [crossSection, setCrossSection] = useState(0);
  const [showSurface, setShowSurface] = useState(true);
  const [showSolid, setShowSolid] = useState(true);
  const [autoRotate3d, setAutoRotate3d] = useState(true);
  const [zoom3d, setZoom3d] = useState(1);
  const [formulaSearch, setFormulaSearch] = useState("");
  const [teachingMode, setTeachingMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const graphExportRef = useRef<HTMLDivElement>(null);
  const geometryExportRef = useRef<SVGSVGElement | null>(null);

  const filteredFormulas = useMemo(() => {
    const query = formulaSearch.trim().toLowerCase();
    return formulaLibrary.filter((item) => !query || [item.topic, item.title, item.formula].join(" ").toLowerCase().includes(query));
  }, [formulaSearch]);

  const runInput = () => {
    const raw = input.trim();
    if (!raw) return;
    const analysis = interpretInput(raw);
    setResults((current) => [analysis, ...current].slice(0, 12));
    if (analysis.interpretation === "2D plot") {
      const expression = normalizePlotExpression(raw);
      setPlots((current) => [{ id: crypto.randomUUID(), expression, color: colors[current.length % colors.length], kind: inferPlotKind(expression), visible: true }, ...current].slice(0, 8));
    }
  };

  const addPoint = (x: number, y: number) => {
    const id = crypto.randomUUID();
    const point: GeoPoint = { id, x, y, label: String.fromCharCode(65 + construction.points.length) };
    setConstruction((current) => solveConstruction({ ...current, points: [...current.points, point] }));
    return id;
  };

  const handleBoardPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    if (event.pointerType === "touch") event.preventDefault();
    const target = event.target as Element;
    const pointId = target.getAttribute("data-point-id");
    if (pointId) {
      if (tool === "select") setDragPointId(pointId);
      else handlePointPick(pointId);
      return;
    }
    if (tool !== "point") return;
    const point = clientToBoard(event);
    if (point) addPoint(point.x, point.y);
  };

  const handlePointPick = (pointId: string) => {
    if (tool === "line") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        setConstruction((current) => ({ ...current, lines: [...current.lines, { id: crypto.randomUUID(), a: next[0], b: next[1] }] }));
        setSelectedPointIds([]);
      }
    }
    if (tool === "circle") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        setConstruction((current) => ({ ...current, circles: [...current.circles, { id: crypto.randomUUID(), center: next[0], edge: next[1] }] }));
        setSelectedPointIds([]);
      }
    }
    if (tool === "polygon") {
      const next = polygonDraft.includes(pointId) ? polygonDraft : [...polygonDraft, pointId];
      if (next.length >= 3) {
        setConstruction((current) => solveConstruction({ ...current, polygons: [...current.polygons, { id: crypto.randomUUID(), points: next }] }));
        setPolygonDraft([]);
      } else setPolygonDraft(next);
    }
    if (tool === "parallel" || tool === "perpendicular") {
      const next = [...selectedPointIds, pointId].slice(-3);
      setSelectedPointIds(next);
      if (next.length === 3 && next[0] !== next[1] && next[2] !== next[0] && next[2] !== next[1]) {
        setConstruction((current) => addParallelPerpendicularConstraint(current, tool, next[0], next[1], next[2]));
        setSelectedPointIds([]);
      }
    }
    if (tool === "midpoint" || tool === "fixed-length") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        setConstruction((current) => tool === "midpoint" ? addMidpointConstraint(current, next[0], next[1]) : addFixedLengthConstraint(current, next[0], next[1]));
        setSelectedPointIds([]);
      }
    }
    if (tool === "on-circle") {
      setConstruction((current) => addPointOnCircleConstraint(current, pointId));
      setSelectedPointIds([]);
    }
    if (tool === "intersect") {
      setConstruction((current) => addIntersectionConstraint(current));
      setSelectedPointIds([]);
    }
  };

  const handleBoardPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragPointId) return;
    if (event.pointerType === "touch") event.preventDefault();
    const point = clientToBoard(event);
    if (!point) return;
    setConstruction((current) => solveConstruction({
      ...current,
      points: current.points.map((item) => item.id === dragPointId ? { ...item, x: point.x, y: point.y } : item),
    }, dragPointId));
  };

  const clientToBoard = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 640,
      y: ((event.clientY - rect.top) / rect.height) * 420,
    };
  };

  const undoConstruction = () => {
    setConstruction((current) => {
      if (current.polygons.length) return { ...current, polygons: current.polygons.slice(0, -1) };
      if (current.circles.length) return { ...current, circles: current.circles.slice(0, -1) };
      if (current.lines.length) return { ...current, lines: current.lines.slice(0, -1) };
      if (current.points.length) return { ...current, points: current.points.slice(0, -1) };
      return current;
    });
  };

  const saveConstruction = () => localStorage.setItem("math-universe-workspace-construction", JSON.stringify(construction));
  const loadConstruction = () => {
    const saved = localStorage.getItem("math-universe-workspace-construction");
    if (saved) setConstruction(normalizeConstruction(JSON.parse(saved) as Partial<Construction>));
  };
  const snapshot = (): WorkspaceSnapshot => ({ input, results, plots, construction, surface, solid, surfaceScale, height3d, crossSection, showSurface, showSolid, autoRotate3d, zoom3d });
  const saveWorkspace = () => localStorage.setItem("math-universe-workspace-full", JSON.stringify(snapshot()));
  const loadWorkspace = () => {
    const saved = localStorage.getItem("math-universe-workspace-full");
    if (!saved) return;
    const data = JSON.parse(saved) as WorkspaceSnapshot;
    setInput(data.input);
    setResults(data.results ?? []);
    setPlots(data.plots ?? []);
    setConstruction(normalizeConstruction(data.construction ?? initialConstruction));
    setSurface(data.surface ?? "paraboloid");
    setSolid(data.solid ?? "cube");
    setSurfaceScale(data.surfaceScale ?? 1);
    setHeight3d(data.height3d ?? 2.5);
    setCrossSection(data.crossSection ?? 0);
    setShowSurface(data.showSurface ?? true);
    setShowSolid(data.showSolid ?? true);
    setAutoRotate3d(data.autoRotate3d ?? true);
    setZoom3d(data.zoom3d ?? 1);
  };
  const exportWorkspaceJson = () => downloadText("math-workspace.json", JSON.stringify(snapshot(), null, 2), "application/json");
  const exportResultsCsv = () => downloadText("math-workspace-results.csv", resultsToCsv(results), "text/csv");
  const exportGeometrySvg = () => {
    const svg = geometryExportRef.current;
    if (!svg) return;
    downloadText("geometry-construction.svg", svg.outerHTML, "image/svg+xml");
  };
  const runGuidedExample = (command: string) => {
    setInput(command);
    const analysis = interpretInput(command);
    setResults((current) => [analysis, ...current].slice(0, 12));
    if (analysis.interpretation === "2D plot") {
      const expression = normalizePlotExpression(command);
      setPlots((current) => [{ id: crypto.randomUUID(), expression, color: colors[current.length % colors.length], kind: inferPlotKind(expression), visible: true }, ...current].slice(0, 8));
    }
  };
  const handleWorkspaceKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveWorkspace();
    }
    if (event.key.toLowerCase() === "o") {
      event.preventDefault();
      loadWorkspace();
    }
    if (event.key.toLowerCase() === "enter") {
      event.preventDefault();
      runInput();
    }
  };

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden" onKeyDown={handleWorkspaceKeyDown}>
      <TopicHeader title="Math Workspace" subtitle="A GeoGebra and Wolfram-style workspace for graphing, commands, results, and geometric construction." difficulty="All levels" estimatedMinutes={45} />

      <SectionCard title="Stage 5: Workspace Tools" description="Save, export, teach, search formulas, and launch guided examples. Shortcuts: Ctrl+S save, Ctrl+O load, Ctrl+Enter run.">
        <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={saveWorkspace} className="action-secondary"><Save className="h-4 w-4" />Save workspace</button>
              <button type="button" onClick={loadWorkspace} className="action-secondary"><Download className="h-4 w-4" />Load workspace</button>
              <button type="button" onClick={exportWorkspaceJson} className="action-secondary"><Download className="h-4 w-4" />Export JSON</button>
              <button type="button" onClick={exportResultsCsv} className="action-secondary"><Download className="h-4 w-4" />Export CSV</button>
              <button type="button" onClick={exportGeometrySvg} className="action-secondary"><Download className="h-4 w-4" />Export geometry SVG</button>
              <button type="button" onClick={() => setTeachingMode((value) => !value)} className={teachingMode ? "action-primary" : "action-secondary"}><Presentation className="h-4 w-4" />Teaching mode</button>
            </div>
            {teachingMode && (
              <div className="rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-50">
                <p className="font-bold">Teaching mode is active</p>
                <p>Use guided examples, keep result steps visible, and export the construction or results after the demo.</p>
              </div>
            )}
            <div>
              <h3 className="font-bold">Guided Examples</h3>
              <div className="mt-3 grid min-w-0 gap-2 md:grid-cols-2">
                {guidedExamples.map((example) => <button key={example.title} type="button" onClick={() => runGuidedExample(example.command)} className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-left transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"><p className="font-semibold">{example.title}</p><p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">{example.command}</p></button>)}
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4 text-cyan-500" />Formula Library</span>
              <input value={formulaSearch} onChange={(event) => setFormulaSearch(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950" placeholder="Search formula, topic, command..." />
            </label>
            <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {filteredFormulas.map((item) => (
                <button key={item.title} type="button" onClick={() => setInput(item.command)} className="w-full rounded-2xl bg-slate-100 p-3 text-left transition hover:bg-cyan-100 dark:bg-white/10 dark:hover:bg-cyan-300/15">
                  <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{item.topic}</p>
                  <p className="mt-1 font-semibold">{item.title}</p>
                  <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">{item.formula}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Stage 1 + 3: Unified Math Input and CAS Answers" description="Type a calculation or command such as plot, solve, factor, derivative, integral, table, roots, extrema, or intersection.">
        <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4">
            <MathKeyboardInput
              value={input}
              onChange={setInput}
              onSubmit={runInput}
              label="Workspace command keyboard"
              placeholder="plot sin(x), solve x^2-5*x+6=0, derivative x^3"
              mode="command"
              examples={examples}
              onExample={setInput}
            />
            <div ref={graphExportRef} className="min-w-0">
              <GraphPanel plots={plots} onChange={setPlots} />
            </div>
          </div>
          <div className="min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Results</h2>
              <button type="button" onClick={() => setResults([])} className="rounded-full bg-slate-100 p-2 dark:bg-white/10" title="Clear results" aria-label="Clear results"><Trash2 className="h-4 w-4" /></button>
            </div>
            {results.length === 0 ? <EmptyPanel text="Run a command to see interpretation, exact result, numeric checks, and related output." /> : results.map((result) => <ResultCardView key={result.id} result={result} />)}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Stage 4: 3D Graphing and Solids Lab" description="Explore 3D axes, points, vectors, planes, surfaces, solids, cross-sections, and camera controls.">
        <div className="grid min-w-0 gap-5 2xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="min-w-0 space-y-4">
            <label className="block rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <span className="text-sm font-semibold">Surface</span>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={surface} onChange={(event) => setSurface(event.target.value as SurfaceKind)}>
                <option value="paraboloid">z = scale(x^2 + y^2)</option>
                <option value="saddle">z = scale(x^2 - y^2)</option>
                <option value="wave">z = scale sin(x) cos(y)</option>
                <option value="plane">z = scale(x + y)</option>
                <option value="ripple">z = scale sin(x^2+y^2)</option>
                <option value="cone-surface">z = scale sqrt(x^2+y^2)</option>
              </select>
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <span className="text-sm font-semibold">Solid</span>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={solid} onChange={(event) => setSolid(event.target.value as SolidKind)}>
                <option value="cube">Cube</option>
                <option value="sphere">Sphere</option>
                <option value="cylinder">Cylinder</option>
                <option value="cone">Cone</option>
              </select>
            </label>
            <SliderControl label="Surface scale" value={surfaceScale} min={0.2} max={2.5} step={0.1} onChange={setSurfaceScale} />
            <SliderControl label="Solid height / radius" value={height3d} min={0.8} max={5} step={0.1} onChange={setHeight3d} />
            <SliderControl label="Cross-section z" value={crossSection} min={-3} max={3} step={0.1} onChange={setCrossSection} />
            <div className="grid grid-cols-2 gap-2">
              <Toggle checked={showSurface} label="Surface" onChange={setShowSurface} />
              <Toggle checked={showSolid} label="Solid" onChange={setShowSolid} />
              <Toggle checked={autoRotate3d} label="Auto rotate" onChange={setAutoRotate3d} />
              <button type="button" onClick={() => { setZoom3d(1); setSurfaceScale(1); setCrossSection(0); }} className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold dark:bg-white/10">Reset</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setZoom3d((value) => Math.max(0.6, roundTo(value - 0.1, 2)))} className="action-secondary"><ZoomOut className="h-4 w-4" />Zoom out</button>
              <button type="button" onClick={() => setZoom3d((value) => Math.min(1.8, roundTo(value + 0.1, 2)))} className="action-secondary"><ZoomIn className="h-4 w-4" />Zoom in</button>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">3D Readout</p>
              <p>Surface: {surfaceFormula(surface, surfaceScale)}</p>
              <p>Cross-section plane: z = {roundTo(crossSection, 2)}</p>
              <p>Camera zoom: {roundTo(zoom3d * 100, 0)}%</p>
            </div>
          </div>

          <div className="min-w-0 space-y-3 overflow-hidden">
            <ThreeSceneWrapper height="560px" mobileHeight="min(70vh, 420px)" interactionLabel="Drag rotate • pinch zoom">
              <ambientLight intensity={0.75} />
              <directionalLight position={[5, 6, 4]} intensity={1.2} />
              <Workspace3DScene surface={surface} solid={solid} surfaceScale={surfaceScale} solidSize={height3d} crossSection={crossSection} showSurface={showSurface} showSolid={showSolid} autoRotate={autoRotate3d} zoom={zoom3d} />
              <OrbitControls enablePan enableZoom enableDamping />
            </ThreeSceneWrapper>
            <div className="grid gap-3 md:grid-cols-3">
              <InfoPill title="Axes" text="X, Y, and Z directions are shown with colored vectors." />
              <InfoPill title="Surface" text="The mesh updates from the selected z=f(x,y) function." />
              <InfoPill title="Cross-section" text="The amber plane slices the surface at a chosen z-level." />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Stage 2: Geometry Constructor" description="Create points, lines, circles, polygons, drag points, and inspect live measurements.">
        <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-3">
            <div className="mobile-safe-scroll flex gap-2 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <ToolButton active={tool === "select"} label="Select / Drag" onClick={() => setTool("select")} icon={<MousePointer2 className="h-4 w-4" />} />
              <ToolButton active={tool === "point"} label="Point" onClick={() => setTool("point")} icon={<Plus className="h-4 w-4" />} />
              <ToolButton active={tool === "line"} label="Line" onClick={() => setTool("line")} icon={<Move className="h-4 w-4" />} />
              <ToolButton active={tool === "circle"} label="Circle" onClick={() => setTool("circle")} icon={<Circle className="h-4 w-4" />} />
              <ToolButton active={tool === "polygon"} label="Polygon" onClick={() => setTool("polygon")} icon={<Pentagon className="h-4 w-4" />} />
              <ToolButton active={tool === "parallel"} label="Parallel" onClick={() => setTool("parallel")} icon={<Slash className="h-4 w-4" />} />
              <ToolButton active={tool === "perpendicular"} label="Perpendicular" onClick={() => setTool("perpendicular")} icon={<Plus className="h-4 w-4" />} />
              <ToolButton active={tool === "midpoint"} label="Midpoint" onClick={() => setTool("midpoint")} icon={<Magnet className="h-4 w-4" />} />
              <ToolButton active={tool === "fixed-length"} label="Fixed Length" onClick={() => setTool("fixed-length")} icon={<Magnet className="h-4 w-4" />} />
              <ToolButton active={tool === "on-circle"} label="Point on Circle" onClick={() => setTool("on-circle")} icon={<Circle className="h-4 w-4" />} />
              <ToolButton active={tool === "intersect"} label="Intersect" onClick={() => setTool("intersect")} icon={<Plus className="h-4 w-4" />} />
              <ToolButton label="Undo" onClick={undoConstruction} icon={<RotateCcw className="h-4 w-4" />} />
              <ToolButton label="Reset" onClick={() => { setConstruction(initialConstruction); setSelectedPointIds([]); setPolygonDraft([]); }} icon={<Eraser className="h-4 w-4" />} />
              <ToolButton label="Save" onClick={saveConstruction} icon={<Save className="h-4 w-4" />} />
              <ToolButton label="Load" onClick={loadConstruction} icon={<Download className="h-4 w-4" />} />
            </div>
            <svg
              ref={svgRef}
              data-export="geometry"
              viewBox="0 0 640 420"
              onPointerDown={handleBoardPointerDown}
              onPointerMove={handleBoardPointerMove}
              onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragPointId(null); }}
              onPointerLeave={() => setDragPointId(null)}
              className="h-[min(420px,68vh)] min-h-[300px] w-full max-w-full touch-none rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 sm:h-[420px]"
            >
              <title>Math Universe Geometry Construction</title>
              <GeometryGrid />
              <ConstraintOverlays construction={construction} />
              {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} />)}
              {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} />)}
              {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} />)}
              {polygonDraft.length > 1 && <polyline points={polygonDraft.map((id) => pointById(construction.points, id)).filter(Boolean).map((point) => `${point!.x},${point!.y}`).join(" ")} fill="none" stroke="#f59e0b" strokeDasharray="8 6" strokeWidth="3" />}
              {construction.points.map((point) => (
                <g key={point.id}>
                  <circle data-point-id={point.id} cx={point.x} cy={point.y} r="9" fill={selectedPointIds.includes(point.id) || polygonDraft.includes(point.id) ? "#f59e0b" : "#06b6d4"} stroke="#0f172a" strokeWidth="2" className="cursor-pointer" />
                  <text x={point.x + 12} y={point.y - 10} fill="#0f172a" className="select-none text-xs font-bold dark:fill-slate-100">{point.label}</text>
                </g>
              ))}
            </svg>
            <p className="rounded-2xl bg-cyan-50 p-3 text-xs font-semibold leading-5 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
              Touch mode: choose a tool, tap to place points, then drag existing points. Use the page outside the board to scroll.
            </p>
            <HiddenGeometryExport refSetter={(node) => { geometryExportRef.current = node; }} construction={construction} />
          </div>
          <div className="min-w-0 space-y-3">
            <ConstructionHelp tool={tool} />
            <Measurements construction={construction} />
            <ConstraintPanel construction={construction} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function interpretInput(input: string): ResultCard {
  const normalized = input.trim();
  try {
    if (/^plot\s+/i.test(normalized)) {
      const expression = normalizePlotExpression(normalized);
      return { id: crypto.randomUUID(), input, interpretation: "2D plot", result: `Added y = ${expression}`, detail: "The expression is plotted over x from -10 to 10." };
    }
    if (/^solve\s+/i.test(normalized)) return solveCommand(normalized.replace(/^solve\s+/i, ""), input);
    if (/^roots\s+/i.test(normalized)) return rootsCommand(normalized.replace(/^roots\s+/i, ""), input);
    if (/^extrema\s+/i.test(normalized)) return extremaCommand(normalized.replace(/^extrema\s+/i, ""), input);
    if (/^intersect\s+/i.test(normalized)) return intersectCommand(normalized.replace(/^intersect\s+/i, ""), input);
    if (/^table\s+/i.test(normalized)) return tableCommand(normalized.replace(/^table\s+/i, ""), input);
    if (/^simplify\s+/i.test(normalized)) return simplifyCommand(normalized.replace(/^simplify\s+/i, ""), input);
    if (/^expand\s+/i.test(normalized)) return expandCommand(normalized.replace(/^expand\s+/i, ""), input);
    if (/^derivative\s+/i.test(normalized)) {
      const expression = normalized.replace(/^derivative\s+/i, "");
      const symbolic = trySymbolic(() => symbolicDerivative(expression));
      const derivative = symbolic?.result ?? derivativeText(expression);
      return { id: crypto.randomUUID(), input, interpretation: symbolic ? "Symbolic derivative" : "Derivative", result: derivative, detail: symbolic?.detail ?? "Symbolic support for common polynomial, sine, and cosine expressions.", steps: symbolic?.steps ?? derivativeSteps(expression, derivative), related: [`plot ${expression}`, `plot ${derivative}`] };
    }
    if (/^integral\s+/i.test(normalized)) {
      const expression = normalized.replace(/^integral\s+/i, "");
      const symbolic = trySymbolic(() => symbolicIntegral(expression));
      const integral = symbolic?.result ?? integralText(expression);
      return { id: crypto.randomUUID(), input, interpretation: symbolic ? "Symbolic integral" : "Indefinite integral", result: integral, detail: symbolic?.detail ?? "Power-rule antiderivative support for common polynomial terms.", steps: symbolic?.steps ?? integralSteps(expression, integral), related: [`derivative ${integral.replace(/\s*\+\s*C$/, "")}`] };
    }
    if (/^factor\s+/i.test(normalized)) return factorCommand(normalized.replace(/^factor\s+/i, ""), input);
    if (/^area\s+circle\s+radius\s+/i.test(normalized)) {
      const radius = Number(normalized.replace(/^area\s+circle\s+radius\s+/i, ""));
      return { id: crypto.randomUUID(), input, interpretation: "Circle area", result: `Area = ${roundTo(Math.PI * radius * radius, 4)}`, detail: `Formula: A = pi r^2 with r = ${radius}.`, steps: [`Use A = pi r^2.`, `Substitute r = ${radius}.`, `A = pi * ${radius}^2 = ${roundTo(Math.PI * radius * radius, 4)}.`] };
    }
    const value = evaluateMathExpression(normalized, 0);
    return { id: crypto.randomUUID(), input, interpretation: "Calculator", result: `${roundTo(value, 10)}`, detail: "Numeric evaluation with constants, trig, logs, powers, roots, and arithmetic." };
  } catch (error) {
    return { id: crypto.randomUUID(), input, interpretation: "Could not compute", result: error instanceof Error ? error.message : "Unsupported input", detail: "Try examples like plot sin(x), solve x^2-5*x+6=0, derivative x^3, or area circle radius 5." };
  }
}

function normalizePlotExpression(input: string) {
  return input.replace(/^plot\s+/i, "").replace(/^y\s*=\s*/i, "").trim();
}

function evaluateMathExpression(expression: string, x: number) {
  const safe = expression
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsin\b/gi, "Math.sin")
    .replace(/\bcos\b/gi, "Math.cos")
    .replace(/\btan\b/gi, "Math.tan")
    .replace(/\basin\b/gi, "Math.asin")
    .replace(/\bacos\b/gi, "Math.acos")
    .replace(/\batan\b/gi, "Math.atan")
    .replace(/\bsqrt\b/gi, "Math.sqrt")
    .replace(/\bcbrt\b/gi, "Math.cbrt")
    .replace(/\babs\b/gi, "Math.abs")
    .replace(/\bln\b/gi, "Math.log")
    .replace(/\blog\b/gi, "Math.log10")
    .replace(/\bexp\b/gi, "Math.exp");
  if (!/^[0-9x+\-*/().,\s*MATHPIEabceghilnopqrstxyz]+$/i.test(safe) || /[;={}'"]/.test(safe) || safe.includes("[") || safe.includes("]")) throw new Error("Unsupported expression");
  return Function("x", `"use strict"; return (${safe});`)(x) as number;
}

function solveCommand(equation: string, input: string): ResultCard {
  const [left, right = "0"] = equation.split("=");
  const symbolic = trySymbolic(() => symbolicSolve(equation.includes("=") ? equation : `${equation}=0`));
  const f = (x: number) => evaluateMathExpression(left, x) - evaluateMathExpression(right, x);
  const roots: number[] = [];
  for (let x = -50; x < 50; x += 0.25) {
    const y1 = f(x);
    const y2 = f(x + 0.25);
    if (Math.abs(y1) < 1e-6) roots.push(x);
    if (Number.isFinite(y1) && Number.isFinite(y2) && y1 * y2 < 0) roots.push(bisect(f, x, x + 0.25));
  }
  const unique = Array.from(new Set(roots.map((root) => roundTo(root, 5)))).slice(0, 8);
  const quadratic = parseQuadratic(`${left}-(${right})`);
  if (symbolic) return { id: crypto.randomUUID(), input, interpretation: "Symbolic equation solve", result: symbolic.result, detail: symbolic.detail, steps: [...symbolic.steps, unique.length ? `Numeric verification: x ≈ ${unique.join(", ")}.` : "Numeric scan did not find additional real roots in [-50, 50]."], related: [`plot ${left}-(${right})`, `roots ${left}-(${right})`] };
  return { id: crypto.randomUUID(), input, interpretation: "Equation solve", result: unique.length ? `x = ${unique.join(", ")}` : "No real roots found in [-50, 50]", detail: "Numeric sign-change solver over a bounded interval.", steps: quadratic ? quadraticSteps(quadratic.a, quadratic.b, quadratic.c) : [`Move all terms to one side: ${left} - (${right}) = 0.`, "Scan the graph for sign changes.", "Refine each sign change with bisection."], related: [`plot ${left}-(${right})`, `roots ${left}-(${right})`] };
}

function factorCommand(expression: string, input: string): ResultCard {
  const symbolic = trySymbolic(() => symbolicFactor(expression));
  if (symbolic) return { id: crypto.randomUUID(), input, interpretation: "Symbolic factor", result: symbolic.result, detail: symbolic.detail, steps: symbolic.steps, related: [`expand ${symbolic.result}`, `solve ${expression}=0`, `plot ${expression}`] };
  const quadratic = parseQuadratic(expression);
  if (!quadratic) return { id: crypto.randomUUID(), input, interpretation: "Factor", result: "Factoring currently supports quadratics like x^2-5*x+6.", detail: "Try expand, solve, roots, table, or plot for non-quadratic expressions." };
  const roots = quadraticRoots(quadratic.a, quadratic.b, quadratic.c);
  if (!roots) return { id: crypto.randomUUID(), input, interpretation: "Factor", result: "No real linear factorization", detail: "The discriminant is negative, so real linear factors are unavailable.", steps: quadraticSteps(quadratic.a, quadratic.b, quadratic.c) };
  const [r1, r2] = roots;
  const factor = quadratic.a === 1 ? `(x ${signed(-r1)}) (x ${signed(-r2)})` : `${quadratic.a}(x ${signed(-r1)}) (x ${signed(-r2)})`;
  return { id: crypto.randomUUID(), input, interpretation: "Factor", result: factor, detail: "Quadratic factorization from computed roots.", steps: [`Identify a=${quadratic.a}, b=${quadratic.b}, c=${quadratic.c}.`, `Find roots: x=${roundTo(r1, 5)} and x=${roundTo(r2, 5)}.`, `Build factors from roots: (x-r1)(x-r2).`], related: [`solve ${expression}=0`, `plot ${expression}`] };
}

function rootsCommand(expression: string, input: string): ResultCard {
  return solveCommand(`${expression}=0`, input);
}

function extremaCommand(expression: string, input: string): ResultCard {
  const candidates: { x: number; y: number }[] = [];
  let previousX = -10;
  let previousSlope = numericDerivative(expression, previousX);
  for (let x = -9.95; x <= 10; x += 0.05) {
    const slope = numericDerivative(expression, x);
    if (Number.isFinite(slope) && Number.isFinite(previousSlope) && slope * previousSlope < 0) {
      const root = bisect((value) => numericDerivative(expression, value), previousX, x);
      candidates.push({ x: roundTo(root, 4), y: roundTo(evaluateMathExpression(expression, root), 4) });
    }
    previousX = x;
    previousSlope = slope;
  }
  const unique = candidates.filter((point, index) => candidates.findIndex((candidate) => Math.abs(candidate.x - point.x) < 0.02) === index).slice(0, 8);
  return { id: crypto.randomUUID(), input, interpretation: "Extrema", result: unique.length ? unique.map((point) => `(${point.x}, ${point.y})`).join(", ") : "No local extrema found in [-10, 10]", detail: "Numeric derivative sign-change search.", steps: ["Approximate f'(x) with a centered difference.", "Find where f'(x) changes sign.", "Evaluate f(x) at those candidate x-values."], table: unique };
}

function intersectCommand(body: string, input: string): ResultCard {
  const parts = body.split(/\s+and\s+|,/i).map((part) => part.trim()).filter(Boolean);
  if (parts.length !== 2) throw new Error("Use: intersect expression1 and expression2");
  const [left, right] = parts;
  const f = (x: number) => evaluateMathExpression(left, x) - evaluateMathExpression(right, x);
  const intersections: ResultTableRow[] = [];
  for (let x = -20; x < 20; x += 0.1) {
    const y1 = f(x);
    const y2 = f(x + 0.1);
    if (Number.isFinite(y1) && Number.isFinite(y2) && y1 * y2 < 0) {
      const root = bisect(f, x, x + 0.1);
      intersections.push({ x: roundTo(root, 4), y: roundTo(evaluateMathExpression(left, root), 4) });
    }
  }
  const unique = intersections.filter((point, index) => intersections.findIndex((candidate) => Math.abs(candidate.x - point.x) < 0.02) === index).slice(0, 8);
  return { id: crypto.randomUUID(), input, interpretation: "Intersection", result: unique.length ? unique.map((point) => `(${point.x}, ${point.y})`).join(", ") : "No intersections found in [-20, 20]", detail: "Solves expression1 - expression2 = 0 numerically.", steps: [`Set ${left} = ${right}.`, `Solve ${left} - (${right}) = 0.`, "Evaluate either expression at each solution."], table: unique, related: [`plot ${left}`, `plot ${right}`] };
}

function tableCommand(expression: string, input: string): ResultCard {
  const table = Array.from({ length: 9 }, (_, index) => {
    const x = index - 4;
    return { x, y: roundTo(evaluateMathExpression(expression, x), 5) };
  });
  return { id: crypto.randomUUID(), input, interpretation: "Value table", result: `Generated ${table.length} rows`, detail: "Integer x-values from -4 to 4.", table, related: [`plot ${expression}`] };
}

function simplifyCommand(expression: string, input: string): ResultCard {
  const symbolic = trySymbolic(() => symbolicSimplify(expression));
  if (symbolic) return { id: crypto.randomUUID(), input, interpretation: "Symbolic simplify", result: symbolic.result, detail: symbolic.detail, steps: symbolic.steps };
  const compact = expression.replace(/\s+/g, "");
  const polynomial = parsePolynomial(compact);
  if (polynomial) {
    const result = polynomialToText(polynomial);
    return { id: crypto.randomUUID(), input, interpretation: "Simplify", result, detail: "Combined like polynomial terms.", steps: ["Group terms by matching powers of x.", "Add coefficients for each power.", "Rewrite terms from highest power to constant."] };
  }
  const value = evaluateMathExpression(expression, 0);
  return { id: crypto.randomUUID(), input, interpretation: "Simplify", result: `${roundTo(value, 10)}`, detail: "Numeric simplification." };
}

function expandCommand(expression: string, input: string): ResultCard {
  const symbolic = trySymbolic(() => symbolicExpand(expression));
  if (symbolic) return { id: crypto.randomUUID(), input, interpretation: "Symbolic expand", result: symbolic.result, detail: symbolic.detail, steps: symbolic.steps, related: [`factor ${symbolic.result}`] };
  const match = expression.replace(/\s+/g, "").match(/^\(x([+-]\d+(?:\.\d+)?)\)\(x([+-]\d+(?:\.\d+)?)\)$/);
  if (!match) return { id: crypto.randomUUID(), input, interpretation: "Expand", result: "Expansion currently supports forms like (x+2)(x+3).", detail: "Try: expand (x+2)(x+3)" };
  const a = Number(match[1]);
  const b = Number(match[2]);
  const result = `x^2 ${signed(a + b)}*x ${signed(a * b)}`;
  return { id: crypto.randomUUID(), input, interpretation: "Expand", result, steps: [`Use (x+a)(x+b)=x^2+(a+b)x+ab.`, `a=${a}, b=${b}.`, `a+b=${roundTo(a + b, 4)}, ab=${roundTo(a * b, 4)}.`], related: [`factor ${result}`] };
}

function derivativeText(expression: string) {
  const compact = expression.replace(/\s+/g, "");
  if (compact === "sin(x)") return "cos(x)";
  if (compact === "cos(x)") return "-sin(x)";
  if (compact === "x") return "1";
  const terms = compact.replace(/-/g, "+-").split("+").filter(Boolean);
  const derived = terms.map((term) => {
    const power = term.match(/^(-?\d*\.?\d*)?\*?x\^(\d+)$/);
    if (power) {
      const coeff = power[1] === "" || power[1] === undefined ? 1 : power[1] === "-" ? -1 : Number(power[1]);
      const exponent = Number(power[2]);
      return `${roundTo(coeff * exponent, 4)}*x^${exponent - 1}`;
    }
    const linear = term.match(/^(-?\d*\.?\d*)?\*?x$/);
    if (linear) return `${linear[1] === "" || linear[1] === undefined ? 1 : linear[1] === "-" ? -1 : Number(linear[1])}`;
    if (/^-?\d+(\.\d+)?$/.test(term)) return "";
    return `d/dx(${term})`;
  }).filter(Boolean).join(" + ").replace(/\+\s-/g, "- ");
  return derived || "0";
}

function derivativeSteps(expression: string, derivative: string) {
  return ["Split the expression into terms.", "Apply the power rule d/dx(ax^n)=a*n*x^(n-1).", `Result: ${derivative}.`, `Original expression: ${expression}.`];
}

function integralText(expression: string) {
  const compact = expression.replace(/\s+/g, "");
  if (compact === "cos(x)") return "sin(x) + C";
  if (compact === "sin(x)") return "-cos(x) + C";
  const terms = compact.replace(/-/g, "+-").split("+").filter(Boolean);
  const integrated = terms.map((term) => {
    const power = term.match(/^(-?\d*\.?\d*)?\*?x\^(\d+)$/);
    if (power) {
      const coeff = power[1] === "" || power[1] === undefined ? 1 : power[1] === "-" ? -1 : Number(power[1]);
      const exponent = Number(power[2]);
      return `${roundTo(coeff / (exponent + 1), 5)}*x^${exponent + 1}`;
    }
    const linear = term.match(/^(-?\d*\.?\d*)?\*?x$/);
    if (linear) {
      const coeff = linear[1] === "" || linear[1] === undefined ? 1 : linear[1] === "-" ? -1 : Number(linear[1]);
      return `${roundTo(coeff / 2, 5)}*x^2`;
    }
    if (/^-?\d+(\.\d+)?$/.test(term)) return `${term}*x`;
    return `integral(${term})`;
  }).filter(Boolean).join(" + ").replace(/\+\s-/g, "- ");
  return `${integrated || "0"} + C`;
}

function integralSteps(expression: string, integral: string) {
  return ["Split the expression into terms.", "Apply integral of ax^n = a*x^(n+1)/(n+1).", "Add the constant of integration C.", `Result: ${integral}.`, `Original expression: ${expression}.`];
}

function parseQuadratic(expression: string) {
  const polynomial = parsePolynomial(expression);
  if (!polynomial) return null;
  const a = polynomial[2] ?? 0;
  const b = polynomial[1] ?? 0;
  const c = polynomial[0] ?? 0;
  const otherPowers = Object.keys(polynomial).map(Number).filter((power) => power > 2 && Math.abs(polynomial[power]) > 1e-9);
  if (Math.abs(a) < 1e-9 || otherPowers.length) return null;
  return { a, b, c };
}

function parsePolynomial(expression: string): Record<number, number> | null {
  const compact = expression.replace(/\s+/g, "").replace(/\*/g, "");
  if (!/^[x0-9+\-.^]+$/.test(compact)) return null;
  const terms = compact.replace(/-/g, "+-").split("+").filter(Boolean);
  const polynomial: Record<number, number> = {};
  for (const term of terms) {
    const powerMatch = term.match(/^(-?\d*\.?\d*)?x\^(\d+)$/);
    const linearMatch = term.match(/^(-?\d*\.?\d*)?x$/);
    const constantMatch = term.match(/^-?\d+(\.\d+)?$/);
    if (powerMatch) {
      const coeff = coefficientFromText(powerMatch[1]);
      const power = Number(powerMatch[2]);
      polynomial[power] = (polynomial[power] ?? 0) + coeff;
    } else if (linearMatch) {
      polynomial[1] = (polynomial[1] ?? 0) + coefficientFromText(linearMatch[1]);
    } else if (constantMatch) {
      polynomial[0] = (polynomial[0] ?? 0) + Number(term);
    } else return null;
  }
  return polynomial;
}

function coefficientFromText(value: string | undefined) {
  if (value === undefined || value === "") return 1;
  if (value === "-") return -1;
  return Number(value);
}

function polynomialToText(polynomial: Record<number, number>) {
  return Object.entries(polynomial)
    .map(([powerText, coefficient]) => ({ power: Number(powerText), coefficient }))
    .filter(({ coefficient }) => Math.abs(coefficient) > 1e-9)
    .sort((a, b) => b.power - a.power)
    .map(({ power, coefficient }, index) => {
      const abs = Math.abs(roundTo(coefficient, 6));
      const sign = coefficient < 0 ? (index === 0 ? "-" : " - ") : (index === 0 ? "" : " + ");
      if (power === 0) return `${sign}${abs}`;
      if (power === 1) return `${sign}${abs === 1 ? "" : `${abs}*`}x`;
      return `${sign}${abs === 1 ? "" : `${abs}*`}x^${power}`;
    }).join("") || "0";
}

function quadraticRoots(a: number, b: number, c: number) {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const sqrt = Math.sqrt(discriminant);
  return [(-b + sqrt) / (2 * a), (-b - sqrt) / (2 * a)];
}

function quadraticSteps(a: number, b: number, c: number) {
  const discriminant = b * b - 4 * a * c;
  return [`Identify a=${a}, b=${b}, c=${c}.`, `Compute discriminant D=b^2-4ac=${roundTo(discriminant, 5)}.`, "Use x=(-b +/- sqrt(D))/(2a).", discriminant >= 0 ? "D is nonnegative, so the real roots are shown." : "D is negative, so there are no real roots."];
}

function signed(value: number) {
  return value < 0 ? `- ${roundTo(Math.abs(value), 5)}` : `+ ${roundTo(value, 5)}`;
}

function numericDerivative(expression: string, x: number) {
  const h = 0.0001;
  return (evaluateMathExpression(expression, x + h) - evaluateMathExpression(expression, x - h)) / (2 * h);
}

function bisect(f: (x: number) => number, left: number, right: number) {
  let lo = left, hi = right;
  for (let i = 0; i < 32; i += 1) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

function GraphPanel({ plots, onChange }: { plots: PlotItem[]; onChange: (plots: PlotItem[]) => void }) {
  const [draft, setDraft] = useState("cos(x)");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [sliderA, setSliderA] = useState(1);
  const [sliderB, setSliderB] = useState(0);
  const visiblePlots = plots.filter((plot) => plot.visible !== false);
  const viewport = useMemo(() => ({ xMin, xMax, yMin, yMax, width: 640, height: 360 }), [xMin, xMax, yMin, yMax]);
  const paths = useMemo(() => visiblePlots.map((plot) => ({ ...plot, path: graphPath(stripInequality(applyGraphParameters(plot.expression, sliderA, sliderB)), viewport) })), [visiblePlots, sliderA, sliderB, viewport]);
  const tableRows = useMemo(() => visiblePlots.slice(0, 3).flatMap((plot) => sampleTable(applyGraphParameters(plot.expression, sliderA, sliderB), plot.expression).slice(0, 7)), [visiblePlots, sliderA, sliderB]);
  const regression = useMemo(() => linearRegression(regressionSeed), []);
  const inequalityRegions = useMemo(() => visiblePlots.filter((plot) => (plot.kind ?? inferPlotKind(plot.expression)) === "inequality").map((plot) => inequalityRegion(applyGraphParameters(plot.expression, sliderA, sliderB), viewport)), [visiblePlots, sliderA, sliderB, viewport]);
  const addPlot = (expression: string, kind: PlotKind = inferPlotKind(expression)) => onChange([{ id: crypto.randomUUID(), expression, color: colors[plots.length % colors.length], kind, visible: true }, ...plots].slice(0, 10));
  const updatePlot = (id: string, patch: Partial<PlotItem>) => onChange(plots.map((plot) => plot.id === id ? { ...plot, ...patch } : plot));
  const removePlot = (id: string) => onChange(plots.filter((plot) => plot.id !== id));
  const addRegression = () => onChange([{ id: crypto.randomUUID(), expression: regression.expression, color: "#ec4899", kind: "regression" as PlotKind, points: regressionSeed, visible: true }, ...plots].slice(0, 10));
  return (
    <div className="min-w-0 max-w-full space-y-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold"><LineChart className="h-4 w-4 text-cyan-500" /> Desmos-style Graphing Lab</h2>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="mini-chip">Functions</span><span className="mini-chip">Inequalities</span><span className="mini-chip">Tables</span><span className="mini-chip">Regression</span>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-3">
          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Expression</label>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-900" placeholder="sin(x), x^2, y < x+2" />
            <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => addPlot(draft)} className="action-primary py-2">Add graph</button>
              <button type="button" onClick={() => addRegression()} className="action-secondary py-2">Regression</button>
            </div>
          </div>

          <div className="space-y-2">
            {plots.map((plot) => (
              <div key={plot.id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={plot.visible !== false} onChange={(event) => updatePlot(plot.id, { visible: event.target.checked })} />
                  <span className="h-3 w-3 rounded-full" style={{ background: plot.color }} />
                  <input value={plot.expression} onChange={(event) => updatePlot(plot.id, { expression: event.target.value, kind: inferPlotKind(event.target.value) })} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs dark:border-white/10 dark:bg-slate-900" />
                  <button type="button" onClick={() => removePlot(plot.id)} className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">x</button>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">{plot.kind ?? inferPlotKind(plot.expression)}</p>
              </div>
            ))}
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2">
            <MiniNumber label="x min" value={xMin} onChange={setXMin} />
            <MiniNumber label="x max" value={xMax} onChange={setXMax} />
            <MiniNumber label="y min" value={yMin} onChange={setYMin} />
            <MiniNumber label="y max" value={yMax} onChange={setYMax} />
          </div>
        </div>

        <div className="min-w-0 space-y-3 overflow-hidden">
          <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet" className="h-[260px] w-full max-w-full rounded-xl bg-slate-50 dark:bg-slate-900 sm:h-[340px] xl:h-[360px]">
            <GraphGrid viewport={viewport} />
            {inequalityRegions.map((region, index) => <path key={`ineq-${index}`} d={region} fill={visiblePlots[index]?.color ?? "#06b6d4"} opacity="0.16" />)}
            {paths.map((plot) => (plot.kind ?? inferPlotKind(plot.expression)) !== "inequality" && <path key={plot.id} d={plot.path} fill="none" stroke={plot.color} strokeWidth="3" />)}
            {visiblePlots.filter((plot) => plot.kind === "scatter" || plot.kind === "regression").flatMap((plot) => plot.points ?? []).map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={scaleX(point.x, viewport)} cy={scaleY(point.y, viewport)} r="5" fill="#ec4899" stroke="#0f172a" />)}
          </svg>

          <div className="grid min-w-0 gap-3 xl:grid-cols-2">
            <div className="min-w-0 rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
              <p className="text-sm font-bold">Parameter sliders</p>
              <SliderControl label="a" value={sliderA} min={-5} max={5} step={0.1} onChange={setSliderA} />
              <SliderControl label="b" value={sliderB} min={-10} max={10} step={0.1} onChange={setSliderB} />
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Use expressions like a*x+b or a*sin(x)+b.</p>
            </div>
            <div className="mobile-safe-scroll min-w-0 rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full min-w-[260px] text-left text-xs">
                <thead className="bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"><tr><th className="p-2">expr</th><th className="p-2">x</th><th className="p-2">y</th></tr></thead>
                <tbody>{tableRows.map((row, index) => <tr key={`${row.x}-${row.y}-${index}`} className="border-t border-slate-200 dark:border-white/10"><td className="p-2 font-mono">{row.label}</td><td className="p-2 font-mono">{row.x}</td><td className="p-2 font-mono">{row.y}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type GraphViewport = { xMin: number; xMax: number; yMin: number; yMax: number; width: number; height: number };

function graphPath(expression: string, viewport: GraphViewport) {
  const points: string[] = [];
  for (let i = 0; i <= 400; i += 1) {
    const x = viewport.xMin + (i / 400) * (viewport.xMax - viewport.xMin);
    const y = evaluateMathExpression(expression, x);
    if (!Number.isFinite(y) || y < viewport.yMin - 50 || y > viewport.yMax + 50) continue;
    const sx = scaleX(x, viewport);
    const sy = scaleY(y, viewport);
    points.push(`${points.length ? "L" : "M"}${sx.toFixed(2)},${sy.toFixed(2)}`);
  }
  return points.join(" ");
}

function GraphGrid({ viewport }: { viewport: GraphViewport }) {
  const zeroX = scaleX(0, viewport);
  const zeroY = scaleY(0, viewport);
  return (
    <g>
      {Array.from({ length: 21 }, (_, i) => <line key={`v-${i}`} x1={i * 32} x2={i * 32} y1="0" y2="360" stroke="rgba(148,163,184,.22)" />)}
      {Array.from({ length: 13 }, (_, i) => <line key={`h-${i}`} x1="0" x2="640" y1={i * 30} y2={i * 30} stroke="rgba(148,163,184,.22)" />)}
      <line x1={zeroX} x2={zeroX} y1="0" y2="360" stroke="#64748b" strokeWidth="2" />
      <line x1="0" x2="640" y1={zeroY} y2={zeroY} stroke="#64748b" strokeWidth="2" />
    </g>
  );
}

function MiniNumber({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
      {label}
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono dark:border-white/10 dark:bg-slate-900" />
    </label>
  );
}

function inferPlotKind(expression: string): PlotKind {
  if (/[<>]=?/.test(expression)) return "inequality";
  return "function";
}

function applyGraphParameters(expression: string, a: number, b: number) {
  return expression.replace(/\ba\b/g, `(${a})`).replace(/\bb\b/g, `(${b})`);
}

function sampleTable(expression: string, label: string) {
  return [-3, -2, -1, 0, 1, 2, 3].map((x) => {
    try {
      return { x, y: roundTo(evaluateMathExpression(stripInequality(expression), x), 4), label };
    } catch {
      return { x, y: Number.NaN, label };
    }
  }).filter((row) => Number.isFinite(row.y));
}

function stripInequality(expression: string) {
  const match = expression.match(/[<>]=?\s*(.+)$/);
  if (match) return match[1];
  return expression.replace(/^y\s*=\s*/i, "");
}

function inequalityRegion(expression: string, viewport: GraphViewport) {
  const boundary = stripInequality(expression);
  const path = graphPath(boundary, viewport);
  if (!path) return "";
  const isLess = /</.test(expression);
  const edgeY = isLess ? viewport.height : 0;
  return `${path} L ${viewport.width} ${edgeY} L 0 ${edgeY} Z`;
}

function scaleX(x: number, viewport: GraphViewport) {
  return ((x - viewport.xMin) / (viewport.xMax - viewport.xMin || 1)) * viewport.width;
}

function scaleY(y: number, viewport: GraphViewport) {
  return viewport.height - ((y - viewport.yMin) / (viewport.yMax - viewport.yMin || 1)) * viewport.height;
}

function linearRegression(points: ResultTableRow[]) {
  const n = points.length || 1;
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = points.reduce((sum, point) => sum + point.x * point.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept, expression: `${roundTo(slope, 4)}*x${intercept >= 0 ? "+" : ""}${roundTo(intercept, 4)}` };
}

function ResultCardView({ result }: { result: ResultCard }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{result.interpretation}</p>
      <p className="mt-2 font-mono text-sm text-slate-500 dark:text-slate-400">{result.input}</p>
      <p className="mt-3 text-lg font-bold">{result.result}</p>
      {result.detail && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{result.detail}</p>}
      {result.steps && (
        <ol className="mt-3 space-y-1 rounded-2xl bg-slate-100 p-3 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">
          {result.steps.map((step, index) => <li key={`${step}-${index}`}><span className="font-bold text-cyan-600 dark:text-cyan-300">{index + 1}.</span> {step}</li>)}
        </ol>
      )}
      {result.table && result.table.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-white/10 dark:text-slate-400"><tr><th className="px-3 py-2">x</th><th className="px-3 py-2">y</th></tr></thead>
            <tbody>{result.table.map((row, index) => <tr key={`${row.x}-${index}`} className="border-t border-slate-200 dark:border-white/10"><td className="px-3 py-2 font-mono">{row.x}</td><td className="px-3 py-2 font-mono">{row.y}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      {result.related && (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.related.map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
      )}
    </article>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return <div className="rounded-2xl bg-slate-100 p-5 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">{text}</div>;
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function resultsToCsv(results: ResultCard[]) {
  const rows = [["Input", "Interpretation", "Result", "Detail"], ...results.map((result) => [result.input, result.interpretation, result.result, result.detail ?? ""])];
  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
}

function HiddenGeometryExport({ construction, refSetter }: { construction: Construction; refSetter: (node: SVGSVGElement | null) => void }) {
  return (
    <svg ref={refSetter} viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" className="hidden">
      <rect width="640" height="420" fill="#ffffff" />
      <GeometryGrid />
      {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} />)}
      {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} />)}
      {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} />)}
      {construction.points.map((point) => (
        <g key={point.id}>
          <circle cx={point.x} cy={point.y} r="9" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
          <text x={point.x + 12} y={point.y - 10} fill="#0f172a" fontSize="13" fontWeight="700">{point.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold dark:bg-white/10">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function InfoPill({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></div>;
}

function Workspace3DScene({ surface, solid, surfaceScale, solidSize, crossSection, showSurface, showSolid, autoRotate, zoom }: { surface: SurfaceKind; solid: SolidKind; surfaceScale: number; solidSize: number; crossSection: number; showSurface: boolean; showSolid: boolean; autoRotate: boolean; zoom: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={groupRef} scale={zoom}>
      <Axes3D />
      <gridHelper args={[10, 10, "#334155", "#1e293b"]} rotation={[0, 0, 0]} />
      {showSurface && <SurfaceMesh surface={surface} scaleValue={surfaceScale} />}
      {showSolid && <SolidMesh solid={solid} size={solidSize} />}
      <CrossSectionPlane z={crossSection} />
      <VectorArrow start={[-3, 0.05, -3]} end={[2.2, 1.4, 1.8]} color="#f59e0b" />
      <Point3D position={[2.2, 1.4, 1.8]} label="P" />
    </group>
  );
}

function Axes3D() {
  return (
    <group>
      <VectorArrow start={[-5, 0, 0]} end={[5, 0, 0]} color="#ef4444" />
      <VectorArrow start={[0, -0.01, -5]} end={[0, -0.01, 5]} color="#22c55e" />
      <VectorArrow start={[0, -3, 0]} end={[0, 3, 0]} color="#38bdf8" />
    </group>
  );
}

function VectorArrow({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const midpoint = startVector.clone().add(direction.clone().multiplyScalar(0.5));
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  return (
    <group position={midpoint} quaternion={quaternion}>
      <mesh>
        <cylinderGeometry args={[0.025, 0.025, length, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, length / 2, 0]}>
        <coneGeometry args={[0.09, 0.25, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Point3D({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.12, 24, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#7c2d12" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.18, 0.18, 0]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshStandardMaterial color={label ? "#f8fafc" : "#f59e0b"} />
      </mesh>
    </group>
  );
}

function SurfaceMesh({ surface, scaleValue }: { surface: SurfaceKind; scaleValue: number }) {
  const geometry = useMemo(() => createSurfaceGeometry(surface, scaleValue), [surface, scaleValue]);
  return (
    <mesh geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial color="#22d3ee" transparent opacity={0.45} side={THREE.DoubleSide} roughness={0.35} metalness={0.08} />
    </mesh>
  );
}

function createSurfaceGeometry(surface: SurfaceKind, scaleValue: number) {
  const size = 5;
  const segments = 36;
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let iy = 0; iy <= segments; iy += 1) {
    const y = -size / 2 + (iy / segments) * size;
    for (let ix = 0; ix <= segments; ix += 1) {
      const x = -size / 2 + (ix / segments) * size;
      const z = surfaceZ(surface, x, y, scaleValue);
      vertices.push(x, z, y);
    }
  }
  for (let iy = 0; iy < segments; iy += 1) {
    for (let ix = 0; ix < segments; ix += 1) {
      const a = iy * (segments + 1) + ix;
      const b = a + 1;
      const c = a + segments + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function surfaceZ(surface: SurfaceKind, x: number, y: number, scaleValue: number) {
  if (surface === "paraboloid") return scaleValue * 0.25 * (x * x + y * y);
  if (surface === "saddle") return scaleValue * 0.3 * (x * x - y * y);
  if (surface === "wave") return scaleValue * Math.sin(x * 1.4) * Math.cos(y * 1.4);
  if (surface === "ripple") return scaleValue * Math.sin((x * x + y * y) * 1.2);
  if (surface === "cone-surface") return scaleValue * 0.55 * Math.hypot(x, y);
  return scaleValue * 0.35 * (x + y);
}

function SolidMesh({ solid, size }: { solid: SolidKind; size: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.18;
  });
  return (
    <mesh ref={ref} position={[3, size / 4, 2.6]}>
      {solid === "cube" && <boxGeometry args={[size, size, size]} />}
      {solid === "sphere" && <sphereGeometry args={[size / 2, 48, 28]} />}
      {solid === "cylinder" && <cylinderGeometry args={[size / 2, size / 2, size, 48]} />}
      {solid === "cone" && <coneGeometry args={[size / 2, size, 48]} />}
      <meshStandardMaterial color="#8b5cf6" transparent opacity={0.78} roughness={0.28} metalness={0.14} />
    </mesh>
  );
}

function CrossSectionPlane({ z }: { z: number }) {
  return (
    <mesh position={[0, z, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5.5, 5.5]} />
      <meshStandardMaterial color="#f59e0b" transparent opacity={0.22} side={THREE.DoubleSide} />
    </mesh>
  );
}

function surfaceFormula(surface: SurfaceKind, scaleValue: number) {
  if (surface === "paraboloid") return `z = ${roundTo(scaleValue, 2)}(x^2 + y^2)/4`;
  if (surface === "saddle") return `z = ${roundTo(scaleValue, 2)}(x^2 - y^2)/3`;
  if (surface === "wave") return `z = ${roundTo(scaleValue, 2)} sin(1.4x) cos(1.4y)`;
  if (surface === "ripple") return `z = ${roundTo(scaleValue, 2)} sin(1.2(x^2+y^2))`;
  if (surface === "cone-surface") return `z = ${roundTo(scaleValue, 2)} sqrt(x^2+y^2)`;
  return `z = ${roundTo(scaleValue, 2)}(x+y)/3`;
}

function ToolButton({ active, label, onClick, icon }: { active?: boolean; label: string; onClick: () => void; icon: JSX.Element }) {
  return <button type="button" onClick={onClick} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"}`}>{icon}{label}</button>;
}

function GeometryGrid() {
  return (
    <g>
      {Array.from({ length: 17 }, (_, i) => <line key={`gv-${i}`} x1={i * 40} x2={i * 40} y1="0" y2="420" stroke="rgba(148,163,184,.2)" />)}
      {Array.from({ length: 12 }, (_, i) => <line key={`gh-${i}`} x1="0" x2="640" y1={i * 40} y2={i * 40} stroke="rgba(148,163,184,.2)" />)}
    </g>
  );
}

function pointById(points: GeoPoint[], id: string) {
  return points.find((point) => point.id === id);
}

function GeometryLine({ line, points }: { line: GeoLine; points: GeoPoint[] }) {
  const a = pointById(points, line.a), b = pointById(points, line.b);
  if (!a || !b) return null;
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8b5cf6" strokeWidth="4" />;
}

function GeometryCircle({ circle, points }: { circle: GeoCircle; points: GeoPoint[] }) {
  const center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!center || !edge) return null;
  return <circle cx={center.x} cy={center.y} r={distance(center, edge)} fill="rgba(34,211,238,.12)" stroke="#06b6d4" strokeWidth="4" />;
}

function GeometryPolygon({ polygon, points }: { polygon: GeoPolygon; points: GeoPoint[] }) {
  const polygonPoints = polygon.points.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (polygonPoints.length < 3) return null;
  return <polygon points={polygonPoints.map((point) => `${point.x},${point.y}`).join(" ")} fill="rgba(245,158,11,.16)" stroke="#f59e0b" strokeWidth="4" />;
}

function ConstraintOverlays({ construction }: { construction: Construction }) {
  return (
    <g>
      {construction.constraints.map((constraint) => {
        if (constraint.type === "parallel" || constraint.type === "perpendicular") {
          const line = construction.lines.find((item) => item.id === constraint.line);
          const a = line ? pointById(construction.points, line.a) : null;
          const b = line ? pointById(construction.points, line.b) : null;
          if (!a || !b) return null;
          return <g key={constraint.id}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={constraint.type === "parallel" ? "#10b981" : "#ef4444"} strokeWidth="7" opacity="0.22" /><text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 8} fill={constraint.type === "parallel" ? "#047857" : "#b91c1c"} className="text-xs font-bold">{constraint.type === "parallel" ? "parallel" : "90 deg"}</text></g>;
        }
        if (constraint.type === "midpoint") {
          const p = pointById(construction.points, constraint.point);
          return p ? <circle key={constraint.id} cx={p.x} cy={p.y} r="15" fill="none" stroke="#10b981" strokeDasharray="5 5" strokeWidth="3" /> : null;
        }
        if (constraint.type === "on-circle") {
          const p = pointById(construction.points, constraint.point);
          return p ? <circle key={constraint.id} cx={p.x} cy={p.y} r="15" fill="none" stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth="3" /> : null;
        }
        if (constraint.type === "fixed-length") {
          const a = pointById(construction.points, constraint.anchor);
          const b = pointById(construction.points, constraint.point);
          return a && b ? <line key={constraint.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f97316" strokeWidth="2" strokeDasharray="5 5" /> : null;
        }
        if (constraint.type === "intersection") {
          const p = pointById(construction.points, constraint.point);
          return p ? <circle key={constraint.id} cx={p.x} cy={p.y} r="18" fill="none" stroke="#06b6d4" strokeDasharray="3 4" strokeWidth="3" /> : null;
        }
        return null;
      })}
    </g>
  );
}

function ConstraintPanel({ construction }: { construction: Construction }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="font-bold">Constraint Engine</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Draggable points now recompute dependent objects: parallel, perpendicular, midpoint, fixed length, point-on-circle, and line intersections.</p>
      {construction.constraints.length ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {construction.constraints.map((constraint) => <li key={constraint.id} className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">{constraintLabel(constraint, construction)}</li>)}
        </ul>
      ) : <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Add a constraint tool to see live dependencies here.</p>}
    </div>
  );
}

function ConstructionHelp({ tool }: { tool: GeometryTool }) {
  const instructions: Record<GeometryTool, string> = {
    select: "Drag existing points to update every connected line, circle, and polygon.",
    point: "Click the board to create labeled points.",
    line: "Click two points to create a segment.",
    circle: "Click a center point, then a radius point.",
    polygon: "Click three or more points; the polygon is created after the third point.",
    parallel: "Click two points for a source direction, then a third point. A constrained parallel line is created through the third point.",
    perpendicular: "Click two points for a source direction, then a third point. A constrained perpendicular line is created through the third point.",
    midpoint: "Click two points. A midpoint is created and stays locked halfway between them.",
    "fixed-length": "Click an anchor point and a second point. The second point keeps its current distance from the anchor while dragged.",
    "on-circle": "Click a point. It snaps to the first circle and stays on that circle.",
    intersect: "Create at least two lines, then click Intersect to add a live intersection point.",
  };
  return <div className="rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-50"><p className="font-bold">Current tool: {tool}</p><p className="mt-2">{instructions[tool]}</p></div>;
}

function Measurements({ construction }: { construction: Construction }) {
  const lineLengths = construction.lines.map((line) => {
    const a = pointById(construction.points, line.a), b = pointById(construction.points, line.b);
    return a && b ? `${a.label}${b.label} = ${roundTo(distance(a, b) / 40, 2)}` : "";
  }).filter(Boolean);
  const circleRadii = construction.circles.map((circle) => {
    const center = pointById(construction.points, circle.center), edge = pointById(construction.points, circle.edge);
    return center && edge ? `Circle ${center.label}: r = ${roundTo(distance(center, edge) / 40, 2)}` : "";
  }).filter(Boolean);
  const polygonAreas = construction.polygons.map((polygon, index) => {
    const points = polygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
    return points.length >= 3 ? `Polygon ${index + 1}: area = ${roundTo(polygonArea(points) / 1600, 2)}` : "";
  }).filter(Boolean);
  const entries = [...lineLengths, ...circleRadii, ...polygonAreas];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="font-bold">Live Measurements</h3>
      {entries.length ? <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">{entries.map((entry) => <li key={entry}>{entry}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Create lines, circles, or polygons to see measurements.</p>}
    </div>
  );
}

function distance(a: GeoPoint, b: GeoPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeConstruction(value: Partial<Construction>): Construction {
  return solveConstruction({
    points: value.points ?? [],
    lines: value.lines ?? [],
    circles: value.circles ?? [],
    polygons: value.polygons ?? [],
    constraints: value.constraints ?? [],
  });
}

function addParallelPerpendicularConstraint(construction: Construction, type: "parallel" | "perpendicular", aId: string, bId: string, throughPointId: string) {
  const sourceLine: GeoLine = { id: crypto.randomUUID(), a: aId, b: bId };
  const through = pointById(construction.points, throughPointId);
  const a = pointById(construction.points, aId);
  const b = pointById(construction.points, bId);
  if (!through || !a || !b) return construction;
  const vector = unitVector(a, b, type === "perpendicular");
  const end: GeoPoint = { id: crypto.randomUUID(), x: through.x + vector.x * 120, y: through.y + vector.y * 120, label: nextPointLabel(construction.points, 1) };
  const constrainedLine: GeoLine = { id: crypto.randomUUID(), a: throughPointId, b: end.id };
  return solveConstruction({
    ...construction,
    lines: [...construction.lines, sourceLine, constrainedLine],
    points: [...construction.points, end],
    constraints: [...construction.constraints, { id: crypto.randomUUID(), type, sourceLine: sourceLine.id, throughPoint: throughPointId, line: constrainedLine.id }],
  });
}

function addMidpointConstraint(construction: Construction, aId: string, bId: string) {
  const a = pointById(construction.points, aId);
  const b = pointById(construction.points, bId);
  if (!a || !b) return construction;
  const point: GeoPoint = { id: crypto.randomUUID(), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, point], constraints: [...construction.constraints, { id: crypto.randomUUID(), type: "midpoint", a: aId, b: bId, point: point.id }] });
}

function addFixedLengthConstraint(construction: Construction, anchorId: string, pointId: string) {
  const anchor = pointById(construction.points, anchorId);
  const point = pointById(construction.points, pointId);
  if (!anchor || !point) return construction;
  return solveConstruction({ ...construction, constraints: [...construction.constraints, { id: crypto.randomUUID(), type: "fixed-length", anchor: anchorId, point: pointId, length: distance(anchor, point) }] });
}

function addPointOnCircleConstraint(construction: Construction, pointId: string) {
  const circle = construction.circles[0];
  if (!circle) return construction;
  return solveConstruction({ ...construction, constraints: [...construction.constraints, { id: crypto.randomUUID(), type: "on-circle", point: pointId, circle: circle.id }] });
}

function addIntersectionConstraint(construction: Construction) {
  if (construction.lines.length < 2) return construction;
  const [first, second] = construction.lines.slice(-2);
  const intersection = lineIntersection(first, second, construction.points);
  if (!intersection) return construction;
  const point: GeoPoint = { id: crypto.randomUUID(), x: intersection.x, y: intersection.y, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, point], constraints: [...construction.constraints, { id: crypto.randomUUID(), type: "intersection", first: first.id, second: second.id, point: point.id }] });
}

function solveConstruction(construction: Construction, draggedPointId?: string): Construction {
  let points = construction.points;
  for (let iteration = 0; iteration < 3; iteration += 1) {
    for (const constraint of construction.constraints) {
      if (constraint.type === "midpoint") {
        const a = pointById(points, constraint.a), b = pointById(points, constraint.b);
        if (a && b) points = updatePoint(points, constraint.point, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      }
      if (constraint.type === "fixed-length" && draggedPointId === constraint.point) {
        const anchor = pointById(points, constraint.anchor), point = pointById(points, constraint.point);
        if (anchor && point) {
          const vector = normalize(point.x - anchor.x, point.y - anchor.y);
          points = updatePoint(points, constraint.point, { x: anchor.x + vector.x * constraint.length, y: anchor.y + vector.y * constraint.length });
        }
      }
      if (constraint.type === "on-circle") {
        const circle = construction.circles.find((item) => item.id === constraint.circle);
        const point = pointById(points, constraint.point);
        const center = circle ? pointById(points, circle.center) : null;
        const edge = circle ? pointById(points, circle.edge) : null;
        if (point && center && edge) {
          const vector = normalize(point.x - center.x, point.y - center.y);
          const radius = distance(center, edge);
          points = updatePoint(points, constraint.point, { x: center.x + vector.x * radius, y: center.y + vector.y * radius });
        }
      }
      if (constraint.type === "parallel" || constraint.type === "perpendicular") {
        const source = construction.lines.find((item) => item.id === constraint.sourceLine);
        const line = construction.lines.find((item) => item.id === constraint.line);
        const sourceA = source ? pointById(points, source.a) : null;
        const sourceB = source ? pointById(points, source.b) : null;
        const through = pointById(points, constraint.throughPoint);
        const end = line ? pointById(points, line.b) : null;
        if (sourceA && sourceB && through && end) {
          const vector = unitVector(sourceA, sourceB, constraint.type === "perpendicular");
          const length = Math.max(80, distance(through, end));
          points = updatePoint(points, end.id, { x: through.x + vector.x * length, y: through.y + vector.y * length });
        }
      }
      if (constraint.type === "intersection") {
        const first = construction.lines.find((item) => item.id === constraint.first);
        const second = construction.lines.find((item) => item.id === constraint.second);
        const intersection = first && second ? lineIntersection(first, second, points) : null;
        if (intersection) points = updatePoint(points, constraint.point, intersection);
      }
    }
  }
  return { ...construction, points };
}

function updatePoint(points: GeoPoint[], id: string, next: { x: number; y: number }) {
  return points.map((point) => point.id === id ? { ...point, x: next.x, y: next.y } : point);
}

function unitVector(a: GeoPoint, b: GeoPoint, perpendicular = false) {
  const vector = normalize(b.x - a.x, b.y - a.y);
  return perpendicular ? { x: -vector.y, y: vector.x } : vector;
}

function normalize(x: number, y: number) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function lineIntersection(first: GeoLine, second: GeoLine, points: GeoPoint[]) {
  const a = pointById(points, first.a), b = pointById(points, first.b), c = pointById(points, second.a), d = pointById(points, second.b);
  if (!a || !b || !c || !d) return null;
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denominator) < 0.001) return null;
  const px = ((a.x * b.y - a.y * b.x) * (c.x - d.x) - (a.x - b.x) * (c.x * d.y - c.y * d.x)) / denominator;
  const py = ((a.x * b.y - a.y * b.x) * (c.y - d.y) - (a.y - b.y) * (c.x * d.y - c.y * d.x)) / denominator;
  return { x: px, y: py };
}

function nextPointLabel(points: GeoPoint[], offset = 0) {
  return String.fromCharCode(65 + points.length + offset);
}

function constraintLabel(constraint: GeoConstraint, construction: Construction) {
  if (constraint.type === "midpoint") return `${labelForPoint(construction, constraint.point)} is midpoint of ${labelForPoint(construction, constraint.a)}${labelForPoint(construction, constraint.b)}`;
  if (constraint.type === "fixed-length") return `${labelForPoint(construction, constraint.anchor)}${labelForPoint(construction, constraint.point)} fixed at ${roundTo(constraint.length / 40, 2)} units`;
  if (constraint.type === "on-circle") return `${labelForPoint(construction, constraint.point)} stays on first circle`;
  if (constraint.type === "intersection") return `${labelForPoint(construction, constraint.point)} is line intersection`;
  return `${constraint.type} constrained line`;
}

function labelForPoint(construction: Construction, id: string) {
  return pointById(construction.points, id)?.label ?? "?";
}

function polygonArea(points: GeoPoint[]) {
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0) / 2);
}
