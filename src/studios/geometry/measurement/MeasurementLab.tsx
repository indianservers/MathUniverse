import {
  Ruler,
  Triangle,
  Square,
  CircleDashed,
  Scaling,
  AlertTriangle,
  MousePointer2,
  Pencil,
  Home,
  Type,
  Grid3X3,
  Magnet,
  Spline,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MockupLearningStrip } from "../../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import {
  convertAreaFromCm2,
  convertFromCm,
  defaultRects,
  fmt,
  handlesFor,
  hitRect,
  relativeError,
  resizeRect,
  scaleRects,
  unionArea,
  unionPerimeter,
  areaUncertainty,
  rectArea,
  rectPerimeter,
  type AaRect,
  type Handle,
  type UnitId,
} from "./measurementMath";
import {
  MEASURE_MODES,
  MEASURE_PANELS,
  useMeasurementWorkspace,
  type MeasureModeId,
} from "./measurementMode";
import "./MeasurementLab.css";

const PX = 26;
const PAD = 56;
const VIEW = { w: 700, h: 560 };
const MODE_ICON: Record<MeasureModeId, ReactNode> = {
  length: <Ruler size={15} />,
  angle: <Triangle size={15} />,
  area: <Square size={15} />,
  perimeter: <CircleDashed size={15} />,
  scale: <Scaling size={15} />,
  error: <AlertTriangle size={15} />,
};

function toPx(n: number) {
  return PAD + n * PX;
}

function worldFromSvg(x: number, y: number) {
  return { x: (x - PAD) / PX, y: (y - PAD) / PX };
}

function cornerTick(x: number, y: number, dx: 1 | -1, dy: 1 | -1, color: string) {
  const px = toPx(x);
  const py = toPx(y);
  const s = 9;
  return <path d={`M ${px + dx * s} ${py} H ${px} V ${py + dy * s}`} fill="none" stroke={color} strokeWidth="1.6" />;
}

export default function MeasurementLab({ page }: { page: StudioMockupPage }) {
  const { mode, panel, setMode, setPanel } = useMeasurementWorkspace();
  const [rects, setRects] = useState<AaRect[]>(defaultRects);
  const [selected, setSelected] = useState("r1");
  const [unit, setUnit] = useState<UnitId>("cm");
  const [precision, setPrecision] = useState(0.01);
  const [snap, setSnap] = useState<"grid" | "point" | "off">("grid");
  const [rulers, setRulers] = useState(true);
  const [showDecomp, setShowDecomp] = useState(true);
  const [showDims, setShowDims] = useState(true);
  const [showProtractor, setShowProtractor] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showConstruction, setShowConstruction] = useState(false);
  const [decompose, setDecompose] = useState<"auto" | "manual">("auto");
  const [scaleK, setScaleK] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<"select" | "measure" | "shape" | "text">("select");
  const [headerHost, setHeaderHost] = useState<HTMLElement | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [convKind, setConvKind] = useState<"area" | "length">("area");
  const drag = useRef<Handle | { type: "move"; rectId: string; x0: number; y0: number; rx: number; ry: number } | null>(null);

  useEffect(() => { setHeaderHost(document.getElementById("msk-lab-tools")); }, []);

  const display = useMemo(() => scaleRects(rects, scaleK), [rects, scaleK]);
  const areaCm = unionArea(display);
  const periCm = unionPerimeter(display);
  const parts = display.map((r) => ({ ...r, area: rectArea(r), peri: rectPerimeter(r) }));
  const area = convertAreaFromCm2(areaCm, unit);
  const peri = convertFromCm(periCm, unit);
  const absErr = convertFromCm(areaUncertainty(areaCm, periCm, precision), unit);
  const rel = relativeError(area, convertAreaFromCm2(areaUncertainty(areaCm, periCm, precision), unit));
  const snapStep = snap === "grid" ? 0.2 : 0;
  const selectedRect = display.find((r) => r.id === selected) ?? display[0];

  const onDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = pt.matrixTransform(ctm.inverse());
    const { x, y } = worldFromSvg(p.x, p.y);
    const handle = handlesFor(display).find((h) => Math.hypot(h.x - x, h.y - y) < 0.28);
    if (handle && tool !== "text") {
      drag.current = handle;
      setSelected(handle.rectId);
      svg.setPointerCapture(event.pointerId);
      return;
    }
    const hit = hitRect(display, x, y);
    setSelected(hit?.id ?? "");
    if (hit && (tool === "select" || tool === "measure")) {
      drag.current = { type: "move", rectId: hit.id, x0: x, y0: y, rx: hit.x, ry: hit.y };
      svg.setPointerCapture(event.pointerId);
    }
  };

  const onMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = pt.matrixTransform(ctm.inverse());
    const { x, y } = worldFromSvg(p.x, p.y);
    const handle = handlesFor(display).find((h) => Math.hypot(h.x - x, h.y - y) < 0.28);
    setHoverId(handle?.rectId ?? hitRect(display, x, y)?.id ?? null);
    if (!drag.current) return;
    const k = scaleK || 1;
    const origin = { x: 2, y: 1.8 };
    const session = drag.current;
    setRects((prev) => prev.map((r) => {
      if (r.id !== session.rectId) return r;
      if ("type" in session && session.type === "move") {
        const nx = session.rx + (x - session.x0) / k;
        const ny = session.ry + (y - session.y0) / k;
        const sx = snapStep > 0 ? Math.round(nx / snapStep) * snapStep : nx;
        const sy = snapStep > 0 ? Math.round(ny / snapStep) * snapStep : ny;
        return { ...r, x: sx, y: sy };
      }
      if (!("corner" in session)) return r;
      return resizeRect(r, session.corner, origin.x + (x - origin.x) / k, origin.y + (y - origin.y) / k, snapStep);
    }));
  };

  const header = (
    <>
      <label className="mlab-head-field">
        <span className="sr-only">Unit</span>
        <select aria-label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as UnitId)}>
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="m">m</option>
          <option value="in">in</option>
        </select>
      </label>
      <label className="mlab-head-field">
        <span className="sr-only">Precision</span>
        <select aria-label="Precision" value={String(precision)} onChange={(e) => setPrecision(Number(e.target.value))}>
          <option value="0.1">Precision: 0.1</option>
          <option value="0.01">Precision: 0.01</option>
          <option value="0.001">Precision: 0.001</option>
        </select>
      </label>
    </>
  );

  const dim = (value: number, x1: number, y1: number, x2: number, y2: number, side: "top" | "bottom" | "left" | "right", gap = 18, labelAt?: { x: number; y: number }) => {
    const ax = toPx(x1);
    const ay = toPx(y1);
    const bx = toPx(x2);
    const by = toPx(y2);
    const ox = side === "left" ? -gap : side === "right" ? gap : 0;
    const oy = side === "top" ? -gap : side === "bottom" ? gap : 0;
    const mx = labelAt ? toPx(labelAt.x) : (ax + bx) / 2 + ox + (side === "left" ? -16 : side === "right" ? 16 : 0);
    const my = labelAt ? toPx(labelAt.y) : (ay + by) / 2 + oy + (side === "top" ? -2 : side === "bottom" ? 12 : 4);
    return (
      <g className="mlab-dim">
        <line x1={ax} y1={ay} x2={ax + ox} y2={ay + oy} />
        <line x1={bx} y1={by} x2={bx + ox} y2={by + oy} />
        <line x1={ax + ox} y1={ay + oy} x2={bx + ox} y2={by + oy} />
        <circle cx={ax + ox} cy={ay + oy} r="2.2" fill="#f59e0b" />
        <circle cx={bx + ox} cy={by + oy} r="2.2" fill="#f59e0b" />
        <text x={mx} y={my} textAnchor="middle" paintOrder="stroke" stroke="#fff" strokeWidth="3">{fmt(convertFromCm(value, unit), precision)} {unit}</text>
      </g>
    );
  };

  const protractor = (cx: number, cy: number, r: number) => {
    const ticks = Array.from({ length: 19 }, (_, i) => {
      const deg = i * 10;
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 30 === 0 ? r - 16 : r - 9;
      const x1 = cx + r * Math.cos(Math.PI - rad);
      const y1 = cy - r * Math.sin(rad);
      const x2 = cx + inner * Math.cos(Math.PI - rad);
      const y2 = cy - inner * Math.sin(rad);
      const lx = cx + (r - 26) * Math.cos(Math.PI - rad);
      const ly = cy - (r - 26) * Math.sin(rad);
      return (
        <g key={deg}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth={deg % 30 === 0 ? 1.4 : 0.8} />
          {deg % 30 === 0 ? <text x={lx} y={ly + 3} textAnchor="middle" fontSize="8" fill="#64748b">{deg}</text> : null}
        </g>
      );
    });
    const ray = (135 * Math.PI) / 180;
    return (
      <g className="mlab-protractor">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} L ${cx - r} ${cy} Z`} fill="#fff" fillOpacity="0.92" stroke="#94a3b8" />
        {ticks}
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#94a3b8" />
        <line x1={cx} y1={cy} x2={cx + (r - 8) * Math.cos(Math.PI - ray)} y2={cy - (r - 8) * Math.sin(ray)} stroke="#f59e0b" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="3" fill="#f59e0b" />
        <text x={cx + 18} y={cy - 22} fill="#f59e0b" fontSize="11" fontWeight="800">135.00°</text>
      </g>
    );
  };

  const r1 = display[0]!;
  const r2 = display[1]!;
  const r3 = display[2]!;
  const r4 = display[3]!;

  return (
    <div className="mlab">
      {headerHost ? createPortal(header, headerHost) : <div className="mlab-inline-head">{header}</div>}
      <nav className="mlab-modes" aria-label="Measurement modes">
        {MEASURE_MODES.map((item) => (
          <button key={item.id} type="button" className={mode === item.id ? "is-on" : ""} onClick={() => setMode(item.id)}>
            {MODE_ICON[item.id]}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mlab-workspace">
        <aside className="mlab-card" aria-label="Measurement controls">
          <h2>Measurement controls</h2>
          <p className="mlab-kicker">Select</p>
          <div className="mlab-icon-row">
            <button type="button" className={tool === "select" ? "is-on" : ""} aria-label="Select" onClick={() => setTool("select")}><MousePointer2 size={16} /></button>
            <button type="button" className={tool === "measure" ? "is-on" : ""} aria-label="Measure" onClick={() => setTool("measure")}><Pencil size={16} /></button>
            <button type="button" className={tool === "shape" ? "is-on" : ""} aria-label="Shape" onClick={() => setTool("shape")}><Home size={16} /></button>
            <button type="button" className={tool === "text" ? "is-on" : ""} aria-label="Label" onClick={() => setTool("text")}><Type size={16} /></button>
          </div>
          <p className="mlab-kicker">Snap</p>
          <div className="mlab-icon-row">
            <button type="button" className={snap === "grid" ? "is-on" : ""} aria-label="Snap to grid" onClick={() => setSnap("grid")}><Grid3X3 size={16} /></button>
            <button type="button" className={snap === "point" ? "is-on" : ""} aria-label="Snap to point" onClick={() => setSnap("point")}><Magnet size={16} /></button>
            <button type="button" className={snap === "off" ? "is-on" : ""} aria-label="No snap" onClick={() => setSnap("off")}><Spline size={16} /></button>
          </div>
          <label className="mlab-toggle">
            <span>Show rulers</span>
            <input type="checkbox" checked={rulers} onChange={(e) => setRulers(e.target.checked)} />
          </label>
          <p className="mlab-kicker">Display</p>
          <label className="mlab-check"><input type="checkbox" checked={showDecomp} onChange={(e) => setShowDecomp(e.target.checked)} /> Decomposition</label>
          <label className="mlab-check"><input type="checkbox" checked={showDims} onChange={(e) => setShowDims(e.target.checked)} /> Dimensions</label>
          <label className="mlab-check"><input type="checkbox" checked={showProtractor} onChange={(e) => setShowProtractor(e.target.checked)} /> Protractor</label>
          <label className="mlab-check"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Grid</label>
          <label className="mlab-check"><input type="checkbox" checked={showConstruction} onChange={(e) => setShowConstruction(e.target.checked)} /> Construction</label>
          <p className="mlab-kicker">Decompose shape</p>
          <div className="mlab-seg">
            <button type="button" className={decompose === "auto" ? "is-on" : ""} onClick={() => setDecompose("auto")}>Auto</button>
            <button type="button" className={decompose === "manual" ? "is-on" : ""} onClick={() => setDecompose("manual")}>Manual</button>
          </div>
          {mode === "scale" ? (
            <label className="mlab-scale">
              Scale k = {fmt(scaleK, 0.01)}
              <input type="range" min={0.5} max={1.8} step={0.01} value={scaleK} onChange={(e) => setScaleK(Number(e.target.value))} />
            </label>
          ) : null}
          <button type="button" className="mlab-primary" onClick={() => {
            const step = snap === "grid" ? 0.2 : snap === "point" ? 0.1 : 0.01;
            setRects((prev) => prev.map((r) => {
              const snapN = (n: number) => Math.round(n / step) * step;
              return { ...r, x: snapN(r.x), y: snapN(r.y), w: Math.max(0.4, snapN(r.w)), h: Math.max(0.4, snapN(r.h)) };
            }));
          }}>Recalculate</button>
          <button type="button" className="mlab-ghost" onClick={() => { setRects(defaultRects()); setScaleK(1); setSelected("r1"); }}><Trash2 size={14} /> Clear All</button>
        </aside>

        <section className="mlab-stage">
          <svg
            className="mlab-svg"
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            role="img"
            aria-label="Composite shape measurement canvas"
            style={{ transform: `scale(${zoom})` }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={() => { drag.current = null; }}
          >
            <rect width={VIEW.w} height={VIEW.h} fill="#f7fbff" />
            {showGrid ? Array.from({ length: 22 }, (_, i) => (
              <g key={i} stroke="#e6eef6">
                <line x1={toPx(i)} y1={toPx(0)} x2={toPx(i)} y2={toPx(16)} />
                <line x1={toPx(0)} y1={toPx(i)} x2={toPx(20)} y2={toPx(i)} />
              </g>
            )) : null}
            {rulers ? (
              <g className="mlab-ruler">
                {Array.from({ length: 21 }, (_, i) => (
                  <g key={`x${i}`}>
                    <line x1={toPx(i)} y1={PAD - 8} x2={toPx(i)} y2={PAD - (i % 2 === 0 ? 16 : 11)} stroke="#cbd5e1" />
                    <text x={toPx(i)} y={PAD - 20} textAnchor="middle">{i}</text>
                  </g>
                ))}
                {Array.from({ length: 17 }, (_, i) => (
                  <g key={`y${i}`}>
                    <line x1={PAD - 8} y1={toPx(i)} x2={PAD - (i % 2 === 0 ? 16 : 11)} y2={toPx(i)} stroke="#cbd5e1" />
                    <text x={PAD - 22} y={toPx(i) + 3} textAnchor="end">{i}</text>
                  </g>
                ))}
                <text x={toPx(20) + 14} y={PAD - 20}>{unit}</text>
                <text x="16" y={toPx(8)} transform={`rotate(-90 16 ${toPx(8)})`}>{unit}</text>
              </g>
            ) : null}
            {display.map((r) => (
              <g key={r.id} opacity={selected && selected !== r.id && mode === "area" ? 0.72 : 1}>
                <rect
                  x={toPx(r.x)}
                  y={toPx(r.y)}
                  width={r.w * PX}
                  height={r.h * PX}
                  fill={mode === "perimeter" ? `${r.fill}55` : r.fill}
                  stroke={selected === r.id || hoverId === r.id ? "#147df2" : r.stroke}
                  strokeWidth={mode === "perimeter" ? 3 : 2}
                />
                {cornerTick(r.x, r.y, 1, 1, r.stroke)}
                {cornerTick(r.x + r.w, r.y, -1, 1, r.stroke)}
                {cornerTick(r.x, r.y + r.h, 1, -1, r.stroke)}
                {cornerTick(r.x + r.w, r.y + r.h, -1, -1, r.stroke)}
                {showDecomp || showConstruction ? (
                  <g>
                    <circle cx={toPx(r.x + r.w / 2)} cy={toPx(r.y + r.h / 2)} r="12" fill="#fff" stroke={r.stroke} />
                    <text x={toPx(r.x + r.w / 2)} y={toPx(r.y + r.h / 2) + 4} textAnchor="middle" fontSize="11" fontWeight="800">{r.label}</text>
                  </g>
                ) : null}
              </g>
            ))}
            {showDims && (mode === "length" || mode === "scale" || mode === "error") ? (
              <g>
                {dim(r1.w + r2.w, r1.x, r1.y, r2.x + r2.w, r1.y, "top", 20)}
                {dim(r1.h, r1.x, r1.y, r1.x, r1.y + r1.h, "left", 22)}
                {dim(r2.h, r2.x + r2.w, r2.y, r2.x + r2.w, r2.y + r2.h, "right", 22)}
                {dim(r4.h, r4.x + r4.w, r4.y, r4.x + r4.w, r4.y + r4.h, "right", 22)}
                {dim(r3.w, r3.x, r3.y + r3.h, r3.x + r3.w, r3.y + r3.h, "bottom", 16)}
                {dim(r4.x + r4.w - r3.x, r3.x, r4.y + r4.h, r4.x + r4.w, r4.y + r4.h, "bottom", 36)}
                {dim(r1.w, r1.x, r1.y + r1.h, r1.x + r1.w, r1.y + r1.h, "bottom", 12, { x: r1.x + r1.w - 0.2, y: r1.y + r1.h + 0.7 })}
                {dim(r1.y + r1.h - (r2.y + r2.h), r1.x + r1.w, r2.y + r2.h, r1.x + r1.w, r1.y + r1.h, "left", 14)}
              </g>
            ) : null}
            {showProtractor ? protractor(toPx(r3.x) + 8, toPx(r3.y + r3.h) + 6, 72) : null}
            {handlesFor(display).map((h) => (
              <circle key={h.id} className="mlab-handle" cx={toPx(h.x)} cy={toPx(h.y)} r="5" fill="#f59e0b" stroke="#fff" />
            ))}
          </svg>
          <div className="mlab-zoom">
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}><ZoomIn size={16} /></button>
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}><ZoomOut size={16} /></button>
            <button type="button" aria-label="Fit view" onClick={() => setZoom(1)}><Maximize2 size={16} /></button>
          </div>
        </section>

        <aside className="mlab-card mlab-inspector">
          <div className="mlab-panels" role="tablist" aria-label="Measurement inspector">
            {MEASURE_PANELS.map((item) => (
              <button key={item.id} type="button" role="tab" aria-selected={panel === item.id} className={panel === item.id ? "is-on" : ""} onClick={() => setPanel(item.id)}>
                {item.label}
              </button>
            ))}
          </div>

          {panel === "objects" ? (
            <div>
              <h2>Live object tree</h2>
              <ul className="mlab-tree">
                <li>
                  Composite shape
                  <ul>
                    {display.map((r) => (
                      <li key={r.id}>
                        <button type="button" className={selected === r.id ? "is-on" : ""} onClick={() => setSelected(r.id)}>
                          Rectangle {r.label}
                        </button>
                      </li>
                    ))}
                    <li>Outer boundary</li>
                    <li>Dimension set</li>
                  </ul>
                </li>
              </ul>
              {selectedRect ? <p className="mlab-note">Selected rectangle {selectedRect.label}: {fmt(convertFromCm(selectedRect.w, unit), precision)} × {fmt(convertFromCm(selectedRect.h, unit), precision)} {unit}.</p> : null}
            </div>
          ) : null}

          {panel === "measurements" ? (
            <div>
              <h2>Composite shape summary</h2>
              <div className="mlab-summary">
                <span>Total Area</span><strong>{fmt(area, precision)} {unit}²</strong>
                <span>Total Perimeter</span><strong>{fmt(peri, precision)} {unit}</strong>
                <span>Total Edge Length</span><strong>{fmt(peri, precision)} {unit}</strong>
              </div>
              <h2>Decomposition ({parts.length} parts)</h2>
              <table className="mlab-table">
                <thead><tr><th>#</th><th>Shape</th><th>Area ({unit}²)</th><th>Perimeter ({unit})</th></tr></thead>
                <tbody>
                  {parts.map((r) => (
                    <tr key={r.id} className={selected === r.id ? "is-on" : ""} onClick={() => setSelected(r.id)}>
                      <td><i style={{ background: r.stroke }} />{r.label}</td>
                      <td>Rectangle</td>
                      <td>{fmt(convertAreaFromCm2(r.area, unit), precision)}</td>
                      <td>{fmt(convertFromCm(r.peri, unit), precision)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2>Unit conversions</h2>
              <label className="mlab-kicker">
                <select aria-label="Conversion quantity" value={convKind} onChange={(e) => setConvKind(e.target.value as "area" | "length")}>
                  <option value="area">Area</option>
                  <option value="length">Length</option>
                </select>
              </label>
              {convKind === "area" ? (
                <>
                  <p className="mlab-conv">{fmt(area, precision)} {unit}² &nbsp;≡&nbsp; {fmt(convertAreaFromCm2(areaCm, "m"), 0.000001)} m²</p>
                  <p className="mlab-conv">{fmt(convertAreaFromCm2(areaCm, "mm"), 0.01)} mm² &nbsp;≡&nbsp; {fmt(convertAreaFromCm2(areaCm, "m") * 100, 0.01)} dm²</p>
                </>
              ) : (
                <>
                  <p className="mlab-conv">{fmt(peri, precision)} {unit} &nbsp;≡&nbsp; {fmt(convertFromCm(periCm, "m"), 0.000001)} m</p>
                  <p className="mlab-conv">{fmt(convertFromCm(periCm, "mm"), 0.01)} mm &nbsp;≡&nbsp; {fmt(convertFromCm(periCm, "m") * 10, 0.01)} dm</p>
                </>
              )}
              <h2>Uncertainty & error</h2>
              <div className="mlab-summary is-error">
                <span>Instrument Precision</span><strong>± {fmt(precision, precision)} {unit}</strong>
                <span>Area Uncertainty</span><strong>± {fmt(absErr, precision)} {unit}²</strong>
                <span>Perimeter Uncertainty</span><strong>± {fmt(convertFromCm(8 * precision, unit), precision)} {unit}</strong>
                <span>Relative Error</span><strong>{fmt(rel, 0.01)} %</strong>
              </div>
            </div>
          ) : null}

          {panel === "dependencies" ? (
            <div>
              <h2>Dependencies</h2>
              <p className="mlab-note">The composite region is the disjoint union of four rectangles. Outer perimeter depends on exposed edges only — shared internal edges cancel.</p>
              <svg viewBox="0 0 280 160" className="mlab-graph" aria-label="Measurement dependency graph">
                {["R1", "R2", "R3", "R4"].map((label, i) => (
                  <g key={label}>
                    <rect x={12 + (i % 2) * 80} y={12 + Math.floor(i / 2) * 54} width="64" height="32" rx="8" fill="#e8f7ff" stroke="#7dd3ea" />
                    <text x={44 + (i % 2) * 80} y={32 + Math.floor(i / 2) * 54} textAnchor="middle" fontSize="11">{label}</text>
                  </g>
                ))}
                <rect x="176" y="40" width="90" height="70" rx="10" fill="#efe4ff" stroke="#c4b5fd" />
                <text x="221" y="70" textAnchor="middle" fontSize="11">Composite</text>
                <text x="221" y="88" textAnchor="middle" fontSize="10">area + peri</text>
                <line x1="76" y1="28" x2="176" y2="60" stroke="#94a3b8" />
                <line x1="156" y1="28" x2="176" y2="60" stroke="#94a3b8" />
                <line x1="76" y1="82" x2="176" y2="90" stroke="#94a3b8" />
                <line x1="156" y1="82" x2="176" y2="90" stroke="#94a3b8" />
              </svg>
            </div>
          ) : null}

          {panel === "proof" ? (
            <div>
              <h2>Proof explanation</h2>
              <p className="mlab-goal"><b>Goal</b> Area(composite) = Σ Area(rectangles)</p>
              <p className="mlab-note"><b>Given / construction.</b> The figure is partitioned into four axis-aligned rectangles with disjoint interiors.</p>
              <p className="mlab-note"><b>Known property.</b> Area is finitely additive on non-overlapping regions: if A ∩ B has area 0, then Area(A ∪ B) = Area(A) + Area(B).</p>
              <p className="mlab-note"><b>Reasoning.</b> {fmt(area, precision)} {unit}² = {parts.map((r) => fmt(convertAreaFromCm2(r.area, unit), precision)).join(" + ")}.</p>
              <p className="mlab-ok">✓ Proven for this decomposition. Perimeter is not the sum of part perimeters, because internal edges are not on the outer boundary.</p>
              <ol className="mlab-steps">
                <li>Partition the composite into four rectangles.</li>
                <li>Compute each rectangle as width × height.</li>
                <li>Add the four areas.</li>
                <li>Outer perimeter keeps only uncovered edges.</li>
              </ol>
            </div>
          ) : null}
        </aside>
      </div>
      <MockupLearningStrip page={page} />
    </div>
  );
}
