import { describe, expect, it } from "vitest";
import { formulaVisualizerCategoryRouteMap, formulaVisualizerConfigs, getFormulaVisualizerForFormulaCategory, visualFormulaMenuLinks } from "./formulaVisualizerRoutes";

const phase3Routes = [
  "/math/limits-continuity/formula-visualizer",
  "/math/differential-equations/formula-visualizer",
  "/determinants/formula-visualizer",
  "/three-d-geometry/formula-visualizer",
  "/early-number-sense/formula-visualizer",
  "/fractions-decimals-percent/formula-visualizer",
  "/commercial-math/formula-visualizer",
  "/speed-time-work/formula-visualizer",
  "/mental-math/formula-visualizer",
  "/pre-algebra/formula-visualizer",
  "/number-theory/formula-visualizer",
  "/euclidean-geometry/formula-visualizer",
  "/analytic-geometry/formula-visualizer",
  "/precalculus/formula-visualizer",
  "/calculus-applications/formula-visualizer",
  "/multivariable-calculus/formula-visualizer",
  "/linear-algebra/formula-visualizer",
  "/abstract-algebra/formula-visualizer",
  "/real-analysis/formula-visualizer",
  "/complex-analysis/formula-visualizer",
  "/topology/formula-visualizer",
  "/differential-geometry/formula-visualizer",
  "/discrete-math/formula-visualizer",
  "/optimization/formula-visualizer",
  "/numerical-methods/formula-visualizer",
  "/dynamical-systems/formula-visualizer",
  "/pde/formula-visualizer",
  "/fourier-laplace/formula-visualizer",
  "/mathematical-physics/formula-visualizer",
  "/information-theory/formula-visualizer",
  "/machine-learning-math/formula-visualizer",
  "/cryptography-math/formula-visualizer",
];

describe("formula visualizer route registry", () => {
  it("contains every Phase 3 route exactly once", () => {
    const routes = formulaVisualizerConfigs.map((config) => config.route);
    expect(new Set(routes).size).toBe(routes.length);
    phase3Routes.forEach((route) => expect(routes).toContain(route));
  });

  it("keeps each visualizer interactive and non-empty", () => {
    formulaVisualizerConfigs.forEach((config) => {
      expect(config.formulas.length).toBeGreaterThanOrEqual(7);
      expect(config.defaultFormulaId).toBeTruthy();
      expect(config.formulas.some((formula) => formula.id === config.defaultFormulaId)).toBe(true);
      expect(config.searchTerms.join(" ")).toMatch(/visualizer/i);
      expect(config.route.endsWith("/formula-visualizer") || config.route.startsWith("/visual-formulas/")).toBe(true);
    });
  });

  it("keeps formula library and menu links aligned to real visualizer routes", () => {
    const routes = new Set(formulaVisualizerConfigs.map((config) => config.route));
    visualFormulaMenuLinks.forEach((link) => expect(routes.has(link.route)).toBe(true));
    Object.values(formulaVisualizerCategoryRouteMap).forEach((route) => expect(routes.has(route)).toBe(true));
    formulaVisualizerConfigs.forEach((config) => {
      expect(getFormulaVisualizerForFormulaCategory(config.id)).toBe(config.route);
    });
  });

  it("has teacher support on requested classroom-heavy concepts", () => {
    ["early-number-sense", "fractions-decimals-percent", "algebra", "geometry", "derivatives", "integration", "probability", "statistics", "linear-algebra", "machine-learning-math"].forEach((id) => {
      const config = formulaVisualizerConfigs.find((item) => item.id === id);
      expect(config, id).toBeTruthy();
      expect(config?.teacherNotes, id).toBeTruthy();
    });
  });
});
