import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

export type VisualState = {
  values: PhaseTwoValues;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

export type Point = { x: number; y: number };
type GridSpec = { ox: number; oy: number; unit: number; min: number; max: number };

export const grid: GridSpec = { ox: 360, oy: 270, unit: 28, min: -8, max: 8 };
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const clampGrid = (value: number) => Math.max(grid.min, Math.min(grid.max, Math.round(value)));
export const svgPoint = (p: Point) => ({ x: grid.ox + p.x * grid.unit, y: grid.oy - p.y * grid.unit });
export const mathPoint = (p: Point) => ({ x: clampGrid((p.x - grid.ox) / grid.unit), y: clampGrid((grid.oy - p.y) / grid.unit) });
export const distance = (p: Point, q: Point) => Math.hypot(q.x - p.x, q.y - p.y);
const midpoint = (p: Point, q: Point) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
const slope = (p: Point, q: Point) => (q.x === p.x ? undefined : (q.y - p.y) / (q.x - p.x));

export function formatCoordinate(p: Point) {
  return `(${round(p.x)}, ${round(p.y)})`;
}

export function DistanceFormulaVisual(props: VisualState) {
  return <PointPairModel {...props} mode="distance" />;
}

export function MidpointFormulaVisual(props: VisualState) {
  return <PointPairModel {...props} mode="midpoint" />;
}

export function SlopeFormulaVisual(props: VisualState) {
  return <PointPairModel {...props} mode="slope" />;
}

export function SlopeInterceptLineVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const m = values.m;
  const c = values.c;
  const sampleX = values.x;
  const sample = { x: sampleX, y: m * sampleX + c };
  return (
    <Frame label="Slope intercept line equation">
      <CoordinateGrid />
      <Line m={m} c={c} token="m" active={activeHighlight} onHighlight={onHighlight} />
      <SlopeTriangle origin={{ x: 1, y: m + c }} m={m} token="m" active={activeHighlight} onHighlight={onHighlight} />
      <PointMark p={{ x: 0, y: c }} label="c" token="c" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <PointMark p={sample} label="(x,y)" token="point" active={activeHighlight} onHighlight={onHighlight} fill="#fde68a" />
      <Info lines={[`m = ${round(m)}`, `c = ${round(c)}`, `x = ${round(sampleX)}`, `y = ${round(sample.y)}`, `point ${formatCoordinate(sample)}`]} />
      <DraggablePoint p={{ x: 0, y: c }} label="Drag c" onChange={(next) => onValueChange("c", next.y)} />
      <DraggablePoint p={{ x: 2, y: 2 * m + c }} label="Drag m" onChange={(next) => onValueChange("m", round((next.y - c) / Math.max(1, next.x), 2))} />
    </Frame>
  );
}

export function ParallelLinesSlopeVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const m1 = values.m1;
  const m2 = values.m2;
  const c1 = values.c1;
  const c2 = values.c2;
  return (
    <Frame label="Parallel lines have equal slopes">
      <CoordinateGrid />
      <Line m={m1} c={c1} token="m1" active={activeHighlight} onHighlight={onHighlight} color="#22d3ee" />
      <Line m={m2} c={c2} token="m2" active={activeHighlight} onHighlight={onHighlight} color="#f97316" />
      <SlopeTriangle origin={{ x: -5, y: m1 * -5 + c1 }} m={m1} token="m1" active={activeHighlight} onHighlight={onHighlight} />
      <SlopeTriangle origin={{ x: 1, y: m2 + c2 }} m={m2} token="m2" active={activeHighlight} onHighlight={onHighlight} />
      <Info lines={[`m1 = ${round(m1)}`, `m2 = ${round(m2)}`, `c1 = ${round(c1)}`, `c2 = ${round(c2)}`, `m1 - m2 = ${round(m1 - m2)}`, Math.abs(m1 - m2) < 0.01 ? "parallel: yes" : "parallel: not yet"]} />
      <DraggablePoint p={{ x: 0, y: c1 }} label="Drag c1" onChange={(next) => onValueChange("c1", next.y)} />
      <DraggablePoint p={{ x: 0, y: c2 }} label="Drag c2" onChange={(next) => onValueChange("c2", next.y)} />
      <DraggablePoint p={{ x: 3, y: 3 * m1 + c1 }} label="Drag m1" onChange={(next) => onValueChange("m1", round((next.y - c1) / 3, 2))} />
    </Frame>
  );
}

export function PerpendicularLinesSlopeVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const m1 = values.m1;
  const m2 = values.m2;
  const c = values.c;
  const angle = angleBetweenSlopes(m1, m2);
  return (
    <Frame label="Perpendicular slopes">
      <CoordinateGrid />
      <Line m={m1} c={c} token="m1" active={activeHighlight} onHighlight={onHighlight} color="#22d3ee" />
      <Line m={m2} c={c} token="m2" active={activeHighlight} onHighlight={onHighlight} color="#f97316" />
      <RightAngle active={Math.abs(m1 * m2 + 1) < 0.05 || activeHighlight === "-1"} />
      <SlopeTriangle origin={{ x: -5, y: m1 * -5 + c }} m={m1} token="m1" active={activeHighlight} onHighlight={onHighlight} />
      <SlopeTriangle origin={{ x: 1, y: m2 + c }} m={m2} token="m2" active={activeHighlight} onHighlight={onHighlight} />
      <Info lines={[`m1 = ${round(m1)}`, `m2 = ${round(m2)}`, `m1*m2 = ${round(m1 * m2)}`, `angle = ${round(angle, 1)} deg`, Math.abs(m1 * m2 + 1) < 0.05 ? "perpendicular: yes" : "perpendicular: adjust m2"]} />
      <DraggablePoint p={{ x: 3, y: 3 * m1 + c }} label="Drag m1" onChange={(next) => onValueChange("m1", round((next.y - c) / 3, 2))} />
      <DraggablePoint p={{ x: 3, y: 3 * m2 + c }} label="Drag m2" onChange={(next) => onValueChange("m2", round((next.y - c) / 3, 2))} />
    </Frame>
  );
}

export function CircleEquationVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const center = { x: values.h, y: values.k };
  const r = values.r;
  const angle = values.angle;
  const point = { x: center.x + r * Math.cos((angle * Math.PI) / 180), y: center.y + r * Math.sin((angle * Math.PI) / 180) };
  const cSvg = svgPoint(center);
  const pSvg = svgPoint(point);
  return (
    <Frame label="Equation of a circle">
      <CoordinateGrid />
      <circle cx={cSvg.x} cy={cSvg.y} r={r * grid.unit} fill="#2563eb" opacity="0.14" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={cSvg.x} y1={cSvg.y} x2={pSvg.x} y2={pSvg.y} stroke={strokeFor("r2", activeHighlight, "#fde68a")} strokeWidth={widthFor("r2", activeHighlight)} />
      <line x1={cSvg.x} y1={cSvg.y} x2={pSvg.x} y2={cSvg.y} stroke={strokeFor("x-h", activeHighlight, "#22d3ee")} strokeWidth={widthFor("x-h", activeHighlight)} />
      <line x1={pSvg.x} y1={cSvg.y} x2={pSvg.x} y2={pSvg.y} stroke={strokeFor("y-k", activeHighlight, "#f97316")} strokeWidth={widthFor("y-k", activeHighlight)} />
      <PointMark p={center} label="C" token="center" active={activeHighlight} onHighlight={onHighlight} fill="#a855f7" />
      <PointMark p={point} label="P" token="point" active={activeHighlight} onHighlight={onHighlight} fill="#fde68a" />
      <Info lines={[`center ${formatCoordinate(center)}`, `P ${formatCoordinate(point)}`, `r = ${round(r)}`, `x-h = ${round(point.x - center.x)}`, `y-k = ${round(point.y - center.y)}`, `LHS = ${round((point.x - center.x) ** 2 + (point.y - center.y) ** 2)}`, `r^2 = ${round(r * r)}`]} />
      <DraggablePoint p={center} label="Drag center" onChange={(next) => { onValueChange("h", next.x); onValueChange("k", next.y); }} />
      <DraggableHandle label="Drag P" position={pSvg} axis="xy" bounds={{ x: [grid.ox - 8 * grid.unit, grid.ox + 8 * grid.unit], y: [grid.oy - 8 * grid.unit, grid.oy + 8 * grid.unit] }} keyboardStep={grid.unit} onChange={(next) => onValueChange("angle", round((Math.atan2(cSvg.y - next.y, next.x - cSvg.x) * 180) / Math.PI, 1))} />
    </Frame>
  );
}

export function TranslationOfPointsVisual({ values, activeHighlight, onValueChange }: VisualState) {
  const p = { x: values.x, y: values.y };
  const vector = { x: values.a, y: values.b };
  const image = { x: p.x + vector.x, y: p.y + vector.y };
  const pSvg = svgPoint(p);
  const imageSvg = svgPoint(image);
  const vectorEnd = svgPoint({ x: p.x + vector.x, y: p.y + vector.y });
  return (
    <Frame label="Translation of points">
      <CoordinateGrid />
      <line x1={pSvg.x} y1={pSvg.y} x2={vectorEnd.x} y2={vectorEnd.y} stroke={strokeFor("vector", activeHighlight, "#fde68a")} strokeWidth={widthFor("vector", activeHighlight)} markerEnd="url(#arrow)" />
      <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fde68a" /></marker></defs>
      <circle cx={pSvg.x} cy={pSvg.y} r="16" fill="#22d3ee" opacity="0.65" />
      <circle cx={imageSvg.x} cy={imageSvg.y} r="16" fill="#f97316" opacity="0.9" />
      <text x={pSvg.x + 16} y={pSvg.y - 12} fill="#f8fafc" fontSize="13" fontWeight="900">P</text>
      <text x={imageSvg.x + 16} y={imageSvg.y - 12} fill="#f8fafc" fontSize="13" fontWeight="900">P'</text>
      <Info lines={[`P = ${formatCoordinate(p)}`, `vector = ${formatCoordinate(vector)}`, `P' = ${formatCoordinate(image)}`, `x+a = ${round(image.x)}`, `y+b = ${round(image.y)}`, "size/orientation preserved"]} />
      <DraggablePoint p={p} label="Drag P" onChange={(next) => { onValueChange("x", next.x); onValueChange("y", next.y); }} />
      <DraggablePoint p={image} label="Drag vector" onChange={(next) => { onValueChange("a", next.x - p.x); onValueChange("b", next.y - p.y); }} />
    </Frame>
  );
}

function PointPairModel({ values, activeHighlight, onHighlight, onValueChange, mode }: VisualState & { mode: "distance" | "midpoint" | "slope" }) {
  const p = { x: values.x1, y: values.y1 };
  const q = { x: values.x2, y: values.y2 };
  const mid = midpoint(p, q);
  const run = q.x - p.x;
  const rise = q.y - p.y;
  const m = slope(p, q);
  return (
    <Frame label={`${mode} coordinate proof`}>
      <CoordinateGrid />
      <Segment p={p} q={q} token={mode === "slope" ? "m" : "distance"} active={activeHighlight} onHighlight={onHighlight} />
      <SlopeTriangleFromPoints p={p} q={q} active={activeHighlight} onHighlight={onHighlight} />
      {mode === "midpoint" ? <PointMark p={mid} label="M" token="M" active={activeHighlight} onHighlight={onHighlight} fill="#a855f7" /> : null}
      <PointMark p={p} label="P" token="P" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={q} label="Q" token="Q" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <Info lines={mode === "midpoint" ? [`P ${formatCoordinate(p)}`, `Q ${formatCoordinate(q)}`, `M ${formatCoordinate(mid)}`, `PM = ${round(distance(p, mid))}`, `MQ = ${round(distance(mid, q))}`] : mode === "slope" ? [`P ${formatCoordinate(p)}`, `Q ${formatCoordinate(q)}`, `rise = ${round(rise)}`, `run = ${round(run)}`, `slope = ${m === undefined ? "undefined" : round(m)}`, run === 0 ? "warning: vertical line" : "m = rise/run"] : [`P ${formatCoordinate(p)}`, `Q ${formatCoordinate(q)}`, `dx = ${round(run)}`, `dy = ${round(rise)}`, `dx^2 = ${round(run * run)}`, `dy^2 = ${round(rise * rise)}`, `d = ${round(distance(p, q))}`]} />
      <DraggablePoint p={p} label="Drag P" onChange={(next) => { onValueChange("x1", next.x); onValueChange("y1", next.y); }} />
      <DraggablePoint p={q} label="Drag Q" onChange={(next) => { onValueChange("x2", next.x); onValueChange("y2", next.y); }} />
    </Frame>
  );
}

export function CoordinateGrid() {
  const lines: ReactNode[] = [];
  for (let n = grid.min; n <= grid.max; n += 1) {
    const x = grid.ox + n * grid.unit;
    const y = grid.oy - n * grid.unit;
    lines.push(<line key={`x${n}`} x1={x} y1={grid.oy - grid.max * grid.unit} x2={x} y2={grid.oy - grid.min * grid.unit} stroke={n === 0 ? "#94a3b8" : "#1e293b"} strokeWidth={n === 0 ? 3 : 1} />);
    lines.push(<line key={`y${n}`} x1={grid.ox + grid.min * grid.unit} y1={y} x2={grid.ox + grid.max * grid.unit} y2={y} stroke={n === 0 ? "#94a3b8" : "#1e293b"} strokeWidth={n === 0 ? 3 : 1} />);
    if (n !== 0 && n % 2 === 0) {
      lines.push(<text key={`tx${n}`} x={x - 4} y={grid.oy + 18} fill="#64748b" fontSize="10">{n}</text>);
      lines.push(<text key={`ty${n}`} x={grid.ox + 8} y={y + 4} fill="#64748b" fontSize="10">{n}</text>);
    }
  }
  return <g>{lines}</g>;
}

export function DraggablePoint({ p, label, onChange }: { p: Point; label: string; onChange: (point: Point) => void }) {
  const svg = svgPoint(p);
  return <DraggableHandle label={label} position={svg} axis="xy" bounds={{ x: [grid.ox + grid.min * grid.unit, grid.ox + grid.max * grid.unit], y: [grid.oy - grid.max * grid.unit, grid.oy - grid.min * grid.unit] }} snapToGrid={grid.unit} keyboardStep={grid.unit} onChange={(next) => onChange(mathPoint(next))} />;
}

export function PointMark({ p, label, token, active, onHighlight, fill }: { p: Point; label: string; token: string; active: string | null; onHighlight: (token: string | null) => void; fill: string }) {
  const svg = svgPoint(p);
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><circle cx={svg.x} cy={svg.y} r={active === token ? 11 : 8} fill={fill} stroke="#f8fafc" strokeWidth={active === token ? 4 : 2} /><text x={svg.x + 12} y={svg.y - 10} fill="#f8fafc" fontSize="13" fontWeight="900">{label}</text></g>;
}

export function Segment({ p, q, token, active, onHighlight }: { p: Point; q: Point; token: string; active: string | null; onHighlight: (token: string | null) => void }) {
  const a = svgPoint(p);
  const b = svgPoint(q);
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={strokeFor(token, active, "#fde68a")} strokeWidth={widthFor(token, active)} onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)} />;
}

export function SlopeTriangleFromPoints({ p, q, active, onHighlight }: { p: Point; q: Point; active: string | null; onHighlight: (token: string | null) => void }) {
  const a = svgPoint(p);
  const corner = svgPoint({ x: q.x, y: p.y });
  const b = svgPoint(q);
  return <g><line x1={a.x} y1={a.y} x2={corner.x} y2={corner.y} stroke={strokeFor("run", active, "#22d3ee")} strokeWidth={widthFor("run", active)} onMouseEnter={() => onHighlight("run")} onMouseLeave={() => onHighlight(null)} /><line x1={corner.x} y1={corner.y} x2={b.x} y2={b.y} stroke={strokeFor("rise", active, "#f97316")} strokeWidth={widthFor("rise", active)} onMouseEnter={() => onHighlight("rise")} onMouseLeave={() => onHighlight(null)} /></g>;
}

export function SlopeTriangle({ origin, m, token, active, onHighlight }: { origin: Point; m: number; token: string; active: string | null; onHighlight: (token: string | null) => void }) {
  const p = svgPoint(origin);
  const q = svgPoint({ x: origin.x + 2, y: origin.y + 2 * m });
  const corner = svgPoint({ x: origin.x + 2, y: origin.y });
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><line x1={p.x} y1={p.y} x2={corner.x} y2={corner.y} stroke={strokeFor(token, active, "#22d3ee")} strokeWidth={widthFor(token, active)} /><line x1={corner.x} y1={corner.y} x2={q.x} y2={q.y} stroke={strokeFor(token, active, "#f97316")} strokeWidth={widthFor(token, active)} /></g>;
}

export function Line({ m, c, token, active, onHighlight, color = "#fde68a" }: { m: number; c: number; token: string; active: string | null; onHighlight: (token: string | null) => void; color?: string }) {
  const x1 = grid.min;
  const x2 = grid.max;
  const p1 = svgPoint({ x: x1, y: m * x1 + c });
  const p2 = svgPoint({ x: x2, y: m * x2 + c });
  return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={strokeFor(token, active, color)} strokeWidth={widthFor(token, active)} onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)} />;
}

export function RightAngle({ active }: { active: boolean }) {
  const p = svgPoint({ x: 0, y: 0 });
  return <path d={`M ${p.x + 28} ${p.y} L ${p.x + 28} ${p.y - 28} L ${p.x} ${p.y - 28}`} fill="none" stroke={active ? "#fde68a" : "#64748b"} strokeWidth={active ? 6 : 3} />;
}

export function Info({ lines }: { lines: (string | number)[] }) {
  return <g><rect x="610" y="80" width="250" height={Math.max(90, lines.length * 25 + 22)} rx="16" fill="#0f172a" opacity="0.94" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="630" y={113 + index * 25} fill="#f8fafc" fontSize="13" fontWeight="800">{line}</text>)}</g>;
}

export function Frame({ label, children }: { label: string; children: ReactNode }) {
  return <div className="bg-white p-2 dark:bg-slate-950"><svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full"><rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />{children}</svg></div>;
}

function angleBetweenSlopes(m1: number, m2: number) {
  return Math.abs((Math.atan((m2 - m1) / (1 + m1 * m2)) * 180) / Math.PI);
}

export function strokeFor(token: string, active: string | null, fallback: string) {
  return active === token ? "#fde68a" : fallback;
}

export function widthFor(token: string, active: string | null) {
  return active === token ? "7" : "4";
}
