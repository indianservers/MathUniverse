import {
  Circle as CircleIcon,
  Grid3X3,
  Magnet,
  Maximize2,
  MousePointer2,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { MockupLearningStrip } from "../../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import {
  ancestorsOf,
  childrenOf,
  collectMeasurements,
  defaultConstruction,
  descendantsOf,
  detectRelations,
  evaluate,
  isFreeDraggable,
  isPointKind,
  moveConstraint,
  nextId,
  nextLabel,
  parseScene,
  serializeScene,
  type GeomObject,
  type ObjKind,
  type World,
} from "./constructionEngine";
import { clipLineToBox, dist, fmtAngle, fmtMeasure, snapTo, type Vec } from "./constructionMath";
import { CONSTRUCTION_PANELS, useConstructionPanel } from "./constructionMode";
import { CONSTRUCTION_PRESETS } from "./constructionPresets";
import { buildProofs, cannotMoveMessage, validatePerpBisectorChallenge } from "./constructionProofs";
import "./ConstructionLab.css";

type ToolId =
  | "select"
  | "point"
  | "pointOn"
  | "intersection"
  | "midpoint"
  | "line"
  | "segment"
  | "ray"
  | "perp"
  | "parallel"
  | "perpBisector"
  | "angleBisector"
  | "circleCP"
  | "circleCR"
  | "triangle"
  | "angle"
  | "distance"
  | "text"
  | "delete"
  | "locus";

const TOOLS: { group: string; id: ToolId; label: string; hint: string; kind?: ObjKind; picks: number; compass?: boolean }[] = [
  { group: "Select", id: "select", label: "Select", hint: "V · Select / Move", picks: 0, compass: true },
  { group: "Select", id: "delete", label: "Delete", hint: "Delete selected", picks: 0, compass: true },
  { group: "Points", id: "point", label: "Point", hint: "P · Free point", kind: "freePoint", picks: 0, compass: true },
  { group: "Points", id: "pointOn", label: "On object", hint: "Point on line or circle", kind: "pointOnObject", picks: 1, compass: true },
  { group: "Points", id: "intersection", label: "Intersect", hint: "Intersection of two objects", kind: "intersection", picks: 2, compass: true },
  { group: "Points", id: "midpoint", label: "Midpoint", hint: "Midpoint of two points", kind: "midpoint", picks: 2 },
  { group: "Lines", id: "segment", label: "Segment", hint: "S · Segment", kind: "segment", picks: 2, compass: true },
  { group: "Lines", id: "line", label: "Line", hint: "L · Infinite line", kind: "line", picks: 2, compass: true },
  { group: "Lines", id: "ray", label: "Ray", hint: "Ray", kind: "ray", picks: 2 },
  { group: "Special", id: "perp", label: "Perp.", hint: "Point then line", kind: "perp", picks: 2 },
  { group: "Special", id: "parallel", label: "Parallel", hint: "Point then line", kind: "parallel", picks: 2 },
  { group: "Special", id: "perpBisector", label: "Perp. bisector", hint: "Two endpoints", kind: "perpBisector", picks: 2 },
  { group: "Special", id: "angleBisector", label: "Angle bisector", hint: "Three points A, vertex, C", kind: "angleBisector", picks: 3 },
  { group: "Circles", id: "circleCP", label: "Circle", hint: "C · Center + point", kind: "circleCP", picks: 2, compass: true },
  { group: "Circles", id: "circleCR", label: "Radius", hint: "Center + numeric radius", kind: "circleCR", picks: 1 },
  { group: "Polygons", id: "triangle", label: "Triangle", hint: "Three vertices", kind: "triangle", picks: 3 },
  { group: "Measure", id: "angle", label: "Angle", hint: "Three points", kind: "angle", picks: 3 },
  { group: "Measure", id: "distance", label: "Distance", hint: "Two points", kind: "distance", picks: 2 },
  { group: "Locus", id: "locus", label: "Locus", hint: "Driver on object, then tracer", kind: "locus", picks: 2, compass: true },
  { group: "Annotate", id: "text", label: "Text", hint: "Label", kind: "text", picks: 0 },
];

const VIEW = { w: 720, h: 540 };
const GROUPS = ["Select", "Points", "Lines", "Special", "Circles", "Polygons", "Measure", "Locus", "Annotate"];

function displayName(obj: GeomObject, objects: GeomObject[]) {
  const parentLabels = obj.parents.map((id) => objects.find((o) => o.id === id)?.label ?? id).join("");
  if (obj.kind === "perpBisector") return `Perp. bisector of ${parentLabels || "AB"}`;
  if (obj.kind === "midpoint") return `Midpoint of ${parentLabels}`;
  if (obj.kind === "intersection") return `Intersection ${obj.label}`;
  if (obj.kind === "circleCP" || obj.kind === "circleCR") return `Circle ${obj.label}`;
  if (obj.kind === "segment") return `Segment ${obj.label}`;
  return `${obj.label}`;
}

function historyLabel(obj: GeomObject, objects: GeomObject[]) {
  if (obj.kind === "freePoint") return `Point ${obj.label}`;
  if (obj.kind === "segment") return `Segment ${obj.label}`;
  if (obj.kind === "perpBisector") return displayName(obj, objects);
  if (obj.kind === "circleCP") return `Circle center ${objects.find((o) => o.id === obj.parents[0])?.label ?? "O"}`;
  if (obj.kind === "intersection") return `Intersection ${obj.label}`;
  if (obj.kind === "midpoint") return `Midpoint ${obj.label}`;
  return displayName(obj, objects);
}

export default function ConstructionLab({ page }: { page: StudioMockupPage }) {
  const { panel, setPanel } = useConstructionPanel();
  const [objects, setObjects] = useState<GeomObject[]>(defaultConstruction);
  const [past, setPast] = useState<GeomObject[][]>([]);
  const [future, setFuture] = useState<GeomObject[][]>([]);
  const [tool, setTool] = useState<ToolId>("select");
  const [picks, setPicks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>("C");
  const [hover, setHover] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string[]>([]);
  const [openGroups, setOpenGroups] = useState<string[]>(["Select", "Points", "Lines", "Circles"]);
  const [grid, setGrid] = useState<"off" | "cartesian" | "dots">("cartesian");
  const [snap, setSnap] = useState(true);
  const [labels, setLabels] = useState(true);
  const [compassOnly, setCompassOnly] = useState(false);
  const [radiusLock, setRadiusLock] = useState(false);
  const [lockedR, setLockedR] = useState(2);
  const [measureMode, setMeasureMode] = useState<"decimal" | "exact" | "both">("both");
  const [angleUnit, setAngleUnit] = useState<"deg" | "rad">("deg");
  const [fullChain, setFullChain] = useState(true);
  const [proofStep, setProofStep] = useState(0);
  const [stepAll, setStepAll] = useState(true);
  const [toast, setToast] = useState("");
  const [headerHost, setHeaderHost] = useState<HTMLElement | null>(null);
  const [cam, setCam] = useState({ ox: 360, oy: 270, s: 72 });
  const drag = useRef<{ id: string; moved: boolean } | null>(null);
  const pan = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const space = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const snapshot = useRef<GeomObject[] | null>(null);

  const world = useMemo(() => evaluate(objects), [objects]);
  const measurements = useMemo(() => collectMeasurements(objects, world, selected), [objects, world, selected]);
  const relations = useMemo(() => detectRelations(objects, world), [objects, world]);
  const proofs = useMemo(() => buildProofs(objects, world), [objects, world]);
  const activeProof = proofs[0] ?? null;
  const selectedObj = objects.find((o) => o.id === selected) ?? null;
  const tools = TOOLS.filter((t) => !compassOnly || t.compass);

  useEffect(() => { setHeaderHost(document.getElementById("msk-lab-tools")); }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === " " ) space.current = true;
      if (e.key === "Escape") { setTool("select"); setPicks([]); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === "v" || e.key === "V") setTool("select");
        if (e.key === "p" || e.key === "P") setTool("point");
        if (e.key === "l" || e.key === "L") setTool("line");
        if (e.key === "s" || e.key === "S") setTool("segment");
        if (e.key === "c" || e.key === "C") setTool("circleCP");
        if (e.key === "Delete" || e.key === "Backspace") removeSelected();
        if (e.key === "+" || e.key === "=") zoom(1.15);
        if (e.key === "-") zoom(1 / 1.15);
      }
    };
    const up = (e: KeyboardEvent) => { if (e.key === " ") space.current = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  });

  const commit = (next: GeomObject[], _note?: string) => {
    setPast((p) => [...p.slice(-40), objects]);
    setFuture([]);
    setObjects(next);
  };
  const undo = () => {
    setPast((p) => {
      const prev = p[p.length - 1];
      if (!prev) return p;
      setFuture((f) => [objects, ...f]);
      setObjects(prev);
      return p.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((f) => {
      const next = f[0];
      if (!next) return f;
      setPast((p) => [...p, objects]);
      setObjects(next);
      return f.slice(1);
    });
  };

  const toScreen = (p: Vec) => ({ x: cam.ox + p.x * cam.s, y: cam.oy - p.y * cam.s });
  const fromSvg = (e: ReactPointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: (p.x - cam.ox) / cam.s, y: (cam.oy - p.y) / cam.s };
  };
  const snapWorld = (p: Vec): Vec => snap ? { x: snapTo(p.x, 0.5), y: snapTo(p.y, 0.5) } : p;
  const zoom = (factor: number) => setCam((c) => ({ ...c, s: Math.min(180, Math.max(28, c.s * factor)) }));

  const hit = (p: Vec): string | null => {
    let bestId: string | null = null;
    let bestD = Infinity;
    const consider = (id: string, d: number) => {
      if (d > 14 / cam.s) return;
      if (d < bestD) { bestD = d; bestId = id; }
    };
    for (const obj of objects) {
      if (!obj.visible) continue;
      const ev = world[obj.id];
      if (!ev) continue;
      if (ev.point) consider(obj.id, dist(p, ev.point));
      if (ev.circle) consider(obj.id, Math.abs(dist(p, ev.circle.center) - ev.circle.r));
      if (ev.polygon?.length === 2) {
        const a = ev.polygon[0]!;
        const b = ev.polygon[1]!;
        const ab = dist(a, b) || 1;
        const t = Math.max(0, Math.min(1, ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (ab * ab)));
        consider(obj.id, dist(p, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }));
      }
      if (ev.line && (obj.kind === "line" || obj.kind === "perpBisector" || obj.kind === "perp" || obj.kind === "parallel" || obj.kind === "angleBisector")) {
        const q = { x: ev.line.origin.x + ev.line.dir.x * ((p.x - ev.line.origin.x) * ev.line.dir.x + (p.y - ev.line.origin.y) * ev.line.dir.y), y: ev.line.origin.y + ev.line.dir.y * ((p.x - ev.line.origin.x) * ev.line.dir.x + (p.y - ev.line.origin.y) * ev.line.dir.y) };
        consider(obj.id, dist(p, q));
      }
    }
    return bestId;
  };

  const addObject = (obj: GeomObject) => {
    commit([...objects, obj]);
    setSelected(obj.id);
    setPicks([]);
  };

  const finishTool = (ids: string[], at?: Vec) => {
    const spec = TOOLS.find((t) => t.id === tool);
    if (!spec) return;
    if (tool === "point" && at) {
      addObject({ id: nextId(objects, "P"), kind: "freePoint", label: nextLabel(objects, "freePoint"), parents: [], visible: true, locked: false, constructed: true, params: { x: at.x, y: at.y } });
      return;
    }
    if (tool === "text" && at) {
      addObject({ id: nextId(objects, "T"), kind: "text", label: "Note", parents: [], visible: true, locked: false, constructed: true, params: { x: at.x, y: at.y } });
      return;
    }
    if (tool === "circleCR" && ids[0]) {
      addObject({ id: nextId(objects, "c"), kind: "circleCR", label: nextLabel(objects, "circleCR"), parents: [ids[0]], visible: true, locked: false, constructed: true, params: { r: radiusLock ? lockedR : 2 } });
      return;
    }
    if (tool === "circleCP" && radiusLock && ids[0]) {
      addObject({ id: nextId(objects, "c"), kind: "circleCR", label: nextLabel(objects, "circleCR"), parents: [ids[0]], visible: true, locked: false, constructed: true, params: { r: lockedR } });
      return;
    }
    if (!spec.kind || ids.length < spec.picks) return;
    addObject({
      id: nextId(objects, spec.kind.slice(0, 2)),
      kind: spec.kind,
      label: nextLabel(objects, spec.kind),
      parents: ids.slice(0, spec.picks),
      visible: true,
      locked: false,
      constructed: true,
      params: spec.kind === "intersection" ? { index: 0 } : undefined,
    });
  };

  const removeSelected = () => {
    if (!selected) return;
    const gone = [selected, ...descendantsOf(objects, selected)];
    if (gone.length > 1 && !window.confirm(`Deleting ${selectedObj?.label ?? selected} will also remove:\n- ${gone.slice(1).map((id) => objects.find((o) => o.id === id)?.label ?? id).join("\n- ")}\nProceed?`)) return;
    commit(objects.filter((o) => !gone.includes(o.id)));
    setSelected(null);
  };

  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    const w = snapWorld(fromSvg(e));
    if (e.button === 1 || space.current) {
      pan.current = { x: e.clientX, y: e.clientY, ox: cam.ox, oy: cam.oy };
      return;
    }
    const id = hit(fromSvg(e));
    if (tool === "select") {
      if (id) {
        const obj = objects.find((o) => o.id === id)!;
        setSelected(id);
        if (isFreeDraggable(obj) || obj.kind === "pointOnObject") {
          snapshot.current = objects;
          drag.current = { id, moved: false };
          (e.target as Element).setPointerCapture?.(e.pointerId);
        } else {
          const msg = cannotMoveMessage(obj, objects);
          if (msg) setToast(msg);
        }
      } else setSelected(null);
      return;
    }
    if (tool === "delete") {
      if (id) { setSelected(id); removeSelected(); }
      return;
    }
    const spec = TOOLS.find((t) => t.id === tool);
    if (spec && spec.picks === 0) {
      finishTool([], w);
      return;
    }
    if (id) {
      const next = [...picks, id];
      setPicks(next);
      setSelected(id);
      if (spec && next.length >= spec.picks) finishTool(next, w);
    }
  };

  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const w = fromSvg(e);
    setHover(hit(w));
    if (pan.current) {
      setCam({ ...cam, ox: pan.current.ox + (e.clientX - pan.current.x), oy: pan.current.oy + (e.clientY - pan.current.y) });
      return;
    }
    if (!drag.current) return;
    drag.current.moved = true;
    const obj = objects.find((o) => o.id === drag.current!.id);
    if (!obj) return;
    const target = snapWorld(w);
    if (obj.kind === "freePoint") {
      setObjects((prev) => prev.map((o) => o.id === obj.id ? { ...o, params: { ...o.params, x: target.x, y: target.y } } : o));
    } else if (obj.kind === "pointOnObject") {
      const host = world[obj.parents[0] ?? ""];
      const moved = moveConstraint(obj, world, target);
      if (moved && host?.circle) {
        const t = Math.atan2(moved.y - host.circle.center.y, moved.x - host.circle.center.x);
        setObjects((prev) => prev.map((o) => o.id === obj.id ? { ...o, params: { ...o.params, t } } : o));
      } else if (moved && host?.line) {
        const t = (moved.x - host.line.origin.x) * host.line.dir.x + (moved.y - host.line.origin.y) * host.line.dir.y;
        setObjects((prev) => prev.map((o) => o.id === obj.id ? { ...o, params: { ...o.params, t } } : o));
      }
    }
  };

  const onUp = () => {
    if (drag.current?.moved && snapshot.current) {
      setPast((p) => [...p.slice(-40), snapshot.current!]);
      setFuture([]);
    }
    drag.current = null;
    pan.current = null;
    snapshot.current = null;
  };

  const rename = (id: string, label: string) => setObjects((prev) => prev.map((o) => o.id === id ? { ...o, label } : o));
  const patch = (id: string, next: Partial<GeomObject>) => commit(objects.map((o) => o.id === id ? { ...o, ...next } : o));

  const loadPreset = (id: string) => {
    const preset = CONSTRUCTION_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    commit(preset.objects.map((o) => ({ ...o })));
    setSelected(preset.objects.at(-1)?.id ?? null);
    setToast(preset.challenge ?? preset.name);
  };

  const exportJson = () => {
    const blob = new Blob([serializeScene(objects, { cx: cam.ox, cy: cam.oy, zoom: cam.s })], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "construction.json";
    a.click();
  };

  const header = (
    <label className="clab-head-field">Preset
      <select aria-label="Construction preset" onChange={(e) => { if (e.target.value) loadPreset(e.target.value); }} defaultValue="">
        <option value="">Load preset…</option>
        {CONSTRUCTION_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </label>
  );

  const box = { x0: 8, y0: 8, x1: VIEW.w - 8, y1: VIEW.h - 8 };
  const lit = new Set([selected, hover, ...highlight].filter(Boolean) as string[]);
  const ancestors = selected ? ancestorsOf(objects, selected) : [];
  const descendants = selected ? descendantsOf(objects, selected) : [];
  const challenge = validatePerpBisectorChallenge(objects, world);
  const currentTool = TOOLS.find((t) => t.id === tool);

  const renderTree = (id: string, depth = 0): ReactNode => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return null;
    const kids = objects.filter((o) => o.parents[0] === id);
    return (
      <li key={id}>
        <button type="button" className={`${selected === id ? "is-on" : ""} ${obj.visible ? "" : "clab-muted"}`} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} onClick={() => setSelected(id)}>
          {displayName(obj, objects)}
          {world[id]?.undefinedReason ? " — undefined" : ""}
        </button>
        {kids.length ? <ul>{kids.map((k) => renderTree(k, depth + 1))}</ul> : null}
      </li>
    );
  };
  const roots = objects.filter((o) => !o.parents[0] || !objects.some((x) => x.id === o.parents[0]));

  return (
    <div className="clab clab-construction">
      {headerHost ? createPortal(header, headerHost) : <div className="clab-inline-head">{header}</div>}
      <nav className="clab-tabs msk-tabs" aria-label="Construction Workspace modes">
        {CONSTRUCTION_PANELS.map((item) => (
          <button key={item.id} type="button" className={panel === item.id ? "is-on active" : ""} aria-pressed={panel === item.id} aria-selected={panel === item.id} onClick={() => setPanel(item.id)}>{item.label}</button>
        ))}
      </nav>
      <div className="msk-dash-banner" data-lab-mode={panel}>
        <b>Construction Workspace · {CONSTRUCTION_PANELS.find((item) => item.id === panel)?.label ?? panel}</b>
        <small>{page.subtitle}</small>
      </div>
      <p className="msk-note clab-workspace-link">
        Compass-straightedge here. For a full object tree with CAS, open{" "}
        <Link to="/workspace/geometry">pro construction in Math Workspace</Link>.
      </p>

      <div className="clab-workspace">
        <aside className="clab-card" aria-label="Construction tools">
          <h2>Construct</h2>
          {GROUPS.map((group) => {
            const items = tools.filter((t) => t.group === group);
            if (!items.length) return null;
            const open = openGroups.includes(group);
            return (
              <fieldset key={group} className="clab-group">
                <button type="button" onClick={() => setOpenGroups((g) => open ? g.filter((x) => x !== group) : [...g, group])}>{group} <span>{open ? "−" : "+"}</span></button>
                {open ? (
                  <div className="clab-icon-grid">
                    {items.map((t) => (
                      <button key={t.id} type="button" className={tool === t.id ? "is-on" : ""} title={t.hint} aria-label={t.label} data-construction-tool={t.id} onClick={() => { setTool(t.id); setPicks([]); }}>
                        {t.id === "select" ? <MousePointer2 size={16} /> : t.id.includes("circle") ? <CircleIcon size={16} /> : t.id === "delete" ? <Trash2 size={16} /> : <span>•</span>}
                        {t.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </fieldset>
            );
          })}
          <p className="clab-hint">{currentTool?.hint}{picks.length ? ` · picked ${picks.length}` : ""}</p>
          <label className="clab-toggle"><span>Show labels</span><input type="checkbox" checked={labels} onChange={(e) => setLabels(e.target.checked)} /></label>
          <label className="clab-toggle"><span>Snap to grid</span><input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} /></label>
          <label className="clab-toggle"><span>Compass & straightedge only</span><input type="checkbox" checked={compassOnly} onChange={(e) => { setCompassOnly(e.target.checked); setTool("select"); }} /></label>
          <label className="clab-toggle"><span>Lock compass radius ({fmtMeasure(lockedR, "both")})</span><input type="checkbox" checked={radiusLock} onChange={(e) => setRadiusLock(e.target.checked)} /></label>
          <p className="clab-kicker">Grid</p>
          <div className="clab-seg">
            {(["off", "cartesian", "dots"] as const).map((g) => (
              <button key={g} type="button" className={grid === g ? "is-on" : ""} onClick={() => setGrid(g)}>{g === "cartesian" ? "Grid" : g === "dots" ? "Dots" : "Off"}</button>
            ))}
          </div>
          <button type="button" className="clab-ghost" onClick={undo} disabled={!past.length}>Undo</button>
          <button type="button" className="clab-ghost" onClick={redo} disabled={!future.length}>Redo</button>
          <button type="button" className="clab-primary" onClick={() => { commit(defaultConstruction()); setSelected("C"); }}>Reset construction</button>
          <button type="button" className="clab-ghost" onClick={exportJson}>Export JSON</button>
        </aside>

        <section className="clab-stage">
          <svg
            ref={svgRef}
            className={`clab-svg${space.current ? " is-pan" : ""}`}
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            role="img"
            aria-label="Perpendicular bisector construction canvas"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            onWheel={(e) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.08 : 1 / 1.08); }}
          >
            <rect width={VIEW.w} height={VIEW.h} fill="#f7fbff" />
            {grid !== "off" ? Array.from({ length: 25 }, (_, i) => {
              const n = i - 12;
              const a = toScreen({ x: n, y: -12 });
              const b = toScreen({ x: n, y: 12 });
              const c = toScreen({ x: -12, y: n });
              const d = toScreen({ x: 12, y: n });
              return grid === "dots" ? (
                <circle key={i} cx={toScreen({ x: n, y: 0 }).x} cy={toScreen({ x: 0, y: n }).y} r="1.2" fill="#dbe7f3" />
              ) : (
                <g key={i} stroke="#e6eef6">
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} />
                </g>
              );
            }) : null}
            <line x1={toScreen({ x: -12, y: 0 }).x} y1={toScreen({ x: 0, y: 0 }).y} x2={toScreen({ x: 12, y: 0 }).x} y2={toScreen({ x: 0, y: 0 }).y} stroke="#cbd5e1" />
            <line x1={toScreen({ x: 0, y: -12 }).x} y1={toScreen({ x: 0, y: -12 }).y} x2={toScreen({ x: 0, y: 12 }).x} y2={toScreen({ x: 0, y: 12 }).y} stroke="#cbd5e1" />

            {objects.map((obj) => {
              const ev = world[obj.id];
              if (!obj.visible || !ev) return null;
              const on = lit.has(obj.id);
              const muted = Boolean(ev.undefinedReason);
              const stroke = on ? "#0369a1" : obj.kind.includes("perp") || obj.kind === "perpBisector" ? "#8b45f4" : obj.kind.startsWith("circle") ? "#08b9dd" : "#147df2";
              const dash = obj.kind === "perpBisector" || obj.kind === "perp" || obj.kind === "parallel" ? "5 4" : undefined;
              const width = on ? 3.2 : 2;
              if (ev.circle) {
                const c = toScreen(ev.circle.center);
                return <circle key={obj.id} cx={c.x} cy={c.y} r={ev.circle.r * cam.s} fill="none" stroke={stroke} strokeWidth={width} opacity={muted ? 0.3 : 1} />;
              }
              if (ev.line && (obj.kind === "line" || obj.kind === "perpBisector" || obj.kind === "perp" || obj.kind === "parallel" || obj.kind === "ray" || obj.kind === "angleBisector" || obj.kind === "median" || obj.kind === "altitude")) {
                const clip = clipLineToBox({ origin: toScreen(ev.line.origin), dir: { x: ev.line.dir.x * cam.s, y: -ev.line.dir.y * cam.s } }, box);
                if (!clip) return null;
                return <line key={obj.id} x1={clip[0].x} y1={clip[0].y} x2={clip[1].x} y2={clip[1].y} stroke={stroke} strokeWidth={width} strokeDasharray={dash} opacity={muted ? 0.3 : 1} />;
              }
              if (ev.polygon && obj.kind === "locus" && ev.polygon.length >= 2) {
                const pts = ev.polygon.map(toScreen);
                return <polyline key={obj.id} points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth={on ? 3 : 2} strokeDasharray="4 3" opacity={muted ? 0.3 : 1} />;
              }
              if (ev.polygon && ev.polygon.length >= 2 && (obj.kind === "segment" || obj.kind === "distance" || obj.kind === "vector" || obj.kind === "triangle" || obj.kind === "polygon")) {
                const pts = ev.polygon.map(toScreen);
                if (obj.kind === "triangle" || obj.kind === "polygon") {
                  return <polygon key={obj.id} points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill={on ? "rgba(20,125,242,.12)" : "rgba(20,125,242,.06)"} stroke={stroke} strokeWidth={width} />;
                }
                const [a, b] = pts;
                const ticks = (highlight.includes(obj.id) || (activeProof && obj.kind === "segment" && (obj.id === "CA" || obj.id === "CB"))) ? (
                  <g stroke={stroke} strokeWidth="1.6">
                    <line x1={(a!.x + b!.x) / 2 - 4} y1={(a!.y + b!.y) / 2 - 6} x2={(a!.x + b!.x) / 2 + 4} y2={(a!.y + b!.y) / 2 + 6} />
                  </g>
                ) : null;
                return <g key={obj.id} opacity={muted ? 0.3 : 1}><line x1={a!.x} y1={a!.y} x2={b!.x} y2={b!.y} stroke={stroke} strokeWidth={width} /><line x1={a!.x} y1={a!.y} x2={b!.x} y2={b!.y} stroke="transparent" strokeWidth="14" />{ticks}</g>;
              }
              return null;
            })}

            {objects.map((obj) => {
              const ev = world[obj.id];
              if (!obj.visible || !ev?.point || !isPointKind(obj.kind)) return null;
              const p = toScreen(ev.point);
              const free = obj.kind === "freePoint";
              const fill = free ? "#147df2" : obj.kind === "intersection" ? "#f59e0b" : "#22d3ee";
              const on = lit.has(obj.id);
              return (
                <g key={`pt-${obj.id}`} opacity={ev.undefinedReason ? 0.35 : 1}>
                  {free ? <circle cx={p.x} cy={p.y} r={on ? 8 : 6} fill={fill} /> : <><circle cx={p.x} cy={p.y} r={on ? 8 : 6} fill="#fff" stroke={fill} strokeWidth="2.4" /><circle cx={p.x} cy={p.y} r="2" fill={fill} /></>}
                  {labels ? <text x={p.x + 10} y={p.y - 10} fontSize="13" fontWeight="800" fill="#0f172a">{obj.label}</text> : null}
                  <title>{free ? `Free Point ${obj.label}` : obj.kind === "intersection" ? `Intersection ${obj.label}` : obj.kind === "midpoint" ? `Midpoint ${obj.label}` : obj.label}</title>
                </g>
              );
            })}
          </svg>
          <div className="clab-zoom">
            <button type="button" aria-label="Zoom in" onClick={() => zoom(1.15)}><ZoomIn size={15} /></button>
            <button type="button" aria-label="Zoom out" onClick={() => zoom(1 / 1.15)}><ZoomOut size={15} /></button>
            <button type="button" aria-label="Fit" onClick={() => setCam({ ox: 360, oy: 270, s: 72 })}><Maximize2 size={15} /></button>
            <button type="button" aria-label="Toggle grid" onClick={() => setGrid((g) => g === "off" ? "cartesian" : "off")}><Grid3X3 size={15} /></button>
            <button type="button" aria-label="Toggle snap" onClick={() => setSnap((s) => !s)}><Magnet size={15} /></button>
          </div>
          {toast ? <p className="clab-toast" role="status">{toast}</p> : null}
        </section>

        <aside className="clab-card clab-inspector">
          {panel === "objects" ? (
            <div>
              <h2>Live object tree</h2>
              <ul className="clab-tree">{roots.map((o) => renderTree(o.id))}</ul>
              {selectedObj ? (
                <div className="clab-props">
                  <strong>{displayName(selectedObj, objects)}</strong>
                  <span>Type: {selectedObj.kind}</span>
                  {world[selectedObj.id]?.point ? <span>x: {fmtMeasure(world[selectedObj.id]!.point!.x, measureMode)} · y: {fmtMeasure(world[selectedObj.id]!.point!.y, measureMode)}</span> : null}
                  {world[selectedObj.id]?.undefinedReason ? <span>{world[selectedObj.id]!.undefinedReason}</span> : null}
                  <label>Label<input value={selectedObj.label} onChange={(e) => rename(selectedObj.id, e.target.value)} /></label>
                  <label className="clab-check"><input type="checkbox" checked={selectedObj.visible} onChange={(e) => patch(selectedObj.id, { visible: e.target.checked })} /> Visible</label>
                  <label className="clab-check"><input type="checkbox" checked={selectedObj.locked} onChange={(e) => patch(selectedObj.id, { locked: e.target.checked })} /> Locked</label>
                  <button type="button" className="clab-ghost" onClick={removeSelected}>Delete</button>
                </div>
              ) : null}
              <h2>History / Steps</h2>
              <ol className="clab-history" aria-label="Construction history">
                {objects.map((o) => <li key={o.id}>{historyLabel(o, objects)}</li>)}
              </ol>
            </div>
          ) : null}

          {panel === "measurements" ? (
            <div>
              <h2>Measurements</h2>
              <p className="clab-kicker">Display</p>
              <div className="clab-seg">
                {(["decimal", "exact", "both"] as const).map((m) => (
                  <button key={m} type="button" className={measureMode === m ? "is-on" : ""} onClick={() => setMeasureMode(m)}>{m}</button>
                ))}
              </div>
              <div className="clab-seg" style={{ marginTop: 8 }}>
                <button type="button" className={angleUnit === "deg" ? "is-on" : ""} onClick={() => setAngleUnit("deg")}>Degrees</button>
                <button type="button" className={angleUnit === "rad" ? "is-on" : ""} onClick={() => setAngleUnit("rad")}>Radians</button>
              </div>
              {(["distances", "angles", "circle", "polygon", "relationships"] as const).map((group) => {
                const rows = measurements.filter((m) => m.group === group);
                if (!rows.length) return null;
                return (
                  <div key={group}>
                    <h2>{group}</h2>
                    {rows.map((m) => (
                      <div key={m.label + m.objectIds.join()} className="clab-row" onMouseEnter={() => setHighlight(m.objectIds)} onMouseLeave={() => setHighlight([])}>
                        <span>{m.label}</span>
                        <b className={m.constructed === false ? "clab-obs" : undefined}>
                          {typeof m.numeric === "number"
                            ? group === "angles" ? fmtAngle(m.numeric, angleUnit, measureMode) : fmtMeasure(m.numeric, measureMode)
                            : String(m.value)}
                        </b>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : null}

          {panel === "dependencies" ? (
            <div>
              <h2>Dependencies</h2>
              <label className="clab-check"><input type="checkbox" checked={fullChain} onChange={(e) => setFullChain(e.target.checked)} /> Show full dependency chain</label>
              <svg viewBox="0 0 320 220" className="clab-graph" aria-label="Construction dependency graph">
                <rect width="320" height="220" fill="#f8fbff" />
                {layoutGraph(objects).map((node) => {
                  const ev = world[node.id];
                  const on = lit.has(node.id) || (fullChain && selected && (ancestors.includes(node.id) || descendants.includes(node.id) || selected === node.id));
                  return (
                    <g key={node.id} onMouseEnter={() => setHover(node.id)} onClick={() => setSelected(node.id)} style={{ cursor: "pointer" }}>
                      {node.parents.map((pid) => {
                        const src = layoutGraph(objects).find((n) => n.id === pid);
                        if (!src) return null;
                        return <line key={pid} x1={src.x + 28} y1={src.y + 12} x2={node.x} y2={node.y + 12} stroke="#94a3b8" />;
                      })}
                      <rect x={node.x} y={node.y} width="56" height="24" rx="8" fill={on ? "#e8f7ff" : "#fff"} stroke={on ? "#08b9dd" : "#dce7f4"} />
                      <text x={node.x + 28} y={node.y + 16} textAnchor="middle" fontSize="10" fontWeight="800">{objects.find((o) => o.id === node.id)?.label}</text>
                      {ev?.undefinedReason ? <title>{ev.undefinedReason}</title> : <title>{displayName(objects.find((o) => o.id === node.id)!, objects)}</title>}
                    </g>
                  );
                })}
              </svg>
              {selectedObj ? (
                <>
                  <p className="clab-note"><b>Ancestors</b> {ancestors.map((id) => objects.find((o) => o.id === id)?.label).join(", ") || "none"}</p>
                  <p className="clab-note"><b>Descendants</b> {descendants.map((id) => objects.find((o) => o.id === id)?.label).join(", ") || "none"}</p>
                </>
              ) : null}
            </div>
          ) : null}

          {panel === "proof" ? (
            <div>
              <h2>Proof explanation</h2>
              {activeProof ? (
                <>
                  <p className="clab-kicker">{activeProof.theorem}</p>
                  <p className="clab-goal"><b>Goal</b> {activeProof.goal}</p>
                  {activeProof.given.map((g) => <p key={g} className="clab-note"><b>Given / construction.</b> {g}</p>)}
                  <p className="clab-note"><b>Known property.</b> {activeProof.property}</p>
                  <p className="clab-note"><b>Reasoning.</b> {activeProof.reasoning}</p>
                  <p className={activeProof.constructed ? "clab-ok" : "clab-note"}>{activeProof.conclusion}</p>
                  <div className="clab-seg">
                    <button type="button" className={stepAll ? "is-on" : ""} onClick={() => { setStepAll(true); setHighlight(activeProof.steps.flatMap((s) => s.objectIds)); }}>Show All</button>
                    <button type="button" className={!stepAll ? "is-on" : ""} onClick={() => { setStepAll(false); setProofStep(0); setHighlight(activeProof.steps[0]?.objectIds ?? []); }}>Step Through</button>
                  </div>
                  {!stepAll ? (
                    <button type="button" className="clab-ghost" onClick={() => {
                      const next = (proofStep + 1) % activeProof.steps.length;
                      setProofStep(next);
                      setHighlight(activeProof.steps[next]?.objectIds ?? []);
                    }}>Next step</button>
                  ) : null}
                  <ol className="clab-steps">
                    {activeProof.steps.map((step, i) => (
                      <li key={step.id} className={!stepAll && i === proofStep ? "is-on" : ""} onMouseEnter={() => setHighlight(step.objectIds)} onMouseLeave={() => setHighlight(stepAll ? [] : activeProof.steps[proofStep]?.objectIds ?? [])}>{step.text}</li>
                    ))}
                  </ol>
                </>
              ) : <p className="clab-note">Construct a perpendicular bisector, midpoint, or circle radii to generate a proof.</p>}
              <h2>Discovered relationships</h2>
              {relations.map((r) => (
                <div key={r.id} className="clab-row" onMouseEnter={() => setHighlight(r.objectIds)} onMouseLeave={() => setHighlight([])}>
                  <span>✓ {r.text}</span>
                  <b className={r.kind === "observed" ? "clab-obs" : undefined}>{r.kind === "constructed" ? "constructed" : "observed"}</b>
                </div>
              ))}
              <h2>Challenge</h2>
              <p className="clab-note">{page.challenge.prompt}</p>
              <p className={challenge.ok ? "clab-ok" : "clab-note"}>{challenge.ok ? `✓ ${challenge.detail}` : challenge.detail}</p>
            </div>
          ) : null}
        </aside>
      </div>
      <MockupLearningStrip page={page} />
      <input className="sr-only" aria-hidden tabIndex={-1} onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        void file.text().then((raw) => {
          const parsed = parseScene(raw);
          if (parsed) commit(parsed.objects);
        });
      }} />
    </div>
  );
}

function layoutGraph(objects: GeomObject[]) {
  const rank = new Map<string, number>();
  const walk = (id: string): number => {
    if (rank.has(id)) return rank.get(id)!;
    const obj = objects.find((o) => o.id === id);
    const r = obj && obj.parents.length ? 1 + Math.max(0, ...obj.parents.map(walk)) : 0;
    rank.set(id, r);
    return r;
  };
  objects.forEach((o) => walk(o.id));
  const cols = new Map<number, GeomObject[]>();
  for (const obj of objects) {
    const r = rank.get(obj.id) ?? 0;
    if (!cols.has(r)) cols.set(r, []);
    cols.get(r)!.push(obj);
  }
  const nodes: { id: string; x: number; y: number; parents: string[] }[] = [];
  for (const [r, list] of [...cols.entries()].sort((a, b) => a[0] - b[0])) {
    list.forEach((obj, i) => {
      nodes.push({ id: obj.id, x: 12 + r * 78, y: 16 + i * 36, parents: obj.parents });
    });
  }
  return nodes;
}
