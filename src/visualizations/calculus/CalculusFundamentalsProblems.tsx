import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { roundTo } from "../../utils/math";

type Point = { x: number; y: number };

const width = 720;
const height = 420;

export default function CalculusFundamentalsProblems() {
  const [active, setActive] = useState("limits");
  const tabs = [
    { id: "limits", label: "6 Limits Micro-gap" },
    { id: "functional", label: "7 Differentiability" },
    { id: "distance", label: "8 Shortest Distance" },
    { id: "substitution", label: "9 FTC Substitution" },
    { id: "kings", label: "10 King's Property" },
  ];
  return (
    <SectionCard title="Calculus Fundamentals: Problems 6 to 10" description="Interactive proof-style visualizers for limits, differentiability, derivative applications, and integration." compact>
      <div className="mobile-safe-scroll thin-scrollbar mb-3">
        <div className="inline-flex min-w-full gap-1 rounded-xl border border-slate-200 bg-white/80 p-1 dark:border-white/10 dark:bg-white/5 md:min-w-0">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" className={active === tab.id ? "action-primary min-h-9" : "tool-button min-h-9"} onClick={() => setActive(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {active === "limits" && <LimitsMicroGap />}
      {active === "functional" && <FunctionalEquationDifferentiability />}
      {active === "distance" && <ShortestDistanceFinder />}
      {active === "substitution" && <SubstitutionFtcModel />}
      {active === "kings" && <KingsPropertyReflection />}
    </SectionCard>
  );
}

function LimitsMicroGap() {
  const [zoomPower, setZoomPower] = useState(2.5);
  const [autoZoom, setAutoZoom] = useState(false);
  const scale = 10 ** zoomPower;
  const xWindow = 2 / scale;
  const xProbe = Math.max(1e-5, xWindow * 0.48);
  const f1 = (x: number) => Math.cos(Math.sin(x));
  const f2 = (x: number) => Math.cos(x);
  const gap = stableCosSinGap(xProbe);
  const ratio = gap / xProbe ** 4;
  const view = makeView(-xWindow, xWindow, 1 - 0.75 * xWindow ** 2, 1 + Math.max(1e-8, 0.18 * xWindow ** 2));
  const curveA = sample((x) => ({ x, y: f1(x) }), -xWindow, xWindow, 720);
  const curveB = sample((x) => ({ x, y: f2(x) }), -xWindow, xWindow, 720);
  const ratioView = makeView(-xWindow, xWindow, 0, 0.34);
  const ratioLine = sample((x) => ({ x, y: Math.abs(x) < 1e-8 ? 1 / 6 : stableCosSinGap(x) / x ** 4 }), -xWindow, xWindow, 480);
  useEffect(() => {
    if (!autoZoom) return undefined;
    const start = zoomPower;
    const end = 5.2;
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 1200);
      const eased = 1 - (1 - progress) ** 3;
      setZoomPower(start + (end - start) * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setAutoZoom(false);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [autoZoom, zoomPower]);
  return (
    <div className="grid min-h-0 gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="desktop-sidebar-panel space-y-3">
        <Formula text="y1 = cos(sin x), y2 = cos x" />
        <SliderControl label="Exponential zoom into (0, 1)" min={0} max={5.2} step={0.05} value={zoomPower} onChange={setZoomPower} />
        <button type="button" className={autoZoom ? "action-primary w-full" : "tool-button w-full"} onClick={() => setAutoZoom((value) => !value)}>
          {autoZoom ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {autoZoom ? "Pause auto zoom" : "Auto zoom to gap"}
        </button>
        <Metric label="Magnification" value={`${roundTo(scale, 1)}x`} />
        <Metric label="Probe x" value={format(xProbe)} />
        <Metric label="Vertical gap" value={gap.toExponential(4)} />
        <Metric label="gap / x^4" value={`${roundTo(ratio, 6)} (target 1/6)`} />
      </div>
      <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <GraphFrame title="Extreme zoom near (0, 1)">
          <Axes view={view} />
          <path d={pathFor(curveA, view)} fill="none" stroke="#22d3ee" strokeWidth="3.5" />
          <path d={pathFor(curveB, view)} fill="none" stroke="#fbbf24" strokeWidth="3.5" />
          <line x1={sx(xProbe, view)} x2={sx(xProbe, view)} y1={sy(f2(xProbe) + gap, view)} y2={sy(f2(xProbe), view)} stroke="#fb7185" strokeWidth="5" strokeLinecap="round" />
          <circle cx={sx(0, view)} cy={sy(1, view)} r="6" fill="#ffffff" stroke="#22d3ee" strokeWidth="3" />
          <GraphLabel x={28} y={34} text="blue: cos(sin x), amber: cos x" />
        </GraphFrame>
        <GraphFrame title="Ratio stabilizes at 1/6">
          <Axes view={ratioView} />
          <line x1="44" x2="686" y1={sy(1 / 6, ratioView)} y2={sy(1 / 6, ratioView)} stroke="#a78bfa" strokeWidth="3" strokeDasharray="8 6" />
          <path d={pathFor(ratioLine, ratioView)} fill="none" stroke="#34d399" strokeWidth="4" />
          <GraphLabel x={28} y={34} text="gap / x^4 -> 1/6" />
        </GraphFrame>
      </div>
    </div>
  );
}

function FunctionalEquationDifferentiability() {
  const [x, setX] = useState(1.4);
  const f = (v: number) => v + v ** 3 / 3;
  const fp = (v: number) => 1 + v * v;
  const view = makeView(-4, 4, -18, 18);
  const slopeView = makeView(-4, 4, 0, 18);
  const y = f(x);
  const m = fp(x);
  const curve = sample((v) => ({ x: v, y: f(v) }), -4, 4, 260);
  const tangent = sample((v) => ({ x: v, y: y + m * (v - x) }), -4, 4, 40);
  const slopes = sample((v) => ({ x: v, y: fp(v) }), -4, 4, 220);
  return (
    <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="desktop-sidebar-panel space-y-3">
        <Formula text="f(x+y)=f(x)+f(y)+xy(x+y)" />
        <Formula text="f(x)=x+x^3/3, f'(x)=1+x^2" />
        <SliderControl label="Drag point x" min={-3.5} max={3.5} step={0.02} value={x} onChange={setX} />
        <Metric label="Point on f" value={`(${roundTo(x, 3)}, ${roundTo(y, 3)})`} />
        <Metric label="Live tangent slope" value={roundTo(m, 4).toString()} />
        <Metric label="Required flag" value={`f(3) = ${f(3)}`} />
      </div>
      <div className="grid gap-3 2xl:grid-cols-2">
        <GraphFrame title="Cubic curve with tangent">
          <Axes view={view} />
          <path d={pathFor(curve, view)} fill="none" stroke="#22d3ee" strokeWidth="4" />
          <path d={pathFor(tangent, view)} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6" />
          <circle cx={sx(x, view)} cy={sy(y, view)} r="7" fill="#fb7185" stroke="#fff" strokeWidth="2" />
          <circle cx={sx(3, view)} cy={sy(f(3), view)} r="7" fill="#34d399" stroke="#fff" strokeWidth="2" />
          <GraphLabel x={sx(3, view) - 48} y={sy(f(3), view) - 14} text="f(3)=12" />
        </GraphFrame>
        <GraphFrame title="Derivative graph builds y = 1 + x^2">
          <Axes view={slopeView} />
          <path d={pathFor(slopes, slopeView)} fill="none" stroke="#a78bfa" strokeWidth="4" />
          <circle cx={sx(x, slopeView)} cy={sy(m, slopeView)} r="7" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
          <GraphLabel x={28} y={34} text={`slope = ${roundTo(m, 3)}`} />
        </GraphFrame>
      </div>
    </div>
  );
}

function ShortestDistanceFinder() {
  const [t, setT] = useState(1.2);
  const [locking, setLocking] = useState(false);
  const p = { x: t * t, y: 2 * t };
  const locked = Math.abs(t - 2) < 0.08;
  const view = makeView(-0.8, 8.4, -5, 5);
  const parabola = sample((v) => ({ x: v * v, y: 2 * v }), -2.4, 2.4, 240);
  const circle = sample((a) => ({ x: 6 + Math.sqrt(5) * Math.cos(a), y: Math.sqrt(5) * Math.sin(a) }), 0, Math.PI * 2, 180);
  const center = { x: 6, y: 0 };
  const centerDistance = Math.hypot(p.x - center.x, p.y);
  const boundaryGap = centerDistance - Math.sqrt(5);
  useEffect(() => {
    if (!locking) return undefined;
    let frame = 0;
    const animate = () => {
      setT((value) => {
        const next = value + (2 - value) * 0.16;
        if (Math.abs(next - 2) < 0.002) {
          setLocking(false);
          return 2;
        }
        return next;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [locking]);
  return (
    <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="desktop-sidebar-panel space-y-3">
        <Formula text="Parabola y^2=4x, circle (x-6)^2+y^2=5" />
        <SliderControl label="Move P(t^2, 2t)" min={-2.2} max={2.8} step={0.01} value={t} onChange={setT} />
        <button type="button" className={locking ? "action-primary w-full" : "tool-button w-full"} onClick={() => setLocking(true)}><RotateCcw className="h-4 w-4" />Animate to minimum</button>
        <Metric label="Point P" value={`(${roundTo(p.x, 3)}, ${roundTo(p.y, 3)})`} />
        <Metric label="Center distance PC" value={roundTo(centerDistance, 5).toString()} />
        <Metric label="Boundary gap" value={`${roundTo(boundaryGap, 5)}; exact min sqrt(5)`} />
      </div>
      <GraphFrame title="Shortest distance geometry">
        <Axes view={view} />
        <path d={pathFor(parabola, view)} fill="none" stroke="#22d3ee" strokeWidth="4" />
        <path d={pathFor(circle, view)} fill="rgba(167,139,250,.12)" stroke="#a78bfa" strokeWidth="4" />
        <line x1={sx(4, view)} y1={sy(4, view)} x2={sx(6, view)} y2={sy(0, view)} stroke="#34d399" strokeWidth="2" strokeDasharray="6 6" opacity={locked ? 0.85 : 0.2} />
        <line x1={sx(p.x, view)} y1={sy(p.y, view)} x2={sx(center.x, view)} y2={sy(center.y, view)} stroke={locked ? "#34d399" : "#f59e0b"} strokeWidth="5" strokeLinecap="round" />
        <circle cx={sx(p.x, view)} cy={sy(p.y, view)} r="8" fill="#fb7185" stroke="#fff" strokeWidth="2" />
        <circle cx={sx(center.x, view)} cy={sy(center.y, view)} r="8" fill="#34d399" stroke="#fff" strokeWidth="2" />
        <GraphLabel x={sx(center.x, view) + 10} y={sy(center.y, view) - 10} text="C(6,0)" />
        {locked && <GraphLabel x={44} y={42} text="minimum: boundary gap = sqrt(5)" />}
      </GraphFrame>
    </div>
  );
}

function SubstitutionFtcModel() {
  const [x, setX] = useState(1.4);
  const integrand = (v: number) => {
    if (Math.abs(v) < 0.08) return null;
    const atan = Math.atan((v * v + 1) / v);
    return ((v * v - 1) / (v ** 4 + 3 * v * v + 1)) / atan;
  };
  const antiderivative = (v: number) => {
    if (Math.abs(v) < 0.08) return null;
    return Math.log(Math.abs(Math.atan((v * v + 1) / v)));
  };
  const left = sampleNullable((v) => ({ x: v, y: integrand(v) }), -4, 4, 360);
  const right = sampleNullable((v) => ({ x: v, y: antiderivative(v) }), -4, 4, 360);
  const yLeft = integrand(x) ?? 0;
  const yRight = antiderivative(x) ?? 0;
  const leftView = makeView(-4, 4, -1.1, 1.1);
  const rightView = makeView(-4, 4, -1.6, 1.6);
  return (
    <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="desktop-sidebar-panel space-y-3">
        <Formula text="F'(x)=f(x)" />
        <SliderControl label="Scrub x across both graphs" min={-3.8} max={3.8} step={0.02} value={x} onChange={setX} />
        <Metric label="Left function height f(x)" value={roundTo(yLeft, 5).toString()} />
        <Metric label="Right curve F(x)" value={roundTo(yRight, 5).toString()} />
        <Metric label="Slope triangle" value={`rise/run = ${roundTo(yLeft, 5)}`} />
      </div>
      <div className="grid gap-3 2xl:grid-cols-2">
        <GraphFrame title="Rational inverse-tangent integrand">
          <Axes view={leftView} />
          <path d={pathFor(left, leftView)} fill="none" stroke="#22d3ee" strokeWidth="4" />
          <line x1={sx(x, leftView)} x2={sx(x, leftView)} y1="24" y2="392" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 5" />
          <circle cx={sx(x, leftView)} cy={sy(yLeft, leftView)} r="7" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
        </GraphFrame>
        <GraphFrame title="Composite log inverse-tangent integral">
          <Axes view={rightView} />
          <path d={pathFor(right, rightView)} fill="none" stroke="#a78bfa" strokeWidth="4" />
          <line x1={sx(x, rightView)} x2={sx(x, rightView)} y1="24" y2="392" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 5" />
          <polyline points={`${sx(x, rightView)},${sy(yRight, rightView)} ${sx(x + 0.65, rightView)},${sy(yRight, rightView)} ${sx(x + 0.65, rightView)},${sy(yRight + yLeft * 0.65, rightView)}`} fill="none" stroke="#34d399" strokeWidth="4" strokeLinejoin="round" />
          <circle cx={sx(x, rightView)} cy={sy(yRight, rightView)} r="7" fill="#34d399" stroke="#fff" strokeWidth="2" />
        </GraphFrame>
      </div>
    </div>
  );
}

function KingsPropertyReflection() {
  const [reflected, setReflected] = useState(false);
  const [mix, setMix] = useState(0);
  const [runId, setRunId] = useState(0);
  const f = (x: number) => (x * Math.sin(x)) / (1 + Math.cos(x) ** 2);
  const view = makeView(0, Math.PI, -0.15, 2.3);
  const original = sample((x) => ({ x, y: f(x) }), 0, Math.PI, 240);
  const flipped = sample((x) => ({ x, y: f(Math.PI - x) }), 0, Math.PI, 240);
  const blended = original.map((p, index) => ({ x: p.x, y: p.y * (1 - mix) + (flipped[index]?.y ?? p.y) * mix }));
  useEffect(() => {
    if (!reflected) return undefined;
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 900);
      setMix(progress);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reflected, runId]);
  return (
    <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="desktop-sidebar-panel space-y-3">
        <Formula text="Integral_a^b f(x) dx = Integral_a^b f(a+b-x) dx" />
        <button type="button" className="action-primary w-full" onClick={() => { setReflected(true); setMix(0); setRunId((value) => value + 1); }}><Play className="h-4 w-4" />Apply King's Property</button>
        <button type="button" className="tool-button w-full" onClick={() => { setReflected(false); setMix(0); setRunId((value) => value + 1); }}><Pause className="h-4 w-4" />Reset overlay</button>
        <SliderControl label="Reflection blend" min={0} max={1} step={0.01} value={mix} onChange={setMix} />
        <Metric label="Midpoint" value="pi / 2" />
        <Metric label="Exact area" value="pi^2 / 4" />
      </div>
      <GraphFrame title="Area preserved under horizontal reflection">
        <Axes view={view} />
        <AreaUnder points={original} view={view} fill="rgba(34,211,238,.24)" />
        {(reflected || mix > 0) && <AreaUnder points={blended} view={view} fill={`rgba(245,158,11,${0.08 + mix * 0.24})`} />}
        <path d={pathFor(original, view)} fill="none" stroke="#22d3ee" strokeWidth="4" />
        {(reflected || mix > 0) && <path d={pathFor(blended, view)} fill="none" stroke="#f59e0b" strokeWidth="4" opacity="0.82" />}
        <line x1={sx(Math.PI / 2, view)} x2={sx(Math.PI / 2, view)} y1="24" y2="392" stroke="#a78bfa" strokeWidth="3" strokeDasharray="8 6" />
        {reflected && <GraphLabel x={width - 190} y={42} text="collapses to pi^2 / 4" />}
        {mix > 0.98 && <foreignObject x={width - 210} y="58" width="178" height="68"><div className="rounded-xl border border-emerald-300/40 bg-emerald-400/15 p-3 text-center text-sm font-black text-emerald-100">Exact area<br />pi^2 / 4</div></foreignObject>}
      </GraphFrame>
    </div>
  );
}

function GraphFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-cyan-200/15 bg-slate-950 p-3 shadow-inner shadow-cyan-950/30">
      <p className="mb-2 text-sm font-black text-cyan-100">{title}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[420px] w-full overflow-hidden rounded-lg bg-slate-950" shapeRendering="geometricPrecision">
        {children}
      </svg>
    </div>
  );
}

function Axes({ view }: { view: ReturnType<typeof makeView> }) {
  const xs = ticks(view.xMin, view.xMax, 8);
  const ys = ticks(view.yMin, view.yMax, 6);
  return (
    <g>
      {xs.map((x) => <line key={`x${x}`} x1={sx(x, view)} x2={sx(x, view)} y1="24" y2="392" stroke="rgba(148,163,184,.16)" vectorEffect="non-scaling-stroke" />)}
      {ys.map((y) => <line key={`y${y}`} x1="44" x2="686" y1={sy(y, view)} y2={sy(y, view)} stroke="rgba(148,163,184,.16)" vectorEffect="non-scaling-stroke" />)}
      <line x1="44" x2="686" y1={sy(0, view)} y2={sy(0, view)} stroke="rgba(148,163,184,.5)" vectorEffect="non-scaling-stroke" />
      <line x1={sx(0, view)} x2={sx(0, view)} y1="24" y2="392" stroke="rgba(148,163,184,.5)" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

function AreaUnder({ points, view, fill }: { points: Point[]; view: ReturnType<typeof makeView>; fill: string }) {
  const zeroY = sy(0, view);
  const body = points.map((p) => `${sx(p.x, view)},${sy(p.y, view)}`).join(" ");
  return <polygon points={`${sx(points[0].x, view)},${zeroY} ${body} ${sx(points[points.length - 1].x, view)},${zeroY}`} fill={fill} />;
}

function GraphLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return <text x={x} y={y} fill="#e0f2fe" fontSize="14" fontWeight="900">{text}</text>;
}

function Formula({ text }: { text: string }) {
  return <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 font-mono text-sm font-black text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">{text}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="mt-1 break-words font-mono text-sm font-bold">{value}</p></div>;
}

function makeView(xMin: number, xMax: number, yMin: number, yMax: number) {
  return { xMin, xMax, yMin, yMax };
}

function sx(x: number, view: ReturnType<typeof makeView>) {
  return 44 + ((x - view.xMin) / (view.xMax - view.xMin)) * 642;
}

function sy(y: number, view: ReturnType<typeof makeView>) {
  return 392 - ((y - view.yMin) / (view.yMax - view.yMin)) * 368;
}

function pathFor(points: Point[], view: ReturnType<typeof makeView>) {
  return points.map((p, index) => `${index === 0 ? "M" : "L"} ${sx(p.x, view).toFixed(3)} ${sy(p.y, view).toFixed(3)}`).join(" ");
}

function sample(fn: (x: number) => Point, start: number, end: number, count: number) {
  return Array.from({ length: count }, (_, index) => fn(start + (index / (count - 1)) * (end - start)));
}

function sampleNullable(fn: (x: number) => Point | { x: number; y: number | null }, start: number, end: number, count: number) {
  return Array.from({ length: count }, (_, index) => fn(start + (index / (count - 1)) * (end - start)))
    .filter((p): p is Point => p.y !== null && Number.isFinite(p.y));
}

function stableCosSinGap(x: number) {
  if (Math.abs(x) < 0.02) {
    const x2 = x * x;
    const x4 = x2 * x2;
    const x6 = x4 * x2;
    return x4 / 6 - (17 * x6) / 180;
  }
  return Math.cos(Math.sin(x)) - Math.cos(x);
}

function ticks(min: number, max: number, count: number) {
  return Array.from({ length: count + 1 }, (_, index) => min + (index / count) * (max - min));
}

function format(value: number) {
  if (Math.abs(value) < 0.001) return value.toExponential(3);
  return roundTo(value, 6).toString();
}
