import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import SectionCard from "../../components/ui/SectionCard";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { radiansToDegrees, roundTo } from "../../utils/math";

type ComplexPoint = { a: number; b: number };

const size = 420;
const center = size / 2;
const scale = 72;
const radius = 2;
const baseAngle = Math.PI / 3;

const toSvg = (point: ComplexPoint) => ({ x: center + point.a * scale, y: center - point.b * scale });
const fromAngle = (theta: number): ComplexPoint => ({ a: radius * Math.cos(theta), b: radius * Math.sin(theta) });

export default function ComplexPlaneVisualizer() {
  const [theta, setTheta] = useState(baseAngle);
  const [burst, setBurst] = useState(1);
  const releaseTimer = useRef<number | null>(null);
  const z1 = useMemo(() => fromAngle(theta), [theta]);
  const z2 = useMemo(() => fromAngle(theta + (2 * Math.PI) / 3), [theta]);
  const z3 = useMemo(() => fromAngle(theta - (2 * Math.PI) / 3), [theta]);
  const points = [z1, z2, z3];
  const triangle = points.map(toSvg).map((p) => `${p.x},${p.y}`).join(" ");
  const angleDeg = normalizeDegrees(radiansToDegrees(theta));

  useEffect(() => () => {
    if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
  }, []);

  function setAngleWithBurst(next: number) {
    setTheta(next);
    setBurst(0.12);
    if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
    releaseTimer.current = window.setTimeout(() => setBurst(1), 70);
  }

  return (
    <SectionCard title="Argand Plane Triangle Model" description="Drag z1 on the radius-2 circle. z2 and z3 stay exactly 120 degrees apart and the triangle rotates as one rigid assembly.">
      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-400/20 dark:bg-cyan-400/10">
            <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Default target</p>
            <p className="mt-1 font-mono text-lg font-black">z1 = 1 + i√3</p>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">This is radius 2 at 60 degrees, so it sits on the faint circle.</p>
          </div>
          <label className="block rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">
            Rotate z1
            <input
              className="mt-3 w-full accent-cyan-500"
              type="range"
              min={0}
              max={360}
              step={1}
              value={angleDeg}
              onChange={(event) => setAngleWithBurst((Number(event.target.value) * Math.PI) / 180)}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="arg z1" value={`${roundTo(angleDeg, 1)} deg`} />
            <Metric label="|z1|" value="2" />
            <Metric label="z2 angle" value={`${roundTo(normalizeDegrees(angleDeg + 120), 1)} deg`} />
            <Metric label="z3 angle" value={`${roundTo(normalizeDegrees(angleDeg - 120), 1)} deg`} />
          </div>
          <button type="button" className="action-secondary w-full" onClick={() => setAngleWithBurst(baseAngle)}>
            <RotateCcw className="h-4 w-4" />Reset to 1 + i√3
          </button>
          <div className="rounded-xl bg-slate-100 p-3 font-mono text-sm dark:bg-white/10">
            {points.map((point, index) => (
              <p key={index}>z{index + 1} = {formatComplex(point)}</p>
            ))}
          </div>
        </div>

        <Plane onAngle={setAngleWithBurst}>
          <circle cx={center} cy={center} r={radius * scale} fill="#22d3ee" opacity="0.08" stroke="#67e8f9" strokeWidth="2" strokeDasharray="7 8" />
          <polygon points={triangle} fill="rgba(34,211,238,0.08)" stroke="#fde68a" strokeWidth="3" filter="url(#complex-plane-glow)" />
          {points.map((point, index) => {
            const target = toSvg(point);
            const animated = {
              x: center + (target.x - center) * (index === 0 ? 1 : burst),
              y: center + (target.y - center) * (index === 0 ? 1 : burst),
            };
            return (
              <g key={index} className="transition-all duration-300 ease-out">
                <line x1={center} y1={center} x2={animated.x} y2={animated.y} stroke={index === 0 ? "#22d3ee" : index === 1 ? "#a78bfa" : "#f59e0b"} strokeWidth="5" strokeLinecap="round" markerEnd="url(#complex-arrow)" filter="url(#complex-plane-glow)" />
                <circle cx={target.x} cy={target.y} r={index === 0 ? 11 : 8} fill={index === 0 ? "#f8fafc" : index === 1 ? "#a78bfa" : "#f59e0b"} stroke="#020617" strokeWidth="2" />
                <text x={target.x + 12} y={target.y - 10} fill="#f8fafc" fontSize="14" fontWeight="900" paintOrder="stroke" stroke="#020617" strokeWidth="4">z{index + 1}</text>
              </g>
            );
          })}
          <path d={`M ${center} ${center} L ${toSvg(z1).x} ${toSvg(z1).y} A ${radius * scale} ${radius * scale} 0 0 0 ${toSvg(z2).x} ${toSvg(z2).y}`} fill="none" stroke="#67e8f9" strokeWidth="2" strokeDasharray="4 5" opacity="0.75" />
          <text x={center + 26} y={center - 18} fill="#bae6fd" fontSize="13" fontWeight="800">120 deg spacing</text>
        </Plane>
      </div>
      <div className="mt-4">
        <VisualLearningPanel
          concept="The three complex numbers are radius-2 rotations separated by 120 degrees, so their tips form an equilateral triangle."
          formula="z_1=2cis(theta), z_2=2cis(theta+120deg), z_3=2cis(theta-120deg)"
          changes="Dragging z1 changes theta. The other vectors recompute from theta, so the triangle rotates rigidly without trailing artifacts."
          realWorldUse="Roots of unity, phase-balanced electrical systems, rotations, wave phasors, and symmetry."
          steps={[`z1 = ${formatComplex(z1)}`, `z2 = ${formatComplex(z2)}`, `z3 = ${formatComplex(z3)}`, "The terminal tips stay connected by equal illuminated sides."]}
          tasks={["Drag z1 around the circle.", "Reset to 1 + i√3.", "Watch z2 and z3 shoot outward after each movement.", "Verify all magnitudes remain 2."]}
        />
      </div>
    </SectionCard>
  );
}

export function Plane({ children, onAngle }: { children: ReactNode; onAngle?: (angle: number) => void }) {
  return (
    <div className="rounded-xl bg-slate-950 p-3 shadow-inner shadow-cyan-950/30">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-[420px] w-full cursor-crosshair rounded-lg"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * size;
          const y = ((event.clientY - rect.top) / rect.height) * size;
          onAngle?.(Math.atan2(center - y, x - center));
        }}
        onPointerMove={(event) => {
          if (event.buttons !== 1) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * size;
          const y = ((event.clientY - rect.top) / rect.height) * size;
          onAngle?.(Math.atan2(center - y, x - center));
        }}
      >
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
          <marker id="complex-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" />
          </marker>
        </defs>
        <rect x="0" y="0" width={size} height={size} fill="url(#complex-plane-bg)" />
        {Array.from({ length: 13 }, (_, i) => {
          const pos = center + (i - 6) * (scale / 2);
          return (
            <g key={i}>
              <line x1={pos} x2={pos} y1="0" y2={size} stroke="rgba(103,232,249,.14)" />
              <line x1="0" x2={size} y1={pos} y2={pos} stroke="rgba(103,232,249,.14)" />
            </g>
          );
        })}
        <line x1="22" x2={size - 22} y1={center} y2={center} stroke="#e2e8f0" strokeWidth="2" opacity="0.72" />
        <line x1={center} x2={center} y1="22" y2={size - 22} stroke="#e2e8f0" strokeWidth="2" opacity="0.72" />
        <text x={size - 48} y={center - 10} fill="#bae6fd" fontWeight="800">Re</text>
        <text x={center + 12} y="42" fill="#bae6fd" fontWeight="800">Im</text>
        {children}
      </svg>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function formatComplex(point: ComplexPoint) {
  const real = roundTo(point.a, 3);
  const imaginary = roundTo(point.b, 3);
  return `${real} ${imaginary >= 0 ? "+" : "-"} ${Math.abs(imaginary)}i`;
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}
