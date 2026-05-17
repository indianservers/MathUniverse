import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FormulaBlock from "../../components/ui/FormulaBlock";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { generateRange } from "../../utils/graph";
import { roundTo } from "../../utils/math";

const f = (x: number) => (x * x - 1) / (x - 1);
type Example = "removable" | "jump" | "infinite";
const fn = (example: Example, x: number) => {
  if (example === "jump") return x < 1 ? 1 : 3;
  if (example === "infinite") return 1 / ((x - 1) * (x - 1));
  return f(x);
};

export default function LimitsVisualizer() {
  const [delta, setDelta] = useState(1);
  const [example, setExample] = useState<Example>("removable");
  const data = useMemo(() => generateRange(-3, 5, 0.05).filter((x) => Math.abs(x - 1) > 0.04).map((x) => ({ x, y: Math.max(-10, Math.min(10, fn(example, x))) })), [example]);
  const leftX = 1 - delta, rightX = 1 + delta;
  const limitText = example === "removable" ? "Both sides approach 2, so the limit exists." : example === "jump" ? "Left and right sides approach different values, so the two-sided limit does not exist." : "Values grow without bound near x=1, so this is an infinite limit.";
  const table = [0.9, 0.99, 0.999, 1.001, 1.01, 1.1].map((x) => ({ x, y: fn(example, x) }));
  return (
    <SectionCard title="Limits Visualizer" description="The function is undefined at x=1, but the nearby values approach 2.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title="Limit" formula={"\\lim_{x\\to1}\\frac{x^2-1}{x-1}=2"} />
          <label className="block rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">Example<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={example} onChange={(e) => setExample(e.target.value as Example)}><option value="removable">removable discontinuity</option><option value="jump">jump discontinuity</option><option value="infinite">infinite limit</option></select></label>
          <SliderControl label="Distance from x = 1" value={delta} min={0.05} max={2} step={0.05} onChange={setDelta} />
          <div className="grid grid-cols-2 gap-2 text-sm"><Metric label="Left point" value={`(${roundTo(leftX, 2)}, ${roundTo(fn(example, leftX), 2)})`} /><Metric label="Right point" value={`(${roundTo(rightX, 2)}, ${roundTo(fn(example, rightX), 2)})`} /></div>
          <table className="w-full rounded-2xl text-sm"><tbody>{table.map((row) => <tr key={row.x} className="border-b border-slate-200 dark:border-white/10"><td className="p-2">{row.x}</td><td className="p-2">{Math.abs(row.y) > 999 ? "very large" : roundTo(row.y, 4)}</td></tr>)}</tbody></table>
        </div>
        <GraphCard title="Removable Discontinuity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" /><XAxis dataKey="x" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <ReferenceLine x={1} stroke="#f59e0b" strokeDasharray="5 5" /><ReferenceLine y={2} stroke="#64748b" strokeDasharray="5 5" />
              <Line dataKey="y" stroke="#06b6d4" strokeWidth={3} dot={false} />
              {example === "removable" && <ReferenceDot x={1} y={2} r={7} fill="#fff" stroke="#f59e0b" strokeWidth={3} />}
              <ReferenceDot x={leftX} y={Math.max(-10, Math.min(10, fn(example, leftX)))} r={5} fill="#8b5cf6" stroke="#0f172a" /><ReferenceDot x={rightX} y={Math.max(-10, Math.min(10, fn(example, rightX)))} r={5} fill="#8b5cf6" stroke="#0f172a" />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A limit describes what value a function approaches, even when the function may be undefined at that point."
          formula="lim x->1 f(x)"
          changes="Changing the distance slider moves sample points closer to x=1 from both sides."
          realWorldUse="Continuity, rates, derivatives, asymptotes, and numerical approximation."
          warning={limitText}
          steps={["Approach x=1 from the left.", "Approach x=1 from the right.", "Compare the y-values.", "If both sides agree, the two-sided limit exists."]}
          tasks={["Compare removable and jump examples.", "Move delta close to 0.", "Observe the open circle for the removable case."]}
        />
      </div>
    </SectionCard>
  );
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{value}</p></div>; }
