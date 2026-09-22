import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { studioRoutes } from "../pages/calculusStudioSession";
import { studioMockups } from "./mockup/studioMockupCatalog";

/** Developer coverage map. Not shown in the learner interface. */
const topics: Array<{ area: string; topic: string; route: string }> = [
  { area: "Calculus", topic: "Infinite series and convergence tests", route: "/calculus/series-tests" },
  { area: "Calculus", topic: "Curve tracing", route: "/calculus/curve-tracing" },
  { area: "Calculus", topic: "Partial derivatives", route: "/calculus/multivariable-vector" },
  { area: "Calculus", topic: "Lagrange multipliers", route: "/calculus/lagrange-multipliers" },
  { area: "Calculus", topic: "Jacobians", route: "/calculus/jacobians-coordinate-transformations" },
  { area: "Calculus", topic: "Multiple integrals", route: "/calculus/multiple-integral-applications" },
  { area: "Calculus", topic: "Change of order", route: "/calculus/change-order-integration" },
  { area: "Calculus", topic: "Centroid and center of mass", route: "/calculus/centroid-center-of-mass" },
  { area: "Calculus", topic: "Moments of inertia", route: "/calculus/moments-of-inertia" },
  { area: "Calculus", topic: "Beta and Gamma", route: "/calculus/beta-gamma" },
  { area: "Calculus", topic: "Taylor expansion in two variables", route: "/calculus/taylor-two-variables" },
  { area: "Calculus", topic: "Legacy differential equations page", route: "/calculus/differential-equations" },
  { area: "Differential equations", topic: "Method selector", route: "/differential-equations/method-selector" },
  { area: "Differential equations", topic: "Separable", route: "/differential-equations/separable" },
  { area: "Differential equations", topic: "Homogeneous first-order", route: "/differential-equations/homogeneous-first-order" },
  { area: "Differential equations", topic: "Exact", route: "/differential-equations/exact" },
  { area: "Differential equations", topic: "Linear first-order", route: "/differential-equations/linear-first-order" },
  { area: "Differential equations", topic: "Bernoulli", route: "/differential-equations/bernoulli" },
  { area: "Differential equations", topic: "Higher-order linear", route: "/differential-equations/higher-order-linear" },
  { area: "Differential equations", topic: "Undetermined coefficients", route: "/differential-equations/undetermined-coefficients" },
  { area: "Differential equations", topic: "Variation of parameters", route: "/differential-equations/variation-of-parameters" },
  { area: "Differential equations", topic: "Cauchy-Euler", route: "/differential-equations/cauchy-euler" },
  { area: "Differential equations", topic: "Systems", route: "/differential-equations/systems" },
  { area: "Differential equations", topic: "Trajectory plane", route: "/differential-equations/phase-plane" },
  { area: "Differential equations", topic: "Numerical comparison", route: "/differential-equations/heun" },
  { area: "Differential equations", topic: "Euler", route: "/differential-equations/euler" },
  { area: "Differential equations", topic: "RK4", route: "/differential-equations/rk4" },
  { area: "Differential equations", topic: "Growth", route: "/differential-equations/growth-models" },
  { area: "Differential equations", topic: "Newton cooling", route: "/differential-equations/newton-cooling" },
  { area: "Differential equations", topic: "Mechanical oscillations", route: "/differential-equations/mechanical-oscillations" },
  { area: "Differential equations", topic: "LCR", route: "/differential-equations/lcr-circuit" },
  { area: "Linear algebra", topic: "Cayley-Hamilton", route: "/linear-algebra/cayley-hamilton" },
  { area: "Linear algebra", topic: "Row reduction", route: "/linear-algebra/row-reduction" },
  { area: "Linear algebra", topic: "Eigenvectors", route: "/linear-algebra/eigenvectors" },
  { area: "Linear algebra", topic: "Diagonalization", route: "/linear-algebra/diagonalization" },
  { area: "Linear algebra", topic: "Quadratic forms", route: "/linear-algebra/quadratic-forms" },
  { area: "Linear algebra", topic: "Principal axes", route: "/linear-algebra/principal-axes" },
  { area: "Linear algebra", topic: "Orthogonality", route: "/linear-algebra/orthogonality" },
  { area: "Linear algebra", topic: "Least squares", route: "/linear-algebra/least-squares" },
  { area: "Linear algebra", topic: "Factorizations", route: "/linear-algebra/matrix-factorizations" },
  { area: "Linear algebra", topic: "Similarity", route: "/linear-algebra/similarity" },
  { area: "Linear algebra", topic: "Jordan form", route: "/linear-algebra/jordan-form" },
];

describe("engineering studio coverage", () => {
  const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
  const calculusRoutes = new Set(Object.values(studioRoutes));
  const catalogRoutes = new Set(
    [...studioMockups["differential-equations"].pages, ...studioMockups["linear-algebra"].pages].map((page) => page.route),
  );

  it("registers every audited topic on a real route", () => {
    expect(topics.length).toBeGreaterThanOrEqual(40);
    for (const topic of topics) {
      const path = topic.route.split("?")[0];
      if (path.startsWith("/calculus/")) expect(calculusRoutes.has(path), topic.topic).toBe(true);
      else expect(catalogRoutes.has(path), topic.topic).toBe(true);
      const slug = path.split("/").at(-1) ?? "";
      expect(app.includes(`"${slug}"`) || app.includes(`calculus/${slug}`), topic.topic).toBe(true);
    }
  });
});
