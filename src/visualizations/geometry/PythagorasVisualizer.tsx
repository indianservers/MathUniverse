import { useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

export default function PythagorasVisualizer() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const c = Math.hypot(a, b);
  const scale = 18;
  const ox = 70, oy = 250;

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
            <Metric label="a²" value={a * a} /><Metric label="b²" value={b * b} /><Metric label="a² + b²" value={a * a + b * b} /><Metric label="c²" value={c * c} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 dark:bg-slate-950/60">
          <svg viewBox="0 0 420 320" className="h-[320px] w-full">
            <polygon points={`${ox},${oy} ${ox + a * scale},${oy} ${ox + a * scale},${oy - b * scale}`} fill="rgba(34,211,238,.2)" stroke="#06b6d4" strokeWidth="3" />
            <rect x={ox} y={oy} width={a * scale} height={a * scale} fill="rgba(6,182,212,.13)" stroke="#06b6d4" />
            <rect x={ox + a * scale} y={oy - b * scale} width={b * scale} height={b * scale} fill="rgba(167,139,250,.14)" stroke="#8b5cf6" />
            <text x={ox + a * scale / 2} y={oy + 20} fill="#0891b2">a={a}</text>
            <text x={ox + a * scale + 8} y={oy - b * scale / 2} fill="#7c3aed">b={b}</text>
            <text x={ox + a * scale / 2 + 22} y={oy - b * scale / 2 - 14} fill="#f59e0b">c={roundTo(c, 2)}</text>
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="In a right triangle, the square on the hypotenuse has the same area as the two leg-squares combined."
          formula="a² + b² = c² and distance = sqrt((x2-x1)² + (y2-y1)²)"
          changes="Increasing either leg increases the hypotenuse. The equality a²+b²=c² remains true."
          realWorldUse="Construction, maps, game distance, robotics navigation, and computer graphics."
          steps={[`Compute a²=${roundTo(a * a, 2)}.`, `Compute b²=${roundTo(b * b, 2)}.`, `Add them: ${roundTo(a * a + b * b, 2)}.`, `Take square root to get c=${roundTo(c, 3)}.`]}
          tasks={["Use the 3-4-5 triangle.", "Increase one leg and watch the hypotenuse grow.", "Compare a² + b² with c²."]}
        />
      </div>
    </SectionCard>
  );
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{roundTo(value, 2)}</p></div>; }
