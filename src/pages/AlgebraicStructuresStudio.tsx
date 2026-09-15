import {
  BarChart3,
  Braces,
  Calculator,
  FlaskConical,
  FunctionSquare,
  GitFork,
  Home,
  LineChart,
  MoveRight,
  Sparkles,
  SquareFunction,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
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

const sidebar = [
  { id: "home", label: "Studio Home", route: "/algebra", icon: Home, group: "main" },
  { id: "expressions", label: "Expressions", route: "/algebra/expressions", icon: FunctionSquare },
  { id: "equations", label: "Equations", route: "/algebra/equations", icon: MoveRight },
  { id: "functions", label: "Functions", route: "/algebra/functions", icon: LineChart },
  { id: "polynomials", label: "Polynomials", route: "/algebra/polynomials", icon: SquareFunction },
  { id: "systems", label: "Systems", route: "/algebra/systems", icon: Braces, group: "systems" },
  { id: "exponents", label: "Exponents & Logs", route: "/algebra/exponents-logs", icon: Sparkles },
  { id: "sequences", label: "Sequences", route: "/algebra/sequences", icon: BarChart3 },
  { id: "structures", label: "Algebraic Structures", route: "/algebraic-structures", icon: GitFork },
  { id: "cas", label: "Candidate checker", route: "/algebra/cas", icon: Calculator },
  { id: "advanced", label: "Advanced Workbench", route: "/algebra/advanced", icon: FlaskConical },
];

export default function AlgebraicStructuresStudio({ page = "home" }: { page?: AlgebraicStructuresPage }) {
  const location = useLocation();
  const meta = titles[page];
  const load = () => undefined;
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="alg-studio as-studio">
      <aside className="alg-sidebar">
        <Link className="alg-brand" to="/algebra" aria-label="Algebra Studio home">
          <img className="alg-mark-img" src="/assets/algebra-studio/algebra-studio-mark.png" alt="" width={40} height={40} />
          <span><b>ALGEBRA</b><b>STUDIO</b></span>
        </Link>
        <Link className="alg-main-link" to="/"><Home /> <span>Main</span></Link>
        <nav aria-label="Algebra Studio navigation">
          {sidebar.map((item) => (
            <span key={item.id}>
              {item.group === "systems" ? <p className="as-sidebar-group">SYSTEMS</p> : null}
              <NavLink
                to={item.route}
                end={item.id === "home"}
                className={({ isActive }) =>
                  item.id === "structures"
                    ? location.pathname.startsWith("/algebraic-structures") ? "active" : ""
                    : isActive
                      ? "active"
                      : ""
                }
              >
                <item.icon /><span>{item.label}</span>
              </NavLink>
            </span>
          ))}
        </nav>
      </aside>
      <section className="alg-stage" data-testid="algebraic-structures-stage">
        <div className="as-lab">
          <StudioHomeButtons studioTo="/algebraic-structures" />
          <p className="as-crumb">
            <Link to="/">Home</Link> &gt; <Link to="/algebra">Algebra</Link> &gt; <b>Algebraic Structures</b>
            {meta.crumb ? <> &gt; <b>{meta.crumb}</b></> : null}
          </p>
          <header className="as-head">
            <div>
              <h1>{meta.title}</h1>
              <p>{meta.subtitle}</p>
            </div>
            {page !== "home" ? <><StudioCanvasToolbar /><LabToolbar onLoad={load} onReset={() => window.location.reload()} onShare={() => void share()} /></> : null}
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
