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
      </div>
    </LabShell>
  );
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
