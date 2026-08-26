import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { factorsOf, formatFactorization, primeFactorization } from "../../../visual-proofs/utils/numberTheoryMath";
import AdapterFrame from "../components/AdapterFrame";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { LessonAdapterProps } from "../types";
import NaturalNumbersTargetLesson57 from "./NaturalNumbersTargetLesson57";
import IntegersTargetLesson59 from "./IntegersTargetLesson59";
import WholeNumbersTargetLesson58 from "./WholeNumbersTargetLesson58";
import RationalNumbersTargetLesson60 from "./RationalNumbersTargetLesson60";
import IrrationalNumbersTargetLesson61 from "./IrrationalNumbersTargetLesson61";
import RealNumbersTargetLesson62 from "./RealNumbersTargetLesson62";
import ComplexNumbersTargetLesson63 from "./ComplexNumbersTargetLesson63";
import PlaceValueTargetLesson64 from "./PlaceValueTargetLesson64";
import FactorsTargetLesson65 from "./FactorsTargetLesson65";
import MultiplesTargetLesson66 from "./MultiplesTargetLesson66";
import PrimeNumbersTargetLesson67 from "./PrimeNumbersTargetLesson67";
import PrimeFactorisationTargetLesson68 from "./PrimeFactorisationTargetLesson68";
import HcfGcdTargetLesson69 from "./HcfGcdTargetLesson69";
import LcmTargetLesson70 from "./LcmTargetLesson70";
import DivisibilityRulesTargetLesson71 from "./DivisibilityRulesTargetLesson71";
import ModularArithmeticTargetLesson72 from "./ModularArithmeticTargetLesson72";
import BaseSystemsTargetLesson73 from "./BaseSystemsTargetLesson73";
import ContinuedFractionsTargetLesson74 from "./ContinuedFractionsTargetLesson74";
import FractionModelsTargetLesson75 from "./FractionModelsTargetLesson75";
import EquivalentFractionsTargetLesson76 from "./EquivalentFractionsTargetLesson76";
import ComparingFractionsTargetLesson77 from "./ComparingFractionsTargetLesson77";
import FractionOperationsTargetLesson78 from "./FractionOperationsTargetLesson78";
import DecimalPlaceValueTargetLesson79 from "./DecimalPlaceValueTargetLesson79";
import DecimalOperationsTargetLesson80 from "./DecimalOperationsTargetLesson80";

export default function NumberLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id === 57) {
    return <NaturalNumbersTargetLesson57 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 58) {
    return <WholeNumbersTargetLesson58 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 59) {
    return <IntegersTargetLesson59 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 60) {
    return <RationalNumbersTargetLesson60 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 61) {
    return <IrrationalNumbersTargetLesson61 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 62) {
    return <RealNumbersTargetLesson62 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 63) {
    return <ComplexNumbersTargetLesson63 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 64) {
    return <PlaceValueTargetLesson64 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 65) {
    return <FactorsTargetLesson65 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 66) {
    return <MultiplesTargetLesson66 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 67) {
    return <PrimeNumbersTargetLesson67 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 68) {
    return <PrimeFactorisationTargetLesson68 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 69) {
    return <HcfGcdTargetLesson69 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 70) {
    return <LcmTargetLesson70 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 71) {
    return <DivisibilityRulesTargetLesson71 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 72) {
    return <ModularArithmeticTargetLesson72 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 73) {
    return <BaseSystemsTargetLesson73 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 74) {
    return <ContinuedFractionsTargetLesson74 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 75) {
    return <FractionModelsTargetLesson75 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 76) {
    return <EquivalentFractionsTargetLesson76 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 77) {
    return <ComparingFractionsTargetLesson77 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 78) {
    return <FractionOperationsTargetLesson78 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 79) {
    return <DecimalPlaceValueTargetLesson79 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 80) {
    return <DecimalOperationsTargetLesson80 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  return <LegacyNumberLessonAdapter lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
}

function LegacyNumberLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const strengthened = getStrengthenedFoundationLesson(lesson.id);
  const [n, setN] = useState(initialN(lesson.id));
  const [m, setM] = useState(initialM(lesson.id));
  const isFraction = /fraction|decimal|ratio|proportion|rate|percentage|change|scale/i.test(`${lesson.topic} ${lesson.title}`);
  const isPercent = lesson.id === 88;
  const range = rangeFor(lesson.id, isFraction);
  const lessonText = comparisonLessonText(lesson.id);

  useEffect(() => { setN(initialN(lesson.id)); setM(initialM(lesson.id)); }, [lesson.id, resetToken]);
  const changeN = (value: number) => { setN(Math.round(value)); onInteraction(); };
  const changeM = (value: number) => { setM(Math.round(value)); onInteraction(); };
  const fraction = isPercent ? Math.min(1, n / 100) : Math.min(1, m / Math.max(1, n));
  const factors = useMemo(() => factorsOf(Math.abs(n) || 1), [n]);
  const factorization = useMemo(() => formatFactorization(primeFactorization(Math.max(2, Math.abs(n)))), [n]);

  if (lesson.id >= 57 && lesson.id <= 91) {
    return <RedesignedNumberTheoryLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  if (lesson.id === 69) {
    return <HcfGcdExperience lessonTitle={lesson.title} n={n} m={m} range={range} changeN={changeN} changeM={changeM} />;
  }

  return (
    <AdapterFrame title={`${lesson.title} manipulative`} value={isPercent ? `${n}%` : isFraction ? `${m}/${n}` : String(n)} footer={strengthened?.interaction.learningPurpose ?? "Uses the existing number-theory utilities for factors, prime factorisation, GCD, and LCM."}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          {isPercent ? <PercentModel percent={n} /> : isFraction ? <FractionModel numerator={m} denominator={n} fraction={fraction} /> : <NumberModel value={n} factors={factors} lessonId={lesson.id} />}
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-cyan-50 p-3 text-sm font-bold text-cyan-900 ring-1 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100 dark:ring-cyan-400/20">
            {lessonText}
          </div>
          <NumberConceptTrace lessonId={lesson.id} n={n} m={m} factors={factors} factorization={factorization} />
          <SliderGroup title="Change the mathematics">
            <SliderControl density="compact" label={isPercent ? "percent" : isFraction ? "denominator" : "number"} value={n} min={range.nMin} max={range.nMax} step={1} onChange={changeN} />
            {!isPercent ? <SliderControl density="compact" label={isFraction ? "numerator" : "compare"} value={m} min={range.mMin} max={range.mMax} step={1} onChange={changeM} /> : null}
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            <Metric label={isPercent ? "fraction" : isFraction ? "decimal" : "classification"} value={isPercent ? `${n}/100` : isFraction ? (m / n).toFixed(3) : classificationFor(lesson.id, n)} />
            <Metric label={isPercent ? "decimal" : isFraction ? "percent" : "compare"} value={isPercent ? (n / 100).toFixed(2) : isFraction ? `${((m / n) * 100).toFixed(1)}%` : compareText(n, m)} />
            <Metric label={isFraction || isPercent ? "parts shown" : "prime factors"} value={isFraction || isPercent ? String(isPercent ? n : Math.min(m, n)) : factorization} />
            <Metric label={isFraction || isPercent ? "whole" : "factor count"} value={isFraction || isPercent ? "1" : String(factors.length)} />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

type NumberRedesignKind =
  | "natural" | "whole" | "integer" | "rational" | "irrational" | "real" | "complex"
  | "place-value" | "factors" | "multiples" | "prime" | "prime-factorisation"
  | "hcf-gcd" | "lcm" | "divisibility" | "modular" | "base-systems" | "continued-fractions"
  | "fraction-models" | "equivalent-fractions" | "comparing-fractions" | "fraction-operations"
  | "decimal-place-value" | "decimal-operations" | "fraction-decimal" | "recurring-decimals"
  | "ratio-models" | "proportion" | "direct-proportion" | "inverse-proportion" | "unit-rates" | "percentages"
  | "percentage-change" | "compound-change" | "scale-drawings";

type NumberRedesignSpec = {
  kind: NumberRedesignKind;
  heading: string;
  badge: string;
  initialValue: number;
  min: number;
  max: number;
  step: number;
  sliderLabel: string;
  valueLabel: (value: number) => string;
  overlay: (value: number) => string;
  lessonText: string;
  guardrail: string;
  table: Array<[string, string]>;
  traceN: (value: number) => number;
  traceM: (value: number) => number;
};

function RedesignedNumberTheoryLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = numberRedesignSpecFor(lesson.id);
  const [value, setValue] = useState(spec.initialValue);
  const [eventLog, setEventLog] = useState(`${lesson.title} model ready.`);

  useEffect(() => {
    setValue(spec.initialValue);
    setEventLog(`${lesson.title} model ready.`);
  }, [lesson.title, resetToken, spec]);

  const changeValue = (nextValue: number) => {
    setValue(nextValue);
    setEventLog(`${spec.sliderLabel} changed to ${nextValue}; classification and visual model updated.`);
    onInteraction();
  };

  const traceN = spec.traceN(value);
  const traceM = spec.traceM(value);
  const factors = factorsOf(Math.max(1, Math.abs(Math.round(traceN))));
  const factorization = formatFactorization(primeFactorization(Math.max(2, Math.abs(Math.round(traceN)))));

  return (
    <AdapterFrame title={`${lesson.title} visual lab`} value={spec.valueLabel(value)} footer="This number-theory page uses the requested mockup as a lesson-specific interactive representation instead of the generic factor model.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_315px]">
        <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/50 to-emerald-50 p-4 shadow-sm dark:border-sky-300/20 dark:from-slate-950 dark:via-sky-300/10 dark:to-emerald-300/10" aria-label={`${lesson.title} redesigned number lab`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-sky-700">Numbers and number theory</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{spec.heading}</h3>
            </div>
            <span className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-black text-sky-800 shadow-sm">{spec.badge}</span>
          </div>
          <div className="mt-4 rounded-3xl bg-slate-950 p-4 text-center font-mono text-2xl font-black text-white shadow-xl sm:text-4xl">{spec.overlay(value)}</div>
          <div className="mt-4">{renderNumberRedesignVisual(spec.kind, value)}</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(240px,.55fr)_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
              <p className="font-black text-slate-950 dark:text-white">{spec.sliderLabel}</p>
              <input aria-label={spec.sliderLabel} type="range" min={spec.min} max={spec.max} step={spec.step} value={value} onChange={(event) => changeValue(Number(event.target.value))} className="mt-4 w-full accent-sky-600" />
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(new Set([spec.min, spec.initialValue, spec.max])).map((preset) => <button key={preset} type="button" className={value === preset ? "rounded-xl bg-sky-600 px-3 py-2 text-xs font-black text-white" : "rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-700"} onClick={() => changeValue(preset)}>{preset}</button>)}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 dark:border-white/10 dark:bg-slate-950/60">
              <p className="px-3 py-2 text-xs font-black uppercase tracking-wide text-sky-700">Membership and comparisons</p>
              {spec.table.map(([label, detail]) => <div key={label} className="grid grid-cols-[140px_1fr] border-t border-slate-100 px-3 py-2 text-sm font-semibold dark:border-white/10"><span className="font-black text-slate-600 dark:text-slate-300">{label}</span><span className="font-mono text-sky-800 dark:text-sky-100">{detail}</span></div>)}
            </div>
          </div>
        </section>
        <aside className="space-y-3">
          <div className="rounded-3xl bg-sky-50 p-4 text-sm font-black leading-6 text-sky-900 ring-1 ring-sky-100">{spec.lessonText}</div>
          <NumberConceptTrace lessonId={lesson.id} n={traceN} m={traceM} factors={factors} factorization={factorization} />
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900">{spec.guardrail}</div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
            <p className="text-[10px] font-black uppercase text-slate-500">Event log</p>
            <p className="mt-2 text-sm font-black text-slate-800 dark:text-slate-100">{eventLog}</p>
          </div>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function numberRedesignSpecFor(lessonId: number): NumberRedesignSpec {
  const specs: Record<number, NumberRedesignSpec> = {
    57: {
      kind: "natural",
      heading: "Count whole objects starting at one",
      badge: "Natural numbers",
      initialValue: 5,
      min: 1,
      max: 10,
      step: 1,
      sliderLabel: "Selected natural number",
      valueLabel: (value) => `${value} is natural`,
      overlay: (value) => `Natural numbers start at 1; selected ${value}`,
      lessonText: "Natural numbers start at 1 in this lesson.",
      guardrail: "Counting whole objects starts at 1. Zero, fractions, and negatives are not natural numbers here.",
      table: [["Included", "1, 5, 6, ..."], ["Not included", "0, 1/2, -3"], ["One more", "5 -> 6"], ["Compare", "5 < 6"]],
      traceN: (value) => value,
      traceM: () => 6,
    },
    58: {
      kind: "whole",
      heading: "Add zero to the counting numbers",
      badge: "W={0,1,2,3,...}",
      initialValue: 0,
      min: 0,
      max: 8,
      step: 1,
      sliderLabel: "Selected whole number",
      valueLabel: (value) => `${value} is whole`,
      overlay: (value) => `Whole numbers include zero; selected ${value}`,
      lessonText: "Whole numbers include zero.",
      guardrail: "Whole numbers include 0 and counting numbers, but not negatives or fractions.",
      table: [["Included", "0, 1, 2, 3, ..."], ["Not included", "-1, 1/2"], ["Empty basket", "0 objects"], ["Compare", "0 < 7"]],
      traceN: (value) => value,
      traceM: () => 7,
    },
    59: {
      kind: "integer",
      heading: "Use sign and direction from zero",
      badge: "Selected -4",
      initialValue: -4,
      min: -10,
      max: 10,
      step: 1,
      sliderLabel: "Selected integer",
      valueLabel: (value) => `${value} integer`,
      overlay: (value) => `${value} on the integer line; ${value}<8`,
      lessonText: "Farther right means greater.",
      guardrail: "A negative number with more digits is not automatically greater. Use its position on the number line.",
      table: [["Selected", "-4"], ["Opposite", "+4"], ["Temperature", "-4°C"], ["Ledger", "debit -4, credit +8"]],
      traceN: (value) => value,
      traceM: () => 8,
    },
    60: {
      kind: "rational",
      heading: "Write the value as a ratio of integers",
      badge: "4/3",
      initialValue: 4,
      min: 1,
      max: 7,
      step: 1,
      sliderLabel: "Numerator a in a/3",
      valueLabel: (value) => `${value}/3`,
      overlay: (value) => `${value}/3 = ${(value / 3).toFixed(3)}...`,
      lessonText: "Rational numbers can be written as a/b.",
      guardrail: "A rational number can be written as a/b, b != 0. Repeating or terminating decimals still count.",
      table: [["Selected", "4/3 = 1 1/3"], ["Decimal", "1.333..."], ["Included", "-2, 0, 1/2, 4/3, 1.25"], ["Not included", "√2"]],
      traceN: (value) => value,
      traceM: () => 3,
    },
    61: {
      kind: "irrational",
      heading: "Recognize exact non-repeating values",
      badge: "√2",
      initialValue: 2,
      min: 2,
      max: 9,
      step: 7,
      sliderLabel: "Radicand check",
      valueLabel: (value) => `sqrt(${value})`,
      overlay: (value) => value === 9 ? "√9 = 3, rational" : "√2 = 1.4142135623...",
      lessonText: "Non-ending, non-repeating decimals are irrational.",
      guardrail: "Rounding is not exact. √2 is between 1.41 and 1.42, but it is not equal to either decimal.",
      table: [["Selected", "√2"], ["Bounds", "1.41 < √2 < 1.42"], ["Reason", "Not a ratio of two integers"], ["Practice", "√9 irrational? no"]],
      traceN: (value) => value,
      traceM: () => 3,
    },
    62: {
      kind: "real",
      heading: "Place rational and irrational values on one line",
      badge: "Real numbers",
      initialValue: -5,
      min: -6,
      max: 12,
      step: 1,
      sliderLabel: "Selected real number",
      valueLabel: (value) => `${value} is real`,
      overlay: (value) => `Real = Rational ∪ Irrational; selected ${value}`,
      lessonText: "Real numbers lie on the number line.",
      guardrail: "Every rational number is real, and irrational values such as √2 and π are real too.",
      table: [["Selected", "-5 is integer, rational, and real"], ["Markers", "-5, 0, 1/2, √2, π, 11"], ["Compare", "-5 < 11"], ["Practice", "Every rational real? yes"]],
      traceN: (value) => value,
      traceM: () => 11,
    },
    63: {
      kind: "complex",
      heading: "Use two axes for a+bi",
      badge: "z=3+2i",
      initialValue: 3,
      min: -4,
      max: 4,
      step: 1,
      sliderLabel: "Real part a",
      valueLabel: (value) => `${value}+2i`,
      overlay: (value) => `z=${value}+2i; conjugate ${value}-2i`,
      lessonText: "Complex numbers use a real part and an imaginary part.",
      guardrail: "The complex plane is not only a line. Real part moves horizontally; imaginary part moves vertically.",
      table: [["Point", "z=3+2i"], ["Conjugate", "3-2i"], ["Modulus", "|z|=√13"], ["Practice", "conjugate of 4+i is 4-i"]],
      traceN: (value) => value,
      traceM: () => 2,
    },
    64: {
      kind: "place-value",
      heading: "Explore place value with exact base-ten blocks",
      badge: "Number: 5381",
      initialValue: 5,
      min: 1,
      max: 8,
      step: 1,
      sliderLabel: "Chosen digit in 5381",
      valueLabel: (value) => `chosen digit ${value}`,
      overlay: () => "5381 = 5000 + 300 + 80 + 1",
      lessonText: "A digit's place changes its value.",
      guardrail: "Watch out: do not read a base-2 or base-5 numeral as ordinary decimal; the base changes each place value. Every digit passed the base check.",
      table: [["Number", "5381"], ["Chosen digit", "5"], ["Digit value", "5 in the thousands place means 5000"], ["Try", "What is the value of 8 in 5381? 80"]],
      traceN: () => 5381,
      traceM: (value) => value,
    },
    65: {
      kind: "factors",
      heading: "Explore factors with the array model",
      badge: "42 counters",
      initialValue: 6,
      min: 1,
      max: 7,
      step: 1,
      sliderLabel: "Candidate factor",
      valueLabel: (value) => `candidate ${value}`,
      overlay: (value) => `42 ÷ ${value} = ${Math.floor(42 / value)} remainder ${42 % value}`,
      lessonText: "Factors divide exactly.",
      guardrail: "A factor divides exactly with no remainder. The prompt's polynomial-factor wording is not used here because this lesson is integer divisibility.",
      table: [["Number", "42"], ["Candidate", "6"], ["Exact result", "42 ÷ 6 = 7 remainder 0"], ["Try", "Is 5 a factor of 42? No."]],
      traceN: () => 42,
      traceM: (value) => value,
    },
    66: {
      kind: "multiples",
      heading: "Multiples on the number line",
      badge: "Exact skip-counting only",
      initialValue: 36,
      min: 9,
      max: 45,
      step: 9,
      sliderLabel: "Candidate multiple",
      valueLabel: (value) => `candidate ${value}`,
      overlay: (value) => `${value} = 9 × ${value / 9}`,
      lessonText: "Multiples are made by multiplying.",
      guardrail: "Do not confuse factors with multiples: multiples are landing points made by equal jumps of the base.",
      table: [["Base", "9"], ["Candidate", "36"], ["Repeated addition", "9 + 9 + 9 + 9 = 36"], ["Try", "Is 38 a multiple of 9? No."]],
      traceN: () => 9,
      traceM: (value) => value,
    },
    67: {
      kind: "prime",
      heading: "Test divisors by grouping counters",
      badge: "Number: 17",
      initialValue: 17,
      min: 1,
      max: 17,
      step: 1,
      sliderLabel: "Divisor scanner",
      valueLabel: (value) => `test ÷ ${value}`,
      overlay: (value) => value === 1 || value === 17 ? `17 ÷ ${value}: no remainder` : `17 ÷ ${value}: remainder left`,
      lessonText: "Prime numbers have exactly two positive factors.",
      guardrail: "1 is not prime because it has only one positive factor.",
      table: [["Number", "17"], ["Factors", "1, 17"], ["Factor count", "2"], ["Try", "Is 18 prime? No."]],
      traceN: () => 17,
      traceM: (value) => value,
    },
    68: {
      kind: "prime-factorisation",
      heading: "Split until every factor is prime",
      badge: "Number: 24",
      initialValue: 3,
      min: 2,
      max: 6,
      step: 1,
      sliderLabel: "Candidate divisor insight",
      valueLabel: (value) => `divisor ${value}`,
      overlay: () => "24 = 2³ × 3",
      lessonText: "Keep splitting until all factors are prime.",
      guardrail: "Keep splitting composite factors; stop only when every leaf is prime.",
      table: [["Split", "24 = 6 × 4"], ["Next", "6 = 2 × 3; 4 = 2 × 2"], ["Prime factors", "2, 2, 2, 3"], ["Try", "What is the prime factorisation of 18?"]],
      traceN: () => 24,
      traceM: (value) => value,
    },
    69: {
      kind: "hcf-gcd",
      heading: "Find greatest shared divisors",
      badge: "HCF = 6",
      initialValue: 6,
      min: 1,
      max: 6,
      step: 1,
      sliderLabel: "Highlighted shared factor",
      valueLabel: () => "HCF 6",
      overlay: () => "Shared factors: 1, 2, 3, 6; HCF = 6",
      lessonText: "HCF is the greatest shared factor.",
      guardrail: "The HCF is the greatest common factor, not just any common factor.",
      table: [["First number", "18"], ["Second number", "24"], ["Overlap", "2 × 3 = 6"], ["Try", "Find the HCF of 12 and 20."]],
      traceN: () => 18,
      traceM: () => 24,
    },
    70: {
      kind: "lcm",
      heading: "Find earliest common multiples",
      badge: "LCM = 24",
      initialValue: 24,
      min: 6,
      max: 48,
      step: 6,
      sliderLabel: "Shared landing candidate",
      valueLabel: () => "LCM 24",
      overlay: () => "First shared landing: 24; LCM = 24",
      lessonText: "LCM is the first shared positive multiple.",
      guardrail: "Do not confuse LCM with HCF/GCD; the first positive shared landing wins.",
      table: [["First number", "6"], ["Second number", "8"], ["Prime ladder", "6=2×3; 8=2³"], ["Try", "Find the LCM of 4 and 10."]],
      traceN: () => 6,
      traceM: () => 8,
    },
    71: {
      kind: "divisibility",
      heading: "Detect divisibility efficiently",
      badge: "Divisor 9",
      initialValue: 9,
      min: 2,
      max: 10,
      step: 1,
      sliderLabel: "Rule selector",
      valueLabel: () => "234 ÷ 9",
      overlay: () => "2 + 3 + 4 = 9; 234 ÷ 9 = 26 remainder 0",
      lessonText: "Use the rule for the chosen divisor only.",
      guardrail: "Check the rule for the chosen divisor only; 235 has digit sum 10, so it is not divisible by 9.",
      table: [["Number", "234"], ["Chosen divisor", "9"], ["Decision", "234 is divisible by 9"], ["Try", "Is 342 divisible by 9?"]],
      traceN: () => 234,
      traceM: () => 9,
    },
    72: {
      kind: "modular",
      heading: "Explore remainders and cycles",
      badge: "23 mod 7 = 2",
      initialValue: 23,
      min: 0,
      max: 31,
      step: 1,
      sliderLabel: "Dividend steps",
      valueLabel: () => "remainder 2",
      overlay: () => "23 = 3 × 7 + 2; remainder 2",
      lessonText: "Keep the remainder, not the quotient.",
      guardrail: "Modulo keeps the remainder, not the quotient. Three full cycles plus two steps.",
      table: [["Dividend", "23"], ["Modulus", "7"], ["Quotient", "3"], ["Try", "What is 31 mod 5?"]],
      traceN: () => 23,
      traceM: () => 7,
    },
    73: {
      kind: "base-systems",
      heading: "Understand alternate representations",
      badge: "110₂ = 6₁₀",
      initialValue: 2,
      min: 2,
      max: 5,
      step: 1,
      sliderLabel: "Base selector",
      valueLabel: () => "base 2",
      overlay: () => "1×4 + 1×2 + 0×1; 4 + 2 + 0 = 6",
      lessonText: "Digits must be allowed in the chosen base.",
      guardrail: "Every digit must be less than the base. Do not treat 110₂ as decimal one hundred ten.",
      table: [["Number", "110"], ["Base", "2"], ["Allowed digits", "0 and 1"], ["Try", "Convert 101₂ to decimal."]],
      traceN: () => 110,
      traceM: () => 2,
    },
    74: {
      kind: "continued-fractions",
      heading: "Explore nested fraction representations",
      badge: "[1; 2, 3]",
      initialValue: 3,
      min: 1,
      max: 4,
      step: 1,
      sliderLabel: "Active layer",
      valueLabel: () => "10/7",
      overlay: () => "1 + 1/(2 + 1/3) = 10/7 ≈ 1.429",
      lessonText: "Evaluate nested fractions from inside outward.",
      guardrail: "Do not stop at 3/2; [1;2,3] evaluates all the way to 10/7.",
      table: [["Expression", "1 + 1/(2 + 1/3)"], ["Middle", "2 + 1/3 = 7/3"], ["Final", "1 + 3/7 = 10/7"], ["Try", "Evaluate [2; 1, 4]."]],
      traceN: () => 2,
      traceM: () => 3,
    },
    75: {
      kind: "fraction-models",
      heading: "Build visual fraction meaning",
      badge: "3/4",
      initialValue: 3,
      min: 1,
      max: 4,
      step: 1,
      sliderLabel: "Numerator",
      valueLabel: () => "3/4",
      overlay: () => "3 of 4 equal parts; 3/4 = 0.75 = 75%",
      lessonText: "Fraction models show selected parts of one whole.",
      guardrail: "The parts must be equal-sized pieces of the same whole.",
      table: [["Area model", "3 of 4 parts"], ["Set model", "9 of 12"], ["Number line", "0.75"], ["Try", "Model 2/5 in three ways."]],
      traceN: () => 4,
      traceM: () => 3,
    },
    76: {
      kind: "equivalent-fractions",
      heading: "Understand scaling equivalence",
      badge: "3/4 = 6/8",
      initialValue: 2,
      min: 1,
      max: 4,
      step: 1,
      sliderLabel: "Scale factor",
      valueLabel: () => "scale 2",
      overlay: () => "3 × 2 = 6; 4 × 2 = 8",
      lessonText: "Scale numerator and denominator by the same non-zero factor.",
      guardrail: "Same value, more equal parts. Do not change only the numerator.",
      table: [["Original", "3/4"], ["Scale by", "2"], ["Equivalent", "6/8"], ["Try", "Make an equivalent fraction for 2/5."]],
      traceN: () => 3,
      traceM: () => 4,
    },
    77: {
      kind: "comparing-fractions",
      heading: "Compare quantities accurately",
      badge: "3/4 > 4/7",
      initialValue: 28,
      min: 7,
      max: 28,
      step: 7,
      sliderLabel: "Common denominator",
      valueLabel: () => "28ths",
      overlay: () => "3/4 = 21/28; 4/7 = 16/28",
      lessonText: "Compare fractions using common units.",
      guardrail: "Use the same whole and common units; do not compare numerators alone.",
      table: [["Fraction A", "3/4"], ["Fraction B", "4/7"], ["Decision", "21/28 > 16/28"], ["Try", "Compare 5/6 and 7/9."]],
      traceN: () => 3,
      traceM: () => 4,
    },
    78: {
      kind: "fraction-operations",
      heading: "Understand arithmetic procedures",
      badge: "Result 5/6",
      initialValue: 6,
      min: 2,
      max: 12,
      step: 1,
      sliderLabel: "Common denominator",
      valueLabel: () => "5/6",
      overlay: () => "1/2 + 1/3 = 3/6 + 2/6 = 5/6",
      lessonText: "Common denominators are needed for addition and subtraction.",
      guardrail: "Do not add denominators directly.",
      table: [["Add", "1/2 + 1/3"], ["Convert", "1/2=3/6; 1/3=2/6"], ["Result", "5/6"], ["Try", "Add 2/5 + 1/10."]],
      traceN: () => 2,
      traceM: () => 3,
    },
    79: {
      kind: "decimal-place-value",
      heading: "Understand decimal positions",
      badge: "0.50 > 0.47",
      initialValue: 50,
      min: 40,
      max: 55,
      step: 1,
      sliderLabel: "Hundredths marker",
      valueLabel: () => "0.50",
      overlay: () => "Tenths: 5 > 4; 0.50 > 0.47",
      lessonText: "Trailing zeros can help compare decimals.",
      guardrail: "Compare tenths before hundredths; do not decide by counting digits.",
      table: [["First decimal", "0.50"], ["Second decimal", "0.47"], ["Align", "0 | 5 | 0 and 0 | 4 | 7"], ["Try", "Compare 0.6 and 0.58."]],
      traceN: () => 50,
      traceM: () => 47,
    },
    80: {
      kind: "decimal-operations",
      heading: "Calculate with decimals",
      badge: "4.65",
      initialValue: 465,
      min: 0,
      max: 999,
      step: 1,
      sliderLabel: "Result check",
      valueLabel: () => "4.65",
      overlay: () => "3.40 + 1.25 = 4.65",
      lessonText: "Line up decimal points for addition and subtraction.",
      guardrail: "Decimal points must stay aligned.",
      table: [["Add", "3.40 + 1.25"], ["Column sum", "4.65"], ["Blocks", "4 wholes, 6 tenths, 5 hundredths"], ["Try", "Add 2.75 + 0.6."]],
      traceN: () => 34,
      traceM: () => 125,
    },
    81: {
      kind: "fraction-decimal",
      heading: "Connect representations",
      badge: "3/4 = 0.75",
      initialValue: 75,
      min: 0,
      max: 100,
      step: 1,
      sliderLabel: "Hundredths shaded",
      valueLabel: () => "75%",
      overlay: () => "3 ÷ 4 = 0.75; 0.75 = 75%",
      lessonText: "Divide numerator by denominator to get decimal form.",
      guardrail: "The value stays the same across fraction, decimal, and percent forms.",
      table: [["Fraction", "3/4"], ["Division", "3 ÷ 4 = 0.75"], ["Hundredths", "75 of 100"], ["Try", "Convert 7/8 to a decimal."]],
      traceN: () => 3,
      traceM: () => 4,
    },
    82: {
      kind: "recurring-decimals",
      heading: "Understand repeating patterns",
      badge: "0.333...",
      initialValue: 3,
      min: 1,
      max: 9,
      step: 1,
      sliderLabel: "Repeating digit",
      valueLabel: () => "1/3",
      overlay: () => "1 ÷ 3 = 0.333...; remainder repeats: 1",
      lessonText: "A repeating remainder creates a recurring decimal.",
      guardrail: "Rounded display is not the exact value.",
      table: [["Fraction", "1/3"], ["Repeating digit", "3"], ["Exact form", "0.333..."], ["Try", "Convert 2/3."]],
      traceN: () => 3,
      traceM: () => 9,
    },
    83: {
      kind: "ratio-models",
      heading: "Compare quantities multiplicatively",
      badge: "2 : 3",
      initialValue: 2,
      min: 1,
      max: 4,
      step: 1,
      sliderLabel: "Scale factor",
      valueLabel: () => "4:6",
      overlay: () => "Blue : Red = 2 : 3; 2 : 3 = 4 : 6",
      lessonText: "Ratio order matters.",
      guardrail: "Part-to-part is different from part-to-whole.",
      table: [["Blue : Red", "2 : 3"], ["Total parts", "5"], ["Scale factor", "2"], ["Try", "Model 3:5."]],
      traceN: () => 2,
      traceM: () => 3,
    },
    84: {
      kind: "proportion",
      heading: "Solve equivalent-ratio problems",
      badge: "x = 27",
      initialValue: 3,
      min: 1,
      max: 5,
      step: 1,
      sliderLabel: "Scale factor",
      valueLabel: () => "x=27",
      overlay: () => "2 : 9 = 6 : x; x = 27",
      lessonText: "Both ratios must scale by the same factor.",
      guardrail: "Both parts must scale by the same factor.",
      table: [["Scale factor", "3"], ["2 × 3", "6"], ["9 × 3", "27"], ["Try", "Solve 4/7 = 12/x."]],
      traceN: () => 2,
      traceM: () => 9,
    },
    85: {
      kind: "direct-proportion",
      heading: "Understand constant ratios",
      badge: "y = 30x",
      initialValue: 3,
      min: 1,
      max: 4,
      step: 1,
      sliderLabel: "Quantity x",
      valueLabel: () => "3 items",
      overlay: () => "3 items cost 90; y/x = 30",
      lessonText: "Direct proportion has form y = kx.",
      guardrail: "Direct proportion keeps y/x constant and the graph passes through the origin.",
      table: [["Equation", "y = 30x"], ["Unit rate", "30"], ["Point", "(3,90)"], ["Try", "If y = 12x, find y when x = 5."]],
      traceN: () => 3,
      traceM: () => 90,
    },
    86: {
      kind: "inverse-proportion",
      heading: "Understand reciprocal relationships",
      badge: "xy = 24",
      initialValue: 8,
      min: 1,
      max: 8,
      step: 1,
      sliderLabel: "Workers",
      valueLabel: () => "8 workers",
      overlay: () => "8 workers need 3 days; y = 24/x",
      lessonText: "Inverse proportion has constant product.",
      guardrail: "As one value increases, the other decreases; inverse proportion keeps xy constant.",
      table: [["Constant product", "24"], ["3 workers", "8 days"], ["8 workers", "3 days"], ["Try", "If xy = 36, find y when x = 9."]],
      traceN: () => 24,
      traceM: () => 8,
    },
    87: {
      kind: "unit-rates",
      heading: "Compare per-unit quantities",
      badge: "60 per kg",
      initialValue: 5,
      min: 1,
      max: 9,
      step: 1,
      sliderLabel: "Kilograms",
      valueLabel: () => "5 kg",
      overlay: () => "300 ÷ 5 = 60; unit rate 60 per kg",
      lessonText: "Divide by the number of units to find per one.",
      guardrail: "Per one means for exactly 1 unit.",
      table: [["Total cost", "300"], ["Units", "5 kg"], ["Unit rate", "60 per kg"], ["Try", "450 rupees for 9 kg."]],
      traceN: () => 300,
      traceM: () => 5,
    },
    88: {
      kind: "percentages",
      heading: "Unify fraction-decimal-percentage forms",
      badge: "25%",
      initialValue: 25,
      min: 0,
      max: 100,
      step: 1,
      sliderLabel: "Percent",
      valueLabel: () => "25%",
      overlay: () => "25% = 25/100 = 1/4 = 0.25",
      lessonText: "Percent means out of 100.",
      guardrail: "Divide by 100 to get decimal form.",
      table: [["Hundred grid", "25 shaded squares"], ["Equivalent", "25/100 = 1/4"], ["Part of amount", "25% of 80 = 20"], ["Try", "Find 40% of 60."]],
      traceN: () => 25,
      traceM: () => 0,
    },
    89: {
      kind: "percentage-change",
      heading: "Model increase and decrease",
      badge: "25% increase",
      initialValue: 80,
      min: 40,
      max: 120,
      step: 5,
      sliderLabel: "Original amount",
      valueLabel: () => "80 to 100",
      overlay: () => "20/80 × 100 = 25%",
      lessonText: "Use original amount as the base.",
      guardrail: "Do not divide by the new amount. Percentage change uses the original amount as the base.",
      table: [["Original amount", "80"], ["New amount", "100"], ["Change", "20"], ["Try", "From 50 to 65."]],
      traceN: () => 80,
      traceM: () => 100,
    },
    90: {
      kind: "compound-change",
      heading: "Understand repeated percentage effects",
      badge: "Compound total: 21%",
      initialValue: 10,
      min: 5,
      max: 20,
      step: 5,
      sliderLabel: "Repeated percent increase",
      valueLabel: () => "+10%, two stages",
      overlay: () => "100 × (1.10)² = 121",
      lessonText: "Apply each percent change to the latest amount.",
      guardrail: "Not 20%. Each stage uses the latest amount, so the second 10% is taken from 110.",
      table: [["Start", "100"], ["Rate", "+10%"], ["After stage 1", "110"], ["After stage 2", "121"]],
      traceN: () => 100,
      traceM: () => 10,
    },
    91: {
      kind: "scale-drawings",
      heading: "Apply proportional reasoning",
      badge: "Real length: 20 km",
      initialValue: 4,
      min: 1,
      max: 8,
      step: 1,
      sliderLabel: "Map length in cm",
      valueLabel: () => "4 cm maps to 20 km",
      overlay: () => "4 cm × 5 km/cm = 20 km",
      lessonText: "Scale every length by the same factor.",
      guardrail: "Measure on the drawing. Convert to real distance using the same scale for every length.",
      table: [["Map length", "4 cm"], ["Scale", "1 cm : 5 km"], ["Real length", "20 km"], ["Try", "6 cm at 1 cm : 5 km."]],
      traceN: () => 4,
      traceM: () => 5,
    },
  };
  return specs[lessonId] ?? specs[57];
}

function renderNumberRedesignVisual(kind: NumberRedesignKind, value: number) {
  if (kind === "natural") return <NaturalNumberSetVisual value={value} />;
  if (kind === "whole") return <WholeNumberSetVisual value={value} />;
  if (kind === "integer") return <IntegerLineVisual value={value} />;
  if (kind === "rational") return <RationalNumberVisual numerator={value} />;
  if (kind === "irrational") return <IrrationalNumberVisual radicand={value} />;
  if (kind === "real") return <RealNumberVisual value={value} />;
  if (kind === "complex") return <ComplexNumberVisual real={value} />;
  if (kind === "place-value") return <PlaceValueVisual selectedDigit={value} />;
  if (kind === "factors") return <FactorsVisual candidate={value} />;
  if (kind === "multiples") return <MultiplesVisual candidate={value} />;
  if (kind === "prime") return <PrimeNumberVisual divisor={value} />;
  if (kind === "prime-factorisation") return <PrimeFactorisationVisual divisor={value} />;
  if (kind === "hcf-gcd") return <HcfGcdRedesignVisual />;
  if (kind === "lcm") return <LcmRedesignVisual />;
  if (kind === "divisibility") return <DivisibilityRulesVisual />;
  if (kind === "modular") return <ModularArithmeticVisual />;
  if (kind === "base-systems") return <BaseSystemsVisual />;
  if (kind === "continued-fractions") return <ContinuedFractionsVisual />;
  if (kind === "fraction-models") return <FractionModelsRedesignVisual />;
  if (kind === "equivalent-fractions") return <EquivalentFractionsVisual />;
  if (kind === "comparing-fractions") return <ComparingFractionsVisual />;
  if (kind === "fraction-operations") return <FractionOperationsVisual />;
  if (kind === "decimal-place-value") return <DecimalPlaceValueVisual />;
  if (kind === "decimal-operations") return <DecimalOperationsVisual />;
  if (kind === "fraction-decimal") return <FractionDecimalConversionVisual />;
  if (kind === "recurring-decimals") return <RecurringDecimalsVisual />;
  if (kind === "ratio-models") return <RatioModelsVisual />;
  if (kind === "proportion") return <ProportionVisual />;
  if (kind === "direct-proportion") return <DirectProportionVisual />;
  if (kind === "inverse-proportion") return <InverseProportionVisual />;
  if (kind === "unit-rates") return <UnitRatesVisual />;
  if (kind === "percentage-change") return <PercentageChangeVisual />;
  if (kind === "compound-change") return <CompoundChangeVisual />;
  if (kind === "scale-drawings") return <ScaleDrawingsVisual />;
  return <PercentagesVisual percent={value} />;
}

function NaturalNumberSetVisual({ value }: { value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap gap-2">{Array.from({ length: value }, (_, index) => <span key={index} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 font-mono font-black text-white">{index + 1}</span>)}</div>
      <div className="relative mt-8 h-20">
        <div className="absolute left-4 right-4 top-8 h-1 bg-slate-700" />
        {Array.from({ length: 10 }, (_, index) => index + 1).map((tick) => <span key={tick} className={tick === value ? "absolute top-1 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-sky-600 font-mono font-black text-white" : "absolute top-11 -translate-x-1/2 font-mono text-sm font-black"} style={{ left: `${(tick - 1) * 10 + 5}%` }}>{tick}</span>)}
      </div>
    </div>
  );
}

function WholeNumberSetVisual({ value }: { value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <p className="rounded-2xl bg-sky-50 p-4 text-center text-2xl font-black text-sky-900">W = {"{0,1,2,3,...}"}</p>
      <div className="mt-4 grid grid-cols-6 gap-2">
        {Array.from({ length: 6 }, (_, index) => <div key={index} className={index === value ? "rounded-2xl border-2 border-sky-500 bg-sky-50 p-4 text-center font-mono text-2xl font-black" : "rounded-2xl border border-slate-200 bg-white p-4 text-center font-mono text-2xl font-black"}>{index}</div>)}
      </div>
      <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-center font-black text-emerald-900">Empty basket: 0 objects</p>
    </div>
  );
}

function IntegerLineVisual({ value }: { value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="relative h-28">
        <div className="absolute left-4 right-4 top-12 h-1 bg-slate-700" />
        {[-10, -5, 0, 5, 10].map((tick) => <span key={tick} className="absolute top-16 -translate-x-1/2 font-mono text-sm font-black" style={{ left: `${((tick + 10) / 20) * 100}%` }}>{tick}</span>)}
        <span className="absolute top-4 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-rose-500 font-mono font-black text-white" style={{ left: `${((value + 10) / 20) * 100}%` }}>{value}</span>
        <span className="absolute top-4 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500 font-mono font-black text-white" style={{ left: `${((-value + 10) / 20) * 100}%` }}>{-value}</span>
      </div>
      <p className="rounded-2xl bg-rose-50 p-3 text-center font-black text-rose-900">{Math.abs(value)} steps left of zero; opposite +{Math.abs(value)}; {value} &lt; 8</p>
    </div>
  );
}

function RationalNumberVisual({ numerator }: { numerator: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-mono text-3xl font-black text-sky-900">{numerator}/3 = 1 1/3</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, index) => <span key={index} className={index < numerator ? "h-16 rounded-xl bg-sky-500" : "h-16 rounded-xl bg-slate-100 ring-1 ring-slate-200"} />)}
        </div>
        <p className="mt-3 text-sm font-black text-slate-700">One whole plus 1/3; decimal 1.333...</p>
      </div>
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="font-black text-emerald-900">Number line thirds</p>
        <div className="relative mt-8 h-16">
          <div className="absolute left-3 right-3 top-6 h-1 bg-slate-700" />
          <span className="absolute top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-emerald-600 text-center font-mono font-black leading-10 text-white" style={{ left: `${(numerator / 6) * 100}%` }}>{numerator}/3</span>
        </div>
      </div>
    </div>
  );
}

function IrrationalNumberVisual({ radicand }: { radicand: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <svg viewBox="0 0 260 220" className="w-full" role="img" aria-label="Unit square with diagonal square root 2">
          <rect x="48" y="48" width="120" height="120" fill="#dbeafe" stroke="#2563eb" strokeWidth="4" />
          <line x1="48" y1="168" x2="168" y2="48" stroke="#7c3aed" strokeWidth="5" />
          <text x="88" y="38" fontWeight="900">unit square</text>
          <text x="176" y="98" fill="#7c3aed" fontWeight="900">√2</text>
        </svg>
      </div>
      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
        <p className="font-mono text-2xl font-black text-violet-900">{radicand === 9 ? "√9 = 3" : "√2 = 1.4142135623..."}</p>
        <p className="mt-3 rounded-2xl bg-white p-3 font-black">1.41 &lt; √2 &lt; 1.42</p>
        <p className="mt-3 text-sm font-black text-violet-900">No repeating block.</p>
      </div>
    </div>
  );
}

function RealNumberVisual({ value }: { value: number }) {
  const markers = ["-5", "0", "1/2", "√2", "π", "11"];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="grid gap-2 md:grid-cols-5">
        {["Natural", "Whole", "Integers", "Rational", "Irrational"].map((set) => <span key={set} className="rounded-2xl bg-sky-50 p-3 text-center font-black text-sky-900">{set}</span>)}
      </div>
      <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-center font-mono text-xl font-black text-emerald-900">Real = Rational ∪ Irrational</p>
      <div className="relative mt-8 h-24">
        <div className="absolute left-4 right-4 top-9 h-1 bg-slate-700" />
        {markers.map((marker, index) => <span key={marker} className={marker === String(value) ? "absolute top-0 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-2 font-mono font-black text-white" : "absolute top-12 -translate-x-1/2 font-mono text-sm font-black"} style={{ left: `${8 + index * 17}%` }}>{marker}</span>)}
      </div>
    </div>
  );
}

function ComplexNumberVisual({ real }: { real: number }) {
  const x = 145 + real * 28;
  const y = 120 - 2 * 28;
  const cy = 120 + 2 * 28;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <svg viewBox="0 0 300 250" className="w-full" role="img" aria-label={`Complex point ${real}+2i`}>
          <line x1="20" y1="120" x2="280" y2="120" stroke="#334155" /><line x1="145" y1="225" x2="145" y2="25" stroke="#334155" />
          <line x1="145" y1="120" x2={x} y2="120" stroke="#38bdf8" strokeWidth="4" />
          <line x1={x} y1="120" x2={x} y2={y} stroke="#38bdf8" strokeWidth="4" />
          <line x1="145" y1="120" x2={x} y2={y} stroke="#2563eb" strokeWidth="5" />
          <line x1="145" y1="120" x2={x} y2={cy} stroke="#a855f7" strokeWidth="4" strokeDasharray="6 5" />
          <circle cx={x} cy={y} r="8" fill="#2563eb" /><circle cx={x} cy={cy} r="7" fill="#a855f7" />
          <text x={x + 8} y={y - 8} fontWeight="900" fill="#2563eb">z={real}+2i</text>
          <text x={x + 8} y={cy + 18} fontWeight="900" fill="#7c3aed">{real}-2i</text>
          <text x="232" y="138" fontWeight="900">Real</text><text x="152" y="36" fontWeight="900">Imaginary</text>
        </svg>
      </div>
      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
        <p className="font-mono text-2xl font-black text-violet-900">z={real}+2i</p>
        <p className="mt-3 rounded-2xl bg-white p-3 font-mono font-black">conjugate {real}-2i</p>
        <p className="mt-3 rounded-2xl bg-white p-3 font-mono font-black">|z|=√13</p>
        <p className="mt-3 rounded-2xl bg-white p-3 font-mono font-black">argument θ</p>
      </div>
    </div>
  );
}

function PlaceValueVisual({ selectedDigit }: { selectedDigit: number }) {
  const columns = [
    { label: "Thousands", digit: 5, color: "bg-cyan-500", text: "text-cyan-800", blocks: Array.from({ length: 5 }, (_, index) => <ThousandCube key={index} />) },
    { label: "Hundreds", digit: 3, color: "bg-blue-500", text: "text-blue-800", blocks: Array.from({ length: 3 }, (_, index) => <HundredFlat key={index} />) },
    { label: "Tens", digit: 8, color: "bg-violet-500", text: "text-violet-800", blocks: Array.from({ length: 8 }, (_, index) => <TenRod key={index} />) },
    { label: "Ones", digit: 1, color: "bg-amber-500", text: "text-amber-800", blocks: [<OneCube key="one" />] },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <section key={column.label} className={selectedDigit === column.digit ? "rounded-3xl border-2 border-cyan-400 bg-cyan-50/60 p-3 text-center" : "rounded-3xl border border-slate-200 bg-white p-3 text-center"}>
            <p className={`font-black ${column.text}`}>{column.label}</p>
            <span className={`mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white font-mono text-2xl font-black shadow ${column.text}`}>{column.digit}</span>
            <div className={column.label === "Tens" ? "mx-auto mt-5 grid max-w-[130px] grid-cols-4 gap-2" : "mt-5 flex min-h-[260px] flex-col items-center justify-center gap-3"}>{column.blocks}</div>
          </section>
        ))}
      </div>
      <div className="space-y-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-black text-slate-500">Number:</p>
          <p className="font-mono text-5xl font-black text-slate-950">5381</p>
        </div>
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="font-black text-cyan-900">Chosen digit: 5</p>
          <p className="mt-2 text-lg font-black text-cyan-900">5 in the thousands place means 5000</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 font-mono font-black">5381 = <span className="text-cyan-700">5000</span> + <span className="text-blue-700">300</span> + <span className="text-violet-700">80</span> + <span className="text-amber-700">1</span></div>
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 font-black text-emerald-900">1 thousand equals 10 hundreds</div>
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 font-black text-cyan-900">Try: What is the value of 8 in 5381? 80</div>
      </div>
    </div>
  );
}

function ThousandCube() {
  return <span className="block h-16 w-20 rounded-lg bg-cyan-500 shadow-md ring-1 ring-cyan-700 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:8px_8px]" aria-hidden="true" />;
}

function HundredFlat() {
  return <span className="block h-16 w-24 rounded-lg bg-blue-500 shadow-md ring-1 ring-blue-700 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:8px_8px]" aria-hidden="true" />;
}

function TenRod() {
  return <span className="block h-24 w-5 rounded-md bg-violet-500 shadow-sm ring-1 ring-violet-700 [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:100%_9px]" aria-hidden="true" />;
}

function OneCube() {
  return <span className="block h-5 w-5 rounded bg-amber-500 shadow ring-1 ring-amber-700" aria-hidden="true" />;
}

function FactorsVisual({ candidate }: { candidate: number }) {
  const quotient = Math.floor(42 / candidate);
  const remainder = 42 % candidate;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">Array model: 42 counters</p>
        <div className="mt-4 grid justify-center gap-3" style={{ gridTemplateColumns: "repeat(7, 1.75rem)" }} aria-label="42 counters arranged as 6 rows by 7 columns">
          {Array.from({ length: 42 }, (_, index) => <span key={index} className="h-7 w-7 rounded-full bg-teal-500 shadow-sm" />)}
        </div>
        <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-center font-black text-emerald-900">6 rows × 7 columns = 42</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {["1×42", "2×21", "3×14", "6×7"].map((pair) => <span key={pair} className={pair === "6×7" ? "rounded-2xl border-2 border-blue-500 bg-blue-50 p-3 text-center font-mono font-black text-blue-900" : "rounded-2xl border border-blue-200 bg-white p-3 text-center font-mono font-black text-blue-900"}>{pair}</span>)}
        </div>
        <p className="mt-3 rounded-2xl bg-blue-50 p-3 text-center font-black text-blue-900">Factor pairs: 1×42, 2×21, 3×14, 6×7</p>
      </section>
      <aside className="space-y-3">
        <div className={remainder === 0 ? "rounded-3xl border border-emerald-200 bg-emerald-50 p-4" : "rounded-3xl border border-amber-200 bg-amber-50 p-4"}>
          <p className="font-mono text-2xl font-black">{`42 ÷ ${candidate} = ${quotient} remainder ${remainder}`}</p>
          <p className="mt-2 font-black">{remainder === 0 ? `${candidate} is a factor of 42` : "Not a factor. There is a remainder."}</p>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-black text-amber-900">Try: Is 5 a factor of 42? No.</p>
          <p className="mt-2 font-mono font-black">42 ÷ 5 = 8 remainder 2</p>
          <div className="mt-3 flex gap-1">{Array.from({ length: 10 }, (_, index) => <span key={index} className={index >= 8 ? "h-5 w-5 rounded-full bg-orange-400" : "h-5 w-5 rounded-full bg-teal-500"} />)}</div>
        </div>
      </aside>
    </div>
  );
}

function MultiplesVisual({ candidate }: { candidate: number }) {
  const multiples = [9, 18, 27, 36, 45];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <p className="font-black">9, 18, 27, 36, 45</p>
      <svg viewBox="0 0 680 180" className="mt-2 w-full" role="img" aria-label="Number line with equal jumps of 9 from 0 to 45">
        <line x1="40" y1="110" x2="640" y2="110" stroke="#0f172a" strokeWidth="3" />
        {[0, ...multiples].map((tick) => {
          const x = 40 + (tick / 45) * 600;
          return <g key={tick}><circle cx={x} cy="110" r={tick === candidate ? 10 : 6} fill={tick === candidate ? "#16a34a" : "#0891b2"} stroke={tick === candidate ? "#14532d" : "none"} strokeWidth="4" /><text x={x} y="142" textAnchor="middle" fontWeight="900">{tick}</text></g>;
        })}
        {multiples.map((tick, index) => {
          const start = 40 + ((tick - 9) / 45) * 600;
          const end = 40 + (tick / 45) * 600;
          const mid = (start + end) / 2;
          return <g key={`arc-${tick}`}><path d={`M ${start} 106 Q ${mid} ${30 + (index % 2) * 4} ${end} 106`} fill="none" stroke="#0891b2" strokeWidth="4" /><text x={mid} y="34" textAnchor="middle" fontWeight="900" fill="#0e7490">+9</text></g>;
        })}
      </svg>
      <p className="rounded-2xl bg-cyan-50 p-3 text-center font-black text-cyan-900">4 jumps of 9</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {multiples.map((multiple, index) => <span key={multiple} className={multiple === candidate ? "rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-3 text-center font-mono font-black text-emerald-900" : "rounded-2xl border border-blue-200 bg-white p-3 text-center font-mono font-black text-blue-900"}>9 × {index + 1}<br />= {multiple}</span>)}
      </div>
      <p className="mt-4 rounded-2xl bg-blue-50 p-4 text-center font-mono text-2xl font-black text-blue-900">9 + 9 + 9 + 9 = 36</p>
      <p className="mt-3 rounded-2xl bg-amber-50 p-3 font-black text-amber-900">38 is between 36 and 45, so it is not reached by equal jumps of 9.</p>
    </div>
  );
}

function PrimeNumberVisual({ divisor }: { divisor: number }) {
  const exact = divisor === 1 || divisor === 17;
  const scanner = Array.from({ length: 17 }, (_, index) => index + 1);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">Divisor scanner</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {scanner.map((item) => <span key={item} className={item === 1 || item === 17 ? "flex h-9 min-w-9 items-center justify-center rounded-xl bg-green-600 px-2 font-mono font-black text-white" : "flex h-9 min-w-9 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-2 font-mono font-black text-amber-800"}>{item}</span>)}
        </div>
        <div className={exact ? "mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3" : "mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3"}>
          <p className="font-mono text-xl font-black">÷ {divisor}</p>
          <div className="mt-3 flex flex-wrap gap-1">{Array.from({ length: 17 }, (_, index) => <span key={index} className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">1</span>)}</div>
          <p className="mt-2 font-black">{exact ? "No remainder" : `Remainder ${17 % divisor}`}</p>
        </div>
        <p className="mt-3 rounded-2xl bg-blue-50 p-3 font-black text-blue-900">Only 1 and 17 divide 17 exactly with no remainder.</p>
      </section>
      <aside className="space-y-3">
        <div className="rounded-3xl bg-blue-600 p-5 text-center font-mono text-5xl font-black text-white">17</div>
        <div className="rounded-3xl border border-green-200 bg-green-50 p-4 font-black text-green-900">Factors: 1, 17<br />Factor count: 2<br />17 is prime</div>
        <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 font-black text-violet-900">Try: Is 18 prime? No.<br />Factors of 18: 1, 2, 3, 6, 9, 18</div>
      </aside>
    </div>
  );
}

function PrimeFactorisationVisual({ divisor }: { divisor: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="rounded-2xl bg-cyan-50 p-3 text-center font-black text-cyan-900">Keep splitting until every factor is prime.</p>
        <svg viewBox="0 0 620 360" className="mt-2 w-full" role="img" aria-label="Factor tree for 24 splitting into 6 times 4, then prime leaves 2 3 2 2">
          <TreeNode x={310} y={45} label="24" large />
          <line x1="310" y1="75" x2="190" y2="140" stroke="#0ea5e9" strokeWidth="4" /><line x1="310" y1="75" x2="430" y2="140" stroke="#0ea5e9" strokeWidth="4" />
          <TreeNode x={190} y={155} label="6" /><TreeNode x={430} y={155} label="4" />
          <line x1="190" y1="180" x2="120" y2="245" stroke="#0ea5e9" strokeWidth="4" /><line x1="190" y1="180" x2="260" y2="245" stroke="#0ea5e9" strokeWidth="4" />
          <line x1="430" y1="180" x2="360" y2="245" stroke="#0ea5e9" strokeWidth="4" /><line x1="430" y1="180" x2="500" y2="245" stroke="#0ea5e9" strokeWidth="4" />
          <TreeNode x={120} y={265} label="2" prime /><TreeNode x={260} y={265} label="3" prime /><TreeNode x={360} y={265} label="2" prime /><TreeNode x={500} y={265} label="2" prime />
          <text x="305" y="154" textAnchor="middle" fontSize="28" fontWeight="900">×</text>
          <text x="190" y="250" textAnchor="middle" fontSize="28" fontWeight="900">×</text>
          <text x="430" y="250" textAnchor="middle" fontSize="28" fontWeight="900">×</text>
        </svg>
        <p className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center font-mono text-3xl font-black text-violet-900">2 × 2 × 2 × 3 = 2³ × 3</p>
        <p className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-center font-mono text-xl font-black text-cyan-900">Rebuild check: 2 × 2 × 2 × 3 = 24</p>
      </section>
      <aside className="space-y-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-4xl font-black text-cyan-800">Number: 24</p>
          {["24 = 6 × 4", "6 = 2 × 3", "4 = 2 × 2"].map((step, index) => <p key={step} className="mt-3 font-mono font-black">{index + 1}. {step}</p>)}
        </div>
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 font-black text-emerald-900">Prime factors: 2, 2, 2, 3</div>
        <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 font-black text-violet-900">Candidate divisor: {divisor}<br />3 is used once in the prime factorisation of 24.</div>
      </aside>
    </div>
  );
}

function TreeNode({ x, y, label, large = false, prime = false }: { x: number; y: number; label: string; large?: boolean; prime?: boolean }) {
  return (
    <g>
      <rect x={x - (large ? 46 : 32)} y={y - 24} width={large ? 92 : 64} height="48" rx="10" fill={prime ? "#dcfce7" : "white"} stroke={prime ? "#22c55e" : "#0284c7"} strokeWidth="3" />
      <text x={x} y={y + 10} textAnchor="middle" fontSize={large ? "32" : "26"} fontWeight="900" fill="#0f172a">{label}</text>
    </g>
  );
}

function HcfGcdRedesignVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
          <p className="font-black">Factors of 18 and 24</p>
          <div className="relative mt-4 h-72">
            <div className="absolute left-4 top-8 h-52 w-52 rounded-full bg-cyan-100/80 ring-2 ring-cyan-300" />
            <div className="absolute right-4 top-8 h-52 w-52 rounded-full bg-violet-100/80 ring-2 ring-violet-300" />
            <div className="absolute left-[34%] top-20 grid gap-2 text-center font-mono font-black text-green-900">{["1", "2", "3", "6"].map((x) => <span key={x} className="rounded-full bg-green-200 px-3 py-2">{x}</span>)}</div>
            <p className="absolute left-8 top-2 font-black text-cyan-800">Factors of 18</p>
            <p className="absolute right-8 top-2 font-black text-violet-800">Factors of 24</p>
            <p className="absolute left-10 bottom-6 font-mono font-black text-cyan-900">9, 18</p>
            <p className="absolute right-10 bottom-6 font-mono font-black text-violet-900">4, 8, 12, 24</p>
          </div>
          <p className="rounded-2xl bg-green-50 p-3 text-center font-black text-green-900">Shared factors: 1, 2, 3, 6</p>
        </div>
        <div className="space-y-3">
          <InfoCard title="Prime overlap" lines={["18 = 2 × 3²", "24 = 2³ × 3", "Overlap: 2 × 3 = 6"]} />
          <InfoCard title="Equal groups" lines={["18 = 3 groups of 6", "24 = 4 groups of 6", "HCF = 6"]} tone="amber" />
        </div>
      </div>
    </TopicPanel>
  );
}

function LcmRedesignVisual() {
  return (
    <TopicPanel>
      <p className="font-black">Synchronized jumps to the first shared landing</p>
      <JumpLine step={6} max={48} color="#0891b2" highlight={24} />
      <JumpLine step={8} max={48} color="#7c3aed" highlight={24} />
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <InfoCard title="Multiples of 6" lines={["6, 12, 18, 24, 30"]} />
        <InfoCard title="Multiples of 8" lines={["8, 16, 24, 32, 40"]} tone="violet" />
      </div>
      <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-center font-black text-amber-900">First shared landing: 24. LCM = 2³ × 3 = 24.</p>
    </TopicPanel>
  );
}

function DivisibilityRulesVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex items-center justify-center gap-3 text-center">
            {["2", "3", "4"].map((digit) => <span key={digit} className="rounded-2xl bg-cyan-100 px-6 py-5 font-mono text-3xl font-black text-cyan-900">{digit}</span>)}
            <span className="font-black">=</span>
            <span className="rounded-2xl bg-green-100 px-6 py-5 font-mono text-3xl font-black text-green-900">9</span>
          </div>
          <p className="mt-4 rounded-2xl bg-slate-950 p-4 text-center font-mono text-2xl font-black text-white">2 + 3 + 4 = 9</p>
          <p className="mt-3 rounded-2xl bg-green-50 p-3 text-center font-black text-green-900">234 ÷ 9 = 26 remainder 0. 234 is divisible by 9.</p>
        </div>
        <div className="space-y-3">
          <InfoCard title="Rule selector" lines={["2", "3", "5", "9 selected", "10"]} />
          <InfoCard title="Comparison" lines={["235 has digit sum 10", "not divisible by 9"]} tone="amber" />
        </div>
      </div>
    </TopicPanel>
  );
}

function ModularArithmeticVisual() {
  const points = Array.from({ length: 7 }, (_, i) => {
    const angle = (-90 + i * (360 / 7)) * Math.PI / 180;
    return { i, x: 150 + 95 * Math.cos(angle), y: 130 + 95 * Math.sin(angle) };
  });
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <svg viewBox="0 0 300 260" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label="Remainder clock modulo 7 ending at remainder 2">
          <circle cx="150" cy="130" r="95" fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
          {points.map((p) => <g key={p.i}><circle cx={p.x} cy={p.y} r={p.i === 2 ? 16 : 12} fill={p.i === 2 ? "#f59e0b" : "#fff"} stroke="#0891b2" strokeWidth="3" /><text x={p.x} y={p.y + 5} textAnchor="middle" fontWeight="900">{p.i}</text></g>)}
          <path d="M150 35 A95 95 0 1 1 149 35" fill="none" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 5" />
          <text x="150" y="132" textAnchor="middle" fontWeight="900">23 steps</text>
        </svg>
        <div className="space-y-3">
          <p className="rounded-2xl bg-slate-950 p-4 text-center font-mono text-3xl font-black text-white">23 mod 7 = 2</p>
          <InfoCard title="Grouping" lines={["23 = 7 + 7 + 7 + 2", "23 = 3 × 7 + 2", "Three full cycles plus two steps"]} />
          <InfoCard title="Cards" lines={["Quotient: 3", "Remainder: 2"]} tone="amber" />
        </div>
      </div>
    </TopicPanel>
  );
}

function BaseSystemsVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-3 md:grid-cols-3">
        {["2²", "2¹", "2⁰"].map((place, index) => <div key={place} className="rounded-3xl bg-cyan-50 p-4 text-center ring-1 ring-cyan-200"><p className="font-black text-cyan-900">{place}</p><p className="mt-3 rounded-2xl bg-violet-100 p-4 font-mono text-3xl font-black text-violet-900">{[1, 1, 0][index]}</p><p className="mt-3 font-mono font-black">{["1×4", "1×2", "0×1"][index]}</p></div>)}
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-4 text-center font-mono text-2xl font-black text-green-900">1×4 + 1×2 + 0×1; 4 + 2 + 0 = 6</p>
      <p className="mt-3 rounded-2xl bg-white p-3 text-center font-black ring-1 ring-slate-200">Number: 110. Base: 2. Allowed digits: 0 and 1. 110₂ = 6₁₀.</p>
    </TopicPanel>
  );
}

function ContinuedFractionsVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="rounded-3xl bg-violet-50 p-6 text-center ring-1 ring-violet-200">
          <p className="font-mono text-4xl font-black text-violet-900">[1; 2, 3]</p>
          <p className="mt-4 font-mono text-2xl font-black">1 + 1/(2 + 1/3)</p>
          <div className="mt-4 grid gap-2 font-mono font-black">
            <span className="rounded-2xl bg-white p-3">2 + 1/3 = 7/3</span>
            <span className="rounded-2xl bg-white p-3">1 + 3/7 = 10/7</span>
            <span className="rounded-2xl bg-green-100 p-3 text-green-900">10/7 ≈ 1.429</span>
          </div>
        </div>
        <InfoCard title="Convergents" lines={["1", "3/2 = 1.500", "10/7 = 1.429"]} />
      </div>
    </TopicPanel>
  );
}

function FractionModelsRedesignVisual() {
  return (
    <TopicPanel>
      <p className="rounded-2xl bg-green-50 p-3 text-center font-mono text-2xl font-black text-green-900">3/4 = 0.75 = 75%</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ModelCard title="Area model"><FractionBar parts={4} shaded={3} /></ModelCard>
        <ModelCard title="Circle model"><CircleFraction /></ModelCard>
        <ModelCard title="Set model: 9 of 12"><DotSet total={12} active={9} /></ModelCard>
        <ModelCard title="Number line position: 0.75"><MiniScaleLine labels={["0", "3/4", "1"]} /></ModelCard>
      </div>
    </TopicPanel>
  );
}

function EquivalentFractionsVisual() {
  return (
    <TopicPanel>
      <FractionBar parts={4} shaded={3} label="Original: 3/4" />
      <div className="my-3 text-center font-mono text-xl font-black text-amber-700">3 × 2 = 6 and 4 × 2 = 8</div>
      <FractionBar parts={8} shaded={6} label="Equivalent: 6/8" tone="violet" />
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-2xl font-black text-green-900">3/4 = 6/8 = 0.75. Same value, more equal parts.</p>
    </TopicPanel>
  );
}

function ComparingFractionsVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 md:grid-cols-2">
        <ModelCard title="Fraction A: 3/4"><FractionBar parts={4} shaded={3} /></ModelCard>
        <ModelCard title="Fraction B: 4/7"><FractionBar parts={7} shaded={4} tone="violet" /></ModelCard>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <FractionBar parts={28} shaded={21} label="3/4 = 21/28" />
        <FractionBar parts={28} shaded={16} label="4/7 = 16/28" tone="violet" />
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-2xl font-black text-green-900">21/28 &gt; 16/28. Therefore 3/4 &gt; 4/7.</p>
    </TopicPanel>
  );
}

function FractionOperationsVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-3 md:grid-cols-2">
        <FractionBar parts={2} shaded={1} label="1/2" />
        <FractionBar parts={3} shaded={1} label="1/3" tone="violet" />
      </div>
      <p className="my-4 rounded-2xl bg-amber-50 p-3 text-center font-black text-amber-900">Common denominator: 6</p>
      <div className="grid gap-3 md:grid-cols-3">
        <FractionBar parts={6} shaded={3} label="1/2 = 3/6" />
        <FractionBar parts={6} shaded={2} label="1/3 = 2/6" tone="violet" />
        <FractionBar parts={6} shaded={5} label="Result: 5/6" tone="green" />
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-xl font-black text-green-900">3/6 + 2/6 = 5/6</p>
    </TopicPanel>
  );
}

function DecimalPlaceValueVisual() {
  return (
    <TopicPanel>
      <p className="mb-3 font-black text-slate-900">First decimal: 0.50. Second decimal: 0.47.</p>
      <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
        <div className="grid grid-cols-4 bg-slate-50 p-3 text-center font-black"><span />{["ones", "tenths", "hundredths"].map((h) => <span key={h}>{h}</span>)}</div>
        {[["0.50", "0", "5", "0"], ["0.47", "0", "4", "7"]].map((row) => <div key={row[0]} className="grid grid-cols-4 border-t p-3 text-center font-mono text-xl font-black"><span>{row[0]}</span><span>{row[1]}</span><span className="rounded-xl bg-amber-100">{row[2]}</span><span>{row[3]}</span></div>)}
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-2xl font-black text-green-900">Tenths: 5 &gt; 4. 0.50 &gt; 0.47.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2"><HundredGrid count={50} /><HundredGrid count={47} tone="violet" /></div>
    </TopicPanel>
  );
}

function DecimalOperationsVisual() {
  return (
    <TopicPanel>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-5 ring-1 ring-slate-200">
        <div className="grid grid-cols-4 text-center font-black text-slate-500"><span /> <span>ones</span><span>tenths</span><span>hundredths</span></div>
        {["3.40", "+ 1.25", "4.65"].map((row) => <div key={row} className={row === "4.65" ? "grid grid-cols-4 border-t-4 border-slate-800 p-3 text-center font-mono text-2xl font-black text-green-800" : "grid grid-cols-4 p-3 text-center font-mono text-2xl font-black"}><span>{row.startsWith("+") ? "+" : ""}</span><span>{row.replace("+ ","").split(".")[0]}</span><span>{row.split(".")[1]?.[0]}</span><span>{row.split(".")[1]?.[1]}</span></div>)}
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-black text-green-900">4 wholes, 6 tenths, 5 hundredths. Decimal points must stay aligned.</p>
    </TopicPanel>
  );
}

function FractionDecimalConversionVisual() {
  return (
    <TopicPanel>
      <p className="mb-3 font-black text-slate-900">Fraction-Decimal Conversion</p>
      <div className="grid gap-4 md:grid-cols-3">
        <ModelCard title="Fraction: 3/4"><FractionBar parts={4} shaded={3} /></ModelCard>
        <InfoCard title="Divide numerator by denominator" lines={["3 ÷ 4 = 0.75", "3/4 = 0.75"]} tone="violet" />
        <ModelCard title="75 of 100 hundredths"><HundredGrid count={75} /></ModelCard>
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-2xl font-black text-green-900">3/4 -&gt; 0.75 -&gt; 75%. The value stays the same across forms.</p>
    </TopicPanel>
  );
}

function RecurringDecimalsVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <p className="font-mono text-3xl font-black">1 ÷ 3 = 0.333...</p>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center font-mono font-black">
            {["1.000", "10", "-9", "1", "repeat"].map((x) => <span key={x} className="rounded-xl bg-violet-50 p-3 text-violet-900">{x}</span>)}
          </div>
          <p className="mt-4 rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Remainder repeats: 1</p>
        </div>
        <InfoCard title="Exact decimal" lines={["Repeating digit: 3", "Exact form: 0.333...", "Rounded display is not the exact value."]} />
      </div>
    </TopicPanel>
  );
}

function RatioModelsVisual() {
  return (
    <TopicPanel>
      <p className="font-mono text-2xl font-black">Blue : Red = 2 : 3</p>
      <div className="mt-3 flex gap-2">{Array.from({ length: 2 }, (_, i) => <span key={`b-${i}`} className="h-10 w-10 rounded-full bg-cyan-500" />)}{Array.from({ length: 3 }, (_, i) => <span key={`r-${i}`} className="h-10 w-10 rounded-full bg-violet-500" />)}</div>
      <div className="mt-4 grid grid-cols-5 overflow-hidden rounded-2xl ring-1 ring-slate-200">{Array.from({ length: 5 }, (_, i) => <span key={i} className={i < 2 ? "h-14 bg-cyan-400" : "h-14 bg-violet-400"} />)}</div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-xl font-black text-green-900">Total parts: 5. Scale factor: 2. 2 : 3 = 4 : 6.</p>
    </TopicPanel>
  );
}

function ProportionVisual() {
  return (
    <TopicPanel>
      <p className="rounded-2xl bg-slate-950 p-4 text-center font-mono text-3xl font-black text-white">2 : 9 = 6 : x</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoCard title="Scale table" lines={["2 × 3 = 6", "9 × 3 = 27", "x = 27"]} />
        <InfoCard title="Cross-check" lines={["Cross-check: 2 × 27 = 9 × 6", "54 = 54"]} tone="green" />
      </div>
    </TopicPanel>
  );
}

function DirectProportionVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <DataTable rows={[["x", "1", "2", "3", "4"], ["y", "30", "60", "90", "120"], ["y/x", "30", "30", "30", "30"]]} />
        <SimpleGraph points={[[0, 0], [1, 30], [2, 60], [3, 90], [4, 120]]} line />
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-xl font-black text-green-900">y = 30x. Unit rate: 30. 3 items cost 90. The graph passes through the origin.</p>
    </TopicPanel>
  );
}

function InverseProportionVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <DataTable rows={[["workers", "1", "2", "3", "4", "6", "8"], ["days", "24", "12", "8", "6", "4", "3"], ["xy", "24", "24", "24", "24", "24", "24"]]} />
        <SimpleGraph points={[[1, 24], [2, 12], [3, 8], [4, 6], [8, 3]]} />
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-mono text-xl font-black text-green-900">workers × days = 24. y = 24/x. 8 workers need 3 days; 3 workers need 8 days. Inverse proportion keeps xy constant.</p>
    </TopicPanel>
  );
}

function UnitRatesVisual() {
  return (
    <TopicPanel>
      <p className="mb-3 font-black text-slate-900">Total cost: 300</p>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
          <div className="grid grid-cols-5 gap-2">{Array.from({ length: 5 }, (_, i) => <span key={i} className="rounded-2xl bg-cyan-100 p-4 text-center font-black text-cyan-900">1 kg<br />60</span>)}</div>
          <p className="mt-4 rounded-2xl bg-violet-50 p-3 text-center font-mono text-2xl font-black text-violet-900">300 ÷ 5 = 60</p>
        </div>
        <DataTable rows={[["kg", "1", "2", "3", "5"], ["₹", "60", "120", "180", "300"]]} />
      </div>
      <p className="mt-4 rounded-2xl bg-green-50 p-3 text-center font-black text-green-900">Unit rate: 60 per kg. Per one means for exactly 1 unit.</p>
    </TopicPanel>
  );
}

function PercentagesVisual({ percent }: { percent: number }) {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <HundredGrid count={percent} />
        <div className="space-y-3">
          <p className="rounded-2xl bg-slate-950 p-4 text-center font-mono text-3xl font-black text-white">25% means 25 out of 100</p>
          <InfoCard title="Linked forms" lines={["25% = 25/100", "25/100 = 1/4", "25% = 0.25"]} />
          <InfoCard title="Part of amount" lines={["25% of 80 = 20", "one quarter highlighted"]} tone="green" />
        </div>
      </div>
    </TopicPanel>
  );
}

function PercentageChangeVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <p className="font-black text-slate-900">Percentage Change</p>
          <p className="mt-1 text-sm font-black text-slate-600">Model increase and decrease.</p>
          <div className="mt-4 space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-xs font-black text-teal-800"><span>Original amount: 80</span><span>Original base</span></div>
              <div className="h-9 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200"><div className="h-full w-2/3 rounded-2xl bg-teal-500" /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs font-black text-violet-800"><span>New amount: 100</span><span>Change: 20</span></div>
              <div className="flex h-9 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                <div className="h-full w-2/3 bg-violet-500" />
                <div className="h-full w-1/6 bg-amber-400" />
              </div>
            </div>
          </div>
          <p className="mt-4 rounded-2xl bg-slate-950 p-4 text-center font-mono text-2xl font-black text-white">change = 100 - 80 = 20; 20/80 × 100 = 25%</p>
          <div className="relative mt-6 h-20 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
            <div className="absolute left-8 right-8 top-9 h-1 bg-slate-700" />
            {[0, 80, 100, 120].map((tick) => <span key={tick} className={tick === 80 ? "absolute top-2 -translate-x-1/2 rounded-full bg-teal-500 px-2 py-1 font-mono text-xs font-black text-white" : tick === 100 ? "absolute top-2 -translate-x-1/2 rounded-full bg-violet-500 px-2 py-1 font-mono text-xs font-black text-white" : "absolute top-12 -translate-x-1/2 font-mono text-xs font-black"} style={{ left: `${8 + (tick / 120) * 84}%` }}>{tick}</span>)}
          </div>
          <p className="mt-3 rounded-2xl bg-green-50 p-3 text-center font-black text-green-900">25% increase</p>
        </div>
        <div className="space-y-3">
          <InfoCard title="Inspector" lines={["Original amount: 80", "New amount: 100", "Change: 20", "Percentage change: 25%"]} />
          <InfoCard title="Watch out" lines={["Use the original amount as the base.", "Do not divide by the new amount."]} tone="amber" />
          <InfoCard title="Try next" lines={["Try: From 50 to 65.", "15/50 × 100 = 30%"]} tone="green" />
        </div>
      </div>
    </TopicPanel>
  );
}

function CompoundChangeVisual() {
  const stages = [
    ["Start: 100", "100", "bg-teal-500", "100"],
    ["+10%", "After stage 1: 110", "bg-violet-500", "110"],
    ["+10%", "After stage 2: 121", "bg-amber-400", "121"],
  ];
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div>
          <p className="font-black text-slate-900">Compound Change</p>
          <p className="mt-1 text-sm font-black text-slate-600">Understand repeated percentage effects.</p>
          <div className="mt-4 space-y-3">
            {stages.map(([label, amount, color, width], index) => <div key={`${label}-${amount}-${index}`} className="rounded-3xl bg-white p-3 ring-1 ring-slate-200"><div className="flex items-center justify-between font-black"><span>{label}</span><span className="font-mono">{amount}</span></div><div className="mt-2 h-8 rounded-2xl bg-slate-100"><div className={`h-full rounded-2xl ${color}`} style={{ width: `${Number(width) / 1.35}%` }} /></div></div>)}
          </div>
          <div className="mt-4 grid gap-2 font-mono font-black md:grid-cols-3">
            <span className="rounded-2xl bg-white p-3 text-center ring-1 ring-slate-200">100 × 1.10 = 110</span>
            <span className="rounded-2xl bg-white p-3 text-center ring-1 ring-slate-200">110 × 1.10 = 121</span>
            <span className="rounded-2xl bg-green-50 p-3 text-center text-green-900 ring-1 ring-green-200">100 × (1.10)^2 = 121</span>
          </div>
          <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-center font-black text-amber-900">Compound total: 21%. Not 20%.</p>
        </div>
        <div className="space-y-3">
          <InfoCard title="Set up per stage" lines={["Start: 100", "Rate: +10%", "Number of stages: 2", "Result: 121"]} />
          <InfoCard title="Latest base" lines={["Second 10% uses 110", "Each stage uses the latest amount."]} tone="amber" />
          <InfoCard title="Try next" lines={["100 with two 5% increases", "100 × 1.05² = 110.25"]} tone="green" />
        </div>
      </div>
    </TopicPanel>
  );
}

function ScaleDrawingsVisual() {
  return (
    <TopicPanel>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_265px]">
        <div>
          <p className="font-black text-slate-900">Scale Drawings</p>
          <p className="mt-1 text-sm font-black text-slate-600">Apply proportional reasoning.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_230px]">
            <svg viewBox="0 0 340 280" className="w-full rounded-3xl bg-cyan-50 ring-1 ring-cyan-200" role="img" aria-label="City map grid with route from A to B">
              {Array.from({ length: 8 }, (_, i) => <line key={`v-${i}`} x1={30 + i * 40} y1="20" x2={30 + i * 40} y2="260" stroke="#bae6fd" />)}
              {Array.from({ length: 7 }, (_, i) => <line key={`h-${i}`} x1="20" y1={30 + i * 35} x2="320" y2={30 + i * 35} stroke="#bae6fd" />)}
              <path d="M70 220 L120 190 L120 145 L180 120 L230 78" fill="none" stroke="#14b8a6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="70" cy="220" r="13" fill="#7c3aed" /><text x="52" y="248" fontWeight="900">A</text>
              <circle cx="230" cy="78" r="13" fill="#7c3aed" /><text x="238" y="72" fontWeight="900">B</text>
              <text x="118" y="111" fill="#0f766e" fontWeight="900">Map length: 4 cm</text>
            </svg>
            <div className="space-y-3">
              <InfoCard title="Scale ruler" lines={["Scale: 1 cm : 5 km", "1 cm", "5 km"]} tone="amber" />
              <InfoCard title="Conversion" lines={["4 cm × 5 km/cm = 20 km", "Real length: 20 km"]} tone="green" />
            </div>
          </div>
          <div className="relative mt-5 h-20 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
            <div className="absolute left-7 right-7 top-9 h-1 bg-slate-700" />
            {[0, 5, 10, 15, 20].map((tick) => <span key={tick} className={tick === 20 ? "absolute top-2 -translate-x-1/2 rounded-full bg-green-600 px-2 py-1 font-mono text-xs font-black text-white" : "absolute top-12 -translate-x-1/2 font-mono text-xs font-black"} style={{ left: `${8 + (tick / 20) * 84}%` }}>{tick} km</span>)}
          </div>
        </div>
        <div className="space-y-3">
          <InfoCard title="Inspector" lines={["Map length: 4 cm", "Scale: 1 cm : 5 km", "Real length: 20 km", "Same scale for every length"]} />
          <InfoCard title="Rule" lines={["Measure on the drawing.", "Convert to real distance."]} tone="violet" />
          <InfoCard title="Try next" lines={["6 cm at the same scale", "6 × 5 = 30 km"]} tone="green" />
        </div>
      </div>
    </TopicPanel>
  );
}

function TopicPanel({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">{children}</div>;
}

function InfoCard({ title, lines, tone = "cyan" }: { title: string; lines: string[]; tone?: "cyan" | "violet" | "amber" | "green" }) {
  const toneClass = tone === "violet" ? "bg-violet-50 text-violet-900 ring-violet-200" : tone === "amber" ? "bg-amber-50 text-amber-900 ring-amber-200" : tone === "green" ? "bg-green-50 text-green-900 ring-green-200" : "bg-cyan-50 text-cyan-900 ring-cyan-200";
  return <div className={`rounded-3xl p-4 ring-1 ${toneClass}`}><p className="font-black">{title}</p>{lines.map((line) => <p key={line} className="mt-2 font-mono font-black">{line}</p>)}</div>;
}

function ModelCard({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200"><p className="mb-3 font-black">{title}</p>{children}</div>;
}

function FractionBar({ parts, shaded, label, tone = "teal" }: { parts: number; shaded: number; label?: string; tone?: "teal" | "violet" | "green" }) {
  const fill = tone === "violet" ? "bg-violet-500" : tone === "green" ? "bg-green-500" : "bg-teal-500";
  return <div><div className="grid h-14 overflow-hidden rounded-2xl ring-1 ring-slate-300" style={{ gridTemplateColumns: `repeat(${parts}, minmax(0, 1fr))` }}>{Array.from({ length: parts }, (_, i) => <span key={i} className={i < shaded ? `${fill} border-r border-white/70` : "bg-white border-r border-slate-200"} />)}</div>{label ? <p className="mt-2 text-center font-mono font-black">{label}</p> : null}</div>;
}

function HundredGrid({ count, tone = "teal" }: { count: number; tone?: "teal" | "violet" }) {
  const fill = tone === "violet" ? "bg-violet-500" : "bg-teal-500";
  return <div className="grid grid-cols-10 gap-1 rounded-3xl bg-white p-3 ring-1 ring-slate-200" aria-label={`${count} of 100 squares shaded`}>{Array.from({ length: 100 }, (_, i) => <span key={i} className={i < count ? `aspect-square rounded-sm ${fill}` : "aspect-square rounded-sm bg-slate-100"} />)}</div>;
}

function DotSet({ total, active }: { total: number; active: number }) {
  return <div className="grid grid-cols-6 gap-2">{Array.from({ length: total }, (_, i) => <span key={i} className={i < active ? "h-7 w-7 rounded-full bg-teal-500" : "h-7 w-7 rounded-full bg-slate-200"} />)}</div>;
}

function CircleFraction() {
  return <div className="mx-auto h-32 w-32 rounded-full border-4 border-white bg-[conic-gradient(#14b8a6_0deg_270deg,#e2e8f0_270deg_360deg)] shadow ring-1 ring-slate-200" aria-label="Circle split into four sectors with three shaded" />;
}

function MiniScaleLine({ labels }: { labels: string[] }) {
  return <div className="relative h-16"><div className="absolute left-3 right-3 top-7 h-1 bg-slate-700" />{labels.map((label, i) => <span key={label} className="absolute top-0 -translate-x-1/2 rounded-xl bg-amber-100 px-2 py-1 font-mono font-black" style={{ left: `${i * 50}%` }}>{label}</span>)}</div>;
}

function JumpLine({ step, max, color, highlight }: { step: number; max: number; color: string; highlight: number }) {
  const xs = (n: number) => 40 + (n / max) * 600;
  return (
    <svg viewBox="0 0 680 90" className="mt-2 w-full" role="img" aria-label={`Jumps by ${step}`}>
      <line x1="40" y1="55" x2="640" y2="55" stroke="#0f172a" strokeWidth="3" />
      {Array.from({ length: Math.floor(max / step) }, (_, i) => (i + 1) * step).map((n) => <g key={n}><path d={`M ${xs(n - step)} 51 Q ${(xs(n - step) + xs(n)) / 2} 5 ${xs(n)} 51`} fill="none" stroke={color} strokeWidth="4" /><circle cx={xs(n)} cy="55" r={n === highlight ? 10 : 6} fill={n === highlight ? "#f59e0b" : color} /><text x={xs(n)} y="80" textAnchor="middle" fontWeight="900">{n}</text></g>)}
      <text x="8" y="60" fontWeight="900" fill={color}>+{step}</text>
    </svg>
  );
}

function DataTable({ rows }: { rows: string[][] }) {
  return <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">{rows.map((row) => <div key={row.join("-")} className="grid border-b last:border-b-0" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>{row.map((cell, index) => <span key={`${cell}-${index}`} className={index === 0 ? "bg-slate-50 p-3 font-black" : "p-3 text-center font-mono font-black"}>{cell}</span>)}</div>)}</div>;
}

function SimpleGraph({ points, line = false }: { points: number[][]; line?: boolean }) {
  const maxX = Math.max(...points.map((p) => p[0]));
  const maxY = Math.max(...points.map((p) => p[1]));
  const coords = points.map(([x, y]) => [35 + (x / maxX) * 245, 225 - (y / maxY) * 180]);
  return (
    <svg viewBox="0 0 310 250" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label="Proportion graph">
      <line x1="35" y1="225" x2="290" y2="225" stroke="#334155" /><line x1="35" y1="225" x2="35" y2="30" stroke="#334155" />
      {line ? <polyline points={coords.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="#0891b2" strokeWidth="4" /> : <path d={`M ${coords.map(([x, y]) => `${x} ${y}`).join(" L ")}`} fill="none" stroke="#7c3aed" strokeWidth="4" />}
      {coords.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="#0891b2" />)}
    </svg>
  );
}

function HcfGcdExperience({ lessonTitle, n, m, range, changeN, changeM }: { lessonTitle: string; n: number; m: number; range: ReturnType<typeof rangeFor>; changeN: (value: number) => void; changeM: (value: number) => void }) {
  const first = Math.max(1, Math.abs(Math.round(n)));
  const second = Math.max(1, Math.abs(Math.round(m)));
  const firstFactors = useMemo(() => factorsOf(first), [first]);
  const secondFactors = useMemo(() => factorsOf(second), [second]);
  const shared = useMemo(() => firstFactors.filter((factor) => secondFactors.includes(factor)), [firstFactors, secondFactors]);
  const greatest = shared.at(-1) ?? 1;
  const firstOnly = firstFactors.filter((factor) => !shared.includes(factor));
  const secondOnly = secondFactors.filter((factor) => !shared.includes(factor));
  const firstGroups = first / greatest;
  const secondGroups = second / greatest;
  const steps = euclideanSteps(first, second);

  return (
    <AdapterFrame title={`${lessonTitle} visual lab`} value={`gcd(${first}, ${second}) = ${greatest}`} footer="HCF is the greatest shared factor. GCD is the greatest number that divides both numbers exactly. Use the shared factors and Euclidean algorithm to verify it.">
      <section className="hcf-lab" aria-label="HCF and GCD interactive visual lab">
        <div className="hcf-hero">
          <div>
            <p className="hcf-kicker">Numbers and number theory</p>
            <h2>Find the largest shared divisor.</h2>
            <p>Compare every factor of both numbers. The biggest factor in the overlap is the HCF, also called the GCD.</p>
          </div>
          <div className="hcf-answer-card">
            <span>HCF/GCD</span>
            <strong>{greatest}</strong>
            <small>{greatest} divides {first} into {firstGroups} equal groups and {second} into {secondGroups} equal groups.</small>
          </div>
        </div>

        <div className="hcf-workspace">
          <div className="hcf-visual-panel">
            <HcfVennDiagram first={first} second={second} firstOnly={firstOnly} secondOnly={secondOnly} shared={shared} greatest={greatest} />
            <div className="hcf-factor-rows">
              <FactorRow label={`Factors of ${first}`} factors={firstFactors} shared={shared} greatest={greatest} tone="blue" />
              <FactorRow label={`Factors of ${second}`} factors={secondFactors} shared={shared} greatest={greatest} tone="orange" />
            </div>
            <GroupingModel first={first} second={second} gcdValue={greatest} />
          </div>

          <aside className="hcf-side-panel">
            <section className="hcf-explain-card">
              <span>Concept trace</span>
              <h3>Shared-factor intersection</h3>
              <p>The overlap contains factors that divide both numbers. Choose the greatest value in that overlap.</p>
            </section>

            <section className="hcf-controls-card">
              <h3>Change the numbers</h3>
              <SliderControl density="compact" label="first number" value={first} min={range.nMin} max={range.nMax} step={1} onChange={changeN} />
              <SliderControl density="compact" label="second number" value={second} min={range.mMin} max={range.mMax} step={1} onChange={changeM} />
            </section>

            <section className="hcf-euclid-card">
              <span>Fast method</span>
              <h3>Euclidean algorithm</h3>
              <div>
                {steps.map((step) => (
                  <p key={`${step.a}-${step.b}-${step.remainder}`}>
                    <strong>{step.a}</strong> = {step.b} x {step.quotient} + <b>{step.remainder}</b>
                  </p>
                ))}
              </div>
              <small>When the remainder becomes 0, the previous divisor is the GCD: {greatest}.</small>
            </section>

            <div className="hcf-metrics">
              <Metric label="first factorization" value={factorizationText(first)} />
              <Metric label="second factorization" value={factorizationText(second)} />
              <Metric label="common factors" value={shared.join(", ")} />
              <Metric label="largest shared" value={String(greatest)} />
            </div>
          </aside>
        </div>
      </section>
    </AdapterFrame>
  );
}

function HcfVennDiagram({ first, second, firstOnly, secondOnly, shared, greatest }: { first: number; second: number; firstOnly: number[]; secondOnly: number[]; shared: number[]; greatest: number }) {
  return (
    <div className="hcf-venn-card">
      <div className="hcf-venn-labels">
        <span>{first}</span>
        <strong>Shared factors</strong>
        <span>{second}</span>
      </div>
      <div className="hcf-venn">
        <div className="hcf-circle is-first">
          {firstOnly.slice(0, 8).map((factor) => <FactorBubble key={`first-${factor}`} factor={factor} />)}
        </div>
        <div className="hcf-circle is-second">
          {secondOnly.slice(0, 8).map((factor) => <FactorBubble key={`second-${factor}`} factor={factor} />)}
        </div>
        <div className="hcf-shared-stack">
          {shared.map((factor) => <FactorBubble key={`shared-${factor}`} factor={factor} highlight={factor === greatest} />)}
        </div>
      </div>
    </div>
  );
}

function FactorRow({ label, factors, shared, greatest, tone }: { label: string; factors: number[]; shared: number[]; greatest: number; tone: "blue" | "orange" }) {
  return (
    <div className={`hcf-factor-row is-${tone}`}>
      <strong>{label}</strong>
      <div>
        {factors.map((factor) => (
          <span key={factor} className={`${shared.includes(factor) ? "is-shared" : ""} ${factor === greatest ? "is-greatest" : ""}`}>{factor}</span>
        ))}
      </div>
    </div>
  );
}

function FactorBubble({ factor, highlight = false }: { factor: number; highlight?: boolean }) {
  return <span className={highlight ? "is-greatest" : ""}>{factor}</span>;
}

function GroupingModel({ first, second, gcdValue }: { first: number; second: number; gcdValue: number }) {
  const firstGroups = Math.min(12, first / gcdValue);
  const secondGroups = Math.min(12, second / gcdValue);
  return (
    <div className="hcf-grouping-card">
      <div>
        <h3>Largest equal groups</h3>
        <p>Use group size {gcdValue}. No leftovers for either number.</p>
      </div>
      <div className="hcf-group-rows">
        <GroupRow label={String(first)} groups={firstGroups} gcdValue={gcdValue} tone="blue" />
        <GroupRow label={String(second)} groups={secondGroups} gcdValue={gcdValue} tone="orange" />
      </div>
    </div>
  );
}

function GroupRow({ label, groups, gcdValue, tone }: { label: string; groups: number; gcdValue: number; tone: "blue" | "orange" }) {
  return (
    <div className={`hcf-group-row is-${tone}`}>
      <strong>{label}</strong>
      <div>{Array.from({ length: groups }, (_, index) => <span key={index}>{gcdValue}</span>)}</div>
    </div>
  );
}

function NumberConceptTrace({ lessonId, n, m, factors, factorization }: { lessonId: number; n: number; m: number; factors: number[]; factorization: string }) {
  const trace = numberConceptTraceFor(lessonId, n, m, factors, factorization);
  return (
    <section className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-cyan-50 p-3 dark:border-sky-300/20 dark:from-slate-950 dark:via-sky-300/10 dark:to-cyan-300/10" aria-label={`${trace.title} number concept trace`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-sky-700 dark:text-sky-200">Concept trace</p>
          <h3 className="text-sm font-black text-slate-950 dark:text-white">{trace.title}</h3>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-sky-700 shadow-sm dark:bg-white/10 dark:text-sky-100">{trace.badge}</span>
      </div>
      <div className="mt-3 grid gap-2">
        {trace.rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-slate-200 bg-white/85 p-2 dark:border-white/10 dark:bg-slate-950/55">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{row.label}</span>
              <strong className="max-w-[150px] truncate font-mono text-sm text-slate-950 dark:text-white">{row.value}</strong>
            </div>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-sky-100/70 p-2 text-xs font-black leading-5 text-sky-950 dark:bg-sky-300/10 dark:text-sky-100">{trace.validity}</p>
    </section>
  );
}

type NumberConceptTraceSpec = {
  title: string;
  badge: string;
  validity: string;
  rows: Array<{ label: string; value: string; note: string }>;
};

function numberConceptTraceFor(lessonId: number, n: number, m: number, factors: number[], factorization: string): NumberConceptTraceSpec {
  const common = (title: string, badge: string, rows: NumberConceptTraceSpec["rows"], validity: string): NumberConceptTraceSpec => ({ title, badge, rows, validity });
  if (lessonId === 57) return common("Counting-number membership", "N starts at 1", [
    { label: "Selected", value: String(n), note: "A natural number counts one or more whole objects." },
    { label: "First value", value: "1", note: "This lesson uses the school convention that natural numbers start at 1." },
    { label: "Not included", value: "0, fractions", note: "Zero means none; fractions do not count whole objects." },
  ], "Natural-number visuals must show counting membership, not factor analysis.");
  if (lessonId === 58) return common("Whole-number membership", "0 included", [
    { label: "Selected", value: String(n), note: "Whole numbers include zero and counting numbers." },
    { label: "First value", value: "0", note: "Zero belongs because it names an empty count." },
    { label: "Excluded", value: "negative/fraction", note: "Whole numbers do not include parts or values below zero." },
  ], "Whole-number visuals must make zero visible as part of the set.");
  if (lessonId === 59) return common("Integer direction from zero", "signed steps", [
    { label: "Selected", value: String(n), note: n < 0 ? "Negative integers sit left of zero." : n > 0 ? "Positive integers sit right of zero." : "Zero is neither positive nor negative." },
    { label: "Opposite", value: String(-n), note: "Opposites are the same distance from zero in different directions." },
    { label: "Compare", value: compareText(n, m), note: "Farther right on the number line means greater." },
  ], "Integer visuals must show sign, direction, and order.");
  if (lessonId === 60) return common("Rational as ratio", "a/b", [
    { label: "Numerator", value: String(n), note: "The top value counts chosen parts." },
    { label: "Denominator", value: String(Math.max(1, m)), note: "The denominator must not be zero." },
    { label: "Decimal", value: (n / Math.max(1, m)).toFixed(3), note: "A rational value can be written as division of integers." },
  ], "Rational-number visuals must keep numerator and non-zero denominator visible.");
  if (lessonId === 61) return common("Irrational square-root check", "non-perfect square", [
    { label: "Radicand", value: String(n), note: "Check whether the number under the root is a perfect square." },
    { label: "Nearest square", value: nearestSquareText(n), note: "Non-perfect squares produce non-ending, non-repeating decimals." },
    { label: "Classification", value: classificationFor(lessonId, n), note: "The visual should explain why exact square roots are special." },
  ], "Irrational-number visuals must separate exact roots from decimal approximations.");
  if (lessonId === 62) return common("Real number-line placement", "ordered line", [
    { label: "Selected", value: String(n), note: "Every real number has a position on the number line." },
    { label: "Left/right", value: n < 0 ? "left of 0" : n > 0 ? "right of 0" : "at 0", note: "Order is represented by horizontal position." },
    { label: "Compare", value: compareText(n, m), note: "The number line gives a visual comparison." },
  ], "Real-number visuals should prioritize position and order.");
  if (lessonId === 63) return common("Complex plane coordinates", "a+bi", [
    { label: "Real part", value: String(n), note: "The real part moves horizontally." },
    { label: "Imaginary part", value: String(Math.abs(m)), note: "The imaginary part moves vertically." },
    { label: "Point", value: `${n}+${Math.abs(m)}i`, note: "Complex numbers need a plane, not only a number line." },
  ], "Complex-number visuals must show real and imaginary axes.");
  if (lessonId === 64) return common("Place-value expansion", "digits", [
    { label: "Number", value: String(n), note: "Each digit gets value from its position." },
    { label: "Expanded", value: expandedPlaceValue(n), note: "Expanded form shows digit times place." },
    { label: "Chosen digit", value: String(m), note: "A digit changes value when its place changes." },
  ], "Place-value visuals should expose digit-place products.");
  if (lessonId === 65) return common("Factor pair check", "divides exactly", [
    { label: "Number", value: String(n), note: "A factor must divide this number exactly." },
    { label: "Candidate", value: String(m), note: "Test the candidate by division." },
    { label: "Remainder", value: String(n % Math.max(1, m)), note: "Remainder zero means the candidate is a factor." },
  ], "Factor visuals must show exact division and remainder.");
  if (lessonId === 66) return common("Multiple skip-count list", "products", [
    { label: "Base", value: String(n), note: "Multiples are products of this base." },
    { label: "First multiples", value: multiplesText(n), note: "Skip-counting reveals the list." },
    { label: "Candidate", value: String(m), note: `${m} is ${m % Math.max(1, n) === 0 ? "" : "not "}a multiple of ${n}.` },
  ], "Multiple visuals should show product lists, not factor chips only.");
  if (lessonId === 67) return common("Prime factor-count test", "two factors", [
    { label: "Number", value: String(n), note: "Prime numbers have exactly two positive factors." },
    { label: "Factors", value: factors.join(", "), note: "Count the positive divisors." },
    { label: "Decision", value: isPrime(n) ? "prime" : "not prime", note: "Only 1 and itself means prime." },
  ], "Prime visuals must reveal why the factor count matters.");
  if (lessonId === 68) return common("Prime factor tree", "split to primes", [
    { label: "Number", value: String(n), note: "Start from the composite number." },
    { label: "Prime factors", value: factorization, note: "Keep splitting until every factor is prime." },
    { label: "Check", value: factorization, note: "Multiplying prime factors should rebuild the number." },
  ], "Prime-factorisation visuals must show decomposition and rebuild.");
  if (lessonId === 69) return common("Shared-factor intersection", "HCF/GCD", [
    { label: "First number", value: String(n), note: "List factors for the first number." },
    { label: "Second number", value: String(m), note: "List factors for the second number." },
    { label: "Greatest shared", value: String(gcd(n, m)), note: "The HCF/GCD is the largest common factor." },
  ], "HCF visuals should compare two factor sets.");
  if (lessonId === 70) return common("Shared-multiple ladder", "LCM", [
    { label: "First number", value: String(n), note: "Generate multiples of the first number." },
    { label: "Second number", value: String(m), note: "Generate multiples of the second number." },
    { label: "First shared", value: String(lcm(n, m)), note: "The LCM is the first common positive multiple." },
  ], "LCM visuals should show converging multiple lists.");
  if (lessonId === 71) return common("Divisibility rule audit", "digit sum", [
    { label: "Number", value: String(n), note: "Use the rule for the chosen divisor." },
    { label: "Digit sum", value: String(digitSum(n)), note: "For 9, the digit sum must be divisible by 9." },
    { label: "Decision", value: n % 9 === 0 ? "divisible by 9" : "not divisible by 9", note: "The rule must match exact division." },
  ], "Divisibility visuals must connect shortcut and actual divisibility.");
  if (lessonId === 72) return common("Remainder clock", "mod", [
    { label: "Dividend", value: String(n), note: "This is the number being divided." },
    { label: "Modulus", value: String(Math.max(1, m)), note: "The modulus sets the cycle size." },
    { label: "Remainder", value: String(n % Math.max(1, m)), note: "Modulo keeps the leftover after full cycles." },
  ], "Modular arithmetic visuals should show cycles and remainder.");
  if (lessonId === 73) return common("Base-place conversion", "place powers", [
    { label: "Digits", value: String(n), note: "Read each digit in the chosen base." },
    { label: "Base", value: String(Math.max(2, m)), note: "Each place is a power of the base." },
    { label: "Caution", value: "digit < base", note: "Every digit must be allowed in that base." },
  ], "Base-system visuals must show place powers and valid digits.");
  if (lessonId === 74) return common("Nested-fraction layers", "inside out", [
    { label: "Whole part", value: String(n), note: "Continued fractions begin with a whole layer." },
    { label: "Next denominator", value: String(m), note: "The next layer sits inside a denominator." },
    { label: "Method", value: "inside outward", note: "Evaluate the deepest fraction first." },
  ], "Continued-fraction visuals should expose nested layers.");
  if (lessonId === 75) return common("Equal-parts fraction model", "same whole", [
    { label: "Denominator", value: String(n), note: "The whole is split into this many equal parts." },
    { label: "Numerator", value: String(m), note: "This many parts are selected." },
    { label: "Value", value: `${m}/${n}`, note: "The fraction compares selected parts with one whole." },
  ], "Fraction-model visuals must show equal parts of the same whole.");
  if (lessonId === 76) return common("Equivalent-fraction scaling", "same factor", [
    { label: "Original", value: `${n}/${m}`, note: "Start from one fraction." },
    { label: "Scale by", value: "2", note: "Multiply numerator and denominator by the same non-zero number." },
    { label: "Equivalent", value: `${n * 2}/${m * 2}`, note: "The value stays the same." },
  ], "Equivalent-fraction visuals must show same-factor scaling.");
  if (lessonId === 77) return common("Common-unit comparison", "compare", [
    { label: "Fraction A", value: `${n}/${m}`, note: "Convert or cross-check with a common unit." },
    { label: "Fraction B", value: `${m}/${n + m}`, note: "Compare using consistent wholes." },
    { label: "Decimal A", value: (n / Math.max(1, m)).toFixed(3), note: "Decimal form is one valid comparison view." },
  ], "Fraction comparison visuals must make common units explicit.");
  if (lessonId === 78) return common("Fraction-operation denominator check", "operate", [
    { label: "First denominator", value: String(n), note: "Addition/subtraction need common denominators." },
    { label: "Second denominator", value: String(m), note: "Unlike denominators must be converted first." },
    { label: "Common denominator", value: String(lcm(n, m)), note: "Use the least common multiple for a clean denominator." },
  ], "Fraction-operation visuals must prevent adding denominators directly.");
  if (lessonId === 79) return common("Decimal place-value alignment", "tenths/hundredths", [
    { label: "First decimal", value: (n / 100).toFixed(2), note: "Trailing zeros help align places." },
    { label: "Second decimal", value: (m / 100).toFixed(2), note: "Compare tenths before hundredths." },
    { label: "Decision", value: compareText(n, m), note: "Aligned place values decide the order." },
  ], "Decimal comparison visuals must align places.");
  if (lessonId === 80) return common("Decimal-operation columns", "align point", [
    { label: "First value", value: (n / 10).toFixed(1), note: "Write decimals in columns." },
    { label: "Second value", value: (m / 100).toFixed(2), note: "Line up decimal points." },
    { label: "Sum", value: ((n / 10) + (m / 100)).toFixed(2), note: "Operate place by place." },
  ], "Decimal-operation visuals should show column alignment.");
  if (lessonId === 81) return common("Fraction-decimal bridge", "divide", [
    { label: "Fraction", value: `${n}/${m}`, note: "A fraction is division." },
    { label: "Division", value: `${n} / ${m}`, note: "Divide numerator by denominator." },
    { label: "Decimal", value: (n / Math.max(1, m)).toFixed(3), note: "The decimal names the same value." },
  ], "Conversion visuals should show value preserved across forms.");
  if (lessonId === 82) return common("Recurring remainder loop", "repeat", [
    { label: "Fraction", value: `${n}/${m}`, note: "Some divisions do not terminate." },
    { label: "Remainder idea", value: "repeats", note: "A repeated remainder creates repeating digits." },
    { label: "Decimal sample", value: (n / Math.max(1, m)).toFixed(6), note: "A calculator display may truncate the repeating pattern." },
  ], "Recurring-decimal visuals must distinguish rounded display from exact repeat.");
  if (lessonId === 83) return common("Ratio order model", "a:b", [
    { label: "First part", value: String(n), note: "The first part represents one quantity." },
    { label: "Second part", value: String(m), note: "The second part represents another quantity." },
    { label: "Total parts", value: String(n + m), note: "Share models use the total number of ratio parts." },
  ], "Ratio visuals must preserve order and part-to-part meaning.");
  if (lessonId === 84) return common("Proportion equal-ratio check", "scale", [
    { label: "Known ratio", value: `${n}:${m}`, note: "Use a single scale factor." },
    { label: "Cross product", value: `${n}x? = ${m}x?`, note: "Equivalent ratios have matching cross-products." },
    { label: "Scale rule", value: "same factor", note: "Both parts must scale together." },
  ], "Proportion visuals should expose equal-ratio structure.");
  if (lessonId === 85) return common("Direct proportion table", "y=kx", [
    { label: "Quantity", value: String(n), note: "More input creates proportionally more output." },
    { label: "Cost", value: String(m), note: "Find the constant rate first." },
    { label: "Unit rate", value: (m / Math.max(1, n)).toFixed(2), note: "Direct proportion keeps y/x constant." },
  ], "Direct-proportion visuals need a constant multiplier table.");
  if (lessonId === 86) return common("Inverse proportion product", "xy=k", [
    { label: "Product", value: String(n), note: "The product stays constant." },
    { label: "One value", value: String(m), note: "Increasing one side decreases the other." },
    { label: "Other value", value: (n / Math.max(1, m)).toFixed(2), note: "Divide the constant product by the chosen value." },
  ], "Inverse-proportion visuals must show constant product.");
  if (lessonId === 87) return common("Unit-rate per-one model", "per 1", [
    { label: "Total", value: String(n), note: "Start from the full quantity or cost." },
    { label: "Units", value: String(m), note: "Divide by the number of units." },
    { label: "Per one", value: (n / Math.max(1, m)).toFixed(2), note: "The unit rate names one unit's share." },
  ], "Unit-rate visuals should always show the per-one division.");
  if (lessonId === 88) return common("Hundred-grid percent model", "out of 100", [
    { label: "Percent", value: `${n}%`, note: "Percent means parts per hundred." },
    { label: "Fraction", value: `${n}/100`, note: "The denominator is the fixed whole of 100." },
    { label: "Decimal", value: (n / 100).toFixed(2), note: "Divide by 100 to get decimal form." },
  ], "Percentage visuals must show grid, fraction, and decimal together.");
  if (lessonId === 89) return common("Percentage-change baseline", "original base", [
    { label: "Original", value: String(n), note: "Percentage change uses the original as base." },
    { label: "New", value: String(m), note: "Compare new amount with original amount." },
    { label: "Change %", value: `${(((m - n) / Math.max(1, n)) * 100).toFixed(1)}%`, note: "Change divided by original, then multiplied by 100." },
  ], "Percentage-change visuals must identify the base amount.");
  if (lessonId === 90) return common("Compound-change stages", "latest base", [
    { label: "Start", value: String(n), note: "Begin with the original amount." },
    { label: "Rate", value: `${m}%`, note: "Each stage multiplies the latest amount." },
    { label: "After two stages", value: (n * (1 + m / 100) * (1 + m / 100)).toFixed(2), note: "Compound change updates the base every time." },
  ], "Compound-change visuals must show stage-by-stage updating.");
  if (lessonId === 91) return common("Scale-factor drawing", "same multiplier", [
    { label: "Map length", value: `${n} cm`, note: "Measure the drawing length." },
    { label: "Scale", value: `1 cm : ${m} km`, note: "Use one consistent scale factor." },
    { label: "Real length", value: `${n * m} km`, note: "Multiply map length by the scale." },
  ], "Scale-drawing visuals must connect drawing length, scale, and real length.");
  return common("Number concept trace", "checked", [
    { label: "Value", value: String(n), note: "Inspect the selected number." },
    { label: "Compare", value: String(m), note: "Use a second value when comparison matters." },
    { label: "Classification", value: classificationFor(lessonId, n), note: "The result should match the lesson rule." },
  ], "Every number lesson needs a concept-specific trace.");
}

function FractionModel({ numerator, denominator, fraction }: { numerator: number; denominator: number; fraction: number }) {
  const pieces = Math.min(24, Math.max(2, denominator));
  const filled = Math.min(pieces, Math.round(fraction * pieces));
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-8" role="img" aria-label={`${numerator} divided by ${denominator} equals ${(numerator / denominator).toFixed(3)}`}>
      <div className="grid h-24 overflow-hidden rounded-2xl border-2 border-slate-700" style={{ gridTemplateColumns: `repeat(${pieces}, minmax(0, 1fr))` }}>
        {Array.from({ length: pieces }, (_, index) => <div key={index} className={index < filled ? "border-r border-white/60 bg-cyan-500" : "border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"} />)}
      </div>
      <div className="relative h-4 rounded-full bg-slate-200 dark:bg-slate-700"><div className="absolute inset-y-0 left-0 rounded-full bg-amber-400" style={{ width: `${Math.min(100, fraction * 100)}%` }} /></div>
      <p className="text-center font-mono text-2xl font-black">{numerator}/{denominator} = {(numerator / denominator).toFixed(3)}</p>
    </div>
  );
}

function NumberModel({ value, factors, lessonId }: { value: number; factors: number[]; lessonId: number }) {
  const position = ((value + 60) / 120) * 100;
  const ticks = lessonId === 59 ? [-10, -5, 0, 5, 10] : lessonId === 58 ? [0, 5, 10, 15, 20] : [1, 5, 10, 15, 20];
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-8" role="img" aria-label={`Number ${value}; ${classificationFor(lessonId, value)}; factors ${factors.join(", ")}`}>
      <div className="relative mx-4 h-2 rounded-full bg-slate-300 dark:bg-slate-700">
        <span className="absolute -top-4 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-white bg-cyan-500 shadow" style={{ left: `${Math.min(100, Math.max(0, position))}%` }} />
        {ticks.map((tick) => <span key={tick} className="absolute top-5 -translate-x-1/2 text-xs font-bold" style={{ left: `${Math.min(100, Math.max(0, ((tick + 60) / 120) * 100))}%` }}>{tick}</span>)}
      </div>
      <div className="rounded-xl bg-white p-3 text-center dark:bg-white/10">
        <p className="text-sm font-black text-slate-700 dark:text-slate-100">{classificationFor(lessonId, value)}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-300">{comparisonLessonText(lessonId)}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">{factors.map((factor) => <span key={factor} className="rounded-xl bg-cyan-100 px-3 py-2 font-mono font-black text-cyan-900 dark:bg-cyan-400/15 dark:text-cyan-100">{factor}</span>)}</div>
    </div>
  );
}

function PercentModel({ percent }: { percent: number }) {
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-5" role="img" aria-label={`${percent} percent equals ${percent} out of 100 and decimal ${(percent / 100).toFixed(2)}`}>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 100 }, (_, index) => <span key={index} className={index < percent ? "aspect-square rounded-sm bg-cyan-500" : "aspect-square rounded-sm bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"} />)}
      </div>
      <p className="text-center font-mono text-2xl font-black">{percent}% = {percent}/100 = {(percent / 100).toFixed(2)}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl bg-slate-100 p-2 dark:bg-white/10"><span className="block text-[10px] font-bold uppercase text-slate-500">{label}</span><strong className="block truncate font-mono text-sm">{value}</strong></div>;
}

function initialN(lessonId: number) {
  if (lessonId === 57) return 5;
  if (lessonId === 58) return 0;
  if (lessonId === 59) return -4;
  if (lessonId === 60) return 3;
  if (lessonId === 61) return 2;
  if (lessonId === 62) return -5;
  if (lessonId === 63) return 3;
  if (lessonId === 64) return 5381;
  if (lessonId === 65) return 42;
  if (lessonId === 66) return 9;
  if (lessonId === 67) return 17;
  if (lessonId === 68) return 24;
  if (lessonId === 69) return 18;
  if (lessonId === 70) return 6;
  if (lessonId === 71) return 234;
  if (lessonId === 72) return 23;
  if (lessonId === 73) return 110;
  if (lessonId === 74) return 2;
  if (lessonId === 75) return 4;
  if (lessonId === 76) return 3;
  if (lessonId === 77) return 3;
  if (lessonId === 78) return 2;
  if (lessonId === 79) return 50;
  if (lessonId === 80) return 34;
  if (lessonId === 81) return 3;
  if (lessonId === 82) return 3;
  if (lessonId === 83) return 2;
  if (lessonId === 84) return 2;
  if (lessonId === 85) return 3;
  if (lessonId === 86) return 24;
  if (lessonId === 87) return 300;
  if (lessonId === 89) return 80;
  if (lessonId === 90) return 100;
  if (lessonId === 91) return 4;
  if (lessonId === 88) return 25;
  return 8 + lessonId % 16;
}

function initialM(lessonId: number) {
  if (lessonId === 60) return 4;
  if (lessonId === 61) return 3;
  if (lessonId === 64) return 5;
  if (lessonId === 65) return 6;
  if (lessonId === 66) return 36;
  if (lessonId === 67) return 2;
  if (lessonId === 68) return 3;
  if (lessonId === 69) return 24;
  if (lessonId === 70) return 8;
  if (lessonId === 71) return 9;
  if (lessonId === 72) return 7;
  if (lessonId === 73) return 2;
  if (lessonId === 74) return 3;
  if (lessonId === 75) return 3;
  if (lessonId === 76) return 4;
  if (lessonId === 77) return 4;
  if (lessonId === 78) return 3;
  if (lessonId === 79) return 47;
  if (lessonId === 80) return 125;
  if (lessonId === 81) return 4;
  if (lessonId === 82) return 9;
  if (lessonId === 83) return 3;
  if (lessonId === 84) return 9;
  if (lessonId === 85) return 90;
  if (lessonId === 86) return 8;
  if (lessonId === 87) return 5;
  if (lessonId === 89) return 100;
  if (lessonId === 90) return 10;
  if (lessonId === 91) return 5;
  return 3 + lessonId % 9;
}

function rangeFor(lessonId: number, isFraction: boolean) {
  if (lessonId === 57) return { nMin: 1, nMax: 30, mMin: 1, mMax: 30 };
  if (lessonId === 58) return { nMin: 0, nMax: 30, mMin: 0, mMax: 30 };
  if (lessonId === 59) return { nMin: -30, nMax: 30, mMin: -30, mMax: 30 };
  if (lessonId === 64) return { nMin: 100, nMax: 9999, mMin: 0, mMax: 9 };
  if ([65, 66, 67, 68, 69, 70].includes(lessonId)) return { nMin: 2, nMax: 100, mMin: 1, mMax: 100 };
  if ([71, 72, 73, 74, 76, 77, 78, 79, 80, 81].includes(lessonId)) return { nMin: 1, nMax: 250, mMin: 1, mMax: 100 };
  if ([82, 83, 84, 85, 86, 87, 89, 90, 91].includes(lessonId)) return { nMin: 1, nMax: 500, mMin: 1, mMax: 500 };
  if (lessonId === 88) return { nMin: 0, nMax: 100, mMin: 0, mMax: 0 };
  if (isFraction) return { nMin: 2, nMax: 60, mMin: 1, mMax: 30 };
  return { nMin: 2, nMax: 60, mMin: 1, mMax: 30 };
}

function classificationFor(lessonId: number, value: number) {
  if (lessonId === 57) return value >= 1 && Number.isInteger(value) ? "natural counting number" : "not natural here";
  if (lessonId === 58) return value >= 0 && Number.isInteger(value) ? "whole number" : "not whole";
  if (lessonId === 59) return Number.isInteger(value) ? value > 0 ? "positive integer" : value < 0 ? "negative integer" : "zero integer" : "not an integer";
  if (lessonId === 60) return `${value}/${Math.max(1, Math.abs(value + 1))} is rational when denominator is not zero`;
  if (lessonId === 61) return value >= 0 ? `sqrt(${value}) may be irrational unless ${value} is a perfect square` : "negative radicand is not real";
  if (lessonId === 62) return "real number-line value";
  if (lessonId === 63) return `complex point ${value}+${Math.abs(value + 1)}i`;
  if (lessonId === 64) return `expanded form uses digit places`;
  if (lessonId === 65) return "factor check: exact divisors split the number";
  if (lessonId === 66) return "multiple check: products make skip-count lists";
  if (lessonId === 67) return isPrime(value) ? "prime number" : "not prime";
  if (lessonId === 68) return `prime factors: ${factorizationText(value)}`;
  if (lessonId === 69) return "HCF/GCD uses shared factors";
  if (lessonId === 70) return "LCM uses shared multiples";
  if (lessonId === 71) return value % 9 === 0 ? "divisible by 9 using digit sum" : "not divisible by 9";
  if (lessonId === 72) return `remainder model: ${value} mod ${Math.max(1, Math.abs(value - 16))}`;
  if (lessonId === 73) return "base-system place values";
  if (lessonId === 74) return "continued fraction layer";
  if (lessonId === 75) return "fraction model shows equal parts of one whole";
  if (lessonId === 76) return "equivalent fraction scaling";
  if (lessonId === 77) return "fraction comparison";
  if (lessonId === 78) return "fraction operation needs valid denominator rules";
  if (lessonId === 79) return "decimal place-value comparison";
  if (lessonId === 80) return "decimal operation alignment";
  if (lessonId === 81) return "fraction and decimal name the same rational value";
  if (lessonId === 82) return "recurring decimal pattern";
  if (lessonId === 83) return "ratio compares quantities in order";
  if (lessonId === 84) return "proportion keeps equal ratios";
  if (lessonId === 85) return "direct proportion uses a constant multiplier";
  if (lessonId === 86) return "inverse proportion keeps product constant";
  if (lessonId === 87) return "unit rate means per one unit";
  if (lessonId === 88) return "percent model uses a 100-grid";
  if (lessonId === 89) return "percentage change uses original as base";
  if (lessonId === 90) return "compound change updates the base each period";
  if (lessonId === 91) return "scale drawing uses one scale factor";
  return "number";
}

function compareText(value: number, compare: number) {
  if (value === compare) return `${value} = ${compare}`;
  return value > compare ? `${value} > ${compare}` : `${value} < ${compare}`;
}

function nearestSquareText(value: number) {
  const root = Math.max(0, Math.round(Math.sqrt(Math.max(0, value))));
  return `${root}^2=${root * root}`;
}

function expandedPlaceValue(value: number) {
  const digits = String(Math.abs(Math.round(value))).split("").map(Number);
  const parts = digits.map((digit, index) => {
    const place = 10 ** (digits.length - index - 1);
    return digit ? `${digit}x${place}` : "";
  }).filter(Boolean);
  return parts.length ? parts.join(" + ") : "0";
}

function multiplesText(value: number) {
  const base = Math.max(1, Math.abs(Math.round(value)));
  return [1, 2, 3, 4].map((factor) => base * factor).join(", ");
}

function digitSum(value: number) {
  return String(Math.abs(Math.round(value))).split("").reduce((total, digit) => total + Number(digit), 0);
}

function gcd(left: number, right: number) {
  let a = Math.abs(Math.round(left));
  let b = Math.abs(Math.round(right));
  while (b) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || 1;
}

function euclideanSteps(left: number, right: number) {
  const steps: Array<{ a: number; b: number; quotient: number; remainder: number }> = [];
  let a = Math.max(Math.abs(Math.round(left)), Math.abs(Math.round(right)));
  let b = Math.min(Math.abs(Math.round(left)), Math.abs(Math.round(right)));
  if (!b) return steps;
  while (b && steps.length < 8) {
    const quotient = Math.floor(a / b);
    const remainder = a % b;
    steps.push({ a, b, quotient, remainder });
    a = b;
    b = remainder;
  }
  return steps;
}

function lcm(left: number, right: number) {
  const a = Math.abs(Math.round(left));
  const b = Math.abs(Math.round(right));
  if (!a || !b) return 0;
  return (a * b) / gcd(a, b);
}

function comparisonLessonText(lessonId: number) {
  if (lessonId === 57) return "Natural numbers start at 1 in this lesson.";
  if (lessonId === 58) return "Whole numbers include zero.";
  if (lessonId === 59) return "Farther right means greater.";
  if (lessonId === 60) return "Rational numbers can be written as a/b.";
  if (lessonId === 61) return "Non-ending, non-repeating decimals are irrational.";
  if (lessonId === 62) return "Real numbers lie on the number line.";
  if (lessonId === 63) return "Complex numbers use a real part and an imaginary part.";
  if (lessonId === 64) return "A digit's place changes its value.";
  if (lessonId === 65) return "Factors divide exactly.";
  if (lessonId === 66) return "Multiples are made by multiplying.";
  if (lessonId === 67) return "Prime numbers have exactly two positive factors.";
  if (lessonId === 68) return "Keep splitting until all factors are prime.";
  if (lessonId === 69) return "HCF is the greatest shared factor.";
  if (lessonId === 70) return "LCM is the first shared positive multiple.";
  if (lessonId === 71) return "Use the rule for the chosen divisor only.";
  if (lessonId === 72) return "Keep the remainder, not the quotient.";
  if (lessonId === 73) return "Digits must be allowed in the chosen base.";
  if (lessonId === 74) return "Evaluate nested fractions from inside outward.";
  if (lessonId === 75) return "Fraction models show selected parts of one whole.";
  if (lessonId === 76) return "Scale numerator and denominator by the same non-zero factor.";
  if (lessonId === 77) return "Compare fractions using common units.";
  if (lessonId === 78) return "Common denominators are needed for addition and subtraction.";
  if (lessonId === 79) return "Trailing zeros can help compare decimals.";
  if (lessonId === 80) return "Line up decimal points for addition and subtraction.";
  if (lessonId === 81) return "Divide numerator by denominator to get decimal form.";
  if (lessonId === 82) return "A repeating remainder creates a recurring decimal.";
  if (lessonId === 83) return "Ratio order matters.";
  if (lessonId === 84) return "Both ratios must scale by the same factor.";
  if (lessonId === 85) return "Direct proportion has form y = kx.";
  if (lessonId === 86) return "Inverse proportion has constant product.";
  if (lessonId === 87) return "Divide by the number of units to find per one.";
  if (lessonId === 88) return "Percent means out of 100.";
  if (lessonId === 89) return "Use original amount as the base.";
  if (lessonId === 90) return "Apply each percent change to the latest amount.";
  if (lessonId === 91) return "Scale every length by the same factor.";
  return "Use the selected value to inspect number facts.";
}

function isPrime(value: number) {
  const n = Math.abs(Math.round(value));
  if (n <= 1) return false;
  for (let factor = 2; factor * factor <= n; factor += 1) {
    if (n % factor === 0) return false;
  }
  return true;
}

function factorizationText(value: number) {
  return formatFactorization(primeFactorization(Math.max(2, Math.abs(Math.round(value)))));
}
