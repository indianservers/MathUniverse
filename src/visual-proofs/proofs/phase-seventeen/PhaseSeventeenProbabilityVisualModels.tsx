import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

const colors = { a: "#0ea5e9", b: "#f97316", overlap: "#a855f7", ok: "#22c55e", warn: "#fde68a", muted: "#334155" };

export function FavorableTotalVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const total = Math.round(values.total);
  const favorable = Math.min(total, Math.round(values.favorable));
  return (
    <Frame label="Probability as favorable over total outcomes">
      <SampleSpaceGrid total={total} favorable={favorable} x={70} y={125} activeToken={activeHighlight} onHighlight={onHighlight} />
      {toggles.labels ? <Info x={575} y={135} lines={[`total outcomes = ${total}`, `favorable outcomes = ${favorable}`, `P(A) = ${favorable}/${total}`, `decimal = ${fmt(favorable / total)}`, `percent = ${Math.round((favorable / total) * 100)}%`]} /> : null}
      <DraggableHandle label="Drag favorable outcomes" position={{ x: 92 + favorable * 14, y: 455 }} axis="x" bounds={{ x: [95, 450] }} onChange={(point) => onValueChange("favorable", Math.round((point.x - 92) / 14))} />
    </Frame>
  );
}

export function ComplementRuleVisual({ values, toggles, activeHighlight, onHighlight }: VisualState) {
  const total = Math.round(values.total);
  const a = Math.min(total, Math.round(values.aCount));
  return (
    <Frame label="Complement rule sample space">
      <SampleSpaceGrid total={total} favorable={a} x={70} y={125} activeToken={activeHighlight} onHighlight={onHighlight} complement />
      {toggles.labels ? <Info x={575} y={135} lines={[`A count = ${a}`, `A^c count = ${total - a}`, `P(A) = ${fmt(a / total)}`, `P(A^c) = ${fmt(1 - a / total)}`, `sum = ${fmt(1)}`]} /> : null}
    </Frame>
  );
}

export function AdditionRuleVisual({ values, toggles }: VisualState) {
  const total = Math.round(values.total);
  const a = Math.round(values.aCount);
  const b = Math.round(values.bCount);
  const intersection = Math.min(a, b, Math.round(values.intersection));
  const union = Math.min(total, a + b - intersection);
  return (
    <Frame label="Addition rule overlapping events">
      <Venn a={a} b={b} intersection={intersection} />
      <Info x={555} y={135} lines={toggles.labels ? [`total = ${total}`, `A = ${a}`, `B = ${b}`, `A cap B = ${intersection}`, `A cup B = ${union}`, `P(A cup B) = ${fmt(union / total)}`] : []} />
    </Frame>
  );
}

export function IndependentProductVisual({ values, toggles, onValueChange }: VisualState) {
  const pA = values.pA;
  const pB = values.pB;
  return (
    <Frame label="Independent events product grid">
      <ProductGrid pA={pA} pB={pB} />
      {toggles.labels ? <Info x={575} y={150} lines={[`P(A) = ${fmt(pA)}`, `P(B) = ${fmt(pB)}`, `P(A and B) = ${fmt(pA * pB)}`, "independent: product rule"]} /> : null}
      <DraggableHandle label="Drag P(A)" position={{ x: 80 + pA * 360, y: 445 }} axis="x" bounds={{ x: [80, 440] }} onChange={(point) => onValueChange("pA", (point.x - 80) / 360)} />
      <DraggableHandle label="Drag P(B)" position={{ x: 470, y: 420 - pB * 260 }} axis="y" bounds={{ y: [160, 420] }} onChange={(point) => onValueChange("pB", (420 - point.y) / 260)} />
    </Frame>
  );
}

export function ConditionalProbabilityVisual({ values, toggles }: VisualState) {
  const total = Math.round(values.total);
  const b = Math.round(values.bCount);
  const ab = Math.min(b, Math.round(values.intersection));
  return (
    <Frame label="Conditional probability restricted sample space">
      <rect x="80" y="120" width="360" height="260" rx="18" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
      <rect x="105" y="155" width="250" height="180" rx="16" fill={colors.b} opacity="0.42" />
      <rect x="105" y="155" width={(250 * ab) / Math.max(1, b)} height="180" rx="16" fill={colors.overlap} opacity="0.86" />
      <Text x={118} y={190} text="B is the new sample space" small />
      <Text x={118} y={232} text="A cap B is favorable inside B" small />
      {toggles.labels ? <Info x={565} y={140} lines={[`total = ${total}`, `B count = ${b}`, `A cap B count = ${ab}`, `P(B) = ${fmt(b / total)}`, `P(A|B) = ${fmt(ab / b)}`]} /> : null}
    </Frame>
  );
}

export function ProbabilityTreeVisual({ values, toggles }: VisualState) {
  const pA = values.pA;
  const pBGivenA = values.pBGivenA;
  const pBGivenNotA = values.pBGivenNotA;
  const pAB = pA * pBGivenA;
  const pNotAB = (1 - pA) * pBGivenNotA;
  return (
    <Frame label="Tree diagrams for compound probability">
      <Tree pA={pA} pBGivenA={pBGivenA} pBGivenNotA={pBGivenNotA} />
      {toggles.labels ? <Info x={565} y={140} lines={[`P(A) = ${fmt(pA)}`, `P(B|A) = ${fmt(pBGivenA)}`, `path A then B = ${fmt(pAB)}`, `path not A then B = ${fmt(pNotAB)}`, `selected total = ${fmt(pAB + pNotAB)}`]} /> : null}
    </Frame>
  );
}

export function ExperimentalProbabilityVisual({ values, toggles }: VisualState) {
  const p = values.p;
  const trials = Math.round(values.trials);
  const successes = deterministicSuccesses(p, trials);
  const experimental = trials ? successes / trials : 0;
  return (
    <Frame label="Experimental probability law of large numbers">
      <FrequencyChart p={p} trials={trials} successes={successes} />
      {toggles.labels ? <Info x={575} y={145} lines={[`trials = ${trials}`, `successes = ${successes}`, `successes/trials = ${fmt(experimental)}`, `theoretical p = ${fmt(p)}`, `difference = ${fmt(Math.abs(experimental - p))}`]} /> : null}
    </Frame>
  );
}

export function ExpectedValueVisual({ values, toggles }: VisualState) {
  const outcomes = [values.x1, values.x2, values.x3];
  const p1 = values.p1;
  const p2 = values.p2;
  const probs = [p1, p2, Math.max(0, 1 - p1 - p2)];
  const contributions = outcomes.map((outcome, index) => outcome * probs[index]);
  const expected = contributions.reduce((sum, item) => sum + item, 0);
  return (
    <Frame label="Expected value as long-run average">
      <ContributionBars outcomes={outcomes} probs={probs} />
      {toggles.labels ? <Info x={575} y={140} lines={[`outcomes = ${outcomes.map((x) => fmt(x)).join(", ")}`, `probabilities = ${probs.map((p) => fmt(p)).join(", ")}`, `contributions = ${contributions.map((c) => fmt(c)).join(", ")}`, `E(X) = ${fmt(expected)}`, `probability sum = ${fmt(probs.reduce((s, p) => s + p, 0))}`]} /> : null}
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

function SampleSpaceGrid({ total, favorable, x, y, complement, activeToken, onHighlight }: { total: number; favorable: number; x: number; y: number; complement?: boolean; activeToken: string | null; onHighlight: (token: string | null) => void }) {
  const cols = Math.ceil(Math.sqrt(total));
  return <g onMouseEnter={() => onHighlight(complement ? "A-complement" : "favorable-outcomes")} onMouseLeave={() => onHighlight(null)}>{Array.from({ length: total }, (_, index) => {
    const selected = index < favorable;
    return <rect key={index} x={x + (index % cols) * 42} y={y + Math.floor(index / cols) * 42} width="34" height="34" rx="7" fill={selected ? (activeToken === "P-A" ? colors.warn : colors.a) : complement ? colors.ok : colors.muted} opacity={selected || complement ? 0.95 : 0.55} />;
  })}<rect x={x - 10} y={y - 10} width={cols * 42 + 12} height={Math.ceil(total / cols) * 42 + 12} rx="12" fill="none" stroke={activeToken === "total-outcomes" ? colors.warn : "#64748b"} strokeWidth="3" /></g>;
}

function Venn({ a, b, intersection }: { a: number; b: number; intersection: number }) {
  return <g><circle cx="235" cy="255" r="120" fill={colors.a} opacity="0.55" /><circle cx="350" cy="255" r="120" fill={colors.b} opacity="0.55" /><ellipse cx="292" cy="255" rx="55" ry="102" fill={colors.overlap} opacity="0.85" /><Text x={175} y={250} text={`A=${a}`} /><Text x={375} y={250} text={`B=${b}`} /><Text x={260} y={260} text={`${intersection}`} small /></g>;
}

function ProductGrid({ pA, pB }: { pA: number; pB: number }) {
  const x = 85, y = 140, w = 360, h = 260;
  return <g><rect x={x} y={y} width={w} height={h} rx="16" fill="#0f172a" stroke="#64748b" /><rect x={x} y={y + h * (1 - pB)} width={w * pA} height={h * pB} fill={colors.overlap} opacity="0.88" /><rect x={x} y={y} width={w * pA} height={h} fill={colors.a} opacity="0.22" /><rect x={x} y={y + h * (1 - pB)} width={w} height={h * pB} fill={colors.b} opacity="0.22" /><Text x={x + 16} y={y + 28} text="A width" small /><Text x={x + w * pA + 8} y={y + h - 14} text="P(A)P(B)" small /></g>;
}

function Tree({ pA, pBGivenA, pBGivenNotA }: { pA: number; pBGivenA: number; pBGivenNotA: number }) {
  return <g><circle cx="90" cy="260" r="12" fill={colors.warn} /><Branch x1={105} y1={260} x2={270} y2={170} label={`A ${fmt(pA)}`} /><Branch x1={105} y1={260} x2={270} y2={350} label={`not A ${fmt(1 - pA)}`} /><Branch x1={285} y1={170} x2={450} y2={120} label={`B ${fmt(pBGivenA)}`} /><Branch x1={285} y1={170} x2={450} y2={220} label={`not B ${fmt(1 - pBGivenA)}`} /><Branch x1={285} y1={350} x2={450} y2={305} label={`B ${fmt(pBGivenNotA)}`} /><Branch x1={285} y1={350} x2={450} y2={405} label={`not B ${fmt(1 - pBGivenNotA)}`} /></g>;
}

function Branch({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label: string }) {
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="4" /><circle cx={x2} cy={y2} r="10" fill={colors.ok} /><Text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} text={label} small /></g>;
}

function FrequencyChart({ p, trials, successes }: { p: number; trials: number; successes: number }) {
  const experimental = trials ? successes / trials : 0;
  return <g><rect x="80" y="140" width="390" height="260" rx="16" fill="#0f172a" stroke="#64748b" /><line x1="90" y1={390 - p * 220} x2="455" y2={390 - p * 220} stroke={colors.warn} strokeWidth="4" strokeDasharray="8 8" /><polyline points={`90,390 180,${390 - experimental * 150} 300,${390 - experimental * 195} 455,${390 - experimental * 220}`} fill="none" stroke={colors.a} strokeWidth="5" /><Text x={95} y={420} text={`successes/trials = ${successes}/${trials}`} small /><Text x={95} y={390 - p * 220 - 10} text="theoretical p" small /></g>;
}

function ContributionBars({ outcomes, probs }: { outcomes: number[]; probs: number[] }) {
  return <g>{outcomes.map((outcome, index) => {
    const contribution = outcome * probs[index];
    return <g key={index}><rect x={90 + index * 130} y={360 - contribution * 30} width="80" height={Math.max(8, contribution * 30)} rx="10" fill={[colors.a, colors.b, colors.ok][index]} /><Text x={90 + index * 130} y="395" text={`x=${fmt(outcome)}`} small /><Text x={90 + index * 130} y="420" text={`p=${fmt(probs[index])}`} small /><Text x={90 + index * 130} y={345 - contribution * 30} text={`xp=${fmt(contribution)}`} small /></g>;
  })}</g>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  if (!lines.length) return null;
  return <g><rect x={x - 16} y={y - 28} width="292" height={Math.max(76, lines.length * 25 + 28)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={line} x={x} y={y + index * 24} className="fill-slate-100 text-sm font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text, small = false }: { x: number; y: number | string; text: string; small?: boolean }) {
  return <text x={x} y={y} className={`fill-white ${small ? "text-sm" : "text-base"} font-black`}>{text}</text>;
}

function deterministicSuccesses(p: number, trials: number) {
  let successes = 0;
  for (let index = 1; index <= trials; index += 1) {
    const value = ((index * 37 + 17) % 100) / 100;
    if (value < p) successes += 1;
  }
  return successes;
}

function fmt(value: number) {
  return Number.isFinite(value) ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : "0";
}
