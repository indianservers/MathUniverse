import { useState } from "react";
import { ReactNode } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";
import { vectorMagnitude } from "../../utils/linearAlgebra";

const center = 180;
const scale = 16;
const toSvg = (x: number, y: number) => ({ x: center + x * scale, y: center - y * scale });

export default function VectorVisualizer() {
  const [x, setX] = useState(5);
  const [y, setY] = useState(3);
  const [showSecond, setShowSecond] = useState(true);
  const [u, setU] = useState(-2);
  const [v, setV] = useState(4);
  const p = toSvg(x, y);
  const q = toSvg(u, v);
  const r = toSvg(x + u, y + v);
  const dot = x * u + y * v;
  const mag1 = vectorMagnitude([x, y]);
  const mag2 = vectorMagnitude([u, v]);
  const angle = mag1 * mag2 === 0 ? 0 : Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180 / Math.PI;
  const projectionScale = mag2 === 0 ? 0 : dot / (mag2 * mag2);
  const projection = toSvg(u * projectionScale, v * projectionScale);

  return (
    <SectionCard title="Vector Visualizer" description="Vectors represent magnitude and direction. Add a second vector to see the resultant.">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <SliderControl label="x" value={x} min={-10} max={10} step={0.5} onChange={setX} />
          <SliderControl label="y" value={y} min={-10} max={10} step={0.5} onChange={setY} />
          <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">
            <input type="checkbox" checked={showSecond} onChange={(e) => setShowSecond(e.target.checked)} />
            Enable vector addition
          </label>
          {showSecond && <><SliderControl label="u" value={u} min={-10} max={10} step={0.5} onChange={setU} /><SliderControl label="v" value={v} min={-10} max={10} step={0.5} onChange={setV} /></>}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="vector" value={`[${x}, ${y}]`} />
            <Metric label="magnitude" value={mag1} />
            <Metric label="angle" value={`${roundTo(Math.atan2(y, x) * 180 / Math.PI, 1)} deg`} />
            {showSecond && <Metric label="resultant" value={`[${x + u}, ${y + v}]`} />}
            {showSecond && <Metric label="dot product" value={dot} />}
            {showSecond && <Metric label="angle u/v" value={`${roundTo(angle, 2)} deg`} />}
          </div>
        </div>
        <VectorPlane>
          <VectorLine p={p} color="#22d3ee" label="v" />
          <line x1={p.x} y1={p.y} x2={p.x} y2={center} stroke="#22d3ee" strokeDasharray="5 5" />
          <line x1={p.x} y1={p.y} x2={center} y2={p.y} stroke="#22d3ee" strokeDasharray="5 5" />
          {showSecond && <><VectorLine p={q} color="#a78bfa" label="u" /><line x1={center} y1={center} x2={projection.x} y2={projection.y} stroke="#ef4444" strokeWidth="4" strokeDasharray="6 4" /><VectorLine p={r} color="#f59e0b" label="v+u" /></>}
        </VectorPlane>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="Vectors represent direction and magnitude, and vector operations describe relationships between directions."
          formula="u · v = |u||v|cos(theta)"
          changes="Changing components changes length, angle, dot product, projection, and resultant."
          realWorldUse="Forces, velocity, graphics, AI embeddings, robotics, and physics."
          steps={[`Vector v length is ${roundTo(mag1, 3)}.`, showSecond ? `Dot product is ${roundTo(dot, 3)}.` : "Enable the second vector to compare directions.", showSecond ? `Angle between vectors is ${roundTo(angle, 2)} degrees.` : "Projection appears when vector addition is enabled.", "The gold vector shows u + v by the triangle/parallelogram rule."]}
          tasks={["Make vectors perpendicular.", "Make vectors parallel.", "Make dot product negative.", "Observe the projection line."]}
        />
      </div>
    </SectionCard>
  );
}

function VectorPlane({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60"><svg viewBox="0 0 360 360" className="h-[380px] w-full"><defs><marker id="vec-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker></defs>{Array.from({ length: 21 }, (_, i) => { const pos = i * 18; return <g key={i}><line x1={pos} x2={pos} y1="0" y2="360" stroke="rgba(148,163,184,.18)" /><line x1="0" x2="360" y1={pos} y2={pos} stroke="rgba(148,163,184,.18)" /></g>; })}<line x1="0" x2="360" y1="180" y2="180" stroke="#64748b" /><line x1="180" x2="180" y1="0" y2="360" stroke="#64748b" />{children}</svg></div>;
}

function VectorLine({ p, color, label }: { p: { x: number; y: number }; color: string; label: string }) {
  return <g><line x1={center} y1={center} x2={p.x} y2={p.y} stroke={color} strokeWidth="4" markerEnd="url(#vec-arrow)" /><circle cx={p.x} cy={p.y} r="6" fill={color} /><text x={p.x + 8} y={p.y - 8} fill={color} fontWeight="700">{label}</text></g>;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{typeof value === "number" ? roundTo(value, 3) : value}</p></div>;
}
