import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import VisualLearningPanel from "../components/ui/VisualLearningPanel";
import { getNCERTConcept, ncertConcepts, type NCERTConcept, type NCERTVisualType } from "../data/ncertConcepts";
import { degreesToRadians, roundTo } from "../utils/math";

export default function NCERTConceptPage() {
  const { conceptId } = useParams();
  const concept = getNCERTConcept(conceptId);
  if (!concept) return <Navigate to="/syllabus" replace />;
  return <NCERTConceptDetail concept={concept} />;
}

function NCERTConceptDetail({ concept }: { concept: NCERTConcept }) {
  const [a, setA] = useState(concept.defaultA);
  const [b, setB] = useState(concept.defaultB);
  const [c, setC] = useState(concept.defaultC ?? 1);

  useEffect(() => {
    setA(concept.defaultA);
    setB(concept.defaultB);
    setC(concept.defaultC ?? 1);
  }, [concept]);

  const metrics = useMemo(() => ncertMetrics(concept.visual, a, b, c), [concept.visual, a, b, c]);
  const related = ncertConcepts.filter((item) => item.classLevel === concept.classLevel && item.id !== concept.id).slice(0, 4);

  return (
    <div className="space-y-6">
      <Link to="/syllabus" className="action-secondary w-fit"><ArrowLeft className="h-4 w-4" />Syllabus</Link>
      <TopicHeader title={`${concept.classLevel}: ${concept.title}`} subtitle={concept.summary} difficulty={concept.unit} estimatedMinutes={15} />

      <SectionCard title="Interactive NCERT Lab" description="Move the controls, watch the model change, then read the formula and step-by-step values.">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <FormulaBlock title="Core NCERT Formula" formula={concept.formula} explanation={concept.summary} />
            <SliderControl label={concept.sliderA} value={a} min={concept.minA} max={concept.maxA} step={concept.stepA} onChange={setA} />
            <SliderControl label={concept.sliderB} value={b} min={concept.minB} max={concept.maxB} step={concept.stepB} onChange={setB} />
            {concept.sliderC && concept.minC !== undefined && concept.maxC !== undefined && concept.stepC !== undefined && (
              <SliderControl label={concept.sliderC} value={c} min={concept.minC} max={concept.maxC} step={concept.stepC} onChange={setC} />
            )}
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
              <NCERTSvg visual={concept.visual} a={a} b={b} c={c} title={concept.title} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {concept.outcomes.map((item) => <Info key={item} label="Outcome" value={item} />)}
            </div>
          </div>
        </div>
      </SectionCard>

      <VisualLearningPanel concept={concept.summary} formula={concept.formula} changes={changeText(concept.visual, concept.sliderA, concept.sliderB)} realWorldUse={concept.unit} steps={learningSteps(concept, a, b, c)} tasks={concept.tasks} />

      {related.length > 0 && (
        <SectionCard title={`More ${concept.classLevel} NCERT Labs`}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <Link key={item.id} to={`/ncert/${item.id}`} className="rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{item.unit}</p>
                <p className="mt-2 font-bold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
              </Link>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function NCERTSvg({ visual, a, b, c, title }: { visual: NCERTVisualType; a: number; b: number; c: number; title: string }) {
  return (
    <svg viewBox="0 0 760 460" className="h-[320px] w-full sm:h-[460px]">
      <title>{title}</title>
      <rect width="760" height="460" rx="24" fill="#f8fafc" />
      <Grid />
      {renderVisual(visual, a, b, c)}
    </svg>
  );
}

function renderVisual(visual: NCERTVisualType, a: number, b: number, c: number) {
  if (visual === "integer-line") return <IntegerLine start={a} move={b} />;
  if (visual === "fraction-decimal") return <FractionDecimal numerator={Math.min(a, b)} denominator={Math.max(1, b)} />;
  if (visual === "comparing-quantities") return <ComparingQuantities base={a} percent={b} time={c} />;
  if (visual === "rational-line") return <RationalLine p={a} q={Math.max(1, b)} />;
  if (visual === "exponents") return <ExponentBlocks base={a} m={b} n={c} />;
  if (visual === "roots") return <RootVisual n={a} type={Math.round(b)} />;
  if (visual === "number-system") return <NumberSystem selector={a} root={b} />;
  if (visual === "euclid-geometry") return <EuclidGeometry card={Math.round(a)} step={Math.round(b)} />;
  if (visual === "heron") return <HeronVisual a={a} b={b} c={c} />;
  if (visual === "euclid-algorithm") return <EuclidAlgorithm a={Math.round(a)} b={Math.round(b)} />;
  if (visual === "ap") return <APVisual first={a} diff={b} n={Math.round(c)} />;
  if (visual === "section-formula") return <SectionFormula m={a} n={b} />;
  return <HeightDistance angle={a} distance={b} />;
}

function IntegerLine({ start, move }: { start: number; move: number }) {
  const end = start + move;
  return <g><NumberLine min={-20} max={20} y={240} /><Arrow x1={mapLine(start, -20, 20)} x2={mapLine(end, -20, 20)} y={180} color={move >= 0 ? "#06b6d4" : "#f59e0b"} /><Point x={mapLine(start, -20, 20)} y={240} label="start" /><Point x={mapLine(end, -20, 20)} y={240} label="end" /><Label x="80" y="90" text={`${start} + (${move}) = ${end}`} /></g>;
}

function FractionDecimal({ numerator, denominator }: { numerator: number; denominator: number }) {
  const value = numerator / denominator;
  return <g><Label x="80" y="80" text={`${numerator}/${denominator} = ${roundTo(value, 4)}`} />{Array.from({ length: denominator }).map((_, i) => <rect key={i} x={90 + i * (560 / denominator)} y="150" width={540 / denominator} height="95" fill={i < numerator ? "#06b6d4" : "#e2e8f0"} opacity="0.75" stroke="#0f172a" />)}<NumberLine min={0} max={1} y={335} /><Point x={mapLine(value, 0, 1)} y={335} label="decimal" /></g>;
}

function ComparingQuantities({ base, percent, time }: { base: number; percent: number; time: number }) {
  const simple = base + (base * percent * time) / 100;
  const compound = base * Math.pow(1 + percent / 100, time);
  return <g><Label x="70" y="80" text={`Base ${base}, rate ${percent}%, time ${time}`} /><Bar x={100} y={150} w={base / 5} label="original" color="#94a3b8" /><Bar x={100} y={235} w={Math.max(10, simple / 5)} label="simple" color="#06b6d4" /><Bar x={100} y={320} w={Math.max(10, compound / 5)} label="compound" color="#f59e0b" /></g>;
}

function RationalLine({ p, q }: { p: number; q: number }) {
  const value = p / q;
  return <g><NumberLine min={-4} max={4} y={240} /><Point x={mapLine(value, -4, 4)} y={240} label={`${p}/${q}`} /><Label x="80" y="110" text={`${p}/${q} = ${roundTo(value, 4)}`} /></g>;
}

function ExponentBlocks({ base, m, n }: { base: number; m: number; n: number }) {
  const valueM = Math.pow(base, m);
  const combined = Math.pow(base, m + n);
  return <g><Label x="70" y="80" text={`${base}^${m} x ${base}^${n} = ${base}^${m + n}`} /><Bar x={90} y={155} w={Math.min(570, Math.abs(valueM))} label={`${base}^${m}`} color="#06b6d4" /><Bar x={90} y={255} w={Math.min(570, Math.abs(combined) / Math.max(1, base))} label={`${base}^${m + n}`} color="#8b5cf6" /><Label x="90" y="365" text={`Exponent law adds powers when bases match.`} /></g>;
}

function RootVisual({ n, type }: { n: number; type: number }) {
  const value = type === 3 ? n ** 3 : n ** 2;
  const cells = Math.min(type === 3 ? n * n : n * n, 144);
  return <g><Label x="80" y="75" text={type === 3 ? `${n}^3 = ${value}, cube root = ${n}` : `${n}^2 = ${value}, square root = ${n}`} />{Array.from({ length: cells }).map((_, i) => <rect key={i} x={95 + (i % 12) * 36} y={130 + Math.floor(i / 12) * 28} width="25" height="20" fill={type === 3 ? "#8b5cf6" : "#06b6d4"} opacity="0.62" stroke="#0f172a" />)}<Label x="80" y="405" text={type === 3 ? "Cube root asks: what side makes this cube?" : "Square root asks: what side makes this square?"} /></g>;
}

function NumberSystem({ selector, root }: { selector: number; root: number }) {
  const labels = ["Natural", "Whole", "Integer", "Rational", "Irrational", "Real"];
  return <g>{labels.map((label, i) => <rect key={label} x={90 + i * 95} y={150 - i * 10} width={150 + i * 12} height={190 + i * 15} rx="20" fill="none" stroke={Math.round(selector) - 1 === i ? "#f59e0b" : "#06b6d4"} strokeWidth={Math.round(selector) - 1 === i ? 6 : 3} opacity="0.9" />)}{labels.map((label, i) => <Label key={label} x={110 + i * 95} y={180 - i * 10} text={label} />)}<Label x="90" y="410" text={`sqrt(${root}) approx ${roundTo(Math.sqrt(root), 4)} ${isPerfectSquare(root) ? "is rational" : "is usually irrational"}`} /></g>;
}

function EuclidGeometry({ card, step }: { card: number; step: number }) {
  const cards = ["A point marks position.", "A line extends without thickness.", "Through two points one line can be drawn.", "Things equal to the same thing are equal.", "The whole is greater than the part."];
  return <g><rect x="100" y="95" width="560" height="110" rx="24" fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="4" /><Label x="130" y="155" text={cards[(card - 1) % cards.length]} /><line x1="140" y1="300" x2="620" y2="300" stroke="#0f172a" strokeWidth="4" /><Point x={180 + step * 90} y={300} label={`step ${step}`} /><Label x="120" y="380" text="Proof flow: undefined terms -> axioms -> postulates -> theorem." /></g>;
}

function HeronVisual({ a, b, c }: { a: number; b: number; c: number }) {
  const valid = a + b > c && a + c > b && b + c > a;
  const s = (a + b + c) / 2;
  const area = valid ? Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c))) : 0;
  const ax = 150, ay = 330, bx = 520, by = 330;
  const scale = 22;
  const cx = ax + ((a * a + c * c - b * b) / (2 * c)) * scale;
  const h = valid ? Math.sqrt(Math.max(0, a * a - Math.pow((a * a + c * c - b * b) / (2 * c), 2))) * scale : 0;
  const cy = ay - h;
  return <g><polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill={valid ? "#06b6d4" : "#ef4444"} opacity="0.18" stroke={valid ? "#06b6d4" : "#ef4444"} strokeWidth="5" /><Label x="90" y="80" text={valid ? `s=${roundTo(s, 2)}, area=${roundTo(area, 2)}` : "Invalid triangle: check side sums"} /><Label x="260" y="360" text={`c=${roundTo(c, 1)}`} /><Label x="145" y="220" text={`a=${roundTo(a, 1)}`} /><Label x="510" y="220" text={`b=${roundTo(b, 1)}`} /></g>;
}

function EuclidAlgorithm({ a, b }: { a: number; b: number }) {
  const steps = euclidSteps(a, b);
  return <g><Label x="80" y="75" text={`Euclid algorithm for ${a} and ${b}`} />{steps.slice(0, 6).map((step, i) => <g key={i}><rect x="95" y={115 + i * 48} width={560 - i * 34} height="32" rx="10" fill={i % 2 ? "#8b5cf6" : "#06b6d4"} opacity="0.22" stroke="#0f172a" /><Label x="110" y={138 + i * 48} text={step} /></g>)}<Label x="80" y="420" text={`HCF = ${gcd(a, b)}`} /></g>;
}

function APVisual({ first, diff, n }: { first: number; diff: number; n: number }) {
  const terms = Array.from({ length: n }, (_, i) => first + i * diff);
  const sum = terms.reduce((total, value) => total + value, 0);
  return <g><Label x="80" y="70" text={`AP: ${terms.slice(0, 6).map((x) => roundTo(x, 1)).join(", ")}${terms.length > 6 ? "..." : ""}`} />{terms.map((term, i) => <rect key={i} x={70 + i * 40} y={330 - Math.max(8, Math.abs(term) * 8)} width="26" height={Math.max(8, Math.abs(term) * 8)} fill={term >= 0 ? "#06b6d4" : "#f59e0b"} opacity="0.72" />)}<Label x="80" y="410" text={`a_n=${roundTo(terms.at(-1) ?? 0, 2)}, S_n=${roundTo(sum, 2)}`} /></g>;
}

function SectionFormula({ m, n }: { m: number; n: number }) {
  const ax = 140, ay = 330, bx = 610, by = 120;
  const px = (m * bx + n * ax) / (m + n);
  const py = (m * by + n * ay) / (m + n);
  return <g><line x1={ax} y1={ay} x2={bx} y2={by} stroke="#06b6d4" strokeWidth="5" /><Point x={ax} y={ay} label="A" /><Point x={bx} y={by} label="B" /><Point x={px} y={py} label="P" /><Label x="80" y="80" text={`P divides AB in ratio ${m}:${n}`} /><Label x="80" y="410" text={`P approx (${roundTo(px, 1)}, ${roundTo(py, 1)}) in screen coordinates`} /></g>;
}

function HeightDistance({ angle, distance }: { angle: number; distance: number }) {
  const rad = degreesToRadians(angle);
  const h = distance * Math.tan(rad);
  const x = 130, y = 345;
  return <g><polygon points={`${x},${y} ${x + distance * 2},${y} ${x + distance * 2},${Math.max(85, y - h * 2)}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="5" /><path d={`M${x + 50},${y} A50,50 0 0 0 ${x + 50 * Math.cos(rad)},${y - 50 * Math.sin(rad)}`} fill="none" stroke="#f59e0b" strokeWidth="5" /><Label x="90" y="80" text={`height = ${roundTo(h, 2)}`} /><Label x={x + distance} y={y + 30} text="distance" /><Label x={x + distance * 2 + 15} y={y - h} text="height" /></g>;
}

function NumberLine({ min, max, y }: { min: number; max: number; y: number }) {
  return <g><line x1="80" x2="680" y1={y} y2={y} stroke="#0f172a" strokeWidth="4" />{Array.from({ length: max - min + 1 }).map((_, i) => { const value = min + i; const x = mapLine(value, min, max); return <g key={value}><line x1={x} x2={x} y1={y - 9} y2={y + 9} stroke="#0f172a" /><text x={x - 8} y={y + 32} fill="#334155" fontSize="12" fontWeight="700">{value}</text></g>; })}</g>;
}

function Grid() {
  return <g opacity="0.45">{Array.from({ length: 15 }).map((_, i) => <line key={`v-${i}`} x1={40 + i * 48} y1="30" x2={40 + i * 48} y2="430" stroke="#e2e8f0" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1="30" y1={45 + i * 45} x2="730" y2={45 + i * 45} stroke="#e2e8f0" />)}</g>;
}

function Bar({ x, y, w, label, color }: { x: number; y: number; w: number; label: string; color: string }) {
  return <g><rect x={x} y={y} width={Math.min(560, Math.abs(w))} height="44" rx="14" fill={color} opacity="0.65" /><Label x={x} y={y - 12} text={label} /></g>;
}

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  return <g><line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="5" /><polygon points={`${x2},${y} ${x2 - Math.sign(x2 - x1) * 18},${y - 10} ${x2 - Math.sign(x2 - x1) * 18},${y + 10}`} fill={color} /></g>;
}

function Point({ x, y, label }: { x: number; y: number; label: string }) {
  return <g><circle cx={x} cy={y} r="9" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" /><Label x={x + 12} y={y - 12} text={label} /></g>;
}

function Label({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} fill="#0f172a" fontSize="16" fontWeight="800">{text}</text>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-sm leading-6">{value}</p></div>;
}

function mapLine(value: number, min: number, max: number) {
  return 80 + ((value - min) / (max - min || 1)) * 600;
}

function ncertMetrics(visual: NCERTVisualType, a: number, b: number, c: number) {
  if (visual === "heron") {
    const s = (a + b + c) / 2;
    const valid = a + b > c && a + c > b && b + c > a;
    const area = valid ? Math.sqrt(s * (s - a) * (s - b) * (s - c)) : 0;
    return [{ label: "valid", value: valid ? "yes" : "no" }, { label: "s", value: `${roundTo(s, 2)}` }, { label: "area", value: `${roundTo(area, 2)}` }];
  }
  if (visual === "euclid-algorithm") return [{ label: "HCF", value: `${gcd(Math.round(a), Math.round(b))}` }, { label: "LCM", value: `${Math.abs(Math.round(a * b)) / gcd(Math.round(a), Math.round(b))}` }];
  if (visual === "ap") return [{ label: "nth term", value: `${roundTo(a + (Math.round(c) - 1) * b, 2)}` }, { label: "sum", value: `${roundTo((Math.round(c) / 2) * (2 * a + (Math.round(c) - 1) * b), 2)}` }];
  if (visual === "height-distance") return [{ label: "height", value: `${roundTo(b * Math.tan(degreesToRadians(a)), 2)}` }, { label: "tan", value: `${roundTo(Math.tan(degreesToRadians(a)), 3)}` }];
  if (visual === "section-formula") return [{ label: "ratio", value: `${a}:${b}` }, { label: "fraction from A", value: `${roundTo(a / (a + b), 3)}` }];
  if (visual === "fraction-decimal" || visual === "rational-line") return [{ label: "value", value: `${roundTo(a / Math.max(1, b), 4)}` }, { label: "form", value: `${a}/${b}` }];
  if (visual === "exponents") return [{ label: "a^m", value: `${roundTo(Math.pow(a, b), 4)}` }, { label: "combined", value: `${roundTo(Math.pow(a, b + c), 4)}` }];
  return [{ label: "A", value: `${roundTo(a, 2)}` }, { label: "B", value: `${roundTo(b, 2)}` }];
}

function learningSteps(concept: NCERTConcept, a: number, b: number, c: number) {
  return [`Start with ${concept.formula}.`, `Set ${concept.sliderA}=${roundTo(a, 2)} and ${concept.sliderB}=${roundTo(b, 2)}${concept.sliderC ? `, ${concept.sliderC}=${roundTo(c, 2)}` : ""}.`, "Read the visual before calculating.", "Use the formula to verify the visual result."];
}

function changeText(visual: NCERTVisualType, sliderA: string, sliderB: string) {
  if (visual === "integer-line" || visual === "rational-line") return `${sliderA} and ${sliderB} move the point on the number line.`;
  if (visual === "heron") return "Changing any side can change triangle validity, semiperimeter, and area.";
  return `${sliderA} and ${sliderB} control the model and its calculation.`;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

function euclidSteps(a: number, b: number) {
  const steps: string[] = [];
  let x = Math.max(Math.abs(a), Math.abs(b));
  let y = Math.min(Math.abs(a), Math.abs(b));
  while (y && steps.length < 8) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push(`${x} = ${y} x ${q} + ${r}`);
    x = y;
    y = r;
  }
  return steps.length ? steps : ["Choose positive numbers"];
}

function isPerfectSquare(value: number) {
  const root = Math.sqrt(value);
  return Number.isInteger(root);
}
