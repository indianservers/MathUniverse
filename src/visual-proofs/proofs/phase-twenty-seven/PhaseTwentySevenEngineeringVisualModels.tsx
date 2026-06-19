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
  graph: "#38bdf8",
  accent: "#f97316",
  guide: "#facc15",
  image: "#22c55e",
  purple: "#a78bfa",
  red: "#fb7185",
  axis: "#94a3b8",
  panel: "#0f172a",
};

export function SlopeFieldDifferentialEquationVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const mode = Math.round(values.mode);
  const start = p(values.x0, values.y0);
  const h = values.h;
  const curve = eulerCurve(start, mode, h, 18);
  const localSlope = slopeAt(start.x, start.y, mode);
  const next = p(start.x + h, start.y + h * localSlope);
  return (
    <Frame label="First-order differential equation" showing={`Showing slope field for ${odeName(mode)} with initial condition ${pt(start)}`}>
      <Grid />
      {gridPoints(-5, 5, -3, 3, 1).map((q) => <SlopeMark key={`${q.x}-${q.y}`} point={q} slope={slopeAt(q.x, q.y, mode)} active={activeHighlight === "dy-dx" || activeHighlight === "fxy"} />)}
      <Polyline points={curve} color={activeHighlight === "solution-curve" ? colors.guide : colors.image} width={5} />
      <Arrow from={start} to={next} color={activeHighlight === "dy-dx" ? colors.guide : colors.accent} label="local slope" />
      <PointMark point={start} color={activeHighlight === "initial-condition" ? colors.guide : colors.red} label="(x0,y0)" />
      <DraggableHandle label="Drag initial condition" position={sp(start)} bounds={bounds()} onChange={(nextPoint) => { const q = unsp(nextPoint); onValueChange("x0", q.x); onValueChange("y0", q.y); }} />
      {toggles.labels ? <Info lines={[`displaying: ${odeName(mode)}`, `initial condition = ${pt(start)}`, `local slope = ${fmt(localSlope)}`, `step size h = ${fmt(h)}`, `next point = ${pt(next)}`, "insight: solution follows local slopes"]} /> : null}
    </Frame>
  );
}

export function SimpleHarmonicMotionVisual({ values, toggles, activeHighlight }: VisualState) {
  const A = values.amplitude;
  const omega = values.omega;
  const phi = values.phase;
  const t = values.t;
  const x = A * Math.cos(omega * t + phi);
  const period = (2 * Math.PI) / omega;
  const wave = range(0, 6.28, 0.08).map((time) => p(time, A * Math.cos(omega * time + phi)));
  return (
    <Frame label="Simple harmonic motion" showing={`Showing oscillator and cosine graph at t=${fmt(t)}, x(t)=${fmt(x)}`}>
      <Axes xLabel="time" yLabel="x(t)" />
      <Polyline points={wave.map((q) => graphPoint(q.x, q.y, 0, 6.3, -3.2, 3.2))} color={activeHighlight === "cos" ? colors.guide : colors.graph} width={4} raw />
      <line x1={gx(t, 0, 6.3)} y1={gy(-3.2, -3.2, 3.2)} x2={gx(t, 0, 6.3)} y2={gy(3.2, -3.2, 3.2)} stroke={activeHighlight === "x-t" ? colors.guide : colors.red} strokeWidth="3" />
      <circle cx={gx(t, 0, 6.3)} cy={gy(x, -3.2, 3.2)} r="8" fill={colors.red} />
      <SpringMass x={x} active={activeHighlight} />
      {toggles.labels ? <Info lines={[`A = ${fmt(A)} maximum displacement`, `omega = ${fmt(omega)}`, `phase phi = ${fmt(phi)}`, `t = ${fmt(t)}`, `x(t) = ${fmt(x)}`, `period T = ${fmt(period)}`, `range = [-${fmt(A)}, ${fmt(A)}]`]} /> : null}
    </Frame>
  );
}

export function FourierWaveBuildingVisual({ values, toggles, activeHighlight }: VisualState) {
  const harmonics = Math.round(values.harmonics);
  const t = values.t;
  const targetMode = Math.round(values.target);
  const points = range(0, Math.PI * 2, 0.07).map((x) => p(x, fourierValue(x, harmonics, targetMode)));
  const target = range(0, Math.PI * 2, 0.07).map((x) => p(x, targetWave(x, targetMode)));
  const current = fourierValue(t, harmonics, targetMode);
  const goal = targetWave(t, targetMode);
  return (
    <Frame label="Fourier series as wave building" showing={`Showing ${targetName(targetMode)} approximation using ${harmonics} harmonic terms`}>
      <Axes xLabel="t" yLabel="signal" />
      <Polyline points={target.map((q) => graphPoint(q.x, q.y, 0, 6.3, -1.5, 1.5))} color={activeHighlight === "approximation" ? colors.guide : colors.red} width={3} raw dash />
      <Polyline points={points.map((q) => graphPoint(q.x, q.y, 0, 6.3, -1.5, 1.5))} color={activeHighlight === "sum" ? colors.guide : colors.image} width={5} raw />
      <HarmonicBars count={harmonics} active={activeHighlight === "harmonic" || activeHighlight === "n"} />
      {toggles.labels ? <Info lines={[`target = ${targetName(targetMode)}`, `harmonics included = ${harmonics}`, `current t = ${fmt(t)}`, `summed value = ${fmt(current)}`, `target value = ${fmt(goal)}`, `error at t = ${fmt(Math.abs(goal - current))}`, "insight: more terms improve the waveform"]} /> : null}
    </Frame>
  );
}

export function LaplaceDecaySystemVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = values.a;
  const t = values.t;
  const s = values.s;
  const time = range(0, 5, 0.06).map((x) => p(x, Math.exp(-a * x)));
  const timeValue = Math.exp(-a * t);
  const transformValue = 1 / (s + a);
  return (
    <Frame label="Laplace transform decay system" showing={`Showing time-domain e^(-at) and s-domain 1/(s+a) for a=${fmt(a)}`}>
      <Axes xLabel="t" yLabel="e^(-at)" />
      <Polyline points={time.map((q) => graphPoint(q.x, q.y, 0, 5, 0, 1.1))} color={activeHighlight === "e-minus-at" ? colors.guide : colors.graph} width={5} raw />
      <circle cx={gx(t, 0, 5)} cy={gy(timeValue, 0, 1.1)} r="8" fill={colors.red} />
      <TransformPanel active={activeHighlight} lines={["time domain", `e^(-${fmt(a)}t)`, "Laplace L{}", "s domain", `1/(s+${fmt(a)})`, `at s=${fmt(s)} -> ${fmt(transformValue)}`]} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)} decay rate`, `selected t = ${fmt(t)}`, `time value = ${fmt(timeValue)}`, `selected s = ${fmt(s)}`, `transform value = ${fmt(transformValue)}`, "insight: transform changes viewpoint"]} /> : null}
    </Frame>
  );
}

export function GradientSteepestIncreaseVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const point = p(values.x, values.y);
  const gradient = p(2 * point.x, 2 * point.y);
  const directionAngle = values.direction;
  const unit = p(Math.cos(directionAngle), Math.sin(directionAngle));
  const derivative = gradient.x * unit.x + gradient.y * unit.y;
  return (
    <Frame label="Gradient and steepest increase" showing={`Showing contour map for f=x^2+y^2 at point ${pt(point)}`}>
      <Grid />
      {[1, 2, 3, 4].map((r) => <circle key={r} cx={sx(0)} cy={sy(0)} r={r * scale} fill="none" stroke={activeHighlight === "contour" ? colors.guide : "#334155"} strokeWidth="3" />)}
      <Arrow from={point} to={p(point.x + gradient.x / 3, point.y + gradient.y / 3)} color={activeHighlight === "gradient" || activeHighlight === "steepest-increase" ? colors.guide : colors.image} label="grad f" />
      <Arrow from={point} to={p(point.x + unit.x, point.y + unit.y)} color={colors.purple} label="direction" />
      <PointMark point={point} color={colors.red} label="P" />
      <DraggableHandle label="Drag contour point" position={sp(point)} bounds={bounds()} onChange={(nextPoint) => { const q = unsp(nextPoint); onValueChange("x", q.x); onValueChange("y", q.y); }} />
      {toggles.labels ? <Info lines={[`point = ${pt(point)}`, `f(x,y) = ${fmt(point.x ** 2 + point.y ** 2)}`, `df/dx = ${fmt(gradient.x)}`, `df/dy = ${fmt(gradient.y)}`, `|grad f| = ${fmt(Math.hypot(gradient.x, gradient.y))}`, `directional derivative = ${fmt(derivative)}`, "invariant: gradient points uphill"]} /> : null}
    </Frame>
  );
}

export function DivergenceCurlVectorFieldVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const mode = Math.round(values.field);
  const point = p(values.x, values.y);
  const div = divergence(mode);
  const curl = curlValue(mode);
  return (
    <Frame label="Divergence and curl intuition" showing={`Showing ${fieldName(mode)} around test region ${pt(point)}`}>
      <Grid />
      {gridPoints(-5, 5, -3, 3, 1.2).map((q) => <VectorArrow key={`${q.x}-${q.y}`} from={q} vector={fieldAt(q, mode)} active={activeHighlight === "div-f" || activeHighlight === "curl-f"} />)}
      <circle cx={sx(point.x)} cy={sy(point.y)} r="38" fill="none" stroke={activeHighlight === "div-f" ? colors.guide : colors.red} strokeWidth="4" strokeDasharray="8 6" />
      {mode === 2 ? <path d={`M ${sx(point.x - 0.8)} ${sy(point.y)} A 28 28 0 1 1 ${sx(point.x + 0.8)} ${sy(point.y)}`} fill="none" stroke={activeHighlight === "curl-f" ? colors.guide : colors.purple} strokeWidth="4" /> : null}
      <DraggableHandle label="Drag test region" position={sp(point)} bounds={bounds()} onChange={(nextPoint) => { const q = unsp(nextPoint); onValueChange("x", q.x); onValueChange("y", q.y); }} />
      {toggles.labels ? <Info lines={[`selected field = ${fieldName(mode)}`, `point = ${pt(point)}`, `approx divergence = ${fmt(div)}`, `approx curl = ${fmt(curl)}`, `status = ${fieldStatus(mode)}`, "insight: divergence spreads, curl spins"]} /> : null}
    </Frame>
  );
}

export function TrapezoidalRuleNumericalIntegrationVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = Math.min(values.a, values.b - 0.5);
  const b = values.b;
  const n = Math.round(values.n);
  const mode = Math.round(values.func);
  const h = (b - a) / n;
  const xs = Array.from({ length: n + 1 }, (_, index) => a + index * h);
  const approx = trapezoidApprox(a, b, n, mode);
  const reference = referenceArea(a, b, mode);
  return (
    <Frame label="Trapezoidal rule numerical integration" showing={`Showing ${n} trapezoids on [${fmt(a)}, ${fmt(b)}] for ${funcName(mode)}`}>
      <Axes xLabel="x" yLabel="f(x)" />
      {xs.slice(0, -1).map((x, index) => <Trapezoid key={x} x0={x} x1={xs[index + 1]} mode={mode} active={activeHighlight === "trapezoid-areas" || activeHighlight === "two-fi"} />)}
      <Polyline points={range(a, b, 0.04).map((x) => graphPoint(x, f(x, mode), -3, 4, -1, 5))} color={colors.graph} width={5} raw />
      {toggles.labels ? <Info lines={[`a,b = ${fmt(a)}, ${fmt(b)}`, `n = ${n}`, `h = ${fmt(h)}`, `heights = ${xs.map((x) => fmt(f(x, mode))).join(", ")}`, `approximation = ${fmt(approx)}`, `reference area = ${fmt(reference)}`, `error = ${fmt(Math.abs(reference - approx))}`]} /> : null}
    </Frame>
  );
}

export function LinearProgrammingFeasibleRegionVisual({ values, toggles, activeHighlight }: VisualState) {
  const objectiveA = values.objA;
  const objectiveB = values.objB;
  const level = values.level;
  const vertices = [p(0, 0), p(4, 0), p(3, 2), p(1, 3), p(0, 2)];
  const scored = vertices.map((v) => ({ point: v, value: objectiveA * v.x + objectiveB * v.y }));
  const best = scored.reduce((max, item) => item.value > max.value ? item : max, scored[0]);
  return (
    <Frame label="Linear programming feasible region" showing={`Showing feasible region and objective ${fmt(objectiveA)}x + ${fmt(objectiveB)}y = z`}>
      <Grid />
      <polygon points={vertices.map((v) => `${sx(v.x)},${sy(v.y)}`).join(" ")} fill={activeHighlight === "feasible-region" ? colors.guide : colors.image} opacity="0.28" stroke={colors.image} strokeWidth="4" />
      <line x1={sx(0)} y1={sy(4)} x2={sx(4)} y2={sy(0)} stroke={activeHighlight === "constraints" ? colors.guide : colors.red} strokeWidth="3" strokeDasharray="8 6" />
      <line x1={sx(1)} y1={sy(3)} x2={sx(5)} y2={sy(1)} stroke={activeHighlight === "constraints" ? colors.guide : colors.red} strokeWidth="3" strokeDasharray="8 6" />
      <ObjectiveLine a={objectiveA} b={objectiveB} level={level} active={activeHighlight === "objective"} />
      {vertices.map((v) => <PointMark key={`${v.x}-${v.y}`} point={v} color={samePoint(v, best.point) || activeHighlight === "vertex" ? colors.guide : colors.purple} label={fmt(objectiveA * v.x + objectiveB * v.y)} />)}
      {toggles.labels ? <Info lines={["constraints: x>=0, y>=0, x+y<=4, x+2y<=7", `vertices = ${vertices.map(pt).join(" ")}`, `objective coefficients = ${fmt(objectiveA)}, ${fmt(objectiveB)}`, `best vertex = ${pt(best.point)}`, `best value = ${fmt(best.value)}`, "bounded status = bounded", "insight: optimum occurs at a vertex"]} /> : null}
    </Frame>
  );
}

function Frame({ label, showing, children }: { label: string; showing: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={`${label}. ${showing}`} className="h-auto min-h-[320px] w-full max-w-full">
        <rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />
        <text x="58" y="62" className="fill-white text-xl font-black">{label}</text>
        <text x="58" y="88" className="fill-cyan-100 text-sm font-bold">{showing}</text>
        {children}
      </svg>
    </div>
  );
}

function Grid() {
  return (
    <g>
      {range(-6, 6, 1).map((v) => <line key={`x${v}`} x1={sx(v)} y1={sy(-4)} x2={sx(v)} y2={sy(4)} stroke="#1e293b" />)}
      {range(-4, 4, 1).map((v) => <line key={`y${v}`} x1={sx(-6)} y1={sy(v)} x2={sx(6)} y2={sy(v)} stroke="#1e293b" />)}
      <line x1={sx(-6)} y1={sy(0)} x2={sx(6)} y2={sy(0)} stroke={colors.axis} strokeWidth="3" />
      <line x1={sx(0)} y1={sy(-4)} x2={sx(0)} y2={sy(4)} stroke={colors.axis} strokeWidth="3" />
    </g>
  );
}

function Axes({ xLabel, yLabel }: { xLabel: string; yLabel: string }) {
  return (
    <g>
      <line x1="78" y1="430" x2="540" y2="430" stroke={colors.axis} strokeWidth="3" />
      <line x1="78" y1="430" x2="78" y2="120" stroke={colors.axis} strokeWidth="3" />
      <Text x={518} y={456} text={xLabel} />
      <Text x={48} y={128} text={yLabel} />
    </g>
  );
}

function Polyline({ points, color, width, raw = false, dash = false }: { points: Point[]; color: string; width: number; raw?: boolean; dash?: boolean }) {
  const list = points.map((q) => raw ? `${q.x},${q.y}` : `${sx(q.x)},${sy(q.y)}`).join(" ");
  return <polyline points={list} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash ? "8 6" : undefined} strokeLinejoin="round" strokeLinecap="round" />;
}

function Arrow({ from, to, color, label }: { from: Point; to: Point; color: string; label?: string }) {
  return <g><line x1={sx(from.x)} y1={sy(from.y)} x2={sx(to.x)} y2={sy(to.y)} stroke={color} strokeWidth="4" markerEnd="url(#p27-arrow)" /><defs><marker id="p27-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={color} /></marker></defs>{label ? <Text x={sx(to.x) + 8} y={sy(to.y) - 8} text={label} /> : null}</g>;
}

function VectorArrow({ from, vector, active }: { from: Point; vector: Point; active: boolean }) {
  const len = Math.hypot(vector.x, vector.y) || 1;
  return <Arrow from={from} to={p(from.x + vector.x / len * 0.45, from.y + vector.y / len * 0.45)} color={active ? colors.guide : colors.graph} />;
}

function SlopeMark({ point, slope, active }: { point: Point; slope: number; active: boolean }) {
  const dx = 0.32;
  const dy = Math.max(-0.5, Math.min(0.5, slope * dx));
  return <line x1={sx(point.x - dx)} y1={sy(point.y - dy)} x2={sx(point.x + dx)} y2={sy(point.y + dy)} stroke={active ? colors.guide : colors.graph} strokeWidth="3" strokeLinecap="round" />;
}

function PointMark({ point, color, label }: { point: Point; color: string; label: string }) {
  return <g><circle cx={sx(point.x)} cy={sy(point.y)} r="8" fill={color} stroke="#0f172a" strokeWidth="2" /><Text x={sx(point.x) + 9} y={sy(point.y) - 8} text={label} /></g>;
}

function SpringMass({ x, active }: { x: number; active: string | null }) {
  const baseX = 115;
  const massX = baseX + 100 + x * 28;
  const spring = Array.from({ length: 9 }, (_, index) => `${baseX + index * 12},${250 + (index % 2 ? -18 : 18)}`).join(" ");
  return (
    <g>
      <line x1={baseX - 35} y1="250" x2={baseX} y2="250" stroke={colors.axis} strokeWidth="5" />
      <polyline points={`${baseX - 5},250 ${spring} ${massX - 35},250`} fill="none" stroke={active === "omega" ? colors.guide : colors.purple} strokeWidth="4" />
      <rect x={massX - 32} y="218" width="64" height="64" rx="10" fill={active === "a" || active === "x-t" ? colors.guide : colors.accent} opacity="0.9" />
      <line x1={baseX + 100} y1="315" x2={massX} y2="315" stroke={colors.image} strokeWidth="4" />
      <Text x={massX - 20} y={210} text="mass" />
    </g>
  );
}

function HarmonicBars({ count, active }: { count: number; active: boolean }) {
  return <g>{Array.from({ length: count }, (_, index) => <rect key={index} x={92 + index * 26} y={470 - 12 * (index + 1)} width="16" height={12 * (index + 1)} fill={active ? colors.guide : colors.purple} opacity="0.8" />)}<Text x={88} y={494} text="harmonic weights" /></g>;
}

function TransformPanel({ active, lines }: { active: string | null; lines: string[] }) {
  return <g><rect x="585" y="128" width="240" height="178" rx="16" fill={active === "laplace" || active === "s-domain" ? "#713f12" : colors.panel} stroke="#334155" />{lines.map((line, index) => <Text key={line} x={608} y={162 + index * 24} text={line} />)}</g>;
}

function Trapezoid({ x0, x1, mode, active }: { x0: number; x1: number; mode: number; active: boolean }) {
  const y0 = f(x0, mode);
  const y1 = f(x1, mode);
  const baseY = gy(0, -1, 5);
  const points = `${gx(x0, -3, 4)},${baseY} ${gx(x0, -3, 4)},${gy(y0, -1, 5)} ${gx(x1, -3, 4)},${gy(y1, -1, 5)} ${gx(x1, -3, 4)},${baseY}`;
  return <polygon points={points} fill={active ? colors.guide : colors.image} opacity="0.22" stroke={colors.image} strokeWidth="2" />;
}

function ObjectiveLine({ a, b, level, active }: { a: number; b: number; level: number; active: boolean }) {
  const y0 = level / b;
  const y1 = (level - a * 5) / b;
  return <line x1={sx(0)} y1={sy(y0)} x2={sx(5)} y2={sy(y1)} stroke={active ? colors.guide : colors.accent} strokeWidth="5" />;
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="580" y="112" width="286" height={Math.max(105, lines.length * 22 + 34)} rx="14" fill={colors.panel} stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="596" y={142 + index * 21} className="fill-slate-100 text-xs font-bold">{line}</text>)}</g>;
}
function Text({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} className="fill-white text-sm font-black">{text}</text>;
}

const origin = { x: 310, y: 296 };
const scale = 38;
function sx(x: number) { return origin.x + x * scale; }
function sy(y: number) { return origin.y - y * scale; }
function sp(point: Point) { return { x: sx(point.x), y: sy(point.y) }; }
function unsp(point: { x: number; y: number }) { return p((point.x - origin.x) / scale, (origin.y - point.y) / scale); }
function bounds(): { x: [number, number]; y: [number, number] } { return { x: [sx(-6), sx(6)], y: [sy(4), sy(-4)] }; }
function gx(x: number, min: number, max: number) { return 78 + ((x - min) / (max - min)) * 462; }
function gy(y: number, min: number, max: number) { return 430 - ((y - min) / (max - min)) * 310; }
function graphPoint(x: number, y: number, minX: number, maxX: number, minY: number, maxY: number) { return p(gx(x, minX, maxX), gy(y, minY, maxY)); }
function p(x: number, y: number): Point { return { x, y }; }
function pt(q: Point) { return `(${fmt(q.x)}, ${fmt(q.y)})`; }
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
function range(start: number, end: number, step: number) {
  const values: number[] = [];
  for (let value = start; value <= end + 0.0001; value += step) values.push(Number(value.toFixed(3)));
  return values;
}
function gridPoints(minX: number, maxX: number, minY: number, maxY: number, step: number) {
  return range(minX, maxX, step).flatMap((x) => range(minY, maxY, step).map((y) => p(x, y)));
}

function slopeAt(x: number, y: number, mode: number) { return mode === 0 ? y : x - y; }
function odeName(mode: number) { return mode === 0 ? "dy/dx = y" : "dy/dx = x - y"; }
function eulerCurve(start: Point, mode: number, h: number, steps: number) {
  const points = [start];
  let current = start;
  for (let index = 0; index < steps; index += 1) {
    current = p(current.x + h, current.y + h * slopeAt(current.x, current.y, mode));
    if (current.x > 5.5 || current.y > 4 || current.y < -4) break;
    points.push(current);
  }
  return points;
}
function fourierValue(x: number, harmonics: number, mode: number) {
  let sum = 0;
  for (let index = 0; index < harmonics; index += 1) {
    const k = mode === 0 ? 2 * index + 1 : index + 1;
    sum += mode === 0 ? (4 / Math.PI) * Math.sin(k * x) / k : (8 / Math.PI ** 2) * ((index % 2 === 0 ? 1 : -1) * Math.sin(k * x) / (k * k));
  }
  return sum;
}
function targetWave(x: number, mode: number) { return mode === 0 ? (Math.sin(x) >= 0 ? 1 : -1) : (2 / Math.PI) * Math.asin(Math.sin(x)); }
function targetName(mode: number) { return mode === 0 ? "square wave" : "triangle wave"; }
function fieldAt(q: Point, mode: number) {
  if (mode === 0) return p(q.x, q.y);
  if (mode === 1) return p(-q.x, -q.y);
  if (mode === 2) return p(-q.y, q.x);
  return p(1, 0);
}
function fieldName(mode: number) { return ["source field", "sink field", "rotation field", "uniform field"][mode] ?? "source field"; }
function fieldStatus(mode: number) { return ["source / positive divergence", "sink / negative divergence", "rotation / positive curl", "near-zero div and curl"][mode] ?? "source"; }
function divergence(mode: number) { return mode === 0 ? 2 : mode === 1 ? -2 : 0; }
function curlValue(mode: number) { return mode === 2 ? 2 : 0; }
function f(x: number, mode: number) { return mode === 0 ? 0.25 * x * x + 1 : 2 + Math.sin(x); }
function funcName(mode: number) { return mode === 0 ? "f(x)=x^2/4+1" : "f(x)=2+sin(x)"; }
function trapezoidApprox(a: number, b: number, n: number, mode: number) {
  const h = (b - a) / n;
  let sum = f(a, mode) + f(b, mode);
  for (let index = 1; index < n; index += 1) sum += 2 * f(a + index * h, mode);
  return (h / 2) * sum;
}
function referenceArea(a: number, b: number, mode: number) {
  if (mode === 0) return (b ** 3 - a ** 3) / 12 + (b - a);
  return 2 * (b - a) - Math.cos(b) + Math.cos(a);
}
function samePoint(a: Point, b: Point) { return Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001; }
