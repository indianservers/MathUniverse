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
  if (visual === "permutation-tree") return <PermutationTree n={Math.round(a)} r={Math.round(b)} />;
  if (visual === "pascal-triangle") return <PascalTriangle n={Math.round(a)} x={b} />;
  if (visual === "conic-section") return <ConicSection type={Math.round(a)} param={b} />;
  if (visual === "feasible-region") return <FeasibleRegion c1={a} c2={b} />;
  if (visual === "balance-equation") return <BalanceEquation a={Math.round(a)} b={Math.round(b)} c={Math.round(c)} />;
  if (visual === "identity-tiles") return <IdentityTiles a={a} b={b} />;
  if (visual === "proportion-graph") return <ProportionGraph k={a} xVal={b} />;
  if (visual === "polynomial-graph") return <PolynomialGraph b={a} c2={b} />;
  if (visual === "quadratic-roots") return <QuadraticRoots qa={a} qb={b} qc={c} />;
  if (visual === "linear-pair") return <LinearPairGraph m1={a} c1={b} m2={c} />;
  if (visual === "linear-inequality") return <LinearInequality a={a} b={b} c3={c} />;
  if (visual === "inverse-trig-graph") return <InverseTrigGraph fn={Math.round(a)} xVal={b} />;
  return <HeightDistance angle={a} distance={b} />;
}

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function nPr(n: number, r: number) { return r > n ? 0 : factorial(n) / factorial(n - r); }
function nCr(n: number, r: number) { return r > n ? 0 : factorial(n) / (factorial(r) * factorial(n - r)); }

function PermutationTree({ n, r }: { n: number; r: number }) {
  const npr = nPr(n, r);
  const ncr = nCr(n, r);
  const items = Array.from({ length: Math.min(n, 6) }, (_, i) => String.fromCharCode(65 + i));
  const branches = items.slice(0, Math.min(r <= 1 ? n : 4, n));
  return (
    <g>
      <Label x="80" y="70" text={`n=${n}, r=${r}: nPr=${npr}, nCr=${ncr}`} />
      <circle cx="380" cy="120" r="18" fill="#06b6d4" />
      <Label x="372" y="126" text="S" />
      {branches.map((item, i) => {
        const x = 110 + i * (560 / Math.max(branches.length, 1));
        return (
          <g key={item}>
            <line x1="380" y1="138" x2={x} y2="205" stroke="#0f172a" strokeWidth="2" opacity="0.5" />
            <circle cx={x} cy="218" r="15" fill="#8b5cf6" />
            <Label x={x - 5} y="224" text={item} />
            {r >= 2 && items.filter((j) => j !== item).slice(0, 3).map((item2, j2) => {
              const x2 = x - 28 + j2 * 28;
              return (
                <g key={item2}>
                  <line x1={x} y1="233" x2={x2} y2="292" stroke="#0f172a" strokeWidth="1.5" opacity="0.4" />
                  <circle cx={x2} cy="302" r="11" fill="#f59e0b" />
                  <Label x={x2 - 4} y="307" text={item2} />
                </g>
              );
            })}
          </g>
        );
      })}
      <Label x="80" y="400" text={`Permutations arrange (order matters): nPr = ${npr}. Combinations select (order ignored): nCr = ${ncr}.`} />
    </g>
  );
}

function PascalTriangle({ n, x }: { n: number; x: number }) {
  const rows = Array.from({ length: n + 1 }, (_, row) =>
    Array.from({ length: row + 1 }, (_, k) => nCr(row, k))
  );
  const expansion = rows[n].reduce((sum, coeff, k) => sum + coeff * Math.pow(x, k), 0);
  const cellW = 44, startY = 55;
  return (
    <g>
      <Label x="80" y="40" text={`Pascal row ${n}: (1+${roundTo(x, 1)})^${n} = ${roundTo(expansion, 3)}`} />
      {rows.map((row, rowIdx) =>
        row.map((val, colIdx) => {
          const cx = 380 + (colIdx - row.length / 2 + 0.5) * cellW;
          const cy = startY + rowIdx * 44;
          return (
            <g key={`${rowIdx}-${colIdx}`}>
              <rect x={cx - 18} y={cy - 16} width="36" height="28" rx="8"
                fill={rowIdx === n ? "#06b6d4" : "#e0f2fe"} opacity="0.85" stroke="#94a3b8" />
              <text x={cx - (val > 9 ? 9 : 5)} y={cy + 6} fill="#0f172a" fontSize="13" fontWeight="800">{val}</text>
            </g>
          );
        })
      )}
      <Label x="80" y="430" text={`Row ${n} gives coefficients C(${n},0) to C(${n},${n}).`} />
    </g>
  );
}

function ConicSection({ type, param }: { type: number; param: number }) {
  const cx = 380, cy = 235;
  const types = ["Circle", "Ellipse", "Parabola", "Hyperbola"];
  const label = types[Math.max(0, Math.min(type - 1, 3))];
  const a = param * 90, b = param * 60;

  if (type === 1) {
    const r = param * 75;
    return (
      <g>
        <Label x="80" y="70" text={`Circle: x^2 + y^2 = r^2, r=${roundTo(param * 75, 1)}`} />
        <circle cx={cx} cy={cy} r={Math.min(r, 160)} fill="#06b6d4" opacity="0.12" stroke="#06b6d4" strokeWidth="4" />
        <circle cx={cx} cy={cy} r="6" fill="#f59e0b" />
        <Label x={cx + 8} y={cy} text="centre" />
        <line x1={cx} y1={cy} x2={cx + Math.min(r, 160)} y2={cy} stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 5" />
        <Label x={cx + Math.min(r, 160) / 2 - 10} y={cy - 10} text="r" />
        <Label x="80" y="410" text="Eccentricity e=0: all points equidistant from centre." />
      </g>
    );
  }
  if (type === 2) {
    const ra = Math.min(a, 180), rb = Math.min(b, 130);
    const c = Math.sqrt(Math.max(0, ra * ra - rb * rb));
    return (
      <g>
        <Label x="80" y="70" text={`Ellipse: x^2/${roundTo(ra, 0)}^2 + y^2/${roundTo(rb, 0)}^2 = 1, e=${roundTo(c / ra, 3)}`} />
        <ellipse cx={cx} cy={cy} rx={ra} ry={rb} fill="#06b6d4" opacity="0.12" stroke="#06b6d4" strokeWidth="4" />
        <circle cx={cx + c} cy={cy} r="7" fill="#f59e0b" />
        <circle cx={cx - c} cy={cy} r="7" fill="#f59e0b" />
        <Label x={cx + c + 10} y={cy} text="F1" />
        <Label x={cx - c - 28} y={cy} text="F2" />
        <Label x="80" y="410" text="Sum of distances from any point to both foci is constant." />
      </g>
    );
  }
  if (type === 3) {
    const p = param * 55;
    const pathD = Array.from({ length: 100 }, (_, i) => {
      const t = -5 + i * 0.1;
      const px2 = cx + t * 30;
      const py2 = cy - (t * t * 30) / (2 * p / 30);
      return `${i === 0 ? "M" : "L"}${px2},${py2}`;
    }).join(" ");
    return (
      <g>
        <Label x="80" y="70" text={`Parabola: y^2 = 4px, p=${roundTo(p, 1)}, e=1`} />
        <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="4" />
        <circle cx={cx} cy={cy} r="7" fill="#f59e0b" />
        <line x1={cx - 160} y1={cy} x2={cx + 160} y2={cy} stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 5" />
        <Label x={cx + 10} y={cy - 10} text="vertex" />
        <Label x="80" y="410" text="Eccentricity e=1: distance to focus equals distance to directrix." />
      </g>
    );
  }
  const ra2 = Math.min(a, 150), rb2 = Math.min(b, 110);
  const c2 = Math.sqrt(ra2 * ra2 + rb2 * rb2);
  const pts1 = Array.from({ length: 80 }, (_, i) => { const t = -2.8 + i * 0.07; return `${i === 0 ? "M" : "L"}${cx + ra2 * Math.cosh(t)},${cy + rb2 * Math.sinh(t)}`; }).join(" ");
  const pts2 = Array.from({ length: 80 }, (_, i) => { const t = -2.8 + i * 0.07; return `${i === 0 ? "M" : "L"}${cx - ra2 * Math.cosh(t)},${cy + rb2 * Math.sinh(t)}`; }).join(" ");
  return (
    <g>
      <Label x="80" y="70" text={`Hyperbola: x^2/${roundTo(ra2, 0)}^2 - y^2/${roundTo(rb2, 0)}^2 = 1, e=${roundTo(c2 / ra2, 3)}`} />
      <path d={pts1} fill="none" stroke="#06b6d4" strokeWidth="4" clipPath="url(#hclip)" />
      <path d={pts2} fill="none" stroke="#8b5cf6" strokeWidth="4" clipPath="url(#hclip)" />
      <defs><clipPath id="hclip"><rect x="80" y="80" width="600" height="310" /></clipPath></defs>
      <circle cx={cx + c2} cy={cy} r="7" fill="#f59e0b" />
      <circle cx={cx - c2} cy={cy} r="7" fill="#f59e0b" />
      <line x1={cx - 200} y1={cy - rb2 / ra2 * 200} x2={cx + 200} y2={cy + rb2 / ra2 * 200} stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 5" opacity="0.7" />
      <line x1={cx - 200} y1={cy + rb2 / ra2 * 200} x2={cx + 200} y2={cy - rb2 / ra2 * 200} stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 5" opacity="0.7" />
      <Label x="80" y="415" text={`e=${roundTo(c2 / ra2, 2)} > 1: two branches, asymptotes guide the curve.`} />
      <Label x="500" y="70" text={label} />
    </g>
  );
}

function FeasibleRegion({ c1, c2 }: { c1: number; c2: number }) {
  const corners = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 2, y: 3 },
    { x: 0, y: 5 },
  ];
  const gx = (v: number) => 100 + v * 110;
  const gy = (v: number) => 400 - v * 60;
  const zValues = corners.map((p) => ({ ...p, z: roundTo(c1 * p.x + c2 * p.y, 2) }));
  const maxZ = Math.max(...zValues.map((p) => p.z));
  const polyPts = corners.map((p) => `${gx(p.x)},${gy(p.y)}`).join(" ");
  return (
    <g>
      <Label x="80" y="55" text={`Maximize Z = ${roundTo(c1, 1)}x + ${roundTo(c2, 1)}y`} />
      <line x1="80" x2="680" y1={gy(0)} y2={gy(0)} stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(0)} y1="50" x2={gx(0)} y2="430" stroke="#0f172a" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <g key={v}>
          <text x={gx(v) - 5} y={gy(0) + 20} fill="#334155" fontSize="13" fontWeight="700">{v}</text>
          <text x={gx(0) - 22} y={gy(v) + 5} fill="#334155" fontSize="13" fontWeight="700">{v}</text>
        </g>
      ))}
      <polygon points={polyPts} fill="#06b6d4" opacity="0.22" stroke="#06b6d4" strokeWidth="3" />
      {zValues.map((p) => (
        <g key={`${p.x}-${p.y}`}>
          <circle cx={gx(p.x)} cy={gy(p.y)} r={p.z === maxZ ? 11 : 7} fill={p.z === maxZ ? "#f59e0b" : "#8b5cf6"} stroke="#0f172a" strokeWidth="2" />
          <text x={gx(p.x) + 14} y={gy(p.y) - 5} fill="#0f172a" fontSize="12" fontWeight="800">Z={p.z}</text>
        </g>
      ))}
      <Label x="80" y="430" text={`Max Z = ${maxZ} at corner (${zValues.find((p) => p.z === maxZ)?.x}, ${zValues.find((p) => p.z === maxZ)?.y})`} />
    </g>
  );
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
  if (visual === "permutation-tree") { const n = Math.round(a), r = Math.round(b); return [{ label: "nPr", value: `${nPr(n, r)}` }, { label: "nCr", value: `${nCr(n, r)}` }, { label: "n!", value: `${factorial(n)}` }]; }
  if (visual === "pascal-triangle") { const row = Math.round(a); return [{ label: "row sum", value: `${Math.pow(2, row)}` }, { label: "C(n,0)", value: "1" }, { label: "expansion", value: `${roundTo(Math.pow(1 + b, row), 3)}` }]; }
  if (visual === "conic-section") { const type = Math.round(a); const labels = ["circle", "ellipse", "parabola", "hyperbola"]; return [{ label: "type", value: labels[Math.max(0, type - 1)] }, { label: "param", value: `${roundTo(b, 2)}` }]; }
  if (visual === "feasible-region") { const corners = [{x:0,y:0},{x:4,y:0},{x:2,y:3},{x:0,y:5}]; const zv = corners.map((p) => a * p.x + b * p.y); return [{ label: "max Z", value: `${roundTo(Math.max(...zv), 2)}` }, { label: "min Z", value: `${roundTo(Math.min(...zv), 2)}` }]; }
  if (visual === "balance-equation") { const x = (c - Math.round(b)) / Math.max(1, Math.round(a)); return [{ label: "solution x", value: `${roundTo(x, 3)}` }, { label: "check LHS", value: `${roundTo(Math.round(a) * x + Math.round(b), 2)}` }, { label: "RHS", value: `${Math.round(c)}` }]; }
  if (visual === "identity-tiles") { return [{ label: "a²", value: `${roundTo(a * a, 2)}` }, { label: "2ab", value: `${roundTo(2 * a * b, 2)}` }, { label: "(a+b)²", value: `${roundTo((a + b) * (a + b), 2)}` }]; }
  if (visual === "proportion-graph") { return [{ label: "y direct", value: `${roundTo(a * b, 3)}` }, { label: "y inverse", value: `${roundTo(a / Math.max(0.01, b), 3)}` }, { label: "k", value: `${roundTo(a, 2)}` }]; }
  if (visual === "polynomial-graph") { const D = a * a - 4 * b; return [{ label: "D = b²-4c", value: `${roundTo(D, 2)}` }, { label: "roots", value: D > 0 ? "2 real" : D === 0 ? "1 repeated" : "complex" }, { label: "sum of roots", value: `${roundTo(-a, 2)}` }]; }
  if (visual === "quadratic-roots") { const D = b * b - 4 * a * c; return [{ label: "D = b²-4ac", value: `${roundTo(D, 2)}` }, { label: "roots", value: D > 0 ? "2 real" : D === 0 ? "1 repeated" : "complex" }, { label: "vertex x", value: `${roundTo(a !== 0 ? -b / (2 * a) : 0, 2)}` }]; }
  if (visual === "linear-pair") { const denom = a - c; const intX = Math.abs(denom) < 0.05 ? null : (1 - b) / denom; const intY = intX !== null ? a * intX + b : null; return [{ label: "intersection x", value: intX !== null ? `${roundTo(intX, 2)}` : "none" }, { label: "intersection y", value: intY !== null ? `${roundTo(intY, 2)}` : "none" }, { label: "type", value: Math.abs(denom) < 0.05 ? "parallel" : "unique" }]; }
  if (visual === "linear-inequality") { const x = (c - b) / (a === 0 ? 0.001 : a); return [{ label: "critical x", value: `${roundTo(x, 3)}` }, { label: "sign flip", value: a < 0 ? "yes (a<0)" : "no" }, { label: "solution", value: a > 0 ? `x > ${roundTo(x, 2)}` : `x < ${roundTo(x, 2)}` }]; }
  if (visual === "inverse-trig-graph") { const fnNames = ["sin⁻¹", "cos⁻¹", "tan⁻¹"]; const fn = Math.round(a); const angle = fn === 1 ? Math.asin(b) : fn === 2 ? Math.acos(b) : Math.atan(b); return [{ label: fnNames[fn - 1] ?? "fn", value: `${roundTo(angle, 4)} rad` }, { label: "degrees", value: `${roundTo(angle * 180 / Math.PI, 2)}°` }, { label: "domain", value: fn === 3 ? "all real" : "[-1, 1]" }]; }
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

function BalanceEquation({ a, b, c }: { a: number; b: number; c: number }) {
  const x = a === 0 ? 0 : (c - b) / a;
  const lhs = a * x + b;
  const balanced = Math.abs(lhs - c) < 0.01;
  const tilt = balanced ? 0 : Math.max(-20, Math.min(20, (lhs - c) * 5));
  const px = 380, py = 295;
  const beamLen = 200;
  const rad = (tilt * Math.PI) / 180;
  const lx = px - beamLen * Math.cos(rad), ly = py - beamLen * Math.sin(rad);
  const rx = px + beamLen * Math.cos(rad), ry = py + beamLen * Math.sin(rad);
  const panDepth = 30;
  return (
    <g>
      <Label x="80" y="65" text={`${a}x + ${b} = ${c}   solve for x`} />
      <rect x="90" y="85" width="580" height="52" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="110" y="120" fill="#166534" fontSize="17" fontWeight="800">Step 1: subtract {b} → {a}x = {c - b}   Step 2: ÷{a} → x = {roundTo(x, 2)}</text>
      <polygon points={`${px},${py + 5} ${px - 22},${py + 60} ${px + 22},${py + 60}`} fill="#94a3b8" />
      <rect x={px - 100} y={py + 58} width="200" height="14" rx="5" fill="#94a3b8" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={lx} y2={ly + panDepth + 8} stroke="#0f172a" strokeWidth="4" />
      <line x1={rx} y1={ry} x2={rx} y2={ry + panDepth + 8} stroke="#0f172a" strokeWidth="4" />
      <rect x={lx - 55} y={ly + panDepth + 8} width="110" height="42" rx="10" fill="#06b6d4" opacity="0.85" />
      <text x={lx - 44} y={ly + panDepth + 34} fill="white" fontSize="16" fontWeight="900">{a}x + {b}</text>
      <rect x={rx - 38} y={ry + panDepth + 8} width="76" height="42" rx="10" fill="#8b5cf6" opacity="0.85" />
      <text x={rx - 24} y={ry + panDepth + 34} fill="white" fontSize="16" fontWeight="900">{c}</text>
      <rect x={px - 74} y={py + 80} width="148" height="32" rx="10" fill={balanced ? "#dcfce7" : "#fee2e2"} stroke={balanced ? "#4ade80" : "#f87171"} strokeWidth="2" />
      <text x={px - 54} y={py + 100} fill={balanced ? "#166534" : "#991b1b"} fontSize="14" fontWeight="800">
        {balanced ? `x = ${roundTo(x, 2)} ✓ balanced` : `x = ${roundTo(x, 2)}`}
      </text>
      <Label x="80" y="420" text={`Check: ${a} × ${roundTo(x, 2)} + ${b} = ${roundTo(lhs, 2)} — should equal ${c}.`} />
    </g>
  );
}

function IdentityTiles({ a, b }: { a: number; b: number }) {
  const total = a + b;
  const scale = Math.min(260, 440 / (total || 1));
  const sx = 110, sy = 90;
  const aw = a * scale, bw = b * scale;
  const lhs = (a + b) * (a + b);
  const rhs = a * a + 2 * a * b + b * b;
  return (
    <g>
      <Label x="80" y="65" text={`a=${roundTo(a, 1)}, b=${roundTo(b, 1)}: (${roundTo(a, 1)}+${roundTo(b, 1)})² = ${roundTo(lhs, 2)}`} />
      <rect x={sx} y={sy} width={aw} height={aw} fill="#06b6d4" opacity="0.75" stroke="#0891b2" strokeWidth="2" />
      <text x={sx + aw / 2 - 12} y={sy + aw / 2 + 6} fill="white" fontSize="14" fontWeight="800">a²={roundTo(a * a, 1)}</text>
      <rect x={sx + aw} y={sy} width={bw} height={aw} fill="#f59e0b" opacity="0.75" stroke="#d97706" strokeWidth="2" />
      <text x={sx + aw + bw / 2 - 12} y={sy + aw / 2 + 6} fill="white" fontSize="13" fontWeight="800">ab={roundTo(a * b, 1)}</text>
      <rect x={sx} y={sy + aw} width={aw} height={bw} fill="#f59e0b" opacity="0.75" stroke="#d97706" strokeWidth="2" />
      <text x={sx + aw / 2 - 12} y={sy + aw + bw / 2 + 6} fill="white" fontSize="13" fontWeight="800">ab={roundTo(a * b, 1)}</text>
      <rect x={sx + aw} y={sy + aw} width={bw} height={bw} fill="#8b5cf6" opacity="0.75" stroke="#7c3aed" strokeWidth="2" />
      <text x={sx + aw + bw / 2 - 12} y={sy + aw + bw / 2 + 6} fill="white" fontSize="13" fontWeight="800">b²={roundTo(b * b, 1)}</text>
      <rect x={sx - 2} y={sy - 2} width={aw + bw + 4} height={aw + bw + 4} fill="none" stroke="#0f172a" strokeWidth="3" />
      <text x={sx} y={sy + aw + bw + 28} fill="#0f172a" fontSize="15" fontWeight="800">{roundTo(a * a, 1)} + {roundTo(a * b, 1)} + {roundTo(a * b, 1)} + {roundTo(b * b, 1)} = {roundTo(rhs, 2)}</text>
      <Label x="80" y="430" text={`Both sides = ${roundTo(lhs, 2)}. Identity works for any a and b.`} />
    </g>
  );
}

function ProportionGraph({ k, xVal }: { k: number; xVal: number }) {
  const gx = (v: number) => 110 + v * 75;
  const gy = (v: number) => 360 - v * 55;
  const directPts = Array.from({ length: 80 }, (_, i) => { const x = i * 0.1; return `${i === 0 ? "M" : "L"}${gx(x)},${gy(k * x)}`; }).join(" ");
  const inversePts = Array.from({ length: 79 }, (_, i) => { const x = (i + 1) * 0.1; return `${i === 0 ? "M" : "L"}${gx(x)},${Math.max(50, gy(k / x))}`; }).join(" ");
  const yd = k * xVal;
  const yi = k / xVal;
  return (
    <g>
      <Label x="80" y="65" text={`k = ${roundTo(k, 1)}: direct y=${roundTo(yd, 2)}, inverse y=${roundTo(yi, 2)}`} />
      <line x1="100" x2="700" y1={gy(0)} y2={gy(0)} stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(0)} y1="55" x2={gx(0)} y2="375" stroke="#0f172a" strokeWidth="2" />
      {[1, 2, 3, 4, 5, 6, 7].map((v) => (
        <g key={v}>
          <text x={gx(v) - 5} y={gy(0) + 18} fill="#334155" fontSize="11" fontWeight="700">{v}</text>
          <text x={gx(0) - 18} y={gy(v) + 5} fill="#334155" fontSize="11" fontWeight="700">{v}</text>
        </g>
      ))}
      <path d={directPts} fill="none" stroke="#06b6d4" strokeWidth="4" />
      <path d={inversePts} fill="none" stroke="#f59e0b" strokeWidth="4" />
      <line x1={gx(xVal)} y1={gy(0)} x2={gx(xVal)} y2={gy(Math.max(yd, yi))} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 4" />
      <circle cx={gx(xVal)} cy={gy(yd)} r="7" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
      <circle cx={gx(xVal)} cy={Math.max(55, gy(yi))} r="7" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
      <text x="630" y="108" fill="#06b6d4" fontSize="13" fontWeight="800">y = kx</text>
      <text x="630" y="138" fill="#f59e0b" fontSize="13" fontWeight="800">y = k/x</text>
      <Label x="80" y="420" text="Direct: straight line through origin. Inverse: curve approaching axes." />
    </g>
  );
}

function PolynomialGraph({ b, c2 }: { b: number; c2: number }) {
  const D = b * b - 4 * c2;
  const gx = (v: number) => 380 + v * 62;
  const gy = (v: number) => 265 - v * 38;
  const f = (x: number) => x * x + b * x + c2;
  const pathD = Array.from({ length: 120 }, (_, i) => { const x = -5 + i * 0.09; return `${i === 0 ? "M" : "L"}${gx(x)},${Math.max(55, Math.min(420, gy(f(x))))}`; }).join(" ");
  const roots = D >= 0 ? [(-b - Math.sqrt(D)) / 2, (-b + Math.sqrt(D)) / 2] : [];
  const vx = -b / 2, vy = f(vx);
  return (
    <g>
      <Label x="80" y="65" text={`p(x) = x² ${b >= 0 ? "+" : ""}${roundTo(b, 1)}x ${c2 >= 0 ? "+" : ""}${roundTo(c2, 1)},  D = ${roundTo(D, 2)}`} />
      <line x1="80" x2="680" y1={gy(0)} y2={gy(0)} stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(0)} y1="55" x2={gx(0)} y2="420" stroke="#0f172a" strokeWidth="2" />
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <text x={gx(v) - 5} y={gy(0) + 18} fill="#334155" fontSize="11" fontWeight="700">{v}</text>
        </g>
      ))}
      <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="4" />
      {roots.map((r, i) => (
        <g key={i}>
          <circle cx={gx(r)} cy={gy(0)} r="9" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
          <text x={gx(r) + 12} y={gy(0) - 8} fill="#0f172a" fontSize="12" fontWeight="800">x={roundTo(r, 2)}</text>
        </g>
      ))}
      {D < 0 && <text x="220" y="360" fill="#ef4444" fontSize="14" fontWeight="800">D &lt; 0: no real roots</text>}
      <circle cx={gx(vx)} cy={Math.max(55, Math.min(420, gy(vy)))} r="7" fill="#8b5cf6" stroke="#0f172a" strokeWidth="2" />
      <text x={gx(vx) + 12} y={Math.max(70, Math.min(410, gy(vy)))} fill="#8b5cf6" fontSize="12" fontWeight="800">vertex ({roundTo(vx, 1)}, {roundTo(vy, 1)})</text>
      <Label x="80" y="430" text={D > 0 ? `Two roots: x₁+x₂=${roundTo(-b, 1)}, x₁×x₂=${roundTo(c2, 1)}` : D === 0 ? `One repeated root at x=${roundTo(vx, 2)}` : "Complex roots: parabola doesn't cross x-axis"} />
    </g>
  );
}

function QuadraticRoots({ qa, qb, qc }: { qa: number; qb: number; qc: number }) {
  const D = qb * qb - 4 * qa * qc;
  const gx = (v: number) => 380 + v * 52;
  const gy = (v: number) => 265 - v * 33;
  const f = (x: number) => qa * x * x + qb * x + qc;
  const pathD = Array.from({ length: 120 }, (_, i) => { const x = -5.5 + i * 0.092; return `${i === 0 ? "M" : "L"}${gx(x)},${Math.max(50, Math.min(440, gy(f(x))))}`; }).join(" ");
  const roots = D >= 0 && Math.abs(qa) > 0.01 ? [(-qb - Math.sqrt(D)) / (2 * qa), (-qb + Math.sqrt(D)) / (2 * qa)] : [];
  const vx = Math.abs(qa) > 0.01 ? -qb / (2 * qa) : 0;
  const vy = f(vx);
  return (
    <g>
      <Label x="80" y="60" text={`${roundTo(qa, 2)}x² ${qb >= 0 ? "+" : ""}${roundTo(qb, 2)}x ${qc >= 0 ? "+" : ""}${roundTo(qc, 2)} = 0     D = ${roundTo(D, 2)}`} />
      <line x1="80" x2="680" y1={gy(0)} y2={gy(0)} stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(0)} y1="50" x2={gx(0)} y2="440" stroke="#0f172a" strokeWidth="2" />
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => (
        <text key={v} x={gx(v) - 5} y={gy(0) + 17} fill="#334155" fontSize="11" fontWeight="700">{v}</text>
      ))}
      <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="4" />
      {roots.filter((r) => Math.abs(r) <= 5.5).map((r, i) => (
        <g key={i}>
          <circle cx={gx(r)} cy={gy(0)} r="9" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
          <text x={gx(r) + 12} y={gy(0) - 8} fill="#0f172a" fontSize="12" fontWeight="800">x={roundTo(r, 2)}</text>
        </g>
      ))}
      {D < 0 && <text x="200" y="380" fill="#ef4444" fontSize="14" fontWeight="800">D &lt; 0 — no real roots</text>}
      {Math.abs(vx) <= 5.5 && (
        <>
          <circle cx={gx(vx)} cy={Math.max(55, Math.min(435, gy(vy)))} r="7" fill="#8b5cf6" stroke="#0f172a" strokeWidth="2" />
          <text x={gx(vx) + 12} y={Math.max(68, Math.min(428, gy(vy)))} fill="#8b5cf6" fontSize="12" fontWeight="800">V({roundTo(vx, 1)}, {roundTo(vy, 1)})</text>
        </>
      )}
      <Label x="80" y="460" text={D > 0 ? `Two roots: x=${roundTo(roots[0], 2)}, x=${roundTo(roots[1], 2)}` : D === 0 ? `Repeated root x = ${roundTo(vx, 2)}` : "Complex roots — parabola doesn't cross x-axis"} />
    </g>
  );
}

function LinearPairGraph({ m1, c1, m2 }: { m1: number; c1: number; m2: number }) {
  const c2 = 1;
  const gx = (v: number) => 380 + v * 52;
  const gy = (v: number) => 240 - v * 38;
  const f1 = (x: number) => m1 * x + c1;
  const f2 = (x: number) => m2 * x + c2;
  const parallel = Math.abs(m1 - m2) < 0.05;
  const intX = parallel ? null : (c2 - c1) / (m1 - m2);
  const intY = intX !== null ? f1(intX) : null;
  const path1 = Array.from({ length: 100 }, (_, i) => { const x = -5.5 + i * 0.11; return `${i === 0 ? "M" : "L"}${gx(x)},${Math.max(30, Math.min(440, gy(f1(x))))}`; }).join(" ");
  const path2 = Array.from({ length: 100 }, (_, i) => { const x = -5.5 + i * 0.11; return `${i === 0 ? "M" : "L"}${gx(x)},${Math.max(30, Math.min(440, gy(f2(x))))}`; }).join(" ");
  const inView = intX !== null && intY !== null && Math.abs(intX) <= 5.5 && Math.abs(intY) <= 5.5;
  return (
    <g>
      <Label x="80" y="55" text={`Line 1: y = ${roundTo(m1, 1)}x + ${roundTo(c1, 1)}     Line 2: y = ${roundTo(m2, 1)}x + ${c2}`} />
      <line x1="80" x2="680" y1={gy(0)} y2={gy(0)} stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(0)} y1="30" x2={gx(0)} y2="440" stroke="#0f172a" strokeWidth="2" />
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => (
        <text key={v} x={gx(v) - 5} y={gy(0) + 16} fill="#94a3b8" fontSize="10" fontWeight="600">{v}</text>
      ))}
      <path d={path1} fill="none" stroke="#06b6d4" strokeWidth="3" />
      <path d={path2} fill="none" stroke="#f59e0b" strokeWidth="3" />
      <rect x="86" y="72" width="12" height="5" fill="#06b6d4" rx="2" />
      <text x="103" y="80" fill="#06b6d4" fontSize="12" fontWeight="700">Line 1</text>
      <rect x="166" y="72" width="12" height="5" fill="#f59e0b" rx="2" />
      <text x="183" y="80" fill="#f59e0b" fontSize="12" fontWeight="700">Line 2</text>
      {parallel && <text x="180" y="390" fill="#ef4444" fontSize="14" fontWeight="800">Parallel lines — no common solution</text>}
      {inView && (
        <>
          <circle cx={gx(intX!)} cy={gy(intY!)} r="10" fill="#8b5cf6" stroke="#0f172a" strokeWidth="2" />
          <text x={gx(intX!) + 13} y={gy(intY!) - 8} fill="#8b5cf6" fontSize="13" fontWeight="800">({roundTo(intX!, 2)}, {roundTo(intY!, 2)})</text>
        </>
      )}
      {!parallel && !inView && <text x="200" y="390" fill="#94a3b8" fontSize="13">Intersection off screen — adjust slopes</text>}
      <Label x="80" y="455" text={parallel ? "Equal slopes → no intersection → system inconsistent" : inView ? `Solution: x = ${roundTo(intX!, 2)},  y = ${roundTo(intY!, 2)}` : "Lines intersect outside the view range"} />
    </g>
  );
}

function LinearInequality({ a, b, c3 }: { a: number; b: number; c3: number }) {
  const critX = a === 0 ? 0 : (c3 - b) / a;
  const solutionRight = a > 0;
  const nl = (v: number) => 100 + (v + 8) * 34;
  return (
    <g>
      <Label x="80" y="60" text={`${roundTo(a, 1)}x + ${roundTo(b, 1)} > ${roundTo(c3, 1)}   →   x ${solutionRight ? ">" : "<"} ${roundTo(critX, 2)}`} />
      <rect x="80" y="80" width="580" height="56" rx="14" fill={a < 0 ? "#fef9c3" : "#f0fdf4"} stroke={a < 0 ? "#fbbf24" : "#86efac"} strokeWidth="2" />
      <text x="110" y="116" fill={a < 0 ? "#92400e" : "#166534"} fontSize="16" fontWeight="800">
        {a < 0 ? `⚠ Divide by negative ${roundTo(a, 1)}: inequality flips!` : `Divide both sides by ${roundTo(a, 1)} — sign stays same`}
      </text>
      <line x1="90" x2="670" y1="240" y2="240" stroke="#0f172a" strokeWidth="4" />
      {Array.from({ length: 17 }, (_, i) => i - 8).map((v) => (
        <g key={v}>
          <line x1={nl(v)} y1="232" x2={nl(v)} y2="248" stroke="#0f172a" strokeWidth="2" />
          {v % 2 === 0 && <text x={nl(v) - 5} y="265" fill="#334155" fontSize="12" fontWeight="700">{v}</text>}
        </g>
      ))}
      <circle cx={nl(Math.max(-8, Math.min(8, critX)))} cy="240" r="10" fill="white" stroke="#ef4444" strokeWidth="3" />
      <text x={nl(Math.max(-8, Math.min(8, critX))) + 14} y="235" fill="#ef4444" fontSize="13" fontWeight="800">x={roundTo(critX, 2)}</text>
      {solutionRight ? (
        <rect x={nl(Math.min(8, Math.max(-8, critX)))} y="225" width={670 - nl(Math.min(8, Math.max(-8, critX)))} height="30" fill="#06b6d4" opacity="0.28" />
      ) : (
        <rect x="90" y="225" width={Math.max(0, nl(Math.min(8, Math.max(-8, critX))) - 90)} height="30" fill="#8b5cf6" opacity="0.28" />
      )}
      <Label x="80" y="310" text={`Solution: all x ${solutionRight ? ">" : "<"} ${roundTo(critX, 2)} — highlighted region.`} />
      <Label x="80" y="340" text={`Two-variable: ax + by > c shades a half-plane above or below the boundary line.`} />
      <rect x="90" y="355" width="580" height="55" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      <text x="110" y="382" fill="#0f172a" fontSize="14" fontWeight="700">Example in 2 variables: 2x + 3y &gt; 6</text>
      <text x="110" y="402" fill="#64748b" fontSize="12">Boundary line: 2x + 3y = 6 → shade half-plane above it</text>
      <Label x="80" y="430" text="Test a point: (0,0) gives 0 > 6? No. So shade the opposite side." />
    </g>
  );
}

function InverseTrigGraph({ fn, xVal }: { fn: number; xVal: number }) {
  const fnNames = ["sin⁻¹", "cos⁻¹", "tan⁻¹"];
  const fnName = fnNames[Math.max(0, fn - 1)];
  const rangeLo = fn === 2 ? 0 : -Math.PI / 2;
  const rangeHi = fn === 2 ? Math.PI : Math.PI / 2;
  const gx = (v: number) => 380 + v * (fn === 3 ? 70 : 220);
  const gy = (v: number) => 235 - v * 100;
  const f = (x: number) => fn === 1 ? Math.asin(Math.max(-1, Math.min(1, x))) : fn === 2 ? Math.acos(Math.max(-1, Math.min(1, x))) : Math.atan(x);
  const pts = Array.from({ length: fn === 3 ? 120 : 80 }, (_, i) => {
    const x = fn === 3 ? -4 + i * 8 / 119 : -1 + i * 2 / 79;
    return `${i === 0 ? "M" : "L"}${gx(x)},${gy(f(x))}`;
  }).join(" ");
  const inputX = fn === 3 ? xVal * 4 : xVal;
  const outputY = f(inputX);
  return (
    <g>
      <Label x="80" y="65" text={`${fnName}(${roundTo(inputX, 2)}) = ${roundTo(outputY, 4)} rad = ${roundTo(outputY * 180 / Math.PI, 2)}°`} />
      <line x1="80" x2="680" y1={gy(0)} y2={gy(0)} stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(0)} y1="55" x2={gx(0)} y2="420" stroke="#0f172a" strokeWidth="2" />
      <path d={pts} fill="none" stroke="#06b6d4" strokeWidth="4" />
      <line x1="80" x2="680" y1={gy(rangeLo)} y2={gy(rangeLo)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 5" opacity="0.7" />
      <line x1="80" x2="680" y1={gy(rangeHi)} y2={gy(rangeHi)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 5" opacity="0.7" />
      <circle cx={gx(inputX)} cy={gy(outputY)} r="9" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(inputX)} y1={gy(0)} x2={gx(inputX)} y2={gy(outputY)} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 4" />
      <line x1={gx(0)} y1={gy(outputY)} x2={gx(inputX)} y2={gy(outputY)} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 4" />
      <text x="595" y={gy(rangeHi) - 8} fill="#f59e0b" fontSize="12" fontWeight="800">max range</text>
      <text x="595" y={gy(rangeLo) + 18} fill="#f59e0b" fontSize="12" fontWeight="800">min range</text>
      <text x="90" y="380" fill="#0f172a" fontSize="14" fontWeight="800">{fnName}: domain [{fn === 3 ? "−∞" : "−1"}, {fn === 3 ? "+∞" : "1"}] → range [{fn === 2 ? "0" : "−π/2"}, {fn === 2 ? "π" : "π/2"}]</text>
      <Label x="80" y="420" text={`Principal branch guarantees one output per input. f(f⁻¹(x)) = x.`} />
    </g>
  );
}
