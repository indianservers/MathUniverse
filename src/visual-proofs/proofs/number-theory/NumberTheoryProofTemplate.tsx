import { useEffect, useMemo, useState } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import {
  digitSum,
  divisibilityBy3,
  divisibilityBy9,
  factorPairs,
  firstPrimes,
  formatFactorization,
  gcd,
  gcdSteps,
  generateFactorTree,
  isEven,
  isPrime,
  lcm,
  mod,
  primeFactorization,
  remainderCycle,
  type FactorTreeNode,
} from "../../utils/numberTheoryMath";
import type { NumberTheoryParameterKey, NumberTheoryProofConfig } from "./numberTheoryProofConfigs";

type Values = Record<NumberTheoryParameterKey, number>;

export default function NumberTheoryProofTemplate({ category, proof, config }: { category: VisualProofCategory; proof: VisualProof; config: NumberTheoryProofConfig }) {
  const defaults = useMemo(() => {
    const next = {} as Values;
    Object.entries(config.parameters).forEach(([key, parameter]) => {
      next[key as NumberTheoryParameterKey] = parameter.defaultValue;
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

  const dynamicFormulas = buildNumberTheoryFormulas(config, values);

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<NumberTheoryVisual config={config} values={values} activeStep={activeStep} labelsVisible={labelsVisible} toggles={toggles} />}
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
                  value={values[key as NumberTheoryParameterKey] ?? parameter.defaultValue}
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
      formula={formulaVisible ? <FormulaPanel formulas={[...config.formulas, ...dynamicFormulas]} /> : <HiddenPanel title="Formula hidden" />}
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
        <span>{value}</span>
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

function NumberTheoryVisual({ config, values, activeStep, labelsVisible, toggles }: { config: NumberTheoryProofConfig; values: Values; activeStep: number; labelsVisible: boolean; toggles: Record<string, boolean> }) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={`${config.kind} number theory visual proof`} className="h-[540px] w-full max-w-full">
        <rect x="18" y="18" width="864" height="504" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        <Title title={titleForKind(config.kind)} subtitle={config.steps[activeStep]?.focusLabel ?? "visual proof"} />
        {config.kind === "evenOdd" && <PairingModel n={values.n ?? 17} labels={labelsVisible} showPairs={toggles["Show pair brackets"] ?? true} />}
        {config.kind === "divisibility" && <GroupingModel a={values.a ?? 42} b={values.b ?? 6} labels={labelsVisible} showRemainder={toggles["Show remainder"] ?? true} />}
        {config.kind === "primeArrays" && <ArrayTester n={values.n ?? 29} labels={labelsVisible} primeMode />}
        {config.kind === "compositeArrays" && <ArrayTester n={values.n ?? 36} labels={labelsVisible} />}
        {config.kind === "factorTree" && <FactorTreeModel n={values.n ?? 180} labels={labelsVisible} exponent={toggles["Show exponent form"] ?? true} />}
        {config.kind === "euclidPrimes" && <EuclidModel count={values.primeCount ?? 4} labels={labelsVisible} showChecks={toggles["Show remainder checks"] ?? true} />}
        {config.kind === "gcd" && <GcdModel a={values.a ?? 84} b={values.b ?? 30} labels={labelsVisible} showTable={toggles["Show division table"] ?? true} />}
        {config.kind === "lcm" && <LcmModel a={values.a ?? 6} b={values.b ?? 8} labels={labelsVisible} showFactors={toggles["Show prime factor method"] ?? true} />}
        {config.kind === "modClock" && <ClockModel n={values.n ?? 37} modulus={values.modulus ?? 12} labels={labelsVisible} />}
        {config.kind === "remainderCycle" && <RemainderCycleModel base={values.base ?? 2} modulus={values.modulus ?? 7} exponent={values.exponent ?? 8} labels={labelsVisible} showTable={toggles["Show table"] ?? true} />}
        {config.kind === "digitSum" && <DigitSumModel number={values.number ?? 5382} divisor={values.divisor ?? 9} labels={labelsVisible} showPlaceValues={toggles["Show place values"] ?? true} />}
        {config.kind === "sqrt2" && <Sqrt2Model labels={labelsVisible} showSquare={toggles["Show unit square diagonal"] ?? true} activeStep={activeStep} />}
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

function PairingModel({ n, labels, showPairs }: { n: number; labels: boolean; showPairs: boolean }) {
  const dots = Array.from({ length: n }).slice(0, 50);
  return (
    <>
      {dots.map((_, index) => {
        const x = 72 + (index % 10) * 74;
        const y = 140 + Math.floor(index / 10) * 64;
        return <circle key={index} cx={x} cy={y} r="14" fill={index === n - 1 && n % 2 === 1 ? "#f97316" : "#06b6d4"} />;
      })}
      {showPairs && dots.map((_, index) => (index % 2 === 0 && index + 1 < n ? <path key={`pair-${index}`} d={`M ${58 + (index % 10) * 74} ${166 + Math.floor(index / 10) * 64} Q ${95 + (index % 10) * 74} ${194 + Math.floor(index / 10) * 64} ${132 + (index % 10) * 74} ${166 + Math.floor(index / 10) * 64}`} fill="none" stroke="#0f172a" strokeWidth="3" /> : null))}
      {labels && <Info x={540} y={430} lines={[`${n} = 2 x ${Math.floor(n / 2)}${isEven(n) ? "" : " + 1"}`, isEven(n) ? "All dots are paired: even" : "One dot remains: odd"]} />}
    </>
  );
}

function GroupingModel({ a, b, labels, showRemainder }: { a: number; b: number; labels: boolean; showRemainder: boolean }) {
  const q = Math.floor(a / b);
  const r = a % b;
  const visible = Array.from({ length: Math.min(a, 120) });
  return (
    <>
      {visible.map((_, index) => {
        const group = Math.floor(index / b);
        const inRemainder = index >= q * b;
        const x = 58 + (index % b) * 26 + (group % 5) * (b * 26 + 18);
        const y = 138 + Math.floor(group / 5) * 58;
        return <circle key={index} cx={x} cy={y} r="9" fill={inRemainder ? "#f97316" : "#14b8a6"} opacity={showRemainder || !inRemainder ? 1 : 0.25} />;
      })}
      {labels && <Info x={530} y={370} lines={[`${a} = ${b} x ${q} + ${r}`, r === 0 ? `${b} divides ${a}` : `${b} does not divide ${a}`, `${q} full group${q === 1 ? "" : "s"}`]} />}
    </>
  );
}

function ArrayTester({ n, labels, primeMode = false }: { n: number; labels: boolean; primeMode?: boolean }) {
  const pairs = factorPairs(n);
  const nonTrivial = pairs.find(([rows, cols]) => rows > 1 && cols > 1);
  const pair = nonTrivial ?? pairs[pairs.length - 1] ?? [1, n];
  const [rows, cols] = pair;
  const size = Math.min(24, Math.max(8, 330 / Math.max(rows, cols)));
  const dots = Array.from({ length: Math.min(n, 160) });
  return (
    <>
      {dots.map((_, index) => <circle key={index} cx={92 + (index % cols) * size} cy={138 + Math.floor(index / cols) * size} r={Math.max(3, size / 4)} fill="#6366f1" />)}
      {labels && <Info x={520} y={156} lines={[`${n} is ${isPrime(n) ? "prime" : "composite"}`, nonTrivial ? `Rectangle: ${rows} x ${cols}` : "Only 1 x n works", primeMode ? "Prime test by arrays" : "Composite proof by rectangle"]} />}
    </>
  );
}

function FactorTreeModel({ n, labels, exponent }: { n: number; labels: boolean; exponent: boolean }) {
  const tree = generateFactorTree(n);
  return (
    <>
      <FactorNode node={tree} x={450} y={128} width={360} />
      {labels && <Info x={535} y={408} lines={[`${n} = ${formatFactorization(primeFactorization(n))}`, exponent ? "Prime factorization collected from leaves" : "Each leaf is prime"]} />}
    </>
  );
}

function FactorNode({ node, x, y, width }: { node: FactorTreeNode; x: number; y: number; width: number }) {
  const prime = isPrime(node.value);
  return (
    <>
      <circle cx={x} cy={y} r="24" fill={prime ? "#22c55e" : "#f59e0b"} />
      <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-sm font-black">{node.value}</text>
      {node.children?.map((child, index) => {
        const childX = x + (index === 0 ? -width / 4 : width / 4);
        const childY = y + 78;
        return (
          <g key={`${child.value}-${index}`}>
            <line x1={x} y1={y + 24} x2={childX} y2={childY - 24} stroke="#64748b" strokeWidth="3" />
            <FactorNode node={child} x={childX} y={childY} width={width / 1.7} />
          </g>
        );
      })}
    </>
  );
}

function EuclidModel({ count, labels, showChecks }: { count: number; labels: boolean; showChecks: boolean }) {
  const primes = firstPrimes(count);
  const product = primes.reduce((acc, prime) => acc * prime, 1);
  const n = product + 1;
  return (
    <>
      {primes.map((prime, index) => <Badge key={prime} x={92 + index * 72} y={150} text={String(prime)} fill="#06b6d4" />)}
      <text x="90" y="225" className="fill-slate-950 text-lg font-black dark:fill-white">N = {primes.join(" x ")} + 1 = {n}</text>
      {showChecks && primes.map((prime, index) => <text key={`check-${prime}`} x={95 + (index % 3) * 230} y={290 + Math.floor(index / 3) * 40} className="fill-slate-700 text-sm font-bold dark:fill-slate-200">{n} mod {prime} = {n % prime}</text>)}
      {labels && <Info x={540} y={405} lines={["Every listed prime leaves remainder 1", "So the finite list was incomplete"]} />}
    </>
  );
}

function GcdModel({ a, b, labels, showTable }: { a: number; b: number; labels: boolean; showTable: boolean }) {
  const steps = gcdSteps(a, b);
  const answer = gcd(a, b);
  return (
    <>
      <rect x="82" y="142" width={Math.min(620, Math.max(a, b) * 4)} height="42" fill="#38bdf8" rx="8" />
      <rect x="82" y="216" width={Math.min(620, Math.min(a, b) * 4)} height="42" fill="#f97316" rx="8" />
      {showTable && steps.slice(0, 6).map((step, index) => <text key={index} x="88" y={310 + index * 30} className="fill-slate-700 text-sm font-bold dark:fill-slate-200">{step.a} = {step.b} x {step.q} + {step.r}</text>)}
      {labels && <Info x={555} y={350} lines={[`gcd(${a}, ${b}) = ${answer}`, "Last non-zero remainder wins"]} />}
    </>
  );
}

function LcmModel({ a, b, labels, showFactors }: { a: number; b: number; labels: boolean; showFactors: boolean }) {
  const value = lcm(a, b);
  const max = Math.min(160, value + Math.max(a, b) * 2);
  return (
    <>
      <NumberLine y={180} step={a} max={max} color="#06b6d4" />
      <NumberLine y={280} step={b} max={max} color="#f97316" />
      <line x1={80 + value * 4} y1="145" x2={80 + value * 4} y2="325" stroke="#22c55e" strokeWidth="5" />
      {labels && <Info x={540} y={380} lines={[`LCM(${a}, ${b}) = ${value}`, `GCD = ${gcd(a, b)}`, showFactors ? `${value} x ${gcd(a, b)} = ${a * b}` : "First common mark"]} />}
    </>
  );
}

function NumberLine({ y, step, max, color }: { y: number; step: number; max: number; color: string }) {
  const marks = Array.from({ length: Math.floor(max / step) }, (_, index) => (index + 1) * step);
  return (
    <>
      <line x1="80" y1={y} x2="720" y2={y} stroke="#94a3b8" strokeWidth="3" />
      {marks.map((mark) => <circle key={mark} cx={80 + mark * 4} cy={y} r="7" fill={color} />)}
      <text x="80" y={y - 22} className="fill-slate-700 text-sm font-black dark:fill-slate-200">multiples of {step}</text>
    </>
  );
}

function ClockModel({ n, modulus, labels }: { n: number; modulus: number; labels: boolean }) {
  const radius = 145;
  const center = { x: 310, y: 290 };
  const result = mod(n, modulus);
  return (
    <>
      <circle cx={center.x} cy={center.y} r={radius} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      {Array.from({ length: modulus }, (_, index) => {
        const angle = (index / modulus) * Math.PI * 2 - Math.PI / 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        return (
          <g key={index}>
            <circle cx={x} cy={y} r={index === result ? 18 : 10} fill={index === result ? "#f97316" : "#06b6d4"} />
            <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-xs font-black">{index}</text>
          </g>
        );
      })}
      {labels && <Info x={560} y={230} lines={[`${n} mod ${modulus} = ${result}`, "The number wraps around the clock"]} />}
    </>
  );
}

function RemainderCycleModel({ base, modulus, exponent, labels, showTable }: { base: number; modulus: number; exponent: number; labels: boolean; showTable: boolean }) {
  const cycle = remainderCycle(base, modulus, exponent);
  return (
    <>
      <ClockModel n={cycle[cycle.length - 1] ?? 0} modulus={modulus} labels={false} />
      {showTable && cycle.map((value, index) => <text key={index} x={548 + (index % 3) * 95} y={150 + Math.floor(index / 3) * 31} className="fill-slate-700 text-sm font-bold dark:fill-slate-200">{base}^{index + 1} =&gt; {value}</text>)}
      {labels && <Info x={550} y={420} lines={[`First ${exponent} remainders`, cycle.join(", ")]} />}
    </>
  );
}

function DigitSumModel({ number, divisor, labels, showPlaceValues }: { number: number; divisor: number; labels: boolean; showPlaceValues: boolean }) {
  const digits = String(Math.floor(number)).split("").map(Number);
  const sum = digitSum(number);
  const activeDivisor = divisor < 6 ? 3 : 9;
  const divides = activeDivisor === 3 ? divisibilityBy3(number) : divisibilityBy9(number);
  return (
    <>
      {digits.map((digit, index) => <Badge key={index} x={100 + index * 86} y={170} text={String(digit)} fill="#8b5cf6" />)}
      {showPlaceValues && digits.map((digit, index) => <text key={`pv-${index}`} x={100 + index * 86} y="235" textAnchor="middle" className="fill-slate-600 text-xs font-bold dark:fill-slate-300">{digit} x 10^{digits.length - index - 1}</text>)}
      <text x="98" y="310" className="fill-slate-950 text-lg font-black dark:fill-white">Digit sum = {digits.join(" + ")} = {sum}</text>
      {labels && <Info x={545} y={330} lines={[`${number} mod ${activeDivisor} = ${number % activeDivisor}`, `${sum} mod ${activeDivisor} = ${sum % activeDivisor}`, divides ? "Divisible" : "Not divisible"]} />}
    </>
  );
}

function Sqrt2Model({ labels, showSquare, activeStep }: { labels: boolean; showSquare: boolean; activeStep: number }) {
  const lines = ["Assume sqrt(2)=p/q", "p^2=2q^2", "p is even", "q is even", "Contradiction"];
  return (
    <>
      {showSquare && (
        <>
          <rect x="100" y="180" width="180" height="180" fill="#dbeafe" stroke="#2563eb" strokeWidth="4" />
          <line x1="100" y1="360" x2="280" y2="180" stroke="#f97316" strokeWidth="5" />
          <text x="174" y="260" className="fill-orange-700 text-lg font-black">sqrt(2)</text>
          <text x="184" y="385" className="fill-slate-700 text-sm font-black dark:fill-slate-200">unit square</text>
        </>
      )}
      {lines.map((line, index) => (
        <g key={line}>
          <rect x="430" y={140 + index * 58} width="330" height="38" rx="10" fill={index <= activeStep ? "#06b6d4" : "#e2e8f0"} />
          <text x="448" y={164 + index * 58} className={index <= activeStep ? "fill-white text-sm font-black" : "fill-slate-700 text-sm font-black"}>{line}</text>
        </g>
      ))}
      {labels && <Info x={430} y={455} lines={["Lowest terms cannot have p and q both even", "So sqrt(2) is irrational"]} />}
    </>
  );
}

function Badge({ x, y, text, fill }: { x: number; y: number; text: string; fill: string }) {
  return (
    <g>
      <rect x={x - 25} y={y - 22} width="50" height="44" rx="12" fill={fill} />
      <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-sm font-black">{text}</text>
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

function titleForKind(kind: NumberTheoryProofConfig["kind"]) {
  const titles: Record<NumberTheoryProofConfig["kind"], string> = {
    evenOdd: "Pairing Pattern",
    divisibility: "Equal Grouping",
    primeArrays: "Prime Array Test",
    compositeArrays: "Composite Rectangles",
    factorTree: "Factor Tree",
    euclidPrimes: "Euclid's Prime Argument",
    gcd: "Euclidean Algorithm",
    lcm: "LCM Alignment",
    modClock: "Modulo Clock",
    remainderCycle: "Remainder Cycle",
    digitSum: "Digit Sum Test",
    sqrt2: "Contradiction Proof",
  };
  return titles[kind];
}

function buildNumberTheoryFormulas(config: NumberTheoryProofConfig, values: Values) {
  switch (config.kind) {
    case "evenOdd": {
      const n = values.n ?? 17;
      return [`${n} = 2 x ${Math.floor(n / 2)}${isEven(n) ? "" : " + 1"}`];
    }
    case "divisibility": {
      const a = values.a ?? 42;
      const b = values.b ?? 6;
      return [`${a} = ${b} x ${Math.floor(a / b)} + ${a % b}`];
    }
    case "gcd": {
      const a = values.a ?? 84;
      const b = values.b ?? 30;
      return [`gcd(${a}, ${b}) = ${gcd(a, b)}`];
    }
    case "lcm": {
      const a = values.a ?? 6;
      const b = values.b ?? 8;
      return [`LCM(${a}, ${b}) = ${lcm(a, b)}`];
    }
    case "modClock":
      return [`${values.n ?? 37} mod ${values.modulus ?? 12} = ${mod(values.n ?? 37, values.modulus ?? 12)}`];
    case "digitSum": {
      const n = values.number ?? 5382;
      return [`digit sum(${n}) = ${digitSum(n)}`];
    }
    default:
      return [];
  }
}
