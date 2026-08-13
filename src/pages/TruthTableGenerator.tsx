import MathematicalLogicModule from "../modules/mathematical-logic/MathematicalLogicModule";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import StudioPageShell from "../components/ui/StudioPageShell";

export default function TruthTableGenerator() {
  return (
    <StudioPageShell
      className="logic-studio"
      title="Mathematical Logic Studio"
      subtitle="Build statements, simulate connectives, generate truth tables, transform normal forms, and explore inference."
      breadcrumbs={["Home", "Discrete Mathematics", "Logic"]}
      difficulty="Advanced Logic Lab"
      estimatedMinutes={55}
      progress={70}
      status={[
        { id: "tabs", label: "Logic modes", value: 8, tone: "cyan" },
        { id: "exports", label: "Exports", value: "PNG/PDF/JSON", tone: "violet" },
      ]}
    >
      <div className="logic-workspace">
        <section className="logic-main-panel" aria-label="Mathematical logic workspace">
          <MathematicalLogicModule />
        </section>
        <aside className="logic-inspector thin-scrollbar" aria-label="Mathematical logic inspector">
          <div className="logic-guide-card">
            <span>Studio guide</span>
            <h2>Truth-table cockpit</h2>
            <p>Build a statement once, then move through tables, normal forms, inference, predicates, laws, and practice without losing session state.</p>
          </div>
          <FormulaBlock title="Core Equivalence" formula={String.raw`p \to q \equiv \neg p \lor q`} />
          <SectionCard title="Workflow" compact>
            <div className="grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <p>1. Use Build to compose a statement.</p>
              <p>2. Inspect rows in Tables and derive CNF/DNF in Forms.</p>
              <p>3. Use Inference and Predicate for proof-style reasoning.</p>
            </div>
          </SectionCard>
          <PhaseTwoDomainPanel domain="mathematical-logic" />
        </aside>
      </div>
    </StudioPageShell>
  );
}
