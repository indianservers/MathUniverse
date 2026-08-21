import {
  Activity, Bot, Calculator, ChevronDown, ChevronLeft, ChevronRight, Copy, Crosshair, Download, Eye, EyeOff,
  FileJson, Focus, Fullscreen, Grid3X3, Home, Layers3, Maximize2, Menu, Network,
  PanelLeftClose, PanelRightClose, Pause, Pencil, Play, Plus, Redo2, Repeat2, RotateCcw, Save, Settings, Sigma,
  SlidersHorizontal, StepForward, Trash2, Undo2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { SurfaceSampleResult } from "../utils/mathEngine/graph3dUtils";
import type { GraphStudioStylePreset, GraphStudioVariable } from "./types";
import type { SurfaceDifferential } from "./graphIntelligence";
import type { Graph3DSurface } from "./graph3dSurfaceModel";
import { GRAPH_3D_THEMES, graph3DThemeGradient, getGraph3DTheme, type Graph3DThemeId } from "./graph3dThemes";

export type Studio3DMode = "build" | "analyze" | "animate" | "learn";
export type Studio3DInspectorTab = "properties" | "analysis" | "style";
export type Studio3DDockTab = "timeline" | "cross-section" | "values";
export type Studio3DTool = "select" | "point" | "slice";

type Position = { x: number; y: number; z: number };

export type GraphStudio3DWorkspaceProps = {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExportProject: () => void;
  onExportCsv: () => void;
  onCopyEquation: () => void;
  onOpenCas: () => void;
  onOpenGeometry: () => void;
  surfaces: Graph3DSurface[];
  selectedSurfaceId: string;
  onSelectedSurfaceChange: (surfaceId: string) => void;
  onSurfaceChange: (surfaceId: string, patch: Partial<Graph3DSurface>) => void;
  onAddExpression: () => void;
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
  xRange: number;
  yRange: number;
  resolution: number;
  objectPosition: Position;
  referenceObject: "none" | "helix" | "sphere" | "cone" | "cylinder";
  onXRangeChange: (value: number) => void;
  onYRangeChange: (value: number) => void;
  onResolutionChange: (value: number) => void;
  onObjectPositionChange: (value: Position) => void;
  onReferenceObjectChange: (value: "none" | "helix" | "sphere" | "cone" | "cylinder") => void;
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
  savedLibrary: ReactNode;
  shareControl?: ReactNode;
};

const nav = [
  ["Home", "/", Home], ["Workspace", "/workspace", Layers3],
  ["AI Board", "/board", Bot], ["Concept Map", "/concept-map", Network], ["Calculator", "/calculator", Calculator],
] as const;

export default function GraphStudio3DWorkspace(props: GraphStudio3DWorkspaceProps) {
  const { onRedo, onSave, onUndo } = props;
  const [mode, setMode] = useState<Studio3DMode>("build");
  const [inspectorTab, setInspectorTab] = useState<Studio3DInspectorTab>("analysis");
  const [dockTab, setDockTab] = useState<Studio3DDockTab>("timeline");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [fps, setFps] = useState(60);
  const [viewLabel, setViewLabel] = useState("Perspective");
  const tool = props.tool;
  const selectedSurface = props.surfaces.find((surface) => surface.id === props.selectedSurfaceId) ?? props.surfaces[0];
  const visibleSurfaceCount = props.surfaces.filter((surface) => surface.visible).length;
  const errorCount = Object.values(props.surfaceErrors).filter(Boolean).length;

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    let animation = 0;
    const tick = (now: number) => {
      frame += 1;
      if (now - previous >= 1000) {
        setFps(Math.round(frame * 1000 / (now - previous)));
        frame = 0;
        previous = now;
      }
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1100px)");
    const syncPanels = () => {
      if (!media.matches) return;
      setLeftOpen(false);
      setRightOpen(false);
      setDockOpen(false);
    };
    syncPanels();
    media.addEventListener("change", syncPanels);
    return () => media.removeEventListener("change", syncPanels);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSave();
      }
      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo(); else onUndo();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onRedo, onSave, onUndo]);

  const chooseMode = (next: Studio3DMode) => {
    setMode(next);
    if (next === "build") setLeftOpen(true);
    if (next === "analyze") { setRightOpen(true); setInspectorTab("analysis"); }
    if (next === "animate") { setDockOpen(true); setDockTab("timeline"); }
    if (next === "learn") { setRightOpen(true); }
  };

  const chooseTool = (next: Studio3DTool) => props.onToolChange(next);
  const openCrossSection = () => {
    chooseTool("slice");
    props.onSliceEnabledChange(true);
    setDockOpen(true);
    setDockTab("cross-section");
  };

  return <div id="graph-studio-3d-root" className={`graph-studio-3d-shell ${leftOpen ? "has-left" : ""} ${rightOpen ? "has-right" : ""} ${dockOpen ? "has-dock" : ""}`}>
    <header className="gs3d-topbar">
      <div className="gs3d-brand"><div className="gs3d-mark">MU</div><strong>Graph Studio 3D</strong></div>
      <div className="gs3d-project-name">
        {renaming ? <input autoFocus aria-label="Project name" value={props.projectName} onChange={(event) => props.onProjectNameChange(event.target.value)} onBlur={() => setRenaming(false)} onKeyDown={(event) => event.key === "Enter" && setRenaming(false)} /> : <button type="button" onClick={() => setRenaming(true)} title="Rename project"><span>{props.projectName}</span><Pencil /></button>}
      </div>
      <nav className="gs3d-modes" aria-label="Workspace modes">{([ ["build", "Build"], ["analyze", "Analyze"], ["animate", "Animate"], ["learn", "Learn"] ] as Array<[Studio3DMode, string]>).map(([item, label]) => <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => chooseMode(item)}>{label}</button>)}</nav>
      <div className="gs3d-top-actions">
        <TopAction label="Undo" icon={<Undo2 />} onClick={props.onUndo} disabled={!props.canUndo} shortcut="Ctrl+Z" />
        <TopAction label="Redo" icon={<Redo2 />} onClick={props.onRedo} disabled={!props.canRedo} shortcut="Ctrl+Shift+Z" />
        <TopAction label="Save" icon={<Save />} onClick={props.onSave} shortcut="Ctrl+S" />
        <div className="relative"><TopAction label="Export" icon={<Download />} onClick={() => setExportOpen((value) => !value)} />{exportOpen && <ExportMenu props={props} close={() => setExportOpen(false)} />}</div>
        <div className="relative"><TopAction label="Settings" icon={<Settings />} onClick={() => setSettingsOpen((value) => !value)} />{settingsOpen && <SettingsMenu props={props} />}</div>
        {props.shareControl}
      </div>
      <button type="button" className="gs3d-mobile-menu" onClick={() => setLeftOpen((value) => !value)} aria-label="Open expressions"><Menu /></button>
    </header>

    <nav className="gs3d-navrail" aria-label="Graph Studio navigation">
      {nav.map(([label, route, Icon]) => <Link key={label} to={route} title={label}><Icon /><span>{label}</span></Link>)}
      <button type="button" onClick={props.onOpenCas} title="Open in CAS"><Sigma /><span>CAS</span></button>
      <button type="button" onClick={props.onOpenGeometry} title="Open in 3D Geometry"><Layers3 /><span>3D Geometry</span></button>
      <Link to="/math-lab" title="More"><SlidersHorizontal /><span>More</span></Link>
    </nav>

    <aside className={`gs3d-left-panel ${leftOpen ? "open" : ""}`} aria-label="Expressions and layers" aria-hidden={!leftOpen}>
      <PanelHeader title={`Expressions & Layers (${props.surfaces.length})`} onCollapse={() => setLeftOpen(false)} side="left" />
      <div className="gs3d-panel-scroll">
        <div className="gs3d-layer-summary"><span>{visibleSurfaceCount} visible</span><span>{errorCount ? `${errorCount} errors` : "All valid"}</span><button type="button" onClick={() => props.onSetAllVisibility(visibleSurfaceCount !== props.surfaces.length)}>{visibleSurfaceCount === props.surfaces.length ? "Hide all" : "Show all"}</button></div>
        <div className="gs3d-expression-list">
          {props.surfaces.map((surface, index) => <ExpressionCard key={surface.id} index={index} surface={surface} active={surface.id === props.selectedSurfaceId} error={props.surfaceErrors[surface.id]} canDelete={props.surfaces.length > 1} onSelect={() => props.onSelectedSurfaceChange(surface.id)} onChange={(patch) => props.onSurfaceChange(surface.id, patch)} onDuplicate={() => props.onDuplicateExpression(surface.id)} onDelete={() => props.onDeleteExpression(surface.id)} />)}
        </div>
        <button type="button" className="gs3d-add-expression" onClick={props.onAddExpression}><Plus />Add expression</button>
        <div className="gs3d-presets"><button type="button" onClick={props.onRandomExample}>Random surface</button>{props.examples.slice(0, 6).map((example) => <button type="button" key={example} onClick={() => props.onExample(example)}>{example}</button>)}</div>
        <VariableControls variables={props.variables} onChange={props.onVariablesChange} />
        <div className="gs3d-panel-section"><h3>Scene layers</h3>
          <ToggleRow label="Grid" icon={<Grid3X3 />} checked={props.showGrid} onChange={props.onShowGridChange} />
          <ToggleRow label="Axes & coordinates" icon={<Crosshair />} checked={props.showAxes} onChange={props.onShowAxesChange} />
          <ToggleRow label="Infinite axis" icon={<Maximize2 />} checked={props.showInfiniteAxes} onChange={props.onShowInfiniteAxesChange} />
          <ToggleRow label="Labels" icon={<Sigma />} checked={props.showLabels} onChange={props.onShowLabelsChange} />
          <ToggleRow label="Base plane" icon={<Layers3 />} checked={props.showBase} onChange={props.onShowBaseChange} />
          <ToggleRow label="Sampling sweep" icon={<Activity />} checked={selectedSurface.samplingAnimation} onChange={(samplingAnimation) => props.onSurfaceChange(selectedSurface.id, { samplingAnimation })} />
          <ToggleRow label="Cross-section" icon={<SlidersHorizontal />} checked={props.sliceEnabled} onChange={(value) => { props.onSliceEnabledChange(value); if (value) openCrossSection(); }} />
        </div>
      </div>
    </aside>

    <main className="gs3d-canvas-zone">
      {!leftOpen && <button type="button" className="gs3d-panel-reveal left" onClick={() => setLeftOpen(true)} aria-label="Show expressions"><ChevronRight /></button>}
      {!rightOpen && <button type="button" className="gs3d-panel-reveal right" onClick={() => setRightOpen(true)} aria-label="Show inspector"><ChevronLeft /></button>}
      <div className="gs3d-view-menu"><button type="button" onClick={() => setViewOpen((value) => !value)}>{viewLabel} <ChevronDown /></button>{viewOpen && <div>{[["Top", [0.01, 8, 0.01]], ["Front", [0.01, 1.8, 8]], ["Side", [8, 1.8, 0.01]], ["Isometric", [4, 3.2, 6]]] .map(([label, position]) => <button type="button" key={String(label)} onClick={() => { props.onCameraView(position as [number, number, number]); setViewLabel(label as string); setViewOpen(false); }}>{label as string}</button>)}<button type="button" onClick={() => { props.onResetCamera(); setViewLabel("Perspective"); setViewOpen(false); }}>Reset view</button></div>}</div>
      <div className="gs3d-canvas-tools" aria-label="Canvas tools">
        <CanvasTool label="Orbit" icon={<RotateCcw />} active={tool === "select"} onClick={() => chooseTool("select")} />
        <CanvasTool label="Point" icon={<Crosshair />} active={tool === "point"} onClick={() => { chooseTool("point"); setRightOpen(true); setInspectorTab("analysis"); }} />
        <CanvasTool label="Slice" icon={<SlidersHorizontal />} active={tool === "slice"} onClick={openCrossSection} />
      </div>
      <div className="gs3d-canvas-actions"><button type="button" onClick={props.onResetCamera} title="Fit and reset camera"><Focus /></button><button type="button" onClick={() => void toggleFullscreen("graph-studio-3d-root")} title="Full screen"><Maximize2 /></button></div>
      <div id="surface-3d-panel" className="gs3d-scene-host">{props.scene}</div>
      <div className="gs3d-interaction-hint">Drag to orbit <span /> Wheel to zoom <span /> Shift-drag to pan</div>
    </main>

    <aside className={`gs3d-right-panel ${rightOpen ? "open" : ""}`} aria-label="Surface Inspector" aria-hidden={!rightOpen}>
      <PanelHeader title={tool === "slice" ? "Slice Inspector" : tool === "point" ? "Point Inspector" : "Surface Inspector"} onCollapse={() => setRightOpen(false)} side="right" />
      <div className="gs3d-inspector-tabs">{(["properties", "analysis", "style"] as Studio3DInspectorTab[]).map((item) => <button key={item} type="button" className={inspectorTab === item ? "active" : ""} onClick={() => setInspectorTab(item)}>{item}</button>)}</div>
      <div className="gs3d-panel-scroll" aria-live="polite">
        {mode === "learn" ? <LearnPanel expression={selectedSurface.expression} palette={selectedSurface.palette} /> : inspectorTab === "properties" ? <PropertiesPanel props={props} /> : inspectorTab === "style" ? <StylePanel surface={selectedSurface} graphThemeId={props.graphThemeId} onGraphThemeChange={props.onGraphThemeChange} onChange={(patch) => props.onSurfaceChange(selectedSurface.id, patch)} /> : <AnalysisPanel props={props} onCreateCrossSection={openCrossSection} />}
      </div>
    </aside>

    <section className={`gs3d-dock ${dockOpen ? "open" : ""}`} aria-label="Analysis and animation dock">
      <div className="gs3d-dock-tabs">{(["timeline", "cross-section", "values"] as Studio3DDockTab[]).map((item) => <button key={item} type="button" className={dockTab === item ? "active" : ""} onClick={() => { setDockTab(item); setDockOpen(true); }}>{item}</button>)}<button type="button" className="collapse" onClick={() => setDockOpen((value) => !value)} aria-label={dockOpen ? "Collapse dock" : "Expand dock"}>{dockOpen ? <ChevronDown /> : <ChevronRight />}</button></div>
      {dockOpen && <div className="gs3d-dock-content">{dockTab === "timeline" ? <TimelineDock variables={props.variables} onChange={props.onVariablesChange} autoRotate={props.autoRotate} onAutoRotate={props.onAutoRotateChange} /> : dockTab === "cross-section" ? <SliceDock props={props} /> : <ValuesDock props={props} />}</div>}
    </section>

    <footer className="gs3d-status"><span className="online-dot" />Offline ready <span>{fps} FPS</span><span>{props.surfaces.length} surfaces / {visibleSurfaceCount} visible</span><span>{props.resolution} x {props.resolution} adaptive mesh</span><span>{errorCount ? `${errorCount} calculation errors` : "Calculations current"}</span><span className="saved">Auto-saved locally</span></footer>

    <nav className="gs3d-mobile-nav" aria-label="Mobile workspace panels"><button type="button" onClick={() => setLeftOpen(true)}><Layers3 />Expressions</button><button type="button" onClick={() => { chooseTool("point"); setRightOpen(true); setInspectorTab("analysis"); }}><Crosshair />Analyze</button><button type="button" onClick={() => setRightOpen(true)}><SlidersHorizontal />Inspector</button><button type="button" onClick={() => { setDockOpen(true); setDockTab("timeline"); }}><Activity />Timeline</button>{props.shareControl}</nav>
  </div>;
}

function TopAction({ label, icon, onClick, disabled, shortcut }: { label: string; icon: ReactNode; onClick: () => void; disabled?: boolean; shortcut?: string }) { return <button type="button" className="gs3d-top-action" onClick={onClick} disabled={disabled} title={shortcut ? `${label} (${shortcut})` : label}>{icon}<span>{label}</span></button>; }

function PanelHeader({ title, onCollapse, side }: { title: string; onCollapse: () => void; side: "left" | "right" }) { return <div className="gs3d-panel-header"><h2>{title}</h2><button type="button" onClick={onCollapse} aria-label={`Collapse ${title}`}>{side === "left" ? <PanelLeftClose /> : <PanelRightClose />}</button></div>; }

function ExpressionCard({ surface, index, active, error, canDelete, onSelect, onChange, onDuplicate, onDelete }: { surface: Graph3DSurface; index: number; active: boolean; error?: string; canDelete: boolean; onSelect: () => void; onChange: (patch: Partial<Graph3DSurface>) => void; onDuplicate: () => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  return <div className={`gs3d-expression ${active ? "active" : ""} ${surface.visible ? "" : "is-hidden"}`} onClick={onSelect}>
    <button type="button" className="swatch" style={{ background: `linear-gradient(${surface.colorHigh}, ${surface.colorLow})` }} onClick={(event) => { event.stopPropagation(); onSelect(); }} aria-label={`Edit ${surface.name} style`} />
    <div className="expression-main">
      <div className="expression-label"><span>{index + 1}</span><input aria-label={`Name ${surface.name}`} value={surface.name} onChange={(event) => onChange({ name: event.target.value })} onClick={(event) => event.stopPropagation()} /></div>
      <button type="button" className="expression-text" onClick={() => setEditing((value) => !value)}>z = {surface.expression}</button>
      {editing && <input autoFocus aria-label={`Edit ${surface.name} expression`} value={surface.expression} onChange={(event) => onChange({ expression: event.target.value })} onKeyDown={(event) => event.key === "Enter" && setEditing(false)} onClick={(event) => event.stopPropagation()} />}
      {error && <p role="alert">{error}</p>}
    </div>
    <button type="button" className="icon-action" onClick={(event) => { event.stopPropagation(); onChange({ visible: !surface.visible }); }} aria-label={surface.visible ? `Hide ${surface.name}` : `Show ${surface.name}`}>{surface.visible ? <Eye /> : <EyeOff />}</button>
    <button type="button" className="icon-action" onClick={(event) => { event.stopPropagation(); onDuplicate(); }} aria-label={`Duplicate ${surface.name}`}><Copy /></button>
    <button type="button" className="icon-action danger" disabled={!canDelete} onClick={(event) => { event.stopPropagation(); onDelete(); }} aria-label={`Delete ${surface.name}`}><Trash2 /></button>
  </div>;
}

function VariableControls({ variables, onChange }: { variables: GraphStudioVariable[]; onChange: (variables: GraphStudioVariable[]) => void }) { if (!variables.length) return <div className="gs3d-panel-section"><h3>Parameters</h3><p className="gs3d-muted">Use a, b, or t in an expression to create an animated parameter.</p></div>; return <div className="gs3d-panel-section"><h3>Parameters</h3>{variables.map((variable, index) => <div className="gs3d-variable" key={variable.id}><div><strong>{variable.name}</strong><span>{format(variable.min)}</span><span>{format(variable.max)}</span><input aria-label={`${variable.name} value`} type="number" value={variable.value} step={variable.step} onChange={(event) => onChange(variables.map((item, itemIndex) => itemIndex === index ? { ...item, value: Number(event.target.value) } : item))} /></div><input aria-label={`${variable.name} slider`} type="range" min={variable.min} max={variable.max} step={variable.step} value={variable.value} onChange={(event) => onChange(variables.map((item, itemIndex) => itemIndex === index ? { ...item, value: Number(event.target.value) } : item))} /></div>)}</div>; }

function ToggleRow({ label, icon, checked, onChange }: { label: string; icon: ReactNode; checked: boolean; onChange: (value: boolean) => void }) { return <label className="gs3d-toggle-row"><span>{icon}{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i /></label>; }
function CanvasTool({ label, icon, active, onClick }: { label: string; icon: ReactNode; active: boolean; onClick: () => void }) { return <button type="button" className={active ? "active" : ""} onClick={onClick} title={label}>{icon}<span>{label}</span></button>; }

function PropertiesPanel({ props }: { props: GraphStudio3DWorkspaceProps }) { return <div className="gs3d-inspector-content"><InspectorGroup title="Domain"><CompactSlider label="X range" value={props.xRange} min={1} max={8} step={0.25} onChange={props.onXRangeChange} /><CompactSlider label="Y range" value={props.yRange} min={1} max={8} step={0.25} onChange={props.onYRangeChange} /></InspectorGroup><InspectorGroup title="Transform"><CompactSlider label="Position X" value={props.objectPosition.x} min={-6} max={6} step={0.25} onChange={(x) => props.onObjectPositionChange({ ...props.objectPosition, x })} /><CompactSlider label="Position Y" value={props.objectPosition.y} min={-6} max={6} step={0.25} onChange={(y) => props.onObjectPositionChange({ ...props.objectPosition, y })} /><CompactSlider label="Position Z" value={props.objectPosition.z} min={-4} max={4} step={0.25} onChange={(z) => props.onObjectPositionChange({ ...props.objectPosition, z })} /></InspectorGroup><InspectorGroup title="Objects"><label className="gs3d-select-field">Parametric or solid overlay<select value={props.referenceObject} onChange={(event) => props.onReferenceObjectChange(event.target.value as GraphStudio3DWorkspaceProps["referenceObject"])}><option value="none">None</option><option value="helix">Parametric helix</option><option value="sphere">Sphere</option><option value="cone">Cone</option><option value="cylinder">Cylinder</option></select></label></InspectorGroup><InspectorGroup title="Mesh"><CompactSlider label="Resolution" value={props.resolution} min={12} max={80} step={2} onChange={props.onResolutionChange} /><p className="gs3d-muted">{props.resolution} x {props.resolution} samples. Higher density costs more GPU time.</p></InspectorGroup></div>; }

function AnalysisPanel({ props, onCreateCrossSection }: { props: GraphStudio3DWorkspaceProps; onCreateCrossSection: () => void }) { const d = props.differential; return <div className="gs3d-inspector-content"><div className="gs3d-analysis-table"><Metric label="Domain" value={`x in [-${props.xRange}, ${props.xRange}], y in [-${props.yRange}, ${props.yRange}]`} status="viewport" /><Metric label="Range" value={props.surface.minZ === null ? "No real samples" : `z in [${format(props.surface.minZ)}, ${format(props.surface.maxZ ?? 0)}]`} status="numerical" /><Metric label="Selected point" value={d ? `(${format(d.point.x)}, ${format(d.point.y)}, ${format(d.point.z)})` : "Outside real surface"} status="numerical" /><Metric label="Gradient" value={d ? `(${format(d.gradient.x)}, ${format(d.gradient.y)})` : "Unavailable"} status="numerical" /><Metric label="Normal" value={d ? `(${d.normal.map(format).join(", ")})` : "Unavailable"} status="numerical" /></div><InspectorGroup title="Point analysis"><p className="gs3d-muted">Choose Point, then click the surface, or refine the coordinates below.</p><CompactSlider label="Point X" value={props.analysisPoint.x} min={-props.xRange} max={props.xRange} step={0.1} onChange={(x) => props.onAnalysisPointChange({ ...props.analysisPoint, x })} /><CompactSlider label="Point Y" value={props.analysisPoint.y} min={-props.yRange} max={props.yRange} step={0.1} onChange={(y) => props.onAnalysisPointChange({ ...props.analysisPoint, y })} /></InspectorGroup><div className="gs3d-analysis-actions"><button type="button" onClick={() => props.onExactPartial("x")}>Exact partial x</button><button type="button" onClick={() => props.onExactPartial("y")}>Exact partial y</button><button type="button" onClick={onCreateCrossSection}>Create cross-section</button></div>{d && <details><summary>Tangent plane and method</summary><p className="formula-result">{d.tangentPlane}</p>{d.steps.map((step) => <p className="gs3d-muted" key={step}>{step}</p>)}</details>}{props.exactPartial && <div className="gs3d-exact"><span>Exact CAS</span><code>{props.exactPartial}</code><button type="button" onClick={props.onUsePartialSurface}>Add derivative surface</button></div>}</div>; }

function StylePanel({ surface, graphThemeId, onGraphThemeChange, onChange }: { surface: Graph3DSurface; graphThemeId: Graph3DThemeId; onGraphThemeChange: (value: Graph3DThemeId) => void; onChange: (patch: Partial<Graph3DSurface>) => void }) {
  const selectedTheme = getGraph3DTheme(graphThemeId);
  return <div className="gs3d-inspector-content">
    <InspectorGroup title="Graph theme">
      <div className="gs3d-theme-grid" role="radiogroup" aria-label="3D graph colour theme">
        {GRAPH_3D_THEMES.map((item, index) => <button key={item.id} type="button" role="radio" aria-checked={item.id === graphThemeId} className={item.id === graphThemeId ? "active" : ""} onClick={() => onGraphThemeChange(item.id)} onKeyDown={(event) => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const direction = event.key === "ArrowRight" ? 1 : -1; onGraphThemeChange(GRAPH_3D_THEMES[(index + direction + GRAPH_3D_THEMES.length) % GRAPH_3D_THEMES.length].id); }}>
          <span className="gs3d-theme-swatch" style={{ background: graph3DThemeGradient(item) }} />
          <span>{item.name}</span>
        </button>)}
      </div>
      <p className="gs3d-theme-description">{selectedTheme.description}</p>
    </InspectorGroup>
    <InspectorGroup title={surface.name}><label className="gs3d-select-field">Colour mapping<select value={surface.palette} onChange={(event) => onChange({ palette: event.target.value as Graph3DSurface["palette"] })}><option value="height">Use graph theme</option><option value="custom">Custom gradient</option><option value="thermal">Thermal override</option><option value="contour">Contour bands</option><option value="mono">Pearl override</option></select></label><div className="gs3d-color-pair"><label>Low<input type="color" value={surface.colorLow} onChange={(event) => onChange({ colorLow: event.target.value, palette: "custom" })} /></label><label>High<input type="color" value={surface.colorHigh} onChange={(event) => onChange({ colorHigh: event.target.value, palette: "custom" })} /></label></div><CompactSlider label="Opacity" value={surface.opacity} min={0.05} max={1} step={0.05} onChange={(opacity) => onChange({ opacity })} /><ToggleRow label="Visible" icon={<Eye />} checked={surface.visible} onChange={(visible) => onChange({ visible })} /><ToggleRow label="Wireframe" icon={<Grid3X3 />} checked={surface.wireframe} onChange={(wireframe) => onChange({ wireframe })} /><ToggleRow label="Sample points" icon={<Activity />} checked={surface.showPoints} onChange={(showPoints) => onChange({ showPoints })} /><ToggleRow label="Surface scan" icon={<Activity />} checked={surface.samplingAnimation} onChange={(samplingAnimation) => onChange({ samplingAnimation })} /></InspectorGroup>
    <div className="gs3d-surface-preview" style={{ background: surface.palette === "custom" ? `linear-gradient(90deg, ${surface.colorLow}, ${surface.colorHigh})` : graph3DThemeGradient(selectedTheme) }}><span>Low z</span><strong>{surface.name}</strong><span>High z</span></div>
  </div>;
}

function LearnPanel({ expression, palette }: { expression: string; palette: string }) { return <div className="gs3d-inspector-content"><InspectorGroup title="Reading this surface"><p>For every point (x, y) on the base grid, the equation <code>z = {expression}</code> supplies the height z.</p></InspectorGroup><details open><summary>What the colour means</summary><p>The {palette} palette maps low and high z-values. Colour is a height cue, not a second measured variable.</p></details><details><summary>How to inspect it</summary><p>Orbit to compare slopes from different directions. Use Point to inspect a gradient or Slice to expose a two-dimensional cross-section.</p></details><details><summary>Concept connection</summary><p>Surfaces model terrain, temperature fields, optimization loss landscapes, and multivariable functions.</p></details></div>; }

function TimelineDock({ variables, onChange, autoRotate, onAutoRotate }: { variables: GraphStudioVariable[]; onChange: (variables: GraphStudioVariable[]) => void; autoRotate: boolean; onAutoRotate: (value: boolean) => void }) { const primary = variables[0]; const playing = variables.some((item) => item.playing); return <div className="gs3d-timeline"><button type="button" className="play" aria-label={playing ? "Pause parameter animation" : "Play parameter animation"} disabled={!primary} onClick={() => onChange(variables.map((item) => ({ ...item, playing: !playing })))}>{playing ? <Pause /> : <Play />}</button>{primary ? <><strong>{primary.name}</strong><input aria-label="Timeline value" type="number" value={primary.value} step={primary.step} onChange={(event) => onChange(variables.map((item, index) => index ? item : { ...item, value: Number(event.target.value) }))} /><input aria-label="Timeline scrubber" className="scrubber" type="range" min={primary.min} max={primary.max} step={primary.step} value={primary.value} onChange={(event) => onChange(variables.map((item, index) => index ? item : { ...item, value: Number(event.target.value) }))} /><span>{format(primary.max)}</span><label>Speed<select value={primary.speed} onChange={(event) => onChange(variables.map((item) => ({ ...item, speed: Number(event.target.value) })))}><option value="0.5">0.5x</option><option value="1">1x</option><option value="2">2x</option></select></label><button type="button" onClick={() => onChange(variables.map((item) => ({ ...item, playback: item.playback === "loop" ? "ping-pong" : "loop" })))}><Repeat2 />{primary.playback}</button><button type="button" onClick={() => onChange(variables.map((item, index) => index ? item : { ...item, value: Math.min(item.max, item.value + item.step) }))}><StepForward />Step</button></> : <p>No dynamic parameter yet. Add a, b, or t to an expression.</p>}<button type="button" className={autoRotate ? "active" : ""} aria-pressed={autoRotate} onClick={() => onAutoRotate(!autoRotate)}><RotateCcw />{autoRotate ? "Pause orbit" : "Orbit"}</button></div>; }

function SliceDock({ props }: { props: GraphStudio3DWorkspaceProps }) { const min = props.sliceAxis === "z" ? (props.surface.minZ ?? -3) : -(props.sliceAxis === "x" ? props.xRange : props.yRange); const max = props.sliceAxis === "z" ? (props.surface.maxZ ?? 3) : (props.sliceAxis === "x" ? props.xRange : props.yRange); return <div className="gs3d-slice-dock"><label>Axis<select value={props.sliceAxis} onChange={(event) => props.onSliceAxisChange(event.target.value as "x" | "y" | "z")}><option value="x">X</option><option value="y">Y</option><option value="z">Z</option></select></label><label>Position<input type="number" value={props.sliceValue} step="0.1" onChange={(event) => props.onSliceValueChange(Number(event.target.value))} /></label><input aria-label="Cross-section position" type="range" min={min} max={max} step="0.1" value={props.sliceValue} onChange={(event) => props.onSliceValueChange(Number(event.target.value))} /><ToggleRow label="Cutting plane and curve" icon={<SlidersHorizontal />} checked={props.sliceEnabled} onChange={props.onSliceEnabledChange} /><div className="gs3d-cross-preview">{props.crossSectionPreview}</div></div>; }

function ValuesDock({ props }: { props: GraphStudio3DWorkspaceProps }) { return <div className="gs3d-values-dock"><div><span>Point</span><strong>{props.differential ? `${format(props.differential.point.x)}, ${format(props.differential.point.y)}, ${format(props.differential.point.z)}` : "Unavailable"}</strong></div><div><span>Gradient</span><strong>{props.differential ? `${format(props.differential.gradient.x)}, ${format(props.differential.gradient.y)}` : "Unavailable"}</strong></div><div><span>Normal</span><strong>{props.differential ? props.differential.normal.map(format).join(", ") : "Unavailable"}</strong></div><div className="gs3d-sample-table"><span>Representative samples</span><table><thead><tr><th>x</th><th>y</th><th>z</th></tr></thead><tbody>{props.sampleRows.slice(0, 5).map((point, index) => <tr key={`${point.x}-${point.y}-${index}`}><td>{format(point.x)}</td><td>{format(point.y)}</td><td>{point.valid && point.z !== null ? format(point.z) : "undefined"}</td></tr>)}</tbody></table></div></div>; }

function InspectorGroup({ title, children }: { title: string; children: ReactNode }) { return <section className="gs3d-inspector-group"><h3>{title}</h3>{children}</section>; }
function Metric({ label, value, status }: { label: string; value: string; status: string }) { return <div><span>{label}<i>{status}</i></span><strong>{value}</strong></div>; }
function CompactSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) { return <label className="gs3d-compact-slider"><span>{label}<b>{format(value)}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }

function ExportMenu({ props, close }: { props: GraphStudio3DWorkspaceProps; close: () => void }) { return <div className="gs3d-popover export"><button type="button" onClick={() => { void exportCanvas("surface-3d-panel", "graph-studio-3d.png"); close(); }}><Fullscreen />PNG image</button><button type="button" onClick={() => { props.onExportCsv(); close(); }}><Download />Sampled values CSV</button><button type="button" onClick={() => { props.onExportProject(); close(); }}><FileJson />Project file</button><button type="button" onClick={() => { props.onCopyEquation(); close(); }}><Copy />Copy equation</button></div>; }
function SettingsMenu({ props }: { props: GraphStudio3DWorkspaceProps }) { return <div className="gs3d-popover settings"><p>Saved surfaces</p>{props.savedLibrary}<label>Appearance<select value={props.stylePreset} onChange={(event) => props.onStylePresetChange(event.target.value as GraphStudioStylePreset)}><option value="classroom">Classroom</option><option value="contrast">High contrast</option><option value="colorblind">Colour-blind safe</option><option value="print">Print</option><option value="neon">Neon</option><option value="presentation">Presentation</option><option value="paper">Scientific paper</option></select></label></div>; }

async function toggleFullscreen(id: string) { const target = document.getElementById(id); if (!target) return; if (document.fullscreenElement) await document.exitFullscreen(); else await target.requestFullscreen?.(); }
async function exportCanvas(id: string, filename: string) { const canvas = document.getElementById(id)?.querySelector("canvas"); if (!canvas) return; const anchor = document.createElement("a"); anchor.href = canvas.toDataURL("image/png"); anchor.download = filename; anchor.click(); }
function format(value: number) { return `${Math.round(value * 1000) / 1000}`; }
