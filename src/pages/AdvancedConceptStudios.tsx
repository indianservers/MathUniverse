import { Binary, BookOpen, ChartSpline, FunctionSquare, Sigma } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FormulaBlock, MathLabLayout, ResultCard } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";

type StudioId = "continued-fractions" | "famous-problems" | "stats-inference" | "differential-equations" | "special-functions";

type Studio = {
  id: StudioId;
  title: string;
  summary: string;
  icon: LucideIcon;
  useCases: string[];
};

const studios: Studio[] = [
  {
    id: "continued-fractions",
    title: "Continued Fractions Lab",
    summary: "Expand numbers into partial quotients and watch convergents lock onto better rational approximations.",
    icon: Sigma,
    useCases: ["continued fractions", "convergents", "approximations", "Euclidean algorithm"],
  },
  {
    id: "famous-problems",
    title: "Famous Problems Atlas",
    summary: "Browse landmark conjectures, theorems, paradoxes, and open problems by status and mathematical theme.",
    icon: BookOpen,
    useCases: ["Riemann hypothesis", "Fermat", "Collatz", "four-color theorem"],
  },
  {
    id: "stats-inference",
    title: "Statistics Inference Studio",
    summary: "Estimate proportions, change confidence levels, and compare confidence intervals with hypothesis-test signals.",
    icon: ChartSpline,
    useCases: ["confidence intervals", "sample size", "hypothesis tests", "proportions"],
  },
  {
    id: "differential-equations",
    title: "Differential Equations Studio",
    summary: "Compare exact and numerical solutions for growth, decay, and forced first-order models.",
    icon: FunctionSquare,
    useCases: ["ODEs", "Euler method", "initial values", "phase behavior"],
  },
  {
    id: "special-functions",
    title: "Special Functions Gallery",
    summary: "Explore Gamma, Beta, error-function, and zeta-style function values as parameters move.",
    icon: Binary,
    useCases: ["Gamma", "Beta", "erf", "zeta", "special functions"],
  },
];

const pathToStudio: Record<string, StudioId> = {
  "/math-lab/continued-fractions": "continued-fractions",
  "/math-lab/famous-problems": "famous-problems",
  "/math-lab/stats-inference": "stats-inference",
  "/math-lab/differential-equations": "differential-equations",
  "/math-lab/special-functions": "special-functions",
};

const famousProblems = [
  { name: "Riemann Hypothesis", status: "Open", theme: "Prime numbers", idea: "Zeros of the zeta function appear to control the fine rhythm of primes." },
  { name: "Collatz Conjecture", status: "Open", theme: "Iteration", idea: "Repeatedly halve even numbers and map odd n to 3n+1; every tested path falls to 1." },
  { name: "Goldbach Conjecture", status: "Open", theme: "Additive number theory", idea: "Every even integer greater than 2 seems to split into two primes." },
  { name: "Fermat's Last Theorem", status: "Proved", theme: "Number theory", idea: "No positive integer solutions exist for x^n + y^n = z^n when n > 2." },
  { name: "Four-Color Theorem", status: "Proved", theme: "Graph theory", idea: "Every planar map can be colored with at most four colors so adjacent regions differ." },
  { name: "Russell's Paradox", status: "Resolved by axioms", theme: "Set theory", idea: "The set of all sets that do not contain themselves breaks naive set formation." },
];

function selectStudioFromPath(pathname: string): StudioId {
  return pathToStudio[pathname] ?? "continued-fractions";
}

export default function AdvancedConceptStudios() {
  const location = useLocation();
  const [activeStudio, setActiveStudio] = useState<StudioId>(() => selectStudioFromPath(location.pathname));
  const active = studios.find((studio) => studio.id === activeStudio) ?? studios[0];

  return (
    <MathLabLayout
      title="Advanced Concept Studios"
      subtitle="Focused interactive coverage for Wolfram-style mathematics categories that were missing or thin."
      notes={<StudioNotes />}
    >
      <SectionCard title="Studio Switcher" description="Open one strand at a time, or use the direct Math Lab links from the side navigation." compact>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {studios.map((studio) => {
            const Icon = studio.icon;
            const selected = studio.id === activeStudio;
            return (
              <button
                key={studio.id}
                type="button"
                onClick={() => setActiveStudio(studio.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  selected
                    ? "border-cyan-400 bg-cyan-50 text-cyan-950 shadow-sm dark:border-cyan-300/50 dark:bg-cyan-300/15 dark:text-cyan-50"
                    : "border-slate-200 bg-white/70 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-200" />
                <span className="mt-2 block text-sm font-black">{studio.title}</span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title={active.title} description={active.summary} allowFullscreen>
        {activeStudio === "continued-fractions" && <ContinuedFractionsLab />}
        {activeStudio === "famous-problems" && <FamousProblemsAtlas />}
        {activeStudio === "stats-inference" && <StatsInferenceStudio />}
        {activeStudio === "differential-equations" && <DifferentialEquationsStudio />}
        {activeStudio === "special-functions" && <SpecialFunctionsGallery />}
      </SectionCard>

      <ResultCard
        title="Coverage Added"
        result={
          <div className="grid gap-2 text-sm font-semibold md:grid-cols-2">
            {active.useCases.map((item) => <span key={item} className="mini-chip bg-white/80 dark:bg-white/10">{item}</span>)}
          </div>
        }
        relatedTools={[
          { label: "Math Lab", route: "/math-lab" },
          { label: "Advanced Syllabus", route: "/syllabus" },
          { label: "Visual Dictionary", route: "/visual-dictionary" },
        ]}
      />
    </MathLabLayout>
  );
}

function StudioNotes() {
  return (
    <div className="space-y-3">
      <SectionCard title="Why These Studios">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          These cover the Wolfram-style categories that were not first-class in the app: continued fractions, famous problems,
          inferential statistics, deeper differential equations, and special mathematical functions.
        </p>
      </SectionCard>
      <SectionCard title="Growth Path">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Each studio starts with a reliable browser-only model and can later expand into route-specific solvers, richer graphing,
          proof cards, and worked-example banks.
        </p>
      </SectionCard>
    </div>
  );
}

function ContinuedFractionsLab() {
  const [source, setSource] = useState("sqrt2");
  const [terms, setTerms] = useState(8);
  const value = source === "pi" ? Math.PI : source === "e" ? Math.E : source === "phi" ? (1 + Math.sqrt(5)) / 2 : Math.sqrt(2);
  const data = useMemo(() => continuedFraction(value, terms), [terms, value]);
  const last = data[data.length - 1];

  return (
    <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
      <ControlPanel>
        <label className="grid gap-1 text-sm font-bold">
          Number
          <select className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950" value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="sqrt2">sqrt(2)</option>
            <option value="pi">pi</option>
            <option value="e">e</option>
            <option value="phi">golden ratio</option>
          </select>
        </label>
        <Range label="Terms" min={2} max={14} step={1} value={terms} onChange={setTerms} />
        <FormulaBlock title="Model" formula="x = a_0 + 1/(a_1 + 1/(a_2 + ...))" />
      </ControlPanel>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-950 p-4 text-white">
          <p className="text-xs font-black uppercase text-cyan-200">Best displayed convergent</p>
          <p className="mt-2 text-3xl font-black">{last.numerator}/{last.denominator}</p>
          <p className="mt-1 text-sm text-slate-300">value {last.value.toFixed(8)} · error {Math.abs(value - last.value).toExponential(2)}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {data.map((row) => (
            <div key={row.index} className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-white/5">
              <span className="font-black">a{row.index} = {row.partial}</span>
              <span className="ml-2 text-slate-500 dark:text-slate-400">{row.numerator}/{row.denominator}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FamousProblemsAtlas() {
  const [status, setStatus] = useState("All");
  const visible = famousProblems.filter((problem) => status === "All" || problem.status === status);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {["All", "Open", "Proved", "Resolved by axioms"].map((item) => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`tool-button ${status === item ? "bg-cyan-500 text-white" : ""}`}>{item}</button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((problem) => (
          <article key={problem.name} className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{problem.theme}</p>
            <h3 className="mt-1 text-lg font-black">{problem.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{problem.idea}</p>
            <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">{problem.status}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function StatsInferenceStudio() {
  const [sampleSize, setSampleSize] = useState(120);
  const [successes, setSuccesses] = useState(72);
  const [confidence, setConfidence] = useState(95);
  const cappedSuccesses = Math.min(successes, sampleSize);
  const z = confidence === 90 ? 1.645 : confidence === 99 ? 2.576 : 1.96;
  const phat = cappedSuccesses / sampleSize;
  const se = Math.sqrt((phat * (1 - phat)) / sampleSize);
  const margin = z * se;
  const testZ = (phat - 0.5) / Math.sqrt(0.25 / sampleSize);

  return (
    <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
      <ControlPanel>
        <Range label="Sample size" min={20} max={500} step={5} value={sampleSize} onChange={setSampleSize} />
        <Range label="Successes" min={0} max={sampleSize} step={1} value={cappedSuccesses} onChange={setSuccesses} />
        <Range label="Confidence" min={90} max={99} step={4} value={confidence} onChange={(value) => setConfidence(value >= 98 ? 99 : value >= 94 ? 95 : 90)} />
      </ControlPanel>
      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Sample proportion" value={phat.toFixed(3)} />
        <Metric label={`${confidence}% interval`} value={`${Math.max(0, phat - margin).toFixed(3)} to ${Math.min(1, phat + margin).toFixed(3)}`} />
        <Metric label="z vs p0 = 0.5" value={testZ.toFixed(2)} />
      </div>
    </div>
  );
}

function DifferentialEquationsStudio() {
  const [rate, setRate] = useState(0.4);
  const [initial, setInitial] = useState(2);
  const [stepSize, setStepSize] = useState(0.5);
  const points = useMemo(() => {
    let y = initial;
    return Array.from({ length: 9 }, (_, index) => {
      const t = index * stepSize;
      if (index > 0) y += stepSize * rate * y;
      return { t, euler: y, exact: initial * Math.exp(rate * t) };
    });
  }, [initial, rate, stepSize]);

  return (
    <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
      <ControlPanel>
        <Range label="Growth rate r" min={-1} max={1} step={0.05} value={rate} onChange={setRate} />
        <Range label="Initial value" min={0.5} max={6} step={0.1} value={initial} onChange={setInitial} />
        <Range label="Euler step" min={0.1} max={1} step={0.1} value={stepSize} onChange={setStepSize} />
        <FormulaBlock title="Initial-value model" formula="y' = r y,\quad y(0)=y_0" />
      </ControlPanel>
      <div className="grid gap-2 md:grid-cols-3">
        {points.map((point) => (
          <div key={point.t} className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-white/5">
            <p className="font-black">t = {point.t.toFixed(1)}</p>
            <p>Euler {point.euler.toFixed(3)}</p>
            <p className="text-cyan-700 dark:text-cyan-200">Exact {point.exact.toFixed(3)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecialFunctionsGallery() {
  const [a, setA] = useState(2.5);
  const [b, setB] = useState(3);
  const gammaA = gamma(a);
  const gammaB = gamma(b);
  const beta = (gammaA * gammaB) / gamma(a + b);
  const erfA = erf(a / 2);
  const zeta2 = Math.PI ** 2 / 6;

  return (
    <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
      <ControlPanel>
        <Range label="Parameter a" min={0.5} max={6} step={0.1} value={a} onChange={setA} />
        <Range label="Parameter b" min={0.5} max={6} step={0.1} value={b} onChange={setB} />
        <FormulaBlock title="Bridge" formula="B(a,b)=\\Gamma(a)\\Gamma(b)/\\Gamma(a+b)" />
      </ControlPanel>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Gamma(a)" value={gammaA.toFixed(4)} />
        <Metric label="Gamma(b)" value={gammaB.toFixed(4)} />
        <Metric label="Beta(a,b)" value={beta.toFixed(4)} />
        <Metric label="erf(a/2)" value={erfA.toFixed(4)} />
        <Metric label="zeta(2)" value={zeta2.toFixed(4)} />
        <Link to="/syllabus-lab/beta-gamma-curves" className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 font-black text-cyan-800 transition hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
          Open Beta/Gamma curves
        </Link>
      </div>
    </div>
  );
}

function ControlPanel({ children }: { children: ReactNode }) {
  return <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950/35">{children}</div>;
}

function Range({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1 text-sm font-bold">
      <span className="flex justify-between gap-2"><span>{label}</span><span>{Number(value.toFixed(3))}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 break-words text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function continuedFraction(value: number, count: number) {
  let x = value;
  const partials: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const partial = Math.floor(x);
    partials.push(partial);
    const remainder = x - partial;
    if (Math.abs(remainder) < 1e-12) break;
    x = 1 / remainder;
  }
  return partials.map((partial, index) => {
    const [numerator, denominator] = convergent(partials.slice(0, index + 1));
    return { index, partial, numerator, denominator, value: numerator / denominator };
  });
}

function convergent(partials: number[]) {
  let numerator = 1;
  let denominator = 0;
  for (let i = partials.length - 1; i >= 0; i -= 1) {
    [numerator, denominator] = [partials[i] * numerator + denominator, numerator];
  }
  return [numerator, denominator] as const;
}

function gamma(z: number): number {
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  let x = 0.9999999999998099;
  const shifted = z - 1;
  coefficients.forEach((coefficient, index) => {
    x += coefficient / (shifted + index + 1);
  });
  const t = shifted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (shifted + 0.5) * Math.exp(-t) * x;
}

function erf(x: number) {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return sign * y;
}
