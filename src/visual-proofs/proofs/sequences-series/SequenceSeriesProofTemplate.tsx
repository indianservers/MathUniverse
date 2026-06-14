import { useEffect, useMemo, useState } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import {
  arithmeticSum,
  arithmeticTerm,
  finiteGeometricSum,
  fibonacci,
  fibonacciList,
  fibonacciSum,
  formatNumber,
  geometricTerm,
  harmonicPartialSum,
  infiniteGeometricSum,
  naturalNumberSum,
  oddNumberSum,
  pascalTriangleRows,
  triangularNumber,
} from "../../utils/sequenceSeriesMath";
import type { SequenceSeriesParameterKey, SequenceSeriesProofConfig } from "./sequenceSeriesProofConfigs";

type Values = Record<SequenceSeriesParameterKey, number>;

export default function SequenceSeriesProofTemplate({ category, proof, config }: { category: VisualProofCategory; proof: VisualProof; config: SequenceSeriesProofConfig }) {
  const defaults = useMemo(() => {
    const next = {} as Values;
    Object.entries(config.parameters).forEach(([key, parameter]) => {
      next[key as SequenceSeriesParameterKey] = parameter.defaultValue;
    });
    return next;
  }, [config.parameters]);

  const [values, setValues] = useState<Values>(defaults);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => Object.fromEntries(config.toggles.map((toggle) => [toggle, true])));

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setActiveStep((step) => (step + 1) % config.steps.length), 1300);
    return () => window.clearInterval(timer);
  }, [config.steps.length, isPlaying]);

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<SequenceSeriesVisual config={config} values={values} activeStep={activeStep} labelsVisible={labelsVisible} toggles={toggles} />}
      controls={
        <div className="space-y-3">
          <ProofControls
            activeStep={activeStep}
            totalSteps={config.steps.length}
            isPlaying={isPlaying}
            labelsVisible={labelsVisible}
            formulaVisible={formulaVisible}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => {
              setValues(defaults);
              setActiveStep(0);
              setIsPlaying(false);
              setLabelsVisible(true);
              setFormulaVisible(true);
              setToggles(Object.fromEntries(config.toggles.map((toggle) => [toggle, true])));
            }}
            onPrevious={() => setActiveStep((step) => Math.max(0, step - 1))}
            onNext={() => setActiveStep((step) => Math.min(config.steps.length - 1, step + 1))}
            onToggleLabels={() => setLabelsVisible((visible) => !visible)}
            onToggleFormula={() => setFormulaVisible((visible) => !visible)}
          />
          <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <h2 className="text-base font-black text-slate-950 dark:text-white">Parameters</h2>
            <div className="mt-3 space-y-3">
              {Object.entries(config.parameters).map(([key, parameter]) => (
                <Slider
                  key={key}
                  label={parameter.label}
                  value={values[key as SequenceSeriesParameterKey] ?? parameter.defaultValue}
                  min={parameter.min}
                  max={parameter.max}
                  step={parameter.step ?? 1}
                  onChange={(value) => setValues((current) => ({ ...current, [key]: value }))}
                />
              ))}
              {config.toggles.map((toggle) => (
                <label key={toggle} className="flex items-center justify-between gap-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
                  {toggle}
                  <input type="checkbox" checked={toggles[toggle] ?? true} onChange={() => setToggles((current) => ({ ...current, [toggle]: !(current[toggle] ?? true) }))} className="h-5 w-5 accent-cyan-500" />
                </label>
              ))}
            </div>
          </section>
        </div>
      }
      steps={<StepPanel activeStep={activeStep} steps={config.steps} />}
      formula={formulaVisible ? <FormulaPanel formulas={[...config.formulas, ...buildSequenceFormulas(config, values)]} /> : <HiddenPanel title="Formula hidden" />}
      conceptNotes={
        <ul className="list-disc space-y-2 pl-5">
          {config.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      }
      reflectionQuestions={config.questions}
    />
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span>{formatNumber(value)}</span>
      </span>
      <input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
    </label>
  );
}

function HiddenPanel({ title }: { title: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]">
      <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Use the formula toggle to show the proof text again.</p>
    </section>
  );
}

function SequenceSeriesVisual({ config, values, activeStep, labelsVisible, toggles }: { config: SequenceSeriesProofConfig; values: Values; activeStep: number; labelsVisible: boolean; toggles: Record<string, boolean> }) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={`${config.kind} sequence and series visual proof`} className="h-[540px] w-full max-w-full">
        <rect x="18" y="18" width="864" height="504" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        <Title title={titleForKind(config.kind)} subtitle={config.steps[activeStep]?.focusLabel ?? "visual proof"} />
        {config.kind === "apSteps" && <ApSteps values={values} labels={labelsVisible} />}
        {config.kind === "naturalSum" && <TriangularDots n={values.n ?? 8} labels={labelsVisible} duplicate={toggles["Show duplicate rectangle"] ?? true} />}
        {config.kind === "oddSum" && <SquareLayers n={values.n ?? 7} labels={labelsVisible} />}
        {config.kind === "apSum" && <ApSumBars values={values} labels={labelsVisible} showPairs={toggles["Show pair sums"] ?? true} />}
        {config.kind === "gpScaling" && <GpBars values={values} labels={labelsVisible} />}
        {config.kind === "finiteGp" && <FiniteGpBars values={values} labels={labelsVisible} showAlgebra={toggles["Show algebra cancellation"] ?? true} />}
        {config.kind === "infiniteGp" && <InfiniteGpModel values={values} labels={labelsVisible} />}
        {config.kind === "triangular" && <TriangularDots n={values.n ?? 9} labels={labelsVisible} duplicate={toggles["Show duplicate rectangle"] ?? true} />}
        {config.kind === "squareLayers" && <SquareLayers n={values.n ?? 8} labels={labelsVisible} />}
        {config.kind === "fibTiling" && <FibonacciTiles n={values.n ?? 8} labels={labelsVisible} spiral={false} />}
        {config.kind === "fibSpiral" && <FibonacciTiles n={values.n ?? 8} labels={labelsVisible} spiral />}
        {config.kind === "fibSum" && <FibonacciSumModel n={values.n ?? 8} labels={labelsVisible} />}
        {config.kind === "pascal" && <PascalModel n={values.n ?? 6} k={values.k ?? 3} labels={labelsVisible} />}
        {config.kind === "induction" && <InductionDominoes n={values.n ?? 12} labels={labelsVisible} />}
        {config.kind === "harmonic" && <HarmonicModel n={values.n ?? 32} labels={labelsVisible} />}
      </svg>
    </div>
  );
}

function Title({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <text x="52" y="64" className="fill-slate-950 text-2xl font-black dark:fill-white">{title}</text>
      <text x="52" y="91" className="fill-slate-500 text-sm font-bold dark:fill-slate-300">{subtitle}</text>
    </>
  );
}

function ApSteps({ values, labels }: { values: Values; labels: boolean }) {
  const a = values.a ?? 2;
  const d = values.d ?? 3;
  const n = values.n ?? 8;
  const terms = Array.from({ length: n }, (_, index) => arithmeticTerm(a, d, index + 1));
  const min = Math.min(...terms);
  const max = Math.max(...terms);
  const span = Math.max(1, max - min);
  return (
    <>
      <line x1="82" y1="278" x2="790" y2="278" stroke="#94a3b8" strokeWidth="4" />
      {terms.map((term, index) => {
        const x = 100 + ((term - min) / span) * 650;
        return (
          <g key={index}>
            <circle cx={x} cy="278" r="13" fill="#06b6d4" />
            <text x={x} y="318" textAnchor="middle" className="fill-slate-700 text-xs font-black dark:fill-slate-200">{term}</text>
            {index > 0 && <text x={x - 30} y="250" className="fill-orange-600 text-xs font-black">+{d}</text>}
          </g>
        );
      })}
      {labels && <Info x={520} y={400} lines={[`a_${n} = ${arithmeticTerm(a, d, n)}`, `same jump d = ${d}`]} />}
    </>
  );
}

function TriangularDots({ n, labels, duplicate }: { n: number; labels: boolean; duplicate: boolean }) {
  const dots = [];
  const step = Math.min(22, 310 / Math.max(n, 1));
  for (let row = 1; row <= n; row += 1) {
    for (let col = 0; col < row; col += 1) dots.push({ x: 110 + col * step, y: 140 + row * step });
  }
  return (
    <>
      {dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r="6" fill="#06b6d4" />)}
      {duplicate && dots.map((dot, index) => <circle key={`dup-${index}`} cx={520 - (dot.x - 110)} cy={140 + (dot.y - 140)} r="6" fill="#f97316" opacity="0.75" />)}
      {labels && <Info x={520} y={390} lines={[`1 + 2 + ... + ${n} = ${naturalNumberSum(n)}`, `Two copies form ${n} x ${n + 1}`]} />}
    </>
  );
}

function SquareLayers({ n, labels }: { n: number; labels: boolean }) {
  const cell = Math.min(24, 320 / n);
  return (
    <>
      {Array.from({ length: n }).map((_, row) =>
        Array.from({ length: n }).map((__, col) => {
          const layer = Math.max(row, col);
          return <rect key={`${row}-${col}`} x={92 + col * cell} y={132 + row * cell} width={cell - 2} height={cell - 2} rx="4" fill={layer % 2 ? "#06b6d4" : "#8b5cf6"} />;
        }),
      )}
      {labels && <Info x={520} y={365} lines={[`Square: ${n}^2 = ${oddNumberSum(n)}`, `Last odd layer = ${2 * n - 1}`]} />}
    </>
  );
}

function ApSumBars({ values, labels, showPairs }: { values: Values; labels: boolean; showPairs: boolean }) {
  const a = values.a ?? 2;
  const d = values.d ?? 2;
  const n = values.n ?? 7;
  const terms = Array.from({ length: n }, (_, index) => arithmeticTerm(a, d, index + 1));
  const max = Math.max(...terms);
  return (
    <>
      {terms.map((term, index) => <rect key={index} x={90 + index * 44} y={410 - (term / max) * 240} width="30" height={(term / max) * 240} rx="5" fill="#06b6d4" />)}
      {showPairs && terms.map((term, index) => <rect key={`rev-${index}`} x={90 + index * 44} y={120} width="30" height={(terms[n - index - 1] / max) * 120} rx="5" fill="#f97316" opacity="0.72" />)}
      {labels && <Info x={535} y={350} lines={[`S_${n} = ${arithmeticSum(a, d, n)}`, `first + last = ${terms[0] + terms[terms.length - 1]}`]} />}
    </>
  );
}

function GpBars({ values, labels }: { values: Values; labels: boolean }) {
  const a = values.a ?? 2;
  const r = values.r ?? 1.5;
  const n = values.n ?? 7;
  const terms = Array.from({ length: n }, (_, index) => geometricTerm(a, r, index + 1));
  return <Bars terms={terms} labels={labels} info={[`a_${n} = ${formatNumber(geometricTerm(a, r, n))}`, `common ratio r = ${formatNumber(r)}`]} />;
}

function FiniteGpBars({ values, labels, showAlgebra }: { values: Values; labels: boolean; showAlgebra: boolean }) {
  const a = values.a ?? 3;
  const r = values.r ?? 0.6;
  const n = values.n ?? 6;
  const terms = Array.from({ length: n }, (_, index) => geometricTerm(a, r, index + 1));
  return (
    <>
      <Bars terms={terms} labels={false} info={[]} />
      {showAlgebra && <Info x={520} y={175} lines={["S = a + ar + ... + ar^(n-1)", "rS shifts the terms", "Subtract to cancel the middle"]} />}
      {labels && <Info x={520} y={390} lines={[`S_${n} = ${formatNumber(finiteGeometricSum(a, r, n))}`, `a=${a}, r=${formatNumber(r)}`]} />}
    </>
  );
}

function InfiniteGpModel({ values, labels }: { values: Values; labels: boolean }) {
  const a = values.a ?? 4;
  const r = values.r ?? 0.5;
  const n = values.n ?? 8;
  const sum = finiteGeometricSum(a, r, n);
  const limit = infiniteGeometricSum(a, r);
  let x = 90;
  return (
    <>
      {Array.from({ length: n }, (_, index) => {
        const width = Math.max(6, 460 * (geometricTerm(1, r, index + 1) / Math.max(1, a)));
        const rect = <rect key={index} x={x} y="190" width={width} height="150" rx="8" fill={index % 2 ? "#06b6d4" : "#8b5cf6"} opacity="0.82" />;
        x += width;
        return rect;
      })}
      <rect x="90" y="370" width="460" height="18" rx="9" fill="#e2e8f0" />
      <rect x="90" y="370" width={Math.min(460, (sum / limit) * 460)} height="18" rx="9" fill="#22c55e" />
      {labels && <Info x={585} y={260} lines={[`Partial sum = ${formatNumber(sum)}`, `Limit = ${formatNumber(limit)}`, "The gap shrinks"]} />}
    </>
  );
}

function Bars({ terms, labels, info }: { terms: number[]; labels: boolean; info: string[] }) {
  const max = Math.max(...terms, 1);
  return (
    <>
      {terms.map((term, index) => <rect key={index} x={85 + index * 56} y={410 - (term / max) * 260} width="38" height={(term / max) * 260} rx="7" fill={index % 2 ? "#06b6d4" : "#8b5cf6"} />)}
      {labels && <Info x={540} y={350} lines={info} />}
    </>
  );
}

function FibonacciTiles({ n, labels, spiral }: { n: number; labels: boolean; spiral: boolean }) {
  const fibs = fibonacciList(n);
  const scale = 210 / Math.max(...fibs);
  let x = 100;
  let y = 300;
  return (
    <>
      {fibs.map((size, index) => {
        const side = Math.max(12, size * scale);
        const rect = (
          <g key={index}>
            <rect x={x} y={y - side} width={side} height={side} fill={index % 2 ? "#06b6d4" : "#f97316"} opacity="0.78" stroke="#0f172a" />
            {spiral && <path d={`M ${x} ${y} Q ${x} ${y - side} ${x + side} ${y - side}`} fill="none" stroke="#0f172a" strokeWidth="3" />}
            {labels && <text x={x + side / 2} y={y - side / 2 + 4} textAnchor="middle" className="fill-white text-xs font-black">{size}</text>}
          </g>
        );
        x += index % 2 === 0 ? side : 0;
        y += index % 2 === 1 ? side : 0;
        return rect;
      })}
      {labels && <Info x={560} y={350} lines={[`F_${n} = ${fibonacci(n)}`, "Each new side uses previous two"]} />}
    </>
  );
}

function FibonacciSumModel({ n, labels }: { n: number; labels: boolean }) {
  const fibs = fibonacciList(n);
  return (
    <>
      {fibs.map((value, index) => <Badge key={index} x={95 + (index % 6) * 68} y={160 + Math.floor(index / 6) * 70} text={String(value)} fill="#06b6d4" />)}
      {labels && <Info x={530} y={330} lines={[`Sum = ${fibonacciSum(n)}`, `F_${n + 2} - 1 = ${fibonacci(n + 2)} - 1`]} />}
    </>
  );
}

function PascalModel({ n, k, labels }: { n: number; k: number; labels: boolean }) {
  const row = Math.round(n);
  const col = Math.min(Math.round(k), row);
  const rows = pascalTriangleRows(row + 1);
  return (
    <>
      {rows.map((values, r) => values.map((value, c) => <Badge key={`${r}-${c}`} x={450 + (c - r / 2) * 58} y={128 + r * 32} text={String(value)} fill={r === row && c === col ? "#f97316" : "#6366f1"} small />))}
      {labels && <Info x={535} y={430} lines={[`C(${row}, ${col}) = ${rows[row][col]}`, "Each entry sums two above"]} />}
    </>
  );
}

function InductionDominoes({ n, labels }: { n: number; labels: boolean }) {
  return (
    <>
      {Array.from({ length: n }, (_, index) => (
        <g key={index} transform={`rotate(${Math.min(index * 4, 45)} ${95 + index * 28} 285)`}>
          <rect x={86 + index * 28} y="205" width="18" height="100" rx="6" fill={index === 0 ? "#f97316" : "#06b6d4"} />
        </g>
      ))}
      {labels && <Info x={520} y={340} lines={["Base case starts the chain", "P(k) pushes P(k+1)", `Shown for ${n} dominoes`]} />}
    </>
  );
}

function HarmonicModel({ n, labels }: { n: number; labels: boolean }) {
  const shown = Math.min(n, 36);
  return (
    <>
      {Array.from({ length: shown }, (_, index) => {
        const value = 1 / (index + 1);
        return <rect key={index} x={80 + index * 18} y={410 - value * 240} width="13" height={value * 240} fill={Math.floor(Math.log2(index + 1)) % 2 ? "#06b6d4" : "#8b5cf6"} />;
      })}
      {labels && <Info x={545} y={300} lines={[`H_${n} = ${formatNumber(harmonicPartialSum(n))}`, "Power-of-2 groups keep adding", "Slow growth, no bound"]} />}
    </>
  );
}

function Badge({ x, y, text, fill, small = false }: { x: number; y: number; text: string; fill: string; small?: boolean }) {
  const width = small ? 42 : 52;
  const height = small ? 24 : 44;
  return (
    <g>
      <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx="10" fill={fill} />
      <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-xs font-black">{text}</text>
    </g>
  );
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return (
    <g>
      <rect x={x - 18} y={y - 34} width="320" height={Math.max(82, lines.length * 28 + 24)} rx="16" fill="#0f172a" opacity="0.92" />
      {lines.map((line, index) => <text key={line} x={x} y={y + index * 28} className="fill-white text-sm font-bold">{line}</text>)}
    </g>
  );
}

function titleForKind(kind: SequenceSeriesProofConfig["kind"]) {
  const titles: Record<SequenceSeriesProofConfig["kind"], string> = {
    apSteps: "Arithmetic Steps",
    naturalSum: "Natural Number Sum",
    oddSum: "Odd Layers",
    apSum: "AP Pairing",
    gpScaling: "Geometric Scaling",
    finiteGp: "Finite GP Sum",
    infiniteGp: "Convergence",
    triangular: "Triangular Numbers",
    squareLayers: "Square Layers",
    fibTiling: "Fibonacci Tiling",
    fibSpiral: "Fibonacci Spiral",
    fibSum: "Fibonacci Sum",
    pascal: "Pascal Triangle",
    induction: "Induction Dominoes",
    harmonic: "Harmonic Growth",
  };
  return titles[kind];
}

function buildSequenceFormulas(config: SequenceSeriesProofConfig, values: Values) {
  const n = values.n ?? 8;
  const a = values.a ?? 2;
  const d = values.d ?? 3;
  const r = values.r ?? 0.5;
  switch (config.kind) {
    case "apSteps":
      return [`a_${n} = ${arithmeticTerm(a, d, n)}`];
    case "naturalSum":
    case "triangular":
      return [`T_${n} = ${triangularNumber(n)}`];
    case "oddSum":
    case "squareLayers":
      return [`${n}^2 = ${oddNumberSum(n)}`];
    case "apSum":
      return [`S_${n} = ${arithmeticSum(a, d, n)}`];
    case "gpScaling":
      return [`a_${n} = ${formatNumber(geometricTerm(a, r, n))}`];
    case "finiteGp":
      return [`S_${n} = ${formatNumber(finiteGeometricSum(a, r, n))}`];
    case "infiniteGp":
      return [`S_infinity = ${formatNumber(infiniteGeometricSum(a, r))}`];
    case "fibSum":
      return [`F_1 + ... + F_${n} = ${fibonacciSum(n)}`];
    case "harmonic":
      return [`H_${n} = ${formatNumber(harmonicPartialSum(n))}`];
    default:
      return [];
  }
}
