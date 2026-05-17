import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import { mean, median, mode, standardDeviation } from "../../utils/statistics";
import { roundTo } from "../../utils/math";

export default function MeanMedianModeVisualizer() {
  const [input, setInput] = useState("4, 7, 7, 9, 12, 15");
  const parsed = useMemo(() => {
    const parts = input.split(",").map((item) => item.trim()).filter(Boolean);
    const values = parts.map(Number);
    const valid = values.length > 0 && values.every(Number.isFinite);
    return { values: valid ? values : [], error: valid ? "" : "Enter comma-separated numbers only." };
  }, [input]);
  const values = parsed.values;
  const sorted = [...values].sort((a, b) => a - b);
  const stats = { mean: mean(values), median: median(values), mode: mode(values), range: values.length ? Math.max(...values) - Math.min(...values) : 0, sd: standardDeviation(values) };
  const data = values.map((value, index) => ({ name: `${index + 1}`, value }));

  return (
    <SectionCard title="Mean, Median, Mode Visualizer" description="Mean balances the data, median is the middle, and mode is the most frequent.">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <label className="block rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
            <span className="text-sm font-semibold">Dataset</span>
            <textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={input} onChange={(event) => setInput(event.target.value)} />
          </label>
          {parsed.error && <p className="rounded-2xl bg-rose-100 p-3 text-sm text-rose-700 dark:bg-rose-400/10 dark:text-rose-100">{parsed.error}</p>}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="Mean" value={stats.mean} /><Metric label="Median" value={stats.median} /><Metric label="Mode" value={stats.mode} /><Metric label="Range" value={stats.range} /><Metric label="Std dev" value={stats.sd} /><Metric label="Sorted" value={sorted.join(", ")} />
          </div>
        </div>
        <GraphCard title="Dataset Bars" description="The cyan line marks the mean.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />
              <XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <ReferenceLine y={stats.mean} stroke="#06b6d4" strokeWidth={3} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{typeof value === "number" ? roundTo(value, 3) : value}</p></div>;
}
