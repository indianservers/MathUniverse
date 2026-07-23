import { useEffect, useMemo, useState } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import { symbolicCompleteSquare, symbolicExpand, symbolicFactor, symbolicSimplify, symbolicSolve, symbolicSolveInequality, symbolicSubstitute, type SymbolicResult } from "../../../utils/symbolic";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

function run(title: string, coefficient: number): { input: string; output: SymbolicResult } {
  const name = title.toLowerCase();
  if (name.includes("inequal")) { const input = `${coefficient}*x+2>8`; return { input, output: symbolicSolveInequality(input) }; }
  if (name.includes("equation") || name.includes("formula") || name.includes("root")) { const input = `${coefficient}*x+2=8`; return { input, output: symbolicSolve(input) }; }
  if (name.includes("factor")) { const input = `x^2+${coefficient + 2}*x+${coefficient * 2}`; return { input, output: symbolicFactor(input) }; }
  if (name.includes("expand") || name.includes("bracket")) { const input = `(x+${coefficient})*(x+2)`; return { input, output: symbolicExpand(input) }; }
  if (name.includes("substitut")) { const input = `${coefficient}*x^2+2*x`; return { input, output: symbolicSubstitute(input, [{ name: "x", value: "3" }]) }; }
  if (name.includes("square")) { const input = `x^2+${coefficient * 2}*x+1`; return { input, output: symbolicCompleteSquare(input) }; }
  const input = `${coefficient}*x+2*x-x+4-2`; return { input, output: symbolicSimplify(input) };
}

export default function AlgebraCasLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const initial = lesson.id % 4 + 2;
  const [coefficient, setCoefficient] = useState(initial);
  const [step, setStep] = useState(0);
  useEffect(() => { setCoefficient(initial); setStep(0); }, [initial, resetToken]);
  const model = useMemo(() => { try { return run(lesson.title, coefficient); } catch (error) { return { input: "x", output: { result: "Try another value", detail: error instanceof Error ? error.message : "CAS error", steps: [] } as SymbolicResult }; } }, [coefficient, lesson.title]);
  return <AdapterFrame title={`${lesson.title} · balance + CAS`} value={model.output.result} footer="The symbolic result and reveal steps come from the existing CAS engine, not string matching.">
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-black uppercase text-slate-500">Expression</p><div className="mt-3 flex min-h-28 items-center justify-center gap-3" aria-label={`Algebra model for ${model.input}`}><div className="rounded-xl border-2 border-cyan-400 bg-cyan-100 px-5 py-4 font-mono font-black text-cyan-950">{model.input}</div><span className="text-2xl font-black">→</span><div className="rounded-xl border-2 border-emerald-400 bg-emerald-100 px-5 py-4 font-mono font-black text-emerald-950">{model.output.result}</div></div><div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-950"><span className="text-[10px] font-black uppercase text-cyan-600">Step {Math.min(step + 1, Math.max(1, model.output.steps.length))}</span><p className="mt-1">{model.output.steps[step] ?? model.output.detail}</p></div></div><div className="space-y-3"><SliderControl density="compact" label="Coefficient" value={coefficient} min={1} max={8} step={1} onChange={(value) => { setCoefficient(value); setStep(0); onInteraction(); }} /><button type="button" className="action-secondary w-full justify-center" onClick={() => { setStep((value) => Math.min(value + 1, Math.max(0, model.output.steps.length - 1))); onInteraction(); }}>Reveal next step</button><p className="rounded-xl bg-slate-100 p-3 font-mono text-sm dark:bg-white/10">{model.input}</p></div></div>
  </AdapterFrame>;
}
