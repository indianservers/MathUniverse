import { useMemo, useState } from "react";
import { ReferenceArea, ReferenceDot, ReferenceLine } from "recharts";
import FormulaBlock from "../../components/ui/FormulaBlock";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { generateLinearData } from "../../utils/graph";
import { linearY, roundTo } from "../../utils/math";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LinearEquationVisualizer() {
  const [m, setM] = useState(1.5);
  const [c, setC] = useState(2);
  const data = useMemo(() => generateLinearData(m, c, -10, 10, 0.5), [m, c]);
  const sampleY = linearY(1, m, c);
  const table = [-2, -1, 0, 1, 2].map((x) => ({ x, y: linearY(x, m, c) }));
  const rootText = Math.abs(m) < 0.0001 ? (Math.abs(c) < 0.0001 ? "Every x is an x-intercept" : "No x-intercept") : `x = ${roundTo(-c / m, 3)}`;
  const slopeTriangle = [
    { x: 0, y: c },
    { x: 1, y: c },
    { x: 1, y: sampleY },
  ];

  return (
    <SectionCard title="Linear Equation Visualizer" description="Move the slope and intercept to see the line respond instantly.">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title="Current Formula" formula={`y=${roundTo(m, 2)}x${c >= 0 ? "+" : ""}${roundTo(c, 2)}`} />
          <SliderControl label="Slope m" value={m} min={-5} max={5} step={0.1} onChange={setM} />
          <SliderControl label="Intercept c" value={c} min={-10} max={10} step={0.5} onChange={setC} />
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" onClick={() => { setM(1.5); setC(2); }}>Reset</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold dark:bg-white/10" onClick={() => { setM(roundTo(Math.random() * 8 - 4, 1)); setC(roundTo(Math.random() * 12 - 6, 1)); }}>Random</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            {[["slope", m], ["intercept", c], ["x=1", sampleY]].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                <p className="font-bold">{roundTo(Number(value), 2)}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            <p className="font-semibold">x-intercept: {rootText}</p>
            <p className="mt-2">Cost model: cost = fixed cost + rate x quantity. Here rate = {roundTo(m, 2)} and fixed cost = {roundTo(c, 2)}.</p>
          </div>
          <table className="w-full overflow-hidden rounded-2xl text-sm">
            <thead className="bg-slate-200 dark:bg-white/10"><tr><th className="p-2 text-left">x</th><th className="p-2 text-left">y</th></tr></thead>
            <tbody>{table.map((row) => <tr key={row.x} className="border-t border-slate-200 dark:border-white/10"><td className="p-2">{row.x}</td><td className="p-2">{roundTo(row.y, 3)}</td></tr>)}</tbody>
          </table>
        </div>
        <GraphCard title="Line Graph" description="The cyan point marks the y-intercept.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />
              <XAxis dataKey="x" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <ReferenceLine x={0} stroke="#64748b" />
              <ReferenceLine y={0} stroke="#64748b" />
              <Line dataKey="y" stroke="#06b6d4" strokeWidth={3} dot={false} />
              <ReferenceArea x1={0} x2={1} y1={c} y2={sampleY} fill="#a78bfa" fillOpacity={0.14} strokeOpacity={0.2} />
              <ReferenceDot x={0} y={c} r={6} fill="#22d3ee" stroke="#0f172a" />
              <ReferenceDot x={1} y={sampleY} r={6} fill="#f59e0b" stroke="#0f172a" />
              {slopeTriangle.map((point, index) => <ReferenceDot key={index} x={point.x} y={point.y} r={3} fill="#a78bfa" stroke="#0f172a" />)}
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A linear equation models constant rate of change."
          formula="y = mx + c, slope = rise / run"
          changes="Changing m rotates the line. Changing c shifts the whole line up or down. The point at x=1 makes the rise for run=1 visible."
          realWorldUse="Pricing, break-even models, distance at constant speed, and simple machine-learning linear models."
          steps={[`Start at the y-intercept (0, ${roundTo(c, 2)}).`, `Move right by run = 1.`, `Move vertically by rise = m = ${roundTo(m, 2)}.`, `The new point is (1, ${roundTo(sampleY, 2)}).`]}
          tasks={["Set m = 0 and observe a horizontal line.", "Set c = 0 and observe a line through the origin.", "Set m negative and observe a falling line.", "Increase c and observe the upward shift."]}
        />
      </div>
    </SectionCard>
  );
}
