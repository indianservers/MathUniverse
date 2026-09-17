import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  Box,
  Circle,
  Download,
  Eraser,
  Eye,
  EyeOff,
  FileText,
  Filter,
  FolderTree,
  Home,
  LineChart,
  ListTree,
  Lock,
  Magnet,
  Maximize2,
  Menu,
  Moon,
  MousePointer2,
  Move,
  Minus,
  Pause,
  Pentagon,
  Play,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Settings,
  Share2,
  SlidersHorizontal,
  Star,
  Sun,
  Slash,
  Trash2,
  Unlock,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  type PointerEvent,
  type WheelEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import { roundTo } from "../../../utils/math";
import type { GeometryCertificationReport } from "../../../workspace/geometryConstructionCertification";

export type GeometryTool =
  | "select"
  | "point"
  | "segment"
  | "ray"
  | "vector"
  | "line"
  | "circle"
  | "polygon"
  | "angle"
  | "parallel"
  | "perpendicular"
  | "midpoint"
  | "fixed-length"
  | "circle-radius"
  | "circle-3-points"
  | "on-circle"
  | "intersect"
  | "perpendicular-bisector"
  | "angle-bisector"
  | "tangent"
  | "polar"
  | "locus"
  | "regular-polygon"
  | "sector"
  | "arc"
  | "compass"
  | "mirror"
  | "rotate"
  | "dilate"
  | "translate"
  | "show-hide"
  | "lock"
  | "freehand"
  | "text"
  | "image"
  | "move-canvas"
  | "zoom"
  | "triangle"
  | "rectangle"
  | "square"
  | "pentagon-shape"
  | "hexagon"
  | "parallelogram"
  | "trapezoid"
  | "rhombus"
  | "kite"
  | "shape-circle"
  | "semicircle"
  | "parabola"
  | "ellipse"
  | "hyperbola"
  | "reflect"
  | "trace"
  | "stop-trace"
  | "clear-trace"
  | "delete"
  | "redo"
  | "reset"
  | "save"
  | "load";
export type GeoStyle = {
  color?: string;
  fill?: string;
  strokeWidth?: number;
  size?: number;
  visible?: boolean;
  trace?: boolean;
  label?: string;
  opacity?: number;
  labelMode?: "name" | "value" | "both" | "hidden";
};
export type GeoPoint = {
  id: string;
  x: number;
  y: number;
  label: string;
  style?: GeoStyle;
};
export type GeoLine = { id: string; a: string; b: string; style?: GeoStyle };
export type GeoCircle = {
  id: string;
  center: string;
  edge: string;
  style?: GeoStyle;
};
export type GeoPolygon = { id: string; points: string[]; style?: GeoStyle };
export type GeoArc = {
  id: string;
  center: string;
  start: string;
  end: string;
  sector?: boolean;
  kind?: "arc" | "angle";
  style?: GeoStyle;
};
export type GeoLocus = {
  id: string;
  label: string;
  points: { x: number; y: number }[];
  style?: GeoStyle;
  sourcePointId?: string;
  mode?: "static" | "trace";
  maxSamples?: number;
};
export type WorkspaceImage = {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  locked?: boolean;
  visible?: boolean;
};
export type GeoConstraint =
  | {
      id: string;
      type: "parallel" | "perpendicular";
      sourceLine: string;
      throughPoint: string;
      line: string;
    }
  | { id: string; type: "midpoint"; a: string; b: string; point: string }
  | {
      id: string;
      type: "fixed-length";
      anchor: string;
      point: string;
      length: number;
    }
  | { id: string; type: "on-circle"; point: string; circle: string }
  | {
      id: string;
      type: "intersection";
      first: string;
      second: string;
      point: string;
      firstType?: "line" | "circle";
      secondType?: "line" | "circle";
      index?: number;
    };
export type Construction = {
  points: GeoPoint[];
  lines: GeoLine[];
  circles: GeoCircle[];
  polygons: GeoPolygon[];
  arcs: GeoArc[];
  loci: GeoLocus[];
  constraints: GeoConstraint[];
};
export type GeometryObjectType =
  "point" | "line" | "circle" | "polygon" | "arc" | "locus";
export type SelectedGeometryObject = { type: GeometryObjectType; id: string };
export type GeometryGraphSettings = {
  showGrid: boolean;
  showAxes: boolean;
  showUnitLabels: boolean;
  showUnits?: boolean;
  showPointLabels: boolean;
  showMeasurements: boolean;
  highContrastGrid: boolean;
  snapToGrid: boolean;
  snapToObjects: boolean;
  gridType?: "cartesian" | "polar" | "isometric";
  minorGrid?: boolean;
  gridSpacing?: number;
  showAxisLabels?: boolean;
  pointCapture?: "automatic" | "snap" | "fixed" | "off";
  snapStrength?: number;
};
export type GeometryCamera = { x: number; y: number; width: number; height: number };

// Keep the coordinate plane useful at the furthest zoom level. Larger spans make
// both construction objects and their coordinate labels impractical to inspect.
export const MAX_GEOMETRY_CAMERA_WIDTH = 163_840;
export const MAX_GEOMETRY_CAMERA_HEIGHT = 107_520;
export type GeometryStudioTheme = "dark" | "light";
const GEOMETRY_THEME_STORAGE_KEY = "math-universe-geometry-theme";

function readGeometryStudioTheme(): GeometryStudioTheme {
  if (typeof window === "undefined") {
    return "dark";
  }
  try {
    return window.localStorage.getItem(GEOMETRY_THEME_STORAGE_KEY) === "light"
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

function persistGeometryStudioTheme(theme: GeometryStudioTheme) {
  try {
    window.localStorage.setItem(GEOMETRY_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore quota / private-mode failures */
  }
}
export type GeometryProtocolEntry = {
  id: string;
  label: string;
  detail: string;
  createdAt: number;
};
type GeometryMobilePanel =
  "tools" | "objects" | "inspector" | "protocol" | null;
type GeometryUnit = "units" | "mm" | "cm" | "m" | "in";
type GeometryPane = "tools" | "canvas" | "inspector";

interface GeometryWorkspacePanelProps {
  activeTool: GeometryTool;
  construction: Construction;
  selectedGeometry: SelectedGeometryObject | null;
  selectedPointIds: string[];
  polygonDraft: string[];
  geometryObjectPicks: SelectedGeometryObject[];
  constructionAccuracyReport: GeometryCertificationReport;
  workspaceImages: WorkspaceImage[];
  selectedImageId: string | null;
  graphSettings: GeometryGraphSettings;
  camera: GeometryCamera;
  boardRef: RefObject<SVGSVGElement>;
  imageInputRef: RefObject<HTMLInputElement>;
  sidebar?: ReactNode;
  constructionHelp?: ReactNode;
  objectInspector?: ReactNode;
  imageInspector?: ReactNode;
  constructionProtocol?: ReactNode;
  unifiedObjectsPanel?: ReactNode;
  measurementsPanel?: ReactNode;
  constraintsPanel?: ReactNode;
  onImageUpload: (fileList: FileList | null) => void;
  onToolChange: (tool: GeometryTool) => void;
  onSelectAll: () => void;
  onMoveSelected: () => void;
  onRotateSelected: () => void;
  onDilateSelected: () => void;
  onResizeSelected: (direction: "increase" | "decrease") => void;
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
  onExport?: () => void;
  onGraphSettingsChange: (settings: GeometryGraphSettings) => void;
  onZoom: (direction: "in" | "out", anchor?: { x: number; y: number }) => void;
  onFitView: () => void;
  onResetView: () => void;
  onBoardWheel: (event: WheelEvent<SVGSVGElement>) => void;
  onBoardKeyDown: (event: KeyboardEvent<SVGSVGElement>) => void;
  onClearPendingPicks: () => void;
  onBoardPointerDown: (event: PointerEvent<SVGSVGElement>) => void;
  onBoardPointerMove: (event: PointerEvent<SVGSVGElement>) => void;
  onBoardPointerUp: (event: PointerEvent<SVGSVGElement>) => void;
  onBoardPointerLeave: () => void;
  onBoardContextMenu: (event: PointerEvent<SVGSVGElement>) => void;
  onGeometryExportRef: (node: SVGSVGElement | null) => void;
  onSelectGeometry?: (selection: SelectedGeometryObject) => void;
  onToggleGeometryVisibility?: (selection: SelectedGeometryObject) => void;
  protocolEntries?: GeometryProtocolEntry[];
  onReplayProtocol?: (index: number) => void;
}

type GeometryPaletteToolItem = {
  id: GeometryTool;
  label: string;
  icon: LucideIcon;
};
type GeometryPaletteActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  danger?: boolean;
};

const geometryPaletteGroups: Array<{
  title: string;
  tools: GeometryPaletteToolItem[];
}> = [
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
      { id: "square", label: "Square", icon: Box },
      { id: "pentagon-shape", label: "Pentagon", icon: Pentagon },
      { id: "hexagon", label: "Hexagon", icon: Pentagon },
      { id: "parallelogram", label: "Parallelogram", icon: Box },
      { id: "trapezoid", label: "Trapezoid", icon: Pentagon },
      { id: "rhombus", label: "Rhombus", icon: Pentagon },
      { id: "kite", label: "Kite", icon: Pentagon },
      { id: "shape-circle", label: "Circle Shape", icon: Circle },
      { id: "semicircle", label: "Semicircle", icon: Circle },
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

const geometryMeasureToolIds: GeometryTool[] = [
  "select",
  "point",
  "segment",
  "line",
  "circle",
  "circle-radius",
  "angle",
];

export function geometryToolLabel(tool: GeometryTool) {
  return (
    geometryPaletteGroups
      .flatMap((group) => group.tools)
      .find((item) => item.id === tool)?.label ?? tool.replace(/-/g, " ")
  );
}

export function geometryToolObjectPickHint(
  tool: GeometryTool,
  picks: SelectedGeometryObject[],
) {
  if (tool === "select") return null;
  if (tool === "angle")
    return "Click three points in order: side point, vertex, side point. The vertex must be the second point.";
  if (tool === "intersect")
    return picks.length === 0
      ? "Pick two existing lines/circles, or tap a point to add all intersections."
      : "Pick one more line or circle.";
  if (tool === "parallel" || tool === "perpendicular")
    return picks.length === 0
      ? "Pick an existing line, then pick the through-point."
      : "Pick the through-point.";
  if (tool === "on-circle")
    return picks.length === 0
      ? "Pick a circle, then pick the point to constrain."
      : "Pick the point to snap onto the circle.";
  if (tool === "tangent" || tool === "polar")
    return picks.length === 0
      ? `Pick a circle, then pick the point for ${tool}.`
      : `Pick the point for ${tool}.`;
  return null;
}

export default function GeometryWorkspacePanel({
  activeTool,
  construction,
  selectedGeometry,
  selectedPointIds,
  polygonDraft,
  geometryObjectPicks,
  workspaceImages,
  selectedImageId,
  graphSettings,
  camera,
  boardRef,
  imageInputRef,
  sidebar,
  constructionHelp,
  objectInspector,
  imageInspector,
  constructionProtocol,
  unifiedObjectsPanel: _unifiedObjectsPanel,
  measurementsPanel,
  constraintsPanel,
  onImageUpload,
  onToolChange,
  onSelectAll,
  onMoveSelected,
  onRotateSelected,
  onDilateSelected,
  onResizeSelected,
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
  onExport,
  onGraphSettingsChange,
  onZoom,
  onFitView,
  onResetView,
  onBoardWheel,
  onBoardKeyDown,
  onClearPendingPicks,
  onBoardPointerDown,
  onBoardPointerMove,
  onBoardPointerUp,
  onBoardPointerLeave,
  onBoardContextMenu,
  onGeometryExportRef,
  onSelectGeometry,
  onToggleGeometryVisibility,
  protocolEntries = [],
  onReplayProtocol,
}: GeometryWorkspacePanelProps) {
  const [studioMode, setStudioMode] = useState<
    "Construct" | "Measure" | "Animate"
  >("Construct");
  const [registryTab, setRegistryTab] = useState<
    "Objects" | "Algebra" | "Layers"
  >("Objects");
  const [inspectorTab, setInspectorTab] = useState<
    "Properties" | "Style" | "Relations"
  >("Properties");
  const [projectName, setProjectName] = useState("Circle Theorem Exploration");
  const [mobilePanel, setMobilePanel] = useState<GeometryMobilePanel>(null);
  const [toolSearch, setToolSearch] = useState("");
  const [favoriteTools, setFavoriteTools] = useState<GeometryTool[]>([
    "select",
    "point",
    "line",
    "circle",
    "polygon",
  ]);
  const [recentTools, setRecentTools] = useState<GeometryTool[]>([]);
  const [pinnedMeasurements, setPinnedMeasurements] = useState<string[]>([]);
  const [objectSearch, setObjectSearch] = useState("");
  const [objectFilter, setObjectFilter] = useState<
    "all" | GeometryObjectType | "visible" | "hidden"
  >("all");
  const [pointerCoordinate, setPointerCoordinate] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [studioTheme, setStudioTheme] = useState<GeometryStudioTheme>(
    readGeometryStudioTheme,
  );
  const [exportOpen, setExportOpen] = useState(false);
  const [unit, setUnit] = useState<GeometryUnit>("units");
  const [precision, setPrecision] = useState(2);
  const [snapMenuOpen, setSnapMenuOpen] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyPlaying, setHistoryPlaying] = useState(false);
  const [activePane, setActivePane] = useState<GeometryPane>("canvas");
  const [expandedPane, setExpandedPane] = useState<GeometryPane | null>(null);
  const [toolPaneWidth, setToolPaneWidth] = useState(304);
  const [inspectorPaneWidth, setInspectorPaneWidth] = useState(340);
  const [rightTopHeight, setRightTopHeight] = useState<number | null>(null);
  const rightPaneRef = useRef<HTMLElement>(null);
  const activeHint =
    geometryToolObjectPickHint(activeTool, geometryObjectPicks) ??
    (studioMode === "Measure"
      ? "Measure mode shows lengths, angles, and areas on the figure. Use Angle, Segment, or Circle, or select a shape."
      : `${geometryToolLabel(activeTool)} tool ready`);
  const selectedPoint =
    selectedGeometry?.type === "point"
      ? pointById(construction.points, selectedGeometry.id)
      : null;
  const renameProject = () => {
    const next = window.prompt("Rename project", projectName);
    if (next?.trim()) setProjectName(next.trim().slice(0, 64));
  };
  const toggleContrast = () =>
    onGraphSettingsChange({
      ...graphSettings,
      highContrastGrid: !graphSettings.highContrastGrid,
    });
  const resizeActivePane = (direction: "increase" | "decrease") => {
    const amount = direction === "increase" ? 32 : -32;
    if (activePane === "tools") {
      setToolPaneWidth((width) => Math.max(236, Math.min(420, width + amount)));
    } else if (activePane === "inspector") {
      setInspectorPaneWidth((width) => Math.max(280, Math.min(460, width + amount)));
    } else {
      // The canvas grows by reducing the side panes, and vice versa.
      setToolPaneWidth((width) => Math.max(236, Math.min(420, width - amount / 2)));
      setInspectorPaneWidth((width) => Math.max(280, Math.min(460, width - amount / 2)));
    }
  };
  const togglePaneExpansion = () =>
    setExpandedPane((current) => (current === activePane ? null : activePane));
  const paneStyle = {
    "--geometry-tools-width": `${toolPaneWidth}px`,
    "--geometry-inspector-width": `${inspectorPaneWidth}px`,
    "--geometry-right-top": rightTopHeight ? `${rightTopHeight}px` : "1fr",
  } as CSSProperties;
  const beginPaneResize = (event: PointerEvent<HTMLElement>, kind: "tools" | "inspector" | "right-row") => {
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    handle.onpointermove = (moveEvent) => {
      if (kind === "tools") setToolPaneWidth(Math.max(236, Math.min(420, moveEvent.clientX)));
      else if (kind === "inspector") setInspectorPaneWidth(Math.max(280, Math.min(460, window.innerWidth - moveEvent.clientX)));
      else if (kind === "right-row") {
        const bounds = rightPaneRef.current?.getBoundingClientRect();
        if (bounds) setRightTopHeight(Math.max(180, Math.min(bounds.height - 180, moveEvent.clientY - bounds.top)));
      }
    };
    const finish = () => {
      handle.onpointermove = null;
      handle.onpointerup = null;
      handle.onpointercancel = null;
    };
    handle.onpointerup = finish;
    handle.onpointercancel = finish;
  };
  const chooseTool = (nextTool: GeometryTool) => {
    if (nextTool === "image") {
      imageInputRef.current?.click();
      return;
    }
    onToolChange(nextTool);
    setRecentTools((current) =>
      [nextTool, ...current.filter((tool) => tool !== nextTool)].slice(0, 6),
    );
    if (window.innerWidth <= 1180) setMobilePanel(null);
  };
  const applyStudioMode = (mode: typeof studioMode) => {
    setStudioMode(mode);
    if (mode === "Measure") {
      onGraphSettingsChange({ ...graphSettings, showMeasurements: true });
      if (!geometryMeasureToolIds.includes(activeTool)) chooseTool("select");
    }
  };
  const handleBoardMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const boardX = camera.x + ((event.clientX - rect.left) / rect.width) * camera.width;
    const boardY = camera.y + ((event.clientY - rect.top) / rect.height) * camera.height;
    const coordinateUnit = graphSettings.gridSpacing ?? 40;
    setPointerCoordinate({
      x: (boardX - 320) / coordinateUnit,
      y: (220 - boardY) / coordinateUnit,
    });
    onBoardPointerMove(event);
  };
  useEffect(() => {
    if (!historyPlaying || protocolEntries.length < 2) return;
    const timer = window.setInterval(() => {
      setHistoryIndex((current) => {
        const next = current >= protocolEntries.length - 1 ? 0 : current + 1;
        onReplayProtocol?.(next);
        return next;
      });
    }, 1100);
    return () => window.clearInterval(timer);
  }, [historyPlaying, onReplayProtocol, protocolEntries.length]);
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-geometry-workspace-theme",
      studioTheme,
    );
    return () => {
      document.documentElement.removeAttribute("data-geometry-workspace-theme");
    };
  }, [studioTheme]);
  return (
    <div
      className="geometry-studio-shell"
      data-active-pane={activePane}
      data-expanded-pane={expandedPane ?? undefined}
      data-geometry-studio-mode={studioMode}
      data-geometry-theme={studioTheme}
      style={paneStyle}
    >
      <header className="geometry-studio-topbar">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <Link to="/" className="geometry-home-button" title="Home page" aria-label="Home page">
              <Home className="h-4 w-4" />
            </Link>
            <h1>2D Geometry Workspace</h1>
            <button
              type="button"
              onClick={renameProject}
              className="geometry-icon-button"
              title="Rename project"
              aria-label="Rename project"
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
          <p>{projectName}</p>
        </div>
        <div
          className="geometry-mode-tabs"
          aria-label="Geometry workspace modes"
        >
          {["Construct", "Measure"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => applyStudioMode(mode as typeof studioMode)}
              className={mode === studioMode ? "active" : ""}
              aria-pressed={mode === studioMode}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="geometry-top-actions">
          <div className="geometry-pane-controls" aria-label="Pane controls">
            <button type="button" onClick={() => resizeActivePane("decrease")} title="Reduce active pane" aria-label="Reduce active pane"><Minus className="h-4 w-4" /></button>
            <button type="button" onClick={() => resizeActivePane("increase")} title="Enlarge active pane" aria-label="Enlarge active pane"><Plus className="h-4 w-4" /></button>
            <button type="button" onClick={togglePaneExpansion} title={expandedPane ? "Restore pane layout" : "Expand active pane"} aria-label={expandedPane ? "Restore pane layout" : "Expand active pane"}><Maximize2 className="h-4 w-4" /></button>
          </div>
          <button type="button" onClick={onUndo} title="Undo" aria-label="Undo">
            <RotateCcw className="h-4 w-4" />
            <span>Undo</span>
          </button>
          <button type="button" onClick={onRedo} title="Redo" aria-label="Redo">
            <RotateCcw className="h-4 w-4 -scale-x-100" />
            <span>Redo</span>
          </button>
          <button type="button" onClick={onSave} title="Save" aria-label="Save">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={onLoad}
            title="Load or import workspace file"
            aria-label="Load or import workspace file"
          >
            <Download className="h-4 w-4" />
            <span>Load / Import</span>
          </button>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            title="Export"
            aria-label="Export"
          >
            <Share2 className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            title="Workspace settings"
            aria-label="Workspace settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <div className="geometry-theme-toggle" role="group" aria-label="Color theme">
            <button
              type="button"
              aria-pressed={studioTheme === "dark"}
              title="Dark theme"
              aria-label="Dark theme"
              onClick={() => {
                setStudioTheme("dark");
                persistGeometryStudioTheme("dark");
              }}
            >
              <Moon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-pressed={studioTheme === "light"}
              title="Light theme"
              aria-label="Light theme"
              onClick={() => {
                setStudioTheme("light");
                persistGeometryStudioTheme("light");
              }}
            >
              <Sun className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            className="geometry-mobile-overflow"
            onClick={() => setMobilePanel("tools")}
            title="Open workspace panels"
            aria-label="Open workspace panels"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      <aside className="geometry-studio-toolbox" onPointerDownCapture={() => setActivePane("tools")} onDoubleClick={() => setExpandedPane((current) => current === "tools" ? null : "tools")}>
        <div className="geometry-panel-heading">
          <div>
            <h2>Geometry Tools</h2>
            <p>{activeHint}</p>
          </div>
          <span aria-hidden="true">•••</span>
        </div>
        <label className="geometry-tool-search">
          <span className="sr-only">Find a tool</span>
          <input
            value={toolSearch}
            onChange={(event) => setToolSearch(event.target.value)}
            placeholder="Find a tool or task"
          />
        </label>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onImageUpload(event.target.files)}
        />
        <GeometryToolPalette
          activeTool={activeTool}
          search={toolSearch}
          studioMode={studioMode}
          favorites={favoriteTools}
          recent={recentTools}
          onFavorite={(tool) =>
            setFavoriteTools((current) =>
              current.includes(tool)
                ? current.filter((item) => item !== tool)
                : [...current, tool],
            )
          }
          onTool={chooseTool}
          onSelectAll={onSelectAll}
          onMoveSelected={onMoveSelected}
          onRotateSelected={onRotateSelected}
          onDilateSelected={onDilateSelected}
          onResizeSelected={onResizeSelected}
          onUndo={onUndo}
          onRedo={onRedo}
          onDeleteSelected={onDeleteSelected}
          onShowHide={onShowHide}
          onLockSelected={onLockSelected}
          onTraceSelected={onTraceSelected}
          onStopTrace={onStopTrace}
          onClearTrace={onClearTrace}
          onReset={onReset}
          onSave={onSave}
          onLoad={onLoad}
          onAddImage={() => imageInputRef.current?.click()}
        />
        <div className="sr-only" aria-hidden="true">
          <GeometryGraphSettingsBar settings={graphSettings} onChange={onGraphSettingsChange} />
        </div>
      </aside>
      <div className="geometry-pane-resizer geometry-tool-resizer" role="separator" aria-label="Resize tools pane" aria-orientation="vertical" onPointerDown={(event) => beginPaneResize(event, "tools")} />

      <main className="geometry-studio-main" onPointerDownCapture={() => setActivePane("canvas")} onDoubleClick={() => setExpandedPane((current) => current === "canvas" ? null : "canvas")}>
        <section className="geometry-canvas-panel">
          <div className="geometry-canvas-stage">
            <GeometryNavTools activeTool={activeTool} onTool={chooseTool} />
            <GeometryZoomControls camera={camera} onZoom={onZoom} onFitView={onFitView} onResetView={onResetView} />
            <GeometryBoard
              boardRef={boardRef}
              construction={construction}
              workspaceImages={workspaceImages}
              selectedImageId={selectedImageId}
              selectedGeometry={selectedGeometry}
              selectedPointIds={selectedPointIds}
              polygonDraft={polygonDraft}
              activeTool={activeTool}
              camera={camera}
              graphSettings={graphSettings}
              onWheel={onBoardWheel}
              onKeyDown={onBoardKeyDown}
              onPointerDown={onBoardPointerDown}
              onPointerMove={handleBoardMove}
              onPointerUp={onBoardPointerUp}
              onPointerLeave={onBoardPointerLeave}
              onContextMenu={onBoardContextMenu}
            />
            <div className="geometry-canvas-hint">
              {studioMode === "Measure"
                ? "Lengths, angles, and areas update as you drag points"
                : "Drag points to explore · Shift for multi-select · Esc to clear"}
            </div>
            {studioMode === "Measure" && (
              <GeometryPinnedMeasurements
                construction={construction}
                pinned={pinnedMeasurements}
                onPinned={setPinnedMeasurements}
                unit={unit}
                precision={precision}
              />
            )}
            <span className="sr-only">
              Touch mode supports direct manipulation with 44 pixel controls.
            </span>
            <GeometryPendingPickPanel
              tool={activeTool}
              picks={geometryObjectPicks}
              construction={construction}
              onClear={onClearPendingPicks}
            />
            <GeometrySnapCandidate
              tool={activeTool}
              coordinate={pointerCoordinate}
              settings={graphSettings}
            />
          </div>
        </section>

        <section
          className="geometry-context-toolbar"
          aria-label="Selected object actions"
        >
          <div>
            <span>Selected:</span>
            <strong>
              {selectedGeometry
                ? geometryObjectLabel(construction, selectedGeometry)
                : "None"}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => chooseTool("select")}
            className="active"
          >
            <Move className="h-4 w-4" />
            Move
          </button>
          <button
            type="button"
            onClick={() => onResizeSelected("decrease")}
            disabled={!selectedGeometry && selectedPointIds.length === 0}
            title="Resize selected shape smaller"
          >
            <Minus className="h-4 w-4" />
            Size
          </button>
          <button
            type="button"
            onClick={() => onResizeSelected("increase")}
            disabled={!selectedGeometry && selectedPointIds.length === 0}
            title="Resize selected shape larger"
          >
            <Plus className="h-4 w-4" />
            Size
          </button>
          <button type="button" onClick={onTraceSelected}>
            <LineChart className="h-4 w-4" />
            Trace
          </button>
          <button type="button" onClick={onLockSelected}>
            <Lock className="h-4 w-4" />
            Lock
          </button>
          <button type="button" onClick={onShowHide}>
            <EyeOff className="h-4 w-4" />
            Hide
          </button>
          <button type="button" onClick={onDeleteSelected} className="danger">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          {selectedPoint && (
            <div className="geometry-coordinate-readout">
              <span>
                X <strong>{roundTo((selectedPoint.x - 320) / (graphSettings.gridSpacing ?? 40), 2)}</strong>
              </span>
              <span>
                Y <strong>{roundTo((220 - selectedPoint.y) / (graphSettings.gridSpacing ?? 40), 2)}</strong>
              </span>
            </div>
          )}
          {!selectedPoint && pointerCoordinate && (
            <div className="geometry-coordinate-readout is-pointer">
              <span>
                X <strong>{roundTo(pointerCoordinate.x, precision)}</strong>
              </span>
              <span>
                Y <strong>{roundTo(pointerCoordinate.y, precision)}</strong>
              </span>
            </div>
          )}
        </section>

        <HiddenGeometryExport
          refSetter={onGeometryExportRef}
          construction={construction}
          images={workspaceImages}
          graphSettings={graphSettings}
        />
      </main>
      <div className="geometry-pane-resizer geometry-inspector-resizer" role="separator" aria-label="Resize inspector pane" aria-orientation="vertical" onPointerDown={(event) => beginPaneResize(event, "inspector")} />

      <nav
        className="geometry-mobile-tools"
        aria-label="Essential geometry tools"
      >
        {(
          [
            ["select", "Select", MousePointer2],
            ["point", "Point", Plus],
            ["line", "Line", Slash],
            ["circle", "Circle", Circle],
            ["polygon", "Shape", Pentagon],
          ] as Array<[GeometryTool, string, LucideIcon]>
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            className={activeTool === id ? "active" : ""}
            onClick={() => chooseTool(id)}
            aria-pressed={activeTool === id}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
        <button type="button" onClick={() => setMobilePanel("tools")}>
          <Menu />
          <span>More</span>
        </button>
      </nav>

      <aside ref={rightPaneRef} className="geometry-studio-right" onPointerDownCapture={() => setActivePane("inspector")} onDoubleClick={() => setExpandedPane((current) => current === "inspector" ? null : "inspector")}>
        <section className="geometry-right-card geometry-objects-tabs">
          <div className="geometry-panel-heading">
            <h2>Objects & Algebra</h2>
            <span>
              {construction.points.length +
                construction.lines.length +
                construction.circles.length +
                construction.polygons.length +
                construction.arcs.length +
                construction.loci.length}{" "}
              objects
            </span>
          </div>
          <div
            className="geometry-tab-strip"
            role="tablist"
            aria-label="Geometry object views"
          >
            {(["Objects", "Algebra", "Layers"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={registryTab === tab}
                onClick={() => setRegistryTab(tab)}
                className={registryTab === tab ? "active" : ""}
              >
                {tab}
              </button>
            ))}
          </div>
          {registryTab === "Objects" && (
            <GeometryRegistryControls
              search={objectSearch}
              filter={objectFilter}
              onSearch={setObjectSearch}
              onFilter={setObjectFilter}
            />
          )}
          {registryTab === "Objects" && (
            <GeometryObjectRegistry
              construction={construction}
              selectedGeometry={selectedGeometry}
              search={objectSearch}
              filter={objectFilter}
              onSelect={onSelectGeometry}
              onToggleVisibility={onToggleGeometryVisibility}
            />
          )}
          {registryTab === "Algebra" && (
            <>
              <GeometryObjectRegistry
                construction={construction}
                selectedGeometry={selectedGeometry}
                search={objectSearch}
                filter={objectFilter}
                onSelect={onSelectGeometry}
                onToggleVisibility={onToggleGeometryVisibility}
              />
              {measurementsPanel}
            </>
          )}
          {registryTab === "Layers" && (
            <GeometryLayerManager
              construction={construction}
              selectedGeometry={selectedGeometry}
              onSelect={onSelectGeometry}
            />
          )}
        </section>
        <div className="geometry-inline-resizer geometry-right-resizer" role="separator" aria-label="Resize object inspector pane" aria-orientation="horizontal" onPointerDown={(event) => beginPaneResize(event, "right-row")} />
        <section className="geometry-right-card geometry-inspector-card">
          <div className="geometry-panel-heading">
            <h2>Object Inspector</h2>
            <span>{selectedGeometry?.type ?? "No selection"}</span>
          </div>
          <div
            className="geometry-tab-strip"
            role="tablist"
            aria-label="Geometry inspector views"
          >
            {(["Properties", "Style", "Relations"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={inspectorTab === tab}
                onClick={() => setInspectorTab(tab)}
                className={inspectorTab === tab ? "active" : ""}
              >
                {tab}
              </button>
            ))}
          </div>
          {inspectorTab === "Properties" && (
            <>
              {objectInspector}
              {imageInspector}
              {sidebar}
              {studioMode === "Measure" && measurementsPanel}
            </>
          )}
          {inspectorTab === "Style" && (
            <div className="geometry-object-registry">
              <p className="geometry-empty-note">
                Select an object to edit its colour, opacity, label, visibility,
                and line style.
              </p>
              {objectInspector}
            </div>
          )}
          {inspectorTab === "Relations" && (
            <div className="geometry-object-registry">
              <p className="geometry-empty-note">
                Dependent constraints and construction relationships update live
                as parent points move.
              </p>
              {constraintsPanel}
            </div>
          )}
        </section>
      </aside>

      <footer className="geometry-statusbar">
        <span className="ok-dot" /> Offline <span>60 FPS</span>
        <span>{construction.constraints.length} constraints</span>
        <span>
          {pointerCoordinate
            ? `x ${roundTo(pointerCoordinate.x, precision)}, y ${roundTo(pointerCoordinate.y, precision)}`
            : `${construction.points.length} points`}
        </span>
        <button
          type="button"
          onClick={() => setSnapMenuOpen((value) => !value)}
        >
          <Magnet />
          {graphSettings.snapToGrid || graphSettings.snapToObjects
            ? "Snap on"
            : "Snap off"}
        </button>
      </footer>
      {snapMenuOpen && (
        <GeometrySnapMenu
          settings={graphSettings}
          onChange={onGraphSettingsChange}
          onClose={() => setSnapMenuOpen(false)}
        />
      )}
      {mobilePanel && (
        <GeometryMobileDrawer
          panel={mobilePanel}
          onPanel={setMobilePanel}
          onClose={() => setMobilePanel(null)}
          tools={
            <>
              <label className="geometry-tool-search">
                <input
                  value={toolSearch}
                  onChange={(event) => setToolSearch(event.target.value)}
                  placeholder="Find a tool or task"
                />
              </label>
              <GeometryToolPalette
                activeTool={activeTool}
                search={toolSearch}
                studioMode={studioMode}
                favorites={favoriteTools}
                recent={recentTools}
                onFavorite={(tool) =>
                  setFavoriteTools((current) =>
                    current.includes(tool)
                      ? current.filter((item) => item !== tool)
                      : [...current, tool],
                  )
                }
                onTool={chooseTool}
                onSelectAll={onSelectAll}
                onMoveSelected={onMoveSelected}
                onRotateSelected={onRotateSelected}
                onDilateSelected={onDilateSelected}
                onResizeSelected={onResizeSelected}
                onUndo={onUndo}
                onRedo={onRedo}
                onDeleteSelected={onDeleteSelected}
                onShowHide={onShowHide}
                onLockSelected={onLockSelected}
                onTraceSelected={onTraceSelected}
                onStopTrace={onStopTrace}
                onClearTrace={onClearTrace}
                onReset={onReset}
                onSave={onSave}
                onLoad={onLoad}
                onAddImage={() => imageInputRef.current?.click()}
              />
            </>
          }
          objects={
            <>
              <GeometryRegistryControls
                search={objectSearch}
                filter={objectFilter}
                onSearch={setObjectSearch}
                onFilter={setObjectFilter}
              />
              <GeometryObjectRegistry
                construction={construction}
                selectedGeometry={selectedGeometry}
                search={objectSearch}
                filter={objectFilter}
                onSelect={onSelectGeometry}
                onToggleVisibility={onToggleGeometryVisibility}
              />
            </>
          }
          inspector={
            <>
              {objectInspector}
              {imageInspector}
              {constraintsPanel}
            </>
          }
          protocol={
            <GeometryTimeline
              entries={protocolEntries}
              index={historyIndex}
              playing={historyPlaying}
              onIndex={(index) => {
                setHistoryIndex(index);
                onReplayProtocol?.(index);
              }}
              onPlaying={setHistoryPlaying}
            />
          }
        />
      )}
      {settingsOpen && (
        <GeometrySettingsDialog
          settings={graphSettings}
          unit={unit}
          precision={precision}
          onSettings={onGraphSettingsChange}
          onUnit={setUnit}
          onPrecision={setPrecision}
          onContrast={toggleContrast}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      {exportOpen && (
        <GeometryExportDialog
          projectName={projectName}
          onPng={onExport}
          onClose={() => setExportOpen(false)}
          construction={construction}
        />
      )}
    </div>
  );
}

function GeometryToolPalette({
  activeTool,
  search,
  studioMode = "Construct",
  favorites,
  recent,
  onFavorite,
  onTool,
  onSelectAll,
  onMoveSelected,
  onRotateSelected,
  onDilateSelected,
  onResizeSelected,
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
  search: string;
  studioMode?: "Construct" | "Measure" | "Animate";
  favorites: GeometryTool[];
  recent: GeometryTool[];
  onFavorite: (tool: GeometryTool) => void;
  onTool: (tool: GeometryTool) => void;
  onSelectAll: () => void;
  onMoveSelected: () => void;
  onRotateSelected: () => void;
  onDilateSelected: () => void;
  onResizeSelected: (direction: "increase" | "decrease") => void;
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
  const normalizedSearch = search.trim().toLowerCase();
  const aliases: Partial<Record<GeometryTool, string>> = {
    perpendicular: "normal 90 degree",
    midpoint: "center bisect",
    "angle-bisector": "split angle",
    intersect: "crossing",
    tangent: "touch circle",
    locus: "path trace",
  };
  const matchesMode = (item: GeometryPaletteToolItem) =>
    studioMode !== "Measure" || geometryMeasureToolIds.includes(item.id);
  const matchesSearch = (item: GeometryPaletteToolItem) =>
    matchesMode(item) &&
    (!normalizedSearch ||
      `${item.label} ${item.id} ${aliases[item.id] ?? ""}`
        .toLowerCase()
        .includes(normalizedSearch));
  const toolById = (id: GeometryTool) =>
    geometryPaletteGroups
      .flatMap((group) => group.tools)
      .find((item) => item.id === id);
  const selectionActions: GeometryPaletteActionItem[] = [
    {
      id: "select-all",
      label: "Select All Points",
      icon: MousePointer2,
      action: onSelectAll,
    },
    {
      id: "move-selected",
      label: "Move Selected",
      icon: Move,
      action: onMoveSelected,
    },
    {
      id: "rotate-selected",
      label: "Rotate Selected",
      icon: RotateCcw,
      action: onRotateSelected,
    },
    {
      id: "dilate-selected",
      label: "Dilate Selected",
      icon: ZoomIn,
      action: onDilateSelected,
    },
    {
      id: "resize-smaller",
      label: "Size -",
      icon: Minus,
      action: () => onResizeSelected("decrease"),
    },
    {
      id: "resize-larger",
      label: "Size +",
      icon: Plus,
      action: () => onResizeSelected("increase"),
    },
    { id: "show-hide", label: "Show / Hide", icon: Circle, action: onShowHide },
    { id: "lock", label: "Lock", icon: Magnet, action: onLockSelected },
    {
      id: "reflect",
      label: "Reflect",
      icon: Slash,
      action: () => onTool("mirror"),
    },
    { id: "trace", label: "Trace", icon: LineChart, action: onTraceSelected },
    {
      id: "stop-trace",
      label: "Stop Trace",
      icon: RotateCcw,
      action: onStopTrace,
    },
    {
      id: "clear-trace",
      label: "Clear Trace",
      icon: Eraser,
      action: onClearTrace,
    },
  ];
  const fileActions: GeometryPaletteActionItem[] = [
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      action: onDeleteSelected,
      danger: true,
    },
    { id: "undo", label: "Undo", icon: RotateCcw, action: onUndo },
    { id: "redo", label: "Redo", icon: RotateCcw, action: onRedo },
    {
      id: "reset",
      label: "Reset",
      icon: Eraser,
      action: onReset,
      danger: true,
    },
    { id: "save", label: "Save", icon: Save, action: onSave },
    { id: "load", label: "Load / Import", icon: Download, action: onLoad },
    { id: "add-image", label: "Add Image", icon: Plus, action: onAddImage },
  ];

  return (
    <aside className="geometry-left-tools thin-scrollbar">
      {!!favorites.length && !normalizedSearch && (
        <GeometryPaletteSection title="Favorites" collapsible={false}>
          {favorites
            .map(toolById)
            .filter((item): item is GeometryPaletteToolItem =>
              Boolean(item && matchesMode(item)),
            )
            .map((item) => (
              <GeometryPaletteTool
                key={`favorite-${item.id}`}
                item={item}
                active={activeTool === item.id}
                favorite
                onFavorite={() => onFavorite(item.id)}
                onClick={() => onTool(item.id)}
              />
            ))}
        </GeometryPaletteSection>
      )}
      {!!recent.length && !normalizedSearch && (
        <div className="geometry-recent-tools">
          <span>
            <Clock3 />
            Recent
          </span>
          {recent
            .map(toolById)
            .filter((item): item is GeometryPaletteToolItem =>
              Boolean(item && matchesMode(item)),
            )
            .map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={`recent-${item.id}`}
                  onClick={() => onTool(item.id)}
                  title={item.label}
                >
                  <Icon />
                </button>
              );
            })}
        </div>
      )}
      {geometryPaletteGroups.map(
        (group) =>
          group.tools.some(matchesSearch) && (
            <GeometryPaletteSection key={group.title} title={group.title}>
              {group.tools.filter(matchesSearch).map((item) => (
                <GeometryPaletteTool
                  key={item.id}
                  item={item}
                  active={activeTool === item.id}
                  favorite={favorites.includes(item.id)}
                  onFavorite={() => onFavorite(item.id)}
                  onClick={() =>
                    item.id === "image" ? onAddImage() : onTool(item.id)
                  }
                />
              ))}
            </GeometryPaletteSection>
          ),
      )}
      {!normalizedSearch && (
        <GeometryPaletteSection title="Selection">
          {selectionActions.map((item) => (
            <GeometryPaletteAction key={item.id} item={item} />
          ))}
        </GeometryPaletteSection>
      )}
      {!normalizedSearch && studioMode !== "Measure" && (
        <GeometryPaletteSection title="File / Image">
          {fileActions.map((item) => (
            <GeometryPaletteAction key={item.id} item={item} />
          ))}
        </GeometryPaletteSection>
      )}
      {normalizedSearch &&
        !geometryPaletteGroups.some((group) =>
          group.tools.some(matchesSearch),
        ) && (
          <div className="geometry-empty-note">
            No matching tool. Try “bisect”, “tangent”, or “circle”.
          </div>
        )}
    </aside>
  );
}

function GeometryNavTools({
  activeTool,
  onTool,
}: {
  activeTool: GeometryTool;
  onTool: (tool: GeometryTool) => void;
}) {
  const tools: Array<{ id: GeometryTool; label: string; icon: LucideIcon }> = [
    { id: "select", label: "Select", icon: MousePointer2 },
    { id: "move-canvas", label: "Pan", icon: Move },
  ];
  return (
    <div className="geometry-nav-tools" aria-label="Canvas navigation tools">
      {tools.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTool(id)}
          className={activeTool === id ? "active" : ""}
          title={label}
          aria-label={label}
        >
          <Icon className="h-5 w-5" strokeWidth={2.4} />
        </button>
      ))}
    </div>
  );
}

function GeometryZoomControls({ camera, onZoom, onFitView, onResetView }: { camera: GeometryCamera; onZoom: (direction: "in" | "out") => void; onFitView: () => void; onResetView: () => void }) {
  const unit = 40;
  const xMin = roundTo((camera.x - 320) / unit, 2);
  const xMax = roundTo((camera.x + camera.width - 320) / unit, 2);
  const yMin = roundTo((220 - (camera.y + camera.height)) / unit, 2);
  const yMax = roundTo((220 - camera.y) / unit, 2);
  const atMaximumRange = camera.width >= MAX_GEOMETRY_CAMERA_WIDTH;
  return (
    <div className="geometry-zoom-controls" aria-label="Canvas zoom controls">
      <output className="geometry-view-range" data-testid="geometry-view-range" aria-label={`Visible coordinate range: x from ${xMin} to ${xMax}, y from ${yMin} to ${yMax}`}>
        <span>Range</span> x {xMin}…{xMax} · y {yMin}…{yMax}
      </output>
      <button type="button" onClick={() => onZoom("in")} title="Zoom in" aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
      <button type="button" onClick={() => onZoom("out")} title={atMaximumRange ? "Maximum coordinate range reached" : "Zoom out"} aria-label="Zoom out" disabled={atMaximumRange}><ZoomOut className="h-4 w-4" /></button>
      <button type="button" onClick={onFitView} title="Fit all objects" aria-label="Fit all objects"><Maximize2 className="h-4 w-4" /></button>
      <button type="button" onClick={onResetView} title="Reset view" aria-label="Reset view"><Home className="h-4 w-4" /></button>
    </div>
  );
}

function GeometryObjectRegistry({
  construction,
  selectedGeometry,
  search = "",
  filter = "all",
  onSelect,
  onToggleVisibility,
}: {
  construction: Construction;
  selectedGeometry: SelectedGeometryObject | null;
  search?: string;
  filter?: "all" | GeometryObjectType | "visible" | "hidden";
  onSelect?: (selection: SelectedGeometryObject) => void;
  onToggleVisibility?: (selection: SelectedGeometryObject) => void;
}) {
  const rows: Array<{
    type: GeometryObjectType;
    id: string;
    label: string;
    value: string;
    icon: LucideIcon;
    visible?: boolean;
    locked?: boolean;
  }> = [
    ...construction.points.map((point) => ({
      type: "point" as const,
      id: point.id,
      label: point.label,
      value: `(${roundTo(point.x / 40 - 8, 2)}, ${roundTo(5.5 - point.y / 40, 2)})`,
      icon: Plus,
      visible: point.style?.visible !== false,
    })),
    ...construction.lines.map((line, index) => ({
      type: "line" as const,
      id: line.id,
      label: lineName(line, construction, index),
      value: line.style?.label ?? "line",
      icon: Slash,
      visible: line.style?.visible !== false,
    })),
    ...construction.circles.map((circle, index) => ({
      type: "circle" as const,
      id: circle.id,
      label: circleName(circle, construction, index),
      value: "circle",
      icon: Circle,
      visible: circle.style?.visible !== false,
    })),
    ...construction.polygons.map((polygon, index) => ({
      type: "polygon" as const,
      id: polygon.id,
      label: `Polygon ${index + 1}`,
      value: `${polygon.points.length} vertices`,
      icon: Pentagon,
      visible: polygon.style?.visible !== false,
    })),
    ...construction.arcs.map((arc, index) => ({
      type: "arc" as const,
      id: arc.id,
      label: `Arc ${index + 1}`,
      value: arc.sector ? "sector" : "arc",
      icon: Circle,
      visible: arc.style?.visible !== false,
    })),
    ...construction.loci.map((locus) => ({
      type: "locus" as const,
      id: locus.id,
      label: locus.label,
      value: `${locus.points.length} samples`,
      icon: LineChart,
      visible: locus.style?.visible !== false,
    })),
  ];
  const normalized = search.trim().toLowerCase();
  const filteredRows = rows.filter(
    (row) =>
      (!normalized ||
        `${row.label} ${row.value}`.toLowerCase().includes(normalized)) &&
      (filter === "all" ||
        filter === row.type ||
        (filter === "visible" && row.visible) ||
        (filter === "hidden" && !row.visible)),
  );
  const grouped = [
    {
      label: "Points",
      rows: filteredRows.filter((row) => row.type === "point"),
    },
    {
      label: "Lines & Segments",
      rows: filteredRows.filter((row) => row.type === "line"),
    },
    {
      label: "Circles",
      rows: filteredRows.filter((row) => row.type === "circle"),
    },
    {
      label: "Polygons",
      rows: filteredRows.filter((row) => row.type === "polygon"),
    },
    {
      label: "Arcs & Loci",
      rows: filteredRows.filter(
        (row) => row.type === "arc" || row.type === "locus",
      ),
    },
  ].filter((group) => group.rows.length);
  return (
    <div className="geometry-object-registry">
      {grouped.length ? (
        grouped.map((group) => (
          <div key={group.label} className="geometry-object-group">
            <h3>{group.label}</h3>
            {group.rows.map((row) => {
              const Icon = row.icon;
              const active =
                selectedGeometry?.type === row.type &&
                selectedGeometry.id === row.id;
              return (
                <div
                  key={`${row.type}-${row.id}`}
                  className={`geometry-object-row ${active ? "active" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect?.({ type: row.type, id: row.id })}
                    className="geometry-object-row-main"
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.4} />
                    <div>
                      <strong>{row.label}</strong>
                      <span>{row.value}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onToggleVisibility?.({ type: row.type, id: row.id })
                    }
                    className="geometry-object-row-action"
                    aria-label={
                      row.visible ? `Hide ${row.label}` : `Show ${row.label}`
                    }
                    title={
                      row.visible ? `Hide ${row.label}` : `Show ${row.label}`
                    }
                  >
                    {row.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  {row.locked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <p className="geometry-empty-note">
          Create geometry objects to populate the registry.
        </p>
      )}
    </div>
  );
}

function GeometryPaletteSection({
  title,
  children,
  collapsible = true,
}: {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mb-3 last:mb-0">
      <button
        type="button"
        className="geometry-palette-section-heading"
        onClick={() => collapsible && setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{title}</span>
        {collapsible && (open ? <ChevronDown /> : <ChevronRight />)}
      </button>
      {open && <div className="grid grid-cols-3 gap-1.5">{children}</div>}
    </section>
  );
}

function GeometryPaletteTool({
  item,
  active,
  favorite = false,
  onFavorite,
  onClick,
}: {
  item: GeometryPaletteToolItem;
  active: boolean;
  favorite?: boolean;
  onFavorite?: () => void;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const testId = `workspace-geometry-tool-${item.id}`;
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      onContextMenu={(event) => {
        event.preventDefault();
        onFavorite?.();
      }}
      title={`${item.label}. Right click to ${favorite ? "unpin" : "favorite"}.`}
      className={`geometry-palette-button ${active ? "geometry-palette-button-active" : ""}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2.4} />
      <span>{item.label}</span>
      {favorite && <Star className="geometry-tool-star" />}
    </button>
  );
}

function GeometryPaletteAction({ item }: { item: GeometryPaletteActionItem }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={item.action}
      title={item.label}
      className={`geometry-palette-button ${item.danger ? "geometry-palette-button-danger" : ""}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2.4} />
      <span>{item.label}</span>
    </button>
  );
}

function GeometryRegistryControls({
  search,
  filter,
  onSearch,
  onFilter,
}: {
  search: string;
  filter: "all" | GeometryObjectType | "visible" | "hidden";
  onSearch: (value: string) => void;
  onFilter: (value: "all" | GeometryObjectType | "visible" | "hidden") => void;
}) {
  return (
    <div className="geometry-registry-controls">
      <label>
        <Filter />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search objects"
        />
      </label>
      <select
        aria-label="Filter geometry objects"
        value={filter}
        onChange={(event) => onFilter(event.target.value as typeof filter)}
      >
        <option value="all">All objects</option>
        <option value="point">Points</option>
        <option value="line">Lines</option>
        <option value="circle">Circles</option>
        <option value="polygon">Polygons</option>
        <option value="visible">Visible</option>
        <option value="hidden">Hidden</option>
      </select>
    </div>
  );
}

function GeometryLayerManager({
  construction,
  selectedGeometry,
  onSelect,
}: {
  construction: Construction;
  selectedGeometry: SelectedGeometryObject | null;
  onSelect?: (selection: SelectedGeometryObject) => void;
}) {
  const layers = [
    {
      name: "Annotations",
      types: ["arc", "locus"] as GeometryObjectType[],
      color: "#f59e0b",
    },
    {
      name: "Shapes",
      types: ["polygon", "circle"] as GeometryObjectType[],
      color: "#8b5cf6",
    },
    {
      name: "Construction",
      types: ["line"] as GeometryObjectType[],
      color: "#22d3ee",
    },
    {
      name: "Points",
      types: ["point"] as GeometryObjectType[],
      color: "#10b981",
    },
  ];
  const count = (types: GeometryObjectType[]) =>
    types.reduce(
      (total, type) =>
        total +
        (type === "point"
          ? construction.points.length
          : type === "line"
            ? construction.lines.length
            : type === "circle"
              ? construction.circles.length
              : type === "polygon"
                ? construction.polygons.length
                : type === "arc"
                  ? construction.arcs.length
                  : construction.loci.length),
      0,
    );
  return (
    <div className="geometry-layer-manager">
      <header>
        <FolderTree />
        <div>
          <strong>Layer stack</strong>
          <span>Top layers render last</span>
        </div>
        <button type="button" title="Add layer">
          <Plus />
        </button>
      </header>
      {layers.map((layer, index) => (
        <section key={layer.name}>
          <span className="geometry-layer-grip">{index + 1}</span>
          <i style={{ background: layer.color }} />
          <div>
            <strong>{layer.name}</strong>
            <span>{count(layer.types)} objects</span>
          </div>
          <button type="button" aria-label={`Toggle ${layer.name} visibility`}>
            <Eye />
          </button>
          <button type="button" aria-label={`Lock ${layer.name}`}>
            <Unlock />
          </button>
          {selectedGeometry && layer.types.includes(selectedGeometry.type) && (
            <button
              type="button"
              className="is-current"
              onClick={() => onSelect?.(selectedGeometry)}
            >
              Current
            </button>
          )}
        </section>
      ))}
    </div>
  );
}

function GeometrySnapCandidate({
  tool,
  coordinate,
  settings,
}: {
  tool: GeometryTool;
  coordinate: { x: number; y: number } | null;
  settings: GeometryGraphSettings;
}) {
  if (!coordinate || (!settings.snapToGrid && !settings.snapToObjects))
    return null;
  const x = Math.round(coordinate.x * 2) / 2;
  const y = Math.round(coordinate.y * 2) / 2;
  return (
    <div className="geometry-snap-candidate" role="status">
      <Magnet />
      <span>
        {settings.snapToObjects ? "Object candidate" : "Grid candidate"}
      </span>
      <strong>
        ({roundTo(x, 2)}, {roundTo(y, 2)})
      </strong>
      <em>{geometryToolLabel(tool)}</em>
    </div>
  );
}

function GeometrySnapMenu({
  settings,
  onChange,
  onClose,
}: {
  settings: GeometryGraphSettings;
  onChange: (settings: GeometryGraphSettings) => void;
  onClose: () => void;
}) {
  const options = [
    { key: "snapToGrid", label: "Grid intersections" },
    { key: "snapToObjects", label: "Points and objects" },
  ] as const;
  return (
    <aside className="geometry-snap-menu">
      <header>
        <strong>Snapping</strong>
        <button type="button" onClick={onClose} aria-label="Close snapping">
          <X />
        </button>
      </header>
      {options.map((option) => (
        <label key={option.key}>
          <span>{option.label}</span>
          <input
            type="checkbox"
            checked={settings[option.key]}
            onChange={() =>
              onChange({ ...settings, [option.key]: !settings[option.key] })
            }
          />
        </label>
      ))}
      <p>
        Midpoints, intersections, angle guides, and tangencies appear when their
        construction tools are active.
      </p>
    </aside>
  );
}

function GeometryPinnedMeasurements({
  construction,
  pinned,
  onPinned,
  unit,
  precision,
}: {
  construction: Construction;
  pinned: string[];
  onPinned: (items: string[]) => void;
  unit: GeometryUnit;
  precision: number;
}) {
  const scale: Record<GeometryUnit, number> = {
    units: 1,
    mm: 10,
    cm: 1,
    m: 0.01,
    in: 0.3937008,
  };
  const available = [
    ...construction.lines.slice(0, 4).map((line) => {
      const start = pointById(construction.points, line.a);
      const end = pointById(construction.points, line.b);
      return start && end
        ? {
            id: line.id,
            label: `${start.label}${end.label}`,
            value: `${roundTo((distanceBetween(start, end) / 40) * scale[unit], precision)} ${unit === "units" ? "u" : unit}`,
          }
        : null;
    }),
    ...construction.circles.slice(0, 3).map((circle) => {
      const center = pointById(construction.points, circle.center);
      const edge = pointById(construction.points, circle.edge);
      return center && edge
        ? {
            id: circle.id,
            label: `Radius ${center.label}`,
            value: `${roundTo((distanceBetween(center, edge) / 40) * scale[unit], precision)} ${unit === "units" ? "u" : unit}`,
          }
        : null;
    }),
    ...construction.polygons.slice(0, 3).map((polygon, index) => {
      const points = polygon.points
        .map((id) => pointById(construction.points, id))
        .filter((point): point is GeoPoint => Boolean(point));
      return points.length >= 3
        ? {
            id: polygon.id,
            label: `Polygon ${index + 1} area`,
            value: `${roundTo(polygonArea(points) / 1600, precision)} ${unit === "units" ? "u²" : `${unit}²`}`,
          }
        : null;
    }),
  ].filter(Boolean) as Array<{ id: string; label: string; value: string }>;
  return (
    <section className="geometry-pinned-measurements">
      <header>
        <RulerIcon />
        <div>
          <strong>Pinned measurements</strong>
          <span>{pinned.length} pinned</span>
        </div>
      </header>
      <div>
        {available.map((item) => (
          <button
            type="button"
            key={item.id}
            className={pinned.includes(item.id) ? "is-pinned" : ""}
            onClick={() =>
              onPinned(
                pinned.includes(item.id)
                  ? pinned.filter((id) => id !== item.id)
                  : [...pinned, item.id],
              )
            }
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <PinIcon />
          </button>
        ))}
      </div>
      {!available.length && (
        <p>Create a line or circle to pin live measurements.</p>
      )}
    </section>
  );
}

function GeometryMobileDrawer({
  panel,
  onPanel,
  onClose,
  tools,
  objects,
  inspector,
  protocol,
}: {
  panel: Exclude<GeometryMobilePanel, null>;
  onPanel: (panel: Exclude<GeometryMobilePanel, null>) => void;
  onClose: () => void;
  tools: ReactNode;
  objects: ReactNode;
  inspector: ReactNode;
  protocol: ReactNode;
}) {
  const content = { tools, objects, inspector, protocol }[panel];
  return (
    <>
      <button
        type="button"
        className="geometry-drawer-backdrop"
        onClick={onClose}
        aria-label="Close geometry panel"
      />
      <aside
        className="geometry-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${panel} panel`}
      >
        <div className="geometry-drawer-handle" />
        <header>
          <nav>
            {(["tools", "objects", "inspector", "protocol"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  className={panel === tab ? "active" : ""}
                  onClick={() => onPanel(tab)}
                >
                  {tab}
                </button>
              ),
            )}
          </nav>
          <button type="button" onClick={onClose} aria-label="Close panel">
            <X />
          </button>
        </header>
        <div className="geometry-drawer-content thin-scrollbar">{content}</div>
      </aside>
    </>
  );
}

function GeometryTimeline({
  entries,
  index,
  playing,
  onIndex,
  onPlaying,
}: {
  entries: GeometryProtocolEntry[];
  index: number;
  playing: boolean;
  onIndex: (index: number) => void;
  onPlaying: (playing: boolean) => void;
}) {
  const ordered = [...entries].reverse();
  return (
    <section className="geometry-timeline">
      <header>
        <div>
          <strong>Construction timeline</strong>
          <span>{entries.length} recorded steps</span>
        </div>
        <button
          type="button"
          onClick={() => onPlaying(!playing)}
          disabled={!ordered.length}
        >
          {playing ? <Pause /> : <Play />}
          {playing ? "Pause" : "Play"}
        </button>
      </header>
      <input
        aria-label="Construction timeline position"
        type="range"
        min={0}
        max={Math.max(0, ordered.length - 1)}
        value={Math.min(index, Math.max(0, ordered.length - 1))}
        onChange={(event) => onIndex(Number(event.target.value))}
        disabled={!ordered.length}
      />
      <div className="geometry-timeline-steps">
        {ordered.map((entry, entryIndex) => (
          <button
            type="button"
            key={entry.id}
            className={entryIndex === index ? "active" : ""}
            onClick={() => onIndex(entryIndex)}
          >
            <span>{entryIndex + 1}</span>
            <div>
              <strong>{entry.label}</strong>
              <small>{entry.detail}</small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function GeometrySettingsDialog({
  settings,
  unit,
  precision,
  onSettings,
  onUnit,
  onPrecision,
  onContrast,
  onClose,
}: {
  settings: GeometryGraphSettings;
  unit: GeometryUnit;
  precision: number;
  onSettings: (settings: GeometryGraphSettings) => void;
  onUnit: (unit: GeometryUnit) => void;
  onPrecision: (value: number) => void;
  onContrast: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="geometry-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="geometry-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Geometry workspace settings"
      >
        <header>
          <div>
            <span>Workspace</span>
            <h2>Geometry settings</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close settings">
            <X />
          </button>
        </header>
        <label>
          Measurement unit
          <select
            value={unit}
            onChange={(event) => onUnit(event.target.value as GeometryUnit)}
          >
            <option value="units">Abstract units</option>
            <option value="mm">Millimetres</option>
            <option value="cm">Centimetres</option>
            <option value="m">Metres</option>
            <option value="in">Inches</option>
          </select>
        </label>
        <label>
          Decimal precision
          <select
            value={precision}
            onChange={(event) => onPrecision(Number(event.target.value))}
          >
            {[0, 1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>
                {value} places
              </option>
            ))}
          </select>
        </label>
        <div className="geometry-settings-grid">
          {(
            [
              "showGrid",
              "showAxes",
              "showPointLabels",
              "showMeasurements",
              "snapToGrid",
              "snapToObjects",
              "minorGrid",
              "showAxisLabels",
            ] as Array<keyof GeometryGraphSettings>
          ).map((key) => (
            <label key={key}>
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <input
                type="checkbox"
                checked={Boolean(settings[key])}
                onChange={() =>
                  onSettings({ ...settings, [key]: !settings[key] })
                }
              />
            </label>
          ))}
        </div>
        <label>
          Grid style
          <select
            value={settings.gridType ?? "cartesian"}
            onChange={(event) => onSettings({ ...settings, gridType: event.target.value as GeometryGraphSettings["gridType"] })}
          >
            <option value="cartesian">Cartesian</option>
            <option value="polar">Polar</option>
            <option value="isometric">Isometric</option>
          </select>
        </label>
        <label>
          Grid spacing
          <select
            value={settings.gridSpacing ?? 40}
            onChange={(event) => onSettings({ ...settings, gridSpacing: Number(event.target.value) })}
          >
            {[20, 40, 80, 120].map((value) => <option key={value} value={value}>{value} px</option>)}
          </select>
        </label>
        <label>
          Point capture
          <select
            value={settings.pointCapture ?? (settings.snapToGrid ? "snap" : "off")}
            onChange={(event) => {
              const value = event.target.value as NonNullable<GeometryGraphSettings["pointCapture"]>;
              onSettings({ ...settings, pointCapture: value, snapToGrid: value === "snap" || value === "fixed" });
            }}
          >
            <option value="automatic">Automatic</option>
            <option value="snap">Snap to grid</option>
            <option value="fixed">Fixed to grid</option>
            <option value="off">Off</option>
          </select>
        </label>
        <label>
          Snap strength
          <input type="range" min="4" max="32" step="2" value={settings.snapStrength ?? 18} onChange={(event) => onSettings({ ...settings, snapStrength: Number(event.target.value) })} />
          <span>{settings.snapStrength ?? 18}px</span>
        </label>
        <button
          type="button"
          className="geometry-dialog-command"
          onClick={onContrast}
        >
          Toggle high contrast
        </button>
      </section>
    </div>
  );
}

function GeometryExportDialog({
  projectName,
  construction,
  onPng,
  onClose,
}: {
  projectName: string;
  construction: Construction;
  onPng?: () => void;
  onClose: () => void;
}) {
  const summary = JSON.stringify({ projectName, construction }, null, 2);
  const download = (filename: string, content: string, type = "text/plain") => {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([content], { type }));
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };
  const csv = `type,count\npoints,${construction.points.length}\nlines,${construction.lines.length}\ncircles,${construction.circles.length}\npolygons,${construction.polygons.length}\nconstraints,${construction.constraints.length}`;
  return (
    <div
      className="geometry-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="geometry-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Export geometry project"
      >
        <header>
          <div>
            <span>Export</span>
            <h2>{projectName}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close export">
            <X />
          </button>
        </header>
        <div className="geometry-export-grid">
          <button
            type="button"
            onClick={() => {
              onPng?.();
              onClose();
            }}
          >
            <Download />
            <strong>Canvas image</strong>
            <span>PNG with current labels</span>
          </button>
          <button
            type="button"
            onClick={() =>
              download(`${projectName}.json`, summary, "application/json")
            }
          >
            <FileText />
            <strong>Project data</strong>
            <span>JSON, editable later</span>
          </button>
          <button
            type="button"
            onClick={() =>
              download(`${projectName}-summary.csv`, csv, "text/csv")
            }
          >
            <ListTree />
            <strong>Object summary</strong>
            <span>CSV</span>
          </button>
          <button type="button" onClick={() => window.print()}>
            <Printer />
            <strong>Worksheet</strong>
            <span>PDF or print</span>
          </button>
          <button type="button" disabled title="Select an object first">
            <Copy />
            <strong>Selected object</strong>
            <span>Available after selection</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function RulerIcon() {
  return <SlidersHorizontal />;
}
function PinIcon() {
  return <Magnet />;
}
function distanceBetween(a: GeoPoint, b: GeoPoint) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function GeometryGraphSettingsBar({
  settings,
  onChange,
}: {
  settings: GeometryGraphSettings;
  onChange: (settings: GeometryGraphSettings) => void;
}) {
  const toggle = (key: keyof GeometryGraphSettings) =>
    onChange({ ...settings, [key]: !settings[key] });
  const items: Array<{ key: keyof GeometryGraphSettings; label: string }> = [
    { key: "showGrid", label: "Grid" },
    { key: "showAxes", label: "Axes" },
    { key: "showUnitLabels", label: "Units" },
    { key: "showPointLabels", label: "Labels" },
    { key: "showMeasurements", label: "Measures" },
    { key: "snapToGrid", label: "Grid snap" },
    { key: "snapToObjects", label: "Object snap" },
    { key: "highContrastGrid", label: "Contrast" },
  ];
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white/85 p-2 dark:border-white/10 dark:bg-white/5"
      data-testid="workspace-geometry-graph-settings"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Graph Settings
        </p>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          1 unit = 40 grid pixels, origin at board center
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => toggle(item.key)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-black transition ${settings[item.key] ? "border-cyan-700 bg-cyan-700 text-white shadow-sm shadow-cyan-700/20" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-cyan-400/10"}`}
            aria-pressed={settings[item.key]}
            data-testid={`workspace-geometry-setting-${item.key}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function GeometryBoard({
  boardRef,
  construction,
  workspaceImages,
  selectedImageId,
  selectedGeometry,
  selectedPointIds,
  polygonDraft,
  activeTool,
  camera,
  graphSettings,
  onWheel,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  onContextMenu,
}: {
  boardRef: RefObject<SVGSVGElement>;
  construction: Construction;
  workspaceImages: WorkspaceImage[];
  selectedImageId: string | null;
  selectedGeometry: SelectedGeometryObject | null;
  selectedPointIds: string[];
  polygonDraft: string[];
  activeTool: GeometryTool;
  camera: GeometryCamera;
  graphSettings: GeometryGraphSettings;
  onWheel: (event: WheelEvent<SVGSVGElement>) => void;
  onKeyDown: (event: KeyboardEvent<SVGSVGElement>) => void;
  onPointerDown: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerMove: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerLeave: () => void;
  onContextMenu: (event: PointerEvent<SVGSVGElement>) => void;
}) {
  return (
    <svg
      ref={boardRef}
      data-testid="workspace-geometry-board"
      data-export="geometry"
      viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`}
      role="application"
      tabIndex={0}
      aria-label="Geometry constructor. Select a point and use arrow keys to nudge it. Press Escape to return to select mode."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onContextMenu={onContextMenu}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      data-active-tool={activeTool}
      className="geometry-board-svg w-full touch-none rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950"
    >
      <title>Math Universe Geometry Construction</title>
      <defs>
        <filter
          id="geometry-selected-glow-filter"
          x="-45%"
          y="-45%"
          width="190%"
          height="190%"
        >
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feFlood floodColor="#22d3ee" floodOpacity="0.9" result="glowColor" />
          <feComposite
            in="glowColor"
            in2="blur"
            operator="in"
            result="coloredGlow"
          />
          <feMerge>
            <feMergeNode in="coloredGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <GeometryGrid settings={graphSettings} camera={camera} />
      {workspaceImages
        .filter((image) => image.visible !== false)
        .map((image) => (
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
            {selectedImageId === image.id && (
              <rect
                x={image.x}
                y={image.y}
                width={image.width}
                height={image.height}
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeDasharray="8 6"
                pointerEvents="none"
              />
            )}
          </g>
        ))}
      <ConstraintOverlays construction={construction} />
      {construction.loci.map((locus) => (
        <GeometryLocus
          key={locus.id}
          locus={locus}
          selected={isSelectedGeometry(selectedGeometry, "locus", locus.id)}
        />
      ))}
      {construction.polygons.map((polygon) => (
        <GeometryPolygon
          key={polygon.id}
          polygon={polygon}
          points={construction.points}
          selected={isSelectedGeometry(selectedGeometry, "polygon", polygon.id)}
        />
      ))}
      {construction.arcs.map((arc) => (
        <GeometryArc
          key={arc.id}
          arc={arc}
          points={construction.points}
          selected={isSelectedGeometry(selectedGeometry, "arc", arc.id)}
        />
      ))}
      {construction.lines.map((line) => (
        <GeometryLine
          key={line.id}
          line={line}
          points={construction.points}
          selected={isSelectedGeometry(selectedGeometry, "line", line.id)}
        />
      ))}
      {construction.circles.map((circle) => (
        <GeometryCircle
          key={circle.id}
          circle={circle}
          points={construction.points}
          selected={isSelectedGeometry(selectedGeometry, "circle", circle.id)}
        />
      ))}
      {graphSettings.showMeasurements && (
        <GeometryMeasurementOverlays construction={construction} />
      )}
      {activeTool === "angle" && (
        <AngleToolPreview
          selectedPointIds={selectedPointIds}
          points={construction.points}
        />
      )}
      {polygonDraft.length > 1 && (
        <PolygonDraftPreview
          draft={polygonDraft}
          points={construction.points}
        />
      )}
      {construction.points
        .filter((point) => point.style?.visible !== false)
        .map((point) => (
          <g key={point.id}>
            {point.style?.trace && (
              <circle
                cx={point.x}
                cy={point.y}
                r={(point.style?.size ?? 9) + 12}
                fill="none"
                stroke={point.style?.color ?? "#06b6d4"}
                strokeDasharray="4 8"
                strokeWidth="4"
                opacity="0.28"
              />
            )}
            {isSelectedGeometry(selectedGeometry, "point", point.id) && (
              <circle
                cx={point.x}
                cy={point.y}
                r={(point.style?.size ?? 9) + 9}
                fill="none"
                stroke="#67e8f9"
                strokeWidth="5"
                opacity="0.9"
                filter="url(#geometry-selected-glow-filter)"
                className="geometry-selected-glow"
                pointerEvents="none"
              />
            )}
            <circle
              data-point-id={point.id}
              cx={point.x}
              cy={point.y}
              r={point.style?.size ?? 9}
              fill={
                selectedPointIds.includes(point.id) ||
                polygonDraft.includes(point.id)
                  ? "#f59e0b"
                  : (point.style?.color ?? "#06b6d4")
              }
              stroke={
                isSelectedGeometry(selectedGeometry, "point", point.id)
                  ? "#f97316"
                  : "#0f172a"
              }
              strokeWidth={
                isSelectedGeometry(selectedGeometry, "point", point.id) ? 4 : 2
              }
              opacity={point.style?.opacity ?? 1}
              className="cursor-pointer"
            />
            {graphSettings.showPointLabels &&
              point.style?.labelMode !== "hidden" && (
                <text
                  x={point.x + 12}
                  y={point.y - 10}
                  fill="#0f172a"
                  className="select-none text-xs font-bold dark:fill-slate-100"
                >
                  {pointLabelText(point)}
                </text>
              )}
          </g>
        ))}
    </svg>
  );
}

function GeometryGrid({ settings, camera }: { settings: GeometryGraphSettings; camera?: GeometryCamera }) {
  const showUnits = settings.showUnitLabels || settings.showUnits;
  const width = camera?.width ?? 640;
  const height = camera?.height ?? 420;
  const baseUnit = settings.gridSpacing ?? 40;
  // SVG text is measured in world coordinates. Scale it with the viewBox so
  // tick values keep the same readable on-screen size while zooming out.
  const labelScale = Math.max(width / 640, height / 420);
  const labelFontSize = 10 * labelScale;
  const labelMargin = 20 * labelScale;
  const labelOffset = 18 * labelScale;
  const visibleSpan = Math.max(width, height);
  const adaptiveMultiplier = Math.max(1, 2 ** Math.ceil(Math.log2(Math.max(1, visibleSpan / (baseUnit * 28)))));
  const unit = baseUnit * adaptiveMultiplier;
  const origin = { x: 320, y: 220 };
  const left = camera?.x ?? 0;
  const top = camera?.y ?? 0;
  const right = left + width;
  const bottom = top + height;
  const firstVertical = Math.floor((left - origin.x) / unit) - 1;
  const lastVertical = Math.ceil((right - origin.x) / unit) + 1;
  const firstHorizontal = Math.floor((top - origin.y) / unit) - 1;
  const lastHorizontal = Math.ceil((bottom - origin.y) / unit) + 1;
  const verticals = Array.from({ length: Math.max(0, lastVertical - firstVertical + 1) }, (_, i) => origin.x + (firstVertical + i) * unit);
  const horizontals = Array.from({ length: Math.max(0, lastHorizontal - firstHorizontal + 1) }, (_, i) => origin.y + (firstHorizontal + i) * unit);
  const gridStroke = settings.highContrastGrid
    ? "var(--geo-grid-strong)"
    : "var(--geo-grid)";
  const axisStroke = settings.highContrastGrid ? "var(--geo-axis-strong)" : "var(--geo-axis)";
  const labelFill = settings.highContrastGrid ? "var(--geo-tick-strong)" : "var(--geo-tick)";
  const gridType = settings.gridType ?? "cartesian";
  const polarRings = Array.from({ length: Math.max(1, Math.ceil(Math.max(width, height) / unit / 2) + 2) }, (_, i) => (i + 1) * unit);
  return (
    <g>
      {settings.showGrid && gridType === "cartesian" &&
        verticals.map((x) => (
          <line
            key={`gv-${x}`}
            x1={x}
            x2={x}
            y1={top - unit}
            y2={bottom + unit}
            stroke={gridStroke}
            strokeWidth={settings.highContrastGrid ? 1.4 : 1}
          />
        ))}
      {settings.showGrid && gridType === "cartesian" &&
        horizontals.map((y) => (
          <line
            key={`gh-${y}`}
            x1={left - unit}
            x2={right + unit}
            y1={y}
            y2={y}
            stroke={gridStroke}
            strokeWidth={settings.highContrastGrid ? 1.4 : 1}
          />
        ))}
      {settings.showGrid && settings.minorGrid && gridType === "cartesian" && (
        <g opacity="0.45">
          {verticals.map((x) => <line key={`gmv-${x}`} x1={x + unit / 2} x2={x + unit / 2} y1={top - unit} y2={bottom + unit} stroke={gridStroke} strokeWidth="0.6" />)}
          {horizontals.map((y) => <line key={`gmh-${y}`} x1={left - unit} x2={right + unit} y1={y + unit / 2} y2={y + unit / 2} stroke={gridStroke} strokeWidth="0.6" />)}
        </g>
      )}
      {settings.showGrid && gridType === "polar" && (
        <g fill="none" stroke={gridStroke} strokeWidth="1">
          {polarRings.map((radius) => <circle key={`pr-${radius}`} cx={origin.x} cy={origin.y} r={radius} />)}
          {Array.from({ length: 12 }, (_, index) => {
            const angle = index * Math.PI / 6;
            return <line key={`pa-${index}`} x1={origin.x - Math.cos(angle) * Math.max(width, height)} y1={origin.y - Math.sin(angle) * Math.max(width, height)} x2={origin.x + Math.cos(angle) * Math.max(width, height)} y2={origin.y + Math.sin(angle) * Math.max(width, height)} />;
          })}
        </g>
      )}
      {settings.showGrid && gridType === "isometric" && (
        <g stroke={gridStroke} strokeWidth="1" opacity="0.8">
          {verticals.map((x) => <line key={`iv-${x}`} x1={x} y1={top - unit} x2={x + (bottom - top + unit * 2) * 0.58} y2={bottom + unit} />)}
          {verticals.map((x) => <line key={`iv2-${x}`} x1={x} y1={bottom + unit} x2={x + (top - bottom - unit * 2) * 0.58} y2={top - unit} />)}
        </g>
      )}
      {(settings.showAxes || showUnits) && (
        <g className="select-none">
          {settings.showAxes && (
            <line
              x1={left - unit}
              x2={right + unit}
              y1={origin.y}
              y2={origin.y}
              stroke={axisStroke}
              strokeWidth={settings.highContrastGrid ? 2.4 : 1.8}
              opacity={settings.highContrastGrid ? 0.85 : 0.45}
            />
          )}
          {settings.showAxes && (
            <line
              x1={origin.x}
              x2={origin.x}
              y1={top - unit}
              y2={bottom + unit}
              stroke={axisStroke}
              strokeWidth={settings.highContrastGrid ? 2.4 : 1.8}
              opacity={settings.highContrastGrid ? 0.85 : 0.45}
            />
          )}
          {showUnits &&
            verticals.map((x) => {
              const value = Math.round((x - origin.x) / baseUnit);
              if (value === 0 || x < left + labelMargin || x > right - labelMargin) return null;
              return (
                <text
                  key={`x-unit-${x}`}
                  x={x}
                  y={origin.y + labelOffset}
                  textAnchor="middle"
                  fill={labelFill}
                  fontSize={labelFontSize}
                  fontWeight="800"
                >
                  {value}
                </text>
              );
            })}
          {showUnits &&
            horizontals.map((y) => {
              const value = Math.round((origin.y - y) / baseUnit);
              if (value === 0 || y < top + labelMargin || y > bottom - labelMargin) return null;
              return (
                <text
                  key={`y-unit-${y}`}
                  x={origin.x - 10 * labelScale}
                  y={y + 4 * labelScale}
                  textAnchor="end"
                  fill={labelFill}
                  fontSize={labelFontSize}
                  fontWeight="800"
                >
                  {value}
                </text>
              );
            })}
          {showUnits && (
            <text
              x={origin.x + 7 * labelScale}
              y={origin.y + 16 * labelScale}
              fill={labelFill}
              fontSize={labelFontSize}
              fontWeight="900"
            >
              0
            </text>
          )}
          {(settings.showAxes && settings.showAxisLabels !== false) && (
            <text
              x={right - 18 * labelScale}
              y={origin.y - 8 * labelScale}
              fill={labelFill}
              fontSize={labelFontSize}
              fontWeight="900"
            >
              x
            </text>
          )}
          {(settings.showAxes && settings.showAxisLabels !== false) && (
            <text
              x={origin.x + 8 * labelScale}
              y={top + 18 * labelScale}
              fill={labelFill}
              fontSize={labelFontSize}
              fontWeight="900"
            >
              y
            </text>
          )}
        </g>
      )}
    </g>
  );
}

function GeometryLine({
  line,
  points,
  selected = false,
}: {
  line: GeoLine;
  points: GeoPoint[];
  selected?: boolean;
}) {
  const a = pointById(points, line.a),
    b = pointById(points, line.b);
  if (!a || !b || line.style?.visible === false) return null;
  const kind = line.style?.label ?? "line";
  const color = line.style?.color ?? "#8b5cf6";
  const endpoints = linearDisplayEndpoints(a, b, kind);
  const arrow =
    kind === "ray" || kind === "vector"
      ? arrowHeadPoints(
          endpoints.x1,
          endpoints.y1,
          endpoints.x2,
          endpoints.y2,
          kind === "vector" ? 14 : 11,
        )
      : null;
  return (
    <g>
      {selected && (
        <line
          x1={endpoints.x1}
          y1={endpoints.y1}
          x2={endpoints.x2}
          y2={endpoints.y2}
          stroke="#67e8f9"
          strokeWidth={Math.max(12, (line.style?.strokeWidth ?? 4) + 8)}
          strokeDasharray={kind === "line" ? "10 8" : undefined}
          opacity="0.72"
          filter="url(#geometry-selected-glow-filter)"
          className="geometry-selected-glow"
          pointerEvents="none"
        />
      )}
      <line
        data-object-type="line"
        data-object-id={line.id}
        x1={endpoints.x1}
        y1={endpoints.y1}
        x2={endpoints.x2}
        y2={endpoints.y2}
        stroke={color}
        strokeWidth={
          selected
            ? Math.max(7, line.style?.strokeWidth ?? 4)
            : (line.style?.strokeWidth ?? 4)
        }
        strokeDasharray={kind === "line" ? "10 8" : undefined}
        opacity={selected ? 0.95 : (line.style?.opacity ?? 1)}
        className="cursor-move"
      />
      {selected && arrow && (
        <polygon
          points={arrow}
          fill="#67e8f9"
          opacity="0.72"
          filter="url(#geometry-selected-glow-filter)"
          className="geometry-selected-glow"
          pointerEvents="none"
        />
      )}
      {arrow && (
        <polygon
          points={arrow}
          fill={color}
          opacity={selected ? 0.95 : (line.style?.opacity ?? 1)}
          pointerEvents="none"
        />
      )}
      {kind !== "line" && (
        <text
          x={(a.x + b.x) / 2 + 8}
          y={(a.y + b.y) / 2 - 8}
          fill={color}
          className="pointer-events-none select-none text-[10px] font-black uppercase"
        >
          {kind}
        </text>
      )}
    </g>
  );
}

function GeometryCircle({
  circle,
  points,
  selected = false,
}: {
  circle: GeoCircle;
  points: GeoPoint[];
  selected?: boolean;
}) {
  const center = pointById(points, circle.center),
    edge = pointById(points, circle.edge);
  if (!center || !edge || circle.style?.visible === false) return null;
  const radius = distance(center, edge);
  return (
    <g>
      {selected && (
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill="none"
          stroke="#67e8f9"
          strokeWidth={Math.max(12, (circle.style?.strokeWidth ?? 4) + 8)}
          opacity="0.72"
          filter="url(#geometry-selected-glow-filter)"
          className="geometry-selected-glow"
          pointerEvents="none"
        />
      )}
      <circle
        data-object-type="circle"
        data-object-id={circle.id}
        cx={center.x}
        cy={center.y}
        r={radius}
        fill={circle.style?.fill ?? "rgba(34,211,238,.12)"}
        stroke={circle.style?.color ?? "#06b6d4"}
        strokeWidth={
          selected
            ? Math.max(7, circle.style?.strokeWidth ?? 4)
            : (circle.style?.strokeWidth ?? 4)
        }
        opacity={circle.style?.opacity ?? 1}
        className="cursor-move"
      />
    </g>
  );
}

function GeometryPolygon({
  polygon,
  points,
  selected = false,
}: {
  polygon: GeoPolygon;
  points: GeoPoint[];
  selected?: boolean;
}) {
  const polygonPoints = polygon.points
    .map((id) => pointById(points, id))
    .filter(Boolean) as GeoPoint[];
  if (polygonPoints.length < 3 || polygon.style?.visible === false) return null;
  const value = polygonPoints.map((point) => `${point.x},${point.y}`).join(" ");
  return (
    <g>
      {selected && (
        <polygon
          points={value}
          fill="rgba(34,211,238,.12)"
          stroke="#67e8f9"
          strokeWidth={Math.max(11, (polygon.style?.strokeWidth ?? 3) + 8)}
          opacity="0.78"
          filter="url(#geometry-selected-glow-filter)"
          className="geometry-selected-glow"
          pointerEvents="none"
        />
      )}
      <polygon
        data-object-type="polygon"
        data-object-id={polygon.id}
        points={value}
        fill={polygon.style?.fill ?? "rgba(245,158,11,.15)"}
        stroke={polygon.style?.color ?? "#f59e0b"}
        strokeWidth={
          selected
            ? Math.max(7, polygon.style?.strokeWidth ?? 3)
            : (polygon.style?.strokeWidth ?? 3)
        }
        opacity={polygon.style?.opacity ?? 1}
        className="cursor-move"
      />
    </g>
  );
}

function GeometryArc({
  arc,
  points,
  selected = false,
}: {
  arc: GeoArc;
  points: GeoPoint[];
  selected?: boolean;
}) {
  const center = pointById(points, arc.center),
    start = pointById(points, arc.start),
    end = pointById(points, arc.end);
  if (!center || !start || !end || arc.style?.visible === false) return null;
  const radius = distance(center, start);
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
  if (arc.kind === "angle") {
    const markerRadius = Math.max(22, Math.min(54, distance(center, start) * 0.32, distance(center, end) * 0.32));
    const startMarker = {
      x: center.x + Math.cos(startAngle) * markerRadius,
      y: center.y + Math.sin(startAngle) * markerRadius,
    };
    const endMarker = {
      x: center.x + Math.cos(endAngle) * markerRadius,
      y: center.y + Math.sin(endAngle) * markerRadius,
    };
    const clockwiseDelta = (endAngle - startAngle + Math.PI * 2) % (Math.PI * 2);
    const sweep = clockwiseDelta <= Math.PI ? 1 : 0;
    const minorDelta = clockwiseDelta <= Math.PI ? clockwiseDelta : Math.PI * 2 - clockwiseDelta;
    const bisectorAngle = clockwiseDelta <= Math.PI
      ? startAngle + minorDelta / 2
      : startAngle - minorDelta / 2;
    const markerPath = `M ${startMarker.x} ${startMarker.y} A ${markerRadius} ${markerRadius} 0 0 ${sweep} ${endMarker.x} ${endMarker.y}`;
    const angleDegrees = minorDelta * 180 / Math.PI;
    const labelRadius = markerRadius + 20;
    const label = `∠${start.label}${center.label}${end.label} ${roundTo(angleDegrees, 1)}°`;
    return (
      <g opacity={arc.style?.opacity ?? 1}>
        <path
          d={`M ${start.x} ${start.y} L ${center.x} ${center.y} L ${end.x} ${end.y}`}
          fill="none"
          stroke={arc.style?.color ?? "#14b8a6"}
          strokeWidth="2.5"
          strokeDasharray="6 5"
          opacity="0.72"
          pointerEvents="none"
        />
        {selected && (
          <path d={markerPath} fill="none" stroke="#67e8f9" strokeWidth="13" opacity="0.72" filter="url(#geometry-selected-glow-filter)" pointerEvents="none" />
        )}
        <path
          data-object-type="arc"
          data-object-id={arc.id}
          d={markerPath}
          fill="none"
          stroke={arc.style?.color ?? "#14b8a6"}
          strokeWidth={selected ? 7 : (arc.style?.strokeWidth ?? 5)}
          strokeLinecap="round"
          className="cursor-move"
        />
        <text
          x={center.x + Math.cos(bisectorAngle) * labelRadius}
          y={center.y + Math.sin(bisectorAngle) * labelRadius + 4}
          textAnchor="middle"
          fill="#f8fafc"
          stroke="#0f172a"
          strokeWidth="3"
          paintOrder="stroke"
          fontSize="12"
          fontWeight="900"
          pointerEvents="none"
        >
          {label}
        </text>
      </g>
    );
  }
  const largeArc =
    (endAngle - startAngle + Math.PI * 2) % (Math.PI * 2) > Math.PI ? 1 : 0;
  const path = `M ${center.x} ${center.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}${arc.sector ? " Z" : ""}`;
  return (
    <g>
      {selected && (
        <path
          d={path}
          fill={arc.sector ? "rgba(34,211,238,.12)" : "none"}
          stroke="#67e8f9"
          strokeWidth={Math.max(12, (arc.style?.strokeWidth ?? 4) + 8)}
          opacity="0.74"
          filter="url(#geometry-selected-glow-filter)"
          className="geometry-selected-glow"
          pointerEvents="none"
        />
      )}
      <path
        data-object-type="arc"
        data-object-id={arc.id}
        d={path}
        fill={arc.sector ? (arc.style?.fill ?? "rgba(245,158,11,.16)") : "none"}
        stroke={arc.style?.color ?? "#14b8a6"}
        strokeWidth={selected ? 6 : (arc.style?.strokeWidth ?? 4)}
        opacity={arc.style?.opacity ?? 1}
        className="cursor-move"
      />
    </g>
  );
}

function GeometryLocus({
  locus,
  selected = false,
}: {
  locus: GeoLocus;
  selected?: boolean;
}) {
  if (locus.style?.visible === false || locus.points.length < 2) return null;
  const d = locus.points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  return (
    <g>
      {selected && (
        <path
          d={d}
          fill="none"
          stroke="#67e8f9"
          strokeWidth={Math.max(12, (locus.style?.strokeWidth ?? 4) + 8)}
          opacity="0.72"
          filter="url(#geometry-selected-glow-filter)"
          className="geometry-selected-glow"
          pointerEvents="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <path
        data-object-type="locus"
        data-object-id={locus.id}
        d={d}
        fill="none"
        stroke={locus.style?.color ?? "#ec4899"}
        strokeWidth={locus.style?.strokeWidth ?? 4}
        opacity={locus.style?.opacity ?? 0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function PolygonDraftPreview({
  draft,
  points,
}: {
  draft: string[];
  points: GeoPoint[];
}) {
  const draftPoints = draft
    .map((id) => pointById(points, id))
    .filter(Boolean) as GeoPoint[];
  if (draftPoints.length < 2) return null;
  return (
    <polyline
      points={draftPoints.map((point) => `${point.x},${point.y}`).join(" ")}
      fill="none"
      stroke="#f59e0b"
      strokeWidth="3"
      strokeDasharray="8 6"
      pointerEvents="none"
    />
  );
}

function AngleToolPreview({
  selectedPointIds,
  points,
}: {
  selectedPointIds: string[];
  points: GeoPoint[];
}) {
  const selected = selectedPointIds
    .map((id) => pointById(points, id))
    .filter(Boolean) as GeoPoint[];
  if (selected.length < 2) return null;
  const [start, vertex, end] = selected;
  return (
    <g pointerEvents="none">
      {start && vertex && (
        <line
          x1={vertex.x}
          y1={vertex.y}
          x2={start.x}
          y2={start.y}
          stroke="#f97316"
          strokeWidth="3"
          strokeDasharray="8 6"
        />
      )}
      {end && vertex && (
        <line
          x1={vertex.x}
          y1={vertex.y}
          x2={end.x}
          y2={end.y}
          stroke="#f97316"
          strokeWidth="3"
          strokeDasharray="8 6"
        />
      )}
      {selected.length === 2 && vertex && (
        <circle
          cx={vertex.x}
          cy={vertex.y}
          r="6"
          fill="#f97316"
          stroke="#f97316"
          strokeWidth="2"
        />
      )}
    </g>
  );
}

function GeometryMeasurementOverlays({
  construction,
}: {
  construction: Construction;
}) {
  const labels = [
    ...construction.lines.map((line) => {
      const a = pointById(construction.points, line.a),
        b = pointById(construction.points, line.b);
      if (!a || !b || line.style?.visible === false) return null;
      return {
        id: `line-${line.id}`,
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2 - 12,
        text: `${roundTo(distance(a, b) / 40, 2)}`,
      };
    }),
    ...construction.circles.map((circle) => {
      const center = pointById(construction.points, circle.center),
        edge = pointById(construction.points, circle.edge);
      if (!center || !edge || circle.style?.visible === false) return null;
      return {
        id: `circle-${circle.id}`,
        x: center.x + distance(center, edge) / Math.SQRT2,
        y: center.y - distance(center, edge) / Math.SQRT2,
        text: `r=${roundTo(distance(center, edge) / 40, 2)}`,
      };
    }),
    ...construction.polygons.map((polygon) => {
      const polygonPoints = polygon.points
        .map((id) => pointById(construction.points, id))
        .filter(Boolean) as GeoPoint[];
      if (polygonPoints.length < 3 || polygon.style?.visible === false)
        return null;
      const center = centroid(polygonPoints);
      return {
        id: `polygon-${polygon.id}`,
        x: center.x,
        y: center.y,
        text: `A=${roundTo(polygonArea(polygonPoints) / 1600, 2)}`,
      };
    }),
  ].filter(
    (label): label is { id: string; x: number; y: number; text: string } =>
      Boolean(label),
  );
  return (
    <g pointerEvents="none" data-testid="workspace-geometry-measurements">
      {labels.map((label) => (
        <g key={label.id}>
          <rect
            x={label.x - 6}
            y={label.y - 15}
            width={Math.max(42, label.text.length * 7 + 12)}
            height="20"
            rx="6"
            fill="rgba(255,255,255,.86)"
            stroke="rgba(6,182,212,.36)"
          />
          <text
            x={label.x}
            y={label.y}
            fill="#0f172a"
            fontSize="11"
            fontWeight="900"
          >
            {label.text}
          </text>
        </g>
      ))}
    </g>
  );
}

function ConstraintOverlays({ construction }: { construction: Construction }) {
  return (
    <g>
      {construction.constraints.map((constraint) => {
        if (
          constraint.type === "parallel" ||
          constraint.type === "perpendicular"
        ) {
          const line = construction.lines.find(
            (item) => item.id === constraint.line,
          );
          const a = line ? pointById(construction.points, line.a) : null;
          const b = line ? pointById(construction.points, line.b) : null;
          if (!a || !b) return null;
          return (
            <g key={constraint.id}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={constraint.type === "parallel" ? "#10b981" : "#ef4444"}
                strokeWidth="7"
                opacity="0.22"
              />
              <text
                x={(a.x + b.x) / 2 + 8}
                y={(a.y + b.y) / 2 - 8}
                fill={constraint.type === "parallel" ? "#047857" : "#b91c1c"}
                className="text-xs font-bold"
              >
                {constraint.type === "parallel" ? "parallel" : "90 deg"}
              </text>
            </g>
          );
        }
        if (constraint.type === "midpoint") {
          const p = pointById(construction.points, constraint.point);
          return p ? (
            <circle
              key={constraint.id}
              cx={p.x}
              cy={p.y}
              r="15"
              fill="none"
              stroke="#10b981"
              strokeDasharray="5 5"
              strokeWidth="3"
            />
          ) : null;
        }
        if (constraint.type === "on-circle") {
          const p = pointById(construction.points, constraint.point);
          return p ? (
            <circle
              key={constraint.id}
              cx={p.x}
              cy={p.y}
              r="15"
              fill="none"
              stroke="#8b5cf6"
              strokeDasharray="5 5"
              strokeWidth="3"
            />
          ) : null;
        }
        return null;
      })}
    </g>
  );
}

function GeometryPendingPickPanel({
  tool,
  picks,
  construction,
  onClear,
}: {
  tool: GeometryTool;
  picks: SelectedGeometryObject[];
  construction: Construction;
  onClear: () => void;
}) {
  const hint = geometryToolObjectPickHint(tool, picks);
  if (!hint && picks.length === 0) return null;
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold">{hint ?? "Pending geometry picks"}</p>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full bg-white px-3 py-1 text-xs font-black text-cyan-900 dark:bg-slate-950 dark:text-cyan-100"
        >
          Clear
        </button>
      </div>
      {picks.length ? (
        <p className="mt-2 text-xs font-semibold">
          Picked:{" "}
          {picks
            .map((pick) => geometryObjectLabel(construction, pick))
            .join(", ")}
        </p>
      ) : null}
    </div>
  );
}

function HiddenGeometryExport({
  construction,
  images,
  refSetter,
  graphSettings,
}: {
  construction: Construction;
  images: WorkspaceImage[];
  refSetter: (node: SVGSVGElement | null) => void;
  graphSettings: GeometryGraphSettings;
}) {
  return (
    <svg
      ref={refSetter}
      viewBox="0 0 640 420"
      className="hidden"
      aria-hidden="true"
    >
      <rect width="640" height="420" fill="#ffffff" />
      <GeometryGrid settings={graphSettings} />
      {images
        .filter((image) => image.visible !== false)
        .map((image) => (
          <image
            key={image.id}
            href={image.src}
            x={image.x}
            y={image.y}
            width={image.width}
            height={image.height}
            opacity={image.opacity}
            preserveAspectRatio="xMidYMid meet"
          />
        ))}
      <ConstraintOverlays construction={construction} />
      {construction.loci.map((locus) => (
        <GeometryLocus key={locus.id} locus={locus} />
      ))}
      {construction.polygons.map((polygon) => (
        <GeometryPolygon
          key={polygon.id}
          polygon={polygon}
          points={construction.points}
        />
      ))}
      {construction.arcs.map((arc) => (
        <GeometryArc key={arc.id} arc={arc} points={construction.points} />
      ))}
      {construction.lines.map((line) => (
        <GeometryLine key={line.id} line={line} points={construction.points} />
      ))}
      {construction.circles.map((circle) => (
        <GeometryCircle
          key={circle.id}
          circle={circle}
          points={construction.points}
        />
      ))}
      {graphSettings.showMeasurements && (
        <GeometryMeasurementOverlays construction={construction} />
      )}
      {construction.points
        .filter((point) => point.style?.visible !== false)
        .map((point) => (
          <g key={point.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={point.style?.size ?? 9}
              fill={point.style?.color ?? "#06b6d4"}
              stroke="#0f172a"
              strokeWidth="2"
            />
            {graphSettings.showPointLabels &&
              point.style?.labelMode !== "hidden" && (
                <text
                  x={point.x + 12}
                  y={point.y - 10}
                  fill="#0f172a"
                  fontSize="12"
                  fontWeight="700"
                >
                  {pointLabelText(point)}
                </text>
              )}
          </g>
        ))}
    </svg>
  );
}

function isSelectedGeometry(
  selected: SelectedGeometryObject | null,
  type: GeometryObjectType,
  id: string,
) {
  return selected?.type === type && selected.id === id;
}

function pointById(points: GeoPoint[], id: string) {
  return points.find((point) => point.id === id);
}

function pointLabelText(point: GeoPoint) {
  if (point.style?.labelMode === "value")
    return `(${roundTo(point.x, 0)}, ${roundTo(point.y, 0)})`;
  if (point.style?.labelMode === "both")
    return `${point.label} (${roundTo(point.x, 0)}, ${roundTo(point.y, 0)})`;
  return point.label;
}

function geometryObjectLabel(
  construction: Construction,
  object: SelectedGeometryObject,
) {
  if (object.type === "point")
    return pointById(construction.points, object.id)?.label ?? "?";
  if (object.type === "line")
    return lineName(
      construction.lines.find((line) => line.id === object.id) ?? {
        id: object.id,
        a: "",
        b: "",
      },
      construction,
      0,
    );
  if (object.type === "circle")
    return circleName(
      construction.circles.find((circle) => circle.id === object.id) ?? {
        id: object.id,
        center: "",
        edge: "",
      },
      construction,
      0,
    );
  if (object.type === "polygon")
    return `Polygon ${Math.max(1, construction.polygons.findIndex((polygon) => polygon.id === object.id) + 1)}`;
  if (object.type === "arc") return "arc";
  return "locus";
}

function lineName(line: GeoLine, construction: Construction, index: number) {
  const a = pointById(construction.points, line.a);
  const b = pointById(construction.points, line.b);
  return a && b ? `${a.label}${b.label}` : `line ${index + 1}`;
}

function circleName(
  circle: GeoCircle,
  construction: Construction,
  index: number,
) {
  const center = pointById(construction.points, circle.center);
  return center ? `Circle ${center.label}` : `circle ${index + 1}`;
}

function linearDisplayEndpoints(a: GeoPoint, b: GeoPoint, kind: string) {
  if (kind === "segment" || kind === "vector")
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  const vector = normalize(b.x - a.x, b.y - a.y);
  if (kind === "ray")
    return {
      x1: a.x,
      y1: a.y,
      x2: a.x + vector.x * 900,
      y2: a.y + vector.y * 900,
    };
  return {
    x1: a.x - vector.x * 900,
    y1: a.y - vector.y * 900,
    x2: a.x + vector.x * 900,
    y2: a.y + vector.y * 900,
  };
}

function arrowHeadPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  size: number,
) {
  const vector = normalize(x2 - x1, y2 - y1);
  const normal = { x: -vector.y, y: vector.x };
  const base = { x: x2 - vector.x * size, y: y2 - vector.y * size };
  return [
    `${x2},${y2}`,
    `${base.x + normal.x * size * 0.46},${base.y + normal.y * size * 0.46}`,
    `${base.x - normal.x * size * 0.46},${base.y - normal.y * size * 0.46}`,
  ].join(" ");
}

function distance(
  a: GeoPoint | { x: number; y: number },
  b: GeoPoint | { x: number; y: number },
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function polygonArea(points: GeoPoint[]) {
  return Math.abs(
    points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0) / 2,
  );
}

function centroid(points: GeoPoint[]) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function normalize(x: number, y: number) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}
