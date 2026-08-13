import SetTheoryModule from "../modules/set-theory/SetTheoryModule";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import StudioPageShell from "../components/ui/StudioPageShell";

export default function SetTheory() {
  return (
    <StudioPageShell
      className="set-theory-studio"
      title="Set Theory Studio"
      subtitle="Explore sets, Venn diagrams, relations, Hasse diagrams, functions, representations, and practice in focused pages."
      breadcrumbs={["Home", "Discrete Mathematics", "Set Theory"]}
      difficulty="Discrete Structures"
      estimatedMinutes={60}
      progress={72}
      status={[
        { id: "pages", label: "Focused pages", value: 7, tone: "cyan" },
        { id: "engine", label: "Engine", value: "live", tone: "green" },
      ]}
    >
      <div className="set-theory-workspace">
        <section className="set-theory-main-panel" aria-label="Set theory workspace">
          <SetTheoryModule />
        </section>
        <aside className="set-theory-inspector thin-scrollbar" aria-label="Set theory inspector">
          <div className="set-theory-guide-card">
            <span>Studio guide</span>
            <h2>Shared data, focused pages</h2>
            <p>Edit sets once, then move between builders, diagrams, relations, functions, representations, and practice without losing context.</p>
          </div>
          <FormulaBlock title="Core Identity" formula={String.raw`A \triangle B = (A \setminus B) \cup (B \setminus A)`} />
          <SectionCard title="Workflow" compact>
            <div className="grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <p>1. Start with Set Builder for U, A, B, and C.</p>
              <p>2. Use Venn Diagram Engine for operations and overlaps.</p>
              <p>3. Move to Relations, Hasse, and Functions for discrete-structure work.</p>
            </div>
          </SectionCard>
          <PhaseTwoDomainPanel domain="sets-relations-functions" />
        </aside>
      </div>
    </StudioPageShell>
  );
}
