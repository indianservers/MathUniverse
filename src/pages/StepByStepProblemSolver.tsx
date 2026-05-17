import katex from "katex";
import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { CopyResultButton, PresetChips, PrintWorksheetButton, RelatedToolLinks, ResetExampleButton } from "../components/ui/UiFeedback";
import { symbolicLatex, symbolicSimplify, symbolicSolve, trySymbolic } from "../utils/symbolic";

const examples = ["2*x+5=11", "x^2-5*x+6=0", "-2*x+4=8", "x^3+2*x^2"];

export default function StepByStepProblemSolver() {
  const [equation, setEquation] = useState("2*x+5=17");
  const solution = useMemo(() => trySymbolic(() => symbolicSolve(equation, "x")), [equation]);
  const simplified = useMemo(() => trySymbolic(() => symbolicSimplify(equation.includes("=") ? equation.split("=")[0] : equation)), [equation]);
  const steps = solution?.steps ?? simplified?.steps ?? ["Enter an equation such as 2*x+5=17."];

  return (
    <div className="space-y-6">
      <TopicHeader title="Step-by-Step Problem Solver" subtitle="Enter an equation and inspect the algebraic path with Nerdamer-backed exact math." difficulty="Algebra Tool" estimatedMinutes={7} />
      <SectionCard title="Equation Input" description="Use Ctrl/Cmd+Enter in keyboard-enabled inputs elsewhere; here the solver updates as you type.">
        <div className="sticky top-20 z-20 mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
          <CopyResultButton value={solution?.result} />
          <ResetExampleButton onClick={() => setEquation("2*x+5=11")} />
          <PrintWorksheetButton />
          <RelatedToolLinks links={[{ label: "Calculator", route: "/calculator" }, { label: "Equation Solver", route: "/math-lab/equation-solver" }]} />
        </div>
        <input className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-lg dark:border-white/10 dark:bg-slate-950/60" value={equation} onChange={(event) => setEquation(event.target.value)} />
        <div className="mt-4"><PresetChips examples={examples} onSelect={setEquation} /></div>
      </SectionCard>
      <SectionCard title="Animated Algebra Steps">
        <div className="space-y-3">
          {steps.map((step, index) => <MathStep key={`${step}-${index}`} index={index + 1} text={step} />)}
          {solution?.result && <div className="rounded-2xl bg-cyan-50 p-5 dark:bg-cyan-400/10"><RenderedMath value={solution.result} /></div>}
        </div>
      </SectionCard>
    </div>
  );
}

function MathStep({ index, text }: { index: number; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"><p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {index}</p><p className="mt-2 text-sm leading-6">{text}</p></div>;
}

function RenderedMath({ value }: { value: string }) {
  const html = useMemo(() => katex.renderToString(symbolicLatex(value), { displayMode: true, throwOnError: false }), [value]);
  return <div className="overflow-x-auto [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />;
}
