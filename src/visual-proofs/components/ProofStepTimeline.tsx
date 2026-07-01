import { CheckCircle2, ChevronLeft, ChevronRight, Eye, ListChecks, Lock, Radio } from "lucide-react";
import { useState } from "react";
import type { ProofStep } from "../data/proofTypes";

type ProofStepTimelineProps = {
  steps: ProofStep[];
  activeStep: number;
  onSelectStep?: (stepIndex: number) => void;
};

export function ProofStepTimeline({ steps, activeStep, onSelectStep }: ProofStepTimelineProps) {
  const [showAllSteps, setShowAllSteps] = useState(false);
  if (!steps.length) return null;

  const safeActiveStep = Math.min(Math.max(activeStep, 0), steps.length - 1);
  const currentStep = steps[safeActiveStep];
  const progress = ((safeActiveStep + 1) / steps.length) * 100;
  const canGoBack = safeActiveStep > 0;
  const canGoForward = safeActiveStep < steps.length - 1;

  function selectStep(stepIndex: number) {
    onSelectStep?.(Math.min(Math.max(stepIndex, 0), steps.length - 1));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]" aria-label="Proof step timeline">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950 dark:text-white">Step timeline</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Follow one idea, then move to the next.</p>
        </div>
        <span className="mini-chip">Step {safeActiveStep + 1} of {steps.length}</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-950/60" aria-hidden="true">
        <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
            {safeActiveStep + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Do now</p>
            <h3 className="mt-1 text-base font-black">{currentStep.title}</h3>
            <p className="mt-1.5 text-sm font-semibold leading-6">{currentStep.description}</p>
            {currentStep.focusLabel ? (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1 text-xs font-black text-cyan-800 dark:bg-slate-950/35 dark:text-cyan-100">
                <Eye className="h-3.5 w-3.5" />
                Look at: {currentStep.focusLabel}
              </p>
            ) : null}
            {currentStep.insight ? (
              <p className="mt-2 rounded-lg bg-white/75 px-2 py-1.5 text-xs font-bold leading-5 text-slate-700 dark:bg-slate-950/35 dark:text-slate-200">
                {currentStep.insight}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <button type="button" className="tool-button min-h-10 px-3" disabled={!canGoBack} onClick={() => selectStep(safeActiveStep - 1)} aria-label="Previous proof step">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 justify-center gap-1.5 overflow-x-auto px-1 py-1 thin-scrollbar" aria-label="Choose proof step">
          {steps.map((step, index) => {
            const status = step.state ?? (index < safeActiveStep ? "completed" : index === safeActiveStep ? "current" : "locked");
            const locked = status === "locked" && index > safeActiveStep + 1;
            return (
              <button
                key={step.id}
                type="button"
                disabled={locked}
                onClick={() => selectStep(index)}
                aria-current={index === safeActiveStep ? "step" : undefined}
                title={step.title}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-black transition ${
                  index === safeActiveStep
                    ? "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : index < safeActiveStep
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-cyan-300 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300"
                }`}
              >
                {index < safeActiveStep ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </button>
            );
          })}
        </div>
        <button type="button" className="tool-button min-h-10 px-3" disabled={!canGoForward} onClick={() => selectStep(safeActiveStep + 1)} aria-label="Next proof step">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <button type="button" className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-200" onClick={() => setShowAllSteps((value) => !value)} aria-expanded={showAllSteps}>
        <span className="inline-flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
          {showAllSteps ? "Hide full list" : "Show full list"}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{steps.length} steps</span>
      </button>

      {showAllSteps ? (
        <ol className="mt-3 space-y-2">
          {steps.map((step, index) => {
            const status = step.state ?? (index < safeActiveStep ? "completed" : index === safeActiveStep ? "current" : "locked");
            const locked = status === "locked" && index > safeActiveStep + 1;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => selectStep(index)}
                  aria-current={index === safeActiveStep ? "step" : undefined}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    index === safeActiveStep
                      ? "border-cyan-300 bg-cyan-50 text-cyan-950 dark:border-cyan-300/50 dark:bg-cyan-300/15 dark:text-cyan-50"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                      {status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : status === "locked" ? <Lock className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
                    </span>
                    <span className="font-black">{step.title}</span>
                  </span>
                  <span className="mt-2 block text-sm leading-6">{step.description}</span>
                  {step.focusLabel ? <span className="mt-2 inline-flex rounded-full bg-white/75 px-2 py-1 text-xs font-black uppercase text-cyan-800 dark:bg-white/10 dark:text-cyan-100">Focus: {step.focusLabel}</span> : null}
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}
