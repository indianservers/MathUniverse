import { type MouseEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { compileTwoVariableExpression } from "../utils/functionParser";
import { roundTo } from "../utils/math";

type Point = { x: number; y: number; defined: boolean };

const presets = ["x", "y", "x + y", "x - y", "y * (1 - y)", "sin(x)", "x * y", "-x / y", "y - x^2", "cos(x) - y"];
const colors = ["#ef4444", "#f59e0b", "#8b5cf6", "#10b981", "#ec4899"];

export default function SlopeFieldsVisualizerPage() {
  const [expression, setExpression] = useState("x - y");
  const [draft, setDraft] = useState("x - y");
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [stepSize, setStepSize] = useState(0.08);
  const [steps, setSteps] = useState(120);
  const [initials, setInitials] = useState<Point[]>([{ x: 0, y: 1, defined: true }]);

  const compiled = useMemo(() => {
    try {
      return { fn: compileTwoVariableExpression(expression), error: "" };
    } catch (error) {
      return { fn: null, error: error instanceof Error ? error.message : "Invalid differential equation" };
    }
  }, [expression]);

  const slopeField = useMemo(() => compiled.fn ? buildSlopeField(compiled.fn) : [], [compiled.fn]);
  const curves = useMemo(() => compiled.fn ? initials.map((start) => ({
    start,
    forward: solveRK4(compiled.fn!, start, stepSize, steps, 1),
    backward: solveRK4(compiled.fn!, start, stepSize, steps, -1),
  })) : [], [compiled.fn, initials, stepSize, steps]);
  const currentSlope = compiled.fn ? safeSlope(compiled.fn, x0, y0) : NaN;

  const addInitial = () => {
    setInitials((items) => [...items.slice(0, 4), { x: x0, y: y0, defined: true }]);
  };

  const handleGraphClick = (point: { x: number; y: number }) => {
    const next = { x: roundTo(point.x, 2), y: roundTo(point.y, 2), defined: true };
    setX0(next.x);
    setY0(next.y);
    setInitials((items) => items.length ? [next, ...items.slice(1)] : [next]);
  };

  return (
    <div className="space-y-6">
      <TopicHeader title="Differential Equation Slope Fields" subtitle="Visualize first-order differential equations dy/dx = f(x,y), inspect local slopes, and trace RK4 solution curves from initial conditions." difficulty="Differential Equations" estimatedMinutes={24} />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Equation and Initial Conditions" description="Enter the right side of dy/dx = f(x,y), then choose starting points.">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold">dy/dx =</span>
              <div className="mt-2 flex gap-2">
                <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setExpression(draft); }} className="min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 font-mono text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950" />
                <button type="button" className="action-primary px-4" onClick={() => setExpression(draft)}>Plot</button>
              </div>
              {compiled.error && <p className="mt-2 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">{compiled.error}</p>}
            </label>

            <SliderGroup title="Solution controls">
              <SliderControl density="compact" label="initial x0" value={x0} min={-5} max={5} step={0.05} onChange={setX0} />
              <SliderControl density="compact" label="initial y0" value={y0} min={-5} max={5} step={0.05} onChange={setY0} />
              <SliderControl density="compact" label="step size h" value={stepSize} min={0.02} max={0.25} step={0.01} onChange={setStepSize} />
              <SliderControl density="compact" label="number of steps" value={steps} min={20} max={260} step={5} onChange={setSteps} />
            </SliderGroup>

            <div className="grid grid-cols-2 gap-2">
              <Metric label="current slope" value={Number.isFinite(currentSlope) ? roundTo(currentSlope, 4).toString() : "undefined"} />
              <Metric label="solutions" value={`${initials.length} / 5`} />
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="action-primary" onClick={addInitial}><Plus className="h-4 w-4" />Add solution</button>
              <button type="button" className="action-secondary" onClick={() => setInitials([])}><Trash2 className="h-4 w-4" />Clear</button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Slope Field and RK4 Solution Curves" description="Click the graph to set a new initial condition. Curves are solved forward and backward from each start point.">
          <SlopeGraph field={slopeField} curves={curves} onPick={handleGraphClick} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Preset Equations">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {presets.map((preset) => (
              <button key={preset} type="button" onClick={() => { setDraft(preset); setExpression(preset); }} className="rounded-2xl border border-slate-200 bg-white p-4 text-left font-mono font-bold transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
                dy/dx = {preset}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Direction Field Explanation">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>At every point <strong>(x,y)</strong>, the differential equation gives a slope.</p>
            <p>The small line segment shows the direction a solution would move through that point.</p>
            <p>A solution curve follows the local slope everywhere. The initial condition selects one curve from the whole family of possible solutions.</p>
            <p>RK4 samples several slopes inside each step, so the curve is smoother and more accurate than basic Euler stepping.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function SlopeGraph({ field, curves, onPick }: { field: { x: number; y: number; slope: number }[]; curves: { start: Point; forward: Point[]; backward: Point[] }[]; onPick: (point: { x: number; y: number }) => void }) {
  const width = 760, height = 520, pad = 44, min = -6, max = 6;
  const sx = (x: number) => pad + ((x - min) / (max - min)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - min) / (max - min)) * (height - pad * 2);
  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = min + (((event.clientX - rect.left) / rect.width) * width - pad) / (width - pad * 2) * (max - min);
    const y = min + (height - pad - ((event.clientY - rect.top) / rect.height) * height) / (height - pad * 2) * (max - min);
    onPick({ x, y });
  };
  return (
    <svg viewBox="0 0 760 520" onClick={handleClick} className="h-[360px] w-full cursor-crosshair rounded-2xl bg-slate-50 dark:bg-slate-950 sm:h-[520px]">
      {grid(width, height, pad)}
      <line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} stroke="#0f172a" strokeWidth="2" />
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} stroke="#0f172a" strokeWidth="2" />
      {field.map((p, i) => {
        const angle = Math.atan(p.slope);
        const len = 18;
        return <line key={i} x1={sx(p.x) - Math.cos(angle) * len / 2} y1={sy(p.y) + Math.sin(angle) * len / 2} x2={sx(p.x) + Math.cos(angle) * len / 2} y2={sy(p.y) - Math.sin(angle) * len / 2} stroke="#0891b2" strokeWidth="3" strokeLinecap="round" opacity="0.78" />;
      })}
      {curves.map((curve, i) => <g key={i}><path d={path([...curve.backward].reverse(), sx, sy)} fill="none" stroke={colors[i % colors.length]} strokeWidth="4" /><path d={path(curve.forward, sx, sy)} fill="none" stroke={colors[i % colors.length]} strokeWidth="4" /><circle cx={sx(curve.start.x)} cy={sy(curve.start.y)} r="8" fill={colors[i % colors.length]} stroke="#0f172a" strokeWidth="2" /></g>)}
    </svg>
  );
}

function buildSlopeField(fn: (x: number, y: number) => number) {
  const points = [];
  for (let x = -5; x <= 5; x += 0.8) {
    for (let y = -5; y <= 5; y += 0.8) {
      const slope = safeSlope(fn, x, y);
      if (Number.isFinite(slope)) points.push({ x, y, slope: Math.max(-8, Math.min(8, slope)) });
    }
  }
  return points;
}

function solveRK4(fn: (x: number, y: number) => number, start: Point, h: number, steps: number, direction: 1 | -1) {
  const result = [start];
  let x = start.x, y = start.y;
  const step = h * direction;
  for (let i = 0; i < steps; i += 1) {
    const k1 = safeSlope(fn, x, y);
    const k2 = safeSlope(fn, x + step / 2, y + step * k1 / 2);
    const k3 = safeSlope(fn, x + step / 2, y + step * k2 / 2);
    const k4 = safeSlope(fn, x + step, y + step * k3);
    if (![k1, k2, k3, k4].every(Number.isFinite)) break;
    y += (step / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    x += step;
    if (!Number.isFinite(y) || Math.abs(y) > 50 || x < -7 || x > 7) break;
    result.push({ x, y, defined: true });
  }
  return result;
}

function safeSlope(fn: (x: number, y: number) => number, x: number, y: number) {
  try {
    const slope = fn(x, y);
    return Number.isFinite(slope) ? slope : NaN;
  } catch {
    return NaN;
  }
}

function path(points: Point[], sx: (x: number) => number, sy: (y: number) => number) {
  return points.filter((p) => p.defined).map((p, i) => `${i ? "L" : "M"}${sx(p.x)},${sy(p.y)}`).join(" ");
}

function grid(width: number, height: number, pad: number) {
  return <g>{Array.from({ length: 13 }).map((_, i) => <line key={`v-${i}`} x1={pad + i * (width - pad * 2) / 12} x2={pad + i * (width - pad * 2) / 12} y1={pad} y2={height - pad} stroke="#cbd5e1" opacity="0.65" />)}{Array.from({ length: 13 }).map((_, i) => <line key={`h-${i}`} x1={pad} x2={width - pad} y1={pad + i * (height - pad * 2) / 12} y2={pad + i * (height - pad * 2) / 12} stroke="#cbd5e1" opacity="0.65" />)}</g>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words font-mono text-sm font-bold">{value}</p></div>;
}
