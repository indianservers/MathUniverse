import {
  BarChart3,
  BookOpenCheck,
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
  type LucideIcon,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { readLabProgress } from "./algebraStudioProgress";

export type AlgebraPage =
  | "home"
  | "expressions"
  | "equations"
  | "functions"
  | "polynomials"
  | "systems"
  | "exponents"
  | "sequences"
  | "structures"
  | "proof"
  | "cas"
  | "advanced";

export type StudioNavItem = {
  id: AlgebraPage;
  label: string;
  route: string;
  icon: LucideIcon;
};

export const studioNav: StudioNavItem[] = [
  { id: "home", label: "Studio Home", route: "/algebra", icon: Home },
  { id: "expressions", label: "Expressions", route: "/algebra/expressions", icon: FunctionSquare },
  { id: "equations", label: "Equations", route: "/algebra/equations", icon: MoveRight },
  { id: "functions", label: "Functions", route: "/algebra/functions", icon: LineChart },
  { id: "polynomials", label: "Polynomials", route: "/algebra/polynomials", icon: SquareFunction },
  { id: "systems", label: "Systems", route: "/algebra/systems", icon: Braces },
  { id: "exponents", label: "Exponents & Logs", route: "/algebra/exponents-logs", icon: Sparkles },
  { id: "sequences", label: "Sequences", route: "/algebra/sequences", icon: BarChart3 },
  { id: "proof", label: "Algebraic Proof", route: "/algebra/proof", icon: BookOpenCheck },
  { id: "cas", label: "CAS Explorer", route: "/algebra/cas", icon: Calculator },
  { id: "structures", label: "Algebraic Structures", route: "/algebraic-structures", icon: GitFork },
  { id: "advanced", label: "Advanced Workbench", route: "/algebra/advanced", icon: FlaskConical },
];

const MOCKUP_NAV_IDS: AlgebraPage[] = [
  "home",
  "expressions",
  "equations",
  "functions",
  "polynomials",
  "systems",
  "exponents",
  "sequences",
  "proof",
  "cas",
  "structures",
  "advanced",
];

export const routePage: Record<string, AlgebraPage> = Object.fromEntries(
  studioNav.map((item) => [item.route, item.id]),
) as Record<string, AlgebraPage>;

function navClass(id: AlgebraPage, page: AlgebraPage, pathname: string) {
  if (id === "structures") return pathname.startsWith("/algebraic-structures") ? "active" : "";
  return id === page ? "active" : "";
}

export function AlgebraStudioNav({ page, pathname }: { page: AlgebraPage; pathname: string }) {
  const visited = typeof window === "undefined" ? [] : readLabProgress().visited;
  return (
    <aside className="alg-sidebar">
      <Link className="alg-brand" to="/algebra" aria-label="Algebra Studio home">
        <img className="alg-mark-img" src="/assets/algebra-studio/algebra-studio-mark.png" alt="" width={40} height={40} />
        <span><b>ALGEBRA</b><b>STUDIO</b></span>
      </Link>
      <Link className="alg-main-link" to="/"><Home /> <span>Main</span></Link>
      <a className="alg-skip" href="#algebra-lab-main">Skip to lab</a>
      <nav aria-label="Algebra Studio navigation">
        {MOCKUP_NAV_IDS.map((id) => {
          const item = studioNav.find((entry) => entry.id === id);
          if (!item) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.route}
              end={item.id === "home"}
              title={item.label}
              aria-label={item.label}
              className={navClass(item.id, page, pathname)}
            >
              <Icon />
              <span>{item.label}</span>
              {visited.includes(item.id) ? <i className="alg-nav-dot" aria-label={`${item.label} started`} /> : null}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
