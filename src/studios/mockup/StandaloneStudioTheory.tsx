import { BookOpenCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDialogFocus } from "../../hooks/useDialogFocus";
import StudioTheoryPanel from "./StudioTheoryPanel";
import { studioTheoryContent } from "./studioTheoryContent";
import "./StandaloneStudioTheory.css";

type TheoryRoute = { studioId: string; pageId: string; label: string };
const names: Record<string, string> = {
  home: "Studio Home", cas: "CAS Explorer", exponents: "Exponents & Logs", "structure-test": "Structure Test",
  shapes: "Shapes Explorer", segment: "Circular Segment", "argand-plane": "Argand Plane", "polar-forms": "Polar Forms",
  "waves-circuits": "Waves & Circuits",
  "cayley-tables": "Cayley Tables", "semigroups-monoids": "Semigroups & Monoids", "posets-lattices": "Posets & Lattices",
  rational: "Rational Numbers", irrational: "Irrational Numbers", "real-line": "Real Number Line",
  hierarchy: "Number Hierarchy", concepts: "Number Concepts", practice: "Practice",
  jacobians: "Jacobians & Coordinate Transformations", "beta-gamma": "Beta & Gamma Functions",
  "change-order": "Change Order of Integration", centroid: "Centroid & Center of Mass",
  "moments-of-inertia": "Moments of Inertia", "integral-engineering": "Multiple Integral Applications",
};
const labelFor = (id: string) => names[id] ?? id.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
const add = (studioId: string, paths: Record<string, string>): Record<string, TheoryRoute> => Object.fromEntries(
  Object.entries(paths).map(([path, pageId]) => [path, { studioId, pageId, label: labelFor(pageId) }]),
);

export const standaloneStudioTheoryRoutes: Record<string, TheoryRoute> = {
  ...add("geometry", { "/shapes": "shapes" }),
  ...add("complex-numbers", {
    "/complex-numbers": "home", "/complex-numbers/argand-plane": "argand-plane",
    "/complex-numbers/arithmetic": "arithmetic", "/complex-numbers/polar-forms": "polar-forms",
    "/complex-numbers/rotation": "rotation", "/complex-numbers/roots": "roots",
    "/complex-numbers/euler": "euler", "/complex-numbers/loci": "loci",
    "/complex-numbers/fractals": "fractals", "/complex-numbers/waves-circuits": "waves-circuits",
  }),
  ...add("algebra", {
    "/algebra": "home", "/algebra/expressions": "expressions", "/algebra/equations": "equations",
    "/algebra/functions": "functions", "/algebra/polynomials": "polynomials", "/algebra/systems": "systems",
    "/algebra/exponents-logs": "exponents", "/algebra/sequences": "sequences", "/algebra/proof": "proof",
    "/algebra/cas": "cas", "/algebra/advanced": "advanced", "/algebra/classic": "classic",
  }),
  ...add("algebraic-structures", {
    "/algebraic-structures": "home", "/algebraic-structures/structure-test": "structure-test",
    "/algebraic-structures/cayley-tables": "cayley-tables", "/algebraic-structures/semigroups-monoids": "semigroups-monoids",
    "/algebraic-structures/posets-lattices": "posets-lattices", "/algebraic-structures/boolean-algebra": "boolean-algebra",
  }),
  ...add("number-systems", {
    "/number-systems": "home", "/number-systems/rational": "rational", "/number-systems/irrational": "irrational",
    "/number-systems/real-line": "real-line", "/number-systems/hierarchy": "hierarchy",
    "/number-systems/concepts": "concepts", "/number-systems/practice": "practice",
  }),
  ...add("calculus", {
    "/calculus": "home", "/calculus/limits": "limits", "/calculus/derivatives": "derivatives",
    "/calculus/derivative-applications": "derivative-applications", "/calculus/integration": "integration",
    "/calculus/integration-techniques": "integration-techniques", "/calculus/integral-applications": "integral-applications",
    "/calculus/differential-equations": "differential-equations", "/calculus/series-parametric-polar": "series-parametric-polar",
    "/calculus/multivariable-vector": "multivariable-vector", "/calculus/jacobians-coordinate-transformations": "jacobians",
    "/calculus/beta-gamma": "beta-gamma", "/calculus/series-tests": "series-tests",
    "/calculus/curve-tracing": "curve-tracing", "/calculus/taylor-two-variables": "taylor-two-variables",
    "/calculus/lagrange-multipliers": "lagrange-multipliers", "/calculus/change-order-integration": "change-order",
    "/calculus/centroid-center-of-mass": "centroid", "/calculus/moments-of-inertia": "moments-of-inertia",
    "/calculus/multiple-integral-applications": "integral-engineering", "/calculus/advanced": "advanced",
  }),
  ...add("advanced-concepts", {
    "/math-lab/continued-fractions": "continued-fractions", "/math-lab/famous-problems": "famous-problems",
    "/math-lab/stats-inference": "stats-inference", "/math-lab/differential-equations": "differential-equations",
    "/math-lab/special-functions": "special-functions",
  }),
  ...add("statistics-extended", {
    "/probability-statistics/survey-sampling": "survey-sampling",
    "/probability-statistics/design-of-experiments": "design-of-experiments",
    "/probability-statistics/quality-control": "quality-control",
    "/probability-statistics/time-series": "time-series",
    "/probability-statistics/nonparametric": "nonparametric",
    "/probability-statistics/multivariate-analysis": "multivariate-analysis",
    "/probability-statistics/advanced-inference": "advanced-inference",
    "/probability-statistics/official-statistics": "official-statistics",
    "/probability-statistics/survival-analysis": "survival-analysis",
    "/probability-statistics/actuarial-reliability": "actuarial-reliability",
    "/probability-statistics/statistical-computing": "statistical-computing",
    "/probability-statistics/applied-modelling": "applied-modelling",
    "/probability-statistics/school-statistics": "school-statistics",
  }),
  ...add("statistics-phase", {
    "/probability-statistics/module": "module", "/probability-statistics/distributions": "distributions",
    "/probability-statistics/sampling": "sampling", "/probability-statistics/inference": "inference",
    "/probability-statistics/regression": "regression", "/probability-statistics/bayesian": "bayesian",
    "/probability-statistics/stochastic": "stochastic", "/probability-statistics/advanced-models": "advanced-models",
  }),
};

export default function StandaloneStudioTheory() {
  const location = useLocation();
  const baseRoute = standaloneStudioTheoryRoutes[location.pathname.replace(/\/$/, "") || "/"];
  const shape = new URLSearchParams(location.search).get("shape");
  const route = baseRoute?.studioId === "geometry" && shape === "segment"
    ? { ...baseRoute, pageId: "segment", label: labelFor("segment") }
    : baseRoute;
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useDialogFocus(open, dialogRef, triggerRef);
  useEffect(() => setOpen(false), [location.pathname]);
  if (!route || !studioTheoryContent[route.studioId]?.[route.pageId]) return null;
  const mode = new URLSearchParams(location.search).get("mode");
  return <>
    <button ref={triggerRef} type="button" className="studio-theory-fab" onClick={() => setOpen(true)}><BookOpenCheck aria-hidden="true" /> Theory &amp; Simple words</button>
    {open && <div className="studio-theory-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section ref={dialogRef} className="studio-theory-drawer" role="dialog" aria-modal="true" aria-label={`${route.label} theory and simple words`} tabIndex={-1}>
        <header><span>{route.label}</span><button type="button" onClick={() => setOpen(false)} aria-label="Close theory"><X /></button></header>
        <StudioTheoryPanel studioId={route.studioId} page={{ id: route.pageId, label: route.label, modes: mode ? [mode] : [] }} mode={mode} />
      </section>
    </div>}
  </>;
}
