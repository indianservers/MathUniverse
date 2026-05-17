import SectionCard from "./SectionCard";

type VisualLearningPanelProps = {
  concept: string;
  formula: string;
  changes: string;
  realWorldUse: string;
  steps: string[];
  tasks: string[];
  warning?: string;
};

export default function VisualLearningPanel({ concept, formula, changes, realWorldUse, steps, tasks, warning }: VisualLearningPanelProps) {
  return (
    <SectionCard title="Visual Learning Mode" className="border-cyan-200/80 dark:border-cyan-400/20">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <Info label="Concept" value={concept} />
          <Info label="Formula" value={formula} mono />
          <Info label="What changes when sliders move" value={changes} />
          <Info label="Real-world use" value={realWorldUse} />
          {warning && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">{warning}</div>}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <h3 className="font-semibold">Step-by-Step Explanation</h3>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {steps.map((step, index) => <li key={step}><span className="font-bold text-cyan-600 dark:text-cyan-300">{index + 1}.</span> {step}</li>)}
            </ol>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <h3 className="font-semibold">Try This</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {tasks.map((task) => <li key={task}>• {task}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
