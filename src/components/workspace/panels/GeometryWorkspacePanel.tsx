import {
  Box,
  Circle,
  Download,
  Eraser,
  LineChart,
  Magnet,
  MousePointer2,
  Move,
  Pentagon,
  Plus,
  RotateCcw,
  Save,
  Slash,
  Trash2,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import { type PointerEvent, type ReactNode, type RefObject } from "react";
import { roundTo } from "../../../utils/math";
import type { GeometryCertificationReport } from "../../../workspace/geometryConstructionCertification";

export type GeometryTool = "select" | "point" | "segment" | "ray" | "vector" | "line" | "circle" | "polygon" | "angle" | "parallel" | "perpendicular" | "midpoint" | "fixed-length" | "circle-radius" | "circle-3-points" | "on-circle" | "intersect" | "perpendicular-bisector" | "angle-bisector" | "tangent" | "polar" | "locus" | "regular-polygon" | "sector" | "arc" | "compass" | "mirror" | "rotate" | "dilate" | "translate" | "show-hide" | "lock" | "freehand" | "text" | "image" | "move-canvas" | "zoom" | "triangle" | "rectangle" | "shape-circle" | "parabola" | "ellipse" | "hyperbola" | "reflect" | "trace" | "stop-trace" | "clear-trace" | "delete" | "redo" | "reset" | "save" | "load";
export type GeoStyle = { color?: string; fill?: string; strokeWidth?: number; size?: number; visible?: boolean; trace?: boolean; label?: string; opacity?: number; labelMode?: "name" | "value" | "both" | "hidden" };
export type GeoPoint = { id: string; x: number; y: number; label: string; style?: GeoStyle };
export type GeoLine = { id: string; a: string; b: string; style?: GeoStyle };
export type GeoCircle = { id: string; center: string; edge: string; style?: GeoStyle };
export type GeoPolygon = { id: string; points: string[]; style?: GeoStyle };
export type GeoArc = { id: string; center: string; start: string; end: string; sector?: boolean; kind?: "arc" | "angle"; style?: GeoStyle };
export type GeoLocus = { id: string; label: string; points: { x: number; y: number }[]; style?: GeoStyle; sourcePointId?: string; mode?: "static" | "trace"; maxSamples?: number };
export type WorkspaceImage = { id: string; name: string; src: string; x: number; y: number; width: number; height: number; opacity: number; locked?: boolean; visible?: boolean };
export type GeoConstraint =
  | { id: string; type: "parallel" | "perpendicular"; sourceLine: string; throughPoint: string; line: string }
  | { id: string; type: "midpoint"; a: string; b: string; point: string }
  | { id: string; type: "fixed-length"; anchor: string; point: string; length: number }
  | { id: string; type: "on-circle"; point: string; circle: string }
  | { id: string; type: "intersection"; first: string; second: string; point: string; firstType?: "line" | "circle"; secondType?: "line" | "circle"; index?: number };
export type Construction = { points: GeoPoint[]; lines: GeoLine[]; circles: GeoCircle[]; polygons: GeoPolygon[]; arcs: GeoArc[]; loci: GeoLocus[]; constraints: GeoConstraint[] };
export type GeometryObjectType = "point" | "line" | "circle" | "polygon" | "arc" | "locus";
export type SelectedGeometryObject = { type: GeometryObjectType; id: string };
export type GeometryGraphSettings = {
  showGrid: boolean;
  showAxes: boolean;
  showUnitLabels: boolean;
  showPointLabels: boolean;
  showMeasurements: boolean;
  highContrastGrid: boolean;
  snapToGrid: boolean;
  snapToObjects: boolean;
};

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
  boardRef: RefObject<SVGSVGElement>;
  imageInputRef: RefObject<HTMLInputElement>;
  sidebar: ReactNode;
  onImageUpload: (fileList: FileList | null) => void;
  onToolChange: (tool: GeometryTool) => void;
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
  onGraphSettingsChange: (settings: GeometryGraphSettings) => void;
  onClearPendingPicks: () => void;
  onBoardPointerDown: (event: PointerEvent<SVGSVGElement>) => void;
  onBoardPointerMove: (event: PointerEvent<SVGSVGElement>) => void;
  onBoardPointerUp: (event: PointerEvent<SVGSVGElement>) => void;
  onBoardPointerLeave: () => void;
  onBoardContextMenu: (event: PointerEvent<SVGSVGElement>) => void;
  onGeometryExportRef: (node: SVGSVGElement | null) => void;
}

type GeometryPaletteToolItem = { id: GeometryTool; label: string; icon: LucideIcon };
type GeometryPaletteActionItem = { id: string; label: string; icon: LucideIcon; action: () => void; danger?: boolean };

const geometryPaletteGroups: Array<{ title: string; tools: GeometryPaletteToolItem[] }> = [
  { title: "Basic Tools", tools: [
    { id: "select", label: "Move", icon: MousePointer2 },
    { id: "point", label: "Point", icon: Plus },
    { id: "segment", label: "Segment", icon: Move },
    { id: "line", label: "Line", icon: Slash },
    { id: "ray", label: "Ray", icon: LineChart },
    { id: "vector", label: "Vector", icon: Move },
    { id: "circle", label: "Circle", icon: Circle },
    { id: "polygon", label: "Polygon", icon: Pentagon },
    { id: "angle", label: "Angle", icon: Circle },
  ] },
  { title: "Edit", tools: [
    { id: "freehand", label: "Freehand", icon: Slash },
    { id: "text", label: "Text", icon: Slash },
    { id: "image", label: "Image", icon: Box },
    { id: "move-canvas", label: "Move Canvas", icon: Move },
    { id: "zoom", label: "Zoom", icon: ZoomIn },
  ] },
  { title: "Construct", tools: [
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
  ] },
  { title: "Shapes", tools: [
    { id: "triangle", label: "Triangle", icon: Pentagon },
    { id: "rectangle", label: "Rectangle", icon: Box },
    { id: "shape-circle", label: "Circle Shape", icon: Circle },
    { id: "parabola", label: "Parabola", icon: LineChart },
    { id: "ellipse", label: "Ellipse", icon: Circle },
    { id: "hyperbola", label: "Hyperbola", icon: LineChart },
  ] },
  { title: "Curves", tools: [
    { id: "tangent", label: "Tangent", icon: Circle },
    { id: "polar", label: "Polar", icon: Move },
    { id: "locus", label: "Locus", icon: LineChart },
    { id: "regular-polygon", label: "Regular Polygon", icon: Pentagon },
    { id: "arc", label: "Arc", icon: Circle },
    { id: "sector", label: "Sector", icon: Circle },
    { id: "compass", label: "Compass", icon: Magnet },
  ] },
  { title: "Transform", tools: [
    { id: "mirror", label: "Mirror", icon: Slash },
    { id: "rotate", label: "Rotate 45", icon: RotateCcw },
    { id: "dilate", label: "Dilate 1.5x", icon: ZoomIn },
    { id: "translate", label: "Translate", icon: Move },
  ] },
];

export function geometryToolLabel(tool: GeometryTool) {
  return geometryPaletteGroups.flatMap((group) => group.tools).find((item) => item.id === tool)?.label ?? tool.replace(/-/g, " ");
}

export function geometryToolObjectPickHint(tool: GeometryTool, picks: SelectedGeometryObject[]) {
  if (tool === "select") return null;
  if (tool === "angle") return "Click three points in order: side point, vertex, side point. The vertex must be the second point.";
  if (tool === "intersect") return picks.length === 0 ? "Pick two existing lines/circles, or tap a point to add all intersections." : "Pick one more line or circle.";
  if (tool === "parallel" || tool === "perpendicular") return picks.length === 0 ? "Pick an existing line, then pick the through-point." : "Pick the through-point.";
  if (tool === "on-circle") return picks.length === 0 ? "Pick a circle, then pick the point to constrain." : "Pick the point to snap onto the circle.";
  if (tool === "tangent" || tool === "polar") return picks.length === 0 ? `Pick a circle, then pick the point for ${tool}.` : `Pick the point for ${tool}.`;
  return null;
}

export default function GeometryWorkspacePanel({
  activeTool,
  construction,
  selectedGeometry,
  selectedPointIds,
  polygonDraft,
  geometryObjectPicks,
  constructionAccuracyReport,
  workspaceImages,
  selectedImageId,
  graphSettings,
  boardRef,
  imageInputRef,
  sidebar,
  onImageUpload,
  onToolChange,
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
  onGraphSettingsChange,
  onClearPendingPicks,
  onBoardPointerDown,
  onBoardPointerMove,
  onBoardPointerUp,
  onBoardPointerLeave,
  onBoardContextMenu,
  onGeometryExportRef,
}: GeometryWorkspacePanelProps) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid min-h-0 gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
        <div className="min-h-0">
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => onImageUpload(event.target.files)} />
          <GeometryToolPalette
            activeTool={activeTool}
            onTool={onToolChange}
            onSelectAll={onSelectAll}
            onMoveSelected={onMoveSelected}
            onRotateSelected={onRotateSelected}
            onDilateSelected={onDilateSelected}
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
        </div>
        <div className="min-w-0 space-y-3">
          <GeometryGraphSettingsBar settings={graphSettings} onChange={onGraphSettingsChange} />
          <GeometryPendingPickPanel tool={activeTool} picks={geometryObjectPicks} construction={construction} onClear={onClearPendingPicks} />
          <GeometryAccuracyStrip report={constructionAccuracyReport} selectedGeometry={selectedGeometry} />
          <GeometryBoard
            boardRef={boardRef}
            construction={construction}
            workspaceImages={workspaceImages}
            selectedImageId={selectedImageId}
            selectedGeometry={selectedGeometry}
            selectedPointIds={selectedPointIds}
            polygonDraft={polygonDraft}
            activeTool={activeTool}
            graphSettings={graphSettings}
            onPointerDown={onBoardPointerDown}
            onPointerMove={onBoardPointerMove}
            onPointerUp={onBoardPointerUp}
            onPointerLeave={onBoardPointerLeave}
            onContextMenu={onBoardContextMenu}
          />
          <p className="rounded-2xl bg-cyan-50 p-3 text-xs font-semibold leading-5 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
            Touch mode: choose a tool, tap to place points, then drag existing points. Keyboard mode: select a point, use arrow keys to nudge it, hold Shift for larger steps, and press Escape to clear selection.
          </p>
          <HiddenGeometryExport refSetter={onGeometryExportRef} construction={construction} images={workspaceImages} graphSettings={graphSettings} />
        </div>
      </div>
      <div className="space-y-3 lg:sticky lg:top-24">{sidebar}</div>
    </div>
  );
}

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
  const testId = `workspace-geometry-tool-${item.id}`;
  return (
    <button type="button" data-testid={testId} onClick={onClick} title={item.label} className={`geometry-palette-button ${active ? "geometry-palette-button-active" : ""}`}>
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

function GeometryGraphSettingsBar({ settings, onChange }: { settings: GeometryGraphSettings; onChange: (settings: GeometryGraphSettings) => void }) {
  const toggle = (key: keyof GeometryGraphSettings) => onChange({ ...settings, [key]: !settings[key] });
  const items: Array<{ key: keyof GeometryGraphSettings; label: string }> = [
    { key: "showGrid", label: "Grid" },
    { key: "showAxes", label: "Axes" },
    { key: "showUnitLabels", label: "Numbers" },
    { key: "showPointLabels", label: "Labels" },
    { key: "showMeasurements", label: "Measures" },
    { key: "snapToGrid", label: "Grid snap" },
    { key: "snapToObjects", label: "Object snap" },
    { key: "highContrastGrid", label: "Contrast" },
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/85 p-2 dark:border-white/10 dark:bg-white/5" data-testid="workspace-geometry-graph-settings">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">Graph Settings</p>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">1 unit = 40 grid pixels, origin at board center</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => toggle(item.key)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-black transition ${settings[item.key] ? "border-cyan-300 bg-cyan-500 text-white shadow-sm shadow-cyan-500/20" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-cyan-400/10"}`}
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
  graphSettings,
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
  graphSettings: GeometryGraphSettings;
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
      viewBox="0 0 640 420"
      role="application"
      tabIndex={0}
      aria-label="Geometry constructor. Select a point and use arrow keys to nudge it. Press Escape to return to select mode."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onContextMenu={onContextMenu}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      className="h-[min(420px,68vh)] min-h-[320px] w-full touch-none rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 sm:h-[420px]"
    >
      <title>Math Universe Geometry Construction</title>
      <GeometryGrid settings={graphSettings} />
      {workspaceImages.filter((image) => image.visible !== false).map((image) => (
        <g key={image.id}>
          <image data-image-id={image.id} href={image.src} x={image.x} y={image.y} width={image.width} height={image.height} opacity={image.opacity} preserveAspectRatio="xMidYMid meet" className="cursor-move" />
          {selectedImageId === image.id && <rect x={image.x} y={image.y} width={image.width} height={image.height} fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="8 6" pointerEvents="none" />}
        </g>
      ))}
      <ConstraintOverlays construction={construction} />
      {construction.loci.map((locus) => <GeometryLocus key={locus.id} locus={locus} />)}
      {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "polygon", polygon.id)} />)}
      {construction.arcs.map((arc) => <GeometryArc key={arc.id} arc={arc} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "arc", arc.id)} />)}
      {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "line", line.id)} />)}
      {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} selected={isSelectedGeometry(selectedGeometry, "circle", circle.id)} />)}
      {graphSettings.showMeasurements && <GeometryMeasurementOverlays construction={construction} />}
      {activeTool === "angle" && <AngleToolPreview selectedPointIds={selectedPointIds} points={construction.points} />}
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
          {graphSettings.showPointLabels && point.style?.labelMode !== "hidden" && <text x={point.x + 12} y={point.y - 10} fill="#0f172a" className="select-none text-xs font-bold dark:fill-slate-100">{pointLabelText(point)}</text>}
        </g>
      ))}
    </svg>
  );
}

function GeometryAccuracyStrip({ report, selectedGeometry }: { report: GeometryCertificationReport; selectedGeometry: SelectedGeometryObject | null }) {
  const failed = report.checks.filter((check) => check.severity === "fail").length;
  const warned = report.checks.filter((check) => check.severity === "warn").length;
  const status = failed ? "fail" : warned ? "warn" : "pass";
  const statusStyle = status === "pass"
    ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-50"
    : status === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-50"
      : "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-50";
  const importantChecks = report.checks.filter((check) => check.severity !== "pass").slice(0, 2);
  const displayedChecks = importantChecks.length ? importantChecks : report.checks.slice(0, 2);
  return (
    <section className={`rounded-2xl border px-3 py-2 ${statusStyle}`} data-testid="workspace-geometry-accuracy" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black">Construction Accuracy</p>
          <p className="text-xs font-semibold opacity-85">{report.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-slate-900 dark:bg-slate-950/50 dark:text-white">{report.score}%</span>
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-slate-900 dark:bg-slate-950/50 dark:text-white">max residual {formatResidual(report.maxResidual)}</span>
          {selectedGeometry ? <span className="rounded-full bg-white/70 px-2.5 py-1 text-slate-900 dark:bg-slate-950/50 dark:text-white">selected {selectedGeometry.type}</span> : null}
        </div>
      </div>
      <div className="mt-2 grid gap-1.5 md:grid-cols-2">
        {displayedChecks.map((check) => (
          <p key={check.id} className="rounded-xl bg-white/55 px-2 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-950/35 dark:text-slate-100">
            <span className="font-black uppercase">{check.severity}</span> · {check.label}
          </p>
        ))}
      </div>
    </section>
  );
}

function GeometryGrid({ settings }: { settings: GeometryGraphSettings }) {
  const width = 640;
  const height = 420;
  const unit = 40;
  const origin = { x: 320, y: 220 };
  const verticals = Array.from({ length: 17 }, (_, i) => i * unit);
  const horizontals = Array.from({ length: 12 }, (_, i) => i * unit);
  const gridStroke = settings.highContrastGrid ? "rgba(14,165,233,.38)" : "rgba(148,163,184,.2)";
  const axisStroke = settings.highContrastGrid ? "#0891b2" : "#0f172a";
  return (
    <g>
      {settings.showGrid && verticals.map((x) => <line key={`gv-${x}`} x1={x} x2={x} y1="0" y2={height} stroke={gridStroke} strokeWidth={settings.highContrastGrid ? 1.4 : 1} />)}
      {settings.showGrid && horizontals.map((y) => <line key={`gh-${y}`} x1="0" x2={width} y1={y} y2={y} stroke={gridStroke} strokeWidth={settings.highContrastGrid ? 1.4 : 1} />)}
      {(settings.showAxes || settings.showUnitLabels) && (
        <g className="select-none">
          {settings.showAxes && <line x1={0} x2={width} y1={origin.y} y2={origin.y} stroke={axisStroke} strokeWidth={settings.highContrastGrid ? 2.4 : 1.8} opacity={settings.highContrastGrid ? 0.85 : 0.45} />}
          {settings.showAxes && <line x1={origin.x} x2={origin.x} y1={0} y2={height} stroke={axisStroke} strokeWidth={settings.highContrastGrid ? 2.4 : 1.8} opacity={settings.highContrastGrid ? 0.85 : 0.45} />}
          {settings.showUnitLabels && verticals.map((x) => {
            const value = Math.round((x - origin.x) / unit);
            if (value === 0 || x < 20 || x > width - 20) return null;
            return <text key={`x-unit-${x}`} x={x} y={origin.y + 18} textAnchor="middle" fill="#334155" fontSize="10" fontWeight="800">{value}</text>;
          })}
          {settings.showUnitLabels && horizontals.map((y) => {
            const value = Math.round((origin.y - y) / unit);
            if (value === 0 || y < 20 || y > height - 20) return null;
            return <text key={`y-unit-${y}`} x={origin.x - 10} y={y + 4} textAnchor="end" fill="#334155" fontSize="10" fontWeight="800">{value}</text>;
          })}
          {settings.showUnitLabels && <text x={origin.x + 7} y={origin.y + 16} fill="#0f172a" fontSize="10" fontWeight="900">0</text>}
          {settings.showAxes && <text x={width - 18} y={origin.y - 8} fill="#0f172a" fontSize="10" fontWeight="900">x</text>}
          {settings.showAxes && <text x={origin.x + 8} y={18} fill="#0f172a" fontSize="10" fontWeight="900">y</text>}
        </g>
      )}
    </g>
  );
}

function GeometryLine({ line, points, selected = false }: { line: GeoLine; points: GeoPoint[]; selected?: boolean }) {
  const a = pointById(points, line.a), b = pointById(points, line.b);
  if (!a || !b || line.style?.visible === false) return null;
  const kind = line.style?.label ?? "line";
  const color = line.style?.color ?? "#8b5cf6";
  const endpoints = linearDisplayEndpoints(a, b, kind);
  const arrow = kind === "ray" || kind === "vector" ? arrowHeadPoints(endpoints.x1, endpoints.y1, endpoints.x2, endpoints.y2, kind === "vector" ? 14 : 11) : null;
  return (
    <g>
      <line data-object-type="line" data-object-id={line.id} x1={endpoints.x1} y1={endpoints.y1} x2={endpoints.x2} y2={endpoints.y2} stroke={color} strokeWidth={selected ? Math.max(7, line.style?.strokeWidth ?? 4) : line.style?.strokeWidth ?? 4} strokeDasharray={kind === "line" ? "10 8" : undefined} opacity={selected ? 0.95 : line.style?.opacity ?? 1} className="cursor-move" />
      {arrow && <polygon points={arrow} fill={color} opacity={selected ? 0.95 : line.style?.opacity ?? 1} pointerEvents="none" />}
      {kind !== "line" && <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 8} fill={color} className="pointer-events-none select-none text-[10px] font-black uppercase">{kind}</text>}
    </g>
  );
}

function GeometryCircle({ circle, points, selected = false }: { circle: GeoCircle; points: GeoPoint[]; selected?: boolean }) {
  const center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!center || !edge || circle.style?.visible === false) return null;
  const radius = distance(center, edge);
  return <circle data-object-type="circle" data-object-id={circle.id} cx={center.x} cy={center.y} r={radius} fill={circle.style?.fill ?? "rgba(34,211,238,.12)"} stroke={circle.style?.color ?? "#06b6d4"} strokeWidth={selected ? Math.max(7, circle.style?.strokeWidth ?? 4) : circle.style?.strokeWidth ?? 4} opacity={circle.style?.opacity ?? 1} className="cursor-move" />;
}

function GeometryPolygon({ polygon, points, selected = false }: { polygon: GeoPolygon; points: GeoPoint[]; selected?: boolean }) {
  const polygonPoints = polygon.points.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (polygonPoints.length < 3 || polygon.style?.visible === false) return null;
  const value = polygonPoints.map((point) => `${point.x},${point.y}`).join(" ");
  return <polygon data-object-type="polygon" data-object-id={polygon.id} points={value} fill={polygon.style?.fill ?? "rgba(245,158,11,.15)"} stroke={polygon.style?.color ?? "#f59e0b"} strokeWidth={selected ? Math.max(7, polygon.style?.strokeWidth ?? 3) : polygon.style?.strokeWidth ?? 3} opacity={polygon.style?.opacity ?? 1} className="cursor-move" />;
}

function GeometryArc({ arc, points, selected = false }: { arc: GeoArc; points: GeoPoint[]; selected?: boolean }) {
  const center = pointById(points, arc.center), start = pointById(points, arc.start), end = pointById(points, arc.end);
  if (!center || !start || !end || arc.style?.visible === false) return null;
  const radius = distance(center, start);
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
  const largeArc = ((endAngle - startAngle + Math.PI * 2) % (Math.PI * 2)) > Math.PI ? 1 : 0;
  const path = `M ${center.x} ${center.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}${arc.sector ? " Z" : ""}`;
  return <path data-object-type="arc" data-object-id={arc.id} d={path} fill={arc.sector ? arc.style?.fill ?? "rgba(245,158,11,.16)" : "none"} stroke={arc.style?.color ?? "#14b8a6"} strokeWidth={selected ? 6 : arc.style?.strokeWidth ?? 4} opacity={arc.style?.opacity ?? 1} className="cursor-move" />;
}

function GeometryLocus({ locus }: { locus: GeoLocus }) {
  if (locus.style?.visible === false || locus.points.length < 2) return null;
  const d = locus.points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  return <path data-object-type="locus" data-object-id={locus.id} d={d} fill="none" stroke={locus.style?.color ?? "#ec4899"} strokeWidth={locus.style?.strokeWidth ?? 4} opacity={locus.style?.opacity ?? 0.8} strokeLinecap="round" strokeLinejoin="round" />;
}

function PolygonDraftPreview({ draft, points }: { draft: string[]; points: GeoPoint[] }) {
  const draftPoints = draft.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (draftPoints.length < 2) return null;
  return <polyline points={draftPoints.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6" pointerEvents="none" />;
}

function AngleToolPreview({ selectedPointIds, points }: { selectedPointIds: string[]; points: GeoPoint[] }) {
  const selected = selectedPointIds.map((id) => pointById(points, id)).filter(Boolean) as GeoPoint[];
  if (selected.length < 2) return null;
  const [start, vertex, end] = selected;
  return (
    <g pointerEvents="none">
      {start && vertex && <line x1={vertex.x} y1={vertex.y} x2={start.x} y2={start.y} stroke="#f97316" strokeWidth="3" strokeDasharray="8 6" />}
      {end && vertex && <line x1={vertex.x} y1={vertex.y} x2={end.x} y2={end.y} stroke="#f97316" strokeWidth="3" strokeDasharray="8 6" />}
      {selected.length === 2 && <circle cx={vertex.x} cy={vertex.y} r="34" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="5 5" />}
    </g>
  );
}

function GeometryMeasurementOverlays({ construction }: { construction: Construction }) {
  const labels = [
    ...construction.lines.map((line) => {
      const a = pointById(construction.points, line.a), b = pointById(construction.points, line.b);
      if (!a || !b || line.style?.visible === false) return null;
      return { id: `line-${line.id}`, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 12, text: `${roundTo(distance(a, b) / 40, 2)}` };
    }),
    ...construction.circles.map((circle) => {
      const center = pointById(construction.points, circle.center), edge = pointById(construction.points, circle.edge);
      if (!center || !edge || circle.style?.visible === false) return null;
      return { id: `circle-${circle.id}`, x: center.x + distance(center, edge) / Math.SQRT2, y: center.y - distance(center, edge) / Math.SQRT2, text: `r=${roundTo(distance(center, edge) / 40, 2)}` };
    }),
    ...construction.polygons.map((polygon) => {
      const polygonPoints = polygon.points.map((id) => pointById(construction.points, id)).filter(Boolean) as GeoPoint[];
      if (polygonPoints.length < 3 || polygon.style?.visible === false) return null;
      const center = centroid(polygonPoints);
      return { id: `polygon-${polygon.id}`, x: center.x, y: center.y, text: `A=${roundTo(polygonArea(polygonPoints) / 1600, 2)}` };
    }),
  ].filter((label): label is { id: string; x: number; y: number; text: string } => Boolean(label));
  return (
    <g pointerEvents="none" data-testid="workspace-geometry-measurements">
      {labels.map((label) => (
        <g key={label.id}>
          <rect x={label.x - 6} y={label.y - 15} width={Math.max(42, label.text.length * 7 + 12)} height="20" rx="6" fill="rgba(255,255,255,.86)" stroke="rgba(6,182,212,.36)" />
          <text x={label.x} y={label.y} fill="#0f172a" fontSize="11" fontWeight="900">{label.text}</text>
        </g>
      ))}
    </g>
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
        return null;
      })}
    </g>
  );
}

function GeometryPendingPickPanel({ tool, picks, construction, onClear }: { tool: GeometryTool; picks: SelectedGeometryObject[]; construction: Construction; onClear: () => void }) {
  const hint = geometryToolObjectPickHint(tool, picks);
  if (!hint && picks.length === 0) return null;
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold">{hint ?? "Pending geometry picks"}</p>
        <button type="button" onClick={onClear} className="rounded-full bg-white px-3 py-1 text-xs font-black text-cyan-900 dark:bg-slate-950 dark:text-cyan-100">Clear</button>
      </div>
      {picks.length ? <p className="mt-2 text-xs font-semibold">Picked: {picks.map((pick) => geometryObjectLabel(construction, pick)).join(", ")}</p> : null}
    </div>
  );
}

function HiddenGeometryExport({ construction, images, refSetter, graphSettings }: { construction: Construction; images: WorkspaceImage[]; refSetter: (node: SVGSVGElement | null) => void; graphSettings: GeometryGraphSettings }) {
  return (
    <svg ref={refSetter} viewBox="0 0 640 420" className="hidden" aria-hidden="true">
      <rect width="640" height="420" fill="#ffffff" />
      <GeometryGrid settings={graphSettings} />
      {images.filter((image) => image.visible !== false).map((image) => <image key={image.id} href={image.src} x={image.x} y={image.y} width={image.width} height={image.height} opacity={image.opacity} preserveAspectRatio="xMidYMid meet" />)}
      <ConstraintOverlays construction={construction} />
      {construction.loci.map((locus) => <GeometryLocus key={locus.id} locus={locus} />)}
      {construction.polygons.map((polygon) => <GeometryPolygon key={polygon.id} polygon={polygon} points={construction.points} />)}
      {construction.arcs.map((arc) => <GeometryArc key={arc.id} arc={arc} points={construction.points} />)}
      {construction.lines.map((line) => <GeometryLine key={line.id} line={line} points={construction.points} />)}
      {construction.circles.map((circle) => <GeometryCircle key={circle.id} circle={circle} points={construction.points} />)}
      {graphSettings.showMeasurements && <GeometryMeasurementOverlays construction={construction} />}
      {construction.points.filter((point) => point.style?.visible !== false).map((point) => (
        <g key={point.id}>
          <circle cx={point.x} cy={point.y} r={point.style?.size ?? 9} fill={point.style?.color ?? "#06b6d4"} stroke="#0f172a" strokeWidth="2" />
          {graphSettings.showPointLabels && point.style?.labelMode !== "hidden" && <text x={point.x + 12} y={point.y - 10} fill="#0f172a" fontSize="12" fontWeight="700">{pointLabelText(point)}</text>}
        </g>
      ))}
    </svg>
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

function geometryObjectLabel(construction: Construction, object: SelectedGeometryObject) {
  if (object.type === "point") return pointById(construction.points, object.id)?.label ?? "?";
  if (object.type === "line") return lineName(construction.lines.find((line) => line.id === object.id) ?? { id: object.id, a: "", b: "" }, construction, 0);
  if (object.type === "circle") return circleName(construction.circles.find((circle) => circle.id === object.id) ?? { id: object.id, center: "", edge: "" }, construction, 0);
  if (object.type === "polygon") return `Polygon ${Math.max(1, construction.polygons.findIndex((polygon) => polygon.id === object.id) + 1)}`;
  if (object.type === "arc") return "arc";
  return "locus";
}

function lineName(line: GeoLine, construction: Construction, index: number) {
  const a = pointById(construction.points, line.a);
  const b = pointById(construction.points, line.b);
  return a && b ? `${a.label}${b.label}` : `line ${index + 1}`;
}

function circleName(circle: GeoCircle, construction: Construction, index: number) {
  const center = pointById(construction.points, circle.center);
  return center ? `Circle ${center.label}` : `circle ${index + 1}`;
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
  return [`${x2},${y2}`, `${base.x + normal.x * size * 0.46},${base.y + normal.y * size * 0.46}`, `${base.x - normal.x * size * 0.46},${base.y - normal.y * size * 0.46}`].join(" ");
}

function distance(a: GeoPoint | { x: number; y: number }, b: GeoPoint | { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function polygonArea(points: GeoPoint[]) {
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0) / 2);
}

function centroid(points: GeoPoint[]) {
  return { x: points.reduce((sum, point) => sum + point.x, 0) / points.length, y: points.reduce((sum, point) => sum + point.y, 0) / points.length };
}

function normalize(x: number, y: number) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function formatResidual(value: number) {
  if (!Number.isFinite(value)) return "unbounded";
  if (value === 0) return "0";
  if (Math.abs(value) < 0.000001) return value.toExponential(1);
  return String(roundTo(value, 4));
}
