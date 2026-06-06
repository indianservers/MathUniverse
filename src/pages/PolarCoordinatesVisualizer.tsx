import { useMemo, useState } from "react";
import { Scatter, ScatterChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";
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
          <input className="premium-input min-h-12" value={expr} onChange={(event) => setExpr(event.target.value)} />
          <SliderControl label="Angle sweep theta" value={theta} min={0.1} max={Math.PI * 8} step={0.03} onChange={setTheta} />
        </div>
      </SectionCard>
      <SectionCard title="Polar Curve" description="The radius equation draws roses, spirals, and lemniscates as a glowing sweep." compact tone="spotlight">
        <div className="cinematic-graph-stage p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,181,253,.22)" />
            <XAxis dataKey="x" type="number" stroke="#ddd6fe" tick={{ fill: "#ddd6fe", fontSize: 11 }} />
            <YAxis dataKey="y" type="number" stroke="#ddd6fe" tick={{ fill: "#ddd6fe", fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid rgba(196,181,253,.25)", background: "rgba(2,6,23,.94)", color: "#f8fafc" }} labelStyle={{ color: "#ede9fe" }} />
            <Line data={data} dataKey="y" stroke="#c084fc" strokeWidth={4} dot={false} />
            <Scatter data={data.slice(-1)} fill="#f97316" />
          </ScatterChart>
        </ResponsiveContainer>
        </div>
      </SectionCard>
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
