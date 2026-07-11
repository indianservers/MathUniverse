import { useMemo, useState } from "react";
import NCERTChapterScaffold from "../NCERTChapterScaffold";
import { InvalidMathStateMessage } from "../../ui/LearningScaffolds";
import { fractionToMixed, operateFractions, simplifyFraction, type Fraction, type FractionOperation } from "./grade7MathUtils";

const presets = [
  { label: "1/2 + 1/3", a: [1, 2], b: [1, 3], op: "add" as FractionOperation },
  { label: "3/4 - 1/6", a: [3, 4], b: [1, 6], op: "subtract" as FractionOperation },
  { label: "2/3 * 3/5", a: [2, 3], b: [3, 5], op: "multiply" as FractionOperation },
  { label: "4/5 / 2/3", a: [4, 5], b: [2, 3], op: "divide" as FractionOperation },
  { label: "compare 5/8 and 3/4", a: [5, 8], b: [3, 4], op: "compare" as FractionOperation },
  { label: "simplify 18/24", a: [18, 24], b: [1, 2], op: "simplify" as FractionOperation },
];

const operations: Record<FractionOperation, string> = {
  add: "add",
  subtract: "subtract",
  multiply: "multiply",
  divide: "divide",
  compare: "compare",
  simplify: "simplify A",
};

export default function Grade7FractionOperationsLab() {
  const [a, setA] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [b, setB] = useState<Fraction>({ numerator: 1, denominator: 3 });
  const [operation, setOperation] = useState<FractionOperation>("add");
  const output = useMemo(() => {
    try {
      if (operation === "simplify") return { result: simplifyFraction(a), commonDenominator: a.denominator, comparison: 0, error: "" };
      return { ...operateFractions(a, b, operation), error: "" };
    } catch (error) {
      return { result: { numerator: 0, denominator: 1 }, commonDenominator: 1, comparison: 0, error: error instanceof Error ? error.message : "Check the fractions." };
    }
  }, [a, b, operation]);

  return (
    <NCERTChapterScaffold
      title="Fraction Operations"
      conceptId="class-7-fraction-operations"
      subtitle="Compare, simplify, add, subtract, multiply, and divide fractions using area and number-line models."
      formula="for addition/subtraction, use a common denominator"
      presets={presets.map((preset) => preset.label)}
      diagramSummary="The fraction lab shows two fraction bars, a result bar, common denominators, and simplified answers."
      studentTask={{
        tryFirst: "Try 1/2 + 1/3 and predict whether the answer is bigger than 1/2.",
        predict: "What common denominator will both fractions use?",
        observe: "Watch the result simplify after the operation.",
        explain: "Why do unlike denominators need common parts before adding?",
        commonMistake: "Do not add denominators when adding fractions. Make equal-sized parts first.",
      }}
      teacherNote={{
        objective: "Students connect fraction operations to equal parts and simplified results.",
        prerequisite: "Meaning of numerator, denominator, and equivalent fractions.",
        prompt: "Ask students to draw the common-denominator parts before calculating.",
        misconception: "Students may add numerator and denominator separately.",
        extension: "Use recipes, sharing, and distance walked as word-problem contexts.",
      }}
      recap={["Equivalent fractions name the same amount.", "Addition and subtraction need common-sized parts.", "Multiplication and division use different fraction meanings."]}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/80">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_220px]">
          <FractionInput label="Fraction A" value={a} onChange={setA} />
          <FractionInput label="Fraction B" value={b} onChange={setB} />
          <label className="text-sm font-black text-slate-800 dark:text-slate-100">
            Operation
            <select aria-label="Fraction operation" value={operation} onChange={(event) => setOperation(event.target.value as FractionOperation)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
              {Object.entries(operations).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
        </div>

        {output.error ? (
          <div className="mt-4"><InvalidMathStateMessage>{output.error}</InvalidMathStateMessage></div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]" aria-live="polite">
            <div className="space-y-4">
              <FractionBar fraction={a} label="A" color="bg-cyan-400" />
              <FractionBar fraction={b} label="B" color="bg-violet-400" />
              <FractionBar fraction={output.result} label="Result" color="bg-emerald-400" />
            </div>
            <div className="space-y-3">
              <Fact label="Result" value={operation === "compare" ? comparisonText(output.comparison) : `${output.result.numerator}/${output.result.denominator}`} />
              <Fact label="Mixed number" value={operation === "compare" ? "not needed" : fractionToMixed(output.result)} />
              <Fact label="Common denominator" value={operation === "add" || operation === "subtract" ? `${output.commonDenominator}` : "not needed"} />
              <Fact label="Simplest form" value={`${output.result.numerator}/${output.result.denominator}`} />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button key={preset.label} type="button" className="action-secondary" onClick={() => { setA({ numerator: preset.a[0], denominator: preset.a[1] }); setB({ numerator: preset.b[0], denominator: preset.b[1] }); setOperation(preset.op); }}>
              {preset.label}
            </button>
          ))}
        </div>
      </section>
    </NCERTChapterScaffold>
  );
}

function FractionInput({ label, value, onChange }: { label: string; value: Fraction; onChange: (value: Fraction) => void }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 p-3 dark:border-white/10">
      <legend className="px-1 text-sm font-black text-slate-800 dark:text-slate-100">{label}</legend>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input aria-label={`${label} numerator`} type="number" value={value.numerator} onChange={(event) => onChange({ ...value, numerator: Number(event.target.value) })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900" />
        <span className="font-black">/</span>
        <input aria-label={`${label} denominator`} type="number" value={value.denominator} onChange={(event) => onChange({ ...value, denominator: Number(event.target.value) })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900" />
      </div>
    </fieldset>
  );
}

function FractionBar({ fraction, label, color }: { fraction: Fraction; label: string; color: string }) {
  const denominator = Math.min(24, Math.max(1, Math.abs(fraction.denominator)));
  const numerator = Math.min(denominator, Math.max(0, Math.abs(fraction.numerator)));
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900">
      <p className="mb-2 font-black">{label}: {fraction.numerator}/{fraction.denominator}</p>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${denominator}, minmax(0,1fr))` }}>
        {Array.from({ length: denominator }, (_, index) => <span key={index} className={`h-10 rounded-md ${index < numerator ? color : "bg-white dark:bg-slate-950"}`} />)}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function comparisonText(value: number) {
  if (Math.abs(value) < 0.000001) return "A = B";
  return value > 0 ? "A > B" : "A < B";
}
