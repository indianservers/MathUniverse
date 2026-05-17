import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import ResponsiveLineChart from "../components/charts/ResponsiveLineChart";
import { compileFunctionExpression } from "../utils/functionParser";

export default function GraphComparisonMode() {
  const [f, setF] = useState("sin(x)");
  const [g, setG] = useState("cos(x)");
  const [overlaid, setOverlaid] = useState(true);
  const curves = useMemo(() => makeCurves(f, g), [f, g]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Graph Comparison Mode" subtitle="Plot two functions side by side or overlaid, with an error curve between them." difficulty="Visualizer" estimatedMinutes={8} />
      <Controls f={f} g={g} setF={setF} setG={setG} overlaid={overlaid} setOverlaid={setOverlaid} />
      {overlaid ? (
        <GraphCard title="Overlaid Comparison">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curves.combined} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.3)" />
              <XAxis dataKey="x" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="f" stroke="#06b6d4" dot={false} strokeWidth={3} />
              <Line type="monotone" dataKey="g" stroke="#f97316" dot={false} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2"><GraphCard title="f(x)"><ResponsiveLineChart data={curves.f} /></GraphCard><GraphCard title="g(x)"><ResponsiveLineChart data={curves.g} lineColor="#f97316" /></GraphCard></div>
      )}
      <GraphCard title="Difference Curve f(x) - g(x)"><ResponsiveLineChart data={curves.diff} lineColor="#ef4444" /></GraphCard>
    </div>
  );
}

function Controls(props: { f: string; g: string; overlaid: boolean; setF: (v: string) => void; setG: (v: string) => void; setOverlaid: (v: boolean) => void }) {
  return <SectionCard title="Functions"><div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"><Input label="f(x)" value={props.f} onChange={props.setF} /><Input label="g(x)" value={props.g} onChange={props.setG} /><button className="action-secondary" type="button" onClick={() => props.setOverlaid(!props.overlaid)}>{props.overlaid ? "Side by side" : "Overlay"}</button></div></SectionCard>;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-sm font-bold">{label}</span><input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950/60" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function makeCurves(f: string, g: string) {
  try {
    const fn = compileFunctionExpression(f);
    const gn = compileFunctionExpression(g);
    const xs = Array.from({ length: 160 }, (_, index) => -8 + (index / 159) * 16);
    const fData = xs.map((x) => ({ x: Number(x.toFixed(2)), y: safe(fn(x)) }));
    const gData = xs.map((x) => ({ x: Number(x.toFixed(2)), y: safe(gn(x)) }));
    return { f: fData, g: gData, combined: xs.map((x) => ({ x: Number(x.toFixed(2)), f: safe(fn(x)), g: safe(gn(x)) })), diff: xs.map((x) => ({ x: Number(x.toFixed(2)), y: safe(fn(x) - gn(x)) })) };
  } catch {
    return { f: [], g: [], combined: [], diff: [] };
  }
}

function safe(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(4)) : 0;
}
