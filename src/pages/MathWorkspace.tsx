import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ArrowLeftRight, Axis3d, BetweenHorizontalStart, Blend, Brush, Calculator, Circle, CircleDot, ClipboardCopy, Crosshair, Download, Eraser, EyeOff, FlipHorizontal2, GitBranch, Grid2X2, Highlighter, Layers, LineChart, LockKeyhole, Magnet, MousePointer2, MousePointerClick, Move, Move3D, PanelLeftClose, PanelLeftOpen, Pause, PenLine, PencilRuler, Pentagon, Play, Plus, Presentation, Radius, Rotate3D, RotateCcw, Ruler, Save, ScanLine, Scissors, Search, Sigma, Slash, Spline, Square, Target, TextCursorInput, Trash2, Triangle, UnfoldHorizontal, Wand2, ZoomIn, ZoomOut, type LucideIcon } from "lucide-react";
import { ChangeEvent, CSSProperties, KeyboardEvent, PointerEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import MathKeyboardInput from "../components/math-keyboard/MathKeyboardInput";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import WorkspaceShell from "../components/workspace/WorkspaceShell";
import { runWorkspaceCasQuery } from "../cas/workspaceCas";
import { appendLocusPoint, locusPath, type LocusTracePoint } from "../geometry-kernel/geometryMeasurements";
import { circleInsights, triangleInsights } from "../geometry-kernel/theoremHelpers";
import { distanceFromOrigin, solidMetrics, summarizeSurfaceSamples, vectorComponents, vectorLength, type Space3DMeasurements, type Vector3Tuple } from "../space3d/spaceStudio";
import { roundTo } from "../utils/math";
import { symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicSimplify, symbolicSolve, trySymbolic } from "../utils/symbolic";
import { createWorkspaceObjectsFromSnapshot } from "../workspace/objectRegistry";
import { autoPlotExpressions, createCasVisualSyncLinks, type CasVisualSyncLink } from "../workspace/casVisualSync";
import { animationTargetLabel, orbitalPoint, pingPongValue, type AnimationSnapshot, type AnimationTarget } from "../workspace/animationEngine";
import { createDefaultLesson, lessonStepKinds, lessonSummary, type ClassroomLesson, type LessonStep, type LessonStepKind } from "../workspace/classroomAuthoring";
import { createWorkspaceBundle, isWorkspaceBundle, templateLabel, type ConstructionTemplate } from "../workspace/importExportSuite";
import { computePracticeReport, evaluatePracticeResponse, isAssessableStep, practiceReportText, practiceStatusLabel, type PracticeReport, type PracticeResponse } from "../workspace/practiceAssessment";
import { computeReleaseHealth, releaseStatusLabel, type ReleaseHealth } from "../workspace/releaseReadiness";
import type { ParameterValues } from "../workspace/linkedExpressions";
import { ensureParameterValues, extractParameterNames, substituteParameters, summarizeParameters } from "../workspace/linkedExpressions";
import { useWorkspaceStore } from "../workspace/workspaceStore";

type ResultTableRow = { x: number; y: number; label?: string };
type ResultCard = { id: string; input: string; interpretation: string; result: string; detail?: string; steps?: string[]; table?: ResultTableRow[]; related?: string[]; visualSync?: CasVisualSyncLink[]; syncedAt?: number };
type PlotKind = "function" | "inequality" | "scatter" | "regression";
type PlotItem = { id: string; expression: string; color: string; kind?: PlotKind; points?: ResultTableRow[]; visible?: boolean };
type GeometryTool = "select" | "point" | "segment" | "line" | "ray" | "vector" | "circle" | "polygon" | "angle" | "angle-bisector" | "tangent" | "parallel" | "perpendicular" | "midpoint" | "fixed-length" | "on-circle" | "intersect" | "perpendicular-bisector" | "regular-polygon" | "circle-radius" | "circle-3point" | "semicircle" | "arc" | "sector" | "compass" | "distance" | "area" | "slope" | "locus" | "trace" | "hide-show" | "lock-object" | "duplicate" | "freehand" | "text" | "label" | "slider" | "move-canvas" | "zoom-tool" | "mirror-line" | "reflect-point" | "translate" | "rotate-tool" | "dilate-tool" | "intersect-region" | "image";
type WorkspaceTab = "solve" | "geometry" | "space3d" | "tools";
type GeoPoint = { id: string; x: number; y: number; label: string; locked?: boolean };
type GeoLineKind = "segment" | "line" | "ray" | "vector";
type GeoLine = { id: string; a: string; b: string; kind?: GeoLineKind; locked?: boolean };
type GeoCircle = { id: string; center: string; edge: string; locked?: boolean };
type GeoPolygon = { id: string; points: string[]; locked?: boolean };
type GeoAngle = { id: string; a: string; vertex: string; b: string; locked?: boolean };
type GeoArcKind = "arc" | "semicircle" | "sector";
type GeoArc = { id: string; kind: GeoArcKind; center: string; start: string; end: string; locked?: boolean };
type GeoTextNote = { id: string; point: string; text: string; locked?: boolean };
type GeoConicKind = "parabola" | "ellipse" | "hyperbola";
type GeoConic = { id: string; kind: GeoConicKind; center: string; a: number; b: number; locked?: boolean };
type GeometryTemplateKind =
  | "triangle" | "right-triangle" | "isosceles-triangle" | "equilateral-triangle"
  | "rectangle" | "square" | "parallelogram" | "trapezoid" | "rhombus" | "kite"
  | "pentagon" | "hexagon" | "octagon" | "star"
  | "circle" | "two-circles" | "annulus" | "semicircle" | "sector" | "arc"
  | "angle-shape" | "coordinate-axes"
  | GeoConicKind;
type GeoTransformKind = "reflection" | "reflection-line" | "reflection-point" | "translation" | "rotation" | "dilation";
type GeoTransform = { id: string; type: GeoTransformKind; sourceKind: "point" | "polygon" | "circle" | "conic" | "arc" | "text"; sourceId: string; resultIds: string[]; center?: string; line?: string; vectorLine?: string; angle?: number; scale?: number };
type SelectedGeoObject = { kind: "point" | "line" | "circle" | "polygon" | "angle" | "arc" | "text" | "conic" | "transform" | "constraint"; id: string } | null;
type GeoConstraint =
  | { id: string; type: "parallel" | "perpendicular"; sourceLine: string; throughPoint: string; line: string }
  | { id: string; type: "midpoint"; a: string; b: string; point: string }
  | { id: string; type: "fixed-length"; anchor: string; point: string; length: number }
  | { id: string; type: "on-circle"; point: string; circle: string }
  | { id: string; type: "angle-bisector"; a: string; vertex: string; b: string; line: string }
  | { id: string; type: "tangent"; circle: string; throughPoint: string; tangentPoint: string; line: string }
  | { id: string; type: "intersection"; first: string; second: string; point: string };
type Construction = { points: GeoPoint[]; lines: GeoLine[]; circles: GeoCircle[]; polygons: GeoPolygon[]; angles: GeoAngle[]; arcs: GeoArc[]; texts: GeoTextNote[]; conics: GeoConic[]; transforms: GeoTransform[]; constraints: GeoConstraint[] };
type ConstructionHistoryEntry = { id: string; label: string; timestamp: number; before: Construction };
type DependencyNode = { id: string; label: string; parents: string[]; children: string[]; status: "free" | "dependent" | "locked" | "warning" };
type LocusTrace = { id: string; pointId: string; label: string; points: LocusTracePoint[]; color: string; visible: boolean };
type SurfaceKind = "paraboloid" | "saddle" | "wave" | "plane" | "ripple" | "cone-surface" | "torus" | "helicoid" | "mobius";
type SolidKind = "cube" | "box" | "sphere" | "hemisphere" | "cylinder" | "cone" | "pyramid" | "triangular-prism" | "tetrahedron" | "octahedron" | "dodecahedron" | "icosahedron" | "torus-solid";
type Space3DShapeObject = { id: string; kind: SolidKind; name: string; size: number; position: Vector3Tuple; rotation: Vector3Tuple; color: string; visible: boolean };
type BuiltinSpace3DObjectId = "surface" | "solid" | "cross-section" | "vector" | "point" | "axes" | "grid";
type Space3DObjectId = BuiltinSpace3DObjectId | `shape:${string}`;
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
  surfacePosition3d: Vector3Tuple;
  surfaceRotation3d: Vector3Tuple;
  solidPosition3d: Vector3Tuple;
  solidRotation3d: Vector3Tuple;
  showSurface: boolean;
  showSolid: boolean;
  showAxes3d: boolean;
  showGrid3d: boolean;
  showCrossSection3d: boolean;
  showVector3d: boolean;
  showPoint3d: boolean;
  autoRotate3d: boolean;
  zoom3d: number;
  surfaceDomain: number;
  vectorStart3d: Vector3Tuple;
  vectorEnd3d: Vector3Tuple;
  point3d: Vector3Tuple;
  space3dShapes: Space3DShapeObject[];
  graphParameters: ParameterValues;
  locusTraces: LocusTrace[];
  animationSnapshots: AnimationSnapshot[];
  lesson: ClassroomLesson;
  practiceResponses: Record<string, PracticeResponse>;
  releaseHealth: ReleaseHealth;
  practiceReport: PracticeReport;
};

const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#14b8a6"];
const regressionSeed: ResultTableRow[] = [{ x: -4, y: -5.6 }, { x: -2, y: -2.2 }, { x: 0, y: 0.7 }, { x: 2, y: 4.1 }, { x: 4, y: 7.4 }];
const initialConstruction: Construction = { points: [], lines: [], circles: [], polygons: [], angles: [], arcs: [], texts: [], conics: [], transforms: [], constraints: [] };
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
const formulaLibrary = [
  { topic: "Algebra", title: "Quadratic Formula", formula: "x = (-b +/- sqrt(b^2-4ac))/(2a)", command: "solve x^2-5*x+6=0" },
  { topic: "Calculus", title: "Power Rule", formula: "d/dx x^n = n*x^(n-1)", command: "derivative x^4" },
  { topic: "Calculus", title: "Power Integral", formula: "integral x^n dx = x^(n+1)/(n+1) + C", command: "integral 3*x^2" },
  { topic: "Graphing", title: "Intersection", formula: "f(x)=g(x) means f(x)-g(x)=0", command: "intersect x^2 and 2*x+3" },
  { topic: "Geometry", title: "Circle Area", formula: "A = pi r^2", command: "area circle radius 5" },
  { topic: "3D", title: "Paraboloid", formula: "z = k(x^2+y^2)", command: "plot x^2" },
];
const surfaceOptions: { value: SurfaceKind; label: string }[] = [
  { value: "paraboloid", label: "Paraboloid" },
  { value: "saddle", label: "Saddle" },
  { value: "wave", label: "Wave" },
  { value: "plane", label: "Plane" },
  { value: "ripple", label: "Ripple" },
  { value: "cone-surface", label: "Cone surface" },
  { value: "torus", label: "Parametric torus" },
  { value: "helicoid", label: "Parametric helicoid" },
  { value: "mobius", label: "Mobius strip" },
];
const solidOptions: { value: SolidKind; label: string }[] = [
  { value: "cube", label: "Cube" },
  { value: "box", label: "Rectangular prism" },
  { value: "sphere", label: "Sphere" },
  { value: "hemisphere", label: "Hemisphere" },
  { value: "cylinder", label: "Cylinder" },
  { value: "cone", label: "Cone" },
  { value: "pyramid", label: "Square pyramid" },
  { value: "triangular-prism", label: "Triangular prism" },
  { value: "tetrahedron", label: "Tetrahedron" },
  { value: "octahedron", label: "Octahedron" },
  { value: "dodecahedron", label: "Dodecahedron" },
  { value: "icosahedron", label: "Icosahedron" },
  { value: "torus-solid", label: "Torus solid" },
];
const shapePalette3d: { kind: SolidKind; label: string; icon: LucideIcon }[] = [
  { kind: "cube", label: "Cube", icon: Square },
  { kind: "box", label: "Prism", icon: Square },
  { kind: "sphere", label: "Sphere", icon: Circle },
  { kind: "hemisphere", label: "Hemisphere", icon: CircleDot },
  { kind: "cylinder", label: "Cylinder", icon: Radius },
  { kind: "cone", label: "Cone", icon: Triangle },
  { kind: "pyramid", label: "Pyramid", icon: Triangle },
  { kind: "triangular-prism", label: "Tri Prism", icon: Pentagon },
  { kind: "tetrahedron", label: "Tetra", icon: Triangle },
  { kind: "octahedron", label: "Octa", icon: Axis3d },
  { kind: "dodecahedron", label: "Dodeca", icon: Pentagon },
  { kind: "icosahedron", label: "Icosa", icon: Pentagon },
  { kind: "torus-solid", label: "Torus", icon: CircleDot },
];

export default function MathWorkspace() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("solve");
  const [input, setInput] = useState("plot sin(x)");
  const [results, setResults] = useState<ResultCard[]>([]);
  const [plots, setPlots] = useState<PlotItem[]>([{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }]);
  const [graphParameters, setGraphParameters] = useState<ParameterValues>({ a: 1, b: 0 });
  const [tool, setTool] = useState<GeometryTool>("select");
  const [construction, setConstruction] = useState<Construction>(initialConstruction);
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [selectedCircleIds, setSelectedCircleIds] = useState<string[]>([]);
  const [selectedGeoObject, setSelectedGeoObject] = useState<SelectedGeoObject>(null);
  const [dragPointId, setDragPointId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<ConstructionHistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<ConstructionHistoryEntry[]>([]);
  const [polygonDraft, setPolygonDraft] = useState<string[]>([]);
  const [locusTraces, setLocusTraces] = useState<LocusTrace[]>([]);
  const [activeTracePointId, setActiveTracePointId] = useState<string | null>(null);
  const [surface, setSurface] = useState<SurfaceKind>("paraboloid");
  const [solid, setSolid] = useState<SolidKind>("cube");
  const [surfaceScale, setSurfaceScale] = useState(1);
  const [height3d, setHeight3d] = useState(2.5);
  const [crossSection, setCrossSection] = useState(0);
  const [surfacePosition3d, setSurfacePosition3d] = useState<Vector3Tuple>([0, 0, 0]);
  const [surfaceRotation3d, setSurfaceRotation3d] = useState<Vector3Tuple>([0, 0, 0]);
  const [solidPosition3d, setSolidPosition3d] = useState<Vector3Tuple>([3, 0, 2.6]);
  const [solidRotation3d, setSolidRotation3d] = useState<Vector3Tuple>([0, 0, 0]);
  const [showSurface, setShowSurface] = useState(true);
  const [showSolid, setShowSolid] = useState(true);
  const [showAxes3d, setShowAxes3d] = useState(true);
  const [showGrid3d, setShowGrid3d] = useState(true);
  const [showCrossSection3d, setShowCrossSection3d] = useState(true);
  const [showVector3d, setShowVector3d] = useState(true);
  const [showPoint3d, setShowPoint3d] = useState(true);
  const [autoRotate3d, setAutoRotate3d] = useState(true);
  const [zoom3d, setZoom3d] = useState(1);
  const [surfaceDomain, setSurfaceDomain] = useState(2.6);
  const [vectorStart3d, setVectorStart3d] = useState<Vector3Tuple>([-3, 0.05, -3]);
  const [vectorEnd3d, setVectorEnd3d] = useState<Vector3Tuple>([2.2, 1.4, 1.8]);
  const [point3d, setPoint3d] = useState<Vector3Tuple>([2.2, 1.4, 1.8]);
  const [space3dShapes, setSpace3dShapes] = useState<Space3DShapeObject[]>([]);
  const [selected3dObject, setSelected3dObject] = useState<Space3DObjectId>("surface");
  const [dragging3dObject, setDragging3dObject] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(6);
  const [animationTarget, setAnimationTarget] = useState<AnimationTarget>("graph-parameter");
  const [animationParameter, setAnimationParameter] = useState("a");
  const [animationMin, setAnimationMin] = useState(-3);
  const [animationMax, setAnimationMax] = useState(3);
  const [animationSnapshots, setAnimationSnapshots] = useState<AnimationSnapshot[]>([]);
  const [lesson, setLesson] = useState<ClassroomLesson>(() => createDefaultLesson());
  const [practiceResponses, setPracticeResponses] = useState<Record<string, PracticeResponse>>({});
  const [importStatus, setImportStatus] = useState("No import loaded.");
  const [spaceControlsOpen, setSpaceControlsOpen] = useState(true);
  const [formulaSearch, setFormulaSearch] = useState("");
  const [teachingMode, setTeachingMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const graphExportRef = useRef<HTMLDivElement>(null);
  const geometryExportRef = useRef<SVGSVGElement | null>(null);
  const importFileRef = useRef<HTMLInputElement | null>(null);
  const selectedPointIdsRef = useRef<string[]>([]);
  const polygonDraftRef = useRef<string[]>([]);
  const selectedCircleIdsRef = useRef<string[]>([]);
  const upsertWorkspaceObjects = useWorkspaceStore((state) => state.upsertObjects);
  const recordWorkspaceCommand = useWorkspaceStore((state) => state.recordCommand);

  const filteredFormulas = useMemo(() => {
    const query = formulaSearch.trim().toLowerCase();
    return formulaLibrary.filter((item) => !query || [item.topic, item.title, item.formula].join(" ").toLowerCase().includes(query));
  }, [formulaSearch]);

  const space3dMeasurements = useMemo<Space3DMeasurements>(() => {
    const solidStats = solidMetrics(solid, height3d);
    const surfaceSamples = summarizeSurfaceSamples((x, y) => surfaceZ(surface, x, y, surfaceScale), surfaceDomain, crossSection);
    return {
      vectorLength: vectorLength(vectorStart3d, vectorEnd3d),
      vectorComponents: vectorComponents(vectorStart3d, vectorEnd3d),
      pointDistanceFromOrigin: distanceFromOrigin(point3d),
      solidVolume: solidStats.volume,
      solidSurfaceArea: solidStats.surfaceArea,
      surfaceSampleMin: surfaceSamples.min,
      surfaceSampleMax: surfaceSamples.max,
      crossSectionSamples: surfaceSamples.crossSectionSamples,
    };
  }, [crossSection, height3d, point3d, solid, surface, surfaceDomain, surfaceScale, vectorEnd3d, vectorStart3d]);

  const animationParameterNames = useMemo(() => Object.keys(graphParameters).sort(), [graphParameters]);
  const activeAnimationParameter = animationParameterNames.includes(animationParameter) ? animationParameter : animationParameterNames[0] ?? animationParameter;
  const selected3dShapeId = selected3dObject.startsWith("shape:") ? selected3dObject.slice("shape:".length) : null;
  const selected3dShape = selected3dShapeId ? space3dShapes.find((shape) => shape.id === selected3dShapeId) ?? null : null;
  const geometryObjectCount = construction.points.length + construction.lines.length + construction.circles.length + construction.polygons.length + construction.angles.length + construction.arcs.length + construction.texts.length + construction.conics.length + construction.constraints.length;
  const practiceReport = useMemo(() => computePracticeReport(lesson, practiceResponses), [lesson, practiceResponses]);
  const releaseHealth = useMemo(() => computeReleaseHealth({
    plots: plots.length,
    results: results.length,
    geometryObjects: geometryObjectCount,
    spaceObjects: 7 + space3dShapes.length,
    lessonSteps: lesson.steps.length,
    animationSnapshots: animationSnapshots.length,
    importExportReady: true,
  }), [animationSnapshots.length, geometryObjectCount, lesson.steps.length, plots.length, results.length, space3dShapes.length]);

  const deleteSelected3dObject = () => {
    if (selected3dShapeId) {
      setSpace3dShapes((shapes) => shapes.filter((shape) => shape.id !== selected3dShapeId));
      setSelected3dObject("surface");
      return;
    }
    const visibilitySetters: Record<BuiltinSpace3DObjectId, (value: boolean) => void> = {
      surface: setShowSurface,
      solid: setShowSolid,
      "cross-section": setShowCrossSection3d,
      vector: setShowVector3d,
      point: setShowPoint3d,
      axes: setShowAxes3d,
      grid: setShowGrid3d,
    };
    visibilitySetters[selected3dObject as BuiltinSpace3DObjectId]?.(false);
  };

  const restoreAll3dObjects = () => {
    setShowSurface(true);
    setShowSolid(true);
    setShowAxes3d(true);
    setShowGrid3d(true);
    setShowCrossSection3d(true);
    setShowVector3d(true);
    setShowPoint3d(true);
    setSpace3dShapes((shapes) => shapes.map((shape) => ({ ...shape, visible: true })));
  };

  const add3dObject = (object: Space3DObjectId) => {
    if (object.startsWith("shape:")) {
      setSpace3dShapes((shapes) => shapes.map((shape) => shape.id === object.slice("shape:".length) ? { ...shape, visible: true } : shape));
      setSelected3dObject(object);
      return;
    }
    const visibilitySetters: Record<BuiltinSpace3DObjectId, (value: boolean) => void> = {
      surface: setShowSurface,
      solid: setShowSolid,
      "cross-section": setShowCrossSection3d,
      vector: setShowVector3d,
      point: setShowPoint3d,
      axes: setShowAxes3d,
      grid: setShowGrid3d,
    };
    visibilitySetters[object as BuiltinSpace3DObjectId](true);
    setSelected3dObject(object);
  };

  const add3dShape = (kind: SolidKind) => {
    const id = crypto.randomUUID();
    const count = space3dShapes.filter((shape) => shape.kind === kind).length + 1;
    const offset = space3dShapes.length % 5;
    const shape: Space3DShapeObject = {
      id,
      kind,
      name: `${solidOptions.find((option) => option.value === kind)?.label ?? kind} ${count}`,
      size: 1.8,
      position: clampVector3([-2.8 + offset * 1.35, 0, 2.4 - offset * 0.85]),
      rotation: [0, 0, 0],
      color: colors[space3dShapes.length % colors.length],
      visible: true,
    };
    setSpace3dShapes((shapes) => [...shapes, shape]);
    setSelected3dObject(`shape:${id}`);
  };

  const update3dShape = (id: string, patch: Partial<Space3DShapeObject>) => {
    setSpace3dShapes((shapes) => shapes.map((shape) => shape.id === id ? { ...shape, ...patch } : shape));
  };

  const duplicateSelected3dShape = () => {
    if (!selected3dShape) return;
    const id = crypto.randomUUID();
    const duplicate: Space3DShapeObject = {
      ...selected3dShape,
      id,
      name: `${selected3dShape.name} copy`,
      position: clampVector3([selected3dShape.position[0] + 0.8, selected3dShape.position[1], selected3dShape.position[2] - 0.8]),
    };
    setSpace3dShapes((shapes) => [...shapes, duplicate]);
    setSelected3dObject(`shape:${id}`);
  };

  useEffect(() => {
    if (!animationPlaying) return;
    const startedAt = performance.now() - animationTime * 1000;
    const id = window.setInterval(() => {
      const nextTime = (performance.now() - startedAt) / 1000;
      const value = pingPongValue(nextTime, animationDuration, animationMin, animationMax);
      setAnimationTime(roundTo(nextTime % animationDuration, 3));
      if (animationTarget === "graph-parameter") {
        setGraphParameters((current) => ({ ...current, [activeAnimationParameter]: roundTo(value, 3) }));
      } else if (animationTarget === "cross-section") {
        setCrossSection(roundTo(value, 3));
      } else if (animationTarget === "surface-scale") {
        setSurfaceScale(roundTo(Math.max(0.2, Math.min(2.5, value)), 3));
      } else {
        const angle = pingPongValue(nextTime, animationDuration, 0, Math.PI * 2);
        setPoint3d(orbitalPoint(angle));
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [activeAnimationParameter, animationDuration, animationMax, animationMin, animationPlaying, animationTarget]);

  useEffect(() => {
    upsertWorkspaceObjects(
      createWorkspaceObjectsFromSnapshot({
        input,
        plots,
        results,
        construction,
        activeTool: tool,
        surface,
        solid,
        surfaceScale,
        height3d,
        crossSection,
        surfaceDomain,
        vectorStart3d,
        vectorEnd3d,
        point3d,
        graphParameters,
        locusTraces,
        animationPlaying,
        animationTime,
        animationTarget,
        animationSnapshots,
        lesson,
        practiceResponses,
        practiceReport,
        releaseHealth,
      })
    );
  }, [animationPlaying, animationSnapshots, animationTarget, animationTime, construction, crossSection, graphParameters, height3d, input, lesson, locusTraces, plots, point3d, practiceReport, practiceResponses, releaseHealth, results, solid, surface, surfaceDomain, surfaceScale, tool, upsertWorkspaceObjects, vectorEnd3d, vectorStart3d]);

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
    const analysis = enrichResultWithVisualSync(interpretInput(raw));
    recordWorkspaceCommand(`Ran command: ${raw}`);
    setResults((current) => [analysis, ...current].slice(0, 12));
    syncResultToVisuals(analysis, raw);
  };

  const enrichResultWithVisualSync = (result: ResultCard): ResultCard => {
    const visualSync = createCasVisualSyncLinks(result);
    return visualSync.length ? { ...result, visualSync } : result;
  };

  const addPlotExpression = (expression: string, options?: { source?: string; force?: boolean }) => {
    const normalized = normalizePlotExpression(expression);
    if (!normalized) return;
    setPlots((current) => {
      if (!options?.force && current.some((plot) => plot.expression.replace(/\s+/g, "") === normalized.replace(/\s+/g, ""))) return current;
      return [{ id: crypto.randomUUID(), expression: normalized, color: colors[current.length % colors.length], kind: inferPlotKind(normalized), visible: true }, ...current].slice(0, 10);
    });
    if (options?.source) recordWorkspaceCommand(`Synced graph from ${options.source}: ${normalized}`);
  };

  const syncResultToVisuals = (analysis: ResultCard, rawCommand: string) => {
    if (analysis.interpretation === "2D plot") {
      addPlotExpression(rawCommand, { source: "plot command", force: true });
      return;
    }
    const expressions = autoPlotExpressions(analysis.visualSync ?? []);
    expressions.forEach((expression) => addPlotExpression(expression, { source: analysis.interpretation }));
  };

  const runVisualSyncLink = (link: CasVisualSyncLink) => {
    if (link.kind === "plot" && link.expression) {
      addPlotExpression(link.expression, { source: "CAS visual link", force: true });
      setActiveTab("solve");
      return;
    }
    const command = link.command ?? (link.kind === "table" && link.expression ? `table ${link.expression}` : "");
    if (!command) return;
    setInput(command);
    const analysis = enrichResultWithVisualSync(interpretInput(command));
    recordWorkspaceCommand(`Ran visual sync link: ${command}`);
    setResults((current) => [analysis, ...current].slice(0, 12));
    syncResultToVisuals(analysis, command);
    setActiveTab("solve");
  };

  const captureAnimationSnapshot = () => {
    const snapshot: AnimationSnapshot = {
      id: crypto.randomUUID(),
      label: `${animationTargetLabel(animationTarget)} @ ${roundTo(animationTime, 2)}s`,
      timestamp: Date.now(),
      time: animationTime,
      target: animationTarget,
      parameters: graphParameters,
      crossSection,
      surfaceScale,
      point3d,
    };
    setAnimationSnapshots((current) => [snapshot, ...current].slice(0, 12));
    recordWorkspaceCommand(`Captured animation snapshot: ${snapshot.label}`);
  };

  const applyAnimationSnapshot = (item: AnimationSnapshot) => {
    setGraphParameters(item.parameters);
    setCrossSection(item.crossSection);
    setSurfaceScale(item.surfaceScale);
    setPoint3d(item.point3d);
    setAnimationTime(item.time);
    setAnimationTarget(item.target);
    setAnimationPlaying(false);
  };

  const exportMotionJson = () => downloadText("math-workspace-motion.json", JSON.stringify(animationSnapshots, null, 2), "application/json");

  const touchLesson = (patch: Partial<ClassroomLesson>) => setLesson((current) => ({ ...current, ...patch, updatedAt: Date.now() }));
  const updateLessonStep = (id: string, patch: Partial<LessonStep>) => {
    setLesson((current) => ({
      ...current,
      updatedAt: Date.now(),
      steps: current.steps.map((step) => step.id === id ? { ...step, ...patch } : step),
    }));
  };
  const addLessonStep = (kind: LessonStepKind = "question") => {
    const step: LessonStep = {
      id: crypto.randomUUID(),
      kind,
      title: kind === "teacher-note" ? "Teacher note" : "New lesson step",
      prompt: kind === "check" ? "What should students verify before moving on?" : "Write the student prompt here.",
      command: kind === "explore" ? input : undefined,
      expected: kind === "check" ? "Expected observation or answer." : undefined,
    };
    setLesson((current) => ({ ...current, updatedAt: Date.now(), steps: [...current.steps, step] }));
  };
  const deleteLessonStep = (id: string) => {
    setLesson((current) => ({ ...current, updatedAt: Date.now(), steps: current.steps.filter((step) => step.id !== id) }));
    setPracticeResponses((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };
  const moveLessonStep = (id: string, direction: -1 | 1) => {
    setLesson((current) => {
      const index = current.steps.findIndex((step) => step.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.steps.length) return current;
      const steps = [...current.steps];
      [steps[index], steps[nextIndex]] = [steps[nextIndex], steps[index]];
      return { ...current, updatedAt: Date.now(), steps };
    });
  };
  const runLessonStep = (step: LessonStep) => {
    if (!step.command) return;
    setInput(step.command);
    const analysis = enrichResultWithVisualSync(interpretInput(step.command));
    recordWorkspaceCommand(`Ran lesson step: ${step.title}`);
    setResults((current) => [analysis, ...current].slice(0, 12));
    syncResultToVisuals(analysis, step.command);
    setActiveTab("solve");
  };
  const exportLessonJson = () => downloadText("math-universe-lesson.json", JSON.stringify({ lesson, workspace: snapshot() }, null, 2), "application/json");
  const exportLessonWorksheet = () => downloadText("math-universe-lesson-worksheet.txt", lessonToWorksheet(lesson), "text/plain");
  const updatePracticeAnswer = (stepId: string, answer: string) => {
    setPracticeResponses((current) => ({ ...current, [stepId]: { ...current[stepId], stepId, answer, score: undefined, feedback: undefined, checkedAt: undefined } }));
  };
  const checkPracticeStep = (step: LessonStep) => {
    const answer = practiceResponses[step.id]?.answer ?? "";
    setPracticeResponses((current) => ({ ...current, [step.id]: evaluatePracticeResponse(step, answer) }));
  };
  const exportPracticeReport = () => downloadText("math-universe-practice-report.txt", practiceReportText(lesson, practiceResponses, practiceReport), "text/plain");

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
    if (tool === "text" || tool === "image") {
      const notePointId = queuePoint(point);
      const noteId = crypto.randomUUID();
      commitConstruction(tool === "image" ? "Add image anchor" : "Add text note", (current) => ({ ...current, texts: [...current.texts, { id: noteId, point: notePointId, text: tool === "image" ? "Image" : "Text" }] }));
      setSelectedGeoObject({ kind: "text", id: noteId });
      return;
    }
    if (["segment", "line", "ray", "vector", "circle", "polygon", "angle", "angle-bisector", "tangent", "parallel", "perpendicular", "midpoint", "fixed-length", "on-circle", "perpendicular-bisector", "regular-polygon", "circle-radius", "circle-3point", "semicircle", "arc", "sector", "compass"].includes(tool)) {
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
    if (tool === "circle" || tool === "circle-radius") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        commitConstruction("Add circle", (current) => ({ ...current, circles: [...current.circles, { id: crypto.randomUUID(), center: next[0], edge: next[1] }] }));
        setPendingPointIds([]);
      }
    }
    if (tool === "circle-3point") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-3);
      setPendingPointIds(next);
      if (next.length === 3 && new Set(next).size === 3) {
        commitConstruction("Add circle through 3 points", (current) => addCircleThroughThreePoints(current, next[0], next[1], next[2]));
        setPendingPointIds([]);
      }
    }
    if (tool === "semicircle") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        commitConstruction("Add semicircle", (current) => addSemicircleConstruction(current, next[0], next[1]));
        setPendingPointIds([]);
      }
    }
    if (tool === "arc" || tool === "sector") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-3);
      setPendingPointIds(next);
      if (next.length === 3 && new Set(next).size === 3) {
        commitConstruction(tool === "arc" ? "Add arc" : "Add sector", (current) => ({ ...current, arcs: [...current.arcs, { id: crypto.randomUUID(), kind: tool, center: next[0], start: next[1], end: next[2] }] }));
        setPendingPointIds([]);
      }
    }
    if (tool === "regular-polygon") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        commitConstruction("Add regular polygon", (current) => addRegularPolygonConstruction(current, next[0], next[1], 6));
        setPendingPointIds([]);
      }
    }
    if (tool === "compass") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-3);
      setPendingPointIds(next);
      if (next.length === 3 && new Set(next).size === 3) {
        commitConstruction("Copy length with compass", (current) => addCompassCircleConstruction(current, next[0], next[1], next[2]));
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
    if (tool === "distance") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      setSelectedGeoObject({ kind: "point", id: pointId });
    }
    if (tool === "text" || tool === "image") {
      const noteId = crypto.randomUUID();
      commitConstruction(tool === "image" ? "Add image anchor" : "Add text note", (current) => ({
        ...current,
        texts: [...current.texts, { id: noteId, point: pointId, text: tool === "image" ? "Image" : "Text" }],
      }));
      setPendingPointIds([]);
      setSelectedGeoObject({ kind: "text", id: noteId });
      return;
    }
    if (tool === "reflect-point" || tool === "rotate-tool" || tool === "dilate-tool") {
      if (selectedGeoObject && selectedGeoObject.kind !== "point" && selectedGeoObject.kind !== "line" && selectedGeoObject.kind !== "angle" && selectedGeoObject.kind !== "constraint" && selectedGeoObject.kind !== "transform") {
        const transformKind = tool === "reflect-point" ? "reflection-point" : tool === "rotate-tool" ? "rotation" : "dilation";
        commitConstruction(`Apply ${transformKind}`, (current) => addTransformConstruction(current, selectedGeoObject, transformKind, { centerPointId: pointId }));
        setPendingPointIds([]);
        return;
      }
    }
    if (tool === "translate") {
      const next = [...selectedPointIdsRef.current, pointId].slice(-2);
      setPendingPointIds(next);
      if (selectedGeoObject && selectedGeoObject.kind !== "point" && selectedGeoObject.kind !== "line" && selectedGeoObject.kind !== "angle" && selectedGeoObject.kind !== "constraint" && selectedGeoObject.kind !== "transform" && next.length === 2 && next[0] !== next[1]) {
        commitConstruction("Translate selected object", (current) => addTransformConstruction(current, selectedGeoObject, "translation", { vectorPointIds: [next[0], next[1]] }));
        setPendingPointIds([]);
      }
      return;
    }
    if (["area", "slope", "locus", "trace", "hide-show", "lock-object", "duplicate", "freehand", "label", "slider", "move-canvas", "zoom-tool", "mirror-line", "intersect-region"].includes(tool)) {
      setPendingPointIds([pointId]);
      setSelectedGeoObject({ kind: "point", id: pointId });
    }
  };
  const handleLinePick = (lineId: string) => {
    if (tool === "mirror-line" && selectedGeoObject && selectedGeoObject.kind !== "line" && selectedGeoObject.kind !== "angle" && selectedGeoObject.kind !== "constraint" && selectedGeoObject.kind !== "transform") {
      commitConstruction("Reflect selected object about line", (current) => addTransformConstruction(current, selectedGeoObject, "reflection-line", { lineId }));
      return;
    }
    setSelectedGeoObject({ kind: "line", id: lineId });
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
      arcs: current.arcs.filter((arc) => !selected.has(arc.center) && !selected.has(arc.start) && !selected.has(arc.end)),
      texts: current.texts.filter((note) => !selected.has(note.point)),
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
  const updateGeometryArc = (id: string, patch: Partial<Pick<GeoArc, "kind" | "center" | "start" | "end">>) => {
    commitConstruction("Edit arc", (current) => ({
      ...current,
      arcs: current.arcs.map((arc) => arc.id === id ? { ...arc, ...patch } : arc),
    }));
  };
  const updateGeometryText = (id: string, patch: Partial<Pick<GeoTextNote, "point" | "text">>) => {
    commitConstruction("Edit text", (current) => ({
      ...current,
      texts: current.texts.map((note) => note.id === id ? { ...note, ...patch } : note),
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
  const addGeometryTemplate = (kind: GeometryTemplateKind) => {
    setPendingPointIds([]);
    setPendingPolygonDraft([]);
    commitConstruction(`Add ${kind} template`, (current) => {
      const start = current.points.length;
      const offset = (start % 7) * 16;
      const makePoint = (x: number, y: number, index: number): GeoPoint => ({ id: crypto.randomUUID(), x: x + offset, y: y + offset / 2, label: pointLabelForIndex(start + index) });
      const polygonFromCoords = (coords: Array<[number, number]>, withAngle = false) => {
        const points = coords.map(([x, y], index) => makePoint(x, y, index));
        const polygon: GeoPolygon = { id: crypto.randomUUID(), points: points.map((point) => point.id) };
        const angle = withAngle && points.length >= 3 ? [{ id: crypto.randomUUID(), a: points[0].id, vertex: points[2].id, b: points[1].id }] : [];
        return { ...current, points: [...current.points, ...points], polygons: [...current.polygons, polygon], angles: [...current.angles, ...angle] };
      };
      const regularCoords = (sides: number, radius: number, centerX = 330, centerY = 220, startAngle = -Math.PI / 2) =>
        Array.from({ length: sides }, (_, index): [number, number] => [centerX + Math.cos(startAngle + index * Math.PI * 2 / sides) * radius, centerY + Math.sin(startAngle + index * Math.PI * 2 / sides) * radius]);
      if (kind === "triangle") return polygonFromCoords([[220, 300], [420, 300], [320, 150]], true);
      if (kind === "right-triangle") return polygonFromCoords([[230, 310], [430, 310], [230, 150]], true);
      if (kind === "isosceles-triangle") return polygonFromCoords([[220, 310], [440, 310], [330, 130]], true);
      if (kind === "equilateral-triangle") return polygonFromCoords(regularCoords(3, 112, 330, 238), true);
      if (kind === "rectangle") return polygonFromCoords([[210, 130], [440, 130], [440, 300], [210, 300]]);
      if (kind === "square") return polygonFromCoords([[240, 140], [400, 140], [400, 300], [240, 300]]);
      if (kind === "parallelogram") return polygonFromCoords([[230, 300], [430, 300], [380, 145], [180, 145]]);
      if (kind === "trapezoid") return polygonFromCoords([[210, 310], [450, 310], [390, 155], [270, 155]]);
      if (kind === "rhombus") return polygonFromCoords([[330, 120], [470, 220], [330, 320], [190, 220]]);
      if (kind === "kite") return polygonFromCoords([[330, 110], [430, 235], [330, 330], [240, 235]]);
      if (kind === "pentagon") return polygonFromCoords(regularCoords(5, 105));
      if (kind === "hexagon") return polygonFromCoords(regularCoords(6, 105, 330, 220, Math.PI / 6));
      if (kind === "octagon") return polygonFromCoords(regularCoords(8, 105, 330, 220, Math.PI / 8));
      if (kind === "star") return polygonFromCoords(Array.from({ length: 10 }, (_, index): [number, number] => {
        const radius = index % 2 === 0 ? 112 : 48;
        const angle = -Math.PI / 2 + index * Math.PI / 5;
        return [330 + Math.cos(angle) * radius, 220 + Math.sin(angle) * radius];
      }));
      const points = [makePoint(320, 210, 0), makePoint(440, 210, 1), makePoint(320, 90, 2)];
      if (kind === "circle") return { ...current, points: [...current.points, points[0], points[1]], circles: [...current.circles, { id: crypto.randomUUID(), center: points[0].id, edge: points[1].id }] };
      if (kind === "two-circles") {
        const leftCenter = makePoint(260, 210, 0), leftEdge = makePoint(360, 210, 1), rightCenter = makePoint(410, 210, 2), rightEdge = makePoint(510, 210, 3);
        return { ...current, points: [...current.points, leftCenter, leftEdge, rightCenter, rightEdge], circles: [...current.circles, { id: crypto.randomUUID(), center: leftCenter.id, edge: leftEdge.id }, { id: crypto.randomUUID(), center: rightCenter.id, edge: rightEdge.id }] };
      }
      if (kind === "annulus") {
        const center = makePoint(320, 210, 0), outer = makePoint(455, 210, 1), inner = makePoint(390, 210, 2);
        return { ...current, points: [...current.points, center, outer, inner], circles: [...current.circles, { id: crypto.randomUUID(), center: center.id, edge: outer.id }, { id: crypto.randomUUID(), center: center.id, edge: inner.id }] };
      }
      if (kind === "semicircle") {
        const a = makePoint(220, 260, 0), b = makePoint(440, 260, 1), center = makePoint(330, 260, 2);
        return { ...current, points: [...current.points, a, b, center], arcs: [...current.arcs, { id: crypto.randomUUID(), kind: "semicircle", center: center.id, start: a.id, end: b.id }] };
      }
      if (kind === "sector" || kind === "arc") {
        const center = makePoint(320, 230, 0), startPoint = makePoint(445, 230, 1), endPoint = makePoint(350, 100, 2);
        return { ...current, points: [...current.points, center, startPoint, endPoint], arcs: [...current.arcs, { id: crypto.randomUUID(), kind, center: center.id, start: startPoint.id, end: endPoint.id }] };
      }
      if (kind === "angle-shape") {
        const points = [makePoint(250, 290, 0), makePoint(330, 220, 1), makePoint(470, 250, 2)];
        return { ...current, points: [...current.points, ...points], lines: [...current.lines, { id: crypto.randomUUID(), a: points[1].id, b: points[0].id, kind: "ray" }, { id: crypto.randomUUID(), a: points[1].id, b: points[2].id, kind: "ray" }], angles: [...current.angles, { id: crypto.randomUUID(), a: points[0].id, vertex: points[1].id, b: points[2].id }] };
      }
      if (kind === "coordinate-axes") {
        const points = [makePoint(120, 220, 0), makePoint(540, 220, 1), makePoint(330, 370, 2), makePoint(330, 70, 3)];
        return { ...current, points: [...current.points, ...points], lines: [...current.lines, { id: crypto.randomUUID(), a: points[0].id, b: points[1].id, kind: "line" }, { id: crypto.randomUUID(), a: points[2].id, b: points[3].id, kind: "line" }] };
      }
      const center = makePoint(kind === "parabola" ? 210 : kind === "ellipse" ? 320 : 450, 210, 0);
      const conic: GeoConic = { id: crypto.randomUUID(), kind, center: center.id, a: kind === "parabola" ? 70 : 92, b: kind === "hyperbola" ? 52 : 62 };
      return { ...current, points: [...current.points, center], conics: [...current.conics, conic] };
    });
  };
  const applyGeometryTransform = (type: GeoTransformKind) => {
    if (!selectedGeoObject || selectedGeoObject.kind === "line" || selectedGeoObject.kind === "angle" || selectedGeoObject.kind === "constraint" || selectedGeoObject.kind === "transform") return;
    commitConstruction(`Apply ${type}`, (current) => addTransformConstruction(current, selectedGeoObject, type));
  };
  const traceSelectedPoint = () => {
    if (selectedGeoObject?.kind !== "point") return;
    const point = pointById(construction.points, selectedGeoObject.id);
    if (!point) return;
    setActiveTracePointId(point.id);
    setLocusTraces((current) => {
      const existing = current.find((trace) => trace.pointId === point.id);
      if (existing) return current.map((trace) => trace.pointId === point.id ? { ...trace, visible: true, points: appendLocusPoint(trace.points, point) } : trace);
      return [
        ...current,
        { id: crypto.randomUUID(), pointId: point.id, label: `Trace ${point.label}`, points: [{ x: point.x, y: point.y }], color: colors[current.length % colors.length], visible: true },
      ];
    });
  };
  const stopTrace = () => setActiveTracePointId(null);
  const clearLocusTraces = () => {
    setActiveTracePointId(null);
    setLocusTraces([]);
  };

  const handleBoardPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragPointId) return;
    if (event.pointerType === "touch") event.preventDefault();
    const point = clientToBoard(event);
    if (!point) return;
    setConstruction((current) => {
      const dragged = pointById(current.points, dragPointId);
      if (dragged?.locked) return current;
      const next = solveConstruction({
        ...current,
        points: current.points.map((item) => item.id === dragPointId ? { ...item, x: point.x, y: point.y } : item),
      }, dragPointId);
      if (activeTracePointId) {
        const tracedPoint = pointById(next.points, activeTracePointId);
        if (tracedPoint) {
          setLocusTraces((traces) => traces.map((trace) => trace.pointId === activeTracePointId ? { ...trace, points: appendLocusPoint(trace.points, tracedPoint) } : trace));
        }
      }
      return next;
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
  const snapshot = (): WorkspaceSnapshot => ({ input, results, plots, construction, surface, solid, surfaceScale, height3d, crossSection, surfacePosition3d, surfaceRotation3d, solidPosition3d, solidRotation3d, showSurface, showSolid, showAxes3d, showGrid3d, showCrossSection3d, showVector3d, showPoint3d, autoRotate3d, zoom3d, surfaceDomain, vectorStart3d, vectorEnd3d, point3d, space3dShapes, graphParameters, locusTraces, animationSnapshots, lesson, practiceResponses, releaseHealth, practiceReport });
  const saveWorkspace = () => localStorage.setItem("math-universe-workspace-full", JSON.stringify(snapshot()));
  const restoreWorkspaceSnapshot = (data: Partial<WorkspaceSnapshot>) => {
    setInput(data.input ?? "plot sin(x)");
    setResults(data.results ?? []);
    setPlots(data.plots ?? []);
    setGraphParameters(data.graphParameters ?? { a: 1, b: 0 });
    setLocusTraces(data.locusTraces ?? []);
    setActiveTracePointId(null);
    restoreConstruction(normalizeConstruction(data.construction ?? initialConstruction));
    setUndoStack([]);
    setRedoStack([]);
    setSurface(data.surface ?? "paraboloid");
    setSolid(data.solid ?? "cube");
    setSurfaceScale(data.surfaceScale ?? 1);
    setHeight3d(data.height3d ?? 2.5);
    setCrossSection(data.crossSection ?? 0);
    setSurfacePosition3d(data.surfacePosition3d ?? [0, 0, 0]);
    setSurfaceRotation3d(data.surfaceRotation3d ?? [0, 0, 0]);
    setSolidPosition3d(data.solidPosition3d ?? [3, 0, 2.6]);
    setSolidRotation3d(data.solidRotation3d ?? [0, 0, 0]);
    setShowSurface(data.showSurface ?? true);
    setShowSolid(data.showSolid ?? true);
    setShowAxes3d(data.showAxes3d ?? true);
    setShowGrid3d(data.showGrid3d ?? true);
    setShowCrossSection3d(data.showCrossSection3d ?? true);
    setShowVector3d(data.showVector3d ?? true);
    setShowPoint3d(data.showPoint3d ?? true);
    setAutoRotate3d(data.autoRotate3d ?? true);
    setZoom3d(data.zoom3d ?? 1);
    setSurfaceDomain(data.surfaceDomain ?? 2.6);
    setVectorStart3d(data.vectorStart3d ?? [-3, 0.05, -3]);
    setVectorEnd3d(data.vectorEnd3d ?? [2.2, 1.4, 1.8]);
    setPoint3d(data.point3d ?? [2.2, 1.4, 1.8]);
    setSpace3dShapes(data.space3dShapes ?? []);
    setAnimationSnapshots(data.animationSnapshots ?? []);
    setLesson(data.lesson ?? createDefaultLesson());
    setPracticeResponses(data.practiceResponses ?? {});
    setAnimationPlaying(false);
  };
  const loadWorkspace = () => {
    const saved = localStorage.getItem("math-universe-workspace-full");
    if (!saved) return;
    const data = JSON.parse(saved) as WorkspaceSnapshot;
    restoreWorkspaceSnapshot(data);
    setImportStatus("Loaded workspace from browser storage.");
  };
  const exportWorkspaceJson = () => downloadText("math-workspace.json", JSON.stringify(snapshot(), null, 2), "application/json");
  const exportResultsCsv = () => downloadText("math-workspace-results.csv", resultsToCsv(results), "text/csv");
  const exportGraphSvg = () => {
    const svg = graphExportRef.current?.querySelector("svg");
    if (!svg) return;
    downloadText("math-workspace-graph.svg", svg.outerHTML, "image/svg+xml");
  };
  const exportGeometrySvg = () => {
    const svg = geometryExportRef.current;
    if (!svg) return;
    downloadText("geometry-construction.svg", svg.outerHTML, "image/svg+xml");
  };
  const exportProjectBundle = () => downloadText("math-universe-project-bundle.json", JSON.stringify(createWorkspaceBundle(snapshot(), lesson), null, 2), "application/json");
  const importWorkspaceFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const parsed = JSON.parse(text) as unknown;
      if (isWorkspaceBundle(parsed)) {
        restoreWorkspaceSnapshot(parsed.workspace as Partial<WorkspaceSnapshot>);
        if (parsed.lesson) setLesson(parsed.lesson as ClassroomLesson);
        setImportStatus(`Imported project bundle: ${file.name}`);
      } else if (parsed && typeof parsed === "object" && "workspace" in parsed && "lesson" in parsed) {
        const lessonImport = parsed as { workspace?: Partial<WorkspaceSnapshot>; lesson?: ClassroomLesson };
        restoreWorkspaceSnapshot(lessonImport.workspace ?? {});
        if (lessonImport.lesson) setLesson(lessonImport.lesson);
        setImportStatus(`Imported lesson package: ${file.name}`);
      } else {
        restoreWorkspaceSnapshot(parsed as Partial<WorkspaceSnapshot>);
        setImportStatus(`Imported workspace JSON: ${file.name}`);
      }
    }).catch((error: unknown) => setImportStatus(`Import failed: ${error instanceof Error ? error.message : "Invalid file"}`));
    event.target.value = "";
  };
  const applyConstructionTemplate = (template: ConstructionTemplate) => {
    const next = constructionTemplate(template);
    restoreConstruction(next);
    setUndoStack([]);
    setRedoStack([]);
    setImportStatus(`Loaded template: ${templateLabel(template)}`);
    recordWorkspaceCommand(`Loaded construction template: ${templateLabel(template)}`);
  };
  const runGuidedExample = (command: string) => {
    setInput(command);
    const analysis = enrichResultWithVisualSync(interpretInput(command));
    recordWorkspaceCommand(`Ran guided example: ${command}`);
    setResults((current) => [analysis, ...current].slice(0, 12));
    syncResultToVisuals(analysis, command);
  };
  const handleWorkspaceKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setAnimationPlaying(false);
      setDragPointId(null);
      return;
    }
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
    if (event.key.toLowerCase() === "e" && event.shiftKey) {
      event.preventDefault();
      exportProjectBundle();
    }
    const tabIndex = Number(event.key);
    if (tabIndex >= 1 && tabIndex <= workspaceTabs.length) {
      event.preventDefault();
      setActiveTab(workspaceTabs[tabIndex - 1].id);
    }
  };

  return (
    <WorkspaceShell
      title="Math Workspace"
      subtitle="A unified GeoGebra and Wolfram-style workspace for graphing, commands, results, geometry, and 3D scenes."
      views={workspaceTabs}
      activeView={activeTab}
      commandValue={input}
      onCommandChange={setInput}
      onCommandRun={runInput}
      onViewChange={(viewId) => setActiveTab(viewId as WorkspaceTab)}
      onKeyDown={handleWorkspaceKeyDown}
    >

      {activeTab === "tools" && (
      <SectionCard title="Workspace Tools" description="Save, export, teach, search formulas, and launch guided examples." className="workspace-stage-card flex flex-col" compact>
        <div className="grid min-h-0 min-w-0 flex-1 gap-3 overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-4 overflow-auto pr-1">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={saveWorkspace} className="action-secondary"><Save className="h-4 w-4" />Save workspace</button>
              <button type="button" onClick={loadWorkspace} className="action-secondary"><Download className="h-4 w-4" />Load workspace</button>
              <button type="button" onClick={exportWorkspaceJson} className="action-secondary"><Download className="h-4 w-4" />Export JSON</button>
              <button type="button" onClick={exportProjectBundle} className="action-secondary"><Download className="h-4 w-4" />Project bundle</button>
              <button type="button" onClick={() => importFileRef.current?.click()} className="action-secondary"><Download className="h-4 w-4" />Import JSON</button>
              <button type="button" onClick={exportResultsCsv} className="action-secondary"><Download className="h-4 w-4" />Export CSV</button>
              <button type="button" onClick={exportGraphSvg} className="action-secondary"><Download className="h-4 w-4" />Export graph SVG</button>
              <button type="button" onClick={exportGeometrySvg} className="action-secondary"><Download className="h-4 w-4" />Export geometry SVG</button>
              <button type="button" onClick={exportLessonJson} className="action-secondary"><Download className="h-4 w-4" />Export lesson</button>
              <button type="button" onClick={exportLessonWorksheet} className="action-secondary"><Download className="h-4 w-4" />Worksheet</button>
              <button type="button" onClick={exportPracticeReport} className="action-secondary"><Download className="h-4 w-4" />Practice report</button>
              <button type="button" onClick={() => setTeachingMode((value) => !value)} className={teachingMode ? "action-primary" : "action-secondary"}><Presentation className="h-4 w-4" />Teaching mode</button>
            </div>
            <input ref={importFileRef} type="file" accept="application/json,.json" className="hidden" onChange={importWorkspaceFile} />
            <ReleaseReadinessPanel health={releaseHealth} />
            <ImportExportSuitePanel importStatus={importStatus} onTemplate={applyConstructionTemplate} />
            <ClassroomAuthoringPanel
              lesson={lesson}
              onLessonChange={touchLesson}
              onStepChange={updateLessonStep}
              onAddStep={addLessonStep}
              onDeleteStep={deleteLessonStep}
              onMoveStep={moveLessonStep}
              onRunStep={runLessonStep}
              onReset={() => setLesson(createDefaultLesson())}
            />
            <PracticeAssessmentPanel
              lesson={lesson}
              responses={practiceResponses}
              report={practiceReport}
              onAnswer={updatePracticeAnswer}
              onCheck={checkPracticeStep}
              onRunStep={runLessonStep}
              onReset={() => setPracticeResponses({})}
              onExport={exportPracticeReport}
            />
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
      <SectionCard title="CAS and Graphing" description="Run calculations, graph functions, inspect results, and sync visual outputs." className="workspace-stage-card flex flex-col" compact>
        <div className="grid min-h-0 min-w-0 flex-1 gap-3 overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_320px]">
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
              <GraphPanel plots={plots} onChange={setPlots} parameters={graphParameters} onParametersChange={setGraphParameters} />
            </div>
            <AnimationStudio
              playing={animationPlaying}
              time={animationTime}
              duration={animationDuration}
              target={animationTarget}
              parameter={activeAnimationParameter}
              parameterNames={animationParameterNames}
              min={animationMin}
              max={animationMax}
              snapshots={animationSnapshots}
              onPlaying={setAnimationPlaying}
              onTime={setAnimationTime}
              onDuration={setAnimationDuration}
              onTarget={setAnimationTarget}
              onParameter={setAnimationParameter}
              onMin={setAnimationMin}
              onMax={setAnimationMax}
              onCapture={captureAnimationSnapshot}
              onApplySnapshot={applyAnimationSnapshot}
              onClearSnapshots={() => setAnimationSnapshots([])}
              onExport={exportMotionJson}
            />
          </div>
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-3 overflow-auto pr-1">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Results</h2>
              <button type="button" onClick={() => setResults([])} className="rounded-full bg-slate-100 p-2 dark:bg-white/10" title="Clear results" aria-label="Clear results"><Trash2 className="h-4 w-4" /></button>
            </div>
            {results.length === 0 ? <EmptyPanel text="Run a command to see interpretation, exact result, numeric checks, and related output." /> : results.map((result) => <ResultCardView key={result.id} result={result} onVisualSync={runVisualSyncLink} />)}
          </div>
        </div>
      </SectionCard>
      )}

      {activeTab === "space3d" && (
      <SectionCard title="3D Graphing and Solids" className="workspace-stage-card flex flex-col [&>div:first-of-type]:mb-1" compact>
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
                {surfaceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <span className="text-sm font-semibold">Solid</span>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={solid} onChange={(event) => setSolid(event.target.value as SolidKind)}>
                {solidOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <button type="button" onClick={() => add3dShape(solid)} className="action-primary mt-2 w-full justify-center">
                <Plus className="h-4 w-4" />Add selected solid
              </button>
            </label>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-950/40">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">3D shape palette</p>
                <span className="mini-chip">{space3dShapes.length} added</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {shapePalette3d.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.kind} type="button" onClick={() => add3dShape(item.kind)} className="tool-button min-h-[58px] flex-col justify-center gap-1 px-2 py-2 text-[11px]">
                      <Icon className="h-4 w-4" />{item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm font-semibold">Scene objects</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["surface", "solid", "cross-section", "vector", "point", "axes", "grid"] as BuiltinSpace3DObjectId[]).map((object) => (
                  <button key={object} type="button" onClick={() => add3dObject(object)} className={selected3dObject === object ? "action-primary justify-center capitalize" : "tool-button justify-center capitalize"}>
                    <Plus className="h-4 w-4" />{object.replace("-", " ")}
                  </button>
                ))}
                {selected3dShape && <button type="button" onClick={duplicateSelected3dShape} className="tool-button justify-center"><ClipboardCopy className="h-4 w-4" />Duplicate</button>}
              </div>
            </div>
            <SliderControl label="Surface scale" value={surfaceScale} min={0.2} max={2.5} step={0.1} onChange={setSurfaceScale} />
            <SliderControl label="Surface domain / clip" value={surfaceDomain} min={1.2} max={3.5} step={0.1} onChange={setSurfaceDomain} />
            <SliderControl label="Solid height / radius" value={height3d} min={0.8} max={5} step={0.1} onChange={setHeight3d} />
            <SliderControl label="Cross-section z" value={crossSection} min={-3} max={3} step={0.1} onChange={setCrossSection} />
            <div className="grid grid-cols-2 gap-2">
              <Toggle checked={showSurface} label="Surface" onChange={setShowSurface} />
              <Toggle checked={showSolid} label="Solid" onChange={setShowSolid} />
              <Toggle checked={showAxes3d} label="Axes" onChange={setShowAxes3d} />
              <Toggle checked={showGrid3d} label="Grid" onChange={setShowGrid3d} />
              <Toggle checked={showCrossSection3d} label="Slice" onChange={setShowCrossSection3d} />
              <Toggle checked={showVector3d} label="Vector" onChange={setShowVector3d} />
              <Toggle checked={showPoint3d} label="Point" onChange={setShowPoint3d} />
              <button type="button" onClick={() => setAutoRotate3d((value) => !value)} className={autoRotate3d ? "action-primary justify-center" : "tool-button justify-center"}>
                {autoRotate3d ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {autoRotate3d ? "Pause rotation" : "Start rotation"}
              </button>
              <button type="button" onClick={() => { setZoom3d(1); setSurfaceScale(1); setSurfaceDomain(2.6); setCrossSection(0); setSurfacePosition3d([0, 0, 0]); setSurfaceRotation3d([0, 0, 0]); setSolidPosition3d([3, 0, 2.6]); setSolidRotation3d([0, 0, 0]); setVectorStart3d([-3, 0.05, -3]); setVectorEnd3d([2.2, 1.4, 1.8]); setPoint3d([2.2, 1.4, 1.8]); setSpace3dShapes([]); setAutoRotate3d(false); restoreAll3dObjects(); setSelected3dObject("surface"); }} className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold dark:bg-white/10">Reset</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setZoom3d((value) => Math.max(0.6, roundTo(value - 0.1, 2)))} className="action-secondary"><ZoomOut className="h-4 w-4" />Zoom out</button>
              <button type="button" onClick={() => setZoom3d((value) => Math.min(1.8, roundTo(value + 0.1, 2)))} className="action-secondary"><ZoomIn className="h-4 w-4" />Zoom in</button>
              <button type="button" onClick={deleteSelected3dObject} className="math-tool-button-danger px-3"><Trash2 className="h-4 w-4" />Delete selected</button>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">3D Readout</p>
              <p>Surface: {surfaceFormula(surface, surfaceScale)}</p>
              <p>Cross-section plane: z = {roundTo(crossSection, 2)}</p>
              <p>Surface range: {roundTo(space3dMeasurements.surfaceSampleMin, 2)} to {roundTo(space3dMeasurements.surfaceSampleMax, 2)}</p>
              <p>Vector length: {roundTo(space3dMeasurements.vectorLength, 2)}</p>
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
              height="clamp(420px, calc(100vh - 260px), 620px)"
              mobileHeight="280px"
              interactionLabel="Left drag rotate - wheel/pinch zoom - right drag pan"
              sceneLabel={autoRotate3d ? "Workspace 3D - rotating" : "Workspace 3D - paused"}
            >
              <ambientLight intensity={0.75} />
              <directionalLight position={[5, 6, 4]} intensity={1.2} />
              <Workspace3DScene
                surface={surface}
                solid={solid}
                surfaceScale={surfaceScale}
                solidSize={height3d}
                crossSection={crossSection}
                surfaceDomain={surfaceDomain}
                surfacePosition={surfacePosition3d}
                surfaceRotation={surfaceRotation3d}
                solidPosition={solidPosition3d}
                solidRotation={solidRotation3d}
                vectorStart={vectorStart3d}
                vectorEnd={vectorEnd3d}
                point={point3d}
                shapes={space3dShapes}
                showSurface={showSurface}
                showSolid={showSolid}
                showAxes={showAxes3d}
                showGrid={showGrid3d}
                showCrossSection={showCrossSection3d}
                showVector={showVector3d}
                showPoint={showPoint3d}
                autoRotate={autoRotate3d}
                zoom={zoom3d}
                selectedObject={selected3dObject}
                onSelect={setSelected3dObject}
                onVectorStart={setVectorStart3d}
                onVectorEnd={setVectorEnd3d}
                onPoint={setPoint3d}
                onSurfacePosition={setSurfacePosition3d}
                onSolidPosition={setSolidPosition3d}
                onShapeChange={update3dShape}
                onSurfaceScale={setSurfaceScale}
                onSurfaceDomain={setSurfaceDomain}
                onSolidSize={setHeight3d}
                onCrossSection={setCrossSection}
                onDragActive={setDragging3dObject}
              />
              <OrbitControls enablePan enableZoom enableDamping enabled={!dragging3dObject} autoRotate={autoRotate3d && !dragging3dObject} autoRotateSpeed={0.6} />
            </ThreeSceneWrapper>
            <Workspace3DInspector
              surface={surface}
              solid={solid}
              surfaceScale={surfaceScale}
              solidSize={height3d}
              crossSection={crossSection}
              surfaceDomain={surfaceDomain}
              surfacePosition={surfacePosition3d}
              surfaceRotation={surfaceRotation3d}
              solidPosition={solidPosition3d}
              solidRotation={solidRotation3d}
              vectorStart={vectorStart3d}
              vectorEnd={vectorEnd3d}
              point={point3d}
              shapes={space3dShapes}
              selectedShape={selected3dShape}
              measurements={space3dMeasurements}
              showSurface={showSurface}
              showSolid={showSolid}
              showAxes={showAxes3d}
              showGrid={showGrid3d}
              showCrossSection={showCrossSection3d}
              showVector={showVector3d}
              showPoint={showPoint3d}
              autoRotate={autoRotate3d}
              zoom={zoom3d}
              selectedObject={selected3dObject}
              onSurface={setSurface}
              onSolid={setSolid}
              onSurfaceScale={setSurfaceScale}
              onSolidSize={setHeight3d}
              onCrossSection={setCrossSection}
              onSurfaceDomain={setSurfaceDomain}
              onSurfacePosition={setSurfacePosition3d}
              onSurfaceRotation={setSurfaceRotation3d}
              onSolidPosition={setSolidPosition3d}
              onSolidRotation={setSolidRotation3d}
              onVectorStart={setVectorStart3d}
              onVectorEnd={setVectorEnd3d}
              onPoint={setPoint3d}
              onAddShape={add3dShape}
              onShapeChange={update3dShape}
              onDuplicateShape={duplicateSelected3dShape}
              onShowSurface={setShowSurface}
              onShowSolid={setShowSolid}
              onShowAxes={setShowAxes3d}
              onShowGrid={setShowGrid3d}
              onShowCrossSection={setShowCrossSection3d}
              onShowVector={setShowVector3d}
              onShowPoint={setShowPoint3d}
              onAutoRotate={setAutoRotate3d}
              onZoom={setZoom3d}
              onSelect={setSelected3dObject}
              onDeleteSelected={deleteSelected3dObject}
              onRestoreAll={restoreAll3dObjects}
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
      <SectionCard title="Geometry Constructor" description="Create points, lines, circles, polygons, drag points, and inspect live measurements." className="workspace-stage-card flex flex-col" compact>
        <div className="grid min-h-0 min-w-0 flex-1 gap-3 overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid min-h-0 min-w-0 gap-2 overflow-hidden lg:grid-cols-[238px_minmax(0,1fr)]">
            <GeometryToolPalette
              activeTool={tool}
              onTool={chooseGeometryTool}
              onDelete={deleteSelectedGeometry}
              onUndo={undoConstruction}
              onRedo={redoConstruction}
              onReset={() => { commitConstruction("Reset construction", () => initialConstruction); setPendingPointIds([]); setPendingPolygonDraft([]); setPendingCircleIds([]); setSelectedGeoObject(null); }}
              onSave={saveConstruction}
              onLoad={loadConstruction}
              onTemplate={addGeometryTemplate}
              onTransform={applyGeometryTransform}
              onTrace={traceSelectedPoint}
              onStopTrace={stopTrace}
              onClearTrace={clearLocusTraces}
              tracing={Boolean(activeTracePointId)}
            />
            <div className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto] gap-2 overflow-hidden">
              <svg
                ref={svgRef}
                data-export="geometry"
                viewBox="0 0 640 420"
                onPointerDown={handleBoardPointerDown}
                onPointerMove={handleBoardPointerMove}
                onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragPointId(null); }}
                onPointerLeave={() => setDragPointId(null)}
                className="workspace-canvas w-full max-w-full touch-none rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950"
              >
                <title>Math Universe Geometry Construction</title>
                <GeometryGrid />
                <LocusTraceOverlay traces={locusTraces} />
                <ConstraintOverlays construction={construction} />
                {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} selected={selectedGeoObject?.kind === "polygon" && selectedGeoObject.id === polygon.id} onSelect={() => setSelectedGeoObject({ kind: "polygon", id: polygon.id })} />)}
                {construction.arcs.map((arc) => <GeometryArc key={arc.id} arc={arc} points={construction.points} selected={selectedGeoObject?.kind === "arc" && selectedGeoObject.id === arc.id} onSelect={() => setSelectedGeoObject({ kind: "arc", id: arc.id })} />)}
                {construction.conics.map((conic) => <GeometryConic key={conic.id} conic={conic} points={construction.points} selected={selectedGeoObject?.kind === "conic" && selectedGeoObject.id === conic.id} onSelect={() => setSelectedGeoObject({ kind: "conic", id: conic.id })} />)}
                {construction.angles.map((angle) => <GeometryAngle key={angle.id} angle={angle} points={construction.points} selected={selectedGeoObject?.kind === "angle" && selectedGeoObject.id === angle.id} onSelect={() => setSelectedGeoObject({ kind: "angle", id: angle.id })} />)}
                {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} selected={selectedGeoObject?.kind === "line" && selectedGeoObject.id === line.id} onSelect={() => handleLinePick(line.id)} />)}
                {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} selected={(selectedGeoObject?.kind === "circle" && selectedGeoObject.id === circle.id) || selectedCircleIds.includes(circle.id)} onSelect={() => handleCirclePick(circle.id)} />)}
                {construction.texts.map((note) => <GeometryTextNote key={note.id} note={note} points={construction.points} selected={selectedGeoObject?.kind === "text" && selectedGeoObject.id === note.id} onSelect={() => setSelectedGeoObject({ kind: "text", id: note.id })} />)}
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
          </div>
          <div className="thin-scrollbar min-h-0 min-w-0 space-y-3 overflow-auto pr-1">
            <GeometryLabResults construction={construction} selected={selectedGeoObject} selectedPointIds={selectedPointIds} activeTool={tool} />
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
              onUpdateArc={updateGeometryArc}
              onUpdateText={updateGeometryText}
              onUpdateConic={updateGeometryConic}
              onToggleLock={toggleGeometryLock}
              onDelete={deleteGeometryObject}
            />
            <Measurements construction={construction} />
            <GeometryKernelPanel
              construction={construction}
              selected={selectedGeoObject}
              traces={locusTraces}
              activeTracePointId={activeTracePointId}
              onTraceSelected={traceSelectedPoint}
              onStopTrace={stopTrace}
              onClearTraces={clearLocusTraces}
              onToggleTrace={(traceId) => setLocusTraces((current) => current.map((trace) => trace.id === traceId ? { ...trace, visible: !trace.visible } : trace))}
              onDeleteTrace={(traceId) => setLocusTraces((current) => current.filter((trace) => trace.id !== traceId))}
            />
            <DependencyPanel construction={construction} selected={selectedGeoObject} onSelect={setSelectedGeoObject} />
            <ConstraintPanel construction={construction} undoStack={undoStack} redoStack={redoStack} onUndo={undoConstruction} onRedo={redoConstruction} />
          </div>
        </div>
      </SectionCard>
      )}
    </WorkspaceShell>
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
    const routed = runWorkspaceCasQuery(normalized);
    if (routed) {
      return {
        id: crypto.randomUUID(),
        input,
        interpretation: routed.query.intent === "external-data-tool" ? "External data tool handoff" : `Workspace ${routed.query.intent}`,
        result: routed.result ?? routed.symbolic?.result ?? routed.query.expression,
        detail: routed.detail,
        steps: routed.steps,
        related: routed.related,
      };
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

function GraphPanel({
  plots,
  onChange,
  parameters,
  onParametersChange,
}: {
  plots: PlotItem[];
  onChange: (plots: PlotItem[]) => void;
  parameters: ParameterValues;
  onParametersChange: (parameters: ParameterValues) => void;
}) {
  const [draft, setDraft] = useState("cos(x)");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const visiblePlots = plots.filter((plot) => plot.visible !== false);
  const viewport = useMemo(() => ({ xMin, xMax, yMin, yMax, width: 640, height: 360 }), [xMin, xMax, yMin, yMax]);
  const parameterNames = useMemo(() => extractParameterNames([...plots.map((plot) => plot.expression), draft]), [draft, plots]);
  const activeParameters = useMemo(() => ensureParameterValues(parameterNames, parameters), [parameterNames, parameters]);
  useEffect(() => {
    const current = JSON.stringify(parameters);
    const next = JSON.stringify(activeParameters);
    if (current !== next) onParametersChange(activeParameters);
  }, [activeParameters, onParametersChange, parameters]);
  const resolveExpression = (expression: string) => substituteParameters(expression, activeParameters);
  const paths = useMemo(() => visiblePlots.map((plot) => ({ ...plot, path: graphPath(stripInequality(resolveExpression(plot.expression)), viewport) })), [activeParameters, visiblePlots, viewport]);
  const tableRows = useMemo(() => visiblePlots.slice(0, 3).flatMap((plot) => sampleTable(resolveExpression(plot.expression), plot.expression).slice(0, 7)), [activeParameters, visiblePlots]);
  const regression = useMemo(() => linearRegression(regressionSeed), []);
  const inequalityRegions = useMemo(() => visiblePlots.filter((plot) => (plot.kind ?? inferPlotKind(plot.expression)) === "inequality").map((plot) => inequalityRegion(resolveExpression(plot.expression), viewport)), [activeParameters, visiblePlots, viewport]);
  const addPlot = (expression: string, kind: PlotKind = inferPlotKind(expression)) => onChange([{ id: crypto.randomUUID(), expression, color: colors[plots.length % colors.length], kind, visible: true }, ...plots].slice(0, 10));
  const updatePlot = (id: string, patch: Partial<PlotItem>) => onChange(plots.map((plot) => plot.id === id ? { ...plot, ...patch } : plot));
  const removePlot = (id: string) => onChange(plots.filter((plot) => plot.id !== id));
  const addRegression = () => onChange([{ id: crypto.randomUUID(), expression: regression.expression, color: "#ec4899", kind: "regression" as PlotKind, points: regressionSeed, visible: true }, ...plots].slice(0, 10));
  const updateParameter = (name: string, value: number) => onParametersChange({ ...activeParameters, [name]: value });
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold">Linked parameter sliders</p>
                <span className="mini-chip">{parameterNames.length} active</span>
              </div>
              {parameterNames.length === 0 ? (
                <p className="mt-3 rounded-xl bg-white/70 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                  Add a parameter such as `a`, `b`, or `k` in an expression to create a live slider.
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  {parameterNames.map((name) => (
                    <SliderControl key={name} label={name} value={activeParameters[name] ?? 1} min={-10} max={10} step={0.1} onChange={(value) => updateParameter(name, value)} />
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Current binding: {summarizeParameters(activeParameters)}.</p>
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

function AnimationStudio({
  playing,
  time,
  duration,
  target,
  parameter,
  parameterNames,
  min,
  max,
  snapshots,
  onPlaying,
  onTime,
  onDuration,
  onTarget,
  onParameter,
  onMin,
  onMax,
  onCapture,
  onApplySnapshot,
  onClearSnapshots,
  onExport,
}: {
  playing: boolean;
  time: number;
  duration: number;
  target: AnimationTarget;
  parameter: string;
  parameterNames: string[];
  min: number;
  max: number;
  snapshots: AnimationSnapshot[];
  onPlaying: (value: boolean) => void;
  onTime: (value: number) => void;
  onDuration: (value: number) => void;
  onTarget: (value: AnimationTarget) => void;
  onParameter: (value: string) => void;
  onMin: (value: number) => void;
  onMax: (value: number) => void;
  onCapture: () => void;
  onApplySnapshot: (snapshot: AnimationSnapshot) => void;
  onClearSnapshots: () => void;
  onExport: () => void;
}) {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-200">Animation tools</p>
          <h3 className="text-base font-black text-slate-950 dark:text-white">Timeline, keyframes, traces, snapshots</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onPlaying(!playing)} className={playing ? "action-primary py-2" : "action-secondary py-2"}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={onCapture} className="action-secondary py-2"><Save className="h-4 w-4" />Snapshot</button>
          <button type="button" onClick={onExport} disabled={!snapshots.length} className="action-secondary py-2 disabled:opacity-50"><Download className="h-4 w-4" />Motion JSON</button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-950/40">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black">{animationTargetLabel(target)}</p>
              <span className="mini-chip">{roundTo(time, 2)}s / {roundTo(duration, 1)}s</span>
            </div>
            <input
              className="mt-3 w-full accent-cyan-500"
              type="range"
              min={0}
              max={duration}
              step={0.05}
              value={Math.min(duration, time)}
              onChange={(event) => {
                onPlaying(false);
                onTime(Number(event.target.value));
              }}
            />
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            <label className="rounded-xl bg-white/80 p-3 text-xs font-bold dark:bg-slate-950/40">
              Target
              <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={target} onChange={(event) => onTarget(event.target.value as AnimationTarget)}>
                <option value="graph-parameter">Graph parameter</option>
                <option value="cross-section">3D cross-section</option>
                <option value="surface-scale">Surface scale</option>
                <option value="point-orbit">Point P orbit</option>
              </select>
            </label>
            <label className="rounded-xl bg-white/80 p-3 text-xs font-bold dark:bg-slate-950/40">
              Parameter
              <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={parameter} onChange={(event) => onParameter(event.target.value)} disabled={!parameterNames.length || target !== "graph-parameter"}>
                {(parameterNames.length ? parameterNames : [parameter]).map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <MiniNumber label="Duration" value={duration} onChange={(value) => onDuration(Math.max(0.5, value))} />
            <MiniNumber label="Min" value={min} onChange={onMin} />
            <MiniNumber label="Max" value={max} onChange={onMax} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="mini-chip" onClick={() => { onTarget("graph-parameter"); onMin(-4); onMax(4); onDuration(5); }}>Slider sweep</button>
            <button type="button" className="mini-chip" onClick={() => { onTarget("cross-section"); onMin(-2); onMax(2); onDuration(6); }}>Slice scan</button>
            <button type="button" className="mini-chip" onClick={() => { onTarget("surface-scale"); onMin(0.4); onMax(2.3); onDuration(7); }}>Surface pulse</button>
            <button type="button" className="mini-chip" onClick={() => { onTarget("point-orbit"); onDuration(8); }}>Point orbit</button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-950/40">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black">Motion snapshots</p>
            <button type="button" className="mini-chip" onClick={onClearSnapshots}>Clear</button>
          </div>
          <div className="thin-scrollbar mt-2 max-h-48 space-y-2 overflow-auto pr-1">
            {snapshots.length === 0 ? (
              <p className="rounded-xl bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-white/10 dark:text-slate-300">Capture frames while animating to build a small motion path export.</p>
            ) : snapshots.map((item) => (
              <button key={item.id} type="button" onClick={() => onApplySnapshot(item)} className="w-full rounded-xl bg-slate-100 p-3 text-left text-xs dark:bg-white/10">
                <span className="block font-black">{item.label}</span>
                <span className="mt-1 block text-slate-500 dark:text-slate-300">{animationTargetLabel(item.target)} saved with {Object.keys(item.parameters).length} graph parameter(s).</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassroomAuthoringPanel({
  lesson,
  onLessonChange,
  onStepChange,
  onAddStep,
  onDeleteStep,
  onMoveStep,
  onRunStep,
  onReset,
}: {
  lesson: ClassroomLesson;
  onLessonChange: (patch: Partial<ClassroomLesson>) => void;
  onStepChange: (id: string, patch: Partial<LessonStep>) => void;
  onAddStep: (kind?: LessonStepKind) => void;
  onDeleteStep: (id: string) => void;
  onMoveStep: (id: string, direction: -1 | 1) => void;
  onRunStep: (step: LessonStep) => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-300/20 dark:bg-amber-300/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-200">Classroom authoring</p>
          <h3 className="text-base font-black text-slate-950 dark:text-white">Activity builder</h3>
          <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{lessonSummary(lesson)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lessonStepKinds.map((kind) => <button key={kind} type="button" onClick={() => onAddStep(kind)} className="mini-chip">{kind}</button>)}
          <button type="button" onClick={onReset} className="mini-chip">Reset</button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="text-xs font-bold">
          Lesson title
          <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" value={lesson.title} onChange={(event) => onLessonChange({ title: event.target.value })} />
        </label>
        <label className="text-xs font-bold">
          Audience
          <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" value={lesson.audience} onChange={(event) => onLessonChange({ audience: event.target.value })} />
        </label>
        <label className="text-xs font-bold md:col-span-2">
          Objective
          <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" value={lesson.objective} onChange={(event) => onLessonChange({ objective: event.target.value })} />
        </label>
        <label className="text-xs font-bold md:col-span-2">
          Teacher notes
          <textarea className="mt-1 min-h-20 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" value={lesson.teacherNotes} onChange={(event) => onLessonChange({ teacherNotes: event.target.value })} />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {lesson.steps.map((step, index) => (
          <div key={step.id} className="rounded-2xl bg-white/80 p-3 dark:bg-slate-950/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="mini-chip">Step {index + 1}: {step.kind}</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="mini-chip" onClick={() => onMoveStep(step.id, -1)}>Up</button>
                <button type="button" className="mini-chip" onClick={() => onMoveStep(step.id, 1)}>Down</button>
                {step.command && <button type="button" className="mini-chip" onClick={() => onRunStep(step)}>Run</button>}
                <button type="button" className="mini-chip" onClick={() => onDeleteStep(step.id)}>Delete</button>
              </div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <label className="text-xs font-bold">
                Kind
                <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={step.kind} onChange={(event) => onStepChange(step.id, { kind: event.target.value as LessonStepKind })}>
                  {lessonStepKinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold">
                Title
                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-slate-900" value={step.title} onChange={(event) => onStepChange(step.id, { title: event.target.value })} />
              </label>
              <label className="text-xs font-bold md:col-span-2">
                Student prompt
                <textarea className="mt-1 min-h-16 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-slate-900" value={step.prompt} onChange={(event) => onStepChange(step.id, { prompt: event.target.value })} />
              </label>
              <label className="text-xs font-bold">
                Workspace command
                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-sm dark:border-white/10 dark:bg-slate-900" value={step.command ?? ""} onChange={(event) => onStepChange(step.id, { command: event.target.value || undefined })} />
              </label>
              <label className="text-xs font-bold">
                Expected answer
                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-slate-900" value={step.expected ?? ""} onChange={(event) => onStepChange(step.id, { expected: event.target.value || undefined })} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeAssessmentPanel({
  lesson,
  responses,
  report,
  onAnswer,
  onCheck,
  onRunStep,
  onReset,
  onExport,
}: {
  lesson: ClassroomLesson;
  responses: Record<string, PracticeResponse>;
  report: PracticeReport;
  onAnswer: (stepId: string, answer: string) => void;
  onCheck: (step: LessonStep) => void;
  onRunStep: (step: LessonStep) => void;
  onReset: () => void;
  onExport: () => void;
}) {
  const assessableSteps = lesson.steps.filter(isAssessableStep);
  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-300/20 dark:bg-indigo-300/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-200">Practice assessment</p>
          <h3 className="text-base font-black text-slate-950 dark:text-white">{practiceStatusLabel(report.status)}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{report.answered}/{report.totalChecks} answered, {report.correct} mastery check(s) passed</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black ${report.status === "mastered" ? "bg-emerald-500 text-white" : report.status === "in-progress" ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}>{report.score}%</span>
          <button type="button" onClick={onExport} className="mini-chip">Export</button>
          <button type="button" onClick={onReset} className="mini-chip">Reset</button>
        </div>
      </div>

      {assessableSteps.length === 0 ? (
        <div className="mt-3 rounded-2xl bg-white/80 p-3 text-sm font-semibold text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
          Add a question or check step in the activity builder to create student practice items.
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {assessableSteps.map((step, index) => {
            const response = responses[step.id];
            const score = response?.score ?? 0;
            return (
              <div key={step.id} className="rounded-2xl bg-white/85 p-3 dark:bg-slate-950/45">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="mini-chip">Item {index + 1}: {step.kind}</span>
                    <h4 className="mt-2 text-sm font-black text-slate-950 dark:text-white">{step.title}</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{step.prompt}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${score >= 70 ? "bg-emerald-500 text-white" : response?.checkedAt ? "bg-amber-300 text-slate-950" : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>{response?.checkedAt ? `${score}%` : "open"}</span>
                </div>
                <textarea
                  value={response?.answer ?? ""}
                  onChange={(event) => onAnswer(step.id, event.target.value)}
                  className="mt-3 min-h-20 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900"
                  placeholder="Student response..."
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="min-w-0 flex-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{response?.feedback ?? "Check the response when the student is ready."}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.command && <button type="button" onClick={() => onRunStep(step)} className="mini-chip">Run command</button>}
                    <button type="button" onClick={() => onCheck(step)} className="mini-chip">Check</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ImportExportSuitePanel({ importStatus, onTemplate }: { importStatus: string; onTemplate: (template: ConstructionTemplate) => void }) {
  const templates: ConstructionTemplate[] = ["triangle", "circle-theorem", "parabola-locus"];
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-200">Import and export</p>
          <h3 className="text-base font-black text-slate-950 dark:text-white">Portable workspace files</h3>
          <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{importStatus}</p>
        </div>
        <span className="mini-chip">JSON SVG CSV worksheet bundle</span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {templates.map((template) => (
          <button key={template} type="button" onClick={() => onTemplate(template)} className="rounded-2xl bg-white/80 p-3 text-left transition hover:bg-emerald-100 dark:bg-slate-950/40 dark:hover:bg-emerald-300/15">
            <p className="font-black">{templateLabel(template)}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Load a ready construction and continue editing in Geometry.</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ReleaseReadinessPanel({ health }: { health: ReleaseHealth }) {
  const shortcuts = [
    "Ctrl+Enter run",
    "Ctrl+S save",
    "Ctrl+O load",
    "Ctrl+Shift+E bundle",
    "Ctrl+1-4 switch views",
    "Esc pause",
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/55">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Release health</p>
          <h3 className="text-base font-black text-slate-950 dark:text-white">{releaseStatusLabel(health.status)}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${health.status === "release-ready" ? "bg-emerald-500 text-white" : health.status === "good" ? "bg-cyan-500 text-white" : "bg-amber-400 text-slate-950"}`}>{health.score}%</span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {health.checks.map((check) => (
          <div key={check.id} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-black">{check.label}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${check.passed ? "bg-emerald-500 text-white" : "bg-amber-300 text-slate-950"}`}>{check.passed ? "ok" : "todo"}</span>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-slate-600 dark:text-slate-300">{check.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {shortcuts.map((shortcut) => <span key={shortcut} className="mini-chip">{shortcut}</span>)}
      </div>
    </div>
  );
}

function constructionTemplate(template: ConstructionTemplate): Construction {
  if (template === "circle-theorem") {
    const points: GeoPoint[] = [
      { id: "ct-o", x: 320, y: 210, label: "O" },
      { id: "ct-a", x: 440, y: 210, label: "A" },
      { id: "ct-b", x: 260, y: 110, label: "B" },
      { id: "ct-c", x: 230, y: 300, label: "C" },
    ];
    return {
      points,
      lines: [
        { id: "ct-ab", a: "ct-a", b: "ct-b", kind: "segment" },
        { id: "ct-ac", a: "ct-a", b: "ct-c", kind: "segment" },
        { id: "ct-bc", a: "ct-b", b: "ct-c", kind: "segment" },
      ],
      circles: [{ id: "ct-circle", center: "ct-o", edge: "ct-a" }],
      polygons: [],
      angles: [{ id: "ct-angle", a: "ct-b", vertex: "ct-a", b: "ct-c" }],
      arcs: [],
      texts: [],
      conics: [],
      transforms: [],
      constraints: [],
    };
  }
  if (template === "parabola-locus") {
    const points: GeoPoint[] = [
      { id: "pl-v", x: 320, y: 250, label: "V" },
      { id: "pl-f", x: 320, y: 170, label: "F" },
      { id: "pl-a", x: 220, y: 250, label: "A" },
      { id: "pl-b", x: 420, y: 250, label: "B" },
    ];
    return {
      points,
      lines: [
        { id: "pl-directrix", a: "pl-a", b: "pl-b", kind: "line" },
        { id: "pl-axis", a: "pl-v", b: "pl-f", kind: "ray" },
      ],
      circles: [],
      polygons: [],
      angles: [],
      arcs: [],
      texts: [],
      conics: [{ id: "pl-conic", kind: "parabola", center: "pl-v", a: 90, b: 60 }],
      transforms: [],
      constraints: [],
    };
  }
  const points: GeoPoint[] = [
    { id: "tr-a", x: 180, y: 310, label: "A" },
    { id: "tr-b", x: 460, y: 310, label: "B" },
    { id: "tr-c", x: 310, y: 100, label: "C" },
  ];
  return {
    points,
    lines: [
      { id: "tr-ab", a: "tr-a", b: "tr-b", kind: "segment" },
      { id: "tr-bc", a: "tr-b", b: "tr-c", kind: "segment" },
      { id: "tr-ca", a: "tr-c", b: "tr-a", kind: "segment" },
    ],
    circles: [],
    polygons: [{ id: "tr-poly", points: ["tr-a", "tr-b", "tr-c"] }],
    angles: [{ id: "tr-angle", a: "tr-a", vertex: "tr-c", b: "tr-b" }],
    arcs: [],
    texts: [],
    conics: [],
    transforms: [],
    constraints: [],
  };
}

function lessonToWorksheet(lesson: ClassroomLesson) {
  return [
    lesson.title,
    `Audience: ${lesson.audience}`,
    `Objective: ${lesson.objective}`,
    "",
    "Student Activity",
    ...lesson.steps.map((step, index) => [
      `${index + 1}. ${step.title} [${step.kind}]`,
      step.prompt,
      step.command ? `Command: ${step.command}` : "",
      step.expected ? `Expected: ${step.expected}` : "",
    ].filter(Boolean).join("\n")),
    "",
    "Teacher Notes",
    lesson.teacherNotes,
  ].join("\n\n");
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

function ResultCardView({ result, onVisualSync }: { result: ResultCard; onVisualSync: (link: CasVisualSyncLink) => void }) {
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
      {result.visualSync && result.visualSync.length > 0 && (
        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <p className="text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-200">Visual sync</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.visualSync.map((link) => (
              <button key={link.id} type="button" onClick={() => onVisualSync(link)} className={link.auto ? "action-primary py-2 text-xs" : "action-secondary py-2 text-xs"}>
                {link.label}
              </button>
            ))}
          </div>
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
      {construction.arcs.map((arc) => <GeometryArc key={arc.id} arc={arc} points={construction.points} />)}
      {construction.conics.map((conic) => <GeometryConic key={conic.id} conic={conic} points={construction.points} />)}
      {construction.angles.map((angle) => <GeometryAngle key={angle.id} angle={angle} points={construction.points} />)}
      {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} />)}
      {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} />)}
      {construction.texts.map((note) => <GeometryTextNote key={note.id} note={note} points={construction.points} />)}
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

function Workspace3DInspector({
  surface,
  solid,
  surfaceScale,
  solidSize,
  crossSection,
  surfaceDomain,
  surfacePosition,
  surfaceRotation,
  solidPosition,
  solidRotation,
  vectorStart,
  vectorEnd,
  point,
  shapes,
  selectedShape,
  measurements,
  showSurface,
  showSolid,
  showAxes,
  showGrid,
  showCrossSection,
  showVector,
  showPoint,
  autoRotate,
  zoom,
  selectedObject,
  onSurface,
  onSolid,
  onSurfaceScale,
  onSolidSize,
  onCrossSection,
  onSurfaceDomain,
  onSurfacePosition,
  onSurfaceRotation,
  onSolidPosition,
  onSolidRotation,
  onVectorStart,
  onVectorEnd,
  onPoint,
  onAddShape,
  onShapeChange,
  onDuplicateShape,
  onShowSurface,
  onShowSolid,
  onShowAxes,
  onShowGrid,
  onShowCrossSection,
  onShowVector,
  onShowPoint,
  onAutoRotate,
  onZoom,
  onSelect,
  onDeleteSelected,
  onRestoreAll,
}: {
  surface: SurfaceKind;
  solid: SolidKind;
  surfaceScale: number;
  solidSize: number;
  crossSection: number;
  surfaceDomain: number;
  surfacePosition: Vector3Tuple;
  surfaceRotation: Vector3Tuple;
  solidPosition: Vector3Tuple;
  solidRotation: Vector3Tuple;
  vectorStart: Vector3Tuple;
  vectorEnd: Vector3Tuple;
  point: Vector3Tuple;
  shapes: Space3DShapeObject[];
  selectedShape: Space3DShapeObject | null;
  measurements: Space3DMeasurements;
  showSurface: boolean;
  showSolid: boolean;
  showAxes: boolean;
  showGrid: boolean;
  showCrossSection: boolean;
  showVector: boolean;
  showPoint: boolean;
  autoRotate: boolean;
  zoom: number;
  selectedObject: Space3DObjectId;
  onSurface: (value: SurfaceKind) => void;
  onSolid: (value: SolidKind) => void;
  onSurfaceScale: (value: number) => void;
  onSolidSize: (value: number) => void;
  onCrossSection: (value: number) => void;
  onSurfaceDomain: (value: number) => void;
  onSurfacePosition: (value: Vector3Tuple) => void;
  onSurfaceRotation: (value: Vector3Tuple) => void;
  onSolidPosition: (value: Vector3Tuple) => void;
  onSolidRotation: (value: Vector3Tuple) => void;
  onVectorStart: (value: Vector3Tuple) => void;
  onVectorEnd: (value: Vector3Tuple) => void;
  onPoint: (value: Vector3Tuple) => void;
  onAddShape: (kind: SolidKind) => void;
  onShapeChange: (id: string, patch: Partial<Space3DShapeObject>) => void;
  onDuplicateShape: () => void;
  onShowSurface: (value: boolean) => void;
  onShowSolid: (value: boolean) => void;
  onShowAxes: (value: boolean) => void;
  onShowGrid: (value: boolean) => void;
  onShowCrossSection: (value: boolean) => void;
  onShowVector: (value: boolean) => void;
  onShowPoint: (value: boolean) => void;
  onAutoRotate: (value: boolean) => void;
  onZoom: (value: number) => void;
  onSelect: (value: Space3DObjectId) => void;
  onDeleteSelected: () => void;
  onRestoreAll: () => void;
}) {
  const objects: { id: Space3DObjectId; name: string; visible: boolean; onVisible: (value: boolean) => void; details: string }[] = [
    ...shapes.map((shape) => ({
      id: `shape:${shape.id}` as const,
      name: shape.name,
      visible: shape.visible,
      onVisible: (value: boolean) => onShapeChange(shape.id, { visible: value }),
      details: `${solidOptions.find((option) => option.value === shape.kind)?.label ?? shape.kind}; size ${roundTo(shape.size, 2)}; pos (${shape.position.map((value) => roundTo(value, 1)).join(", ")})`,
    })),
    { id: "surface", name: "Surface mesh", visible: showSurface, onVisible: onShowSurface, details: `${surfaceFormula(surface, surfaceScale)}; pos (${surfacePosition.map((value) => roundTo(value, 1)).join(", ")})` },
    { id: "solid", name: "Preview solid", visible: showSolid, onVisible: onShowSolid, details: `${solidOptions.find((option) => option.value === solid)?.label ?? solid}, size ${roundTo(solidSize, 2)}; use Add selected solid for copies` },
    { id: "cross-section", name: "Cross-section plane", visible: showCrossSection, onVisible: onShowCrossSection, details: `z = ${roundTo(crossSection, 2)}; ${measurements.crossSectionSamples} contour samples` },
    { id: "vector", name: "Vector ray", visible: showVector, onVisible: onShowVector, details: `<${measurements.vectorComponents.map((value) => roundTo(value, 2)).join(", ")}>, |v|=${roundTo(measurements.vectorLength, 2)}` },
    { id: "point", name: "Point P", visible: showPoint, onVisible: onShowPoint, details: `(${point.map((value) => roundTo(value, 2)).join(", ")}), distance ${roundTo(measurements.pointDistanceFromOrigin, 2)}` },
    { id: "axes", name: "Coordinate axes", visible: showAxes, onVisible: onShowAxes, details: "+x, +y, +z labels and origin marker" },
    { id: "grid", name: "Base grid", visible: showGrid, onVisible: onShowGrid, details: "10 x 10 reference floor" },
  ];
  const selectedMeta = objects.find((object) => object.id === selectedObject) ?? objects[0];
  const selectedShapeMetrics = selectedShape ? solidMetrics(selectedShape.kind, selectedShape.size) : null;

  return (
    <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Selectable object kernel</p>
            <h3 className="text-sm font-black">3D Scene Objects</h3>
          </div>
          <button type="button" className="mini-chip" onClick={onRestoreAll}>Restore all</button>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {objects.map((object) => (
            <div key={object.id} className={`rounded-xl border p-2 transition ${selectedObject === object.id ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/40 dark:bg-cyan-300/10" : "border-transparent bg-slate-100 dark:bg-white/10"}`}>
              <div className="flex items-start justify-between gap-2">
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSelect(object.id as Space3DObjectId)}>
                  <p className="text-xs font-black">{object.name}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600 dark:text-slate-300">{object.details}</p>
                </button>
                <input className="mt-1 h-4 w-4 accent-cyan-400" type="checkbox" checked={object.visible} onChange={(event) => object.onVisible(event.target.checked)} aria-label={`Toggle ${object.name}`} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1">
                <button type="button" className="mini-chip justify-center" onClick={() => { onSelect(object.id as Space3DObjectId); object.onVisible(true); }}>Select</button>
                <button type="button" className="mini-chip justify-center" onClick={() => { onSelect(object.id as Space3DObjectId); object.onVisible(false); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Selected object</p>
            <h3 className="truncate text-sm font-black">{selectedMeta.name}</h3>
          </div>
          <button type="button" onClick={onDeleteSelected} className="math-tool-button-danger h-8 w-8 rounded-lg" aria-label={`Delete ${selectedMeta.name}`}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{selectedMeta.details}</p>
        <div className="mt-2 grid gap-2">
          <div className="grid grid-cols-3 gap-2">
            {shapePalette3d.slice(0, 9).map((item) => {
              const Icon = item.icon;
              return (
                <button key={`palette-${item.kind}`} type="button" className="mini-chip justify-center" onClick={() => onAddShape(item.kind)}>
                  <Icon className="h-3.5 w-3.5" />{item.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {objects.map((object) => (
              <button
                key={`add-${object.id}`}
                type="button"
                className={selectedObject === object.id ? "action-primary justify-center capitalize" : "tool-button justify-center capitalize"}
                onClick={() => { onSelect(object.id as Space3DObjectId); object.onVisible(true); }}
              >
                <Plus className="h-4 w-4" />{object.id.replace("-", " ")}
              </button>
            ))}
          </div>
          {selectedShape && (
            <>
              <label className="text-xs font-bold">
                Object name
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-sm dark:border-white/10 dark:bg-slate-900"
                  value={selectedShape.name}
                  onChange={(event) => onShapeChange(selectedShape.id, { name: event.target.value })}
                />
              </label>
              <label className="text-xs font-bold">
                Shape type
                <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={selectedShape.kind} onChange={(event) => onShapeChange(selectedShape.id, { kind: event.target.value as SolidKind })}>
                  {solidOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <NumberField label="Shape size" value={selectedShape.size} min={0.4} max={5} step={0.1} onChange={(value) => onShapeChange(selectedShape.id, { size: value })} />
              <VectorField label="Shape position" value={selectedShape.position} onChange={(value) => onShapeChange(selectedShape.id, { position: value })} />
              <RotationField label="Shape rotation" value={selectedShape.rotation} onChange={(value) => onShapeChange(selectedShape.id, { rotation: value })} />
              <label className="text-xs font-bold">
                Color
                <input
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900"
                  type="color"
                  value={selectedShape.color}
                  onChange={(event) => onShapeChange(selectedShape.id, { color: event.target.value })}
                />
              </label>
              {selectedShapeMetrics && (
                <div className="grid grid-cols-2 gap-2">
                  <MetricTile label="Volume" value={roundTo(selectedShapeMetrics.volume, 2).toString()} />
                  <MetricTile label="Area" value={roundTo(selectedShapeMetrics.surfaceArea, 2).toString()} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Toggle checked={selectedShape.visible} label="Visible" onChange={(value) => onShapeChange(selectedShape.id, { visible: value })} />
                <button type="button" className="tool-button justify-center" onClick={onDuplicateShape}><ClipboardCopy className="h-4 w-4" />Duplicate</button>
              </div>
              <TransformNudges
                onCenter={() => onShapeChange(selectedShape.id, { position: [0, 0, 0] })}
                onLift={() => onShapeChange(selectedShape.id, { position: clampVector3([selectedShape.position[0], selectedShape.position[1] + 0.25, selectedShape.position[2]]) })}
                onLower={() => onShapeChange(selectedShape.id, { position: clampVector3([selectedShape.position[0], selectedShape.position[1] - 0.25, selectedShape.position[2]]) })}
                onRotateX={() => onShapeChange(selectedShape.id, { rotation: clampRotationVector([selectedShape.rotation[0] + 15, selectedShape.rotation[1], selectedShape.rotation[2]]) })}
                onRotateY={() => onShapeChange(selectedShape.id, { rotation: clampRotationVector([selectedShape.rotation[0], selectedShape.rotation[1] + 15, selectedShape.rotation[2]]) })}
                onRotateZ={() => onShapeChange(selectedShape.id, { rotation: clampRotationVector([selectedShape.rotation[0], selectedShape.rotation[1], selectedShape.rotation[2] + 15]) })}
                onScaleUp={() => onShapeChange(selectedShape.id, { size: clampNumber(roundTo(selectedShape.size + 0.2, 2), 0.4, 5) })}
                onScaleDown={() => onShapeChange(selectedShape.id, { size: clampNumber(roundTo(selectedShape.size - 0.2, 2), 0.4, 5) })}
              />
            </>
          )}
          {(selectedObject === "surface" || selectedObject === "axes" || selectedObject === "grid") && (
            <>
              <label className="text-xs font-bold">
                Surface type
                <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={surface} onChange={(event) => { onSurface(event.target.value as SurfaceKind); onShowSurface(true); onSelect("surface"); }}>
                  {surfaceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <NumberField label="Surface scale" value={surfaceScale} min={0.2} max={2.5} step={0.1} onChange={onSurfaceScale} />
              <NumberField label="Domain / clipping radius" value={surfaceDomain} min={1.2} max={3.5} step={0.1} onChange={onSurfaceDomain} />
              <VectorField label="Surface position" value={surfacePosition} onChange={onSurfacePosition} />
              <RotationField label="Surface rotation" value={surfaceRotation} onChange={onSurfaceRotation} />
              <TransformNudges
                onCenter={() => onSurfacePosition([0, 0, 0])}
                onLift={() => onSurfacePosition(clampVector3([surfacePosition[0], surfacePosition[1] + 0.25, surfacePosition[2]]))}
                onLower={() => onSurfacePosition(clampVector3([surfacePosition[0], surfacePosition[1] - 0.25, surfacePosition[2]]))}
                onRotateX={() => onSurfaceRotation(clampRotationVector([surfaceRotation[0] + 15, surfaceRotation[1], surfaceRotation[2]]))}
                onRotateY={() => onSurfaceRotation(clampRotationVector([surfaceRotation[0], surfaceRotation[1] + 15, surfaceRotation[2]]))}
                onRotateZ={() => onSurfaceRotation(clampRotationVector([surfaceRotation[0], surfaceRotation[1], surfaceRotation[2] + 15]))}
              />
            </>
          )}
          {selectedObject === "solid" && (
            <>
              <label className="text-xs font-bold">
                Solid type
                <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={solid} onChange={(event) => { onSolid(event.target.value as SolidKind); onShowSolid(true); }}>
                  {solidOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <NumberField label="Solid size" value={solidSize} min={0.8} max={5} step={0.1} onChange={onSolidSize} />
              <VectorField label="Solid position" value={solidPosition} onChange={onSolidPosition} />
              <RotationField label="Solid rotation" value={solidRotation} onChange={onSolidRotation} />
              <TransformNudges
                onCenter={() => onSolidPosition([0, 0, 0])}
                onLift={() => onSolidPosition(clampVector3([solidPosition[0], solidPosition[1] + 0.25, solidPosition[2]]))}
                onLower={() => onSolidPosition(clampVector3([solidPosition[0], solidPosition[1] - 0.25, solidPosition[2]]))}
                onRotateX={() => onSolidRotation(clampRotationVector([solidRotation[0] + 15, solidRotation[1], solidRotation[2]]))}
                onRotateY={() => onSolidRotation(clampRotationVector([solidRotation[0], solidRotation[1] + 15, solidRotation[2]]))}
                onRotateZ={() => onSolidRotation(clampRotationVector([solidRotation[0], solidRotation[1], solidRotation[2] + 15]))}
                onScaleUp={() => onSolidSize(clampNumber(roundTo(solidSize + 0.2, 2), 0.8, 5))}
                onScaleDown={() => onSolidSize(clampNumber(roundTo(solidSize - 0.2, 2), 0.8, 5))}
              />
            </>
          )}
          {selectedObject === "cross-section" && <NumberField label="Cross-section z" value={crossSection} min={-3} max={3} step={0.1} onChange={onCrossSection} />}
          {selectedObject === "vector" && (
            <div className="grid gap-2">
              <VectorField label="Vector start" value={vectorStart} onChange={onVectorStart} />
              <VectorField label="Vector end" value={vectorEnd} onChange={onVectorEnd} />
            </div>
          )}
          {selectedObject === "point" && <VectorField label="Point P" value={point} onChange={onPoint} />}
          <NumberField label="Camera zoom" value={zoom} min={0.6} max={1.8} step={0.1} onChange={onZoom} />
          <Toggle checked={autoRotate} label="Auto rotate" onChange={onAutoRotate} />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5 lg:col-span-2">
        <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">3D measurements</p>
        <div className="mt-2 grid gap-2 md:grid-cols-4">
          <MetricTile label="Surface z range" value={`${roundTo(measurements.surfaceSampleMin, 2)} to ${roundTo(measurements.surfaceSampleMax, 2)}`} />
          <MetricTile label="Slice contour" value={`${measurements.crossSectionSamples} samples`} />
          <MetricTile label="Solid volume" value={roundTo(measurements.solidVolume, 2).toString()} />
          <MetricTile label="Solid area" value={roundTo(measurements.solidSurfaceArea, 2).toString()} />
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <VectorField label="Vector start" value={vectorStart} onChange={onVectorStart} />
          <VectorField label="Vector end" value={vectorEnd} onChange={onVectorEnd} />
          <VectorField label="Point P" value={point} onChange={onPoint} />
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function VectorField({ label, value, onChange }: { label: string; value: Vector3Tuple; onChange: (value: Vector3Tuple) => void }) {
  const update = (index: number, nextValue: number) => {
    const next: Vector3Tuple = [...value] as Vector3Tuple;
    next[index] = Math.max(-5, Math.min(5, nextValue));
    onChange(next);
  };
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-black">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(["x", "y", "z"] as const).map((axis, index) => (
          <label key={axis} className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
            {axis}
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-white/10 dark:bg-slate-900"
              type="number"
              value={Number(value[index].toFixed(3))}
              min={-5}
              max={5}
              step={0.1}
              onChange={(event) => update(index, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function RotationField({ label, value, onChange }: { label: string; value: Vector3Tuple; onChange: (value: Vector3Tuple) => void }) {
  const update = (index: number, nextValue: number) => {
    const next: Vector3Tuple = [...value] as Vector3Tuple;
    next[index] = clampNumber(nextValue, -180, 180);
    onChange(next);
  };
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-black">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(["x", "y", "z"] as const).map((axis, index) => (
          <label key={axis} className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
            {axis} deg
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-white/10 dark:bg-slate-900"
              type="number"
              value={Number(value[index].toFixed(1))}
              min={-180}
              max={180}
              step={5}
              onChange={(event) => update(index, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function TransformNudges({
  onCenter,
  onLift,
  onLower,
  onRotateX,
  onRotateY,
  onRotateZ,
  onScaleUp,
  onScaleDown,
}: {
  onCenter: () => void;
  onLift: () => void;
  onLower: () => void;
  onRotateX: () => void;
  onRotateY: () => void;
  onRotateZ: () => void;
  onScaleUp?: () => void;
  onScaleDown?: () => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button type="button" className="mini-chip justify-center" onClick={onCenter}><Crosshair className="h-3.5 w-3.5" />Center</button>
      <button type="button" className="mini-chip justify-center" onClick={onLift}><Move3D className="h-3.5 w-3.5" />Lift</button>
      <button type="button" className="mini-chip justify-center" onClick={onLower}><Move3D className="h-3.5 w-3.5" />Lower</button>
      <button type="button" className="mini-chip justify-center" onClick={onRotateX}><Rotate3D className="h-3.5 w-3.5" />Rot X</button>
      <button type="button" className="mini-chip justify-center" onClick={onRotateY}><Rotate3D className="h-3.5 w-3.5" />Rot Y</button>
      <button type="button" className="mini-chip justify-center" onClick={onRotateZ}><Rotate3D className="h-3.5 w-3.5" />Rot Z</button>
      {onScaleUp && <button type="button" className="mini-chip justify-center" onClick={onScaleUp}><ZoomIn className="h-3.5 w-3.5" />Bigger</button>}
      {onScaleDown && <button type="button" className="mini-chip justify-center" onClick={onScaleDown}><ZoomOut className="h-3.5 w-3.5" />Smaller</button>}
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

function Workspace3DScene({
  surface,
  solid,
  surfaceScale,
  solidSize,
  crossSection,
  surfaceDomain,
  surfacePosition,
  surfaceRotation,
  solidPosition,
  solidRotation,
  vectorStart,
  vectorEnd,
  point,
  shapes,
  showSurface,
  showSolid,
  showAxes,
  showGrid,
  showCrossSection,
  showVector,
  showPoint,
  autoRotate,
  zoom,
  selectedObject,
  onSelect,
  onVectorStart,
  onVectorEnd,
  onPoint,
  onSurfacePosition,
  onSolidPosition,
  onShapeChange,
  onSurfaceScale,
  onSurfaceDomain,
  onSolidSize,
  onCrossSection,
  onDragActive,
}: {
  surface: SurfaceKind;
  solid: SolidKind;
  surfaceScale: number;
  solidSize: number;
  crossSection: number;
  surfaceDomain: number;
  surfacePosition: Vector3Tuple;
  surfaceRotation: Vector3Tuple;
  solidPosition: Vector3Tuple;
  solidRotation: Vector3Tuple;
  vectorStart: Vector3Tuple;
  vectorEnd: Vector3Tuple;
  point: Vector3Tuple;
  shapes: Space3DShapeObject[];
  showSurface: boolean;
  showSolid: boolean;
  showAxes: boolean;
  showGrid: boolean;
  showCrossSection: boolean;
  showVector: boolean;
  showPoint: boolean;
  autoRotate: boolean;
  zoom: number;
  selectedObject: Space3DObjectId;
  onSelect: (value: Space3DObjectId) => void;
  onVectorStart: (value: Vector3Tuple) => void;
  onVectorEnd: (value: Vector3Tuple) => void;
  onPoint: (value: Vector3Tuple) => void;
  onSurfacePosition: (value: Vector3Tuple) => void;
  onSolidPosition: (value: Vector3Tuple) => void;
  onShapeChange: (id: string, patch: Partial<Space3DShapeObject>) => void;
  onSurfaceScale: (value: number) => void;
  onSurfaceDomain: (value: number) => void;
  onSolidSize: (value: number) => void;
  onCrossSection: (value: number) => void;
  onDragActive: (value: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={groupRef} scale={zoom}>
      {showAxes && (
        <group onClick={(event) => { event.stopPropagation(); onSelect("axes"); }}>
          <Axes3D selected={selectedObject === "axes"} />
        </group>
      )}
      {showGrid && (
        <group onClick={(event) => { event.stopPropagation(); onSelect("grid"); }}>
          <gridHelper args={[10, 10, selectedObject === "grid" ? "#22d3ee" : "#334155", "#1e293b"]} rotation={[0, 0, 0]} />
          {selectedObject === "grid" && <SelectionHalo position={[0, 0.02, 0]} radius={3.4} />}
        </group>
      )}
      {showSurface && <SurfaceMesh surface={surface} scaleValue={surfaceScale} domainRadius={surfaceDomain} position={surfacePosition} rotation={surfaceRotation} selected={selectedObject === "surface"} onSelect={() => onSelect("surface")} />}
      {showSolid && <SolidMesh solid={solid} size={solidSize} position={solidPosition} rotation={solidRotation} autoRotate={autoRotate} selected={selectedObject === "solid"} onSelect={() => onSelect("solid")} />}
      {shapes.filter((shape) => shape.visible).map((shape) => {
        const selected = selectedObject === `shape:${shape.id}`;
        return (
          <group key={shape.id}>
            <SolidMesh solid={shape.kind} size={shape.size} position={shape.position} rotation={shape.rotation} autoRotate={false} selected={selected} color={shape.color} label={shape.name} onSelect={() => onSelect(`shape:${shape.id}`)} />
            {selected && (
              <>
                <Draggable3DHandle
                  position={shape.position}
                  label="Move"
                  color={shape.color}
                  onSelect={() => onSelect(`shape:${shape.id}`)}
                  onDrag={(delta) => onShapeChange(shape.id, { position: clampVector3([shape.position[0] + delta.x, shape.position[1] + delta.y, shape.position[2] + delta.z]) })}
                  onDragActive={onDragActive}
                />
                <Vertical3DHandle
                  position={[shape.position[0] + 0.48, shape.position[1] + shape.size + 0.25, shape.position[2] - 0.48]}
                  label="Size"
                  color="#fb7185"
                  onSelect={() => onSelect(`shape:${shape.id}`)}
                  onDrag={(deltaY) => onShapeChange(shape.id, { size: clampNumber(shape.size + deltaY, 0.4, 5) })}
                  onDragActive={onDragActive}
                />
              </>
            )}
          </group>
        );
      })}
      {showCrossSection && <CrossSectionPlane z={crossSection} surface={surface} scaleValue={surfaceScale} domainRadius={surfaceDomain} selected={selectedObject === "cross-section"} onSelect={() => onSelect("cross-section")} />}
      {showVector && <VectorArrow start={vectorStart} end={vectorEnd} color={selectedObject === "vector" ? "#22d3ee" : "#f59e0b"} selected={selectedObject === "vector"} onSelect={() => onSelect("vector")} />}
      {showPoint && <Point3D position={point} label="P" selected={selectedObject === "point"} onSelect={() => onSelect("point")} />}
      {showPoint && (
        <Draggable3DHandle
          position={point}
          label="Drag P"
          color="#22d3ee"
          onSelect={() => onSelect("point")}
          onDrag={(delta) => onPoint(clampVector3([point[0] + delta.x, point[1] + delta.y, point[2] + delta.z]))}
          onDragActive={onDragActive}
        />
      )}
      {showVector && (
        <>
          <Draggable3DHandle
            position={vectorStart}
            label="Tail"
            color="#a78bfa"
            onSelect={() => onSelect("vector")}
            onDrag={(delta) => onVectorStart(clampVector3([vectorStart[0] + delta.x, vectorStart[1] + delta.y, vectorStart[2] + delta.z]))}
            onDragActive={onDragActive}
          />
          <Draggable3DHandle
            position={vectorEnd}
            label="Head"
            color="#f59e0b"
            onSelect={() => onSelect("vector")}
            onDrag={(delta) => onVectorEnd(clampVector3([vectorEnd[0] + delta.x, vectorEnd[1] + delta.y, vectorEnd[2] + delta.z]))}
            onDragActive={onDragActive}
          />
        </>
      )}
      {showCrossSection && (
        <Vertical3DHandle
          position={[surfaceDomain + 0.45, crossSection, surfaceDomain + 0.45]}
          label="Slice"
          color="#facc15"
          onSelect={() => onSelect("cross-section")}
          onDrag={(deltaY) => onCrossSection(clampNumber(crossSection + deltaY, -3, 3))}
          onDragActive={onDragActive}
        />
      )}
      {showSolid && (
        <>
          <Draggable3DHandle
            position={solidPosition}
            label="Move solid"
            color="#c4b5fd"
            onSelect={() => onSelect("solid")}
            onDrag={(delta) => onSolidPosition(clampVector3([solidPosition[0] + delta.x, solidPosition[1] + delta.y, solidPosition[2] + delta.z]))}
            onDragActive={onDragActive}
          />
          <Vertical3DHandle
            position={[solidPosition[0] + 0.48, solidPosition[1] + solidSize + 0.25, solidPosition[2] - 0.48]}
            label="Size"
            color="#fb7185"
            onSelect={() => onSelect("solid")}
            onDrag={(deltaY) => onSolidSize(clampNumber(solidSize + deltaY, 0.8, 5))}
            onDragActive={onDragActive}
          />
        </>
      )}
      {showSurface && (
        <>
          <Draggable3DHandle
            position={surfacePosition}
            label="Move surface"
            color="#38bdf8"
            onSelect={() => onSelect("surface")}
            onDrag={(delta) => onSurfacePosition(clampVector3([surfacePosition[0] + delta.x, surfacePosition[1] + delta.y, surfacePosition[2] + delta.z]))}
            onDragActive={onDragActive}
          />
          <Vertical3DHandle
            position={[surfacePosition[0] - surfaceDomain - 0.45, surfacePosition[1] + surfaceScale * 1.25 + 0.3, surfacePosition[2] - surfaceDomain - 0.45]}
            label="Scale"
            color="#38bdf8"
            onSelect={() => onSelect("surface")}
            onDrag={(deltaY) => onSurfaceScale(clampNumber(surfaceScale + deltaY * 0.55, 0.2, 2.5))}
            onDragActive={onDragActive}
          />
          <Draggable3DHandle
            position={[surfacePosition[0] + surfaceDomain, surfacePosition[1] + 0.18, surfacePosition[2] - surfaceDomain]}
            label="Clip"
            color="#2dd4bf"
            onSelect={() => onSelect("surface")}
            onDrag={(delta) => onSurfaceDomain(clampNumber(surfaceDomain + (delta.x - delta.z) * 0.3, 1.2, 3.5))}
            onDragActive={onDragActive}
          />
        </>
      )}
    </group>
  );
}

function Axes3D({ selected = false }: { selected?: boolean }) {
  return (
    <group>
      <VectorArrow start={[-5, 0, 0]} end={[5, 0, 0]} color={selected ? "#facc15" : "#ef4444"} />
      <VectorArrow start={[0, -0.01, -5]} end={[0, -0.01, 5]} color={selected ? "#facc15" : "#22c55e"} />
      <VectorArrow start={[0, -3, 0]} end={[0, 3, 0]} color={selected ? "#facc15" : "#38bdf8"} />
      <SceneLabel position={[5.35, 0.15, 0]} text="+x" color="#fecaca" />
      <SceneLabel position={[0.25, 0.1, 5.35]} text="+y" color="#bbf7d0" />
      <SceneLabel position={[0.25, 3.25, 0]} text="+z height" color="#bae6fd" />
      <SceneLabel position={[0.1, 0.25, 0.35]} text="origin" color="#e2e8f0" size={0.18} />
      {selected && <SelectionHalo position={[0, 0, 0]} radius={2.2} />}
    </group>
  );
}

type DragDelta3D = { x: number; y: number; z: number };

function Draggable3DHandle({
  position,
  label,
  color,
  onSelect,
  onDrag,
  onDragActive,
}: {
  position: Vector3Tuple;
  label: string;
  color: string;
  onSelect: () => void;
  onDrag: (delta: DragDelta3D) => void;
  onDragActive: (value: boolean) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const stop = () => {
    setDragging(false);
    onDragActive(false);
  };
  return (
    <group
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
        setDragging(true);
        onDragActive(true);
        (event.nativeEvent.target as Element | null)?.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging) return;
        event.stopPropagation();
        const nativeEvent = event.nativeEvent as globalThis.PointerEvent;
        onDrag({
          x: nativeEvent.movementX * 0.025,
          y: nativeEvent.shiftKey ? -nativeEvent.movementY * 0.025 : 0,
          z: nativeEvent.shiftKey ? 0 : nativeEvent.movementY * 0.025,
        });
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        (event.nativeEvent.target as Element | null)?.releasePointerCapture?.(event.pointerId);
        stop();
      }}
      onPointerLeave={() => {
        if (dragging) stop();
      }}
    >
      <mesh>
        <sphereGeometry args={[dragging ? 0.24 : 0.18, 24, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={dragging ? 0.75 : 0.35} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.28, 0.012, 10, 36]} />
        <meshStandardMaterial color="#f8fafc" emissive="#0e7490" emissiveIntensity={0.35} />
      </mesh>
      <SceneLabel position={[0, 0.42, 0]} text={label} color="#f8fafc" size={0.16} />
    </group>
  );
}

function Vertical3DHandle({
  position,
  label,
  color,
  onSelect,
  onDrag,
  onDragActive,
}: {
  position: Vector3Tuple;
  label: string;
  color: string;
  onSelect: () => void;
  onDrag: (deltaY: number) => void;
  onDragActive: (value: boolean) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const stop = () => {
    setDragging(false);
    onDragActive(false);
  };
  return (
    <group
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
        setDragging(true);
        onDragActive(true);
        (event.nativeEvent.target as Element | null)?.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging) return;
        event.stopPropagation();
        const nativeEvent = event.nativeEvent as globalThis.PointerEvent;
        onDrag(-nativeEvent.movementY * 0.025);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        (event.nativeEvent.target as Element | null)?.releasePointerCapture?.(event.pointerId);
        stop();
      }}
      onPointerLeave={() => {
        if (dragging) stop();
      }}
    >
      <mesh>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <coneGeometry args={[dragging ? 0.18 : 0.13, 0.28, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={dragging ? 0.75 : 0.35} />
      </mesh>
      <mesh position={[0, -0.62, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[dragging ? 0.18 : 0.13, 0.28, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={dragging ? 0.75 : 0.35} />
      </mesh>
      <SceneLabel position={[0.42, 0.08, 0]} text={label} color="#f8fafc" size={0.16} />
    </group>
  );
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampVector3(value: Vector3Tuple): Vector3Tuple {
  return value.map((item) => clampNumber(roundTo(item, 3), -5, 5)) as Vector3Tuple;
}

function clampRotationVector(value: Vector3Tuple): Vector3Tuple {
  return value.map((item) => clampNumber(roundTo(item, 1), -180, 180)) as Vector3Tuple;
}

function degreesToRadians(value: Vector3Tuple): [number, number, number] {
  return value.map((item) => (item * Math.PI) / 180) as [number, number, number];
}

function SceneLabel({ position, text, color, size = 0.22 }: { position: [number, number, number]; text: string; color: string; size?: number }) {
  return (
    <Text position={position} fontSize={size} color={color} anchorX="center" anchorY="middle" outlineColor="#020617" outlineWidth={0.012}>
      {text}
    </Text>
  );
}

function VectorArrow({ start, end, color, selected = false, onSelect }: { start: [number, number, number]; end: [number, number, number]; color: string; selected?: boolean; onSelect?: () => void }) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const midpoint = startVector.clone().add(direction.clone().multiplyScalar(0.5));
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  return (
    <group position={midpoint} quaternion={quaternion} onClick={onSelect ? (event) => { event.stopPropagation(); onSelect(); } : undefined}>
      <mesh>
        <cylinderGeometry args={[selected ? 0.045 : 0.025, selected ? 0.045 : 0.025, length, 12]} />
        <meshStandardMaterial color={color} emissive={selected ? "#0e7490" : "#000000"} emissiveIntensity={selected ? 0.45 : 0} />
      </mesh>
      <mesh position={[0, length / 2, 0]}>
        <coneGeometry args={[selected ? 0.14 : 0.09, selected ? 0.32 : 0.25, 16]} />
        <meshStandardMaterial color={color} emissive={selected ? "#0e7490" : "#000000"} emissiveIntensity={selected ? 0.45 : 0} />
      </mesh>
    </group>
  );
}

function Point3D({ position, label, selected = false, onSelect }: { position: [number, number, number]; label: string; selected?: boolean; onSelect?: () => void }) {
  return (
    <group position={position} onClick={onSelect ? (event) => { event.stopPropagation(); onSelect(); } : undefined}>
      <mesh>
        <sphereGeometry args={[selected ? 0.18 : 0.12, 24, 16]} />
        <meshStandardMaterial color={selected ? "#22d3ee" : "#f59e0b"} emissive={selected ? "#0891b2" : "#7c2d12"} emissiveIntensity={selected ? 0.55 : 0.2} />
      </mesh>
      <mesh position={[0.18, 0.18, 0]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshStandardMaterial color={label ? "#f8fafc" : "#f59e0b"} />
      </mesh>
      <SceneLabel position={[0.42, 0.36, 0]} text={`${label}(x,y,z)`} color="#fde68a" size={0.18} />
      {selected && <SelectionHalo position={[0, 0, 0]} radius={0.45} vertical />}
    </group>
  );
}

function SurfaceMesh({ surface, scaleValue, domainRadius, position, rotation, selected, onSelect }: { surface: SurfaceKind; scaleValue: number; domainRadius: number; position: Vector3Tuple; rotation: Vector3Tuple; selected: boolean; onSelect: () => void }) {
  const geometry = useMemo(() => createSurfaceGeometry(surface, scaleValue, domainRadius), [domainRadius, surface, scaleValue]);
  return (
    <group position={position} rotation={degreesToRadians(rotation)}>
      <mesh geometry={geometry} position={[0, 0, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <meshStandardMaterial color={selected ? "#67e8f9" : "#22d3ee"} transparent opacity={selected ? 0.68 : 0.45} side={THREE.DoubleSide} roughness={0.35} metalness={0.08} emissive={selected ? "#0891b2" : "#000000"} emissiveIntensity={selected ? 0.18 : 0} />
      </mesh>
      {selected && <SelectionHalo position={[0, 0.15, 0]} radius={domainRadius} />}
      <SceneLabel position={[-3.9, 2.8, -3.7]} text={surfaceFormula(surface, scaleValue)} color="#a5f3fc" size={0.18} />
      <SceneLabel position={[2.4, 1.15, -2.9]} text="slope / height changes" color="#fef3c7" size={0.17} />
    </group>
  );
}

function createSurfaceGeometry(surface: SurfaceKind, scaleValue: number, domainRadius = 2.6) {
  if (surface === "torus" || surface === "helicoid" || surface === "mobius") return createParametricSurfaceGeometry(surface, scaleValue, domainRadius);
  const segments = 36;
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let iy = 0; iy <= segments; iy += 1) {
    const y = -domainRadius + (iy / segments) * domainRadius * 2;
    for (let ix = 0; ix <= segments; ix += 1) {
      const x = -domainRadius + (ix / segments) * domainRadius * 2;
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
      const ax = vertices[a * 3], ay = vertices[a * 3 + 2];
      const bx = vertices[b * 3], by = vertices[b * 3 + 2];
      const cx = vertices[c * 3], cy = vertices[c * 3 + 2];
      const dx = vertices[d * 3], dy = vertices[d * 3 + 2];
      if ([Math.hypot(ax, ay), Math.hypot(bx, by), Math.hypot(cx, cy), Math.hypot(dx, dy)].some((distance) => distance > domainRadius)) continue;
      indices.push(a, c, b, b, c, d);
    }
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createParametricSurfaceGeometry(surface: SurfaceKind, scaleValue: number, domainRadius: number) {
  const uSegments = 56;
  const vSegments = 18;
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let iv = 0; iv <= vSegments; iv += 1) {
    for (let iu = 0; iu <= uSegments; iu += 1) {
      const u = (iu / uSegments) * Math.PI * 2;
      const v = iv / vSegments;
      const [x, z, y] = parametricPoint(surface, u, v, scaleValue, domainRadius);
      vertices.push(x, z, y);
    }
  }
  for (let iv = 0; iv < vSegments; iv += 1) {
    for (let iu = 0; iu < uSegments; iu += 1) {
      const a = iv * (uSegments + 1) + iu;
      const b = a + 1;
      const c = a + uSegments + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function parametricPoint(surface: SurfaceKind, u: number, v01: number, scaleValue: number, domainRadius: number): Vector3Tuple {
  if (surface === "torus") {
    const major = 1.25 * scaleValue;
    const minor = 0.36 * domainRadius;
    const v = v01 * Math.PI * 2;
    return [(major + minor * Math.cos(v)) * Math.cos(u), minor * Math.sin(v), (major + minor * Math.cos(v)) * Math.sin(u)];
  }
  if (surface === "mobius") {
    const width = (v01 - 0.5) * domainRadius * 0.9;
    const radius = 1.5 * scaleValue;
    return [(radius + width * Math.cos(u / 2)) * Math.cos(u), width * Math.sin(u / 2), (radius + width * Math.cos(u / 2)) * Math.sin(u)];
  }
  const v = (v01 - 0.5) * domainRadius * 2;
  return [v * Math.cos(u), scaleValue * (u - Math.PI) * 0.42, v * Math.sin(u)];
}

function surfaceZ(surface: SurfaceKind, x: number, y: number, scaleValue: number) {
  if (surface === "paraboloid") return scaleValue * 0.25 * (x * x + y * y);
  if (surface === "saddle") return scaleValue * 0.3 * (x * x - y * y);
  if (surface === "wave") return scaleValue * Math.sin(x * 1.4) * Math.cos(y * 1.4);
  if (surface === "ripple") return scaleValue * Math.sin((x * x + y * y) * 1.2);
  if (surface === "cone-surface") return scaleValue * 0.55 * Math.hypot(x, y);
  return scaleValue * 0.35 * (x + y);
}

function SelectionHalo({ position, radius, vertical = false }: { position: Vector3Tuple; radius: number; vertical?: boolean }) {
  return (
    <mesh position={position} rotation={vertical ? [0, Math.PI / 2, 0] : [-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, Math.max(0.012, radius * 0.018), 12, 72]} />
      <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.6} transparent opacity={0.85} />
    </mesh>
  );
}

function SolidMesh({ solid, size, position, rotation, autoRotate, selected, onSelect, color, label }: { solid: SolidKind; size: number; position: Vector3Tuple; rotation: Vector3Tuple; autoRotate: boolean; selected: boolean; onSelect: () => void; color?: string; label?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current && autoRotate) ref.current.rotation.y += delta * 0.18;
  });
  const displayLabel = label ?? solidOptions.find((option) => option.value === solid)?.label ?? solid;
  const meshColor = color ?? "#8b5cf6";
  return (
    <group position={position} rotation={degreesToRadians(rotation)}>
      <mesh ref={ref} position={[0, size / 2, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        {solid === "cube" && <boxGeometry args={[size, size, size]} />}
        {solid === "box" && <boxGeometry args={[size * 1.35, size * 0.72, size]} />}
        {solid === "sphere" && <sphereGeometry args={[size / 2, 48, 28]} />}
        {solid === "hemisphere" && <sphereGeometry args={[size / 2, 48, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />}
        {solid === "cylinder" && <cylinderGeometry args={[size / 2, size / 2, size, 48]} />}
        {solid === "cone" && <coneGeometry args={[size / 2, size, 48]} />}
        {solid === "pyramid" && <coneGeometry args={[size / 1.35, size, 4]} />}
        {solid === "triangular-prism" && <cylinderGeometry args={[size / 1.4, size / 1.4, size, 3]} />}
        {solid === "tetrahedron" && <tetrahedronGeometry args={[size * 0.72, 0]} />}
        {solid === "octahedron" && <octahedronGeometry args={[size * 0.62, 0]} />}
        {solid === "dodecahedron" && <dodecahedronGeometry args={[size * 0.58, 0]} />}
        {solid === "icosahedron" && <icosahedronGeometry args={[size * 0.58, 0]} />}
        {solid === "torus-solid" && <torusGeometry args={[size * 0.36, size * 0.12, 24, 72]} />}
        <meshStandardMaterial color={selected ? "#c4b5fd" : meshColor} transparent opacity={selected ? 0.9 : 0.78} roughness={0.28} metalness={0.14} emissive={selected ? meshColor : "#000000"} emissiveIntensity={selected ? 0.25 : 0} />
      </mesh>
      {selected && <SelectionHalo position={[0, 0.06, 0]} radius={Math.max(0.72, size * 0.72)} />}
      <SceneLabel position={[0, size + 0.55, 0]} text={`${displayLabel}: size=${roundTo(size, 1)}`} color="#ddd6fe" size={0.18} />
    </group>
  );
}

function CrossSectionPlane({ z, surface, scaleValue, domainRadius, selected, onSelect }: { z: number; surface: SurfaceKind; scaleValue: number; domainRadius: number; selected: boolean; onSelect: () => void }) {
  const contour = useMemo(() => createCrossSectionContour(surface, scaleValue, z, domainRadius), [domainRadius, scaleValue, surface, z]);
  return (
    <group>
      <mesh position={[0, z, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <planeGeometry args={[5.5, 5.5]} />
        <meshStandardMaterial color={selected ? "#22d3ee" : "#f59e0b"} transparent opacity={selected ? 0.36 : 0.22} side={THREE.DoubleSide} emissive={selected ? "#0891b2" : "#000000"} emissiveIntensity={selected ? 0.2 : 0} />
      </mesh>
      {contour.map((point, index) => (
        <mesh key={`${point[0]}-${point[2]}-${index}`} position={point}>
          <sphereGeometry args={[0.025, 8, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#78350f" emissiveIntensity={0.25} />
        </mesh>
      ))}
      {selected && <SelectionHalo position={[0, z + 0.04, 0]} radius={domainRadius} />}
      <SceneLabel position={[-2.9, z + 0.12, 2.9]} text={`cross-section: z=${roundTo(z, 2)}`} color="#fed7aa" size={0.17} />
    </group>
  );
}

function createCrossSectionContour(surface: SurfaceKind, scaleValue: number, z: number, domainRadius: number): Vector3Tuple[] {
  if (surface === "torus" || surface === "mobius" || surface === "helicoid") return [];
  const points: Vector3Tuple[] = [];
  const steps = 46;
  const tolerance = 0.055 + domainRadius * 0.012;
  for (let iy = 0; iy <= steps; iy += 1) {
    const y = -domainRadius + (iy / steps) * domainRadius * 2;
    for (let ix = 0; ix <= steps; ix += 1) {
      const x = -domainRadius + (ix / steps) * domainRadius * 2;
      if (Math.hypot(x, y) > domainRadius) continue;
      if (Math.abs(surfaceZ(surface, x, y, scaleValue) - z) <= tolerance) points.push([x, z + 0.018, y]);
    }
  }
  return points.slice(0, 260);
}

function surfaceFormula(surface: SurfaceKind, scaleValue: number) {
  if (surface === "paraboloid") return `z = ${roundTo(scaleValue, 2)}(x^2 + y^2)/4`;
  if (surface === "saddle") return `z = ${roundTo(scaleValue, 2)}(x^2 - y^2)/3`;
  if (surface === "wave") return `z = ${roundTo(scaleValue, 2)} sin(1.4x) cos(1.4y)`;
  if (surface === "ripple") return `z = ${roundTo(scaleValue, 2)} sin(1.2(x^2+y^2))`;
  if (surface === "cone-surface") return `z = ${roundTo(scaleValue, 2)} sqrt(x^2+y^2)`;
  if (surface === "torus") return `parametric torus, R=${roundTo(1.25 * scaleValue, 2)}`;
  if (surface === "helicoid") return `parametric helicoid, twist=${roundTo(scaleValue, 2)}`;
  if (surface === "mobius") return `parametric Mobius strip, R=${roundTo(1.5 * scaleValue, 2)}`;
  return `z = ${roundTo(scaleValue, 2)}(x+y)/3`;
}

type GeometryToolItem = { id: GeometryTool; label: string; icon: LucideIcon };
type GeometryActionItem = { id: string; label: string; icon: LucideIcon; action: () => void; active?: boolean };
type GeometryToolGroup = { title: string; tools: GeometryToolItem[] };

const geometryToolGroups: GeometryToolGroup[] = [
  {
    title: "Basic Tools",
    tools: [
      { id: "select", label: "Move", icon: MousePointer2 },
      { id: "point", label: "Point", icon: Plus },
      { id: "segment", label: "Segment", icon: Move },
      { id: "line", label: "Line", icon: Slash },
      { id: "ray", label: "Ray", icon: GitBranch },
      { id: "vector", label: "Vector", icon: Target },
      { id: "circle", label: "Circle", icon: Circle },
      { id: "polygon", label: "Polygon", icon: Pentagon },
      { id: "angle", label: "Angle", icon: Radius },
    ],
  },
  {
    title: "Construct",
    tools: [
      { id: "parallel", label: "Parallel", icon: UnfoldHorizontal },
      { id: "perpendicular", label: "Perpendicular", icon: Crosshair },
      { id: "perpendicular-bisector", label: "Perp. Bisector", icon: BetweenHorizontalStart },
      { id: "angle-bisector", label: "Angle Bisector", icon: Scissors },
      { id: "midpoint", label: "Midpoint", icon: Magnet },
      { id: "intersect", label: "Intersect", icon: CircleDot },
      { id: "tangent", label: "Tangent", icon: Circle },
      { id: "on-circle", label: "Point on Object", icon: MousePointerClick },
      { id: "fixed-length", label: "Fixed Length", icon: Ruler },
      { id: "regular-polygon", label: "Regular Polygon", icon: Sigma },
      { id: "compass", label: "Compass", icon: PencilRuler },
      { id: "circle-radius", label: "Circle Radius", icon: CircleDot },
      { id: "circle-3point", label: "Circle 3 Points", icon: ScanLine },
      { id: "semicircle", label: "Semicircle", icon: CircleDot },
      { id: "arc", label: "Arc", icon: Spline },
      { id: "sector", label: "Sector", icon: Blend },
      { id: "intersect-region", label: "Region Intersect", icon: Layers },
    ],
  },
  {
    title: "Measure",
    tools: [
      { id: "distance", label: "Distance", icon: Ruler },
      { id: "area", label: "Area", icon: Calculator },
      { id: "slope", label: "Slope", icon: LineChart },
      { id: "locus", label: "Locus", icon: Spline },
      { id: "trace", label: "Trace", icon: Highlighter },
      { id: "label", label: "Label", icon: TextCursorInput },
      { id: "slider", label: "Slider", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Transform",
    tools: [
      { id: "mirror-line", label: "Reflect Line", icon: FlipHorizontal2 },
      { id: "reflect-point", label: "Reflect Point", icon: Target },
      { id: "translate", label: "Translate", icon: Move3D },
      { id: "rotate-tool", label: "Rotate", icon: Rotate3D },
      { id: "dilate-tool", label: "Dilate", icon: ZoomIn },
      { id: "duplicate", label: "Duplicate", icon: ClipboardCopy },
    ],
  },
  {
    title: "Edit",
    tools: [
      { id: "hide-show", label: "Show / Hide", icon: EyeOff },
      { id: "lock-object", label: "Lock", icon: LockKeyhole },
      { id: "freehand", label: "Freehand", icon: Brush },
      { id: "text", label: "Text", icon: PenLine },
      { id: "image", label: "Image", icon: Presentation },
      { id: "move-canvas", label: "Move Canvas", icon: Axis3d },
      { id: "zoom-tool", label: "Zoom", icon: ZoomIn },
    ],
  },
];

function GeometryToolPalette({
  activeTool,
  onTool,
  onDelete,
  onUndo,
  onRedo,
  onReset,
  onSave,
  onLoad,
  onTemplate,
  onTransform,
  onTrace,
  onStopTrace,
  onClearTrace,
  tracing,
}: {
  activeTool: GeometryTool;
  onTool: (tool: GeometryTool) => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  onTemplate: (kind: GeometryTemplateKind) => void;
  onTransform: (type: GeoTransformKind) => void;
  onTrace: () => void;
  onStopTrace: () => void;
  onClearTrace: () => void;
  tracing: boolean;
}) {
  const templateActions: GeometryActionItem[] = [
    { id: "template-triangle", label: "Triangle", icon: Triangle, action: () => onTemplate("triangle") },
    { id: "template-right-triangle", label: "Right Tri.", icon: Triangle, action: () => onTemplate("right-triangle") },
    { id: "template-isosceles-triangle", label: "Isosceles", icon: Triangle, action: () => onTemplate("isosceles-triangle") },
    { id: "template-equilateral-triangle", label: "Equilateral", icon: Triangle, action: () => onTemplate("equilateral-triangle") },
    { id: "template-rectangle", label: "Rectangle", icon: Square, action: () => onTemplate("rectangle") },
    { id: "template-square", label: "Square", icon: Square, action: () => onTemplate("square") },
    { id: "template-parallelogram", label: "Parallelogram", icon: Slash, action: () => onTemplate("parallelogram") },
    { id: "template-trapezoid", label: "Trapezoid", icon: Pentagon, action: () => onTemplate("trapezoid") },
    { id: "template-rhombus", label: "Rhombus", icon: Target, action: () => onTemplate("rhombus") },
    { id: "template-kite", label: "Kite", icon: Move, action: () => onTemplate("kite") },
    { id: "template-pentagon", label: "Pentagon", icon: Pentagon, action: () => onTemplate("pentagon") },
    { id: "template-hexagon", label: "Hexagon", icon: Sigma, action: () => onTemplate("hexagon") },
    { id: "template-octagon", label: "Octagon", icon: CircleDot, action: () => onTemplate("octagon") },
    { id: "template-star", label: "Star", icon: Wand2, action: () => onTemplate("star") },
    { id: "template-circle", label: "Circle", icon: Circle, action: () => onTemplate("circle") },
    { id: "template-two-circles", label: "2 Circles", icon: Blend, action: () => onTemplate("two-circles") },
    { id: "template-annulus", label: "Annulus", icon: CircleDot, action: () => onTemplate("annulus") },
    { id: "template-semicircle", label: "Semicircle", icon: CircleDot, action: () => onTemplate("semicircle") },
    { id: "template-sector", label: "Sector", icon: Blend, action: () => onTemplate("sector") },
    { id: "template-arc", label: "Arc", icon: Spline, action: () => onTemplate("arc") },
    { id: "template-parabola", label: "Parabola", icon: LineChart, action: () => onTemplate("parabola") },
    { id: "template-ellipse", label: "Ellipse", icon: Circle, action: () => onTemplate("ellipse") },
    { id: "template-hyperbola", label: "Hyperbola", icon: GitBranch, action: () => onTemplate("hyperbola") },
    { id: "template-angle", label: "Angle", icon: Radius, action: () => onTemplate("angle-shape") },
    { id: "template-axes", label: "Axes", icon: Crosshair, action: () => onTemplate("coordinate-axes") },
  ];
  const operationActions: GeometryActionItem[] = [
    { id: "reflect-selected", label: "Reflect", icon: FlipHorizontal2, action: () => onTransform("reflection") },
    { id: "rotate-selected", label: "Rotate", icon: RotateCcw, action: () => onTransform("rotation") },
    { id: "dilate-selected", label: "Dilate", icon: ZoomIn, action: () => onTransform("dilation") },
    { id: "trace-selected", label: tracing ? "Trace On" : "Trace", icon: Highlighter, action: onTrace, active: tracing },
    { id: "stop-trace", label: "Stop Trace", icon: Pause, action: onStopTrace },
    { id: "clear-trace", label: "Clear Trace", icon: Eraser, action: onClearTrace },
  ];
  const fileActions: GeometryActionItem[] = [
    { id: "delete", label: "Delete", icon: Trash2, action: onDelete },
    { id: "undo", label: "Undo", icon: RotateCcw, action: onUndo },
    { id: "redo", label: "Redo", icon: RotateCcw, action: onRedo },
    { id: "reset", label: "Reset", icon: Eraser, action: onReset },
    { id: "save", label: "Save", icon: Save, action: onSave },
    { id: "load", label: "Load", icon: Download, action: onLoad },
  ];

  return (
    <aside className="geometry-left-tools thin-scrollbar min-h-0 overflow-auto rounded-xl border border-slate-200 bg-white/90 p-2 dark:border-white/10 dark:bg-slate-950/70">
      {geometryToolGroups.map((group) => (
        <GeometryPaletteSection key={group.title} title={group.title}>
          {group.tools.map((item) => (
            <GeometryPaletteTool key={item.id} item={item} active={activeTool === item.id} onClick={() => onTool(item.id)} />
          ))}
        </GeometryPaletteSection>
      ))}
      <GeometryPaletteSection title="Shapes">
        {templateActions.map((item) => <GeometryPaletteAction key={item.id} item={item} />)}
      </GeometryPaletteSection>
      <GeometryPaletteSection title="Selected Object">
        {operationActions.map((item) => <GeometryPaletteAction key={item.id} item={item} />)}
      </GeometryPaletteSection>
      <GeometryPaletteSection title="File">
        {fileActions.map((item) => <GeometryPaletteAction key={item.id} item={item} danger={item.id === "delete"} />)}
      </GeometryPaletteSection>
    </aside>
  );
}

function GeometryPaletteSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-3 last:mb-0">
      <h4 className="mb-1.5 px-1 text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h4>
      <div className="grid grid-cols-3 gap-1.5">{children}</div>
    </section>
  );
}

function GeometryPaletteTool({ item, active, onClick }: { item: GeometryToolItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button type="button" onClick={onClick} title={item.label} className={`geometry-palette-button ${active ? "geometry-palette-button-active" : ""}`}>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </button>
  );
}

function GeometryPaletteAction({ item, danger }: { item: GeometryActionItem; danger?: boolean }) {
  const Icon = item.icon;
  return (
    <button type="button" onClick={item.action} title={item.label} className={`geometry-palette-button ${item.active ? "geometry-palette-button-active" : ""} ${danger ? "geometry-palette-button-danger" : ""}`}>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </button>
  );
}

function GeometryLabResults({ construction, selected, selectedPointIds, activeTool }: { construction: Construction; selected: SelectedGeoObject; selectedPointIds: string[]; activeTool: GeometryTool }) {
  const selectedPoint = selected?.kind === "point" ? pointById(construction.points, selected.id) : null;
  const selectedLine = selected?.kind === "line" ? construction.lines.find((line) => line.id === selected.id) : null;
  const selectedCircle = selected?.kind === "circle" ? construction.circles.find((circle) => circle.id === selected.id) : null;
  const selectedPolygon = selected?.kind === "polygon" ? construction.polygons.find((polygon) => polygon.id === selected.id) : null;
  const selectedAngle = selected?.kind === "angle" ? construction.angles.find((angle) => angle.id === selected.id) : null;
  const selectedArc = selected?.kind === "arc" ? construction.arcs.find((arc) => arc.id === selected.id) : null;
  const selectedText = selected?.kind === "text" ? construction.texts.find((note) => note.id === selected.id) : null;
  const selectedConic = selected?.kind === "conic" ? construction.conics.find((conic) => conic.id === selected.id) : null;
  const distancePoints = selectedPointIds.slice(-2).map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
  const entries: Array<{ label: string; value: string }> = [];
  const titleParts: string[] = [];

  if (activeTool === "distance" && distancePoints.length === 2) {
    titleParts.push(`Distance ${distancePoints[0].label}${distancePoints[1].label}`);
    entries.push(...distanceMetrics(distancePoints[0], distancePoints[1]));
  } else if (selectedPoint) {
    titleParts.push(`Point ${selectedPoint.label}`);
    entries.push(
      { label: "Coordinate", value: `(${boardUnit(selectedPoint.x)}, ${boardUnit(selectedPoint.y)})` },
      { label: "Raw canvas", value: `(${roundTo(selectedPoint.x, 1)}, ${roundTo(selectedPoint.y, 1)})` },
      { label: "Distance from origin", value: `${roundTo(Math.hypot(boardUnitNumber(selectedPoint.x), boardUnitNumber(selectedPoint.y)), 3)} units` },
    );
  } else if (selectedLine) {
    const a = pointById(construction.points, selectedLine.a);
    const b = pointById(construction.points, selectedLine.b);
    if (a && b) {
      titleParts.push(`${lineKindLabel(selectedLine.kind ?? "segment")} ${a.label}${b.label}`);
      entries.push(...distanceMetrics(a, b));
      entries.push(
        { label: "Slope", value: slopeLabel(a, b) },
        { label: "Direction", value: `${roundTo(directionDegrees(a, b), 2)} deg` },
        { label: "Midpoint", value: `(${boardUnit((a.x + b.x) / 2)}, ${boardUnit((a.y + b.y) / 2)})` },
        { label: "Equation", value: lineEquationLabel(a, b) },
      );
    }
  } else if (selectedCircle) {
    const center = pointById(construction.points, selectedCircle.center);
    const edge = pointById(construction.points, selectedCircle.edge);
    if (center && edge) {
      const r = distance(center, edge) / 40;
      titleParts.push(`Circle center ${center.label}`);
      entries.push(
        { label: "Center", value: `(${boardUnit(center.x)}, ${boardUnit(center.y)})` },
        { label: "Radius", value: `${roundTo(r, 3)} units` },
        { label: "Diameter", value: `${roundTo(2 * r, 3)} units` },
        { label: "Circumference", value: `${roundTo(2 * Math.PI * r, 3)} units` },
        { label: "Area", value: `${roundTo(Math.PI * r * r, 3)} sq units` },
        { label: "Equation", value: `(x-${boardUnit(center.x)})^2+(y-${boardUnit(center.y)})^2=${roundTo(r * r, 3)}` },
      );
    }
  } else if (selectedPolygon) {
    const points = selectedPolygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
    if (points.length >= 3) {
      const lengths = polygonSideLengths(points);
      const centroid = polygonCentroid(points);
      titleParts.push(`${points.length}-sided polygon`);
      entries.push(
        { label: "Side lengths", value: lengths.map((length) => roundTo(length, 3)).join(", ") },
        { label: "Perimeter", value: `${roundTo(lengths.reduce((sum, item) => sum + item, 0), 3)} units` },
        { label: "Area", value: `${roundTo(polygonArea(points) / 1600, 3)} sq units` },
        { label: "Centroid", value: `(${boardUnit(centroid.x)}, ${boardUnit(centroid.y)})` },
        { label: "Interior angle sum", value: `${(points.length - 2) * 180} deg` },
      );
    }
  } else if (selectedAngle) {
    const a = pointById(construction.points, selectedAngle.a);
    const vertex = pointById(construction.points, selectedAngle.vertex);
    const b = pointById(construction.points, selectedAngle.b);
    if (a && vertex && b) {
      const theta = angleDegrees(a, vertex, b);
      titleParts.push(`Angle ${a.label}${vertex.label}${b.label}`);
      entries.push(
        { label: "Angle", value: `${roundTo(theta, 3)} deg` },
        { label: "Radians", value: `${roundTo(theta * Math.PI / 180, 4)} rad` },
        { label: "Complement", value: theta <= 90 ? `${roundTo(90 - theta, 3)} deg` : "not acute" },
        { label: "Supplement", value: `${roundTo(180 - theta, 3)} deg` },
        { label: "Ray lengths", value: `${roundTo(distance(vertex, a) / 40, 3)}, ${roundTo(distance(vertex, b) / 40, 3)} units` },
      );
    }
  } else if (selectedArc) {
    const center = pointById(construction.points, selectedArc.center);
    const start = pointById(construction.points, selectedArc.start);
    const end = pointById(construction.points, selectedArc.end);
    if (center && start && end) {
      const radius = distance(center, start) / 40;
      const theta = arcCentralAngle(center, start, end, selectedArc.kind === "semicircle");
      titleParts.push(`${selectedArc.kind} ${center.label}${start.label}${end.label}`);
      entries.push(
        { label: "Radius", value: `${roundTo(radius, 4)} units` },
        { label: "Central angle", value: `${roundTo(theta, 3)} deg` },
        { label: "Arc length", value: `${roundTo((Math.PI * radius * theta) / 180, 4)} units` },
        { label: "Sector area", value: `${roundTo((Math.PI * radius * radius * theta) / 360, 4)} sq units` },
      );
    }
  } else if (selectedText) {
    const anchor = pointById(construction.points, selectedText.point);
    titleParts.push(selectedText.text === "Image" ? "Image anchor" : "Text note");
    entries.push(
      { label: "Content", value: selectedText.text },
      { label: "Anchor", value: anchor ? `${anchor.label} (${boardUnit(anchor.x)}, ${boardUnit(anchor.y)})` : "missing" },
    );
  } else if (selectedConic) {
    const center = pointById(construction.points, selectedConic.center);
    if (center) {
      titleParts.push(`${selectedConic.kind} conic`);
      entries.push(
        { label: "Center / vertex", value: `(${boardUnit(center.x)}, ${boardUnit(center.y)})` },
        { label: "Equation", value: conicEquation(selectedConic) },
        { label: "a", value: `${roundTo(selectedConic.a / 40, 3)} units` },
        { label: "b", value: `${roundTo(selectedConic.b / 40, 3)} units` },
      );
    }
  }

  if (!entries.length) {
    const quickCounts = [
      { label: "Points", value: construction.points.length.toString() },
      { label: "Lines", value: construction.lines.length.toString() },
      { label: "Circles", value: construction.circles.length.toString() },
      { label: "Polygons", value: construction.polygons.length.toString() },
      { label: "Arcs", value: construction.arcs.length.toString() },
      { label: "Notes", value: construction.texts.length.toString() },
    ];
    return (
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
        <p className="text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-200">Geometry Lab Results</p>
        <h3 className="mt-1 text-sm font-black">Select an object to measure</h3>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">Pick a line for length/slope, polygon for perimeter/area, circle for radius/area, angle for degrees, or use Distance and pick two points.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {quickCounts.map((entry) => <MetricTile key={entry.label} label={entry.label} value={entry.value} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
      <p className="text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-200">Geometry Lab Results</p>
      <h3 className="mt-1 text-sm font-black">{titleParts[0] ?? "Selected measurement"}</h3>
      <div className="order-3 grid gap-2">
        {entries.map((entry) => (
          <div key={entry.label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-2 rounded-xl bg-white/75 p-2 text-xs dark:bg-slate-950/50">
            <span className="font-black uppercase text-slate-500 dark:text-slate-400">{entry.label}</span>
            <span className="min-w-0 [overflow-wrap:anywhere] font-mono font-black text-slate-950 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
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
  const metricLabel = kind === "line"
    ? `m=${slopeLabel(a, b)}`
    : `${lineKindLabel(kind)} ${roundTo(distance(a, b) / 40, 2)}u`;
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
      <text x={midpoint.x + 8} y={midpoint.y - 8} fill={selected ? "#b45309" : stroke} className="select-none text-xs font-black">{metricLabel}</text>
    </g>
  );
}

function GeometryCircle({ circle, points, selected, onSelect }: { circle: GeoCircle; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!center || !edge) return null;
  const radius = distance(center, edge);
  return (
    <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
      <circle cx={center.x} cy={center.y} r={radius} fill="rgba(34,211,238,.12)" stroke={selected ? "#f59e0b" : "#06b6d4"} strokeWidth={selected ? "7" : "4"} />
      <line x1={center.x} y1={center.y} x2={edge.x} y2={edge.y} stroke={selected ? "#f59e0b" : "#06b6d4"} strokeWidth="2" strokeDasharray="4 4" />
      <text x={center.x + radius + 8} y={center.y} fill={selected ? "#b45309" : "#06b6d4"} className="select-none text-xs font-black">
        r={roundTo(radius / 40, 2)}u
      </text>
    </g>
  );
}

function GeometryPolygon({ polygon, points, selected, onSelect }: { polygon: GeoPolygon; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const polygonPoints = polygon.points.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (polygonPoints.length < 3) return null;
  const centroid = polygonCentroid(polygonPoints);
  return (
    <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
      <polygon points={polygonPoints.map((point) => `${point.x},${point.y}`).join(" ")} fill={selected ? "rgba(245,158,11,.28)" : "rgba(245,158,11,.16)"} stroke="#f59e0b" strokeWidth={selected ? "7" : "4"} />
      <text x={centroid.x + 8} y={centroid.y} fill="#fbbf24" className="select-none text-xs font-black">
        A={roundTo(polygonArea(polygonPoints) / 1600, 2)}u^2
      </text>
    </g>
  );
}

function GeometryArc({ arc, points, selected, onSelect }: { arc: GeoArc; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const center = pointById(points, arc.center), start = pointById(points, arc.start), end = pointById(points, arc.end);
  if (!center || !start || !end) return null;
  const path = arcPath(center, start, end, arc.kind === "semicircle");
  const radius = distance(center, start);
  const midAngle = normalizedArcMidAngle(center, start, end, arc.kind === "semicircle");
  const labelPoint = { x: center.x + Math.cos(midAngle) * (radius + 16), y: center.y + Math.sin(midAngle) * (radius + 16) };
  const fill = arc.kind === "sector" ? (selected ? "rgba(20,184,166,.24)" : "rgba(20,184,166,.14)") : "none";
  return (
    <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
      {arc.kind === "sector" && <path d={`M ${center.x} ${center.y} L ${start.x} ${start.y} ${path.replace(/^M [^A]+/, "")} Z`} fill={fill} stroke="none" />}
      <path d={path} fill="none" stroke={selected ? "#f59e0b" : "#14b8a6"} strokeWidth={selected ? "7" : "4"} />
      {(arc.kind === "sector" || arc.kind === "semicircle") && (
        <>
          <line x1={center.x} y1={center.y} x2={start.x} y2={start.y} stroke="#14b8a6" strokeDasharray="5 5" opacity="0.55" />
          <line x1={center.x} y1={center.y} x2={end.x} y2={end.y} stroke="#14b8a6" strokeDasharray="5 5" opacity="0.55" />
        </>
      )}
      <text x={labelPoint.x} y={labelPoint.y} fill={selected ? "#b45309" : "#0f766e"} className="select-none text-xs font-black">
        {arc.kind} {roundTo(arcCentralAngle(center, start, end, arc.kind === "semicircle"), 1)} deg
      </text>
    </g>
  );
}

function GeometryTextNote({ note, points, selected, onSelect }: { note: GeoTextNote; points: GeoPoint[]; selected?: boolean; onSelect?: () => void }) {
  const anchor = pointById(points, note.point);
  if (!anchor) return null;
  return (
    <g className="cursor-pointer" onPointerDown={(event) => { event.stopPropagation(); onSelect?.(); }}>
      <rect x={anchor.x + 10} y={anchor.y - 34} width={Math.max(54, note.text.length * 8 + 18)} height="28" rx="7" fill={selected ? "rgba(245,158,11,.24)" : "rgba(15,23,42,.82)"} stroke={selected ? "#f59e0b" : "#38bdf8"} />
      <text x={anchor.x + 20} y={anchor.y - 15} fill="#ffffff" className="select-none text-xs font-black">{note.text}</text>
    </g>
  );
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
  onUpdateArc,
  onUpdateText,
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
  onUpdateArc: (id: string, patch: Partial<Pick<GeoArc, "kind" | "center" | "start" | "end">>) => void;
  onUpdateText: (id: string, patch: Partial<Pick<GeoTextNote, "point" | "text">>) => void;
  onUpdateConic: (id: string, patch: Partial<Pick<GeoConic, "kind" | "center" | "a" | "b">>) => void;
  onToggleLock: (kind: Exclude<NonNullable<SelectedGeoObject>["kind"], "constraint" | "transform">, id: string) => void;
  onDelete: (kind: NonNullable<SelectedGeoObject>["kind"], id: string) => void;
}) {
  const selectedPoint = selected?.kind === "point" ? pointById(construction.points, selected.id) : null;
  const selectedLine = selected?.kind === "line" ? construction.lines.find((line) => line.id === selected.id) : null;
  const selectedCircle = selected?.kind === "circle" ? construction.circles.find((circle) => circle.id === selected.id) : null;
  const selectedPolygon = selected?.kind === "polygon" ? construction.polygons.find((polygon) => polygon.id === selected.id) : null;
  const selectedAngle = selected?.kind === "angle" ? construction.angles.find((angle) => angle.id === selected.id) : null;
  const selectedArc = selected?.kind === "arc" ? construction.arcs.find((arc) => arc.id === selected.id) : null;
  const selectedText = selected?.kind === "text" ? construction.texts.find((note) => note.id === selected.id) : null;
  const selectedConic = selected?.kind === "conic" ? construction.conics.find((conic) => conic.id === selected.id) : null;
  const selectedTransform = selected?.kind === "transform" ? construction.transforms.find((transform) => transform.id === selected.id) : null;
  const selectedConstraint = selected?.kind === "constraint" ? construction.constraints.find((constraint) => constraint.id === selected.id) : null;
  const objectCount = construction.points.length + construction.lines.length + construction.circles.length + construction.polygons.length + construction.angles.length + construction.arcs.length + construction.texts.length + construction.conics.length + construction.transforms.length + construction.constraints.length;
  const selectedLinePoints = selectedLine ? [pointById(construction.points, selectedLine.a), pointById(construction.points, selectedLine.b)] as const : null;
  const selectedCirclePoints = selectedCircle ? [pointById(construction.points, selectedCircle.center), pointById(construction.points, selectedCircle.edge)] as const : null;
  const selectedPolygonPoints = selectedPolygon ? selectedPolygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[] : [];
  const selectedAnglePoints = selectedAngle ? [pointById(construction.points, selectedAngle.a), pointById(construction.points, selectedAngle.vertex), pointById(construction.points, selectedAngle.b)] as const : null;
  const selectedArcPoints = selectedArc ? [pointById(construction.points, selectedArc.center), pointById(construction.points, selectedArc.start), pointById(construction.points, selectedArc.end)] as const : null;

  const editPoint = (id: string, patch: Partial<Pick<GeoPoint, "label" | "x" | "y">>) => onUpdatePoint(id, patch);
  const setLineLength = (line: GeoLine, units: number) => {
    const a = pointById(construction.points, line.a), b = pointById(construction.points, line.b);
    if (!a || !b) return;
    const vector = normalize(b.x - a.x, b.y - a.y);
    editPoint(line.b, { x: a.x + vector.x * units * 40, y: a.y + vector.y * units * 40 });
  };
  const setLineAngle = (line: GeoLine, degrees: number) => {
    const a = pointById(construction.points, line.a), b = pointById(construction.points, line.b);
    if (!a || !b) return;
    const length = distance(a, b) || 80;
    const radians = -degrees * Math.PI / 180;
    editPoint(line.b, { x: a.x + Math.cos(radians) * length, y: a.y + Math.sin(radians) * length });
  };
  const setCircleRadius = (circle: GeoCircle, units: number) => {
    const center = pointById(construction.points, circle.center), edge = pointById(construction.points, circle.edge);
    if (!center || !edge) return;
    const vector = normalize(edge.x - center.x, edge.y - center.y);
    editPoint(circle.edge, { x: center.x + vector.x * units * 40, y: center.y + vector.y * units * 40 });
  };
  const moveCircleCenter = (circle: GeoCircle, axis: "x" | "y", units: number) => {
    const center = pointById(construction.points, circle.center), edge = pointById(construction.points, circle.edge);
    if (!center || !edge) return;
    const nextValue = axis === "x" ? units * 40 : 420 - units * 40;
    const dx = axis === "x" ? nextValue - center.x : 0;
    const dy = axis === "y" ? nextValue - center.y : 0;
    editPoint(circle.center, axis === "x" ? { x: nextValue } : { y: nextValue });
    editPoint(circle.edge, { x: edge.x + dx, y: edge.y + dy });
  };
  const scalePolygon = (polygon: GeoPolygon, scale: number) => {
    const points = polygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
    if (points.length < 3) return;
    const centroid = polygonCentroid(points);
    points.forEach((point) => editPoint(point.id, { x: centroid.x + (point.x - centroid.x) * scale, y: centroid.y + (point.y - centroid.y) * scale }));
  };
  const rotatePolygon = (polygon: GeoPolygon, degrees: number) => {
    const points = polygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
    if (points.length < 3) return;
    const centroid = polygonCentroid(points);
    const radians = degrees * Math.PI / 180;
    points.forEach((point) => {
      const dx = point.x - centroid.x, dy = point.y - centroid.y;
      editPoint(point.id, { x: centroid.x + dx * Math.cos(radians) - dy * Math.sin(radians), y: centroid.y + dx * Math.sin(radians) + dy * Math.cos(radians) });
    });
  };
  const setAngleDegrees = (angle: GeoAngle, degrees: number) => {
    const a = pointById(construction.points, angle.a), vertex = pointById(construction.points, angle.vertex), b = pointById(construction.points, angle.b);
    if (!a || !vertex || !b) return;
    const base = Math.atan2(a.y - vertex.y, a.x - vertex.x);
    const length = distance(vertex, b) || 80;
    const next = base - degrees * Math.PI / 180;
    editPoint(angle.b, { x: vertex.x + Math.cos(next) * length, y: vertex.y + Math.sin(next) * length });
  };
  const setArcRadius = (arc: GeoArc, units: number) => {
    const center = pointById(construction.points, arc.center), start = pointById(construction.points, arc.start), end = pointById(construction.points, arc.end);
    if (!center || !start || !end) return;
    const radius = units * 40;
    const startVector = normalize(start.x - center.x, start.y - center.y);
    const endVector = normalize(end.x - center.x, end.y - center.y);
    editPoint(arc.start, { x: center.x + startVector.x * radius, y: center.y + startVector.y * radius });
    editPoint(arc.end, { x: center.x + endVector.x * radius, y: center.y + endVector.y * radius });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Advanced geometry</p>
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
        <ObjectGroup title="Arcs / Sectors">
          {construction.arcs.map((arc, index) => (
            <ObjectRow key={arc.id} active={selected?.kind === "arc" && selected.id === arc.id} label={`${arc.kind} ${index + 1}: ${labelForPoint(construction, arc.center)}-${labelForPoint(construction, arc.start)}-${labelForPoint(construction, arc.end)}`} onClick={() => onSelect({ kind: "arc", id: arc.id })} onDelete={() => onDelete("arc", arc.id)} />
          ))}
        </ObjectGroup>
        <ObjectGroup title="Media / Text">
          {construction.texts.map((note, index) => (
            <ObjectRow key={note.id} active={selected?.kind === "text" && selected.id === note.id} label={`${note.text} ${index + 1}: ${labelForPoint(construction, note.point)}`} onClick={() => onSelect({ kind: "text", id: note.id })} onDelete={() => onDelete("text", note.id)} />
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

      <div className="order-2 rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
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
            {selectedLinePoints?.[0] && selectedLinePoints[1] && (
              <SelectedPropertyGrid
                items={[
                  ["Length", `${roundTo(distance(selectedLinePoints[0], selectedLinePoints[1]) / 40, 3)} u`],
                  ["Slope", slopeLabel(selectedLinePoints[0], selectedLinePoints[1])],
                  ["Angle", `${roundTo(directionDegrees(selectedLinePoints[0], selectedLinePoints[1]), 2)} deg`],
                  ["Equation", lineEquationLabel(selectedLinePoints[0], selectedLinePoints[1])],
                ]}
              />
            )}
            {selectedLinePoints?.[0] && selectedLinePoints[1] && (
              <>
                <NumberField label="Length" value={roundTo(distance(selectedLinePoints[0], selectedLinePoints[1]) / 40, 3)} min={0.1} max={20} step={0.1} onChange={(value) => setLineLength(selectedLine, value)} />
                <NumberField label="Angle from x-axis" value={roundTo(directionDegrees(selectedLinePoints[0], selectedLinePoints[1]), 2)} min={0} max={360} step={1} onChange={(value) => setLineAngle(selectedLine, value)} />
              </>
            )}
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
            {selectedCirclePoints?.[0] && selectedCirclePoints[1] && (
              <>
                <SelectedPropertyGrid
                  items={[
                    ["Radius", `${roundTo(distance(selectedCirclePoints[0], selectedCirclePoints[1]) / 40, 3)} u`],
                    ["Diameter", `${roundTo(distance(selectedCirclePoints[0], selectedCirclePoints[1]) / 20, 3)} u`],
                    ["Area", `${roundTo(Math.PI * (distance(selectedCirclePoints[0], selectedCirclePoints[1]) / 40) ** 2, 3)} u^2`],
                    ["Circumference", `${roundTo(2 * Math.PI * distance(selectedCirclePoints[0], selectedCirclePoints[1]) / 40, 3)} u`],
                  ]}
                />
                <NumberField label="Radius" value={roundTo(distance(selectedCirclePoints[0], selectedCirclePoints[1]) / 40, 3)} min={0.1} max={12} step={0.1} onChange={(value) => setCircleRadius(selectedCircle, value)} />
                <NumberField label="Center x" value={roundTo(selectedCirclePoints[0].x / 40, 3)} min={0} max={16} step={0.05} onChange={(value) => moveCircleCenter(selectedCircle, "x", value)} />
                <NumberField label="Center y" value={roundTo((420 - selectedCirclePoints[0].y) / 40, 3)} min={0} max={10.5} step={0.05} onChange={(value) => moveCircleCenter(selectedCircle, "y", value)} />
              </>
            )}
            <PointSelect label="Center" value={selectedCircle.center} points={construction.points} onChange={(value) => onUpdateCircle(selectedCircle.id, { center: value })} />
            <PointSelect label="Radius point" value={selectedCircle.edge} points={construction.points} onChange={(value) => onUpdateCircle(selectedCircle.id, { edge: value })} />
          </div>
        )}
        {selectedPolygon && (
          <div className="grid gap-2">
            <p className="text-sm font-black">{selectedPolygon.points.length === 3 ? "Triangle" : "Polygon"} properties</p>
            <button type="button" className={selectedPolygon.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("polygon", selectedPolygon.id)}>{selectedPolygon.locked ? "Unlock object" : "Lock object"}</button>
            {selectedPolygonPoints.length >= 3 && (
              <>
                <SelectedPropertyGrid
                  items={[
                    ["Vertices", selectedPolygonPoints.map((point) => point.label).join(", ")],
                    ["Side lengths", polygonSideLengths(selectedPolygonPoints).map((length) => roundTo(length, 2)).join(", ")],
                    ["Perimeter", `${roundTo(polygonSideLengths(selectedPolygonPoints).reduce((sum, value) => sum + value, 0), 3)} u`],
                    ["Area", `${roundTo(polygonArea(selectedPolygonPoints) / 1600, 3)} u^2`],
                  ]}
                />
                <NumberField label="Scale from centroid" value={1} min={0.2} max={3} step={0.1} onChange={(value) => scalePolygon(selectedPolygon, value)} />
                <NumberField label="Rotate by degrees" value={0} min={-180} max={180} step={5} onChange={(value) => rotatePolygon(selectedPolygon, value)} />
              </>
            )}
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
            {selectedAnglePoints?.[0] && selectedAnglePoints[1] && selectedAnglePoints[2] && (
              <>
                <SelectedPropertyGrid
                  items={[
                    ["Angle", `${roundTo(angleDegrees(selectedAnglePoints[0], selectedAnglePoints[1], selectedAnglePoints[2]), 3)} deg`],
                    ["Radians", `${roundTo(angleDegrees(selectedAnglePoints[0], selectedAnglePoints[1], selectedAnglePoints[2]) * Math.PI / 180, 4)}`],
                    ["Ray 1", `${roundTo(distance(selectedAnglePoints[1], selectedAnglePoints[0]) / 40, 3)} u`],
                    ["Ray 2", `${roundTo(distance(selectedAnglePoints[1], selectedAnglePoints[2]) / 40, 3)} u`],
                  ]}
                />
                <NumberField label="Angle degrees" value={roundTo(angleDegrees(selectedAnglePoints[0], selectedAnglePoints[1], selectedAnglePoints[2]), 2)} min={0} max={180} step={1} onChange={(value) => setAngleDegrees(selectedAngle, value)} />
              </>
            )}
            <PointSelect label="First ray point" value={selectedAngle.a} points={construction.points} onChange={(value) => onUpdateAngle(selectedAngle.id, { a: value })} />
            <PointSelect label="Vertex" value={selectedAngle.vertex} points={construction.points} onChange={(value) => onUpdateAngle(selectedAngle.id, { vertex: value })} />
            <PointSelect label="Second ray point" value={selectedAngle.b} points={construction.points} onChange={(value) => onUpdateAngle(selectedAngle.id, { b: value })} />
          </div>
        )}
        {selectedArc && (
          <div className="grid gap-2">
            <p className="text-sm font-black">{selectedArc.kind} properties</p>
            <button type="button" className={selectedArc.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("arc", selectedArc.id)}>{selectedArc.locked ? "Unlock object" : "Lock object"}</button>
            {selectedArcPoints?.[0] && selectedArcPoints[1] && selectedArcPoints[2] && (
              <>
                <SelectedPropertyGrid
                  items={[
                    ["Radius", `${roundTo(distance(selectedArcPoints[0], selectedArcPoints[1]) / 40, 3)} u`],
                    ["Central angle", `${roundTo(arcCentralAngle(selectedArcPoints[0], selectedArcPoints[1], selectedArcPoints[2], selectedArc.kind === "semicircle"), 2)} deg`],
                    ["Arc length", `${roundTo((Math.PI * distance(selectedArcPoints[0], selectedArcPoints[1]) / 40 * arcCentralAngle(selectedArcPoints[0], selectedArcPoints[1], selectedArcPoints[2], selectedArc.kind === "semicircle")) / 180, 3)} u`],
                  ]}
                />
                <NumberField label="Radius" value={roundTo(distance(selectedArcPoints[0], selectedArcPoints[1]) / 40, 3)} min={0.1} max={12} step={0.1} onChange={(value) => setArcRadius(selectedArc, value)} />
              </>
            )}
            <label className="text-xs font-bold">
              Arc type
              <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={selectedArc.kind} onChange={(event) => onUpdateArc(selectedArc.id, { kind: event.target.value as GeoArcKind })}>
                <option value="arc">Arc</option>
                <option value="semicircle">Semicircle</option>
                <option value="sector">Sector</option>
              </select>
            </label>
            <PointSelect label="Center" value={selectedArc.center} points={construction.points} onChange={(value) => onUpdateArc(selectedArc.id, { center: value })} />
            <PointSelect label="Start" value={selectedArc.start} points={construction.points} onChange={(value) => onUpdateArc(selectedArc.id, { start: value })} />
            <PointSelect label="End" value={selectedArc.end} points={construction.points} onChange={(value) => onUpdateArc(selectedArc.id, { end: value })} />
          </div>
        )}
        {selectedText && (
          <div className="grid gap-2">
            <p className="text-sm font-black">{selectedText.text === "Image" ? "Image anchor" : "Text note"}</p>
            <button type="button" className={selectedText.locked ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => onToggleLock("text", selectedText.id)}>{selectedText.locked ? "Unlock object" : "Lock object"}</button>
            <label className="text-xs font-bold">Content<input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={selectedText.text} onChange={(event) => onUpdateText(selectedText.id, { text: event.target.value })} /></label>
            <PointSelect label="Anchor point" value={selectedText.point} points={construction.points} onChange={(value) => onUpdateText(selectedText.id, { point: value })} />
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

function SelectedPropertyGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-1 rounded-xl bg-white/80 p-2 dark:bg-slate-950/50">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[92px_minmax(0,1fr)] gap-2 text-xs">
          <span className="font-black uppercase text-slate-500 dark:text-slate-400">{label}</span>
          <span className="min-w-0 [overflow-wrap:anywhere] font-mono font-black text-slate-900 dark:text-white">{value}</span>
        </div>
      ))}
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

function LocusTraceOverlay({ traces }: { traces: LocusTrace[] }) {
  return (
    <g>
      {traces.filter((trace) => trace.visible && trace.points.length > 1).map((trace) => (
        <g key={trace.id}>
          <path d={locusPath(trace.points)} fill="none" stroke={trace.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.72" />
          {trace.points.length > 0 && (
            <text x={trace.points[trace.points.length - 1].x + 10} y={trace.points[trace.points.length - 1].y - 10} fill={trace.color} className="select-none text-xs font-black">
              {trace.label}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

function GeometryKernelPanel({
  construction,
  selected,
  traces,
  activeTracePointId,
  onTraceSelected,
  onStopTrace,
  onClearTraces,
  onToggleTrace,
  onDeleteTrace,
}: {
  construction: Construction;
  selected: SelectedGeoObject;
  traces: LocusTrace[];
  activeTracePointId: string | null;
  onTraceSelected: () => void;
  onStopTrace: () => void;
  onClearTraces: () => void;
  onToggleTrace: (traceId: string) => void;
  onDeleteTrace: (traceId: string) => void;
}) {
  const selectedPoint = selected?.kind === "point" ? pointById(construction.points, selected.id) : null;
  const insights = geometryInsights(construction);
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Geometry kernel</p>
          <h3 className="font-bold">Locus and Theorem Studio</h3>
        </div>
        <span className="mini-chip">{traces.length} trace{traces.length === 1 ? "" : "s"}</span>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-sm font-black">Locus tracing</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
            Select a point, start tracing, then drag source points. The selected point's path becomes a visible locus curve.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="action-primary" onClick={onTraceSelected} disabled={!selectedPoint}>
              <Radius className="h-4 w-4" />
              Trace selected
            </button>
            <button type="button" className="action-secondary" onClick={onStopTrace} disabled={!activeTracePointId}>Stop</button>
            <button type="button" className="action-secondary" onClick={onClearTraces} disabled={!traces.length}>Clear traces</button>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active trace: {activeTracePointId ? labelForPoint(construction, activeTracePointId) : "none"}
          </p>
        </div>

        {traces.length > 0 && (
          <div className="grid gap-1">
            {traces.map((trace) => (
              <div key={trace.id} className="grid grid-cols-[14px_minmax(0,1fr)_auto_auto] items-center gap-2 rounded-xl bg-slate-100 p-2 dark:bg-white/10">
                <span className="h-3.5 w-3.5 rounded-full" style={{ background: trace.color }} />
                <span className="truncate text-xs font-bold">{trace.label}: {trace.points.length} samples</span>
                <button type="button" className="mini-chip" onClick={() => onToggleTrace(trace.id)}>{trace.visible ? "Hide" : "Show"}</button>
                <button type="button" className="mini-chip" onClick={() => onDeleteTrace(trace.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-sm font-black">Theorem insights</p>
          {insights.length ? (
            <div className="mt-2 grid gap-2">
              {insights.map((insight) => (
                <div key={`${insight.title}-${insight.result}`} className="rounded-xl bg-white/75 p-3 dark:bg-slate-950/50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">{insight.title}</p>
                    <span className="mini-chip">{insight.confidence}</span>
                  </div>
                  <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">{insight.result}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{insight.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Add a triangle, polygon, or circle to see live theorem-style insights.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function geometryInsights(construction: Construction) {
  const polygonInsights = construction.polygons.flatMap((polygon) => {
    const points = polygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
    return triangleInsights(points, 40);
  });
  const circleTheorems = construction.circles.flatMap((circle) => {
    return circleInsights(pointById(construction.points, circle.center) ?? null, pointById(construction.points, circle.edge) ?? null, 40);
  });
  return [...polygonInsights, ...circleTheorems].slice(0, 8);
}

function DependencyPanel({ construction, selected, onSelect }: { construction: Construction; selected: SelectedGeoObject; onSelect: (value: SelectedGeoObject) => void }) {
  const nodes = buildDependencyGraph(construction);
  const diagnostics = constructionDiagnostics(construction, nodes);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Dependency algebra</p>
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
    "perpendicular-bisector": "Select two points to prepare a perpendicular bisector construction.",
    "regular-polygon": "Place or select vertices for a regular polygon construction.",
    "circle-radius": "Place a center and set a radius-driven circle.",
    "circle-3point": "Pick three points to define a circle through them.",
    semicircle: "Pick two endpoints to create a semicircle.",
    arc: "Pick points on a circle path to create an arc.",
    sector: "Pick a center and two boundary points to create a sector.",
    compass: "Copy a length from one pair of points to another location.",
    distance: "Select points or objects to inspect distance and length measurements.",
    area: "Select a polygon or closed region to inspect area.",
    slope: "Select a line, ray, segment, or vector to inspect slope.",
    locus: "Select a dependent point to review its path as drivers move.",
    trace: "Select a point and use Trace in the left tool panel to record motion.",
    "hide-show": "Select an object to prepare visibility changes.",
    "lock-object": "Select an object, then lock or unlock it in the inspector.",
    duplicate: "Select an object to prepare a copied construction.",
    freehand: "Sketch an annotation path over the construction area.",
    text: "Place a text note near the construction.",
    label: "Select an object to prepare label editing.",
    slider: "Create a parameter slider for linked numeric constructions.",
    "move-canvas": "Drag the construction view without changing objects.",
    "zoom-tool": "Zoom into a region of the construction board.",
    "mirror-line": "Select an object and mirror line, or use Reflect under Selected Object.",
    "reflect-point": "Select an object, then click the center point to reflect it through that point.",
    translate: "Select an object and a vector to translate it.",
    "rotate-tool": "Select an object and center, or use Rotate under Selected Object.",
    "dilate-tool": "Select an object and center, or use Dilate under Selected Object.",
    "intersect-region": "Select two closed objects to prepare their shared region.",
    image: "Click the board to reserve an image anchor for diagrams and annotations.",
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

function boardUnitNumber(value: number) {
  return roundTo(value / 40, 4);
}

function boardUnit(value: number) {
  return boardUnitNumber(value).toString();
}

function distanceMetrics(a: GeoPoint, b: GeoPoint) {
  const dx = (b.x - a.x) / 40;
  const dy = (b.y - a.y) / 40;
  const length = Math.hypot(dx, dy);
  return [
    { label: "Length", value: `${roundTo(length, 4)} units` },
    { label: "Delta x", value: `${roundTo(dx, 4)} units` },
    { label: "Delta y", value: `${roundTo(dy, 4)} units` },
  ];
}

function polygonSideLengths(points: GeoPoint[]) {
  return points.map((point, index) => distance(point, points[(index + 1) % points.length]) / 40);
}

function polygonCentroid(points: GeoPoint[]) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / Math.max(1, points.length),
    y: points.reduce((sum, point) => sum + point.y, 0) / Math.max(1, points.length),
  };
}

function lineEquationLabel(a: GeoPoint, b: GeoPoint) {
  const x1 = a.x / 40;
  const y1 = a.y / 40;
  const x2 = b.x / 40;
  const y2 = b.y / 40;
  if (Math.abs(x2 - x1) < 0.0001) return `x = ${roundTo(x1, 3)}`;
  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;
  return `y = ${roundTo(m, 3)}x ${c >= 0 ? "+" : "-"} ${roundTo(Math.abs(c), 3)}`;
}

function normalizeConstruction(value: Partial<Construction>): Construction {
  return solveConstruction({
    points: value.points ?? [],
    lines: (value.lines ?? []).map((line) => ({ ...line, kind: line.kind ?? "segment" })),
    circles: value.circles ?? [],
    polygons: value.polygons ?? [],
    angles: value.angles ?? [],
    arcs: value.arcs ?? [],
    texts: value.texts ?? [],
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
  if (kind === "arc") return { ...construction, arcs: construction.arcs.map((arc) => arc.id === id ? { ...arc, locked: !arc.locked } : arc) };
  if (kind === "text") return { ...construction, texts: construction.texts.map((note) => note.id === id ? { ...note, locked: !note.locked } : note) };
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
  construction.arcs.forEach((arc, index) => addNode(objectKey("arc", arc.id), `${arc.kind} ${index + 1}`, arc.locked));
  construction.texts.forEach((note, index) => addNode(objectKey("text", note.id), `Text ${index + 1}`, note.locked));
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
  construction.arcs.forEach((arc) => {
    link(objectKey("point", arc.center), objectKey("arc", arc.id));
    link(objectKey("point", arc.start), objectKey("arc", arc.id));
    link(objectKey("point", arc.end), objectKey("arc", arc.id));
  });
  construction.texts.forEach((note) => link(objectKey("point", note.point), objectKey("text", note.id)));
  construction.conics.forEach((conic) => link(objectKey("point", conic.center), objectKey("conic", conic.id)));
  construction.transforms.forEach((transform) => {
    const transformId = objectKey("transform", transform.id);
    link(objectKey(transform.sourceKind, transform.sourceId), transformId);
    if (transform.center) link(objectKey("point", transform.center), transformId);
    transform.resultIds.forEach((resultId) => {
      if (construction.points.some((point) => point.id === resultId)) link(transformId, objectKey("point", resultId));
      if (construction.polygons.some((polygon) => polygon.id === resultId)) link(transformId, objectKey("polygon", resultId));
      if (construction.circles.some((circle) => circle.id === resultId)) link(transformId, objectKey("circle", resultId));
      if (construction.arcs.some((arc) => arc.id === resultId)) link(transformId, objectKey("arc", resultId));
      if (construction.texts.some((note) => note.id === resultId)) link(transformId, objectKey("text", resultId));
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
      arcs: construction.arcs.filter((arc) => !selected.has(arc.center) && !selected.has(arc.start) && !selected.has(arc.end)),
      texts: construction.texts.filter((note) => !selected.has(note.point)),
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
  if (kind === "arc") return { ...construction, arcs: construction.arcs.filter((arc) => arc.id !== id), transforms: construction.transforms.filter((transform) => !(transform.sourceKind === "arc" && transform.sourceId === id) && !transform.resultIds.includes(id)) };
  if (kind === "text") return { ...construction, texts: construction.texts.filter((note) => note.id !== id), transforms: construction.transforms.filter((transform) => !(transform.sourceKind === "text" && transform.sourceId === id) && !transform.resultIds.includes(id)) };
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

function addCircleThroughThreePoints(construction: Construction, aId: string, bId: string, cId: string) {
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId), c = pointById(construction.points, cId);
  if (!a || !b || !c) return construction;
  const center = circumcenter(a, b, c);
  if (!center) return construction;
  const centerPoint: GeoPoint = { id: crypto.randomUUID(), x: center.x, y: center.y, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, centerPoint], circles: [...construction.circles, { id: crypto.randomUUID(), center: centerPoint.id, edge: aId }] });
}

function addSemicircleConstruction(construction: Construction, aId: string, bId: string) {
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId);
  if (!a || !b) return construction;
  const centerPoint: GeoPoint = { id: crypto.randomUUID(), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, centerPoint], arcs: [...construction.arcs, { id: crypto.randomUUID(), kind: "semicircle", center: centerPoint.id, start: aId, end: bId }] });
}

function addRegularPolygonConstruction(construction: Construction, aId: string, bId: string, sides: number) {
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId);
  if (!a || !b || sides < 3) return construction;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  if (length < 1) return construction;
  const angle = Math.atan2(dy, dx);
  const turn = (Math.PI * 2) / sides;
  const newPoints: GeoPoint[] = [];
  let current = { x: b.x, y: b.y };
  let direction = angle;
  for (let index = 2; index < sides; index += 1) {
    direction += turn;
    current = { x: current.x + Math.cos(direction) * length, y: current.y + Math.sin(direction) * length };
    newPoints.push({ id: crypto.randomUUID(), x: current.x, y: current.y, label: nextPointLabel([...construction.points, ...newPoints]) });
  }
  return solveConstruction({ ...construction, points: [...construction.points, ...newPoints], polygons: [...construction.polygons, { id: crypto.randomUUID(), points: [aId, bId, ...newPoints.map((point) => point.id)] }] });
}

function addCompassCircleConstruction(construction: Construction, fromAId: string, fromBId: string, centerId: string) {
  const a = pointById(construction.points, fromAId), b = pointById(construction.points, fromBId), center = pointById(construction.points, centerId);
  if (!a || !b || !center) return construction;
  const length = distance(a, b);
  const edgePoint: GeoPoint = { id: crypto.randomUUID(), x: center.x + length, y: center.y, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, edgePoint], circles: [...construction.circles, { id: crypto.randomUUID(), center: centerId, edge: edgePoint.id }] });
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

function addTransformConstruction(construction: Construction, selected: NonNullable<SelectedGeoObject>, type: GeoTransformKind, options: { centerPointId?: string; lineId?: string; vectorPointIds?: [string, string] } = {}) {
  if (selected.kind !== "point" && selected.kind !== "polygon" && selected.kind !== "circle" && selected.kind !== "conic" && selected.kind !== "arc" && selected.kind !== "text") return construction;
  const center = (options.centerPointId ? pointById(construction.points, options.centerPointId) : null) ?? construction.points[0] ?? { id: "", x: 320, y: 210, label: "O" };
  const reflectionLine = options.lineId ? construction.lines.find((line) => line.id === options.lineId) : null;
  const vectorA = options.vectorPointIds ? pointById(construction.points, options.vectorPointIds[0]) : null;
  const vectorB = options.vectorPointIds ? pointById(construction.points, options.vectorPointIds[1]) : null;
  const transformPoint = (point: GeoPoint, index: number): GeoPoint => {
    const next = transformCoordinates(point, center, type, {
      line: reflectionLine,
      points: construction.points,
      vector: vectorA && vectorB ? { x: vectorB.x - vectorA.x, y: vectorB.y - vectorA.y } : undefined,
    });
    return { id: crypto.randomUUID(), x: next.x, y: next.y, label: pointLabelForIndex(construction.points.length + index), locked: false };
  };
  const sourcePoints = sourcePointIdsForSelection(construction, selected).map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
  if (!sourcePoints.length) return construction;
  const newPoints = sourcePoints.map(transformPoint);
  const pointMap = new Map(sourcePoints.map((point, index) => [point.id, newPoints[index].id]));
  const transform: GeoTransform = { id: crypto.randomUUID(), type, sourceKind: selected.kind, sourceId: selected.id, resultIds: [], center: center.id || undefined, line: options.lineId, vectorLine: options.vectorPointIds?.join(":"), angle: type === "rotation" ? 45 : undefined, scale: type === "dilation" ? 1.35 : undefined };
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
  if (selected.kind === "arc") {
    const arc = construction.arcs.find((item) => item.id === selected.id);
    if (!arc) return construction;
    const result: GeoArc = { ...arc, id: crypto.randomUUID(), center: pointMap.get(arc.center) ?? arc.center, start: pointMap.get(arc.start) ?? arc.start, end: pointMap.get(arc.end) ?? arc.end };
    transform.resultIds = [result.id];
    return { ...next, arcs: [...construction.arcs, result], transforms: [...construction.transforms, transform] };
  }
  if (selected.kind === "text") {
    const note = construction.texts.find((item) => item.id === selected.id);
    if (!note) return construction;
    const result: GeoTextNote = { ...note, id: crypto.randomUUID(), point: pointMap.get(note.point) ?? note.point, text: `${note.text}'` };
    transform.resultIds = [result.id];
    return { ...next, texts: [...construction.texts, result], transforms: [...construction.transforms, transform] };
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
  if (selected.kind === "arc") {
    const arc = construction.arcs.find((item) => item.id === selected.id);
    return arc ? [arc.center, arc.start, arc.end] : [];
  }
  if (selected.kind === "text") {
    const note = construction.texts.find((item) => item.id === selected.id);
    return note ? [note.point] : [];
  }
  return [];
}

function transformCoordinates(point: { x: number; y: number }, center: { x: number; y: number }, type: GeoTransformKind, options: { line?: GeoLine | null; points?: GeoPoint[]; vector?: { x: number; y: number } } = {}) {
  if (type === "translation") return { x: point.x + (options.vector?.x ?? 120), y: point.y + (options.vector?.y ?? 0) };
  if (type === "reflection-line" && options.line && options.points) return reflectPointAcrossLine(point, options.line, options.points);
  if (type === "reflection-point") return { x: center.x * 2 - point.x, y: center.y * 2 - point.y };
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

function circumcenter(a: GeoPoint, b: GeoPoint, c: GeoPoint) {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 0.001) return null;
  const ux = ((a.x * a.x + a.y * a.y) * (b.y - c.y) + (b.x * b.x + b.y * b.y) * (c.y - a.y) + (c.x * c.x + c.y * c.y) * (a.y - b.y)) / d;
  const uy = ((a.x * a.x + a.y * a.y) * (c.x - b.x) + (b.x * b.x + b.y * b.y) * (a.x - c.x) + (c.x * c.x + c.y * c.y) * (b.x - a.x)) / d;
  return { x: ux, y: uy };
}

function reflectPointAcrossLine(point: { x: number; y: number }, line: GeoLine, points: GeoPoint[]) {
  const a = pointById(points, line.a), b = pointById(points, line.b);
  if (!a || !b) return point;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy || 1;
  const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq;
  const projection = { x: a.x + t * dx, y: a.y + t * dy };
  return { x: projection.x * 2 - point.x, y: projection.y * 2 - point.y };
}

function arcAngles(center: GeoPoint, start: GeoPoint, end: GeoPoint, semicircle = false) {
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  let endAngle = Math.atan2(end.y - center.y, end.x - center.x);
  let delta = endAngle - startAngle;
  while (delta <= 0) delta += Math.PI * 2;
  if (!semicircle && delta > Math.PI * 2) delta %= Math.PI * 2;
  if (semicircle) delta = Math.PI;
  endAngle = startAngle + delta;
  return { startAngle, endAngle, delta };
}

function arcPath(center: GeoPoint, start: GeoPoint, end: GeoPoint, semicircle = false) {
  const radius = distance(center, start);
  const { endAngle, delta } = arcAngles(center, start, end, semicircle);
  const actualEnd = semicircle ? { x: center.x + Math.cos(endAngle) * radius, y: center.y + Math.sin(endAngle) * radius } : end;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${delta > Math.PI ? 1 : 0} 1 ${actualEnd.x} ${actualEnd.y}`;
}

function normalizedArcMidAngle(center: GeoPoint, start: GeoPoint, end: GeoPoint, semicircle = false) {
  const { startAngle, delta } = arcAngles(center, start, end, semicircle);
  return startAngle + delta / 2;
}

function arcCentralAngle(center: GeoPoint, start: GeoPoint, end: GeoPoint, semicircle = false) {
  return arcAngles(center, start, end, semicircle).delta * 180 / Math.PI;
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
