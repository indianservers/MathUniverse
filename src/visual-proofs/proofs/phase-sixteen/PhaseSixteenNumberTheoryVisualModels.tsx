import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  digitSum,
  factorPairs,
  factorsOf,
  firstPrimes,
  formatFactorization,
  gcd,
  gcdSteps,
  generateFactorTree,
  isPrime,
  lcm,
  mod,
  primeFactorization,
  remainderCycle,
  type FactorTreeNode,
} from "../../utils/numberTheoryMath";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

const palette = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#6366f1", "#f59e0b"];

export function EvenOddNumberModel({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const n = Math.round(values.n);
  const k = Math.floor(n / 2);
  const leftover = n % 2;
  return (
    <Frame label="Even and odd as pairing patterns">
      <CounterGrid count={n} groupSize={2} x={70} y={132} highlightRemainder={activeHighlight === "leftover"} token={leftover ? "2k-plus-1" : "2k"} onHighlight={onHighlight} />
      {toggles.labels ? <Info x={560} y={150} lines={[`n = ${n}`, `k = floor(n/2) = ${k}`, `remainder = ${leftover}`, leftover ? `${n} = 2k + 1: odd` : `${n} = 2k: even`]} /> : null}
      <DraggableHandle label="Drag to change n" position={{ x: 72 + Math.min(n, 30) * 13, y: 430 }} axis="x" bounds={{ x: [90, 545] }} onChange={(point) => onValueChange("n", Math.round((point.x - 90) / 18) + 1)} />
    </Frame>
  );
}

export function DivisibilityGroupingModel({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const a = Math.round(values.a);
  const b = Math.round(values.b);
  const q = Math.floor(a / b);
  const r = a % b;
  return (
    <Frame label="Divisibility as equal grouping">
      <CounterGrid count={a} groupSize={b} x={62} y={124} highlightRemainder={activeHighlight === "remainder-0" || r > 0} token="a" />
      {toggles.labels ? <Info x={565} y={138} lines={[`a = ${a}`, `b = ${b}`, `q = ${q}`, `r = ${r}`, r === 0 ? "remainder 0: divisible" : "leftover counters: not divisible"]} /> : null}
      <DraggableHandle label="Drag total a" position={{ x: 96 + a * 3.2, y: 445 }} axis="x" bounds={{ x: [100, 500] }} onChange={(point) => onValueChange("a", Math.round((point.x - 96) / 3.2))} />
      <DraggableHandle label="Drag group size b" position={{ x: 96 + b * 18, y: 485 }} axis="x" bounds={{ x: [132, 456] }} onChange={(point) => onValueChange("b", Math.round((point.x - 96) / 18))} />
    </Frame>
  );
}

export function PrimeArrayModel({ values, toggles }: VisualState) {
  const n = Math.round(values.n);
  const pairs = factorPairs(n);
  const nontrivial = pairs.filter(([a, b]) => a > 1 && b > 1);
  const pair = nontrivial[0] ?? [1, n];
  return (
    <Frame label="Prime numbers as non-rectangular arrays">
      <DotRectangle rows={pair[0]} cols={pair[1]} count={n} x={82} y={128} active={!nontrivial.length} />
      {toggles.labels ? <Info x={555} y={140} lines={[`n = ${n}`, `divisors: ${factorsOf(n).join(", ")}`, nontrivial.length ? `nontrivial: ${nontrivial.map(([a, b]) => `${a} x ${b}`).join(", ")}` : "no other rectangle", isPrime(n) ? "prime: exactly two divisors" : "composite"]} /> : null}
    </Frame>
  );
}

export function CompositeArrayModel({ values, toggles }: VisualState) {
  const n = Math.round(values.n);
  const pairs = factorPairs(n).filter(([a, b]) => a > 1 && b > 1);
  const selected = Math.min(pairs.length - 1, Math.max(0, Math.round(values.pairIndex ?? 0)));
  const pair = pairs[selected] ?? [1, n];
  return (
    <Frame label="Composite numbers as rectangular arrays">
      <DotRectangle rows={pair[0]} cols={pair[1]} count={n} x={82} y={128} active={pairs.length > 0} />
      {toggles.labels ? <Info x={555} y={140} lines={[`n = ${n}`, `divisors: ${factorsOf(n).join(", ")}`, pairs.length ? `selected factor pair: ${pair[0]} x ${pair[1]}` : "no nontrivial pair", pairs.length ? "composite" : "prime case"]} /> : null}
    </Frame>
  );
}

export function FactorTreeModel({ values, toggles }: VisualState) {
  const n = Math.round(values.n);
  const tree = generateFactorTree(n);
  return (
    <Frame label="Fundamental theorem of arithmetic factor tree">
      <FactorNode node={tree} x={450} y={112} width={380} />
      {toggles.labels ? <Info x={545} y={405} lines={[`n = ${n}`, `prime leaves: ${primeLeaves(tree).join(" x ")}`, `canonical: ${formatFactorization(primeFactorization(n))}`, "unique up to order"]} /> : null}
    </Frame>
  );
}

export function EuclidPrimeListModel({ values, toggles }: VisualState) {
  const count = Math.round(values.primeCount);
  const primes = firstPrimes(count);
  const product = primes.reduce((acc, item) => acc * item, 1);
  const next = product + 1;
  return (
    <Frame label="Euclid infinitely many primes product plus one">
      <NumberStrip values={primes} x={72} y={135} fill={palette[0]} />
      <Text x={80} y={225} text={`P = ${primes.join(" x ")} = ${product}`} />
      <Text x={80} y={278} text={`N = P + 1 = ${next}`} token="+1" />
      {toggles.labels ? <Info x={545} y={142} lines={[`listed primes: ${primes.join(", ")}`, `P = ${product}`, `N = ${next}`, ...primes.map((p) => `${next} mod ${p} = ${next % p}`), "new prime factor required"]} /> : null}
    </Frame>
  );
}

export function EuclideanAlgorithmModel({ values, toggles }: VisualState) {
  const a = Math.round(values.a);
  const b = Math.round(values.b);
  const steps = gcdSteps(a, b);
  return (
    <Frame label="GCD by Euclidean algorithm">
      <Bar x={75} y={130} w={Math.max(a, b) * 4} label={`a = ${Math.max(a, b)}`} fill={palette[0]} />
      <Bar x={75} y={185} w={Math.min(a, b) * 4} label={`b = ${Math.min(a, b)}`} fill={palette[1]} />
      {steps.slice(0, 5).map((step, index) => <Text key={index} x={95} y={270 + index * 38} text={`${step.a} = ${step.b} x ${step.q} + ${step.r}`} small token={index === 0 ? "a-bq-r" : "gcd-b-r"} />)}
      {toggles.labels ? <Info x={560} y={145} lines={[`a = ${a}`, `b = ${b}`, `final gcd = ${gcd(a, b)}`, "replace (a,b) by (b,r)", "last nonzero divisor wins"]} /> : null}
    </Frame>
  );
}

export function MultipleAlignmentModel({ values, toggles }: VisualState) {
  const a = Math.round(values.a);
  const b = Math.round(values.b);
  const result = lcm(a, b);
  return (
    <Frame label="LCM by grid alignment">
      <MultipleTrack step={a} y={180} label={`multiples of ${a}`} fill={palette[0]} />
      <MultipleTrack step={b} y={270} label={`multiples of ${b}`} fill={palette[2]} />
      <line x1={80 + result * 8} y1="150" x2={80 + result * 8} y2="320" stroke="#fde68a" strokeWidth="5" />
      {toggles.labels ? <Info x={555} y={145} lines={[`a = ${a}`, `b = ${b}`, `first common = ${result}`, `gcd = ${gcd(a, b)}`, `a x b = ${a * b}`]} /> : null}
    </Frame>
  );
}

export function ModularClockModel({ values, toggles, onValueChange }: VisualState) {
  const a = Math.round(values.a);
  const m = Math.round(values.m);
  const remainder = mod(a, m);
  return (
    <Frame label="Modular arithmetic clock">
      <Clock m={m} residue={remainder} cx={285} cy={275} r={145} />
      {toggles.labels ? <Info x={555} y={150} lines={[`a = ${a}`, `m = ${m}`, `q = ${Math.floor(a / m)}`, `remainder = ${remainder}`, `${a} = ${m}q + ${remainder}`]} /> : null}
      <DraggableHandle label="Drag clock hand" position={clockPoint(285, 275, 145, remainder, m)} bounds={{ x: [130, 440], y: [120, 430] }} onChange={(point) => onValueChange("a", Math.round(angleResidue(point, 285, 275, m)))} />
    </Frame>
  );
}

export function RemainderCycleModel({ values, toggles }: VisualState) {
  const base = Math.round(values.base);
  const m = Math.round(values.m);
  const n = Math.round(values.n);
  const residues = remainderCycle(base, m, n);
  const cycleLength = detectCycle(residues);
  return (
    <Frame label="Remainder pattern cycles">
      <Clock m={m} residue={residues[n - 1] ?? 0} cx={250} cy={255} r={125} />
      <ResidueRow residues={residues} x={460} y={150} />
      {toggles.labels ? <Info x={535} y={330} lines={[`base = ${base}`, `modulus = ${m}`, `n = ${n}`, `current residue = ${residues[n - 1] ?? 0}`, `cycle length = ${cycleLength}`]} /> : null}
    </Frame>
  );
}

export function DigitSumModel({ values, toggles }: VisualState) {
  const number = Math.round(values.number);
  const divisor = Math.round(values.divisor) >= 6 ? 9 : 3;
  const digits = String(Math.abs(number)).split("").map(Number);
  const sum = digitSum(number);
  return (
    <Frame label="Divisibility by 3 and 9 using digit sum">
      <NumberStrip values={digits} x={88} y={145} fill={palette[3]} />
      <Text x={90} y={245} text={`${number} -> digit sum ${digits.join(" + ")} = ${sum}`} token="digit-sum" />
      <Text x={90} y={305} text={`10 == 1 mod ${divisor}, so place values collapse to digits`} token="ten-equiv-one" small />
      {toggles.labels ? <Info x={555} y={145} lines={[`number = ${number}`, `digits = ${digits.join(", ")}`, `digit sum = ${sum}`, `number mod ${divisor} = ${mod(number, divisor)}`, `digit sum mod ${divisor} = ${mod(sum, divisor)}`]} /> : null}
    </Frame>
  );
}

export function SqrtTwoContradictionModel({ toggles, activeStep }: VisualState) {
  const lines = ["Assume sqrt(2)=p/q", "Square: p^2 = 2q^2", "p^2 even -> p even", "Let p=2k, so q^2=2k^2", "q even too", "Contradiction: not lowest terms"];
  return (
    <Frame label="Irrationality of square root 2 contradiction">
      {toggles.labels ? <ParityTiles x={92} y={135} /> : null}
      {lines.map((line, index) => (
        <g key={line}>
          <rect x="410" y={95 + index * 62} width="350" height="42" rx="10" fill={index <= activeStep ? palette[index % palette.length] : "#334155"} opacity={index <= activeStep ? 0.95 : 0.35} />
          <text x="432" y={122 + index * 62} className="fill-white text-sm font-black">{line}</text>
        </g>
      ))}
      <Info x={92} y={385} lines={["lowest terms means no common factor 2", "proof forces p even and q even", "assumption must be false"]} />
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full">
        <rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />
        <text x="58" y="70" className="fill-white text-xl font-black">{label}</text>
        {children}
      </svg>
    </div>
  );
}

function CounterGrid({ count, groupSize, x, y, highlightRemainder, token, onHighlight }: { count: number; groupSize: number; x: number; y: number; highlightRemainder: boolean; token: string; onHighlight?: (token: string | null) => void }) {
  return <g onMouseEnter={() => onHighlight?.(token)} onMouseLeave={() => onHighlight?.(null)}>{Array.from({ length: count }, (_, index) => {
    const group = Math.floor(index / groupSize);
    const remainder = index >= Math.floor(count / groupSize) * groupSize;
    return <circle key={index} cx={x + (index % groupSize) * 26 + (group % 8) * (groupSize * 26 + 16)} cy={y + Math.floor(group / 8) * 58} r="10" fill={remainder ? (highlightRemainder ? "#fde68a" : palette[2]) : palette[group % palette.length]} />;
  })}</g>;
}

function DotRectangle({ rows, cols, count, x, y, active }: { rows: number; cols: number; count: number; x: number; y: number; active: boolean }) {
  const size = Math.min(26, Math.max(8, 330 / Math.max(rows, cols)));
  return <g>{Array.from({ length: Math.min(count, rows * cols) }, (_, index) => <circle key={index} cx={x + (index % cols) * size} cy={y + Math.floor(index / cols) * size} r={Math.max(3, size / 4)} fill={active ? "#fde68a" : palette[5]} />)}</g>;
}

function FactorNode({ node, x, y, width }: { node: FactorTreeNode; x: number; y: number; width: number }) {
  const prime = isPrime(node.value);
  return <g>{node.children ? node.children.map((child, index) => {
    const childX = x + (index === 0 ? -width / 2 : width / 2);
    return <g key={`${node.value}-${index}`}><line x1={x} y1={y + 24} x2={childX} y2={y + 78} stroke="#94a3b8" strokeWidth="3" /><FactorNode node={child} x={childX} y={y + 96} width={width / 2} /></g>;
  }) : null}<circle cx={x} cy={y} r="25" fill={prime ? palette[1] : palette[6]} /><text x={x} y={y + 5} textAnchor="middle" className="fill-white text-sm font-black">{node.value}</text></g>;
}

function NumberStrip({ values, x, y, fill }: { values: number[]; x: number; y: number; fill: string }) {
  return <g>{values.map((value, index) => <g key={`${value}-${index}`}><rect x={x + index * 66} y={y} width="48" height="42" rx="10" fill={fill} /><text x={x + index * 66 + 24} y={y + 27} textAnchor="middle" className="fill-white text-base font-black">{value}</text></g>)}</g>;
}

function MultipleTrack({ step, y, label, fill }: { step: number; y: number; label: string; fill: string }) {
  return <g><Text x={80} y={y - 35} text={label} small />{Array.from({ length: 11 }, (_, index) => index * step).map((value) => <g key={value}><line x1={80 + value * 8} y1={y - 12} x2={80 + value * 8} y2={y + 12} stroke={fill} strokeWidth="4" /><text x={80 + value * 8} y={y + 36} textAnchor="middle" className="fill-slate-200 text-xs font-bold">{value}</text></g>)}</g>;
}

function Clock({ m, residue, cx, cy, r }: { m: number; residue: number; cx: number; cy: number; r: number }) {
  return <g><circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#94a3b8" strokeWidth="4" />{Array.from({ length: m }, (_, index) => {
    const point = clockPoint(cx, cy, r, index, m);
    return <g key={index}><circle cx={point.x} cy={point.y} r={index === residue ? 13 : 7} fill={index === residue ? "#fde68a" : "#38bdf8"} /><text x={point.x} y={point.y - 16} textAnchor="middle" className="fill-white text-xs font-bold">{index}</text></g>;
  })}<line x1={cx} y1={cy} x2={clockPoint(cx, cy, r, residue, m).x} y2={clockPoint(cx, cy, r, residue, m).y} stroke="#fde68a" strokeWidth="5" /></g>;
}

function ResidueRow({ residues, x, y }: { residues: number[]; x: number; y: number }) {
  return <g>{residues.map((residue, index) => <g key={`${residue}-${index}`}><rect x={x + (index % 6) * 54} y={y + Math.floor(index / 6) * 52} width="40" height="34" rx="8" fill={palette[index % palette.length]} /><text x={x + (index % 6) * 54 + 20} y={y + Math.floor(index / 6) * 52 + 23} textAnchor="middle" className="fill-white text-sm font-black">{residue}</text></g>)}</g>;
}

function Bar({ x, y, w, label, fill }: { x: number; y: number; w: number; label: string; fill: string }) {
  return <g><rect x={x} y={y} width={Math.min(430, w)} height="34" rx="10" fill={fill} /><text x={x + 12} y={y + 23} className="fill-white text-sm font-black">{label}</text></g>;
}

function ParityTiles({ x, y }: { x: number; y: number }) {
  return <g>{Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_, col) => <rect key={`${row}-${col}`} x={x + col * 38} y={y + row * 38} width="30" height="30" rx="6" fill={(row + col) % 2 ? palette[0] : palette[2]} />))}</g>;
}

function Text({ x, y, text, small = false }: { x: number; y: number; text: string; small?: boolean; token?: string }) {
  return <text x={x} y={y} className={`fill-white ${small ? "text-sm" : "text-lg"} font-black`}>{text}</text>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 16} y={y - 28} width="292" height={Math.max(76, lines.length * 25 + 28)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={line} x={x} y={y + index * 24} className="fill-slate-100 text-sm font-bold">{line}</text>)}</g>;
}

function primeLeaves(node: FactorTreeNode): number[] {
  if (!node.children) return [node.value];
  return [...primeLeaves(node.children[0]), ...primeLeaves(node.children[1])].sort((a, b) => a - b);
}

function clockPoint(cx: number, cy: number, r: number, residue: number, m: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI * residue) / m;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function angleResidue(point: { x: number; y: number }, cx: number, cy: number, m: number) {
  const angle = Math.atan2(point.y - cy, point.x - cx) + Math.PI / 2;
  return mod(Math.round((angle / (2 * Math.PI)) * m), m);
}

function detectCycle(residues: number[]) {
  const first = residues[0];
  const next = residues.findIndex((value, index) => index > 0 && value === first);
  return next > 0 ? next : residues.length;
}
