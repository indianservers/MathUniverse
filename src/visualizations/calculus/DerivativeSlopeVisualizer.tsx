import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { generateFunctionData } from "../../utils/graph";
import { roundTo } from "../../utils/math";

export default function DerivativeSlopeVisualizer() {
  const [x, setX] = useState(1.5);
  const [h, setH] = useState(1);
  const y = x * x, m = 2 * x;
  const secantSlope = h === 0 ? m : (((x + h) ** 2 - y) / h);
  const curve = useMemo(() => generateFunctionData((v) => v * v, -5, 5, 0.1), []);
  const tangent = useMemo(() => curve.map((p) => ({ x: p.x, y: m * (p.x - x) + y })), [curve, m, x, y]);
  const secant = useMemo(() => curve.map((p) => ({ x: p.x, y: secantSlope * (p.x - x) + y })), [curve, secantSlope, x, y]);
  return (
    <SectionCard title="Derivative as Slope" description="The derivative gives the instantaneous rate of change.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="x" value={x} min={-5} max={5} step={0.1} onChange={setX} />
          <SliderControl label="h" value={h} min={0.05} max={3} step={0.05} onChange={setH} />
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="font-bold">dy/dx = 2x = {roundTo(m, 2)}</p><p className="mt-2 text-sm">Tangent: y - {roundTo(y, 2)} = {roundTo(m, 2)}(x - {roundTo(x, 2)})</p></div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            <p className="font-semibold">Difference quotient</p>
            <p className="mt-1 font-mono">[f(x+h)-f(x)]/h = {roundTo(secantSlope, 4)}</p>
            <p className="mt-2">Exact slope error: {roundTo(Math.abs(secantSlope - m), 4)}</p>
          </div>
        </div>
        <GraphCard title="Curve and Tangent">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" /><XAxis dataKey="x" type="number" domain={[-5, 5]} stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <Line data={curve} dataKey="y" stroke="#06b6d4" strokeWidth={3} dot={false} />
              <Line data={tangent} dataKey="y" stroke="#f59e0b" strokeWidth={3} dot={false} />
              <Line data={secant} dataKey="y" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="6 5" />
              <ReferenceDot x={x} y={y} r={6} fill="#f43f5e" stroke="#0f172a" />
              <ReferenceDot x={x + h} y={(x + h) ** 2} r={5} fill="#8b5cf6" stroke="#0f172a" />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A derivative is the slope a secant line approaches as h gets close to 0."
          formula="[f(x+h)-f(x)]/h -> f'(x)"
          changes="Changing x moves the point on the curve. Reducing h makes the purple secant approach the orange tangent."
          realWorldUse="Velocity, marginal cost, optimization, and model training gradients."
          steps={[`At x=${roundTo(x, 2)}, f(x)=${roundTo(y, 2)}.`, `Use h=${roundTo(h, 2)} to form a nearby point.`, `Approximate slope=${roundTo(secantSlope, 4)}.`, `Exact derivative 2x=${roundTo(m, 4)}.`]}
          tasks={["Set x = 0.", "Set x positive.", "Set x negative.", "Reduce h close to zero."]}
        />
      </div>
    </SectionCard>
  );
}
