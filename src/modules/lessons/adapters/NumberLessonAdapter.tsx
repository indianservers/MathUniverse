import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { factorsOf, formatFactorization, gcd, lcm, primeFactorization } from "../../../visual-proofs/utils/numberTheoryMath";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

export default function NumberLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [n, setN] = useState(8 + lesson.id % 16);
  const [m, setM] = useState(3 + lesson.id % 9);
  const isFraction = /fraction|decimal|ratio|proportion|rate|percentage|change|scale/i.test(`${lesson.topic} ${lesson.title}`);

  useEffect(() => { setN(8 + lesson.id % 16); setM(3 + lesson.id % 9); }, [lesson.id, resetToken]);
  const changeN = (value: number) => { setN(Math.round(value)); onInteraction(); };
  const changeM = (value: number) => { setM(Math.round(value)); onInteraction(); };
  const fraction = Math.min(1, m / Math.max(1, n));
  const factors = useMemo(() => factorsOf(Math.abs(n) || 1), [n]);
  const factorization = useMemo(() => formatFactorization(primeFactorization(Math.max(2, Math.abs(n)))), [n]);

  return (
    <AdapterFrame title={`${lesson.title} manipulative`} value={isFraction ? `${m}/${n}` : String(n)} footer="Uses the existing number-theory utilities for factors, prime factorisation, GCD, and LCM.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          {isFraction ? <FractionModel numerator={m} denominator={n} fraction={fraction} /> : <NumberModel value={n} factors={factors} />}
        </div>
        <div className="space-y-3">
          <SliderGroup title="Change the mathematics">
            <SliderControl density="compact" label={isFraction ? "denominator" : "number"} value={n} min={2} max={60} step={1} onChange={changeN} />
            <SliderControl density="compact" label={isFraction ? "numerator" : "compare"} value={m} min={1} max={30} step={1} onChange={changeM} />
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            <Metric label={isFraction ? "decimal" : "prime factors"} value={isFraction ? (m / n).toFixed(3) : factorization} />
            <Metric label={isFraction ? "percent" : "factor count"} value={isFraction ? `${((m / n) * 100).toFixed(1)}%` : String(factors.length)} />
            <Metric label="GCD" value={String(gcd(n, m))} />
            <Metric label="LCM" value={String(lcm(n, m))} />
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

function NumberModel({ value, factors }: { value: number; factors: number[] }) {
  const position = ((value + 60) / 120) * 100;
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-8" role="img" aria-label={`Number ${value}; factors ${factors.join(", ")}`}>
      <div className="relative mx-4 h-2 rounded-full bg-slate-300 dark:bg-slate-700"><span className="absolute -top-3 h-8 w-1 rounded bg-slate-600" style={{ left: "50%" }} /><span className="absolute -top-4 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-white bg-cyan-500 shadow" style={{ left: `${position}%` }} /><span className="absolute left-1/2 top-5 -translate-x-1/2 text-xs font-bold">0</span></div>
      <div className="flex flex-wrap justify-center gap-2">{factors.map((factor) => <span key={factor} className="rounded-xl bg-cyan-100 px-3 py-2 font-mono font-black text-cyan-900 dark:bg-cyan-400/15 dark:text-cyan-100">{factor}</span>)}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl bg-slate-100 p-2 dark:bg-white/10"><span className="block text-[10px] font-bold uppercase text-slate-500">{label}</span><strong className="block truncate font-mono text-sm">{value}</strong></div>;
}
