import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Box,
  Check,
  CheckCircle2,
  Circle as CircleIcon,
  Clock3,
  Cuboid,
  Eraser,
  Eye,
  Grid3X3,
  Home,
  Layers3,
  Lock,
  Maximize2,
  MousePointer2,
  Move,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  Ruler,
  Search,
  Share2,
  Sparkles,
  Target,
  Triangle,
  Unlock,
} from "lucide-react";
import { ChangeEvent, ReactNode, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import { Point2D, clamp, distance2D, roundTo, triangleAreaFromPoints, trianglePerimeter } from "../utils/math";
import { rightTriangleMetrics } from "../utils/coreAccuracyOracles";

type GeometryTab = "triangles" | "pythagoras" | "theorems" | "circles" | "solids" | "accuracy";
type InspectorTab = "vertices" | "measurements" | "construction";
type CircleInspectorTab = "circle" | "constructions" | "results";
type TheoremPanelTab = "statement" | "proof" | "check";
type SolidPanelTab = "dimensions" | "properties" | "formulas" | "net";
type AccuracyPanelTab = "validate" | "rounding" | "mistakes";
type TrianglePreset = "equilateral" | "right" | "isosceles" | "scalene" | "acute" | "obtuse";
type PythagorasPreset = "3-4-5" | "5-12-13" | "8-15-17" | "custom";
type CirclePreset = "unit" | "semicircle" | "sector" | "annulus" | "tangent";
type SolidId = "cube" | "cuboid" | "sphere" | "cylinder" | "cone" | "prism" | "pyramid" | "tetrahedron";
type TheoremId = "angle-sum" | "exterior-angle" | "midpoint" | "basic-proportionality" | "similar-triangles" | "thales" | "law-of-sines" | "law-of-cosines";
type ExampleId = "distance" | "triangle-area" | "pythagorean-check" | "circle-equation" | "cube-diagonal";

const geometryTabs: Array<{ id: GeometryTab; label: string }> = [
  { id: "triangles", label: "Triangles" },
  { id: "pythagoras", label: "Pythagoras" },
  { id: "theorems", label: "Theorems" },
  { id: "circles", label: "Circles" },
  { id: "solids", label: "3D Solids" },
  { id: "accuracy", label: "Accuracy & Examples" },
];

const trianglePresets: Record<TrianglePreset, { label: string; note: string; a: Point2D; b: Point2D; c: Point2D }> = {
  equilateral: { label: "Equilateral", note: "All sides equal", a: { x: -4, y: -3 }, b: { x: 4, y: -3 }, c: { x: 0, y: 3.93 } },
  right: { label: "Right", note: "One 90 deg angle", a: { x: -4, y: -3 }, b: { x: 4, y: -3 }, c: { x: -4, y: 3 } },
  isosceles: { label: "Isosceles", note: "Two sides equal", a: { x: -5, y: -3 }, b: { x: 5, y: -3 }, c: { x: 0, y: 5 } },
  scalene: { label: "Scalene", note: "No sides equal", a: { x: -5, y: -3 }, b: { x: 5, y: -2 }, c: { x: 0, y: 5 } },
  acute: { label: "Acute", note: "All angles < 90 deg", a: { x: -4, y: -3 }, b: { x: 5, y: -3 }, c: { x: 0, y: 4 } },
  obtuse: { label: "Obtuse", note: "One angle > 90 deg", a: { x: -6, y: -2 }, b: { x: 6, y: -3 }, c: { x: -2, y: 3 } },
};

const theoremRegistry: Array<{ id: TheoremId; title: string; category: "Triangles" | "Circles" | "Trigonometry"; statement: string; given: string; prove: string; steps: string[]; related: string[] }> = [
  { id: "angle-sum", title: "Triangle Angle Sum", category: "Triangles", statement: "The interior angles of any triangle add up to 180 deg.", given: "Triangle ABC", prove: "Angle A + Angle B + Angle C = 180 deg", steps: ["Draw a line through B parallel to AC.", "Use alternate interior angles at C.", "Use alternate interior angles at A.", "The straight angle at B gives the sum."], related: ["Exterior Angle Theorem", "Linear Pair Theorem", "Alternate Interior Angles"] },
  { id: "exterior-angle", title: "Exterior Angle Theorem", category: "Triangles", statement: "An exterior angle equals the sum of the two remote interior angles.", given: "Triangle ABC with side AB extended", prove: "Exterior angle = Angle A + Angle C", steps: ["Extend one side of the triangle.", "Use the triangle angle sum.", "Use the straight-line angle pair.", "Substitute to get the remote-angle sum."], related: ["Triangle Angle Sum", "Linear Pair Theorem"] },
  { id: "midpoint", title: "Midpoint Theorem", category: "Triangles", statement: "The segment joining side midpoints is parallel to the third side and half its length.", given: "D and E are midpoints", prove: "DE parallel BC and DE = BC / 2", steps: ["Mark side midpoints.", "Compare the smaller top triangle.", "Use equal ratios on both sides.", "Conclude parallelism and half-length."], related: ["Similar Triangles"] },
  { id: "basic-proportionality", title: "Basic Proportionality Theorem", category: "Triangles", statement: "A line parallel to one side divides the other sides proportionally.", given: "DE parallel BC", prove: "AD / DB = AE / EC", steps: ["Draw the parallel segment.", "Identify corresponding angles.", "Show the triangles are similar.", "Read the matching side ratios."], related: ["Similar Triangles", "Midpoint Theorem"] },
  { id: "similar-triangles", title: "Similar Triangles", category: "Triangles", statement: "Triangles with equal angles have proportional corresponding sides.", given: "Two equal angle pairs", prove: "Matching sides have one scale factor", steps: ["Match equal angles.", "Pair corresponding sides.", "Compute one scale factor.", "Check every side uses it."], related: ["Law of Sines"] },
  { id: "thales", title: "Thales' Theorem", category: "Circles", statement: "An angle in a semicircle is a right angle.", given: "AB is a diameter", prove: "Angle APB = 90 deg", steps: ["Draw the diameter.", "Choose a point on the circle.", "Join radii to create isosceles triangles.", "Use angle sum to prove 90 deg."], related: ["Inscribed Angles"] },
  { id: "law-of-sines", title: "Law of Sines", category: "Trigonometry", statement: "Each side divided by sine of its opposite angle is constant.", given: "Triangle ABC", prove: "a / sin A = b / sin B = c / sin C", steps: ["Drop an altitude.", "Write height with sine from two sides.", "Equate the height expressions.", "Repeat for the third side."], related: ["Similar Triangles"] },
  { id: "law-of-cosines", title: "Law of Cosines", category: "Trigonometry", statement: "The side opposite an included angle follows the cosine correction.", given: "Sides a, b and included angle C", prove: "c^2 = a^2 + b^2 - 2ab cos C", steps: ["Resolve one side into components.", "Apply Pythagoras to the projected triangle.", "Expand the square.", "Simplify into the cosine form."], related: ["Pythagoras"] },
];

const exampleRegistry: Array<{ id: ExampleId; title: string; category: "Coordinates" | "Triangles" | "Circles" | "3D"; prompt: string; steps: string[] }> = [
  { id: "distance", title: "Distance between points", category: "Coordinates", prompt: "Distance: (-3, 2) to (5, 6)", steps: ["Identify Delta x and Delta y.", "Substitute into distance formula.", "Square differences.", "Add the squares.", "Take square root."] },
  { id: "triangle-area", title: "Triangle area", category: "Triangles", prompt: "Use determinant area from coordinates.", steps: ["List vertices.", "Substitute coordinates.", "Compute signed sum.", "Take absolute half.", "State square units."] },
  { id: "pythagorean-check", title: "Pythagorean check", category: "Triangles", prompt: "Check whether 6, 8, 10 is right.", steps: ["Find largest side.", "Square all sides.", "Compare leg squares to hypotenuse square.", "Verify equality.", "State triangle type."] },
  { id: "circle-equation", title: "Circle equation", category: "Circles", prompt: "Center (1, 1), radius 5.", steps: ["Use center form.", "Substitute h, k, and r.", "Square the radius.", "Write the equation.", "Check a point."] },
  { id: "cube-diagonal", title: "Cube diagonal", category: "3D", prompt: "Cube side length 4.", steps: ["Find face diagonal.", "Use 3D Pythagoras.", "Substitute side length.", "Simplify radical.", "Round decimal."] },
];

const solids: Array<{ id: SolidId; label: string }> = [
  { id: "cube", label: "Cube" },
  { id: "cuboid", label: "Cuboid" },
  { id: "sphere", label: "Sphere" },
  { id: "cylinder", label: "Cylinder" },
  { id: "cone", label: "Cone" },
  { id: "prism", label: "Prism" },
  { id: "pyramid", label: "Pyramid" },
  { id: "tetrahedron", label: "Tetrahedron" },
];

const axisRange = 10;

export default function Geometry() {
  const topic = topics.find((item) => item.id === "geometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [tab, setTab] = useState<GeometryTab>(() => readGeometryTab());
  const progress = normalizeProgress(getTopicProgress(topic.id));

  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  useEffect(() => {
    const onPop = () => setTab(readGeometryTab());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const changeTab = (next: GeometryTab) => {
    setTab(next);
    updateQuery({ tab: next }, true);
  };

  const shareSetup = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "Geometry Universe", url });
      return;
    }
    await navigator.clipboard?.writeText(url);
  };

  return (
    <main className="geometry-universe" onPointerDown={() => markTopicInteracted(topic.id)}>
      <header className="gu-header">
        <div>
          <h1>Geometry Universe</h1>
          <p>Measure shapes, angles, areas, circles, and spatial relationships visually.</p>
        </div>
        <div className="gu-header-actions">
          <span className="gu-progress"><i />In progress - {progress}%</span>
          <span><Sparkles />Foundational</span>
          <span><Clock3 />40 min</span>
          <button type="button" onClick={() => void shareSetup()}><Share2 />Share this setup</button>
        </div>
      </header>
      <nav className="gu-tabs" role="tablist" aria-label="Geometry Universe tabs">
        <a href="/shapes" className="gu-tab-link"><Cuboid />2D/3D Shapes</a>
        {geometryTabs.map((item) => item.id === "solids" ? (
          <a key={item.id} href={solidWorkspaceHref()} role="tab" aria-selected={tab === item.id} className={tab === item.id ? "gu-tab-link active" : "gu-tab-link"}>
            <Cuboid />{item.label}
          </a>
        ) : (
          <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "active" : ""} onClick={() => changeTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
      <section className="gu-tab-panel">
        {tab === "triangles" && <TrianglesTab />}
        {tab === "pythagoras" && <PythagorasTabFixed />}
        {tab === "theorems" && <TheoremsTab />}
        {tab === "circles" && <CirclesTab />}
        {tab === "solids" && <SolidsTab />}
        {tab === "accuracy" && <AccuracyTabFixed />}
      </section>
    </main>
  );
}

function TrianglesTab() {
  const initial = useMemo(readGeometryValues, []);
  const [a, setA] = useState<Point2D>(initial.a);
  const [b, setB] = useState<Point2D>(initial.b);
  const [c, setC] = useState<Point2D>(initial.c);
  const [inspector, setInspector] = useState<InspectorTab>("vertices");
  const [tool, setTool] = useState<"select" | "drag" | "measure">("select");
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const [construction, setConstruction] = useState(true);
  const [lockedVertices, setLockedVertices] = useState<Record<"A" | "B" | "C", boolean>>({ A: false, B: false, C: false });
  const [drag, setDrag] = useState<"A" | "B" | "C" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stats = useMemo(() => triangleStats(a, b, c), [a, b, c]);

  useEffect(() => updateQuery({ v_ax: a.x, v_ay: a.y, v_bx: b.x, v_by: b.y, v_cx: c.x, v_cy: c.y }), [a, b, c]);

  const setVertex = (label: "A" | "B" | "C", point: Point2D) => {
    if (lockedVertices[label]) return;
    if (label === "A") setA(point);
    if (label === "B") setB(point);
    if (label === "C") setC(point);
  };
  const pointerToPoint = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: roundTo(clamp(((event.clientX - rect.left) / rect.width) * 20 - 10, -10, 10), 2), y: roundTo(clamp(10 - ((event.clientY - rect.top) / rect.height) * 20, -10, 10), 2) };
  };
  const reset = () => applyTrianglePreset("scalene");
  const applyTrianglePreset = (preset: TrianglePreset) => {
    const next = trianglePresets[preset];
    setA(next.a); setB(next.b); setC(next.c);
    updateQuery({ preset, v_ax: next.a.x, v_ay: next.a.y, v_bx: next.b.x, v_by: next.b.y, v_cx: next.c.x, v_cy: next.c.y });
  };

  return (
    <div className="gu-triangle-grid">
      <WorkspaceFrame toolbar={<GeometryToolbar items={[
        ["Select", <MousePointer2 />, tool === "select", () => setTool("select")],
        ["Drag", <Move />, tool === "drag" || Boolean(drag), () => setTool("drag")],
        ["Measure", <Ruler />, tool === "measure", () => setTool("measure")],
        ["Grid", <Grid3X3 />, grid, () => setGrid((value) => !value)],
        ["Labels", <Eye />, labels, () => setLabels((value) => !value)],
        ["Construction lines", <Layers3 />, construction, () => setConstruction((value) => !value)],
        ["Reset", <RefreshCcw />, false, reset],
        ["Fullscreen", <Maximize2 />, false, openActiveFullscreen],
      ]} />}>
        <CoordinateSvg ref={svgRef} dark={false} grid={grid} onPointerMove={(event) => drag && setVertex(drag, pointerToPoint(event))} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
          <TriangleDiagram a={a} b={b} c={c} stats={stats} labels={labels} construction={construction} onDrag={(label) => !lockedVertices[label] && setDrag(label)} />
        </CoordinateSvg>
        <div className="gu-preset-strip">
          {(Object.keys(trianglePresets) as TrianglePreset[]).map((preset) => <button key={preset} type="button" onClick={() => applyTrianglePreset(preset)}><Triangle /> <strong>{trianglePresets[preset].label}</strong><span>{trianglePresets[preset].note}</span></button>)}
        </div>
      </WorkspaceFrame>
      <Inspector title="Triangle inspector" tabs={[["vertices", "Vertices"], ["measurements", "Measurements"], ["construction", "Construction"]]} active={inspector} onActive={setInspector}>
        {inspector === "vertices" && (
          <div className="gu-control-list">
            {(["A", "B", "C"] as const).map((label) => {
              const point = label === "A" ? a : label === "B" ? b : c;
              return <VertexEditor key={label} label={label} locked={lockedVertices[label]} point={point} onLock={() => setLockedVertices((state) => ({ ...state, [label]: !state[label] }))} onChange={(point) => setVertex(label, point)} />;
            })}
          </div>
        )}
        {inspector === "measurements" && (
          <>
            <ResultGrid items={[
              ["Side a", "BC", stats.aSide], ["Side b", "CA", stats.bSide], ["Side c", "AB", stats.cSide], ["Perimeter", "a + b + c", stats.perimeter],
              ["Area", "Delta ABC", stats.area], ["Angle A", "", `${fmt(stats.angleA)} deg`], ["Angle B", "", `${fmt(stats.angleB)} deg`], ["Angle C", "", `${fmt(stats.angleC)} deg`],
            ]} />
            <FormulaCard title="Centroid G" formula="((xA + xB + xC) / 3, (yA + yB + yC) / 3)" result={`(${fmt(stats.centroid.x)}, ${fmt(stats.centroid.y)})`} />
          </>
        )}
        {inspector === "construction" && (
          <div className="gu-toggle-grid">
            {["Medians", "Centroid", "Altitudes", "Orthocentre", "Perpendicular bisectors", "Circumcentre", "Angle bisectors", "Incircle"].map((item) => <label key={item}><input type="checkbox" checked={construction} onChange={() => setConstruction((value) => !value)} />{item}</label>)}
          </div>
        )}
        <FormulaCard title="Area of Triangle (Determinant)" formula="Area = 1/2 |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|" result={`${fmt(stats.area)} square units`} />
        {stats.area < 0.2 && <Warning>Points are nearly collinear, so angle and area measurements are unstable.</Warning>}
      </Inspector>
      <BottomMetrics stats={stats} />
    </div>
  );
}

function PythagorasTab() {
  const initial = useMemo(readGeometryValues, []);
  const [a, setA] = useState(initial.sideA);
  const [b, setB] = useState(initial.sideB);
  const [step, setStep] = useState(0);
  const [panel, setPanel] = useState<"dimensions" | "proof" | "applications">("dimensions");
  const [tool, setTool] = useState<"select" | "animate">("select");
  const [playing, setPlaying] = useState(false);
  const [tiles, setTiles] = useState(true);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const metrics = rightTriangleMetrics(a, b);
  const c = metrics.c;
  useEffect(() => updateQuery({ tab: "pythagoras", v_side_a: a, v_side_b: b, proof_step: step }), [a, b, step]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((value) => (value + 1) % 4), 1200);
    return () => window.clearInterval(id);
  }, [playing]);

  const preset = (nextA: number, nextB: number, id: PythagorasPreset) => { setA(nextA); setB(nextB); updateQuery({ pythagoras: id, v_side_a: nextA, v_side_b: nextB }); };
  return (
    <div className="gu-proof-grid">
      <WorkspaceFrame dark toolbar={<GeometryToolbar items={[
        ["Select", <MousePointer2 />, tool === "select", () => setTool("select")],
        ["Animate proof", playing ? <Pause /> : <Play />, playing, () => { setTool("animate"); setPanel("proof"); setPlaying((value) => !value); }],
        ["Tiles", <Grid3X3 />, tiles, () => setTiles((value) => !value)],
        ["Labels", <Eye />, labels, () => setLabels((value) => !value)],
        ["Grid", <Grid3X3 />, grid, () => setGrid((value) => !value)],
        ["Reset", <RefreshCcw />, false, () => preset(4, 3, "3-4-5")],
        ["Fullscreen", <Maximize2 />, false, openActiveFullscreen],
      ]} />}>
        <PythagorasDiagram a={a} b={b} c={c} grid={grid} labels={labels} tiles={tiles} />
      </WorkspaceFrame>
      <Inspector title="Pythagoras" tabs={[["dimensions", "Dimensions"], ["proof", "Proof Steps"], ["applications", "Applications"]]} active={panel} onActive={setPanel}>
        {panel === "dimensions" && <>
        <RangeNumber label="Side a (leg)" value={a} min={1} max={12} step={0.5} color="#06b6d4" onChange={setA} />
        <RangeNumber label="Side b (leg)" value={b} min={1} max={12} step={0.5} color="#8b5cf6" onChange={setB} />
        <RangeNumber label="Hypotenuse c" value={roundTo(c, 3)} min={1} max={18} step={0.1} color="#f59e0b" onChange={() => undefined} disabled />
        <FormulaHero formula="a² + b² = c²" substitution={`${fmt(a)}² + ${fmt(b)}² = ${fmt(c)}²`} result={`${fmt(a * a)} + ${fmt(b * b)} = ${fmt(c * c)}`} />
        </>}
        {panel === "proof" && <ProofSteps step={step} onStep={setStep} playing={playing} onPlaying={setPlaying} />}
        {panel === "applications" && <InfoCard title="Applications" lines={["Distance on coordinate grids", "Construction layout checks", "Navigation and path length", "Screen and diagonal measurement"]} />}
      </Inspector>
      <div className="gu-lower-row">
        <PresetButtons items={[["3-4-5", () => preset(4, 3, "3-4-5")], ["5-12-13", () => preset(5, 12, "5-12-13")], ["8-15-17", () => preset(8, 15, "8-15-17")], ["Custom", () => preset(6, 7, "custom")]]} />
        <ResultGrid items={[["Triangle type", "Right angle at B", "Right triangle"], ["Perimeter", `${fmt(a)} + ${fmt(b)} + ${fmt(c)}`, a + b + c], ["Area", `(${fmt(a)} x ${fmt(b)}) / 2`, (a * b) / 2], ["Hypotenuse", `sqrt(${fmt(a)}² + ${fmt(b)}²)`, c]]} />
      </div>
    </div>
  );
}

function PythagorasTabFixed() {
  const initial = useMemo(readGeometryValues, []);
  const [a, setA] = useState(initial.sideA);
  const [b, setB] = useState(initial.sideB);
  const [step, setStep] = useState(0);
  const [panel, setPanel] = useState<"dimensions" | "proof" | "applications">("dimensions");
  const [tool, setTool] = useState<"select" | "animate">("select");
  const [playing, setPlaying] = useState(false);
  const [tiles, setTiles] = useState(true);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const metrics = rightTriangleMetrics(a, b);
  const c = metrics.c;
  useEffect(() => updateQuery({ tab: "pythagoras", v_side_a: a, v_side_b: b, proof_step: step }), [a, b, step]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((value) => (value + 1) % 4), 1200);
    return () => window.clearInterval(id);
  }, [playing]);
  const preset = (nextA: number, nextB: number, id: PythagorasPreset) => { setA(nextA); setB(nextB); updateQuery({ pythagoras: id, v_side_a: nextA, v_side_b: nextB }); };
  return (
    <div className="gu-proof-grid">
      <WorkspaceFrame dark toolbar={<GeometryToolbar items={[
        ["Select", <MousePointer2 />, tool === "select", () => setTool("select")],
        ["Animate proof", playing ? <Pause /> : <Play />, playing, () => { setTool("animate"); setPanel("proof"); setPlaying((value) => !value); }],
        ["Tiles", <Grid3X3 />, tiles, () => setTiles((value) => !value)],
        ["Labels", <Eye />, labels, () => setLabels((value) => !value)],
        ["Grid", <Grid3X3 />, grid, () => setGrid((value) => !value)],
        ["Reset", <RefreshCcw />, false, () => preset(4, 3, "3-4-5")],
        ["Fullscreen", <Maximize2 />, false, openActiveFullscreen],
      ]} />}>
        <PythagorasDiagram a={a} b={b} c={c} grid={grid} labels={labels} tiles={tiles} />
      </WorkspaceFrame>
      <Inspector title="Pythagoras" tabs={[["dimensions", "Dimensions"], ["proof", "Proof Steps"], ["applications", "Applications"]]} active={panel} onActive={setPanel}>
        {panel === "dimensions" && <>
          <RangeNumber label="Side a (leg)" value={a} min={1} max={12} step={0.5} color="#06b6d4" onChange={setA} />
          <RangeNumber label="Side b (leg)" value={b} min={1} max={12} step={0.5} color="#8b5cf6" onChange={setB} />
          <RangeNumber label="Hypotenuse c" value={roundTo(c, 3)} min={1} max={18} step={0.1} color="#f59e0b" onChange={() => undefined} disabled />
          <FormulaHero formula="a^2 + b^2 = c^2" substitution={`${fmt(a)}^2 + ${fmt(b)}^2 = ${fmt(c)}^2`} result={`${fmt(a * a)} + ${fmt(b * b)} = ${fmt(c * c)}`} />
        </>}
        {panel === "proof" && <ProofSteps step={step} onStep={setStep} playing={playing} onPlaying={setPlaying} />}
        {panel === "applications" && <InfoCard title="Applications" lines={["Distance on coordinate grids", "Construction layout checks", "Navigation and path length", "Screen and diagonal measurement"]} />}
      </Inspector>
      <div className="gu-lower-row">
        <PresetButtons items={[["3-4-5", () => preset(4, 3, "3-4-5")], ["5-12-13", () => preset(5, 12, "5-12-13")], ["8-15-17", () => preset(8, 15, "8-15-17")], ["Custom", () => preset(6, 7, "custom")]]} />
        <ResultGrid items={[["Triangle type", "Right angle at B", "Right triangle"], ["Perimeter", `${fmt(a)} + ${fmt(b)} + ${fmt(c)}`, a + b + c], ["Area", `(${fmt(a)} x ${fmt(b)}) / 2`, (a * b) / 2], ["Hypotenuse", `sqrt(${fmt(a)}^2 + ${fmt(b)}^2)`, c]]} />
      </div>
    </div>
  );
}

function TheoremsTab() {
  const [selected, setSelected] = useState<TheoremId>(() => (new URLSearchParams(location.search).get("theorem") as TheoremId) || "angle-sum");
  const [category, setCategory] = useState<"All" | "Triangles" | "Circles" | "Trigonometry">("All");
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<TheoremPanelTab>("statement");
  const [step, setStep] = useState(2);
  const [tool, setTool] = useState<"select" | "drag">("select");
  const [angleArcs, setAngleArcs] = useState(true);
  const [construction, setConstruction] = useState(true);
  const [labels, setLabels] = useState(true);
  const theorem = theoremRegistry.find((item) => item.id === selected) ?? theoremRegistry[0];
  const visible = theoremRegistry.filter((item) => (category === "All" || item.category === category) && `${item.title} ${item.statement} ${item.category}`.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => updateQuery({ tab: "theorems", theorem: selected, theorem_step: step }), [selected, step]);
  const stats = triangleStats({ x: -4, y: -2 }, { x: 5, y: -2 }, { x: 0, y: 4 });

  return (
    <div className="gu-theorem-grid">
      <aside className="gu-library">
        <h2>Theorem Library</h2>
        <label><Search /><input placeholder="Search theorems..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <div className="gu-filter-row">{(["All", "Triangles", "Circles", "Trigonometry"] as const).map((item) => <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="gu-library-list">{visible.map((item) => <button key={item.id} type="button" className={item.id === selected ? "active" : ""} onClick={() => setSelected(item.id)}><Triangle /><strong>{item.title}</strong><span>{item.statement}</span>{item.id === selected && <Check />}</button>)}</div>
      </aside>
      <WorkspaceFrame dark toolbar={<GeometryToolbar items={[["Select", <MousePointer2 />, tool === "select", () => setTool("select")], ["Drag", <Move />, tool === "drag", () => setTool("drag")], ["Angle arcs", <Ruler />, angleArcs, () => setAngleArcs((value) => !value)], ["Construction lines", <Layers3 />, construction, () => setConstruction((value) => !value)], ["Labels", <Eye />, labels, () => setLabels((value) => !value)], ["Reset", <RefreshCcw />, false, () => setStep(0)], ["Fullscreen", <Maximize2 />, false, openActiveFullscreen]]} />}>
        <TheoremDiagram theorem={theorem.id} stats={stats} step={step} angleArcs={angleArcs} construction={construction} labels={labels} />
      </WorkspaceFrame>
      <Inspector title="Theorem inspector" tabs={[["statement", "Statement"], ["proof", "Proof"], ["check", "Check"]]} active={panel} onActive={setPanel}>
        {panel === "statement" && <StatementPanel theorem={theorem} />}
        {panel === "proof" && <ProofSequence theorem={theorem} step={step} onStep={setStep} onPlay={() => setStep((value) => (value + 1) % theorem.steps.length)} />}
        {panel === "check" && <><ResultGrid items={[["Angle sum", "Live", `${fmt(stats.angleA + stats.angleB + stats.angleC)} deg`], ["Tolerance", "", "±0.01 deg"], ["Status", "", "PASS"]]} /><Warning tone="success">The selected construction validates within tolerance.</Warning></>}
      </Inspector>
      <div className="gu-lower-row gu-theorem-bottom">
        <MetricCard title="Live check" value={`${fmt(stats.angleA + stats.angleB + stats.angleC)} deg`} subtitle="Sum of angles" />
        <InfoCard title="Assumptions" lines={["Euclidean geometry", "Parallel postulate", "Straight lines extend infinitely"]} />
        <InfoCard title="Related theorems" lines={theorem.related} />
        <InfoCard title="Try counterexample" lines={["Make the figure non-planar or break a line.", "Test now"]} />
      </div>
    </div>
  );
}

function CirclesTab() {
  const initial = useMemo(readGeometryValues, []);
  const [center, setCenter] = useState<Point2D>({ x: 1, y: 1 });
  const [radius, setRadius] = useState(initial.radius);
  const [angle, setAngle] = useState(initial.sectorAngle);
  const [panel, setPanel] = useState<CircleInspectorTab>("circle");
  const [visible, setVisible] = useState({ radius: true, diameter: true, chord: true, tangent: true, secant: true, sector: true, labels: true, grid: true });
  const [tool, setTool] = useState<"select" | "point" | "radius" | "chord" | "tangent" | "sector">("select");
  const circumference = 2 * Math.PI * radius;
  const area = Math.PI * radius * radius;
  const arc = (angle / 360) * circumference;
  const sector = (angle / 360) * area;
  useEffect(() => updateQuery({ tab: "circles", v_radius_r: radius, v_sector_angle: angle, circle_x: center.x, circle_y: center.y }), [radius, angle, center]);
  const applyPreset = (preset: CirclePreset) => {
    if (preset === "unit") { setRadius(1); setAngle(360); }
    if (preset === "semicircle") { setRadius(5); setAngle(180); }
    if (preset === "sector") { setRadius(5); setAngle(72); }
    if (preset === "annulus") { setRadius(6); setAngle(360); }
    if (preset === "tangent") { setRadius(5); setAngle(72); }
  };
  return (
    <div className="gu-circle-grid">
      <WorkspaceFrame dark toolbar={<GeometryToolbar items={[["Select", <MousePointer2 />, tool === "select", () => setTool("select")], ["Point", <Target />, tool === "point", () => setTool("point")], ["Radius", <Ruler />, visible.radius, () => setVisible((state) => ({ ...state, radius: !state.radius }))], ["Chord", <Layers3 />, visible.chord, () => setVisible((state) => ({ ...state, chord: !state.chord }))], ["Tangent", <Sparkles />, visible.tangent, () => setVisible((state) => ({ ...state, tangent: !state.tangent }))], ["Sector", <CircleIcon />, visible.sector, () => setVisible((state) => ({ ...state, sector: !state.sector }))], ["Labels", <Eye />, visible.labels, () => setVisible((state) => ({ ...state, labels: !state.labels }))], ["Grid", <Grid3X3 />, visible.grid, () => setVisible((state) => ({ ...state, grid: !state.grid }))], ["Reset", <RefreshCcw />, false, () => applyPreset("sector")], ["Fullscreen", <Maximize2 />, false, openActiveFullscreen]]} />}>
        <CircleDiagram center={center} radius={radius} angle={angle} visible={visible} />
      </WorkspaceFrame>
      <Inspector title="Circle inspector" tabs={[["circle", "Circle"], ["constructions", "Constructions"], ["results", "Results"]]} active={panel} onActive={setPanel}>
        {panel === "circle" && <>
          <VertexEditor label="O" point={center} onChange={setCenter} />
          <RangeNumber label="Radius r" value={radius} min={1} max={9} step={0.25} color="#06b6d4" onChange={setRadius} />
          <RangeNumber label="Central angle θ" value={angle} min={1} max={360} step={1} color="#8b5cf6" onChange={setAngle} />
          <div className="gu-toggle-grid">
            {([
              ["radius", "Radius"], ["diameter", "Diameter"], ["chord", "Chord AB"], ["tangent", "Tangent at P"], ["secant", "Secant"], ["sector", "Sector"], ["labels", "Labels"], ["grid", "Grid"],
            ] as Array<[keyof typeof visible, string]>).map(([key, label]) => <label key={key}><input type="checkbox" checked={visible[key]} onChange={() => setVisible((state) => ({ ...state, [key]: !state[key] }))} />{label}</label>)}
          </div>
        </>}
        {panel === "constructions" && <InfoCard title="Supported constructions" lines={["Diameter", "Chord", "Perpendicular radius", "Tangent", "Secant", "Sector", "Inscribed angle"]} />}
        {panel === "results" && <ResultGrid items={[["Radius", "", radius], ["Diameter", "", radius * 2], ["Circumference", "2πr", circumference], ["Area", "πr²", area], ["Arc length", "θ/360 · 2πr", arc], ["Sector area", "θ/360 · πr²", sector]]} />}
        <FormulaCard title="Measurements & Formulas" formula={`C = 2π(${fmt(radius)}), A = π(${fmt(radius)}²), arc = ${fmt(angle)}/360 · 2π(${fmt(radius)})`} result={`C ${fmt(circumference)} · A ${fmt(area)} · arc ${fmt(arc)} · sector ${fmt(sector)}`} />
        <PresetButtons items={[["Unit circle", () => applyPreset("unit")], ["Semicircle", () => applyPreset("semicircle")], ["Sector", () => applyPreset("sector")], ["Annulus", () => applyPreset("annulus")], ["Tangent demo", () => applyPreset("tangent")]]} />
      </Inspector>
    </div>
  );
}

function SolidsTab() {
  const [solid, setSolid] = useState<SolidId>(() => (new URLSearchParams(location.search).get("solid") as SolidId) || "cube");
  const [side, setSide] = useState(readNumber("v_size_radius", 4));
  const [height, setHeight] = useState(4);
  const [wireframe, setWireframe] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const [rotate, setRotate] = useState(true);
  const [pan, setPan] = useState(true);
  const [measure, setMeasure] = useState(true);
  const [crossSection, setCrossSection] = useState(false);
  const [lockProportions, setLockProportions] = useState(true);
  const [solidSearch, setSolidSearch] = useState("");
  const [panel, setPanel] = useState<SolidPanelTab>("dimensions");
  const props = solidProperties(solid, side, height);
  useEffect(() => updateQuery({ tab: "solids", solid, v_size_radius: side, solid_height: height }), [solid, side, height]);
  const changeSide = (value: number) => {
    setSide(value);
    if (lockProportions && solid === "cuboid") setHeight(value);
  };
  const visibleSolids = solids.filter((item) => item.label.toLowerCase().includes(solidSearch.toLowerCase()));
  return (
    <div className="gu-solids-grid">
      <aside className="gu-library gu-solid-library">
        <label><Search /><input placeholder="Search solids..." value={solidSearch} onChange={(event) => setSolidSearch(event.target.value)} /></label>
        {visibleSolids.map((item) => <button key={item.id} type="button" className={solid === item.id ? "active" : ""} onClick={() => setSolid(item.id)}><Box /><strong>{item.label}</strong></button>)}
      </aside>
      <div className="gu-solid-main">
        <div className="gu-solid-link-row">
          <strong>3D solid workspace</strong>
          <a href={solidWorkspaceHref(solid)}><Cuboid />Open in 3D Geometry</a>
        </div>
        <GeometryToolbar items={[["Rotate", <RefreshCcw />, rotate, () => setRotate((value) => !value)], ["Pan", <Move />, pan, () => setPan((value) => !value)], ["Select Face", <MousePointer2 />, panel === "properties", () => setPanel("properties")], ["Measure", <Ruler />, measure, () => setMeasure((value) => !value)], ["Cross-section", <Layers3 />, crossSection, () => setCrossSection((value) => !value)], ["Net", <Grid3X3 />, panel === "net", () => setPanel("net")], ["Wireframe", <Grid3X3 />, wireframe, () => setWireframe((value) => !value)], ["Transparent", <Eye />, transparent, () => setTransparent((value) => !value)], ["Reset", <RefreshCcw />, false, () => { setSide(4); setHeight(4); setPanel("dimensions"); }], ["Fullscreen", <Maximize2 />, false, openActiveFullscreen]]} />
        <div className="gu-three-host">
          <ThreeSceneWrapper height="100%" cameraPosition={[4.5, 3.4, 6]} fov={46} quality="high" chrome="standard" sceneLabel={`${solid} geometry solid`}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 5, 4]} intensity={1.4} />
            <SolidMesh solid={solid} size={side} height={height} wireframe={wireframe} transparent={transparent} rotate={rotate} />
            {crossSection && <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[side * 1.4, side * 1.4]} /><meshStandardMaterial color="#a855f7" transparent opacity={0.22} side={THREE.DoubleSide} /></mesh>}
            <gridHelper args={[10, 20, "#38bdf8", "#1e3a5f"]} position={[0, -2.6, 0]} />
            <OrbitControls enablePan={pan} enableZoom />
          </ThreeSceneWrapper>
        </div>
        <div className="gu-lower-row">
          <InfoCard title="Animate Rotation" lines={[rotate ? "Playing" : "Paused", "Y-Axis", "Speed 0.45"]} />
          <InfoCard title="Cross-section" lines={[crossSection ? "Visible at position 0.50" : "Hidden", "Plane preview available"]} />
          <InfoCard title="Unfold Net" lines={["Net preview", "Fold/unfold mapping"]} />
          <InfoCard title="Related Shapes" lines={["Cuboid", "Square Prism"]} />
        </div>
      </div>
      <Inspector title="Solid inspector" tabs={[["dimensions", "Dimensions"], ["properties", "Properties"], ["formulas", "Formulas"], ["net", "Net"]]} active={panel} onActive={setPanel}>
        {panel === "dimensions" && <>
          <RangeNumber label={solid === "cube" ? "Side length" : "Length / radius"} value={side} min={1} max={8} step={0.25} color="#06b6d4" onChange={changeSide} />
          {["cuboid", "cylinder", "cone", "prism", "pyramid"].includes(solid) && <RangeNumber label="Height" value={height} min={1} max={9} step={0.25} color="#8b5cf6" onChange={setHeight} />}
          <label className="gu-lock-row"><input type="checkbox" checked={lockProportions} onChange={(event) => setLockProportions(event.target.checked)} />{lockProportions ? <Lock /> : <Unlock />}Lock proportions</label>
        </>}
        {panel === "properties" && <ResultGrid items={[["Volume", "V", props.volume], ["Surface Area", "SA", props.surfaceArea], ["Base Area", "", props.baseArea], ["Space Diagonal", "", props.diagonal], ["Faces", "", props.faces], ["Edges", "", props.edges], ["Vertices", "", props.vertices]]} />}
        {panel === "formulas" && <FormulaCard title="Formulas" formula={props.formula} result={`Volume ${fmt(props.volume)} units³ · Surface ${fmt(props.surfaceArea)} units²`} />}
        {panel === "net" && <InfoCard title="Net" lines={["Interactive net preview uses the existing 3D shape renderer state.", "Download/export can be added where export hooks are available."]} />}
      </Inspector>
    </div>
  );
}

function AccuracyTab() {
  const [selected, setSelected] = useState<ExampleId>(() => (new URLSearchParams(location.search).get("example") as ExampleId) || "distance");
  const [category, setCategory] = useState<"All" | "Coordinates" | "Triangles" | "Circles" | "3D">("All");
  const [step, setStep] = useState(0);
  const [panel, setPanel] = useState<AccuracyPanelTab>("validate");
  const example = exampleRegistry.find((item) => item.id === selected) ?? exampleRegistry[0];
  const visible = exampleRegistry.filter((item) => category === "All" || item.category === category);
  const expected = Math.sqrt(80);
  const user = roundTo(expected, 2);
  useEffect(() => updateQuery({ tab: "accuracy", example: selected, example_step: step }), [selected, step]);
  return (
    <div className="gu-accuracy-grid">
      <div className="gu-summary-row">
        <MetricCard title="Accuracy score" value="92%" subtitle="★★★★★" />
        <MetricCard title="Completed" value="18 / 22" subtitle="Worked examples" />
        <MetricCard title="Current streak" value="6 days" subtitle="Keep going" />
        <MetricCard title="Estimated time" value="12 min" subtitle="This set" />
      </div>
      <aside className="gu-library">
        <h2>Example Library</h2>
        <label><Search /><input placeholder="Search examples..." /></label>
        <div className="gu-filter-row">{(["All", "Coordinates", "Triangles", "Circles", "3D"] as const).map((item) => <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="gu-library-list">{visible.map((item) => <button key={item.id} type="button" className={item.id === selected ? "active" : ""} onClick={() => setSelected(item.id)}><Target /><strong>{item.title}</strong><span>{item.category}</span>{item.id === selected && <Check />}</button>)}</div>
      </aside>
      <WorkspaceFrame toolbar={<GeometryToolbar items={[["Drag", <MousePointer2 />, true, undefined], ["Show steps", <Layers3 />, true, undefined], ["Grid", <Grid3X3 />, true, undefined], ["Labels", <Eye />, true, undefined], ["Reset", <RefreshCcw />, false, () => setStep(0)]]} />}>
        <h2 className="gu-workspace-title">{example.title}</h2>
        <DistanceExampleDiagram step={step} />
        <div className="gu-stepper">{example.steps.map((item, index) => <button key={item} type="button" className={step === index ? "active" : ""} onClick={() => setStep(index)}><b>{index + 1}</b>{item}</button>)}</div>
        <div className="gu-proof-actions"><button type="button" onClick={() => setStep(Math.max(0, step - 1))}>Previous</button><span>Step {step + 1} of {example.steps.length}</span><button type="button" onClick={() => setStep(Math.min(example.steps.length - 1, step + 1))}>Next</button></div>
      </WorkspaceFrame>
      <Inspector title="Accuracy Check" tabs={[["validate", "Validate"], ["rounding", "Rounding"], ["mistakes", "Mistakes"]]} active={panel} onActive={setPanel}>
        {panel === "validate" && <ResultGrid items={[["Measurement", "Distance AB", user], ["Expected", "", expected], ["Difference", "", Math.abs(expected - user)], ["Relative error", "", `${fmt(Math.abs(expected - user) / expected * 100)}%`], ["Tolerance", "", "±0.01"], ["Status", "", "PASS"]]} />}
        {panel === "rounding" && <><FormulaCard title="Rounding" formula={`Exact value = √80 = ${expected}`} result={`Decimal to 2 places = ${user}`} /><div className="gu-filter-row">{[0, 1, 2, 3, 4, 5, 6].map((item) => <button key={item} type="button" className={item === 2 ? "active" : ""}>{item}</button>)}</div></>}
        {panel === "mistakes" && <Warning tone="danger">Common mistakes: subtracting coordinates incorrectly, rounding too early, missing the square root, or omitting a square.</Warning>}
      </Inspector>
      <div className="gu-lower-row">
        <InfoCard title="Practice" lines={["Easy: Distance (1, 2) to (4, 6)", "Medium: Distance (-2, -1) to (5, 3)", "Challenge: Distance (-5, 4) to (7, -2)"]} />
        <div className="gu-answer-card"><input placeholder="Your answer" /><button type="button">Check answer</button><button type="button">Hint</button><button type="button">Try another</button></div>
        <InfoCard title="Mastery by topic" lines={["Coordinates 94%", "Triangles 88%", "Circles 90%", "3D Solids 78%"]} />
      </div>
    </div>
  );
}

function AccuracyTabFixed() {
  const [selected, setSelected] = useState<ExampleId>(() => (new URLSearchParams(location.search).get("example") as ExampleId) || "distance");
  const [category, setCategory] = useState<"All" | "Coordinates" | "Triangles" | "Circles" | "3D">("All");
  const [step, setStep] = useState(0);
  const [panel, setPanel] = useState<AccuracyPanelTab>("validate");
  const [search, setSearch] = useState("");
  const [tool, setTool] = useState<"drag" | "inspect">("drag");
  const [showSteps, setShowSteps] = useState(true);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const [precision, setPrecision] = useState(readNumber("precision", 2));
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("Ready");
  const example = exampleRegistry.find((item) => item.id === selected) ?? exampleRegistry[0];
  const visible = exampleRegistry.filter((item) => (category === "All" || item.category === category) && `${item.title} ${item.category} ${item.prompt}`.toLowerCase().includes(search.toLowerCase()));
  const expected = Math.sqrt(80);
  const user = roundTo(expected, precision);
  useEffect(() => updateQuery({ tab: "accuracy", example: selected, example_step: step, precision }), [selected, step, precision]);
  const checkAnswer = () => {
    const numeric = Number(answer);
    if (!Number.isFinite(numeric)) { setFeedback("Enter a numeric answer first."); return; }
    setFeedback(Math.abs(numeric - user) <= 0.01 ? "Correct within tolerance." : `Not yet. Expected about ${user}.`);
  };
  const tryAnother = () => {
    const current = exampleRegistry.findIndex((item) => item.id === selected);
    const next = exampleRegistry[(current + 1) % exampleRegistry.length];
    setSelected(next.id); setStep(0); setAnswer(""); setFeedback("Ready");
  };
  return (
    <div className="gu-accuracy-grid">
      <div className="gu-summary-row">
        <MetricCard title="Accuracy score" value="92%" subtitle="Mastery estimate" />
        <MetricCard title="Completed" value="18 / 22" subtitle="Worked examples" />
        <MetricCard title="Current streak" value="6 days" subtitle="Keep going" />
        <MetricCard title="Estimated time" value="12 min" subtitle="This set" />
      </div>
      <aside className="gu-library">
        <h2>Example Library</h2>
        <label><Search /><input placeholder="Search examples..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <div className="gu-filter-row">{(["All", "Coordinates", "Triangles", "Circles", "3D"] as const).map((item) => <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="gu-library-list">{visible.map((item) => <button key={item.id} type="button" className={item.id === selected ? "active" : ""} onClick={() => { setSelected(item.id); setStep(0); }}><Target /><strong>{item.title}</strong><span>{item.category}</span>{item.id === selected && <Check />}</button>)}</div>
      </aside>
      <WorkspaceFrame toolbar={<GeometryToolbar items={[["Drag", <MousePointer2 />, tool === "drag", () => setTool("drag")], ["Inspect", <Target />, tool === "inspect", () => setTool("inspect")], ["Show steps", <Layers3 />, showSteps, () => setShowSteps((value) => !value)], ["Grid", <Grid3X3 />, grid, () => setGrid((value) => !value)], ["Labels", <Eye />, labels, () => setLabels((value) => !value)], ["Reset", <RefreshCcw />, false, () => setStep(0)]]} />}>
        <h2 className="gu-workspace-title">{example.title}</h2>
        <DistanceExampleDiagramFixed step={step} grid={grid} labels={labels} />
        {showSteps && <div className="gu-stepper">{example.steps.map((item, index) => <button key={item} type="button" className={step === index ? "active" : ""} onClick={() => setStep(index)}><b>{index + 1}</b>{item}</button>)}</div>}
        <div className="gu-proof-actions"><button type="button" onClick={() => setStep(Math.max(0, step - 1))}>Previous</button><span>Step {step + 1} of {example.steps.length}</span><button type="button" onClick={() => setStep(Math.min(example.steps.length - 1, step + 1))}>Next</button></div>
      </WorkspaceFrame>
      <Inspector title="Accuracy Check" tabs={[["validate", "Validate"], ["rounding", "Rounding"], ["mistakes", "Mistakes"]]} active={panel} onActive={setPanel}>
        {panel === "validate" && <ResultGrid items={[["Measurement", "Distance AB", user], ["Expected", "", expected], ["Difference", "", Math.abs(expected - user)], ["Relative error", "", `${fmt(Math.abs(expected - user) / expected * 100)}%`], ["Tolerance", "", "+/-0.01"], ["Status", "", "PASS"]]} />}
        {panel === "rounding" && <><FormulaCard title="Rounding" formula={`Exact value = sqrt(80) = ${expected}`} result={`Decimal to ${precision} places = ${user}`} /><div className="gu-filter-row">{[0, 1, 2, 3, 4, 5, 6].map((item) => <button key={item} type="button" className={item === precision ? "active" : ""} onClick={() => setPrecision(item)}>{item}</button>)}</div></>}
        {panel === "mistakes" && <Warning tone="danger">Common mistakes: subtracting coordinates incorrectly, rounding too early, missing the square root, or omitting a square.</Warning>}
      </Inspector>
      <div className="gu-lower-row">
        <InfoCard title="Practice" lines={["Easy: Distance (1, 2) to (4, 6)", "Medium: Distance (-2, -1) to (5, 3)", "Challenge: Distance (-5, 4) to (7, -2)"]} />
        <div className="gu-answer-card"><input placeholder="Your answer" value={answer} onChange={(event) => setAnswer(event.target.value)} /><button type="button" onClick={checkAnswer}>Check answer</button><button type="button" onClick={() => setFeedback("Hint: square delta x and delta y, add them, then take the square root.")}>Hint</button><button type="button" onClick={tryAnother}>Try another</button><p>{feedback}</p></div>
        <InfoCard title="Mastery by topic" lines={["Coordinates 94%", "Triangles 88%", "Circles 90%", "3D Solids 78%"]} />
      </div>
    </div>
  );
}

const CoordinateSvg = forwardRef<SVGSVGElement, { children: ReactNode; dark?: boolean; grid?: boolean } & React.SVGProps<SVGSVGElement>>(function CoordinateSvg({ children, dark = false, grid = true, ...props }, ref) {
  return (
    <svg ref={ref} viewBox="0 0 720 520" className={dark ? "gu-coordinate dark" : "gu-coordinate"} role="img" {...props}>
      {grid && Array.from({ length: 21 }, (_, i) => <g key={i}><line x1={toX(i - 10)} x2={toX(i - 10)} y1="20" y2="500" /><line y1={toY(i - 10)} y2={toY(i - 10)} x1="20" x2="700" /></g>)}
      <line x1="20" x2="700" y1={toY(0)} y2={toY(0)} className="axis" /><line y1="20" y2="500" x1={toX(0)} x2={toX(0)} className="axis" />
      {children}
    </svg>
  );
});

function TriangleDiagram({ a, b, c, stats, labels, construction, onDrag }: { a: Point2D; b: Point2D; c: Point2D; stats: ReturnType<typeof triangleStats>; labels: boolean; construction: boolean; onDrag: (label: "A" | "B" | "C") => void }) {
  const A = svgPoint(a), B = svgPoint(b), C = svgPoint(c), G = svgPoint(stats.centroid);
  return (
    <g>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(34,211,238,.18)" stroke="#06b6d4" strokeWidth="3" />
      {construction && <><line x1={A.x} y1={A.y} x2={G.x} y2={G.y} className="construction" /><line x1={B.x} y1={B.y} x2={G.x} y2={G.y} className="construction" /><line x1={C.x} y1={C.y} x2={G.x} y2={G.y} className="construction" /></>}
      <AngleArc p={A} label={`${fmt(stats.angleA)}°`} color="#22c55e" />
      <AngleArc p={B} label={`${fmt(stats.angleB)}°`} color="#22c55e" />
      <AngleArc p={C} label={`${fmt(stats.angleC)}°`} color="#22c55e" />
      {labels && <><TextAt p={mid(A, B)} text={fmt(stats.cSide)} color="#0ea5e9" /><TextAt p={mid(B, C)} text={fmt(stats.aSide)} color="#0ea5e9" /><TextAt p={mid(C, A)} text={fmt(stats.bSide)} color="#0ea5e9" /></>}
      {(["A", "B", "C"] as const).map((label) => {
        const point = label === "A" ? A : label === "B" ? B : C;
        const source = label === "A" ? a : label === "B" ? b : c;
        const color = label === "A" ? "#06b6d4" : label === "B" ? "#8b5cf6" : "#f59e0b";
        return <g key={label} className="gu-draggable-point" onPointerDown={() => onDrag(label)}><circle cx={point.x} cy={point.y} r="9" fill={color} stroke="#020617" strokeWidth="2" /><ReadableText x={point.x + 12} y={point.y - 8} color={color}>{label} ({fmt(source.x)}, {fmt(source.y)})</ReadableText></g>;
      })}
      <circle cx={G.x} cy={G.y} r="6" fill="#ef4444" /><ReadableText x={G.x + 10} y={G.y - 8} color="#ef4444">G ({fmt(stats.centroid.x)}, {fmt(stats.centroid.y)})</ReadableText>
    </g>
  );
}

function PythagorasDiagram({ a, b, c, grid, labels, tiles }: { a: number; b: number; c: number; grid: boolean; labels: boolean; tiles: boolean }) {
  const scale = 34;
  const A = { x: 220, y: 340 }, B = { x: 220 + a * scale, y: 340 }, C = { x: 220 + a * scale, y: 340 - b * scale };
  const sqA = `${A.x},${A.y} ${B.x},${B.y} ${B.x},${B.y + a * scale} ${A.x},${A.y + a * scale}`;
  const sqB = `${B.x},${B.y} ${C.x},${C.y} ${C.x + b * scale},${C.y} ${B.x + b * scale},${B.y}`;
  const sqC = `${C.x},${C.y} ${A.x},${A.y} ${A.x - b * scale},${A.y - a * scale} ${C.x - b * scale},${C.y - a * scale}`;
  return <svg viewBox="0 0 720 520" className="gu-proof-svg">{grid && <GridPattern dark />}{tiles && <><polygon points={sqC} className="square hyp" /><polygon points={sqA} className="square a" /><polygon points={sqB} className="square b" /></>}<polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} className="tri" />{labels && <><text x={A.x + 75} y={A.y + 105}> {fmt(a * a)} </text><text x={B.x + 58} y={C.y + 70}> {fmt(b * b)} </text><text x={A.x - 70} y={A.y - 80}> {fmt(c * c)} </text><TextAt p={mid(A, B)} text={`a = ${fmt(a)}`} color="#06b6d4" /><TextAt p={mid(B, C)} text={`b = ${fmt(b)}`} color="#8b5cf6" /><TextAt p={mid(A, C)} text={`c = ${fmt(c)}`} color="#f59e0b" /></>}</svg>;
}

function TheoremDiagram({ stats, step, angleArcs, construction, labels }: { theorem: TheoremId; stats: ReturnType<typeof triangleStats>; step: number; angleArcs: boolean; construction: boolean; labels: boolean }) {
  return <svg viewBox="0 0 720 520" className="gu-proof-svg"><GridPattern dark /><polygon points="120,350 560,350 360,115" fill="none" stroke="#f8fafc" strokeWidth="4" />{angleArcs && <><path d="M170 350 A50 50 0 0 1 200 310" stroke="#22d3ee" strokeWidth="4" fill="none" /><path d="M510 350 A50 50 0 0 0 485 310" stroke="#a855f7" strokeWidth="4" fill="none" /><path d="M330 150 A48 48 0 0 0 390 150" stroke="#f59e0b" strokeWidth="4" fill="none" /></>}{construction && step >= 2 && <line x1="90" y1="115" x2="610" y2="115" stroke="#f8fafc" strokeDasharray="9 8" />}{labels && <><text x="118" y="372">A</text><text x="575" y="372">B</text><text x="355" y="105">C</text><text x="150" y="455" className="big cyan">{fmt(stats.angleA)}°</text><text x="290" y="455" className="big violet">+ {fmt(stats.angleB)}°</text><text x="455" y="455" className="big orange">+ {fmt(stats.angleC)}° = 180°</text></>}</svg>;
}

function CircleDiagram({ center, radius, angle, visible }: { center: Point2D; radius: number; angle: number; visible: { radius: boolean; diameter: boolean; chord: boolean; tangent: boolean; secant: boolean; sector: boolean; labels: boolean; grid: boolean } }) {
  const O = svgPoint(center);
  const rPx = radius * 24;
  const p = { x: O.x + rPx * Math.cos((angle * Math.PI) / 180), y: O.y - rPx * Math.sin((angle * Math.PI) / 180) };
  return <CoordinateSvg dark grid={visible.grid}><circle cx={O.x} cy={O.y} r={rPx} className="circle-main" />{visible.sector && <path d={`M ${O.x} ${O.y} L ${O.x + rPx} ${O.y} A ${rPx} ${rPx} 0 ${angle > 180 ? 1 : 0} 0 ${p.x} ${p.y} Z`} className="sector" />}{visible.diameter && <line x1={O.x - rPx} y1={O.y} x2={O.x + rPx} y2={O.y} className="diameter" />}{visible.chord && <line x1={O.x - rPx * .68} y1={O.y + rPx * .72} x2={O.x + rPx * .68} y2={O.y + rPx * .72} className="diameter" />}{visible.radius && <line x1={O.x} y1={O.y} x2={p.x} y2={p.y} className="radius" />}{visible.secant && <line x1={O.x - rPx - 90} y1={O.y + rPx * .9} x2={O.x + rPx + 90} y2={O.y + rPx * .25} className="construction strong" />}{visible.tangent && <line x1={p.x - 120} y1={p.y - 90} x2={p.x + 120} y2={p.y + 90} className="tangent" />}<circle cx={O.x} cy={O.y} r="6" fill="#06b6d4" /><circle cx={p.x} cy={p.y} r="7" fill="#f8fafc" stroke="#06b6d4" strokeWidth="3" />{visible.labels && <><text x={O.x + 10} y={O.y - 12}>O ({fmt(center.x)}, {fmt(center.y)})</text><text x={p.x + 10} y={p.y - 10}>P</text><text x={O.x - 160} y={O.y - rPx + 30}>r = {fmt(radius)}</text><text x={O.x + 70} y={O.y - 35}>{fmt(angle)}°</text></>}</CoordinateSvg>;
}

function DistanceExampleDiagram({ grid = true, labels = true, step }: { grid?: boolean; labels?: boolean; step: number }) {
  const a = { x: -3, y: 2 }, b = { x: 5, y: 6 };
  const A = svgPoint(a), B = svgPoint(b), C = svgPoint({ x: b.x, y: a.y });
  return <CoordinateSvg><line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="example-segment" /><line x1={A.x} y1={A.y} x2={C.x} y2={C.y} className={step >= 0 ? "construction strong" : "construction"} /><line x1={C.x} y1={C.y} x2={B.x} y2={B.y} className={step >= 0 ? "construction strong" : "construction"} /><circle cx={A.x} cy={A.y} r="7" fill="#2563eb" /><circle cx={B.x} cy={B.y} r="7" fill="#2563eb" /><text x={A.x - 34} y={A.y - 16}>A (-3, 2)</text><text x={B.x + 10} y={B.y - 12}>B (5, 6)</text><text x={mid(A, C).x} y={mid(A, C).y + 20} fill="#059669">Δx = 8</text><text x={C.x + 15} y={mid(C, B).y} fill="#059669">Δy = 4</text><rect x="250" y="415" width="300" height="48" rx="10" fill="#e0f2fe" /><text x="282" y="445" className="formula-text">d = √((x₂-x₁)² + (y₂-y₁)²) = √80 = 8.94</text></CoordinateSvg>;
}

function DistanceExampleDiagramFixed({ grid = true, labels = true, step }: { grid?: boolean; labels?: boolean; step: number }) {
  const a = { x: -3, y: 2 }, b = { x: 5, y: 6 };
  const A = svgPoint(a), B = svgPoint(b), C = svgPoint({ x: b.x, y: a.y });
  return (
    <CoordinateSvg grid={grid}>
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="example-segment" />
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} className={step >= 0 ? "construction strong" : "construction"} />
      <line x1={C.x} y1={C.y} x2={B.x} y2={B.y} className={step >= 0 ? "construction strong" : "construction"} />
      <circle cx={A.x} cy={A.y} r="7" fill="#2563eb" />
      <circle cx={B.x} cy={B.y} r="7" fill="#2563eb" />
      {labels && <>
        <text x={A.x - 34} y={A.y - 16}>A (-3, 2)</text>
        <text x={B.x + 10} y={B.y - 12}>B (5, 6)</text>
        <text x={mid(A, C).x} y={mid(A, C).y + 20} fill="#059669">dx = 8</text>
        <text x={C.x + 15} y={mid(C, B).y} fill="#059669">dy = 4</text>
      </>}
      <rect x="250" y="415" width="300" height="48" rx="10" fill="#e0f2fe" />
      <text x="282" y="445" className="formula-text">d = sqrt((x2-x1)^2 + (y2-y1)^2) = sqrt(80) = 8.94</text>
    </CoordinateSvg>
  );
}

function SolidMesh({ solid, size, height, wireframe, transparent, rotate }: { solid: SolidId; size: number; height: number; wireframe: boolean; transparent: boolean; rotate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current && rotate) ref.current.rotation.y += delta * 0.38; });
  return <group ref={ref}><mesh castShadow receiveShadow><SolidGeometry solid={solid} size={size} height={height} /><meshStandardMaterial color="#22d3ee" emissive="#0e7490" emissiveIntensity={0.18} roughness={0.25} transparent opacity={transparent ? 0.38 : 0.82} /></mesh>{wireframe && <mesh><SolidGeometry solid={solid} size={size} height={height} /><meshBasicMaterial color="#f8fafc" wireframe transparent opacity={0.35} /></mesh>}<DimensionLabel size={size} /></group>;
}

function SolidGeometry({ solid, size, height }: { solid: SolidId; size: number; height: number }) {
  if (solid === "sphere") return <sphereGeometry args={[size / 2, 64, 36]} />;
  if (solid === "cylinder") return <cylinderGeometry args={[size / 2, size / 2, height, 64]} />;
  if (solid === "cone") return <coneGeometry args={[size / 2, height, 64]} />;
  if (solid === "pyramid" || solid === "tetrahedron") return <coneGeometry args={[size / 1.6, height, solid === "tetrahedron" ? 3 : 4]} />;
  return <boxGeometry args={solid === "cuboid" ? [size, size * 0.72, height] : [size, size, size]} />;
}

function DimensionLabel({ size }: { size: number }) {
  return <group><axesHelper args={[2]} /><lineSegments><bufferGeometry /><lineBasicMaterial color="#ffffff" /></lineSegments></group>;
}

function WorkspaceFrame({ children, toolbar, dark = false }: { children: ReactNode; toolbar?: ReactNode; dark?: boolean }) {
  return <section className={dark ? "gu-workspace-frame dark" : "gu-workspace-frame"}>{toolbar}{children}</section>;
}

function GeometryToolbar({ items }: { items: Array<[string, ReactNode, boolean, (() => void) | undefined]> }) {
  return <div className="gu-toolbar">{items.map(([label, icon, active, action]) => <button key={label} type="button" title={label} aria-label={label} aria-pressed={active} className={active ? "active" : ""} onClick={action}>{icon}<span>{label}</span></button>)}</div>;
}

function Inspector<T extends string>({ title, tabs, active, onActive, children }: { title: string; tabs: Array<[T, string]>; active: T; onActive: (tab: T) => void; children: ReactNode }) {
  return <aside className="gu-inspector"><div className="gu-inspector-tabs" role="tablist" aria-label={title}>{tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={active === id} className={active === id ? "active" : ""} onClick={() => onActive(id)}>{label}</button>)}</div><div className="gu-inspector-body">{children}</div></aside>;
}

function VertexEditor({ label, locked = false, point, onChange, onLock }: { label: string; locked?: boolean; point: Point2D; onChange: (point: Point2D) => void; onLock?: () => void }) {
  return <div className="gu-vertex-row"><strong>{label}</strong><label>x<input type="number" value={point.x} disabled={locked} onChange={(event) => onChange({ ...point, x: Number(event.target.value) })} /></label><label>y<input type="number" value={point.y} disabled={locked} onChange={(event) => onChange({ ...point, y: Number(event.target.value) })} /></label><button type="button" onClick={onLock} aria-pressed={locked}>{locked ? <Lock /> : <Unlock />}{locked ? "Unlock" : "Lock"}</button><input aria-label={`${label} x`} type="range" min={-10} max={10} step={0.25} value={point.x} disabled={locked} onChange={(event) => onChange({ ...point, x: Number(event.target.value) })} /><input aria-label={`${label} y`} type="range" min={-10} max={10} step={0.25} value={point.y} disabled={locked} onChange={(event) => onChange({ ...point, y: Number(event.target.value) })} /></div>;
}

function RangeNumber({ label, value, min, max, step, color, onChange, disabled }: { label: string; value: number; min: number; max: number; step: number; color: string; onChange: (value: number) => void; disabled?: boolean }) {
  const handle = (event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value));
  return <label className="gu-range" style={{ "--range-color": color } as React.CSSProperties}><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={handle} /><input type="number" value={value} disabled={disabled} onChange={handle} /></label>;
}

function ResultGrid({ items }: { items: Array<[string, string, number | string]> }) {
  return <div className="gu-result-grid">{items.map(([title, sub, value]) => <div key={`${title}-${sub}`}><span>{title}</span>{sub && <small>{sub}</small>}<strong>{typeof value === "number" ? fmt(value) : value}</strong></div>)}</div>;
}

function FormulaCard({ title, formula, result }: { title: string; formula: string; result: string }) {
  return <div className="gu-formula-card"><h3>{title}</h3><code>{formula}</code><strong>{result}</strong></div>;
}

function FormulaHero({ formula, substitution, result }: { formula: string; substitution: string; result: string }) {
  return <div className="gu-formula-hero"><strong>{formula}</strong><span>{substitution}</span><b>{result}</b></div>;
}

function ProofSteps({ step, onStep, playing, onPlaying }: { step: number; onStep: (step: number) => void; playing: boolean; onPlaying: (value: boolean) => void }) {
  const steps = ["Build squares", "Compare areas", "Rearrange", "Verify"];
  return <div className="gu-proof-steps">{steps.map((item, index) => <button key={item} type="button" className={step === index ? "active" : ""} onClick={() => onStep(index)}><b>{index + 1}</b><span>{item}</span><Play /></button>)}<div className="gu-proof-actions"><button type="button" onClick={() => onStep(Math.max(0, step - 1))}>Previous</button><button type="button" onClick={() => onPlaying(!playing)}>{playing ? "Pause" : "Play"}</button><button type="button" onClick={() => onStep(Math.min(3, step + 1))}>Next</button></div></div>;
}

function StatementPanel({ theorem }: { theorem: (typeof theoremRegistry)[number] }) {
  return <div className="gu-statement"><h3>Theorem</h3><p>{theorem.statement}</p><h3>Given</h3><p>{theorem.given}</p><h3>To Prove</h3><p>{theorem.prove}</p></div>;
}

function ProofSequence({ theorem, step, onPlay, onStep }: { theorem: (typeof theoremRegistry)[number]; step: number; onPlay?: () => void; onStep: (step: number) => void }) {
  return <div className="gu-proof-list">{theorem.steps.map((item, index) => <button key={item} type="button" className={step === index ? "active" : index < step ? "done" : ""} onClick={() => onStep(index)}><b>{index + 1}</b><span>{item}</span>{index <= step && <CheckCircle2 />}</button>)}<button type="button" className="gu-primary-action" onClick={onPlay}>Animate proof</button></div>;
}

function PresetButtons({ items }: { items: Array<[string, () => void]> }) {
  return <div className="gu-preset-buttons">{items.map(([label, action]) => <button key={label} type="button" onClick={action}>{label}</button>)}</div>;
}

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return <div className="gu-metric-card"><span>{title}</span><strong>{value}</strong><small>{subtitle}</small></div>;
}

function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return <div className="gu-info-card"><h3>{title}</h3>{lines.map((line) => <p key={line}>{line}</p>)}</div>;
}

function Warning({ children, tone = "warning" }: { children: ReactNode; tone?: "warning" | "success" | "danger" }) {
  return <p className={`gu-warning ${tone}`}>{children}</p>;
}

function BottomMetrics({ stats }: { stats: ReturnType<typeof triangleStats> }) {
  return <div className="gu-results-strip"><MetricCard title="Centroid G" value={`(${fmt(stats.centroid.x)}, ${fmt(stats.centroid.y)})`} subtitle="Average of vertices" /><MetricCard title="Triangle type" value={stats.classification} subtitle={stats.angleType} /><MetricCard title="Perimeter" value={fmt(stats.perimeter)} subtitle="a + b + c" /><MetricCard title="Area" value={fmt(stats.area)} subtitle="Determinant" /></div>;
}

function triangleStats(a: Point2D, b: Point2D, c: Point2D) {
  const cSide = distance2D(a.x, a.y, b.x, b.y);
  const aSide = distance2D(b.x, b.y, c.x, c.y);
  const bSide = distance2D(c.x, c.y, a.x, a.y);
  const area = triangleAreaFromPoints(a, b, c);
  const perimeter = trianglePerimeter(a, b, c);
  const angleA = triangleAngle(b, a, c);
  const angleB = triangleAngle(a, b, c);
  const angleC = triangleAngle(a, c, b);
  const sideValues = [aSide, bSide, cSide];
  const equalPairs = sideValues.filter((side, index) => sideValues.some((other, otherIndex) => index !== otherIndex && Math.abs(side - other) < 0.08)).length;
  const classification = equalPairs === 3 ? "Equilateral" : equalPairs > 0 ? "Isosceles" : "Scalene";
  const angleType = [angleA, angleB, angleC].some((angle) => Math.abs(angle - 90) < 0.8) ? "Right" : [angleA, angleB, angleC].some((angle) => angle > 90) ? "Obtuse" : "Acute";
  return { aSide, bSide, cSide, area, perimeter, angleA, angleB, angleC, centroid: { x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 }, classification, angleType };
}

function triangleAngle(p1: Point2D, vertex: Point2D, p2: Point2D) {
  const a = distance2D(vertex.x, vertex.y, p1.x, p1.y);
  const b = distance2D(vertex.x, vertex.y, p2.x, p2.y);
  const c = distance2D(p1.x, p1.y, p2.x, p2.y);
  if (a < 1e-6 || b < 1e-6) return 0;
  return Math.acos(clamp((a * a + b * b - c * c) / (2 * a * b), -1, 1)) * 180 / Math.PI;
}

function solidProperties(solid: SolidId, size: number, height: number) {
  if (solid === "sphere") return { volume: 4 / 3 * Math.PI * (size / 2) ** 3, surfaceArea: 4 * Math.PI * (size / 2) ** 2, baseArea: Math.PI * (size / 2) ** 2, diagonal: size, faces: 1, edges: 0, vertices: 0, formula: "V = 4/3πr³, SA = 4πr²" };
  if (solid === "cylinder") return { volume: Math.PI * (size / 2) ** 2 * height, surfaceArea: 2 * Math.PI * (size / 2) * ((size / 2) + height), baseArea: Math.PI * (size / 2) ** 2, diagonal: Math.hypot(size, height), faces: 3, edges: 2, vertices: 0, formula: "V = πr²h, SA = 2πr(r+h)" };
  if (solid === "cone") return { volume: Math.PI * (size / 2) ** 2 * height / 3, surfaceArea: Math.PI * (size / 2) * ((size / 2) + Math.hypot(size / 2, height)), baseArea: Math.PI * (size / 2) ** 2, diagonal: Math.hypot(size, height), faces: 2, edges: 1, vertices: 1, formula: "V = 1/3πr²h, SA = πr(r+l)" };
  if (solid === "cuboid") return { volume: size * (size * 0.72) * height, surfaceArea: 2 * (size * size * 0.72 + size * height + size * 0.72 * height), baseArea: size * size * 0.72, diagonal: Math.hypot(size, size * 0.72, height), faces: 6, edges: 12, vertices: 8, formula: "V = lwh, SA = 2(lw+lh+wh)" };
  return { volume: size ** 3, surfaceArea: 6 * size ** 2, baseArea: size ** 2, diagonal: Math.sqrt(3) * size, faces: solid === "tetrahedron" ? 4 : 6, edges: solid === "tetrahedron" ? 6 : 12, vertices: solid === "tetrahedron" ? 4 : 8, formula: "V = s³, SA = 6s²" };
}

function readGeometryTab(): GeometryTab {
  const value = new URLSearchParams(window.location.search).get("tab") as GeometryTab | null;
  return geometryTabs.some((item) => item.id === value) ? value! : "triangles";
}

function readGeometryValues() {
  return {
    a: { x: readNumber("v_ax", -5), y: readNumber("v_ay", -3) },
    b: { x: readNumber("v_bx", 5), y: readNumber("v_by", -2) },
    c: { x: readNumber("v_cx", 0), y: readNumber("v_cy", 5) },
    sideA: readNumber("v_side_a", 4),
    sideB: readNumber("v_side_b", 3),
    radius: readNumber("v_radius_r", 5),
    sectorAngle: readNumber("v_sector_angle", 90),
  };
}

function readNumber(key: string, fallback: number) {
  const raw = new URLSearchParams(window.location.search).get(key);
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function updateQuery(values: Record<string, string | number | boolean>, push = false) {
  const url = new URL(window.location.href);
  Object.entries(values).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  if (push) window.history.pushState(window.history.state, "", url);
  else window.history.replaceState(window.history.state, "", url);
}

function normalizeProgress(progress: number) {
  const normalized = progress > 1 ? progress : progress * 100;
  return Math.max(25, Math.min(100, Math.round(normalized || 75)));
}

function openActiveFullscreen() {
  const target = document.querySelector<HTMLElement>(".gu-workspace-frame:hover, .gu-solid-main:hover, .gu-workspace-frame");
  void target?.requestFullscreen?.();
}

function solidWorkspaceHref(solid?: SolidId) {
  const url = new URL("/workspace/3d", window.location.origin);
  if (solid) url.searchParams.set("solid", solid);
  return `${url.pathname}${url.search}`;
}

function toX(x: number) { return 360 + x * 34; }
function toY(y: number) { return 260 - y * 24; }
function svgPoint(point: Point2D) { return { x: toX(point.x), y: toY(point.y) }; }
function mid(a: { x: number; y: number }, b: { x: number; y: number }) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
function fmt(value: number) { return Number.isFinite(value) ? roundTo(value, 2).toString() : "undefined"; }

function TextAt({ p, text, color }: { p: { x: number; y: number }; text: string; color: string }) {
  return <ReadableText x={p.x + 8} y={p.y - 8} color={color}>{text}</ReadableText>;
}

function AngleArc({ p, label, color }: { p: { x: number; y: number }; label: string; color: string }) {
  return <g><circle cx={p.x} cy={p.y} r="30" fill="none" stroke={color} strokeWidth="3" opacity=".85" strokeDasharray="65 160" /><ReadableText x={p.x + 18} y={p.y - 22} color={color}>{label.replace(/(?:Â)?°/g, " deg")}</ReadableText></g>;
}

function ReadableText({ x, y, color, children }: { x: number; y: number; color: string; children: ReactNode }) {
  return <text x={x} y={y} fill={color} className="gu-readable-label">{children}</text>;
}

function GridPattern({ dark = false }: { dark?: boolean }) {
  return <g className={dark ? "grid-dark" : ""}>{Array.from({ length: 31 }, (_, i) => <g key={i}><line x1={i * 24} x2={i * 24} y1="0" y2="520" /><line y1={i * 24} y2={i * 24} x1="0" x2="720" /></g>)}</g>;
}
