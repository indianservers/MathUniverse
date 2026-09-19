import { Link, useLocation } from "react-router-dom";
import StudioHomeButtons from "../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../components/ui/StudioCanvasToolbar";
import {
  BooleanAlgebraLab,
  CayleyTablesLab,
  LabToolbar,
  PosetsLatticesLab,
  SemigroupsMonoidsLab,
  StructureTabs,
  StructuresHome,
  StructureTestLab,
  type AlgebraicStructuresPage,
} from "../studios/algebraic-structures/AlgebraicStructuresLabs";
import AlgebraLabHeading from "../studios/algebra/AlgebraLabHeading";
import { AlgebraStudioNav } from "../studios/algebra/AlgebraStudioNav";
import "./AlgebraStudio.css";
import "./AlgebraicStructuresStudio.css";

const titles: Record<AlgebraicStructuresPage, { title: string; subtitle: string; crumb?: string }> = {
  home: {
    title: "Algebraic Structures Studio",
    subtitle: "Launch a lab: test axioms, edit Cayley tables, walk semigroups, posets, and Boolean algebra.",
  },
  "structure-test": {
    title: "Algebraic Structures Lab",
    subtitle: "Explore algebraic structures through interactive experiments with operation tables, Cayley tables, and visual models.",
  },
  "cayley-tables": {
    title: "Algebraic Structures Lab — Cayley Tables",
    subtitle: "Build, explore, and analyze Cayley tables for groups, semigroups, monoids, and other algebraic structures.",
    crumb: "Cayley Tables",
  },
  "semigroups-monoids": {
    title: "Algebraic Structures Lab — Semigroups & Monoids",
    subtitle: "Explore closure, associativity, identity elements, and inverses through interactive visualizations and examples.",
  },
  "posets-lattices": {
    title: "Algebraic Structures Lab — Posets & Lattices",
    subtitle: "Explore order structures with interactive Hasse diagrams, compute meets and joins, and analyze lattice properties.",
  },
  "boolean-algebra": {
    title: "Boolean Algebra",
    subtitle: "Simplify Boolean expressions, visualize logic with truth tables and K-maps, and explore logic circuits and laws.",
    crumb: "Boolean Algebra",
  },
};

export default function AlgebraicStructuresStudio({ page = "home" }: { page?: AlgebraicStructuresPage }) {
  const location = useLocation();
  const meta = titles[page];
  const load = (kind: string) => {
    window.dispatchEvent(new CustomEvent("as-lab-load", { detail: kind }));
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="alg-studio as-studio">
      <AlgebraStudioNav page="structures" pathname={location.pathname} />
      <section className="alg-stage" data-testid="algebraic-structures-stage">
        <div className="as-lab">
          <StudioHomeButtons studioTo="/algebraic-structures" />
          <AlgebraLabHeading labId="structures" subtitle={meta.subtitle} onReset={() => window.dispatchEvent(new Event("as-lab-reset"))}>{meta.title}</AlgebraLabHeading>
          <header className="as-head">
            <div>
              <p className="as-crumb">
                <Link to="/">Home</Link> &gt; <Link to="/algebra">Algebra</Link> &gt; <b>Algebraic Structures</b>
                {meta.crumb ? <> &gt; <b>{meta.crumb}</b></> : null}
              </p>
            </div>
            {page !== "home" ? <><StudioCanvasToolbar /><LabToolbar onLoad={load} onReset={() => window.dispatchEvent(new Event("as-lab-reset"))} onShare={() => void share()} /></> : null}
          </header>
          <StructureTabs page={page} />
          <div className="msk-dash-banner" data-lab-mode={page}>
            <b>{meta.title}</b>
            <small>{meta.subtitle}</small>
          </div>
          {page === "home" ? <StructuresHome /> : null}
          {page === "structure-test" ? <StructureTestLab /> : null}
          {page === "cayley-tables" ? <CayleyTablesLab /> : null}
          {page === "semigroups-monoids" ? <SemigroupsMonoidsLab /> : null}
          {page === "posets-lattices" ? <PosetsLatticesLab /> : null}
          {page === "boolean-algebra" ? <BooleanAlgebraLab /> : null}
        </div>
      </section>
    </main>
  );
}
