import { useEffect, useMemo, useState } from "react";
import { symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicPartialFractions, symbolicSimplify, symbolicSolve, symbolicSubstitute, type SymbolicResult } from "../../../utils/symbolic";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { DifferentialEquationActivity } from "./p0/PriorityConceptActivities";

type CasPreset = { command: string; expression: string; execute: (expression: string) => SymbolicResult };
function presetFor(title: string): CasPreset {
  const name = title.toLowerCase();
  if (name.includes("expand")) return { command: "Expand", expression: "(x+2)*(x-3)", execute: symbolicExpand };
  if (name.includes("factor")) return { command: "Factor", expression: "x^2-x-6", execute: symbolicFactor };
  if (name.includes("solve")) return { command: "Solve", expression: "x^2-5*x+6=0", execute: (value) => symbolicSolve(value) };
  if (name.includes("partial")) return { command: "Partial fractions", expression: "1/((x+1)*(x+2))", execute: symbolicPartialFractions };
  if (name.includes("substitut")) return { command: "Substitute x=3", expression: "x^2+2*x", execute: (value) => symbolicSubstitute(value, [{ name: "x", value: "3" }]) };
  if (name.includes("derivative") || name.includes("differentiat")) return { command: "Differentiate", expression: "x^3+2*x", execute: symbolicDerivative };
  if (name.includes("integral") || name.includes("integrat")) return { command: "Integrate", expression: "3*x^2+2", execute: symbolicIntegral };
  return { command: "Simplify", expression: "2*x+3*x-x+4-2", execute: symbolicSimplify };
}

export default function CasLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.preset.id === "cas.first-order-ode") return <AdapterFrame title={`${props.lesson.title} · differential-equation lab`} footer="The slope field and Euler path are recalculated from the selected equation and initial condition."><DifferentialEquationActivity {...props}/></AdapterFrame>;
  return <LegacyCasLessonAdapter {...props}/>;
}

function LegacyCasLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const preset = useMemo(() => presetFor(lesson.title), [lesson.title]);
  const [expression, setExpression] = useState(preset.expression); const [step, setStep] = useState(0);
  useEffect(() => { setExpression(preset.expression); setStep(0); }, [preset, resetToken]);
  const output = useMemo(() => { try { return preset.execute(expression); } catch (error) { return { result: "Input needs adjustment", detail: error instanceof Error ? error.message : "CAS error", steps: [] } as SymbolicResult; } }, [expression, preset]);
  return <AdapterFrame title={`${lesson.title} · CAS workspace`} value={output.result} footer="Exact results, restrictions, and steps are produced by the existing symbolic engine.">
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="rounded-xl bg-slate-950 p-4 text-white"><label className="text-[10px] font-black uppercase tracking-wide text-cyan-300">{preset.command}</label><input value={expression} onChange={(event) => { setExpression(event.target.value); setStep(0); onInteraction(); }} className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3 font-mono text-sm text-white outline-none focus:border-cyan-400" aria-label="CAS expression" /><div className="mt-4 rounded-xl bg-white/10 p-4"><span className="text-[10px] font-black uppercase text-emerald-300">Exact result</span><output className="mt-2 block break-words font-mono text-lg font-black">{output.result}</output></div></div><div className="space-y-3"><div className="min-h-36 rounded-xl bg-slate-100 p-3 dark:bg-white/10"><span className="text-[10px] font-black uppercase text-cyan-600">Step {Math.min(step + 1, Math.max(1, output.steps.length))}</span><p className="mt-2 text-sm leading-6">{output.steps[step] ?? output.detail}</p></div><button type="button" className="action-secondary w-full justify-center" onClick={() => { setStep((value) => Math.min(value + 1, Math.max(0, output.steps.length - 1))); onInteraction(); }}>Next symbolic step</button>{output.restrictions?.length ? <p className="rounded-xl bg-amber-100 p-2 text-xs font-bold text-amber-900">Domain: {output.restrictions.join(", ")}</p> : null}</div></div>
  </AdapterFrame>;
}
