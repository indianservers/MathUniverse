import { useCallback, useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { generateRange } from "../../utils/graph";
import { roundTo } from "../../utils/math";

const loss = (x: number) => (x - 2) ** 2 + 1;
const gradient = (x: number) => 2 * (x - 2);

export default function GradientDescentVisualizer() {
  const [x, setX] = useState(-4);
  const [lr, setLr] = useState(0.12);
  const [steps, setSteps] = useState(0);
  const [auto, setAuto] = useState(false);
  const data = useMemo(() => generateRange(-5, 6, 0.1).map((v) => ({ x: v, y: loss(v) })), []);
  const step = useCallback(() => { setX((value) => value - lr * gradient(value)); setSteps((value) => value + 1); }, [lr]);
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(step, 600);
    return () => window.clearInterval(id);
  }, [auto, step]);

  return (
    <SectionCard title="Gradient Descent Visualizer" description="AI models learn by reducing loss through gradient descent.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="Learning rate" value={lr} min={0.01} max={0.5} step={0.01} onChange={setLr} />
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950" onClick={step}>Step</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => setAuto((value) => !value)}>{auto ? "Pause" : "Auto Run"}</button>
            <button className="col-span-2 rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => { setX(-4); setSteps(0); setAuto(false); }}>Reset</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm"><Metric label="x" value={x} /><Metric label="loss" value={loss(x)} /><Metric label="gradient" value={gradient(x)} /><Metric label="steps" value={steps} /></div>
        </div>
        <GraphCard title="Loss Curve">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" /><XAxis dataKey="x" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <Line dataKey="y" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              <ReferenceDot x={x} y={loss(x)} r={7} fill="#f59e0b" stroke="#0f172a" />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{roundTo(value, 4)}</p></div>;
}
