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

const round = (value: number, digits = 3) => Number(value.toFixed(digits));
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
const radToDeg = (radians: number) => (radians * 180) / Math.PI;
const sinDeg = (degrees: number) => Math.sin(degToRad(degrees));
const cosDeg = (degrees: number) => Math.cos(degToRad(degrees));
const tanDeg = (degrees: number) => Math.tan(degToRad(degrees));

export const phaseSevenBrowserSmokeStatus = "metadata-manifest-no-browser-framework" as const;

export function approximationStatus(thetaDegrees: number) {
  const theta = degToRad(thetaDegrees);
  const percent = theta === 0 ? 0 : Math.abs((theta - Math.sin(theta)) / theta) * 100;
  if (percent < 0.5) return "excellent";
  if (percent < 4) return "acceptable";
  return "poor";
}

export function SmallAngleApproximationVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const expanded = toggles.expanded ?? false;
  const center = { x: 270, y: 300 };
  const r = 165;
  const arcEnd = pointOnCircle(center, r, theta);
  const sineTop = { x: arcEnd.x, y: center.y - r * sinDeg(theta) };
  const tangentX = center.x + r;
  const tangentY = center.y - r * tanDeg(theta);
  const thetaRad = degToRad(theta);
  const error = thetaRad - sinDeg(theta);
  return (
    <Frame label="Small angle approximation">
      <circle cx={center.x} cy={center.y} r={r} fill="#0f172a" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={center.x - 28} y1={center.y} x2={center.x + r + 60} y2={center.y} stroke="#64748b" strokeWidth="3" />
      <line x1={center.x} y1={center.y + 28} x2={center.x} y2={center.y - r - 30} stroke="#64748b" strokeWidth="3" />
      <path d={`M ${center.x} ${center.y} L ${center.x + r} ${center.y} A ${r} ${r} 0 0 0 ${arcEnd.x} ${arcEnd.y} Z`} fill="#22d3ee" opacity="0.16" />
      <path d={arcPath(center, r, 0, theta)} fill="none" stroke={strokeFor("theta", activeHighlight, "#22d3ee")} strokeWidth={widthFor("theta", activeHighlight)} strokeLinecap="round" onMouseEnter={() => onHighlight("theta")} onMouseLeave={() => onHighlight(null)} />
      <line x1={arcEnd.x} y1={center.y} x2={arcEnd.x} y2={sineTop.y} stroke={strokeFor("sin", activeHighlight, "#f97316")} strokeWidth={widthFor("sin", activeHighlight)} onMouseEnter={() => onHighlight("sin")} onMouseLeave={() => onHighlight(null)} />
      <line x1={tangentX} y1={center.y} x2={tangentX} y2={Math.max(center.y - 210, tangentY)} stroke="#a855f7" strokeWidth="5" strokeDasharray="9 7" opacity={expanded || activeStep >= 4 ? 1 : 0.35} />
      <line x1={arcEnd.x} y1={sineTop.y} x2={arcEnd.x + Math.max(10, error * 520)} y2={sineTop.y} stroke={strokeFor("gap", activeHighlight, "#fde68a")} strokeWidth={widthFor("gap", activeHighlight)} strokeLinecap="round" onMouseEnter={() => onHighlight("gap")} onMouseLeave={() => onHighlight(null)} />
      <AngleHandle center={center} radius={r} theta={theta} label="Drag theta" min={0} max={expanded ? 60 : 20} onTheta={(next) => onValueChange("theta", next)} />
      <FormulaBlock x={555} y={110} lines={[`theta = ${round(theta, 1)} deg`, `theta = ${round(thetaRad)} radians`, `sin theta = ${round(sinDeg(theta))}`, `tan theta = ${round(tanDeg(theta))}`, `theta - sin theta = ${round(error, 5)}`, `error = ${percentError(theta)}%`, `status: ${approximationStatus(theta)}`]} />
      <Warning x={535} y={355} active={activeHighlight === "radians"} onEnter={() => onHighlight("radians")} onLeave={() => onHighlight(null)} />
      {toggles.labels ? <text x="115" y="485" fill="#f8fafc" fontSize="14" fontWeight="900">Small angles only: arc theta and sine height nearly coincide.</text> : null}
    </Frame>
  );
}

export function ArcLengthFormulaVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const radius = values.radius;
  const center = { x: 270, y: 292 };
  const r = radius * 34;
  const end = pointOnCircle(center, r, theta);
  const arcLength = radius * degToRad(theta);
  return (
    <Frame label="Arc length formula">
      <circle cx={center.x} cy={center.y} r={r} fill="#2563eb" opacity="0.13" stroke="#bfdbfe" strokeWidth="4" />
      <path d={`M ${center.x} ${center.y} L ${center.x + r} ${center.y} A ${r} ${r} 0 ${theta > 180 ? 1 : 0} 0 ${end.x} ${end.y} Z`} fill="#22d3ee" opacity="0.17" />
      <path d={arcPath(center, r, 0, theta)} fill="none" stroke={strokeFor("s", activeHighlight, "#f97316")} strokeWidth={widthFor("s", activeHighlight)} strokeLinecap="round" onMouseEnter={() => onHighlight("s")} onMouseLeave={() => onHighlight(null)} />
      <line x1={center.x} y1={center.y} x2={center.x + r} y2={center.y} stroke={strokeFor("r", activeHighlight, "#22d3ee")} strokeWidth={widthFor("r", activeHighlight)} onMouseEnter={() => onHighlight("r")} onMouseLeave={() => onHighlight(null)} />
      <line x1={center.x} y1={center.y} x2={end.x} y2={end.y} stroke="#fde68a" strokeWidth="4" />
      <path d={arcPath(center, 54, 0, theta)} fill="none" stroke={strokeFor("theta", activeHighlight, "#f8fafc")} strokeWidth={widthFor("theta", activeHighlight)} strokeLinecap="round" onMouseEnter={() => onHighlight("theta")} onMouseLeave={() => onHighlight(null)} />
      <FormulaBlock x={555} y={120} lines={[`r = ${radius}`, `theta = ${round(theta, 1)} deg`, `theta = ${round(degToRad(theta))} radians`, `s = r theta`, `s = ${radius} x ${round(degToRad(theta))}`, `arc length = ${round(arcLength)}`]} />
      {toggles.labels ? <text x="112" y="485" fill="#f8fafc" fontSize="14" fontWeight="900">Theta must be in radians for s = r theta.</text> : null}
      <AngleHandle center={center} radius={r} theta={theta} label="Drag theta" min={10} max={300} onTheta={(next) => onValueChange("theta", next)} />
      <DraggableHandle label="Drag r" position={{ x: center.x + r, y: center.y }} axis="x" bounds={{ x: [center.x + 3 * 34, center.x + 7 * 34] }} snapToGrid={34} keyboardStep={34} onChange={(point) => onValueChange("radius", Math.round((point.x - center.x) / 34))} />
    </Frame>
  );
}

function Warning({ x, y, active, onEnter, onLeave }: { x: number; y: number; active: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <g onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <rect x={x - 18} y={y - 28} width="320" height="74" rx="16" fill={active ? "#713f12" : "#1e293b"} stroke={active ? "#fde68a" : "#475569"} />
      <text x={x} y={y} fill="#f8fafc" fontSize="14" fontWeight="900">Warning: theta must be small</text>
      <text x={x} y={y + 24} fill="#f8fafc" fontSize="13" fontWeight="800">and measured in radians.</text>
    </g>
  );
}

function FormulaBlock({ x, y, lines }: { x: number; y: number; lines: (string | number)[] }) {
  return <g><rect x={x - 18} y={y - 30} width="310" height={Math.max(84, lines.length * 25 + 22)} rx="16" fill="#0f172a" opacity="0.93" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 25} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function AngleHandle({ center, radius, theta, label, min, max, onTheta }: { center: Point; radius: number; theta: number; label: string; min: number; max: number; onTheta: (theta: number) => void }) {
  const p = pointOnCircle(center, radius, theta);
  return <DraggableHandle label={label} position={p} axis="xy" bounds={{ x: [center.x - radius, center.x + radius], y: [center.y - radius, center.y + radius] }} keyboardStep={8} onChange={(next) => onTheta(Math.max(min, Math.min(max, round(angleFromPoint(center, next), 1))))} />;
}

function pointOnCircle(center: Point, radius: number, degrees: number): Point {
  return { x: center.x + radius * cosDeg(degrees), y: center.y - radius * sinDeg(degrees) };
}

function angleFromPoint(center: Point, point: Point) {
  return ((radToDeg(Math.atan2(center.y - point.y, point.x - center.x)) % 360) + 360) % 360;
}

function arcPath(center: Point, radius: number, start: number, end: number) {
  const a = pointOnCircle(center, radius, start);
  const b = pointOnCircle(center, radius, end);
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${Math.abs(end - start) > 180 ? 1 : 0} 0 ${b.x} ${b.y}`;
}

function percentError(thetaDegrees: number) {
  const theta = degToRad(thetaDegrees);
  if (theta === 0) return 0;
  return round(Math.abs((theta - Math.sin(theta)) / theta) * 100, 2);
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
