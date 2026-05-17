import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { generateQuadraticData } from "../../utils/graph";
import { quadraticRoots, quadraticY, roundTo } from "../../utils/math";

export default function QuadraticEquationVisualizer() {
  const [a, setAState] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const setA = (value: number) => setAState(Math.abs(value) < 0.1 ? (value < 0 ? -0.1 : 0.1) : value);
  const data = useMemo(() => generateQuadraticData(a, b, c, -10, 10, 0.25), [a, b, c]);
  const vx = -b / (2 * a);
  const vy = quadraticY(vx, a, b, c);
  const d = b * b - 4 * a * c;
  const roots = quadraticRoots(a, b, c);
  const rootText = d < 0 ? "No real roots" : d === 0 ? `Repeated root x=${roundTo(roots?.[0] ?? 0, 2)}` : `x=${roundTo(roots?.[0] ?? 0, 2)}, ${roundTo(roots?.[1] ?? 0, 2)}`;
  const discriminantMeaning = d > 0 ? "two real roots: the graph crosses the x-axis twice" : Math.abs(d) < 0.0001 ? "one repeated root: the graph touches the x-axis" : "no real roots: the graph does not cross the x-axis";

  return (
    <SectionCard title="Quadratic Equation Visualizer" description="A parabola reveals its vertex, roots, and opening direction.">
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 p-4 text-white">
            <p className="text-sm opacity-80">Current formula</p>
            <p className="mt-1 text-2xl font-bold">y = {roundTo(a, 2)}x² {b >= 0 ? "+" : ""}{roundTo(b, 2)}x {c >= 0 ? "+" : ""}{roundTo(c, 2)}</p>
          </div>
          <SliderControl label="a" value={a} min={-3} max={3} step={0.1} onChange={setA} description="Width and opening direction" />
          <SliderControl label="b" value={b} min={-10} max={10} step={0.5} onChange={setB} description="Shifts the vertex" />
          <SliderControl label="c" value={c} min={-10} max={10} step={0.5} onChange={setC} description="Y-intercept" />
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" onClick={() => { setAState(1); setB(-2); setC(-3); }}>Reset</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold dark:bg-white/10" onClick={() => { setA(roundTo(Math.random() * 4 - 2, 1)); setB(roundTo(Math.random() * 10 - 5, 1)); setC(roundTo(Math.random() * 10 - 5, 1)); }}>Random</button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Vertex" value={`(${roundTo(vx, 2)}, ${roundTo(vy, 2)})`} />
            <Info label="Discriminant" value={roundTo(d, 2).toString()} />
            <Info label="Opening" value={a > 0 ? "Upward" : "Downward"} />
            <Info label="Roots" value={rootText} />
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            <p className="font-semibold">Vertex form</p>
            <p className="mt-1 font-mono">y = {roundTo(a, 2)}(x {vx < 0 ? "+" : "-"} {Math.abs(roundTo(vx, 2))})² {vy >= 0 ? "+" : "-"} {Math.abs(roundTo(vy, 2))}</p>
            <p className="mt-3">D = {roundTo(d, 3)}: {discriminantMeaning}.</p>
          </div>
          <details className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            <summary className="cursor-pointer font-semibold">Focus/directrix intuition</summary>
            <p className="mt-2 leading-6 text-slate-600 dark:text-slate-300">A parabola can be defined by points equally distant from a focus and a directrix. Wider parabolas have a focus farther from the vertex.</p>
          </details>
        </div>
        <GraphCard title="Parabola Graph">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />
              <XAxis dataKey="x" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <ReferenceLine x={0} stroke="#64748b" />
              <ReferenceLine y={0} stroke="#64748b" />
              <ReferenceLine x={vx} stroke="#f59e0b" strokeDasharray="6 5" label="axis" />
              <Line dataKey="y" stroke="#a855f7" strokeWidth={3} dot={false} />
              <ReferenceDot x={vx} y={vy} r={6} fill="#f59e0b" stroke="#0f172a" />
              {roots && d >= 0 && roots.map((root, index) => <ReferenceDot key={index} x={root} y={0} r={5} fill="#22d3ee" stroke="#0f172a" />)}
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A quadratic equation creates a parabola with a turning point called the vertex."
          formula="y = ax² + bx + c = a(x - h)² + k"
          changes="a controls opening and width, b moves the vertex sideways, and c sets the y-intercept."
          realWorldUse="Projectile paths, profit curves, satellite dishes, optimization, and focusing reflectors."
          steps={[`Compute h = -b/(2a) = ${roundTo(vx, 3)}.`, `Compute k = f(h) = ${roundTo(vy, 3)}.`, `Compute D = b² - 4ac = ${roundTo(d, 3)}.`, discriminantMeaning]}
          tasks={["Make a positive a.", "Make a negative a.", "Make the discriminant negative.", "Make the vertex at x = 0.", "Set c = 0 and observe a root at the origin."]}
        />
      </div>
    </SectionCard>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
