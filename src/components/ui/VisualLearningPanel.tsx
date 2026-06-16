import { AlertTriangle, CheckCircle2, Eye, Lightbulb, Target } from "lucide-react";
import MathExpression from "./MathExpression";
import SectionCard from "./SectionCard";

type VisualLearningPanelProps = {
  concept: string;
  formula: string;
  changes: string;
  realWorldUse: string;
  steps: string[];
  tasks: string[];
  proofIdea?: string;
  misconception?: string;
  teacherPrompt?: string;
  warning?: string;
};

export default function VisualLearningPanel({ concept, formula, changes, realWorldUse, steps, tasks, proofIdea, misconception, teacherPrompt, warning }: VisualLearningPanelProps) {
  return (
    <SectionCard title="Visual Learning Mode" description="Look, move, say why, then calculate." className="border-cyan-200/80 dark:border-cyan-400/20" compact>
      <div className="mb-3 grid gap-2 md:grid-cols-3">
        <LearningCue icon={<Eye className="h-4 w-4" />} label="Look" value="Find the fixed shape, equal marks, and moving point." />
        <LearningCue icon={<Lightbulb className="h-4 w-4" />} label="Notice" value={proofIdea ?? "One relationship stays true while the diagram changes."} />
        <LearningCue icon={<CheckCircle2 className="h-4 w-4" />} label="Check" value={teacherPrompt ?? "Say the rule in your own words before using the formula."} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <Info label="Concept" value={concept} />
          <Info label="Formula" value={formula} mono />
          <Info label="What changes when sliders move" value={changes} />
          <Info label="Real-world use" value={realWorldUse} />
          {misconception && <Callout tone="danger" label="Common mistake" value={misconception} />}
          {warning && <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">{warning}</div>}
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <h3 className="flex items-center gap-2 font-semibold"><Target className="h-4 w-4 text-cyan-600 dark:text-cyan-200" /> Step-by-step proof</h3>
            <ol className="mt-2 space-y-1.5 text-sm leading-5 text-slate-600 dark:text-slate-300">
              {steps.map((step, index) => <li key={step}><span className="font-bold text-cyan-600 dark:text-cyan-300">{index + 1}.</span> {step}</li>)}
            </ol>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3 dark:border-violet-300/20 dark:bg-violet-300/10">
            <h3 className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-200" /> Try this</h3>
            <ul className="mt-2 space-y-1.5 text-sm leading-5 text-slate-600 dark:text-slate-300">
              {tasks.map((task) => <li key={task} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" /> <span>{task}</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1.5 text-sm leading-5 text-slate-700 dark:text-slate-200">
        {mono ? <MathExpression value={value} className="text-sm" /> : value}
      </p>
    </div>
  );
}

function LearningCue({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  );
}

function Callout({ tone, label, value }: { tone: "danger"; label: string; value: string }) {
  const danger = tone === "danger";
  return (
    <div className={`rounded-xl border p-3 text-sm ${danger ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100" : ""}`}>
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
        <AlertTriangle className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-1.5 leading-5">{value}</p>
    </div>
  );
}
