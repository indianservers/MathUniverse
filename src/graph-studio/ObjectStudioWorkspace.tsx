import {
  Box, Calculator, ChevronDown, ChevronLeft, ChevronRight, Circle, Copy, Crosshair, Download, Eye, EyeOff,
  Focus, Fullscreen, Grid3X3, Hand, Home, Layers3, LineChart, Lock, Menu, MoreHorizontal, MousePointer2,
  Move3D, Network, Orbit, Pause, Pencil, Play, Plus, Redo2, Rotate3D, Save, Search,
  Settings, Shapes, SlidersHorizontal, Trash2, Undo2, Unlock, ZoomIn, ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";

export type ObjectStudioMode = "create" | "transform" | "measure" | "animate" | "learn";
export type ObjectStudioTool = "select" | "move" | "rotate" | "scale" | "orbit" | "pan" | "zoom";
export type ObjectStudioInspectorTab = "transform" | "appearance" | "functions";
export type ObjectStudioDockTab = "properties" | "measurements" | "timeline";
export type ObjectStudioTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  visible: boolean;
  color: string;
  name?: string;
  locked?: boolean;
  trace?: boolean;
  dimensions?: [number, number, number];
  opacity?: number;
  material?: "matte" | "glass" | "wireframe";
};
export type ObjectStudioItem = { id: string; label: string; kind: string; transform: ObjectStudioTransform; added: boolean };
export type ObjectStudioShape = { id: string; label: string; category: "primitives" | "geometry" | "vectors"; preview: string };

type Props = {
  scene: ReactNode;
  objects: ObjectStudioItem[];
  selectedId: string;
  selectedTransform: ObjectStudioTransform;
  shapes: ObjectStudioShape[];
  projectStatus: string;
  canUndo: boolean;
  canRedo: boolean;
  cameraPreset: "free" | "top" | "front" | "right" | "isometric";
  zoom: number;
  autoRotate: boolean;
  animationSpeed: number;
  tool: ObjectStudioTool;
  snapEnabled: boolean;
  snapStep: number;
  measurement: { label: string; volume: number; surfaceArea: number; detail: string };
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onAdd: (shapeId: string) => void;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  onTransform: (id: string, patch: Partial<ObjectStudioTransform>) => void;
  onVector: (id: string, key: "position" | "rotation", index: number, value: number) => void;
  onDuplicate: (id?: string) => void;
  onDelete: (id?: string) => void;
  onRestore: (id?: string) => void;
  onPreset: (preset: "center" | "ground" | "unit" | "wide" | "tall" | "xy-plane" | "xz-plane" | "yz-plane") => void;
  onCamera: (preset: "free" | "top" | "front" | "right" | "isometric") => void;
  onZoom: (value: number) => void;
  onAutoRotate: (value: boolean) => void;
  onAnimationSpeed: (value: number) => void;
  onTool: (tool: ObjectStudioTool) => void;
  onSnapEnabled: (value: boolean) => void;
  onSnapStep: (value: number) => void;
};

const nav = [
  ["Home", "/", Home], ["Workspace", "/workspace", Layers3], ["2D Explorer", "/workspace/geometry", Shapes],
  ["3D Studio", "/workspace/3d", Box], ["Shapes", "/shapes", Circle], ["Graphs", "/workspace/graph", LineChart],
  ["Calculator", "/calculator", Calculator],
] as const;

export default function ObjectStudioWorkspace(props: Props) {
  const [projectName, setProjectName] = useState("Geometry Playground");
  const [renaming, setRenaming] = useState(false);
  const [mode, setMode] = useState<ObjectStudioMode>("transform");
  const [inspectorTab, setInspectorTab] = useState<ObjectStudioInspectorTab>("transform");
  const [dockTab, setDockTab] = useState<ObjectStudioDockTab>("measurements");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ObjectStudioShape["category"]>("primitives");
  const [viewOpen, setViewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1100px)");
    const sync = () => { if (media.matches) { setLeftOpen(false); setRightOpen(false); setDockOpen(false); } };
    sync(); media.addEventListener("change", sync); return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    let frames = 0; let previous = performance.now(); let animation = 0;
    const tick = (now: number) => { frames += 1; if (now - previous > 1000) { setFps(Math.round(frames * 1000 / (now - previous))); frames = 0; previous = now; } animation = requestAnimationFrame(tick); };
    animation = requestAnimationFrame(tick); return () => cancelAnimationFrame(animation);
  }, []);

  const filteredShapes = useMemo(() => props.shapes.filter((shape) => shape.category === category && shape.label.toLowerCase().includes(search.trim().toLowerCase())), [category, props.shapes, search]);
  const selected = props.objects.find((object) => object.id === props.selectedId);
  const dimensions = props.selectedTransform.dimensions ?? [props.selectedTransform.scale, props.selectedTransform.scale, props.selectedTransform.scale];
  const scaled = dimensions.map((value) => value * props.selectedTransform.scale);

  const chooseMode = (next: ObjectStudioMode) => {
    setMode(next);
    if (next === "create") setLeftOpen(true);
    if (next === "transform") { setRightOpen(true); setInspectorTab("transform"); props.onTool("move"); }
    if (next === "measure") { setDockOpen(true); setDockTab("measurements"); }
    if (next === "animate") { setDockOpen(true); setDockTab("timeline"); }
    if (next === "learn") setRightOpen(true);
  };
  const insert = (id: string) => { props.onAdd(id); setMode("transform"); props.onTool("move"); setRightOpen(true); };
  const dropShape = (event: DragEvent) => { event.preventDefault(); const id = event.dataTransfer.getData("application/x-math-universe-shape"); if (id) insert(id); };
  const numericMode: "position" | "rotation" | "scale" = props.tool === "rotate" ? "rotation" : props.tool === "scale" ? "scale" : "position";

  return <div id="object-studio-root" className={`graph-studio-3d-shell object-studio-shell ${leftOpen ? "has-left" : ""} ${rightOpen ? "has-right" : ""} ${dockOpen ? "has-dock" : ""}`} data-testid="workspace-3d-surface">
    <header className="gs3d-topbar">
      <div className="gs3d-brand"><div className="gs3d-mark">MU</div><strong>3D Object Studio</strong></div>
      <div className="gs3d-project-name">{renaming ? <input autoFocus aria-label="Project name" value={projectName} onChange={(event) => setProjectName(event.target.value)} onBlur={() => setRenaming(false)} onKeyDown={(event) => event.key === "Enter" && setRenaming(false)} /> : <button type="button" onClick={() => setRenaming(true)} title="Rename project"><span>{projectName}</span><Pencil /></button>}</div>
      <nav className="gs3d-modes" aria-label="Object Studio modes">{(["create", "transform", "measure", "animate", "learn"] as ObjectStudioMode[]).map((item) => <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => chooseMode(item)}>{item}</button>)}</nav>
      <div className="gs3d-top-actions">
        <TopAction label="Undo" icon={<Undo2 />} onClick={props.onUndo} disabled={!props.canUndo} />
        <TopAction label="Redo" icon={<Redo2 />} onClick={props.onRedo} disabled={!props.canRedo} />
        <TopAction label="Save" icon={<Save />} onClick={props.onSave} />
        <TopAction label="Export" icon={<Download />} onClick={props.onExport} />
        <TopAction label={props.autoRotate ? "Pause" : "Play"} icon={props.autoRotate ? <Pause /> : <Play />} onClick={() => props.onAutoRotate(!props.autoRotate)} />
        <div className="relative"><TopAction label="Settings" icon={<Settings />} onClick={() => setSettingsOpen((value) => !value)} />{settingsOpen && <div className="gs3d-popover"><button type="button" onClick={props.onLoad}><Layers3 />Load saved scene</button><label>Snap increment<select value={props.snapStep} onChange={(event) => props.onSnapStep(Number(event.target.value))}><option value="0.1">0.10</option><option value="0.25">0.25</option><option value="0.5">0.50</option><option value="1">1.00</option></select></label><label>Animation speed<input type="range" min="0.1" max="2" step="0.1" value={props.animationSpeed} onChange={(event) => props.onAnimationSpeed(Number(event.target.value))} /></label></div>}</div>
      </div>
      <button type="button" className="gs3d-mobile-menu" onClick={() => setLeftOpen((value) => !value)} aria-label="Open shape library"><Menu /></button>
    </header>

    <nav className="gs3d-navrail" aria-label="Object Studio navigation">{nav.map(([label, route, Icon]) => <Link key={label} to={route} className={label === "3D Studio" ? "active" : ""} title={label}><Icon /><span>{label}</span></Link>)}<Link to="/math-lab" title="More"><MoreHorizontal /><span>More</span></Link></nav>

    <aside className={`gs3d-left-panel os-left-panel ${leftOpen ? "open" : ""}`} aria-label="Shape Library">
      <PanelHeader title="Shape Library" side="left" onCollapse={() => setLeftOpen(false)} />
      <div className="gs3d-panel-scroll">
        <label className="os-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search shapes" aria-label="Search shapes" /></label>
        <div className="os-category-tabs" role="tablist">{(["primitives", "geometry", "vectors"] as const).map((item) => <button type="button" role="tab" aria-selected={category === item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        <div className="os-shape-grid">{filteredShapes.map((shape) => <button type="button" key={shape.id} className="os-shape-tile" draggable onDragStart={(event) => { event.dataTransfer.setData("application/x-math-universe-shape", shape.id); event.dataTransfer.effectAllowed = "copy"; }} onClick={() => insert(shape.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); insert(shape.id); } }} aria-label={`Add ${shape.label}`}><span className={`os-shape-preview ${shape.preview}`} aria-hidden="true" /><strong>{shape.label}</strong></button>)}</div>
        {!filteredShapes.length && <p className="os-empty">No supported shapes match this search.</p>}
        <p className="os-drag-hint"><Move3D />Drag a shape into the scene</p>
        <section className="os-scene-tools"><h3>Scene Tools</h3><div>{props.shapes.filter((shape) => ["point", "line3d", "plane3d", "vector"].includes(shape.id)).map((shape) => <button type="button" key={shape.id} onClick={() => insert(shape.id)} title={`Add ${shape.label}`}><span className={`os-shape-preview ${shape.preview}`} />{shape.label}</button>)}</div></section>
      </div>
    </aside>

    <main className="gs3d-canvas-zone os-canvas-zone" onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }} onDrop={dropShape}>
      {!leftOpen && <button type="button" className="gs3d-panel-reveal left" onClick={() => setLeftOpen(true)} aria-label="Show Shape Library"><ChevronRight /></button>}
      {!rightOpen && <button type="button" className="gs3d-panel-reveal right" onClick={() => setRightOpen(true)} aria-label="Show Object Inspector"><ChevronLeft /></button>}
      <div className="os-view-controls">
        <div className="gs3d-view-menu"><button type="button" onClick={() => setViewOpen((value) => !value)}>{cameraLabel(props.cameraPreset)}<ChevronDown /></button>{viewOpen && <div>{(["isometric", "top", "front", "right", "free"] as const).map((preset) => <button type="button" key={preset} onClick={() => { props.onCamera(preset); setViewOpen(false); }}>{cameraLabel(preset)}</button>)}</div>}</div>
        <button type="button" className={`os-snap ${props.snapEnabled ? "active" : ""}`} onClick={() => props.onSnapEnabled(!props.snapEnabled)} aria-pressed={props.snapEnabled} title="Toggle transform snapping"><Grid3X3 />Snap {props.snapEnabled ? props.snapStep.toFixed(2) : "off"}</button>
      </div>
      <div className="gs3d-canvas-tools" aria-label="Viewport navigation tools">
        <CanvasTool label="Select" icon={<MousePointer2 />} active={props.tool === "select"} onClick={() => props.onTool("select")} />
        <CanvasTool label="Orbit" icon={<Orbit />} active={props.tool === "orbit"} onClick={() => props.onTool("orbit")} />
        <CanvasTool label="Pan" icon={<Hand />} active={props.tool === "pan"} onClick={() => props.onTool("pan")} />
        <CanvasTool label="Zoom" icon={<ZoomIn />} active={props.tool === "zoom"} onClick={() => props.onTool("zoom")} />
      </div>
      <div className="gs3d-canvas-actions"><div className="os-orientation-cube" aria-label="Orientation: X Y Z"><b>Z</b><span>X</span><i>Y</i></div><button type="button" onClick={() => { props.onCamera("isometric"); props.onZoom(1); }} title="Fit view"><Focus /></button><button type="button" onClick={() => void toggleFullscreen("object-studio-root")} title="Full screen"><Fullscreen /></button></div>
      <div className="gs3d-scene-host" data-testid="workspace-3d-canvas">{props.scene}</div>
      {selected && mode !== "create" && <TransformGizmo tool={props.tool} />}
      <div className="os-context-toolbar" aria-label="Object manipulation toolbar">
        <CanvasTool label="Select" icon={<MousePointer2 />} active={props.tool === "select"} onClick={() => props.onTool("select")} />
        {selected && <><CanvasTool label="Move" icon={<Move3D />} active={props.tool === "move"} onClick={() => { props.onTool("move"); setMode("transform"); }} /><CanvasTool label="Rotate" icon={<Rotate3D />} active={props.tool === "rotate"} onClick={() => { props.onTool("rotate"); setMode("transform"); }} /><CanvasTool label="Scale" icon={<SlidersHorizontal />} active={props.tool === "scale"} onClick={() => { props.onTool("scale"); setMode("transform"); }} /><CanvasTool label="Size -" icon={<ZoomOut />} active={false} onClick={() => props.onTransform(selected.id, { scale: Math.max(0.1, roundScale(selected.transform.scale - 0.1)) })} /><CanvasTool label="Size +" icon={<ZoomIn />} active={false} onClick={() => props.onTransform(selected.id, { scale: roundScale(selected.transform.scale + 0.1) })} /><CanvasTool label="Duplicate" icon={<Copy />} active={false} onClick={() => props.onDuplicate(selected.id)} /><CanvasTool label={selected.transform.locked ? "Unlock" : "Lock"} icon={selected.transform.locked ? <Unlock /> : <Lock />} active={Boolean(selected.transform.locked)} onClick={() => props.onTransform(selected.id, { locked: !selected.transform.locked })} /><CanvasTool label="Delete" icon={<Trash2 />} active={false} danger onClick={() => props.onDelete(selected.id)} /></>}
        {selected && <div className="os-toolbar-values">{numericMode === "scale" ? <label className="axis-u"><span>U</span><input aria-label="uniform scale" type="number" min="0.1" step="0.1" value={props.selectedTransform.scale} onChange={(event) => props.onTransform(selected.id, { scale: Math.max(0.1, Number(event.target.value)) })} /></label> : [0, 1, 2].map((index) => <label key={index} className={`axis-${"xyz"[index]}`}><span>{"XYZ"[index]}</span><input aria-label={`${numericMode} ${"XYZ"[index]}`} type="number" step={numericMode === "rotation" ? 5 : 0.25} value={props.selectedTransform[numericMode][index]} onChange={(event) => props.onVector(selected.id, numericMode, index, Number(event.target.value))} /></label>)}</div>}
      </div>
      <div className="gs3d-interaction-hint">Drag object to move <span /> Drag empty space to orbit <span /> Wheel to zoom</div>
    </main>

    <aside className={`gs3d-right-panel os-right-panel ${rightOpen ? "open" : ""}`} aria-label="Scene Objects and Object Inspector">
      <section className="os-hierarchy"><div className="os-right-heading"><h2>Scene Objects</h2><button type="button" onClick={() => { setLeftOpen(true); setMode("create"); }}><Plus />Add object</button><button type="button" title="Close panel" aria-label="Close inspector" onClick={() => setRightOpen(false)}><ChevronRight /></button></div><div className="os-object-list">{props.objects.map((object) => <div key={object.id} className={props.selectedId === object.id ? "selected" : ""}><button type="button" className="os-object-main" onClick={() => props.onSelect(object.id)}><span className={`os-object-dot ${object.kind}`} style={{ backgroundColor: object.transform.color }} /><span>{object.transform.name || object.label}</span></button><button type="button" title={object.transform.visible ? "Hide object" : "Show object"} aria-label={`${object.transform.visible ? "Hide" : "Show"} ${object.label}`} onClick={() => props.onTransform(object.id, { visible: !object.transform.visible })}>{object.transform.visible ? <Eye /> : <EyeOff />}</button><button type="button" title={object.transform.locked ? "Unlock object" : "Lock object"} aria-label={`${object.transform.locked ? "Unlock" : "Lock"} ${object.label}`} onClick={() => props.onTransform(object.id, { locked: !object.transform.locked })}>{object.transform.locked ? <Lock /> : <Unlock />}</button><button type="button" className="danger" title={`Delete ${object.label}`} aria-label={`Delete ${object.label}`} onClick={() => props.onDelete(object.id)}><Trash2 /></button></div>)}</div></section>
      <section className="os-inspector"><div className="os-right-heading"><h2>Object Inspector</h2></div><div className="gs3d-inspector-tabs">{(["transform", "appearance", "functions"] as ObjectStudioInspectorTab[]).map((item) => <button type="button" key={item} className={inspectorTab === item ? "active" : ""} onClick={() => setInspectorTab(item)}>{item}</button>)}</div><div className="os-inspector-scroll">{mode === "learn" ? <LearnPanel selected={selected} /> : !selected ? <p className="os-empty">Select an object in the scene or hierarchy to inspect it.</p> : inspectorTab === "transform" ? <TransformInspector props={props} selected={selected} /> : inspectorTab === "appearance" ? <AppearanceInspector props={props} selected={selected} /> : <FunctionsInspector props={props} selected={selected} />}</div></section>
    </aside>

    <section className={`gs3d-dock os-dock ${dockOpen ? "open" : ""}`} aria-label="Object details dock"><div className="gs3d-dock-tabs">{(["properties", "measurements", "timeline"] as ObjectStudioDockTab[]).map((item) => <button type="button" key={item} className={dockTab === item ? "active" : ""} onClick={() => { setDockTab(item); setDockOpen(true); }}>{item}</button>)}<button type="button" className="collapse" onClick={() => setDockOpen((value) => !value)} aria-label={dockOpen ? "Collapse details dock" : "Expand details dock"}><ChevronDown /></button></div>{dockOpen && <div className="gs3d-dock-content">{dockTab === "properties" ? <PropertiesDock selected={selected} /> : dockTab === "measurements" ? <div className="os-measurements"><Measure label="Width" value={scaled[0]} unit="u" /><Measure label="Height" value={scaled[1]} unit="u" /><Measure label="Depth" value={scaled[2]} unit="u" /><Measure label="Volume" value={props.measurement.volume} unit="u3" /><Measure label="Surface area" value={props.measurement.surfaceArea} unit="u2" /><span className="os-live"><i />Live measurement</span></div> : <div className="gs3d-timeline"><span className={`os-animation-state ${props.autoRotate ? "active" : ""}`}>{props.autoRotate ? "Rotation playing" : "Rotation paused"}</span><input className="scrubber" aria-label="Animation speed" type="range" min="0.1" max="2" step="0.1" value={props.animationSpeed} onChange={(event) => props.onAnimationSpeed(Number(event.target.value))} /><label>{props.animationSpeed.toFixed(1)}x</label></div>}</div>}</section>
    <nav className="gs3d-mobile-nav" aria-label="Mobile Object Studio panels"><button type="button" onClick={() => setLeftOpen(true)}><Shapes />Shapes</button><button type="button" onClick={() => { setRightOpen(true); setInspectorTab("transform"); }}><Move3D />Transform</button><button type="button" onClick={() => setRightOpen(true)}><Network />Scene</button><button type="button" onClick={() => { setDockOpen(true); setDockTab("measurements"); }}><SlidersHorizontal />Measure</button></nav>
    <footer className="gs3d-status"><span className="online-dot" />Offline ready<span>{fps} FPS</span><span>{props.objects.filter((object) => object.transform.visible).length} visible objects</span><span className="saved">{props.projectStatus}</span></footer>
  </div>;
}

function PanelHeader({ title, side, onCollapse }: { title: string; side: "left" | "right"; onCollapse: () => void }) { return <div className="gs3d-panel-header"><h2>{title}</h2><button type="button" onClick={onCollapse} aria-label={`Collapse ${title}`} title={`Collapse ${title}`}>{side === "left" ? <ChevronLeft /> : <ChevronRight />}</button></div>; }
function TopAction({ label, icon, onClick, disabled }: { label: string; icon: ReactNode; onClick: () => void; disabled?: boolean }) { return <button type="button" className="gs3d-top-action" onClick={onClick} disabled={disabled} title={label}>{icon}<span>{label}</span></button>; }
function CanvasTool({ label, icon, active, onClick, danger }: { label: string; icon: ReactNode; active: boolean; onClick: () => void; danger?: boolean }) { return <button type="button" className={`${active ? "active" : ""} ${danger ? "danger" : ""}`} onClick={onClick} title={label} aria-pressed={active}>{icon}<span>{label}</span></button>; }
function Measure({ label, value, unit }: { label: string; value: number; unit: string }) { return <div><span>{label}</span><strong>{Number.isFinite(value) ? value.toFixed(2) : "--"}</strong><small>{unit}</small></div>; }
function PropertiesDock({ selected }: { selected?: ObjectStudioItem }) { return <div className="os-property-strip">{selected ? <><div><span>Object</span><strong className="os-property-name">{selected.transform.name || selected.label}</strong><small>{selected.kind}</small></div><Measure label="Position X" value={selected.transform.position[0]} unit="u" /><Measure label="Position Y" value={selected.transform.position[1]} unit="u" /><Measure label="Position Z" value={selected.transform.position[2]} unit="u" /><span>{selected.transform.visible ? "Visible" : "Hidden"} / {selected.transform.locked ? "Locked" : "Editable"}</span></> : <span>Select an object to see its properties.</span>}</div>; }
function TransformInspector({ props, selected }: { props: Props; selected: ObjectStudioItem }) { return <div className="os-inspector-fields"><VectorFields label="Position" values={selected.transform.position} unit="u" onChange={(index, value) => props.onVector(selected.id, "position", index, value)} /><VectorFields label="Rotation" values={selected.transform.rotation} unit="deg" onChange={(index, value) => props.onVector(selected.id, "rotation", index, value)} /><div className="os-field-group"><h3>Scale</h3><label><span>Uniform</span><input type="number" min="0.1" step="0.1" value={selected.transform.scale} onChange={(event) => props.onTransform(selected.id, { scale: Math.max(0.1, Number(event.target.value)) })} /></label><div className="os-inspector-actions"><button type="button" onClick={() => props.onTransform(selected.id, { scale: Math.max(0.1, roundScale(selected.transform.scale - 0.1)) })}><ZoomOut />Size -</button><button type="button" onClick={() => props.onTransform(selected.id, { scale: roundScale(selected.transform.scale + 0.1) })}><ZoomIn />Size +</button></div></div><div className="os-inspector-actions"><button type="button" onClick={() => props.onPreset("center")}><Crosshair />Center</button><button type="button" onClick={() => props.onPreset("ground")}><Layers3 />Ground</button><button type="button" onClick={() => props.onRestore(selected.id)}><Rotate3D />Reset transform</button></div></div>; }
function VectorFields({ label, values, unit, onChange }: { label: string; values: [number, number, number]; unit: string; onChange: (index: number, value: number) => void }) { return <div className="os-field-group"><h3>{label}</h3><div className="os-vector-fields">{values.map((value, index) => <label key={index} className={`axis-${"xyz"[index]}`}><span>{"XYZ"[index]}</span><input type="number" step={unit === "deg" ? 5 : 0.25} value={value} onChange={(event) => onChange(index, Number(event.target.value))} /><small>{unit}</small></label>)}</div></div>; }
function AppearanceInspector({ props, selected }: { props: Props; selected: ObjectStudioItem }) { return <div className="os-inspector-fields"><div className="os-field-group"><h3>Appearance</h3><label className="os-color"><span>Colour</span><input type="color" value={selected.transform.color} onChange={(event) => props.onTransform(selected.id, { color: event.target.value })} /></label><label><span>Opacity</span><input type="range" min="0.1" max="1" step="0.05" value={selected.transform.opacity ?? 1} onChange={(event) => props.onTransform(selected.id, { opacity: Number(event.target.value) })} /></label><label><span>Material</span><select value={selected.transform.material ?? "matte"} onChange={(event) => props.onTransform(selected.id, { material: event.target.value as ObjectStudioTransform["material"] })}><option value="matte">Matte</option><option value="glass">Glass</option><option value="wireframe">Wireframe</option></select></label><label className="os-toggle-line"><span>Visible</span><input type="checkbox" checked={selected.transform.visible} onChange={(event) => props.onTransform(selected.id, { visible: event.target.checked })} /></label></div></div>; }
function FunctionsInspector({ props, selected }: { props: Props; selected: ObjectStudioItem }) { return <div className="os-inspector-actions vertical"><button type="button" onClick={() => props.onDuplicate(selected.id)}><Copy />Duplicate</button><button type="button" onClick={() => props.onTransform(selected.id, { locked: !selected.transform.locked })}>{selected.transform.locked ? <Unlock /> : <Lock />}{selected.transform.locked ? "Unlock" : "Lock"}</button><button type="button" onClick={() => props.onTransform(selected.id, { visible: !selected.transform.visible })}>{selected.transform.visible ? <EyeOff /> : <Eye />}{selected.transform.visible ? "Hide" : "Show"}</button><button type="button" onClick={() => props.onRestore(selected.id)}><Rotate3D />Restore defaults</button><button type="button" className="danger" onClick={() => props.onDelete(selected.id)}><Trash2 />Delete</button></div>; }
function LearnPanel({ selected }: { selected?: ObjectStudioItem }) { const name = selected?.transform.name || selected?.label || "object"; return <div className="os-learn"><h3>{name}</h3><p>Position describes where the object sits along the X, Y and Z axes. Rotation turns it around those axes, while scale changes its size without changing its basic shape.</p><p>Dimensions and measurements below update from the real geometry as you transform the selected object.</p><p>Snapping uses regular increments so objects can be positioned and compared precisely.</p></div>; }
function TransformGizmo({ tool }: { tool: ObjectStudioTool }) { if (!["move", "rotate", "scale"].includes(tool)) return null; return <div className={`os-gizmo os-gizmo-${tool}`} aria-hidden="true"><i className="x" /><i className="y" /><i className="z" /><b>{tool}</b></div>; }
function cameraLabel(preset: Props["cameraPreset"]) { return preset === "isometric" ? "Perspective" : preset.charAt(0).toUpperCase() + preset.slice(1); }
function roundScale(value: number) { return Math.round(value * 100) / 100; }
async function toggleFullscreen(id: string) { const element = document.getElementById(id); if (document.fullscreenElement) await document.exitFullscreen(); else await element?.requestFullscreen?.(); }
