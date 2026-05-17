import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GraphPoint } from "../../utils/graph";

type ResponsiveLineChartProps = {
  data: GraphPoint[];
  lineColor?: string;
};

export default function ResponsiveLineChart({ data, lineColor = "#06b6d4" }: ResponsiveLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
        <XAxis dataKey="x" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
        <Line type="monotone" dataKey="y" stroke={lineColor} strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
