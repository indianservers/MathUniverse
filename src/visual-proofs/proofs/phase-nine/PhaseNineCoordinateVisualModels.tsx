import { DraggableHandle } from "../../components/DraggableHandle";
import {
  CoordinateGrid,
  distance,
  DraggablePoint,
  formatCoordinate,
  Frame,
  grid,
  Info,
  Line,
  PointMark,
  Segment,
  SlopeTriangleFromPoints,
  strokeFor,
  svgPoint,
  widthFor,
  type Point,
  type VisualState,
} from "../phase-eight/PhaseEightCoordinateVisualModels";

const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const origin: Point = { x: 0, y: 0 };

export function SectionFormulaVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = { x: values.x1, y: values.y1 };
  const b = { x: values.x2, y: values.y2 };
  const m = Math.max(1, values.m);
  const n = Math.max(1, values.n);
  const p = sectionPoint(a, b, m, n);
  const ap = distance(a, p);
  const pb = distance(p, b);
  return (
    <Frame label="Section formula coordinate proof">
      <CoordinateGrid />
      <Segment p={a} q={b} token="m:n" active={activeHighlight} onHighlight={onHighlight} />
      <line x1={svgPoint(a).x} y1={svgPoint(a).y} x2={svgPoint(p).x} y2={svgPoint(p).y} stroke={strokeFor("m:n", activeHighlight, "#22d3ee")} strokeWidth={widthFor("m:n", activeHighlight)} />
      <line x1={svgPoint(p).x} y1={svgPoint(p).y} x2={svgPoint(b).x} y2={svgPoint(b).y} stroke={strokeFor("m:n", activeHighlight, "#f97316")} strokeWidth={widthFor("m:n", activeHighlight)} />
      <PointMark p={a} label="A" token="A" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={b} label="B" token="B" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <PointMark p={p} label="P" token="m:n" active={activeHighlight} onHighlight={onHighlight} fill="#fde68a" />
      <Info lines={[`A ${formatCoordinate(a)}`, `B ${formatCoordinate(b)}`, `m:n = ${m}:${n}`, `P ${formatCoordinate(p)}`, `AP = ${round(ap)}`, `PB = ${round(pb)}`, `AP/PB = ${round(ap / Math.max(0.01, pb))}`]} />
      <WeightedBars a={a} b={b} p={p} active={activeHighlight} />
      <DraggablePoint p={a} label="Drag A" onChange={(next) => { onValueChange("x1", next.x); onValueChange("y1", next.y); }} />
      <DraggablePoint p={b} label="Drag B" onChange={(next) => { onValueChange("x2", next.x); onValueChange("y2", next.y); }} />
    </Frame>
  );
}

export function PointSlopeLineVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const p = { x: values.x1, y: values.y1 };
  const m = values.m;
  const q = { x: values.x, y: values.y1 + m * (values.x - values.x1) };
  const c = p.y - m * p.x;
  return (
    <Frame label="Point slope line equation">
      <CoordinateGrid />
      <Line m={m} c={c} token="m" active={activeHighlight} onHighlight={onHighlight} />
      <SlopeTriangleFromPoints p={p} q={q} active={activeHighlight} onHighlight={onHighlight} />
      <PointMark p={p} label="P" token="anchor" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={q} label="Q" token="point" active={activeHighlight} onHighlight={onHighlight} fill="#fde68a" />
      <Info lines={[`P ${formatCoordinate(p)}`, `Q ${formatCoordinate(q)}`, `m = ${round(m)}`, `dx = ${round(q.x - p.x)}`, `dy = ${round(q.y - p.y)}`, `dy/dx = ${round((q.y - p.y) / Math.max(0.01, q.x - p.x))}`]} />
      <DraggablePoint p={p} label="Drag anchor P" onChange={(next) => { onValueChange("x1", next.x); onValueChange("y1", next.y); }} />
      <DraggablePoint p={{ x: p.x + 2, y: p.y + 2 * m }} label="Drag slope" onChange={(next) => onValueChange("m", round((next.y - p.y) / Math.max(1, next.x - p.x), 2))} />
      <DraggableHandle label="Drag Q along line" position={svgPoint(q)} axis="x" bounds={{ x: [grid.ox + grid.min * grid.unit, grid.ox + grid.max * grid.unit], y: [svgPoint(q).y, svgPoint(q).y] }} snapToGrid={grid.unit} keyboardStep={grid.unit} onChange={(next) => onValueChange("x", clamp(round((next.x - grid.ox) / grid.unit), grid.min, grid.max))} />
    </Frame>
  );
}

export function TriangleAreaCoordinatesVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = { x: values.x1, y: values.y1 };
  const b = { x: values.x2, y: values.y2 };
  const c = { x: values.x3, y: values.y3 };
  const signed = signedArea(a, b, c);
  const area = Math.abs(signed);
  return (
    <Frame label="Triangle area using coordinates">
      <CoordinateGrid />
      <polygon points={`${svgPoint(a).x},${svgPoint(a).y} ${svgPoint(b).x},${svgPoint(b).y} ${svgPoint(c).x},${svgPoint(c).y}`} fill="#22d3ee" opacity="0.2" stroke="#22d3ee" strokeWidth="4" />
      <ShoelaceAreaGuide a={a} b={b} c={c} active={activeHighlight} onHighlight={onHighlight} />
      <PointMark p={a} label="A" token="term1" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={b} label="B" token="term2" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <PointMark p={c} label="C" token="term3" active={activeHighlight} onHighlight={onHighlight} fill="#fde68a" />
      <Info lines={[`A ${formatCoordinate(a)}`, `B ${formatCoordinate(b)}`, `C ${formatCoordinate(c)}`, `signed = ${round(signed)}`, `area = ${round(area)}`, area < 0.01 ? "collinear warning" : "absolute area >= 0"]} />
      <DraggablePoint p={a} label="Drag A" onChange={(next) => { onValueChange("x1", next.x); onValueChange("y1", next.y); }} />
      <DraggablePoint p={b} label="Drag B" onChange={(next) => { onValueChange("x2", next.x); onValueChange("y2", next.y); }} />
      <DraggablePoint p={c} label="Drag C" onChange={(next) => { onValueChange("x3", next.x); onValueChange("y3", next.y); }} />
    </Frame>
  );
}

export function ReflectionAcrossAxesVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const p = { x: values.x, y: values.y };
  const axis = Math.round(values.axis) === 2 ? "y" : "x";
  const image = axis === "x" ? { x: p.x, y: -p.y } : { x: -p.x, y: p.y };
  const axisToken = axis === "x" ? "y-neg" : "x-neg";
  return (
    <Frame label="Reflection across coordinate axes">
      <CoordinateGrid />
      <AxisMirrorGuide axis={axis} p={p} image={image} active={activeHighlight} />
      <PointMark p={p} label="P" token="original" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={image} label="P'" token={axisToken} active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <Info lines={[`axis = ${axis}-axis`, `P ${formatCoordinate(p)}`, `P' ${formatCoordinate(image)}`, `before dist = ${round(axis === "x" ? Math.abs(p.y) : Math.abs(p.x))}`, `after dist = ${round(axis === "x" ? Math.abs(image.y) : Math.abs(image.x))}`, "same distance from mirror axis"]} />
      <DraggablePoint p={p} label="Drag P" onChange={(next) => { onValueChange("x", next.x); onValueChange("y", next.y); }} />
    </Frame>
  );
}

export function RotationAboutOriginVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const p = { x: values.x, y: values.y };
  const angle = normalizeAngle(values.angle);
  const image = rotatePoint(p, angle);
  return (
    <Frame label="Rotation about origin">
      <CoordinateGrid />
      <RotationArcGuide p={p} image={image} angle={angle} active={activeHighlight} />
      <Segment p={origin} q={p} token="origin" active={activeHighlight} onHighlight={onHighlight} />
      <Segment p={origin} q={image} token="origin" active={activeHighlight} onHighlight={onHighlight} />
      <PointMark p={origin} label="O" token="origin" active={activeHighlight} onHighlight={onHighlight} fill="#a855f7" />
      <PointMark p={p} label="P" token="original" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={image} label="P'" token={`r${angle}`} active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <Info lines={[`angle = ${angle} deg`, `P ${formatCoordinate(p)}`, `P' ${formatCoordinate(image)}`, `OP = ${round(distance(origin, p))}`, `OP' = ${round(distance(origin, image))}`, "distance from origin is preserved"]} />
      <DraggablePoint p={p} label="Drag P" onChange={(next) => { onValueChange("x", next.x); onValueChange("y", next.y); }} />
    </Frame>
  );
}

export function ScalingDilationOriginVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const p = { x: values.x, y: values.y };
  const k = values.k;
  const image = { x: p.x * k, y: p.y * k };
  const pSvg = svgPoint(p);
  const imageSvg = svgPoint(image);
  return (
    <Frame label="Scaling dilation from origin">
      <CoordinateGrid />
      <DilationRayGuide p={p} image={image} active={activeHighlight} />
      <Segment p={origin} q={p} token="origin" active={activeHighlight} onHighlight={onHighlight} />
      <Segment p={origin} q={image} token="k" active={activeHighlight} onHighlight={onHighlight} />
      <PointMark p={origin} label="O" token="origin" active={activeHighlight} onHighlight={onHighlight} fill="#a855f7" />
      <PointMark p={p} label="P" token="original" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={image} label="P'" token="k" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <Info lines={[`k = ${round(k)}`, `P ${formatCoordinate(p)}`, `P' ${formatCoordinate(image)}`, `OP = ${round(distance(origin, p))}`, `OP' = ${round(distance(origin, image))}`, `OP'/OP = ${round(Math.abs(k))}`]} />
      <DraggablePoint p={p} label="Drag P" onChange={(next) => { onValueChange("x", next.x); onValueChange("y", next.y); }} />
      <DraggableHandle label="Drag P' along dilation ray" position={imageSvg} axis="xy" bounds={{ x: [grid.ox + grid.min * grid.unit, grid.ox + grid.max * grid.unit], y: [grid.oy - grid.max * grid.unit, grid.oy - grid.min * grid.unit] }} keyboardStep={grid.unit} onChange={(next) => {
        const dx = (next.x - grid.ox) / grid.unit;
        const dy = (grid.oy - next.y) / grid.unit;
        const denominator = p.x * p.x + p.y * p.y;
        if (denominator > 0.01) onValueChange("k", round((dx * p.x + dy * p.y) / denominator, 2));
      }} />
      <circle cx={pSvg.x} cy={pSvg.y} r="4" fill="#f8fafc" />
    </Frame>
  );
}

export function CoordinatePythagoreanVisual({ values, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const aLen = values.a;
  const bLen = values.b;
  const a = origin;
  const b = { x: aLen, y: 0 };
  const c = { x: 0, y: bLen };
  const hyp = distance(b, c);
  return (
    <Frame label="Coordinate proof of Pythagorean theorem">
      <CoordinateGrid />
      <polygon points={`${svgPoint(a).x},${svgPoint(a).y} ${svgPoint(b).x},${svgPoint(b).y} ${svgPoint(c).x},${svgPoint(c).y}`} fill="#22d3ee" opacity="0.22" stroke="#22d3ee" strokeWidth="4" />
      <line x1={svgPoint(b).x} y1={svgPoint(b).y} x2={svgPoint(c).x} y2={svgPoint(c).y} stroke={strokeFor("c2", activeHighlight, "#fde68a")} strokeWidth={widthFor("c2", activeHighlight)} />
      <line x1={svgPoint(a).x} y1={svgPoint(a).y} x2={svgPoint(b).x} y2={svgPoint(b).y} stroke={strokeFor("a2", activeHighlight, "#22d3ee")} strokeWidth={widthFor("a2", activeHighlight)} />
      <line x1={svgPoint(a).x} y1={svgPoint(a).y} x2={svgPoint(c).x} y2={svgPoint(c).y} stroke={strokeFor("b2", activeHighlight, "#f97316")} strokeWidth={widthFor("b2", activeHighlight)} />
      <PointMark p={a} label="A" token="origin" active={activeHighlight} onHighlight={onHighlight} fill="#a855f7" />
      <PointMark p={b} label="B" token="a2" active={activeHighlight} onHighlight={onHighlight} fill="#22d3ee" />
      <PointMark p={c} label="C" token="b2" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <Info lines={[`a = ${round(aLen)}`, `b = ${round(bLen)}`, `c = ${round(hyp)}`, `a^2 = ${round(aLen * aLen)}`, `b^2 = ${round(bLen * bLen)}`, `c^2 = ${round(hyp * hyp)}`]} />
      <DraggableHandle label="Drag B on x-axis" position={svgPoint(b)} axis="x" bounds={{ x: [grid.ox + 2 * grid.unit, grid.ox + 8 * grid.unit], y: [grid.oy, grid.oy] }} snapToGrid={grid.unit} keyboardStep={grid.unit} onChange={(next) => onValueChange("a", clamp(round((next.x - grid.ox) / grid.unit), 2, 8))} />
      <DraggableHandle label="Drag C on y-axis" position={svgPoint(c)} axis="y" bounds={{ x: [grid.ox, grid.ox], y: [grid.oy - 8 * grid.unit, grid.oy - 2 * grid.unit] }} snapToGrid={grid.unit} keyboardStep={grid.unit} onChange={(next) => onValueChange("b", clamp(round((grid.oy - next.y) / grid.unit), 2, 8))} />
    </Frame>
  );
}

function sectionPoint(a: Point, b: Point, m: number, n: number) {
  return { x: (m * b.x + n * a.x) / (m + n), y: (m * b.y + n * a.y) / (m + n) };
}

function signedArea(a: Point, b: Point, c: Point) {
  return 0.5 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
}

function rotatePoint(p: Point, angle: number): Point {
  if (angle === 90) return { x: -p.y, y: p.x };
  if (angle === 180) return { x: -p.x, y: -p.y };
  return { x: p.y, y: -p.x };
}

function normalizeAngle(angle: number) {
  const snapped = Math.round(angle / 90) * 90;
  return snapped === 0 ? 90 : clamp(snapped, 90, 270);
}

function WeightedBars({ a, b, p, active }: { a: Point; b: Point; p: Point; active: string | null }) {
  const y = 460;
  const x1 = 135;
  const x2 = 460;
  const t = distance(a, b) < 0.01 ? 0.5 : distance(a, p) / distance(a, b);
  const xp = x1 + (x2 - x1) * t;
  return <g><line x1={x1} y1={y} x2={xp} y2={y} stroke={strokeFor("m:n", active, "#22d3ee")} strokeWidth="10" /><line x1={xp} y1={y} x2={x2} y2={y} stroke={strokeFor("m:n", active, "#f97316")} strokeWidth="10" /><text x={x1} y={y + 28} fill="#f8fafc" fontSize="12" fontWeight="900">A</text><text x={xp - 5} y={y + 28} fill="#f8fafc" fontSize="12" fontWeight="900">P</text><text x={x2} y={y + 28} fill="#f8fafc" fontSize="12" fontWeight="900">B</text></g>;
}

function ShoelaceAreaGuide({ a, b, c, active, onHighlight }: { a: Point; b: Point; c: Point; active: string | null; onHighlight: (token: string | null) => void }) {
  const points = [a, b, c, a].map(svgPoint);
  return (
    <g>
      <path d={`M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y}`} fill="none" stroke={strokeFor("term1", active, "#fde68a")} strokeWidth="3" strokeDasharray="8 6" onMouseEnter={() => onHighlight("term1")} onMouseLeave={() => onHighlight(null)} />
      <path d={`M ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y}`} fill="none" stroke={strokeFor("term2", active, "#f97316")} strokeWidth="3" strokeDasharray="8 6" onMouseEnter={() => onHighlight("term2")} onMouseLeave={() => onHighlight(null)} />
      <text x="92" y="445" fill="#f8fafc" fontSize="13" fontWeight="900">shoelace signed area, then absolute value</text>
    </g>
  );
}

function AxisMirrorGuide({ axis, p, image, active }: { axis: "x" | "y"; p: Point; image: Point; active: string | null }) {
  const pSvg = svgPoint(p);
  const imageSvg = svgPoint(image);
  const mirrorY = axis === "x" ? grid.oy : pSvg.y;
  const mirrorX = axis === "y" ? grid.ox : pSvg.x;
  return <g><line x1={axis === "x" ? 120 : grid.ox} y1={axis === "x" ? grid.oy : 60} x2={axis === "x" ? 600 : grid.ox} y2={axis === "x" ? grid.oy : 480} stroke={strokeFor(axis === "x" ? "y-neg" : "x-neg", active, "#fde68a")} strokeWidth="5" /><line x1={pSvg.x} y1={pSvg.y} x2={mirrorX} y2={mirrorY} stroke="#22d3ee" strokeWidth="3" strokeDasharray="7 6" /><line x1={mirrorX} y1={mirrorY} x2={imageSvg.x} y2={imageSvg.y} stroke="#f97316" strokeWidth="3" strokeDasharray="7 6" /></g>;
}

function RotationArcGuide({ p, image, angle, active }: { p: Point; image: Point; angle: number; active: string | null }) {
  const r = distance(origin, p) * grid.unit;
  const start = svgPoint(p);
  const end = svgPoint(image);
  const large = angle === 270 ? 1 : 0;
  return <g><path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`} fill="none" stroke={strokeFor(`r${angle}`, active, "#fde68a")} strokeWidth="4" markerEnd="url(#phase9arrow)" /><ArrowDef /><text x="115" y="104" fill="#f8fafc" fontSize="13" fontWeight="900">{angle} deg about origin</text></g>;
}

function DilationRayGuide({ p, image, active }: { p: Point; image: Point; active: string | null }) {
  const end = svgPoint({ x: image.x === 0 ? p.x * 2 : image.x * 1.15, y: image.y === 0 ? p.y * 2 : image.y * 1.15 });
  return <g><line x1={grid.ox} y1={grid.oy} x2={end.x} y2={end.y} stroke={strokeFor("k", active, "#fde68a")} strokeWidth="3" strokeDasharray="8 7" markerEnd="url(#phase9arrow)" /><ArrowDef /></g>;
}

function ArrowDef() {
  return <defs><marker id="phase9arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fde68a" /></marker></defs>;
}
