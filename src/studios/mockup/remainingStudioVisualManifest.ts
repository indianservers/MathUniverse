import { studioMockups, type StudioMockupPage } from "./studioMockupCatalog";

export const REMAINING_STUDIO_IDS = [
  "algebra",
  "calculus",
  "linear-algebra",
  "complex-numbers",
  "modelling",
  "discrete",
] as const;

export type RemainingStudioId = (typeof REMAINING_STUDIO_IDS)[number];

export const PROTECTED_STUDIO_IDS = ["geometry", "trigonometry"] as const;
export type ProtectedStudioId = (typeof PROTECTED_STUDIO_IDS)[number];

export type RemainingStudioTarget = {
  studio: RemainingStudioId;
  pageId: string;
  route: string;
  title: string;
  modes: string[];
};

export type ProtectedStudioTarget = {
  studio: ProtectedStudioId;
  pageId: string;
  route: string;
  title: string;
  modes: string[];
};

const ALGEBRA_TARGETS: RemainingStudioTarget[] = [
  { studio: "algebra", pageId: "home", route: "/algebra", title: "Welcome to Algebra Studio", modes: [] },
  { studio: "algebra", pageId: "expressions", route: "/algebra/expressions", title: "Expressions & Algebra Tiles Lab", modes: ["Simplify", "Expand", "Factor", "Combine Terms"] },
  { studio: "algebra", pageId: "equations", route: "/algebra/equations", title: "Equations & Inequalities Lab", modes: ["Linear", "Quadratic", "Absolute Value", "Inequalities"] },
  { studio: "algebra", pageId: "functions", route: "/algebra/functions", title: "Functions & Transformations Lab", modes: ["Families", "Transformations", "Composition", "Inverse", "Piecewise"] },
  { studio: "algebra", pageId: "polynomials", route: "/algebra/polynomials", title: "Polynomials Lab", modes: ["Roots", "Factors", "Division", "End Behavior", "Multiplicity"] },
  { studio: "algebra", pageId: "systems", route: "/algebra/systems", title: "Systems of Equations Lab", modes: ["Graphing", "Substitution", "Elimination", "Matrices", "Inequalities"] },
  { studio: "algebra", pageId: "exponents", route: "/algebra/exponents-logs", title: "Exponents Radicals & Logarithms Lab", modes: ["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"] },
  { studio: "algebra", pageId: "sequences", route: "/algebra/sequences", title: "Sequences & Progressions Lab", modes: ["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"] },
  { studio: "algebra", pageId: "proof", route: "/algebra/proof", title: "Algebraic Proof Lab", modes: ["Identities", "Equation Proof", "Induction", "Inequality", "Counterexample"] },
  { studio: "algebra", pageId: "cas", route: "/algebra/cas", title: "CAS Step Explorer", modes: ["Solve", "Simplify", "Factor", "Expand", "Substitute", "Differentiate"] },
];

const CALCULUS_TARGETS: RemainingStudioTarget[] = [
  { studio: "calculus", pageId: "home", route: "/calculus", title: "Welcome to Calculus Studio", modes: [] },
  { studio: "calculus", pageId: "limits", route: "/calculus/limits", title: "Limits & Continuity Studio", modes: ["limits", "continuity", "discontinuities", "asymptotes", "lhopital"] },
  { studio: "calculus", pageId: "derivatives", route: "/calculus/derivatives", title: "Derivatives Studio", modes: ["tangent", "rules", "chain", "implicit", "higher", "linearization"] },
  { studio: "calculus", pageId: "derivative-applications", route: "/calculus/derivative-applications", title: "Derivative Applications Studio", modes: ["motion", "related", "curve", "optimization", "mvt"] },
  { studio: "calculus", pageId: "integration", route: "/calculus/integration", title: "Integration & Accumulation Studio", modes: ["antiderivative", "definite", "ftc", "riemann", "numerical"] },
  { studio: "calculus", pageId: "integration-techniques", route: "/calculus/integration-techniques", title: "Integration Techniques Studio", modes: ["substitution", "parts", "partial", "trig", "trig-sub", "improper"] },
  { studio: "calculus", pageId: "integral-applications", route: "/calculus/integral-applications", title: "Integral Applications Studio", modes: ["area", "volumes", "arc", "surface", "work", "fluid"] },
  { studio: "calculus", pageId: "differential-equations", route: "/calculus/differential-equations", title: "Differential Equations Studio", modes: ["slope", "ivp", "separable", "growth", "euler", "rk4"] },
  { studio: "calculus", pageId: "series-parametric-polar", route: "/calculus/series-parametric-polar", title: "Series, Parametric & Polar Studio", modes: ["sequences", "convergence", "power", "taylor", "parametric", "polar"] },
  { studio: "calculus", pageId: "multivariable-vector", route: "/calculus/multivariable-vector", title: "Multivariable & Vector Calculus Studio", modes: ["partial", "gradient", "plane", "optimization", "multiple", "fields", "theorems"] },
];

function fromCatalog(studioId: RemainingStudioId, catalogId: keyof typeof studioMockups): RemainingStudioTarget[] {
  const def = studioMockups[catalogId];
  return def.pages
    .filter((page) => page.id !== "ar")
    .map((page) => ({
      studio: studioId,
      pageId: page.id,
      route: page.route,
      title: page.title,
      modes: page.modes,
    }));
}

export const remainingStudioTargets: RemainingStudioTarget[] = [
  ...ALGEBRA_TARGETS,
  ...CALCULUS_TARGETS,
  ...fromCatalog("linear-algebra", "linear-algebra"),
  ...fromCatalog("complex-numbers", "complex-numbers"),
  ...fromCatalog("modelling", "modelling"),
  ...fromCatalog("discrete", "discrete"),
];

export const protectedStudioTargets: ProtectedStudioTarget[] = [
  ...studioMockups.geometry.pages.filter((page) => page.id !== "ar").map((page) => catalogProtect("geometry", page)),
  ...studioMockups.trigonometry.pages.filter((page) => page.id !== "ar").map((page) => catalogProtect("trigonometry", page)),
];

function catalogProtect(studio: ProtectedStudioId, page: StudioMockupPage): ProtectedStudioTarget {
  return {
    studio,
    pageId: page.id,
    route: page.route,
    title: page.title,
    modes: page.modes,
  };
}

export type RemainingStudioModeSlot = RemainingStudioTarget & { mode: string | null };

export function remainingStudioModeSlots(): RemainingStudioModeSlot[] {
  return remainingStudioTargets.flatMap((target) => {
    if (!target.modes.length) return [{ ...target, mode: null }];
    return target.modes.map((mode) => ({ ...target, mode }));
  });
}

export function protectedStudioModeSlots() {
  return protectedStudioTargets.flatMap((target) => {
    if (!target.modes.length) return [{ ...target, mode: null }];
    return target.modes.map((mode) => ({ ...target, mode }));
  });
}

export const EXCLUDED_FROM_RESTORATION = [
  "/algebra/advanced",
  "/calculus/advanced",
  "/geometry/ar",
  "/trigonometry/ar",
  "/probability-statistics",
] as const;

export const REMAINING_STUDIO_PAGE_COUNT = 63;
export const PROTECTED_HOME_ROUTES = ["/geometry", "/trigonometry"] as const;
export const PROTECTED_LAB_SAMPLES = [
  "/geometry/triangles",
  "/geometry/circles",
  "/trigonometry/unit-circle",
  "/trigonometry/right-triangle",
] as const;

/** Full screenshot folders for Algebra, Calculus, Linear Algebra, Complex, and Discrete are not in this workspace. Modelling mockups live in /workspace/tmp-modelling-mockups. */
