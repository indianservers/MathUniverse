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
        <h2 className="text-base font-black text-slate-950 dark:text-white">Step-by-step view</h2>
        <span className="mini-chip">Step {activeStep + 1} of {steps.length}</span>
      </div>
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
                <span className="mt-2 inline-flex rounded-full bg-white/70 px-2 py-1 text-xs font-black uppercase text-cyan-800 dark:bg-white/10 dark:text-cyan-100">
                  focus: {step.focusLabel}
                </span>
              )}
              <p className="mt-2 text-sm leading-6">{step.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
