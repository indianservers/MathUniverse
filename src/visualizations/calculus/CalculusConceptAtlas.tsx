import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { roundTo } from "../../utils/math";

type Concept = {
  title: string;
  level: "JEE" | "Degree" | "PG";
  formula: string;
  note: string;
  visual: "limit" | "derivative" | "integral" | "series" | "ode" | "multi";
};

const concepts: Concept[] = [
  { title: "Limits and One-Sided Limits", level: "JEE", formula: "lim x->a f(x)", note: "Approach from left and right; equality decides the limit.", visual: "limit" },
  { title: "Continuity", level: "JEE", formula: "lim x->a f(x)=f(a)", note: "A function is continuous when the graph has no break at the point.", visual: "limit" },
  { title: "Differentiability", level: "JEE", formula: "f'(a)=lim h->0 (f(a+h)-f(a))/h", note: "Zooming in turns a smooth curve into its tangent line.", visual: "derivative" },
  { title: "Mean Value Theorem", level: "JEE", formula: "f'(c)=(f(b)-f(a))/(b-a)", note: "Some tangent slope matches the average slope over an interval.", visual: "derivative" },
  { title: "Maxima and Minima", level: "JEE", formula: "f'(x)=0", note: "Critical points mark candidates for peaks, valleys, and turning behavior.", visual: "derivative" },
  { title: "Riemann Sums", level: "JEE", formula: "sum f(x_i) Delta x", note: "Rectangles converge to signed area as width shrinks.", visual: "integral" },
  { title: "Fundamental Theorem", level: "JEE", formula: "d/dx integral_a^x f(t)dt=f(x)", note: "Differentiation and accumulation are inverse processes.", visual: "integral" },
  { title: "Improper Integrals", level: "Degree", formula: "lim b->inf integral_a^b f(x)dx", note: "Finite area can exist even over an infinite interval.", visual: "integral" },
  { title: "Taylor Series", level: "Degree", formula: "sum f^(n)(a)(x-a)^n/n!", note: "A polynomial can locally approximate a smooth function.", visual: "series" },
  { title: "Partial Derivatives", level: "Degree", formula: "partial f / partial x", note: "Hold one variable fixed and measure slope in another direction.", visual: "multi" },
  { title: "Gradient and Directional Derivative", level: "Degree", formula: "D_u f = grad f dot u", note: "The gradient points toward steepest increase.", visual: "multi" },
  { title: "Differential Equations", level: "Degree", formula: "dy/dx = ky", note: "A derivative rule generates a family of curves.", visual: "ode" },
  { title: "Uniform Convergence", level: "PG", formula: "sup |f_n-f| -> 0", note: "The whole graph converges together, not just point by point.", visual: "series" },
  { title: "Line and Surface Integrals", level: "PG", formula: "integral_C F dot dr", note: "Accumulate a field along a curve or across a surface.", visual: "multi" },
  { title: "Fourier Analysis", level: "PG", formula: "f(x) ~ a0 + sum an cos nx + bn sin nx", note: "Periodic functions decompose into trigonometric waves.", visual: "series" },
];

export default function CalculusConceptAtlas() {
  const [level, setLevel] = useState<"All" | Concept["level"]>("All");
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [x, setX] = useState(1.4);
  const [n, setN] = useState(6);
  const visible = useMemo(() => concepts.filter((item) => level === "All" || item.level === level), [level]);
  const selected = useMemo(
    () => visible.find((item) => item.title === selectedTitle) ?? visible[0] ?? concepts[0],
    [visible, selectedTitle],
  );

  return (
    <SectionCard title="Calculus Concept Atlas" description="Click a concept to drive the interactive sketch. Filter by level." compact>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(["All", "JEE", "Degree", "PG"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setLevel(item)} className={level === item ? "action-primary px-3 py-2 text-xs" : "tool-button px-3 py-2 text-xs"}>
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid auto-rows-min gap-2 md:grid-cols-2">
            {visible.map((item) => (
              <ConceptCard key={item.title} concept={item} active={item.title === selected.title} onClick={() => setSelectedTitle(item.title)} />
            ))}
          </div>
          <div className="space-y-3">
            <SliderControl label="x or interval point" value={x} min={-3} max={3} step={0.1} onChange={setX} />
            <SliderControl label="terms / rectangles" value={n} min={1} max={20} step={1} onChange={setN} />
            <ConceptCard concept={selected} active />
            <div className="grid grid-cols-2 gap-2">
              <Metric label="f(x)" value={roundTo(Math.sin(x) + x * x * 0.15, 3)} />
              <Metric label="n" value={n} />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/40">
              <CalculusSketch visual={selected.visual} x={x} n={n} />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function ConceptCard({ concept, active = false, onClick }: { concept: Concept; active?: boolean; onClick?: () => void }) {
  const classes = `rounded-lg border p-3 transition text-left w-full ${active ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/50 dark:bg-cyan-400/10" : "border-slate-200 bg-white/75 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"}`;
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-black text-slate-950 dark:text-white">{concept.title}</h3>
        <span className="mini-chip">{concept.level}</span>
      </div>
      <p className="mt-2 font-mono text-[12px] text-cyan-700 dark:text-cyan-200">{concept.formula}</p>
      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{concept.note}</p>
    </>
  );
  if (onClick) return <button type="button" onClick={onClick} className={classes}>{content}</button>;
  return <div className={classes}>{content}</div>;
}

function CalculusSketch({ visual, x, n }: { visual: Concept["visual"]; x: number; n: number }) {
  const width = 720;
  const height = 320;
  const sx = (v: number) => width / 2 + v * 82;
  const sy = (v: number) => height / 2 - v * 58;
  const f = (v: number) => Math.sin(v) + 0.15 * v * v;
  const path = Array.from({ length: 180 }, (_, i) => {
    const t = -4 + (i / 179) * 8;
    return `${i ? "L" : "M"}${sx(t)},${sy(f(t))}`;
  }).join(" ");
  const px = sx(x);
  const py = sy(f(x));
  const slope = Math.cos(x) + 0.3 * x;
  const series = Array.from({ length: Math.max(1, Math.round(n)) }, (_, i) => i).reduce((sum, k) => sum + ((k % 2 === 0 ? 1 : -1) * x ** (2 * k + 1)) / factorial(2 * k + 1), 0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[320px] w-full">
      <rect width={width} height={height} rx="14" fill="#f8fafc" />
      <Grid width={width} height={height} />
      <path d={path} fill="none" stroke="#06b6d4" strokeWidth="4" />
      {(visual === "limit" || visual === "derivative") && <line x1={px - 90} y1={py + slope * 90} x2={px + 90} y2={py - slope * 90} stroke="#f59e0b" strokeWidth="3" />}
      {visual === "integral" && Array.from({ length: Math.round(n) }, (_, i) => {
        const a = -3;
        const dx = 6 / Math.round(n);
        const rx = a + i * dx;
        const h = f(rx + dx);
        return <rect key={i} x={sx(rx)} y={sy(Math.max(0, h))} width={dx * 82} height={Math.abs(sy(h) - sy(0))} fill="#8b5cf6" opacity="0.26" stroke="#8b5cf6" />;
      })}
      {visual === "series" && <path d={`M${sx(-3)},${sy(series)} L${sx(3)},${sy(series)}`} stroke="#ec4899" strokeWidth="3" strokeDasharray="8 5" />}
      {visual === "ode" && Array.from({ length: 13 }, (_, i) => <line key={i} x1={100 + i * 45} y1={260 - i * 10} x2={132 + i * 45} y2={246 - i * 10} stroke="#10b981" strokeWidth="3" />)}
      {visual === "multi" && <g><ellipse cx="365" cy="160" rx="190" ry="72" fill="#06b6d4" opacity="0.12" stroke="#06b6d4" strokeWidth="3" /><line x1="360" y1="160" x2="470" y2="100" stroke="#f59e0b" strokeWidth="4" /><text x="480" y="96" fill="#0f172a" fontSize="13" fontWeight="800">gradient</text></g>}
      <circle cx={px} cy={py} r="7" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
    </svg>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg bg-slate-100 p-2 dark:bg-white/10"><p className="text-[10px] font-black uppercase text-slate-500">{label}</p><p className="font-mono text-sm font-bold">{value}</p></div>;
}

function Grid({ width, height }: { width: number; height: number }) {
  return <g opacity="0.55">{Array.from({ length: 9 }).map((_, i) => <line key={`v-${i}`} x1={(i / 8) * width} x2={(i / 8) * width} y1="0" y2={height} stroke="#e2e8f0" />)}{Array.from({ length: 7 }).map((_, i) => <line key={`h-${i}`} x1="0" x2={width} y1={(i / 6) * height} y2={(i / 6) * height} stroke="#e2e8f0" />)}</g>;
}

function factorial(value: number): number {
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}
