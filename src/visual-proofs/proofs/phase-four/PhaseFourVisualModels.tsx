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

const round = (value: number) => Math.round(value * 100) / 100;

export function PythagoreanAreaVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = values.b;
  const c = Math.hypot(a, b);
  const scale = 34;
  const x = 170;
  const y = 380;
  const ax = x + a * scale;
  const by = y - b * scale;
  return (
    <Frame label="Pythagorean theorem area model">
      <polygon points={`${x},${y} ${ax},${y} ${ax},${by}`} fill="#2563eb" stroke="#bfdbfe" strokeWidth="3" />
      <RightAngleMarker x={ax - 34} y={y - 34} />
      {activeStep >= 1 ? <rect x={x} y={y + 18} width={a * scale} height={a * scale} fill="#14b8a6" opacity="0.72" stroke={strokeFor("a2", activeHighlight, "#ccfbf1")} strokeWidth={widthFor("a2", activeHighlight)} onMouseEnter={() => onHighlight("a2")} onMouseLeave={() => onHighlight(null)} /> : null}
      {activeStep >= 1 ? <rect x={ax + 18} y={by} width={b * scale} height={b * scale} fill="#f97316" opacity="0.72" stroke={strokeFor("b2", activeHighlight, "#fed7aa")} strokeWidth={widthFor("b2", activeHighlight)} onMouseEnter={() => onHighlight("b2")} onMouseLeave={() => onHighlight(null)} /> : null}
      {activeStep >= 2 ? <HypotenuseSquare x1={x} y1={y} x2={ax} y2={by} active={activeHighlight === "c2"} onEnter={() => onHighlight("c2")} onLeave={() => onHighlight(null)} /> : null}
      {toggles.labels ? (
        <>
          <SegmentLabel x={(x + ax) / 2} y={y - 12} text={`a = ${a}`} active={activeHighlight === "a2"} />
          <SegmentLabel x={ax + 16} y={(y + by) / 2} text={`b = ${b}`} active={activeHighlight === "b2"} />
          <SegmentLabel x={(x + ax) / 2 - 30} y={(y + by) / 2 - 24} text={`c = ${round(c)}`} active={activeHighlight === "c2"} />
          <Info x={560} y={285} lines={[`a^2 + b^2 = ${a * a} + ${b * b}`, `c^2 = ${round(c * c)}`, `invariant: ${round(a * a + b * b)} = ${round(c * c)}`]} />
        </>
      ) : null}
      <DraggableHandle label="Drag right-triangle vertex" position={{ x: ax, y: by }} axis="xy" bounds={{ x: [x + 3 * scale, x + 9 * scale], y: [y - 8 * scale, y - 3 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => { onValueChange("a", Math.round((point.x - x) / scale)); onValueChange("b", Math.round((y - point.y) / scale)); }} />
    </Frame>
  );
}

export function TriangleAngleSumVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const p = {
    a: { x: values.ax, y: values.ay },
    b: { x: values.bx, y: values.by },
    c: { x: values.cx, y: values.cy },
  };
  const angles = triangleAngles(p.a, p.b, p.c);
  const setPoint = (prefix: "a" | "b" | "c", x: number, y: number) => {
    onValueChange(`${prefix}x`, Math.max(150, Math.min(620, x)));
    onValueChange(`${prefix}y`, Math.max(120, Math.min(410, y)));
  };
  return (
    <Frame label="Triangle angle sum proof">
      <polygon points={`${p.a.x},${p.a.y} ${p.b.x},${p.b.y} ${p.c.x},${p.c.y}`} fill="#2563eb" opacity="0.35" stroke="#bfdbfe" strokeWidth="4" />
      <AngleArc cx={p.a.x} cy={p.a.y} active={activeHighlight === "A"} label="A" onEnter={() => onHighlight("A")} onLeave={() => onHighlight(null)} />
      <AngleArc cx={p.b.x} cy={p.b.y} active={activeHighlight === "B"} label="B" onEnter={() => onHighlight("B")} onLeave={() => onHighlight(null)} />
      <AngleArc cx={p.c.x} cy={p.c.y} active={activeHighlight === "C"} label="C" onEnter={() => onHighlight("C")} onLeave={() => onHighlight(null)} />
      {activeStep >= 4 ? <StraightAngleStrip active={activeHighlight === "straight"} /> : null}
      {toggles.labels ? <Info x={560} y={290} lines={[`A = ${round(angles.A)}°`, `B = ${round(angles.B)}°`, `C = ${round(angles.C)}°`, `sum = ${round(angles.A + angles.B + angles.C)}°`]} /> : null}
      <DraggableHandle label="Drag vertex A" position={p.a} axis="xy" bounds={{ x: [150, 620], y: [120, 410] }} keyboardStep={8} onChange={(point) => setPoint("a", point.x, point.y)} />
      <DraggableHandle label="Drag vertex B" position={p.b} axis="xy" bounds={{ x: [150, 620], y: [120, 410] }} keyboardStep={8} onChange={(point) => setPoint("b", point.x, point.y)} />
      <DraggableHandle label="Drag vertex C" position={p.c} axis="xy" bounds={{ x: [150, 620], y: [120, 410] }} keyboardStep={8} onChange={(point) => setPoint("c", point.x, point.y)} />
    </Frame>
  );
}

export function CircleCircumferenceVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const r = values.radius;
  const scale = 24;
  const cx = 270;
  const cy = 260;
  const rr = r * scale;
  const diameter = 2 * r;
  const circumference = 2 * Math.PI * r;
  return (
    <Frame label="Circle circumference unwrapping proof">
      <circle cx={cx} cy={cy} r={rr} fill="#2563eb" opacity="0.2" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={cx + rr} y2={cy} stroke={strokeFor("r", activeHighlight, "#22d3ee")} strokeWidth={widthFor("r", activeHighlight)} onMouseEnter={() => onHighlight("r")} onMouseLeave={() => onHighlight(null)} />
      <line x1={cx - rr} y1={cy + 18} x2={cx + rr} y2={cy + 18} stroke={strokeFor("d", activeHighlight, "#f97316")} strokeWidth={widthFor("d", activeHighlight)} onMouseEnter={() => onHighlight("d")} onMouseLeave={() => onHighlight(null)} />
      {activeStep >= 2 ? <line x1="160" y1="455" x2={160 + circumference * 13} y2="455" stroke={strokeFor("pi-d", activeHighlight, "#fde68a")} strokeWidth={widthFor("pi-d", activeHighlight)} onMouseEnter={() => onHighlight("pi-d")} onMouseLeave={() => onHighlight(null)} /> : null}
      {activeStep >= 4 ? [0, 1, 2].map((index) => <line key={index} x1={160 + index * diameter * 13} y1="430" x2={160 + index * diameter * 13} y2="480" stroke="#94a3b8" strokeWidth="2" />) : null}
      {toggles.labels ? <Info x={560} y={285} lines={[`r = ${r}`, `d = ${diameter}`, `C = 2πr = ${round(circumference)}`, "π is a little more than 3"]} /> : null}
      <DraggableHandle label="Drag radius" position={{ x: cx + rr, y: cy }} axis="x" bounds={{ x: [cx + 2 * scale, cx + 8 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("radius", Math.round((point.x - cx) / scale))} />
    </Frame>
  );
}

export function DifferenceOfSquaresVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = Math.min(values.b, a - 1);
  const scale = 36;
  const x = 150;
  const y = 100;
  const as = a * scale;
  const bs = b * scale;
  const rem = (a - b) * scale;
  return (
    <Frame label="Difference of squares rearrangement">
      <rect x={x} y={y} width={as} height={as} fill="#2563eb" opacity="0.34" stroke={strokeFor("a2", activeHighlight, "#bfdbfe")} strokeWidth={widthFor("a2", activeHighlight)} onMouseEnter={() => onHighlight("a2")} onMouseLeave={() => onHighlight(null)} />
      <rect x={x + as - bs} y={y + as - bs} width={bs} height={bs} fill="#020617" stroke={strokeFor("b2", activeHighlight, "#fed7aa")} strokeWidth={widthFor("b2", activeHighlight)} onMouseEnter={() => onHighlight("b2")} onMouseLeave={() => onHighlight(null)} />
      {activeStep >= 4 ? <rect x="520" y="170" width={(a + b) * 22} height={(a - b) * 22} fill="#14b8a6" opacity="0.78" stroke="#ccfbf1" strokeWidth="3" /> : null}
      {toggles.labels ? <Info x={540} y={335} lines={[`a^2 - b^2 = ${a * a - b * b}`, `rectangle = (${a - b}) x (${a + b})`, `${a * a - b * b} = ${(a - b) * (a + b)}`]} /> : null}
      <SegmentLabel x={x + as + 28} y={y + as - rem / 2} text={`a - b`} active={activeHighlight === "a-b"} />
      <SegmentLabel x={610 + (a + b) * 11} y={155} text={`a + b`} active={activeHighlight === "a-plus-b"} />
      <DraggableHandle label="Drag b split" position={{ x: x + as - bs, y: y + as - bs }} axis="xy" bounds={{ x: [x + scale, x + as - scale], y: [y + scale, y + as - scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("b", Math.max(1, Math.min(a - 1, Math.round((x + as - point.x) / scale))))} />
    </Frame>
  );
}

export function SquareOfDifferenceVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = Math.min(values.b, a - 1);
  const scale = 38;
  const x = 160;
  const y = 95;
  const as = a * scale;
  const bs = b * scale;
  const keep = as - bs;
  return (
    <Frame label="Square of a difference tile model">
      <rect x={x} y={y} width={as} height={as} fill="#2563eb" opacity="0.34" stroke={strokeFor("a2", activeHighlight, "#bfdbfe")} strokeWidth={widthFor("a2", activeHighlight)} onMouseEnter={() => onHighlight("a2")} onMouseLeave={() => onHighlight(null)} />
      <rect x={x + keep} y={y} width={bs} height={as} fill="#ef4444" opacity={activeHighlight === "minus-2ab" ? "0.82" : "0.5"} />
      <rect x={x} y={y + keep} width={as} height={bs} fill="#ef4444" opacity={activeHighlight === "minus-2ab" ? "0.82" : "0.5"} />
      <rect x={x + keep} y={y + keep} width={bs} height={bs} fill="#f97316" opacity={activeHighlight === "plus-b2" ? "0.95" : "0.7"} stroke={strokeFor("plus-b2", activeHighlight, "#fed7aa")} strokeWidth={widthFor("plus-b2", activeHighlight)} />
      <rect x={x} y={y} width={keep} height={keep} fill="#14b8a6" opacity="0.78" stroke={strokeFor("final", activeHighlight, "#ccfbf1")} strokeWidth={widthFor("final", activeHighlight)} />
      {toggles.labels ? <Info x={560} y={315} lines={[`a^2 - 2ab + b^2`, `${a * a} - ${2 * a * b} + ${b * b}`, `final = ${(a - b) ** 2}`]} /> : null}
      <DraggableHandle label="Drag b split" position={{ x: x + keep, y: y + keep }} axis="xy" bounds={{ x: [x + scale, x + as - scale], y: [y + scale, y + as - scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("b", Math.max(1, Math.min(a - 1, Math.round((x + as - point.x) / scale))))} />
    </Frame>
  );
}

export function ProductOfBinomialsVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const xVal = values.x;
  const a = values.a;
  const b = values.b;
  const scale = 34;
  const x = 150;
  const y = 115;
  const xs = xVal * scale;
  const as = a * scale;
  const bs = b * scale;
  return (
    <Frame label="Product of binomials rectangle area model">
      <Tile x={x} y={y} w={xs} h={xs} fill="#2563eb" token="x2" active={activeHighlight} onHighlight={onHighlight} label="x^2" />
      <Tile x={x + xs} y={y} w={as} h={xs} fill="#14b8a6" token="ax" active={activeHighlight} onHighlight={onHighlight} label="ax" />
      <Tile x={x} y={y + xs} w={xs} h={bs} fill="#a855f7" token="bx" active={activeHighlight} onHighlight={onHighlight} label="bx" />
      <Tile x={x + xs} y={y + xs} w={as} h={bs} fill="#f97316" token="ab" active={activeHighlight} onHighlight={onHighlight} label="ab" />
      <rect x={x} y={y} width={xs + as} height={xs + bs} fill="none" stroke="#f8fafc" strokeWidth="4" />
      {toggles.labels ? <Info x={550} y={315} lines={[`area = (${xVal}+${a})(${xVal}+${b})`, `parts = ${xVal ** 2} + ${a * xVal} + ${b * xVal} + ${a * b}`, `total = ${(xVal + a) * (xVal + b)}`]} /> : null}
      <DraggableHandle label="Drag width split a" position={{ x: x + xs + as, y: y - 28 }} axis="x" bounds={{ x: [x + xs + scale, x + xs + 6 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("a", Math.round((point.x - x - xs) / scale))} />
      <DraggableHandle label="Drag height split b" position={{ x: x - 28, y: y + xs + bs }} axis="y" bounds={{ y: [y + xs + scale, y + xs + 6 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("b", Math.round((point.y - y - xs) / scale))} />
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return <div className="bg-white p-2 dark:bg-slate-950"><svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full"><rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />{children}</svg></div>;
}

function Tile({ x, y, w, h, fill, token, active, onHighlight, label }: { x: number; y: number; w: number; h: number; fill: string; token: string; active: string | null; onHighlight: (token: string | null) => void; label: string }) {
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><rect x={x} y={y} width={w} height={h} fill={fill} opacity={active === token ? "0.95" : "0.76"} stroke={strokeFor(token, active, "#f8fafc")} strokeWidth={widthFor(token, active)} /><text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="#f8fafc" fontSize="22" fontWeight="900">{label}</text></g>;
}

function SegmentLabel({ x, y, text, active = false }: { x: number; y: number; text: string; active?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill={active ? "#fde68a" : "#f8fafc"} fontSize="15" fontWeight="900">{text}</text>;
}

function RightAngleMarker({ x, y }: { x: number; y: number }) {
  return <path d={`M ${x} ${y + 34} L ${x} ${y} L ${x + 34} ${y}`} fill="none" stroke="#fde68a" strokeWidth="4" />;
}

function AngleArc({ cx, cy, label, active, onEnter, onLeave }: { cx: number; cy: number; label: string; active: boolean; onEnter: () => void; onLeave: () => void }) {
  return <g onMouseEnter={onEnter} onMouseLeave={onLeave}><circle cx={cx} cy={cy} r={active ? 34 : 26} fill="none" stroke={active ? "#fde68a" : "#22d3ee"} strokeWidth={active ? "7" : "4"} /><SegmentLabel x={cx + 36} y={cy - 12} text={label} active={active} /></g>;
}

function StraightAngleStrip({ active }: { active: boolean }) {
  return <g><line x1="190" y1="455" x2="520" y2="455" stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth={active ? "8" : "5"} /><text x="350" y="438" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="900">A + B + C = 180°</text></g>;
}

function HypotenuseSquare({ x1, y1, x2, y2, active, onEnter, onLeave }: { x1: number; y1: number; x2: number; y2: number; active: boolean; onEnter: () => void; onLeave: () => void }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const px = -dy;
  const py = dx;
  const len = Math.hypot(px, py);
  const s = 0.55;
  const ux = (px / len) * Math.hypot(dx, dy) * s;
  const uy = (py / len) * Math.hypot(dx, dy) * s;
  return <polygon points={`${x1},${y1} ${x2},${y2} ${x2 + ux},${y2 + uy} ${x1 + ux},${y1 + uy}`} fill="#a855f7" opacity="0.5" stroke={active ? "#fde68a" : "#ddd6fe"} strokeWidth={active ? "7" : "3"} onMouseEnter={onEnter} onMouseLeave={onLeave} />;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 18} y={y - 34} width="310" height={Math.max(82, lines.length * 28 + 24)} rx="16" fill="#0f172a" opacity="0.92" stroke="#334155" />{lines.map((line, index) => <text key={line} x={x} y={y + index * 28} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function triangleAngles(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
  const angle = (p: typeof a, q: typeof a, r: typeof a) => {
    const v1 = { x: p.x - q.x, y: p.y - q.y };
    const v2 = { x: r.x - q.x, y: r.y - q.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
    return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI;
  };
  return { A: angle(b, a, c), B: angle(a, b, c), C: angle(a, c, b) };
}

function strokeFor(token: string, active: string | null, fallback: string) {
  return active === token ? "#fde68a" : fallback;
}

function widthFor(token: string, active: string | null) {
  return active === token ? "7" : "3";
}
