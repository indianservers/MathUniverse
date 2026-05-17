import { useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceDot, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import SectionCard from "../../components/ui/SectionCard";
import { correlation, linearRegression } from "../../utils/statistics";
import { roundTo } from "../../utils/math";

type Point = { x: number; y: number };
const initialData: Point[] = [{ x: 1, y: 2 }, { x: 2, y: 2.8 }, { x: 3, y: 3.1 }, { x: 4, y: 4.4 }, { x: 5, y: 5.1 }, { x: 6, y: 5.7 }];

function interpretation(r: number) {
  const abs = Math.abs(r);
  if (abs < 0.2) return "no correlation";
  if (abs < 0.55) return r > 0 ? "weak positive" : "weak negative";
  return r > 0 ? "strong positive" : "strong negative";
}

export default function RegressionCorrelationVisualizer() {
  const [points, setPoints] = useState<Point[]>(initialData);
  const [xInput, setXInput] = useState("7");
  const [yInput, setYInput] = useState("6.4");
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const r = correlation(xs, ys);
  const regression = linearRegression(xs, ys);
  const line = useMemo(() => [{ x: 0, y: regression.predict(0) }, { x: 10, y: regression.predict(10) }], [regression]);

  const addManual = () => {
    const x = Number(xInput);
    const y = Number(yInput);
    if (Number.isFinite(x) && Number.isFinite(y)) setPoints((value) => [...value, { x, y }]);
  };

  return (
    <SectionCard title="Regression and Correlation Visualizer" description="Correlation measures relationship strength; regression estimates a trend line.">
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={xInput} onChange={(e) => setXInput(e.target.value)} aria-label="x value" />
            <input className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={yInput} onChange={(e) => setYInput(e.target.value)} aria-label="y value" />
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950" onClick={addManual}>Add point</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => setPoints((value) => [...value, { x: roundTo(Math.random() * 9 + 0.5, 2), y: roundTo(Math.random() * 7 + 1, 2) }])}>Random</button>
            <button className="col-span-2 rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => setPoints(initialData)}>Reset data</button>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="font-bold">r = {roundTo(r, 4)} ({interpretation(r)})</p>
            <p className="mt-2 text-sm">Regression: y = {roundTo(regression.slope, 3)}x {regression.intercept >= 0 ? "+" : "-"} {Math.abs(roundTo(regression.intercept, 3))}</p>
          </div>
        </div>
        <div className="h-[380px] rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />
              <XAxis type="number" dataKey="x" domain={[0, 10]} stroke="#94a3b8" /><YAxis type="number" dataKey="y" domain={[0, 10]} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <Scatter data={points} fill="#06b6d4" />
              <Line data={line} dataKey="y" stroke="#f59e0b" strokeWidth={3} dot={false} />
              {points.map((p, index) => <ReferenceDot key={index} x={p.x} y={p.y} r={4} fill="#06b6d4" stroke="#0f172a" />)}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionCard>
  );
}
