import { useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";
import { rightTriangleMetrics } from "../../utils/coreAccuracyOracles";

export default function PythagorasVisualizer() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const metrics = rightTriangleMetrics(a, b);
  const c = metrics.c;
  const scale = 12;
  const ox = 180, oy = 210;
  const p0 = [ox, oy] as const;
  const p1 = [ox + a * scale, oy] as const;
  const p2 = [ox + a * scale, oy - b * scale] as const;
  const squareA = [p0, p1, [p1[0], p1[1] + a * scale], [p0[0], p0[1] + a * scale]] as const;
  const squareB = [p1, p2, [p2[0] + b * scale, p2[1]], [p1[0] + b * scale, p1[1]]] as const;
  const squareC = [p2, p0, [p0[0] - b * scale, p0[1] - a * scale], [p2[0] - b * scale, p2[1] - a * scale]] as const;

  return (
    <SectionCard title="Pythagoras Visualizer" description="A right triangle shows how the squares on the legs equal the square on the hypotenuse.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title="Theorem" formula="a^2+b^2=c^2" explanation="Used in distance, construction, navigation, and graphics." />
          <SliderControl label="Side a" value={a} min={1} max={10} step={0.5} onChange={setA} />
          <SliderControl label="Side b" value={b} min={1} max={10} step={0.5} onChange={setB} />
          <div className="flex flex-wrap gap-2">
            {[[3, 4], [5, 12], [8, 15]].map(([pa, pb]) => <button key={`${pa}-${pb}`} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => { setA(pa); setB(pb); }}>{pa}-{pb}-{Math.round(Math.hypot(pa, pb))}</button>)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="a^2" value={a * a} /><Metric label="b^2" value={b * b} /><Metric label="a^2 + b^2" value={a * a + b * b} /><Metric label="c^2" value={c * c} />
          </div>
          <p className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100">Verified residual a²+b²-c² = {metrics.squaredResidual.toExponential(2)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 dark:bg-slate-950/60">
          <svg viewBox="0 0 500 400" className="h-[360px] w-full" role="img" aria-label={`Right triangle with legs ${a} and ${b}; square areas ${roundTo(a * a, 2)}, ${roundTo(b * b, 2)}, and ${roundTo(c * c, 2)}`}>
            <polygon points={points(squareA)} fill="rgba(6,182,212,.13)" stroke="#06b6d4" strokeWidth="2" />
            <polygon points={points(squareB)} fill="rgba(167,139,250,.14)" stroke="#8b5cf6" strokeWidth="2" />
            <polygon points={points(squareC)} fill="rgba(245,158,11,.13)" stroke="#f59e0b" strokeWidth="2" />
            <polygon points={points([p0, p1, p2])} fill="rgba(34,211,238,.22)" stroke="#06b6d4" strokeWidth="3" />
            <polyline points={`${p1[0] - 14},${p1[1]} ${p1[0] - 14},${p1[1] - 14} ${p1[0]},${p1[1] - 14}`} fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <text x={ox + a * scale / 2} y={oy + 20} fill="#0891b2">a={a}</text>
            <text x={ox + a * scale + 8} y={oy - b * scale / 2} fill="#7c3aed">b={b}</text>
            <text x={ox + a * scale / 2 + 22} y={oy - b * scale / 2 - 14} fill="#f59e0b">c={roundTo(c, 2)}</text>
            <text x={p0[0] + a * scale / 2 - 12} y={p0[1] + a * scale / 2} fill="#0891b2" fontWeight="800">a²</text>
            <text x={p1[0] + b * scale / 2 - 12} y={p2[1] + b * scale / 2} fill="#7c3aed" fontWeight="800">b²</text>
            <text x={p0[0] - b * scale / 2 - 16} y={p0[1] - a * scale / 2} fill="#d97706" fontWeight="800">c²</text>
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="In a right triangle, the square on the hypotenuse has the same area as the two leg-squares combined."
          formula="a^2 + b^2 = c^2 and distance = sqrt((x2-x1)^2 + (y2-y1)^2)"
          changes="Increasing either leg increases the hypotenuse. The equality a^2+b^2=c^2 remains true."
          realWorldUse="Construction, maps, game distance, robotics navigation, and computer graphics."
          steps={[`Compute a^2=${roundTo(a * a, 2)}.`, `Compute b^2=${roundTo(b * b, 2)}.`, `Add them: ${roundTo(a * a + b * b, 2)}.`, `Take square root to get c=${roundTo(c, 3)}.`]}
          tasks={["Use the 3-4-5 triangle.", "Increase one leg and watch the hypotenuse grow.", "Compare a^2 + b^2 with c^2."]}
          proofIdea="The two smaller square areas can be rearranged to exactly fill the square on the hypotenuse."
          misconception="This theorem works only for right triangles. For other triangles, use the Law of Cosines."
          teacherPrompt="Which side is opposite the right angle?"
        />
      </div>
    </SectionCard>
  );
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{roundTo(value, 2)}</p></div>; }

function points(vertices: ReadonlyArray<readonly [number, number]>) {
  return vertices.map(([x, y]) => `${x},${y}`).join(" ");
}
