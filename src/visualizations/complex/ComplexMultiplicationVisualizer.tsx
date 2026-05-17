import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { complexAngle, complexMagnitude, complexMultiply } from "../../utils/complex";
import { radiansToDegrees, roundTo } from "../../utils/math";

const center = 180;
const scale = 30;
const pt = (x: number, y: number) => ({ x: center + x * scale, y: center - y * scale });

export default function ComplexMultiplicationVisualizer() {
  const [a, setA] = useState(1.8);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0.8);
  const [d, setD] = useState(1.1);
  const z3 = useMemo(() => complexMultiply({ a, b }, { a: c, b: d }), [a, b, c, d]);
  const p1 = pt(a, b);
  const p2 = pt(c, d);
  const p3 = pt(z3.a, z3.b);

  return (
    <SectionCard title="Complex Multiplication as Rotation" description="Multiplying complex numbers rotates by the second angle and scales by the second magnitude.">
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <SliderControl label="z1 real a" value={a} min={-3} max={3} step={0.1} onChange={setA} />
            <SliderControl label="z1 imag b" value={b} min={-3} max={3} step={0.1} onChange={setB} />
            <SliderControl label="z2 real c" value={c} min={-3} max={3} step={0.1} onChange={setC} />
            <SliderControl label="z2 imag d" value={d} min={-3} max={3} step={0.1} onChange={setD} />
          </div>
          <FormulaBlock title="Multiplication" formula="(a+bi)(c+di)=(ac-bd)+(ad+bc)i" />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="|z1|" value={complexMagnitude(a, b)} />
            <Metric label="arg z1" value={`${roundTo(radiansToDegrees(complexAngle(a, b)), 1)} deg`} />
            <Metric label="|z2|" value={complexMagnitude(c, d)} />
            <Metric label="arg z2" value={`${roundTo(radiansToDegrees(complexAngle(c, d)), 1)} deg`} />
            <Metric label="|z3|" value={complexMagnitude(z3.a, z3.b)} />
            <Metric label="arg z3" value={`${roundTo(radiansToDegrees(complexAngle(z3.a, z3.b)), 1)} deg`} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg viewBox="0 0 360 360" className="h-[380px] w-full">
            <defs><marker id="arrow-mul" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker></defs>
            {Array.from({ length: 13 }, (_, i) => { const pos = 180 + (i - 6) * 30; return <g key={i}><line x1={pos} x2={pos} y1="0" y2="360" stroke="rgba(148,163,184,.18)" /><line x1="0" x2="360" y1={pos} y2={pos} stroke="rgba(148,163,184,.18)" /></g>; })}
            <line x1="10" x2="350" y1="180" y2="180" stroke="#64748b" /><line x1="180" x2="180" y1="10" y2="350" stroke="#64748b" />
            <Vector p={p1} color="#22d3ee" label="z1" />
            <Vector p={p2} color="#a78bfa" label="z2" />
            <motion.line x1={center} y1={center} animate={{ x2: p3.x, y2: p3.y }} stroke="#f59e0b" strokeWidth="4" markerEnd="url(#arrow-mul)" />
            <motion.circle animate={{ cx: p3.x, cy: p3.y }} r="8" fill="#f59e0b" />
            <text x={p3.x + 8} y={p3.y - 8} fill="#f59e0b" fontWeight="700">z1*z2</text>
          </svg>
        </div>
      </div>
    </SectionCard>
  );
}

function Vector({ p, color, label }: { p: { x: number; y: number }; color: string; label: string }) {
  return <g><line x1={center} y1={center} x2={p.x} y2={p.y} stroke={color} strokeWidth="3" markerEnd="url(#arrow-mul)" /><circle cx={p.x} cy={p.y} r="6" fill={color} /><text x={p.x + 8} y={p.y - 8} fill={color} fontWeight="700">{label}</text></g>;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{typeof value === "number" ? roundTo(value, 3) : value}</p></div>;
}
