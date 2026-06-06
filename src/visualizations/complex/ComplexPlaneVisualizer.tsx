import { useState } from "react";
import { ReactNode } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { complexAngle, complexMagnitude } from "../../utils/complex";
import { radiansToDegrees, roundTo } from "../../utils/math";

const center = 180;
const scale = 28;
const toSvg = (x: number, y: number) => ({ x: center + x * scale, y: center - y * scale });

function quadrant(a: number, b: number) {
  if (Math.abs(a) < 0.001 && Math.abs(b) < 0.001) return "Origin";
  if (Math.abs(a) < 0.001) return "Imaginary axis";
  if (Math.abs(b) < 0.001) return "Real axis";
  if (a > 0 && b > 0) return "Quadrant I";
  if (a < 0 && b > 0) return "Quadrant II";
  if (a < 0 && b < 0) return "Quadrant III";
  return "Quadrant IV";
}

export default function ComplexPlaneVisualizer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [operation, setOperation] = useState("Conjugate");
  const p = toSvg(a, b);
  const conjugate = toSvg(a, -b);
  const r = complexMagnitude(a, b);
  const theta = complexAngle(a, b);

  return (
    <SectionCard title="Complex Plane Visualizer" description="Complex numbers combine a real direction and an imaginary direction.">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <SliderControl label="Real part a" value={a} min={-5} max={5} step={0.1} onChange={setA} />
          <SliderControl label="Imaginary part b" value={b} min={-5} max={5} step={0.1} onChange={setB} />
          <label className="block rounded-xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">Operation<select className="premium-input mt-2" value={operation} onChange={(e) => setOperation(e.target.value)}><option>Add</option><option>Subtract</option><option>Multiply</option><option>Conjugate</option></select></label>
          <button className="action-primary w-full" onClick={() => { setA(3); setB(2); }}>Reset</button>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="Real" value={a} />
            <Metric label="Imaginary" value={b} />
            <Metric label="|z|" value={r} />
            <Metric label="theta" value={`${roundTo(theta, 3)} rad`} />
            <Metric label="degrees" value={`${roundTo(radiansToDegrees(theta), 1)} deg`} />
            <Metric label="quadrant" value={quadrant(a, b)} />
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            z = {roundTo(a, 2)} {b >= 0 ? "+" : "-"} {Math.abs(roundTo(b, 2))}i
            <br />
            polar: {roundTo(r, 3)} angle {roundTo(radiansToDegrees(theta), 1)} deg
            <br />
            z = {roundTo(r, 3)}(cos {roundTo(theta, 3)} + i sin {roundTo(theta, 3)})
            <br />
            conjugate = {roundTo(a, 2)} {b >= 0 ? "-" : "+"} {Math.abs(roundTo(b, 2))}i
          </div>
        </div>
        <Plane cinematic>
          <line x1={center} y1={center} x2={p.x} y2={p.y} stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow)" />
          <line x1={p.x} y1={p.y} x2={p.x} y2={center} stroke="#a78bfa" strokeDasharray="6 5" />
          <line x1={p.x} y1={p.y} x2={center} y2={p.y} stroke="#f59e0b" strokeDasharray="6 5" />
          <circle cx={p.x} cy={p.y} r="8" fill="#f59e0b" />
          {operation === "Conjugate" && <><line x1={center} y1={center} x2={conjugate.x} y2={conjugate.y} stroke="#ef4444" strokeWidth="3" strokeDasharray="6 5" /><circle cx={conjugate.x} cy={conjugate.y} r="7" fill="#ef4444" /><text x={conjugate.x + 10} y={conjugate.y + 18} fill="#ef4444" fontWeight="700">conj</text></>}
          <text x={p.x + 10} y={p.y - 10} fill="#f59e0b" fontWeight="700">z</text>
        </Plane>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="Complex numbers are points and vectors on a plane with real and imaginary axes."
          formula="z = a + bi = r angle theta = r(cos theta + i sin theta)"
          changes="Changing a moves horizontally. Changing b moves vertically. The magnitude and angle update immediately."
          realWorldUse="Rotations, waves, electrical engineering, quantum mechanics, Fourier analysis, and graphics."
          steps={[`Rectangular form: ${roundTo(a, 2)} ${b >= 0 ? "+" : "-"} ${Math.abs(roundTo(b, 2))}i.`, `Magnitude r=${roundTo(r, 3)}.`, `Angle theta=${roundTo(radiansToDegrees(theta), 2)} degrees.`, `Conjugate reflects the point across the real axis.`]}
          tasks={["Set b = 0 to land on the real axis.", "Set a = 0 to land on the imaginary axis.", "Plot the conjugate.", "Move into each quadrant."]}
        />
      </div>
    </SectionCard>
  );
}

export function Plane({ children, size = 360, extent = 6, cinematic = false }: { children: ReactNode; size?: number; extent?: number; cinematic?: boolean }) {
  return (
    <div className={cinematic ? "rounded-xl bg-slate-950 p-3 shadow-inner shadow-cyan-950/30" : "rounded-2xl bg-white p-3 dark:bg-slate-950/60"}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-[360px] w-full">
        <defs>
          <radialGradient id="complex-plane-bg" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#12395a" stopOpacity="0.72" />
            <stop offset="58%" stopColor="#07182d" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <filter id="complex-plane-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" />
          </marker>
        </defs>
        {cinematic && <rect x="0" y="0" width={size} height={size} fill="url(#complex-plane-bg)" />}
        {Array.from({ length: extent * 2 + 1 }, (_, i) => {
          const pos = center + (i - extent) * scale;
          return (
            <g key={i}>
              <line x1={pos} x2={pos} y1="0" y2={size} stroke={cinematic ? "rgba(103,232,249,.16)" : "rgba(148,163,184,.2)"} />
              <line x1="0" x2={size} y1={pos} y2={pos} stroke={cinematic ? "rgba(103,232,249,.16)" : "rgba(148,163,184,.2)"} />
            </g>
          );
        })}
        <line x1="18" x2="342" y1={center} y2={center} stroke={cinematic ? "#e2e8f0" : "#64748b"} strokeWidth="2" opacity={cinematic ? 0.72 : 1} />
        <line x1={center} x2={center} y1="18" y2="342" stroke={cinematic ? "#e2e8f0" : "#64748b"} strokeWidth="2" opacity={cinematic ? 0.72 : 1} />
        <text x="315" y="168" fill={cinematic ? "#bae6fd" : "#64748b"}>Re</text>
        <text x="190" y="34" fill={cinematic ? "#bae6fd" : "#64748b"}>Im</text>
        <g filter={cinematic ? "url(#complex-plane-glow)" : undefined}>{children}</g>
      </svg>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{typeof value === "number" ? roundTo(value, 3) : value}</p></div>;
}
