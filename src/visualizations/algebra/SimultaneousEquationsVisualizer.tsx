import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { generateRange } from "../../utils/graph";
import { roundTo } from "../../utils/math";
import { analyzeSlopeSystem } from "../../utils/coreAccuracyOracles";

export default function SimultaneousEquationsVisualizer() {
  const [m1, setM1] = useState(1);
  const [c1, setC1] = useState(2);
  const [m2, setM2] = useState(-1);
  const [c2, setC2] = useState(4);
  const data = useMemo(() => generateRange(-10, 10, 0.5).map((x) => ({ x, y1: m1 * x + c1, y2: m2 * x + c2 })), [m1, c1, m2, c2]);
  const analysis = useMemo(() => analyzeSlopeSystem(m1, c1, m2, c2, 1e-7), [m1, c1, m2, c2]);
  const parallel = analysis.kind !== "unique";
  const identical = analysis.kind === "identical";
  const x = analysis.kind === "unique" ? analysis.x : null;
  const y = analysis.kind === "unique" ? analysis.y : null;
  const classification = identical ? "Infinite solutions / same line" : analysis.kind === "parallel" ? "No solution / parallel lines" : "One verified solution";
  const parallelDistance = analysis.kind === "parallel" ? analysis.distance : null;

  return (
    <SectionCard title="Simultaneous Equations Visualizer" description="The intersection is the solution satisfying both equations.">
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <SliderControl label="m1" value={m1} min={-5} max={5} step={0.1} onChange={setM1} />
            <SliderControl label="c1" value={c1} min={-10} max={10} step={0.5} onChange={setC1} />
            <SliderControl label="m2" value={m2} min={-5} max={5} step={0.1} onChange={setM2} />
            <SliderControl label="c2" value={c2} min={-10} max={10} step={0.5} onChange={setC2} />
          </div>
          <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" onClick={() => { setM1(1); setC1(2); setM2(-1); setC2(4); }}>Reset</button>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="font-semibold">y = {roundTo(m1, 2)}x {c1 >= 0 ? "+" : ""}{roundTo(c1, 2)}</p>
            <p className="font-semibold text-violet-600 dark:text-violet-300">y = {roundTo(m2, 2)}x {c2 >= 0 ? "+" : ""}{roundTo(c2, 2)}</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{identical ? "Infinitely many solutions: both lines are the same." : parallel ? "No solution: the lines are parallel." : `Solution: x=${roundTo(x ?? 0, 3)}, y=${roundTo(y ?? 0, 3)}`}</p>
            <p className="mt-2 text-sm font-semibold">Classification: {classification}</p>
            {parallelDistance !== null && <p className="mt-2 text-sm">Distance between lines: {roundTo(parallelDistance, 3)}</p>}
            {analysis.kind === "unique" && <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-200">Residual check: line 1 {analysis.residual1.toExponential(2)}; line 2 {analysis.residual2.toExponential(2)}</p>}
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            <p className="font-semibold">Algebraic solving steps</p>
            <ol className="mt-2 space-y-1 font-mono text-xs leading-6">
              <li>{roundTo(m1, 2)}x {c1 >= 0 ? "+" : ""}{roundTo(c1, 2)} = {roundTo(m2, 2)}x {c2 >= 0 ? "+" : ""}{roundTo(c2, 2)}</li>
              <li>({roundTo(m1 - m2, 2)})x = {roundTo(c2 - c1, 2)}</li>
              <li>x = {parallel ? "undefined for equal slopes" : roundTo(x ?? 0, 3)}</li>
              <li>y = {y === null ? "undefined" : roundTo(y, 3)}</li>
            </ol>
          </div>
        </div>
        <GraphCard title="Two-Line System">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />
              <XAxis dataKey="x" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <ReferenceLine x={0} stroke="#64748b" /><ReferenceLine y={0} stroke="#64748b" />
              <Line dataKey="y1" stroke="#06b6d4" strokeWidth={3} dot={false} />
              <Line dataKey="y2" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              {x !== null && y !== null && <ReferenceDot x={x} y={y} r={6} fill="#facc15" stroke="#0f172a" />}
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A system of two linear equations asks where two lines agree."
          formula="x = (c2 - c1) / (m1 - m2), y = m1x + c1, when m1 != m2"
          changes="Changing slopes rotates the lines. Changing intercepts shifts them. Equal slopes create parallel or identical lines."
          realWorldUse="Break-even analysis: one line can represent revenue, the other cost. Their intersection is the break-even point."
          steps={[`Compare slopes: m1=${roundTo(m1, 2)}, m2=${roundTo(m2, 2)}.`, `Classify the system: ${classification}.`, parallel ? (identical ? "Equal slopes and intercepts mean every point on the line is a solution." : "Equal slopes with different intercepts mean no crossing point.") : `Solve x=${roundTo(x ?? 0, 3)}.`, y === null ? "No unique y-value exists." : `Substitute to get y=${roundTo(y, 3)} and verify both residuals.`]}
          tasks={["Make both slopes equal.", "Make both equations identical.", "Make two lines intersect near the origin.", "Make one line steeper than the other."]}
          misconception="Equal slopes do not automatically mean the same line; the intercepts must also agree."
          teacherPrompt="What do the two substitution residuals tell you?"
        />
      </div>
    </SectionCard>
  );
}
