import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import { fmt } from "../../../mockup/studioLabKit";
import { assignGenerations, expectedMeetCount, indexEdges, indexVertices, latticeVectors } from "./adjacency";
import { generateHexTiles, generateSquareTiles, generateTriangleTiles } from "./lattices";
import {
  boundsFromPoints,
  dist,
  inflateVertices,
  nearestPointOnSegment,
  pointInPolygon,
  regularInteriorAngle,
  regularPolygonArea,
  regularPolygonAtVertex,
  regularTessellationCheck,
  screenCornersWorld,
  sectorPath,
  worldFromScreen,
} from "./math";
import type { AnimationMode, ColorMode, Tile, TileKind, VertexRecord } from "./types";
import "./TessellationLab.css";

const SPEEDS = { slow: 420, normal: 180, fast: 90 } as const;
const FILLS = [
  ["#e7f3ff", "#d8f4fb", "#efe7ff"],
  ["#dceaf8", "#cfeaf4", "#e4daf8"],
  ["#d3e2f4", "#c3e3ee", "#d8cef0"],
];

const CHALLENGES = [
  { id: 1, prompt: "How many equilateral triangles meet at a point?", answer: 6, hint: "Interior 60°. 360 ÷ 60." },
  { id: 2, prompt: "How many squares meet at a vertex to make 360°?", answer: 4, hint: "90 × ? = 360." },
  { id: 3, prompt: "Which regular n-gon fails to tile by itself? Enter n.", answer: 5, hint: "Try 5 sides." },
  { id: 4, prompt: "A regular pentagon leaves a gap of how many degrees?", answer: 36, hint: "360 − 3×108." },
  { id: 5, prompt: "Set n so exactly 3 regular polygons meet at a vertex.", answer: 6, hint: "120° interiors." },
];

type ExperimentKind = TileKind | "experiment";

function tileSizeRange(kind: ExperimentKind): { min: number; max: number; label: string } {
  if (kind === "hexagon") return { min: 25, max: 90, label: "Hex radius" };
  if (kind === "triangle") return { min: 30, max: 120, label: "Triangle side" };
  return { min: 30, max: 120, label: "Square side" };
}

function generateKind(kind: TileKind, bounds: { minX: number; minY: number; maxX: number; maxY: number }, size: number) {
  if (kind === "triangle") return generateTriangleTiles(bounds, size);
  if (kind === "square") return generateSquareTiles(bounds, size);
  return generateHexTiles(bounds, size);
}

function fillFor(tile: Tile, coloring: ColorMode, dim: boolean) {
  const idx = coloring === "uniform" ? 0 : coloring === "alternating" ? tile.colorIndex % 2 : tile.colorIndex % 3;
  const family = coloring === "uniform" ? 0 : coloring === "alternating" ? 1 : 2;
  const color = FILLS[family]?.[idx] ?? "#e8f4ff";
  return dim ? "#eef3f6" : color;
}

function kindLabel(kind: ExperimentKind) {
  if (kind === "triangle") return "Equilateral triangle";
  if (kind === "square") return "Square";
  if (kind === "hexagon") return "Regular hexagon";
  return "Regular polygon";
}

function sidesOf(kind: ExperimentKind, n: number) {
  if (kind === "triangle") return 3;
  if (kind === "square") return 4;
  if (kind === "hexagon") return 6;
  return n;
}

export default function TessellationLab() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [sizePx, setSizePx] = useState({ w: 720, h: 560 });
  const [kind, setKind] = useState<ExperimentKind>("triangle");
  const [pattern, setPattern] = useState<AnimationMode>("expand");
  const [tileSize, setTileSize] = useState(56);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(true);
  const [revealed, setRevealed] = useState(0);
  const [n, setN] = useState(5);
  const [coloring, setColoring] = useState<ColorMode>("alternating");
  const [showAngles, setShowAngles] = useState(true);
  const [showCenters, setShowCenters] = useState(false);
  const [showEdges, setShowEdges] = useState(true);
  const [showUnit, setShowUnit] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showGens, setShowGens] = useState(false);
  const [compare, setCompare] = useState(false);
  const [overlapMode, setOverlapMode] = useState(false);
  const [hoverTile, setHoverTile] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [hoverGen, setHoverGen] = useState<number | null>(null);
  const [challenge, setChallenge] = useState(0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [panning, setPanning] = useState(false);
  const [preset, setPreset] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number; moved: boolean } | null>(null);
  const lastTick = useRef(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const apply = () => setSizePx({ w: Math.max(280, el.clientWidth), h: Math.max(320, el.clientHeight) });
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const validKind: TileKind = kind === "experiment" ? "triangle" : kind;
  const size = kind === "hexagon" ? Math.min(90, Math.max(25, tileSize)) : Math.min(120, Math.max(30, tileSize));
  const check = regularTessellationCheck(sidesOf(kind, n));

  const worldBounds = useMemo(() => {
    const pad = kind === "hexagon" ? size * 2.4 : size * 2;
    const corners = screenCornersWorld(sizePx.w, sizePx.h, pan.x, pan.y, zoom, rotation);
    return boundsFromPoints(corners, pad);
  }, [kind, pan.x, pan.y, rotation, size, sizePx.h, sizePx.w, zoom]);

  const tiles = useMemo(() => {
    if (kind === "experiment" || compare) return [];
    const raw = generateKind(validKind, worldBounds, size);
    return assignGenerations(raw, validKind, pattern === "sweep" ? "sweep" : "expand");
  }, [compare, kind, pattern, size, validKind, worldBounds]);

  const maxGen = useMemo(() => tiles.reduce((m, t) => Math.max(m, t.generation), 0), [tiles]);
  const visible = useMemo(() => {
    if (pattern === "instant") return tiles;
    return tiles.filter((tile) => tile.generation <= revealed);
  }, [pattern, revealed, tiles]);

  const vertices = useMemo(() => indexVertices(visible, size), [size, visible]);
  const edges = useMemo(() => indexEdges(visible, size), [size, visible]);
  const interiorVertex = useMemo(
    () => vertices.find((v) => v.tileIds.length === expectedMeetCount(validKind)) ?? vertices.find((v) => v.tileIds.length >= 3) ?? null,
    [validKind, vertices],
  );

  useEffect(() => {
    setRevealed(pattern === "instant" ? 999 : 0);
    setPlaying(pattern !== "instant");
    setSelectedTile(null);
    setSelectedVertex(null);
    setSelectedEdge(null);
  }, [kind, pattern, size, rotation]);

  useEffect(() => {
    if (!playing || pattern === "instant" || kind === "experiment" || compare) return;
    let frame = 0;
    const stepMs = SPEEDS[speed];
    const tick = (now: number) => {
      if (now - lastTick.current >= stepMs) {
        lastTick.current = now;
        setRevealed((value) => (value >= maxGen ? value : value + 1));
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [compare, kind, maxGen, pattern, playing, speed]);

  useEffect(() => {
    if (preset === "pentagon") {
      setKind("experiment");
      setN(5);
      setCompare(false);
    } else if (preset === "compare") {
      setCompare(true);
      setKind("triangle");
    } else if (preset === "triangle" || preset === "square" || preset === "hexagon") {
      setKind(preset);
      setCompare(false);
      setPattern("expand");
      setShowAngles(true);
    }
  }, [preset]);

  useEffect(() => {
    if (!preset || preset === "pentagon" || preset === "compare") return;
    if (interiorVertex) setSelectedVertex(interiorVertex.key);
  }, [interiorVertex, preset]);

  const selected = visible.find((t) => t.id === selectedTile) ?? visible.find((t) => t.id === hoverTile) ?? null;
  const vertex = vertices.find((v) => v.key === selectedVertex);
  const edge = edges.find((e) => e.key === selectedEdge);
  const meet = vertex ? vertex.tileIds.length : expectedMeetCount(validKind);
  const interior = check.interior;

  const toWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = hostRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return worldFromScreen(clientX - rect.left, clientY - rect.top, sizePx.w, sizePx.h, pan.x, pan.y, zoom, rotation);
    },
    [pan.x, pan.y, rotation, sizePx.h, sizePx.w, zoom],
  );

  const hitTile = (pt: { x: number; y: number }) => {
    for (let i = visible.length - 1; i >= 0; i--) {
      const tile = visible[i];
      if (tile && pointInPolygon(pt, tile.vertices)) return tile;
    }
    return null;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const world = toWorld(event.clientX, event.clientY);
    if (!drag.current) {
      const tile = hitTile(world);
      setHoverTile(tile?.id ?? null);
      return;
    }
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.hypot(dx, dy) > 4) {
      drag.current.moved = true;
      setPanning(true);
      setPan({ x: drag.current.panX + dx, y: drag.current.panY + dy });
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const world = toWorld(event.clientX, event.clientY);
    const wasDrag = drag.current?.moved;
    drag.current = null;
    setPanning(false);
    if (wasDrag) return;
    const nearV = nearestVertex(world, vertices, 12 / zoom);
    if (nearV) {
      setSelectedVertex(nearV.key);
      setSelectedEdge(null);
      setSelectedTile(null);
      return;
    }
    const nearE = nearestEdge(world, edges, 8 / zoom);
    if (nearE) {
      setSelectedEdge(nearE.key);
      setSelectedVertex(null);
      setSelectedTile(null);
      return;
    }
    const tile = hitTile(world);
    setSelectedTile(tile?.id ?? null);
    setSelectedVertex(null);
    setSelectedEdge(null);
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = hostRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = event.clientX - rect.left;
    const sy = event.clientY - rect.top;
    const before = worldFromScreen(sx, sy, sizePx.w, sizePx.h, pan.x, pan.y, zoom, rotation);
    const next = Math.min(2.5, Math.max(0.5, zoom * (event.deltaY > 0 ? 0.92 : 1.08)));
    const originX = sizePx.w / 2 + pan.x;
    const originY = sizePx.h / 2 + pan.y;
    const afterScreenX = originX + before.x * next; // rotation ignored for pointer zoom approximation
    const afterScreenY = originY + before.y * next;
    setZoom(next);
    if (rotation === 0) setPan({ x: pan.x + (sx - afterScreenX), y: pan.y + (sy - afterScreenY) });
  };

  const highlightIds = new Set<string>();
  if (vertex) vertex.tileIds.forEach((id) => highlightIds.add(id));
  if (edge) edge.tileIds.forEach((id) => highlightIds.add(id));
  if (hoverGen !== null) visible.filter((t) => t.generation === hoverGen).forEach((t) => highlightIds.add(t.id));

  const vectors = latticeVectors(validKind, size);
  const unitOrigin = visible.find((t) => t.generation === 0)?.center ?? { x: 0, y: 0 };

  const applyPreset = (id: string) => {
    setPreset(id);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setRevealed(0);
  };

  const checkChallenge = () => {
    const expected = CHALLENGES[challenge]?.answer ?? 0;
    setStatus(Math.abs(Number(answer) - expected) < 0.2 ? "Correct." : CHALLENGES[challenge]?.hint ?? "");
  };

  return (
    <div className="tlab">
      <section className={`tlab-col tlab-controls${controlsOpen ? "" : " is-collapsed"}`}>
        <button type="button" className="tlab-mobile" onClick={() => setControlsOpen((v) => !v)}>
          {controlsOpen ? "Hide controls" : "Show controls"}
        </button>
        <h2>Tile</h2>
        <div className="tlab-seg" role="group" aria-label="Tile">
          {([
            ["triangle", "Triangle"],
            ["square", "Square"],
            ["hexagon", "Hexagon"],
            ["experiment", "Try another"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" className={kind === id ? "is-on" : ""} onClick={() => { setKind(id); setCompare(false); setPreset(null); }}>
              {label}
            </button>
          ))}
        </div>
        {kind === "experiment" ? (
          <label className="tlab-slider">
            <span>Sides n</span>
            <div>
              <input type="range" min={3} max={12} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
              <output>{n}</output>
            </div>
          </label>
        ) : (
          <label className="tlab-slider">
            <span>{tileSizeRange(kind).label}</span>
            <div>
              <input type="range" min={tileSizeRange(kind).min} max={tileSizeRange(kind).max} step={1} value={tileSize} onChange={(e) => setTileSize(Number(e.target.value))} />
              <output>{fmt(tileSize, 0)}</output>
            </div>
          </label>
        )}
        <h2>Pattern</h2>
        <div className="tlab-seg" role="group" aria-label="Pattern">
          {([
            ["expand", "Expand from Center"],
            ["sweep", "Sweep"],
            ["instant", "Instant Fill"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" className={pattern === id ? "is-on" : ""} onClick={() => setPattern(id)}>{label}</button>
          ))}
        </div>
        <div className="tlab-seg" role="group" aria-label="Speed">
          {(["slow", "normal", "fast"] as const).map((id) => (
            <button key={id} type="button" className={speed === id ? "is-on" : ""} onClick={() => setSpeed(id)}>{id}</button>
          ))}
        </div>
        <label className="tlab-slider">
          <span>Rotation</span>
          <div>
            <input type="range" min={0} max={60} step={15} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
            <output>{rotation}°</output>
          </div>
        </label>
        <div className="tlab-btn-row">
          <button type="button" className={playing ? "is-on" : ""} onClick={() => setPlaying((v) => !v)}>{playing ? "Pause" : "Play"}</button>
          <button type="button" onClick={() => { setPlaying(false); setRevealed((v) => Math.min(maxGen, v + 1)); }}>Step</button>
          <button type="button" onClick={() => { setPan({ x: 0, y: 0 }); setZoom(1); setRevealed(0); setPlaying(pattern !== "instant"); }}>Reset</button>
        </div>
        <label className="tlab-toggle"><input type="checkbox" checked={showAngles} onChange={(e) => setShowAngles(e.target.checked)} /> Show vertex angles</label>
        <label className="tlab-toggle"><input type="checkbox" checked={showCenters} onChange={(e) => setShowCenters(e.target.checked)} /> Show tile centers</label>
        <label className="tlab-toggle"><input type="checkbox" checked={showEdges} onChange={(e) => setShowEdges(e.target.checked)} /> Show shared edges</label>
        <label className="tlab-toggle"><input type="checkbox" checked={showUnit} onChange={(e) => setShowUnit(e.target.checked)} /> Show repeating unit</label>
        <label className="tlab-toggle"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Show coordinates / grid</label>
        <label className="tlab-toggle"><input type="checkbox" checked={showGens} onChange={(e) => setShowGens(e.target.checked)} /> Show generations</label>
        <h2>Coloring</h2>
        <div className="tlab-seg">
          {([
            ["uniform", "Uniform"],
            ["alternating", "Alternating"],
            ["tri", "3-color"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" className={coloring === id ? "is-on" : ""} onClick={() => setColoring(id)}>{label}</button>
          ))}
        </div>
        <h2>Zoom</h2>
        <div className="tlab-btn-row">
          <button type="button" onClick={() => setZoom((z) => Math.min(2.5, z * 1.15))}>Zoom in</button>
          <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z / 1.15))}>Zoom out</button>
          <button type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Fit</button>
        </div>
        <h2>Presets</h2>
        <div className="tlab-presets">
          <button type="button" className={preset === "triangle" ? "is-on" : ""} onClick={() => applyPreset("triangle")}>Why triangles tile</button>
          <button type="button" className={preset === "square" ? "is-on" : ""} onClick={() => applyPreset("square")}>Why squares tile</button>
          <button type="button" className={preset === "hexagon" ? "is-on" : ""} onClick={() => applyPreset("hexagon")}>Why hexagons tile</button>
          <button type="button" className={preset === "pentagon" ? "is-on" : ""} onClick={() => applyPreset("pentagon")}>Why pentagons fail</button>
          <button type="button" className={preset === "compare" ? "is-on" : ""} onClick={() => applyPreset("compare")}>Compare 3, 4, 5, 6</button>
        </div>
        <button type="button" className={`tlab-preset${compare ? " is-on" : ""}`} onClick={() => setCompare((v) => !v)}>Compare vertex neighborhoods</button>
      </section>

      <section className="tlab-col tlab-viz">
        <div
          ref={hostRef}
          className={`tlab-stage${panning ? " is-panning" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { drag.current = null; setPanning(false); }}
          onWheel={onWheel}
        >
          <div className="tlab-hud">
            <button type="button" className={playing ? "is-on" : ""} onClick={() => setPlaying((v) => !v)}>{playing ? "Pause" : "Play"}</button>
            <button type="button" onClick={() => setRevealed((v) => Math.min(maxGen, v + 1))}>Step</button>
            <span className="tlab-note" style={{ margin: 0, padding: "6px 8px", background: "#fff", borderRadius: 8 }}>
              {fmt(zoom, 2)}× · gen {pattern === "instant" ? maxGen : Math.min(revealed, maxGen)}/{maxGen} · {visible.length} tiles
            </span>
          </div>
          {compare ? (
            <ComparePanels size={tileSize} n={n} />
          ) : kind === "experiment" ? (
            <ExperimentView n={n} overlap={overlapMode} onToggleOverlap={() => setOverlapMode((v) => !v)} />
          ) : (
            <svg className="tlab-svg" viewBox={`0 0 ${sizePx.w} ${sizePx.h}`} role="img" aria-label={`${kindLabel(kind)} tessellation`}>
              <defs>
                <pattern id="tlab-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e4edf6" strokeWidth="1" />
                </pattern>
              </defs>
              {showGrid ? <rect width={sizePx.w} height={sizePx.h} fill="url(#tlab-grid)" /> : <rect width={sizePx.w} height={sizePx.h} fill="#f7fbff" />}
              <g transform={`translate(${sizePx.w / 2 + pan.x} ${sizePx.h / 2 + pan.y}) rotate(${rotation}) scale(${zoom})`}>
                {visible.map((tile) => {
                  const active = tile.id === selectedTile || tile.id === hoverTile || highlightIds.has(tile.id);
                  const dim = highlightIds.size > 0 && !highlightIds.has(tile.id) && tile.id !== selectedTile;
                  const pts = inflateVertices(tile.vertices, 0.45).map((p) => `${p.x},${p.y}`).join(" ");
                  const enter = pattern !== "instant" && tile.generation === revealed;
                  return (
                    <polygon
                      key={tile.id}
                      className={`tlab-tile${enter ? " is-new" : ""}`}
                      points={pts}
                      fill={fillFor(tile, coloring, dim)}
                      stroke={active ? "#147df2" : fillFor(tile, coloring, dim)}
                      strokeWidth={active ? 1.8 / zoom : 0.7 / zoom}
                      strokeLinejoin="round"
                    />
                  );
                })}
                {showEdges &&
                  edges.map((item) => (
                    <line
                      key={item.key}
                      x1={item.a.x}
                      y1={item.a.y}
                      x2={item.b.x}
                      y2={item.b.y}
                      stroke={item.key === selectedEdge ? "#8b45f4" : "#8aa0b8"}
                      strokeWidth={(item.key === selectedEdge ? 2.4 : 0.7) / zoom}
                      opacity={0.55}
                    />
                  ))}
                {showCenters &&
                  visible.map((tile) => <circle key={`${tile.id}-c`} cx={tile.center.x} cy={tile.center.y} r={2.2 / zoom} fill="#64748b" />)}
                {showUnit && (
                  <g stroke="#8b45f4" fill="none" strokeWidth={1.4 / zoom}>
                    <polygon
                      points={`${unitOrigin.x},${unitOrigin.y} ${unitOrigin.x + vectors.ax},${unitOrigin.y + vectors.ay} ${unitOrigin.x + vectors.ax + vectors.bx},${unitOrigin.y + vectors.ay + vectors.by} ${unitOrigin.x + vectors.bx},${unitOrigin.y + vectors.by}`}
                      fill="rgba(139,69,244,.12)"
                    />
                    <line x1={unitOrigin.x} y1={unitOrigin.y} x2={unitOrigin.x + vectors.ax} y2={unitOrigin.y + vectors.ay} markerEnd="url(#arr)" />
                    <line x1={unitOrigin.x} y1={unitOrigin.y} x2={unitOrigin.x + vectors.bx} y2={unitOrigin.y + vectors.by} />
                    <text x={unitOrigin.x + vectors.ax / 2} y={unitOrigin.y + vectors.ay / 2 - 6} fill="#8b45f4" fontSize={11 / zoom}>a⃗</text>
                    <text x={unitOrigin.x + vectors.bx / 2} y={unitOrigin.y + vectors.by / 2} fill="#8b45f4" fontSize={11 / zoom}>b⃗</text>
                  </g>
                )}
                {showGens &&
                  visible.map((tile) => (
                    <text key={`${tile.id}-g`} x={tile.center.x} y={tile.center.y + 3} textAnchor="middle" fontSize={9 / zoom} fill="#64748b">
                      {tile.generation}
                    </text>
                  ))}
                {(showAngles || vertex) && (vertex ?? interiorVertex) && (
                  <AngleSectors
                    vertex={(vertex ?? interiorVertex)!}
                    tiles={visible}
                    interior={interior}
                    zoom={zoom}
                  />
                )}
                {vertices
                  .filter((v) => v.tileIds.length >= expectedMeetCount(validKind) - 1)
                  .slice(0, 80)
                  .map((item) => (
                    <circle
                      key={item.key}
                      cx={item.point.x}
                      cy={item.point.y}
                      r={(item.key === selectedVertex ? 5 : 2.4) / zoom}
                      fill={item.key === selectedVertex ? "#147df2" : "transparent"}
                      stroke="#334155"
                      strokeWidth={0.6 / zoom}
                    />
                  ))}
              </g>
            </svg>
          )}
        </div>
        {showGens && (
          <div className="tlab-gens" aria-label="Generations">
            {Array.from({ length: Math.min(12, maxGen + 1) }, (_, g) => (
              <button key={g} type="button" className={hoverGen === g ? "is-on" : ""} onMouseEnter={() => setHoverGen(g)} onMouseLeave={() => setHoverGen(null)}>
                Generation {g}
              </button>
            ))}
          </div>
        )}
      </section>

      <aside className="tlab-col tlab-info">
        <div className="tlab-card">
          <h3>Why does this tessellate?</h3>
          <p className="tlab-formula">
            Interior angle = {fmt(interior, 1)}°
            <br />
            360° ÷ {fmt(interior, 1)}° = {fmt(check.k, 3)}
          </p>
          {check.tessellates ? (
            <>
              <p className="tlab-note">{check.meetingCount} polygons meet exactly.</p>
              <p className="tlab-formula">{check.meetingCount} × {fmt(interior, 0)}° = 360°</p>
              <p className="tlab-ok">Perfect tessellation ✓</p>
            </>
          ) : (
            <>
              <p className="tlab-fail">Does not tessellate alone</p>
              <p className="tlab-note">
                {check.floorCount} × {fmt(interior, 1)}° = {fmt(check.floorCount * interior, 1)}° · gap = {fmt(check.gapDeg, 1)}°
              </p>
            </>
          )}
        </div>
        {selected && (
          <div className="tlab-card">
            <h3>Tile</h3>
            <div className="tlab-live"><i style={{ background: "#147df2" }} /><span>Type</span><strong>{kindLabel(selected.kind)}</strong></div>
            <div className="tlab-live"><i style={{ background: "#08b9dd" }} /><span>Side</span><strong>{fmt(selected.side, 1)}</strong></div>
            <div className="tlab-live"><i style={{ background: "#8b45f4" }} /><span>Interior angle</span><strong>{fmt(regularInteriorAngle(sidesOf(selected.kind, n)), 0)}°</strong></div>
            <div className="tlab-live"><i style={{ background: "#f59e0b" }} /><span>Area</span><strong>{fmt(regularPolygonArea(sidesOf(selected.kind, n), selected.side), 3)}</strong></div>
            <div className="tlab-live"><i style={{ background: "#64748b" }} /><span>Center</span><strong>({fmt(selected.center.x, 1)}, {fmt(selected.center.y, 1)})</strong></div>
          </div>
        )}
        {vertex && (
          <div className="tlab-card">
            <h3>Vertex inspector</h3>
            <p className="tlab-formula">
              {meet} × {fmt(interior, 0)}° = {fmt(meet * interior, 1)}°
            </p>
            <p className={Math.abs(meet * interior - 360) < 0.5 ? "tlab-ok" : "tlab-fail"}>
              {Math.abs(meet * interior - 360) < 0.5 ? "Perfect fit ✓" : `Remainder ${fmt(360 - meet * interior, 1)}°`}
            </p>
          </div>
        )}
        {edge && (
          <div className="tlab-card">
            <h3>Shared edge</h3>
            <p className="tlab-note">{edge.tileIds.length} neighboring tile{edge.tileIds.length === 1 ? "" : "s"}</p>
            <p className="tlab-formula">Shared edge length = {fmt(edge.length, 2)}</p>
            <p className="tlab-ok">No gap · no overlap</p>
          </div>
        )}
        {showUnit && (
          <div className="tlab-card">
            <h3>Lattice vectors</h3>
            <p className="tlab-formula">a⃗ = ({fmt(vectors.ax, 1)}, {fmt(vectors.ay, 1)})</p>
            <p className="tlab-formula">b⃗ = ({fmt(vectors.bx, 1)}, {fmt(vectors.by, 1)})</p>
          </div>
        )}
        <div className="tlab-card tlab-challenge">
          <h3>Challenge {challenge + 1}</h3>
          <p className="tlab-note">{CHALLENGES[challenge]?.prompt}</p>
          <input value={answer} onChange={(e) => { setAnswer(e.target.value); setStatus(""); }} aria-label="Challenge answer" />
          <div className="tlab-btn-row">
            <button type="button" className="tlab-primary" onClick={checkChallenge}>Check</button>
            <button type="button" onClick={() => { setChallenge((c) => (c + 1) % CHALLENGES.length); setAnswer(""); setStatus(""); }}>Next</button>
          </div>
          {status ? <p role="status" className={status === "Correct." ? "tlab-ok" : "tlab-fail"}>{status}</p> : null}
        </div>
      </aside>
    </div>
  );
}

function nearestVertex(pt: { x: number; y: number }, vertices: VertexRecord[], maxDist: number) {
  let best: VertexRecord | null = null;
  let bestD = maxDist;
  for (const v of vertices) {
    const d = dist(pt, v.point);
    if (d < bestD) {
      best = v;
      bestD = d;
    }
  }
  return best;
}

function nearestEdge(pt: { x: number; y: number }, edges: Array<{ key: string; a: { x: number; y: number }; b: { x: number; y: number } }>, maxDist: number) {
  let best: (typeof edges)[number] | null = null;
  let bestD = maxDist;
  for (const edge of edges) {
    const d = dist(pt, nearestPointOnSegment(pt, edge.a, edge.b));
    if (d < bestD) {
      best = edge;
      bestD = d;
    }
  }
  return best;
}

function AngleSectors({
  vertex,
  tiles,
  interior,
  zoom,
}: {
  vertex: VertexRecord;
  tiles: Tile[];
  interior: number;
  zoom: number;
}) {
  const r = 18 / zoom;
  const meeting = tiles.filter((t) => vertex.tileIds.includes(t.id));
  const angles = meeting.map((tile) => {
    const c = tile.center;
    return Math.atan2(c.y - vertex.point.y, c.x - vertex.point.x);
  }).sort((a, b) => a - b);
  const start = (angles[0] ?? 0) * (180 / Math.PI) - interior / 2;
  return (
    <g>
      {meeting.map((_, i) => (
        <path
          key={i}
          d={sectorPath(vertex.point, r, start + i * interior, interior)}
          fill={i % 2 ? "rgba(8,185,221,.22)" : "rgba(20,125,242,.16)"}
          stroke="#147df2"
          strokeWidth={0.6 / zoom}
        />
      ))}
      <text x={vertex.point.x + r + 6 / zoom} y={vertex.point.y} fill="#0f2747" fontSize={11 / zoom} fontWeight={700}>
        {meeting.length} × {fmt(interior, 0)}° = {fmt(meeting.length * interior, 0)}°
      </text>
    </g>
  );
}

function ExperimentView({ n, overlap, onToggleOverlap }: { n: number; overlap: boolean; onToggleOverlap: () => void }) {
  const check = regularTessellationCheck(n);
  const count = overlap ? check.floorCount + 1 : check.floorCount;
  const side = 72;
  const origin = { x: 210, y: 210 };
  const polys = Array.from({ length: count }, (_, i) => regularPolygonAtVertex(n, side, origin, i * check.interior));
  const gapStart = check.floorCount * check.interior;
  return (
    <div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto" }}>
      <svg className="tlab-svg" viewBox="0 0 420 420" role="img" aria-label="Vertex packing experiment">
        <rect width="420" height="420" fill="#f7fbff" />
        {polys.map((verts, i) => (
          <polygon key={i} points={verts.map((p) => `${p.x},${p.y}`).join(" ")} fill={overlap && i === count - 1 ? "rgba(244,63,94,.18)" : "rgba(20,125,242,.12)"} stroke="#147df2" strokeWidth="1.4" />
        ))}
        {!check.tessellates && !overlap && (
          <path d={sectorPath(origin, 88, gapStart, check.gapDeg)} fill="rgba(245,158,11,.35)" stroke="#d97706" />
        )}
        <circle cx={origin.x} cy={origin.y} r="4" fill="#147df2" />
        {!check.tessellates && !overlap && (
          <text x="210" y="28" textAnchor="middle" fontSize="13" fill="#b45309" fontWeight={800}>
            Gap = {fmt(check.gapDeg, 1)}°
          </text>
        )}
        {overlap && !check.tessellates && (
          <text x="210" y="28" textAnchor="middle" fontSize="13" fill="#b45309" fontWeight={800}>
            Overlap = {fmt(check.overlapDeg, 1)}°
          </text>
        )}
        {check.tessellates && (
          <text x="210" y="28" textAnchor="middle" fontSize="13" fill="#07893d" fontWeight={800}>
            {check.meetingCount} × {fmt(check.interior, 0)}° = 360°
          </text>
        )}
      </svg>
      <div className="tlab-btn-row" style={{ padding: 8 }}>
        <button type="button" className={!overlap ? "is-on" : ""} onClick={onToggleOverlap}>{overlap ? "Show gap" : "Show overlap"}</button>
        <span className="tlab-note">{check.tessellates ? "This n tiles the plane." : "Not a regular monohedral tessellation."}</span>
      </div>
    </div>
  );
}

function ComparePanels({ size, n }: { size: number; n: number }) {
  return (
    <div className="tlab-compare">
      <NeighborhoodPane kind="triangle" size={size} title="Triangle" formula="6 × 60° = 360°" />
      <NeighborhoodPane kind="square" size={size} title="Square" formula="4 × 90° = 360°" />
      <NeighborhoodPane kind="hexagon" size={size} title="Hexagon" formula="3 × 120° = 360°" />
      <div className="tlab-compare-pane">
        <b>Pentagon n={n >= 5 ? 5 : n}</b>
        <ExperimentView n={5} overlap={false} onToggleOverlap={() => undefined} />
        <small>3 × 108° = 324° · gap 36°</small>
      </div>
    </div>
  );
}

function NeighborhoodPane({ kind, size, title, formula }: { kind: TileKind; size: number; title: string; formula: string }) {
  const s = kind === "hexagon" ? Math.max(22, size * 0.7) : Math.max(28, size * 0.7);
  const tiles = useMemo(() => {
    const raw = generateKind(kind, { minX: -s * 4, minY: -s * 4, maxX: s * 4, maxY: s * 4 }, s);
    return assignGenerations(raw, kind, "expand").filter((t) => t.generation <= 1);
  }, [kind, s]);
  const verts = indexVertices(tiles, s);
  const v = verts.find((item) => item.tileIds.length === expectedMeetCount(kind)) ?? verts[0];
  const interior = regularInteriorAngle(sidesOf(kind, 3));
  return (
    <div className="tlab-compare-pane">
      <b>{title}</b>
      <svg viewBox="-90 -90 180 180" aria-label={title}>
        {tiles.map((tile) => (
          <polygon
            key={tile.id}
            points={inflateVertices(tile.vertices, 0.4).map((p) => `${p.x},${p.y}`).join(" ")}
            fill={fillFor(tile, "alternating", v ? !v.tileIds.includes(tile.id) : false)}
            stroke="#8aa0b8"
            strokeWidth="0.8"
          />
        ))}
        {v && <AngleSectors vertex={v} tiles={tiles} interior={interior} zoom={1} />}
      </svg>
      <small>{formula}</small>
    </div>
  );
}
