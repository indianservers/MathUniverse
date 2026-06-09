import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Circle, Download, Eraser, GitBranch, LineChart, Magnet, MousePointer2, Move, PanelLeftClose, PanelLeftOpen, Pause, Pentagon, Play, Plus, Presentation, Radius, RotateCcw, Save, Search, Slash, Square, Target, Trash2, Triangle, ZoomIn, ZoomOut } from "lucide-react";
import { CSSProperties, KeyboardEvent, PointerEvent, ReactNode, useMemo, useRef, useState } from "react";
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
type GeometryTool = "select" | "point" | "segment" | "line" | "ray" | "vector" | "circle" | "polygon" | "angle" | "angle-bisector" | "tangent" | "parallel" | "perpendicular" | "midpoint" | "fixed-length" | "on-circle" | "intersect";
type WorkspaceTab = "solve" | "geometry" | "space3d" | "tools";
type GeoPoint = { id: string; x: number; y: number; label: string; locked?: boolean };
type GeoLineKind = "segment" | "line" | "ray" | "vector";
type GeoLine = { id: string; a: string; b: string; kind?: GeoLineKind; locked?: boolean };
type GeoCircle = { id: string; center: string; edge: string; locked?: boolean };
type GeoPolygon = { id: string; points: string[]; locked?: boolean };
type GeoAngle = { id: string; a: string; vertex: string; b: string; locked?: boolean };
type GeoConicKind = "parabola" | "ellipse" | "hyperbola";
type GeoConic = { id: string; kind: GeoConicKind; center: string; a: number; b: number; locked?: boolean };
type GeoTransformKind = "reflection" | "rotation" | "dilation";
type GeoTransform = { id: string; type: GeoTransformKind; sourceKind: "point" | "polygon" | "circle" | "conic"; sourceId: string; resultIds: string[]; center?: string; angle?: number; scale?: number };
type SelectedGeoObject = { kind: "point" | "line" | "circle" | "polygon" | "angle" | "conic" | "transform" | "constraint"; id: string } | null;
type GeoConstraint =
  | { id: string; type: "parallel" | "perpendicular"; sourceLine: string; throughPoint: string; line: string }
  | { id: string; type: "midpoint"; a: string; b: string; point: string }
  | { id: string; type: "fixed-length"; anchor: string; point: string; length: number }
  | { id: string; type: "on-circle"; point: string; circle: string }
  | { id: string; type: "angle-bisector"; a: string; vertex: string; b: string; line: string }
  | { id: string; type: "tangent"; circle: string; throughPoint: string; tangentPoint: string; line: string }
  | { id: string; type: "intersection"; first: string; second: string; point: string };
type Construction = { points: GeoPoint[]; lines: GeoLine[]; circles: GeoCircle[]; polygons: GeoPolygon[]; angles: GeoAngle[]; conics: GeoConic[]; transforms: GeoTransform[]; constraints: GeoConstraint[] };
type ConstructionHistoryEntry = { id: string; label: string; timestamp: number; before: Construction };
type DependencyNode = { id: string; label: string; parents: string[]; children: string[]; status: "free" | "dependent" | "locked" | "warning" };
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
  showAxes3d: boolean;
  showGrid3d: boolean;
  showCrossSection3d: boolean;
  showVector3d: boolean;
  showPoint3d: boolean;
  autoRotate3d: boolean;
  zoom3d: number;
};

const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#14b8a6"];
const regressionSeed: ResultTableRow[] = [{ x: -4, y: -5.6 }, { x: -2, y: -2.2 }, { x: 0, y: 0.7 }, { x: 2, y: 4.1 }, { x: 4, y: 7.4 }];
const initialConstruction: Construction = { points: [], lines: [], circles: [], polygons: [], angles: [], conics: [], transforms: [], constraints: [] };
const examples = ["plot sin(x)", "solve x^2-5*x+6=0", "factor x^2-5*x+6", "derivative x^3-2*x", "integral 3*x^2", "table sin(x)", "roots x^2-4", "extrema x^2-4*x+1", "intersect x^2 and 2*x+3"];
const guidedExamples = [
  { title: "Quadratic Roots", command: "solve x^2-5*x+6=0" },
  { title: "Derivative Check", command: "derivative x^3-2*x" },
  { title: "Function Table", command: "table sin(x)" },
  { title: "Intersections", command: "intersect x^2 and 2*x+3" },
];
const workspaceTabs: { id: WorkspaceTab; label: string; summary: string }[] = [
  { id: "solve", label: "Solve & Graph", summary: "CAS input, graphing, and results" },
  { id: "geometry", label: "Geometry", summary: "Constructor, constraints, and measurements" },
  { id: "space3d", label: "3D Lab", summary: "Surfaces, solids, and camera controls" },
  { id: "tools", label: "Tools", summary: "Save, export, examples, formulas" },
];
const workspacePhases = [
  { phase: 1, title: "Object Kernel", status: "Done", scope: "Geometry and 3D object browser, properties, edit controls, visibility, and delete/remove behavior." },
  { phase: 2, title: "Construction Tool Depth", status: "Done", scope: "Segments, rays, infinite lines, vectors, angles, bisectors, tangents, labeled measurements, and named object creation modes." },
  { phase: 3, title: "Dependency Algebra", status: "Done", scope: "Full dependency tree, parent-child locking, recompute history, undo/redo timeline, and constraint diagnostics." },
  { phase: 4, title: "Advanced Geometry", status: "Active", scope: "Conics, transformations, reflections, rotations, dilations, coordinate geometry, and theorem helpers." },
  { phase: 5, title: "3D Object Studio", status: "Planned", scope: "Planes, lines, vectors, polyhedra, parametric surfaces, clipping, measurement tools, and object transforms." },
  { phase: 6, title: "CAS + Visual Sync", status: "Planned", scope: "Algebra/CAS expressions linked live to graph, geometry, sliders, and symbolic result panels." },
  { phase: 7, title: "Animation Engine", status: "Planned", scope: "Timelines, keyframes, traces, sliders, play/pause, snapshots, and motion-path exports." },
  { phase: 8, title: "Classroom Authoring", status: "Planned", scope: "Activity builder, step cards, hints, quizzes, teacher notes, and shareable lessons." },
  { phase: 9, title: "Import Export Suite", status: "Planned", scope: "JSON, SVG, PNG, CSV, printable sheets, offline files, and construction templates." },
  { phase: 10, title: "Polish and Scale", status: "Planned", scope: "Performance, keyboard shortcuts, accessibility, mobile gestures, plugin API, and browser-only persistence." },
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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("solve");
  const [input, setInput] = useState("plot sin(x)");
  const [results, setResults] = useState<ResultCard[]>([]);
  const [plots, setPlots] = useState<PlotItem[]>([{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }]);
  const [tool, setTool] = useState<GeometryTool>("select");
  const [construction, setConstruction] = useState<Construction>(initialConstruction);
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [selectedCircleIds, setSelectedCircleIds] = useState<string[]>([]);
  const [selectedGeoObject, setSelectedGeoObject] = useState<SelectedGeoObject>(null);
  const [dragPointId, setDragPointId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<ConstructionHistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<ConstructionHistoryEntry[]>([]);
  const [polygonDraft, setPolygonDraft] = useState<string[]>([]);
  const [surface, setSurface] = useState<SurfaceKind>("paraboloid");
  const [solid, setSolid] = useState<SolidKind>("cube");
  const [surfaceScale, setSurfaceScale] = useState(1);
  const [height3d, setHeight3d] = useState(2.5);
  const [crossSection, setCrossSection] = useState(0);
  const [showSurface, setShowSurface] = useState(true);
  const [showSolid, setShowSolid] = useState(true);
  const [showAxes3d, setShowAxes3d] = useState(true);
  const [showGrid3d, setShowGrid3d] = useState(true);
  const [showCrossSection3d, setShowCrossSection3d] = useState(true);
  const [showVector3d, setShowVector3d] = useState(true);
  const [showPoint3d, setShowPoint3d] = useState(true);
  const [autoRotate3d, setAutoRotate3d] = useState(true);
  const [zoom3d, setZoom3d] = useState(1);
  const [spaceControlsOpen, setSpaceControlsOpen] = useState(true);
  const [formulaSearch, setFormulaSearch] = useState("");
  const [teachingMode, setTeachingMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const graphExportRef = useRef<HTMLDivElement>(null);
  const geometryExportRef = useRef<SVGSVGElement | null>(null);
  const selectedPointIdsRef = useRef<string[]>([]);
  const polygonDraftRef = useRef<string[]>([]);
  const selectedCircleIdsRef = useRef<string[]>([]);

  const filteredFormulas = useMemo(() => {
    const query = formulaSearch.trim().toLowerCase();
    return formulaLibrary.filter((item) => !query || [item.topic, item.title, item.formula].join(" ").toLowerCase().includes(query));
  }, [formulaSearch]);

  const commitConstruction = (label: string, updater: (current: Construction) => Construction, draggedPointId?: string) => {
    setConstruction((current) => {
      const next = solveConstruction(updater(current), draggedPointId);
      if (constructionSignature(current) !== constructionSignature(next)) {
        setUndoStack((stack) => [{ id: crypto.randomUUID(), label, timestamp: Date.now(), before: current }, ...stack].slice(0, 30));
        setRedoStack([]);
      }
      return next;
    });
  };

  const restoreConstruction = (next: Construction) => {
    setConstruction(solveConstruction(next));
    setPendingPointIds([]);
    setPendingPolygonDraft([]);
    setPendingCircleIds([]);
    setSelectedGeoObject(null);
  };

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
    const point: GeoPoint = { id, x, y, label: nextPointLabel(construction.points) };
    commitConstruction("Add point", (current) => ({ ...current, points: [...current.points, point] }));
    return id;
  };
  const setPendingPointIds = (ids: string[]) => {
    selectedPointIdsRef.current = ids;
    setSelectedPointIds(ids);
  };
  const setPendingPolygonDraft = (ids: string[]) => {
    polygonDraftRef.current = ids;
    setPolygonDraft(ids);
  };
  const setPendingCircleIds = (ids: string[]) => {
    selectedCircleIdsRef.current = ids;
    setSelectedCircleIds(ids);
  };
  const queuePoint = (point: { x: number; y: number }) => {
    const id = crypto.randomUUID();
    commitConstruction("Add construction point", (current) => {
      const newPoint: GeoPoint = { id, x: point.x, y: point.y, label: nextPointLabel(current.points) };
      return { ...current, points: [...current.points, newPoint] };
    });
    return id;
  };
  const chooseGeometryTool = (nextTool: GeometryTool) => {
    setTool(nextTool);
    setPendingPointIds([]);
    setPendingPolygonDraft([]);
    setPendingCircleIds([]);
    if (nextTool === "intersect") commitConstruction("Add intersection", addIntersectionConstraint);
  };

  const handleBoardPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    if (event.pointerType === "touch") event.preventDefault();
    const target = event.target as Element;
    const pointId = target.closest("[data-point-id]")?.getAttribute("data-point-id");
    if (pointId) {
      if (tool === "select") {
        setPendingPointIds([pointId]);
        setSelectedGeoObject({ kind: "point", id: pointId });
        const picked = pointById(construction.points, pointId);
        if (!picked?.locked) setDragPointId(pointId);
      }
      else handlePointPick(pointId);
      return;
    }
    const point = clientToBoard(event);
    if (!point) return;
    if (tool === "select") {
      setPendingPointIds([]);
      setSelectedGeoObject(null);
      return;
    }
    if (tool === "point") {
      addPoint(point.x, point.y);
      return;
    }
    if (["segment", "line", "ray", "vector", "circle", "polygon", "angle", "angle-bisector", "tangent", "parallel", "perpendicular", "midpoint", "fixed-length", "on-circle"].includes(tool)) {
      handlePointPick(queuePoint(point));
    }
  };

  const handlePointPick = (pointId: string) => {
    if (tool === "segment" || tool === "line" || tool === "ray" || tool === "vector") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        commitConstruction(`Add ${lineKindLabel(tool)}`, (current) => ({ ...current, lines: [...current.lines, { id: crypto.randomUUID(), a: next[0], b: next[1], kind: tool }] }));
        setPendingPointIds([]);
      }
    }
    if (tool === "circle") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        commitConstruction("Add circle", (current) => ({ ...current, circles: [...current.circles, { id: crypto.randomUUID(), center: next[0], edge: next[1] }] }));
        setPendingPointIds([]);
      }
    }
    if (tool === "polygon") {
      const next = polygonDraftRef.current.includes(pointId) ? polygonDraftRef.current : [...polygonDraftRef.current, pointId];
      if (next.length >= 3) {
        commitConstruction("Add polygon", (current) => ({ ...current, polygons: [...current.polygons, { id: crypto.randomUUID(), points: next }] }));
        setPendingPolygonDraft([]);
      } else setPendingPolygonDraft(next);
    }
    if (tool === "angle" || tool === "angle-bisector") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-3);
      setPendingPointIds(next);
      if (next.length === 3 && new Set(next).size === 3) {
        commitConstruction(tool === "angle" ? "Add angle" : "Add angle bisector", (current) => tool === "angle" ? addAngleObject(current, next[0], next[1], next[2]) : addAngleBisectorConstraint(current, next[0], next[1], next[2]));
        setPendingPointIds([]);
      }
    }
    if (tool === "tangent") {
      const next = [...selectedPointIdsRef.current.filter((id) => id !== pointId), pointId].slice(-1);
      setPendingPointIds(next);
      if (selectedCircleIdsRef.current[0]) {
        commitConstruction("Add tangents", (current) => addTangentConstruction(current, selectedCircleIdsRef.current[0], pointId));
        setPendingPointIds([]);
        setPendingCircleIds([]);
      }
    }
    if (tool === "parallel" || tool === "perpendicular") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-3);
      setPendingPointIds(next);
      if (next.length === 3 && next[0] !== next[1] && next[2] !== next[0] && next[2] !== next[1]) {
        commitConstruction(`Add ${tool} line`, (current) => addParallelPerpendicularConstraint(current, tool, next[0], next[1], next[2]));
        setPendingPointIds([]);
      }
    }
    if (tool === "midpoint" || tool === "fixed-length") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        commitConstruction(tool === "midpoint" ? "Add midpoint" : "Add fixed length", (current) => tool === "midpoint" ? addMidpointConstraint(current, next[0], next[1]) : addFixedLengthConstraint(current, next[0], next[1]));
        setPendingPointIds([]);
      }
    }
    if (tool === "on-circle") {
      commitConstruction("Constrain point to circle", (current) => addPointOnCircleConstraint(current, pointId));
      setPendingPointIds([]);
    }
    if (tool === "intersect") {
      commitConstruction("Add intersection", addIntersectionConstraint);
      setPendingPointIds([]);
    }
  };
  const handleCirclePick = (circleId: string) => {
    if (tool !== "tangent") {
      setSelectedGeoObject({ kind: "circle", id: circleId });
      return;
    }
    setPendingCircleIds([circleId]);
    if (selectedPointIdsRef.current[0]) {
      commitConstruction("Add tangents", (current) => addTangentConstruction(current, circleId, selectedPointIdsRef.current[0]));
      setPendingPointIds([]);
      setPendingCircleIds([]);
    }
  };
  const deleteSelectedGeometry = () => {
    if (selectedGeoObject) {
      deleteGeometryObject(selectedGeoObject.kind, selectedGeoObject.id);
      return;
    }
    if (!selectedPointIds.length) return;
    const selected = new Set(selectedPointIds);
    commitConstruction("Delete selected objects", (current) => ({
      points: current.points.filter((point) => !selected.has(point.id)),
      lines: current.lines.filter((line) => !selected.has(line.a) && !selected.has(line.b)),
      circles: current.circles.filter((circle) => !selected.has(circle.center) && !selected.has(circle.edge)),
      polygons: current.polygons.map((polygon) => ({ ...polygon, points: polygon.points.filter((id) => !selected.has(id)) })).filter((polygon) => polygon.points.length >= 3),
      angles: current.angles.filter((angle) => !selected.has(angle.a) && !selected.has(angle.vertex) && !selected.has(angle.b)),
      conics: current.conics.filter((conic) => !selected.has(conic.center)),
      transforms: current.transforms.filter((transform) => transform.resultIds.every((id) => !selected.has(id))),
      constraints: current.constraints.filter((constraint) => constraintPointIds(constraint).every((id) => !selected.has(id))),
    }));
    setPendingPointIds([]);
    setSelectedGeoObject(null);
    setPendingPolygonDraft(polygonDraftRef.current.filter((id) => !selected.has(id)));
  };
  const deleteGeometryObject = (kind: NonNullable<SelectedGeoObject>["kind"], id: string) => {
    commitConstruction(`Delete ${kind}`, (current) => removeGeometryObject(current, kind, id));
    setPendingPointIds(kind === "point" ? selectedPointIdsRef.current.filter((pointId) => pointId !== id) : selectedPointIdsRef.current);
    setPendingPolygonDraft(kind === "point" ? polygonDraftRef.current.filter((pointId) => pointId !== id) : polygonDraftRef.current);
    setPendingCircleIds(kind === "circle" ? selectedCircleIdsRef.current.filter((circleId) => circleId !== id) : selectedCircleIdsRef.current);
    setSelectedGeoObject(null);
  };
  const updateGeometryPoint = (id: string, patch: Partial<Pick<GeoPoint, "label" | "x" | "y">>) => {
    commitConstruction("Edit point", (current) => ({
      ...current,
      points: current.points.map((point) => point.id === id ? { ...point, ...patch } : point),
    }), id);
  };
  const updateGeometryLine = (id: string, patch: Partial<Pick<GeoLine, "a" | "b" | "kind">>) => {
    commitConstruction("Edit line", (current) => ({
      ...current,
      lines: current.lines.map((line) => line.id === id ? { ...line, ...patch } : line),
    }));
  };
  const updateGeometryCircle = (id: string, patch: Partial<Pick<GeoCircle, "center" | "edge">>) => {
    commitConstruction("Edit circle", (current) => ({
      ...current,
      circles: current.circles.map((circle) => circle.id === id ? { ...circle, ...patch } : circle),
    }));
  };
  const updateGeometryPolygon = (id: string, points: string[]) => {
    commitConstruction("Edit polygon", (current) => ({
      ...current,
      polygons: current.polygons.map((polygon) => polygon.id === id ? { ...polygon, points } : polygon),
    }));
  };
  const updateGeometryAngle = (id: string, patch: Partial<Pick<GeoAngle, "a" | "vertex" | "b">>) => {
    commitConstruction("Edit angle", (current) => ({
      ...current,
      angles: current.angles.map((angle) => angle.id === id ? { ...angle, ...patch } : angle),
    }));
  };
  const updateGeometryConic = (id: string, patch: Partial<Pick<GeoConic, "kind" | "center" | "a" | "b">>) => {
    commitConstruction("Edit conic", (current) => ({
      ...current,
      conics: current.conics.map((conic) => conic.id === id ? { ...conic, ...patch } : conic),
    }));
  };
  const toggleGeometryLock = (kind: Exclude<NonNullable<SelectedGeoObject>["kind"], "constraint" | "transform">, id: string) => {
    commitConstruction(`Toggle ${kind} lock`, (current) => toggleObjectLock(current, kind, id));
  };
  const addGeometryTemplate = (kind: "triangle" | "rectangle" | "circle" | GeoConicKind) => {
    setPendingPointIds([]);
    setPendingPolygonDraft([]);
    commitConstruction(`Add ${kind} template`, (current) => {
      const start = current.points.length;
      const makePoint = (x: number, y: number, index: number): GeoPoint => ({ id: crypto.randomUUID(), x, y, label: pointLabelForIndex(start + index) });
      if (kind === "triangle") {
        const points = [makePoint(220, 300, 0), makePoint(420, 300, 1), makePoint(320, 150, 2)];
        const angle: GeoAngle = { id: crypto.randomUUID(), a: points[0].id, vertex: points[2].id, b: points[1].id };
        return { ...current, points: [...current.points, ...points], polygons: [...current.polygons, { id: crypto.randomUUID(), points: points.map((point) => point.id) }], angles: [...current.angles, angle] };
      }
      if (kind === "rectangle") {
        const points = [makePoint(210, 130, 0), makePoint(440, 130, 1), makePoint(440, 300, 2), makePoint(210, 300, 3)];
        return { ...current, points: [...current.points, ...points], polygons: [...current.polygons, { id: crypto.randomUUID(), points: points.map((point) => point.id) }] };
      }
      const points = [makePoint(320, 210, 0), makePoint(440, 210, 1)];
      if (kind === "circle") return { ...current, points: [...current.points, ...points], circles: [...current.circles, { id: crypto.randomUUID(), center: points[0].id, edge: points[1].id }] };
      const center = makePoint(kind === "parabola" ? 210 : kind === "ellipse" ? 320 : 450, 210, 0);
      const conic: GeoConic = { id: crypto.randomUUID(), kind, center: center.id, a: kind === "parabola" ? 70 : 92, b: kind === "hyperbola" ? 52 : 62 };
      return { ...current, points: [...current.points, center], conics: [...current.conics, conic] };
    });
  };
  const applyGeometryTransform = (type: GeoTransformKind) => {
    if (!selectedGeoObject || selectedGeoObject.kind === "line" || selectedGeoObject.kind === "angle" || selectedGeoObject.kind === "constraint" || selectedGeoObject.kind === "transform") return;
    commitConstruction(`Apply ${type}`, (current) => addTransformConstruction(current, selectedGeoObject, type));
  };

  const handleBoardPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragPointId) return;
    if (event.pointerType === "touch") event.preventDefault();
    const point = clientToBoard(event);
    if (!point) return;
    setConstruction((current) => {
      const dragged = pointById(current.points, dragPointId);
      if (dragged?.locked) return current;
      return solveConstruction({
      ...current,
      points: current.points.map((item) => item.id === dragPointId ? { ...item, x: point.x, y: point.y } : item),
      }, dragPointId);
    });
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
    setUndoStack((stack) => {
      const [entry, ...rest] = stack;
      if (!entry) return stack;
      setConstruction((current) => {
        setRedoStack((redo) => [{ id: crypto.randomUUID(), label: `Redo ${entry.label}`, timestamp: Date.now(), before: current }, ...redo].slice(0, 30));
        return solveConstruction(entry.before);
      });
      return rest;
    });
  };
  const redoConstruction = () => {
    setRedoStack((stack) => {
      const [entry, ...rest] = stack;
      if (!entry) return stack;
      setConstruction((current) => {
        setUndoStack((undo) => [{ id: crypto.randomUUID(), label: `Undo ${entry.label.replace(/^Redo\s+/, "")}`, timestamp: Date.now(), before: current }, ...undo].slice(0, 30));
        return solveConstruction(entry.before);
      });
      return rest;
    });
  };

  const saveConstruction = () => localStorage.setItem("math-universe-workspace-construction", JSON.stringify(construction));
  const loadConstruction = () => {
    const saved = localStorage.getItem("math-universe-workspace-construction");
    if (saved) {
      restoreConstruction(normalizeConstruction(JSON.parse(saved) as Partial<Construction>));
      setUndoStack([]);
      setRedoStack([]);
    }
  };
  const snapshot = (): WorkspaceSnapshot => ({ input, results, plots, construction, surface, solid, surfaceScale, height3d, crossSection, showSurface, showSolid, showAxes3d, showGrid3d, showCrossSection3d, showVector3d, showPoint3d, autoRotate3d, zoom3d });
  const saveWorkspace = () => localStorage.setItem("math-universe-workspace-full", JSON.stringify(snapshot()));
  const loadWorkspace = () => {
    const saved = localStorage.getItem("math-universe-workspace-full");
    if (!saved) return;
    const data = JSON.parse(saved) as WorkspaceSnapshot;
    setInput(data.input);
    setResults(data.results ?? []);
    setPlots(data.plots ?? []);
    restoreConstruction(normalizeConstruction(data.construction ?? initialConstruction));
    setUndoStack([]);
    setRedoStack([]);
    setSurface(data.surface ?? "paraboloid");
    setSolid(data.solid ?? "cube");
    setSurfaceScale(data.surfaceScale ?? 1);
    setHeight3d(data.height3d ?? 2.5);
    setCrossSection(data.crossSection ?? 0);
    setShowSurface(data.showSurface ?? true);
    setShowSolid(data.showSolid ?? true);
    setShowAxes3d(data.showAxes3d ?? true);
    setShowGrid3d(data.showGrid3d ?? true);
    setShowCrossSection3d(data.showCrossSection3d ?? true);
    setShowVector3d(data.showVector3d ?? true);
    setShowPoint3d(data.showPoint3d ?? true);
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
    <div className="flex h-[calc(100vh-5.5rem)] min-w-0 max-w-full flex-col gap-3 overflow-hidden" onKeyDown={handleWorkspaceKeyDown}>
      <div className="shrink-0">
        <TopicHeader title="Math Workspace" subtitle="A GeoGebra and Wolfram-style workspace for graphing, commands, results, and geometric construction." difficulty="All levels" estimatedMinutes={45} />
      </div>

      <div className="mobile-safe-scroll thin-scrollbar flex shrink-0 gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1.5 dark:border-white/10 dark:bg-slate-950/60 sm:flex-wrap sm:overflow-visible">
        {workspaceTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-10 shrink-0 rounded-xl px-4 py-1.5 text-left transition ${
              activeTab === tab.id ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
            }`}
          >
            <span className="block text-sm font-black">{tab.label}</span>
            <span className="block text-[11px] font-semibold opacity-75">{tab.summary}</span>
          </button>
        ))}
      </div>

      {activeTab === "tools" && (
      <SectionCard title="Stage 5: Workspace Tools" description="Save, export, teach, search formulas, and launch guided examples. Shortcuts: Ctrl+S save, Ctrl+O load, Ctrl+Enter run." className="flex min-h-0 flex-1 flex-col" compact>
        <div className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-4 overflow-auto pr-1">
            <WorkspacePhaseRoadmap />
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
          <div className="thin-scrollbar min-h-0 min-w-0 overflow-auto pr-1">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4 text-cyan-500" />Formula Library</span>
              <input value={formulaSearch} onChange={(event) => setFormulaSearch(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950" placeholder="Search formula, topic, command..." />
            </label>
            <div className="thin-scrollbar mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-1">
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
      )}

      {activeTab === "solve" && (
      <SectionCard title="Stage 1 + 3: Unified Math Input and CAS Answers" description="Type a calculation or command such as plot, solve, factor, derivative, integral, table, roots, extrema, or intersection." className="flex min-h-0 flex-1 flex-col" compact>
        <div className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-3 overflow-auto pr-1">
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
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-3 overflow-auto pr-1">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Results</h2>
              <button type="button" onClick={() => setResults([])} className="rounded-full bg-slate-100 p-2 dark:bg-white/10" title="Clear results" aria-label="Clear results"><Trash2 className="h-4 w-4" /></button>
            </div>
            {results.length === 0 ? <EmptyPanel text="Run a command to see interpretation, exact result, numeric checks, and related output." /> : results.map((result) => <ResultCardView key={result.id} result={result} />)}
          </div>
        </div>
      </SectionCard>
      )}

      {activeTab === "space3d" && (
      <SectionCard title="Stage 4: 3D Graphing and Solids Lab" className="flex min-h-0 flex-1 flex-col overflow-visible [&>div:first-of-type]:mb-1" compact>
        <div
          className="grid min-h-0 min-w-0 flex-1 gap-3 overflow-hidden 2xl:grid-cols-[var(--space-controls)_minmax(0,1fr)]"
          style={{ "--space-controls": spaceControlsOpen ? "320px" : "56px" } as CSSProperties}
        >
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-3 overflow-auto pr-1">
            <button
              type="button"
              className="tool-button w-full justify-between"
              onClick={() => setSpaceControlsOpen((value) => !value)}
              aria-label={spaceControlsOpen ? "Collapse 3D controls" : "Expand 3D controls"}
            >
              {spaceControlsOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              {spaceControlsOpen && <span>3D controls</span>}
            </button>
            {spaceControlsOpen ? (
            <>
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
              <Toggle checked={showAxes3d} label="Axes" onChange={setShowAxes3d} />
              <Toggle checked={showGrid3d} label="Grid" onChange={setShowGrid3d} />
              <Toggle checked={showCrossSection3d} label="Slice" onChange={setShowCrossSection3d} />
              <Toggle checked={showVector3d} label="Vector" onChange={setShowVector3d} />
              <button type="button" onClick={() => setAutoRotate3d((value) => !value)} className={autoRotate3d ? "action-primary justify-center" : "tool-button justify-center"}>
                {autoRotate3d ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {autoRotate3d ? "Pause rotation" : "Start rotation"}
              </button>
              <button type="button" onClick={() => { setZoom3d(1); setSurfaceScale(1); setCrossSection(0); setAutoRotate3d(false); setShowSurface(true); setShowSolid(true); setShowAxes3d(true); setShowGrid3d(true); setShowCrossSection3d(true); setShowVector3d(true); setShowPoint3d(true); }} className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold dark:bg-white/10">Reset</button>
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
            </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button type="button" onClick={() => setAutoRotate3d((value) => !value)} className={autoRotate3d ? "action-primary aspect-square w-full p-0" : "tool-button aspect-square w-full p-0"} aria-label={autoRotate3d ? "Pause rotation" : "Start rotation"}>
                  {autoRotate3d ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button type="button" onClick={() => setZoom3d(1)} className="tool-button aspect-square w-full p-0" aria-label="Reset 3D zoom">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="thin-scrollbar min-h-0 min-w-0 space-y-2 overflow-auto pr-1">
            <ThreeSceneWrapper
              height="clamp(240px, 32vh, 300px)"
              mobileHeight="280px"
              interactionLabel="Left drag rotate - wheel/pinch zoom - right drag pan"
              sceneLabel={autoRotate3d ? "Workspace 3D - rotating" : "Workspace 3D - paused"}
            >
              <ambientLight intensity={0.75} />
              <directionalLight position={[5, 6, 4]} intensity={1.2} />
              <Workspace3DScene surface={surface} solid={solid} surfaceScale={surfaceScale} solidSize={height3d} crossSection={crossSection} showSurface={showSurface} showSolid={showSolid} showAxes={showAxes3d} showGrid={showGrid3d} showCrossSection={showCrossSection3d} showVector={showVector3d} showPoint={showPoint3d} autoRotate={autoRotate3d} zoom={zoom3d} />
              <OrbitControls enablePan enableZoom enableDamping autoRotate={autoRotate3d} autoRotateSpeed={0.6} />
            </ThreeSceneWrapper>
            <Workspace3DInspector
              surface={surface}
              solid={solid}
              surfaceScale={surfaceScale}
              solidSize={height3d}
              crossSection={crossSection}
              showSurface={showSurface}
              showSolid={showSolid}
              showAxes={showAxes3d}
              showGrid={showGrid3d}
              showCrossSection={showCrossSection3d}
              showVector={showVector3d}
              showPoint={showPoint3d}
              autoRotate={autoRotate3d}
              zoom={zoom3d}
              onSurface={setSurface}
              onSolid={setSolid}
              onSurfaceScale={setSurfaceScale}
              onSolidSize={setHeight3d}
              onCrossSection={setCrossSection}
              onShowSurface={setShowSurface}
              onShowSolid={setShowSolid}
              onShowAxes={setShowAxes3d}
              onShowGrid={setShowGrid3d}
              onShowCrossSection={setShowCrossSection3d}
              onShowVector={setShowVector3d}
              onShowPoint={setShowPoint3d}
              onAutoRotate={setAutoRotate3d}
              onZoom={setZoom3d}
            />
            <div className="grid gap-2 md:grid-cols-3">
              <InfoPill title="Axes" text="X, Y, and Z directions are shown with colored vectors." />
              <InfoPill title="Surface" text="The mesh updates from the selected z=f(x,y) function." />
              <InfoPill title="Cross-section" text="The amber plane slices the surface at a chosen z-level." />
            </div>
          </div>
        </div>
      </SectionCard>
      )}

      {activeTab === "geometry" && (
      <SectionCard title="Stage 2: Geometry Constructor" description="Create points, lines, circles, polygons, drag points, and inspect live measurements." className="flex min-h-0 flex-1 flex-col" compact>
        <div className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-h-0 min-w-0 space-y-2 overflow-hidden">
            <div className="mobile-safe-scroll thin-scrollbar flex gap-2 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <ToolButton active={tool === "select"} label="Select / Drag" onClick={() => chooseGeometryTool("select")} icon={<MousePointer2 className="h-4 w-4" />} />
              <ToolButton active={tool === "point"} label="Point" onClick={() => chooseGeometryTool("point")} icon={<Plus className="h-4 w-4" />} />
              <ToolButton active={tool === "segment"} label="Segment" onClick={() => chooseGeometryTool("segment")} icon={<Move className="h-4 w-4" />} />
              <ToolButton active={tool === "line"} label="Line" onClick={() => chooseGeometryTool("line")} icon={<Move className="h-4 w-4" />} />
              <ToolButton active={tool === "ray"} label="Ray" onClick={() => chooseGeometryTool("ray")} icon={<GitBranch className="h-4 w-4" />} />
              <ToolButton active={tool === "vector"} label="Vector" onClick={() => chooseGeometryTool("vector")} icon={<Target className="h-4 w-4" />} />
              <ToolButton active={tool === "circle"} label="Circle" onClick={() => chooseGeometryTool("circle")} icon={<Circle className="h-4 w-4" />} />
              <ToolButton active={tool === "polygon"} label="Polygon" onClick={() => chooseGeometryTool("polygon")} icon={<Pentagon className="h-4 w-4" />} />
              <ToolButton active={tool === "angle"} label="Angle" onClick={() => chooseGeometryTool("angle")} icon={<Radius className="h-4 w-4" />} />
              <ToolButton active={tool === "angle-bisector"} label="Angle Bisector" onClick={() => chooseGeometryTool("angle-bisector")} icon={<Slash className="h-4 w-4" />} />
              <ToolButton active={tool === "tangent"} label="Tangents" onClick={() => chooseGeometryTool("tangent")} icon={<Circle className="h-4 w-4" />} />
              <ToolButton active={tool === "parallel"} label="Parallel" onClick={() => chooseGeometryTool("parallel")} icon={<Slash className="h-4 w-4" />} />
              <ToolButton active={tool === "perpendicular"} label="Perpendicular" onClick={() => chooseGeometryTool("perpendicular")} icon={<Plus className="h-4 w-4" />} />
              <ToolButton active={tool === "midpoint"} label="Midpoint" onClick={() => chooseGeometryTool("midpoint")} icon={<Magnet className="h-4 w-4" />} />
              <ToolButton active={tool === "fixed-length"} label="Fixed Length" onClick={() => chooseGeometryTool("fixed-length")} icon={<Magnet className="h-4 w-4" />} />
              <ToolButton active={tool === "on-circle"} label="Point on Circle" onClick={() => chooseGeometryTool("on-circle")} icon={<Circle className="h-4 w-4" />} />
              <ToolButton active={tool === "intersect"} label="Intersect" onClick={() => chooseGeometryTool("intersect")} icon={<Plus className="h-4 w-4" />} />
              <ToolButton label="Delete selected" onClick={deleteSelectedGeometry} icon={<Trash2 className="h-4 w-4" />} />
              <ToolButton label="Undo" onClick={undoConstruction} icon={<RotateCcw className="h-4 w-4" />} />
              <ToolButton label="Redo" onClick={redoConstruction} icon={<RotateCcw className="h-4 w-4" />} />
              <ToolButton label="Reset" onClick={() => { commitConstruction("Reset construction", () => initialConstruction); setPendingPointIds([]); setPendingPolygonDraft([]); setPendingCircleIds([]); setSelectedGeoObject(null); }} icon={<Eraser className="h-4 w-4" />} />
              <ToolButton label="Save" onClick={saveConstruction} icon={<Save className="h-4 w-4" />} />
              <ToolButton label="Load" onClick={loadConstruction} icon={<Download className="h-4 w-4" />} />
            </div>
            <div className="mobile-safe-scroll thin-scrollbar flex gap-2 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <button type="button" onClick={() => addGeometryTemplate("triangle")} className="tool-button"><Triangle className="h-4 w-4" />Triangle</button>
              <button type="button" onClick={() => addGeometryTemplate("rectangle")} className="tool-button"><Square className="h-4 w-4" />Rectangle</button>
              <button type="button" onClick={() => addGeometryTemplate("circle")} className="tool-button"><Circle className="h-4 w-4" />Circle</button>
              <button type="button" onClick={() => addGeometryTemplate("parabola")} className="tool-button"><LineChart className="h-4 w-4" />Parabola</button>
              <button type="button" onClick={() => addGeometryTemplate("ellipse")} className="tool-button"><Circle className="h-4 w-4" />Ellipse</button>
              <button type="button" onClick={() => addGeometryTemplate("hyperbola")} className="tool-button"><GitBranch className="h-4 w-4" />Hyperbola</button>
              <button type="button" onClick={() => applyGeometryTransform("reflection")} className="tool-button"><Slash className="h-4 w-4" />Reflect selected</button>
              <button type="button" onClick={() => applyGeometryTransform("rotation")} className="tool-button"><RotateCcw className="h-4 w-4" />Rotate selected</button>
              <button type="button" onClick={() => applyGeometryTransform("dilation")} className="tool-button"><ZoomIn className="h-4 w-4" />Dilate selected</button>
            </div>
            <svg
              ref={svgRef}
              data-export="geometry"
              viewBox="0 0 640 420"
              onPointerDown={handleBoardPointerDown}
              onPointerMove={handleBoardPointerMove}
              onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragPointId(null); }}
              onPointerLeave={() => setDragPointId(null)}
              className="h-[min(42vh,320px)] min-h-[220px] w-full max-w-full touch-none rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950"
            >
              <title>Math Universe Geometry Construction</title>
              <GeometryGrid />
              <ConstraintOverlays construction={construction} />
              {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} selected={selectedGeoObject?.kind === "polygon" && selectedGeoObject.id === polygon.id} onSelect={() => setSelectedGeoObject({ kind: "polygon", id: polygon.id })} />)}
              {construction.conics.map((conic) => <GeometryConic key={conic.id} conic={conic} points={construction.points} selected={selectedGeoObject?.kind === "conic" && selectedGeoObject.id === conic.id} onSelect={() => setSelectedGeoObject({ kind: "conic", id: conic.id })} />)}
              {construction.angles.map((angle) => <GeometryAngle key={angle.id} angle={angle} points={construction.points} selected={selectedGeoObject?.kind === "angle" && selectedGeoObject.id === angle.id} onSelect={() => setSelectedGeoObject({ kind: "angle", id: angle.id })} />)}
              {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} selected={selectedGeoObject?.kind === "line" && selectedGeoObject.id === line.id} onSelect={() => setSelectedGeoObject({ kind: "line", id: line.id })} />)}
              {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} selected={(selectedGeoObject?.kind === "circle" && selectedGeoObject.id === circle.id) || selectedCircleIds.includes(circle.id)} onSelect={() => handleCirclePick(circle.id)} />)}
              {polygonDraft.length > 1 && <polyline points={polygonDraft.map((id) => pointById(construction.points, id)).filter(Boolean).map((point) => `${point!.x},${point!.y}`).join(" ")} fill="none" stroke="#f59e0b" strokeDasharray="8 6" strokeWidth="3" />}
              {construction.points.map((point) => (
                <g key={point.id} data-point-id={point.id} className="cursor-pointer">
                  <circle cx={point.x} cy={point.y} r={selectedGeoObject?.kind === "point" && selectedGeoObject.id === point.id ? "12" : "9"} fill={selectedPointIds.includes(point.id) || polygonDraft.includes(point.id) || selectedGeoObject?.id === point.id ? "#f59e0b" : "#06b6d4"} stroke="#0f172a" strokeWidth="2" />
                  <text x={point.x + 12} y={point.y - 10} fill="#0f172a" className="select-none text-xs font-bold dark:fill-slate-100">{point.label}</text>
                </g>
              ))}
            </svg>
            <p className="rounded-2xl bg-cyan-50 p-3 text-xs font-semibold leading-5 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
              Touch mode: choose a tool, tap to place points, then drag existing points. Use the page outside the board to scroll.
            </p>
            <HiddenGeometryExport refSetter={(node) => { geometryExportRef.current = node; }} construction={construction} />
          </div>
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-3 overflow-auto pr-1">
            <ConstructionHelp tool={tool} />
            <GeometryObjectInspector
              construction={construction}
              selected={selectedGeoObject}
              onSelect={setSelectedGeoObject}
              onUpdatePoint={updateGeometryPoint}
              onUpdateLine={updateGeometryLine}
              onUpdateCircle={updateGeometryCircle}
              onUpdatePolygon={updateGeometryPolygon}
              onUpdateAngle={updateGeometryAngle}
              onUpdateConic={updateGeometryConic}
              onToggleLock={toggleGeometryLock}
              onDelete={deleteGeometryObject}
            />
            <Measurements construction={construction} />
            <DependencyPanel construction={construction} selected={selectedGeoObject} onSelect={setSelectedGeoObject} />
            <ConstraintPanel construction={construction} undoStack={undoStack} redoStack={redoStack} onUndo={undoConstruction} onRedo={redoConstruction} />
          </div>
        </div>
      </SectionCard>
      )}
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
            <div className="mobile-safe-scroll thin-scrollbar min-w-0 rounded-2xl border border-slate-200 dark:border-white/10">
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
      {construction.conics.map((conic) => <GeometryConic key={conic.id} conic={conic} points={construction.points} />)}
      {construction.angles.map((angle) => <GeometryAngle key={angle.id} angle={angle} points={construction.points} />)}
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
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{text}</p></div>;
}

function WorkspacePhaseRoadmap() {
  return (
    <div className="rounded-2xl border border-cyan-200/60 bg-cyan-50/80 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">GeoGebra challenger roadmap</p>
          <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">10-phase pure-browser Math Workspace</h3>
        </div>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white dark:bg-white dark:text-slate-950">Phase 1 active</span>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {workspacePhases.map((item) => (
          <div key={item.phase} className={`rounded-xl p-3 ${item.phase === 1 ? "bg-white shadow-sm dark:bg-slate-950/70" : "bg-white/60 dark:bg-white/10"}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-black">Phase {item.phase}: {item.title}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${item.phase === 1 ? "bg-cyan-500 text-white" : item.status === "Next" ? "bg-amber-400/20 text-amber-700 dark:text-amber-100" : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>{item.status}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.scope}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Workspace3DInspector({
  surface,
  solid,
  surfaceScale,
  solidSize,
  crossSection,
  showSurface,
  showSolid,
  showAxes,
  showGrid,
  showCrossSection,
  showVector,
  showPoint,
  autoRotate,
  zoom,
  onSurface,
  onSolid,
  onSurfaceScale,
  onSolidSize,
  onCrossSection,
  onShowSurface,
  onShowSolid,
  onShowAxes,
  onShowGrid,
  onShowCrossSection,
  onShowVector,
  onShowPoint,
  onAutoRotate,
  onZoom,
}: {
  surface: SurfaceKind;
  solid: SolidKind;
  surfaceScale: number;
  solidSize: number;
  crossSection: number;
  showSurface: boolean;
  showSolid: boolean;
  showAxes: boolean;
  showGrid: boolean;
  showCrossSection: boolean;
  showVector: boolean;
  showPoint: boolean;
  autoRotate: boolean;
  zoom: number;
  onSurface: (value: SurfaceKind) => void;
  onSolid: (value: SolidKind) => void;
  onSurfaceScale: (value: number) => void;
  onSolidSize: (value: number) => void;
  onCrossSection: (value: number) => void;
  onShowSurface: (value: boolean) => void;
  onShowSolid: (value: boolean) => void;
  onShowAxes: (value: boolean) => void;
  onShowGrid: (value: boolean) => void;
  onShowCrossSection: (value: boolean) => void;
  onShowVector: (value: boolean) => void;
  onShowPoint: (value: boolean) => void;
  onAutoRotate: (value: boolean) => void;
  onZoom: (value: number) => void;
}) {
  const objects = [
    { id: "axes", name: "Coordinate axes", visible: showAxes, onVisible: onShowAxes, details: "+x, +y, +z labels and origin marker" },
    { id: "grid", name: "Base grid", visible: showGrid, onVisible: onShowGrid, details: "10 x 10 reference floor" },
    { id: "surface", name: "Surface mesh", visible: showSurface, onVisible: onShowSurface, details: surfaceFormula(surface, surfaceScale) },
    { id: "solid", name: "Solid object", visible: showSolid, onVisible: onShowSolid, details: `${solid}, size ${roundTo(solidSize, 2)}` },
    { id: "cross-section", name: "Cross-section plane", visible: showCrossSection, onVisible: onShowCrossSection, details: `z = ${roundTo(crossSection, 2)}` },
    { id: "vector", name: "Vector ray", visible: showVector, onVisible: onShowVector, details: "orange vector from (-3, 0.05, -3) to P" },
    { id: "point", name: "Point P", visible: showPoint, onVisible: onShowPoint, details: "P(x,y,z) sample marker" },
  ];

  return (
    <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
        <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Phase 1 object kernel</p>
        <h3 className="text-sm font-black">3D Scene Objects</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {objects.map((object) => (
            <div key={object.id} className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-black">{object.name}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600 dark:text-slate-300">{object.details}</p>
                </div>
                <input className="mt-1 h-4 w-4 accent-cyan-400" type="checkbox" checked={object.visible} onChange={(event) => object.onVisible(event.target.checked)} aria-label={`Toggle ${object.name}`} />
              </div>
              <button type="button" className="mini-chip mt-2 w-full justify-center" onClick={() => object.onVisible(false)}>Remove from view</button>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
        <h3 className="text-sm font-black">3D Properties</h3>
        <div className="mt-2 grid gap-2">
          <label className="text-xs font-bold">
            Surface type
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={surface} onChange={(event) => onSurface(event.target.value as SurfaceKind)}>
              <option value="paraboloid">Paraboloid</option>
              <option value="saddle">Saddle</option>
              <option value="wave">Wave</option>
              <option value="plane">Plane</option>
              <option value="ripple">Ripple</option>
              <option value="cone-surface">Cone surface</option>
            </select>
          </label>
          <label className="text-xs font-bold">
            Solid type
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={solid} onChange={(event) => onSolid(event.target.value as SolidKind)}>
              <option value="cube">Cube</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="cone">Cone</option>
            </select>
          </label>
          <NumberField label="Surface scale" value={surfaceScale} min={0.2} max={2.5} step={0.1} onChange={onSurfaceScale} />
          <NumberField label="Solid size" value={solidSize} min={0.8} max={5} step={0.1} onChange={onSolidSize} />
          <NumberField label="Cross-section z" value={crossSection} min={-3} max={3} step={0.1} onChange={onCrossSection} />
          <NumberField label="Camera zoom" value={zoom} min={0.6} max={1.8} step={0.1} onChange={onZoom} />
          <Toggle checked={autoRotate} label="Auto rotate" onChange={onAutoRotate} />
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="text-xs font-bold">
      {label}
      <input
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-sm dark:border-white/10 dark:bg-slate-900"
        type="number"
        value={Number(value.toFixed(4))}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value))))}
      />
    </label>
  );
}

function Workspace3DScene({ surface, solid, surfaceScale, solidSize, crossSection, showSurface, showSolid, showAxes, showGrid, showCrossSection, showVector, showPoint, autoRotate, zoom }: { surface: SurfaceKind; solid: SolidKind; surfaceScale: number; solidSize: number; crossSection: number; showSurface: boolean; showSolid: boolean; showAxes: boolean; showGrid: boolean; showCrossSection: boolean; showVector: boolean; showPoint: boolean; autoRotate: boolean; zoom: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={groupRef} scale={zoom}>
      {showAxes && <Axes3D />}
      {showGrid && <gridHelper args={[10, 10, "#334155", "#1e293b"]} rotation={[0, 0, 0]} />}
      {showSurface && <SurfaceMesh surface={surface} scaleValue={surfaceScale} />}
      {showSolid && <SolidMesh solid={solid} size={solidSize} autoRotate={autoRotate} />}
      {showCrossSection && <CrossSectionPlane z={crossSection} />}
      {showVector && <VectorArrow start={[-3, 0.05, -3]} end={[2.2, 1.4, 1.8]} color="#f59e0b" />}
      {showPoint && <Point3D position={[2.2, 1.4, 1.8]} label="P" />}
    </group>
  );
}

function Axes3D() {
  return (
    <group>
      <VectorArrow start={[-5, 0, 0]} end={[5, 0, 0]} color="#ef4444" />
      <VectorArrow start={[0, -0.01, -5]} end={[0, -0.01, 5]} color="#22c55e" />
      <VectorArrow start={[0, -3, 0]} end={[0, 3, 0]} color="#38bdf8" />
      <SceneLabel position={[5.35, 0.15, 0]} text="+x" color="#fecaca" />
      <SceneLabel position={[0.25, 0.1, 5.35]} text="+y" color="#bbf7d0" />
      <SceneLabel position={[0.25, 3.25, 0]} text="+z height" color="#bae6fd" />
      <SceneLabel position={[0.1, 0.25, 0.35]} text="origin" color="#e2e8f0" size={0.18} />
    </group>
  );
}

function SceneLabel({ position, text, color, size = 0.22 }: { position: [number, number, number]; text: string; color: string; size?: number }) {
  return (
    <Text position={position} fontSize={size} color={color} anchorX="center" anchorY="middle" outlineColor="#020617" outlineWidth={0.012}>
      {text}
    </Text>
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
      <SceneLabel position={[0.42, 0.36, 0]} text={`${label}(x,y,z)`} color="#fde68a" size={0.18} />
    </group>
  );
}

function SurfaceMesh({ surface, scaleValue }: { surface: SurfaceKind; scaleValue: number }) {
  const geometry = useMemo(() => createSurfaceGeometry(surface, scaleValue), [surface, scaleValue]);
  return (
    <group>
      <mesh geometry={geometry} position={[0, 0, 0]}>
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.45} side={THREE.DoubleSide} roughness={0.35} metalness={0.08} />
      </mesh>
      <SceneLabel position={[-3.9, 2.8, -3.7]} text={surfaceFormula(surface, scaleValue)} color="#a5f3fc" size={0.18} />
      <SceneLabel position={[2.4, 1.15, -2.9]} text="slope / height changes" color="#fef3c7" size={0.17} />
    </group>
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

function SolidMesh({ solid, size, autoRotate }: { solid: SolidKind; size: number; autoRotate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current && autoRotate) ref.current.rotation.y += delta * 0.18;
  });
  return (
    <group>
      <mesh ref={ref} position={[3, size / 4, 2.6]}>
        {solid === "cube" && <boxGeometry args={[size, size, size]} />}
        {solid === "sphere" && <sphereGeometry args={[size / 2, 48, 28]} />}
        {solid === "cylinder" && <cylinderGeometry args={[size / 2, size / 2, size, 48]} />}
        {solid === "cone" && <coneGeometry args={[size / 2, size, 48]} />}
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.78} roughness={0.28} metalness={0.14} />
      </mesh>
      <SceneLabel position={[3, size + 0.55, 2.6]} text={`${solid}: size=${roundTo(size, 1)}`} color="#ddd6fe" size={0.18} />
    </group>
  );
}

function CrossSectionPlane({ z }: { z: number }) {
  return (
    <group>
      <mesh position={[0, z, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 5.5]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <SceneLabel position={[-2.9, z + 0.12, 2.9]} text={`cross-section: z=${roundTo(z, 2)}`} color="#fed7aa" size={0.17} />
    </group>
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

function GeometryLine({ line, points, selected, onSelect }: { line: GeoLine; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const a = pointById(points, line.a), b = pointById(points, line.b);
  if (!a || !b) return null;
  const kind = line.kind ?? "segment";
  const draw = lineDrawPoints(line, points);
  const midpoint = { x: (draw.x1 + draw.x2) / 2, y: (draw.y1 + draw.y2) / 2 };
  const stroke = kind === "vector" ? "#10b981" : kind === "ray" ? "#ec4899" : kind === "line" ? "#8b5cf6" : "#06b6d4";
  return (
    <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
      <defs>
        <marker id={`arrow-${line.id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={selected ? "#f59e0b" : stroke} />
        </marker>
      </defs>
      <line
        x1={draw.x1}
        y1={draw.y1}
        x2={draw.x2}
        y2={draw.y2}
        stroke={selected ? "#f59e0b" : stroke}
        strokeWidth={selected ? "7" : "4"}
        strokeDasharray={kind === "line" ? "10 7" : undefined}
        markerEnd={kind === "ray" || kind === "vector" ? `url(#arrow-${line.id})` : undefined}
      />
      <text x={midpoint.x + 8} y={midpoint.y - 8} fill={selected ? "#b45309" : stroke} className="select-none text-xs font-black">{lineKindLabel(kind)}</text>
    </g>
  );
}

function GeometryCircle({ circle, points, selected, onSelect }: { circle: GeoCircle; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!center || !edge) return null;
  return <circle cx={center.x} cy={center.y} r={distance(center, edge)} fill="rgba(34,211,238,.12)" stroke={selected ? "#f59e0b" : "#06b6d4"} strokeWidth={selected ? "7" : "4"} className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }} />;
}

function GeometryPolygon({ polygon, points, selected, onSelect }: { polygon: GeoPolygon; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const polygonPoints = polygon.points.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (polygonPoints.length < 3) return null;
  return <polygon points={polygonPoints.map((point) => `${point.x},${point.y}`).join(" ")} fill={selected ? "rgba(245,158,11,.28)" : "rgba(245,158,11,.16)"} stroke="#f59e0b" strokeWidth={selected ? "7" : "4"} className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }} />;
}

function GeometryConic({ conic, points, selected, onSelect }: { conic: GeoConic; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const center = pointById(points, conic.center);
  if (!center) return null;
  const stroke = conic.kind === "parabola" ? "#10b981" : conic.kind === "ellipse" ? "#8b5cf6" : "#ec4899";
  const label = `${conic.kind}: ${conicEquation(conic)}`;
  if (conic.kind === "ellipse") {
    return (
      <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
        <ellipse cx={center.x} cy={center.y} rx={conic.a} ry={conic.b} fill="rgba(139,92,246,.12)" stroke={selected ? "#f59e0b" : stroke} strokeWidth={selected ? "7" : "4"} />
        <line x1={center.x - conic.a} y1={center.y} x2={center.x + conic.a} y2={center.y} stroke={stroke} strokeDasharray="5 5" opacity="0.45" />
        <text x={center.x - conic.a} y={center.y - conic.b - 10} fill={selected ? "#b45309" : stroke} className="select-none text-xs font-black">{label}</text>
      </g>
    );
  }
  if (conic.kind === "hyperbola") {
    const left = conicPath(conic, center, -1);
    const right = conicPath(conic, center, 1);
    return (
      <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
        <path d={left} fill="none" stroke={selected ? "#f59e0b" : stroke} strokeWidth={selected ? "7" : "4"} />
        <path d={right} fill="none" stroke={selected ? "#f59e0b" : stroke} strokeWidth={selected ? "7" : "4"} />
        <line x1={center.x - conic.a * 2.2} y1={center.y + conic.b * 2.2} x2={center.x + conic.a * 2.2} y2={center.y - conic.b * 2.2} stroke={stroke} strokeDasharray="6 6" opacity="0.35" />
        <line x1={center.x - conic.a * 2.2} y1={center.y - conic.b * 2.2} x2={center.x + conic.a * 2.2} y2={center.y + conic.b * 2.2} stroke={stroke} strokeDasharray="6 6" opacity="0.35" />
        <text x={center.x - conic.a} y={center.y - conic.b - 12} fill={selected ? "#b45309" : stroke} className="select-none text-xs font-black">{label}</text>
      </g>
    );
  }
  return (
    <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
      <path d={conicPath(conic, center, 1)} fill="none" stroke={selected ? "#f59e0b" : stroke} strokeWidth={selected ? "7" : "4"} />
      <line x1={center.x} y1={center.y - conic.b} x2={center.x} y2={center.y + conic.b} stroke={stroke} strokeDasharray="5 5" opacity="0.45" />
      <text x={center.x + 12} y={center.y - conic.b - 10} fill={selected ? "#b45309" : stroke} className="select-none text-xs font-black">{label}</text>
    </g>
  );
}

function GeometryAngle({ angle, points, selected, onSelect }: { angle: GeoAngle; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const a = pointById(points, angle.a), vertex = pointById(points, angle.vertex), b = pointById(points, angle.b);
  if (!a || !vertex || !b) return null;
  const arc = angleArcPath(a, vertex, b, 42);
  const mid = angleBisectorEndpoint(a, vertex, b, 58);
  return (
    <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
      <path d={arc} fill="none" stroke={selected ? "#f59e0b" : "#ef4444"} strokeWidth={selected ? "7" : "4"} />
      <line x1={vertex.x} y1={vertex.y} x2={mid.x} y2={mid.y} stroke={selected ? "#f59e0b" : "#ef4444"} strokeWidth="2" strokeDasharray="5 5" opacity="0.75" />
      <text x={mid.x + 8} y={mid.y} fill={selected ? "#b45309" : "#b91c1c"} className="select-none text-xs font-black">{roundTo(angleDegrees(a, vertex, b), 1)} deg</text>
    </g>
  );
}

function GeometryObjectInspector({
  construction,
  selected,
  onSelect,
  onUpdatePoint,
  onUpdateLine,
  onUpdateCircle,
  onUpdatePolygon,
  onUpdateAngle,
  onUpdateConic,
  onToggleLock,
  onDelete,
}: {
  construction: Construction;
  selected: SelectedGeoObject;
  onSelect: (value: SelectedGeoObject) => void;
  onUpdatePoint: (id: string, patch: Partial<Pick<GeoPoint, "label" | "x" | "y">>) => void;
  onUpdateLine: (id: string, patch: Partial<Pick<GeoLine, "a" | "b" | "kind">>) => void;
  onUpdateCircle: (id: string, patch: Partial<Pick<GeoCircle, "center" | "edge">>) => void;
  onUpdatePolygon: (id: string, points: string[]) => void;
  onUpdateAngle: (id: string, patch: Partial<Pick<GeoAngle, "a" | "vertex" | "b">>) => void;
  onUpdateConic: (id: string, patch: Partial<Pick<GeoConic, "kind" | "center" | "a" | "b">>) => void;
  onToggleLock: (kind: Exclude<NonNullable<SelectedGeoObject>["kind"], "constraint" | "transform">, id: string) => void;
  onDelete: (kind: NonNullable<SelectedGeoObject>["kind"], id: string) => void;
}) {
  const selectedPoint = selected?.kind === "point" ? pointById(construction.points, selected.id) : null;
  const selectedLine = selected?.kind === "line" ? construction.lines.find((line) => line.id === selected.id) : null;
  const selectedCircle = selected?.kind === "circle" ? construction.circles.find((circle) => circle.id === selected.id) : null;
  const selectedPolygon = selected?.kind === "polygon" ? construction.polygons.find((polygon) => polygon.id === selected.id) : null;
  const selectedAngle = selected?.kind === "angle" ? construction.angles.find((angle) => angle.id === selected.id) : null;
  const selectedConic = selected?.kind === "conic" ? construction.conics.find((conic) => conic.id === selected.id) : null;
  const selectedTransform = selected?.kind === "transform" ? construction.transforms.find((transform) => transform.id === selected.id) : null;
  const selectedConstraint = selected?.kind === "constraint" ? construction.constraints.find((constraint) => constraint.id === selected.id) : null;
  const objectCount = construction.points.length + construction.lines.length + construction.circles.length + construction.polygons.length + construction.angles.length + construction.conics.length + construction.transforms.length + construction.constraints.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Phase 4 advanced geometry</p>
          <h3 className="font-bold">Object Properties</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{objectCount} objects in construction</p>
        </div>
        {selected && <button type="button" className="mini-chip" onClick={() => onDelete(selected.kind, selected.id)}><Trash2 className="h-3 w-3" />Delete</button>}
      </div>

      <div className="mt-3 grid gap-2">
        <ObjectGroup title="Points">
          {construction.points.map((point) => (
            <ObjectRow key={point.id} active={selected?.kind === "point" && selected.id === point.id} label={`${point.label} (${roundTo(point.x / 40, 2)}, ${roundTo((420 - point.y) / 40, 2)})`} onClick={() => onSelect({ kind: "point", id: point.id })} onDelete={() => onDelete("point", point.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Lines">
          {construction.lines.map((line, index) => (
            <ObjectRow key={line.id} active={selected?.kind === "line" && selected.id === line.id} label={`${lineKindLabel(line.kind ?? "segment")} ${index + 1}: ${labelForPoint(construction, line.a)}${labelForPoint(construction, line.b)}`} onClick={() => onSelect({ kind: "line", id: line.id })} onDelete={() => onDelete("line", line.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Circles">
          {construction.circles.map((circle, index) => (
            <ObjectRow key={circle.id} active={selected?.kind === "circle" && selected.id === circle.id} label={`Circle ${index + 1}: center ${labelForPoint(construction, circle.center)}`} onClick={() => onSelect({ kind: "circle", id: circle.id })} onDelete={() => onDelete("circle", circle.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Polygons">
          {construction.polygons.map((polygon, index) => (
            <ObjectRow key={polygon.id} active={selected?.kind === "polygon" && selected.id === polygon.id} label={`Polygon ${index + 1}: ${polygon.points.map((id) => labelForPoint(construction, id)).join("")}`} onClick={() => onSelect({ kind: "polygon", id: polygon.id })} onDelete={() => onDelete("polygon", polygon.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Angles">
          {construction.angles.map((angle, index) => (
            <ObjectRow key={angle.id} active={selected?.kind === "angle" && selected.id === angle.id} label={`Angle ${index + 1}: ${labelForPoint(construction, angle.a)}${labelForPoint(construction, angle.vertex)}${labelForPoint(construction, angle.b)}`} onClick={() => onSelect({ kind: "angle", id: angle.id })} onDelete={() => onDelete("angle", angle.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Conics">
          {construction.conics.map((conic, index) => (
            <ObjectRow key={conic.id} active={selected?.kind === "conic" && selected.id === conic.id} label={`${conic.kind} ${index + 1}: ${labelForPoint(construction, conic.center)}`} onClick={() => onSelect({ kind: "conic", id: conic.id })} onDelete={() => onDelete("conic", conic.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Transforms">
          {construction.transforms.map((transform, index) => (
            <ObjectRow key={transform.id} active={selected?.kind === "transform" && selected.id === transform.id} label={`${transform.type} ${index + 1}: ${transform.resultIds.length} result object(s)`} onClick={() => onSelect({ kind: "transform", id: transform.id })} onDelete={() => onDelete("transform", transform.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Constraints">
          {construction.constraints.map((constraint) => (
            <ObjectRow key={constraint.id} active={selected?.kind === "constraint" && selected.id === constraint.id} label={constraintLabel(constraint, construction)} onClick={() => onSelect({ kind: "constraint", id: constraint.id })} onDelete={() => onDelete("constraint", constraint.id)} />
          ))}
        </ObjectGroup>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
        {!selected && <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Select an object on the board or in the object list to edit its properties.</p>}
        {selectedPoint && (
          <div className="grid gap-2">
            <p className="text-sm font-black">Point {selectedPoint.label}</p>
            <button type="button" className={selectedPoint.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("point", selectedPoint.id)}>{selectedPoint.locked ? "Unlock point" : "Lock point"}</button>
            <label className="text-xs font-bold">Label<input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={selectedPoint.label} maxLength={8} onChange={(event) => onUpdatePoint(selectedPoint.id, { label: event.target.value || selectedPoint.label })} /></label>
            <NumberField label="x coordinate" value={roundTo(selectedPoint.x / 40, 3)} min={0} max={16} step={0.05} onChange={(value) => onUpdatePoint(selectedPoint.id, { x: value * 40 })} />
            <NumberField label="y coordinate" value={roundTo((420 - selectedPoint.y) / 40, 3)} min={0} max={10.5} step={0.05} onChange={(value) => onUpdatePoint(selectedPoint.id, { y: 420 - value * 40 })} />
          </div>
        )}
        {selectedLine && (
          <div className="grid gap-2">
            <p className="text-sm font-black">{lineKindLabel(selectedLine.kind ?? "segment")}</p>
            <button type="button" className={selectedLine.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("line", selectedLine.id)}>{selectedLine.locked ? "Unlock object" : "Lock object"}</button>
            <label className="text-xs font-bold">
              Object type
              <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={selectedLine.kind ?? "segment"} onChange={(event) => onUpdateLine(selectedLine.id, { kind: event.target.value as GeoLineKind })}>
                <option value="segment">Segment</option>
                <option value="line">Infinite line</option>
                <option value="ray">Ray</option>
                <option value="vector">Vector</option>
              </select>
            </label>
            <PointSelect label="Point A" value={selectedLine.a} points={construction.points} onChange={(value) => onUpdateLine(selectedLine.id, { a: value })} />
            <PointSelect label="Point B" value={selectedLine.b} points={construction.points} onChange={(value) => onUpdateLine(selectedLine.id, { b: value })} />
          </div>
        )}
        {selectedCircle && (
          <div className="grid gap-2">
            <p className="text-sm font-black">Circle</p>
            <button type="button" className={selectedCircle.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("circle", selectedCircle.id)}>{selectedCircle.locked ? "Unlock object" : "Lock object"}</button>
            <PointSelect label="Center" value={selectedCircle.center} points={construction.points} onChange={(value) => onUpdateCircle(selectedCircle.id, { center: value })} />
            <PointSelect label="Radius point" value={selectedCircle.edge} points={construction.points} onChange={(value) => onUpdateCircle(selectedCircle.id, { edge: value })} />
          </div>
        )}
        {selectedPolygon && (
          <div className="grid gap-2">
            <p className="text-sm font-black">Polygon vertices</p>
            <button type="button" className={selectedPolygon.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("polygon", selectedPolygon.id)}>{selectedPolygon.locked ? "Unlock object" : "Lock object"}</button>
            {selectedPolygon.points.map((pointId, index) => (
              <PointSelect key={`${pointId}-${index}`} label={`Vertex ${index + 1}`} value={pointId} points={construction.points} onChange={(value) => onUpdatePolygon(selectedPolygon.id, selectedPolygon.points.map((id, pointIndex) => pointIndex === index ? value : id))} />
            ))}
            {selectedPolygon.points.length > 3 && <button type="button" className="tool-button justify-center" onClick={() => onUpdatePolygon(selectedPolygon.id, selectedPolygon.points.slice(0, -1))}>Remove last vertex</button>}
          </div>
        )}
        {selectedAngle && (
          <div className="grid gap-2">
            <p className="text-sm font-black">Angle {labelForPoint(construction, selectedAngle.a)}{labelForPoint(construction, selectedAngle.vertex)}{labelForPoint(construction, selectedAngle.b)}</p>
            <button type="button" className={selectedAngle.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("angle", selectedAngle.id)}>{selectedAngle.locked ? "Unlock object" : "Lock object"}</button>
            <PointSelect label="First ray point" value={selectedAngle.a} points={construction.points} onChange={(value) => onUpdateAngle(selectedAngle.id, { a: value })} />
            <PointSelect label="Vertex" value={selectedAngle.vertex} points={construction.points} onChange={(value) => onUpdateAngle(selectedAngle.id, { vertex: value })} />
            <PointSelect label="Second ray point" value={selectedAngle.b} points={construction.points} onChange={(value) => onUpdateAngle(selectedAngle.id, { b: value })} />
          </div>
        )}
        {selectedConic && (
          <div className="grid gap-2">
            <p className="text-sm font-black">{selectedConic.kind} conic</p>
            <button type="button" className={selectedConic.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("conic", selectedConic.id)}>{selectedConic.locked ? "Unlock object" : "Lock object"}</button>
            <label className="text-xs font-bold">
              Conic type
              <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={selectedConic.kind} onChange={(event) => onUpdateConic(selectedConic.id, { kind: event.target.value as GeoConicKind })}>
                <option value="parabola">Parabola</option>
                <option value="ellipse">Ellipse</option>
                <option value="hyperbola">Hyperbola</option>
              </select>
            </label>
            <PointSelect label="Center / vertex" value={selectedConic.center} points={construction.points} onChange={(value) => onUpdateConic(selectedConic.id, { center: value })} />
            <NumberField label="a size" value={roundTo(selectedConic.a / 40, 2)} min={0.5} max={5} step={0.1} onChange={(value) => onUpdateConic(selectedConic.id, { a: value * 40 })} />
            <NumberField label="b size" value={roundTo(selectedConic.b / 40, 2)} min={0.5} max={5} step={0.1} onChange={(value) => onUpdateConic(selectedConic.id, { b: value * 40 })} />
          </div>
        )}
        {selectedTransform && (
          <div className="grid gap-2">
            <p className="text-sm font-black">{selectedTransform.type} transform</p>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Source: {selectedTransform.sourceKind}. Results: {selectedTransform.resultIds.length}. {selectedTransform.angle ? `Angle: ${selectedTransform.angle} deg.` : ""} {selectedTransform.scale ? `Scale: ${selectedTransform.scale}.` : ""}</p>
            <button type="button" className="tool-button justify-center" onClick={() => onDelete("transform", selectedTransform.id)}>Remove transform record</button>
          </div>
        )}
        {selectedConstraint && (
          <div className="grid gap-2">
            <p className="text-sm font-black">Constraint</p>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{constraintLabel(selectedConstraint, construction)}</p>
            <button type="button" className="tool-button justify-center" onClick={() => onDelete("constraint", selectedConstraint.id)}>Remove constraint</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ObjectGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

function ObjectRow({ label, active, onClick, onDelete }: { label: string; active: boolean; onClick: () => void; onDelete: () => void }) {
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)_32px] items-center gap-1 rounded-xl p-1 ${active ? "bg-cyan-100 dark:bg-cyan-400/15" : "bg-slate-100 dark:bg-white/10"}`}>
      <button type="button" className="min-w-0 truncate px-2 py-1 text-left text-xs font-bold" onClick={onClick}>{label}</button>
      <button type="button" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-rose-500/15" onClick={onDelete} aria-label={`Delete ${label}`}><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  );
}

function PointSelect({ label, value, points, onChange }: { label: string; value: string; points: GeoPoint[]; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-bold">
      {label}
      <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={value} onChange={(event) => onChange(event.target.value)}>
        {points.map((point) => <option key={point.id} value={point.id}>{point.label}</option>)}
      </select>
    </label>
  );
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
        if (constraint.type === "angle-bisector") {
          const line = construction.lines.find((item) => item.id === constraint.line);
          const a = line ? pointById(construction.points, line.a) : null;
          const b = line ? pointById(construction.points, line.b) : null;
          return a && b ? <g key={constraint.id}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f59e0b" strokeWidth="8" opacity="0.2" /><text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 8} fill="#b45309" className="text-xs font-bold">angle bisector</text></g> : null;
        }
        if (constraint.type === "tangent") {
          const p = pointById(construction.points, constraint.tangentPoint);
          return p ? <g key={constraint.id}><circle cx={p.x} cy={p.y} r="18" fill="none" stroke="#ec4899" strokeDasharray="5 4" strokeWidth="3" /><text x={p.x + 12} y={p.y + 20} fill="#be185d" className="text-xs font-bold">tangent point</text></g> : null;
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

function DependencyPanel({ construction, selected, onSelect }: { construction: Construction; selected: SelectedGeoObject; onSelect: (value: SelectedGeoObject) => void }) {
  const nodes = buildDependencyGraph(construction);
  const diagnostics = constructionDiagnostics(construction, nodes);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Phase 3 dependency algebra</p>
          <h3 className="font-bold">Dependency Tree</h3>
        </div>
        <span className="mini-chip">{nodes.filter((node) => node.status !== "free").length} linked</span>
      </div>
      <div className="mt-3 grid gap-2">
        {nodes.length ? nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            className={`rounded-xl p-3 text-left text-xs transition ${selected && objectKey(selected.kind, selected.id) === node.id ? "bg-cyan-100 dark:bg-cyan-400/15" : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"}`}
            onClick={() => onSelect(selectionFromObjectKey(node.id))}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-black">{node.label}</span>
              <span className={`rounded-full px-2 py-0.5 font-black uppercase ${node.status === "warning" ? "bg-rose-500/15 text-rose-600 dark:text-rose-200" : node.status === "locked" ? "bg-amber-500/15 text-amber-700 dark:text-amber-200" : node.status === "dependent" ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-200" : "bg-slate-500/15 text-slate-500"}`}>{node.status}</span>
            </div>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Parents: {node.parents.length ? node.parents.map((id) => nodeLabelById(nodes, id)).join(", ") : "none"}</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Children: {node.children.length ? node.children.map((id) => nodeLabelById(nodes, id)).join(", ") : "none"}</p>
          </button>
        )) : <p className="text-sm text-slate-500 dark:text-slate-400">Add geometry objects to see dependencies.</p>}
      </div>
      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Diagnostics</p>
        {diagnostics.length ? (
          <ul className="mt-2 space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {diagnostics.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ) : <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">No dependency conflicts detected.</p>}
      </div>
    </div>
  );
}

function ConstraintPanel({ construction, undoStack, redoStack, onUndo, onRedo }: { construction: Construction; undoStack: ConstructionHistoryEntry[]; redoStack: ConstructionHistoryEntry[]; onUndo: () => void; onRedo: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold">Constraint Engine</h3>
        <div className="flex gap-1">
          <button type="button" className="mini-chip" onClick={onUndo} disabled={!undoStack.length}>Undo</button>
          <button type="button" className="mini-chip" onClick={onRedo} disabled={!redoStack.length}>Redo</button>
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Draggable points now recompute dependent objects: parallel, perpendicular, midpoint, fixed length, point-on-circle, angle bisectors, tangents, and line intersections.</p>
      {construction.constraints.length ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {construction.constraints.map((constraint) => <li key={constraint.id} className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">{constraintLabel(constraint, construction)}</li>)}
        </ul>
      ) : <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Add a constraint tool to see live dependencies here.</p>}
      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Undo / redo timeline</p>
        {undoStack.length ? (
          <ol className="mt-2 space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {undoStack.slice(0, 6).map((entry) => <li key={entry.id}>{entry.label}</li>)}
          </ol>
        ) : <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">No construction edits recorded yet.</p>}
      </div>
    </div>
  );
}

function ConstructionHelp({ tool }: { tool: GeometryTool }) {
  const instructions: Record<GeometryTool, string> = {
    select: "Drag existing points to update every connected line, circle, and polygon.",
    point: "Click the board to create labeled points.",
    segment: "Click two points to create a finite segment with live length.",
    line: "Click two points to create an infinite construction line through them.",
    ray: "Click a start point, then a direction point. The ray extends from the first point through the second.",
    vector: "Click a tail point, then a head point. The vector is drawn with an arrow and live magnitude.",
    circle: "Click a center point, then a radius point.",
    polygon: "Click three or more points; the polygon is created after the third point.",
    angle: "Click three points in order: first ray point, vertex, second ray point. The angle arc and degree label stay live.",
    "angle-bisector": "Click first ray point, vertex, second ray point. A constrained bisector ray is created and updates when points move.",
    tangent: "Click an external point and a circle, in either order. Two tangent rays are created when the point is outside the circle.",
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
    if (!a || !b) return "";
    const kind = line.kind ?? "segment";
    const length = roundTo(distance(a, b) / 40, 2);
    if (kind === "line") return `Line ${a.label}${b.label}: slope = ${slopeLabel(a, b)}`;
    if (kind === "ray") return `Ray ${a.label}${b.label}: direction ${roundTo(directionDegrees(a, b), 1)} deg`;
    if (kind === "vector") return `Vector ${a.label}${b.label}: |v| = ${length}, angle = ${roundTo(directionDegrees(a, b), 1)} deg`;
    return `Segment ${a.label}${b.label} = ${length}`;
  }).filter(Boolean);
  const circleRadii = construction.circles.map((circle) => {
    const center = pointById(construction.points, circle.center), edge = pointById(construction.points, circle.edge);
    return center && edge ? `Circle ${center.label}: r = ${roundTo(distance(center, edge) / 40, 2)}` : "";
  }).filter(Boolean);
  const polygonAreas = construction.polygons.map((polygon, index) => {
    const points = polygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
    return points.length >= 3 ? `Polygon ${index + 1}: area = ${roundTo(polygonArea(points) / 1600, 2)}` : "";
  }).filter(Boolean);
  const angleEntries = construction.angles.map((angle) => {
    const a = pointById(construction.points, angle.a), vertex = pointById(construction.points, angle.vertex), b = pointById(construction.points, angle.b);
    return a && vertex && b ? `Angle ${a.label}${vertex.label}${b.label} = ${roundTo(angleDegrees(a, vertex, b), 2)} deg` : "";
  }).filter(Boolean);
  const tangentEntries = construction.constraints.filter((constraint) => constraint.type === "tangent").map((constraint) => {
    const p = pointById(construction.points, constraint.throughPoint), t = pointById(construction.points, constraint.tangentPoint);
    return p && t ? `Tangent ${p.label}${t.label}: length = ${roundTo(distance(p, t) / 40, 2)}` : "";
  }).filter(Boolean);
  const conicEntries = construction.conics.map((conic, index) => {
    const center = pointById(construction.points, conic.center);
    return center ? `${conic.kind} ${index + 1}: ${conicEquation(conic)} at ${center.label}` : "";
  }).filter(Boolean);
  const transformEntries = construction.transforms.map((transform, index) => `${transform.type} ${index + 1}: ${transform.resultIds.length} result object(s)`);
  const entries = [...lineLengths, ...circleRadii, ...polygonAreas, ...angleEntries, ...conicEntries, ...tangentEntries, ...transformEntries];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="font-bold">Live Measurements</h3>
      {entries.length ? <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">{entries.map((entry) => <li key={entry}>{entry}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Create lines, circles, or polygons to see measurements.</p>}
    </div>
  );
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeConstruction(value: Partial<Construction>): Construction {
  return solveConstruction({
    points: value.points ?? [],
    lines: (value.lines ?? []).map((line) => ({ ...line, kind: line.kind ?? "segment" })),
    circles: value.circles ?? [],
    polygons: value.polygons ?? [],
    angles: value.angles ?? [],
    conics: value.conics ?? [],
    transforms: value.transforms ?? [],
    constraints: value.constraints ?? [],
  });
}

function constructionSignature(construction: Construction) {
  return JSON.stringify(construction);
}

function toggleObjectLock(construction: Construction, kind: Exclude<NonNullable<SelectedGeoObject>["kind"], "constraint" | "transform">, id: string): Construction {
  if (kind === "point") return { ...construction, points: construction.points.map((point) => point.id === id ? { ...point, locked: !point.locked } : point) };
  if (kind === "line") return { ...construction, lines: construction.lines.map((line) => line.id === id ? { ...line, locked: !line.locked } : line) };
  if (kind === "circle") return { ...construction, circles: construction.circles.map((circle) => circle.id === id ? { ...circle, locked: !circle.locked } : circle) };
  if (kind === "polygon") return { ...construction, polygons: construction.polygons.map((polygon) => polygon.id === id ? { ...polygon, locked: !polygon.locked } : polygon) };
  if (kind === "angle") return { ...construction, angles: construction.angles.map((angle) => angle.id === id ? { ...angle, locked: !angle.locked } : angle) };
  return { ...construction, conics: construction.conics.map((conic) => conic.id === id ? { ...conic, locked: !conic.locked } : conic) };
}

function objectKey(kind: NonNullable<SelectedGeoObject>["kind"], id: string) {
  return `${kind}:${id}`;
}

function selectionFromObjectKey(key: string): NonNullable<SelectedGeoObject> {
  const [kind, id] = key.split(":") as [NonNullable<SelectedGeoObject>["kind"], string];
  return { kind, id };
}

function nodeLabelById(nodes: DependencyNode[], id: string) {
  return nodes.find((node) => node.id === id)?.label ?? id;
}

function buildDependencyGraph(construction: Construction): DependencyNode[] {
  const nodeMap = new Map<string, DependencyNode>();
  const addNode = (id: string, label: string, locked?: boolean) => {
    if (!nodeMap.has(id)) nodeMap.set(id, { id, label, parents: [], children: [], status: locked ? "locked" : "free" });
  };
  const link = (parent: string, child: string) => {
    const parentNode = nodeMap.get(parent);
    const childNode = nodeMap.get(child);
    if (!parentNode || !childNode) return;
    if (!parentNode.children.includes(child)) parentNode.children.push(child);
    if (!childNode.parents.includes(parent)) childNode.parents.push(parent);
    if (childNode.status === "free") childNode.status = "dependent";
  };

  construction.points.forEach((point) => addNode(objectKey("point", point.id), `Point ${point.label}`, point.locked));
  construction.lines.forEach((line, index) => addNode(objectKey("line", line.id), `${lineKindLabel(line.kind ?? "segment")} ${index + 1}`, line.locked));
  construction.circles.forEach((circle, index) => addNode(objectKey("circle", circle.id), `Circle ${index + 1}`, circle.locked));
  construction.polygons.forEach((polygon, index) => addNode(objectKey("polygon", polygon.id), `Polygon ${index + 1}`, polygon.locked));
  construction.angles.forEach((angle, index) => addNode(objectKey("angle", angle.id), `Angle ${index + 1}`, angle.locked));
  construction.conics.forEach((conic, index) => addNode(objectKey("conic", conic.id), `${conic.kind} ${index + 1}`, conic.locked));
  construction.transforms.forEach((transform, index) => addNode(objectKey("transform", transform.id), `${transform.type} ${index + 1}`));
  construction.constraints.forEach((constraint, index) => addNode(objectKey("constraint", constraint.id), `${constraint.type} ${index + 1}`));

  construction.lines.forEach((line) => {
    link(objectKey("point", line.a), objectKey("line", line.id));
    link(objectKey("point", line.b), objectKey("line", line.id));
  });
  construction.circles.forEach((circle) => {
    link(objectKey("point", circle.center), objectKey("circle", circle.id));
    link(objectKey("point", circle.edge), objectKey("circle", circle.id));
  });
  construction.polygons.forEach((polygon) => polygon.points.forEach((pointId) => link(objectKey("point", pointId), objectKey("polygon", polygon.id))));
  construction.angles.forEach((angle) => {
    link(objectKey("point", angle.a), objectKey("angle", angle.id));
    link(objectKey("point", angle.vertex), objectKey("angle", angle.id));
    link(objectKey("point", angle.b), objectKey("angle", angle.id));
  });
  construction.conics.forEach((conic) => link(objectKey("point", conic.center), objectKey("conic", conic.id)));
  construction.transforms.forEach((transform) => {
    const transformId = objectKey("transform", transform.id);
    link(objectKey(transform.sourceKind, transform.sourceId), transformId);
    if (transform.center) link(objectKey("point", transform.center), transformId);
    transform.resultIds.forEach((resultId) => {
      if (construction.points.some((point) => point.id === resultId)) link(transformId, objectKey("point", resultId));
      if (construction.polygons.some((polygon) => polygon.id === resultId)) link(transformId, objectKey("polygon", resultId));
      if (construction.circles.some((circle) => circle.id === resultId)) link(transformId, objectKey("circle", resultId));
      if (construction.conics.some((conic) => conic.id === resultId)) link(transformId, objectKey("conic", resultId));
    });
  });
  construction.constraints.forEach((constraint) => {
    const constraintId = objectKey("constraint", constraint.id);
    constraintPointIds(constraint).forEach((pointId) => link(objectKey("point", pointId), constraintId));
    if (constraint.type === "parallel" || constraint.type === "perpendicular") {
      link(objectKey("line", constraint.sourceLine), constraintId);
      link(constraintId, objectKey("line", constraint.line));
    }
    if (constraint.type === "on-circle" || constraint.type === "tangent") link(objectKey("circle", constraint.circle), constraintId);
    if (constraint.type === "intersection") {
      link(objectKey("line", constraint.first), constraintId);
      link(objectKey("line", constraint.second), constraintId);
    }
    if (constraint.type === "angle-bisector") link(constraintId, objectKey("line", constraint.line));
    if (constraint.type === "midpoint" || constraint.type === "intersection" || constraint.type === "tangent") link(constraintId, objectKey("point", constraint.type === "tangent" ? constraint.tangentPoint : constraint.point));
  });

  return Array.from(nodeMap.values()).map((node) => node.status === "locked" && node.parents.length > 0 ? { ...node, status: "warning" } : node);
}

function constructionDiagnostics(construction: Construction, nodes: DependencyNode[]) {
  const messages: string[] = [];
  const lockedDependent = nodes.filter((node) => node.status === "warning" && node.parents.length > 0);
  lockedDependent.forEach((node) => messages.push(`${node.label} is locked but has parent dependencies.`));
  construction.constraints.forEach((constraint) => {
    if (constraint.type === "tangent") {
      const circle = construction.circles.find((item) => item.id === constraint.circle);
      const through = pointById(construction.points, constraint.throughPoint);
      const center = circle ? pointById(construction.points, circle.center) : null;
      const edge = circle ? pointById(construction.points, circle.edge) : null;
      if (through && center && edge && distance(through, center) <= distance(center, edge)) messages.push(`Tangent from ${through.label} is invalid because the point is inside or on the circle.`);
    }
    if (constraint.type === "intersection") {
      const first = construction.lines.find((item) => item.id === constraint.first);
      const second = construction.lines.find((item) => item.id === constraint.second);
      if (first && second && !lineIntersection(first, second, construction.points)) messages.push("Line intersection constraint is currently parallel or undefined.");
    }
  });
  return messages;
}

function removeGeometryObject(construction: Construction, kind: NonNullable<SelectedGeoObject>["kind"], id: string): Construction {
  if (kind === "point") {
    const selected = new Set([id]);
    return {
      points: construction.points.filter((point) => !selected.has(point.id)),
      lines: construction.lines.filter((line) => !selected.has(line.a) && !selected.has(line.b)),
      circles: construction.circles.filter((circle) => !selected.has(circle.center) && !selected.has(circle.edge)),
      polygons: construction.polygons
        .map((polygon) => ({ ...polygon, points: polygon.points.filter((pointId) => !selected.has(pointId)) }))
        .filter((polygon) => polygon.points.length >= 3),
      angles: construction.angles.filter((angle) => !selected.has(angle.a) && !selected.has(angle.vertex) && !selected.has(angle.b)),
      conics: construction.conics.filter((conic) => !selected.has(conic.center)),
      transforms: construction.transforms.filter((transform) => transform.sourceKind !== "point" || transform.sourceId !== id),
      constraints: construction.constraints.filter((constraint) => constraintPointIds(constraint).every((pointId) => !selected.has(pointId))),
    };
  }
  if (kind === "line") {
    return {
      ...construction,
      lines: construction.lines.filter((line) => line.id !== id),
      constraints: construction.constraints.filter((constraint) => {
        if (constraint.type === "parallel" || constraint.type === "perpendicular") return constraint.sourceLine !== id && constraint.line !== id;
        if (constraint.type === "intersection") return constraint.first !== id && constraint.second !== id;
        if (constraint.type === "angle-bisector" || constraint.type === "tangent") return constraint.line !== id;
        return true;
      }),
    };
  }
  if (kind === "circle") {
    return {
      ...construction,
      circles: construction.circles.filter((circle) => circle.id !== id),
      constraints: construction.constraints.filter((constraint) => {
        if (constraint.type === "on-circle" || constraint.type === "tangent") return constraint.circle !== id;
        return true;
      }),
    };
  }
  if (kind === "polygon") return { ...construction, polygons: construction.polygons.filter((polygon) => polygon.id !== id) };
  if (kind === "angle") {
    return {
      ...construction,
      angles: construction.angles.filter((angle) => angle.id !== id),
      constraints: construction.constraints.filter((constraint) => constraint.type !== "angle-bisector" || ![constraint.a, constraint.vertex, constraint.b].includes(id)),
    };
  }
  if (kind === "conic") return { ...construction, conics: construction.conics.filter((conic) => conic.id !== id), transforms: construction.transforms.filter((transform) => !(transform.sourceKind === "conic" && transform.sourceId === id) && !transform.resultIds.includes(id)) };
  if (kind === "transform") return { ...construction, transforms: construction.transforms.filter((transform) => transform.id !== id) };
  return { ...construction, constraints: construction.constraints.filter((constraint) => constraint.id !== id) };
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

function addAngleObject(construction: Construction, aId: string, vertexId: string, bId: string) {
  return solveConstruction({ ...construction, angles: [...construction.angles, { id: crypto.randomUUID(), a: aId, vertex: vertexId, b: bId }] });
}

function addAngleBisectorConstraint(construction: Construction, aId: string, vertexId: string, bId: string) {
  const a = pointById(construction.points, aId), vertex = pointById(construction.points, vertexId), b = pointById(construction.points, bId);
  if (!a || !vertex || !b) return construction;
  const end = angleBisectorEndpoint(a, vertex, b, 130);
  const endPoint: GeoPoint = { id: crypto.randomUUID(), x: end.x, y: end.y, label: nextPointLabel(construction.points) };
  const bisector: GeoLine = { id: crypto.randomUUID(), a: vertexId, b: endPoint.id, kind: "ray" };
  return solveConstruction({
    ...construction,
    points: [...construction.points, endPoint],
    angles: [...construction.angles, { id: crypto.randomUUID(), a: aId, vertex: vertexId, b: bId }],
    lines: [...construction.lines, bisector],
    constraints: [...construction.constraints, { id: crypto.randomUUID(), type: "angle-bisector", a: aId, vertex: vertexId, b: bId, line: bisector.id }],
  });
}

function addTangentConstruction(construction: Construction, circleId: string, throughPointId: string) {
  const circle = construction.circles.find((item) => item.id === circleId);
  const through = pointById(construction.points, throughPointId);
  const center = circle ? pointById(construction.points, circle.center) : null;
  const edge = circle ? pointById(construction.points, circle.edge) : null;
  if (!circle || !through || !center || !edge) return construction;
  const radius = distance(center, edge);
  const tangentPoints = tangentPointsFromExternalPoint(through, center, radius);
  if (!tangentPoints.length) return construction;
  const startIndex = construction.points.length;
  const newPoints = tangentPoints.map((point, index): GeoPoint => ({ id: crypto.randomUUID(), x: point.x, y: point.y, label: pointLabelForIndex(startIndex + index) }));
  const tangentLines = newPoints.map((point): GeoLine => ({ id: crypto.randomUUID(), a: throughPointId, b: point.id, kind: "ray" }));
  return solveConstruction({
    ...construction,
    points: [...construction.points, ...newPoints],
    lines: [...construction.lines, ...tangentLines],
    constraints: [
      ...construction.constraints,
      ...newPoints.map((point, index): GeoConstraint => ({ id: crypto.randomUUID(), type: "tangent", circle: circleId, throughPoint: throughPointId, tangentPoint: point.id, line: tangentLines[index].id })),
    ],
  });
}

function addTransformConstruction(construction: Construction, selected: NonNullable<SelectedGeoObject>, type: GeoTransformKind) {
  if (selected.kind !== "point" && selected.kind !== "polygon" && selected.kind !== "circle" && selected.kind !== "conic") return construction;
  const center = construction.points[0] ?? { id: "", x: 320, y: 210, label: "O" };
  const transformPoint = (point: GeoPoint, index: number): GeoPoint => {
    const next = transformCoordinates(point, center, type);
    return { id: crypto.randomUUID(), x: next.x, y: next.y, label: pointLabelForIndex(construction.points.length + index), locked: false };
  };
  const sourcePoints = sourcePointIdsForSelection(construction, selected).map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
  if (!sourcePoints.length) return construction;
  const newPoints = sourcePoints.map(transformPoint);
  const pointMap = new Map(sourcePoints.map((point, index) => [point.id, newPoints[index].id]));
  const transform: GeoTransform = { id: crypto.randomUUID(), type, sourceKind: selected.kind, sourceId: selected.id, resultIds: [], center: center.id || undefined, angle: type === "rotation" ? 45 : undefined, scale: type === "dilation" ? 1.35 : undefined };
  const next: Construction = { ...construction, points: [...construction.points, ...newPoints], transforms: construction.transforms };

  if (selected.kind === "point") {
    transform.resultIds = [newPoints[0].id];
    return { ...next, transforms: [...construction.transforms, transform] };
  }
  if (selected.kind === "polygon") {
    const polygon = construction.polygons.find((item) => item.id === selected.id);
    if (!polygon) return construction;
    const result: GeoPolygon = { id: crypto.randomUUID(), points: polygon.points.map((id) => pointMap.get(id)).filter(Boolean) as string[] };
    transform.resultIds = [result.id];
    return { ...next, polygons: [...construction.polygons, result], transforms: [...construction.transforms, transform] };
  }
  if (selected.kind === "circle") {
    const circle = construction.circles.find((item) => item.id === selected.id);
    if (!circle) return construction;
    const result: GeoCircle = { id: crypto.randomUUID(), center: pointMap.get(circle.center) ?? newPoints[0].id, edge: pointMap.get(circle.edge) ?? newPoints[1]?.id ?? newPoints[0].id };
    transform.resultIds = [result.id];
    return { ...next, circles: [...construction.circles, result], transforms: [...construction.transforms, transform] };
  }
  const conic = construction.conics.find((item) => item.id === selected.id);
  if (!conic) return construction;
  const resultConic: GeoConic = { ...conic, id: crypto.randomUUID(), center: pointMap.get(conic.center) ?? newPoints[0].id, a: type === "dilation" ? conic.a * 1.35 : conic.a, b: type === "dilation" ? conic.b * 1.35 : conic.b };
  transform.resultIds = [resultConic.id];
  return { ...next, conics: [...construction.conics, resultConic], transforms: [...construction.transforms, transform] };
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
      if (constraint.type === "angle-bisector") {
        const a = pointById(points, constraint.a), vertex = pointById(points, constraint.vertex), b = pointById(points, constraint.b);
        const line = construction.lines.find((item) => item.id === constraint.line);
        const end = line ? pointById(points, line.b) : null;
        if (a && vertex && b && end) {
          const next = angleBisectorEndpoint(a, vertex, b, Math.max(80, distance(vertex, end)));
          points = updatePoint(points, end.id, next);
        }
      }
      if (constraint.type === "tangent") {
        const circle = construction.circles.find((item) => item.id === constraint.circle);
        const through = pointById(points, constraint.throughPoint);
        const tangent = pointById(points, constraint.tangentPoint);
        const center = circle ? pointById(points, circle.center) : null;
        const edge = circle ? pointById(points, circle.edge) : null;
        if (circle && through && tangent && center && edge) {
          const candidates = tangentPointsFromExternalPoint(through, center, distance(center, edge));
          const next = candidates.sort((first, second) => distance(first, tangent) - distance(second, tangent))[0];
          if (next) points = updatePoint(points, tangent.id, next);
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
  return points.map((point) => point.id === id && !point.locked ? { ...point, x: next.x, y: next.y } : point);
}

function unitVector(a: GeoPoint, b: GeoPoint, perpendicular = false) {
  const vector = normalize(b.x - a.x, b.y - a.y);
  return perpendicular ? { x: -vector.y, y: vector.x } : vector;
}

function normalize(x: number, y: number) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function directionDegrees(a: { x: number; y: number }, b: { x: number; y: number }) {
  const degrees = Math.atan2(a.y - b.y, b.x - a.x) * 180 / Math.PI;
  return degrees < 0 ? degrees + 360 : degrees;
}

function slopeLabel(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  if (Math.abs(dx) < 0.001) return "undefined";
  return `${roundTo((a.y - b.y) / dx, 3)}`;
}

function sourcePointIdsForSelection(construction: Construction, selected: Pick<NonNullable<SelectedGeoObject>, "kind" | "id">) {
  if (selected.kind === "point") return [selected.id];
  if (selected.kind === "polygon") return construction.polygons.find((polygon) => polygon.id === selected.id)?.points ?? [];
  if (selected.kind === "circle") {
    const circle = construction.circles.find((item) => item.id === selected.id);
    return circle ? [circle.center, circle.edge] : [];
  }
  if (selected.kind === "conic") {
    const conic = construction.conics.find((item) => item.id === selected.id);
    return conic ? [conic.center] : [];
  }
  return [];
}

function transformCoordinates(point: { x: number; y: number }, center: { x: number; y: number }, type: GeoTransformKind) {
  if (type === "reflection") return { x: point.x, y: center.y * 2 - point.y };
  if (type === "dilation") return { x: center.x + (point.x - center.x) * 1.35, y: center.y + (point.y - center.y) * 1.35 };
  const angle = Math.PI / 4;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return { x: center.x + dx * Math.cos(angle) - dy * Math.sin(angle), y: center.y + dx * Math.sin(angle) + dy * Math.cos(angle) };
}

function conicEquation(conic: GeoConic) {
  const a = roundTo(conic.a / 40, 2);
  const b = roundTo(conic.b / 40, 2);
  if (conic.kind === "parabola") return `y^2 = ${roundTo(4 * a, 2)}x`;
  if (conic.kind === "ellipse") return `x^2/${a}^2 + y^2/${b}^2 = 1`;
  return `x^2/${a}^2 - y^2/${b}^2 = 1`;
}

function conicPath(conic: GeoConic, center: GeoPoint, branch: -1 | 1) {
  const samples: string[] = [];
  if (conic.kind === "parabola") {
    for (let y = -conic.b; y <= conic.b; y += conic.b / 24) {
      const x = center.x + (y * y) / Math.max(12, conic.a);
      samples.push(`${x},${center.y + y}`);
    }
  } else if (conic.kind === "hyperbola") {
    for (let t = -1.4; t <= 1.4; t += 0.08) {
      const x = center.x + branch * conic.a * Math.cosh(t);
      const y = center.y + conic.b * Math.sinh(t);
      samples.push(`${x},${y}`);
    }
  }
  return samples.length ? `M ${samples.join(" L ")}` : "";
}

function lineKindLabel(kind: GeoLineKind) {
  if (kind === "line") return "Line";
  if (kind === "ray") return "Ray";
  if (kind === "vector") return "Vector";
  return "Segment";
}

function lineDrawPoints(line: GeoLine, points: GeoPoint[]) {
  const a = pointById(points, line.a), b = pointById(points, line.b);
  if (!a || !b) return { x1: 0, y1: 0, x2: 0, y2: 0 };
  const kind = line.kind ?? "segment";
  if (kind === "segment" || kind === "vector") return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  const vector = normalize(b.x - a.x, b.y - a.y);
  if (kind === "ray") return { x1: a.x, y1: a.y, x2: a.x + vector.x * 900, y2: a.y + vector.y * 900 };
  return { x1: a.x - vector.x * 900, y1: a.y - vector.y * 900, x2: a.x + vector.x * 900, y2: a.y + vector.y * 900 };
}

function angleDegrees(a: GeoPoint, vertex: GeoPoint, b: GeoPoint) {
  const first = Math.atan2(a.y - vertex.y, a.x - vertex.x);
  const second = Math.atan2(b.y - vertex.y, b.x - vertex.x);
  let angle = Math.abs((second - first) * 180 / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

function angleArcPath(a: GeoPoint, vertex: GeoPoint, b: GeoPoint, radius: number) {
  const startAngle = Math.atan2(a.y - vertex.y, a.x - vertex.x);
  let endAngle = Math.atan2(b.y - vertex.y, b.x - vertex.x);
  let delta = endAngle - startAngle;
  while (delta <= -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;
  endAngle = startAngle + delta;
  const start = { x: vertex.x + Math.cos(startAngle) * radius, y: vertex.y + Math.sin(startAngle) * radius };
  const end = { x: vertex.x + Math.cos(endAngle) * radius, y: vertex.y + Math.sin(endAngle) * radius };
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${delta > 0 ? 1 : 0} ${end.x} ${end.y}`;
}

function angleBisectorEndpoint(a: GeoPoint, vertex: GeoPoint, b: GeoPoint, length: number) {
  const first = normalize(a.x - vertex.x, a.y - vertex.y);
  const second = normalize(b.x - vertex.x, b.y - vertex.y);
  let vector = normalize(first.x + second.x, first.y + second.y);
  if (Math.abs(first.x + second.x) < 0.001 && Math.abs(first.y + second.y) < 0.001) vector = { x: -first.y, y: first.x };
  return { x: vertex.x + vector.x * length, y: vertex.y + vector.y * length };
}

function tangentPointsFromExternalPoint(through: GeoPoint, center: GeoPoint, radius: number) {
  const dx = through.x - center.x;
  const dy = through.y - center.y;
  const distanceToCenter = Math.hypot(dx, dy);
  if (distanceToCenter <= radius + 0.001) return [];
  const baseAngle = Math.atan2(dy, dx);
  const offset = Math.acos(radius / distanceToCenter);
  return [baseAngle + offset, baseAngle - offset].map((angle) => ({
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  }));
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
  return pointLabelForIndex(points.length + offset);
}

function pointLabelForIndex(index: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (index < alphabet.length) return alphabet[index];
  return `P${index + 1}`;
}

function constraintLabel(constraint: GeoConstraint, construction: Construction) {
  if (constraint.type === "midpoint") return `${labelForPoint(construction, constraint.point)} is midpoint of ${labelForPoint(construction, constraint.a)}${labelForPoint(construction, constraint.b)}`;
  if (constraint.type === "fixed-length") return `${labelForPoint(construction, constraint.anchor)}${labelForPoint(construction, constraint.point)} fixed at ${roundTo(constraint.length / 40, 2)} units`;
  if (constraint.type === "on-circle") return `${labelForPoint(construction, constraint.point)} stays on first circle`;
  if (constraint.type === "intersection") return `${labelForPoint(construction, constraint.point)} is line intersection`;
  if (constraint.type === "angle-bisector") return `Bisector of angle ${labelForPoint(construction, constraint.a)}${labelForPoint(construction, constraint.vertex)}${labelForPoint(construction, constraint.b)}`;
  if (constraint.type === "tangent") return `${labelForPoint(construction, constraint.throughPoint)}${labelForPoint(construction, constraint.tangentPoint)} is tangent to circle`;
  return `${constraint.type} constrained line`;
}

function constraintPointIds(constraint: GeoConstraint) {
  if (constraint.type === "midpoint") return [constraint.a, constraint.b, constraint.point];
  if (constraint.type === "fixed-length") return [constraint.anchor, constraint.point];
  if (constraint.type === "on-circle") return [constraint.point];
  if (constraint.type === "parallel" || constraint.type === "perpendicular") return [constraint.throughPoint];
  if (constraint.type === "intersection") return [constraint.point];
  if (constraint.type === "angle-bisector") return [constraint.a, constraint.vertex, constraint.b];
  if (constraint.type === "tangent") return [constraint.throughPoint, constraint.tangentPoint];
  return [];
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
