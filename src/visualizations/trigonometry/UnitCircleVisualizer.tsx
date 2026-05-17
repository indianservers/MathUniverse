import { useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { degreesToRadians, roundTo } from "../../utils/math";

export default function UnitCircleVisualizer() {
  const [degrees, setDegrees] = useState(45);
  const theta = degreesToRadians(degrees);
  const x = Math.cos(theta), y = Math.sin(theta);
  const px = 180 + x * 120, py = 180 - y * 120;
  const tan = Math.abs(Math.cos(theta)) < 0.001 ? "undefined" : roundTo(Math.tan(theta), 3).toString();
  const quadrant = Math.abs(x) < 0.001 || Math.abs(y) < 0.001 ? "Axis point" : x > 0 && y > 0 ? "Quadrant I" : x < 0 && y > 0 ? "Quadrant II" : x < 0 && y < 0 ? "Quadrant III" : "Quadrant IV";
  const piNotation = specialPi(degrees);

  return (
    <SectionCard title="Unit Circle Visualizer" description="Cosine is the x-coordinate; sine is the y-coordinate.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="θ" value={degrees} min={0} max={360} step={1} onChange={setDegrees} unit="deg" />
          <div className="flex flex-wrap gap-2">
            {[0, 30, 45, 60, 90, 180, 270, 360].map((value) => <button key={value} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => setDegrees(value)}>{value}°</button>)}
          </div>
          <FormulaBlock title="Identity" formula={"\\sin^2\\theta+\\cos^2\\theta=1"} />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="sin θ" value={y} /><Metric label="cos θ" value={x} /><Metric label="tan θ" value={tan} /><Metric label="radians" value={`${roundTo(theta, 3)} (${piNotation})`} /><Metric label="coordinate" value={`(${roundTo(x, 3)}, ${roundTo(y, 3)})`} /><Metric label="quadrant" value={quadrant} /><Metric label="identity" value={roundTo(x * x + y * y, 4)} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 dark:bg-slate-950/60">
          <svg viewBox="0 0 360 360" className="h-[360px] w-full">
            <circle cx="180" cy="180" r="120" fill="rgba(34,211,238,.08)" stroke="#06b6d4" strokeWidth="3" />
            <line x1="40" x2="320" y1="180" y2="180" stroke="#64748b" /><line y1="40" y2="320" x1="180" x2="180" stroke="#64748b" />
            <path d={`M 220 180 A 40 40 0 ${degrees > 180 ? 1 : 0} 0 ${180 + Math.cos(theta) * 40} ${180 - Math.sin(theta) * 40}`} fill="none" stroke="#f59e0b" strokeWidth="3" />
            <line x1="180" y1="180" x2={px} y2={py} stroke="#8b5cf6" strokeWidth="4" />
            <line x1={px} y1={py} x2={px} y2="180" stroke="#22d3ee" strokeDasharray="6 4" />
            <line x1="180" y1={py} x2={px} y2={py} stroke="#f472b6" strokeDasharray="6 4" />
            <circle cx={px} cy={py} r="8" fill="#f59e0b" />
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="The unit circle turns angles into coordinates."
          formula="cos(theta) = x, sin(theta) = y, tan(theta) = sin(theta)/cos(theta)"
          changes="Changing theta moves the point around the circle and changes sine, cosine, tangent, and quadrant."
          realWorldUse="Waves, rotations, navigation, circular motion, audio, AC circuits, and signal processing."
          steps={[`theta = ${degrees} degrees = ${roundTo(theta, 3)} radians.`, `Point = (${roundTo(x, 3)}, ${roundTo(y, 3)}).`, `sin² + cos² = ${roundTo(x * x + y * y, 4)}.`, `Location: ${quadrant}.`]}
          tasks={["Set theta = 90 degrees and observe cos theta = 0.", "Set theta = 180 degrees and observe point at -1.", "Set theta = 45 degrees and compare sin and cos."]}
        />
      </div>
    </SectionCard>
  );
}
function Metric({ label, value }: { label: string; value: number | string }) { return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{typeof value === "number" ? roundTo(value, 3) : value}</p></div>; }

function specialPi(degrees: number) {
  const map: Record<number, string> = { 0: "0", 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2", 180: "π", 270: "3π/2", 360: "2π" };
  return map[Math.round(degrees)] ?? `${roundTo(degrees / 180, 3)}π`;
}
