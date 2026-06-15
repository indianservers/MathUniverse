import { Eye, MousePointerClick, Volume2 } from "lucide-react";
import type { ProofStep } from "../data/proofTypes";

type StepPanelProps = {
  steps: ProofStep[];
  activeStep: number;
  onSelectStep?: (step: number) => void;
};

export default function StepPanel({ steps, activeStep, onSelectStep }: StepPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Step-by-step explanation">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950 dark:text-white">Teacher steps</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Read one step, look at one part, then press Next.</p>
        </div>
        <span className="mini-chip">Step {activeStep + 1} of {steps.length}</span>
      </div>
      {steps[activeStep] && (
        <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm leading-6 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
            <Volume2 className="h-4 w-4" />
            Say this now
          </p>
          <p className="mt-1.5 font-bold">{steps[activeStep].description}</p>
        </div>
      )}
      <div className="mt-3 space-y-2">
        {steps.map((step, index) => {
          const active = index === activeStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep?.(index)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                active
                  ? "border-cyan-300 bg-cyan-50 text-cyan-950 dark:border-cyan-300/50 dark:bg-cyan-300/15 dark:text-cyan-50"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-200 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white dark:bg-white dark:text-slate-950">
                  {index + 1}
                </span>
                <span className="font-black">{step.title}</span>
              </div>
              {step.focusLabel && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-xs font-black uppercase text-cyan-800 dark:bg-white/10 dark:text-cyan-100">
                  <Eye className="h-3.5 w-3.5" />
                  look at: {step.focusLabel}
                </span>
              )}
              <p className="mt-2 text-sm leading-6">{step.description}</p>
              {active && (
                <p className="mt-2 flex items-center gap-2 rounded-lg bg-white/75 px-2 py-1.5 text-xs font-black text-cyan-900 dark:bg-slate-950/35 dark:text-cyan-100">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Now use the visual, then explain this step in simple words.
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
