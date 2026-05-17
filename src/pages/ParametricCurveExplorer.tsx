import { useMemo, useState } from "react";
import { Scatter, ScatterChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { compileFunctionExpression } from "../utils/functionParser";

export default function ParametricCurveExplorer() {
  const [xExpr, setXExpr] = useState("cos(x)");
  const [yExpr, setYExpr] = useState("sin(x)");
  const [tMax, setTMax] = useState(Math.PI * 2);
  const data = useMemo(() => makeParametric(xExpr, yExpr, tMax), [xExpr, yExpr, tMax]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Parametric Curve Explorer" subtitle="Use x(t), y(t), and a live time sweep to trace a curve." difficulty="Visualizer" estimatedMinutes={8} />
      <SectionCard title="Parametric Controls">
        <div className="grid gap-3 md:grid-cols-3"><Expr label="x(t)" value={xExpr} onChange={setXExpr} /><Expr label="y(t)" value={yExpr} onChange={setYExpr} /><SliderControl label="Time sweep t" value={tMax} min={0.1} max={Math.PI * 8} step={0.05} onChange={setTMax} /></div>
      </SectionCard>
      <GraphCard title="Traced Parametric Curve">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.3)" />
            <XAxis dataKey="x" type="number" stroke="#94a3b8" />
            <YAxis dataKey="y" type="number" stroke="#94a3b8" />
            <Tooltip />
            <Line dataKey="y" data={data} stroke="#06b6d4" dot={false} />
            <Scatter data={data.slice(-1)} fill="#f97316" />
          </ScatterChart>
        </ResponsiveContainer>
      </GraphCard>
    </div>
  );
}

function Expr({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label><span className="text-sm font-bold">{label}</span><input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950/60" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function makeParametric(xExpr: string, yExpr: string, tMax: number) {
  try {
    const fx = compileFunctionExpression(xExpr);
    const fy = compileFunctionExpression(yExpr);
    return Array.from({ length: 180 }, (_, index) => {
      const t = (index / 179) * tMax;
      return { x: fx(t), y: fy(t) };
    });
  } catch {
    return [];
  }
}
