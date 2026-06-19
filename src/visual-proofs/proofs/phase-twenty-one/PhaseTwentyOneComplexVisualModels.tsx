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

type Complex = { re: number; im: number };

const colors = {
  z: "#38bdf8",
  w: "#f97316",
  result: "#22c55e",
  polar: "#fde68a",
  reflection: "#a855f7",
  residual: "#fb7185",
  grid: "#334155",
};

export function ComplexPlanePointVisual({ values, toggles, onValueChange }: VisualState) {
  const z = c(values.a, values.b);
  return (
    <Frame label="Complex number as a point on the plane">
      <Plane />
      <ComponentGuides z={z} />
      <ComplexArrow z={z} color={colors.z} label="z=a+bi" />
      <PointHandle label="Drag z" z={z} onValueChange={onValueChange} reKey="a" imKey="b" />
      {toggles.labels ? <Info lines={[`real part a = ${fmt(z.re)}`, `imaginary part b = ${fmt(z.im)}`, `point = (${fmt(z.re)}, ${fmt(z.im)})`, `quadrant = ${quadrant(z)}`, "invariant = z maps to (a,b)"]} /> : null}
    </Frame>
  );
}

export function ModulusArgumentVisual({ values, toggles, onValueChange }: VisualState) {
  const z = c(values.a, values.b);
  return (
    <Frame label="Complex modulus and argument">
      <Plane />
      <ComponentGuides z={z} triangle />
      <AngleArc z={z} label="theta" />
      <ComplexArrow z={z} color={colors.z} label="z" />
      <PointHandle label="Drag z" z={z} onValueChange={onValueChange} reKey="a" imKey="b" />
      {toggles.labels ? <Info lines={[`a = ${fmt(z.re)}`, `b = ${fmt(z.im)}`, `|z| = ${fmt(mod(z))}`, `arg(z) = ${fmt(argDeg(z))} deg`, `arg(z) = ${fmt(argRad(z))} rad`, `quadrant = ${quadrant(z)}`]} /> : null}
    </Frame>
  );
}

export function ComplexAdditionVisual({ values, toggles, onValueChange }: VisualState) {
  const z1 = c(values.a, values.b);
  const z2 = c(values.c, values.d);
  const sum = add(z1, z2);
  return (
    <Frame label="Complex addition as vector addition">
      <Plane />
      <Parallelogram z1={z1} z2={z2} />
      <ComplexArrow z={z1} color={colors.z} label="z1" />
      <ComplexArrow from={z1} z={sum} color={colors.w} label="z2 moved" dashed />
      <ComplexArrow z={z2} color={colors.w} label="z2" />
      <ComplexArrow z={sum} color={colors.result} label="z1+z2" />
      <PointHandle label="Drag z1" z={z1} onValueChange={onValueChange} reKey="a" imKey="b" />
      <PointHandle label="Drag z2" z={z2} onValueChange={onValueChange} reKey="c" imKey="d" />
      {toggles.labels ? <Info lines={[`z1 = ${complex(z1)}`, `z2 = ${complex(z2)}`, `sum = ${complex(sum)}`, `|sum| = ${fmt(mod(sum))}`, `arg(sum) = ${fmt(argDeg(sum))} deg`]} /> : null}
    </Frame>
  );
}

export function ComplexMultiplicationVisual({ values, toggles, onValueChange }: VisualState) {
  const z1 = c(values.a, values.b);
  const z2 = c(values.c, values.d);
  const product = multiply(z1, z2);
  return (
    <Frame label="Complex multiplication as rotation and scaling">
      <Plane />
      <AngleArc z={z1} label="theta1" radius={1.1} />
      <AngleArc z={z2} label="theta2" radius={1.55} />
      <AngleArc z={product} label="theta1+theta2" radius={2.05} />
      <ComplexArrow z={z1} color={colors.z} label="z1" />
      <ComplexArrow z={z2} color={colors.w} label="z2" />
      <ComplexArrow z={product} color={colors.result} label="z1z2" />
      <PointHandle label="Drag z1" z={z1} onValueChange={onValueChange} reKey="a" imKey="b" />
      <PointHandle label="Drag z2" z={z2} onValueChange={onValueChange} reKey="c" imKey="d" />
      {toggles.labels ? <Info lines={[`r1 = ${fmt(mod(z1))}`, `theta1 = ${fmt(argDeg(z1))} deg`, `r2 = ${fmt(mod(z2))}`, `theta2 = ${fmt(argDeg(z2))} deg`, `product modulus = ${fmt(mod(product))}`, `product arg = ${fmt(argDeg(product))} deg`, `product = ${complex(product)}`]} /> : null}
    </Frame>
  );
}

export function MultiplicationByIVisual({ values, toggles, onValueChange }: VisualState) {
  const z = c(values.a, values.b);
  const iz = c(-z.im, z.re);
  return (
    <Frame label="Multiplication by i as 90 degree rotation">
      <Plane />
      <AngleArc z={z} label="arg z" radius={1.1} />
      <path d={`M ${px(z).x} ${px(z).y} Q ${origin.x - 50} ${origin.y - 50} ${px(iz).x} ${px(iz).y}`} fill="none" stroke={colors.polar} strokeWidth="4" strokeDasharray="8 8" />
      <ComplexArrow z={z} color={colors.z} label="z" />
      <ComplexArrow z={iz} color={colors.result} label="iz" />
      <PointHandle label="Drag z" z={z} onValueChange={onValueChange} reKey="a" imKey="b" />
      {toggles.labels ? <Info lines={[`z = ${complex(z)}`, `iz = ${complex(iz)}`, `(a,b) -> (-b,a)`, `arg z = ${fmt(argDeg(z))} deg`, `arg iz = ${fmt(argDeg(iz))} deg`, `|z| = |iz| = ${fmt(mod(z))}`]} /> : null}
    </Frame>
  );
}

export function ComplexConjugateVisual({ values, toggles, onValueChange }: VisualState) {
  const z = c(values.a, values.b);
  const zbar = c(z.re, -z.im);
  return (
    <Frame label="Complex conjugate as reflection">
      <Plane />
      <line x1={origin.x - 205} y1={origin.y} x2={origin.x + 205} y2={origin.y} stroke={colors.polar} strokeWidth="5" strokeDasharray="8 8" />
      <line x1={px(z).x} y1={px(z).y} x2={px(zbar).x} y2={px(zbar).y} stroke={colors.reflection} strokeWidth="4" strokeDasharray="6 6" />
      <ComplexArrow z={z} color={colors.z} label="z" />
      <ComplexArrow z={zbar} color={colors.reflection} label="zbar" />
      <PointHandle label="Drag z" z={z} onValueChange={onValueChange} reKey="a" imKey="b" />
      {toggles.labels ? <Info lines={[`z = ${complex(z)}`, `zbar = ${complex(zbar)}`, `real part = ${fmt(z.re)} unchanged`, `imaginary sign flips`, `z zbar = ${fmt(mod(z) ** 2)}`, `|z|^2 = ${fmt(mod(z) ** 2)}`]} /> : null}
    </Frame>
  );
}

export function RootsOfUnityVisual({ values, toggles }: VisualState) {
  const n = Math.round(values.n);
  const k = Math.max(0, Math.min(n - 1, Math.round(values.k)));
  const roots = Array.from({ length: n }, (_, index) => cis((2 * Math.PI * index) / n));
  const selected = roots[k];
  return (
    <Frame label="Roots of unity on the unit circle">
      <Plane unitCircle />
      <polygon points={roots.map((root) => `${px(root).x},${px(root).y}`).join(" ")} fill={colors.reflection} opacity="0.18" stroke={colors.polar} strokeWidth="3" />
      {roots.map((root, index) => <circle key={index} cx={px(root).x} cy={px(root).y} r={index === k ? 10 : 7} fill={index === k ? colors.result : colors.z} />)}
      <ComplexArrow z={selected} color={colors.result} label={`z_${k}`} />
      {toggles.labels ? <Info lines={[`n = ${n}`, `k = ${k}`, `angle = ${fmt((360 * k) / n)} deg`, `root = ${complex(selected)}`, `root count = ${n}`, `spacing = ${fmt(360 / n)} deg`]} /> : null}
    </Frame>
  );
}

export function EulerFormVisual({ values, toggles, onValueChange }: VisualState) {
  const theta = values.theta;
  const z = cis(theta);
  return (
    <Frame label="Euler form and the unit circle">
      <Plane unitCircle />
      <AngleArc z={z} label="theta" radius={1.15} />
      <ComponentGuides z={z} />
      <ComplexArrow z={z} color={colors.result} label="e^{i theta}" />
      <DraggableHandle label="Drag theta" position={px(z)} bounds={{ x: [origin.x - 190, origin.x + 190], y: [origin.y - 190, origin.y + 190] }} onChange={(point) => { const next = unpx(point); onValueChange("theta", Math.atan2(next.im, next.re)); }} />
      {toggles.labels ? <Info lines={[`theta = ${fmt(theta * 180 / Math.PI)} deg`, `theta = ${fmt(theta)} rad`, `cos theta = ${fmt(z.re)}`, `sin theta = ${fmt(z.im)}`, `complex form = ${complex(z)}`, `modulus = ${fmt(mod(z))}`, `argument = ${fmt(argDeg(z))} deg`]} /> : null}
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

function Plane({ unitCircle = false }: { unitCircle?: boolean }) {
  const lines = [];
  for (let i = -5; i <= 5; i += 1) {
    lines.push(<line key={`x${i}`} x1={origin.x + i * scalePx} y1={origin.y - 190} x2={origin.x + i * scalePx} y2={origin.y + 190} stroke={colors.grid} />);
    lines.push(<line key={`y${i}`} x1={origin.x - 190} y1={origin.y - i * scalePx} x2={origin.x + 190} y2={origin.y - i * scalePx} stroke={colors.grid} />);
  }
  return <g>{lines}<line x1={origin.x - 205} y1={origin.y} x2={origin.x + 205} y2={origin.y} stroke="#94a3b8" strokeWidth="3" /><line x1={origin.x} y1={origin.y - 205} x2={origin.x} y2={origin.y + 205} stroke="#94a3b8" strokeWidth="3" /><text x={origin.x + 212} y={origin.y + 5} className="fill-slate-200 text-xs font-black">real</text><text x={origin.x + 8} y={origin.y - 212} className="fill-slate-200 text-xs font-black">imaginary</text>{unitCircle ? <circle cx={origin.x} cy={origin.y} r={scalePx} fill="none" stroke={colors.polar} strokeWidth="4" strokeDasharray="8 8" /> : null}</g>;
}

function ComplexArrow({ z, color, label, from = zero, dashed = false }: { z: Complex; color: string; label: string; from?: Complex; dashed?: boolean }) {
  const p1 = px(from);
  const p2 = px(z);
  return <g><line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={dashed ? "9 7" : undefined} /><circle cx={p2.x} cy={p2.y} r="8" fill={color} /><Text z={add(z, c(0.15, 0.18))} text={label} /></g>;
}

function ComponentGuides({ z, triangle = false }: { z: Complex; triangle?: boolean }) {
  const foot = c(z.re, 0);
  return <g><line x1={px(zero).x} y1={px(zero).y} x2={px(foot).x} y2={px(foot).y} stroke={colors.polar} strokeWidth="4" strokeDasharray="7 6" /><line x1={px(foot).x} y1={px(foot).y} x2={px(z).x} y2={px(z).y} stroke={colors.polar} strokeWidth="4" strokeDasharray="7 6" />{triangle ? <polygon points={`${px(zero).x},${px(zero).y} ${px(foot).x},${px(foot).y} ${px(z).x},${px(z).y}`} fill={colors.polar} opacity="0.16" /> : null}</g>;
}

function AngleArc({ z, label, radius = 1.25 }: { z: Complex; label: string; radius?: number }) {
  const end = px(scale(unit(z), radius));
  const start = px(c(radius, 0));
  return <g><path d={`M ${start.x} ${start.y} Q ${origin.x + radius * 34} ${origin.y - radius * 34} ${end.x} ${end.y}`} fill="none" stroke={colors.polar} strokeWidth="3" /><text x={origin.x + radius * 36} y={origin.y - radius * 18} className="fill-amber-100 text-xs font-black">{label}</text></g>;
}

function Parallelogram({ z1, z2 }: { z1: Complex; z2: Complex }) {
  const sum = add(z1, z2);
  return <polygon points={`${px(zero).x},${px(zero).y} ${px(z1).x},${px(z1).y} ${px(sum).x},${px(sum).y} ${px(z2).x},${px(z2).y}`} fill="none" stroke={colors.polar} strokeWidth="3" strokeDasharray="8 8" />;
}

function PointHandle({ label, z, onValueChange, reKey, imKey }: { label: string; z: Complex; onValueChange: (id: string, value: number) => void; reKey: string; imKey: string }) {
  return <DraggableHandle label={label} position={px(z)} bounds={{ x: [origin.x - 190, origin.x + 190], y: [origin.y - 190, origin.y + 190] }} onChange={(point) => { const next = unpx(point); onValueChange(reKey, next.re); onValueChange(imKey, next.im); }} />;
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="585" y="105" width="292" height={Math.max(90, lines.length * 25 + 34)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="604" y={136 + index * 24} className="fill-slate-100 text-sm font-bold">{line}</text>)}</g>;
}

function Text({ z, text }: { z: Complex; text: string }) {
  const p = px(z);
  return <text x={p.x} y={p.y} className="fill-white text-sm font-black">{text}</text>;
}

const origin = { x: 285, y: 295 };
const scalePx = 38;
const zero = { re: 0, im: 0 };

function px(z: Complex) { return { x: origin.x + z.re * scalePx, y: origin.y - z.im * scalePx }; }
function unpx(point: { x: number; y: number }) { return { re: Number(((point.x - origin.x) / scalePx).toFixed(2)), im: Number(((origin.y - point.y) / scalePx).toFixed(2)) }; }
function c(re: number, im: number): Complex { return { re, im }; }
function add(a: Complex, b: Complex): Complex { return { re: a.re + b.re, im: a.im + b.im }; }
function scale(z: Complex, factor: number): Complex { return { re: z.re * factor, im: z.im * factor }; }
function multiply(a: Complex, b: Complex): Complex { return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }; }
function mod(z: Complex) { return Math.hypot(z.re, z.im); }
function argRad(z: Complex) { return Math.atan2(z.im, z.re); }
function argDeg(z: Complex) { return argRad(z) * 180 / Math.PI; }
function unit(z: Complex) { const length = mod(z); return length ? scale(z, 1 / length) : c(1, 0); }
function cis(theta: number): Complex { return c(Math.cos(theta), Math.sin(theta)); }
function quadrant(z: Complex) {
  if (Math.abs(z.re) < 0.001 && Math.abs(z.im) < 0.001) return "origin";
  if (Math.abs(z.re) < 0.001) return "imaginary axis";
  if (Math.abs(z.im) < 0.001) return "real axis";
  return z.re > 0 && z.im > 0 ? "I" : z.re < 0 && z.im > 0 ? "II" : z.re < 0 && z.im < 0 ? "III" : "IV";
}
function complex(z: Complex) { return `${fmt(z.re)} ${z.im < 0 ? "-" : "+"} ${fmt(Math.abs(z.im))}i`; }
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
