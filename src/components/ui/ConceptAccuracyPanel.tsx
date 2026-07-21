import { useState } from "react";
import { AlertTriangle, BookOpenCheck, CheckCircle2, ChevronDown, FlaskConical, ShieldCheck } from "lucide-react";
import { accuracyConceptsForDomain, type PhaseOneDomain, type StrengthenedConcept } from "../../data/conceptAccuracy";
import MathExpression from "./MathExpression";
import SectionCard from "./SectionCard";

export default function ConceptAccuracyPanel({ domain }: { domain: PhaseOneDomain }) {
  const concepts = accuracyConceptsForDomain(domain);
  const [openId, setOpenId] = useState(concepts[0]?.id ?? "");

  return (
    <SectionCard
      title="Accuracy and topic-specific examples"
      description={`${concepts.length} reviewed concept contracts with assumptions, boundary cases, misconceptions, and independent validation.`}
      className="border-emerald-200/80 dark:border-emerald-300/20"
      compact
    >
      <div className="grid gap-2">
        {concepts.map((concept) => {
          const expanded = openId === concept.id;
          const contentId = `${concept.id.replace(/\./g, "-")}-accuracy-content`;
          return (
            <article key={concept.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                className="flex w-full items-start gap-3 p-3 text-left transition hover:bg-cyan-50/70 dark:hover:bg-cyan-300/10"
                aria-expanded={expanded}
                aria-controls={contentId}
                onClick={() => setOpenId(expanded ? "" : concept.id)}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-sm"><ShieldCheck className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-slate-950 dark:text-white">{concept.title}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-600 dark:text-slate-300">{concept.definition.learner}</span>
                </span>
                <span className="mini-chip shrink-0">{concept.level}</span>
                <ChevronDown className={`mt-2 h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              <div id={contentId} hidden={!expanded} className="border-t border-slate-200 p-3 dark:border-white/10">
                <ConceptAccuracyDetails concept={concept} />
              </div>
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
}

function ConceptAccuracyDetails({ concept }: { concept: StrengthenedConcept }) {
  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <div className="space-y-3">
        <AccuracyBlock icon={<BookOpenCheck className="h-4 w-4" />} title="Precise definition">
          <p>{concept.definition.precise}</p>
          <p className="mt-2"><strong>Domain and exclusions:</strong> {concept.domainStatement}</p>
        </AccuracyBlock>
        <AccuracyBlock icon={<CheckCircle2 className="h-4 w-4" />} title="Formula and validity">
          {concept.formulas.map((formula) => (
            <div key={formula.id} className="space-y-2">
              <MathExpression value={formula.latex} className="text-base" />
              <p>{formula.meaning}</p>
              <ul className="grid gap-1">
                {formula.conditions.map((condition) => <li key={condition}>• {condition}</li>)}
              </ul>
            </div>
          ))}
        </AccuracyBlock>
        <AccuracyBlock icon={<AlertTriangle className="h-4 w-4" />} title="Misconceptions and counterexamples" tone="amber">
          <div className="grid gap-2">
            {concept.misconceptions.map((item) => (
              <div key={item.claim} className="rounded-lg bg-white/70 p-2 dark:bg-slate-950/30">
                <p><strong>Not:</strong> {item.claim}</p>
                <p className="mt-1"><strong>Correct:</strong> {item.correction}</p>
                <p className="mt-1 text-xs opacity-80"><strong>Counterexample:</strong> {item.counterexample}</p>
              </div>
            ))}
          </div>
        </AccuracyBlock>
      </div>
      <div className="space-y-3">
        <AccuracyBlock icon={<FlaskConical className="h-4 w-4" />} title="Topic-specific example bank" tone="violet">
          <div className="grid gap-2">
            {concept.examples.map((example) => (
              <div key={example.id} className="rounded-lg border border-violet-100 bg-white/70 p-2 dark:border-violet-300/15 dark:bg-slate-950/30">
                <div className="flex flex-wrap items-center gap-2"><span className="mini-chip">{example.kind}</span><strong>{example.prompt}</strong></div>
                <p className="mt-1 text-emerald-700 dark:text-emerald-200">{example.result}</p>
                <p className="mt-1 text-xs opacity-80">{example.reasoning}</p>
              </div>
            ))}
          </div>
        </AccuracyBlock>
        <AccuracyBlock icon={<ShieldCheck className="h-4 w-4" />} title="Independent validation" tone="emerald">
          <p><strong>Oracle:</strong> {concept.validation.oracle}</p>
          {concept.validation.tolerance != null && <p className="mt-1"><strong>Tolerance:</strong> {concept.validation.tolerance}</p>}
          <ul className="mt-2 grid gap-1">
            {concept.invariants.map((invariant) => <li key={invariant}>• {invariant}</li>)}
          </ul>
        </AccuracyBlock>
      </div>
    </div>
  );
}

function AccuracyBlock({ icon, title, tone = "cyan", children }: { icon: JSX.Element; title: string; tone?: "cyan" | "amber" | "violet" | "emerald"; children: React.ReactNode }) {
  const tones = {
    cyan: "border-cyan-100 bg-cyan-50/60 dark:border-cyan-300/15 dark:bg-cyan-300/10",
    amber: "border-amber-100 bg-amber-50/60 dark:border-amber-300/15 dark:bg-amber-300/10",
    violet: "border-violet-100 bg-violet-50/60 dark:border-violet-300/15 dark:bg-violet-300/10",
    emerald: "border-emerald-100 bg-emerald-50/60 dark:border-emerald-300/15 dark:bg-emerald-300/10",
  };
  return (
    <section className={`rounded-xl border p-3 text-sm leading-6 text-slate-700 dark:text-slate-200 ${tones[tone]}`}>
      <h3 className="mb-2 flex items-center gap-2 font-black text-slate-950 dark:text-white">{icon}{title}</h3>
      {children}
    </section>
  );
}
