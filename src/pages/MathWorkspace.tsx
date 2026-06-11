import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Box, ChevronDown, Circle, Download, Eraser, FunctionSquare, LineChart, Magnet, MousePointer2, Move, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Pentagon, Plus, Presentation, Rotate3D, RotateCcw, Save, Search, Slash, Trash2, ZoomIn, ZoomOut, type LucideIcon } from "lucide-react";
import { MouseEvent as ReactMouseEvent, PointerEvent, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import MathKeyboardInput from "../components/math-keyboard/MathKeyboardInput";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { roundTo } from "../utils/math";
import { symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicSimplify, symbolicSolve, trySymbolic } from "../utils/symbolic";
import { commandExamplesFor, commandRegistrySummary, normalizeCommandName, resolveCommandSpec } from "../workspace/commandRegistry";
import { createAnimationAction, describeTransformAction, parseStyleAction, parseTransformCommand } from "../workspace/actionCommandKernel";
import { assessConstruction, buildBeyondGeoGebraUnitPackages, commandDocsForPackages, objectAwareTutorResponse, productionReadinessPlan, validateGuidedTaskResponse, type UnitLabPackage } from "../workspace/beyondGeoGebraKernel";
import { criticalGapImplementationPhases } from "../workspace/criticalGapPhases";
import { buildDynamicObjectGraph, graphHealthSummary, type DynamicObjectGraph, type DynamicObjectKind } from "../workspace/dynamicObjectKernel";
import { sampleGraph } from "../workspace/graphSampler";
import { contextMenuForObject, createProtocolPlaybackPlan, createSliderObject, exportPresets, imageWorkflowSpec, rankSnapCandidates, styleBarForObject, tabletControlSpec, type ExportPreset, type ImageWorkflowSpec, type ProtocolPlaybackPlan, type SliderObject, type SnapCandidate, type StyleBarControl, type TabletControlSpec, type WorkflowObjectType } from "../workspace/highPriorityWorkflowKernel";
import {
  circle as kernelCircle,
  distanceBetween as kernelDistance,
  intersectObjects as kernelIntersectObjects,
  line as kernelLine,
  parseConicEquation,
  parseKernelPoint,
  point as kernelPoint,
  polygonArea as kernelPolygonArea,
  polygonPerimeter as kernelPolygonPerimeter,
  proofHintsForRelation,
  ray as kernelRay,
  relationBetween,
  segment as kernelSegment,
  vector as kernelVector,
  type KernelObject,
  type KernelPoint,
} from "../workspace/geometry2dKernel";
import {
  cone3 as kernelCone3,
  createTransformGizmo,
  cylinder3 as kernelCylinder3,
  intersect3,
  line3 as kernelLine3,
  object3Measurement,
  parsePlaneEquation,
  parsePoint3,
  parseVector3,
  plane3 as kernelPlane3,
  point3 as kernelPoint3,
  sphere3 as kernelSphere3,
  type Object3,
  type Point3,
  type TransformMode3,
} from "../workspace/geometry3dKernel";
import { createCasCard, createDynamicTable, createListObject } from "../workspace/casTableKernel";
import { clearOfflineProjectLibrary, readOfflineProjectLibrary, removeOfflineProject, saveOfflineProject, type OfflineProjectEntry } from "../workspace/offlineProjectLibrary";
import { evaluateSpreadsheetGrid, fillDownFormula, rangeToCsv } from "../workspace/spreadsheetKernel";
import { syllabusWorkspaceTemplates, type GuidedActivityPhase, type SyllabusWorkspaceTemplate } from "../workspace/syllabusWorkspaceTemplates";
import { runWorkspaceQaSuite, type WorkspaceQaReport } from "../workspace/workspaceQaSuite";

type ResultTableRow = { x: number; y: number; label?: string };
type ResultCard = { id: string; input: string; interpretation: string; result: string; detail?: string; steps?: string[]; table?: ResultTableRow[]; related?: string[]; graphExpression?: string };
type PlotKind = "function" | "inequality" | "scatter" | "regression" | "implicit" | "parametric" | "polar" | "piecewise";
type PlotItem = { id: string; expression: string; color: string; name?: string; kind?: PlotKind; points?: ResultTableRow[]; visible?: boolean; locked?: boolean; trace?: boolean };
type SpreadsheetCellGrid = string[][];
type GeometryTool = "select" | "point" | "segment" | "ray" | "vector" | "line" | "circle" | "polygon" | "angle" | "parallel" | "perpendicular" | "midpoint" | "fixed-length" | "circle-radius" | "circle-3-points" | "on-circle" | "intersect" | "perpendicular-bisector" | "angle-bisector" | "tangent" | "polar" | "locus" | "regular-polygon" | "sector" | "arc" | "compass" | "mirror" | "rotate" | "dilate" | "translate" | "show-hide" | "lock" | "freehand" | "text" | "image" | "move-canvas" | "zoom" | "triangle" | "rectangle" | "shape-circle" | "parabola" | "ellipse" | "hyperbola" | "reflect" | "trace" | "stop-trace" | "clear-trace" | "delete" | "redo" | "reset" | "save" | "load";
type GeoStyle = { color?: string; fill?: string; strokeWidth?: number; size?: number; visible?: boolean; trace?: boolean; label?: string; opacity?: number; labelMode?: "name" | "value" | "both" | "hidden" };
type GeoPoint = { id: string; x: number; y: number; label: string; style?: GeoStyle };
type GeoLine = { id: string; a: string; b: string; style?: GeoStyle };
type GeoCircle = { id: string; center: string; edge: string; style?: GeoStyle };
type GeoPolygon = { id: string; points: string[]; style?: GeoStyle };
type GeoArc = { id: string; center: string; start: string; end: string; sector?: boolean; style?: GeoStyle };
type GeoLocus = { id: string; label: string; points: { x: number; y: number }[]; style?: GeoStyle };
type WorkspaceImage = { id: string; name: string; src: string; x: number; y: number; width: number; height: number; opacity: number; locked?: boolean; visible?: boolean };
type GeoConstraint =
  | { id: string; type: "parallel" | "perpendicular"; sourceLine: string; throughPoint: string; line: string }
  | { id: string; type: "midpoint"; a: string; b: string; point: string }
  | { id: string; type: "fixed-length"; anchor: string; point: string; length: number }
  | { id: string; type: "on-circle"; point: string; circle: string }
  | { id: string; type: "intersection"; first: string; second: string; point: string };
type Construction = { points: GeoPoint[]; lines: GeoLine[]; circles: GeoCircle[]; polygons: GeoPolygon[]; arcs: GeoArc[]; loci: GeoLocus[]; constraints: GeoConstraint[] };
type GeometryObjectType = "point" | "line" | "circle" | "polygon" | "arc" | "locus";
type SelectedGeometryObject = { type: GeometryObjectType; id: string };
type SurfaceKind = "paraboloid" | "saddle" | "wave" | "plane" | "ripple" | "cone-surface" | "custom-z" | "parametric" | "implicit";
type SolidKind = "cube" | "cuboid" | "sphere" | "ellipsoid" | "hemisphere" | "cylinder" | "cone" | "frustum" | "torus" | "tube" | "capsule" | "prism" | "pyramid" | "tetrahedron" | "octahedron" | "dodecahedron" | "wedge" | "polyhedron";
type ThreeObjectId = "surface" | "solid" | "slice" | "point" | "vector" | "line3d" | "plane3d" | "sphere3d" | "cone3d" | "cylinder3d" | "prism3d" | "pyramid3d" | "polyhedron3d";
type Transform3D = { position: [number, number, number]; rotation: [number, number, number]; scale: number; visible: boolean; color: string; name?: string; locked?: boolean; trace?: boolean; dimensions?: [number, number, number]; opacity?: number; material?: "matte" | "glass" | "wireframe" };
type Added3DRenderKind = "surface" | "solid" | "slice" | "point" | "vector" | "line3d" | "plane3d";
type Added3DObject = { id: string; label: string; baseId: ThreeObjectId; render: Added3DRenderKind; solid?: SolidKind; surface?: SurfaceKind; transform: Transform3D };
type CameraPreset3D = "free" | "top" | "front" | "right" | "isometric";
type AlgebraObjectKind = "function" | "point" | "line" | "circle" | "polygon" | "arc" | "locus" | "3d";
type AlgebraObjectRef = { kind: AlgebraObjectKind; id: string };
type ContextMenuState = { x: number; y: number; target: SelectedGeometryObject | { type: "3d"; id: string } | { type: "algebra"; ref: AlgebraObjectRef } };
type WorkspaceView = "graph" | "geometry" | "3d" | "data" | "teach";
type ConstructionStep = { id: string; label: string; detail: string; createdAt: number; snapshot: Pick<WorkspaceSnapshot, "plots" | "construction" | "transforms3d" | "added3dObjects"> };
type ActivityJournalEntry = { templateId: string; phase: GuidedActivityPhase; response: string; selfCheck: "not-started" | "revisit" | "got-it"; confidence: number; updatedAt: number };
type WorkspaceSnapshot = {
  input: string;
  results: ResultCard[];
  plots: PlotItem[];
  construction: Construction;
  lockedGeometryIds?: string[];
  surface: SurfaceKind;
  surfaceExpression?: string;
  cameraPreset3d?: CameraPreset3D;
  sceneAnimationSpeed?: number;
  solid: SolidKind;
  surfaceScale: number;
  height3d: number;
  crossSection: number;
  showSurface: boolean;
  showSolid: boolean;
  autoRotate3d: boolean;
  zoom3d: number;
  transforms3d: Record<ThreeObjectId, Transform3D>;
  added3dObjects?: Added3DObject[];
  images?: WorkspaceImage[];
  spreadsheet?: SpreadsheetCellGrid;
  tableRange?: { start: number; end: number; step: number };
  guidedMode?: boolean;
  guidedPhase?: GuidedActivityPhase;
  teachingMode?: boolean;
  revealStep?: number;
  controlsLocked?: boolean;
  highContrastMode?: boolean;
  performanceMode?: boolean;
  protocol?: ConstructionStep[];
  activityJournal?: Record<string, ActivityJournalEntry>;
  presentationNotes?: string;
};

const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#14b8a6"];
const regressionSeed: ResultTableRow[] = [{ x: -4, y: -5.6 }, { x: -2, y: -2.2 }, { x: 0, y: 0.7 }, { x: 2, y: 4.1 }, { x: 4, y: 7.4 }];
const initialSpreadsheet: SpreadsheetCellGrid = [
  ["x", "y", "note", ""],
  ["-4", "-5.6", "sample", ""],
  ["-2", "-2.2", "", ""],
  ["0", "0.7", "", ""],
  ["2", "4.1", "", ""],
  ["4", "7.4", "=A2+B2", ""],
];
const initialConstruction: Construction = { points: [], lines: [], circles: [], polygons: [], arcs: [], loci: [], constraints: [] };
const defaultTransforms3d: Record<ThreeObjectId, Transform3D> = {
  surface: { name: "surface", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, visible: true, color: "#22d3ee", opacity: 0.45, material: "glass" },
  solid: { name: "solid", position: [3, 0, 2.6], rotation: [0, 0, 0], scale: 1, visible: true, color: "#8b5cf6", dimensions: [2.5, 2.5, 2.5], opacity: 0.78, material: "glass" },
  slice: { name: "slice", position: [0, 0, 0], rotation: [-90, 0, 0], scale: 1, visible: true, color: "#f59e0b", dimensions: [5.5, 5.5, 0.02], opacity: 0.22, material: "glass" },
  point: { name: "P", position: [2.2, 1.4, 1.8], rotation: [0, 0, 0], scale: 1, visible: true, color: "#f59e0b", dimensions: [0.24, 0.24, 0.24], opacity: 1, material: "matte" },
  vector: { name: "v", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, visible: true, color: "#f59e0b", dimensions: [1, 1, 1], opacity: 1, material: "matte" },
  line3d: { name: "l", position: [-1.8, 0.4, 1.8], rotation: [0, 35, 0], scale: 1, visible: false, color: "#38bdf8", dimensions: [4, 0.04, 0.04], opacity: 1, material: "matte" },
  plane3d: { name: "plane", position: [0, 0.8, 0], rotation: [-20, 0, 0], scale: 1, visible: false, color: "#22c55e", dimensions: [4, 4, 0.02], opacity: 0.28, material: "glass" },
  sphere3d: { name: "sphere", position: [-2.4, 1.2, -1.8], rotation: [0, 0, 0], scale: 1, visible: false, color: "#06b6d4", dimensions: [1.4, 1.4, 1.4], opacity: 0.72, material: "glass" },
  cone3d: { name: "cone", position: [2.4, 1, -1.8], rotation: [0, 0, 0], scale: 1, visible: false, color: "#f97316", dimensions: [1.4, 2.2, 1.4], opacity: 0.78, material: "glass" },
  cylinder3d: { name: "cylinder", position: [0, 1, -2.4], rotation: [0, 0, 0], scale: 1, visible: false, color: "#a855f7", dimensions: [1.2, 2.2, 1.2], opacity: 0.78, material: "glass" },
  prism3d: { name: "prism", position: [-2.6, 0.9, 1], rotation: [0, 20, 0], scale: 1, visible: false, color: "#10b981", dimensions: [1.8, 1.5, 1.8], opacity: 0.8, material: "glass" },
  pyramid3d: { name: "pyramid", position: [2.6, 0.9, 1], rotation: [0, -20, 0], scale: 1, visible: false, color: "#eab308", dimensions: [1.8, 1.8, 1.8], opacity: 0.82, material: "glass" },
  polyhedron3d: { name: "polyhedron", position: [0, 1.2, 2.8], rotation: [20, 20, 0], scale: 1, visible: false, color: "#ec4899", dimensions: [1.4, 1.4, 1.4], opacity: 0.82, material: "wireframe" },
};
const threeObjectLabels: Record<ThreeObjectId, string> = { surface: "Surface mesh", solid: "Solid shape", slice: "Cross-section", point: "Point", vector: "Vector", line3d: "Line", plane3d: "Plane", sphere3d: "Sphere", cone3d: "Cone", cylinder3d: "Cylinder", prism3d: "Prism", pyramid3d: "Pyramid", polyhedron3d: "Polyhedron" };
const threeObjectSolidMap: Partial<Record<ThreeObjectId, SolidKind>> = { solid: "cube", sphere3d: "sphere", cone3d: "cone", cylinder3d: "cylinder", prism3d: "prism", pyramid3d: "pyramid", polyhedron3d: "polyhedron" };
const threeBaseIds = Object.keys(defaultTransforms3d) as ThreeObjectId[];
const isBase3dId = (id: string): id is ThreeObjectId => id in defaultTransforms3d;
const addedRenderKindForBase = (id: ThreeObjectId): Added3DRenderKind => {
  if (id === "surface") return "surface";
  if (id === "slice") return "slice";
  if (id === "point") return "point";
  if (id === "vector") return "vector";
  if (id === "line3d") return "line3d";
  if (id === "plane3d") return "plane3d";
  return "solid";
};
const geometryDefaultColor: Record<GeometryObjectType, string> = { point: "#06b6d4", line: "#8b5cf6", circle: "#06b6d4", polygon: "#f59e0b", arc: "#14b8a6", locus: "#ec4899" };
const examples = ["plot sin(x)", "Root[x^2-4]", "Extremum[x^2-4*x+1]", "Intersect[x^2, 2*x+3]", "Derivative[x^3-2*x]", "Integral[3*x^2]", "Factor[x^2-5*x+6]", "Expand[(x+2)(x+3)]", "Solve[x^2-5*x+6=0]", "Substitute[x^2+a, a=3]", "Sequence[n^2, n, 1, 6]", "Table[sin(x), -3, 3, 0.5]"];
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

export default function MathWorkspace({ initialView = "graph", singleView = false }: { initialView?: WorkspaceView; singleView?: boolean }) {
  const [input, setInput] = useState("plot sin(x)");
  const [results, setResults] = useState<ResultCard[]>([]);
  const [plots, setPlots] = useState<PlotItem[]>([{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }]);
  const [tool, setTool] = useState<GeometryTool>("select");
  const [construction, setConstruction] = useState<Construction>(initialConstruction);
  const [selectedGeometry, setSelectedGeometry] = useState<SelectedGeometryObject | null>(null);
  const [workspaceImages, setWorkspaceImages] = useState<WorkspaceImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [dragPointId, setDragPointId] = useState<string | null>(null);
  const [dragImageId, setDragImageId] = useState<string | null>(null);
  const [dragGeometry, setDragGeometry] = useState<{ object: SelectedGeometryObject; last: { x: number; y: number } } | null>(null);
  const [lockedGeometryIds, setLockedGeometryIds] = useState<string[]>([]);
  const [polygonDraft, setPolygonDraft] = useState<string[]>([]);
  const [showGeometryUnits, setShowGeometryUnits] = useState(false);
  const [surface, setSurface] = useState<SurfaceKind>("paraboloid");
  const [surfaceExpression, setSurfaceExpression] = useState("sin(x) * cos(y)");
  const [solid, setSolid] = useState<SolidKind>("cube");
  const [surfaceScale, setSurfaceScale] = useState(1);
  const [height3d, setHeight3d] = useState(2.5);
  const [crossSection, setCrossSection] = useState(0);
  const [showSurface, setShowSurface] = useState(true);
  const [showSolid, setShowSolid] = useState(true);
  const [autoRotate3d, setAutoRotate3d] = useState(true);
  const [sceneAnimationSpeed, setSceneAnimationSpeed] = useState(0.18);
  const [cameraPreset3d, setCameraPreset3d] = useState<CameraPreset3D>("isometric");
  const [zoom3d, setZoom3d] = useState(1);
  const [selected3d, setSelected3d] = useState<string>("solid");
  const [controls3dOpen, setControls3dOpen] = useState(true);
  const [inspector3dOpen, setInspector3dOpen] = useState(true);
  const [transforms3d, setTransforms3d] = useState<Record<ThreeObjectId, Transform3D>>(defaultTransforms3d);
  const [added3dObjects, setAdded3dObjects] = useState<Added3DObject[]>([]);
  const [drag3d, setDrag3d] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [formulaSearch, setFormulaSearch] = useState("");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>(initialView);
  const [teachingMode, setTeachingMode] = useState(false);
  const [guidedMode, setGuidedMode] = useState(false);
  const [guidedPhase, setGuidedPhase] = useState<GuidedActivityPhase>("predict");
  const [activeTemplate, setActiveTemplate] = useState<SyllabusWorkspaceTemplate>(syllabusWorkspaceTemplates[0]);
  const [activityJournal, setActivityJournal] = useState<Record<string, ActivityJournalEntry>>({});
  const [presentationNotes, setPresentationNotes] = useState("");
  const [revealStep, setRevealStep] = useState(1);
  const [controlsLocked, setControlsLocked] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [qaReport, setQaReport] = useState<WorkspaceQaReport>(() => runWorkspaceQaSuite());
  const [projectLibrary, setProjectLibrary] = useState<OfflineProjectEntry<WorkspaceSnapshot>[]>(() => readOfflineProjectLibrary<WorkspaceSnapshot>());
  const [projectStatus, setProjectStatus] = useState("Offline project library ready.");
  const [protocol, setProtocol] = useState<ConstructionStep[]>([]);
  const [undoStack, setUndoStack] = useState<ConstructionStep[]>([]);
  const [redoStack, setRedoStack] = useState<ConstructionStep[]>([]);
  const [selectedAlgebra, setSelectedAlgebra] = useState<AlgebraObjectRef | null>(null);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetCellGrid>(initialSpreadsheet);
  const [tableStart, setTableStart] = useState(-4);
  const [tableEnd, setTableEnd] = useState(4);
  const [tableStep, setTableStep] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const graphExportRef = useRef<HTMLDivElement>(null);
  const geometryExportRef = useRef<SVGSVGElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const routeStateAppliedRef = useRef("");

  useEffect(() => {
    document.documentElement.classList.toggle("workspace-high-contrast", highContrastMode);
    return () => document.documentElement.classList.remove("workspace-high-contrast");
  }, [highContrastMode]);

  useEffect(() => {
    setWorkspaceView(initialView);
  }, [initialView]);

  useEffect(() => {
    const match = window.location.hash.match(/project=([^&]+)/);
    if (!match) return;
    try {
      restoreWorkspaceSnapshot(JSON.parse(decodeURIComponent(escape(atob(match[1])))) as WorkspaceSnapshot);
      setProjectStatus("Share URL project loaded.");
    } catch {
      setProjectStatus("Could not load share URL project.");
    }
  }, []);

  const filteredFormulas = useMemo(() => {
    const query = formulaSearch.trim().toLowerCase();
    return formulaLibrary.filter((item) => !query || [item.topic, item.title, item.formula].join(" ").toLowerCase().includes(query));
  }, [formulaSearch]);

  const workspaceObjects = useMemo(() => buildAlgebraObjects(plots, construction, transforms3d, lockedGeometryIds, added3dObjects), [plots, construction, transforms3d, lockedGeometryIds, added3dObjects]);
  const selected3dTransform = useMemo(() => isBase3dId(selected3d) ? transforms3d[selected3d] : added3dObjects.find((object) => object.id === selected3d)?.transform ?? transforms3d.solid, [added3dObjects, selected3d, transforms3d]);
  const dynamicGraph = useMemo(() => buildDynamicObjectGraph(workspaceObjects.map((object) => ({
    id: `${object.ref.kind}:${object.ref.id}`,
    name: object.name,
    kind: objectKindForKernel(object.ref.kind),
    definition: object.definition,
    visible: object.visible,
    locked: object.locked,
    trace: object.trace,
    dependencies: object.dependencies,
  }))), [workspaceObjects]);
  const dynamicHealth = useMemo(() => graphHealthSummary(dynamicGraph), [dynamicGraph]);
  const commandSummary = useMemo(() => commandRegistrySummary(), []);
  const selectedWorkflowType = useMemo<WorkflowObjectType>(() => {
    if (selectedImageId) return "image";
    if (selectedGeometry) return selectedGeometry.type;
    if (selectedAlgebra) return selectedAlgebra.kind === "3d" ? "3d" : selectedAlgebra.kind === "point" || selectedAlgebra.kind === "line" || selectedAlgebra.kind === "circle" || selectedAlgebra.kind === "polygon" || selectedAlgebra.kind === "arc" || selectedAlgebra.kind === "locus" ? selectedAlgebra.kind : "algebra";
    return "algebra";
  }, [selectedAlgebra, selectedGeometry, selectedImageId]);
  const protocolPlan = useMemo(() => createProtocolPlaybackPlan(protocol.map((step) => ({
    id: step.id,
    label: step.label,
    detail: step.detail,
    createdAt: step.createdAt,
    visible: true,
  })), { cursor: Math.max(0, Math.min(protocol.length - 1, 5)), hiddenColumns: ["createdAt"] }), [protocol]);
  const workflowStyleControls = useMemo(() => styleBarForObject(selectedWorkflowType), [selectedWorkflowType]);
  const exportPresetList = useMemo(() => exportPresets(), []);
  const imageWorkflow = useMemo(() => imageWorkflowSpec(), []);
  const tabletWorkflow = useMemo(() => tabletControlSpec("touch"), []);
  const sliderPreview = useMemo(() => createSliderObject("a", { value: sceneAnimationSpeed, min: 0.1, max: 3, step: 0.1, playing: autoRotate3d, boundObjects: ["surface", "solid", "slice"] }), [autoRotate3d, sceneAnimationSpeed]);
  const snapPreview = useMemo(() => rankSnapCandidates({ x: 320, y: 210 }, [
    ...construction.points.slice(0, 8).map((item) => ({ id: item.id, label: item.label, priority: 80, x: item.x, y: item.y, constraint: "point" as const })),
    { id: "grid-origin", label: "Grid origin", priority: 40, x: 320, y: 210, constraint: "grid" as const },
  ]), [construction.points]);
  const beyondPackages = useMemo(() => buildBeyondGeoGebraUnitPackages(syllabusWorkspaceTemplates), []);
  const activeBeyondPackage = useMemo(() => beyondPackages.find((item) => item.templateId === activeTemplate.id) ?? beyondPackages[0], [activeTemplate.id, beyondPackages]);
  const readinessPlan = useMemo(() => productionReadinessPlan(), []);
  const commandDocs = useMemo(() => commandDocsForPackages(beyondPackages), [beyondPackages]);
  const activeTask = useMemo(() => activeBeyondPackage.guidedTasks.find((task) => task.phase === guidedPhase) ?? activeBeyondPackage.guidedTasks[0], [activeBeyondPackage, guidedPhase]);
  const activeTaskEntry = activityJournal[activityJournalKey(activeTemplate.id, guidedPhase)] ?? defaultActivityJournalEntry(activeTemplate.id, guidedPhase);
  const activeTaskValidation = useMemo(() => validateGuidedTaskResponse(activeTask, activeTaskEntry.response), [activeTask, activeTaskEntry.response]);
  const assessmentPreview = useMemo(() => assessConstruction(activeBeyondPackage, workspaceObjects.map((object) => ({ kind: object.ref.kind, definition: object.definition, visible: object.visible }))), [activeBeyondPackage, workspaceObjects]);
  const tutorPreview = useMemo(() => objectAwareTutorResponse(activeBeyondPackage, "why did this move", workspaceObjects[0]?.definition ?? activeBeyondPackage.interactiveLab), [activeBeyondPackage, workspaceObjects]);

  const captureStep = (label: string, detail: string): ConstructionStep => ({
    id: crypto.randomUUID(),
    label,
    detail,
    createdAt: Date.now(),
    snapshot: { plots, construction, transforms3d, added3dObjects },
  });

  const recordWorkspaceStep = (label: string, detail: string) => {
    const step = captureStep(label, detail);
    setUndoStack((current) => [step, ...current].slice(0, 80));
    setRedoStack([]);
    setProtocol((current) => [{ ...step, snapshot: { plots, construction, transforms3d, added3dObjects } }, ...current].slice(0, 120));
  };

  const restoreProtocolSnapshot = (step: ConstructionStep) => {
    setPlots(step.snapshot.plots ?? []);
    setConstruction(normalizeConstruction(step.snapshot.construction ?? initialConstruction));
    setTransforms3d({ ...defaultTransforms3d, ...(step.snapshot.transforms3d ?? {}) });
    setAdded3dObjects(step.snapshot.added3dObjects ?? []);
  };

  const undoWorkspace = () => {
    const [step, ...rest] = undoStack;
    if (!step) return undoConstruction();
    const currentStep = captureStep(`Redo ${step.label}`, "State before undo.");
    setRedoStack((current) => [currentStep, ...current]);
    setUndoStack(rest);
    restoreProtocolSnapshot(step);
  };

  const redoWorkspace = () => {
    const [step, ...rest] = redoStack;
    if (!step) return;
    const currentStep = captureStep(`Undo ${step.label}`, "State before redo.");
    setUndoStack((current) => [currentStep, ...current]);
    setRedoStack(rest);
    restoreProtocolSnapshot(step);
  };

  const addResultCard = (analysis: ResultCard) => setResults((current) => [analysis, ...current].slice(0, 12));

  const applyDirectDefinitionCommand = (raw: string) => {
    const functionMatch = raw.match(/^([a-z]\w*)\s*\(\s*x\s*\)\s*=\s*(.+)$/i);
    if (functionMatch) {
      const [, name, expression] = functionMatch;
      recordWorkspaceStep("Define function", `${name}(x) = ${expression}`);
      setPlots((current) => [{ id: crypto.randomUUID(), expression: expression.trim(), name, color: colors[current.length % colors.length], kind: inferPlotKind(expression), visible: true }, ...current].slice(0, 10));
      addResultCard({
        id: crypto.randomUUID(),
        input: raw,
        interpretation: "Live function definition",
        result: `${name}(x) = ${expression.trim()}`,
        detail: "The function was added to the graph and algebra object list with an editable definition.",
        related: [`Derivative[${expression.trim()}]`, `Table[${expression.trim()}, -5, 5, 1]`],
      });
      setProjectStatus(`${name}(x) linked to graph, algebra panel, inspector, and export state.`);
      return true;
    }

    const point3dMatch = raw.match(/^([A-Z]\w*)\s*=\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/);
    if (point3dMatch) {
      const [, name, xRaw, yRaw, zRaw] = point3dMatch;
      const position: [number, number, number] = [Number(xRaw), Number(yRaw), Number(zRaw)];
      recordWorkspaceStep("Define 3D point", `${name}=(${position.join(", ")})`);
      setSelected3d("point");
      setShowSurface(true);
      setTransforms3d((current) => ({ ...current, point: { ...current.point, name, position, visible: true } }));
      addResultCard({
        id: crypto.randomUUID(),
        input: raw,
        interpretation: "Live 3D point definition",
        result: `${name}=(${position.join(", ")})`,
        detail: "The 3D point is now selectable, draggable, editable, and linked to the 3D inspector.",
      });
      setProjectStatus(`${name} created as a live 3D object.`);
      return true;
    }

    const point2dMatch = raw.match(/^([A-Z]\w*)\s*=\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/);
    if (point2dMatch) {
      const [, label, xRaw, yRaw] = point2dMatch;
      const math = { x: Number(xRaw), y: Number(yRaw) };
      const board = mathToBoardPoint(math.x, math.y);
      const id = crypto.randomUUID();
      recordWorkspaceStep("Define point", `${label}=(${math.x}, ${math.y})`);
      setConstruction((current) => solveConstruction({ ...current, points: [...current.points, { id, ...board, label }] }, id));
      setSelectedGeometry({ type: "point", id });
      addResultCard({
        id: crypto.randomUUID(),
        input: raw,
        interpretation: "Live point definition",
        result: `${label}=(${math.x}, ${math.y})`,
        detail: "The point was placed on the geometry board and can be edited from the algebra panel or inspector.",
      });
      setProjectStatus(`${label} created as a live geometry point.`);
      return true;
    }

    const circleEquationMatch = raw.match(/^([a-z]\w*)\s*:\s*x\^2\s*\+\s*y\^2\s*=\s*(\d+(?:\.\d+)?)$/i);
    if (circleEquationMatch) {
      const [, name, radiusSquaredRaw] = circleEquationMatch;
      const radius = Math.sqrt(Number(radiusSquaredRaw));
      const center = crypto.randomUUID();
      const edge = crypto.randomUUID();
      const circle = crypto.randomUUID();
      recordWorkspaceStep("Define circle equation", `${name}: x^2+y^2=${radiusSquaredRaw}`);
      setConstruction((current) => solveConstruction({
        ...current,
        points: [
          ...current.points,
          { id: center, ...mathToBoardPoint(0, 0), label: "O" },
          { id: edge, ...mathToBoardPoint(radius, 0), label: "R" },
        ],
        circles: [...current.circles, { id: circle, center, edge, style: { label: name } }],
      }));
      setSelectedGeometry({ type: "circle", id: circle });
      addResultCard({
        id: crypto.randomUUID(),
        input: raw,
        interpretation: "Live circle definition",
        result: `${name}: center=(0,0), r=${roundTo(radius, 4)}`,
        detail: "The equation became a selectable circle with editable radius, style, and algebra definition.",
      });
      setProjectStatus(`${name} created as a live circle object.`);
      return true;
    }

    const surfaceMatch = raw.match(/^(?:surface\s+)?z\s*=\s*(.+)$/i);
    if (surfaceMatch) {
      const expression = surfaceMatch[1].trim();
      recordWorkspaceStep("Define 3D surface", `z = ${expression}`);
      setSurface("custom-z");
      setSurfaceExpression(expression);
      setShowSurface(true);
      setSelected3d("surface");
      addResultCard({
        id: crypto.randomUUID(),
        input: raw,
        interpretation: "Live 3D surface definition",
        result: `z = ${expression}`,
        detail: "The expression is rendered as an editable browser-only 3D surface.",
      });
      setProjectStatus("Custom 3D surface linked to the 3D scene and inspector.");
      return true;
    }

    return false;
  };

  const executeWorkspaceCommand = (rawInput: string) => {
    const raw = rawInput.trim();
    if (!raw) return;
    if (applyDirectDefinitionCommand(raw)) return;
    const analysis = interpretInput(raw);
    addResultCard(analysis);
    if (analysis.interpretation === "2D plot") {
      recordWorkspaceStep("Add function", raw);
      const expression = normalizePlotExpression(raw);
      setPlots((current) => [{ id: crypto.randomUUID(), expression, name: nextFunctionName(current), color: colors[current.length % colors.length], kind: inferPlotKind(expression), visible: true }, ...current].slice(0, 8));
    }
    if (analysis.graphExpression) {
      recordWorkspaceStep("Add CAS graph link", analysis.graphExpression);
      setPlots((current) => [{ id: crypto.randomUUID(), expression: analysis.graphExpression!, name: nextFunctionName(current), color: colors[current.length % colors.length], kind: inferPlotKind(analysis.graphExpression!), visible: true }, ...current].slice(0, 10));
    }
  };

  const runInput = () => executeWorkspaceCommand(input);

  const addPoint = (x: number, y: number) => {
    const id = crypto.randomUUID();
    const snapped = snapBoardPoint({ x, y }, construction);
    const point: GeoPoint = { id, x: snapped.x, y: snapped.y, label: String.fromCharCode(65 + construction.points.length) };
    recordWorkspaceStep("Create point", `${point.label} = (${roundTo(point.x, 1)}, ${roundTo(point.y, 1)})`);
    setConstruction((current) => solveConstruction({ ...current, points: [...current.points, point] }));
    return id;
  };

  const handleImageUpload = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProjectStatus("Choose a PNG, JPG, GIF, SVG, or WebP image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result ?? "");
      const image = new Image();
      image.onload = () => {
        const maxWidth = 240;
        const ratio = image.width > 0 ? image.height / image.width : 0.65;
        const width = Math.min(maxWidth, Math.max(120, image.width || maxWidth));
        const next: WorkspaceImage = {
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^.]+$/, "") || "Image",
          src,
          x: 200,
          y: 120,
          width,
          height: Math.max(80, width * ratio),
          opacity: 0.92,
          visible: true,
        };
        recordWorkspaceStep("Add image", `${next.name} added to geometry board.`);
        setWorkspaceImages((current) => [next, ...current]);
        setSelectedImageId(next.id);
        setSelectedGeometry(null);
        setProjectStatus(`${next.name} added to the geometry board.`);
      };
      image.onerror = () => setProjectStatus("Could not read that image file.");
      image.src = src;
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleBoardPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (controlsLocked) return;
    setContextMenu(null);
    if (event.button === 2) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (event.pointerType === "touch") event.preventDefault();
    const target = event.target as Element;
    const imageId = target.getAttribute("data-image-id");
    if (imageId) {
      setSelectedImageId(imageId);
      setSelectedGeometry(null);
      const image = workspaceImages.find((item) => item.id === imageId);
      if (image?.locked) return;
      recordWorkspaceStep("Move image", `${image?.name ?? "Image"} dragged on geometry board.`);
      setDragImageId(imageId);
      return;
    }
    const pointId = target.getAttribute("data-point-id");
    if (pointId) {
      setSelectedGeometry({ type: "point", id: pointId });
      if (lockedGeometryIds.includes(pointId)) return;
      if (tool === "select") {
        recordWorkspaceStep("Move point", `${labelForPoint(construction, pointId)} dragged on geometry board.`);
        setDragPointId(pointId);
      }
      else handlePointPick(pointId);
      return;
    }
    const objectType = target.getAttribute("data-object-type") as GeometryObjectType | null;
    const objectId = target.getAttribute("data-object-id");
    if (objectType && objectId && tool === "select") {
      const object = { type: objectType, id: objectId };
      setSelectedGeometry(object);
      const point = clientToBoard(event);
      if (point && !lockedGeometryIds.includes(objectId)) {
        recordWorkspaceStep("Move object", `${objectType} moved on geometry board.`);
        setDragGeometry({ object, last: point });
      }
      return;
    }
    if (["image", "delete", "redo", "reset", "save", "load"].includes(tool)) return;
    const quickCreateTools: GeometryTool[] = ["text", "rectangle", "shape-circle", "parabola", "ellipse", "hyperbola"];
    if (quickCreateTools.includes(tool)) {
      const point = clientToBoard(event);
      if (point) createQuickGeometryObject(tool, point.x, point.y);
      return;
    }
    const point = clientToBoard(event);
    if (!point) return;
    if (tool === "point") {
      addPoint(point.x, point.y);
      return;
    }
    createPointForActiveGeometryTool(tool, point.x, point.y);
  };

  const createPointForActiveGeometryTool = (activeTool: GeometryTool, x: number, y: number) => {
    if (activeTool === "freehand" || activeTool === "move-canvas" || activeTool === "zoom") {
      createDefaultGeometryToolObject(activeTool, x, y);
      return;
    }
    const pickTools: GeometryTool[] = [
      "segment",
      "line",
      "ray",
      "vector",
      "circle",
      "polygon",
      "triangle",
      "angle",
      "parallel",
      "perpendicular",
      "midpoint",
      "fixed-length",
      "circle-radius",
      "circle-3-points",
      "on-circle",
      "intersect",
      "perpendicular-bisector",
      "angle-bisector",
      "tangent",
      "polar",
      "locus",
      "regular-polygon",
      "arc",
      "sector",
      "compass",
      "mirror",
      "rotate",
      "dilate",
      "translate",
    ];
    if (!pickTools.includes(activeTool)) return;
    const snapped = snapBoardPoint({ x, y }, construction);
    const newPoint: GeoPoint = {
      id: crypto.randomUUID(),
      x: roundTo(snapped.x, 2),
      y: roundTo(snapped.y, 2),
      label: nextPointLabel(construction.points),
    };
    setConstruction((current) => solveConstruction({ ...current, points: [...current.points, newPoint] }, newPoint.id));
    consumeGeometryToolPoint(activeTool, newPoint.id, { ...construction, points: [...construction.points, newPoint] });
  };

  const createDefaultGeometryToolObject = (activeTool: GeometryTool, x: number, y: number) => {
    const supportedTools: GeometryTool[] = [
      "segment",
      "line",
      "ray",
      "vector",
      "circle",
      "polygon",
      "angle",
      "parallel",
      "perpendicular",
      "midpoint",
      "fixed-length",
      "circle-radius",
      "circle-3-points",
      "on-circle",
      "intersect",
      "perpendicular-bisector",
      "angle-bisector",
      "tangent",
      "polar",
      "locus",
      "regular-polygon",
      "arc",
      "sector",
      "compass",
      "mirror",
      "rotate",
      "dilate",
      "translate",
      "freehand",
      "move-canvas",
      "zoom",
    ];
    if (!supportedTools.includes(activeTool)) return;
    recordWorkspaceStep("Create geometry tool object", `${activeTool} added from the board.`);
    setConstruction((current) => createGeometryObjectForTool(current, activeTool, x, y));
    setSelectedPointIds([]);
    setPolygonDraft([]);
    if (!["move-canvas", "zoom"].includes(activeTool)) setTool("select");
  };

  const createQuickGeometryObject = (shapeTool: GeometryTool, x: number, y: number) => {
    recordWorkspaceStep("Create geometry tool object", `${shapeTool} added from tool plate.`);
    setConstruction((current) => {
      const base = current.points.length;
      const makePoint = (px: number, py: number, offset: number, style?: GeoStyle): GeoPoint => ({
        id: crypto.randomUUID(),
        x: roundTo(px, 2),
        y: roundTo(py, 2),
        label: shapeTool === "text" ? "Text" : nextPointLabel(current.points, base + offset - current.points.length),
        style,
      });
      if (shapeTool === "text") {
        return solveConstruction({ ...current, points: [...current.points, makePoint(x, y, 0, { label: "Text", color: "#f59e0b", size: 10 })] });
      }
      if (shapeTool === "triangle") {
        const points = [makePoint(x, y - 58, 0), makePoint(x - 64, y + 52, 1), makePoint(x + 64, y + 52, 2)];
        return solveConstruction({ ...current, points: [...current.points, ...points], polygons: [...current.polygons, { id: crypto.randomUUID(), points: points.map((point) => point.id) }] });
      }
      if (shapeTool === "rectangle") {
        const points = [makePoint(x - 70, y - 45, 0), makePoint(x + 70, y - 45, 1), makePoint(x + 70, y + 45, 2), makePoint(x - 70, y + 45, 3)];
        return solveConstruction({ ...current, points: [...current.points, ...points], polygons: [...current.polygons, { id: crypto.randomUUID(), points: points.map((point) => point.id), style: { fill: "rgba(14,165,233,.16)", color: "#22d3ee" } }] });
      }
      if (shapeTool === "shape-circle") {
        const center = makePoint(x, y, 0);
        const edge = makePoint(x + 72, y, 1);
        return solveConstruction({ ...current, points: [...current.points, center, edge], circles: [...current.circles, { id: crypto.randomUUID(), center: center.id, edge: edge.id }] });
      }
      const curvePoints = Array.from({ length: 48 }, (_, index) => {
        const t = ((index / 47) * 2 - 1);
        if (shapeTool === "parabola") return { x: x + t * 120, y: y + t * t * 90 - 60 };
        if (shapeTool === "ellipse") return { x: x + Math.cos(index / 47 * Math.PI * 2) * 110, y: y + Math.sin(index / 47 * Math.PI * 2) * 62 };
        return { x: x + t * 125, y: y + (t === 0 ? 0 : 42 / t) };
      });
      return solveConstruction({ ...current, loci: [...current.loci, { id: crypto.randomUUID(), label: shapeTool, points: curvePoints, style: { color: shapeTool === "ellipse" ? "#22d3ee" : shapeTool === "hyperbola" ? "#f97316" : "#a78bfa", strokeWidth: 4 } }] });
    });
    setTool("select");
  };

  const handleGeometryContextMenu = (event: PointerEvent<SVGSVGElement>) => {
    if (controlsLocked) return;
    const target = event.target as Element;
    const pointId = target.getAttribute("data-point-id");
    const objectType = (target.getAttribute("data-object-type") as GeometryObjectType | null) ?? (pointId ? "point" : null);
    const objectId = target.getAttribute("data-object-id") ?? pointId;
    if (!objectType || !objectId) return;
    event.preventDefault();
    const targetObject = { type: objectType, id: objectId };
    setSelectedGeometry(targetObject);
    setContextMenu({ x: event.clientX, y: event.clientY, target: targetObject });
  };

  const handlePointPick = (pointId: string) => {
    consumeGeometryToolPoint(tool, pointId, construction);
  };

  const consumeGeometryToolPoint = (activeTool: GeometryTool, pointId: string, constructionContext: Construction) => {
    if (activeTool === "line" || activeTool === "segment" || activeTool === "ray" || activeTool === "vector") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        recordWorkspaceStep(`Create ${activeTool}`, `${labelForPoint(constructionContext, next[0])}${labelForPoint(constructionContext, next[1])}`);
        const style: GeoStyle = activeTool === "segment" ? { label: "segment", color: "#22d3ee" } : activeTool === "ray" ? { label: "ray", color: "#a78bfa" } : activeTool === "vector" ? { label: "vector", color: "#10b981", strokeWidth: 5 } : { label: "line", color: "#8b5cf6" };
        setConstruction((current) => ({ ...current, lines: [...current.lines, { id: crypto.randomUUID(), a: next[0], b: next[1], style }] }));
        setSelectedPointIds([]);
      }
    }
    if (activeTool === "circle" || activeTool === "circle-radius") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        recordWorkspaceStep(activeTool === "circle-radius" ? "Create circle by radius" : "Create circle", `Center ${labelForPoint(constructionContext, next[0])}, edge ${labelForPoint(constructionContext, next[1])}`);
        setConstruction((current) => ({ ...current, circles: [...current.circles, { id: crypto.randomUUID(), center: next[0], edge: next[1] }] }));
        setSelectedPointIds([]);
      }
    }
    if (activeTool === "circle-3-points" || activeTool === "angle") {
      const next = [...selectedPointIds, pointId].slice(-3);
      setSelectedPointIds(next);
      if (next.length === 3 && new Set(next).size === 3) {
        recordWorkspaceStep(activeTool === "angle" ? "Create angle" : "Create circle through 3 points", next.map((id) => labelForPoint(constructionContext, id)).join(", "));
        setConstruction((current) => activeTool === "angle" ? addArcOrSector(current, next[1], next[0], next[2], false) : addCircleThrough3Points(current, next[0], next[1], next[2]));
        setSelectedPointIds([]);
      }
    }
    if (activeTool === "polygon" || activeTool === "triangle") {
      if (activeTool === "triangle") {
        const next = polygonDraft.includes(pointId) ? polygonDraft : [...polygonDraft, pointId];
        if (next.length >= 3) {
          const trianglePoints = next.slice(0, 3);
          recordWorkspaceStep("Create triangle", "3 vertices");
          setConstruction((current) => solveConstruction({ ...current, polygons: [...current.polygons, { id: crypto.randomUUID(), points: trianglePoints }] }));
          setPolygonDraft([]);
        } else setPolygonDraft(next);
        return;
      }

      const closesPolygon = polygonDraft.length >= 3 && pointId === polygonDraft[0];
      if (closesPolygon) {
        recordWorkspaceStep("Create polygon", `${polygonDraft.length} vertices`);
        setConstruction((current) => solveConstruction({ ...current, polygons: [...current.polygons, { id: crypto.randomUUID(), points: polygonDraft }] }));
        setPolygonDraft([]);
        return;
      }
      if (polygonDraft.includes(pointId)) return;
      setPolygonDraft([...polygonDraft, pointId]);
    }
    if (activeTool === "parallel" || activeTool === "perpendicular") {
      const next = [...selectedPointIds, pointId].slice(-3);
      setSelectedPointIds(next);
      if (next.length === 3 && next[0] !== next[1] && next[2] !== next[0] && next[2] !== next[1]) {
        recordWorkspaceStep(`Create ${activeTool}`, `Through ${labelForPoint(constructionContext, next[2])}`);
        setConstruction((current) => addParallelPerpendicularConstraint(current, activeTool, next[0], next[1], next[2]));
        setSelectedPointIds([]);
      }
    }
    if (activeTool === "midpoint" || activeTool === "fixed-length") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        recordWorkspaceStep(activeTool === "midpoint" ? "Create midpoint" : "Fix length", `${labelForPoint(constructionContext, next[0])}${labelForPoint(constructionContext, next[1])}`);
        setConstruction((current) => activeTool === "midpoint" ? addMidpointConstraint(current, next[0], next[1]) : addFixedLengthConstraint(current, next[0], next[1]));
        setSelectedPointIds([]);
      }
    }
    if (activeTool === "on-circle") {
      recordWorkspaceStep("Constrain point to circle", labelForPoint(constructionContext, pointId));
      setConstruction((current) => addPointOnCircleConstraint(current, pointId));
      setSelectedPointIds([]);
    }
    if (activeTool === "intersect") {
      recordWorkspaceStep("Create intersection", "Intersection of latest two lines.");
      setConstruction((current) => addIntersectionConstraint(current));
      setSelectedPointIds([]);
    }
    if (activeTool === "perpendicular-bisector") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        recordWorkspaceStep("Create perpendicular bisector", `${labelForPoint(constructionContext, next[0])}${labelForPoint(constructionContext, next[1])}`);
        setConstruction((current) => addPerpendicularBisector(current, next[0], next[1]));
        setSelectedPointIds([]);
      }
    }
    if (activeTool === "angle-bisector" || activeTool === "arc" || activeTool === "sector" || activeTool === "compass" || activeTool === "mirror" || activeTool === "translate") {
      const needed = activeTool === "arc" || activeTool === "sector" || activeTool === "angle-bisector" || activeTool === "compass" || activeTool === "mirror" || activeTool === "translate" ? 3 : 2;
      const next = [...selectedPointIds, pointId].slice(-needed);
      setSelectedPointIds(next);
      if (next.length === needed && new Set(next).size === needed) {
        recordWorkspaceStep(`Create ${activeTool}`, next.map((id) => labelForPoint(constructionContext, id)).join(", "));
        setConstruction((current) => {
          if (activeTool === "angle-bisector") return addAngleBisector(current, next[0], next[1], next[2]);
          if (activeTool === "arc" || activeTool === "sector") return addArcOrSector(current, next[0], next[1], next[2], activeTool === "sector");
          if (activeTool === "compass") return addCompassCircle(current, next[0], next[1], next[2]);
          if (activeTool === "mirror") return mirrorPointAcrossLine(current, next[0], next[1], next[2]);
          return translatePointByVector(current, next[0], next[1], next[2]);
        });
        setSelectedPointIds([]);
      }
    }
    if (activeTool === "tangent" || activeTool === "polar" || activeTool === "locus" || activeTool === "rotate" || activeTool === "dilate") {
      recordWorkspaceStep(`Create ${activeTool}`, labelForPoint(constructionContext, pointId));
      setConstruction((current) => {
        if (activeTool === "tangent") return addTangentAtPoint(current, pointId);
        if (activeTool === "polar") return addPolarLine(current, pointId);
        if (activeTool === "locus") return addLocusForPoint(current, pointId);
        if (activeTool === "rotate") return rotatePoint(current, pointId, current.points[0]?.id ?? pointId, 45);
        return dilatePoint(current, pointId, current.points[0]?.id ?? pointId, 1.5);
      });
      setSelectedPointIds([]);
    }
    if (activeTool === "regular-polygon") {
      const next = [...selectedPointIds, pointId].slice(-2);
      setSelectedPointIds(next);
      if (next.length === 2 && next[0] !== next[1]) {
        recordWorkspaceStep("Create regular polygon", `${labelForPoint(constructionContext, next[0])}${labelForPoint(constructionContext, next[1])}`);
        setConstruction((current) => addRegularPolygon(current, next[0], next[1], 5));
        setSelectedPointIds([]);
      }
    }
  };

  const handleBoardPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragPointId && !dragGeometry && !dragImageId) return;
    if (event.pointerType === "touch") event.preventDefault();
    const point = clientToBoard(event);
    if (!point) return;
    if (dragImageId) {
      setWorkspaceImages((current) => current.map((image) => image.id === dragImageId ? { ...image, x: roundTo(point.x - image.width / 2, 2), y: roundTo(point.y - image.height / 2, 2) } : image));
    }
    if (dragPointId) {
      setConstruction((current) => solveConstruction({
        ...current,
        points: current.points.map((item) => item.id === dragPointId ? { ...item, x: point.x, y: point.y } : item),
      }, dragPointId));
    }
    if (dragGeometry) {
      const dx = point.x - dragGeometry.last.x;
      const dy = point.y - dragGeometry.last.y;
      const pointIds = pointIdsForObject(construction, dragGeometry.object);
      setConstruction((current) => solveConstruction({
        ...current,
        points: current.points.map((item) => pointIds.includes(item.id) ? { ...item, x: item.x + dx, y: item.y + dy } : item),
      }));
      setDragGeometry({ ...dragGeometry, last: point });
    }
  };

  const clientToBoard = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    return { x: transformed.x, y: transformed.y };
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

  const handlePlotsChange = (nextPlots: PlotItem[]) => {
    recordWorkspaceStep("Edit graph object", "Graph list changed from graph panel.");
    setPlots(nextPlots);
  };

  const updateSelectedGeometryStyle = (patch: GeoStyle) => {
    if (!selectedGeometry) return;
    recordWorkspaceStep("Edit geometry style", `${selectedGeometry.type} properties changed.`);
    setConstruction((current) => patchGeometryObject(current, selectedGeometry, { style: patch }));
  };

  const updateSelectedPoint = (patch: Partial<GeoPoint>) => {
    if (!selectedGeometry || selectedGeometry.type !== "point") return;
    recordWorkspaceStep("Edit point definition", `${labelForPoint(construction, selectedGeometry.id)} changed.`);
    setConstruction((current) => solveConstruction({ ...current, points: current.points.map((point) => point.id === selectedGeometry.id ? { ...point, ...patch } : point) }, selectedGeometry.id));
  };

  const updateSelectedPointByDelta = (pointId: string, dx: number, dy: number) => {
    if (lockedGeometryIds.includes(pointId)) return;
    setConstruction((current) => solveConstruction({
      ...current,
      points: current.points.map((point) => point.id === pointId ? { ...point, x: point.x + dx, y: point.y + dy } : point),
    }, pointId));
  };

  const updateSelectedImage = (patch: Partial<WorkspaceImage>) => {
    if (!selectedImageId) return;
    recordWorkspaceStep("Edit image", `${workspaceImages.find((image) => image.id === selectedImageId)?.name ?? "Image"} properties changed.`);
    setWorkspaceImages((current) => current.map((image) => image.id === selectedImageId ? { ...image, ...patch } : image));
  };

  const deleteSelectedImage = () => {
    if (!selectedImageId) return;
    recordWorkspaceStep("Delete image", `${workspaceImages.find((image) => image.id === selectedImageId)?.name ?? "Image"} removed.`);
    setWorkspaceImages((current) => current.filter((image) => image.id !== selectedImageId));
    setSelectedImageId(null);
  };

  const updateSelectedCircleRadius = (radiusUnits: number) => {
    if (!selectedGeometry || selectedGeometry.type !== "circle") return;
    recordWorkspaceStep("Edit circle definition", `Radius set to ${radiusUnits}.`);
    setConstruction((current) => {
      const circle = current.circles.find((item) => item.id === selectedGeometry.id);
      const center = circle ? pointById(current.points, circle.center) : null;
      const edge = circle ? pointById(current.points, circle.edge) : null;
      if (!circle || !center || !edge) return current;
      const vector = normalize(edge.x - center.x, edge.y - center.y);
      return solveConstruction({
        ...current,
        points: current.points.map((point) => point.id === edge.id ? { ...point, x: center.x + vector.x * radiusUnits * 40, y: center.y + vector.y * radiusUnits * 40 } : point),
      });
    });
  };

  const deleteGeometryObject = (object = selectedGeometry) => {
    if (!object) return;
    recordWorkspaceStep("Delete geometry object", `${object.type} removed.`);
    setConstruction((current) => deleteGeometryObjectFromConstruction(current, object));
    setSelectedGeometry(null);
    setContextMenu(null);
  };

  const duplicateGeometryObject = (object = selectedGeometry) => {
    if (!object) return;
    recordWorkspaceStep("Duplicate geometry object", `${object.type} duplicated.`);
    setConstruction((current) => duplicateGeometryObjectInConstruction(current, object));
    setContextMenu(null);
  };

  const restoreGeometryObject = (object = selectedGeometry) => {
    if (!object) return;
    recordWorkspaceStep("Restore geometry object", `${object.type} style restored.`);
    setConstruction((current) => patchGeometryObject(current, object, { style: {} }));
    setContextMenu(null);
  };

  const toggleGeometryLock = (object = selectedGeometry) => {
    if (!object) return;
    recordWorkspaceStep("Toggle geometry lock", `${object.type} lock changed.`);
    setLockedGeometryIds((current) => current.includes(object.id) ? current.filter((id) => id !== object.id) : [...current, object.id]);
    setContextMenu(null);
  };

  const toggleSelectedGeometryVisibility = () => {
    if (!selectedGeometry) return;
    const object = geometryObjectBySelection(construction, selectedGeometry);
    updateSelectedGeometryStyle({ ...(object?.style ?? {}), visible: object?.style?.visible === false });
  };

  const setSelectedGeometryTrace = (enabled: boolean) => {
    if (!selectedGeometry) return;
    const object = geometryObjectBySelection(construction, selectedGeometry);
    updateSelectedGeometryStyle({ ...(object?.style ?? {}), trace: enabled });
  };

  const clearGeometryTrace = () => {
    recordWorkspaceStep("Clear geometry trace", "All trace flags removed.");
    setConstruction((current) => ({
      ...current,
      points: current.points.map((point) => ({ ...point, style: { ...(point.style ?? {}), trace: false } })),
      lines: current.lines.map((line) => ({ ...line, style: { ...(line.style ?? {}), trace: false } })),
      circles: current.circles.map((circle) => ({ ...circle, style: { ...(circle.style ?? {}), trace: false } })),
      polygons: current.polygons.map((polygon) => ({ ...polygon, style: { ...(polygon.style ?? {}), trace: false } })),
      arcs: current.arcs.map((arc) => ({ ...arc, style: { ...(arc.style ?? {}), trace: false } })),
      loci: current.loci.map((locus) => ({ ...locus, style: { ...(locus.style ?? {}), trace: false } })),
    }));
  };

  const add3dSceneObject = (baseId: ThreeObjectId, options: { solid?: SolidKind; surface?: SurfaceKind; label?: string } = {}) => {
    const render = addedRenderKindForBase(baseId);
    const count = added3dObjects.length + 1;
    const id = `scene3d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const baseTransform = defaultTransforms3d[baseId];
    const label = options.label ?? options.solid ?? options.surface ?? threeObjectLabels[baseId];
    const offset = ((count - 1) % 5 - 2) * 0.72;
    const rowOffset = Math.floor((count - 1) / 5) * 0.55;
    const nextTransform: Transform3D = {
      ...baseTransform,
      name: `${label} ${count}`,
      visible: true,
      color: colors[count % colors.length],
      position: [roundTo(baseTransform.position[0] + offset, 2), roundTo(baseTransform.position[1] + 0.1, 2), roundTo(baseTransform.position[2] + rowOffset, 2)],
      dimensions: baseTransform.dimensions ? [...baseTransform.dimensions] as [number, number, number] : undefined,
    };
    const next: Added3DObject = { id, label: nextTransform.name ?? `${label} ${count}`, baseId, render, solid: options.solid ?? threeObjectSolidMap[baseId], surface: options.surface, transform: nextTransform };
    recordWorkspaceStep("Add 3D object", `${next.label} added to the 3D scene.`);
    setAdded3dObjects((current) => [...current, next]);
    setSelected3d(id);
    setShowSurface((current) => current || render === "surface");
    setShowSolid((current) => current || render === "solid");
    return id;
  };

  const update3dTransform = (id: string, patch: Partial<Transform3D>) => {
    const currentTransform = isBase3dId(id) ? transforms3d[id] : added3dObjects.find((object) => object.id === id)?.transform;
    const changesGeometry = "position" in patch || "rotation" in patch || "scale" in patch || "dimensions" in patch;
    if (!currentTransform || (currentTransform.locked && changesGeometry)) return;
    recordWorkspaceStep("Edit 3D object", `${currentTransform.name ?? id} transform changed.`);
    if (isBase3dId(id)) setTransforms3d((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
    else setAdded3dObjects((current) => current.map((object) => object.id === id ? { ...object, label: patch.name ?? object.label, transform: { ...object.transform, ...patch } } : object));
  };

  const update3dVector = (id: string, key: "position" | "rotation", index: number, value: number) => {
    const currentTransform = isBase3dId(id) ? transforms3d[id] : added3dObjects.find((object) => object.id === id)?.transform;
    if (!currentTransform || currentTransform.locked) return;
    if (isBase3dId(id)) {
      setTransforms3d((current) => {
        const next = [...current[id][key]] as [number, number, number];
        next[index] = value;
        return { ...current, [id]: { ...current[id], [key]: next } };
      });
      return;
    }
    setAdded3dObjects((current) => current.map((object) => {
      if (object.id !== id) return object;
      const next = [...object.transform[key]] as [number, number, number];
      next[index] = value;
      return { ...object, transform: { ...object.transform, [key]: next } };
    }));
  };

  const restore3dObject = (id = selected3d) => {
    const target = isBase3dId(id) ? transforms3d[id] : added3dObjects.find((object) => object.id === id)?.transform;
    recordWorkspaceStep("Restore 3D object", `${target?.name ?? id} restored.`);
    if (isBase3dId(id)) setTransforms3d((current) => ({ ...current, [id]: defaultTransforms3d[id] }));
    else setAdded3dObjects((current) => current.map((object) => object.id === id ? { ...object, transform: { ...defaultTransforms3d[object.baseId], name: object.label, visible: true, color: object.transform.color } } : object));
    setContextMenu(null);
  };

  const delete3dObject = (id = selected3d) => {
    const target = isBase3dId(id) ? transforms3d[id] : added3dObjects.find((object) => object.id === id)?.transform;
    recordWorkspaceStep(isBase3dId(id) ? "Hide 3D object" : "Delete 3D object", `${target?.name ?? id} removed from view.`);
    if (isBase3dId(id)) setTransforms3d((current) => ({ ...current, [id]: { ...current[id], visible: false } }));
    else {
      setAdded3dObjects((current) => current.filter((object) => object.id !== id));
      setSelected3d("solid");
    }
    setContextMenu(null);
  };

  const duplicate3dObject = (id = selected3d) => {
    const existing = isBase3dId(id) ? { baseId: id, render: addedRenderKindForBase(id), solid: threeObjectSolidMap[id], surface: id === "surface" ? surface : undefined, label: transforms3d[id].name ?? threeObjectLabels[id], transform: transforms3d[id] } : added3dObjects.find((object) => object.id === id);
    if (!existing) return;
    recordWorkspaceStep("Duplicate 3D object", `${existing.transform.name ?? existing.label} duplicated.`);
    const count = added3dObjects.length + 1;
    const nextId = `scene3d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const nextTransform: Transform3D = { ...existing.transform, name: `${existing.label ?? "Object"} copy`, visible: true, position: [roundTo(existing.transform.position[0] + 0.55, 2), roundTo(existing.transform.position[1] + 0.25, 2), roundTo(existing.transform.position[2] + 0.55, 2)], dimensions: existing.transform.dimensions ? [...existing.transform.dimensions] as [number, number, number] : undefined };
    const next: Added3DObject = { id: nextId, label: nextTransform.name ?? `Object ${count}`, baseId: existing.baseId, render: existing.render, solid: existing.solid, surface: existing.surface, transform: nextTransform };
    setAdded3dObjects((current) => [...current, next]);
    setSelected3d(nextId);
    setContextMenu(null);
  };

  const saveConstruction = () => localStorage.setItem("math-universe-workspace-construction", JSON.stringify(construction));
  const loadConstruction = () => {
    const saved = localStorage.getItem("math-universe-workspace-construction");
    if (saved) setConstruction(normalizeConstruction(JSON.parse(saved) as Partial<Construction>));
  };
  const snapshot = (): WorkspaceSnapshot => ({ input, results, plots, construction, lockedGeometryIds, surface, surfaceExpression, cameraPreset3d, sceneAnimationSpeed, solid, surfaceScale, height3d, crossSection, showSurface, showSolid, autoRotate3d, zoom3d, transforms3d, added3dObjects, images: workspaceImages, spreadsheet, tableRange: { start: tableStart, end: tableEnd, step: tableStep }, guidedMode, guidedPhase, teachingMode, revealStep, controlsLocked, highContrastMode, performanceMode, protocol, activityJournal, presentationNotes });
  const saveWorkspace = () => localStorage.setItem("math-universe-workspace-full", JSON.stringify(snapshot()));
  const restoreWorkspaceSnapshot = (data: WorkspaceSnapshot) => {
    setInput(data.input);
    setResults(data.results ?? []);
    setPlots(data.plots ?? []);
    setConstruction(normalizeConstruction(data.construction ?? initialConstruction));
    setLockedGeometryIds(data.lockedGeometryIds ?? []);
    setSurface(data.surface ?? "paraboloid");
    setSurfaceExpression(data.surfaceExpression ?? "sin(x) * cos(y)");
    setCameraPreset3d(data.cameraPreset3d ?? "isometric");
    setSceneAnimationSpeed(data.sceneAnimationSpeed ?? 0.18);
    setSolid(data.solid ?? "cube");
    setSurfaceScale(data.surfaceScale ?? 1);
    setHeight3d(data.height3d ?? 2.5);
    setCrossSection(data.crossSection ?? 0);
    setShowSurface(data.showSurface ?? true);
    setShowSolid(data.showSolid ?? true);
    setAutoRotate3d(data.autoRotate3d ?? true);
    setZoom3d(data.zoom3d ?? 1);
    setTransforms3d({ ...defaultTransforms3d, ...(data.transforms3d ?? {}) });
    setAdded3dObjects(data.added3dObjects ?? []);
    setSelected3d("solid");
    setWorkspaceImages(data.images ?? []);
    setSelectedImageId(null);
    setSpreadsheet(data.spreadsheet ?? initialSpreadsheet);
    setTableStart(data.tableRange?.start ?? -4);
    setTableEnd(data.tableRange?.end ?? 4);
    setTableStep(data.tableRange?.step ?? 1);
    setGuidedMode(data.guidedMode ?? false);
    setGuidedPhase(data.guidedPhase ?? "predict");
    setTeachingMode(data.teachingMode ?? false);
    setRevealStep(data.revealStep ?? 1);
    setControlsLocked(data.controlsLocked ?? false);
    setHighContrastMode(data.highContrastMode ?? false);
    setPerformanceMode(data.performanceMode ?? false);
    setProtocol(data.protocol ?? []);
    setActivityJournal(data.activityJournal ?? {});
    setPresentationNotes(data.presentationNotes ?? "");
    setUndoStack([]);
    setRedoStack([]);
  };
  const loadWorkspace = () => {
    const saved = localStorage.getItem("math-universe-workspace-full");
    if (!saved) return;
    restoreWorkspaceSnapshot(JSON.parse(saved) as WorkspaceSnapshot);
  };
  const exportWorkspaceJson = () => downloadText("math-workspace.json", JSON.stringify(snapshot(), null, 2), "application/json");
  const exportResultsCsv = () => downloadText("math-workspace-results.csv", resultsToCsv(results), "text/csv");
  const exportShareUrl = async () => {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(snapshot()))));
    const url = `${window.location.origin}${window.location.pathname}#project=${encoded}`;
    await navigator.clipboard?.writeText(url);
    setProjectStatus("Shareable URL copied to clipboard.");
  };
  const exportWorksheetPdf = () => downloadText("math-workspace-worksheet.pdf", createWorksheetPdf(activeTemplate, results), "application/pdf");
  const exportLessonPack = () => downloadText("math-universe-lesson-pack.json", JSON.stringify(createLessonPack(activeTemplate, snapshot(), activityJournal, results, presentationNotes), null, 2), "application/json");
  const exportActivityJournal = () => downloadText("math-universe-activity-journal.csv", activityJournalToCsv(activityJournal), "text/csv");
  const copyTeacherPresentationUrl = async () => {
    const url = `${window.location.origin}${window.location.pathname}?template=${encodeURIComponent(activeTemplate.id)}&mode=guided&teacher=1`;
    await navigator.clipboard?.writeText(url);
    setProjectStatus("Teacher presentation URL copied.");
  };
  const exportGeometrySvg = () => {
    const svg = geometryExportRef.current;
    if (!svg) return;
    downloadText("geometry-construction.svg", svg.outerHTML, "image/svg+xml");
  };
  const exportGeometryPng = () => {
    const svg = geometryExportRef.current;
    if (!svg) return;
    const image = new Image();
    const svgUrl = URL.createObjectURL(new Blob([svg.outerHTML], { type: "image/svg+xml" }));
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 840;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);
      canvas.toBlob((blob) => blob && downloadBlob("geometry-construction.png", blob), "image/png");
    };
    image.src = svgUrl;
  };
  const saveProjectToLibrary = () => {
    const title = `${activeTemplate.unit} workspace`;
    const entry: OfflineProjectEntry<WorkspaceSnapshot> = {
      id: crypto.randomUUID(),
      title,
      unit: activeTemplate.unit,
      savedAt: Date.now(),
      summary: `${construction.points.length} points, ${plots.length} plots, ${results.length} results`,
      snapshot: snapshot(),
    };
    setProjectLibrary(saveOfflineProject(entry));
    setProjectStatus(`${title} saved offline in this browser.`);
  };
  const restoreProject = (entry: OfflineProjectEntry<WorkspaceSnapshot>) => {
    restoreWorkspaceSnapshot(entry.snapshot);
    setProjectStatus(`${entry.title} restored.`);
  };
  const deleteProject = (id: string) => {
    setProjectLibrary(removeOfflineProject<WorkspaceSnapshot>(id));
    setProjectStatus("Project removed from offline library.");
  };
  const clearProjects = () => {
    clearOfflineProjectLibrary();
    setProjectLibrary([]);
    setProjectStatus("Offline project library cleared.");
  };
  const applyTemplate = (template: SyllabusWorkspaceTemplate) => {
    setActiveTemplate(template);
    setInput(template.command);
    setTeachingMode(true);
    setGuidedMode(true);
    setGuidedPhase("predict");
    setRevealStep(1);
    if (template.focus === "3d") {
      setSurface("paraboloid");
      setSolid("cylinder");
      setShowSurface(true);
      setShowSolid(true);
      setAutoRotate3d(false);
      setCrossSection(0.6);
    }
    if (template.focus === "geometry") setConstruction(templateConstruction(template.id));
    runGuidedExample(template.command);
    setProjectStatus(`${template.unit} template loaded with guided activity mode.`);
  };
  const runQaNow = () => setQaReport(runWorkspaceQaSuite());
  const updateGuidedActivityEntry = (patch: Partial<ActivityJournalEntry>) => {
    const key = activityJournalKey(activeTemplate.id, guidedPhase);
    setActivityJournal((current) => ({
      ...current,
      [key]: {
        ...defaultActivityJournalEntry(activeTemplate.id, guidedPhase),
        ...(current[key] ?? {}),
        ...patch,
        templateId: activeTemplate.id,
        phase: guidedPhase,
        updatedAt: Date.now(),
      },
    }));
  };

  const markGuidedPhaseComplete = () => {
    updateGuidedActivityEntry({ selfCheck: "got-it", confidence: Math.max(activityJournal[activityJournalKey(activeTemplate.id, guidedPhase)]?.confidence ?? 50, 80) });
    const order: GuidedActivityPhase[] = ["predict", "manipulate", "check", "reflect"];
    const next = order[Math.min(order.length - 1, order.indexOf(guidedPhase) + 1)];
    setGuidedPhase(next);
    setRevealStep(Math.max(revealStep, order.indexOf(next) + 1));
  };

  const runGuidedExample = (command: string) => {
    setInput(command);
    const analysis = interpretInput(command);
    setResults((current) => [analysis, ...current].slice(0, 12));
    if (analysis.interpretation === "2D plot") {
      recordWorkspaceStep("Run guided graph", command);
      const expression = normalizePlotExpression(command);
      setPlots((current) => [{ id: crypto.randomUUID(), expression, name: nextFunctionName(current), color: colors[current.length % colors.length], kind: inferPlotKind(expression), visible: true }, ...current].slice(0, 8));
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routeKey = params.toString();
    if (!routeKey || routeStateAppliedRef.current === routeKey) return;
    routeStateAppliedRef.current = routeKey;

    const templateId = normalizeTemplateRouteParam(params.get("template") ?? params.get("unit") ?? "");
    const template = syllabusWorkspaceTemplates.find((item) => item.id === templateId);
    if (template) applyTemplate(template);

    const mode = (params.get("mode") ?? "").toLowerCase();
    if (mode === "3d" || mode === "space3d") {
      setSurface("custom-z");
      setSurfaceExpression(params.get("surface") ?? surfaceExpression);
      setShowSurface(true);
      setShowSolid(true);
      setAutoRotate3d(false);
      setSelected3d("surface");
      setProjectStatus("3D workspace mode loaded from URL.");
    } else if (mode === "geometry" || mode === "2d") {
      setTool("select");
      setProjectStatus("Geometry workspace mode loaded from URL.");
    } else if (mode === "guided") {
      setGuidedMode(true);
      setTeachingMode(true);
      setGuidedPhase("predict");
      setProjectStatus("Guided activity mode loaded from URL.");
    }

    if (params.get("teacher") === "1" || params.get("panel") === "teacher") {
      setTeachingMode(true);
      setControlsLocked(true);
      setRevealStep(1);
    }
    if (params.get("panel") === "export") setProjectStatus("Export tools are ready in Stage 5.");
    if (params.get("highContrast") === "1") setHighContrastMode(true);

    const command = params.get("command");
    if (command) {
      const decoded = decodeURIComponent(command);
      setInput(decoded);
      executeWorkspaceCommand(decoded);
    }
  }, []);

  const selectWorkspaceObject = (ref: AlgebraObjectRef) => {
    setSelectedAlgebra(ref);
    if (ref.kind === "point" || ref.kind === "line" || ref.kind === "circle" || ref.kind === "polygon") setSelectedGeometry({ type: ref.kind, id: ref.id });
    if (ref.kind === "3d" && (isBase3dId(ref.id) || added3dObjects.some((object) => object.id === ref.id))) setSelected3d(ref.id);
  };

  const renameWorkspaceObject = (ref: AlgebraObjectRef, name: string) => {
    const clean = name.trim().slice(0, 18);
    if (!clean) return;
    recordWorkspaceStep("Rename object", `${objectDisplayName(workspaceObjects, ref)} renamed to ${clean}.`);
    if (ref.kind === "function") setPlots((current) => current.map((plot) => plot.id === ref.id ? { ...plot, name: clean } : plot));
    else if (ref.kind === "3d" && isBase3dId(ref.id)) {
      const id = ref.id;
      setTransforms3d((current) => ({ ...current, [id]: { ...current[id], name: clean } }));
    }
    else if (ref.kind === "3d") setAdded3dObjects((current) => current.map((object) => object.id === ref.id ? { ...object, label: clean, transform: { ...object.transform, name: clean } } : object));
    else setConstruction((current) => renameGeometryObject(current, ref, clean));
  };

  const editWorkspaceDefinition = (ref: AlgebraObjectRef, definition: string) => {
    recordWorkspaceStep("Edit object definition", `${objectDisplayName(workspaceObjects, ref)} = ${definition}`);
    if (ref.kind === "function") {
      const expression = normalizeFunctionDefinition(definition);
      setPlots((current) => current.map((plot) => plot.id === ref.id && !plot.locked ? { ...plot, expression, kind: inferPlotKind(expression) } : plot));
    } else if (ref.kind === "point") {
      const coords = parsePointDefinition(definition);
      if (coords) setConstruction((current) => solveConstruction({ ...current, points: current.points.map((point) => point.id === ref.id ? { ...point, x: coords.x, y: coords.y } : point) }, ref.id));
    } else if (ref.kind === "line") {
      const line = parseLineDefinition(definition);
      if (line) setConstruction((current) => updateLineFromEquation(current, ref.id, line.m, line.b));
    } else if (ref.kind === "circle") {
      const circle = parseCircleDefinition(definition);
      if (circle) setConstruction((current) => updateCircleFromDefinition(current, ref.id, circle));
    } else if (ref.kind === "3d") {
      const transform = parse3dDefinition(definition);
      if (transform && isBase3dId(ref.id)) {
        const id = ref.id;
        setTransforms3d((current) => ({ ...current, [id]: { ...current[id], ...transform } }));
      }
      else if (transform) setAdded3dObjects((current) => current.map((object) => object.id === ref.id ? { ...object, transform: { ...object.transform, ...transform } } : object));
    }
  };

  const patchWorkspaceObject = (ref: AlgebraObjectRef, patch: { visible?: boolean; locked?: boolean; trace?: boolean }) => {
    recordWorkspaceStep("Edit object flags", `${objectDisplayName(workspaceObjects, ref)} flags changed.`);
    if (ref.kind === "function") setPlots((current) => current.map((plot) => plot.id === ref.id ? { ...plot, ...patch } : plot));
    else if (ref.kind === "3d" && isBase3dId(ref.id)) {
      const id = ref.id;
      setTransforms3d((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
    }
    else if (ref.kind === "3d") setAdded3dObjects((current) => current.map((object) => object.id === ref.id ? { ...object, transform: { ...object.transform, ...patch } } : object));
    else {
      setConstruction((current) => patchGeometryObject(current, { type: ref.kind as GeometryObjectType, id: ref.id }, { style: { ...(geometryObjectBySelection(current, { type: ref.kind as GeometryObjectType, id: ref.id })?.style ?? {}), visible: patch.visible, trace: patch.trace } }));
      if (typeof patch.locked === "boolean") setLockedGeometryIds((current) => patch.locked ? Array.from(new Set([...current, ref.id])) : current.filter((id) => id !== ref.id));
    }
  };

  const duplicateWorkspaceObject = (ref: AlgebraObjectRef) => {
    if (ref.kind === "function") {
      const plot = plots.find((item) => item.id === ref.id);
      if (!plot) return;
      recordWorkspaceStep("Duplicate function", plot.name ?? plot.expression);
      setPlots((current) => [{ ...plot, id: crypto.randomUUID(), name: nextFunctionName(current), expression: plot.expression, color: colors[current.length % colors.length] }, ...current]);
    } else if (ref.kind === "3d") duplicate3dObject(ref.id);
    else duplicateGeometryObject({ type: ref.kind as GeometryObjectType, id: ref.id });
  };

  const deleteWorkspaceObject = (ref: AlgebraObjectRef) => {
    if (ref.kind === "function") {
      recordWorkspaceStep("Delete function", objectDisplayName(workspaceObjects, ref));
      setPlots((current) => current.filter((plot) => plot.id !== ref.id));
    } else if (ref.kind === "3d") delete3dObject(ref.id);
    else deleteGeometryObject({ type: ref.kind as GeometryObjectType, id: ref.id });
  };

  const clearWorkspaceSelection = useCallback(() => {
    setTool("select");
    setSelectedGeometry(null);
    setSelectedImageId(null);
    setSelectedAlgebra(null);
    setSelectedPointIds([]);
    setPolygonDraft([]);
    setDragPointId(null);
    setDragImageId(null);
    setDragGeometry(null);
    setDrag3d(null);
    setSelected3d("");
    setContextMenu(null);
    setProjectStatus("Selection cleared. Tool returned to Select.");
  }, []);

  const deleteSelectedWorkspaceItems = useCallback(() => {
    if (selectedImageId) {
      deleteSelectedImage();
      setProjectStatus("Selected image deleted.");
      return true;
    }
    if (selectedGeometry) {
      deleteGeometryObject(selectedGeometry);
      setProjectStatus("Selected geometry object deleted.");
      return true;
    }
    if (selectedPointIds.length) {
      recordWorkspaceStep("Delete selected points", `${selectedPointIds.length} point${selectedPointIds.length === 1 ? "" : "s"} removed.`);
      setConstruction((current) => selectedPointIds.reduce((next, id) => deleteGeometryObjectFromConstruction(next, { type: "point", id }), current));
      setSelectedPointIds([]);
      setSelectedGeometry(null);
      setProjectStatus("Selected points deleted.");
      return true;
    }
    if (selectedAlgebra) {
      deleteWorkspaceObject(selectedAlgebra);
      setSelectedAlgebra(null);
      setProjectStatus("Selected algebra object deleted.");
      return true;
    }
    if (selected3d) {
      delete3dObject(selected3d);
      setSelected3d("");
      setProjectStatus(isBase3dId(selected3d) ? "Selected 3D object hidden." : "Selected 3D object deleted.");
      return true;
    }
    return false;
  }, [deleteSelectedImage, selectedGeometry, selectedPointIds, selectedAlgebra, selected3d, selectedImageId]);

  const replayConstructionStep = (step: ConstructionStep) => {
    restoreProtocolSnapshot(step);
    setProjectStatus(`Replayed: ${step.label}`);
  };
  const runWorkspaceShortcut = useCallback((event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "shiftKey" | "preventDefault">) => {
    if (event.key === "Escape") {
      event.preventDefault();
      clearWorkspaceSelection();
      return;
    }
    if (event.key === "Delete" || event.key === "Backspace") {
      const deleted = deleteSelectedWorkspaceItems();
      event.preventDefault();
      if (!deleted) setProjectStatus("No selected object to delete.");
      return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) && selectedGeometry?.type === "point") {
      event.preventDefault();
      const delta = event.shiftKey ? 10 : 2;
      const dx = event.key === "ArrowLeft" ? -delta : event.key === "ArrowRight" ? delta : 0;
      const dy = event.key === "ArrowUp" ? -delta : event.key === "ArrowDown" ? delta : 0;
      updateSelectedPointByDelta(selectedGeometry.id, dx, dy);
      return;
    }
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) redoWorkspace();
      else undoWorkspace();
    }
    if (event.key.toLowerCase() === "y") {
      event.preventDefault();
      redoWorkspace();
    }
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
  }, [clearWorkspaceSelection, deleteSelectedWorkspaceItems, loadWorkspace, redoWorkspace, runInput, saveWorkspace, selectedGeometry, undoWorkspace, updateSelectedPointByDelta]);

  useEffect(() => {
    const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      runWorkspaceShortcut(event);
    };
    document.addEventListener("keydown", onDocumentKeyDown);
    return () => document.removeEventListener("keydown", onDocumentKeyDown);
  }, [runWorkspaceShortcut]);

  return (
    <div ref={workspaceRef} className="space-y-3 pt-20 xl:pt-14">
      <WorkspaceMainMenu active={workspaceView} onChange={setWorkspaceView} />
      {!singleView && <TopicHeader title="Math Workspace" subtitle="A GeoGebra and Wolfram-style workspace for graphing, commands, results, and geometric construction." difficulty="All levels" estimatedMinutes={45} />}

      {!singleView && <WorkspaceModeTabs active={workspaceView} onChange={setWorkspaceView} />}
      <CompactWorkspaceBar
        activeTemplate={activeTemplate}
        dynamicHealth={dynamicHealth}
        qaReport={qaReport}
        teachingMode={teachingMode}
        performanceMode={performanceMode}
        onSave={saveWorkspace}
        onLoad={loadWorkspace}
        onUndo={undoWorkspace}
        onRedo={redoWorkspace}
        onExportJson={exportWorkspaceJson}
        onExportPng={exportGeometryPng}
        onShare={exportShareUrl}
        onToggleTeach={() => {
          setTeachingMode((value) => !value);
          setWorkspaceView("teach");
        }}
        onRunQa={runQaNow}
        onPerformance={setPerformanceMode}
      />
      <WorkspaceShortcutStrip />

      {workspaceView === "teach" && <SectionCard title="Teaching, Library, And Export" description="Launch syllabus workspaces, guide students, present steps, and manage browser-only projects.">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={saveWorkspace} className="action-secondary"><Save className="h-4 w-4" />Save workspace</button>
              <button type="button" onClick={loadWorkspace} className="action-secondary"><Download className="h-4 w-4" />Load workspace</button>
              <button type="button" onClick={saveProjectToLibrary} className="action-secondary"><Save className="h-4 w-4" />Save offline</button>
              <button type="button" onClick={exportWorkspaceJson} className="action-secondary"><Download className="h-4 w-4" />Export JSON</button>
              <button type="button" onClick={exportResultsCsv} className="action-secondary"><Download className="h-4 w-4" />Export CSV</button>
              <button type="button" onClick={exportGeometryPng} className="action-secondary"><Download className="h-4 w-4" />Export PNG</button>
              <button type="button" onClick={exportGeometrySvg} className="action-secondary"><Download className="h-4 w-4" />Export geometry SVG</button>
              <button type="button" onClick={exportWorksheetPdf} className="action-secondary"><Download className="h-4 w-4" />Worksheet PDF</button>
              <button type="button" onClick={exportLessonPack} className="action-secondary"><Download className="h-4 w-4" />Lesson pack</button>
              <button type="button" onClick={exportActivityJournal} className="action-secondary"><Download className="h-4 w-4" />Journal CSV</button>
              <button type="button" onClick={exportShareUrl} className="action-secondary"><Download className="h-4 w-4" />Share URL</button>
              <button type="button" onClick={copyTeacherPresentationUrl} className="action-secondary"><Presentation className="h-4 w-4" />Teacher link</button>
              <button type="button" onClick={() => setTeachingMode((value) => !value)} className={teachingMode ? "action-primary" : "action-secondary"}><Presentation className="h-4 w-4" />Teaching mode</button>
              <button type="button" onClick={undoWorkspace} className="action-secondary"><RotateCcw className="h-4 w-4" />Undo {undoStack[0]?.label ?? "change"}</button>
              <button type="button" onClick={redoWorkspace} className="action-secondary"><RotateCcw className="h-4 w-4" />Redo {redoStack[0]?.label ?? "change"}</button>
            </div>
            <SyllabusTemplatePanel templates={syllabusWorkspaceTemplates} active={activeTemplate.id} onApply={applyTemplate} />
            <GuidedActivityPanel active={guidedMode} phase={guidedPhase} template={activeTemplate} journal={activityJournal} onToggle={() => setGuidedMode((value) => !value)} onPhase={setGuidedPhase} onJournal={updateGuidedActivityEntry} onCompletePhase={markGuidedPhaseComplete} />
            <TeacherPresentationPanel active={teachingMode} locked={controlsLocked} revealStep={revealStep} template={activeTemplate} notes={presentationNotes} journal={activityJournal} onToggle={setTeachingMode} onLock={setControlsLocked} onReveal={setRevealStep} onNotes={setPresentationNotes} onCopyLink={copyTeacherPresentationUrl} />
            <OfflineProjectLibraryPanel projects={projectLibrary} status={projectStatus} onSave={saveProjectToLibrary} onRestore={restoreProject} onDelete={deleteProject} onClear={clearProjects} />
            <ProductionQualityPanel highContrast={highContrastMode} performanceMode={performanceMode} qaReport={qaReport} onHighContrast={setHighContrastMode} onPerformance={setPerformanceMode} onRunQa={runQaNow} />
            {teachingMode && (
              <div className="rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-50">
                <p className="font-bold">Teacher presentation mode is active</p>
                <p>{controlsLocked ? "Student-facing controls are locked for explanation and reveal steps." : "Controls are open for live manipulation and discussion."}</p>
              </div>
            )}
            <div>
              <h3 className="font-bold">Guided Examples</h3>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {guidedExamples.map((example) => <button key={example.title} type="button" onClick={() => runGuidedExample(example.command)} className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-left transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"><p className="font-semibold">{example.title}</p><p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">{example.command}</p></button>)}
              </div>
            </div>
          </div>
          <div>
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
      </SectionCard>}

      {workspaceView === "graph" && <SectionCard title="Graph, CAS, And Algebra" description="Type a calculation or command such as plot, solve, factor, derivative, integral, table, roots, extrema, or intersection.">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
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
            <div ref={graphExportRef}>
              <GraphPanel
                plots={plots}
                onChange={handlePlotsChange}
                tableRange={{ start: tableStart, end: tableEnd, step: tableStep }}
                onTableRangeChange={({ start, end, step }) => {
                  setTableStart(start);
                  setTableEnd(end);
                  setTableStep(step);
                }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Results</h2>
              <button type="button" onClick={() => setResults([])} className="rounded-full bg-slate-100 p-2 dark:bg-white/10" title="Clear results" aria-label="Clear results"><Trash2 className="h-4 w-4" /></button>
            </div>
            {results.length === 0 ? <EmptyPanel text="Run a command to see interpretation, exact result, numeric checks, and related output." /> : results.map((result) => <ResultCardView key={result.id} result={result} />)}
          </div>
        </div>
        <div className="mt-5">
          <AlgebraObjectsPanel
            objects={workspaceObjects}
            selected={selectedAlgebra}
            protocol={protocol}
            graph={dynamicGraph}
            graphHealth={dynamicHealth}
            commandSummary={commandSummary}
            onSelect={selectWorkspaceObject}
            onRename={renameWorkspaceObject}
            onEditDefinition={editWorkspaceDefinition}
            onPatch={patchWorkspaceObject}
            onDuplicate={duplicateWorkspaceObject}
            onDelete={deleteWorkspaceObject}
            onReplay={replayConstructionStep}
            onContextMenu={(event, ref) => {
              event.preventDefault();
              setSelectedAlgebra(ref);
              setContextMenu({ x: event.clientX, y: event.clientY, target: { type: "algebra", ref } });
            }}
          />
        </div>
      </SectionCard>}

      {workspaceView === "data" && <SectionCard title="CAS, Spreadsheet, Tables, And Commands" description="Use GeoGebra-style commands, editable value tables, spreadsheet formulas, regression models, and live function analysis.">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <SpreadsheetPanel
            grid={spreadsheet}
            onChange={setSpreadsheet}
            onScatter={(points) => {
              recordWorkspaceStep("Add spreadsheet scatter", `${points.length} spreadsheet points linked to graph.`);
              setPlots((current) => [{ id: crypto.randomUUID(), expression: "spreadsheet data", color: "#ec4899", kind: "scatter" as PlotKind, points, visible: true }, ...current].slice(0, 10));
            }}
            onRegression={(model, points) => {
              const regression = regressionModel(points, model);
              recordWorkspaceStep("Add spreadsheet regression", `${model} regression from spreadsheet.`);
              setPlots((current) => [{ id: crypto.randomUUID(), expression: regression.expression, color: "#14b8a6", kind: "regression" as PlotKind, points, visible: true }, ...current].slice(0, 10));
              setResults((current) => [{ id: crypto.randomUUID(), input: `${model} regression`, interpretation: "Spreadsheet regression", result: regression.expression, detail: regression.detail, table: points.slice(0, 12), graphExpression: regression.expression }, ...current].slice(0, 12));
            }}
          />
          <FunctionAnalysisPanel
            plot={plots.find((plot) => plot.visible !== false && (plot.kind ?? inferPlotKind(plot.expression)) === "function") ?? plots[0]}
            onCommand={(command) => {
              setInput(command);
              const analysis = interpretInput(command);
              setResults((current) => [analysis, ...current].slice(0, 12));
              if (analysis.graphExpression) setPlots((current) => [{ id: crypto.randomUUID(), expression: analysis.graphExpression!, color: colors[current.length % colors.length], kind: "function" as PlotKind, visible: true }, ...current].slice(0, 10));
            }}
          />
        </div>
      </SectionCard>}

      {workspaceView === "3d" && <SectionCard title="3D Graphing And Solids Lab" description="Explore 3D axes, points, vectors, planes, surfaces, solids, cross-sections, and camera controls.">
        <div
          className="grid items-start gap-3"
          style={{
            gridTemplateColumns:
              controls3dOpen && inspector3dOpen
                ? "minmax(250px, 300px) minmax(460px, 1fr) minmax(290px, 340px)"
                : controls3dOpen
                  ? "minmax(250px, 300px) minmax(520px, 1fr)"
                  : inspector3dOpen
                    ? "minmax(520px, 1fr) minmax(290px, 340px)"
                    : "minmax(0, 1fr)",
          }}
        >
          {controls3dOpen && (
            <aside className="min-h-0 space-y-3 xl:sticky xl:top-24">
              <HorizontalPanelHeader title="Controls" side="left" onCollapse={() => setControls3dOpen(false)} />
              <SceneSetupTabs3D
                selected3d={selected3d}
                selected3dTransform={selected3dTransform}
                surface={surface}
                solid={solid}
                surfaceExpression={surfaceExpression}
                surfaceScale={surfaceScale}
                height3d={height3d}
                crossSection={crossSection}
                sceneAnimationSpeed={sceneAnimationSpeed}
                showSurface={showSurface}
                showSolid={showSolid}
                autoRotate3d={autoRotate3d}
                cameraPreset3d={cameraPreset3d}
                onSurface={(value) => {
                  setSurface(value);
                  setShowSurface(true);
                  add3dSceneObject("surface", { surface: value, label: value });
                }}
                onSolid={(value) => {
                  setSolid(value);
                  setShowSolid(true);
                  add3dSceneObject("solid", { solid: value, label: value });
                }}
                onObject={(id) => add3dSceneObject(id, { solid: threeObjectSolidMap[id], label: threeObjectLabels[id] })}
                onSurfaceExpression={setSurfaceExpression}
                onSurfaceScale={setSurfaceScale}
                onHeight={setHeight3d}
                onCrossSection={setCrossSection}
                onAnimationSpeed={setSceneAnimationSpeed}
                onShowSurface={setShowSurface}
                onShowSolid={setShowSolid}
                onAutoRotate={setAutoRotate3d}
                onCamera={setCameraPreset3d}
                onZoomIn={() => setZoom3d((value) => Math.min(1.8, roundTo(value + 0.1, 2)))}
                onZoomOut={() => setZoom3d((value) => Math.max(0.6, roundTo(value - 0.1, 2)))}
                onReset={() => { setZoom3d(1); setSurfaceScale(1); setCrossSection(0); setCameraPreset3d("isometric"); }}
                onSelectTool={() => {
                  setSelected3d("");
                  setDrag3d(null);
                  setProjectStatus("3D Select tool ready. Click an object in the scene or object list.");
                }}
                onNudge={(axis, amount) => update3dTransform(selected3d, { position: selected3dTransform.position.map((value, index) => index === axis ? roundTo(value + amount, 2) : value) as [number, number, number] })}
                onRotateAxis={(axis, amount) => update3dTransform(selected3d, { rotation: selected3dTransform.rotation.map((value, index) => index === axis ? roundTo(value + amount, 2) : value) as [number, number, number] })}
                onScale={(amount) => update3dTransform(selected3d, { scale: Math.max(0.2, roundTo(selected3dTransform.scale + amount, 2)) })}
                onMaterial={(material) => update3dTransform(selected3d, { material })}
                onOpacity={(opacity) => update3dTransform(selected3d, { opacity })}
                onDuplicate={() => duplicate3dObject()}
                onDelete={() => delete3dObject()}
                onRestore={() => restore3dObject()}
                onLock={() => update3dTransform(selected3d, { locked: !selected3dTransform.locked })}
                onTrace={() => update3dTransform(selected3d, { trace: !selected3dTransform.trace })}
              />
            </aside>
          )}

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap gap-2">
                {!controls3dOpen && <button type="button" onClick={() => setControls3dOpen(true)} className="action-secondary"><PanelLeftOpen className="h-4 w-4" />Controls</button>}
                <button type="button" onClick={() => { setSelected3d(""); setDrag3d(null); setProjectStatus("3D Select tool ready. Click an object in the scene or object list."); }} className="action-secondary">
                  <MousePointer2 className="h-4 w-4" /> Select
                </button>
                <button type="button" onClick={() => setAutoRotate3d((value) => !value)} className={autoRotate3d ? "action-primary" : "action-secondary"}>
                  <RotateCcw className="h-4 w-4" /> {autoRotate3d ? "Pause rotation" : "Start rotation"}
                </button>
                {!inspector3dOpen && <button type="button" onClick={() => setInspector3dOpen(true)} className="action-secondary"><PanelRightOpen className="h-4 w-4" />Objects</button>}
              </div>
              <p className="px-2 text-xs font-bold text-slate-500 dark:text-slate-400">Esc deselects. Delete removes selected object.</p>
            </div>

            <div className="grid min-h-[min(68vh,720px)] gap-3 2xl:grid-cols-[minmax(260px,32%)_minmax(420px,1fr)]">
              <Workspace3DProjectionPane
                selected={selected3d}
                transform={selected3dTransform}
                surface={surface}
                surfaceScale={surfaceScale}
                solid={solid}
                solidSize={height3d}
                crossSection={crossSection}
                showSurface={showSurface}
                showSolid={showSolid}
              />
              <div className="min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm dark:border-white/10">
                <ThreeSceneWrapper height="min(68vh, 720px)" mobileHeight="min(56vh, 460px)" interactionLabel="Drag rotate - pinch zoom">
                  <ambientLight intensity={0.75} />
                  <directionalLight position={[5, 6, 4]} intensity={1.2} />
                  <Workspace3DScene
                    surface={surface}
                    surfaceExpression={surfaceExpression}
                    solid={solid}
                    surfaceScale={surfaceScale}
                    solidSize={height3d}
                    crossSection={crossSection}
                    showSurface={showSurface}
                    showSolid={showSolid}
                    autoRotate={autoRotate3d}
                    animationSpeed={sceneAnimationSpeed}
                    zoom={zoom3d}
                    performanceMode={performanceMode}
                    cameraPreset={cameraPreset3d}
                    selected={selected3d}
                    transforms={transforms3d}
                    addedObjects={added3dObjects}
                    dragging={drag3d}
                    onSelect={setSelected3d}
                    onDrag={setDrag3d}
                    onTransform={update3dTransform}
                    onContextMenu={(event, id) => {
                      event.stopPropagation();
                      setSelected3d(id);
                      setContextMenu({ x: event.nativeEvent.clientX, y: event.nativeEvent.clientY, target: { type: "3d", id } });
                    }}
                  />
                  <OrbitControls enablePan enableZoom enableDamping enabled={!drag3d} />
                </ThreeSceneWrapper>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <InfoPill title="Axes" text="X, Y, and Z directions are shown with colored vectors." />
              <InfoPill title="Surface" text="The mesh updates from the selected z=f(x,y) function." />
              <InfoPill title="Cross-section" text="The amber plane slices the surface at a chosen z-level." />
            </div>
          </div>

          {inspector3dOpen && (
            <aside className="min-h-0 space-y-3 xl:sticky xl:top-24">
              <HorizontalPanelHeader title="Objects" side="right" onCollapse={() => setInspector3dOpen(false)} />
              <InspectorTabs3D selected={selected3d} transform={selected3dTransform} transforms={transforms3d} addedObjects={added3dObjects} onSelect={setSelected3d} onTransform={update3dTransform} onVector={update3dVector} onRestore={restore3dObject} onDelete={delete3dObject} />
              <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white">3D Readout</p>
                <p>Surface: {surfaceFormula(surface, surfaceScale)}</p>
                <p>Cross-section plane: z = {roundTo(crossSection, 2)}</p>
                <p>Camera zoom: {roundTo(zoom3d * 100, 0)}%</p>
              </div>
              <GizmoReadout3D selected={selected3d} transform={selected3dTransform} />
            </aside>
          )}
        </div>
      </SectionCard>}

      {workspaceView === "geometry" && <SectionCard title="Geometry Constructor" description="Create points, lines, circles, polygons, drag points, and inspect live measurements.">
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid min-h-0 gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
            <div className="min-h-0">
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(event.target.files)} />
              <GeometryToolPalette
                activeTool={tool}
                onTool={setTool}
                onSelectAll={() => setSelectedPointIds(construction.points.map((point) => point.id))}
                onMoveSelected={() => setConstruction((current) => transformSelectedPoints(current, selectedPointIds, "translate"))}
                onRotateSelected={() => setConstruction((current) => transformSelectedPoints(current, selectedPointIds, "rotate"))}
                onDilateSelected={() => setConstruction((current) => transformSelectedPoints(current, selectedPointIds, "dilate"))}
                onUndo={undoConstruction}
                onRedo={redoWorkspace}
                onDeleteSelected={() => deleteGeometryObject()}
                onShowHide={toggleSelectedGeometryVisibility}
                onLockSelected={() => toggleGeometryLock()}
                onTraceSelected={() => setSelectedGeometryTrace(true)}
                onStopTrace={() => setSelectedGeometryTrace(false)}
                onClearTrace={clearGeometryTrace}
                onReset={() => { setConstruction(initialConstruction); setSelectedPointIds([]); setPolygonDraft([]); }}
                onSave={saveConstruction}
                onLoad={loadConstruction}
                onAddImage={() => imageInputRef.current?.click()}
              />
            </div>
            <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-100 px-3 py-2 dark:bg-white/10">
              <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <input type="checkbox" checked={showGeometryUnits} onChange={(event) => setShowGeometryUnits(event.target.checked)} className="h-4 w-4 accent-cyan-500" />
                Show graph units
              </label>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">1 unit = 40 grid pixels, origin at board center</span>
            </div>
            <svg
              ref={svgRef}
              data-export="geometry"
              viewBox="0 0 640 420"
              role="application"
              tabIndex={0}
              aria-label="Geometry constructor. Select a point and use arrow keys to nudge it. Press Escape to return to select mode."
              onPointerDown={handleBoardPointerDown}
              onPointerMove={handleBoardPointerMove}
              onContextMenu={handleGeometryContextMenu}
              onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragPointId(null); setDragGeometry(null); setDragImageId(null); }}
              onPointerLeave={() => { setDragPointId(null); setDragGeometry(null); setDragImageId(null); }}
              className="h-[min(420px,68vh)] min-h-[320px] w-full touch-none rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 sm:h-[420px]"
            >
              <title>Math Universe Geometry Construction</title>
              <GeometryGrid showUnits={showGeometryUnits} />
              {workspaceImages.filter((image) => image.visible !== false).map((image) => (
                <g key={image.id}>
                  <image
                    data-image-id={image.id}
                    href={image.src}
                    x={image.x}
                    y={image.y}
                    width={image.width}
                    height={image.height}
                    opacity={image.opacity}
                    preserveAspectRatio="xMidYMid meet"
                    className="cursor-move"
                  />
                  {selectedImageId === image.id && <rect x={image.x} y={image.y} width={image.width} height={image.height} fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="8 6" pointerEvents="none" />}
                </g>
              ))}
              <ConstraintOverlays construction={construction} />
              {construction.loci.map((locus) => <GeometryLocus key={locus.id} locus={locus} />)}
              {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "polygon", polygon.id)} />)}
              {construction.arcs.map((arc) => <GeometryArc key={arc.id} arc={arc} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "arc", arc.id)} />)}
              {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "line", line.id)} />)}
              {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "circle", circle.id)} />)}
              {polygonDraft.length > 1 && <PolygonDraftPreview draft={polygonDraft} points={construction.points} />}
              {construction.points.filter((point) => point.style?.visible !== false).map((point) => (
                <g key={point.id}>
                  {point.style?.trace && <circle cx={point.x} cy={point.y} r={(point.style?.size ?? 9) + 12} fill="none" stroke={point.style?.color ?? "#06b6d4"} strokeDasharray="4 8" strokeWidth="4" opacity="0.28" />}
                  <circle
                    data-point-id={point.id}
                    cx={point.x}
                    cy={point.y}
                    r={point.style?.size ?? 9}
                    fill={selectedPointIds.includes(point.id) || polygonDraft.includes(point.id) ? "#f59e0b" : point.style?.color ?? "#06b6d4"}
                    stroke={isSelectedGeometry(selectedGeometry, "point", point.id) ? "#f97316" : "#0f172a"}
                    strokeWidth={isSelectedGeometry(selectedGeometry, "point", point.id) ? 4 : 2}
                    opacity={point.style?.opacity ?? 1}
                    className="cursor-pointer"
                  />
                  {point.style?.labelMode !== "hidden" && <text x={point.x + 12} y={point.y - 10} fill="#0f172a" className="select-none text-xs font-bold dark:fill-slate-100">{pointLabelText(point)}</text>}
                </g>
              ))}
            </svg>
            <p className="rounded-2xl bg-cyan-50 p-3 text-xs font-semibold leading-5 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
              Touch mode: choose a tool, tap to place points, then drag existing points. Use the page outside the board to scroll.
            </p>
            <HiddenGeometryExport refSetter={(node) => { geometryExportRef.current = node; }} construction={construction} images={workspaceImages} showUnits={showGeometryUnits} />
            </div>
          </div>
          <div className="space-y-3 lg:sticky lg:top-24">
            <ConstructionHelp tool={tool} />
            <GeometryObjectPanel
              selected={selectedGeometry}
              construction={construction}
              locked={selectedGeometry ? lockedGeometryIds.includes(selectedGeometry.id) : false}
              onPointChange={updateSelectedPoint}
              onStyleChange={updateSelectedGeometryStyle}
              onRadiusChange={updateSelectedCircleRadius}
              onDuplicate={duplicateGeometryObject}
              onDelete={deleteGeometryObject}
              onRestore={restoreGeometryObject}
              onToggleLock={toggleGeometryLock}
            />
            <ImageObjectPanel
              image={workspaceImages.find((image) => image.id === selectedImageId) ?? null}
              onChange={updateSelectedImage}
              onDelete={deleteSelectedImage}
            />
            <Measurements construction={construction} />
            <ConstraintPanel construction={construction} />
          </div>
        </div>
      </SectionCard>}
      {contextMenu && (
        <ObjectContextMenu
          state={contextMenu}
          onClose={() => setContextMenu(null)}
          onDuplicate={() => {
            contextMenu.target.type === "algebra" ? duplicateWorkspaceObject(contextMenu.target.ref) : contextMenu.target.type === "3d" ? duplicate3dObject(contextMenu.target.id) : duplicateGeometryObject(contextMenu.target);
            setContextMenu(null);
          }}
          onDelete={() => {
            contextMenu.target.type === "algebra" ? deleteWorkspaceObject(contextMenu.target.ref) : contextMenu.target.type === "3d" ? delete3dObject(contextMenu.target.id) : deleteGeometryObject(contextMenu.target);
            setContextMenu(null);
          }}
          onRestore={() => {
            contextMenu.target.type === "algebra" ? patchWorkspaceObject(contextMenu.target.ref, { visible: true, trace: false }) : contextMenu.target.type === "3d" ? restore3dObject(contextMenu.target.id) : restoreGeometryObject(contextMenu.target);
            setContextMenu(null);
          }}
          onLock={() => {
            if (contextMenu.target.type === "algebra") patchWorkspaceObject(contextMenu.target.ref, { locked: true });
            else if (contextMenu.target.type === "3d") update3dTransform(contextMenu.target.id, { locked: !selected3dTransform.locked });
            else toggleGeometryLock(contextMenu.target);
            setContextMenu(null);
          }}
          onRename={() => {
            const target = contextMenu.target;
            const ref = target.type === "algebra" ? target.ref : target.type === "3d" ? { kind: "3d" as const, id: target.id } : { kind: target.type, id: target.id };
            const next = window.prompt("Rename object", objectDisplayName(workspaceObjects, ref));
            if (next) renameWorkspaceObject(ref, next);
            setContextMenu(null);
          }}
          onTrace={() => {
            const target = contextMenu.target;
            const ref = target.type === "algebra" ? target.ref : target.type === "3d" ? { kind: "3d" as const, id: target.id } : { kind: target.type, id: target.id };
            patchWorkspaceObject(ref, { trace: true });
            setContextMenu(null);
          }}
        />
      )}
    </div>
  );
}

function interpretInput(input: string): ResultCard {
  const normalized = input.trim();
  try {
    const command = parseWorkspaceCommand(normalized);
    if (command.name === "plot") {
      const expression = normalizePlotExpression(command.args.join(", ") || normalized);
      return { id: crypto.randomUUID(), input, interpretation: "2D plot", result: `Added y = ${expression}`, detail: "The expression is plotted over x from -10 to 10." };
    }
    if (command.name === "solve") return solveCommand(command.args[0] ?? "", input);
    if (command.name === "root") return rootsCommand(command.args[0] ?? "", input);
    if (command.name === "extremum") return extremaCommand(command.args[0] ?? "", input);
    if (command.name === "intersect") return intersectCommand(command.args.join(" and "), input);
    if (command.name === "relation") return relationCommand(command.args, input);
    if (command.name === "distance") return distanceCommand(command.args, input);
    if (command.name === "angle") return angleCommand(command.args, input);
    if (command.name === "conic") return conicCommand(command.args.join(","), input);
    if (command.name === "line" || command.name === "segment" || command.name === "ray") return linearObjectCommand(command.name, command.args, input);
    if (command.name === "tangent") return tangentCommand(command.args, input);
    if (command.name === "locus") return locusCommand(command.args, input);
    if (command.name === "table") return tableCommand(command.args, input);
    if (command.name === "dynamictable") return dynamicTableCommand(command.args, input);
    if (command.name === "sequence") return sequenceCommand(command.args, input);
    if (command.name === "list") return listCommand(command.args, input);
    if (command.name === "filldown") return fillDownCommand(command.args, input);
    if (command.name === "rangecsv") return rangeCsvCommand(command.args, input);
    if (command.name === "cas") return casLinkedCommand(command.args, input);
    if (command.name === "substitute") return substituteCommand(command.args, input);
    if (command.name === "simplify") return simplifyCommand(command.args[0] ?? "", input);
    if (command.name === "expand") return expandCommand(command.args[0] ?? "", input);
    if (command.name === "limit") return limitCommand(command.args, input);
    if (command.name === "series") return seriesCommand(command.args, input);
    if (command.name === "matrix") return matrixCommand(command.args.join(","), input);
    if (command.name === "determinant") return determinantCommand(command.args.join(","), input);
    if (command.name === "transpose") return transposeCommand(command.args.join(","), input);
    if (command.name === "inverse") return inverseCommand(command.args.join(","), input);
    if (command.name === "plane") return plane3dCommand(command.args, input);
    if (command.name === "sphere" || command.name === "cone" || command.name === "cylinder") return solid3dCommand(command.name, command.args, input);
    if (command.name === "slice") return slice3dCommand(command.args, input);
    if (command.name === "gizmo") return gizmoCommand(command.args, input);
    if (command.name === "measure3d") return measure3dCommand(command.args, input);
    if (command.name === "rotate" || command.name === "translate" || command.name === "dilate" || command.name === "mirror") return transformActionCommand(command.name, command.args, input);
    if (command.name === "setcolor" || command.name === "showlabel" || command.name === "setvisible" || command.name === "settrace" || command.name === "setopacity") return styleActionCommand(command.name, command.args, input);
    if (command.name === "startanimation" || command.name === "stopanimation") return animationActionCommand(command.name, command.args, input);
    if (command.name === "point") return definitionCommandCard(input, "2D point definition", "Use A=(x,y) in the input bar to create a live draggable point.");
    if (command.name === "vector") return vectorCommand(command.args, input);
    if (command.name === "circle") return definitionCommandCard(input, "Circle definition", "Use c: x^2+y^2=16 or the circle tool to create a live circle.");
    if (command.name === "surface") return definitionCommandCard(input, "3D surface definition", "Use z=sin(x)*cos(y) or mode=3d to create a live surface.");
    if (command.name === "slider") return definitionCommandCard(input, "Slider definition", "Slider objects are registered in the dynamic kernel and will drive animation bindings in Phase 4.");
    if (command.name === "derivative") {
      const expression = command.args[0] ?? "";
      const symbolic = trySymbolic(() => symbolicDerivative(expression));
      const derivative = symbolic?.result ?? derivativeText(expression);
      return { id: crypto.randomUUID(), input, interpretation: symbolic ? "Symbolic derivative" : "Derivative", result: derivative, detail: symbolic?.detail ?? "Symbolic support for common polynomial, sine, and cosine expressions.", steps: symbolic?.steps ?? derivativeSteps(expression, derivative), related: [`plot ${expression}`, `plot ${derivative}`], graphExpression: derivative };
    }
    if (command.name === "integral") {
      const expression = command.args[0] ?? "";
      const symbolic = trySymbolic(() => symbolicIntegral(expression));
      const integral = symbolic?.result ?? integralText(expression);
      const graphExpression = integral.replace(/\s*\+\s*C$/, "");
      return { id: crypto.randomUUID(), input, interpretation: symbolic ? "Symbolic integral" : "Indefinite integral", result: integral, detail: symbolic?.detail ?? "Power-rule antiderivative support for common polynomial terms.", steps: symbolic?.steps ?? integralSteps(expression, integral), related: [`derivative ${graphExpression}`, `plot ${graphExpression}`], graphExpression };
    }
    if (command.name === "factor") return factorCommand(command.args[0] ?? "", input);
    if (/^area\s+circle\s+radius\s+/i.test(normalized)) {
      const radius = Number(normalized.replace(/^area\s+circle\s+radius\s+/i, ""));
      return { id: crypto.randomUUID(), input, interpretation: "Circle area", result: `Area = ${roundTo(Math.PI * radius * radius, 4)}`, detail: `Formula: A = pi r^2 with r = ${radius}.`, steps: [`Use A = pi r^2.`, `Substitute r = ${radius}.`, `A = pi * ${radius}^2 = ${roundTo(Math.PI * radius * radius, 4)}.`] };
    }
    const value = evaluateMathExpression(normalized, 0);
    return { id: crypto.randomUUID(), input, interpretation: "Calculator", result: `${roundTo(value, 10)}`, detail: "Numeric evaluation with constants, trig, logs, powers, roots, and arithmetic." };
  } catch (error) {
    return parserErrorCard(input, error);
  }
}

function parseWorkspaceCommand(input: string): { name: string; args: string[] } {
  const bracket = input.match(/^([a-z]+)\s*[\[(](.*)[\])]$/i);
  if (bracket) return { name: commandAlias(bracket[1]), args: splitCommandArgs(bracket[2]) };
  const word = input.match(/^([a-z]+)\s+(.+)$/i);
  if (word) {
    const name = commandAlias(word[1]);
    if (name === "table") return { name, args: splitLooseTableArgs(word[2]) };
    if (name === "intersect") return { name, args: word[2].split(/\s+and\s+|,/i).map((part) => part.trim()).filter(Boolean) };
    if (name === "sequence") return { name, args: splitLooseSequenceArgs(word[2]) };
    if (name === "substitute") return { name, args: splitLooseSubstituteArgs(word[2]) };
    return { name, args: [word[2].trim()] };
  }
  return { name: "calculator", args: [input] };
}

function commandAlias(name: string) {
  const compact = name.toLowerCase();
  const resolved = normalizeCommandName(compact);
  if (!resolved) throw new Error(`Unknown command "${name}".`);
  return resolved;
}

function splitCommandArgs(value: string) {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;
    if (char === "," && depth === 0) {
      args.push(current.trim());
      current = "";
    } else current += char;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function splitLooseTableArgs(value: string) {
  const commaArgs = splitCommandArgs(value);
  if (commaArgs.length > 1) return commaArgs;
  const natural = value.match(/^(.+?)\s+from\s+(-?\d+(?:\.\d+)?)\s+to\s+(-?\d+(?:\.\d+)?)(?:\s+step\s+(-?\d+(?:\.\d+)?))?$/i);
  if (natural) return [natural[1], natural[2], natural[3], natural[4] ?? "1"];
  const named = value.match(/^(.+?)\s+start\s*=\s*(-?\d+(?:\.\d+)?)\s+end\s*=\s*(-?\d+(?:\.\d+)?)(?:\s+step\s*=\s*(-?\d+(?:\.\d+)?))?$/i);
  if (named) return [named[1], named[2], named[3], named[4] ?? "1"];
  const match = value.match(/^(.+?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)$/);
  return match ? [match[1], match[2], match[3], match[4]] : [value.trim()];
}

function splitLooseSequenceArgs(value: string) {
  const commaArgs = splitCommandArgs(value);
  if (commaArgs.length > 1) return commaArgs;
  const range = value.match(/^(.+?)\s+([a-z]\w*)\s*=\s*(-?\d+(?:\.\d+)?)\s*\.\.\s*(-?\d+(?:\.\d+)?)(?:\s+step\s+(-?\d+(?:\.\d+)?))?$/i);
  if (range) return [range[1], range[2], range[3], range[4], range[5] ?? "1"];
  const natural = value.match(/^(.+?)\s+for\s+([a-z]\w*)\s+from\s+(-?\d+(?:\.\d+)?)\s+to\s+(-?\d+(?:\.\d+)?)(?:\s+step\s+(-?\d+(?:\.\d+)?))?$/i);
  if (natural) return [natural[1], natural[2], natural[3], natural[4], natural[5] ?? "1"];
  return [value.trim(), "n", "1", "10", "1"];
}

function splitLooseSubstituteArgs(value: string) {
  const commaArgs = splitCommandArgs(value);
  if (commaArgs.length > 1) return commaArgs;
  const natural = value.split(/\s+with\s+/i);
  if (natural.length < 2) return [value.trim()];
  const assignments = natural.slice(1).join(" with ").split(/\s*,\s*|\s+and\s+/i).map((part) => part.trim()).filter(Boolean);
  return [natural[0].trim(), ...assignments];
}

function parserErrorCard(input: string, error: unknown): ResultCard {
  const message = error instanceof Error ? error.message : "Unsupported input";
  const suggestions = suggestCommands(input);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Parser suggestion",
    result: message,
    detail: `Try: ${suggestions.join("  |  ")}`,
    steps: ["Use Command[arguments] or command arguments.", "Separate multiple arguments with commas.", "Use * for multiplication when the expression is ambiguous."],
  };
}

function suggestCommands(input: string) {
  const lower = input.toLowerCase();
  const registryExamples = commandExamplesFor(lower, 4);
  if (registryExamples.length) return registryExamples;
  if (lower.includes("der")) return ["Derivative[x^3-2*x]", "plot 3*x^2-2"];
  if (lower.includes("int")) return ["Integral[3*x^2]", "Table[x^2, -3, 3, 1]"];
  if (lower.includes("inter")) return ["Intersect[x^2, 2*x+3]"];
  if (lower.includes("table")) return ["Table[sin(x), -3, 3, 0.5]"];
  return ["Root[x^2-4]", "Solve[x^2-5*x+6=0]", "Sequence[n^2, n, 1, 6]"];
}

function normalizeTemplateRouteParam(value: string) {
  return value.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
}

function normalizePlotExpression(input: string) {
  return input.replace(/^plot\s+/i, "").replace(/^y\s*=\s*/i, "").trim();
}

function mathToBoardPoint(x: number, y: number) {
  return { x: 320 + x * 40, y: 210 - y * 40 };
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
  if (!/^[0-9x+\-*/().,\s*MATHPIEabceghilnopqrstxyz]+$/i.test(safe) || /[;={}\[\]'"]/.test(safe)) throw new Error("Unsupported expression");
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
  const kernelObjects = parseTwoKernelObjects(parts);
  if (kernelObjects) {
    const hits = kernelIntersectObjects(kernelObjects[0], kernelObjects[1]);
    return {
      id: crypto.randomUUID(),
      input,
      interpretation: "Kernel intersection",
      result: hits.length ? hits.map((hit) => `(${roundTo(hit.x, 5)}, ${roundTo(hit.y, 5)})${hit.multiplicity === 2 ? " tangent" : ""}`).join(", ") : "No supported intersections",
      detail: hits.length ? `${hits[0].source} solver with boundary checks and multiplicity.` : "No intersection found for the supported object pair.",
      table: hits.map((hit) => ({ x: roundTo(hit.x, 5), y: roundTo(hit.y, 5), label: hit.source })),
      steps: ["Parse both objects into the 2D kernel.", "Solve the correct intersection system.", "Filter by segment/ray boundaries and dedupe points."],
    };
  }
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

function relationCommand(args: string[], input: string): ResultCard {
  const objects = parseTwoKernelObjects(args);
  if (!objects) throw new Error("Use Relation[Line[(0,0),(1,1)], Line[(0,1),(1,2)]] or Relation[x^2+y^2=9, Line[(-3,0),(3,0)]].");
  const result = relationBetween(objects[0], objects[1]);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Geometry relation",
    result: `${result.relation} (${Math.round(result.confidence * 100)}%)`,
    detail: result.detail,
    steps: proofHintsForRelation(result),
  };
}

function distanceCommand(args: string[], input: string): ResultCard {
  const points = args.map(parsePointArgument).filter(Boolean) as KernelPoint[];
  if (points.length < 2) throw new Error("Use Distance[(0,0), (3,4)].");
  const value = kernelDistance(points[0], points[1]);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Distance",
    result: `${roundTo(value, 6)}`,
    detail: "Distance kernel uses sqrt((x2-x1)^2 + (y2-y1)^2).",
    steps: [`dx = ${roundTo(points[1].x - points[0].x, 6)}.`, `dy = ${roundTo(points[1].y - points[0].y, 6)}.`, `distance = ${roundTo(value, 6)}.`],
  };
}

function angleCommand(args: string[], input: string): ResultCard {
  const points = args.map(parsePointArgument).filter(Boolean) as KernelPoint[];
  if (points.length < 3) throw new Error("Use Angle[(1,0), (0,0), (0,1)].");
  const a = points[0], vertex = points[1], b = points[2];
  const va = kernelVector(vertex, a);
  const vb = kernelVector(vertex, b);
  const dot = va.x * vb.x + va.y * vb.y;
  const magnitude = Math.hypot(va.x, va.y) * Math.hypot(vb.x, vb.y) || 1;
  const degrees = THREE.MathUtils.radToDeg(Math.acos(Math.max(-1, Math.min(1, dot / magnitude))));
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Angle",
    result: `${roundTo(degrees, 4)} deg`,
    detail: "Angle kernel uses vector dot product around the middle point.",
    steps: ["Build vectors from the vertex.", "Compute dot product and magnitudes.", "Apply arccos(dot / |a||b|)."],
  };
}

function conicCommand(body: string, input: string): ResultCard {
  const item = parseConicEquation(body);
  if (!item) throw new Error("Use Conic[x^2/9+y^2/4=1], Conic[x^2+y^2=16], or Conic[y=x^2].");
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Conic",
    result: `${item.type}: ${formatConicCoefficients(item.coefficients)}`,
    detail: "Conic registered as Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0 for intersection and relation tools.",
    steps: ["Normalize the equation.", "Classify by discriminant B^2 - 4AC.", "Store coefficients for line/conic intersections."],
  };
}

function linearObjectCommand(name: string, args: string[], input: string): ResultCard {
  const points = args.map(parsePointArgument).filter(Boolean) as KernelPoint[];
  if (points.length < 2) throw new Error(`Use ${name}[pointA, pointB], for example ${name}[(0,0),(4,3)].`);
  const object = name === "segment" ? kernelSegment(points[0], points[1]) : name === "ray" ? kernelRay(points[0], points[1]) : kernelLine(points[0], points[1]);
  const length = kernelDistance(object.a, object.b);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: `${name[0].toUpperCase()}${name.slice(1)} object`,
    result: `${name} through (${object.a.x}, ${object.a.y}) and (${object.b.x}, ${object.b.y})`,
    detail: `${name} length/vector magnitude reference: ${roundTo(length, 6)}.`,
    steps: ["Parse two coordinate points.", "Create a boundary-aware linear object.", "Expose it to intersection and relation commands."],
  };
}

function vectorCommand(args: string[], input: string): ResultCard {
  const points = args.map(parsePointArgument).filter(Boolean) as KernelPoint[];
  if (points.length < 2) throw new Error("Use Vector[(0,0), (3,2)].");
  const value = kernelVector(points[0], points[1]);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Vector",
    result: `<${roundTo(value.x, 6)}, ${roundTo(value.y, 6)}>`,
    detail: `Magnitude = ${roundTo(Math.hypot(value.x, value.y), 6)}.`,
    steps: ["Subtract start coordinates from end coordinates.", "Use the result as translation direction or slope evidence."],
  };
}

function tangentCommand(args: string[], input: string): ResultCard {
  const pointArg = parsePointArgument(args[0] ?? "");
  const conicArg = parseKernelObject(args[1] ?? "");
  if (!pointArg || !conicArg) throw new Error("Use Tangent[(3,0), x^2+y^2=9].");
  const probe = kernelLine(kernelPoint(pointArg.x - 1, pointArg.y), kernelPoint(pointArg.x + 1, pointArg.y));
  const relation = relationBetween(probe, conicArg);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Tangent helper",
    result: relation.relation === "tangent" ? "horizontal tangent candidate" : "tangent construction registered",
    detail: "Phase 2 exposes tangent checks through the relation/intersection kernel; canvas construction uses the Tangent tool.",
    steps: ["Parse point and conic.", "Probe tangent multiplicity.", ...proofHintsForRelation(relation).slice(0, 2)],
  };
}

function locusCommand(args: string[], input: string): ResultCard {
  const center = parsePointArgument(args[0] ?? "") ?? kernelPoint(0, 0);
  const radius = 2;
  const table = Array.from({ length: 24 }, (_, index) => {
    const theta = (index / 24) * Math.PI * 2;
    return { x: roundTo(center.x + Math.cos(theta) * radius, 4), y: roundTo(center.y + Math.sin(theta) * radius, 4), label: "locus" };
  });
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Locus",
    result: `${table.length} sample points`,
    detail: "Browser-only locus sampling registered for trace/proof workflows.",
    steps: ["Choose a driving parameter.", "Sample positions around the path.", "Dedupe and render as a trace object."],
    table,
  };
}

function tableCommand(args: string[] | string, input: string): ResultCard {
  const parts = Array.isArray(args) ? args : [args];
  const expression = parts[0] ?? "x";
  const start = Number(parts[1] ?? -4);
  const end = Number(parts[2] ?? 4);
  const step = Math.abs(Number(parts[3] ?? 1)) || 1;
  const table = generateValueTable(expression, start, end, step);
  return { id: crypto.randomUUID(), input, interpretation: "Editable value table", result: `Generated ${table.length} rows`, detail: `x from ${start} to ${end} by ${step}. Change the table range controls in the graph panel for live tables.`, table, related: [`plot ${expression}`], graphExpression: expression };
}

function dynamicTableCommand(args: string[], input: string): ResultCard {
  const numericTail = args.slice(-3).map(Number);
  const hasRange = numericTail.every((value) => Number.isFinite(value));
  const expressions = (hasRange ? args.slice(0, -3) : args).map((item) => item.trim()).filter(Boolean);
  const [start, end, step] = hasRange ? numericTail : [-4, 4, 1];
  const dynamic = createDynamicTable(expressions.length ? expressions : ["x"], start, end, step, evaluateMathExpression);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Dynamic table view",
    result: `${dynamic.rows.length} rows for ${dynamic.expressions.join(", ")}`,
    detail: `Highlights roots/intercepts and exports ${dynamic.exportCsv.length} CSV characters.`,
    table: dynamic.rows.map((row) => ({ x: row.x, y: row.values[dynamic.expressions[0]], label: row.highlight ? "highlight" : "" })),
    related: dynamic.expressions.map((expression) => `plot ${expression}`),
    graphExpression: dynamic.expressions[0],
    steps: dynamic.classroomTasks,
  };
}

function sequenceCommand(args: string[], input: string): ResultCard {
  const [expression = "n", variable = "n", startRaw = "1", endRaw = "10", stepRaw = "1"] = args;
  const start = Number(startRaw);
  const end = Number(endRaw);
  const step = Math.abs(Number(stepRaw)) || 1;
  const rows: ResultTableRow[] = [];
  for (let value = start; value <= end && rows.length < 120; value += step) {
    const xExpression = expression.replace(new RegExp(`\\b${variable}\\b`, "g"), `(${value})`);
    rows.push({ x: value, y: roundTo(evaluateMathExpression(xExpression, value), 6), label: variable });
  }
  return { id: crypto.randomUUID(), input, interpretation: "Sequence", result: rows.map((row) => row.y).join(", "), detail: `${expression}, ${variable} = ${start}...${end}`, table: rows };
}

function listCommand(args: string[], input: string): ResultCard {
  const list = createListObject(args);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "List object",
    result: `[${list.values.join(", ")}]`,
    detail: `n=${list.length}, sum=${roundTo(list.sum, 6)}, mean=${roundTo(list.mean, 6)}, min=${list.min}, max=${list.max}`,
    steps: ["Parse numeric list entries.", "Store as a reusable list object.", "Expose summary values for spreadsheet and table workflows."],
  };
}

function fillDownCommand(args: string[], input: string): ResultCard {
  const [source = "D6", range = "D7:D12"] = args;
  const preview = fillDownFormula(initialSpreadsheet, source, range);
  const evaluated = evaluateSpreadsheetGrid(preview);
  const csv = rangeToCsv(evaluated.values, range);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Spreadsheet fill down",
    result: `${source} filled into ${range}`,
    detail: evaluated.errors.length ? evaluated.errors.map((error) => `${error.cell}: ${error.message}`).join("; ") : "Formula references were shifted relative to each destination cell.",
    steps: ["Read the source formula.", "Shift cell references by row/column offset.", "Evaluate the filled range and prepare CSV export."],
    table: csv.split("\n").map((line, index) => ({ x: index + 1, y: line.length, label: "csv" })),
  };
}

function rangeCsvCommand(args: string[], input: string): ResultCard {
  const range = args[0] ?? "A1:C6";
  const evaluated = evaluateSpreadsheetGrid(initialSpreadsheet);
  const csv = rangeToCsv(evaluated.values, range);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Spreadsheet range CSV",
    result: `${csv.split("\n").filter(Boolean).length} rows exported`,
    detail: csv || "No valid range data.",
    steps: ["Evaluate spreadsheet formulas.", `Read range ${range}.`, "Return CSV-ready text for export."],
  };
}

function casLinkedCommand(args: string[], input: string): ResultCard {
  const [command = "Simplify", expression = "x"] = args;
  const card = createCasCard(command, expression);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Linked CAS card",
    result: card.result,
    detail: card.detail,
    steps: [...card.steps, ...card.verificationPrompts],
    related: card.linkedGraphExpressions.map((expression) => `plot ${expression}`),
    graphExpression: card.linkedGraphExpressions[0],
  };
}

function substituteCommand(args: string[], input: string): ResultCard {
  const [expression = "", ...assignments] = args;
  let substituted = expression;
  assignments.forEach((assignment) => {
    const [name, value] = assignment.split("=").map((part) => part.trim());
    if (name && value) substituted = substituted.replace(new RegExp(`\\b${escapeRegExp(name)}\\b`, "g"), `(${value})`);
  });
  const symbolic = trySymbolic(() => symbolicSimplify(substituted));
  const result = symbolic?.result ?? `${roundTo(evaluateMathExpression(substituted, 0), 10)}`;
  return { id: crypto.randomUUID(), input, interpretation: "Substitute", result, detail: `${expression} -> ${substituted}`, steps: [`Start with ${expression}.`, `Apply ${assignments.join(", ")}.`, `Simplify/evaluate ${substituted}.`] };
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

function limitCommand(args: string[], input: string): ResultCard {
  const [expression = "sin(x)/x", variable = "x", targetRaw = "0"] = args;
  const target = Number(targetRaw);
  const offsets = [1e-1, 1e-2, 1e-3, 1e-4];
  const table = offsets.map((offset) => {
    const left = evaluateMathExpression(expression.replace(new RegExp(`\\b${escapeRegExp(variable)}\\b`, "g"), `(${target - offset})`), target - offset);
    const right = evaluateMathExpression(expression.replace(new RegExp(`\\b${escapeRegExp(variable)}\\b`, "g"), `(${target + offset})`), target + offset);
    return { x: offset, y: roundTo((left + right) / 2, 8), label: `h=${offset}` };
  });
  const estimate = table.at(-1)?.y ?? NaN;
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Limit",
    result: Number.isFinite(estimate) ? `lim ${variable}->${target} ${expression} = ${estimate}` : "Limit estimate unavailable",
    detail: "Two-sided numeric limit estimate. Exact symbolic limits are queued for the CAS expansion phase.",
    steps: [`Approach ${target} from the left and right.`, "Average the two finite estimates for each shrinking step.", "Compare the rows to see whether the values stabilize."],
    table,
    graphExpression: expression,
  };
}

function seriesCommand(args: string[], input: string): ResultCard {
  const [expression = "sin(x)", variable = "x", centerRaw = "0", orderRaw = "5"] = args;
  const center = Number(centerRaw);
  const order = Math.max(1, Math.min(8, Math.round(Number(orderRaw) || 5)));
  const compact = expression.replace(/\s+/g, "").toLowerCase();
  let result = `${expression} near ${variable}=${center}`;
  if (center === 0 && compact === "sin(x)") result = Array.from({ length: Math.ceil(order / 2) }, (_, index) => {
    const n = index * 2 + 1;
    return `${index % 2 ? "-" : "+"} x^${n}/${factorial(n)}`;
  }).join(" ").replace(/^\+\s*/, "");
  else if (center === 0 && compact === "cos(x)") result = Array.from({ length: Math.ceil((order + 1) / 2) }, (_, index) => {
    const n = index * 2;
    return `${index % 2 ? "-" : "+"} x^${n}/${factorial(n)}`;
  }).join(" ").replace(/^\+\s*/, "");
  else if (center === 0 && compact === "e^x") result = Array.from({ length: order + 1 }, (_, n) => `x^${n}/${factorial(n)}`).join(" + ");
  else result = "Series template registered; exact expansion for this expression lands in the CAS expansion phase.";
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Series",
    result,
    detail: `Taylor-style approximation request for ${expression} around ${center} to order ${order}.`,
    steps: ["Choose the expansion center.", "Use derivatives at the center as coefficients.", "Build polynomial terms up to the requested order."],
    related: [`plot ${expression}`],
  };
}

function matrixCommand(body: string, input: string): ResultCard {
  const matrix = parseMatrixLiteral(body);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Matrix",
    result: formatMatrix(matrix),
    detail: `${matrix.length} by ${matrix[0]?.length ?? 0} matrix object parsed for CAS/spreadsheet linking.`,
    steps: ["Read rows inside brackets.", "Convert every entry to a numeric cell.", "Register the matrix as an algebra object in the dynamic kernel."],
  };
}

function determinantCommand(body: string, input: string): ResultCard {
  const matrix = parseMatrixLiteral(body);
  const value = determinant(matrix);
  return { id: crypto.randomUUID(), input, interpretation: "Determinant", result: `${roundTo(value, 8)}`, detail: `det(${formatMatrix(matrix)})`, steps: ["Check the matrix is square.", "Apply recursive expansion for small matrices.", "Return the signed area/volume scaling factor."] };
}

function transposeCommand(body: string, input: string): ResultCard {
  const matrix = parseMatrixLiteral(body);
  const transposed = matrix[0].map((_, column) => matrix.map((row) => row[column]));
  return { id: crypto.randomUUID(), input, interpretation: "Transpose", result: formatMatrix(transposed), detail: "Rows and columns swapped.", steps: ["Read each column of the original matrix.", "Write it as a row in the new matrix."] };
}

function inverseCommand(body: string, input: string): ResultCard {
  const matrix = parseMatrixLiteral(body);
  if (matrix.length !== 2 || matrix[0].length !== 2 || matrix[1].length !== 2) throw new Error("Inverse currently supports 2 by 2 matrices.");
  const det = determinant(matrix);
  if (Math.abs(det) < 1e-9) throw new Error("Matrix is singular; determinant is zero.");
  const [[a, b], [c, d]] = matrix;
  const inverse = [[d / det, -b / det], [-c / det, a / det]];
  return { id: crypto.randomUUID(), input, interpretation: "Inverse", result: formatMatrix(inverse), detail: `1/det with det=${roundTo(det, 8)}.`, steps: ["For [[a,b],[c,d]], inverse is 1/(ad-bc) * [[d,-b],[-c,a]].", `det=${roundTo(det, 8)}.`, "Scale the adjugate matrix."] };
}

function plane3dCommand(args: string[], input: string): ResultCard {
  const plane = parsePlane3dArgs(args);
  if (!plane) throw new Error("Use Plane[(0,0,1), (0,0,1)] or Plane[z=1].");
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "3D plane",
    result: `point=(${formatPoint3(plane.point)}), normal=<${formatPoint3(plane.normal)}>`,
    detail: "Plane registered in the 3D kernel for slicing, intersections, and transform overlays.",
    steps: ["Parse a point and normal vector.", "Normalize the normal.", "Store plane as point-normal form."],
  };
}

function solid3dCommand(name: string, args: string[], input: string): ResultCard {
  const object = parseSolid3d(name, args);
  const measurement = object3Measurement(object);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "3D solid",
    result: `${measurement.label}: V=${roundTo(measurement.volume, 5)}, SA=${roundTo(measurement.surfaceArea, 5)}`,
    detail: measurement.detail,
    steps: ["Parse center/radius/height parameters.", "Create a true 3D object in kernel form.", "Compute volume and surface area for overlays."],
  };
}

function slice3dCommand(args: string[], input: string): ResultCard {
  const [solidText = "Sphere[(0,0,0),3]", planeText = "z=0"] = args.length >= 2 ? args : splitKernelObjectPair(args.join(","));
  const solid = parseObject3(solidText);
  const plane = parseObject3(planeText);
  if (!solid || !plane) throw new Error("Use Slice[Sphere[(0,0,0), 3], z=1].");
  const hits = intersect3(solid, plane);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "3D slice",
    result: hits.length ? hits.map(formatIntersection3).join("; ") : "No 3D intersection",
    detail: "3D kernel slice using line-plane, plane-plane, or sphere-plane intersection rules.",
    steps: ["Parse 3D objects.", "Select the correct intersection solver.", "Return point, line, or circular cross-section overlay."],
  };
}

function gizmoCommand(args: string[], input: string): ResultCard {
  const mode = ((args[0] ?? "translate").toLowerCase() as TransformMode3);
  if (!["translate", "rotate", "scale"].includes(mode)) throw new Error("Use Gizmo[translate], Gizmo[rotate], or Gizmo[scale].");
  const handles = createTransformGizmo(mode);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "3D transform gizmo",
    result: handles.map((handle) => `${handle.label} snap=${handle.snapStep}`).join(", "),
    detail: "Axis/ring/scale handle metadata for the selected 3D object. Visual handles are represented in the 3D readout and ready for canvas binding.",
    steps: ["Choose transform mode.", "Create axis-specific handles.", "Apply snap increments for precise classroom manipulation."],
  };
}

function measure3dCommand(args: string[], input: string): ResultCard {
  const object = parseObject3(args.join(","));
  if (!object) throw new Error("Use Measure3D[Sphere[(0,0,0), 3]] or Measure3D[Cylinder[(0,0,0), 2, 5]].");
  const measurement = object3Measurement(object);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "3D measurement",
    result: `${measurement.label}: V=${roundTo(measurement.volume, 5)}, SA=${roundTo(measurement.surfaceArea, 5)}`,
    detail: measurement.detail,
    steps: ["Recognize object type.", "Apply the matching 3D measurement formula.", "Expose result for labels and overlays."],
  };
}

function transformActionCommand(name: string, args: string[], input: string): ResultCard {
  const action = parseTransformCommand(name, args);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Dynamic transform action",
    result: describeTransformAction(action),
    detail: "Transformation commands now produce exact before/after coordinates and are ready for selected-object binding in Geometry and Algebra views.",
    table: [
      { x: roundTo(action.source.x, 6), y: roundTo(action.source.y, 6), label: "source" },
      { x: roundTo(action.result.x, 6), y: roundTo(action.result.y, 6), label: action.kind },
    ],
    steps: transformSteps(action.kind),
  };
}

function styleActionCommand(name: string, args: string[], input: string): ResultCard {
  const action = parseStyleAction(name, args);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Object style action",
    result: `${action.objectName}: ${Object.entries(action.patch).map(([key, value]) => `${key}=${value}`).join(", ")}`,
    detail: "The same style action shape is used by Geometry, 3D, Algebra, and the Inspector so object menus stay consistent.",
    steps: ["Resolve the object by name.", "Validate the requested style value.", "Apply the patch through the unified object/inspector action channel."],
  };
}

function animationActionCommand(name: string, args: string[], input: string): ResultCard {
  const action = createAnimationAction(name, args);
  return {
    id: crypto.randomUUID(),
    input,
    interpretation: "Animation action",
    result: `${action.target}: ${action.playing ? "playing" : "paused"} at ${action.speed}x`,
    detail: action.detail,
    steps: ["Resolve the target slider or scene.", "Set playback state.", "Keep the action browser-only so it can run offline in a saved project."],
  };
}

function transformSteps(kind: "rotate" | "translate" | "dilate" | "mirror") {
  const steps = {
    rotate: ["Move the point into center-relative coordinates.", "Apply the 2D rotation matrix.", "Move the result back to the original center."],
    translate: ["Read the movement vector.", "Add dx to x and dy to y.", "Return the translated coordinate."],
    dilate: ["Measure the point from the center.", "Multiply the center-relative vector by the scale factor.", "Return the scaled coordinate."],
    mirror: ["Project the point onto the mirror axis.", "Double the projection and subtract the original point.", "Return the reflected coordinate."],
  };
  return steps[kind];
}

function definitionCommandCard(input: string, interpretation: string, detail: string): ResultCard {
  const specName = input.match(/^([a-z]+)/i)?.[1] ?? "";
  const spec = specName ? resolveCommandSpec(specName) : null;
  return {
    id: crypto.randomUUID(),
    input,
    interpretation,
    result: spec?.signature ?? "Registered constructor",
    detail,
    steps: spec ? [`${spec.name} is registered in the ${spec.group} command group.`, spec.description, `Example: ${spec.examples[0] ?? spec.signature}`] : undefined,
  };
}

function parseTwoKernelObjects(args: string[]) {
  const pair = args.length >= 2 ? args : splitKernelObjectPair(args.join(","));
  if (pair.length < 2) return null;
  const first = parseKernelObject(pair[0]);
  const second = parseKernelObject(pair[1]);
  return first && second ? [first, second] as [KernelObject, KernelObject] : null;
}

function splitKernelObjectPair(value: string) {
  const output: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "[" || char === "(") depth += 1;
    if (char === "]" || char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      output.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) output.push(current.trim());
  return output;
}

function parseKernelObject(value: string): KernelObject | null {
  const trimmed = value.trim();
  const linear = trimmed.match(/^(line|segment|ray)\s*[\[(](.*)[\])]$/i);
  if (linear) {
    const points = splitKernelObjectPair(linear[2]).map(parsePointArgument).filter(Boolean) as KernelPoint[];
    if (points.length < 2) return null;
    if (linear[1].toLowerCase() === "segment") return kernelSegment(points[0], points[1]);
    if (linear[1].toLowerCase() === "ray") return kernelRay(points[0], points[1]);
    return kernelLine(points[0], points[1]);
  }
  const circleMatch = trimmed.match(/^circle\s*[\[(](.*)[\])]$/i);
  if (circleMatch) {
    const parts = splitKernelObjectPair(circleMatch[1]);
    const center = parsePointArgument(parts[0] ?? "");
    const radius = Number(parts[1]);
    if (center && Number.isFinite(radius)) return kernelCircle(center, radius);
  }
  const conicBody = trimmed.match(/^conic\s*[\[(](.*)[\])]$/i)?.[1] ?? trimmed;
  const parsedConic = parseConicEquation(conicBody);
  if (parsedConic) return parsedConic;
  return null;
}

function parsePointArgument(value: string) {
  return parseKernelPoint(value.replace(/^point\s*[\[(](.*)[\])]$/i, "$1"));
}

function formatConicCoefficients(coefficients: [number, number, number, number, number, number]) {
  const labels = ["A", "B", "C", "D", "E", "F"];
  return coefficients.map((value, index) => `${labels[index]}=${roundTo(value, 6)}`).join(", ");
}

function parsePlane3dArgs(args: string[]) {
  const body = args.join(",");
  const equationPlane = parsePlaneEquation(body);
  if (equationPlane) return equationPlane;
  const parts = args.length >= 2 ? args : splitKernelObjectPair(body);
  const point = parsePoint3(parts[0] ?? "");
  const normal = parseVector3(parts[1] ?? "");
  return point && normal ? kernelPlane3(point, normal) : null;
}

function parseObject3(value: string): Object3 | null {
  const trimmed = value.trim();
  const planeMatch = trimmed.match(/^plane\s*[\[(](.*)[\])]$/i);
  if (planeMatch) return parsePlane3dArgs(splitKernelObjectPair(planeMatch[1]));
  const lineMatch = trimmed.match(/^line3?d?\s*[\[(](.*)[\])]$/i);
  if (lineMatch) {
    const parts = splitKernelObjectPair(lineMatch[1]);
    const origin = parsePoint3(parts[0] ?? "");
    const direction = parseVector3(parts[1] ?? "");
    return origin && direction ? kernelLine3(origin, direction) : null;
  }
  const solidMatch = trimmed.match(/^(sphere|cylinder|cone)\s*[\[(](.*)[\])]$/i);
  if (solidMatch) return parseSolid3d(solidMatch[1].toLowerCase(), splitKernelObjectPair(solidMatch[2]));
  return parsePlaneEquation(trimmed);
}

function parseSolid3d(name: string, args: string[]): Object3 {
  const center = parsePoint3(args[0] ?? "") ?? kernelPoint3(0, 0, 0);
  const radius = Number(args[1] ?? 1);
  const height = Number(args[2] ?? radius * 2);
  if (!Number.isFinite(radius)) throw new Error("3D solid radius must be numeric.");
  if (name === "sphere") return kernelSphere3(center, radius);
  if (!Number.isFinite(height)) throw new Error("3D solid height must be numeric.");
  if (name === "cylinder") return kernelCylinder3(center, radius, height);
  if (name === "cone") return kernelCone3(center, radius, height);
  throw new Error(`Unsupported 3D solid "${name}".`);
}

function formatPoint3(point: Point3) {
  return `${roundTo(point.x, 4)}, ${roundTo(point.y, 4)}, ${roundTo(point.z, 4)}`;
}

function formatIntersection3(hit: ReturnType<typeof intersect3>[number]) {
  if (hit.kind === "point") return `point (${formatPoint3(hit.point)})`;
  if (hit.kind === "line") return `line point=(${formatPoint3(hit.line.point)}), dir=<${formatPoint3(hit.line.direction)}>`;
  return `circle center=(${formatPoint3(hit.center)}), r=${roundTo(hit.radius, 5)}`;
}

function parseMatrixLiteral(body: string) {
  const normalized = body.trim().replace(/^Matrix/i, "");
  const rowMatches = Array.from(normalized.matchAll(/\[([^\[\]]+)\]/g)).map((match) => match[1]);
  const rows = rowMatches.length ? rowMatches : normalized.replace(/^\[|\]$/g, "").split(/\s*;\s*/);
  const matrix = rows.map((row) => row.split(/\s*,\s*/).map((cell) => Number(cell.trim()))).filter((row) => row.length > 0);
  if (!matrix.length || matrix.some((row) => row.some((value) => !Number.isFinite(value)))) throw new Error("Use a numeric matrix like [[1,2],[3,4]].");
  const width = matrix[0].length;
  if (matrix.some((row) => row.length !== width)) throw new Error("Every matrix row must have the same length.");
  return matrix;
}

function formatMatrix(matrix: number[][]) {
  return `[${matrix.map((row) => `[${row.map((value) => roundTo(value, 6)).join(", ")}]`).join(", ")}]`;
}

function determinant(matrix: number[][]): number {
  if (matrix.length !== matrix[0]?.length) throw new Error("Determinant requires a square matrix.");
  if (matrix.length === 1) return matrix[0][0];
  if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  return matrix[0].reduce((sum, value, column) => {
    const minor = matrix.slice(1).map((row) => row.filter((_, index) => index !== column));
    return sum + (column % 2 ? -1 : 1) * value * determinant(minor);
  }, 0);
}

function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
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

function GraphPanel({ plots, onChange, tableRange, onTableRangeChange }: { plots: PlotItem[]; onChange: (plots: PlotItem[]) => void; tableRange: { start: number; end: number; step: number }; onTableRangeChange: (range: { start: number; end: number; step: number }) => void }) {
  const [draft, setDraft] = useState("cos(x)");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [sliderA, setSliderA] = useState(1);
  const [sliderB, setSliderB] = useState(0);
  const visiblePlots = plots.filter((plot) => plot.visible !== false);
  const viewport = { xMin, xMax, yMin, yMax, width: 640, height: 360 };
  const sampledLayers = useMemo(() => visiblePlots.map((plot) => samplePlotLayer(plot, viewport, sliderA, sliderB)), [visiblePlots, sliderA, sliderB, xMin, xMax, yMin, yMax]);
  const tableRows = useMemo(() => visiblePlots.slice(0, 3).flatMap((plot) => sampleTable(applyGraphParameters(plot.expression, sliderA, sliderB), plot.expression, tableRange.start, tableRange.end, tableRange.step)), [visiblePlots, sliderA, sliderB, tableRange.start, tableRange.end, tableRange.step]);
  const regression = useMemo(() => regressionModel(regressionSeed, "linear"), []);
  const addPlot = (expression: string, kind: PlotKind = inferPlotKind(expression)) => onChange([{ id: crypto.randomUUID(), expression, color: colors[plots.length % colors.length], kind, visible: true }, ...plots].slice(0, 10));
  const updatePlot = (id: string, patch: Partial<PlotItem>) => onChange(plots.map((plot) => plot.id === id ? { ...plot, ...patch } : plot));
  const removePlot = (id: string) => onChange(plots.filter((plot) => plot.id !== id));
  const addRegression = () => onChange([{ id: crypto.randomUUID(), expression: regression.expression, color: "#ec4899", kind: "regression" as PlotKind, points: regressionSeed, visible: true }, ...plots].slice(0, 10));
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold"><LineChart className="h-4 w-4 text-cyan-500" /> Desmos-style Graphing Lab</h2>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="mini-chip">Functions</span><span className="mini-chip">Inequalities</span><span className="mini-chip">Tables</span><span className="mini-chip">Regression</span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Expression</label>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-900" placeholder="sin(x), x^2+y^2=9, x=cos(t), y=sin(t), r=2*sin(theta)" />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => addPlot(draft)} className="action-primary py-2">Add graph</button>
              <button type="button" onClick={() => addRegression()} className="action-secondary py-2">Regression</button>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <p className="text-sm font-bold">Editable value table range</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <MiniNumber label="start" value={tableRange.start} onChange={(start) => onTableRangeChange({ ...tableRange, start })} />
              <MiniNumber label="end" value={tableRange.end} onChange={(end) => onTableRangeChange({ ...tableRange, end })} />
              <MiniNumber label="step" value={tableRange.step} onChange={(step) => onTableRangeChange({ ...tableRange, step: step || 1 })} />
            </div>
          </div>

          <div className="space-y-2">
            {plots.map((plot) => (
              <div key={plot.id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
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

          <div className="grid grid-cols-2 gap-2">
            <MiniNumber label="x min" value={xMin} onChange={setXMin} />
            <MiniNumber label="x max" value={xMax} onChange={setXMax} />
            <MiniNumber label="y min" value={yMin} onChange={setYMin} />
            <MiniNumber label="y max" value={yMax} onChange={setYMax} />
          </div>
        </div>

        <div className="space-y-3">
          <svg viewBox="0 0 640 360" className="h-[280px] w-full rounded-xl bg-slate-50 dark:bg-slate-900 sm:h-[360px]">
            <GraphGrid viewport={viewport} />
            {sampledLayers.map((layer) => layer.cells.map((cell, index) => (
              <rect
                key={`${layer.id}-cell-${index}`}
                x={scaleX(cell.x, viewport)}
                y={scaleY(cell.y + cell.height, viewport)}
                width={Math.max(1, (cell.width / (viewport.xMax - viewport.xMin || 1)) * viewport.width)}
                height={Math.max(1, (cell.height / (viewport.yMax - viewport.yMin || 1)) * viewport.height)}
                fill={layer.color}
                opacity={layer.kind === "inequality" ? 0.12 : 0.72}
              />
            )))}
            {sampledLayers.map((layer) => layer.paths.map((path, index) => <path key={`${layer.id}-path-${index}`} d={path} fill="none" stroke={layer.color} strokeWidth={layer.kind === "implicit" ? "2" : "3"} strokeLinecap="round" strokeLinejoin="round" />))}
            {visiblePlots.filter((plot) => plot.kind === "scatter" || plot.kind === "regression").flatMap((plot) => plot.points ?? []).map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={scaleX(point.x, viewport)} cy={scaleY(point.y, viewport)} r="5" fill="#ec4899" stroke="#0f172a" />)}
          </svg>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
              <SliderGroup title="Parameter sliders">
                <SliderControl density="compact" label="a" value={sliderA} min={-5} max={5} step={0.1} onChange={setSliderA} />
                <SliderControl density="compact" label="b" value={sliderB} min={-10} max={10} step={0.1} onChange={setSliderB} />
              </SliderGroup>
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Use expressions like a*x+b or a*sin(x)+b.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sampledLayers.map((layer) => <span key={layer.id} className="mini-chip">{layer.kind}</span>)}
              </div>
            </div>
            <div className="mobile-safe-scroll rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs">
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

type SampledPlotLayer = {
  id: string;
  color: string;
  kind: PlotKind | "error";
  paths: string[];
  cells: { x: number; y: number; width: number; height: number }[];
  error?: string;
};

function samplePlotLayer(plot: PlotItem, viewport: GraphViewport, sliderA: number, sliderB: number): SampledPlotLayer {
  const expression = applyGraphParameters(plot.expression, sliderA, sliderB);
  if (plot.kind === "scatter" || plot.kind === "regression") {
    return { id: plot.id, color: plot.color, kind: plot.kind, paths: [graphPath(stripInequality(expression), viewport)].filter(Boolean), cells: [] };
  }
  try {
    const sample = sampleGraph(expression, viewport, 520);
    if ("segments" in sample) {
      return {
        id: plot.id,
        color: plot.color,
        kind: sample.kind === "explicit" ? "function" : sample.kind,
        paths: sample.segments.map((segment) => graphSegmentPath(segment.points, viewport)).filter(Boolean),
        cells: [],
      };
    }
    return { id: plot.id, color: plot.color, kind: sample.kind, paths: [], cells: sample.cells };
  } catch (error) {
    return { id: plot.id, color: plot.color, kind: "error", paths: [], cells: [], error: error instanceof Error ? error.message : "Graph sampling failed" };
  }
}

function graphSegmentPath(points: { x: number; y: number; move?: boolean }[], viewport: GraphViewport) {
  return points
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .map((point, index) => `${index === 0 || point.move ? "M" : "L"}${scaleX(point.x, viewport).toFixed(2)},${scaleY(point.y, viewport).toFixed(2)}`)
    .join(" ");
}

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
  if (/^r\s*=/i.test(expression)) return "polar";
  if (/^if\s*\(/i.test(expression) || /^piecewise\s*\[/i.test(expression) || /{.+}/.test(expression)) return "piecewise";
  if (/t/.test(expression) && (/\bx\s*=/.test(expression) || /,/.test(expression))) return "parametric";
  if (/=/.test(expression) && /\by\b/i.test(expression)) return "implicit";
  if (/[<>]=?/.test(expression)) return "inequality";
  return "function";
}

function applyGraphParameters(expression: string, a: number, b: number) {
  return expression.replace(/\ba\b/g, `(${a})`).replace(/\bb\b/g, `(${b})`);
}

function sampleTable(expression: string, label: string, start = -3, end = 3, step = 1) {
  return generateValueTable(expression, start, end, step).map((row) => ({ ...row, label })).filter((row) => Number.isFinite(row.y));
}

function generateValueTable(expression: string, start: number, end: number, step: number) {
  const rows: ResultTableRow[] = [];
  const direction = start <= end ? 1 : -1;
  const safeStep = Math.max(Math.abs(step), 0.0001) * direction;
  for (let x = start; direction > 0 ? x <= end + 1e-9 : x >= end - 1e-9; x += safeStep) {
    try {
      rows.push({ x: roundTo(x, 6), y: roundTo(evaluateMathExpression(stripInequality(expression), x), 6) });
    } catch {
      rows.push({ x: roundTo(x, 6), y: Number.NaN });
    }
    if (rows.length >= 160) break;
  }
  return rows.filter((row) => Number.isFinite(row.y));
}

function stripInequality(expression: string) {
  const match = expression.match(/[<>]=?\s*(.+)$/);
  if (match) return match[1];
  return expression.replace(/^y\s*=\s*/i, "");
}

function inequalityRegion(expression: string, viewport: GraphViewport, color: string) {
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

type RegressionModel = "linear" | "quadratic" | "exponential" | "polynomial";

function regressionModel(points: ResultTableRow[], model: RegressionModel) {
  const clean = points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (model === "linear") {
    const fit = linearRegression(clean);
    return { expression: fit.expression, detail: `Linear least-squares fit y = ${fit.expression}.` };
  }
  if (model === "exponential") {
    const positive = clean.filter((point) => point.y > 0);
    const fit = linearRegression(positive.map((point) => ({ x: point.x, y: Math.log(point.y) })));
    const a = Math.exp(fit.intercept);
    const b = fit.slope;
    return { expression: `${roundTo(a, 5)}*exp(${roundTo(b, 5)}*x)`, detail: "Exponential regression by fitting ln(y)=ln(a)+b*x." };
  }
  const degree = model === "quadratic" ? 2 : 3;
  const coeffs = polynomialRegression(clean, degree);
  const expression = coeffs.map((coeff, index) => {
    const power = degree - index;
    const rounded = roundTo(coeff, 5);
    if (Math.abs(rounded) < 1e-9) return "";
    if (power === 0) return `${rounded}`;
    if (power === 1) return `${rounded}*x`;
    return `${rounded}*x^${power}`;
  }).filter(Boolean).join("+").replace(/\+\-/g, "-");
  return { expression: expression || "0", detail: `${model === "quadratic" ? "Quadratic" : "Cubic polynomial"} least-squares regression.` };
}

function polynomialRegression(points: ResultTableRow[], degree: number) {
  const size = degree + 1;
  const matrix = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => points.reduce((sum, point) => sum + point.x ** (row + col), 0)));
  const vector = Array.from({ length: size }, (_, row) => points.reduce((sum, point) => sum + point.y * point.x ** row, 0));
  const solved = solveLinearSystem(matrix, vector);
  return solved.reverse();
}

function solveLinearSystem(matrix: number[][], vector: number[]) {
  const n = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);
  for (let pivot = 0; pivot < n; pivot += 1) {
    let best = pivot;
    for (let row = pivot + 1; row < n; row += 1) if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[best][pivot])) best = row;
    [augmented[pivot], augmented[best]] = [augmented[best], augmented[pivot]];
    const divisor = augmented[pivot][pivot] || 1;
    for (let col = pivot; col <= n; col += 1) augmented[pivot][col] /= divisor;
    for (let row = 0; row < n; row += 1) {
      if (row === pivot) continue;
      const factor = augmented[row][pivot];
      for (let col = pivot; col <= n; col += 1) augmented[row][col] -= factor * augmented[pivot][col];
    }
  }
  return augmented.map((row) => row[n]);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function SpreadsheetPanel({ grid, onChange, onScatter, onRegression }: { grid: SpreadsheetCellGrid; onChange: (grid: SpreadsheetCellGrid) => void; onScatter: (points: ResultTableRow[]) => void; onRegression: (model: RegressionModel, points: ResultTableRow[]) => void }) {
  const evaluated = useMemo(() => evaluateSpreadsheetGrid(grid), [grid]);
  const points = useMemo(() => spreadsheetPoints(evaluated.values), [evaluated]);
  const updateCell = (row: number, col: number, value: string) => {
    onChange(grid.map((cells, rowIndex) => rowIndex === row ? cells.map((cell, colIndex) => colIndex === col ? value : cell) : cells));
  };
  const addRow = () => onChange([...grid, Array.from({ length: grid[0]?.length ?? 4 }, () => "")]);
  const addColumn = () => onChange(grid.map((row) => [...row, ""]));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold">Spreadsheet grid</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addRow} className="action-secondary py-2">Add row</button>
          <button type="button" onClick={addColumn} className="action-secondary py-2">Add column</button>
          <button type="button" onClick={() => onScatter(points)} className="action-primary py-2">Plot data</button>
        </div>
      </div>
      <div className="mobile-safe-scroll mt-3 overflow-auto rounded-2xl border border-slate-200 dark:border-white/10">
        <table className="min-w-[620px] w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
            <tr><th className="p-2">#</th>{grid[0]?.map((_, index) => <th key={index} className="p-2">{columnName(index)}</th>)}</tr>
          </thead>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-200 dark:border-white/10">
                <td className="bg-slate-50 p-2 font-bold text-slate-500 dark:bg-white/5">{rowIndex + 1}</td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-1 align-top">
                    <input aria-label={`${columnName(colIndex)}${rowIndex + 1}`} value={cell} onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono dark:border-white/10 dark:bg-slate-900" />
                    {cell.startsWith("=") && <p className="mt-1 truncate px-1 font-mono text-[11px] text-cyan-600 dark:text-cyan-300">{evaluated.values[rowIndex]?.[colIndex] ?? ""}</p>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["linear", "quadratic", "exponential", "polynomial"] as RegressionModel[]).map((model) => <button key={model} type="button" onClick={() => onRegression(model, points)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold capitalize dark:bg-white/10">{model}</button>)}
      </div>
      {evaluated.errors.length > 0 && <p className="mt-3 rounded-xl bg-amber-50 p-2 text-xs font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{evaluated.errors.map((error) => `${error.cell}: ${error.message}`).join("; ")}</p>}
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Formulas start with = and can reference cells like A2+B2. First two numeric columns become graph/regression data.</p>
    </div>
  );
}

function FunctionAnalysisPanel({ plot, onCommand }: { plot?: PlotItem; onCommand: (command: string) => void }) {
  const expression = stripInequality(plot?.expression ?? "x^2-4");
  const analysis = useMemo(() => analyzeFunction(expression), [expression]);
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
      <h3 className="font-bold">Function analysis</h3>
      <p className="font-mono text-sm text-slate-500 dark:text-slate-400">f(x) = {expression}</p>
      <div className="grid gap-2">
        <InfoPill title="Roots" text={analysis.roots || "No real roots found in [-20,20]."} />
        <InfoPill title="Intercepts" text={analysis.intercepts} />
        <InfoPill title="Extrema" text={analysis.extrema || "No local extrema found in [-10,10]."} />
        <InfoPill title="Domain hint" text={analysis.domainHint} />
        <InfoPill title="Derivative" text={analysis.derivative} />
        <InfoPill title="Integral" text={analysis.integral} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onCommand(`Derivative[${expression}]`)} className="action-secondary py-2">Derivative</button>
        <button type="button" onClick={() => onCommand(`Integral[${expression}]`)} className="action-secondary py-2">Integral</button>
        <button type="button" onClick={() => onCommand(`Root[${expression}]`)} className="action-secondary py-2">Roots</button>
        <button type="button" onClick={() => onCommand(`Table[${expression}, -4, 4, 1]`)} className="action-secondary py-2">Table</button>
      </div>
    </div>
  );
}

function spreadsheetPoints(grid: SpreadsheetCellGrid) {
  return grid.slice(1).map((row) => ({ x: Number(row[0]), y: Number(row[1]) })).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

function columnName(index: number) {
  let name = "";
  let current = index + 1;
  while (current > 0) {
    const rem = (current - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

function columnIndex(name: string) {
  return name.split("").reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function analyzeFunction(expression: string) {
  const roots = solveCommand(`${expression}=0`, `Root[${expression}]`).result;
  const extrema = extremaCommand(expression, `Extremum[${expression}]`).result;
  const yIntercept = safeEvaluate(expression, 0);
  const derivative = trySymbolic(() => symbolicDerivative(expression))?.result ?? derivativeText(expression);
  const integral = trySymbolic(() => symbolicIntegral(expression))?.result ?? integralText(expression);
  return {
    roots,
    extrema,
    intercepts: `y-intercept ${Number.isFinite(yIntercept) ? roundTo(yIntercept, 5) : "undefined"}`,
    domainHint: domainHint(expression),
    derivative,
    integral,
  };
}

function safeEvaluate(expression: string, x: number) {
  try {
    return evaluateMathExpression(expression, x);
  } catch {
    return Number.NaN;
  }
}

function domainHint(expression: string) {
  const hints: string[] = [];
  if (/sqrt\s*\(/i.test(expression)) hints.push("square-root radicand must be nonnegative");
  if (/log|ln/i.test(expression)) hints.push("log input must be positive");
  if (/\//.test(expression)) hints.push("denominators cannot be zero");
  return hints.length ? hints.join("; ") : "all real x unless a hidden denominator/domain restriction appears";
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

function normalizeColor(value?: string) {
  const match = value?.match(/^#[0-9a-f]{6}/i);
  return match?.[0] ?? null;
}

type AlgebraObjectRow = {
  ref: AlgebraObjectRef;
  name: string;
  definition: string;
  visible: boolean;
  locked: boolean;
  trace: boolean;
  dependencies: string[];
};

function WorkspaceMainMenu({ active, onChange }: { active: WorkspaceView; onChange: (view: WorkspaceView) => void }) {
  const modules: Array<{ id: WorkspaceView; label: string; route: string; icon: JSX.Element }> = [
    { id: "graph", label: "Graph", route: "/workspace/graph", icon: <FunctionSquare className="h-4 w-4" /> },
    { id: "geometry", label: "Geometry", route: "/workspace/geometry", icon: <Pentagon className="h-4 w-4" /> },
    { id: "3d", label: "3D", route: "/workspace/3d", icon: <Box className="h-4 w-4" /> },
    { id: "data", label: "CAS / Data", route: "/workspace/data", icon: <LineChart className="h-4 w-4" /> },
    { id: "teach", label: "Teacher", route: "/workspace/teach", icon: <Presentation className="h-4 w-4" /> },
  ];
  const links = [
    { label: "All workspace", route: "/workspace" },
    { label: "Shapes", route: "/shapes" },
    { label: "Formulas", route: "/formulas" },
    { label: "Syllabus", route: "/syllabus" },
    { label: "Home", route: "/" },
  ];

  return (
    <nav className="fixed left-3 right-3 top-3 z-50 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 dark:shadow-black/20" aria-label="Workspace main menu">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded-xl bg-cyan-500 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-950 shadow-lg shadow-cyan-500/20">Main Menu</span>
          <div className="mobile-safe-scroll flex min-w-0 gap-2 overflow-x-auto pb-1 xl:pb-0">
            {modules.map((module) => (
              <Link
                key={module.id}
                to={module.route}
                onClick={() => onChange(module.id)}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${
                  active === module.id
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "bg-slate-100 text-slate-700 hover:bg-cyan-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-cyan-300/15"
                }`}
              >
                {module.icon}
                {module.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mobile-safe-scroll flex gap-2 overflow-x-auto pb-1 xl:pb-0">
          {links.map((item) => (
            <Link key={item.route} to={item.route} className="inline-flex min-h-10 shrink-0 items-center rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-cyan-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-cyan-300/15">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function WorkspaceShortcutStrip() {
  const shortcuts = [
    ["Esc", "deselect"],
    ["Delete", "delete selected"],
    ["Arrow keys", "nudge 2D point"],
    ["Shift+Arrow", "fast nudge"],
    ["Ctrl+Z / Y", "undo / redo"],
    ["Ctrl+Enter", "run command"],
  ];
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/70 p-2 text-xs font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
      {shortcuts.map(([key, label]) => (
        <span key={key} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/10">
          <kbd className="rounded-md bg-white px-2 py-1 font-black text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white">{key}</kbd>
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
}

function WorkspaceModeTabs({ active, onChange }: { active: WorkspaceView; onChange: (view: WorkspaceView) => void }) {
  const views: { id: WorkspaceView; label: string; icon: JSX.Element }[] = [
    { id: "graph", label: "Graph + Algebra", icon: <FunctionSquare className="h-4 w-4" /> },
    { id: "geometry", label: "2D Geometry", icon: <Pentagon className="h-4 w-4" /> },
    { id: "3d", label: "3D", icon: <Box className="h-4 w-4" /> },
    { id: "data", label: "CAS + Tables", icon: <LineChart className="h-4 w-4" /> },
    { id: "teach", label: "Teach", icon: <Presentation className="h-4 w-4" /> },
  ];
  return (
    <div className="sticky top-16 z-20 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
      <div className="mobile-safe-scroll flex gap-2 overflow-x-auto pb-1 sm:pb-0">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => onChange(view.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${active === view.id ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-cyan-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-cyan-300/15"}`}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CompactWorkspaceBar({ activeTemplate, dynamicHealth, qaReport, teachingMode, performanceMode, onSave, onLoad, onUndo, onRedo, onExportJson, onExportPng, onShare, onToggleTeach, onRunQa, onPerformance }: { activeTemplate: SyllabusWorkspaceTemplate; dynamicHealth: ReturnType<typeof graphHealthSummary>; qaReport: WorkspaceQaReport; teachingMode: boolean; performanceMode: boolean; onSave: () => void; onLoad: () => void; onUndo: () => void; onRedo: () => void; onExportJson: () => void; onExportPng: () => void; onShare: () => void; onToggleTeach: () => void; onRunQa: () => void; onPerformance: (value: boolean) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-black ${dynamicHealth.ready ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-100"}`}>Kernel {dynamicHealth.ready ? "ready" : "needs attention"}</span>
          <span className="mini-chip">{dynamicHealth.total} objects</span>
          <span className="mini-chip">{activeTemplate.unit}</span>
          <span className={`rounded-full px-3 py-1.5 text-xs font-black ${qaReport.failed ? "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100"}`}>QA {qaReport.passed}/{qaReport.passed + qaReport.failed}</span>
        </div>
        <div className="mobile-safe-scroll flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button type="button" onClick={onSave} className="action-secondary py-2"><Save className="h-4 w-4" />Save</button>
          <button type="button" onClick={onLoad} className="action-secondary py-2"><Download className="h-4 w-4" />Load</button>
          <button type="button" onClick={onUndo} className="action-secondary py-2"><RotateCcw className="h-4 w-4" />Undo</button>
          <button type="button" onClick={onRedo} className="action-secondary py-2"><RotateCcw className="h-4 w-4" />Redo</button>
          <button type="button" onClick={onExportJson} className="action-secondary py-2"><Download className="h-4 w-4" />JSON</button>
          <button type="button" onClick={onExportPng} className="action-secondary py-2"><Download className="h-4 w-4" />PNG</button>
          <button type="button" onClick={onShare} className="action-secondary py-2"><Download className="h-4 w-4" />URL</button>
          <button type="button" onClick={() => onPerformance(!performanceMode)} className={performanceMode ? "action-primary py-2" : "action-secondary py-2"}>Performance</button>
          <button type="button" onClick={onRunQa} className="action-secondary py-2">Run QA</button>
          <button type="button" onClick={onToggleTeach} className={teachingMode ? "action-primary py-2" : "action-secondary py-2"}><Presentation className="h-4 w-4" />Teach</button>
        </div>
      </div>
    </div>
  );
}

function HighPriorityWorkflowBar({ selectedType, styleControls, protocolPlan, slider, snapCandidates, imageWorkflow, exportPresets, tablet, onAddImage, onPauseAnimation, onPlayAnimation }: { selectedType: WorkflowObjectType; styleControls: StyleBarControl[]; protocolPlan: ProtocolPlaybackPlan; slider: SliderObject; snapCandidates: (SnapCandidate & { distance: number })[]; imageWorkflow: ImageWorkflowSpec; exportPresets: ExportPreset[]; tablet: TabletControlSpec; onAddImage: () => void; onPauseAnimation: () => void; onPlayAnimation: () => void }) {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">High Priority Workflow Layer</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Contextual style bar, protocol replay, sliders, snapping, image workflow, export presets, offline library, and tablet controls are tracked as one production workflow.</p>
        </div>
        <span className="mini-chip">{selectedType} selected</span>
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">Style Bar</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {styleControls.map((control) => <span key={control} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold dark:bg-white/10">{control}</span>)}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">Protocol</p>
          <p className="mt-2 text-sm font-bold">{protocolPlan.steps.length} steps, cursor {protocolPlan.cursor + 1}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{protocolPlan.canReorder ? "Dependency-safe reorder available" : protocolPlan.blockedReorders[0] ?? "Replay ready"}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Columns: {protocolPlan.columns.join(", ")}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">Global Slider</p>
          <p className="mt-2 text-sm font-bold">{slider.name} = {roundTo(slider.value, 2)} ({slider.playing ? "playing" : "paused"})</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Bound: {slider.boundObjects.join(", ") || "none"}</p>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={onPlayAnimation} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-950">Play</button>
            <button type="button" onClick={onPauseAnimation} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-white/10">Pause</button>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">Snap Preview</p>
          <p className="mt-2 text-sm font-bold">{snapCandidates[0]?.label ?? "Grid"} priority {snapCandidates[0]?.priority ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Touch handle {tablet.touchHandleSize}px, long press {tablet.longPressContextMenuMs}ms</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">Images</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{imageWorkflow.actions.join(", ")}</p>
          <button type="button" onClick={onAddImage} className="action-secondary mt-2 py-2">Add image</button>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">Export Quality</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{exportPresets.map((preset) => preset.label).join(", ")}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">Right-Click Menu</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{contextMenuForObject(selectedType).join(", ")}</p>
        </div>
      </div>
    </div>
  );
}

function AlgebraObjectsPanel({ objects, selected, protocol, graph, graphHealth, commandSummary, onSelect, onRename, onEditDefinition, onPatch, onDuplicate, onDelete, onReplay, onContextMenu }: { objects: AlgebraObjectRow[]; selected: AlgebraObjectRef | null; protocol: ConstructionStep[]; graph: DynamicObjectGraph; graphHealth: ReturnType<typeof graphHealthSummary>; commandSummary: ReturnType<typeof commandRegistrySummary>; onSelect: (ref: AlgebraObjectRef) => void; onRename: (ref: AlgebraObjectRef, name: string) => void; onEditDefinition: (ref: AlgebraObjectRef, definition: string) => void; onPatch: (ref: AlgebraObjectRef, patch: { visible?: boolean; locked?: boolean; trace?: boolean }) => void; onDuplicate: (ref: AlgebraObjectRef) => void; onDelete: (ref: AlgebraObjectRef) => void; onReplay: (step: ConstructionStep) => void; onContextMenu: (event: ReactMouseEvent, ref: AlgebraObjectRef) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Unified Algebra And Object Panel</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Edit definitions once and see graph, geometry, 3D, inspector, and protocol stay linked.</p>
        </div>
        <span className="mini-chip">{objects.length} objects</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <KernelMetric label="Kernel" value={graphHealth.ready ? "Ready" : "Needs fix"} tone={graphHealth.ready ? "good" : "bad"} />
        <KernelMetric label="Dynamic links" value={`${graphHealth.dynamic}`} />
        <KernelMetric label="Dirty chain" value={`${graphHealth.dirty}`} />
        <KernelMetric label="Commands" value={`${commandSummary.implemented}/${commandSummary.total}`} />
      </div>
      <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">{graphHealth.text}</p>
      {(graph.cycles.length > 0 || graph.missingDependencies.length > 0) && (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
          {graph.cycles.map((cycle) => <p key={cycle.join("-")}>Circular dependency: {cycle.join(" -> ")}</p>)}
          {graph.missingDependencies.map((item) => <p key={`${item.object}-${item.dependency}`}>{item.object} needs missing object {item.dependency}</p>)}
        </div>
      )}
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {Object.entries(commandSummary.byGroup).slice(0, 6).map(([group, item]) => (
          <div key={group} className="rounded-xl bg-slate-100 p-3 text-xs dark:bg-white/10">
            <p className="font-bold">{group}</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{item.implemented} live, {item.total - item.implemented} planned</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {objects.length === 0 ? <p className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">Create a graph, point, line, circle, polygon, or 3D object to see it here.</p> : objects.map((object) => (
            <div key={`${object.ref.kind}-${object.ref.id}`} onContextMenu={(event) => onContextMenu(event, object.ref)} className={`rounded-xl border p-3 ${sameRef(selected, object.ref) ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/50"}`}>
              <div className="grid gap-2 lg:grid-cols-[150px_minmax(0,1fr)]">
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Name
                  <input value={object.name} onFocus={() => onSelect(object.ref)} onChange={(event) => onRename(object.ref, event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm normal-case dark:border-white/10 dark:bg-slate-950" />
                </label>
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Definition
                  <input defaultValue={object.definition} onFocus={() => onSelect(object.ref)} onBlur={(event) => onEditDefinition(object.ref, event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-sm normal-case dark:border-white/10 dark:bg-slate-950" />
                </label>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => onSelect(object.ref)} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-slate-950">Select</button>
                <button type="button" onClick={() => onPatch(object.ref, { visible: !object.visible })} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-slate-950">{object.visible ? "Hide" : "Show"}</button>
                <button type="button" onClick={() => onPatch(object.ref, { locked: !object.locked })} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-slate-950">{object.locked ? "Unlock" : "Lock"}</button>
                <button type="button" onClick={() => onPatch(object.ref, { trace: !object.trace })} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-slate-950">{object.trace ? "Trace on" : "Trace"}</button>
                <button type="button" onClick={() => onDuplicate(object.ref)} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-slate-950">Duplicate</button>
                <button type="button" onClick={() => onDelete(object.ref)} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">Delete</button>
                <span className="mini-chip">{object.ref.kind}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Depends on: {object.dependencies.length ? object.dependencies.join(", ") : "none"}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
          <h4 className="font-bold">Construction Protocol</h4>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Replay any creation/edit step to inspect how the workspace was built.</p>
          <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto">
            {protocol.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">No protocol steps yet.</p> : protocol.map((step, index) => (
              <button key={step.id} type="button" onClick={() => onReplay(step)} className="w-full rounded-xl bg-white p-3 text-left text-sm dark:bg-slate-950">
                <p className="font-bold">{protocol.length - index}. {step.label}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{step.detail}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KernelMetric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "bad" }) {
  const toneClass = tone === "good" ? "text-emerald-600 dark:text-emerald-300" : tone === "bad" ? "text-amber-700 dark:text-amber-200" : "text-cyan-600 dark:text-cyan-300";
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function CriticalGapPhasePanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Critical Gap Implementation Phases</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Four production phases that close the GeoGebra-level core gaps while keeping the app browser-only.</p>
        </div>
        <span className="mini-chip">{criticalGapImplementationPhases.length} phases</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {criticalGapImplementationPhases.map((phase) => (
          <div key={phase.id} className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">Phase {phase.id}</p>
            <h4 className="mt-1 font-bold">{phase.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{phase.goal}</p>
            <p className="mt-3 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Deliverables</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{phase.deliverables.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type Space3DPaletteItem<T extends string> = { id: T; label: string; icon: LucideIcon };

const space3dSurfacePalette: Space3DPaletteItem<SurfaceKind>[] = [
  { id: "paraboloid", label: "Paraboloid", icon: Circle },
  { id: "saddle", label: "Saddle", icon: Slash },
  { id: "wave", label: "Wave", icon: LineChart },
  { id: "plane", label: "Plane", icon: Slash },
  { id: "ripple", label: "Ripple", icon: Circle },
  { id: "cone-surface", label: "Cone Surface", icon: Rotate3D },
  { id: "custom-z", label: "z=f(x,y)", icon: FunctionSquare },
  { id: "parametric", label: "Parametric", icon: Rotate3D },
  { id: "implicit", label: "Implicit", icon: Circle },
];

const space3dSolidPalette: Space3DPaletteItem<SolidKind>[] = [
  { id: "cube", label: "Cube", icon: Box },
  { id: "cuboid", label: "Cuboid", icon: Box },
  { id: "sphere", label: "Sphere", icon: Circle },
  { id: "ellipsoid", label: "Ellipsoid", icon: Circle },
  { id: "hemisphere", label: "Hemisphere", icon: Circle },
  { id: "cylinder", label: "Cylinder", icon: Rotate3D },
  { id: "cone", label: "Cone", icon: Rotate3D },
  { id: "frustum", label: "Frustum", icon: Rotate3D },
  { id: "torus", label: "Torus", icon: Rotate3D },
  { id: "tube", label: "Tube", icon: Circle },
  { id: "capsule", label: "Capsule", icon: Rotate3D },
  { id: "prism", label: "Prism", icon: Box },
  { id: "pyramid", label: "Pyramid", icon: Pentagon },
  { id: "tetrahedron", label: "Tetrahedron", icon: Pentagon },
  { id: "octahedron", label: "Octahedron", icon: Pentagon },
  { id: "dodecahedron", label: "Dodecahedron", icon: Pentagon },
  { id: "wedge", label: "Wedge", icon: Box },
  { id: "polyhedron", label: "Polyhedron", icon: Box },
];

const space3dObjectPalette: Space3DPaletteItem<ThreeObjectId>[] = [
  { id: "point", label: "Point", icon: Plus },
  { id: "vector", label: "Vector", icon: Move },
  { id: "line3d", label: "Line", icon: Slash },
  { id: "plane3d", label: "Plane", icon: Slash },
  { id: "slice", label: "Slice", icon: LineChart },
  { id: "sphere3d", label: "Sphere", icon: Circle },
  { id: "cone3d", label: "Cone", icon: Rotate3D },
  { id: "cylinder3d", label: "Cylinder", icon: Rotate3D },
  { id: "prism3d", label: "Prism", icon: Box },
  { id: "pyramid3d", label: "Pyramid", icon: Pentagon },
  { id: "polyhedron3d", label: "Polyhedron", icon: Box },
];

const space3dCameraPalette: Space3DPaletteItem<CameraPreset3D>[] = [
  { id: "top", label: "Top", icon: Rotate3D },
  { id: "front", label: "Front", icon: Rotate3D },
  { id: "right", label: "Right", icon: Rotate3D },
  { id: "isometric", label: "Iso", icon: Rotate3D },
  { id: "free", label: "Free", icon: MousePointer2 },
];

function Space3DToolPalette({
  activeObject,
  selectedTransform,
  activeSurface,
  activeSolid,
  cameraPreset,
  autoRotate,
  showSurface,
  showSolid,
  onSurface,
  onSolid,
  onObject,
  onCamera,
  onToggleSurface,
  onToggleSolid,
  onToggleRotate,
  onSelectTool,
  onZoomIn,
  onZoomOut,
  onReset,
  onNudge,
  onRotateAxis,
  onScale,
  onMaterial,
  onOpacity,
  onDuplicate,
  onDelete,
  onRestore,
  onLock,
  onTrace,
}: {
  activeObject: string;
  selectedTransform: Transform3D;
  activeSurface: SurfaceKind;
  activeSolid: SolidKind;
  cameraPreset: CameraPreset3D;
  autoRotate: boolean;
  showSurface: boolean;
  showSolid: boolean;
  onSurface: (surface: SurfaceKind) => void;
  onSolid: (solid: SolidKind) => void;
  onObject: (id: ThreeObjectId) => void;
  onCamera: (preset: CameraPreset3D) => void;
  onToggleSurface: (value: boolean) => void;
  onToggleSolid: (value: boolean) => void;
  onToggleRotate: (value: boolean) => void;
  onSelectTool: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onNudge: (axis: 0 | 1 | 2, amount: number) => void;
  onRotateAxis: (axis: 0 | 1 | 2, amount: number) => void;
  onScale: (amount: number) => void;
  onMaterial: (material: Transform3D["material"]) => void;
  onOpacity: (opacity: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onLock: () => void;
  onTrace: () => void;
}) {
  const hasSelectedObject = Boolean(activeObject);
  const selectedMaterial = selectedTransform.material ?? "glass";
  const selectedOpacity = roundTo(selectedTransform.opacity ?? 0.8, 2);
  const transformActions: GeometryPaletteActionItem[] = [
    { id: "move-x", label: "Move X", icon: Move, action: () => onNudge(0, 0.25), disabled: !hasSelectedObject },
    { id: "move-y", label: "Move Y", icon: Move, action: () => onNudge(1, 0.25), disabled: !hasSelectedObject },
    { id: "move-z", label: "Move Z", icon: Move, action: () => onNudge(2, 0.25), disabled: !hasSelectedObject },
    { id: "rot-x", label: "Rotate X", icon: Rotate3D, action: () => onRotateAxis(0, 0.18), disabled: !hasSelectedObject },
    { id: "rot-y", label: "Rotate Y", icon: Rotate3D, action: () => onRotateAxis(1, 0.18), disabled: !hasSelectedObject },
    { id: "rot-z", label: "Rotate Z", icon: Rotate3D, action: () => onRotateAxis(2, 0.18), disabled: !hasSelectedObject },
    { id: "scale-up", label: "Scale +", icon: ZoomIn, action: () => onScale(0.15), disabled: !hasSelectedObject },
    { id: "scale-down", label: "Scale -", icon: ZoomOut, action: () => onScale(-0.15), disabled: !hasSelectedObject },
  ];
  const materialActions: GeometryPaletteActionItem[] = [
    { id: "matte", label: "Matte", icon: Circle, action: () => onMaterial("matte"), active: selectedMaterial === "matte", disabled: !hasSelectedObject },
    { id: "glass", label: "Glass", icon: Circle, action: () => onMaterial("glass"), active: selectedMaterial === "glass", disabled: !hasSelectedObject },
    { id: "wire", label: "Wireframe", icon: Slash, action: () => onMaterial("wireframe"), active: selectedMaterial === "wireframe", disabled: !hasSelectedObject },
    { id: "opaque", label: "Opacity 100", icon: Circle, action: () => onOpacity(1), active: selectedOpacity === 1, disabled: !hasSelectedObject },
    { id: "translucent", label: "Opacity 55", icon: Circle, action: () => onOpacity(0.55), active: selectedOpacity === 0.55, disabled: !hasSelectedObject },
    { id: "ghost", label: "Opacity 25", icon: Circle, action: () => onOpacity(0.25), active: selectedOpacity === 0.25, disabled: !hasSelectedObject },
  ];
  const objectActions: GeometryPaletteActionItem[] = [
    { id: "duplicate", label: "Duplicate", icon: Plus, action: onDuplicate, disabled: !hasSelectedObject },
    { id: "lock", label: selectedTransform.locked ? "Unlock" : "Lock", icon: Magnet, action: onLock, active: Boolean(selectedTransform.locked), disabled: !hasSelectedObject },
    { id: "trace", label: selectedTransform.trace ? "Trace On" : "Trace", icon: LineChart, action: onTrace, active: Boolean(selectedTransform.trace), disabled: !hasSelectedObject },
    { id: "restore", label: "Restore", icon: RotateCcw, action: onRestore, disabled: !hasSelectedObject },
    { id: "delete", label: "Delete", icon: Trash2, action: onDelete, danger: true, disabled: !hasSelectedObject },
  ];
  const sceneActions: GeometryPaletteActionItem[] = [
    { id: "toggle-surface", label: showSurface ? "Surface On" : "Surface Off", icon: Circle, action: () => onToggleSurface(!showSurface), active: showSurface },
    { id: "toggle-solid", label: showSolid ? "Solid On" : "Solid Off", icon: Box, action: () => onToggleSolid(!showSolid), active: showSolid },
    { id: "rotate", label: autoRotate ? "Pause Rotation" : "Start Rotation", icon: RotateCcw, action: () => onToggleRotate(!autoRotate), active: autoRotate },
    { id: "zoom-in", label: "Zoom In", icon: ZoomIn, action: onZoomIn },
    { id: "zoom-out", label: "Zoom Out", icon: ZoomOut, action: onZoomOut },
    { id: "reset", label: "Reset", icon: Eraser, action: onReset, danger: true },
  ];
  const mainActions: GeometryPaletteActionItem[] = [
    { id: "select", label: "Select", icon: MousePointer2, action: onSelectTool, active: !activeObject },
    { id: "pause-rotation", label: autoRotate ? "Pause Rotation" : "Start Rotation", icon: RotateCcw, action: () => onToggleRotate(!autoRotate), active: autoRotate },
  ];

  return (
    <aside className="space3d-tool-palette thin-scrollbar max-h-[clamp(18rem,46vh,32.5rem)] overflow-auto rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20">
      <Space3DPaletteSection title="Main Tools">
        {mainActions.map((item) => <Space3DPaletteAction key={item.id} item={item} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="Surfaces">
        {space3dSurfacePalette.map((item) => <Space3DPaletteButton key={item.id} item={item} active={activeSurface === item.id || (activeObject === "surface" && activeSurface === item.id)} onClick={() => onSurface(item.id)} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="Solids">
        {space3dSolidPalette.map((item) => <Space3DPaletteButton key={item.id} item={item} active={activeSolid === item.id && activeObject === "solid"} onClick={() => onSolid(item.id)} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="3D Objects">
        {space3dObjectPalette.map((item) => <Space3DPaletteButton key={item.id} item={item} active={activeObject === item.id} onClick={() => onObject(item.id)} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="Camera">
        {space3dCameraPalette.map((item) => <Space3DPaletteButton key={item.id} item={item} active={cameraPreset === item.id} onClick={() => onCamera(item.id)} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="Transform Gizmo">
        {transformActions.map((item) => <Space3DPaletteAction key={item.id} item={item} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="Material">
        {materialActions.map((item) => <Space3DPaletteAction key={item.id} item={item} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="Selected 3D">
        {objectActions.map((item) => <Space3DPaletteAction key={item.id} item={item} />)}
      </Space3DPaletteSection>
      <Space3DPaletteSection title="Scene">
        {sceneActions.map((item) => <Space3DPaletteAction key={item.id} item={item} />)}
      </Space3DPaletteSection>
    </aside>
  );
}

function Space3DPaletteSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-3 last:mb-0">
      <h4 className="mb-1.5 px-1 text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h4>
      <div className="grid grid-cols-3 gap-1.5">{children}</div>
    </section>
  );
}

function Space3DPaletteButton<T extends string>({ item, active, onClick }: { item: Space3DPaletteItem<T>; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button type="button" onClick={onClick} title={item.label} className={`space3d-palette-button ${active ? "space3d-palette-button-active" : ""}`}>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </button>
  );
}

function Space3DPaletteAction({ item }: { item: GeometryPaletteActionItem }) {
  const Icon = item.icon;
  return (
    <button type="button" onClick={item.action} title={item.disabled ? "Select a 3D object first" : item.label} disabled={item.disabled} className={`space3d-palette-button ${item.active ? "space3d-palette-button-active" : ""} ${item.danger ? "space3d-palette-button-danger" : ""}`}>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </button>
  );
}

function SyllabusTemplatePanel({ templates, active, onApply }: { templates: SyllabusWorkspaceTemplate[]; active: string; onApply: (template: SyllabusWorkspaceTemplate) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">Syllabus-Aware Workspace Templates</h3>
        <span className="mini-chip">browser only</span>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <button key={template.id} type="button" onClick={() => onApply(template)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${active === template.id ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/50"}`}>
            <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{template.unit}</p>
            <p className="mt-1 font-bold">{template.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{template.description}</p>
            <p className="mt-3 font-mono text-xs text-slate-500 dark:text-slate-400">{template.command}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function GuidedActivityPanel({ active, phase, template, journal, onToggle, onPhase, onJournal, onCompletePhase }: { active: boolean; phase: GuidedActivityPhase; template: SyllabusWorkspaceTemplate; journal: Record<string, ActivityJournalEntry>; onToggle: () => void; onPhase: (phase: GuidedActivityPhase) => void; onJournal: (patch: Partial<ActivityJournalEntry>) => void; onCompletePhase: () => void }) {
  const phases: GuidedActivityPhase[] = ["predict", "manipulate", "check", "reflect"];
  const current = template.steps.find((step) => step.phase === phase) ?? template.steps[0];
  const currentEntry = journal[activityJournalKey(template.id, phase)] ?? defaultActivityJournalEntry(template.id, phase);
  const completedCount = phases.filter((item) => journal[activityJournalKey(template.id, item)]?.selfCheck === "got-it").length;
  const progress = Math.round((completedCount / phases.length) * 100);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Guided Activity Mode</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Prediction, manipulation, check, and reflection stay attached to this browser project.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mini-chip">{progress}% complete</span>
          <button type="button" onClick={onToggle} className={active ? "action-primary py-2" : "action-secondary py-2"}>{active ? "Guidance on" : "Guidance off"}</button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {phases.map((item) => {
          const entry = journal[activityJournalKey(template.id, item)];
          return <button key={item} type="button" onClick={() => onPhase(item)} className={`rounded-full px-3 py-2 text-xs font-bold uppercase ${phase === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : entry?.selfCheck === "got-it" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}>{item}</button>;
        })}
      </div>
      {active && (
        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-sm font-bold">{current.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{current.prompt}</p>
            <label className="mt-4 block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Student response
              <textarea value={currentEntry.response} onChange={(event) => onJournal({ response: event.target.value })} rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm normal-case leading-6 dark:border-white/10 dark:bg-slate-950" placeholder="Write prediction, observation, calculation, or reflection..." />
            </label>
            <div className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-100">{current.reveal}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-sm font-bold">Self Check</p>
            <div className="mt-3 grid gap-2">
              {(["not-started", "revisit", "got-it"] as ActivityJournalEntry["selfCheck"][]).map((item) => <button key={item} type="button" onClick={() => onJournal({ selfCheck: item })} className={`rounded-xl px-3 py-2 text-left text-xs font-bold uppercase ${currentEntry.selfCheck === item ? "bg-cyan-600 text-white" : "bg-white dark:bg-slate-950"}`}>{item.replace("-", " ")}</button>)}
            </div>
            <label className="mt-4 block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Confidence {currentEntry.confidence}%
              <input type="range" min="0" max="100" value={currentEntry.confidence} onChange={(event) => onJournal({ confidence: Number(event.target.value) })} className="mt-2 w-full accent-cyan-500" />
            </label>
            <button type="button" onClick={onCompletePhase} className="action-primary mt-4 w-full py-2">Mark and continue</button>
            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Last saved: {currentEntry.updatedAt ? new Date(currentEntry.updatedAt).toLocaleTimeString() : "not yet"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BeyondGeoGebraCockpit({ packageSpec, packages, validation, assessment, tutor, readiness, commandDocs }: { packageSpec: UnitLabPackage; packages: UnitLabPackage[]; validation: ReturnType<typeof validateGuidedTaskResponse>; assessment: ReturnType<typeof assessConstruction>; tutor: ReturnType<typeof objectAwareTutorResponse>; readiness: ReturnType<typeof productionReadinessPlan>; commandDocs: ReturnType<typeof commandDocsForPackages> }) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-300/20 dark:bg-violet-400/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Beyond GeoGebra Teaching Intelligence</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{packages.length} unit labs with guided validation, teacher reveal, assessment, tutor prompts, production readiness, and command discovery.</p>
        </div>
        <span className="mini-chip">{packageSpec.unit}</span>
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Unit Lab</p>
          <p className="mt-2 font-bold">{packageSpec.title}</p>
          <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">{packageSpec.interactiveLab}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{packageSpec.formulas.slice(0, 3).join(" | ")}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Guided Validation</p>
          <p className={`mt-2 text-lg font-black ${validation.passed ? "text-emerald-600 dark:text-emerald-300" : "text-amber-700 dark:text-amber-200"}`}>{validation.score}%</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{validation.feedback}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Assessment</p>
          <p className={`mt-2 text-lg font-black ${assessment.passed ? "text-emerald-600 dark:text-emerald-300" : "text-amber-700 dark:text-amber-200"}`}>{assessment.score}%</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{packageSpec.assessment.constructionGoal}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Smart Tutor</p>
          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{tutor.explanation}</p>
          <p className="mt-2 text-xs font-bold text-violet-700 dark:text-violet-200">{tutor.nextChallenge}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Teacher Presentation</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Lock: {packageSpec.teacherPresentation.lockWorkspace ? "yes" : "no"}; spotlight: {packageSpec.teacherPresentation.spotlightObject}; share: {packageSpec.teacherPresentation.shareModes.join(", ")}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{packageSpec.teacherPresentation.studentPrompt}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Production Plan</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Performance: {readiness.performance.slice(0, 2).join(", ")}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Accessibility: {readiness.accessibility.slice(0, 2).join(", ")}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">UI: {readiness.uiPolish.slice(0, 2).join(", ")}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/70">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Command Discovery</p>
          <div className="mt-2 max-h-28 space-y-1 overflow-auto pr-1">
            {commandDocs.map((doc) => <p key={`${doc.unit}-${doc.tool}`} className="text-xs leading-5 text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-200">{doc.tool}</span> - {doc.unit}: {doc.example}</p>)}
          </div>
        </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {packageSpec.misconceptions.slice(0, 3).map((item) => <div key={item} className="rounded-xl bg-white p-2 text-xs font-semibold text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">Watch for: {item}</div>)}
      </div>
    </div>
  );
}

function TeacherPresentationPanel({ active, locked, revealStep, template, notes, journal, onToggle, onLock, onReveal, onNotes, onCopyLink }: { active: boolean; locked: boolean; revealStep: number; template: SyllabusWorkspaceTemplate; notes: string; journal: Record<string, ActivityJournalEntry>; onToggle: (value: boolean) => void; onLock: (value: boolean) => void; onReveal: (value: number) => void; onNotes: (notes: string) => void; onCopyLink: () => void }) {
  const visibleSteps = template.steps.slice(0, revealStep);
  const phaseSummary = template.steps.map((step) => journal[activityJournalKey(template.id, step.phase)] ?? defaultActivityJournalEntry(template.id, step.phase));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold">Teacher Presentation Mode</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onToggle(!active)} className={active ? "action-primary py-2" : "action-secondary py-2"}>{active ? "Presenting" : "Start"}</button>
          <button type="button" onClick={() => onLock(!locked)} className={locked ? "action-primary py-2" : "action-secondary py-2"}>{locked ? "Locked" : "Unlocked"}</button>
          <button type="button" onClick={onCopyLink} className="action-secondary py-2">Copy teacher link</button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => onReveal(Math.max(1, revealStep - 1))} className="action-secondary py-2">Previous reveal</button>
        <button type="button" onClick={() => onReveal(Math.min(template.steps.length, revealStep + 1))} className="action-secondary py-2">Next reveal</button>
        <span className="mini-chip">Reveal {revealStep}/{template.steps.length}</span>
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <ol className="space-y-2">
          {visibleSteps.map((step, index) => <li key={step.phase} className="rounded-xl bg-slate-100 p-3 text-sm leading-6 dark:bg-white/10"><span className="font-bold text-cyan-600 dark:text-cyan-300">{index + 1}. {step.title}</span> {step.prompt}</li>)}
        </ol>
        <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
          <h4 className="font-bold">Classroom Pulse</h4>
          <div className="mt-3 space-y-2">
            {phaseSummary.map((entry) => <div key={entry.phase} className="rounded-xl bg-white p-2 text-xs dark:bg-slate-950"><p className="font-bold uppercase">{entry.phase}</p><p>Check: {entry.selfCheck.replace("-", " ")}</p><p>Confidence: {entry.confidence}%</p></div>)}
          </div>
        </div>
      </div>
      <label className="mt-3 block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
        Teacher notes
        <textarea value={notes} onChange={(event) => onNotes(event.target.value)} rows={3} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm normal-case leading-6 dark:border-white/10 dark:bg-slate-950" placeholder="Board prompts, misconceptions, extension questions..." />
      </label>
    </div>
  );
}

function OfflineProjectLibraryPanel({ projects, status, onSave, onRestore, onDelete, onClear }: { projects: OfflineProjectEntry<WorkspaceSnapshot>[]; status: string; onSave: () => void; onRestore: (entry: OfflineProjectEntry<WorkspaceSnapshot>) => void; onDelete: (id: string) => void; onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Offline-First Project Library</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onSave} className="action-secondary py-2">Save current</button>
          <button type="button" onClick={onClear} className="action-secondary py-2">Clear</button>
        </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {projects.length === 0 ? <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Saved projects stay in browser storage and can be restored offline.</p> : projects.map((project) => (
          <div key={project.id} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
            <p className="font-bold">{project.title}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{new Date(project.savedAt).toLocaleString()} - {project.summary}</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => onRestore(project)} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-slate-950">Restore</button>
              <button type="button" onClick={() => onDelete(project.id)} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductionQualityPanel({ highContrast, performanceMode, qaReport, onHighContrast, onPerformance, onRunQa }: { highContrast: boolean; performanceMode: boolean; qaReport: WorkspaceQaReport; onHighContrast: (value: boolean) => void; onPerformance: (value: boolean) => void; onRunQa: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold">QA, Performance, Accessibility</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onRunQa} className="action-secondary py-2">Run QA</button>
          <button type="button" onClick={() => setShowDetails((value) => !value)} className="action-secondary py-2">{showDetails ? "Hide details" : "Show details"}</button>
        </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <Toggle checked={highContrast} label="High contrast" onChange={onHighContrast} />
        <Toggle checked={performanceMode} label="Performance mode" onChange={onPerformance} />
        <div className={`rounded-2xl p-3 text-sm font-bold ${qaReport.failed ? "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100"}`}>QA: {qaReport.passed} passed, {qaReport.failed} failed</div>
      </div>
      {showDetails && (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {qaReport.checks.map((check) => <div key={check.id} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10"><p className="font-bold">{check.passed ? "Pass" : "Fail"} - {check.label}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{check.area}: {check.detail}</p></div>)}
        </div>
      )}
    </div>
  );
}

function GizmoReadout3D({ selected, transform }: { selected: string; transform: Transform3D }) {
  const mode: TransformMode3 = selected === "slice" || selected === "plane3d" ? "rotate" : selected === "solid" || selected.endsWith("3d") ? "scale" : "translate";
  const handles = createTransformGizmo(mode);
  const measurement = object3Measurement(transformToKernelObject(selected, transform));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold">3D Gizmo And Measurement</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{transform.name ?? selected} uses {mode} handles with snap-ready axes.</p>
        </div>
        <span className="mini-chip">{handles.length} handles</span>
      </div>
      <div className="mt-3 grid gap-2">
        {handles.map((handle) => (
          <div key={handle.id} className="flex items-center justify-between rounded-xl bg-slate-100 p-2 dark:bg-white/10">
            <span className="font-bold" style={{ color: handle.color }}>{handle.label}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">snap {handle.snapStep}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {measurement.detail}; V={roundTo(measurement.volume, 3)}, SA={roundTo(measurement.surfaceArea, 3)}
      </p>
    </div>
  );
}

function transformToKernelObject(selected: string, transform: Transform3D): Object3 {
  const center = kernelPoint3(transform.position[0], transform.position[1], transform.position[2]);
  const dims = transform.dimensions ?? [transform.scale, transform.scale, transform.scale];
  const name = `${selected} ${transform.name ?? ""}`.toLowerCase();
  if (selected === "sphere3d" || selected === "solid" || name.includes("sphere") || name.includes("cube") || name.includes("prism") || name.includes("pyramid") || name.includes("polyhedron")) return kernelSphere3(center, Math.max(dims[0], dims[1], dims[2]) * transform.scale * 0.5);
  if (selected === "cylinder3d" || name.includes("cylinder")) return kernelCylinder3(center, dims[0] * transform.scale, dims[1] * transform.scale);
  if (selected === "cone3d" || name.includes("cone")) return kernelCone3(center, dims[0] * transform.scale, dims[1] * transform.scale);
  if (selected === "plane3d" || selected === "slice" || name.includes("plane") || name.includes("surface")) return kernelPlane3(center, kernelPoint3(0, 0, 1));
  return kernelLine3(center, kernelPoint3(dims[0] || 1, dims[1] || 0, dims[2] || 0));
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  downloadBlob(filename, blob);
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function activityJournalKey(templateId: string, phase: GuidedActivityPhase) {
  return `${templateId}:${phase}`;
}

function defaultActivityJournalEntry(templateId: string, phase: GuidedActivityPhase): ActivityJournalEntry {
  return { templateId, phase, response: "", selfCheck: "not-started", confidence: 50, updatedAt: 0 };
}

function createLessonPack(template: SyllabusWorkspaceTemplate, snapshot: WorkspaceSnapshot, journal: Record<string, ActivityJournalEntry>, results: ResultCard[], notes: string) {
  return {
    app: "Math Universe",
    version: "browser-only-lesson-pack",
    exportedAt: new Date().toISOString(),
    template: {
      id: template.id,
      unit: template.unit,
      title: template.title,
      description: template.description,
      command: template.command,
      outcomes: template.outcomes,
      steps: template.steps,
    },
    teacherNotes: notes,
    guidedJournal: Object.values(journal).filter((entry) => entry.templateId === template.id),
    recentResults: results.slice(0, 12).map((result) => ({ input: result.input, interpretation: result.interpretation, result: result.result, detail: result.detail })),
    workspaceSnapshot: snapshot,
  };
}

function activityJournalToCsv(journal: Record<string, ActivityJournalEntry>) {
  const rows = [["Template", "Phase", "Self check", "Confidence", "Response", "Updated"]];
  Object.values(journal).forEach((entry) => rows.push([entry.templateId, entry.phase, entry.selfCheck, String(entry.confidence), entry.response, entry.updatedAt ? new Date(entry.updatedAt).toISOString() : ""]));
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function createWorksheetPdf(template: SyllabusWorkspaceTemplate, results: ResultCard[]) {
  const lines = [
    `Math Universe Worksheet: ${template.unit}`,
    template.title,
    "",
    "Learning outcomes:",
    ...template.outcomes.map((outcome) => `- ${outcome}`),
    "",
    "Guided activity:",
    ...template.steps.flatMap((step, index) => [`${index + 1}. ${step.title}`, `Prompt: ${step.prompt}`, `Reveal: ${step.reveal}`]),
    "",
    "Recent workspace results:",
    ...(results.length ? results.slice(0, 6).map((result) => `${result.input}: ${result.result}`) : ["No results exported yet."]),
  ];
  return simplePdf(lines);
}

function simplePdf(lines: string[]) {
  const escapedLines = lines.map((line) => line.replace(/[()\\]/g, "\\$&"));
  const content = escapedLines.map((line, index) => `BT /F1 11 Tf 56 ${780 - index * 18} Td (${line}) Tj ET`).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { body += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return body;
}

function buildAlgebraObjects(plots: PlotItem[], construction: Construction, transforms3d: Record<ThreeObjectId, Transform3D>, lockedGeometryIds: string[], added3dObjects: Added3DObject[] = []): AlgebraObjectRow[] {
  const pointName = (id: string) => pointById(construction.points, id)?.label ?? id.slice(0, 4);
  const rows: AlgebraObjectRow[] = plots.map((plot, index) => ({
    ref: { kind: "function", id: plot.id },
    name: plot.name ?? String.fromCharCode(102 + index),
    definition: `${plot.name ?? String.fromCharCode(102 + index)}(x) = ${plot.expression}`,
    visible: plot.visible !== false,
    locked: plot.locked === true,
    trace: plot.trace === true,
    dependencies: dependenciesForExpression(plot.expression),
  }));
  rows.push(...construction.points.map((point) => ({
    ref: { kind: "point" as const, id: point.id },
    name: point.label,
    definition: `${point.label} = (${roundTo(point.x, 2)}, ${roundTo(point.y, 2)})`,
    visible: point.style?.visible !== false,
    locked: lockedGeometryIds.includes(point.id),
    trace: point.style?.trace === true,
    dependencies: [],
  })));
  rows.push(...construction.lines.map((line, index) => ({
    ref: { kind: "line" as const, id: line.id },
    name: lineName(line, construction, index),
    definition: lineEquation(line, construction),
    visible: line.style?.visible !== false,
    locked: lockedGeometryIds.includes(line.id),
    trace: line.style?.trace === true,
    dependencies: [pointName(line.a), pointName(line.b)],
  })));
  rows.push(...construction.circles.map((circle, index) => ({
    ref: { kind: "circle" as const, id: circle.id },
    name: circleName(circle, construction, index),
    definition: circleEquation(circle, construction),
    visible: circle.style?.visible !== false,
    locked: lockedGeometryIds.includes(circle.id),
    trace: circle.style?.trace === true,
    dependencies: [pointName(circle.center), pointName(circle.edge)],
  })));
  rows.push(...construction.polygons.map((polygon, index) => ({
    ref: { kind: "polygon" as const, id: polygon.id },
    name: polygonName(polygon, construction, index),
    definition: `Polygon(${polygon.points.map(pointName).join(", ")})`,
    visible: polygon.style?.visible !== false,
    locked: lockedGeometryIds.includes(polygon.id),
    trace: polygon.style?.trace === true,
    dependencies: polygon.points.map(pointName),
  })));
  rows.push(...construction.arcs.map((arc, index) => ({
    ref: { kind: "arc" as const, id: arc.id },
    name: (arc.style?.label ?? `${arc.sector ? "sector" : "arc"}${index + 1}`),
    definition: `${arc.sector ? "Sector" : "Arc"}(${pointName(arc.center)}, ${pointName(arc.start)}, ${pointName(arc.end)})`,
    visible: arc.style?.visible !== false,
    locked: lockedGeometryIds.includes(arc.id),
    trace: arc.style?.trace === true,
    dependencies: [pointName(arc.center), pointName(arc.start), pointName(arc.end)],
  })));
  rows.push(...construction.loci.map((locus) => ({
    ref: { kind: "locus" as const, id: locus.id },
    name: locus.label,
    definition: `Locus(${locus.points.length} points)`,
    visible: locus.style?.visible !== false,
    locked: lockedGeometryIds.includes(locus.id),
    trace: true,
    dependencies: [],
  })));
  rows.push(...(Object.keys(transforms3d) as ThreeObjectId[]).map((id) => ({
    ref: { kind: "3d" as const, id },
    name: transforms3d[id].name ?? id,
    definition: transformDefinition(transforms3d[id]),
    visible: transforms3d[id].visible,
    locked: transforms3d[id].locked === true,
    trace: transforms3d[id].trace === true,
    dependencies: id === "vector" ? [transforms3d.point.name ?? "P"] : [],
  })));
  rows.push(...added3dObjects.map((object) => ({
    ref: { kind: "3d" as const, id: object.id },
    name: object.transform.name ?? object.label,
    definition: transformDefinition(object.transform),
    visible: object.transform.visible,
    locked: object.transform.locked === true,
    trace: object.transform.trace === true,
    dependencies: [object.baseId],
  })));
  return rows;
}

function objectKindForKernel(kind: AlgebraObjectKind): DynamicObjectKind {
  if (kind === "3d") return "solid";
  return kind;
}

function sameRef(a: AlgebraObjectRef | null, b: AlgebraObjectRef) {
  return a?.kind === b.kind && a.id === b.id;
}

function objectDisplayName(objects: AlgebraObjectRow[], ref: AlgebraObjectRef) {
  return objects.find((object) => sameRef(object.ref, ref))?.name ?? ref.id;
}

function nextFunctionName(plots: PlotItem[]) {
  const used = new Set(plots.map((plot) => plot.name).filter(Boolean));
  for (const name of ["f", "g", "h", "p", "q", "r"]) if (!used.has(name)) return name;
  return `f${plots.length + 1}`;
}

function normalizeFunctionDefinition(definition: string) {
  return definition.replace(/^\s*[a-z]\s*\(\s*x\s*\)\s*=\s*/i, "").replace(/^y\s*=\s*/i, "").trim();
}

function dependenciesForExpression(expression: string) {
  return Array.from(new Set((expression.match(/\b[a-z]\b/gi) ?? []).filter((token) => token.toLowerCase() !== "x")));
}

function parsePointDefinition(definition: string) {
  const match = definition.match(/\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?/);
  return match ? { x: Number(match[1]), y: Number(match[2]) } : null;
}

function parseLineDefinition(definition: string) {
  const compact = definition.replace(/\s+/g, "");
  const match = compact.match(/^y=([-+]?\d*\.?\d*)\*?x([-+]\d+(?:\.\d+)?)?$/i);
  if (!match) return null;
  const rawM = match[1];
  const m = rawM === "" || rawM === "+" ? 1 : rawM === "-" ? -1 : Number(rawM);
  return { m, b: Number(match[2] ?? 0) };
}

function parseCircleDefinition(definition: string) {
  const match = definition.match(/center\s*=\s*\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?\s*,?\s*r\s*=\s*(\d+(?:\.\d+)?)/i);
  return match ? { x: Number(match[1]), y: Number(match[2]), r: Number(match[3]) } : null;
}

function parse3dDefinition(definition: string): Partial<Transform3D> | null {
  const numbers = definition.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length < 7) return null;
  return { position: [numbers[0], numbers[1], numbers[2]], rotation: [numbers[3], numbers[4], numbers[5]], scale: numbers[6] };
}

function renameGeometryObject(construction: Construction, ref: AlgebraObjectRef, name: string): Construction {
  if (ref.kind === "point") return { ...construction, points: construction.points.map((point) => point.id === ref.id ? { ...point, label: name.slice(0, 3) } : point) };
  const patch = { style: { ...(geometryObjectBySelection(construction, { type: ref.kind as GeometryObjectType, id: ref.id })?.style ?? {}), label: name } as GeoStyle };
  return patchGeometryObject(construction, { type: ref.kind as GeometryObjectType, id: ref.id }, patch);
}

function updateLineFromEquation(construction: Construction, lineId: string, m: number, b: number) {
  const line = construction.lines.find((item) => item.id === lineId);
  if (!line) return construction;
  const x1 = 100;
  const x2 = 540;
  const y1 = 210 - (m * ((x1 - 320) / 40) + b) * 40;
  const y2 = 210 - (m * ((x2 - 320) / 40) + b) * 40;
  return solveConstruction({ ...construction, points: construction.points.map((point) => point.id === line.a ? { ...point, x: x1, y: y1 } : point.id === line.b ? { ...point, x: x2, y: y2 } : point) });
}

function updateCircleFromDefinition(construction: Construction, circleId: string, next: { x: number; y: number; r: number }) {
  const circle = construction.circles.find((item) => item.id === circleId);
  if (!circle) return construction;
  return solveConstruction({
    ...construction,
    points: construction.points.map((point) => {
      if (point.id === circle.center) return { ...point, x: next.x, y: next.y };
      if (point.id === circle.edge) return { ...point, x: next.x + next.r * 40, y: next.y };
      return point;
    }),
  });
}

function lineName(line: GeoLine, construction: Construction, index: number) {
  const label = (line.style as GeoStyle & { label?: string })?.label;
  const endpointName = `${labelForPoint(construction, line.a)}${labelForPoint(construction, line.b)}`;
  return label ?? (endpointName || `line${index + 1}`);
}

function circleName(circle: GeoCircle, construction: Construction, index: number) {
  const label = (circle.style as GeoStyle & { label?: string })?.label;
  return label ?? `c${index + 1}_${labelForPoint(construction, circle.center)}`;
}

function polygonName(polygon: GeoPolygon, construction: Construction, index: number) {
  const label = (polygon.style as GeoStyle & { label?: string })?.label;
  return label ?? (polygon.points.map((id) => labelForPoint(construction, id)).join("") || `poly${index + 1}`);
}

function lineEquation(line: GeoLine, construction: Construction) {
  const a = pointById(construction.points, line.a), b = pointById(construction.points, line.b);
  if (!a || !b) return "Line(undefined)";
  const x1 = (a.x - 320) / 40;
  const y1 = (210 - a.y) / 40;
  const x2 = (b.x - 320) / 40;
  const y2 = (210 - b.y) / 40;
  if (Math.abs(x2 - x1) < 0.001) return `x = ${roundTo(x1, 2)}`;
  const m = (y2 - y1) / (x2 - x1);
  const intercept = y1 - m * x1;
  return `y = ${roundTo(m, 3)}*x ${intercept < 0 ? "-" : "+"} ${roundTo(Math.abs(intercept), 3)}`;
}

function circleEquation(circle: GeoCircle, construction: Construction) {
  const center = pointById(construction.points, circle.center), edge = pointById(construction.points, circle.edge);
  if (!center || !edge) return "Circle(undefined)";
  return `center=(${roundTo(center.x, 2)}, ${roundTo(center.y, 2)}), r=${roundTo(distance(center, edge) / 40, 2)}`;
}

function transformDefinition(transform: Transform3D) {
  return `pos=(${transform.position.map((value) => roundTo(value, 2)).join(", ")}), rot=(${transform.rotation.map((value) => roundTo(value, 1)).join(", ")}), scale=${roundTo(transform.scale, 2)}`;
}

function templateConstruction(templateId: string): Construction {
  const point = (id: string, x: number, y: number, label: string): GeoPoint => ({ id, x, y, label });
  if (templateId === "circles") {
    return normalizeConstruction({
      points: [point("a", 320, 210, "O"), point("b", 430, 210, "A"), point("c", 395, 292, "P")],
      lines: [{ id: "r", a: "a", b: "b" }],
      circles: [{ id: "circle", center: "a", edge: "b" }],
      polygons: [],
      arcs: [],
      loci: [],
      constraints: [{ id: "on-circle", type: "on-circle", point: "c", circle: "circle" }],
    });
  }
  if (templateId === "quadrilaterals") {
    return normalizeConstruction({
      points: [point("a", 190, 145, "A"), point("b", 420, 145, "B"), point("c", 490, 300, "C"), point("d", 260, 300, "D")],
      lines: [{ id: "ab", a: "a", b: "b" }, { id: "bc", a: "b", b: "c" }, { id: "cd", a: "c", b: "d" }, { id: "da", a: "d", b: "a" }],
      circles: [],
      polygons: [{ id: "quad", points: ["a", "b", "c", "d"], style: { fill: "rgba(6,182,212,.16)", color: "#06b6d4" } }],
      arcs: [],
      loci: [],
      constraints: [],
    });
  }
  if (templateId === "coordinate-geometry") {
    return normalizeConstruction({
      points: [point("a", 240, 260, "A"), point("b", 420, 140, "B")],
      lines: [{ id: "ab", a: "a", b: "b" }],
      circles: [],
      polygons: [],
      arcs: [],
      loci: [],
      constraints: [],
    });
  }
  return normalizeConstruction({
    points: [point("a", 220, 300, "A"), point("b", 420, 300, "B"), point("c", 330, 130, "C")],
    lines: [{ id: "ab", a: "a", b: "b" }, { id: "bc", a: "b", b: "c" }, { id: "ca", a: "c", b: "a" }],
    circles: [],
    polygons: [{ id: "poly", points: ["a", "b", "c"] }],
    arcs: [],
    loci: [],
    constraints: [],
  });
}

function resultsToCsv(results: ResultCard[]) {
  const rows = [["Input", "Interpretation", "Result", "Detail"], ...results.map((result) => [result.input, result.interpretation, result.result, result.detail ?? ""])];
  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
}

function HiddenGeometryExport({ construction, images, refSetter, showUnits = false }: { construction: Construction; images: WorkspaceImage[]; refSetter: (node: SVGSVGElement | null) => void; showUnits?: boolean }) {
  return (
    <svg ref={refSetter} viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" className="hidden">
      <rect width="640" height="420" fill="#ffffff" />
      <GeometryGrid showUnits={showUnits} />
      {images.filter((image) => image.visible !== false).map((image) => <image key={image.id} href={image.src} x={image.x} y={image.y} width={image.width} height={image.height} opacity={image.opacity} preserveAspectRatio="xMidYMid meet" />)}
      {construction.loci.map((locus) => <GeometryLocus key={locus.id} locus={locus} />)}
      {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} />)}
      {construction.arcs.map((arc) => <GeometryArc key={arc.id} arc={arc} points={construction.points} />)}
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

function HorizontalPanelHeader({ title, side, onCollapse }: { title: string; side: "left" | "right"; onCollapse: () => void }) {
  const Icon = side === "left" ? PanelLeftClose : PanelRightClose;
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white/85 p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="min-w-0 px-2">
        <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Horizontal panel</p>
        <h3 className="truncate text-sm font-black">{title}</h3>
      </div>
      <button type="button" onClick={onCollapse} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-cyan-100 hover:text-cyan-800 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-cyan-300/15" title={`Collapse ${title}`} aria-label={`Collapse ${title}`}>
        <Icon className="h-5 w-5" />
      </button>
    </div>
  );
}

function Workspace3DProjectionPane({ selected, transform, surface, surfaceScale, solid, solidSize, crossSection, showSurface, showSolid }: { selected: string; transform: Transform3D; surface: SurfaceKind; surfaceScale: number; solid: SolidKind; solidSize: number; crossSection: number; showSurface: boolean; showSolid: boolean }) {
  const px = 170 + transform.position[0] * 18;
  const py = 150 - transform.position[1] * 18;
  const pz = 150 - transform.position[2] * 18;
  const solidRadius = Math.max(18, Math.min(82, solidSize * 18));
  const surfaceAmp = Math.max(8, Math.min(42, surfaceScale * 20));
  return (
    <div className="grid min-h-[420px] gap-3 lg:grid-cols-2 2xl:grid-cols-1">
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">2D Pane</p>
            <h3 className="text-sm font-black">Top View X-Y</h3>
          </div>
          <span className="mini-chip">{selected || "none"}</span>
        </div>
        <svg viewBox="0 0 340 250" className="mt-3 h-[min(28vh,260px)] min-h-[210px] w-full rounded-xl bg-slate-50 dark:bg-slate-900">
          <defs>
            <pattern id="workspace-3d-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(100,116,139,.28)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="340" height="250" fill="url(#workspace-3d-grid)" />
          <line x1="20" y1="125" x2="320" y2="125" stroke="#ef4444" strokeWidth="3" />
          <line x1="170" y1="230" x2="170" y2="20" stroke="#22c55e" strokeWidth="3" />
          <text x="300" y="116" fill="#ef4444" fontSize="14" fontWeight="800">x</text>
          <text x="178" y="32" fill="#22c55e" fontSize="14" fontWeight="800">y</text>
          {showSurface && <path d={`M 35 ${125 + surfaceAmp} C 80 ${90 - surfaceAmp}, 125 ${165 + surfaceAmp}, 170 125 S 260 ${85 - surfaceAmp}, 305 ${125 + surfaceAmp}`} fill="none" stroke="#06b6d4" strokeWidth="5" opacity="0.55" />}
          {showSolid && (solid === "cube" || solid === "cuboid" ? <rect x={170 - solidRadius / 2} y={125 - solidRadius / 2} width={solidRadius} height={solidRadius} fill="#f59e0b" opacity="0.42" stroke="#f59e0b" strokeWidth="3" /> : <circle cx="170" cy="125" r={solidRadius / 2} fill="#f59e0b" opacity="0.38" stroke="#f59e0b" strokeWidth="3" />)}
          <line x1="20" y1={125 - crossSection * 18} x2="320" y2={125 - crossSection * 18} stroke="#a855f7" strokeWidth="3" strokeDasharray="8 7" />
          <circle cx={px} cy={py} r="8" fill={transform.color} stroke="#0f172a" strokeWidth="2" />
        </svg>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <MiniReadout label="x" value={transform.position[0]} />
          <MiniReadout label="y" value={transform.position[1]} />
          <MiniReadout label="scale" value={transform.scale} />
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-violet-700 dark:text-violet-200">2D Pane</p>
            <h3 className="text-sm font-black">Side View X-Z</h3>
          </div>
          <span className="mini-chip">z {roundTo(crossSection, 2)}</span>
        </div>
        <svg viewBox="0 0 340 250" className="mt-3 h-[min(28vh,260px)] min-h-[210px] w-full rounded-xl bg-slate-50 dark:bg-slate-900">
          <rect width="340" height="250" fill="url(#workspace-3d-grid)" />
          <line x1="20" y1="125" x2="320" y2="125" stroke="#ef4444" strokeWidth="3" />
          <line x1="170" y1="230" x2="170" y2="20" stroke="#38bdf8" strokeWidth="3" />
          <text x="300" y="116" fill="#ef4444" fontSize="14" fontWeight="800">x</text>
          <text x="178" y="32" fill="#38bdf8" fontSize="14" fontWeight="800">z</text>
          {showSurface && <path d={`M 35 ${125 + surfaceAmp} C 92 ${132 - surfaceAmp}, 130 ${82 + surfaceAmp}, 170 ${125 - surfaceAmp} S 255 ${168 - surfaceAmp}, 305 ${105 + surfaceAmp}`} fill="none" stroke="#06b6d4" strokeWidth="5" opacity="0.55" />}
          {showSolid && <rect x={170 - solidRadius / 2} y={125 - solidRadius / 2} width={solidRadius} height={solidRadius} rx="10" fill="#f59e0b" opacity="0.38" stroke="#f59e0b" strokeWidth="3" />}
          <line x1="20" y1={125 - crossSection * 18} x2="320" y2={125 - crossSection * 18} stroke="#a855f7" strokeWidth="3" strokeDasharray="8 7" />
          <circle cx={px} cy={pz} r="8" fill={transform.color} stroke="#0f172a" strokeWidth="2" />
        </svg>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <MiniReadout label="x" value={transform.position[0]} />
          <MiniReadout label="z" value={transform.position[2]} />
          <MiniReadout label="size" value={solidSize} />
        </div>
      </section>
    </div>
  );
}

function MiniReadout({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
      <p className="font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-mono font-black text-slate-950 dark:text-white">{roundTo(value, 2)}</p>
    </div>
  );
}

function ImageObjectPanel({ image, onChange, onDelete }: { image: WorkspaceImage | null; onChange: (patch: Partial<WorkspaceImage>) => void; onDelete: () => void }) {
  if (!image) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
        <h3 className="font-bold">Image Layer</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Use Add Image to place a picture on the geometry board. Click an image to edit size, opacity, and lock state.</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-cyan-300 bg-cyan-50/70 p-4 dark:border-cyan-300/40 dark:bg-cyan-400/10">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold">Selected Image</h3>
        <button type="button" onClick={onDelete} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">Delete</button>
      </div>
      <label className="mt-3 block text-xs font-bold uppercase text-slate-500 dark:text-slate-300">
        Name
        <input value={image.name} onChange={(event) => onChange({ name: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-semibold normal-case dark:border-white/10 dark:bg-slate-900" />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <MiniNumber label="x" value={roundTo(image.x, 1)} onChange={(x) => onChange({ x })} />
        <MiniNumber label="y" value={roundTo(image.y, 1)} onChange={(y) => onChange({ y })} />
        <MiniNumber label="width" value={roundTo(image.width, 1)} onChange={(width) => onChange({ width: Math.max(20, width) })} />
        <MiniNumber label="height" value={roundTo(image.height, 1)} onChange={(height) => onChange({ height: Math.max(20, height) })} />
      </div>
      <div className="mt-3">
        <SliderControl label="Opacity" value={image.opacity} min={0.1} max={1} step={0.05} onChange={(opacity) => onChange({ opacity })} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Toggle checked={image.visible !== false} label="Visible" onChange={(visible) => onChange({ visible })} />
        <Toggle checked={image.locked === true} label="Locked" onChange={(locked) => onChange({ locked })} />
      </div>
    </div>
  );
}

type SceneSetupTabs3DProps = {
  selected3d: string;
  selected3dTransform: Transform3D;
  surface: SurfaceKind;
  solid: SolidKind;
  surfaceExpression: string;
  surfaceScale: number;
  height3d: number;
  crossSection: number;
  sceneAnimationSpeed: number;
  showSurface: boolean;
  showSolid: boolean;
  autoRotate3d: boolean;
  cameraPreset3d: CameraPreset3D;
  onSurface: (value: SurfaceKind) => void;
  onSolid: (value: SolidKind) => void;
  onObject: (id: ThreeObjectId) => void;
  onSurfaceExpression: (value: string) => void;
  onSurfaceScale: (value: number) => void;
  onHeight: (value: number) => void;
  onCrossSection: (value: number) => void;
  onAnimationSpeed: (value: number) => void;
  onShowSurface: (value: boolean) => void;
  onShowSolid: (value: boolean) => void;
  onAutoRotate: (value: boolean) => void;
  onCamera: (preset: CameraPreset3D) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSelectTool: () => void;
  onNudge: (axis: number, amount: number) => void;
  onRotateAxis: (axis: number, amount: number) => void;
  onScale: (amount: number) => void;
  onMaterial: (material: Transform3D["material"]) => void;
  onOpacity: (opacity: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onLock: () => void;
  onTrace: () => void;
};

function SceneSetupTabs3D(props: SceneSetupTabs3DProps) {
  const [openSections, setOpenSections] = useState<Record<"surface" | "solid" | "parameters" | "tools" | "camera", boolean>>({
    surface: true,
    solid: true,
    parameters: true,
    tools: false,
    camera: false,
  });
  const toggleSection = (section: keyof typeof openSections) => setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
      <AccordionSection title="Surface" summary={surfaceFormula(props.surface, props.surfaceScale)} open={openSections.surface} onToggle={() => toggleSection("surface")}>
        <label className="block rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">
          Surface
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={props.surface} onChange={(event) => props.onSurface(event.target.value as SurfaceKind)}>
            <option value="paraboloid">z = scale(x^2 + y^2)</option>
            <option value="saddle">z = scale(x^2 - y^2)</option>
            <option value="wave">z = scale sin(x) cos(y)</option>
            <option value="plane">z = scale(x + y)</option>
            <option value="ripple">z = scale sin(x^2+y^2)</option>
            <option value="cone-surface">z = scale sqrt(x^2+y^2)</option>
            <option value="custom-z">Custom z=f(x,y)</option>
            <option value="parametric">Parametric torus preset</option>
            <option value="implicit">Implicit sphere preset</option>
          </select>
          <input value={props.surfaceExpression} onChange={(event) => props.onSurfaceExpression(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-900" placeholder="sin(x) * cos(y)" />
        </label>
      </AccordionSection>
      <AccordionSection title="Solid" summary={props.solid} open={openSections.solid} onToggle={() => toggleSection("solid")}>
        <label className="block rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">
          Solid
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={props.solid} onChange={(event) => props.onSolid(event.target.value as SolidKind)}>
            <option value="cube">Cube</option>
            <option value="cuboid">Cuboid</option>
            <option value="sphere">Sphere</option>
            <option value="ellipsoid">Ellipsoid</option>
            <option value="hemisphere">Hemisphere</option>
            <option value="cylinder">Cylinder</option>
            <option value="cone">Cone</option>
            <option value="frustum">Frustum</option>
            <option value="torus">Torus</option>
            <option value="tube">Tube</option>
            <option value="capsule">Capsule</option>
            <option value="prism">Prism</option>
            <option value="pyramid">Pyramid</option>
            <option value="tetrahedron">Tetrahedron</option>
            <option value="octahedron">Octahedron</option>
            <option value="dodecahedron">Dodecahedron</option>
            <option value="wedge">Wedge</option>
            <option value="polyhedron">Polyhedron</option>
          </select>
        </label>
      </AccordionSection>
      <AccordionSection title="3D scene parameters" summary={`scale ${props.surfaceScale}, height ${props.height3d}, z ${props.crossSection}`} open={openSections.parameters} onToggle={() => toggleSection("parameters")}>
        <div className="grid gap-3">
          <div className="rounded-xl border border-slate-200 bg-white/75 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
            <div className="grid gap-x-4 gap-y-1">
              <SliderControl density="compact" label="Surface scale" value={props.surfaceScale} min={0.2} max={2.5} step={0.1} onChange={props.onSurfaceScale} />
              <SliderControl density="compact" label="Solid height / radius" value={props.height3d} min={0.8} max={5} step={0.1} onChange={props.onHeight} />
              <SliderControl density="compact" label="Cross-section z" value={props.crossSection} min={-3} max={3} step={0.1} onChange={props.onCrossSection} />
              <SliderControl density="compact" label="Scene animation speed" value={props.sceneAnimationSpeed} min={0} max={0.6} step={0.02} onChange={props.onAnimationSpeed} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 content-start">
            <Toggle checked={props.showSurface} label="Surface" onChange={props.onShowSurface} />
            <Toggle checked={props.showSolid} label="Solid" onChange={props.onShowSolid} />
            <Toggle checked={props.autoRotate3d} label="Auto rotate" onChange={props.onAutoRotate} />
            <button type="button" onClick={() => props.onAutoRotate(false)} className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold dark:bg-white/10">Pause rotation</button>
            <button type="button" onClick={props.onReset} className="col-span-2 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold dark:bg-white/10">Reset view</button>
          </div>
        </div>
      </AccordionSection>
      <AccordionSection title="3D tools" summary={props.selected3d ? `selected ${props.selected3d}` : "construct and edit"} open={openSections.tools} onToggle={() => toggleSection("tools")}>
        <div className="grid gap-3">
          <Space3DToolPalette
            activeObject={props.selected3d}
            selectedTransform={props.selected3dTransform}
            activeSurface={props.surface}
            activeSolid={props.solid}
            cameraPreset={props.cameraPreset3d}
            autoRotate={props.autoRotate3d}
            showSurface={props.showSurface}
            showSolid={props.showSolid}
            onSurface={props.onSurface}
            onSolid={props.onSolid}
            onObject={props.onObject}
            onCamera={props.onCamera}
            onToggleSurface={props.onShowSurface}
            onToggleSolid={props.onShowSolid}
            onToggleRotate={props.onAutoRotate}
            onSelectTool={props.onSelectTool}
            onZoomIn={props.onZoomIn}
            onZoomOut={props.onZoomOut}
            onReset={props.onReset}
            onNudge={props.onNudge}
            onRotateAxis={props.onRotateAxis}
            onScale={props.onScale}
            onMaterial={props.onMaterial}
            onOpacity={props.onOpacity}
            onDuplicate={props.onDuplicate}
            onDelete={props.onDelete}
            onRestore={props.onRestore}
            onLock={props.onLock}
            onTrace={props.onTrace}
          />
          <ThreeCreationPanel onCreate={props.onObject} />
        </div>
      </AccordionSection>
      <AccordionSection title="Camera" summary={props.cameraPreset3d} open={openSections.camera} onToggle={() => toggleSection("camera")}>
        <div className="grid gap-3">
          <CameraPresetPanel preset={props.cameraPreset3d} onPreset={props.onCamera} />
          <div className="grid content-start gap-2">
            <button type="button" onClick={props.onZoomOut} className="action-secondary"><ZoomOut className="h-4 w-4" />Zoom out</button>
            <button type="button" onClick={props.onZoomIn} className="action-secondary"><ZoomIn className="h-4 w-4" />Zoom in</button>
            <button type="button" onClick={props.onReset} className="action-secondary"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}

function InspectorTabs3D({ selected, transform, transforms, addedObjects, onSelect, onTransform, onVector, onRestore, onDelete }: { selected: string; transform: Transform3D; transforms: Record<ThreeObjectId, Transform3D>; addedObjects: Added3DObject[]; onSelect: (id: string) => void; onTransform: (id: string, patch: Partial<Transform3D>) => void; onVector: (id: string, key: "position" | "rotation", index: number, value: number) => void; onRestore: (id: string) => void; onDelete: (id: string) => void }) {
  const [openSections, setOpenSections] = useState<Record<"object" | "transform" | "objects", boolean>>({
    object: true,
    transform: false,
    objects: true,
  });
  const toggleSection = (section: keyof typeof openSections) => setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
      <AccordionSection title="3D scene objects" summary={`${addedObjects.length + 3} objects`} open={openSections.objects} onToggle={() => toggleSection("objects")}>
        <ObjectList3D selected={selected} transforms={transforms} addedObjects={addedObjects} onSelect={onSelect} onRestore={onRestore} onDelete={onDelete} />
      </AccordionSection>
      <AccordionSection title="Selected object" summary={selected || "none"} open={openSections.object} onToggle={() => toggleSection("object")}>
        <Properties3DPanel selected={selected} transform={transform} onTransform={onTransform} onVector={onVector} onRestore={onRestore} onDelete={onDelete} mode="object" />
      </AccordionSection>
      <AccordionSection title="Transform" summary={`x ${transform.position[0]}, y ${transform.position[1]}, z ${transform.position[2]}`} open={openSections.transform} onToggle={() => toggleSection("transform")}>
        <Properties3DPanel selected={selected} transform={transform} onTransform={onTransform} onVector={onVector} onRestore={onRestore} onDelete={onDelete} mode="transform" />
      </AccordionSection>
    </div>
  );
}

function AccordionSection({ title, summary, open, onToggle, children }: { title: string; summary?: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white/75 shadow-sm dark:border-white/10 dark:bg-slate-950/30">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5" aria-expanded={open}>
        <span className="min-w-0">
          <span className="block text-sm font-black text-slate-950 dark:text-white">{title}</span>
          {summary && <span className="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{summary}</span>}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-slate-200 p-3 dark:border-white/10">{children}</div>}
    </section>
  );
}

function PanelTabs<T extends string>({ active, tabs, onChange }: { active: T; tabs: Array<{ id: T; label: string }>; onChange: (id: T) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-white/10">
      {tabs.map((item) => (
        <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-black transition ${active === item.id ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white" : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/10"}`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ThreeCreationPanel({ onCreate }: { onCreate: (id: ThreeObjectId) => void }) {
  const tools: { id: ThreeObjectId; label: string }[] = [
    { id: "point", label: "Point" },
    { id: "vector", label: "Vector" },
    { id: "line3d", label: "Line" },
    { id: "plane3d", label: "Plane" },
    { id: "sphere3d", label: "Sphere" },
    { id: "cone3d", label: "Cone" },
    { id: "cylinder3d", label: "Cylinder" },
    { id: "prism3d", label: "Prism" },
    { id: "pyramid3d", label: "Pyramid" },
    { id: "polyhedron3d", label: "Polyhedron" },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <h3 className="font-bold">3D construction tools</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {tools.map((tool) => <button key={tool.id} type="button" onClick={() => onCreate(tool.id)} className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold dark:bg-white/10">{tool.label}</button>)}
      </div>
    </div>
  );
}

function CameraPresetPanel({ preset, onPreset }: { preset: CameraPreset3D; onPreset: (preset: CameraPreset3D) => void }) {
  const presets: CameraPreset3D[] = ["top", "front", "right", "isometric", "free"];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <h3 className="font-bold">Camera presets</h3>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {presets.map((item) => <button key={item} type="button" onClick={() => onPreset(item)} className={`rounded-2xl px-3 py-2 text-xs font-bold uppercase ${preset === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 dark:bg-white/10"}`}>{item}</button>)}
      </div>
    </div>
  );
}

function ObjectList3D({ selected, transforms, addedObjects, onSelect, onRestore, onDelete }: { selected: string; transforms: Record<ThreeObjectId, Transform3D>; addedObjects: Added3DObject[]; onSelect: (id: string) => void; onRestore: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold">3D Scene Objects</h3>
        <button type="button" onClick={() => { threeBaseIds.forEach(onRestore); addedObjects.forEach((object) => onRestore(object.id)); }} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold dark:bg-white/10">Restore all</button>
      </div>
      <div className="mt-3 max-h-[28vh] space-y-2 overflow-y-auto pr-1">
        {threeBaseIds.map((id) => (
          <div key={id} className={`rounded-xl border p-3 ${selected === id ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/50"}`}>
            <button type="button" onClick={() => onSelect(id)} className="w-full text-left">
              <p className="text-sm font-bold">{threeObjectLabels[id]}</p>
              <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">pos ({transforms[id].position.map((value) => roundTo(value, 2)).join(", ")}), scale {roundTo(transforms[id].scale, 2)}</p>
            </button>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => onRestore(id)} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-white/10">Restore</button>
              <button type="button" onClick={() => onDelete(id)} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">{transforms[id].visible ? "Hide" : "Hide"}</button>
            </div>
          </div>
        ))}
        {addedObjects.map((object) => (
          <div key={object.id} className={`rounded-xl border p-3 ${selected === object.id ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/50"}`}>
            <button type="button" onClick={() => onSelect(object.id)} className="w-full text-left">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">{object.transform.name ?? object.label}</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">Added</span>
              </div>
              <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">pos ({object.transform.position.map((value) => roundTo(value, 2)).join(", ")}), scale {roundTo(object.transform.scale, 2)}</p>
            </button>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => onRestore(object.id)} className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-white/10">Restore</button>
              <button type="button" onClick={() => onDelete(object.id)} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Properties3DPanel({ selected, transform, onTransform, onVector, onRestore, onDelete, mode = "full" }: { selected: string; transform: Transform3D; onTransform: (id: string, patch: Partial<Transform3D>) => void; onVector: (id: string, key: "position" | "rotation", index: number, value: number) => void; onRestore: (id: string) => void; onDelete: (id: string) => void; mode?: "full" | "object" | "transform" }) {
  if (!selected) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold">Selected Object</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">none</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Select a 3D object to edit position, rotation, scale, material, opacity, or dimensions. Press Escape to stay deselected.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold">Selected Object</h3>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">{selected}</span>
      </div>
      {mode !== "transform" && (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["x", "y", "z"] as const).map((axis, index) => <MiniNumber key={`pos-${axis}`} label={axis} value={roundTo(transform.position[index], 2)} onChange={(value) => onVector(selected, "position", index, value)} />)}
          </div>
          <p className="mt-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Rotation</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["x deg", "y deg", "z deg"] as const).map((axis, index) => <MiniNumber key={`rot-${axis}`} label={axis} value={roundTo(transform.rotation[index], 1)} onChange={(value) => onVector(selected, "rotation", index, value)} />)}
          </div>
          <label className="mt-3 block rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
            Color
            <input type="color" value={transform.color} onChange={(event) => onTransform(selected, { color: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900" />
          </label>
          <div className="mt-3 rounded-xl bg-slate-100 p-2 dark:bg-white/10">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Appearance</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["matte", "glass", "wireframe"] as const).map((material) => (
                <button key={material} type="button" onClick={() => onTransform(selected, { material })} className={`rounded-xl px-2 py-2 text-xs font-black capitalize transition ${(transform.material ?? "glass") === material ? "bg-violet-400 text-slate-950 shadow-sm" : "bg-white text-slate-700 hover:bg-violet-50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-violet-300/10"}`}>
                  {material}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { label: "Opacity 100", value: 1 },
                { label: "Opacity 55", value: 0.55 },
                { label: "Opacity 25", value: 0.25 },
              ].map((item) => (
                <button key={item.label} type="button" onClick={() => onTransform(selected, { opacity: item.value })} className={`rounded-xl px-2 py-2 text-xs font-black transition ${roundTo(transform.opacity ?? 0.8, 2) === item.value ? "bg-violet-400 text-slate-950 shadow-sm" : "bg-white text-slate-700 hover:bg-violet-50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-violet-300/10"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => onTransform(selected, { locked: !transform.locked })} className={`rounded-xl px-2 py-2 text-xs font-black transition ${transform.locked ? "bg-violet-400 text-slate-950 shadow-sm" : "bg-white text-slate-700 hover:bg-violet-50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-violet-300/10"}`}>
                {transform.locked ? "Locked" : "Lock"}
              </button>
              <button type="button" onClick={() => onTransform(selected, { trace: !transform.trace })} className={`rounded-xl px-2 py-2 text-xs font-black transition ${transform.trace ? "bg-violet-400 text-slate-950 shadow-sm" : "bg-white text-slate-700 hover:bg-violet-50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-violet-300/10"}`}>
                {transform.trace ? "Trace on" : "Trace"}
              </button>
            </div>
          </div>
        </>
      )}
      {mode !== "object" && (
        <>
          <div className="mt-4">
            <SliderControl density="compact" label="Size" value={transform.scale} min={0.2} max={3} step={0.05} onChange={(value) => onTransform(selected, { scale: value })} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["width", "height", "depth"] as const).map((axis, index) => <MiniNumber key={`dim-${axis}`} label={axis} value={roundTo(transform.dimensions?.[index] ?? 1, 2)} onChange={(value) => {
              const next = [...(transform.dimensions ?? [1, 1, 1])] as [number, number, number];
              next[index] = value;
              onTransform(selected, { dimensions: next });
            }} />)}
          </div>
          <div className="mt-4 grid gap-3">
            <SliderControl density="compact" label="Opacity" value={transform.opacity ?? 0.8} min={0.1} max={1} step={0.05} onChange={(value) => onTransform(selected, { opacity: value })} />
            <label className="rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
              Material
              <select value={transform.material ?? "glass"} onChange={(event) => onTransform(selected, { material: event.target.value as Transform3D["material"] })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
                <option value="matte">Matte</option>
                <option value="glass">Glass</option>
                <option value="wireframe">Wireframe</option>
              </select>
            </label>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button type="button" onClick={() => onVector(selected, "position", 0, roundTo(transform.position[0] + 0.25, 2))} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">+X</button>
            <button type="button" onClick={() => onVector(selected, "position", 1, roundTo(transform.position[1] + 0.25, 2))} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">+Y</button>
            <button type="button" onClick={() => onVector(selected, "position", 2, roundTo(transform.position[2] + 0.25, 2))} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">+Z</button>
            <button type="button" onClick={() => onVector(selected, "rotation", 1, roundTo(transform.rotation[1] + 15, 1))} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">Rot Y</button>
            <button type="button" onClick={() => onTransform(selected, { scale: roundTo(transform.scale + 0.1, 2) })} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">Scale +</button>
            <button type="button" onClick={() => onTransform(selected, { scale: Math.max(0.1, roundTo(transform.scale - 0.1, 2)) })} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">Scale -</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button type="button" onClick={() => onTransform(selected, { visible: !transform.visible })} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">{transform.visible ? "Hide" : "Show"}</button>
            <button type="button" onClick={() => onRestore(selected)} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">Restore</button>
            <button type="button" onClick={() => onDelete(selected)} className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

function GeometryObjectPanel({ selected, construction, locked, onPointChange, onStyleChange, onRadiusChange, onDuplicate, onDelete, onRestore, onToggleLock }: { selected: SelectedGeometryObject | null; construction: Construction; locked: boolean; onPointChange: (patch: Partial<GeoPoint>) => void; onStyleChange: (patch: GeoStyle) => void; onRadiusChange: (radiusUnits: number) => void; onDuplicate: () => void; onDelete: () => void; onRestore: () => void; onToggleLock: () => void }) {
  const object = selected ? geometryObjectBySelection(construction, selected) : null;
  const style = object?.style ?? {};
  const point = selected?.type === "point" ? pointById(construction.points, selected.id) : null;
  const radius = selected?.type === "circle" ? circleRadiusUnits(construction, selected.id) : null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold">Object Properties</h3>
        {selected && <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">{selected.type}</span>}
      </div>
      {!selected || !object ? (
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Select a point, line, circle, or polygon to modify x/y, size, color, visibility, lock, duplicate, restore, or delete.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {point && (
            <>
              <label className="block rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
                Label
                <input value={point.label} onChange={(event) => onPointChange({ label: event.target.value.slice(0, 3) || point.label })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <MiniNumber label="x" value={roundTo(point.x, 1)} onChange={(value) => onPointChange({ x: value })} />
                <MiniNumber label="y" value={roundTo(point.y, 1)} onChange={(value) => onPointChange({ y: value })} />
              </div>
            </>
          )}
          {radius !== null && <SliderControl label="Radius" value={radius} min={0.25} max={8} step={0.05} onChange={onRadiusChange} />}
          <div className="grid grid-cols-[1fr_92px] gap-3">
            <SliderControl label="Size / stroke" value={style.size ?? style.strokeWidth ?? 9} min={2} max={24} step={1} onChange={(value) => onStyleChange(selected.type === "point" ? { ...style, size: value } : { ...style, strokeWidth: value })} />
            <label className="rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
              Color
              <input type="color" value={style.color ?? geometryDefaultColor[selected.type]} onChange={(event) => onStyleChange({ ...style, color: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900" />
            </label>
          </div>
          <div className="grid grid-cols-[1fr_92px] gap-3">
            <SliderControl label="Opacity" value={style.opacity ?? 1} min={0.1} max={1} step={0.05} onChange={(value) => onStyleChange({ ...style, opacity: value })} />
            <label className="rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
              Fill
              <input type="color" value={normalizeColor(style.fill) ?? "#bae6fd"} onChange={(event) => onStyleChange({ ...style, fill: `${event.target.value}55` })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900" />
            </label>
          </div>
          <label className="block rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
            Label mode
            <select value={style.labelMode ?? "name"} onChange={(event) => onStyleChange({ ...style, labelMode: event.target.value as GeoStyle["labelMode"] })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="both">Name and value</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => onStyleChange({ ...style, visible: style.visible === false })} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">{style.visible === false ? "Show" : "Hide"}</button>
            <button type="button" onClick={onToggleLock} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">{locked ? "Unlock" : "Lock"}</button>
            <button type="button" onClick={() => onStyleChange({ ...style, trace: !style.trace })} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">{style.trace ? "Trace on" : "Trace"}</button>
            <button type="button" onClick={onDuplicate} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">Duplicate</button>
            <button type="button" onClick={onRestore} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">Restore</button>
            <button type="button" onClick={onDelete} className="col-span-2 rounded-2xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ObjectContextMenu({ state, onClose, onDuplicate, onDelete, onRestore, onLock, onRename, onTrace }: { state: ContextMenuState; onClose: () => void; onDuplicate: () => void; onDelete: () => void; onRestore: () => void; onLock: () => void; onRename: () => void; onTrace: () => void }) {
  const is3d = state.target.type === "3d";
  const workflowType = workflowTypeForContextTarget(state.target);
  const menuActions = contextMenuForObject(workflowType);
  return (
    <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={(event) => event.preventDefault()}>
      <div className="absolute min-w-48 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-slate-950" style={{ left: state.x, top: state.y }}>
        <button type="button" onClick={onRename} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Rename</button>
        {menuActions.includes("edit-definition") && <button type="button" onClick={onClose} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Edit definition</button>}
        {menuActions.includes("properties") && <button type="button" onClick={onClose} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Properties</button>}
        <button type="button" onClick={onDuplicate} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Duplicate</button>
        <button type="button" onClick={onRestore} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Restore defaults</button>
        <button type="button" onClick={onLock} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">{is3d ? "Lock object" : "Lock / unlock"}</button>
        {menuActions.includes("trace") && <button type="button" onClick={onTrace} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Trace on</button>}
        {menuActions.includes("animation") && <button type="button" onClick={onClose} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Animate</button>}
        {menuActions.includes("measure") && <button type="button" onClick={onClose} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Measure</button>}
        {menuActions.includes("create-locus") && <button type="button" onClick={onClose} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Create locus</button>}
        {menuActions.includes("attach-note") && <button type="button" onClick={onClose} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Attach note</button>}
        {menuActions.includes("export-selected") && <button type="button" onClick={onClose} className="block w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-100 dark:hover:bg-white/10">Export selected</button>}
        <button type="button" onClick={onDelete} className="block w-full rounded-lg px-3 py-2 text-left font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-100 dark:hover:bg-rose-400/15">Delete / hide</button>
      </div>
    </div>
  );
}

function workflowTypeForContextTarget(target: ContextMenuState["target"]): WorkflowObjectType {
  if (target.type === "3d") return "3d";
  if (target.type === "algebra") {
    const kind = target.ref.kind;
    return kind === "3d" ? "3d" : kind === "point" || kind === "line" || kind === "circle" || kind === "polygon" || kind === "arc" || kind === "locus" ? kind : "algebra";
  }
  return target.type;
}

function Workspace3DScene({ surface, surfaceExpression, solid, surfaceScale, solidSize, crossSection, showSurface, showSolid, autoRotate, animationSpeed, zoom, performanceMode, cameraPreset, selected, transforms, addedObjects, dragging, onSelect, onDrag, onTransform, onContextMenu }: { surface: SurfaceKind; surfaceExpression: string; solid: SolidKind; surfaceScale: number; solidSize: number; crossSection: number; showSurface: boolean; showSolid: boolean; autoRotate: boolean; animationSpeed: number; zoom: number; performanceMode: boolean; cameraPreset: CameraPreset3D; selected: string; transforms: Record<ThreeObjectId, Transform3D>; addedObjects: Added3DObject[]; dragging: string | null; onSelect: (id: string) => void; onDrag: (id: string | null) => void; onTransform: (id: string, patch: Partial<Transform3D>) => void; onContextMenu: (event: any, id: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  useEffect(() => {
    const releaseDrag = () => onDrag(null);
    window.addEventListener("pointerup", releaseDrag);
    window.addEventListener("pointercancel", releaseDrag);
    window.addEventListener("blur", releaseDrag);
    return () => {
      window.removeEventListener("pointerup", releaseDrag);
      window.removeEventListener("pointercancel", releaseDrag);
      window.removeEventListener("blur", releaseDrag);
    };
  }, [onDrag]);
  useFrame((state) => {
    if (!groupRef.current) return;
    const baseRotation = cameraPresetRotation(cameraPreset);
    groupRef.current.rotation.set(...baseRotation);
    if (autoRotate) groupRef.current.rotation.y = baseRotation[1] + state.clock.getElapsedTime() * animationSpeed;
  });
  const transformForId = (id: string) => isBase3dId(id) ? transforms[id] : addedObjects.find((object) => object.id === id)?.transform;
  const selectProps = (id: string) => ({
    onClick: (event: any) => { event.stopPropagation(); onSelect(id); },
    onContextMenu: (event: any) => onContextMenu(event, id),
    onPointerDown: (event: any) => {
      event.stopPropagation();
      onSelect(id);
      if (event.button !== 0) return;
      const current = transformForId(id);
      if (current?.locked) return;
      event.target?.setPointerCapture?.(event.pointerId);
      onDrag(id);
    },
    onPointerUp: (event: any) => { event.stopPropagation(); onDrag(null); },
    onPointerCancel: (event: any) => { event.stopPropagation(); onDrag(null); },
    onPointerLeave: () => {
      if (dragging === id) onDrag(null);
    },
    onPointerMove: (event: any) => {
      if (dragging !== id || id === "vector") return;
      event.stopPropagation();
      const current = transformForId(id);
      if (!current) return;
      if (current.locked || event.buttons !== 1) {
        onDrag(null);
        return;
      }
      onTransform(id, { position: [roundTo(event.point.x, 2), current.position[1], roundTo(event.point.z, 2)] });
    },
  });

  return (
    <group ref={groupRef} scale={zoom}>
      <Axes3D />
      <gridHelper args={[10, 10, "#334155", "#1e293b"]} rotation={[0, 0, 0]} />
      {showSurface && transforms.surface.visible && <TransformGroup3D transform={transforms.surface} selected={selected === "surface"}><SurfaceMesh surface={surface} expression={surfaceExpression} scaleValue={surfaceScale} transform={transforms.surface} performanceMode={performanceMode} eventProps={selectProps("surface")} /></TransformGroup3D>}
      {showSolid && transforms.solid.visible && <TransformGroup3D transform={transforms.solid} selected={selected === "solid"} yOffset={solidSize / 4}><SolidMesh solid={solid} size={solidSize} transform={transforms.solid} eventProps={selectProps("solid")} /></TransformGroup3D>}
      {transforms.slice.visible && <TransformGroup3D transform={{ ...transforms.slice, position: [transforms.slice.position[0], crossSection + transforms.slice.position[1], transforms.slice.position[2]] }} selected={selected === "slice"}><CrossSectionPlane color={transforms.slice.color} eventProps={selectProps("slice")} /></TransformGroup3D>}
      {transforms.vector.visible && <TransformGroup3D transform={transforms.vector} selected={selected === "vector"}><VectorArrow start={[-3, 0.05, -3]} end={transforms.point.position} color={transforms.vector.color} eventProps={selectProps("vector")} /></TransformGroup3D>}
      {transforms.point.visible && <TransformGroup3D transform={transforms.point} selected={selected === "point"}><Point3D label="P" color={transforms.point.color} eventProps={selectProps("point")} /></TransformGroup3D>}
      {transforms.line3d.visible && <TransformGroup3D transform={transforms.line3d} selected={selected === "line3d"}><Line3D transform={transforms.line3d} eventProps={selectProps("line3d")} /></TransformGroup3D>}
      {transforms.plane3d.visible && <TransformGroup3D transform={transforms.plane3d} selected={selected === "plane3d"}><Plane3D transform={transforms.plane3d} eventProps={selectProps("plane3d")} /></TransformGroup3D>}
      {transforms.sphere3d.visible && <TransformGroup3D transform={transforms.sphere3d} selected={selected === "sphere3d"}><ConstructedSolid3D kind="sphere" transform={transforms.sphere3d} eventProps={selectProps("sphere3d")} /></TransformGroup3D>}
      {transforms.cone3d.visible && <TransformGroup3D transform={transforms.cone3d} selected={selected === "cone3d"}><ConstructedSolid3D kind="cone" transform={transforms.cone3d} eventProps={selectProps("cone3d")} /></TransformGroup3D>}
      {transforms.cylinder3d.visible && <TransformGroup3D transform={transforms.cylinder3d} selected={selected === "cylinder3d"}><ConstructedSolid3D kind="cylinder" transform={transforms.cylinder3d} eventProps={selectProps("cylinder3d")} /></TransformGroup3D>}
      {transforms.prism3d.visible && <TransformGroup3D transform={transforms.prism3d} selected={selected === "prism3d"}><ConstructedSolid3D kind="prism" transform={transforms.prism3d} eventProps={selectProps("prism3d")} /></TransformGroup3D>}
      {transforms.pyramid3d.visible && <TransformGroup3D transform={transforms.pyramid3d} selected={selected === "pyramid3d"}><ConstructedSolid3D kind="pyramid" transform={transforms.pyramid3d} eventProps={selectProps("pyramid3d")} /></TransformGroup3D>}
      {transforms.polyhedron3d.visible && <TransformGroup3D transform={transforms.polyhedron3d} selected={selected === "polyhedron3d"}><ConstructedSolid3D kind="polyhedron" transform={transforms.polyhedron3d} eventProps={selectProps("polyhedron3d")} /></TransformGroup3D>}
      {addedObjects.map((object) => <AddedSceneObject3D key={object.id} object={object} selected={selected === object.id} surfaceScale={surfaceScale} solidSize={solidSize} crossSection={crossSection} performanceMode={performanceMode} eventProps={selectProps(object.id)} />)}
      <IntersectionOverlays3D transforms={transforms} crossSection={crossSection} />
      <MeasurementOverlays3D transforms={transforms} />
    </group>
  );
}

function AddedSceneObject3D({ object, selected, surfaceScale, solidSize, crossSection, performanceMode, eventProps }: { object: Added3DObject; selected: boolean; surfaceScale: number; solidSize: number; crossSection: number; performanceMode: boolean; eventProps: Record<string, unknown> }) {
  if (!object.transform.visible) return null;
  if (object.render === "surface") return <TransformGroup3D transform={object.transform} selected={selected}><SurfaceMesh surface={object.surface ?? "paraboloid"} expression="sin(x) * cos(y)" scaleValue={surfaceScale} transform={object.transform} performanceMode={performanceMode} eventProps={eventProps} /></TransformGroup3D>;
  if (object.render === "slice") return <TransformGroup3D transform={{ ...object.transform, position: [object.transform.position[0], crossSection + object.transform.position[1], object.transform.position[2]] }} selected={selected}><CrossSectionPlane color={object.transform.color} eventProps={eventProps} /></TransformGroup3D>;
  if (object.render === "point") return <TransformGroup3D transform={object.transform} selected={selected}><Point3D label={object.transform.name ?? object.label} color={object.transform.color} eventProps={eventProps} /></TransformGroup3D>;
  if (object.render === "vector") return <TransformGroup3D transform={object.transform} selected={selected}><VectorArrow start={[-2, 0.05, -2]} end={[2, 1.2, 1.5]} color={object.transform.color} eventProps={eventProps} /></TransformGroup3D>;
  if (object.render === "line3d") return <TransformGroup3D transform={object.transform} selected={selected}><Line3D transform={object.transform} eventProps={eventProps} /></TransformGroup3D>;
  if (object.render === "plane3d") return <TransformGroup3D transform={object.transform} selected={selected}><Plane3D transform={object.transform} eventProps={eventProps} /></TransformGroup3D>;
  return <TransformGroup3D transform={object.transform} selected={selected} yOffset={solidSize / 4}><SolidMesh solid={object.solid ?? "cube"} size={object.transform.dimensions?.[0] ?? solidSize} transform={object.transform} eventProps={eventProps} /></TransformGroup3D>;
}

function TransformGroup3D({ transform, selected, yOffset = 0, children }: { transform: Transform3D; selected: boolean; yOffset?: number; children: JSX.Element }) {
  return (
    <group position={[transform.position[0], transform.position[1] + yOffset, transform.position[2]]} rotation={transform.rotation.map((value) => THREE.MathUtils.degToRad(value)) as [number, number, number]} scale={transform.scale}>
      {children}
      {selected && <mesh>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshBasicMaterial color="#f97316" wireframe />
      </mesh>}
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

function VectorArrow({ start, end, color, eventProps }: { start: [number, number, number]; end: [number, number, number]; color: string; eventProps?: Record<string, unknown> }) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const midpoint = startVector.clone().add(direction.clone().multiplyScalar(0.5));
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  return (
    <group position={midpoint} quaternion={quaternion} {...eventProps}>
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

function Point3D({ label, color, eventProps }: { label: string; color: string; eventProps?: Record<string, unknown> }) {
  return (
    <group {...eventProps}>
      <mesh>
        <sphereGeometry args={[0.12, 24, 16]} />
        <meshStandardMaterial color={color} emissive="#7c2d12" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.18, 0.18, 0]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshStandardMaterial color={label ? "#f8fafc" : "#f59e0b"} />
      </mesh>
    </group>
  );
}

function SurfaceMesh({ surface, expression, scaleValue, transform, performanceMode, eventProps }: { surface: SurfaceKind; expression: string; scaleValue: number; transform: Transform3D; performanceMode: boolean; eventProps?: Record<string, unknown> }) {
  const geometry = useMemo(() => createSurfaceGeometry(surface, scaleValue, performanceMode, expression), [surface, scaleValue, performanceMode, expression]);
  return (
    <mesh geometry={geometry} position={[0, 0, 0]} {...eventProps}>
      <ObjectMaterial transform={transform} />
    </mesh>
  );
}

function createSurfaceGeometry(surface: SurfaceKind, scaleValue: number, performanceMode = false, expression = "sin(x)*cos(y)") {
  const size = 5;
  const segments = performanceMode ? 18 : 36;
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  if (surface === "parametric") return createParametricSurfaceGeometry(segments);
  if (surface === "implicit") {
    const sphere = new THREE.SphereGeometry(2.1, segments, Math.max(12, Math.floor(segments / 2)));
    sphere.computeVertexNormals();
    return sphere;
  }
  for (let iy = 0; iy <= segments; iy += 1) {
    const y = -size / 2 + (iy / segments) * size;
    for (let ix = 0; ix <= segments; ix += 1) {
      const x = -size / 2 + (ix / segments) * size;
      const z = surfaceZ(surface, x, y, scaleValue, expression);
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

function surfaceZ(surface: SurfaceKind, x: number, y: number, scaleValue: number, expression = "") {
  if (surface === "custom-z") return scaleValue * evaluateSurfaceExpression(expression, x, y);
  if (surface === "paraboloid") return scaleValue * 0.25 * (x * x + y * y);
  if (surface === "saddle") return scaleValue * 0.3 * (x * x - y * y);
  if (surface === "wave") return scaleValue * Math.sin(x * 1.4) * Math.cos(y * 1.4);
  if (surface === "ripple") return scaleValue * Math.sin((x * x + y * y) * 1.2);
  if (surface === "cone-surface") return scaleValue * 0.55 * Math.hypot(x, y);
  return scaleValue * 0.35 * (x + y);
}

function evaluateSurfaceExpression(expression: string, x: number, y: number) {
  const safe = expression
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsin\b/gi, "Math.sin")
    .replace(/\bcos\b/gi, "Math.cos")
    .replace(/\btan\b/gi, "Math.tan")
    .replace(/\bsqrt\b/gi, "Math.sqrt")
    .replace(/\babs\b/gi, "Math.abs")
    .replace(/\bln\b/gi, "Math.log")
    .replace(/\blog\b/gi, "Math.log10")
    .replace(/\bexp\b/gi, "Math.exp");
  if (!/^[0-9xy+\-*/().,\s*MATHPIEabceghilnopqrstxyz]+$/i.test(safe) || /[;={}\[\]'"]/.test(safe)) return 0;
  try {
    const value = Function("x", "y", `"use strict"; return (${safe});`)(x, y) as number;
    return Number.isFinite(value) ? Math.max(-4, Math.min(4, value)) : 0;
  } catch {
    return 0;
  }
}

function createParametricSurfaceGeometry(segments: number) {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let iv = 0; iv <= segments; iv += 1) {
    const v = (iv / segments) * Math.PI * 2;
    for (let iu = 0; iu <= segments; iu += 1) {
      const u = (iu / segments) * Math.PI * 2;
      const major = 1.7;
      const minor = 0.55;
      vertices.push((major + minor * Math.cos(v)) * Math.cos(u), minor * Math.sin(v), (major + minor * Math.cos(v)) * Math.sin(u));
    }
  }
  for (let iv = 0; iv < segments; iv += 1) {
    for (let iu = 0; iu < segments; iu += 1) {
      const a = iv * (segments + 1) + iu;
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

function cameraPresetRotation(preset: CameraPreset3D): [number, number, number] {
  if (preset === "top") return [-Math.PI / 2, 0, 0];
  if (preset === "front") return [0, 0, 0];
  if (preset === "right") return [0, -Math.PI / 2, 0];
  if (preset === "isometric") return [-0.52, 0.72, 0];
  return [0, 0, 0];
}

function SolidMesh({ solid, size, transform, eventProps }: { solid: SolidKind; size: number; transform: Transform3D; eventProps?: Record<string, unknown> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.18;
  });
  return (
    <mesh ref={ref} scale={solid === "ellipsoid" ? [1.45, 0.72, 0.95] : [1, 1, 1]} {...eventProps}>
      {solid === "cube" && <boxGeometry args={[size, size, size]} />}
      {solid === "cuboid" && <boxGeometry args={[size * 1.45, size * 0.78, size]} />}
      {solid === "sphere" && <sphereGeometry args={[size / 2, 48, 28]} />}
      {solid === "ellipsoid" && <sphereGeometry args={[size / 2, 48, 28]} />}
      {solid === "hemisphere" && <sphereGeometry args={[size / 2, 48, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />}
      {solid === "cylinder" && <cylinderGeometry args={[size / 2, size / 2, size, 48]} />}
      {solid === "cone" && <coneGeometry args={[size / 2, size, 48]} />}
      {solid === "frustum" && <cylinderGeometry args={[size * 0.32, size * 0.55, size, 48]} />}
      {solid === "torus" && <torusGeometry args={[size * 0.34, size * 0.12, 18, 64]} />}
      {solid === "tube" && <torusGeometry args={[size * 0.4, size * 0.06, 16, 64]} />}
      {solid === "capsule" && <capsuleGeometry args={[size * 0.26, size * 0.62, 10, 24]} />}
      {solid === "prism" && <cylinderGeometry args={[size / 2, size / 2, size, 3]} />}
      {solid === "pyramid" && <coneGeometry args={[size / 2, size, 4]} />}
      {solid === "tetrahedron" && <tetrahedronGeometry args={[size * 0.58, 0]} />}
      {solid === "octahedron" && <octahedronGeometry args={[size * 0.58, 0]} />}
      {solid === "dodecahedron" && <dodecahedronGeometry args={[size * 0.5, 0]} />}
      {solid === "wedge" && <polyhedronGeometry args={[[0, 0, 0, size, 0, 0, size, 0, size, 0, 0, size, 0, size * 0.75, 0, size, size * 0.75, 0], [0, 1, 2, 0, 2, 3, 0, 4, 5, 0, 5, 1, 1, 5, 2, 3, 2, 5, 3, 5, 4, 0, 3, 4], 0.5, 0]} />}
      {solid === "polyhedron" && <icosahedronGeometry args={[size / 2, 0]} />}
      <ObjectMaterial transform={transform} />
    </mesh>
  );
}

function CrossSectionPlane({ color, eventProps }: { color: string; eventProps?: Record<string, unknown> }) {
  return (
    <mesh {...eventProps}>
      <planeGeometry args={[5.5, 5.5]} />
      <meshStandardMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Line3D({ transform, eventProps }: { transform: Transform3D; eventProps?: Record<string, unknown> }) {
  const length = transform.dimensions?.[0] ?? 4;
  return (
    <group {...eventProps}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, length, 12]} />
        <ObjectMaterial transform={transform} />
      </mesh>
    </group>
  );
}

function Plane3D({ transform, eventProps }: { transform: Transform3D; eventProps?: Record<string, unknown> }) {
  return (
    <mesh {...eventProps}>
      <planeGeometry args={[transform.dimensions?.[0] ?? 4, transform.dimensions?.[1] ?? 4]} />
      <ObjectMaterial transform={transform} />
    </mesh>
  );
}

function ConstructedSolid3D({ kind, transform, eventProps }: { kind: SolidKind; transform: Transform3D; eventProps?: Record<string, unknown> }) {
  const dims = transform.dimensions ?? [1.5, 1.5, 1.5];
  return (
    <mesh scale={kind === "ellipsoid" ? [dims[0] * 1.45, dims[1] * 0.72, dims[2] * 0.95] : [dims[0], dims[1], dims[2]]} {...eventProps}>
      {kind === "cube" && <boxGeometry args={[1, 1, 1]} />}
      {kind === "cuboid" && <boxGeometry args={[1.45, 0.78, 1]} />}
      {kind === "sphere" && <sphereGeometry args={[0.5, 48, 28]} />}
      {kind === "ellipsoid" && <sphereGeometry args={[0.5, 48, 28]} />}
      {kind === "hemisphere" && <sphereGeometry args={[0.5, 48, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />}
      {kind === "cone" && <coneGeometry args={[0.5, 1, 48]} />}
      {kind === "cylinder" && <cylinderGeometry args={[0.5, 0.5, 1, 48]} />}
      {kind === "frustum" && <cylinderGeometry args={[0.32, 0.55, 1, 48]} />}
      {kind === "torus" && <torusGeometry args={[0.34, 0.12, 18, 64]} />}
      {kind === "tube" && <torusGeometry args={[0.4, 0.06, 16, 64]} />}
      {kind === "capsule" && <capsuleGeometry args={[0.26, 0.62, 10, 24]} />}
      {kind === "prism" && <cylinderGeometry args={[0.58, 0.58, 1, 3]} />}
      {kind === "pyramid" && <coneGeometry args={[0.62, 1, 4]} />}
      {kind === "tetrahedron" && <tetrahedronGeometry args={[0.58, 0]} />}
      {kind === "octahedron" && <octahedronGeometry args={[0.58, 0]} />}
      {kind === "dodecahedron" && <dodecahedronGeometry args={[0.5, 0]} />}
      {kind === "wedge" && <polyhedronGeometry args={[[0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0.75, 0, 1, 0.75, 0], [0, 1, 2, 0, 2, 3, 0, 4, 5, 0, 5, 1, 1, 5, 2, 3, 2, 5, 3, 5, 4, 0, 3, 4], 0.5, 0]} />}
      {kind === "polyhedron" && <icosahedronGeometry args={[0.65, 0]} />}
      <ObjectMaterial transform={transform} />
    </mesh>
  );
}

function ObjectMaterial({ transform }: { transform: Transform3D }) {
  return <meshStandardMaterial color={transform.color} transparent opacity={transform.opacity ?? 0.8} roughness={transform.material === "glass" ? 0.12 : 0.42} metalness={transform.material === "glass" ? 0.18 : 0.05} wireframe={transform.material === "wireframe"} side={THREE.DoubleSide} />;
}

function IntersectionOverlays3D({ transforms, crossSection }: { transforms: Record<ThreeObjectId, Transform3D>; crossSection: number }) {
  const sphere = transforms.sphere3d;
  const plane = transforms.plane3d;
  const line = transforms.line3d;
  const sphereRadius = ((sphere.dimensions?.[0] ?? 1.4) * sphere.scale) / 2;
  const planeDistance = Math.abs(plane.position[1] - sphere.position[1]);
  const spherePlaneRadius = Math.sqrt(Math.max(0.04, sphereRadius * sphereRadius - planeDistance * planeDistance));
  const linePlanePoint: [number, number, number] = [line.position[0], plane.position[1], line.position[2]];

  return (
    <group>
      {sphere.visible && plane.visible && planeDistance <= sphereRadius + 0.02 && (
        <group position={[sphere.position[0], plane.position[1], sphere.position[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[spherePlaneRadius, 0.018, 10, 96]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        </group>
      )}
      {line.visible && plane.visible && (
        <mesh position={linePlanePoint}>
          <sphereGeometry args={[0.09, 18, 12]} />
          <meshBasicMaterial color="#fb7185" />
        </mesh>
      )}
      {plane.visible && transforms.slice.visible && (
        <mesh position={[0, (plane.position[1] + crossSection) / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 5.5, 10]} />
          <meshBasicMaterial color="#fde68a" />
        </mesh>
      )}
      {transforms.surface.visible && transforms.slice.visible && (
        <group position={[0, crossSection, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[2.05, 0.012, 8, 128]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function MeasurementOverlays3D({ transforms }: { transforms: Record<ThreeObjectId, Transform3D> }) {
  const point = transforms.point.position;
  const vectorLength = Math.hypot(point[0] + 3, point[1] - 0.05, point[2] + 3);
  return (
    <group>
      <TextSprite position={[point[0] + 0.25, point[1] + 0.25, point[2]]} text={`${transforms.point.name ?? "P"} (${point.map((value) => roundTo(value, 1)).join(", ")})`} />
      <TextSprite position={[-1.5, 0.35, -1.8]} text={`|v|=${roundTo(vectorLength, 2)}`} />
      {transforms.plane3d.visible && transforms.sphere3d.visible && <TextSprite position={[0, 2.8, 0]} text="sphere-plane slice available" />}
      {transforms.line3d.visible && transforms.plane3d.visible && <TextSprite position={[1.2, 2.4, 0]} text="line-plane intersection" />}
    </group>
  );
}

function TextSprite({ position, text }: { position: [number, number, number]; text: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "rgba(15,23,42,.82)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f8fafc";
      context.font = "700 32px sans-serif";
      context.fillText(text, 24, 58);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [text]);
  return (
    <sprite position={position} scale={[1.8, 0.34, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

function surfaceFormula(surface: SurfaceKind, scaleValue: number) {
  if (surface === "custom-z") return `z = ${roundTo(scaleValue, 2)} * f(x,y)`;
  if (surface === "parametric") return "parametric torus: r(u,v)";
  if (surface === "implicit") return "implicit sphere: x^2+y^2+z^2=r^2";
  if (surface === "paraboloid") return `z = ${roundTo(scaleValue, 2)}(x^2 + y^2)/4`;
  if (surface === "saddle") return `z = ${roundTo(scaleValue, 2)}(x^2 - y^2)/3`;
  if (surface === "wave") return `z = ${roundTo(scaleValue, 2)} sin(1.4x) cos(1.4y)`;
  if (surface === "ripple") return `z = ${roundTo(scaleValue, 2)} sin(1.2(x^2+y^2))`;
  if (surface === "cone-surface") return `z = ${roundTo(scaleValue, 2)} sqrt(x^2+y^2)`;
  return `z = ${roundTo(scaleValue, 2)}(x+y)/3`;
}

type GeometryPaletteToolItem = { id: GeometryTool; label: string; icon: LucideIcon };
type GeometryPaletteActionItem = { id: string; label: string; icon: LucideIcon; action: () => void; danger?: boolean; active?: boolean; disabled?: boolean };

const geometryPaletteGroups: Array<{ title: string; tools: GeometryPaletteToolItem[] }> = [
  {
    title: "Basic Tools",
    tools: [
      { id: "select", label: "Move", icon: MousePointer2 },
      { id: "point", label: "Point", icon: Plus },
      { id: "segment", label: "Segment", icon: Move },
      { id: "line", label: "Line", icon: Slash },
      { id: "ray", label: "Ray", icon: LineChart },
      { id: "vector", label: "Vector", icon: Move },
      { id: "circle", label: "Circle", icon: Circle },
      { id: "polygon", label: "Polygon", icon: Pentagon },
      { id: "angle", label: "Angle", icon: Circle },
    ],
  },
  {
    title: "Edit",
    tools: [
      { id: "freehand", label: "Freehand", icon: Slash },
      { id: "text", label: "Text", icon: Slash },
      { id: "image", label: "Image", icon: Box },
      { id: "move-canvas", label: "Move Canvas", icon: Move },
      { id: "zoom", label: "Zoom", icon: ZoomIn },
    ],
  },
  {
    title: "Construct",
    tools: [
      { id: "parallel", label: "Parallel", icon: Slash },
      { id: "perpendicular", label: "Perp.", icon: Plus },
      { id: "perpendicular-bisector", label: "Perp. Bisector", icon: Slash },
      { id: "angle-bisector", label: "Angle Bisector", icon: Slash },
      { id: "midpoint", label: "Midpoint", icon: Magnet },
      { id: "intersect", label: "Intersect", icon: Plus },
      { id: "fixed-length", label: "Fixed Length", icon: Magnet },
      { id: "on-circle", label: "Point on Circle", icon: Circle },
      { id: "circle-radius", label: "Circle Radius", icon: Circle },
      { id: "circle-3-points", label: "Circle 3 Points", icon: Circle },
    ],
  },
  {
    title: "Shapes",
    tools: [
      { id: "triangle", label: "Triangle", icon: Pentagon },
      { id: "rectangle", label: "Rectangle", icon: Box },
      { id: "shape-circle", label: "Circle Shape", icon: Circle },
      { id: "parabola", label: "Parabola", icon: LineChart },
      { id: "ellipse", label: "Ellipse", icon: Circle },
      { id: "hyperbola", label: "Hyperbola", icon: LineChart },
    ],
  },
  {
    title: "Curves",
    tools: [
      { id: "tangent", label: "Tangent", icon: Circle },
      { id: "polar", label: "Polar", icon: Move },
      { id: "locus", label: "Locus", icon: LineChart },
      { id: "regular-polygon", label: "Regular Polygon", icon: Pentagon },
      { id: "arc", label: "Arc", icon: Circle },
      { id: "sector", label: "Sector", icon: Circle },
      { id: "compass", label: "Compass", icon: Magnet },
    ],
  },
  {
    title: "Transform",
    tools: [
      { id: "mirror", label: "Mirror", icon: Slash },
      { id: "rotate", label: "Rotate 45", icon: RotateCcw },
      { id: "dilate", label: "Dilate 1.5x", icon: ZoomIn },
      { id: "translate", label: "Translate", icon: Move },
    ],
  },
];

function GeometryToolPalette({
  activeTool,
  onTool,
  onSelectAll,
  onMoveSelected,
  onRotateSelected,
  onDilateSelected,
  onUndo,
  onRedo,
  onDeleteSelected,
  onShowHide,
  onLockSelected,
  onTraceSelected,
  onStopTrace,
  onClearTrace,
  onReset,
  onSave,
  onLoad,
  onAddImage,
}: {
  activeTool: GeometryTool;
  onTool: (tool: GeometryTool) => void;
  onSelectAll: () => void;
  onMoveSelected: () => void;
  onRotateSelected: () => void;
  onDilateSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDeleteSelected: () => void;
  onShowHide: () => void;
  onLockSelected: () => void;
  onTraceSelected: () => void;
  onStopTrace: () => void;
  onClearTrace: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  onAddImage: () => void;
}) {
  const selectionActions: GeometryPaletteActionItem[] = [
    { id: "select-all", label: "Select All Points", icon: MousePointer2, action: onSelectAll },
    { id: "move-selected", label: "Move Selected", icon: Move, action: onMoveSelected },
    { id: "rotate-selected", label: "Rotate Selected", icon: RotateCcw, action: onRotateSelected },
    { id: "dilate-selected", label: "Dilate Selected", icon: ZoomIn, action: onDilateSelected },
    { id: "show-hide", label: "Show / Hide", icon: Circle, action: onShowHide },
    { id: "lock", label: "Lock", icon: Magnet, action: onLockSelected },
    { id: "reflect", label: "Reflect", icon: Slash, action: () => onTool("mirror") },
    { id: "trace", label: "Trace", icon: LineChart, action: onTraceSelected },
    { id: "stop-trace", label: "Stop Trace", icon: RotateCcw, action: onStopTrace },
    { id: "clear-trace", label: "Clear Trace", icon: Eraser, action: onClearTrace },
  ];
  const fileActions: GeometryPaletteActionItem[] = [
    { id: "delete", label: "Delete", icon: Trash2, action: onDeleteSelected, danger: true },
    { id: "undo", label: "Undo", icon: RotateCcw, action: onUndo },
    { id: "redo", label: "Redo", icon: RotateCcw, action: onRedo },
    { id: "reset", label: "Reset", icon: Eraser, action: onReset, danger: true },
    { id: "save", label: "Save", icon: Save, action: onSave },
    { id: "load", label: "Load", icon: Download, action: onLoad },
    { id: "add-image", label: "Add Image", icon: Plus, action: onAddImage },
  ];

  return (
    <aside className="geometry-left-tools thin-scrollbar max-h-[min(66vh,560px)] overflow-auto rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20">
      {geometryPaletteGroups.map((group) => (
        <GeometryPaletteSection key={group.title} title={group.title}>
          {group.tools.map((item) => (
            <GeometryPaletteTool key={item.id} item={item} active={activeTool === item.id} onClick={() => item.id === "image" ? onAddImage() : onTool(item.id)} />
          ))}
        </GeometryPaletteSection>
      ))}
      <GeometryPaletteSection title="Selection">
        {selectionActions.map((item) => <GeometryPaletteAction key={item.id} item={item} />)}
      </GeometryPaletteSection>
      <GeometryPaletteSection title="File / Image">
        {fileActions.map((item) => <GeometryPaletteAction key={item.id} item={item} />)}
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

function GeometryPaletteTool({ item, active, onClick }: { item: GeometryPaletteToolItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button type="button" onClick={onClick} title={item.label} className={`geometry-palette-button ${active ? "geometry-palette-button-active" : ""}`}>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </button>
  );
}

function GeometryPaletteAction({ item }: { item: GeometryPaletteActionItem }) {
  const Icon = item.icon;
  return (
    <button type="button" onClick={item.action} title={item.label} className={`geometry-palette-button ${item.danger ? "geometry-palette-button-danger" : ""}`}>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </button>
  );
}

function ToolButton({ active, label, onClick, icon }: { active?: boolean; label: string; onClick: () => void; icon: JSX.Element }) {
  return <button type="button" onClick={onClick} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"}`}>{icon}{label}</button>;
}

function GeometryGrid({ showUnits = false }: { showUnits?: boolean }) {
  const width = 640;
  const height = 420;
  const unit = 40;
  const origin = { x: 320, y: 220 };
  const verticals = Array.from({ length: 17 }, (_, i) => i * unit);
  const horizontals = Array.from({ length: 12 }, (_, i) => i * unit);
  return (
    <g>
      {verticals.map((x) => <line key={`gv-${x}`} x1={x} x2={x} y1="0" y2={height} stroke="rgba(148,163,184,.2)" />)}
      {horizontals.map((y) => <line key={`gh-${y}`} x1="0" x2={width} y1={y} y2={y} stroke="rgba(148,163,184,.2)" />)}
      {showUnits && (
        <g className="select-none">
          <line x1={0} x2={width} y1={origin.y} y2={origin.y} stroke="#0f172a" strokeWidth="1.8" opacity="0.45" />
          <line x1={origin.x} x2={origin.x} y1={0} y2={height} stroke="#0f172a" strokeWidth="1.8" opacity="0.45" />
          {verticals.map((x) => {
            const value = Math.round((x - origin.x) / unit);
            if (value === 0 || x < 20 || x > width - 20) return null;
            return (
              <g key={`x-unit-${x}`}>
                <line x1={x} x2={x} y1={origin.y - 5} y2={origin.y + 5} stroke="#0f172a" strokeWidth="1.6" opacity="0.65" />
                <text x={x} y={origin.y + 18} textAnchor="middle" fill="#334155" fontSize="10" fontWeight="800">{value}</text>
              </g>
            );
          })}
          {horizontals.map((y) => {
            const value = Math.round((origin.y - y) / unit);
            if (value === 0 || y < 20 || y > height - 20) return null;
            return (
              <g key={`y-unit-${y}`}>
                <line x1={origin.x - 5} x2={origin.x + 5} y1={y} y2={y} stroke="#0f172a" strokeWidth="1.6" opacity="0.65" />
                <text x={origin.x - 10} y={y + 4} textAnchor="end" fill="#334155" fontSize="10" fontWeight="800">{value}</text>
              </g>
            );
          })}
          <text x={origin.x + 7} y={origin.y + 16} fill="#0f172a" fontSize="10" fontWeight="900">0</text>
          <text x={width - 18} y={origin.y - 8} fill="#0f172a" fontSize="10" fontWeight="900">x</text>
          <text x={origin.x + 8} y={18} fill="#0f172a" fontSize="10" fontWeight="900">y</text>
        </g>
      )}
    </g>
  );
}

function isSelectedGeometry(selected: SelectedGeometryObject | null, type: GeometryObjectType, id: string) {
  return selected?.type === type && selected.id === id;
}

function pointById(points: GeoPoint[], id: string) {
  return points.find((point) => point.id === id);
}

function pointLabelText(point: GeoPoint) {
  if (point.style?.labelMode === "value") return `(${roundTo(point.x, 0)}, ${roundTo(point.y, 0)})`;
  if (point.style?.labelMode === "both") return `${point.label} (${roundTo(point.x, 0)}, ${roundTo(point.y, 0)})`;
  return point.label;
}

function pointIdsForObject(construction: Construction, object: SelectedGeometryObject) {
  if (object.type === "point") return [object.id];
  if (object.type === "line") {
    const line = construction.lines.find((item) => item.id === object.id);
    return line ? [line.a, line.b] : [];
  }
  if (object.type === "circle") {
    const circle = construction.circles.find((item) => item.id === object.id);
    return circle ? [circle.center, circle.edge] : [];
  }
  if (object.type === "arc") {
    const arc = construction.arcs.find((item) => item.id === object.id);
    return arc ? [arc.center, arc.start, arc.end] : [];
  }
  if (object.type === "locus") return [];
  const polygon = construction.polygons.find((item) => item.id === object.id);
  return polygon?.points ?? [];
}

function geometryObjectBySelection(construction: Construction, object: SelectedGeometryObject): { style?: GeoStyle } | null {
  if (object.type === "point") return construction.points.find((item) => item.id === object.id) ?? null;
  if (object.type === "line") return construction.lines.find((item) => item.id === object.id) ?? null;
  if (object.type === "circle") return construction.circles.find((item) => item.id === object.id) ?? null;
  if (object.type === "arc") return construction.arcs.find((item) => item.id === object.id) ?? null;
  if (object.type === "locus") return construction.loci.find((item) => item.id === object.id) ?? null;
  return construction.polygons.find((item) => item.id === object.id) ?? null;
}

function patchGeometryObject(construction: Construction, object: SelectedGeometryObject, patch: { style?: GeoStyle }) {
  const mergeStyle = <T extends { id: string; style?: GeoStyle }>(item: T) => item.id === object.id ? { ...item, style: patch.style && Object.keys(patch.style).length === 0 ? {} : { ...(item.style ?? {}), ...(patch.style ?? {}) } } : item;
  if (object.type === "point") return { ...construction, points: construction.points.map(mergeStyle) };
  if (object.type === "line") return { ...construction, lines: construction.lines.map(mergeStyle) };
  if (object.type === "circle") return { ...construction, circles: construction.circles.map(mergeStyle) };
  if (object.type === "arc") return { ...construction, arcs: construction.arcs.map(mergeStyle) };
  if (object.type === "locus") return { ...construction, loci: construction.loci.map(mergeStyle) };
  return { ...construction, polygons: construction.polygons.map(mergeStyle) };
}

function deleteGeometryObjectFromConstruction(construction: Construction, object: SelectedGeometryObject) {
  if (object.type === "point") {
    return {
      points: construction.points.filter((point) => point.id !== object.id),
      lines: construction.lines.filter((line) => line.a !== object.id && line.b !== object.id),
      circles: construction.circles.filter((circle) => circle.center !== object.id && circle.edge !== object.id),
      polygons: construction.polygons.map((polygon) => ({ ...polygon, points: polygon.points.filter((id) => id !== object.id) })).filter((polygon) => polygon.points.length >= 3),
      arcs: construction.arcs.filter((arc) => arc.center !== object.id && arc.start !== object.id && arc.end !== object.id),
      loci: construction.loci,
      constraints: construction.constraints.filter((constraint) => !JSON.stringify(constraint).includes(object.id)),
    };
  }
  if (object.type === "line") return { ...construction, lines: construction.lines.filter((line) => line.id !== object.id), constraints: construction.constraints.filter((constraint) => !JSON.stringify(constraint).includes(object.id)) };
  if (object.type === "circle") return { ...construction, circles: construction.circles.filter((circle) => circle.id !== object.id), constraints: construction.constraints.filter((constraint) => !JSON.stringify(constraint).includes(object.id)) };
  if (object.type === "arc") return { ...construction, arcs: construction.arcs.filter((arc) => arc.id !== object.id) };
  if (object.type === "locus") return { ...construction, loci: construction.loci.filter((locus) => locus.id !== object.id) };
  return { ...construction, polygons: construction.polygons.filter((polygon) => polygon.id !== object.id) };
}

function duplicateGeometryObjectInConstruction(construction: Construction, object: SelectedGeometryObject) {
  const sourcePointIds = pointIdsForObject(construction, object);
  const pointMap = new Map<string, string>();
  const copiedPoints = sourcePointIds.map((id, index) => {
    const point = pointById(construction.points, id);
    if (!point) return null;
    const nextId = crypto.randomUUID();
    pointMap.set(id, nextId);
    return { ...point, id: nextId, x: point.x + 28, y: point.y + 28, label: nextPointLabel(construction.points, index), style: { ...(point.style ?? {}) } };
  }).filter(Boolean) as GeoPoint[];
  if (object.type === "point") return solveConstruction({ ...construction, points: [...construction.points, ...copiedPoints] });
  if (object.type === "line") {
    const line = construction.lines.find((item) => item.id === object.id);
    if (!line) return construction;
    return solveConstruction({ ...construction, points: [...construction.points, ...copiedPoints], lines: [...construction.lines, { ...line, id: crypto.randomUUID(), a: pointMap.get(line.a) ?? line.a, b: pointMap.get(line.b) ?? line.b, style: { ...(line.style ?? {}) } }] });
  }
  if (object.type === "circle") {
    const circle = construction.circles.find((item) => item.id === object.id);
    if (!circle) return construction;
    return solveConstruction({ ...construction, points: [...construction.points, ...copiedPoints], circles: [...construction.circles, { ...circle, id: crypto.randomUUID(), center: pointMap.get(circle.center) ?? circle.center, edge: pointMap.get(circle.edge) ?? circle.edge, style: { ...(circle.style ?? {}) } }] });
  }
  if (object.type === "arc") {
    const arc = construction.arcs.find((item) => item.id === object.id);
    if (!arc) return construction;
    return solveConstruction({ ...construction, points: [...construction.points, ...copiedPoints], arcs: [...construction.arcs, { ...arc, id: crypto.randomUUID(), center: pointMap.get(arc.center) ?? arc.center, start: pointMap.get(arc.start) ?? arc.start, end: pointMap.get(arc.end) ?? arc.end, style: { ...(arc.style ?? {}) } }] });
  }
  if (object.type === "locus") {
    const locus = construction.loci.find((item) => item.id === object.id);
    return locus ? { ...construction, loci: [...construction.loci, { ...locus, id: crypto.randomUUID(), label: `${locus.label}'`, points: locus.points.map((point) => ({ x: point.x + 24, y: point.y + 24 })) }] } : construction;
  }
  const polygon = construction.polygons.find((item) => item.id === object.id);
  if (!polygon) return construction;
  return solveConstruction({ ...construction, points: [...construction.points, ...copiedPoints], polygons: [...construction.polygons, { ...polygon, id: crypto.randomUUID(), points: polygon.points.map((id) => pointMap.get(id) ?? id), style: { ...(polygon.style ?? {}) } }] });
}

function circleRadiusUnits(construction: Construction, circleId: string) {
  const circle = construction.circles.find((item) => item.id === circleId);
  const center = circle ? pointById(construction.points, circle.center) : null;
  const edge = circle ? pointById(construction.points, circle.edge) : null;
  return center && edge ? roundTo(distance(center, edge) / 40, 2) : null;
}

function GeometryLine({ line, points, selected = false }: { line: GeoLine; points: GeoPoint[]; selected?: boolean }) {
  const a = pointById(points, line.a), b = pointById(points, line.b);
  if (!a || !b) return null;
  if (line.style?.visible === false) return null;
  const kind = line.style?.label ?? "line";
  const color = line.style?.color ?? "#8b5cf6";
  const strokeWidth = selected ? Math.max(7, line.style?.strokeWidth ?? 4) : line.style?.strokeWidth ?? 4;
  const endpoints = linearDisplayEndpoints(a, b, kind);
  const arrow = kind === "ray" || kind === "vector" ? arrowHeadPoints(endpoints.x1, endpoints.y1, endpoints.x2, endpoints.y2, kind === "vector" ? 14 : 11) : null;
  const dash = kind === "line" ? "10 8" : undefined;
  return (
    <g>
      <line
        data-object-type="line"
        data-object-id={line.id}
        x1={endpoints.x1}
        y1={endpoints.y1}
        x2={endpoints.x2}
        y2={endpoints.y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        opacity={selected ? 0.95 : line.style?.opacity ?? 1}
        className="cursor-move"
      />
      {arrow && <polygon points={arrow} fill={color} opacity={selected ? 0.95 : line.style?.opacity ?? 1} pointerEvents="none" />}
      {kind !== "line" && <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 8} fill={color} className="pointer-events-none select-none text-[10px] font-black uppercase">{kind}</text>}
      {line.style?.trace && <line x1={endpoints.x1} y1={endpoints.y1} x2={endpoints.x2} y2={endpoints.y2} stroke={color} strokeWidth="12" strokeDasharray="4 10" opacity="0.22" />}
    </g>
  );
}

function linearDisplayEndpoints(a: GeoPoint, b: GeoPoint, kind: string) {
  if (kind === "segment" || kind === "vector") return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  const vector = normalize(b.x - a.x, b.y - a.y);
  if (kind === "ray") return { x1: a.x, y1: a.y, x2: a.x + vector.x * 900, y2: a.y + vector.y * 900 };
  return { x1: a.x - vector.x * 900, y1: a.y - vector.y * 900, x2: a.x + vector.x * 900, y2: a.y + vector.y * 900 };
}

function arrowHeadPoints(x1: number, y1: number, x2: number, y2: number, size: number) {
  const vector = normalize(x2 - x1, y2 - y1);
  const normal = { x: -vector.y, y: vector.x };
  const base = { x: x2 - vector.x * size, y: y2 - vector.y * size };
  return [
    `${x2},${y2}`,
    `${base.x + normal.x * size * 0.46},${base.y + normal.y * size * 0.46}`,
    `${base.x - normal.x * size * 0.46},${base.y - normal.y * size * 0.46}`,
  ].join(" ");
}

function GeometryCircle({ circle, points, selected = false }: { circle: GeoCircle; points: GeoPoint[]; selected?: boolean }) {
  const center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!center || !edge) return null;
  if (circle.style?.visible === false) return null;
  const radius = distance(center, edge);
  return <g><circle data-object-type="circle" data-object-id={circle.id} cx={center.x} cy={center.y} r={radius} fill={circle.style?.fill ?? "rgba(34,211,238,.12)"} stroke={circle.style?.color ?? "#06b6d4"} strokeWidth={selected ? Math.max(7, circle.style?.strokeWidth ?? 4) : circle.style?.strokeWidth ?? 4} opacity={circle.style?.opacity ?? 1} className="cursor-move" />{circle.style?.trace && <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke={circle.style?.color ?? "#06b6d4"} strokeWidth="10" strokeDasharray="6 10" opacity="0.24" />}</g>;
}

function GeometryPolygon({ polygon, points, selected = false }: { polygon: GeoPolygon; points: GeoPoint[]; selected?: boolean }) {
  const polygonPoints = polygon.points.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (polygonPoints.length < 3) return null;
  if (polygon.style?.visible === false) return null;
  const pointsText = polygonPoints.map((point) => `${point.x},${point.y}`).join(" ");
  return <g><polygon data-object-type="polygon" data-object-id={polygon.id} points={pointsText} fill={polygon.style?.fill ?? "rgba(245,158,11,.16)"} stroke={polygon.style?.color ?? "#f59e0b"} strokeWidth={selected ? Math.max(7, polygon.style?.strokeWidth ?? 4) : polygon.style?.strokeWidth ?? 4} opacity={polygon.style?.opacity ?? 1} className="cursor-move" />{polygon.style?.trace && <polygon points={pointsText} fill="none" stroke={polygon.style?.color ?? "#f59e0b"} strokeWidth="10" strokeDasharray="6 10" opacity="0.22" />}</g>;
}

function PolygonDraftPreview({ draft, points }: { draft: string[]; points: GeoPoint[] }) {
  const polygonPoints = draft.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (polygonPoints.length < 2) return null;
  const path = polygonPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const first = polygonPoints[0];
  const last = polygonPoints[polygonPoints.length - 1];
  return (
    <g pointerEvents="none">
      <polyline points={path} fill="none" stroke="#f59e0b" strokeDasharray="8 6" strokeWidth="3" />
      {polygonPoints.length >= 3 && <line x1={last.x} y1={last.y} x2={first.x} y2={first.y} stroke="#f59e0b" strokeDasharray="3 8" strokeWidth="2" opacity="0.7" />}
      <circle cx={first.x} cy={first.y} r="15" fill="none" stroke="#f97316" strokeDasharray="4 4" strokeWidth="3" />
    </g>
  );
}

function GeometryArc({ arc, points, selected = false }: { arc: GeoArc; points: GeoPoint[]; selected?: boolean }) {
  const center = pointById(points, arc.center), start = pointById(points, arc.start), end = pointById(points, arc.end);
  if (!center || !start || !end || arc.style?.visible === false) return null;
  const path = arcPath(center, start, end);
  const stroke = arc.style?.color ?? "#14b8a6";
  const fill = arc.sector ? arc.style?.fill ?? "rgba(20,184,166,.18)" : "none";
  const sectorLine = arc.sector ? ` L ${center.x} ${center.y} Z` : "";
  return <path data-object-type="arc" data-object-id={arc.id} d={`${path}${sectorLine}`} fill={fill} stroke={stroke} strokeWidth={selected ? Math.max(7, arc.style?.strokeWidth ?? 4) : arc.style?.strokeWidth ?? 4} opacity={arc.style?.opacity ?? 1} className="cursor-move" />;
}

function GeometryLocus({ locus }: { locus: GeoLocus }) {
  if (locus.style?.visible === false || locus.points.length < 2) return null;
  const path = locus.points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  return <path data-object-type="locus" data-object-id={locus.id} d={path} fill="none" stroke={locus.style?.color ?? "#ec4899"} strokeWidth={locus.style?.strokeWidth ?? 3} strokeDasharray="6 6" opacity={locus.style?.opacity ?? 0.8} />;
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
    segment: "Click two points to create a measured segment.",
    ray: "Click start point, then a direction point to create a ray-style object.",
    vector: "Click tail point, then head point to create a vector-style object.",
    line: "Click two points to create a line.",
    circle: "Click a center point, then a radius point.",
    polygon: "Click three or more points; the polygon is created after the third point.",
    angle: "Click side point, vertex, side point to create a visible angle arc.",
    "show-hide": "Use the selected-object section to show or hide the selected object.",
    lock: "Use the selected-object section to lock or unlock the selected object.",
    freehand: "Sketch helper mode for marking an idea before converting it to construction objects.",
    text: "Click the board to place a draggable text note point.",
    image: "Opens the image picker and places the image on the geometry board.",
    "move-canvas": "Move-canvas mode keeps construction objects unchanged while you inspect the board.",
    zoom: "Zoom mode is available from the plate and keeps the current construction selected.",
    triangle: "Click three vertices to draw an editable triangle.",
    rectangle: "Click the board to insert an editable rectangle.",
    "shape-circle": "Click the board to insert a ready circle with center and edge points.",
    parabola: "Click the board to insert a parabola visualization curve.",
    ellipse: "Click the board to insert an ellipse visualization curve.",
    hyperbola: "Click the board to insert a hyperbola visualization curve.",
    parallel: "Click two points for a source direction, then a third point. A constrained parallel line is created through the third point.",
    perpendicular: "Click two points for a source direction, then a third point. A constrained perpendicular line is created through the third point.",
    midpoint: "Click two points. A midpoint is created and stays locked halfway between them.",
    "fixed-length": "Click an anchor point and a second point. The second point keeps its current distance from the anchor while dragged.",
    "circle-radius": "Click center and edge points to create a radius-driven circle.",
    "circle-3-points": "Click three points to create the circle passing through them.",
    "on-circle": "Click a point. It snaps to the first circle and stays on that circle.",
    intersect: "Create lines and circles, then click any point to add all current line-line, line-circle, and circle-circle intersections.",
    "perpendicular-bisector": "Click two points to create their midpoint and a perpendicular bisector.",
    "angle-bisector": "Click side point, vertex, side point to create an angle bisector ray.",
    tangent: "Click a point near/on the first circle to create a tangent line at that point.",
    polar: "Click a point to create its polar line with respect to the first circle.",
    locus: "Click a point to create a visible locus trace around it.",
    "regular-polygon": "Click two adjacent vertices to create a regular pentagon.",
    arc: "Click center, start, and end points to create an arc.",
    sector: "Click center, start, and end points to create a sector.",
    compass: "Click two points for radius, then a center point for a compass circle.",
    mirror: "Click point to mirror, then two points defining the mirror line.",
    reflect: "Reflect uses the mirror construction: point to reflect, then two line points.",
    rotate: "Click a point to rotate it 45 degrees around the first point.",
    dilate: "Click a point to dilate it 1.5x from the first point.",
    translate: "Click vector start, vector end, then point to translate.",
    trace: "Turns trace on for the selected object from the plate.",
    "stop-trace": "Turns trace off for the selected object.",
    "clear-trace": "Clears trace flags from every geometry object.",
    delete: "Deletes the selected geometry object.",
    redo: "Reapplies the last undone workspace change.",
    reset: "Resets the current geometry construction.",
    save: "Saves the current construction in browser storage.",
    load: "Loads the saved browser construction.",
  };
  return <div className="rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-50"><p className="font-bold">Current tool: {tool}</p><p className="mt-2">{instructions[tool]}</p></div>;
}

function Measurements({ construction }: { construction: Construction }) {
  const lineLengths = construction.lines.map((line) => {
    const a = pointById(construction.points, line.a), b = pointById(construction.points, line.b);
    return a && b ? `${a.label}${b.label} = ${roundTo(distance(a, b) / 40, 2)}` : "";
  }).filter(Boolean);
  const lineEquations = construction.lines.map((line) => `${lineName(line, construction, 0)}: ${lineEquation(line, construction)}`);
  const lineSlopes = construction.lines.map((line) => {
    const a = pointById(construction.points, line.a), b = pointById(construction.points, line.b);
    return a && b ? `slope ${a.label}${b.label} = ${Math.abs(b.x - a.x) < 0.001 ? "undefined" : roundTo((a.y - b.y) / (b.x - a.x), 3)}` : "";
  }).filter(Boolean);
  const circleRadii = construction.circles.map((circle) => {
    const center = pointById(construction.points, circle.center), edge = pointById(construction.points, circle.edge);
    return center && edge ? `Circle ${center.label}: r = ${roundTo(distance(center, edge) / 40, 2)}, ${circleEquation(circle, construction)}` : "";
  }).filter(Boolean);
  const polygonAreas = construction.polygons.map((polygon, index) => {
    const points = polygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
    return points.length >= 3 ? `Polygon ${index + 1}: area = ${roundTo(polygonArea(points) / 1600, 2)}, perimeter = ${roundTo(polygonPerimeter(points) / 40, 2)}` : "";
  }).filter(Boolean);
  const angles = construction.polygons.flatMap((polygon) => polygon.points.map((id, index, ids) => {
    const prev = pointById(construction.points, ids[(index - 1 + ids.length) % ids.length]);
    const vertex = pointById(construction.points, id);
    const next = pointById(construction.points, ids[(index + 1) % ids.length]);
    return prev && vertex && next ? `angle ${vertex.label} = ${roundTo(angleBetween(prev, vertex, next), 1)} deg` : "";
  })).filter(Boolean);
  const arcLengths = construction.arcs.map((arc, index) => {
    const center = pointById(construction.points, arc.center), start = pointById(construction.points, arc.start), end = pointById(construction.points, arc.end);
    return center && start && end ? `${arc.sector ? "Sector" : "Arc"} ${index + 1}: arc length = ${roundTo(arcLength(center, start, end) / 40, 2)}` : "";
  }).filter(Boolean);
  const entries = [...lineLengths, ...lineSlopes, ...lineEquations, ...circleRadii, ...polygonAreas, ...angles, ...arcLengths];
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

function polygonPerimeter(points: GeoPoint[]) {
  return points.reduce((sum, point, index) => sum + distance(point, points[(index + 1) % points.length]), 0);
}

function angleBetween(a: GeoPoint, vertex: GeoPoint, b: GeoPoint) {
  const va = normalize(a.x - vertex.x, a.y - vertex.y);
  const vb = normalize(b.x - vertex.x, b.y - vertex.y);
  return THREE.MathUtils.radToDeg(Math.acos(Math.max(-1, Math.min(1, va.x * vb.x + va.y * vb.y))));
}

function arcLength(center: GeoPoint, start: GeoPoint, end: GeoPoint) {
  const radius = distance(center, start);
  const a = Math.atan2(start.y - center.y, start.x - center.x);
  const b = Math.atan2(end.y - center.y, end.x - center.x);
  return radius * ((b - a + Math.PI * 2) % (Math.PI * 2));
}

function snapBoardPoint(point: { x: number; y: number }, construction: Construction) {
  const grid = { x: Math.round(point.x / 40) * 40, y: Math.round(point.y / 40) * 40 };
  let best = { ...grid, score: Math.hypot(point.x - grid.x, point.y - grid.y) };
  const candidates = [
    ...construction.points.map((p) => ({ x: p.x, y: p.y })),
    ...allIntersections(construction),
    ...construction.lines.map((line) => projectPointToLine(point, line, construction.points)).filter(Boolean) as { x: number; y: number }[],
    ...construction.circles.map((circle) => projectPointToCircle(point, circle, construction.points)).filter(Boolean) as { x: number; y: number }[],
  ];
  for (const candidate of candidates) {
    const score = Math.hypot(point.x - candidate.x, point.y - candidate.y);
    if (score < best.score && score < 18) best = { ...candidate, score };
  }
  return { x: best.x, y: best.y };
}

function createGeometryObjectForTool(construction: Construction, tool: GeometryTool, x: number, y: number) {
  const base = construction.points.length;
  const makePoint = (dx: number, dy: number, offset: number, style?: GeoStyle): GeoPoint => ({
    id: crypto.randomUUID(),
    x: roundTo(x + dx, 2),
    y: roundTo(y + dy, 2),
    label: nextPointLabel(construction.points, offset),
    style,
  });
  const withPoints = (...points: GeoPoint[]) => ({ ...construction, points: [...construction.points, ...points] });
  const labelOffset = (index: number) => base + index - construction.points.length;

  if (tool === "move-canvas" || tool === "zoom") return construction;
  if (tool === "freehand") {
    const points = Array.from({ length: 22 }, (_, index) => {
      const t = index / 21;
      return { x: x - 110 + t * 220, y: y + Math.sin(t * Math.PI * 3) * 28 };
    });
    return { ...construction, loci: [...construction.loci, { id: crypto.randomUUID(), label: "freehand", points, style: { color: "#f97316", strokeWidth: 4 } }] };
  }
  if (tool === "segment" || tool === "line" || tool === "ray" || tool === "vector") {
    const a = makePoint(-72, 0, labelOffset(0));
    const b = makePoint(72, 0, labelOffset(1));
    const style: GeoStyle = tool === "segment" ? { label: "segment", color: "#22d3ee" } : tool === "ray" ? { label: "ray", color: "#a78bfa" } : tool === "vector" ? { label: "vector", color: "#10b981", strokeWidth: 5 } : { label: "line", color: "#8b5cf6" };
    return solveConstruction({ ...withPoints(a, b), lines: [...construction.lines, { id: crypto.randomUUID(), a: a.id, b: b.id, style }] });
  }
  if (tool === "circle" || tool === "circle-radius") {
    const center = makePoint(0, 0, labelOffset(0));
    const edge = makePoint(78, 0, labelOffset(1));
    return solveConstruction({ ...withPoints(center, edge), circles: [...construction.circles, { id: crypto.randomUUID(), center: center.id, edge: edge.id }] });
  }
  if (tool === "polygon") {
    const points = [makePoint(0, -74, labelOffset(0)), makePoint(-78, 54, labelOffset(1)), makePoint(82, 54, labelOffset(2))];
    return solveConstruction({ ...withPoints(...points), polygons: [...construction.polygons, { id: crypto.randomUUID(), points: points.map((point) => point.id) }] });
  }
  if (tool === "angle") {
    const a = makePoint(-86, -18, labelOffset(0));
    const vertex = makePoint(0, 42, labelOffset(1));
    const c = makePoint(82, -48, labelOffset(2));
    return solveConstruction(addArcOrSector(withPoints(a, vertex, c), vertex.id, a.id, c.id, false));
  }
  if (tool === "parallel" || tool === "perpendicular") {
    const a = makePoint(-92, 34, labelOffset(0));
    const b = makePoint(46, -36, labelOffset(1));
    const through = makePoint(12, 54, labelOffset(2), { color: "#f59e0b" });
    return addParallelPerpendicularConstraint(withPoints(a, b, through), tool, a.id, b.id, through.id);
  }
  if (tool === "midpoint" || tool === "fixed-length") {
    const a = makePoint(-84, 0, labelOffset(0));
    const b = makePoint(84, 0, labelOffset(1));
    return tool === "midpoint" ? addMidpointConstraint(withPoints(a, b), a.id, b.id) : addFixedLengthConstraint(withPoints(a, b), a.id, b.id);
  }
  if (tool === "circle-3-points") {
    const a = makePoint(-76, 26, labelOffset(0));
    const b = makePoint(2, -82, labelOffset(1));
    const c = makePoint(84, 34, labelOffset(2));
    return addCircleThrough3Points(withPoints(a, b, c), a.id, b.id, c.id);
  }
  if (tool === "on-circle") {
    const center = makePoint(0, 0, labelOffset(0));
    const edge = makePoint(86, 0, labelOffset(1));
    const point = makePoint(44, 44, labelOffset(2), { color: "#8b5cf6" });
    const circle: GeoCircle = { id: crypto.randomUUID(), center: center.id, edge: edge.id };
    return addPointOnCircleConstraint(solveConstruction({ ...withPoints(center, edge, point), circles: [...construction.circles, circle] }), point.id);
  }
  if (tool === "intersect") {
    const a = makePoint(-92, -62, labelOffset(0));
    const b = makePoint(92, 62, labelOffset(1));
    const c = makePoint(-92, 62, labelOffset(2));
    const d = makePoint(92, -62, labelOffset(3));
    const lineOne: GeoLine = { id: crypto.randomUUID(), a: a.id, b: b.id };
    const lineTwo: GeoLine = { id: crypto.randomUUID(), a: c.id, b: d.id };
    return addIntersectionConstraint(solveConstruction({ ...withPoints(a, b, c, d), lines: [...construction.lines, lineOne, lineTwo] }));
  }
  if (tool === "perpendicular-bisector") {
    const a = makePoint(-82, 0, labelOffset(0));
    const b = makePoint(82, 0, labelOffset(1));
    return addPerpendicularBisector(withPoints(a, b), a.id, b.id);
  }
  if (tool === "angle-bisector") {
    const a = makePoint(-78, -22, labelOffset(0));
    const vertex = makePoint(0, 52, labelOffset(1));
    const c = makePoint(82, -54, labelOffset(2));
    return addAngleBisector(addArcOrSector(withPoints(a, vertex, c), vertex.id, a.id, c.id, false), a.id, vertex.id, c.id);
  }
  if (tool === "tangent" || tool === "polar") {
    const center = makePoint(0, 0, labelOffset(0));
    const edge = makePoint(70, 0, labelOffset(1));
    const point = makePoint(tool === "tangent" ? 70 : 128, tool === "tangent" ? 0 : -48, labelOffset(2), { color: "#f97316" });
    const next = solveConstruction({ ...withPoints(center, edge, point), circles: [...construction.circles, { id: crypto.randomUUID(), center: center.id, edge: edge.id }] });
    return tool === "tangent" ? addTangentAtPoint(next, point.id) : addPolarLine(next, point.id);
  }
  if (tool === "locus") {
    const point = makePoint(0, 0, labelOffset(0), { color: "#ec4899", trace: true });
    return addLocusForPoint(withPoints(point), point.id);
  }
  if (tool === "regular-polygon") {
    const a = makePoint(-58, 38, labelOffset(0));
    const b = makePoint(42, 38, labelOffset(1));
    return addRegularPolygon(withPoints(a, b), a.id, b.id, 5);
  }
  if (tool === "arc" || tool === "sector") {
    const center = makePoint(0, 0, labelOffset(0));
    const start = makePoint(82, 0, labelOffset(1));
    const end = makePoint(16, -82, labelOffset(2));
    return solveConstruction(addArcOrSector(withPoints(center, start, end), center.id, start.id, end.id, tool === "sector"));
  }
  if (tool === "compass") {
    const a = makePoint(-90, 58, labelOffset(0));
    const b = makePoint(-18, 58, labelOffset(1));
    const center = makePoint(24, -18, labelOffset(2));
    return addCompassCircle(withPoints(a, b, center), a.id, b.id, center.id);
  }
  if (tool === "mirror") {
    const point = makePoint(54, -48, labelOffset(0), { color: "#ec4899" });
    const a = makePoint(-56, -70, labelOffset(1));
    const b = makePoint(-56, 72, labelOffset(2));
    return mirrorPointAcrossLine(withPoints(point, a, b), point.id, a.id, b.id);
  }
  if (tool === "rotate" || tool === "dilate") {
    const center = makePoint(-36, 40, labelOffset(0), { color: "#f59e0b" });
    const point = makePoint(72, -44, labelOffset(1));
    return tool === "rotate" ? rotatePoint(withPoints(center, point), point.id, center.id, 45) : dilatePoint(withPoints(center, point), point.id, center.id, 1.5);
  }
  if (tool === "translate") {
    const from = makePoint(-86, 52, labelOffset(0));
    const to = makePoint(-18, 4, labelOffset(1));
    const point = makePoint(64, -42, labelOffset(2));
    return translatePointByVector(withPoints(from, to, point), from.id, to.id, point.id);
  }
  return construction;
}

function addPerpendicularBisector(construction: Construction, aId: string, bId: string) {
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId);
  if (!a || !b) return construction;
  const mid: GeoPoint = { id: crypto.randomUUID(), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, label: nextPointLabel(construction.points) };
  const vector = unitVector(a, b, true);
  const end: GeoPoint = { id: crypto.randomUUID(), x: mid.x + vector.x * 140, y: mid.y + vector.y * 140, label: nextPointLabel([...construction.points, mid]) };
  return solveConstruction({ ...construction, points: [...construction.points, mid, end], lines: [...construction.lines, { id: crypto.randomUUID(), a: mid.id, b: end.id }], constraints: [...construction.constraints, { id: crypto.randomUUID(), type: "midpoint", a: aId, b: bId, point: mid.id }] });
}

function addAngleBisector(construction: Construction, aId: string, vertexId: string, cId: string) {
  const a = pointById(construction.points, aId), v = pointById(construction.points, vertexId), c = pointById(construction.points, cId);
  if (!a || !v || !c) return construction;
  const va = normalize(a.x - v.x, a.y - v.y);
  const vc = normalize(c.x - v.x, c.y - v.y);
  const direction = normalize(va.x + vc.x, va.y + vc.y);
  const end: GeoPoint = { id: crypto.randomUUID(), x: v.x + direction.x * 150, y: v.y + direction.y * 150, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, end], lines: [...construction.lines, { id: crypto.randomUUID(), a: vertexId, b: end.id }] });
}

function addTangentAtPoint(construction: Construction, pointId: string) {
  const circle = construction.circles[0];
  const point = pointById(construction.points, pointId);
  const center = circle ? pointById(construction.points, circle.center) : null;
  if (!circle || !point || !center) return construction;
  const direction = normalize(-(point.y - center.y), point.x - center.x);
  const end: GeoPoint = { id: crypto.randomUUID(), x: point.x + direction.x * 150, y: point.y + direction.y * 150, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, end], lines: [...construction.lines, { id: crypto.randomUUID(), a: pointId, b: end.id }] });
}

function addPolarLine(construction: Construction, pointId: string) {
  const circle = construction.circles[0];
  const point = pointById(construction.points, pointId);
  const center = circle ? pointById(construction.points, circle.center) : null;
  const edge = circle ? pointById(construction.points, circle.edge) : null;
  if (!circle || !point || !center || !edge) return construction;
  const radius = distance(center, edge);
  const cp = distance(center, point) || 1;
  const foot = { x: center.x + ((point.x - center.x) * radius * radius) / (cp * cp), y: center.y + ((point.y - center.y) * radius * radius) / (cp * cp) };
  const direction = normalize(-(point.y - center.y), point.x - center.x);
  const a: GeoPoint = { id: crypto.randomUUID(), x: foot.x - direction.x * 100, y: foot.y - direction.y * 100, label: nextPointLabel(construction.points) };
  const b: GeoPoint = { id: crypto.randomUUID(), x: foot.x + direction.x * 100, y: foot.y + direction.y * 100, label: nextPointLabel([...construction.points, a]) };
  return solveConstruction({ ...construction, points: [...construction.points, a, b], lines: [...construction.lines, { id: crypto.randomUUID(), a: a.id, b: b.id, style: { color: "#ec4899" } }] });
}

function addLocusForPoint(construction: Construction, pointId: string) {
  const point = pointById(construction.points, pointId);
  if (!point) return construction;
  const radius = 48;
  const points = Array.from({ length: 50 }, (_, index) => {
    const angle = (index / 49) * Math.PI * 2;
    return { x: point.x + Math.cos(angle) * radius, y: point.y + Math.sin(angle) * radius };
  });
  return { ...construction, loci: [...construction.loci, { id: crypto.randomUUID(), label: `locus${construction.loci.length + 1}`, points, style: { color: "#ec4899", trace: true } }] };
}

function addRegularPolygon(construction: Construction, aId: string, bId: string, sides: number) {
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId);
  if (!a || !b) return construction;
  const angle0 = Math.atan2(b.y - a.y, b.x - a.x);
  const side = distance(a, b);
  const radius = side / (2 * Math.sin(Math.PI / sides));
  const centerAngle = angle0 + Math.PI / 2 - Math.PI / sides;
  const center = { x: (a.x + b.x) / 2 + Math.cos(centerAngle) * radius * Math.cos(Math.PI / sides), y: (a.y + b.y) / 2 + Math.sin(centerAngle) * radius * Math.cos(Math.PI / sides) };
  const extra = Array.from({ length: sides - 2 }, (_, index) => {
    const angle = angle0 + ((index + 2) * Math.PI * 2) / sides;
    return { id: crypto.randomUUID(), x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius, label: nextPointLabel(construction.points, index) };
  });
  const ids = [aId, bId, ...extra.map((point) => point.id)];
  return solveConstruction({ ...construction, points: [...construction.points, ...extra], polygons: [...construction.polygons, { id: crypto.randomUUID(), points: ids, style: { fill: "rgba(20,184,166,.14)", color: "#14b8a6" } }] });
}

function addArcOrSector(construction: Construction, center: string, start: string, end: string, sector: boolean) {
  return { ...construction, arcs: [...construction.arcs, { id: crypto.randomUUID(), center, start, end, sector, style: { color: sector ? "#f59e0b" : "#14b8a6", fill: sector ? "rgba(245,158,11,.18)" : "none" } }] };
}

function addCompassCircle(construction: Construction, aId: string, bId: string, centerId: string) {
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId), center = pointById(construction.points, centerId);
  if (!a || !b || !center) return construction;
  const radius = distance(a, b);
  const edge: GeoPoint = { id: crypto.randomUUID(), x: center.x + radius, y: center.y, label: nextPointLabel(construction.points) };
  return solveConstruction({ ...construction, points: [...construction.points, edge], circles: [...construction.circles, { id: crypto.randomUUID(), center: centerId, edge: edge.id }] });
}

function addCircleThrough3Points(construction: Construction, aId: string, bId: string, cId: string) {
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId), c = pointById(construction.points, cId);
  if (!a || !b || !c) return construction;
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 0.001) return construction;
  const ux = ((a.x ** 2 + a.y ** 2) * (b.y - c.y) + (b.x ** 2 + b.y ** 2) * (c.y - a.y) + (c.x ** 2 + c.y ** 2) * (a.y - b.y)) / d;
  const uy = ((a.x ** 2 + a.y ** 2) * (c.x - b.x) + (b.x ** 2 + b.y ** 2) * (a.x - c.x) + (c.x ** 2 + c.y ** 2) * (b.x - a.x)) / d;
  const center: GeoPoint = { id: crypto.randomUUID(), x: ux, y: uy, label: nextPointLabel(construction.points), style: { color: "#f97316" } };
  return solveConstruction({ ...construction, points: [...construction.points, center], circles: [...construction.circles, { id: crypto.randomUUID(), center: center.id, edge: aId, style: { color: "#f97316" } }] });
}

function mirrorPointAcrossLine(construction: Construction, pointId: string, aId: string, bId: string) {
  const point = pointById(construction.points, pointId), a = pointById(construction.points, aId), b = pointById(construction.points, bId);
  if (!point || !a || !b) return construction;
  const projection = projectRawPointToLine(point, a, b);
  const mirrored: GeoPoint = { id: crypto.randomUUID(), x: 2 * projection.x - point.x, y: 2 * projection.y - point.y, label: nextPointLabel(construction.points), style: { color: "#ec4899" } };
  return solveConstruction({ ...construction, points: [...construction.points, mirrored], lines: [...construction.lines, { id: crypto.randomUUID(), a: pointId, b: mirrored.id, style: { color: "#ec4899", strokeWidth: 2 } }] });
}

function rotatePoint(construction: Construction, pointId: string, centerId: string, degrees: number) {
  const point = pointById(construction.points, pointId), center = pointById(construction.points, centerId);
  if (!point || !center || point.id === center.id) return construction;
  const angle = THREE.MathUtils.degToRad(degrees);
  const dx = point.x - center.x, dy = point.y - center.y;
  const rotated: GeoPoint = { id: crypto.randomUUID(), x: center.x + dx * Math.cos(angle) - dy * Math.sin(angle), y: center.y + dx * Math.sin(angle) + dy * Math.cos(angle), label: nextPointLabel(construction.points), style: { color: "#8b5cf6" } };
  return solveConstruction({ ...construction, points: [...construction.points, rotated] });
}

function dilatePoint(construction: Construction, pointId: string, centerId: string, scale: number) {
  const point = pointById(construction.points, pointId), center = pointById(construction.points, centerId);
  if (!point || !center || point.id === center.id) return construction;
  const dilated: GeoPoint = { id: crypto.randomUUID(), x: center.x + (point.x - center.x) * scale, y: center.y + (point.y - center.y) * scale, label: nextPointLabel(construction.points), style: { color: "#10b981" } };
  return solveConstruction({ ...construction, points: [...construction.points, dilated] });
}

function translatePointByVector(construction: Construction, fromId: string, toId: string, pointId: string) {
  const from = pointById(construction.points, fromId), to = pointById(construction.points, toId), point = pointById(construction.points, pointId);
  if (!from || !to || !point) return construction;
  const translated: GeoPoint = { id: crypto.randomUUID(), x: point.x + to.x - from.x, y: point.y + to.y - from.y, label: nextPointLabel(construction.points), style: { color: "#06b6d4" } };
  return solveConstruction({ ...construction, points: [...construction.points, translated] });
}

function transformSelectedPoints(construction: Construction, ids: string[], mode: "translate" | "rotate" | "dilate") {
  if (!ids.length) return construction;
  const points = construction.points.filter((point) => ids.includes(point.id));
  const center = centroid(points);
  const angle = THREE.MathUtils.degToRad(20);
  return solveConstruction({
    ...construction,
    points: construction.points.map((point) => {
      if (!ids.includes(point.id)) return point;
      if (mode === "translate") return { ...point, x: point.x + 24, y: point.y - 18 };
      if (mode === "dilate") return { ...point, x: center.x + (point.x - center.x) * 1.15, y: center.y + (point.y - center.y) * 1.15 };
      const dx = point.x - center.x, dy = point.y - center.y;
      return { ...point, x: center.x + dx * Math.cos(angle) - dy * Math.sin(angle), y: center.y + dx * Math.sin(angle) + dy * Math.cos(angle) };
    }),
  });
}

function centroid(points: GeoPoint[]) {
  const count = points.length || 1;
  return { x: points.reduce((sum, point) => sum + point.x, 0) / count, y: points.reduce((sum, point) => sum + point.y, 0) / count };
}

function projectPointToLine(point: { x: number; y: number }, line: GeoLine, points: GeoPoint[]) {
  const a = pointById(points, line.a), b = pointById(points, line.b);
  return a && b ? projectRawPointToLine(point, a, b) : null;
}

function projectRawPointToLine(point: { x: number; y: number }, a: GeoPoint, b: GeoPoint) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const length2 = dx * dx + dy * dy || 1;
  const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / length2;
  return { x: a.x + t * dx, y: a.y + t * dy };
}

function projectPointToCircle(point: { x: number; y: number }, circle: GeoCircle, points: GeoPoint[]) {
  const center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!center || !edge) return null;
  const radius = distance(center, edge);
  const vector = normalize(point.x - center.x, point.y - center.y);
  return { x: center.x + vector.x * radius, y: center.y + vector.y * radius };
}

function allIntersections(construction: Construction) {
  const output: { x: number; y: number }[] = [];
  for (let i = 0; i < construction.lines.length; i += 1) {
    for (let j = i + 1; j < construction.lines.length; j += 1) {
      const hit = lineIntersection(construction.lines[i], construction.lines[j], construction.points);
      if (hit) output.push(hit);
    }
    for (const circle of construction.circles) output.push(...lineCircleIntersections(construction.lines[i], circle, construction.points));
  }
  for (let i = 0; i < construction.circles.length; i += 1) {
    for (let j = i + 1; j < construction.circles.length; j += 1) output.push(...circleCircleIntersections(construction.circles[i], construction.circles[j], construction.points));
  }
  return uniqueBoardPoints(output);
}

function lineCircleIntersections(line: GeoLine, circle: GeoCircle, points: GeoPoint[]) {
  const a = pointById(points, line.a), b = pointById(points, line.b), center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!a || !b || !center || !edge) return [];
  const dx = b.x - a.x, dy = b.y - a.y;
  const fx = a.x - center.x, fy = a.y - center.y;
  const radius = distance(center, edge);
  const qa = dx * dx + dy * dy;
  const qb = 2 * (fx * dx + fy * dy);
  const qc = fx * fx + fy * fy - radius * radius;
  const disc = qb * qb - 4 * qa * qc;
  if (disc < -0.001) return [];
  const root = Math.sqrt(Math.max(0, disc));
  return [(-qb - root) / (2 * qa), (-qb + root) / (2 * qa)].map((t) => ({ x: a.x + t * dx, y: a.y + t * dy }));
}

function circleCircleIntersections(first: GeoCircle, second: GeoCircle, points: GeoPoint[]) {
  const c1 = pointById(points, first.center), e1 = pointById(points, first.edge), c2 = pointById(points, second.center), e2 = pointById(points, second.edge);
  if (!c1 || !e1 || !c2 || !e2) return [];
  const r1 = distance(c1, e1), r2 = distance(c2, e2), d = distance(c1, c2);
  if (d > r1 + r2 || d < Math.abs(r1 - r2) || d < 0.001) return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const x = c1.x + (a * (c2.x - c1.x)) / d;
  const y = c1.y + (a * (c2.y - c1.y)) / d;
  const rx = -(c2.y - c1.y) * (h / d);
  const ry = (c2.x - c1.x) * (h / d);
  return [{ x: x + rx, y: y + ry }, { x: x - rx, y: y - ry }];
}

function uniqueBoardPoints(points: { x: number; y: number }[]) {
  return points.filter((point, index) => points.findIndex((other) => Math.hypot(other.x - point.x, other.y - point.y) < 2) === index);
}

function arcPath(center: GeoPoint, start: GeoPoint, end: GeoPoint) {
  const radius = distance(center, start);
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
  const delta = ((endAngle - startAngle + Math.PI * 2) % (Math.PI * 2));
  const large = delta > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

function normalizeConstruction(value: Partial<Construction>): Construction {
  return solveConstruction({
    points: value.points ?? [],
    lines: value.lines ?? [],
    circles: value.circles ?? [],
    polygons: value.polygons ?? [],
    arcs: value.arcs ?? [],
    loci: value.loci ?? [],
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
  const hits = allIntersections(construction).filter((hit) => !construction.points.some((point) => Math.hypot(point.x - hit.x, point.y - hit.y) < 4));
  if (!hits.length) return construction;
  const points = hits.slice(0, 12).map((hit, index) => ({ id: crypto.randomUUID(), x: hit.x, y: hit.y, label: nextPointLabel(construction.points, index), style: { color: "#f97316" } }));
  return solveConstruction({ ...construction, points: [...construction.points, ...points] });
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
