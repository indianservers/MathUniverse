import { useMemo, useState } from "react";
import { Scatter, ScatterChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { compileFunctionExpression } from "../utils/functionParser";

export default function PolarCoordinatesVisualizer() {
  const [expr, setExpr] = useState("2*sin(4*x)");
  const [theta, setTheta] = useState(Math.PI * 2);
  const data = useMemo(() => makePolar(expr, theta), [expr, theta]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Polar Coordinates Visualizer" subtitle="Plot r = f(theta) curves with a live angle sweep for roses, spirals, and lemniscates." difficulty="Visualizer" estimatedMinutes={8} />
      <SectionCard title="Polar Function">
        <div className="grid gap-4 md:grid-cols-[1fr_320px]">
          <input className="rounded-2xl border border-slate-200 bg-white p-4 font-mono dark:border-white/10 dark:bg-slate-950/60" value={expr} onChange={(event) => setExpr(event.target.value)} />
          <SliderControl label="Angle sweep theta" value={theta} min={0.1} max={Math.PI * 8} step={0.03} onChange={setTheta} />
        </div>
      </SectionCard>
      <GraphCard title="Polar Curve">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.3)" />
            <XAxis dataKey="x" type="number" stroke="#94a3b8" />
            <YAxis dataKey="y" type="number" stroke="#94a3b8" />
            <Tooltip />
            <Line data={data} dataKey="y" stroke="#8b5cf6" dot={false} />
            <Scatter data={data.slice(-1)} fill="#f97316" />
          </ScatterChart>
        </ResponsiveContainer>
      </GraphCard>
    </div>
  );
}

function makePolar(expr: string, thetaMax: number) {
  try {
    const r = compileFunctionExpression(expr);
    return Array.from({ length: 260 }, (_, index) => {
      const theta = (index / 259) * thetaMax;
      const radius = r(theta);
      return { x: radius * Math.cos(theta), y: radius * Math.sin(theta) };
    });
  } catch {
    return [];
  }
}
