import { useState } from "react";
import type { NCERTConcept } from "../../../data/ncertConcepts";
import NCERTCompactPanel from "../layout/NCERTCompactPanel";
import NCERTSubTabs from "../layout/NCERTSubTabs";
import NCERTTabbedWorkspace from "../layout/NCERTTabbedWorkspace";
import NCERTPracticeCheck from "../practice/NCERTPracticeCheck";
import type { NCERTPracticeQuestion } from "../practice/ncertPracticeTypes";
import { getNCERTPracticeItems } from "../../../data/ncertPracticeBank";
import NCERTTeacherModePanel from "../teacher/NCERTTeacherModePanel";
import { evaluateArithmeticExpression, operateDecimals, operateFractions, type Fraction } from "./grade7MathUtils";
import {
  angleBisectorCheck,
  compareFractions,
  fractionText,
  integerOperation,
  lcmByGcd,
  mean,
  median,
  mode,
  percentValue,
  perpendicularBisectorCheck,
  profitLoss,
  rationalValue,
  simpleInterest,
  simplifyLikeTerms,
  solveSimpleEquation,
  substituteLinearExpression,
  triangleInequality,
} from "./grade7ManipulativeUtils";

export const grade7PriorityRouteIds = [
  "class-7-constructions-and-tilings",
  "class-7-arithmetic-expressions",
  "class-7-decimal-operations",
  "class-7-fraction-operations",
  "class-7-integers",
  "class-7-simple-equations",
  "class-7-rational-numbers",
  "class-7-comparing-quantities",
  "class-7-algebraic-expressions",
  "class-7-data-handling",
] as const;

export type Grade7PriorityRouteId = typeof grade7PriorityRouteIds[number];

export function isGrade7PriorityRoute(id: string): id is Grade7PriorityRouteId {
  return (grade7PriorityRouteIds as readonly string[]).includes(id);
}

type Mode = "construction" | "arithmetic" | "decimal" | "fraction" | "integer" | "equation" | "rational" | "quantity" | "algebra" | "data";

type Grade7Config = {
  mode: Mode;
  title: string;
  subtitle: string;
  labels: string[];
  defaults: number[];
  subTabs: string[];
};

export default function Grade7ManipulativeLab({ concept }: { concept: NCERTConcept }) {
  const routeId = concept.id as Grade7PriorityRouteId;
  const config = grade7Config(routeId, concept);
  const [values, setValues] = useState(config.defaults);
  const bankPractice = getNCERTPracticeItems(routeId);
  const practice = bankPractice.length > 0 ? bankPractice : grade7Practice(routeId, values);
  const facts = grade7Facts(routeId, values);
  const feedback = grade7Feedback(routeId, values);

  const controls = (
    <div className="space-y-4">
      {config.labels.map((label, index) => (
        <label key={label} className="block text-sm font-black text-slate-700 dark:text-slate-200">
          {label}
          <input
            type="range"
            min={controlRange(config.mode, index).min}
            max={controlRange(config.mode, index).max}
            step={controlRange(config.mode, index).step}
            value={values[index] ?? 0}
            onChange={(event) => {
              const next = [...values];
              next[index] = Number(event.target.value);
              setValues(next);
            }}
            className="mt-2 w-full accent-cyan-500"
          />
          <input
            type="number"
            value={values[index] ?? 0}
            step={controlRange(config.mode, index).step}
            onChange={(event) => {
              const next = [...values];
              next[index] = Number(event.target.value);
              setValues(next);
            }}
            className="mt-2 w-full rounded-2xl border border-cyan-200 bg-white px-3 py-2 font-mono font-black dark:border-cyan-300/20 dark:bg-slate-900"
          />
        </label>
      ))}
      <div className="rounded-2xl bg-slate-950 p-4 text-sm font-bold leading-6 text-cyan-50">{feedback}</div>
    </div>
  );

  const visual = (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-slate-950 p-2 dark:border-cyan-300/20">
        <svg viewBox="0 0 760 460" role="img" aria-label={`${concept.title} Grade 7 manipulative`} className="h-[330px] w-full sm:h-[390px]">
          <title>{concept.title}</title>
          <desc>{config.subtitle}</desc>
          <Grid />
          {grade7Svg(config.mode, values)}
        </svg>
      </div>
      <aside className="space-y-3">
        <NCERTCompactPanel title="Live values" description="Use these to check your reasoning." accent="emerald">
          <div className="grid gap-2">
            {facts.map((fact) => <Fact key={fact.label} label={fact.label} value={fact.value} />)}
          </div>
        </NCERTCompactPanel>
        <NCERTCompactPanel title="Controls" description="Tune the manipulative." accent="cyan">
          {controls}
        </NCERTCompactPanel>
      </aside>
    </div>
  );

  const visualModel = (
    <NCERTSubTabs
      ariaLabel={`${concept.title} Grade 7 sub-tabs`}
      tabs={config.subTabs.map((label, index) => ({
        id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label,
        content: index === config.subTabs.length - 1 ? <NCERTPracticeCheck questions={practice} conceptId={routeId} compact /> : visual,
      }))}
    />
  );

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-cyan-200 bg-white/95 p-5 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Class 7 NCERT manipulative lab</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white">{config.title}</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{config.subtitle}</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black uppercase text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-50">
            manipulative + practice
          </span>
        </div>
      </section>
      <NCERTTabbedWorkspace
        ariaLabel={`${concept.title} Grade 7 compact tabs`}
        tabs={[
          { id: "explore", label: "Explore", content: visual },
          { id: "visual-model", label: "Visual Model", content: visualModel },
          { id: "practice", label: "Practice", content: <NCERTPracticeCheck questions={practice} conceptId={routeId} compact /> },
          {
            id: "mistakes",
            label: "Common Mistakes",
            content: (
              <NCERTCompactPanel title="Watch for this" description="The checker explains mistakes with text, not only color." accent="amber">
                <p className="text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{feedback}</p>
              </NCERTCompactPanel>
            ),
          },
          {
            id: "teacher",
            label: "Teacher Notes",
            content: (
              bankPractice.length > 0 ? (
                <NCERTTeacherModePanel title={concept.title} classLevel={concept.classLevel} questions={bankPractice} prompts={concept.tasks} misconception={feedback} extension={concept.outcomes[1] ?? concept.summary} />
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  <NCERTCompactPanel title="Objective" accent="cyan"><p className="text-sm font-bold leading-6">{concept.outcomes[0]}</p></NCERTCompactPanel>
                  <NCERTCompactPanel title="Prompt" accent="violet"><p className="text-sm font-bold leading-6">{concept.tasks[0]}</p></NCERTCompactPanel>
                  <NCERTCompactPanel title="Recap" accent="emerald"><p className="text-sm font-bold leading-6">{concept.summary}</p></NCERTCompactPanel>
                </div>
              )
            ),
          },
        ]}
      />
    </div>
  );
}

function grade7Config(routeId: Grade7PriorityRouteId, concept: NCERTConcept): Grade7Config {
  if (routeId.includes("construction")) return { mode: "construction", title: concept.title, subtitle: "Use compass arcs, ruler lines, construction checks, tilings, and symmetry toggles.", labels: ["Compass radius", "Step", "Tile count"], defaults: [90, 2, 5], subTabs: ["Perpendicular Bisector", "Angle Bisector", "Triangle", "Tilings", "Symmetry"] };
  if (routeId.includes("arithmetic")) return { mode: "arithmetic", title: concept.title, subtitle: "Build expression trees, highlight operation priority, and compare correct and wrong order.", labels: ["Expression preset", "Step", "Bracket emphasis"], defaults: [1, 1, 1], subTabs: ["BODMAS", "Brackets", "Expression Tree", "Wrong Order", "Practice"] };
  if (routeId.includes("decimal")) return { mode: "decimal", title: concept.title, subtitle: "Use base-10 blocks, number-line movement, decimal alignment, scaling, and division by powers of 10.", labels: ["Decimal A", "Decimal B", "Operation"], defaults: [3.4, 2.75, 1], subTabs: ["Place Value", "Add/Subtract", "Multiply", "Divide", "Practice"] };
  if (routeId.includes("fraction")) return { mode: "fraction", title: concept.title, subtitle: "Use area bars, number lines, LCM denominators, multiplication rectangles, division groups, and simplification.", labels: ["Numerator A", "Denominator A", "Denominator B"], defaults: [1, 2, 3], subTabs: ["Area Model", "Number Line", "LCM", "Operations", "Practice"] };
  if (routeId.includes("integer")) return { mode: "integer", title: concept.title, subtitle: "Use counters, number-line jumps, addition/subtraction movement, and multiplication/division sign rules.", labels: ["Integer A", "Integer B", "Operation"], defaults: [-3, 7, 1], subTabs: ["Number Line", "Counters", "Add/Subtract", "Multiply/Divide", "Practice"] };
  if (routeId.includes("simple-equations")) return { mode: "equation", title: concept.title, subtitle: "Use a balance model and inverse-operation stepper to solve equations safely.", labels: ["Coefficient a", "Constant b", "Right side c"], defaults: [3, 2, 11], subTabs: ["Balance", "Inverse Operation", "Steps", "Practice"] };
  if (routeId.includes("rational")) return { mode: "rational", title: concept.title, subtitle: "Place rational numbers on a number line, compare values, operate, and build equivalent forms.", labels: ["Numerator", "Denominator", "Compare denominator"], defaults: [-5, 4, 8], subTabs: ["Number Line", "Compare", "Operations", "Equivalent Forms", "Practice"] };
  if (routeId.includes("comparing")) return { mode: "quantity", title: concept.title, subtitle: "Use percentage bars, ratio tables, discount, profit/loss, tax, and simple interest stories.", labels: ["Base / cost", "Percent / selling", "Time"], defaults: [1000, 12, 2], subTabs: ["Percent", "Ratio", "Profit/Loss", "Discount/Tax", "Simple Interest", "Practice"] };
  if (routeId.includes("algebraic")) return { mode: "algebra", title: concept.title, subtitle: "Use expression tiles, like terms, substitution tables, simplification, and word-to-expression practice.", labels: ["x coefficient", "constant", "x value"], defaults: [3, 5, 2], subTabs: ["Tiles", "Like Terms", "Substitution", "Simplify", "Word Problems", "Practice"] };
  return { mode: "data", title: concept.title, subtitle: "Build datasets, pictographs, bar graphs, mean, median, mode, and interpretation answers.", labels: ["Dataset preset", "Scale", "Question"], defaults: [1, 2, 1], subTabs: ["Dataset", "Pictograph", "Bar Graph", "Mean", "Median/Mode", "Interpret", "Practice"] };
}

function controlRange(mode: Mode, index: number) {
  if (mode === "decimal") return index === 2 ? { min: 1, max: 4, step: 1 } : { min: 0, max: 20, step: 0.01 };
  if (mode === "construction") return index === 0 ? { min: 40, max: 150, step: 1 } : index === 1 ? { min: 1, max: 4, step: 1 } : { min: 3, max: 10, step: 1 };
  if (mode === "quantity") return index === 0 ? { min: 50, max: 3000, step: 50 } : index === 1 ? { min: -50, max: 120, step: 1 } : { min: 1, max: 5, step: 1 };
  if (mode === "data") return index === 0 ? { min: 1, max: 5, step: 1 } : { min: 1, max: 8, step: 1 };
  return { min: -12, max: 12, step: 1 };
}

function grade7Facts(routeId: Grade7PriorityRouteId, values: number[]) {
  const [a, b, c = 1] = values;
  if (routeId.includes("construction")) {
    return [
      { label: "midpoint check", value: perpendicularBisectorCheck(180, 420, 300).ok ? "valid" : "retry" },
      { label: "angle split", value: angleBisectorCheck(35, 35).ok ? "equal" : "unequal" },
      { label: "triangle", value: triangleInequality(3, 4, 5) ? "possible" : "not possible" },
    ];
  }
  if (routeId.includes("arithmetic")) {
    const expression = arithmeticExpression(Math.round(a));
    const evaluated = evaluateArithmeticExpression(expression);
    return [{ label: "expression", value: expression }, { label: "value", value: String(evaluated.value) }, { label: "first rule", value: evaluated.steps[0]?.operation ?? "read left to right only after priority" }];
  }
  if (routeId.includes("decimal")) {
    const operation = decimalOperation(Math.round(c));
    return [{ label: operation, value: String(operateDecimals(a, b || 1, operation)) }, { label: "aligned A", value: a.toFixed(2) }, { label: "aligned B", value: b.toFixed(2) }];
  }
  if (routeId.includes("fraction")) {
    const left = fraction(a, b);
    const right = fraction(1, c);
    const op = operateFractions(left, right, "add");
    return [{ label: "A", value: fractionText(left) }, { label: "LCM", value: String(lcmByGcd(left.denominator, right.denominator)) }, { label: "A + 1/c", value: fractionText(op.result) }];
  }
  if (routeId.includes("integer")) return [{ label: "a + b", value: String(integerOperation(a, b, "add")) }, { label: "a x b", value: String(integerOperation(a, b, "multiply")) }, { label: "sign", value: a * b < 0 ? "negative" : "positive" }];
  if (routeId.includes("simple-equations")) return [{ label: "equation", value: `${a}x + ${b} = ${c}` }, { label: "x", value: solveSimpleEquation(a || 1, b, c).toFixed(2) }, { label: "inverse", value: `subtract ${b}, divide by ${a}` }];
  if (routeId.includes("rational")) {
    const left = fraction(a, b || 1);
    const right = fraction(a, c || 1);
    return [{ label: "value", value: rationalValue(left).toFixed(2) }, { label: "compare", value: compareFractions(left, right).comparison }, { label: "equivalent", value: `${a * 2}/${(b || 1) * 2}` }];
  }
  if (routeId.includes("comparing")) {
    const pl = profitLoss(a, b);
    return [{ label: "percent value", value: percentValue(a, b).toFixed(2) }, { label: pl.type, value: `${pl.amount.toFixed(2)}` }, { label: "simple interest", value: simpleInterest(a, Math.abs(b), c).toFixed(2) }];
  }
  if (routeId.includes("algebraic")) {
    const simplified = simplifyLikeTerms([a, 2], [b, -3]);
    return [{ label: "simplified", value: `${simplified.xCoefficient}x + ${simplified.constant}` }, { label: "x value", value: String(c) }, { label: "value", value: String(substituteLinearExpression(a, b, c)) }];
  }
  const dataset = dataSet(Math.round(a));
  return [{ label: "mean", value: mean(dataset).toFixed(2) }, { label: "median", value: String(median(dataset)) }, { label: "mode", value: mode(dataset).join(", ") }];
}

function grade7Feedback(routeId: Grade7PriorityRouteId, values: number[]) {
  if (routeId.includes("construction")) return "Do not guess by eye. Equal compass arcs prove equal distances and exact construction points.";
  if (routeId.includes("arithmetic")) return "Common mistake: doing addition before multiplication just because it appears first.";
  if (routeId.includes("decimal")) return "Line up decimal points for addition and subtraction; multiplication uses place-value scaling.";
  if (routeId.includes("fraction")) return "For addition or subtraction, first make common denominators. For multiplication, multiply across.";
  if (routeId.includes("integer")) return values[0] * values[1] < 0 ? "Different signs make a negative product." : "Same signs make a positive product.";
  if (routeId.includes("simple-equations")) return "Every operation must be done to both sides of the balance.";
  if (routeId.includes("rational")) return "Compare rational numbers by placing them on the same line or cross-multiplying.";
  if (routeId.includes("comparing")) return "Percent always needs a base. Check whether the base is cost price, marked price, or principal.";
  if (routeId.includes("algebraic")) return "Only like terms combine. 3x and 5 are not like terms.";
  return "A graph tells a story. Always read the scale before interpreting bars or symbols.";
}

function grade7Practice(routeId: Grade7PriorityRouteId, values: number[]): NCERTPracticeQuestion[] {
  const facts = grade7Facts(routeId, values);
  return [
    { id: `${routeId}-live`, prompt: `Using the current model, what is ${facts[0].label}?`, answer: facts[0].value, hint: "Read the first live-value card.", explanation: `The live value is ${facts[0].value}.`, commonMistake: "Check the live-value cards and units." },
    { id: `${routeId}-concept`, prompt: "Which tab should you use when you want to test yourself?", answer: "Practice", choices: ["Visual Model", "Practice", "Teacher Notes", "Common Mistakes"], hint: "It contains the checker.", explanation: "The Practice tab contains answer checking." },
  ];
}

function grade7Svg(mode: Mode, values: number[]) {
  if (mode === "construction") return <ConstructionVisual values={values} />;
  if (mode === "arithmetic") return <ArithmeticVisual values={values} />;
  if (mode === "decimal") return <DecimalVisual values={values} />;
  if (mode === "fraction") return <FractionVisual values={values} />;
  if (mode === "integer") return <IntegerVisual values={values} />;
  if (mode === "equation") return <EquationVisual values={values} />;
  if (mode === "rational") return <RationalVisual values={values} />;
  if (mode === "quantity") return <QuantityVisual values={values} />;
  if (mode === "algebra") return <AlgebraVisual values={values} />;
  return <DataVisual values={values} />;
}

function Grid() {
  return <g opacity="0.16">{Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={40 + i * 45} x2={40 + i * 45} y1="35" y2="425" stroke="#67e8f9" />)}{Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="40" x2="720" y1={50 + i * 45} y2={50 + i * 45} stroke="#67e8f9" />)}</g>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white p-3 dark:bg-slate-950"><p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p></div>;
}

function Text({ x, y, value, size = 20 }: { x: number; y: number; value: string; size?: number }) {
  return <text x={x} y={y} fill="#e0f2fe" stroke="none" fontSize={size} fontWeight="900">{value}</text>;
}

function ConstructionVisual({ values }: { values: number[] }) {
  const radius = values[0];
  const tileCount = Math.round(values[2]);
  return <g><line x1="180" x2="420" y1="220" y2="220" stroke="#e2e8f0" strokeWidth="5" /><circle cx="180" cy="220" r={radius} fill="none" stroke="#22d3ee" strokeDasharray="8 8" strokeWidth="3" /><circle cx="420" cy="220" r={radius} fill="none" stroke="#22d3ee" strokeDasharray="8 8" strokeWidth="3" /><line x1="300" x2="300" y1="80" y2="360" stroke="#facc15" strokeWidth="4" /><Text x={120} y={60} value="compass arcs + ruler line" size={28} /><Text x={230} y={405} value="midpoint check: valid" size={24} />{Array.from({ length: tileCount }, (_, i) => <rect key={i} x={500 + (i % 3) * 48} y={120 + Math.floor(i / 3) * 48} width="42" height="42" fill={i % 2 ? "#a78bfa" : "#22d3ee"} opacity="0.85" />)}</g>;
}

function ArithmeticVisual({ values }: { values: number[] }) {
  const expression = arithmeticExpression(Math.round(values[0]));
  const result = evaluateArithmeticExpression(expression);
  return <g><Text x={90} y={80} value={expression} size={34} /><rect x="90" y="130" width="580" height="86" rx="24" fill="#0e7490" opacity="0.7" /><Text x={125} y={180} value={result.steps[0]?.operation ?? "Use BODMAS first"} /><Text x={90} y={285} value={`Correct value = ${result.value}`} size={30} /><Text x={90} y={340} value="wrong order path is shown as a warning, not as the rule" size={18} /></g>;
}

function DecimalVisual({ values }: { values: number[] }) {
  const [a, b, op] = values;
  const operation = decimalOperation(Math.round(op));
  return <g><Text x={85} y={70} value={`${a.toFixed(2)} ${operation} ${b.toFixed(2)}`} size={30} /><line x1="90" x2="650" y1="240" y2="240" stroke="#e2e8f0" strokeWidth="4" />{[a, b].map((value, i) => <circle key={i} cx={90 + Math.min(1, value / 20) * 560} cy={240} r="16" fill={i ? "#facc15" : "#22d3ee"} />)}<Text x={90} y={330} value={`result = ${operateDecimals(a, b || 1, operation)}`} /><Text x={90} y={380} value="alignment table: ones | tenths | hundredths" size={18} /></g>;
}

function FractionVisual({ values }: { values: number[] }) {
  const a = fraction(values[0], values[1]);
  const b = fraction(1, values[2]);
  const sum = operateFractions(a, b, "add").result;
  return <g><Text x={80} y={70} value={`${fractionText(a)} + ${fractionText(b)} = ${fractionText(sum)}`} size={30} />{[0, 1].map((row) => <g key={row} transform={`translate(95 ${135 + row * 90})`}>{Array.from({ length: row ? b.denominator : a.denominator }, (_, i) => <rect key={i} x={i * 34} y="0" width="30" height="54" fill={i < (row ? b.numerator : a.numerator) ? "#22d3ee" : "#1e293b"} stroke="#e2e8f0" />)}</g>)}<Text x={90} y={365} value={`LCM denominator = ${lcmByGcd(a.denominator, b.denominator)}`} /></g>;
}

function IntegerVisual({ values }: { values: number[] }) {
  const [a, b] = values;
  const end = a + b;
  return <g><line x1="80" x2="680" y1="230" y2="230" stroke="#e2e8f0" strokeWidth="4" />{Array.from({ length: 13 }, (_, i) => <g key={i}><line x1={80 + i * 50} x2={80 + i * 50} y1="215" y2="245" stroke="#94a3b8" /><text x={72 + i * 50} y="275" fill="#e2e8f0" fontSize="14">{i - 6}</text></g>)}<circle cx={80 + (a + 6) * 50} cy="230" r="15" fill="#facc15" /><circle cx={80 + (end + 6) * 50} cy="230" r="15" fill="#22d3ee" /><Text x={90} y={90} value={`${a} + ${b} = ${end}`} size={34} /></g>;
}

function EquationVisual({ values }: { values: number[] }) {
  const [a, b, c] = values;
  const x = solveSimpleEquation(a || 1, b, c);
  return <g><Text x={90} y={80} value={`${a}x + ${b} = ${c}`} size={34} /><line x1="170" x2="590" y1="235" y2="235" stroke="#facc15" strokeWidth="8" /><polygon points="380,235 340,330 420,330" fill="#22d3ee" opacity="0.8" /><Text x={110} y={205} value="left side" /><Text x={505} y={205} value="right side" /><Text x={90} y={390} value={`x = ${x.toFixed(2)}; do same operation to both sides`} size={22} /></g>;
}

function RationalVisual({ values }: { values: number[] }) {
  const f = fraction(values[0], values[1]);
  const x = 380 + Math.max(-2, Math.min(2, rationalValue(f))) * 150;
  return <g><line x1="80" x2="680" y1="240" y2="240" stroke="#e2e8f0" strokeWidth="4" /><Text x={80} y={205} value="-2" /><Text x={370} y={205} value="0" /><Text x={650} y={205} value="2" /><circle cx={x} cy="240" r="18" fill="#22d3ee" /><Text x={90} y={80} value={`${fractionText(f)} = ${rationalValue(f).toFixed(2)}`} size={34} /><Text x={90} y={360} value={`equivalent form: ${f.numerator * 2}/${f.denominator * 2}`} /></g>;
}

function QuantityVisual({ values }: { values: number[] }) {
  const [base, percent, time] = values;
  const width = Math.max(0, Math.min(520, Math.abs(percent) / 100 * 520));
  return <g><Text x={90} y={70} value={`${percent}% of ${base} = ${percentValue(base, percent).toFixed(2)}`} size={30} /><rect x="100" y="130" width="520" height="58" rx="18" fill="#1e293b" /><rect x="100" y="130" width={width} height="58" rx="18" fill={percent >= 0 ? "#22d3ee" : "#fb7185"} /><Text x={90} y={275} value={`simple interest = ${simpleInterest(base, Math.abs(percent), time).toFixed(2)}`} /><Text x={90} y={335} value="ratio table | profit/loss | discount/tax all use the base" size={18} /></g>;
}

function AlgebraVisual({ values }: { values: number[] }) {
  const [coef, constant, x] = values;
  return <g><Text x={90} y={70} value={`${coef}x + ${constant}; x=${x}; value=${substituteLinearExpression(coef, constant, x)}`} size={28} />{Array.from({ length: Math.abs(Math.round(coef)) }, (_, i) => <rect key={i} x={95 + i * 48} y="135" width="40" height="70" rx="8" fill={coef >= 0 ? "#22d3ee" : "#fb7185"} />)}{Array.from({ length: Math.min(12, Math.abs(Math.round(constant))) }, (_, i) => <rect key={i} x={95 + i * 34} y="250" width="26" height="26" rx="5" fill={constant >= 0 ? "#facc15" : "#fb7185"} />)}<Text x={90} y={365} value="x-tiles combine only with x-tiles; unit tiles combine with unit tiles" size={18} /></g>;
}

function DataVisual({ values }: { values: number[] }) {
  const dataset = dataSet(Math.round(values[0]));
  const max = Math.max(...dataset);
  return <g><Text x={90} y={70} value={`data: ${dataset.join(", ")}`} size={28} />{dataset.map((value, i) => <rect key={i} x={105 + i * 70} y={350 - value / max * 210} width="42" height={value / max * 210} fill="#22d3ee" />)}<Text x={90} y={405} value={`mean ${mean(dataset).toFixed(1)}, median ${median(dataset)}, mode ${mode(dataset).join(", ")}`} /></g>;
}

function arithmeticExpression(preset: number) {
  return ["8+4*3", "(8+4)*3", "24/3+5*2", "18-6/3", "2*(5+7)-4"][Math.max(0, Math.min(4, preset - 1))] ?? "8+4*3";
}

function decimalOperation(preset: number) {
  return (["add", "subtract", "multiply", "divide"] as const)[Math.max(0, Math.min(3, preset - 1))];
}

function fraction(numerator: number, denominator: number): Fraction {
  return { numerator: Math.round(numerator), denominator: Math.max(1, Math.abs(Math.round(denominator))) };
}

function dataSet(preset: number) {
  const sets = [[6, 8, 10, 7, 9], [3, 5, 5, 7, 8], [12, 16, 10, 18, 14], [22, 24, 20, 26, 24], [4, 9, 4, 6, 7]];
  return sets[Math.max(0, Math.min(sets.length - 1, preset - 1))];
}
