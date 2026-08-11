import { Calculator, Crosshair, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import SliderControl from "../components/ui/SliderControl";
import { analyzeSurfaceDifferential, runGraphCasAction } from "./graphIntelligence";

type Props = {
  expression: string;
  range: number;
  point: { x: number; y: number };
  onPointChange: (point: { x: number; y: number }) => void;
  onAddSurface: (expression: string) => void;
};

export default function SurfaceIntelligencePanel({ expression, range, point, onPointChange, onAddSurface }: Props) {
  const analysis = useMemo(() => analyzeSurfaceDifferential(expression, point.x, point.y), [expression, point]);
  const [casResult, setCasResult] = useState<string | null>(null);

  const differentiate = (variable: "x" | "y") => {
    const result = runGraphCasAction(expression.replace(/^z\s*=/i, ""), "differentiate");
    if (variable === "x") setCasResult(result?.result ?? null);
    else {
      void import("../utils/symbolic").then(({ symbolicDerivative, trySymbolic }) => setCasResult(trySymbolic(() => symbolicDerivative(expression.replace(/^z\s*=/i, ""), "y"))?.result ?? null));
    }
  };

  return <section className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/70" aria-label="Surface intelligence">
    <div className="flex items-center justify-between gap-2"><div><p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-300">Multivariable intelligence</p><p className="text-sm font-bold">Gradient, normal, and tangent plane</p></div><span className="rounded bg-cyan-100 px-2 py-1 text-[10px] font-black uppercase text-cyan-800">numerical</span></div>
    <div className="mt-3 grid gap-2 md:grid-cols-2"><SliderControl density="compact" label={`Point x = ${point.x}`} min={-range} max={range} step={0.1} value={point.x} onChange={(x) => onPointChange({ ...point, x })} /><SliderControl density="compact" label={`Point y = ${point.y}`} min={-range} max={range} step={0.1} value={point.y} onChange={(y) => onPointChange({ ...point, y })} /></div>
    {analysis ? <div className="mt-3 space-y-2 text-sm">
      <p><Crosshair className="mr-1 inline h-4 w-4" /><strong>Point:</strong> ({format(analysis.point.x)}, {format(analysis.point.y)}, {format(analysis.point.z)})</p>
      <p><strong>Gradient:</strong> ({format(analysis.gradient.x)}, {format(analysis.gradient.y)}), magnitude {format(analysis.gradient.magnitude)}</p>
      <p><strong>Unit normal:</strong> ({analysis.normal.map(format).join(", ")})</p>
      <p className="break-all font-mono"><strong>Tangent plane:</strong> {analysis.tangentPlane}</p>
      <details><summary className="cursor-pointer font-bold">Calculation details</summary><ol className="mt-2 space-y-1 text-xs text-slate-500">{analysis.steps.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}</ol></details>
    </div> : <p className="mt-3 text-sm text-amber-700">The selected point is outside the real differentiable surface.</p>}
    <div className="mt-3 flex flex-wrap gap-2"><button type="button" className="tool-button" onClick={() => differentiate("x")}><Calculator className="h-4 w-4" />Exact partial x</button><button type="button" className="tool-button" onClick={() => differentiate("y")}><Calculator className="h-4 w-4" />Exact partial y</button>{casResult && <button type="button" className="action-primary" onClick={() => onAddSurface(casResult)}><Plus className="h-4 w-4" />Use as second surface</button>}</div>
    {casResult && <p className="mt-2 break-all rounded-lg bg-emerald-50 p-2 font-mono text-sm font-bold text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100">Exact CAS: {casResult}</p>}
  </section>;
}

function format(value: number) { return `${Math.round(value * 100000) / 100000}`; }
