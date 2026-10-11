import { eulerPoint, taylorPartialSums } from "./eulerLearningMath";
import { fmtC, taylorExpITheta } from "./complexLabMath";

export const EULER_COLORS = { real: "#0369a1", imaginary: "#7c3aed", angle: "#b45309", exact: "#0e7490", taylor: "#be185d" };
export function EulerCircle({ degrees, trace, terms, grid, labels, zoom = 1, showTaylor = false }: { degrees: number; trace: number; terms: number; grid: boolean; labels: boolean; zoom?: number; showTaylor?: boolean }) {
  const p = eulerPoint(degrees), rad = degrees * Math.PI / 180;
  const sum = taylorExpITheta(rad, terms);
  const partials = taylorPartialSums(rad, terms);
  const extent = showTaylor ? Math.max(1.3, ...partials.flatMap(v => [Math.abs(v.re), Math.abs(v.im)])) : 1.3;
  const scale = 102 / extent * zoom;
  const x = (v: number) => 160 + scale * v, y = (v: number) => 140 - scale * v;
  const start = Math.max(0, degrees - trace * 360);
  const path = Array.from({ length: 181 }, (_, i) => { const v = eulerPoint(start + (degrees - start) * i / 180); return `${i ? "L" : "M"}${x(v.re)},${y(v.im)}`; }).join(" ");
  const arc = Array.from({ length: 51 }, (_, i) => { const a = (degrees % 360) * Math.PI / 180 * i / 50; return `${i ? "L" : "M"}${160 + 25 * Math.cos(a)},${140 - 25 * Math.sin(a)}`; }).join(" ");
  return <svg viewBox="0 0 320 280" role="img" aria-label={`Unit circle: θ ${degrees} degrees, point ${fmtC(p, 3)}${showTaylor ? `; Taylor sum ${fmtC(sum, 3)}` : ""}`} className="euler-svg">
    <rect width="320" height="280" fill="#f8fafc" />
    {grid && [-1, -.5, .5, 1].map(v => <g key={v} stroke="#dbe4ed"><line x1={x(v)} x2={x(v)} y1="25" y2="255" /><line x1="20" x2="300" y1={y(v)} y2={y(v)} /></g>)}
    <line x1="15" y1="140" x2="305" y2="140" stroke={EULER_COLORS.real} /><line x1="160" y1="20" x2="160" y2="260" stroke={EULER_COLORS.imaginary} />
    <circle cx="160" cy="140" r={scale} stroke="#94a3b8" fill="none" />
    <path d={path} stroke={EULER_COLORS.exact} strokeWidth="3" fill="none" />
    <path d={arc} stroke={EULER_COLORS.angle} strokeWidth="2" fill="none" />
    <line x1="160" y1="140" x2={x(p.re)} y2={y(p.im)} stroke={EULER_COLORS.angle} strokeWidth="2" />
    <line x1={x(p.re)} y1={y(p.im)} x2={x(p.re)} y2="140" stroke={EULER_COLORS.imaginary} strokeDasharray="5 4" />
    <line x1="160" y1={y(p.im)} x2={x(p.re)} y2={y(p.im)} stroke={EULER_COLORS.real} strokeDasharray="5 4" />
    <circle cx={x(p.re)} cy={y(p.im)} r="6" fill={EULER_COLORS.exact} />
    {showTaylor && <><polyline points={[[160, 140], ...partials.map(v => [x(v.re), y(v.im)])].map(v => v.join(",")).join(" ")} stroke={EULER_COLORS.taylor} strokeWidth="2" fill="none" strokeDasharray="4 3" /><rect x={x(sum.re) - 5} y={y(sum.im) - 5} width="10" height="10" fill={EULER_COLORS.taylor} /><line x1={x(sum.re)} y1={y(sum.im)} x2={x(p.re)} y2={y(p.im)} stroke={EULER_COLORS.taylor} strokeDasharray="2 2" /></>}
    {labels && <g fontSize="12" fill="#334155"><text x="220" y="132">Re = cos θ</text><text x="168" y="22">Im = sin θ</text><text x="185" y="115" fill={EULER_COLORS.angle}>θ</text><text x="12" y="274">{showTaylor ? `Taylor path; axis extent ±${extent.toFixed(1)}` : "Radius = 1 · counterclockwise rotation"}</text></g>}
  </svg>;
}

export function EulerWaves({ degrees, grid, labels, zoom = 1 }: { degrees: number; grid: boolean; labels: boolean; zoom?: number }) {
  const x = (d: number) => 40 + d / 720 * 360;
  const amplitude = 42 * zoom;
  const curve = (kind: "re" | "im", center: number) => Array.from({ length: 241 }, (_, i) => `${i ? "L" : "M"}${x(i * 3)},${center - amplitude * eulerPoint(i * 3)[kind]}`).join(" ");
  const p = eulerPoint(degrees);
  return <svg viewBox="0 0 440 280" role="img" aria-label={`Real and imaginary projections: cos θ ${p.re.toFixed(3)}, sin θ ${p.im.toFixed(3)}`} className="euler-svg">
    <rect width="440" height="280" fill="#f8fafc" />
    {grid && [0, 180, 360, 540, 720].map(d => <line key={d} x1={x(d)} x2={x(d)} y1="30" y2="250" stroke="#dbe4ed" />)}
    {[90, 205].map(c => <line key={c} x1="35" x2="405" y1={c} y2={c} stroke="#94a3b8" />)}
    <path d={curve("re", 90)} fill="none" stroke={EULER_COLORS.real} strokeWidth="2.5" /><path d={curve("im", 205)} fill="none" stroke={EULER_COLORS.imaginary} strokeWidth="2.5" />
    <line x1={x(degrees)} x2={x(degrees)} y1="30" y2="250" stroke={EULER_COLORS.angle} strokeDasharray="4 3" />
    <circle cx={x(degrees)} cy={90 - amplitude * p.re} r="5" fill={EULER_COLORS.real} /><circle cx={x(degrees)} cy={205 - amplitude * p.im} r="5" fill={EULER_COLORS.imaginary} />
    {labels && <g fill="#334155" fontSize="12"><text x="10" y="24" fill={EULER_COLORS.real}>Real: cos θ</text><text x="10" y="151" fill={EULER_COLORS.imaginary}>Imaginary: sin θ</text><text x="5" y={90 - amplitude}>1</text><text x="3" y={90 + amplitude}>−1</text><text x="5" y={205 - amplitude}>1</text><text x="3" y={205 + amplitude}>−1</text>{[0, 180, 360, 540, 720].map(d => <text key={d} x={x(d) - 6} y="271">{d === 0 ? "0" : `${d / 180 === 1 ? "" : d / 180}π`}</text>)}<text x="420" y="271">θ</text></g>}
  </svg>;
}
