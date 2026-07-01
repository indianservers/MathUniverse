import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { MathText } from "../../components/ui/MathExpression";
import type { VisualProofShellProps } from "../data/proofTypes";
import ProofExplanationPanel from "./ProofExplanationPanel";
import { ProofStepTimeline } from "./ProofStepTimeline";

export function VisualProofShell({
  title,
  difficulty,
  category,
  route,
  steps,
  activeStep,
  onStepChange,
  canvasContent,
  formulaPanel,
  controlsContent,
  stateInspector,
  summary,
  practiceExit,
  proof,
}: VisualProofShellProps) {
  return (
    <div className="visual-proof-shell space-y-4" data-testid="visual-proof-shell">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
        <Link to="/visual-proofs" className="hover:text-cyan-700 dark:hover:text-cyan-200">Visual Proofs</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-100">{category}</span>
      </nav>

      <section className="rounded-xl border border-cyan-200/30 bg-slate-950 p-4 text-white shadow-2xl shadow-cyan-950/20 lg:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">Shell-ready visual proof</p>
            <h1 className="mt-2 max-w-5xl text-3xl font-black sm:text-4xl">
              <MathText value={title} mathClassName="text-[0.92em]" />
            </h1>
            {summary ? <p className="mt-3 max-w-4xl text-sm leading-6 text-cyan-50/75">{summary}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">{difficulty}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-cyan-50">
              <Clock3 className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              Three-panel proof
            </span>
          </div>
        </div>
      </section>

      {proof ? <ProofExplanationPanel proof={proof} /> : null}

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <main className="min-w-0 space-y-4">
          <section className="visual-proof-responsive-svg overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-sm dark:border-white/10 dark:bg-slate-950/50" aria-label="Primary visual proof canvas" data-visual-proof-canvas="true" data-testid="visual-proof-primary-visual">
            {canvasContent}
          </section>
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            {formulaPanel}
            <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-200" aria-hidden="true" />
                <h2 className="text-base font-black text-slate-950 dark:text-white">Learning loop</h2>
              </div>
              <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-950/40">1. Manipulate the parameter.</span>
                <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-950/40">2. Predict what will stay unchanged.</span>
                <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-950/40">3. Reveal the formula link.</span>
                <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-950/40">4. Practice from the exit.</span>
              </div>
              {practiceExit ? <div className="mt-3">{practiceExit}</div> : null}
            </section>
          </div>
        </main>
        <aside className="visual-proof-controls-wrap min-w-0 space-y-4 xl:sticky xl:top-4 xl:self-start" data-visual-proof-controls="true" data-testid="visual-proof-controls">
          {controlsContent}
          <ProofStepTimeline steps={steps} activeStep={activeStep} onSelectStep={onStepChange} />
          {stateInspector}
          <Link to={route} className="action-secondary rounded-xl">
            Copy lesson link target <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
