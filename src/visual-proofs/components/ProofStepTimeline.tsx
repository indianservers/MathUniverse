import { CheckCircle2, Lock, Radio } from "lucide-react";
import type { ProofStep } from "../data/proofTypes";

type ProofStepTimelineProps = {
  steps: ProofStep[];
  activeStep: number;
  onSelectStep?: (stepIndex: number) => void;
};

export function ProofStepTimeline({ steps, activeStep, onSelectStep }: ProofStepTimelineProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]" aria-label="Proof step timeline">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950 dark:text-white">Step timeline</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Move one proof idea at a time.</p>
        </div>
        <span className="mini-chip">Step {Math.min(activeStep + 1, steps.length)} of {steps.length}</span>
      </div>
      <ol className="mt-3 space-y-2">
        {steps.map((step, index) => {
          const status = step.state ?? (index < activeStep ? "completed" : index === activeStep ? "current" : "locked");
          const locked = status === "locked" && index > activeStep + 1;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={locked}
                onClick={() => onSelectStep?.(index)}
                aria-current={index === activeStep ? "step" : undefined}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  index === activeStep
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
    </section>
  );
}
