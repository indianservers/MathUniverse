import { ChartSpline, FlaskConical, Hash, Sigma } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import VisualizationTools from "../../../components/ui/VisualizationTools";
import type { AdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";

export default function AdvancedLessonInteractiveLab({ lesson }: { lesson: AdvancedConceptLesson }) {
  if (lesson.strand === "Continued Fractions") return <ContinuedFractionLab lesson={lesson} />;
  if (lesson.strand === "Famous Problems") return <FamousProblemLab lesson={lesson} />;
  if (lesson.strand === "Statistical Inference") return <InferenceLab lesson={lesson} />;
  if (lesson.strand === "Differential Equations") return <DifferentialEquationLab lesson={lesson} />;
  return <SpecialFunctionLab lesson={lesson} />;
}

function ContinuedFractionLab({ lesson }: { lesson: AdvancedConceptLesson }) {
  const [numerator, setNumerator] = useState(43);
  const [denominator, setDenominator] = useState(19);
  const expansion = useMemo(() => continuedFractionFor(numerator, denominator), [numerator, denominator]);

  return (
    <LabShell lesson={lesson} icon={<Hash className="h-4 w-4" />} title="Step Explorer">
      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <NumberField label="Numerator" value={numerator} min={1} max={999} onChange={setNumerator} />
          <NumberField label="Denominator" value={denominator} min={1} max={999} onChange={setDenominator} />
          <p className="rounded-xl bg-white/80 p-3 text-sm font-semibold leading-6 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
            {numerator}/{denominator} = {formatContinuedFraction(expansion.terms)}
          </p>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {expansion.convergents.map((item, index) => (
            <article key={`${item.numerator}-${item.denominator}-${index}`} className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
              <p className="text-[10px] font-black uppercase text-cyan-700 dark:text-cyan-200">Convergent {index + 1}</p>
              <h4 className="mt-1 text-lg font-black">{item.numerator}/{item.denominator}</h4>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">value {formatNumber(item.value)} - error {formatNumber(Math.abs(item.value - numerator / denominator))}</p>
            </article>
          ))}
        </div>
        <ContinuedFractionScene numerator={numerator} denominator={denominator} expansion={expansion} />
      </div>
    </LabShell>
  );
}

function FamousProblemLab({ lesson }: { lesson: AdvancedConceptLesson }) {
  const [start, setStart] = useState(27);
  const orbit = useMemo(() => collatzOrbit(start), [start]);
  const preview = orbit.values.slice(0, 18).join(" -> ");

  return (
    <LabShell lesson={lesson} icon={<FlaskConical className="h-4 w-4" />} title="Evidence Explorer">
      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <NumberField label="Collatz start" value={start} min={2} max={999} onChange={setStart} />
          <div className="grid grid-cols-2 gap-2 text-center">
            <Metric label="Steps" value={orbit.steps.toString()} />
            <Metric label="Peak" value={orbit.peak.toString()} />
          </div>
        </div>
        <div className="rounded-xl bg-white/85 p-4 dark:bg-slate-950/50">
          <p className="text-[10px] font-black uppercase text-cyan-700 dark:text-cyan-200">Orbit preview</p>
          <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{preview}{orbit.values.length > 18 ? " -> ..." : ""}</p>
          <p className="mt-3 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-300">
            This lab gives evidence and counterexample-hunting habits. The lesson still asks learners to name the difference between tested examples and proof.
          </p>
        </div>
        <FamousProblemScene lesson={lesson} start={start} orbit={orbit} />
      </div>
    </LabShell>
  );
}

function InferenceLab({ lesson }: { lesson: AdvancedConceptLesson }) {
  const [sampleSize, setSampleSize] = useState(64);
  const [standardDeviation, setStandardDeviation] = useState(12);
  const [confidence, setConfidence] = useState(95);
  const [estimate, setEstimate] = useState(50);
  const z = confidence === 90 ? 1.645 : confidence === 99 ? 2.576 : 1.96;
  const standardError = standardDeviation / Math.sqrt(sampleSize);
  const margin = z * standardError;

  return (
    <LabShell lesson={lesson} icon={<ChartSpline className="h-4 w-4" />} title="Interval Simulator">
      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <NumberField label="Estimate" value={estimate} min={1} max={200} onChange={setEstimate} />
          <NumberField label="Sample size" value={sampleSize} min={4} max={400} onChange={setSampleSize} />
          <NumberField label="Std. deviation" value={standardDeviation} min={1} max={80} onChange={setStandardDeviation} />
          <label className="block rounded-xl bg-white/80 p-3 text-sm font-bold dark:bg-slate-950/50">
            <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Confidence</span>
            <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-slate-900" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))}>
              <option value={90}>90%</option>
              <option value={95}>95%</option>
              <option value={99}>99%</option>
            </select>
          </label>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <Metric label="Standard error" value={formatNumber(standardError)} />
          <Metric label="Margin" value={formatNumber(margin)} />
          <Metric label="Interval" value={`${formatNumber(estimate - margin)} to ${formatNumber(estimate + margin)}`} />
        </div>
        <InferenceScene estimate={estimate} margin={margin} confidence={confidence} />
      </div>
    </LabShell>
  );
}

function DifferentialEquationLab({ lesson }: { lesson: AdvancedConceptLesson }) {
  const [k, setK] = useState(1);
  const [initialValue, setInitialValue] = useState(1);
  const [stepSize, setStepSize] = useState(0.25);
  const rows = useMemo(() => eulerRows(k, initialValue, stepSize, 8), [k, initialValue, stepSize]);

  return (
    <LabShell lesson={lesson} icon={<ChartSpline className="h-4 w-4" />} title="Euler Walk">
      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <NumberField label="k in y' = ky" value={k} min={-3} max={3} step={0.25} onChange={setK} />
          <NumberField label="Initial y" value={initialValue} min={-10} max={10} step={0.5} onChange={setInitialValue} />
          <NumberField label="Step size" value={stepSize} min={0.05} max={1} step={0.05} onChange={setStepSize} />
        </div>
        <div className="overflow-hidden rounded-xl bg-white/85 dark:bg-slate-950/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-cyan-50 text-xs font-black uppercase text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">
              <tr><th className="p-2">Step</th><th className="p-2">x</th><th className="p-2">y</th><th className="p-2">slope</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => <tr key={row.step} className="border-t border-slate-100 dark:border-white/10"><td className="p-2 font-bold">{row.step}</td><td className="p-2">{formatNumber(row.x)}</td><td className="p-2">{formatNumber(row.y)}</td><td className="p-2">{formatNumber(row.slope)}</td></tr>)}
            </tbody>
          </table>
        </div>
        <DifferentialEquationScene rows={rows} k={k} />
      </div>
    </LabShell>
  );
}

function SpecialFunctionLab({ lesson }: { lesson: AdvancedConceptLesson }) {
  const [x, setX] = useState(3);
  const [functionName, setFunctionName] = useState<"gamma" | "zeta" | "erf">("gamma");
  const value = useMemo(() => {
    if (functionName === "gamma") return gammaApprox(Math.max(0.1, x));
    if (functionName === "zeta") return zetaApprox(Math.max(1.1, x));
    return erfApprox(x);
  }, [functionName, x]);

  return (
    <LabShell lesson={lesson} icon={<Sigma className="h-4 w-4" />} title="Function Sampler">
      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <label className="block rounded-xl bg-white/80 p-3 text-sm font-bold dark:bg-slate-950/50">
            <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Function</span>
            <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-slate-900" value={functionName} onChange={(event) => setFunctionName(event.target.value as "gamma" | "zeta" | "erf")}>
              <option value="gamma">Gamma(x)</option>
              <option value="zeta">Zeta(x)</option>
              <option value="erf">erf(x)</option>
            </select>
          </label>
          <NumberField label="x" value={x} min={functionName === "zeta" ? 1.1 : -3} max={8} step={0.1} onChange={setX} />
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <Metric label="Input" value={formatNumber(x)} />
          <Metric label="Output" value={formatNumber(value)} />
          <Metric label="Note" value={specialFunctionNote(functionName)} />
        </div>
        <SpecialFunctionScene functionName={functionName} x={x} />
      </div>
    </LabShell>
  );
}

function ContinuedFractionScene({ numerator, denominator, expansion }: { numerator: number; denominator: number; expansion: ReturnType<typeof continuedFractionFor> }) {
  const target = numerator / denominator;
  const points = expansion.convergents.slice(0, 8).map((item, index) => {
    const error = Math.min(1, Math.abs(item.value - target));
    return { x: 44 + index * 35, y: 172 - (1 - error) * 120, label: `${item.numerator}/${item.denominator}` };
  });
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50" role="img" aria-label="continued fraction convergent error plot"><line x1="34" y1="178" x2="314" y2="178" stroke="#94a3b8" /><line x1="34" y1="34" x2="34" y2="178" stroke="#94a3b8" /><polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#06b6d4" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />{points.map((point, index) => <g key={`${point.label}-${index}`}><circle cx={point.x} cy={point.y} r="7" fill={index % 2 ? "#8b5cf6" : "#f59e0b"} /><text x={point.x - 16} y={point.y - 12} className="text-[9px] font-bold fill-slate-600">{point.label}</text></g>)}<text x="42" y="28" className="text-sm font-black fill-slate-700">convergents climb toward the target</text></svg>;
}

function FamousProblemScene({ lesson, start, orbit }: { lesson: AdvancedConceptLesson; start: number; orbit: ReturnType<typeof collatzOrbit> }) {
  const title = lesson.title.toLowerCase();
  if (title.includes("four-color")) return <FourColorScene />;
  if (title.includes("goldbach")) return <GoldbachScene even={Math.max(8, Math.round(start / 2) * 2)} />;
  if (title.includes("riemann")) return <PrimeWaveScene />;
  if (title.includes("fermat")) return <FermatScene power={3 + (start % 3)} />;
  return <CollatzScene values={orbit.values} />;
}

function CollatzScene({ values }: { values: number[] }) {
  const max = Math.max(...values.slice(0, 40));
  const points = values.slice(0, 40).map((value, index) => `${32 + index * 7},${182 - (value / max) * 140}`).join(" ");
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50"><polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="4" /><text x="36" y="30" className="text-sm font-black fill-slate-700">orbit spikes, falls, and hunts for 1</text></svg>;
}

function GoldbachScene({ even }: { even: number }) {
  const primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  const pairs = primes.filter((prime) => primes.includes(even - prime)).slice(0, 5);
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50">{pairs.map((prime, index) => <g key={prime}><circle cx={84 + index * 44} cy="92" r="20" fill="#06b6d4" opacity="0.75" /><circle cx={84 + index * 44} cy="142" r="20" fill="#f59e0b" opacity="0.75" /><text x={76 + index * 44} y="97" className="text-xs font-black fill-slate-800">{prime}</text><text x={74 + index * 44} y="147" className="text-xs font-black fill-slate-800">{even - prime}</text></g>)}<text x="44" y="34" className="text-sm font-black fill-slate-700">{even} as prime-pair evidence</text></svg>;
}

function PrimeWaveScene() {
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50">{Array.from({ length: 24 }, (_, index) => <line key={index} x1={40 + index * 11} y1="178" x2={40 + index * 11} y2={178 - (index % 5 === 0 || index % 7 === 0 ? 92 : 34 + (index % 4) * 15)} stroke={index % 5 === 0 ? "#f59e0b" : "#06b6d4"} strokeWidth="5" strokeLinecap="round" />)}<path d="M38 110 C 92 48, 138 172, 188 98 S 268 54, 304 126" fill="none" stroke="#8b5cf6" strokeWidth="4" /><text x="38" y="30" className="text-sm font-black fill-slate-700">prime counts wobble around a smooth wave</text></svg>;
}

function FermatScene({ power }: { power: number }) {
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50"><rect x="54" y="92" width="54" height="54" rx="8" fill="#06b6d4" opacity="0.75" /><rect x="130" y="70" width="72" height="72" rx="8" fill="#f59e0b" opacity="0.72" /><rect x="230" y="44" width="92" height="92" rx="8" fill="#8b5cf6" opacity="0.38" stroke="#8b5cf6" strokeWidth="4" /><text x="54" y="178" className="text-sm font-black fill-slate-700">try to tile c^n from a^n + b^n, n={power}</text></svg>;
}

function FourColorScene() {
  const colors = ["#06b6d4", "#f59e0b", "#8b5cf6", "#22c55e", "#06b6d4", "#f59e0b"];
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50">{colors.map((color, index) => <path key={index} d={`M${48 + index * 38},${62 + (index % 2) * 28} L${102 + index * 26},${42 + (index % 3) * 18} L${124 + index * 20},${112 + (index % 2) * 24} L${74 + index * 30},${160 - (index % 2) * 14} Z`} fill={color} opacity="0.7" stroke="#0f172a" strokeWidth="3" />)}<text x="42" y="202" className="text-sm font-black fill-slate-700">adjacent regions need different colours</text></svg>;
}

function InferenceScene({ estimate, margin, confidence }: { estimate: number; margin: number; confidence: number }) {
  const left = 170 - margin * 5;
  const right = 170 + margin * 5;
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50"><path d="M38 174 C 94 170, 104 72, 170 72 S 246 170, 302 174" fill="#22d3ee33" stroke="#06b6d4" strokeWidth="5" /><rect x={left} y="58" width={right - left} height="126" rx="14" fill="#f59e0b" opacity="0.24" stroke="#f59e0b" strokeWidth="3" /><line x1="170" y1="54" x2="170" y2="188" stroke="#8b5cf6" strokeWidth="5" /><text x="44" y="32" className="text-sm font-black fill-slate-700">{confidence}% interval around estimate {formatNumber(estimate)}</text></svg>;
}

function DifferentialEquationScene({ rows, k }: { rows: ReturnType<typeof eulerRows>; k: number }) {
  const path = rows.map((row, index) => `${44 + index * 30},${174 - row.y * 18}`).join(" ");
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50">{Array.from({ length: 54 }, (_, index) => { const x = 44 + (index % 9) * 30; const y = 42 + Math.floor(index / 9) * 24; const tilt = ((Math.floor(index / 9) - 3) * k) / 5; return <line key={index} x1={x - 7} y1={y + tilt * 7} x2={x + 7} y2={y - tilt * 7} stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />; })}<polyline points={path} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /><text x="42" y="28" className="text-sm font-black fill-slate-700">Euler path walks through the slope field</text></svg>;
}

function SpecialFunctionScene({ functionName, x }: { functionName: "gamma" | "zeta" | "erf"; x: number }) {
  const points = Array.from({ length: 80 }, (_, index) => {
    const t = functionName === "zeta" ? 1.1 + (index / 79) * 5 : -2 + (index / 79) * 6;
    const value = functionName === "gamma" ? Math.min(12, gammaApprox(Math.max(0.1, t))) : functionName === "zeta" ? Math.min(8, zetaApprox(t)) : erfApprox(t) * 4 + 4;
    return `${38 + index * 3.3},${178 - value * 12}`;
  }).join(" ");
  const markerX = functionName === "zeta" ? 38 + ((Math.max(1.1, x) - 1.1) / 5) * 264 : 38 + ((x + 2) / 6) * 264;
  return <svg viewBox="0 0 340 220" className="min-h-64 rounded-xl bg-white/85 p-2 dark:bg-slate-950/50"><line x1="38" y1="178" x2="304" y2="178" stroke="#94a3b8" /><polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /><line x1={markerX} y1="36" x2={markerX} y2="182" stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 5" /><text x="42" y="28" className="text-sm font-black fill-slate-700">{functionName} curve with active input marker</text></svg>;
}

function LabShell({ lesson, icon, title, children }: { lesson: AdvancedConceptLesson; icon: JSX.Element; title: string; children: JSX.Element }) {
  const labRef = useRef<HTMLElement>(null);
  return (
    <section ref={labRef} className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase text-cyan-800 dark:text-cyan-100">{icon}{title}</h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-cyan-700 dark:bg-white/10 dark:text-cyan-100">{lesson.strand}</span>
      </div>
      <VisualizationTools title={`${lesson.title} ${title}`} targetRef={labRef}>
        {children}
      </VisualizationTools>
    </section>
  );
}

function NumberField({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-xl bg-white/80 p-3 text-sm font-bold dark:bg-slate-950/50">
      <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</span>
      <input className="mt-2 w-full accent-cyan-600" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <input className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-slate-900" type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <span className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50"><strong className="block text-lg text-cyan-800 dark:text-cyan-100">{value}</strong><span className="text-xs font-bold text-slate-500 dark:text-slate-300">{label}</span></span>;
}

function continuedFractionFor(numerator: number, denominator: number) {
  const terms: number[] = [];
  let a = Math.max(1, Math.round(numerator));
  let b = Math.max(1, Math.round(denominator));
  for (let index = 0; index < 10 && b !== 0; index += 1) {
    const q = Math.floor(a / b);
    const r = a % b;
    terms.push(q);
    a = b;
    b = r;
  }

  const convergents = terms.map((_, index) => convergentFromTerms(terms.slice(0, index + 1)));
  return { terms, convergents };
}

function formatContinuedFraction(terms: number[]) {
  if (terms.length === 0) return "[]";
  if (terms.length === 1) return `[${terms[0]}]`;
  return `[${terms[0]}; ${terms.slice(1).join(", ")}]`;
}

function convergentFromTerms(terms: number[]) {
  let numerator = 1;
  let denominator = 0;
  for (let index = terms.length - 1; index >= 0; index -= 1) {
    const nextNumerator = terms[index] * numerator + denominator;
    denominator = numerator;
    numerator = nextNumerator;
  }
  return { numerator, denominator, value: numerator / denominator };
}

function collatzOrbit(start: number) {
  const values = [Math.max(2, Math.round(start))];
  while (values[values.length - 1] !== 1 && values.length < 300) {
    const current = values[values.length - 1];
    values.push(current % 2 === 0 ? current / 2 : current * 3 + 1);
  }
  return { values, steps: values.length - 1, peak: Math.max(...values) };
}

function eulerRows(k: number, initialValue: number, stepSize: number, count: number) {
  const rows: Array<{ step: number; x: number; y: number; slope: number }> = [];
  let x = 0;
  let y = initialValue;
  for (let step = 0; step <= count; step += 1) {
    const slope = k * y;
    rows.push({ step, x, y, slope });
    y += stepSize * slope;
    x += stepSize;
  }
  return rows;
}

function gammaApprox(z: number): number {
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 0.000009984369578019572, 0.00000015056327351493116];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaApprox(1 - z));
  let x = 0.9999999999998099;
  const shifted = z - 1;
  for (let index = 0; index < coefficients.length; index += 1) x += coefficients[index] / (shifted + index + 1);
  const t = shifted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (shifted + 0.5) * Math.exp(-t) * x;
}

function zetaApprox(s: number): number {
  let sum = 0;
  for (let n = 1; n <= 160; n += 1) sum += 1 / n ** s;
  return sum;
}

function erfApprox(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absolute = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * absolute);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-absolute * absolute);
  return sign * y;
}

function specialFunctionNote(name: "gamma" | "zeta" | "erf") {
  if (name === "gamma") return "factorial";
  if (name === "zeta") return "prime link";
  return "Gaussian area";
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) >= 1000) return value.toExponential(2);
  return value.toFixed(3).replace(/\.?0+$/, "");
}
