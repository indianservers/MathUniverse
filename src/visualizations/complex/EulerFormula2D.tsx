import { useEffect, useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { radiansToDegrees, roundTo } from "../../utils/math";

const center = 180;
const radius = 120;

export default function EulerFormula2D() {
  const [theta, setTheta] = useState(Math.PI / 4);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTheta((value) => (value + 0.035) % (Math.PI * 2)), 30);
    return () => window.clearInterval(id);
  }, [playing]);
  const x = Math.cos(theta);
  const y = Math.sin(theta);
  const px = center + x * radius;
  const py = center - y * radius;
  const trail = Array.from({ length: 40 }, (_, i) => {
    const t = theta * (i / 39);
    return `${center + Math.cos(t) * radius},${center - Math.sin(t) * radius}`;
  }).join(" ");
  const special = Math.abs(theta) < 0.02 ? "e^(i0)=1" : Math.abs(theta - Math.PI / 2) < 0.02 ? "e^(iπ/2)=i" : Math.abs(theta - Math.PI) < 0.02 ? "e^(iπ)=-1" : Math.abs(theta - Math.PI * 2) < 0.02 ? "e^(i2π)=1" : `e^(iθ)=${roundTo(x, 3)} ${y >= 0 ? "+" : "-"} ${Math.abs(roundTo(y, 3))}i`;

  return (
    <SectionCard title="Euler Formula 2D" description="Euler's formula says complex exponential motion is circular rotation.">
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title="Euler Formula" formula={"e^{i\\theta}=\\cos\\theta+i\\sin\\theta"} />
          <SliderControl label="theta" value={theta} min={0} max={Math.PI * 2} step={0.01} onChange={setTheta} unit="rad" />
          <div className="flex flex-wrap gap-2">{[[0, "0"], [Math.PI / 2, "π/2"], [Math.PI, "π"], [Math.PI * 1.5, "3π/2"], [Math.PI * 2, "2π"]].map(([value, label]) => <button key={label as string} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => setTheta(value as number)}>{label as string}</button>)}</div>
          <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="theta" value={`${roundTo(theta, 3)} rad`} />
            <Metric label="degrees" value={`${roundTo(radiansToDegrees(theta), 1)} deg`} />
            <Metric label="cos theta" value={x} />
            <Metric label="sin theta" value={y} />
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 font-mono text-sm dark:bg-white/10">{special}</div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg viewBox="0 0 360 360" className="h-[360px] w-full">
            <circle cx={center} cy={center} r={radius} fill="rgba(34,211,238,.08)" stroke="#06b6d4" strokeWidth="3" />
            <line x1="40" x2="320" y1={center} y2={center} stroke="#64748b" />
            <line x1={center} x2={center} y1="40" y2="320" stroke="#64748b" />
            <path d={`M 220 180 A 40 40 0 ${theta > Math.PI ? 1 : 0} 0 ${center + Math.cos(theta) * 40} ${center - Math.sin(theta) * 40}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
            <polyline points={trail} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
            <line x1={center} y1={center} x2={px} y2={py} stroke="#22d3ee" strokeWidth="4" />
            <line x1={px} y1={py} x2={px} y2={center} stroke="#3b82f6" strokeDasharray="6 5" />
            <line x1={px} y1={py} x2={center} y2={py} stroke="#ef4444" strokeDasharray="6 5" />
            <circle cx={px} cy={py} r="8" fill="#f59e0b" />
            <text x={px + 10} y={py - 10} fill="#f59e0b" fontWeight="700">e^iθ</text>
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="Euler's formula turns exponential growth with imaginary direction into rotation."
          formula="e^(i theta) = cos(theta) + i sin(theta)"
          changes="Changing theta rotates the point around the unit circle. The green trail shows the rotation from 1 to the current angle."
          realWorldUse="Wave motion, AC circuits, Fourier analysis, signal processing, and rotations."
          steps={["Start at 1 on the real axis.", `Rotate by theta=${roundTo(theta, 3)} radians.`, `Read coordinates cos=${roundTo(x, 3)}, sin=${roundTo(y, 3)}.`, special]}
          tasks={["Rotate by π radians.", "Set θ = π/2 and get i.", "Set θ = 2π and return to 1."]}
        />
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{typeof value === "number" ? roundTo(value, 3) : value}</p></div>;
}
