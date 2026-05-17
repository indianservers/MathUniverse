import { ArrowLeft, Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import katex from "katex";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../ui/SectionCard";
import MatrixGrid from "./MatrixGrid";
import type { MatrixStep } from "../../utils/matrixOperations";
import type { Matrix } from "../../utils/matrixOperations";

export function MatrixBreadcrumb({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
      <Link to="/" className="hover:text-cyan-600">Math Universe</Link>
      <span>/</span>
      <Link to="/matrices" className="hover:text-cyan-600">Matrices</Link>
      <span>/</span>
      <span className="text-cyan-700 dark:text-cyan-200">{current}</span>
    </div>
  );
}

export function MatrixBackLink() {
  return <Link to="/matrices" className="action-secondary w-fit"><ArrowLeft className="h-4 w-4" />Back to Matrix Operations</Link>;
}

export function MatrixFormulaBlock({ formula, title = "Formula" }: { formula: string; title?: string }) {
  const html = useMemo(() => katex.renderToString(formula, { displayMode: true, throwOnError: false }), [formula]);
  return (
    <div className="rounded-2xl border border-cyan-200/70 bg-cyan-50 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/10">
      <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{title}</p>
      <div className="mt-2 overflow-x-auto [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function StepByStepPanel({ steps, active, onActiveChange }: { steps: MatrixStep[]; active: number; onActiveChange: (index: number) => void }) {
  const [playing, setPlaying] = useState(false);
  const step = steps[Math.min(active, Math.max(steps.length - 1, 0))];

  useEffect(() => {
    if (!playing || !steps.length) return;
    const timer = window.setInterval(() => onActiveChange((active + 1) % steps.length), 1200);
    return () => window.clearInterval(timer);
  }, [active, onActiveChange, playing, steps.length]);

  if (!steps.length) return null;

  return (
    <SectionCard title="Step-by-Step Explanation">
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {active + 1} of {steps.length}</p>
          <h3 className="mt-2 text-xl font-black">{step.title}</h3>
          <p className="mt-2 font-mono text-sm text-slate-700 dark:text-slate-200">{step.formula}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.calculation}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="tool-button" type="button" onClick={() => onActiveChange(Math.max(0, active - 1))}><StepBack className="h-4 w-4" />Previous Step</button>
          <button className="tool-button" type="button" onClick={() => onActiveChange(Math.min(steps.length - 1, active + 1))}><StepForward className="h-4 w-4" />Next Step</button>
          <button className="tool-button" type="button" onClick={() => setPlaying(!playing)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? "Pause" : "Auto Play"}</button>
          <button className="tool-button" type="button" onClick={() => onActiveChange(steps.length - 1)}>Show All Steps</button>
          <button className="tool-button" type="button" onClick={() => onActiveChange(0)}><RotateCcw className="h-4 w-4" />Restart</button>
        </div>
      </div>
    </SectionCard>
  );
}

export function MatrixResult({ matrix, title = "Final Answer" }: { matrix: Matrix; title?: string }) {
  if (!matrix.length) return null;
  return (
    <SectionCard title={title}>
      <div className="flex justify-center">
        <MatrixGrid matrix={matrix} color="result" />
      </div>
    </SectionCard>
  );
}

export function MatrixSizeSelector({
  rows,
  cols,
  minRows = 1,
  maxRows = 4,
  minCols = 1,
  maxCols = 4,
  onResize,
}: {
  rows: number;
  cols: number;
  minRows?: number;
  maxRows?: number;
  minCols?: number;
  maxCols?: number;
  onResize: (rows: number, cols: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <select className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm dark:border-white/10 dark:bg-slate-900" value={rows} onChange={(event) => onResize(Number(event.target.value), cols)}>
        {range(minRows, maxRows).map((value) => <option key={value} value={value}>{value} rows</option>)}
      </select>
      <select className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm dark:border-white/10 dark:bg-slate-900" value={cols} onChange={(event) => onResize(rows, Number(event.target.value))}>
        {range(minCols, maxCols).map((value) => <option key={value} value={value}>{value} cols</option>)}
      </select>
    </div>
  );
}

function range(min: number, max: number) {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

export function MatrixErrorBox({ error }: { error?: string }) {
  if (!error) return null;
  return <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 font-semibold text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100">{error}</div>;
}

export function MatrixPracticeCard({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <SectionCard title="Practice Question">
      <p className="text-lg font-bold">{question}</p>
      <button className="action-secondary mt-4" type="button" onClick={() => setOpen(!open)}>{open ? "Hide Answer" : "Reveal Answer"}</button>
      {open && <p className="mt-4 rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100">{answer}</p>}
    </SectionCard>
  );
}

export function MatrixOperationLayout({
  title,
  subtitle,
  explanation,
  condition,
  formula,
  mistake,
  realWorld,
  children,
}: {
  title: string;
  subtitle: string;
  explanation: string;
  condition: string;
  formula: string;
  mistake: string;
  realWorld: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <MatrixBreadcrumb current={title} />
      <MatrixBackLink />
      <SectionCard className="overflow-hidden border-cyan-200/80 dark:border-cyan-400/20">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500 p-6 text-white">
          <p className="text-sm font-black uppercase text-white/75">Matrix Operations</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90 md:text-base">{subtitle}</p>
        </div>
      </SectionCard>
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Concept Explanation"><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{explanation}</p></SectionCard>
        <SectionCard title="Required Condition"><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{condition}</p></SectionCard>
        <MatrixFormulaBlock formula={formula} />
      </div>
      {children}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Common Mistake"><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{mistake}</p></SectionCard>
        <SectionCard title="Real-World Use"><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{realWorld}</p></SectionCard>
      </div>
      <MatrixBackLink />
    </div>
  );
}
