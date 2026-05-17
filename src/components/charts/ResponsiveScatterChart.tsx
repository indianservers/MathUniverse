import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { GraphPoint } from "../../utils/graph";

type ResponsiveScatterChartProps = {
  data: GraphPoint[];
  color?: string;
};

export default function ResponsiveScatterChart({ data, color = "#8b5cf6" }: ResponsiveScatterChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
        <XAxis dataKey="x" type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <YAxis dataKey="y" type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
        <Scatter data={data} fill={color} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
