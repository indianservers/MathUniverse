import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

type Vec = { x: number; y: number };

const colors = {
  u: "#38bdf8",
  v: "#f97316",
  result: "#22c55e",
  projection: "#a855f7",
  residual: "#fb7185",
  guide: "#fde68a",
  grid: "#334155",
};

export function VectorDirectedSegmentVisual({ values, toggles, onValueChange }: VisualState) {
  const v = vec(values.x, values.y);
  const angle = angleDeg(v);
  return (
    <Frame label="Vector as directed segment">
      <Grid />
      <ComponentGuide vector={v} />
      <AngleArc vector={v} label="theta" />
      <Arrow from={zero} to={v} color={colors.u} label="v=<x,y>" />
      <EndpointHandle label="Drag vector endpoint" vector={v} onValueChange={onValueChange} xKey="x" yKey="y" />
      {toggles.labels ? <Info lines={[`x = ${fmt(v.x)}`, `y = ${fmt(v.y)}`, `|v| = ${fmt(mag(v))}`, `theta = ${fmt(angle)} deg`, `quadrant = ${quadrant(v)}`]} /> : null}
    </Frame>
  );
}

export function VectorAdditionVisual({ values, toggles, onValueChange }: VisualState) {
  const u = vec(values.ux, values.uy);
  const v = vec(values.vx, values.vy);
  const sum = add(u, v);
  const tip = values.mode > 0.5;
  return (
    <Frame label="Vector addition tip-to-tail and parallelogram">
      <Grid />
      <Parallelogram u={u} v={v} />
      <Arrow from={zero} to={u} color={colors.u} label="u" />
      <Arrow from={tip ? u : zero} to={tip ? sum : v} color={colors.v} label={tip ? "v moved" : "v"} dashed={tip} />
      <Arrow from={zero} to={sum} color={colors.result} label="u+v" />
      <EndpointHandle label="Drag u endpoint" vector={u} onValueChange={onValueChange} xKey="ux" yKey="uy" />
      <EndpointHandle label="Drag v endpoint" vector={v} onValueChange={onValueChange} xKey="vx" yKey="vy" />
      {toggles.labels ? <Info lines={[`u = (${fmt(u.x)}, ${fmt(u.y)})`, `v = (${fmt(v.x)}, ${fmt(v.y)})`, `u+v = (${fmt(sum.x)}, ${fmt(sum.y)})`, `|u+v| = ${fmt(mag(sum))}`, tip ? "view = tip-to-tail" : "view = parallelogram"]} /> : null}
    </Frame>
  );
}

export function ScalarMultiplicationVisual({ values, toggles, onValueChange }: VisualState) {
  const v = vec(values.x, values.y);
  const k = values.k;
  const scaled = scale(v, k);
  return (
    <Frame label="Scalar multiplication of vectors">
      <Grid />
      <Arrow from={zero} to={v} color={colors.u} label="v" />
      <Arrow from={zero} to={scaled} color={colors.result} label="kv" />
      <EndpointHandle label="Drag vector endpoint" vector={v} onValueChange={onValueChange} xKey="x" yKey="y" />
      {toggles.labels ? <Info lines={[`k = ${fmt(k)}`, `v = (${fmt(v.x)}, ${fmt(v.y)})`, `kv = (${fmt(scaled.x)}, ${fmt(scaled.y)})`, `|v| = ${fmt(mag(v))}`, `|kv| = ${fmt(mag(scaled))}`, `direction = ${directionStatus(k, v)}`]} /> : null}
    </Frame>
  );
}

export function DotProductProjectionVisual({ values, toggles, onValueChange }: VisualState) {
  const u = vec(values.ux, values.uy);
  const v = vec(values.vx, values.vy);
  const p = projection(u, v);
  const theta = angleBetween(u, v);
  const signed = mag(v) ? dot(u, v) / mag(v) : 0;
  return (
    <Frame label="Dot product as projection">
      <Grid />
      <line x1={px(scale(unit(v), -5)).x} y1={px(scale(unit(v), -5)).y} x2={px(scale(unit(v), 5)).x} y2={px(scale(unit(v), 5)).y} stroke={colors.grid} strokeWidth="4" strokeDasharray="8 8" />
      <ProjectionDrop from={u} to={p} />
      <AngleArc vector={v} second={u} label="theta" />
      <Arrow from={zero} to={u} color={colors.u} label="u" />
      <Arrow from={zero} to={v} color={colors.v} label="v" />
      <Arrow from={zero} to={p} color={colors.projection} label="proj" />
      <EndpointHandle label="Drag u endpoint" vector={u} onValueChange={onValueChange} xKey="ux" yKey="uy" />
      <EndpointHandle label="Drag v endpoint" vector={v} onValueChange={onValueChange} xKey="vx" yKey="vy" />
      {toggles.labels ? <Info lines={[`|u| = ${fmt(mag(u))}`, `|v| = ${fmt(mag(v))}`, `theta = ${fmt(theta)} deg`, `cos theta = ${fmt(cosBetween(u, v))}`, `signed projection = ${fmt(signed)}`, `u dot v = ${fmt(dot(u, v))}`, `sign = ${dotSign(dot(u, v))}`]} /> : null}
    </Frame>
  );
}

export function CrossProductAreaVisual({ values, toggles, onValueChange }: VisualState) {
  const u = vec(values.ux, values.uy);
  const v = vec(values.vx, values.vy);
  const area = Math.abs(cross(u, v));
  const height = mag(u) ? area / mag(u) : 0;
  return (
    <Frame label="Cross product magnitude as parallelogram area">
      <Grid />
      <Parallelogram u={u} v={v} filled />
      <Arrow from={zero} to={u} color={colors.u} label="u base" />
      <Arrow from={zero} to={v} color={colors.v} label="v" />
      <HeightGuide u={u} v={v} />
      <EndpointHandle label="Drag u endpoint" vector={u} onValueChange={onValueChange} xKey="ux" yKey="uy" />
      <EndpointHandle label="Drag v endpoint" vector={v} onValueChange={onValueChange} xKey="vx" yKey="vy" />
      {toggles.labels ? <Info lines={[`theta = ${fmt(angleBetween(u, v))} deg`, `base |u| = ${fmt(mag(u))}`, `height = ${fmt(height)}`, `|u x v| = area = ${fmt(area)}`, parallel(u, v) ? "parallel warning = area zero" : "parallel warning = no"]} /> : null}
    </Frame>
  );
}

export function UnitVectorNormalizationVisual({ values, toggles, onValueChange }: VisualState) {
  const v = vec(values.x, values.y);
  const normalized = normalize(v);
  return (
    <Frame label="Unit vectors and normalization">
      <Grid />
      <circle cx={origin.x} cy={origin.y} r={scalePx} fill="none" stroke={colors.guide} strokeWidth="4" strokeDasharray="8 8" />
      <Arrow from={zero} to={v} color={colors.u} label="v" />
      {normalized ? <Arrow from={zero} to={normalized} color={colors.result} label="v/|v|" /> : null}
      <EndpointHandle label="Drag vector endpoint" vector={v} onValueChange={onValueChange} xKey="x" yKey="y" />
      {toggles.labels ? <Info lines={[`v = (${fmt(v.x)}, ${fmt(v.y)})`, `|v| = ${fmt(mag(v))}`, `normalized = ${normalized ? `(${fmt(normalized.x)}, ${fmt(normalized.y)})` : "undefined"}`, `normalized magnitude = ${normalized ? fmt(mag(normalized)) : "undefined"}`, mag(v) < 0.001 ? "zero-vector warning = cannot normalize" : "zero-vector warning = no"]} /> : null}
    </Frame>
  );
}

export function VectorEquationLineVisual({ values, toggles, onValueChange }: VisualState) {
  const a = vec(values.ax, values.ay);
  const d = vec(values.dx, values.dy);
  const t = values.t;
  const td = scale(d, t);
  const r = add(a, td);
  return (
    <Frame label="Vector equation of a line">
      <Grid />
      <line x1={px(add(a, scale(d, -4))).x} y1={px(add(a, scale(d, -4))).y} x2={px(add(a, scale(d, 4))).x} y2={px(add(a, scale(d, 4))).y} stroke={colors.grid} strokeWidth="4" />
      <Arrow from={zero} to={a} color={colors.u} label="a" />
      <Arrow from={a} to={add(a, d)} color={colors.v} label="d" />
      <Arrow from={a} to={r} color={colors.result} label="td" />
      <circle cx={px(r).x} cy={px(r).y} r="10" fill={colors.guide} />
      <Text at={add(r, { x: 0.2, y: 0.25 })} text="r" />
      <EndpointHandle label="Drag start vector a" vector={a} onValueChange={onValueChange} xKey="ax" yKey="ay" />
      <EndpointHandle label="Drag direction vector d" vector={d} onValueChange={onValueChange} xKey="dx" yKey="dy" />
      {toggles.labels ? <Info lines={[`a = (${fmt(a.x)}, ${fmt(a.y)})`, `d = (${fmt(d.x)}, ${fmt(d.y)})`, `t = ${fmt(t)}`, `td = (${fmt(td.x)}, ${fmt(td.y)})`, `r = a+td = (${fmt(r.x)}, ${fmt(r.y)})`]} /> : null}
    </Frame>
  );
}

export function VectorProjectionComponentVisual({ values, toggles, onValueChange }: VisualState) {
  const u = vec(values.ux, values.uy);
  const v = vec(values.vx, values.vy);
  const p = projection(u, v);
  const residual = sub(u, p);
  return (
    <Frame label="Vector projection and perpendicular residual">
      <Grid />
      <line x1={px(scale(unit(v), -5)).x} y1={px(scale(unit(v), -5)).y} x2={px(scale(unit(v), 5)).x} y2={px(scale(unit(v), 5)).y} stroke={colors.grid} strokeWidth="4" strokeDasharray="8 8" />
      <ProjectionDrop from={u} to={p} />
      <RightAngle at={p} direction={v} residual={residual} />
      <Arrow from={zero} to={u} color={colors.u} label="u" />
      <Arrow from={zero} to={v} color={colors.v} label="v" />
      <Arrow from={zero} to={p} color={colors.projection} label="proj_v u" />
      <Arrow from={p} to={u} color={colors.residual} label="residual" />
      <EndpointHandle label="Drag u endpoint" vector={u} onValueChange={onValueChange} xKey="ux" yKey="uy" />
      <EndpointHandle label="Drag v endpoint" vector={v} onValueChange={onValueChange} xKey="vx" yKey="vy" />
      {toggles.labels ? <Info lines={[`u dot v = ${fmt(dot(u, v))}`, `|v|^2 = ${fmt(dot(v, v))}`, `scalar = ${fmt(projectionScalar(u, v))}`, `projection = (${fmt(p.x)}, ${fmt(p.y)})`, `residual = (${fmt(residual.x)}, ${fmt(residual.y)})`, `residual dot v = ${fmt(dot(residual, v))}`]} /> : null}
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
  const lines = [];
  for (let i = -5; i <= 5; i += 1) {
    lines.push(<line key={`x${i}`} x1={origin.x + i * scalePx} y1={origin.y - 190} x2={origin.x + i * scalePx} y2={origin.y + 190} stroke={colors.grid} />);
    lines.push(<line key={`y${i}`} x1={origin.x - 190} y1={origin.y - i * scalePx} x2={origin.x + 190} y2={origin.y - i * scalePx} stroke={colors.grid} />);
  }
  return <g>{lines}<line x1={origin.x - 205} y1={origin.y} x2={origin.x + 205} y2={origin.y} stroke="#94a3b8" strokeWidth="3" /><line x1={origin.x} y1={origin.y - 205} x2={origin.x} y2={origin.y + 205} stroke="#94a3b8" strokeWidth="3" /></g>;
}

function Arrow({ from, to, color, label, dashed = false }: { from: Vec; to: Vec; color: string; label: string; dashed?: boolean }) {
  const p1 = px(from);
  const p2 = px(to);
  return <g><line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={dashed ? "9 7" : undefined} /><circle cx={p2.x} cy={p2.y} r="8" fill={color} /><Text at={add(to, { x: 0.15, y: 0.18 })} text={label} /></g>;
}

function ComponentGuide({ vector }: { vector: Vec }) {
  return <g><line x1={px(zero).x} y1={px(zero).y} x2={px({ x: vector.x, y: 0 }).x} y2={px({ x: vector.x, y: 0 }).y} stroke={colors.guide} strokeWidth="4" strokeDasharray="7 6" /><line x1={px({ x: vector.x, y: 0 }).x} y1={px({ x: vector.x, y: 0 }).y} x2={px(vector).x} y2={px(vector).y} stroke={colors.guide} strokeWidth="4" strokeDasharray="7 6" /></g>;
}

function Parallelogram({ u, v, filled = false }: { u: Vec; v: Vec; filled?: boolean }) {
  const sum = add(u, v);
  return <polygon points={`${px(zero).x},${px(zero).y} ${px(u).x},${px(u).y} ${px(sum).x},${px(sum).y} ${px(v).x},${px(v).y}`} fill={filled ? colors.projection : "none"} opacity={filled ? "0.28" : "1"} stroke={colors.guide} strokeWidth="3" strokeDasharray="8 8" />;
}

function ProjectionDrop({ from, to }: { from: Vec; to: Vec }) {
  return <line x1={px(from).x} y1={px(from).y} x2={px(to).x} y2={px(to).y} stroke={colors.residual} strokeWidth="4" strokeDasharray="6 6" />;
}

function HeightGuide({ u, v }: { u: Vec; v: Vec }) {
  const foot = projection(v, u);
  return <g><ProjectionDrop from={v} to={foot} /><Text at={mid(v, foot)} text="height" /></g>;
}

function AngleArc({ vector, second, label }: { vector: Vec; second?: Vec; label: string }) {
  const a = unit(vector);
  const b = second ? unit(second) : { x: 1, y: 0 };
  const p1 = px(scale(b, 1.2));
  const p2 = px(scale(a, 1.2));
  return <g><path d={`M ${p1.x} ${p1.y} Q ${origin.x + 40} ${origin.y - 40} ${p2.x} ${p2.y}`} fill="none" stroke={colors.guide} strokeWidth="3" /><text x={origin.x + 48} y={origin.y - 24} className="fill-amber-100 text-sm font-black">{label}</text></g>;
}

function RightAngle({ at, direction, residual }: { at: Vec; direction: Vec; residual: Vec }) {
  const a = add(at, scale(unit(direction), 0.35));
  const b = add(a, scale(unit(residual), 0.35));
  const c = add(at, scale(unit(residual), 0.35));
  return <polyline points={`${px(a).x},${px(a).y} ${px(b).x},${px(b).y} ${px(c).x},${px(c).y}`} fill="none" stroke={colors.guide} strokeWidth="3" />;
}

function EndpointHandle({ label, vector, onValueChange, xKey, yKey }: { label: string; vector: Vec; onValueChange: (id: string, value: number) => void; xKey: string; yKey: string }) {
  return <DraggableHandle label={label} position={px(vector)} bounds={{ x: [origin.x - 190, origin.x + 190], y: [origin.y - 190, origin.y + 190] }} onChange={(point) => { const next = unpx(point); onValueChange(xKey, next.x); onValueChange(yKey, next.y); }} />;
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="585" y="105" width="292" height={Math.max(90, lines.length * 25 + 34)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="604" y={136 + index * 24} className="fill-slate-100 text-sm font-bold">{line}</text>)}</g>;
}

function Text({ at, text }: { at: Vec; text: string }) {
  const p = px(at);
  return <text x={p.x} y={p.y} className="fill-white text-sm font-black">{text}</text>;
}

const origin = { x: 285, y: 295 };
const scalePx = 38;
const zero = { x: 0, y: 0 };

function px(vector: Vec) {
  return { x: origin.x + vector.x * scalePx, y: origin.y - vector.y * scalePx };
}

function unpx(point: Vec) {
  return { x: Number(((point.x - origin.x) / scalePx).toFixed(2)), y: Number(((origin.y - point.y) / scalePx).toFixed(2)) };
}

function vec(x: number, y: number): Vec { return { x, y }; }
function add(a: Vec, b: Vec): Vec { return { x: a.x + b.x, y: a.y + b.y }; }
function sub(a: Vec, b: Vec): Vec { return { x: a.x - b.x, y: a.y - b.y }; }
function scale(a: Vec, k: number): Vec { return { x: a.x * k, y: a.y * k }; }
function dot(a: Vec, b: Vec) { return a.x * b.x + a.y * b.y; }
function cross(a: Vec, b: Vec) { return a.x * b.y - a.y * b.x; }
function mag(a: Vec) { return Math.hypot(a.x, a.y); }
function unit(a: Vec) { const length = mag(a); return length ? scale(a, 1 / length) : { x: 1, y: 0 }; }
function normalize(a: Vec) { const length = mag(a); return length < 0.001 ? null : scale(a, 1 / length); }
function projectionScalar(u: Vec, v: Vec) { return dot(v, v) ? dot(u, v) / dot(v, v) : 0; }
function projection(u: Vec, v: Vec) { return scale(v, projectionScalar(u, v)); }
function angleDeg(a: Vec) { return Math.atan2(a.y, a.x) * 180 / Math.PI; }
function cosBetween(a: Vec, b: Vec) { const length = mag(a) * mag(b); return length ? dot(a, b) / length : 0; }
function angleBetween(a: Vec, b: Vec) { return Math.acos(Math.max(-1, Math.min(1, cosBetween(a, b)))) * 180 / Math.PI; }
function quadrant(a: Vec) {
  if (Math.abs(a.x) < 0.001 && Math.abs(a.y) < 0.001) return "origin";
  if (Math.abs(a.x) < 0.001) return "y-axis";
  if (Math.abs(a.y) < 0.001) return "x-axis";
  return a.x > 0 && a.y > 0 ? "I" : a.x < 0 && a.y > 0 ? "II" : a.x < 0 && a.y < 0 ? "III" : "IV";
}
function directionStatus(k: number, v: Vec) {
  if (Math.abs(k) < 0.001 || mag(v) < 0.001) return "zero";
  return k > 0 ? "same" : "reversed";
}
function dotSign(value: number) { return Math.abs(value) < 0.001 ? "zero" : value > 0 ? "positive" : "negative"; }
function parallel(a: Vec, b: Vec) { return Math.abs(cross(a, b)) < 0.001; }
function mid(a: Vec, b: Vec) { return scale(add(a, b), 0.5); }
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
