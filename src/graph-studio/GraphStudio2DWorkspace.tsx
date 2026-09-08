import {
  Activity, ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Copy, Crosshair, Download, Eye, EyeOff,
  FileJson, Focus, GripVertical, Grid3X3, Layers3, LineChart, Maximize2, Menu, MoreVertical,
  Lock, PanelLeftClose, PanelLeftOpen, PanelRightClose, Pause, Pencil, Play, Plus, Redo2, Repeat2, RotateCcw, Save, Settings, Sigma,
  SlidersHorizontal, Table2, Trash2, Undo2, Unlock, ZoomIn, ZoomOut,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { FunctionGraphView } from "../components/math-lab/FunctionGraphCanvas";
import { ExportImageButton } from "../components/ui/UiFeedback";
import type { GraphSample } from "../utils/mathEngine/graphSampler";
import type { GraphDataRow, LinearRegressionResult, RegressionKind } from "./dataAnalysis";
import type { ExactGraphAnalysis } from "./exactGraphAnalysis";
import { zoomGraphView } from "./graphViewUtils";
import type { GraphStudioStylePreset, GraphStudioVariable } from "./types";

export type PiecewiseSegment = { id: string; expression: string; min: number; max: number; includeMin: boolean; includeMax: boolean };
export type GraphTransform = { parent: string; a: number; b: number; h: number; k: number; enabled: boolean };
type FunctionRow = { id: string; input: string; color: string; visible: boolean; name?: string; label?: string; note?: string; group?: string; locked?: boolean; opacity?: number; imageUrl?: string; imageX?: number; imageY?: number; imageWidth?: number; imageHeight?: number; piecewise?: PiecewiseSegment[]; transform?: GraphTransform };
type PlottedRow = FunctionRow & { points: GraphSample[]; error?: string };
type Point = { x: number; y: number };
type InspectorTab = "properties" | "analysis" | "style";
type DockTab = "table" | "data" | "calculations";

export type GraphStudio2DWorkspaceProps = {
  projectName: string; onProjectNameChange: (name: string) => void;
  canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void; onSave: () => void;
  onExportProject: () => void; onExportCsv: () => void; onExportSvg: () => void; onExportPdf: () => void; onCopyShareLink: () => void; onCopyEmbed: () => void; onCopyEquation: () => void;
  functions: FunctionRow[]; plotted: PlottedRow[]; selectedId: string; onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<FunctionRow>) => void; onAdd: () => void; onDuplicate: (id: string) => void; onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRandom: () => void; onReset: () => void; examples: string[]; onExample: (value: string) => void;
  variables: GraphStudioVariable[]; onVariablesChange: (variables: GraphStudioVariable[]) => void;
  dataRows: GraphDataRow[]; onDataRowsChange: (rows: GraphDataRow[]) => void; onPasteData: (text: string) => void;
  showData: boolean; showRegression: boolean; showResiduals: boolean;
  onShowDataChange: (value: boolean) => void; onShowRegressionChange: (value: boolean) => void; onShowResidualsChange: (value: boolean) => void;
  regression: LinearRegressionResult | null;
  regressionKind: RegressionKind; onRegressionKindChange: (kind: RegressionKind) => void;
  view: FunctionGraphView; onViewChange: (view: FunctionGraphView) => void; onFitView: () => void; onResetView: () => void;
  showGrid: boolean; showAxes: boolean; traceMode: boolean; traceX: number;
  onShowGridChange: (value: boolean) => void; onShowAxesChange: (value: boolean) => void; onTraceModeChange: (value: boolean) => void; onTraceXChange: (value: number) => void;
  logX: boolean; logY: boolean; onLogXChange: (value: boolean) => void; onLogYChange: (value: boolean) => void;
  onAddConstruction: (kind: "point" | "line" | "tangent" | "normal" | "conic") => void;
  linkedPoint: Point | null;
  canvas: ReactNode;
  roots: number[]; yIntercept: number | null; visibleRange: { min: number | null; max: number | null };
  discontinuities: number[]; minima: Point[]; maxima: Point[]; intersections: Point[]; derivativePoints: GraphSample[];
  showDerivative: boolean; onShowDerivativeChange: (value: boolean) => void;
  showTaylor: boolean; onShowTaylorChange: (value: boolean) => void; taylorCenter: number; taylorDegree: number; onTaylorCenterChange: (value: number) => void; onTaylorDegreeChange: (value: number) => void;
  showIntegral: boolean; onShowIntegralChange: (value: boolean) => void; integralStart: number; integralEnd: number; integralValue: number | null;
  onIntegralStartChange: (value: number) => void; onIntegralEndChange: (value: number) => void;
  tableStart: number; tableEnd: number; tableStep: number; tableRows: Array<{ x: number; y: number | null; valid: boolean }>;
  onTableStartChange: (value: number) => void; onTableEndChange: (value: number) => void; onTableStepChange: (value: number) => void;
  stylePreset: GraphStudioStylePreset; onStylePresetChange: (value: GraphStudioStylePreset) => void;
  exactAnalysis: ExactGraphAnalysis;
  exactIntersections?: string;
  asymptotes: { vertical: number[]; horizontal: number[] };
  savedLibrary: ReactNode;
};

export default function GraphStudio2DWorkspace(props: GraphStudio2DWorkspaceProps) {
  const [tab, setTab] = useState<InspectorTab>("analysis");
  const [dockTab, setDockTab] = useState<DockTab>("table");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frames = 0; let started = performance.now(); let request = 0;
    const tick = (now: number) => { frames += 1; if (now - started >= 1000) { setFps(Math.round(frames * 1000 / (now - started))); frames = 0; started = now; } request = requestAnimationFrame(tick); };
    request = requestAnimationFrame(tick); return () => cancelAnimationFrame(request);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1100px)");
    const sync = () => { if (media.matches) { setLeftOpen(false); setRightOpen(false); setDockOpen(false); } };
    sync(); media.addEventListener("change", sync); return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const closeHelp = (event: KeyboardEvent) => event.key === "Escape" && setHelpOpen(false);
    window.addEventListener("keydown", closeHelp);
    return () => window.removeEventListener("keydown", closeHelp);
  }, []);
  const selected = props.functions.find((item) => item.id === props.selectedId) ?? props.functions[0];

  return <div className={`graph-studio-3d-shell graph-studio-surface-shell graph-studio-2d-shell ${leftOpen ? "has-left" : ""} ${rightOpen ? "has-right" : ""} ${dockOpen ? "has-dock" : ""}`}>
    <header className="gs3d-topbar">
      <div className="gs3d-brand"><div className="gs3d-mark">MU</div><strong>Graph Studio 2D</strong></div>
      <div className="gs3d-project-name">{renaming ? <input autoFocus aria-label="Project name" value={props.projectName} onChange={(event) => props.onProjectNameChange(event.target.value)} onBlur={() => setRenaming(false)} onKeyDown={(event) => event.key === "Enter" && setRenaming(false)} /> : <button type="button" onClick={() => setRenaming(true)} title="Rename project"><span>{props.projectName}</span><Pencil /></button>}</div>
      <div className="gs3d-top-actions">
        <div className="gs2d-view-toolbar" aria-label="Graph view controls">
          <span>Cartesian</span>
          <button type="button" onClick={() => props.onViewChange(zoomGraphView(props.view, 0.8))} title="Zoom in" aria-label="Zoom in"><ZoomIn /></button>
          <button type="button" onClick={() => props.onViewChange(zoomGraphView(props.view, 1.25))} title="Zoom out" aria-label="Zoom out"><ZoomOut /></button>
          <button type="button" onClick={props.onFitView} title="Fit visible graphs" aria-label="Fit visible graphs"><Focus /></button>
          <button type="button" onClick={props.onResetView} title="Reset to default window" aria-label="Reset to default window"><RotateCcw /></button>
          <button type="button" onClick={() => void toggleFullscreen("graphing-canvas-panel")} title="Full screen" aria-label="View graph full screen"><Maximize2 /></button>
        </div>
        <TopAction label="Undo" icon={<Undo2 />} onClick={props.onUndo} disabled={!props.canUndo} />
        <TopAction label="Redo" icon={<Redo2 />} onClick={props.onRedo} disabled={!props.canRedo} />
        <TopAction label="Save" icon={<Save />} onClick={props.onSave} />
        <div className="relative"><TopAction label="Export" icon={<Download />} onClick={() => setExportOpen((value) => !value)} />{exportOpen && <ExportMenu props={props} close={() => setExportOpen(false)} />}</div>
        <div className="relative"><TopAction label="Settings" icon={<Settings />} onClick={() => setSettingsOpen((value) => !value)} />{settingsOpen && <SettingsMenu props={props} />}</div>
        <div className="relative gs3d-help-control"><TopAction label="Help" icon={<CircleHelp />} onClick={() => setHelpOpen((value) => !value)} />{helpOpen && <GraphHelpPopover selected={selected} roots={props.roots} minima={props.minima} onClose={() => setHelpOpen(false)} />}</div>
        {!leftOpen && <TopAction label="Expressions" icon={<PanelLeftOpen />} onClick={() => setLeftOpen(true)} />}
      </div>
      <button type="button" className="gs3d-mobile-menu" onClick={() => setLeftOpen((value) => !value)} aria-label="Open expressions"><Menu /></button>
    </header>

    <aside className={`gs3d-left-panel ${leftOpen ? "open" : ""}`} aria-label="Expressions and layers">
      <PanelHeader title="Expressions & Layers" onCollapse={() => setLeftOpen(false)} side="left" />
      <div className="gs3d-panel-scroll">
        {props.functions.map((item, index) => <ExpressionCard key={item.id} item={item} index={index} error={props.plotted.find((plotted) => plotted.id === item.id)?.error} active={item.id === props.selectedId} canDelete={props.functions.length > 1} onSelect={() => props.onSelect(item.id)} onUpdate={(patch) => props.onUpdate(item.id, patch)} onDuplicate={() => props.onDuplicate(item.id)} onRemove={() => props.onRemove(item.id)} onMove={(direction) => props.onMove(item.id, direction)} />)}
        <button type="button" className="gs3d-add-expression" onClick={props.onAdd}><Plus />Add expression</button>
        <div className="gs3d-presets"><button type="button" onClick={props.onReset}>Reset example</button><button type="button" onClick={props.onRandom}>Random function</button>{props.examples.slice(0, 5).map((example) => <button type="button" key={example} onClick={() => props.onExample(example)}>{example}</button>)}</div>
        <Variables variables={props.variables} onChange={props.onVariablesChange} />
        <div className="gs3d-panel-section gs2d-advanced-layers"><h3>Advanced graph families</h3><div><button type="button" onClick={() => props.onExample("seq(n^2,0,12)")}>Sequence</button><button type="button" onClick={() => props.onExample("recur(1,1.25*prev,18)")}>Recurrence</button><button type="button" onClick={() => props.onExample("cobweb(0.2,3.2*prev*(1-prev),24)")}>Cobweb</button><button type="button" onClick={() => props.onExample("param(3*cos(t),2*sin(t),0,2*pi)")}>Parametric</button><button type="button" onClick={() => props.onExample("contour(x^2+y^2,1;4;9)")}>Contours</button><button type="button" onClick={() => props.onExample("r=2*sin(3*theta),theta=0..pi")}>Polar range</button><button type="button" onClick={() => props.onExample("vector(-y,x)")}>Vector field</button><button type="button" onClick={() => props.onExample("slope(x-y)")}>Slope field</button></div></div>
        <div className="gs3d-panel-section"><h3>Graph layers</h3><Toggle label="Grid" icon={<Grid3X3 />} checked={props.showGrid} onChange={props.onShowGridChange} /><Toggle label="Axes & coordinates" icon={<Crosshair />} checked={props.showAxes} onChange={props.onShowAxesChange} /><Toggle label="Trace markers" icon={<Activity />} checked={props.traceMode} onChange={props.onTraceModeChange} /></div>
      </div>
    </aside>

    <main className="gs3d-canvas-zone gs2d-canvas-zone">
      {!leftOpen && <button type="button" className="gs3d-panel-reveal left" onClick={() => setLeftOpen(true)} aria-label="Show expressions"><ChevronRight /></button>}
      {!rightOpen && <button type="button" className="gs3d-panel-reveal right" onClick={() => setRightOpen(true)} aria-label="Show inspector"><ChevronLeft /></button>}
      <div id="graphing-canvas-panel" className="gs3d-scene-host gs2d-scene-host" data-graph-preset={props.stylePreset}>{props.canvas}</div>
    </main>

    <aside className={`gs3d-right-panel ${rightOpen ? "open" : ""}`} aria-label="Function Inspector">
      <PanelHeader title="Function Inspector" onCollapse={() => setRightOpen(false)} side="right" />
      <div className="gs3d-inspector-tabs">{(["properties", "analysis", "style"] as InspectorTab[]).map((item) => <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{capital(item)}</button>)}</div>
      <div className="gs3d-panel-scroll">{tab === "properties" ? <Properties props={props} selected={selected} /> : tab === "style" ? <Style props={props} selected={selected} /> : <Analysis props={props} selected={selected} />}</div>
    </aside>

    <section className={`gs3d-dock ${dockOpen ? "open" : ""}`} aria-label="Graph data dock">
      <div className="gs3d-dock-tabs">{(["table", "data", "calculations"] as DockTab[]).map((item) => <button key={item} type="button" className={dockTab === item ? "active" : ""} onClick={() => { setDockTab(item); setDockOpen(true); }}>{item === "table" ? "Function table" : item === "data" ? "Data & regression" : capital(item)}</button>)}<button type="button" className="collapse" onClick={() => setDockOpen((value) => !value)} aria-label={dockOpen ? "Collapse dock" : "Expand dock"}>{dockOpen ? <ChevronDown /> : <ChevronRight />}</button></div>
      {dockOpen && <div className="gs3d-dock-content">{dockTab === "table" ? <TableDock props={props} selected={selected} /> : dockTab === "data" ? <DataDock props={props} /> : <Calculations props={props} />}</div>}
    </section>

    <footer className="gs3d-status"><span className="online-dot" />Offline ready <span>{fps} FPS</span><span>Adaptive sampling</span><span>{props.plotted.some((item) => item.error) ? "Fix the highlighted expression" : "Calculations current"}</span><span className="saved">Saved locally</span></footer>
    <nav className="gs3d-mobile-nav" aria-label="Mobile workspace panels"><button type="button" onClick={() => setLeftOpen(true)}><Layers3 />Expressions</button><button type="button" onClick={() => setRightOpen(true)}><SlidersHorizontal />Inspector</button><button type="button" onClick={() => { setDockOpen(true); setDockTab("table"); }}><Table2 />Values</button></nav>
  </div>;

}

function TopAction({ label, icon, onClick, disabled }: { label: string; icon: ReactNode; onClick: () => void; disabled?: boolean }) { return <button type="button" className="gs3d-top-action" onClick={onClick} disabled={disabled} title={label}>{icon}<span>{label}</span></button>; }
function PanelHeader({ title, onCollapse, side }: { title: string; onCollapse: () => void; side: "left" | "right" }) { return <div className="gs3d-panel-header"><h2>{title}</h2><button type="button" onClick={onCollapse} aria-label={`Collapse ${title}`}>{side === "left" ? <PanelLeftClose /> : <PanelRightClose />}</button></div>; }

function ExpressionCard({ item, index, error, active, canDelete, onSelect, onUpdate, onDuplicate, onRemove, onMove }: { item: FunctionRow; index: number; error?: string; active: boolean; canDelete: boolean; onSelect: () => void; onUpdate: (patch: Partial<FunctionRow>) => void; onDuplicate: () => void; onRemove: () => void; onMove: (direction: -1 | 1) => void }) {
  const [menu, setMenu] = useState(false);
  const errorId = `function-${item.id}-error`;
  return <div className={`gs3d-expression gs2d-expression ${active ? "active" : ""} ${error ? "has-error" : ""}`} onClick={onSelect}>
    <GripVertical />
    <input type="color" aria-label={`Function ${index + 1} colour`} value={item.color} onChange={(event) => onUpdate({ color: event.target.value })} />
    <div className="expression-main"><span>{item.name || `f${index + 1}(x)`}{item.group ? <small>{item.group}</small> : null}</span><input aria-label={`Function ${index + 1}`} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} value={item.input} readOnly={item.locked} onChange={(event) => onUpdate({ input: event.target.value })} />{error && <p id={errorId} className="gs2d-expression-error" role="alert"><strong>{error}</strong><span>{expressionSuggestion(error)}</span></p>}</div>
    <button type="button" className="icon-action" onClick={(event) => { event.stopPropagation(); onUpdate({ visible: !item.visible }); }} aria-label={item.visible ? "Hide function" : "Show function"}>{item.visible ? <Eye /> : <EyeOff />}</button>
    <div className="relative"><button type="button" className="icon-action" onClick={(event) => { event.stopPropagation(); setMenu((value) => !value); }} aria-label="Expression options">{item.locked ? <Lock /> : <MoreVertical />}</button>{menu && <div className="gs3d-popover gs2d-expression-menu"><button type="button" onClick={() => onUpdate({ locked: !item.locked })}>{item.locked ? <Unlock /> : <Lock />}{item.locked ? "Unlock" : "Lock"}</button><button type="button" onClick={() => onMove(-1)}><ArrowUp />Move layer up</button><button type="button" onClick={() => onMove(1)}><ArrowDown />Move layer down</button><button type="button" onClick={onDuplicate}><Copy />Duplicate</button><button type="button" onClick={() => onUpdate({ input: "" })} disabled={item.locked}><RotateCcw />Clear</button><button type="button" onClick={onRemove} disabled={!canDelete || item.locked}><Trash2 />Delete</button></div>}</div>
    {active && !item.locked && <div className="gs2d-expression-assist" aria-label="Expression templates">
      <button type="button" onClick={(event) => { event.stopPropagation(); onUpdate({ input: appendSnippet(item.input, "pi") }); }}>π</button>
      <button type="button" onClick={(event) => { event.stopPropagation(); onUpdate({ input: appendSnippet(item.input, "sqrt(x)") }); }}>√</button>
      <button type="button" onClick={(event) => { event.stopPropagation(); onUpdate({ input: appendSnippet(item.input, "^2") }); }}>x²</button>
      <button type="button" onClick={(event) => { event.stopPropagation(); onUpdate({ input: `${item.input || "sin(x)"} {-pi <= x <= pi}` }); }}>Restrict</button>
      <button type="button" onClick={(event) => { event.stopPropagation(); onUpdate({ input: "{x < 0: -x, x >= 0: x}" }); }}>Piecewise</button>
    </div>}
  </div>;
}

function Variables({ variables, onChange }: { variables: GraphStudioVariable[]; onChange: (value: GraphStudioVariable[]) => void }) {
  const patch = (id: string, values: Partial<GraphStudioVariable>) => onChange(variables.map((item) => item.id === id ? { ...item, ...values } : item));
  return <div className="gs3d-panel-section"><h3>Parameters & animation</h3>{variables.length ? variables.map((variable) => <div className="gs3d-variable gs2d-variable" key={variable.id}>
    <div><strong>{variable.name}</strong><span>{format(variable.min)}</span><span>{format(variable.max)}</span><input type="number" aria-label={`${variable.name} value`} value={Number(variable.value.toFixed(4))} step={variable.step} onChange={(event) => patch(variable.id, { value: Number(event.target.value) })} /></div>
    <input type="range" aria-label={`${variable.name} slider`} min={variable.min} max={variable.max} step={variable.step} value={variable.value} onChange={(event) => patch(variable.id, { value: Number(event.target.value) })} />
    <div className="gs2d-variable-actions"><button type="button" aria-label={variable.playing ? `Pause ${variable.name}` : `Animate ${variable.name}`} onClick={() => patch(variable.id, { playing: !variable.playing })}>{variable.playing ? <Pause /> : <Play />}</button><button type="button" aria-label={`Change ${variable.name} playback mode`} onClick={() => patch(variable.id, { playback: variable.playback === "loop" ? "ping-pong" : "loop" })}><Repeat2 />{variable.playback}</button><label>Speed<select aria-label={`${variable.name} animation speed`} value={variable.speed} onChange={(event) => patch(variable.id, { speed: Number(event.target.value) })}><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label></div>
  </div>) : <p className="gs3d-muted">Type a parameter such as a, b or c. Its slider will appear automatically.</p>}</div>;
}
function Toggle({ label, icon, checked, onChange }: { label: string; icon: ReactNode; checked: boolean; onChange: (value: boolean) => void }) { return <label className="gs3d-toggle-row"><span>{icon}{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i /></label>; }
function GraphHelpPopover({ selected, roots, minima, onClose }: { selected?: FunctionRow; roots: number[]; minima: Point[]; onClose: () => void }) {
  return <aside className="gs3d-help-popover" role="dialog" aria-modal="false" aria-label="2D graph learning help">
    <header><div><strong>2D graph help</strong><span>Quick learning guide</span></div><button type="button" onClick={onClose} aria-label="Close help">Close</button></header>
    <section><strong>Read the graph</strong><p><code>f(x) = {selected?.input ?? "x"}</code> assigns one vertical value to each allowed x-value.</p></section>
    <section><strong>Visible features</strong><p>{roots.length ? `Roots: ${roots.map(format).join(", ")}.` : "No roots are visible."} {minima.length ? `A local minimum appears near ${pointsText(minima)}.` : "No local minimum is visible."}</p></section>
    <section><strong>Navigate</strong><p>Use the corner controls to zoom, fit, reset, or enter full screen. The inspector contains exact and numerical analysis.</p></section>
    <footer><kbd>Esc</kbd><span>closes this help</span></footer>
  </aside>;
}

function Properties({ props, selected }: { props: GraphStudio2DWorkspaceProps; selected?: FunctionRow }) {
  const pieces = selected?.piecewise ?? [];
  const defaultParent = selected?.input && !/[{},=]/.test(selected.input) ? selected.input : "x^2";
  const transform = selected?.transform ?? { parent: defaultParent, a: 1, b: 1, h: 0, k: 0, enabled: false };
  const updatePieces = (next: PiecewiseSegment[]) => selected && props.onUpdate(selected.id, { piecewise: next, input: piecewiseExpression(next) });
  return <div className="gs3d-inspector-content">
    <Group title="Selected layer"><Field label="Expression" value={selected?.input ?? ""} onChange={(value) => selected && props.onUpdate(selected.id, { input: value, piecewise: undefined })} /><Field label="Layer name" value={selected?.name ?? ""} onChange={(name) => selected && props.onUpdate(selected.id, { name })} /><Field label="Graph label" value={selected?.label ?? ""} onChange={(label) => selected && props.onUpdate(selected.id, { label })} /><Field label="Group" value={selected?.group ?? ""} onChange={(group) => selected && props.onUpdate(selected.id, { group })} /><Field label="Note" value={selected?.note ?? ""} onChange={(note) => selected && props.onUpdate(selected.id, { note })} /><Toggle label="Visible" icon={<Eye />} checked={selected?.visible ?? false} onChange={(visible) => selected && props.onUpdate(selected.id, { visible })} /><Toggle label="Lock layer" icon={selected?.locked ? <Lock /> : <Unlock />} checked={selected?.locked ?? false} onChange={(locked) => selected && props.onUpdate(selected.id, { locked })} /></Group>
    <Group title="Visual piecewise editor"><div className="gs2d-piecewise-editor">{pieces.map((piece, index) => <div key={piece.id} className="gs2d-piece-row"><input aria-label={`Piece ${index + 1} expression`} value={piece.expression} onChange={(event) => updatePieces(pieces.map((item) => item.id === piece.id ? { ...item, expression: event.target.value } : item))} /><input type="number" aria-label={`Piece ${index + 1} minimum`} value={piece.min} onChange={(event) => updatePieces(pieces.map((item) => item.id === piece.id ? { ...item, min: Number(event.target.value) } : item))} /><span>≤ x ≤</span><input type="number" aria-label={`Piece ${index + 1} maximum`} value={piece.max} onChange={(event) => updatePieces(pieces.map((item) => item.id === piece.id ? { ...item, max: Number(event.target.value) } : item))} /><button type="button" aria-label={`Remove piece ${index + 1}`} onClick={() => updatePieces(pieces.filter((item) => item.id !== piece.id))}><Trash2 /></button></div>)}<button type="button" className="gs2d-wide-action" onClick={() => updatePieces([...pieces, { id: `piece-${Date.now()}`, expression: pieces.length ? "x" : "-x", min: pieces.length ? pieces.at(-1)!.max : -5, max: pieces.length ? pieces.at(-1)!.max + 5 : 0, includeMin: true, includeMax: true }])}><Plus />Add piece with domain</button></div></Group>
    <Group title="Transformation explorer"><Toggle label="Show transformed graph" icon={<Activity />} checked={transform.enabled} onChange={(enabled) => selected && props.onUpdate(selected.id, { transform: { ...transform, enabled } })} /><Field label="Parent f(x)" value={transform.parent} onChange={(parent) => selected && props.onUpdate(selected.id, { transform: { ...transform, parent, enabled: true } })} /><div className="gs2d-image-fields">{(["a", "b", "h", "k"] as const).map((key) => <NumberField key={key} label={key} value={transform[key]} onChange={(value) => selected && props.onUpdate(selected.id, { transform: { ...transform, [key]: value, enabled: true } })} />)}</div><p className="gs3d-muted">Plots y = a·f(b(x−h))+k with the parent graph ghosted behind it.</p></Group>
    <Group title="Image overlay"><Field label="Image URL" value={selected?.imageUrl ?? ""} onChange={(imageUrl) => selected && props.onUpdate(selected.id, { imageUrl })} /><div className="gs2d-image-fields"><NumberField label="X" value={selected?.imageX ?? -2} onChange={(imageX) => selected && props.onUpdate(selected.id, { imageX })} /><NumberField label="Y" value={selected?.imageY ?? 2} onChange={(imageY) => selected && props.onUpdate(selected.id, { imageY })} /><NumberField label="Width" value={selected?.imageWidth ?? 4} onChange={(imageWidth) => selected && props.onUpdate(selected.id, { imageWidth: Math.max(0.1, imageWidth) })} /><NumberField label="Height" value={selected?.imageHeight ?? 4} onChange={(imageHeight) => selected && props.onUpdate(selected.id, { imageHeight: Math.max(0.1, imageHeight) })} /></div></Group>
    <Group title="Dynamic constructions"><p className="gs3d-muted">Generated points, lines, conic centres, and detected parameters can be dragged on the graph.</p><div className="gs2d-construction-grid">{(["point", "line", "tangent", "normal", "conic"] as const).map((kind) => <button type="button" key={kind} onClick={() => props.onAddConstruction(kind)}>{capital(kind)}</button>)}</div>{props.linkedPoint && <p className="gs2d-linked-measurement">Linked position <strong>({format(props.linkedPoint.x)}, {format(props.linkedPoint.y)})</strong></p>}</Group>
    <Group title="Visible window"><NumberField label="X minimum" value={props.view.xMin} onChange={(xMin) => props.onViewChange({ ...props.view, xMin: Math.min(xMin, props.view.xMax - .1) })} /><NumberField label="X maximum" value={props.view.xMax} onChange={(xMax) => props.onViewChange({ ...props.view, xMax: Math.max(xMax, props.view.xMin + .1) })} /><NumberField label="Y minimum" value={props.view.yMin} onChange={(yMin) => props.onViewChange({ ...props.view, yMin: Math.min(yMin, props.view.yMax - .1) })} /><NumberField label="Y maximum" value={props.view.yMax} onChange={(yMax) => props.onViewChange({ ...props.view, yMax: Math.max(yMax, props.view.yMin + .1) })} /><Toggle label="Logarithmic x-axis" icon={<LineChart />} checked={props.logX} onChange={props.onLogXChange} /><Toggle label="Logarithmic y-axis" icon={<LineChart />} checked={props.logY} onChange={props.onLogYChange} /></Group>
  </div>;
}
function Style({ props, selected }: { props: GraphStudio2DWorkspaceProps; selected?: FunctionRow }) { return <div className="gs3d-inspector-content"><Group title="Curve"><label className="gs2d-color-field">Colour<input type="color" value={selected?.color ?? "#06b6d4"} onChange={(event) => selected && props.onUpdate(selected.id, { color: event.target.value })} /></label><label className="gs2d-opacity-field">Opacity <output>{Math.round((selected?.opacity ?? 1) * 100)}%</output><input type="range" min="0.1" max="1" step="0.05" value={selected?.opacity ?? 1} onChange={(event) => selected && props.onUpdate(selected.id, { opacity: Number(event.target.value) })} /></label><p className="gs3d-muted">Solid curves, points, vector arrows, and dashed derivative layers preserve non-colour identification.</p></Group><Group title="Accessibility"><label className="gs3d-select-field">Workspace appearance<select value={props.stylePreset} onChange={(event) => props.onStylePresetChange(event.target.value as GraphStudioStylePreset)}><option value="classroom">Classroom</option><option value="contrast">High contrast</option><option value="colorblind">Colour-blind safe</option><option value="print">Print</option><option value="neon">Neon laboratory</option><option value="presentation">Presentation</option><option value="paper">Scientific paper</option></select></label></Group></div>; }
function Analysis({ props, selected }: { props: GraphStudio2DWorkspaceProps; selected?: FunctionRow }) {
  const [showIntersections, setShowIntersections] = useState(false);
  const numericalRoots = props.roots.length ? props.roots.map((x) => `(${format(x)}, 0)`).join(", ") : "None visible";
  return <div className="gs3d-inspector-content">
    <div className="gs2d-selected"><span style={{ background: selected?.color }} />Selected: <code>f(x) = {selected?.input}</code></div>
    <div className="gs3d-analysis-table">
      <Metric label="Domain" value={props.discontinuities.length ? "Sampled real domain has breaks" : "Real values across visible window"} />
      <Metric label="Visible range" value={rangeText(props.visibleRange)} />
      <Metric label="Y-intercept" value={props.yIntercept === null ? "Undefined" : `(0, ${format(props.yIntercept)})`} copyValue={props.yIntercept === null ? undefined : `(0, ${format(props.yIntercept)})`} />
      <Metric label="Roots" value={numericalRoots} copyValue={numericalRoots} />
      <Metric label="Local minima" value={pointsText(props.minima)} />
      <Metric label="Local maxima" value={pointsText(props.maxima)} />
      <Metric label="Breaks" value={props.discontinuities.length ? props.discontinuities.map(format).join(", ") : "None detected"} />
      <Metric label="Vertical asymptotes" value={props.asymptotes.vertical.length ? props.asymptotes.vertical.map((x) => `x = ${format(x)}`).join(", ") : "None detected"} />
      <Metric label="Horizontal asymptotes" value={props.asymptotes.horizontal.length ? props.asymptotes.horizontal.map((y) => `y = ${format(y)}`).join(", ") : "None detected"} />
    </div>
    <Group title="Exact & numerical">
      <div className="gs2d-exact-results">
        <ExactResult label="Exact roots (symbolic)" value={props.exactAnalysis.roots} />
        <ExactResult label="Exact intersections (x)" value={props.exactIntersections} />
        <ExactResult label="Exact vertical asymptotes" value={props.exactAnalysis.verticalAsymptotes} />
        <ExactResult label="Exact horizontal asymptotes" value={props.exactAnalysis.horizontalAsymptotes} />
        <ExactResult label="Exact y-intercept" value={props.exactAnalysis.yIntercept} />
        <ExactResult label={`Exact integral [${format(props.integralStart)}, ${format(props.integralEnd)}]`} value={props.exactAnalysis.integral} />
      </div>
      <p className="gs3d-muted gs2d-method-note">{props.exactAnalysis.methodNote}</p>
    </Group>
    <Group title="Derivative preview"><DerivativePreview points={props.derivativePoints} color={selected?.color ?? "#06b6d4"} /><button type="button" className="gs2d-wide-action" onClick={() => props.onShowDerivativeChange(!props.showDerivative)}><Sigma />{props.showDerivative ? "Remove derivative layer" : "Plot numerical derivative"}</button></Group>
    <Group title="Taylor polynomial"><div className="gs2d-image-fields"><NumberField label="Centre" value={props.taylorCenter} onChange={props.onTaylorCenterChange} /><NumberField label="Degree" value={props.taylorDegree} onChange={(value) => props.onTaylorDegreeChange(Math.max(1, Math.min(8, Math.round(value))))} /></div><button type="button" className="gs2d-wide-action" onClick={() => props.onShowTaylorChange(!props.showTaylor)}><Sigma />{props.showTaylor ? "Remove Taylor overlay" : "Plot Taylor approximation"}</button></Group>
    <button type="button" className={`gs2d-analysis-action ${props.showIntegral ? "active" : ""}`} onClick={() => props.onShowIntegralChange(!props.showIntegral)}>Shade integral <span>{props.integralValue === null ? "Unavailable" : `≈ ${format(props.integralValue)}`}</span></button>
    <button type="button" className="gs2d-analysis-action" disabled={props.functions.filter((item) => item.visible).length < 2} onClick={() => setShowIntersections((value) => !value)}>Find intersections <span>{props.intersections.length ? `${props.intersections.length} visible` : "None visible"}</span></button>
    {showIntersections && <div className="gs2d-intersection-result">{pointsText(props.intersections)} <small>Approximate, visible window</small></div>}
  </div>;
}

function TableDock({ props, selected }: { props: GraphStudio2DWorkspaceProps; selected?: FunctionRow }) { return <div className="gs2d-table-dock"><div className="gs2d-table-controls"><NumberField label="Start" value={props.tableStart} onChange={props.onTableStartChange} /><NumberField label="End" value={props.tableEnd} onChange={props.onTableEndChange} /><NumberField label="Step" value={props.tableStep} onChange={props.onTableStepChange} /><button type="button" onClick={props.onExportCsv} title="Export table CSV"><Download /></button></div><div className="gs2d-table-wrap"><table><thead><tr><th>x</th><th>{selected?.input ?? "f(x)"}</th></tr></thead><tbody>{props.tableRows.slice(0, 40).map((row) => <tr key={row.x}><td>{format(row.x)}</td><td>{row.valid && row.y !== null ? format(row.y) : "undefined"}</td></tr>)}</tbody></table></div></div>; }
function DataDock({ props }: { props: GraphStudio2DWorkspaceProps }) {
  const [paste, setPaste] = useState("");
  const update = (id: string, patch: Partial<GraphDataRow>) => props.onDataRowsChange(props.dataRows.map((row) => row.id === id ? { ...row, ...patch } : row));
  return <div className="gs2d-data-dock">
    <div className="gs2d-data-controls">
      <div className="gs2d-data-toggles"><Toggle label="Plot data" icon={<Table2 />} checked={props.showData} onChange={props.onShowDataChange} /><Toggle label="Regression line" icon={<LineChart />} checked={props.showRegression} onChange={props.onShowRegressionChange} /><Toggle label="Residuals" icon={<Activity />} checked={props.showResiduals} onChange={props.onShowResidualsChange} /></div>
      <label className="gs3d-select-field">Regression model<select aria-label="Regression model" value={props.regressionKind} onChange={(event) => props.onRegressionKindChange(event.target.value as RegressionKind)}><option value="linear">Linear</option><option value="quadratic">Quadratic</option><option value="exponential">Exponential</option></select></label>
      <textarea aria-label="Paste spreadsheet data" placeholder={'Paste x,y pairs\n1, 2\n2, 4.1'} value={paste} onChange={(event) => setPaste(event.target.value)} />
      <button type="button" onClick={() => { props.onPasteData(paste); setPaste(""); }}>Load pasted data</button>
      <label className="gs2d-file-import"><Download />Import CSV<input type="file" accept=".csv,text/csv,text/plain" aria-label="Import data CSV" onChange={(event) => { const file = event.target.files?.[0]; if (file) void file.text().then(props.onPasteData); event.target.value = ""; }} /></label>
      {props.regression ? <><div className="gs2d-regression-summary"><strong>{props.regression.equation ?? `y = ${format(props.regression.slope)}x ${props.regression.intercept < 0 ? "−" : "+"} ${format(Math.abs(props.regression.intercept))}`}</strong><span>R² = {format(props.regression.rSquared)} · RMSE = {format(props.regression.rmse ?? 0)} · MAE = {format(props.regression.mae ?? 0)}</span><CopyValueButton value={`${props.regression.equation}; R^2 = ${props.regression.rSquared}`} label="Copy regression result" /></div><ResidualPlot regression={props.regression} /></> : <p className="gs3d-muted">Enter enough compatible points for the selected model.</p>}
    </div>
    <div className="gs2d-data-grid"><table><thead><tr><th>x</th><th>y</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{props.dataRows.map((row, index) => <tr key={row.id}><td><input type="number" aria-label={`Data x ${index + 1}`} value={row.x} onChange={(event) => update(row.id, { x: event.target.value })} /></td><td><input type="number" aria-label={`Data y ${index + 1}`} value={row.y} onChange={(event) => update(row.id, { y: event.target.value })} /></td><td><button type="button" aria-label={`Delete data row ${index + 1}`} onClick={() => props.onDataRowsChange(props.dataRows.filter((item) => item.id !== row.id))}><Trash2 /></button></td></tr>)}</tbody></table><button type="button" className="gs2d-add-data-row" onClick={() => props.onDataRowsChange([...props.dataRows, { id: `data-row-${Date.now()}`, x: "", y: "" }])}><Plus />Add row</button></div>
  </div>;
}
function Calculations({ props }: { props: GraphStudio2DWorkspaceProps }) { return <div className="gs3d-values-dock"><Metric label="Trace point" value={`x = ${format(props.traceX)}`} /><Metric label="Roots" value={props.roots.length ? props.roots.map(format).join(", ") : "None visible"} /><Metric label="Integral" value={props.integralValue === null ? "Unavailable" : format(props.integralValue)} /><Metric label="Intersections" value={pointsText(props.intersections)} /></div>; }

function ExportMenu({ props, close }: { props: GraphStudio2DWorkspaceProps; close: () => void }) { return <div className="gs3d-popover gs3d-export-menu"><ExportImageButton targetId="graphing-canvas-panel" filename="graphing-calculator.png" /><button type="button" onClick={() => { props.onExportSvg(); close(); }}><Download />Vector graph SVG</button><button type="button" onClick={() => { props.onExportPdf(); close(); }}><Download />Graph report PDF</button><button type="button" onClick={() => { props.onExportCsv(); close(); }}><Table2 />Sampled values CSV</button><button type="button" onClick={() => { props.onExportProject(); close(); }}><FileJson />Graph Studio project</button><button type="button" onClick={() => { props.onCopyShareLink(); close(); }}><Copy />Copy shareable link</button><button type="button" onClick={() => { props.onCopyEmbed(); close(); }}><Copy />Copy embed code</button><button type="button" onClick={() => { props.onCopyEquation(); close(); }}><Copy />Copy equation</button></div>; }
function SettingsMenu({ props }: { props: GraphStudio2DWorkspaceProps }) { return <div className="gs3d-popover gs3d-settings-menu"><p>Saved projects</p>{props.savedLibrary}<button type="button" onClick={props.onReset}><RotateCcw />Reset example</button></div>; }
function Group({ title, children }: { title: string; children: ReactNode }) { return <section className="gs3d-inspector-group"><h3>{title}</h3>{children}</section>; }
function Metric({ label, value, copyValue }: { label: string; value: string; copyValue?: string }) { return <div className="gs3d-metric"><span>{label}</span><strong>{value}</strong><small>Numerical</small>{copyValue && <CopyValueButton value={copyValue} label={`Copy ${label.toLowerCase()}`} />}</div>; }
function ExactResult({ label, value }: { label: string; value?: string }) { return <div className="gs2d-exact-result"><span>{label}</span><strong>{value || "Exact form unavailable"}</strong>{value && <CopyValueButton value={value} label={`Copy ${label.toLowerCase()}`} />}</div>; }
function CopyValueButton({ value, label }: { value: string; label: string }) { return <button type="button" className="gs2d-copy-value" aria-label={label} title={label} onClick={() => void navigator.clipboard?.writeText(value)}><Copy /></button>; }
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="gs3d-select-field">{label}<input value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="gs2d-number-field"><span>{label}</span><input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }
function DerivativePreview({ points, color }: { points: GraphSample[]; color: string }) { const valid = points.filter((point): point is GraphSample & { y: number } => point.valid && point.y !== null).slice(0, 180); if (valid.length < 2) return <p className="gs3d-muted">Numerical derivative unavailable for this relation.</p>; const minX = valid[0].x; const maxX = valid.at(-1)!.x; const ys = valid.map((point) => point.y); const minY = Math.min(...ys); const maxY = Math.max(...ys); const polyline = valid.map((point) => `${((point.x-minX)/(maxX-minX||1))*220},${58-((point.y-minY)/(maxY-minY||1))*52}`).join(" "); return <svg className="gs2d-derivative-preview" viewBox="0 0 220 64" aria-label="Numerical derivative preview"><line x1="0" x2="220" y1="32" y2="32" /><polyline points={polyline} fill="none" stroke={color} strokeWidth="2" /></svg>; }
function ResidualPlot({ regression }: { regression: LinearRegressionResult }) { const values = regression.residuals.map((item) => item.observedY - item.predictedY); const extent = Math.max(0.001, ...values.map(Math.abs)); return <svg className="gs2d-residual-plot" viewBox="0 0 260 82" role="img" aria-label={`${regression.kind ?? "linear"} regression residual plot`}><line x1="8" x2="252" y1="41" y2="41" />{values.map((value, index) => { const x = 12 + index / Math.max(1, values.length - 1) * 236; const y = 41 - value / extent * 30; return <g key={index}><line x1={x} x2={x} y1="41" y2={y} /><circle cx={x} cy={y} r="3.5" /></g>; })}</svg>; }

function piecewiseExpression(pieces: PiecewiseSegment[]) {
  return `{${pieces.filter((piece) => piece.expression.trim() && piece.max > piece.min).map((piece) => `${format(piece.min)} ${piece.includeMin ? "<=" : "<"} x ${piece.includeMax ? "<=" : "<"} ${format(piece.max)}: ${piece.expression}`).join(", ")}}`;
}

function rangeText(range: { min: number | null; max: number | null }) { return range.min === null || range.max === null ? "No real samples" : `[${format(range.min)}, ${format(range.max)}]`; }
function pointsText(points: Point[]) { return points.length ? points.map((point) => `(${format(point.x)}, ${format(point.y)})`).join(", ") : "None visible"; }
function format(value: number) { if (!Number.isFinite(value)) return "undefined"; return Number(value.toFixed(3)).toString(); }
function expressionSuggestion(error: string) {
  if (/parentheses/i.test(error)) return "Check that every opening parenthesis has a closing parenthesis.";
  if (/unsupported name/i.test(error)) return "Use x, pi, e, or supported functions such as sin, cos, sqrt and abs.";
  if (/missing (?:operand|function argument)/i.test(error)) return "Add the missing number, x value, or function argument.";
  if (/enter a function/i.test(error)) return "Try an expression such as x^2 - 4 or sin(x).";
  return "Use numbers, x, +, −, ×, ÷, ^, parentheses, or a supported function.";
}
function appendSnippet(value: string, snippet: string) { return `${value}${value && !/[+\-*/^(\s]$/.test(value) ? " * " : ""}${snippet}`; }
function capital(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
async function toggleFullscreen(id: string) { if (document.fullscreenElement) { await document.exitFullscreen(); return; } await document.getElementById(id)?.requestFullscreen?.(); }
