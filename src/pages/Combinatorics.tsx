import CombinatoricsModule from "../modules/combinatorics/CombinatoricsModule";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import StudioPageShell from "../components/ui/StudioPageShell";

export default function Combinatorics() {
  return (
    <StudioPageShell
      className="combinatorics-studio"
      title="Combinatorics Studio"
      subtitle="Visualize counting trees, permutations, combinations, Pascal coefficients, expansions, and inclusion-exclusion."
      breadcrumbs={["Home", "Discrete Mathematics", "Combinatorics"]}
      difficulty="Discrete Counting Lab"
      estimatedMinutes={65}
      progress={75}
      status={[
        { id: "workspaces", label: "Workspaces", value: 6, tone: "cyan" },
        { id: "engine", label: "Engine", value: "live", tone: "green" },
      ]}
    >
      <div className="combinatorics-workspace">
        <section className="combinatorics-main-panel" aria-label="Combinatorics workspace">
          <CombinatoricsModule />
        </section>
        <aside className="combinatorics-inspector thin-scrollbar" aria-label="Combinatorics inspector">
          <div className="combinatorics-guide-card">
            <span>Studio guide</span>
            <h2>Counting cockpit</h2>
            <p>Use the shared controls once, then switch workspaces to inspect trees, arrangements, coefficients, advanced counts, and practice prompts.</p>
          </div>
          <FormulaBlock title="Counting Identity" formula={String.raw`{n \choose r}=\frac{n!}{r!(n-r)!}`} />
          <SectionCard title="Workflow" compact>
            <div className="grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <p>1. Set objects, n, r, and repetition.</p>
              <p>2. Open the matching tab for tree, permutation, combination, coefficient, or challenge views.</p>
              <p>3. Export a worksheet from Practice when you need a printable drill.</p>
            </div>
          </SectionCard>
          <PhaseTwoDomainPanel domain="combinatorics" />
        </aside>
      </div>
    </StudioPageShell>
  );
}
