import { useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

export default function CircleExplorer() {
  const [r, setR] = useState(5);
  const [angle, setAngle] = useState(90);
  const radius = r * 16;
  const theta = (angle * Math.PI) / 180;
  const px = 180 + radius * Math.cos(theta);
  const py = 160 - radius * Math.sin(theta);
  const sectorArea = (angle / 360) * Math.PI * r * r;
  const arcLength = (angle / 360) * 2 * Math.PI * r;
  const largeArc = angle > 180 ? 1 : 0;
  return (
    <SectionCard title="Circle Explorer" description="Circumference is boundary length; area is covered surface.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="Radius r" value={r} min={1} max={10} step={0.5} onChange={setR} />
          <SliderControl label="Sector angle" value={angle} min={0} max={360} step={1} onChange={setAngle} unit="deg" />
          <FormulaBlock title="Circle Formulas" formula={"C=2\\pi r,\\quad A=\\pi r^2"} />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="Radius" value={r} /><Metric label="Diameter" value={2 * r} /><Metric label="Circumference" value={2 * Math.PI * r} /><Metric label="Area" value={Math.PI * r * r} /><Metric label="Sector area" value={sectorArea} /><Metric label="Arc length" value={arcLength} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 dark:bg-slate-950/60">
          <svg viewBox="0 0 360 320" className="h-[320px] w-full">
            <circle cx="180" cy="160" r={radius} fill="rgba(34,211,238,.16)" stroke="#06b6d4" strokeWidth="4" />
            <path d={`M 180 160 L ${180 + radius} 160 A ${radius} ${radius} 0 ${largeArc} 0 ${px} ${py} Z`} fill="rgba(245,158,11,.26)" stroke="#f59e0b" />
            <line x1="180" y1="160" x2={180 + radius} y2="160" stroke="#f59e0b" strokeWidth="3" />
            <line x1={180 - radius} y1="160" x2={180 + radius} y2="160" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 4" />
            <line x1={px - 55 * Math.sin(theta)} y1={py - 55 * Math.cos(theta)} x2={px + 55 * Math.sin(theta)} y2={py + 55 * Math.cos(theta)} stroke="#ef4444" strokeWidth="3" />
            <text x={180 + radius / 2 - 8} y="150" fill="#f59e0b">r</text>
            <text x="166" y="190" fill="#8b5cf6">d</text>
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A circle is all points a fixed radius from the center. A sector is a fraction of the full circle."
          formula="sector area = theta/360 * pi r², arc length = theta/360 * 2pi r"
          changes="Radius changes area quadratically. Sector angle changes area and arc length linearly."
          realWorldUse="Wheels, gears, clocks, unit circles, circular motion, and navigation."
          steps={[`Diameter = 2r = ${roundTo(2 * r, 2)}.`, `Full area = ${roundTo(Math.PI * r * r, 2)}.`, `Sector fraction = ${roundTo(angle / 360, 3)}.`, `The tangent is perpendicular to the radius at the selected point.`]}
          tasks={["Set theta = 90 degrees.", "Set theta = 180 degrees.", "Double the radius and observe area grows by about 4 times."]}
        />
      </div>
    </SectionCard>
  );
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{roundTo(value, 2)}</p></div>; }
