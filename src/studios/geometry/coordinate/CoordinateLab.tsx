import {
  ArrowUpRight,
  Camera,
  Copy,
  Crosshair,
  Download,
  Eye,
  EyeOff,
  Grid3X3,
  MousePointer2,
  Plus,
  Redo2,
  RotateCcw,
  Spline,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import {
  clamp,
  dist,
  fmtCoord,
  fmtNum,
  fmtPretty,
  intersectSlopeLines,
  lineForms,
  lineFormsLatex,
  midpoint,
  perpendicularBisector,
  riseRun,
  sectionPoint,
  slope,
  snapTo,
  type Vec,
} from "./coordinateMath";
import { COORD_MODES, useCoordLabMode, type CoordModeId } from "./coordinateMode";
import "./CoordinateLab.css";

type Tool = "select" | "point" | "line" | "segment" | "ray" | "vector" | "perp" | "parallel" | "midpoint" | "intersect" | "locus" | "clear";
type RightTab = "tree" | "measure" | "deps" | "proof";
type DistPair = "AB" | "AC" | "BC";
type PointObj = { id: string; label: string; x: number; y: number; color: string; visible: boolean };
type LineObj = { id: string; label: string; m: number; b: number; color: string; visible: boolean };
type StrokeObj = { id: string; kind: "segment" | "ray" | "vector"; a: Vec; b: Vec; color: string; visible: boolean };
type Scene = { points: PointObj[]; lines: LineObj[]; strokes: StrokeObj[] };
type Cam = { cx: number; cy: number; zoom: number };
type Sheet = "plane" | "tools" | "live";

const TOOLS: Array<{ id: Tool; label: string }> = [
  { id: "select", label: "Select" },
  { id: "point", label: "Point" },
  { id: "line", label: "Line" },
  { id: "segment", label: "Segment" },
  { id: "ray", label: "Ray" },
  { id: "vector", label: "Vector" },
  { id: "perp", label: "Perpendicular" },
  { id: "parallel", label: "Parallel" },
  { id: "midpoint", label: "Midpoint" },
  { id: "intersect", label: "Intersect" },
  { id: "locus", label: "Locus" },
  { id: "clear", label: "Clear" },
];
const CORE = new Set(["A", "B", "C", "l", "m"]);
const INITIAL_POINTS: PointObj[] = [
  { id: "A", label: "A", x: -3, y: 2, color: "#3b82f6", visible: true },
  { id: "B", label: "B", x: 4, y: -1, color: "#8b5cf6", visible: true },
  { id: "C", label: "C", x: 1, y: 4, color: "#f59e0b", visible: true },
];
const INITIAL_LINES: LineObj[] = [
  { id: "l", label: "ℓ", m: 0.5, b: 1, color: "#22d3ee", visible: true },
  { id: "m", label: "m", m: 1, b: -2, color: "#8b5cf6", visible: true },
];
const EMPTY: Scene = { points: INITIAL_POINTS, lines: INITIAL_LINES, strokes: [] };
const VIEW = { w: 640, h: 640 };
const COACH_KEY = "math-universe-coord-coach-v1";

function unitOf(cam: Cam) {
  return (VIEW.w / 20) * cam.zoom;
}
function toScreen(p: Vec, cam: Cam) {
  const u = unitOf(cam);
  return { x: VIEW.w / 2 + (p.x - cam.cx) * u, y: VIEW.h / 2 - (p.y - cam.cy) * u };
}
function fromScreen(x: number, y: number, cam: Cam): Vec {
  const u = unitOf(cam);
  return { x: cam.cx + (x - VIEW.w / 2) / u, y: cam.cy - (y - VIEW.h / 2) / u };
}
function uMinus(n: number, fraction: boolean) {
  return fmtCoord(n, fraction).replace(/-/g, "−");
}
function lineEnds(line: LineObj, span = 14): [Vec, Vec] {
  if (!Number.isFinite(line.m)) return [{ x: line.b, y: -span }, { x: line.b, y: span }];
  return [{ x: -span, y: line.m * -span + line.b }, { x: span, y: line.m * span + line.b }];
}
function extend(a: Vec, b: Vec, length: number): Vec {
  const d = dist(a, b) || 1;
  return { x: a.x + ((b.x - a.x) / d) * length, y: a.y + ((b.y - a.y) / d) * length };
}
function nextLabel(points: PointObj[]): string {
  const used = new Set(points.map((p) => p.label));
  for (let i = 0; i < 26; i += 1) {
    const label = String.fromCharCode(65 + i);
    if (!used.has(label)) return label;
  }
  return `P${points.length}`;
}
function toolPrompt(tool: Tool, pending: Vec | null, refTarget: string | null): string | null {
  if (tool === "point") return "Click the plane to place a point.";
  if (tool === "line" || tool === "segment" || tool === "ray" || tool === "vector") {
    return pending ? "Click the second point. Esc cancels." : `Click the first point for the ${tool}.`;
  }
  if (tool === "perp") return refTarget ? "Click to place a perpendicular through that location." : "Choose a reference: line ℓ or segment AB.";
  if (tool === "parallel") return refTarget ? "Click to place a parallel line through that location." : "Choose a reference: line ℓ or line m.";
  if (tool === "midpoint") return "Click the plane to drop the midpoint of AB.";
  if (tool === "intersect") return "Click to solve ℓ ∩ m and open the proof.";
  if (tool === "locus") return "This shows the perpendicular bisector of AB (points equidistant from A and B).";
  return null;
}

export default function CoordinateLab({ page }: { page: StudioMockupPage }) {
  const { mode, setMode } = useCoordLabMode();
  const [tool, setTool] = useState<Tool>("select");
  const [scene, setScene] = useState<Scene>(EMPTY);
  const [snap, setSnap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [axesOnly, setAxesOnly] = useState(false);
  const [spacing, setSpacing] = useState(1);
  const [fraction, setFraction] = useState(true);
  const [right, setRight] = useState<RightTab>("measure");
  const [activeDist, setActiveDist] = useState<DistPair>("AB");
  const [ratioM, setRatioM] = useState(1);
  const [ratioN, setRatioN] = useState(1);
  const [pending, setPending] = useState<Vec | null>(null);
  const [ghost, setGhost] = useState<Vec | null>(null);
  const [hover, setHover] = useState<Vec | null>(null);
  const [selected, setSelected] = useState<string>("A");
  const [history, setHistory] = useState<Scene[]>([EMPTY]);
  const [histIndex, setHistIndex] = useState(0);
  const [cam, setCam] = useState<Cam>({ cx: 0, cy: 0, zoom: 1 });
  const [refTarget, setRefTarget] = useState<"ell" | "em" | "ab" | null>(null);
  const [pulseP, setPulseP] = useState(false);
  const [hoverStep, setHoverStep] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("Coordinate plane ready. Drag A, B, or C.");
  const [toast, setToast] = useState("");
  const [coach, setCoach] = useState(() => {
    try { return localStorage.getItem(COACH_KEY) !== "1"; } catch { return true; }
  });
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [challengeOk, setChallengeOk] = useState<boolean | null>(null);
  const [sheet, setSheet] = useState<Sheet>("plane");
  const [headerHost, setHeaderHost] = useState<HTMLElement | null>(null);
  const drag = useRef<string | null>(null);
  const pan = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);
  const space = useRef(false);
  const sceneRef = useRef(scene);
  const svgRef = useRef<SVGSVGElement | null>(null);
  sceneRef.current = scene;

  const { points, lines, strokes } = scene;
  const A = points.find((p) => p.id === "A") ?? points[0]!;
  const B = points.find((p) => p.id === "B") ?? points[1]!;
  const C = points.find((p) => p.id === "C") ?? points[2]!;
  const ell = lines.find((l) => l.id === "l") ?? lines[0]!;
  const em = lines.find((l) => l.id === "m") ?? lines[1]!;

  const measures = useMemo(() => {
    const AB = dist(A, B);
    const AC = dist(A, C);
    const BC = dist(B, C);
    const mid = midpoint(A, B);
    const P = intersectSlopeLines(ell.m, ell.b, em.m, em.b);
    const locus = perpendicularBisector(A, B);
    const section = sectionPoint(A, B, ratioM, ratioN);
    const sAC = slope(A, C);
    return {
      AB, AC, BC, mid, P, locus, section, sAC,
      formsL: lineForms(ell.m, ell.b),
      formsM: lineForms(em.m, em.b),
      latexL: lineFormsLatex(ell.m, ell.b),
      latexM: lineFormsLatex(em.m, em.b),
      rr: riseRun(ell.m),
    };
  }, [A, B, C, ell, em, ratioM, ratioN]);

  const say = (text: string) => setAnnounce(text);

  const push = useCallback((next: Scene, note?: string) => {
    setHistory((h) => {
      const stacked = [...h.slice(0, histIndex + 1), next];
      setHistIndex(stacked.length - 1);
      return stacked;
    });
    setScene(next);
    if (note) say(note);
  }, [histIndex]);

  const undo = useCallback(() => {
    if (histIndex <= 0) return;
    const i = histIndex - 1;
    setHistIndex(i);
    setScene(history[i]!);
    say("Undid last change.");
  }, [histIndex, history]);
  const redo = useCallback(() => {
    if (histIndex >= history.length - 1) return;
    const i = histIndex + 1;
    setHistIndex(i);
    setScene(history[i]!);
    say("Redid last change.");
  }, [histIndex, history]);

  const textbook = () => {
    push(EMPTY, "Restored the textbook figure A, B, C, ℓ, and m.");
    setPending(null);
    setCam({ cx: 0, cy: 0, zoom: 1 });
  };
  const resetAll = () => {
    textbook();
    setMode("distance");
    setTool("select");
    setActiveDist("AB");
    setChallengeOk(null);
  };
  const clearExtras = () => {
    if (!window.confirm("Remove extra points, lines, and strokes? A, B, C, ℓ, and m stay.")) return;
    push({
      points: points.filter((p) => CORE.has(p.id)),
      lines: lines.filter((l) => CORE.has(l.id)),
      strokes: [],
    }, "Cleared extra constructions.");
    setTool("select");
  };

  const snapWorld = (p: Vec) => (snap ? { x: snapTo(p.x, spacing), y: snapTo(p.y, spacing) } : p);
  const clientToView = (event: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * VIEW.w,
      y: ((event.clientY - rect.top) / rect.height) * VIEW.h,
    };
  };
  const clientToWorld = (event: { clientX: number; clientY: number }) => snapWorld(fromScreen(clientToView(event).x, clientToView(event).y, cam));

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 1600);
  };
  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied`);
      say(`Copied ${label}.`);
    } catch {
      showToast("Copy failed");
    }
  };
  const exportPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 1280;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#f7fbff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "coordinate-lab.png";
      a.click();
      URL.revokeObjectURL(url);
      say("Exported PNG.");
    };
    img.src = url;
  };

  const solveIntersection = () => {
    setRight("proof");
    setPulseP(true);
    window.setTimeout(() => setPulseP(false), 2400);
    say(measures.P ? `Solved ℓ ∩ m at (${fmtPretty(measures.P.x)}, ${fmtPretty(measures.P.y)}).` : "No unique intersection: the lines are parallel.");
  };

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const world = clientToWorld(event);
    const view = clientToView(event);
    if (space.current || event.button === 1) {
      pan.current = { x: view.x, y: view.y, cx: cam.cx, cy: cam.cy };
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    if (tool === "clear") { clearExtras(); return; }
    if (tool === "point") {
      const label = nextLabel(points);
      push({ ...scene, points: [...points, { id: label, label, x: world.x, y: world.y, color: "#0ea5e9", visible: true }] }, `Placed point ${label}.`);
      setSelected(label);
      setTool("select");
      return;
    }
    if (tool === "line" || tool === "segment" || tool === "ray" || tool === "vector") {
      if (!pending) { setPending(world); say("First point set. Click the second point."); return; }
      if (tool === "line") {
        const m = slope(pending, world);
        const b = Number.isFinite(m) ? pending.y - m * pending.x : pending.x;
        const id = `n${lines.length}`;
        push({ ...scene, lines: [...lines, { id, label: id, m, b, color: "#64748b", visible: true }] }, "Added a line.");
      } else {
        const id = `${tool}-${strokes.length}`;
        push({ ...scene, strokes: [...strokes, { id, kind: tool, a: pending, b: world, color: tool === "vector" ? "#7c3aed" : "#334155", visible: true }] }, `Added a ${tool}.`);
      }
      setPending(null);
      setGhost(null);
      setTool("select");
      return;
    }
    if (tool === "midpoint") {
      const mid = midpoint(A, B);
      const label = nextLabel(points);
      push({ ...scene, points: [...points, { id: label, label, x: mid.x, y: mid.y, color: "#0f766e", visible: true }] }, `Dropped midpoint ${label}.`);
      setMode("midpoint");
      setSelected(label);
      setTool("select");
      return;
    }
    if (tool === "perp") {
      if (!refTarget) return;
      const m = refTarget === "ab"
        ? perpendicularBisector(A, B).m
        : (Number.isFinite(ell.m) ? (Math.abs(ell.m) < 1e-12 ? Number.POSITIVE_INFINITY : -1 / ell.m) : 0);
      const b = Number.isFinite(m) ? world.y - m * world.x : world.x;
      push({ ...scene, lines: [...lines, { id: `p${lines.length}`, label: "⊥", m, b, color: "#059669", visible: true }] }, "Added a perpendicular.");
      setTool("select");
      setRefTarget(null);
      return;
    }
    if (tool === "parallel") {
      if (!refTarget) return;
      const src = refTarget === "em" ? em : ell;
      const b = Number.isFinite(src.m) ? world.y - src.m * world.x : world.x;
      push({ ...scene, lines: [...lines, { id: `q${lines.length}`, label: "∥", m: src.m, b, color: "#f59e0b", visible: true }] }, "Added a parallel.");
      setTool("select");
      setRefTarget(null);
      return;
    }
    if (tool === "locus") {
      setMode("locus");
      setTool("select");
      say("Showing the perpendicular bisector of AB.");
      return;
    }
    if (tool === "intersect") {
      solveIntersection();
      setTool("select");
      return;
    }
    const hit = points.find((p) => p.visible && dist(world, p) < 0.55 / cam.zoom);
    if (hit) {
      drag.current = hit.id;
      setSelected(hit.id);
      event.currentTarget.setPointerCapture(event.pointerId);
    } else setSelected("");
  };

  useEffect(() => { setHeaderHost(document.getElementById("msk-lab-tools")); }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === " ") space.current = event.type === "keydown";
      if (event.key === "Escape") {
        setPending(null);
        setGhost(null);
        setTool("select");
        setRefTarget(null);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        const extraPoint = points.find((p) => p.id === selected && !CORE.has(p.id));
        const extraLine = lines.find((l) => l.id === selected && !CORE.has(l.id));
        const extraStroke = strokes.find((s) => s.id === selected);
        if (extraPoint) push({ ...scene, points: points.filter((p) => p.id !== selected) }, `Deleted ${extraPoint.label}.`);
        else if (extraLine) push({ ...scene, lines: lines.filter((l) => l.id !== selected) }, "Deleted line.");
        else if (extraStroke) push({ ...scene, strokes: strokes.filter((s) => s.id !== selected) }, "Deleted construction.");
      }
      const sel = points.find((p) => p.id === selected);
      if (sel && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const step = snap ? spacing : 0.1;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowDown" ? -step : event.key === "ArrowUp" ? step : 0;
        push({ ...scene, points: points.map((p) => (p.id === sel.id ? { ...p, x: p.x + dx, y: p.y + dy } : p)) }, `${sel.label} moved.`);
      }
    };
    const up = (event: KeyboardEvent) => { if (event.key === " ") space.current = false; };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", up);
    };
  }, [points, lines, strokes, selected, scene, snap, spacing, push, undo, redo]);

  const ticks = Array.from({ length: 21 }, (_, i) => -10 + i);
  const distPair = activeDist === "AB" ? [A, B] as const : activeDist === "AC" ? [A, C] as const : [B, C] as const;
  const distValue = activeDist === "AB" ? measures.AB : activeDist === "AC" ? measures.AC : measures.BC;
  const matchEll = Number.isFinite(measures.sAC) && Math.abs(measures.sAC - ell.m) < 1e-6;
  const parallel = !measures.P;
  const prompt = toolPrompt(tool, pending, refTarget);
  const locusShown = mode === "locus" || tool === "locus";
  const locusMatches = lines.some((line) => Math.abs(line.m - measures.locus.m) < 0.05 && Math.abs(line.b - measures.locus.intercept) < 0.2) || locusShown;

  const toolsBar = (
    <>
      <button type="button" aria-label="Undo" onClick={undo}><Undo2 size={16} /></button>
      <button type="button" aria-label="Redo" onClick={redo}><Redo2 size={16} /></button>
      <button type="button" className="coord-reset" onClick={resetAll}><RotateCcw size={14} /> Reset All</button>
    </>
  );

  const setPointCoord = (id: string, axis: "x" | "y", raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    push({ ...scene, points: points.map((p) => (p.id === id ? { ...p, [axis]: n } : p)) }, `${id} ${axis} set to ${n}.`);
  };

  return (
    <div className={`coord-wrap is-${sheet}`} tabIndex={0} aria-label="Coordinate Geometry Lab">
      <div className="coord-live-region" aria-live="polite">{announce}</div>
      {headerHost ? createPortal(toolsBar, headerHost) : <div className="coord-toolbar">{toolsBar}</div>}

      <div className="coord-sheet-nav" aria-label="Coordinate panels">
        <button type="button" className={sheet === "tools" ? "is-on" : ""} onClick={() => setSheet("tools")}>Controls</button>
        <button type="button" className={sheet === "plane" ? "is-on" : ""} onClick={() => setSheet("plane")}>Plane</button>
        <button type="button" className={sheet === "live" ? "is-on" : ""} onClick={() => setSheet("live")}>Measure</button>
      </div>

      <div className="coord-lab">
        <div className="coord-col">
          <section className="coord-card">
            <h2>Mode</h2>
            <select className="coord-select" value={mode} onChange={(event) => setMode(event.target.value as CoordModeId)} aria-label="Coordinate mode">
              {COORD_MODES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </section>

          <section className="coord-card">
            <h2>Objects</h2>
            {points.map((p) => (
              <div key={p.id} className={`coord-obj${p.visible ? "" : " is-off"}${selected === p.id ? " is-sel" : ""}`} onClick={() => setSelected(p.id)}>
                <i style={{ background: p.color }} />
                {p.label}
                {selected === p.id ? (
                  <span className="coord-edit">
                    <input aria-label={`${p.label} x`} defaultValue={String(p.x)} onBlur={(e) => setPointCoord(p.id, "x", e.target.value)} />
                    <input aria-label={`${p.label} y`} defaultValue={String(p.y)} onBlur={(e) => setPointCoord(p.id, "y", e.target.value)} />
                  </span>
                ) : <span>({uMinus(p.x, fraction)}, {uMinus(p.y, fraction)})</span>}
                <button type="button" aria-label={`Toggle ${p.label}`} onClick={(e) => { e.stopPropagation(); setScene((c) => ({ ...c, points: c.points.map((item) => item.id === p.id ? { ...item, visible: !item.visible } : item) })); }}>
                  {p.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                {!CORE.has(p.id) ? <button type="button" aria-label={`Delete ${p.label}`} onClick={(e) => { e.stopPropagation(); push({ ...scene, points: points.filter((item) => item.id !== p.id) }); }}><Trash2 size={14} /></button> : null}
              </div>
            ))}
            {lines.map((line) => (
              <div key={line.id} className={`coord-obj${line.visible ? "" : " is-off"}${selected === line.id ? " is-sel" : ""}`} onClick={() => setSelected(line.id)}>
                <i style={{ background: line.color, borderRadius: 2 }} />
                Line {line.label}: {lineForms(line.m, line.b).slope}
                <button type="button" aria-label={`Toggle line ${line.label}`} onClick={(e) => { e.stopPropagation(); setScene((c) => ({ ...c, lines: c.lines.map((item) => item.id === line.id ? { ...item, visible: !item.visible } : item) })); }}>
                  {line.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                {!CORE.has(line.id) ? <button type="button" aria-label={`Delete line ${line.label}`} onClick={(e) => { e.stopPropagation(); push({ ...scene, lines: lines.filter((item) => item.id !== line.id) }); }}><Trash2 size={14} /></button> : null}
              </div>
            ))}
            {strokes.map((s) => (
              <div key={s.id} className={`coord-obj${selected === s.id ? " is-sel" : ""}`} onClick={() => setSelected(s.id)}>
                <i style={{ background: s.color, borderRadius: 2 }} />
                {s.kind}
                <button type="button" aria-label={`Delete ${s.kind}`} onClick={(e) => { e.stopPropagation(); push({ ...scene, strokes: strokes.filter((item) => item.id !== s.id) }); }}><Trash2 size={14} /></button>
              </div>
            ))}
            <div className="coord-add-row">
              <button type="button" className="coord-add" onClick={() => setTool("point")}><Plus size={12} /> Point</button>
              <button type="button" className="coord-add" onClick={() => setTool("line")}><Plus size={12} /> Line</button>
              <button type="button" className="coord-add" onClick={() => { setMode("locus"); setTool("locus"); }}><Plus size={12} /> Locus</button>
            </div>
          </section>

          <section className="coord-card">
            <h2>Tools</h2>
            <div className="coord-tools">
              {TOOLS.map((item) => (
                <button key={item.id} type="button" className={tool === item.id ? "is-on" : ""} aria-pressed={tool === item.id} onClick={() => (item.id === "clear" ? clearExtras() : (setTool(item.id), setRefTarget(null), setPending(null)))}>
                  <ToolIcon id={item.id} />
                  {item.label}
                </button>
              ))}
            </div>
            {(tool === "perp" || tool === "parallel") && (
              <div className="coord-picker" aria-label="Construction reference">
                {tool === "perp" ? (
                  <>
                    <button type="button" className={refTarget === "ell" ? "is-on" : ""} onClick={() => setRefTarget("ell")}>⊥ to ℓ</button>
                    <button type="button" className={refTarget === "ab" ? "is-on" : ""} onClick={() => setRefTarget("ab")}>⊥ bisector of AB</button>
                  </>
                ) : (
                  <>
                    <button type="button" className={refTarget === "ell" ? "is-on" : ""} onClick={() => setRefTarget("ell")}>∥ to ℓ</button>
                    <button type="button" className={refTarget === "em" ? "is-on" : ""} onClick={() => setRefTarget("em")}>∥ to m</button>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="coord-card">
            <h2>Snap & Grid</h2>
            <label className="coord-toggle"><input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} /> Snap to Grid</label>
            <label className="coord-toggle"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Show Grid</label>
            <div className="coord-view">
              <button type="button" className={!axesOnly ? "is-on" : ""} aria-label="Standard view" onClick={() => setAxesOnly(false)}><Grid3X3 size={16} /></button>
              <button type="button" className={axesOnly ? "is-on" : ""} aria-label="Axes only view" onClick={() => setAxesOnly(true)}><Spline size={16} /></button>
            </div>
            <label className="coord-toggle">Display
              <select className="coord-select" value={fraction ? "standard" : "decimal"} onChange={(e) => setFraction(e.target.value === "standard")} aria-label="Display format">
                <option value="standard">Standard</option>
                <option value="decimal">Decimal</option>
              </select>
            </label>
            <label className="coord-toggle">Grid Spacing
              <input type="range" min={0.5} max={2} step={0.5} value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} aria-label="Grid spacing" />
              <output>{spacing}</output>
            </label>
            <div className="coord-export">
              <button type="button" className="coord-mini" onClick={() => setCam({ cx: 0, cy: 0, zoom: 1 })}>Fit −10…10</button>
              <button type="button" className="coord-mini" onClick={textbook}><RotateCcw size={12} /> Textbook figure</button>
            </div>
          </section>
        </div>

        <section className="coord-stage">
          {prompt ? <div className="coord-banner" role="status">{prompt}<button type="button" onClick={() => { setTool("select"); setPending(null); setRefTarget(null); }}>Cancel</button></div> : null}
          <svg
            ref={svgRef}
            className={`coord-svg${tool !== "select" && tool !== "clear" ? " is-place" : ""}`}
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            role="img"
            aria-label="Coordinate plane. Drag points, or use arrow keys after selecting a point."
            onPointerDown={onPointerDown}
            onPointerMove={(event) => {
              const world = clientToWorld(event);
              const view = clientToView(event);
              setHover(world);
              if (pending) setGhost(world);
              if (pan.current) {
                const u = unitOf(cam);
                setCam((c) => ({ ...c, cx: pan.current!.cx - (view.x - pan.current!.x) / u, cy: pan.current!.cy + (view.y - pan.current!.y) / u }));
                return;
              }
              if (drag.current) {
                setScene((current) => ({
                  ...current,
                  points: current.points.map((item) => (item.id === drag.current ? { ...item, ...world } : item)),
                }));
              }
            }}
            onPointerUp={() => {
              if (drag.current) {
                push(sceneRef.current, "Point moved.");
                drag.current = null;
              }
              pan.current = null;
            }}
            onPointerLeave={() => setHover(null)}
            onWheel={(event) => {
              event.preventDefault();
              const factor = event.deltaY > 0 ? 0.9 : 1.1;
              setCam((c) => ({ ...c, zoom: clamp(c.zoom * factor, 0.4, 4) }));
            }}
          >
            <rect width={VIEW.w} height={VIEW.h} fill="#f7fbff" />
            <defs>
              <marker id="coord-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#334155" />
              </marker>
            </defs>
            {showGrid && !axesOnly ? ticks.map((t) => (
              <g key={t}>
                <line x1={toScreen({ x: t, y: -12 }, cam).x} y1={toScreen({ x: t, y: -12 }, cam).y} x2={toScreen({ x: t, y: 12 }, cam).x} y2={toScreen({ x: t, y: 12 }, cam).y} stroke={t === 0 ? "#64748b" : "#e7eef6"} strokeWidth={t === 0 ? 2 : 1} />
                <line x1={toScreen({ x: -12, y: t }, cam).x} y1={toScreen({ x: -12, y: t }, cam).y} x2={toScreen({ x: 12, y: t }, cam).x} y2={toScreen({ x: 12, y: t }, cam).y} stroke={t === 0 ? "#64748b" : "#e7eef6"} strokeWidth={t === 0 ? 2 : 1} />
                {t !== 0 ? <text x={toScreen({ x: t, y: 0 }, cam).x} y={toScreen({ x: 0, y: 0 }, cam).y + 16} fontSize="10" fill="#64748b" textAnchor="middle">{t}</text> : null}
                {t !== 0 ? <text x={toScreen({ x: 0, y: 0 }, cam).x + 8} y={toScreen({ x: 0, y: t }, cam).y + 4} fontSize="10" fill="#64748b">{t}</text> : null}
              </g>
            )) : (
              <>
                <line x1={toScreen({ x: -12, y: 0 }, cam).x} y1={toScreen({ x: -12, y: 0 }, cam).y} x2={toScreen({ x: 12, y: 0 }, cam).x} y2={toScreen({ x: 12, y: 0 }, cam).y} stroke="#64748b" strokeWidth="2" />
                <line x1={toScreen({ x: 0, y: -12 }, cam).x} y1={toScreen({ x: 0, y: -12 }, cam).y} x2={toScreen({ x: 0, y: 12 }, cam).x} y2={toScreen({ x: 0, y: 12 }, cam).y} stroke="#64748b" strokeWidth="2" />
              </>
            )}
            <text x={VIEW.w - 18} y={toScreen({ x: 0, y: 0 }, cam).y - 10} fontSize="13" fontWeight="800">x</text>
            <text x={toScreen({ x: 0, y: 0 }, cam).x + 10} y="20" fontSize="13" fontWeight="800">y</text>
            {snap && hover ? <circle cx={toScreen(hover, cam).x} cy={toScreen(hover, cam).y} r="5" fill="none" stroke="#22d3ee" strokeDasharray="3 2" /> : null}

            {lines.filter((l) => l.visible).map((line) => {
              const [a, b] = lineEnds(line).map((p) => toScreen(p, cam));
              const hot = (hoverStep === "ell" && line.id === "l") || (hoverStep === "em" && line.id === "m") || selected === line.id;
              return (
                <g key={line.id}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={line.color} strokeWidth={hot ? 3.4 : 2.4} />
                  {line.id === "l" ? <text x={a.x + 18} y={a.y + 18} fill={line.color} fontSize="13" fontWeight="800">{line.label}: {lineForms(line.m, line.b).slope}</text> : null}
                </g>
              );
            })}

            {strokes.filter((s) => s.visible).map((s) => {
              const a = toScreen(s.a, cam);
              const b = s.kind === "ray" ? toScreen(extend(s.a, s.b, 24), cam) : toScreen(s.b, cam);
              const tip = toScreen(s.b, cam);
              return (
                <g key={s.id}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={s.color} strokeWidth="2.2" markerEnd={s.kind !== "segment" ? "url(#coord-arrow)" : undefined} />
                  <circle cx={a.x} cy={a.y} r="3" fill={s.color} />
                  {s.kind !== "ray" ? <circle cx={tip.x} cy={tip.y} r="3" fill={s.color} /> : null}
                </g>
              );
            })}

            {pending && ghost && (tool === "line" || tool === "segment" || tool === "ray" || tool === "vector") ? (
              <line x1={toScreen(pending, cam).x} y1={toScreen(pending, cam).y} x2={toScreen(ghost, cam).x} y2={toScreen(ghost, cam).y} stroke="#64748b" strokeDasharray="5 4" />
            ) : null}

            {distPair[0].visible && distPair[1].visible && (mode === "distance" || mode === "midpoint" || mode === "section") ? (
              <line x1={toScreen(distPair[0], cam).x} y1={toScreen(distPair[0], cam).y} x2={toScreen(distPair[1], cam).x} y2={toScreen(distPair[1], cam).y} stroke="#10b981" strokeDasharray="6 4" strokeWidth="2" />
            ) : null}
            {mode === "distance" ? (
              <text x={(toScreen(distPair[0], cam).x + toScreen(distPair[1], cam).x) / 2 + 8} y={(toScreen(distPair[0], cam).y + toScreen(distPair[1], cam).y) / 2 - 8} fill="#059669" fontSize="13" fontWeight="800">d = {fmtNum(distValue, 5)}</text>
            ) : null}
            {ell.visible && mode === "slope" ? <RiseRunOnLine m={ell.m} b={ell.b} color="#f59e0b" cam={cam} /> : null}
            {locusShown && Number.isFinite(measures.locus.m) ? (
              <line
                x1={toScreen({ x: -12, y: measures.locus.m * -12 + measures.locus.intercept }, cam).x}
                y1={toScreen({ x: -12, y: measures.locus.m * -12 + measures.locus.intercept }, cam).y}
                x2={toScreen({ x: 12, y: measures.locus.m * 12 + measures.locus.intercept }, cam).x}
                y2={toScreen({ x: 12, y: measures.locus.m * 12 + measures.locus.intercept }, cam).y}
                stroke="#059669" strokeDasharray="7 4" strokeWidth="2.2"
              />
            ) : null}
            {mode !== "locus" && measures.P ? (
              <g className={pulseP || hoverStep === "P" ? "coord-pulse" : undefined}>
                <circle cx={toScreen(measures.P, cam).x} cy={toScreen(measures.P, cam).y} r="5" fill="#0f172a" />
                <text x={toScreen(measures.P, cam).x + 8} y={toScreen(measures.P, cam).y - 8} fontSize="12" fontWeight="800">P ({fmtPretty(measures.P.x)}, {fmtPretty(measures.P.y)})</text>
              </g>
            ) : null}
            {mode === "midpoint" && A.visible && B.visible ? (
              <circle cx={toScreen(measures.mid, cam).x} cy={toScreen(measures.mid, cam).y} r="5" fill="#0f766e" stroke="#fff" strokeWidth="2" />
            ) : null}
            {mode === "section" ? (
              <g>
                <circle cx={toScreen(measures.section, cam).x} cy={toScreen(measures.section, cam).y} r="6" fill="#7c3aed" />
                <text x={toScreen(measures.section, cam).x + 8} y={toScreen(measures.section, cam).y - 8} fill="#7c3aed" fontSize="12" fontWeight="800">T</text>
              </g>
            ) : null}
            {points.filter((p) => p.visible).map((p, index) => {
              const s = toScreen(p, cam);
              const dy = p.y < 0 ? -16 : -10;
              const dx = index % 2 === 0 ? 10 : -56;
              return (
                <g key={p.id} className="coord-handle">
                  <circle cx={s.x} cy={s.y} r="16" fill="transparent" />
                  <circle cx={s.x} cy={s.y} r={selected === p.id ? 8 : 7} fill={p.color} stroke={selected === p.id ? "#0f172a" : "#fff"} strokeWidth="2" />
                  <text x={s.x + dx} y={s.y + dy} fill={p.color} fontSize="13" fontWeight="800">{p.label} ({uMinus(p.x, true)}, {uMinus(p.y, true)})</text>
                </g>
              );
            })}
          </svg>

          {hover ? <div className="coord-float coord-hover">({uMinus(hover.x, fraction)}, {uMinus(hover.y, fraction)})</div> : null}
          {mode === "locus" && (
            <div className="coord-float coord-mid">
              <b>Locus of P</b>
              <div>perpendicular bisector of AB</div>
              <small>{Number.isFinite(measures.locus.m) ? lineForms(measures.locus.m, measures.locus.intercept).slope : `x = ${fmtPretty(measures.locus.intercept)}`}</small>
            </div>
          )}
          {mode === "midpoint" && (
            <div className="coord-float coord-mid">
              <b>Midpoint of AB</b>
              <div>M ( {fmtPretty(measures.mid.x)} , {fmtPretty(measures.mid.y)} )</div>
            </div>
          )}
          {mode === "slope" && (
            <div className="coord-float coord-slope-card">
              <b>Slope of ℓ</b>
              <div>m = {fmtPretty(ell.m)} = {fmtNum(ell.m, 1)}</div>
              <div>Rise = {measures.rr.rise} · Run = {measures.rr.run}</div>
            </div>
          )}
          {coach ? (
            <div className="coord-coach">
              <div>
                <p>Drag point A. Distance, midpoint, and the equations update from the live coordinates.</p>
                <button type="button" className="coord-cta" onClick={() => { setCoach(false); try { localStorage.setItem(COACH_KEY, "1"); } catch { /* ignore */ } }}>Got it</button>
              </div>
            </div>
          ) : null}
          {toast ? <div className="coord-toast" role="status">{toast}</div> : null}

          <div className="coord-dock">
            <b>Intersection of ℓ and m</b>
            <code>{measures.formsL.slope}</code>
            <code>{measures.formsM.standard}</code>
            {parallel ? <span className="coord-warn">No unique intersection — the lines are parallel.</span> : <span>→ P ( {fmtPretty(measures.P!.x)}, {fmtPretty(measures.P!.y)} )</span>}
            <button type="button" className="coord-cta" onClick={solveIntersection}>Solve Intersection</button>
          </div>
        </section>

        <aside className="coord-col coord-live">
          <section className="coord-card">
            <nav className="coord-tabs" aria-label="Inspector">
              {([["tree", "Live Object Tree"], ["measure", "Measurements"], ["deps", "Dependencies"], ["proof", "Proof"]] as const).map(([id, label]) => (
                <button key={id} type="button" className={right === id ? "is-on" : ""} onClick={() => setRight(id)}>{label}</button>
              ))}
            </nav>

            {right === "tree" ? (
              <ul className="coord-tree">
                <li>Free points<ul>{points.map((p) => <li key={p.id}>Point {p.label} ({uMinus(p.x, fraction)}, {uMinus(p.y, fraction)})</li>)}</ul></li>
                <li>AB, AC, BC depend on their endpoints.</li>
                <li>Line ℓ: {measures.formsL.slope}</li>
                <li>Line m: {measures.formsM.standard}</li>
                <li>P = ℓ ∩ m {measures.P ? `(${fmtPretty(measures.P.x)}, ${fmtPretty(measures.P.y)})` : "(parallel)"}</li>
                <li>M = midpoint(A, B)</li>
                <li>Locus = perpendicular bisector of AB</li>
              </ul>
            ) : null}

            {right === "measure" ? (
              <>
                <h3>Distances</h3>
                <MeasureCheck label="AB" value={fmtNum(measures.AB, 5)} color="#10b981" on={activeDist === "AB"} onToggle={() => { setActiveDist("AB"); setMode("distance"); }} />
                <MeasureCheck label="AC" value={fmtNum(measures.AC, 5)} color="#f59e0b" on={activeDist === "AC"} onToggle={() => { setActiveDist("AC"); setMode("distance"); }} />
                <MeasureCheck label="BC" value={fmtNum(measures.BC, 5)} color="#3b82f6" on={activeDist === "BC"} onToggle={() => { setActiveDist("BC"); setMode("distance"); }} />
                <h3>Slopes</h3>
                <div className="coord-row">m<sub>ℓ</sub> = {fmtPretty(ell.m)} = {fmtNum(ell.m, 1)} {matchEll ? <span className="coord-ok" title="AC has the same slope as ℓ">✓</span> : null}</div>
                <div className="coord-row">m<sub>m</sub> = {fmtPretty(em.m)} {Math.abs(ell.m - em.m) < 1e-9 ? <span className="coord-ok">∥</span> : null}</div>
                <h3>Equations</h3>
                <EqBlock title="Line ℓ" color={ell.color} forms={measures.formsL} latex={measures.latexL} onCopy={copyText} hot={hoverStep === "ell"} />
                <EqBlock title="Line m" color={em.color} forms={measures.formsM} latex={measures.latexM} onCopy={copyText} hot={hoverStep === "em"} />
                <h3>Algebra → Geometry link</h3>
                <p className="coord-note">Line ℓ has slope {fmtPretty(ell.m)} (rise/run). Increasing rise or run changes the slope.</p>
                <button type="button" className="coord-link" onClick={() => setMode("slope")}>Learn more</button>
                <h3>Intersection solver</h3>
                {parallel ? <p className="coord-warn">No unique point — ℓ ∥ m.</p> : <p><strong>(x, y) = ( {fmtPretty(measures.P!.x)} , {fmtPretty(measures.P!.y)} )</strong> <span className="coord-ok">✓</span></p>}
                <button type="button" className="coord-link" onClick={solveIntersection}>Show Steps</button>
                {mode === "section" ? (
                  <label className="coord-toggle">Ratio m:n
                    <input type="range" min={1} max={5} value={ratioM} onChange={(e) => setRatioM(Number(e.target.value))} aria-label="Section ratio m" />
                    <input type="range" min={1} max={5} value={ratioN} onChange={(e) => setRatioN(Number(e.target.value))} aria-label="Section ratio n" />
                    {ratioM}:{ratioN}
                  </label>
                ) : null}
                <div className="coord-export">
                  <button type="button" className="coord-mini" onClick={() => copyText([measures.latexL.slope, measures.latexL.standard, measures.latexL.general, measures.latexM.slope, measures.latexM.standard, measures.latexM.general].join("\n"), "LaTeX")}><Copy size={12} /> Copy LaTeX</button>
                  <button type="button" className="coord-mini" onClick={exportPng}><Camera size={12} /> PNG</button>
                  <button type="button" className="coord-mini" onClick={textbook}><Download size={12} /> Textbook figure</button>
                </div>
              </>
            ) : null}

            {right === "deps" ? (
              <ol className="coord-steps">
                <li>A, B, C are free points on the plane.</li>
                <li>AB, AC, BC depend on their endpoints.</li>
                <li>Line ℓ is {measures.formsL.slope}.</li>
                <li>Line m is {measures.formsM.standard}.</li>
                <li>P is the intersection of ℓ and m.</li>
                <li>The locus equidistant from A and B is the perpendicular bisector of AB.</li>
              </ol>
            ) : null}

            {right === "proof" ? (
              <>
                <h3>Distance</h3>
                <ol className="coord-steps">
                  <li>AB = √((x<sub>B</sub> − x<sub>A</sub>)² + (y<sub>B</sub> − y<sub>A</sub>)²)</li>
                  <li>= √(({fmtNum(B.x - A.x, 2)})² + ({fmtNum(B.y - A.y, 2)})²)</li>
                  <li>= {fmtNum(measures.AB, 5)}</li>
                </ol>
                <h3>Intersection</h3>
                <ol className="coord-steps">
                  <li className={hoverStep === "ell" ? "is-hot" : ""} onMouseEnter={() => setHoverStep("ell")} onMouseLeave={() => setHoverStep(null)}>{measures.formsL.slope}</li>
                  <li className={hoverStep === "em" ? "is-hot" : ""} onMouseEnter={() => setHoverStep("em")} onMouseLeave={() => setHoverStep(null)}>{measures.formsM.slope}</li>
                  <li>Set the y-values equal and solve for x.</li>
                  <li className={hoverStep === "P" ? "is-hot" : ""} onMouseEnter={() => setHoverStep("P")} onMouseLeave={() => setHoverStep(null)}>x = {measures.P ? fmtPretty(measures.P.x) : "—"}, y = {measures.P ? fmtPretty(measures.P.y) : "—"}</li>
                </ol>
              </>
            ) : null}

            <div className={`coord-challenge${challengeOk ? " is-ok" : ""}`} hidden={!challengeOpen && right !== "measure" && right !== "tree"} >
              <b>Challenge</b>
              <p>Find the locus of points equidistant from A and B (the perpendicular bisector of AB).</p>
              <button type="button" className="coord-cta" onClick={() => {
                const ok = locusMatches;
                setChallengeOk(ok);
                say(ok ? "Correct. The locus is the perpendicular bisector of AB." : "Not yet. Turn on Locus mode or construct the perpendicular bisector of AB.");
              }}>Check</button>
              {challengeOk === true ? <p className="coord-ok">Correct. The locus is the perpendicular bisector of AB.</p> : null}
              {challengeOk === false ? <p className="coord-warn">Show the locus (mode Locus) or construct ⊥ of AB, then check again.</p> : null}
            </div>
          </section>
        </aside>
      </div>
      <section className="msk-strip" aria-label="Learning loop">
        <div><b>Observe</b><small>{page.learning.observe}</small></div>
        <div><b>Understand</b><small>{page.learning.understand}</small></div>
        <div><b>Why</b><small>{page.learning.why}</small></div>
        <div><b>Try</b><small>{page.learning.try}</small></div>
        <button type="button" className="coord-strip-btn" onClick={() => { setChallengeOpen(true); setRight("measure"); setSheet("live"); }}>
          <b>Challenge</b>
          <small>{page.learning.challenge}</small>
        </button>
      </section>
    </div>
  );
}

function EqBlock({ title, color, forms, latex, onCopy, hot }: { title: string; color: string; forms: { slope: string; standard: string; general: string }; latex: { slope: string; standard: string; general: string }; onCopy: (text: string, label: string) => void; hot?: boolean }) {
  return (
    <div className={`coord-eq${hot ? " is-hot" : ""}`}>
      <b style={{ color }}>{title}</b>
      <p>Slope-Intercept: {forms.slope} <button type="button" className="coord-mini" onClick={() => onCopy(forms.slope, "slope-intercept")}><Copy size={11} /></button></p>
      <p>Standard: {forms.standard} <button type="button" className="coord-mini" onClick={() => onCopy(forms.standard, "standard")}><Copy size={11} /></button></p>
      <p>General: {forms.general} <button type="button" className="coord-mini" onClick={() => onCopy(forms.general, "general")}><Copy size={11} /></button></p>
      <button type="button" className="coord-mini" onClick={() => onCopy(`${latex.slope}\n${latex.standard}\n${latex.general}`, `${title} LaTeX`)}>LaTeX</button>
    </div>
  );
}

function MeasureCheck({ label, value, color, on, onToggle }: { label: string; value: string; color: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="coord-row">
      <span style={{ color }}>{label} = {value}</span>
      <button type="button" className={`coord-check${on ? " is-on" : ""}`} aria-pressed={on} onClick={onToggle}>{on ? "✓" : ""}</button>
    </div>
  );
}

function RiseRunOnLine({ m, b, color, cam }: { m: number; b: number; color: string; cam: Cam }) {
  if (!Number.isFinite(m)) return null;
  const rr = riseRun(m);
  const from = { x: 0, y: b };
  const to = { x: rr.run, y: b + rr.rise };
  const a = toScreen(from, cam);
  const corner = toScreen({ x: to.x, y: from.y }, cam);
  const c = toScreen(to, cam);
  return (
    <g>
      <line x1={a.x} y1={a.y} x2={corner.x} y2={corner.y} stroke={color} strokeDasharray="4 3" />
      <line x1={corner.x} y1={corner.y} x2={c.x} y2={c.y} stroke={color} strokeDasharray="4 3" />
      <polygon points={`${a.x},${a.y} ${corner.x},${corner.y} ${c.x},${c.y}`} fill={color} opacity="0.12" />
      <text x={(a.x + corner.x) / 2} y={a.y + 16} fill={color} fontSize="12" fontWeight="800">{rr.run}</text>
      <text x={corner.x + 8} y={(corner.y + c.y) / 2} fill={color} fontSize="12" fontWeight="800">{rr.rise}</text>
    </g>
  );
}

function ToolIcon({ id }: { id: Tool }) {
  if (id === "select") return <MousePointer2 />;
  if (id === "point") return <span style={{ width: 10, height: 10, borderRadius: 99, background: "#3b82f6" }} />;
  if (id === "line" || id === "segment") return <Spline />;
  if (id === "clear") return <X />;
  if (id === "vector" || id === "ray") return <ArrowUpRight />;
  if (id === "intersect") return <Crosshair />;
  return <Spline />;
}
