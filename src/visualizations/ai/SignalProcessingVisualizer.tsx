import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { generateRange } from "../../utils/graph";

export default function SignalProcessingVisualizer() {
  const [f1, setF1] = useState(1);
  const [f2, setF2] = useState(3);
  const [noise, setNoise] = useState(0.25);
  const data = useMemo(() => generateRange(0, Math.PI * 4, 0.08).map((x) => {
    const clean = Math.sin(f1 * x) + 0.5 * Math.sin(f2 * x);
    const noisy = clean + noise * Math.sin(17 * x);
    return { x, signal: noisy, filtered: clean };
  }), [f1, f2, noise]);
  return (
    <SectionCard title="Signal Processing Visualizer" description="Signals can be decomposed into waves, connecting Fourier analysis, audio, radar, and neural frequency analysis.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4"><SliderControl label="Frequency 1" value={f1} min={0.5} max={5} step={0.1} onChange={setF1} /><SliderControl label="Frequency 2" value={f2} min={0.5} max={8} step={0.1} onChange={setF2} /><SliderControl label="Noise level" value={noise} min={0} max={1} step={0.05} onChange={setNoise} /></div>
        <GraphCard title="Signal and Filtered Signal">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" /><XAxis dataKey="x" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <Line dataKey="signal" stroke="#f43f5e" strokeWidth={2} dot={false} /><Line dataKey="filtered" stroke="#06b6d4" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
    </SectionCard>
  );
}
