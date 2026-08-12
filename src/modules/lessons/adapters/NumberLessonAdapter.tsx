import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { factorsOf, formatFactorization, primeFactorization } from "../../../visual-proofs/utils/numberTheoryMath";
import AdapterFrame from "../components/AdapterFrame";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { LessonAdapterProps } from "../types";

export default function NumberLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const strengthened = getStrengthenedFoundationLesson(lesson.id);
  const [n, setN] = useState(initialN(lesson.id));
  const [m, setM] = useState(initialM(lesson.id));
  const isFraction = /fraction|decimal|ratio|proportion|rate|percentage|change|scale/i.test(`${lesson.topic} ${lesson.title}`);
  const isPercent = lesson.id === 88;
  const range = rangeFor(lesson.id, isFraction);

  useEffect(() => { setN(initialN(lesson.id)); setM(initialM(lesson.id)); }, [lesson.id, resetToken]);
  const changeN = (value: number) => { setN(Math.round(value)); onInteraction(); };
  const changeM = (value: number) => { setM(Math.round(value)); onInteraction(); };
  const fraction = isPercent ? Math.min(1, n / 100) : Math.min(1, m / Math.max(1, n));
  const factors = useMemo(() => factorsOf(Math.abs(n) || 1), [n]);
  const factorization = useMemo(() => formatFactorization(primeFactorization(Math.max(2, Math.abs(n)))), [n]);

  return (
    <AdapterFrame title={`${lesson.title} manipulative`} value={isPercent ? `${n}%` : isFraction ? `${m}/${n}` : String(n)} footer={strengthened?.interaction.learningPurpose ?? "Uses the existing number-theory utilities for factors, prime factorisation, GCD, and LCM."}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          {isPercent ? <PercentModel percent={n} /> : isFraction ? <FractionModel numerator={m} denominator={n} fraction={fraction} /> : <NumberModel value={n} factors={factors} lessonId={lesson.id} />}
        </div>
        <div className="space-y-3">
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
  if (lessonId === 89) return "percentage change uses original as base";
  if (lessonId === 90) return "compound change updates the base each period";
  if (lessonId === 91) return "scale drawing uses one scale factor";
  return "number";
}

function compareText(value: number, compare: number) {
  if (value === compare) return `${value} = ${compare}`;
  return value > compare ? `${value} > ${compare}` : `${value} < ${compare}`;
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
