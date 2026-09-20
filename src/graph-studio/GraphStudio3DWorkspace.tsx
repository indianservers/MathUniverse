import {
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  Crosshair,
  Download,
  Eye,
  EyeOff,
  FileJson,
  FilePlus2,
  FolderOpen,
  Focus,
  Fullscreen,
  Grid3X3,
  Layers3,
  Maximize2,
  Menu,
  MonitorPlay,
  Pause,
  Play,
  PanelLeftClose,
  PanelRightClose,
  Pencil,
  Plus,
  Redo2,
  Repeat2,
  RotateCcw,
  Save,
  Settings,
  Sigma,
  SlidersHorizontal,
  Trash2,
  Undo2,
  Video,
  MoreHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import MathExpression from "../components/ui/MathExpression";
import {
  SURFACE_TEMPLATES,
  expressionToLatex,
  suggestExpressionFix,
  type CameraBookmark,
  type Graph3DAnnotation,
  type ReadGraphChecklist,
} from "./graph3dEnhancements";
import type { SurfaceSampleResult } from "../utils/mathEngine/graph3dUtils";
import type { GraphStudioStylePreset, GraphStudioVariable } from "./types";
import WorkspaceChromeThemeToggle from "../components/workspace/WorkspaceChromeThemeToggle";
import {
  CHROME_THEME_STORAGE_KEYS,
  readWorkspaceChromeTheme,
  type WorkspaceChromeTheme,
} from "../workspace/workspaceChromeTheme";
import {
  ContextInspector,
  MobileWorkspaceShell,
  WorkspaceBottomSheet,
  WorkspaceToolbar,
  useMobileWorkspaceGestures,
  useWorkspaceOverlay,
  useOutsideDismiss,
  guardCanvasPointer,
} from "../workspace/mobile";
import { useCanvasZoomLock } from "../hooks/useCanvasZoomLock";
import type { SurfaceDifferential } from "./graphIntelligence";
import type { Graph3DCriticalPoint } from "./graph3dAdvanced";
import type {
  Graph3DKeyframe,
  Graph3DLayerKind,
  Graph3DSurface,
} from "./graph3dSurfaceModel";
import {
  GRAPH_3D_THEMES,
  graph3DThemeGradient,
  getGraph3DTheme,
  type Graph3DThemeId,
} from "./graph3dThemes";

export type Studio3DInspectorTab = "properties" | "analysis" | "style";
export type Studio3DTool = "select" | "point" | "slice" | "annotate";

type Position = { x: number; y: number; z: number };

export type GraphStudio3DWorkspaceProps = {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onNewProject: () => void;
  onDuplicateProject: () => void;
  onOpenProject: (raw: string) => void;
  importError?: string | null;
  onExportProject: () => void;
  onExportCsv: () => void;
  onExportMesh: (format: "stl" | "obj") => void;
  onExportVideo: () => void;
  recording?: boolean;
  onCopyEquation: () => void;
  onOpenCas: () => void;
  onOpenGeometry: () => void;
  onPlotCasExpression: (expression: string) => void;
  onApplyTemplate: (id: string) => void;
  surfaces: Graph3DSurface[];
  selectedSurfaceId: string;
  onSelectedSurfaceChange: (surfaceId: string) => void;
  onSurfaceChange: (surfaceId: string, patch: Partial<Graph3DSurface>) => void;
  onAddExpression: () => void;
  onAddLayer: (kind: Graph3DLayerKind) => void;
  onDuplicateExpression: (surfaceId: string) => void;
  onDeleteExpression: (surfaceId: string) => void;
  onSetAllVisibility: (visible: boolean) => void;
  surfaceErrors: Record<string, string | undefined>;
  examples: string[];
  onExample: (expression: string) => void;
  onRandomExample: () => void;
  variables: GraphStudioVariable[];
  onVariablesChange: (variables: GraphStudioVariable[]) => void;
  tool: Studio3DTool;
  onToolChange: (tool: Studio3DTool) => void;
  scene: ReactNode;
  crossSectionPreview?: ReactNode;
  onCameraView: (position: [number, number, number]) => void;
  onResetCamera: () => void;
  surface: SurfaceSampleResult;
  sampleRows: Array<{ x: number; y: number; z: number | null; valid: boolean }>;
  differential: SurfaceDifferential | null;
  analysisPoint: { x: number; y: number };
  onAnalysisPointChange: (point: { x: number; y: number }) => void;
  onExactPartial: (variable: "x" | "y") => void;
  exactPartial: string | null;
  onUsePartialSurface: () => void;
  criticalPoints: Graph3DCriticalPoint[];
  volumeAnalysis: {
    signed: number;
    absolute: number;
    samples: number;
    error?: string;
  } | null;
  xRange: number;
  yRange: number;
  resolution: number;
  objectPosition: Position;
  referenceObject: "none" | "helix" | "sphere" | "cone" | "cylinder";
  onXRangeChange: (value: number) => void;
  onYRangeChange: (value: number) => void;
  onResolutionChange: (value: number) => void;
  onObjectPositionChange: (value: Position) => void;
  onReferenceObjectChange: (
    value: "none" | "helix" | "sphere" | "cone" | "cylinder",
  ) => void;
  showGrid: boolean;
  showAxes: boolean;
  showInfiniteAxes: boolean;
  showLabels: boolean;
  showBase: boolean;
  autoRotate: boolean;
  sliceEnabled: boolean;
  sliceAxis: "x" | "y" | "z";
  sliceValue: number;
  onShowGridChange: (value: boolean) => void;
  onShowAxesChange: (value: boolean) => void;
  onShowInfiniteAxesChange: (value: boolean) => void;
  onShowLabelsChange: (value: boolean) => void;
  onShowBaseChange: (value: boolean) => void;
  onAutoRotateChange: (value: boolean) => void;
  onSliceEnabledChange: (value: boolean) => void;
  onSliceAxisChange: (value: "x" | "y" | "z") => void;
  onSliceValueChange: (value: number) => void;
  stylePreset: GraphStudioStylePreset;
  onStylePresetChange: (value: GraphStudioStylePreset) => void;
  graphThemeId: Graph3DThemeId;
  onGraphThemeChange: (value: Graph3DThemeId) => void;
  keyframes: Graph3DKeyframe[];
  keyframesPlaying: boolean;
  onAddKeyframe: () => void;
  onDeleteKeyframe: (id: string) => void;
  onPlayKeyframes: () => void;
  savedLibrary: ReactNode;
  shareControl?: ReactNode;
  presentationMode: boolean;
  onPresentationModeChange: (value: boolean) => void;
  flyMode: boolean;
  onFlyModeChange: (value: boolean) => void;
  clipEnabled: boolean;
  clipAxis: "x" | "y" | "z";
  clipValue: number;
  onClipEnabledChange: (value: boolean) => void;
  onClipAxisChange: (value: "x" | "y" | "z") => void;
  onClipValueChange: (value: number) => void;
  bookmarks: CameraBookmark[];
  onAddBookmark: () => void;
  onOpenBookmark: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
  annotations: Graph3DAnnotation[];
  onClearAnnotations: () => void;
  checklist: ReadGraphChecklist;
  onChecklistChange: (patch: Partial<ReadGraphChecklist>) => void;
  challengeOpen: boolean;
  onChallengeOpenChange: (value: boolean) => void;
  challengeMessage: string;
  onChallengeGuess: (point: { x: number; y: number }) => void;
  surfaceArea?: { area: number; error?: string } | null;
  arcLength?: number | null;
  vectorCalculus?: {
    divergence: number;
    curl: { x: number; y: number; z: number };
  } | null;
  intersectionCount?: number;
};

export default function GraphStudio3DWorkspace(
  props: GraphStudio3DWorkspaceProps,
) {
  const { onRedo, onSave, onUndo } = props;
  const [inspectorTab, setInspectorTab] =
    useState<Studio3DInspectorTab>("analysis");
  const [leftOpen, setLeftOpen] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(max-width: 1100px)").matches,
  );
  const [rightOpen, setRightOpen] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(max-width: 1100px)").matches,
  );
  const [exportOpen, setExportOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [fps, setFps] = useState(60);
  const [chromeTheme, setChromeTheme] = useState<WorkspaceChromeTheme>(() =>
    readWorkspaceChromeTheme(CHROME_THEME_STORAGE_KEYS.graph3d),
  );
  const [viewLabel, setViewLabel] = useState("Perspective");
  const projectInput = useRef<HTMLInputElement>(null);
  const overlay = useWorkspaceOverlay();
  const leftPanelRef = useRef<HTMLElement>(null);
  const rightPanelRef = useRef<HTMLElement>(null);
  const sceneHostRef = useRef<HTMLDivElement>(null);
  const closeTopPopovers = useCallback(() => {
    setExportOpen(false);
    setFileOpen(false);
    setSettingsOpen(false);
    setHelpOpen(false);
    setViewOpen(false);
  }, []);
  useCanvasZoomLock(sceneHostRef);
  useOutsideDismiss({
    enabled: exportOpen || fileOpen || settingsOpen || helpOpen || viewOpen,
    keepOpenSelector: "[data-workspace-popover]",
    onDismiss: closeTopPopovers,
  });
  useMobileWorkspaceGestures(leftPanelRef, {
    enabled: overlay.isMobile && overlay.isOpen("expressions"),
    edge: "left",
    onClose: overlay.close,
  });
  useMobileWorkspaceGestures(rightPanelRef, {
    enabled: overlay.isMobile && overlay.isOpen("inspector"),
    edge: "right",
    onClose: overlay.close,
  });
  const tool = props.tool;
  const selectedSurface =
    props.surfaces.find((surface) => surface.id === props.selectedSurfaceId) ??
    props.surfaces[0];
  const visibleSurfaceCount = props.surfaces.filter(
    (surface) => surface.visible,
  ).length;
  const errorCount = Object.values(props.surfaceErrors).filter(Boolean).length;

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    let animation = 0;
    const tick = (now: number) => {
      frame += 1;
      if (now - previous >= 1000) {
        setFps(Math.round((frame * 1000) / (now - previous)));
        frame = 0;
        previous = now;
      }
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHelpOpen(false);
        setSettingsOpen(false);
        setExportOpen(false);
        setFileOpen(false);
        setViewOpen(false);
        return;
      }
      if (!event.ctrlKey && !event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']"))
        return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSave();
      }
      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo();
        else onUndo();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onRedo, onSave, onUndo]);

  useEffect(() => {
    if (!overlay.isMobile) return;
    setLeftOpen(overlay.active === "expressions");
    setRightOpen(overlay.active === "inspector");
    setExportOpen(overlay.active === "export");
    setFileOpen(overlay.active === "file");
    setSettingsOpen(overlay.active === "settings");
    setHelpOpen(overlay.active === "help");
    setViewOpen(overlay.active === "camera");
  }, [overlay.active, overlay.isMobile]);

  const chooseTool = (next: Studio3DTool) => props.onToolChange(next);
  const openCrossSection = () => {
    chooseTool("slice");
    props.onSliceEnabledChange(true);
  };

  return (
    <MobileWorkspaceShell
      overlay={overlay}
      id="graph-studio-3d-root"
      className={`graph-studio-3d-shell graph-studio-surface-shell ${leftOpen ? "has-left" : ""} ${rightOpen ? "has-right" : ""} ${props.presentationMode ? "is-presenting" : ""}`}
      data-chrome-theme={chromeTheme}
    >
      <header className="gs3d-topbar">
        <div className="gs3d-brand">
          <div className="gs3d-mark">MU</div>
          <strong>Graph Studio 3D</strong>
        </div>
        <div className="gs3d-project-name">
          {renaming ? (
            <input
              autoFocus
              aria-label="Project name"
              value={props.projectName}
              onChange={(event) =>
                props.onProjectNameChange(event.target.value)
              }
              onBlur={() => setRenaming(false)}
              onKeyDown={(event) => event.key === "Enter" && setRenaming(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setRenaming(true)}
              title="Rename project"
            >
              <span>{props.projectName}</span>
              <Pencil />
            </button>
          )}
        </div>
        <div className="gs3d-top-actions">
          <TopAction
            label="Undo"
            icon={<Undo2 />}
            onClick={props.onUndo}
            disabled={!props.canUndo}
            shortcut="Ctrl+Z"
          />
          <TopAction
            label="Redo"
            icon={<Redo2 />}
            onClick={props.onRedo}
            disabled={!props.canRedo}
            shortcut="Ctrl+Shift+Z"
          />
          <TopAction
            label="Save"
            icon={<Save />}
            onClick={props.onSave}
            shortcut="Ctrl+S"
          />
          <div className="relative" data-workspace-popover>
            <TopAction
              label="File"
              icon={<FolderOpen />}
              onClick={() => {
                setExportOpen(false);
                setSettingsOpen(false);
                setHelpOpen(false);
                setViewOpen(false);
                setFileOpen((value) => !value);
              }}
            />
            {fileOpen && (
              <FileMenu
                props={props}
                close={() => setFileOpen(false)}
                onPickFile={() => projectInput.current?.click()}
                onRename={() => {
                  setRenaming(true);
                  setFileOpen(false);
                }}
              />
            )}
          </div>
          <input
            ref={projectInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Open project file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) props.onOpenProject(await file.text());
              event.target.value = "";
              setFileOpen(false);
            }}
          />
          <div className="relative" data-workspace-popover>
            <TopAction
              label="Export"
              icon={<Download />}
              onClick={() => {
                setSettingsOpen(false);
                setHelpOpen(false);
                setFileOpen(false);
                setViewOpen(false);
                setExportOpen((value) => !value);
              }}
            />
            {exportOpen && (
              <ExportMenu props={props} close={() => setExportOpen(false)} />
            )}
          </div>
          <div className="relative" data-workspace-popover>
            <TopAction
              label="Settings"
              icon={<Settings />}
              onClick={() => {
                setExportOpen(false);
                setHelpOpen(false);
                setFileOpen(false);
                setViewOpen(false);
                setSettingsOpen((value) => !value);
              }}
            />
            {settingsOpen && <SettingsMenu props={props} />}
          </div>
          <WorkspaceChromeThemeToggle
            theme={chromeTheme}
            storageKey={CHROME_THEME_STORAGE_KEYS.graph3d}
            onChange={setChromeTheme}
          />
          <div className="relative gs3d-help-control" data-workspace-popover>
            <TopAction
              label="Help"
              icon={<CircleHelp />}
              onClick={() => {
                setExportOpen(false);
                setSettingsOpen(false);
                setFileOpen(false);
                setViewOpen(false);
                setHelpOpen((value) => !value);
              }}
            />
            {helpOpen && (
              <HelpPopover
                expression={selectedSurface.expression}
                palette={selectedSurface.palette}
                onClose={() => setHelpOpen(false)}
              />
            )}
          </div>
          {props.shareControl}
        </div>
        <button
          type="button"
          className="gs3d-mobile-menu"
          data-mws-menu="true"
          aria-pressed={overlay.isOpen("expressions")}
          aria-expanded={overlay.isOpen("expressions")}
          aria-label="Expressions menu"
          onClick={() => overlay.toggle("expressions")}
        >
          <Menu />
        </button>
      </header>

      <aside
        ref={leftPanelRef}
        className={`gs3d-left-panel ${leftOpen ? "open" : ""}`}
        data-mws-panel={leftOpen ? "expressions" : undefined}
        aria-label="Expressions and layers"
        aria-hidden={!leftOpen}
      >
        <PanelHeader
          title={`Expressions & Layers (${props.surfaces.length})`}
          onCollapse={() => setLeftOpen(false)}
          side="left"
        />
        <div className="gs3d-panel-scroll">
          <div className="gs3d-layer-summary">
            <span>{visibleSurfaceCount} visible</span>
            <span>{errorCount ? `${errorCount} errors` : "All valid"}</span>
            <button
              type="button"
              onClick={() =>
                props.onSetAllVisibility(
                  visibleSurfaceCount !== props.surfaces.length,
                )
              }
            >
              {visibleSurfaceCount === props.surfaces.length
                ? "Hide all"
                : "Show all"}
            </button>
          </div>
          <div className="gs3d-expression-list">
            {props.surfaces.map((surface, index) => (
              <ExpressionCard
                key={surface.id}
                index={index}
                surface={surface}
                active={surface.id === props.selectedSurfaceId}
                error={props.surfaceErrors[surface.id]}
                canDelete={props.surfaces.length > 1}
                onSelect={() => props.onSelectedSurfaceChange(surface.id)}
                onChange={(patch) => props.onSurfaceChange(surface.id, patch)}
                onDuplicate={() => props.onDuplicateExpression(surface.id)}
                onDelete={() => props.onDeleteExpression(surface.id)}
              />
            ))}
          </div>
          <button
            type="button"
            className="gs3d-add-expression"
            onClick={props.onAddExpression}
          >
            <Plus />
            Add explicit surface
          </button>
          <div className="gs3d-presets" aria-label="Advanced 3D layer types">
            <button type="button" onClick={() => props.onAddLayer("implicit")}>
              Implicit F=0
            </button>
            <button
              type="button"
              onClick={() => props.onAddLayer("parametric")}
            >
              Parametric surface
            </button>
            <button type="button" onClick={() => props.onAddLayer("curve")}>
              Space curve
            </button>
            <button
              type="button"
              onClick={() => props.onAddLayer("vector-field")}
            >
              Vector field
            </button>
          </div>
          <div className="gs3d-presets" aria-label="Equation templates">
            {SURFACE_TEMPLATES.map((template) => (
              <button
                type="button"
                key={template.id}
                onClick={() => props.onApplyTemplate(template.id)}
              >
                {template.name}
              </button>
            ))}
            <button type="button" onClick={props.onRandomExample}>
              Random surface
            </button>
            {props.examples.slice(0, 6).map((example) => (
              <button
                type="button"
                key={example}
                onClick={() => props.onExample(example)}
              >
                {example}
              </button>
            ))}
          </div>
          <VariableControls
            variables={props.variables}
            onChange={props.onVariablesChange}
          />
          <div className="gs3d-panel-section">
            <h3>Scene layers</h3>
            <ToggleRow
              label="Grid"
              icon={<Grid3X3 />}
              checked={props.showGrid}
              onChange={props.onShowGridChange}
            />
            <ToggleRow
              label="Axes & coordinates"
              icon={<Crosshair />}
              checked={props.showAxes}
              onChange={props.onShowAxesChange}
            />
            <ToggleRow
              label="Infinite axis"
              icon={<Maximize2 />}
              checked={props.showInfiniteAxes}
              onChange={props.onShowInfiniteAxesChange}
            />
            <ToggleRow
              label="Labels"
              icon={<Sigma />}
              checked={props.showLabels}
              onChange={props.onShowLabelsChange}
            />
            <ToggleRow
              label="Base plane"
              icon={<Layers3 />}
              checked={props.showBase}
              onChange={props.onShowBaseChange}
            />
            <ToggleRow
              label="Sampling sweep"
              icon={<Activity />}
              checked={selectedSurface.samplingAnimation}
              onChange={(samplingAnimation) =>
                props.onSurfaceChange(selectedSurface.id, { samplingAnimation })
              }
            />
            <ToggleRow
              label="Cross-section"
              icon={<SlidersHorizontal />}
              checked={props.sliceEnabled}
              onChange={(value) => {
                props.onSliceEnabledChange(value);
                if (value) openCrossSection();
              }}
            />
            <ToggleRow
              label="Clip plane"
              icon={<Layers3 />}
              checked={props.clipEnabled}
              onChange={props.onClipEnabledChange}
            />
            <ToggleRow
              label="Contours"
              icon={<Activity />}
              checked={selectedSurface.showContours}
              onChange={(showContours) =>
                props.onSurfaceChange(selectedSurface.id, { showContours })
              }
            />
            <ToggleRow
              label="Fill below surface"
              icon={<Layers3 />}
              checked={selectedSurface.fillBelow}
              onChange={(fillBelow) =>
                props.onSurfaceChange(selectedSurface.id, { fillBelow })
              }
            />
            <ToggleRow
              label="Two-sided shading"
              icon={<Eye />}
              checked={selectedSurface.twoSided}
              onChange={(twoSided) =>
                props.onSurfaceChange(selectedSurface.id, { twoSided })
              }
            />
          </div>
        </div>
      </aside>

      <main className="gs3d-canvas-zone">
        {!leftOpen && (
          <button
            type="button"
            className="gs3d-panel-reveal left"
            onClick={() => setLeftOpen(true)}
            aria-label="Show expressions"
          >
            <ChevronRight />
          </button>
        )}
        {!rightOpen && (
          <button
            type="button"
            className="gs3d-panel-reveal right"
            onClick={() => setRightOpen(true)}
            aria-label="Show inspector"
          >
            <ChevronLeft />
          </button>
        )}
        <div className="gs3d-view-menu" data-workspace-popover>
          <button type="button" onClick={() => setViewOpen((value) => !value)}>
            {viewLabel} <ChevronDown />
          </button>
          {viewOpen && (
            <div>
              {[
                ["Top", [0.01, 8, 0.01]],
                ["Front", [0.01, 1.8, 8]],
                ["Side", [8, 1.8, 0.01]],
                ["Isometric", [4, 3.2, 6]],
              ].map(([label, position]) => (
                <button
                  type="button"
                  key={String(label)}
                  onClick={() => {
                    props.onCameraView(position as [number, number, number]);
                    setViewLabel(label as string);
                    setViewOpen(false);
                  }}
                >
                  {label as string}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  props.onResetCamera();
                  setViewLabel("Perspective");
                  setViewOpen(false);
                }}
              >
                Reset view
              </button>
            </div>
          )}
        </div>
        <div className="gs3d-canvas-tools" aria-label="Canvas tools">
          <CanvasTool
            label="Orbit"
            icon={<RotateCcw />}
            active={tool === "select"}
            onClick={() => chooseTool("select")}
          />
          <CanvasTool
            label="Point"
            icon={<Crosshair />}
            active={tool === "point"}
            onClick={() => {
              chooseTool("point");
              setRightOpen(true);
              setInspectorTab("analysis");
            }}
          />
          <CanvasTool
            label="Slice"
            icon={<SlidersHorizontal />}
            active={tool === "slice"}
            onClick={openCrossSection}
          />
          <CanvasTool
            label="Annotate"
            icon={<Pencil />}
            active={tool === "annotate"}
            onClick={() => chooseTool("annotate")}
          />
          <CanvasTool
            label="Fly"
            icon={<Focus />}
            active={props.flyMode}
            onClick={() => props.onFlyModeChange(!props.flyMode)}
          />
          <CanvasTool
            label="Present"
            icon={<MonitorPlay />}
            active={props.presentationMode}
            onClick={() =>
              props.onPresentationModeChange(!props.presentationMode)
            }
          />
        </div>
        <div className="gs3d-canvas-actions">
          <button
            type="button"
            onClick={props.onResetCamera}
            title="Fit and reset camera"
          >
            <Focus />
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen("graph-studio-3d-root")}
            title="Full screen"
          >
            <Maximize2 />
          </button>
        </div>
        <div
          id="surface-3d-panel"
          ref={sceneHostRef}
          className="gs3d-scene-host"
          onPointerDownCapture={(event) => {
            if (guardCanvasPointer(overlay, event)) return;
          }}
        >
          {props.scene}
          <DomainMiniMap
            analysisPoint={props.analysisPoint}
            xRange={props.xRange}
            yRange={props.yRange}
            flyMode={props.flyMode}
          />
        </div>
        <KeyframeStrip
          keyframes={props.keyframes}
          playing={props.keyframesPlaying}
          onAdd={props.onAddKeyframe}
          onDelete={props.onDeleteKeyframe}
          onPlay={props.onPlayKeyframes}
        />
        {props.importError && (
          <p className="gs3d-import-error" role="alert">
            {props.importError}
          </p>
        )}
        <div className="gs3d-interaction-hint">
          Drag to orbit <span /> Wheel to zoom <span /> Shift-drag to pan
        </div>
      </main>

      <aside
        ref={rightPanelRef}
        className={`gs3d-right-panel ${rightOpen ? "open" : ""}`}
        data-mws-panel={rightOpen ? "inspector" : undefined}
        aria-label="Surface Inspector"
        aria-hidden={!rightOpen}
      >
        <PanelHeader
          title={
            tool === "slice"
              ? "Slice Inspector"
              : tool === "point"
                ? "Point Inspector"
                : "Surface Inspector"
          }
          onCollapse={() => setRightOpen(false)}
          side="right"
        />
        <div className="gs3d-inspector-tabs">
          {(["properties", "analysis", "style"] as Studio3DInspectorTab[]).map(
            (item) => (
              <button
                key={item}
                type="button"
                className={inspectorTab === item ? "active" : ""}
                onClick={() => setInspectorTab(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <div className="gs3d-panel-scroll" aria-live="polite">
          {inspectorTab === "properties" ? (
            <PropertiesPanel props={props} />
          ) : inspectorTab === "style" ? (
            <StylePanel
              surface={selectedSurface}
              graphThemeId={props.graphThemeId}
              onGraphThemeChange={props.onGraphThemeChange}
              onChange={(patch) =>
                props.onSurfaceChange(selectedSurface.id, patch)
              }
            />
          ) : (
            <AnalysisPanel
              props={props}
              onCreateCrossSection={openCrossSection}
            />
          )}
        </div>
      </aside>

      <footer className="gs3d-status">
        <span className="online-dot" />
        Offline ready <span>{fps} FPS</span>
        <span>
          {props.surfaces.length} surfaces / {visibleSurfaceCount} visible
        </span>
        <span>
          {props.resolution} x {props.resolution} adaptive mesh
        </span>
        <span>
          {errorCount
            ? `${errorCount} calculation errors`
            : "Calculations current"}
        </span>
        <span className="saved">Auto-saved locally</span>
      </footer>

      <nav className="gs3d-mobile-nav" aria-label="Mobile workspace panels">
        <button type="button" onClick={() => overlay.toggle("expressions")}>
          <Layers3 />
          Expressions
        </button>
        <button type="button" onClick={() => overlay.toggle("inspector")}>
          <SlidersHorizontal />
          Inspector
        </button>
        {props.shareControl}
      </nav>
      {overlay.isMobile && selectedSurface && !overlay.active ? (
        <ContextInspector
          title={`${selectedSurface.name ?? "Surface"} • 3D`}
          subtitle={selectedSurface.expression}
          actions={
            <>
              <button type="button" onClick={() => overlay.open("inspector")}>
                Style
              </button>
              <button type="button" onClick={() => overlay.open("more")}>
                More
              </button>
            </>
          }
        />
      ) : null}
      <WorkspaceToolbar
        label="3D graph tools"
        items={[
          {
            id: "add",
            label: "Add",
            icon: <Plus />,
            pressed: overlay.isOpen("expressions"),
            onSelect: () => overlay.toggle("expressions"),
          },
          {
            id: "orbit",
            label: "Orbit",
            icon: <RotateCcw />,
            active: tool === "select",
            onSelect: () => {
              chooseTool("select");
              overlay.close();
            },
          },
          {
            id: "slice",
            label: "Slice",
            icon: <SlidersHorizontal />,
            active: tool === "slice",
            onSelect: () => {
              openCrossSection();
              overlay.close();
            },
          },
          {
            id: "camera",
            label: "Camera",
            icon: <Focus />,
            pressed: overlay.isOpen("camera"),
            onSelect: () => overlay.toggle("camera"),
          },
          {
            id: "more",
            label: "More",
            icon: <MoreHorizontal />,
            pressed: overlay.isOpen("more"),
            onSelect: () => overlay.toggle("more"),
          },
        ]}
      />
      <WorkspaceBottomSheet
        open={overlay.isOpen("more")}
        title="3D graph tools"
        onClose={overlay.close}
      >
        <button type="button" onClick={() => overlay.open("inspector")}>
          Inspector
        </button>
        <button type="button" onClick={() => overlay.open("expressions")}>
          Expressions
        </button>
        <button
          type="button"
          onClick={() => {
            chooseTool("point");
            overlay.open("inspector");
            setInspectorTab("analysis");
          }}
        >
          Point
        </button>
        <button type="button" onClick={() => overlay.open("export")}>
          Export
        </button>
        {props.shareControl}
      </WorkspaceBottomSheet>
      <WorkspaceBottomSheet
        open={overlay.isOpen("camera")}
        title="Camera"
        onClose={overlay.close}
      >
        {(["Top", "Front", "Side", "Isometric"] as const).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              const position =
                label === "Top"
                  ? ([0.01, 8, 0.01] as [number, number, number])
                  : label === "Front"
                    ? ([0.01, 1.8, 8] as [number, number, number])
                    : label === "Side"
                      ? ([8, 1.8, 0.01] as [number, number, number])
                      : ([4, 3.2, 6] as [number, number, number]);
              props.onCameraView(position);
              setViewLabel(label);
              overlay.close();
            }}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            props.onResetCamera();
            setViewLabel("Perspective");
            overlay.close();
          }}
        >
          Reset view
        </button>
      </WorkspaceBottomSheet>
    </MobileWorkspaceShell>
  );
}

function TopAction({
  label,
  icon,
  onClick,
  disabled,
  shortcut,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  shortcut?: string;
}) {
  return (
    <button
      type="button"
      className="gs3d-top-action"
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PanelHeader({
  title,
  onCollapse,
  side,
}: {
  title: string;
  onCollapse: () => void;
  side: "left" | "right";
}) {
  return (
    <div className="gs3d-panel-header">
      <h2>{title}</h2>
      <button
        type="button"
        onClick={onCollapse}
        aria-label={`Collapse ${title}`}
      >
        {side === "left" ? <PanelLeftClose /> : <PanelRightClose />}
      </button>
    </div>
  );
}

function ExpressionCard({
  surface,
  index,
  active,
  error,
  canDelete,
  onSelect,
  onChange,
  onDuplicate,
  onDelete,
}: {
  surface: Graph3DSurface;
  index: number;
  active: boolean;
  error?: string;
  canDelete: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<Graph3DSurface>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const expressionLabel =
    surface.kind === "implicit"
      ? surface.expression.includes("=")
        ? surface.expression
        : `${surface.expression} = 0`
      : surface.kind === "parametric"
        ? "r(u,v)"
        : surface.kind === "curve"
          ? "r(t)"
          : surface.kind === "vector-field"
            ? "F(x,y,z)"
            : `${surface.coordinateMode === "cartesian" ? "z" : surface.coordinateMode === "cylindrical" ? "z(r,theta)" : "rho(theta,phi)"} = ${surface.expression}`;
  const usesComponents =
    surface.kind === "parametric" ||
    surface.kind === "curve" ||
    surface.kind === "vector-field";
  return (
    <div
      className={`gs3d-expression ${active ? "active" : ""} ${surface.visible ? "" : "is-hidden"}`}
      onClick={onSelect}
    >
      <button
        type="button"
        className="swatch"
        style={{
          background: `linear-gradient(${surface.colorHigh}, ${surface.colorLow})`,
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        aria-label={`Edit ${surface.name} style`}
      />
      <div className="expression-main">
        <div className="expression-label">
          <span>{index + 1}</span>
          <input
            aria-label={`Name ${surface.name}`}
            value={surface.name}
            onChange={(event) => onChange({ name: event.target.value })}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
        <button
          type="button"
          className="expression-text"
          onClick={() => setEditing((value) => !value)}
        >
          {expressionLabel}
        </button>
        <span className="gs3d-latex">
          <MathExpression value={expressionToLatex(usesComponents ? `${surface.components.x}, ${surface.components.y}, ${surface.components.z}` : surface.expression)} />
        </span>
        {editing &&
          (usesComponents ? (
            <div onClick={(event) => event.stopPropagation()}>
              {(["x", "y", "z"] as const).map((axis) => (
                <input
                  key={axis}
                  aria-label={`${surface.name} ${axis} component`}
                  value={surface.components[axis]}
                  onChange={(event) =>
                    onChange({
                      components: {
                        ...surface.components,
                        [axis]: event.target.value,
                      },
                    })
                  }
                  placeholder={`${axis} component`}
                />
              ))}
            </div>
          ) : (
            <input
              autoFocus
              aria-label={`Edit ${surface.name} expression`}
              value={surface.expression}
              onChange={(event) =>
                onChange({
                  expression: event.target.value,
                  components: { ...surface.components, z: event.target.value },
                })
              }
              onKeyDown={(event) => event.key === "Enter" && setEditing(false)}
              onClick={(event) => event.stopPropagation()}
            />
          ))}
        {error && (
          <ExpressionFixNote
            expression={surface.expression}
            error={error}
            onApply={(rewrite) => onChange({ expression: rewrite })}
          />
        )}
      </div>
      <button
        type="button"
        className="icon-action"
        onClick={(event) => {
          event.stopPropagation();
          onChange({ visible: !surface.visible });
        }}
        aria-label={
          surface.visible ? `Hide ${surface.name}` : `Show ${surface.name}`
        }
      >
        {surface.visible ? <Eye /> : <EyeOff />}
      </button>
      <button
        type="button"
        className="icon-action"
        onClick={(event) => {
          event.stopPropagation();
          onDuplicate();
        }}
        aria-label={`Duplicate ${surface.name}`}
      >
        <Copy />
      </button>
      <button
        type="button"
        className="icon-action danger"
        disabled={!canDelete}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        aria-label={`Delete ${surface.name}`}
      >
        <Trash2 />
      </button>
    </div>
  );
}

function VariableControls({
  variables,
  onChange,
}: {
  variables: GraphStudioVariable[];
  onChange: (variables: GraphStudioVariable[]) => void;
}) {
  if (!variables.length)
    return (
      <div className="gs3d-panel-section">
        <h3>Parameters</h3>
        <p className="gs3d-muted">
          Use a, b, or t in an expression to create an animated parameter.
        </p>
      </div>
    );
  return (
    <div className="gs3d-panel-section">
      <h3>Parameters</h3>
      {variables.map((variable, index) => (
        <div className="gs3d-variable" key={variable.id}>
          <div>
            <strong>{variable.name}</strong>
            <span>{format(variable.min)}</span>
            <span>{format(variable.max)}</span>
            <input
              aria-label={`${variable.name} value`}
              type="number"
              value={variable.value}
              step={variable.step}
              onChange={(event) =>
                onChange(
                  variables.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, value: Number(event.target.value) }
                      : item,
                  ),
                )
              }
            />
            <button
              type="button"
              aria-label={variable.playing ? `Pause ${variable.name}` : `Play ${variable.name}`}
              onClick={() =>
                onChange(
                  variables.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, playing: !item.playing } : item,
                  ),
                )
              }
            >
              {variable.playing ? <Pause /> : <Play />}
            </button>
            <button
              type="button"
              aria-label={`Toggle ${variable.name} playback mode`}
              onClick={() =>
                onChange(
                  variables.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, playback: item.playback === "loop" ? "ping-pong" : "loop" }
                      : item,
                  ),
                )
              }
            >
              <Repeat2 />
              {variable.playback}
            </button>
          </div>
          <input
            aria-label={`${variable.name} slider`}
            type="range"
            min={variable.min}
            max={variable.max}
            step={variable.step}
            value={variable.value}
            onChange={(event) =>
              onChange(
                variables.map((item, itemIndex) =>
                  itemIndex === index
                    ? { ...item, value: Number(event.target.value) }
                    : item,
                ),
              )
            }
          />
          <label>
            Speed
            <select
              aria-label={`${variable.name} speed`}
              value={variable.speed}
              onChange={(event) =>
                onChange(
                  variables.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, speed: Number(event.target.value) }
                      : item,
                  ),
                )
              }
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
            </select>
          </label>
        </div>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="gs3d-toggle-row">
      <span>
        {icon}
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i />
    </label>
  );
}
function CanvasTool({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "active" : ""}
      onClick={onClick}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PropertiesPanel({ props }: { props: GraphStudio3DWorkspaceProps }) {
  const surface =
    props.surfaces.find((item) => item.id === props.selectedSurfaceId) ??
    props.surfaces[0];
  const parameterized =
    surface.kind === "parametric" || surface.kind === "curve";
  return (
    <div className="gs3d-inspector-content">
      <InspectorGroup title="Layer model">
        <label className="gs3d-select-field">
          Graph family
          <select
            value={surface.kind}
            onChange={(event) =>
              props.onSurfaceChange(surface.id, {
                kind: event.target.value as Graph3DLayerKind,
              })
            }
          >
            <option value="explicit">Explicit surface</option>
            <option value="implicit">Implicit F(x,y,z)=0</option>
            <option value="parametric">Parametric r(u,v)</option>
            <option value="curve">Space curve r(t)</option>
            <option value="vector-field">Vector field</option>
          </select>
        </label>
        {surface.kind === "explicit" && (
          <label className="gs3d-select-field">
            Coordinates
            <select
              value={surface.coordinateMode}
              onChange={(event) =>
                props.onSurfaceChange(surface.id, {
                  coordinateMode: event.target
                    .value as Graph3DSurface["coordinateMode"],
                })
              }
            >
              <option value="cartesian">Cartesian (x,y,z)</option>
              <option value="cylindrical">Cylindrical (r,theta,z)</option>
              <option value="spherical">Spherical (rho,theta,phi)</option>
            </select>
          </label>
        )}
        {surface.kind === "explicit" &&
          surface.coordinateMode === "cartesian" && (
            <ToggleRow
              label="Adaptive curvature mesh"
              icon={<Grid3X3 />}
              checked={surface.adaptive}
              onChange={(adaptive) =>
                props.onSurfaceChange(surface.id, { adaptive })
              }
            />
          )}
        {surface.kind === "vector-field" && (
          <ToggleRow
            label="Streamlines"
            icon={<Activity />}
            checked={surface.streamlines}
            onChange={(streamlines) =>
              props.onSurfaceChange(surface.id, { streamlines })
            }
          />
        )}
      </InspectorGroup>
      {(surface.kind === "parametric" ||
        surface.kind === "curve" ||
        surface.kind === "vector-field") && (
        <InspectorGroup
          title={
            surface.kind === "vector-field"
              ? "Vector components"
              : "Coordinate components"
          }
        >
          {(["x", "y", "z"] as const).map((axis) => (
            <label className="gs3d-select-field" key={axis}>
              {axis}
              <input
                value={surface.components[axis]}
                onChange={(event) =>
                  props.onSurfaceChange(surface.id, {
                    components: {
                      ...surface.components,
                      [axis]: event.target.value,
                    },
                  })
                }
              />
            </label>
          ))}
        </InspectorGroup>
      )}
      <InspectorGroup title={parameterized ? "Parameter domain" : "Independent window"}>
        {surface.kind === "curve" ? (
          <>
            <CompactSlider
              label="t minimum"
              value={surface.tMin}
              min={-12}
              max={12}
              step={0.25}
              onChange={(tMin) =>
                props.onSurfaceChange(surface.id, {
                  tMin: Math.min(tMin, surface.tMax - 0.1),
                })
              }
            />
            <CompactSlider
              label="t maximum"
              value={surface.tMax}
              min={-12}
              max={24}
              step={0.25}
              onChange={(tMax) =>
                props.onSurfaceChange(surface.id, {
                  tMax: Math.max(tMax, surface.tMin + 0.1),
                })
              }
            />
          </>
        ) : surface.kind === "parametric" ||
          surface.coordinateMode !== "cartesian" ? (
          <>
            <CompactSlider
              label="u minimum"
              value={surface.uMin}
              min={-12}
              max={12}
              step={0.25}
              onChange={(uMin) =>
                props.onSurfaceChange(surface.id, {
                  uMin: Math.min(uMin, surface.uMax - 0.1),
                })
              }
            />
            <CompactSlider
              label="u maximum"
              value={surface.uMax}
              min={-12}
              max={12}
              step={0.25}
              onChange={(uMax) =>
                props.onSurfaceChange(surface.id, {
                  uMax: Math.max(uMax, surface.uMin + 0.1),
                })
              }
            />
            <CompactSlider
              label="v minimum"
              value={surface.vMin}
              min={-12}
              max={12}
              step={0.25}
              onChange={(vMin) =>
                props.onSurfaceChange(surface.id, {
                  vMin: Math.min(vMin, surface.vMax - 0.1),
                })
              }
            />
            <CompactSlider
              label="v maximum"
              value={surface.vMax}
              min={-12}
              max={12}
              step={0.25}
              onChange={(vMax) =>
                props.onSurfaceChange(surface.id, {
                  vMax: Math.max(vMax, surface.vMin + 0.1),
                })
              }
            />
          </>
        ) : (
          <>
            <CompactSlider
              label="X range"
              value={props.xRange}
              min={1}
              max={8}
              step={0.25}
              onChange={props.onXRangeChange}
            />
            <CompactSlider
              label="Y range"
              value={props.yRange}
              min={1}
              max={8}
              step={0.25}
              onChange={props.onYRangeChange}
            />
          </>
        )}
      </InspectorGroup>
      <InspectorGroup title="Transform">
        <CompactSlider
          label="Position X"
          value={props.objectPosition.x}
          min={-6}
          max={6}
          step={0.25}
          onChange={(x) =>
            props.onObjectPositionChange({ ...props.objectPosition, x })
          }
        />
        <CompactSlider
          label="Position Y"
          value={props.objectPosition.y}
          min={-6}
          max={6}
          step={0.25}
          onChange={(y) =>
            props.onObjectPositionChange({ ...props.objectPosition, y })
          }
        />
        <CompactSlider
          label="Position Z"
          value={props.objectPosition.z}
          min={-4}
          max={4}
          step={0.25}
          onChange={(z) =>
            props.onObjectPositionChange({ ...props.objectPosition, z })
          }
        />
      </InspectorGroup>
      <InspectorGroup title="Reference objects">
        <label className="gs3d-select-field">
          Overlay
          <select
            value={props.referenceObject}
            onChange={(event) =>
              props.onReferenceObjectChange(
                event.target
                  .value as GraphStudio3DWorkspaceProps["referenceObject"],
              )
            }
          >
            <option value="none">None</option>
            <option value="helix">Parametric helix</option>
            <option value="sphere">Sphere</option>
            <option value="cone">Cone</option>
            <option value="cylinder">Cylinder</option>
          </select>
        </label>
      </InspectorGroup>
      <InspectorGroup title="Mesh">
        <CompactSlider
          label="Resolution"
          value={props.resolution}
          min={12}
          max={80}
          step={2}
          onChange={props.onResolutionChange}
        />
        <CompactSlider
          label="Implicit LOD"
          value={surface.lod}
          min={1}
          max={3}
          step={1}
          onChange={(lod) =>
            props.onSurfaceChange(surface.id, { lod: lod as 1 | 2 | 3 })
          }
        />
        <label className="gs3d-select-field">
          Domain restriction
          <input
            aria-label="Domain restriction"
            placeholder="x^2+y^2<=4"
            value={surface.domainPredicate}
            onChange={(event) =>
              props.onSurfaceChange(surface.id, {
                domainPredicate: event.target.value,
              })
            }
          />
        </label>
        <CompactSlider
          label="Layer x min"
          value={surface.xMin}
          min={-8}
          max={8}
          step={0.5}
          onChange={(xMin) => props.onSurfaceChange(surface.id, { xMin })}
        />
        <CompactSlider
          label="Layer x max"
          value={surface.xMax}
          min={-8}
          max={8}
          step={0.5}
          onChange={(xMax) => props.onSurfaceChange(surface.id, { xMax })}
        />
        <CompactSlider
          label="Layer y min"
          value={surface.yMin}
          min={-8}
          max={8}
          step={0.5}
          onChange={(yMin) => props.onSurfaceChange(surface.id, { yMin })}
        />
        <CompactSlider
          label="Layer y max"
          value={surface.yMax}
          min={-8}
          max={8}
          step={0.5}
          onChange={(yMax) => props.onSurfaceChange(surface.id, { yMax })}
        />
        <p className="gs3d-muted">
          Each layer can keep its own window. LOD 3 raises implicit mesh density.
        </p>
      </InspectorGroup>
      <InspectorGroup title="Slice and clip">
        <CompactSlider
          label="Slice position"
          value={props.sliceValue}
          min={-Math.max(props.xRange, props.yRange)}
          max={Math.max(props.xRange, props.yRange)}
          step={0.1}
          onChange={props.onSliceValueChange}
        />
        <label className="gs3d-select-field">
          Slice axis
          <select
            value={props.sliceAxis}
            onChange={(event) =>
              props.onSliceAxisChange(event.target.value as "x" | "y" | "z")
            }
          >
            <option value="x">X</option>
            <option value="y">Y</option>
            <option value="z">Z</option>
          </select>
        </label>
        <label className="gs3d-select-field">
          Clip axis
          <select
            value={props.clipAxis}
            onChange={(event) =>
              props.onClipAxisChange(event.target.value as "x" | "y" | "z")
            }
          >
            <option value="x">X</option>
            <option value="y">Y</option>
            <option value="z">Z</option>
          </select>
        </label>
        <CompactSlider
          label="Clip position"
          value={props.clipValue}
          min={-Math.max(props.xRange, props.yRange)}
          max={Math.max(props.xRange, props.yRange)}
          step={0.1}
          onChange={props.onClipValueChange}
        />
      </InspectorGroup>
      <InspectorGroup title="Camera bookmarks">
        <button type="button" onClick={props.onAddBookmark}>
          Save current view
        </button>
        {props.bookmarks.map((bookmark) => (
          <p className="gs3d-muted" key={bookmark.id}>
            <button type="button" onClick={() => props.onOpenBookmark(bookmark.id)}>
              {bookmark.name}
            </button>
            <button type="button" onClick={() => props.onDeleteBookmark(bookmark.id)}>
              Remove
            </button>
          </p>
        ))}
      </InspectorGroup>
    </div>
  );
}

function AnalysisPanel({
  props,
  onCreateCrossSection,
}: {
  props: GraphStudio3DWorkspaceProps;
  onCreateCrossSection: () => void;
}) {
  const d = props.differential;
  const selected =
    props.surfaces.find((surface) => surface.id === props.selectedSurfaceId) ??
    props.surfaces[0];
  const supportsDifferential =
    selected.kind === "explicit" && selected.coordinateMode === "cartesian";
  return (
    <div className="gs3d-inspector-content">
      <div className="gs3d-analysis-table">
        <Metric
          label="Domain"
          value={`x in [-${props.xRange}, ${props.xRange}], y in [-${props.yRange}, ${props.yRange}]`}
          status="viewport"
        />
        <Metric
          label="Range"
          value={
            props.surface.minZ === null
              ? "No real samples"
              : `z in [${format(props.surface.minZ)}, ${format(props.surface.maxZ ?? 0)}]`
          }
          status="numerical"
        />
        <Metric
          label="Selected point"
          value={
            d
              ? `(${format(d.point.x)}, ${format(d.point.y)}, ${format(d.point.z)})`
              : "Unavailable for this layer"
          }
          status="numerical"
        />
        <Metric
          label="Gradient"
          value={
            d
              ? `(${format(d.gradient.x)}, ${format(d.gradient.y)})`
              : "Unavailable"
          }
          status="numerical"
        />
        <Metric
          label="Normal"
          value={d ? `(${d.normal.map(format).join(", ")})` : "Unavailable"}
          status="numerical"
        />
      </div>
      {supportsDifferential ? (
        <>
          <InspectorGroup title="Point analysis">
            <p className="gs3d-muted">
              Choose Point, then click the surface, or refine the coordinates
              below.
            </p>
            <CompactSlider
              label="Point X"
              value={props.analysisPoint.x}
              min={-props.xRange}
              max={props.xRange}
              step={0.1}
              onChange={(x) =>
                props.onAnalysisPointChange({ ...props.analysisPoint, x })
              }
            />
            <CompactSlider
              label="Point Y"
              value={props.analysisPoint.y}
              min={-props.yRange}
              max={props.yRange}
              step={0.1}
              onChange={(y) =>
                props.onAnalysisPointChange({ ...props.analysisPoint, y })
              }
            />
          </InspectorGroup>
          <div className="gs3d-analysis-actions">
            <button type="button" onClick={() => props.onExactPartial("x")}>
              Exact partial x
            </button>
            <button type="button" onClick={() => props.onExactPartial("y")}>
              Exact partial y
            </button>
            <button type="button" onClick={onCreateCrossSection}>
              Create cross-section
            </button>
          </div>
        </>
      ) : (
        <p className="gs3d-muted">
          Point gradients, Hessians, and tangent planes apply to Cartesian
          explicit surfaces. This layer remains available for geometric
          inspection.
        </p>
      )}
      {d && (
        <details open>
          <summary>Tangent plane and method</summary>
          <p className="formula-result">{d.tangentPlane}</p>
          {d.steps.map((step) => (
            <p className="gs3d-muted" key={step}>
              {step}
            </p>
          ))}
        </details>
      )}
      <InspectorGroup title="Critical points & Hessian">
        {props.criticalPoints.length ? (
          props.criticalPoints.map((point, index) => (
            <p className="gs3d-muted" key={`${point.x}-${point.y}-${index}`}>
              <strong>{point.kind}</strong> ({format(point.x)},{" "}
              {format(point.y)}, {format(point.z)}) · det H ={" "}
              {format(point.determinant)}
            </p>
          ))
        ) : (
          <p className="gs3d-muted">
            No isolated critical points detected in the visible window.
          </p>
        )}
      </InspectorGroup>
      <InspectorGroup title="Volume between surfaces">
        {props.volumeAnalysis ? (
          props.volumeAnalysis.error ? (
            <p className="gs3d-muted">{props.volumeAnalysis.error}</p>
          ) : (
            <>
              <Metric
                label="Absolute volume"
                value={format(props.volumeAnalysis.absolute)}
                status="numerical"
              />
              <Metric
                label="Signed integral"
                value={format(props.volumeAnalysis.signed)}
                status="numerical"
              />
              <p className="gs3d-muted">
                Selected explicit surface compared with the next visible
                explicit surface over the current rectangular domain.
              </p>
            </>
          )
        ) : (
          <p className="gs3d-muted">
            Show at least two Cartesian explicit surfaces to calculate bounded
            volume.
          </p>
        )}
      </InspectorGroup>
      {props.exactPartial && (
        <div className="gs3d-exact">
          <span>Exact CAS</span>
          <code>{props.exactPartial}</code>
          <button type="button" onClick={props.onUsePartialSurface}>
            Add derivative surface
          </button>
        </div>
      )}
      <InspectorGroup title="Measures">
        <Metric
          label="Surface area"
          value={
            props.surfaceArea?.error
              ? props.surfaceArea.error
              : props.surfaceArea
                ? format(props.surfaceArea.area)
                : "Unavailable"
          }
          status="numerical"
        />
        <Metric
          label="Arc length"
          value={props.arcLength == null ? "Unavailable" : format(props.arcLength)}
          status="numerical"
        />
        <Metric
          label="Intersection samples"
          value={String(props.intersectionCount ?? 0)}
          status="numerical"
        />
        {props.vectorCalculus && (
          <>
            <Metric
              label="Divergence"
              value={format(props.vectorCalculus.divergence)}
              status="numerical"
            />
            <Metric
              label="Curl"
              value={`(${format(props.vectorCalculus.curl.x)}, ${format(props.vectorCalculus.curl.y)}, ${format(props.vectorCalculus.curl.z)})`}
              status="numerical"
            />
          </>
        )}
      </InspectorGroup>
      <InspectorGroup title="CAS round-trip">
        <button type="button" onClick={props.onOpenCas}>
          Send selected surface to CAS
        </button>
        <CasPlotField onPlot={props.onPlotCasExpression} />
      </InspectorGroup>
      <InspectorGroup title="Read the graph">
        {(
          [
            ["intercepts", "Intercepts"],
            ["extrema", "Extrema"],
            ["symmetry", "Symmetry"],
            ["slice", "Slice at x = a"],
          ] as const
        ).map(([key, label]) => (
          <ToggleRow
            key={key}
            label={label}
            icon={<Sigma />}
            checked={props.checklist[key]}
            onChange={(value) => props.onChecklistChange({ [key]: value })}
          />
        ))}
      </InspectorGroup>
      <InspectorGroup title="Find the saddle">
        <button
          type="button"
          onClick={() => props.onChallengeOpenChange(!props.challengeOpen)}
        >
          {props.challengeOpen ? "Hide challenge" : "Start challenge"}
        </button>
        {props.challengeOpen && (
          <p className="gs3d-muted">
            Click the surface near a saddle. {props.challengeMessage}
          </p>
        )}
      </InspectorGroup>
      {props.annotations.length > 0 && (
        <InspectorGroup title="Annotations">
          <button type="button" onClick={props.onClearAnnotations}>
            Clear annotations
          </button>
        </InspectorGroup>
      )}
    </div>
  );
}

function StylePanel({
  surface,
  graphThemeId,
  onGraphThemeChange,
  onChange,
}: {
  surface: Graph3DSurface;
  graphThemeId: Graph3DThemeId;
  onGraphThemeChange: (value: Graph3DThemeId) => void;
  onChange: (patch: Partial<Graph3DSurface>) => void;
}) {
  const selectedTheme = getGraph3DTheme(graphThemeId);
  return (
    <div className="gs3d-inspector-content">
      <InspectorGroup title="Graph theme">
        <div
          className="gs3d-theme-grid"
          role="radiogroup"
          aria-label="3D graph colour theme"
        >
          {GRAPH_3D_THEMES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === graphThemeId}
              className={item.id === graphThemeId ? "active" : ""}
              onClick={() => onGraphThemeChange(item.id)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft")
                  return;
                event.preventDefault();
                const direction = event.key === "ArrowRight" ? 1 : -1;
                onGraphThemeChange(
                  GRAPH_3D_THEMES[
                    (index + direction + GRAPH_3D_THEMES.length) %
                      GRAPH_3D_THEMES.length
                  ].id,
                );
              }}
            >
              <span
                className="gs3d-theme-swatch"
                style={{ background: graph3DThemeGradient(item) }}
              />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <p className="gs3d-theme-description">{selectedTheme.description}</p>
      </InspectorGroup>
      <InspectorGroup title={surface.name}>
        <label className="gs3d-select-field">
          Colour mapping
          <select
            value={surface.palette}
            onChange={(event) =>
              onChange({
                palette: event.target.value as Graph3DSurface["palette"],
              })
            }
          >
            <option value="height">Use graph theme</option>
            <option value="custom">Custom gradient</option>
            <option value="thermal">Thermal override</option>
            <option value="contour">Contour bands</option>
            <option value="mono">Pearl override</option>
          </select>
        </label>
        <div className="gs3d-color-pair">
          <label>
            Low
            <input
              type="color"
              value={surface.colorLow}
              onChange={(event) =>
                onChange({ colorLow: event.target.value, palette: "custom" })
              }
            />
          </label>
          <label>
            High
            <input
              type="color"
              value={surface.colorHigh}
              onChange={(event) =>
                onChange({ colorHigh: event.target.value, palette: "custom" })
              }
            />
          </label>
        </div>
        <CompactSlider
          label="Opacity"
          value={surface.opacity}
          min={0.05}
          max={1}
          step={0.05}
          onChange={(opacity) => onChange({ opacity })}
        />
        <ToggleRow
          label="Visible"
          icon={<Eye />}
          checked={surface.visible}
          onChange={(visible) => onChange({ visible })}
        />
        <ToggleRow
          label="Wireframe"
          icon={<Grid3X3 />}
          checked={surface.wireframe}
          onChange={(wireframe) => onChange({ wireframe })}
        />
        <ToggleRow
          label="Sample points"
          icon={<Activity />}
          checked={surface.showPoints}
          onChange={(showPoints) => onChange({ showPoints })}
        />
        <ToggleRow
          label="Surface scan"
          icon={<Activity />}
          checked={surface.samplingAnimation}
          onChange={(samplingAnimation) => onChange({ samplingAnimation })}
        />
      </InspectorGroup>
      <div
        className="gs3d-surface-preview"
        style={{
          background:
            surface.palette === "custom"
              ? `linear-gradient(90deg, ${surface.colorLow}, ${surface.colorHigh})`
              : graph3DThemeGradient(selectedTheme),
        }}
      >
        <span>Low z</span>
        <strong>{surface.name}</strong>
        <span>High z</span>
      </div>
    </div>
  );
}

function HelpPopover({
  expression,
  palette,
  onClose,
}: {
  expression: string;
  palette: string;
  onClose: () => void;
}) {
  return (
    <aside
      className="gs3d-help-popover"
      role="dialog"
      aria-modal="false"
      aria-label="3D graph learning help"
    >
      <header>
        <div>
          <strong>3D graph help</strong>
          <span>Quick learning guide</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close help">
          Close
        </button>
      </header>
      <section>
        <strong>Read the surface</strong>
        <p>
          For every point (x, y), <code>z = {expression}</code> gives the
          surface height.
        </p>
      </section>
      <section>
        <strong>Explore it</strong>
        <p>
          Drag to orbit, use the wheel to zoom, and Shift-drag to pan. Point
          inspects slope; Slice reveals a 2D cross-section.
        </p>
      </section>
      <section>
        <strong>Colour and wireframe</strong>
        <p>
          The {palette} palette represents height. Wireframe adds the
          mathematical mesh without changing the canvas size.
        </p>
      </section>
      <footer>
        <kbd>Esc</kbd>
        <span>closes this help</span>
      </footer>
    </aside>
  );
}

function InspectorGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="gs3d-inspector-group">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function Metric({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div>
      <span>
        {label}
        <i>{status}</i>
      </span>
      <strong>{value}</strong>
    </div>
  );
}
function CompactSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="gs3d-compact-slider">
      <span>
        {label}
        <b>{format(value)}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ExportMenu({
  props,
  close,
}: {
  props: GraphStudio3DWorkspaceProps;
  close: () => void;
}) {
  return (
    <div className="gs3d-popover export">
      <button
        type="button"
        onClick={() => {
          void exportCanvas("surface-3d-panel", "graph-studio-3d.png");
          close();
        }}
      >
        <Fullscreen />
        PNG image
      </button>
      <button
        type="button"
        onClick={() => {
          props.onExportCsv();
          close();
        }}
      >
        <Download />
        Sampled values CSV
      </button>
      <button
        type="button"
        onClick={() => {
          props.onExportProject();
          close();
        }}
      >
        <FileJson />
        Project file
      </button>
      <button
        type="button"
        onClick={() => {
          props.onCopyEquation();
          close();
        }}
      >
        <Copy />
        Copy equation
      </button>
      <button
        type="button"
        onClick={() => {
          props.onExportMesh("stl");
          close();
        }}
      >
        <Download />
        Mesh STL
      </button>
      <button
        type="button"
        onClick={() => {
          props.onExportMesh("obj");
          close();
        }}
      >
        <Download />
        Mesh OBJ
      </button>
      <button
        type="button"
        onClick={() => {
          props.onExportVideo();
          close();
        }}
      >
        <Video />
        {props.recording ? "Recording orbit..." : "Orbit WebM"}
      </button>
    </div>
  );
}
function SettingsMenu({ props }: { props: GraphStudio3DWorkspaceProps }) {
  return (
    <div className="gs3d-popover settings">
      <p>Recent projects</p>
      {props.savedLibrary}
      <label>
        Appearance
        <select
          value={props.stylePreset}
          onChange={(event) =>
            props.onStylePresetChange(
              event.target.value as GraphStudioStylePreset,
            )
          }
        >
          <option value="classroom">Classroom</option>
          <option value="contrast">High contrast</option>
          <option value="colorblind">Colour-blind safe</option>
          <option value="print">Print</option>
          <option value="neon">Neon</option>
          <option value="presentation">Presentation</option>
          <option value="paper">Scientific paper</option>
        </select>
      </label>
    </div>
  );
}

async function toggleFullscreen(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (document.fullscreenElement) await document.exitFullscreen();
  else await target.requestFullscreen?.();
}
async function exportCanvas(id: string, filename: string) {
  const canvas = document.getElementById(id)?.querySelector("canvas");
  if (!canvas) return;
  const anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = filename;
  anchor.click();
}
function format(value: number) {
  return `${Math.round(value * 1000) / 1000}`;
}

function FileMenu({
  props,
  close,
  onPickFile,
  onRename,
}: {
  props: GraphStudio3DWorkspaceProps;
  close: () => void;
  onPickFile: () => void;
  onRename: () => void;
}) {
  return (
    <div className="gs3d-popover export">
      <button type="button" onClick={() => { props.onNewProject(); close(); }}>
        <FilePlus2 />
        New project
      </button>
      <button type="button" onClick={() => { onPickFile(); close(); }}>
        <FolderOpen />
        Open project file
      </button>
      <button type="button" onClick={() => { props.onDuplicateProject(); close(); }}>
        <Copy />
        Duplicate project
      </button>
      <button type="button" onClick={onRename}>
        <Pencil />
        Rename project
      </button>
    </div>
  );
}

function ExpressionFixNote({
  expression,
  error,
  onApply,
}: {
  expression: string;
  error: string;
  onApply: (rewrite: string) => void;
}) {
  const fix = suggestExpressionFix(expression, error);
  return (
    <p role="alert">
      {fix.message} Try {fix.example}.
      {fix.rewrite && (
        <button type="button" onClick={() => onApply(fix.rewrite!)}>
          Apply rewrite
        </button>
      )}
    </p>
  );
}

function CasPlotField({ onPlot }: { onPlot: (expression: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <label className="gs3d-select-field">
      Plot CAS expression
      <input
        aria-label="CAS expression to plot"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="paste CAS result"
      />
      <button
        type="button"
        onClick={() => {
          if (value.trim()) onPlot(value.trim());
        }}
      >
        Plot as layer
      </button>
    </label>
  );
}

function KeyframeStrip({
  keyframes,
  playing,
  onAdd,
  onDelete,
  onPlay,
}: {
  keyframes: GraphStudio3DWorkspaceProps["keyframes"];
  playing: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onPlay: () => void;
}) {
  return (
    <div className="gs3d-keyframe-strip" aria-label="Camera keyframes">
      <button type="button" onClick={onAdd}>
        Capture keyframe
      </button>
      <button type="button" onClick={onPlay} disabled={keyframes.length < 2}>
        {playing ? "Stop" : "Play"} path
      </button>
      {keyframes.map((keyframe) => (
        <button
          type="button"
          key={keyframe.id}
          onClick={() => onDelete(keyframe.id)}
          title="Remove keyframe"
        >
          {keyframe.label}
        </button>
      ))}
    </div>
  );
}

function DomainMiniMap({
  analysisPoint,
  xRange,
  yRange,
  flyMode,
}: {
  analysisPoint: { x: number; y: number };
  xRange: number;
  yRange: number;
  flyMode: boolean;
}) {
  const x = 50 + (analysisPoint.x / Math.max(1e-6, xRange)) * 40;
  const y = 50 - (analysisPoint.y / Math.max(1e-6, yRange)) * 40;
  return (
    <svg className="gs3d-minimap" viewBox="0 0 100 100" aria-label="Domain mini-map">
      <rect x="8" y="8" width="84" height="84" rx="6" />
      <circle cx={x} cy={y} r="4" />
      {flyMode && <text x="12" y="18">FLY</text>}
    </svg>
  );
}

