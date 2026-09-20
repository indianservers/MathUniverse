import { Link } from "react-router-dom";

export type StudioCrumb = {
  label: string;
  to: string;
};

export const studioCrumbRoutes: Record<string, string> = {
  Home: "/",
  Main: "/",
  Mathematics: "/learn",
  "Math Topics": "/learn",
  Math: "/learn",
  Studio: "/math-lab",
  Algebra: "/algebra",
  "Algebra Studio": "/algebra",
  Geometry: "/geometry",
  "Geometry Studio": "/geometry",
  Trigonometry: "/trigonometry",
  Calculus: "/calculus",
  "Calculus Studio": "/calculus",
  "Linear Algebra": "/linear-algebra",
  "Complex Numbers": "/complex-numbers",
  Combinatorics: "/combinatorics",
  "Daily Challenge": "/daily-challenge",
  Matrices: "/matrices",
  Operations: "/matrices",
  "Number Systems": "/number-systems",
  Rational: "/number-systems/rational",
  Irrational: "/number-systems/irrational",
  "Real Line": "/number-systems/real-line",
  Hierarchy: "/number-systems/hierarchy",
  Statistics: "/statistics",
  "Probability & Statistics": "/probability-statistics",
  "Set Theory": "/set-theory",
  "Set Theory and Relations": "/set-theory",
  "Mathematical Logic": "/mathematical-logic",
  Logic: "/mathematical-logic",
  Practice: "/quiz",
  "Worked Examples": "/worked-examples",
  "Mathematical Modelling": "/mathematical-modelling",
  "Advanced Workbench": "/mathematical-modelling/advanced",
  "Project Center": "/studio-projects",
  "Number & Discrete Mathematics": "/discrete-world",
  "Discrete Mathematics": "/discrete-world",
  "Graph Theory": "/graph-theory",
  CAS: "/workspace/data/cas",
  Derivatives: "/calculus/derivatives",
  Integration: "/calculus/integration",
  Limits: "/calculus/limits",
  "Algebra Solver": "/problem-solver",
};

export function mathStudioCrumbs(studio: StudioCrumb, leaf?: StudioCrumb): StudioCrumb[] {
  const crumbs: StudioCrumb[] = [
    { label: "Home", to: "/" },
    { label: "Mathematics", to: "/learn" },
    studio,
  ];
  if (leaf) crumbs.push(leaf);
  return crumbs;
}

export function resolveStudioCrumbs(items: Array<string | StudioCrumb>, pathname: string): StudioCrumb[] {
  let lastKnown = "/";
  const crumbs = items.map((item, index) => {
    if (typeof item !== "string") {
      lastKnown = item.to;
      return item;
    }
    const mapped = studioCrumbRoutes[item];
    const last = index === items.length - 1;
    const to = mapped ?? (last ? pathname : lastKnown);
    if (mapped) lastKnown = mapped;
    return { label: item, to };
  });
  const hasMathematics = crumbs.some((crumb) => crumb.to === "/learn");
  if (hasMathematics) return crumbs;
  const homeIndex = crumbs.findIndex((crumb) => crumb.to === "/");
  if (homeIndex === -1) return [{ label: "Home", to: "/" }, { label: "Mathematics", to: "/learn" }, ...crumbs];
  return [...crumbs.slice(0, homeIndex + 1), { label: "Mathematics", to: "/learn" }, ...crumbs.slice(homeIndex + 1)];
}

export default function StudioBreadcrumb({
  crumbs,
  className,
}: {
  crumbs: StudioCrumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className ?? "studio-breadcrumb"}>
      {crumbs.map((crumb, index) => (
        <span key={`${crumb.to}-${crumb.label}-${index}`}>
          {index > 0 && <b aria-hidden="true"> › </b>}
          <Link to={crumb.to} aria-current={index === crumbs.length - 1 ? "page" : undefined}>{crumb.label}</Link>
        </span>
      ))}
    </nav>
  );
}
