import { ChevronDown, FlaskConical, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { phaseTwoAdvancedAssessments, phaseTwoAdvancedContracts, phaseTwoAdvancedExamples, type PhaseTwoAdvancedDomain } from "../../data/phaseTwoAccuracy";
import SectionCard from "./SectionCard";

export default function PhaseTwoDomainPanel({ domain }: { domain: PhaseTwoAdvancedDomain }) {
  const contracts = phaseTwoAdvancedContracts.filter((item) => item.domain === domain);
  const [openId, setOpenId] = useState(contracts[0]?.id ?? "");
  return (
    <SectionCard title="Accuracy, assumptions & validation" description={`${contracts.length} advanced contracts. Certification remains pending until assessments, accessibility, browser evidence, and reviewer sign-off pass.`} compact>
      <div className="grid gap-2">
        {contracts.map((contract) => {
          const expanded = openId === contract.id;
          const examples = phaseTwoAdvancedExamples.filter((item) => item.conceptId === contract.id);
          const assessments = phaseTwoAdvancedAssessments.filter((item) => item.conceptId === contract.id);
          return <article key={contract.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5">
            <button type="button" className="flex w-full items-center gap-3 p-3 text-left hover:bg-violet-50 dark:hover:bg-violet-300/10" aria-expanded={expanded} onClick={() => setOpenId(expanded ? "" : contract.id)}>
              <ShieldCheck className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300" /><span className="min-w-0 flex-1"><span className="block text-sm font-black">{contract.topic}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{contract.definition}</span></span><ChevronDown className={`h-4 w-4 shrink-0 transition ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded ? <div className="grid gap-3 border-t border-slate-200 p-3 text-xs leading-5 dark:border-white/10 md:grid-cols-2">
              <Block title="Formula / canonical relation" text={contract.formula} />
              <Block title="Independent oracle" text={contract.oracle} icon />
              <Block title="Restrictions" items={contract.restrictions} />
              <Block title="Invariants" items={contract.invariants} />
              <Block title="Misconception" text={`${contract.misconception.claim} Correct: ${contract.misconception.correction} Counterexample: ${contract.misconception.counterexample}`} />
              <Block title="Topic-specific contexts" items={contract.exampleContexts} />
              <Block title={`Example bank (${examples.length})`} items={examples.map((item) => `${item.kind}: ${item.prompt}`)} />
              <Block title={`Assessment modes (${assessments.length})`} items={assessments.map((item) => `${item.mode}: ${item.prompt}`)} />
            </div> : null}
          </article>;
        })}
      </div>
      <Link className="action-secondary mt-3 w-full sm:w-fit" to="/accuracy-certification">View certification evidence</Link>
    </SectionCard>
  );
}

function Block({ title, text, items, icon = false }: { title: string; text?: string; items?: string[]; icon?: boolean }) {
  return <section className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><h3 className="flex items-center gap-2 font-black uppercase text-slate-500 dark:text-slate-300">{icon ? <FlaskConical className="h-3.5 w-3.5" /> : null}{title}</h3>{text ? <p className="mt-1 text-slate-700 dark:text-slate-200">{text}</p> : null}{items ? <ul className="mt-1 grid gap-1">{items.map((item) => <li key={item}>• {item}</li>)}</ul> : null}</section>;
}
