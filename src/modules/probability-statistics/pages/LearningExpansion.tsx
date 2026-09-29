import { BookOpen, ChevronDown, Lightbulb, ListChecks } from "lucide-react";
import { useId, useState } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import SectionCard from "../../../components/ui/SectionCard";
import type { LearningContent } from "../data/learningContent";

export default function LearningExpansion({ content, simpleWords }: { content: LearningContent; simpleWords?: string }) {
  const [activeTab, setActiveTab] = useState<"details" | "simple">("details");
  const tabId = useId();
  return (
    <SectionCard title="Learn More" description="Detailed theory, real-world situations, and worked examples for practice.">
      {simpleWords ? <div className="mb-4 inline-flex gap-1 rounded-xl border border-cyan-200 bg-cyan-50 p-1 dark:border-cyan-300/20 dark:bg-cyan-400/10" role="tablist" aria-label="Learning explanation">
        <button id={`${tabId}-details-tab`} type="button" role="tab" aria-selected={activeTab === "details"} aria-controls={`${tabId}-details-panel`} className={`rounded-lg px-3 py-2 text-sm font-bold ${activeTab === "details" ? "bg-white text-cyan-800 shadow-sm dark:bg-slate-800 dark:text-cyan-100" : "text-slate-600 dark:text-slate-300"}`} onClick={() => setActiveTab("details")}>Theory &amp; examples</button>
        <button id={`${tabId}-simple-tab`} type="button" role="tab" aria-selected={activeTab === "simple"} aria-controls={`${tabId}-simple-panel`} className={`rounded-lg px-3 py-2 text-sm font-bold ${activeTab === "simple" ? "bg-white text-cyan-800 shadow-sm dark:bg-slate-800 dark:text-cyan-100" : "text-slate-600 dark:text-slate-300"}`} onClick={() => setActiveTab("simple")}>In Simple words</button>
      </div> : null}
      {simpleWords ? <div id={`${tabId}-simple-panel`} role="tabpanel" aria-labelledby={`${tabId}-simple-tab`} hidden={activeTab !== "simple"} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-base leading-8 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">{simpleWords}</div> : null}
      <div id={`${tabId}-details-panel`} role={simpleWords ? "tabpanel" : undefined} aria-labelledby={simpleWords ? `${tabId}-details-tab` : undefined} hidden={Boolean(simpleWords && activeTab !== "details")}>
      <div className="space-y-4">
        <p className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-100">
          <MathRichText value={content.overview} />
        </p>

        <details className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black text-slate-950 dark:text-white">
            <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-cyan-500" /> Detailed Theory</span>
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {content.learnMore.map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <MathRichText value={item} />
              </div>
            ))}
          </div>
        </details>

        <details className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black text-slate-950 dark:text-white">
            <span className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Real-World Examples</span>
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {content.examples.map((item, index) => (
              <div key={item} className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100">
                <p className="mb-1 font-mono text-xs font-black uppercase opacity-70">Example {index + 1}</p>
                <MathRichText value={item} />
              </div>
            ))}
          </div>
        </details>

        <details className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black text-slate-950 dark:text-white">
            <span className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-emerald-500" /> Sample Problems With Solutions</span>
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {content.problems.map((problem, index) => (
              <div key={problem.question} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                <p className="font-mono text-xs font-black uppercase opacity-70">Problem {index + 1}</p>
                <p className="mt-2 font-bold"><MathRichText value={problem.question} /></p>
                <p className="mt-3 rounded-lg bg-white/70 p-3 font-semibold dark:bg-slate-950/40"><MathRichText value={problem.solution} /></p>
              </div>
            ))}
          </div>
        </details>
      </div>
      </div>
    </SectionCard>
  );
}

function MathRichText({ value }: { value: string }) {
  const parts = value.split(/(\$[^$]+\$)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return <MathExpression key={`${part}-${index}`} value={part.slice(1, -1)} className="mx-0.5" />;
        }
        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}
