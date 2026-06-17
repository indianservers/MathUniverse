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

type Point = { x: number; y: number };

const circle = { cx: 275, cy: 265, r: 128 };
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
const radToDeg = (radians: number) => (radians * 180) / Math.PI;
const sinDeg = (degrees: number) => Math.sin(degToRad(degrees));
const cosDeg = (degrees: number) => Math.cos(degToRad(degrees));
const normalizeAngle = (degrees: number) => ((degrees % 360) + 360) % 360;
const commonAngles = [0, 30, 45, 60, 90, 180, 270, 360];

export const phaseFiveTraceConfig = {
  graph: "sine-from-unit-circle",
  keyTicks: ["0", "pi/2", "pi", "3pi/2", "2pi"],
  model: "graph-limit",
} as const;

export function formatTrigValue(kind: "sin" | "cos" | "tan", degrees: number) {
  const normalized = normalizeAngle(degrees);
  const exact = exactTrigValue(kind, normalized);
  if (exact) return { exact, rounded: exact };
  if (kind === "tan" && Math.abs(cosDeg(normalized)) < 0.03) return { exact: "undefined", rounded: "undefined" };
  const value = kind === "sin" ? sinDeg(normalized) : kind === "cos" ? cosDeg(normalized) : sinDeg(normalized) / cosDeg(normalized);
  return { exact: "rounded", rounded: String(round(value, 3)) };
}

export function RightTriangleTrigRatiosVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const scale = values.scale;
  const hyp = 42 * scale;
  const adjacent = hyp * cosDeg(theta);
  const opposite = hyp * sinDeg(theta);
  const ox = 160;
  const oy = 410;
  const ax = ox + adjacent;
  const ay = oy;
  const px = ax;
  const py = oy - opposite;
  return (
    <Frame label="Right triangle trigonometric ratios">
      <polygon points={`${ox},${oy} ${ax},${ay} ${px},${py}`} fill="#2563eb" opacity="0.34" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={ox} y1={oy} x2={ax} y2={ay} stroke={strokeFor("adjacent", activeHighlight, "#22d3ee")} strokeWidth={widthFor("adjacent", activeHighlight)} onMouseEnter={() => onHighlight("adjacent")} onMouseLeave={() => onHighlight(null)} />
      <line x1={ax} y1={ay} x2={px} y2={py} stroke={strokeFor("opposite", activeHighlight, "#f97316")} strokeWidth={widthFor("opposite", activeHighlight)} onMouseEnter={() => onHighlight("opposite")} onMouseLeave={() => onHighlight(null)} />
      <line x1={ox} y1={oy} x2={px} y2={py} stroke={strokeFor("hypotenuse", activeHighlight, "#a855f7")} strokeWidth={widthFor("hypotenuse", activeHighlight)} onMouseEnter={() => onHighlight("hypotenuse")} onMouseLeave={() => onHighlight(null)} />
      <AngleWedge cx={ox} cy={oy} r={56} theta={theta} active={activeHighlight === "theta"} />
      <RightAngleMarker x={ax - 32} y={ay - 32} />
      <RatioBars x={555} y={140} rows={[["sin theta", sinDeg(theta), "#f97316"], ["cos theta", cosDeg(theta), "#22d3ee"], ["tan theta", sinDeg(theta) / cosDeg(theta), "#a855f7"]]} active={activeHighlight} onHighlight={onHighlight} />
      {activeStep >= 4 ? <SimilarityBadge x={545} y={360} text={`Scale ${scale}x: ratios unchanged`} /> : null}
      {toggles.labels ? <Info x={545} y={75} lines={[`theta = ${round(theta, 1)} deg = ${round(degToRad(theta), 3)} rad`, `opposite = ${round(opposite / 42)}`, `adjacent = ${round(adjacent / 42)}`, `hypotenuse = ${scale}`]} /> : null}
      <AngleControlHandle cx={ox} cy={oy} radius={hyp} theta={theta} label="Drag theta" min={15} max={75} onTheta={(next) => onValueChange("theta", next)} />
      <DraggableHandle label="Drag triangle size" position={{ x: ox + hyp + 20, y: oy + 38 }} axis="x" bounds={{ x: [ox + 42 * 2 + 20, ox + 42 * 6 + 20] }} snapToGrid={42} keyboardStep={42} onChange={(point) => onValueChange("scale", Math.round((point.x - ox - 20) / 42))} />
    </Frame>
  );
}

export function UnitCircleSineCosineVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = snappedTheta(values.theta, toggles.snap ?? false);
  const point = pointOnCircle(circle.cx, circle.cy, circle.r, theta);
  return (
    <Frame label="Unit circle sine and cosine">
      <UnitCircleCanvas theta={theta} activeHighlight={activeHighlight} onHighlight={onHighlight} labels={toggles.labels ?? true} quadrantLabels showCommonAngles />
      <ProjectionReadout x={560} y={120} theta={theta} title="Coordinates" />
      <text x="560" y="325" fill="#f8fafc" fontSize="16" fontWeight="900">P = (cos theta, sin theta)</text>
      <circle cx={point.x} cy={point.y} r={activeHighlight === "point" ? 13 : 9} fill="#fde68a" stroke="#0f172a" strokeWidth="3" onMouseEnter={() => onHighlight("point")} onMouseLeave={() => onHighlight(null)} />
      <AngleControlHandle cx={circle.cx} cy={circle.cy} radius={circle.r} theta={theta} snap={toggles.snap ?? false} label="Drag point" onTheta={(next) => onValueChange("theta", next)} />
    </Frame>
  );
}

export function PythagoreanTrigIdentityVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const point = pointOnCircle(circle.cx, circle.cy, circle.r, theta);
  const base = { x: point.x, y: circle.cy };
  const sinSquare = Math.abs(sinDeg(theta)) * 82;
  const cosSquare = Math.abs(cosDeg(theta)) * 82;
  return (
    <Frame label="Pythagorean trigonometric identity">
      <UnitCircleCanvas theta={theta} activeHighlight={activeHighlight} onHighlight={onHighlight} labels={toggles.labels ?? true} />
      {activeStep >= 2 ? (
        <>
          <rect x={base.x + 14} y={Math.min(base.y, point.y)} width={28} height={Math.max(8, Math.abs(base.y - point.y))} fill="#f97316" opacity={activeHighlight === "sin2" ? "0.95" : "0.62"} onMouseEnter={() => onHighlight("sin2")} onMouseLeave={() => onHighlight(null)} />
          <rect x={Math.min(circle.cx, base.x)} y={circle.cy + 24} width={Math.max(8, Math.abs(base.x - circle.cx))} height="28" fill="#22d3ee" opacity={activeHighlight === "cos2" ? "0.95" : "0.62"} onMouseEnter={() => onHighlight("cos2")} onMouseLeave={() => onHighlight(null)} />
        </>
      ) : null}
      <line x1={circle.cx} y1={circle.cy} x2={point.x} y2={point.y} stroke={strokeFor("one", activeHighlight, "#fde68a")} strokeWidth={widthFor("one", activeHighlight)} onMouseEnter={() => onHighlight("one")} onMouseLeave={() => onHighlight(null)} />
      <Info x={560} y={120} lines={[`sin^2 = ${round(sinDeg(theta) ** 2, 3)}`, `cos^2 = ${round(cosDeg(theta) ** 2, 3)}`, `sum = ${round(sinDeg(theta) ** 2 + cosDeg(theta) ** 2, 3)}`, `area bars: ${round(sinSquare + cosSquare, 1)} visual units`]} />
      <AngleControlHandle cx={circle.cx} cy={circle.cy} radius={circle.r} theta={theta} label="Drag theta" onTheta={(next) => onValueChange("theta", next)} />
    </Frame>
  );
}

export function TangentRatioIdentityVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const point = pointOnCircle(circle.cx, circle.cy, circle.r, theta);
  const cos = cosDeg(theta);
  const tan = Math.abs(cos) < 0.03 ? undefined : sinDeg(theta) / cos;
  const tangentY = tan === undefined ? 80 : circle.cy - Math.max(-170, Math.min(170, tan * 88));
  return (
    <Frame label="Tangent ratio identity">
      <UnitCircleCanvas theta={theta} activeHighlight={activeHighlight} onHighlight={onHighlight} labels={toggles.labels ?? true} />
      <line x1={circle.cx + circle.r + 52} y1="88" x2={circle.cx + circle.r + 52} y2="442" stroke={strokeFor("tan", activeHighlight, "#a855f7")} strokeWidth={widthFor("tan", activeHighlight)} strokeDasharray="9 8" onMouseEnter={() => onHighlight("tan")} onMouseLeave={() => onHighlight(null)} />
      {tan !== undefined ? <line x1={circle.cx + circle.r + 52} y1={circle.cy} x2={circle.cx + circle.r + 52} y2={tangentY} stroke="#a855f7" strokeWidth="10" strokeLinecap="round" /> : null}
      <line x1={circle.cx} y1={circle.cy} x2={point.x} y2={point.y} stroke="#fde68a" strokeWidth="4" />
      <Info x={560} y={125} lines={[`sin theta = ${round(sinDeg(theta), 3)}`, `cos theta = ${round(cos, 3)}`, `tan theta = ${tan === undefined ? "undefined" : round(tan, 3)}`, Math.abs(cos) < 0.08 ? "warning: cos theta near 0" : "rise / run is stable"]} />
      <text x="560" y="335" fill="#f8fafc" fontSize="15" fontWeight="900">tan theta = sin theta / cos theta</text>
      <AngleControlHandle cx={circle.cx} cy={circle.cy} radius={circle.r} theta={theta} label="Drag theta" onTheta={(next) => onValueChange("theta", next)} />
    </Frame>
  );
}

export function RadiansArcRadiusVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const radius = values.radius;
  return (
    <Frame label="Radians as arc length over radius">
      <ArcLengthGuide theta={theta} radius={radius} activeHighlight={activeHighlight} onHighlight={onHighlight} labels={toggles.labels ?? true} />
      <Info x={560} y={120} lines={[`r = ${radius}`, `theta = ${round(theta, 1)} deg`, `theta = ${round(degToRad(theta), 3)} rad`, `s = r theta = ${round(radius * degToRad(theta), 3)}`, `s/r = ${round(degToRad(theta), 3)}`]} />
      <SimilarityBadge x={550} y={360} text="One radian: arc length equals radius" />
      <AngleControlHandle cx={270} cy={282} radius={radius * 32} theta={theta} label="Drag theta" min={20} max={300} onTheta={(next) => onValueChange("theta", next)} />
      <DraggableHandle label="Drag radius" position={{ x: 270 + radius * 32, y: 282 }} axis="x" bounds={{ x: [270 + 3 * 32, 270 + 7 * 32] }} snapToGrid={32} keyboardStep={32} onChange={(point) => onValueChange("radius", Math.round((point.x - 270) / 32))} />
    </Frame>
  );
}

export function TrigGraphsFromUnitCircleVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  return (
    <Frame label="Sine graph traced from the unit circle">
      <g transform="translate(-50 0)">
        <UnitCircleCanvas theta={theta} activeHighlight={activeHighlight} onHighlight={onHighlight} labels={toggles.labels ?? true} />
      </g>
      <TrigGraphTrace theta={theta} activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <ProjectionReadout x={610} y={95} theta={theta} title="Live trace" />
      <AngleControlHandle cx={circle.cx - 50} cy={circle.cy} radius={circle.r} theta={theta} label="Drag theta" onTheta={(next) => onValueChange("theta", next)} />
    </Frame>
  );
}

function UnitCircleCanvas({ theta, activeHighlight, onHighlight, labels, quadrantLabels = false, showCommonAngles = false }: { theta: number; activeHighlight: string | null; onHighlight: (token: string | null) => void; labels: boolean; quadrantLabels?: boolean; showCommonAngles?: boolean }) {
  const p = pointOnCircle(circle.cx, circle.cy, circle.r, theta);
  return (
    <g>
      <line x1={circle.cx - 160} y1={circle.cy} x2={circle.cx + 160} y2={circle.cy} stroke="#64748b" strokeWidth="3" />
      <line x1={circle.cx} y1={circle.cy + 160} x2={circle.cx} y2={circle.cy - 160} stroke="#64748b" strokeWidth="3" />
      <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill="#0f172a" stroke="#bfdbfe" strokeWidth="4" />
      {showCommonAngles ? commonAngles.slice(0, -1).map((angle) => {
        const tick = pointOnCircle(circle.cx, circle.cy, circle.r + 14, angle);
        return <text key={angle} x={tick.x} y={tick.y + 4} fill="#cbd5e1" fontSize="11" fontWeight="800" textAnchor="middle">{angle}</text>;
      }) : null}
      <line x1={circle.cx} y1={circle.cy} x2={p.x} y2={p.y} stroke="#fde68a" strokeWidth="4" />
      <line x1={p.x} y1={circle.cy} x2={p.x} y2={p.y} stroke={strokeFor("sin", activeHighlight, "#f97316")} strokeWidth={widthFor("sin", activeHighlight)} onMouseEnter={() => onHighlight("sin")} onMouseLeave={() => onHighlight(null)} />
      <line x1={circle.cx} y1={circle.cy} x2={p.x} y2={circle.cy} stroke={strokeFor("cos", activeHighlight, "#22d3ee")} strokeWidth={widthFor("cos", activeHighlight)} onMouseEnter={() => onHighlight("cos")} onMouseLeave={() => onHighlight(null)} />
      <circle cx={p.x} cy={p.y} r="8" fill="#fde68a" stroke={strokeFor("point", activeHighlight, "#0f172a")} strokeWidth={widthFor("point", activeHighlight)} onMouseEnter={() => onHighlight("point")} onMouseLeave={() => onHighlight(null)} />
      <AngleWedge cx={circle.cx} cy={circle.cy} r={48} theta={theta} active={activeHighlight === "theta"} />
      {quadrantLabels ? <Quadrants /> : null}
      {labels ? <text x={circle.cx - 42} y={circle.cy + 44} fill="#f8fafc" fontSize="15" fontWeight="900">theta {round(theta, 1)} deg</text> : null}
    </g>
  );
}

function AngleControlHandle({ cx, cy, radius, theta, label, snap = false, min = 0, max = 360, onTheta }: { cx: number; cy: number; radius: number; theta: number; label: string; snap?: boolean; min?: number; max?: number; onTheta: (theta: number) => void }) {
  const point = pointOnCircle(cx, cy, radius, theta);
  return (
    <DraggableHandle
      label={label}
      position={point}
      axis="xy"
      bounds={{ x: [cx - radius, cx + radius], y: [cy - radius, cy + radius] }}
      keyboardStep={8}
      onChange={(nextPoint) => {
        const raw = angleFromPoint(cx, cy, nextPoint);
        const next = snap ? nearestCommonAngle(raw) : raw;
        onTheta(Math.max(min, Math.min(max, round(next, 1))));
      }}
    />
  );
}

function ArcLengthGuide({ theta, radius, activeHighlight, onHighlight, labels }: { theta: number; radius: number; activeHighlight: string | null; onHighlight: (token: string | null) => void; labels: boolean }) {
  const cx = 270;
  const cy = 282;
  const r = radius * 32;
  const end = pointOnCircle(cx, cy, r, theta);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#2563eb" opacity="0.16" stroke="#bfdbfe" strokeWidth="4" />
      <path d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 ${theta > 180 ? 1 : 0} 0 ${end.x} ${end.y} Z`} fill="#22d3ee" opacity="0.18" />
      <path d={arcPath(cx, cy, r, 0, theta)} fill="none" stroke={strokeFor("s", activeHighlight, "#f97316")} strokeWidth={widthFor("s", activeHighlight)} strokeLinecap="round" onMouseEnter={() => onHighlight("s")} onMouseLeave={() => onHighlight(null)} />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={strokeFor("r", activeHighlight, "#22d3ee")} strokeWidth={widthFor("r", activeHighlight)} onMouseEnter={() => onHighlight("r")} onMouseLeave={() => onHighlight(null)} />
      <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#fde68a" strokeWidth="4" />
      <AngleWedge cx={cx} cy={cy} r={52} theta={theta} active={activeHighlight === "theta"} />
      {labels ? <text x={cx + 18} y={cy - 54} fill="#f8fafc" fontSize="16" fontWeight="900">theta = s / r</text> : null}
    </g>
  );
}

function TrigGraphTrace({ theta, activeHighlight, onHighlight }: { theta: number; activeHighlight: string | null; onHighlight: (token: string | null) => void }) {
  const x0 = 475;
  const y0 = 265;
  const width = 330;
  const amp = 92;
  const x = x0 + (normalizeAngle(theta) / 360) * width;
  const y = y0 - sinDeg(theta) * amp;
  const path = Array.from({ length: 90 }, (_, index) => {
    const angle = (Math.min(normalizeAngle(theta), 360) * index) / 89;
    const px = x0 + (angle / 360) * width;
    const py = y0 - sinDeg(angle) * amp;
    return `${index === 0 ? "M" : "L"} ${round(px, 1)} ${round(py, 1)}`;
  }).join(" ");
  return (
    <g onMouseEnter={() => onHighlight("sin")} onMouseLeave={() => onHighlight(null)}>
      <rect x={x0 - 28} y="105" width="386" height="320" rx="18" fill="#0f172a" stroke="#334155" />
      <line x1={x0} y1={y0} x2={x0 + width} y2={y0} stroke="#64748b" strokeWidth="3" />
      <line x1={x0} y1={y0 - 110} x2={x0} y2={y0 + 110} stroke="#64748b" strokeWidth="3" />
      {[0, 90, 180, 270, 360].map((angle) => {
        const tx = x0 + (angle / 360) * width;
        const labels: Record<number, string> = { 0: "0", 90: "pi/2", 180: "pi", 270: "3pi/2", 360: "2pi" };
        return <text key={angle} x={tx} y={y0 + 138} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="800">{labels[angle]}</text>;
      })}
      <path d={path} fill="none" stroke={activeHighlight === "sin" ? "#fde68a" : "#f97316"} strokeWidth={activeHighlight === "sin" ? "7" : "5"} strokeLinecap="round" />
      <line x1={x} y1={y0} x2={x} y2={y} stroke="#22d3ee" strokeWidth="4" strokeDasharray="8 7" />
      <circle cx={x} cy={y} r="10" fill="#fde68a" stroke="#0f172a" strokeWidth="3" />
      <text x={x0 + 12} y="136" fill="#f8fafc" fontSize="15" fontWeight="900">y = sin theta trace</text>
    </g>
  );
}

function RatioBars({ x, y, rows, active, onHighlight }: { x: number; y: number; rows: [string, number, string][]; active: string | null; onHighlight: (token: string | null) => void }) {
  return (
    <g>
      {rows.map(([label, value, color], index) => {
        const token = label;
        const width = Math.min(150, Math.abs(value) * 95);
        return (
          <g key={label} onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}>
            <text x={x} y={y + index * 58} fill="#f8fafc" fontSize="15" fontWeight="900">{label}</text>
            <rect x={x + 92} y={y + index * 58 - 16} width="155" height="22" rx="11" fill="#334155" />
            <rect x={x + 92} y={y + index * 58 - 16} width={width} height="22" rx="11" fill={active === token ? "#fde68a" : color} />
            <text x={x + 260} y={y + index * 58} fill="#cbd5e1" fontSize="14" fontWeight="800">{round(value, 3)}</text>
          </g>
        );
      })}
    </g>
  );
}

function ProjectionReadout({ x, y, theta, title }: { x: number; y: number; theta: number; title: string }) {
  const sin = formatTrigValue("sin", theta);
  const cos = formatTrigValue("cos", theta);
  const tan = formatTrigValue("tan", theta);
  return <Info x={x} y={y} lines={[title, `theta = ${round(theta, 1)} deg`, `cos theta = ${cos.rounded}`, `sin theta = ${sin.rounded}`, `tan theta = ${tan.rounded}`]} />;
}

function Quadrants() {
  return (
    <g fill="#94a3b8" fontSize="13" fontWeight="900">
      <text x={circle.cx + 92} y={circle.cy - 92}>QI</text>
      <text x={circle.cx - 122} y={circle.cy - 92}>QII</text>
      <text x={circle.cx - 128} y={circle.cy + 110}>QIII</text>
      <text x={circle.cx + 88} y={circle.cy + 110}>QIV</text>
    </g>
  );
}

function pointOnCircle(cx: number, cy: number, radius: number, degrees: number): Point {
  return { x: cx + radius * cosDeg(degrees), y: cy - radius * sinDeg(degrees) };
}

function angleFromPoint(cx: number, cy: number, point: Point) {
  return normalizeAngle(radToDeg(Math.atan2(cy - point.y, point.x - cx)));
}

function snappedTheta(theta: number, snap: boolean) {
  return snap ? nearestCommonAngle(theta) : theta;
}

function nearestCommonAngle(theta: number) {
  return commonAngles.reduce((best, candidate) => (Math.abs(candidate - theta) < Math.abs(best - theta) ? candidate : best), commonAngles[0]);
}

function exactTrigValue(kind: "sin" | "cos" | "tan", theta: number) {
  const table: Record<number, Record<"sin" | "cos" | "tan", string>> = {
    0: { sin: "0", cos: "1", tan: "0" },
    30: { sin: "1/2", cos: "sqrt(3)/2", tan: "1/sqrt(3)" },
    45: { sin: "sqrt(2)/2", cos: "sqrt(2)/2", tan: "1" },
    60: { sin: "sqrt(3)/2", cos: "1/2", tan: "sqrt(3)" },
    90: { sin: "1", cos: "0", tan: "undefined" },
    180: { sin: "0", cos: "-1", tan: "0" },
    270: { sin: "-1", cos: "0", tan: "undefined" },
    360: { sin: "0", cos: "1", tan: "0" },
  };
  return table[round(theta, 1)]?.[kind];
}

function arcPath(cx: number, cy: number, radius: number, start: number, end: number) {
  const a = pointOnCircle(cx, cy, radius, start);
  const b = pointOnCircle(cx, cy, radius, end);
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${Math.abs(end - start) > 180 ? 1 : 0} 0 ${b.x} ${b.y}`;
}

function AngleWedge({ cx, cy, r, theta, active }: { cx: number; cy: number; r: number; theta: number; active: boolean }) {
  return <path d={arcPath(cx, cy, r, 0, theta)} fill="none" stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth={active ? "7" : "4"} strokeLinecap="round" />;
}

function RightAngleMarker({ x, y }: { x: number; y: number }) {
  return <path d={`M ${x} ${y + 32} L ${x} ${y} L ${x + 32} ${y}`} fill="none" stroke="#fde68a" strokeWidth="4" />;
}

function SimilarityBadge({ x, y, text }: { x: number; y: number; text: string }) {
  return <g><rect x={x - 16} y={y - 30} width="292" height="56" rx="16" fill="#042f2e" stroke="#2dd4bf" /><text x={x} y={y + 5} fill="#ccfbf1" fontSize="15" fontWeight="900">{text}</text></g>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 18} y={y - 30} width="302" height={Math.max(84, lines.length * 25 + 22)} rx="16" fill="#0f172a" opacity="0.93" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 25} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return <div className="bg-white p-2 dark:bg-slate-950"><svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full"><rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />{children}</svg></div>;
}

function strokeFor(token: string, active: string | null, fallback: string) {
  return active === token ? "#fde68a" : fallback;
}

function widthFor(token: string, active: string | null) {
  return active === token ? "7" : "3";
}
