import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Scatter, ScatterChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { compileFunctionExpression } from "../utils/functionParser";

const PRESETS = [
  { label: "Circle", xExpr: "cos(x)", yExpr: "sin(x)", tMax: Math.PI * 2 },
  { label: "Lissajous 3:2", xExpr: "cos(3*x)", yExpr: "sin(2*x)", tMax: Math.PI * 2 },
  { label: "Lissajous 4:3", xExpr: "cos(4*x)", yExpr: "sin(3*x)", tMax: Math.PI * 2 },
  { label: "Heart curve", xExpr: "16*sin(x)^3/16", yExpr: "13*cos(x)/16-5*cos(2*x)/16-2*cos(3*x)/16-cos(4*x)/16", tMax: Math.PI * 2 },
  { label: "Spiral", xExpr: "x*cos(x)/6", yExpr: "x*sin(x)/6", tMax: Math.PI * 8 },
  { label: "Epitrochoid", xExpr: "(3+1)*cos(x)-1*cos((3+1)*x)", yExpr: "(3+1)*sin(x)-1*sin((3+1)*x)", tMax: Math.PI * 2 },
  { label: "Figure-eight", xExpr: "sin(x)", yExpr: "sin(2*x)/2", tMax: Math.PI * 2 },
];

export default function ParametricCurveExplorer() {
  const [xExpr, setXExpr] = useState("cos(x)");
  const [yExpr, setYExpr] = useState("sin(x)");
  const [tMax, setTMax] = useState(Math.PI * 2);
  const [presetOpen, setPresetOpen] = useState(false);
  const data = useMemo(() => makeParametric(xExpr, yExpr, tMax), [xExpr, yExpr, tMax]);

  function applyPreset(p: typeof PRESETS[0]) {
    setXExpr(p.xExpr);
    setYExpr(p.yExpr);
    setTMax(p.tMax);
    setPresetOpen(false);
  }

  return (
    <div className="space-y-5">
      <TopicHeader title="Parametric Curve Explorer" subtitle="Use x(t), y(t), and a live time sweep to trace a curve." difficulty="Visualizer" estimatedMinutes={8} />
      <SectionCard title="Parametric Controls">
        <div className="mb-4">
          <div className="relative inline-block">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"
              onClick={() => setPresetOpen((v) => !v)}
            >
              Presets
              <ChevronDown className={`h-4 w-4 transition ${presetOpen ? "rotate-180" : ""}`} />
            </button>
            {presetOpen && (
              <div className="absolute left-0 top-12 z-30 min-w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
                {PRESETS.map((p) => (
                  <button key={p.label} type="button" className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-400/10" onClick={() => applyPreset(p)}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Expr label="x(t)" value={xExpr} onChange={setXExpr} />
          <Expr label="y(t)" value={yExpr} onChange={setYExpr} />
          <SliderControl label="Time sweep t" value={tMax} min={0.1} max={Math.PI * 8} step={0.05} onChange={setTMax} />
        </div>
      </SectionCard>
      <GraphCard title="Traced Parametric Curve">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.3)" />
            <XAxis dataKey="x" type="number" stroke="#94a3b8" />
            <YAxis dataKey="y" type="number" stroke="#94a3b8" />
            <Tooltip />
            <Line dataKey="y" data={data} stroke="#06b6d4" dot={false} />
            <Scatter data={data.slice(-1)} fill="#f97316" />
          </ScatterChart>
        </ResponsiveContainer>
      </GraphCard>
    </div>
  );
}

function Expr({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label><span className="text-sm font-bold">{label}</span><input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950/60" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function makeParametric(xExpr: string, yExpr: string, tMax: number) {
  try {
    const fx = compileFunctionExpression(xExpr);
    const fy = compileFunctionExpression(yExpr);
    return Array.from({ length: 180 }, (_, index) => {
      const t = (index / 179) * tMax;
      return { x: fx(t), y: fy(t) };
    });
  } catch {
    return [];
  }
}
