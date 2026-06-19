import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeHighlight: string | null;
  onValueChange: (id: string, value: number) => void;
};

type Point = { x: number; y: number };

const colors = {
  original: "#38bdf8",
  image: "#22c55e",
  guide: "#facc15",
  accent: "#f97316",
  mirror: "#fb7185",
  purple: "#a78bfa",
  axis: "#94a3b8",
  panel: "#0f172a",
};

const baseShape = [p(-1, 0), p(1, 0), p(0.5, 1.4), p(-0.8, 1)];

export function TranslationSlidingVectorVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const origin = p(values.originX, values.originY);
  const vector = p(values.a, values.b);
  const preimage = moveShape(baseShape, origin);
  const image = preimage.map((q) => p(q.x + vector.x, q.y + vector.y));
  return (
    <Frame label="Translation as sliding without turning">
      <Grid />
      <Polygon points={preimage} color={colors.original} label="preimage" active={activeHighlight === "xy"} />
      <Polygon points={image} color={colors.image} label="image" active={activeHighlight === "x-plus-a-y-plus-b"} />
      {preimage.map((q, index) => <Arrow key={index} from={q} to={image[index]} color={activeHighlight === "same-vector" ? colors.guide : colors.accent} />)}
      <Arrow from={p(-5, -4)} to={p(-5 + vector.x, -4 + vector.y)} color={activeHighlight === "translation-vector" ? colors.guide : colors.accent} label={`(${fmt(vector.x)},${fmt(vector.y)})`} />
      <DraggableHandle label="Drag translation vector" position={sp(p(-5 + vector.x, -4 + vector.y))} bounds={bounds()} onChange={(next) => { const q = unsp(next); onValueChange("a", q.x + 5); onValueChange("b", q.y + 4); }} />
      {toggles.labels ? <Info lines={[`vector = (${fmt(vector.x)}, ${fmt(vector.y)})`, `first point = ${pt(preimage[0])}`, `image point = ${pt(image[0])}`, `side lengths preserved`, `orientation unchanged`, `invariant: same vector for every point`]} /> : null}
    </Frame>
  );
}

export function ReflectionMirrorLineVisual({ values, toggles, activeHighlight }: VisualState) {
  const origin = p(values.originX, values.originY);
  const mode = Math.round(values.mode);
  const preimage = moveShape(baseShape, origin);
  const image = preimage.map((q) => reflectPoint(q, mode));
  return (
    <Frame label="Reflection as mirror image">
      <Grid />
      <MirrorLine mode={mode} active={activeHighlight === "mirror-line"} />
      <Polygon points={preimage} color={colors.original} label="preimage" />
      <Polygon points={image} color={colors.image} label="image" active={highlight(activeHighlight, ["x-neg-y", "neg-x-y"])} />
      {preimage.map((q, index) => <DistanceToMirror key={index} point={q} image={image[index]} active={activeHighlight === "equal-distance"} />)}
      {toggles.labels ? <Info lines={[`mirror line = ${mode === 0 ? "x-axis" : "y-axis"}`, `first point = ${pt(preimage[0])}`, `reflected point = ${pt(image[0])}`, `equal perpendicular distances`, `orientation reversed`, `invariant: same distance from mirror line`]} /> : null}
    </Frame>
  );
}

export function RotationAboutPointVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const center = p(values.centerX, values.centerY);
  const angle = Math.round(values.angle);
  const preimage = moveShape(baseShape, p(values.originX, values.originY));
  const image = preimage.map((q) => rotatePoint(q, center, angle));
  return (
    <Frame label="Rotation about a point">
      <Grid />
      <PointMark point={center} label="O" color={activeHighlight === "center" ? colors.guide : colors.accent} />
      <Polygon points={preimage} color={colors.original} label="preimage" />
      <Polygon points={image} color={colors.image} label="image" active={activeHighlight === "angle"} />
      {preimage.map((q, index) => <RotationArc key={index} center={center} from={q} to={image[index]} active={activeHighlight === "distance-preserved"} />)}
      <DraggableHandle label="Drag rotation center" position={sp(center)} bounds={bounds()} onChange={(next) => { const q = unsp(next); onValueChange("centerX", q.x); onValueChange("centerY", q.y); }} />
      {toggles.labels ? <Info lines={[`center = ${pt(center)}`, `angle = ${angle} deg`, `first point = ${pt(preimage[0])}`, `rotated point = ${pt(image[0])}`, `radius before = ${fmt(dist(center, preimage[0]))}`, `radius after = ${fmt(dist(center, image[0]))}`, `orientation preserved`]} /> : null}
    </Frame>
  );
}

export function DilationSimilarityVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const center = p(values.centerX, values.centerY);
  const k = values.k;
  const preimage = moveShape(baseShape, p(values.originX, values.originY));
  const image = preimage.map((q) => dilatePoint(q, center, k));
  return (
    <Frame label="Dilation and similarity">
      <Grid />
      <PointMark point={center} label="C" color={activeHighlight === "center" ? colors.guide : colors.accent} />
      {preimage.map((q, index) => <line key={index} x1={sx(center.x)} y1={sy(center.y)} x2={sx(image[index].x)} y2={sy(image[index].y)} stroke={activeHighlight === "similar" ? colors.guide : "#334155"} strokeWidth="3" strokeDasharray="7 6" />)}
      <Polygon points={preimage} color={colors.original} label="preimage" />
      <Polygon points={image} color={colors.image} label="image" active={highlight(activeHighlight, ["k", "kx-ky"])} />
      <DraggableHandle label="Drag dilation center" position={sp(center)} bounds={bounds()} onChange={(next) => { const q = unsp(next); onValueChange("centerX", q.x); onValueChange("centerY", q.y); }} />
      {toggles.labels ? <Info lines={[`center = ${pt(center)}`, `scale factor k = ${fmt(k)}`, `original side = ${fmt(side(preimage))}`, `image side = ${fmt(side(image))}`, `ratio = ${fmt(side(image) / side(preimage))}`, `angles preserved`, `invariant: image lengths = |k| x original`]} /> : null}
    </Frame>
  );
}

export function CongruenceRigidMotionsVisual({ values, toggles, activeHighlight }: VisualState) {
  const step = Math.round(values.step);
  const preimage = moveShape([p(-1, 0), p(1, 0), p(0, 1.6)], p(-3, -1));
  const translated = preimage.map((q) => p(q.x + 4, q.y + 1.5));
  const transformed = step === 0 ? preimage : step === 1 ? translated : step === 2 ? translated.map((q) => rotatePoint(q, p(1, 0.5), 90)) : translated.map((q) => reflectPoint(q, 1));
  return (
    <Frame label="Congruence through rigid motions">
      <Grid />
      <Polygon points={preimage} color={colors.original} label="original" />
      <Polygon points={transformed} color={colors.image} label="mapped" active={highlight(activeHighlight, ["translation", "rotation", "reflection", "congruent"])} />
      <SequencePanel step={step} active={highlight(activeHighlight, ["translation", "rotation", "reflection"])} />
      {toggles.labels ? <Info lines={[`sequence step = ${step}`, `original sides = ${sideList(preimage)}`, `image sides = ${sideList(transformed)}`, `angles preserved`, `status = congruent`, `invariant: rigid motions preserve distances and angles`]} /> : null}
    </Frame>
  );
}

export function LineRotationalSymmetryVisual({ values, toggles, activeHighlight }: VisualState) {
  const shape = symmetryShape(values.shape);
  const sides = symmetrySides(values.shape);
  const angle = values.angle;
  const order = sides === 4 && Math.round(values.shape) === 3 ? 2 : sides;
  const maps = Math.abs((angle % (360 / order))) < 2 || Math.abs((angle % (360 / order)) - (360 / order)) < 2;
  return (
    <Frame label="Line symmetry and rotational symmetry">
      <Grid />
      <Polygon points={shape} color={colors.original} label="shape" active={activeHighlight === "maps-to-itself"} />
      <SymmetryLines count={order} active={activeHighlight === "line-symmetry"} />
      <Polygon points={shape.map((q) => rotatePoint(q, p(0, 0), angle))} color={maps ? colors.image : colors.mirror} label="test rotation" active={activeHighlight === "rotation-angle"} />
      {toggles.labels ? <Info lines={[`shape = ${shapeName(values.shape)}`, `line symmetry count = ${order}`, `rotational order = ${order}`, `selected angle = ${fmt(angle)} deg`, `maps to itself = ${maps ? "yes" : "no"}`, `invariant: symmetry leaves figure unchanged`]} /> : null}
    </Frame>
  );
}

export function TessellationsRepeatedTransformationsVisual({ values, toggles, activeHighlight }: VisualState) {
  const tile = Math.round(values.tile);
  const mode = Math.round(values.mode);
  const spacing = values.spacing;
  const fit = tessellates(tile, spacing);
  return (
    <Frame label="Tessellations by repeated transformations">
      <TilePatch tile={tile} mode={mode} spacing={spacing} active={activeHighlight} />
      {toggles.labels ? <Info lines={[`tile = ${tileName(tile)}`, `mode = ${mode === 0 ? "translation" : mode === 1 ? "rotation" : "reflection"}`, `spacing = ${fmt(spacing)}`, `gap/overlap = ${fit ? "none" : "check spacing"}`, `angle fit = ${angleFit(tile)}`, `status = ${fit ? "tessellates" : "not clean yet"}`, `invariant: no gaps or overlaps`]} /> : null}
    </Frame>
  );
}

export function TransformationMatrices2DVisual({ values, toggles, activeHighlight }: VisualState) {
  const mode = Math.round(values.mode);
  const k = values.k;
  const shape = moveShape([p(0, 0), p(1.4, 0), p(1, 1.2), p(0, 1)], p(1, 0.4));
  const matrix = selectedMatrix(mode, k);
  const image = shape.map((q) => applyMatrix(matrix, q));
  const e1 = applyMatrix(matrix, p(1, 0));
  const e2 = applyMatrix(matrix, p(0, 1));
  return (
    <Frame label="Transformation matrices in 2D">
      <Grid />
      <Vector to={p(1, 0)} color={colors.original} label="i" />
      <Vector to={p(0, 1)} color={colors.original} label="j" />
      <Vector to={e1} color={activeHighlight === "basis-vectors" ? colors.guide : colors.accent} label="A i" />
      <Vector to={e2} color={activeHighlight === "basis-vectors" ? colors.guide : colors.purple} label="A j" />
      <Polygon points={shape} color={colors.original} label="input" />
      <Polygon points={image} color={colors.image} label="output" active={activeHighlight === "transformed-shape"} />
      <MatrixPanel matrix={matrix} mode={mode} active={activeHighlight === "matrix-entries"} />
      {toggles.labels ? <Info lines={[`matrix = ${matrixText(matrix)}`, `input point = ${pt(shape[2])}`, `output point = ${pt(image[2])}`, `determinant = ${fmt(det(matrix))}`, `area scale = ${fmt(Math.abs(det(matrix)))}`, `orientation = ${det(matrix) < 0 ? "reversed" : "preserved"}`]} /> : null}
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full">
        <rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />
        <text x="58" y="70" className="fill-white text-xl font-black">{label}</text>
        {children}
      </svg>
    </div>
  );
}

function Grid() {
  return (
    <g>
      {range(-6, 6, 1).map((v) => <line key={`x${v}`} x1={sx(v)} y1={sy(-5)} x2={sx(v)} y2={sy(5)} stroke="#1e293b" />)}
      {range(-5, 5, 1).map((v) => <line key={`y${v}`} x1={sx(-6)} y1={sy(v)} x2={sx(6)} y2={sy(v)} stroke="#1e293b" />)}
      <line x1={sx(-6)} y1={sy(0)} x2={sx(6)} y2={sy(0)} stroke={colors.axis} strokeWidth="3" />
      <line x1={sx(0)} y1={sy(-5)} x2={sx(0)} y2={sy(5)} stroke={colors.axis} strokeWidth="3" />
    </g>
  );
}

function Polygon({ points, color, label, active = false }: { points: Point[]; color: string; label: string; active?: boolean }) {
  const centroid = points.reduce((acc, q) => p(acc.x + q.x / points.length, acc.y + q.y / points.length), p(0, 0));
  return <g><polygon points={points.map((q) => `${sx(q.x)},${sy(q.y)}`).join(" ")} fill={color} opacity="0.28" stroke={active ? colors.guide : color} strokeWidth="5" /><Text x={sx(centroid.x) + 8} y={sy(centroid.y) - 8} text={label} /></g>;
}

function Arrow({ from, to, color, label }: { from: Point; to: Point; color: string; label?: string }) {
  return <g><line x1={sx(from.x)} y1={sy(from.y)} x2={sx(to.x)} y2={sy(to.y)} stroke={color} strokeWidth="4" markerEnd="url(#arrow)" /><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={color} /></marker></defs>{label ? <Text x={sx(to.x) + 8} y={sy(to.y) - 8} text={label} /> : null}</g>;
}

function Vector({ to, color, label }: { to: Point; color: string; label: string }) {
  return <Arrow from={p(0, 0)} to={to} color={color} label={label} />;
}

function MirrorLine({ mode, active }: { mode: number; active: boolean }) {
  return mode === 0 ? <line x1={sx(-6)} y1={sy(0)} x2={sx(6)} y2={sy(0)} stroke={active ? colors.guide : colors.mirror} strokeWidth="5" strokeDasharray="9 7" /> : <line x1={sx(0)} y1={sy(-5)} x2={sx(0)} y2={sy(5)} stroke={active ? colors.guide : colors.mirror} strokeWidth="5" strokeDasharray="9 7" />;
}

function DistanceToMirror({ point, image, active }: { point: Point; image: Point; active: boolean }) {
  return <line x1={sx(point.x)} y1={sy(point.y)} x2={sx(image.x)} y2={sy(image.y)} stroke={active ? colors.guide : colors.purple} strokeWidth="3" strokeDasharray="6 6" />;
}

function RotationArc({ center, from, to, active }: { center: Point; from: Point; to: Point; active: boolean }) {
  const r = dist(center, from) * scale;
  return <path d={`M ${sx(from.x)} ${sy(from.y)} A ${r} ${r} 0 0 0 ${sx(to.x)} ${sy(to.y)}`} fill="none" stroke={active ? colors.guide : colors.purple} strokeWidth="3" strokeDasharray="6 6" />;
}

function PointMark({ point, label, color }: { point: Point; label: string; color: string }) {
  return <g><circle cx={sx(point.x)} cy={sy(point.y)} r="8" fill={color} /><Text x={sx(point.x) + 10} y={sy(point.y) - 8} text={label} /></g>;
}

function SequencePanel({ step, active }: { step: number; active: boolean }) {
  const lines = ["0 original", "1 translate", "2 rotate", "3 reflect"];
  return <g><rect x="550" y="125" width="210" height="132" rx="14" fill={active ? "#713f12" : colors.panel} stroke="#334155" />{lines.map((line, index) => <Text key={line} x={570} y={158 + index * 27} text={`${index === step ? "> " : ""}${line}`} />)}</g>;
}

function SymmetryLines({ count, active }: { count: number; active: boolean }) {
  return <g>{Array.from({ length: count }, (_, index) => { const angle = (Math.PI * index) / count; return <line key={index} x1={sx(-4 * Math.cos(angle))} y1={sy(-4 * Math.sin(angle))} x2={sx(4 * Math.cos(angle))} y2={sy(4 * Math.sin(angle))} stroke={active ? colors.guide : colors.purple} strokeWidth="3" strokeDasharray="8 7" />; })}</g>;
}

function TilePatch({ tile, mode, spacing, active }: { tile: number; mode: number; spacing: number; active: string | null }) {
  const centers = range(-2, 2, 1).flatMap((x) => range(-1, 1, 1).map((y) => p(x * spacing, y * spacing)));
  return <g transform="translate(300 285)">{centers.map((center, index) => <g key={index} transform={`translate(${center.x * 42} ${-center.y * 42}) ${mode === 1 && index % 2 ? "rotate(30)" : ""} ${mode === 2 && index % 2 ? "scale(-1 1)" : ""}`}><TileShape tile={tile} active={highlight(active, ["translation", "rotation-reflection", "no-gaps", "no-overlaps", "angle-fit"])} /></g>)}</g>;
}

function TileShape({ tile, active }: { tile: number; active: boolean }) {
  if (tile === 1) return <polygon points="-28,24 0,-28 28,24" fill={colors.original} opacity="0.4" stroke={active ? colors.guide : colors.original} strokeWidth="3" />;
  if (tile === 2) return <polygon points="-30,0 -15,-26 15,-26 30,0 15,26 -15,26" fill={colors.original} opacity="0.4" stroke={active ? colors.guide : colors.original} strokeWidth="3" />;
  return <rect x="-28" y="-28" width="56" height="56" fill={colors.original} opacity="0.4" stroke={active ? colors.guide : colors.original} strokeWidth="3" />;
}

function MatrixPanel({ matrix, mode, active }: { matrix: number[][]; mode: number; active: boolean }) {
  return <g><rect x="560" y="118" width="190" height="120" rx="14" fill={active ? "#713f12" : colors.panel} stroke="#334155" /><Text x={580} y={150} text={matrixName(mode)} /><Text x={590} y={185} text={`[${fmt(matrix[0][0])} ${fmt(matrix[0][1])}]`} /><Text x={590} y={215} text={`[${fmt(matrix[1][0])} ${fmt(matrix[1][1])}]`} /></g>;
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="612" y="104" width="252" height={Math.max(95, lines.length * 23 + 34)} rx="14" fill={colors.panel} stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="628" y={134 + index * 22} className="fill-slate-100 text-xs font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} className="fill-white text-sm font-black">{text}</text>;
}

const origin = { x: 310, y: 292 };
const scale = 34;
function sx(x: number) { return origin.x + x * scale; }
function sy(y: number) { return origin.y - y * scale; }
function sp(point: Point) { return { x: sx(point.x), y: sy(point.y) }; }
function unsp(point: { x: number; y: number }) { return p((point.x - origin.x) / scale, (origin.y - point.y) / scale); }
function bounds(): { x: [number, number]; y: [number, number] } { return { x: [sx(-6), sx(6)], y: [sy(5), sy(-5)] }; }
function p(x: number, y: number): Point { return { x, y }; }
function moveShape(shape: Point[], offset: Point) { return shape.map((q) => p(q.x + offset.x, q.y + offset.y)); }
function reflectPoint(q: Point, mode: number) { return mode === 0 ? p(q.x, -q.y) : p(-q.x, q.y); }
function rotatePoint(q: Point, center: Point, degrees: number) {
  const rad = degrees * Math.PI / 180;
  const dx = q.x - center.x;
  const dy = q.y - center.y;
  return p(center.x + dx * Math.cos(rad) - dy * Math.sin(rad), center.y + dx * Math.sin(rad) + dy * Math.cos(rad));
}
function dilatePoint(q: Point, center: Point, k: number) { return p(center.x + k * (q.x - center.x), center.y + k * (q.y - center.y)); }
function symmetrySides(shape: number) { const selected = Math.round(shape); return selected === 0 ? 3 : selected === 2 ? 5 : 4; }
function symmetryShape(shape: number) {
  const selected = Math.round(shape);
  if (selected === 3) return [p(-2.2, -1), p(2.2, -1), p(2.2, 1), p(-2.2, 1)];
  const sides = symmetrySides(selected);
  return Array.from({ length: sides }, (_, index) => p(2.2 * Math.cos(-Math.PI / 2 + (2 * Math.PI * index) / sides), 2.2 * Math.sin(-Math.PI / 2 + (2 * Math.PI * index) / sides)));
}
function shapeName(shape: number) { return ["equilateral triangle", "square", "regular pentagon", "rectangle"][Math.round(shape)] ?? "square"; }
function tileName(tile: number) { return ["square", "equilateral triangle", "regular hexagon", "rectangle"][Math.round(tile)] ?? "square"; }
function tessellates(tile: number, spacing: number) { return spacing >= 1.6 && spacing <= 2.4 && [0, 1, 2, 3].includes(Math.round(tile)); }
function angleFit(tile: number) { return Math.round(tile) === 1 ? "60 deg x 6 = 360" : Math.round(tile) === 2 ? "120 deg x 3 = 360" : "90 deg x 4 = 360"; }
function selectedMatrix(mode: number, k: number) {
  if (mode === 0) return [[1, 0], [0, -1]];
  if (mode === 1) return [[0, -1], [1, 0]];
  if (mode === 2) return [[k, 0], [0, k]];
  return [[1, k], [0, 1]];
}
function matrixName(mode: number) { return ["reflect x-axis", "rotate 90", "scale", "shear"][mode] ?? "matrix"; }
function applyMatrix(m: number[][], q: Point) { return p(m[0][0] * q.x + m[0][1] * q.y, m[1][0] * q.x + m[1][1] * q.y); }
function det(m: number[][]) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }
function matrixText(m: number[][]) { return `[[${fmt(m[0][0])},${fmt(m[0][1])}],[${fmt(m[1][0])},${fmt(m[1][1])}]]`; }
function side(points: Point[]) { return dist(points[0], points[1]); }
function sideList(points: Point[]) { return points.map((q, index) => fmt(dist(q, points[(index + 1) % points.length]))).join(", "); }
function dist(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
function pt(q: Point) { return `(${fmt(q.x)}, ${fmt(q.y)})`; }
function range(start: number, end: number, step: number) {
  const values: number[] = [];
  for (let value = start; value <= end + 0.0001; value += step) values.push(Number(value.toFixed(3)));
  return values;
}
function highlight(active: string | null, ids: string[]) { return !!active && ids.includes(active); }
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
