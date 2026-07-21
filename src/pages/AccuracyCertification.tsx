import { CheckCircle2, ChevronDown, ClipboardCheck, ExternalLink, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { auditLearningLibraries, automatedEvidenceSummary, curriculumCoverageSummary, phaseTwoAdvancedContracts, phaseTwoCertificationSummary, PHASE_TWO_ADVANCED_DOMAINS } from "../data/phaseTwoAccuracy";
import { phaseTwoSystemContracts } from "../data/phaseTwoAccuracy/systemContracts";
import type { PhaseTwoAdvancedDomain, PhaseTwoSystemArea } from "../data/phaseTwoAccuracy";

const domainLabels: Record<PhaseTwoAdvancedDomain, string> = {
  "complex-numbers": "Complex numbers",
  combinatorics: "Combinatorics",
  "sets-relations-functions": "Sets, relations & functions",
  "mathematical-logic": "Logic",
  "linear-algebra": "Vectors & linear algebra",
  "statistics-probability": "Statistics & probability",
  "graph-discrete": "Graph & discrete mathematics",
  "ai-engineering": "AI & engineering",
};

const areaLabels: Record<PhaseTwoSystemArea, string> = {
  libraries: "Libraries",
  "tools-workspaces": "Tools & workspaces",
  "ar-xr": "AR/XR",
  practice: "Practice",
  curriculum: "Curriculum",
  certification: "Certification",
};

export default function AccuracyCertification() {
  const [domain, setDomain] = useState<PhaseTwoAdvancedDomain>(PHASE_TWO_ADVANCED_DOMAINS[0]);
  const [openId, setOpenId] = useState<string>(phaseTwoAdvancedContracts[0]?.id ?? "");
  const contracts = useMemo(() => phaseTwoAdvancedContracts.filter((item) => item.domain === domain), [domain]);
  const curriculum = curriculumCoverageSummary();
  const certification = phaseTwoCertificationSummary();
  const libraries = auditLearningLibraries();
  const automated = automatedEvidenceSummary();

  return (
    <div className="space-y-5">
      <TopicHeader title="Accuracy & Certification" subtitle="Auditable Phase 2 contracts for advanced mathematics, tools, AR/XR, practice, curriculum, and release evidence." difficulty="Advanced" estimatedMinutes={15} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric value={phaseTwoAdvancedContracts.length} label="Advanced concept contracts" />
        <Metric value={phaseTwoSystemContracts.length} label="Cross-app system contracts" />
        <Metric value={phaseTwoAdvancedContracts.reduce((sum, item) => sum + item.invariants.length, 0) + phaseTwoSystemContracts.reduce((sum, item) => sum + item.invariants.length, 0)} label="Declared invariants" />
        <Metric value={curriculum.percentage} label="Curriculum mapping coverage (%)" />
        <Metric value={certification.certified} label="Certified — reviewer sign-off required" warning />
      </div>

      <SectionCard title="Automated evidence snapshot" description="Machine-verifiable coverage is reported separately from accessibility, browser, and independent reviewer sign-off." compact>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric value={automated.withFullExamples} label="Concepts with all 14 example modes" />
          <Metric value={automated.withFullAssessments} label="Concepts with all 5 assessments" />
          <Metric value={libraries.formulas} label="Formula records audited" />
          <Metric value={libraries.theorems + libraries.visualProofs} label="Theorem and visual-proof records audited" />
        </div>
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">{automated.awaitingManualReview} advanced contracts still require accessibility review, browser evidence, and named mathematical reviewer sign-off. Automated checks cannot self-certify them.</p>
      </SectionCard>

      <SectionCard title="Advanced-domain accuracy contracts" description="Every roadmap row has a route owner, mathematical restrictions, independent oracle, misconception counterexample, assessment modes, and accessibility evidence." compact>
        <div className="mobile-safe-scroll thin-scrollbar flex gap-2 overflow-x-auto pb-3" role="tablist" aria-label="Advanced accuracy domains">
          {PHASE_TWO_ADVANCED_DOMAINS.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={domain === item} className={domain === item ? "action-primary shrink-0" : "tool-button shrink-0"} onClick={() => { setDomain(item); setOpenId(phaseTwoAdvancedContracts.find((contract) => contract.domain === item)?.id ?? ""); }}>
              {domainLabels[item]} <span className="mini-chip">{phaseTwoAdvancedContracts.filter((contract) => contract.domain === item).length}</span>
            </button>
          ))}
        </div>
        <div className="grid gap-2">
          {contracts.map((contract) => {
            const expanded = openId === contract.id;
            return (
              <article key={contract.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5">
                <button type="button" className="flex w-full items-center gap-3 p-3 text-left hover:bg-cyan-50/70 dark:hover:bg-cyan-300/10" aria-expanded={expanded} onClick={() => setOpenId(expanded ? "" : contract.id)}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500 text-white"><ClipboardCheck className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-black">{contract.topic}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{contract.id}</span></span>
                  <span className="mini-chip bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-100">{contract.status}</span>
                  <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
                </button>
                {expanded ? <ContractDetails contract={contract} /> : null}
              </article>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Cross-app certification contracts" description="These gates prevent a mathematically correct isolated widget from being called complete while its assessment, accessibility, curriculum, or release evidence is missing." compact>
        <div className="grid gap-3 lg:grid-cols-2">
          {phaseTwoSystemContracts.map((contract) => (
            <article key={contract.id} className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{areaLabels[contract.area]}</p><h2 className="mt-1 font-black">{contract.title}</h2></div><span className="mini-chip">{contract.status}</span></div>
              <ul className="mt-3 grid gap-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{contract.requirements.map((item) => <li key={item}>• {item}</li>)}</ul>
              <Link className="action-secondary mt-3 w-full" to={contract.route}>Inspect owned surface <ExternalLink className="h-3.5 w-3.5" /></Link>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ContractDetails({ contract }: { contract: (typeof phaseTwoAdvancedContracts)[number] }) {
  return (
    <div className="grid gap-3 border-t border-slate-200 p-3 text-sm dark:border-white/10 lg:grid-cols-2">
      <div className="space-y-3"><Info title="Precise definition" text={contract.definition} /><Info title="Formula" text={contract.formula} /><Info title="Restrictions" items={contract.restrictions} /><Info title="Topic-specific contexts" items={contract.exampleContexts} /></div>
      <div className="space-y-3"><Info title="Independent oracle" text={contract.oracle} /><Info title="Invariants" items={contract.invariants} /><Info title="Misconception correction" text={`${contract.misconception.claim} — ${contract.misconception.correction} Counterexample: ${contract.misconception.counterexample}`} /><Info title="Evidence still required" items={[...contract.assessmentModes.map((mode) => `${mode} assessment`), ...contract.accessibilityEvidence]} /></div>
      <Link className="action-primary lg:col-span-2" to={contract.route}>Open concept owner <ExternalLink className="h-4 w-4" /></Link>
    </div>
  );
}

function Info({ title, text, items }: { title: string; text?: string; items?: readonly string[] }) {
  return <section className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-300">{title}</h3>{text ? <p className="mt-2 leading-6">{text}</p> : null}{items ? <ul className="mt-2 grid gap-1 text-xs leading-5">{items.map((item) => <li key={item}>• {item}</li>)}</ul> : null}</section>;
}

function Metric({ value, label, warning = false }: { value: number; label: string; warning?: boolean }) {
  return <div className={`rounded-2xl border p-4 ${warning ? "border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-300/10" : "border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-300/10"}`}><div className="flex items-center gap-2">{warning ? <ShieldAlert className="h-5 w-5 text-amber-600" /> : <CheckCircle2 className="h-5 w-5 text-emerald-600" />}<p className="text-2xl font-black">{value}</p></div><p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</p></div>;
}
