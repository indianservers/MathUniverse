import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FormulaBlock from "../../components/ui/FormulaBlock";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { generateRange } from "../../utils/graph";
import { roundTo } from "../../utils/math";
import { normalPdf } from "../../utils/statistics";

export default function NormalDistributionVisualizer() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1.4);
  const [lower, setLower] = useState(-1);
  const [upper, setUpper] = useState(1);
  const lo = Math.min(lower, upper);
  const hi = Math.max(lower, upper);
  const data = useMemo(() => generateRange(-8, 8, 0.08).map((x) => {
    const y = normalPdf(x, mu, sigma);
    return { x, y, shaded: x >= lo && x <= hi ? y : 0 };
  }), [mu, sigma, lo, hi]);
  const probability = useMemo(() => {
    const dx = (hi - lo) / 500;
    if (dx <= 0) return 0;
    return Array.from({ length: 500 }, (_, i) => normalPdf(lo + (i + 0.5) * dx, mu, sigma) * dx).reduce((sum, value) => sum + value, 0);
  }, [lo, hi, mu, sigma]);

  return (
    <SectionCard title="Normal Distribution Visualizer" description="Mean shifts the curve; standard deviation spreads it.">
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title="Normal PDF" formula={"f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}"} />
          <SliderControl label="Mean mu" value={mu} min={-5} max={5} step={0.1} onChange={setMu} />
          <SliderControl label="Std dev sigma" value={sigma} min={0.5} max={5} step={0.1} onChange={setSigma} />
          <SliderControl label="Lower bound" value={lower} min={-8} max={8} step={0.1} onChange={setLower} />
          <SliderControl label="Upper bound" value={upper} min={-8} max={8} step={0.1} onChange={setUpper} />
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="font-bold">P({roundTo(lo, 2)} <= X <= {roundTo(hi, 2)}) ≈ {roundTo(probability, 4)}</p></div>
        </div>
        <GraphCard title="Bell Curve">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />
              <XAxis dataKey="x" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <Area dataKey="shaded" fill="#22d3ee" stroke="none" fillOpacity={0.35} />
              <Line dataKey="y" stroke="#8b5cf6" strokeWidth={3} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
    </SectionCard>
  );
}
